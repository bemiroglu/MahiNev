"""Rü'yet kaydını (hilal-ruyet-kaydi/1) doğrular: SHA-256 özeti, imza anahtarının parmak izi ve varsa ECDSA P-256 imzası.
Kâğıt tutanaktaki kod (QR metni "HRK1|kayıt-no|özet" ya da yalnız 64 haneli özet) verilirse kayıtla karşılaştırılır.

Kullanım:  python3 tools/verify_record.py kayit.json [kayit2.json ...] [--kod "HRK1|...|..."]
İmza denetimi için:  pip install cryptography
"""
import base64, hashlib, json, re, sys

def canon(v):
    if isinstance(v, dict):
        return '{' + ','.join(json.dumps(k, ensure_ascii=False) + ':' + canon(v[k]) for k in sorted(v)) + '}'
    if isinstance(v, list):
        return '[' + ','.join(canon(x) for x in v) + ']'
    return json.dumps(v, ensure_ascii=False, separators=(',', ':'))

def b64u(s):
    return base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))

def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

def parse_code(code):
    code = (code or '').strip()
    m = re.match(r'^HRK1\|([^|]+)\|([0-9a-fA-F]{64})$', code)
    if m:
        return m.group(1), m.group(2).lower()
    if re.match(r'^[0-9a-fA-F]{64}$', code):
        return None, code.lower()
    return None, None

def verify(rec):
    body = {k: v for k, v in rec.items() if k not in ('hash', 'sig', 'notices')}  # bildirim ekleri ayrıca mühürlüdür
    ok_hash = sha(canon(body)) == rec.get('hash')
    signer = rec.get('signer') or {}
    ok_fp = bool(signer.get('pub') and signer.get('fp') and sha(canon(signer['pub']))[:16] == signer['fp'])
    ok_sig = None
    if rec.get('sig') and signer.get('pub'):
        try:
            from cryptography.hazmat.primitives.asymmetric import ec, utils
            from cryptography.hazmat.primitives import hashes
            pub = signer['pub']
            key = ec.EllipticCurvePublicNumbers(int.from_bytes(b64u(pub['x']), 'big'), int.from_bytes(b64u(pub['y']), 'big'), ec.SECP256R1()).public_key()
            raw = base64.b64decode(rec['sig']['value'])
            der = utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big'))
            key.verify(der, rec['hash'].encode('utf-8'), ec.ECDSA(hashes.SHA256()))
            ok_sig = ok_fp and ok_hash
        except ImportError:
            ok_sig = 'cryptography paketi yok'
        except Exception:
            ok_sig = False
    return ok_hash, ok_fp, ok_sig

if __name__ == '__main__':
    args, code = [], None
    it = iter(sys.argv[1:])
    for a in it:
        if a == '--kod':
            code = next(it, None)
        else:
            args.append(a)
    cid, chash = parse_code(code) if code else (None, None)
    bad = 0
    for path in args:
        rec = json.load(open(path, encoding='utf-8'))
        oh, of, os_ = verify(rec)
        line = f"{path}: özet {'DOĞRU' if oh else 'HATALI'} · parmak izi {rec.get('signer', {}).get('fp', '—')} {'uyumlu' if of else 'UYUMSUZ'} · imza {os_ if os_ is not None else 'yok'}"
        if code:
            match = oh and chash == rec.get('hash') and (cid is None or cid == rec.get('id'))
            line += f" · kâğıttaki kod {'BU KAYDA AİT' if match else 'BU KAYDA AİT DEĞİL'}"
            bad += not match
        print(line)
        bad += (not oh) or (os_ is False)
        # bildirim ekleri (hilal-bildirim/1): her biri kendi özetini ve imzasını taşır, kaydın özetine bağlıdır
        for n in rec.get('notices') or []:
            nh, nf, ns = verify(n)
            bound = n.get('record') == rec.get('id') and n.get('recordHash') == rec.get('hash')
            to = n.get('to') or {}
            print(f"  bildirim {n.get('at', '')[:16]} → {to.get('name', '')}: özet {'DOĞRU' if nh else 'HATALI'} · imza {ns if ns is not None else 'yok'} · kayda bağ {'UYUMLU' if bound else 'UYUMSUZ'}")
            bad += (not nh) or (ns is False) or (not bound)
    sys.exit(1 if bad else 0)
