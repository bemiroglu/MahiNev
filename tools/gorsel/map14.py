import asyncio, pathlib, os, json
from playwright.async_api import async_playwright
PAGE = pathlib.Path('/home/claude/mahinev/dist/mahinev.html').as_uri()
OUT = '/tmp/shots/'
T = os.environ.get('T','2026-12-10T17:25:00+03:00')
async def ready(pg, sel='#bigMap .mapprog'):
    for i in range(240):
        await pg.clock.run_for(400)
        h = await pg.evaluate(f"Array.from(document.querySelectorAll('{sel}')).every(e=>e.hidden)")
        if h: break
    await pg.clock.run_for(600)
async def setv(pg, id, v):
    await pg.evaluate(f"(()=>{{const e=document.getElementById('{id}'); if(e.type==='checkbox') e.checked={json.dumps(v)}; else e.value={json.dumps(v)}; e.dispatchEvent(new Event('change'));}})()")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        async def page(lang=None, theme=None, vw=1440, vh=1000):
            pg = await b.new_page(viewport={'width':vw,'height':vh})
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.clock.install(time=T)
            await pg.goto(PAGE + '#harita'); await pg.clock.run_for(2500)
            await pg.evaluate("document.body.classList.add('introDone')")
            if lang: await pg.evaluate(f"document.getElementById('lang{lang.capitalize()}').click()")
            if theme: await setv(pg,'theme',theme)
            await pg.evaluate("document.getElementById('mOptsBox').open=true")
            await ready(pg); return pg
        pg = await page()
        el = await pg.query_selector('#view-harita section')
        await el.screenshot(path=OUT+'h1-tr.png')
        await setv(pg,'mGrat',True); await setv(pg,'mValue','elong'); await ready(pg)
        await el.screenshot(path=OUT+'h2-grat-elong.png')
        await setv(pg,'mValue','win'); await ready(pg)
        await el.screenshot(path=OUT+'h3-win.png')
        await setv(pg,'mValue','none'); await setv(pg,'mGrat',False)
        await setv(pg,'mView','three'); await ready(pg, '#map3 .mapprog')
        await el.screenshot(path=OUT+'h4-three.png')
        print('note3:', await pg.evaluate("document.getElementById('mapNote').textContent"))
        # PNG
        async with pg.expect_download() as dl:
            await pg.evaluate("document.getElementById('mPng').click()"); 
            for i in range(10): await pg.clock.run_for(300)
        d = await dl.value; await d.save_as(OUT+'png-three.png'); print('png', d.suggested_filename)
        await setv(pg,'mView','one'); await setv(pg,'mLayer','yallop'); await ready(pg)
        await el.screenshot(path=OUT+'h5-yallop.png')
        async with pg.expect_download() as dl:
            await pg.evaluate("document.getElementById('mPng').click()")
            for i in range(10): await pg.clock.run_for(300)
        d = await dl.value; await d.save_as(OUT+'png-one.png'); print('png', d.suggested_filename)
        await setv(pg,'mLayer','seadet'); await ready(pg)
        print('note1:', await pg.evaluate("document.getElementById('mapNote').textContent"))
        # pick
        await pg.evaluate("(()=>{const c=document.querySelector('#bigMap canvas'); const r=c.getBoundingClientRect(); c.dispatchEvent(new MouseEvent('click',{clientX:r.left+r.width*0.45,clientY:r.top+r.height*0.45}));})()")
        await pg.clock.run_for(300)
        print('pick:', await pg.evaluate("document.getElementById('pickKv').innerText"))
        # print html
        html = await pg.evaluate("HRUI.buildPrint(['map','map3'])")
        pathlib.Path(OUT+'print-map.html').write_text(html); print('print len', len(html), html.count('class="a4 land"'))
        await pg.close()
        for lang, theme, nm in [('en', None, 'h6-en'), (None, 'dark', 'h7-dark'), (None, 'night', 'h8-night'), (None, 'sun', 'h9-sun')]:
            pg = await page(lang, theme)
            await (await pg.query_selector('#view-harita section')).screenshot(path=OUT+nm+'.png')
            if lang == 'en':
                await setv(pg,'mView','three'); await ready(pg, '#map3 .mapprog')
                async with pg.expect_download() as dl:
                    await pg.evaluate("document.getElementById('mPng').click()")
                    for i in range(10): await pg.clock.run_for(300)
                d = await dl.value; await d.save_as(OUT+'png-three-en.png'); print('png', d.suggested_filename)
            await pg.close()
        # plan extra
        pg = await b.new_page(viewport={'width':1300,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.clock.install(time=T); await pg.goto(PAGE + '#plan'); await pg.clock.run_for(2500)
        await pg.evaluate("document.body.classList.add('introDone'); const b=document.getElementById('extraBox'); b.open=true;")
        await pg.clock.run_for(800)
        print('extra:', (await pg.evaluate("document.getElementById('extra').innerText"))[:1800])
        await (await pg.query_selector('#extraBox')).screenshot(path=OUT+'p-extra.png')
        print('ERRS', errs[:10])
        await b.close()
asyncio.run(main())
