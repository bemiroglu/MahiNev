import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1280,'height':900})
        await pg.goto(pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()); await pg.wait_for_timeout(2500)
        await pg.evaluate("HRUI.setDate('2026-12-10')"); await pg.wait_for_timeout(800)
        for kinds in [['plan'],['sky'],['skyEve'],['month'],['map'],['map3'],['blank']]:
            await pg.evaluate(f"HRUI.printPages({kinds})"); await pg.wait_for_timeout((20000 if kinds==['map3'] else 3000) if kinds[0].startswith('map') else 600)
            html = await pg.evaluate("HR_LAST_PRINT")
            q = await b.new_page(viewport={'width':900,'height':1200}); await q.set_content(html); await q.emulate_media(media='print'); await q.wait_for_timeout(300)
            r = await q.evaluate("Array.from(document.querySelectorAll('.a4')).map(e=>[e.scrollHeight, e.clientHeight, e.scrollWidth, e.clientWidth])")
            pdf = await q.pdf(prefer_css_page_size=True)
            print(kinds, r, 'pdf pages:', pdf.count(b'/Type /Page') - pdf.count(b'/Type /Pages'))
            if kinds==['map3']: await q.screenshot(path='/tmp/pmap3.png', full_page=True)
            await q.close()
        await b.close()
asyncio.run(main())
