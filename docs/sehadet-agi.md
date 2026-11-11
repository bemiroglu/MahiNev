# Rü'yet şehâdetinin belgelenmesi ve gözlem ağı — tasarım belgesi

*Durum: öneri (v0.5). Programın içindeki kayıt ve tutanak kısmı uygulanmıştır; ağ kısmı tasarım aşamasındadır.*

## 1. Amaç

Bir gözlem, programın çalıştığı cihazda kalmamalıdır. Bunun için üç şey gerekir:

1. **Belge:** Gözlem elle tutulur bir belgeye dönüşmeli; gözlemci ve birlikte bulunanlar imzalayabilmeli.
2. **İletim:** Kayıt değiştirilmeden ve kimden geldiği bilinerek iletilebilmeli.
3. **Ağ:** Güvenilir bir ağ yoksa, kurulabilmesi için açık ve denetlenebilir bir altyapı hazır olmalı.

## 2. Fıkhî çerçeve (Se'âdet-i Ebediyye esas, Redd-ül-muhtâr yardımcı)

Tasarımın her adımı aşağıdaki hükümlere bağlıdır. Sayfa numaraları Se'âdet-i Ebediyye'ye aittir. Redd-ül-muhtâr'a eser, bölüm ve mesele adıyla atıf yapılır.

