import math, arith, datetime
def tab_jd(Y,m0):  # aritmetik (sivil, Cuma epoch: 1 Muharrem 1 = 16 Temmuz 622 Jülyen) – 2,5,7,10,13,16,18,21,24,26,29 artık yıl
    m=m0+1
    return math.floor((11*Y+3)/30)+354*Y+30*m-math.floor((m-1)/2)+1948440-385+1
def gun(jd): return arith.GUN[(jd+1)%7]
def greg(jd): return datetime.date(2000,1,1)+datetime.timedelta(days=jd-2451545)
print('1 Muharrem 1:',gun(tab_jd(1,0)), greg(tab_jd(1,0)))
n=0;agree={'isik':0,'kindi':0,'ulug':0}
for Y in range(1300,1501):
    for m in range(12):
        g=gun(tab_jd(Y,m)); n+=1
        agree['isik']+=arith.isik(Y,m)==g; agree['kindi']+=arith.kindi(Y,m)==g; agree['ulug']+=arith.ulugbey(Y,m)==g
print(n,{k:f'{v} (%{100*v/n:.1f})' for k,v in agree.items()})
c=sum(arith.muharrem88(Y)[0]==gun(tab_jd(Y,0)) for Y in range(1300,1501)); print('madde88 Muharrem uyum',c,'/201')
for Y,m in [(1448,6),(1448,8),(1448,9),(1448,11),(1447,8),(1447,9)]:
    j=tab_jd(Y,m); print(Y,arith.AY[m],greg(j),gun(j),'| Isik',arith.isik(Y,m),'Kindi',arith.kindi(Y,m),'Ulug',arith.ulugbey(Y,m))
