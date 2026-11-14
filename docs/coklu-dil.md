# Çok dilli altyapı

Mâh-ı Nev bugün beş dilde çalışır: Türkçe, İngilizce, Fransızca, İspanyolca ve Boşnakça. Türkçe ve İngilizce dosyada açık durur; Fransızca, İspanyolca ve Boşnakça **sıkıştırılmış dil paketi** olarak durur ve dil seçilince açılır (aşağıda). Altyapı, yeni bir dilin işlev ve bilgi kaybı olmadan eklenebileceği biçimde hazırlanmıştır. Bu belge yeni bir dilin nasıl ekleneceğini ve nelere dikkat edileceğini anlatır.

## İlkeler

- **Esas Tam İlmihâl'dir.** Her dilde hükümler Tam İlmihâl'e dayanır. Sayfa numaraları Türkçe Tam İlmihâl Se'âdet-i Ebediyye'nin **Ocak 2026 baskısına** göredir. Başka dildeki baskının sayfa düzeni farklıdır; bu her dilde bir notla belirtilir.
- **Her dilde kitabın kendi adı ve bağlantısı.** Örneğin İngilizcede *Endless Bliss* (Hakîkat Kitâbevi, dört fasikül). Bağlantılar `src/langs.js` dil kaydından gelir; programın başka hiçbir yerinde kitap bağlantısı elle yazılmaz.
- **Eksik metin İngilizceden gelir.** Bir dilde çevrilmemiş anahtar kalırsa program çalışmaya devam eder ve o metni İngilizce gösterir. Türkçe ve İngilizce her zaman tamdır; Doğrulama sekmesindeki "çok dilli" testi paketleri açıp beş dilde anahtarların ve türlerinin aynı olduğunu denetler.
- **Kodda dile bağlı metin yazılmaz.** Arayüz, açıklama penceresi ve çizimlerdeki metinler sözlüklerde durur; kod yalnızca anahtarları kullanır. Sayıların ondalık ayracı ve tarih biçimleri dilin yerel ayarından (`locale`) gelir.

## Sıkıştırılmış dil paketleri

Fransızca, İspanyolca ve Boşnakça metinler `src/lang/<kod>.js` dosyalarında tek bir nesne olarak tutulur (anahtarlar: `T`, `MONTHS`, `S`, `REGIONS`, `TOPICS`, `PLAN`, `GX`, `LONG`, `CANON`, `SX`, `STX`, `CARD16`, `GOK`, `SKYNAMES`, `SLUG`, `CITIES`, `MAPCITIES`). Derleme (`build.py`) her paketi deflate-raw ile sıkıştırıp base64 olarak dosyaya gömer (`window.HR_PACKS`). Dil düğmesine basılınca tarayıcı paketi `DecompressionStream` ile açar ve metinleri ilgili sözlüklere yerleştirir (`src/langs.js` → `load`); internet gerekmez. Bu özellik Chrome/Edge 103+, Firefox 113+ ve Safari 16.4+ sürümlerinde vardır; daha eski tarayıcıda uyarı verilir ve İngilizce kalır. Seçili dil hatırlanır; açılışta paket açılana kadar bir an İngilizce görünür.

Her modül kendi sözlüğünü bir adla kaydeder (`HRLangs.reg(ad, sözlük)`). Paket açılınca `sözlük[dil]` olarak yerleşir; nesne sözlüklerinde eksik anahtar İngilizceden gelir.

**Kaynak ve çeviri düzeni.** Anlamda esas Türkçe metindir; terimlerde ve kitaptan aktarılan cümlelerde İngilizce *Endless Bliss* esas alınır (bu dillerde Tam İlmihâl tercümesi yoktur). Atıflar her dilde Endless Bliss'e yapılır: Fransızca "EB V, p. 137", İspanyolca "EB V, pág. 137", Boşnakça "EB V, str. 137". Kaynaklar bölümünde kitaptan aktarılan sözlerin Endless Bliss'ten tercüme olduğu belirtilir. Terim adayları: [dil-terimleri.md](dil-terimleri.md).

**Araçlar.** `tools/dil/pack_dump.py` Türkçe ve İngilizce metinleri paket yapısında parçalara bölerek döker (çeviri kaynağı); `tools/dil/pack_check.js` bir çeviri parçasının yapısını İngilizceyle karşılaştırır (anahtarlar, türler, liste uzunlukları, işlev parametreleri, `${…}` ifadeleri, HTML etiketleri) ve `--build` ile parçaları birleştirip `src/lang/<kod>.js` yazar.

## Dosyalar

