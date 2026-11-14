import re, pathlib, sys
src = pathlib.Path('/home/claude/mahinev/src')
skip = {'land.js','qrcode.js','stars.js','relief.js','coords.js','integrity.js','online.js'}
out = []
starts = re.compile(r"(\ben\s*:\s*[\{\[]|Object\.assign\(T\.en\b|HR_CANON_EN\s*=\s*\[|T\.en\.[A-Za-z0-9_]+\s*=)")
for f in sorted(src.glob('*.js')):
    if f.name in skip: continue
    L = f.read_text().split('\n')
    i = 0
    while i < len(L):
        m = starts.search(L[i])
        if m:
            depth = 0; j = i; started = False
            seg_start = m.start()
            while j < len(L):
                line = L[j] if j > i else L[j][seg_start:]
                for ch in line:
                    if ch in '{[(': depth += 1; started = True
                    elif ch in '}])': depth -= 1
                out.append(f"{f.name}:{j+1}: {L[j].strip()}")
                if started and depth <= 0: break
                j += 1
            i = j + 1
        else:
            # inline ternaries: tr ? '...' : '...' (English half)
            if re.search(r"\btr \? .*' : '", L[i]) or re.search(r"L === 'en' \?", L[i]):
                out.append(f"{f.name}:{i+1}: {L[i].strip()}")
            i += 1
pathlib.Path('/home/claude/eb/en_corpus.txt').write_text('\n'.join(out))
print(len(out), sum(len(x) for x in out))
