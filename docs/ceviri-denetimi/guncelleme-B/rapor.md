# is paketi — bağımsız geri çeviri denetimi (fr, es, bs)

| Dil | Denetlenen öğe | Bulunan sorun | Düzeltilen | pack_check |
|---|---|---|---|---|
| fr | 49 | 1 | 1 | yapı tamam · 1 uyarı |
| es | 49 | 1 | 1 | yapı tamam · 1 uyarı |
| bs | 49 | 1 | 1 | yapı tamam · 1 uyarı |

Tek uyarı her üç dilde de `T.phTaken` içindeki 'after'/'before' dizgelerinin çevrilmiş olmasıdır. Bu beklenen bir durumdur, hata değildir.

Geri çeviriler: `fr/geri.txt`, `es/geri.txt`, `bs/geri.txt`.

## Sorunlar ve düzeltmeler

| Dil | Anahtar | Sorun türü | Aslı (TR, kısa) | Geri çeviri (kısa) | Düzeltme (hedef dilde) |
|---|---|---|---|---|---|
| fr | T.wxAt | Anlam belirsizliği (küçük) | Tahmin ${s} itibarıyla alındı | Alınan tahmin: ${s} (${s} tahminin içeriği gibi okunuyor) | `Prévision obtenue le ${s} ;` |
| es | T.wxAt | Anlam belirsizliği (küçük) | Tahmin ${s} itibarıyla alındı | Alınan tahmin: ${s} | `Pronóstico obtenido el ${s};` |
| bs | T.obstNote | Dilbilgisi (zamir uyumu) | yüksekliğini derece olarak yazın | yüksekliklerini (çoğul “njihovu”) yazın | `upišite visinu prepreke u stepenima` |

## Özellikle denetlenen noktalar (üç dilde de doğru)
- Ufuk engeli Tam İlmihâl sınıfını değiştirmiyor; program yalnızca ayrıca bilgi veriyor (`T.obstNote`).
- Pusula notunda manyetik ve gerçek kuzey ile sapma anlatılıyor. Ayar düğmesi adları, paketteki `cpCal`/`cpCalGurub` etiketleriyle birebir aynı (fr « Étalonner sur le Soleil / … le point du coucher », es “Calibrar con el Sol / … el punto de la puesta”, bs „Kalibriraj prema Suncu / … tački zalaska“).
- Paylaşılan kayıt şahitlik değildir ve hilâlin görüldüğünü doğrulamaz (fr “ne prouve pas”, es “no verifica”, bs “ne potvrđuje”).
- Deneme kipindeki kayıtlar gerçek kayıtlardan ayrı tutuluyor.
- SHA-256 özeti cihazda hesaplanıyor ve dosya hiçbir yere gönderilmiyor.
- Senaryolarda yer adları, tarihler ve sınıflar doğru. Sınıflar: görülebilir, mümkün, doğmamış ve kesin red. Ay adları sözlükle uyumlu: Rajab/Rayab/Redžeb ve Dhû al-hijja/Dhu’l-hiŷŷa/Zu-l-hidždže.
- İspanyolcada “el creciente” her yerde eril.
- Hilâl için “nouvelle lune” ya da “luna nueva” kullanılmamış.
- Fransızca tipografi doğru: « » içinde ve ; : önünde bölünmez boşluk var.

## Değerlendirme
Üç çeviri de Türkçe aslına anlam bakımından çok sadık. Hüküm gücü ve şart kipi korunmuş, terimler sözlükle tutarlı. Bulunan sorunlar küçüktür: bir zaman ifadesindeki belirsizlik ile bir zamir uyumu. Hepsi düzeltildi. İnsan kararına bırakılan bir konu yok. İstenirse fr `T.shNote` içindeki “ne prouve pas” ifadesi “ne vérifie pas” olarak değiştirilebilir; bu, İngilizce “does not verify” ifadesine daha yakın olur, ama anlamı zaten doğru.
