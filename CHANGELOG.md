# Değişiklik günlüğü

## 0.9.0 — geliştirme (henüz yayımlanmadı)

- **İnternet bağlantıları ve izinler:** Ayarlar'da yeni bir bölüm var. Hava tahmini ve internet yazı tipleri (Google Fonts) buradan açılır; ikisi de başlangıçta kapalıdır. Bölüm, açık bağlantıları ve bütün bağlantıları kapsayan gizlilik açıklamasını gösterir.
  - Otomatik konum internet kullanmaz.
  - Otomatik konumda zemin rakımı, yalnızca hava tahmini açıksa sorulur.
- **JPG çıktısı:** "Yazdır / PDF"in yanında "JPG resmi olarak kaydet" düğmesi var.
  - Her A4 sayfası yaklaşık 240 dpi bir JPEG resmi olur; birden çok sayfa ZIP dosyası olarak iner.
  - Aynı seçenek gökyüzü haritasında ve rü'yet tutanağında da bulunur.
- **Yön etiketlerinde derece:** Batı ufku, 360° ufuk ve gökyüzü haritasında yön kısaltmalarının yanında semt derecesi yazar (K 0°, KD 45°, … GB 225°, B 270°).
- **UTC saat farkı kutusu:** Konum kartında, saat dilimi listesinin yanında yer alır.
  - Kutu, seçili dilimin seçili tarihteki farkını gösterir (+3 gibi).
  - Kutuya fark yazılırsa (+3, −5, +5:30, UTC+2) o farka uyan sabit dilim seçilir.
  - Liste iki gruptan oluşur: yaz saatini izleyen bölgesel dilimler ve sabit farklar. Her dilimin yanında farkı yazar.
  - Elle girilen konum seçili dilimden çok uzaksa fark tûlden hesaplanır.
- **Kaynak önceliği:**
  - Sayfanın altında ve Rehber'in başında "Bu araç hakkında" notu var: program bir fıkıh kaynağı değildir, kitaba uymayan her bilgi geçersizdir.
  - Kitabın Hakîkat Kitâbevi'ndeki sayfasına ve PDF'ine bağlantı verildi.
  - Sayfa numaralarının kitabın Ocak 2026 baskısına göre olduğu belirtiliyor.
  - "Resmî sürüm" ifadeleri kaldırıldı; yerlerine "yayın adresi" ve "değiştirilmiş kopya" kullanılıyor.
- **Durum bandı:** Üstteki bant, seçili gün ve saatte rü'yetin durumunu renkle ve kısa bir ibareyle gösterir.
  - Yeşil: hilâl aranabilir veya bu akşam mümkün.
  - Kırmızı: kesin red veya 5°'nin altı.
  - Gri: ay başı akşamı değil veya pencere geçti.
- **Hava tahmini:** İbareler yalnız havayı anlatıyor ("Hava: batı ufku açık görünüyor"). Hilâlin görülemeyeceği akşamlarda bu ayrıca yazılıyor.
- **Göz güvenliği uyarısı:** Yalnız rü'yetin mümkün olduğu akşamlarda görünür. Kapatılabilir; Ayarlar'dan yeniden açılır.
- **Ufuk görselleri:**
  - 360° ufukta parlak yıldızlar ve gezegenler, isimleri birbirini örtmeyecek biçimde yazılır.
  - Ufuk kartında bir zaman çubuğu var (±10 dakika düğmeleriyle); kaydırınca bütün sayfa o ana göre güncellenir.
- **Aylık rü'yet şeridi:**
  - Günler hesâbî kamerî aya göre gruplanır; her kutuda kamerî gün numarası yazar ve ay başının belirsiz olduğu gün "1?" ile işaretlenir.
  - Kutunun üzerine gelince, gündüzün ve gurûbdan sonraki hicrî tarih görünür.
- **Açıklamalar ("?" notları):**
  - Ayarlar'da açıklama düzeyi seçilir: kısa (varsayılan) veya ayrıntılı.
  - Her notun altında "Ayrıntılı açıklama" açılabilir.
  - Yeni notlar eklendi: rasad gecesi, şahitlik, çıplak göz şartı, gurûb ve temkin.
- Saat dilimi hesaplarında biçimleyiciler önbelleğe alındı; arayüz daha hızlı tepki veriyor.
- Belgeler sürüm geçmişi ve düzeltme notları içermeyecek biçimde sadeleştirildi. Gelecek işler için [docs/yol-haritasi.md](docs/yol-haritasi.md) eklendi.

## 0.8.0 — 2026-11-11 · ilk genel yayın

Mâh-ı Nev'in ilk genel sürümü.

- **Ad:** Mâh-ı Nev — Hilâl Rasad Yardımcısı. Tam İlmihâl Se'âdet-i Ebediyye esaslıdır.
- **Biçim:** Tek dosya, çevrimdışı çalışan HTML; Türkçe ve İngilizce arayüz.
- **Akşam değerlendirmesi:**
  - Değerlendirme kitabın sınıflarına göre yapılır: ictimâ, beynûnet 8°/18° ve ufuktan 5° (s. 360).
  - Kesin red ve Kâdîhân kontrolü verilir. Kâdîhân'da esas −19° (İmâm-ı a'zam); İmâmeyn −17° alternatif olarak gösterilir.
- **Rasad planlaması:**
  - yaklaşan ve önceki ay başı rasadı, aylık rü'yet şeridi;
  - dünya rü'yet haritası;
  - batı ufku, 360° ufuk ve gökyüzü haritası.
- **Saha kipi:** canlı saat, geri sayım ve göz güvenliği uyarısı.
- **Hicrî tarih:** Hesâbîdir ve kitabın s. 360 hükmüyle birlikte gösterilir. Kamerî gün şer'î gurûbda değişir.
- **Rü'yet kaydı ve A4 tutanak:**
  - SHA-256 özeti, cihaz imzası ve QR kodu;
  - yedekleme, geri yükleme ve fotoğraf doğrulama.
- **Odaklı A4 çıktılar:** rasad planı, gökyüzü haritası, aylık çizelge, dünya haritası ve tutanak.
- **Ek bilgiler:** Modern ölçütler (Yallop, Odeh) ve aritmetik takvim usulleri yalnızca ek bilgi olarak verilir.
- **Lisans:** CC BY-NC-ND 4.0. Resmî sürüm bildirimi ve bütünlük denetimi vardır.
