
import numpy as np
from numpy import arange, array
import matplotlib as mp
import matplotlib.pyplot as pplot
from math import exp, log, pi, sin, cos, tan, tanh

black = [0,0,0]
lw_line = 2.0
lw_grid = 1.8
lw_tick = 1.8

tick_length = 6.0

style = {
  "xtick.labelsize": 16,
  "ytick.labelsize": 16,
  "grid.linewidth": lw_grid,
  "grid.linestyle": "dotted"
}
mp.rcParams.update(style)

def ln(x):
  return float("nan") if x<=0 else log(x)

def plot(a,X,Y,title,discont=None):
  fig = pplot.figure()
  ax = fig.add_subplot(1,1,1)
  
  ax.spines['left'].set_position('zero')
  ax.spines['bottom'].set_position('zero')
  ax.spines['right'].set_color('none')
  ax.spines['top'].set_color('none')
  ax.xaxis.set_ticks_position('bottom')
  ax.yaxis.set_ticks_position('left')
  
  ax.xaxis.grid()
  ax.yaxis.grid()
  
  ax.xaxis.set_tick_params(width=lw_tick,length=tick_length)
  ax.yaxis.set_tick_params(width=lw_tick,length=tick_length)
  
  ax.set_aspect('equal')
  ax.axis(X+Y)
  ax.set_xticks(list(range(X[0],0,1))+list(range(1,X[1]+1,1)))
  ax.set_yticks(list(range(Y[0],0,1))+list(range(1,Y[1]+1,1)))

  x = arange(X[0],X[1],0.001)
  if not isinstance(a,list): a=[a]
  for f in a:
    y = array(map(f,x))
    if discont is not None:
      y[:-1][np.diff(y) >= discont] = np.nan
    ax.plot(x,y,color=black,linewidth=lw_line)
  pplot.savefig(title,bbox_inches='tight')

# plot([exp,ln],X=[-5,5],Y=[-5,5],title="exp.pdf")
# plot(sin,X=[-1,9],Y=[-2,2],title="sin.pdf")
# plot(cos,X=[-1,9],Y=[-2,2],title="cos.pdf")
# plot(tan,X=[-1,9],Y=[-4,4],title="tan.pdf",discont=0.5)
plot(tanh,X=[-5,5],Y=[-2,2],title="tanh.pdf")




