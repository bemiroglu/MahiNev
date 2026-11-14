# Devam notu (çalışma hafızası)

Bu dosya, sohbet uzayıp eski yazışmalar özetlendiğinde veya yeni bir oturum açıldığında işin kaldığı yerden sürmesi için tutulur. Yeni oturumda önce bu dosya okunur.

## Proje
- Mâh-ı Nev — Hilâl Rasad Yardımcısı. Tek dosya, internetsiz, çok dilli (TR/EN) HTML5.
- Depo: github.com/bemiroglu/MahiNev · Yayın: bemiroglu.github.io/MahiNev
- Esas: Tam İlmihâl Se’âdet-i Ebediyye (Ocak 2026 baskısı sayfa numaraları). Program takvim değildir; hesâbî imkânı ve kesin reddi gösterir, rü’yet olmadan hüküm vermez.
- Yayımlanan son sürüm: 0.14.0 (13 Kasım 2026; commit 25670d8; main = gelistirme).

## Kalıcı kurallar (kullanıcının talimatları)
- GitHub’a yalnız kullanıcı açıkça isteyince yüklenir. Etiket ve sürüm sayfasını kullanıcı elle açar.
- "Resmî" iddiası yok. HTML’de ve GitHub’da geçmiş düzeltmelere atıf yok; CHANGELOG bugünkü durum diliyle yazılır.
- Önce Tam İlmihâl; modern bilgi yalnız "ek bilgi". Yallop/Odeh ek bilgidir, ana katman olmaz.
- Takvim birleştirme ölçütleri (2016 "Türkiye", MABIMS, Wujudul Hilal, IQG…) hiçbir şekilde, ek bilgi olarak da kullanılmaz (kanonik rapor D17). Diğer programlardan yalnız gösterim kalitesi ve kendi doğrularımızı anlatmaya yarayan teknik fikirler alınır.
- Program izinsiz internete çıkmaz; ağır kütüphane ve canlı internet malzemesi yok. Dosya boyutu amaca bağlı tutulur.
- Kitabın adı "Tam İlmihâl" (yalnız "kitap" değil). Tarihler varsayılan gg/aa/yyyy.
- İngilizce kitap: Endless Bliss, altı fasikül; bağlantı yalnız site sayfası: https://www.hakikatkitabevi.net/book.php?bookCode=025
- HTML dosyaları SendUserFile ile gönderilir. Kullanıcıya Türkçe yazılır.
- Commit sonu: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> ve Claude-Session satırı.

## Çalışma düzeni
- Kaynak: src/ (build.py ORDER sırası), çıktı: dist/mahinev.html ve dist/mahinev-vX.html.
- Testler: tests/run_tests.py (Doğrulama sekmesi, 63 test, dil eşliği dâhil), tests/ui_tarama.py, tests/dunya_tarama.py (HR_LANG=en ile İngilizce).
- Belgeler: CHANGELOG.md, README.md, docs/kullanim-kilavuzu.md, docs/yol-haritasi.md, docs/kanonik-rapor.md (karar D1–D18), docs/coklu-dil.md.

## Şu anki iş (14 Kasım 2026): İngilizce metinlerin Endless Bliss’e göre düzeltilmesi
- Kullanıcı Endless Bliss’in altı fasikülünü yükledi (yalnız inceleme için; programa gömülmez, depoya konmaz).
- Hedef: Programdaki mevcut İngilizce metinlerde, kitabın İngilizcesindeki terim ve ifadelere göre yalnız gerekli ekleme/düzeltme. Dosya boyutu büyütülmeyecek; yeni uzun metin eklenmeyecek. GitHub’a yükleme yok; önce rapor ve karar.
- Eşleme ve terim listesi: docs/endless-bliss-esleme.md
- Yapılan (14 Kasım, yerel; yüklenmedi): İngilizce dizgilerde terim değişimi (123 dizgi), atıfların EB biçimine çevrilmesi (135 dizgi; "EB V, p. 137"), kanonik metnin İngilizcesinde kitap cümleleri EB’deki hâliyle, Işık beyti EB’deki İngilizce beyit, ay adları EB yazılışıyla. Sürüm 0.14.1-deneme.1. Testler 63/63.
- Araçlar (çalışma alanında, depoda değil): /home/claude/eb/enspans.js (İngilizce dizgi aralıkları), apply_terms.js, apply_cites.js. Yeni oturumda bu araçlar olmaz; gerekirse yeniden yazılır.
- 15 Kasım: kullanıcı onayladı: "EB V, p. 137" biçimi, arayüzde "crescent", notlar depoya (`gelistirme` dalı). Işık beytinin yanına Türkçe beyit ve ebced değerleri eklendi; kullanılan baskılar (IV 21. baskı, V 17. baskı, Ağustos 2020) İngilizce kaynak notunda. Atıflar kitapla tek tek denetlendi (162 atıf); düzeltilenler: muhâq V 136, ×5÷8 V 135, Işık V 135–136, Uluğ Bey V 139–142, devir/16 Temmuz V 133, ikindi-yatsı ihtiyatı IV 177, hakîkî vakit + Tamkin IV 138, 143, 183, üç gurûb IV 160–161, en yüksek tepe IV 159–161; İbni Âbidîn ifadeleri EB’deki gibi ("the new moon appears on the night indicated by calculation…").
- Sürüm yayını (0.14.1) henüz yapılmadı; `main` değişmedi.
- Sıradaki: İspanyolca, Fransızca, Boşnakça için boyut değerlendirmesi ve karar (tercümeleri kullanıcı yapacak; kaynak İngilizce Endless Bliss metinleri).

## Sıradaki işler (yol haritasından)
- Harita 2. aşama (tıklanan yer kartı, bölgesel yakınlaştırma, web worker…), 3. aşama.
