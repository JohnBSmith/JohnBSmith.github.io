
"use strict";

var ftab = {
    pi: Math.PI, tau: 2*Math.PI, e: Math.E, nan: NaN,
    abs: Math.abs, sgn: Math.sign, sign: Math.sign,
    max: Math.max, min: Math.min, hypot: Math.hypot,
    floor: Math.floor, ceil: Math.ceil,
    rd: Math.round, trunc: Math.trunc,
    sqrt: Math.sqrt, expm1: Math.expm1, rng: Math.random,
    exp: Math.exp, log: log, ln: Math.log, lg: lg, ld: ld, lb: ld,
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    cot: cot, sec: sec, csc: csc,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    sinh: sinh, cosh: cosh, tanh: tanh, coth: coth,
    asinh: asinh, acosh: acosh, atanh: atanh,
    acoth: acoth, asech: asech, acsch: acsch,
    arsinh: asinh, arcosh: acosh, artanh: atanh,
    arcoth: acoth, arsech: asech, arcsch: acsch,
    sinc: sinc, gd: gd, 
    gamma: gamma,
    diff: diffh(0.001), int: integral
};

function diffh(h){
    return function diff(f,x,n){
        if(n==undefined || n==1){
            return (f(x-2*h)-8*f(x-h)+8*f(x+h)-f(x+2*h))/(12*h);
        }else{
            return (diff(f,x+h,n-1)-diff(f,x-h,n-1))/(2*h);
        }
    };
}

var g64=[
[0.0486909570091397, -0.0243502926634244],
[0.0486909570091397, 0.0243502926634244],
[0.0485754674415034, -0.0729931217877990],
[0.0485754674415034, 0.0729931217877990],
[0.0483447622348030, -0.1214628192961206],
[0.0483447622348030, 0.1214628192961206],
[0.0479993885964583, -0.1696444204239928],
[0.0479993885964583, 0.1696444204239928],
[0.0475401657148303, -0.2174236437400071],
[0.0475401657148303, 0.2174236437400071],
[0.0469681828162100, -0.2646871622087674],
[0.0469681828162100, 0.2646871622087674],
[0.0462847965813144, -0.3113228719902110],
[0.0462847965813144, 0.3113228719902110],
[0.0454916279274181, -0.3572201583376681],
[0.0454916279274181, 0.3572201583376681],
[0.0445905581637566, -0.4022701579639916],
[0.0445905581637566, 0.4022701579639916],
[0.0435837245293235, -0.4463660172534641],
[0.0435837245293235, 0.4463660172534641],
[0.0424735151236536, -0.4894031457070530],
[0.0424735151236536, 0.4894031457070530],
[0.0412625632426235, -0.5312794640198946],
[0.0412625632426235, 0.5312794640198946],
[0.0399537411327203, -0.5718956462026340],
[0.0399537411327203, 0.5718956462026340],
[0.0385501531786156, -0.6111553551723933],
[0.0385501531786156, 0.6111553551723933],
[0.0370551285402400, -0.6489654712546573],
[0.0370551285402400, 0.6489654712546573],
[0.0354722132568824, -0.6852363130542333],
[0.0354722132568824, 0.6852363130542333],
[0.0338051618371416, -0.7198818501716109],
[0.0338051618371416, 0.7198818501716109],
[0.0320579283548516, -0.7528199072605319],
[0.0320579283548516, 0.7528199072605319],
[0.0302346570724025, -0.7839723589433414],
[0.0302346570724025, 0.7839723589433414],
[0.0283396726142595, -0.8132653151227975],
[0.0283396726142595, 0.8132653151227975],
[0.0263774697150547, -0.8406292962525803],
[0.0263774697150547, 0.8406292962525803],
[0.0243527025687109, -0.8659993981540928],
[0.0243527025687109, 0.8659993981540928],
[0.0222701738083833, -0.8893154459951141],
[0.0222701738083833, 0.8893154459951141],
[0.0201348231535302, -0.9105221370785028],
[0.0201348231535302, 0.9105221370785028],
[0.0179517157756973, -0.9295691721319396],
[0.0179517157756973, 0.9295691721319396],
[0.0157260304760247, -0.9464113748584028],
[0.0157260304760247, 0.9464113748584028],
[0.0134630478967186, -0.9610087996520538],
[0.0134630478967186, 0.9610087996520538],
[0.0111681394601311, -0.9733268277899110],
[0.0111681394601311, 0.9733268277899110],
[0.0088467598263639, -0.9833362538846260],
[0.0088467598263639, 0.9833362538846260],
[0.0065044579689784, -0.9910133714767443],
[0.0065044579689784, 0.9910133714767443],
[0.0041470332605625, -0.9963401167719553],
[0.0041470332605625, 0.9963401167719553],
[0.0017832807216964, -0.9993050417357722],
[0.0017832807216964, 0.9993050417357722]]

