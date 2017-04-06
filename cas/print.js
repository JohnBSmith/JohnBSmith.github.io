
"use strict;"

// op: operator,
// cop: context operator,
// ast: abstract syntax tree

var htm_print = {
  order: {
    "app": 60,
    "^": 40,
    "neg": 30,
    "*": 20, "/": 20, "%": 20,
    "+": 10, "-": 10,
    "=": 8, "in": 8,
    "<": 4, ">": 4, "<=": 4, ">=": 4, 
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
    var s = this.ast(t[1][0],"^")+"<sup>"+this.ast(t[1][1],"")+"</sup>";
    if(this.order[op]>=this.order["^"]){
      return "("+s+")";
    }else{
      return s;
    }
  },
  mpy: function(t,op){
    var sx = this.ast(t[1][0],"*");
    var sy = this.ast(t[1][1],"*");
    if(typeof t[1][0]=="number" && sy.length>=1 && !isdigit(sy.slice(0,1))){
      s=sx+sy;
    }else{
      s=[sx,"<span class='sop'>&middot;</span>",sy].join("");
    }
    if(this.order[op]>this.order["*"]){
      return "("+s+")";
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
      return "("+a.join(p)+")";
    }else{
      return a.join(p);
    }
  },
  unary: function(t,op,context,p){
    var s = p+this.ast(t[1][0],op);
    if(this.order[context]>this.order[op]){
      return "("+s+")";
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
      return "("+s+")";
    }else{
      return s;
    }
  },
  list: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    return "["+a.join(",")+"]";
  },
  app: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    return this.ast(t[0],"app")+"("+a.join(",")+")";
  },
  diff: function(t,op){
    var s = ["<span class='frac'><span class='tr'>",
      "<span class='fn'>d</span></span><span class='tr'><span class='fd'>d",
      this.ast(t[1][1],"app"), "</span></span></span><span class='ts'></span>",
      this.ast(t[1][0],"*")].join("");
    if(this.order[op]>this.order["*"]){
      return "("+s+")";
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
          return this.operator(t,"+",op,"<span class='sop'>+</span>");
        }else if(s=="-"){
          return this.operator(t,"-",op,"<span class='sop'>&minus;</span>");
        }else if(s=="neg"){
          return this.unary(t,"neg",op,"&minus;");
        }else if(s=="list"){
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
    return this.ast(t,"");
  }
};


var mathml_print = {
  order: htm_print.order,
  alt_name: {
    "e": "<mi mathvariant='normal'>e</mi>",
    "i": "<mi mathvariant='normal'>i</mi>",
    "lambda": "&lambda;"
  },
  power: function(t,op){
    var s = "<msup><mrow>"+this.ast(t[1][0],"^")+"</mrow><mrow>"+this.ast(t[1][1],"")+"</mrow></msup>";
    if(this.order[op]>=this.order["^"]){
      return "<mo>(</mo>"+s+"<mo>)</mo>";
    }else{
      return s;
    }
  },
  mpy: function(t,op){
    var sx = this.ast(t[1][0],"*");
    var sy = this.ast(t[1][1],"*");
    if(typeof t[1][0]=="number" && sy.length>=4 && sy.slice(0,4)!="<mn>"){
      s=sx+sy;
    }else{
      s=[sx,"<mo>&middot;</mo>",sy].join("");
    }
    if(this.order[op]>this.order["*"]){
      return "<mo>(</mo>"+s+"<mo>)</mo>";
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
      return "<mo>(</mo>"+a.join(p)+"<mo>)</mo>";
    }else{
      return a.join(p);
    }
  },
  unary: function(t,op,context,p){
    var s = p+this.ast(t[1][0],op);
    if(this.order[context]>this.order[op]){
      return "<mo>(</mo>"+s+"<mo>)</mo>";
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
      return "("+s+")";
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
    return "<mo>[</mo>"+a.join("<mo>,</mo>")+"<mo>]</mo>";
  },
  app: function(t){
    var a=[];
    for(var i=0; i<t[1].length; i++){
      a.push(this.ast(t[1][i],""));
    }
    return this.ast(t[0],"app")+"<mo>(</mo>"+a.join("<mo>,</mo>")+"<mo>)</mo>";
  },
  diff: function(t,op){
    var s = ["<mfrac><mi mathvariant='normal'>d</mi><mrow>",
      "<mi mathvariant='normal'>d</mi>",
      this.ast(t[1][1],"app"), "</mrow></mfrac>",
      this.ast(t[1][0],"*")].join("");
    if(this.order[op]>this.order["*"]){
      return "<mo>(</mo>"+s+"<mo>)</mo>";
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
    return ["<mo>(</mo>",this.ast(args,""),
      "<mo>&mapsto;</mo>", this.ast(t[1][1],""),
      "<mo>)</mo>"
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
          return this.operator(t,"%",op,"<mo>%</mo>");
        }else if(s=="+"){
          return this.operator(t,"+",op,"<mo>+</mo>");
        }else if(s=="-"){
          return this.operator(t,"-",op,"<mo>&minus;</mo>");
        }else if(s=="neg"){
          return this.unary(t,"neg",op,"<mo>&minus;</mo>");
        }else if(s=="list"){
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
        }else if(s=="sqrt"){
          return this.sqrt(t);
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
    return ["<math>", this.ast(t,""), "</math>"].join("");
  }
};

