/* Gökyüzü haritası (v0.4): seçili an için bütün gök; stereografik izdüşüm, merkez başucu (zenit), kenar ufuk.
 * Bakış yönü alta gelir (varsayılan batı: hilâl rasadında yüzü batıya dönük gözlemci haritayı başının üstünde tutar gibi).
 * Yıldızlar ve takımyıldız çizgileri: d3-celestial (BSD-3-Clause). Gezegenler, Ay ve Güneş: Astronomy Engine. */
(function (G) {
  'use strict';
  const A = G.Astronomy, C = () => G.HRCore;
  const col = n => getComputedStyle(document.body).getPropertyValue(n).trim() || '#888';
  const rad = d => d * Math.PI / 180;
  const nb = s => String(s).replace(/ /g, ' ');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // Bir anda J2000 yön vektörlerini ufuk koordinatlarına çevirir (kırılma dâhil)
  function horizonOf(t, obs) {
    const rot = A.Rotation_EQJ_HOR(t, obs);
    return (raDeg, decDeg) => { const v = A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(decDeg, raDeg, 1), t)); const h = A.HorizonFromVector(v, 'normal'); return { alt: h.lat, az: h.lon }; };
  }
  function draw(loc, t, L, opt = {}) {
    const tr = L === 'tr';
    const S = G.HR_STARS, core = C();
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const H = horizonOf(t, obs);
    const W = opt.size || 640, pad = 34, R = W / 2 - pad, cx = W / 2, cy = W / 2;
    const face = opt.face == null ? 270 : opt.face, F = (opt.scale || 1) * (W < 500 ? 1.15 : 1);
    const P = (alt, az) => { const r = R * Math.tan(rad((90 - alt) / 2)); const a = rad(az - face); return [cx + r * Math.sin(a), cy + r * Math.cos(a)]; };
    const now = core.at(t, loc);
    const dark = Math.max(0, Math.min(1, -now.sun.alt / 15));
    const skyBg = dark > 0.5 ? col('--sky-night') : col('--sky-day');
    const lab = col('--sky-label') || '#fff', halo = col('--sky-halo') || '#000', star = col('--sky-star'), acc = col('--accent');
    let s = `<svg class="sky starmap" viewBox="0 0 ${W} ${W}" width="100%" role="img" aria-label="${tr ? 'Gökyüzü haritası' : 'Sky chart'}" style="--lab:${lab};--halo:${halo}">`;
    s += `<defs><clipPath id="smClip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><radialGradient id="smBg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${col('--sky-night')}"/><stop offset="1" stop-color="${dark > 0.5 ? col('--sky-night') : col('--sky-dusk')}"/></radialGradient></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#smBg)" stroke="${col('--line')}"/>`;
    s += `<g clip-path="url(#smClip)">`;
    // irtifâ halkaları ve 5° sınırı
    for (const a of [30, 60]) { const r = R * Math.tan(rad((90 - a) / 2)); s += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${col('--sky-grid')}" stroke-opacity=".18" stroke-dasharray="3 5"/>`; }
    { const r5 = R * Math.tan(rad(85 / 2)); s += `<circle cx="${cx}" cy="${cy}" r="${r5.toFixed(1)}" fill="none" stroke="${acc}" stroke-opacity=".75" stroke-dasharray="6 5" stroke-width="1.2"/>`; }
    // ekliptik
    if (opt.ecliptic !== false) {
      const rot = A.CombineRotation(A.Rotation_ECL_EQJ(), A.Rotation_EQJ_HOR(t, obs));
      let d = '', on = false;
      for (let lon = 0; lon <= 360; lon += 3) { const v = A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(0, lon, 1), t)); const h = A.HorizonFromVector(v, 'normal'); if (h.lat < -2) { on = false; continue; } const [x, y] = P(h.lat, h.lon); d += (on ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); on = true; }
      s += `<path d="${d}" fill="none" stroke="${acc}" stroke-opacity=".45" stroke-dasharray="2 4"/>`;
    }
    // takımyıldız çizgileri
    if (opt.lines !== false) {
      let d = '';
      for (const ln of S.l) { let on = false; for (let i = 0; i < ln.length; i += 2) { const h = H(ln[i] / 100, ln[i + 1] / 100); if (h.alt < -1) { on = false; continue; } const [x, y] = P(h.alt, h.az); d += (on ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); on = true; } }
      s += `<path d="${d}" fill="none" stroke="${col('--sky-grid')}" stroke-opacity=".38" stroke-width=".8"/>`;
    }
    // yıldızlar
    const lim = opt.limitMag || (dark > 0.7 ? 4.6 : dark > 0.35 ? 3.5 : 2.2);
    const names = [];
    for (let i = 0; i < S.s.length; i += 3) {
      const m = S.s[i + 2] / 100; if (m > lim) continue;
      const h = H(S.s[i] / 100, S.s[i + 1] / 100); if (h.alt < 0) continue;
      const [x, y] = P(h.alt, h.az), r = Math.max(0.7, 3.4 - m * 0.62);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${star}"/>`;
      const nm = S.n[i / 3]; if (nm && opt.names !== false && m <= 1.6) names.push({ x, y, r, txt: tr ? nm[0] : nm[1] });
    }
    // takımyıldız adları
    if (opt.cons) for (const c of S.c) { const h = H(c[0] / 100, c[1] / 100); if (h.alt < 8) continue; const [x, y] = P(h.alt, h.az); s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${(10 * F).toFixed(1)}" text-anchor="middle" fill="${col('--sky-grid')}" fill-opacity=".75" font-style="italic" class="nohalo">${esc(nb(tr ? c[2] : c[3]))}</text>`; }
    s += '</g>';
    // gezegenler, Ay, Güneş
    const objs = core.skyObjects(t, obs).filter(o => o.kind === 'planet' && o.alt > 0);
    for (const o of objs) { const [x, y] = P(o.alt, o.az); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4.2 - Math.min(2, Math.max(-4, o.mag)) * 0.35).toFixed(1)}" fill="${acc}" stroke="${halo}" stroke-width="1"/>`; names.push({ x, y, r: 5, txt: G.HRSky.objName(o.id, L), strong: true }); }
    if (now.sun.alt > -0.8) { const [x, y] = P(Math.max(0, now.sun.alt), now.sun.az); s += `<circle cx="${x}" cy="${y}" r="9" fill="${acc}"/>`; names.push({ x, y, r: 10, txt: tr ? 'Güneş' : 'Sun', strong: true }); }
    if (now.moon.alt > -0.5) {
      const [x, y] = P(Math.max(0, now.moon.alt), now.moon.az), k = A.Illumination('Moon', t).phase_fraction;
      let ang = 0; if (now.sun.alt > -30) { const [sx, sy] = P(Math.max(-20, now.sun.alt), now.sun.az); ang = Math.atan2(sy - y, sx - x) * 180 / Math.PI; }
      const rx = Math.abs(1 - 2 * k) * 9, sw = k > 0.5 ? 1 : 0;
      s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})"><circle r="9" fill="${col('--sky-night')}" fill-opacity=".45" stroke="${col('--moon')}" stroke-width="1.2"/><path d="M0 -9 A9 9 0 0 1 0 9 A${rx.toFixed(2)} 9 0 0 ${sw} 0 -9Z" fill="${col('--moon')}"/></g>`;
      names.push({ x, y, r: 12, txt: (tr ? 'Ay ' : 'Moon ') + now.moon.alt.toFixed(1) + '°', strong: true });
    }
    // etiketler: üst üste binmeyi önleyen basit yerleştirme
    const placed = [];
    names.sort((a, b) => (b.strong ? 1 : 0) - (a.strong ? 1 : 0));
    for (const n of names) {
      const fs = (n.strong ? 12.5 : 11) * F, w = n.txt.length * fs * 0.56;
      const cands = [[n.r + 3, fs * 0.35, 'start'], [-n.r - 3, fs * 0.35, 'end'], [0, -n.r - 4, 'middle'], [0, n.r + fs, 'middle']];
      for (const [dx, dy, anc] of cands) {
        const x0 = anc === 'start' ? n.x + dx : anc === 'end' ? n.x + dx - w : n.x - w / 2, y0 = n.y + dy - fs;
        const box = [x0, y0, x0 + w, y0 + fs * 1.2];
        if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
        placed.push(box);
        s += `<text x="${(n.x + dx).toFixed(1)}" y="${(n.y + dy).toFixed(1)}" font-size="${fs.toFixed(1)}" text-anchor="${anc}" fill="${lab}" font-weight="${n.strong ? 700 : 500}">${esc(n.txt)}</text>`;
        break;
      }
    }
    // ufuk çemberi, yönler, güneşin yönü
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${col('--ink')}" stroke-opacity=".5" stroke-width="1.5"/>`;
    const card = tr ? ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    for (let i = 0; i < 8; i++) { const az = i * 45, a = rad(az - face), x = cx + (R + 16) * Math.sin(a), y = cy + (R + 16) * Math.cos(a); s += `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" font-size="${((i % 2 ? 11 : 14) * F).toFixed(1)}" font-weight="700" text-anchor="middle" fill="${col('--ink')}" class="nohalo">${card[i]}</text>`; }
    if (now.sun.alt <= -0.8 && now.sun.alt > -24) { const a = rad(now.sun.az - face), x1 = cx + R * Math.sin(a), y1 = cy + R * Math.cos(a), x2 = cx + (R - 12) * Math.sin(a), y2 = cy + (R - 12) * Math.cos(a); s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${acc}" stroke-width="3"/><text x="${x2 - 14 * Math.sin(a)}" y="${y2 - 14 * Math.cos(a) + 4}" font-size="${(11 * F).toFixed(1)}" text-anchor="middle" fill="${lab}">☀ ${now.sun.alt.toFixed(0)}°</text>`; }
    s += '</svg>';
    return { svg: s, read: { lim, planets: objs.map(o => ({ name: G.HRSky.objName(o.id, L), alt: o.alt, az: o.az, mag: o.mag })) } };
  }

  // Yönelim yardımcıları: ayın (ay ufkun altındaysa gurûb noktasının) çevresindeki en parlak cisimler ve aya göre konumları
  function guides(loc, t, L, max = 3) {
    const tr = L === 'tr', core = C(), S = G.HR_STARS;
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const now = core.at(t, loc), H = horizonOf(t, obs);
    const ref = now.moon.alt > 0 ? { alt: now.moon.alt, az: now.moon.az, moon: true } : { alt: 0, az: now.sun.az, moon: false };
    const list = [];
    for (const o of core.skyObjects(t, obs)) if (o.kind === 'planet' && o.alt > 2 && o.mag < 2) list.push({ name: G.HRSky.objName(o.id, L), alt: o.alt, az: o.az, mag: o.mag });
    for (let i = 0; i < S.s.length; i += 3) { const m = S.s[i + 2] / 100; if (m > 1.3) continue; const nm = S.n[i / 3]; if (!nm) continue; const h = H(S.s[i] / 100, S.s[i + 1] / 100); if (h.alt > 3) list.push({ name: tr ? nm[0] : nm[1], alt: h.alt, az: h.az, mag: m }); }
    const sep = o => { const a = rad(o.alt), b = rad(ref.alt); return Math.acos(Math.min(1, Math.sin(a) * Math.sin(b) + Math.cos(a) * Math.cos(b) * Math.cos(rad(o.az - ref.az)))) * 180 / Math.PI; };
    const dark = now.sun.alt < -4;
    return list.filter(o => sep(o) < 60 && (dark || o.mag < -1)).sort((a, b) => (a.mag + sep(a) / 25) - (b.mag + sep(b) / 25)).slice(0, max).map(o => {
      const daz = ((o.az - ref.az + 540) % 360) - 180, dalt = o.alt - ref.alt;
      const lr = Math.abs(daz) < 1.5 ? '' : tr ? `${Math.abs(daz).toFixed(0)}° ${daz > 0 ? 'sağında' : 'solunda'}` : `${Math.abs(daz).toFixed(0)}° to the ${daz > 0 ? 'right' : 'left'}`;
      const ud = Math.abs(dalt) < 1.5 ? '' : tr ? `${Math.abs(dalt).toFixed(0)}° ${dalt > 0 ? 'yukarısında' : 'aşağısında'}` : `${Math.abs(dalt).toFixed(0)}° ${dalt > 0 ? 'above' : 'below'}`;
      const refTxt = ref.moon ? (tr ? 'hilâlin' : 'the crescent') : (tr ? 'gurûb noktasının' : 'the sunset point');
      return { name: o.name, mag: o.mag, alt: o.alt, az: o.az, text: tr ? `${refTxt} ${[lr, ud].filter(Boolean).join(', ') || 'hemen yanında'}` : `${[lr, ud].filter(Boolean).join(', ') || 'right next to'} ${refTxt}` };
    });
  }
  const Q = '@@N3@@';
  G.HRStarMap = { Q, draw, guides, horizonOf };
})(typeof globalThis !== 'undefined' ? globalThis : window);
