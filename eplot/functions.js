
var ftab = {
  "List": List, "abs": abs, "sgn": sgn, "apply": apply,
  "exp": exp, "ln": ln, "lg": lg,
  "sin": sin, "cos": cos, "tan": tan, "cot": cot,
  "tanh": tanh, "sinh": sinh, "cosh": cosh,
  "re": real, "im": imag, "sqrt": sqrt, "diff": diff, "grad": grad,
  "D": Diff, "vdiff": vdiff, "inv": inv, "R": rotation_matrix,
  "sum": sum, "gamma": Gamma, "fac": fac, "rand": Rand,
  "vec": vec
};

var list_tab = {
  str: function(){
    var a = this.value.map(function(x){return x.str()});
    return "["+a.join(", ")+"]";
  },
  add: function(y){
    var a=[];
    var n=this.value.length;
    var v,w,i;
    if(y.value.length<n){
      v=y.value;
      w=this.value;
    }else{
      v=this.value;
      w=y.value;
    }
    i=0;
    while(i<v.length){
      a.push(v[i].add(w[i]));
      i++;
    }
    while(i<w.length){
      a.push(w[i]);
      i++;
    }
    return list(a);
  },
  sub: function(y){
    var a=[];
    for(var i=0; i<this.value.length; i++){
      a.push(this.value[i].sub(y.value[i]));
    }
    return list(a);
  },
  mpy: function(y){
    if(list_tab.isPrototypeOf(y)){
      return matrix_mpy(this.value,y.value);
    }else{
      var a = this.value.map(function(x){return y.mpy(x);});
      return list(a);
    }
  },
  div: function(y){
    var a = this.value.map(function(x){return x.div(y);});
    return list(a);
  },
  neg: function(){
    var a = this.value.map(function(x){return x.neg();});
    return list(a);
  },
  pow: function(n){
    return pow(this,n.value);
  }
};

function list(a){
  var x = Object.create(list_tab);
  x.value=a;
  return x;
}

function List(){
  var a=[];
  for(var i=0; i<arguments.length; i++){
    a.push(arguments[i]);
  }
  return list(a);
}

var float_tab = {
  str: function(){
    return this.value.toString();
  }, add: function(y){
    if(float_tab.isPrototypeOf(y)){
      return float(this.value+y.value);
    }else if(complex_tab.isPrototypeOf(y)){
      return complex(this.value+y.re,y.im);
    }else if(function_tab.isPrototypeOf(y)){
      var x=this;
      return new_function(function(t){
        return x.add(y.value(t));
      });
    }
  }, sub: function(y){
    if(float_tab.isPrototypeOf(y)){
      return float(this.value-y.value);
    }else if(function_tab.isPrototypeOf(y)){
      var x=this;
      return new_function(function(t){
        return x.sub(y.value(t));
      });
    }
  }, mpy: function(y){
    if(float_tab.isPrototypeOf(y)){
      return float(this.value*y.value);
    }else if(complex_tab.isPrototypeOf(y)){
      return complex(this.value*y.re,this.value*y.im);
    }else if(list_tab.isPrototypeOf(y)){
      var r = this;
      var a = y.value.map(function(x){return r.mpy(x);});
      return list(a);
    }else if(function_tab.isPrototypeOf(y)){
      var x=this;
      return new_function(function(t){
        return x.mpy(y.value(t));
      });
    }
  }, div: function(y){
    return float(this.value/y.value);
  }, mod: function(y){
    return float(this.value%y.value);
  }, neg: function(){
    return float(-this.value);
  }, pow: function(y){
    if(float_tab.isPrototypeOf(y)){
      return float(Math.pow(this.value,y.value));
    }else{
      return exp(ln(this).mpy(y));
    }
  }
};

function float(r){
  var x = Object.create(float_tab);
  x.value = r;
  return x;
}

var complex_tab = {
  str: function(){
    if(this.im<0){
      return this.re+"-"+(-this.im)+"i";
    }else{
      return this.re+"+"+this.im+"i";
    }
  },
  add: function(y){
    if(float_tab.isPrototypeOf(y)){
      return complex(this.re+y.value,this.im);
    }else{
      return complex(this.re+y.re,this.im+y.im);
    }
  },
  sub: function(y){
    if(float_tab.isPrototypeOf(y)){
      return complex(this.re-y.value,0);
    }else{
      return complex(this.re-y.re,this.im-y.im);
    }
  },
  mpy: function(y){
    if(float_tab.isPrototypeOf(y)){
      return complex(y.value*this.re,y.value*this.im);
    }else if(complex_tab.isPrototypeOf(y)){
      var re = this.re*y.re-this.im*y.im;
      var im = this.re*y.im+this.im*y.re;
      return complex(re,im);
    }else{
      var r=this;
      var a = y.value.map(function(x){return r.mpy(x);});
      return list(a);
    }
  },
  div: function(y){
    if(float_tab.isPrototypeOf(y)){
      return complex(this.re/y.value,this.im/y.value);
    }else if(complex_tab.isPrototypeOf(y)){
    
    }
  },
  neg: function(){
    return complex(-this.re,-this.im);
  },
  pow: function(y){
    return exp(ln(this).mpy(y));
  }
};

