<div align="center">

<img src="docs/img/ikon.svg" alt="" width="84">

# Mâh-ı Nev

**Hilâl Rasad Yardımcısı · Crescent Sighting Assistant**

*Tam İlmihâl Se'âdet-i Ebediyye esaslı kamerî ay başı rasad yardımcısı*

[![Sürüm](https://img.shields.io/badge/s%C3%BCr%C3%BCm-0.13.0-9a5a12)](CHANGELOG.md)
[![Lisans](https://img.shields.io/badge/lisans-CC%20BY--NC--ND%204.0-555)](LICENSE)
![İnternetsiz](https://img.shields.io/badge/internetsiz-%C3%A7al%C4%B1%C5%9F%C4%B1r-2e7d4f)
![Dil](https://img.shields.io/badge/dil-T%C3%BCrk%C3%A7e%20%C2%B7%20English-3d5a80)

**[▶ Çevrimiçi aç](https://bemiroglu.github.io/MahiNev/)** &nbsp;·&nbsp;
**[⬇ İndir (v0.13.0)](https://bemiroglu.github.io/MahiNev/mahinev-v0.13.0.html)** &nbsp;·&nbsp;
**[📖 Tam İlmihâl](https://www.hakikatkitabevi.net/book.php?bookCode=001)** &nbsp;·&nbsp;
**[English ↓](#english)**

</div>

> [!IMPORTANT]
> **Bu program bir takvim değildir.** Kamerî ay başı, hilâlin çıplak gözle görülmesiyle (rü'yet) kesinleşir. Programın verdiği her sonuç *hesâbî imkândır*. Hüküm, şahitlik şartlarıyla ve yetkili makamca verilir (Tam İlmihâl, s. 315–316, 360).

## Bu araç hakkında

Mâh-ı Nev, Tam İlmihâl Se'âdet-i Ebediyye kitabındaki bilgiler esas alınarak hazırlanmış bir rasad yardımcısıdır. Hilâl rasadının planlanmasını ve sahada yapılmasını kolaylaştırmak için yapılmıştır.

Bir fıkıh kaynağı değildir; kaynağın yerini tutmaz. Esas ve kesin bilgi fıkıhtır: Bu programda Tam İlmihâl'e ve fıkha uymayan bir bilgi bulunursa, o bilgi geçersizdir. Fıkhî hükümler için Tam İlmihâl'in kendisine başvurunuz.

- **Tam İlmihâl'i okuyun veya indirin (Hakîkat Kitâbevi):** [Hakîkat Kitâbevi sayfası](https://www.hakikatkitabevi.net/book.php?bookCode=001) · [PDF](https://www.hakikatkitabevi.net/downloads/001.pdf)
- Programdaki sayfa numaraları Tam İlmihâl'in **Ocak 2026 baskısına** göredir; başka baskılarda birkaç sayfa farklı olabilir.

<p align="center"><img src="docs/img/masaustu-plan.png" alt="Masaüstü · Plan: bu akşamın değerlendirmesi ve yaklaşan ay başı rasadı" width="900"></p>

## Tek dosya, her ekranda

Mâh-ı Nev tek bir HTML dosyasıdır. Kurulum gerektirmez: indirip tarayıcıda açmanız yeterlidir. Bilgisayarda, tablette ve telefonda aynı dosya çalışır; açıldıktan sonra internet gerekmez.

<table>
<tr>
<td align="center" width="46%"><img src="docs/img/tablet-ufuk.png" alt="Tablet · Batı ufku: hilâli nerede aramalı" width="100%"><br><sub><b>Tablet</b> · Batı ufku: hilâlin yeri, yumruk ölçeğiyle</sub></td>
<td align="center" width="27%"><img src="docs/img/telefon-saha.png" alt="Telefon · Saha sekmesi" width="100%"><br><sub><b>Telefon</b> · Saha: canlı saat ve geri sayım</sub></td>
<td align="center" width="27%"><img src="docs/img/telefon-plan.png" alt="Telefon · Plan sekmesi" width="100%"><br><sub><b>Telefon</b> · Plan: hicrî gün ve rasad gecesi</sub></td>
</tr>
</table>

<sub>Ekran görüntüleri: İstanbul, 10 Aralık 2026 akşamı (Receb 1448 hilâli), arama penceresi içinde.</sub>

## Nasıl başlarım?

1. [Çevrimiçi adresi](https://bemiroglu.github.io/MahiNev/) açın veya dosyayı indirip tarayıcıda açın.
2. **Konum:** Şehrinizi seçin ya da "Konumumu kullan"a dokunun. Arz ve tûlü dilediğiniz biçimde yazabilirsiniz (41,0082 · 41°00'29"K).
3. **Yaklaşan ay başı rasadı** kartında rasad gecesini görün; "Bu geceyi planla" ile o akşama gidin.
4. Rasad akşamı telefondan **Saha** sekmesini açın: saat, geri sayım, bakılacak yön ve gökyüzü çizimi oradadır.
5. Gördüğünüzde veya göremediğinizde **Rü'yet kaydı** oluşturun. Kaydı A4 tutanak olarak basabilir, JSON olarak paylaşabilirsiniz.

> [!TIP]
> Programın içindeki **⬇ HTML'yi indir** düğmesi, o anda kullandığınız sürümü tek dosya olarak kaydeder. Dosyayı internetsiz bir telefona veya bilgisayara kopyalayıp orada da kullanabilirsiniz.

## Ne yapar?

| | |
|---|---|
| 🌙 **Bu akşamın değerlendirmesi** | Tam İlmihâl'in sınıflarına göre: ictimâ, beynûnet 8° / 18° ve ufuktan 5° (s. 360). Kesin red, rü'yet beyanı ve Kâdîhân kontrolü (s. 316) birlikte verilir. Kâdîhân kontrolünde İmâm-ı a'zam kavli (−19°) esastır; İmâmeyn kavli (−17°) sonucuyla birlikte alternatif olarak gösterilir. |
| ⏱ **Arama penceresi** | Gurûbdan hilâlin 5°'ye indiği âna kadar sürer. Yanında aranabilir aralık da gösterilir; aralığın karanlık eşiği seçilebilir. |
| 🧭 **Nereye bakmalı** | Batı ufku çizimi, 360° bütün ufuk ve gökyüzü haritası. Hilâlin yeri gurûb noktasına göre derece ve "yumruk" ölçeğiyle verilir; yönelim için parlak yıldız ve gezegenler gösterilir. Zaman sürgüsüyle akşamın her ânı görülebilir. |
| 📅 **Ay başı planlaması** | Ayın 1. gününün iki ihtimali (birinci ve ikinci gece) durum kartında; yaklaşan ve önceki rasad gecesi; **◀ Önceki ay başı / Sonraki ay başı ▶** düğmeleri ve 13 aylık **rasad geceleri listesi**; hicrî aylara göre gruplanmış rü'yet şeridi. |
| 🗓 **Hicrî tarih** | Kamerî gün şer'î gurûbda değişir (s. 188). Ayın 1. günü hesapla bulunan gün veya bir gün sonrası olduğu için (s. 315, 360) hicrî gün iki sayıyla yazılır; **"Neden iki sayı"** satırı hangi sayının hangi güne bağlı olduğunu söyler. Zilhiccede ana gösterim Tam İlmihâl'in bildirdiği Işık usulüdür (s. 326). Işık usulü, Uluğ Beğ, Ebüzziyâ / Kindî cetvelleri ve aritmetik takvim **?** açıklamasıyla tanıtılır (s. 358–362). |
| 🗺 **Dünya rü'yet imkânı haritası** | Akşam ve anlık kipler; Tam İlmihâl sınıfları, ilk görünürlük katmanı, hilâl yaşı çizgileri ve 18° gurûb boylamı. |
| ❔ **"Bu akşam ne demek?"** | Seçili akşam ve yer için açıklama penceresi, Tam İlmihâl'in **iki gece** bildirişine göre: hilâl hesâbın bildirdiği gecede doğar, o gece görülmeyip bir gece sonra görülebilir (s. 360); rü'yetle başlama bir gün sonra olabilir, önce olamaz (s. 315). Ayın 1. günü için iki kutu, bugünün kamerî günü, birinci ve ikinci gece tablosu, rü'yet kaydınıza göre tek cevap, ayın adına göre kapsam ve hüküm. Kâdîhân ölçüsü bilgi olarak verilir. Rü'yetsiz hüküm kurmaz. |
| 🔭 **Gök cisimleri** | "Seçili an" kartında Güneş, Ay, gezegenler ve parlak yıldızlar: yön ve yükseklik, doğuş–tepe–batış, kadir, takımyıldız, alacakaranlık evreleri ve bu gece çıplak gözle görülebilecekler. Rasad günleri dışında da bir gözlem aracıdır. |
| 🧭 **Gezinme** | Üst bantta gün okları ve **↶ Geri / İleri ↷**: "Şimdi" dahil her atlama geri alınabilir. Planlanan akşam Saha sekmesinde önizleme olarak görünür. |
| 📱 **Saha kipi** | Telefonda açık havada kullanım için: canlı saat, sabit duran geri sayımlar, gece (kırmızı) ve güneş altı temaları, ekranın açık kalması. **Pusula kadranı** hilâle kaç derece dönüleceğini söyler; Güneş'e çevrilerek manyetik sapma düzeltilir. |
| 📝 **Rü'yet kaydı ve tutanak** | Gözlem şartları, fotoğraf, SHA-256 bütünlük özeti ve cihaz imzası (ECDSA). A4 tutanak imza satırları ve QR koduyla basılır; kayıt sonradan doğrulanabilir. **Bildirim ekleri** kaydın kime, ne zaman ve nasıl bildirildiğini, kaydı değiştirmeden ve ayrıca imzalı olarak saklar. |
| 🖨 **A4 çıktılar** | Rasad planı, gökyüzü haritası (seçili an ve seçili akşam), aylık rü'yet imkânı çizelgesi, dünya rü'yet imkânı haritası ve tutanak; her biri tek sayfaya sığar. PDF veya JPG olarak kaydedilir; dosya adları tarih, saat ve yere göre sıralanır. |
| 🔒 **Gizlilik** | Kayıtlar, isimler ve konum yalnız tarayıcınızda durur. Program, siz izin vermedikçe internete bağlanmaz. Hava tahmini ve internet yazı tipleri Ayarlar'dan açılır; ikisi de başlangıçta kapalıdır. |
| 👁 **Göz güvenliği** | Güneş batmadan dürbün, kamera veya teleskopla batıya bakmayın. Hilâl çıplak gözle aranır. |
| 📚 **Rehber** | Her konuda fıkhî esas ve bilimsel açıklama, kısa ve ayrıntılı; **Naklî deliller** konusu (âyet, hadîs, icmâ ve âlimlerin bildirdikleri). |
| ➕ **Ek bilgiler** | Modern ölçütler (Yallop, Odeh, Danjon) ve aritmetik takvim usulleri yalnızca ek bilgi olarak, Tam İlmihâl'in hükmünden sonra verilir. |

<p align="center"><img src="docs/img/masaustu-harita.png" alt="Masaüstü · Dünya rü'yet haritası" width="900"><br><sub>Dünya rü'yet haritası: her yerin kendi gurûbunda hilâlin Tam İlmihâl'e göre durumu.</sub></p>

<p align="center"><img src="docs/img/aciklama.png" alt="Açıklama penceresi" width="640"><br><sub>"Bu akşam ne demek?" penceresi: 10 Aralık 2026, İstanbul. Receb 1448'in 1. günü iki günden biridir: 10 Aralık (birinci gece görülürse) veya 11 Aralık.</sub></p>

<p align="center"><img src="docs/img/gok-cisimleri.png" alt="Gök cisimleri aracı" width="640"><br><sub>Gök cisimleri: İstanbul, 20 Kasım 2026, 21:00. Bu gece çıplak gözle görülebilecekler ve seçili anda gökyüzü.</sub></p>

### A4 çıktı örnekleri

İstanbul, 10 Aralık 2026 akşamı (Receb 1448), programın JPG çıktıları. Büyük hâli için resme dokunun.

<table>
<tr>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_1742_Istanbul_rasad-plani.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_1742_Istanbul_rasad-plani.jpg" alt="Rasad planı" width="150"></a><br><sub>Rasad planı</sub></td>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_Istanbul_gokyuzu-aksam.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_Istanbul_gokyuzu-aksam.jpg" alt="Gökyüzü haritası (seçili akşam)" width="150"></a><br><sub>Gökyüzü haritası (seçili akşam)</sub></td>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_Istanbul_aylik-cizelge.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_Istanbul_aylik-cizelge.jpg" alt="Aylık rü'yet imkânı çizelgesi" width="150"></a><br><sub>Aylık rü'yet imkânı çizelgesi</sub></td>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_1742_Istanbul_dunya-haritasi.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_1742_Istanbul_dunya-haritasi.jpg" alt="Dünya rü'yet imkânı haritası" width="220"></a><br><sub>Dünya rü'yet imkânı haritası</sub></td>
</tr>
</table>

## Yayın adresi ve bütünlük

Programın özgün dosyası yalnızca [github.com/bemiroglu/MahiNev](https://github.com/bemiroglu/MahiNev) adresinde yayımlanır. Her HTML dosyasında lisans bilgisi ve bu adres bulunur.

Program açılışta kendi bütünlüğünü denetler. Dosya değiştirilmişse ekranın üstünde **"değiştirilmiş kopya"** uyarısı çıkar. Aynı ibare baskı çıktılarına ve rü'yet kayıtlarına da yazılır.

## Doğrulama

- **Program içinde:** Doğrulama sekmesinde 61 test bulunur. Testler Tam İlmihâl'deki örnekleri (Receb 1400, s. 360), Kongre tebliğindeki Receb 1437 vakasını, iki gece esasını (Zilhiccede Işık usulü dahil), gök cisimleri hesabını, şafak ve temkin usulünü (s. 178, 197), yaz saati geçişlerini, Yallop ölçütünü, küresel kapsamı ve kayıt bütünlüğünü sınar.
- **Uçtan uca tarama:** `tests/ui_tarama.py`; 2 ekran boyutu, 2 dil, 5 tema, bütün sekmeler, diyaloglar ve 9 uç konum (kutup gecesi, tarih çizgisi, yaz saati, Mekke). Hata, taşma ve dış istek arar.
- **Dünya taraması:** `tests/dunya_tarama.py`; 47 uç konum (kutuplar, tarih çizgisinin iki yanı, yarım ve çeyrek saatli dilimler, yaz saati geçişleri, deniz seviyesinin altı ve Everest) ve 7 tarihte bütün sekmeler, açıklama penceresi ve A4 çıktıları, Türkçe ve İngilizce.
- **Küresel kapsam:** `tools/kuresel_dogrulama.py`
- **Rü'yet kaydı:** `tools/verify_record.py` ile bir kaydın özeti, imzası ve QR kodu bilgisayarda doğrulanır.

Program bir gözlem **planlama ve kayıt** yardımcısıdır; bağımsız bir efemeris referansı veya fıkhî karar sistemi değildir.

## Esaslar

Bütün kararlarda hayati ölçü, Tam İlmihâl'e (Ehl-i sünnet fıkhı) tam uymaktır. Sıralama şöyledir:

1. Tam İlmihâl;
2. Tam İlmihâl'in açık eşikleri (8°, 18°, 5°);
3. en hassas modern efemeris;
4. modern gözlem ölçütleri (yalnızca ek bilgi).

Yardımcı kaynak: Türkiye Takvimi Vakit Hesaplama Heyeti, *Naklî ve Aklî Delîllerle Rü'yet-i Hilâl*, Uluslararası Kamer Aybaşları ve Hicrî Takvîm Birliği Kongresi tebliği, İstanbul, 2016 ([PDF](https://www.turktakvim.com/pdf/HilalKongreTR.pdf)). Programda "Kongre tebliği" diye anılır.

| Belge | İçerik |
|---|---|
| [kanonik-metin.md](docs/kanonik-metin.md) | Temel kural metni |
| [kanonik-rapor.md](docs/kanonik-rapor.md) | Esaslar, terminoloji, doğrulama örnekleri ve alınan kararlar |
| [kullanim-kilavuzu.md](docs/kullanim-kilavuzu.md) | Kullanım kılavuzu |
| [kayit-semasi.md](docs/kayit-semasi.md) | Rü'yet kaydı ve doğrulaması |
| [coklu-dil.md](docs/coklu-dil.md) | Çok dilli altyapı ve yeni dil ekleme |
| [yol-haritasi.md](docs/yol-haritasi.md) | Planlanan işler |
| [CHANGELOG.md](CHANGELOG.md) | Sürümler |

## Geri bildirim

Hata bildirimi için [Issues](https://github.com/bemiroglu/MahiNev/issues) bölümünü kullanın. Fıkhî bir konu içeren öneriler, Tam İlmihâl'den sayfa numarasıyla gelmelidir. Ayrıntılar: [CONTRIBUTING.md](CONTRIBUTING.md).

## Derleme (geliştirici)

```bash
python3 build.py                 # dist/mahinev.html ve dist/mahinev-v<sürüm>.html
pip install playwright && playwright install chromium
python3 tests/run_tests.py       # Doğrulama sekmesindeki testler
python3 tests/ui_tarama.py       # uçtan uca arayüz taraması (uzun sürer)
python3 tests/dunya_tarama.py    # 47 uç konum × 7 tarih, bütün işlevler (HR_LANG=en ile İngilizce)
python3 tools/kuresel_dogrulama.py
```

## Lisans

Mâh-ı Nev © 2026 Bilal Emiroglu. [Creative Commons Atıf-GayriTicari-Türetilemez 4.0 Uluslararası (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.tr) ile lisanslanmıştır: ticarî olmayan, değiştirilmeden ve kaynak gösterilerek paylaşım. Bkz. [LICENSE](LICENSE).

Gömülü üçüncü taraf bileşenler kendi lisanslarıyla gelir: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

<br>

---

<a id="english"></a>

<div align="center">

# Mâh-ı Nev — English

**Crescent Sighting Assistant based on *Tam İlmihâl Se'âdet-i Ebediyye***

**[▶ Open online](https://bemiroglu.github.io/MahiNev/)** &nbsp;·&nbsp;
**[⬇ Download (v0.13.0)](https://bemiroglu.github.io/MahiNev/mahinev-v0.13.0.html)** &nbsp;·&nbsp;
**[📖 Endless Bliss](https://www.hakikatkitabevi.net/book.php?bookCode=025)**

</div>

> [!IMPORTANT]
> **This program is not a calendar.** A lunar month begins when the crescent is seen with the naked eye (*ru'yat*). Every result the program gives is a *calculated possibility*. The ruling is given by the competent authority, under the conditions of testimony (Tam İlmihâl, pp. 315–316, 360).

## About this tool

Mâh-ı Nev ("the new moon") is a sighting aid built on the teachings of the book *Tam İlmihâl Se'âdet-i Ebediyye* (Hakîkat Kitâbevi). It helps you plan a crescent watch and carry it out in the field.

It is not a source of fiqh and does not replace Tam İlmihâl. Fiqh is the essential and decisive knowledge: anything in this program that does not agree with Tam İlmihâl and with fiqh is void. For rulings, consult Tam İlmihâl itself.

- **Read or download *Endless Bliss*, the English version of Tam İlmihâl Se'âdet-i Ebediyye (Hakîkat Kitâbevi):** [Endless Bliss page](https://www.hakikatkitabevi.net/book.php?bookCode=025)
- Page numbers in the program refer to the Turkish Tam İlmihâl, **January 2026 printing**; other printings may differ by a few pages, and Endless Bliss has its own pagination.

<p align="center"><img src="docs/img/desktop-plan-en.png" alt="Desktop · Plan, English interface" width="900"><br><sub>The English interface: this evening's assessment and a short how-to for new users.</sub></p>

**A4 output samples.** JPG outputs of the program for Istanbul, evening of 10 December 2026 (Rajab 1448). Tap a picture to open it full size.

<table>
<tr>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_1742_Istanbul_rasad-plani.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_1742_Istanbul_rasad-plani.jpg" alt="Observation plan" width="150"></a><br><sub>Observation plan</sub></td>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_Istanbul_gokyuzu-aksam.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_Istanbul_gokyuzu-aksam.jpg" alt="Sky chart (selected evening)" width="150"></a><br><sub>Sky chart (selected evening)</sub></td>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_Istanbul_aylik-cizelge.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_Istanbul_aylik-cizelge.jpg" alt="Monthly sighting-possibility table" width="150"></a><br><sub>Monthly sighting-possibility table</sub></td>
<td align="center" valign="bottom"><a href="docs/img/ciktilar/MahiNev_2026-12-10_1742_Istanbul_dunya-haritasi.jpg"><img src="docs/img/ciktilar/kucuk/MahiNev_2026-12-10_1742_Istanbul_dunya-haritasi.jpg" alt="World sighting-possibility map" width="220"></a><br><sub>World sighting-possibility map</sub></td>
</tr>
</table>

## One file, every screen

Mâh-ı Nev is a single HTML file. Nothing to install: download it and open it in a browser. The same file runs on a computer, a tablet and a phone, and needs no internet once opened. Switch the interface between Turkish and English with the **TR / EN** buttons.

## Getting started

1. Open the [online address](https://bemiroglu.github.io/MahiNev/), or download the file and open it in your browser.
2. **Location:** pick your city or tap "Use my location". Latitude and longitude can be typed in any common form (41.0082 · 41°00'29"N).
3. In the **Upcoming month-start observation** card, find the observation night and go to that evening with "Plan this night".
4. On the evening, open the **Field** tab on your phone: the clock, countdowns, where to look and the sky view are there.
5. Whether you saw the crescent or not, create a **sighting record**. Print it as an A4 report or share it as JSON.

> [!TIP]
> The **⬇ Download HTML** button inside the program saves the version you are using as a single file. You can copy it to an offline phone or computer and use it there.

## What it does

| | |
|---|---|
| 🌙 **This evening's assessment** | By the classes of Tam İlmihâl: conjunction, elongation 8° / 18°, and 5° above the horizon (p. 360). Definite rejection, the sighting claim and the Kâdîhân check (p. 316) are given together. The Kâdîhân check uses Imâm-ı A'zam's view (−19°) as primary; the Imâmeyn view (−17°) is shown as the alternative, with its result. |
| ⏱ **Search window** | From sunset until the crescent comes down to 5°. The searchable interval is shown beside it, with a selectable darkness threshold. |
| 🧭 **Where to look** | Western-horizon drawing, a 360° horizon and a sky chart. The crescent's position is given from the sunset point in degrees and in "fists"; bright stars and planets help orientation. A time slider shows any moment of the evening. |
| 📅 **Month-start planning** | The two possible first days of the month (first and second night) in the status card; upcoming and previous observation nights; **◀ Previous / Next month start ▶** buttons and a 13-month **list of observation nights**; a sighting strip grouped by Hijri month. |
| 🗓 **Hijri date** | The lunar day changes at the legal sunset (p. 188). Day 1 of a month is the calculated day or one day later (pp. 315, 360), so the Hijri day is written with two numbers; a **"Why two numbers"** line says which number belongs to which day. For Dhu al-Hijja the main display follows the Işık method given in Tam İlmihâl (p. 326). The Işık method, the Ulugh Beg and Ebüzziyâ / Kindî tables and the arithmetic calendar are each introduced with a **?** explanation (pp. 358–362). |
| 🗺 **World sighting-possibility map** | Evening and instant modes; Tam İlmihâl classes, a first-visibility layer, crescent-age lines and the 18° sunset meridian. |
| ❔ **"What does this evening mean?"** | An explanation window for the selected evening and place, built on Tam İlmihâl's **two nights**: the crescent is born on the night calculation shows and may be seen one night later (p. 360); beginning by sighting may be one day later, never earlier (p. 315). Two boxes for day 1 of the month, today's lunar day, a first/second-night table, a single answer from your own sighting record, scope and ruling by month. The Qadikhan measure is given for information. It never rules without a sighting. |
| 🔭 **Celestial objects** | In the selected-moment card: Sun, Moon, planets and bright stars with direction and altitude, rise–transit–set, magnitude, constellation, twilight phases and what can be seen with the naked eye tonight. An observing tool for any day, not only watch evenings. |
| 🧭 **Navigation** | Day arrows and **↶ Back / Forward ↷** in the top bar: every jump, including "Now", can be undone. A planned evening is previewed in the Field tab. |
| 📱 **Field mode** | For outdoor use on a phone: live clock, steady countdowns, night (red) and sunlight themes, keep-screen-on. The **compass dial** tells how many degrees to turn to face the crescent; calibrating on the Sun corrects magnetic variation. |
| 📝 **Sighting record and report** | Observing conditions, photo, SHA-256 integrity digest and a device signature (ECDSA). The A4 report prints with signature lines and a QR code, and the record can be verified later. **Notification annexes** record to whom, when and how the sighting was reported, signed separately and without altering the record. |
| 🖨 **A4 outputs** | Observation plan, sky chart (selected moment and selected evening), monthly sighting-possibility table, world sighting-possibility map and sighting report, each on one page. Save as PDF or JPG; file names sort by date, time and place. |
| 🔒 **Privacy** | Records, names and location stay in your browser only. The program never goes online unless you allow it. Weather forecast and web fonts are switched on in Settings; both start off. |
| 👁 **Eye safety** | Never look west through binoculars, a camera or a telescope before the Sun has set. Search for the crescent with the naked eye. |
| 📚 **Guide** | For each topic the legal basis and a scientific explanation, short or detailed; a **Textual evidence** topic (Qur'an, hadith, consensus and the scholars' reports). |
| ➕ **Additional information** | Modern criteria (Yallop, Odeh, Danjon) and arithmetic calendar methods are given only as additional information, after the ruling of Tam İlmihâl. |

## Published address and integrity

The original file is published only at [github.com/bemiroglu/MahiNev](https://github.com/bemiroglu/MahiNev). Every HTML file carries the licence and this address.

On opening, the program checks its own integrity. If the file has been altered, a **"modified copy"** warning appears at the top of the screen, and the same words are written on printouts and sighting records.

## Verification

- **In the program:** the Verification tab runs 61 tests: the examples in Tam İlmihâl (Rajab 1400, p. 360), the Rajab 1437 case from the congress paper, the two-night rule (including the Işık method for Dhu al-Hijja), the celestial-object calculations, dawn and *temkin* rules (pp. 178, 197), daylight-saving changes, the Yallop criterion, worldwide scope and record integrity.
- **End-to-end scan:** `tests/ui_tarama.py` covers 2 screen sizes, 2 languages, 5 themes, every tab and dialog, and 9 extreme locations (polar night, date line, daylight saving, Mecca), looking for errors, overflow and outside requests.
- **World sweep:** `tests/dunya_tarama.py` runs every tab, the explanation window and the A4 printouts at 47 extreme locations (poles, both sides of the date line, half- and quarter-hour zones, daylight-saving changes, below sea level and Everest) on 7 dates, in Turkish and English.
- **Worldwide scope:** `tools/kuresel_dogrulama.py`
- **Sighting records:** `tools/verify_record.py` checks a record's digest, signature and QR code on a computer.

The program is an aid for **planning and recording** an observation; it is not an independent ephemeris reference or a system for fiqh rulings.

## Principles

In every decision the vital measure is full agreement with Tam İlmihâl (Ahl al-Sunna fiqh). The order of precedence is:

1. Tam İlmihâl;
2. the explicit thresholds of Tam İlmihâl (8°, 18°, 5°);
3. the most precise modern ephemeris;
4. modern visibility criteria (additional information only).

Supporting source: Türkiye Takvimi Prayer Times Committee, *Naklî ve Aklî Delîllerle Rü'yet-i Hilâl*, paper to the International Congress on Lunar Month Beginnings and Hijri Calendar Unity, Istanbul, 2016 ([PDF](https://www.turktakvim.com/pdf/HilalKongreTR.pdf), Turkish). Cited in the program as the "congress paper".

The project documents in [`docs/`](docs/) are written in Turkish.

## Feedback

Please use [Issues](https://github.com/bemiroglu/MahiNev/issues) to report problems. Suggestions on a matter of fiqh should come with a page reference from Tam İlmihâl. Details: [CONTRIBUTING.md](CONTRIBUTING.md).

## Building (developers)

```bash
python3 build.py                 # dist/mahinev.html and dist/mahinev-v<version>.html
pip install playwright && playwright install chromium
python3 tests/run_tests.py       # tests from the Verification tab
python3 tests/ui_tarama.py       # end-to-end interface scan (slow)
python3 tests/dunya_tarama.py    # 47 extreme locations × 7 dates, every function (HR_LANG=en for English)
python3 tools/kuresel_dogrulama.py
```

## Licence

Mâh-ı Nev © 2026 Bilal Emiroglu. Licensed under [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/): non-commercial sharing, unmodified, with attribution. See [LICENSE](LICENSE).

Embedded third-party components come with their own licences: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