function gauss(f,a,b,n){
    var s,sj,h,i,j,aj,bj,p,q;
    var g = g64;
    var m = g64.length;
    h = (b-a)/n;
    s = 0;
    for(j=0; j<n; j++){
        aj = a+j*h;
        bj = a+(j+1)*h;
        p = 0.5*(bj-aj);
        q = 0.5*(aj+bj);
        sj = 0;
        for(i=0; i<m; i++){
            sj += g[i][0]*f(p*g[i][1]+q);
        }
        s += p*sj;
    }
    return s;
}

function integral(a,b,f,n){
    if(n==undefined) n=1;
    return gauss(f,a,b,n);
}

// Lanczos approximation
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

function tanh(x){
    if(x>24) return 1;
    if(x<-24) return -1;
    return 1-2/(Math.exp(2*x)+1);
}

function lg(x){return 0.43429448190325176*Math.log(x);}
function ld(x){return 1.4426950408889634*Math.log(x);}
function log(x,b){return Math.log(x)/Math.log(b);}
function cot(x){return 1/Math.tan(x);}
function sec(x){return 1/Math.cos(x);}
function csc(x){return 1/Math.sin(x);}
function acot(x){return Math.PI/2-Math.atan(x);}
function asec(x){return Math.acos(1/x);}
function acsc(x){return Math.asin(1/x);}
function sinh(x){return 0.5*(Math.exp(x)-Math.exp(-x));}
function cosh(x){return 0.5*(Math.exp(x)+Math.exp(-x));}
function coth(x){return 1/tanh(x);}
function sech(x){return 1/cosh(x);}
function csch(x){return 1/sinh(x);}
function asinh(x){return Math.log(x+Math.sqrt(x*x+1));}
function acosh(x){return Math.log(x+Math.sqrt(x*x-1));}
function atanh(x){return 0.5*Math.log((1+x)/(1-x));}
function acoth(x){return 0.5*Math.log((x+1)/(x-1));}
function asech(x){return acosh(1/x);}
function acsch(x){return asinh(1/x);}
function gd(x){return Math.atan(sinh(x));}

function sinc(x){
    return x==0?1:Math.sin(Math.PI*x)/(Math.PI*x);
}

function invab(f,x,a,b){
    var m,s,a1,b1;
    a1=a; b1=b;
    s = Math.sign(f(b)-f(a));
    if(s==0 || isNaN(s)) s=1;
    for(var k=0; k<60; k++){
        m = 0.5*(a+b);
        if(s*(f(m)-x)<0) a=m;
        else b=m;
    }
    if(Math.abs(m-a1)<1E-8) return NaN;
    if(Math.abs(m-b1)<1E-8) return NaN;
    return m;
}

function zeroes_bisection(f,a,b,n){
    var zeroes = [];
    var h = (b-a)/n;
    for(var k=0; k<n; k++){
        var x0 = a+h*k;
        var x1 = a+h*(k+1);
        if(Math.sign(f(x0))!=Math.sign(f(x1))){
            if(f(x0)==0){
                zeroes.push(x0);
            }else if(f(x1)==0){
                zeroes.push(x1);
            }else{
                zeroes.push(invab(f,0,x0,x1))
            }
        }
    }
    return zeroes;
}

