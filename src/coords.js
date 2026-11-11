/* Konum girişi çözümleyici: kullanıcının yazdığı enlem/boylamı (arz/tûl) hoşgörüyle anlar ve standartlaştırır.
 * Kabul edilenler (örnekler):
 *   41.0082 · 41,0082 · +41.0082 · -33,87 · 41.0082N · N41.0082 · 41,0082 K · K 41 00 29,5
 *   41°00'29.5"N · 41° 0′ 29,5″ Kuzey · 41 0.49 K (derece + ondalık dakika) · 28°58'42"D · 28.9784 E · 73,98 B / W
 *   Çift giriş: "41.0082, 28.9784" · "41,0082 28,9784" · "41.0082;28.9784" · "41°0'29"N 28°58'42"E" · harita bağlantısı "...@41.0082,28.9784,15z"
 * Yarım küre harfleri: Kuzey N/K, Güney S/G, Doğu E/D, Batı W/B (Türkçe ve İngilizce, tam yazılışlarıyla da).
 * Yarım küre veya işaret yoksa: enlem Kuzey, boylam Doğu kabul edilir. */
(function (G) {
  'use strict';
  const HEMI = [
    [/^(KUZEY|NORTH|N|K)$/, 'lat', 1], [/^(GÜNEY|GUNEY|SOUTH|S|G)$/, 'lat', -1],
    [/^(DOĞU|DOGU|EAST|E|D|O)$/, 'lon', 1], [/^(BATI|WEST|W|B)$/, 'lon', -1]
  ];
  const up = s => s.toLocaleUpperCase('tr-TR').replace(/İ/g, 'I');
  function clean(s) {
    return up(String(s || ''))
      .replace(/[′’‘´`ʹ]/g, "'").replace(/[″“”″ʺ]/g, '"').replace(/''/g, '"')
      .replace(/[º˚ᵒ]/g, '°').replace(/\bDERECE\b|\bDER\b|\bDEG\b/g, '°').replace(/\bDAKİKA\b|\bDAKIKA\b|\bDAK\b|\bDK\b|\bMIN\b/g, "'").replace(/\bSANİYE\b|\bSANIYE\b|\bSAN\b|\bSN\b|\bSEC\b/g, '"')
      .replace(/[−–—]/g, '-').trim();
  }
  // Tek bir koordinatı çözer: {v, axis (lat|lon|null), note}
  function single(s) {
    let sign = 1, axis = null, t = s.trim();
    // Baştaki/sondaki yarım küre sözcüğü
    const words = t.match(/[A-ZÇĞÖŞÜ]+/g) || [];
    for (const w of words) {
      const h = HEMI.find(([re]) => re.test(w));
      if (!h) return { err: 'letter', bad: w };
      if (axis && axis !== h[1]) return { err: 'mixed' };
      axis = h[1]; sign *= h[2];
    }
    t = t.replace(/[A-ZÇĞÖŞÜ]+/g, ' ').trim();
    if (/^[+-]/.test(t)) { if (t[0] === '-') sign *= -1; t = t.slice(1); }
    if (/-/.test(t)) return { err: 'format' };
    // Ondalık virgülü: rakamlar arasındaki tek virgül
    t = t.replace(/(\d),(\d)/g, '$1.$2');
    const nums = t.split(/[°'"\s]+/).filter(Boolean);
    if (!nums.length || nums.some(x => !/^\d+(\.\d+)?$/.test(x)) || nums.length > 3) return { err: 'format' };
    const [d, m = 0, sec = 0] = nums.map(Number);
    if (m >= 60 || sec >= 60) return { err: 'minsec' };
    if (nums.length > 1 && !Number.isInteger(d)) return { err: 'format' };
    return { v: sign * (d + m / 60 + sec / 3600), axis, dms: nums.length > 1 };
  }
  // Bir metnin bir mi iki mi koordinat olduğunu ayırır
  function splitPair(s) {
    const map = s.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/) || s.match(/[?&](?:q|ll|query)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
    if (map) return [map[1], map[2]];
    if (/[;|/]/.test(s)) { const p = s.split(/[;|/]/).map(x => x.trim()).filter(Boolean); return p.length === 2 ? p : null; }
    if (/,\s+/.test(s) || /,(?=\s*[-+]?\d+[.]\d)/.test(s) && /\d\.\d/.test(s)) { const p = s.split(/,\s*/).map(x => x.trim()).filter(Boolean); if (p.length === 2) return p; }
    // Harfle biten/başlayan iki grup: "41 0 29 N 28 58 42 E", "N41.0 E28.9"
    const lg = s.match(/^(.*?[NSKG])\s*[,\s]\s*([^,]*?)$/) || s.match(/^([NSKG].*?)\s+([EWDBO].*)$/);
    if (lg && /\d/.test(lg[1]) && /\d/.test(lg[2])) return [lg[1].trim(), lg[2].trim()];
    // Boşlukla ayrılmış iki ondalık sayı: "41,0082 28,9784" veya "41.0082 28.9784"
    const two = s.match(/^([+-]?\d+[.,]\d+)\s+([+-]?\d+[.,]\d+)$/);
    if (two) return [two[1], two[2]];
    return null;
  }
  // kind: 'lat' veya 'lon'. Dönüş: { ok, value, pair: [lat, lon]?, note, err }
  function parse(input, kind) {
    const s = clean(input);
    if (!s) return { ok: false, err: 'empty' };
    const pr = splitPair(s);
    if (pr) {
      let a = single(pr[0]), b = single(pr[1]);
      if (a.err || b.err) return { ok: false, err: a.err || b.err };
      if (a.axis === 'lon' || b.axis === 'lat') [a, b] = [b, a];
      if (Math.abs(a.v) > 90 || Math.abs(b.v) > 180) return { ok: false, err: 'range' };
      return { ok: true, pair: [round(a.v), round(b.v)], value: kind === 'lon' ? round(b.v) : round(a.v), dms: a.dms || b.dms };
    }
    const r = single(s);
    if (r.err) return { ok: false, err: r.err, bad: r.bad };
    let swapped = false;
    if (r.axis && r.axis !== kind) swapped = true;
    const lim = (swapped ? r.axis : kind) === 'lat' ? 90 : 180;
    if (Math.abs(r.v) > lim) return { ok: false, err: 'range' };
    return { ok: true, value: round(r.v), axis: r.axis || kind, swapped, dms: r.dms };
  }
  const round = v => Math.round(v * 1e6) / 1e6;
  // Sayı alanları (rakım vb.): "40", "40,5", "40 m", "1.054" (binlik nokta) → sayı
  function parseNum(input) {
    let s = String(input || '').trim().replace(/\s*(m|metre|meter|mt)\.?$/i, '').replace(/\s/g, '');
    if (!s) return null;
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');       // 1.054 → 1054
    s = s.replace(/(\d),(\d)/g, '$1.$2');
    const v = Number(s);
    return isFinite(v) ? v : null;
  }
  // Görüntüleme: ondalık (yerel ayraç) + yarım küre harfi
  function format(v, kind, lang) {
    const tr = lang === 'tr', a = Math.abs(v);
    const h = kind === 'lat' ? (v >= 0 ? (tr ? 'K' : 'N') : (tr ? 'G' : 'S')) : (v >= 0 ? (tr ? 'D' : 'E') : (tr ? 'B' : 'W'));
    return a.toFixed(4).replace(/0+$/, '').replace(/\.$/, '').replace('.', tr ? ',' : '.') + ' ' + h;
  }
  function dms(v, kind, lang) {
    const tr = lang === 'tr', a = Math.abs(v), d = Math.floor(a), mf = (a - d) * 60, m = Math.floor(mf), s = (mf - m) * 60;
    const h = kind === 'lat' ? (v >= 0 ? (tr ? 'K' : 'N') : (tr ? 'G' : 'S')) : (v >= 0 ? (tr ? 'D' : 'E') : (tr ? 'B' : 'W'));
    return `${d}° ${String(m).padStart(2, '0')}′ ${s.toFixed(1).replace('.', tr ? ',' : '.')}″ ${h}`;
  }
  G.HRCoord = { parse, parseNum, format, dms };
})(typeof globalThis !== 'undefined' ? globalThis : window);
