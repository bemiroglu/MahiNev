"""Dil paketlerinin kaynakla eşlemesi: Türkçe veya İngilizce metin değişince çevirinin de güncellenmesini zorunlu kılar.

Her çeviri birimi (ör. T.appTitle, S.lead, TOPICS.rasad, MONTHS[3], CANON) için, çevrildiği andaki Türkçe + İngilizce
kaynağın özeti src/lang/<dil>.ozet.json dosyasında tutulur. Program değişip bir kaynak metin değişirse, yeni bir anahtar
eklenirse ya da bir anahtar silinirse "durum" bunu bulur ve hata verir (GitHub'daki CI de bu denetimi çalıştırır).
Eksik bir metin çalışırken İngilizceden gelir; program bozulmaz, ama denetim çeviri güncellenene kadar geçmez.

Kullanım (önce: python3 build.py):
  python3 tools/dil/pack_sync.py durum                 → üç dilde eşleme durumu; güncel değilse çıkış kodu 1
  python3 tools/dil/pack_sync.py is fr DİZİN           → yalnız değişen / eksik birimler için iş dosyaları:
                                                          DİZİN/is.tr.js (Türkçe aslı), is.en.js (İngilizcesi),
                                                          is.fr.js (bugünkü çeviri; eksikse İngilizcesi) — çevirmen is.fr.js'i günceller
  python3 tools/dil/pack_sync.py uygula fr DİZİN/is.fr.js → birimleri src/lang/fr.js'e yazar, bütün paketi denetler,
                                                          özetleri günceller (yalnız uygulanan birimlerin)
  python3 tools/dil/pack_sync.py kaydet fr             → bütün birimlerin özetini bugünkü kaynağa göre yazar
                                                          (yalnız tam çeviri ve geri çeviri denetiminden sonra)
Tarayıcı yolu gerekirse: HR_CHROME=/yol/chromium
"""
import asyncio, hashlib, importlib.util, json, pathlib, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
LANG = ROOT / 'src' / 'lang'
CHECK = ROOT / 'tools' / 'dil' / 'pack_check.js'
PACK_LANGS = ['fr', 'es', 'bs']

spec = importlib.util.spec_from_file_location('pack_dump', ROOT / 'tools' / 'dil' / 'pack_dump.py')
pd = importlib.util.module_from_spec(spec); spec.loader.exec_module(pd)


def h(tr, en):
    return hashlib.sha1((tr or '').encode() + b'\x01' + (en or '').encode()).hexdigest()[:12]


def src_units():
    r = asyncio.run(pd.source(['units', 'all']))
    tr, en = r[('tr', 'units')], r[('en', 'units')]
    paths = list(en.keys()) + [k for k in tr if k not in en]
    return {p: (tr.get(p), en.get(p)) for p in paths}, r[('en', 'all')]


def pack_units(L):
    out = subprocess.run(['node', str(CHECK), '--units', str(LANG / f'{L}.js')], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def manifest(L):
    f = LANG / f'{L}.ozet.json'
    return json.loads(f.read_text(encoding='utf-8')) if f.exists() else {}


def save_manifest(L, m):
    (LANG / f'{L}.ozet.json').write_text(json.dumps(dict(sorted(m.items())), ensure_ascii=False, indent=0) + '\n', encoding='utf-8')


def status(L, S):
    P, M = pack_units(L), manifest(L)
    changed = [p for p, (t, e) in S.items() if p in P and M.get(p) != h(t, e)]
    missing = [p for p in S if p not in P]
    extra = [p for p in P if p not in S]
    return changed, missing, extra


def flat_js(items):
    return '{\n' + ',\n'.join(f'  {json.dumps(k, ensure_ascii=False)}: {v}' for k, v in items) + '\n}\n'


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__); return 2
    cmd = a[0]
    S, en_all = src_units()
    if cmd == 'durum':
        bad = 0
        for L in PACK_LANGS:
            if not (LANG / f'{L}.js').exists():
                print(f'{L}: paket yok'); bad += 1; continue
            c, m, x = status(L, S)
            n = len(c) + len(m) + len(x); bad += n
            print(f'{L}: {len(S)} birim · değişen kaynak {len(c)} · eksik {len(m)} · fazla {len(x)}' + ('' if n else ' · güncel'))
            for tag, lst in (('değişti', c), ('eksik', m), ('fazla', x)):
                for p in lst[:40]:
                    print(f'   {tag}: {p}')
                if len(lst) > 40:
                    print(f'   … ve {len(lst) - 40} tane daha')
        if bad:
            print('\nÇeviriler kaynakla eşleşmiyor. Her dil için: pack_sync.py is <dil> DİZİN → çevir → pack_sync.py uygula <dil> DİZİN/is.<dil>.js')
        return 1 if bad else 0
    if cmd == 'is':
        L, d = a[1], pathlib.Path(a[2]); d.mkdir(parents=True, exist_ok=True)
        c, m, x = status(L, S)
        todo = c + m
        P = pack_units(L)
        (d / 'is.tr.js').write_text(flat_js([(p, S[p][0] or S[p][1]) for p in todo]), encoding='utf-8')
        (d / 'is.en.js').write_text(flat_js([(p, S[p][1] or S[p][0]) for p in todo]), encoding='utf-8')
        (d / f'is.{L}.js').write_text(flat_js([(p, P.get(p) or S[p][1] or S[p][0]) for p in todo]), encoding='utf-8')
        print(f'{L}: {len(todo)} birim (değişen {len(c)}, eksik {len(m)}); silinecek fazla {len(x)} (uygula sırasında silinir) → {d}')
        return 0
    if cmd == 'uygula':
        L, work = a[1], pathlib.Path(a[2])
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
            f.write(en_all); enf = f.name
        r = subprocess.run(['node', str(CHECK), '--apply', str(LANG / f'{L}.js'), str(work), enf], capture_output=True, text=True)
        print(r.stdout.strip(), r.stderr.strip())
        if r.returncode:
            return 1
        keys = json.loads(subprocess.run(['node', '-e', 'const fs=require("fs");process.stdout.write(JSON.stringify(Object.keys(new Function("return ("+fs.readFileSync(process.argv[1],"utf8")+"\\n)")())))', str(work)], capture_output=True, text=True, check=True).stdout)
        M = manifest(L)
        for p in keys:
            if p in S:
                M[p] = h(*S[p])
        M = {p: v for p, v in M.items() if p in S}
        save_manifest(L, M)
        c, m, x = status(L, S)
        print(f'{L}: özet güncellendi · kalan değişen {len(c)}, eksik {len(m)}, fazla {len(x)}')
        return 0
    if cmd == 'kaydet':
        for L in (a[1:] or PACK_LANGS):
            save_manifest(L, {p: h(t, e) for p, (t, e) in S.items()})
            print(f'{L}: {len(S)} birimin özeti yazıldı')
        return 0
    print(__doc__); return 2


if __name__ == '__main__':
    sys.exit(main())
