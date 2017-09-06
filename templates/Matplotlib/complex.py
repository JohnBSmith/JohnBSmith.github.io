
import math, cmath
from cmath import exp, sin, cos
from math import pi, tanh
from scipy.special import gamma
import numpy as np
from numpy import vectorize

import matplotlib as mp
import matplotlib.pyplot as plot
from colorsys import hls_to_rgb

# line width of the frame grid
lw_grid=2

# color of the axes
axes_color = [0.28,0.28,0.26]

# lightness gradient
Lgrad = 0.5

# computational complexity
#  100: preview
# 1000: publication
N = 100

# viewport
X=[-6,6]
Y=[-6,6]

# function to be graphed
def f1(z):
  return gamma(z)
  
style = {
  "axes.linewidth": lw_grid
}
mp.rcParams.update(style)
  
def colorize(z):
  n,m = z.shape
  c = np.zeros((n,m,3))
  c[np.isinf(z)] = (1.0, 1.0, 1.0)
  c[np.isnan(z)] = (0.5, 0.5, 0.5)
  idx = ~(np.isinf(z) + np.isnan(z))

  # hue
  H = 1.0-np.angle(z[idx])/(2*pi)

  # lightness
  L = 0.03+0.97*(1.0 - 1.0/(1.0+abs(z[idx])**Lgrad))

  # alernative lightness calculations
  # L = 1.0 - 1.0/(1.0+abs(z[idx])**0.6)
  # L = (1.0-1.0/(1.0+abs(z[idx]))**0.5)
  # L = L*(1-np.cos(pi*abs(z[idx]))**40)
  # L = L*(1-0.8*np.cos(pi/2*np.log2(abs(z[idx])))**80)
  # L = L*(np.cos(4*np.angle(z[idx]))**20+1)
  # L = vectorize(lambda x: min(x,1))(H)

  c[idx] = [hls_to_rgb(h,l,1.0) for h,l in zip(H,L)]
  return c

axis_x = np.linspace(X[0],X[1],N)
axis_y = np.linspace(Y[0],Y[1],N)
x,y = np.meshgrid(axis_x,axis_y)
z = x + y*1j

# w = np.zeros((N,N),dtype='complex')
w = vectorize(f1)(z)

fig = plot.figure()
ax = fig.add_subplot(1,1,1)
ax.spines['bottom'].set_color(axes_color)
ax.spines['top'].set_color(axes_color) 
ax.spines['right'].set_color(axes_color)
ax.spines['left'].set_color(axes_color)

ax.xaxis.set_tick_params(width=lw_grid,length=-6,pad=10,color=axes_color)
ax.yaxis.set_tick_params(width=lw_grid,length=-6,pad=10,color=axes_color)
ax.set_aspect('equal')
ax.axis(X+Y)
ax.set_xticks(range(X[0],X[1]+1,1))
ax.set_yticks(range(Y[0],Y[1]+1,1))

ax.imshow(colorize(w), interpolation='bicubic',
  extent=(X[0],X[1],Y[0],Y[1]))

# contour lines
ax.contour(x, y, abs(w), [0.5,1,2,6,24],
  colors="#404040", alpha=0.2, linewidths=[3.5,4,4,4,4])
ax.contour(x, y, abs(w), [1E-9,1E-8,1E-7,1E-6,1E-5,0.0001,0.001],
  colors="#404040", alpha=0.1, linewidths=3)
ax.contour(x, y, abs(w), [0.01,0.1],
  colors="#404040", alpha=0.2, linewidths=[3.8,3.8])

ax.text(2.47, 1.2,"1", fontsize=10, color="#404040")
ax.text(2.97, 0.5,"2", fontsize=10, color="#404040")
ax.text(4.02, 1.0,"6", fontsize=10, color="#404040")
ax.text(4.8, 0.4,"24", fontsize=10, color="#404040")

ax.text(0.3,-0.2, "2", fontsize=10, color="#404040")
ax.text(0.5,-0.6, "1", fontsize=10, color="#404040")
ax.text(0.3,-1.1, "1/2", fontsize=10, color="#404040")
ax.text(-0.1,-2.0,"1/10", fontsize=10, color="#303030")
ax.text(-0.6,-3.1,"1/100", fontsize=10, color="#404040")
ax.text(-1.1,-4.1,"1/1000", fontsize=10, color="#303030")
ax.text(-1.4,-5.1,"1/10000", fontsize=10, color="#202020")

plot.savefig("plot.jpg",bbox_inches='tight')
# plot.show()