function isalpha(s){
    return /^[a-z]+$/i.test(s);
}

function isdigit(s){
    return /^\d+$/.test(s);
}

function isspace(s){
    return s==' ' || s=='\t' || s=='\n';
}

function str(s){
    return JSON.stringify(s);
}

function Err(text){
    this.text = text;
}

function repeat(c,n){
    return Array(n+1).join(c);
}

function syntax_error(i,text){
    var t = i.a[i.index];
    var s = ["&nbsp;&nbsp;",i.s,"<br>&nbsp;&nbsp;",
        repeat("&nbsp;",t[3])+"<b>^</b>", "<br>",
        "Syntax error: ",text
    ].join("");
    throw new Err(s);
}

var superscript = {
    '\u2070': "0",
    '\u00b9': "1",
    '\u00b2': "2",
    '\u00b3': "3",
    '\u2074': "4",
    '\u2075': "5",
    '\u2076': "6",
    '\u2077': "7",
    '\u2078': "8",
    '\u2079': "9"
};

var Symbol = 0;
var SymbolIdentifier = 1;
var SymbolNumber = 2;
var SymbolTerminator = 3;

function scan(s){
    var a = [];
    var n = s.length;
    var i = 0;
    var line = 0;
    var col = 0;
    while(i<n){
        if(isalpha(s[i])) {
            var col0 = col;
            var id = "";
            while(i<n && (isalpha(s[i]) || isdigit(s[i]))){
                id += s[i];
                i++; col++;
            }
            if(a.length>0){
                var last = a[a.length-1];
                if(last[0]==SymbolNumber || (last[0]==Symbol && last[1]==')')){
                    a.push([Symbol,"*",line,col0]);
                }
            }
            a.push([SymbolIdentifier,id,line,col0]);
        }else if(isdigit(s[i])){
            var col0 = col;
            var number = "";
            while(i<n && (isdigit(s[i]) || s[i]=='.')){
                number += s[i];
                i++; col++;
            }
            a.push([SymbolNumber,number,line,col0]);
        }else if(isspace(s[i])){
            if(s[i]=='\n'){line++; col=0;}
            else {col++;}
            i++;
        }else if(i+1<n && s[i]=='<' && s[i+1]=='='){
            a.push([Symbol,"<=",line,col]);
            i+=2; col+=2;
        }else if(i+1<n && s[i]=='>' && s[i+1]=='='){
            a.push([Symbol,">=",line,col]);
            i+=2; col+=2;
        }else if(i+1<n && s[i]==':' && s[i+1]=='='){
            a.push([Symbol,":=",line,col]);
            i+=2; col+=2;
        }else if(superscript.hasOwnProperty(s[i])){
            var number = "";
            while(i<n && superscript.hasOwnProperty(s[i])){
                number += superscript[s[i]];
                i++; col++;
            }
            a.push([Symbol,"^",line,col]);
            a.push([SymbolNumber,number,line,col]);
        }else{
            a.push([Symbol,s[i],line,col]);
            i++; col++;
        }
    }
    a.push([SymbolTerminator,"",line,col]);
    return a;
}

function lambda_expression(i){
    i.index++;
    var argv = [];
    while(1){
        argv.push(atom(i));
        var t = i.a[i.index];
        if(t[0]==Symbol && t[1]=='|'){
            i.index++;
            break;
        }else if(t[0]==Symbol && t[1]==','){
            i.index++;
        }
    }
    var x = expression(i);
    return ["||",argv,x];
}

