/* Batı ufku çizimi (v0.2): eşit ölçekli (1° yatay = 1° dikey), zaman kaydırıcılı, sahaya uygun. */
(function (G) {
  'use strict';
  const A = G.Astronomy;
  const C = () => G.HRCore;
  const NAMES = {
    tr: { Mercury: 'Utârid (Merkür)', Venus: 'Zühre (Venüs)', Mars: 'Merrîh (Mars)', Jupiter: 'Müşterî (Jüpiter)', Saturn: 'Zuhal (Satürn)', Sirius: 'Şi’râ (Sirius)', Canopus: 'Süheyl (Canopus)', Polaris: 'Kutup yıldızı' },
    en: { Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars', Jupiter: 'Jupiter', Saturn: 'Saturn' }
  };
  const objName = (id, L) => (NAMES[L] && NAMES[L][id]) || id;
  const CARD = { tr: ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'], en: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'] };
  const card = (az, L) => CARD[L][Math.round(((az % 360) + 360) % 360 / 22.5) % 16];
  function col(name) { return getComputedStyle(document.body).getPropertyValue(name).trim() || '#888'; }
  function hex(c) { const m = c.match(/^#?([0-9a-f]{6})$/i); if (!m) return [128, 128, 128]; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function mix(a, b, f) { const x = hex(a), y = hex(b); f = Math.max(0, Math.min(1, f)); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * f)).join(',')})`; }
  function fists(d) { const f = Math.abs(d) / 10; if (f < 0.2) return null; return Math.round(f * 4) / 4; }
  function fistTxt(d, L) {
    const f = fists(d); if (f == null) return L === 'tr' ? `${Math.round(Math.abs(d))} parmak` : `${Math.round(Math.abs(d))} finger(s)`;
    const w = Math.floor(f), r = f - w, fr = r === 0.25 ? '¼' : r === 0.5 ? '½' : r === 0.75 ? '¾' : '';
    return (L === 'tr' ? '≈ ' : '≈ ') + `${w || ''}${fr}` + (L === 'tr' ? ' yumruk' : (f === 1 ? ' fist' : ' fists'));
  }
  function phase(alt, L) {
    const tr = L === 'tr';
    if (alt > -0.83) return tr ? 'Güneş ufkun üstünde' : 'Sun above horizon';
    if (alt > -6) return tr ? 'Sivil alacakaranlık' : 'Civil twilight';
    if (alt > -12) return tr ? 'Denizci alacakaranlığı' : 'Nautical twilight';
    if (alt > -17) return tr ? 'Kızıllık sürüyor' : 'Red glow persists';
    if (alt > -19) return tr ? 'Kızıllık bitti, beyazlık sürüyor' : 'Red gone, white glow persists';
    return tr ? 'Gece (şafak bitti)' : 'Night (twilight over)';
  }

  // r: HRCore.evening sonucu; loc; t: seçili an (AstroTime); L: dil; opt: {compact}
  function draw(r, loc, t, L, opt = {}) {
    const core = C();
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const tr = L === 'tr';
    const end = r.moonUp && r.moonset && r.lagMin > 0 ? r.moonset : r.gurub.AddDays(70 / 1440);
    const pts = [];
    for (let m = -6; ; m += 2) { const tt = r.gurub.AddDays(m / 1440); if (tt.ut > end.ut + 1 / 1440) break; const p = core.topo('Moon', tt, obs); pts.push({ t: tt, az: p.az, alt: p.alt, m }); }
    const now = core.at(t, loc);
    const sunSetAz = r.sunAz;
    const azs = [sunSetAz, now.moon.az, ...pts.filter(p => p.alt > -3).map(p => p.az)];
    let a0 = Math.min(...azs) - 10, a1 = Math.max(...azs) + 10;
    const minSpan = opt.compact ? 44 : 56;
    if (a1 - a0 < minSpan) { const c = (a0 + a1) / 2; a0 = c - minSpan / 2; a1 = c + minSpan / 2; }
    const altMaxNeed = Math.max(14, ...pts.map(p => p.alt + 4), now.moon.alt + 5);
    const altMin = -4.5;
    const W = opt.compact ? 420 : 720;
    const F = (opt.compact ? 1.3 : 1) * (opt.scale || 1);
    let span = a1 - a0, ppd = W / span, H = (altMaxNeed - altMin) * ppd;
    if (H < 230) H = 230;
    if (H > 430) { ppd = 430 / (altMaxNeed - altMin); span = W / ppd; const c = (a0 + a1) / 2; a0 = c - span / 2; a1 = c + span / 2; H = 430; }
    const altMax = altMin + H / ppd;
    const X = az => (az - a0) * ppd, Y = alt => (altMax - alt) * ppd;
    const y0 = Y(0), y5 = Y(5);
    const sunAlt = now.sun.alt;
    const fDark = Math.max(0, Math.min(1, -sunAlt / 18));
    const top = mix(col('--sky-day'), col('--sky-night'), fDark), low = mix(col('--sky-dusk'), col('--sky-night'), Math.max(0, fDark * 1.2 - 0.1));
    const glowOp = Math.max(0, 0.9 - fDark * 1.1);
    const fmt = at => G.HRU.fmtTime(at).slice(0, 5);
    let s = `<svg class="sky" viewBox="0 0 ${W} ${H + 34}" role="img" aria-label="${tr ? 'Batı ufku' : 'Western horizon'}">
      <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${low}"/></linearGradient>
      <radialGradient id="glow" cx="0.5" cy="1" r="0.6"><stop offset="0" stop-color="${col('--sky-glow')}" stop-opacity="${glowOp.toFixed(2)}"/><stop offset="1" stop-color="${col('--sky-glow')}" stop-opacity="0"/></radialGradient></defs>
      <rect x="0" y="0" width="${W}" height="${y0}" fill="url(#skyg)"/>
      <ellipse cx="${X(now.sun.az)}" cy="${y0}" rx="${W * 0.35}" ry="${y0 * 0.8}" fill="url(#glow)"/>`;
    // irtifâ ızgarası (5° aralık)
    for (let a = 5; a < altMax; a += 5) s += `<line x1="0" x2="${W}" y1="${Y(a)}" y2="${Y(a)}" stroke="${col('--sky-grid')}" stroke-opacity=".22" stroke-width="${a === 5 ? 0 : 0.8}"/>${a % 10 === 0 ? `<text x="${W - 4}" y="${Y(a) - 3}" font-size="${11 * F}" text-anchor="end" fill="${col('--sky-label')}" opacity=".75">${a}°</text>` : ''}`;
    // diğer gök cisimleri
    const objs = core.skyObjects(t, obs).filter(o => o.alt > -0.5 && o.az > a0 && o.az < a1 && o.alt < altMax && (o.kind === 'planet' ? o.mag < 3 : o.mag < 1.7) && fDark > 0.15);
    for (const o of objs) {
      const rr = Math.max(1.4, Math.min(4.5, 3.4 - o.mag * 0.8));
      s += `<circle cx="${X(o.az)}" cy="${Y(o.alt)}" r="${rr}" fill="${col('--sky-star')}"/><text x="${X(o.az) + rr + 3}" y="${Y(o.alt) + 4}" font-size="${11 * F}" fill="${col('--sky-label')}" opacity=".85">${objName(o.id, L)}</text>`;
    }
    // 5° çizgisi (kitap)
    s += `<line x1="0" x2="${W}" y1="${y5}" y2="${y5}" stroke="${col('--accent')}" stroke-dasharray="7 5" stroke-width="1.4"/>
      <text x="6" y="${y5 - 6}" font-size="${12 * F}" fill="${col('--sky-label')}" font-weight="600">5° · ${tr ? 'Tam İlmihâl’in sınırı (s. 360)' : 'Tam İlmihâl limit (p. 360)'}</text>`;
    // ay yolu: pencere (kalın) ve devamı
    const vis = pts.filter(p => p.alt > -1);
    if (vis.length > 1) {
      const P = arr => arr.map(p => `${X(p.az).toFixed(1)},${Y(p.alt).toFixed(1)}`).join(' ');
      s += `<polyline fill="none" stroke="${col('--sky-label')}" stroke-opacity=".45" stroke-width="1.4" points="${P(vis)}"/>`;
      const win = vis.filter(p => p.m >= 0 && (!r.windowEnd || p.t.ut <= r.windowEnd.ut + 1e-6) && p.alt >= 5);
      if (win.length > 1) s += `<polyline fill="none" stroke="${col('--accent')}" stroke-width="4" stroke-linecap="round" stroke-opacity=".85" points="${P(win)}"/>`;
      for (const p of vis) {
        if (p.m < 0 || p.m % 10 !== 0) continue;
        const lab = p.m % 20 === 0;
        s += `<circle cx="${X(p.az)}" cy="${Y(p.alt)}" r="2.6" fill="${col('--sky-label')}"/>` + (lab ? `<text x="${X(p.az) - 6}" y="${Y(p.alt) - 7}" font-size="${11 * F}" text-anchor="end" fill="${col('--sky-label')}" opacity=".9">${fmt(p.t)}</text>` : '');
      }
    }
    // yer
    s += `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${col('--ground')}"/>`;
    // güneşin battığı nokta
    s += `<path d="M${X(sunSetAz)} ${y0 - 1} l-6 9 h12z" fill="${col('--accent')}"/><text x="${X(sunSetAz)}" y="${y0 + 22}" font-size="${11 * F}" text-anchor="middle" fill="${col('--sky-label')}">${tr ? 'gurûb noktası' : 'sunset point'}</text>`;
    // seçili andaki güneş (ufkun altında)
    if (sunAlt < 0) s += `<circle cx="${X(now.sun.az)}" cy="${Math.min(H - 6, Y(sunAlt))}" r="6" fill="none" stroke="${col('--accent')}" stroke-width="1.5" stroke-dasharray="2 2"/>`;
    // seçili andaki hilâl, yönü ve ölçüsü
    const mx = X(now.moon.az), my = Y(now.moon.alt);
    if (now.moon.alt > -1 && now.moon.az > a0 && now.moon.az < a1) {
      const sx = X(now.sun.az), sy = Y(sunAlt);
      const ang = Math.atan2(sy - my, sx - mx) * 180 / Math.PI;
      const dx = now.moon.az - sunSetAz;
      // gurûb noktasından L biçimli ölçü
      s += `<path d="M${X(sunSetAz)} ${y0} H${mx} V${my + 12}" fill="none" stroke="${col('--sky-label')}" stroke-opacity=".7" stroke-dasharray="3 4"/>`;
      s += `<text x="${(X(sunSetAz) + mx) / 2}" y="${y0 - 6}" font-size="${12 * F}" text-anchor="middle" fill="${col('--sky-label')}" font-weight="600">${Math.abs(dx).toFixed(1)}° ${dx < 0 ? (tr ? 'sol' : 'left') : (tr ? 'sağ' : 'right')}</text>`;
      s += `<text x="${mx + (dx < 0 ? -8 : 8)}" y="${(y0 + my) / 2 + 10}" font-size="${12 * F}" text-anchor="${dx < 0 ? 'end' : 'start'}" fill="${col('--sky-label')}" font-weight="600">${now.moon.alt.toFixed(1)}° ${tr ? 'yukarı' : 'up'}</text>`;
      s += `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${ang.toFixed(1)})"><circle r="11" fill="${col('--sky-night')}" stroke="${col('--sky-label')}" stroke-opacity=".35"/><path d="M0 -11 A11 11 0 0 1 0 11 A14 14 0 0 0 0 -11Z" fill="${col('--moon')}"/></g>`;
      if (r.best && Math.abs(t.ut - r.best.ut) < 1.5 / 1440) s += `<circle cx="${mx}" cy="${my}" r="17" fill="none" stroke="${col('--accent')}" stroke-width="2"/>`;
    }
    // yumruk ölçeği
    const fx = 14, fy = H - 14;
    s += `<g><line x1="${fx}" x2="${fx + 10 * ppd}" y1="${fy}" y2="${fy}" stroke="${col('--sky-label')}" stroke-width="2"/><line x1="${fx}" x2="${fx}" y1="${fy - 5}" y2="${fy + 5}" stroke="${col('--sky-label')}" stroke-width="2"/><line x1="${fx + 10 * ppd}" x2="${fx + 10 * ppd}" y1="${fy - 5}" y2="${fy + 5}" stroke="${col('--sky-label')}" stroke-width="2"/>
      <text x="${fx + 10 * ppd + 6}" y="${fy + 4}" font-size="${11 * F}" fill="${col('--sky-label')}">10° ≈ ${tr ? '1 yumruk (kol uzatılmış)' : '1 fist at arm’s length'}</text></g>`;
    // semt ölçeği ve yönler
    s += `<rect x="0" y="${H}" width="${W}" height="34" fill="${col('--surface-2')}"/>`;
    for (let a = Math.ceil(a0 / 5) * 5; a <= a1; a += 5) {
      const major = a % 10 === 0;
      s += `<line x1="${X(a)}" x2="${X(a)}" y1="${H}" y2="${H + (major ? 7 : 4)}" stroke="${col('--muted')}"/>`;
      if (major) s += `<text class="nohalo" x="${X(a)}" y="${H + 19}" font-size="${10 * F}" text-anchor="middle" fill="${col('--muted')}">${((a % 360) + 360) % 360}°</text>`;
      if (a % 22.5 === 0 || (a * 2) % 45 === 0) { /* noop */ }
    }
    for (let k = Math.ceil(a0 / 22.5); k * 22.5 <= a1; k++) {
      const a = k * 22.5; s += `<text class="nohalo" x="${X(a)}" y="${H + 31}" font-size="${11 * F}" font-weight="700" text-anchor="middle" fill="${col('--ink')}">${card(a, L)}</text>`;
    }
    s += '</svg>';
    // okuma paneli
    const dx = now.moon.az - sunSetAz;
    const side = dx < 0 ? (tr ? 'solunda' : 'to the left') : (tr ? 'sağında' : 'to the right');
    const up = now.moon.alt;
    const flags = [];
    if (up < 0) flags.push(tr ? 'Hilâl ufkun altında' : 'Crescent below the horizon');
    else if (up < 5) flags.push(tr ? 'Hilâl 5°’nin altında: Tam İlmihâl’e göre görülemez' : 'Crescent below 5°: not visible per Tam İlmihâl');
    if (sunAlt > -0.83) flags.push(tr ? 'Güneş henüz batmadı' : 'The Sun has not set yet');
    const read = {
      time: G.HRU.fmtTime(t), phase: phase(sunAlt, L), moonAlt: up, moonAz: now.moon.az, card: card(now.moon.az, L), sunAlt,
      where: up > -1 ? (tr ? `Hilâl, gurûb noktasının ${Math.abs(dx).toFixed(1)}° ${side} (${fistTxt(dx, L)}), ufkun ${up.toFixed(1)}° üstünde (${fistTxt(up, L)}).`
        : `The crescent is ${Math.abs(dx).toFixed(1)}° ${side} of the sunset point (${fistTxt(dx, L)}), ${up.toFixed(1)}° above the horizon (${fistTxt(up, L)}).`) : '',
      flags, objs: objs.filter(o => o.kind === 'planet').map(o => ({ name: objName(o.id, L), alt: o.alt, az: o.az, mag: o.mag }))
    };
    return { svg: s, read, range: [r.gurub.AddDays(-6 / 1440), end] };
  }

  // 360° panorama (v0.3): seçili an batı penceresi dışında kaldığında bütün ufuk; yatayda semt 0–360°, dikeyde irtifâ −12°…+62° (ölçek eşit değildir)
  function panorama(loc, t, L, opt = {}) {
    const core = C(), tr = L === 'tr';
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const now = core.at(t, loc);
    const W = opt.W || (opt.compact ? 420 : 720), F = (opt.wide ? 1.25 : opt.compact ? 1.3 : 1) * (opt.scale || 1), H = opt.wide ? 290 : opt.compact ? 210 : 250;
    const aMin = -12, aMax = 62, c0 = 0;
    const X = az => ((az - c0 + 360) % 360) / 360 * W, Y = alt => (aMax - Math.max(aMin, Math.min(aMax, alt))) / (aMax - aMin) * H;
    const y0 = Y(0), y5 = Y(5);
    const fDark = Math.max(0, Math.min(1, -now.sun.alt / 18));
    const top = mix(col('--sky-day'), col('--sky-night'), fDark), low = mix(col('--sky-dusk'), col('--sky-night'), Math.max(0, fDark * 1.2 - 0.1));
    let s = `<svg class="sky" viewBox="0 0 ${W} ${H + 30}" role="img" aria-label="${tr ? 'Bütün ufuk' : 'Full horizon'}">
      <defs><linearGradient id="skyp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${low}"/></linearGradient></defs>
      <rect x="0" y="0" width="${W}" height="${y0}" fill="url(#skyp)"/>`;
    for (let a = 10; a < aMax; a += 10) s += `<line x1="0" x2="${W}" y1="${Y(a)}" y2="${Y(a)}" stroke="${col('--sky-grid')}" stroke-opacity=".22"/><text x="${W - 4}" y="${Y(a) - 3}" font-size="${10 * F}" text-anchor="end" fill="${col('--sky-label')}" opacity=".7">${a}°</text>`;
    s += `<line x1="0" x2="${W}" y1="${y5}" y2="${y5}" stroke="${col('--accent')}" stroke-dasharray="7 5" stroke-width="1.2"/><text x="6" y="${y5 - 5}" font-size="${11 * F}" fill="${col('--sky-label')}" font-weight="600">5°</text>`;
    const objs = core.skyObjects(t, obs).filter(o => o.alt > -0.5 && (o.kind === 'planet' ? o.mag < 2.5 : o.mag < 1.0) && fDark > 0.2);
    for (const o of objs) { const rr = Math.max(1.3, Math.min(4, 3.2 - o.mag * 0.8)); s += `<circle cx="${X(o.az)}" cy="${Y(o.alt)}" r="${rr}" fill="${col('--sky-star')}"/>` + (o.kind === 'planet' ? `<text x="${X(o.az) + rr + 3}" y="${Y(o.alt) + 4}" font-size="${10 * F}" fill="${col('--sky-label')}" opacity=".85">${objName(o.id, L)}</text>` : ''); }
    s += `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${col('--ground')}" opacity=".92"/>`;
    // güneş
    const sx = X(now.sun.az), sy = Y(now.sun.alt);
    s += now.sun.alt > -0.83 ? `<circle cx="${sx}" cy="${sy}" r="8" fill="${col('--accent')}"/>` : `<circle cx="${sx}" cy="${sy}" r="7" fill="none" stroke="${col('--accent')}" stroke-width="1.5" stroke-dasharray="2 2"/>`;
    s += `<text x="${sx}" y="${Math.min(H - 4, sy + 20)}" font-size="${11 * F}" text-anchor="middle" fill="${col('--sky-label')}">${tr ? 'Güneş' : 'Sun'} ${now.sun.alt.toFixed(0)}°</text>`;
    // ay (aydınlık kenar güneşe döner; aydınlanma oranına göre biçim)
    const mx = X(now.moon.az), my = Y(now.moon.alt), k = A.Illumination('Moon', t).phase_fraction;
    const ang = Math.atan2(sy - my, (((now.sun.az - now.moon.az + 540) % 360) - 180) / 360 * W) * 180 / Math.PI;
    const rx = Math.abs(1 - 2 * k) * 10, sweep = k > 0.5 ? 1 : 0;
    const op = now.moon.alt < 0 ? 0.45 : 1;
    s += `<g opacity="${op}" transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${ang.toFixed(1)})"><circle r="10" fill="${col('--sky-night')}" fill-opacity=".45" stroke="${col('--moon')}" stroke-width="1.2"/><path d="M0 -10 A10 10 0 0 1 0 10 A${rx.toFixed(2)} 10 0 0 ${sweep} 0 -10Z" fill="${col('--moon')}"/></g>`;
    s += `<text x="${mx}" y="${my - 15}" font-size="${11 * F}" text-anchor="middle" fill="${col('--sky-label')}" font-weight="600">${tr ? 'Ay' : 'Moon'} ${now.moon.alt.toFixed(1)}°</text>`;
    s += `<rect x="0" y="${H}" width="${W}" height="30" fill="${col('--surface-2')}"/>`;
    for (let a = 0; a < 360; a += 45) s += `<line x1="${X(a)}" x2="${X(a)}" y1="${H}" y2="${H + 6}" stroke="${col('--muted')}"/><text class="nohalo" x="${Math.max(10, X(a))}" y="${H + 22}" font-size="${11 * F}" font-weight="700" text-anchor="middle" fill="${col('--ink')}">${card(a, L)}</text>`;
    s += '</svg>';
    const flags = [];
    if (now.moon.alt < 0) flags.push(tr ? `Ay ufkun ${Math.abs(now.moon.alt).toFixed(1)}° altında` : `Moon ${Math.abs(now.moon.alt).toFixed(1)}° below the horizon`);
    if (now.sun.alt > -0.83) flags.push(tr ? 'Güneş ufkun üstünde' : 'Sun above the horizon');
    return { svg: s, read: { phase: phase(now.sun.alt, L), moonAlt: now.moon.alt, moonAz: now.moon.az, card: card(now.moon.az, L), sunAlt: now.sun.alt, sunAz: now.sun.az, flags, mx: mx / W, objs: objs.filter(o => o.kind === 'planet').map(o => ({ name: objName(o.id, L), alt: o.alt, az: o.az, mag: o.mag })) } };
  }
  G.HRSky = { draw, panorama, objName, card, fistTxt, phase };
})(typeof globalThis !== 'undefined' ? globalThis : window);