function complex(x,y){
  var z = Object.create(complex_tab);
  z.re=x; z.im=y;
  return z;
}

var function_tab = {
  str: function(){
    return "function";
  },
  pow: function(n){
    var f; n=n.value;
    if(n<0){
      f=finv(this).value;
      n=-n;
    }else{
      f=this.value;
    }
    return new_function(function(x){
      for(var i=0; i<n; i++){
        x=f(x);
      }
      return x;
    });
  },
  add: function(g){
    var f=this.value;
    if(function_tab.isPrototypeOf(g)){
      return new_function(function(x){
        return f(x).add(g.value(x));
      });
    }else{
      return new_function(function(x){
        return f(x).add(g);
      });
    }
  },
  sub: function(g){
    var f=this.value;
    if(function_tab.isPrototypeOf(g)){
      return new_function(function(x){
        return f(x).sub(g.value(x));
      });
    }else{
      return new_function(function(x){
        return f(x).sub(g);
      });
    }
  },
  mpy: function(g){
    var f=this.value;
    if(function_tab.isPrototypeOf(g)){
      return new_function(function(x){
        return f(g.value(x));
      });
    }else{
      return new_function(function(x){
        return f(x).mpy(g);
      });
    }
  },
  div: function(g){
    var f=this.value;
    if(function_tab.isPrototypeOf(g)){
      return new_function(function(x){
        return f(x).div(g.value(x));
      });
    }else{
      return new_function(function(x){
        return f(x).div(g);
      });
    }
  }
};

function new_function(f){
  var x = Object.create(function_tab);
  x.value=f;
  return x;
}

function apply(f,x){
  return f.value(x);
}

function cabs(x){
  return Math.sqrt(x.re*x.re+x.im*x.im);
}

function carg(x){
  return Math.atan2(x.im,x.re);
}

function abs(x){
  if(float_tab.isPrototypeOf(x)){
    return float(Math.abs(x.value));
  }else if(complex_tab.isPrototypeOf(x)){
    return float(Math.sqrt(x.re*x.re+x.im*x.im));
  }else{
    var s=0;
    var a=x.value;
    for(var i=0; i<a.length; i++){
      s+=a[i].value*a[i].value;
    }
    return float(Math.sqrt(s));
  }
}

function sgn(x){
  if(float_tab.isPrototypeOf(x)){
    if(x.value<0){
      return float(-1);
    }else if(x.value==0){
      return float(0);
    }else{
      return float(1);
    }
  }
}

function sin(x){
  if(float_tab.isPrototypeOf(x)){
    return float(Math.sin(x.value));
  }else{
    var i = complex(0,1);
    return exp(x.mpy(i)).sub(exp(x.mpy(i).neg())).mpy(complex(0,-0.5));
  }
}

function cos(x){
  if(float_tab.isPrototypeOf(x)){
    return float(Math.cos(x.value));
  }else{
    var i = complex(0,1);
    return exp(x.mpy(i)).add(exp(x.mpy(i).neg())).mpy(float(0.5));
  }
}

function tan(x){
  return float(Math.tan(x.value));
}

function cot(x){
  return float(1/Math.tan(x.value));
}

function tanh(x){
  x=x.value;
  return float(1-2/(Math.exp(2*x)+1));
}

function sinh(x){
  x=x.value;
  return float(0.5*(Math.exp(x)-Math.exp(-x)));
}

function cosh(x){
  x=x.value;
  return float(0.5*(Math.exp(x)+Math.exp(-x)));
}

function exp(x){
  if(float_tab.isPrototypeOf(x)){
    return float(Math.exp(x.value));
  }else if(complex_tab.isPrototypeOf(x)){
    var p = Math.exp(x.re);
    return complex(p*Math.cos(x.im), p*Math.sin(x.im));
  }else{
    var m2,m3,m4;
    m2=x.pow(float(2)).div(float(2));
    m3=x.pow(float(3)).div(float(6));
    m4=x.pow(float(4)).div(float(24));
    return float(1).add(x).add(m2).add(m3).add(m4);
  }
}

function ln(x){
  if(float_tab.isPrototypeOf(x)){
    return float(Math.log(x.value));
  }else{
    var r = cabs(x);
    var phi = carg(x);
    return complex(Math.log(r),phi);
  }
}

