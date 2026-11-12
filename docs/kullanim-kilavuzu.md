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

Sayfada bir şeye dokunduğunuzda okuduğunuz kart yerinde kalır; yeni bilgiler sayfayı kaydırmaz.

## Plan sekmesi

1. **Konum** ve **Akşam** kartları (solda):
   - "◀ Önceki ay" ve "Sonraki ay ▶" düğmeleri, seçili tarihten önceki veya sonraki ilk **ay başı rasad gecesine** gider.
   - "Ay başı rasadı" seçimiyle rasad gecesi (ilk mümkün akşam) veya en elverişli akşam (≥ 18°) seçilir.
2. **Durum kartı:**
   - kitabın sınıfı ve rü'yet beyanı;
   - kitaba göre arama penceresi (gurûb → hilâl 5°);
   - Yallop'un en iyi anı. Bu an pencereden sonraya düşüyorsa kartta açıkça yazılır.
3. **Seçili an:**
   - 00:00'dan ertesi gün 03:00'e kadar süren zaman çubuğu;
   - "bu anda hilâl aranabilir mi, neden?" sorusunun cevabı;
   - güneş ve ay konumu, evre, sabah hilâli.
4. **Batı ufku / bütün ufuk:**
   - Seçili an batı penceresindeyse hilâlin yeri yumruk ölçeğiyle çizilir; değilse 360° ufuk gösterilir. Telefonda ufuk yana kaydırılabilir.
   - "✦ Gökyüzü haritası" bütün gökyüzünü açar.
   - Yönelim için yardımcı cisimler hilâle göre konumlarıyla verilir.
5. **Aylık rü'yet şeridi:** her akşamın sınıfı; A rasad gecesi, B en elverişli akşam, "s" sabah hilâli.
6. **Hava ve görüş:** Ayarlar'dan açılır (başlangıçta kapalıdır). İnternet gerekir.

## Hicrî tarih nasıl okunur?

- Kamerî gün **şer'î gurûbda** değişir (s. 188).
- İki ihtimalin bulunduğu günler birlikte yazılır, örneğin "1 Receb 1448 veya 29/30 Cemâziyelâhir 1448". Yeni hicrî yıl da Muharrem hilâli görülünce başladığından, o gün eski ve yeni yıl yan yana yazılır.
- Esas alınan kapsam **dünya genelidir**, çünkü bir şehirde görülünce her yerde lâzım olur (s. 315). Zilhicce'de kapsam yereldir (Mekke ve bulunulan yer).
- Bulunduğunuz yerin yerel hesabı farklıysa **"Burada"** satırı ayrıca gösterilir.

## "Bu akşam ne demek?" açıklama penceresi

Plan sekmesindeki değerlendirme kartında, Saha sekmesinde ve "Yaklaşan ay başı rasadı" kartında **ⓘ Bu akşam ne demek?** düğmesi bulunur. Pencere, seçili akşam ve yer için şunları kitabın sayfalarıyla açıklar:

- **Bu akşam burada:** hilâlin Tam İlmihâl'e göre sınıfı ve "gördüm" beyanının durumu.
- **Bu akşam dünyada:** hilâlin hesâben mümkün ve görülebilir olduğu bölgeler (kaba tarama).
- **Ay başı ne olur?** İki kesin sınır vardır: rü'yetle başlama hesapla anlaşılandan önce olamaz (s. 360) ve ay otuz günü aşmaz (s. 314–315). Gerisi önceki ayın başına bağlıdır.
- **Önceki ayın başı:** Önceki ayın başı da rü'yetle veya otuza tamamlamayla sabit olur; program bunu bilemez ve varsaymaz. Bir tablo her ihtimali ayrı gösterir: önceki ay hesâbî en erken gün mü, bir gün sonra mı başladı (rü'yet kaydınız varsa o da); her biri için 29. gün akşamı, o akşam görülürse ve görülmezse yeni ayın 1. günü. Bugünün kamerî günü de her ihtimal için "önceki ay … günü başladıysa" diye yazılır. Yetkili makamca sabit olan başlangıcı biliyorsanız seçin; gösterim ona göre daralır. Seçim hüküm değildir.
- **Akşam akşam:** Hilâl ilk kez o akşam görülüp sabit olursa yeni ayın 1. günü ertesi gündür; bunun şartı (önceki ayın hangi gün başlamış olması gerektiği) yanında yazılır. Tarihe dokununca o akşam planlanır.
- **Kapsam ve hüküm:** ayın adına göre (Ramezân, Şevvâl, Zilhicce) kitabın hükümleri. Zilhiccede önce Işık usulü, sonra ek bilgi olarak bu yerin astronomik hesabı gelir.

