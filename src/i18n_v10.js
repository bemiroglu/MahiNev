/* Metinler: 0.10 (açıklama penceresi, ekran tavsiyesi, akşam gökyüzü haritası, pusula, bildirim ekleri) */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.11.0';
  const T = G.HRI18N.T;
  Object.assign(T.tr, {
    // ay başı gezintisi ve rasad geceleri listesi
    mPrev: '◀ Önceki ay başı', mNext: 'Sonraki ay başı ▶', mList: '☰ Rasad geceleri',
    mSelA: m => `Seçili akşam: ${m} için rasad gecesi (ilk mümkün akşam, bu yer)`, mSelB: m => `Seçili akşam: ${m} için en elverişli akşam (bu yer)`,
    rnTitle: 'Kamerî ay başı rasad geceleri', rnIntro: 'Her satır bir kamerî ayın başıdır. Tarihler bu yer için hesâbîdir: hilâlin hesâben ilk görülebileceği akşam ve en elverişli akşam. Ay başı rü’yetle kesinleşir; “dünyada en erken 1. gün”den önce olamaz (s. 360). Bir satırdaki tarihe dokununca o akşam planlanır.',
    rnPrev: '◀ Önceki 12 ay', rnNext: 'Sonraki 12 ay ▶', rnNow: 'Bugüne dön', rnCalc: 'Hesaplanıyor…',
    rnCols: ['Kamerî ay (hesâbî)', 'İctimâ', 'Rasad gecesi (bu yer)', 'En elverişli akşam (bu yer)', 'Dünyada en erken 1. gün', ''],
    rnNone: 'bu yerde uygun akşam yok', rnSel: 'seçili',
    // Ekran ve PDF tavsiyesi
    introTip: 'Hazırlık için büyük bir ekran (bilgisayar veya tablet) kullanmanızı tavsiye ederiz. Telefon ekranı sahada küçük kalır: rasad planını ve gökyüzü haritalarını önceden <b>Yazdır → PDF</b> ile kaydedip yanınıza alın; internetsiz ve tek bakışta okunur.',
    fieldTip: 'Sahada telefon ekranı küçük kalabilir. Rasad planını ve akşamın gökyüzü haritasını önceden PDF olarak kaydedip yanınıza almanız işinizi kolaylaştırır (⎙ Yazdır).',
    fieldTipClose: 'Gizle',
    // Akşam gökyüzü haritası
    smEveTitle: 'Gökyüzü haritası (seçili akşam)',
    smEveAt: (h, why) => `Harita anı: ${h} (${why})`,
    smEveWhyWin: 'Tam İlmihâl penceresinin ortası', smEveWhyLag: 'gurûb ile ay batımı arası', smEveWhyNone: 'gurûbdan 30 dakika sonra',
    smEveNote: 'Batı göğü, gurûb noktasına dönük bakan kişinin gördüğü gibidir: solda güney, sağda kuzey. Yıldız ve gezegenler harita anındadır. Noktalar hilâlin akşam boyunca yeridir; turuncu noktalar gurûb, ufuktan 5° ve ay batımı anlarıdır. Kesikli daire Güneş’in o andaki yeridir.',
    smEveCols: ['Saat', 'Güneş', 'Hilâl irtifâı', 'Hilâl semti', 'Gurûb noktasına göre', 'Not'],
    smEveLeft: d => `${d}° sol`, smEveRight: d => `${d}° sağ`, smEveFist: f => `≈ ${f} yumruk`,
    smEveGurub: 'gurûb', smEve5: 'ufuktan 5° (pencere sonu)', smEveSet: 'ay batımı', smEveDown: 'hilâl ufkun altında',
    smEveNoMoon: 'Bu akşam hilâl gurûbda ufkun altındadır; çizelge gurûbdan sonraki gökyüzünü gösterir.',
    smEveBtn: 'Akşam haritası',
    // Pusula
    cpTitle: 'Pusula',
    cpWait: 'Pusula algılayıcısı bekleniyor… Telefonu elinizde tutup biraz hareket ettirin.',
    cpNone: 'Bu cihazda veya tarayıcıda pusula algılayıcısı çalışmıyor. Kadran kuzeyi yukarıda gösterir; yönü gurûb noktasından ve yardımcı yıldızlardan bulun.',
    cpNoneFile: 'Dosyadan açılan sayfalarda bazı tarayıcılar algılayıcıya izin vermez; programı çevrimiçi adresinden (https) açmayı deneyin.',
    cpDenied: 'Hareket ve yön algılayıcısına izin verilmedi. İzin için Pusula düğmesine yeniden dokunun ya da tarayıcı ayarlarına bakın.',
    cpFlat: 'Telefonu yere paralel tutun; telefonun üst kenarı baktığınız yönü gösterir.',
    cpUp: 'Telefonu dik tutun; arka kamera baktığınız yönü gösterir.',
    cpHead: (h, c) => `Yönünüz: ${h}° (${c})`,
    cpTarget: { moon: 'Hilâl', gurub: 'Gurûb noktası', sun: 'Güneş' },
    cpTurn: (n, d) => `${n} için ${Math.abs(d)}° ${d < 0 ? 'sola' : 'sağa'} dönün`,
    cpAhead: n => `${n} tam karşınızda`,
    cpUpAlt: (a, f) => `ufuktan ${a}° yukarı (${f})`,
    cpBelow: 'Hilâl ufkun altında; gurûb noktasını gösteriyorum.',
    cpCal: 'Güneşle ayarla', cpCalGurub: 'Gurûb noktasıyla ayarla', cpCalReset: 'Ayarı kaldır',
    cpCalHelp: 'Manyetik pusula gerçek kuzeyden birkaç derece sapar; araç ve demir yakınında daha da şaşar. Güneş batarken telefonu güneşe (veya gurûb noktasına) çevirip “ayarla”ya dokunun: program farkı hesaplayıp düzeltir. Güneşe dürbün veya kamerayla bakmayın.',
    cpCalDone: d => `Ayarlandı: düzeltme ${d > 0 ? '+' : ''}${d}°`,
    cpRaw: 'Ayarsız (manyetik yön; sapma düzeltilmedi)',
    cpAcc: a => `Algılayıcı doğruluğu ±${a}°: telefonu havada “8” çizerek çevirin.`,
    // Bildirim ekleri
    ntBtn: 'Bildirim ekle', ntTitle: 'Bildirim: kime, ne zaman',
    ntIntro: 'Gören kimsenin, gördüğünü yetkili makama bildirmesi vâcibdir (Redd-ül-muhtâr; Kongre tebliği, s. 7). Bildirdiğiniz kişiyi veya makamı burada kaydedin. Kayıt mühürlü kalır; bildirim, kayda bağlı ve ayrıca imzalı bir ek olarak saklanır.',
    ntTo: 'Kime', ntToKind: 'Bildirilen', ntToKinds: { authority: 'Yetkili makam (müftülük vb.)', committee: 'Rasad / takvim heyeti', person: 'Kişi (âlim, hoca vb.)', network: 'Hilâl gözlem bildirim ağı', other: 'Diğer' },
    ntToName: 'Ad / makam', ntAt: 'Ne zaman', ntChannel: 'Nasıl', ntChannels: { inPerson: 'Yüz yüze', phone: 'Telefon', message: 'Mesaj / e-posta', paper: 'Basılı tutanak', network: 'Bildirim ağı', other: 'Diğer' },
    ntRef: 'Referans / evrak no (isteğe bağlı)', ntNote: 'Not (isteğe bağlı)', ntSave: 'Bildirimi kaydet', ntCancel: 'Vazgeç',
    ntNeed: 'Kime bildirildiğini yazın.', ntSaved: 'Bildirim kayda eklendi.',
    ntLine: (to, at, ch) => `Bildirildi: ${to} · ${at} · ${ch}`,
    ntNone: 'Henüz bildirim kaydı yok.', ntOk: 'bildirim doğrulandı', ntBad: 'bildirim bozuk',
    ntRow: 'Bildirildi (kime / ne zaman / nasıl)',
    ntNetNote: 'İleride bir hilâl gözlem bildirim ağı kurulduğunda, bildirimler bu biçimde (kayıt + imzalı bildirim eki) oraya gönderilebilecek.'
  });
  Object.assign(T.en, {
    mPrev: '◀ Previous month start', mNext: 'Next month start ▶', mList: '☰ Observation nights',
    mSelA: m => `Selected evening: observation night for ${m} (first possible evening, this location)`, mSelB: m => `Selected evening: best evening for ${m} (this location)`,
    rnTitle: 'Month-start observation nights', rnIntro: 'Each row is the start of a lunar month. Dates are calculated for this location: the first evening on which the crescent can be seen by calculation, and the best evening. The month is established by sighting and cannot begin before the “earliest day 1 worldwide” (p. 360). Tap a date to plan that evening.',
    rnPrev: '◀ Previous 12 months', rnNext: 'Next 12 months ▶', rnNow: 'Back to today', rnCalc: 'Calculating…',
    rnCols: ['Lunar month (calculated)', 'Conjunction', 'Observation night (here)', 'Best evening (here)', 'Earliest day 1 worldwide', ''],
    rnNone: 'no suitable evening here', rnSel: 'selected',
    introTip: 'For preparation we recommend a large screen (computer or tablet). A phone screen is small in the field: save the observation plan and sky charts beforehand with <b>Print → PDF</b> and take them with you; they work offline and read at a glance.',
    fieldTip: 'A phone screen can be small in the field. Saving the observation plan and the evening sky chart as PDF beforehand makes the work easier (⎙ Print).',
    fieldTipClose: 'Hide',
    smEveTitle: 'Sky chart (selected evening)',
    smEveAt: (h, why) => `Chart time: ${h} (${why})`,
    smEveWhyWin: 'middle of the Tam İlmihâl window', smEveWhyLag: 'between sunset and moonset', smEveWhyNone: '30 minutes after sunset',
    smEveNote: 'The western sky as seen facing the sunset point: south on the left, north on the right. Stars and planets are shown at the chart time. The dots are the crescent’s positions through the evening; orange dots mark sunset, 5° above the horizon and moonset. The dashed circle is the Sun at that moment.',
    smEveCols: ['Time', 'Sun', 'Crescent altitude', 'Crescent azimuth', 'From the sunset point', 'Note'],
    smEveLeft: d => `${d}° left`, smEveRight: d => `${d}° right`, smEveFist: f => `≈ ${f} fist`,
    smEveGurub: 'sunset', smEve5: '5° above the horizon (end of window)', smEveSet: 'moonset', smEveDown: 'crescent below the horizon',
    smEveNoMoon: 'This evening the crescent is below the horizon at sunset; the table shows the sky after sunset.',
    smEveBtn: 'Evening chart',
    cpTitle: 'Compass',
    cpWait: 'Waiting for the compass sensor… Hold the phone and move it a little.',
    cpNone: 'The compass sensor does not work on this device or browser. The dial shows north at the top; find the direction from the sunset point and the guide stars.',
    cpNoneFile: 'Some browsers block the sensor on pages opened from a file; try opening the program from its online (https) address.',
    cpDenied: 'Permission for the motion and orientation sensor was not given. Tap Compass again to allow it, or check the browser settings.',
    cpFlat: 'Hold the phone flat; its top edge shows the direction you face.',
    cpUp: 'Hold the phone upright; the back camera shows the direction you face.',
    cpHead: (h, c) => `Your heading: ${h}° (${c})`,
    cpTarget: { moon: 'Crescent', gurub: 'Sunset point', sun: 'Sun' },
    cpTurn: (n, d) => `Turn ${Math.abs(d)}° ${d < 0 ? 'left' : 'right'} to face the ${n.toLowerCase()}`,
    cpAhead: n => `${n} straight ahead`,
    cpUpAlt: (a, f) => `${a}° above the horizon (${f})`,
    cpBelow: 'The crescent is below the horizon; showing the sunset point.',
    cpCal: 'Calibrate on the Sun', cpCalGurub: 'Calibrate on the sunset point', cpCalReset: 'Remove calibration',
    cpCalHelp: 'A magnetic compass is off true north by a few degrees, more near vehicles and iron. As the Sun sets, point the phone at the Sun (or the sunset point) and tap “calibrate”: the program computes and corrects the difference. Never look at the Sun through binoculars or a camera.',
    cpCalDone: d => `Calibrated: correction ${d > 0 ? '+' : ''}${d}°`,
    cpRaw: 'Uncalibrated (magnetic heading; variation not corrected)',
    cpAcc: a => `Sensor accuracy ±${a}°: move the phone in a figure 8.`,
    ntBtn: 'Add notification', ntTitle: 'Notification: to whom, when',
    ntIntro: 'Whoever sees the crescent must report it to the competent authority (Radd al-Muhtar; congress paper, p. 7). Record here the person or office you reported to. The record stays sealed; the notification is stored as a separately signed annex linked to it.',
    ntTo: 'To whom', ntToKind: 'Reported to', ntToKinds: { authority: 'Competent authority (mufti’s office etc.)', committee: 'Observation / calendar committee', person: 'Person (scholar, teacher etc.)', network: 'Crescent sighting notification network', other: 'Other' },
    ntToName: 'Name / office', ntAt: 'When', ntChannel: 'How', ntChannels: { inPerson: 'In person', phone: 'Phone', message: 'Message / e-mail', paper: 'Printed report', network: 'Notification network', other: 'Other' },
    ntRef: 'Reference / document no. (optional)', ntNote: 'Note (optional)', ntSave: 'Save notification', ntCancel: 'Cancel',
    ntNeed: 'Write whom you reported to.', ntSaved: 'Notification added to the record.',
    ntLine: (to, at, ch) => `Reported: ${to} · ${at} · ${ch}`,
    ntNone: 'No notification recorded yet.', ntOk: 'notification verified', ntBad: 'notification broken',
    ntRow: 'Reported (to whom / when / how)',
    ntNetNote: 'When a crescent sighting notification network is set up, notifications can be sent there in this form (record + signed notification annex).'
  });
  T.tr.prOpts = Object.assign({}, T.tr.prOpts, { skyEve: 'Gökyüzü haritası (seçili akşam)', month: 'Aylık rü’yet imkânı çizelgesi', map: 'Dünya rü’yet imkânı haritası (yatay)' });
  T.en.prOpts = Object.assign({}, T.en.prOpts, { skyEve: 'Sky chart (selected evening)', month: 'Monthly sighting-possibility table', map: 'World sighting-possibility map (landscape)' });
  T.tr.printTitle = Object.assign({}, T.tr.printTitle, { map: 'Dünya rü’yet imkânı haritası' }); T.en.printTitle = Object.assign({}, T.en.printTitle, { map: 'World sighting-possibility map' });
  // Aylık çizelge: hesâbî imkândır, gözlem sonucu değildir
  Object.assign(T.tr, { pgMonthTitle: 'Aylık rü’yet imkânı çizelgesi', pgMonthNote: 'Her satır bir akşamdır. Sınıf, o akşam gurûb anındaki hesâbî rü’yet imkânıdır (s. 360); hilâlin görülüp görülmediği rasadla anlaşılır. A rasad gecesi, B en elverişli akşamdır; “s” sabah hilâlinin görülebileceği günlerdir.' });
  Object.assign(T.en, { pgMonthTitle: 'Monthly sighting-possibility table', pgMonthNote: 'Each row is one evening. The class is the calculated possibility of sighting at sunset that evening (p. 360); whether the crescent is actually seen is known only by observation. A: observation night, B: best evening; “m”: a morning crescent can be seen.' });
})(typeof globalThis !== 'undefined' ? globalThis : window);
