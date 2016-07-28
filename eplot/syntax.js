
"use strict";

var VALUE=0, ADD=1, SUB=2, MPY=3, DIV=4, MOD=5,
  NEG=10, POW=11, FAPP=12, APP=14, DEF=16;

var vtab = {
  "i": {"type": VALUE, "value": complex(0,1)},
  "e": {"type": VALUE, "value": float(Math.E)},
  "pi": {"type": VALUE, "value": float(Math.PI)},
  "deg": {"type": VALUE, "value": float(Math.PI/180)},
  "e1": {"type": VALUE, "value": list([float(1),float(0)])},
  "e2": {"type": VALUE, "value": list([float(0),float(1)])}
};

function isalpha(s){
  return /^[a-z]+$/i.test(s);
}

function isdigit(s){
  return /^[0-9]+$/.test(s);
}

function isspace(c){
  return c==' ' || c=='\t' || c=='\n';
}

function token_list_tos(a){
  return "["+a.map(function(x){
    return x.type+","+x.value;
  }).join("][")+"]";
}

function scan_error(index,s){
  return {"type": "syntax", "index": index, "value": s};
}

var precedence_table = {
  "^": 60,
  "u-": 50,
  "*": 40, "/": 40,
  "+": 30, "-": 30
};

var associative_table = {
  "+":1, "*":1
};

function precedence(op){
  return precedence_table[op];
}

function is_associative(op){
  return associative_table.hasOwnProperty(op);
}


function scan(s){
  var c,i,j,type;
  var n=s.length;
  var a=[];
  i=0;
  while(i<n){
    c=s[i];
    if(c=='+' || c=='-' || c=='*' || c=='/' || c=='%' || c=='^' ||
      c=='|' || c=='&'
    ){
      a.push({"type": "op", "value": c, "index": i});
      i++;
    }else if(c=='(' || c=='[' || c=='{'){
      if(a.length>0){
        type = a[a.length-1].type;
        if(type=="id"){
          a[a.length-1].type="app";
        }else if(type=="int" || type=="float"){
          a.push({"type": "op", "value": "*", "index": i});
        }else if(type=="bright"){
          a.push({"type": "op", "value": "app", "index": i});
        }
      }
      a.push({"type": "bleft", "value": c, "index": i});
      i++;
    }else if(c==')' || c==']' || c=='}'){
      a.push({"type": "bright", "value": c, "index": i});
      i++;
    }else if(c==',' || c==';' || c==':'){
      if(c==':' && i+1<n && s[i+1]=='='){
        a.push({"type": "op", "value": ":=", "index": i});
        i+=2;
      }else{
        a.push({"type": "sep", "value": c, "index": i});
        i++;
      }
    }else if(isspace(c)){
      i++;
    }else if(isdigit(c)){
      j=i;
      type="int";
      while(i<n){
        if(s[i]=='.' || s[i]=='E'){
          type="float";
        }else if(!isdigit(s[i])){
          break;
        }
        i++;
      }
      a.push({"type": type, "value": parseFloat(s.slice(j,i)), "index": j});
    }else if(isalpha(c)){
      j=i;
      while(i<n && (isalpha(s[i]) || isdigit(s[i]))) i++;
      if(a.length>0 && a[a.length-1].type=="int"){
        a.push({"type": "op", "value": "*", "index": j});
      }
      a.push({"type": "id", "value": s.slice(j,i), "index": j});
    }else{
      throw scan_error(i,"Syntax error: unexpected character: '"+c+"'.");
    }
  }
  return a;
}

function syntax_tree_tos(t){
  var i;
  var a=[];
  if(t.a){
    for(i=0; i<t.a.length; i++){
      a.push(syntax_tree_tos(t.a[i]));
    }
  }
  var s = "<div class='tree'>"+t.type+": "+t.value;
  if(a.length>0){
    s+=a.join("")+"</div>";
  }else{
    s+="</div>";
  }
  return s;
}

