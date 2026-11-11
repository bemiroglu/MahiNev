# Se'adet-i Ebediyye s.359-362 aritmetik takvim usulleri
GUN=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
AY=['Muharrem','Safer','Rebîulevvel','Rebîulâhır','Cemâziyelevvel','Cemâziyelâhır','Receb','Şa’bân','Ramezân','Şevvâl','Zilka’de','Zilhicce']
ISIK=[8,2,4,5,7,1,3,4,6,7,2,3]
def isik(Y,m):  # kalan: Cuma'dan itibaren gün adedi (1=Cuma)
    r=(int((Y-1)*4.367)+ISIK[m])%7
    return GUN[(5+r-1)%7]
def muharrem88(Y): # kalan: Perşembe'den itibaren (1=Perşembe)
    r=(Y*5)%8; return GUN[(4+r-1)%7], r
KINDI={ # Ebüzziyâ / Kindî: sütun = Y mod 8 (0..7); değer: Cuma'dan itibaren (1=Cuma)
0:[6,1,2,4,5,7,1,3,4,6,7,2],1:[4,6,7,2,3,5,6,1,2,4,5,7],2:[1,3,4,6,7,2,3,5,6,1,2,4],3:[6,1,2,4,5,7,1,3,4,6,7,2],
4:[3,5,6,1,2,4,5,7,1,3,4,6],5:[7,2,3,5,6,1,2,4,5,7,1,3],6:[5,7,1,3,4,7,7,1,3,5,6,1],7:[2,4,5,7,1,3,4,6,7,2,3,5]}
def kindi(Y,m): v=KINDI[Y%8][m]; return GUN[(5+v-1)%7]
T1={0:[2,6,3,1,5,2,7,4,2,6],10:[3,1,5,2,7,4,2,6,3,1],20:[4,2,7,4,1,6,3,1,5,2],30:[7,4,1,6,3,7,5,2,7,4],40:[1,6,3,7,5,2,7,4,1,6],
50:[3,7,5,2,6,4,1,6,3,7],60:[5,2,6,4,1,5,3,7,5,2],70:[6,4,1,5,3,7,5,2,6,4],80:[1,5,3,7,4,2,6,4,1,5],90:[3,7,4,2,6,3,1,5,3,7],
100:[4,2,6,3,1,5,3,7,4,2],110:[6,3,1,5,2,7,4,2,6,3],120:[1,5,2,7,4,1,6,3,1,5],130:[2,7,4,1,6,3,1,5,2,7],140:[4,1,6,3,7,5,2,7,4,1],
150:[6,3,7,5,2,6,4,1,6,3],160:[7,5,2,6,4,1,6,3,7,5],170:[2,6,4,1,5,3,7,5,2,6],180:[4,1,5,3,7,4,2,6,4,1],190:[5,3,7,4,2,6,4,1,5,3],200:[7,4,2,6,3,1,5,3,7,4]}
T2=[[5,6,7,1,2,3,4],[7,1,2,3,4,5,6],[1,2,3,4,5,6,7],[3,4,5,6,7,1,2],[4,5,6,7,1,2,3],[6,7,1,2,3,4,5],[7,1,2,3,4,5,6],[2,3,4,5,6,7,1],[3,4,5,6,7,1,2],[5,6,7,1,2,3,4],[6,7,1,2,3,4,5],[1,2,3,4,5,6,7]]
def ulugbey(Y,m): # 1=Pazar
    r=Y%210; mh=T1[r//10*10][r%10]; col=T2[0].index(mh); return GUN[(T2[m][col]-1)%7]
def tabular(Y,m): # standart (Kuveyt/aritmetik) hicri takvim, Cuma epoch 16 Temmuz 622 Jülyen
    import math
    jd=math.floor((11*Y+3)/30)+354*Y+30*m-math.floor(m/2)+1948440-385  # day 1
    return GUN[(jd+1)%7]
if __name__=='__main__':
    print('Kitap örnekleri: Işık 1362 Zilka’de ->',isik(1362,10),'| madde88 1357 ->',muharrem88(1357),'| Uluğ Beğ 1316 Muharrem ->',ulugbey(1316,0),', Ramezân ->',ulugbey(1316,8),'| Kindî 1316 Ramezân ->',kindi(1316,8))
    agree={k:0 for k in ['isik','kindi','ulug']};n=0
    for Y in range(1380,1461):
        for m in range(12):
            tb=tabular(Y,m); n+=1
            agree['isik']+=isik(Y,m)==tb; agree['kindi']+=kindi(Y,m)==tb; agree['ulug']+=ulugbey(Y,m)==tb
    print('1380-1460 arası aritmetik (tabular) takvimle uyum (%d ay):'%n,agree)
    for Y,m in [(1448,6),(1448,8),(1448,11),(1447,8)]:
        print(Y,AY[m],'Işık',isik(Y,m),'Kindî',kindi(Y,m),'UluğBeğ',ulugbey(Y,m),'tabular',tabular(Y,m))
