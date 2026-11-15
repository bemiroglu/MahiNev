# Bağımsız inceleme (v0.14.0) — değerlendirme ve uygulama planı

Kullanıcının v0.14.0 için yaptırdığı bağımsız inceleme metninden alıntılar (15 Kasım 2026) bugünkü kodla (0.14.1, beş dil) tek tek karşılaştırıldı. Her madde için: incelemenin iddiası doğru mu, bugün durum ne, ne yapılmalı.

İşaretler: **D** = iddia kodda doğrulandı · **K** = kısmen var / kısmen doğru · **V** = zaten var · **İ** = ilkeye göre dikkatle (Tam İlmihâl esası, D9, D17).

## A. Hata ve güvenlik — bu sürümde düzeltilmeli

| # | Konu | Durum | Yapılacak |
|---|---|---|---|
| A1 | JSON içe aktarmada şema doğrulaması yok (P0) | **D.** `importRecords` yalnız `schema` veya `ts` alanına bakıyor; `{"schema":"hilal-ruyet-kaydi/1"}` gibi eksik bir kayıt depoya girer, liste çizilirken hata verebilir. Aynı kimlikli ama farklı özetli kayıt sessizce "zaten var" sayılıyor. | İçe aktarmadan önce doğrulama: zorunlu alanlar, türler, tarih geçerliliği, enlem/boylam sınırları, sonuç türleri, dosya boyutu sınırı. Geçersiz kayıt depoya alınmaz; hangi alanın hatalı olduğu listelenir. Aynı kimlik + farklı özet = "kayıt çatışması" olarak gösterilir, birleştirilmez. Kayıt listesi eksik alanlara karşı korunur. |
| A2 | Güneş güvenliği uyarısı hilâl sınıfına bağlı (P0) | **D.** Saha'daki uyarı `sunUp && sightPossible(...)`, Plan'daki `sightPossible(R)` şartına bağlı; "görülemez" akşamlarda Güneş ufuk üstündeyken uyarı çıkmıyor. Kapatılan uyarı kalıcı olarak kapanıyor. | Güneş ufuk üstündeyken Saha'da uyarı hilâl sınıfından bağımsız her zaman gösterilir. Kapatma yalnız o oturum içindir; bir sonraki açılışta ve dürbünle bakılacak yönü gösteren her ekranda yeniden çıkar. |
| A3 | Ay batışı farkı: Reykjavik, 11.11.2026, ≈ −1562 dk | **D.** Ay gurûbda ufkun altındaysa program son ay batışını süre sınırı olmadan geriye arıyor; yüksek enlemde bir gün önceki batış bulunuyor ve "Fark" büyük bir eksi sayı oluyor. | Ay gurûbda ufkun altındaysa "Ay güneşten önce battı" yazılır; batış aynı gün içinde (≤ 12 saat önce) ise "… dk önce" diye eklenir, değilse sayı yazılmaz. Sınıflandırma etkilenmez (zaten "Ay güneşten önce batıyor" der). |
| A4 | CSV'de virgül ve tırnak boşluğa çevriliyor | **D.** `exportRawCsv` `[",\n]` karakterlerini siliyor. | Standart CSV alıntılama (RFC 4180): alan tırnak içine alınır, iç tırnak ikilenir. |
| A5 | Yaz saati geçişlerinde olmayan / iki kez yaşanan yerel saat | **K.** Hesap tutarlı (olmayan saat → geçişten sonraki karşılık, iki kez yaşanan → ilki) ve kayıt UTC olarak saklanıyor; ama kullanıcıya söylenmiyor. | Kayıt zamanı ve tarih alanlarında bu iki durumda küçük bir not: "Bu yerel saat bu tarihte yok / iki kez yaşanır; kullanılan karşılık: … (UTC …)". |
| A6 | Hicrî gösterimde işlemeyen kod (`local = null, diff = false`) | **D.** Zararsız ama ölü kod. | Kaldırılır. |
| A7 | "Özgün dosya" denetiminin kapsamı ve ifadesi | **D/K.** Özet yalnız program betiğini kapsıyor (astronomi betiği, HTML, CSS dışında); FNV kriptografik değil ve beklenen değer aynı dosyada. Ekranda olumlu bir "doğrulandı" iddiası yok, eşleşmezse uyarı var; Doğrulama tablosu "özgün" yazıyor. | Özet bütün betikleri, HTML iskeletini ve stili kapsar. Doğrulama tablosu ve belgeler "yerel bütünlük denetimi" der; "resmî / özgün olduğunu ispatlamaz" notu. Ek olarak (programı değiştirmeden): her sürümün SHA-256 özeti GitHub sürüm notunda ve README'de yayımlanır; isteyen indirdiği dosyayı bununla karşılaştırır. |
| A8 | "Kayıt doğrulandı" ≠ "rü'yet doğrulandı" | **K.** Rehber'de yazılı; doğrulama sonucunun yanında yok. | Doğrulama sonucunun altına tek satır: "Yalnız kaydın sonradan değiştirilmediğini gösterir; hilâlin görüldüğünü veya gözlemcinin kimliğini doğrulamaz." İçe aktarılan kayıtlarda teknik durum: imzalı ve bütün / imzasız / doğrulanamadı / bozuk. |

Bu maddelerin metinleri beş dilde güncellenir (`pack_sync.py`: değişen ve yeni metinler çevrilip denetlenir).

## B. Zaten var olanlar (incelemenin önerdiği)

