# Mâh-ı Nev — Kullanım kılavuzu

## Başlarken

`dist/mahinev.html` dosyasını (veya programdaki **⬇ HTML’yi indir** düğmesiyle) indirip bir tarayıcıda açın. Program internetsiz çalışır. Konum izni verirseniz konum otomatik alınır; vermezseniz şehri listeden seçin veya enlem, boylam ve rakımı elle girin.

Program açıldığında **Şimdi** kipindedir:

- Üstteki sabit **an çubuğu** saati, miladî tarihi ve hicrî tarihi gösterir.
- **Yaklaşan ay başı rasadı** kartı bugünün hicrî tarihini, sıradaki rasad gecesini ve aynı ayın en elverişli akşamını verir. Bu akşamın arama penceresi geçince kart bir sonraki aya geçer. **Önceki hilâl rasadı** kutusu son ay başı gecesini gösterir; "O geceyi aç" ile o akşama gidilir.

## Konum nasıl yazılır?

Arz (enlem) ve tûl (boylam) yaygın her biçimde yazılabilir; program anladığını standart biçimde geri yazar ve altında derece-dakika-saniye karşılığını gösterir.

| Yazdığınız | Anlaşılan |
|---|---|
| `41,0082` veya `41.0082` | 41,0082° Kuzey (yarım küre yazılmazsa arz Kuzey, tûl Doğu kabul edilir) |
| `41.0082 K` · `N41.0082` · `41,0082 kuzey` | 41,0082° Kuzey |
| `33,87 G` · `-33.87` | 33,87° Güney |
| `41°00'29,5"N` · `41 0 29,5 K` · `41 0,49 K` | 41,0082° Kuzey (derece-dakika-saniye veya ondalık dakika) |
| `73,98 B` · `73.98W` | 73,98° Batı |
| `41.0082, 28.9784` · `41,0082 28,9784` | Arz ve tûl birlikte; iki alan da doldurulur |
| Harita bağlantısı (`…@41.0082,28.9784,15z`) | Arz ve tûl birlikte |
| Arz alanına `28.97 E` yazılırsa | Tûl olarak anlaşılır ve tûl alanına taşınır |

Rakım için `40`, `40,5`, `40 m` veya `1.054` yazılabilir; sonuncusu 1054 m olarak anlaşılır.

## Üç zaman kipi

| Kip | Nasıl girilir | Ne olur |
|---|---|---|
| **Şimdi · canlı** | Açılışta; an çubuğunda "▶ Canlı" | Saat ilerler. Paneller Ayarlar'da seçilen aralıkta tazelenir: her saniye, 10 saniyede bir veya dakikada bir. |
| **Şimdi · donduruldu** | An çubuğunda "❚❚ Dondur" | Şimdiki an sabitlenir; ekran değişmez. "▶ Canlı" ile devam edilir. |
| **Rü'yet planlaması** | Bir tarih, saat, gece veya şerit kutusu seçilince | An çubuğu turuncuya döner, kartlarda "Planlama" etiketi görünür. "↺ Şimdiye dön" ile çıkılır. |

**Üst banttaki gezinme düğmeleri** her sekmede görünür:

- **◀ ▶** bir gün geri veya ileri gider (planlama kipine geçilir).
- **↶ Geri** önceki seçime döner; **İleri ↷** geri alınanı yeniden getirir. Gün ve gece düğmeleri, şerit, "Bu geceyi planla", gurûb ve en iyi an düğmeleri ve **Şimdi** dahil her atlama geri alınabilir. Örneğin bir akşamı planlarken "Şimdi"ye dokunduysanız ↶ ile planladığınız akşama dönersiniz.
- Zaman çubuğu gece yarısından sonra ertesi sabah 03:00'e kadar sürer. Bu saatlerde seçili an ertesi günün sabahıdır, fakat gece önceki akşamın gecesi olarak gösterilir; Akşam kartında bu ayrıca yazılır. Ufuk kartındaki −10′ / +10′ düğmeleri gece yarısında (ve 03:00'te) güne geçer.

Sayfada bir şeye dokunduğunuzda okuduğunuz kart yerinde kalır; yeni bilgiler sayfayı kaydırmaz.

