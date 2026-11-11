"""Rü'yet kaydını (hilal-ruyet-kaydi/1) doğrular: SHA-256 özeti ve varsa ECDSA P-256 imzası.

Kullanım:  python3 tools/verify_record.py kayit.json [kayit2.json ...]
İmza denetimi için:  pip install cryptography
"""
import base64, hashlib, json, sys

def canon(v):
    if isinstance(v, dict):
        return '{' + ','.join(json.dumps(k, ensure_ascii=False) + ':' + canon(v[k]) for k in sorted(v)) + '}'
    if isinstance(v, list):
        return '[' + ','.join(canon(x) for x in v) + ']'
    return json.dumps(v, ensure_ascii=False, separators=(',', ':'))

def b64u(s):
    return base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))

def verify(rec):
    body = {k: v for k, v in rec.items() if k not in ('hash', 'sig')}
    h = hashlib.sha256(canon(body).encode('utf-8')).hexdigest()
    ok_hash = h == rec.get('hash')
    ok_sig = None
    if rec.get('sig') and rec.get('signer'):
        try:
            from cryptography.hazmat.primitives.asymmetric import ec, utils
            from cryptography.hazmat.primitives import hashes
            pub = rec['signer']['pub']
            key = ec.EllipticCurvePublicNumbers(int.from_bytes(b64u(pub['x']), 'big'), int.from_bytes(b64u(pub['y']), 'big'), ec.SECP256R1()).public_key()
            raw = base64.b64decode(rec['sig']['value'])
            der = utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big'))
            key.verify(der, rec['hash'].encode('utf-8'), ec.ECDSA(hashes.SHA256()))
            ok_sig = True
        except ImportError:
            ok_sig = 'cryptography paketi yok'
        except Exception:
            ok_sig = False
    return ok_hash, ok_sig

if __name__ == '__main__':
    bad = 0
    for path in sys.argv[1:]:
        rec = json.load(open(path, encoding='utf-8'))
        oh, os_ = verify(rec)
        print(f"{path}: özet {'DOĞRU' if oh else 'HATALI'} · imza {os_ if os_ is not None else 'yok'}")
        bad += (not oh) or (os_ is False)
    sys.exit(1 if bad else 0)
