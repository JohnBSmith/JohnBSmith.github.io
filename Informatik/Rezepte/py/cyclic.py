
from math import gcd

def units(n):
    return [x for x in range(0, n) if gcd(n, x) == 1]

def generate(g, n):
    acc = set()
    x = 1 if n != 1 else 0
    while not x in acc:
        acc.add(x)
        x = (x*g)%n
    return acc

def is_cyclic(n):
    G = units(n); setG = set(G)
    return any(generate(g, n) == setG for g in G)

def generators(n):
    G = units(n); setG = set(G)
    return [g for g in G if generate(g, n) == setG]

for n in range(1, 100):
    print("{:3} | {}".format(n, generators(n)))

