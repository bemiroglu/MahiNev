# Katkı ve geri bildirim

Mâh-ı Nev, [CC BY-NC-ND 4.0](LICENSE) ile yayımlanır. Programın fıkhî kararları Tam İlmihâl'e bağlıdır, bu yüzden değişiklikler yalnızca depo sahibi tarafından yapılır. Değiştirilmiş kopyalar dağıtılamaz. Sizden beklenen katkı **geri bildirimdir**.

## Nasıl katkı verilir?

1. **Hata bildirimi:** [Issues](https://github.com/bemiroglu/MahiNev/issues) → *Hata bildirimi* şablonunu kullanın. Konumu, tarihi, saati ve programın sürümünü yazın.
2. **Rü'yet raporu:** Hilâli gördüyseniz veya göremediyseniz, *Rü'yet raporu* şablonuyla kaydınızı (JSON) ekleyin.
3. **Fıkhî konular:** Bu tür önerilerde Tam İlmihâl Se'âdet-i Ebediyye'den **sayfa numarasıyla** dayanak gösterin.
4. **Kod önerisi:** Pull request açabilirsiniz; ancak öneri olarak değerlendirilir. Kabul edilen fikirler, depo sahibince programa işlenir.

## Değişmez esaslar

- Kanonik çerçeve önce gelir: hiçbir değişiklik kitabın açık hükümlerini ve eşiklerini değiştiremez. Bu eşikler 8°, 18° ve 5°'dir; kesin red şartları da bunlara dahildir.
- Modern ölçütler (Yallop, Odeh vb.) yalnızca ek bilgidir.
- Program takvim değildir: hiçbir ekran veya çıktı, ayın başladığını hesaba dayanarak ilan edemez.
- Metinler Türkçe ve İngilizce birlikte güncellenir. Kitap terimi önce yazılır, modern karşılığı parantez içinde verilir.

## Depo sahibi için derleme

- Kaynak kod `src/` altındadır.
- Derlemek için `python3 build.py`, sınamak için `python3 tests/run_tests.py` çalıştırılır.
- Yeni hesaplar için Doğrulama sekmesine test eklenir.
- Derleme, gömülü sürüm bildirimini ve bütünlük özetini her seferinde yeniden üretir. Bu yüzden dağıtılan HTML yalnızca `build.py` çıktısı olmalıdır.
