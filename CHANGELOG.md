# Sürümler

## 0.13.0 — 13 Kasım 2026

- **Takvim usullerinin tanıtımı:** Işık usulü, Uluğ Beğ cetveli, Ebüzziyâ / Kindî cetveli, Madde 88 ve aritmetik (tabular) takvim, kullanıldıkları her yerde **?** açıklamasıyla tanıtılır (s. 326, 358–362). Açıklamalar her usulün nasıl çalıştığını ve neden başarılı olduğunu kısaca anlatır: Işık usulünün 4,367 sayısı ve ay rakamlarını taşıyan beyit, Uluğ Beğ'in 210 yıllık devri, Kindî cetvelinin 405 haftalık sekiz yılı, aritmetik takvimin üç saniyelik ortalama ay farkı.
- **Tarih alanları gün/ay/yıl biçiminde:** Akşamın tarihi, harita tarihi, rü'yet kaydı ve bildirim zamanı tarayıcının yerel biçiminden bağımsız olarak gün/ay/yıl (13/11/2026) gösterilir. Ayarlar → Tarih biçimi: gün/ay/yıl, gün.ay.yıl, yıl-ay-gün veya ay/gün/yıl. Tarih elle yazılabilir veya 📅 düğmesiyle takvimden seçilir.
- **İngilizce arayüzde kaynak:** Tam İlmihâl'in İngilizcesi *Endless Bliss*'in Hakîkat Kitâbevi sayfası. Sayfa numaraları Türkçe Tam İlmihâl'in Ocak 2026 baskısına göredir.
- **Dünyanın her yerinde:** Gök cisimleri aracı kutup gecesinde ve gündüzünde bütün günü tarar ve güneşin en yüksek / en alçak yüksekliğini yazar; şafağın bitmediği yaz gecelerinde "astronomik gece olmuyor" der. Yeni `tests/dunya_tarama.py` 47 uç konumda (kutuplar, tarih çizgisinin iki yanı, yarım ve çeyrek saatli dilimler, yaz saati geçişleri, Ölü Deniz, Everest, konumla uyuşmayan saat dilimi) ve 7 tarihte bütün sekmeleri, açıklama penceresini ve A4 çıktılarını Türkçe ve İngilizce dener.
- **Çok dilli altyapı:** Dil kaydı (`src/langs.js`): her dilin yerel ayarı, yazı yönü ve Tam İlmihâl'in o dildeki adı ve bağlantıları. Program kodundaki dile bağlı metinler sözlüklere taşındı; eksik bir metin İngilizceden gelir; dil düğmeleri kayıttan oluşur; sayıların ondalık ayracı dilin yerel ayarından gelir. Yeni dil ekleme rehberi: `docs/coklu-dil.md`.
- **Doğrulama:** 61 test; yeni "çok dilli" testi iki dilde anahtarların ve türlerinin aynı olduğunu ve her dilin kitap bağlantısını denetler.

## 0.12.0 — 13 Kasım 2026

- **İki gece esası:** Tam İlmihâl'e göre hilâl, hesâbın bildirdiği gecede doğar; o gece görülmeyip bir gece sonra görülebilir (s. 360). Rü'yetle başlama hesapla anlaşılandan bir gün sonra olabilir, önce olamaz (s. 315); bayram, Işık usulüyle bulunan gün yâhud bir gün sonradır (s. 326). Her ayın 1. günü bu iki günden biridir.
  - **Açıklama penceresi:** Ayın 1. günü için iki kutu (birinci gece görülürse / ikinci gece), bugünün kamerî günü tarihlerle, önceki akşam–birinci gece–ikinci gece tablosu. Ayın 29–30 gün çekmesi (s. 315) iki kısa cümleyle yazılır: önceki ayın iki ihtimalinden biri bu ayın 1. gününü kesinleştirir, diğeri rü'yete bırakır.
  - **Durum kartı ve kısa cevap:** "Ay başı" satırı, örneğin "1 Receb: 10 Ara Per veya 11 Ara Cum". Aynı bilgi rasad planı çıktısında da var.
  - **Neden iki sayı:** Hicrî günün iki sayısının hangi güne bağlı olduğu yazılır: "1 Receb 10 Ara Per ise 3, 11 Ara Cum ise 2".
  - **Rasad geceleri listesi:** Ayın 1. gününün iki ihtimali.
  - Hicrî tarih Tam İlmihâl'in kapsamıyla tek satırdır: Zilhicce dışında dünya geneli (s. 315), Zilhiccede Işık usulü (s. 326).
  - 2026–2030 arasındaki 60 kamerî ayın hepsinde dünyanın bir yerinde beynûnet en geç ikinci gece 18°'yi geçer (Osmanlı kabulü, s. 360).
- **Rasıdın kendi rü'yeti:** Birinci veya ikinci gece "gördüm" kaydı varsa açıklama penceresi ve Saha, bu rü'yete göre ayın 1. gününü tek cümleyle yazar. Kayıt şahitlik yerine geçmez (s. 315).
- **Kâdîhân ölçüsü** (s. 316) bilgi olarak verilir: "Bu akşam hilâl görülürse, Kâdîhân'a göre … gecenin hilâlidir." Program ay başını buna göre seçmez.
- **Gök cisimleri aracı:** "Seçili an" kartında Güneş, Ay, yedi gezegen ve 32 parlak yıldız; yön ve yükseklik, doğuş–tepe–batış, kadir, takımyıldız, alacakaranlık evreleri ve bu gece çıplak gözle görülebilecekler. Uzman düzeyde sağ açıklık, dik açıklık, Güneş'e açı ve uzaklık. Görünürlük temkinli bir çıplak göz tahminidir. Ay başı akşamlarında kapalı, diğer günlerde açık başlar.
- **Gezinme:**
  - Üst bantta ◀ ▶ gün okları ve **↶ Geri / İleri ↷**; "Şimdi" dahil her atlama geri alınabilir.
  - Ay başı gezintisi tek yerde: "◀ Önceki ay başı / Sonraki ay başı ▶" ve gece türü seçimi. Akşam kartında "Bugünün akşamı".
  - Ufuk kartındaki −10′ / +10′ gece yarısında güne geçer; gece yarısından sonraki saatler Akşam kartında açıklanır.
  - Planlama kipinde Saha sekmesi seçili anı "önizleme" olarak gösterir; rü'yet kaydı gerçek saati kullanır.
  - Haritadaki ◀ ▶ okları gün veya ay değiştirir.
- **Pencereler:** Her açıklama penceresi kendi "Kapat" düğmesiyle kapanır.
- **Metinler:** Kaynak program metinlerinde "Tam İlmihâl" adıyla anılır. "Bir gün sonra olabilir, önce olamaz" hükmü s. 315 ile gösterilir. Rehber → Kaynaklar'da Kongre tebliğinin tam adı ve bağlantısı.
- **Doğrulama:** 60 test (iki gece esası, Zilhiccede Işık usulü, gök cisimleri). Arayüz taraması her pencereyi Kapat düğmesiyle kapatır, kimlik çakışmasını ve gezinmeyi (↶, Saha önizlemesi) denetler.

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
