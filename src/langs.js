/* Dil kaydı: arayüz dilleri, yerel biçimler, yazı yönü ve her dilde Tam İlmihâl’in adı ve bağlantıları.
 * Yeni bir dil eklemek için: buraya bir kayıt, i18n dosyalarına T[kod] ve MONTHS[kod], explain.js / guide.js / sky.js /
 * starmap.js / gok.js sözlüklerine birer bölüm eklenir (bkz. docs/coklu-dil.md). Eksik metinler İngilizceden gelir.
 * Türkçe metinlerdeki sayfa numaraları Tam İlmihâl’in Ocak 2026 baskısına, İngilizce metinlerdekiler Endless Bliss’e (fasikül, sayfa) göredir. */
(function (G) {
  'use strict';
  const HK = 'https://www.hakikatkitabevi.net/';
  const LANGS = {
    tr: { code: 'tr', name: 'Türkçe', short: 'TR', locale: 'tr-TR', dir: 'ltr', fallback: null,
      book: { title: 'Tam İlmihâl Se’âdet-i Ebediyye', page: HK + 'book.php?bookCode=001', pdf: HK + 'downloads/001.pdf', pages: 'tr-2026-01' } },
    en: { code: 'en', name: 'English', short: 'EN', locale: 'en-GB', dir: 'ltr', fallback: 'tr',
      // Endless Bliss altı fasikül hâlinde ayrı ayrı indirilir; bu yüzden yalnız kitap sayfası verilir.
      // İngilizce metinlerdeki atıflar "EB V, p. 137" biçimindedir (fasikül, sayfa; 2020 baskıları). Eşleme: docs/endless-bliss-esleme.md
      book: { title: 'Endless Bliss', page: HK + 'book.php?bookCode=025', pdf: null, pages: 'eb-2020' } },
    // Fransızca, İspanyolca, Boşnakça: Tam İlmihâl’in bu dillerde tercümesi yok; atıflar Endless Bliss’e (fasikül, sayfa) yapılır.
    // Metinleri dosyada sıkıştırılmış dil paketi olarak durur (src/lang/*.js), dil seçilince açılır.
    fr: { code: 'fr', name: 'Français', short: 'FR', locale: 'fr-FR', dir: 'ltr', fallback: 'en', packed: true,
      book: { title: 'Endless Bliss', page: HK + 'book.php?bookCode=025', pdf: null, pages: 'eb-2020' } },
    es: { code: 'es', name: 'Español', short: 'ES', locale: 'es-ES', dir: 'ltr', fallback: 'en', packed: true,
      book: { title: 'Endless Bliss', page: HK + 'book.php?bookCode=025', pdf: null, pages: 'eb-2020' } },
    bs: { code: 'bs', name: 'Bosanski', short: 'BS', locale: 'bs-BA', dir: 'ltr', fallback: 'en', packed: true,
      book: { title: 'Endless Bliss', page: HK + 'book.php?bookCode=025', pdf: null, pages: 'eb-2020' } }
  };
  const ORDER = ['tr', 'en', 'fr', 'es', 'bs'];
  const get = L => LANGS[L] || LANGS.en;
  // Dile göre sözlükten seçim: önce istenen dil, sonra İngilizce, sonra Türkçe
  const pick = (dict, L) => (dict && (dict[L] || dict.en || dict.tr)) || {};
  // Eksik anahtarlar için yedek zinciri: dil → İngilizce (İngilizce ve Türkçe kendileri tamdır)
  function chain(T) {
    for (const L of Object.keys(T)) if (L !== 'en' && L !== 'tr' && T.en && Object.getPrototypeOf(T[L]) !== T.en) Object.setPrototypeOf(T[L], T.en);
    return T;
  }
  // ---- Sıkıştırılmış dil paketleri ----
  // Her modül dile bağlı sözlüğünü bir adla kaydeder (reg). Paket, bu adlarla o dilin metinlerini taşır; açılınca
  // sözlüklere dil[kod] olarak yerleşir. Nesne sözlüklerinde eksik anahtar İngilizceden gelir. apply verilmişse
  // yerleştirmeyi modül kendisi yapar (ör. şehir adları).
  const REG = {};
  const reg = (name, dict, apply) => { REG[name] = { dict, apply }; return dict; };
  const PK = () => G.HR_PACKS || {};
  const packed = c => !!(LANGS[c] && LANGS[c].packed && PK()[c]);
  const ready = c => !packed(c) || !!done[c];
  const done = {}, pending = {};
  const plainObj = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v !== 'function';
  function install(c, P) {
    for (const k of Object.keys(P)) {
      const r = REG[k]; if (!r) continue;
      const v = P[k];
      if (r.apply) { r.apply(c, v); continue; }
      if (plainObj(v) && plainObj(r.dict.en)) Object.setPrototypeOf(v, r.dict.en);
      r.dict[c] = v;
    }
    done[c] = true;
  }
  function bytes(b64) { const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  // Paketi açar (deflate-raw + base64; tarayıcının DecompressionStream özelliği). İnternet gerekmez.
  function load(c) {
    if (!packed(c) || done[c]) return Promise.resolve(c);
    if (pending[c]) return pending[c];
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('DecompressionStream'));
    const ds = new DecompressionStream('deflate-raw');
    pending[c] = new Response(new Blob([bytes(PK()[c])]).stream().pipeThrough(ds)).text()
      .then(src => { install(c, new Function('"use strict"; return (' + src + '\n);')()); return c; })
      .finally(() => { delete pending[c]; });
    return pending[c];
  }
  const canLoad = () => typeof DecompressionStream !== 'undefined';
  G.HRLangs = { LANGS, ORDER, get, pick, chain, reg, REG, packed, ready, load, canLoad };
})(typeof globalThis !== 'undefined' ? globalThis : window);
