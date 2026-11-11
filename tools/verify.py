import astronomy as A, math, datetime as dt
def T(y,mo,d,h=0,mi=0): return A.Time.Make(y,mo,d,h,mi,0)
def utc(t): return t.Utc().strftime('%Y-%m-%d %H:%M UTC')
def elong(t):
    s=A.GeoVector(A.Body.Sun,t,True); m=A.GeoVector(A.Body.Moon,t,True)
    return A.AngleBetween(s,m)
def find_elong(t0,target):
    lo=t0; hi=t0.AddDays(4)
    for _ in range(60):
        mid=lo.AddDays((hi.ut-lo.ut)/2)
        if elong(mid)<target: lo=mid
        else: hi=mid
    return lo
def topo(body,t,obs):
    eq=A.Equator(body,t,obs,True,True)
    hor=A.Horizon(t,obs,eq.ra,eq.dec,A.Refraction.Normal)
    return hor.altitude,hor.azimuth
def evening(obs,date_t,label,tz):
    ss=A.SearchRiseSet(A.Body.Sun,obs,A.Direction.Set,date_t,1)
    ms=A.SearchRiseSet(A.Body.Moon,obs,A.Direction.Set,ss.AddDays(-0.3),1)
    lag=(ms.ut-ss.ut)*1440
    nm=A.SearchMoonPhase(0,ss.AddDays(-35),35)
    # last new moon before sunset
    while True:
        nxt=A.SearchMoonPhase(0,nm.AddDays(1),35)
        if nxt.ut<ss.ut: nm=nxt
        else: break
    age=(ss.ut-nm.ut)*24
    best=ss.AddDays(lag*4/9/1440)
    altS,_=topo(A.Body.Moon,ss,obs); altB,azB=topo(A.Body.Moon,best,obs)
    sunalt,sunaz=topo(A.Body.Sun,best,obs)
    lt=lambda t:(t.Utc()+dt.timedelta(hours=tz)).strftime('%d.%m %H:%M')
    print(f"{label}: sunset {lt(ss)} moonset {lt(ms)} lag {lag:.0f} dk | age {age:.1f} h | elong@sunset {elong(ss):.2f}° | moon alt@sunset {altS:.2f}° | best {lt(best)} alt {altB:.2f}° DAZ {abs(azB-sunaz):.1f}°")
    return ss,ms,nm
if __name__=='__main__':
    print('== RECEB 1980 ==')
    nm=A.SearchMoonPhase(0,T(1980,5,10),10); print('conjunction',utc(nm))
    for tz in (2,3): print(f'  UTC+{tz}:',(nm.Utc()+dt.timedelta(hours=tz)).strftime('%a %d %H:%M'))
    print('  elong at conjunction %.2f°'%elong(nm))
    for e in (7,8,18):
        t=find_elong(nm,e); print(f'  elong {e}° at {utc(t)} = +{(t.ut-nm.ut)*24:.1f} h')
    t18=find_elong(nm,18)
    ist=A.Observer(41.01,28.98,0); chi=A.Observer(41.88,-87.63,180); izm=A.Observer(40.77,29.92,0)
    evening(ist,T(1980,5,15,10),'Istanbul Per 15 May',3)
    evening(ist,T(1980,5,16,10),'Istanbul Cum 16 May',3)
    evening(chi,T(1980,5,15,18),'Chicago  Per 15 May',-5)
    evening(chi,T(1980,5,16,18),'Chicago  Cum 16 May',-5)
    # longitude where sun sets at t18 (lat 41.9N)
    best=None
    for lon10 in range(-1800,1800,5):
        lon=lon10/10; o=A.Observer(41.88,lon,0)
        alt,_=topo(A.Body.Sun,t18,o)
        if abs(alt+0.833)<0.25:
            # check setting (sun west): hour angle positive
            eq=A.Equator(A.Body.Sun,t18,o,True,True); ha=(A.SiderealTime(t18)*15+lon-eq.ra*15)%360
            if ha<180: best=lon if best is None else best; print('  sun setting at t18 near lon %.1f'%lon)
    print('== KAYSERI 1987 ==')
    nm=A.SearchMoonPhase(0,T(1987,7,20),10); print('conjunction',utc(nm),'TR(UTC+3)',(nm.Utc()+dt.timedelta(hours=3)).strftime('%a %d %H:%M'),'elong %.2f'%elong(nm))
    kay=A.Observer(38.72,35.49,1054)
    evening(kay,T(1987,7,26,10),'Kayseri Paz 26 Tem',3)
    ss,ms,_=evening(kay,T(1987,7,27,10),'Kayseri Pzt 27 Tem',3)
    t2020=T(1987,7,27,17,20); a,_=topo(A.Body.Moon,t2020,kay); print('  moon alt at 20:20 TR: %.2f°, elong %.2f°'%(a,elong(t2020)))
