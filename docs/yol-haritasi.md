# Yol haritası

Planlanan ama henüz yapılmamış işler.

## Gemi kipi

Denizde rasad için ayrı bir kip. Genel yapıyı karıştırmamak için ayrı, açılır bir sayfada ele alınacak.

- Göz yüksekliği, deniz ufkunun alçalması (inhitât) ve ufuk mesafesi.
- Gemi rotası ve hızı; zaman ilerledikçe konumun tahmini, uydu konumu varsa onunla düzeltme.
- Pusula için manyetik sapma ve deviasyon girişi; hakiki kerteriz.
- Deniz üstü kırılma ve ufuk netliği için uyarılar.
- Gemide tutulan rasad kaydı için ek alanlar (rota, hız, gemi adı).

## Yeni diller

Altyapı hazırdır (bkz. [coklu-dil.md](coklu-dil.md)). Her yeni dil için:

- o dildeki Tam İlmihâl baskısının adı ve Hakîkat Kitâbevi bağlantıları;
- arayüz, açıklama penceresi, rehber ve çizim sözlüklerinin çevirisi;
- terimlerin o dildeki baskıyla karşılaştırılması;
- sağdan sola yazılan dillerde kart ve tablo düzeninin denenmesi.

## Dünya haritası: 2. aşama

1. aşama (0.14) Tam İlmihâl ölçü çizgilerini, üç geceyi, ilk mümkün / görülebilir yer işaretlerini, enlem-boylam ağını, şehirleri, kabartmayı ve seçili dilde PNG çıktısını getirdi. 2. aşamada haritanın kendisi büyümeden, haritadan alınan bilgi artacak.

- **Tıklanan yerin kartı:** Haritada tıklanan nokta için bugünkü kısa kutu yerine, Plan sekmesindeki "Hilâl verileri" tablosunun aynısı (gurûb ve ay batışı, Güneş ve Ay'ın azimut / irtifâı, iki beynûnet, ARCV, DAZ, SD, HP, uzaklık, kalınlık, aydınlık oran, 5° penceresi); "bu yer için planla" ve "üç gece" düğmeleri. Tablo, Tam İlmihâl'in sınıfını en üstte, ek bilgileri altta gösterir.
- **Bölgesel yakınlaştırma:** Seçilen bir bölge (ör. ±25° enlem, ±25° boylam) 0,5° adımla hesaplanır; sınıf sınırları, 8° / 18° / 5° çizgileri ve şehirler o ölçekte çizilir. Dünya haritası 2°–4° adımla kalır; bölgesel hesap yalnız istenince yapılır.
- **Hesabın arka planda yapılması (web worker):** Izgara hesabı ayrı bir iş parçacığında yürür; ekran hesap sırasında donmaz, üç gece haritası paralel hazırlanır. Dosya içinde gömülü kalır, internet gerektirmez.
- **Hızlı ilk çizim:** Önce 6° kaba ızgara, ardından seçili çözünürlük. Kaba çizim yalnız taslak olarak işaretlenir; sınıf sınırı son ızgaradan çizilir.
- **Kendi kayıtları haritada:** Rasıdın "gördüm / görmedim" kayıtları ilgili akşamın haritasında işaret olarak gösterilir (yalnız cihazdaki kayıtlar; paylaşma yok).
- **Değer çizgisinde iki değer:** Örneğin beynûnet ile 5° penceresi aynı anda; ikincisi kesikli.
- **Çıktı seçenekleri:** PNG'nin yanında A4 yatay PDF için doğrudan "üç gece" düğmesi; PNG'de koyu tema seçeneği.

## Dünya haritası: 3. aşama

Dosya boyutunu ancak açıkça istenince artıran, seçimlik eklentiler.

- **Yüksek çözünürlüklü kabartma:** Bugünkü 900 piksellik gri kabartma (≈ 25 KB) yerine isteğe bağlı 1.800 piksellik doku (≈ 70–90 KB), yalnız ayrı bir "büyük harita" sürümünde.
- **Sabah hilâli haritası:** Ay sonunda, ictimâdan önceki sabahlarda hilâlin doğudan görülebileceği yerler (ayın sonunu izlemeye yarar; ay başı hükmü yine akşam rü'yetiyledir).
- **Kendi gözlem geçmişi:** Bir yerde yıllar boyunca yapılmış rasadların, aynı ayın haritası üzerinde karşılaştırılması.
- **Zaman şeridi animasyonu:** Seçili akşamın gurûb çizgisinin dünyayı dolaşması; her yerin gurûbunda hilâlin durumu sırayla boyanır.
- **Kıyı ve sınır verisinin inceltilmesi:** Bölgesel yakınlaştırma için daha ayrıntılı kıyı çizgisi, ayrı ve seçimlik bir veri dosyası olarak.

Ölçü: Bu aşamalarda da yalnız Tam İlmihâl'in sınıfları ve ölçüleri ana katmandır. Yallop ve Odeh ek bilgidir. Takvim birleştirme ölçütleri (2016 "Türkiye" ölçütü, MABIMS, Wujudul Hilal, IQG ve benzerleri) ek bilgi olarak da kullanılmaz (kanonik rapor, D17).

## Değerlendirilecek fikirler

- **Koordinattan saat dilimi:** Elle girilen koordinatın resmî saat dilimini çevrimdışı bulmak, dilim sınırları verisi gerektirir (birkaç yüz kilobayt). Şimdilik fark tûlden hesaplanıyor; kullanıcı listeden veya "UTC farkı" kutusundan düzeltiyor.
- **Safari'de JPG çıktısı:** Safari ve iOS'ta ayrıca denenmeli.
- **Hilâl gözlem bildirim ve paylaşma ağı:** Gözlemcilerin kayıtlarını ve imzalı bildirim eklerini (`hilal-bildirim/1`) bir heyete veya ağa iletmesi, heyetin bunları toplu doğrulaması. Kayıt ve ek biçimi hazırdır ([kayit-semasi.md](kayit-semasi.md)).
- **Pusula:** Android ve iOS telefonlarda sahada denenmeli; gemi kipindeki deviasyon girişiyle birleştirilebilir.
- **Gök cisimleri aracı:** Görünürlük tahmini için kullanıcının seçebileceği gökyüzü karanlığı (şehir, kasaba, kır); seçili cismin ufuk ve gökyüzü haritası çiziminde işaretlenmesi.
