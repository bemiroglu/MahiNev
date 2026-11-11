"""Doğrulama testlerini başsız tarayıcıda çalıştırır (Doğrulama sekmesindeki tablonun aynısı).

Kullanım:  pip install playwright && playwright install chromium
           python3 build.py && python3 tests/run_tests.py
Çıkış kodu: tüm testler geçerse 0, aksi hâlde 1.
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = (ROOT / 'dist' / 'mahinev.html').as_uri() + '#dogrulama'

async def main():
    async with async_playwright() as p:
        kw = {'executable_path': sys.argv[1]} if len(sys.argv) > 1 else {}
        b = await p.chromium.launch(args=['--no-sandbox'], **kw)
        pg = await b.new_page(viewport={'width': 1280, 'height': 900})
        errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)))
        await pg.goto(PAGE)
        await pg.wait_for_function('window.HR_TEST_RESULT', timeout=60000)
        res = await pg.evaluate('HR_TEST_RESULT')
        await b.close()
    for r in res['rows']:
        print(('GEÇTİ ' if r['ok'] else 'KALDI ') + f"{r['c']} — {r['q']}: beklenen {r['exp']}, bulunan {r['got']}")
    print(f"\n{res['ok']} / {res['total']} test geçti")
    if errors:
        print('Sayfa hataları:', json.dumps(errors, ensure_ascii=False))
    return 0 if res['ok'] == res['total'] and not errors else 1

sys.exit(asyncio.run(main()))