function lg(x){
  return float(Math.log(x.value)/Math.log(10));
}

function real(x){
  if(float_tab.isPrototypeOf(x)){
    return x;
  }else{
    return float(x.re);
  }
}

function imag(x){
  if(float_tab.isPrototypeOf(x)){
    return float(0);
  }else{
    return float(x.im);
  }
}

function sqrt(x){
  if(x.value<0){
    return complex(0,Math.sqrt(-x.value));
  }else{
    return float(Math.sqrt(x.value));
  }
}

function diff(f,x){
  var h=0.001;
  var fv = f.value;
  var hv = float(h);
  return fv(x.add(hv)).sub(fv(x.sub(hv))).div(float(2*h));
}

function Diff(f){
  return new_function(function(t){
    return diff(f,t);
  });
}

function vdiff(f,v,x){
  var h=float(0.001);
  f=f.value;
  return f(x.add(v.mpy(h))).sub(f(x)).div(h);
}

function grad(f,x,y){
  var fx = new_function(function(t){return f.value(t,y);});
  var fy = new_function(function(t){return f.value(x,t);});
  return list([diff(fx,x),diff(fy,y)]);
}

function invab(f,x,a,b){
  var m,s,a1=a,b1=b;
  s=f(float(b)).value-f(float(a)).value>0?1:-1;
  for(var k=0; k<40; k++){
    m=(a+b)/2;
    if(s*(f(float(m)).value-x)<0) a=m;
    else b=m;
  }
  if(Math.abs(m-a1)<1E-8) return NaN;
  if(Math.abs(m-b1)<1E-8) return NaN;
  return m;
}

function finv(f){
  return new_function(function(x){
    return float(invab(f.value,x.value,-100,100));
  });
}

function inv(f,x,a,b){
  return float(invab(f.value,x.value,a.value,b.value));
}

function unit(a){
  return float(1);
}

function pow(a,n){
  var y=unit(a);
  while(n>0){
    if(n%2==0){
      n/=2; a=a.mpy(a);
    }else{
      n--; y=y.mpy(a);
    }
  }
  return y;
}

function scalar_prod(a,b){
  var s = float(0);
  for(var i=0; i<a.length; i++){
    s=s.add(a[i].mpy(b[i]));
  }
  return s;
}

function matrix_vec(a,v){
  var m = v.length;
  var n = a.length;
  var i,k;
  var y=[];
  for(i=0; i<n; i++){
    var s=float(0);
    for(k=0; k<m; k++){
      s=s.add(a[i].value[k].mpy(v[k]));
    }
    y.push(s);
  }
  return list(y); 
}

function matrix_mpy(a,b){
  if(!list_tab.isPrototypeOf(b[0])){
    if(!list_tab.isPrototypeOf(a[0])){
      return scalar_prod(a,b);
    }
    return matrix_vec(a,b);
  }
  var m = b.length;
  var n = a.length;
  var p = b[0].value.length;
  var i,j,k;
  var y=[];
  for(i=0; i<n; i++){
    var v=[];
    for(j=0; j<p; j++){
      var s=float(0);
      for(k=0; k<m; k++){
        s=s.add(a[i].value[k].mpy(b[k].value[j]));
      }
      v.push(s);
    }
    y.push(list(v));
  }
  return list(y);
}

function rotation_matrix(t){
  var c = Math.cos(t.value);
  var s = Math.sin(t.value);
  return list([
    list([float(c),float(-s)]),
    list([float(s),float(c)])
  ]);
}

function sum(f,a,b){
  a=Math.round(a.value);
  b=Math.round(b.value);
  f=f.value;
  var s=f(float(a));
  for(var i=a+1; i<=b; i++){
    s=s.add(f(float(i)));
  }
  return s;
}

function gammapx(x){
  var p=[0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x--;
  var y=p[0];
  for(var i=1; i<9; i++){
    y+=p[i]/(x+i);
  }
  var t=x+7.5;
  return Math.sqrt(2*Math.PI)*Math.pow(t,(x+0.5))*Math.exp(-t)*y;
}

function gamma(x){
  if(x<0.5){
    return Math.PI/Math.sin(x*Math.PI)/gammapx(1-x);
  }else{
    return gammapx(x);
  }
}

function Gamma(x){
  return float(gamma(x.value));
}

function fac(x){
  return float(gamma(x.value+1));
}

function rand(a,b){
  return Math.random()*(b-a)+a;
}

function Rand(){
  if(arguments.length==1){
    var a=arguments[0].value;
    var k = Math.floor(Math.random()*a.length);
    return a[k];
  }else if(arguments.length==2){
    var a=arguments[0].value;
    var b=arguments[1].value;
    return float(rand(a,b));
  }
}

function vec(x){
  return list([float(x.re),float(x.im)]);
}
