import astronomy as A, statistics as st
from verify import elong, find_elong, topo
t=A.SearchMoonPhase(0,A.Time.Make(2000,1,1,0,0,0),40)
E0=[];H8=[];H18=[];SYN=[];prev=None
while t.ut < A.Time.Make(2031,1,1,0,0,0).ut:
    E0.append(elong(t)); H8.append((find_elong(t,8).ut-t.ut)*24 if elong(t)<8 else 0); H18.append((find_elong(t,18).ut-t.ut)*24)
    if prev: SYN.append((t.ut-prev.ut))
    prev=t; t=A.SearchMoonPhase(0,t.AddDays(1),40)
f=lambda L:f"min {min(L):.2f} / ort {st.mean(L):.2f} / max {max(L):.2f}"
print('n',len(E0)); print('ictimada beynunet (°):',f(E0)); print('8° e kadar saat:',f(H8)); print('18° e kadar saat:',f(H18))
print('sinodik ay (gun):',f(SYN), ' ort saat-dk:', divmod(st.mean(SYN)*1440,60))
# moon horizontal parallax range
import math
P=[]
tt=A.Time.Make(2000,1,1,0,0,0)
for i in range(0,11000,3):
    d=A.GeoMoon(tt.AddDays(i)).Length()*A.KM_PER_AU
    P.append(math.degrees(math.asin(6378.14/d))*60)
print("ay yatay ihtilaf-i manzar ('):",f(P))
