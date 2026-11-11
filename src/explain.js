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
      fReject: 'kabul edilmez (s. 360)', fDay: d => `1. gün ${d}`, fDone: d => `1. gün ${d}; görülmese de ay otuza tamamlanır`,
      fOver: d => `seçilen başlangıca göre ay ${d} günü otuza tamamlanarak başlamıştır`,
      tonight: 'bu akşam', recSeen: 'kaydınız: görüldü', recNot: 'kaydınız: görülmedi',
      basis: m => `Önceki ayın (${m}) 1. günü`,
      bComp: d => `${d}: hesâbî en erken gün (programın gösterimi)`, bPlus: d => `${d}: rü’yetle bir gün sonra başlamışsa`,
      bIsik: d => `${d}: Işık usulü (s. 326)`, bRec: (d, e) => `${d}: rü’yet kaydınıza göre (${e} akşamı görüldü)`, bUser: d => `${d}: sizin seçiminiz`,
      basisNote: 'Önceki ayın başı da rü’yete bağlıdır. Sabit olan başlangıcı biliyorsanız buradan seçin; seçim yalnız bu açıklamayı etkiler.',
      recNote: 'Kayıt şahitlik değildir; esas olan yetkili makamın ilanıdır (s. 315–316).',
      b29: (x, f) => `Rasad akşamı ayın 29. gününün akşamıdır: <b>${x}</b>. O akşam hilâl görülüp sabit olursa yeni ayın 1. günü <b>${f}</b> olur.`,
      b29no: x => `<b>${x}</b> (29. gün) akşamı hilâl hiçbir yerde hesâben görülemez; görüldü denirse kabul edilmez (s. 360).`,
      b29noHere: x => `<b>${x}</b> (29. gün) akşamı hilâl bu yerde hesâben görülemez; burada görüldü denirse kabul edilmez (s. 360).`,
      zhLead: (a, k) => `Şahitle sabit olmayan yerlerde Zilhiccenin 1. günü Işık usulüyle bulunur: <b>${a}</b>; Kurban bayramının 1. günü <b>${k}</b> (s. 326). Bayram bu hesapla bulunan gündür yahut bir gün sonradır; bir gün evvel olamaz (s. 326, 360).`,
      zhAstro: 'Ek bilgi: bu yerin astronomik hesabı (Zilhicce mahallîdir)',
      thHere: 'Hilâl ilk kez bu akşam burada görülüp sabit olursa',
      b30: f => `Görülmezse ay otuza tamamlanır; yeni ayın 1. günü <b>${f}</b> olur (s. 314–315).`,
      bMin: f => `Rü’yetle başlama hesapla anlaşılandan bir gün sonra olabilir, önce olamaz: 1. gün <b>${f}</b> tarihinden önce olamaz (s. 360).`,
      bConflict: (f30, fmin) => `Seçilen başlangıçla ay otuza tamamlandığında 1. gün (${f30}), hesâben mümkün en erken günden (${fmin}) önce kalıyor. Önceki ayın başı muhtemelen daha geçtir; yukarıdan değiştirin.`,
      rel: (n, m) => `Seçilen başlangıca göre bu gün ${m} ayının <b>${n}.</b> günüdür; bu akşam ${n + 1}. gecesi başlar.`,
      relDay: (n, m) => `Seçilen başlangıca göre bu gün ${m} ayının <b>${n}.</b> günüdür.`,
      rel29: ' Bu akşam rasad akşamıdır.',
      rel30: ' Dün akşam hilâl görülüp sabit olduysa bugün yeni ayın 1. günüdür; görülmediyse bugün otuzuncu gündür ve yeni ay bu akşam başlar.',
      rel30x: ' Dün akşam (29. gün) hilâl hiçbir yerde görülemeyeceği için ay otuza tamamlanır; yeni ay bu akşam başlar.',
      rel30xHere: ' Dün akşam (29. gün) hilâl bu yerde görülemeyeceği için ay otuza tamamlanır; yeni ay bu akşam başlar.',
      relNew: (a, b, m) => `Seçilen başlangıca göre bu gün ${m} ayının <b>${a}.</b> günüdür (29. akşam görülmediyse ${b}. günü).`,
      relNew1: (a, m) => `Seçilen başlangıca göre bu gün ${m} ayının <b>${a}.</b> günüdür: 29. akşam hilâl hiçbir yerde görülemeyeceği için önceki ay otuza tamamlanmıştır.`,
      relNew1Here: (a, m) => `Seçilen başlangıca göre bu gün ${m} ayının <b>${a}.</b> günüdür: 29. akşam hilâl bu yerde görülemeyeceği için önceki ay otuza tamamlanmıştır.`,
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
      fReject: 'not accepted (p. 360)', fDay: d => `day 1: ${d}`, fDone: d => `day 1: ${d}; even if not seen, the month is completed to thirty`,
      fOver: d => `with the chosen start, the month has already begun on ${d} by completing thirty days`,
      tonight: 'this evening', recSeen: 'your record: seen', recNot: 'your record: not seen',
      basis: m => `Day 1 of the previous month (${m})`,
      bComp: d => `${d}: computed earliest day (shown by the program)`, bPlus: d => `${d}: if it began by sighting one day later`,
      bIsik: d => `${d}: Işık method (p. 326)`, bRec: (d, e) => `${d}: from your sighting record (seen on the evening of ${e})`, bUser: d => `${d}: your choice`,
      basisNote: 'The start of the previous month also depends on sighting. If you know the established start, choose it here; the choice affects only this explanation.',
      recNote: 'A record is not testimony; what counts is the announcement of the competent authority (pp. 315–316).',
      b29: (x, f) => `The watch evening is the evening of the 29th: <b>${x}</b>. If the crescent is seen and established that evening, day 1 of the new month is <b>${f}</b>.`,
      b29no: x => `On the evening of <b>${x}</b> (the 29th) the crescent cannot be seen anywhere by calculation; a claim to have seen it is not accepted (p. 360).`,
      b29noHere: x => `On the evening of <b>${x}</b> (the 29th) the crescent cannot be seen at this location by calculation; a claim to have seen it here is not accepted (p. 360).`,
      zhLead: (a, k) => `Where it is not established by witnesses, day 1 of Dhu al-Hijja is found by the Işık method: <b>${a}</b>; the first day of ʿId al-Adha is <b>${k}</b> (p. 326). The ʿId is the calculated day or one day later, never a day earlier (pp. 326, 360).`,
      zhAstro: 'Additional information: astronomical calculation for this location (Dhu al-Hijja is local)',
      thHere: 'If the crescent is first seen and established here this evening',
      b30: f => `If it is not seen, the month is completed to thirty days; day 1 of the new month is <b>${f}</b> (pp. 314–315).`,
      bMin: f => `Beginning by sighting may be one day later than what calculation shows, never earlier: day 1 cannot be before <b>${f}</b> (p. 360).`,
      bConflict: (f30, fmin) => `With the chosen start, completing the month to thirty gives day 1 = ${f30}, which is before the earliest possible day by calculation (${fmin}). The previous month probably began later; change it above.`,
      rel: (n, m) => `With the chosen start, today is day <b>${n}</b> of ${m}; this evening night ${n + 1} begins.`,
      relDay: (n, m) => `With the chosen start, today is day <b>${n}</b> of ${m}.`,
      rel29: ' This evening is the watch evening.',
      rel30: ' If the crescent was seen and established last evening, today is day 1 of the new month; if not, today is the thirtieth and the new month begins this evening.',
      rel30x: ' Since the crescent could not be seen anywhere last evening (the 29th), the month is completed to thirty; the new month begins this evening.',
      rel30xHere: ' Since the crescent could not be seen here last evening (the 29th), the month is completed to thirty; the new month begins this evening.',
      relNew: (a, b, m) => `With the chosen start, today is day <b>${a}</b> of ${m} (day ${b} if it was not seen on the 29th evening).`,
      relNew1: (a, m) => `With the chosen start, today is day <b>${a}</b> of ${m}: the crescent could not be seen anywhere on the 29th evening, so the previous month was completed to thirty.`,
      relNew1Here: (a, m) => `With the chosen start, today is day <b>${a}</b> of ${m}: the crescent could not be seen here on the 29th evening, so the previous month was completed to thirty.`,
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
    const P = baseYmd || (prevRec ? X.addDays(prevRec, 1) : P0);
    const X29 = P ? X.addDays(P, 28) : null, F29 = P ? X.addDays(P, 29) : null, F30 = P ? X.addDays(P, 30) : null;
    // ay başı dönemi mi?
    const lo = X.addDays(conjYmd, -1), hi = F30 || X.addDays(conjYmd, 4);
    const inWin = ymd >= lo && ymd <= hi;
    // akşam tablosu: E−1 … P+29 (ve seçili akşam)
    const rows = [];
    if (inWin && E) {
      let y0 = X.addDays(E, -1); if (y0 < lo) y0 = lo; if (ymd < y0) y0 = ymd;
      let y1 = F29 && F29 > E ? F29 : X.addDays(E, 1); if (ymd > y1) y1 = ymd;
      for (let y = y0, i = 0; y <= y1 && i < 6; y = X.addDays(y, 1), i++) {
        const r = X.evening(y);
        const recs = (X.records || []).filter(x => x && x.observation && x.observation.evening === y);
        const rec = recs.some(x => ['naked', 'aidedNaked'].includes(x.observation.result)) ? 'seen' : recs.some(x => x.observation.result === 'not') ? 'not' : null;
        const world = !Ew || y < Ew ? 'none' : y === Ew ? 'first' : 'yes';
        const first = y < E ? 'reject' : (F29 && y === F29) ? 'done' : (F29 && y > F29) ? 'over' : 'day';
        rows.push({ ymd: y, r, world, first, firstDay: X.addDays(y, 1), rec, tonight: y === ymd });
      }
    }
    const n = P ? Math.round((X.civil(ymd) - X.civil(P)) / 86400000) + 1 : null;
    return { ymd, conj, conjYmd, hm, hajj, E, Fmin, eG, eL, P, P0, opts, prevRec, phm, X29, F29, F30, rows, inWin, n, isikZh: hajj ? CAL.methods(hm.y, 12).isik : null };
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
    // 3. ay başı
    h += `<h3>${esc(s.start)}</h3>`;
    if (d.opts.length) {
      const lab = o => o.k === 'comp' ? s.bComp(X.fmtCivil(X.civil(o.v))) : o.k === 'plus' ? s.bPlus(X.fmtCivil(X.civil(o.v))) : o.k === 'isik' ? s.bIsik(X.fmtCivil(X.civil(o.v))) : o.k === 'rec' ? s.bRec(X.fmtCivil(X.civil(o.v)), X.fmtCivil(X.civil(o.ev))) : s.bUser(X.fmtCivil(X.civil(o.v)));
      h += `<div class="field exbasis"><label for="exBase">${esc(s.basis(`${mn(d.phm.m)} ${d.phm.y}`))}</label><select id="exBase">${d.opts.map(o => `<option value="${o.v}"${o.v === d.P ? ' selected' : ''}>${esc(lab(o))}</option>`).join('')}</select><p class="cap">${esc(s.basisNote)}${d.prevRec ? ' ' + esc(s.recNote) : ''}</p></div>`;
    }
    if (d.hajj && d.isikZh) h += `<p>${s.zhLead(f(X.ymdOf(d.isikZh)), f(X.ymdOf(new Date(d.isikZh.getTime() + 9 * 86400000))))}</p><p class="lab">${esc(s.zhAstro)}</p>`;
    if (d.n != null && d.n >= 1) {
      const pm = esc(mn(d.phm.m)), nm = esc(mn(d.hm.m)), can29 = d.E && d.X29 && d.E <= d.X29;
      if (d.n <= 28) h += `<p>${s.rel(d.n, pm)}</p>`;
      else if (d.n === 29) h += `<p>${s.rel(29, pm)}${can29 ? s.rel29 : ''}</p>`;
      else if (d.n === 30) h += `<p>${s.relDay(30, pm)}${can29 ? s.rel30 : d.hajj ? s.rel30xHere : s.rel30x}</p>`;
      else h += `<p>${can29 ? s.relNew(d.n - 29, d.n - 30, nm) : (d.hajj ? s.relNew1Here : s.relNew1)(d.n - 30, nm)}</p>`;
    }
    const li = [];
    if (d.X29 && d.E) {
      if (d.E <= d.X29) li.push(s.b29(f(d.X29), f(d.F29))); else li.push((d.hajj ? s.b29noHere : s.b29no)(f(d.X29)));
      li.push(s.b30(f(d.F30)));
    }
    if (d.Fmin) li.push(s.bMin(f(d.Fmin)));
    if (d.F30 && d.Fmin && d.F30 < d.Fmin) li.push(`<span class="flag">${esc(s.bConflict(X.fmtCivil(X.civil(d.F30)), X.fmtCivil(X.civil(d.Fmin))))}</span>`);
    h += `<ul class="exlist">${li.map(x => `<li>${x}</li>`).join('')}</ul>`;
    if (d.rows.length) {
      const cls = rw => rw.r && rw.r.ok ? esc(X.clsText(rw.r)[0]) : '—';
      const wtx = { none: s.wNone, first: s.wFirst, yes: s.wYes };
      const th = d.hajj ? [s.th[0], s.th[1], s.th[2], s.thHere] : s.th;
      h += `<div class="extab"><table><thead><tr>${th.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>` + d.rows.map(rw => {
        const ft = rw.first === 'reject' ? `<span class="pill p-bad">${esc(s.fReject)}</span>` : rw.first === 'done' ? `<b>${esc(s.fDone(X.fmtCivil(X.civil(rw.firstDay))))}</b>` : rw.first === 'over' ? `<span class="small">${esc(s.fOver(X.fmtCivil(X.civil(d.F30))))}</span>` : `<b>${esc(s.fDay(X.fmtCivil(X.civil(rw.firstDay))))}</b>`;
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