## Plan sekmesi

1. **Konum** ve **Akşam** kartları (solda): yer, akşamın tarihi, "◀ Önceki gün", "Bugünün akşamı", "Sonraki gün ▶".
2. **Durum kartı:**
   - Tam İlmihâl'e göre sınıf ve rü'yet beyanı;
   - **Ay başı:** ayın 1. gününün iki ihtimali (örneğin "1 Receb: 10 Ara Per veya 11 Ara Cum"), birinci ve ikinci gecenin tarihleriyle;
   - Tam İlmihâl'e göre arama penceresi (gurûb → hilâl 5°);
   - Yallop önerisi (ek bilgi). Bu an pencereden sonraya düşüyorsa kartta açıkça yazılır.
3. **Seçili an:**
   - 00:00'dan ertesi gün 03:00'e kadar süren zaman çubuğu;
   - "bu anda hilâl aranabilir mi, neden?" sorusunun cevabı;
   - güneş ve ay konumu, evre, sabah hilâli;
   - **Gök cisimleri** (bkz. aşağıda).
4. **Batı ufku / bütün ufuk:**
   - Seçili an batı penceresindeyse hilâlin yeri yumruk ölçeğiyle çizilir; değilse 360° ufuk gösterilir. Telefonda ufuk yana kaydırılabilir.
   - "✦ Gökyüzü haritası" bütün gökyüzünü açar.
   - Yönelim için yardımcı cisimler hilâle göre konumlarıyla verilir.
5. **Aylık rü'yet şeridi:** her akşamın sınıfı; A rasad gecesi, B en elverişli akşam, "s" sabah hilâli.
6. **Hava ve görüş:** Ayarlar'dan açılır (başlangıçta kapalıdır). İnternet gerekir.

## Hicrî tarih nasıl okunur?

- Kamerî gün **şer'î gurûbda** değişir (s. 188).
- Tam İlmihâl'e göre hilâl, hesâbın bildirdiği gecede doğar; o gece görülmeyip bir gece sonra görülebilir (s. 360). Rü'yetle başlama hesapla anlaşılandan bir gün sonra olabilir, önce olamaz (s. 315). Bu yüzden her ayın 1. günü iki günden biridir ve hicrî gün iki sayıyla yazılır: "3 Receb 1448 (veya 2)". Ayın ilk gününde "1 Receb 1448 veya 29/30 Cemâziyelâhır 1448" yazılır.
- **Neden iki sayı:** Hangi sayının hangi güne bağlı olduğu yanında yazar: "1 Receb 10 Ara Per ise 3, 11 Ara Cum ise 2".
- Yeni hicrî yıl da Muharrem hilâli görülünce başladığından, o gün eski ve yeni yıl yan yana yazılır.
- Esas alınan kapsam **dünya genelidir**, çünkü bir şehirde görülünce her yerde lâzım olur (s. 315). Zilhiccede şahitle sabit olmayan yerlerde Işık usulü esastır (s. 326).
- **Takvim usulleri:** Ay kartında Işık usulü (s. 359), Uluğ Beğ cetveli (s. 361–362), Ebüzziyâ / Kindî cetveli (s. 361), Madde 88 (s. 359) ve aritmetik (tabular) takvimin (s. 358) sonuçları gösterilir. Her birinin yanındaki **?** düğmesi usulün nasıl çalıştığını kısaca anlatır. Bunlar takvim bilgisidir; ay başı rü'yetle kesinleşir.

## Kullanım düzeyi

Üst çubuktaki **Düzey** seçimi (Ayarlar'da da var) programın yoğunluğunu değiştirir; hesap aynıdır:

- **Başlangıç:** Seçili akşamın değerlendirmesi öne gelir ve bir **kısa cevap** verir: bu akşam bakılacak mı, saat kaçtan kaça, hangi yöne, gurûb noktasının kaç yumruk sağında veya solunda, ufkun kaç yumruk üstünde. Diğer kartlar katlı başlar.
- **Deneyimli:** Ayrıca irtifâ, semt, beynûnet, hilâl yaşı, Kâdîhân kontrolü ve aylık şerit açık başlar.
- **Uzman:** Bütün kartlar açık başlar; "Ek bilgiler" kutusunda toposentrik ve jeosentrik değerler, Yallop ve Odeh parametreleri ve **ham veri** dışa aktarımı (bu akşam için JSON, ayın akşamları için CSV) bulunur.
- **Tüm düzeyler** (varsayılan): her şey görünür; kartların açık veya katlı başlaması "Görünüm" (sade/tam) ayarına göredir.

Hiçbir düzeyde kart gizlenmez; katlı kart başlığına dokununca açılır. Tam İlmihâl'in hükmü (sınıf, kesin red, arama penceresi, rü'yet beyanı) her düzeyde görünür. A4 çıktıları düzeyden etkilenmez.

