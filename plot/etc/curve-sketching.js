
function zero(f,a,b,d){
  var min = 1;
  var x0 = null;
  for(var k=0; k<6; k++){
    for(var x=a; x<=b; x+=d){
      var y = f(x);
      if(Math.abs(y)<min){min=Math.abs(y); x0=x;}
    }
    if(x0===null) return null;
    a = x0-d; b = x0+d;
    d = 0.01*d;
  }
  if(Math.abs(min)<1E-12){
    return x0;
  }else{
    return null;
  }
}

function round_by(x,m){
  return Math.round(m*x)/m;
}

function zeroes(f,a,b,d){
  var N = [];
  for(var x=a; x<b; x+=d){
    var x0 = zero(f,x,x+d,0.01*d);
    if(x0!==null && Math.abs(x+d-x0)>1E-10){
      N.push(x0);
    }
  }
  return N;
}

function minima(f,f1,a,b,d){
  var N = zeroes(f1,a,b,d);
  var M=[];
  for(var i=0; i<N.length; i++){
    if(f(N[i])<f(N[i]-0.01*d) && f(N[i])<f(N[i]+0.01*d)){
      M.push([N[i],f(N[i])]);
    }
  }
  return M;
}

function maxima(f,f1,a,b,d){
  var N = zeroes(f1,a,b,d);
  var M=[];
  for(var i=0; i<N.length; i++){
    if(f(N[i])>f(N[i]-0.01*d) && f(N[i])>f(N[i]+0.01*d)){
      M.push([N[i],f(N[i])]);
    }
  }
  return M;
}

function sketch_fn(t){
  var f = t.f;
  var f1 = function(x){return diff(f,x);};
  var f2 = function(x){return diffn(f,x,2);};
  return {
    "zeroes": zeroes(f,t.a,t.b,0.1),
    "minima": minima(f,f1,t.a,t.b,0.1),
    "maxima": maxima(f,f1,t.a,t.b,0.1)
  };
}

function sketch_plot(){
  var x,y,x0,x2,dx;
  var a,n,s;
  x1=0; y1=0;
  x2=10;
  x1 = getnum("inputx");
  y1 = getnum("inputy");
  wx = getnum("inputwx");
  wy = getnum("inputwy");
  n = 10000;
  getgridtype();
  getgridpos();

  x0 = x1+getx(0,1/wx);
  x2 = x1+getx(dw,1/wx);
  if(x2<x0){
    var tmp=x0;
    x0=x2; x2=tmp;
  }
  dx=Math.abs(wx)/n;

  init();
  system();

  s = gets("inputf");
  var f;
  if(s.length>0){
    f = define("f",s);
    a=gva;
    vcr=cr1; vcg=cg1; vcb=cb1;
    for(x=x0; x<x2; x+=dx){
      gv1=x;
      y=evalv(a);
      spoint(x,y);
    }
    flush();
  }

  context.putImageData(img,0,0);
  axisx(context,x1,0.1*wx);
  axisy(context,y1,0.1*wy);
  return {"f": f, "a": x0, "b": x2};
}

function number_to_string(x){
  return round_by(x,1E12).toString();
}

function value_to_string(x){
  if(Math.abs(x)<1E-20){
    return "0";
  }else if(Math.abs(x)<0.01){
    return x.toString();
  }else{
    return round_by(x,1E12).toString();
  }
}

function set_to_string(n,a){
  if(a.length<n){
    return "{" + a.join("; ") + "}";
  }else{
    return "{<br>&emsp;&emsp;" + a.join(";<br>&emsp;&emsp;") + "<br>}";
  }
}

function pair_to_string(t){
  return ["(",
    number_to_string(t[0]), " | ", 
    value_to_string(t[1]), ")"
  ].join("");
}

function sketch(){
  var f = sketch_plot();
  var s = sketch_fn(f);
  var ans = document.getElementById("ans");
  ans.innerHTML = [
    "Nullstellen: ", set_to_string(5,s.zeroes.map(number_to_string)), "<br><br>",
    "Minima: ", set_to_string(2,s.minima.map(pair_to_string)), "<br><br>",
    "Maxima: ", set_to_string(2,s.maxima.map(pair_to_string))
  ].join("");
}
