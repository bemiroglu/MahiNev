// İngilizce metinlerdeki Tam İlmihâl sayfa atıflarını Endless Bliss (fasikül, sayfa) atıflarına çevirir.
const fs = require('fs'), path = require('path');
const SRC = '/home/claude/mahinev/src';
const spans = require('./enspans.json');
const IV = { 175: '135', 176: '138', 178: '143', 179: '145', 181: '151', 185: '159', 186: '160', 188: '165', 194: '175', 197: '181', 244: '284' };
const IV_R = { '175–176': '135–138', '175–186': '135–160', '175–203': '135–195', '185–186': '159–160' };
function vPage(p, ctx) {
  const c = ctx;
  switch (p) {
    case 314: return '54';
    case 315:
      if (/earlier|day before|one day later|a day after|cannot be|not before|or (the day|one day) after|one day after/.test(c)) return '57';
      if (/everywhere|whole world|worldwide|global/i.test(c)) return '56';
      if (/witness|’âdil|Qâdî(?!-)|I saw it|testif/.test(c)) return '56';
      if (/29th|thirty|30 days|completed|communal|wâjib|sought/.test(c)) return '55';
      if (/calendar|not permissible|hadith/i.test(c)) return '54';
      return '55–57';
    case 316:
      if (/Qâdî-Khân|twilight|shafaq|Shawwâl/.test(c.slice(-140))) return '58';
      if (/make-up|qadâ|two days|one day if/.test(c)) return '56';
      if (/precaution|ihtiyât|Tamkin|imsâk/i.test(c)) return '59';
      return '58';
    case 317: return '61';
    case 326: return '79';
    case 344: return '117';
    case 358: return '132';
    case 359: return /Article 88|Muharram|start of the Hijri year|first day of the Hijri/.test(c) ? '134' : '134–136';
    case 360: return /’Arafa|Ibni ’Âbidîn|qibla|act of worship|Hajj/.test(c) && !/elongation|beynûnet|8°|18°|5°|Subkî/.test(c.slice(-160)) ? '138' : '137';
    case 361: return '138–139';
    case 362: return '139–141';
  }
  return null;
}
const V_R = { '314–315': '54–55', '314–316': '54–58', '315–316': c => (/make-up|qadâ/.test(c) ? '56–57' : '55–58'), '358–362': '132–141', '361–362': '138–141' };
function conv(list, ctx) { // list: "315, 360" or "315–316"
  const items = list.split(/,\s*/);
  const iv = [], v = [];
  for (const it of items) {
    if (/–/.test(it)) {
      if (IV_R[it]) iv.push(IV_R[it]);
      else if (V_R[it]) v.push(typeof V_R[it] === 'function' ? V_R[it](ctx) : V_R[it]);
      else return null;
    } else {
      const n = +it;
      if (IV[n]) iv.push(IV[n]); else { const q = vPage(n, ctx); if (!q) return null; v.push(q); }
    }
  }
  const fmt = (vol, a) => `${vol}, ${a.length > 1 || /–/.test(a[0]) ? 'pp.' : 'p.'} ${a.join(', ')}`;
  const parts = []; if (iv.length) parts.push(fmt('IV', iv)); if (v.length) parts.push(fmt('V', v));
  return 'EB ' + parts.join('; ');
}
const write = process.argv.includes('--write');
const byFile = {}; spans.forEach(s => (byFile[s.f] = byFile[s.f] || []).push(s));
const log = [], skipped = [];
for (const [f, arr] of Object.entries(byFile)) {
  let code = fs.readFileSync(path.join(SRC, f), 'utf8');
  arr.sort((a, b) => b.s - a.s);
  for (const s of arr) {
    const seg = code.slice(s.s, s.e);
    const ns = seg.replace(/\b(pp?)\. (\d{3}(?:–\d{3})?(?:, \d{3}(?:–\d{3})?)*)/g, (m, pp, list, off) => {
      const before = seg.slice(Math.max(0, off - 220), off);
      if (/vol\. \d+, $|paper, $|Congress paper/.test(before.slice(-20))) { skipped.push(`${f}: ${m} [${before.slice(-40)}]`); return m; }
      const r = conv(list, before);
      if (!r) { skipped.push(`${f}: ${m} [no map]`); return m; }
      return r;
    }).replace(/Tam İlmihâl EB /g, 'Tam İlmihâl, EB ');
    if (ns !== seg) { log.push(`${f}: ${seg.length > 300 ? '…' : ''}${diffShort(seg, ns)}`); code = code.slice(0, s.s) + ns + code.slice(s.e); }
  }
  if (write) fs.writeFileSync(path.join(SRC, f), code);
}
function diffShort(a, b) {
  const out = []; const re = /EB (IV|V)[^)·;]*?(?=\)|$|·| —)/g; let m;
  const ra = a.match(/\bpp?\. \d{3}[^)]*?(?=\)|$)/g) || [], rb = b.match(/EB [^)]*?(?=\)|$)/g) || [];
  for (let i = 0; i < rb.length; i++) out.push(`${(ra[i] || '?')} → ${rb[i]}  «${(a.split(ra[i] || '§')[0] || '').slice(-70)}»`);
  return out.join('\n   ');
}
fs.writeFileSync('/home/claude/eb/cites_diff.txt', log.join('\n') + '\n\nSKIPPED:\n' + skipped.join('\n'));
console.log('literals:', log.length, 'skipped:', skipped.length, write ? '(written)' : '(dry)');