**Yallop önerisi:** Yallop ölçütünün önerdiği an modern ek bilgidir. Tam İlmihâl'in vakitlerinden sonra, küçük olarak "Yallop önerisi (ek bilgi)" adıyla gösterilir; Tam İlmihâl penceresinden sonraysa bu ayrıca yazılır. Başlangıç ve Deneyimli düzeylerde Saha ve değerlendirme kartında görünmez; "Ek bilgiler" kutusunda her zaman bulunur.

## Ay başından ay başına geçmek

Plan sekmesinde, seçili akşamın değerlendirmesinin hemen üstünde üç düğme vardır:

- **◀ Önceki ay başı** ve **Sonraki ay başı ▶:** seçili akşamı bir önceki veya bir sonraki kamerî ayın rasad gecesine götürür. Yanındaki seçimle rasad gecesi (ilk mümkün akşam) veya en elverişli akşam (≥ 18°) seçilir. Altında seçili akşamın hangi ayın rasad gecesi olduğu yazar.
- **☰ Rasad geceleri:** 13 kamerî ayın listesini açar. Her satırda ayın hesâbî adı, ictimâ anı, bu yer için rasad gecesi (hesâben ilk mümkün akşam) ve en elverişli akşam, ayın 1. gününün iki ihtimali bulunur. Tarihe dokununca o akşam planlanır; "Açıkla" o akşamın açıklama penceresini açar. "Önceki/Sonraki 12 ay" ile listede ilerlenir. Aynı liste "Yaklaşan ay başı rasadı" kartından da açılır.

Listedeki tarihler hesâbîdir; ay başı rü'yetle kesinleşir ve hesapla bulunan günden önce olamaz (s. 315).

## "Bu akşam ne demek?" açıklama penceresi

Plan sekmesindeki değerlendirme kartında, Saha sekmesinde ve "Yaklaşan ay başı rasadı" kartında **ⓘ Bu akşam ne demek?** düğmesi bulunur. Pencere, seçili akşam ve yer için şunları Tam İlmihâl'in sayfalarıyla açıklar:

- **Bu akşam burada:** hilâlin Tam İlmihâl'e göre sınıfı ve "gördüm" beyanının durumu.
- **Ay başı: iki gece.** Hilâl, hesâbın bildirdiği gecede doğar; o gece görülmeyip bir gece sonra görülebilir (s. 360). Rü'yetle başlama hesapla anlaşılandan bir gün sonra olabilir, önce olamaz (s. 315). Pencere ayın 1. günü için iki kutu gösterir: "1 Receb = 10 Aralık" (birinci gece, 9 Aralık akşamı görülüp sabit olursa) ve "1 Receb = 11 Aralık" (ikinci gece). Zilhiccede iki gün Işık usulüyle bulunan gün ve bir gün sonrasıdır (s. 326); Kurban bayramının iki ihtimali de yazılır.
- **Bugün:** seçili günün kamerî günü, tarihlerle: "3 Receb (1 Receb 10 Aralık ise) veya 2 Receb (11 Aralık ise)".
- **Önceki ay:** Ay 29 günden kısa, 30 günden uzun olmaz (s. 315). Önceki ayın iki ihtimalinden biri bu ayın 1. gününü kesinleştirir, diğeri rü'yete bırakır; pencere bunu iki kısa cümleyle yazar.
- **Akşam tablosu:** önceki akşam (görülemez; beyan kabul edilmez), birinci gece ve ikinci gece; her biri için bu yerdeki sınıf, dünyada mümkün ve görülebilir olduğu bölgeler, hilâl o akşam görülüp sabit olursa ayın 1. günü. Tarihe dokununca o akşam planlanır.
- **Sizin rü'yetiniz:** Birinci veya ikinci gece için "gördüm" kaydınız varsa bu rü'yete göre ayın 1. günü tek cümleyle yazılır. Kayıt şahitlik yerine geçmez (s. 315).
- **Kapsam ve hüküm:** ayın adına göre (Ramezân, Şevvâl, Zilhicce) Tam İlmihâl'in hükümleri. Kâdîhân ölçüsü (s. 316) "bu akşam hilâl görülürse … gecenin hilâlidir" diye bilgi olarak verilir; program ay başını buna göre seçmez.

