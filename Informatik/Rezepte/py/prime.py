
from math import gcd

def is_invertible(x, n):
    e = 0 if n == 1 else 1
    return any((x*y)%n == e for y in range(0, n))

def units(n):
    return [k for k in range(0, n) if is_invertible(k, n)]

def phi0(n):
    return len(units(n))

def phi_def(n):
    return len([k for k in range(0, n) if gcd(n, k) == 1])

def phi(n):
    assert n > 0
    y = 1; p = 2
    while p*p <= n:
        e = 0
        while n%p == 0: n = n//p; e += 1
        if e != 0: y *= p**(e-1)*(p-1)
        p += 1
    if n != 1: y *= n - 1
    return y

def factor(n):
    assert n != 0
    acc = []
    if n < 0: n = -n; acc.append((-1, 1))
    p = 2
    while p*p <= n:
        e = 0
        while n%p == 0: n = n//p; e += 1
        if e != 0: acc.append((p, e))
        p += 1
    if n != 1: acc.append((n, 1))
    return acc
    
from math import prod

def phi_from_factor(n):
    return prod(p**(e-1)*(p-1) for (p, e) in factor(n))

#for n in range(1, 100):
#    assert phi(n) == phi_from_factor(n)

def mu(n):
    assert n > 0
    a = factor(n)
    if any(e != 1 for (p, e) in a):
        return 0
    elif len(a)%2 == 0:
        return 1
    else:
        return -1

print([mu(n) for n in range(11, 21)])

