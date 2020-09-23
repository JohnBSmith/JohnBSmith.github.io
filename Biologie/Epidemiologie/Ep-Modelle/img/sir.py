
from numpy import array as vector

# Explizites Euler-Verfahren
def euler_method(f,t0,x0,t1,h):
    t = t0; x = x0
    a = [[t,x]]
    for k in range(0,1+int((t1-t0)/h)):
        t = t0 + k*h
        x = x + h*f(t,x)
        a.append([t,x])
    return a

def sir_model(beta,gamma):
    def f(t,x):
        s,i,r = x
        return vector([
            -beta*s*i,
            beta*s*i - gamma*i,
            gamma*i
        ])
    return f

def sir_simulation(beta,gamma,i0,days,step=0.1):
    x0 = vector([1.0-i0,i0,0.0])
    model = sir_model(beta,gamma)
    return euler_method(model,0,x0,days,step)

def diagram(simulation):
    import matplotlib
    import matplotlib.pyplot as plot
    font = {'size': 14}
    matplotlib.rc('font', **font)

    figure,axes = plot.subplots()
    t,x = zip(*simulation())
    s,i,r = zip(*x)
    axes.plot(t,s, color = "#000000")
    axes.plot(t,i, color = "#000000")
    axes.plot(t,r, color = "#000000",
        linestyle = '--')
    plot.savefig("01-sir.pdf")

def simulation1():
    N = 83200000; R0 = 2.0; gamma = 1/4.0
    return sir_simulation(
        beta = R0*gamma, gamma = gamma,
        i0 = 10000.0/N, days = 80)

diagram(simulation1)