function atom(i){
    var t = i.a[i.index];
    if(t[0] == SymbolNumber){
        i.index++;
        return parseFloat(t[1]);
    }else if(t[0] == SymbolIdentifier){
        i.index++;
        return t[1];
    }else if(t[0] == Symbol && t[1]=='('){
        i.index++;
        var x = expression(i);
        t = i.a[i.index];
        if(t[0] == Symbol && t[1]==')'){
            i.index++;
            return x;
        }else{
            syntax_error(i,"expected ')'.");
        }
    }else if(t[0] == Symbol && t[1]=='['){
        i.index++;
        var a = ["[]"];
        return application_list(i,a,']');
    }else if(t[0] == Symbol && t[1]=='|'){
        return lambda_expression(i);
    }else{
        syntax_error(i,"expected an operand.");
    }
}

function application_list(i,a,bracket){
    var t = i.a[i.index];
    if(t[0]==Symbol && t[1]==bracket){
        i.index++;
        return a;
    }
    while(1){
        a.push(expression(i));
        t = i.a[i.index];
        if(t[0]==Symbol && t[1]==bracket){
            i.index++;
            return a;
        }else if(t[0]==Symbol && t[1]==','){
            i.index++;
        }else{
            syntax_error(i,"expected ',' or '"+bracket+"'.");
        }
    }
}

function application(i){
    var x = atom(i);
    while(1){
        var t = i.a[i.index];
        if(t[0]==Symbol && t[1]=='('){
            i.index++;
            x = application_list(i,[x],')');
        }else if(t[0]==Symbol && t[1]=="'"){
            var count = 0;
            while(1){
                t = i.a[i.index];
                if(t[0]==Symbol && t[1]=="'"){
                    count++;
                    i.index++;
                }else break;
            }
            var y = atom(i);
            if(count==1){
                x = ["diff",x,y];
            }else{
                x = ["diff",x,y,count];
            }
        }else{
            break;
        }
    }
    return x;
}

function power(i){
    var x = application(i);
    var t = i.a[i.index];
    if(t[0] == Symbol && t[1]=='^'){
        i.index++;
        var y = negation(i);
        return ["^",x,y];
    }else{
        return x;
    }
}

function negation(i){
    var t = i.a[i.index];
    if(t[0] == Symbol && t[1]=='-'){
        i.index++;
        var x = power(i);
        return ["~",x];
    }else if(t[0] == Symbol && t[1]=='+'){
        i.index++;
        return power(i);
    }else{
        return power(i);
    }
}

function multiplication(i){
    var x = negation(i);
    while(1){
        var t = i.a[i.index];
        if(t[0] == Symbol && (t[1]=='*' || t[1]=='/')){
            i.index++;
            var y = negation(i);
            x = [t[1],x,y];
        }else{
            break;
        }
    }
    return x;
}

function addition(i){
    var x = multiplication(i);
    while(1){
        var t = i.a[i.index];
        if(t[0] == Symbol && (t[1]=='+' || t[1]=='-')){
            i.index++;
            var y = multiplication(i);
            x = [t[1],x,y];
        }else{
            break;
        }
    }
    return x;
}

function comparison(i){
    var x = addition(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && (
       t[1]=="<"  || t[1]==">" || t[1]=="<=" ||
       t[1]==">=" || t[1]=="=" || t[1]=="!="
    )){
        i.index++;
        var y = addition(i);
        return [t[1],x,y];
    }else{
        return x;
    }
}

function expression(i){
    return comparison(i);
}

function assignment(i){
    var x = expression(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && t[1]==":="){
        i.index++;
        var y = expression(i);
        return [":=",x,y];
    }else{
        return x;
    }
}

function expression_list(i){
    var a = ["block"];
    while(1){
        a.push(assignment(i));
        var t = i.a[i.index];
        if(t[0]==Symbol && t[1]==","){
            i.index++;
        }else{
            break;
        }
    }
    if(a.length==2){
        return a[1];
    }else{
        return a;
    }
}

function parse(a,s){
    var i = {index: 0, a: a, s: s};
    var x = expression_list(i);
    var t = i.a[i.index];
    if(t[0] != SymbolTerminator){
        syntax_error(i,"unexpected symbol: '"+t[1]+"'.");
    }
    return x;
}

