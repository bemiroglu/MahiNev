/* Metinler: 0.12 (iki gece esası, hicrî günün gerekçesi, gök cisimleri aracı) */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.12.0';
  const T = G.HRI18N.T;
  Object.assign(T.tr, {
    // Hicrî günün iki sayısı: ayın 1. günü hesapla bulunan gün veya bir gün sonrasıdır (s. 315, 326, 360)
    hjWhyN: (m, d1, d2, n) => `1 ${m} ${d1} ise ${n}, ${d2} ise ${n - 1}`,
    hjWhy1: (m, d1, d2, pm) => `1 ${m} ${d1} ise bugün 1 ${m}; ${d2} ise ${pm} ayının son günü`,
    hjWhyLead: 'Neden iki sayı:',
    hjBook: 'Hesâbî tarihtir. Ayın 1. günü, hesapla bulunan gün veya bir gün sonrasıdır; bir gün önce olamaz (s. 315). Hangisi olduğu rü’yetle kesinleşir.',
    rnIntro: 'Her satır bir kamerî ayın başıdır. Rasad gecesi ve en elverişli akşam bu yer için hesâbîdir. Ayın 1. günü, Tam İlmihâl’e göre hesapla bulunan gün veya bir gün sonrasıdır; önce olamaz (s. 315, 326, 360). Hangisi olduğu rü’yetle kesinleşir. Bir satırdaki tarihe dokununca o akşam planlanır.',
    // Gezinme
    todayEve: 'Bugünün akşamı', navBack: 'Geri: önceki seçime dön', navFwd: 'İleri', navToNow: 'Şimdiye dön',
    navNowToast: 'Şimdiki ana geçildi. Önceki seçime dönmek için üst banttaki ↶ düğmesine dokunun.',
    dateNoteNext: (a, b) => `Seçili an ${b} sabahıdır; gece, ${a} akşamının gecesi olarak gösterilir.`,
    fPreview: (d, h) => `Önizleme (planlama): ${d}, ${h}. Saha, planlama kipinde seçili anı gösterir; kayıt formu gerçek saati kullanır.`,
    // Gök cisimleri aracı (seçili an)
    tbTitleSky: 'Seçili an: gökyüzü ve gök cisimleri',
    gokTitle: 'Gök cisimleri (seçili an)', gokTitleR: 'Gök cisimleri (seçili an · ek bilgi)',
    gokF: 'Göster', gokFOpts: { vis: 'Şu an görülebilenler', sol: 'Güneş, Ay ve gezegenler', all: 'Hepsi' },
    gokCols: ['Cisim', 'Yön · yükseklik', 'Durum', 'Doğuş · tepe · batış', 'Kadir', 'Takımyıldız', 'Sağ açıklık · dik açıklık', 'Güneş’e açı', 'Uzaklık'],
    gokSt: { vis: 'Görülebilir', bright: 'Gökyüzü aydınlık', low: 'Ufka çok yakın', down: 'Ufkun altında', near: 'Güneş’e çok yakın', sun: 'Ufkun üstünde · bakmayın' },
    gokAlways: 'batmaz', gokNever: 'bu yerden görünmez',
    gokNight: (a, b) => `Bu gece çıplak gözle (gurûb ${a} – güneş doğuşu ${b}):`,
    gokBest: (f, to, b, dir, alt) => `${f}–${to}, en yüksek ${b} (${dir}, ${alt}°)`,
    gokStars: n => `ayrıca ${n} parlak yıldız`, gokNone: 'gezegen yok', gokCalc: 'Gece taraması yapılıyor…',
    gokTw: (r, s, c, n, a, a2, n2, c2) => `Güneş doğuşu ${r} · batışı ${s} · sivil alacakaranlık sonu ${c} · denizci ${n} · astronomik gece ${a}–${a2} · sabah denizci ${n2} · sivil ${c2}`,
    gokGo: 'Seçili anı buraya getir',
    gokCap: 'Ek bilgi (Astronomy Engine). Durum sütunu; güneşin yüksekliğine, cismin parlaklığına ve ufka yakınlığına göre kaba bir çıplak göz tahminidir; hava, ışık kirliliği ve göz alışkanlığı hesaba katılmaz. Hilâlin rü’yeti için yukarıdaki değerlendirme (Tam İlmihâl s. 360) esastır. Güneş’e asla doğrudan veya dürbünle bakmayın.',
    miniGlobal: 'Ayın 1. günü (iki ihtimal)', miniLocal: 'Burada ilk mümkün akşam',
    miniFirstEve: (e, w) => `Dünyada ilk mümkün akşam: ${e} (${w})`, miniIsik: 'Işık usulü (s. 326)',
    miniLocalSub: 'Bu yerin ilk rasad akşamı; ay başını tek başına belirlemez (s. 315).',
    stStart: 'Ay başı', stStartVal: (m, a, b) => `1 ${m}: ${a} veya ${b}`,
    stStartSub: (e1, e2) => `Birinci gece: ${e1} akşamı · ikinci gece: ${e2} akşamı. Hangisi olduğu rü’yetle kesinleşir; önce olamaz (s. 315, 360).`,
    stStartSubZh: 'Işık usulüyle bulunan gün yâhud bir gün sonrası; önce olamaz (s. 326).',
    qaStart: (m, a, b) => `Ay başı: 1 ${m}, ${a} veya ${b} olur; hangisi olduğu rü’yetle kesinleşir.`,
    rnCols: ['Kamerî ay (hesâbî)', 'İctimâ', 'Rasad gecesi (bu yer)', 'En elverişli akşam (bu yer)', '1. gün (iki ihtimal)', '']
  });
  Object.assign(T.en, {
    hjWhyN: (m, d1, d2, n) => `${n} if 1 ${m} is ${d1}, ${n - 1} if it is ${d2}`,
    hjWhy1: (m, d1, d2, pm) => `if 1 ${m} is ${d1}, today is 1 ${m}; if it is ${d2}, today is the last day of ${pm}`,
    hjWhyLead: 'Why two numbers:',
    hjBook: 'A computed date. Day 1 of the month is the calculated day or one day later; never a day earlier (p. 315). Which one is established by sighting.',
    rnIntro: 'Each row is the start of a lunar month. The observation night and the best evening are calculated for this location. According to Tam İlmihâl, day 1 of the month is the calculated day or one day later, never earlier (pp. 315, 326, 360). Which one is established by sighting. Tap a date to plan that evening.',
    todayEve: 'This evening', navBack: 'Back: return to the previous selection', navFwd: 'Forward', navToNow: 'Back to now',
    navNowToast: 'Switched to the present moment. Tap ↶ in the top bar to return to the previous selection.',
    dateNoteNext: (a, b) => `The selected moment is the morning of ${b}; the night is shown as the night of the evening of ${a}.`,
    fPreview: (d, h) => `Preview (planning): ${d}, ${h}. In planning mode the Field tab shows the selected moment; the record form uses the real time.`,
    tbTitleSky: 'Selected moment: sky and celestial objects',
    gokTitle: 'Celestial objects (selected moment)', gokTitleR: 'Celestial objects (selected moment · additional)',
    gokF: 'Show', gokFOpts: { vis: 'Visible now', sol: 'Sun, Moon and planets', all: 'All' },
    gokCols: ['Object', 'Direction · altitude', 'State', 'Rise · transit · set', 'Mag.', 'Constellation', 'Right ascension · declination', 'Angle from Sun', 'Distance'],
    gokSt: { vis: 'Visible', bright: 'Sky too bright', low: 'Too close to horizon', down: 'Below horizon', near: 'Too close to the Sun', sun: 'Above horizon · do not look' },
    gokAlways: 'never sets', gokNever: 'never rises here',
    gokNight: (a, b) => `Tonight with the naked eye (sunset ${a} – sunrise ${b}):`,
    gokBest: (f, to, b, dir, alt) => `${f}–${to}, highest ${b} (${dir}, ${alt}°)`,
    gokStars: n => `also ${n} bright stars`, gokNone: 'no planets', gokCalc: 'Scanning the night…',
    gokTw: (r, s, c, n, a, a2, n2, c2) => `Sunrise ${r} · sunset ${s} · end of civil twilight ${c} · nautical ${n} · astronomical night ${a}–${a2} · morning nautical ${n2} · civil ${c2}`,
    gokGo: 'Move the selected moment here',
    gokCap: 'Additional information (Astronomy Engine). The State column is a rough naked-eye estimate from the Sun’s altitude, the object’s brightness and its height above the horizon; weather, light pollution and dark adaptation are not included. For the crescent, the evaluation above (Tam İlmihâl p. 360) prevails. Never look at the Sun directly or through binoculars.',
    miniGlobal: 'Day 1 of the month (two possibilities)', miniLocal: 'First possible evening here',
    miniFirstEve: (e, w) => `First possible evening worldwide: ${e} (${w})`, miniIsik: 'Işık method (p. 326)',
    miniLocalSub: 'The first watch evening at this location; it does not by itself fix the start of the month (p. 315).',
    stStart: 'Month start', stStartVal: (m, a, b) => `1 ${m}: ${a} or ${b}`,
    stStartSub: (e1, e2) => `First night: evening of ${e1} · second night: evening of ${e2}. Which one is established by sighting; never earlier (pp. 315, 360).`,
    stStartSubZh: 'The day found by the Işık method or one day later; never earlier (p. 326).',
    qaStart: (m, a, b) => `Month start: 1 ${m} is ${a} or ${b}; which one is established by sighting.`,
    rnCols: ['Lunar month (calculated)', 'Conjunction', 'Observation night (here)', 'Best evening (here)', 'Day 1 (two possibilities)', '']
  });
  Object.assign(T.tr, { fPvOk: 'Seçili anda hilâl aranabilir', fPvTag: 'önizleme' }); Object.assign(T.en, { fPvOk: 'The crescent can be searched for at the selected moment', fPvTag: 'preview' });
  T.tr.hints = Object.assign({}, T.tr.hints, { fieldTop: 'Sahada ne yapmalı: geri sayım, Tam İlmihâl penceresi ve bakılacak yer. Canlı kipte şimdiki an, planlama kipinde seçili an gösterilir.', date: 'Planladığınız akşam. Gün okları (◀ ▶) üst bantta da vardır; ↶ düğmesi önceki seçime, ↷ sonrakine döner. Ay başı rasad gecelerine “◀ Önceki ay başı / Sonraki ay başı ▶” düğmeleriyle gidilir: hilâl ayın 29. günü gurûb vakti aranır (s. 315).' });
  T.en.hints = Object.assign({}, T.en.hints, { fieldTop: 'What to do in the field: countdowns, Tam İlmihâl’s window and where to look. Live mode shows the current moment; planning mode shows the selected moment.', date: 'The evening you are planning. The day arrows (◀ ▶) are also in the top bar; ↶ returns to the previous selection and ↷ to the next. “◀ Previous month start / Next month start ▶” go to month-start observation nights: the crescent is sought at sunset on the 29th (p. 315).' });
})(typeof globalThis !== 'undefined' ? globalThis : window);
