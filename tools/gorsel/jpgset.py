import asyncio, pathlib, zipfile, io
from playwright.async_api import async_playwright
PAGE = pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(accept_downloads=True, viewport={'width':1280,'height':900}); pg = await ctx.new_page()
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.clock.install(time='2026-12-10T17:42:00+03:00')
        await pg.goto(PAGE+'#plan'); await pg.clock.run_for(3000)
        await pg.click('#mbPrint'); await pg.clock.run_for(300)
        await pg.evaluate("document.querySelectorAll('#prOpts input').forEach(i => i.checked = ['plan','skyEve','month','map'].includes(i.value))")
        async with pg.expect_download(timeout=120000) as dl:
            await pg.click('#prJpg'); await pg.clock.run_for(60000)
        d = await dl.value; print(d.suggested_filename); await d.save_as('/tmp/jpgset.zip')
        print(errs)
        await b.close()
asyncio.run(main())
