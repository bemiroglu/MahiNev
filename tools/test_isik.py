import astronomy as A, datetime as dt, arith
from compare import tab_jd, greg
from verify import elong, topo
from collections import Counter
idx={g:i for i,g in enumerate(arith.GUN)}
def vis_evening(date, lon, lats, emin):
    """date: local civil date at that longitude; True if at sunset elong>=emin and moon above horizon"""
    for lat in lats:
        o=A.Observer(lat,lon,0)
        start=A.Time.Make(date.year,date.month,date.day,12,0,0).AddDays(-lon/360)  # local noon approx
        ss=A.SearchRiseSet(A.Body.Sun,o,A.Direction.Set,start,1)
        if ss is None: continue
        alt,_=topo(A.Body.Moon,ss,o)
        if alt>0.5 and elong(ss)>=emin: return True
    return False
def method_date(f,Y,m,d):
    w=idx[f(Y,m)]
    return [d+dt.timedelta(days=x) for x in range(-3,4) if (d+dt.timedelta(days=x)).isoweekday()%7==w][0]
res=Counter(); rows=[]
LATS=[-40,-20,0,20,40]
for Y in range(1430,1461):
    for m in range(12):
        d=greg(tab_jd(Y,m))
        t=A.SearchMoonPhase(0,A.Time.Make(d.year,d.month,d.day,0,0,0).AddDays(-6),12)
        cd=t.Utc().date()
        # earliest evening anywhere (westmost longitude -170 is last sunset of a civil date)
        g=None
        for k in range(-1,4):
            D=cd+dt.timedelta(days=k)
            if vis_evening(D,-170,LATS,7.5): g=D;break
        # earliest under Osmanli 18 deg
        g18=None
        for k in range(-1,4):
            D=cd+dt.timedelta(days=k)
            if vis_evening(D,-170,LATS,18): g18=D;break
        earliest=g+dt.timedelta(days=1)   # earliest possible 1st day (global, physical)
        e18=g18+dt.timedelta(days=1)
        isk=method_date(arith.isik,Y,m,d)
        res[('isik-vs-fiziksel',(isk-earliest).days)]+=1
        res[('isik-vs-18',(isk-e18).days)]+=1
        rows.append((Y,m,str(cd),str(earliest),str(e18),str(isk)))
for k in sorted(res): print(k,res[k])
import json; json.dump(rows,open('isik_rows.json','w'))
