# Rü'yet kaydı biçimi: `hilal-ruyet-kaydi/1`

Saha sekmesindeki "Rü'yet kaydı ve tutanak" formu her gözlem için bir JSON kaydı üretir. Biçimin tam tanımı [`schemas/hilal-ruyet-kaydi-1.schema.json`](../schemas/hilal-ruyet-kaydi-1.schema.json) dosyasındadır.

## Alanlar

| Alan | Açıklama |
|---|---|
| `observer` | Gözlemcinin adı ve isteğe bağlı iletişim bilgisi. Program ikisini de yalnızca bu cihazda saklar. |
| `place` | Enlem, boylam, rakım, saat dilimi ve gözlem yeri türü: `open` şehir dışı, `high` yüksek yer, `city` şehir içi. |
| `observation.result` | `naked` çıplak gözle; `aidedNaked` dürbünle bulup çıplak gözle; `aided` yalnız optik yardımla; `photo` yalnız fotoğrafla; `doubt` şüpheli (cismin hilâl olduğu kesin değil, rü'yet beyanı sayılmaz); `not` dikkatle arandı, görülmedi; `noObs` gözlem yapılamadı (bulut, ufuk engeli vb.; hilâlin bulunmadığını göstermez). |
| `observation.sky` | `clear` açık, `partly` parçalı, `cloud` bulutlu (hilâl bulut arasından), `haze` puslu. Açık ve bulutlu hava farkı fıkhen önemlidir (s. 315). |
| `observation.evening` | Kaydın ait olduğu akşam. Gurûbdan sonra yapılan kayıt o güne, gün doğumundan önceki kayıt bir önceki güne aittir. |
| `computed` | Program tarafından eklenir: ictimâ, gurûb, şer'î gurûb, kitabın penceresi, beynûnet, gözlem anında hilâlin irtifâı, sınıf, Kâdîhân, değerlendirme. **Hüküm değildir.** |
| `app` | Programın adı ve sürümü; `source` yayın adresi, `official` bütünlük denetiminin sonucu (dosya özgün mü), `engine` astronomi çekirdeği, `rules` kural kümesi (ör. `TI-360/1`), `models` modern ölçütlerin tanımı. |
| `photo` | Fotoğrafın SHA-256 özeti ve küçük bir önizlemesi. Asıl dosya cihazda kalır; programdaki "Fotoğrafı doğrula" düğmesi, seçilen dosyanın özetinin bir kayıtla eşleşip eşleşmediğini gösterir. Depolama yetersizse önizleme saklanmaz (`thumbDropped: true`); bu durumda kayıt önizlemesiz içerikle yeniden mühürlenir. |
| `signer`, `sig` | Cihaz imzası. Biçim ECDSA P-256 / SHA-256, imza IEEE P1363 (r‖s) olarak base64 ile kodlanır. İmzalanan veri `hash` metnidir. |
| `hash` | `hash` ve `sig` hariç kaydın kanonik JSON'unun SHA-256 özeti. |

## Kanonik JSON

- Nesne anahtarları sözlük sırasına göre dizilir; boşluk bırakılmaz.
- Diziler sırasını korur.
- Metinler UTF-8'dir; ASCII dışı harfler kaçışsız yazılır.

JavaScript ve Python uygulamaları aynı sonucu verir (bkz. `src/integrity.js`, `tools/verify_record.py`).

## Doğrulama

```bash
pip install cryptography
python3 tools/verify_record.py kayit.json
```

Çıktı şu iki şeyi ayrı ayrı bildirir:

- **Özet:** kaydın değiştirilip değiştirilmediği.
- **İmza:** kaydın, kayıtta yazılı açık anahtarın sahibi olan cihazdan gelip gelmediği.

İmza, kişinin kimliğini **kanıtlamaz**. Kimlik, anahtarın sorumlu bir kişi tarafından tanınmasıyla (anahtar kayıt defteri) veya ıslak imzalı tutanakla bağlanır.

## QR kodu

Tutanaktaki QR kodu `HRK1|<kayıt-no>|<sha256>` metnini taşır. Basılı tutanak bu yolla dijital kayıtla eşleştirilir.

## Saklama ve yedekleme

- Kayıtlar yalnız tarayıcıda (localStorage) durur. Kayıt sayısında sınır yoktur; 150 kayıttan sonra yedek alma hatırlatılır.
- Kayıt saklanamazsa (depolama dolu) program açık hata verir ve kaydı JSON dosyası olarak indirir; başarı izlenimi verilmez.
- **Tüm kayıtları yedekle** düğmesi `mahinev-kayit-yedegi/1` biçiminde bir dosya üretir: `{ schema, created, app, records: [...] }`.
- **Yedekten geri yükle** bu dosyayı, tek bir kaydı veya kayıt dizisini kabul eder; `id` aynı olan kayıtları ikinci kez eklemez.
- Kayıt listesinde her kaydın özeti ve imzası açılışta yeniden doğrulanır.

## Doğrulama: kim, nerede, nasıl

- **Kâğıt neyi taşır:** Tutanakta SHA-256 özeti, imza anahtarının parmak izi ve QR kodu (`HRK1|kayıt-no|özet`) bulunur. Bunlar kâğıdı kaydın dijital kopyasına (JSON) bağlar. Kâğıt tek başına doğrulanamaz.
- **Kim doğrular:** Kayıtları toplayan kişi veya heyet. Gözlemciden tutanağı ve JSON kaydını birlikte ister.
- **Nerede:** Mâh-ı Nev'de **Saha → Kayıt doğrula** penceresinde (internetsiz) ya da bilgisayarda `python3 tools/verify_record.py kayit.json --kod "HRK1|…"` ile.
- **Neye bakılır:**
  1. Özet, JSON içeriğinden yeniden hesaplanır; kayıttaki ve kâğıttaki kodla aynı olmalıdır. Aynıysa kayıt sonradan değiştirilmemiştir.
  2. Parmak izi, kayıttaki genel anahtardan yeniden hesaplanır ve kayıttakiyle karşılaştırılır.
  3. İmza bu anahtarla doğrulanır; geçerliyse kayıt, o parmak izli cihazda oluşturulmuştur.
- **Sınırları:** Parmak izi kişiyi değil cihazı tanıtır. Doğrulama, hilâlin görüldüğünü ispat etmez; şahitliğin değerlendirilmesi yetkili makama aittir.
