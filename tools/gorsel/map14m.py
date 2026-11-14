import asyncio, pathlib, json, time
from playwright.async_api import async_playwright
PAGE = pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(PAGE + '#harita'); await pg.wait_for_timeout(2000)
        await pg.evaluate("document.body.classList.add('introDone'); HRUI.setDate('2026-12-10')")
        t0=time.time()
        await pg.wait_for_function("document.querySelector('#bigMap .mapprog') && document.querySelector('#bigMap .mapprog').hidden", timeout=60000)
        print('one map s', round(time.time()-t0,1))
        await pg.screenshot(path='/tmp/shots/m-harita.png', full_page=True)
        await pg.evaluate("(()=>{const e=document.getElementById('mView'); e.value='three'; e.dispatchEvent(new Event('change'));})()")
        t0=time.time()
        await pg.wait_for_function("document.querySelectorAll('#map3 canvas').length===3 && Array.from(document.querySelectorAll('#map3 .mapprog')).every(e=>e.hidden)", timeout=120000)
        print('three s', round(time.time()-t0,1))
        await pg.evaluate("(()=>{const e=document.getElementById('mLayer'); e.value='yallop'; e.dispatchEvent(new Event('change'));})()")
        t0=time.time(); await pg.wait_for_timeout(300)
        await pg.wait_for_function("Array.from(document.querySelectorAll('#map3 .mapprog')).every(e=>e.hidden)", timeout=120000)
        print('three yallop s', round(time.time()-t0,1))
        await pg.screenshot(path='/tmp/shots/m-harita3.png', full_page=True)
        # polar user location
        await pg.evaluate("(()=>{const e=document.getElementById('mView'); e.value='one'; e.dispatchEvent(new Event('change'));})()")
        print('errs', errs)
        await b.close()
asyncio.run(main())
