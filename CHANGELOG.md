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