function syntax_error(v,s){
  if(v.index>=v.a.length){
    return {"type": "syntax", "value": s, "index": -1};
  }else{
    return {"type": "syntax", "value": s, "index": v.a[v.index].index};
  }
}

function error(s){
  return {"type": "error", "value": s};
}

function repeat(s,n){
  return Array(n+1).join(s);
}

function error_tos(e,s){
  var s2;
  if(e.index<0){
    s2=s+"<br>"+repeat(" ",s.length)+"^"+"<br>"+e.value;
  }else{
    s2=s+"<br>"+repeat(" ",e.index)+"^"+"<br>"+e.value;
  }
  return s2;
}

function lambda(v){
  var argv=[];
  var x;
  while(1){
    if(v.index>=v.a.length){
      throw syntax_error(v,"Expected complete lambda function.");
    }
    x = v.a[v.index];
    if(x.type=="id"){
      argv.push(x.value);
    }else if(x.type=="op" && x.value=="|"){
      break;
    }
    v.index++;
  }
  v.index++;
  if(v.index>=v.a.length){
    throw syntax_error(v,"Expected complete lambda function.");
  }
  var t = pm_expression(v);
  if(v.index>=v.a.length || v.a[v.index].value!="}"){
    throw syntax_error(v,"Expected '}'.");
  }
  v.index++;
  return {"type": "fn", "value": argv, "a": [t]};
}

function syntax_list(v){
  var a=[];
  if(v.index<v.a.length && v.a[v.index].value=="]"){
    v.index++;
    return {"type": "app", "value": "List", "a": a};
  }
  a.push(pm_expression(v));
  while(1){
    if(v.index>=v.a.length){
      throw syntax_error(v,"Syntax error: bracket mismatch.");
    }
    var x = v.a[v.index];
    if(x.type=="bright" && x.value=="]"){
      v.index++;
      return {"type": "app", "value": "List", "a": a};
    }else if(x.type=="sep" && x.value==","){
      v.index++;
      a.push(pm_expression(v));
    }else{
      throw syntax_error(v,"Syntax error: unexpected token '"+x.value+"'.");
    }
  }
}

function function_app(v,id){
  var a=[];
  if(v.index<v.a.length && v.a[v.index].value==")"){
    v.index++;
    return {"type": "app", "value": id, "a": a};
  }
  a.push(pm_expression(v));
  while(1){
    if(v.index>=v.a.length){
      throw syntax_error(v,"Syntax error: bracket mismatch.");
    }
    var x = v.a[v.index];
    if(x.type=="bright" && x.value==")"){
      v.index++;
      return {"type": "app", "value": id, "a": a};
    }else if(x.type=="sep" && x.value==","){
      v.index++;
      a.push(pm_expression(v));
    }else{
      throw syntax_error(v,"Syntax error: unexpected token '"+x.value+"'.");
    }
  }
}

function atom(v){
  if(v.index>=v.a.length){
    throw syntax_error(v,"Syntax error: expected operand.");
  }
  var x = v.a[v.index];
  var t,y,op;
  if(x.type=="bleft" && x.value=="("){
    var index=v.index;
    v.index++;
    t = pm_expression(v);
    if(v.index>=v.a.length || v.a[v.index].value!=")"){
      v.index=index;
      throw syntax_error(v,"Syntax error: bracket mismatch.");
    }
    v.index++;
    return t;
  }else if(x.type=="bleft" && x.value=="["){
    v.index++;
    return syntax_list(v);
  }else if(x.type=="bleft" && x.value=="{"){
    v.index++;
    return lambda(v);
  }else if(x.type=="app"){
    v.index+=2;
    t=function_app(v,x.value);
    return t;
  }
  if(x.type!="id" && x.type!="int" && x.type!="float"){
    throw syntax_error(v,"Syntax error: expected operand.");
  }
  v.index++;
  return x;
}

