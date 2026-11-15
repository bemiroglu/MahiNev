# Geri çeviri denetimi — özet (15 Kasım 2026)

Fransızca, İspanyolca ve Boşnakça çeviriler (arayüz, açıklamalar, Rehber, kanonik metin, çizim yazıları, şehir adları) çevirmenlerden ayrı yardımcılar tarafından denetlendi. Usul (`YONERGE-geri-ceviri.md`): önce çeviri, Türkçe aslı görülmeden Türkçeye geri çevrildi (`geri/*.geri.txt`); sonra geri çeviri aslıyla anlam bakımından karşılaştırıldı; sapmalar çeviride düzeltildi ve raporlandı (`geri/*.rapor.md`).

| Dil | Denetlenen madde | Bulunan sorun | Düzeltilen |
|---|---|---|---|
| Fransızca | 1.259 | 13 | 13 |
| İspanyolca | 1.238 | 21 + 5 | 26 |
| Boşnakça | 1.285 | 8 + 2 | 9 |

Sorunların çoğu terim (hilâl için "nouvelle lune" / "luna nueva"; sözlükte yasak, ictimâ ile karışır) ve hüküm kuvvetinin zayıflamasıdır ("kesin red" → "reddedilir"; "kalıcı hasar yapar" → "yapabilir"). Hepsi aslındaki kuvvete getirildi. "+" ile gösterilenler denetimden sonra bulundu: İspanyolcada terim taramasıyla 3 yer ("ver la luna nueva en el cielo" → "ver el creciente en el cielo"); Fransızca denetçinin gösterdiği göz güvenliği uyarısı yumuşaması İspanyolca ve Boşnakçada da vardı (ikişer yer). Üç dilde de uyarı Türkçedeki kesinliğe getirildi.

Boşnakçada düzeltilmeyen tek madde kaynaktaki bir tutarsızlıktır: Takvim ipucundaki (`hints.date`) düğme adları, Türkçe ve İngilizcede de olduğu gibi, Plan'daki düğmelerin bugünkü adlarından ("◀ Önceki ay") farklıdır ("◀ Önceki ay başı"). Kaynak düzeltilirse `pack_sync.py` bu maddeyi üç dilde güncellemeye çıkarır.

Boşnakça koordinat etiketi: Boşnakçada S = sjever (kuzey) olduğundan etiket ve gösterim uluslararası N/S/E/W harfleriyle yazılır (koordinat kutusu S'yi güney okur).

Kanonik metin: üç dilde İngilizcenin 26 paragraf düzenini izler; Türkçenin 28 paragrafının bütün içeriği vardır (iki paragraf çifti birleşik). Türkçedeki "(YENİ) Rü'yet-i Hilâl linkine tıklayınız" cümlesi İngilizcede olduğu gibi yoktur.

Bu dillerde program, metinlerin yapay zekâ ile otomatik çevrildiğini, terimlerin ve kitaptan aktarılan sözlerin Endless Bliss'ten alındığını ve çeviri hataları olabileceğini alt bilgide, Hakkında penceresinde, Rehber → Kaynaklar'da ve dil ilk seçildiğinde kısa bir bildirimle yazar.
