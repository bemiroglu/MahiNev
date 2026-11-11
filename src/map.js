/* Dünya haritası (v0.3). Eş-dikdörtgen izdüşüm, Canvas.
 * Akşam modu: her noktanın kendi gurûbunda değerlendirme; sınıf her piksel için, ızgara değerlerinin ara değerinden bulunur.
 *   katmanlar: seadet (Tam İlmihâl’in sınıfları) · first (ilk görünürlük akşamı) · yallop · odeh (ek bilgi)
 * Anlık mod: seçili anda gece-gündüz sınırı, alacakaranlık, ☀ ve ☾ noktaları, ayın ufku, şu an aranabilir bölge. */
(function (G) {
  'use strict';
  const LAT_TOP = 80, LAT_BOT = -60;
  const cache = new Map();
  const tok = n => getComputedStyle(document.body).getPropertyValue(n).trim() || '#888';
  const rad = d => d * Math.PI / 180;
  function rgb(c) {
    const cv = rgb.cv || (rgb.cv = document.createElement('canvas').getContext('2d'));
    cv.fillStyle = '#000'; cv.fillStyle = c; const h = cv.fillStyle;
    if (h[0] === '#') { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
    const m = h.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [128, 128, 128];
  }

  // ---- ızgara (satır satır, arayüzü dondurmadan) ----
  function grid(key, res, fn, onProg) {
    if (cache.has(key)) return Promise.resolve(cache.get(key));
    const lats = [], lons = [];
    for (let la = LAT_TOP - res / 2; la > LAT_BOT; la -= res) lats.push(la);
    for (let lo = -180 + res / 2; lo < 180; lo += res) lons.push(lo);
    const rows = [];
    return new Promise(resolve => {
      let i = 0;
      const step = () => {
        const t0 = performance.now();
        while (i < lats.length && performance.now() - t0 < 40) { rows.push(lons.map(lo => fn(lats[i], lo))); i++; }
        if (onProg) onProg(i / lats.length);
        if (i < lats.length) setTimeout(step, 0);
        else { const g = { res, lats, lons, rows }; cache.set(key, g); resolve(g); }
      };
      step();
    });
  }
  // Izgara üzerinde ara değer: köşelerden biri eksikse en yakın köşe
  function sampler(g) {
    const n = g.lats.length, m = g.lons.length, r = g.res;
    return (lat, lon) => {
      let fi = (LAT_TOP - r / 2 - lat) / r, fj = (lon + 180 - r / 2) / r;
      fi = Math.max(0, Math.min(n - 1, fi)); fj = Math.max(0, Math.min(m - 1, fj));
      const i0 = Math.floor(fi), j0 = Math.floor(fj), i1 = Math.min(n - 1, i0 + 1), j1 = Math.min(m - 1, j0 + 1), wi = fi - i0, wj = fj - j0;
      const c00 = g.rows[i0][j0], c01 = g.rows[i0][j1], c10 = g.rows[i1][j0], c11 = g.rows[i1][j1];
      const near = wi < 0.5 ? (wj < 0.5 ? c00 : c01) : (wj < 0.5 ? c10 : c11);
      const lerp = k => { const a = c00[k], b = c01[k], c = c10[k], d = c11[k]; if (a == null || b == null || c == null || d == null) return near[k]; return (a * (1 - wj) + b * wj) * (1 - wi) + (c * (1 - wj) + d * wj) * wi; };
      return { near, v: lerp };
    };
  }
  // Sınıf kodları: 1 görülebilir · 2 mümkün · 3 5° altı · 4 8° altı · 5 doğmamış/yok · 6 güneş batmıyor · 7 gece/ay ortası
  function classSeadet(S, lat, lon) {
    const s = S(lat, lon); if (s.near.code === 'noSunset') return 6;
    const age = s.v('ageH'), up = s.v('up'), el = s.v('elong'), al = s.v('alt');
    if (age == null || age < 0 || age > 96 || up <= 0) return 5;
    if (el < 8) return 4; if (al < 5) return 3; if (el < 18) return 2; return 1;
  }
  function classModern(S, lat, lon, kind) {
    const s = S(lat, lon); if (s.near.code === 'noSunset') return 6;
    const x = s.v(kind === 'yallop' ? 'q' : 'V'), ag = s.v('ageH'); if (x == null || ag == null || ag < 0 || ag > 96) return 5;
    if (kind === 'yallop') return x > 0.216 ? 1 : x > -0.014 ? 2 : x > -0.160 ? 3 : x > -0.232 ? 4 : 5;
    return x >= 5.65 ? 1 : x >= 2 ? 2 : x >= -0.96 ? 3 : 5;
  }
  function classFirst(Ss, lat, lon) {
    for (let k = 0; k < Ss.length; k++) { const c = classSeadet(Ss[k], lat, lon); if (c === 6) return 6; if (c === 1 || c === 2) return 1 + k; }
    return 5;
  }

  // ---- kıyılar (tarih çizgisini kesen halkalar açılır) ----
  function unwrapRing(r) {
    const out = []; let off = 0, prev = null, jumped = false;
    for (let i = 0; i < r.length; i += 2) { const lo = r[i] / 5, la = r[i + 1] / 5; if (prev != null) { const d = lo + off - prev; if (d > 180) { off -= 360; jumped = true; } else if (d < -180) { off += 360; jumped = true; } } out.push([lo + off, la]); prev = lo + off; }
    return { pts: out, jumped };
  }
  const RINGS = () => (G.__hrRings || (G.__hrRings = G.HR_LAND.map(unwrapRing)));
  const BORDERS = () => (G.__hrBorders || (G.__hrBorders = G.HR_BORDERS.map(unwrapRing)));
  function ringPath(ctx, x, y, ring, shift, close) { ctx.beginPath(); ring.pts.forEach(([lo, la], i) => { const X = x(lo + shift), Y = y(la); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); if (close) ctx.closePath(); }
  function landPath(ctx, x, y) { ctx.beginPath(); for (const r of RINGS()) for (const sh of r.jumped ? [0, 360, -360] : [0]) { r.pts.forEach(([lo, la], i) => { const X = x(lo + sh), Y = y(la); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); } }

  // Pürüzsüz eş-yaş çizgileri: ızgara 3 kat sıklaştırılıp eş-değer eğrileri çıkarılır
  function isolines(g, step) {
    const S = sampler(g), f = 3, r = g.res / f;
    const lats = [], lons = [];
    for (let la = LAT_TOP - g.res / 2; la >= LAT_BOT + g.res / 2 - 1e-9; la -= r) lats.push(la);
    for (let lo = -180 + g.res / 2; lo <= 180 - g.res / 2 + 1e-9; lo += r) lons.push(lo);
    const V = lats.map(la => lons.map(lo => { const s = S(la, lo); return s.near.code === 'noSunset' ? null : s.v('ageH'); }));
    const segs = [], labels = new Map();
    for (let i = 0; i < lats.length - 1; i++) for (let j = 0; j < lons.length - 1; j++) {
      const q = [V[i][j], V[i][j + 1], V[i + 1][j + 1], V[i + 1][j]];
      if (q.some(v => v == null)) continue;
      const lo = Math.min(...q), hi = Math.max(...q); if (hi - lo > 10) continue;
      const P = [[lats[i], lons[j]], [lats[i], lons[j + 1]], [lats[i + 1], lons[j + 1]], [lats[i + 1], lons[j]]];
      for (let L = Math.ceil(lo / step) * step; L <= hi; L += step) {
        if (L <= 0) continue;
        const pts = [];
        for (let e = 0; e < 4; e++) { const a = q[e], b = q[(e + 1) % 4]; if ((a - L) * (b - L) < 0) { const t = (L - a) / (b - a); pts.push([P[e][0] + (P[(e + 1) % 4][0] - P[e][0]) * t, P[e][1] + (P[(e + 1) % 4][1] - P[e][1]) * t]); } }
        if (pts.length >= 2) { segs.push([pts[0], pts[1], L]); if (Math.abs(lats[i]) <= r && !labels.has(L)) labels.set(L, pts[0]); }
      }
    }
    return { segs, labels };
  }

  function mount(el) {
    el.innerHTML = '<div class="mapbox"><canvas></canvas><div class="mapprog" hidden></div><div class="mapmsg" hidden></div></div>';
    const cv = el.querySelector('canvas'), prog = el.querySelector('.mapprog'), msg = el.querySelector('.mapmsg');
    let last = null, pickCb = null, seq = 0;
    function size() { const w = Math.max(280, Math.round(el.clientWidth || 640)); const h = Math.round(w * (LAT_TOP - LAT_BOT) / 360); const d = window.devicePixelRatio || 1; cv.width = Math.round(w * d); cv.height = Math.round(h * d); cv.style.width = w + 'px'; cv.style.height = h + 'px'; return { w, h, d }; }
    const proj = (w, h) => ({ x: lon => (lon + 180) / 360 * w, y: lat => (LAT_TOP - lat) / (LAT_TOP - LAT_BOT) * h });

    async function render(p) {
      const my = ++seq; last = p;
      msg.hidden = !p.message; msg.textContent = p.message || '';
      if (p.mode === 'instant') { prog.hidden = true; paint(p, null); return; }
      prog.hidden = false; prog.textContent = '…';
      const onP = f => { prog.textContent = Math.round(f * 100) + '%'; };
      let grids;
      if (p.layer === 'first') {
        const cd = p.conj.date, base = Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate());
        grids = [];
        for (let k = 0; k < 4; k++) {
          const day = base + k * 86400000;
          grids.push(await grid(['ev', p.res, day, p.conj.ut.toFixed(4), 0].join('|'), p.res, (la, lo) => G.HRCore.cell(la, lo, day, p.conj, false), f => onP((k + f) / 4)));
          if (my !== seq) return;
        }
      } else {
        const modern = p.layer === 'yallop' || p.layer === 'odeh';
        grids = [await grid(['ev', p.res, p.dayUTC, p.conj.ut.toFixed(4), modern ? 1 : 0].join('|'), p.res, (la, lo) => G.HRCore.cell(la, lo, p.dayUTC, p.conj, modern), onP)];
      }
      if (my !== seq) return;
      prog.hidden = true;
      paint(p, grids);
    }

    function paint(p, grids) {
      const { w, h, d } = size(); const ctx = cv.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
      const { x, y } = proj(w, h);
      ctx.fillStyle = tok('--map-sea'); ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = tok('--map-land'); landPath(ctx, x, y); ctx.fill('nonzero');
      // sınıf görüntüsü (CSS pikseli çözünürlüğünde)
      const W = Math.round(w), H = Math.round(h);
      const img = new ImageData(W, H), cls = new Uint8Array(W * H);
      let pal, alpha;
      if (p.mode === 'instant') {
        const I = G.HRCore.instant(p.t), thr = G.HRCore.DARK[p.darkKey] != null ? G.HRCore.DARK[p.darkKey] : -0.8333;
        const ageOk = I.ageH != null && I.ageH > 0 && I.ageH < 96, elOk = I.elong >= 8;
        const night = rgb(tok('--map-night')), dayc = rgb(tok('--map-day')), srch = rgb(tok('--c-visible')), low = rgb(tok('--c-below5'));
        for (let py = 0; py < H; py++) {
          const lat = LAT_TOP - (py + 0.5) / H * (LAT_TOP - LAT_BOT);
          for (let px = 0; px < W; px++) {
            const lon = (px + 0.5) / W * 360 - 180, k = py * W + px, o = k * 4;
            const sa = G.HRCore.altFast(I.sun.ra, I.sun.dec, I.gast, lat, lon);
            let ma = G.HRCore.altFast(I.moon.ra, I.moon.dec, I.gast, lat, lon);
            ma = ma - I.hp * Math.cos(rad(ma)); if (ma > -1) ma += (1 / Math.tan(rad(ma + 7.31 / (ma + 4.4)))) / 60;
            let c = 0;
            if (sa <= thr && ageOk && elOk && ma >= 5) c = 1; else if (sa <= thr && ageOk && elOk && ma >= 0) c = 3;
            cls[k] = c + (sa > -0.8333 ? 0 : 10) + (ma > 0 ? 20 : 0);
            const dark = sa > -0.8333 ? 0 : Math.min(0.62, 0.12 + (-sa / 18) * 0.5);
            if (c === 1) { img.data.set([srch[0], srch[1], srch[2], 175], o); }
            else if (c === 3) { img.data.set([low[0], low[1], low[2], 150], o); }
            else if (sa > -0.8333) { img.data.set([dayc[0], dayc[1], dayc[2], 46], o); }
            else { img.data.set([night[0], night[1], night[2], Math.round(dark * 255)], o); }
          }
        }
        // sınırlar: gece-gündüz (vurgu rengi), ayın ufku (kesik görünümlü, açık renk)
        const edgeSun = rgb(tok('--accent')), edgeMoon = rgb(tok('--map-iso')), edgeS = rgb(tok('--c-visible'));
        for (let py = 0; py < H - 1; py++) for (let px = 0; px < W - 1; px++) {
          const k = py * W + px, a = cls[k], r = cls[k + 1], b = cls[k + W], o = k * 4;
          if (((a % 20 >= 10) !== (r % 20 >= 10)) || ((a % 20 >= 10) !== (b % 20 >= 10))) img.data.set([edgeSun[0], edgeSun[1], edgeSun[2], 255], o);
          else if (((a >= 20) !== (r >= 20) || (a >= 20) !== (b >= 20)) && ((px + py) % 6 < 3)) img.data.set([edgeMoon[0], edgeMoon[1], edgeMoon[2], 230], o);
          else if (((a % 10 === 1) !== (r % 10 === 1)) || ((a % 10 === 1) !== (b % 10 === 1))) img.data.set([edgeS[0], edgeS[1], edgeS[2], 255], o);
        }
        p._inst = I;
        alpha = 1;
      } else {
        const Ss = grids.map(sampler);
        const fn = p.layer === 'first' ? (la, lo) => classFirst(Ss, la, lo) : p.layer === 'seadet' ? (la, lo) => classSeadet(Ss[0], la, lo) : (la, lo) => classModern(Ss[0], la, lo, p.layer);
        pal = [null, '--c-visible', '--c-possible', '--c-below5', '--c-below8', '--c-notborn', '--c-nosun'].map(n => n && rgb(tok(n)));
        for (let py = 0; py < H; py++) { const lat = LAT_TOP - (py + 0.5) / H * (LAT_TOP - LAT_BOT); for (let px = 0; px < W; px++) cls[py * W + px] = fn(lat, (px + 0.5) / W * 360 - 180); }
        const fade = p.layer === 'seadet' || p.layer === 'first' ? 5 : 99;
        for (let k = 0; k < W * H; k++) { const c = cls[k]; if (!c) continue; const o = k * 4, col = pal[c]; img.data[o] = col[0]; img.data[o + 1] = col[1]; img.data[o + 2] = col[2]; img.data[o + 3] = c === fade ? 70 : c === 6 ? 120 : 165; }
        const edge = rgb(tok('--map-edge'));
        for (let py = 0; py < H - 1; py++) for (let px = 0; px < W - 1; px++) { const k = py * W + px, a = cls[k]; if (a !== cls[k + 1] || a !== cls[k + W]) img.data.set([edge[0], edge[1], edge[2], 200], k * 4); }
        alpha = p.mini ? 0.95 : 0.9;
      }
      const off = document.createElement('canvas'); off.width = W; off.height = H; off.getContext('2d').putImageData(img, 0, 0);
      ctx.save();
      if (p.landOnly && p.mode !== 'instant') { landPath(ctx, x, y); ctx.clip('nonzero'); }
      ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, w, h);
      ctx.restore();
      // kıyılar, sınırlar, ekvator
      ctx.strokeStyle = tok('--map-coast'); ctx.lineWidth = p.mini ? 0.5 : 0.7;
      for (const r of RINGS()) for (const sh of r.jumped ? [0, 360, -360] : [0]) { ringPath(ctx, x, y, r, sh, true); ctx.stroke(); }
      if (p.borders && !p.mini) { ctx.strokeStyle = tok('--map-border'); ctx.lineWidth = 0.4; for (const r of BORDERS()) for (const sh of r.jumped ? [0, 360, -360] : [0]) { ringPath(ctx, x, y, r, sh, false); ctx.stroke(); } }
      ctx.strokeStyle = tok('--map-border'); ctx.lineWidth = 0.5; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(0, y(0)); ctx.lineTo(w, y(0)); ctx.stroke(); ctx.setLineDash([]);
      // eş-yaş çizgileri
      if (p.mode !== 'instant' && p.age && p.layer !== 'first' && grids) {
        const iso = isolines(grids[0], 2);
        ctx.strokeStyle = tok('--map-iso'); ctx.globalAlpha = 0.75; ctx.lineWidth = 0.8; ctx.beginPath();
        for (const [a, b] of iso.segs) { ctx.moveTo(x(a[1]), y(a[0])); ctx.lineTo(x(b[1]), y(b[0])); }
        ctx.stroke(); ctx.globalAlpha = 1;
        ctx.font = '600 10.5px ' + tok('--font-mono'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const [L, pt] of iso.labels) { if (L % 4) continue; const X = x(pt[1]), Y = y(0); ctx.fillStyle = tok('--map-label-bg'); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - 12, Y - 8, 24, 16, 4) : ctx.rect(X - 12, Y - 8, 24, 16); ctx.fill(); ctx.fillStyle = tok('--map-iso'); ctx.fillText(String(L), X, Y + 0.5); }
      }
      // 18° anında güneşin battığı boylam (s. 360)
      if (p.mode !== 'instant' && p.m18 && p.layer !== 'first') {
        ctx.strokeStyle = tok('--accent'); ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]); ctx.beginPath(); let st = false;
        for (let la = 66; la >= -58; la -= 1) { const lon = G.HRCore.sunsetLon(p.m18.t, la); if (lon == null) { st = false; continue; } const X = x(lon), Y = y(la); if (!st) { ctx.moveTo(X, Y); st = true; } else ctx.lineTo(X, Y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      // anlık mod: ☀ ve ☾ noktaları
      const marks = (p.marks || []).slice();
      if (p.mode === 'instant' && p._inst) { marks.push({ lat: p._inst.subSolar.lat, lon: p._inst.subSolar.lon, kind: 'sun', label: p.sunLabel }); marks.push({ lat: p._inst.subLunar.lat, lon: p._inst.subLunar.lon, kind: 'moon', label: p.moonLabel }); }
      for (const m of marks) {
        const X = x(m.lon), Y = y(m.lat); if (Y < 0 || Y > h) continue;
        ctx.lineWidth = 2; ctx.strokeStyle = tok('--map-mark-ring');
        if (m.kind === 'sun') { ctx.fillStyle = tok('--accent'); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(X + 8 * Math.cos(a), Y + 8 * Math.sin(a)); ctx.lineTo(X + 12 * Math.cos(a), Y + 12 * Math.sin(a)); ctx.strokeStyle = tok('--accent'); ctx.stroke(); } ctx.beginPath(); ctx.arc(X, Y, 6, 0, 2 * Math.PI); ctx.fill(); }
        else if (m.kind === 'moon') { ctx.fillStyle = tok('--moon'); ctx.beginPath(); ctx.arc(X, Y, 7, 0, 2 * Math.PI); ctx.fill(); ctx.fillStyle = tok('--map-sea'); ctx.beginPath(); ctx.arc(X + 3.5, Y - 1, 6, 0, 2 * Math.PI); ctx.fill(); }
        else if (m.kind === 'earliest') { ctx.fillStyle = tok('--accent'); ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 4 : 9, a = -Math.PI / 2 + k * Math.PI / 5; const px = X + r * Math.cos(a), py = Y + r * Math.sin(a); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
        else { ctx.fillStyle = tok('--map-mark'); ctx.beginPath(); ctx.arc(X, Y, p.mini ? 4.5 : 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); }
        if (m.label && !p.mini) { ctx.font = '600 12px ' + tok('--font-body'); const right = X > w - 170; ctx.textAlign = right ? 'right' : 'left'; ctx.textBaseline = 'middle'; const tx = X + (right ? -14 : 14); ctx.lineWidth = 3; ctx.strokeStyle = tok('--map-label-bg'); ctx.strokeText(m.label, tx, Y); ctx.fillStyle = tok('--ink'); ctx.fillText(m.label, tx, Y); }
      }
    }
    cv.addEventListener('click', ev => {
      if (!pickCb || !last) return;
      const rect = cv.getBoundingClientRect(); const fx = (ev.clientX - rect.left) / rect.width, fy = (ev.clientY - rect.top) / rect.height;
      pickCb(+(LAT_TOP - fy * (LAT_TOP - LAT_BOT)).toFixed(2), +(fx * 360 - 180).toFixed(2));
    });
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (last && el.offsetParent) render(last); }, 200); });
    return { render, onPick: f => { pickCb = f; }, repaint: () => last && render(last) };
  }
  G.HRMap = { mount, LAT_TOP, LAT_BOT };
})(typeof globalThis !== 'undefined' ? globalThis : window);