function app_op(v){
  var t=atom(v);
  var x,y,op;
  while(v.index<v.a.length){
    x=v.a[v.index];
    if(x.type=="bright" || x.type=="sep"){
      return t;
    }
    if(x.type!="op"){
      throw syntax_error(v,"Syntax error: expected operator.");
    }
    op = v.a[v.index].value;
    if(op=="app"){
      v.index++;
      y = atom(v);
      t = {"type": "op", "value": "app", "a": [t,y]};
    }else{
      break;
    }
  }
  return t;
}

function power(v){
  var t=app_op(v);
  var x,y;
  if(v.index<v.a.length){
    x=v.a[v.index];
    if(x.type=="bright" || x.type=="sep"){
      return t;
    }
    if(x.type!="op"){
      throw syntax_error(v,"Syntax error: expected operator.");
    }
    var op = v.a[v.index].value;
    if(op=="^"){
      v.index++;
      y = factor(v);
      t = {"type": "op", "value": op, "a": [t,y]};
    }
  }
  return t;
}

function factor(v){
  if(v.index>=v.a.length){
    throw syntax_error(v,"Syntax error: expected expression.");
  }
  var x;
  if(v.a[v.index].type=="op"){
    var op = v.a[v.index].value;
    if(op=="+" || op=="-"){
      v.index++;
      x = factor(v);
      if(op=="-"){
        x = {"type": "op", "value": "u"+op, "a": [x]};
      }
    }else{
      throw syntax_error(v,"Syntax error: unexpected prefix operator '"+op+"'.");
    }
  }else{
    x = power(v);
  }
  return x;
}

function term(v){
  var t = factor(v);
  var x,y;
  while(v.index<v.a.length){
    x=v.a[v.index];
    if(x.type=="bright" || x.type=="sep"){
      return t;
    }
    if(x.type!="op"){
      throw syntax_error(v,"Syntax error: expected operator.");
    }
    var op = v.a[v.index].value;
    if(op=="*" || op=="/" || op=="%"){
      v.index++;
      y = factor(v);
      t = {"type": "op", "value": op, "a": [t,y]};
    }else{
      break;
    }
  }
  return t;
}

function pm_expression(v){
  var t = term(v);
  var x;
  while(v.index<v.a.length){
    x = v.a[v.index];
    if(x.type=="bright" || x.type=="sep"){
      return t;
    }
    if(x.type!="op"){
      throw syntax_error(v,"Syntax error: expected operator.");
    }
    var op = x.value;
    if(op!="+" && op!="-"){
      return t;
    }
    v.index++;
    var y = term(v);
    t = {"type": "op", "value": op, "a": [t,y]};
  }
  return t;
}

function definition(v){
  var t=pm_expression(v);
  var x,y;
  if(v.index<v.a.length){
    x=v.a[v.index];
    if(x.type=="bright" || x.type=="sep"){
      return t;
    }
    if(x.type!="op"){
      throw syntax_error(v,"Syntax error: expected operator.");
    }
    var op = v.a[v.index].value;
    if(op==":="){
      v.index++;
      y = pm_expression(v);
      t = {"type": "op", "value": op, "a": [t,y]};
    }
  }
  return t;
}

function syntax_tree(a){
  var v = {"index": 0, "a": a}
  var t = definition(v);
  if(v.index<v.a.length){
    var ay=[t];
    while(v.index<v.a.length){
      var x = v.a[v.index];
      if(x.type=="sep" && x.value==","){
        v.index++;
        ay.push(definition(v));
      }else{
        throw syntax_error(v,"Syntax error: bracket mismatch.");
      }
    }
    t = {"type": "app", "value": "block", "a": ay};
  }
  return t;
}

function code_tos(a){
  var i,b,type;
  b=[];
  for(i=0; i<a.length; i++){
    type=a[i].type;
    if(type==VALUE){
      b.push("VALUE");
    }else if(type==ADD){
      b.push("ADD");
    }else if(type==SUB){
      b.push("SUB");
    }else if(type==MPY){
      b.push("MPY");
    }else if(type==DIV){
      b.push("DIV");
    }else if(type==MOD){
      b.push("MOD");
    }else if(type==NEG){
      b.push("NEG");
    }else if(type==POW){
      b.push("POW");
    }else if(type==APP){
      b.push("APP");
    }else if(type==FAPP){
      b.push("FAPP");
    }else if(type==DEF){
      b.push("DEF");
    }else{
      throw "Error in code_tos: unkown type '"+type+"'.";
    }
  }
  return "["+b.join(", ")+"]";
}