| Dosya | İçerik | Yeni dilde yapılacak |
|---|---|---|
| `src/langs.js` | Dil kaydı: ad, kısa ad, yerel ayar (`tr-TR`, `en-GB`), yazı yönü (`ltr` / `rtl`), Tam İlmihâl'in o dildeki adı, kitap sayfası ve PDF bağlantısı | Bir kayıt ekleyin ve `ORDER` listesine koyun |
| `src/i18n*.js` | Arayüz metinleri `T[dil]`, hicrî ay adları `MONTHS[dil]` | `T[dil]` ve `MONTHS[dil]` ekleyin (yeni bir `i18n_xx.js` dosyası olarak) |
| `src/explain.js` | "Bu akşam ne demek?" penceresi (`S[dil]`) ve bölge adları | `S[dil]` ve `REGIONS` satırlarına ad |
| `src/guide.js`, `src/guide_long.js`, `src/canon_en.js` | Rehber konuları, planlama listesi, kurallar tablosu ve kaynaklar (`GX`), kanonik metnin çevirisi (`CANON`) | `TOPICS[dil]`, `PLAN[dil]`, `GX[dil]`, `LONG[dil]`, `CANON[dil]` |
| `src/sky.js`, `src/starmap.js` | Ufuk ve gökyüzü çizimlerindeki yazılar (`SX`, `STX`), yön kısaltmaları | `SX[dil]`, `STX[dil]`, `CARD[dil]` |
| `src/gok.js` | Gök cisimlerinin adları | `NAMES[dil]` (yoksa İngilizce ad gösterilir) |
| `src/stars.js` | Yıldız ve takımyıldız adları `[tr, en]` | Diğer dillerde uluslararası (İngilizce) ad gösterilir |
| `src/ui.js`, `src/map.js` | Şehir adları `CITIES[].tr/en` ve harita şehirleri, dosya adı parçaları `KIND_SLUG` | Paket: `CITIES`, `MAPCITIES`, `SLUG` |
| `src/coords.js` | Yarım küre harfleri ve ondalık ayracı | `HLET` satırı (Fransızca, İspanyolca, Boşnakça: N/S/E/W ve virgül) |

## Yeni bir dil ekleme adımları

1. `src/langs.js` içine kaydı ekleyin. Tam İlmihâl'in o dildeki adını ve Hakîkat Kitâbevi bağlantılarını yazın.
2. Paketli dil için kayda `packed: true` yazın, `build.py` içindeki `PACK_LANGS` listesine ekleyin; `tools/dil/pack_dump.py` ile kaynağı döküp çevirin, `tools/dil/pack_check.js --build` ile `src/lang/xx.js` dosyasını üretin. (Açık dil için: `src/i18n_xx.js` ve tablodaki sözlüklere birer bölüm.)
3. Terimleri ve atıf biçimini belirleyin (aşağıdaki sözlük; Fransızca, İspanyolca, Boşnakça için [ceviri-yonergesi.md](ceviri-yonergesi.md)).
4. `python3 build.py`, `python3 tests/run_tests.py`, `HR_LANG=xx python3 tests/dunya_tarama.py` ve `python3 tests/ui_tarama.py` çalıştırın (`HR_LANGS=tr,xx` ile yalnız seçili diller).
5. Terimleri o dildeki Tam İlmihâl baskısıyla karşılaştırın (aşağıdaki sözlük).

## Terimler

Program bu terimleri her dilde aynı anlamla kullanır. Çeviride o dildeki Tam İlmihâl baskısının karşılıkları esas alınır; İngilizcede Endless Bliss’in terimleri ve sayfaları kullanılır (ayrıntılı liste ve sayfa eşlemesi: docs/endless-bliss-esleme.md). Arayüzde hilâl için "crescent" denir; çünkü İngilizcede "new moon" astronomide ictimâ anlamına da gelir. Aynı sebeple Fransızcada "croissant", İspanyolcada "creciente", Boşnakçada "hilal" denir ("nouvelle lune", "luna nueva" kullanılmaz). Fransızca, İspanyolca ve Boşnakça terimler: [ceviri-yonergesi.md](ceviri-yonergesi.md).

| Türkçe | İngilizce (programda) | Anlamı |
|---|---|---|
| hilâl | crescent (Endless Bliss: new moon) | yeni ayın ince yayı |
| rü'yet | sighting | hilâlin gözle görülmesi |
| gurûb (şer'î gurûb) | sunset (shar’î sunset) | güneşin üst kenarının şer'î ufukta batışı |
| beynûnet | beynûnet (elongation) | ay ile güneş arasındaki açı |
| ictimâ | conjunction (ijtimâ’) | ay ile güneşin aynı boylamda buluşması |
| muhak | muhâq | ayın görünmediği süre |
| temkin | Tamkin | hakîkî vakit ile şer'î vakit arasındaki fark |
| hesâbî | computed / calculated | hesapla bulunan, rü'yetle kesinleşmemiş |
| Işık usulü | Işık method | Hüseyn Hilmi Işık'ın ay başı usulü (s. 359) |

## Sağdan sola yazılan diller

Arapça, Farsça ve Urduca için dil kaydında `dir: 'rtl'` yazılır; program sayfanın `dir` ve `lang` niteliklerini buna göre ayarlar. Çizimler (ufuk, gökyüzü, harita) yön gösterdiği için soldan sağa kalır. Kartların ve tabloların sağdan sola düzeni ilk sağdan sola dil eklenirken denenmeli ve gereken stil düzeltmeleri yapılmalıdır.

## Yazı tipleri

Program sistem yazı tiplerini kullanır; Arap, Kiril ve Hint yazıları işletim sisteminin yazı tipleriyle gösterilir. Yeni bir yazı sistemi eklenirken telefon ve masaüstünde görünüm denenmelidir.
