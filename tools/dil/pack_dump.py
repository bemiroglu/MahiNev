"""Dil paketi kaynağı: Türkçe ve İngilizce metinleri, dil paketinin yapısında, parçalara bölerek döker.

Kullanım:  python3 build.py && python3 tools/dil/pack_dump.py ÇIKIŞ_DİZİNİ
Her parça için <parça>.tr.js ve <parça>.en.js yazılır (aynı anahtarlar, aynı sıra). Çevirmen <parça>.<dil>.js
dosyasını aynı yapıda yazar; tools/dil/pack_build.js parçaları birleştirip src/lang/<dil>.js üretir.
"""
import asyncio, json, pathlib, re, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)

JS = r'''([L, CIT]) => {
  const R = HRLangs.REG, I = HRI18N;
  const isId = k => /^[A-Za-z_$][\w$]*$/.test(k);
  const ser = (v, ind) => {
    const pad = '  '.repeat(ind + 1), end = '  '.repeat(ind);
    if (typeof v === 'function') return v.toString();
    if (typeof v === 'string') return JSON.stringify(v);
    if (v === null || typeof v !== 'object') return String(v);
    if (Array.isArray(v)) {
      const items = v.map(x => ser(x, ind + 1));
      const flat = '[' + items.join(', ') + ']';
      return flat.length < 100 && !flat.includes('\n') ? flat : '[\n' + items.map(x => pad + x).join(',\n') + '\n' + end + ']';
    }
    const ks = Object.keys(v);
    return '{\n' + ks.map(k => pad + (isId(k) ? k : JSON.stringify(k)) + ': ' + ser(v[k], ind + 1)).join(',\n') + '\n' + end + '}';
  };
  const own = (d) => d[L];
  const out = {};
  out.T = own(R.T.dict); out.MONTHS = own(R.MONTHS.dict); out.S = own(R.S.dict);
  out.TOPICS = own(R.TOPICS.dict); out.PLAN = own(R.PLAN.dict); out.GX = own(R.GX.dict); out.LONG = own(R.LONG.dict); out.CANON = own(R.CANON.dict);
  out.SX = own(R.SX.dict); out.STX = own(R.STX.dict); out.CARD16 = own(R.CARD16.dict); out.SLUG = own(R.SLUG.dict);
  // gök cisimleri ve gezegen adları: Türkçe sözlüğün anahtarları; İngilizcede ad yoksa kimlik (İngilizce ad) yazılır
  const nm = (d) => Object.fromEntries(Object.keys(d.tr).map(k => [k, (d[L] && d[L][k]) || k]));
  out.GOK = nm(R.GOK.dict); out.SKYNAMES = nm(R.SKYNAMES.dict);
  out.REGIONS = L === 'tr' ? ['Kuzey Amerika', 'Orta ve Güney Amerika', 'Pasifik', 'Avrupa', 'Afrika', 'Orta Doğu', 'Asya', 'Okyanusya']
    : ['North America', 'Central and South America', 'Pacific', 'Europe', 'Africa', 'Middle East', 'Asia', 'Oceania'];
  out.CITIES = Object.fromEntries(CIT.map(c => [c[0], L === 'tr' ? c[1] : c[2]]));
  out.MAPCITIES = HRMap.CITIES.map(c => L === 'tr' ? c[0] : c[1]);
  const T = out.T, keys = Object.keys(T), n = keys.length;
  const part = (a, b) => Object.fromEntries(keys.slice(a, b).map(k => [k, T[k]]));
  // parçalar (yaklaşık eşit büyüklükte)
  const sizes = keys.map(k => ser(T[k], 1).length); const tot = sizes.reduce((a, b) => a + b, 0);
  const cut = []; let acc = 0; for (let i = 0; i < n; i++) { acc += sizes[i]; if (cut.length < 2 && acc > tot * (cut.length + 1) / 3) cut.push(i + 1); }
  const chunks = {
    ui1: { T: part(0, cut[0]) }, ui2: { T: part(cut[0], cut[1]) }, ui3: { T: part(cut[1], n) },
    misc: { MONTHS: out.MONTHS, S: out.S, REGIONS: out.REGIONS, SX: out.SX, STX: out.STX, CARD16: out.CARD16, GOK: out.GOK, SKYNAMES: out.SKYNAMES, SLUG: out.SLUG, GX: out.GX, CITIES: out.CITIES, MAPCITIES: out.MAPCITIES },
    guide: { TOPICS: out.TOPICS, PLAN: out.PLAN },
    long: { LONG: out.LONG, CANON: out.CANON }
  };
  return Object.fromEntries(Object.entries(chunks).map(([k, v]) => [k, ser(v, 0)]));
}'''

async def main():
    async with async_playwright() as p:
        import os; b = await p.chromium.launch(args=['--no-sandbox'], **({'executable_path': os.environ['HR_CHROME']} if os.environ.get('HR_CHROME') else {}))
        pg = await b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto((ROOT / 'dist' / 'mahinev.html').as_uri())
        await pg.wait_for_function('window.HRUI')
        cit = re.findall(r"id: '(\w+)', tr: '([^']+)', en: '([^']+)'", (ROOT / 'src' / 'ui.js').read_text(encoding='utf-8'))
        for L in ('tr', 'en'):
            res = await pg.evaluate(JS, [L, cit])
            for k, v in res.items():
                (OUT / f'{k}.{L}.js').write_text(v + '\n', encoding='utf-8')
                print(k, L, len(v.encode()))
        await b.close()
        if errs: print('HATA', errs)

asyncio.run(main())
