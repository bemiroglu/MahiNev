# Mâh-ı Nev (Hilâl Rasad Yardımcısı) — Kanonik Kaynak Raporu

## 1. Amaç ve kaynak düzeni

Bu rapor, Mâh-ı Nev'in (Hilâl Rasad Yardımcısı) bundan sonraki bütün tasarım ve kod kararlarında tek başvuru metnidir. Kaynak: *Tam İlmihâl Se'âdet-i Ebediyye* (Hüseyn Hilmi Işık, Hakîkat Kitâbevi, Ocak 2026 baskısı; sayfa numaraları bu baskıya göredir). Kitap baştan sona tarandı. Hilâl, ictimâ, vakit, ufuk ve takvim bahisleri sayfa numaralarıyla süzüldü. Kitaptaki sayısal örnekler modern efemerisle yeniden hesaplandı.

**Kaynak hiyerarşisi** (üstteki alttakini bağlar):

1. **Tam İlmihâl Se'âdet-i Ebediyye ve kanonik kural metni.** Fıkhî hüküm, terminoloji ve eşikler buradan gelir. Değiştirilmez.
2. **Bilimsel hassaslaştırma.** Kitapta sabit veya yuvarlanmış verilen astronomik büyüklükler (süreler, ihtilâf-ı manzar, inhitât-ı ufk, kırılma) her an ve her konum için efemerisle hesaplanır. Kitabın eşiği korunur, yalnızca hesap hassaslaşır. Kitabın açıkça hüküm bağladığı eşikler (8°, 18°, 5°) değişmez. Modern ölçümler ek bilgi olarak yanlarında gösterilir (Bölüm 4).
3. **Modern gözlem modelleri** (Yallop, Odeh). "Modern gözlem modeli (ek bilgi)" etiketiyle tutulur; varsayılan olarak kapalıdır. Yallop'un en iyi gözlem anı, kitabın penceresinin yanında ek bilgi olarak gösterilir (D4).
4. **Takvim usulleri** (kitaptaki aritmetik usuller: Işık, Uluğ Beğ, Kindî; tabular takvim). Rü'yet hükmünün yerine geçmez. Zilhiccede, şahitle sabit olmayan yerler için kitabın bildirdiği Işık usulü ana gösterimdir (s. 326).

**Temel yardımcı kaynak.** *Naklî ve Aklî Delîllerle Rü'yet-i Hilâl* (Türkiye Takvimi Vakit Hesaplama Heyeti; Uluslararası Kamer Aybaşları ve Hicrî Takvîm Birliği Kongresi tebliği, İstanbul, 28–30 Mayıs 2016; [PDF](https://www.turktakvim.com/pdf/HilalKongreTR.pdf)). Programın kullanımını ve rü'yet hâdisesini açıklamakta başvurulur; kitapla aynı yönü gösterir ve kitabın önüne geçmez. Kullanılan kısımları Bölüm 17'dedir.

## 2. Kanonik fıkhî esaslar

Kamerî ay başı rü'yetle kesinleşir. Hesap, ayın başladığı vakti değil, yalnızca hilâlin görülebileceği geceyi bildirir (s. 360, İmâm-ı Sübkî). Program bu esasları aşağıdaki gibi uygular.

| Esas | Kitaptaki yeri | Programdaki karşılığı |
| --- | --- | --- |
| Ramezân hilâli görmekle başlar; takvim veya hesapla başlamak câiz değildir (İbni Âbidîn, Fetâvâ-ı Hindiyye) | s. 314, 315, 360 | Program "ay başladı" demez; "rü'yet imkânı" bildirir |
| Şa'bân'ın 29. günü gurûbda hilâli aramak vâcib-i kifâyedir; görülmezse ay 30'a tamamlanır | s. 314–315 | Her ayın 29. akşamı "gözlem gecesi" olarak işaretlenir |
| İctimâdan 1–2 gün geçmeden hilâl görülemez (İbni Dakîk) | s. 314 | Bilgi notu; kesin sınır Bölüm 4'teki uzanım eşiğiyle hesaplanır |
| Hilâli görmekle başlama, hesapla anlaşılandan bir gün sonra olabilir, bir gün önce olamaz; Arefe de böyledir | s. 315, 360 | Ay başı hücresinde iki ihtimal gösterilir ("1 \| 30"). Hesabın öncesine giriş reddedilir |
| Şa'bân'ın 30. gecesi bir şehirde hilâl görülünce bütün dünyâda oruca başlanır; gündüz görülen hilâl gelecek gecenindir | s. 315 | Ramezân için küresel görünüm (dünya haritası) esastır |
| Şahitlik: bulutlu havada bir âdil kimse; açık havada çok kimse; bayram için iki âdil | s. 315–316 | Program şahitlik yerine geçmez; rü'yet kaydı "kullanıcı beyanı" olarak tutulur |
| Takvime göre başlanan yerlerde bayramdan sonra iki gün kazâ orucu lâzımdır (Tahtâvî) | s. 315–316 | Ramezân/Şevvâl bilgi notu |
| Hilâl şafaktan sonra batarsa ikinci gecenin, şafaktan önce batarsa birinci gecenin hilâlidir (Kâdîhân) | s. 316 | "İddia kontrolü": ay batışı şafak sonuyla karşılaştırılır |
| Zilhicce'nin 9. günü Arefe; bir gün önce Arafât'a çıkanların haccı sahîh olmaz | s. 344, 360 | Zilhicce için Mekke merkezli görünüm ve uyarı |
| Gurûbu görebilenler için zâhirî gurûb, göremeyenler için şer'î gurûb mu'teberdir | s. 181, 186, 317 | Panelde iki gurûb birlikte verilir (Bölüm 5) |

**s. 326 bulgusu: kitabın "hesab"ı Işık usulüdür.** Kanonik metindeki "Ramezân ve bayram aylarının şahitlerle meşrû' olarak anlaşılmadığı yerlerde…" cümlesinin asıl yeri buradır. Kitapta cümlenin devamı şöyledir:

- Zilhicce'nin 1. günü madde 89'daki Işık usulüyle hesaplanır.
- Bayramın ilk günü bu hesapla bulunan gündür veya bir gün sonrasıdır; bir gün önce olamaz.
- İhtiyat için kurban, hesapla bulunan bayramın ikinci günü kesilir. Sevâbı mevtâya gönderilecek kurban birinci gün kesilir.

Türkiye Takvimi aktarımında "(Işık usûlü) ile" ibaresi düşmüş. Bu usulün bilimsel testi Bölüm 6'dadır.

**Kaynak notu (mahallî hüküm) — doğrulandı.** Cümle Se'âdet-i Ebediyye'de yoktur. Asıl kaynağı İbni Âbidîn'in *Redd-ül-muhtâr*'ıdır: Savm bahsinde, ihtilâf-ı metâli' izahının sonundaki "Tembih" (Ahmed Davudoğlu tercümesi). Orada üç ayrı hüküm vardır:

- **Hac:** Hac bahsinden anlaşıldığına göre, hilâlin farklı yerlerde farklı görülmesi muteberdir. Başka bir yerde bir gün önce görüldüğü sonradan anlaşılsa hacılara bir şey lâzım gelmez.
- **Kurban:** İbni Âbidîn bunu açıkça bir yerde görmediğini söyler. Ancak zâhire göre kurbanın namaz vakitleri gibi olduğunu, her cemaatin kendi gördüğüyle amel edeceğini belirtir. Yani bu hüküm onun istidlâlidir.
- **Namaz vakitleri:** Her cemaat kendi vaktiyle mükelleftir.

Aynı yerde Ramezân için de hüküm verilir. İhtilâf-ı metâli' zâhir rivayete göre muteber değildir ve fetva buna göredir. Batıdakilerin görmesiyle doğudakilere de hüküm lâzım gelir. Bunun şartı, rü'yetin "gerektirici bir surette" sabit olmasıdır: iki şahit, hâkim hükmüne şahitlik veya haberin yayılması. "Falan yerde görmüşler" diye aktarmak yetmez. Türkiye Takvimi'ndeki cümle bu Tembih'in özetidir.

## 3. Terminoloji sözlüğü

Arâyüzde kitabın terimi esastır; modern Türkçe karşılığı parantez içinde verilir. Örneğin: "Beynûnet (uzanım)". İngilizce arayüzde de yapı aynıdır: "Beynûnet (elongation)".

