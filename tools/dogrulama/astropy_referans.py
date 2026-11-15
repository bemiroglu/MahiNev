"""Bağımsız astronomik referans değerleri (Astropy, ERFA + yerleşik efemeris; Astronomy Engine'den bağımsız).

Programın Doğrulama sekmesindeki "bağımsız efemeris" testleri bu betiğin çıktısını sabit değer olarak kullanır.
Kullanım:  pip install astropy && python3 tools/dogrulama/astropy_referans.py
Not: Astropy'nin yerleşik Ay modeli birkaç yay saniyesi doğruluktadır; testlerin toleransları buna göre seçilmiştir
(ictimâ ±2 dk, konum ±0,03°, gün batımı ±1 dk). Gün batımı her iki tarafta aynı tanımla (güneş merkezi −0,8333°,
standart kırılma ve yarıçap, gözlemci yüksekliği yok) karşılaştırılır.
"""
import json
import numpy as np
from astropy.utils import iers
iers.conf.auto_download = False
from astropy.time import Time
from astropy.coordinates import EarthLocation, AltAz, get_body, solar_system_ephemeris, GeocentricTrueEcliptic
import astropy.units as u

solar_system_ephemeris.set('builtin')
LOCS = {'istanbul': (41.0082, 28.9784, 40), 'mekke': (21.4225, 39.8262, 277), 'jakarta': (-6.2088, 106.8456, 8), 'newyork': (40.7128, -74.006, 10)}


def lon_diff(t):
    m = get_body('moon', t).transform_to(GeocentricTrueEcliptic(equinox=t)).lon.deg
    s = get_body('sun', t).transform_to(GeocentricTrueEcliptic(equinox=t)).lon.deg
    return (m - s + 180) % 360 - 180


def conj_near(guess):
    a, b = Time(guess) - 1.5 * u.day, Time(guess) + 1.5 * u.day
    for _ in range(40):
        c = a + (b - a) / 2
        if lon_diff(a) * lon_diff(c) <= 0: b = c
        else: a = c
    return (a + (b - a) / 2).utc.isot[:19] + 'Z'


def altaz(name, t, la, lo, h):
    loc = EarthLocation(lat=la * u.deg, lon=lo * u.deg, height=h * u.m)
    x = get_body(name, t, loc).transform_to(AltAz(obstime=t, location=loc))   # basınç yok = kırılmasız (havasız)
    return x.alt.deg, x.az.deg


def sunset(day, la, lo):
    loc = EarthLocation(lat=la * u.deg, lon=lo * u.deg, height=0 * u.m)
    noon = Time(day + 'T12:00:00') - (lo / 15) * u.hour
    ts = noon + np.linspace(0, 12, 721) * u.hour
    alt = get_body('sun', ts, loc).transform_to(AltAz(obstime=ts, location=loc)).alt.deg + 0.8333
    i = np.where((alt[:-1] > 0) & (alt[1:] <= 0))[0][0]
    a, b = ts[i], ts[i + 1]
    for _ in range(30):
        c = a + (b - a) / 2
        v = get_body('sun', c, loc).transform_to(AltAz(obstime=c, location=loc)).alt.deg + 0.8333
        if v > 0: a = c
        else: b = c
    return (a + (b - a) / 2).utc.isot[:19] + 'Z'


out = {'conj': [conj_near(g) for g in ['2026-06-15', '2026-12-09', '2027-03-08', '2027-05-06', '2027-11-28', '2016-04-07']], 'pos': [], 'sunset': []}
for name, t in [('istanbul', '2026-12-10T14:00:00'), ('mekke', '2027-05-07T15:45:00'), ('jakarta', '2027-03-09T11:20:00'), ('newyork', '2026-06-16T00:40:00')]:
    la, lo, h = LOCS[name]; T = Time(t)
    sa, sz = altaz('sun', T, la, lo, h); ma, mz = altaz('moon', T, la, lo, h)
    el = get_body('moon', T).separation(get_body('sun', T)).deg
    out['pos'].append({'loc': name, 't': t + 'Z', 'sunAlt': round(sa, 4), 'sunAz': round(sz, 4), 'moonAlt': round(ma, 4), 'moonAz': round(mz, 4), 'elongGeo': round(el, 4)})
for name, d in [('istanbul', '2026-12-10'), ('mekke', '2027-05-07'), ('jakarta', '2027-03-09'), ('newyork', '2026-06-15')]:
    la, lo, h = LOCS[name]
    out['sunset'].append({'loc': name, 'day': d, 'utc': sunset(d, la, lo)})
print(json.dumps(out, indent=1))
