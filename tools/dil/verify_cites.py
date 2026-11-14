import re, json, subprocess, sys
sys.path.insert(0, '/home/claude/eb')
subprocess.run(['node', '/home/claude/eb/enspans.js'], capture_output=True)
spans = json.load(open('/home/claude/eb/enspans.json'))

def pages(n):
    L = open(f'/home/claude/eb/{n}.txt').read().split('\n'); out = {}; cur = []
    for l in L:
        m = re.search(r'– (\d{1,3}) –', l)
        if m:
            cur.append(l[:m.start()]); out[int(m.group(1))] = re.sub(r'\s+', ' ', '\n'.join(cur)); cur = [l[m.end():]]
        else: cur.append(l)
    return out
EB = {'IV': pages('Fourth'), 'V': pages('Fifth')}

# İngilizce cümledeki anahtar → kitapta aranacak desen
KEYS = [
  (r'\b8°', r'eight degrees|8°'), (r'\b18°', r'eighteen|18'), (r'\b5°', r'five degrees|5°'),
  (r'57′', r'fifty-seven'), (r'28–72', r'twenty-\s?eight hours'), (r'1–2 days', r'one or two\s+days'),
  (r'Ottoman', r'Ottoman'), (r'Subkî', r'Subkî'), (r'Qâdî-Khân', r'Q[âa]d[îi]-Kh[âa]n'),
  (r'Ibni ’Âbidîn', r'’Âbidîn'), (r'Hindiyya', r'Hindiyya'), (r'Daqîq', r'Daqîq'),
  (r'’Arafa\b', r'’Arafa'), (r'Shawwâl', r'Shawwâl'), (r'29th', r'twenty-ninth'), (r'thirty|30 days|30\)', r'thirtieth|thirty'),
  (r'witness', r'witness|testimony'), (r'everywhere|whole world|all over the world|worldwide', r'all over the world'),
  (r'day (before|earlier)|one day later|never (a day )?earlier|cannot be earlier|cannot begin (before|earlier)', r'day before|day after|following day|previous day|next day'),
  (r'twilight', r'Shafaq|shafaq|redness|whiteness'), (r'Işık', r'Iş›k|IŞIK|Işık'), (r'Uluğ Bey', r'Ulu(ğ|⁄) Bey'),
  (r'Kindî', r'Kindî'), (r'Abuzziyâ', r'Abuzziyâ|Abuz-Ziyâ'), (r'Tamkin', r'Tamkin'), (r'whiteness', r'whiteness'),
  (r'redness', r'redness'), (r'−19°|19°', r'19°'), (r'−17°|17°', r'17°'), (r'106\.92', r'106\.92'),
  (r'adhânî', r'adh[aâ]n[iî]'), (r'make-up|qadâ', r'qadâ'), (r'calendar', r'calendar'), (r'Muharram', r'Muharram'),
  (r'Thursday', r'Thursday'), (r'Friday', r'Friday'), (r'16 July', r'16th of July'), (r'4\.367', r'4\.367'),
  (r'muhâq', r'[Mm]uh[âa]q'), (r'parallax', r'parallax'), (r'daytime|by day', r'during the day'),
  (r'precaution', r'precaution'), (r'highest point', r'highest'), (r'dip|lowers the horizon', r'dip'),
]
def cited(c):
    out = []
    for part in c.split(';'):
        m = re.search(r'(IV|V), pp?\. ([\d–, ]+)', part)
        if not m: continue
        vol = m.group(1)
        for it in m.group(2).split(','):
            it = it.strip()
            if not it: continue
            if '–' in it:
                a, b = [int(x) for x in it.split('–')]; out += [(vol, p) for p in range(a, b + 1)]
            else: out.append((vol, int(it)))
    return out
rows = []
for s in spans:
    v = s['v']
    for m in re.finditer(r'EB ((?:IV|V), pp?\. [\d–, ]+(?:; (?:IV|V), pp?\. [\d–, ]+)?)', v):
        sent = v[:m.start()]
        sent = re.split(r'(?<=[.!?])\s', sent)[-1] if sent else ''
        sent = sent[-260:]
        pgs = cited(m.group(1))
        txt = ' '.join(EB[vol].get(p, '') + ' ' + EB[vol].get(p + 1, '')[:400] for vol, p in pgs)
        need = [(k, pat) for k, pat in KEYS if re.search(k, sent)]
        miss = [k for k, pat in need if not re.search(pat, txt)]
        rows.append((s['f'], m.group(1), sent, len(need), miss))
bad = [r for r in rows if r[4]]
print('citations:', len(rows), 'with misses:', len(bad), 'no keys:', sum(1 for r in rows if r[3] == 0))
for f, c, sent, n, miss in bad:
    print(f'- {f} [{c}] miss={miss} :: …{sent[-170:]}')
print('\nNO-KEY:')
for f, c, sent, n, miss in rows:
    if n == 0: print(f'- {f} [{c}] :: …{sent[-150:]}')