function ast(s){
    var a = scan(s);
    return parse(a,s);
}

function compile_application(a,id,t,context){
    if(id.length>0) a.push(id);
    a.push("(");
    var first = true;
    for(var i=1; i<t.length; i++){
        if(first){first = false;}
        else{a.push(",");}
        compile_expression(a,t[i],context);
    }
    a.push(")");
}

function compile_list(a,t,context){
    a.push("[");
    var first = true;
    for(var i=1; i<t.length; i++){
        if(first){first = false;}
        else{a.push(",");}
        compile_expression(a,t[i],context);
    }
    a.push("]");
}

function compile_lambda_expression(a,argv,body,context){
    var local = Object.create(context.local);
    for(var i=0; i<argv.length; i++){
        local[argv[i]] = true;
    }
    var sub_context = {local: local, pre: context.pre};
    a.push("function("+argv.join(",")+"){return ");
    compile_expression(a,body,sub_context);
    a.push(";}");
}

function compile_block(a,t,context){
    var n = t.length-1;
    var b = [];
    for(var i=1; i<n; i++){
        compile_expression(b,t[i],context);
        b.push(";");
    }
    context.statements.push(b.join(""));
    compile_expression(a,t[n],context);
}

function compile_assignment(a,t,context){
    a.push("var "+t[1]+"=");
    compile_expression(a,t[2],context);
    context.local[t[1]] = true;
}

function compile_expression(a,t,context){
    if(typeof t == "number"){
        a.push(t);
    }else if(typeof t == "string"){
        if(t in context.local){
            a.push(t);
        }else if(ftab.hasOwnProperty(t)){
            context.pre.push("var "+t+"=ftab[\""+t+"\"];");
            context.local[t] = true;
            a.push(t);
        }else{
            throw new Err("Error: undefined variable: '"+t+"'.");
        }
    }else if(Array.isArray(t)){
        var op = t[0];
        if(Array.isArray(op)){
            compile_expression(a,op,context);
            compile_application(a,"",t,context);
        }else if(op=="+" || op=="-" || op=="*" || op=="/" ||
            op=="<" || op==">" || op=="<=" || op==">="
        ){
            a.push("(");
            compile_expression(a,t[1],context);
            a.push(op);
            compile_expression(a,t[2],context);
            a.push(")");
        }else if(op=="^"){
            a.push("power(");
            compile_expression(a,t[1],context);
            a.push(",");
            compile_expression(a,t[2],context);
            a.push(")");
        }else if(op=="~"){
            a.push("(-");
            compile_expression(a,t[1],context);
            a.push(")");
        }else if(op=="||"){
            compile_lambda_expression(a,t[1],t[2],context);
        }else if(op=="[]"){
            compile_list(a,t,context);
        }else if(op==":="){
            compile_assignment(a,t,context);
        }else if(op=="block"){
            compile_block(a,t,context);
        }else if(op=="if"){
            a.push("(");
            compile_expression(a,t[1],context);
            a.push("?");
            compile_expression(a,t[2],context);
            a.push(":");
            compile_expression(a,t[3],context);
            a.push(")");
        }else{
            compile_expression(a,op,context);
            compile_application(a,"",t,context);
        }
    }else{
        throw "panic";
    }
}

function compile(t,argv){
    var a = [];
    var local = Object.create(null);
    for(var i=0; i<argv.length; i++){
        local[argv[i]] = true;
    }
    var context = {
        pre: ["var power=Math.pow;"],
        local: local,
        statements: []
    };
    a.push("(function(){");
    a.push("return function("+argv.join(",")+"){");
    var statements_index = a.length;
    a.push("");
    a.push("return ");
    compile_expression(a,t,context);
    a.push(";};");
    a.push("})()");
    a[0] += context.pre.join("");
    if(context.statements.length>0){
        a[statements_index] = context.statements.join("");
    }
    // alert(a.join(""));
    return window.eval(a.join(""));
}

