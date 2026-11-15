# Devam notu (çalışma hafızası)

Bu dosya, işin bir sohbetten ötekine kayıpsız geçmesi için tutulur. Yeni bir oturumda önce bu dosya, sonra `docs/endless-bliss-esleme.md`, `docs/dil-terimleri.md`, `docs/kanonik-rapor.md` (D1–D19) ve `docs/yol-haritasi.md` okunur. Son güncelleme: 15 Kasım 2026 (fr/es/bs çevirileri yapıldı; geri çeviri denetimi yarıda).

## 1. Proje
- **Mâh-ı Nev — Hilâl Rasad Yardımcısı.** Tek dosya, internetsiz, çok dilli HTML5 hilâl rasad yardımcısı.
- Depo: https://github.com/bemiroglu/MahiNev · Yayın (GitHub Pages, `main` dalından): https://bemiroglu.github.io/MahiNev/
- Esas kitap: **Tam İlmihâl Se’âdet-i Ebediyye** (Hakîkat Kitâbevi; sayfa numaraları Ocak 2026 baskısına göre). İngilizcesi **Endless Bliss** (altı fasikül).
- Program takvim değildir. Hesâbî imkânı ve kesin reddi gösterir; rü’yet olmadan hüküm vermez.
- Kullanıcıya Türkçe yazılır.

## 2. Kanonik duruş (kullanıcının sözleri, aynen korunur)
- “‘Turkey’, 2016 kongresinde kabul edilen birleşik takvim ölçütü ve Tam İlmihâl’in rü’yet esasına tamamen zıt; … takvimleri birleştirme cür’etleri, hem bizim programımızın hem ehl-i sünnet yaklaşımın hilafına … diğer programlardan böyle reformist, ehl-i sünnete mugayir fikirler, bilgiler, esinlenmeler almayacağız.”
- Diğer programlar yalnız kendi doğrularımızı daha iyi anlatmak ve gösterim kalitesinde geri kalmamak için incelenir. Takvim birleştirme ölçütleri (2016 “Türkiye”, MABIMS, Wujudul Hilal, IQG …) ek bilgi olarak da kullanılmaz (D17). Yallop ve Odeh ek bilgidir, ana katman olmaz.

