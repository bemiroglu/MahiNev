# Rü'yet kaydı biçimi: `hilal-ruyet-kaydi/1`

Saha sekmesindeki "Rü'yet kaydı ve tutanak" formu her gözlem için bir JSON kaydı üretir. Biçimin tam tanımı [`schemas/hilal-ruyet-kaydi-1.schema.json`](../schemas/hilal-ruyet-kaydi-1.schema.json) dosyasındadır.

## Alanlar

| Alan | Açıklama |
|---|---|
| `observer` | Gözlemcinin adı ve isteğe bağlı iletişim bilgisi. Program ikisini de yalnızca bu cihazda saklar. |
| `place` | Enlem, boylam, rakım, saat dilimi ve gözlem yeri türü: `open` şehir dışı, `high` yüksek yer, `city` şehir içi. |
| `observation.result` | `naked` çıplak gözle; `aidedNaked` dürbünle bulup çıplak gözle; `aided` yalnız optik yardımla; `photo` yalnız fotoğrafla; `not` görülmedi. |
| `observation.sky` | `clear` açık, `partly` parçalı, `cloud` bulutlu (hilâl bulut arasından), `haze` puslu. Açık ve bulutlu hava farkı fıkhen önemlidir (s. 315). |
| `observation.evening` | Kaydın ait olduğu akşam. Gurûbdan sonra yapılan kayıt o güne, gün doğumundan önceki kayıt bir önceki güne aittir. |
| `computed` | Program tarafından eklenir: ictimâ, gurûb, şer'î gurûb, kitabın penceresi, beynûnet, gözlem anında hilâlin irtifâı, sınıf, Kâdîhân, değerlendirme. **Hüküm değildir.** |
| `photo` | Fotoğrafın SHA-256 özeti ve küçük bir önizlemesi. Asıl dosya cihazda kalır. |
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

İmza, kişinin kimliğini **kanıtlamaz**. Kimlik, anahtarın sorumlu bir kişi tarafından tanınmasıyla (anahtar kayıt defteri) veya ıslak imzalı tutanakla bağlanır (bkz. [sehadet-agi.md](sehadet-agi.md)).

## QR kodu

Tutanaktaki QR kodu `HRK1|<kayıt-no>|<sha256>` metnini taşır. Basılı tutanak bu yolla dijital kayıtla eşleştirilir.
