# Yazılım mimarisi

Program tek bir HTML dosyasıdır. `build.py`, `src/template.html` şablonuna modülleri sırasıyla gömer. Astronomy Engine (`vendor/`) ile kanonik metin (`docs/kanonik-metin.md`) de bu dosyaya eklenir.

| Modül | Görev |
|---|---|
| `core.js` (`HRCore`) | Hesap çekirdeği: topozentrik konum, beynûnet, zâhirî ve şer'î gurûb (temkin), şafak, ictimâ, akşam değerlendirmesi (`evening`), kitabın sınıfları (`classify`), en erken gün, harita hücresi, sabah hilâli, anlık konumlar, aranabilirlik, gözlem geceleri |
| `calendars.js` (`HRCal`) | Hicrî tabular takvim, Işık usulü, madde 88, Kindî, Uluğ Beğ; ictimâya göre ay adı |
| `i18n*.js` | Türkçe ve İngilizce metinler (sürümlere göre ekler) |
| `guide.js` | Rehber konuları: fıkhî ve bilimsel açıklamalar |
| `land.js`, `stars.js` | Kara ve sınır verisi (Natural Earth); yıldız ve takımyıldız verisi (d3-celestial) |
| `sky.js` (`HRSky`) | Batı ufku çizimi ve 360° panorama (SVG) |
| `starmap.js` (`HRStarMap`) | Stereografik gökyüzü haritası, yönelim yardımcıları |
| `map.js` (`HRMap`) | Dünya haritası (Canvas): akşam katmanları (piksel düzeyinde ara değer) ve anlık kip |
| `online.js` (`HROnline`) | İsteğe bağlı çevrimiçi katman: Open-Meteo, konum, korumalı çerçeve (sandbox) algılama |
| `integrity.js` (`HRSig`) | Kanonik JSON, SHA-256, WebCrypto ECDSA imzası |
| `qrcode.js` | QR kodu üretimi (Kazuhiko Arase, MIT) |
| `ui.js` | Arayüz, zaman kipleri, Plan, Harita ve Saha sekmeleri, kayıtlar, baskı sayfaları, Doğrulama testleri |

## Zaman modeli

- Seçili an `st.date` (seçili saat dilimindeki yerel tarih) ile `st.tmin` (o günün 00:00'ından dakika, 0–1620) değerlerinden oluşur.
- Akşam hesabı saat diliminden değil, konumun güneş öğlesinden başlar. Bu sayede saat dilimi ile konum uyuşmasa da doğru akşam bulunur.
- Kamerî gün şer'î gurûbda değişir.

## Testler

Doğrulama sekmesi kitaptaki örnekleri ve bilinen değerleri sınar:

- Receb 1400 ve Kayseri 1987 örnekleri;
- İstanbul temkini;
- takvim usulleri;
- Jamry ile karşılaştırma;
- saat dilimi bağımsızlığı;
- gözlem geceleri, hicrî yıl gösterimi, gök haritası, kayıt bütünlüğü.

`tests/run_tests.py` aynı testleri başsız tarayıcıda çalıştırır. `tools/` altındaki Python betikleri geliştirme sırasında kitapla karşılaştırma için kullanılmıştır; çalıştırmak için `pip install astronomy-engine` gerekir.
