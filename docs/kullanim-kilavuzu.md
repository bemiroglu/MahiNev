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
3. Listede her kayıt için dört düğme vardır:
   - **Tutanak (A4):** basın; gözlemci ve birlikte gözleyenler imzalasın; yetkili kişiye elden verin.
   - **JSON:** ağlara ve heyetlere gönderilecek dosya.
   - **Metni kopyala:** WhatsApp veya e-posta ile hızlı ilk haber.
   - **Sil.**
4. **Görmedim** kayıtları da önemlidir: otuz günü tamamlamaya delil olur.

## Yazdır / PDF

An çubuğundaki "⎙ Yazdır / PDF" düğmesi bir seçim penceresi açar. Her seçenek **tek A4 sayfasına** göre hazırlanır:

- rasad planı;
- gökyüzü haritası;
- aylık çizelge;
- dünya haritası (yatay);
- tutanak veya boş tutanak formu.

Tarayıcının yazdırma penceresinde "PDF olarak kaydet" seçilebilir. claude.ai içinde sayfa HTML dosyası olarak kaydedilir.

## Ayarlar (⚙)

- **Görünüm:** otomatik, açık, koyu, güneş altı, gece (kırmızı).
- **Yazı boyutu.**
- **Saat gösterimi:** yerel veya yerel + UTC.
- **Canlı kipte yenileme aralığı.**
- **Karanlık eşiği:** gurûb, −3° veya −6°. Yalnızca aranabilir aralığı değiştirir; kitabın sınıflarını değiştirmez.
- **Hava tahmini ve otomatik konum.**

## Lisans, resmî sürüm ve indirme

- Sayfanın altında ve **Ayarlar → Lisans ve resmî sürüm** bölümünde telif, lisans (CC BY-NC-ND 4.0) ve resmî adres (github.com/bemiroglu/MahiNev) yazar.
- **⬇ HTML'yi indir** düğmesi, kullandığınız sürümü tek dosya olarak indirir. Bu dosyayı internetsiz kullanabilir ve değiştirmeden paylaşabilirsiniz.
- Ekranın üstünde kırmızı **"resmî olmayan kopya"** uyarısı görürseniz, dosya değiştirilmiş olabilir. Hesap sonuçlarına güvenmeden önce resmî sürümü indirin.

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
- Arz ve tûlü elle girdiğinizde konum seçili dilimden çok uzaksa, fark tûlden hesaplanır. Bölgenin resmî saati farklıysa düzeltin.

## JPG çıktısı

**Yazdır / PDF** penceresindeki **JPG resmi olarak kaydet** düğmesi, seçtiğiniz A4 sayfalarını resim olarak indirir.

- Her sayfa yaklaşık 240 dpi'lık bir JPEG olur. Birden çok sayfa seçerseniz sayfalar bir ZIP dosyası içinde iner.
- Gökyüzü haritası penceresinde ve rü'yet tutanağında da **JPG** düğmesi vardır.
