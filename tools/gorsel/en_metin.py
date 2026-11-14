import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1280,'height':900}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.clock.install(time='2026-12-10T17:42:00+03:00')
        await pg.goto(pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()+'#rehber'); await pg.clock.run_for(2500)
        await pg.evaluate("document.body.classList.add('introDone'); document.getElementById('langEn').click()"); await pg.clock.run_for(800)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)"); await pg.clock.run_for(300)
        txt = await pg.evaluate("document.getElementById('view-rehber').innerText")
        pathlib.Path('/tmp/en_rehber.txt').write_text(txt)
        await pg.evaluate("location.hash='#plan'"); await pg.clock.run_for(1500)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)"); await pg.clock.run_for(500)
        t2 = await pg.evaluate("document.getElementById('view-plan').innerText"); pathlib.Path('/tmp/en_plan.txt').write_text(t2)
        print(len(txt), len(t2), errs)
        await b.close()
asyncio.run(main())
