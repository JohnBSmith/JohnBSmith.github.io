
"use strict;"

// op: operator,
// cop: context operator,
// ast: abstract syntax tree

var htm_print = {
  order: {
    "app": 80,
    "^": 70,
    "neg": 60,
    "*": 50, "/": 50, "%": 50,
    "+": 40, "-": 40,
    "..": 30,
    "=": 20, "in": 20,
    "<": 10, ">": 10, "<=": 10, ">=": 10,
    "and": 8,
    "or": 6,
    "=>": 4,
    "<=>": 2,
    "": 0,
  },
  alt_name: {
    "alpha": "&alpha;",
    "beta": "&beta;",
    "gamma": "&gamma;",
    "Gamma": "&Gamma;",
    "delta": "&delta;",
    "Delta": "&Delta;",
    "phi": "&phi;",
    "sum": "&sum;",
    "lambda": "&lambda;"
  },
  power: function(t,op){
    var s = [this.ast(t[1][0],"^"), "<sup>", this.ast(t[1][1],""), "</sup>"].join("");
    if(this.order[op]>=this.order["^"]){
      return ["(", s, ")"].join("");
    }else{
      return s;
    }
  },
  mpy_invisible: function(t){
    if(typeof t=="string"){
      return true;
    }else if(cas.is_app(t)){
      if(t[0]==="+" || t[0]==="-"){
        return 1;
      }else if(t[0]==="*" || t[0]==="^" ||
        typeof t[0]==="string" && compiler.isalpha(t[0])
      ){
        return this.mpy_invisible(t[1][0]);
      }
    }
    return false;
  },
  mpy: function(t,op){
    var a = [];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],"*"));
    }
    var b=[a[0]];
    for(var i=1; i<t[1].length; i++){
      if(htm_print.mpy_invisible(t[1][i])){
        if(typeof t[1][i-1]=="number"){
          b.push(a[i]);
        }else{
          b.push("<span class='sop'>&middot;</span>",a[i]);
        }
      }else{
        b.push("<span class='sop'>&middot;</span>",a[i]);
      }
    }
    s=b.join("");
    if(this.order[op]>this.order["*"]){
      return ["(", s, ")"].join("");
    }else{
      return s;
    }
  },
  operator: function(t,op,cop,p){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],op));
    }
    if(this.order[cop]>this.order[op]){
      return ["(", a.join(p), ")"].join("");
    }else{
      return a.join(p);
    }
  },
  unary: function(t,op,context,p){
    var s = p+this.ast(t[1][0],op);
    if(this.order[context]>this.order[op]){
      return ["(", s, ")"].join("");
    }else{
      return s;
    }    
  },
  fraction: function(t,op){
    var s = ["<span class='frac'><span class='tr'><span class='fn'>",
      this.ast(t[1][0],""), "</span></span><span class='tr'><span class='fd'>",
      this.ast(t[1][1],""), "</span></span></span>"
    ].join("");
    if(this.order[op]>this.order["/"]){
      return ["(", s, ")"].join("");
    }else{
      return s;
    }
  },
  list: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    return ["[", a.join(","), "]"].join("");
  },
  app: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    return [this.ast(t[0],"app"), "(", a.join(","), ")"].join("");
  },
  diff: function(t,op){
    var s = ["<span class='frac'><span class='tr'>",
      "<span class='fn'>d</span></span><span class='tr'><span class='fd'>d",
      this.ast(t[1][1],"app"), "</span></span></span><span class='ts'></span>",
      this.ast(t[1][0],"*")].join("");
    if(this.order[op]>this.order["*"]){
      return ["(", s, ")"].join("");
    }else{
      return s;
    }
  },
  lambda: function(t){
    var args;
    if(t[1][0][1].length==1){
      args = t[1][0][1][0];
    }else{
      args = t[1][0];
    }
    return ["(",this.ast(args,""),
      "&nbsp;&mapsto;&nbsp;", this.ast(t[1][1],""), ")"
    ].join("");
  },
  ast: function(t,op){
    var T;
    if(Array.isArray(t)){
      var s=t[0];
      if(typeof s=="string"){
        if(s=="^"){
          return this.power(t,op);
        }else if(s=="*"){
          return this.mpy(t,op);
        }else if(s=="/"){
          return this.fraction(t,op);
        }else if(s=="%"){
          return this.operator(t,"%",op,"%");
        }else if(s=="+"){
          return this.operator(t,"+",op,"&thinsp;+&thinsp;");
        }else if(s=="-"){
          return this.operator(t,"-",op,"<span class='sop'>&minus;</span>");
        }else if(s=="neg"){
          return this.unary(t,"neg",op,"&minus;");
        }else if(s=="[]"){
          return this.list(t);
        }else if(s=="="){
          return this.operator(t,"=",op,"&nbsp;=&nbsp;");
        }else if(s=="!="){
          return this.operator(t,"=",op,"&nbsp;&ne;&nbsp;");
        }else if(s=="in"){
          return this.operator(t,"in",op,"&in;");
        }else if(s=="<"){
          return this.operator(t,"<",op,"&lt;");
        }else if(s==">"){
          return this.operator(t,">",op,"&gt;");
        }else if(s=="<="){
          return this.operator(t,"<=",op,"&le;");
        }else if(s==">="){
          return this.operator(t,">=",op,"&ge;");
        }else if(s=="and"){
          return this.operator(t,"and",op,"&nbsp;&and;&nbsp;");
        }else if(s=="diff"){
          return this.diff(t,op);
        }else if(s=="lambda"){
          return this.lambda(t);
        }
      }
      return this.app(t);
    }
    T = typeof t;
    if(T=="string"){
      if(this.alt_name.hasOwnProperty(t)){
        return this.alt_name[t];
      }else{
        if(t.length==1){
          return ["<i>", t, "</i>"].join("");
        }else{
          return t;
        }
      }
    }else if(T=="number"){
      if(t<0){
        return "&minus;"+String(-t);
      }else{
        return String(t);
      }
    }
  },
  htm: function(t){
    return ["<div class='math'>", this.ast(t,""), "</div>"].join("");
  }
};