function compile_string(s,argv){
    var t = ast(s);
    return compile(t,argv);
}

function new_point(gx){
    var w = gx.w;
    var h = gx.h;
    var mx = gx.mx;
    var my = gx.my;
    var data = gx.data;
    var floor = Math.floor;
    var pset = function(color,x,y){
        if(x>=0 && x<w && y>=0 && y<h){
            var i = (x+y*w)*4;
            data[i+0] = color[0];
            data[i+1] = color[1];
            data[i+2] = color[2];
            data[i+3] = color[3];
        }
    };
    var pset4 = function(color,x,y){
        pset(color,x,y);
        pset(color,x+1,y);
        pset(color,x,y+1);
        pset(color,x+1,y+1);
    };
    
    var pseta = function(color,x,y,a){
        if(x>=0 && x<w && y>=0 && y<h){
            var i = (x+y*w)*4;
            data[i+0] = data[i+0]+Math.floor((color[0]-data[i+0])*a/255);
            data[i+1] = data[i+1]+Math.floor((color[1]-data[i+1])*a/255);
            data[i+2] = data[i+2]+Math.floor((color[2]-data[i+2])*a/255);
            data[i+3] = Math.max(data[i+3],Math.round(color[3]*a/255));
        }
    }
    var fade = function(x){
        return Math.exp(-0.4*x*x*x);
    };
    var psetdiff = function(color,rx,ry,px,py){
        var dx = Math.abs(px-rx);
        var dy = Math.abs(py-ry);
        var d = Math.sqrt(dx*dx+dy*dy);
        pseta(color,px,py,255*fade(d));
    };
    var fpsets = function(color,rx,ry){
        var px = Math.floor(rx);
        var py = Math.floor(ry);
        for(var i=-2; i<=2; i++){
            for(var j=-2; j<=2; j++){
                psetdiff(color,rx,ry,px+i,py+j);
            }
        }
    };
    var spoint = function(color,x,y){
        var rx = gx.w2+mx*x;
        var ry = gx.h2-my*y;
        fpsets(color,rx,ry);
    };
    var point = function(color,x,y){
        var px = floor(gx.w2+mx*x);
        var py = floor(gx.h2-my*y);
        pset4(color,px,py);
    };
    var hline = function(gx,y){
        var py = Math.floor(h/2-my*y);
        var color = gx.color;
        for(var px=0; px<w; px++){
            pset4(color,px,py);
        }
    };
    var vline = function(gx,x){
        var px = Math.floor(w/2+mx*x);
        var color = gx.color;
        for(var py=0; py<h; py++){
            pset4(color,px,py);
        }
    };
    var vspine = function(gx,py0,x){
        var px = Math.floor(w/2+mx*x);
        var color = gx.color;
        for(var py=py0-4; py<py0+5; py++){
            pset4(color,px,py);
        }
    }
    var hspine = function(gx,px0,y){
        var py = Math.floor(h/2-my*y);
        var color = gx.color;
        for(var px=px0-4; px<px0+5; px++){
            pset4(color,px,py);
        }
    };

    gx.pset = pset;
    gx.pset4 = pset4;
    gx.point = point;
    gx.spoint = spoint;
    gx.hline = hline;
    gx.vline = vline;
    gx.hspine = hspine;
    gx.vspine = vspine;
}

function init(canvas,w,h){
    var gx = {};
    gx.canvas = canvas;
    gx.context = canvas.getContext("2d");
    gx.context.font = "16px \"DejaVu Sans\", \"Verdana\", \"sans-serif\"";
    gx.context.fillStyle = "#404040";
    gx.context.clearRect(0,0,w,h);
    gx.img = gx.context.createImageData(w,h);
    gx.data = gx.img.data;
    gx.w=w; gx.h=h;
    gx.w2=w/2; gx.h2=h/2;
    gx.color = [0,0,0,255];
    /* gx.mx = 36; */
    if(w<900){
        if(w<400){
            gx.mx = w/1300*110;
        }else{
            gx.mx = w/1300*65;
        }
    }else{
        gx.mx = w/1300*50;
    }
    gx.my = gx.mx;
    return gx;
}