- **Kayıt formu alanları (7.2):** ilk ve son görülme anı, gökyüzü durumu, birlikte gözleyen ve gören sayısı, sonuç türleri (çıplak göz; dürbünle bulup çıplak gözle; yalnız dürbün/teleskop; yalnız fotoğraf; görülmedi; gözlem yapılamadı), şüpheli gözlem. Eksik olan: kullanılan optik cihaz (serbest metin) ve gözlemcinin kesinlik beyanı (kesin / muhtemel) — küçük ekleme.
- **Görülme / görülebilir ayrımı (4.2):** Etiketler zaten şartlı: "Hesâba göre görülebilir (hava müsaitse)", "Görülmesi mümkün; dikkatli rasad gerekir"; program "takvim değildir" notu ve D9 dil ilkesi. Değişiklik gerekmez.
- **Geri sayım, kontrol listesi, QR, SHA-256 / ECDSA, yedek uyarısı, "Bu akşam ne demek?" açıklaması, zaman çubuğu** zaten var.
- **Modüler kaynak + tek dosya derleme + CI (9):** zaten böyle (`src/`, `build.py`, `ci.yml`).
- **Hava değerlendirmesi (6.4):** Metin zaten olgusal ("batı ufku açık görünüyor"; görülme ihtimali denmiyor), tahmin her seferinde canlı alınıyor, saklanmıyor. Eklenebilir: "tahmin alındı: 18:05" zaman damgası.

## C. Değerli öneriler — sonraki sürüm (öncelik sırasıyla)

1. **Yerel ufuk profili** (incelemenin en yüksek getirili önerisi). Kullanıcı batı ufkundaki engelleri (dağ, bina) azimut aralıklarıyla yükseklik olarak girer; program Tam İlmihâl'in 5° penceresini bu ufka göre gösterir ("hilâl 252°'de, engelin 1,5° üstünde"). Hükmün ölçüsü değişmez (5° görünen irtifâ); yalnız engel ayrıca gösterilir. Haritaya ve hesaba dokunmaz.
2. **Saha'da sade "rasad kartı" görünümü.** Gurûb, 5° anı, pencere süresi, bakılacak yön (azimut ve yükseklik, büyük rakamlarla), geri sayım; ayrıntılar açılır bölümde. Saha sekmesi buna yakın; düzey ayarına (D11) bir "Saha kartı" kipi olarak eklenebilir.
3. **Pusula güvenilirlik göstergesi.** Mutlak / bağıl yön, cihazın bildirdiği doğruluk (iOS), gerçek kuzey – manyetik kuzey notu, metal ve araç uyarısı; sensör yoksa yalnız sayısal azimut ve ufuk çizimi (zaten çalışıyor; açıkça "yedek kip" diye adlandırılır).
4. **Bağımsız astronomik testler.** Eşik testleri (8°, 18°, 5° sınırlarının iki yanı), yaz saati ve tarih çizgisi testleri Doğrulama'ya eklenir; dış kaynaklı efemeris değerleri (ör. JPL Horizons'tan önceden alınıp sabit yazılmış ictimâ anları ve konumlar) toleranslarıyla karşılaştırılır. Testler "hızlı" ve "tam" diye ayrılır.
5. **Tutanak paylaşımı (Web Share)** ve paylaşmadan önce alan seçimi (ad, iletişim, tam konum, fotoğraf).
6. **Hava tahmininin zaman damgası.**
7. **Eğitim / deneme kipi.** Hazır senaryolar (kolay gözlem, kısa pencere, bulutlu ufuk, Ay güneşten önce batıyor, pusula yok); deneme kayıtları gerçek kayıtlardan ayrı tutulur.
8. **Kayıt fotoğrafına yön ve zaman bilgisi** (EXIF varsa okunur, yoksa kullanıcı girer).

## D. İlkeye göre dikkat gerektirenler

- **Yallop / Odeh:** İnceleme bunların tanımlarının açıklanmasını öneriyor; açıklamalar zaten Rehber'de. Ana katman Tam İlmihâl kalır; modern modeller "ek bilgi" etiketini korur (kanonik rapor, D4, D10). Değer tablosu (ictimâ, beynûnet, irtifâ, semt, fark, ARCV, kalınlık, q / V) değerlere dokununca açılan kısa açıklamalar olarak verilebilir; Tam İlmihâl'in terimleri önce yazılır.
- **"Gözlemsel karşılaştırma" testleri:** Gerçek gözlem raporlarıyla karşılaştırma yararlıdır. Ancak takvim birleştirme ölçütlerinin (D17) veri setleri ve sınıfları ek bilgi olarak da kullanılmaz; yalnız ham gözlem kayıtları (yer, zaman, görüldü/görülmedi) Tam İlmihâl sınıflarıyla karşılaştırılabilir.
- **İncelemede küçük bir kaynak hatası:** Odeh'in ölçütü *Experimental Astronomy* 18 (2004) makalesindedir (737 gözlem); incelemede "2006" yazılı. Programdaki atıf (2004) doğrudur.
- **Dış imzalı sürüm manifesti:** İnceleme de kabul ettiği gibi tek dosya ve internetsiz çalışma hedefiyle çelişir; yerine A7'deki "yayımlanan SHA-256 özeti" yolu önerilir.
- **Gemi kipi ve gözlem yeri profilleri (6.5):** Gemi kipi zaten yol haritasında; ufuk profili (C1) ile birlikte ele alınabilir.
