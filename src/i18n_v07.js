/* metinleri: Mâh-ı Nev adı, lisans ve yayın bildirimi, HTML indirme, önceki/sonraki rasad */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.7.0';
  Object.assign(G.HRI18N.T.tr, {
    appTitle: 'Mâh-ı Nev',
    appSub: 'Hilâl Rasad Yardımcısı · Tam İlmihâl Se’âdet-i Ebediyye esaslı',
    appFull: 'Mâh-ı Nev — Hilâl Rasad Yardımcısı',
    dlHtml: 'HTML’yi indir', dlHtmlTip: 'Programın bu sürümünü tek bir HTML dosyası olarak indirin; internetsiz çalışır.',
    dlDone: 'İndirme başladı.', dlFail: 'Bu ortamda indirme yapılamadı.',
    upPrev: 'Önceki hilâl rasadı', upPrevGo: 'O geceyi aç', upNextNote: 'Bu akşamın arama penceresi geçti; bir sonraki ay başı rasadı gösteriliyor.',
    licTitle: 'Bu araç, kaynak ve lisans',
    licText: 'Ticarî olmayan kullanım için, değiştirilmeden ve kaynak gösterilerek paylaşılabilir. Değiştirilmiş kopyalar dağıtılamaz.',
    licOfficial: 'Programın özgün dosyası yalnız şu adreste yayımlanır:',
    licThird: 'Gömülü üçüncü taraf bileşenler kendi lisanslarıyla gelir',
    tamper: 'Bu kopya, yayımlanan özgün dosyayla eşleşmiyor; değiştirilmiş olabilir. Hesaplara güvenmeden önce özgün dosyayı indirin:',
    tamperShort: 'değiştirilmiş kopya',
    printFooter: 'Bu çıktı takvim değildir. Kamerî ay başı, hilâlin çıplak gözle görülmesiyle (rü’yet) kesinleşir; burada verilenler hesâbî imkândır (Tam İlmihâl, s. 315, 360).'
  });
  Object.assign(G.HRI18N.T.en, {
    appTitle: 'Mâh-ı Nev',
    appSub: 'Crescent Sighting Assistant · based on Tam İlmihâl Se’âdet-i Ebediyye',
    appFull: 'Mâh-ı Nev — Crescent Sighting Assistant',
    dlHtml: 'Download HTML', dlHtmlTip: 'Download this version of the program as a single HTML file; it works offline.',
    dlDone: 'Download started.', dlFail: 'Downloading is not possible in this environment.',
    upPrev: 'Previous crescent watch', upPrevGo: 'Open that night', upNextNote: 'This evening’s search window has passed; the next month-start watch is shown.',
    licTitle: 'This tool, its source and licence',
    licText: 'May be shared for non-commercial use, unmodified and with attribution. Modified copies may not be distributed.',
    licOfficial: 'The original file of the program is published only at:',
    licThird: 'Embedded third-party components come with their own licences',
    tamper: 'This copy does not match the published original file and may have been modified. Download the original before relying on its results:',
    tamperShort: 'modified copy',
    printFooter: 'This printout is not a calendar. The lunar month begins when the crescent is seen with the naked eye (rü’yet); what is given here is computed possibility (Tam İlmihâl, pp. 315, 360).'
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
