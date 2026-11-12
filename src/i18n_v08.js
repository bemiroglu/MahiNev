/* metinleri: bağımsız inceleme raporu sonrası düzeltmeler — göz güvenliği, kayıt bütünlüğü ve yedekleme,
   gözlem sonucu türleri, form denetimleri, hesap/rasad/hüküm ayrımı, kapsam ve izlenebilirlik notları */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.8.0';
  G.HR_RULES = 'TI-360/1';   // kural kümesi: Tam İlmihâl s. 178, 188, 194, 197, 315–316, 360 (docs/kanonik-rapor.md)
  Object.assign(G.HRI18N.T.tr, {
    // Göz güvenliği
    safety: 'Göz güvenliği: Güneş tamamen batmadan dürbün, teleskop, kamera vizörü veya telefon yakınlaştırmasıyla batı ufkuna bakmayın. Güneş ışığı optik cihazla bakıldığında gözde kalıcı hasar yapar. Önce Güneş’in battığından emin olun; hilâli çıplak gözle arayın.',
    safetyShort: 'Güneş batmadan dürbünle batıya bakmayın.',
    safetyMobile: 'Göz güvenliği: Güneş batmadan dürbün, kamera veya teleskopla batıya bakmayın; gözde kalıcı hasar yapar. Hilâli çıplak gözle arayın.',
    // Gözlem sonuçları
    recRes: { naked: 'Çıplak gözle gördüm', aidedNaked: 'Önce dürbünle bulup sonra çıplak gözle gördüm', aided: 'Yalnız dürbün/teleskopla gördüm', photo: 'Yalnız fotoğrafla tespit edildi', doubt: 'Şüpheli: gördüğüm cismin hilâl olduğundan emin değilim', not: 'Dikkatle aradım, göremedim', noObs: 'Gözlem yapılamadı (bulut, ufuk engeli vb.)' },
    evDoubt: 'Şüpheli gözlem rü’yet beyanı sayılmaz; yalnız bilgi olarak saklanır.',
    evNotSaw: 'Kaydedildi: açık arama yapıldı, hilâl görülemedi. Bu kayıt tek başına ayın otuza tamamlandığını göstermez.',
    evNoObs: 'Kaydedildi: gözlem yapılamadı. Bu kayıt hilâlin gökte bulunmadığını göstermez.',
    evReject: 'Tam İlmihâl’e göre bu akşam hilâl görülemez: hesapla anlaşılan kat’îdir ve bu şartlardaki görme beyanı kabul edilmez (İmâm-ı Sübkî, s. 360). Beyanı değerlendirmek yetkili makama aittir.',
    evOk: 'Hesapla çelişmiyor. Ay başı, şahitlik şartlarıyla ve yetkili makamın kararıyla sabit olur (s. 315–316).',
    // Form denetimleri
    recErrSeers: 'Gördüğünüzü bildiriyorsunuz; gören kişi sayısı en az 1 olmalı.',
    recErrOrder: 'İlk görme saati, son görme saatinden sonra olamaz.',
    recErrFuture: 'Kayıt zamanı ileri bir tarihte görünüyor; saati kontrol edin.',
    recAnon: 'İsimsiz beyan: gözlemci adı yazılmadı. Kayıt bilgi olarak saklanır; imzalı şahitlik tutanağı yerine geçmez.',
    // Saklama, yedekleme, fotoğraf doğrulama
    recStoreFail: 'Kayıt bu tarayıcıda saklanamadı (depolama dolu olabilir). Kayıt JSON dosyası olarak indiriliyor; lütfen saklayın ve yedek alıp eski kayıtları silin.',
    recMany: n => `${n} kayıt var. Tarayıcı depolaması sınırlıdır; “Tüm kayıtları yedekle” ile yedek alın.`,
    recBackup: 'Tüm kayıtları yedekle', recImport: 'Yedekten geri yükle', recPhotoCheck: 'Fotoğrafı doğrula',
    recImported: (a, b) => `${a} kayıt eklendi, ${b} kayıt zaten vardı.`, recImportBad: 'Dosya okunamadı ya da Mâh-ı Nev kaydı değil.',
    recPhotoMatch: d => `Bu fotoğraf şu kayda aittir: ${d}. Özet eşleşiyor.`, recPhotoNone: 'Bu fotoğrafın özeti hiçbir kayıtla eşleşmiyor.',
    recPhotoKeep: 'Özgün fotoğraf dosyasını ayrıca saklayın. Kayıtta yalnız özeti (SHA-256) ve küçük önizlemesi bulunur; özgün dosya “Fotoğrafı doğrula” ile kayda bağlanabilir.',
    recThumbDropped: 'önizleme depolama yetersizliği yüzünden saklanmadı',
    recBackupNote: 'Kayıtlar yalnız bu tarayıcıda durur; tarayıcı verisi silinirse kaybolur. Düzenli yedek alın.',
    // Hicrî tarih ve kapsam
    hjBook: 'Hesâbî tarihtir; ay başı rü’yetle kesinleşir. Tam İlmihâl: “Hilâli görmekle Ramezânın başlaması, hesâbla anlaşılandan bir gün sonra olabilir. Fekat bir gün önce olamaz” (s. 315).',
    globalScope: 'Dünya geneli: aynı takvim gününün en geç gurûbu tarih çizgisinin hemen doğusunda olduğundan arama orada, kutup daireleri arasında (±66°) yapılır. Bütün dünya taramasıyla aynı günü verdiği doğrulanmıştır.',
    // Yükseklik
    hMaxUnset: 'Şehrin en yüksek yeri girilmedi (0 m alındı); şer’î gurûb ve temkin bu yükseklik olmadan hesaplandı (s. 176, 186). Biliyorsanız girin.',
    // Pusula, hassasiyet, gizlilik
    compassNote: 'Pusula yaklaşık yön verir: telefonun manyetik ölçümüdür, manyetik sapma düzeltilmez. Araç, gemi ve çelik yapı yakınında yanıltır. Yönü yardımcı yıldızlarla teyit edin.',
    precisionNote: 'Hesap hassasiyeti ile gözlem hassasiyeti farklıdır. Gök cisimlerinin konumu yaklaşık 1 yay dakikası hassasiyetle hesaplanır; fakat ufuk yakınında ışığın kırılması hava sıcaklığı, basınç ve tabakalaşmayla değişir. Batış saatleri bu yüzden gerçekte 1–2 dakika, deniz üstünde daha fazla farklı olabilir. Program saatleri dakika olarak verir.',
    privacyNote: 'Gizlilik: Konum, kayıtlar, isim ve fotoğraf önizlemeleri yalnız bu tarayıcıda saklanır; hiçbir sunucuya gönderilmez. Otomatik konum cihazınızın izniyle alınır ve cihazdan çıkmaz. Yalnız hava tahmini açıkken yaklaşık konum open-meteo.com’a gönderilir.',
    claimReject: 'Tam İlmihâl’e göre kabul edilmez (İmâm-ı Sübkî, s. 360)', claimOk: 'Hesapla çelişmez; hüküm şahitlik şartlarıyla',
    traceRules: 'Kural kümesi', traceEngine: 'Astronomi çekirdeği',
    width: 'Hilâl kalınlığı W (Yallop / Odeh)', arcl: 'ARCL (jeosentrik, Yallop / topozentrik, Odeh)', arcv: 'ARCV (jeosentrik, Yallop / topozentrik, Odeh)',
    introToggle: 'Nasıl kullanılır? (aç / kapat)',
    noteFull: 'notun tamamı JSON kaydındadır'
  });
  Object.assign(G.HRI18N.T.en, {
    safety: 'Eye safety: until the Sun has fully set, do not look toward the western horizon through binoculars, a telescope, a camera viewfinder or phone zoom. Sunlight seen through optics can cause permanent eye damage. Make sure the Sun has set; search for the crescent with the naked eye.',
    safetyShort: 'Do not point binoculars west before sunset.',
    safetyMobile: 'Eye safety: do not look west through binoculars, a camera or a telescope before sunset; it can permanently damage the eye. Search with the naked eye.',
    recRes: { naked: 'Seen with the naked eye', aidedNaked: 'Found with binoculars, then seen with the naked eye', aided: 'Seen only with binoculars/telescope', photo: 'Detected only by photograph', doubt: 'Uncertain: not sure the object was the crescent', not: 'Searched carefully, not seen', noObs: 'Could not observe (clouds, obstructed horizon, etc.)' },
    evDoubt: 'An uncertain observation is not a sighting claim; it is kept for information only.',
    evNotSaw: 'Recorded: a clear search was made and the crescent was not seen. This record alone does not show that the month completes thirty days.',
    evNoObs: 'Recorded: no observation was possible. This record does not show that the crescent was absent.',
    evReject: 'Per Tam İlmihâl the crescent cannot be seen this evening: what is known by calculation is certain, and a sighting claim under these conditions is not accepted (Imam Subki, p. 360). Evaluating the claim belongs to the competent authority.',
    evOk: 'Consistent with calculation. The month is established by witnesses meeting the conditions and by the competent authority (pp. 315–316).',
    recErrSeers: 'You report a sighting; the number of people who saw it must be at least 1.',
    recErrOrder: 'The first-seen time cannot be after the last-seen time.',
    recErrFuture: 'The record time appears to be in the future; check the clock.',
    recAnon: 'Anonymous statement: no observer name. The record is kept for information; it does not replace a signed witness report.',
    recStoreFail: 'The record could not be stored in this browser (storage may be full). It is being downloaded as a JSON file; keep it, back up and remove old records.',
    recMany: n => `${n} records. Browser storage is limited; use “Back up all records”.`,
    recBackup: 'Back up all records', recImport: 'Restore from backup', recPhotoCheck: 'Verify a photo',
    recImported: (a, b) => `${a} records added, ${b} already present.`, recImportBad: 'The file could not be read or is not a Mâh-ı Nev record.',
    recPhotoMatch: d => `This photo belongs to the record of ${d}. Digest matches.`, recPhotoNone: 'This photo’s digest matches no record.',
    recPhotoKeep: 'Keep the original photo file separately. The record holds only its digest (SHA-256) and a small preview; the original can be linked back with “Verify a photo”.',
    recThumbDropped: 'preview not stored for lack of storage space',
    recBackupNote: 'Records live only in this browser and are lost if browser data is cleared. Back up regularly.',
    hjBook: 'A computed date; the month is established by sighting. Tam İlmihâl: beginning Ramadan by sighting the crescent may be one day later than what is known by calculation, but it cannot be one day earlier (p. 315).',
    globalScope: 'Worldwide: the latest sunset of a given calendar day is just east of the date line, so the search is made there, between the polar circles (±66°). Verified to give the same day as a whole-world scan.',
    hMaxUnset: 'The city’s highest point was not entered (0 m used); the legal sunset and temkin were computed without it (pp. 176, 186). Enter it if known.',
    compassNote: 'The compass is approximate: it is the phone’s magnetic reading, not corrected for magnetic variation, and misleads near vehicles, ships and steel structures. Confirm the direction with the guide stars.',
    precisionNote: 'Calculation accuracy is not observation accuracy. Positions are computed to about 1 arc-minute, but refraction near the horizon varies with temperature, pressure and layering. Setting times may therefore differ by 1–2 minutes in reality, more over the sea. Times are given to the minute.',
    privacyNote: 'Privacy: location, records, names and photo previews are kept only in this browser and are never sent to a server. Automatic location uses your device permission and stays on the device. Only when the weather forecast is on is an approximate location sent to open-meteo.com.',
    claimReject: 'Not accepted per Tam İlmihâl (Imam Subki, p. 360)', claimOk: 'Not contradicted; ruling by witness conditions',
    traceRules: 'Rule set', traceEngine: 'Astronomy core',
    width: 'Crescent width W (Yallop / Odeh)', arcl: 'ARCL (geocentric, Yallop / topocentric, Odeh)', arcv: 'ARCV (geocentric, Yallop / topocentric, Odeh)',
    introToggle: 'How to use (show / hide)',
    noteFull: 'full note in the JSON record'
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
