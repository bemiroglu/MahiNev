# Yol haritası

Bu belge, kararlaştırılmış ama henüz yapılmamış işleri ve geliştirme notlarını tutar. Yayın, depo sahibinin talimatıyla yapılır: bir sürüm olgunlaşıp denemeleri tamamlanınca yeni sürüm numarasıyla GitHub'a yüklenir.

## Çalışma düzeni

1. Geliştirme `gelistirme` dalında yapılır. Her deneme sürümü `0.x.0-deneme.n` biçiminde numaralanır.
2. Deneme sürümü claude.ai'deki sayfada ve HTML dosyası olarak denenir.
3. Depo sahibi onay verince sürüm numarası kesinleşir (ör. `0.9.0`), `main` dalına alınır, etiketlenir ve Pages'te yayımlanır.

## Bir sonraki büyük işler

### Gemi kipi

Denizde rasad için ayrı bir kip. Genel yapıyı karıştırmamak için ayrı, açılır bir sayfada ele alınacak.

- Göz yüksekliği, deniz ufkunun alçalması (inhitât) ve ufuk mesafesi.
- Gemi rotası ve hızı.
- Zaman ilerledikçe konumun tahmini (parakete hesabı); uydu konumu varsa onunla düzeltme.
- Pusula için manyetik sapma (varyasyon) ve sapma (deviasyon) girişi; hakiki kerteriz.
- Ufuk netliği ve deniz üstü kırılma için uyarılar.
- Gemide tutulan rasad kaydı için ek alanlar: rota, hız, gemi adı.

### Üç kullanıcı düzeyli arayüz

Aynı hesap, üç farklı yoğunlukta sunulacak. Kullanımı güçleştirmemek için düzey seçimi Ayarlar'da ya da açılır bir sayfada yapılacak.

- **Başlangıç:** bu akşam bakılacak mı, saat kaçta, hangi yöne, kaç yumruk yukarı, ne zamana kadar.
- **Deneyimli:** irtifâ, semt, beynûnet, hilâl yaşı, Kâdîhân kontrolü.
- **Uzman:** toposentrik ve jeosentrik değerler, Yallop/Odeh parametreleri, ham veri dışa aktarımı.

## Değerlendirilecek fikirler

- **Koordinattan saat dilimi:** Elle girilen koordinat için resmî saat dilimini çevrimdışı bulmak, dilim sınırları verisi gerektirir; bu veri basitleştirilmiş hâliyle birkaç yüz kilobayttır. Şimdilik fark tûlden hesaplanıyor, kullanıcı listeden ya da "UTC farkı" kutusundan düzeltiyor.
- **Safari'de JPG çıktısı:** JPG üretimi Chromium'da sınandı. Safari ve iOS'ta da denenmeli. Üretilemezse program "PDF olarak kaydedin" der.

## Geliştirme notları (depo sahibinden)

- Program, kullanıcı izin vermedikçe dışarıya hiç bağlanmaz. Bütün internet izinleri Ayarlar'dan değiştirilir ve bütün bağlantıları kapsayan gizlilik açıklaması orada durur.
- A4 sayfaları PDF'in yanında JPG olarak da dışarı alınabilir.
- Gökyüzü, Saha ve Ufuk görsellerinde yön kısaltmalarının yanında derece değerleri yazar.
- Sürüm geçmişi ve önceki hataların düzeltildiği bilgisi program metinlerinde ve belgelerde tutulmaz. Değişiklik günlüğü 0.8.0 ilk genel yayınıyla başlar.
- Saat farkı, kullanıcının seçebileceği bir UTC farkı kutusuyla gösterilir ve değiştirilir; saat dilimi listesiyle eşlenir.
