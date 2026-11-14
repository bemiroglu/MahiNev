# Yardımcı araçlar

Bu araçlar programın parçası değildir; geliştirme sırasında kullanılır. Yollar çalışma alanına göre yazılmıştır (`/home/claude/mahinev`, `/home/claude/eb`); başka bir yerde kullanırken yolları değiştirin.

## tools/dil — dil ve kaynak işleri
- `enspans.js`: kaynak dosyalardaki İngilizce dizgileri yerleriyle bulur (`en: {…}`, `T.en`, `tr ? … : …` dalları). Gerekli paket: `npm install acorn acorn-walk`.
- `apply_terms.js`: İngilizce dizgilerde terim değişimi (Endless Bliss yazılışları). `--write` olmadan yalnız gösterir.
- `apply_cites.js`: Türkçe sayfa atıflarını Endless Bliss atıflarına ("EB V, p. 137") çevirir.
- `verify_cites.py`: her "EB …" atfının cümlesindeki anahtar kavramları, atıf yapılan Endless Bliss sayfasında arar. Endless Bliss’in metni `/home/claude/eb/Fourth.txt`, `Fifth.txt` olarak gerekir (`pdftotext -layout`).
- `pg.py`, `align.py`: Endless Bliss’te bir ifadenin sayfasını bulur; Türkçe ve İngilizce sayfaları sayılarla eşler.
- `glossary.py`: Fransızca, İspanyolca, Boşnakça kitaplardan terim adaylarını çıkarır (sonuç: `docs/dil-terimleri.md`).
- `dump_en.py`: İngilizce metinlerin kaba dökümü.
- `pack_dump.py`: Türkçe ve İngilizce metinleri dil paketi yapısında, altı parçaya (ui1, ui2, ui3, misc, guide, long) bölerek döker; çevirinin kaynağıdır. `python3 build.py && python3 tools/dil/pack_dump.py DİZİN` (tarayıcı yolu gerekirse `HR_CHROME`).
- `pack_check.js`: bir çeviri parçasını İngilizce parçayla yapı bakımından karşılaştırır (`node pack_check.js x.fr.js x.en.js`); `--build DİZİN fr src/lang/fr.js` parçaları birleştirir, denetler ve dil paketini yazar. Çeviri yönergesi ve terimler: `docs/ceviri-yonergesi.md`.

## tools/gorsel — ekran ve çıktı denetimi
- `map14.py`, `map14m.py`: harita ekranları, üç gece, PNG kaydı (masaüstü ve telefon).
- `rel14.py`, `jpgset.py`: README görselleri ve A4 JPG örnekleri.
- `audit14.py`: Türkçe ve İngilizce baskı metinlerinin dökümü (dil denetimi).
- `a4_sigma.py`: bütün baskı sayfalarının A4’e sığdığını denetler.
- `en_metin.py`: İngilizce Rehber ve Plan metnini döker.
