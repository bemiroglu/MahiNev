// İngilizce dizgi parçalarını bulur: en: {...} / T.en / HR_CANON_EN / tr ? A : B (B) / L === 'en' ? A : B (A) / MONTHS.en
const fs = require('fs'), path = require('path');
const acorn = require('acorn'), walk = require('acorn-walk');
const SRC = '/home/claude/mahinev/src';
const SKIP = new Set(['land.js', 'qrcode.js', 'stars.js', 'relief.js', 'coords.js', 'integrity.js', 'online.js']);
const out = [];
function isEnKey(n) { return n && ((n.type === 'Identifier' && n.name === 'en') || (n.type === 'Literal' && n.value === 'en')); }
function testIsTr(t) { // tr, L === 'tr', st.lang === 'tr', lang === 'tr'
  if (!t) return null;
  if (t.type === 'Identifier' && t.name === 'tr') return 'tr';
  if (t.type === 'BinaryExpression' && (t.operator === '===' || t.operator === '==')) {
    const v = t.right.type === 'Literal' ? t.right.value : t.left.type === 'Literal' ? t.left.value : null;
    if (v === 'tr') return 'tr'; if (v === 'en') return 'en';
  }
  if (t.type === 'BinaryExpression' && (t.operator === '!==' || t.operator === '!=')) {
    const v = t.right.type === 'Literal' ? t.right.value : null; if (v === 'tr') return 'en';
  }
  return null;
}
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js') && !SKIP.has(x))) {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8');
  let ast; try { ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' }); } catch (e) { console.error('parse', f, e.message); continue; }
  const enRanges = [];
  walk.fullAncestor(ast, (node, anc) => {
    if (node.type === 'Property' && isEnKey(node.key)) enRanges.push([node.value.start, node.value.end]);
    if (node.type === 'MemberExpression' && !node.computed && node.property.name === 'en' && /T$|MONTHS$|STX$|SX$/.test(code.slice(node.object.start, node.object.end))) {
      const p = anc[anc.length - 2];
      if (p && p.type === 'CallExpression' && p.arguments[0] === node) p.arguments.slice(1).forEach(a => enRanges.push([a.start, a.end]));
      if (p && p.type === 'AssignmentExpression' && p.left === node) enRanges.push([p.right.start, p.right.end]);
    }
    if (node.type === 'MemberExpression' && p2(anc)) {}
    if (node.type === 'AssignmentExpression' && /HR_CANON_EN/.test(code.slice(node.left.start, node.left.end))) enRanges.push([node.right.start, node.right.end]);
    if (node.type === 'AssignmentExpression' && /^T\.en\./.test(code.slice(node.left.start, node.left.end))) enRanges.push([node.right.start, node.right.end]);
    if (node.type === 'ConditionalExpression') {
      const k = testIsTr(node.test);
      if (k === 'tr') enRanges.push([node.alternate.start, node.alternate.end, 'alt']);
      if (k === 'en') enRanges.push([node.consequent.start, node.consequent.end, 'cons']);
    }
  });
  function p2() { return false; }
  const inEn = (a, b) => enRanges.some(([s, e]) => a >= s && b <= e);
  walk.full(ast, node => {
    if (node.type === 'Literal' && typeof node.value === 'string' && inEn(node.start, node.end)) out.push({ f, s: node.start, e: node.end, v: node.value });
    if (node.type === 'TemplateElement' && inEn(node.start, node.end)) out.push({ f, s: node.start, e: node.end, v: node.value.raw, tpl: 1 });
  });
}
// iç içe tr ? (tr-only nested) durumları: bir dizgi hem EN aralığında hem başka bir koşulun tr dalında olabilir; şimdilik kabul
fs.writeFileSync('/home/claude/eb/enspans.json', JSON.stringify(out));
console.log(out.length, out.reduce((a, x) => a + x.v.length, 0));
