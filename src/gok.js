/* Gök cisimleri aracı: seçili anda Güneş, Ay, gezegenler ve parlak yıldızlar (Astronomy Engine 2.1.19).
 * Konum (yükseklik, semt, sağ açıklık, dik açıklık), doğuş–meridyen–batış, parlaklık, takımyıldız, Güneş’e açı ve
 * çıplak göz için kaba bir görünürlük değerlendirmesi. Ek bilgidir; hilâl rasadının Tam İlmihâl’e göre değerlendirmesini
 * (Tam İlmihâl s. 360) etkilemez. Yıldız konumları J2000 katalog değerlerinden tarihin ekinoksuna döndürülür; doğuş ve
 * batış yıldızlar için yerel yıldız zamanından, diğer cisimler için Astronomy Engine aramalarıyla bulunur. */
(function (G) {
  'use strict';
  const A = G.Astronomy;
  const PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  // J2000: ad, RA (saat), Dec (°), kadir (Hipparcos)
  const STARS = [
    ['Sirius', 6.7525, -16.716, -1.46], ['Canopus', 6.3992, -52.696, -0.74], ['Rigil Kentaurus', 14.6600, -60.835, -0.27], ['Arcturus', 14.2610, 19.182, -0.05],
    ['Vega', 18.6156, 38.784, 0.03], ['Capella', 5.2782, 45.998, 0.08], ['Rigel', 5.2423, -8.202, 0.13], ['Procyon', 7.6550, 5.225, 0.34],
    ['Achernar', 1.6286, -57.237, 0.46], ['Betelgeuse', 5.9195, 7.407, 0.50], ['Hadar', 14.0637, -60.373, 0.61], ['Altair', 19.8464, 8.868, 0.76],
    ['Acrux', 12.4433, -63.099, 0.76], ['Aldebaran', 4.5987, 16.509, 0.86], ['Antares', 16.4901, -26.432, 0.96], ['Spica', 13.4199, -11.161, 0.97],
    ['Pollux', 7.7553, 28.026, 1.14], ['Fomalhaut', 22.9608, -29.622, 1.16], ['Deneb', 20.6905, 45.280, 1.25], ['Mimosa', 12.7954, -59.689, 1.25],
    ['Regulus', 10.1395, 11.967, 1.35], ['Adhara', 6.9771, -28.972, 1.50], ['Castor', 7.5767, 31.888, 1.58], ['Shaula', 17.5601, -37.104, 1.62],
    ['Bellatrix', 5.4189, 6.350, 1.64], ['Elnath', 5.4382, 28.608, 1.65], ['Alnilam', 5.6036, -1.202, 1.69], ['Alioth', 12.9005, 55.960, 1.76],
    ['Dubhe', 11.0621, 61.751, 1.79], ['Mirfak', 3.4054, 49.861, 1.79], ['Alkaid', 13.7923, 49.313, 1.85], ['Polaris', 2.5303, 89.264, 1.98]];
  const NAMES = {
    tr: { Sun: 'Güneş', Moon: 'Ay', Mercury: 'Merkür (Utârid)', Venus: 'Venüs (Zühre)', Mars: 'Mars (Merrîh)', Jupiter: 'Jüpiter (Müşterî)', Saturn: 'Satürn (Zuhal)', Uranus: 'Uranüs', Neptune: 'Neptün',
      Sirius: 'Sirius (Şi’râ)', Canopus: 'Canopus (Süheyl)', Polaris: 'Kutup yıldızı (Polaris)', Vega: 'Vega (Vâkı’)', Altair: 'Altair (Tâir)', Aldebaran: 'Aldebaran (Deberân)', Regulus: 'Regulus (Kalbü’l-esed)', Spica: 'Spica (Simâk-ı a’zel)', Arcturus: 'Arcturus (Simâk-ı râmih)', Antares: 'Antares (Kalbü’l-akreb)', Fomalhaut: 'Fomalhaut (Femü’l-hût)', Deneb: 'Deneb (Zeneb)' },
    en: { Sun: 'Sun', Moon: 'Moon' }
  };
  const nameOf = (id, L) => (NAMES[L] && NAMES[L][id]) || id;
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, SID = 1.00273790935;
  const mod = (x, m) => ((x % m) + m) % m;

  // Çıplak göz için en sönük görülebilir kadir: güneşin yüksekliğine göre (kaba ve temkinli bir ölçek)
  function limitMag(sunAlt) {
    if (sunAlt > -0.8333) return -3.5;   // gündüz: yalnız çok parlak cisimler, yeri bilinirse
    if (sunAlt > -6) return 0.5;         // sivil alacakaranlık
    if (sunAlt > -12) return 3;          // denizci alacakaranlığı
    if (sunAlt > -18) return 4.5;        // astronomik alacakaranlık
    return 5.5;                          // gece (şehir dışı orta karanlıkta temkinli sınır)
  }
  // Ufka yakınlıkta sönükleşme: k = 0,28 kadir/hava kütlesi (Kasten–Young hava kütlesi)
  function extinction(alt) {
    if (alt <= 0) return 9;
    const X = 1 / (Math.sin(alt * D2R) + 0.50572 * Math.pow(alt + 6.07995, -1.6364));
    return 0.28 * (X - 1);
  }
  // görünürlük durumu: vis (görülebilir) · bright (gökyüzü fazla aydınlık) · low (ufka çok yakın) · down (ufkun altında) · sun · near (Güneş’e çok yakın)
  function state(o, sunAlt) {
    if (o.id === 'Sun') return o.alt > -0.8333 ? 'sun' : 'down';
    if (o.alt <= 0) return 'down';
    if (o.elong != null && o.elong < (o.id === 'Moon' ? 8 : 10)) return 'near';
    if (o.alt < 3) return 'low';
    if (o.id === 'Moon') return sunAlt > -0.8333 && o.elong < 30 ? 'bright' : 'vis';
    return o.mag + extinction(o.alt) <= limitMag(sunAlt) ? 'vis' : (o.alt < 8 && o.mag <= limitMag(sunAlt) ? 'low' : 'bright');
  }

  // Seçili anda bütün cisimler
  function at(loc, t) {
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const out = [], hz = (ra, dec) => { const n = A.Horizon(t, obs, ra, dec, 'normal'); return { alt: n.altitude, az: n.azimuth }; };
    const solar = id => {
      const eq = A.Equator(id, t, obs, true, true), h = hz(eq.ra, eq.dec), j = A.Equator(id, t, obs, false, true);
      let mag = null, ill = null, elong = null;
      if (id === 'Sun') mag = -26.74;
      else { try { const il = A.Illumination(id, t); mag = il.mag; ill = il.phase_fraction; } catch (e) { /* */ } elong = A.AngleFromSun(id, t); }
      let con = null; try { con = A.Constellation(j.ra, j.dec); } catch (e) { /* */ }
      return { id, kind: id === 'Sun' || id === 'Moon' ? id.toLowerCase() : 'planet', alt: h.alt, az: h.az, ra: eq.ra, dec: eq.dec, dist: eq.dist, mag, ill, elong, con: con && con.name, conSym: con && con.symbol };
    };
    out.push(solar('Sun'), solar('Moon'));
    for (const p of PLANETS) out.push(solar(p));
    const rot = A.Rotation_EQJ_EQD(t);
    for (const [id, ra, dec, mag] of STARS) {
      const v = A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(dec, ra * 15, 1), t)), eq = A.EquatorFromVector(v), h = hz(eq.ra, eq.dec);
      let con = null; try { con = A.Constellation(ra, dec); } catch (e) { /* */ }
      out.push({ id, kind: 'star', alt: h.alt, az: h.az, ra: eq.ra, dec: eq.dec, dist: null, mag, ill: null, elong: null, con: con && con.name, conSym: con && con.symbol });
    }
    const sunAlt = out[0].alt;
    for (const o of out) o.state = state(o, sunAlt);
    return { sunAlt, list: out, obs };
  }

  // Seçili gün için doğuş, meridyen geçişi ve batış (t0: o günün yerel gece yarısı)
  const dayCache = new Map();
  function day(loc, t0, key) {
    if (dayCache.has(key)) return dayCache.get(key);
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0)), out = {};
    const inDay = x => x && x.ut >= t0.ut && x.ut < t0.ut + 1 ? x : null;
    for (const id of ['Sun', 'Moon', ...PLANETS]) {
      let rise = null, set = null, tr = null, trAlt = null;
      try { rise = inDay(A.SearchRiseSet(id, obs, +1, t0, 1)); } catch (e) { /* */ }
      try { set = inDay(A.SearchRiseSet(id, obs, -1, t0, 1)); } catch (e) { /* */ }
      try { const h = A.SearchHourAngle(id, obs, 0, t0); tr = inDay(h && h.time); trAlt = h && h.hor ? h.hor.altitude : null; } catch (e) { /* */ }
      out[id] = { rise, set, tr, trAlt };
    }
    // yıldızlar: yerel yıldız zamanından (h0 = −0,5667°, kırılma dâhil; yıldızlar için yarıçap yok)
    const rot = A.Rotation_EQJ_EQD(t0), lst0 = mod(A.SiderealTime(t0) + loc.lon / 15, 24), phi = loc.lat * D2R, sh0 = Math.sin(-0.5667 * D2R);
    for (const [id, ra, dec] of STARS) {
      const eq = A.EquatorFromVector(A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(dec, ra * 15, 1), t0)));
      const trH = mod(eq.ra - lst0, 24) / SID, tr = t0.AddDays(trH / 24), d = eq.dec * D2R;
      const c = (sh0 - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d));
      const trAlt = 90 - Math.abs(loc.lat - eq.dec);
      if (c < -1) { out[id] = { rise: null, set: null, tr, trAlt, always: true }; continue; }
      if (c > 1) { out[id] = { rise: null, set: null, tr: null, trAlt, never: true }; continue; }
      const H0 = Math.acos(c) * R2D / 15 / SID;   // saat
      const r = tr.AddDays(-H0 / 24), s = tr.AddDays(H0 / 24);
      const wrap = x => x.ut < t0.ut ? x.AddDays(1 / SID) : x.ut >= t0.ut + 1 ? x.AddDays(-1 / SID) : x;
      out[id] = { rise: wrap(r), set: wrap(s), tr, trAlt };
    }
    dayCache.set(key, out); if (dayCache.size > 40) dayCache.delete(dayCache.keys().next().value);
    return out;
  }

  // Bu gece: gurûbdan ertesi güneş doğuşuna kadar, her cismin çıplak gözle görülebildiği aralık ve en yüksek olduğu an.
  // Hız için örnekleme hafiftir: parlaklık ve takımyıldız gece boyunca sabit alınır; yıldızların tarih ekinoksu konumu bir kez hesaplanır.
  const nightCache = new Map();
  function night(loc, sunset, sunrise, key) {
    if (nightCache.has(key)) return nightCache.get(key);
    const out = {}; if (!sunset || !sunrise || sunrise.ut <= sunset.ut) return out;
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const mid = sunset.AddDays((sunrise.ut - sunset.ut) / 2), base = at(loc, mid).list.filter(o => o.kind !== 'sun');
    const rot = A.Rotation_EQJ_EQD(mid), starEq = {};
    for (const [id, ra, dec] of STARS) starEq[id] = A.EquatorFromVector(A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(dec, ra * 15, 1), mid)));
    const n = Math.min(120, Math.max(12, Math.round((sunrise.ut - sunset.ut) * 1440 / 8)));
    for (let i = 0; i <= n; i++) {
      const t = sunset.AddDays((sunrise.ut - sunset.ut) * i / n);
      const se = A.Equator('Sun', t, obs, true, true), sunAlt = A.Horizon(t, obs, se.ra, se.dec, 'normal').altitude;
      for (const b of base) {
        const eq = b.kind === 'star' ? starEq[b.id] : A.Equator(b.id, t, obs, true, true), h = A.Horizon(t, obs, eq.ra, eq.dec, 'normal');
        const o = { id: b.id, kind: b.kind, alt: h.altitude, az: h.azimuth, mag: b.mag, elong: b.elong };
        const x = out[b.id] || (out[b.id] = { from: null, to: null, best: null, bestAlt: -90, bestAz: null });
        if (state(o, sunAlt) === 'vis') { if (!x.from) x.from = t; x.to = t; if (o.alt > x.bestAlt) { x.bestAlt = o.alt; x.best = t; x.bestAz = o.az; } }
      }
    }
    nightCache.set(key, out); if (nightCache.size > 20) nightCache.delete(nightCache.keys().next().value);
    return out;
  }

  G.HRGok = { at, day, night, nameOf, limitMag, extinction, PLANETS, STARS };
})(typeof globalThis !== 'undefined' ? globalThis : window);
