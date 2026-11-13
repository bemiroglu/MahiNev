"""Dünya taraması: programın bütün işlevlerini dünyanın her muhtemel rü'yet noktasında dener.

Kutuplar ve kutup gece/gündüzü, tarih çizgisinin iki yanı, yarım ve çeyrek saatli saat dilimleri, yaz saati
geçişleri, deniz seviyesinin altı ve çok yüksek yerler, konumla uyuşmayan saat dilimi. Her yer ve tarihte Plan
(durum, ay, an, gök cisimleri), açıklama penceresi, Saha önizlemesi, Harita ve A4 çıktıları denenir; sayfa hatası,
konsol hatası ve metinde NaN / undefined / Invalid Date / Infinity / null aranır.

Kullanım: python3 tests/dunya_tarama.py [dist/mahinev.html]   (HR_LANG=en ile İngilizce arayüzde)
"""
import asyncio, os, pathlib, re, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = (pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'dist' / 'mahinev.html').resolve().as_uri()

LOCS = [
    ('Kuzey Kutbu', 89.5, 0, 0, 'UTC'), ('Svalbard', 78.22, 15.65, 10, 'Arctic/Longyearbyen'), ('Utqiagvik', 71.29, -156.79, 5, 'America/Anchorage'),
    ('Tromsø', 69.65, 18.96, 10, 'Europe/Oslo'), ('Murmansk', 68.97, 33.08, 50, 'Europe/Moscow'), ('Reykjavík', 64.15, -21.94, 20, 'Atlantic/Reykjavik'),
    ('Nuuk', 64.18, -51.72, 20, 'America/Nuuk'), ('Anchorage', 61.22, -149.9, 30, 'America/Anchorage'), ('Helsinki', 60.17, 24.94, 10, 'Europe/Helsinki'),
    ('Londra', 51.5, -0.13, 20, 'Europe/London'), ("St. John's", 47.56, -52.71, 50, 'America/St_Johns'), ('New York', 40.71, -74.0, 10, 'America/New_York'),
    ('Los Angeles', 34.05, -118.24, 90, 'America/Los_Angeles'), ('Honolulu', 21.31, -157.86, 5, 'Pacific/Honolulu'), ('Mekke', 21.42, 39.83, 277, 'Asia/Riyadh'),
    ('Tahran', 35.69, 51.39, 1190, 'Asia/Tehran'), ('Kâbil', 34.53, 69.17, 1790, 'Asia/Kabul'), ('Katmandu', 27.72, 85.32, 1400, 'Asia/Kathmandu'),
    ('Delhi', 28.61, 77.21, 216, 'Asia/Kolkata'), ('Lhasa', 29.65, 91.1, 3650, 'Asia/Shanghai'), ('Tokyo', 35.68, 139.69, 40, 'Asia/Tokyo'),
    ('Cakarta', -6.2, 106.85, 8, 'Asia/Jakarta'), ('Singapur', 1.35, 103.82, 15, 'Asia/Singapore'), ('Quito', -0.18, -78.47, 2850, 'America/Guayaquil'),
    ('Nairobi', -1.29, 36.82, 1795, 'Africa/Nairobi'), ('Dakar', 14.72, -17.47, 20, 'Africa/Dakar'), ('Kahire', 30.04, 31.24, 23, 'Africa/Cairo'),
    ('Cape Town', -33.92, 18.42, 10, 'Africa/Johannesburg'), ('Sidney', -33.87, 151.21, 20, 'Australia/Sydney'), ('Lord Howe', -31.55, 159.08, 10, 'Australia/Lord_Howe'),
    ('Adelaide', -34.93, 138.6, 50, 'Australia/Adelaide'), ('Auckland', -36.85, 174.76, 20, 'Pacific/Auckland'), ('Chatham', -43.95, -176.55, 20, 'Pacific/Chatham'),
    ('Kiritimati', 1.87, -157.4, 5, 'Pacific/Kiritimati'), ('Pago Pago', -14.28, -170.7, 5, 'Pacific/Pago_Pago'), ('Tongatapu', -21.14, -175.2, 5, 'Pacific/Tongatapu'),
    ('Fiji (+179,99°)', -16.5, 179.99, 5, 'Pacific/Fiji'), ('Fiji (−179,99°)', -16.5, -179.99, 5, 'Pacific/Fiji'), ('Ushuaia', -54.8, -68.3, 20, 'America/Argentina/Ushuaia'),
    ('Santiago', -33.45, -70.67, 570, 'America/Santiago'), ('La Paz', -16.5, -68.15, 3640, 'America/La_Paz'), ('McMurdo', -77.85, 166.67, 10, 'Antarctica/McMurdo'),
    ('Güney Kutbu', -89.9, 0, 2835, 'Antarctica/McMurdo'), ('Troll', -72.01, 2.53, 1275, 'Antarctica/Troll'), ('Ölü Deniz', 31.5, 35.5, -430, 'Asia/Amman'),
    ('Everest', 27.99, 86.93, 8848, 'Asia/Kathmandu'), ('Uyuşmayan saat dilimi', 41.0, 29.0, 40, 'Pacific/Auckland'),
]
# ay başı akşamı · kış ve yaz gündönümü (kutup gecesi/gündüzü) · Avrupa ve ABD yaz saati geçişi · Zilhicce başı · ay ortası
DATES = ['2026-12-09', '2026-12-21', '2027-06-21', '2027-03-28', '2027-03-14', '2027-05-07', '2026-11-20']
BAD = re.compile(r'\bNaN\b|undefined|Invalid Date|\bInfinity\b|\bnull\b|\[object ')
VIEWS = ['#status', '#upCard', '#mNav', '#extra', '#tbCard', '#skyCard', '#dateCard']


