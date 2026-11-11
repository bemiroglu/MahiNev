/* metinleri: Tam İlmihâl adlandırması, şafak iki kavli, rehberlik ipuçları, konum girişi, saha şeridi */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.6.0';
  Object.assign(G.HRI18N.T.tr, {
    // Şafak ve Kâdîhân (s. 178, 194, 197, 316)
    kdTitle: 'Kâdîhân kontrolü (s. 316)', kdA: 'İmâm-ı a’zam: beyâzlık, −19° (esas)', kdB: 'İmâmeyn: kırmızılık, −17° (alternatif)',
    kdFirst: 'birinci gecenin hilâli', kdSecond: 'ikinci gecenin hilâli', kdSafak: 'şafak',
    kdDiffer: 'İki kavil farklı sonuç veriyor. Esas alınan, Tam İlmihâl’in ihtiyâtlı saydığı İmâm-ı a’zam kavlidir (s. 194); İmâmeyn kavli bilgi olarak gösterilir.',
    kdSame: 'İki kavil aynı sonucu veriyor.', kdNone: 'Hilâl gurûbda ufkun altında; Kâdîhân kontrolü uygulanmaz.',
    safakA: 'Şafak · İmâm-ı a’zam (−19°, şer’î)', safakB: 'Şafak · İmâmeyn (−17°, şer’î)', safakNote: t => `hakîkî vakit + ${t} dk temkin (s. 197)`,
    // Rehberlik
    explain: 'Yeni kullanıcı için açıklamaları göster', explainNote: 'Açıkken her kartın başında bu kartın ne olduğu, neden önemli olduğu ve fıkhî dayanağı kısaca yazılır. Tecrübeli kullanıcı kapatabilir.',
    introTitle: 'Nasıl kullanılır?', introClose: 'Anladım, gizle',
    introSteps: [
      '<b>Konumunuzu</b> girin veya “Konumumu kullan”a dokunun. Arz ve tûlü dilediğiniz biçimde yazabilirsiniz (41,0082 · 41.0082 K · 41°00′29″N).',
      '<b>Yaklaşan ay başı rasadı</b> kartından rasad gecesini seçip planlayın. Program her akşam için hilâlin Tam İlmihâl’e göre görülüp görülemeyeceğini söyler (s. 360).',
      'Rasad akşamı <b>Saha</b> sekmesini açın: saat, geri sayım, bakılacak yer ve gök çizimi orada. Gördüğünüzde de görmediğinizde de <b>Rü’yet kaydı</b> oluşturun.',
      'Unutmayın: program <b>takvim değildir</b>. Ay başı, hilâlin çıplak gözle görülmesi ve şahitlikle sabit olur; hesapla başlanmaz (Tam İlmihâl s. 315).'
    ],
    hints: {
      loc: 'Gözlem yeriniz. Hilâlin görülmesi yere bağlıdır; yükseklik ufku alçaltır (s. 185). Şehrin en yüksek noktası şer’î gurûb ve temkin için gerekir (s. 175–176).',
      date: 'Planladığınız akşam. “Önceki/Sonraki ay” düğmeleri ay başı rasad gecelerine gider: hilâl Şa’bân’ın 29’unda gurûb vakti aranır (s. 315).',
      up: 'Bugünün hesâbî hicrî tarihi ve sıradaki rasad gecesi. Hicrî gün şer’î gurûbda başlar (s. 188); ay başı rü’yetle kesinleşir.',
      status: 'Seçili akşamın Tam İlmihâl’e göre değerlendirmesi: ictimâ, beynûnet 8° ve 18°, ufuktan 5° (s. 360). “Kesin red” hesapla hilâlin görülemeyeceği hâldir; diğer sonuçlarda hüküm şahitliğe bağlıdır.',
      tb: 'Günün her saati için: hilâl o anda aranabilir mi, neden? Sarı bant Tam İlmihâl’in penceresidir (gurûbdan hilâl 5°’ye inene kadar).',
      wx: 'İsteğe bağlı hava tahmini. Bulutlu ve açık havada şahitlik şartları farklıdır (s. 315); tahmin hükme esas olmaz.',
      sky: 'Hilâli nerede arayacağınız: gurûb noktasına göre sağ-sol ve yükseklik, yumruk ölçeğiyle. Yönelim için parlak yıldız ve gezegenler de verilir.',
      strip: 'Ayın bütün akşamları tek bakışta: renk o akşamın sınıfıdır. Bir kutuya dokununca o akşam planlanır.',
      detail: 'Gurûb, şer’î gurûb (temkinli), ayın batışı ve hilâlin ölçüleri. Kâdîhân kontrolü ayın şafaktan önce mi sonra mı battığını gösterir (s. 316).',
      month: 'Bu ictimâ ile başlayacak ay ve hesâbî en erken gün: ay başı bu günden önce olamaz (s. 315). Aritmetik takvim usulleri yalnız takvim bilgisidir.',
      map: 'Dünyada her yerin kendi gurûbunda hilâlin durumu. Ramazân hilâli bir yerde görülünce her yerde lâzım olur (s. 315); kurban için yerel kapsam esastır.',
      fieldTop: 'Sahada şimdi ne yapmalı: geri sayım, Tam İlmihâl penceresi ve bakılacak yer. Gök çizimi her zaman şimdiki an içindir.',
      fieldRec: 'Gözleminizi kaydedin. Kayıt ve basılı tutanak, beyanınızı belgeler; hüküm yetkili makamındır. Bulutlu/açık hava ve gözlem yeri fıkhen önemlidir (s. 315–316).'
    },
    // Konum girişi
    coordOk: (d, dms) => `Anlaşılan: ${d} (${dms})`, coordPair: 'Arz ve tûl birlikte girildi; ikisi de dolduruldu.', coordSwap: 'Bu değer tûl (boylam) olarak anlaşıldı ve tûl alanına yazıldı.',
    coordErr: { empty: 'Değer boş.', letter: b => `“${b}” harfi anlaşılamadı. Yarım küre için K/G/D/B veya N/S/E/W kullanılabilir.`, mixed: 'Aynı değerde hem arz hem tûl harfi var.', format: 'Biçim anlaşılamadı. Örnek: 41,0082 · 41.0082 K · 41°00′29″N', minsec: 'Dakika ve saniye 60’tan küçük olmalı.', range: 'Değer sınır dışında: arz ±90°, tûl ±180°.' },
    numErr: 'Sayı anlaşılamadı (örnek: 40 · 40,5 · 40 m).',
    // Saha şeridi
    fsNext: { gurub: 'gurûba', win: 'aramaya', end: 'pencerenin sonuna', set: 'ay batışına' }, fsNone: 'Bu akşam rasad yok',
    footer: 'Astronomy Engine 2.1.19 (MIT) · Natural Earth · d3-celestial (BSD) · qrcode-generator (MIT) · Open-Meteo'
  });
  Object.assign(G.HRI18N.T.en, {
    kdTitle: 'Kâdîhân check (p. 316)', kdA: 'Imâm-ı A‘zam: white glow, −19° (primary)', kdB: 'Imâmayn: red glow, −17° (alternative)',
    kdFirst: 'first-night crescent', kdSecond: 'second-night crescent', kdSafak: 'twilight end',
    kdDiffer: 'The two views give different results. The primary one is Imâm-ı A‘zam’s view, which Tam İlmihâl calls the precautionary course (p. 194); the Imâmayn view is shown for information.',
    kdSame: 'Both views give the same result.', kdNone: 'The crescent is below the horizon at sunset; the Kâdîhân check does not apply.',
    safakA: 'Twilight end · Imâm-ı A‘zam (−19°, legal)', safakB: 'Twilight end · Imâmayn (−17°, legal)', safakNote: t => `true time + ${t} min temkin (p. 197)`,
    explain: 'Show explanations for new users', explainNote: 'When on, each card starts with a short note on what it is, why it matters and its legal basis. Experienced users can turn it off.',
    introTitle: 'How to use', introClose: 'Got it, hide',
    introSteps: [
      'Enter your <b>location</b> or tap “Use my location”. Latitude and longitude can be typed in any common form (41,0082 · 41.0082 N · 41°00′29″N).',
      'Pick the observation night from the <b>Upcoming month-start observation</b> card. For each evening the programme says whether the crescent can be seen per Tam İlmihâl (p. 360).',
      'On the evening, open the <b>Field</b> tab: time, countdowns, where to look and the sky view are there. Create a <b>sighting record</b> whether you saw it or not.',
      'Remember: the programme is <b>not a calendar</b>. The month begins by naked-eye sighting and testimony, not by calculation (Tam İlmihâl p. 315).'
    ],
    hints: {
      loc: 'Your observing site. Visibility depends on the place; height lowers the horizon (p. 185). The city’s highest point is needed for the legal sunset and temkin (pp. 175–176).',
      date: 'The evening you are planning. “Previous/Next month” go to month-start observation nights: the crescent is sought at sunset on the 29th (p. 315).',
      up: 'Today’s computed Hijri date and the next observation night. The lunar day begins at the legal sunset (p. 188); the month begins by sighting.',
      status: 'The selected evening per Tam İlmihâl: conjunction, elongation 8° and 18°, 5° above the horizon (p. 360). “Rejected” means calculation shows it cannot be seen; otherwise the ruling rests on testimony.',
      tb: 'For any hour: can the crescent be sought now, and why not? The yellow band is Tam İlmihâl’s window (sunset until the crescent sinks to 5°).',
      wx: 'Optional weather forecast. Testimony requirements differ in cloudy and clear weather (p. 315); a forecast is no basis for a ruling.',
      sky: 'Where to look: left/right of the sunset point and height, in fists. Bright stars and planets are given for orientation.',
      strip: 'All evenings of the month at a glance: the colour is that evening’s class. Tap a box to plan that evening.',
      detail: 'Sunset, legal sunset (with temkin), moonset and the crescent’s measures. The Kâdîhân check shows whether the Moon sets before or after twilight (p. 316).',
      month: 'The month that begins with this conjunction and the computed earliest day: the month cannot begin before it (p. 315). Arithmetic calendars are calendar information only.',
      map: 'The crescent at each place’s own sunset. The Ramadan crescent seen anywhere binds everywhere (p. 315); for the sacrifice the local scope is primary.',
      fieldTop: 'What to do now in the field: countdowns, Tam İlmihâl’s window and where to look. The sky view is always for the current moment.',
      fieldRec: 'Record your observation. The record and printed report document your statement; the ruling belongs to the authority. Cloudy/clear sky and the site matter legally (pp. 315–316).'
    },
    coordOk: (d, dms) => `Understood: ${d} (${dms})`, coordPair: 'Latitude and longitude entered together; both were filled in.', coordSwap: 'This value was understood as a longitude and moved to the longitude field.',
    coordErr: { empty: 'Empty value.', letter: b => `The letter “${b}” is not understood. Use N/S/E/W (or K/G/D/B).`, mixed: 'Both latitude and longitude letters in one value.', format: 'Format not understood. Example: 41.0082 · 41.0082 N · 41°00′29″N', minsec: 'Minutes and seconds must be below 60.', range: 'Out of range: latitude ±90°, longitude ±180°.' },
    numErr: 'Number not understood (example: 40 · 40.5 · 40 m).',
    fsNext: { gurub: 'to sunset', win: 'to the search', end: 'to window end', set: 'to moonset' }, fsNone: 'No observation this evening',
    footer: 'Astronomy Engine 2.1.19 (MIT) · Natural Earth · d3-celestial (BSD) · qrcode-generator (MIT) · Open-Meteo'
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
