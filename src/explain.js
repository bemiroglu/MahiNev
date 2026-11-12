/* “Bu akşam ne demek?”: seçili tarih ve yer için açıklama ve örnek.
 * Kitabın hükümleri: hesap ayın başladığı vakti değil, hilâlin görülebileceği geceyi bildirir; rü'yetle başlama
 * hesapla anlaşılandan bir gün sonra olabilir, önce olamaz (s. 360); görülmezse ay otuza tamamlanır (s. 314–315);
 * gündüz görülen hilâl gelecek gecenindir (s. 315); Kâdîhân kontrolü (s. 316); Zilhiccede Işık usulü (s. 326).
 * Yardımcı kaynak: Kongre tebliği (Türkiye Takvimi, 2016). Sayfa numaraları Tam İlmihâl Ocak 2026 baskısına göredir. */
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
      btn: 'Bu akşam ne demek?', btnShort: 'Açıkla', title: 'Bu seçim için açıklama',
      head: (d, p) => `${d} akşamı · ${p}`, monthLine: (m, c) => `${m} ay başı · İctimâ: ${c}`,
      here: 'Bu akşam burada', world: 'Bu akşam dünyada', start: 'Ay başı ne olur?', scope: 'Kapsam ve hüküm', more: 'Ayrıntılı açıklama',
      claim: 'Rü’yet beyanı', worldCalc: 'Dünya taraması yapılıyor…',
      worldNone: 'Hilâlin görülmesi bu akşam dünyanın hiçbir yerinde hesâben mümkün değildir. Bu akşam “gördüm” beyanı kabul edilmez (s. 360).',
      worldPoss: x => `Hesâben mümkün olduğu bölgeler (beynûnet 8°–18°): ${x}.`, worldVis: x => `Görülebilir olduğu bölgeler (beynûnet ≥ 18°): ${x}.`,
      worldNote: 'Bölgeler kaba bir taramayla bulunur (deniz seviyesi, standart gurûb). Ayrıntı için Harita sekmesine bakın.',
      th: ['Akşam', 'Bu yerde', 'Dünyada', 'Hilâl ilk kez bu akşam görülüp sabit olursa'],
      wNone: 'hiçbir yerde mümkün değil', wFirst: 'ilk kez mümkün', wYes: 'mümkün',
      bMax: 'Ay otuz günü aşmaz: hilâl görülmezse ay otuza tamamlanır ve yeni ay, önceki ayın sabit olan 1. gününden 30 gün sonra başlar (s. 314–315).',
      bUnknown: 'Önceki ayın başı da rü’yetle veya otuza tamamlamayla sabit olur. Program hangisinin sabit olduğunu bilemez; bu yüzden her ihtimal aşağıda şartlı olarak gösterilir. Hangisinin doğru olduğuna yetkili makam hükmeder.',
      thP: ['Önceki ay bu gün başladıysa', '29. gün akşamı (rasad)', 'O akşam görülüp sabit olursa 1. gün', 'Görülmezse 1. gün (otuza tamamlama)'],
      kind: { comp: () => 'hesâbî en erken gün', isik: () => 'Işık usulü (s. 326)', plus: () => 'rü’yetle bir gün sonra', rec: e => `rü’yet kaydınıza göre (${e} akşamı)`, user: () => 'sizin seçiminiz' },
      no29: 'o akşam hilâl hiçbir yerde hesâben görülemez', no29Here: 'o akşam hilâl bu yerde hesâben görülemez',
      bAll: 'Bilinmiyor: bütün ihtimalleri göster',
      today: 'Bugünün kamerî günü, önceki ayın başına bağlıdır:',
      ifP: p => `Önceki ay ${p} günü başladıysa`,
      dN: (m, n) => `bugün ${m} ayının ${n}. günüdür.`,
      d29: ' Bu akşam rasad akşamıdır.', d29no: ' Bu akşam hilâl hiçbir yerde görülemez; ay otuza tamamlanır.', d29noHere: ' Bu akşam hilâl bu yerde görülemez; ay otuza tamamlanır.',
      d30: m => ` Dün akşam hilâl görülüp sabit olduysa bugün ${m} ayının 1. günüdür.`, d30x: ' Ay otuza tamamlanır; yeni ay bu akşam başlar.',
      dNew2: (m, a, b) => `bugün ${m} ayının ${a}. günüdür (29. gün akşamı hilâl görülmediyse ${b}. günü).`,
      dNew1: (m, a) => `bugün ${m} ayının ${a}. günüdür (29. gün akşamı hilâl görülemeyeceği için ay otuza tamamlanmıştır).`,
      rowsLead: 'Akşam akşam: hilâl ilk kez o akşam görülüp sabit olursa',
      cond: (a, b) => `şart: önceki ay ${a} veya ${b} günü başlamış olmalı (ay 29 veya 30 gündür)`,
      fEarly: 'seçtiğiniz başlangıçla bu akşam ayın 29. gününden öncedir',
      fReject: 'kabul edilmez (s. 360)', fDay: d => `1. gün ${d}`,
      fOver: d => `seçtiğiniz başlangıç sabitse ay otuz günü aşmaz; yeni ay en geç ${d} günü başlar`,
      tonight: 'bu akşam', recSeen: 'kaydınız: görüldü', recNot: 'kaydınız: görülmedi',
      basis: m => `Önceki ayın (${m}) sabit olan 1. günü`,
      basisNote: 'Yetkili makamca sabit olan başlangıcı biliyorsanız seçin; tablo ve bugünün kamerî günü ona göre daraltılır. Seçim yalnız bu açıklamayı etkiler, hüküm değildir.',
      recNote: 'Kayıt şahitlik değildir; esas olan yetkili makamın ilanıdır (s. 315–316).',
      zhLead: (a, k) => `Şahitle sabit olmayan yerlerde Zilhiccenin 1. günü Işık usulüyle bulunur: <b>${a}</b>; Kurban bayramının 1. günü <b>${k}</b> (s. 326). Bayram bu hesapla bulunan gündür yahut bir gün sonradır; bir gün evvel olamaz (s. 326, 360).`,
      zhAstro: 'Ek bilgi: bu yerin astronomik hesabı (Zilhicce mahallîdir)',
      thHere: 'Hilâl ilk kez bu akşam burada görülüp sabit olursa',
      bMin: f => `Rü’yetle başlama hesapla anlaşılandan bir gün sonra olabilir, önce olamaz: 1. gün <b>${f}</b> tarihinden önce olamaz (s. 360).`,
      sGlobal: 'Bir yerde rü’yet sabit olunca dünyanın her yerinde geçerli olur; kitap bunu Ramezân için açıkça bildirir (s. 315). Program Zilhicce dışındaki aylarda bu kapsamı kullanır.',
      sRamazan: 'Ramezân hilâlini aramak vâcib-i kifâyedir (s. 314–315). Bulutlu havada bir âdil müslimânın, açık havada çok kimsenin haberiyle sabit olur (s. 315–316).',
      sSevval: 'Bayram hilâli için iki âdil şahit gerekir (s. 315–316). Şevvâl hilâlini yalnız gören kimse bayram yapamaz (Mecmû’a-i Zühdiyye; Kongre tebliği, s. 4).',
      sKaza: 'Ramezâna rü’yet yerine takvimle başlanmışsa bayramdan sonra kazâ gerekir (s. 315–316): Şa’bân rü’yetle başlamışsa bir gün, başlamamışsa iki gün (Hindiyye, Kâdîhân; Kongre tebliği, s. 7).',
      sHajj: () => 'Hac, kurban ve namaz vakitleri mahallîdir (Redd-ül-muhtâr; Kongre tebliği, s. 7–8). Hac, Mekke’deki rü’yete göredir; Arefe, hesapla bulunan gün veya bir gün sonradır, önce olamaz (s. 344, 360).',
      sDay: 'Gündüz görülen hilâl gelecek gecenin hilâlidir (s. 315).',
      kSecond: 'Bu akşam hilâl yatsıdan sonra batıyor: Kâdîhân’a göre ikinci gecenin hilâlidir (s. 316).',
      kFirst: 'Bu akşam hilâl yatsıdan önce batıyor: Kâdîhân’a göre birinci gecenin hilâlidir (s. 316).',
      mIbni: 'İbni Âbidîn, kıble bahsinde şöyle bildirir: hilâl, hesabın bildirdiği gece doğar; fakat o gece görülmeyip ertesi gece görülebilir. Oruca, hilâlin doğduğu gece değil, görüldüğü gece başlanır (Kongre tebliği, s. 3–4).',
      mDilgan: 'Prof. Hamit Dilgan (İTÜ, 1963): “hilâlin görülmesi imkânı ile, bilfiil görülebilme keyfiyetini birbirinden ayırd etmek gerekir” (Kongre tebliği, s. 5). Program bu yüzden “mümkün” der; “görüldü” demez.',
      mReceb: 'Örnek, Receb 1437: 7 Nisan 2016 akşamı hilâlin görülmesi hesâben yalnız Amerika’nın batısında ve Pasifik’te mümkündü; hiçbir yerde görülmedi. 8 Nisan akşamı görüldü ve ay 9 Nisan’da başladı. Hesâbî en erken gün 8 Nisan’dı: rü’yet bir gün sonra oldu, önce değil (Kongre tebliği, s. 9).',
      mLink: 'Deliller: Rehber → Naklî deliller',
      foot: 'Bu açıklama hesâbî imkânı anlatır. Hesap, ayın başladığı vakti değil, hilâlin görülebileceği geceyi anlamak içindir (s. 360). Hüküm, şahitlik şartlarıyla yetkili makamca verilir (s. 315–316).',
      mid: h => `Bu akşam ay başı rasadı yoktur. Hesâbî hicrî gün: <b>${h}</b>.`, midNext: d => `Sıradaki ay başı rasad gecesi: <b>${d}</b>.`,
      plan: 'Bu geceyi planla'
    },
    en: {
      btn: 'What does this evening mean?', btnShort: 'Explain', title: 'Explanation for this selection',
      head: (d, p) => `Evening of ${d} · ${p}`, monthLine: (m, c) => `Start of ${m} · Conjunction: ${c}`,
      here: 'This evening here', world: 'This evening worldwide', start: 'When does the month begin?', scope: 'Scope and ruling', more: 'Detailed explanation',
      claim: 'Sighting claim', worldCalc: 'Scanning the world…',
      worldNone: 'Tonight the crescent cannot be seen anywhere in the world by calculation. A claim to have seen it tonight is not accepted (p. 360).',
      worldPoss: x => `Regions where it is possible by calculation (elongation 8°–18°): ${x}.`, worldVis: x => `Regions where it is visible (elongation ≥ 18°): ${x}.`,
      worldNote: 'Regions come from a coarse scan (sea level, standard sunset). See the Map tab for detail.',
      th: ['Evening', 'Here', 'Worldwide', 'If the crescent is first seen and established this evening'],
      wNone: 'not possible anywhere', wFirst: 'first possible', wYes: 'possible',
      bMax: 'A month never exceeds thirty days: if the crescent is not seen, the month is completed to thirty and the new month begins 30 days after the established day 1 of the previous month (pp. 314–315).',
      bUnknown: 'The start of the previous month is itself established by sighting or by completing thirty days. The program cannot know which one was established, so every possibility is shown below as a condition. The competent authority decides which holds.',
      thP: ['If the previous month began on', 'Evening of the 29th (watch)', 'If seen and established that evening, day 1', 'If not seen, day 1 (thirty completed)'],
      kind: { comp: () => 'computed earliest day', isik: () => 'Işık method (p. 326)', plus: () => 'one day later by sighting', rec: e => `from your sighting record (evening of ${e})`, user: () => 'your choice' },
      no29: 'the crescent cannot be seen anywhere that evening by calculation', no29Here: 'the crescent cannot be seen at this location that evening by calculation',
      bAll: 'Unknown: show every possibility',
      today: 'Today’s lunar day depends on when the previous month began:',
      ifP: p => `If the previous month began on ${p},`,
      dN: (m, n) => `today is day ${n} of ${m}.`,
      d29: ' This evening is the watch evening.', d29no: ' This evening the crescent cannot be seen anywhere; the month is completed to thirty.', d29noHere: ' This evening the crescent cannot be seen here; the month is completed to thirty.',
      d30: m => ` If the crescent was seen and established last evening, today is day 1 of ${m}.`, d30x: ' The month is completed to thirty; the new month begins this evening.',
      dNew2: (m, a, b) => `today is day ${a} of ${m} (day ${b} if the crescent was not seen on the evening of the 29th).`,
      dNew1: (m, a) => `today is day ${a} of ${m} (the crescent could not be seen on the evening of the 29th, so the month was completed to thirty).`,
      rowsLead: 'Evening by evening: if the crescent is first seen and established that evening',
      cond: (a, b) => `condition: the previous month began on ${a} or ${b} (a month has 29 or 30 days)`,
      fEarly: 'with your chosen start, this evening is before the 29th',
      fReject: 'not accepted (p. 360)', fDay: d => `day 1: ${d}`,
      fOver: d => `if your chosen start is established, the month cannot exceed thirty days; the new month begins on ${d} at the latest`,
      tonight: 'this evening', recSeen: 'your record: seen', recNot: 'your record: not seen',
      basis: m => `Established day 1 of the previous month (${m})`,
      basisNote: 'If you know the start established by the competent authority, choose it; the table and today’s lunar day are narrowed to it. The choice affects only this explanation and is not a ruling.',
      recNote: 'A record is not testimony; what counts is the announcement of the competent authority (pp. 315–316).',
      zhLead: (a, k) => `Where it is not established by witnesses, day 1 of Dhu al-Hijja is found by the Işık method: <b>${a}</b>; the first day of ʿId al-Adha is <b>${k}</b> (p. 326). The ʿId is the calculated day or one day later, never a day earlier (pp. 326, 360).`,
      zhAstro: 'Additional information: astronomical calculation for this location (Dhu al-Hijja is local)',
      thHere: 'If the crescent is first seen and established here this evening',
      bMin: f => `Beginning by sighting may be one day later than what calculation shows, never earlier: day 1 cannot be before <b>${f}</b> (p. 360).`,
      sGlobal: 'Once a sighting is established in one place, it holds everywhere in the world; the book states this explicitly for Ramadan (p. 315). The program uses this scope in every month except Dhu al-Hijja.',
      sRamazan: 'Searching for the Ramadan crescent is a communal obligation (pp. 314–315). In cloudy weather the report of one upright Muslim suffices; in clear weather many people are needed (pp. 315–316).',
      sSevval: 'The ʿId crescent needs two upright witnesses (pp. 315–316). Someone who alone sees the Shawwal crescent may not celebrate ʿId (Majmuʿa-i Zuhdiyya; congress paper, p. 4).',
      sKaza: 'If Ramadan was begun by calendar instead of sighting, make-up fasts are needed after ʿId (pp. 315–316): one day if Shaʿban began by sighting, otherwise two (Hindiyya, Qadikhan; congress paper, p. 7).',
      sHajj: () => 'Hajj, sacrifice and prayer times are local (Radd al-Muhtar; congress paper, pp. 7–8). The Hajj follows the sighting in Mecca; ʿArafa is the calculated day or one day later, never earlier (pp. 344, 360).',
      sDay: 'A crescent seen in daytime belongs to the coming night (p. 315).',
      kSecond: 'This evening the crescent sets after the night prayer time: by Qadikhan it is the crescent of the second night (p. 316).',
      kFirst: 'This evening the crescent sets before the night prayer time: by Qadikhan it is the crescent of the first night (p. 316).',
      mIbni: 'Ibn ʿAbidin, in the chapter on the qibla: the crescent is born on the night calculation shows, but it may not be seen that night and be seen the next. Fasting begins on the night it is seen, not the night it is born (congress paper, pp. 3–4).',
      mDilgan: 'Prof. Hamit Dilgan (ITU, 1963): the possibility of seeing the crescent must be kept apart from its actual sighting (congress paper, p. 5). This is why the program says “possible”, never “seen”.',
      mReceb: 'Example, Rajab 1437: on the evening of 7 April 2016 the crescent was possible by calculation only in the western Americas and the Pacific; it was not seen anywhere. It was seen on 8 April and the month began on 9 April. The computed earliest day was 8 April: the sighting came one day later, not earlier (congress paper, p. 9).',
      mLink: 'Evidence: Guide → Textual evidence',
      foot: 'This explanation describes calculated possibility. Calculation is for knowing the night on which the crescent can be seen, not the time the month begins (p. 360). The ruling is given by the competent authority under the conditions of testimony (pp. 315–316).',
      mid: h => `There is no month-start watch this evening. Computed Hijri day: <b>${h}</b>.`, midNext: d => `Next month-start watch night: <b>${d}</b>.`,
      plan: 'Plan this night'
    }
  };

  // Seçili akşamın dünya özeti: her bölgede en iyi sınıf
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

  // Açıklamanın verisi (arayüzden bağımsız; testlerde de kullanılır)
  function data(X, ymd, baseYmd) {
    const { C, CAL, A } = X;
    const conj = C.nearestNewMoon(C.solarNoon(ymd, X.loc.lon));
    const cd = conj.date, conjYmd = X.ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
    const hm = CAL.monthForConjunction(conj.date), hajj = hm.m === 12;
    const eG = X.earliest(conj, null), eL = X.earliest(conj, [[X.loc.lat, X.loc.lon]]);
    const eRef = hajj ? eL : eG;
    const E = eRef ? X.ymdOf(eRef.evening) : null, Fmin = eRef ? X.ymdOf(eRef.first) : null;
    const Ew = eG ? X.ymdOf(eG.evening) : E;   // dünya sütunu her ay küresel taramaya göredir
    // önceki ayın 1. günü: hesâbî (veya Işık), bir gün sonrası, rü'yet kaydı, kullanıcının seçimi
    const pc = C.lastNewMoonBefore(conj.AddDays(-2)), phm = CAL.monthForConjunction(pc.date);
    let P0 = null, isik = false;
    if (phm.m === 12) { const ik = CAL.methods(phm.y, 12).isik; if (ik) { P0 = X.ymdOf(ik); isik = true; } }
    if (!P0) { const pe = X.earliest(pc, phm.m === 12 ? [[X.loc.lat, X.loc.lon]] : null); P0 = pe ? X.ymdOf(pe.first) : null; }
    const opts = [];
    if (P0) { opts.push({ v: P0, k: isik ? 'isik' : 'comp' }); opts.push({ v: X.addDays(P0, 1), k: 'plus' }); }
    const peG = X.earliest(pc, null), pE = peG ? X.ymdOf(peG.evening) : P0;
    const seen = (X.records || []).filter(r => r && r.observation && ['naked', 'aidedNaked'].includes(r.observation.result) && !(r.computed && r.computed.evalClass === 'p-bad'));
    const prevRec = pE ? seen.map(r => r.observation.evening).filter(e => e >= X.addDays(pE, -1) && e <= X.addDays(pE, 3)).sort()[0] : null;
    if (prevRec) { const v = X.addDays(prevRec, 1); const o = opts.find(x => x.v === v); if (o) Object.assign(o, { k: 'rec', ev: prevRec }); else opts.push({ v, k: 'rec', ev: prevRec }); }
    if (baseYmd && !opts.some(o => o.v === baseYmd)) opts.push({ v: baseYmd, k: 'user' });
    // Önceki ayın başı rü'yetle veya otuza tamamlamayla sabit olur; program bunu bilemez. Hiçbir başlangıç varsayılmaz:
    // her aday (hesâbî en erken gün, bir gün sonrası, kullanıcının kaydı, kullanıcının seçimi) şartlı olarak gösterilir.
    const P = baseYmd || null;
    const cands = opts.map(o => { const X29 = X.addDays(o.v, 28); return Object.assign({}, o, { X29, F29: X.addDays(o.v, 29), F30: X.addDays(o.v, 30), can29: !!E && E <= X29 }); });
    const X29 = P ? X.addDays(P, 28) : null, F29 = P ? X.addDays(P, 29) : null, F30 = P ? X.addDays(P, 30) : null;
    const lastF30 = cands.reduce((m, c) => c.F30 > m ? c.F30 : m, F30 || X.addDays(conjYmd, 4));
    // ay başı dönemi mi?
    const lo = X.addDays(conjYmd, -1), hi = lastF30;
    const inWin = ymd >= lo && ymd <= hi;
    // akşam tablosu: hilâl ilk kez o akşam görülüp sabit olursa 1. gün ertesi gündür; bunun şartı önceki ayın
    // o akşamdan 28 veya 29 gün önce başlamış olmasıdır (ay 29 veya 30 gündür).
    const rows = [];
    if (inWin && E) {
      let y0 = X.addDays(E, -1); if (y0 < lo) y0 = lo; if (ymd < y0) y0 = ymd;
      let y1 = X.addDays(E, 2); for (const c of cands) if (c.F29 > y1) y1 = c.F29; if (ymd > y1) y1 = ymd;
      for (let y = y0, i = 0; y <= y1 && i < 6; y = X.addDays(y, 1), i++) {
        const r = X.evening(y);
        const recs = (X.records || []).filter(x => x && x.observation && x.observation.evening === y);
        const rec = recs.some(x => ['naked', 'aidedNaked'].includes(x.observation.result)) ? 'seen' : recs.some(x => x.observation.result === 'not') ? 'not' : null;
        const world = !Ew || y < Ew ? 'none' : y === Ew ? 'first' : 'yes';
        const pA = X.addDays(y, -29), pB = X.addDays(y, -28);   // bu akşam 30. veya 29. gün akşamı olacak başlangıçlar
        let first = y < E ? 'reject' : 'day';
        if (first === 'day' && P) first = P < pA ? 'over' : P > pB ? 'early' : 'day';
        rows.push({ ymd: y, r, world, first, firstDay: X.addDays(y, 1), pA, pB, rec, tonight: y === ymd });
      }
    }
    const nOf = v => Math.round((X.civil(ymd) - X.civil(v)) / 86400000) + 1;
    const n = P ? nOf(P) : null;
    for (const c of cands) c.n = nOf(c.v);
    return { ymd, conj, conjYmd, hm, hajj, E, Fmin, eG, eL, P, P0, opts, cands, prevRec, phm, X29, F29, F30, rows, inWin, n, isikZh: hajj ? CAL.methods(hm.y, 12).isik : null };
  }

  function html(X, d, L) {
    const s = S[L] || S.tr, esc = X.esc, f = y => esc(X.fmtCivil(X.civil(y)));
    const mn = m => X.monthName(m);
    const r = X.evening(d.ymd);
    let h = `<p class="exhead"><b>${esc(s.head(X.fmtCivil(X.civil(d.ymd)), X.placeName()))}</b><br><span class="small">${esc(s.monthLine(`${mn(d.hm.m)} ${d.hm.y}`, X.fmtDT(d.conj)))}</span></p>`;
    if (!d.inWin) {
      const hj = X.hijriOf(d.ymd); const nx = X.nextRasad(d.ymd);
      h = `<p class="exhead"><b>${esc(s.head(X.fmtCivil(X.civil(d.ymd)), X.placeName()))}</b></p><p>${s.mid(esc(hj ? hj.plain : '—'))}</p>`;
      if (nx && nx.a) h += `<p>${s.midNext(f(nx.a.ymd))} <button class="btn" type="button" data-explan="${nx.a.ymd}">${esc(s.plan)}</button> <button class="btn" type="button" data-ex="${nx.a.ymd}">ⓘ ${esc(s.btn)}</button></p>`;
      return h + `<p class="cap">${esc(s.foot)}</p>`;
    }
    // 1. burada
    if (r && r.ok) {
      const [title, sub] = X.clsText(r), [claim, cc] = X.claimOf(r);
      h += `<h3>${esc(s.here)}</h3><p><b>${esc(title)}</b> ${X.q(X.clsTopic(r))}<br><span class="small">${esc(sub)}</span></p><p><span class="small">${esc(s.claim)}:</span> <span class="pill ${cc}">${esc(claim)}</span></p>`;
    }
    // 2. dünyada (sonradan doldurulur)
    h += `<h3>${esc(s.world)}</h3><div id="exWorld"><p class="small">${esc(s.worldCalc)}</p></div>`;
    // 3. ay başı: alt sınır (s. 360), üst sınır (otuza tamamlama, s. 314–315), önceki ayın başına göre şartlı ihtimaller
    h += `<h3>${esc(s.start)}</h3>`;
    if (d.hajj && d.isikZh) h += `<p>${s.zhLead(f(X.ymdOf(d.isikZh)), f(X.ymdOf(new Date(d.isikZh.getTime() + 9 * 86400000))))}</p><p class="lab">${esc(s.zhAstro)}</p>`;
    const li = [];
    if (d.Fmin) li.push(s.bMin(f(d.Fmin)));
    li.push(esc(s.bMax));
    li.push(esc(s.bUnknown));
    h += `<ul class="exlist">${li.map(x => `<li>${x}</li>`).join('')}</ul>`;
    const kindL = o => esc(s.kind[o.k] ? s.kind[o.k](o.ev ? X.fmtCivil(X.civil(o.ev)) : '') : '');
    if (d.cands.length) {
      const no29 = d.hajj ? s.no29Here : s.no29;
      h += `<div class="extab"><table><thead><tr>${s.thP.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>` + d.cands.map(c =>
        `<tr${c.v === d.P ? ' class="now"' : ''}><td><b>${f(c.v)}</b><br><span class="small">${kindL(c)}</span></td><td>${f(c.X29)}${c.can29 ? '' : `<br><span class="small">${esc(no29)}</span>`}</td><td>${c.can29 ? `<b>${f(c.F29)}</b>` : `<span class="pill p-bad">${esc(s.fReject)}</span>`}</td><td><b>${f(c.F30)}</b></td></tr>`).join('') + `</tbody></table></div>`;
      const ok = d.P && d.cands.find(c => c.v === d.P);
      h += `<div class="field exbasis"><label for="exBase">${esc(s.basis(`${mn(d.phm.m)} ${d.phm.y}`))}</label><select id="exBase"><option value=""${d.P ? '' : ' selected'}>${esc(s.bAll)}</option>${d.cands.map(c => `<option value="${c.v}"${c.v === d.P ? ' selected' : ''}>${esc(X.fmtCivil(X.civil(c.v)))}: ${kindL(c)}</option>`).join('')}</select><p class="cap">${esc(s.basisNote)}${d.prevRec ? ' ' + esc(s.recNote) : ''}</p></div>`;
      // bugünün kamerî günü: her başlangıca göre şartlı
      const pm = esc(mn(d.phm.m)), nm = esc(mn(d.hm.m));
      const dayTxt = c => {
        const n = c.n; if (n < 1) return null;
        if (n <= 28) return s.dN(pm, n);
        if (n === 29) return s.dN(pm, 29) + (c.can29 ? s.d29 : (d.hajj ? s.d29noHere : s.d29no));
        if (n === 30) return s.dN(pm, 30) + (c.can29 ? s.d30(nm) : s.d30x);
        return c.can29 ? s.dNew2(nm, n - 29, n - 30) : s.dNew1(nm, n - 30);
      };
      const list = (ok ? [ok] : d.cands).map(c => { const tx = dayTxt(c); return tx ? `<li>${s.ifP(f(c.v))} ${tx}</li>` : ''; }).join('');
      if (list) h += `<p>${esc(s.today)}</p><ul class="exlist">${list}</ul>`;
    }
    if (d.rows.length) {
      const cls = rw => rw.r && rw.r.ok ? `${esc(X.clsText(rw.r)[0])}<br><span class="small">${esc(X.clsText(rw.r)[1])}</span>` : '—';
      const wtx = { none: s.wNone, first: s.wFirst, yes: s.wYes };
      const th = d.hajj ? [s.th[0], s.th[1], s.th[2], s.thHere] : s.th;
      h += `<p class="lab">${esc(s.rowsLead)}</p><div class="extab"><table><thead><tr>${th.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>` + d.rows.map(rw => {
        const cond = `<br><span class="small">${esc(s.cond(X.fmtCivil(X.civil(rw.pA)), X.fmtCivil(X.civil(rw.pB))))}</span>`;
        const ft = rw.first === 'reject' ? `<span class="pill p-bad">${esc(s.fReject)}</span>`
          : rw.first === 'over' ? `<span class="small">${esc(s.fOver(X.fmtCivil(X.civil(d.F30))))}</span>`
          : rw.first === 'early' ? `<span class="small">${esc(s.fEarly)}</span>`
          : `<b>${esc(s.fDay(X.fmtCivil(X.civil(rw.firstDay))))}</b>${d.P ? '' : cond}`;
        const rec = rw.rec ? `<br><span class="small">${esc(rw.rec === 'seen' ? s.recSeen : s.recNot)}</span>` : '';
        return `<tr${rw.tonight ? ' class="now"' : ''}><td><button class="lnk" type="button" data-explan="${rw.ymd}">${esc(X.fmtCivil(X.civil(rw.ymd), true))}</button>${rw.tonight ? `<br><span class="small">${esc(s.tonight)}</span>` : ''}${rec}</td><td><span class="dot" style="background:${X.clsColor(rw.r)}"></span>${cls(rw)}</td><td>${esc(wtx[rw.world])}</td><td>${ft}</td></tr>`;
      }).join('') + `</tbody></table></div>`;
    }
    // 4. kapsam ve hüküm
    const sc = [];
    if (d.hajj) sc.push(esc(s.sHajj()));
    else sc.push(esc(s.sGlobal));
    if (d.hm.m === 9) sc.push(esc(s.sRamazan));
    if (d.hm.m === 10) { sc.push(esc(s.sSevval)); sc.push(esc(s.sKaza)); }
    sc.push(esc(s.sDay));
    if (r && r.ok && r.kadihan19 && r.cls.code !== 'midMonth' && !r.cls.reject) sc.push(esc(r.kadihan19 === 'second' ? s.kSecond : s.kFirst));
    h += `<h3>${esc(s.scope)}</h3><ul class="exlist">${sc.map(x => `<li>${x}</li>`).join('')}</ul>`;
    // 5. ayrıntı
    const more = `<p>${esc(s.mIbni)}</p><p>${esc(s.mDilgan)}</p><p>${esc(s.mReceb)}</p><p>${esc(s.mLink)} ${X.q('nakli')}</p>`;
    h += X.long ? `<h3>${esc(s.more)}</h3>${more}` : `<details class="tmore"><summary>${esc(s.more)}</summary>${more}</details>`;
    return h + `<p class="cap">${esc(s.foot)}</p>`;
  }

  // Dünya kısmı: tarama bitince doldurulur
  function worldHtml(X, d, L) {
    const s = S[L] || S.tr, reg = regions(X.C, d.conj, d.ymd);
    const nm = x => L === 'tr' ? x.tr : x.en;
    const vis = reg.filter(x => x.best === 'visible').map(nm), poss = reg.filter(x => x.best === 'possible').map(nm);
    if (!vis.length && !poss.length) return `<p>${X.esc(s.worldNone)}</p>`;
    return (poss.length ? `<p>${X.esc(s.worldPoss(poss.join(', ')))}</p>` : '') + (vis.length ? `<p>${X.esc(s.worldVis(vis.join(', ')))}</p>` : '') + `<p class="cap">${X.esc(s.worldNote)}</p>`;
  }

  G.HRExplain = { S, data, html, worldHtml, regions };
})(typeof globalThis !== 'undefined' ? globalThis : window);
