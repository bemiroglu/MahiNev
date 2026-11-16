/* Metinler: 0.14 (harita: Tam İlmihâl ölçü çizgileri, üç gece, işaretler, ağ, şehirler, PNG; hilâl verileri) */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.15.0';
  const T = G.HRI18N.T;
  Object.assign(T.tr, {
    mapOpts: 'Görünüm', mapBook: 'Tam İlmihâl ölçü çizgileri (8°, 18°, 5°)', mapFirst: 'İlk mümkün / görülebilir yer', mapGrat: 'Enlem-boylam ağı',
    mapCities: 'Şehirler', mapRelief: 'Kabartma', mapHatch: 'Kesin redde tarama',
    mapValue: 'Değer çizgisi (ek bilgi)',
    mapValueOpts: { none: 'Yok', elong: 'Beynûnet (°)', alt: 'Gurûbda irtifâ (°)', age: 'Hilâl yaşı (saat)', win: 'Gurûbdan 5° irtifâya (dk)', lag: 'Gurûbdan ayın batışına (dk)', arcv: 'ARCV (°)', width: 'Hilâl kalınlığı (′)' },
    valUnit: { h: ' sa', min: ' dk' },
    bookLbl: { e8: 'beynûnet 8°', e18: 'beynûnet 18°', a5: 'irtifâ 5°' },
    gratDir: { N: 'K', S: 'G', E: 'D', W: 'B' },
    mapView: 'Akşamlar', mapViewOpts: { one: 'Seçili akşam', three: 'Üç gece yan yana' },
    night3: { prev: 'Önceki akşam', A: 'Birinci gece', B: 'İkinci gece' },
    night3Sub: { prev: ev => `${ev} akşamı · ay başı bundan önce olamaz (s. 315)`, A: (ev, d) => `${ev} akşamı · görülürse 1. gün ${d}`, B: (ev, d) => `${ev} akşamı · birinci gece görülmezse 1. gün ${d}` },
    map3Note: 'Aynı ayın üç akşamı. Ayın 1. günü, birinci gecenin ertesi günü (hesâbî gün) veya bir gün sonrasıdır; önce olamaz (s. 315). Hangisi olduğu rü’yetle kesinleşir.',
    map3First: '“İlk görünürlük akşamı” katmanı tek haritada dört akşamı zaten gösterir; üç gece görünümünde Tam İlmihâl sınıfları çizilir.',
    firstLbl: { poss: 'İlk mümkün yer', vis: 'İlk görülebilir yer' },
    firstSub: (tm, b) => `gurûb ${tm} · beynûnet ${b}`,
    lgBook8: 'Beynûnet 8° çizgisi (altı kesin red)', lgBook18: 'Beynûnet 18° çizgisi (üstü görülebilir)', lgBook5: 'Gurûbda irtifâ 5° (kesikli)',
    lgUp0: 'Gurûbda ay ufukta (noktalı)', lgHatch: 'Taralı: kesin red', lgFirst8: 'İlk mümkün yer (bu akşam gurûbu en erken olan)', lgFirst18: 'İlk görülebilir yer (bu akşam gurûbu en erken olan)', lgValue: v => `İnce çizgi: ${v}`,
    lgYallopLine: 'Yallop q sınırları (ince çizgi)', lgOdehLine: 'Odeh V sınırları (ince çizgi)', lgGrat: 'Ağ: 20°',
    mapPng: 'PNG kaydet', mapPngTip: 'Haritayı başlık, açıklama ve kaynakla birlikte seçili dilde resim olarak kaydeder.',
    mapWait: 'Harita hazırlanıyor…', mapSaved: 'Resim kaydedildi.',
    pngSrc: (b, v) => `Kaynak: ${b} (s. 315, 360) · Hesap: Astronomy Engine · Kabartma: NASA Blue Marble · Mâh-ı Nev ${v}`,
    pngNote: 'Hesâbî imkân haritasıdır; ay başı rü’yetle kesinleşir.',
    pickMore: 'Ek bilgi (bu nokta, gurûb anı)',
    // Plan ek bilgi: hilâl verileri (gurûb anı, topozentrik)
    hcTitle: 'Hilâl verileri (gurûb anı)', hcNote: 'Ek bilgidir; hüküm Tam İlmihâl’in ölçüleriyle ve rü’yetle verilir.',
    hcSunAzAlt: 'Güneş: azimut / irtifâ', hcMoonAzAlt: 'Ay: azimut / irtifâ', hcDaz: 'DAZ (azimut farkı)', hcSd: 'Ayın yarıçapı (SD)', hcHp: 'Ayın ufkî paralaksı (HP)',
    hcDist: 'Ayın uzaklığı (merkezden)', hcIllum: 'Aydınlık oran', hcElongGeo: 'Beynûnet (jeosentrik / topozentrik)', hcConj: 'İctimâ (yerel / UTC)', hcWin: 'Gurûbdan 5° irtifâya kadar',
    hcMoonset: 'Ayın batışı', km: 'km', hcArcv: 'ARCV (gurûb anı, topozentrik)', hcWidth: 'Hilâl kalınlığı (gurûb anı)', hcDistSub: 'yer merkezinden / gözlemciden',
    prOptsMap3: 'Dünya haritası: üç gece (her gece ayrı A4)'
  });
  Object.assign(T.en, {
    mapOpts: 'Display', mapBook: 'Tam İlmihâl’s measure lines (8°, 18°, 5°)', mapFirst: 'First possible / visible place', mapGrat: 'Latitude–longitude grid',
    mapCities: 'Cities', mapRelief: 'Relief', mapHatch: 'Hatch definite rejection',
    mapValue: 'Value line (additional info)',
    mapValueOpts: { none: 'None', elong: 'Beynûnet (elongation, °)', alt: 'İrtifâ at sunset (°)', age: 'Moon age (hours)', win: 'Sunset to 5° irtifâ (min)', lag: 'Sunset to moonset (min)', arcv: 'ARCV (°)', width: 'Crescent width (′)' },
    valUnit: { h: ' h', min: ' min' },
    bookLbl: { e8: 'beynûnet 8°', e18: 'beynûnet 18°', a5: 'irtifâ 5°' },
    gratDir: { N: 'N', S: 'S', E: 'E', W: 'W' },
    mapView: 'Evenings', mapViewOpts: { one: 'Selected evening', three: 'Three nights side by side' },
    night3: { prev: 'Evening before', A: 'First night', B: 'Second night' },
    night3Sub: { prev: ev => `evening of ${ev} · the month cannot begin before this (EB V, p. 57)`, A: (ev, d) => `evening of ${ev} · if seen, day 1 is ${d}`, B: (ev, d) => `evening of ${ev} · if not seen on the first night, day 1 is ${d}` },
    map3Note: 'Three evenings of the same month. Day 1 of the month is the day after the first night (the calculated day) or one day later; it cannot be earlier (EB V, p. 57). Which of the two it is becomes certain by sighting.',
    map3First: 'The “first-visibility evening” layer already shows four evenings on one map; the three-night view draws Tam İlmihâl’s classes.',
    firstLbl: { poss: 'First possible place', vis: 'First visible place' },
    firstSub: (tm, b) => `sunset ${tm} · beynûnet ${b}`,
    lgBook8: 'Beynûnet 8° line (below: definite rejection)', lgBook18: 'Beynûnet 18° line (above: visible)', lgBook5: 'İrtifâ 5° at sunset (dashed)',
    lgUp0: 'Moon on the horizon at sunset (dotted)', lgHatch: 'Hatched: definite rejection', lgFirst8: 'First possible place (earliest sunset this evening)', lgFirst18: 'First visible place (earliest sunset this evening)', lgValue: v => `Thin line: ${v}`,
    lgYallopLine: 'Yallop q boundaries (thin line)', lgOdehLine: 'Odeh V boundaries (thin line)', lgGrat: 'Grid: 20°',
    mapPng: 'Save PNG', mapPngTip: 'Saves the map as an image in the selected language, with title, legend and source.',
    mapWait: 'Preparing the map…', mapSaved: 'Image saved.',
    pngSrc: (b, v) => `Source: ${b}, Fifth Fascicle, pp. 57, 137 · Computation: Astronomy Engine · Relief: NASA Blue Marble · Mâh-ı Nev ${v}`,
    pngNote: 'A map of calculated possibility; the month begins by sighting.',
    pickMore: 'Additional info (this point, at sunset)',
    hcTitle: 'Crescent data (at sunset)', hcNote: 'Additional information; the ruling follows Tam İlmihâl’s measures and sighting.',
    hcSunAzAlt: 'Sun: azimuth / irtifâ', hcMoonAzAlt: 'Moon: azimuth / irtifâ', hcDaz: 'DAZ (azimuth difference)', hcSd: 'Moon’s semi-diameter (SD)', hcHp: 'Moon’s horizontal parallax (HP)',
    hcDist: 'Moon’s distance (centre)', hcIllum: 'Illuminated fraction', hcElongGeo: 'Beynûnet (geocentric / topocentric)', hcConj: 'Conjunction (local / UTC)', hcWin: 'Sunset to 5° irtifâ',
    hcMoonset: 'Moonset', km: 'km', hcArcv: 'ARCV (at sunset, topocentric)', hcWidth: 'Crescent width (at sunset)', hcDistSub: 'from Earth’s centre / from the observer',
    prOptsMap3: 'World map: three nights (each night on its own A4)'
  });
  T.tr.mapLand = T.tr.landOnly; T.en.mapLand = T.en.landOnly;
  // Sıkıştırılmış dil paketleri (fr, es, bs)
  T.tr.packOld = 'Bu dil paketi bu tarayıcıda açılamıyor (Chrome/Edge 103+, Firefox 113+, Safari 16.4+ gerekir). İngilizce gösteriliyor.';
  T.tr.packFail = 'Dil paketi açılamadı; İngilizce gösteriliyor.';
  T.en.packOld = 'This language pack cannot be opened in this browser (Chrome/Edge 103+, Firefox 113+, Safari 16.4+ needed). Showing English.';
  T.en.packFail = 'The language pack could not be opened; showing English.';
  // Otomatik çeviri uyarısı: yalnız dil paketlerinde (fr, es, bs) dolu; Türkçe ve İngilizcede boş kalır, gösterilmez
  T.tr.mtNote = ''; T.en.mtNote = '';
  // Bağımsız inceleme düzeltmeleri (A1–A8)
  Object.assign(T.tr, {
    lagBefore: m => `Ay güneşten önce battı (${m} önce)`, lagBeforeNone: 'Ay güneşten önce battı',
    recImportBig: 'Dosya çok büyük ya da çok fazla kayıt içeriyor (en çok 25 MB, 5.000 kayıt).',
    recImpTitle: 'Kayıtların içe aktarılması', recImpBad: 'Biçimi hatalı olduğu için alınmayan kayıtlar (hatalı alanlar):',
    recImpConf: 'Kayıt çatışması: aynı kimlikte, içeriği farklı kayıtlar. Birleştirilmedi; cihazdaki kayıt korundu.',
    recImpItem: n => `${n}. kayıt`, recDamaged: 'Bozuk kayıt (biçimi hatalı)',
    recSigBad: 'imza geçersiz', recUnsigned: 'imzasız',
    dstGap: (loc, u) => `Bu yerel saat, yaz saatine geçiş yüzünden bu tarihte yaşanmaz; ${loc} olarak alındı (${u}).`,
    dstFold: u => `Bu yerel saat, yaz saatinden dönüşte bu tarihte iki kez yaşanır; ilki alındı (${u}).`,
    obstLbl: 'Batı ufku engeli (°, isteğe bağlı)',
    obstNote: 'Batı ufkunda dağ veya bina varsa yüksekliğini derece olarak yazın (kol uzatılmış bir yumruk ≈ 10°). Hesap ve Tam İlmihâl’in sınıfı değişmez; program yalnız hilâlin engelin üstünde kalıp kalmadığını ayrıca söyler. Boş veya 0: kullanılmaz.',
    obstRow: 'Ufuk engeli', obstAbove: (d, tm) => `Gurûbda hilâl engelin ${d} üstünde; ${tm} sularında engelin arkasına iner.`,
    obstAboveAll: d => `Gurûbda hilâl engelin ${d} üstünde; batana kadar engelin üstünde kalır.`,
    obstBehind: 'Gurûbda hilâl engelin arkasında kalıyor; bu yerden görülemez. Batı ufku açık bir yer seçin.',
    obstNow: d => `engelin ${d} üstünde`, obstHidden: 'engelin arkasında',
    wxAt: s => `Tahmin ${s} itibarıyla alındı; sahada gökyüzüne kendiniz bakın, tahmin gözlemin yerine geçmez.`,
    shTitle: 'Paylaş', shIntro: 'Paylaşılacak bilgileri seçin. Gizlediğiniz bilgiler yalnız paylaşılan metinden çıkar; cihazdaki kayıt değişmez.',
    shName: 'Adım', shContact: 'İletişim bilgim', shLoc: 'Tam konum (seçilmezse yaklaşık 10 km’ye yuvarlanır)', shFile: 'Kayıt dosyasını (JSON) ekle: bütün bilgileri içerir, alıcı kaydı doğrulayabilir',
    shNote: 'Paylaşılan kayıt şahitlik yerine geçmez; hilâlin görüldüğünü doğrulamaz. Telefonun paylaşma menüsü yoksa metin panoya kopyalanır.',
    shHidden: s => `Paylaşılan metinde gizlenen bilgiler: ${s}. SHA-256 özeti asıl kayda aittir.`, shCopied: 'Paylaşma menüsü yok; metin panoya kopyalandı.',
    optDemo: 'Deneme (eğitim) kipi: hazır senaryolar; kayıtlar gerçek kayıtlardan ayrı tutulur',
    demoTag: 'DENEME KİPİ', demoNote: 'Kayıtlar ayrı tutulur; gerçek kayıtlara karışmaz.', demoPick: 'Senaryo seçin…', demoExit: 'Deneme kipinden çık',
    demoOn: 'Deneme kipi açıldı. Bir senaryo seçin; bu kipte oluşturduğunuz kayıtlar ve tutanaklar “DENEME” diye işaretlenir ve gerçek kayıtlarınıza karışmaz.',
    demoSc: ['Kolay gözlem: Londra, 16.6.2026 (görülebilir, uzun pencere)', 'Kısa pencere: İstanbul, 10.12.2026 (mümkün, 11 dk)', 'Hilâl doğmamış: İstanbul, 9.12.2026 (Ay güneşten önce batıyor)',
      'Kesin red: İstanbul, 7.4.2016 (beynûnet 4°, Receb 1437)', 'Zilhicce: Mekke, 7.5.2027 (Işık usulü)', 'Kutup bölgesi: Tromsø, 10.12.2026 (Güneş doğmuyor)'],
    phNoExif: 'Fotoğrafta çekim zamanı veya yön bilgisi (EXIF) yok.', phTzAssumed: '(saat farkı fotoğrafta yok; seçili saat dilimi varsayıldı)',
    phTaken: (s, d) => `Fotoğrafın çekim zamanı: ${s}` + (Math.abs(d) <= 1 ? ' (kayıt zamanıyla aynı)' : ` (kayıt zamanından ${Math.abs(d)} dk ${d > 0 ? 'sonra' : 'önce'})`),
    phDir: (a, r) => `kamera yönü: ${a}°${r ? ' (' + r + ')' : ''}`, phMag: 'manyetik kuzeye göre', phTrue: 'gerçek kuzeye göre',
    shaTitle: 'Dosyanın doğrulanması (SHA-256)', shaShort: 'Dosyayı doğrula',
    shaIntro: 'İndirdiğiniz program dosyasının yayımlanan dosyanın aynısı olduğunu denetleyebilirsiniz. Dosyayı aşağıdan seçin; program SHA-256 özetini hesaplar. Bu özeti GitHub’daki sürüm notunda yazan özetle karşılaştırın; ikisi aynıysa dosya değiştirilmemiştir. Hesap bu cihazda yapılır, dosya hiçbir yere gönderilmez.',
    shaPick: 'Program dosyası (.html)', shaExp: 'Yayımlanan özet (isteğe bağlı; yapıştırırsanız program karşılaştırır)',
    shaOk: 'Aynı: dosya yayımlanan dosyayla birebir aynı.', shaBad: 'Farklı: bu dosya yayımlanan dosyadan farklı. Programı yalnız yayın adresinden indirin.',
    shaCompare: 'Bu özeti sürüm notundaki özetle karşılaştırın.', shaFail: 'Özet hesaplanamadı.', shaLink: 'Sürüm notları ve yayımlanan özetler (GitHub)',
    shaLocal: 'Programın yerel bütünlük denetimi', shaLocalOk: 'eşleşiyor', shaLocalBad: 'eşleşmiyor: dosya değiştirilmiş olabilir',
    shaCmd: 'Bilgisayarda komutla da hesaplanabilir:',
    cpTrustCal: 'Güneşe göre ayarlı', cpTrustAcc: a => `ayarsız · ±${a}°`, cpTrustRaw: 'ayarsız: Güneşe göre ayarlayın',
    cpTrustNote: 'Telefon pusulası manyetik kuzeyi ölçer; gerçek kuzeyden farkı (manyetik sapma) yere göre birkaç dereceyi bulabilir. Yakındaki demir, araç, hoparlör ve elektrikli cihazlar ölçümü bozar. En güvenilir yol, telefonu Güneşe veya gurûb noktasına çevirip “Güneşle ayarla” ya da “Gurûb noktasıyla ayarla” düğmesine basmaktır. Pusula yoksa veya güvenilmezse program yönü sayıyla (semt) ve ufuk çiziminde gösterir.',
    vfScope: 'Doğrulama yalnız kaydın sonradan değiştirilmediğini (ve imzalıysa hangi cihaz anahtarıyla mühürlendiğini) gösterir; hilâlin görüldüğünü veya gözlemcinin kimliğini doğrulamaz.'
  });
  Object.assign(T.en, {
    lagBefore: m => `The Moon set before the Sun (${m} earlier)`, lagBeforeNone: 'The Moon set before the Sun',
    recImportBig: 'The file is too large or contains too many records (at most 25 MB, 5,000 records).',
    recImpTitle: 'Importing records', recImpBad: 'Records not imported because their format is invalid (invalid fields):',
    recImpConf: 'Record conflict: records with the same ID but different content. Not merged; the record on this device was kept.',
    recImpItem: n => `Record ${n}`, recDamaged: 'Damaged record (invalid format)',
    recSigBad: 'signature invalid', recUnsigned: 'unsigned',
    dstGap: (loc, u) => `This local time does not exist on this date because of the change to summer time; it was taken as ${loc} (${u}).`,
    dstFold: u => `This local time occurs twice on this date because of the change back from summer time; the first was taken (${u}).`,
    obstLbl: 'Western horizon obstruction (°, optional)',
    obstNote: 'If a hill or building blocks the western horizon, enter its height in degrees (a fist at arm’s length ≈ 10°). The calculation and the Tam İlmihâl class do not change; the program only tells you separately whether the crescent stays above the obstruction. Empty or 0: not used.',
    obstRow: 'Horizon obstruction', obstAbove: (d, tm) => `At sunset the crescent is ${d} above the obstruction; it goes behind it around ${tm}.`,
    obstAboveAll: d => `At sunset the crescent is ${d} above the obstruction; it stays above it until it sets.`,
    obstBehind: 'At sunset the crescent is behind the obstruction; it cannot be seen from this place. Choose a place with an open western horizon.',
    obstNow: d => `${d} above the obstruction`, obstHidden: 'behind the obstruction',
    wxAt: s => `Forecast retrieved at ${s}; look at the sky yourself in the field, a forecast does not replace observation.`,
    shTitle: 'Share', shIntro: 'Choose what to share. Hidden items are removed only from the shared text; the record on this device does not change.',
    shName: 'My name', shContact: 'My contact details', shLoc: 'Exact location (otherwise rounded to about 10 km)', shFile: 'Attach the record file (JSON): contains everything, the recipient can verify the record',
    shNote: 'A shared record is not testimony and does not verify that the crescent was seen. If the phone has no share menu, the text is copied to the clipboard.',
    shHidden: s => `Hidden in the shared text: ${s}. The SHA-256 digest belongs to the original record.`, shCopied: 'No share menu; the text was copied to the clipboard.',
    optDemo: 'Practice (training) mode: ready-made scenarios; records are kept apart from real records',
    demoTag: 'PRACTICE MODE', demoNote: 'Records are kept separately; they do not mix with real records.', demoPick: 'Choose a scenario…', demoExit: 'Leave practice mode',
    demoOn: 'Practice mode is on. Choose a scenario; records and reports made in this mode are marked “PRACTICE” and do not mix with your real records.',
    demoSc: ['Easy sighting: London, 16.6.2026 (visible, long window)', 'Short window: Istanbul, 10.12.2026 (possible, 11 min)', 'Crescent not yet born: Istanbul, 9.12.2026 (the Moon sets before the Sun)',
      'Rejected: Istanbul, 7.4.2016 (beynûnet 4°, Rajab 1437)', 'Dhu’l-hijja: Mecca, 7.5.2027 (Işık method)', 'Polar region: Tromsø, 10.12.2026 (the Sun does not rise)'],
    phNoExif: 'The photo has no capture time or direction (EXIF).', phTzAssumed: '(no time offset in the photo; the selected time zone was assumed)',
    phTaken: (s, d) => `Photo taken at: ${s}` + (Math.abs(d) <= 1 ? ' (same as the record time)' : ` (${Math.abs(d)} min ${d > 0 ? 'after' : 'before'} the record time)`),
    phDir: (a, r) => `camera direction: ${a}°${r ? ' (' + r + ')' : ''}`, phMag: 'from magnetic north', phTrue: 'from true north',
    shaTitle: 'Verifying the file (SHA-256)', shaShort: 'Verify the file',
    shaIntro: 'You can check that the program file you downloaded is identical to the published file. Choose the file below; the program computes its SHA-256 digest. Compare this digest with the one in the release notes on GitHub; if they are the same, the file has not been changed. The calculation is done on this device; the file is not sent anywhere.',
    shaPick: 'Program file (.html)', shaExp: 'Published digest (optional; paste it and the program compares)',
    shaOk: 'Same: the file is identical to the published file.', shaBad: 'Different: this file differs from the published file. Download the program only from its publication address.',
    shaCompare: 'Compare this digest with the one in the release notes.', shaFail: 'The digest could not be computed.', shaLink: 'Release notes and published digests (GitHub)',
    shaLocal: 'The program’s local integrity check', shaLocalOk: 'matches', shaLocalBad: 'does not match: the file may have been changed',
    shaCmd: 'It can also be computed on a computer with a command:',
    cpTrustCal: 'calibrated on the Sun', cpTrustAcc: a => `not calibrated · ±${a}°`, cpTrustRaw: 'not calibrated: calibrate on the Sun',
    cpTrustNote: 'A phone compass measures magnetic north; its difference from true north (magnetic declination) can be several degrees depending on the place. Nearby iron, vehicles, speakers and electrical devices disturb it. The most reliable way is to point at the Sun or the sunset point and use “Calibrate on the Sun” or “Calibrate on the sunset point”. Without a reliable compass the program shows the direction as a number (azimuth) and in the horizon drawing.',
    vfScope: 'Verification only shows that the record has not been changed afterwards (and, if signed, which device key sealed it); it does not verify that the crescent was seen or who the observer is.'
  });
  T.tr.prOpts = Object.assign({}, T.tr.prOpts, { map3: T.tr.prOptsMap3 });
  T.en.prOpts = Object.assign({}, T.en.prOpts, { map3: T.en.prOptsMap3 });
})(typeof globalThis !== 'undefined' ? globalThis : window);
