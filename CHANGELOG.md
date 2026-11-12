# Sürümler

## 0.11.0 — 12 Kasım 2026

- **Ay başından ay başına geçiş:** Plan sekmesinde değerlendirmenin üstünde "◀ Önceki ay başı", "☰ Rasad geceleri" ve "Sonraki ay başı ▶" düğmeleri. Seçili akşamın hangi ayın rasad gecesi olduğu yazar.
- **Rasad geceleri listesi:** 13 kamerî ay; ictimâ, bu yer için rasad gecesi ve en elverişli akşam, dünyada en erken 1. gün. Tarihe dokununca o akşam planlanır; 12'şer ay ileri ve geri gidilir.
- **Açıklama penceresi:** Önceki ayın başı rü'yetle veya otuza tamamlamayla sabit olur; program bunu bilemez ve hiçbir başlangıcı varsaymaz.
  - Her ihtimal (hesâbî en erken gün, bir gün sonrası, rü'yet kaydı) ayrı satırda ve şartlı gösterilir: 29. gün akşamı, görülürse ve görülmezse yeni ayın 1. günü.
  - Bugünün kamerî günü her ihtimal için "önceki ay … günü başladıysa" diye yazılır.
  - Akşam tablosunda her akşamın şartı yazar: hilâl ilk kez o akşam görülürse 1. gün ertesi gündür; bunun için önceki ayın hangi gün başlamış olması gerektiği.
  - Kesin olan yalnız iki sınırdır: alt sınır (s. 360) ve ayın otuz günü aşmaması (s. 314–315).
  - "Bu yerde" sütununda sınıfın gerekçesi de yazar (ör. "Ay güneşten önce batıyor").
- **Rü'yetsiz hüküm kurulmaz:**
  - Hicrî tarih Saha'da, kartlarda ve A4 çıktılarında "(hesâbî)" etiketiyle yazılır.
  - Ay başına dair notlar şartlıdır: "o akşam görülüp sabit olursa ay başı ertesi gündür; bundan önce olamaz, rü'yetle sonra olabilir (s. 360)".
  - Çizelge ve harita "rü'yet imkânı" adını taşır; sınıf hesâbî imkândır, hilâlin görülüp görülmediği rasadla anlaşılır.
- **README:** A4 JPG çıktı örnekleri (küçük resme dokununca büyük açılır).

## 0.10.0 — 12 Kasım 2026

- **"Bu akşam ne demek?" açıklama penceresi:**
  - Seçili akşam ve yer için hilâlin Tam İlmihâl'e göre durumu, dünyada mümkün ve görülebilir olduğu bölgeler.
  - Ay başı senaryoları: 29. gün akşamı görülürse ve görülmezse yeni ayın 1. günü, "bir gün sonra olabilir, önce olamaz" alt sınırı (s. 360), otuza tamamlama (s. 314–315).
  - Ayın adına göre kapsam ve hüküm; Zilhiccede önce Işık usulü (s. 326).
  - Plan, Saha ve "Yaklaşan ay başı rasadı" kartlarındaki düğmeyle açılır.
- **Rehber → Naklî deliller:** Âyet, hadîs, icmâ ve âlimlerin bildirdikleri (Kongre tebliği, Türkiye Takvimi, 2016); kitabın hükümleri sayfalarıyla yanında.
- **Gökyüzü haritası (seçili akşam):** Batı göğü; hilâlin gurûbdan ay batımına kadar yeri ve akşam çizelgesi. A4, PDF veya JPG.
- **Pusula:** Kadran, hilâle veya gurûb noktasına kaç derece dönüleceği ve hilâlin kaç yumruk yukarıda olduğu. Telefon dik tutulunca arka kameranın yönü alınır. Güneş'e veya gurûb noktasına çevirerek manyetik sapma düzeltilir.
- **Bildirim ekleri:** Rü'yet kaydının kime, ne zaman ve nasıl bildirildiği. Kayıt mühürlü kalır; bildirim, kayda bağlı ve ayrıca imzalı bir ektir (`hilal-bildirim/1`). Tutanakta "Bildirildi" satırı. İleride kurulacak bir bildirim ağına hazır.
- **Kullanım tavsiyesi:** Hazırlık için büyük ekran; sahada önceden kaydedilmiş PDF.
- **Telefonda batı ufku:** Çizim ekrana sığar; yazılar hilâlin üstüne binmez.
- **Doğrulama:** Receb 1437 vakası (Kongre tebliği, s. 9) ve açıklama penceresi senaryoları testlere eklendi (58 test).

## 0.9.0 — 12 Kasım 2026

- **Kaynak önceliği:**
  - "Bu araç hakkında" notu: program bir fıkıh kaynağı değildir; kitaba uymayan her bilgi geçersizdir.
  - Kitabın Hakîkat Kitâbevi'ndeki sayfasına ve PDF'ine bağlantı.
  - Sayfa numaraları kitabın Ocak 2026 baskısına göredir.
- **Zilhicce:** Şahitle sabit olmayan yerler için ana gösterim Işık usulüdür (s. 326); astronomik hesap yanında ek bilgidir.
- **Durum bandı:** Seçili gün ve saatte rü'yetin durumunu renkle ve kısa bir ibareyle gösterir.
- **Görünüm:**
  - Sade görünümde ikincil kartlar katlı başlar; her kart başlığına dokunarak açılır.
  - Ayarlar'dan "Tam" görünüme dönülebilir.
- **Ufuk görselleri:**
  - Parlak yıldızlar ve gezegenler, isimleri birbirini örtmeden gösterilir.
  - Yönlerin yanında semt derecesi yazar.
  - Ufuk kartındaki zaman çubuğu bütün sayfanın saatini değiştirir.
- **Aylık rü'yet şeridi:** Günler kamerî aya göre gruplanır; üzerine gelince gündüzün ve gurûbdan sonraki hicrî tarih görünür.
- **Açıklamalar:** Kısa (varsayılan) veya ayrıntılı "?" notları; yeni notlar (rasad gecesi, şahitlik, çıplak göz şartı, gurûb ve temkin, kayıt doğrulama).
- **Çıktılar:**
  - A4 sayfaları PDF veya JPG olarak kaydedilir; birden çok sayfa ZIP olarak iner.
  - Dosya adları `MahiNev_tarih_saat_yer_tür` biçimindedir.
- **Rü'yet kaydı:**
  - "Kayıt doğrula" penceresi, tutanaktaki kodu kaydın JSON dosyasıyla karşılaştırır.
  - Yedekleme ve geri yükleme yapılabilir; fotoğraf özetle kayda bağlanabilir.
  - Sonuç türleri arasında "şüpheli" ve "gözlem yapılamadı" da vardır.
- **İnternet:** Program, kullanıcı Ayarlar'dan açmadıkça internete bağlanmaz. Hava tahmini ve internet yazı tipleri isteğe bağlıdır.
- **Saat:** UTC farkı kutusu saat dilimi listesiyle eşlenir; yaz saati notu gösterilir.
- **Göz güvenliği:** Rü'yetin mümkün olduğu akşamlarda kapatılabilir bir uyarı çıkar.

## 0.8.0 — 11 Kasım 2026

İlk genel yayın.
