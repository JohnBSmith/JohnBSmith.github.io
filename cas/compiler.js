
"use strict";

var compiler = (function(){

function isalpha(s){
  return /^[a-z]+$/i.test(s);
}

function isdigit(s){
  return /^\d+$/.test(s);
}

function isspace(s){
  return s==' ' || s=='\t' || s=='\n';
}

function token(type,value,line,col){
  return {"type": type, "value": value, "line": line, "col": col};
}

function vtoken_tos(a){
  var b=[];
  for(var i=0; i<a.length; i++){
    var t=a[i];
    b.push("["+t.type+","+t.value+"]");
  }
  return b.join(" ");
}

var keywords = {
  "in": "op", "and": "op", "or": "op"
};

function scan(s){
  var n=s.length;
  var c,i,j,line,col,hcol;
  var a=[];
  i=0; line=0; col=0;
  while(i<n){
    c=s[i];
    if(isspace(c)){
      i++; col++;
    }else if(isdigit(c)){
      j=i; hcol=col;
      while(i<n && (isdigit(s[i]) || s[i]=='.')){
        if(s[i]=='.' && i+1<n && s[i+1]=='.') break;
        i++; col++;
      }
      a.push(token("number",s.slice(j,i),line,hcol));
    }else if(isalpha(c)){
      j=i; hcol=col;
      while(i<n && (isalpha(s[i]) || isdigit(s[i]))){
        i++; col++;
      }
      var id = s.slice(j,i);
      if(keywords.hasOwnProperty(id)){
        a.push(token(keywords[id],id,line,col));
      }else{
        if(a.length>0 && a[a.length-1].type=="number"){
          a.push(token("op","*",line,col));
        }
        a.push(token("id",id,line,hcol));
      }
    }else if(c=="(" || c=="[" || c=="{"){
      if(a.length>0 && a[a.length-1].type=="number"){
        a.push(token("op","*",line,col));
      }
      a.push(token("bracket",c,line,col));
      i++; col++;
    }else if(c==")" || c=="]" || c=="}"){
      a.push(token("bracket",c,line,col));
      i++; col++;
    }else if(c=="," || c==";"){
      a.push(token("sep",c,line,col));
      i++; col++;
    }else if(c=="!" && i+1<n && s[i+1]=="="){
      a.push(token("op","!=",line,col));
      i+=2; col+=2;
    }else if(c=="=" && i+1<n && s[i+1]==">"){
      a.push(token("op","=>",line,col));
      i+=2; col+=2;
    }else if(c=="." && i+1<n && s[i+1]=="."){
      a.push(token("op","..",line,col));
      i+=2; col+=2;
    }else{
      a.push(token("op",c,line,col));
      i++; col++;
    }
  }
  a.push(token(".","",line,col));
  return a;
}

function point_to(s,col){
  var a = [
    s, "\n<br>",
    Array(col).join("&nbsp;")+"^"
  ];
  return a.join("");
}

function syntax_error(i,text){
  var line = i.a[i.index].line;
  var col = i.a[i.index].col;
  var a = [
    point_to(i.s,col+1), "\n<br>",
    "Line ", String(line+1), ", col ", String(col+1), "\n<br>",
    "Syntax error: ", text
  ];
  throw a.join("");
}

function get_token(i){
  return i.a[i.index];
}

function atom(i){
  var t = get_token(i);
  if(t.type=="number"){
    i.index++;
    return parseFloat(t.value);
  }else if(t.type=="id"){
    i.index++;
    return t.value;
  }else{
    syntax_error(i,"expected an identifier or a number.");
  }
}

function list(i){
  i.index++;
  var a=[];
  var t = get_token(i);
  if(t.type=="bracket" && t.value=="]"){
    i.index++;
    return ["[]",a];
  }
  while(1){
    a.push(expression(i));
    t = get_token(i);
    if(t.type=="bracket" && t.value=="]"){
      i.index++;
      return ["[]",a];
    }else if(t.type=="sep" && t.value==","){
      i.index++;
      continue;
    }else{
      syntax_error(i,"expected ',' or ']'.");
    }
  }
}

function formal_arguments(i){
  var a = [];
  while(1){
    a.push(atomic_expression(i));
    var t = get_token(i);
    if(t.type=="op" && t.value=="|"){
      i.index++;
      break;
    }else if(t.type=="sep" && t.value==","){
      i.index++;
      continue;
    }
  }
  return a;
}

function function_literal(i){
  i.index++;
  var a = formal_arguments(i);
  var x = expression(i);
  return ["lambda",[["[]",a],x]];
}

function atomic_expression(i){
  var t = get_token(i);
  if(t.type=="bracket" && t.value=="("){
    i.index++;
    var x = expression(i);
    t = get_token(i);
    if(t.type!="bracket" || t.value!=")"){
      syntax_error(i,"expected ')'.");
    }
    i.index++;
    return x;
  }else if(t.type=="bracket" && t.value=="["){
    return list(i);
  }else if(t.type=="op" && t.value=="|"){
    return function_literal(i);
  }else{
    return atom(i);
  }
}

function application(i){
  var x = atomic_expression(i);
  var t = get_token(i);
  while(t.type=="bracket" && t.value=="("){
    var a=[];
    i.index++;
    while(1){
      a.push(expression(i));
      t = get_token(i);
      if(t.type=="bracket" && t.value==")"){
        i.index++;
        x=[x,a];
        break;
      }else if(t.type=="sep" && t.value==","){
        i.index++;
        continue;
      }else{
        syntax_error(i,"expected ',' or ')'.");
      }
    }
    t = get_token(i);
  }
  return x;
}

function power(i){
  var x = application(i);
  var t = get_token(i);
  if(t.type=="op" && t.value=="^"){
    i.index++;
    var y = factor(i);
    return ["^",[x,y]];
  }else{
    return x;
  }
}

function factor(i){
  var t = get_token(i);
  if(t.type=="op"){
    if(t.value=="+"){
      i.index++;
      return factor(i);
    }else if(t.value=="-"){
      i.index++;
      return ["neg",[factor(i)]];
    }else{
      return power(i);
    }
  }else{
    return power(i);
  }
}

function term(i){
  var x = factor(i);
  var t = get_token(i);
  while(t.type=="id" || t.type=="number"){
    x = ["*",[x,factor(i)]];
    t = get_token(i);
  }
  while(t.type=="op" && (t.value=="*" || t.value=="/" || t.value=="%")){
    i.index++;
    var y = factor(i);
    x = [t.value,[x,y]];
    t = get_token(i);
  }
  return x;
}

function pm_term(i){
  var x = term(i);
  var t = get_token(i);
  while(t.type=="op" && (t.value=="+" || t.value=="-")){
    i.index++;
    var y = term(i);
    x = [t.value,[x,y]];
    t = get_token(i);
  }
  return x;
}

function range_term(i){
  var x = pm_term(i);
  var t = get_token(i);
  if(t.type=="op" && t.value==".."){
    i.index++;
    var y = pm_term(i);
    t = get_token(i);
    if(t.type=="op" && t.value==":"){
      i.index++;
      var d = pm_term(i);
      return ["range",[x,y,d]];
    }
    return ["range",[x,y]];
  }else{
    return x;
  }
}

function eq_relation(i){
  var x = range_term(i);
  var t = get_token(i);
  if(t.type=="op" && (t.value=="in" || t.value=="=" || t.value=="!=")){
    i.index++;
    var y = range_term(i);
    return [t.value,[x,y]];
  }else{
    return x;
  } 
}

function relation(i){
  var x = eq_relation(i);
  var t = get_token(i);
  if(t.type=="op" && (t.value=="<" || t.value==">" ||
    t.value=="<=" || t.value==">=" || t.value=="~")
  ){
    i.index++;
    var y = eq_relation(i);
    return [t.value,[x,y]];
  }else{
    return x;
  } 
}

function and_expression(i){
  var x = relation(i);
  var t = get_token(i);
  while(t.type=="op" && (t.value=="and")){
    i.index++;
    var y = relation(i);
    x=[t.value,[x,y]];
    t = get_token(i);
  }
  return x;
}

function or_expression(i){
  var x = and_expression(i);
  var t = get_token(i);
  while(t.type=="op" && (t.value=="or")){
    i.index++;
    var y = and_expression(i);
    x=[t.value,[x,y]];
    t = get_token(i);
  }
  return x;
}

function implication(i){
  var x = or_expression(i);
  var t = get_token(i);
  while(t.type=="op" && (t.value=="=>")){
    i.index++;
    var y = or_expression(i);
    x=[t.value,[x,y]];
    t = get_token(i);
  }
  return x;
}

function expression(i){
  return implication(i);
}

function ast(a,s){
  var i={};
  i.index=0;
  i.a=a;
  i.s=s;
  return expression(i);
}

function ast_tos(t){
  if(Array.isArray(t)){
    var a=[];
    a.push("<table class='op'><tr><td>"+ast_tos(t[0])+"</table>");
    a.push("<ul class='ast'>");
    for(var i=0; i<t[1].length; i++){
      a.push("<li>"+ast_tos(t[1][i]));
    }
    a.push("</ul>");
    return a.join("");
  }
  var T = typeof t;
  if(T=="string" || T=="number"){
    return String(t);
  }else{
    throw "ast_tos error";
  }
}

function htm_expression(t){
  if(navigator.userAgent.indexOf("Firefox")>0){
    return mathml_print.htm(t);
  }else{
    return htm_print.htm(t);
  }
}

return{
  isalpha: isalpha, isdigit: isdigit,
  htm_expression: htm_expression,
  scan: scan, ast_tos: ast_tos,
  ast: ast
}

})();

function main(){
  var input = document.getElementById("input1");
  var output = document.getElementById("output1");
  try{
    var a = compiler.scan(input.value);
    // alert(vtoken_tos(a));
    if(a[0].type!="."){
      var t = compiler.ast(a,input.value);
      t = cas.evaluate(t);
      var out = cas.output_form(t);
      output.innerHTML = compiler.htm_expression(out);
      output.innerHTML += "<ul class='ast'><li>"+compiler.ast_tos(out)+"</ul>";
    }else{
      output.innerHTML="";
    }
  }catch(e){
    if(typeof e=="string"){
      output.innerHTML=e;
    }
    throw e;
  }
}

function handle_keys(event){
  if(event.keyCode==13){
    main();
  }
}
