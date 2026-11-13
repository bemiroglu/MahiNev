/* Metinler: 0.14 (harita: Tam İlmihâl ölçü çizgileri, üç gece, işaretler, ağ, şehirler, PNG; hilâl verileri) */
(function (G) {
  'use strict';
  G.HR_VERSION = '0.14.0';
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
    night3Sub: { prev: ev => `evening of ${ev} · the month cannot begin before this (p. 315)`, A: (ev, d) => `evening of ${ev} · if seen, day 1 is ${d}`, B: (ev, d) => `evening of ${ev} · if not seen on the first night, day 1 is ${d}` },
    map3Note: 'Three evenings of the same month. Day 1 of the month is the day after the first night (the calculated day) or one day later; it cannot be earlier (p. 315). Which of the two it is becomes certain by sighting.',
    map3First: 'The “first-visibility evening” layer already shows four evenings on one map; the three-night view draws Tam İlmihâl’s classes.',
    firstLbl: { poss: 'First possible place', vis: 'First visible place' },
    firstSub: (tm, b) => `sunset ${tm} · beynûnet ${b}`,
    lgBook8: 'Beynûnet 8° line (below: definite rejection)', lgBook18: 'Beynûnet 18° line (above: visible)', lgBook5: 'İrtifâ 5° at sunset (dashed)',
    lgUp0: 'Moon on the horizon at sunset (dotted)', lgHatch: 'Hatched: definite rejection', lgFirst8: 'First possible place (earliest sunset this evening)', lgFirst18: 'First visible place (earliest sunset this evening)', lgValue: v => `Thin line: ${v}`,
    lgYallopLine: 'Yallop q boundaries (thin line)', lgOdehLine: 'Odeh V boundaries (thin line)', lgGrat: 'Grid: 20°',
    mapPng: 'Save PNG', mapPngTip: 'Saves the map as an image in the selected language, with title, legend and source.',
    mapWait: 'Preparing the map…', mapSaved: 'Image saved.',
    pngSrc: (b, v) => `Source: ${b} (pp. 315, 360) · Computation: Astronomy Engine · Relief: NASA Blue Marble · Mâh-ı Nev ${v}`,
    pngNote: 'A map of calculated possibility; the month begins by sighting.',
    pickMore: 'Additional info (this point, at sunset)',
    hcTitle: 'Crescent data (at sunset)', hcNote: 'Additional information; the ruling follows Tam İlmihâl’s measures and sighting.',
    hcSunAzAlt: 'Sun: azimuth / irtifâ', hcMoonAzAlt: 'Moon: azimuth / irtifâ', hcDaz: 'DAZ (azimuth difference)', hcSd: 'Moon’s semi-diameter (SD)', hcHp: 'Moon’s horizontal parallax (HP)',
    hcDist: 'Moon’s distance (centre)', hcIllum: 'Illuminated fraction', hcElongGeo: 'Beynûnet (geocentric / topocentric)', hcConj: 'Conjunction (local / UTC)', hcWin: 'Sunset to 5° irtifâ',
    hcMoonset: 'Moonset', km: 'km', hcArcv: 'ARCV (at sunset, topocentric)', hcWidth: 'Crescent width (at sunset)', hcDistSub: 'from Earth’s centre / from the observer',
    prOptsMap3: 'World map: three nights (each night on its own A4)'
  });
  T.tr.mapLand = T.tr.landOnly; T.en.mapLand = T.en.landOnly;
  T.tr.prOpts = Object.assign({}, T.tr.prOpts, { map3: T.tr.prOptsMap3 });
  T.en.prOpts = Object.assign({}, T.en.prOpts, { map3: T.en.prOptsMap3 });
})(typeof globalThis !== 'undefined' ? globalThis : window);
