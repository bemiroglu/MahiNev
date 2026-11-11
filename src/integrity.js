/* Rü’yet kaydının bütünlüğü: kanonik JSON, SHA-256 özeti ve isteğe bağlı ECDSA P-256 imzası (WebCrypto).
 * İmza anahtarı bu tarayıcıda IndexedDB’de, dışarı alınamaz (non-extractable) olarak saklanır; açık anahtar ve parmak izi kayda yazılır.
 * Amaç: kaydın sonradan değiştirilmediğini ve aynı cihazdan/gözlemciden geldiğini gösterebilmek. Kimlik doğrulaması değildir. */
(function (G) {
  'use strict';
  const subtle = G.crypto && G.crypto.subtle;
  // Anahtarları sıralı, boşluksuz JSON (aynı içerik → aynı metin → aynı özet)
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  const b64 = buf => btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
  async function sha256(data) {
    if (!subtle) return null;
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    return hex(await subtle.digest('SHA-256', bytes));
  }
  function idb() {
    return new Promise((res, rej) => {
      try { const r = indexedDB.open('hilal-ruyet', 1); r.onupgradeneeded = () => r.result.createObjectStore('keys'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }
      catch (e) { rej(e); }
    });
  }
  async function idbGet(k) { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction('keys').objectStore('keys').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
  async function idbPut(k, v) { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction('keys', 'readwrite'); tx.objectStore('keys').put(v, k); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); }
  let keyP = null;
  // Cihaz anahtarı: ilk kullanımda üretilir; ortam izin vermezse null
  function ensureKey() {
    if (keyP) return keyP;
    keyP = (async () => {
      if (!subtle || typeof indexedDB === 'undefined') return null;
      try {
        let kp = await idbGet('sign');
        if (!kp) { kp = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']); await idbPut('sign', kp); }
        const jwk = await subtle.exportKey('jwk', kp.publicKey);
        const pub = { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y };
        const fp = (await sha256(canon(pub))).slice(0, 16);
        return { kp, pub, fp };
      } catch (e) { return null; }
    })();
    return keyP;
  }
  // Kaydı mühürler: hash = SHA-256(kanonik kayıt, hash ve sig hariç); sig = ECDSA(hash)
  async function seal(rec) {
    const body = Object.assign({}, rec); delete body.hash; delete body.sig;
    const k = await ensureKey();
    if (k) body.signer = { pub: k.pub, fp: k.fp };
    const h = await sha256(canon(body));
    const out = Object.assign(body, { hash: h });
    if (k && h) { try { const sig = await subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, k.kp.privateKey, new TextEncoder().encode(h)); out.sig = { alg: 'ECDSA-P256-SHA256', value: b64(sig) }; } catch (e) { /* imzasız */ } }
    return out;
  }
  async function verify(rec) {
    if (!subtle || !rec || !rec.hash) return { hash: false, sig: false };
    const body = Object.assign({}, rec); delete body.hash; delete body.sig;
    const okHash = (await sha256(canon(body))) === rec.hash;
    let okSig = false;
    if (rec.sig && rec.signer && rec.signer.pub) {
      try {
        const key = await subtle.importKey('jwk', Object.assign({ ext: true }, rec.signer.pub), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
        const sig = Uint8Array.from(atob(rec.sig.value), c => c.charCodeAt(0));
        okSig = await subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sig, new TextEncoder().encode(rec.hash));
      } catch (e) { okSig = false; }
    }
    // Parmak izi, kayıttaki genel anahtardan yeniden hesaplanır (anahtar ile parmak izi birbirine uymalı)
    let okFp = false; try { okFp = !!(rec.signer && rec.signer.pub && rec.signer.fp && (await sha256(canon(rec.signer.pub))).slice(0, 16) === rec.signer.fp); } catch (e) { okFp = false; }
    return { hash: okHash, sig: okSig && okFp, fp: okFp };
  }
  G.HRSig = { canon, sha256, ensureKey, seal, verify };
})(typeof globalThis !== 'undefined' ? globalThis : window);
