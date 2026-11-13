# Çok dilli altyapı

Mâh-ı Nev bugün Türkçe ve İngilizce çalışır. Altyapı, yeni bir dilin işlev ve bilgi kaybı olmadan eklenebileceği biçimde hazırlanmıştır. Bu belge yeni bir dilin nasıl ekleneceğini ve nelere dikkat edileceğini anlatır.

## İlkeler

- **Esas Tam İlmihâl'dir.** Her dilde hükümler Tam İlmihâl'e dayanır. Sayfa numaraları Türkçe Tam İlmihâl Se'âdet-i Ebediyye'nin **Ocak 2026 baskısına** göredir. Başka dildeki baskının sayfa düzeni farklıdır; bu her dilde bir notla belirtilir.
- **Her dilde kitabın kendi adı ve bağlantısı.** Örneğin İngilizcede *Endless Bliss* (Hakîkat Kitâbevi, dört fasikül). Bağlantılar `src/langs.js` dil kaydından gelir; programın başka hiçbir yerinde kitap bağlantısı elle yazılmaz.
- **Eksik metin İngilizceden gelir.** Bir dilde çevrilmemiş anahtar kalırsa program çalışmaya devam eder ve o metni İngilizce gösterir. Türkçe ve İngilizce her zaman tamdır; Doğrulama sekmesindeki "çok dilli" testi iki dilde anahtarların ve türlerinin aynı olduğunu denetler.
- **Kodda dile bağlı metin yazılmaz.** Arayüz, açıklama penceresi ve çizimlerdeki metinler sözlüklerde durur; kod yalnızca anahtarları kullanır. Rehberdeki kurallar tablosu ve kaynak listesi şimdilik Türkçe/İngilizce ikilisidir. Sayıların ondalık ayracı ve tarih biçimleri dilin yerel ayarından (`locale`) gelir.

## Dosyalar

| Dosya | İçerik | Yeni dilde yapılacak |
|---|---|---|
| `src/langs.js` | Dil kaydı: ad, kısa ad, yerel ayar (`tr-TR`, `en-GB`), yazı yönü (`ltr` / `rtl`), Tam İlmihâl'in o dildeki adı, kitap sayfası ve PDF bağlantısı | Bir kayıt ekleyin ve `ORDER` listesine koyun |
| `src/i18n*.js` | Arayüz metinleri `T[dil]`, hicrî ay adları `MONTHS[dil]` | `T[dil]` ve `MONTHS[dil]` ekleyin (yeni bir `i18n_xx.js` dosyası olarak) |
| `src/explain.js` | "Bu akşam ne demek?" penceresi (`S[dil]`) ve bölge adları | `S[dil]` ve `REGIONS` satırlarına ad |
| `src/guide.js`, `src/guide_long.js`, `src/canon_en.js` | Rehber konuları, planlama listesi, kurallar tablosu, kaynaklar, kanonik metnin çevirisi | `TOPICS[dil]`, `PLAN[dil]`, `LONG[dil]`; kurallar ve kaynaklar şimdilik Türkçe/İngilizce ikilisidir, yeni dil İngilizceyi görür |
| `src/sky.js`, `src/starmap.js` | Ufuk ve gökyüzü çizimlerindeki yazılar (`SX`, `STX`), yön kısaltmaları | `SX[dil]`, `STX[dil]`, `CARD[dil]` |
| `src/gok.js` | Gök cisimlerinin adları | `NAMES[dil]` (yoksa İngilizce ad gösterilir) |
| `src/stars.js` | Yıldız ve takımyıldız adları `[tr, en]` | Şimdilik İngilizce ad gösterilir |
| `src/ui.js` | Şehir adları `CITIES[].tr/en`, dosya adı parçaları `KIND_SLUG` | Şehir adları ve dosya adı parçaları (yoksa İngilizce) |

## Yeni bir dil ekleme adımları

1. `src/langs.js` içine kaydı ekleyin. Tam İlmihâl'in o dildeki adını ve Hakîkat Kitâbevi bağlantılarını yazın.
2. `src/i18n_xx.js` dosyasını oluşturun: `T.xx = {...}` ve `MONTHS.xx = [...]`. Dosyayı `build.py` içindeki `ORDER` listesine ekleyin.
3. Yukarıdaki tablodaki sözlüklere birer bölüm ekleyin.
4. `python3 build.py`, `python3 tests/run_tests.py`, `HR_LANG=xx python3 tests/dunya_tarama.py` ve `python3 tests/ui_tarama.py` çalıştırın.
5. Terimleri o dildeki Tam İlmihâl baskısıyla karşılaştırın (aşağıdaki sözlük).

## Terimler

Program bu terimleri her dilde aynı anlamla kullanır. Çeviride o dildeki Tam İlmihâl baskısının karşılıkları esas alınır.

| Türkçe | İngilizce (programda) | Anlamı |
|---|---|---|
| hilâl | crescent | yeni ayın ince yayı |
| rü'yet | sighting | hilâlin gözle görülmesi |
| gurûb (şer'î gurûb) | sunset (legal sunset) | güneşin üst kenarının şer'î ufukta batışı |
| beynûnet | beynûnet (elongation) | ay ile güneş arasındaki açı |
| ictimâ | conjunction | ay ile güneşin aynı boylamda buluşması |
| muhak | muhak | ayın görünmediği süre |
| hesâbî | computed / calculated | hesapla bulunan, rü'yetle kesinleşmemiş |
| Işık usulü | Işık method | Hüseyn Hilmi Işık'ın ay başı usulü (s. 359) |

## Sağdan sola yazılan diller

Arapça, Farsça ve Urduca için dil kaydında `dir: 'rtl'` yazılır; program sayfanın `dir` ve `lang` niteliklerini buna göre ayarlar. Çizimler (ufuk, gökyüzü, harita) yön gösterdiği için soldan sağa kalır. Kartların ve tabloların sağdan sola düzeni ilk sağdan sola dil eklenirken denenmeli ve gereken stil düzeltmeleri yapılmalıdır.

## Yazı tipleri

Program sistem yazı tiplerini kullanır; Arap, Kiril ve Hint yazıları işletim sisteminin yazı tipleriyle gösterilir. Yeni bir yazı sistemi eklenirken telefon ve masaüstünde görünüm denenmelidir.