async def worker(b, locs, issues, done):
    pg = await b.new_page(viewport={'width': 1280, 'height': 1000})
    errs = []
    pg.on('pageerror', lambda e: errs.append('sayfa hatası: ' + str(e)[:160]))
    pg.on('console', lambda m: errs.append('konsol: ' + m.text[:160]) if m.type == 'error' else None)
    await pg.goto(PAGE); await pg.wait_for_timeout(2000)
    await pg.evaluate("Object.assign(HRUI.st, { introDone: true }); HRUI.update()")
    lang = os.environ.get('HR_LANG', 'tr')
    if lang != 'tr': await pg.evaluate(f"document.querySelector('[data-lang=\"{lang}\"]').click()"); await pg.wait_for_timeout(500)

    async def scan(where, sel_list):
        for sel in sel_list:
            txt = await pg.evaluate(f"(() => {{ const e = document.querySelector('{sel}'); return e ? e.innerText : ''; }})()")
            m = BAD.search(txt)
            if m: issues.append(f'{where} {sel}: “{txt[max(0, m.start() - 60):m.end() + 40]}”'.replace('\n', ' '))

    for k, (name, la, lo, el, tz) in locs:
        await pg.evaluate("location.hash = '#plan'")
        for i, d in enumerate(DATES):
            errs.clear()
            where = f'{name} {d}'
            try:
                await pg.evaluate(f"""() => {{ Object.assign(HRUI.st, {{ city: 'custom', lat: {la}, lon: {lo}, elev: {el}, hMax: 0, tz: '{tz}', autoLoc: false }}); HRUI.setDate('{d}'); HRUI.update(); }}""")
                await pg.wait_for_timeout(250)
                await pg.evaluate("(() => { const g = document.getElementById('gokBox'); if (g) g.open = true; })()")
                for tm in (0, 720, 1100, 1500):
                    await pg.evaluate(f"HRUI.setTmin({tm})")
                await pg.wait_for_timeout(250)
                await scan(where, VIEWS + ['#gokBox'])
                has = await pg.evaluate("!!document.querySelector('#statusBody [data-ex], #upBody [data-ex]')")
                if has and i in (0, 5):
                    await pg.evaluate("document.querySelector('#statusBody [data-ex], #upBody [data-ex]').click()"); await pg.wait_for_timeout(1200)
                    await scan(where + ' açıklama', ['#exBody'])
                    await pg.evaluate("document.getElementById('exClose').click()")
                if i == 0:
                    await pg.evaluate("location.hash = '#saha'"); await pg.wait_for_timeout(500)
                    await scan(where + ' Saha', ['#saha'])
                    if k % 3 == 0:
                        await pg.evaluate("location.hash = '#harita'"); await pg.wait_for_timeout(1200)
                        await scan(where + ' Harita', ['#harita'])
                    await pg.evaluate("location.hash = '#plan'"); await pg.wait_for_timeout(200)
                    html = await pg.evaluate("HRUI.buildPrint(['plan', 'sky', 'skyEve', 'month', 'blank'])")
                    txt = re.sub(r'<style[\s\S]*?</style>|<script[\s\S]*?</script>|<[^>]+>', ' ', html)
                    m = BAD.search(txt)
                    if m: issues.append(f'{where} çıktı: “{txt[max(0, m.start() - 60):m.end() + 40]}”')
            except Exception as e:
                issues.append(f'{where}: {str(e)[:160]}')
            for e in errs: issues.append(f'{where}: {e}')
        done.append(name); print(f'· {name} ({len(done)}/{len(LOCS)})', flush=True)
    await pg.close()


async def main(n=6):
    issues, done = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        items = list(enumerate(LOCS))
        await asyncio.gather(*[worker(b, items[i::n], issues, done) for i in range(n)])
        await b.close()
    print('\n'.join(issues) if issues else 'Sorun bulunmadı.')
    return 1 if issues else 0

if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