| Hüküm | Kaynak | Tasarıma etkisi |
|---|---|---|
| Bulutlu havada Ramazân hilâli bir âdil müslimânın "gördüm" demesiyle, açık havada birçok kimsenin söylemesiyle sabit olur. Kâdî bulunmayan yerde bir âdilin sözüyle Ramazân, iki âdilin sözüyle bayram olur. | s. 315 | Kayıtta gök durumu zorunlu alandır. Tutanak, birlikte gözleyenler için imza satırları içerir. |
| Şevvâl için bulutlu havada iki erkek veya bir erkekle iki kadın gerekir. Açık havada Ramazân ve Şevvâl için çok kimse gerekir. | s. 316 (Mecmû'a-i Zühdiyye'den) | Kayıtta "birlikte gözleyen" ve "gören" sayıları tutulur. |
| Âdil: büyük günâh işlemeyen, küçük günâha alışık olmayan kimsedir. | s. 315 | Program âdaleti değerlendirmez; bu yetkili makamın işidir. Kayıt yalnızca kimliği belli bir beyan üretir. |
| Takvim veya hesapla Ramazâna ve bayrama başlamak câiz değildir. | s. 315 | Program hiçbir zaman "ay başladı" demez; yalnızca hesâbî imkân ve kesin red verir. |
| Hilâli görmekle Ramazânın başlaması hesapla anlaşılandan bir gün sonra olabilir, fakat bir gün önce olamaz. | s. 315 | Hesâbî en erken günden önceki bir rü'yet beyanı kayıtta "hesaba göre imkânsız" diye işaretlenir. |
| Kesin red: ictimâ olmamışsa, ay güneşten önce batıyorsa veya beynûnet 8°'den azsa. | s. 360 (Sübkî) | Kayıt değerlendirmesinde "kesin red" olarak yer alır. |
| Ramazân hilâlinde haber yeterlidir (şahitlik, dava ve hüküm meclisi şartı yoktur). Bayramda şehâdet lafzı ve nisâb şarttır. | Redd-ül-muhtâr, Kitâb-us-savm, hilâlin sübûtu bahsi | Tutanak "gözlem beyanı" olarak düzenlenir; bayram için "şehâdet ederim" lafzının yetkili makam huzurunda söylenmesi gerektiği hatırlatılır. |
| Şehir dışında veya yüksek yerde gören tek kişinin haberi kabul edilebilir. | Aynı bahis (Mebsût ve Kâfî'den) | Kayıtta "gözlem yeri" alanı vardır: şehir dışı, yüksek yer veya şehir içi. |
| Muvakkitlerin (hesapçıların) sözü delil değildir. | Aynı bahis | Programın hesabı yalnızca kontrol içindir; ağda hesap bir rü'yet yerine geçmez. |
| Başkalarının gördüğünü nakletmek şahitlik değil, hikâyedir. Bir hâkimin hükmüne şahitlik ise hüccettir. | Aynı bahis | Ağda **ilk el gözlem kaydı** ile **nakil** ayrı türlerdir. Yalnız gözlemcinin kendi imzalı kaydı "gözlem" sayılır. |
| Haber başka beldede yayılır ve tahakkuk ederse o beldeye de lâzım olur. Yayılma, birkaç ayrı cemaatin gelip haber vermesidir; kimin söylediği bilinmeyen haber muteber değildir. | Aynı bahis (Hulvânî, Rahmetî) | Ağ **anonim haber kabul etmez**. Bir beldeden gelen kayıtlar bağımsız kaynak sayısıyla birlikte gösterilir. |
| Bir şehirde hilâl görülünce bütün dünyada oruca başlamak lâzım olur. | s. 315 | Ağ dünya geneli kapsamlıdır; yerel gözlem kayıtları da korunur. |

## 3. Bugün programda olanlar (v0.5)

### 3.1 Rü'yet kaydı (`hilal-ruyet-kaydi/1`)

Saha sekmesindeki form, ICOP ve ICOUK raporlarının ortak alanlarına ve yukarıdaki fıkhî ayrıntılara göre düzenlenmiştir. Ayrıntılar için bkz. [kayit-semasi.md](kayit-semasi.md).

- **Sonuç:** Beş seçenek vardır: çıplak gözle gördüm; önce dürbünle bulup sonra çıplak gözle gördüm; yalnız dürbünle; yalnız fotoğrafla; görmedim. Kitaba göre rü'yet çıplak gözle olur; diğerleri yardımcı bilgidir.
- **Görmedim kayıtları da önemlidir:** Otuz günü tamamlamaya delil olurlar.
- **Hesâbî karşılaştırma:** Program, gözlem anının hesâbî verilerini kayda kendisi ekler.
- **Bütünlük:** Kaydın kanonik JSON'undan SHA-256 özeti çıkarılır. Tarayıcıda dışarı alınamaz bir ECDSA P-256 anahtarı varsa özet bu anahtarla imzalanır. Açık anahtar ve parmak izi kayda yazılır.
  - *Bu imza kişinin kimliğini kanıtlamaz.* Kaydın sonradan değiştirilmediğini ve aynı cihazdan geldiğini gösterir.
  - Kimliği doğrulayan, tutanaktaki ıslak imza ve onu teslim alan sorumlu kişidir.

### 3.2 Tutanak (A4)

Tek sayfadır ve şunları içerir:

- gözlem bilgileri ve hesâbî veriler;
- gözlemci ve birlikte gözleyenler için imza satırları;
- fıkhî hatırlatma;
- bütünlük özeti ve QR kodu (`HRK1|kayıt-no|özet`).

Boş form da basılabilir: elle doldurulur, sonra programa işlenir.

### 3.3 İletim

| Yol | Ne zaman |
|---|---|
| Basılı ve imzalı tutanak | Yetkili kişiye, heyete veya müftülüğe elden teslim. Fıkhen en sağlam yol. |
| JSON dosyası | Ağlara ve heyetlere; özet doğrulanabilir. |
| Rapor metni (kopyala) | WhatsApp, e-posta veya SMS; hızlı ilk haber. Son satırında özet bulunur. |
| ICOP, ICOUK, moonsighting.com | Açık uluslararası ağlar. Her biri kendi formuyla rapor kabul eder ve kendi ölçütleriyle değerlendirir. |

## 4. Mevcut ağlar (değerlendirme)

- **ICOP (Islamic Crescents' Observation Project, International Astronomical Center):**
  - 1998'den beri sürüyor; dünya çapında gözlemcilerden aylık sonuç topluyor.
  - Hilâl ve sabah hilâli için ayrı formları var.
  - Doğrulamadan sonra yayımlıyor; resmî ay başlarını da listeliyor.
  - Gözlemleri yöntemlerine göre ayırıyor: çıplak göz, optik yardım, CCD.
  - *Güçlü yanları:* süreklilik, bilimsel denetim, geniş kapsam.
  - *Sınırı:* fıkhî değerlendirmesi kendi çerçevesindedir; Se'âdet-i Ebediyye ölçütleriyle kurulmamıştır.
- **ICOUK (moonsighting.org.uk):**
  - Birleşik Krallık'ta yerel rü'yeti canlandırmayı amaçlıyor.
  - Olumlu ve olumsuz bütün raporların bildirilmesini, mümkünse gurûb ve hilâl fotoğrafıyla birlikte, istiyor.
  - Bölgesel WhatsApp grupları var.
- **moonsighting.com:**
  - Ülke ve tarihe göre rapor listeleri yayımlıyor.
  - Şüpheli bulduğu iddiaları açıkça işaretliyor.

*Sonuç:* Bu ağlar bilimsel kayıt açısından değerlidir ve programın JSON ile metin çıktıları onlara iletilebilir. Ancak Se'âdet-i Ebediyye esaslı bir **haber ve şehâdet zinciri** sunmazlar. Âdil gözlemci, nisâb, şehâdet lafzı ve yetkili makamın hükmü bu ağların kapsamı dışındadır.

## 5. Önerilen altyapı: açık, denetlenebilir, merkeziyetsiz

### 5.1 İlkeler

1. **Ağ hüküm vermez; haber taşır.** Hükmü yetkili makam (heyet) verir ve kararını imzalı bir "karar kaydı" olarak yayımlar.
2. **Anonim kayıt yoktur.** Her gözlem kaydının kimliği belli bir gözlemcisi ve imza anahtarı vardır. Anahtar, gözlemciyi şahsen tanıyan bir sorumlu tarafından ağa kaydedilir (anahtar kayıt defteri).
3. **İlk el ile nakil ayrıdır.** Kayıt türleri şunlardır:
   - `gozlem`: gözlemcinin kendi beyanı;
   - `karar`: heyetin hükmü ve dayandığı gözlem kayıtları;
   - `nakil`: başka bir beldenin kararının haberi; kaynak kararın özetine bağlanır.
4. **Her kayıt doğrulanabilir.** SHA-256 özeti ve imza herkesçe kontrol edilebilir. Sonradan değişiklik yapılamaz, yalnızca yeni bir düzeltme kaydı eklenir.
5. **Olumsuz kayıtlar da yayımlanır.**
6. **Hesap yalnız kontrol içindir.** Program her kaydın yanında hesâbî imkânı gösterir. Kitabın kesin red şartlarına uyan bir beyan otomatik olarak "hesaba göre imkânsız" diye işaretlenir; karar heyetindir.

### 5.2 Teknik seçenekler

| Seçenek | Kurulum | Güven ve denetim | Değerlendirme |
|---|---|---|---|
| **A. GitHub deposu (önerilen ilk adım)** | Ücretsiz; bu depo içinde | Her rapor bir *issue* (yapılandırılmış form), her karar bir *commit* olarak kalır; geçmiş silinmez ve herkes görebilir | Hemen kurulabilir. Gözlemcilerin GitHub hesabı gerekir. Kararlar heyet hesabından imzalı commit'lerle verilir. |
| B. Statik site + e-posta | Düşük | Heyet raporları toplar, JSON kayıtlarını sitede yayımlar | Basit, ama elle iş gerektirir. |
| C. Küçük bir sunucu (API + veritabanı) | Orta; bakım gerekir | Uygulama içinden tek dokunuşla gönderim; otomatik özet ve imza kontrolü | Uzun vadede en kullanışlısı; sunucunun güvenliği ve sürekliliği sorumluluk ister. |
| D. Mesajlaşma grupları | Yok | Zayıf: kimlik ve bütünlük denetimi yok | Yalnızca ilk haber için; kayıt yerine geçmez. |

**Önerim:**

1. Önce A ile başlanır. Bu depoya bir "Rü'yet raporu" issue formu eklenmiştir (`.github/ISSUE_TEMPLATE/ruyet-raporu.yml`). Raporu gönderen, programın ürettiği JSON'u ekler.
2. Bir GitHub Action kaydın özetini ve imzasını kontrol edip etiketler: `ozet-dogru` veya `ozet-hatali`, `imzali` veya `imzasiz`, `hesaba-gore-imkansiz`.
3. Heyet kararını `kararlar/1448/receb.json` gibi bir dosya olarak, imzalı commit ile yayımlar.
4. Kullanım yaygınlaşırsa C'ye geçilir. Kayıt biçimi aynı kalacağı için geçiş kolaydır.

### 5.3 Açık sorular (birlikte karar verilecek)

1. **Yetkili makam:** Heyetin kimlerden oluşacağı ve anahtarlarının nasıl tanıtılacağı.
2. **Gözlemci kaydı:** Gözlemcinin ağa nasıl kabul edileceği, örneğin bir heyet üyesinin şahsen tanıması.
3. **Gizlilik:** İletişim bilgisinin ağda yayımlanmaması (yalnız heyete açık olması). Bunun için şifreli ek veya ayrı bir kanal gerekir.
4. **Kapsam:** Ramazân ve bayram dışındaki aylar için aynı sürecin işletilip işletilmeyeceği.
