
"use strict";

var cas = (function(){
var cas = {
shallow_copy: function(a){
  var b=[];
  for(var i=0; i<a.length; i++){
    b.push(a[i]);
  }
  return b;
},

simplify_array: function(a){
  var b=[];
  for(var i=0; i<a.length; i++){
    b.push(cas.simplify(a[i]));
  }
  return b;
},

is_app: function(t){
  return Array.isArray(t);
},

is_number: function(t){
  return typeof t==="number";
},

is_const: function(t,v){
  if(cas.is_app(t)){
    return undefined;
  }else{
    if(t===v){
      return false;
    }else{
      return true;
    }
  }
},

simplify: function(t){
  if(!cas.is_app(t)) return t;
  var x,y;
  if(t[0]==="-"){
    x = cas.simplify(t[1][0]);
    y = cas.simplify(t[1][1]);
    if(cas.is_number(x)){
      if(cas.is_number(y)){
        return x-y;
      }else if(x===0){
        return ["neg",[y]];
      }else{
        return ["-",[x,y]];
      }
    }else if(y===0){
      return x;
    }else{
      return ["-",[x,y]];
    }
  }else if(t[0]==="^"){
    x = cas.simplify(t[1][0]);
    y = cas.simplify(t[1][1]);
    if(y===1){
      return x;
    }else if(y===0){
      return 1;
    }else{
      return ["^",[x,y]];
    }
  }else if(t[0]==="*"){
    var a = cas.simplify_array(t[1]);
    var b=[];
    var p=1;
    for(var i=0; i<a.length; i++){
      if(cas.is_number(a[i])){
        if(a[i]==0) return 0;
        p=p*a[i];
      }else{
        b.push(a[i]);
      }
    }
    if(p!=1) b.unshift(p);
    if(b.length==0){
      return 1;
    }else if(b.length==1){
      return b[0];
    }else{
      return ["*",b];
    }
  }else if(t[0]==="+"){
    var a = cas.simplify_array(t[1]);
    var b=[];
    var s=0;
    for(var i=0; i<a.length; i++){
      if(cas.is_number(a[i])){
        s=s+a[i];
      }else{
        b.push(a[i]);
      }
    }
    if(s!=0) b.push(s);
    if(b.length==0){
      return 0;
    }else if(b.length==1){
      return b[0];
    }else{
      return ["+",b];
    }
  }else if(t[0]==="neg"){
    x = cas.simplify(t[1][0]);
    if(typeof x=="number"){
      return -x;
    }else{
      return ["neg",[x]];
    }
  }else if(t[0]==="/"){
    x = cas.simplify(t[1][0]);
    y = cas.simplify(t[1][1]);
    if(y===1){
      return x;
    }else{
      return ["/",[x,y]];
    }
  }else if(t[0]==="ln"){
    x = cas.simplify(t[1][0]);
    if(x==="e"){
      return 1;
    }else if(x===1){
      return 0;
    }else{
      return ["ln",[x]];
    }
  }
  return [t[0],cas.simplify_array(t[1])];
},

is_sum: function(t){
  return cas.is_app(t) && t[0]==="+";
},

is_prod: function(t){
  return cas.is_app(t) && t[0]==="*";
},

cmp_sum: function(x,y){
  if(typeof x=="number"){
    return typeof y=="number"? 0: 1;
  }else if(typeof y=="number"){
    return typeof x=="number"? 0: -1;
  }
},

cmp_prod: function(x,y){
  var Tx = typeof x;
  var Ty = typeof y;
  if(Tx=="number"){
    return Ty=="number"? 0: -1;
  }else if(Ty=="number"){
    return Tx=="number"? 0: 1;
  }else if(Tx=="string"){
    if(Ty=="string"){
      return x<y? -1: x>y? 1: 0;
    }else{
      return 0;
    }
  }
},

standard_form: function(t){
  if(cas.is_app(t)){
    if(t[0]==="+"){
      var a=[];
      var x;
      for(var i=0; i<t[1].length; i++){
        x = cas.standard_form(t[1][i]);
        if(cas.is_sum(x)){
          a.push.apply(a,x[1]);
        }else{
          a.push(x);
        }
      }
      a.sort(cas.cmp_sum)
      return ["+",a];
    }else if(t[0]==="*"){
      var a=[];
      var x;
      for(var i=0; i<t[1].length; i++){
        x = cas.standard_form(t[1][i]);
        if(cas.is_prod(x)){
          a.push.apply(a,x[1]);
        }else{
          a.push(x);
        }
      }
      a.sort(cas.cmp_prod);
      return ["*",a];
    }else if(t[0]==="-"){
      var x = cas.standard_form(t[1][0]);
      var y = cas.standard_form(t[1][1]);
      if(cas.is_sum(x)){
        return ["+",x[1].concat([["*",[-1,y]]])];
      }else{
        return ["+",[x,["*",[-1,y]]]];
      }
    }else if(t[0]==="neg"){
      var x = cas.standard_form(t[1][0]);
      return ["*",[-1,x]];
    }else{
      var a=[];
      for(var i=0; i<t[1].length; i++){
        a.push(cas.standard_form(t[1][i]));
      }
      return [t[0],a];
    }
  }
  return t;
},

expand_binary_prod: function(x,y){
  if(cas.is_sum(x)){
    var a=[];
    for(var i=0; i<x[1].length; i++){
      a.push(cas.expand(["*",[x[1][i],y]]));
    }
    return ["+",a];
  }else if(cas.is_sum(y)){
    var a=[];
    for(var i=0; i<y[1].length; i++){
      a.push(cas.expand(["*",[x,y[1][i]]]));
    }
    return ["+",a];
  }else{
    return ["*",[x,y]];
  }
},

expand: function(t){
  if(cas.is_app(t)){
    if(t[0]==="*"){
      var u=cas.expand(t[1][0]);
      for(var i=1; i<t[1].length; i++){
        u = cas.expand_binary_prod(u,cas.expand(t[1][i]));
      }
      return u;
    }else if(t[0]==="^"){
      if(typeof t[1][1]=="number" && t[1][1]>1 && t[1][1]==Math.floor(t[1][1])){
        var p=cas.expand(t[1][0]);
        var u=p;
        for(var i=1; i<t[1][1]; i++){
          u = cas.expand_binary_prod(p,u);
        }
        return u;
      }
    }
    return [t[0],t[1].map(cas.expand)];
  }else{
    return t;
  }
},

expand_sf: function(t){
  return cas.standard_form(cas.expand(cas.standard_form(t)));
},

expand_simplify: function(t){
  return cas.simplify(cas.expand(cas.simplify(t)));
},

diff: function(t,v){
  if(cas.is_app(t)){
    if(t[0]==="^"){
      var x = t[1][0];
      var n = t[1][1];
      if(x===v){
        if(cas.is_const(n,v)){
          return ["*",[n,["^",[x,["-",[n,1]]]]]];
        }
      }else if(cas.is_const(n,v)){
        return ["*",[["*",[n,["^",[x,["-",[n,1]]]]]],cas.diff(x,v)]];
      }else if(cas.is_const(x,v)){
        return ["*",[["*",[t,["ln",[x]]]],cas.diff(n,v)]];
      }
    }else if(t[0]==="+"){
      var a=[];
      for(var i=0; i<t[1].length; i++){
        a.push(cas.diff(t[1][i],v));
      }
      return ["+",a];
    }else if(t[0]==="-"){
      return ["-",[cas.diff(t[1][0],v),cas.diff(t[1][1],v)]];
    }else if(t[0]==="*"){
      var a=[];
      for(var i=0; i<t[1].length; i++){
        var b = cas.shallow_copy(t[1]);
        b[i]=cas.diff(b[i],v);
        a.push(["*",b]);
      }
      return ["+",a];
    }else if(t[0]==="/"){
      var f = t[1][0];
      var g = t[1][1];
      return ["/",[["-",[
        ["*",[cas.diff(f,v),g]], ["*",[f,cas.diff(g,v)]]
      ]],["^",[g,2]]]];
    }else if(t[0]==="neg"){
      return ["neg",[cas.diff(t[1][0],v)]];
    }else if(t[0]==="exp"){
      return ["*",[t,cas.diff(t[1][0],v)]];
    }else if(t[0]==="sin"){
      return ["*",[["cos",t[1]],cas.diff(t[1][0],v)]];
    }else if(t[0]==="cos"){
      return ["neg",[["*",[["sin",t[1]],cas.diff(t[1][0],v)]]]];
    }else if(t[0]==="sqrt"){
      return ["*",[["/",[1,["*",[2,t]]]],cas.diff(t[1][0],v)]];
    }
    if(t[1].length==1 && cas.is_app(t[1][0])){
      return ["*",[
      [["lambda",[["list",["t"]],cas.diff([t[0],["t"]],"t")]],[t[1][0]]],
      cas.diff(t[1][0],"x")]];
    }
    return ["diff",[t,v]];
  }else{
    if(t===v){
      return 1;
    }else{
      return 0;
    }
  }
},

evaluate: function(t){
  if(cas.is_app(t)){
    if(t[0]==="diff" && typeof t[1][1]=="string"){
      return cas.simplify(cas.diff(
        cas.evaluate(t[1][0]),
        cas.evaluate(t[1][1])
      ));
    }else if(t[0]==="simp"){
      return cas.simplify(cas.evaluate(t[1][0]));
    }else if(t[0]==="expand"){
      return cas.expand_sf(cas.evaluate(t[1][0]));
    }else if(t[0]==="sf"){
      return cas.standard_form(cas.evaluate(t[1][0]));
    }else{
      var a=[];
      for(var i=0; i<t[1].length; i++){
        a.push(cas.evaluate(t[1][i]));
      }
      return [t[0],a];
    }
  }else{
    return t;
  }
},

is_negative: function(t){
  return cas.is_prod(t) && typeof t[1][0]=="number" && t[1][0]<0;
},

remove_minus: function(t){
  var a = cas.shallow_copy(t[1]);
  a[0] = -a[0];
  if(a[0]==1){
    return [t[0],a.slice(1)];
  }else{
    return [t[0],a];
  }
},

output_form: function(t){
  if(cas.is_app(t)){
    var a = t[1].map(cas.output_form);
    if(t[0]==="+"){
      var u=a[0];
      for(var i=1; i<a.length; i++){
        if(cas.is_negative(a[i])){
          u = ["-",[u,cas.remove_minus(a[i])]];
        }else{
          u = ["+",[u,a[i]]];
        }
      }
      return u;
    }
    return [t[0],a];
  }
  return t;
}

}; return cas;
})();

