# Yol haritası

Planlanan ama henüz yapılmamış işler.

## Gemi kipi

Denizde rasad için ayrı bir kip. Genel yapıyı karıştırmamak için ayrı, açılır bir sayfada ele alınacak.

- Göz yüksekliği, deniz ufkunun alçalması (inhitât) ve ufuk mesafesi.
- Gemi rotası ve hızı; zaman ilerledikçe konumun tahmini, uydu konumu varsa onunla düzeltme.
- Pusula için manyetik sapma ve deviasyon girişi; hakiki kerteriz.
- Deniz üstü kırılma ve ufuk netliği için uyarılar.
- Gemide tutulan rasad kaydı için ek alanlar (rota, hız, gemi adı).

## Üç kullanıcı düzeyi

Aynı hesap, üç yoğunlukta sunulacak. Düzey, hangi kartların açık başlayacağını belirleyecek.

- **Başlangıç:** Bu akşam bakılacak mı, saat kaçta, hangi yöne, kaç yumruk yukarı, ne zamana kadar.
- **Deneyimli:** İrtifâ, semt, beynûnet, hilâl yaşı, Kâdîhân kontrolü.
- **Uzman:** Toposentrik ve jeosentrik değerler, Yallop/Odeh parametreleri, ham veri dışa aktarımı.

## Değerlendirilecek fikirler

- **Koordinattan saat dilimi:** Elle girilen koordinatın resmî saat dilimini çevrimdışı bulmak, dilim sınırları verisi gerektirir (birkaç yüz kilobayt). Şimdilik fark tûlden hesaplanıyor; kullanıcı listeden veya "UTC farkı" kutusundan düzeltiyor.
- **Safari'de JPG çıktısı:** Safari ve iOS'ta ayrıca denenmeli.
- **Hilâl gözlem bildirim ve paylaşma ağı:** Gözlemcilerin kayıtlarını ve imzalı bildirim eklerini (`hilal-bildirim/1`) bir heyete veya ağa iletmesi, heyetin bunları toplu doğrulaması. Kayıt ve ek biçimi hazırdır ([kayit-semasi.md](kayit-semasi.md)).
- **Pusula:** Android ve iOS telefonlarda sahada denenmeli; gemi kipindeki deviasyon girişiyle birleştirilebilir.
