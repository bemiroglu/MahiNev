/* Dil kaydı: arayüz dilleri, yerel biçimler, yazı yönü ve her dilde Tam İlmihâl’in adı ve bağlantıları.
 * Yeni bir dil eklemek için: buraya bir kayıt, i18n dosyalarına T[kod] ve MONTHS[kod], explain.js / guide.js / sky.js /
 * starmap.js / gok.js sözlüklerine birer bölüm eklenir (bkz. docs/coklu-dil.md). Eksik metinler İngilizceden gelir.
 * Program içindeki sayfa numaraları Türkçe Tam İlmihâl’in Ocak 2026 baskısına göredir. */
(function (G) {
  'use strict';
  const HK = 'https://www.hakikatkitabevi.net/';
  const LANGS = {
    tr: { code: 'tr', name: 'Türkçe', short: 'TR', locale: 'tr-TR', dir: 'ltr', fallback: null,
      book: { title: 'Tam İlmihâl Se’âdet-i Ebediyye', page: HK + 'book.php?bookCode=001', pdf: HK + 'downloads/001.pdf', pages: 'tr-2026-01' } },
    en: { code: 'en', name: 'English', short: 'EN', locale: 'en-GB', dir: 'ltr', fallback: 'tr',
      // Endless Bliss dört fasikül hâlinde ayrı ayrı indirilir; bu yüzden yalnız kitap sayfası verilir.
      book: { title: 'Endless Bliss', page: HK + 'book.php?bookCode=025', pdf: null, pages: null } }
  };
  const ORDER = ['tr', 'en'];
  const get = L => LANGS[L] || LANGS.en;
  // Dile göre sözlükten seçim: önce istenen dil, sonra İngilizce, sonra Türkçe
  const pick = (dict, L) => (dict && (dict[L] || dict.en || dict.tr)) || {};
  // Eksik anahtarlar için yedek zinciri: dil → İngilizce (İngilizce ve Türkçe kendileri tamdır)
  function chain(T) {
    for (const L of Object.keys(T)) if (L !== 'en' && L !== 'tr' && T.en && Object.getPrototypeOf(T[L]) !== T.en) Object.setPrototypeOf(T[L], T.en);
    return T;
  }
  G.HRLangs = { LANGS, ORDER, get, pick, chain };
})(typeof globalThis !== 'undefined' ? globalThis : window);
