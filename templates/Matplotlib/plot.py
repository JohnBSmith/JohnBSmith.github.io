
# A template for simple plots, viewed on screen
# and included in HTML documents.

import matplotlib as mp
import matplotlib.pyplot as plot
from numpy import arange, array
from math import pi, sin, cos, tan, exp, log

lw_grid = 1.6
lw_line = 2.2
axes_color = "#505050"

blue = [0,0.2,0.6,0.8]
green = [0,0.46,0,0.8]
magenta = [0.6,0,0.4,0.8]
bgreen = [0,0.4,0.4,0.8]
gblue = [0,0.4,0.6,0.8]
black = [0,0,0,0.8]

style = {
  "axes.linewidth": lw_grid,
  "grid.linewidth": lw_grid,
  "grid.linestyle": "solid",
  "grid.color": "#e0e0d4",
  "lines.linewidth": 2,
  # "lines.markersize": 10,
  # "xtick.labelsize": 20,
  # "ytick.labelsize": 20,
}
mp.rcParams.update(style)

fig = plot.figure()
ax = fig.add_subplot(1,1,1)

ax.spines['bottom'].set_color(axes_color)
ax.spines['top'].set_color(axes_color) 
ax.spines['right'].set_color(axes_color)
ax.spines['left'].set_color(axes_color)
ax.spines['bottom'].set_zorder(10)
ax.spines['top'].set_zorder(10)
ax.spines['right'].set_zorder(10)
ax.spines['left'].set_zorder(10)

ax.xaxis.grid()
ax.yaxis.grid()
ax.set_axisbelow(True)
ax.xaxis.set_tick_params(width=lw_grid,length=6,color=axes_color)
ax.yaxis.set_tick_params(width=lw_grid,length=6,color=axes_color)
ax.set_aspect('equal')

X=[-5,5] 
Y=[-5,5]
ax.axis(X+Y)
ax.set_xticks(range(X[0],X[1]+1,1))
ax.set_yticks(range(Y[0],Y[1]+1,1))

reticle_color = [0.5,0.5,0.5,0.6]
ax.axhline(y=0,color=reticle_color,zorder=2,linewidth=lw_grid)
ax.axvline(x=0,color=reticle_color,zorder=2,linewidth=lw_grid)

def f(x): return x
def g(x): return x*x
def h(x): return 3*sin(pi*x)/(pi*x)

def fx(x): return 4*cos(x)
def fy(x): return 4*sin(x)

x = arange(-10, 10, 0.01)
yf = array(map(f,x))
yg = array(map(g,x))
yh = array(map(h,x))

t = arange(0,2*pi+0.01,0.01)
xt = array(map(fx,t))
yt = array(map(fy,t))

ax.plot(x,yf, color=blue,   zorder=3,linewidth=lw_line)
ax.plot(x,yg, color=green,  zorder=3,linewidth=lw_line)
ax.plot(x,yh, color=magenta,zorder=3,linewidth=lw_line)
ax.plot(xt,yt,color=bgreen, zorder=3,linewidth=lw_line)

fontsize = 16
ax.text(X[1]-0.6,Y[0]+0.2,"x", fontsize=fontsize, style="italic", color="#202020")
ax.text(X[0]+0.2,Y[1]-0.5,"y", fontsize=fontsize, style="italic", color="#202020")

plot.savefig("plot.png",bbox_inches='tight')
# plot.savefig("plot.svg",bbox_inches='tight')
# plot.show()

