/* Çevrimiçi katman (v0.4) — isteğe bağlıdır; program bunsuz tam çalışır.
 * Ortam: bağımsız dosya (tarayıcıda açılmış) ↔ korumalı çerçeve (claude.ai içinde: dış bağlantı, konum ve yazdırma kapalı).
 * Hava: Open-Meteo (anahtarsız, açık veri). İki nokta istenir: gözlemci ve ayın/güneşin battığı yönde ~25 km ötesi
 * (5° yükseklikteki görüş hattı 2 km bulut tabanını ≈ 23 km ötede keser; batı ufkundaki bulut çoğu zaman oradadır). */
(function (G) {
  'use strict';
  const sandboxed = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const cache = new Map();
  const r2 = x => Math.round(x * 100) / 100;
  async function getJSON(url, ms = 9000) {
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const tm = setTimeout(() => ac && ac.abort(), ms);
    try { const r = await fetch(url, ac ? { signal: ac.signal } : {}); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); }
    finally { clearTimeout(tm); }
  }
  // Bir noktadan belirli semtte d km ötedeki nokta (küre üzerinde)
  function dest(lat, lon, azDeg, km) {
    const R = 6371, d = km / R, a = azDeg * Math.PI / 180, p1 = lat * Math.PI / 180, l1 = lon * Math.PI / 180;
    const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(a));
    const l2 = l1 + Math.atan2(Math.sin(a) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
    return [p2 * 180 / Math.PI, ((l2 * 180 / Math.PI + 540) % 360) - 180];
  }
  const HOURLY = 'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,relative_humidity_2m,precipitation_probability';
  // Gözlemci + batı noktası için saatlik tahmin ve aerosol (pus) tahmini
  async function weather(lat, lon, az) {
    const [wl, wn] = dest(lat, lon, az, 25);
    const key = [r2(lat), r2(lon), Math.round(az / 10)].join('|');
    const c = cache.get(key); if (c && Date.now() - c.at < 3600e3) return c.v;
    const la = `${r2(lat)},${r2(wl)}`, lo = `${r2(lon)},${r2(wn)}`;
    const fc = await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=${HOURLY}&forecast_days=16&past_days=2&timezone=GMT&timeformat=unixtime`);
    let aq = null;
    try { aq = await getJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${r2(lat)}&longitude=${r2(lon)}&hourly=aerosol_optical_depth,dust&forecast_days=5&past_days=1&timezone=GMT&timeformat=unixtime`, 7000); } catch (e) { aq = null; }
    const arr = Array.isArray(fc) ? fc : [fc];
    const v = { at: Date.now(), here: arr[0] && arr[0].hourly, west: arr[1] && arr[1].hourly, aq: aq && aq.hourly, westPt: [wl, wn] };
    cache.set(key, { at: Date.now(), v });
    return v;
  }
  async function elevation(lat, lon) { const j = await getJSON(`https://api.open-meteo.com/v1/elevation?latitude=${r2(lat)}&longitude=${r2(lon)}`, 6000); return j && j.elevation ? j.elevation[0] : null; }
  // Saatlik dizide verilen ana en yakın saatin değerleri
  function pick(h, ms) {
    if (!h || !h.time || !h.time.length) return null;
    const ts = ms / 1000; let best = -1, bd = 1e12;
    for (let i = 0; i < h.time.length; i++) { const d = Math.abs(h.time[i] - ts); if (d < bd) { bd = d; best = i; } }
    if (bd > 5400) return null;
    const o = { t: h.time[best] * 1000 };
    for (const k of Object.keys(h)) if (k !== 'time') o[k] = h[k][best];
    return o;
  }
  function range(h) { return h && h.time && h.time.length ? [h.time[0] * 1000, h.time[h.time.length - 1] * 1000] : null; }
  // Hilâl rasadı için kaba değerlendirme (ufka yakın, ince bir cisim: alçak bulut ve pus en belirleyicidir)
  function assess(here, west, aq) {
    if (!here) return null;
    const w = west || here, rs = [];
    const cc = Math.max(here.cloud_cover ?? 0, w.cloud_cover ?? 0), low = Math.max(here.cloud_cover_low ?? 0, w.cloud_cover_low ?? 0);
    const vis = Math.min(here.visibility ?? 1e9, w.visibility ?? 1e9) / 1000, pp = here.precipitation_probability ?? 0, rh = here.relative_humidity_2m ?? 0;
    const aod = aq ? aq.aerosol_optical_depth : null;
    let score = 0;
    if (pp >= 50) { score += 3; rs.push('rain'); }
    if (low >= 40) { score += 3; rs.push('low'); } else if (low >= 15) { score += 1; rs.push('lowSome'); }
    if (cc >= 70) { score += 2; rs.push('cloud'); } else if (cc >= 30) { score += 1; rs.push('cloudSome'); }
    if (vis < 10) { score += 2; rs.push('haze'); } else if (vis < 20) { score += 1; rs.push('hazeSome'); }
    if (aod != null) { if (aod > 0.4) { score += 2; rs.push('aod'); } else if (aod > 0.2) { score += 1; rs.push('aodSome'); } }
    if (rh >= 85) { score += 1; rs.push('humid'); }
    return { level: score >= 3 ? 'poor' : score >= 1 ? 'fair' : 'good', reasons: rs, cc, low, vis, pp, rh, aod, clear: cc < 30 && low < 15 };
  }
  async function geoPermission() { try { if (!navigator.permissions) return 'unknown'; const p = await navigator.permissions.query({ name: 'geolocation' }); return p.state; } catch (e) { return 'unknown'; } }
  function geolocate(ms = 10000) {
    return new Promise((res, rej) => {
      try { navigator.geolocation.getCurrentPosition(p => res(p.coords), e => rej(e), { timeout: ms, maximumAge: 120000, enableHighAccuracy: false }); }
      catch (e) { rej(e); }
    });
  }
  G.HROnline = { sandboxed, weather, elevation, pick, range, assess, geoPermission, geolocate, dest, online: () => navigator.onLine !== false };
})(typeof globalThis !== 'undefined' ? globalThis : window);
