/* Dünya haritası. Eş-dikdörtgen izdüşüm, Canvas.
 * Akşam modu: her noktanın kendi gurûbunda değerlendirme; sınıf her piksel için, ızgara değerlerinin ara değerinden bulunur.
 *   katmanlar: seadet (Tam İlmihâl’in sınıfları) · first (ilk görünürlük akşamı) · yallop · odeh (ek bilgi)
 *   çizgiler: Tam İlmihâl’in ölçüleri (beynûnet 8° ve 18°, gurûbda hilâl yüksekliği 5°) ve ek bilgi olarak değer çizgileri
 *   (beynûnet, yükseklik, yaş, arama süresi, ay batışı gecikmesi, ARCV, hilâl genişliği); ilk mümkün / görülebilir yer; ızgara; şehirler
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


  // ---- eş-değer çizgileri (yürüyen kareler): ızgara 3 kat sıklaştırılır, ara değerle düzgün eğriler çıkar ----
  // get(s) → değer veya null (null olan dörtgenler atlanır); levels: dizi ya da (lo, hi) → dizi
  function isoField(g, get, levels, maxSpread) {
    const S = sampler(g), f = 3, r = g.res / f;
    const lats = [], lons = [];
    for (let la = LAT_TOP - g.res / 2; la >= LAT_BOT + g.res / 2 - 1e-9; la -= r) lats.push(la);
    for (let lo = -180 + g.res / 2; lo <= 180 - g.res / 2 + 1e-9; lo += r) lons.push(lo);
    const V = lats.map(la => lons.map(lo => { const s = S(la, lo); return s.near.code === 'noSunset' ? null : get(s); }));
    const segs = [];
    for (let i = 0; i < lats.length - 1; i++) for (let j = 0; j < lons.length - 1; j++) {
      const q = [V[i][j], V[i][j + 1], V[i + 1][j + 1], V[i + 1][j]];
      if (q.some(v => v == null || !isFinite(v))) continue;
      const lo = Math.min(...q), hi = Math.max(...q); if (maxSpread && hi - lo > maxSpread) continue;
      const P = [[lats[i], lons[j]], [lats[i], lons[j + 1]], [lats[i + 1], lons[j + 1]], [lats[i + 1], lons[j]]];
      const Ls = typeof levels === 'function' ? levels(lo, hi) : levels;
      for (const L of Ls) {
        if (L < lo || L > hi) continue;
        const pts = [];
        for (let e = 0; e < 4; e++) { const a = q[e], b = q[(e + 1) % 4]; if ((a - L) * (b - L) < 0) { const t = (L - a) / (b - a); pts.push([P[e][0] + (P[(e + 1) % 4][0] - P[e][0]) * t, P[e][1] + (P[(e + 1) % 4][1] - P[e][1]) * t]); } }
        if (pts.length >= 2) segs.push([pts[0], pts[1], L]);
        if (pts.length === 4) segs.push([pts[2], pts[3], L]);
      }
    }
    return segs;
  }
  const stepLevels = (step, min) => (lo, hi) => { const o = []; for (let L = Math.ceil(lo / step) * step; L <= hi; L += step) if (min == null || L >= min) o.push(+L.toFixed(6)); return o; };
  // Çizgi takımları: getter, seviyeler, biçim. book: Tam İlmihâl’in ölçüleri; diğerleri ek bilgi (değer çizgileri)
  const okMoon = s => { const a = s.v('ageH'), u = s.v('up'); return a != null && a > 0 && a < 96 && u > 0; };
  const VALUE = {
    elong: { get: s => s.v('elong'), lv: stepLevels(2, 2), unit: '°', every: 2 },
    alt: { get: s => s.v('alt'), lv: stepLevels(2, 0), unit: '°', every: 2 },
    age: { get: s => s.v('ageH'), lv: stepLevels(2, 2), unit: 'h', every: 4, spread: 10 },
    win: { get: s => (okMoon(s) && s.v('win') != null ? s.v('win') : null), lv: stepLevels(10, 10), unit: '′', every: 20, x: true },
    lag: { get: s => (okMoon(s) && s.v('lag') != null ? s.v('lag') : null), lv: stepLevels(15, 15), unit: '′', every: 30, x: true },
    arcv: { get: s => (s.v('ageH') > 0 ? s.v('arcv') : null), lv: stepLevels(2, 2), unit: '°', every: 2, x: true },
    width: { get: s => (okMoon(s) ? s.v('width') : null), lv: stepLevels(0.1, 0.1), unit: '′', every: 0.2, x: true, dec: 1 },
    yallop: { get: s => (okMoon(s) ? s.v('q') : null), lv: [0.216, -0.014, -0.160, -0.232], modern: 1 },
    odeh: { get: s => (okMoon(s) ? s.v('V') : null), lv: [5.65, 2, -0.96], modern: 1 }
  };
  // Şehirler (yön bulmak için; adlar dile göre, yoksa İngilizce). r: 1 her zaman, 2 yer varsa
  const CITIES = [
    ['Mekke', 'Makkah', 21.42, 39.83, 1], ['Medine', 'Madinah', 24.47, 39.61, 2], ['İstanbul', 'Istanbul', 41.01, 28.98, 1], ['Ankara', 'Ankara', 39.93, 32.86, 2],
    ['Kahire', 'Cairo', 30.04, 31.24, 1], ['Kudüs', 'Jerusalem', 31.78, 35.22, 2], ['Bağdat', 'Baghdad', 33.31, 44.37, 2], ['Tahran', 'Tehran', 35.69, 51.39, 1],
    ['Riyad', 'Riyadh', 24.71, 46.68, 2], ['Dubai', 'Dubai', 25.2, 55.27, 2], ['Karaçi', 'Karachi', 24.86, 67.0, 1], ['Delhi', 'Delhi', 28.61, 77.21, 1],
    ['Dakka', 'Dhaka', 23.81, 90.41, 2], ['Taşkent', 'Tashkent', 41.3, 69.24, 2], ['Kazan', 'Kazan', 55.79, 49.12, 2], ['Moskova', 'Moscow', 55.76, 37.62, 1],
    ['Londra', 'London', 51.51, -0.13, 1], ['Paris', 'Paris', 48.86, 2.35, 2], ['Berlin', 'Berlin', 52.52, 13.4, 2], ['Saraybosna', 'Sarajevo', 43.86, 18.41, 2],
    ['Fas', 'Fez', 34.03, -5.0, 2], ['Dakar', 'Dakar', 14.72, -17.47, 1], ['Lagos', 'Lagos', 6.52, 3.38, 1], ['Hartum', 'Khartoum', 15.5, 32.56, 2],
    ['Nairobi', 'Nairobi', -1.29, 36.82, 1], ['Kinşasa', 'Kinshasa', -4.44, 15.27, 2], ['Cape Town', 'Cape Town', -33.92, 18.42, 1], ['Johannesburg', 'Johannesburg', -26.2, 28.05, 2],
    ['Cakarta', 'Jakarta', -6.2, 106.85, 1], ['Kuala Lumpur', 'Kuala Lumpur', 3.14, 101.69, 2], ['Pekin', 'Beijing', 39.9, 116.4, 1], ['Tokyo', 'Tokyo', 35.68, 139.69, 1],
    ['Manila', 'Manila', 14.6, 120.98, 2], ['Sidney', 'Sydney', -33.87, 151.21, 1], ['Perth', 'Perth', -31.95, 115.86, 2], ['Auckland', 'Auckland', -36.85, 174.76, 1],
    ['New York', 'New York', 40.71, -74.0, 1], ['Toronto', 'Toronto', 43.65, -79.38, 2], ['Chicago', 'Chicago', 41.88, -87.63, 2], ['Los Angeles', 'Los Angeles', 34.05, -118.24, 1],
    ['Meksiko', 'Mexico City', 19.43, -99.13, 1], ['Bogota', 'Bogotá', 4.71, -74.07, 2], ['Lima', 'Lima', -12.05, -77.04, 1], ['São Paulo', 'São Paulo', -23.55, -46.63, 1],
    ['Buenos Aires', 'Buenos Aires', -34.6, -58.38, 1], ['Santiago', 'Santiago', -33.45, -70.67, 2], ['Honolulu', 'Honolulu', 21.31, -157.86, 1], ['Anchorage', 'Anchorage', 61.22, -149.9, 2],
    ['Reykjavík', 'Reykjavík', 64.15, -21.94, 2]];
  // Taban dokusu: Blue Marble’dan (NASA, kamu malı) türetilmiş küçük gri doku; karaya “yumuşak ışık” ile, temanın renginde işlenir
  let RELIEF = null;
  function relief(onload) {
    if (RELIEF) return RELIEF.complete && RELIEF.naturalWidth ? RELIEF : null;
    if (!G.HR_RELIEF) return null;
    RELIEF = new Image(); RELIEF.onload = onload; RELIEF.src = G.HR_RELIEF; return null;
  }

  function mount(el) {
    el.innerHTML = '<div class="mapbox"><canvas></canvas><div class="mapprog" hidden></div><div class="mapmsg" hidden></div></div>';
    const cv = el.querySelector('canvas'), prog = el.querySelector('.mapprog'), msg = el.querySelector('.mapmsg');
    let last = null, lastGrids = null, pickCb = null, seq = 0;
    function size(wOver) {
      const w = wOver || Math.max(280, Math.round(el.clientWidth || 640)); const h = Math.round(w * (LAT_TOP - LAT_BOT) / 360); const d = wOver ? 1 : (window.devicePixelRatio || 1);
      return { w, h, d };
    }
    const proj = (w, h) => ({ x: lon => (lon + 180) / 360 * w, y: lat => (LAT_TOP - lat) / (LAT_TOP - LAT_BOT) * h });

    async function render(p) {
      const my = ++seq; last = p;
      msg.hidden = !p.message; msg.textContent = p.message || '';
      if (p.mode === 'instant') { prog.hidden = true; lastGrids = null; paint(p, null); return; }
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
        const modern = p.layer === 'yallop' || p.layer === 'odeh', vx = p.value && VALUE[p.value] && VALUE[p.value].x;
        // değer çizgisi genişletilmiş hücre isterse (ARCV, genişlik, süreler) ayrı ızgara; sınıflar her zaman aynı hücreden
        grids = [await grid(['ev', p.res, p.dayUTC, p.conj.ut.toFixed(4), modern ? 1 : 0].join('|'), p.res, (la, lo) => G.HRCore.cell(la, lo, p.dayUTC, p.conj, modern), f => onP(vx ? f / 2 : f))];
        if (my !== seq) return;
        if (vx) { grids.x = await grid(['x', p.res, p.dayUTC, p.conj.ut.toFixed(4)].join('|'), p.res, (la, lo) => G.HRCore.cellX(la, lo, p.dayUTC, p.conj), f => onP(0.5 + f / 2)); if (my !== seq) return; }
      }
      prog.hidden = true; lastGrids = grids;
      paint(p, grids);
    }

    // İlk mümkün (≥ 8°) ve ilk görülebilir (≥ 18°) yer: bu akşamın ızgarasında gurûbu en erken olan hücre
    function firstPoints(g) {
      let poss = null, vis = null;
      g.lats.forEach((la, i) => g.lons.forEach((lo, j) => {
        const c = g.rows[i][j]; if (!c || !c.ss) return;
        if ((c.code === 'possible' || c.code === 'visible') && (!poss || c.ss.ut < poss.ss.ut)) poss = { lat: la, lon: lo, ss: c.ss, elong: c.elong, alt: c.alt };
        if (c.code === 'visible' && (!vis || c.ss.ut < vis.ss.ut)) vis = { lat: la, lon: lo, ss: c.ss, elong: c.elong, alt: c.alt };
      }));
      return { poss, vis };
    }

    function paint(p, grids, target) {
      const { w, h, d } = target ? size(target.width) : size();
      const canvas = target ? document.createElement('canvas') : cv;
      canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
      if (!target) { cv.style.width = '100%'; cv.style.height = 'auto'; }
      const ctx = canvas.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
      const { x, y } = proj(w, h);
      const sx = Math.max(0.8, w / 1100);   // yazı ve çizgi ölçeği
      ctx.fillStyle = tok('--map-sea'); ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = tok('--map-land'); landPath(ctx, x, y); ctx.fill('nonzero');
      // taban dokusu (kara)
      const rel = p.relief && !p.mini ? relief(() => { if (last === p) paint(p, lastGrids); }) : null;
      const drawRel = a => { if (rel) { ctx.save(); landPath(ctx, x, y); ctx.clip('nonzero'); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = a; ctx.drawImage(rel, 0, 0, w, h); ctx.restore(); } };
      drawRel(0.9);
      // sınıf görüntüsü (CSS pikseli çözünürlüğünde)
      const W = Math.round(w), H = Math.round(h);
      const img = new ImageData(W, H), cls = new Uint8Array(W * H);
      let alpha, Ss = null;
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
        Ss = grids.map(sampler);
        const fn = p.layer === 'first' ? (la, lo) => classFirst(Ss, la, lo) : p.layer === 'seadet' ? (la, lo) => classSeadet(Ss[0], la, lo) : (la, lo) => classModern(Ss[0], la, lo, p.layer);
        const pal = [null, '--c-visible', '--c-possible', '--c-below5', '--c-below8', '--c-notborn', '--c-nosun'].map(n => n && rgb(tok(n)));
        for (let py = 0; py < H; py++) { const lat = LAT_TOP - (py + 0.5) / H * (LAT_TOP - LAT_BOT); for (let px = 0; px < W; px++) cls[py * W + px] = fn(lat, (px + 0.5) / W * 360 - 180); }
        const fade = p.layer === 'seadet' || p.layer === 'first' ? 5 : 99;
        // kesin red bölgeleri (beynûnet < 8°, hilâl doğmamış) çapraz tarama: siyah-beyaz baskıda ve renk körlüğünde de okunur
        const hatch = p.hatch && p.layer === 'seadet', hc = rgb(tok('--map-edge')), gap = Math.max(6, Math.round(7 * sx));
        for (let k = 0; k < W * H; k++) {
          const c = cls[k]; if (!c) continue; const o = k * 4, col = pal[c];
          if (hatch && (c === 4 || c === 5) && (((k % W) + Math.floor(k / W)) % gap === 0)) { img.data[o] = hc[0]; img.data[o + 1] = hc[1]; img.data[o + 2] = hc[2]; img.data[o + 3] = 120; continue; }
          img.data[o] = col[0]; img.data[o + 1] = col[1]; img.data[o + 2] = col[2]; img.data[o + 3] = c === fade ? 70 : c === 6 ? 120 : 165;
        }
        // sınıf sınırları: Tam İlmihâl çizgileri açıkken çizgiler sınır olur; değilse piksel sınırı
        const smooth = (p.layer === 'seadet' && p.book) || (p.layer !== 'seadet' && p.layer !== 'first');
        if (!smooth) {
          const edge = rgb(tok('--map-edge'));
          for (let py = 0; py < H - 1; py++) for (let px = 0; px < W - 1; px++) { const k = py * W + px, a = cls[k]; if (a !== cls[k + 1] || a !== cls[k + W]) img.data.set([edge[0], edge[1], edge[2], 200], k * 4); }
        }
        alpha = p.mini ? 0.95 : (rel ? 0.82 : 0.9);
      }
      const off = document.createElement('canvas'); off.width = W; off.height = H; off.getContext('2d').putImageData(img, 0, 0);
      ctx.save();
      if (p.landOnly && p.mode !== 'instant') { landPath(ctx, x, y); ctx.clip('nonzero'); }
      ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, w, h);
      ctx.restore();
      // kabartma renklerin üstünde de hafifçe okunur (yer şekilleri kaybolmaz)
      drawRel(0.75);
      // kıyılar, sınırlar, ekvator
      ctx.strokeStyle = tok('--map-coast'); ctx.lineWidth = p.mini ? 0.5 : 0.7 * sx;
      for (const r of RINGS()) for (const sh of r.jumped ? [0, 360, -360] : [0]) { ringPath(ctx, x, y, r, sh, true); ctx.stroke(); }
      if (p.borders && !p.mini) { ctx.strokeStyle = tok('--map-border'); ctx.lineWidth = 0.4 * sx; for (const r of BORDERS()) for (const sh of r.jumped ? [0, 360, -360] : [0]) { ringPath(ctx, x, y, r, sh, false); ctx.stroke(); } }
      // enlem-boylam ızgarası (seçimlik): 30° boylam, 20° enlem; dönenceler ve kutup daireleri noktalı
      if (p.grat && !p.mini) {
        ctx.save(); ctx.strokeStyle = tok('--map-border'); ctx.globalAlpha = 0.55; ctx.lineWidth = 0.6 * sx; ctx.setLineDash([1.5 * sx, 3 * sx]); ctx.beginPath();
        for (let lo = -150; lo <= 150; lo += 30) { ctx.moveTo(x(lo), 0); ctx.lineTo(x(lo), h); }
        for (let la = -60; la <= 80; la += 20) { ctx.moveTo(0, y(la)); ctx.lineTo(w, y(la)); }
        ctx.stroke(); ctx.setLineDash([0.8 * sx, 5 * sx]); ctx.beginPath();
        for (const la of [23.44, -23.44, 66.56]) { ctx.moveTo(0, y(la)); ctx.lineTo(w, y(la)); }
        ctx.stroke(); ctx.restore();
        ctx.save(); ctx.font = `600 ${Math.round(9.5 * sx)}px ${tok('--font-mono')}`; ctx.fillStyle = tok('--muted'); ctx.textBaseline = 'top'; ctx.textAlign = 'center';
        const gl = p.gratLabel || ((v, k) => `${Math.abs(v)}°${v === 0 ? '' : k === 'lat' ? (v > 0 ? 'N' : 'S') : (v > 0 ? 'E' : 'W')}`);
        for (let lo = -150; lo <= 150; lo += 30) halo(ctx, gl(lo, 'lon'), x(lo), h - 13 * sx);
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        for (let la = -40; la <= 60; la += 20) halo(ctx, gl(la, 'lat'), 3 * sx, y(la));
        ctx.restore();
      } else {
        ctx.strokeStyle = tok('--map-border'); ctx.lineWidth = 0.5 * sx; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(0, y(0)); ctx.lineTo(w, y(0)); ctx.stroke(); ctx.setLineDash([]);
      }
      const boxes = [];   // yerleşmiş yazıların kutuları (çakışmayı önler)
      const free = (bx) => { if (boxes.some(b => bx[0] < b[2] && bx[2] > b[0] && bx[1] < b[3] && bx[3] > b[1])) return false; boxes.push(bx); return true; };
      // işaretler: kullanıcı, Mekke, dünyada ilk mümkün / ilk görülebilir yer, anlık kipte ☀ ☾
      // yazı yerleri şehirlerden önce ayrılır (işaret yazıları önceliklidir); çizim en sonda
      const marks = (p.marks || []).slice();
      if (p.firstPts && p.mode !== 'instant' && grids && p.layer !== 'first') {
        const fp = firstPoints(grids[0]);
        if (fp.poss) marks.push({ lat: fp.poss.lat, lon: fp.poss.lon, kind: 'first8', label: p.firstLabel ? p.firstLabel('poss', fp.poss) : '' });
        if (fp.vis) marks.push({ lat: fp.vis.lat, lon: fp.vis.lon, kind: 'first18', label: p.firstLabel ? p.firstLabel('vis', fp.vis) : '' });
        p._first = fp;
      }
      if (p.mode === 'instant' && p._inst) { marks.push({ lat: p._inst.subSolar.lat, lon: p._inst.subSolar.lon, kind: 'sun', label: p.sunLabel }); marks.push({ lat: p._inst.subLunar.lat, lon: p._inst.subLunar.lon, kind: 'moon', label: p.moonLabel }); }
      const mFont = `600 ${Math.round(11.5 * sx)}px ${tok('--font-body')}`;
      ctx.font = mFont;
      for (const m of marks) { const X = x(m.lon), Y = y(m.lat); m.X = X; m.Y = Y; if (Y >= 0 && Y <= h) boxes.push([X - 9 * sx, Y - 9 * sx, X + 9 * sx, Y + 9 * sx]); }
      for (const m of marks) {
        if (!m.label || p.mini || m.Y < 0 || m.Y > h) continue;
        const tw = ctx.measureText(m.label).width, hh = 8 * sx, X = m.X, Y = m.Y, g = 13 * sx;
        // aday yerler: sağ, sol, sağ üst/alt, sol üst/alt, üst, alt
        const cand = [[X + g, Y, 'left'], [X - g, Y, 'right'], [X + g, Y - 2.2 * hh, 'left'], [X + g, Y + 2.2 * hh, 'left'], [X - g, Y - 2.2 * hh, 'right'], [X - g, Y + 2.2 * hh, 'right'], [X - tw / 2, Y - 2.6 * hh, 'left'], [X - tw / 2, Y + 2.6 * hh, 'left']];
        const fits = ([tx, ty, al]) => { const x0 = al === 'left' ? tx : tx - tw; return x0 >= 2 && x0 + tw <= w - 2 && ty - hh >= 0 && ty + hh <= h; };
        const bxOf = ([tx, ty, al]) => (al === 'left' ? [tx - 2, ty - hh, tx + tw + 2, ty + hh] : [tx - tw - 2, ty - hh, tx + 2, ty + hh]);
        let pick = cand.find(cd => fits(cd) && free(bxOf(cd)));
        if (!pick) { pick = cand.find(fits) || cand[0]; boxes.push(bxOf(pick)); }
        m.lab = pick;
      }
      // değer çizgileri (ek bilgi) ve Tam İlmihâl çizgileri
      const drawSet = (segs, color, width, dash, labelOf, every, haloW) => {
        if (!segs.length) return;
        ctx.save(); ctx.lineCap = 'round';
        if (haloW) { ctx.strokeStyle = tok('--map-label-bg'); ctx.globalAlpha = 0.7; ctx.lineWidth = width + haloW; ctx.setLineDash(dash || []); ctx.beginPath(); for (const [a, b] of segs) { ctx.moveTo(x(a[1]), y(a[0])); ctx.lineTo(x(b[1]), y(b[0])); } ctx.stroke(); ctx.globalAlpha = 1; }
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath();
        for (const [a, b] of segs) { ctx.moveTo(x(a[1]), y(a[0])); ctx.lineTo(x(b[1]), y(b[0])); }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore();
        if (!labelOf) return;
        // etiketler: her seviye için çizginin enlem sırasına göre %40 ve %75’indeki noktalar
        const by = new Map(); for (const sg of segs) { if (every && Math.abs(sg[2] / every - Math.round(sg[2] / every)) > 1e-6) continue; (by.get(sg[2]) || by.set(sg[2], []).get(sg[2])).push(sg); }
        ctx.save(); ctx.font = `700 ${Math.round(10.5 * sx)}px ${tok('--font-mono')}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const [L, list] of by) {
          list.sort((a, b) => b[0][0] - a[0][0]);
          for (const qn of [0.4, 0.75]) {
            const sg = list[Math.floor(qn * (list.length - 1))]; if (!sg) continue;
            const X = x((sg[0][1] + sg[1][1]) / 2), Y = y((sg[0][0] + sg[1][0]) / 2), txt = labelOf(L), tw = ctx.measureText(txt).width + 8 * sx, th = 15 * sx;
            if (X < tw / 2 || X > w - tw / 2 || Y < th || Y > h - th) continue;
            if (!free([X - tw / 2, Y - th / 2, X + tw / 2, Y + th / 2])) continue;
            ctx.fillStyle = tok('--map-label-bg'); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - tw / 2, Y - th / 2, tw, th, 4 * sx) : ctx.rect(X - tw / 2, Y - th / 2, tw, th); ctx.fill();
            ctx.fillStyle = color; ctx.fillText(txt, X, Y + 0.5);
          }
        }
        ctx.restore();
      };
      if (p.mode !== 'instant' && grids && p.layer !== 'first') {
        const g0 = grids[0];
        const v = p.value && VALUE[p.value];
        if (v && !v.modern) {
          const g = v.x ? grids.x : g0;
          if (g) drawSet(isoField(g, v.get, v.lv, v.spread), tok('--map-iso'), 0.9 * sx, null, L => (p.valueLabel ? p.valueLabel(p.value, L) : (v.dec ? L.toFixed(v.dec) : String(Math.round(L))) + v.unit), v.every, 0);
        }
        // Yallop / Odeh katmanında sınıf sınırları düzgün eğri (ek bilgi)
        if (p.layer === 'yallop' || p.layer === 'odeh') drawSet(isoField(g0, VALUE[p.layer].get, VALUE[p.layer].lv), tok('--map-edge'), 1.1 * sx, null, null, 0, 0);
        // Tam İlmihâl’in ölçüleri: beynûnet 8° ve 18° (ay ufkun üstünde iken), gurûbda hilâl yüksekliği 5° (beynûnet ≥ 8° iken), ufuk 0°
        if (p.book && p.layer !== 'first') {
          const L = p.bookLabels || { e8: '8°', e18: '18°', a5: '5°' };
          drawSet(isoField(g0, s => (okMoon(s) ? s.v('elong') : null), [8]), tok('--c-below8'), 1.8 * sx, null, () => L.e8, 0, 2.5 * sx);
          drawSet(isoField(g0, s => (okMoon(s) ? s.v('elong') : null), [18]), tok('--c-visible-ink'), 1.8 * sx, null, () => L.e18, 0, 2.5 * sx);
          drawSet(isoField(g0, s => (okMoon(s) && s.v('elong') >= 8 ? s.v('alt') : null), [5]), tok('--c-below5-ink'), 1.6 * sx, [6 * sx, 4 * sx], () => L.a5, 0, 2.5 * sx);
          drawSet(isoField(g0, s => { const a = s.v('ageH'); return a != null && a > 0 && a < 96 ? s.v('up') : null; }, [0]), tok('--map-edge'), 1 * sx, [2 * sx, 3 * sx], null, 0, 0);
        }
      }
      // 18° anında güneşin battığı boylam (s. 360)
      if (p.mode !== 'instant' && p.m18 && p.layer !== 'first') {
        ctx.strokeStyle = tok('--accent'); ctx.lineWidth = 1.6 * sx; ctx.setLineDash([6 * sx, 4 * sx]); ctx.beginPath(); let st = false;
        for (let la = 66; la >= -58; la -= 1) { const lon = G.HRCore.sunsetLon(p.m18.t, la); if (lon == null) { st = false; continue; } const X = x(lon), Y = y(la); if (!st) { ctx.moveTo(X, Y); st = true; } else ctx.lineTo(X, Y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      // şehirler (seçimlik)
      if (p.cities && !p.mini) {
        ctx.save(); ctx.font = `600 ${Math.round(10 * sx)}px ${tok('--font-body')}`; ctx.textBaseline = 'middle';
        for (const rank of [1, 2]) for (const c of CITIES) {
          if (c[4] !== rank) continue; const X = x(c[3]), Y = y(c[2]); if (Y < 4 || Y > h - 4) continue;
          const nm = p.cityName ? p.cityName(c) : c[1], tw = ctx.measureText(nm).width, right = X > w - tw - 20;
          const bx = right ? [X - tw - 8 * sx, Y - 7 * sx, X + 3 * sx, Y + 7 * sx] : [X - 3 * sx, Y - 7 * sx, X + tw + 8 * sx, Y + 7 * sx];
          if (!free(bx)) continue;
          ctx.fillStyle = tok('--ink'); ctx.beginPath(); ctx.arc(X, Y, (c[0] === 'Mekke' ? 3.2 : 2.2) * sx, 0, 2 * Math.PI); ctx.fill();
          ctx.textAlign = right ? 'right' : 'left'; halo(ctx, nm, X + (right ? -5 : 5) * sx, Y);
        }
        ctx.restore();
      }
      // işaretlerin çizimi
      ctx.lineJoin = 'round';
      for (const m of marks) {
        const X = m.X, Y = m.Y; if (Y < 0 || Y > h) continue;
        ctx.lineWidth = 2; ctx.strokeStyle = tok('--map-mark-ring');
        if (m.kind === 'sun') { ctx.fillStyle = tok('--accent'); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(X + 8 * Math.cos(a), Y + 8 * Math.sin(a)); ctx.lineTo(X + 12 * Math.cos(a), Y + 12 * Math.sin(a)); ctx.strokeStyle = tok('--accent'); ctx.stroke(); } ctx.beginPath(); ctx.arc(X, Y, 6, 0, 2 * Math.PI); ctx.fill(); }
        else if (m.kind === 'moon') { ctx.fillStyle = tok('--moon'); ctx.beginPath(); ctx.arc(X, Y, 7, 0, 2 * Math.PI); ctx.fill(); ctx.fillStyle = tok('--map-sea'); ctx.beginPath(); ctx.arc(X + 3.5, Y - 1, 6, 0, 2 * Math.PI); ctx.fill(); }
        else if (m.kind === 'earliest') { ctx.fillStyle = tok('--accent'); ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 4 : 9, a = -Math.PI / 2 + k * Math.PI / 5; const px = X + r * Math.cos(a), py = Y + r * Math.sin(a); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
        else if (m.kind === 'first8' || m.kind === 'first18') { const r = 7 * sx; ctx.fillStyle = tok(m.kind === 'first8' ? '--c-possible' : '--c-visible'); ctx.beginPath(); ctx.moveTo(X, Y - r); ctx.lineTo(X + r, Y); ctx.lineTo(X, Y + r); ctx.lineTo(X - r, Y); ctx.closePath(); ctx.fill(); ctx.strokeStyle = tok('--ink'); ctx.lineWidth = 1.5; ctx.stroke(); }
        else { ctx.fillStyle = tok('--map-mark'); ctx.beginPath(); ctx.arc(X, Y, p.mini ? 4.5 : 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); }
        if (m.lab) {
          const [tx, ty, al] = m.lab; ctx.font = mFont; ctx.textAlign = al; ctx.textBaseline = 'middle';
          ctx.lineWidth = 3; ctx.strokeStyle = tok('--map-label-bg'); ctx.strokeText(m.label, tx, ty); ctx.fillStyle = tok('--ink'); ctx.fillText(m.label, tx, ty);
        }
      }
      // çıktı resimlerinde küçük program adı ve adresi: yazıların ve işaretlerin bulunmadığı ilk köşe
      if (p.credit && !p.mini) {
        ctx.save(); ctx.font = `500 ${Math.round(9.5 * sx)}px ${tok('--font-body')}`; ctx.textBaseline = 'middle';
        const tw = ctx.measureText(p.credit).width, hh = 7 * sx, m = 6 * sx;
        const cand = [[w - m - tw, h - m - hh], [m, h - m - hh], [w - m - tw, m + hh], [m, m + hh]];
        let c = cand.find(([X, Y]) => free([X - 3 * sx, Y - hh, X + tw + 3 * sx, Y + hh])) || cand[0];
        const [X, Y] = c;
        ctx.globalAlpha = 0.55; ctx.fillStyle = tok('--map-label-bg'); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - 3 * sx, Y - hh, tw + 6 * sx, 2 * hh, 3 * sx) : ctx.rect(X - 3 * sx, Y - hh, tw + 6 * sx, 2 * hh); ctx.fill();
        ctx.globalAlpha = 0.75; ctx.fillStyle = tok('--muted'); ctx.textAlign = 'left'; ctx.fillText(p.credit, X, Y + 0.5);
        ctx.restore();
      }
      return canvas;
    }
    function halo(ctx, s, X, Y) { ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = tok('--map-label-bg'); ctx.strokeText(s, X, Y); ctx.fillStyle = tok('--ink'); ctx.fillText(s, X, Y); }
    cv.addEventListener('click', ev => {
      if (!pickCb || !last) return;
      const rect = cv.getBoundingClientRect(); const fx = (ev.clientX - rect.left) / rect.width, fy = (ev.clientY - rect.top) / rect.height;
      pickCb(+(LAT_TOP - fy * (LAT_TOP - LAT_BOT)).toFixed(2), +(fx * 360 - 180).toFixed(2));
    });
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (last && el.offsetParent) render(last); }, 200); });
    // Dışa aktarma: son çizimi verilen genişlikte yeniden çizer (PNG ve A4 için)
    const snapshot = (width, extra) => (last ? paint(extra ? Object.assign({}, last, extra) : last, lastGrids, { width }) : null);
    return { render, snapshot, info: () => last && last._first, onPick: f => { pickCb = f; }, repaint: () => last && render(last) };
  }
  G.HRMap = { mount, LAT_TOP, LAT_BOT, CITIES };
})(typeof globalThis !== 'undefined' ? globalThis : window);
