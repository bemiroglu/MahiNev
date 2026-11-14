// İngilizce dizgilerde Endless Bliss terimlerine geçiş. Kullanım: node apply_terms.js [--write]
const fs = require('fs'), path = require('path');
const SRC = '/home/claude/mahinev/src';
const spans = require('./enspans.json');
const R = [
  // kaynak ve kişi adları
  [/Ibn [ʿ’']?Abidin/g, 'Ibni ’Âbidîn'],
  [/Imam Subki|Imâm Subkî|Imam Subkî/g, 'Imâm-i Subkî'],
  [/\bSubki\b/g, 'Subkî'],
  [/Kâdîhân|Kadikhan|Qadikhan|Qadi Khan|Qâdîkhân/g, 'Qâdî-Khân'],
  [/Ulugh Beg|Uluğ Beğ|Ulugh Bey/g, 'Uluğ Bey'],
  [/Ebüzziyâ|Ebuzziya/g, 'Abuzziyâ'],
  [/Takiyyuddin Muhammad ibn Daqiq/g, 'Taqiy-y-ud-dîn Muhammad ibni Daqîq'],
  [/\bibn Daqiq\b/g, 'ibni Daqîq'],
  [/Fatawa al-Hindiyya/g, 'Fatâwâ-i Hindiyya'],
  [/Ziyâ Beg\b/g, 'Ziyâ Bey'], [/Shari[ʿ’]a/g, 'Sharî’a'],
  [/\bupright (?=Muslim|witness|person)/g, '’âdil '], [/\bthe feast\b/g, 'the ’Iyd'], [/\bjust person/g, '’âdil person'], [/\bjudge\b/g, 'Qâdî'], [/\bJudge\b/g, 'Qâdî'],
  [/Imâm-ı A[‘’']zam|Imam A[’'ʿ]zam|Imâm-ı a[’']zam/g, 'Imâm-i a’zam'],
  [/Imâmayn|Imamayn|Imameyn/g, 'Imâmeyn'],
  // aylar ve günler
  [/Eid al-Adha|[ʿ’]Id al-Adha/g, '’Iyd of Qurbân'], [/Eid al-Fitr/g, '’Iyd of Fitr'],
  [/[ʿ’]Id\b|\bEid\b/g, '’Iyd'],
  [/Ramadan/g, 'Ramadân'],
  [/Sha[ʿʻ’']ban|\bShaban\b/g, 'Sha’bân'],
  [/Shawwal/g, 'Shawwâl'],
  [/Dhu al-Hijja/g, 'Dhu’l-hijja'], [/Dhu al-Qa[ʻʿ’']da/g, 'Dhu’l-qa’da'],
  [/Rabi[ʻʿ’'] al-Awwal/g, 'Rabî’ul-awwal'], [/Rabi[ʻʿ’'] al-Akhir/g, 'Rabî’ul-âkhir'],
  [/Jumada al-Ula/g, 'Jamâzil-awwal'], [/Jumada al-Akhira/g, 'Jamâzil-âkhir'],
  [/[ʿ’']?Arafat\b/g, '’Arafât'],
  [/[ʿ’']?Arafah\b|[ʿ’']?Arafa\b/g, '’Arafa'],
  [/\bQurban\b/g, 'Qurbân'],
  // ay ve hilâl
  [/ictimâ[’']-ı neyyireyn/g, 'ijtimâ’i neyyireyn'],
  [/İctimâ\b/g, 'Ijtimâ’'], [/\bictimâ\b(?![’'])/g, 'ijtimâ’'],
  [/\bmuhak\b/g, 'muhâq'], [/\bMuhak\b/g, 'Muhâq'],
  // vakit terimleri (Endless Bliss IV, 10. bölüm)
  [/[Şş]er[’']î gurûb/g, m => (m[0] === 'Ş' ? 'Shar’î sunset' : 'shar’î sunset')],
  [/Şer[’']î/g, 'Shar’î'], [/şer[’']î/g, 'shar’î'],
  [/legal sunset/g, 'shar’î sunset'], [/Legal sunset/g, 'Shar’î sunset'],
  [/legal horizon/g, 'shar’î horizon'], [/legal time/g, 'shar’î time'],
  [/visible sunset/g, 'apparent sunset'], [/zâhirî sunset/g, 'apparent sunset'], [/hakîkî sunset/g, 'true sunset'],
  [/\bhakîkî\b/g, 'haqîqî'],
  [/\btemkin\b|\btamkin\b/g, 'Tamkin'], [/\bTemkin\b/g, 'Tamkin'],
  [/\bezânî\b/g, 'adhânî'],
  [/white glow/g, 'whiteness'], [/red glow/g, 'redness'],
  [/İnhitât-ı ufk \(dip of the horizon\)/g, 'Dip of horizon (inhitât-i ufq)'],
  [/Râsıd height \(observer, m\)/g, 'Observer’s height (râsid, m)'],
  [/İrtifâ \(apparent altitude\)/g, 'Apparent altitude (irtifâ’)'],
  [/vâcib-i kifâye/g, 'wâjib-i kifâya']
];
const write = process.argv.includes('--write');
const byFile = {};
spans.forEach(s => (byFile[s.f] = byFile[s.f] || []).push(s));
const log = [];
for (const [f, arr] of Object.entries(byFile)) {
  let code = fs.readFileSync(path.join(SRC, f), 'utf8');
  arr.sort((a, b) => b.s - a.s);
  for (const s of arr) {
    const seg = code.slice(s.s, s.e);
    let ns = seg; for (const [re, to] of R) ns = ns.replace(re, to);
    if (ns !== seg) { log.push(`${f}@${s.s}\n  - ${seg.slice(0, 400)}\n  + ${ns.slice(0, 400)}`); code = code.slice(0, s.s) + ns + code.slice(s.e); }
  }
  if (write) fs.writeFileSync(path.join(SRC, f), code);
}
fs.writeFileSync('/home/claude/eb/terms_diff.txt', log.join('\n'));
console.log('changed literals:', log.length, write ? '(written)' : '(dry run)');