function compile_lambda(t,du){
  var a=[];
  var d={};
  var x;
  for(x in du){
    d[x]=du[x];
  }
  for(var i=0; i<t.value.length; i++){
    x = {"type": VALUE, "value": float(0)};
    d[t.value[i]]=x;
    a.push(x);
  }
  var v = compile(t.a[0],d);
  if(a.length==1){
    return function(x){
      a[0].value=x;
      return evalv(v);
    };
  }
  return function(){
    if(arguments.length!=a.length){
      throw "Error: wrong number of arguments.";
    }
    for(var i=0; i<a.length; i++){
      a[i].value=arguments[i];
    }
    return evalv(v);
  };
}

// d is the dictionary of local variables
function compile(t,d){
  var x,y,c;
  if(t.type=="int" || t.type=="float"){
    return [{"type": VALUE, "value": float(t.value)}];
  }else if(t.type=="id"){
    if(d.hasOwnProperty(t.value)){
      return [d[t.value]];
    }else if(vtab.hasOwnProperty(t.value)){
      return [vtab[t.value]];
    }else if(ftab.hasOwnProperty(t.value)){
      return [{"type": VALUE, "value": new_function(ftab[t.value])}];
    }else{
      throw error("Error: unknown identifier: "+t.value+".");
    }
  }else if(t.type=="op"){
    var op=t.value;
    if(op=="+" || op=="-" || op=="*" || op=="/" || op=="%" ||
      op=="^" || op=="app"
    ){
      x=compile(t.a[0],d);
      y=compile(t.a[1],d);
      if(op=="+") c=ADD;
      else if(op=="-") c=SUB;
      else if(op=="*") c=MPY;
      else if(op=="/") c=DIV;
      else if(op=="%") c=MOD;
      else if(op=="^") c=POW;
      else if(op=="app") c=APP;
      return x.concat(y).concat([{"type": c}]);
    }else if(op==":="){
      var id=t.a[0].value;
      x = compile(t.a[1],d);
      if(!vtab.hasOwnProperty(id)){
        vtab[id]={"type": VALUE, "value": undefined};
      }
      return x.concat([{"type": DEF, "value": id}]);
    }else if(op=="u-"){
      x=compile(t.a[0],d);
      return x.concat([{"type": NEG}]);
    }else{
      throw "Error in compile: cannot compile operator '"+t.value+"'";
    }
  }else if(t.type=="app"){
    var a=[];
    for(var i=0; i<t.a.length; i++){
      a=a.concat(compile(t.a[i],d));
    }
    if(t.value=="block"){
      return a;
    }
    var f;
    if(vtab.hasOwnProperty(t.value)){
      f = vtab[t.value];
    }else if(ftab.hasOwnProperty(t.value)){
      f = {"type": VALUE, "value": new_function(ftab[t.value])};
    }else{
      throw error("Error: unknown function: "+t.value+".");
    }
    return a.concat([{"type": FAPP, "argc": t.a.length, "value": f}]);
  }else if(t.type=="fn"){
    return [{"type": VALUE, "value": new_function(compile_lambda(t,d))}];
  }else{
    throw "Error in compile: cannot compile type '"+t.type+"'.";
  }
}