Pencere hesâbî imkânı anlatır; hüküm, şahitlik şartlarıyla yetkili makamca verilir (s. 315–316). Deliller için Rehber'de **Naklî deliller** konusuna bakın.

## Büyük ekran ve PDF

Hazırlık için büyük bir ekran (bilgisayar veya tablet) tavsiye edilir. Sahada telefon ekranı küçük kalır. Rasad planını ve akşamın gökyüzü haritasını önceden **⎙ Yazdır → PDF** ile kaydedip yanınıza alın; internetsiz ve tek bakışta okunur.

## Kâdîhân kontrolü ve şafak

- Kâdîhân kuralına göre hilâl şafaktan sonra batarsa ikinci gecenin, önce batarsa birinci gecenin hilâlidir (s. 316).
- Tam İlmihâl yatsı vakti için iki kavli bildirir (s. 178):
  - İmâmeyn: kırmızılığın kayboluşu, −17°;
  - İmâm-ı a'zam: beyâzlığın kayboluşu, −19°.
- Kitap, İmâm-ı a'zam kavline göre kılmanın ihtiyâtlı olduğunu söyler (s. 194). Bu yüzden program −19°'yi esas alır ve −17° sonucunu yanında gösterir.
- Şafak vakti, hakîkî vakte temkin eklenerek bulunur (s. 197).

## Saha sekmesi (telefon)

- **Şerit:** Sayfa kaydırılsa da üstte kalır. Saati, sıradaki olaya geri sayımı ve ince akşam çubuğunu gösterir.

- **Büyük satır:** "Aramaya 1 sa 12 dk kaldı", "Hilâl şimdi aranabilir" veya "Bu akşamın arama penceresi bitti".
- **Akşam çizelgesi:** gurûb, pencere, aranabilir aralık ve şimdiki an.
- **Geri sayımlar:** gurûb, en iyi an, 5° anı, ay batışı.
- **Gök görünümü her zaman şimdi içindir;** bakılacak yer yazıyla da verilir.
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
- tutanak veya boş tutanak formu.

Tarayıcının yazdırma penceresinde "PDF olarak kaydet" seçilebilir; sayfalar JPG olarak da kaydedilebilir.

## Ayarlar (⚙)

- **Görünüm:** otomatik, açık, koyu, güneş altı, gece (kırmızı).
- **Yazı boyutu.**
- **Saat gösterimi:** yerel veya yerel + UTC.
- **Canlı kipte yenileme aralığı.**
- **Karanlık eşiği:** gurûb, −3° veya −6°. Yalnızca aranabilir aralığı değiştirir; kitabın sınıflarını değiştirmez.
- **Hava tahmini ve otomatik konum.**

## Kaynak, lisans ve indirme

- Sayfanın altında ve **Ayarlar → Bu araç, kaynak ve lisans** bölümünde kaynak kitap bağlantıları, telif, lisans (CC BY-NC-ND 4.0) ve yayın adresi (github.com/bemiroglu/MahiNev) yazar.
- **⬇ HTML'yi indir** düğmesi, kullandığınız sürümü tek dosya olarak indirir. Bu dosyayı internetsiz kullanabilir ve değiştirmeden paylaşabilirsiniz.
- Ekranın üstünde kırmızı **"değiştirilmiş kopya"** uyarısı görürseniz, dosya değiştirilmiş olabilir. Hesap sonuçlarına güvenmeden önce özgün dosyayı yayın adresinden indirin.
- Programın bir fıkıh kaynağı olmadığını, kitaba uymayan her bilginin geçersiz olduğunu unutmayın. Kitabın bağlantıları sayfanın altında ve Rehber sekmesinin başındadır. Sayfa numaraları kitabın Ocak 2026 baskısına göredir.

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
