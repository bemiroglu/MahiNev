# Katkı ve geri bildirim

Mâh-ı Nev, [CC BY-NC-ND 4.0](LICENSE) ile yayımlanır. Programın fıkhî kararları Tam İlmihâl'e bağlıdır, bu yüzden değişiklikler yalnızca depo sahibi tarafından yapılır. Değiştirilmiş kopyalar dağıtılamaz. Sizden beklenen katkı **geri bildirimdir**.

## Nasıl katkı verilir?

1. **Hata bildirimi:** [Issues](https://github.com/bemiroglu/MahiNev/issues) → *Hata bildirimi* şablonunu kullanın. Konumu, tarihi, saati ve programın sürümünü yazın.
2. **Fıkhî konular:** Bu tür önerilerde Tam İlmihâl Se'âdet-i Ebediyye'den **sayfa numarasıyla** dayanak gösterin.
3. **Kod önerisi:** Pull request açabilirsiniz; ancak öneri olarak değerlendirilir. Kabul edilen fikirler, depo sahibince programa işlenir.

## Değişmez esaslar

- Kanonik çerçeve önce gelir: hiçbir değişiklik kitabın açık hükümlerini ve eşiklerini değiştiremez. Bu eşikler 8°, 18° ve 5°'dir; kesin red şartları da bunlara dahildir.
- Modern ölçütler (Yallop, Odeh vb.) yalnızca ek bilgidir.
- Program takvim değildir: hiçbir ekran veya çıktı, ayın başladığını hesaba dayanarak ilan edemez.
- Metinler Türkçe ve İngilizce birlikte güncellenir. Kitap terimi önce yazılır, modern karşılığı parantez içinde verilir.

## Depo sahibi için

- Kaynak kod `src/` altındadır; `python3 build.py` tek dosyalık `dist/mahinev.html`'i üretir. Derleme, gömülü yayın bildirimini ve bütünlük özetini her seferinde yeniden hesaplar; dağıtılan HTML yalnız `build.py` çıktısı olmalıdır.
- Sınama: `python3 tests/run_tests.py` (Doğrulama sekmesindeki testler), `python3 tests/ui_tarama.py` (arayüz taraması), `python3 tools/kuresel_dogrulama.py` (dünya geneli kapsamı).
- Yayın: `main` dalına gelen her sürüm GitHub Actions ile Pages'te yayımlanır (Settings → Pages → Source: GitHub Actions). Sürümlü kopya da aynı adreste yayımlanır: `https://bemiroglu.github.io/MahiNev/mahinev-v<sürüm>.html`.
- Kanonik kararlar `docs/kanonik-rapor.md`'dedir; yeni hesaplar için Doğrulama sekmesine test eklenir.
