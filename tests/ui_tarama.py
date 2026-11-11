"""Uçtan uca tarama: diller, temalar, sekmeler, diyaloglar, uç konumlar; hata, taşma, NaN, dış istek."""
import asyncio, pathlib, json, sys
from playwright.async_api import async_playwright
PAGE = (pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'mahinev.html').as_uri()
LOCS = [('İstanbul', 41.0082, 28.9784, 40, 'Europe/Istanbul', '2026-12-10'),
        ('Tromsø kutup gecesi', 69.65, 18.96, 10, 'Europe/Oslo', '2026-12-10'),
        ('Tromsø yaz', 69.65, 18.96, 10, 'Europe/Oslo', '2026-06-15'),
        ('Apia UTC+13', -13.83, -171.76, 2, 'Pacific/Apia', '2026-11-10'),
        ('Kiritimati UTC+14', 1.87, -157.43, 3, 'Pacific/Kiritimati', '2026-11-10'),
        ('Honolulu UTC−10', 21.31, -157.86, 5, 'Pacific/Honolulu', '2026-11-09'),
        ('Mekke Zilhicce', 21.4225, 39.8262, 277, 'Asia/Riyadh', '2027-05-07'),
        ('Berlin DST', 52.52, 13.405, 34, 'Europe/Berlin', '2026-03-29'),
        ('Wellington', -41.29, 174.78, 10, 'Pacific/Auckland', '2026-04-17')]
async def main():
    issues = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for vp in [(1280, 900), (390, 844)]:
            for lang in ['tr', 'en']:
                pg = await b.new_page(viewport={'width': vp[0], 'height': vp[1]})
                errs, ext = [], []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
                pg.on('request', lambda r: ext.append(r.url) if not r.url.startswith(('file:', 'data:', 'blob:')) else None)
                await pg.goto(PAGE); await pg.wait_for_timeout(1500)
                await pg.evaluate(f"document.getElementById('lang{lang.capitalize()}').click()"); await pg.wait_for_timeout(400)
                for theme in ['light', 'dark', 'sun', 'night', 'auto']:
                    await pg.evaluate(f"(() => {{ const e = document.getElementById('theme'); e.value = '{theme}'; e.dispatchEvent(new Event('change')); }})()")
                    for tab in ['plan', 'harita', 'saha', 'rehber', 'dogrulama']:
                        await pg.evaluate(f"location.hash = '#{tab}'"); await pg.wait_for_timeout(700 if tab != 'dogrulama' else 2500)
                        ov = await pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                        bad = await pg.evaluate("""() => { const tx = document.body.innerText; const m = tx.match(/.{0,30}(undefined|NaN|\\[object Object\\]|null°).{0,30}/); return m ? m[0] : null; }""")
                        if ov > 2: issues.append(f'{vp} {lang} {theme} {tab}: yatay taşma {ov}px')
                        if bad: issues.append(f'{vp} {lang} {theme} {tab}: şüpheli metin «{bad}»')
                for name, la, lo, el, tz, d in LOCS:
                    await pg.evaluate(f"""() => {{ const s = HRUI.st; Object.assign(s, {{ city: 'custom', lat: {la}, lon: {lo}, elev: {el}, hMax: 0, tz: '{tz}', autoLoc: false }}); HRUI.setDate('{d}'); HRUI.update(); }}""")
                    for tab in ['plan', 'saha', 'harita']:
                        await pg.evaluate(f"location.hash = '#{tab}'"); await pg.wait_for_timeout(900)
                        ov = await pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                        bad = await pg.evaluate("""() => { const tx = document.body.innerText; const m = tx.match(/.{0,30}(undefined|NaN|\\[object Object\\]|Invalid Date).{0,30}/); return m ? m[0] : null; }""")
                        if ov > 2:
                            who = await pg.evaluate("""() => { const W = innerWidth; let best = null; document.querySelectorAll('body *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 0 && b.right > W + 2 && getComputedStyle(e).position !== 'static' || (b.width > W)) { let p = e.parentElement, scr = false; while (p) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') { scr = true; break; } p = p.parentElement; } if (!scr && b.right > W + 2 && (!best || b.right > best[3])) best = [e.tagName, e.id, String(e.className).slice(0,40), Math.round(b.right), (e.innerText || '').slice(0, 60)]; } }); return best; }""")
                            issues.append(f'{vp} {lang} {name} {tab}: yatay taşma {ov}px {who}')
                        if bad: issues.append(f'{vp} {lang} {name} {tab}: şüpheli metin «{bad}»')
                await pg.evaluate("location.hash = '#plan'")
                for dlg in ['openSet', 'mbPrint', 'openSM']:
                    try:
                        await pg.click('#' + dlg, timeout=3000); await pg.wait_for_timeout(400)
                        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(200)
                    except Exception as e: issues.append(f'{vp} {lang} diyalog {dlg}: {str(e)[:80]}')
                if lang == 'tr' and vp[0] == 1280:
                    miss = await pg.evaluate("""() => { const T = HRI18N.T; const a = Object.keys(T.tr), bk = Object.keys(T.en); return { enMissing: a.filter(k => !(k in T.en)), trMissing: bk.filter(k => !(k in T.tr)) }; }""")
                    if miss['enMissing'] or miss['trMissing']: issues.append('i18n eksik anahtar: ' + json.dumps(miss, ensure_ascii=False))
                for e in errs: issues.append(f'{vp} {lang}: HATA {e[:160]}')
                for u in sorted(set(ext)): issues.append(f'{vp} {lang}: DIŞ İSTEK {u[:100]}')
                await pg.close()
        await b.close()
    print('\n'.join(issues) if issues else 'Sorun bulunmadı.')
asyncio.run(main())
