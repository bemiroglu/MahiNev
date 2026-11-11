/* Metinler: internet izinleri, JPG çıktısı, UTC saat farkı */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.9.0-deneme.1';
  Object.assign(G.HRI18N.T.tr, {
    // İnternet bağlantıları ve izinler
    hOnline: 'İnternet bağlantıları ve izinler',
    netIntro: 'Bütün astronomik hesaplar internetsiz çalışır. İnternet bağlantıları (hava tahmini, yazı tipleri) başlangıçta kapalıdır; yalnız siz açarsanız kullanılır. Otomatik konum internet kullanmaz; tarayıcının konum izniyle çalışır.',
    optWx: 'Hava ve görüş tahmini (Open-Meteo)',
    netWx: 'Açıkken yaklaşık konum (≈1 km) open-meteo.com’a gönderilir; konum otomatik alındığında zemin rakımı da buradan sorulur.',
    optFonts: 'Yazı tiplerini internetten yükle (Google Fonts)',
    netFonts: 'Açıkken tarayıcınız fonts.googleapis.com ve fonts.gstatic.com’a bağlanır; IP adresiniz bu sunuculara ulaşır. Kapalıyken cihazın kendi yazı tipleri kullanılır.',
    optAutoLoc: 'Konumu otomatik al (cihaz izniyle)',
    netLoc: 'İnternete bağlanmaz: konumu cihazınızın konum servisi verir ve konum cihazdan çıkmaz. Tarayıcı ilk kullanımda izin ister.',
    netNone: 'Şu anda açık internet bağlantısı yok.',
    tzOff: 'UTC farkı', tzOffTip: 'Saat farkını yazabilirsiniz: +3, -5, +5:30, UTC+2 gibi. Yazdığınız farka uyan sabit dilim seçilir.',
    tzRegional: 'Bölgesel saat dilimleri (yaz saatini izler)', tzFixed: 'Sabit saat farkı (yaz saati yok)',
    tzFixedNote: o => `Sabit saat farkı UTC${o}: yaz saati uygulanmaz. Bölgenizde yaz saati varsa listeden bölgesel dilimi seçin.`,
    tzDstNote: (z, w, s, o) => `${z}: kışın UTC${w}, yaz saatinde UTC${s}. Seçili tarihte UTC${o}.`,
    tzStdNote: (z, o) => `${z}: UTC${o}; bu dilimde yaz saati uygulanmıyor.`,
    tzOffErr: 'Saat farkı anlaşılamadı. Örnek: +3, -5, +5:30 (−12 ile +14 arası).',
    tzAuto: o => `Konum seçili saat diliminden çok uzak; saat farkı tûlden hesaplandı: UTC${o}. Bölgenin resmî saati farklıysa “UTC farkı” kutusundan veya listeden düzeltin.`,
    jpgGo: 'JPG resmi olarak kaydet', jpgShort: 'JPG', jpgMaking: 'JPG hazırlanıyor…',
    jpgDone: n => n > 1 ? `${n} sayfa JPG olarak hazırlandı (ZIP).` : 'Sayfa JPG olarak hazırlandı.',
    jpgFail: 'Bu tarayıcıda JPG üretilemedi. “Yazdır / PDF” ile PDF olarak kaydedebilirsiniz.',
    jpgNote: 'JPG: her A4 sayfası ayrı bir resim olur (yaklaşık 240 dpi); birden çok sayfa seçilirse ZIP dosyası olarak iner.',
    netOn: s => `Açık bağlantılar: ${s}`,
    onlineNote: 'İnternet ve konum olmadan da astronomik hesapların hepsi çalışır.',
    privacyNote: 'Gizlilik: Mâh-ı Nev, siz açmadıkça internete hiç bağlanmaz. Konumunuz, kayıtlarınız, adınız, iletişim bilginiz ve fotoğraf önizlemeleri yalnız bu tarayıcıda saklanır; hiçbir sunucuya gönderilmez. Açabileceğiniz bağlantılar yukarıdadır: hava tahmini open-meteo.com’a yaklaşık konum gönderir; internet yazı tipleri Google sunucularına bağlanır; otomatik konum internet kullanmaz. Sayfadaki GitHub ve lisans bağlantıları yalnız siz tıkladığınızda açılır. Programda reklam, sayaç veya izleme kodu yoktur.'
  });
  Object.assign(G.HRI18N.T.en, {
    hOnline: 'Internet connections and permissions',
    netIntro: 'All astronomical calculations work offline. Internet connections (forecast, fonts) are off by default and used only if you turn them on. Automatic location uses no internet; it works with the browser’s location permission.',
    optWx: 'Weather and visibility forecast (Open-Meteo)',
    netWx: 'When on, an approximate location (≈1 km) is sent to open-meteo.com; the ground elevation for an automatic location is also looked up there.',
    optFonts: 'Load fonts from the internet (Google Fonts)',
    netFonts: 'When on, your browser connects to fonts.googleapis.com and fonts.gstatic.com, which see your IP address. When off, the device’s own fonts are used.',
    optAutoLoc: 'Take location automatically (with device permission)',
    netLoc: 'Uses no internet: the device’s location service provides it and it never leaves the device. The browser asks for permission on first use.',
    netNone: 'No internet connection is currently enabled.',
    tzOff: 'UTC offset', tzOffTip: 'Type an offset: +3, -5, +5:30, UTC+2 etc. A fixed zone matching it is selected.',
    tzRegional: 'Regional time zones (follow daylight saving)', tzFixed: 'Fixed offset (no daylight saving)',
    tzFixedNote: o => `Fixed offset UTC${o}: no daylight saving. If your region uses daylight saving, pick the regional zone from the list.`,
    tzDstNote: (z, w, s, o) => `${z}: UTC${w} in winter, UTC${s} in daylight saving time. UTC${o} on the selected date.`,
    tzStdNote: (z, o) => `${z}: UTC${o}; no daylight saving in this zone.`,
    tzOffErr: 'Offset not understood. Examples: +3, -5, +5:30 (between −12 and +14).',
    tzAuto: o => `The location is far from the selected time zone; the offset was computed from longitude: UTC${o}. If the official time differs, correct it with the “UTC offset” box or the list.`,
    jpgGo: 'Save as JPG image', jpgShort: 'JPG', jpgMaking: 'Preparing JPG…',
    jpgDone: n => n > 1 ? `${n} pages prepared as JPG (ZIP).` : 'Page prepared as JPG.',
    jpgFail: 'JPG could not be produced in this browser. Use “Print / PDF” to save a PDF.',
    jpgNote: 'JPG: each A4 page becomes a separate image (about 240 dpi); several pages download as a ZIP file.',
    netOn: s => `Enabled connections: ${s}`,
    onlineNote: 'All astronomical calculations work without internet or location.',
    privacyNote: 'Privacy: Mâh-ı Nev never connects to the internet unless you turn a connection on. Your location, records, name, contact details and photo previews are kept only in this browser and are never sent to a server. The connections you can enable are listed above: the forecast sends an approximate location to open-meteo.com; web fonts connect to Google’s servers; automatic location uses no internet. The GitHub and licence links open only when you click them. The program contains no ads, counters or tracking code.'
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