function evalv(a){
  var stack=[];
  var i,type;
  var n=a.length;
  var x,y;
  for(i=0; i<n; i++){
    type=a[i].type;
    if(type==VALUE){
      stack.push(a[i].value);
    }else if(type==ADD){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.add(y));
    }else if(type==SUB){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.sub(y));
    }else if(type==MPY){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.mpy(y));
    }else if(type==DIV){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.div(y));
    }else if(type==MOD){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.mod(y));
    }else if(type==NEG){
      x=stack.pop();
      stack.push(x.neg());
    }else if(type==POW){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.pow(y));
    }else if(type==FAPP){
      var argc = a[i].argc;
      var f = a[i].value.value;
      if(argc==1){
        x=stack.pop();
        stack.push(f.value(x));
      }else{
        var v=[];
        for(var j=0; j<argc; j++){
          v[argc-1-j]=stack.pop();
        }
        stack.push(f.value.apply(null,v));
      }
    }else if(type==APP){
      y=stack.pop();
      x=stack.pop();
      stack.push(x.value(y));
    }else if(type==DEF){
      x=stack.pop();
      vtab[a[i].value].value=x;
    }else{
      throw "Error in evalv: unknown byte code '"+type+"'.";
    }
  }
  if(stack.length>1){
    return list(stack);
  }else if(stack.length>0){
    return stack.pop();
  }
}

function compile_string(s,idx,idy){
  var a = scan(s);
  var t = syntax_tree(a);
  var d = {}; 
  var v;
  var vx = {"type": VALUE};
  d[idx]=vx;
  if(idy){
    var vy= {"type": VALUE};
    d[idy]=vy;
    v = compile(t,d);
    return function(x,y){
      vx.value=x;
      vy.value=y;
      return evalv(v);
    };
  }else{
    v = compile(t,d);
    return function(x){
      vx.value=x;
      return evalv(v);
    };
  }
}

function value_tos(x){
  if(Array.isArray(x)){
    var a=x.map(value_tos);
    return "["+a.join(", ")+"]";
  }else{
    return x.toString();
  }
}

function ast_to_str(t){
  var type=t.type;
  if(type=="id" || type=="int" || type=="float"){
    return t.value;
  }else if(type=="op"){
    var value=t.value;
    if(value=="*"){
      if(t.a[0].type=="int" && t.a[1].type=="id"){
        return ast_to_str(t.a[0])+ast_to_str(t.a[1]);
      }
    }
    var a=[];
    for(var i=0; i<t.a.length; i++){
      if(t.a[i].type!="op"){
        a.push(ast_to_str(t.a[i]));
      }else if(precedence(t.a[i].value)>precedence(value) ||
        (t.a[i].value==value && is_associative(value))
      ){
        a.push(ast_to_str(t.a[i]));
      }else{
        a.push("("+ast_to_str(t.a[i])+")");
      }
    }
    if(value=="u-"){
      return "-"+a.join(value);
    }else if(value=="+" && t.a[1].type=="op" && t.a[1].value=="u-"){
      return a.join("");
    }else{
      return a.join(value);
    }
  }else if(type=="app"){
    var a=[];
    for(var i=0; i<t.a.length; i++){
      a.push(ast_to_str(t.a[i]));
    }
    if(t.value=="List"){
      return "["+a.join(",")+"]";
    }else{
      return t.value+"("+a.join(",")+")";
    }
  }else{
    return "??";
  }
}

function calc(){
  var input = document.getElementById("line");
  var ans = document.getElementById("ans");
  try{
    var s = input.value.trim();
    if(s.length>0){
      var a = scan(input.value);
      var t = syntax_tree(a);
      // var t2 = t;
      // var t2 = cas_diff(t,"x");
      var t2 = cas_eval_symbolic(t);
      // ans.innerHTML = syntax_tree_tos(t2);
      ans.innerHTML = ast_to_str(t2);
      // var v = compile(t,{});
      // ans.innerHTML = code_tos(v);
      /*
      var y = evalv(v);
      if(y==undefined){
        ans.innerHTML = "";
      }else{
        ans.innerHTML = y.str();
      }
      */
    }else{
      ans.innerHTML=s;
    }
  }catch(e){
    if(e.type=="syntax"){
      ans.innerHTML = error_tos(e,input.value);
    }else if(e.type=="error"){
      ans.innerHTML = e.value;
    }else{
      throw e;
    }
  }
}
