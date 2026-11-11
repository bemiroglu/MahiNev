/* arayüz metinleri: an çubuğu, hicrî tarih, çevrimiçi katman, gökyüzü haritası, baskı */
(function (G) {
  'use strict';
  Object.assign(G.HRI18N.T.tr, {
    modeLive: 'Şimdi', modePlan: 'Rü’yet planlaması', backNow: 'Şimdiye dön', printBtn: 'Yazdır / PDF',
    hjAfter: 'gurûbdan sonra: yeni kamerî gün', hjHesabi: 'hesâbî',
    hjNote: 'Kamerî gün şer’î gurûbda başlar (ezânî gün, s. 188). Ay adı ve hicrî yıl hesâbîdir; ay başı rü’yetle kesinleşir. Yeni hicrî yıl Muharrem hilâli görülünce başlar; o güne kadar iki ihtimal birlikte gösterilir.',
    hjOr: 'veya', hjEnd: 'ay sonu',
    upTitle: 'Yaklaşan rü’yet', upA: 'Rasad gecesi (ilk mümkün akşam)', upB: 'En elverişli akşam (≥ 18°)',
    upIn: n => n <= 0 ? 'bu akşam' : n === 1 ? 'yarın akşam' : `${n} gün sonra`, upPlan: 'Bu geceyi planla', upMonth: m => `${m} hilâli`, upWin: 'Arama', upToday: 'Bugün (kamerî, hesâbî)', upLoading: 'Hesaplanıyor…',
    planTag: 'Planlama', planFor: d => `${d} akşamı için rü’yet planı`, planMonth: m => `Aranacak hilâl: ${m}`,
    chipOffline: 'Çevrimdışı', chipSandbox: 'claude.ai görünümü', chipLocAuto: 'Konum: otomatik', chipLocMan: 'Konum: elle',
    fontSize: 'Yazı boyutu', fsOpts: ['Normal', 'Büyük', 'Çok büyük'], thSun: 'Güneş altı (yüksek kontrast)',
    hOnline: 'İnternet ve konum (isteğe bağlı)', optWx: 'Hava ve görüş tahmini (Open-Meteo)', optAutoLoc: 'Konumu otomatik al (izin verildiyse)',
    onlineNote: 'Hava tahmini açıkken yaklaşık konum (≈1 km) open-meteo.com’a gönderilir. İnternet ve konum olmadan da astronomik hesapların hepsi çalışır.',
    sandboxNote: 'Bu sayfa claude.ai içinde açık: burada internet, konum ve doğrudan yazdırma kapalıdır. Tam özellikler için “Dosya olarak kaydet” ile indirip tarayıcıda açın.',
    saveSelf: 'Dosya olarak kaydet',
    wxTitle: 'Hava ve görüş (tahmin)', wxOff: 'Hava tahmini kapalı (Gösterim tercihleri → İnternet ve konum).', wxSandbox: 'claude.ai görünümünde dış bağlantı kapalı; hava tahmini indirilen dosyada çalışır.',
    wxOffline: 'İnternet yok; hava tahmini alınamadı. Hesaplar etkilenmez.', wxLoading: 'Tahmin alınıyor…', wxErr: 'Tahmin alınamadı (bağlantı veya servis).',
    wxOutRange: (a, b) => `Tahmin ${a} – ${b} aralığını kapsıyor; seçili akşam bunun dışında.`,
    wxHead: ['Saat', 'Bulut: toplam / alçak', 'Görüş', 'Nem', 'Yağış'], wxHere: 'Bulunduğunuz yer', wxWest: az => `Batı ufku yönü (~25 km, semt ${az}°)`,
    wxLevel: { good: 'Gök uygun görünüyor', fair: 'Kısmen uygun; ufku kontrol edin', poor: 'Uygun görünmüyor' },
    wxReason: { rain: 'yağış ihtimali yüksek', low: 'alçak bulut', lowSome: 'biraz alçak bulut', cloud: 'kapalı gök', cloudSome: 'parçalı bulut', haze: 'görüş zayıf (pus/sis)', hazeSome: 'görüş orta', aod: 'yoğun aerosol/toz', aodSome: 'hafif pus/toz', humid: 'nem yüksek' },
    wxAod: 'Pus (aerosol optik derinliği)', wxFor: 'Seçili akşamın gurûb saati',
    wxFiqh: 'Tam İlmihâl’e göre bulutlu havada Ramazân hilâli bir âdil müslimânın “gördüm” demesiyle, açık havada ise birçok kimsenin şehâdetiyle sabit olur; bayram için iki âdil gerekir (s. 315). Tahmin hükme esas değildir; gerçek gök gözlenir.',
    wxSrc: 'Kaynak: Open-Meteo (açık veri). Değerler saatlik ve noktasaldır; batı ufku ayrıca gözlenmelidir.',
    openSM: 'Gökyüzü haritası', smTitle: 'Gökyüzü haritası', smFace: 'Alta gelen yön', faces: { 270: 'Batı', 180: 'Güney', 90: 'Doğu', 0: 'Kuzey' },
    smLines: 'Takımyıldız çizgileri', smNames: 'Yıldız adları', smCons: 'Takımyıldız adları', smEcl: 'Ekliptik',
    smNote: 'Haritayı başınızın üstünde, alt kenarı baktığınız yöne gelecek şekilde tutun. Kesikli daire: ufuktan 5° (Tam İlmihâl’in sınırı, s. 360). Noktalı çizgi: ekliptik; ay ve gezegenler bu hattın çevresindedir. Yıldız verisi: d3-celestial (Hipparcos, BSD lisansı).',
    guidesTitle: 'Yönelim için yardımcı cisimler', guidesNone: 'Yakında belirgin parlak cisim yok.',
    fSM: 'Gök haritası', fLoc: 'Konumum',
    printing: 'Baskı sayfası hazırlanıyor…', printSaved: 'Baskı sayfası kaydedildi; açıp tarayıcının “PDF olarak kaydet” seçeneğiyle yazdırabilirsiniz.', printNA: 'Bu görünümde yazdırma ve kaydetme kullanılamıyor.', printDeclined: 'Kaydetme iptal edildi.',
    printTitle: { plan: 'Rü’yet planı', sky: 'Gökyüzü haritası', map: 'Dünya rü’yet haritası', field: 'Saha özeti' },
    printFooter: 'Bu çıktı takvim değildir. Kamerî ay başı, hilâlin çıplak gözle görülmesiyle (rü’yet) kesinleşir; burada verilenler hesâbî imkândır (Se’âdet-i Ebediyye s. 315, 360).',
    printGen: 'Hazırlanma', locAutoDone: 'Konum otomatik alındı.', locSandbox: 'claude.ai içinde konum kapalı; dosyayı tarayıcıda açın.', myPlace: 'Konumum',
    footer: ''
  });
  Object.assign(G.HRI18N.T.en, {
    modeLive: 'Now', modePlan: 'Sighting plan', backNow: 'Back to now', printBtn: 'Print / PDF',
    hjAfter: 'after sunset: new lunar day', hjHesabi: 'computed',
    hjNote: 'The lunar day begins at the legal sunset (ezânî day, p. 188). Month name and Hijri year are computed; the month begins by sighting. The new Hijri year begins when the Muharram crescent is seen; until then both possibilities are shown.',
    hjOr: 'or', hjEnd: 'month’s end',
    upTitle: 'Upcoming sighting', upA: 'Observation night (first possible evening)', upB: 'Best evening (≥ 18°)',
    upIn: n => n <= 0 ? 'this evening' : n === 1 ? 'tomorrow evening' : `in ${n} days`, upPlan: 'Plan this night', upMonth: m => `${m} crescent`, upWin: 'Search', upToday: 'Today (lunar, computed)', upLoading: 'Calculating…',
    planTag: 'Planning', planFor: d => `Sighting plan for the evening of ${d}`, planMonth: m => `Crescent sought: ${m}`,
    chipOffline: 'Offline', chipSandbox: 'claude.ai view', chipLocAuto: 'Location: automatic', chipLocMan: 'Location: manual',
    fontSize: 'Text size', fsOpts: ['Normal', 'Large', 'Extra large'], thSun: 'Sunlight (high contrast)',
    hOnline: 'Internet and location (optional)', optWx: 'Weather and visibility forecast (Open-Meteo)', optAutoLoc: 'Take location automatically (if permitted)',
    onlineNote: 'With the forecast on, an approximate location (≈1 km) is sent to open-meteo.com. All astronomical calculations work without internet or location.',
    sandboxNote: 'This page is open inside claude.ai: internet, location and direct printing are off here. For the full features use “Save as file” and open it in a browser.',
    saveSelf: 'Save as file',
    wxTitle: 'Weather and visibility (forecast)', wxOff: 'Forecast is off (Display preferences → Internet and location).', wxSandbox: 'Outside connections are off in the claude.ai view; the forecast works in the downloaded file.',
    wxOffline: 'No internet; no forecast. Calculations are unaffected.', wxLoading: 'Fetching forecast…', wxErr: 'Forecast unavailable (connection or service).',
    wxOutRange: (a, b) => `The forecast covers ${a} – ${b}; the selected evening is outside it.`,
    wxHead: ['Time', 'Cloud: total / low', 'Visibility', 'Humidity', 'Precip.'], wxHere: 'Your location', wxWest: az => `Towards the western horizon (~25 km, azimuth ${az}°)`,
    wxLevel: { good: 'Sky looks favourable', fair: 'Partly favourable; check the horizon', poor: 'Not favourable' },
    wxReason: { rain: 'high chance of precipitation', low: 'low cloud', lowSome: 'some low cloud', cloud: 'overcast', cloudSome: 'partly cloudy', haze: 'poor visibility (haze/fog)', hazeSome: 'moderate visibility', aod: 'heavy aerosol/dust', aodSome: 'light haze/dust', humid: 'high humidity' },
    wxAod: 'Haze (aerosol optical depth)', wxFor: 'Sunset hour of the selected evening',
    wxFiqh: 'Per Tam İlmihâl, in cloudy weather the Ramadan crescent is established by one upright Muslim saying “I saw it”, in clear weather by the testimony of many; for the feast two upright witnesses are needed (p. 315). A forecast is no basis for a ruling; the real sky is observed.',
    wxSrc: 'Source: Open-Meteo (open data). Values are hourly and for a point; the western horizon must still be checked.',
    openSM: 'Sky chart', smTitle: 'Sky chart', smFace: 'Direction at bottom', faces: { 270: 'West', 180: 'South', 90: 'East', 0: 'North' },
    smLines: 'Constellation lines', smNames: 'Star names', smCons: 'Constellation names', smEcl: 'Ecliptic',
    smNote: 'Hold the chart overhead with its lower edge towards the direction you face. Dashed circle: 5° above the horizon (Tam İlmihâl’s limit, p. 360). Dotted line: the ecliptic; the Moon and planets lie near it. Star data: d3-celestial (Hipparcos, BSD licence).',
    guidesTitle: 'Bright objects to help orientation', guidesNone: 'No prominent bright object nearby.',
    fSM: 'Sky chart', fLoc: 'My location',
    printing: 'Preparing the print page…', printSaved: 'Print page saved; open it and use the browser’s “Save as PDF”.', printNA: 'Printing and saving are unavailable in this view.', printDeclined: 'Saving cancelled.',
    printTitle: { plan: 'Sighting plan', sky: 'Sky chart', map: 'World sighting map', field: 'Field summary' },
    printFooter: 'This printout is not a calendar. The lunar month begins when the crescent is seen with the naked eye (rü’yet); what is given here is computed possibility (Se’âdet-i Ebediyye pp. 315, 360).',
    printGen: 'Prepared', locAutoDone: 'Location taken automatically.', locSandbox: 'Location is off inside claude.ai; open the file in a browser.', myPlace: 'My location',
    footer: ''
  });
  const T = G.HRGuide && G.HRGuide.TOPICS;
  if (T) {
    T.tr.hicri = ['Kamerî gün, ay adı ve hicrî yıl',
      'Ezânî gün, güneşin üst kenarının şer’î ufuktan iki şer’î gurûbu arasındaki zamandır (s. 188); bu sebeple program kamerî günü şer’î gurûbda değiştirir. Ay başı rü’yetle olur; hesap ve takvimle başlanmaz (s. 315). Gündüz görülen hilâl gelecek gecenin hilâlidir (s. 315).',
      'Program her ay için hesâbî en erken günü bulur; o günden önce yeni ay başlayamaz. En erken gün ve ertesi gün için iki ihtimal (1 | 29/30) birlikte yazılır. Ay adı ve yıl, ictimâya göre aritmetik takvimden alınır; Muharrem’de yeni yıl ancak hilâl görülünce kesinleştiğinden, o güne kadar eski yıl ile yeni yıl yan yana gösterilir.'];
    T.en.hicri = ['Lunar day, month name and Hijri year',
      'The ezânî day is the time between two legal sunsets of the Sun’s upper limb over the legal horizon (p. 188); the programme therefore changes the lunar day at the legal sunset. The month begins by sighting, not by calculation or calendar (p. 315). A crescent seen by day belongs to the coming night (p. 315).',
      'For each month the programme finds the computed earliest day; the new month cannot begin before it. For the earliest day and the next, both possibilities (1 | 29/30) are written. Month name and year come from the arithmetic calendar for the conjunction; since the new year in Muharram is certain only once the crescent is seen, the old and new years are shown side by side until then.'];
    T.tr.hava = ['Hava, bulut ve görüş',
      'Bulutlu havada Ramazân hilâli bir âdil müslimânın “gördüm” demesiyle, açık havada birçok kimsenin şehâdetiyle sabit olur; bayram için iki âdil gerekir (s. 315). Hava tahmini yalnızca rasada hazırlık içindir; hüküm gerçek gözleme bağlıdır.',
      'İnce hilâl ufka yakın ve sönüktür: alçak bulut, pus ve toz en büyük engeldir. Program iki nokta için tahmin alır: bulunduğunuz yer ve hilâlin battığı yönde yaklaşık 25 km ötesi (5° yükseklikteki görüş hattı 2 km’deki bulut tabanını bu mesafede keser). Görüş mesafesi 20 km’nin, aerosol optik derinliği 0,2’nin altındaysa ufuk genellikle temizdir.'];
    T.en.hava = ['Weather, cloud and visibility',
      'In cloudy weather the Ramadan crescent is established by one upright Muslim saying “I saw it”, in clear weather by the testimony of many; for the feast two upright witnesses are needed (p. 315). The forecast is only for preparing the observation; the ruling depends on real observation.',
      'A thin crescent is low and faint: low cloud, haze and dust are the main obstacles. The programme fetches two points: your location and a point about 25 km away towards where the crescent sets (a line of sight 5° high meets a 2 km cloud base at that distance). With visibility above 20 km and aerosol optical depth below 0.2 the horizon is usually clean.'];
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