function get_value(id){
    return document.getElementById(id).value;
}

function system(gx){
    gx.color = [20,20,0,32];
    var ycount = Math.ceil(0.5*gx.h/gx.mx);
    var xcount = Math.ceil(0.5*gx.w/gx.mx);
    for(var y=1; y<ycount; y++){
        gx.hline(gx,y);
        gx.hline(gx,-y);
    }
    for(var x=1; x<xcount; x++){
        gx.vline(gx,x);
        gx.vline(gx,-x);
    }
    gx.color = [0,0,0,100];
    gx.hline(gx,0);
    gx.vline(gx,0);
    var px0 = Math.floor(0.5*gx.w);
    var py0 = Math.floor(0.5*gx.h);
    for(var y=1; y<ycount; y++){
        gx.hspine(gx,px0,y);
        gx.hspine(gx,px0,-y);    
    }
    for(var x=1; x<xcount; x++){
        gx.vspine(gx,py0,x);
        gx.vspine(gx,py0,-x);    
    }
}

function float_str(x){
    if(x<0){
        return "\u2212"+Math.abs(x).toString();
    }else{
        return x.toString();
    }
}

function labels(gx){
    var context = gx.context;
    var px0 = Math.floor(0.5*gx.w);
    var py0 = Math.floor(0.5*gx.h);
    var ycount = Math.ceil(0.5*gx.h/gx.mx);
    var xcount = Math.ceil(0.5*gx.w/gx.mx);
    var px,py;
    for(var x=1; x<xcount; x++){
        px = Math.floor(gx.w/2+gx.mx*x);
        context.fillText(float_str(x),px-5,py0+22);
        px = Math.floor(gx.w/2-gx.mx*x);
        context.fillText(float_str(-x),px-5,py0+22);
    }
    for(var y=1; y<ycount; y++){
        py = Math.floor(gx.h/2-gx.mx*y);
        context.fillText(float_str(y),px0+14,py+6);
        py = Math.floor(gx.h/2+gx.mx*y);
        context.fillText(float_str(-y),px0+14,py+6);
    }
}

function sleep(ms){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,ms);
    });
}

function new_system(){
    var canvas = document.getElementById("canvas1");
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    var gx = init(canvas,w,h);
    new_point(gx);
    system(gx);
    gx.context.putImageData(gx.img,0,0);
    return gx;
}

var busy;
var cancel_stack;

function cancel(id,index,cancel_stack){
    return (index>=cancel_stack.length ||
      !Object.is(id,cancel_stack[index]));
}

async function fplot(gx,f,d,cond,color){
    var id = {};
    var index = cancel_stack.length;
    cancel_stack.push(id);
    busy = true;
    var spoint = gx.spoint;
    var wx = 0.5*gx.w/gx.mx;
    var k=0;
    for(var x=-wx; x<wx; x+=d){
        var y = f(x);
        spoint(color,x,y);
        if(cancel(id,index,cancel_stack)) return;
        if(cond && k==10000){
            k=0;
            await sleep(20);
        }else{
            k++;
        }
    }
    gx.context.putImageData(gx.img,0,0);
    labels(gx);
    busy = false;
}

async function plot_zero_set(gx,f,n,cond,color){
    var id = {};
    var index = cancel_stack.length;
    cancel_stack.push(id);
    busy = true;
    var wx = 0.5*gx.w/gx.mx;
    var wy = 0.5*gx.h/gx.mx;
    var d = 0.01;
    var k=0;
    for(var x=-wx; x<wx; x+=d){
        var a = zeroes_bisection(function(y){return f(x,y);},-wy,wy,n);
        for(var i=0; i<a.length; i++){
            gx.spoint(color,x,a[i]);
        }
        if(cancel(id,index,cancel_stack)) return;
        if(cond && k%100==0){
            await sleep(20);
        }
        k++;
    }
    for(var y=-wy; y<wy; y+=d){
        var a = zeroes_bisection(function(x){return f(x,y);},-wx,wx,n);
        for(var i=0; i<a.length; i++){
            gx.spoint(color,a[i],y);
        }
        if(cancel(id,index,cancel_stack)) return;
        if(cond && k%100==0){
            await sleep(20);
        }
        k++;
    }
    gx.context.putImageData(gx.img,0,0);
    labels(gx);
    busy = false;
}

