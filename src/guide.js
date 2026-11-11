/* Rehber: konu açıklamaları (fıkhî esas + bilimsel açıklama), gözlem planı, teknikler, kurallar, kanonik metin. */
(function (G) {
  'use strict';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Her konu: [başlık, fıkhî esas / kitap, bilimsel açıklama]
  const TOPICS = {
    tr: {
      hesap: ['Hesap ve rü’yet',
        'Ay başı hilâli gözle görmekle başlar; hesap ve takvimle başlamak câiz değildir (s. 314–315; Fetâvâ-ı Hindiyye). Hesap ayın başladığı vakti değil, hilâlin görülebileceği geceyi bildirir (s. 360, İmâm-ı Sübkî). Rü’yetle başlama hesaptan bir gün sonra olabilir, önce olamaz (s. 315).',
        'İctimâ anı ve ayın konumu saniye ve açı dakikası hassasiyetiyle hesaplanır. Hilâlin görülmesi ise havanın durumuna, gökyüzünün parlaklığına ve gözlemcinin gözüne bağlıdır; bu yüzden yalnızca olasılık olarak tahmin edilebilir.'],
      ictima: ['İctimâ ve muhak',
        'Ay, güneş ve dünya aynı doğrultuya gelince (ictimâ’-ı neyyireyn) ayın bize bakan yüzü karanlıktır. Ayın görünmediği bu süreye muhak denir; 28–72 saat sürer ve ictimâ muhakın ortasıdır (s. 360). İbni Dakîk’e göre ictimâdan 1–2 gün geçmeden hilâl görülmez (s. 314).',
        'İctimâ, ayın ekliptik boylamının güneşinkine eşit olduğu andır. Ay yörüngesi ekliptiğe yaklaşık 5,1° eğik olduğu için ictimâ anında bile ay güneşten 0–5° ayrık olabilir. İki ictimâ arası ortalama 29 gün 12 saat 44 dakikadır; gerçekte 29,3 ile 29,8 gün arasında değişir.'],
      beynunet: ['Beynûnet: 8° ve 18°',
        'Beynûnet 8°’den azken hilâl hiçbir yerde görülemez. A’zamî 18° olunca hilâl güneş batarken batı ufkunda görünür; o anda güneşin battığı boylamda ve batısında görülebilir (s. 360). 18° Osmanlı âlimlerinin kabulüdür.',
        'Beynûnet, dünyanın merkezinden bakınca ay ile güneş arasındaki açıdır (uzanım). Uzanım küçükken hilâlin aydınlık yayı çok incedir ve uçları kaybolur. Modern ölçümler çıplak gözle en küçük sınırı yaklaşık 7,5° bulur (Danjon sınırı ≈7°). Ay güneşten günde ortalama 12,2° uzaklaşır.'],
      besderece: ['Ufka yakınlık: 5°',
        '57′ ihtilâf-ı manzar sebebiyle hilâl ufka 5° yaklaşınca görülemez (s. 360). Tam İlmihâl’in gözlem penceresi, gurûbdan hilâlin 5°’ye indiği ana kadar sürer.',
        'Ufka yakın ışık çok kalın bir hava tabakasından geçer; sönüm ve pus hilâlin zaten zayıf ışığını yok eder. Ayın paralaksı (yaklaşık 57′) onu, dünyanın merkezinden görüleceğine göre yaklaşık 1° alçak gösterir. Program görünen irtifâı paralaks ve kırılma dahil hesaplar.'],
      gurub: ['Gurûb ve temkin',
        'Üç gurûb vardır: hakîkî, zâhirî ve şer’î. Gurûbu görebilen için zâhirî gurûb, göremeyen için şer’î gurûb mu’teberdir. Şer’î gurûb, hakîkî gurûba temkin eklenerek bulunur (s. 181, 186, 317). Temkin ihtiyat zamanı değildir (s. 316).',
        'Zâhirî gurûb, güneşin üst kenarının görünen ufuktan kaybolduğu andır. Atmosferik kırılma (yaklaşık 34′) ve güneşin yarıçapı (yaklaşık 16′) bu anı geometrik batıştan birkaç dakika sonraya iter. Yüksek bir yerde ufuk alçalır; Tam İlmihâl bunun için 106,92″ × √h formülünü verir (s. 185).'],
      safak: ['Şafak ve Kâdîhân kuralı',
        'Kâdîhân: hilâl şafaktan sonra batarsa ikinci gecenin, şafaktan önce batarsa birinci gecenin hilâlidir (s. 316). Tam İlmihâl, yatsı vaktini anlatırken iki kavli birlikte bildirir (s. 178). İmâmeyn’e (ve diğer üç mezhebe) göre yatsı batıdaki kırmızılık kaybolunca başlar; bu, güneşin üst kenârının ufkun 17° altına indiği vakittir. İmâm-ı a’zam’a göre ise beyâzlık kaybolunca başlar; bu da 19° altına indiği vakittir. Tam İlmihâl, ikindiyi ve yatsıyı İmâm-ı a’zam’ın kavline göre kılmanın ihtiyâtlı olduğunu (s. 194), beyâzlığın kaybolmasını beklemenin efdal olduğunu (s. 244) bildirir. Kâdîhân kuralı için hangi şafağın kastedildiğini ayrıca belirtmez. Program bu sebeple ihtiyâtlı olan İmâm-ı a’zam kavlini (−19°) esas alır ve İmâmeyn kavlinin (−17°) sonucunu yanında alternatif olarak gösterir. İki kavil farklı sonuç verirse bunu açıkça yazar.',
        'Şafak vakitleri Tam İlmihâl’in hesap usulüyle bulunur: önce güneş merkezinin hakîkî ufka göre −19° veya −17° irtifâa indiği hakîkî vakit hesaplanır, sonra buna temkin eklenerek şer’î vakit elde edilir (s. 197; İstanbul’da yaklaşık 8–10 dakika). İkinci gecenin hilâli daha kalın ve daha yüksektir, daha geç batar; kural bu gerçeğe dayanır. Bu sayede “ilk gece gördüm” iddiası ayın batış saatiyle kontrol edilebilir.'],
      kuresel: ['Ramezân küresel, kurban mahallî',
        'Şa’bânın 30. gecesi bir şehirde hilâl görülünce bütün dünyada oruca başlamak lâzımdır (s. 315). Bunun için rü’yetin şahitlik, hâkim hükmü veya yaygın haberle sabit olması gerekir. Hac Mekke’deki rü’yete göredir; kurban ve namaz vakitleri bulunulan yere göredir (Redd-ül-muhtâr, Kitâb-us-savm).',
        'Hilâl önce batıdaki yerlerde görülür. Aynı yerel tarihte gurûb batıda daha geç olur ve ay o arada güneşten daha çok uzaklaşır. Bu yüzden dünya genelinde en erken rü’yet çoğunlukla Amerika ve Pasifik’te mümkün olur.'],
      sahitlik: ['Şahitlik',
        'Bulutlu havada Ramezân hilâlini bir âdil müslümanın görmesi yeter; açık havada çok kimsenin şahitliği gerekir. Kâdî bulunmayan yerde bir âdilin sözüyle Ramezân, iki âdilin sözüyle bayram olur. Bulutlu havada Şevvâl için iki erkek veya bir erkek ile iki kadın gerekir (s. 315–316).',
        'Programın kaydı bir kullanıcı beyanıdır; zamanı, yeri ve gözlem şartlarını belgelemeye yardım eder. Hesaba göre imkânsız bir akşam için yapılan beyan kesin reddedilir (İmâm-ı Sübkî, s. 360).'],
      ciplak: ['Çıplak göz şartı',
        'Rü’yet, gökte yeni ayı görmektir. Rasad ve rü’yet-i hilâlin çıplak gözle yapılması şarttır; aletle yapılan gözlem muteber değildir (Rasad Hakkında Zarûrî Malûmat).',
        'Dürbün ve teleskop sönük bir hilâli çıplak göz sınırının altında da gösterebilir. Modern modellerdeki "optik araç gerekir" sınıfları bunu anlatır. Programın ana sınıfları çıplak göz içindir.'],
      enerken: ['Hesâbî en erken gün',
        'Ay başı, hesapla bulunan gün veya ertesi gündür; bir gün önce olamaz (s. 315, 360). Ramezân’da dünya geneli, kurbanda bulunduğunuz yer, hacda Mekke esas alınır.',
        'Program, beynûnet ≥ 8° ve görünen irtifâ ≥ 5° şartının ilk sağlandığı akşamı arar; en erken gün o akşamın ertesi günüdür. Bir tarihin en geç gurûbu tarih çizgisinin hemen doğusunda olduğundan, dünya geneli en erken akşam çoğunlukla Pasifik’te bulunur.'],
      isik: ['Işık Usulü ve takvim usulleri',
        'Işık Usulü bir arabî ayın ilk gününü hesapla bulur. Şahitle sabit olmayan yerlerde kurban bayramı bu hesapla bulunan gün veya ertesidir (s. 326, 359). Uluğ Beğ ve Kindî cetvelleri de takvim usulleridir (s. 361–362).',
        'Bu usuller ortalama ay hareketine dayanan aritmetik kurallardır; gerçek ictimâyı ve atmosferi hesaba katmazlar. 1430–1460 yılları arasında Işık Usulü, ayların yaklaşık %8’inde ay başını hilâlin fiziken görülemeyeceği bir güne koyuyor.'],
      modern: ['Modern modeller (Yallop, Odeh)',
        'Ek bilgidir; hüküm vermez. Yalnızca en iyi gözlem anı (gurûb + 4/9 × fark) ana panelde gösterilir.',
        'Yallop (1997) ve Odeh (2004), yüzlerce kayıtlı gözlemden çıkarılmış ölçütlerdir. İkisi de ay ile güneş arasındaki irtifâ farkını (ARCV) hilâlin kalınlığıyla (W) karşılaştırır. Sınıflar "çıplak gözle kolayca görülür"den "teleskopla da görülemez"e kadar uzanır.']
    },
    en: {
      hesap: ['Calculation and sighting',
        'The month begins by seeing the crescent; beginning it by calculation or calendar is not permissible (pp. 314–315; Fatawa al-Hindiyya). Calculation gives the night on which the crescent can be seen, not when the month begins (p. 360, Imam Subki). A start by sighting may be one day after the calculation, never before (p. 315).',
        'The moment of conjunction and the Moon’s position are computed to seconds and arcminutes. Whether the crescent is seen depends on the air, the sky brightness and the observer’s eye, so it can only be predicted as a probability.'],
      ictima: ['Conjunction and muhak',
        'When Moon, Sun and Earth are aligned (ictimâ), the side of the Moon facing us is dark. The period in which it is invisible is called muhak; it lasts 28–72 hours, and the conjunction is its middle (p. 360). According to Ibn Daqiq the crescent is not seen before 1–2 days have passed (p. 314).',
        'Conjunction is the moment the Moon’s ecliptic longitude equals the Sun’s. Because the lunar orbit is inclined about 5.1° to the ecliptic, the Moon can be 0–5° from the Sun even at conjunction. The mean interval between conjunctions is 29 d 12 h 44 min; actual intervals range from 29.3 to 29.8 days.'],
      beynunet: ['Beynûnet: 8° and 18°',
        'While the beynûnet is under 8° the crescent cannot be seen anywhere. When it reaches at most 18°, the crescent appears in the west as the Sun sets, at the longitude where the Sun is setting at that moment and to its west (p. 360). The 18° value is the Ottoman scholars’ criterion.',
        'Beynûnet is the angle between Moon and Sun as seen from the Earth’s centre (elongation). At small elongation the lit arc is extremely thin and its ends vanish. Modern studies put the naked-eye limit near 7.5° (Danjon limit ≈7°). The Moon moves away from the Sun by about 12.2° a day.'],
      besderece: ['Closeness to the horizon: 5°',
        'Because of the 57′ parallax, the crescent cannot be seen once it comes within 5° of the horizon (p. 360). Tam İlmihâl’s observation window lasts from sunset until the crescent drops to 5°.',
        'Light near the horizon crosses a very thick layer of air; extinction and haze wipe out the faint crescent. The Moon’s parallax (about 57′) makes it appear about 1° lower than seen from the Earth’s centre. The program computes apparent altitude including parallax and refraction.'],
      gurub: ['Sunset and tamkin',
        'There are three sunsets: hakîkî, zâhirî and şer’î. For those who can see the sunset, the zâhirî sunset counts; for those who cannot, the şer’î sunset, found by adding tamkin to the hakîkî sunset (pp. 181, 186, 317). Tamkin is not a safety margin (p. 316).',
        'Zâhirî sunset is when the Sun’s upper limb disappears below the visible horizon. Refraction (about 34′) and the solar radius (about 16′) push it a few minutes after the geometric sunset. From a height the horizon dips; Tam İlmihâl gives 106.92″ × √h (p. 185).'],
      safak: ['Twilight and the Kâdîhân rule',
        'Kâdîhân: if the crescent sets after twilight ends it is the second night’s crescent; if before, the first night’s (p. 316). Tam İlmihâl gives both views when describing the time of the night prayer (p. 178). According to the Imâmayn (and the other three schools), it begins when the red glow in the west disappears, i.e. when the Sun’s upper limb is 17° below the horizon. According to Imâm-ı A‘zam, it begins when the white glow disappears, at 19°. Tam İlmihâl states that praying the afternoon and night prayers by Imâm-ı A‘zam’s view is the precautionary course (p. 194), and that waiting for the white glow to vanish is better (p. 244). For the Kâdîhân rule it does not say which twilight is meant. The programme therefore takes Imâm-ı A‘zam’s precautionary view (−19°) as primary and shows the Imâmayn result (−17°) beside it as the alternative. When the two give different results, it says so.',
        'Twilight times follow Tam İlmihâl’s method: first the true time when the Sun’s centre reaches −19° or −17° relative to the true horizon, then temkin is added to obtain the legal time (p. 197; about 8–10 minutes in Istanbul). The second night’s crescent is thicker and higher and sets later; the rule rests on this fact, so a claim to have seen it on the first night can be checked against the moonset time.'],
      kuresel: ['Ramadan worldwide, Qurban local',
        'When the crescent is seen in one city on the 30th night of Sha’ban, fasting must begin everywhere (p. 315), provided the sighting is established by witnesses, a judge’s ruling or widespread report. Hajj follows the sighting in Mecca; Qurban and prayer times follow one’s own location (Radd al-Muhtar, Kitab al-Sawm).',
        'The crescent is seen first in western places: on the same local date sunset happens later in the west, and meanwhile the Moon moves further from the Sun. So the earliest sighting worldwide is usually possible in the Americas and the Pacific.'],
      sahitlik: ['Witnesses',
        'In cloudy weather one just Muslim’s sighting of the Ramadan crescent suffices; in clear weather many witnesses are needed. Where there is no judge, Ramadan begins on one just person’s word and the Eid on two. In cloudy weather Shawwal needs two men or one man and two women (pp. 315–316).',
        'The program’s record is a user statement; it helps document the time, place and conditions. A claim for an evening on which sighting is impossible by calculation is rejected (Imam Subki, p. 360).'],
      ciplak: ['Naked-eye requirement',
        'Ru’yat is seeing the new moon in the sky. Observation and crescent sighting must be with the naked eye; observation with instruments is not valid (Rasad Hakkında Zarûrî Malûmat).',
        'Binoculars and telescopes can show a crescent below the naked-eye limit; the "optical aid needed" classes of modern models describe this. The program’s main classes are for the naked eye.'],
      enerken: ['Earliest possible day',
        'The month begins on the day found by calculation or the next day; never a day before (pp. 315, 360). Ramadan uses the whole world, Qurban your location, Hajj Mecca.',
        'The program looks for the first evening with beynûnet ≥ 8° and apparent altitude ≥ 5°; the earliest day is the day after it. A date’s latest sunset is just east of the date line, so the worldwide earliest evening is usually in the Pacific.'],
      isik: ['Işık method and calendar methods',
        'The Işık method calculates the first day of an Arabic month. Where it is not established by witnesses, Eid al-Adha is the day so found or the next (pp. 326, 359). The Ulugh Beg and Kindî tables are calendar methods too (pp. 361–362).',
        'These are arithmetic rules based on the mean lunar motion; they ignore the actual conjunction and the atmosphere. For 1430–1460 AH the Işık method puts the month start on a day of physically impossible visibility in about 8% of months.'],
      modern: ['Modern models (Yallop, Odeh)',
        'Additional information only; no ruling. Only the best observation time (sunset + 4/9 × lag) is shown on the main panel.',
        'Yallop (1997) and Odeh (2004) are criteria fitted to hundreds of recorded observations. Both compare the altitude difference between Moon and Sun (ARCV) with the crescent width (W). Classes range from "easily visible to the naked eye" to "not visible even with a telescope".']
    }
  };

  const PLAN = {
    tr: [
      ['Çıkmadan önce', [
        'Bu akşamın sınıfına bakın. "Hilâl doğmamış" veya "Görülemez" ise rasad beklenmez; bir sonraki akşamı planlayın.',
        'Hava durumunu kontrol edin: batı ve güneybatı ufku bulutsuz, pussuz ve tozsuz olmalı.',
        'Batıya doğru ufku açık bir yer seçin: deniz kenarı, tepe veya yüksek bir bina. Şehir ışıklarından uzak olun.',
        'Harita sekmesinde bulunduğunuz yerin rengine ve en erken akşama bakın.',
        'Zâhirî gurûbdan en az 20 dakika önce yerinizde olun.'
      ]],
      ['Sahada', [
        'Güneş batarken battığı noktayı bir ağaç, bina veya tepeyle işaretleyin.',
        'Hilâlin yerini yumruk ölçüsüyle bulun: kolunuzu tam uzatın; bir yumruk yaklaşık 10°, üç parmak yaklaşık 5°, serçe parmak yaklaşık 1°’dir.',
        'En iyi gözlem anından 10–15 dakika önce aramaya başlayın. Gökyüzü karardıkça hilâl ufka yaklaşır ve 5°’nin altında kaybolur.',
        'Gözlerinizi yavaşça, yatay bantlar halinde tarayın. Sönük cisimler, doğrudan değil biraz yanına bakınca daha iyi görünür (yan bakış).',
        '20–30 saniye bakıp gözünüzü kısa süre dinlendirin. Güneşin battığı yere uzun süre bakmayın.',
        'Ekranı gece moduna alın; parlak ışık karanlığa alışmış gözü bozar.'
      ]],
      ['Hilâli tanımak', [
        'Hilâl ince bir yaydır; parlak kenarı güneşin battığı yere dönüktür, uçları (boynuzları) güneşten öteye ve yukarıya bakar.',
        'Zühre (Venüs) ve Utârid (Merkür) gurûbdan sonra batı ufkunda parlak noktalar halinde görünür; nokta gibidirler, yay değildirler. Hilâl sanılmamalıdır.',
        'Uçak izleri, ince bulut kenarları ve ufuktaki ışıklar hilâle benzeyebilir. Şüphede kalırsanız şeklin birkaç dakika boyunca sabit kalıp kalmadığına bakın.'
      ]],
      ['Gördükten sonra', [
        'Saati, yeri, hava durumunu, hilâli ne kadar süre gördüğünüzü ve yanınızdaki şahitleri kaydedin.',
        'Programdaki kayıt bir kullanıcı beyanıdır. Şer’î hüküm, şahitlik şartlarıyla sabit olur (s. 315–316).'
      ]]
    ],
    en: [
      ['Before you go', [
        'Check this evening’s class. If it says "not yet born" or "not visible", no sighting is expected; plan for the next evening.',
        'Check the weather: the western and south-western horizon must be free of cloud, haze and dust.',
        'Pick a place with an open western horizon: a shore, a hill or a tall building, away from city lights.',
        'On the Map tab, look at your location’s colour and the earliest evening.',
        'Be in place at least 20 minutes before sunset.'
      ]],
      ['In the field', [
        'Mark the point where the Sun sets with a tree, building or hill.',
        'Find the crescent’s position with your hand: arm fully stretched, a fist is about 10°, three fingers about 5°, the little finger about 1°.',
        'Start searching 10–15 minutes before the best time. As the sky darkens the crescent sinks and is lost below 5°.',
        'Scan slowly in horizontal bands. Faint objects show better slightly off-centre (averted vision).',
        'Look for 20–30 seconds, then rest your eyes. Do not stare at the sunset point.',
        'Switch the screen to night mode; bright light spoils dark adaptation.'
      ]],
      ['Recognising the crescent', [
        'The crescent is a thin arc; its bright edge faces the sunset point and its horns point away from the Sun, upward.',
        'Venus and Mercury appear after sunset as bright points in the west; they are points, not arcs. Do not take them for the crescent.',
        'Contrails, thin cloud edges and horizon lights can look like a crescent. If unsure, check whether the shape stays the same for a few minutes.'
      ]],
      ['After the sighting', [
        'Record the time, place, weather, how long you saw it and who was with you.',
        'The program’s record is a user statement. A legal ruling is established by witnesses (pp. 315–316).'
      ]]
    ]
  };

  function topicHtml(L, id) {
    const t = TOPICS[L][id]; if (!t) return '';
    const fk = L === 'tr' ? 'Fıkhî esas (Tam İlmihâl)' : 'Legal basis (Tam İlmihâl)', bl = L === 'tr' ? 'Bilimsel açıklama' : 'Scientific explanation';
    return `<h3>${esc(t[0])}</h3><p class="lab">${fk}</p><p>${esc(t[1])}</p><p class="lab">${bl}</p><p>${esc(t[2])}</p>`;
  }
  function planHtml(L) {
    return PLAN[L].map(([h, items]) => `<h3>${esc(h)}</h3><ul class="check">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`).join('');
  }
  function rulesHtml(L) {
    const tr = L === 'tr';
    const rows = tr ? [
      ['İctimâ olmamış veya ay güneşten önce batıyor', 'Hilâl doğmamış', 'Kesin red (Sübkî, s. 360)'],
      ['Gurûbda beynûnet < 8°', 'Görülemez (Tam İlmihâl, s. 360); ek bilgi: modern sınır 7,5°', 'Kesin red (Sübkî, s. 360)'],
      ['Hilâlin görünen irtifâı < 5°', 'Görülemez: ufka 5°’den yakın (s. 360)', 'Uyarı'],
      ['8° ≤ beynûnet < 18°', 'Görülmesi mümkün; dikkatli rasad gerekir', 'Kabul edilebilir'],
      ['Beynûnet ≥ 18°', 'Hesâba göre görülebilir (hava müsaitse)', 'Kabul edilebilir']
    ] : [
      ['No conjunction yet, or the Moon sets before the Sun', 'Crescent not yet born', 'Rejected (Subki, p. 360)'],
      ['Beynûnet < 8° at sunset', 'Not visible (Tam İlmihâl, p. 360); additional: modern limit 7.5°', 'Rejected (Subki, p. 360)'],
      ['Apparent altitude of the crescent < 5°', 'Not visible: closer than 5° to the horizon (p. 360)', 'Warning'],
      ['8° ≤ beynûnet < 18°', 'Possible; careful observation needed', 'Acceptable'],
      ['Beynûnet ≥ 18°', 'Visible by calculation (if the sky is clear)', 'Acceptable']
    ];
    const head = tr ? ['Gurûbdaki durum (sırayla denetlenir)', 'Ana görünüm', 'Rü’yet beyanına karşılık'] : ['Condition at sunset (checked in order)', 'Main label', 'Response to a sighting claim'];
    return `<div class="scroll"><table class="t"><thead><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function sourcesHtml(L) {
    const tr = L === 'tr';
    return '<ul>' + [
      tr ? 'Hüseyn Hilmi Işık, <em>Tam İlmihâl Se’âdet-i Ebediyye</em>, Hakîkat Kitâbevi (2026 baskısı): s. 175–203, 314–317, 326, 344, 358–362, 360.'
         : 'Hüseyn Hilmi Işık, <em>Tam İlmihâl Se’âdet-i Ebediyye</em>, Hakîkat Kitâbevi (2026 edition): pp. 175–203, 314–317, 326, 344, 358–362, 360.',
      tr ? 'İbni Âbidîn, <em>Redd-ül-muhtâr</em>, Kitâb-us-savm (Ahmed Davudoğlu tercümesi).' : 'Ibn Abidin, <em>Radd al-Muhtar</em>, Kitab al-Sawm (tr. Ahmed Davudoğlu).',
      '<a href="https://praytimes.net/documents/RasadHakkindaZaruriMalumat.pdf">Rasad Hakkında Zarûrî Malûmat</a> (praytimes.net)',
      'Yallop, B. D. (1997), NAO Technical Note 69. Odeh, M. Sh. (2004), Experimental Astronomy 18.',
      'Fatoohi, Stephenson, Al-Dargazelli (1998); Sultan, A. H. (2007), The Observatory 127.',
      tr ? 'Harita: Natural Earth 1:110m (kamu malı). Astronomik motor: Astronomy Engine 2.1.19 (MIT).' : 'Map: Natural Earth 1:110m (public domain). Astronomy: Astronomy Engine 2.1.19 (MIT).'
    ].map(x => `<li>${x}</li>`).join('') + '</ul>';
  }
  const CANON_EN = G.HR_CANON_EN || [];
  function canonHtml(L) {
    const canon = L === 'tr' ? (G.HR_CANON_TR || []) : CANON_EN;
    const note = L === 'tr' ? '' : '<p class="small">English rendering of the Turkish canonical text. The Turkish text is authoritative.</p>';
    return note + canon.map(p => `<p>${esc(p)}</p>`).join('');
  }
  function render(L, t) {
    const ids = Object.keys(TOPICS[L]);
    return `<div class="guide-grid">
      <section class="card prose"><h2>${t.gPlan}</h2>${planHtml(L)}</section>
      <section class="card prose"><h2>${t.gTopics}</h2>${ids.map(id => `<details class="topic" id="topic-${id}"><summary>${esc(TOPICS[L][id][0])}</summary>${topicHtml(L, id).replace(/^<h3>.*?<\/h3>/, '')}</details>`).join('')}</section>
      <section class="card prose"><h2>${t.helpRules}</h2>${rulesHtml(L)}</section>
      <section class="card prose"><h2>${t.helpCanon}</h2>${canonHtml(L)}</section>
      <section class="card prose"><h2>${t.helpSources}</h2>${sourcesHtml(L)}</section>
    </div>`;
  }
  G.HRGuide = { TOPICS, render, topicHtml, planHtml };
})(typeof globalThis !== 'undefined' ? globalThis : window);
