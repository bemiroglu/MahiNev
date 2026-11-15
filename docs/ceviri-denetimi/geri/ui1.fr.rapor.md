# ui1.fr — geri çeviri denetimi: 419 öğe kontrol edildi (5 sembol/özel ad atlandı), 6 sorun bulundu, 6 düzeltildi

| Anahtar | Sorun türü | Aslı (TR, kısa) | Geri çeviri (kısa) | Düzeltme (hedef dilde) |
|---|---|---|---|---|
| T.earliestGlobal | Terim / anlam kayması (hesâbî → "mümkün") | Hesâbî en erken gün (dünya geneli) | Mümkün en erken gün (bütün dünya) | Jour le plus tôt calculé (monde entier) |
| T.earliestLocal | Terim / anlam kayması | Hesâbî en erken gün (bulunduğunuz yer) | Mümkün en erken gün (sizin yeriniz) | Jour le plus tôt calculé (votre lieu) |
| T.earliestMecca | Terim / anlam kayması | Hesâbî en erken gün (Mekke, hac için) | Mümkün en erken gün (Mekke) | Jour le plus tôt calculé (La Mecque, pour le Hajj) |
| T.isikDiff | Terim / anlam kayması | …hesâbî en erken günden farklı | …mümkün en erken günden farklı | …diffère du jour le plus tôt calculé ; … |
| T.yallopCls.B | Eksik ("çıplak gözle") | İdeal şartlarda çıplak gözle görülebilir | Mükemmel şartlarda görünür | Visible à l’œil nu dans des conditions idéales |
| T.yallopCls.C | Anlam kayması (çıplak gözle görme kısmı yok) | Önce optik araçla bulunup sonra çıplak gözle görülebilir | Bulmak için bazen optik yardım gerekir | Trouvé d’abord à l’aide optique, puis visible à l’œil nu |

Genel değerlendirme: Fransızca paket İngilizce metni çok yakından izliyor ve anlam, hüküm kuvveti (kesin red, "görülemez", "bir gün önce olamaz, sonra olabilir"), EB atıfları (EB V, p. …) ve terimler (croissant, beynûnet, coucher shar’î, Tamkin) açısından büyük ölçüde sadık; bulunan sorunlar İngilizce aracı metinden geçen küçük kaymalardı. İnsan kararına kalan: T.madde88 TR'deki "Madde 88 (Muharrem başı)" yerine İngilizceyi izleyerek "Premier jour de l’année hégirienne (×5 ÷ 8)" diyor (anlam aynı, madde atfı yok); T.cls.visible ve benzerlerinde "görülebilir" → "visible" kullanımı kabul edilebilir sayıldı. pack_check: "yapı tamam · 2 uyarı" (footer özel adları ve T.turn içindeki çevrilmiş 'gauche'/'droite' — beklenen).