| Kitap terimi | Modern Türkçe | English | Kitaptaki yeri |
| --- | --- | --- | --- |
| İctimâ'-ı neyyireyn | kavuşum, yeni ay | conjunction, new moon | s. 360 |
| Muhak | ayın görünmez dönemi | dark-moon period | s. 360 |
| Beynûnet | uzanım (Ay–Güneş açısı) | elongation | s. 360 (kitap "Elongation" karşılığını kendisi verir) |
| Hilâl / Rü'yet-i hilâl | hilal / hilal gözlemi | crescent / crescent sighting | s. 314–316, 360 |
| Rasad / Râsıd | gözlem / gözlemci | observation / observer | s. 175 |
| İrtifâ' (hakîkî, zâhirî, şer'î) | yükseklik açısı | altitude | s. 175–177 |
| Semt dâiresi | azimut | azimuth | s. 177 |
| Meyl | dik açıklık (deklinasyon) | declination | s. 177 |
| Arz / Tûl | enlem / boylam | latitude / longitude | s. 174 |
| Nısf-ün-nehâr | meridyen | meridian | s. 177 |
| Mu'addil-ün-nehâr | gök ekvatoru | celestial equator | s. 177 |
| Üfk-ı hakîkî | gerçek (astronomik) ufuk | true horizon | s. 175 |
| Üfk-ı hissî (sathî üfuk: bu düzlemin gözlemcinin ayağından geçeni) | duyulur ufuk | sensible horizon | s. 175, 180 |
| Üfk-ı zâhirî | görünen ufuk | visible horizon | s. 175 |
| Üfk-ı şer'î | şer'î ufuk (modern karşılığı yok) | legal (shar'i) horizon | s. 175, 186 |
| Gurûb / Tulû' | batış / doğuş | setting / rising | s. 186 |
| İnhitât-ı ufk | ufuk alçalması | dip of the horizon | s. 181, 185 |
| İhtilâf-ı manzar | paralaks (yatay paralaks) | parallax | s. 179, 360 |
| İnkisâr (havâ inkisârı) | atmosferik kırılma | atmospheric refraction | s. 185, 198–199 |
| Nısf-ı kutr-ı zâhirî | görünen yarıçap | apparent semi-diameter | s. 185 |
| Temkin | hakîkî ile şer'î vakit farkı (ihtiyat payı değildir) | tamkin (true-to-legal time offset) | s. 176, 186 |
| Ta'dîl-i zemân | zaman denklemi | equation of time | s. 184 |
| Vasatî / hakîkî zaman | ortalama / gerçek güneş zamanı | mean / apparent solar time | s. 182, 184 |
| Ezânî (gurûbî) zaman | gün batımına göre saat | sunset-based time | s. 184, 198 |
| Fecr-i sâdık | astronomik tan (−19°) | true dawn | s. 176 |
| Şafak (kızıllık / beyazlık) | akşam alacakaranlığının sonu (−17° / −19°) | end of twilight | s. 176, 178 |
| Mahrek / Husûf müstevîsi | yörünge / ekliptik düzlemi | orbit / ecliptic plane | s. 360 |
| Terbî' / Bedr-i tâm | ilk dördün / dolunay | first quarter / full moon | s. 344 |
| Şübheli gün | şüpheli gün (yevm-i şek) | day of doubt | s. 315–316 |

## 4. Astronomik kriterler: kitap → bilim → program

Kitabın eşikleri korunur; kitabın süreye çevirdiği açılar süreyle değil, her an doğrudan hesaplanır. Bunun sebebi şu: kitap uzanımın ictimâ anında sıfır olduğunu varsayar. Oysa 2000–2030 arasındaki 384 ictimâda bu açı 0,1° ile 5,0° arasında (ortalama 3,2°) çıktı; sebebi ay yörüngesinin ekliptikle yaptığı ≈5°'lik açıdır. Aşağıdaki modern değerler bu çalışmada Astronomy Engine kütüphanesiyle hesaplandı.

| Konu | Kitap (sayfa) | Bilimsel karşılığı | Programda kullanım |
| --- | --- | --- | --- |
| Hilâlin hiçbir yerde görülemediği beynûnet | 8° (s. 360) | Danjon sınırı ≈7°; Fatoohi vd. 1998 ve Sultan 2007: çıplak göz için en düşük sınır ≈7,5° | **Gurûbda < 8°: "Görülemez" (kesin, kitap).** Modern 7,5° yalnızca ek bilgi |
| 8°'ye ulaşma süresi | ≈14 saat (s. 360) | 10,4–17,7 saat, ortalama 13,8 saat | Süre kullanılmaz; uzanım her an hesaplanır |
| Osmanlı âlimlerinin ilk görünürlük kabulü | A'zamî 18° ≈ 1,5 gün (s. 360) | 18°'ye ulaşma: 29,0–39,9 saat, ortalama 34,2 saat | **18° eşiği korunur.** Ulaşılma anı ve o anda güneşin battığı boylam (kitabın usulü) hassas hesaplanır ve haritada çizgi olarak gösterilir |
| İlk gece ayın güneşten sonra batışı | 45 dakika içinde (s. 360) | Enlem ve mevsime göre değişir: Kayseri 1987'de 43 ve 71 dk, İstanbul 1980'de 63 dk | Gurûb–ay batışı farkı her konum için hesaplanır |
| Ufka yakınlık | 57′ ihtilâf-ı manzar sebebiyle ufka 5° yaklaşınca görülmez (s. 360) | Ayın yatay paralaksı 53,9′–61,5′ (ortalama 57,0′) | Topozentrik görünen irtifâ (paralaks ve kırılma dahil) her an hesaplanır. **Gurûbda < 5°: o akşam "görülemez".** Kitabın gözlem penceresi hilâl 5°'ye inince biter |
| Muhak süresi | 28–72 saat; Osmanlı takvimlerinde en çok 3 gün (s. 360) | Gözlemsel aralık | Bilgi olarak gösterilir |
| İki ictimâ arası | 29 gün 13 saat (s. 360) | Ortalama 29 g 12 sa 43 dk; gerçek aralık 29,28–29,82 gün | Gerçek ictimâ anları kullanılır |
| Ayın yıldızlara göre devri | 27 gün 8 saat (s. 360) | 27 g 7 sa 43 dk | Bilgi |
| Ayın günlük gecikmesi | 50 dk 30 sn (s. 360) | Ortalama ≈50,5 dk | Bilgi |
| Ay yörüngesinin eğimi | Takrîben 5° (s. 360) | 5,14° | Bilgi |
| Güneşin ihtilâf-ı manzarı | 8,8″ (s. 179) | 8,794″ | Hesaba dahil |
| Işığın Güneş'ten gelme süresi | 8 dk 20 sn (s. 176) | 499 sn | Hesaba dahil (mer'î vakit) |
| Güneşin görünen yarıçapı | asgarî 15′ 45″ (s. 185) | 15′ 44″–16′ 16″ | Günlük hesaplanır |
| İnhitât-ı ufk (ufuk alçalması) | 106,92″ × √h, h metre (s. 185, Ahmed Ziyâ Beğ) | Kırılmalı standart formül ≈105,6″ × √h; ikisi ≈%1 içinde | Kitap formülü kullanılır; gözlemci yüksekliği kullanıcıdan alınır |
| Ufuktaki kırılma | 44,5′ (İstanbul, ufkun 29′ altı, s. 185) | Standart atmosferde ufukta ≈34′; alçak açılarda hızla artar | Sıcaklık ve basınç düzeltmeli kırılma modeli |

**18° eşiği hakkında.** Bu bir ölçüm değil, Osmanlı âlimlerinin kabulüdür; bu yüzden değiştirilmez. Program bunu ana sınıflandırmada şöyle kullanır:

Sınıflar yukarıdan aşağıya sırayla denetlenir; ilk tutan satır geçerlidir.

| Gurûbdaki durum | Ana görünüm etiketi | Rü'yet beyanına karşılık |
| --- | --- | --- |
| İctimâ olmamış veya ay güneşten önce batıyor | Hilâl doğmamış | Kesin red (Sübkî, s. 360) |
| Beynûnet < 8° | Görülemez (kitap, s. 360). Ek bilgi: modern sınır 7,5° | Kesin red (Sübkî, s. 360) |
| Hilâlin görünen irtifâı < 5° | Görülemez: ufka 5°'den yakın (s. 360) | Uyarı |
| 8° ≤ beynûnet < 18° | Görülmesi mümkün; dikkatli rasad gerekir | Kabul edilebilir |
| Beynûnet ≥ 18° | Hesâba göre görülebilir (hava müsaitse) | Kabul edilebilir |

