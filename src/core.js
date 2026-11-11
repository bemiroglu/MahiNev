/* Hilâl Rü'yet Yardımcısı — hesap çekirdeği (v0.1)
 * Kanonik dayanak: Se'âdet-i Ebediyye (Hakîkat Kitâbevi), s. 175–186, 314–316, 326, 344, 358–362.
 * Astronomik motor: Astronomy Engine (Don Cross, MIT).
 * Bütün açılar derece, bütün anlar AstroTime (UT). */
(function (G) {
  'use strict';
  const A = G.Astronomy;
  const AU_KM = 149597870.7;
  const MOON_R_KM = 1737.4;
  const SUN_SD_1AU_DEG = 959.63 / 3600;     // güneşin 1 AU'daki görünen yarıçapı
  const SUN_PARALLAX_DEG = 8.8 / 3600;      // s. 179, s. 185
  const MIN = 1 / 1440;

  const K = {                                // Kanonik eşikler (rapor B.4, karar D1–D2)
    BOOK_MIN_ELONG: 8.0,                     // s. 360: 8°'den azken hiçbir yerde görülemez
    MODERN_MIN_ELONG: 7.5,                   // Fatoohi 1998, Sultan 2007 — ek bilgi
    OTTOMAN_ELONG: 18.0,                     // s. 360: a'zamî 18° (Osmanlı kabulü)
    MIN_ALT: 5.0,                            // s. 360: ufka 5° yaklaşınca görülemez
    SAFAK_EBYAD: -19.0,                      // s. 178: beyâzlığın kayboluşu, İmâm-ı a'zam (esas; s. 194: ihtiyâtlı olan)
    SAFAK_AHMAR: -17.0                       // s. 178: kırmızılığın kayboluşu, İmâmeyn ve diğer üç mezhep (alternatif)
  };

  // ---- yardımcılar ----
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  function T(x) { return A.MakeTime(x); }
  function bisect(f, t1, t2, n = 40) {        // f(t1), f(t2) zıt işaretli
    let a = t1, b = t2, fa = f(a);
    for (let i = 0; i < n; i++) {
      const m = a.AddDays((b.ut - a.ut) / 2), fm = f(m);
      if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else { b = m; }
      if ((b.ut - a.ut) < 0.2 / 86400) break;
    }
    return a.AddDays((b.ut - a.ut) / 2);
  }
  function sep(ra1, de1, ra2, de2) {          // ra saat, dec derece
    const a1 = rad(ra1 * 15), a2 = rad(ra2 * 15), d1 = rad(de1), d2 = rad(de2);
    const c = Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2);
    return deg(Math.acos(Math.max(-1, Math.min(1, c))));
  }

  // Bennett (1982) kırılma formülü; h görünen irtifâ (°), sonuç derece. Ufkun biraz altına kadar geçerli.
  function bennett(h) { return (1 / Math.tan(rad(h + 7.31 / (h + 4.4)))) / 60; }
  // İnhitât-ı ufk (s. 185, Ahmed Ziyâ Beğ): saniye = 106,92 × √h
  function dipBook(h) { return h > 0 ? 106.92 * Math.sqrt(h) / 3600 : 0; }

  // Topozentrik konum: görünen (kırılmalı) ve havasız
  function topo(body, t, obs) {
    const eq = A.Equator(body, t, obs, true, true);
    const app = A.Horizon(t, obs, eq.ra, eq.dec, 'normal');
    const air = A.Horizon(t, obs, eq.ra, eq.dec);
    return { alt: app.altitude, az: app.azimuth, airAlt: air.altitude, ra: eq.ra, dec: eq.dec, distAU: eq.dist };
  }
  // Jeosentrik doğrultunun gözlem yerindeki havasız irtifâı
  function geoAlt(body, t, obs) {
    const v = A.RotateVector(A.Rotation_EQJ_EQD(t), A.GeoVector(body, t, true));
    const eq = A.EquatorFromVector(v);
    return A.Horizon(t, obs, eq.ra, eq.dec).altitude;
  }
  // Beynûnet (s. 360: Erd ile kameri ve Erd ile şemsi birleştiren doğrular arası açı) = jeosentrik uzanım
  function beynunet(t) { return A.AngleBetween(A.GeoVector('Sun', t, true), A.GeoVector('Moon', t, true)); }
  function sunSD(t, obs) { return SUN_SD_1AU_DEG / topo('Sun', t, obs).distAU; }
  function moonSD(t, obs) { return deg(Math.asin(MOON_R_KM / (topo('Moon', t, obs).distAU * AU_KM))); }

  // Üst kenarın gözlemcinin zâhirî ufkuna göre yüksekliği (>0: ufkun üstünde)
  function upperLimbAboveVisible(body, t, obs, hObs) {
    const p = topo(body, t, obs);
    const sd = body === 'Sun' ? SUN_SD_1AU_DEG / p.distAU : deg(Math.asin(MOON_R_KM / (p.distAU * AU_KM)));
    return p.alt + sd + dipBook(hObs);
  }
  // Zâhirî gurûb / ayın zâhirî batışı (s. 186: üst kenarın zâhirî ufuktan kaybolması)
  function zahiriSet(body, obs, hObs, start, limitDays = 1.2) {
    const t0 = A.SearchRiseSet(body, obs, -1, start, limitDays, hObs);
    if (!t0) return null;
    const f = t => upperLimbAboveVisible(body, t, obs, hObs);
    let a = t0.AddDays(-30 * MIN), b = t0.AddDays(30 * MIN);
    if (f(a) <= 0 || f(b) >= 0) return t0;
    return bisect(f, a, b);
  }
  function lastSetBefore(body, obs, hObs, t) {
    let cur = zahiriSet(body, obs, hObs, t.AddDays(-1.1), 1.1), last = null;
    while (cur && cur.ut < t.ut) { last = cur; cur = zahiriSet(body, obs, hObs, cur.AddDays(2 * MIN), 1.1); }
    return last;
  }

  // Şer'î gurûb (s. 185–186): güneş merkezinin hakîkî irtifâı = −(inhitât(Hmax) + kırılma + yarıçap − 8,8″)
  function seriGurub(obs, hMax, start) {
    const hak = A.SearchAltitude('Sun', obs, -1, start, 1.2, 0);
    if (!hak) return null;
    const dip = dipBook(hMax);
    // Kitap (s. 185): ufkun altındaki irtifâa ait ziyânın inkisârı. Görünen irtifâ (−inhitât) için Bennett formülü.
    const refr = bennett(-dip);
    const zav = dip + refr + sunSD(hak, obs) - SUN_PARALLAX_DEG;
    const seri = A.SearchAltitude('Sun', obs, -1, hak.AddDays(-0.05), 0.3, -zav);
    return { hakiki: hak, seri, zaviye: zav, temkinMin: seri ? (seri.ut - hak.ut) * 1440 : null };
  }

  function lastNewMoonBefore(t) {
    let nm = A.SearchMoonPhase(0, t.AddDays(-31), 31), last = null;
    while (nm && nm.ut <= t.ut) { last = nm; nm = A.SearchMoonPhase(0, nm.AddDays(1), 31); }
    return last;
  }
  function nextNewMoonAfter(t) { return A.SearchMoonPhase(0, t, 32); }
  function nearestNewMoon(t) {
    const p = lastNewMoonBefore(t), n = nextNewMoonAfter(t);
    if (!p) return n; if (!n) return p;
    return (t.ut - p.ut) <= (n.ut - t.ut) ? p : n;
  }

  // Yerel tarih (YYYY-MM-DD, IANA tz) → o günün yerel öğlesi (AstroTime)
  function tzOffsetMin(tz, date) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const p = {}; for (const x of f.formatToParts(date)) p[x.type] = x.value;
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return Math.round((asUTC - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  }
  // Konumun yerel güneş öğlesi: YYYY-MM-DD tarihinin UTC gece yarısı + (12 − boylam/15) saat
  function solarNoon(ymd, lon) {
    const [y, m, d] = ymd.split('-').map(Number);
    return T(new Date(Date.UTC(y, m - 1, d) + (12 - lon / 15) * 3600000));
  }
  // Yerel duvar saati (YYYY-MM-DD + gece yarısından dakika, IANA tz) → UTC ms (v0.8: yaz saati geçişlerinde doğru).
  // Günün öncesindeki ve sonrasındaki saat farkı aday alınır; aranan ânda gerçekten geçerli olan seçilir. İleri alınan saatte
  // olmayan bir saat geçişten sonraki karşılığına, geri alınan saatte iki kez yaşanan bir saat ilk yaşanışına çevrilir.
  function localToUT(ymd, minutes, tz) {
    const [y, m, d] = ymd.split('-').map(Number);
    const wall = Date.UTC(y, m - 1, d) + minutes * 60000;
    const oB = tzOffsetMin(tz, new Date(wall - 86400000)), oA = tzOffsetMin(tz, new Date(wall + 86400000));
    const ok = [...new Set([oB, oA])].map(o => wall - o * 60000).filter(t => wall - tzOffsetMin(tz, new Date(t)) * 60000 === t);
    return ok.length ? Math.min(...ok) : wall - oB * 60000;   // iki kez yaşanan saat → ilki; olmayan saat → geçişten sonraki karşılığı
  }
  // Saat diliminin yerel gece yarısı (UTC ms)
  function tzMidnight(ymd, tz) { return localToUT(ymd, 0, tz); }
  function localNoon(ymd, tz) {
    const [y, m, d] = ymd.split('-').map(Number);
    let guess = Date.UTC(y, m - 1, d, 12);
    const off = tzOffsetMin(tz, new Date(guess));
    return T(new Date(guess - off * 60000));
  }

  // ---- Akşam rü'yet değerlendirmesi ----
  function evening(loc, ymd) {
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const hObs = loc.hObs || 0, hMax = loc.hMax != null ? loc.hMax : hObs;
    const noon = solarNoon(ymd, loc.lon);   // konumun güneş öğlesi (saat diliminden bağımsız)
    const ss = zahiriSet('Sun', obs, hObs, noon, 1);
    if (!ss) return { ok: false, reason: 'noSunset' };
    const r = { ok: true, loc, ymd, gurub: ss };
    const nmPrev = lastNewMoonBefore(ss), nmNext = nextNewMoonAfter(ss);
    r.ictimaPrev = nmPrev; r.ictimaNext = nmNext;
    r.ageH = nmPrev ? (ss.ut - nmPrev.ut) * 24 : null;
    r.beynunet = beynunet(ss);
    const m = topo('Moon', ss, obs), s = topo('Sun', ss, obs);
    r.moonAlt = m.alt; r.moonAz = m.az; r.sunAz = s.az;
    r.moonGeoAlt = geoAlt('Moon', ss, obs);
    r.daz = ((s.az - m.az) + 540) % 360 - 180;   // + : ay güneşin solunda (güneyinde)
    r.illum = A.Illumination('Moon', ss).phase_fraction * 100;
    r.moonUp = upperLimbAboveVisible('Moon', ss, obs, hObs) > 0;
    if (r.moonUp) { r.moonset = zahiriSet('Moon', obs, hObs, ss, 1); }
    else { r.moonset = lastSetBefore('Moon', obs, hObs, ss); }
    r.lagMin = r.moonset ? (r.moonset.ut - ss.ut) * 1440 : null;
    // Şer'î gurûb, temkin
    r.seri = seriGurub(obs, hMax, noon);
    // Şafak (yatsı vakti), Tam İlmihâl s. 178, 194, 197:
    //  İmâm-ı a'zam: beyâzlık kaybolunca (−19°) — esas, ihtiyâtlı olan; İmâmeyn: kırmızılık kaybolunca (−17°) — alternatif.
    //  Hesap usulü (s. 197): güneş merkezinin hakîkî ufka göre irtifâından hakîkî vakit bulunur, buna temkin eklenerek şer'î vakit olur.
    const tem = r.seri && r.seri.temkinMin != null ? r.seri.temkinMin : 0;
    r.safak19h = A.SearchAltitude('Sun', obs, -1, ss, 1, K.SAFAK_EBYAD);
    r.safak17h = A.SearchAltitude('Sun', obs, -1, ss, 1, K.SAFAK_AHMAR);
    r.safak19 = r.safak19h ? r.safak19h.AddDays(tem / 1440) : null;
    r.safak17 = r.safak17h ? r.safak17h.AddDays(tem / 1440) : null;
    r.safakTemkin = tem;
    if (r.moonUp && r.moonset) {
      r.kadihan19 = r.safak19 ? (r.moonset.ut > r.safak19.ut ? 'second' : 'first') : 'second';
      r.kadihan17 = r.safak17 ? (r.moonset.ut > r.safak17.ut ? 'second' : 'first') : 'second';
      r.kadihanDiffer = r.kadihan19 !== r.kadihan17;
    }
    // Kitabın gözlem penceresi: zâhirî gurûb → hilâlin görünen irtifâı 5°'ye inene kadar (D2)
    if (r.moonUp && r.moonAlt >= K.MIN_ALT && r.moonset) {
      r.windowEnd = bisect(t => topo('Moon', t, obs).alt - K.MIN_ALT, ss, r.moonset);
    }
    // Yallop (1997) en iyi an ve q; Odeh (2004) V — ek bilgi (D4: an ana panelde)
    if (r.moonUp && r.lagMin > 0) {
      const tb = ss.AddDays(r.lagMin * 4 / 9 * MIN);
      r.best = tb;
      const ms = topo('Moon', tb, obs), su = topo('Sun', tb, obs);
      // Yallop (1997, NAO TN 69 §2–3): ARCL ve ARCV jeosentrik (havasız); W' = SD' (1 − cos ARCL), SD' toposentrik yarıçap.
      // Odeh (2004): ARCL, ARCV ve W toposentrik (havasız). v0.8: iki model kendi tanımıyla ayrı hesaplanıyor.
      const arclTopo = sep(su.ra, su.dec, ms.ra, ms.dec), arclGeo = beynunet(tb);
      const sdMoonArcmin = deg(Math.asin(MOON_R_KM / (ms.distAU * AU_KM))) * 60;
      const Wy = sdMoonArcmin * (1 - Math.cos(rad(arclGeo))), W = sdMoonArcmin * (1 - Math.cos(rad(arclTopo)));
      const arcvGeo = geoAlt('Moon', tb, obs) - geoAlt('Sun', tb, obs);
      const arcvTopo = ms.airAlt - su.airAlt;
      const poly = w => 11.8371 - 6.3226 * w + 0.7319 * w * w - 0.1018 * w * w * w;
      const q = (arcvGeo - poly(Wy)) / 10;
      const V = arcvTopo - (-0.1018 * W ** 3 + 0.7319 * W ** 2 - 6.3226 * W + 7.1651);
      r.bestMoonAlt = ms.alt; r.bestMoonAz = ms.az; r.bestSunAlt = su.alt; r.bestSunAz = su.az;
      r.W = W; r.Wy = Wy; r.arcl = arclTopo; r.arclGeo = arclGeo; r.arcvGeo = arcvGeo; r.arcvTopo = arcvTopo;
      r.yallopQ = q;
      r.yallop = q > 0.216 ? 'A' : q > -0.014 ? 'B' : q > -0.160 ? 'C' : q > -0.232 ? 'D' : q > -0.293 ? 'E' : 'F';
      r.odehV = V;
      r.odeh = V >= 5.65 ? 'A' : V >= 2 ? 'B' : V >= -0.96 ? 'C' : 'D';
    }
    r.cls = classify(r);
    return r;
  }

  // Se'âdet-i Ebediyye sınıflandırması (rapor B.4 tablosu; sırayla, ilk tutan geçerli)
  function classify(r) {
    const SYN_H = 29.53 * 24;
    if (r.ageH == null) return { code: 'notBorn', sub: 'beforeConj', reject: true };
    // Gurûb bir sonraki ictimâya yakınsa (ay sonu): yeni hilâl henüz doğmamıştır
    if (r.ageH > SYN_H / 2) {
      const toNext = r.ictimaNext ? (r.ictimaNext.ut - r.gurub.ut) * 24 : 99;
      return toNext < 72 ? { code: 'notBorn', sub: 'beforeConj', reject: true } : { code: 'midMonth', reject: false };
    }
    if (r.ageH > 96) return { code: 'midMonth', reject: false };
    if (!r.moonUp || (r.lagMin != null && r.lagMin <= 0)) return { code: 'notBorn', sub: 'moonFirst', reject: true };
    if (r.beynunet < K.BOOK_MIN_ELONG) return { code: 'below8', reject: true, modernBelow: r.beynunet < K.MODERN_MIN_ELONG };
    if (r.moonAlt < K.MIN_ALT) return { code: 'below5', reject: false };
    if (r.beynunet < K.OTTOMAN_ELONG) return { code: 'possible', reject: false };
    return { code: 'visible', reject: false };
  }

  // 18° anı ve o anda güneşin battığı boylam (s. 360 usulü), verilen enlem için
  function moment18(conj, lat) {
    if (!conj) return null;
    let a = conj, b = conj.AddDays(3);
    if (beynunet(a) >= K.OTTOMAN_ELONG) return null;
    const t = bisect(x => beynunet(x) - K.OTTOMAN_ELONG, a, b);
    const v = A.RotateVector(A.Rotation_EQJ_EQD(t), A.GeoVector('Sun', t, true));
    const eq = A.EquatorFromVector(v);
    const h0 = -0.8333, phi = rad(lat), dec = rad(eq.dec);
    const cosH = (Math.sin(rad(h0)) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    if (Math.abs(cosH) > 1) return { t, lon: null };
    const H = deg(Math.acos(cosH));
    let lon = H - (A.SiderealTime(t) * 15 - eq.ra * 15);
    lon = ((lon + 540) % 360) - 180;
    return { t, lon };
  }

  // Verilen anda, verilen enlemde güneşin battığı boylam
  function sunsetLon(t, lat) {
    const v = A.RotateVector(A.Rotation_EQJ_EQD(t), A.GeoVector('Sun', t, true));
    const eq = A.EquatorFromVector(v);
    const phi = rad(lat), dec = rad(eq.dec);
    const cosH = (Math.sin(rad(-0.8333)) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    if (Math.abs(cosH) > 1) return null;
    let lon = deg(Math.acos(cosH)) - (A.SiderealTime(t) * 15 - eq.ra * 15);
    return ((lon + 540) % 360) - 180;
  }
  // Hızlı akşam testi (en erken gün taraması için; deniz seviyesi, standart gurûb)
  function quickEvening(lat, lon, startUT) {
    const obs = new A.Observer(lat, lon, 0);
    const ss = A.SearchRiseSet('Sun', obs, -1, startUT, 1);
    if (!ss) return null;
    const m = topo('Moon', ss, obs);
    return { ss, elong: beynunet(ss), alt: m.alt };
  }
  // Hesâbî en erken gün (D3): beynûnet ≥ 8° ve görünen irtifâ ≥ 5° şartının ilk sağlandığı akşamın ertesi günü.
  // dateUTC: ictimânın UTC tarihi (Date). places: [[lat,lon],...] veya null (küresel ızgara).
  function earliestDay(conj, places, onProgress) {
    // Bir yerel tarihin en geç gurûbu tarih çizgisinin hemen doğusunda olur; aynı enlemde o tarih için en elverişli akşam oradadır.
    // Bu yüzden küresel arama bu boylam kuşağında, kutup daireleri arasında (±66°) yapılır. tools/kuresel_dogrulama.py,
    // bütün dünya ızgarasıyla aynı günün bulunduğunu doğrular (v0.8).
    const grid = places || (() => { const g = []; for (let la = -66; la <= 66; la += 3) for (let lo = -177.5; lo <= -140; lo += 5) g.push([la, lo]); return g; })();
    const cd = conj.date;
    const base = Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate());
    for (let k = 0; k <= 3; k++) {
      let hit = null;
      for (let i = 0; i < grid.length; i++) {
        const [la, lo] = grid[i];
        const localNoonUT = base + k * 86400000 + (12 - lo / 15) * 3600000;   // o boylamın yerel güneş öğlesi
        const t0 = T(new Date(localNoonUT));
        if (t0.ut + 0.6 < conj.ut) continue;
        const q = quickEvening(la, lo, t0);
        if (!q || q.ss.ut < conj.ut) continue;
        if (q.elong >= K.BOOK_MIN_ELONG && q.alt >= K.MIN_ALT) {
          if (!hit || q.elong > hit.elong) hit = { lat: la, lon: lo, elong: q.elong, alt: q.alt, ss: q.ss };
        }
      }
      if (onProgress) onProgress(k);
      if (hit) {
        const ev = new Date(base + k * 86400000);          // gözlem yerinin yerel tarihi (akşam)
        const first = new Date(base + (k + 1) * 86400000); // ay başı: ertesi gün
        return { evening: ev, first, where: hit };
      }
    }
    return null;
  }


  // ---- Harita hücresi (deniz seviyesi, standart gurûb; hızlı) ----
  // dayUTC: yerel tarihin UTC gece yarısı (ms). conj: ayın ictimâsı (AstroTime).
  function cell(lat, lon, dayUTC, conj, withModern) {
    const obs = new A.Observer(lat, lon, 0);
    const t0 = T(new Date(dayUTC + (12 - lon / 15) * 3600000));
    const ss = A.SearchRiseSet('Sun', obs, -1, t0, 1);
    if (!ss) return { code: 'noSunset' };
    const ageH = (ss.ut - conj.ut) * 24;
    const m = topo('Moon', ss, obs);
    const sdM = deg(Math.asin(MOON_R_KM / (m.distAU * AU_KM)));
    const elong = beynunet(ss);
    const out = { ageH, elong, alt: m.alt, up: m.alt + sdM, ss };
    if (ageH < 0) out.code = 'notBorn';
    else if (m.alt + sdM <= 0) out.code = 'notBorn';
    else if (elong < K.BOOK_MIN_ELONG) out.code = 'below8';
    else if (m.alt < K.MIN_ALT) out.code = 'below5';
    else if (elong < K.OTTOMAN_ELONG) out.code = 'possible';
    else out.code = 'visible';
    if (withModern && out.code !== 'notBorn') {
      const ms = A.SearchRiseSet('Moon', obs, -1, ss, 1);
      if (ms) {
        const lag = (ms.ut - ss.ut) * 1440;
        if (lag > 0 && lag < 600) {
          const tb = ss.AddDays(lag * 4 / 9 / 1440);
          const mo = topo('Moon', tb, obs), su = topo('Sun', tb, obs);
          const arcl = sep(su.ra, su.dec, mo.ra, mo.dec), sd = deg(Math.asin(MOON_R_KM / (mo.distAU * AU_KM))) * 60;
          const W = sd * (1 - Math.cos(rad(arcl))), Wy = sd * (1 - Math.cos(rad(beynunet(tb))));
          const poly = w => 11.8371 - 6.3226 * w + 0.7319 * w * w - 0.1018 * w * w * w;
          out.q = (geoAlt('Moon', tb, obs) - geoAlt('Sun', tb, obs) - poly(Wy)) / 10;
          out.V = (mo.airAlt - su.airAlt) - (-0.1018 * W ** 3 + 0.7319 * W ** 2 - 6.3226 * W + 7.1651);
        }
      }
    }
    return out;
  }
  // Bir yerin bu ay için ilk elverişli akşamı (0–3 gün sonrası); bulunamazsa null
  function firstEvening(lat, lon, conj) {
    const cd = conj.date, base = Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate());
    for (let k = 0; k <= 3; k++) {
      const c = cell(lat, lon, base + k * 86400000, conj, false);
      if (c.code === 'noSunset') return { k: -1 };
      if (c.code === 'visible' || c.code === 'possible') return { k, day: base + k * 86400000 };
    }
    return null;
  }

  // ---- Gökyüzündeki diğer cisimler (yön bulma ve karıştırılma uyarısı için) ----
  const PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const STARS = [ // J2000: ad, RA (saat), Dec (°), kadir
    ['Sirius', 6.7525, -16.716, -1.46], ['Canopus', 6.3992, -52.696, -0.74], ['Rigil Kentaurus', 14.6600, -60.835, -0.27], ['Arcturus', 14.2610, 19.182, -0.05],
    ['Vega', 18.6156, 38.784, 0.03], ['Capella', 5.2782, 45.998, 0.08], ['Rigel', 5.2423, -8.202, 0.13], ['Procyon', 7.6550, 5.225, 0.34],
    ['Achernar', 1.6286, -57.237, 0.46], ['Betelgeuse', 5.9195, 7.407, 0.50], ['Hadar', 14.0637, -60.373, 0.61], ['Altair', 19.8464, 8.868, 0.76],
    ['Acrux', 12.4433, -63.099, 0.76], ['Aldebaran', 4.5987, 16.509, 0.86], ['Antares', 16.4901, -26.432, 0.96], ['Spica', 13.4199, -11.161, 0.97],
    ['Pollux', 7.7553, 28.026, 1.14], ['Fomalhaut', 22.9608, -29.622, 1.16], ['Deneb', 20.6905, 45.280, 1.25], ['Regulus', 10.1395, 11.967, 1.35],
    ['Castor', 7.5767, 31.888, 1.58], ['Polaris', 2.5303, 89.264, 1.98]];
  function skyObjects(t, obs) {
    const out = [];
    for (const b of PLANETS) {
      const p = topo(b, t, obs);
      out.push({ id: b, kind: 'planet', alt: p.alt, az: p.az, mag: A.Illumination(b, t).mag });
    }
    const rot = A.Rotation_EQJ_EQD(t);
    for (const [name, ra, dec, mag] of STARS) {
      const v = A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(dec, ra * 15, 1), t));
      const eq = A.EquatorFromVector(v);
      const h = A.Horizon(t, obs, eq.ra, eq.dec, 'normal');
      out.push({ id: name, kind: 'star', alt: h.altitude, az: h.azimuth, mag });
    }
    return out;
  }
  // Alacakaranlık evreleri (güneş merkezinin geometrik irtifâı)
  function twilight(obs, ss) {
    const f = a => A.SearchAltitude('Sun', obs, -1, ss.AddDays(-0.02), 1, a);
    return { civil: f(-6), nautical: f(-12), ahmar: f(K.SAFAK_AHMAR), ebyad: f(K.SAFAK_EBYAD) };
  }
  // Belirli bir anda güneş ve ay konumu (ufuk çizimi ve saha modu için)
  function at(t, loc) {
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const m = topo('Moon', t, obs), s = topo('Sun', t, obs);
    return { t, moon: m, sun: s, elong: beynunet(t), obs };
  }

  // ---- Sabah hilâli (ay sonu, ictimâdan önce; yalnızca bilgi) ----
  function morning(loc, ymd) {
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const start = T(new Date(solarNoon(ymd, loc.lon).date.getTime() - 12 * 3600000));
    const sr = A.SearchRiseSet('Sun', obs, +1, start, 1, loc.hObs || 0);
    if (!sr) return null;
    const nm = nextNewMoonAfter(sr.AddDays(-0.2));
    const toConjH = nm ? (nm.ut - sr.ut) * 24 : null;
    const m = topo('Moon', sr, obs), e = beynunet(sr);
    let code = 'none';
    if (toConjH != null && toConjH > 0 && toConjH < 4 * 24) code = m.alt < 0 ? 'moonBelow' : e < K.BOOK_MIN_ELONG ? 'below8' : m.alt < K.MIN_ALT ? 'below5' : 'possible';
    return { sunrise: sr, moonAlt: m.alt, moonAz: m.az, elong: e, toConjH, code };
  }
  // ---- Bir yerel gün içinde güneş ve ay doğuş/batış (saat dilimine göre gün) ----
  function dayEvents(loc, ymd, tz) {
    const obs = new A.Observer(loc.lat, loc.lon, (loc.elev || 0) + (loc.hObs || 0));
    const t0 = T(new Date(tzMidnight(ymd, tz)));
    const f = (b, dir) => { const x = A.SearchRiseSet(b, obs, dir, t0, 1, loc.hObs || 0); return x && x.ut < t0.ut + 1 ? x : null; };
    return { start: t0, sunrise: f('Sun', +1), sunset: f('Sun', -1), moonrise: f('Moon', +1), moonset: f('Moon', -1) };
  }
  // ---- Anlık küresel konumlar (harita için analitik, aramasız) ----
  function instant(t) {
    const rot = A.Rotation_EQJ_EQD(t);
    const sv = A.EquatorFromVector(A.RotateVector(rot, A.GeoVector('Sun', t, true)));
    const mvv = A.GeoVector('Moon', t, true), mv = A.EquatorFromVector(A.RotateVector(rot, mvv));
    const gast = A.SiderealTime(t) * 15;
    const hp = deg(Math.asin(6378.14 / (mvv.Length() * AU_KM)));
    const last = lastNewMoonBefore(t);
    return { sun: { ra: sv.ra * 15, dec: sv.dec }, moon: { ra: mv.ra * 15, dec: mv.dec }, gast, hp, elong: beynunet(t), ageH: last ? (t.ut - last.ut) * 24 : null,
      subSolar: { lat: sv.dec, lon: ((sv.ra * 15 - gast + 540) % 360) - 180 }, subLunar: { lat: mv.dec, lon: ((mv.ra * 15 - gast + 540) % 360) - 180 } };
  }
  // Bir konumda anlık yükseklik (yaklaşık; harita pikselleri için). Ay için paralaks ve kırılma dahil.
  function altFast(ra, dec, gast, lat, lon) {
    const H = rad(gast + lon - ra), p = rad(lat), d = rad(dec);
    return deg(Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H)));
  }
  // "Şu an aranabilir" (karar B.12): güneş eşiğin altında, beynûnet ≥ 8°, hilâl görünen irtifâı ≥ 5°, hilâl büyüyor (ictimâdan sonra)
  const DARK = { gurub: -0.8333, m3: -3, m6: -6 };
  function searchable(at, darkKey, ageH) {
    const thr = DARK[darkKey] != null ? DARK[darkKey] : DARK.gurub;
    const r = [];
    if (ageH == null || ageH < 0 || ageH > 96) r.push('age');
    const sa = at.sun.airAlt != null ? at.sun.airAlt : at.sun.alt; // eşikler havasız (geometrik) güneş merkezine göredir: gurûb = −0°50′
    if (sa > thr) r.push('sun');
    if (at.elong < K.BOOK_MIN_ELONG) r.push('elong');
    if (at.moon.alt < K.MIN_ALT) r.push(at.moon.alt < 0 ? 'moonDown' : 'low');
    return { ok: r.length === 0, reasons: r, thr };
  }
  // Ayın evre adı
  function phaseOf(t) {
    const ph = A.MoonPhase(t); // 0 yeni ay, 90 ilk dördün, 180 dolunay, 270 son dördün
    const ill = A.Illumination('Moon', t).phase_fraction;
    const k = ph < 10 || ph > 350 ? 'new' : ph < 80 ? 'waxCres' : ph < 100 ? 'firstQ' : ph < 170 ? 'waxGib' : ph < 190 ? 'full' : ph < 260 ? 'wanGib' : ph < 280 ? 'lastQ' : 'wanCres';
    return { ph, ill, key: k };
  }
  // Gözlem geceleri (karar B.12): A = rasad gecesi (ilk mümkün), B = en elverişli (ilk ≥ 18°). Aynı değerlendirme fonksiyonu kullanılır.
  function observationNights(loc, fromYmd) {
    const [y, m, d] = fromYmd.split('-').map(Number);
    const from = Date.UTC(y, m - 1, d);
    let conj = nextNewMoonAfter(solarNoon(fromYmd, loc.lon).AddDays(-2.5));
    for (let guard = 0; guard < 3 && conj; guard++) {
      const cd = conj.date, base = Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate());
      let a = null, b = null;
      for (let k = -1; k <= 4; k++) {
        const day = base + k * 86400000; if (day < from) continue;
        const ymd = new Date(day).toISOString().slice(0, 10);
        const r = evening(loc, ymd); if (!r.ok) continue;
        const c = r.cls.code;
        if (!a && (c === 'possible' || c === 'visible')) a = { ymd, r };
        if (!b && c === 'visible') b = { ymd, r };
        if (a && b) break;
      }
      if (a || b) return { conj, a, b };
      conj = nextNewMoonAfter(conj.AddDays(1));
    }
    return null;
  }

  const Q = '@@N1@@'; // sürüm bildirimi parçası (build.py)
  G.HRCore = { Q, K, DARK, solarNoon, tzMidnight, localToUT, morning, dayEvents, instant, altFast, searchable, phaseOf, observationNights, sunsetLon, cell, firstEvening, skyObjects, twilight, at, evening, classify, moment18, earliestDay, lastNewMoonBefore, nextNewMoonAfter, nearestNewMoon, beynunet, topo, localNoon, tzOffsetMin, dipBook, seriGurub };
})(typeof globalThis !== 'undefined' ? globalThis : window);
