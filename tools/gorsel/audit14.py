import asyncio, pathlib, re, sys
from playwright.async_api import async_playwright
PAGE = pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for lang in ['tr','en']:
            pg = await b.new_page(viewport={'width':1280,'height':900})
            await pg.goto(PAGE + '#harita'); await pg.wait_for_timeout(2500)
            await pg.evaluate("document.body.classList.add('introDone')")
            if lang=='en': await pg.evaluate("document.getElementById('langEn').click()")
            await pg.evaluate("HRUI.setDate('2026-12-10')"); await pg.wait_for_timeout(6000)
            html = await pg.evaluate("HRUI.buildPrint(['plan','sky','skyEve','month','map','map3','blank'])")
            q = await b.new_page(); await q.set_content(html); await q.wait_for_timeout(300)
            txt = await q.evaluate("document.body.innerText")
            svg = await q.evaluate("Array.from(document.querySelectorAll('svg text')).map(e=>e.textContent).join(' | ')")
            pathlib.Path(f'/tmp/audit_{lang}.txt').write_text(txt + '\n\n=== SVG ===\n' + svg)
            await q.close(); await pg.close()
        await b.close()
asyncio.run(main())
