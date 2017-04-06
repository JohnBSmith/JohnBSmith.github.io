
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
    b.push(this.simplify(a[i]));
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
  if(this.is_app(t)){
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
  if(!this.is_app(t)) return t;
  var x,y;
  if(t[0]==="-"){
    x = this.simplify(t[1][0]);
    y = this.simplify(t[1][1]);
    if(this.is_number(x)){
      if(this.is_number(y)){
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
    x = this.simplify(t[1][0]);
    y = this.simplify(t[1][1]);
    if(y===1){
      return x;
    }else{
      return ["^",[x,y]];
    }
  }else if(t[0]==="*"){
    var a = this.simplify_array(t[1]);
    var b=[];
    var p=1;
    for(var i=0; i<a.length; i++){
      if(this.is_number(a[i])){
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
    var a = this.simplify_array(t[1]);
    var b=[];
    var s=0;
    for(var i=0; i<a.length; i++){
      if(this.is_number(a[i])){
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
    x = this.simplify(t[1][0]);
    if(typeof x=="number"){
      return -x;
    }else{
      return ["neg",[x]];
    }
  }else if(t[0]==="/"){
    x = this.simplify(t[1][0]);
    y = this.simplify(t[1][1]);
    if(y===1){
      return x;
    }else{
      return ["/",[x,y]];
    }
  }else if(t[0]==="ln"){
    x = this.simplify(t[1][0]);
    if(x==="e"){
      return 1;
    }else if(x===1){
      return 0;
    }else{
      return ["ln",[x]];
    }
  }
  return [t[0],this.simplify_array(t[1])];
},

diff: function(t,v){
  if(this.is_app(t)){
    if(t[0]==="^"){
      var x = t[1][0];
      var n = t[1][1];
      if(x===v){
        if(this.is_const(n,v)){
          return ["*",[n,["^",[x,["-",[n,1]]]]]];
        }
      }else if(this.is_const(n,v)){
        return ["*",[["*",[n,["^",[x,["-",[n,1]]]]]],this.diff(x,v)]];
      }else if(this.is_const(x,v)){
        return ["*",[["*",[t,["ln",[x]]]],this.diff(n,v)]];
      }
    }else if(t[0]==="+"){
      var a=[];
      for(var i=0; i<t[1].length; i++){
        a.push(this.diff(t[1][i],v));
      }
      return ["+",a];
    }else if(t[0]==="-"){
      return ["-",[this.diff(t[1][0],v),this.diff(t[1][1],v)]];
    }else if(t[0]==="*"){
      var a=[];
      for(var i=0; i<t[1].length; i++){
        var b = this.shallow_copy(t[1]);
        b[i]=this.diff(b[i],v);
        a.push(["*",b]);
      }
      return ["+",a];
    }else if(t[0]==="/"){
      var f = t[1][0];
      var g = t[1][1];
      return ["/",[["-",[
        ["*",[this.diff(f,v),g]], ["*",[f,this.diff(g,v)]]
      ]],["^",[g,2]]]];
    }else if(t[0]==="neg"){
      return ["neg",[this.diff(t[1][0],v)]];
    }else if(t[0]==="sin"){
      return ["*",[["cos",t[1]],this.diff(t[1][0],v)]];
    }else if(t[0]==="cos"){
      return ["neg",[["*",[["sin",t[1]],this.diff(t[1][0],v)]]]];
    }else if(t[0]==="sqrt"){
      return ["*",[["/",[1,["*",[2,t]]]],this.diff(t[1][0],v)]];
    }
    if(t[1].length==1 && this.is_app(t[1][0])){
      return ["*",[
      [["lambda",[["list",["t"]],this.diff([t[0],["t"]],"t")]],[t[1][0]]],
      this.diff(t[1][0],"x")]];
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
  if(this.is_app(t)){
    if(t[0]==="diff" && typeof t[1][1]=="string"){
      return this.simplify(this.diff(
        this.evaluate(t[1][0]),
        this.evaluate(t[1][1])
      ));
    }else if(t[0]==="simp"){
      return this.simplify(t[1][0]);
    }else{
      var a=[];
      for(var i=0; i<t[1].length; i++){
        a.push(this.evaluate(t[1][i]));
      }
      return [t[0],a];
    }
  }else{
    return t;
  }
}

} // end of cas
