/* Arayüz: Plan · Harita · Saha · Rehber · Doğrulama
 * Ortak zaman modeli: st.date (seçili saat dilimindeki yerel tarih) + st.tmin (o günün 00:00’ından dakika, 0–1620).
 * Tüm görünümler aynı seçili ânı kullanır; tercihler (karanlık eşiği, saat gösterimi) değişince ilgili tüm alanlar yeniden çizilir. */
(function (G) {
  'use strict';
  const A = G.Astronomy, C = G.HRCore, CAL = G.HRCal, I = G.HRI18N, ON = G.HROnline;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---- Yayın bildirimi ve bütünlük denetimi (build.py ile eş) ----
  // Bildirim dört parçaya bölünüp şifreli olarak farklı modüllere gömülüdür; modül betiğinin özeti açılışta yeniden hesaplanır.
  const SELF = (document.currentScript && document.currentScript.textContent) || '';
  const Q4 = '@@N4@@', DIG = 'HRD0000000000000000';
  function fnv2(s) {
    let h1 = 0x811c9dc5, h2 = 0x050c5d1f;
    for (let i = 0; i < s.length; i++) { const u = s.charCodeAt(i); h1 = Math.imul(h1 ^ u, 0x01000193); h2 = Math.imul(h2 ^ (u + 0x3f), 0x01000193); }
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  }
  const NOTICE = (() => {
    try {
      const rv = s => s.split('').reverse().join(''), b = atob(C.Q + rv(CAL.Q) + G.HRStarMap.Q + rv(Q4)), out = new Uint8Array(b.length);
      let x = 0x6D61684E >>> 0;
      for (let i = 0; i < b.length; i++) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; out[i] = b.charCodeAt(i) ^ ((x + i * 0x9E37) & 0xff); }
      const n = JSON.parse(new TextDecoder().decode(out)); return n && n.u ? n : null;
    } catch (e) { return null; }
  })();
  const OFFICIAL = !SELF ? null : !!NOTICE && fnv2(SELF.replace(DIG, 'HRD' + '0'.repeat(16))) === DIG.slice(3);
  const HOME = (NOTICE && NOTICE.u) || ['https:/', 'github.com', 'bemiroglu', 'MahiNev'].join('/');

  const CITIES = [
    { id: 'istanbul', tr: 'İstanbul', en: 'Istanbul', lat: 41.0082, lon: 28.9784, elev: 40, hMax: 267, tz: 'Europe/Istanbul' },
    { id: 'ankara', tr: 'Ankara', en: 'Ankara', lat: 39.9334, lon: 32.8597, elev: 938, hMax: 0, tz: 'Europe/Istanbul' },
    { id: 'izmir', tr: 'İzmir', en: 'Izmir', lat: 38.4237, lon: 27.1428, elev: 20, hMax: 0, tz: 'Europe/Istanbul' },
    { id: 'kayseri', tr: 'Kayseri', en: 'Kayseri', lat: 38.72, lon: 35.49, elev: 1054, hMax: 0, tz: 'Europe/Istanbul' },
    { id: 'mekke', tr: 'Mekke', en: 'Mecca', lat: 21.4225, lon: 39.8262, elev: 277, hMax: 0, tz: 'Asia/Riyadh' },
    { id: 'medine', tr: 'Medîne', en: 'Medina', lat: 24.4672, lon: 39.6111, elev: 608, hMax: 0, tz: 'Asia/Riyadh' },
    { id: 'kahire', tr: 'Kâhire', en: 'Cairo', lat: 30.0444, lon: 31.2357, elev: 23, hMax: 0, tz: 'Africa/Cairo' },
    { id: 'karaci', tr: 'Karaçi', en: 'Karachi', lat: 24.8607, lon: 67.0011, elev: 10, hMax: 0, tz: 'Asia/Karachi' },
    { id: 'cakarta', tr: 'Cakarta', en: 'Jakarta', lat: -6.2088, lon: 106.8456, elev: 8, hMax: 0, tz: 'Asia/Jakarta' },
    { id: 'berlin', tr: 'Berlin', en: 'Berlin', lat: 52.52, lon: 13.405, elev: 34, hMax: 0, tz: 'Europe/Berlin' },
    { id: 'londra', tr: 'Londra', en: 'London', lat: 51.5074, lon: -0.1278, elev: 11, hMax: 0, tz: 'Europe/London' },
    { id: 'newyork', tr: 'New York', en: 'New York', lat: 40.7128, lon: -74.006, elev: 10, hMax: 0, tz: 'America/New_York' },
    { id: 'sikago', tr: 'Şikago', en: 'Chicago', lat: 41.8781, lon: -87.6298, elev: 181, hMax: 0, tz: 'America/Chicago' }
  ];
  const MECCA = [21.4225, 39.8262];
  const TB_MAX = 1620; // 00:00 → ertesi gün 03:00
  const DEF = { lang: 'tr', theme: 'auto', city: 'istanbul', lat: 41.0082, lon: 28.9784, elev: 40, hObs: 0, hMax: 267, tz: 'Europe/Istanbul', date: null,
    mapLayer: 'seadet', mapRes: 3, mapAge: true, mapBorders: true, map18: true, mapMode: 'evening', mapLand: false,
    darkKey: 'gurub', timeFmt: 'local', nightKind: 'A', fontSize: 1, wx: false, webFonts: false, safetyOff: false, detail: 'short', layout: 'sade', fold: null, autoLoc: true, liveInt: 10, recName: '', recContact: '', explain: true, introDone: false };
  const old = load('hr-v05') || Object.assign(load('hr-v04') || load('hr-v03') || load('hr-v02') || {}, { wx: false }); // hava tahmini başlangıçta kapalı
  const st = Object.assign({}, DEF, old);
  st.tmin = null; st.anchor = null; st.live = true; st.frozen = false; st.locAuto = false;
  st.date = todayYmd(st.tz); // açılışta her zaman içinde bulunulan an
  let t = I.T[st.lang];
  let R = null, LOC = null, DAY = null;
  let records = load('hr-records') || [];
  const REC_WARN = 150; // sınır yok; bu sayıdan sonra yedek alma hatırlatılır

  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function save() { try { const o = Object.assign({}, st); delete o.tmin; delete o.anchor; delete o.live; delete o.frozen; delete o.locAuto; localStorage.setItem('hr-v05', JSON.stringify(o)); } catch (e) { /* depolama yok */ } }
  // kayıt saklama başarısı denetlenir; başarısızlık sessiz geçilmez
  function storeRecs(list) { try { localStorage.setItem('hr-records', JSON.stringify(list)); return true; } catch (e) { return false; } }
  function saveRec() { const ok = storeRecs(records); if (!ok && typeof toast === 'function') toast(t.recStoreFail, 8000); return ok; }
  function todayYmd(tz) { try { return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  const locale = () => st.lang === 'tr' ? 'tr-TR' : 'en-GB';
  function fmtTime(at) { if (!at) return t.none; return new Intl.DateTimeFormat(locale(), { timeZone: st.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(at.date); }
  const hhmm = at => at ? fmtTime(at).slice(0, 5) : t.none;
  function fmtDT(at) { if (!at) return t.none; return new Intl.DateTimeFormat(locale(), { timeZone: st.tz, day: 'numeric', month: 'short', year: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(at.date); }
  function fmtUTC(at) { return at ? at.date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC' : ''; }
  const utcSub = at => st.timeFmt === 'both' ? fmtUTC(at) : '';
  function fmtCivil(d, short) { return d ? new Intl.DateTimeFormat(locale(), short ? { timeZone: 'UTC', day: 'numeric', month: 'short', weekday: 'short' } : { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).format(d) : t.none; }
  const num = (x, n = 2) => x == null || !isFinite(x) ? t.none : x.toLocaleString(locale(), { minimumFractionDigits: n, maximumFractionDigits: n });
  const degf = (x, n = 2) => x == null ? t.none : num(x, n) + '°';
  function hm(mins) { if (mins == null) return t.none; const s = mins < 0 ? '−' : ''; mins = Math.abs(mins); const h = Math.floor(mins / 60), m = Math.round(mins % 60); return h ? `${s}${h} ${t.h} ${m} ${t.min}` : `${s}${m} ${t.min}`; }
  function ageTxt(h) { if (h == null) return t.none; const d = Math.floor(h / 24); const r = h - d * 24; return d ? `${d} ${t.d} ${num(r, 1)} ${t.h}` : `${num(h, 1)} ${t.h}`; }
  const ymdOf = d => d.toISOString().slice(0, 10);
  const civil = ymd => new Date(ymd + 'T00:00:00Z');
  const addDays = (ymd, k) => { const d = civil(ymd); d.setUTCDate(d.getUTCDate() + k); return ymdOf(d); };
  const monthName = m => I.MONTHS[st.lang][m - 1];
  const q = id => `<button class="q" type="button" data-topic="${id}" aria-label="${esc(t.help)}">?</button>`;
  const dayStart = () => C.tzMidnight(st.date, st.tz);
  const selT = () => A.MakeTime(new Date(dayStart() + (st.tmin || 0) * 60000));
  const tminOf = at => Math.round((at.date.getTime() - dayStart()) / 60000);
  G.HRU = { fmtTime, fmtDT, fmtCivil, num, degf };

  // ---- statik metinler ve girişler ----
  function fillStatic() {
    document.documentElement.lang = st.lang; document.title = t.appTitle;
    const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
    set('appTitle', t.appTitle); set('appSub', t.appSub); set('notCalendar', t.notCalendar); set('lTheme', t.theme);
    set('tabPlan', t.tabPlan); set('tabMap', t.tabMap); set('tabField', t.tabField); set('tabGuide', t.tabGuide); set('tabTests', t.tabTests);
    set('hLoc', t.location); set('lCity', t.city); set('lLat', t.lat); set('lLon', t.lon); set('lElev', t.elev); set('lHObs', t.hObs); set('lHMax', t.hMax); set('lTz', t.tz);
    set('myLoc', t.useMyLoc); set('hDate', t.evening); set('lDate', t.date);
    set('prevDay', '◀ ' + t.prevDay); set('today', t.today); set('nextDay', t.nextDay + ' ▶'); set('nextNight', t.nextNight); set('lNightKind', t.nightChoice);
    $('nightKind').innerHTML = [['A', t.nightA], ['B', t.nightB]].map(([v, l]) => `<option value="${v}"${st.nightKind === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    set('hPrefs', t.prefs); set('lDark', t.darkLbl); $('darkHelp').innerHTML = esc(t.darkHelp) + ' ' + q('karanlik'); set('lTimeFmt', t.timeFmt);
    $('darkOpts').innerHTML = ['gurub', 'm3', 'm6'].map(k => `<label><input type="radio" name="dark" value="${k}"${st.darkKey === k ? ' checked' : ''}><span>${esc(t.darkOpt[k])}</span></label>`).join('');
    $('timeFmt').innerHTML = [['local', t.tfLocal], ['both', t.tfBoth]].map(([v, l]) => `<option value="${v}"${st.timeFmt === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    $('hTb').innerHTML = esc(t.timeBar) + ' ' + q('karanlik');
    set('jGurub', t.skyAtGurub); set('jBest', t.skyAtBest); set('jWin', t.skyAtWinEnd); set('jNow', t.nowBtn); set('tbLive', t.live);
    set('hStrip', t.stripTitle); set('stripNote', t.stripNote);
    set('hDetail', st.lang === 'tr' ? 'Gurûb ve hilâl' : 'Sunset and crescent');
    $('hMonth').innerHTML = esc(t.month) + ' ' + q('enerken'); set('miniHow', t.miniHow);
    set('hExtra', t.extra); set('extraNote', t.extraNote); set('hTests', t.testsTitle); set('testsIntro', t.testsIntro); $('footer').innerHTML = noticeHtml(); paintTamper();
    $('aboutOpen').onclick = () => { location.hash = '#rehber'; setTimeout(() => { const a = $('aboutCard'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); };
    $('hMap').innerHTML = esc(t.mapTitle) + ' ' + q('kuresel'); set('lMDate', t.mapEvening); set('lMLayer', t.mapLayer); set('lMRes', t.mapRes); set('lMAge', t.mapAge); set('lMBorders', t.mapBorders); set('lM18', t.map18);
    set('lMMode', t.mapMode); set('lMLand', t.landOnly); set('lMTime', t.mapTime); set('mNow', t.nowBtn);
    $('mMode').innerHTML = [['evening', t.mmEvening], ['instant', t.mmInstant]].map(([v, l]) => `<option value="${v}"${st.mapMode === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    set('hPick', t.pick); set('pickUse', t.pickUse);
    set('hRec', t.record); set('lRecNote', t.notes); set('lRecAt', t.recAt); set('recSaw', t.saw); set('recNot', t.notSaw); set('hRecList', t.records); set('recInfo', t.recNote); set('hCheck', t.checklist);
    set('fNight', t.nightMode); set('fWake', t.wake); set('fCompass', t.compass); set('dlgClose', t.close);
    $('langTr').setAttribute('aria-pressed', st.lang === 'tr'); $('langEn').setAttribute('aria-pressed', st.lang === 'en');
    $('theme').innerHTML = [['auto', t.thAuto], ['light', t.thLight], ['dark', t.thDark], ['sun', t.thSun], ['night', t.thNight]].map(([v, l]) => `<option value="${v}"${st.theme === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    $('city').innerHTML = CITIES.map(c => `<option value="${c.id}">${esc(c[st.lang])}</option>`).join('') + `<option value="custom">${esc(t.custom)}</option>`;
    $('city').value = st.city;
    fillTz();
    showCoords(); $('elev').value = numTxt(st.elev); $('hObs').value = numTxt(st.hObs); $('hMax').value = numTxt(st.hMax); $('date').value = st.date; $('mDate').value = st.date;
    $('mLayer').innerHTML = [['seadet', t.lySeadet], ['first', t.lyFirst], ['yallop', t.lyYallop], ['odeh', t.lyOdeh]].map(([v, l]) => `<option value="${v}"${st.mapLayer === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    $('mRes').value = String(st.mapRes); $('mAge').checked = st.mapAge; $('mBorders').checked = st.mapBorders; $('m18').checked = st.map18; $('mLand').checked = st.mapLand;
    set('lFontSize', t.fontSize); set('hOnline', t.hOnline); set('lOptWx', t.optWx); set('lOptAutoLoc', t.optAutoLoc); set('lOptFonts', t.optFonts);
    set('netIntro', t.netIntro); set('netWx', t.netWx); set('netFonts', t.netFonts); set('netLoc', t.netLoc); paintNet();
    $('onlineNote').innerHTML = esc(t.onlineNote) + ' ' + q('hava') + (ON.sandboxed ? `<span class="envnote" style="display:block">${esc(t.sandboxNote)} <button class="btn" type="button" id="saveSelf" style="margin-top:6px">${esc(t.saveSelf)}</button></span>` : '');
    $('fontSize').innerHTML = [1, 1.15, 1.3].map((v, i) => `<option value="${v}"${st.fontSize === v ? ' selected' : ''}>${esc(t.fsOpts[i])}</option>`).join('');
    $('optWx').checked = !!st.wx; $('optAutoLoc').checked = !!st.autoLoc; $('optFonts').checked = !!st.webFonts;
    set('mbNow', '↺ ' + t.backNow); set('mbPrint', '⎙ ' + t.printBtn); set('openSM', '✦ ' + t.openSM); set('fSM', '✦ ' + t.fSM); set('fLoc', '⌖ ' + t.fLoc);
    set('hWx', t.wxTitle); set('hUp', t.upTitle); set('smTitle', t.smTitle); set('smPrint', t.printBtn); set('smClose', t.close);
    set('lSmFace', t.smFace); set('lSmLines', t.smLines); set('lSmNames', t.smNames); set('lSmCons', t.smCons); set('lSmEcl', t.smEcl); set('smNote', t.smNote);
    $('smFace').innerHTML = [270, 180, 90, 0].map(v => `<option value="${v}">${esc(t.faces[v])}</option>`).join('');
    const ss = $('saveSelf'); if (ss) ss.onclick = saveSelf;
    $('dlHtml').innerHTML = `⬇<span class="lbl"> ${esc(t.dlHtml)}</span>`; $('dlHtml').setAttribute('aria-label', t.dlHtml); set('dlHtml2', '⬇ ' + t.dlHtml); $('dlHtml').title = t.dlHtmlTip; $('dlHtml2').title = t.dlHtmlTip;
    $('dlHtml').onclick = downloadHtml; $('dlHtml2').onclick = downloadHtml;
    set('lTzOff', t.tzOff); $('tzOff').title = t.tzOffTip;
    set('hLic', t.licTitle); $('licBody').innerHTML = licHtml();
    // göz güvenliği, gizlilik, kayıt araçları
    $('safety').innerHTML = `<span class="long">${esc(t.safety)}</span><span class="short">${esc(t.safetyMobile)}</span><button type="button" class="x" id="safetyX" aria-label="${esc(t.safetyHide)}" title="${esc(t.safetyHide)}">×</button>`;
    $('safetyX').onclick = () => { st.safetyOff = true; save(); $('optSafety').checked = false; paintSafety(); toast(t.safetyHidden, 6000); };
    set('lOptSafety', t.optSafety); $('optSafety').checked = !st.safetyOff; set('privacyNote', t.privacyNote); set('recPhotoKeep', t.recPhotoKeep); set('recBackupNote', t.recBackupNote);
    set('fCompassNote', t.compassNote);
    set('recBackup', '⬇ ' + t.recBackup); set('recImport', '⬆ ' + t.recImport); set('recPhotoCheck', '⌕ ' + t.recPhotoCheck);
    $('recBackup').onclick = backupRecords; $('recImport').onclick = () => $('recImportFile').click(); $('recPhotoCheck').onclick = () => $('recPhotoFile').click();
    $('recImportFile').onchange = importRecords; $('recPhotoFile').onchange = checkPhoto;
    set('recVerify', '✓ ' + t.vfBtn); set('hVf', t.vfTitle); set('vfClose', t.close); $('vfIntro').innerHTML = esc(t.vfIntro) + ' ' + q('dogrulama'); set('lVfCode', t.vfCode); set('lVfFile', t.vfFile); set('vfGo', t.vfGo); set('vfNote', t.vfNote);
    $('vfCode').placeholder = 'HRK1|…|…  ·  SHA-256';
    $('recVerify').onclick = () => { $('vfOut').innerHTML = ''; const d = $('vfDlg'); try { d.showModal(); } catch (e) { d.setAttribute('open', ''); } };
    $('vfClose').onclick = () => { const d = $('vfDlg'); try { d.close(); } catch (e) { d.removeAttribute('open'); } };
    $('vfGo').onclick = verifyRecordUI;
    $('hIntro').onclick = () => { document.body.classList.toggle('introOpen'); };
    $('hIntro').title = t.introToggle;
    showHMaxNote();
    set('ver', 'v' + G.HR_VERSION); $('openSet').innerHTML = `⚙<span class="lbl"> ${esc(t.settings)}</span>`; $('openSet').setAttribute('aria-label', t.settings); $('openSet').title = t.settings; set('hSet', t.settings); set('setClose', t.close); set('lLiveInt', t.liveInt);
    $('liveInt').innerHTML = [1, 10, 60].map(v => `<option value="${v}"${(st.liveInt || 10) === v ? ' selected' : ''}>${esc(t.liveInts[v])}</option>`).join('');
    set('mbPlay', '▶ ' + t.play); set('mbFreeze', '❚❚ ' + t.freeze); set('prevNight', t.prevNight);
    set('hPr', t.prTitle); set('prClose', t.close); set('prIntro', t.prIntro); set('prGo', t.prGo); set('prNote', t.prNote + ' ' + t.jpgNote); set('prJpg', '🖼 ' + t.jpgGo); set('smJpg', '🖼 ' + t.jpgShort);
    set('hRec', t.record); set('recIntro', t.recIntro); set('lRecRes', t.recResult); set('lRecFirst', t.recFirst); set('lRecLast', t.recLast); set('lRecSky', t.recSky); set('lRecPlace', t.recPlace);
    set('lRecName', t.recName); set('lRecContact', t.recContact); set('lRecWith', t.recWith); set('lRecSeers', t.recSeers); set('lRecPhoto', t.recPhoto); set('recSave', t.recSave); set('hNets', t.recNets);
    const opts = (o, cur) => Object.keys(o).map(k => `<option value="${k}"${k === cur ? ' selected' : ''}>${esc(o[k])}</option>`).join('');
    $('recRes').innerHTML = opts(t.recRes, $('recRes').value || 'naked'); $('recSky').innerHTML = opts(t.recSkyOpts, $('recSky').value || 'clear'); $('recPlace').innerHTML = opts(t.recPlaceOpts, $('recPlace').value || 'open');
    $('recName').value = st.recName || ''; $('recContact').value = st.recContact || '';
    $('netsBody').innerHTML = `<ul class="guides"><li><a href="https://www.astronomycenter.net/icop.html?l=en" target="_blank" rel="noopener">ICOP — Islamic Crescents’ Observation Project</a> (International Astronomical Center)</li><li><a href="https://www.moonsighting.org.uk" target="_blank" rel="noopener">ICOUK — moonsighting.org.uk</a></li><li><a href="https://www.moonsighting.com" target="_blank" rel="noopener">moonsighting.com</a></li></ul><p class="cap">${esc(t.recNetsNote)}</p>`;
    set('lDetail', t.detailLvl); $('detailLvl').innerHTML = [['short', t.detailShort], ['long', t.detailLong]].map(([v, l]) => `<option value="${v}"${st.detail === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    set('hHelp', st.lang === 'tr' ? 'Rehberlik' : 'Guidance'); set('lOptExplain', t.explain); set('explainNote', t.explainNote); $('optExplain').checked = !!st.explain;
    set('hIntro', t.introTitle); set('introClose', t.introClose); $('introList').innerHTML = t.introSteps.map(x => `<li>${x}</li>`).join('');
    // Her kartın başına kısa açıklama (ne, neden, fıkhî dayanak); tecrübeli kullanıcı Ayarlar’dan kapatır
    [['hLoc', 'loc'], ['hDate', 'date'], ['hUp', 'up'], ['hTb', 'tb'], ['hWx', 'wx'], ['hSky', 'sky'], ['hStrip', 'strip'], ['hDetail', 'detail'], ['hMonth', 'month'], ['hMap', 'map'], ['fBig', 'fieldTop'], ['hRec', 'fieldRec']].forEach(([id, k]) => {
    set('lLayout', t.layoutLbl); set('layoutNote', t.layoutNote); $('layoutSel').innerHTML = [['sade', t.layoutSade], ['tam', t.layoutTam]].map(([v, l]) => `<option value="${v}"${st.layout === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
    { const addQ = (id, topic) => { const el = $(id); if (el && !el.querySelector('.q')) el.insertAdjacentHTML('beforeend', ' ' + q(topic)); };
      addQ('hUp', 'rasad'); addQ('hStrip', 'hicri'); addQ('hRec', 'sahitlik'); addQ('lRecRes', 'ciplak'); addQ('lHMax', 'gurub'); }
    setupFold(); paintFoldSums();
      const el = $(id); if (!el) return;
      const card = el.closest('section, .status'); if (!card) return;
      let h = card.querySelector(':scope > .hint, :scope .cardhead + .hint');
      if (!h) { h = document.createElement('p'); h.className = 'hint'; const anchor = id === 'fBig' ? el : (el.closest('.cardhead') || el); anchor.insertAdjacentElement(id === 'fBig' ? 'beforebegin' : 'afterend', h); }
      h.textContent = 'ⓘ ' + t.hints[k];
    });
    $('guideBody').innerHTML = `<section class="card about" id="aboutCard"><h2>${esc(t.aboutTitle)}</h2>${aboutHtml()}</section>` + G.HRGuide.render(st.lang, t, st.detail === 'long' ? 'long' : 'more') + `<section class="card"><h2>${esc(st.lang === 'tr' ? 'Hesap ve gözlem hassasiyeti' : 'Calculation and observation accuracy')}</h2><p>${esc(t.precisionNote)}</p><p class="small">${esc(t.traceEngine)}: Astronomy Engine 2.1.19 · ${esc(t.traceRules)}: ${esc(G.HR_RULES)} · Yallop (1997) · Odeh (2004)</p><p>${esc(t.safety)}</p><p>${esc(t.privacyNote)}</p></section>`;
    $('checkBody').innerHTML = G.HRGuide.planHtml(st.lang);
    applyTheme();
  }
  function applyTheme() {
    document.body.classList.remove('th-light', 'th-dark', 'th-night', 'th-sun');
    if (st.theme !== 'auto') document.body.classList.add('th-' + st.theme);
    document.documentElement.style.fontSize = (16 * (st.fontSize || 1)) + 'px';
    document.body.classList.toggle('explain', !!st.explain); document.body.classList.toggle('introDone', !!st.introDone);
    $('fNight').setAttribute('aria-pressed', st.theme === 'night');
  }
  // Konum girişi: kullanıcının yazdığı her yaygın biçim anlaşılır ve standart biçime çevrilir (coords.js)
  const numTxt = v => String(Math.round((v || 0) * 10) / 10).replace('.', st.lang === 'tr' ? ',' : '.');
  function showCoords(note) {
    $('lat').value = G.HRCoord.format(st.lat, 'lat', st.lang); $('lon').value = G.HRCoord.format(st.lon, 'lon', st.lang);
    const n = $('coordNote'); n.className = 'coordnote' + (note && note.err ? ' err' : '');
    n.textContent = note ? note.text : `${G.HRCoord.dms(st.lat, 'lat', st.lang)} · ${G.HRCoord.dms(st.lon, 'lon', st.lang)}`;
  }
  function readCoord(id) {
    const kind = id === 'lat' ? 'lat' : 'lon', r = G.HRCoord.parse($(id).value, kind);
    if (!r.ok) { const e = t.coordErr[r.err]; const n = $('coordNote'); n.className = 'coordnote err'; n.textContent = typeof e === 'function' ? e(r.bad) : (e || t.coordErr.format); return false; }
    let msg = '';
    if (r.pair) { st.lat = r.pair[0]; st.lon = r.pair[1]; msg = t.coordPair; }
    else if (r.swapped) { if (kind === 'lat') st.lon = r.value; else st.lat = r.value; msg = t.coordSwap; $(id).value = G.HRCoord.format(kind === 'lat' ? st.lat : st.lon, kind, st.lang); }
    else if (kind === 'lat') st.lat = r.value; else st.lon = r.value;
    showCoords({ text: (msg ? msg + ' ' : '') + t.coordOk(`${G.HRCoord.format(st.lat, 'lat', st.lang)}, ${G.HRCoord.format(st.lon, 'lon', st.lang)}`, `${G.HRCoord.dms(st.lat, 'lat', st.lang)} · ${G.HRCoord.dms(st.lon, 'lon', st.lang)}`) });
    return true;
  }
  function readNum(id) {
    const v = G.HRCoord.parseNum($(id).value);
    if (v == null) { const n = $('coordNote'); n.className = 'coordnote err'; n.textContent = t.numErr; return false; }
    st[id] = Math.max(0, v); $(id).value = numTxt(st[id]); return true;
  }
  function readInputs(id) {
    if (id === 'lat' || id === 'lon') return readCoord(id);
    if (['elev', 'hObs', 'hMax'].includes(id)) return readNum(id);
    st.tz = $('tz').value; st.date = $('date').value || st.date; return true;
  }
  // Tarih değişimi: canlı mod kapanır; saat bir olaya bağlıysa yeni günde aynı olaya bağlanır
  function setDate(ymd, opt = {}) {
    st.date = ymd; $('date').value = ymd; $('mDate').value = ymd;
    if (st.live && !opt.keepLive && !opt.anchor) st.anchor = 'auto'; // canlı kipten planlamaya geçiş: seçilen akşamın rasad anı
    if (!opt.keepLive) setLive(false);
    if (opt.anchor) st.anchor = opt.anchor;
    save(); update();
  }
  // Zaman kipleri: canlı (saat ilerler, paneller seçilen aralıkta tazelenir) · dondurulmuş (şimdiki an sabit) · planlama
  let liveTimer = null, liveCount = 0;
  function setLive(on, frozen) {
    st.live = on; st.frozen = on && !!frozen;
    if (on && !liveTimer) { liveCount = 0; liveTimer = setInterval(liveTick, 1000); }
    if (!on && liveTimer) { clearInterval(liveTimer); liveTimer = null; }
    document.body.classList.toggle('planning', !on);
    renderBar(); renderUpcoming();
  }
  function goNow() {
    const today = todayYmd(st.tz);
    st.anchor = null; setLive(true, false);
    if (today !== st.date) { st.date = today; $('date').value = today; $('mDate').value = today; save(); update(); }
    st.tmin = Math.max(0, Math.min(TB_MAX, tminOf(A.MakeTime(new Date()))));
    renderTime(); if (view === 'harita' && st.mapMode === 'instant') renderBigMap();
  }
  function freezeNow() { if (!st.live) goNow(); st.frozen = true; renderBar(); }
  function liveTick() {
    if (!st.live) return;
    if (st.frozen) return;
    renderBarClock();
    liveCount++;
    if (liveCount % Math.max(1, st.liveInt || 10) !== 0) return;
    if (todayYmd(st.tz) !== st.date && tminOf(A.MakeTime(new Date())) > TB_MAX) { goNow(); return; }
    st.tmin = Math.max(0, Math.min(TB_MAX, tminOf(A.MakeTime(new Date()))));
    renderTime(); if (view === 'harita' && st.mapMode === 'instant') renderBigMap();
  }
  function setTmin(m, anchor) { st.tmin = Math.max(0, Math.min(TB_MAX, Math.round(m))); st.anchor = anchor || null; if (!anchor || anchor !== 'now') setLive(false); renderTime(); if (view === 'harita' && st.mapMode === 'instant') renderBigMap(); }

  function bind() {
    $('langTr').onclick = () => { st.lang = 'tr'; t = I.T.tr; save(); fillStatic(); update(); };
    $('langEn').onclick = () => { st.lang = 'en'; t = I.T.en; save(); fillStatic(); update(); };
    $('theme').onchange = e => { st.theme = e.target.value; save(); applyTheme(); repaintAll(); };
    $('city').onchange = e => { st.city = e.target.value; const c = CITIES.find(x => x.id === st.city); if (c) { Object.assign(st, { lat: c.lat, lon: c.lon, elev: c.elev, hMax: c.hMax, tz: c.tz }); fillStatic(); } save(); update(); };
    $('tzOff').addEventListener('change', setTzOff);
    ['lat', 'lon', 'elev', 'hObs', 'hMax', 'tz', 'date'].forEach(id => $(id).addEventListener('change', () => { if (!readInputs(id)) return; if (['lat', 'lon'].includes(id)) { st.city = 'custom'; $('city').value = 'custom'; st.locAuto = false; tzFromLon(); } if (id === 'tz' || id === 'date') showTzOff(); $('mDate').value = st.date; if (id === 'date' || id === 'tz') { if (st.live) st.anchor = 'auto'; setLive(false); } save(); update(); }));
    const shift = k => setDate(addDays(st.date, k));
    $('prevDay').onclick = () => shift(-1); $('nextDay').onclick = () => shift(1);
    $('mPrev').onclick = () => mapShift(-1); $('mNext').onclick = () => mapShift(1);
    $('today').onclick = () => setDate(todayYmd(st.tz));
    $('mDate').onchange = e => setDate(e.target.value);
    $('nightKind').onchange = e => { st.nightKind = e.target.value; save(); };
    $('nextNight').onclick = () => goNight(st.nightKind, 1); $('prevNight').onclick = () => goNight(st.nightKind, -1);
    $('myLoc').onclick = () => autoLocate(true, true);
    $('darkOpts').addEventListener('change', e => { if (e.target.name === 'dark') { st.darkKey = e.target.value; save(); prefsChanged(); } });
    $('timeFmt').onchange = e => { st.timeFmt = e.target.value; save(); prefsChanged(); };
    const box = $('extraBox'); box.open = !!st.extraOpen; box.addEventListener('toggle', () => { st.extraOpen = box.open; save(); });
    $('tb').addEventListener('input', () => setTmin(+$('tb').value));
    document.querySelectorAll('[data-jump]').forEach(b => b.onclick = () => jump(b.dataset.jump));
    ['mLayer', 'mRes', 'mAge', 'mBorders', 'm18', 'mLand', 'mMode'].forEach(id => $(id).addEventListener('change', () => {
      st.mapLayer = $('mLayer').value; st.mapRes = +$('mRes').value; st.mapAge = $('mAge').checked; st.mapBorders = $('mBorders').checked; st.map18 = $('m18').checked; st.mapLand = $('mLand').checked; st.mapMode = $('mMode').value;
      if (st.mapMode !== 'instant') stopPlay();
      save(); renderBigMap();
    }));
    $('mTime').addEventListener('input', () => setTmin(+$('mTime').value));
    // Ufuk kartındaki zaman çubuğu: bütün sayfanın seçili ânını değiştirir
    let skyRaf = 0; $('skyT').addEventListener('input', () => { const v = +$('skyT').value; cancelAnimationFrame(skyRaf); skyRaf = requestAnimationFrame(() => setTmin(v)); });
    $('skyMinus').onclick = () => setTmin((st.tmin || 0) - 10); $('skyPlus').onclick = () => setTmin((st.tmin || 0) + 10);
    $('skyT').title = t.skyTTip;
    $('mHPrev').onclick = () => stepHours(-1); $('mHNext').onclick = () => stepHours(1);
    $('mPlay').onclick = () => playing ? stopPlay() : startPlay();
    $('mNow').onclick = goNow;
    document.addEventListener('click', e => { const b = e.target.closest('[data-topic]'); if (b) openTopic(b.dataset.topic); });
    $('dlgClose').onclick = () => closeDlg();
    $('fNight').onclick = () => { st.theme = st.theme === 'night' ? 'auto' : 'night'; save(); fillStatic(); repaintAll(); };
    $('fWake').onclick = toggleWake; $('fCompass').onclick = toggleCompass;
    $('recSave').onclick = addRecord;
    $('recAt').addEventListener('input', showRecEvening);
    window.addEventListener('hashchange', route);
    $('mbNow').onclick = goNow; $('mbPrint').onclick = openPrint;
    $('mbPlay').onclick = goNow; $('mbFreeze').onclick = freezeNow;
    $('openSet').onclick = () => { try { $('setDlg').showModal(); } catch (e) { $('setDlg').setAttribute('open', ''); } };
    $('setClose').onclick = () => { try { $('setDlg').close(); } catch (e) { $('setDlg').removeAttribute('open'); } };
    $('prClose').onclick = () => { try { $('prDlg').close(); } catch (e) { $('prDlg').removeAttribute('open'); } };
    const prKinds = () => Array.from($('prOpts').querySelectorAll('input:checked')).map(x => x.value);
    $('prGo').onclick = () => { const ks = prKinds(); $('prClose').onclick(); if (ks.length) printPages(ks); };
    $('prJpg').onclick = () => { const ks = prKinds(); $('prClose').onclick(); if (ks.length) exportJpg(ks); };
    $('liveInt').onchange = e => { st.liveInt = +e.target.value; save(); };
    $('optExplain').onchange = e => { st.explain = e.target.checked; if (st.explain) st.introDone = false; save(); applyTheme(); };
    $('introClose').onclick = () => { st.introDone = true; save(); applyTheme(); };
    ['recName', 'recContact'].forEach(id => $(id).addEventListener('change', e => { st[id] = e.target.value.trim(); save(); }));
    document.addEventListener('click', stabilize, true); document.addEventListener('change', stabilize, true);
    $('fontSize').onchange = e => { st.fontSize = +e.target.value; save(); applyTheme(); repaintAll(); };
    $('fFont').onclick = () => { st.fontSize = st.fontSize >= 1.3 ? 1 : st.fontSize >= 1.15 ? 1.3 : 1.15; save(); fillStatic(); repaintAll(); };
    $('optWx').onchange = e => { st.wx = e.target.checked; save(); paintNet(); renderWx(true); };
    $('optAutoLoc').onchange = e => { st.autoLoc = e.target.checked; save(); paintNet(); if (st.autoLoc) autoLocate(true); };
    $('layoutSel').onchange = e => { st.layout = e.target.value; st.fold = foldDefault(); save(); setupFold(); paintFoldSums(); renderTime(); };
    $('detailLvl').onchange = e => { st.detail = e.target.value; save(); fillStatic(); };
    $('optSafety').onchange = e => { st.safetyOff = !e.target.checked; save(); paintSafety(); };
    $('optFonts').onchange = e => { st.webFonts = e.target.checked; save(); applyFonts(); paintNet(); };
    $('openSM').onclick = () => openSM(selT()); $('fSM').onclick = () => openSM(A.MakeTime(new Date()));
    $('fLoc').onclick = () => autoLocate(true, true);
    $('smClose').onclick = () => { try { $('smDlg').close(); } catch (e) { $('smDlg').removeAttribute('open'); } };
    ['smFace', 'smLines', 'smNames', 'smCons', 'smEcl'].forEach(id => $(id).addEventListener('change', () => drawSM()));
    $('smPrint').onclick = () => printPages(['sky']); $('smJpg').onclick = () => exportJpg(['sky']);
    window.addEventListener('online', () => { renderBar(); renderWx(true); }); window.addEventListener('offline', () => { renderBar(); renderWx(); });
  }
  function prefsChanged() {
    FRange = undefined;
    if (R) { renderDetail(R); renderMonth(R, LOC); renderExtra(R); }
    computeDay(); renderTime(); if (view === 'harita') renderBigMap(); if (view === 'saha') fieldTick(true);
  }
  function openTopic(id) {
    $('dlgBody').innerHTML = G.HRGuide.topicHtml(st.lang, id, st.detail === 'long' ? 'long' : 'more') + `<p class="edn">${esc(t.editionNote)}</p>`;
    const d = $('dlg'); try { d.showModal(); } catch (e) { d.setAttribute('open', ''); }
  }
  function closeDlg() { const d = $('dlg'); try { d.close(); } catch (e) { d.removeAttribute('open'); } }

  const VIEWS = ['plan', 'harita', 'saha', 'rehber', 'dogrulama'];
  let view = 'plan';
  function route() {
    const h = (location.hash || '#plan').slice(1);
    view = VIEWS.includes(h) ? h : 'plan';
    VIEWS.forEach(x => { $('view-' + x).hidden = x !== view; });
    VIEWS.forEach(x => document.body.classList.toggle('v-' + x, x === view));
    [['tabPlan', 'plan'], ['tabMap', 'harita'], ['tabField', 'saha'], ['tabGuide', 'rehber'], ['tabTests', 'dogrulama']].forEach(([id, v]) => $(id).setAttribute('aria-current', v === view ? 'page' : 'false'));
    if (view === 'dogrulama') runTests();
    if (view === 'harita') renderBigMap(); else stopPlay();
    renderBar();
    if (view === 'saha') { fieldStart(); resetRecAt(); if (st.autoLoc && !st.locAuto && !ON.sandboxed) autoLocate(true); } else fieldStop();
    if (view === 'plan' && R) { renderMini(); renderTime(); }
    $('fStrip').hidden = view !== 'saha';
  }
  function repaintAll() { if (R) { renderTime(); renderMini(); } if (view === 'harita') renderBigMap(); if (view === 'saha') fieldTick(true); }

  // Kullanıcı bir şeye dokununca sayfa yeniden dolsa da okuduğu yer yerinde kalsın: tıklanan kartın ekrandaki konumu korunur
  function stabilize(e) {
    const el = e.target; if (!el || !el.closest) return;
    if (el.closest('dialog')) return;
    let anchor = el.closest('section, details, .card, .status');
    if (!anchor || el.closest('.stick')) {
      const stickB = document.querySelector('.stick').getBoundingClientRect().bottom;
      const main = document.querySelector('main:not([hidden])');
      anchor = main ? Array.from(main.querySelectorAll('section, details')).find(x => x.getBoundingClientRect().bottom > stickB + 4) : null;
    }
    if (!anchor) return;
    const top0 = anchor.getBoundingClientRect().top; stabilize.user = false;
    const fix = () => { if (!anchor.isConnected || stabilize.user) return; const d = anchor.getBoundingClientRect().top - top0; if (Math.abs(d) > 2) window.scrollBy(0, d); };
    requestAnimationFrame(() => { fix(); setTimeout(fix, 120); setTimeout(fix, 450); setTimeout(fix, 1200); });
  }
  ['wheel', 'touchmove', 'keydown'].forEach(ev => window.addEventListener(ev, () => { stabilize.user = true; }, { passive: true }));
  // ---- Plan ----
  const kv = (k, v, sub, cls) => `<dt>${k}</dt><dd${cls ? ` class="${cls}"` : ''}>${v}${sub ? `<small>${sub}</small>` : ''}</dd>`;
  const CLS_STYLE = { notBorn: 'bad', below8: 'bad', below5: 'warn', possible: 'warn', visible: 'ok', midMonth: 'info' };
  const CLS_TOPIC = { notBorn: 'ictima', below8: 'beynunet', below5: 'besderece', possible: 'beynunet', visible: 'beynunet', midMonth: 'hesap' };
  const CLS_COLOR = { visible: '--c-visible', possible: '--c-possible', below5: '--c-below5', below8: '--c-below8', notBorn: '--c-notborn' };
  // İnternet bağlantıları: hepsi kullanıcı açmadıkça kapalıdır. Yazı tipleri (Google Fonts) isteğe bağlı yüklenir.
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Serif:wght@500;600&display=swap';
  function applyFonts() {
    const old = document.getElementById('webFonts');
    if (!st.webFonts) { if (old) old.remove(); return; }
    if (old) return;
    const l = document.createElement('link'); l.id = 'webFonts'; l.rel = 'stylesheet'; l.href = FONT_URL; document.head.appendChild(l);
  }
  function paintNet() {
    const el = $('netStat'); if (!el) return;
    const on = [];
    if (st.wx) on.push('open-meteo.com');
    if (st.webFonts) on.push('fonts.googleapis.com · fonts.gstatic.com');
    el.textContent = on.length ? t.netOn(on.join(' · ')) : t.netNone;
  }
  // Göz güvenliği uyarısı yalnız rü’yetin mümkün olduğu akşamlarda gösterilir; kullanıcı kapatabilir (Ayarlar’dan geri açılır)
  const sightPossible = r => !!(r && r.ok && r.cls && ['possible', 'visible'].includes(r.cls.code));
  function paintSafety() { const el = $('safety'); if (el) el.hidden = !!st.safetyOff || !sightPossible(R); }
  // ---- Sade görünüm: ikincil kartlar katlı başlar; her kart başlığa dokunarak açılıp kapanır, seçim hatırlanır ----
  const FOLDABLE = ['locCard', 'dateCard', 'upCard', 'tbCard', 'wxCard', 'skyCard', 'stripCard', 'detailCard', 'monthCard'];
  const SADE_FOLDED = ['locCard', 'dateCard', 'tbCard', 'wxCard', 'stripCard', 'detailCard', 'monthCard'];
  const foldDefault = () => Object.fromEntries(FOLDABLE.map(id => [id, st.layout === 'sade' && SADE_FOLDED.includes(id)]));
  function setupFold() {
    if (!st.fold) st.fold = foldDefault();
    for (const id of FOLDABLE) {
      const c = $(id); if (!c) continue;
      c.classList.add('foldable');
      const h = c.querySelector(':scope > h2, :scope > .cardhead h2');
      if (!c.querySelector(':scope > .foldbtn')) { c.insertAdjacentHTML('afterbegin', `<button type="button" class="foldbtn" aria-expanded="true"></button>`); c.querySelector(':scope > .foldbtn').onclick = e => { e.stopPropagation(); toggleFold(id); }; }
      const fb = c.querySelector(':scope > .foldbtn'); fb.setAttribute('aria-label', t.foldToggle); fb.title = t.foldToggle;
      if (!c.querySelector(':scope > .foldsum')) { const f = document.createElement('p'); f.className = 'foldsum'; (c.querySelector(':scope > .cardhead') || h).insertAdjacentElement('afterend', f); }
      if (!c.dataset.foldBound) { c.dataset.foldBound = '1'; (h || c).addEventListener('click', e => { if (e.target.closest('button.q, .btns a, .btns button:not(.foldbtn)')) return; toggleFold(id); }); }
      applyFold(id);
    }
  }
  function applyFold(id, open) {
    const c = $(id); if (!c) return;
    if (open != null) st.fold[id] = !open;
    const folded = !!st.fold[id];
    c.classList.toggle('folded', folded);
    const b = c.querySelector('.foldbtn'); if (b) b.setAttribute('aria-expanded', String(!folded));
  }
  function toggleFold(id) { st.fold[id] = !st.fold[id]; applyFold(id); save(); if (!st.fold[id]) { if (id === 'skyCard') renderTime(); if (id === 'monthCard') renderMini(); } paintFoldSums(); }
  function paintFoldSums() {
    const S = (id, txt) => { const c = $(id); const f = c && c.querySelector(':scope > .foldsum'); if (f) f.textContent = txt || ''; };
    const city = CITIES.find(c => c.id === st.city);
    S('locCard', `${city ? city[st.lang] : `${num(st.lat, 3)}, ${num(st.lon, 3)}`} · UTC${fmtOff(offAt(st.tz, st.date))} — ${t.foldOpen}`);
    S('dateCard', fmtCivil(civil(st.date)));
    S('tbCard', `${hhmm(selT())} — ${t.foldOpen}`);
    S('wxCard', st.wx ? (WX.ass ? t.wxLevel[WX.ass.level] : t.wxLoading) : t.netNone);
    S('upCard', upData && upData.a ? `${t.upA || ''} ${fmtCivil(civil(upData.a.ymd))}` : '');
    S('skyCard', t.foldOpen);
    S('stripCard', t.foldOpen);
    S('detailCard', R && R.ok ? clsText(R)[0] : '');
    S('monthCard', MONTH ? `${monthName(MONTH.hmn.m)} ${MONTH.hmn.y}` : '');
  }
  function showHMaxNote() { const n = $('hMaxNote'); if (!n) return; n.hidden = !!(st.hMax && st.hMax > 0); n.textContent = t.hMaxUnset; }
  function locObj() { return { lat: st.lat, lon: st.lon, elev: st.elev, hObs: st.hObs, hMax: st.hMax, tz: st.tz }; }
  const evCache = new Map();
  function eveningCached(loc, ymd) { const k = [loc.lat, loc.lon, loc.elev, loc.hObs, loc.hMax, ymd].join('|'); if (!evCache.has(k)) { let r; try { r = C.evening(loc, ymd); } catch (e) { r = { ok: false }; } evCache.set(k, r); } return evCache.get(k); }

  function update() {
    if (!isFinite(st.lat) || !isFinite(st.lon)) return;
    LOC = locObj(); showHMaxNote(); showTzOff(); if (st.fold) setTimeout(paintFoldSums, 0);
    R = eveningCached(LOC, st.date); paintSafety();
    tzCheck();
    if (!R.ok) {
      const noonAlt = C.at(C.solarNoon(st.date, LOC.lon), LOC).sun.alt, polarNight = noonAlt < 0;
      // Kutup bölgeleri: güneş batmıyor (yaz) veya doğmuyor (kış). Tam İlmihâl s. 315: gündüzü uzun olmayan en yakın şehrin zamanına uyulur.
      $('statusBody').innerHTML = `<h2>${esc(st.lang === 'tr' ? (polarNight ? 'Bu tarihte bu yerde güneş doğmuyor (kutup gecesi).' : 'Bu tarihte bu yerde güneş batmıyor.') : (polarNight ? 'The Sun does not rise here on this date (polar night).' : 'The Sun does not set here on this date.'))}</h2><p class="sub">${esc(st.lang === 'tr' ? 'Gurûb olmadığı için hilâl rasadı yapılamaz. Tam İlmihâl, yirmidört saatten uzun günlerde oruç için gündüzü böyle uzun olmayan bir şehrin zamanına uyulacağını bildirir (s. 315); en yakın böyle bir yerin konumunu girerek planlayabilirsiniz.' : 'With no sunset there is no crescent observation. Tam İlmihâl says that where days exceed twenty-four hours, for fasting one follows a city whose day is not so long (p. 315); enter the nearest such place to plan.')}</p>`; R = null;
    } else { renderStatus(R); renderDetail(R); renderMonth(R, LOC); renderExtra(R); }
    computeDay();
    if (st.live) st.tmin = Math.max(0, Math.min(TB_MAX, tminOf(A.MakeTime(new Date()))));
    else if (st.anchor || st.tmin == null) st.tmin = anchorMin(st.anchor || 'auto');
    renderTime();
    renderStrip();
    renderWx();
    renderUpcoming();
    if (view === 'harita') renderBigMap();
    if (view === 'saha') fieldTick(true);
  }
  function anchorMin(a) {
    if (!R) return 12 * 60;
    if (a === 'auto') {
      // Varsayılan an: en iyi an Tam İlmihâl’in penceresi içinde ve aranabilir ise o; değilse pencere içindeki aranabilir aralığın ortası; o da yoksa gurûb
      const g = tminOf(R.gurub), mid = R.cls.code === 'midMonth';
      const rg = DAY && DAY.ranges.find(([x, y]) => y >= g - 10 && x <= g + 240);
      if (!mid && R.best && R.windowEnd && R.best.ut <= R.windowEnd.ut) { const b = tminOf(R.best); if (!rg || (b >= rg[0] && b <= rg[1])) return b; }
      if (!mid && rg) { const we = R.windowEnd ? Math.min(rg[1], tminOf(R.windowEnd)) : rg[1]; return Math.round((rg[0] + Math.max(rg[0], we)) / 2); }
      return g;
    }
    const at = a === 'gurub' ? R.gurub : a === 'win' ? (R.windowEnd || R.gurub) : (R.best && R.cls.code !== 'midMonth' ? R.best : R.gurub);
    return Math.max(0, Math.min(TB_MAX, tminOf(at)));
  }
  function jump(which) {
    if (which === 'now') { goNow(); return; }
    if (!R) return;
    if (which === 'best' && !R.best) which = 'gurub';
    setTmin(anchorMin(which), which);
  }
  // ---- Saat dilimi ve UTC saat farkı ----
  // Kutu, seçili saat diliminin seçili tarihteki UTC farkını gösterir. Kutuya fark yazılırsa o farka karşılık gelen sabit dilim seçilir;
  // listeden dilim seçilirse kutu o dilimin farkını gösterir. Bölgesel dilimler (Europe/Istanbul gibi) yaz saatini izler, sabit farklar izlemez.
  const FRAC = { 330: 'Asia/Kolkata', 345: 'Asia/Kathmandu', 210: 'Asia/Tehran', 270: 'Asia/Kabul', 390: 'Asia/Yangon', 525: 'Australia/Eucla', 570: 'Australia/Darwin', 630: 'Australia/Lord_Howe', 765: 'Pacific/Chatham', 825: 'Pacific/Chatham', [-210]: 'America/St_Johns', [-570]: 'Pacific/Marquesas' };
  const offAt = (tz, ymd) => { try { return C.tzOffsetMin(tz, new Date(Date.UTC(...ymd.split('-').map((v, i) => i === 1 ? v - 1 : +v)) + 12 * 3600000)); } catch (e) { return null; } };
  function fmtOff(m) { if (m == null) return '?'; if (m === 0) return '±0'; const a = Math.abs(m), h = Math.floor(a / 60), mm = a % 60; return `${m > 0 ? '+' : '−'}${h}${mm ? ':' + String(mm).padStart(2, '0') : ''}`; }
  function parseOff(s) {
    let x = String(s || '').trim().replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/^(utc|gmt)/i, '').replace(',', '.');
    if (x === '' || x === '±0' || x === '0') return x === '' ? null : 0;
    let m = x.match(/^([+-]?)(\d{1,2})(?::?(\d{2}))$/), v = null;
    if (m) v = (+m[2]) * 60 + (+m[3]); else if ((m = x.match(/^([+-]?)(\d{1,2}(?:\.\d+)?)$/))) v = Math.round(+m[2] * 60);
    if (v == null) return null; if (m[1] === '-') v = -v;
    if (v < -12 * 60 || v > 14 * 60 || ![0, 30, 45].includes(Math.abs(v) % 60)) return null;
    return v;
  }
  function zoneForOff(m) { if (m === 0) return 'UTC'; if (m % 60 === 0) return `Etc/GMT${m > 0 ? '-' : '+'}${Math.abs(m / 60)}`; return FRAC[m] || null; }
  const isFixedTz = z => z === 'UTC' || /^Etc\/GMT/.test(z);
  function tzLabel(z, ymd) { const o = offAt(z, ymd); return isFixedTz(z) ? `UTC${o === 0 ? '' : fmtOff(o)}` : `${z.replace(/_/g, ' ')} (${fmtOff(o)})`; }
  function fillTz() {
    const all = (Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : CITIES.map(c => c.tz)).filter(z => !isFixedTz(z));
    if (!isFixedTz(st.tz) && !all.includes(st.tz)) all.unshift(st.tz);
    const fixed = []; for (let h = -12; h <= 14; h++) fixed.push(zoneForOff(h * 60));
    const opt = z => `<option value="${esc(z)}"${z === st.tz ? ' selected' : ''}>${esc(tzLabel(z, st.date))}</option>`;
    $('tz').innerHTML = `<optgroup label="${esc(t.tzRegional)}">${all.map(opt).join('')}</optgroup><optgroup label="${esc(t.tzFixed)}">${fixed.map(opt).join('')}</optgroup>`;
    showTzOff();
  }
  function showTzOff() {
    const o = offAt(st.tz, st.date); $('tzOff').value = fmtOff(o);
    const n = $('tzNote'); if (!n) return;
    if (isFixedTz(st.tz)) { n.textContent = t.tzFixedNote(fmtOff(o)); return; }
    const y = st.date.slice(0, 4), jan = offAt(st.tz, `${y}-01-15`), jul = offAt(st.tz, `${y}-07-15`);
    n.textContent = jan !== jul ? t.tzDstNote(st.tz, fmtOff(Math.min(jan, jul)), fmtOff(Math.max(jan, jul)), fmtOff(o)) : t.tzStdNote(st.tz, fmtOff(o));
  }
  function setTzOff() {
    const v = parseOff($('tzOff').value);
    if (v == null) { $('tzNote').textContent = t.tzOffErr; $('tzOff').value = fmtOff(offAt(st.tz, st.date)); return; }
    if (v !== offAt(st.tz, st.date)) { const z = zoneForOff(v); if (!z) { $('tzNote').textContent = t.tzOffErr; return; } st.tz = z; }
    fillTz(); if (st.live) st.anchor = 'auto'; setLive(false); save(); update();
  }
  // Elle girilen konum, seçili dilimin güneş saatinden 2 saatten fazla uzaksa fark tûlden hesaplanır (kullanıcı değiştirebilir)
  function tzFromLon() {
    const off = offAt(st.tz, st.date); if (off != null && Math.abs(off - st.lon * 4) / 60 <= 2) return false;
    const m = Math.max(-12, Math.min(14, Math.round(st.lon / 15))) * 60; st.tz = zoneForOff(m); fillTz(); toast(t.tzAuto(fmtOff(m)), 7000); return true;
  }
  function tzCheck() {
    const off = C.tzOffsetMin(st.tz, new Date(dayStart() + 12 * 3600000));
    const diffH = Math.abs(off - st.lon * 4) / 60;
    const w = $('tzWarn'); w.hidden = diffH <= 2; if (!w.hidden) w.textContent = t.tzWarn(st.tz, Math.round(diffH));
  }
  function claimOf(r) {
    if (r.cls.code === 'midMonth') return [t.claimNa, 'p-info'];
    if (r.cls.reject) return [t.claimReject, 'p-bad'];
    if (r.cls.code === 'below5') return [t.claimWarn, 'p-warn'];
    return [t.claimOk, 'p-ok'];
  }
  function clsText(r) { return t.cls[r.cls.code === 'notBorn' ? 'notBorn_' + r.cls.sub : r.cls.code]; }
  // Durum kartı: her kipte aynı satırlar (yerleşim kaymasın diye boş kalan satır da yer tutar)
  function renderStatus(r) {
    const [title, sub] = clsText(r);
    $('status').className = 'status s-' + CLS_STYLE[r.cls.code];
    const [claim, ccls] = claimOf(r);
    const mid = r.cls.code === 'midMonth';
    const sought = !mid && r.ictimaPrev && r.ageH != null && r.ageH >= 0 ? (() => { const h = CAL.monthForConjunction(r.ictimaPrev.date); return `${monthName(h.m)} ${h.y}`; })() : '';
    const tag = st.live ? t.liveTag : t.planTag;
    const head = `<div class="planhead"><span class="tag">${esc(tag)}</span><strong>${esc(st.live ? t.thisEvening(fmtCivil(civil(st.date))) : t.planFor(fmtCivil(civil(st.date))))}</strong><span class="small">${sought ? esc(t.planMonth(sought)) : mid ? esc(t.midHint) : '&nbsp;'}</span></div>`;
    const win = !mid && r.windowEnd ? `<span class="mono">${hhmm(r.gurub)} – ${hhmm(r.windowEnd)}</span>` : `<span>${esc(mid ? t.none : t.stNoWindow)}</span>`;
    const late = !mid && r.best && r.windowEnd && r.best.ut > r.windowEnd.ut;
    const best = !mid && r.best ? `<span class="mono">${hhmm(r.best)}</span>${late ? ` <span class="small">${esc(t.stAfterWin)}</span>` : ''}` : `<span>${t.none}</span>`;
    $('statusBody').innerHTML = `<p class="hint">ⓘ ${esc(t.hints.status)}</p>` + head + `<h2>${esc(title)} ${q(CLS_TOPIC[r.cls.code])}</h2><p class="sub">${esc(sub)}</p>
      <div class="meta"><span class="small">${t.claim}:</span><span class="pill ${ccls}">${esc(claim)}</span>${q('hesap')}</div>
      <p class="st-row"><b>${esc(t.stWindow)}</b>${win} ${q('besderece')}</p>
      <p class="st-row"><b>${esc(t.stBest)}</b>${best} ${q('modern')}</p>${mid ? '' : kadihanHtml(r)}`;
  }
  // Kâdîhân kontrolü: İmâm-ı a’zam (−19°, esas) ve İmâmeyn (−17°, alternatif) birlikte (Tam İlmihâl s. 178, 194, 316)
  function kadihanHtml(r, compact) {
    if (!r.kadihan19) return `<div class="kd"><p class="st-row"><b>${esc(t.kdTitle)}</b><span class="small">${esc(t.kdNone)}</span> ${q('safak')}</p></div>`;
    const v = k => k === 'first' ? t.kdFirst : t.kdSecond;
    return `<div class="kd"><p class="st-row"><b>${esc(t.kdTitle)}</b> ${q('safak')}</p>
      <p>● ${esc(t.kdA)}: <strong>${esc(v(r.kadihan19))}</strong> <span class="small">(${esc(t.kdSafak)} ${hhmm(r.safak19)}, ${esc(t.moonset.replace(/\s*\(.*\)/, ''))} ${hhmm(r.moonset)})</span></p>
      <p>○ ${esc(t.kdB)}: ${esc(v(r.kadihan17))} <span class="small">(${esc(t.kdSafak)} ${hhmm(r.safak17)})</span></p>
      ${compact ? '' : `<p class="small ${r.kadihanDiffer ? 'diff' : ''}">${esc(r.kadihanDiffer ? t.kdDiffer : t.kdSame)}</p>`}</div>`;
  }
  function renderDetail(r) {
    let h = '';
    h += kv(t.gurub + ' ' + q('gurub'), fmtTime(r.gurub), utcSub(r.gurub));
    if (r.seri && r.seri.seri) h += kv(t.seri, fmtTime(r.seri.seri), `${t.temkin} ${num(r.seri.temkinMin, 1)} ${t.min}`);
    h += kv(t.moonset, fmtTime(r.moonset), utcSub(r.moonset));
    h += kv(t.lag, hm(r.lagMin));
    h += kv(t.age, ageTxt(r.ageH));
    h += kv(t.lastConj + ' ' + q('ictima'), fmtDT(r.ictimaPrev), utcSub(r.ictimaPrev));
    h += kv(t.beyn + ' ' + q('beynunet'), degf(r.beynunet));
    h += kv(t.alt + ' ' + q('besderece'), degf(r.moonAlt), `${t.geoAlt} ${degf(r.moonGeoAlt)}`);
    h += kv(t.az, degf(r.moonAz), `${t.daz} ${degf(r.daz, 1)}`);
    h += kv(t.illum, num(r.illum, 2) + ' %');
    h += kv(t.safakA + ' ' + q('safak'), hhmm(r.safak19), t.safakNote(num(r.safakTemkin || 0, 1)));
    h += kv(t.safakB, hhmm(r.safak17), utcSub(r.safak17));
    if (r.kadihan19) h += kv(t.kadihan, (r.kadihan19 === 'first' ? t.kFirst : t.kSecond) + (r.kadihanDiffer ? ` <small>${esc(t.kdB)}: ${esc(r.kadihan17 === 'first' ? t.kdFirst : t.kdSecond)}</small>` : ''), '', 'txt');
    $('detail').innerHTML = h;
  }

  // ---- Gün örneklemesi (zaman çubuğu ve "bu anda gözlem") ----
  function computeDay() {
    LOC = LOC || locObj();
    const start = dayStart(), t0 = A.MakeTime(new Date(start));
    let ev = null; try { ev = C.dayEvents(LOC, st.date, st.tz); } catch (e) { ev = null; }
    const cPrev = C.lastNewMoonBefore(t0), cNext = C.nextNewMoonAfter(t0);
    const ageAt = tt => cNext && tt.ut >= cNext.ut ? (tt.ut - cNext.ut) * 24 : cPrev ? (tt.ut - cPrev.ut) * 24 : null;
    const S = [];
    for (let m = 0; m <= TB_MAX; m += 5) {
      const tt = A.MakeTime(new Date(start + m * 60000)), p = C.at(tt, LOC), ag = ageAt(tt);
      S.push({ m, sun: p.sun.airAlt, moon: p.moon.alt, ok: C.searchable(p, st.darkKey, ag).ok });
    }
    const ranges = []; let cur = null;
    for (const s of S) { if (s.ok) { if (!cur) cur = [s.m, s.m]; else cur[1] = s.m; } else if (cur) { ranges.push(cur); cur = null; } }
    if (cur) ranges.push(cur);
    // kenarları 1 dakikaya inceltme: [başlangıç, bitiş) dakika
    const okAt = m => { const tt = A.MakeTime(new Date(start + m * 60000)); return C.searchable(C.at(tt, LOC), st.darkKey, ageAt(tt)).ok; };
    for (const r of ranges) {
      let a = r[0]; while (a > 0 && a > r[0] - 5 && okAt(a - 1)) a--;
      let b = r[1]; while (b < r[1] + 5 && okAt(b + 1)) b++;
      r[0] = a; r[1] = b + 1;
    }
    let mo = null; try { mo = C.morning(LOC, st.date); } catch (e) { mo = null; }
    DAY = { start, ev, S, ranges, ageAt, morning: mo, key: st.date + st.tz + st.darkKey + LOC.lat + LOC.lon };
  }
  const minLbl = m => { const mm = ((m % 1440) + 1440) % 1440; return String(Math.floor(mm / 60)).padStart(2, '0') + ':' + String(mm % 60).padStart(2, '0'); };
  function renderTrack() {
    const W = Math.max(300, Math.round($('tbTrack').clientWidth || 720)), H = 78, X = m => m / TB_MAX * W, hs = W < 520 ? 6 : 3;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(t.timeBar)}" id="tbSvg" style="cursor:pointer">`;
    s += `<rect x="0" y="0" width="${W}" height="30" fill="var(--sky-day)" opacity=".35" rx="4"/>`;
    // gece ve alacakaranlık: tek renk geçişi (dikiş çizgisi olmadan)
    s += `<defs><linearGradient id="tbNight" x1="0" x2="1" y1="0" y2="0">${DAY.S.map(p => `<stop offset="${(p.m / TB_MAX).toFixed(4)}" stop-color="var(--map-night)" stop-opacity="${p.sun > -0.8333 ? 0 : Math.min(0.85, 0.2 + (-p.sun / 18) * 0.65).toFixed(2)}"/>`).join('')}</linearGradient></defs>`;
    s += `<rect x="0" y="0" width="${W}" height="30" fill="url(#tbNight)" rx="4"/>`;
    // ay ufkun üstünde: birleşik aralıklar
    let mu = null; const mus = [];
    for (const p of DAY.S) { if (p.moon > 0) { if (!mu) mu = [p.m, p.m]; else mu[1] = p.m; } else if (mu) { mus.push(mu); mu = null; } }
    if (mu) mus.push(mu);
    for (const [a, b] of mus) s += `<rect x="${X(a).toFixed(1)}" y="26" width="${(X(b + 5) - X(a)).toFixed(1)}" height="4" fill="var(--moon)" opacity=".85"/>`;
    if (R && R.cls.code !== 'midMonth' && R.windowEnd) { const a = tminOf(R.gurub), b = tminOf(R.windowEnd); s += `<rect x="${X(a)}" y="3" width="${Math.max(2, X(b) - X(a))}" height="8" rx="2" fill="var(--c-possible)"/>`; }
    for (const [a, b] of DAY.ranges) s += `<rect x="${X(a)}" y="13" width="${Math.max(3, X(b) - X(a))}" height="9" rx="2" fill="var(--c-visible)"/>`;
    for (let h = 0; h <= 27; h += hs) s += `<line x1="${X(h * 60)}" x2="${X(h * 60)}" y1="30" y2="35" stroke="var(--muted)"/><text x="${Math.min(W - 16, Math.max(16, X(h * 60)))}" y="45" font-size="10" text-anchor="middle" fill="var(--muted)">${minLbl(h * 60)}</text>`;
    const evs = [];
    if (DAY.ev) { if (DAY.ev.sunrise) evs.push(['☀↑', DAY.ev.sunrise]); if (DAY.ev.moonrise) evs.push(['☾↑', DAY.ev.moonrise]); if (DAY.ev.moonset) evs.push(['☾↓', DAY.ev.moonset]); }
    if (R) { evs.push(['☀↓', R.gurub]); if (R.moonset && (!DAY.ev || !DAY.ev.moonset || Math.abs(R.moonset.ut - DAY.ev.moonset.ut) > 1e-3)) evs.push(['☾↓', R.moonset]); if (R.safak19) evs.push(['−19°', R.safak19]); }
    const placed = [];
    for (const [lbl, at] of evs) { const m = tminOf(at); if (m < 0 || m > TB_MAX) continue; let row = 0; while (row < 1 && placed.some(p => p.row === row && Math.abs(p.x - X(m)) < 30)) row++; placed.push({ x: X(m), row }); s += `<line x1="${X(m)}" x2="${X(m)}" y1="0" y2="30" stroke="var(--ink)" stroke-opacity=".45" stroke-width="1"/><text x="${X(m)}" y="${57 + row * 12}" font-size="10.5" text-anchor="middle" fill="var(--ink)" font-weight="600">${lbl}</text>`; }
    const xm = X(st.tmin || 0);
    s += `<line x1="${xm}" x2="${xm}" y1="0" y2="34" stroke="var(--accent)" stroke-width="2.5"/><circle cx="${xm}" cy="34" r="4" fill="var(--accent)"/>`;
    s += '</svg>';
    $('tbTrack').innerHTML = s;
    $('tbSvg').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); setTmin((e.clientX - r.left) / r.width * TB_MAX); };
    const lg = (c, l) => `<span><i style="background:var(${c})"></i>${esc(l)}</span>`;
    $('tbLegend').innerHTML = lg('--map-night', t.lgNight) + lg('--c-possible', t.evWin) + lg('--c-visible', t.evSearch + ' (' + t.darkOpt[st.darkKey].split(' (')[0] + ')') + lg('--moon', t.moonL + ' ↑') +
      `<span class="small">☀↑ ${esc(t.evSunrise)} · ☀↓ ${esc(t.evGurub)} · ☾↑ ${esc(t.evMoonrise)} · ☾↓ ${esc(t.evMoonset)} · −19° ${esc(t.evSafak)}</span>`;
  }
  function renderTime() {
    if (!DAY) return;
    $('tb').max = String(TB_MAX); $('tb').value = String(st.tmin || 0);
    const at = selT();
    const nextDay = (st.tmin || 0) >= 1440;
    $('tbVal').textContent = hhmm(at) + (nextDay ? ' (+1)' : '');
    $('tbUtc').textContent = (st.timeFmt === 'both' ? fmtUTC(at) + ' · ' : '') + fmtCivil(new Date(Date.UTC(...ymdParts(localYmd(at)))), true);
    $('jBest').hidden = !(R && R.best && R.cls.code !== 'midMonth'); $('jWin').hidden = !(R && R.windowEnd && R.cls.code !== 'midMonth');
    ['gurub', 'best', 'win'].forEach(k => $('j' + { gurub: 'Gurub', best: 'Best', win: 'Win' }[k]).setAttribute('aria-pressed', String(st.anchor === k)));
    renderTrack(); renderMoment(at); renderSky(at); renderBar();
    $('mTime').value = String(st.tmin || 0); $('mTimeVal').textContent = hhmm(at) + (nextDay ? ' (+1)' : '');
    $('skyT').max = String(TB_MAX); $('skyT').value = String(st.tmin || 0); $('skyTVal').textContent = hhmm(at) + (nextDay ? ' (+1)' : '');
  }
  const ymdParts = ymd => { const [y, m, d] = ymd.split('-').map(Number); return [y, m - 1, d]; };
  const localYmd = at => todayYmdAt(st.tz, at.date);
  function todayYmdAt(tz, d) { try { return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); } catch (e) { return d.toISOString().slice(0, 10); } }

  function obsBox(at, loc, compact) {
    const p = C.at(at, loc), age = DAY ? DAY.ageAt(at) : null, sr = C.searchable(p, st.darkKey, age);
    let cls = 'no', head, body = '';
    if (sr.ok) { cls = 'ok'; head = t.obsOk; }
    else {
      head = t.obsNo;
      const rs = sr.reasons.filter((x, i, a) => !(x === 'low' && a.includes('moonDown')));
      body = '<p>' + rs.map(x => x === 'sun' ? `${t.why.sun} (${t.sunL} ${degf(p.sun.airAlt, 1)} › ${degf(sr.thr, 1)})` : t.why[x]).map(esc).join(' · ') + '</p>';
      if (sr.reasons.length === 1 && sr.reasons[0] === 'sun') cls = 'wait';
    }
    if (!compact && DAY) body += `<p class="small">${esc(t.todayRange)}: ${DAY.ranges.length ? DAY.ranges.map(([a, b]) => minLbl(a) + '–' + minLbl(b)).join(', ') : esc(t.noRange)}</p>`;
    return { html: `<div class="obs ${cls}"><p><strong>${esc(head)}</strong></p>${body}</div>`, p, age, sr };
  }
  function renderMoment(at) {
    const ob = obsBox(at, LOC, false), p = ob.p, ph = C.phaseOf(at);
    let h = ob.html + '<dl class="kv" style="margin-top:8px">';
    h += kv(t.sunL, `${degf(p.sun.alt, 1)} · ${degf(p.sun.az, 0)} ${G.HRSky.card(p.sun.az, st.lang)}`, G.HRSky.phase(p.sun.alt, st.lang), '');
    h += kv(t.moonL, `${degf(p.moon.alt, 1)} · ${degf(p.moon.az, 0)} ${G.HRSky.card(p.moon.az, st.lang)}`);
    h += kv(t.elongNow, degf(p.elong, 1));
    h += kv(t.phaseL, esc(t.phaseName[ph.key]) + ` · ${num(ph.ill * 100, 1)} %`, '', 'txt');
    h += kv(t.ageNow, ob.age != null && ob.age >= 0 ? ageTxt(ob.age) : t.none);
    h += kv(t.riseSet, DAY && DAY.ev ? `☀ ${hhmm(DAY.ev.sunrise)} / ${hhmm(R ? R.gurub : DAY.ev.sunset)} · ☾ ${hhmm(DAY.ev.moonrise)} / ${hhmm(DAY.ev.moonset)}` : t.none, '', 'txt');
    // Sabah hilâli satırı her zaman yer tutar (yerleşim kaymasın)
    const mo = DAY && DAY.morning;
    const moTxt = mo && mo.code !== 'none' ? `${hhmm(mo.sunrise)} · ${esc(t.morningCode[mo.code])} ${t.moonL} ${degf(mo.moonAlt, 1)}, ${degf(mo.moonAz, 0)} ${G.HRSky.card(mo.moonAz, st.lang)}` : t.none;
    h += kv(t.morningTitle + (mo && mo.code !== 'none' ? ' ' + q('hicri') : ''), moTxt, mo && mo.code !== 'none' ? esc(t.morningNote) : '', 'txt');
    h += '</dl>';
    $('moment').innerHTML = h;
  }
  function inWestWindow(at) {
    if (!R || R.cls.code === 'midMonth') return false;
    const end = R.moonUp && R.moonset && R.lagMin > 0 ? R.moonset : R.gurub.AddDays(70 / 1440);
    return at.ut >= R.gurub.ut - 6 / 1440 && at.ut <= end.ut + 2 / 1440;
  }
  function renderSky(at) {
    const west = inWestWindow(at);
    let out;
    const narrow = window.innerWidth < 700, cmp = { compact: narrow, scale: st.fontSize || 1 };
    if (west) { out = G.HRSky.draw(R, LOC, at, st.lang, cmp); $('hSky').innerHTML = esc(t.skyTitle) + ' ' + q('besderece'); $('skyNote').textContent = t.skyNote;
      if (narrow) { $('sky').innerHTML = `<div class="pano-scroll west">${out.svg}</div>`; const box = $('sky').firstChild; requestAnimationFrame(() => { box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2; }); } else $('sky').innerHTML = out.svg; }
    else {
      out = G.HRSky.panorama(LOC, at, st.lang, narrow ? { W: 1100, wide: true, scale: st.fontSize || 1 } : { scale: st.fontSize || 1 }); $('hSky').innerHTML = esc(t.panoTitle); $('skyNote').textContent = t.panoNote;
      if (narrow) { $('sky').innerHTML = `<div class="pano-scroll">${out.svg}</div>`; const box = $('sky').firstChild, sv = box.querySelector('svg'); requestAnimationFrame(() => { box.scrollLeft = Math.max(0, out.read.mx * sv.clientWidth - box.clientWidth / 2); }); }
      else $('sky').innerHTML = out.svg;
    }
    $('guides').innerHTML = guidesHtml(at);
    const rd = out.read, flags = rd.flags.slice();
    const thr = C.DARK[st.darkKey], sg = C.at(at, LOC).sun.airAlt;
    if (sg <= -0.8333 && sg > thr) flags.push(t.why.sun);
    $('skyWhere').innerHTML = (rd.where ? `<strong>${t.moonPos}:</strong> ${esc(rd.where)} ` : '') + (flags.length ? `<span class="flag">${esc(flags.join(' · '))}</span>` : '');
    const pl = rd.objs.length ? rd.objs.map(o => `${esc(o.name)} (${num(o.alt, 0)}°, ${G.HRSky.card(o.az, st.lang)})`).join(', ') : t.noPlanets;
    $('skyRead').innerHTML = `<div><b>${t.phase}</b>${esc(rd.phase)}</div><div><b>${t.alt}</b>${degf(rd.moonAlt, 1)} · ${t.az.split(' ')[0]} ${degf(rd.moonAz, 1)} (${rd.card})</div><div><b>${t.planetsNear}</b>${pl}${rd.objs.some(o => /Venüs|Merkür|Venus|Mercury/.test(o.name)) ? `<br><span class="small">${esc(t.planetWarn)}</span>` : ''}</div>`;
  }

  // ---- Gözlem gecesi seçimi (tek değerlendirme: HRCore.evening) ----
  // Seçilen türdeki gece, o ayın tam taramasında `from`dan önce kalıyorsa (ay çoktan başlamışsa) sonraki aya geçilir
  function findNight(kind, fromYmd) {
    let from = fromYmd;
    for (let i = 0; i < 4; i++) {
      const o = C.observationNights(LOC, from); if (!o) return null;
      const cd = o.conj.date, c0 = ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
      const full = C.observationNights(LOC, addDays(c0, -1));
      const fx = full && Math.abs(full.conj.ut - o.conj.ut) < 1 ? (kind === 'B' ? full.b : full.a) : null;
      const x = kind === 'B' ? o.b : o.a;
      if (x && !(fx && fx.ymd < fromYmd)) return x;
      from = addDays(c0, 6);
    }
    return null;
  }
  // Ay başı rasadı gezintisi: ileri = seçili tarihten SONRAKİ ilk ay başı rasadı; geri = seçili tarihten ÖNCEKİ
  function prevNightOf(kind, ymd) {
    let c = C.lastNewMoonBefore(A.MakeTime(civil(ymd)));
    for (let i = 0; i < 4 && c; i++) {
      const cd = c.date, c0 = ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
      const o = C.observationNights(LOC, addDays(c0, -1));
      const x = o && Math.abs(o.conj.ut - c.ut) < 1 ? (kind === 'B' ? o.b || o.a : o.a) : null;
      if (x && x.ymd < ymd) return x;
      c = C.lastNewMoonBefore(c.AddDays(-1));
    }
    return null;
  }
  // Yaklaşan ay başı rasadı: ilk gecesi (A) `fromYmd` veya sonrasında olan ilk kamerî ay; B aynı ayın ≥ fromYmd olan elverişli akşamı
  function nextRasad(fromYmd) {
    let c = C.lastNewMoonBefore(A.MakeTime(civil(fromYmd)));
    for (let i = 0; i < 5 && c; i++) {
      const cd = c.date, c0 = ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
      const o = C.observationNights(LOC, addDays(c0, -1));
      if (o && Math.abs(o.conj.ut - c.ut) < 1 && o.a && o.a.ymd >= fromYmd) return { a: o.a, b: o.b && o.b.ymd >= fromYmd ? o.b : null };
      c = C.nextNewMoonAfter(c.AddDays(1));
    }
    return { a: null, b: null };
  }
  function goNight(kind, dir = 1) {
    $('nightMsg').textContent = '';
    const x = dir < 0 ? prevNightOf(kind, st.date) : findNight(kind, addDays(st.date, 1));
    if (!x) { $('nightMsg').textContent = t.nightNone; return; }
    setDate(x.ymd, { anchor: 'auto' });
  }
  function goNearestNight() {
    const nx = findNight('A', st.date), pv = findNight('A', addDays(st.date, -27));
    const d = y => Math.abs(civil(y) - civil(st.date));
    let x = nx; if (pv && pv.ymd < st.date && (!nx || d(pv.ymd) < d(nx.ymd))) x = pv;
    if (x) setDate(x.ymd, { anchor: 'auto' });
  }

  // ---- Aylık rü’yet şeridi ----
  let stripSeq = 0;
  function renderStrip() {
    const my = ++stripSeq; const loc = LOC;
    const conj = C.nearestNewMoon(C.solarNoon(st.date, loc.lon));
    const cd = conj.date, base = ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
    const days = []; for (let k = -3; k <= 29; k++) days.push(addDays(base, k));
    $('strip').innerHTML = `<span class="small">${esc(t.stripLoading)}</span>`;
    const res = []; let i = 0, nights = null;
    const step = () => {
      if (my !== stripSeq) return;
      const t0 = performance.now();
      while (i < days.length && performance.now() - t0 < 30) {
        const ymd = days[i], r = eveningCached(loc, ymd);
        let mo = null; if (i <= 4) { try { mo = C.morning(loc, ymd); } catch (e) { mo = null; } }
        res.push({ ymd, r, mo }); i++;
      }
      if (i < days.length) { setTimeout(step, 0); return; }
      try { nights = C.observationNights(loc, addDays(base, -1)); } catch (e) { nights = null; }
      paintStrip(res, nights);
    };
    setTimeout(step, 0);
  }
  function paintStrip(res, nights) {
    const today = todayYmd(st.tz);
    const wd = new Intl.DateTimeFormat(locale(), { timeZone: 'UTC', weekday: 'short' });
    const mon = new Intl.DateTimeFormat(locale(), { timeZone: 'UTC', month: 'short' });
    // Günler, yerel hesâbî kamerî aya göre gruplanır; her grubun başında ayın adı yazar. Ay başının belirsiz olduğu gün “1?” ile işaretlenir.
    const items = res.map(x => { let h = null, hn = null, hg = null; try { h = hijriOf(x.ymd, true); hn = hijriOf(addDays(x.ymd, 1), true); hg = hijriOf(x.ymd); } catch (e) { /* */ } return Object.assign({ h, hn, hg }, x); });
    const groups = [];
    for (const it of items) { const key = it.h ? `${it.h.month.y}-${it.h.month.m}` : '?'; if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key, month: it.h && it.h.month, list: [] }); groups[groups.length - 1].list.push(it); }
    let k = 0;
    $('strip').innerHTML = groups.map(g => `<div class="sgrp"><div class="sgh">${g.month ? `<b>${esc(monthName(g.month.m))} ${g.month.y}</b> <span class="small">${esc(t.stripHesabi)}</span>` : ''}</div><div class="sgd">` + g.list.map(({ ymd, r, mo, h, hn, hg }) => {
      const code = r.ok ? r.cls.code : 'none';
      const col = CLS_COLOR[code];
      const tag = nights && nights.a && nights.a.ymd === ymd ? (nights.b && nights.b.ymd === ymd ? 'A·B' : 'A') : nights && nights.b && nights.b.ymd === ymd ? 'B' : '';
      const mtag = mo && mo.code === 'possible' ? (st.lang === 'tr' ? 's' : 'm') : '';
      const d = civil(ymd), dn = d.getUTCDate(), first = k++ === 0;
      const amb = h && h.dayTxt.startsWith('1 |');
      const hd = h ? (amb ? '1?' : h.dayTxt.split(' | ')[0]) : '';
      const ttl = [`${fmtCivil(d)} — ${r.ok ? clsText(r)[0] : t.lgNoSun}`,
        h ? `${t.stripDay}: ${h.plain}` : '', hn ? `${t.stripEve}: ${hn.plain}` : '',
        hg && h && hg.plain !== h.plain ? `${t.hjGlobal} (${t.stripDay.toLowerCase()}): ${hg.plain}` : '', t.stripHesabiLong].filter(Boolean).join('\n');
      return `<button type="button" data-ymd="${ymd}" title="${esc(ttl)}"${ymd === st.date ? ' aria-current="date"' : ''} class="${ymd === today ? 'today' : ''}${amb ? ' amb' : ''}">${tag ? `<span class="tag">${tag}</span>` : ''}${mtag ? `<span class="mtag">${mtag}</span>` : ''}<span class="small">${esc(dn === 1 || first ? mon.format(d) : wd.format(d))}</span><span class="d">${dn}</span><span class="sw" style="${col ? `background:var(${col});opacity:1` : ''}"></span><span class="hd">${esc(hd)}</span></button>`;
    }).join('') + '</div></div>').join('');
    $('strip').querySelectorAll('[data-ymd]').forEach(b => b.onclick = () => setDate(b.dataset.ymd, { anchor: 'auto' }));
  }

  function scopePlaces(m) { return m === 12 ? [[st.lat, st.lon]] : null; }
  const earlyCache = new Map();
  function earliest(conj, places) { const k = conj.ut.toFixed(5) + JSON.stringify(places); if (!earlyCache.has(k)) earlyCache.set(k, C.earliestDay(conj, places)); return earlyCache.get(k); }
  const ldCache = new Map();
  function lunarDayC(ymd, local) { const k = ymd + '|' + st.lat + '|' + st.lon + '|' + !!local; if (!ldCache.has(k)) ldCache.set(k, lunarDay(civil(ymd), local)); return ldCache.get(k); }
  // Kapsam: dünya geneli (Ramazân dâhil, s. 315) — Zilhicce’de yerel; local=true her ay için yalnız bu yer
  function lunarDay(dCivil, local) {
    let best = null; let c = C.nextNewMoonAfter(A.MakeTime(new Date(dCivil.getTime() - 40 * 86400000)));
    for (let i = 0; i < 3 && c; i++) { const hm2 = CAL.monthForConjunction(c.date); let e = earliest(c, local ? [[st.lat, st.lon]] : scopePlaces(hm2.m));
      if (hm2.m === 12) { const ik = CAL.methods(hm2.y, 12).isik; if (ik) e = Object.assign({}, e || {}, { first: ik, isik: true }); }  // Zilhicce: kitabın usulü (s. 326)
      if (e && e.first.getTime() <= dCivil.getTime()) best = { e, hm: hm2 }; c = C.nextNewMoonAfter(c.AddDays(1)); }
    if (!best) return null;
    return { n: Math.round((dCivil - best.e.first) / 86400000) + 1, hm: best.hm, isik: !!best.e.isik };
  }
  let MONTH = null;
  function renderMonth(r, loc) {
    const conj = C.nearestNewMoon(r.gurub);
    const hmn = CAL.monthForConjunction(conj.date), isHajj = hmn.m === 12;
    const eG = earliest(conj, null), eL = earliest(conj, [[loc.lat, loc.lon]]), eM = isHajj ? earliest(conj, [MECCA]) : null;
    const meth = CAL.methods(hmn.y, hmn.m);
    MONTH = { conj, hmn, eG, eL, eM, meth, isHajj };
    let a = kv(t.monthName, `${monthName(hmn.m)} ${hmn.y}`, t.monthNote, 'txt');
    a += kv(t.conj + ' ' + q('ictima'), fmtDT(conj), utcSub(conj));
    a += kv(t.scope + ' ' + q('kuresel'), isHajj ? t.scopeLocal : t.scopeGlobal, isHajj ? '' : t.globalScope, 'txt');
    $('month1').innerHTML = a;
    renderMini();
    const ref = isHajj ? eL : eG;
    let b = '';
    if (isHajj && meth.isik) {   // şahitle sabit olmayan yerlerde ana gösterim kitabın usulü; astronomik hesap yanında (s. 326)
      const kb = new Date(meth.isik.getTime() + 9 * 86400000);
      b += kv(t.zhIsik + ' ' + q('isik'), `<strong>${esc(fmtCivil(meth.isik))}</strong>`, t.zhIsikSub, 'txt');
      b += kv(t.zhKurban, `<strong>${esc(fmtCivil(kb))}</strong>`, t.zhKurbanSub, 'txt');
      b += kv(t.zhAstro, eL ? esc(fmtCivil(eL.first)) : t.none, t.zhAstroSub, 'txt');
    }
    if (eM) { b += kv(t.earliestMecca, fmtCivil(eM.first), '', 'txt'); b += kv(t.arefe, fmtCivil(new Date(eM.first.getTime() + 8 * 86400000)), st.lang === 'tr' ? 'veya ertesi gün (s. 360)' : 'or the next day (p. 360)', 'txt'); }
    if (!isHajj) b += kv(t.isikLabel + ' ' + q('isik'), fmtCivil(meth.isik), ref && meth.isik && ymdOf(meth.isik) !== ymdOf(ref.first) ? t.isikDiff : (st.lang === 'tr' ? 'Tam İlmihâl s. 326, 359' : 'Tam İlmihâl pp. 326, 359'), 'txt');
    const hj = hijriOf(st.date);
    if (hj) b += kv(t.lunarDay + ' ' + q('hicri'), `<span class="lunar">${esc(hj.dayTxt)}</span><small>${esc(hj.monthTxt)}</small>`, t.lunarDayNote, 'txt');
    $('month2').innerHTML = b;
    let o = kv(t.ulugbey, fmtCivil(meth.ulugbey), '', 'txt') + kv(t.kindi, fmtCivil(meth.kindi), '', 'txt') + kv(t.tabular, fmtCivil(meth.tabular), '', 'txt');
    if (meth.madde88) o += kv(t.madde88, fmtCivil(meth.madde88.value), meth.madde88.undefinedInBook ? t.undefinedInBook : '', 'txt');
    renderMonth.other = `<dt style="grid-column:1/-1;border:0;padding-top:14px;font-weight:600;color:var(--ink)">${t.otherMethods}</dt>` + o;
  }
  function firstLegend(conj) {
    const cd = conj.date, base = Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate());
    const cols = ['--c-visible', '--c-possible', '--c-below5', '--c-below8'];
    return cols.map((c, k) => `<span><i style="background:var(${c})"></i>${esc(fmtCivil(new Date(base + k * 86400000), true))} ${st.lang === 'tr' ? 'akşamı' : 'evening'}</span>`).join('') +
      `<span><i style="background:var(--c-notborn)"></i>${esc(t.lgLater)}</span><span><i style="background:var(--c-nosun)"></i>${esc(t.lgNoSun)}</span>`;
  }
  let mini = null;
  function renderMini() {
    if (!MONTH || view !== 'plan') return;
    const { conj, eG, eL, isHajj } = MONTH;
    if (!mini) mini = G.HRMap.mount($('miniMap'));
    const marks = [{ lat: st.lat, lon: st.lon, kind: 'user', label: t.youHere }];
    if (eG) marks.push({ lat: eG.where.lat, lon: eG.where.lon, kind: 'earliest', label: t.earliestHere });
    if (isHajj) marks.push({ lat: MECCA[0], lon: MECCA[1], kind: 'user', label: t.meccaLbl });
    mini.render({ mode: 'evening', mini: true, layer: 'first', res: 6, conj, dayUTC: 0, marks, landOnly: st.mapLand });
    mini.onPick(() => { st.mapLayer = 'first'; st.mapMode = 'evening'; save(); fillStatic(); location.hash = '#harita'; });
    $('miniLegend').innerHTML = firstLegend(conj);
    const facts = `<div class="facts"><div><b>${esc(t.miniGlobal)}</b><strong>${eG ? esc(fmtCivil(eG.first)) : t.none}</strong><br><span class="small">${eG ? esc(fmtCivil(eG.evening, true)) + ' ' + (st.lang === 'tr' ? 'akşamı' : 'evening') + ' · ' + degf(eG.where.lat, 1) + ', ' + degf(eG.where.lon, 1) : ''}</span></div>
      <div><b>${esc(t.miniLocal)}</b><strong>${eL ? esc(fmtCivil(eL.first)) : t.none}</strong><br><span class="small">${eL ? esc(fmtCivil(eL.evening, true)) + ' ' + (st.lang === 'tr' ? 'akşamı' : 'evening') : ''}</span></div></div>
      <div class="btns" style="margin-top:8px"><a class="btn" href="#harita" id="openFirstMap">${esc(t.mapOpen)}</a></div>`;
    $('miniHow').innerHTML = esc(t.miniHow) + facts;
    const ofm = $('openFirstMap'); if (ofm) ofm.onclick = () => { st.mapLayer = 'first'; st.mapMode = 'evening'; save(); fillStatic(); };
  }
  function renderExtra(r) {
    let h = '';
    if (r.yallop) { h += kv(t.yallop + ' ' + q('modern'), `${num(r.yallopQ, 3)} · ${r.yallop}`, t.yallopCls[r.yallop]); h += kv(t.odeh, `${num(r.odehV, 2)} · ${r.odeh}`, t.odehCls[r.odeh]); }
    h += kv(t.modernLimit, degf(r.beynunet), r.beynunet < C.K.MODERN_MIN_ELONG ? t.modernBelow : t.modernAbove);
    h += kv(t.bookWindow + ' ' + q('besderece'), r.windowEnd ? `${fmtTime(r.gurub)} – ${fmtTime(r.windowEnd)}` : t.noWindow, r.windowEnd ? t.bookWindowTxt : '');
    if (r.kadihan17) h += kv(t.safak17, r.kadihan17 === 'first' ? t.kFirst : t.kSecond, t.safak17Note, 'txt');
    if (r.W != null) { h += kv(t.width, `${num(r.Wy, 3)}′ / ${num(r.W, 3)}′`); h += kv(t.arcl, `${degf(r.arclGeo)} / ${degf(r.arcl)}`); h += kv(t.arcv, `${degf(r.arcvGeo)} / ${degf(r.arcvTopo)}`); }
    h += kv(t.dip, num(C.dipBook(st.hObs) * 60, 1) + '′', '106,92″ × √h (s. 185)');
    if (r.seri) h += kv(t.zaviye, num(r.seri.zaviye * 60, 1) + '′', `${t.temkin} ${num(r.seri.temkinMin, 2)} ${t.min}`);
    $('extra').innerHTML = h + (renderMonth.other || '');
  }

  // ---- Harita ----
  let big = null, playing = null, MAPP = null;
  function legendFor(layer, conj) {
    const s = (c, l) => `<span><i style="background:var(${c})"></i>${esc(l)}</span>`;
    if (st.mapMode === 'instant') return s('--c-visible', t.lgSearch) + s('--c-below5', t.lgLow) + s('--map-night', t.lgNight) +
      `<span><i style="background:none;border:0;border-top:2px solid var(--accent);height:0"></i>${esc(t.lgDayNight)}</span><span><i style="background:none;border:0;border-top:2px dashed var(--map-iso);height:0"></i>${esc(t.lgMoonHz)}</span>`;
    if (layer === 'first') return firstLegend(conj);
    if (layer === 'yallop') return s('--c-visible', t.yA) + s('--c-possible', t.yB) + s('--c-below5', t.yC) + s('--c-below8', t.yD) + s('--c-notborn', t.yEF) + s('--c-nosun', t.lgNoSun);
    if (layer === 'odeh') return s('--c-visible', t.oA) + s('--c-possible', t.oB) + s('--c-below5', t.oC) + s('--c-notborn', t.oD) + s('--c-nosun', t.lgNoSun);
    return s('--c-visible', t.lgVisible) + s('--c-possible', t.lgPossible) + s('--c-below5', t.lgBelow5) + s('--c-below8', t.lgBelow8) + s('--c-notborn', t.lgNotBorn) + s('--c-nosun', t.lgNoSun) +
      (st.map18 ? `<span><i style="background:none;border:2px dashed var(--accent)"></i>${esc(t.map18)}</span>` : '');
  }
  function mapConj() { return C.nearestNewMoon(A.MakeTime(new Date(st.date + 'T12:00:00Z'))); }
  function mapShift(k) {
    if (st.mapMode === 'evening' && st.mapLayer === 'first') {
      const c = mapConj(), n = k > 0 ? C.nextNewMoonAfter(c.AddDays(5)) : C.lastNewMoonBefore(c.AddDays(-5));
      if (n) { const cd = n.date; setDate(ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate() + 1)))); }
    } else setDate(addDays(st.date, k), { keepLive: false });
  }
  function stepHours(k) { let m = (st.tmin || 0) + k * 60; if (m < 0) { st.tmin = m + 1440; setDate(addDays(st.date, -1)); return; } if (m > TB_MAX) { st.tmin = m - 1440; setDate(addDays(st.date, 1)); return; } setTmin(m); }
  function startPlay() { setLive(false); playing = setInterval(() => { let m = (st.tmin || 0) + 10; if (m > 1440 + 600) { st.tmin = m - 1440; st.anchor = null; setDate(addDays(st.date, 1)); return; } setTmin(m); }, 350); $('mPlay').textContent = t.pause; }
  function stopPlay() { if (playing) { clearInterval(playing); playing = null; } $('mPlay').textContent = t.play; }
  function renderBigMap() {
    if (view !== 'harita') return;
    if (!big) { big = G.HRMap.mount($('bigMap')); big.onPick(pick); }
    const inst = st.mapMode === 'instant';
    ['mLayer', 'mRes'].forEach(id => { $(id).closest('.field').hidden = inst; });
    ['mAge', 'm18', 'mLand'].forEach(id => { $(id).closest('label').hidden = inst; });
    $('mInstCtl').hidden = !inst; $('mPlay').textContent = playing ? t.pause : t.play;
    $('mPrev').title = !inst && st.mapLayer === 'first' ? t.prevMonth : t.prevDay; $('mNext').title = !inst && st.mapLayer === 'first' ? t.nextMonth : t.nextDay;
    const conj = mapConj();
    const dayUTC = Date.UTC(+st.date.slice(0, 4), +st.date.slice(5, 7) - 1, +st.date.slice(8, 10));
    const hmn = CAL.monthForConjunction(conj.date);
    const eG = earliest(conj, null);
    const marks = [{ lat: st.lat, lon: st.lon, kind: 'user', label: t.youHere }];
    if (!inst && eG && (st.mapLayer === 'first' || ymdOf(eG.evening) === st.date)) marks.push({ lat: eG.where.lat, lon: eG.where.lon, kind: 'earliest', label: `${t.earliestHere}: ${fmtCivil(eG.first, true)}` });
    if (hmn.m === 12) marks.push({ lat: MECCA[0], lon: MECCA[1], kind: 'user', label: t.meccaLbl });
    const ageD = (dayUTC - conj.date.getTime()) / 86400000;
    const mid = !inst && st.mapLayer !== 'first' && (ageD > 4.5 || ageD < -2);
    if (inst) {
      MAPP = big.render({ mode: 'instant', t: selT(), darkKey: st.darkKey, borders: st.mapBorders, marks, sunLabel: t.sunSub, moonLabel: t.moonSub });
      $('mapNote').textContent = t.mapInstantNote + ' ' + `${t.mapTime}: ${fmtDT(selT())}${st.timeFmt === 'both' ? ' · ' + fmtUTC(selT()) : ''} · ${t.darkOpt[st.darkKey]}`;
    } else {
      MAPP = big.render({ mode: 'evening', layer: st.mapLayer, res: st.mapRes, conj, dayUTC, marks, age: st.mapAge, borders: st.mapBorders, landOnly: st.mapLand, m18: st.map18 ? C.moment18(conj, 0) : null, message: mid ? t.midHint : '' });
      $('mapNote').textContent = (st.mapLayer === 'first' ? t.mapNoteFirst : st.mapLayer === 'seadet' ? t.mapNoteSeadet : t.mapNoteModern) + ' ' + `${monthName(hmn.m)} ${hmn.y} · ${t.conj}: ${fmtDT(conj)}` + (mid ? ' · ' + t.midHint : '') + ' · ' + t.lgOutline;
    }
    $('mapLegend').innerHTML = legendFor(st.mapLayer, conj);
    $('mDate').disabled = !inst && st.mapLayer === 'first';
  }
  function pick(lat, lon) {
    const box = $('pickBox'); box.hidden = false;
    const ploc = { lat, lon, elev: 0, hObs: 0, tz: st.tz };
    let h = kv(t.pick, `${degf(lat, 2)}, ${degf(lon, 2)}`);
    if (st.mapMode === 'instant') {
      const at = selT(), p = C.at(at, ploc), cP = C.lastNewMoonBefore(at), sr = C.searchable(p, st.darkKey, cP ? (at.ut - cP.ut) * 24 : null);
      h += kv(t.mapTime, fmtUTC(at)) + kv(t.sunL, degf(p.sun.alt, 1)) + kv(t.moonL, `${degf(p.moon.alt, 1)} · ${G.HRSky.card(p.moon.az, st.lang)}`) + kv(t.momentTitle, esc(sr.ok ? t.obsOk : t.obsNo + ' ' + sr.reasons.map(x => t.why[x]).join(' · ')), '', 'txt');
    } else {
      let r; try { r = C.evening(ploc, st.date); } catch (e) { r = null; }
      if (!r || !r.ok) h += kv(t.status, esc(t.lgNoSun), '', 'txt');
      else h += kv(t.status, esc(clsText(r)[0]), '', 'txt') + kv(t.gurub, fmtUTC(r.gurub)) + kv(t.beyn, degf(r.beynunet)) + kv(t.alt, degf(r.moonAlt)) + kv(t.lag, hm(r.lagMin)) + kv(t.age, ageTxt(r.ageH));
    }
    $('pickKv').innerHTML = h;
    $('pickUse').onclick = () => { st.lat = lat; st.lon = lon; st.city = 'custom'; tzFromLon(); save(); fillStatic(); update(); location.hash = '#plan'; };
  }

  // ---- Saha ----
  let fTimer = null, fSkyAt = 0, wakeLock = null, heading = null, compassOn = false;
  function fieldStart() { fieldTick(true); renderBar(); if (!fTimer) fTimer = setInterval(() => { fieldTick(false); if (new Date().getSeconds() === 0) renderBar(); }, 1000); }
  function fieldStop() { if (fTimer) { clearInterval(fTimer); fTimer = null; } }
  function cdTxt(target, now) { if (!target) return t.none; const s = Math.round((target.ut - now.ut) * 86400); if (s < 0) return t.passed; const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); }
  let FR = null, FRdate = null, FAge = null, FRange = null;
  // Bu akşamın aranabilir aralığı (seçili karanlık eşiğine göre, dakika hassasiyetinde)
  function eveningRange(r, loc) {
    if (!r || !r.ok || r.cls.code === 'midMonth' || !r.windowEnd || !r.ictimaPrev) return null;
    const ok = tt => C.searchable(C.at(tt, loc), st.darkKey, (tt.ut - r.ictimaPrev.ut) * 24).ok;
    let a = null, b = null;
    for (let m = -10; m <= Math.round((r.windowEnd.ut - r.gurub.ut) * 1440) + 5; m++) { const tt = r.gurub.AddDays(m / 1440); if (ok(tt)) { if (!a) a = tt; b = tt; } else if (a) break; }
    return a ? [a, b] : null;
  }
  function fieldTrack(r, loc, now, rng) {
    if (!r || !r.ok || r.cls.code === 'midMonth') return '';
    const t0 = r.gurub.AddDays(-40 / 1440), endA = Math.max(r.windowEnd ? r.windowEnd.ut : r.gurub.ut, r.moonset && r.moonUp ? r.moonset.ut : r.gurub.ut);
    const t1 = A.MakeTime(new Date((Math.min(endA, r.gurub.ut + 4 / 24) + 15 / 1440 - t0.ut) * 86400000 + t0.date.getTime()));
    const W = window.innerWidth < 700 ? 400 : 720, H = 74, span = t1.ut - t0.ut, X = tt => (tt.ut - t0.ut) / span * W;
    let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t.fTrackNote)}"><defs><linearGradient id="ftN" x1="0" x2="1">`;
    for (let i = 0; i <= 24; i++) { const tt = t0.AddDays(span * i / 24), sa = C.at(tt, loc).sun.airAlt; g += `<stop offset="${(i / 24).toFixed(3)}" stop-color="var(--map-night)" stop-opacity="${sa > -0.8333 ? 0 : Math.min(0.85, 0.2 + (-sa / 18) * 0.65).toFixed(2)}"/>`; }
    g += `</linearGradient></defs><rect x="0" y="0" width="${W}" height="34" rx="5" fill="var(--sky-day)" opacity=".35"/><rect x="0" y="0" width="${W}" height="34" rx="5" fill="url(#ftN)"/>`;
    if (r.windowEnd) g += `<rect x="${X(r.gurub)}" y="4" width="${Math.max(2, X(r.windowEnd) - X(r.gurub))}" height="10" rx="2" fill="var(--c-possible)"/>`;
    if (rng) g += `<rect x="${X(rng[0])}" y="17" width="${Math.max(3, X(rng[1]) - X(rng[0]))}" height="12" rx="2" fill="var(--c-visible)"/>`;
    const tick = (tt, lbl, row) => { if (!tt || tt.ut < t0.ut || tt.ut > t1.ut) return ''; return `<line x1="${X(tt)}" x2="${X(tt)}" y1="0" y2="40" stroke="var(--ink)" stroke-opacity=".5"/><text x="${Math.min(W - 30, Math.max(30, X(tt)))}" y="${52 + row * 15}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="600">${lbl} ${hhmm(tt)}</text>`; };
    g += tick(r.gurub, '☀↓', 0) + tick(r.windowEnd, '5°', 1) + tick(r.moonUp ? r.moonset : null, '☾↓', 0);
    if (now.ut >= t0.ut && now.ut <= t1.ut) g += `<line x1="${X(now)}" x2="${X(now)}" y1="0" y2="38" stroke="var(--accent)" stroke-width="3"/><circle cx="${X(now)}" cy="38" r="5" fill="var(--accent)"/>`;
    return g + '</svg>';
  }
  // Saha şeridi: sayfa kaydırılsa da görünen saat, sıradaki olaya geri sayım ve ince akşam çubuğu
  function fieldStrip(now, r, rng, mid) {
    const clock = new Intl.DateTimeFormat(locale(), { timeZone: st.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now.date);
    const ev = [];
    if (r && r.ok && !mid) { ev.push(['gurub', r.gurub]); if (rng) { ev.push(['win', rng[0]], ['end', rng[1]]); } if (r.moonUp && r.moonset) ev.push(['set', r.moonset]); }
    const nx = ev.filter(([, at]) => at.ut > now.ut).sort((a, b) => a[1].ut - b[1].ut)[0];
    $('fsTxt').innerHTML = `⏱ <b>${clock}</b> · ` + (nx ? `${esc(t.fsNext[nx[0]])} <b>${cdTxt(nx[1], now)}</b> (${hhmm(nx[1])})` : esc(mid || !r || !r.ok ? t.fsNone : t.fNowAfter));
    if (!r || !r.ok || mid) { $('fsBar').innerHTML = ''; return; }
    const t0 = r.gurub.ut - 40 / 1440, end = Math.max(rng ? rng[1].ut : r.gurub.ut, r.moonUp && r.moonset ? r.moonset.ut : r.gurub.ut) + 15 / 1440, span = end - t0, X = u => Math.max(0, Math.min(400, (u - t0) / span * 400));
    let g = `<svg viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="3" width="400" height="8" rx="4" fill="var(--surface-2)" stroke="var(--line)"/>`;
    if (r.windowEnd) g += `<rect x="${X(r.gurub.ut)}" y="3" width="${Math.max(2, X(r.windowEnd.ut) - X(r.gurub.ut))}" height="4" fill="var(--c-possible)"/>`;
    if (rng) g += `<rect x="${X(rng[0].ut)}" y="7" width="${Math.max(2, X(rng[1].ut) - X(rng[0].ut))}" height="4" fill="var(--c-visible)"/>`;
    if (now.ut >= t0 && now.ut <= end) g += `<rect x="${X(now.ut) - 1.5}" y="0" width="3" height="14" fill="var(--accent)"/>`;
    $('fsBar').innerHTML = g + '</svg>';
  }
  function fieldTick(full) {
    const nowD = new Date(), now = A.MakeTime(nowD), loc = locObj();
    $('fClock').textContent = new Intl.DateTimeFormat(locale(), { timeZone: st.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(nowD);
    const today = todayYmd(st.tz);
    if (full || FRdate !== today || !FR || FRange === undefined) { FR = eveningCached(loc, today); FRdate = today; FAge = C.lastNewMoonBefore(now); FRange = eveningRange(FR, loc); }
    const city = CITIES.find(c => c.id === st.city);
    // Güneş ufkun üstündeyken göz güvenliği uyarısı; pusula açıkken yaklaşıklık notu
    let sunUp = false; try { sunUp = C.at(now, loc).sun.alt > -1; } catch (e) { /* */ }
    const fShow = sunUp && !st.safetyOff && sightPossible(eveningCached(loc, todayYmd(st.tz))); $('fSafety').hidden = !fShow; if (fShow) $('fSafety').textContent = t.safety; $('fCompassNote').hidden = !compassOn;
    $('fDate').textContent = `${fmtCivil(civil(today))} · ${city ? city[st.lang] : (st.locAuto ? t.myPlace : degf(st.lat, 2) + ', ' + degf(st.lon, 2))}`;
    if (!FR || !FR.ok) { $('fStatus').innerHTML = ''; $('fBig').textContent = t.none; return; }
    // Büyük durum satırı: şimdi ne yapmalı
    const mid = FR.cls.code === 'midMonth', rng = FRange;
    let cls = 'no', head = t.fNowNo, sub = mid ? t.midHint : clsText(FR)[0];
    if (rng) {
      sub = t.fNowWin(hhmm(rng[0]), hhmm(rng[1]));
      if (now.ut < rng[0].ut) { cls = 'wait'; const sec = Math.round((rng[0].ut - now.ut) * 86400), h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60); head = t.fNowWait(h ? `${h} ${t.h} ${m} ${t.min}` : `${m} ${t.min} ${sec % 60} sn`); }
      else if (now.ut <= rng[1].ut + 1 / 1440) { cls = 'ok'; head = t.fNowOk; }
      else { cls = 'no'; head = t.fNowAfter; }
    }
    $('fBig').className = 'fbig ' + cls; $('fBig').innerHTML = `${esc(head)}<small>${esc(sub)}</small>`;
    fieldStrip(now, FR, rng, mid);
    $('fCd').innerHTML = [[t.cdGurub, FR.gurub], [t.cdBest, !mid ? FR.best : null], [t.cdWin, !mid ? FR.windowEnd : null], [t.cdSet, FR.moonUp ? FR.moonset : null]]
      .filter(x => x[1]).map(([l, at]) => `<div><b>${esc(l)} · ${hhmm(at)}</b><span>${cdTxt(at, now)}</span></div>`).join('');
    if (full) {
      const [title, sub2] = clsText(FR), [claim, ccls] = claimOf(FR);
      $('fStatus').innerHTML = `<div class="status s-${CLS_STYLE[FR.cls.code]}" style="margin-top:10px"><div class="bar"></div><div><p class="small" style="margin:0">${esc(t.fTonight)}</p><h2>${esc(title)} ${q(CLS_TOPIC[FR.cls.code])}</h2><p class="sub">${esc(sub2)}</p><span class="pill ${ccls}">${esc(claim)}</span>${FR.cls.code !== 'midMonth' ? kadihanHtml(FR, true) : ''}</div></div>`;
      let mo = null; try { mo = C.morning(loc, today); } catch (e) { mo = null; }
      $('fMorning').textContent = mo && mo.code !== 'none' ? `${t.fMorning} ${hhmm(mo.sunrise)}: ${t.morningCode[mo.code]} ${t.morningNote}` : '';
      const hj = hijriAt(now); $('fHijri').innerHTML = hj ? (hj.local ? hj.html2 : hj.html) : '';
    }
    if (full || Date.now() - fSkyAt > Math.max(5, st.liveInt || 10) * 1000) {
      fSkyAt = Date.now();
      $('fTrack').innerHTML = fieldTrack(FR, loc, now, rng);
      // Gök görünümü her zaman ŞİMDİ içindir: batı penceresindeyse batı ufku, değilse bütün ufuk
      const inWin = !mid && now.ut > FR.gurub.ut - 6 / 1440 && ((FR.moonUp && FR.moonset && now.ut < FR.moonset.ut + 2 / 1440) || now.ut < FR.gurub.ut + 70 / 1440);
      const narrow = window.innerWidth < 700;
      let out;
      if (inWin) { out = G.HRSky.draw(FR, loc, now, st.lang, { compact: narrow, scale: st.fontSize || 1 }); $('fSky').innerHTML = narrow ? `<div class="pano-scroll west">${out.svg}</div>` : out.svg; }
      else { out = G.HRSky.panorama(loc, now, st.lang, narrow ? { W: 1100, wide: true, scale: st.fontSize || 1 } : { scale: st.fontSize || 1 }); $('fSky').innerHTML = narrow ? `<div class="pano-scroll">${out.svg}</div>` : out.svg; }
      const box = $('fSky').firstChild; if (box && box.classList && box.classList.contains('pano-scroll')) requestAnimationFrame(() => { const sv = box.querySelector('svg'); box.scrollLeft = out.read.mx != null ? Math.max(0, out.read.mx * sv.clientWidth - box.clientWidth / 2) : (box.scrollWidth - box.clientWidth) / 2; });
      const where = out.read.where || `${t.moonL}: ${degf(out.read.moonAz, 0)} ${out.read.card}, ${degf(out.read.moonAlt, 1)}`;
      $('fWhere').innerHTML = `<strong>${esc(t.fNowLook)} · ${hhmm(now)}:</strong> ${esc(where)} ${out.read.flags.length ? `<span class="flag">${esc(out.read.flags.join(' · '))}</span>` : ''}`;
      fieldTick.moonAz = out.read.moonAz;
      $('fGuides').innerHTML = guidesHtml(now, loc);
      $('fWx').innerHTML = WX.data && FR ? wxMini(FR) : '';
    }
    if (compassOn) $('fHeading').textContent = heading == null ? t.compassFail : `${t.heading}: ${Math.round(heading)}° · ${t.turn(((fieldTick.moonAz - heading + 540) % 360) - 180)}`;
    else $('fHeading').textContent = '';
    renderRecords();
  }
  async function toggleWake() {
    try {
      if (wakeLock) { await wakeLock.release(); wakeLock = null; $('fWake').setAttribute('aria-pressed', 'false'); $('fMsg').textContent = ''; return; }
      wakeLock = await navigator.wakeLock.request('screen'); $('fWake').setAttribute('aria-pressed', 'true'); $('fMsg').textContent = '';
      wakeLock.addEventListener('release', () => { wakeLock = null; $('fWake').setAttribute('aria-pressed', 'false'); });
    } catch (e) { $('fMsg').textContent = t.wakeFail; }
  }
  function onOrient(e) {
    if (typeof e.webkitCompassHeading === 'number') heading = e.webkitCompassHeading;
    else if (e.absolute && e.alpha != null) heading = (360 - e.alpha) % 360;
  }
  async function toggleCompass() {
    compassOn = !compassOn; $('fCompass').setAttribute('aria-pressed', String(compassOn));
    if (!compassOn) { window.removeEventListener('deviceorientationabsolute', onOrient); window.removeEventListener('deviceorientation', onOrient); return; }
    try {
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') { const p = await DeviceOrientationEvent.requestPermission(); if (p !== 'granted') throw new Error('denied'); }
      window.addEventListener('deviceorientationabsolute', onOrient); window.addEventListener('deviceorientation', onOrient);
      setTimeout(() => { if (heading == null) $('fHeading').textContent = t.compassFail; }, 2500);
    } catch (e) { $('fHeading').textContent = t.compassFail; }
  }
  // Kayıt zamanı (seçili saat diliminde) ve ait olduğu akşam
  function resetRecAt() {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: st.tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const g = k => p.find(x => x.type === k).value;
    $('recAt').value = `${g('year')}-${g('month')}-${g('day')}T${g('hour')}:${g('minute')}`; showRecEvening();
  }
  function recTime() {
    const v = $('recAt').value; if (!v) return A.MakeTime(new Date());
    const [d, hmv] = v.split('T'), [hh, mm] = hmv.split(':').map(Number);
    return A.MakeTime(new Date(C.localToUT(d, hh * 60 + mm, st.tz)));
  }
  // Kayıt anının ait olduğu akşam: o yerel günün gurûbundan sonra ise o gün; gün doğumundan önceyse bir önceki gün; aradaysa gündüz
  function recEveningOf(at) {
    const loc = locObj(), d = todayYmdAt(st.tz, at.date);
    const r = eveningCached(loc, d);
    if (r.ok && at.ut >= r.gurub.ut) return { ymd: d, r, day: false };
    let ev = null; try { ev = C.dayEvents(loc, d, st.tz); } catch (e) { ev = null; }
    if (ev && ev.sunrise && at.ut < ev.sunrise.ut) { const p = addDays(d, -1); return { ymd: p, r: eveningCached(loc, p), day: false }; }
    return { ymd: d, r, day: true };
  }
  function showRecEvening() { const e = recEveningOf(recTime()); $('recEvLbl').textContent = e.day ? t.recDayLbl : t.recEvening(fmtCivil(civil(e.ymd))); }
  // ---- Rü’yet kaydı v2: ICOP benzeri alanlar + fıkhî alanlar, SHA-256 özeti, cihaz imzası ----
  function evaluateRecord(result, at) {
    const saw = !['not', 'noObs'].includes(result), e = recEveningOf(at), r = e.r;
    if (result === 'noObs') return { txt: t.evNoObs, cls: 'p-info', ymd: e.ymd, e };
    if (!saw) return { txt: t.evNotSaw, cls: 'p-info', ymd: e.ymd, e };
    if (!r || !r.ok) return { txt: t.none, cls: 'p-info', ymd: e.ymd, e };
    if (e.day) return { txt: t.evDay, cls: 'p-warn', ymd: e.ymd, e };
    if (r.cls.reject) return { txt: t.evReject, cls: 'p-bad', ymd: e.ymd, e };
    if (r.moonset && at.ut > r.moonset.ut + 2 / 1440) return { txt: t.evAfterSet, cls: 'p-warn', ymd: e.ymd, e };
    const p = C.at(at, locObj()), parts = [];
    if (p.moon.alt < 5) parts.push(t.evWarn5);
    if (r.kadihan19) parts.push((r.kadihan19 === 'first' ? t.kFirst : t.kSecond) + (r.kadihanDiffer ? ` (${t.kdB}: ${r.kadihan17 === 'first' ? t.kdFirst : t.kdSecond})` : ''));
    if (result === 'aided' || result === 'photo') parts.push(t.evAided);
    if (result === 'doubt') parts.push(t.evDoubt);
    parts.push(t.evOk);
    return { txt: parts.join(' '), cls: ['aided', 'photo', 'doubt'].includes(result) || p.moon.alt < 5 ? 'p-warn' : 'p-ok', ymd: e.ymd, e };
  }
  async function photoOf(file) {
    if (!file) return null;
    try {
      const buf = await file.arrayBuffer(), h = await G.HRSig.sha256(buf);
      const bmp = await createImageBitmap(new Blob([buf]));
      const k = Math.min(1, 520 / Math.max(bmp.width, bmp.height)), cv = document.createElement('canvas');
      cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k); cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
      return { sha256: h, name: file.name, thumb: cv.toDataURL('image/jpeg', 0.72) };
    } catch (e) { return null; }
  }
  const isoT = at => at ? at.date.toISOString() : null;
  // çelişen form bilgileri kayıttan önce yakalanır
  function recFormError() {
    const result = $('recRes').value, seen = !['not', 'noObs'].includes(result);
    if (seen && result !== 'doubt' && (+$('recSeers').value || 0) < 1) return t.recErrSeers;
    const f = $('recFirst').value, l = $('recLast').value; if (f && l && f > l) return t.recErrOrder;
    if (recTime().date.getTime() > Date.now() + 10 * 60000) return t.recErrFuture;
    return null;
  }
  async function addRecord() {
    const err = recFormError(); if (err) { $('recEval').innerHTML = `<span class="pill p-bad">${esc(err)}</span>`; toast(err); return; }
    const at = recTime(), result = $('recRes').value, ev = evaluateRecord(result, at), loc = locObj(), r = ev.e.r;
    const p = C.at(at, loc), city = CITIES.find(c => c.id === st.city);
    const rec = {
      schema: 'hilal-ruyet-kaydi/1', id: (G.crypto && G.crypto.randomUUID ? G.crypto.randomUUID() : 'r' + Date.now().toString(36)), created: new Date().toISOString(),
      app: { name: 'Mâh-ı Nev', version: G.HR_VERSION, source: HOME, official: OFFICIAL !== false, engine: 'Astronomy Engine 2.1.19', rules: G.HR_RULES, models: 'Yallop 1997 (geo ARCL); Odeh 2004 (topo)' },
      observer: { name: $('recName').value.trim(), contact: $('recContact').value.trim() },
      place: { name: city ? city[st.lang] : (st.locAuto ? t.myPlace : ''), lat: st.lat, lon: st.lon, elev: st.elev, hObs: st.hObs, tz: st.tz, site: $('recPlace').value },
      observation: { at: at.date.toISOString(), evening: ev.ymd, result, firstSeen: $('recFirst').value || null, lastSeen: $('recLast').value || null, sky: $('recSky').value, companions: +$('recWith').value || 0, seers: +$('recSeers').value || 0, note: $('recNote').value.trim() },
      computed: r && r.ok ? { ictima: isoT(r.ictimaPrev), gurub: isoT(r.gurub), seriGurub: r.seri && r.seri.seri ? isoT(r.seri.seri) : null, moonset: isoT(r.moonset), windowEnd: isoT(r.windowEnd),
        beynunet: +r.beynunet.toFixed(3), moonAltGurub: +r.moonAlt.toFixed(3), lagMin: r.lagMin != null ? +r.lagMin.toFixed(1) : null, ageH: r.ageH != null ? +r.ageH.toFixed(2) : null, cls: r.cls.code, kadihan: r.kadihan19 || null,
        atObs: { moonAlt: +p.moon.alt.toFixed(3), moonAz: +p.moon.az.toFixed(2), sunAlt: +p.sun.alt.toFixed(3), elong: +p.elong.toFixed(3) }, evaluation: ev.txt, evalClass: ev.cls } : null,
      photo: await photoOf($('recPhoto').files && $('recPhoto').files[0])
    };
    // içerik önce kesinleşir, mühür (özet + imza) son içeriğe vurulur, sonra saklamanın başarısı denetlenir.
    const sealOf = async x => { try { return await G.HRSig.seal(x); } catch (e) { return x; } };
    let sealed = await sealOf(rec), stored = storeRecs([sealed, ...records]);
    if (!stored && rec.photo && rec.photo.thumb) {   // depolama dolu: önizlemesiz içerikle YENİDEN mühürle
      rec.photo = Object.assign({}, rec.photo, { thumb: null, thumbDropped: true });
      sealed = await sealOf(rec); stored = storeRecs([sealed, ...records]);
    }
    if (!stored) {
      $('recEval').innerHTML = `<span class="pill p-bad">${esc(t.recStoreFail)}</span>`;
      saveFile(recBase(sealed, 'record') + '.json', JSON.stringify(sealed, null, 2), 'application/json');
      return;
    }
    records.unshift(sealed);
    if (records.length >= REC_WARN) toast(t.recMany(records.length), 8000);
    $('recNote').value = ''; $('recPhoto').value = ''; $('recFirst').value = ''; $('recLast').value = '';
    $('recEval').innerHTML = `<span class="pill ${ev.cls}">${esc(t.recRes[result])}</span> ${esc(ev.txt)}${sealed.observer.name ? '' : `<br><span class="small">${esc(t.recAnon)}</span>`}${sealed.photo && sealed.photo.thumbDropped ? `<br><span class="small">${esc(t.recThumbDropped)}</span>` : ''}<br><span class="hash">${esc(t.recHash)}: ${esc(sealed.hash || t.none)}${sealed.signer ? ` · ${esc(t.recSig)}: ${esc(sealed.signer.fp)}` : ` · ${esc(t.recNoSig)}`}</span>`;
    toast(t.recSaved); renderRecords(true); resetRecAt();
  }
  function recText(x) {
    const o = x.observation, c = x.computed, pl = x.place;
    const tz = pl.tz || st.tz, at = new Date(o.at), f = d => d ? new Intl.DateTimeFormat(locale(), { timeZone: tz, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d)) : t.none;
    const L = [`${t.tutTitle} — ${t.recRes[o.result] || o.result}`, `${t.recAt}: ${f(at)} (${o.at.slice(0, 16).replace('T', ' ')} UTC) · ${t.recEvening(fmtCivil(civil(o.evening)))}`,
      `${t.recPlace}: ${pl.name ? pl.name + ' · ' : ''}${pl.lat.toFixed(4)}, ${pl.lon.toFixed(4)} · ${pl.elev} m · ${t.recPlaceOpts[pl.site] || ''} · ${t.recSky}: ${t.recSkyOpts[o.sky] || ''}`,
      `${t.recName}: ${x.observer.name || '—'}${x.observer.contact ? ' (' + x.observer.contact + ')' : ''} · ${t.recWith}: ${o.companions} · ${t.recSeers}: ${o.seers}`];
    if (o.firstSeen || o.lastSeen) L.push(`${t.recFirst}: ${o.firstSeen || '—'} · ${t.recLast}: ${o.lastSeen || '—'}`);
    if (c) L.push(`${t.tutCalc}: ${t.gurub} ${f(c.gurub)} · ${t.beyn.split(' ')[0]} ${c.beynunet.toFixed(2)}° · ${t.alt.split(' ')[0]} ${c.atObs.moonAlt.toFixed(2)}° · ${t.cls[c.cls === 'notBorn' ? 'notBorn_beforeConj' : c.cls] ? t.cls[c.cls === 'notBorn' ? 'notBorn_beforeConj' : c.cls][0] : c.cls}`);
    if (o.note) L.push(`${t.notes}: ${o.note}`);
    if (!x.observer.name) L.push(t.recAnon);
    L.push(`SHA-256: ${x.hash || '—'}${x.signer ? ' · key ' + x.signer.fp : ''}`, `${t.appTitle} v${(x.app && x.app.version) || ''}${x.app && x.app.rules ? ' · ' + t.traceRules + ' ' + x.app.rules : ''}${x.app && x.app.official === false ? ' · ' + t.tamperShort : ''}`);
    return L.join('\n');
  }
  async function saveFile(name, data, mime) {
    if (!ON.sandboxed) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: mime })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); return true; }
    const dl = await getDownloads(); if (!dl) { toast(t.printNA); return false; }
    try { await dl.save({ filename: name, data }); return true; } catch (e) { toast(e && e.code === 'declined' ? t.printDeclined : t.printNA); return false; }
  }
  // ---- yedekleme, geri yükleme, fotoğraf doğrulama ----
  function backupRecords() {
    const data = { schema: 'mahinev-kayit-yedegi/1', created: new Date().toISOString(), app: { name: 'Mâh-ı Nev', version: G.HR_VERSION }, records };
    saveFile(fileBase('backup', { ymd: todayYmd(st.tz), hhmm: hhmmTz(new Date(), st.tz), place: '' }) + '.json', JSON.stringify(data, null, 2), 'application/json');
  }
  async function importRecords(ev) {
    const f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (!f) return;
    let list = null;
    try { const j = JSON.parse(await f.text()); list = Array.isArray(j) ? j : j && Array.isArray(j.records) ? j.records : j && j.schema === 'hilal-ruyet-kaydi/1' ? [j] : null; } catch (e) { list = null; }
    if (!list) { toast(t.recImportBad); return; }
    const have = new Set(records.map(x => x.id || x.ts)); let add = 0, dup = 0;
    for (const x of list) { if (!x || !(x.schema || x.ts)) continue; const k = x.id || x.ts; if (have.has(k)) { dup++; continue; } have.add(k); records.push(x); add++; }
    records.sort((a, b) => String((b.observation && b.observation.at) || b.ts).localeCompare(String((a.observation && a.observation.at) || a.ts)));
    if (saveRec()) toast(t.recImported(add, dup)); renderRecords(true);
  }
  async function checkPhoto(ev) {
    const f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (!f) return;
    let h = null; try { h = await G.HRSig.sha256(await f.arrayBuffer()); } catch (e) { h = null; }
    const x = h && records.find(r => r.photo && r.photo.sha256 === h);
    const msg = x ? t.recPhotoMatch(`${fmtCivil(civil(x.observation.evening))} · ${x.observer.name || '—'}`) : t.recPhotoNone;
    $('recEval').innerHTML = `<span class="pill ${x ? 'p-ok' : 'p-warn'}">${esc(msg)}</span><br><span class="hash">SHA-256 ${esc(h || '—')}</span>`; toast(msg);
  }
  // ---- Kayıt doğrulama: kâğıttaki kod (QR metni veya SHA-256) + kaydın dijital kopyası (JSON) ----
  function parseRecCode(s) {
    const x = String(s || '').trim().replace(/\s+/g, ''); let m = x.match(/^HRK1\|([^|]+)\|([0-9a-fA-F]{64})$/);
    if (m) return { id: m[1], hash: m[2].toLowerCase() }; if (/^[0-9a-fA-F]{64}$/.test(x)) return { id: null, hash: x.toLowerCase() };
    return x ? { bad: true } : null;
  }
  async function verifyRecordUI() {
    const out = $('vfOut'), code = parseRecCode($('vfCode').value);
    if (code && code.bad) { out.innerHTML = `<span class="pill p-bad">${esc(t.vfBadCode)}</span>`; return; }
    let list = null, src = 'file';
    const f = $('vfFile').files && $('vfFile').files[0];
    if (f) { try { const j = JSON.parse(await f.text()); list = Array.isArray(j) ? j : j && Array.isArray(j.records) ? j.records : [j]; } catch (e) { out.innerHTML = `<span class="pill p-bad">${esc(t.recImportBad)}</span>`; return; } }
    else { list = records; src = 'local'; }
    let cand = list.filter(x => x && x.hash);
    if (code) cand = cand.filter(x => x.hash === code.hash || (code.id && x.id === code.id));
    else if (src === 'local') { out.innerHTML = `<span class="pill p-warn">${esc(t.vfNeed)}</span>`; return; }
    if (!cand.length) { out.innerHTML = `<span class="pill p-bad">${esc(src === 'local' ? t.vfNotHere : t.vfNoMatch)}</span>`; return; }
    const rows = [];
    for (const x of cand.slice(0, 20)) {
      let v = { hash: false, sig: false, fp: false }; try { v = await G.HRSig.verify(x); } catch (e) { /* */ }
      const codeOk = !code || (x.hash === code.hash && (!code.id || code.id === x.id));
      const ok = v.hash && codeOk && (!x.sig || v.sig);
      const o = x.observation || {}, pl = x.place || {};
      rows.push(`<div class="vfr"><span class="pill ${ok ? 'p-ok' : 'p-bad'}">${esc(ok ? t.vfOk : t.vfFail)}</span>
        <dl class="kv">${kv(t.recAt, esc(new Intl.DateTimeFormat(locale(), { timeZone: pl.tz || st.tz, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(o.at))) + ' · ' + esc(pl.name || ''), esc(t.recRes[o.result] || ''), 'txt')}
        ${kv(t.recHash, esc(v.hash ? t.vfHashOk : t.vfHashBad), `<span class="hash">${esc(x.hash)}</span>`, 'txt')}
        ${kv(t.recSig, x.sig ? esc(!v.hash ? t.vfSigNA : v.sig ? t.vfSigOk : t.vfSigBad) : esc(t.recNoSig), x.signer ? `<span class="hash">${esc(x.signer.fp)}</span>` : '', 'txt')}
        ${code ? kv(t.vfCodeRow, esc(!codeOk ? t.vfCodeBad : v.hash ? t.vfCodeOk : t.vfCodeChanged), '', 'txt') : ''}</dl></div>`);
    }
    out.innerHTML = rows.join('');
  }
  // Kayıt listesinde her kaydın özeti ve imzası yeniden doğrulanır
  async function verifyBadges() {
    const els = $('recList').querySelectorAll('[data-ver]');
    for (const el of els) {
      const x = records[+el.dataset.ver]; if (!x || !x.hash) continue;
      let v = { hash: false, sig: false }; try { v = await G.HRSig.verify(x); } catch (e) { /* */ }
      el.innerHTML = v.hash ? `<span class="pill p-ok">✓ ${esc(t.recVerified)}${v.sig ? ' · ECDSA' : ''}</span>` : `<span class="pill p-bad">✗ ${esc(t.recBroken)}</span>`;
    }
  }
  let recShown = -1;
  function renderRecords(force) {
    if (!force && recShown === records.length) return; recShown = records.length;
    if (!records.length) { $('recList').innerHTML = `<p class="small">${esc(t.noRecords)}</p>`; return; }
    $('recList').innerHTML = `<table class="t"><tbody>${records.map((x, i) => {
      if (!x.schema) return `<tr><td class="n">${esc(new Intl.DateTimeFormat(locale(), { timeZone: x.tz, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(x.ts)))}<br><span class="small">${esc(t.recLegacy)}</span></td><td><span class="pill ${x.cls}">${esc(x.saw ? t.saw : t.notSaw)}</span></td><td>${esc(x.ev)}</td><td><button class="btn" type="button" data-del="${i}">${esc(t.del)}</button></td></tr>`;
      const o = x.observation;
      return `<tr><td class="n">${esc(new Intl.DateTimeFormat(locale(), { timeZone: x.place.tz, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(o.at)))}<br><span class="small">${esc(t.recEvening(fmtCivil(civil(o.evening), true)))}</span></td>
        <td><span class="pill ${x.computed ? x.computed.evalClass : (o.result === 'not' ? 'p-info' : 'p-warn')}">${esc(t.recRes[o.result])}</span>${x.observer.name ? `<br><span class="small">${esc(x.observer.name)}</span>` : ''}</td>
        <td>${esc(x.computed ? x.computed.evaluation : '')}${o.note ? `<br><span class="small">${esc(o.note)}</span>` : ''}<br><span class="hash">${esc((x.hash || '').slice(0, 16))}…${x.signer ? ' · ' + esc(x.signer.fp) : ''}</span> <span data-ver="${i}"></span>${x.observer.name ? '' : `<br><span class="small">${esc(t.recAnon)}</span>`}</td>
        <td><div class="btns"><button class="btn" type="button" data-tut="${i}">${esc(t.recPrint)}</button><button class="btn" type="button" data-tutjpg="${i}">${esc(t.jpgShort)}</button><button class="btn" type="button" data-json="${i}">${esc(t.recJson)}</button><button class="btn" type="button" data-copy="${i}">${esc(t.recCopy)}</button><button class="btn" type="button" data-del="${i}">${esc(t.del)}</button></div></td></tr>`;
    }).join('')}</tbody></table>`;
    const L = $('recList');
    L.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { records.splice(+b.dataset.del, 1); saveRec(); renderRecords(true); });
    verifyBadges();
    L.querySelectorAll('[data-tut]').forEach(b => b.onclick = () => printPages(['tut'], records[+b.dataset.tut]));
    L.querySelectorAll('[data-tutjpg]').forEach(b => b.onclick = () => exportJpg(['tut'], records[+b.dataset.tutjpg]));
    L.querySelectorAll('[data-json]').forEach(b => b.onclick = () => { const x = records[+b.dataset.json]; saveFile(recBase(x, 'record') + '.json', JSON.stringify(x, null, 2), 'application/json'); });
    L.querySelectorAll('[data-copy]').forEach(b => b.onclick = async () => { const txt = recText(records[+b.dataset.copy]); try { await navigator.clipboard.writeText(txt); toast(t.recCopied); } catch (e) { $('recEval').innerHTML = `<textarea rows="8" style="width:100%">${esc(txt)}</textarea>`; } });
  }

  // ==== an çubuğu, hicrî tarih, yaklaşan rü’yet, hava, gökyüzü haritası, baskı, otomatik konum ====
  function toast(msg, ms = 4200) { const e = $('toast'); e.textContent = msg; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { e.hidden = true; }, ms); }
  // Hicrî gün: kamerî gün şer’î gurûbda başlar (s. 188). İlk gün ve ay sonunda iki ihtimal; Muharrem’de eski ve yeni yıl yan yana.
  function hijriOf(ymd, local) {
    const ld = lunarDayC(ymd, local); if (!ld) return null;
    const cur = { y: ld.hm.y, m: ld.hm.m }, prev = cur.m === 1 ? { y: cur.y - 1, m: 12 } : { y: cur.y, m: cur.m - 1 };
    const M = x => `${monthName(x.m)} ${x.y}`;
    if (ld.n <= 1) return { dayTxt: `1 | 29/30`, monthTxt: `${M(cur)} | ${M(prev)}`, html: `<b>1 ${esc(M(cur))}</b> ${t.hjOr} ${esc('29/30 ' + M(prev))}`, plain: `1 ${M(cur)} ${t.hjOr} 29/30 ${M(prev)}`, month: cur };
    const n = Math.min(ld.n, 30);
    return { dayTxt: `${n} | ${n - 1}`, monthTxt: M(cur), html: `<b>${n} ${esc(M(cur))}</b> <span>(${t.hjOr} ${n - 1})</span>`, plain: `${n} (${t.hjOr} ${n - 1}) ${M(cur)}`, month: cur };
  }
  function hijriAt(at) {
    const ymd = localYmd(at), r = eveningCached(LOC || locObj(), ymd);
    const g = r && r.ok ? (r.seri && r.seri.seri ? r.seri.seri : r.gurub) : null;
    const after = g && at.ut >= g.ut;
    const day = after ? addDays(ymd, 1) : ymd, h = hijriOf(day);
    if (!h) return null;
    const l = hijriOf(day, true), diff = l && l.plain !== h.plain;
    // Yerel kapsam yalnız dünya genelinden farklıysa ikinci satır olarak yazılır
    return Object.assign({ after, local: diff ? l : null, html2: diff ? `<span class="hjl">${esc(t.hjGlobal)}: ${h.html}<br>${esc(t.hjLocal)}: ${l.html}</span>` : h.html }, h);
  }
  function renderBarClock() {
    if (!st.live && view !== 'saha') return;
    if (st.frozen && view !== 'saha') return;
    const at = A.MakeTime(new Date());
    $('mbTime').innerHTML = fmtTime(at).slice(0, 5) + `<span class="s">:${fmtTime(at).slice(6, 8)}</span>` + (st.timeFmt === 'both' ? ' · ' + at.date.toISOString().slice(11, 16) + ' UTC' : '');
  }
  function renderBar() {
    if (!LOC) return;
    const field = view === 'saha', live = st.live || field; // saha her zaman “şimdi”dir
    const frozen = st.live && st.frozen && !field;
    const at = field ? A.MakeTime(new Date()) : (live ? (frozen ? selT() : A.MakeTime(new Date())) : selT());
    $('mbMode').textContent = frozen ? t.modeFrozen : live ? t.modeLive : t.modePlan;
    document.body.classList.toggle('planning', !live);
    $('mbDate').textContent = new Intl.DateTimeFormat(locale(), { timeZone: st.tz, weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(at.date);
    $('mbTime').innerHTML = (live && !frozen ? fmtTime(at).slice(0, 5) + `<span class="s">:${fmtTime(at).slice(6, 8)}</span>` : hhmm(at)) + (st.timeFmt === 'both' ? ' · ' + at.date.toISOString().slice(11, 16) + ' UTC' : '');
    const hj = hijriAt(at);
    $('mbHijri').innerHTML = hj ? `${hj.local ? hj.html2 : hj.html} <span class="note" title="${esc(t.hjNote)}">· ${esc(t.hjHesabi)}${hj.after ? ' · ' + esc(t.hjAfter) : ''}</span> ${q('hicri')}` : '';
    const city = CITIES.find(c => c.id === st.city);
    const chips = [`<button type="button" class="chip loc" id="mbLoc" title="${esc((st.locAuto ? t.chipLocAuto : t.chipLocMan) + ' · ' + t.location)}">${st.locAuto ? '⌖' : '◎'} ${esc(city ? city[st.lang] : (st.locAuto ? t.myPlace : `${num(st.lat, 2)}, ${num(st.lon, 2)}`))} ✎</button>`];
    if (ON.sandboxed) chips.push(`<span class="chip off" title="${esc(t.sandboxNote)}">${esc(t.chipSandbox)}</span>`);
    else if (!ON.online()) chips.push(`<span class="chip off">${esc(t.chipOffline)}</span>`);
    if (WX.ass) chips.push(`<span class="chip" title="${esc(t.wxTitle)}">${{ good: '☀', fair: '⛅', poor: '☁' }[WX.ass.level]} ${esc(t.wxLevel[WX.ass.level])}</span>`);
    $('mbChips').innerHTML = chips.join('');
    // konum çipi Konum kartına götürür (dar ekranda kart aşağıda kaldığı için)
    $('mbLoc').onclick = () => { if (view !== 'plan') location.hash = '#plan'; if (st.fold && st.fold.locCard) { applyFold('locCard', true); save(); } setTimeout(() => { const c = $('hLoc'); if (c) { c.scrollIntoView({ behavior: 'smooth', block: 'start' }); try { $('city').focus({ preventScroll: true }); } catch (e) { /* */ } } }, 60); };
    $('mbNow').hidden = live;
    $('mbLive').hidden = !live || field;
    $('mbPlay').setAttribute('aria-pressed', String(live && !frozen)); $('mbFreeze').setAttribute('aria-pressed', String(frozen));
    $('mbPrint').hidden = !['plan', 'harita', 'saha'].includes(view);
    paintBandState(at, live && !frozen);
  }
  // Seçili gün ve saatte rü’yet durumu: bant rengi ve kısa ibare (kitabın sınıfları ve arama penceresi esas)
  function bandState(at, live) {
    const e = recEveningOf(at), r = e.r;
    if (!r || !r.ok || !r.cls) return { k: 'none', txt: t.bandNone };
    const c = r.cls.code;
    if (c === 'midMonth') return { k: 'none', txt: t.bandMid };
    if (r.cls.reject) return { k: 'bad', txt: t.bandReject };
    if (c === 'below5') return { k: 'bad', txt: t.bandBelow5 };
    const win = r.windowEnd ? `${hhmm(r.gurub)}–${hhmm(r.windowEnd)}` : '';
    if (e.day) return { k: 'soon', txt: t.bandTonight(win) };
    if (r.windowEnd && at.ut >= r.gurub.ut && at.ut <= r.windowEnd.ut) return { k: 'ok', txt: (live ? t.bandNow : t.bandSel)(win) };
    return at.ut < r.gurub.ut ? { k: 'soon', txt: t.bandTonight(win) } : { k: 'past', txt: t.bandPast(win) };
  }
  function paintBandState(at, live) {
    let s = { k: 'none', txt: '' }; try { s = bandState(at, live); } catch (e) { /* */ }
    const b = $('mbar'); ['ok', 'soon', 'past', 'bad', 'none'].forEach(k => b.classList.toggle('st-' + k, s.k === k));
    $('mbState').textContent = s.txt;
  }
  // Yaklaşan rü’yet (canlı kipte): rasad gecesi ve en elverişli akşam
  let upKey = null, upData = null;
  function renderUpcoming() {
    const card = $('upCard'); if (!card) return;
    if (!LOC) return;
    const today = todayYmd(st.tz), key = [today, LOC.lat, LOC.lon, LOC.elev, st.lang].join('|');
    if (upKey === key && upData) { paintUp(upData); return; }
    upKey = key; upData = null; $('upBody').innerHTML = `<p class="small">${esc(t.upLoading)}</p>`;
    setTimeout(() => {
      if (upKey !== key) return;
      // Bu akşamın arama penceresi (hilâlin batışı / pencere sonu) geçtiyse bu akşam artık "yaklaşan" sayılmaz
      const rT = eveningCached(LOC, today), endT = rT.ok ? (rT.windowEnd || rT.moonset || rT.gurub) : null;
      const passed = endT ? Date.now() > endT.date.getTime() : false;
      const from = passed ? addDays(today, 1) : today;
      let nx = { a: null, b: null }, prev = null; try { nx = nextRasad(from); prev = prevNightOf('A', nx.a ? nx.a.ymd : from); } catch (e) { /* */ }
      upData = { a: nx.a, b: nx.b, prev, today, passedTonight: passed && !!prev && prev.ymd === today }; paintUp(upData);
    }, 30);
  }
  function paintUp(d) {
    const box = (lbl, x) => {
      if (!x) return `<div><b>${esc(lbl)}</b><strong>${t.none}</strong></div>`;
      const r = x.r, days = Math.round((civil(x.ymd) - civil(d.today)) / 86400000), h = CAL.monthForConjunction(r.ictimaPrev.date);
      return `<div class="${r.cls.code === 'visible' ? 'ok' : 'warn'}"><b>${esc(lbl)}</b><strong>${esc(fmtCivil(civil(x.ymd)))}</strong><span class="small">${esc(t.upIn(days))} · ${esc(t.upMonth(monthName(h.m) + ' ' + h.y))}</span><br><span class="small">${esc(clsText(r)[0])} · ${esc(t.upWin)} ${hhmm(r.gurub)}–${hhmm(r.windowEnd || r.moonset)} · ${t.beyn.split(' ')[0]} ${degf(r.beynunet, 1)}</span><br><button class="btn primary" type="button" data-up="${x.ymd}">${esc(t.upPlan)}</button></div>`;
    };
    const hj = hijriAt(A.MakeTime(new Date()));
    let h = (hj ? `<div><b>${esc(t.upToday)}</b><strong>${hj.local ? hj.html2 : hj.html}</strong><span class="small">${esc(t.hjShort)} ${esc(t.hjBook)}</span></div>` : '') + box(t.upA, d.a);
    if (d.b && (!d.a || d.b.ymd !== d.a.ymd)) h += box(t.upB, d.b);
    if (d.prev) {
      const pr = d.prev, ph = CAL.monthForConjunction(pr.r.ictimaPrev.date), ago = Math.round((civil(d.today) - civil(pr.ymd)) / 86400000);
      h += `<div class="prev"><b>${esc(t.upPrev)}</b><strong>${esc(fmtCivil(civil(pr.ymd)))}</strong><span class="small">${esc(t.upMonth(monthName(ph.m) + ' ' + ph.y))}${ago > 0 ? ' · ' + esc(st.lang === 'tr' ? `${ago} gün önce` : `${ago} days ago`) : ''}</span><br><span class="small">${esc(clsText(pr.r)[0])}</span><br><button class="btn" type="button" data-up="${pr.ymd}">◀ ${esc(t.upPrevGo)}</button></div>`;
    }
    if (d.passedTonight) h += `<p class="small" style="grid-column:1/-1;margin:0">${esc(t.upNextNote)}</p>`;
    $('upBody').innerHTML = h;
    $('upBody').querySelectorAll('[data-up]').forEach(b => b.onclick = () => setDate(b.dataset.up, { anchor: 'auto' }));
  }
  // Yönelim yardımcıları
  function guidesHtml(at, loc) {
    let g = []; try { g = G.HRStarMap.guides(loc || LOC, at, st.lang, 3); } catch (e) { g = []; }
    return `<h3>${esc(t.guidesTitle)}</h3>` + (g.length ? `<ul class="guides">${g.map(o => `<li><strong>${esc(o.name)}</strong> (${num(o.mag, 1)} ${st.lang === 'tr' ? 'kadir' : 'mag'}): ${esc(o.text)}</li>`).join('')}</ul>` : `<p class="small">${esc(t.guidesNone)}</p>`);
  }
  // ---- Hava ve görüş ----
  const WX = { key: null, data: null, err: null, loading: false, ass: null };
  const fmtH = ms => new Intl.DateTimeFormat(locale(), { timeZone: st.tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(ms));
  async function renderWx(force) {
    const body = $('wxBody'); WX.ass = null;
    const msg = m => { body.innerHTML = `<p class="small">${esc(m)} ${q('hava')}</p>`; renderBar(); };
    if (!st.wx) return msg(t.wxOff);
    if (ON.sandboxed) return msg(t.wxSandbox);
    if (!ON.online()) return msg(t.wxOffline);
    if (!R) return msg(t.none);
    const az = Math.round(R.moonAz || R.sunAz || 270);
    const key = [st.lat.toFixed(2), st.lon.toFixed(2), Math.round(az / 10)].join('|');
    if (force || WX.key !== key || !WX.data) {
      WX.key = key; WX.loading = true; WX.err = null; msg(t.wxLoading);
      try { WX.data = await ON.weather(st.lat, st.lon, az); } catch (e) { WX.data = null; WX.err = e; }
      WX.loading = false;
      if (WX.key !== key) return;
    }
    if (!WX.data || !WX.data.here) return msg(t.wxErr);
    paintWx();
  }
  function wxRow(lbl, v) {
    if (!v) return `<tr><td>${esc(lbl)}</td><td colspan="4">${t.none}</td></tr>`;
    const bar = x => `<span class="wxbar"><i style="width:${Math.max(0, Math.min(100, x || 0))}%"></i></span>`;
    return `<tr><td>${esc(lbl)}</td><td>${v.cloud_cover ?? '–'}% / ${v.cloud_cover_low ?? '–'}%${bar(v.cloud_cover)}</td><td>${v.visibility != null ? num(v.visibility / 1000, 0) + ' km' : '–'}</td><td>${v.relative_humidity_2m ?? '–'}%</td><td>${v.precipitation_probability ?? '–'}%</td></tr>`;
  }
  function paintWx() {
    const d = WX.data, g = R.gurub.date.getTime(), rg = ON.range(d.here);
    if (!rg || g < rg[0] - 3600e3 || g > rg[1] + 3600e3) { $('wxBody').innerHTML = `<p class="small">${esc(t.wxOutRange(fmtCivil(new Date(rg ? rg[0] : g), true), fmtCivil(new Date(rg ? rg[1] : g), true)))} ${q('hava')}</p>`; renderBar(); return; }
    const hereG = ON.pick(d.here, g), westG = ON.pick(d.west, g), aq = ON.pick(d.aq, g);
    const ass = ON.assess(hereG, westG, aq); WX.ass = ass;
    const cls = { good: 'p-ok', fair: 'p-warn', poor: 'p-bad' }[ass.level];
    const reasons = ass.reasons.map(k => t.wxReason[k]).join(', ');
    let h = (R && R.ok && R.cls && (R.cls.reject || R.cls.code === 'below5' || R.cls.code === 'midMonth') ? `<p class="small" style="margin:0 0 6px">${esc(t.wxNoSight)}</p>` : '') + `<p style="margin:0 0 8px"><span class="pill ${cls}">${esc(t.wxLevel[ass.level])}</span> <span class="small">${esc(t.wxFor)}: ${hhmm(R.gurub)}${reasons ? ' · ' + esc(reasons) : ''}</span> ${q('hava')}</p>`;
    h += `<div class="scroll"><table class="wx"><thead><tr>${t.wxHead.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>`;
    h += `<tr><th colspan="5" style="text-align:left">${esc(t.wxHere)}</th></tr>`;
    for (const k of [-1, 0, 1]) { const v = ON.pick(d.here, g + k * 3600e3); h += wxRow(v ? fmtH(v.t) : '–', v); }
    h += `<tr><th colspan="5" style="text-align:left">${esc(t.wxWest(Math.round(R.moonAz || R.sunAz)))}</th></tr>` + wxRow(westG ? fmtH(westG.t) : '–', westG);
    h += '</tbody></table></div>';
    if (aq && aq.aerosol_optical_depth != null) h += `<p class="small" style="margin:6px 0 0">${esc(t.wxAod)}: ${num(aq.aerosol_optical_depth, 2)}${aq.dust != null ? ` · ${st.lang === 'tr' ? 'toz' : 'dust'} ${num(aq.dust, 0)} µg/m³` : ''}</p>`;
    h += `<p class="cap">${esc(t.wxFiqh)}</p><p class="cap">${esc(t.wxSrc)}</p>`;
    $('wxBody').innerHTML = h; renderBar();
  }
  function wxMini(r) {
    if (!WX.data || !r || !r.ok) return '';
    const g = r.gurub.date.getTime(), a = ON.assess(ON.pick(WX.data.here, g), ON.pick(WX.data.west, g), ON.pick(WX.data.aq, g));
    if (!a) return '';
    return `<p class="where"><span class="pill ${{ good: 'p-ok', fair: 'p-warn', poor: 'p-bad' }[a.level]}">${esc(t.wxLevel[a.level])}</span> <span class="small">${esc(a.reasons.map(k => t.wxReason[k]).join(', '))}</span></p>`;
  }
  // ---- Gökyüzü haritası ----
  let SM_AT = null;
  function openSM(at) {
    SM_AT = at; drawSM();
    const d = $('smDlg'); try { d.showModal(); } catch (e) { d.setAttribute('open', ''); }
  }
  function smOpts() { return { face: +$('smFace').value, lines: $('smLines').checked, names: $('smNames').checked, cons: $('smCons').checked, ecliptic: $('smEcl').checked, size: 680, scale: st.fontSize || 1 }; }
  function drawSM() {
    if (!SM_AT) return;
    const out = G.HRStarMap.draw(LOC, SM_AT, st.lang, smOpts());
    $('smBody').innerHTML = out.svg;
    const hj = hijriAt(SM_AT), city = CITIES.find(c => c.id === st.city);
    $('smWhen').innerHTML = `${esc(fmtDT(SM_AT))} · ${esc(city ? city[st.lang] : `${num(st.lat, 2)}, ${num(st.lon, 2)}`)}${hj ? ' · ' + hj.html : ''}`;
  }
  // ---- Baskı / PDF ----
  async function getDownloads() { try { return G.claude && G.claude.use ? await G.claude.use('downloads') : null; } catch (e) { return null; } }
  const selfName = () => `MahiNev_v${G.HR_VERSION}.html`;
  const selfHtml = () => G.HR_SRC || ('<!DOCTYPE html>\n' + document.documentElement.outerHTML);
  async function saveSelf() {
    const dl = await getDownloads(); if (!dl) { toast(t.dlFail); return; }
    try { await dl.save({ filename: selfName(), data: selfHtml() }); } catch (e) { toast(e && e.code === 'declined' ? t.printDeclined : t.dlFail); }
  }
  // HTML’yi indir: tarayıcıda Blob ile; claude.ai içinde indirme yeteneğiyle
  function downloadHtml() {
    if (ON.sandboxed) return saveSelf();
    try {
      const url = URL.createObjectURL(new Blob([selfHtml()], { type: 'text/html;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = selfName(); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000); toast(t.dlDone);
    } catch (e) { saveSelf(); }
  }
  const extLink = (u, s) => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(s)}</a>` : esc(s);
  const bare = u => String(u || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  // Kaynak kitap: Hakîkat Kitâbevi’nin kendi sayfaları
  const BOOK_PAGE = 'https://www.hakikatkitabevi.net/book.php?bookCode=001', BOOK_PDF = 'https://www.hakikatkitabevi.net/downloads/001.pdf';
  const bookLinksHtml = () => `${esc(t.bookLinks)} ${extLink(BOOK_PAGE, t.bookPage)} · ${extLink(BOOK_PDF, t.bookPdf)}`;
  function aboutHtml() {
    return `<p>${esc(t.aboutText)}</p><p>${bookLinksHtml()}</p><p class="edn">${esc(t.editionNote)}</p>`;
  }
  function noticeHtml() {
    const n = NOTICE || {};
    return `<span class="src">${extLink(BOOK_PAGE, t.srcLine)} · <button type="button" class="linkbtn" id="aboutOpen">${esc(t.aboutTitle)}</button></span><br>${esc(t.appFull)} v${G.HR_VERSION}${n.c ? ' · ' + esc(n.c) : ''}${n.l ? ' · ' + extLink(n.lu, n.l) : ''} · ${extLink(HOME, bare(HOME))}` +
      (OFFICIAL === false ? ` · <strong>${esc(t.tamperShort)}</strong>` : '') + `<br><span class="small">${esc(t.licThird)}: ${esc(t.footer)}</span>`;
  }
  function licHtml() {
    const n = NOTICE || {};
    return `<b>${esc(t.aboutTitle)}</b>${aboutHtml()}${esc(n.n || t.appFull)} · ${esc(n.c || '')}<br>${extLink(n.lu, n.l || '')}: ${esc(t.licText)}<br>${esc(t.licOfficial)} ${extLink(HOME, bare(HOME))}` +
      (n.p ? ` · ${extLink(n.p, bare(n.p))}` : '') + `<br>${esc(t.licThird)}: ${esc(t.footer)}`;
  }
  function paintTamper() {
    const b = $('tamper'); if (!b) return;
    b.hidden = OFFICIAL !== false;
    if (OFFICIAL === false) b.innerHTML = `${esc(t.tamper)} ${extLink(HOME, bare(HOME))}`;
  }
  function withTheme(theme, fn) {
    const prev = document.body.className;
    document.body.classList.remove('th-light', 'th-dark', 'th-night', 'th-sun'); document.body.classList.add('th-' + theme);
    try { return fn(); } finally { document.body.className = prev; }
  }
  function smOptsSafe() { try { return smOpts(); } catch (e) { return {}; } }
  // ---- Baskı / PDF: her biri tek A4 sayfasına oturan, hedefe odaklı sayfalar ----
  function openPrint() {
    const def = view === 'harita' ? ['map'] : view === 'saha' ? (records.some(x => x.schema) ? ['tut'] : ['plan']) : ['plan'];
    const has = records.some(x => x.schema);
    $('prOpts').innerHTML = ['plan', 'sky', 'month', 'map', 'tut', 'blank'].filter(k => k !== 'tut' || has).map(k => `<label><input type="checkbox" value="${k}"${def.includes(k) ? ' checked' : ''}><span>${esc(t.prOpts[k])}</span></label>`).join('');
    try { $('prDlg').showModal(); } catch (e) { $('prDlg').setAttribute('open', ''); }
  }
  const placeName = () => { const c = CITIES.find(x => x.id === st.city); return c ? c[st.lang] : (st.locAuto ? t.myPlace : (st.lang === 'tr' ? 'Seçilen konum' : 'Selected location')); };
  function pgHead(title, sub) {
    return `<header class="ph"><div><h1>${esc(title)}</h1><p>${sub}</p></div><div class="phr">${esc(t.appTitle)}<br>v${G.HR_VERSION}</div></header>`;
  }
  function pgFoot(extra) { const n = NOTICE || {}; return `<footer class="pf"><span>${esc(t.printFooter)}</span><span>${extra ? esc(extra) + ' · ' : ''}${esc(t.printGen)}: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · ${esc(t.appTitle)} v${G.HR_VERSION} (${esc(G.HR_RULES)}) · ${esc(n.c || '')} · ${esc(bare(HOME))}${OFFICIAL === false ? ' · ' + esc(t.tamperShort).toUpperCase() : ''}<span class="edn"> · ${esc(t.pageEdition)}</span></span></footer>`; }
  const locLine = () => `<strong>${esc(placeName())}</strong> · ${num(st.lat, 4)}°, ${num(st.lon, 4)}° · ${num(st.elev, 0)} m · ${esc(st.tz)}`;
  function pagePlan() {
    const r = R; if (!r) return '';
    const mid = r.cls.code === 'midMonth';
    const tA = mid ? r.gurub : A.MakeTime(new Date(dayStart() + anchorMin('auto') * 60000));
    const [title, sub] = clsText(r), [claim, ccls] = claimOf(r);
    const sought = !mid && r.ictimaPrev ? (() => { const h = CAL.monthForConjunction(r.ictimaPrev.date); return `${monthName(h.m)} ${h.y}`; })() : '';
    const rng = eveningRange(r, LOC);
    const svgs = withTheme('light', () => ({ w: mid ? G.HRSky.panorama(LOC, tA, st.lang, {}).svg : G.HRSky.draw(r, LOC, tA, st.lang, {}).svg }));
    const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;
    const tbl1 = row(t.gurub.replace(/\(.*\)/, ''), hhmm(r.gurub)) + row(t.seri.replace(/\(.*\)/, ''), r.seri && r.seri.seri ? hhmm(r.seri.seri) : t.none) + row(esc(t.stWindow), !mid && r.windowEnd ? `${hhmm(r.gurub)} – ${hhmm(r.windowEnd)}` : t.none) + row(esc(t.evSearch), rng ? `${hhmm(rng[0])} – ${hhmm(rng[1])}` : t.none) + row(esc(t.stBest), !mid && r.best ? hhmm(r.best) : t.none) + row(t.moonset.replace(/\(.*\)/, ''), hhmm(r.moonset)) + row(t.lag.replace(/\(.*\)/, ''), hm(r.lagMin));
    const tbl2 = row(t.beyn.replace(/\(.*\)/, ''), degf(r.beynunet)) + row(t.alt.replace(/\(.*\)/, ''), degf(r.moonAlt)) + row(t.az.replace(/\(.*\)/, ''), `${degf(r.moonAz, 1)} (${G.HRSky.card(r.moonAz, st.lang)}) · ${t.daz} ${degf(r.daz, 1)}`) + row(t.age.replace(/\(.*\)/, ''), ageTxt(r.ageH)) + row(t.illum.replace(/\(.*\)/, ''), num(r.illum, 2) + ' %') + row(t.lastConj.replace(/\(.*\)/, ''), fmtDT(r.ictimaPrev)) + row(t.kadihan.replace(/\(.*\)/, ''), r.kadihan19 ? `${esc(r.kadihan19 === 'first' ? t.kdFirst : t.kdSecond)} (−19°, ${hhmm(r.safak19)})<br><span class="small">${esc(t.kdB)}: ${esc(r.kadihan17 === 'first' ? t.kdFirst : t.kdSecond)} (${hhmm(r.safak17)})</span>` : t.none);
    const hj = hijriAt(r.gurub.AddDays(1 / 1440));
    return `<section class="a4">${pgHead(t.pgPlanTitle, `${locLine()}<br><strong>${esc(t.thisEvening(fmtCivil(civil(st.date))))}</strong>${sought ? ' · ' + esc(t.planMonth(sought)) : ''}${hj ? ' · ' + (hj.local ? hj.html2 : hj.html) : ''}`)}
      <div class="pbox s-${CLS_STYLE[r.cls.code]}"><h2>${esc(title)}</h2><p>${esc(sub)}</p><p><span class="pill ${ccls}">${esc(t.claim)}: ${esc(claim)}</span></p></div>
      <div class="cols"><table class="pt">${tbl1}</table><table class="pt">${tbl2}</table></div>
      <h3>${esc(mid ? t.panoTitle : t.skyTitle)} · ${hhmm(tA)}</h3><div class="pfig">${svgs.w}</div>
      <div class="cols"><div>${guidesHtml(tA)}</div><div><h3>${esc(t.pgCheck)}</h3><ol class="pl">${t.pgChecklist.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div></div>
      <div class="lines"><h3>${esc(t.notes)}</h3><i></i></div>
      ${pgFoot()}</section>`;
  }
  function pageSky(at) {
    const svg = withTheme('light', () => G.HRStarMap.draw(LOC, at, st.lang, Object.assign(smOptsSafe(), { size: 680 })).svg);
    const hj = hijriAt(at);
    return `<section class="a4">${pgHead(t.smTitle, `${locLine()}<br><strong>${esc(fmtDT(at))}</strong>${hj ? ' · ' + (hj.local ? hj.html2 : hj.html) : ''}`)}
      <div class="psky">${svg}</div><p class="cap">${esc(t.smNote)}</p>${guidesHtml(at)}${pgFoot()}</section>`;
  }
  function pageMonth() {
    const conj = C.nearestNewMoon(C.solarNoon(st.date, LOC.lon));
    const cd = conj.date, base = ymdOf(new Date(Date.UTC(cd.getUTCFullYear(), cd.getUTCMonth(), cd.getUTCDate())));
    let nights = null; try { nights = C.observationNights(LOC, addDays(base, -1)); } catch (e) { nights = null; }
    const h = CAL.monthForConjunction(conj.date);
    let rows = '';
    for (let k = -1; k <= 29; k++) {
      const ymd = addDays(base, k), r = eveningCached(LOC, ymd);
      const tag = nights && nights.a && nights.a.ymd === ymd ? 'A' : '', tagB = nights && nights.b && nights.b.ymd === ymd ? 'B' : '';
      const code = r.ok ? r.cls.code : '';
      rows += `<tr class="${ymd === st.date ? 'sel' : ''}"><td>${esc(fmtCivil(civil(ymd), true))}</td><td>${r.ok ? hhmm(r.gurub) : '—'}</td><td>${r.ok && code !== 'midMonth' ? degf(r.beynunet, 1) : ''}</td><td>${r.ok && code !== 'midMonth' ? degf(r.moonAlt, 1) : ''}</td><td>${r.ok && code !== 'midMonth' && r.lagMin != null ? Math.round(r.lagMin) + ' ' + t.min : ''}</td><td>${r.ok ? `<i class="sw" style="background:var(${CLS_COLOR[code] || '--line'})"></i>${esc(code === 'midMonth' ? '' : clsText(r)[0])}` : ''}</td><td>${[tag, tagB].filter(Boolean).join('·')}</td></tr>`;
    }
    return `<section class="a4">${pgHead(t.pgMonthTitle, `${locLine()}<br><strong>${esc(monthName(h.m))} ${h.y}</strong> · ${esc(t.conj)}: ${esc(fmtDT(conj))}`)}
      <table class="mt"><thead><tr>${t.pgCols.map(x => `<th>${esc(x)}</th>`).join('')}<th></th></tr></thead><tbody>${rows}</tbody></table>
      <p class="cap">${esc(t.stripNote)}</p>${pgFoot()}</section>`;
  }
  async function pageMap() {
    let img = '';
    const prev = document.body.className;
    if (!big) { const was = view; view = 'harita'; $('view-harita').hidden = false; renderBigMap(); view = was; }
    document.body.classList.remove('th-light', 'th-dark', 'th-night', 'th-sun'); document.body.classList.add('th-light');
    try { const v = view; view = 'harita'; renderBigMap(); view = v; if (MAPP) await MAPP; const cv = $('bigMap').querySelector('canvas'); img = cv ? cv.toDataURL('image/png') : ''; }
    finally { document.body.className = prev; if (view === 'harita') renderBigMap(); else $('view-harita').hidden = true; }
    return `<section class="a4 land">${pgHead(t.mapTitle, `${locLine()}<br>${esc($('mapNote').textContent)}`)}
      <div class="pmap">${img ? `<img src="${img}" alt="">` : ''}</div><div class="legend">${$('mapLegend').innerHTML}</div>${pgFoot()}</section>`;
  }
  function qrSvg(text) { try { const qr = qrcode(0, 'M'); qr.addData(text); qr.make(); return qr.createSvgTag(2, 0); } catch (e) { return ''; } }
  function pageTut(x) {
    const blank = !x || !x.schema;
    const o = blank ? {} : x.observation, c = blank ? null : x.computed, pl = blank ? {} : x.place, ob = blank ? {} : x.observer;
    const tz = pl.tz || st.tz, f = d => d ? new Intl.DateTimeFormat(locale(), { timeZone: tz, dateStyle: 'full', timeStyle: 'short' }).format(new Date(d)) : '';
    const tm = d => d ? new Intl.DateTimeFormat(locale(), { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(d)) : '—';
    const v = (val, w) => val ? esc(val) : `<span class="blank" style="min-width:${w || 40}mm"></span>`;
    const row = (k, val) => `<tr><th>${esc(k)}</th><td>${val}</td></tr>`;
    const obsT = row(t.recAt, blank ? v('', 80) : `${esc(f(o.at))}<br><span class="small">${esc(o.at.slice(0, 16).replace('T', ' '))} UTC · ${esc(t.recEvening(fmtCivil(civil(o.evening))))}</span>`) +
      row(t.recResult, blank ? Object.values(t.recRes).map(s => `☐ ${esc(s)}`).join('<br>') : `<strong>${esc(t.recRes[o.result])}</strong>`) +
      row(`${t.recFirst} / ${t.recLast}`, blank ? `${v('', 25)} / ${v('', 25)}` : `${esc(o.firstSeen || '—')} / ${esc(o.lastSeen || '—')}`) +
      row(t.recPlace, blank ? `${v('', 70)}<br>☐ ${esc(t.recPlaceOpts.open)} ☐ ${esc(t.recPlaceOpts.high)} ☐ ${esc(t.recPlaceOpts.city)}` : `${esc(pl.name || '')} ${num(pl.lat, 4)}°, ${num(pl.lon, 4)}° · ${num(pl.elev, 0)} m<br>${esc(t.recPlaceOpts[pl.site] || '')}`) +
      row(t.recSky, blank ? Object.values(t.recSkyOpts).map(s => `☐ ${esc(s)}`).join(' ') : esc(t.recSkyOpts[o.sky] || '')) +
      row(`${t.recWith} / ${t.recSeers}`, blank ? `${v('', 15)} / ${v('', 15)}` : `${o.companions} / ${o.seers}`) +
      row(t.notes, blank ? `${v('', 110)}<br>${v('', 110)}` : (o.note && o.note.length > 240 ? `<span class="clamp">${esc(o.note.slice(0, 240))}…</span> <span class="small">(${esc(t.noteFull)})</span>` : esc(o.note || '—')) + (!blank && !x.observer.name ? `<br><span class="small">${esc(t.recAnon)}</span>` : ''));
    const comp = c ? row(t.lastConj.replace(/\(.*\)/, ''), esc(f(c.ictima))) + row(t.gurub.replace(/\(.*\)/, ''), tm(c.gurub) + (c.seriGurub ? ` · ${esc(t.seri.replace(/\(.*\)/, ''))} ${tm(c.seriGurub)}` : '')) +
      row(t.stWindow, c.windowEnd ? `${tm(c.gurub)} – ${tm(c.windowEnd)}` : t.none) + row(t.moonset.replace(/\(.*\)/, ''), tm(c.moonset)) +
      row(t.beyn.replace(/\(.*\)/, ''), degf(c.beynunet)) + row(`${t.alt.replace(/\(.*\)/, '')} (${st.lang === 'tr' ? 'gözlem anında' : 'at observation'})`, `${degf(c.atObs.moonAlt)} · ${t.az.split(' ')[0]} ${degf(c.atObs.moonAz, 1)}`) +
      row(t.age.replace(/\(.*\)/, ''), ageTxt(c.ageH)) + row(t.tutCalc, `<strong>${esc(t.cls[c.cls === 'notBorn' ? 'notBorn_beforeConj' : c.cls] ? t.cls[c.cls === 'notBorn' ? 'notBorn_beforeConj' : c.cls][0] : c.cls)}</strong><br><span class="small">${esc(c.evaluation)}</span>`) : `<tr><td colspan="2" class="small">${esc(blank ? (st.lang === 'tr' ? 'Hesâbî veriler kayıt oluşturulunca program tarafından doldurulur.' : 'Computed data are filled in by the programme when a record is created.') : t.none)}</td></tr>`;
    const photo = !blank && x.photo && x.photo.thumb ? `<figure class="pph"><img src="${x.photo.thumb}" alt=""><figcaption class="hash">SHA-256 ${esc(x.photo.sha256)}</figcaption></figure>` : '';
    const qr = !blank && x.hash ? qrSvg(`HRK1|${x.id}|${x.hash}`) : '';
    return `<section class="a4 tut">${pgHead(t.tutTitle, esc(t.tutSub) + (blank ? '' : ` · ${esc(t.tutRecId)}: ${esc(x.id)}`))}
      <div class="cols tcols"><div><h3>${esc(t.tutObs)}</h3><table class="pt">${obsT}</table></div><div><h3>${esc(t.tutComp)}</h3><table class="pt">${comp}</table>${photo}</div></div>
      <h3>${esc(t.tutPeople)}</h3>
      <table class="sig"><tr><th>${esc(t.recName)}</th><td>${v(ob.name, 70)}</td><th>${esc(t.tutSign)}</th><td><span class="blank" style="min-width:45mm"></span></td></tr>
        <tr><th>${esc(t.recContact)}</th><td colspan="3">${v(ob.contact, 90)}</td></tr>
        ${[1, 2, 3].map(i => `<tr><th>${esc(t.tutWitness)} ${i}</th><td colspan="3"><span class="blank" style="min-width:120mm"></span></td></tr>`).join('')}</table>
      <div class="fiqh"><h3>${esc(t.tutFiqh)}</h3><p>${esc(t.tutFiqhTxt)}</p></div>
      <div class="integ">${qr ? `<div class="qr">${qr}</div>` : ''}<div><p class="hash">${esc(t.recHash)}: ${esc(blank ? '' : x.hash || t.none)}</p><p class="hash">${blank ? '' : x.signer ? `${esc(t.recSig)}: ${esc(x.signer.fp)}` : esc(t.recNoSig)}</p>${blank ? '' : `<p class="vfline">${esc(t.vfPrint)}</p>`}</div></div>
      ${pgFoot(blank ? '' : `${t.tutRecId} ${x.id.slice(0, 8)}`)}</section>`;
  }
  const PRINT_CSS = `@page { size: A4; margin: 0; } @page land { size: A4 landscape; margin: 0; }
    html { font-size: 10pt; } body { background: #e8e8e8; margin: 0; color: #111; font-family: var(--font-body); }
    .a4 { width: 210mm; height: 297mm; padding: 11mm 13mm 9mm; box-sizing: border-box; overflow: hidden; background: #fff; margin: 6mm auto; position: relative; display: flex; flex-direction: column; gap: 2.6mm; break-after: page; page-break-after: always; }
    .a4.land { width: 297mm; height: 210mm; page: land; }
    .a4:last-child { break-after: auto; page-break-after: auto; }
    @media print { body { background: #fff; } .a4 { margin: 0; box-shadow: none; } }
    .ph { display: flex; justify-content: space-between; gap: 6mm; border-bottom: 1.2pt solid #142030; padding-bottom: 2.5mm; }
    .ph h1 { font: 600 15pt/1.15 var(--font-display); margin: 0 0 1mm; } .ph p { margin: 0; font-size: 9pt; line-height: 1.4; } .phr { text-align: right; font-size: 8pt; color: #555; white-space: nowrap; }
    h2 { font: 600 12.5pt/1.2 var(--font-display); margin: 0 0 1mm; } h3 { font-size: 9.5pt; margin: 1mm 0; text-transform: uppercase; letter-spacing: .04em; color: #333; }
    .pbox { border: 1pt solid #bbb; border-left: 3mm solid #888; border-radius: 2mm; padding: 2mm 3.5mm; } .pbox p { margin: .6mm 0; font-size: 9pt; }
    .pbox.s-ok { border-left-color: var(--ok); } .pbox.s-warn { border-left-color: var(--warn); } .pbox.s-bad { border-left-color: var(--bad); } .pbox.s-info { border-left-color: var(--info); }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; } .tcols { grid-template-columns: 1.05fr 1fr; }
    table.pt { width: 100%; border-collapse: collapse; font-size: 8.8pt; } table.pt th { text-align: left; font-weight: 600; color: #444; padding: .9mm 2mm .9mm 0; vertical-align: top; width: 42%; } table.pt td { padding: .9mm 0; border-bottom: .4pt solid #ddd; vertical-align: top; }
    .pfig { height: 68mm; } .pfig svg { width: 100%; height: 100%; display: block; }
    .psky { width: 172mm; height: 172mm; margin: 0 auto; } .psky svg { width: 100%; height: 100%; }
    .pmap img { width: 100%; max-height: 140mm; object-fit: contain; display: block; }
    ol.pl { margin: 0; padding-left: 5mm; font-size: 8.6pt; } ol.pl li { margin: .6mm 0; } .guides { font-size: 8.6pt; margin: 0; }
    .lines { margin-top: auto; } .lines i { display: block; border-bottom: .5pt solid #999; height: 6mm; }
    table.mt { width: 100%; border-collapse: collapse; font-size: 8.4pt; } table.mt th { text-align: left; border-bottom: 1pt solid #333; padding: 1mm; } table.mt td { padding: .75mm 1mm; border-bottom: .3pt solid #ddd; } table.mt tr.sel td { background: #fff3cf; font-weight: 600; }
    .sw { display: inline-block; width: 3mm; height: 3mm; border-radius: .6mm; margin-right: 1.5mm; vertical-align: middle; }
    .pf { margin-top: auto; display: flex; justify-content: space-between; gap: 6mm; font-size: 7.2pt; color: #555; border-top: .5pt solid #aaa; padding-top: 1.5mm; }
    .blank { display: inline-block; border-bottom: .6pt solid #555; height: 4.5mm; vertical-align: bottom; }
    table.sig { width: 100%; border-collapse: collapse; font-size: 8.8pt; } table.sig th { text-align: left; font-weight: 600; color: #444; padding: 1.6mm 2mm .8mm 0; white-space: nowrap; } table.sig td { padding: 1.6mm 0 .8mm; }
    .fiqh { border: .6pt solid #c9b27a; background: #fbf6e8; border-radius: 2mm; padding: 2mm 3mm; } .fiqh p { margin: 0; font-size: 8.3pt; line-height: 1.45; }
    .integ { display: flex; gap: 4mm; align-items: center; } .qr svg { width: 26mm; height: 26mm; display: block; } .hash { font: 500 7.6pt var(--font-mono); word-break: break-all; margin: .5mm 0; color: #333; }
    .vfline { font-size: 7pt; color: #555; margin: .8mm 0 0; } .edn { font-size: 6.5pt; color: #777; }
    .pph { margin: 2mm 0 0; } .pph img { max-width: 100%; max-height: 26mm; display: block; border-radius: 1mm; } .pph figcaption { margin-top: .6mm; }
    .cap { font-size: 8pt; color: #444; margin: 0; } .small { font-size: 8pt; color: #555; } .legend { font-size: 8pt; }
    button, .q { display: none !important; }`;
  // ---- Dosya adları: MahiNev_YYYY-AA-GG_SSDD_Yer_tür — tarih önde olduğu için klasörde sıralanır, “MahiNev” ile ayırt edilir ----
  const TRMAP = { 'ı': 'i', 'İ': 'I', 'ş': 's', 'Ş': 'S', 'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C', 'â': 'a', 'Â': 'A', 'î': 'i', 'û': 'u' };
  const slug = s => String(s || '').replace(/[ıİşŞğĞüÜöÖçÇâÂîû]/g, c => TRMAP[c]).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const coordSlug = (la, lo) => `${Math.abs(la).toFixed(2)}${la >= 0 ? 'N' : 'S'}-${Math.abs(lo).toFixed(2)}${lo >= 0 ? 'E' : 'W'}`;
  function placeSlug(name, la, lo) { return slug(name) || coordSlug(la, lo); }
  const curPlaceName = () => { const c = CITIES.find(x => x.id === st.city); return c ? c[st.lang] : ''; };
  const KIND_SLUG = { tr: { plan: 'rasad-plani', sky: 'gokyuzu-haritasi', month: 'aylik-cizelge', map: 'dunya-haritasi', tut: 'tutanak', blank: 'bos-tutanak', pages: 'sayfalar', record: 'ruyet-kaydi', backup: 'kayit-yedegi' },
    en: { plan: 'watch-plan', sky: 'sky-chart', month: 'monthly-chart', map: 'world-map', tut: 'sighting-report', blank: 'blank-report', pages: 'pages', record: 'sighting-record', backup: 'records-backup' } };
  const hhmmTz = (d, tz) => { try { return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d).replace(':', ''); } catch (e) { return ''; } };
  function fileBase(kind, o = {}) {
    const ymd = o.ymd || st.date, tm = o.hhmm != null ? o.hhmm : '', pl = o.place != null ? o.place : placeSlug(curPlaceName(), st.lat, st.lon);
    return ['MahiNev', ymd, tm, pl, (KIND_SLUG[st.lang] || KIND_SLUG.tr)[kind] || kind, o.suffix].filter(Boolean).join('_');
  }
  // Kayda ait dosya adı: gözlemin akşamı, yerel saati ve yeri
  function recBase(x, kind) {
    const pl = x.place || {}; return fileBase(kind, { ymd: x.observation.evening, hhmm: hhmmTz(new Date(x.observation.at), pl.tz || st.tz), place: placeSlug(pl.name, pl.lat, pl.lon), suffix: kind === 'record' ? String(x.id).slice(0, 8) : '' });
  }
  const printAt = kinds => SM_AT && kinds.length === 1 && kinds[0] === 'sky' && $('smDlg').open ? SM_AT : (st.live && !st.frozen ? A.MakeTime(new Date()) : selT());
  function pagesBase(kinds, rec) {
    if (kinds.length === 1 && kinds[0] === 'tut') { const x = rec || records.find(r => r.schema); if (x) return recBase(x, 'tut'); }
    return fileBase(kinds.length === 1 ? kinds[0] : 'pages', { hhmm: kinds.every(k => k === 'blank' || k === 'month') ? '' : hhmmTz(printAt(kinds).date, st.tz) });
  }
  // A4 sayfalarının tek HTML belgesi (yazdırma ve JPG çıktısı aynı belgeyi kullanır)
  async function buildPrint(kinds, rec) {
    const at = printAt(kinds);
    const parts = [];
    for (const k of kinds) {
      if (k === 'plan') parts.push(pagePlan());
      else if (k === 'sky') parts.push(pageSky(at));
      else if (k === 'month') parts.push(pageMonth());
      else if (k === 'map') parts.push(await pageMap());
      else if (k === 'tut') parts.push(pageTut(rec || records.find(x => x.schema)));
      else if (k === 'blank') parts.push(pageTut(null));
    }
    const css = Array.from(document.querySelectorAll('style')).map(x => x.textContent).join('\n');
    const html = `<!DOCTYPE html><html lang="${st.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(pagesBase(kinds, rec))}</title><style>${css}\n${PRINT_CSS}</style></head><body class="th-light">${parts.join('')}</body></html>`;
    return html;
  }
  async function printPages(kinds, rec) {
    toast(t.printing);
    const html = await buildPrint(kinds, rec);
    const fname = pagesBase(kinds, rec) + '.html';
    G.HR_LAST_PRINT = html;
    if (!ON.sandboxed) {
      const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      f.onload = () => { setTimeout(() => { const t0 = document.title; try { document.title = pagesBase(kinds, rec); f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { toast(t.printNA); } setTimeout(() => { document.title = t0; }, 1500); setTimeout(() => f.remove(), 60000); }, 400); };
      f.srcdoc = html; document.body.appendChild(f);
      return;
    }
    if (await saveFile(fname, html, 'text/html')) toast(t.printSaved);
  }
  // ---- JPG çıktısı: her A4 sayfası ayrı bir JPEG resmi (≈ 240 dpi); birden çok sayfa ZIP içinde ----
  // Sayfa, SVG foreignObject içine konup tuvale çizilir; dış kaynak kullanılmaz (bütün resimler data: adresidir).
  const CRC_T = (() => { const T = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; } return T; })();
  const crc32 = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  // Sıkıştırmasız (store) ZIP: JPEG zaten sıkıştırılmıştır
  function makeZip(files) {
    const enc = new TextEncoder(), chunks = [], central = []; let off = 0;
    const now = new Date(), dt = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)), dd = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate());
    for (const f of files) {
      const name = enc.encode(f.name), crc = crc32(f.data), n = f.data.length;
      const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, dt, true); h.setUint16(12, dd, true); h.setUint32(14, crc, true); h.setUint32(18, n, true); h.setUint32(22, n, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      chunks.push(new Uint8Array(h.buffer), name, f.data);
      const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, dt, true); c.setUint16(14, dd, true); c.setUint32(16, crc, true); c.setUint32(20, n, true); c.setUint32(24, n, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), name); off += 30 + name.length + n;
    }
    const cs = central.reduce((a, x) => a + x.length, 0), e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cs, true); e.setUint32(16, off, true);
    return new Blob([...chunks, ...central, new Uint8Array(e.buffer)], { type: 'application/zip' });
  }
  const xmlEsc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  async function pageToJpeg(el, css, scale = 2.5) {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    const xhtml = new XMLSerializer().serializeToString(el);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><foreignObject x="0" y="0" width="${w}" height="${h}">` +
      `<div xmlns="http://www.w3.org/1999/xhtml" class="th-light jpgroot" style="width:${w}px;height:${h}px;background:#fff;color:#111;font-family:var(--font-body)"><style>${xmlEsc(css)}\n.a4{margin:0 !important;box-shadow:none !important}</style>${xhtml}</div></foreignObject></svg>`;
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('svg')); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
    await new Promise(r => setTimeout(r, 120));  // iç resimlerin çözülmesi için (Safari)
    const cv = document.createElement('canvas'); cv.width = Math.round(w * scale); cv.height = Math.round(h * scale);
    const ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
    const blob = await new Promise((res, rej) => { try { cv.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/jpeg', 0.9); } catch (e) { rej(e); } });
    return new Uint8Array(await blob.arrayBuffer());
  }
  async function exportJpg(kinds, rec) {
    toast(t.jpgMaking, 6000);
    const html = await buildPrint(kinds, rec);
    const f = document.createElement('iframe'); f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;left:-12000px;top:0;width:1200px;height:1700px;border:0';
    try {
      await new Promise(res => { f.onload = res; f.srcdoc = html; document.body.appendChild(f); });
      await new Promise(r => setTimeout(r, 250));
      const d = f.contentDocument, css = Array.from(d.querySelectorAll('style')).map(x => x.textContent).join('\n');
      const pages = Array.from(d.querySelectorAll('.a4')), names = [];
      const files = [];
      for (let i = 0; i < pages.length; i++) {
        const k = kinds[i] || 'pages'; let nm = (k === 'tut' ? pagesBase(['tut'], rec) : pagesBase([k])) + '.jpg'; if (names.includes(nm)) nm = nm.replace('.jpg', `_${i + 1}.jpg`); names.push(nm);
        files.push({ name: nm, data: await pageToJpeg(pages[i], css) });
      }
      G.HR_LAST_JPG = files.map(x => ({ name: x.name, size: x.data.length, head: Array.from(x.data.slice(0, 3)) }));
      let ok;
      if (files.length === 1) ok = await saveFile(files[0].name, new Blob([files[0].data], { type: 'image/jpeg' }), 'image/jpeg');
      else ok = await saveFile(pagesBase(kinds, rec) + '.zip', makeZip(files), 'application/zip');
      if (ok) toast(t.jpgDone(files.length));
    } catch (e) { toast(t.jpgFail, 8000); }
    finally { f.remove(); }
  }
  // ---- Otomatik konum ----
  async function autoLocate(force, explicit) {
    if (ON.sandboxed || !navigator.geolocation) { if (explicit) { $('locMsg').textContent = t.locSandbox; toast(t.locSandbox); } return; }
    if (!force) { const p = await ON.geoPermission(); if (p !== 'granted') return; }
    try {
      const c = await ON.geolocate();
      const lat = +c.latitude.toFixed(4), lon = +c.longitude.toFixed(4);
      const moved = Math.abs(lat - st.lat) > 0.01 || Math.abs(lon - st.lon) > 0.01;
      st.locAuto = true;
      if (moved || st.city !== 'custom') {
        st.lat = lat; st.lon = lon; st.city = 'custom';
        if (c.altitude != null && isFinite(c.altitude)) st.elev = Math.max(0, Math.round(c.altitude));
        else if (st.wx && ON.online()) { try { const e = await ON.elevation(lat, lon); if (e != null) st.elev = Math.max(0, Math.round(e)); } catch (e) { /* */ } }
        try { st.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || st.tz; } catch (e) { /* */ }
        save(); fillStatic(); update();
      } else renderBar();
      toast(t.locAutoDone);
    } catch (e) { if (explicit) { $('locMsg').textContent = t.locFail; toast(t.locFail); } }
  }

  // ---- Doğrulama ----
  let testsDone = false;
  function runTests() {
    if (testsDone) return; testsDone = true;
    const rows = [], add = (c, qq, exp, got, tol, ok) => rows.push({ c, q: qq, exp, got, tol, ok: !!ok });
    const utc = at => at.date.toISOString().slice(0, 19).replace('T', ' ');
    const dmin = (a, b) => Math.abs(a.ut - b.ut) * 1440, TT = s => A.MakeTime(new Date(s));
    const ist = { lat: 41.0, lon: 29.0, elev: 0, hObs: 0, tz: 'Europe/Istanbul' };
    const c80 = A.SearchMoonPhase(0, TT('1980-05-10T00:00Z'), 10);
    add('Receb 1400 (s. 360)', 'İctimâ', '1980-05-14 12:00 UTC (15:00 TR)', utc(c80), '±3 dk', dmin(c80, TT('1980-05-14T12:00Z')) <= 3);
    const m18 = C.moment18(c80, 41.88);
    add('Receb 1400 (s. 360)', '18° anı', '1980-05-15 18:49 UTC', utc(m18.t), '±5 dk', dmin(m18.t, TT('1980-05-15T18:49Z')) <= 5);
    const e80 = C.evening(ist, '1980-05-15');
    add('Receb 1400 (s. 360)', 'İstanbul, Perşembe gurûbu: beynûnet', '17,17°', num(e80.beynunet), '±0,10°', Math.abs(e80.beynunet - 17.17) <= 0.1);
    add('Receb 1400 (s. 360)', 'İstanbul, Perşembe: sınıf', 'possible (< 18°)', e80.cls.code, '—', e80.cls.code === 'possible');
    const kay = { lat: 38.72, lon: 35.49, elev: 1054, hObs: 0, tz: 'Europe/Istanbul' };
    const k26 = C.evening(kay, '1987-07-26'), k27 = C.evening(kay, '1987-07-27');
    add('Kayseri 1987 (s. 344)', 'Pazar akşamı: görülemedi', '≠ visible', k26.cls.code, '—', k26.cls.code !== 'visible');
    add('Kayseri 1987 (s. 344)', 'Pazartesi gurûbu', '16:50 UTC (19:50 TR)', utc(k27.gurub), '±5 dk', dmin(k27.gurub, TT('1987-07-27T16:50Z')) <= 5);
    add('Kayseri 1987 (s. 344)', 'Pazartesi: sınıf (görüldü)', 'visible (≥ 18°)', k27.cls.code, '—', k27.cls.code === 'visible');
    const k2020 = C.topo('Moon', TT('1987-07-27T17:20Z'), new A.Observer(38.72, 35.49, 1054));
    add('Kayseri 1987 (s. 344)', '20:20 TR: hilâlin irtifâı (≥ 5°)', '7,55°', num(k2020.alt), '±0,20°', Math.abs(k2020.alt - 7.55) <= 0.2);
    const j = C.evening(ist, '2026-11-12');
    add('Jamry, İstanbul 12.11.2026', 'Gurûb', '14:48:13 UTC', utc(j.gurub), '±1 dk', dmin(j.gurub, TT('2026-11-12T14:48:13Z')) <= 1);
    add('Jamry, İstanbul 12.11.2026', 'Ayın batışı', '16:38:57 UTC', utc(j.moonset), '±1,5 dk', dmin(j.moonset, TT('2026-11-12T16:38:57Z')) <= 1.5);
    add('Jamry, İstanbul 12.11.2026', 'Fark', '110,73 dk', num(j.lagMin), '±1,5 dk', Math.abs(j.lagMin - 110.73) <= 1.5);
    add('Jamry, İstanbul 12.11.2026', 'Beynûnet', '37,17°', num(j.beynunet), '±0,10°', Math.abs(j.beynunet - 37.17) <= 0.1);
    add('Jamry, İstanbul 12.11.2026', 'İrtifâ (jeosentrik)', '13,66°', num(j.moonGeoAlt), '±0,20°', Math.abs(j.moonGeoAlt - 13.66) <= 0.2);
    add('Jamry, İstanbul 12.11.2026', 'Ayın semti', '212,34°', num(j.moonAz), '±0,20°', Math.abs(j.moonAz - 212.34) <= 0.2);
    add('Jamry, İstanbul 12.11.2026', 'Güneşin semti', '246,89°', num(j.sunAz), '±0,20°', Math.abs(j.sunAz - 246.89) <= 0.2);
    add('Jamry, İstanbul 12.11.2026', 'En iyi an', '15:37:26 UTC', utc(j.best), '±1 dk', dmin(j.best, TT('2026-11-12T15:37:26Z')) <= 1);
    add('Jamry, İstanbul 12.11.2026', 'Aydınlanma', '10,06 %', num(j.illum), '±0,30', Math.abs(j.illum - 10.06) <= 0.3);
    const tm = C.evening({ lat: 41.0, lon: 28.97, elev: 0, hObs: 0, hMax: 267, tz: 'Europe/Istanbul' }, '2026-03-21');
    add('Temkin, İstanbul 21 Mart (s. 186)', 'Temkin', '7 dk 52,29 sn', num(tm.seri.temkinMin, 2) + ' dk', '±0,5 dk', Math.abs(tm.seri.temkinMin - 7.8715) <= 0.5);
    const g = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    add('Takvim usulleri (s. 359)', 'Işık: 1362 Zilka’de', 'Cumartesi', g[CAL.isik(1362, 11)], '—', CAL.isik(1362, 11) === 6);
    add('Takvim usulleri (s. 359)', 'Madde 88: 1357 Muharrem', 'Perşembe', g[CAL.madde88(1357)], '—', CAL.madde88(1357) === 4);
    add('Takvim usulleri (s. 361)', 'Uluğ Beğ: 1316 Muharrem / Ramezân', 'Pazar / Cuma', g[CAL.ulugbey(1316, 1)] + ' / ' + g[CAL.ulugbey(1316, 9)], '—', CAL.ulugbey(1316, 1) === 0 && CAL.ulugbey(1316, 9) === 5);
    add('Takvim usulleri (s. 361)', 'Kindî: 1316 Ramezân', 'Cuma', g[CAL.kindi(1316, 9)], '—', CAL.kindi(1316, 9) === 5);
    add('Takvim usulleri (s. 358)', 'Ay adı: ictimâ 14.5.1980 / 25.7.1987', 'Receb 1400 / Zilhicce 1407', ['', ''].map((_, i) => { const h = CAL.monthForConjunction(new Date(i ? '1987-07-25T20:38Z' : '1980-05-14T12:00Z')); return I.MONTHS.tr[h.m - 1] + ' ' + h.y; }).join(' / '), '—', (() => { const a = CAL.monthForConjunction(new Date('1980-05-14T12:00Z')), b = CAL.monthForConjunction(new Date('1987-07-25T20:38Z')); return a.y === 1400 && a.m === 7 && b.y === 1407 && b.m === 12; })());
    const c26 = A.SearchMoonPhase(0, TT('2026-12-01T00:00Z'), 20);
    const eg = C.earliestDay(c26, null), el = C.earliestDay(c26, [[41.0, 29.0]]);
    add('Receb 1448 (Jamry)', 'Hesâbî en erken gün, İstanbul', '2026-12-11', ymdOf(el.first), '—', ymdOf(el.first) === '2026-12-11');
    add('Receb 1448 (Jamry)', 'Hesâbî en erken gün, dünya geneli', '2026-12-10', ymdOf(eg.first), '—', ymdOf(eg.first) === '2026-12-10');
    // Receb 1437 (Kongre tebliği, 2016): 7 Nisan akşamı hiçbir yerde görülmedi, 8 Nisan'da görüldü; ay 9 Nisan'da başladı.
    // Hesap 8 Nisan'ı "en erken" verir; rü'yetle başlama bir gün sonra olmuştur, önce değil (s. 360).
    const c37 = A.SearchMoonPhase(0, TT('2016-04-04T00:00Z'), 10), e37 = C.earliestDay(c37, null);
    const i37 = C.evening({ lat: 41.0082, lon: 28.9784, elev: 0, hObs: 0, tz: 'Europe/Istanbul' }, '2016-04-07');
    add('Receb 1437 (rasad, 2016)', 'Dünya geneli en erken gün; rü’yetle başlama 9 Nisan', '2016-04-08 (9 Nisan ≥ bu gün)', ymdOf(e37.first), '—', ymdOf(e37.first) === '2016-04-08' && '2016-04-09' >= ymdOf(e37.first));
    add('Receb 1437 (rasad, 2016)', 'İstanbul 7 Nisan akşamı', 'kesin red (beynûnet < 8°)', i37.ok ? i37.cls.code + ' · ' + i37.beynunet.toFixed(1) + '°' : '—', '—', i37.ok && i37.beynunet < 8);
    const fe = C.firstEvening(41.0, 29.0, c26);
    add('Harita', 'İlk görünürlük, İstanbul', '10 Aralık akşamı (k = 1)', fe ? 'k = ' + fe.k : '—', '—', fe && fe.k === 1);
    const ce = C.cell(41.0, 29.0, Date.UTC(2026, 10, 12), A.SearchMoonPhase(0, TT('2026-11-05T00:00Z'), 10), false);
    add('Harita', 'Hücre sınıfı, İstanbul 12.11.2026', 'visible', ce.code, '—', ce.code === 'visible');
    // saat dilimi ve konumdan bağımsız akşam (hata 2–3)
    const gj = C.evening({ lat: -6.2088, lon: 106.8456, elev: 0, hObs: 0, tz: 'Europe/London' }, '2026-12-10');
    add('saat dilimi', 'Cakarta, dilim Londra: 10 Ara gurûbu', '2026-12-10 ≈ 10:59 UTC', utc(gj.gurub), '±3 dk', dmin(gj.gurub, TT('2026-12-10T10:59Z')) <= 3);
    const gs = C.evening({ lat: -33.87, lon: 151.21, elev: 0, hObs: 0, tz: 'UTC' }, '2026-12-10');
    add('harita tıklaması', 'Sidney, dilim UTC: 10 Ara gurûbu', '2026-12-10 ≈ 08:58 UTC', utc(gs.gurub), '±3 dk', dmin(gs.gurub, TT('2026-12-10T08:58Z')) <= 3);
    const gc = C.evening({ lat: 41.8781, lon: -87.6298, elev: 0, hObs: 0, tz: 'Europe/Istanbul' }, '2026-12-10');
    add('saat dilimi', 'Şikago, dilim İstanbul: 10 Ara gurûbu', '2026-12-10 ≈ 22:19 UTC', utc(gc.gurub), '±3 dk', dmin(gc.gurub, TT('2026-12-10T22:19Z')) <= 3);
    const on = C.observationNights(ist, '2026-11-20');
    add('gözlem gecesi', 'İstanbul, Receb 1448: A / B', '2026-12-10 / 2026-12-11', on ? `${on.a && on.a.ymd} / ${on.b && on.b.ymd}` : '—', '—', on && on.a && on.a.ymd === '2026-12-10' && on.b && on.b.ymd === '2026-12-11');
    const mo7 = C.morning(ist, '2026-12-07'), mo8 = C.morning(ist, '2026-12-08');
    add('sabah hilâli', 'İstanbul 7 / 8 Aralık 2026', 'possible / below5', `${mo7.code} / ${mo8.code}`, '—', mo7.code === 'possible' && mo8.code === 'below5');
    const ins = C.instant(TT('2026-12-10T15:00Z'));
    add('anlık harita', 'Güneşin tepede olduğu nokta, 10.12.2026 15:00 UTC', '−22,9°, −46,8°', `${num(ins.subSolar.lat, 1)}°, ${num(ins.subSolar.lon, 1)}°`, '±0,3°', Math.abs(ins.subSolar.lat + 22.9) <= 0.3 && Math.abs(ins.subSolar.lon + 46.8) <= 0.3);
    const jb = C.evening(ist, '2026-12-11'), pb = C.at(jb.best, ist);
    const sb = C.searchable(pb, 'gurub', jb.ageH), sb6 = C.searchable(C.at(jb.gurub.AddDays(2 / 1440), ist), 'm6', jb.ageH);
    add('aranabilirlik', 'İstanbul 11.12.2026: en iyi anda / gurûb+2 dk (−6° eşiği)', 'aranabilir / güneş eşiğin üstünde', `${sb.ok ? 'ok' : sb.reasons.join(',')} / ${sb6.reasons.join(',') || 'ok'}`, '—', sb.ok && sb6.reasons.includes('sun'));
    const altCheck = C.altFast(ins.sun.ra, ins.sun.dec, ins.gast, ins.subSolar.lat, ins.subSolar.lon);
    add('anlık harita', 'Tepe noktasında güneşin yüksekliği', '90°', degf(altCheck, 2), '±0,05°', Math.abs(altCheck - 90) <= 0.05);
    // hicrî gösterim (Muharrem’de eski ve yeni yıl), gök haritası, hava değerlendirmesi
    const hR = hijriOf('2026-12-10'), hR3 = hijriOf('2026-12-12');
    add('hicrî gün', 'Receb 1448: 10 / 12 Aralık 2026 (gündüz)', '1 Receb 1448 | 29/30 Cemâziyelâhir 1448 / 3 (veya 2)', `${hR && hR.plain} / ${hR3 && hR3.dayTxt}`, '—', hR && /^1 Receb 1448/.test(hR.plain) && /1448$/.test(hR.plain) && hR3 && hR3.dayTxt === '3 | 2');
    const cM = C.nextNewMoonAfter(TT('2027-05-25T00:00Z')), hmM = CAL.monthForConjunction(cM.date), eM2 = earliest(cM, null), hM = eM2 && hijriOf(ymdOf(eM2.first));
    add('hicrî yıl', 'Muharrem 1449: en erken günde iki yıl birlikte', 'Muharrem 1449 | Zilhicce 1448', hM ? hM.monthTxt : '—', '—', hmM.m === 1 && hmM.y === 1449 && hM && hM.monthTxt.includes('1449') && hM.monthTxt.includes('1448'));
    const pol = G.HRStarMap.horizonOf(TT('2026-12-10T18:00Z'), new A.Observer(41.0, 29.0, 0))(37.95, 89.264);
    add('gök haritası', 'Kutup Yıldızı’nın irtifâı (İstanbul) ≈ enlem', '≈ 41°', degf(pol.alt, 2), '±1°', Math.abs(pol.alt - 41) <= 1);
    const dp = ON.dest(41, 29, 270, 25);
    add('hava', 'Batı ufku noktası: 25 km batı', 'boylam ≈ 28,70°', degf(dp[1], 3), '±0,01°', Math.abs(dp[1] - (29 - 25 / (111.32 * Math.cos(41 * Math.PI / 180)))) <= 0.01);
    const as1 = ON.assess({ cloud_cover: 12, cloud_cover_low: 5, visibility: 24000, relative_humidity_2m: 60, precipitation_probability: 5 }, null, { aerosol_optical_depth: 0.1 }), as2 = ON.assess({ cloud_cover: 90, cloud_cover_low: 60, visibility: 6000, relative_humidity_2m: 95, precipitation_probability: 70 }, null, null);
    add('hava', 'Değerlendirme: açık / kapalı-yağışlı', 'good / poor', `${as1.level} / ${as2.level}`, '—', as1.level === 'good' && as2.level === 'poor');
    // ay başı rasadı gezintisi (İstanbul), kanonik JSON
    const keepLOC = LOC; LOC = { lat: 41.0082, lon: 28.9784, elev: 40, hObs: 0, hMax: 267, tz: 'Europe/Istanbul' };
    let nN = null, nP = null; try { nN = findNight('A', '2026-11-12'); nP = prevNightOf('A', '2026-12-10'); } finally { LOC = keepLOC; }
    add('ay başı rasadı', 'İstanbul: 11.11.2026’den sonraki / 10.12.2026’dan önceki', '2026-12-10 / 2026-11-11', `${nN && nN.ymd} / ${nP && nP.ymd}`, '—', nN && nN.ymd === '2026-12-10' && nP && nP.ymd === '2026-11-11');
    const cj = G.HRSig.canon({ b: 1, a: [2, { d: 1, c: 'ş' }] });
    add('kayıt bütünlüğü', 'Kanonik JSON (sıralı anahtar)', '{"a":[2,{"c":"ş","d":1}],"b":1}', cj, '—', cj === '{"a":[2,{"c":"ş","d":1}],"b":1}');
    // şafak iki kavli (s. 178, 197) ve konum girişi çözümleyici
    const sf = C.evening({ lat: 41.0082, lon: 28.9784, elev: 40, hObs: 0, hMax: 267, tz: 'Europe/Istanbul' }, '2026-12-10');
    const dTem = (sf.safak19.ut - sf.safak19h.ut) * 1440;
    add('şafak (s. 178, 197)', 'İstanbul 10.12.2026: şer’î şafak = hakîkî + temkin; −19° > −17°', `fark = temkin (${num(sf.safakTemkin, 2)} dk)`, `${num(dTem, 2)} dk · ${hhmm(sf.safak17)} < ${hhmm(sf.safak19)}`, '±0,05 dk', Math.abs(dTem - sf.safakTemkin) < 0.05 && sf.safak19.ut > sf.safak17.ut);
    const CP = G.HRCoord.parse, near = (a, b) => Math.abs(a - b) < 1e-5;
    const cases = [['lat', '41,0082', 41.0082], ['lat', '41.0082 K', 41.0082], ['lat', 'N41.0082', 41.0082], ['lat', `41°00'29.5"N`, 41.008194], ['lat', '41 0 29,5 kuzey', 41.008194], ['lat', '33,87 G', -33.87], ['lat', '-33.87', -33.87], ['lon', '28°58′42″D', 28.978333], ['lon', '73,98 B', -73.98], ['lon', '73.98W', -73.98], ['lon', '+28,9784', 28.9784], ['lat', '41 0,49 K', 41.008167]];
    const okC = cases.filter(([k, i, v]) => { const r = CP(i, k); return r.ok && near(r.value, v); }).length;
    add('konum girişi', 'Tek değer biçimleri (ondalık virgül/nokta, K/N/G/S/D/E/B/W, derece-dakika-saniye, işaret)', `${cases.length} / ${cases.length}`, `${okC} / ${cases.length}`, '1e-5°', okC === cases.length);
    const p1 = CP('41.0082, 28.9784', 'lat'), p2 = CP('41,0082 28,9784', 'lon'), p3 = CP('https://maps.example/@41.0082,28.9784,15z', 'lat'), p4 = CP(`41°0'29"N 28°58'42"E`, 'lon'), sw = CP('28.9784 E', 'lat');
    const pairOk = [p1, p2, p3, p4].every(r => r.ok && r.pair && near(r.pair[0], p4.pair[0] > 41.008 ? r.pair[0] : r.pair[0]) && r.pair[0] > 41 && r.pair[0] < 41.01 && r.pair[1] > 28.97 && r.pair[1] < 28.98) && sw.ok && sw.swapped;
    add('konum girişi', 'Çift giriş, harita bağlantısı, yanlış alana yazılan tûl', 'çift → iki alan; “E” → tûl alanı', pairOk ? 'doğru' : JSON.stringify([p1, p2, p3, p4, sw].map(r => r.pair || r.err || r.swapped)), '—', pairOk);
    const bad = [CP('95', 'lat').err, CP('41 65 0', 'lat').err, CP('41 X', 'lat').err], nums = [G.HRCoord.parseNum('1.054'), G.HRCoord.parseNum('40,5 m'), G.HRCoord.parseNum('267')];
    add('konum girişi', 'Hatalı girişler ve sayı alanları', 'range · minsec · letter / 1054 · 40,5 · 267', `${bad.join(' · ')} / ${nums.join(' · ')}`, '—', bad.join() === 'range,minsec,letter' && nums[0] === 1054 && nums[1] === 40.5 && nums[2] === 267);
    // UTC saat farkı kutusu
    const po = ['+3', '3', 'UTC+3', '−5', '-3:30', '+5,5', '+0545', 'GMT-4', '±0', 'x', '+15', '+3:20'].map(parseOff);
    const poOk = JSON.stringify(po) === JSON.stringify([180, 180, 180, -300, -210, 330, 345, -240, 0, null, null, null]);
    const zo = [180, -300, 330, 0].map(zoneForOff), zoOff = zo.map(z => offAt(z, '2026-12-10'));
    add('UTC saat farkı', 'Yazım biçimleri (+3, UTC+3, −5, -3:30, +5,5, +0545, GMT-4, ±0; hatalılar) ve sabit dilim eşlemesi', '12/12 · +3 −5 +5:30 ±0', `${po.filter((x, i) => x === [180, 180, 180, -300, -210, 330, 345, -240, 0, null, null, null][i]).length}/12 · ${zoOff.map(fmtOff).join(' ')}`, '—', poOk && JSON.stringify(zoOff) === '[180,-300,330,0]');
    const bOff = [offAt('Europe/Berlin', '2026-01-15'), offAt('Europe/Berlin', '2026-07-15'), offAt('Europe/Istanbul', '2026-07-15')];
    add('UTC saat farkı', 'Bölgesel dilim yaz saatini izler: Berlin ocak / temmuz, İstanbul temmuz', '+1 / +2 / +3', bOff.map(fmtOff).join(' / '), '—', JSON.stringify(bOff) === '[60,120,180]');
    // bağımsız inceleme raporu bulguları
    const iso = ms => new Date(ms).toISOString().slice(0, 16).replace('T', ' ');
    const dst = [['Europe/Berlin', '2026-03-29', 30, '2026-03-28 23:30'], ['Europe/Berlin', '2026-10-25', 30, '2026-10-24 22:30'], ['Europe/Berlin', '2026-03-29', 1200, '2026-03-29 18:00'],
      ['Europe/Berlin', '2026-03-29', 150, '2026-03-29 01:30'], ['Europe/Berlin', '2026-10-25', 150, '2026-10-25 00:30'], ['America/New_York', '2026-03-08', 1200, '2026-03-09 00:00'], ['Europe/London', '2026-10-25', 1080, '2026-10-25 18:00']];
    const dstGot = dst.map(([z, d, m]) => iso(C.localToUT(d, m, z)));
    add('saat dilimi', 'Yaz saati geçiş günlerinde yerel saat → UTC (Berlin 00:30, 20:00, 02:30 · New York · Londra)', dst.map(x => x[3].slice(11)).join(' / '), dstGot.map(x => x.slice(11)).join(' / '), '0 dk', dst.every((x, i) => x[3] === dstGot[i]));
    const yq = C.evening({ lat: 41.0082, lon: 28.9784, elev: 40, hObs: 0, hMax: 267, tz: 'Europe/Istanbul' }, '2026-12-10');
    add('Yallop (1997)', 'İstanbul 10.12.2026: q, jeosentrik ARCL ile (inceleme raporundaki bağımsız hesap ≈ 0,1149)', '0,115 ± 0,005', num(yq.yallopQ, 4), '±0,005', Math.abs(yq.yallopQ - 0.1149) <= 0.005);
    const cG = A.SearchMoonPhase(0, TT('2026-08-01T00:00Z'), 40), fullG = []; for (let la = -66; la <= 66; la += 6) for (let lo = -180; lo < 180; lo += 15) fullG.push([la, lo]);
    const gB = C.earliestDay(cG, null), gF = C.earliestDay(cG, fullG);
    add('küresel kapsam', 'Ağustos 2026 ictimâsı: tarih çizgisi kuşağı = bütün dünya ızgarası (en erken akşam)', gF ? ymdOf(gF.evening) : '—', gB ? ymdOf(gB.evening) : '—', '—', gB && gF && ymdOf(gB.evening) === ymdOf(gF.evening));
    const keepF = { r: $('recRes').value, s: $('recSeers').value, f: $('recFirst').value, l: $('recLast').value };
    $('recRes').value = 'naked'; $('recSeers').value = '0'; const fe1 = recFormError();
    $('recSeers').value = '1'; $('recFirst').value = '18:20'; $('recLast').value = '18:05'; const fe2 = recFormError();
    $('recRes').value = 'noObs'; $('recSeers').value = '0'; $('recFirst').value = ''; $('recLast').value = ''; const fe3 = recFormError();
    Object.assign($('recRes'), { value: keepF.r }); $('recSeers').value = keepF.s; $('recFirst').value = keepF.f; $('recLast').value = keepF.l;
    add('kayıt formu', 'Gördüm + 0 kişi / ilk > son saat / gözlem yapılamadı', 'hata / hata / geçerli', `${fe1 ? 'hata' : 'geçerli'} / ${fe2 ? 'hata' : 'geçerli'} / ${fe3 ? 'hata' : 'geçerli'}`, '—', fe1 === t.recErrSeers && fe2 === t.recErrOrder && !fe3);
    // yaklaşan ay başı rasadı (geçmiş geceye gitmez), yayın bildirimi ve bütünlük
    const keep2 = LOC; LOC = { lat: 41.0082, lon: 28.9784, elev: 40, hObs: 0, hMax: 267, tz: 'Europe/Istanbul' };
    let u1 = null, u2 = null, u3 = null; try { u1 = nextRasad('2026-11-11'); u2 = nextRasad('2026-11-12'); u3 = nextRasad('2026-12-11'); } finally { LOC = keep2; }
    add('yaklaşan rasad', 'İstanbul: 11.11 / 12.11 / 11.12.2026’den itibaren ilk ay başı gecesi', '2026-11-11 / 2026-12-10 / 2027-01-09',
      `${u1.a && u1.a.ymd} / ${u2.a && u2.a.ymd} / ${u3.a && u3.a.ymd}`, '—', u1.a && u1.a.ymd === '2026-11-11' && u2.a && u2.a.ymd === '2026-12-10' && u3.a && u3.a.ymd === '2027-01-09' && (!u3.b || u3.b.ymd >= '2027-01-09'));
    add('özgün dosya', 'Gömülü bildirim çözülür; modül özeti eşleşir', `${bare(HOME)} · özgün`, `${NOTICE ? bare(NOTICE.u) : '—'} · ${OFFICIAL === true ? 'özgün' : OFFICIAL === false ? 'eşleşmiyor' : 'denetlenemedi'}`, '—', !!NOTICE && OFFICIAL === true);
    const ok = rows.filter(x => x.ok).length;
    $('tests').innerHTML = `<caption class="small" style="text-align:left;padding-bottom:8px">${ok} / ${rows.length} ${t.pass.toLowerCase()}</caption>
      <thead><tr><th>${t.tCase}</th><th>${t.tQty}</th><th>${t.tExp}</th><th>${t.tGot}</th><th>${t.tTol}</th><th>${t.tRes}</th></tr></thead><tbody>` +
      rows.map(x => `<tr><td>${esc(x.c)}</td><td>${esc(x.q)}</td><td class="n">${esc(x.exp)}</td><td class="n">${esc(x.got)}</td><td class="n">${esc(x.tol)}</td><td><span class="pill ${x.ok ? 'p-ok' : 'p-bad'}">${x.ok ? t.pass : t.fail}</span></td></tr>`).join('') + '</tbody>';
    G.HR_TEST_RESULT = { ok, total: rows.length, rows };
  }

  let rzT; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { if (DAY && view === 'plan') renderTime(); }, 200); });
  fillStatic(); bind(); route(); setLive(true); update();
  applyFonts();
  if (st.autoLoc) setTimeout(() => autoLocate(false), 300);
  G.HRUI = { runTests, update, st, setDate, setTmin, goNow, goNight, printPages, official: () => OFFICIAL, notice: () => NOTICE };
})(window);