Pencere hesâbî imkânı anlatır; hüküm, şahitlik şartlarıyla yetkili makamca verilir (s. 315). Deliller için Rehber'de **Naklî deliller** konusuna bakın.

## Gök cisimleri (seçili an)

"Seçili an" kartının altındaki bu bölüm, rasad günleri dışında da gökyüzünü incelemek için bir gözlem aracıdır. Zaman çubuğu, gün okları ve ↶ / ↷ ile birlikte çalışır.

- **Gösterilenler:** Güneş, Ay, yedi gezegen ve 32 parlak yıldız. "Göster" seçimiyle şu an görülebilenler, Güneş–Ay–gezegenler veya hepsi listelenir.
- **Sütunlar:** yön ve yükseklik, durum (görülebilir, gökyüzü aydınlık, ufka çok yakın, ufkun altında, Güneş'e çok yakın), seçili günün doğuş–tepe–batış saatleri, kadir. Deneyimli düzeyde takımyıldız; Uzman düzeyde sağ açıklık ve dik açıklık, Güneş'e açı ve uzaklık da görünür.
- **Alacakaranlık:** güneş doğuşu ve batışı, sivil, denizci ve astronomik alacakaranlık sınırları.
- **Bu gece:** Ay ve gezegenlerin çıplak gözle görülebileceği aralık ve en yüksek oldukları an. Bir öğeye dokununca seçili an o saate gider.
- **Görünürlük temkinli bir tahmindir:** güneşin yüksekliğine, cismin parlaklığına ve ufka yakınlıkta sönükleşmeye göre hesaplanır; hava, ışık kirliliği ve gözün karanlığa alışması hesaba katılmaz.
- **Kutup bölgeleri:** Güneşin doğmadığı veya batmadığı günlerde araç bütün günü tarar ve güneşin en yüksek veya en alçak yüksekliğini yazar. Şafağın bitmediği yaz gecelerinde "astronomik gece olmuyor" yazılır.
- Ay başı rasad akşamlarında kart hilâle odaklanır ve bu bölüm kapalı başlar; diğer günlerde kartın adı "Seçili an: gökyüzü ve gök cisimleri" olur ve bölüm açık başlar.

Güneş'e asla doğrudan veya dürbünle bakmayın.

## Dünya haritası

Harita, her yerde o yerin kendi gurûbunda hilâlin Tam İlmihâl'e göre durumunu gösterir. Hesâbî imkândır; ay başı rü'yetle kesinleşir.

- **Katman:** Tam İlmihâl sınıfları (ana katman), ilk görünürlük akşamı, Yallop ve Odeh (ek bilgi).
- **Akşamlar:** "Seçili akşam" veya "Üç gece yan yana": önceki akşam, birinci gece ve ikinci gece. Ayın 1. günü, birinci gecenin ertesi günü veya bir gün sonrasıdır; önce olamaz (s. 315). Üç gece görünümünde ◀ ▶ okları ay değiştirir.
- **Tam İlmihâl ölçü çizgileri:** beynûnet 8° (kırmızı; altı kesin red), beynûnet 18° (yeşil; üstü görülebilir), gurûbda irtifâ 5° (turuncu, kesikli), gurûbda ay ufukta (noktalı). Bu çizgiler Yallop ve Odeh katmanlarında da çizilir; böylece ek bilgi, Tam İlmihâl'in ölçüleriyle karşılaştırılarak okunur.
- **İlk mümkün / ilk görülebilir yer (◆):** O akşamın haritasında gurûbu en erken olan mümkün (sarı) ve görülebilir (yeşil) nokta. Harita notunda yeri, gurûb saati (yerel ve UT) ve beynûneti yazılır.
- **Değer çizgisi (ek bilgi):** beynûnet, gurûbda irtifâ, hilâl yaşı, gurûbdan 5° irtifâya kadar geçen süre, gurûbdan ayın batışına kadar geçen süre, ARCV veya hilâl kalınlığı.
- **Görünüm:** kesin redde tarama, 18° gurûb boylamı, şehirler (seçili dilde), enlem-boylam ağı (20°), ülke sınırları, kabartma, renkleri yalnızca karalarda gösterme. Seçimler hatırlanır.
- **Tıklanan yer:** Haritada bir noktaya dokununca o yerin sınıfı, gurûbu, beynûneti, irtifâı, 5° penceresi ve ek bilgiler (ARCV, DAZ, kalınlık, aydınlık oran, Yallop q, Odeh V) yazılır; "Bu konumu kullan" ile Plan o yere geçer.
- **⤓ PNG kaydet:** Harita başlık, açıklama, lejant ve kaynak satırıyla seçili dilde resim olarak kaydedilir. Üç gece görünümünde üç harita alt alta tek resimdir.
- **Yazdır:** "Dünya haritası (yatay)" tek sayfa; "Dünya haritası: üç gece" her geceyi ayrı yatay A4 sayfasına koyar.
- **Çıktılarda dil ve kaynak:** PNG, PDF ve JPG çıktılarının başlığı, açıklaması, lejantı ve kenar yazıları seçili dildedir ve Tam İlmihâl'in terimlerini kullanır. Harita ve gökyüzü resimlerinin içinde, yazıları örtmeyen bir köşede küçük bir "Mâh-ı Nev · bemiroglu.github.io/MahiNev" satırı bulunur.

Plan sekmesindeki **Ek bilgi** bölümünde "Hilâl verileri (gurûb anı)" tablosu vardır: ictimâ (yerel ve UTC), hilâl yaşı, Güneş'in ve Ay'ın azimut / irtifâı, jeosentrik ve topozentrik beynûnet, DAZ, ARCV, hilâl kalınlığı, ayın yarıçapı (SD) ve ufkî paralaksı (HP), uzaklığı, aydınlık oranı, batışı ve 5° penceresi.

## Büyük ekran ve PDF

Hazırlık için büyük bir ekran (bilgisayar veya tablet) tavsiye edilir. Sahada telefon ekranı küçük kalır. Rasad planını ve akşamın gökyüzü haritasını önceden **⎙ Yazdır → PDF** ile kaydedip yanınıza alın; internetsiz ve tek bakışta okunur.

## Kâdîhân kontrolü ve şafak

- Kâdîhân kuralına göre hilâl şafaktan sonra batarsa ikinci gecenin, önce batarsa birinci gecenin hilâlidir (s. 316).
- Tam İlmihâl yatsı vakti için iki kavli bildirir (s. 178):
  - İmâmeyn: kırmızılığın kayboluşu, −17°;
  - İmâm-ı a'zam: beyâzlığın kayboluşu, −19°.
- Tam İlmihâl, İmâm-ı a'zam kavline göre kılmanın ihtiyâtlı olduğunu söyler (s. 194). Bu yüzden program −19°'yi esas alır ve −17° sonucunu yanında gösterir.
- Şafak vakti, hakîkî vakte temkin eklenerek bulunur (s. 197).

## Saha sekmesi (telefon)

- **Şerit:** Sayfa kaydırılsa da üstte kalır. Saati, sıradaki olaya geri sayımı ve ince akşam çubuğunu gösterir.

- **Büyük satır:** "Aramaya 1 sa 12 dk kaldı", "Hilâl şimdi aranabilir" veya "Bu akşamın arama penceresi bitti".
- **Akşam çizelgesi:** gurûb, pencere, aranabilir aralık ve şimdiki an.
- **Geri sayımlar:** gurûb, en iyi an, 5° anı, ay batışı.
- **Gök görünümü** canlı kipte şimdiki an içindir; bakılacak yer yazıyla da verilir.
- **Önizleme:** Plan'da bir akşam planladıysanız (örneğin "Bu geceyi planla"), Saha o akşamın seçili anını **önizleme** olarak gösterir; üstte "Önizleme (planlama)" şeridi ve **Şimdiye dön** düğmesi bulunur. Rü'yet kaydı formu her zaman gerçek saati kullanır.
- **Araçlar:** gece modu (kırmızı), ekranı açık tutma, pusula, gökyüzü haritası, "Konumum", yazı büyütme.
- **Pusula:** Dokununca bir kadran açılır. Kadranın üstü baktığınız yöndür; hilâl, Güneş ve gurûb noktası kadranda gösterilir. Yazı, hedefe kaç derece sola veya sağa döneceğinizi ve hilâlin ufuktan kaç derece (kaç yumruk) yukarıda olduğunu söyler. Gurûbdan önce hedef gurûb noktasıdır, sonra hilâldir. Telefon düzken üst kenarın, dik tutulunca arka kameranın yönü alınır.
- **Pusulayı ayarlama:** Manyetik pusula gerçek kuzeyden birkaç derece sapar; araç ve demir yakınında daha çok şaşar. Güneş batarken telefonu Güneş'e (battıktan sonra gurûb noktasına) çevirip **Güneşle ayarla** düğmesine dokunun; program farkı hesaplayıp düzeltir. Ayar altı saat geçerlidir. Güneşe dürbün veya kamerayla bakmayın.
- Algılayıcı çalışmıyorsa (masaüstü tarayıcı, bazı tarayıcılarda dosyadan açılan sayfa) kadran kuzeyi yukarıda gösterir ve yönler yazıyla verilir. Programı çevrimiçi adresinden açmak çoğu zaman sorunu giderir.
- Ayarlar'daki **Güneş altı** teması parlak ışıkta en yüksek kontrastı verir.

## Rü'yet kaydı ve tutanak

1. Saha sekmesinde formu doldurun:
   - kayıt zamanı (ait olduğu akşam otomatik bulunur);
   - sonuç, ilk ve son görme saati;
   - gök durumu, gözlem yeri;
   - ad ve iletişim, birlikte gözleyen ve gören sayısı, fotoğraf, not.
2. "Kaydı oluştur" düğmesine basın. Program şunları yapar:
   - hesâbî karşılaştırma verilerini ekler;
   - SHA-256 özetini hesaplar;
   - ortam izin veriyorsa kaydı cihaz anahtarıyla imzalar.
3. Listede her kayıt için şu düğmeler vardır:
   - **Tutanak (A4):** basın; gözlemci ve birlikte gözleyenler imzalasın; yetkili kişiye elden verin.
   - **✉ Bildirim ekle:** kaydı kime, ne zaman ve nasıl bildirdiğinizi yazın (gören kimsenin bildirmesi vâcibdir). Kayıt mühürlü kalır; bildirim kayda bağlı, ayrıca imzalı bir ek olarak saklanır ve tutanakta "Bildirildi" satırına yazılır. İleride bir hilâl gözlem bildirim ağı kurulursa bildirimler bu biçimle oraya gönderilebilecek.
   - **JSON:** ağlara ve heyetlere gönderilecek dosya.
   - **Metni kopyala:** WhatsApp veya e-posta ile hızlı ilk haber.
   - **Sil.**
4. **Görmedim** kayıtları da önemlidir: otuz günü tamamlamaya delil olur.

## Yazdır / PDF

An çubuğundaki "⎙ Yazdır / PDF" düğmesi bir seçim penceresi açar. Her seçenek **tek A4 sayfasına** göre hazırlanır:

- rasad planı;
- gökyüzü haritası (seçili an): bütün gök;
- gökyüzü haritası (seçili akşam): batı göğü, hilâlin gurûbdan ay batımına kadar yeri ve akşam çizelgesi (saat, Güneş'in ve hilâlin irtifâı, gurûb noktasına göre yön);
- aylık çizelge;
- dünya haritası (yatay);
- dünya haritası: üç gece (her gece ayrı yatay sayfa);
- tutanak veya boş tutanak formu.

Tarayıcının yazdırma penceresinde "PDF olarak kaydet" seçilebilir; sayfalar JPG olarak da kaydedilebilir.

## Ayarlar (⚙)

- **Görünüm:** otomatik, açık, koyu, güneş altı, gece (kırmızı).
- **Yazı boyutu.**
- **Saat gösterimi:** yerel veya yerel + UTC.
- **Canlı kipte yenileme aralığı.**
- **Dil:** Üst bantta TR / EN. İngilizce arayüzde kaynak bağlantısı Tam İlmihâl'in İngilizcesi *Endless Bliss*'tir; sayfa numaraları Türkçe baskıya göredir.
- **Tarih biçimi:** Tarih alanları varsayılan olarak gün/ay/yıl (13/11/2026) gösterilir; gün.ay.yıl, yıl-ay-gün veya ay/gün/yıl da seçilebilir. Tarih elle yazılabilir veya 📅 düğmesiyle takvimden seçilir.
- **Karanlık eşiği:** gurûb, −3° veya −6°. Yalnızca aranabilir aralığı değiştirir; Tam İlmihâl'in sınıflarını değiştirmez.
- **Hava tahmini ve otomatik konum.**

## Kaynak, lisans ve indirme

- Sayfanın altında ve **Ayarlar → Bu araç, kaynak ve lisans** bölümünde Tam İlmihâl bağlantıları, telif, lisans (CC BY-NC-ND 4.0) ve yayın adresi (github.com/bemiroglu/MahiNev) yazar.
- **⬇ HTML'yi indir** düğmesi, kullandığınız sürümü tek dosya olarak indirir. Bu dosyayı internetsiz kullanabilir ve değiştirmeden paylaşabilirsiniz.
- Ekranın üstünde kırmızı **"değiştirilmiş kopya"** uyarısı görürseniz, dosya değiştirilmiş olabilir. Hesap sonuçlarına güvenmeden önce özgün dosyayı yayın adresinden indirin.
- Programın bir fıkıh kaynağı olmadığını, Tam İlmihâl'e uymayan her bilginin geçersiz olduğunu unutmayın. Tam İlmihâl'in bağlantıları sayfanın altında ve Rehber sekmesinin başındadır. Sayfa numaraları kitabın Ocak 2026 baskısına göredir.

## Rü'yet kaydı: sonuç türleri, denetimler ve yedekleme

- **Sonuç türleri:**
  - **çıplak gözle gördüm**;
  - **dürbünle bulup çıplak gözle gördüm**;
  - **yalnız dürbünle** ve **yalnız fotoğrafla** (bu ikisi Tam İlmihâl'e göre rü'yet sayılmaz, yardımcı bilgidir);
  - **şüpheli** (cismin hilâl olduğu kesin değil);
  - **dikkatle aradım, göremedim**;
  - **gözlem yapılamadı** (bulut, ufuk engeli vb.).
- "Göremedim" ve "gözlem yapılamadı" kayıtları farklıdır. İkisi de tek başına ayın otuza tamamlandığını göstermez.
- **Program şu tutarsızlıklarda uyarır:**
  - görme beyanı varken gören kişi sayısı 0 ise;
  - ilk görme saati son görme saatinden sonraysa;
  - kayıt zamanı ileri bir tarihteyse.
- İsim yazılmayan kayıt **isimsiz beyan** olarak işaretlenir. Bu kayıt imzalı şahitlik tutanağı yerine geçmez.
- **Yedekleme:** Kayıtlar yalnız bu tarayıcıda durur. **Tüm kayıtları yedekle** ile düzenli yedek alın; **Yedekten geri yükle** ile başka bir cihaza taşıyın.
- **Fotoğraf:** Kayıtta fotoğrafın yalnız özeti ve küçük bir önizlemesi bulunur. Özgün dosyayı ayrıca saklayın. **Fotoğrafı doğrula** düğmesi, seçtiğiniz dosyanın hangi kayda ait olduğunu gösterir.
- **Saklama hatası:** Depolama dolarsa program açıkça uyarır ve kaydı dosya olarak indirir.

## Güvenlik ve hassasiyet

- **Göz güvenliği:** Güneş batmadan dürbün, kamera veya teleskopla batıya bakmayın.
- **Pusula:** Yaklaşık yön verir. Gemide veya çelik yapı yanında yönü yardımcı yıldızlarla teyit edin.
- **Batış saatleri:** Ufuk yakınında kırılma değişkendir. Saatler gerçekte 1–2 dakika, deniz üstünde daha fazla farklı olabilir.

## İnternet bağlantıları ve izinler

**Ayarlar → İnternet bağlantıları ve izinler** bölümünde üç seçenek vardır. Hepsi başlangıçta kapalıdır.

- **Hava ve görüş tahmini:** Yaklaşık konum open-meteo.com'a gönderilir.
- **Yazı tiplerini internetten yükle:** Tarayıcı Google'ın yazı tipi sunucularına bağlanır. Kapalıyken cihazın kendi yazı tipleri kullanılır.
- **Konumu otomatik al:** İnternet kullanmaz. Tarayıcı ilk seferde izin ister; konum cihazdan çıkmaz.

Bölümün altında o anda açık olan bağlantılar ve gizlilik açıklaması yazar.

## Saat dilimi ve UTC farkı

Konum kartında saat dilimi listesinin yanında **UTC farkı** kutusu vardır.

- Kutu, seçili dilimin seçili tarihteki farkını gösterir: `+3`, `−5`, `+5:30` gibi.
- **Farkı yazarsanız**, o farka uyan sabit dilim seçilir ve bütün saatler buna göre hesaplanır. Kabul edilen yazımlar: `+3`, `3`, `UTC+3`, `-5`, `−3:30`, `+5,5`, `+0545`.
- **Listeden dilim seçerseniz**, kutu o dilimin farkını gösterir.
- Listede iki grup vardır:
  - **bölgesel dilimler** (Europe/Istanbul gibi): yaz saatini izler;
  - **sabit farklar** (UTC+3 gibi): yaz saati uygulanmaz.
- Kutunun altındaki not, dilimde yaz saati olup olmadığını ve seçili tarihteki farkı söyler.
- Arz ve tûlü elle girdiğinizde konum seçili dilimden çok uzaksa, fark tûlden hesaplanır. Bölgede kullanılan saat farklıysa düzeltin.

## JPG çıktısı

**Yazdır / PDF** penceresindeki **JPG resmi olarak kaydet** düğmesi, seçtiğiniz A4 sayfalarını resim olarak indirir.

- Her sayfa yaklaşık 240 dpi'lık bir JPEG olur. Birden çok sayfa seçerseniz sayfalar bir ZIP dosyası içinde iner.
- Gökyüzü haritası penceresinde ve rü'yet tutanağında da **JPG** düğmesi vardır.

## Sade görünüm

**Ayarlar → Görünüm** iki seçenek sunar:

- **Sade (önerilen):** Bu akşamın özeti, yaklaşan rasad ve ufuk açık başlar; diğer kartlar katlı durur. Katlı kartta başlık ve kısa bir özet görünür.
- **Tam:** Bütün kartlar açık başlar.

Her kart başlığına veya sağ üstteki düğmeye dokunarak açılır ya da kapanır; seçiminiz hatırlanır.

## Dosya adları

Program dosyaları `MahiNev_YYYY-AA-GG_SSDD_Yer_tür` biçiminde adlandırır:

- `MahiNev_2026-12-10_1745_Istanbul_tutanak.jpg`
- `MahiNev_2026-12-10_1745_Istanbul_ruyet-kaydi_43569d93.json`

Tarih önde olduğu için dosyalar klasörde sıralanır. Yazdır penceresinde PDF olarak kaydederken de aynı ad önerilir.

## Kayıt doğrulama

**Saha → Kayıt doğrula** penceresine tutanaktaki kodu yazın veya QR'dan okunan metni yapıştırın. Gözlemcinin JSON kaydını seçin. Program şunları gösterir:

- kaydın değiştirilip değiştirilmediğini;
- imzanın geçerli olup olmadığını;
- kâğıttaki kodun bu kayda ait olup olmadığını.

Ayrıntı: [kayit-semasi.md](kayit-semasi.md).
