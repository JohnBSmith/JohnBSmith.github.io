
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

hash: function hash(t){
  if(cas.is_app(t)){
    return ["[",hash(t[0]),",",t[1].map(hash).join(","),"]"].join("");
  }else{
    return String(t);
  }
},

prod_rest: function(a){
  if(a.length==1){
    return 1;
  }else if(a.length==2){
    return a[1];
  }else{
    return ["*",a.slice(1)];
  }
},

ipow: function(n){
  n=n%4;
  return n==0? 1: n==1? "i": n==2? -1: ["*",[-1,"i"]];
},

simplify_sum: function(a){
  var tab={};
  var s=0;
  var b=[];
  for(var i=0; i<a.length; i++){
    if(typeof a[i]=="number"){
      s=s+a[i];
    }else{
      var h;
      if(cas.is_prod(a[i]) && typeof a[i][1][0]=="number"){
        var n = a[i][1][0];
        var rest = cas.prod_rest(a[i][1]);
        h = cas.hash(rest);
        if(tab.hasOwnProperty(h)){
          tab[h][0]+=n;
        }else{
          tab[h]=[n,rest];
        }
      }else{
        h = cas.hash(a[i]);
        if(tab.hasOwnProperty(h)){
          tab[h][0]++;
        }else{
          tab[h]=[1,a[i]];
        }
      }
    }
  }
  var c=[];
  var u;
  for(var x in tab){
    u=tab[x];
    if(u[0]!==0){
      c.push(u[0]==1? u[1]: ["*",u]);
    }
  }
  if(s!=0){
    c.push(s);
  }
  return c.length==0? 0: c.length==1? c[0]: ["+",c];
},

simplify_prod: function(a){
  var tab={};
  var p=1;
  for(var i=0; i<a.length; i++){
    if(typeof a[i]=="number"){
      p=p*a[i];
      if(p==0) return 0;
    }else{
      var h;
      if(cas.is_app(a[i]) && a[i][0]==="^" && typeof a[i][1][1]=="number"){
        var x = a[i][1][0];
        var n = a[i][1][1];
        h = cas.hash(x);
        if(tab.hasOwnProperty(h)){
          tab[h][1]+=n;
        }else{
          tab[h] = [x,n];
        }
      }else{
        h = cas.hash(a[i]);
        if(tab.hasOwnProperty(h)){
          tab[h][1]++;
        }else{
          tab[h] = [a[i],1];
        }
      }
    }
  }
  var c=[];
  if(p!=1){
    c.push(p);
  }
  var n;
  for(var x in tab){
    var u=tab[x];
    if(u[0]==="i"){
      c.push(cas.ipow(u[1]));
    }else{
      c.push(u[1]==1? u[0]: ["^",u]);
    }
  }
  return c.length==0? 1: c.length==1? c[0]: ["*",c];
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
    }else if(x==="i"){
      if(y===2) return -1; 
    }else if(typeof x=="number"){
      if(typeof y=="number") return Math.pow(x,y);
    }
    return ["^",[x,y]];
  }else if(t[0]==="*"){
    var a = t[1].map(cas.simplify);
    return cas.simplify_prod(a);
  }else if(t[0]==="+"){
    var a = t[1].map(cas.simplify);
    return cas.simplify_sum(a);
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
  return [t[0],t[1].map(cas.simplify)];
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

simplify_sf: function(n,t){
  for(var i=0; i<n; i++){
    t = cas.simplify(cas.standard_form(t));
  }
  return t;
},

expand_sf: function(t){
  return cas.expand(cas.standard_form(t));
},

expand_simplify: function(n,t){
  return cas.simplify_sf(n,cas.expand(cas.simplify(t)));
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
    }else if(t[0]==="tan"){
      return ["/",[cas.diff(t[1][0],v),["^",[["cos",t[1]],2]]]];
    }else if(t[0]==="cot"){
      return ["neg",[["/",[cas.diff(t[1][0],v),["^",[["sin",t[1]],2]]]]]];
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
    return t===v? 1: 0;
  }
},

diffn: function(t,v,n){
  for(var i=0; i<n; i++){
    t = cas.simplify_sf(1,cas.diff(t,v));
  }
  return t;
},

variables_table: {
},