var mathml_print = {
  order: htm_print.order,
  alt_name: {
    "e": "<mi mathvariant='normal'>e</mi>",
    "i": "<mi mathvariant='normal'>i</mi>",
    "lambda": "&lambda;",
    "sum": "&sum;",
    "all": "&forall;",
    "any": "&exists;",
    "inf": "&infin;"
  },
  power: function(t,op){
    var s = [
      "<msup><mrow>", this.ast(t[1][0],"^"),
      "</mrow><mrow>", this.ast(t[1][1],""), "</mrow></msup>"
    ].join("");
    if(this.order[op]>=this.order["^"]){
      return ["<mo>(</mo>", s, "<mo>)</mo>"].join("");
    }else{
      return s;
    }
  },
  mpy: function(t,op){
    var a = [];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],"*"));
    }
    var b=[a[0]];
    for(var i=1; i<t[1].length; i++){
      if(htm_print.mpy_invisible(t[1][i])){
        if(typeof t[1][i-1]=="number"){
          b.push(a[i]);
        }else{
          b.push("<mo>&middot;</mo>",a[i]);
        }
      }else{
        b.push("<mo>&middot;</mo>",a[i]);
      }
    }
    s=b.join("");
    if(this.order[op]>this.order["*"]){
      return ["<mo>(</mo>", s, "<mo>)</mo>"].join("");
    }else{
      return s;
    }
  },
  operator: function(t,op,cop,p){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],op));
    }
    if(this.order[cop]>this.order[op]){
      return ["<mo>(</mo>", a.join(p), "<mo>)</mo>"].join("");
    }else{
      return a.join(p);
    }
  },
  unary: function(t,op,context,p){
    var s = p+this.ast(t[1][0],op);
    if(this.order[context]>this.order[op]){
      return ["<mo>(</mo>", s, "<mo>)</mo>"].join("");
    }else{
      return s;
    }    
  },
  fraction: function(t,op){
    var s = ["<mfrac><mrow>",
      this.ast(t[1][0],""), "</mrow><mrow>",
      this.ast(t[1][1],""), "</mrow></mfrac>"
    ].join("");
    if(this.order[op]>this.order["/"]){
      return ["<mo>(</mo>", s, "<mo>)</mo>"].join("");
    }else{
      return s;
    }
  },
  sqrt: function(t){
    var s = ["<msqrt><mrow>", this.ast(t[1][0],""),
      "</mrow></msqrt>"].join("");
    return s;
  },
  list: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    return ["<mo>[</mo>", a.join("<mo>,</mo>"), "<mo>]</mo>"].join("");
  },
  app: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    var f;
    if(cas.is_app(t[0])){
      f = ["<mo>(</mo>", this.ast(t[0],""), "<mo>)</mo>"].join("");
    }else{
      f = this.ast(t[0],"app");
    }
    return [f, "<mo>(</mo>", a.join("<mo>,</mo>"), "<mo>)</mo>"].join("");
  },
  diff: function(t,op){
    var s = ["<mfrac><mi mathvariant='normal'>d</mi><mrow>",
      "<mi mathvariant='normal'>d</mi>",
      this.ast(t[1][1],"app"), "</mrow></mfrac>",
      this.ast(t[1][0],"*")].join("");
    if(this.order[op]>this.order["*"]){
      return ["<mo>(</mo>", s, "<mo>)</mo>"].join("");
    }else{
      return s;
    }
  },
  lambda: function(t){
    var args;
    if(t[1][0][1].length==1){
      args = t[1][0][1][0];
    }else{
      args = t[1][0];
    }
    return [this.ast(args,""),
      "<mo>&mapsto;</mo>", this.ast(t[1][1],"")
    ].join("");
  },
  sum: function(t,op){
    s=[
      "<munder><mo>&sum;</mo><mrow>", this.ast(t[1][0],""), "</mrow></munder>", this.ast(t[1][1],"")
    ].join("");
    if(this.order[op]>this.order["+"]){
      return ["<mo>(</mo>", s, "<mo>)</mo>"].join("");
    }else{
      return s;
    }
  },
  ast: function(t,op){
    var T;
    if(Array.isArray(t)){
      var s=t[0];
      if(typeof s=="string"){
        if(s=="^"){
          return this.power(t,op);
        }else if(s=="*"){
          return this.mpy(t,op);
        }else if(s=="/"){
          return this.fraction(t,op);
        }else if(s=="%"){
          return this.operator(t,"%",op,"<mo>%</mo>");
        }else if(s=="+"){
          return this.operator(t,"+",op,"<mo>+</mo>");
        }else if(s=="-"){
          return this.operator(t,"-",op,"<mo>&minus;</mo>");
        }else if(s=="neg"){
          return this.unary(t,"neg",op,"<mo>&minus;</mo>");
        }else if(s=="[]"){
          return this.list(t);
        }else if(s=="="){
          return this.operator(t,"=",op,"<mo>=</mo>");
        }else if(s=="!="){
          return this.operator(t,"=",op,"<mo>&ne;</mo>");
        }else if(s=="in"){
          return this.operator(t,"in",op,"<mo>&in;</mo>");
        }else if(s=="<"){
          return this.operator(t,"<",op,"<mo>&lt;</mo>");
        }else if(s==">"){
          return this.operator(t,">",op,"<mo>&gt;</mo>");
        }else if(s=="<="){
          return this.operator(t,"<=",op,"<mo>&le;</mo>");
        }else if(s==">="){
          return this.operator(t,">=",op,"<mo>&ge;</mo>");
        }else if(s=="and"){
          return this.operator(t,"and",op,"<mo>&and;</mo>");
        }else if(s=="or"){
          return this.operator(t,"or",op,"<mo>&or;</mo>");
        }else if(s=="=>"){
          return this.operator(t,"or",op,"<mo>&rArr;</mo>");
        }else if(s=="range"){
          return this.operator(t,"..",op,"<mo>..</mo>");
        }else if(s=="sqrt"){
          return this.sqrt(t);
        }else if(s=="diff"){
          return this.diff(t,op);
        }else if(s=="lambda"){
          return this.lambda(t);
        }else if(s=="sum"){
          return this.sum(t,op);
        }
      }
      return this.app(t);
    }
    T = typeof t;
    if(T=="string"){
      if(this.alt_name.hasOwnProperty(t)){
        return this.alt_name[t];
      }else{
        return ["<mi>", t, "</mi>"].join("");
      }
    }else if(T=="number"){
      if(t<0){
        return ["<mo>&minus;</mo>", "<mn>", String(-t), "</mn>"].join("");
      }else{
        return ["<mn>", String(t), "</mn>"].join("");
      }
    }
  },
  htm: function(t){
    return ["<math displaystyle='true'>", this.ast(t,""), "</math>"].join("");
  }
};

