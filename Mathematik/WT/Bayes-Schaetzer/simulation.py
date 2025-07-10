
from random import choices, randrange

def samples(s, w, n):
    return choices([0, 1], weights = [s, w], k = n)

# Bayes_sequential(x, s, N)(w) = P(W=w | X=x)
def Bayes_sequential(x, s, N):
    def PL(x, w):
        return ((1-x)*s + x*w)/(s + w)
    P0 = [1/N for _ in range(N)]
    P = P0.copy()
    for xi in x:
        for w in range(N):
            P[w] = PL(xi, w)/sum(PL(xi, k)*P0[k] for k in range(N))*P0[w]
        P0 = P.copy()
    def P1(w):
        return P0[w]
    return P1

# Bayes_binomial(x, s, N)(w) = P(W=w | Y=y)
def Bayes_binomial(x, s, N):
    y = sum(x); n = len(x)
    def P(w):
        p = lambda w: w/(s + w)
        return p(w)**y*(1-p(w))**(n - y)/sum(
               p(k)**y*(1-p(k))**(n - y) for k in range(0, N))
    return P

def simple_sim(s, w, N, x, col3 = None):
    s1 = 0; s2 = 0; s3 = 0
    P1 = Bayes_sequential(x, s, N)
    P2 = Bayes_binomial(x, s, N)
    for w in range(0, N):
        p1 = P1(w); p2 = P2(w)
        s1 += p1; s2 += p2
        print(f"{w:2}   {p1:.4f}   {p2:.4f}", end ='')
        if col3:
            s3 += col3[w]
            print(f"   {col3[w]:.4f}")
        else:
            print()
    print("─"*(29 if col3 else 20))
    print(f" Σ   {s1:.4f}   {s2:.4f}", end = '')
    print(f"   {s3:.4f}" if col3 else "")

def super_sim():
    s = 4; N = 10; n = 10
    acc = []
    for _ in range(10000):
        w = randrange(N)
        x = samples(s, w, n)
        acc.append((w, x))
    freq = {}
    for y in range(n):
        count = 0
        d = dict((w, 0) for w in range(N))
        for (w, x) in acc:
            if sum(x) == y:
                count += 1
                d[w] += 1
        # freq[y][w] ≈ P(W=w | Y=y)
        freq[y] = dict((w, d[w]/count if count != 0 else "n.v.")
            for w in range(N))
    w = 3
    x = samples(s, w, n)
    y = sum(x)
    simple_sim(s, w, N, x, freq[y])

super_sim()
