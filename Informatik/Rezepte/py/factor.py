
def factor(n):
    assert type(n) is int and n > 0
    acc = []
    p = 2
    while p*p <= n:
        e = 0
        while n%p == 0:
            n = n//p
            e += 1
        if e != 0: acc.append((p, e))
        p += 1
    if n != 1: acc.append((n, 1))
    return acc

# from math import prod
#
# for n in range(1, 10000):
#     assert n == prod(p**e for (p, e) in factor(n))

def exp_str(x):
    digits = "⁰¹²³⁴⁵⁶⁷⁸⁹"
    return "".join(digits[ord(d) - ord('0')] for d in str(x))

def show_pfd(n):
    return "·".join(str(p) + exp_str(e) for p, e in factor(n))

try:
    while True:
        n = int(input("Primfaktorzerlegung von "))
        print("= {}\n".format(show_pfd(n)))
except (KeyboardInterrupt, EOFError):
    print()