async function plot_async(gx,f,color){
    fplot(gx,f,0.01,false,color);
    while(busy){await sleep(40);}
    await sleep(40);
    fplot(gx,f,0.001,true,color);
    fplot(gx,f,0.0001,true,color);
}

async function plot_zero_set_async(gx,f,color){
    plot_zero_set(gx,f,10,false,color);
    while(busy){await sleep(40);}
    await sleep(40);
    plot_zero_set(gx,f,400,true,color);
}

function contains_variable(t,v){
    if(Array.isArray(t)){
        for(var i=0; i<t.length; i++){
            if(contains_variable(t[i],v)) return true;
        }
        return false;
    }else{
        return t===v;
    }
}

function plot_node(gx,t,color){
    var f;
    if(Array.isArray(t) && t[0]==="="){
        if(t[1]==="y" && !contains_variable(t[2],"y")){
            f = compile(t[2],["x"]);
            plot_async(gx,f,color);
        }else{
            t = ["-",t[1],t[2]];
            f = compile(t,["x","y"]);
            plot_zero_set_async(gx,f,color);
        }
    }else{
        f = compile(t,["x"]);
        plot_async(gx,f,color);
    }
}

var color_table = [
    [0,0,140,255],
    [0,100,0,255],
    [140,0,140,255],
    [0,140,140,255],
    [100,80,0,255]
];

function global_definition(t){
    if(Array.isArray(t[1])){
        var app = t[1];
        var value = compile(t[2],app.slice(1));
        ftab[app[0]] = value;
    }else{
        var value = compile(t[2],[]);
        ftab[t[1]] = value();
    }
}

function plot(gx){
    cancel_stack = [];
    var color_index = 0;
    var input = get_value("inputf");
    if(input.length>0){
        var t = ast(input);
        if(Array.isArray(t) && t[0]==="block"){
            for(var i=1; i<t.length; i++){
                if(Array.isArray(t[i]) && t[i][0]===":="){
                    global_definition(t[i]);
                }else{
                    plot_node(gx,t[i],color_table[color_index]);
                    color_index = (color_index+1)%color_table.length;
                }
            }
        }else{
            plot_node(gx,t,color_table[0]);
        }
    }
}

function calc(){
    var input = get_value("inputf");
    var out = document.getElementById("out");
    try{
        var t = ast(input);
        var f = compile(t,["x"]);
        out.innerHTML = "<p><code>"+JSON.stringify(t)+"</code>";
        var t0 = performance.now();
        out.innerHTML += "<p><code>"+f(0)+"</code>";
        var t1 = performance.now();
        out.innerHTML += "<p><code>time: "+(t1-t0)+"ms</code>";
    }catch(e){
        if(e instanceof ErrSyntax){
            out.innerHTML = "<code>"+e.text+"</code>";
        }else{
            throw e;
        }
    }
}

function main(){
    var out = document.getElementById("out");
    out.innerHTML = "";
    // calc();
    try{
        var gx = new_system();
        plot(gx);
    }catch(e){
        if(e instanceof Err){
            out.innerHTML = e.text;
        }else{
            throw e;
        }
    }
}

function keys(event){
    if(event.keyCode==13) main();
}

function query(href){
    var a = href.split("?");
    if(a.length>1){
        var input = document.getElementById("inputf");
        input.value = a[1];
        main();
    }
}

window.onload = function(){
    var gx = new_system();
    labels(gx);
    query(window.location.href);
};
