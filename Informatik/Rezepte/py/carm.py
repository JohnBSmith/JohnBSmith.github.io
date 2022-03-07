
from math import gcd

def units(n):
    return [x for x in range(0, n) if gcd(n, x) == 1]

def carm(n):
    e = 1 if n != 1 else 0
    m = 1; G = units(n)
    while True:
        if all(pow(g, m, n) == e for g in G): return m
        m += 1

