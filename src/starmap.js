/* Gökyüzü haritası: seçili an için bütün gök; stereografik izdüşüm, merkez başucu (zenit), kenar ufuk.
 * Bakış yönü alta gelir (varsayılan batı: hilâl rasadında yüzü batıya dönük gözlemci haritayı başının üstünde tutar gibi).
 * Yıldızlar ve takımyıldız çizgileri: d3-celestial (BSD-3-Clause). Gezegenler, Ay ve Güneş: Astronomy Engine. */
(function (G) {
  'use strict';
  let UID = 0;   // her çizime ayrı SVG kimliği: aynı sayfadaki iki çizim birbirinin gradyanını kullanmasın
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
    const u = ++UID;
    let s = `<svg class="sky starmap" viewBox="0 0 ${W} ${W}" width="100%" role="img" aria-label="${tr ? 'Gökyüzü haritası' : 'Sky chart'}" style="--lab:${lab};--halo:${halo}">`;
    s += `<defs><clipPath id="smClip${u}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><radialGradient id="smBg${u}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${col('--sky-night')}"/><stop offset="1" stop-color="${dark > 0.5 ? col('--sky-night') : col('--sky-dusk')}"/></radialGradient></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#smBg${u})" stroke="${col('--line')}"/>`;
    s += `<g clip-path="url(#smClip${u})">`;
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
    // akşam izi: hilâlin seçili akşamdaki yerleri (zaman etiketli) ve gurûb noktası
    if (opt.track && opt.track.length) {
      const pts = opt.track.map(k => { const m = core.at(k.t, loc).moon; return { k, alt: m.alt, az: m.az }; }).filter(p => p.alt > -0.5);
      if (pts.length > 1) s += `<path d="${pts.map((p, i) => { const [x, y] = P(Math.max(0, p.alt), p.az); return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }).join('')}" fill="none" stroke="${col('--moon')}" stroke-width="1.6" stroke-dasharray="1 4" stroke-linecap="round"/>`;
      for (const p of pts) {
        const [x, y] = P(Math.max(0, p.alt), p.az);
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p.k.mark ? 3.4 : 2.4}" fill="${p.k.mark ? acc : col('--moon')}" stroke="${halo}" stroke-width=".8"/>`;
        if (p.k.label) names.push({ x, y, r: 4, txt: p.k.label, small: true });
      }
    }
    if (opt.gurubAz != null) {
      const a = rad(opt.gurubAz - face), x = cx + (R - 2) * Math.sin(a), y = cy + (R - 2) * Math.cos(a);
      s += `<path d="M${(x - 7).toFixed(1)} ${y.toFixed(1)} A7 7 0 0 1 ${(x + 7).toFixed(1)} ${y.toFixed(1)}Z" fill="${acc}" fill-opacity=".85"/>`;
      names.push({ x, y: y - 4, r: 8, txt: tr ? 'gurûb noktası' : 'sunset point', key: true });
    }
    // etiketler: üst üste binmeyi önleyen basit yerleştirme
    const placed = [];
    const pri = n => n.strong ? 3 : n.small || n.key ? 2 : 0;   // önce Ay/Güneş, sonra akşam izi ve gurûb noktası, sonra yıldızlar
    names.sort((a, b) => pri(b) - pri(a));
    for (const n of names) {
      const fs = (n.strong ? 12.5 : n.small ? 9.5 : 11) * F, w = n.txt.length * fs * 0.56;
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
    for (let i = 0; i < 8; i++) { const az = i * 45, a = rad(az - face), x = cx + (R + 16) * Math.sin(a), y = cy + (R + 16) * Math.cos(a); s += `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" font-size="${((i % 2 ? 11 : 14) * F).toFixed(1)}" font-weight="700" text-anchor="middle" fill="${col('--ink')}" class="nohalo">${card[i]}<tspan font-size="0.7em" font-weight="500" dx="2" opacity=".75">${az}°</tspan></text>`; }
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
  // Seçili akşam: batı yarım göğü (semt 180°–360°, irtifâ −6°…54°), eşit aralıklı semt/irtifâ ızgarası.
  // Yıldızlar ve gezegenler harita anındadır; hilâlin akşam boyunca yeri zaman etiketli noktalarla gösterilir.
  function drawWest(loc, t, L, opt = {}) {
    const tr = L === 'tr', S = G.HR_STARS, core = C();
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0)), H = horizonOf(t, obs);
    const W = opt.w || 900, Hh = opt.h || 470, padL = 34, padB = 26, padT = 8, F = opt.scale || 1;
    // semt aralığı: merkez (gurûb noktası ile hilâlin ortası), genişlik opt.span; irtifâ ölçeği semtle aynı (açılar bozulmaz)
    const span = opt.span || 190, azC = opt.center != null ? opt.center : opt.gurubAz != null ? opt.gurubAz : 270, az0 = azC - span / 2, az1 = azC + span / 2;
    const ppd0 = (W - padL - 6) / span, altMin = opt.altMin != null ? opt.altMin : -4, altMax = altMin + (Hh - padT - padB) / ppd0;
    const X = az => padL + ((((az - az0) % 360) + 360) % 360) / (az1 - az0) * (W - padL - 6);
    const inAz = az => { const d = (((az - az0) % 360) + 360) % 360; return d <= az1 - az0; };
    const Y = alt => padT + (altMax - alt) / (altMax - altMin) * (Hh - padT - padB), y0 = Y(0);
    const now = core.at(t, loc), dark = Math.max(0, Math.min(1, -now.sun.alt / 15));
    const lab = col('--sky-label') || '#fff', halo = col('--sky-halo') || '#000', star = col('--sky-star'), acc = col('--accent'), grid = col('--sky-grid');
    const u = ++UID;
    let s = `<svg class="sky starmap west" viewBox="0 0 ${W} ${Hh}" width="100%" role="img" aria-label="${tr ? 'Batı göğü, seçili akşam' : 'Western sky, selected evening'}" style="--lab:${lab};--halo:${halo}">`;
    s += `<defs><linearGradient id="swg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col('--sky-night')}"/><stop offset="1" stop-color="${dark > 0.6 ? col('--sky-night') : col('--sky-dusk') || col('--sky-day')}"/></linearGradient><clipPath id="swc${u}"><rect x="${padL}" y="${padT}" width="${W - padL - 6}" height="${y0 - padT}"/></clipPath></defs>`;
    s += `<rect x="${padL}" y="${padT}" width="${W - padL - 6}" height="${(y0 - padT).toFixed(1)}" fill="url(#swg${u})"/>`;
    s += `<rect x="${padL}" y="${y0.toFixed(1)}" width="${W - padL - 6}" height="${(Hh - padB - y0).toFixed(1)}" fill="${col('--ground')}" opacity=".85"/>`;
    // ızgara
    for (let a = 10; a < altMax; a += 10) s += `<line x1="${padL}" x2="${W - 6}" y1="${Y(a).toFixed(1)}" y2="${Y(a).toFixed(1)}" stroke="${grid}" stroke-opacity=".22"/><text class="nohalo" x="${padL - 4}" y="${(Y(a) + 4).toFixed(1)}" font-size="${10 * F}" text-anchor="end" fill="${col('--ink')}">${a}°</text>`;
    for (let a = Math.ceil(az0 / 10) * 10; a <= az1; a += 10) { const x = X(a), maj = a % 30 === 0; s += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${padT}" y2="${y0.toFixed(1)}" stroke="${grid}" stroke-opacity="${maj ? .22 : .1}"/>`; if (maj || span < 120) s += `<text class="nohalo" x="${x.toFixed(1)}" y="${(Hh - 8).toFixed(1)}" font-size="${10 * F}" text-anchor="middle" fill="${col('--ink')}">${((a % 360) + 360) % 360}°</text>`; }
    const card = tr ? ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    for (let i = 0; i < 8; i++) { const a = i * 45; if (!inAz(a)) continue; s += `<text x="${X(a).toFixed(1)}" y="${(y0 + 15).toFixed(1)}" font-size="${(i % 2 ? 11 : 13) * F}" font-weight="700" text-anchor="middle" fill="${lab}">${card[i]}</text>`; }
    s += `<line x1="${padL}" x2="${W - 6}" y1="${Y(5).toFixed(1)}" y2="${Y(5).toFixed(1)}" stroke="${acc}" stroke-dasharray="7 5" stroke-width="1.3"/>`;
    s += `<g clip-path="url(#swc${u})">`;
    // takımyıldız çizgileri
    let d = '';
    for (const ln of S.l) { let on = false, px = null; for (let i = 0; i < ln.length; i += 2) { const h = H(ln[i] / 100, ln[i + 1] / 100); if (h.alt < -2 || !inAz(h.az)) { on = false; continue; } const x = X(h.az), y = Y(h.alt); if (on && Math.abs(x - px) > W / 3) on = false; d += (on ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); on = true; px = x; } }
    s += `<path d="${d}" fill="none" stroke="${grid}" stroke-opacity=".4" stroke-width=".8"/>`;
    const lim = opt.limitMag || (dark > 0.7 ? 4.6 : dark > 0.35 ? 3.8 : 2.6), names = [];
    for (let i = 0; i < S.s.length; i += 3) {
      const m = S.s[i + 2] / 100; if (m > lim) continue;
      const h = H(S.s[i] / 100, S.s[i + 1] / 100); if (h.alt < -1 || !inAz(h.az)) continue;
      const x = X(h.az), y = Y(h.alt), r = Math.max(0.8, 3.6 - m * 0.65);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${star}"/>`;
      const nm = S.n[i / 3]; if (nm && m <= 1.8 && h.alt > 0) names.push({ x, y, r, txt: tr ? nm[0] : nm[1] });
    }
    s += '</g>';
    for (const o of core.skyObjects(t, obs).filter(o => o.kind === 'planet' && o.alt > -1 && inAz(o.az))) { const x = X(o.az), y = Y(o.alt); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4.4 - Math.min(2, Math.max(-4, o.mag)) * 0.35).toFixed(1)}" fill="${acc}" stroke="${halo}" stroke-width="1"/>`; names.push({ x, y, r: 6, txt: G.HRSky.objName(o.id, L), pri: 2 }); }
    // gurûb noktası ve Güneş (ufkun altında)
    if (opt.gurubAz != null) { const x = X(opt.gurubAz); s += `<path d="M${(x - 8).toFixed(1)} ${y0.toFixed(1)} A8 8 0 0 1 ${(x + 8).toFixed(1)} ${y0.toFixed(1)}Z" fill="${acc}"/>`; names.push({ x, y: y0 - 6, r: 9, txt: tr ? 'gurûb noktası' : 'sunset point', pri: 2 }); }
    if (now.sun.alt > altMin && inAz(now.sun.az)) { const x = X(now.sun.az), y = Y(now.sun.alt); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="none" stroke="${acc}" stroke-width="1.5" stroke-dasharray="2 2"/>`; }
    // hilâlin izi
    const pts = (opt.track || []).map(k => { const m = core.at(k.t, loc).moon; return { k, alt: m.alt, az: m.az }; }).filter(p => p.alt > altMin && inAz(p.az));
    if (pts.length > 1) s += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + X(p.az).toFixed(1) + ' ' + Y(p.alt).toFixed(1)).join('')}" fill="none" stroke="${col('--moon')}" stroke-width="1.6" stroke-dasharray="1 4" stroke-linecap="round"/>`;
    for (const p of pts) { const x = X(p.az), y = Y(p.alt); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p.k.mark ? 3.6 : 2.6}" fill="${p.k.mark ? acc : col('--moon')}" stroke="${halo}" stroke-width=".8"/>`; if (p.k.label) names.push({ x, y, r: 4, txt: p.k.label, small: true, pri: 3 }); }
    if (now.moon.alt > altMin && inAz(now.moon.az)) {
      const x = X(now.moon.az), y = Y(now.moon.alt), k = A.Illumination('Moon', t).phase_fraction, ang = Math.atan2(Y(now.sun.alt) - y, X(now.sun.az) - x) * 180 / Math.PI;
      const rx = Math.abs(1 - 2 * k) * 10, sw = k > 0.5 ? 1 : 0;
      s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})"><circle r="10" fill="${col('--sky-night')}" fill-opacity=".45" stroke="${col('--moon')}" stroke-width="1.2"/><path d="M0 -10 A10 10 0 0 1 0 10 A${rx.toFixed(2)} 10 0 0 ${sw} 0 -10Z" fill="${col('--moon')}"/></g>`;
      names.push({ x, y, r: 12, txt: (tr ? 'Hilâl ' : 'Crescent ') + now.moon.alt.toFixed(1) + '°', strong: true, pri: 4 });
    }
    // etiketler: öncelik sırasıyla, çakışmadan
    const placed = [];
    names.sort((a, b) => (b.pri || 0) - (a.pri || 0));
    for (const n of names) {
      const fs = (n.strong ? 13 : n.small ? 10 : 11) * F, w = n.txt.length * fs * 0.56;
      const cands = [[n.r + 3, fs * 0.35, 'start'], [-n.r - 3, fs * 0.35, 'end'], [0, -n.r - 4, 'middle'], [0, n.r + fs, 'middle'], [n.r + 3, -n.r - 2, 'start'], [-n.r - 3, n.r + fs, 'end']];
      for (const [dx, dy, anc] of cands) {
        const x0 = anc === 'start' ? n.x + dx : anc === 'end' ? n.x + dx - w : n.x - w / 2, y1 = n.y + dy - fs;
        const box = [x0, y1, x0 + w, y1 + fs * 1.2];
        if (box[0] < padL || box[2] > W - 4 || box[1] < padT) continue;
        if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
        placed.push(box);
        s += `<text x="${(n.x + dx).toFixed(1)}" y="${(n.y + dy).toFixed(1)}" font-size="${fs.toFixed(1)}" text-anchor="${anc}" fill="${lab}" font-weight="${n.strong ? 700 : n.small ? 600 : 500}">${esc(nb(n.txt))}</text>`;
        break;
      }
    }
    // 5° yazısı ve yumruk ölçeği (sağ üst)
    s += `<text x="${(W - 10).toFixed(1)}" y="${(Y(5) - 5).toFixed(1)}" font-size="${10.5 * F}" text-anchor="end" fill="${lab}" font-weight="600">5° · ${tr ? 'Tam İlmihâl’in sınırı (s. 360)' : 'Tam İlmihâl limit (p. 360)'}</text>`;
    const ppd = (W - padL - 6) / (az1 - az0), fx = W - 16 - 10 * ppd, fy = padT + 16;
    s += `<line x1="${fx.toFixed(1)}" x2="${(fx + 10 * ppd).toFixed(1)}" y1="${fy}" y2="${fy}" stroke="${lab}" stroke-width="2"/><text x="${(fx - 6).toFixed(1)}" y="${fy + 4}" font-size="${10 * F}" text-anchor="end" fill="${lab}">10° ≈ ${tr ? '1 yumruk' : '1 fist'}</text>`;
    s += `<rect x="${padL}" y="${padT}" width="${W - padL - 6}" height="${(Hh - padB - padT).toFixed(1)}" fill="none" stroke="${col('--line')}"/>`;
    return { svg: s + '</svg>' };
  }
  G.HRStarMap = { Q, draw, drawWest, guides, horizonOf };
})(typeof globalThis !== 'undefined' ? globalThis : window);