Kaynaklar: [Sky & Telescope – Seeking thin crescent moons](https://skyandtelescope.org/stargazing-and-observing/seeking-thin-crescent-moons/), [Sultan 2007, The Observatory](https://webspace.science.uu.nl/~gent0113/islam/downloads/sultan_2007.pdf).

## 5. Ufuk, gurûb ve temkin (madde 60, s. 175–203)

Rü'yet panelinde "gurûb" tek bir saat değildir. Kitap üç gurûb tanımlar (s. 186) ve hilâl gözlemi zâhirî gurûba, ibadet vakti şer'î gurûba bağlıdır. Program ikisini de gösterir.

**Altı ufuk düzlemi** (s. 175; şekil s. 180): riyâdî, hissî, mer'î, hakîkî, şer'î ve sathî ufuk. Gözlemci yükseldikçe zâhirî ufuk büyür ve hakîkî ufka yaklaşır. Bu yüzden ibadet vakitlerinde yükseklikle değişmeyen şer'î ufuk kullanılır.

| Gurûb türü | Kitaptaki tanım (s. 186) | Programdaki kullanımı |
| --- | --- | --- |
| Hakîkî gurûb | Güneş merkezinin hakîkî irtifâı sıfır | Hesap ara değeri |
| Zâhirî gurûb | Üst kenarın gözlemcinin zâhirî ufkundan kaybolduğu an | **Hilâl gözleminin başlangıcı.** "En iyi gözlem vakti" bundan hesaplanır. Gözlemci yüksekliği (inhitât-ı ufk) ve kırılma dahil |
| Şer'î gurûb | Üst kenarın şer'î ufka göre irtifâı sıfır; hakîkî gurûb + temkin | Akşam/iftar vakti bilgisi; ileride namaz vakitleri modülü |

**Temkin.** Hakîkî vakit ile şer'î vakit arasındaki zaman farkıdır (s. 176). Kitap bunun ihtiyat zamanı olmadığını vurgular (s. 316). Hesabı şöyledir:

- İstanbul için irtifâ zâviyesi 1° 29′ 6,2″'dir. Bu, inhitât-ı ufk (29′), kırılma (44,5′) ve güneşin yarıçapının (15′ 45″) toplamından 8,8″ paralaks çıkarılarak bulunur (s. 185).
- 21 Mart / 23 Eylül'de temkin 7 dk 52,29 sn'dir (s. 186).
- Hesaplanan temkine 2 dk ihtiyat eklenerek İstanbul için vasatî 10 dk kabul edilmiştir (s. 186).
- Bir şehirde tek temkin vardır; her namaz için ayrı temkin yoktur (s. 186). Kitabın sonunda 0–60° enlem ve 500 m'ye kadar yükseklik için temkin cetveli vardır (s. 1244).

Program temkini kitabın usulüyle (o yerin en yüksek noktasına göre inhitât + kırılma + yarıçap − paralaks) her konum ve tarih için hesaplar. S. 1244'teki cetvel doğrulama için kullanılır.

**Diğer vakit açıları** (şafak kuralı ve ileride namaz vakitleri için):

- **Fecr-i sâdık:** dört mezhepte −19°. Avrupalıların −18°'si kabul edilmez (s. 176).
- **Yatsı:** İmâm-ı a'zam'a göre −19°, İmâmeyn ve diğer üç mezhebe göre −17° (s. 178).
- **Şafak:** kızıllığın kaybolması −17°, beyazlığın kaybolması −19° (s. 176–178).
- **Mer'î vakit:** riyâdî vakit + 8 dk 20 sn (s. 176).

**Kâdîhân şafak kuralı: karar.** Esas şafak −19°'dir; bu, beyazlığın kaybolmasıdır ve İmâm-ı a'zam'ın kavlidir. −17° (kızıllığın kaybolması) ek bilgi olarak gösterilir. Açıklaması şöyledir: "İmâmeyn'e ve diğer üç mezhebe göre şafak, kızıllığın kaybolmasıdır (s. 176). Bu ölçüyle şafak daha erken biter. Ay ikisi arasında batıyorsa, iki görüş farklı sonuç verir."

## 6. Aritmetik takvim usulleri (madde 86–89, s. 358–362)

Bu usuller yalnızca **takvim bilgisidir**. Ay başının haftanın hangi gününe düşeceğini yaklaşık verirler, rü'yet hükmü üretmezler. Programda "Takvim usulü — rü'yet hükmü vermez" etiketiyle, karşılaştırma panelinde gösterilirler. Hepsi Python'da kodlandı ve kitaptaki örneklerin her biri aynı sonucu verdi.

**Işık usulü (madde 89, s. 359).** Y hicrî yıl, k ay katsayısıdır. Kalan Cuma'dan itibaren sayılır (1 = Cuma).

```latex
r = \left( \left\lfloor (Y-1) \times 4{,}367 \right\rfloor + k_{ay} \right) \bmod 7
```

Ay katsayıları (Muharrem→Zilhicce): 8, 2, 4, 5, 7, 1, 3, 4, 6, 7, 2, 3. Bunlar "Hilmi Bu Dünyâya Hiç Zahmet Etme…" beytindeki kelimelerin ebced değerleridir. 4,367 sayısı, kamerî yılın 354,367 gününün 7'ye bölümünden kalan kısımdır (bu açıklama kitapta yoktur, bizim tespitimizdir). Kitabın örneği doğrulandı: 1362 Zilka'de → Cumartesi.

**Muharrem'in ilk günü (madde 88, s. 359).** Kalan Perşembe'den itibaren sayılır (1 = Perşembe).

```latex
r = (5 \times Y) \bmod 8
```

Örnek doğrulandı: 1357 → Perşembe. Kalanın 0 çıktığı durumu kitap açıklamıyor. Karar: "8. gün" alınacak, ancak bilimsel sınamadan sonra kesinleşecek.

**Sınama sonucu (1300–1500).** Bu aralıkta 25 yılda kalan 0 çıkıyor. Bu yıllarda Muharrem'in ilk günü aritmetik takvimde 15 kez Çarşamba, 6 kez Salı ve yalnızca 4 kez Perşembe. Uluğ Beğ ve Işık usulü de aynı dağılımı veriyor. Yani "8. gün (Perşembe)" yorumu doğrulanmadı; veriler "7. gün (Çarşamba)" yorumunu destekliyor. Kuralın kendisi de bu çağda kaymış görünüyor: kalan 1–7 için de yalnızca ≈%47 isabetli. Kalan büyüdükçe gerçek gün formülün bir gün gerisinde kalıyor. Karar: Kalan 0 çıktığında "kitapta tanımsız" notu düşülür ve Muharrem başı için Uluğ Beğ cetvelinin sonucu verilir.

**Ebüzziyâ / Kindî cetveli (s. 361).** Sütun Y mod 8 ile bulunur. Ay satırındaki değer, Cuma'dan itibaren gün sayısıdır. **Düzeltme:** Cemâzil-âhır satırının 6. sütunu kitapta 7 basılmış. 30/29 günlük ay deseni 6 olmasını gerektirdiği için programda 6 alınır ve yardım metninde not edilir.

```csv
Ay,0,1,2,3,4,5,6,7
Muharrem,6,4,1,6,3,7,5,2
Safer,1,6,3,1,5,2,7,4
Rebiülevvel,2,7,4,2,6,3,1,5
Rebiülahir,4,2,6,4,1,5,3,7
Cemaziyelevvel,5,3,7,5,2,6,4,1
Cemaziyelahir,7,5,2,7,4,1,6,3
Receb,1,6,3,1,5,2,7,4
Şaban,3,1,5,3,7,4,1,6
Ramazan,4,2,6,4,1,5,3,7
Şevval,6,4,1,6,3,7,5,2
Zilkade,7,5,2,7,4,1,6,3
Zilhicce,2,7,4,2,6,3,1,5
```

**Uluğ Beğ usulü (s. 361–362; kitap "en sahîhi" der).** r = Y mod 210 alınır. Birinci cetvelde onlar satırı (r − r mod 10) ile birler sütunu (r mod 10) kesiştiği yerdeki değer Muharrem'in ilk günüdür; Pazar'dan sayılır (1 = Pazar). İkinci cetvelde Muharrem satırında bu değerin bulunduğu sütuna inilir; aranan ayın satırındaki değer o ayın ilk günüdür. Örnek doğrulandı: 1316 → Muharrem Pazar, Ramezân Cuma.

```csv
Onlar,0,1,2,3,4,5,6,7,8,9
0,2,6,3,1,5,2,7,4,2,6
10,3,1,5,2,7,4,2,6,3,1
20,4,2,7,4,1,6,3,1,5,2
30,7,4,1,6,3,7,5,2,7,4
40,1,6,3,7,5,2,7,4,1,6
50,3,7,5,2,6,4,1,6,3,7
60,5,2,6,4,1,5,3,7,5,2
70,6,4,1,5,3,7,5,2,6,4
80,1,5,3,7,4,2,6,4,1,5
90,3,7,4,2,6,3,1,5,3,7
100,4,2,6,3,1,5,3,7,4,2
110,6,3,1,5,2,7,4,2,6,3
120,1,5,2,7,4,1,6,3,1,5
130,2,7,4,1,6,3,1,5,2,7
140,4,1,6,3,7,5,2,7,4,1
150,6,3,7,5,2,6,4,1,6,3
160,7,5,2,6,4,1,6,3,7,5
170,2,6,4,1,5,3,7,5,2,6
180,4,1,5,3,7,4,2,6,4,1
190,5,3,7,4,2,6,4,1,5,3
200,7,4,2,6,3,1,5,3,7,4
```

```csv
Ay,s1,s2,s3,s4,s5,s6,s7
Muharrem,5,6,7,1,2,3,4
Safer,7,1,2,3,4,5,6
Rebiülevvel,1,2,3,4,5,6,7
Rebiülahir,3,4,5,6,7,1,2
Cemaziyelevvel,4,5,6,7,1,2,3
Cemaziyelahir,6,7,1,2,3,4,5
Receb,7,1,2,3,4,5,6
Şaban,2,3,4,5,6,7,1
Ramazan,3,4,5,6,7,1,2
Şevval,5,6,7,1,2,3,4
Zilkade,6,7,1,2,3,4,5
Zilhicce,1,2,3,4,5,6,7
Kurban Bayramı,3,4,5,6,7,1,2
```

**Yıl çevirmeleri (madde 86–87, s. 358).**

- **Yıl uzunlukları:** Şemsî yıl 365,242 gün, kamerî yıl 354,367 gündür; fark 10,875 gün.
- **Kamerî → şemsî yıl:** × 0,97023 (= 32,58/33,58).
- **Şemsî → kamerî yıl:** × 1,0307 (= 33,5/32,5).
- **Başlangıçlar:** Hicrî kamerî yıl 16 Temmuz 622 Cuma'da, hicrî şemsî yıl 20 Eylül'de başlar.
- **Kamerî → mîlâdî:** (Y − 1) × 0,97023 + 621,54. Örnek: 1404 → 1983'ün 10. ayının 8. günü.
- **Hicrî yıl başının mîlâdî karşılığı (s. 362):** Her hicrî yıl başı yaklaşık 11 gün erken gelir. 33,58 hicrî yılda bir Ocak'ın ilk on gününe düşer. Kitapta referans cetveli vardır (örn. 1330 ↔ 1911, 1430 ↔ 2008).
- **İmâm Ca'fer Sâdık kuralı (s. 361):** Ramezân'ın ilk günü, önceki yılın Ramezân'ının ilk gününden başlayarak sayılan haftanın beşinci günüdür.

**Karşılaştırma (bu çalışmada hesaplandı).** Usuller 1420–1460 yıllarının 492 ayında gerçek ictimâ günüyle (Türkiye saati) karşılaştırıldı.

| Usul | Ay başı − ictimâ günü | Not |
| --- | --- | --- |
| Işık usulü | 0 gün: 18 ay; 1 gün: 256; 2 gün: 210; 3 gün: 8 | Ortalama ictimâya en yakın usul. 18 ayda ay başını ictimâ gününe koyuyor; bu rü'yet açısından imkânsız |
| Uluğ Beğ cetveli | 1 gün: 93; 2 gün: 320; 3 gün: 79 | Bugünkü aritmetik (tabular) hicrî takvimle %96 aynı |
| Ebüzziyâ / Kindî | 2 gün: 157; 3 gün: 292; 4 gün: 39 | 1310/1893 için hazırlanmış; zamanla 1–2 gün kaymış |

Bu tablo kitabın tezini destekliyor: aynı ay için takvim usulleri birbirinden 1–2 gün ayrılıyor ve hiçbiri rü'yetin yerini tutmuyor. Örnek: 1448 Receb'in ilk günü üç usulde de Cuma, 11 Aralık 2026 çıkıyor (Jamry ile aynı). 1448 Şevvâl'de ise Işık usulü Salı, Uluğ Beğ ve Kindî Çarşamba veriyor.

**Işık usulünün "hesap" olarak sınanması (s. 326).** Kitap, şahit bulunmayan yerlerde Zilhicce'nin ilk gününü Işık usulüyle bulup "bir gün evvel olamaz" sınırını buna bağlıyor. Bu usul, 1430–1460 yıllarının 372 ayında üç ölçüyle karşılaştırıldı. İlki gerçek ictimâdır. İkincisi fiziksel olarak mümkün en erken ay başıdır: dünyada bir yerde gurûbda beynûnet ≥ 7,5° ve ay ufkun üstünde. Üçüncüsü Osmanlı ölçüsüyle en erken ay başıdır (≥ 18°).

| Işık usulü tarihi − karşılaştırılan tarih | Fiziksel en erken (7,5°) | Osmanlı ölçüsü (18°) |
| --- | --- | --- |
| 2 gün önce | — | 20 ay |
| 1 gün önce | 29 ay (%8) | 201 ay |
| Aynı gün | 216 ay (%58) | 146 ay |
| 1 gün sonra | 124 ay (%33) | 5 ay |
| 2 gün sonra | 3 ay | — |

Işık usulü, ay hareketinin ortalamasına dayanan, akılda kalıcı ve zarif bir hesap kuralıdır. Gerçek ictimâyı ve atmosferi ayrıca hesaba katmadığı için bazı aylarda astronomik hesaptan bir gün ayrılabilir. Kitabın kendi ölçüsü olan 18° ile karşılaştırıldığında ayrılık çok azalır.

**Karar (12 Kasım 2026):** Kitap, şahitle sabit olmayan yerlerde Zilhiccenin birinci gününün Işık usulüyle hesaplanmasını bildirdiği için (s. 326), Zilhicce'de ana gösterim Işık usulüdür. Bayramın birinci günü bu hesapla bulunan gün veya bir gün sonrasıdır. Astronomik hesap (hesâbî en erken gün) yanında ek bilgi olarak gösterilir. Diğer aylarda ay başının rü'yetle kesinleştiği, hesâbî en erken günün yalnız imkân bildirdiği gösterim korunur.

## 7. Kitaptaki örneklerin doğrulanması

Kitaptaki iki sayısal örnek hassas efemerisle yeniden hesaplandı. Kayseri 1987 kaydı kitabın ölçüsüyle tam uyuşuyor. Receb 1980 örneğinde ise hesap kitabı doğruluyor, ancak gün adlandırmasında bir tarih çizgisi farkı görülüyor. Her iki örnek programa otomatik test olarak gömülecek.

**Receb 1400 (Mayıs 1980), s. 360**

| Büyüklük | Kitap | Hassas hesap |
| --- | --- | --- |
| İctimâ | 14 Mayıs Çarşamba 15:00 (Türkiye) | 14 Mayıs 12:00 UTC = 15:00 (UTC+3); birebir uyumlu |
| İctimâ anında beynûnet | Sıfır varsayılıyor | 5,0° (ay ekliptikten en uzak konumda) |
| 8°'ye ulaşma | Perşembe 05:00'ten önce olamaz (+14 sa) | Perşembe 02:00 TR (+11,0 sa) |
| 18°'ye ulaşma | Cuma 03:00 TR (+36 sa) | Perşembe 15 Mayıs 21:49 TR (+30,8 sa) |
| İstanbul, Perşembe gurûbu | — | Beynûnet 17,2° (18°'nin hemen altı), ay irtifâı 10,0°, ay 63 dk sonra batıyor |
| Şikago, Perşembe gurûbu | — | Beynûnet 21,3°, irtifâ 13,4°, ay 84 dk sonra batıyor |
| İstanbul, Cuma gurûbu | Gurûb 19:20 | Beynûnet 29,9°, irtifâ 21,0° |
| Receb'in ilk günü | 17 Mayıs Cumartesi | (hüküm değil; aşağıdaki nota bakınız) |

**Tarih çizgisi notu.** Kitabın bulduğu an (Cuma 03:00, Türkiye) Şikago'da **Perşembe akşamı 19:00**'a denk gelir. Yani kitabın kendi rakamı Şikago'nun Perşembe akşamı gurûbunu gösteriyor. Metin ise Şikago'yu İstanbul'un "240° doğusu" sayarak bu akşamı "Cum'a günü \[Cumartesi gecesi\]" diye adlandırıyor. Hassas hesap da 18° eşiğinin Perşembe akşamı İstanbul'un batısında aşıldığını gösteriyor. Bu bir fıkhî sonuç değil, bir hesap tespitidir; değerlendirmesi size ve ehline aittir. Program her tarihi gözlem yerinin yerel tarih ve saatiyle gösterecek; bu tür karışıklıkların önüne böyle geçilir.

**Karar:** Program bu örneği hassas hesapla sunar: her olay gözlem yerinin yerel tarihi ve saatiyle yazılır. Kitabın ifadesi kaynağıyla birlikte yanında aktarılır.

**Zilhicce 1407, Kayseri (Temmuz 1987), s. 344**

| Büyüklük | Kitap (Türkiye gazetesi, 28.7.1987) | Hassas hesap (38,72°K, 35,49°D, 1054 m) |
| --- | --- | --- |
| İctimâ | — | 25 Temmuz Cumartesi 23:38 TR; beynûnet 4,5° |
| Pazar akşamı | Hilâl görülemedi | Beynûnet 10,0°, irtifâ 7,0°, ay 43 dk sonra batıyor; sınıf "mümkün, dikkatli rasad" (< 18°); kitapla uyumlu |
| Pazartesi gurûbu | 19:50 | 19:53 (fark 3 dk; ufuk ve yükseklik) |
| Hilâlin görüldüğü an | 20:20 | Beynûnet 20,6° (≥ 18°), irtifâ 7,6°; kitapla uyumlu |
| Hilâlin batışı | 20:55 | Geometrik ay batışı 21:04. 20:40'ta irtifâ 3,9°, 20:55'te 1,4°; hilâl ufuk pusunda kaybolmuş |
| Zilhicce'nin ilk günü | Salı (Arefe Çarşamba) | Hesap bu sonucu destekliyor |

**Uyum notu.** Gazete hilâlin 20:20'de görüldüğünü ve 20:55'te battığını bildirir; 5°'nin altında izlendiğini söylemez. Görüldüğü anda hilâlin irtifâı 7,6°'ydi. Bu, kitabın "ufka 5° yaklaşınca görülemez" notuyla uyumludur.

## 8. Programa yansıyan kurallar

Ekranda her zaman Tam İlmihâl'e dayanan sınıflandırma görünür. Modern modeller ve takvim usulleri ayrı etiketle, ek bilgi olarak görünür.

| Katman | Varsayılan | Etiket |
| --- | --- | --- |
| Tam İlmihâl sınıfları (Bölüm 4) | Açık | "Hesâbî rü'yet imkânı" |
| Yallop / Odeh sınıfları | Kapalı | "Modern gözlem modeli (ek bilgi)"; optik araç gerektiren sınıflarda "çıplak gözle değil" notu |
| Aritmetik usuller (Bölüm 6) | Ay başı bilgisinde | "Takvim usulü"; Zilhiccede Işık usulü ana gösterimdir (s. 326) |

**Hicrî gün.** Hesâbîdir. Ay başına yakın günlerde iki ihtimal birlikte gösterilir ("1 | 29/30", "n (veya n−1)"). Bu, "hesapla anlaşılandan bir gün sonra olabilir, bir gün önce olamaz" hükmünün karşılığıdır (s. 360). Kamerî gün şer'î gurûbda değişir (s. 188).

**Akşam değerlendirmesi:**

- **Gurûb:** Zâhirî gurûb (gözlem için) ve şer'î gurûb (temkinli).
- **Kitabın penceresi:** Zâhirî gurûbdan hilâlin görünen irtifâı 5°'ye inene kadar (s. 360). Ana panelde önce bu pencere gösterilir; yanında Yallop'un en iyi gözlem anı ek bilgi olarak yazılır.
- **Ayın gurûbu**, hilâl yaşı, beynûnet, irtifâ, semt ve aydınlanma.
- **Pratik yönlendirme:** "Güneşin battığı noktanın 12° solunda, 6° yukarıda" gibi.
- **Kâdîhân kontrolü:** Ay şafaktan önce mi, sonra mı batıyor (Bölüm 5)?

**Dünya haritası:** Her ızgara noktası, o yerin yerel gurûbunda Bölüm 4'teki sınıflardan biriyle boyanır. Beynûnetin 18°'ye ulaştığı anda güneşin battığı boylam bir çizgi olarak çizilir (s. 360).

**Ay modları:**

- **Ramezân:** Küresel. Dünyada herhangi bir yerdeki rü'yet, gerektirici surette sabit olunca her yeri bağlar (s. 315).
- **Zilhicce:** Hac Mekke'deki rü'yete göredir; Arefe uyarısı verilir (s. 344, 360). Kurban mahallîdir (Redd-ül-muhtâr). Şahitle sabit olmayan yerler için Zilhiccenin birinci günü Işık usulüyle gösterilir; bayram bu gün veya bir gün sonrasıdır (s. 326). Astronomik hesap yanında ek bilgidir.
- **Diğer aylar:** Kullanıcının konumu.

**Rü'yet kaydı:** Bir "kullanıcı beyanı"dır, şahitlik yerine geçmez. Kesin red üç durumdadır: ictimâ henüz olmamışsa, ay güneşten önce batıyorsa veya gurûbda beynûnet 8°'nin altındaysa (Sübkî, s. 360). Diğer durumlar uyarı olarak gösterilir.

**Hesâbî en erken gün (Sübkî alt sınırı).** Dünyada bir yerde gurûbda beynûnet ≥ 8° ve hilâlin görünen irtifâı ≥ 5° şartlarının birlikte sağlandığı ilk akşam aranır; en erken gün bu akşamın ertesi günüdür.

**Rü'yetin sübûtu (Redd-ül-muhtâr, Kitâb-us-savm).** Küresel Ramezân hükmü, başka bir yerdeki rü'yet "gerektirici surette" sabit olunca geçerlidir: iki şahit, hâkim hükmüne şahitlik veya haberin yayılması. Dünya haritası yalnızca imkânı gösterir. Şahitlik şartları (s. 315–316):

- **Bulutlu havada Ramezân:** Bir âdil kişi yeter.
- **Bayram:** İki âdil; bulutlu havada Şevvâl için iki erkek veya bir erkek ile iki kadın.
- **Açık havada:** Birçok kimsenin haber vermesi gerekir.

**Çıplak göz şartı:** Sınıflar çıplak göz içindir. Kitap rü'yeti "gökte yeni ayı görmek" diye anlatır. Aletle gözlemin muteber olmadığını açıkça söyleyen hüküm, aynı geleneğin [Rasad Hakkında Zarûrî Malûmat](https://praytimes.net/documents/RasadHakkindaZaruriMalumat.pdf) metnindedir.

## 9. Kararlar

| Konu | Karar |
| --- | --- |
| Kesin red (D1) | Kesin red üç durumda: ictimâ olmamış, ay güneşten önce batıyor veya gurûbda beynûnet < 8° (Sübkî, s. 360). Modern 7,5° yalnızca ek bilgi |
| 5° sınırı (D2) | Kitabın penceresi gurûbdan hilâlin görünen irtifâı 5°'ye inene kadar sürer. Gurûbda < 5° ise o akşam görülemez |
| En erken mümkün gün (D3) | En hassas efemerisle (≥ 8° ve ≥ 5°). Zilhiccede, şahitle sabit olmayan yerler için ana gösterim Işık usulü (s. 326); astronomik hesap yanında |
| En iyi gözlem anı (D4) | Ana panelde önce kitabın penceresi (gurûb → 5°); yanında Yallop'un en iyi anı (gurûb + 4/9 × fark) ek bilgi olarak |
| Kâdîhân şafak kuralı | Esas −19°. −17° açıklamasıyla ek bilgi (Bölüm 5) |
| Çıplak göz şartının kaynağı | Yardım metninde "Rasad Hakkında Zarûrî Malûmat" gösterilir |
| Receb 1980 örneği | Hassas hesapla sunulur, kitabın ifadesi yanında verilir |
| Kindî cetveli | Cemâzil-âhır, sütun 6: kitapta 7 basılmış; 6 alınır (baskı hatası) |
| Madde 88, kalan 0 | "Kitapta tanımsız" notu ve Uluğ Beğ cetvelinin sonucu |
| Mahallî hükmün kaynağı | Redd-ül-muhtâr, Kitâb-us-savm, ihtilâf-ı metâli' Tembih'i |
| Redd-ül-muhtâr atıf biçimi | Eser, bölüm ve mesele adıyla; sayfa numarası verilmez |
| Açıklama penceresi (D5) | "Bu akşam ne demek?" penceresi seçili akşam ve yer için hesâbî imkânı Tam İlmihâl'in sayfalarıyla açıklar. Normalde kapalıdır; düğmeyle açılır |
| İki gece esası (D6) | Hilâl, hesâbın bildirdiği gecede doğar; o gece görülmeyip bir gece sonra görülebilir (İbni Âbidîn, s. 360). Rü'yetle başlama hesapla anlaşılandan bir gün sonra olabilir, bir gün önce olamaz (s. 315); bayram, Işık usulüyle bulunan gün yâhud bir gün sonradır (s. 326). Bu yüzden her ayın 1. günü iki günden biridir: hesapla bulunan gün (H) veya H+1. Program önceki aya dayanan ihtimal zinciri kurmaz. Ay 29 günden kısa, 30 günden uzun olmaz (s. 315): önceki ayın iki ihtimalinden biri bu ayın iki ihtimalinden birini kesinleştirir, diğeri rü'yete bırakır; açıklama penceresi bunu iki cümleyle yazar. Kapsam Zilhicce dışında dünya genelidir (s. 315); yerel hesap ayrı bir hicrî tarih olarak gösterilmez. 2026–2030 arasındaki 60 kamerî ayın hepsinde dünyanın bir yerinde beynûnet en geç ikinci gece 18°'yi geçer (Osmanlı kabulü, s. 360) |
| Naklî deliller (D7) | Rehber'de ayrı konu. Kaynak Kongre tebliğidir; kitabın hükümleri sayfalarıyla yanında verilir. Açıklamalarda bu konuya gönderme yapılır |
| Bildirim ekleri (D8) | Rü'yet kaydı mühürlendikten sonra değiştirilmez. "Kime, ne zaman, nasıl bildirildi" bilgisi kayda bağlı (`recordHash`), ayrıca mühürlü bir ektir; kaydın özetine katılmaz. Biçim ileride kurulacak bir bildirim ağına esas olur |
| Dil ilkesi (D9) | Program rü'yetsiz hüküm kurmaz. Hesâbî sonuçlar "mümkün", "görülebilir", "hesâben" diye; ay başı iki ihtimalle ve şartlı ("görülüp sabit olursa", "1 Receb 10 Aralık ise") yazılır. Hicrî tarih her yerde "hesâbî" etiketiyle ve iki sayının gerekçesiyle ("Neden iki sayı") gösterilir. Kesin ifade yalnız Tam İlmihâl'in kesin hükümlerinde kullanılır: kesin red (s. 360), alt sınır (s. 315), ayın 29–30 gün çekmesi (s. 315). Program metinlerinde kaynak "kitap" diye değil, "Tam İlmihâl" adıyla anılır. Çizelge ve harita adlarında "rü'yet imkânı" denir |
| Yallop önerisi (D10) | Yallop'un "en iyi an"ı modern ek bilgidir; "Yallop önerisi (ek bilgi)" adıyla, kitabın vakitlerinden (gurûb, 5° anı, ay batımı) sonra, küçük ve sönük gösterilir. Kitabın penceresinden sonraysa bu yanında yazılır. Kullanıcı modern bilgiye ulaşabilir; cevap kitabın ölçüleriyle verilir |
| Kullanım düzeyleri (D11) | Başlangıç, Deneyimli, Uzman ve Tüm düzeyler (varsayılan; mevcut görünüm). Düzey yalnız hangi kartların açık başlayacağını ve kart içindeki ayrıntıyı değiştirir; kart gizlenmez, hesap aynıdır. Kitabın hükmü (sınıf, kesin red, arama penceresi, rü'yet beyanı) her düzeyde görünür. A4 çıktıları her düzeyde tamdır |
| Rasıdın kendi rü'yeti ve Kâdîhân (D12) | Kullanıcının birinci veya ikinci gece "gördüm" kaydı varsa açıklama penceresi ve Saha, bu rü'yete göre ayın 1. gününü tek cümleyle yazar; ikinci gece kaydında bir akşam önce başka yerde sabit olma ihtimali de yazılır. Kayıt şahitlik yerine geçmez (s. 315). Kâdîhân ölçüsü (s. 316) "bu akşam hilâl görülürse … gecenin hilâlidir" diye bilgi olarak verilir; program ay başını buna göre seçmez |
| Gök cisimleri aracı (D13) | "Seçili an" kartında Güneş, Ay, yedi gezegen ve 32 parlak yıldız: yön ve yükseklik, doğuş–meridyen–batış, kadir, takımyıldız (Uzman: sağ açıklık, dik açıklık, Güneş'e açı, uzaklık), alacakaranlık evreleri ve "bu gece" listesi. Görünürlük, güneşin yüksekliği, kadir ve ufuk sönükleşmesiyle (k = 0,28) temkinli bir çıplak göz tahminidir; gece sınırı 5,5 kadir, ufuktan 3° altı "ufka çok yakın". Ek bilgidir; hilâlin değerlendirmesi Tam İlmihâl'e göredir. Ay başı akşamlarında kapalı, diğer günlerde açık başlar |
| Gezinme (D14) | Tek seçili an (tarih ve saat) bütün sekmelerde ortaktır. Her atlama geri alınabilir: üst bantta ↶ Geri / İleri ↷ ve ◀ ▶ gün okları. Ay başı gezintisi tek yerdedir (◀ Önceki ay başı / Sonraki ay başı ▶ ve gece türü seçimi). Saha sekmesi canlı kipte şimdiki anı, planlama kipinde seçili anı "önizleme" olarak gösterir; rü'yet kaydı her zaman gerçek saati kullanır |

Bütün tasarım ve kod bu rapora dayanır. Değişiklik ancak yeni bir karar kaydıyla yapılır.

**Sonraki adımlar:** [docs/yol-haritasi.md](yol-haritasi.md).

## 10. Tam İlmihâl uyum denetimi

Raporun bütün kabulleri kitabın metniyle tek tek karşılaştırılmıştır. Kitaptan ayrılan dört kabul (D1–D4) karara bağlanmıştır: Dördü de kitapla uyumludur; ana panelde her zaman önce kitabın ölçüsü gelir.

**Uyumlu kabuller**

| Kabul | Kitaptaki dayanak |
| --- | --- |
| Ay başı rü'yetle başlar; hesap ve takvimle başlanmaz | s. 314, 315, 360 |
| Hesap ay başını değil, hilâlin görülebileceği geceyi bildirir (Sübkî) | s. 360 |
| Rü'yetle başlama hesaptan bir gün sonra olabilir, önce olamaz; Arefe de böyledir | s. 315, 360 |
| Şa'bân'ın 29'u gurûbda hilâl aramak vâcib-i kifâyedir; görülmezse ay 30'a tamamlanır | s. 314–315 |
| Ramezân küreseldir; gündüz görülen hilâl gelecek gecenindir | s. 315 |
| Şahitlik: bulutlu havada bir âdil, açık havada çok kimse; kâdî yoksa bir âdille Ramezân, iki âdille bayram; bulutlu havada Şevvâl için iki erkek veya bir erkek ile iki kadın | s. 315–316 |
| Takvimle başlanan yerlerde bayramdan sonra iki gün kazâ | s. 315–316 |
| Kâdîhân'ın şafak kuralı; esas −19° (İmâm-ı a'zam) | s. 316; s. 176, 178 |
| Arefe'den bir gün önce Arafât'a çıkanın haccı sahîh olmaz | s. 344, 360 |
| Şahitle bayram ilan edilip kurban kesildikten sonra Arefe olduğu anlaşılırsa namaz ve kurban kabul olur | s. 326 (programa bilgi notu olarak eklenecek) |
| İctimâdan 1–2 gün geçmeden hilâl görülmez (İbni Dakîk) | s. 314 |
| Beynûnet = elongation; 8°'nin (≈14 saat) altında hilâl hiçbir yerde görülmez | s. 360 |
| 18° Osmanlı kabulüdür; o anda güneşin battığı boylam ve batısında görülür | s. 360 |
| Muhak 28–72 saat (Osmanlı: en çok 3 gün); ictimâ muhakın ortası; iki ictimâ arası 29 g 13 sa | s. 360 |
| Ay devri 27 g 8 sa; günlük gecikme 50 dk 30 sn; yörünge eğimi ≈5° | s. 360 |
| Üç gurûb, altı ufuk, temkinin tanımı ve İstanbul değerleri; temkin ihtiyat zamanı değildir | s. 175–186, 316 |
| Görebilen için zâhirî gurûb, göremeyen için şer'î gurûb mu'teberdir | s. 181, 186, 317 |
| Fecr −19°; yatsı −19° (İmâm-ı a'zam) / −17° (İmâmeyn) | s. 176, 178 |
| İnhitât 106,92″×√h ve en çok 29′; kırılma 44,5′; güneş yarıçapı 15′45″; güneş paralaksı 8,8″; ışık süresi 8 dk 20 sn | s. 176, 179, 185 |
| Aritmetik usuller ve kitaptaki örnekleri; Kindî cetveli düzeltmesi | s. 358–362 |
| Mahallî hüküm Se'âdet-i Ebediyye'de yoktur; kaynağı Redd-ül-muhtâr'dır | Redd-ül-muhtâr, Kitâb-us-savm |

**Uygulama notları**

1. **Zilhicce:** Hac için Mekke, kurban için kullanıcının yeri esastır (Bölüm 8).
2. **Redd-ül-muhtâr atıfları:** Eser, bölüm ve mesele adıyla yapılır; PDF sayfa numarası kullanılmaz.
3. **Terim:** "Üfk-ı hissî" ile "üfk-ı sathî" kitaptaki ayırıma göre kullanılır (s. 175).
4. **Kitapta olmayan açıklama:** Işık usulündeki 4,367 sayısının açıklaması "bizim tespitimiz" diye etiketlenir.

**Kitaptan ayrılan kabuller ve kararlar**

| # | Kitap ne diyor | Karar (10.11.2026) | Kitapla ilişkisi |
| --- | --- | --- | --- |
| D1 | s. 360: beynûnet 8°'den azken hilâl "hiçbir zemânda, hiçbiryerde görülemez"; Sübkî: hesaba göre doğmadan görüldü denirse hesaba inanılır | Kesin red: ictimâ olmamış, ay güneşten önce batıyor veya beynûnet < 8°. 7,5° ek bilgi | Uyumlu |
| D2 | s. 360: ufka 5° yaklaşınca görülemez | Pencere gurûbdan 5°'ye kadar; gurûbda < 5° ise o akşam görülemez | Uyumlu |
| D3 | s. 326: şahitle sabit olmayan yerlerde bayram Işık usulüyle bulunan gün veya ertesi; önce olamaz | Zilhicce'de ana gösterim Işık usulü (s. 326); astronomik hesap (hesâbî en erken gün) yanında ek bilgi (karar 12.11.2026) | Uyumlu |
| D4 | s. 360: hilâl gurûbdan sonraki 45 dakika içinde görünür; ufka 5° yaklaşınca görülemez | Ana panelde önce kitabın penceresi; Yallop'un en iyi anı yanında ek bilgi | Uyumlu |

 Kitabın ilgili hükmü (s. 326, s. 360) programda her zaman yanında ve kaynağıyla görünür.

## 11. Rü'yet arayüzü ilkeleri

Arayüzün tek işi, kullanıcının hilâli en hızlı ve doğru şekilde aramasını sağlamaktır. İki kullanım bağlamı esastır: masada rü'yet planı ve açık alanda, mobil cihazla, karanlıkta rasad. Bölüm 8'deki gösterim hiyerarşisi aynen geçerlidir: ana görünümde kitabın sınıfları vardır; modern modeller ek bilgidir; takvimler karşılaştırmadır.

| # | İlke | Arayüzdeki karşılığı |
| --- | --- | --- |
| 1 | İki bağlam | Sekmeler: Plan, Harita, Saha, Rehber, Doğrulama. Plan ve Harita masaüstü içindir; Saha mobil ve karanlık ortam içindir |
| 2 | Gece görüşü | Ayrı bir kırmızı gece teması vardır; karanlığa alışmış gözü bozmaz. Büyük yazı ve büyük dokunma alanları kullanılır. Ekranı açık tutma isteğe bağlıdır |
| 3 | Dünya rü'yet haritası | Her nokta, o yerin yerel gurûbunda kitabın beş sınıfından biriyle boyanır. Hilâl yaşı eş-yaş çizgileri, kullanıcının konumu ve 18° gurûb boylamı gösterilir. Yallop/Odeh katmanı ek bilgidir |
| 4 | İlk görünürlük haritası | Her bölgenin bu ay için ilk elverişli akşamı (beynûnet ≥ 8° ve irtifâ ≥ 5°) renklerle gösterilir. "Hesâbî en erken gün (dünya geneli)" ve "(bulunduğunuz yer)" haritada işaretlenir |
| 5 | Batı ufku çizimi | Zaman kaydırıcısı; 10 dakikalık işaretli ay yolu; kitabın penceresi ve 5° çizgisi; en iyi an; pusula yönleri; yumruk ve parmak ölçeği; yakındaki gezegenler ve parlak yıldızlar; alacakaranlık evreleri |
| 6 | Gözlem planı ve teknikleri | Çıkıştan önce ve sahada kontrol listesi; arama teknikleri; hilâlle karıştırılabilecek gök cisimleri; çıplak göz şartı |
| 7 | Rü'yet kaydı | "Gördüm / Göremedim" kaydı bir kullanıcı beyanıdır. Anında Sübkî (kesin red), 5° ve Kâdîhân kontrolleri yapılır. Şahitlik şartları hatırlatılır; program şahitliğin yerine geçmez |
| 8 | Açıklamalar talep üzerine | Her terim ve hükmün yanında bir "?" düğmesi bulunur. Bu düğme iki ayrı açıklama açar: Fıkhî esas (Se'âdet-i Ebediyye, Redd-ül-muhtâr) ve Bilimsel açıklama. Varsayılan olarak kapalıdır |
| 9 | Hiyerarşi | Kitabın sınıfları her ekranda ana bilgidir. Modern modeller ve takvim usulleri ayrı etiketle, ikinci planda kalır |

## 12. Zaman modeli ve gözlem yardımcıları

Arayüz iki zamanı birbirinden ayırır: **akşam değerlendirmesi** ve **seçili an**. Akşam değerlendirmesi hükme esastır; yalnızca bir tarihin gurûbunda yapılır ve kitabın sınıfları buradan gelir. Seçili an ise gözleme yardımdır; herhangi bir tarih ve saatte güneş ile ayın konumunu ve aramaya değip değmeyeceğini gösterir, hüküm vermez.

| Konu | Karar |
| --- | --- |
| Ortak zaman çubuğu | Sekmelerin üstünde sabit durur: tarih, 24 saatlik kaydırıcı, olay işaretleri, "Şimdi" (canlı mod). Plan ve Harita aynı anı kullanır; Saha her zaman canlıdır |
| "Sonraki gözlem gecesi" | İki seçenekli menü. Varsayılan **rasad gecesi**: bulunduğunuz yerde görülmesi mümkün ilk akşam (8° ≤ beynûnet, irtifâ ≥ 5°; s. 314–315). İkinci seçenek **en elverişli akşam**: kitaba göre "görülebilir" ilk akşam (≥ 18°). İkisi de aylık şeritte işaretlenir |
| Karanlık eşiği ("şu an aranabilir") | Kitap bir eşik vermediği için kullanıcı seçer. Seçenekler: gurûbdan sonra (varsayılan), güneş −3°, güneş −6° (sivil alacakaranlık sonu). Seçim anında şunları günceller: anlık haritadaki aranabilir bölge, seçili an durumu, zaman çubuğundaki aranabilir aralık ve saha modu. Kitabın penceresi (gurûb → 5°) bu seçimden etkilenmez |
| Aylık rü'yet şeridi | Ay boyunca her gün için akşam sınıfı, ayın evresi ve sabah hilâli gösterilir. Rasad gecesi ve en elverişli akşam işaretlidir; dokunulan gün seçilir |
| Seçili an kartı ve tam ufuk | Seçili anda güneş ve ayın konumu, ayın evresi, ayın doğuş-batış saatleri ve durum gösterilir. Ay batı penceresinde değilse 360° panorama açılır |
| Harita: zarif çizim | Sınıflar piksel düzeyinde, ara değerlerle belirlenir; sınırlar ince çizgilerle çizilir. Kullanıcı "tüm dünya" veya "yalnızca karalar" renklendirmesini seçer |
| Anlık harita | Seçili anda gece-gündüz sınırı, alacakaranlık kuşakları, güneş ve ayın tam tepede olduğu noktalar, ayın ufkun üstünde olduğu bölge ve şu an hilâl aranabilecek bölge gösterilir. Bir oynat düğmesiyle akşam boyunca izlenir |
| Sabah hilâli | İctimâdan önceki sabahlarda doğu ufkundaki son hilâlin görülebilirliği bilgi olarak gösterilir (Redd-ül-muhtâr, Remlî meselesi). Hüküm vermez |

**Arayüz kararları:**

1. Karanlık eşiği (kullanıcı seçimi): "Hilâli aramaya başlarken güneş ne kadar alçalmış olmalı?" — gurûb anı (varsayılan), −3° veya −6°. Eşik, güneş merkezinin havasız (geometrik) irtifâına göredir; gurûb = −0°50′. Bu seçim yalnızca "aranabilir aralık" gösterimini (zaman çubuğu, seçili an kartı, anlık harita, saha modu) anında değiştirir; kitabın sınıflarını ve kesin red hükmünü değiştirmez. Kitap aramaya başlamak için ayrıca bir derece vermez (s. 360).
2. Aranabilirlik (bir an için): güneş eşiğin altında, beynûnet ≥ 8°, hilâlin görünen irtifâı ≥ 5°, ictimâdan sonraki ilk 96 saat.
3. Ortak zaman modeli: tarih + gün içi dakika (00:00 → ertesi gün 03:00); Plan, Harita (anlık kip) ve kaydırıcılar aynı seçili ânı kullanır. "Şimdi" canlı kiptir (20 sn'de bir yenilenir); kaydırıcıya dokunmak canlı kipi kapatır.
4. Varsayılan seçili an: Yallop'un en iyi anı kitabın penceresi içinde ve aranabilir ise o; değilse pencere içindeki aranabilir aralığın ortası; o da yoksa gurûb. En iyi an pencereden sonra kalıyorsa durum kartında bu açıkça yazılır.
5. "Sonraki gözlem gecesi": A = rasad gecesi (ayın ilk mümkün akşamı, varsayılan), B = en elverişli akşam (ilk ≥ 18°). Seçilen türdeki gece o ayda geçmişse bir sonraki aya geçilir.
6. Seçili an batı penceresi dışında ise (veya ay ortasında) batı ufku yerine 360° panorama gösterilir; ictimâdan önceki sabahlar için sabah hilâli bilgisi verilir ve bunun yeni aya delil olmadığı belirtilir.
7. Harita: sınıflar piksel düzeyinde, ızgara değerlerinin ara değerinden (bilinear) bulunur; sınıf sınırları ince çizgiyle; yaş çizgileri sıklaştırılmış ızgaradan; isteğe bağlı "yalnızca karalar". Anlık kip: gece-gündüz sınırı, alacakaranlık gölgesi, ayın ufku, şu an aranabilir bölge, güneşin ve ayın tepede olduğu noktalar, oynatma.
8. Aylık rü'yet şeridi: her akşamın gurûb sınıfı, A/B işaretleri ve sabah hilâli işareti; dokununca o gün seçilir.

## 13. An çubuğu, hicrî tarih, çevrimiçi katman, gökyüzü haritası, baskı

**Hicrî tarih mantığı (kanonik):**

1. Kamerî gün şer'î gurûbda değişir: ezânî gün, iki şer'î gurûb arasındaki zamandır (s. 188). Seçili an gurûbdan sonraysa ertesi günün hicrî tarihi gösterilir.
2. Gün sayısı, her ay için hesâbî en erken günden sayılır (Zilhiccede Işık usulüyle bulunan birinci günden, s. 326); bu günden önce yeni ay başlamaz. İlk günde "1 \[yeni ay\] veya 29/30 \[eski ay\]", sonraki günlerde "n (veya n−1)" yazılır.
3. Ay adı ve yıl, ictimâya göre aritmetik takvimden alınır ve "hesâbî" diye işaretlenir. Muharrem'de yeni yıl yalnızca hilâl görülünce kesinleştiğinden, belirsiz günde eski yıl ile yeni yıl birlikte gösterilir ("1 Muharrem 1449 veya 29/30 Zilhicce 1448").

**Kip ayrımı:** Program açılışta "Şimdi" (canlı) kipindedir ve yaklaşan rü'yet kartını (rasad gecesi, en elverişli akşam, bugünün hicrî tarihi) gösterir. Kullanıcı bir tarih, saat veya gece seçince "Rü'yet planlaması" kipine geçilir: an çubuğu vurgu rengine döner, ilgili kartlar işaretlenir, durum kartında "Planlama" başlığı ve aranacak hilâlin adı yazılır. Saha sekmesi her zaman "şimdi"dir.

**Çevrimiçi katman (isteğe bağlı):** Astronomik hesapların hepsi internetsiz çalışır. Program, kullanıcı Ayarlar'dan açmadıkça internete bağlanmaz. Hava tahmini açılırsa Open-Meteo'dan alınır. Tahmin iki nokta içindir: gözlemci ve hilâlin battığı yönde yaklaşık 25 km ötesi; 5° yükseklikteki görüş hattı 2 km'deki bulut tabanını bu mesafede keser. Tahmin bulutu (toplam ve alçak), görüş mesafesini, nemi, yağış ihtimalini ve aerosol optik derinliğini (pus, toz) kapsar. Değerlendirme yalnızca hazırlık içindir; s. 315'teki bulutlu ve açık havada şehâdet farkı yanında hatırlatılır. Konum izni verilmişse konum otomatik alınır; rakım bilinmiyorsa Open-Meteo'nun yükseklik servisi kullanılır. claude.ai içinde dış bağlantı, konum ve doğrudan yazdırma kapalıdır; orada "Dosya olarak kaydet" ile programın tamamı çevrimdışı çalışan tek dosya olarak indirilir.

**Gökyüzü haritası:** Stereografik bütün gök; bakış yönü alta gelir, varsayılanı batıdır. Haritada 5° çemberi (s. 360), ekliptik, isteğe bağlı takımyıldız çizgileri ve adları, parlak yıldızlar, gezegenler, Ay'ın evresi ve güneşin ufuk altındaki yönü bulunur. Yıldız verisi d3-celestial'dandır (Hipparcos, BSD-3). Yönelim yardımcıları, hilâlin (ay ufkun altındaysa gurûb noktasının) çevresindeki en parlak cisimleri, hilâle göre sağ-sol ve yukarı-aşağı derece farkıyla verir.

**Saha ve okunurluk:** Beş tema vardır; Güneş altı teması yüksek kontrastlıdır. Yazı boyutu Normal, Büyük ve Çok büyük olarak seçilebilir. Gök çizimlerindeki etiketler koyu haleli açık renkle yazılır. Dar ekranda 360° panorama ve batı ufku yatay kaydırılabilir; panorama Ay'a odaklanarak açılır.

**Baskı / PDF:** Plan, Harita, Saha ve gökyüzü haritası için açık temada baskı sayfası üretilir. Sayfada konum, an, hicrî tarih, durum, çizimler, hava ve tablolar yer alır; altına "takvim değildir" notu düşülür. Tarayıcının yazdırma penceresi açılır ("PDF olarak kaydet"); sayfalar JPG olarak da kaydedilebilir. Dosya adları `MahiNev_tarih_saat_yer_tür` biçimindedir.

## 14. Şehâdetin belgelenmesi, zaman kipleri, sade arayüz

**Şehâdet ve haber (kanonik çerçeve):** Program hüküm vermez, haber ve belge üretir. Dayandığı hükümler şunlardır:

- **Se'âdet-i Ebediyye s. 315–316:**
  - Bulutlu havada bir âdilin "gördüm" demesi, açık havada birçok kimsenin haberi gerekir.
  - Kâdî bulunmayan yerde bir âdille Ramazân, iki âdille bayram olur.
  - Şevvâl için iki erkek veya bir erkekle iki kadın gerekir.
  - Hesap ve takvimle başlanmaz.
  - Hilâli görmekle başlama hesaptan bir gün önce olamaz.
- **Redd-ül-muhtâr, Kitâb-us-savm, hilâlin sübûtu bahsi:**
  - Ramazânda haber, bayramda şehâdet lafzı ve nisâb aranır.
  - Şehir dışında veya yüksek yerde görenin haberi kabul edilebilir.
  - Muvakkitlerin sözü delil değildir.
  - Başkasının gördüğünü nakletmek hikâyedir, şahitlik değildir.
  - Haberin yayılması, kimliği belli birkaç cemaatin gelip haber vermesidir; anonim söylenti muteber değildir.

Bu yüzden kayıt formunda şu alanlar vardır: gök durumu, gözlem yeri (şehir dışı, yüksek yer, şehir içi), birlikte gözleyen ve gören sayısı. Tutanakta imza satırları ve fıkhî hatırlatma bulunur. Önerilen ağda anonim kayıt yoktur; ilk el gözlem, heyet kararı ve nakil ayrı kayıt türleridir (bkz. sehadet-agi.md).

**Rü'yet kaydı `hilal-ruyet-kaydi/1`:**

- **Sonuç türleri:** çıplak gözle; dürbünle bulup çıplak gözle; yalnız optik; yalnız fotoğraf; görülmedi. Kitaba göre rü'yet çıplak gözle olur, diğerleri yardımcı bilgidir.
- **Hesâbî veriler** kayda program tarafından eklenir; hüküm değildir.
- **Bütünlük:** Kanonik JSON'un SHA-256 özeti çıkarılır. Cihaz anahtarı (ECDSA P-256, dışarı alınamaz) varsa özet imzalanır. İmza kimliği değil, değişmezliği ve kaynağı gösterir; kimlik ıslak imzalı tutanakla bağlanır.

**Zaman kipleri:**

- **Şimdi · canlı:** saat her saniye ilerler; paneller 1 sn, 10 sn veya 1 dk aralıkla tazelenir.
- **Şimdi · donduruldu.**
- **Rü'yet planlaması.**

Saha sekmesi her zaman "şimdi"dir.

**Ay başı rasadı gezintisi:** "Sonraki ay" düğmesi, seçili tarihten sonra gelen ilk ay başı rasad gecesine gider; o ayın rasad gecesi seçili tarihte ya da öncesinde kaldıysa bir sonraki aya geçer. "Önceki ay" düğmesi tersini yapar.

**Hicrî tarih:** Esas kapsam dünya genelidir (s. 315), Zilhicce'de yereldir. Yerel kapsam farklıysa "Burada" satırı eklenir.

**Yerleşim kararlılığı:** Durum kartı ve yaklaşan rasad kartı her kipte aynı satırları taşır. Dokunulan kartın ekrandaki yeri korunur.

**Hava tahmini** başlangıçta kapalıdır.

**Baskı:** Her çıktı tek A4 sayfasıdır:

- rasad planı;
- gökyüzü haritası;
- aylık çizelge;
- dünya haritası (yatay);
- tutanak ve boş tutanak.

**Yayın:** Program, belgeler, kayıt şeması, Python doğrulayıcısı ve testler github.com/bemiroglu/MahiNev deposunda yayımlanır. Lisans: CC BY-NC-ND 4.0.

## 15. Şafak iki kavli, "Tam İlmihâl" adı, rehberlik ilkesi, konum girişi

**Şafak hakkında Tam İlmihâl ne diyor?**

- **s. 178, yatsı vakti:**
  - İmâmeyn'e göre yatsı, işâ-i evvelden, yani batıdaki kırmızılık kaybolunca başlar. Diğer üç mezhepte de böyledir.
  - İmâm-ı a'zam'a göre işâ-i sânîden, yani beyâzlık kaybolunca başlar.
  - Kırmızılığın kayboluşu, güneşin üst kenârının üfk-ı sathînin 17° altına indiği vakittir; 19°'ye inince beyâzlık kaybolur.
- **s. 194:** "İkindiyi ve yatsıyı, İmâm-ı a'zamın kavline göre kılmak ihtiyâtlı olur."
- **s. 244 (Halebî'den):** Beyâzlığın kaybolmasını beklemek efdaldir. İmâmeyn kavline göre okunan ezânla cemâ'at câizdir.
- **s. 197, hesap usulü:** Önce güneş merkezinin hakîkî ufka göre irtifâından hakîkî vakit bulunur; buna temkin eklenerek şer'î vakit elde edilir (İstanbul için yaklaşık 10 dakika).
- **s. 316:** Kâdîhân kuralı. Kitap bu kural için hangi şafağın kastedildiğini ayrıca söylemez.

**Karar:** Kâdîhân kontrolünde, kitabın ihtiyâtlı saydığı İmâm-ı a'zam kavli (−19°) esastır. İmâmeyn kavli (−17°) alternatif olarak sonucuyla birlikte gösterilir; iki kavil farklı sonuç verirse açıkça yazılır. Şafak vakitleri s. 197 usulüyle (hakîkî vakit + temkin) hesaplanır. İmâmeyn kavlinin dayanağı s. 178’dir.

**Adlandırma:** Arayüzde kaynak "kitap" yerine "Tam İlmihâl" adıyla anılır.

**Rehberlik (ana tasarım ilkesi):**

- İlk açılışta "Nasıl kullanılır?" kartı görünür.
- Her kartın başında tek cümlelik bir açıklama vardır: ne, neden, fıkhî dayanak.
- Tecrübeli kullanıcı açıklamaları Ayarlar'dan kapatır.

**Konum girişi:** Program şu biçimleri anlar ve standart biçime çevirir:

- ondalık virgül veya nokta;
- K/G/D/B ve N/S/E/W;
- derece-dakika-saniye ve ondalık dakika;
- işaretli değer;
- çift giriş ve harita bağlantısı.

Yarım küre yazılmazsa arz Kuzey, tûl Doğu kabul edilir. Tûl yanlış alana yazılırsa tûl alanına taşınır.

**Saha şeridi:** Saat, sıradaki olaya geri sayım ve akşam çubuğu sayfa kaydırılsa da görünür kalır.

**Kutup bölgeleri:** Kutup gecesi ile güneşin batmadığı günler ayrılır. Kitabın s. 315'teki notu hatırlatılır: yirmidört saatten uzun günlerde oruç için gündüzü böyle uzun olmayan bir şehrin zamanına uyulur.

## 16. Kapsam, doğruluk, kayıt ve dağıtım ilkeleri

Ölçü Tam İlmihâl'dir. Aşağıdaki ilkeler, programın bağımsız bilimsel, fıkhî ve teknik incelemesinde tartışılarak kabul edilmiştir.

**Ad ve dağıtım.**

- Programın adı: "Mâh-ı Nev — Hilâl Rasad Yardımcısı". Yayın deposu: github.com/bemiroglu/MahiNev.
- Lisans: CC BY-NC-ND 4.0. Değiştirilmiş kopyalar dağıtılamaz.
- Program açılışta kendi bütünlüğünü denetler; değiştirilmiş dosyada "değiştirilmiş kopya" uyarısı çıkar.

**Hesap, rasad ve hüküm.**

| Konu | İlke | Dayanak |
|---|---|---|
| Hicrî tarih | Hesâbî gösterilir ve "rü'yetle kesinleşir" notu taşır. Yanında kitabın hükmü yazar: "Hilâli görmekle Ramezânın başlaması, hesâbla anlaşılandan bir gün sonra olabilir. Fekat bir gün önce olamaz." "n (veya n−1)" gösterimi bu hükmün karşılığıdır | s. 360 (Sübkî bahsi). s. 326'daki "Bayramın birinci günü bu hesâb ile bulunan gündür…" cümlesi Işık usulü hesabına aittir; astronomik gösterim için ona atıf yapılmaz |
| Kesin red | Kitabın hükmüdür: "hesâba inanılır, çünki hesâbla anlaşılan kat'îdir" (İmâm-ı Sübkî). Metin hükmü kitaba dayandırır; beyanı değerlendirmenin yetkili makama ait olduğunu söyler | s. 315–316, 360 |
| Dünya geneli | Aynı takvim gününün en geç gurûbu tarih çizgisinin hemen doğusundadır. Arama orada, kutup daireleri arasında (±66°) yapılır; bütün dünya ızgarasıyla aynı günü verdiği `tools/kuresel_dogrulama.py` ile sınanır. Kapsam Ay kartında yazılır | Hanefî'de ihtilâf-ı metâli' muteber değildir (s. 315) |
| Olumsuz kayıtlar | "Göremedim" ve "gözlem yapılamadı" ayrı tutulur. Hiçbiri tek başına ayın otuza tamamlandığını ilan etmez | s. 314–315 |
| Şahitlik bilgileri | Görme beyanında gören kişi en az 1 olmalıdır; ilk görme saati son görme saatinden sonra olamaz. İsimsiz beyan "şahitlik tutanağı yerine geçmez" diye işaretlenir | s. 315–316 |
| Şehrin en yüksek yeri | Girilmediğinde bu açıkça yazılır: şer'î gurûb ve temkin bu yükseklik olmadan hesaplanır | s. 176, 186 |

**Doğruluk.**

- Yerel saat → UTC dönüşümü, saat farkını aranan ânın kendisinde alır; yaz saati geçişleri test edilir.
- Yallop (1997): ARCL ve ARCV jeosentrik, W' = SD' (1 − cos ARCL). Odeh (2004): toposentrik. Doğrulama örneği: İstanbul, 10.12.2026 için q = 0,1149.
- Hesap hassasiyeti ile gözlem hassasiyeti ayrıdır: ufuk yakınında kırılma değişkendir; batış saatleri gerçekte 1–2 dakika farklı olabilir. Pusula yaklaşık yön verir.

**Kayıt bütünlüğü.**

- Mühür (SHA-256 özeti ve cihaz imzası), saklanacak son içeriğe vurulur.
- Kayıt saklanamazsa açık hata verilir ve kayıt dosya olarak indirilir.
- Kayıtlar yedeklenip geri yüklenebilir; özgün fotoğraf, özetiyle kayda bağlanabilir.
- Her kayıt; astronomi çekirdeğini, kural kümesini (`TI-360/1`) ve modern model tanımlarını taşır.

**Güvenlik ve gizlilik.**

- Göz güvenliği uyarısı Plan sekmesinde her zaman, Saha sekmesinde Güneş ufkun üstündeyken görünür.
- Program, kullanıcı açmadıkça internete bağlanmaz. Hava tahmini ve internet yazı tipleri Ayarlar → *İnternet bağlantıları ve izinler* bölümünden açılır. Otomatik konum internet kullanmaz; konum cihazdan çıkmaz.

## 17. Kongre tebliği (2016): kullanılan bilgiler

Kaynak: Bölüm 1'deki tebliğ (Uluslararası Kamer Aybaşları ve Hicrî Takvîm Birliği Kongresi; [PDF](https://www.turktakvim.com/pdf/HilalKongreTR.pdf)). Tebliğin 2-d kısmı büyük ölçüde Tam İlmihâl s. 315–316, 326 ve 360'taki metindir; o kısımlarda kitabın sayfası gösterilir. Aşağıdakiler kitap metnimizde bulunmayan ve açıklamalarda kullanılacak bilgilerdir (sayfa: tebliğin sayfası).

| Bilgi | Tebliğ | Programdaki yeri |
|---|---|---|
| Bakara 189; "Ayı görünce oruc tutunuz…" ve "Şa'bânı otuza tamamlayın" hadîsleri (Buhârî, Müslim, Nesâî, Dârimî, Muvatta, Müsned) | s. 3 | Rehber: Naklî deliller |
| Mecelle md. 14: "Mevrid-i nassda ictihâda mesağ yoktur"; icmâ' kaydı (*Tebyîn-ül-hakâık*, *İ'ânet-ut-tâlibîn*) | s. 3 | Rehber: Naklî deliller |
| İbni Âbidîn, kıble bahsi (c. 1 s. 289): hilâl hesabın bildirdiği gece doğar, o gece görülmeyip ertesi gece görülebilir; oruca görüldüğü gece başlanır | s. 3–4 | Açıklama penceresi, Rehber: Naklî deliller |
| *Mecmû'a-i Zühdiyye*: Şevvâl hilâlini yalnız gören iftar edemez | s. 4 | Açıklama penceresi (Şevvâl) |
| Elmalılı Hamdi ve Fatin Gökmen (*Sebîl-ür-reşâd* c. 22): şer' rü'yete bağlamıştır; hesaba aykırı şahitlikte iki şahitle yetinilmemesi daha meşrûdur | s. 4–5 | Rehber: Naklî deliller |
| Prof. Hamit Dilgan (İTÜ, 17.6.1963): görülme imkânı ile bilfiil görülme ayrı tutulmalıdır | s. 5 | Rehber: Naklî deliller; açıklama penceresi |
| Kazâ: Şa'bân rü'yetle başlamış ve 29. gece bayram hilâli görülmüşse bir gün, başlamamışsa iki gün (*Hindiyye*, *Kâdîhân*) | s. 7 | Açıklama penceresi (Şevvâl) |
| Görenin kâdîya haber vermesi vâcibdir; kâdî/vâlî olmayan yerde âdil birinin haberiyle duyanlar oruca başlar (*Redd-ül-muhtâr*) | s. 7 | Rü'yet kaydı: bildirim ekleri (`hilal-bildirim/1`) |
| USNO: çıplak gözle en erken güvenilir rü'yet ictimâdan 15,5 saat, teleskopla 12,1 saat sonra; görünürlüğü etkileyen etkenler | s. 8, 10–11 | Rehber: Naklî deliller (ayrıntı) |
| İbrânî takviminde ay başlarının rü'yet ve şahitle tespiti; rasıd adı, yeri ve saatiyle kayıt | s. 8–9 | — |
| **Receb 1437:** 7 Nisan 2016 akşamı hiçbir yerde görülmedi, 8 Nisan'da görüldü; ay 9 Nisan'da başladı (takvimlerde 8 Nisan) | s. 9 | Doğrulama testi; açıklama penceresi örneği |

**Receb 1437 hesabı (program).** İctimâ 7.4.2016 11:24 UT. 7 Nisan akşamı İstanbul'da beynûnet 4,0° (kesin red); Mekke 3,6°, New York 7,7°; yalnız Meksika–Hawaii hattında 8,6°–10,8° (mümkün). Dünya geneli en erken gün 8 Nisan; rü'yetle başlama 9 Nisan. "Bir gün sonra olabilir, önce olamaz" hükmünün (s. 315) uygulamadaki karşılığıdır: ay, iki ihtimalin ikincisinde başlamıştır.

