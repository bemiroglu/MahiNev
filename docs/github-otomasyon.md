# GitHub ve otomasyon

## Depo

- Yayın deposu: **https://github.com/bemiroglu/MahiNev** (public).
- Yayın adresi (Pages): **https://bemiroglu.github.io/MahiNev/**.
- Lisans: CC BY-NC-ND 4.0 (`LICENSE`). Değiştirilmiş kopyalar dağıtılamaz; program kendi bütünlüğünü denetler.

## Bir kez yapılacak kurulum

1. **GitHub Pages:** Depo → Settings → Pages → *Build and deployment* → Source: **GitHub Actions**.
   - Bundan sonra `main` dalına gelen her sürüm Pages adresinde yayımlanır.
   - Bu adres normal bir web sitesidir: hava tahmini, otomatik konum, yazdırma ve HTML indirme burada da çalışır.
2. **Depo açıklaması:** Depo ana sayfası → *About* (⚙):
   - Description: `Mâh-ı Nev — Tam İlmihâl Se'âdet-i Ebediyye esaslı hilâl rasad yardımcısı (tek dosya, çevrimdışı HTML). Takvim değildir.`
   - Website: `https://bemiroglu.github.io/MahiNev/`
   - Topics: `hilal`, `crescent-moon`, `moon-sighting`, `hijri-calendar`, `islamic`, `astronomy`, `offline-first`, `html5`
3. **Dal koruması (önerilir):** Settings → Branches → `main` için *Require a pull request before merging* ve *Require status checks* (Derleme ve doğrulama).
4. **Claude erişimi:** claude.ai → Ayarlar → Bağlayıcılar → GitHub. Depo bir Claude oturumuna yazma izniyle bağlanınca Claude değişiklikleri doğrudan gönderebilir.

## Her yeni sürümde

- Claude değişiklikleri ayrı bir dala gönderir ve bir **çekme isteği** (pull request) açar.
- **Derleme ve doğrulama** iş akışı testleri çalıştırır.
- Siz inceleyip birleştirince Pages kendiliğinden güncellenir.
- Aynı paket her zaman zip olarak da verilir.

## Rü'yet raporları

- "Rü'yet raporu" issue formuyla gönderilen kayıtları **Rü'yet raporunu doğrula** iş akışı kontrol eder ve etiketler (bkz. [sehadet-agi.md](sehadet-agi.md)).
- Fıkhî değerlendirme ve karar yetkili heyete aittir.

## İsteğe bağlı: Claude'u depoda çalıştırmak

- Claude Code'un GitHub uygulaması depoya kurulursa, issue ve çekme isteklerinde `@claude` yazarak değişiklik istenebilir.
- Bunun için bir Anthropic API anahtarı veya kurumsal hesap ayarı gerekir. Kurulum ihtiyaç olduğunda ayrıca yapılır.
