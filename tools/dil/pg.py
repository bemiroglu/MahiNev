import re, sys
def load(n):
    L = open(f'/home/claude/eb/{n}.txt').read().split('\n')
    marks = [(i, int(m.group(1))) for i, l in enumerate(L) for m in [re.search(r'– (\d{1,3}) –', l)] if m]
    return L, marks
def page_of(marks, i):
    for j, p in marks:
        if j >= i: return p
    return None
n = sys.argv[1]; L, M = load(n)
for pat in sys.argv[2:]:
    r = re.compile(pat)
    hits = [i for i, l in enumerate(L) if r.search(l)]
    print(f'## {pat}: ' + ', '.join(f'{page_of(M,i)}(L{i+1})' for i in hits[:12]))
