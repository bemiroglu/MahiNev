# Değişiklik günlüğü

## 0.7.0 — 2026-11-11

- **Yeni ad: Mâh-ı Nev.** Program artık "Mâh-ı Nev — Hilâl Rasad Yardımcısı" (EN: Crescent Sighting Assistant) adını taşıyor. Resmî depo: github.com/bemiroglu/MahiNev.
- **Lisans: CC BY-NC-ND 4.0.** Ticarî olmayan, değiştirilmeden ve kaynak gösterilerek paylaşım serbest; değiştirilmiş kopyalar dağıtılamaz. Gömülü üçüncü taraf bileşenler kendi lisanslarıyla gelir.
- **Resmî sürüm bildirimi:**
  - Telif, lisans ve GitHub adresi, her sayfanın altında ve Ayarlar → *Lisans ve resmî sürüm* bölümünde görünür.
  - Aynı bilgi, şifreli ve parçalara bölünmüş olarak koda gömülüdür.
  - Program açılışta kendi bütünlüğünü denetler. Dosya değiştirilmişse üstte "resmî olmayan kopya" uyarısı çıkar; bu ibare baskılara ve rü'yet kayıtlarına da yazılır.
- **⬇ HTML'yi indir:** Başlıktaki ve Ayarlar'daki düğme, programın o sürümünü tek dosya olarak indirir. claude.ai içinde indirme izniyle çalışır.
- **Yaklaşan ay başı rasadı düzeltildi:**
  - Bu akşamın arama penceresi geçince kart bir sonraki ayın rasad gecesine geçer. Önceden gurûbdan 2 saat sonrasına kadar bu akşamda kalıyordu.
  - "En elverişli akşam" artık aynı ayın, henüz geçmemiş akşamıdır; iki ayın geceleri karışmaz.
  - **Önceki hilâl rasadı** kutusu ve "O geceyi aç" düğmesi eklendi.
- Baskı dosya adları `mahinev-…` oldu. Derleme çıktısı `dist/mahinev.html` ve `dist/mahinev-v0.7.0.html`.
- Doğrulama: 48 test (yaklaşan rasad ve resmî sürüm denetimi eklendi).

## 0.6.0 — 2026-11-11

- **"Tam İlmihâl" adı:** Arayüzde "kitap" yerine "Tam İlmihâl" kullanılıyor.
- **Şafak ve Kâdîhân (s. 178, 194, 197, 316):**
  - İmâm-ı a'zam kavli (beyâzlık, −19°) esas; İmâmeyn kavli (kırmızılık, −17°) alternatif olarak sonucuyla birlikte gösteriliyor.
  - Şafak vakitleri kitabın usulüyle hesaplanıyor: hakîkî vakte temkin eklenerek şer'î vakit bulunuyor.
  - İki kavil farklı sonuç verirse açıkça yazılıyor.
- **Rehberlik ana tasarım ilkesi oldu:**
  - "Nasıl kullanılır?" kartı eklendi.
  - Her kartın başında ne, neden ve fıkhî dayanak açıklaması var; Ayarlar'dan kapatılabiliyor.
  - Bkz. `docs/tasarim-ilkeleri.md`.
- **Hoşgörülü konum girişi:**
  - ondalık virgül veya nokta; K/G/D/B ve N/S/E/W;
  - derece-dakika-saniye; işaretli değer;
  - çift giriş ve harita bağlantısı;
  - tûlün yanlış alana yazılması hâlinde düzeltme;
  - yarım küre yazılmazsa Kuzey ve Doğu kabulü;
  - rakımda birim ve binlik ayırıcı.
- **Saha:** Saat, sıradaki olaya geri sayım ve akşam çubuğu sayfa kaydırılsa da görünen bir şeritte duruyor. Telefonda an çubuğu sadeleşti.
- **Kutup bölgeleri:** Kutup gecesi ile güneşin batmadığı günler ayrılıyor ve fıkhî not ekleniyor (s. 315).
- **GitHub Pages yayın iş akışı ve otomasyon kılavuzu** eklendi.
- **Testler:** 46 test (şafak usulü ve konum çözümleyici dâhil).

## 0.5.0 — 2026-11-11

- **Arayüz sadeleştirildi:**
  - tercihler ⚙ Ayarlar penceresine taşındı;
  - başlıkta sürüm etiketi var;
  - durum kartı ve "Yaklaşan ay başı rasadı" kartı her kipte aynı yapıda;
  - dokunulan kart ekranda yerinde kalıyor (sayfa kaymıyor).
- **Zaman kipleri:** Şimdi · canlı (yenileme aralığı seçilebilir), Şimdi · donduruldu, Rü'yet planlaması.
- **Ay başı rasadı gezintisi:** "◀ Önceki ay" ve "Sonraki ay ▶" düğmeleri seçili tarihten önceki veya sonraki ay başı rasad gecesine gider.
- **Hicrî tarih:** Yerel kapsam dünya genelinden farklıysa "Burada" satırı ekleniyor.
- **Saha sekmesi yeniden tasarlandı:**
  - "şimdi ne yapmalı?" satırı ve akşam çizelgesi;
  - gök görünümü her zaman şimdiki an için;
  - araç çubuğu.
- **Rü'yet kaydı v2 (`hilal-ruyet-kaydi/1`):**
  - sonuç türleri, ilk ve son görme saati, gök durumu, gözlem yeri, kişi sayıları, fotoğraf;
  - SHA-256 özeti ve cihaz imzası;
  - JSON dışa aktarma ve rapor metni.
- **A4 tutanak:** imza satırları, fıkhî hatırlatma, QR kodu.
- **Odaklı A4 baskı sayfaları:** rasad planı, gökyüzü haritası, aylık çizelge, dünya haritası (yatay), tutanak, boş form.
- **Hava tahmini başlangıçta kapalı.**
- **GitHub deposu düzeni:** belgeler, şema, doğrulayıcı, testler, issue şablonları.

## 0.4.0 — 2026-11-11

- Sürekli görünen an çubuğu; hicrî tarih (Muharrem'de iki yıl birlikte); canlı ve planlama kipleri.
- Güneş altı teması, yazı boyutu; okunur gök etiketleri; telefonda kaydırılabilir panorama.
- Gökyüzü haritası; yönelim yardımcıları.
- İsteğe bağlı çevrimiçi katman: otomatik konum, Open-Meteo hava ve pus tahmini.
- Baskı ve PDF.

## 0.3.0 — 2026-11-10

- Zaman çubuğu (günün her saati), karanlık eşiği seçimi, aylık rü'yet şeridi.
- Dünya haritasında anlık kip; sınıflar piksel düzeyinde ve zarif sınırlarla çiziliyor.
- 360° panorama; sabah hilâli; saat dilimi uyarısı.
- Hata düzeltmeleri: "Şimdi" düğmesi, saat dilimi ile konum uyumu, harita tıklaması.

## 0.2.0

- Dünya rü'yet haritası, ilk görünürlük haritası, batı ufku çizimi.
- Saha modu, gözlem planı, rü'yet kaydı, rehber.

## 0.1.0

- Hesap çekirdeği, kitabın sınıfları, detay paneli, aritmetik takvim usulleri, doğrulama testleri.
