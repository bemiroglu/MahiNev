/* “Bu akşam ne demek?”: seçili tarih ve yer için açıklama ve örnek.
 * Esas, kitabın “iki gece” bildirişidir: hilâl hesâbın bildirdiği gecede doğar; o gece görülmeyip bir gece sonra
 * görülebilir (s. 360). Rü’yetle başlama hesapla anlaşılandan bir gün sonra olabilir, önce olamaz (s. 315); Zilhiccede
 * bayram, Işık usulüyle bulunan gündür yâhud bir gün sonradır (s. 326). Bu yüzden her ayın 1. günü için iki ihtimal
 * gösterilir: hesâbî gün (H) ve bir gün sonrası (H+1). Ay 29 günden kısa, 30 günden uzun olmaz (s. 315); önceki ayın
 * başı bu iki ihtimalden birini düşürebilir, üçüncü bir ihtimal doğurmaz. Gündüz görülen hilâl gelecek gecenindir
 * (s. 315); Kâdîhân ölçüsü (s. 316) yalnız bilgi olarak gösterilir. Yardımcı kaynak: Kongre tebliği (Türkiye Takvimi,
 * 2016). Sayfa numaraları Tam İlmihâl Ocak 2026 baskısına göredir. */
(function (G) {
  'use strict';
  const RANK = { visible: 3, possible: 2, below5: 1, below8: 0, notBorn: -1, noSunset: -2 };
  // Kaba dünya taraması için bölgeler: [ad TR, ad EN, güney, kuzey, batı, doğu]
  const REGIONS = [
    ['Kuzey Amerika', 'North America', 15, 60, -165, -55], ['Orta ve Güney Amerika', 'Central and South America', -55, 15, -92, -35],
    ['Pasifik', 'Pacific', -30, 25, -178, -140], ['Avrupa', 'Europe', 36, 60, -10, 40], ['Afrika', 'Africa', -35, 35, -17, 50],
    ['Orta Doğu', 'Middle East', 12, 40, 35, 62], ['Asya', 'Asia', 5, 55, 62, 145], ['Okyanusya', 'Oceania', -45, -5, 110, 178]
  ];
  const S = {
    tr: {
      pg: n => `s. ${n}`, recSeenShort: 'kaydınız: görüldü', recNotShort: 'kaydınız: görülmedi',
      btn: 'Bu akşam ne demek?', btnShort: 'Açıkla', title: 'Bu seçim için açıklama',
      head: (d, p) => `${d} akşamı · ${p}`, monthLine: (m, c) => `${m} ay başı · İctimâ: ${c}`,
      here: 'Bu akşam burada', world: 'Bu akşam dünyada', start: 'Ay başı: iki gece', scope: 'Kapsam ve hüküm', more: 'Ayrıntılı açıklama',
      claim: 'Rü’yet beyanı', worldCalc: 'Dünya taraması yapılıyor…',
      worldNone: 'Hilâlin görülmesi bu akşam dünyanın hiçbir yerinde hesâben mümkün değildir. Bu akşam “gördüm” beyanı kabul edilmez (s. 315, 360).',
      worldPoss: x => `Hesâben mümkün olduğu bölgeler (beynûnet 8°–18°): ${x}.`, worldVis: x => `Görülebilir olduğu bölgeler (beynûnet ≥ 18°): ${x}.`,
      worldNote: 'Bölgeler kaba bir taramayla bulunur (deniz seviyesi, standart gurûb). Ayrıntı için Harita sekmesine bakın.',
      lead: 'Tam İlmihâl’e göre hilâl, hesâbın bildirdiği gecede doğar; fakat o gece görülmeyip bir gece sonra görülebilir (s. 360). Rü’yetle başlama hesapla anlaşılandan bir gün sonra olabilir; bir gün önce olamaz (s. 315). Bu yüzden ayın 1. günü iki günden biridir:',
      leadZh: 'Şahitle sabit olmayan yerlerde Zilhiccenin 1. günü Işık usulüyle bulunur. Bayram, bu hesapla bulunan gündür yâhud bir gün sonradır; bir gün evvel olamaz (s. 326). Bu yüzden ayın 1. günü iki günden biridir:',
      optEq: (m, d) => `1 ${m} = ${d}`,
      optA: e => `Hilâl ${e} akşamı (birinci gece) dünyanın bir yerinde görülüp sabit olursa.`,
      optB: (e, e2) => `Hilâl ${e} akşamı görülmezse; ikinci gece, ${e2} akşamı görülebilir (s. 360).`,
      optAZh: 'Işık usulüyle bulunan gün (s. 326).', optBZh: 'Yâhud bir gün sonrası (s. 326).',
      kurban: (a, b) => `Kurban bayramının 1. günü: ${a} veya ${b}.`,
      notBefore: (m, d, p) => `1 ${m}, ${d} tarihinden önce olamaz (${p}).`,
      b18: e => `${e} akşamı hilâl dünyanın birçok yerinde 18°’yi geçer; Osmanlı âlimlerinin kabulüne göre bu beynûnette hilâl görülür (s. 360).`,
      prevLead: m => `Önceki ayın (${m}) başı da iki günden biridir; ay 29 günden kısa, 30 günden uzun olmaz (s. 315):`,
      prev30: (p, e, m, d) => `Önceki ay ${p} günü başladıysa ${e} onun 30. günüdür: ay otuza tamamlanır ve 1 ${m} ${d} olur.`,
      prev29: (p, e, m, d) => `Önceki ay ${p} günü başladıysa ${e} akşamı onun 28. akşamıdır: ay 29 günden kısa olmaz ve 1 ${m} ${d} olur.`,
      prevOpen: (p, e, m) => `Önceki ay ${p} günü başladıysa ${e} akşamı rasad akşamıdır (29. gün); 1 ${m} rü’yete göre bu iki günden biridir.`,
      todayL: d => `Bugün (${d}):`,
      tBefore: (m, h) => `${m} ayı henüz başlamamıştır; yukarıdaki ilk günden önce olamaz. Hesâbî gün: ${h}.`,
      tFirst: (m, pm) => `ya 1 ${m} ya da ${pm} ayının son günü.`,
      tN: (n, m, d1, d2) => `${n} ${m} (1 ${m} ${d1} ise) veya ${n - 1} ${m} (1 ${m} ${d2} ise).`,
      th: ['Akşam', 'Bu yerde', 'Dünyada', 'Hilâl o akşam görülüp sabit olursa'],
      thHere: 'Hilâl o akşam burada görülüp sabit olursa',
      rPrev: 'önceki akşam', rA: 'birinci gece', rB: 'ikinci gece', tonight: 'seçili akşam',
      fReject: p => `kabul edilmez (${p})`, fDay: (m, d) => `1 ${m} = ${d}`,
      wNone: 'hiçbir yerde mümkün değil', wVis: x => `≥ 18°: ${x}`, wPoss: x => `8°–18°: ${x}`, wCalc: '…',
      zhAstro: 'Bu yer sütunu ek bilgidir: bu yerin astronomik hesabı (Zilhicce mahallîdir).',
      recHead: 'Sizin rü’yetiniz', recSeenA: (e, m, d) => `Kaydınıza göre hilâli ${e} akşamı, birinci gece gördünüz. Bu rü’yet sabit olursa 1 ${m} = ${d}.`,
      recSeenB: (e, m, d, e0, d0) => `Kaydınıza göre hilâli ${e} akşamı, ikinci gece gördünüz. Bu rü’yet sabit olursa 1 ${m} = ${d}. Hilâl ${e0} akşamı başka bir yerde görülüp sabit olduysa 1 ${m} = ${d0}.`,
      recBad: e => `Kaydınızdaki ${e} akşamı rü’yeti Tam İlmihâl’e göre kabul edilmez: hilâl o akşam hiçbir yerde hesâben görülemez (s. 315, 360).`,
      recNot: e => `Kaydınız: ${e} akşamı görülmedi.`,
      recRam: 'Rü’yet, gördüm diyenin haberiyle sabit olur: Ramezân için bulutlu havada bir âdil müslimânın, açık havada birçok kimsenin haberi gerekir; kâdî bulunmayan yerlerde bir âdilin “gördüm” demesiyle Ramezân olur (s. 315).',
      recSev: 'Bayram için iki âdilin “gördüm” demesi gerekir (s. 315); Şevvâl hilâlini yalnız gören kimse bayram yapamaz (s. 316).',
      recGen: 'Kayıt şahitlik yerine geçmez. Rü’yet, gördüm diyenin haberiyle sabit olur; şartları Tam İlmihâl’de bildirilir (s. 315).',
      sGlobal: 'Bir şehirde hilâl görülünce bütün dünyada oruca başlamak lâzım olur (s. 315). Program Zilhicce dışındaki aylarda bu kapsamı kullanır.',
      sRamazan: 'Ramezân için Şa’bânın 29. günü gurûb vaktinde hilâl aranır; görülmezse Şa’bân otuza tamamlanır (s. 315).',
      sSevval: 'Bayram hilâli için iki âdil şahit gerekir (s. 315). Şevvâl hilâlini yalnız gören kimse bayram yapamaz (s. 316).',
      sKaza: 'Ramezâna rü’yet yerine takvimle başlanmışsa bayramdan sonra kazâ gerekir (s. 315–316): Şa’bân rü’yetle başlamışsa bir gün, başlamamışsa iki gün (Hindiyye, Kâdîhân).',
      sHajj: () => 'Hac, kurban ve namaz vakitleri mahallîdir (Redd-ül-muhtâr; Kongre tebliği, s. 7–8). Hac, Mekke’deki rü’yete göredir; Arefe, hesapla bulunan gün veya bir gün sonradır, önce olamaz (s. 315, 360).',
      sDay: 'Gündüz görülen hilâl gelecek gecenin hilâlidir (s. 315).',
      kSecond: 'Bu akşam hilâl görülürse, Kâdîhân’a göre ikinci gecenin hilâlidir: hilâl şafaktan sonra batıyor (s. 316).',
      kFirst: 'Bu akşam hilâl görülürse, Kâdîhân’a göre birinci gecenin hilâlidir: hilâl şafaktan önce batıyor (s. 316).',
      kInfo: 'Bu ölçü bilgi içindir; program ay başını buna göre seçmez.',
      kNoEarly: 'Ay başı hesapla bulunan günden önce olamayacağından (s. 315) bu ölçü ay başını öne almaz.',
      kLocal: 'Kâdîhân ölçüsü bu yerdeki hilâle bakar; yukarıdaki birinci ve ikinci gece ise dünya geneline göredir.',
      mIbni: 'İbni Âbidîn, kıble bahsinde şöyle bildirir: hilâl, hesâbın bildirdiği gecede doğar; fakat o gece görülmeyip bir gece sonra görülebilir. Oruca, hilâlin doğduğu gece değil, görüldüğü gece başlanır (s. 360).',
      mDilgan: 'Prof. Hamit Dilgan (İTÜ, 1963): “hilâlin görülmesi imkânı ile, bilfiil görülebilme keyfiyetini birbirinden ayırd etmek gerekir” (Kongre tebliği, s. 5). Program bu yüzden “mümkün” der; “görüldü” demez.',
      mReceb: 'Örnek, Receb 1437: 7 Nisan 2016 akşamı hilâlin görülmesi hesâben yalnız Amerika’nın batısında ve Pasifik’te mümkündü; hiçbir yerde görülmedi. 8 Nisan akşamı görüldü ve ay 9 Nisan’da başladı. Hesâbî en erken gün 8 Nisan’dı: ay bu iki günün ikincisinde başladı (Kongre tebliği, s. 9).',
      mLink: 'Deliller: Rehber → Naklî deliller',
      foot: 'Bu açıklama hesâbî imkânı anlatır. Hesap, ayın başladığı vakti değil, hilâlin görülebileceği geceyi anlamak içindir (s. 360). Hüküm, şahitlik şartlarıyla yetkili makamca verilir (s. 315).',
      mid: h => `Bu akşam ay başı rasadı yoktur. Hesâbî hicrî gün: <b>${h}</b>.`, midWhy: x => `Neden iki sayı: ${x}.`, midNext: d => `Sıradaki ay başı rasad gecesi: <b>${d}</b>.`,
      plan: 'Bu geceyi planla'
    },
    en: {
      pg: n => `p. ${n}`, recSeenShort: 'your record: seen', recNotShort: 'your record: not seen',
      btn: 'What does this evening mean?', btnShort: 'Explain', title: 'Explanation for this selection',
      head: (d, p) => `Evening of ${d} · ${p}`, monthLine: (m, c) => `Start of ${m} · Conjunction: ${c}`,
      here: 'This evening here', world: 'This evening worldwide', start: 'Start of the month: two nights', scope: 'Scope and ruling', more: 'Detailed explanation',
      claim: 'Sighting claim', worldCalc: 'Scanning the world…',
      worldNone: 'Tonight the crescent cannot be seen anywhere in the world by calculation. A claim to have seen it tonight is not accepted (pp. 315, 360).',
      worldPoss: x => `Regions where it is possible by calculation (elongation 8°–18°): ${x}.`, worldVis: x => `Regions where it is visible (elongation ≥ 18°): ${x}.`,
      worldNote: 'Regions come from a coarse scan (sea level, standard sunset). See the Map tab for detail.',
      lead: 'According to Tam İlmihâl, the crescent is born on the night calculation shows; but it may not be seen that night and be seen one night later (p. 360). Beginning by sighting may be one day later than what calculation shows, never a day earlier (p. 315). So day 1 of the month is one of two days:',
      leadZh: 'Where it is not established by witnesses, day 1 of Dhu al-Hijja is found by the Işık method. The ʿId is the calculated day or one day later, never a day earlier (p. 326). So day 1 of the month is one of two days:',
      optEq: (m, d) => `1 ${m} = ${d}`,
      optA: e => `If the crescent is seen and established somewhere in the world on the evening of ${e} (the first night).`,
      optB: (e, e2) => `If the crescent is not seen on the evening of ${e}; it may be seen on the second night, the evening of ${e2} (p. 360).`,
      optAZh: 'The day found by the Işık method (p. 326).', optBZh: 'Or one day later (p. 326).',
      kurban: (a, b) => `First day of ʿId al-Adha: ${a} or ${b}.`,
      notBefore: (m, d, p) => `1 ${m} cannot be before ${d} (${p}).`,
      b18: e => `On the evening of ${e} the crescent passes 18° in many places; by the acceptance of the Ottoman scholars it is seen at this elongation (p. 360).`,
      prevLead: m => `The start of the previous month (${m}) is also one of two days; a month is never shorter than 29 or longer than 30 days (p. 315):`,
      prev30: (p, e, m, d) => `If the previous month began on ${p}, ${e} is its 30th day: the month is completed to thirty and 1 ${m} is ${d}.`,
      prev29: (p, e, m, d) => `If the previous month began on ${p}, the evening of ${e} is its 28th evening: a month is not shorter than 29 days and 1 ${m} is ${d}.`,
      prevOpen: (p, e, m) => `If the previous month began on ${p}, the evening of ${e} is the watch evening (the 29th); 1 ${m} is one of these two days, by sighting.`,
      todayL: d => `Today (${d}):`,
      tBefore: (m, h) => `${m} has not begun yet; it cannot begin before the first day above. Computed day: ${h}.`,
      tFirst: (m, pm) => `either 1 ${m} or the last day of ${pm}.`,
      tN: (n, m, d1, d2) => `${n} ${m} (if 1 ${m} is ${d1}) or ${n - 1} ${m} (if 1 ${m} is ${d2}).`,
      th: ['Evening', 'Here', 'Worldwide', 'If the crescent is seen and established that evening'],
      thHere: 'If the crescent is seen and established here that evening',
      rPrev: 'evening before', rA: 'first night', rB: 'second night', tonight: 'selected evening',
      fReject: p => `not accepted (${p})`, fDay: (m, d) => `1 ${m} = ${d}`,
      wNone: 'not possible anywhere', wVis: x => `≥ 18°: ${x}`, wPoss: x => `8°–18°: ${x}`, wCalc: '…',
      zhAstro: 'The “Here” column is additional information: the astronomical calculation for this location (Dhu al-Hijja is local).',
      recHead: 'Your sighting', recSeenA: (e, m, d) => `By your record you saw the crescent on the evening of ${e}, the first night. If this sighting is established, 1 ${m} = ${d}.`,
      recSeenB: (e, m, d, e0, d0) => `By your record you saw the crescent on the evening of ${e}, the second night. If this sighting is established, 1 ${m} = ${d}. If the crescent was seen and established elsewhere on the evening of ${e0}, 1 ${m} = ${d0}.`,
      recBad: e => `The sighting in your record for the evening of ${e} is not accepted by Tam İlmihâl: the crescent cannot be seen anywhere that evening by calculation (pp. 315, 360).`,
      recNot: e => `Your record: not seen on the evening of ${e}.`,
      recRam: 'A sighting is established by the report of the one who says “I saw it”: for Ramadan, in cloudy weather one upright Muslim, in clear weather many people; where there is no judge, Ramadan begins when one upright person says “I saw it” (p. 315).',
      recSev: 'For the ʿId, two upright persons must say “I saw it” (p. 315); someone who alone sees the Shawwal crescent may not celebrate ʿId (p. 316).',
      recGen: 'A record does not replace testimony. A sighting is established by the report of the one who says “I saw it”; Tam İlmihâl states the conditions (p. 315).',
      sGlobal: 'When the crescent is seen in one city, fasting must begin all over the world (p. 315). The program uses this scope in every month except Dhu al-Hijja.',
      sRamazan: 'For Ramadan the crescent is sought at sunset on the 29th of Shaʿban; if it is not seen, Shaʿban is completed to thirty (p. 315).',
      sSevval: 'The ʿId crescent needs two upright witnesses (p. 315). Someone who alone sees the Shawwal crescent may not celebrate ʿId (p. 316).',
      sKaza: 'If Ramadan was begun by calendar instead of sighting, make-up fasts are needed after ʿId (pp. 315–316): one day if Shaʿban began by sighting, otherwise two (Hindiyya, Qadikhan).',
      sHajj: () => 'Hajj, sacrifice and prayer times are local (Radd al-Muhtar; congress paper, pp. 7–8). The Hajj follows the sighting in Mecca; ʿArafa is the calculated day or one day later, never earlier (pp. 315, 360).',
      sDay: 'A crescent seen in daytime belongs to the coming night (p. 315).',
      kSecond: 'If the crescent is seen this evening, by Qadikhan it is the crescent of the second night: it sets after the end of twilight (p. 316).',
      kFirst: 'If the crescent is seen this evening, by Qadikhan it is the crescent of the first night: it sets before the end of twilight (p. 316).',
      kInfo: 'This measure is shown for information; the program does not choose the start of the month by it.',
      kNoEarly: 'Since the month cannot begin before the calculated day (p. 315), this measure does not move the start earlier.',
      kLocal: 'The Qadikhan measure concerns the crescent at this location; the first and second nights above are worldwide.',
      mIbni: 'Ibn ʿAbidin, in the chapter on the qibla: the crescent is born on the night calculation shows, but it may not be seen that night and be seen one night later. Fasting begins on the night it is seen, not the night it is born (p. 360).',
      mDilgan: 'Prof. Hamit Dilgan (ITU, 1963): the possibility of seeing the crescent must be kept apart from its actual sighting (congress paper, p. 5). This is why the program says “possible”, never “seen”.',
      mReceb: 'Example, Rajab 1437: on the evening of 7 April 2016 the crescent was possible by calculation only in the western Americas and the Pacific; it was not seen anywhere. It was seen on 8 April and the month began on 9 April. The computed earliest day was 8 April: the month began on the second of the two days (congress paper, p. 9).',
      mLink: 'Evidence: Guide → Textual evidence',
      foot: 'This explanation describes calculated possibility. Calculation is for knowing the night on which the crescent can be seen, not the time the month begins (p. 360). The ruling is given by the competent authority under the conditions of testimony (p. 315).',
      mid: h => `There is no month-start watch this evening. Computed Hijri day: <b>${h}</b>.`, midWhy: x => `Why two numbers: ${x}.`, midNext: d => `Next month-start watch night: <b>${d}</b>.`,
      plan: 'Plan this night'
    }
  };

  // Bir akşamın dünya özeti: her bölgede en iyi sınıf
  const regCache = new Map();
  function regions(C, conj, ymd) {
    const k = conj.ut.toFixed(4) + ymd; if (regCache.has(k)) return regCache.get(k);
    const [y, m, d] = ymd.split('-').map(Number), day = Date.UTC(y, m - 1, d);
    const out = REGIONS.map(([tr, en, s, n, w, e]) => {
      let best = 'noSunset';
      for (let la = s; la <= n; la += 5) for (let lo = w; lo <= e; lo += 8) {
        let c; try { c = C.cell(la, lo, day, conj, false).code; } catch (er) { c = 'noSunset'; }
        if (RANK[c] > RANK[best]) best = c;
      }
      return { tr, en, best };
    });
    regCache.set(k, out); return out;
  }

  // Bir ayın Tam İlmihâl’e göre “hesapla bulunan günü” (H): Zilhiccede Işık usulü (s. 326), diğer aylarda dünya geneli hesâbî en erken gün
  function firstDayOf(X, conj, hm) {
    if (hm.m === 12) { const ik = X.CAL.methods(hm.y, 12).isik; if (ik) return { H: X.ymdOf(ik), isik: true }; }
    const e = X.earliest(conj, null); return e ? { H: X.ymdOf(e.first), isik: false } : null;
  }

  // Açıklamanın verisi (arayüzden bağımsız; testlerde de kullanılır)
  function data(X, ymd) {
    const { C, CAL } = X;
    const conj = C.nearestNewMoon(C.solarNoon(ymd, X.loc.lon));
    const cd = conj.date, conjYmd = X.ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
    const hm = CAL.monthForConjunction(conj.date), hajj = hm.m === 12;
    const eG = X.earliest(conj, null), eL = X.earliest(conj, [[X.loc.lat, X.loc.lon]]);
    const f = firstDayOf(X, conj, hm);
    const H = f ? f.H : null, H2 = H ? X.addDays(H, 1) : null;
    const E1 = H ? X.addDays(H, -1) : null, E2 = H;              // birinci ve ikinci gecenin akşamları
    const Ew = eG ? X.ymdOf(eG.evening) : null;                  // dünya genelinde ilk mümkün akşam
    // önceki ay: kendi H’si ve iki ay başı arasındaki gün farkı (29 veya 30 ise önceki ayın iki ihtimalinden biri bu ayı belirler)
    const pc = C.lastNewMoonBefore(conj.AddDays(-2)), phm = CAL.monthForConjunction(pc.date), pf = firstDayOf(X, pc, phm);
    const Hp = pf ? pf.H : null, gap = H && Hp ? Math.round((X.civil(H) - X.civil(Hp)) / 86400000) : null;
    // ay başı dönemi: ictimâdan bir gün önce, 1. günün iki ihtimalinin ikincisine kadar
    const inWin = !!H && ymd >= (conjYmd < X.addDays(E1, -1) ? conjYmd : X.addDays(E1, -1)) && ymd <= H2;
    const recs = (X.records || []).filter(r => r && r.observation);
    const seenRec = y => recs.filter(r => r.observation.evening === y && ['naked', 'aidedNaked'].includes(r.observation.result));
    const rows = [];
    if (H) for (const [y, k] of [[X.addDays(E1, -1), 'prev'], [E1, 'A'], [E2, 'B']]) {
      const r = X.evening(y), rs = recs.filter(x => x.observation.evening === y);
      const rec = rs.some(x => ['naked', 'aidedNaked'].includes(x.observation.result)) ? 'seen' : rs.some(x => x.observation.result === 'not') ? 'not' : null;
      const world = !Ew || y < Ew ? 'none' : y === Ew ? 'first' : 'yes';
      rows.push({ ymd: y, k, r, rec, world, firstDay: k === 'prev' ? null : X.addDays(y, 1), tonight: y === ymd });
    }
    // kullanıcının kendi rü’yeti: birinci veya ikinci gece görüldü kaydı; ilk mümkün akşamdan önceki “gördüm” kaydı kabul edilmez
    const own = H ? (seenRec(E1).length ? { k: 'A', ev: E1 } : seenRec(E2).length ? { k: 'B', ev: E2 } : null) : null;
    const bad = H && !hajj ? recs.filter(r => r.observation.evening < E1 && r.observation.evening >= X.addDays(E1, -3) && ['naked', 'aidedNaked'].includes(r.observation.result)).map(r => r.observation.evening).sort().pop() || null : null;
    const n = H ? Math.round((X.civil(ymd) - X.civil(H)) / 86400000) + 1 : null;
    return { ymd, conj, conjYmd, hm, hajj, eG, eL, H, H2, E1, E2, Ew, isik: !!(f && f.isik), phm, Hp, gap, inWin, rows, own, bad, n };
  }

  function html(X, d, L) {
    const s = S[L] || S.en, esc = X.esc, f = y => esc(X.fmtCivil(X.civil(y))), fs = y => esc(X.fmtCivil(X.civil(y), true));
    const mn = m => X.monthName(m), M = esc(mn(d.hm.m)), PM = esc(mn(d.phm.m));
    const r = X.evening(d.ymd);
    let h = `<p class="exhead"><b>${esc(s.head(X.fmtCivil(X.civil(d.ymd)), X.placeName()))}</b><br><span class="small">${esc(s.monthLine(`${mn(d.hm.m)} ${d.hm.y}`, X.fmtDT(d.conj)))}</span></p>`;
    if (!d.inWin) {
      const hj = X.hijriOf(d.ymd), why = X.hijriWhy ? X.hijriWhy(d.ymd) : '', nx = X.nextRasad(d.ymd);
      h = `<p class="exhead"><b>${esc(s.head(X.fmtCivil(X.civil(d.ymd)), X.placeName()))}</b></p><p>${s.mid(esc(hj ? hj.plain : '—'))}${why ? `<br><span class="small">${esc(s.midWhy(why))}</span>` : ''}</p>`;
      if (nx && nx.a) h += `<p>${s.midNext(f(nx.a.ymd))} <button class="btn" type="button" data-explan="${nx.a.ymd}">${esc(s.plan)}</button> <button class="btn" type="button" data-ex="${nx.a.ymd}">ⓘ ${esc(s.btn)}</button></p>`;
      return h + `<p class="cap">${esc(s.foot)}</p>`;
    }
    // 1. burada
    if (r && r.ok) {
      const [title, sub] = X.clsText(r), [claim, cc] = X.claimOf(r);
      h += `<h3>${esc(s.here)}</h3><p><b>${esc(title)}</b> ${X.q(X.clsTopic(r))}<br><span class="small">${esc(sub)}</span></p><p><span class="small">${esc(s.claim)}:</span> <span class="pill ${cc}">${esc(claim)}</span></p>`;
    }
    const inRows = d.rows.some(x => x.ymd === d.ymd);
    if (!inRows) h += `<h3>${esc(s.world)}</h3><div id="exWorld"><p class="small">${esc(s.worldCalc)}</p></div>`;
    // 2. ay başı: iki gece
    const pgE = s.pg(d.hajj ? 326 : 315);
    h += `<h3>${esc(s.start)}</h3><p>${esc(d.hajj && d.isik ? s.leadZh : s.lead)}${d.hajj && d.isik ? ' ' + X.q('isik') : ''}</p>`;
    const optA = d.hajj && d.isik ? s.optAZh : s.optA(X.fmtCivil(X.civil(d.E1), true)), optB = d.hajj && d.isik ? s.optBZh : s.optB(X.fmtCivil(X.civil(d.E1), true), X.fmtCivil(X.civil(d.E2), true));
    h += `<div class="extwo"><div><b>${esc(s.optEq(mn(d.hm.m), X.fmtCivil(X.civil(d.H))))}</b><span>${esc(optA)}</span></div><div><b>${esc(s.optEq(mn(d.hm.m), X.fmtCivil(X.civil(d.H2))))}</b><span>${esc(optB)}</span></div></div>`;
    const li = [esc(s.notBefore(mn(d.hm.m), X.fmtCivil(X.civil(d.H)), pgE))];
    if (d.hajj && d.isik) li.push(esc(s.kurban(X.fmtCivil(X.civil(X.addDays(d.H, 9))), X.fmtCivil(X.civil(X.addDays(d.H, 10))))));
    h += `<ul class="exlist">${li.map(x => `<li>${x}</li>`).join('')}</ul>`;
    if (!d.hajj && d.Ew && d.E2 > d.Ew) h += `<p class="small" id="exB18" hidden>${esc(s.b18(X.fmtCivil(X.civil(d.E2), true)))}</p>`;
    // bugünün kamerî günü (tarihlerle yazılır; her zaman doğru olan şartlı ifade)
    const fsD = y => X.fmtCivil(X.civil(y), true);
    let today;
    if (d.n < 1) { const hj = X.hijriOf(d.ymd); today = s.tBefore(mn(d.hm.m), hj ? hj.plain : '—'); }
    else if (d.n === 1) today = s.tFirst(mn(d.hm.m), mn(d.phm.m));
    else today = s.tN(d.n, mn(d.hm.m), fsD(d.H), fsD(d.H2));
    h += `<p class="extoday"><b>${esc(s.todayL(X.fmtCivil(X.civil(d.ymd), true)))}</b> ${esc(today)}</p>`;
    // önceki ayın başı bu iki ihtimalden birini düşürebilir (ay 29–30 gün); ayrıntı düzeyinde gösterilir
    if (d.Hp && (d.gap === 29 || d.gap === 30) && !(d.hajj && d.isik)) {   // Işık usulünde (s. 326) gösterilmez
      const p1 = X.fmtCivil(X.civil(d.Hp), true), p2 = X.fmtCivil(X.civil(X.addDays(d.Hp, 1)), true), e = X.fmtCivil(X.civil(d.E1), true);
      const forced = d.gap === 30 ? s.prev30(p1, e, mn(d.hm.m), fsD(d.H)) : s.prev29(p2, e, mn(d.hm.m), fsD(d.H2));
      const open = s.prevOpen(d.gap === 30 ? p2 : p1, e, mn(d.hm.m));
      h += `<div class="exprev"><p class="small">${esc(s.prevLead(`${mn(d.phm.m)} ${d.phm.y}`))}</p><ul class="exlist small"><li>${esc(forced)}</li><li>${esc(open)}</li></ul></div>`;
    }
    // akşam tablosu: önceki akşam, birinci gece, ikinci gece
    const cls = rw => rw.r && rw.r.ok ? `${esc(X.clsText(rw.r)[0])}<br><span class="small">${esc(X.clsText(rw.r)[1])}</span>` : '—';
    const th = d.hajj ? [s.th[0], s.th[1], s.th[2], s.thHere] : s.th;
    const lbl = { prev: s.rPrev, A: s.rA, B: s.rB };
    h += `<div class="extab"><table><thead><tr>${th.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>` + d.rows.map((rw, i) => {
      const locRej = d.hajj && rw.k !== 'prev' && rw.r && rw.r.ok && rw.r.cls.reject;   // Zilhicce mahallîdir: bu yerde hesâben görülemiyorsa
      const ft = rw.k === 'prev' ? `<span class="pill p-bad">${esc(s.fReject(pgE))}</span>` : locRej ? `<span class="pill p-bad">${esc(s.fReject(s.pg(360)))}</span>` : `<b>${esc(s.fDay(mn(d.hm.m), X.fmtCivil(X.civil(rw.firstDay), true)))}</b>`;
      const rec = rw.rec ? `<br><span class="small">${esc(rw.rec === 'seen' ? s.recSeenShort : s.recNotShort)}</span>` : '';
      const wc = rw.world === 'none' ? esc(s.wNone) : `<span id="exW${i}">${esc(s.wCalc)}</span>`;
      return `<tr${rw.tonight ? ' class="now"' : ''}><td><button class="lnk" type="button" data-explan="${rw.ymd}">${fs(rw.ymd)}</button><br><span class="small">${esc(lbl[rw.k])}${rw.tonight ? ' · ' + esc(s.tonight) : ''}</span>${rec}</td><td><span class="dot" style="background:${X.clsColor(rw.r)}"></span>${cls(rw)}</td><td>${wc}</td><td>${ft}</td></tr>`;
    }).join('') + `</tbody></table></div>`;
    if (d.hajj) h += `<p class="cap">${esc(s.zhAstro)}</p>`;
    // 3. kullanıcının kendi rü’yeti
    if (d.own || d.bad) {
      const li2 = [];
      if (d.own && d.own.k === 'A') li2.push(s.recSeenA(fsD(d.E1), mn(d.hm.m), X.fmtCivil(X.civil(d.H))));
      if (d.own && d.own.k === 'B') li2.push(s.recSeenB(fsD(d.E2), mn(d.hm.m), X.fmtCivil(X.civil(d.H2)), fsD(d.E1), X.fmtCivil(X.civil(d.H))));
      if (d.bad) li2.push(s.recBad(fsD(d.bad)));
      if (d.own) li2.push(d.hm.m === 9 ? s.recRam : d.hm.m === 10 ? s.recSev : s.recGen);
      h += `<h3>${esc(s.recHead)}</h3><ul class="exlist">${li2.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    }
    // 4. kapsam ve hüküm
    const sc = [];
    sc.push(esc(d.hajj ? s.sHajj() : s.sGlobal));
    if (d.hm.m === 9) sc.push(esc(s.sRamazan));
    if (d.hm.m === 10) { sc.push(esc(s.sSevval)); sc.push(esc(s.sKaza)); }
    sc.push(esc(s.sDay));
    if (r && r.ok && r.kadihan19 && r.cls.code !== 'midMonth' && !r.cls.reject) sc.push(esc((r.kadihan19 === 'second' ? s.kSecond : s.kFirst) + ' ' + s.kInfo + (r.kadihan19 === 'second' && d.ymd <= d.E1 ? ' ' + s.kNoEarly : '') + (!d.hajj && r.kadihan19 === 'first' && d.ymd > d.E1 ? ' ' + s.kLocal : '')));
    h += `<h3>${esc(s.scope)}</h3><ul class="exlist">${sc.map(x => `<li>${x}</li>`).join('')}</ul>`;
    // 5. ayrıntı
    const more = `<p>${esc(s.mIbni)}</p><p>${esc(s.mDilgan)}</p><p>${esc(s.mReceb)}</p><p>${esc(s.mLink)} ${X.q('nakli')}</p>`;
    h += X.long ? `<h3>${esc(s.more)}</h3>${more}` : `<details class="tmore"><summary>${esc(s.more)}</summary>${more}</details>`;
    return h + `<p class="cap">${esc(s.foot)}</p>`;
  }

  // Dünya kısımları: tarama bitince doldurulur (seçili akşam ve tablodaki akşamlar)
  function worldHtml(X, d, L) {
    const s = S[L] || S.en, reg = regions(X.C, d.conj, d.ymd);
    const nm = x => x[L] || x.en;
    const vis = reg.filter(x => x.best === 'visible').map(nm), poss = reg.filter(x => x.best === 'possible').map(nm);
    if (!vis.length && !poss.length) return `<p>${X.esc(s.worldNone)}</p>`;
    return (poss.length ? `<p>${X.esc(s.worldPoss(poss.join(', ')))}</p>` : '') + (vis.length ? `<p>${X.esc(s.worldVis(vis.join(', ')))}</p>` : '') + `<p class="cap">${X.esc(s.worldNote)}</p>`;
  }
  function worldCell(X, d, ymd, L) {
    const s = S[L] || S.en, reg = regions(X.C, d.conj, ymd), nm = x => x[L] || x.en;
    const vis = reg.filter(x => x.best === 'visible').map(nm), poss = reg.filter(x => x.best === 'possible').map(nm);
    if (!vis.length && !poss.length) return { txt: s.wNone, vis: false };
    return { txt: [vis.length ? s.wVis(vis.join(', ')) : '', poss.length ? s.wPoss(poss.join(', ')) : ''].filter(Boolean).join(' · '), vis: vis.length > 0 };
  }

  if (G.HRLangs) G.HRLangs.chain(S);
  G.HRExplain = { S, data, html, worldHtml, worldCell, regions, firstDayOf };
})(typeof globalThis !== 'undefined' ? globalThis : window);
