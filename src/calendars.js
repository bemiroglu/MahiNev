/* Takvim usulleri (Se'âdet-i Ebediyye s. 358–362) ve aritmetik hicrî takvim.
 * Bunlar yalnızca takvim bilgisidir; rü'yet hükmü vermez. Haftanın günleri: 0 = Pazar … 6 = Cumartesi. */
(function (G) {
  'use strict';
  // Aritmetik (tabular, sivil) hicrî takvim — 1 Muharrem 1 = 16 Temmuz 622 Cuma (s. 358)
  function jdFromHijri(y, m, d) {           // m: 1–12, JDN (öğle)
    return Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m - Math.floor((m - 1) / 2) + d + 1948440 - 385;
  }
  function hijriFromJd(jd) {
    const y = Math.floor((30 * (jd - 1948440) + 10646) / 10631);
    const m = Math.min(12, Math.ceil((jd - (29 + jdFromHijri(y, 1, 1))) / 29.5) + 1);
    const d = jd - jdFromHijri(y, m, 1) + 1;
    return { y, m, d };
  }
  const jdFromDate = dt => Math.floor(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()) / 86400000) + 2440588;
  const dateFromJd = jd => new Date((jd - 2440588) * 86400000);
  const weekday = jd => (jd + 1) % 7;

  // Işık usulü (madde 89, s. 359): kalan Cuma'dan itibaren
  const ISIK = [8, 2, 4, 5, 7, 1, 3, 4, 6, 7, 2, 3];
  function isik(y, m) { const r = (Math.floor((y - 1) * 4.367) + ISIK[m - 1]) % 7; return (5 + r - 1 + 7) % 7; }

  // Madde 88 (s. 359): Muharrem'in ilk günü; kalan Perşembe'den itibaren. Kalan 0: kitapta tanımsız (karar: Uluğ Beğ verilir)
  function madde88(y) { const r = (5 * y) % 8; return r === 0 ? null : (4 + r - 1) % 7; }

  // Ebüzziyâ / Kindî cetveli (s. 361) — sütun = y mod 8; değer Cuma'dan itibaren. Cemâzil-âhır s.6: 7 → 6 düzeltildi.
  const KINDI = [
    [6, 4, 1, 6, 3, 7, 5, 2], [1, 6, 3, 1, 5, 2, 7, 4], [2, 7, 4, 2, 6, 3, 1, 5], [4, 2, 6, 4, 1, 5, 3, 7],
    [5, 3, 7, 5, 2, 6, 4, 1], [7, 5, 2, 7, 4, 1, 6, 3], [1, 6, 3, 1, 5, 2, 7, 4], [3, 1, 5, 3, 7, 4, 1, 6],
    [4, 2, 6, 4, 1, 5, 3, 7], [6, 4, 1, 6, 3, 7, 5, 2], [7, 5, 2, 7, 4, 1, 6, 3], [2, 7, 4, 2, 6, 3, 1, 5]];
  function kindi(y, m) { return (5 + KINDI[m - 1][y % 8] - 1) % 7; }

  // Uluğ Beğ cetvelleri (s. 361–362) — Pazar'dan itibaren
  const UB1 = {
    0: [2, 6, 3, 1, 5, 2, 7, 4, 2, 6], 10: [3, 1, 5, 2, 7, 4, 2, 6, 3, 1], 20: [4, 2, 7, 4, 1, 6, 3, 1, 5, 2], 30: [7, 4, 1, 6, 3, 7, 5, 2, 7, 4],
    40: [1, 6, 3, 7, 5, 2, 7, 4, 1, 6], 50: [3, 7, 5, 2, 6, 4, 1, 6, 3, 7], 60: [5, 2, 6, 4, 1, 5, 3, 7, 5, 2], 70: [6, 4, 1, 5, 3, 7, 5, 2, 6, 4],
    80: [1, 5, 3, 7, 4, 2, 6, 4, 1, 5], 90: [3, 7, 4, 2, 6, 3, 1, 5, 3, 7], 100: [4, 2, 6, 3, 1, 5, 3, 7, 4, 2], 110: [6, 3, 1, 5, 2, 7, 4, 2, 6, 3],
    120: [1, 5, 2, 7, 4, 1, 6, 3, 1, 5], 130: [2, 7, 4, 1, 6, 3, 1, 5, 2, 7], 140: [4, 1, 6, 3, 7, 5, 2, 7, 4, 1], 150: [6, 3, 7, 5, 2, 6, 4, 1, 6, 3],
    160: [7, 5, 2, 6, 4, 1, 6, 3, 7, 5], 170: [2, 6, 4, 1, 5, 3, 7, 5, 2, 6], 180: [4, 1, 5, 3, 7, 4, 2, 6, 4, 1], 190: [5, 3, 7, 4, 2, 6, 4, 1, 5, 3],
    200: [7, 4, 2, 6, 3, 1, 5, 3, 7, 4]};
  const UB2 = [[5, 6, 7, 1, 2, 3, 4], [7, 1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7], [3, 4, 5, 6, 7, 1, 2], [4, 5, 6, 7, 1, 2, 3], [6, 7, 1, 2, 3, 4, 5],
    [7, 1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 7, 1], [3, 4, 5, 6, 7, 1, 2], [5, 6, 7, 1, 2, 3, 4], [6, 7, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6, 7]];
  function ulugbey(y, m) {
    const r = y % 210, muh = UB1[r - (r % 10)][r % 10];
    const col = UB2[0].indexOf(muh);
    return (UB2[m - 1][col] - 1) % 7;
  }

  // Haftanın gününden tarihe: aritmetik ay başına en yakın (±3 gün) aynı günlü tarih
  function dateForWeekday(y, m, wd) {
    const base = jdFromHijri(y, m, 1);
    for (const k of [0, -1, 1, -2, 2, -3, 3]) if (weekday(base + k) === wd) return dateFromJd(base + k);
    return null;
  }

  // Bir ictimâ ile başlayacak ay (aritmetik takvime göre; yalnızca ad vermek için)
  function monthForConjunction(conjDate) {
    // Aritmetik ay başı ictimâdan 0–4 gün sonra düşer; bu aralıkta başlayan ay seçilir.
    const jc = jdFromDate(conjDate), h = hijriFromJd(jc);
    const cand = [{ y: h.y, m: h.m }, h.m === 12 ? { y: h.y + 1, m: 1 } : { y: h.y, m: h.m + 1 }];
    for (const x of cand) { const s = jdFromHijri(x.y, x.m, 1); if (s >= jc && s <= jc + 4) return x; }
    return cand[1];
  }

  function methods(y, m) {
    const out = {
      isik: dateForWeekday(y, m, isik(y, m)),
      ulugbey: dateForWeekday(y, m, ulugbey(y, m)),
      kindi: dateForWeekday(y, m, kindi(y, m)),
      tabular: dateFromJd(jdFromHijri(y, m, 1))
    };
    if (m === 1) { const w = madde88(y); out.madde88 = w == null ? { undefinedInBook: true, value: out.ulugbey } : { value: dateForWeekday(y, m, w) }; }
    return out;
  }

  const Q = '@@N2@@';
  G.HRCal = { Q, jdFromHijri, hijriFromJd, jdFromDate, dateFromJd, weekday, isik, madde88, kindi, ulugbey, dateForWeekday, monthForConjunction, methods };
})(typeof globalThis !== 'undefined' ? globalThis : window);