## 3. Kalıcı kurallar
1. GitHub’a yalnız kullanıcı açıkça isteyince yüklenir. `gelistirme` dalı, kullanıcı onayıyla ara kayıt için kullanılır (yayını değiştirmez). `main`’e itmek yayımlamaktır.
2. Etiket ve GitHub sürüm sayfası bu ortamdan açılamıyor (etiket gönderimi bağlantıda kesiliyor; `gh release` 403). Kullanıcı elle açar; ona sürüm notu metni verilir.
3. “Resmî” iddiası yok. HTML’de ve GitHub’da geçmiş düzeltmelere atıf yok; CHANGELOG bugünkü durum diliyle yazılır.
4. Önce Tam İlmihâl; modern bilgi yalnız “ek bilgi”.
5. Program izinsiz internete çıkmaz. Ağır kütüphane ve canlı internet malzemesi yok. Dosya boyutu amaca bağlı tutulur; amaçla doğrudan ilgisi olmayan özellikle büyütülmez.
6. Kitabın adı “Tam İlmihâl” diye geçer (yalnız “kitap” değil). Tarihler varsayılan gg/aa/yyyy.
7. İngilizce kitap bağlantısı yalnız site sayfası: https://www.hakikatkitabevi.net/book.php?bookCode=025
8. HTML dosyaları kullanıcıya SendUserFile ile gönderilir (artifact yayımlanmaz).
9. Arayüz düzenli ve geri alınabilir olur.
10. Commit sonu iki satır: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` ve `Claude-Session: …` (oturumun verdiği adres). PR açıklaması “🤖 Generated with [Claude Code](https://claude.com/claude-code)” ile biter.
11. Kullanıcının e-posta adresi gizlidir; dış hizmetlere verilmez.
12. Kayıp korkusu: kullanıcı geçmişte başka bir yapay zekâda bütün sohbetini kaybetmiş. Her önemli adımda bu not güncellenir ve kullanıcı onayıyla `gelistirme`’ye kaydedilir; sohbet dolmaya yaklaşınca kullanıcı önceden uyarılır.

## 4. Tam İlmihâl’in ölçüleri (programın çekirdeği)
- Beynûnet < 8°: kesin red; 8°–18°: mümkün; ≥ 18°: görülebilir (Osmanlı âlimlerinin kabulü). Gözlem penceresi: zâhirî gurûbdan hilâlin 5° irtifâya inişine kadar; 57′ ihtilâf-ı manzar (s. 360 = EB V, p. 137).
- Ayın 1. günü hesâbî gün veya bir gün sonrasıdır, önce olamaz (s. 315 = EB V, p. 57). Arefe de böyle (s. 326, 360 = EB V, pp. 79, 138).
- Ay 29 veya 30 gün (s. 315). Ramazan küresel, kurban ve namaz vakitleri mahallî (Zilhicce hariç küresel kapsam).
- Kâdîhân şafak kuralı yalnız bilgi olarak gösterilir (s. 316 = EB V, p. 58).
- İki gece modeli: 1. gün = H (hesâbî) veya H+1. Önceki ay 29 ya da 30 çektiyse tek seçenek kalır.
- Hesap motoru: Astronomy Engine 2.1.19 (MIT), dosyaya gömülü.

## 5. Yapı
- Kaynak `src/`, derleme `python3 build.py` (sıra `build.py` içindeki ORDER), çıktı `dist/mahinev.html` ve `dist/mahinev-vX.html`. Bütünlük özeti derlemede hesaplanır.
- Önemli modüller: `langs.js` (dil kaydı: tr, en; kitap adı ve bağlantıları), `i18n*.js` (T.tr, T.en; eksik anahtar İngilizceden gelir), `core.js` (hesap; `cellX`, `crescentData`), `map.js` (dünya haritası), `relief.js` (gömülü kabartma, NASA Blue Marble, ≈ 25 KB), `explain.js`, `guide.js`, `guide_long.js` (Rehber), `canon_en.js` (kanonik metnin İngilizcesi), `sky.js`, `starmap.js`, `gok.js`, `calendars.js`, `ui.js`.
- Testler: `python3 tests/run_tests.py` (Doğrulama sekmesi, 63 test; dil eşliği dâhil), `python3 tests/ui_tarama.py`, `python3 tests/dunya_tarama.py` (İngilizce için `HR_LANG=en`; 47 yer × 7 tarih). Uzun sürenler arka planda çalıştırılır.
- Yardımcı araçlar: `tools/README.md` (dil araçları `tools/dil/`, görsel ve A4 denetimi `tools/gorsel/`).
- GitHub iş akışları: `ci.yml` (her itmede derleme ve test), `pages.yml` (yalnız `main`).

## 6. Sürümler
- 0.13.0 ve 0.14.0 yayımlandı (`main`; 0.14.0 = commit 25670d8; etiket v0.14.0 kullanıcı tarafından açıldı).
- `gelistirme` dalı: 0.14.1-deneme.1 — İngilizce metinler Endless Bliss’e göre. `main` değişmedi.
- 0.14.0’da gelenler: haritada Tam İlmihâl ölçü çizgileri (8°, 18°, 5°), üç gece, ilk mümkün / görülebilir yer, enlem-boylam ağı, şehirler, kabartma, seçimlik değer çizgileri, seçili dilde PNG, her gece ayrı A4, Plan → Ek bilgi’de hilâl verileri tablosu, çıktı resimlerinde küçük “Mâh-ı Nev · bemiroglu.github.io/MahiNev”.

## 7. İngilizce (tamamlandı, kullanıcı onayladı)
- İngilizce arayüz Endless Bliss’in terimlerini kullanır; atıflar “EB V, p. 137” biçiminde (fasikül, sayfa). Kullanılan baskılar: IV. fasikül 21. baskı, V. fasikül 17. baskı (Ağustos 2020).
- Arayüzde hilâl için “crescent” kalır (kitap “new moon” der; İngilizcede bu ictimâ ile karışır).
- Işık usulü: Endless Bliss’in İngilizce beyti, yanında parantezde Tam İlmihâl’deki beyit ve ebced değerleri.
- İmâm-ı Sübkî’nin uzun sözü Endless Bliss’te yok; orada bizim çevirimiz kalır. Kanonik metnin “hilâlin doğması” kavramı olduğu gibi kalır.
- 162 atıf Endless Bliss sayfalarıyla tek tek denetlendi. Sayfa ve terim eşlemesi: `docs/endless-bliss-esleme.md`.

## 8. ŞU ANKİ İŞ: Fransızca, İspanyolca, Boşnakça

### Durum (15 Kasım, ikinci oturum)
- Kullanıcı çeviri ve geri çeviri denetimini ayrı yardımcılara (subagent) yaptırmaya izin verdi; yardımcılar sonucu yalnız dosyaya yazar.
- **Yapıldı:** altyapı (`langs.js`: `reg`/`load`/`packed`, `HR_PACKS`; `build.py`: `PACK_LANGS`, deflate-raw + base64; modüller sözlüklerini `HRLangs.reg` ile kaydeder; `guide.js` kurallar/kaynaklar `GX` sözlüğüne, kanonik metin `CANON`'a taşındı; `coords.js` `HLET`; `ui.js` şehirler, harita şehirleri, `SLUG`, açılışta paket yükleme, `setLang` paketi açar). Çeviriler 9 yardımcıyla yapıldı: `src/lang/fr.js`, `es.js`, `bs.js` (her biri ≈ 55 KB base64; dosya ≈ 1,17 MB). Yapı denetimi 0 hata; 63/63 test (dil eşliği beş dilde); `HR_LANGS=fr,es,bs` arayüz taraması yalnız açıklama penceresinde Türkçe sayfa numarası buldu → düzeltildi (`S.pg` artık 315/326/360'ı EB V, 57/79/137'ye çevirir; İngilizcede de vardı).
- Araçlar: `tools/dil/pack_dump.py` (kaynak döküm: ui1, ui2, ui3, misc, guide, long parçaları; `.tr.js` + `.en.js`), `tools/dil/pack_check.js` (yapı denetimi; `--build` paketi yazar). Çeviri yönergesi ve terim tablosu: `docs/ceviri-yonergesi.md`; geri çeviri yönergesi: `docs/ceviri-denetimi/YONERGE-geri-ceviri.md`.
- Kanonik metin: çeviriler İngilizcenin 26 paragraf düzenini izler (Türkçe 28; iki çift birleşik, "(YENİ) Rü'yet-i Hilâl linkine tıklayınız" cümlesi İngilizcedeki gibi yok).
- **Yarıda:** geri çeviri denetimi. 9 denetçi kullanım sınırına takıldı. Kör geri çeviriler (Türkçe) `docs/ceviri-denetimi/geri/*.geri.txt`'de saklı (eksik: ui2.fr, ui2.bs, ui3.bs, misc.bs, long.bs). Karşılaştırma ve raporlar (`*.rapor.md`) henüz yok; düzeltmeler uygulanmadı.
- Devam için: kaynakları yeniden dök (`python3 build.py && python3 tools/dil/pack_dump.py DİZİN/kaynak`), çevirileri paketten parçalara ayırmak gerekirse `src/lang/<dil>.js` tek nesnedir (T anahtarları ui1–ui3'e bölünür). Denetimi bitir, düzeltmeleri uygula, `--build` ile paketleri yeniden yaz; sonra dünya taraması (her dil), A4 denetimi, boyut raporu, deneme dosyası kullanıcıya.
- Yerel commit'ler var; GitHub'a (gelistirme) yükleme kullanıcının sözüyle.

### Önceki kararlar
Kullanıcının 15 Kasım kararları:
- Ek diller **sıkıştırılmış dil paketi** olarak eklenecek. Türkçe ve İngilizce açık kalır; yeni diller dosyada sıkıştırılmış (deflate-raw + base64) durur, dil seçilince tarayıcının `DecompressionStream` özelliğiyle açılır (Chrome/Edge 103+, Firefox 113+, Safari 16.4+; desteklenmezse İngilizce). İnternet gerekmez.
- **Her şey çevrilecek:** arayüz, açıklamalar, Rehber ve kanonik metin.
- Çeviriyi Claude yapacak. Kullanıcı bu dilleri bilmediği için **işlem sonunda bağımsız bir geri çeviri denetimi** yapılacak (çevrilen metin Türkçeye geri çevrilip aslıyla anlam bakımından karşılaştırılır; sapmalar düzeltilir, rapor edilir).
- **Kaynak:** anlamda esas Türkçe metin; terimlerde ve kitaptan aktarılan cümlelerde İngilizce Endless Bliss. Fransızca, İspanyolca ve Boşnakça Tam İlmihâl tercümesi yok.
- Hakîkat Kitâbevi’nin bu dillerdeki yakın konulu kitapları yalnız terim için incelenir; onlardan metin alınmaz. Bulunan terim adayları: `docs/dil-terimleri.md`. Kitaplar: Fransızca *Foi et Islam* (2025), *Livre de la prière* (3. baskı, 2025); İspanyolca *Libro del Namâz* (1. baskı, 2016); Boşnakça *Knjiga o namazu* (9. izdanje), *Iman i islam* (12. izdanje, 2025), *Odgovor neprijatelju islama* (8. izdanje, 2025).
- Atıflar her dilde Endless Bliss’e: “EB V, p. 137”; sayfa kısaltması dile göre (es “pág.”, fr “p.”, bs “str.”). Kitaptan aktarılan cümleler “Endless Bliss’ten tercüme” diye belirtilir.
- Boşnakçada yerleşik İslâmî terimler Türkçeye yakındır (Ramazan, Bajram, kurban, hilal / mlađak, akšam, jacija, sabah, ezan, takvim); bunlar kullanılır.
- Kullanıcının kullanım kapasitesi az zorlanmalı ve sohbet dolmamalı. Çeviriyi ayrı yardımcılara (subagent) yaptırmak için kullanıcıdan açık izin henüz alınmadı; yeni sohbette işi nasıl böleceğimizi kullanıcıya kısaca sorup onayla başla.
- Bitince: derleme, testler (dil eşliği beş dil için), arayüz ve dünya taramaları (her dil), A4 denetimi, boyut raporu; deneme dosyası kullanıcıya gönderilir. GitHub’a yükleme kullanıcı onayından sonra.

Boyut tahmini (15 Kasım ölçümü): İngilizce metin ≈ 95 KB (arayüz 51, Rehber 29, kanonik 7, açıklamalar 7). Sıkıştırılınca ≈ üçte bir. Dil başına sıkıştırılmış paket ≈ 47–54 KB; üç dil ≈ 155 KB; dosya ≈ 996 KB → ≈ 1,15 MB.

Uygulama adımları (öneri):
1. `langs.js`’e es, fr, bs kayıtları (ad, kısaltma, yerel biçim `es-ES`, `fr-FR`, `bs-BA`, yedek `en`, kitap: Endless Bliss bağlantısı). Dil seçicisi beş dil.
2. Çeviri kaynağı: `tools/dil/enspans.js` ile İngilizce dizgiler; her satırın Türkçesi yanına. Çeviri dosyaları `src/lang/es.json` gibi düz kaynak olarak tutulur; derlemede sıkıştırılıp gömülür (`build.py`).
3. Çalışma anında: dil seçilince paket açılır, T[lang] ve diğer modüllerin sözlükleri (explain, guide, guide_long, canon, sky, starmap, gok, MONTHS) doldurulur.
4. Dil eşliği testi beş dile genişletilir.
5. Geri çeviri denetimi ve rapor.

## 9. Sıradaki işler (yol haritası)
- Harita 2. aşama: tıklanan yer kartı (Hilâl verileri tablosu), bölgesel yakınlaştırma (±25°, 0,5°), web worker, hızlı ilk çizim, kendi kayıtları haritada, iki değer çizgisi, ek çıktı seçenekleri.
- Harita 3. aşama: isteğe bağlı yüksek çözünürlüklü kabartma, sabah hilâli haritası, gözlem geçmişi, zaman şeridi, ayrıntılı kıyı verisi.

## 10. Ortam notları
- Çalışma alanında depo `/home/claude/mahinev`. Yeni oturumda depo yeniden eklenir ve klonlanır (`bemiroglu/MahiNev`), `gelistirme` dalına geçilir.
- Sohbete yüklenen dosyalar yeni sohbete geçmez. Endless Bliss’in bulguları bu notta ve `docs/endless-bliss-esleme.md`’de saklıdır; tekrar yüklemek gerekmez. Fransızca, İspanyolca ve Boşnakça kitapların bulguları `docs/dil-terimleri.md`’dedir; çeviride daha ayrıntılı bakmak gerekirse kullanıcı bu kitapları yeni sohbete yeniden yükler.
- Uzun süren komutlar (taramalar) arka planda çalıştırılıp sonucu beklenir.
