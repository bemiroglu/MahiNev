"""Küresel kapsam doğrulaması: earliestDay() tarih çizgisi kuşağı ile bütün dünya ızgarasını (±66°, 7,5° boylam) 14 ay için karşılaştırır.

Kullanım: python3 build.py && python3 tools/kuresel_dogrulama.py
"""
import asyncio, pathlib, json
from playwright.async_api import async_playwright
JS = """() => {
 const C = HRCore, A = Astronomy; const out = [];
 let t = A.MakeTime(new Date('2025-12-01T00:00Z'));
 for (let m = 0; m < 14; m++) {
   const conj = A.SearchMoonPhase(0, t, 40); t = conj.AddDays(2);
   const band = C.earliestDay(conj, null);
   const full = []; for (let la = -66; la <= 66; la += 3) for (let lo = -180; lo < 180; lo += 7.5) full.push([la, lo]);
   const all = C.earliestDay(conj, full);
   out.push([conj.date.toISOString().slice(0,16), band && band.evening.toISOString().slice(0,10), all && all.evening.toISOString().slice(0,10), all && all.where.lon, all && all.where.lat]);
 }
 return out; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        await pg.goto((pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'mahinev.html').as_uri()); await pg.wait_for_timeout(1500)
        for r in await pg.evaluate(JS): print(r, 'OK' if r[1]==r[2] else 'FARK')
        await b.close()
asyncio.run(main())
