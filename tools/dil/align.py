import re, sys
def pages_tr():
    t = open('/home/claude/eb/TR.txt').read().split('\f'); return {i+1: p for i, p in enumerate(t)}
def pages_eb(n):
    L = open(f'/home/claude/eb/{n}.txt').read().split('\n'); out = {}; cur = []
    for l in L:
        m = re.search(r'– (\d{1,3}) –', l)
        if m:
            pre = l[:m.start()]; cur.append(pre); out[int(m.group(1))] = '\n'.join(cur); cur = [l[m.end():]]
        else: cur.append(l)
    return out
def toks(s):
    s = s.replace(',', '.')
    nums = set(x for x in re.findall(r'\d+(?:\.\d+)?', s) if len(x) >= 2 and not re.fullmatch(r'(19|20)\d\d', x) or (len(x)>=2))
    return nums
TR = pages_tr(); EB = pages_eb(sys.argv[1])
lo, hi = int(sys.argv[2]), int(sys.argv[3]); elo, ehi = int(sys.argv[4]), int(sys.argv[5])
for p in range(lo, hi+1):
    a = toks(TR[p]); best = []
    for q in range(elo, ehi+1):
        if q not in EB: continue
        b = toks(EB[q]); 
        if not a or not b: continue
        j = len(a & b) / len(a | b); best.append((j, q))
    best.sort(reverse=True)
    print(p, ' '.join(f'{q}:{j:.2f}' for j, q in best[:3]))
