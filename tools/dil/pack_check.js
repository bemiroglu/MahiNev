// Dil paketi parçası denetimi ve birleştirme.
//   node tools/dil/pack_check.js ÇEVİRİ.js KAYNAK.en.js        → yapı denetimi (anahtar, tür, liste uzunluğu, işlev parametreleri, ${…} ifadeleri)
//   node tools/dil/pack_check.js --build DİZİN DİL ÇIKIŞ.js       → DİZİN/<parça>.<DİL>.js dosyalarını birleştirip denetler, src/lang/<DİL>.js yazar
const fs = require('fs'), path = require('path');
const load = f => new Function('"use strict"; return (' + fs.readFileSync(f, 'utf8') + '\n);')();
const kind = v => Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v;
const params = fn => { const s = fn.toString(); const m = s.match(/^\s*(?:\(([^)]*)\)|([A-Za-z_$][\w$]*))\s*=>/); return m ? (m[1] !== undefined ? m[1] : m[2]).replace(/\s/g, '') : '?'; };
const exprs = fn => { const out = []; const s = fn.toString(); const re = /\$\{([^{}`]*)\}/g; let m; while ((m = re.exec(s))) out.push(m[1].replace(/\s/g, '')); return out.sort().join('|'); };
const stringsIn = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(stringsIn) : v && typeof v === 'object' ? Object.values(v).flatMap(stringsIn) : [];
function compare(a, b, p, errs, warns) {
  const ka = kind(a), kb = kind(b);
  if (ka !== kb) { errs.push(`${p}: tür ${ka} ≠ ${kb}`); return; }
  if (ka === 'array') { if (a.length !== b.length) errs.push(`${p}: liste uzunluğu ${a.length} ≠ ${b.length}`); a.forEach((x, i) => i < b.length && compare(x, b[i], `${p}[${i}]`, errs, warns)); return; }
  if (ka === 'object') {
    for (const k of Object.keys(b)) if (!(k in a)) errs.push(`${p}.${k}: eksik`);
    for (const k of Object.keys(a)) if (!(k in b)) errs.push(`${p}.${k}: fazla`); else compare(a[k], b[k], `${p}.${k}`, errs, warns);
    return;
  }
  if (ka === 'function') {
    if (params(a) !== params(b)) errs.push(`${p}: parametreler (${params(a)}) ≠ (${params(b)})`);
    if (exprs(a) !== exprs(b)) warns.push(`${p}: \${…} ifadeleri farklı:\n    çeviri: ${exprs(a)}\n    kaynak: ${exprs(b)}`);
    return;
  }
  if (ka === 'string') {
    const tags = s => (s.match(/<\/?[a-z][^>]*>/gi) || []).join('');
    if (tags(a) !== tags(b)) warns.push(`${p}: HTML etiketleri farklı`);
    if (/\bs\. \d/.test(a) && !/\bs\. \d/.test(b)) warns.push(`${p}: Türkçe sayfa atfı (s. …) kalmış olabilir`);
    if (b.trim() && a.trim() === b.trim() && /[a-z]{4,} [a-z]{4,}/i.test(b)) warns.push(`${p}: çevrilmemiş görünüyor: ${b.slice(0, 60)}`);
  }
}
function check(tr, src, label) {
  const errs = [], warns = [];
  compare(tr, src, label, errs, warns);
  return { errs, warns };
}
function ser(v, ind) {
  const pad = '  '.repeat(ind + 1), end = '  '.repeat(ind), isId = k => /^[A-Za-z_$][\w$]*$/.test(k);
  if (typeof v === 'function') return v.toString();
  if (typeof v === 'string') return JSON.stringify(v);
  if (v === null || typeof v !== 'object') return String(v);
  if (Array.isArray(v)) return '[' + v.map(x => ser(x, ind + 1)).join(', ') + ']';
  return '{\n' + Object.keys(v).map(k => pad + (isId(k) ? k : JSON.stringify(k)) + ': ' + ser(v[k], ind + 1)).join(',\n') + '\n' + end + '}';
}
const a = process.argv.slice(2);
if (a[0] === '--build') {
  const [, dir, L, outFile] = a, CH = ['ui1', 'ui2', 'ui3', 'misc', 'guide', 'long'];
  const pack = {}, ref = {};
  for (const c of CH) {
    const f = path.join(dir, `${c}.${L}.js`), e = path.join(dir, `${c}.en.js`);
    if (!fs.existsSync(f)) { console.error('eksik parça:', f); process.exit(1); }
    const x = load(f), y = load(e);
    for (const k of Object.keys(y)) { if (k === 'T') { pack.T = Object.assign(pack.T || {}, x.T); ref.T = Object.assign(ref.T || {}, y.T); } else { pack[k] = x[k]; ref[k] = y[k]; } }
  }
  const { errs, warns } = check(pack, ref, L);
  warns.forEach(w => console.log('uyarı:', w));
  errs.forEach(w => console.log('HATA:', w));
  if (errs.length) process.exit(1);
  fs.writeFileSync(outFile, `/* Dil paketi: ${L}. Derlemede sıkıştırılıp gömülür (build.py). Kaynak: tools/dil/pack_check.js --build */\n` + ser(pack, 0) + '\n');
  console.log(`${L}: ${fs.statSync(outFile).size} bayt, ${errs.length} hata, ${warns.length} uyarı`);
} else {
  const [f, e] = a; let x, y;
  try { x = load(f); } catch (er) { console.log('SÖZDİZİMİ HATASI:', f, er.message); process.exit(1); }
  y = load(e);
  const { errs, warns } = check(x, y, path.basename(f));
  warns.forEach(w => console.log('uyarı:', w)); errs.forEach(w => console.log('HATA:', w));
  console.log(errs.length ? `${errs.length} hata` : 'yapı tamam', `· ${warns.length} uyarı`);
  process.exit(errs.length ? 1 : 0);
}
