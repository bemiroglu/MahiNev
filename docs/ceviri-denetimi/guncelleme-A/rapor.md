# Bağımsız geri çeviri denetimi — is (15 öğe/dil): fr, es, bs

| Dil | Kontrol edilen | Bulunan sorun | Düzeltilen | pack_check |
|---|---|---|---|---|
| fr | 15 | 1 | 1 | yapı tamam · 0 uyarı |
| es | 15 | 2 | 2 | yapı tamam · 0 uyarı |
| bs | 15 | 0 | 0 | yapı tamam · 0 uyarı |

Geri çeviriler: `is-A/fr/geri.txt`, `is-A/es/geri.txt`, `is-A/bs/geri.txt` (kaynak .tr/.en açılmadan yazıldı).

## Sorunlar ve düzeltmeler

| Dil | Anahtar | Sorun türü | Aslı (TR, kısa) | Geri çeviri (kısa) | Düzeltme (hedef dilde) |
|---|---|---|---|---|---|
| fr | T.dstFold | Anlam kayması (yön ters) | yaz saatinden dönüşte | yaz saatinin geri gelmesi nedeniyle | « en raison du passage de l’heure d’été à l’heure normale » |
| es | T.dstFold | Anlam kayması (yön ters) | yaz saatinden dönüşte | yaz saatinin geri dönüşü nedeniyle | “debido al fin del horario de verano” |
| es | T.vfScope | Terim/cinsiyet hatası | hilâlin görüldüğünü | “la creciente” (dişil = sel/taşkın; hilâl değil) | “no verifica que el creciente lunar fuera visto” |

## Özel dikkat noktaları
- **T.vfScope**: Üç dilde de doğrulamanın hilâlin görüldüğünü ve rasıdın kimliğini doğrulaMADIĞI açıkça söyleniyor; olumsuzluk doğru. (es’de yalnız terim düzeltildi.)
- **Göz güvenliği (T.safetyHidden, T.optSafety)**: Üç dilde de Plan’da yalnız bu oturum için gizli, program yeniden açılınca geri geliyor; Saha’da Güneş ufkun üstündeyken her zaman gösteriliyor. Sorun yok.
- **DST**: gap (yaz saatine geçiş, saat yok) üç dilde doğru; fold fr/es’de “yaz saatinin geri gelmesi” gibi ters okunabiliyordu, düzeltildi; bs (“povratka s ljetnog računanja vremena”) doğru.
- **“Ay güneşten önce battı”**: Üç dilde doğru (fr “s’est couchée avant le Soleil”, es “se puso antes que el Sol”, bs “zašao prije Sunca”).
- fr tipografisi (; : önünde ve “5 000”de bölünmez boşluk) doğru.

## Değerlendirme
Çeviriler genel olarak yüksek sadakatte; anlamı etkileyen iki tür hata (fr/es’de DST dönüş yönü, es’de “la creciente”) düzeltildi. İnsan kararına kalan: es paketinin başka bölümlerinde de “la creciente” (dişil) kullanımı görülüyor (ör. “la creciente no puede…”); sözlükteki “creciente (lunar)” için tutarlı olarak eril “el creciente” seçilmesi önerilir. es’de “5000” (ayraçsız, RAE’ye uygun) ile bs “5.000” biçim farkı zararsızdır.
