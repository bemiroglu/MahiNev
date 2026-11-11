"""Mâh-ı Nev — Hilâl Rasad Yardımcısı — tek dosyalık HTML üretimi.

Kullanım:  python3 build.py
Çıktı:     dist/mahinev.html            (çevrimdışı çalışır; Astronomy Engine gömülü)
           dist/mahinev-v<sürüm>.html   (aynı dosyanın sürümlü kopyası)
Kanonik kural metni docs/kanonik-metin.md dosyasından okunur ve programın içine gömülür.

Resmî sürüm bildirimi (telif, lisans, GitHub adresi) şifrelenip dört parçaya bölünerek
farklı modüllere gömülür; ayrıca modül betiğinin özeti (FNV-1a, 2×32 bit) hesaplanıp
programa yazılır. Program açılışta özeti yeniden hesaplar; eşleşmezse "resmî olmayan
kopya" uyarısı gösterir. Bu bir caydırıcıdır, kriptografik koruma değildir.
"""
import base64, json, pathlib, re

R = pathlib.Path(__file__).parent
src = R / 'src'

NOTICE = {
    'n': 'Mâh-ı Nev — Hilâl Rasad Yardımcısı',
    'c': '© 2026 Bilal Emiroglu',
    'l': 'CC BY-NC-ND 4.0',
    'lu': 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    'u': 'https://github.com/bemiroglu/MahiNev',
    'p': 'https://bemiroglu.github.io/MahiNev/',
}
SEED = 0x6D61684E  # ui.js içindeki çözücüyle aynı olmalı
ZERO = 'HRD' + '0' * 16


def keystream(n, seed=SEED):
    x = seed & 0xFFFFFFFF
    for i in range(n):
        x ^= (x << 13) & 0xFFFFFFFF
        x ^= x >> 17
        x ^= (x << 5) & 0xFFFFFFFF
        yield (x + i * 0x9E37) & 0xFF


def encode_notice():
    raw = json.dumps(NOTICE, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    enc = bytes(b ^ k for b, k in zip(raw, keystream(len(raw))))
    s = base64.b64encode(enc).decode('ascii')
    q = -(-len(s) // 4)
    parts = [s[i * q:(i + 1) * q] for i in range(4)]
    parts[1], parts[3] = parts[1][::-1], parts[3][::-1]   # 2. ve 4. parça ters yazılır
    return parts


def fnv2(text):
    """İki farklı başlangıçlı FNV-1a 32; UTF-16 kod birimleri üzerinden (tarayıcıdaki String ile aynı)."""
    h1, h2, P = 0x811C9DC5, 0x050C5D1F, 0x01000193
    b = text.encode('utf-16-le')
    for i in range(0, len(b), 2):
        u = b[i] | (b[i + 1] << 8)
        h1 = ((h1 ^ u) * P) & 0xFFFFFFFF
        h2 = ((h2 ^ (u + 0x3F)) * P) & 0xFFFFFFFF
    return f'{h1:08x}{h2:08x}'


tpl = (src / 'template.html').read_text(encoding='utf-8')
canon = (R / 'docs' / 'kanonik-metin.md').read_text(encoding='utf-8')
paras = [re.sub(r'\s+', ' ', p).strip() for p in canon.splitlines() if p.strip()]
canon_js = 'window.HR_CANON_TR = ' + json.dumps(paras, ensure_ascii=False) + ';'
# Modül sırası önemlidir: çekirdek → takvimler → metinler → veri → çizim → arayüz
ORDER = ['core.js', 'calendars.js', 'i18n.js', 'i18n_ext.js', 'land.js', None, 'canon_en.js', 'guide.js',
         'i18n_v03.js', 'i18n_v04.js', 'i18n_v05.js', 'i18n_v06.js', 'i18n_v07.js', 'i18n_v08.js', 'stars.js', 'online.js', 'qrcode.js',
         'integrity.js', 'coords.js', 'sky.js', 'starmap.js', 'map.js', 'ui.js']
parts = [canon_js if n is None else (src / n).read_text(encoding='utf-8') for n in ORDER]
mods = '\n'.join(parts).replace('</script', '<\\/script')
for i, p in enumerate(encode_notice(), 1):
    ph = f"'@@N{i}@@'"
    assert mods.count(ph) == 1, f'yer tutucu {ph} bulunamadı'
    mods = mods.replace(ph, f"'{p}'")
assert mods.count(ZERO) == 1, 'özet yer tutucusu tek olmalı'

body = tpl.replace('/*MODULES*/', mods)
m = re.search(r'<script>\n(window\.HR_SRC.*?)</script>', body, re.S)
assert m, 'modül betiği bulunamadı'
script_text = '\n' + m.group(1)  # <script> etiketinden hemen sonraki satır sonu da textContent'e dahildir
digest = 'HRD' + fnv2(script_text)
body = body.replace(ZERO, digest)

lib = (R / 'vendor' / 'astronomy.browser.min.js').read_text(encoding='utf-8').replace('</script', '<\\/script')
lic = '/* Astronomy Engine 2.1.19 - Copyright (c) 2019-2024 Don Cross - MIT License - https://github.com/cosinekitty/astronomy */\n'
out = body.replace('<!--ASTRONOMY-->', '<script>' + lic + lib + '</script>')
ver = re.findall(r"HR_VERSION = '([^']+)'", mods)[-1]
out = out.replace('@@VERSION@@', ver)
(R / 'dist').mkdir(exist_ok=True)
for old in (R / 'dist').glob('hilal-ruyet*.html'):
    old.unlink()
(R / 'dist' / 'mahinev.html').write_text(out, encoding='utf-8')
(R / 'dist' / f'mahinev-v{ver}.html').write_text(out, encoding='utf-8')
print(f'v{ver}: {len(out.encode()):,} bayt · özet {digest}')