evaluate: function(t){
  if(cas.is_app(t)){
    if(t[0]==="diff" && typeof t[1][1]=="string"){
      if(t[1].length==3){
        return cas.diffn(
          cas.evaluate(t[1][0]),
          cas.evaluate(t[1][1]), t[1][2]
        );
      }else{
        return cas.simplify(cas.diff(
          cas.evaluate(t[1][0]),
          cas.evaluate(t[1][1])
        ));
      }
    }else if(t[0]==="simp"){
      return cas.simplify_sf(1,cas.evaluate(t[1][0]));
    }else if(t[0]==="expand"){
      return cas.expand_sf(cas.evaluate(t[1][0]));
    }else if(t[0]==="sf"){
      return cas.standard_form(cas.evaluate(t[1][0]));
    }else if(t[0]==="var"){
      return cas.variables_as_list(t[1][0]);
    }else if(t[0]==="taut"){
      return cas.test_tautology(t[1][0]);
    }else if(t[0]==="subs"){
      var t2 = t[1][1][1];
      var vtab={}; vtab[t2[0]]=t2[1];
      return cas.substitute(t[1][0],vtab);
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

substitute: function(t,d){
  if(cas.is_app(t)){
    var a=[];
    if(t[0]==="="){
      a.push(t[1][0]);
      a.push(cas.substitute(t[1][1],d));
    }else{
      for(var i=0; i<t[1].length; i++){
        a.push(cas.substitute(t[1][i],d));
      }
    }
    return [t[0],a];
  }else if(typeof t==="string"){
    if(d.hasOwnProperty(t)){
      return d[t];
    }else{
      return t;
    }
  }else{
    return t;
  }
},

execute: function(t){
  t = cas.substitute(t,cas.variables_table);
  if(cas.is_app(t)){
    if(t[0]==="="){
      cas.variables_table[t[1][0]] = cas.evaluate(t[1][1]);
      return t;
    }
  }
  return cas.evaluate(t);
},

is_negative: function(t){
  return(
    typeof t=="number" && t<0 ||
    cas.is_prod(t) && typeof t[1][0]=="number" && t[1][0]<0
  );
},

remove_minus: function(t){
  if(typeof t=="number") return -t;
  var a = cas.shallow_copy(t[1]);
  a[0] = -a[0];
  if(a[0]==1){
    var b = a.slice(1);
    return b.length==1? b[0]: [t[0],b];
  }else{
    return [t[0],a];
  }
},

output_form: function(t){
  if(cas.is_app(t)){
    var a = t[1].map(cas.output_form);
    if(t[0]==="+"){
      var u;
      if(cas.is_negative(a[0])){
        u = ["neg",[cas.remove_minus(a[0])]];
      }else{
        u = a[0];
      }
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
},

update: function(a,b){
  for(var key in b){
    a[key]=b[key];
  }
},

variables: function(t){
  if(cas.is_app(t)){
    var d={};
    for(var i=0; i<t[1].length; i++){
      cas.update(d,cas.variables(t[1][i]));
    }
    return d;
  }else if(typeof t==="string"){
    var d={};
    d[t]=1;
    return d;
  }
},

variables_as_list: function(t){
  var d = cas.variables(t);
  var a = [];
  for(var key in d){
    a.push(key);
  }
  return ["[]",a];
},

eval_dict: {
  "and": function(a){return a[0]&&a[1];},
  "or" : function(a){return a[0]||a[1];},
  "not": function(a){return !a[0]? 1: 0;},
  "=>" : function(a){return !a[0]||a[1]? 1: 0;},
  "<=>": function(a){return a[0]==a[1]? 1: 0;},
  "+"  : function(a){return a[0]+a[1];},
},

evaluate_strict: function(t,d){
  if(cas.is_app(t)){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(cas.evaluate_strict(t[1][i],d));
    }
    return cas.eval_dict[t[0]](a);
  }else if(typeof t==="string"){
    return d[t];
  }else{
    return t;
  }
},

test_all_valuations: function(a,i,t,d){
  if(i==a.length){
    var y = cas.evaluate_strict(t,d);
    return [y,y];
  }else{
    d[a[i]]=0;
    var A = cas.test_all_valuations(a,i+1,t,d);
    d[a[i]]=1;
    var B = cas.test_all_valuations(a,i+1,t,d);
    return [A[0]&&B[0],A[1]+B[1]];
  }
},

test_tautology: function(t){
  var d = cas.variables(t);
  var a = [];
  for(var key in d){
    a.push(key);
  }
  return cas.test_all_valuations(a,0,t,d);
},

}; return cas;
})();


