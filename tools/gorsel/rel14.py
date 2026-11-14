import asyncio, pathlib, json
from playwright.async_api import async_playwright
PAGE = pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()
IMG = '/home/claude/mahinev/docs/img/'
async def ready(pg, sel):
    for i in range(300):
        await pg.clock.run_for(400)
        if await pg.evaluate(f"Array.from(document.querySelectorAll('{sel}')).every(e=>e.hidden)"): break
    await pg.clock.run_for(800)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(accept_downloads=True, viewport={'width':1440,'height':900})
        pg = await ctx.new_page()
        await pg.clock.install(time='2026-12-10T17:42:00+03:00')
        await pg.goto(PAGE + '#harita'); await pg.clock.run_for(2500)
        await pg.evaluate("document.body.classList.add('introDone')")
        await ready(pg, '#bigMap .mapprog')
        await pg.evaluate("(()=>{const e=document.getElementById('hMap'); window.scrollTo(0, e.getBoundingClientRect().top+scrollY-70);})()"); await pg.clock.run_for(400)
        await pg.screenshot(path=IMG+'masaustu-harita.png')
        await pg.evaluate("(()=>{const e=document.getElementById('mView'); e.value='three'; e.dispatchEvent(new Event('change'));})()")
        await ready(pg, '#map3 .mapprog')
        async with pg.expect_download() as dl:
            await pg.evaluate("document.getElementById('mPng').click()")
            for i in range(10): await pg.clock.run_for(300)
        d = await dl.value; await d.save_as(IMG+'ciktilar/'+d.suggested_filename); print(d.suggested_filename)
        await pg.evaluate("(()=>{const e=document.getElementById('mView'); e.value='one'; e.dispatchEvent(new Event('change'));})()")
        await b.close()
asyncio.run(main())
