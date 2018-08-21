
"use strict";

var diff = diffh(0.001);
var diff_operator = diffh_curry(0.001);
var graphics;
var ax=1;
var ay=1;
var xscale = {index: 10000};
var yscale = {index: 10000};
var hud_display = false;
var GAMMA = 0.57721566490153286;

var ftab = {
    pi: Math.PI, tau: 2*Math.PI, e: Math.E, nan: NaN,
    deg: Math.PI/180, grad: Math.PI/180, gon: Math.PI/200,
    gc: GAMMA, angle: angle, t0: 0, t1: 2*Math.PI,
    abs: Math.abs, sgn: Math.sign, sign: Math.sign,
    max: Math.max, min: Math.min, clamp: clamp,
    hypot: Math.hypot, floor: Math.floor, ceil: Math.ceil,
    div: div, mod: mod, diveuc: diveuc, modeuc: modeuc,
    divtrunc: divtrunc, modtrunc: modtrunc,
    rd: Math.round, trunc: Math.trunc, frac: frac,
    sqrt: Math.sqrt, cbrt: cbrt, root: root, expm1: Math.expm1,
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
    gamma: gamma2, fac: fac, rf: rfac, ff: ffac,
    Gamma: Gamma, erf: erf, En: En, Ei: Ei, li: li, Li: Li,
    diff: diff, int: integral, D: diff, Dop: diff_operator,
    pow: pow, sum: sum, prod: prod,
    rand: rand, rng: rand, tg: tg, range: range,
    inv: invab, agm: agm,
    E: eiE, K: eiK, F: eiF, Pi: eiPi,
    RF: RF, RC: RC, RJ: RJ, RD: RD,
    P: set_position, scale: set_scale,
    zeroes: zeroes
};

function rand(a,b){
    if(a==undefined){
        return Math.random();
    }else if(b==undefined){
        var index = Math.floor(Math.random()*a.length);
        return a[index];
    }else{
        return a+Math.random()*(b-a);
    }
}

function range(a,b,step){
    if(step==undefined){
        var y = [];
        for(var i=a; i<=b; i++){
            y.push(i);
        }
        return y;
    }else{
        var y = [];
        for(var i=a; i<=b; i+=step){
            y.push(i);
        }
        return y;
    }
}

function tg(f,a,x){
    return f(a)+diff(f,a)*(x-a);
}

function sum(a,b,f){
    var y = 0;
    for(var i=a; i<=b; i++){
        y += f(i);
    }
    return y;
}

function prod(a,b,f){
    var y = 1;
    for(var i=a; i<=b; i++){
        y *= f(i);
    }
    return y;
}

function diffh(h){
    return function diff(f,x,n){
        if(n==undefined || n==1){
            return (f(x-2*h)-8*f(x-h)+8*f(x+h)-f(x+2*h))/(12*h);
        }else{
            return (diff(f,x+h,n-1)-diff(f,x-h,n-1))/(2*h);
        }
    };
}

function diffh_curry(h){
    var diff = diffh(h);
    return function(f,n){
        return function(x){return diff(f,x,n);};
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

function pow(f,n,x){
    for(var i=0; i<n; i++){
        x = f(x);
    }
    return x;
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

function fac(x){
    return gamma(x+1);
}

function ffac(n,k){
    return gamma(n+1)/gamma(n-k+1)
}

function rfac(n,k){
    return gamma(n+k)/gamma(n);
}

function cbrt(x){
    return Math.pow(x,1/3);
}

function root(n,x){
    return Math.pow(x,1/n);
}

function frac(x){
    return x-Math.floor(x);
}

function div(x,m){
    return Math.floor(x/m);
}

function mod(x,m){
    return x-m*Math.floor(x/m);
}

function diveuc(x,m){
    return Math.sign(m)*Math.floor(x/Math.abs(m));
}

function modeuc(x,m){
    return mod(x,Math.abs(m));
}

function divtrunc(x,m){
    return Math.trunc(x/m);
}

function modtrunc(x,m){
    return x-m*Math.trunc(x/m);
}

function angle(x,y){
    return Math.atan2(y,x);
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
    if(Math.abs(f(m)-x)>1E-6) return NaN;
    return m;
}

function zeroes_push(a,x){
    var n = a.length;
    if(n==0 || Math.abs(a[n-1]-x)>1E-10){
        a.push(x);
    }
}

function zeroes_bisection(f,a,b,n){
    var zeroes = [];
    var h = (b-a)/n;
    var x0,x1,y0,y1,z;
    for(var k=0; k<n; k++){
        x0 = a+h*k;
        x1 = a+h*(k+1);
        y0 = f(x0);
        y1 = f(x1);
        if(Number.isNaN(y1-y0)) continue;
        if(Math.sign(y0)!=Math.sign(y1)){
            if(y0==0){
                zeroes_push(zeroes,x0);
            }else{
                z = invab(f,0,x0,x1);
                if(Number.isFinite(z)){
                    zeroes_push(zeroes,z);
                }
            }
        }
    }
    return zeroes;
}

function zeroes(f,a,b){
    if(a==undefined) a=-100;
    if(b==undefined) b=100;
    return zeroes_bisection(f,a,b,10000);
}

// Arithmetic-geometric mean
function agm(a,b){
    var ah,bh;
    for(var i=0; i<20; i++){
        ah = (a+b)/2;
        bh = Math.sqrt(a*b);
        a=ah; b=bh;
        if(Math.abs(a-b)<1E-15) break;
    }
    return a;
}

// Modified arithmetic-geometric mean, see
// Semjon Adlaj: "An eloquent formula for the perimeter
// of an ellipse", Notices of the AMS 59(8) (2012), p. 1094-1099
function magm(x,y){
    var z=0;
    var xh,yh,zh,r;
    for(var i=0; i<20; i++){
        xh=0.5*(x+y);
        r=Math.sqrt((x-z)*(y-z));
        yh=z+r; zh=z-r;
        x=xh; y=yh; z=zh;
        if(Math.abs(x-y)<2E-15) break;
    }
    return x;
}

function eiK(m){
    return 0.5*Math.PI/agm(1,Math.sqrt(1-m));
}

function eiE1(m){
    var M = agm(1,Math.sqrt(1-m));
    var N = magm(1,1-m);
    return 0.5*Math.PI*N/M;
}

function RF(x,y,z){
    var xk=x, yk=y, zk=z;
    var a;
    for(var k=0; k<26; k++){
        a = Math.sqrt(xk*yk)+Math.sqrt(xk*zk)+Math.sqrt(yk*zk);
        xk=(xk+a)/4; yk=(yk+a)/4; zk=(zk+a)/4;
    }
    return 1/Math.sqrt(xk);
}

function RC(x,y){
    return RF(x,y,y);
}

function RJ(x,y,z,p){
    var xk=x, yk=y, zk=z, pk=p;
    var n,s,a,d,e,sx,sy,sz,sp,delta;
    delta=(p-x)*(p-y)*(p-z);
    s=0; n=12;
    for(var k=0; k<n; k++){
        sx=Math.sqrt(xk); sy=Math.sqrt(yk);
        sz=Math.sqrt(zk); sp=Math.sqrt(pk);
        a = sx*sy+sx*sz+sy*sz;
        d=(sp+sx)*(sp+sy)*(sp+sz);
        e=Math.pow(4,-3*k)/(d*d)*delta;
        xk=(xk+a)/4; yk=(yk+a)/4; zk=(zk+a)/4; pk=(pk+a)/4;
        s+=Math.pow(4,-k)/d*RC(1,1+e);
    }
    return Math.pow(xk,-3/2)*Math.pow(4,-n)+6*s;
}

function RD(x,y,z){
    return RJ(x,y,z,z);
}

function eiF(phi,m){
    var s = Math.sin(phi);
    var c = Math.cos(phi);
    return s*RF(c*c,1-m*s*s,1);
}

function eiE2(phi,m){
    var s = Math.sin(phi);
    var c = Math.cos(phi);
    return s*RF(c*c,1-m*s*s,1)-1/3*m*s*s*s*RJ(c*c,1-m*s*s,1,1);
}

function eiPi(phi,n,m){
    var s = Math.sin(phi);
    var c = Math.cos(phi);
    return s*RF(c*c,1-m*s*s,1)+1/3*n*s*s*s*RJ(c*c,1-m*s*s,1,1-n*s*s);
}

function eiE(x,y){
    if(y===undefined){
        return eiE1(x);
    }else{
        return eiE2(x,y);
    }
}

function cfGamma(a,x,n){
    var y=0;
    for(var k=n; k>=1; k--){
        y = k*(k-a)/(x-y-a+2*k+1);
    }
    return Math.exp(-x)*Math.pow(x,a)/(x-y-a+1);
}

function psgamma(a,x,n){
    var y=0;
    var p=1/a;
    for(var k=1; k<n; k++){
        y += p;
        p = p*x/(a+k);
    }
    return y*Math.exp(-x)*Math.pow(x,a);
}

function igamma(a,x){
    if(x>a+1){
        return gamma(a)-cfGamma(a,x,20);
    }else{
        return psgamma(a,x,20);
    }
}

function iGamma(a,x){
    if(x>a+1){
        return cfGamma(a,x,20);
    }else{
        if(a==0) a=1E-6;
        return gamma(a)-psgamma(a,x,20);
    }
}

function gamma2(x,y){
    if(y==undefined){
        return gamma(x);
    }else{
        return igamma(x,y);
    }
}

function Gamma(x,y){
    if(y===undefined){
        return gamma(x);
    }else{
        return iGamma(x,y);
    }
}

function erf(x){
    if(Math.abs(x)>8) return Math.sign(x);
    var y;
    if(Math.abs(x)>1.7){
        y = Math.sqrt(Math.PI)-cfGamma(0.5,x*x,26);
    }else{
        y = psgamma(0.5,x*x,26);
    }
    return Math.sign(x)*y/Math.sqrt(Math.PI);
}

function erfc(x){
    return 1-erf(x);
}

function norm(x){
    return 0.5+0.5*erf(x/Math.SQRT2);
}

function En(n,x){
    return Math.pow(x,n-1)*iGamma(1-n,x);
}

function Ei(x){
    var s=0;
    var p=1;
    for(var k=1; k<80; k++){
        p = p*x/k;
        s += p/k;
    }
    return GAMMA+Math.log(Math.abs(x))+s;
}

function li(x){
    return Ei(Math.log(x));
}

function Li(x){
    return li(x)-li(2);
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

function str(x){
    if(Array.isArray(x)){
        return "["+x.map(str).join(", ")+"]";
    }else if(x instanceof Function){
        return "a function";
    }else{
        return JSON.stringify(x);
    }
}

function log(s){
    var out = document.getElementById("out");
    out.innerHTML = "<p><code>"+str(s)+"</code>";
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
        }else if(s[i]=='\u00b0'){
            a.push([Symbol,"*",line,col]);
            a.push([SymbolIdentifier,"deg",line,col]);
            i++; col++;
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

function index_operation(i,x){
    var y = expression(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && t[1]==']'){
        i.index++;
        return ["index",x,y];
    }else{
        syntax_error(i,"expected ']'.");
    }
}

function application(i){
    var x = atom(i);
    while(1){
        var t = i.a[i.index];
        if(t[0]==Symbol && t[1]=='('){
            i.index++;
            x = application_list(i,[x],')');
        }else if(t[0]==Symbol && t[1]=='['){
            i.index++;
            x = index_operation(i,x);
        }else if(t[0]==Symbol && t[1]=="'"){
            var count = 0;
            while(1){
                t = i.a[i.index];
                if(t[0]==Symbol && t[1]=="'"){
                    count++;
                    i.index++;
                }else break;
            }
            var t = i.a[i.index];
            if(t[0]==Symbol && t[1]=='('){
                var y = atom(i);
                if(count==1){
                    x = ["diff",x,y];
                }else{
                    x = ["diff",x,y,count];
                }
            }else{
                x = ["Dop",x,count];
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

function range_expression(i){
    var x = addition(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && t[1]==':'){
        i.index++;
        var y = addition(i);
        t = i.a[i.index];
        if(t[0]==Symbol && t[1]==':'){
            i.index++;
            var z = addition(i);
            return ["range",x,y,z];
        }else{
            return ["range",x,y];
        }
    }else{
        return x;
    }
}

function comparison(i){
    var x = range_expression(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && (
       t[1]=="<"  || t[1]==">" || t[1]=="<=" ||
       t[1]==">=" || t[1]=="=" || t[1]=="!="
    )){
        i.index++;
        var y = range_expression(i);
        return [t[1],x,y];
    }else{
        return x;
    }
}

function conjunction(i){
    var x = comparison(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && t[1]=='&'){
        i.index++;
        var y = comparison(i);
        return ["&",x,y];
    }else{
        return x;
    }
}

function disjunction(i){
    var x = conjunction(i);
    var t = i.a[i.index];
    if(t[0]==Symbol && t[1]=='|'){
        i.index++;
        var y = conjunction(i);
        return ["|",x,y];
    }else{
        return x;
    }
}

function expression(i){
    return disjunction(i);
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
        }else if(op=="&" || op=="|"){
            a.push("(");
            compile_expression(a,t[1],context);
            a.push(op+op);
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
        }else if(op=="index"){
            compile_expression(a,t[1],context);
            a.push("[");
            compile_expression(a,t[2],context);
            a.push("]");
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
        var rx = gx.px0+mx*x;
        var ry = gx.py0-my*y;
        fpsets(color,rx,ry);
    };
    var point = function(color,x,y){
        var px = floor(gx.w2+mx*x);
        var py = floor(gx.h2-my*y);
        pset4(color,px,py);
    };
    var hline = function(gx,py0,y){
        var py = py0-Math.floor(my*y);
        var color = gx.color;
        for(var px=0; px<w; px++){
            pset4(color,px,py);
        }
    };
    var vline = function(gx,px0,x){
        var px = px0+Math.floor(mx*x);
        var color = gx.color;
        for(var py=0; py<h; py++){
            pset4(color,px,py);
        }
    };
    var vspine = function(gx,px0,py0,x){
        var px = px0+Math.floor(mx*x);
        var color = gx.color;
        for(var py=py0-4; py<py0+5; py++){
            pset4(color,px,py);
        }
    }
    var hspine = function(gx,px0,py0,y){
        var py = py0-Math.floor(my*y);
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
    gx.px0 = Math.floor(0.5*gx.w);
    gx.py0 = Math.floor(0.5*gx.h);
    gx.color = [0,0,0,255];
    /* gx.mx = 36; */
    if(w<600){
        gx.mx = w/1300*110;
    }else if(w<800){
        gx.mx = w/1300*72.5;
    }else if(w<1000){
        gx.mx = w/1300*65;
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
    var px0 = gx.px0;
    var py0 = gx.py0;
    var xcount = Math.ceil(0.5*gx.w/gx.mx)+1;
    var ycount = Math.ceil(0.5*gx.h/gx.mx)+1;
    var xshift = Math.round((0.5*gx.w-px0)/gx.mx);
    var yshift = -Math.round((0.5*gx.h-py0)/gx.mx);

    gx.color = [0,0,0,28];
    for(var y=0; y<ycount; y++){
        gx.hline(gx,py0,yshift+y);
        gx.hline(gx,py0,yshift-y);
    }
    for(var x=0; x<xcount; x++){
        gx.vline(gx,px0,xshift+x);
        gx.vline(gx,px0,xshift-x);
    }
    gx.color = [0,0,0,100];
    gx.hline(gx,py0,0);
    gx.vline(gx,px0,0);
    for(var y=yshift-ycount; y<=yshift+ycount; y++){
        if(y!=0){
            gx.hspine(gx,px0,py0,y);
        }
    }
    for(var x=xshift-xcount; x<=xshift+xcount; x++){
        gx.vspine(gx,px0,py0,x);
    }
}

function float_str(x){
    if(x<0){
        return "\u2212"+Math.abs(x).toString();
    }else{
        return x.toString();
    }
}

function clamp(x,a,b){
    return Math.min(Math.max(x,a),b);
}

function labels(gx){
    var context = gx.context;
    var w = gx.w;
    var h = gx.h;
    var px0 = gx.px0;
    var py0 = gx.py0;
    var ycount = Math.ceil(0.5*gx.h/gx.mx);
    var xcount = Math.ceil(0.5*gx.w/gx.mx);
    var xshift = Math.round((0.5*gx.w-px0)/gx.mx);
    var yshift = Math.round((0.5*gx.h-py0)/gx.mx);
    var px,py,s,px_adjust,py_adjust;
    context.textAlign = "center";
    for(var x=xshift-xcount; x<=xshift+xcount; x++){
        if(x!=0){
            px = px0+Math.floor(gx.mx*x);
            s = float_str(x/ax);
            if(s.length>3 && x%2==0){py_adjust=40;} else{py_adjust=22;}
            if(x/ax<0){px_adjust=4;} else{px_adjust=-1;}
            context.fillText(s,px-px_adjust,clamp(py0,10,h-44)+py_adjust);
        }
    }
    context.textAlign = "right";
    for(var y=yshift-ycount; y<=yshift+ycount; y++){
        if(y!=0){
            py = py0+Math.floor(gx.mx*y);
            s = float_str(-y/ay);
            context.fillText(s,clamp(px0-10,28+10*(s.length-2),w-16),py+6);
        }
    }
}

function sleep(ms){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,ms);
    });
}

function clear(gx){
    var data = gx.data;
    var w = gx.w;
    var h = gx.h;
    var n = 4*w*h;
    for(var i=0; i<n; i+=4){
        data[i] = 0;
        data[i+1] = 0;
        data[i+2] = 0;
        data[i+3] = 0;
    }
}

function flush(gx){
    gx.context.putImageData(gx.img,0,0);
}

var clientXp=0;
var clientYp=0;
var moved = false;

function mouse_move_handler(e){
    if(e.buttons==1){
        moved = true;
        var gx = graphics;
        pid_stack = [];
        var dx = e.clientX-clientXp;
        var dy = e.clientY-clientYp;
        gx.px0 = gx.px0+dx;
        gx.py0 = gx.py0+dy;
        clientXp = e.clientX;
        clientYp = e.clientY;
        clear(gx);
        system(gx);
        flush(gx);
        labels(gx);
    }else{
        clientXp = e.clientX;
        clientYp = e.clientY;
    }
}

function mouse_up_handler(e){
    if(moved){
        update(graphics);
        moved = false;
    }
}

function new_system(last_gx){
    var canvas = document.getElementById("canvas1");
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    var gx = init(canvas,w,h);
    new_point(gx);
    if(last_gx!==undefined){
        gx.px0 = last_gx.px0;
        gx.py0 = last_gx.py0;
    }else{
        canvas.addEventListener("mousemove", mouse_move_handler, false);
        canvas.addEventListener("mouseup", mouse_up_handler, false);
    }
    system(gx);
    flush(gx);

    return gx;
}

var busy;
var pid_stack;

function cancel(pid,index,pid_stack){
    return (index>=pid_stack.length ||
      !Object.is(pid,pid_stack[index]));
}

async function fplot(gx,f,d,cond,color){
    var pid = {};
    var index = pid_stack.length;
    pid_stack.push(pid);
    busy = true;
    var spoint = gx.spoint;
    var wx = 0.5*gx.w/gx.mx/ax;
    var x0 = (0.5*gx.w-gx.px0)/gx.mx/ax;
    var k=0;
    d = d/ax;
    for(var x=x0-wx; x<x0+wx; x+=d){
        var y = f(x);
        spoint(color,ax*x,ay*y);
        if(cond && k==4000){
            k=0;
            await sleep(10);
        }else{
            k++;
        }
        if(cancel(pid,index,pid_stack)) return;
    }
    flush(gx);
    labels(gx);
    busy = false;
}

async function plot_zero_set(gx,f,n,cond,color){
    var pid = {};
    var index = pid_stack.length;
    pid_stack.push(pid);
    busy = true;
    var wx = 0.5*gx.w/gx.mx/ax;
    var wy = 0.5*gx.h/gx.mx/ay;
    var x0 = (0.5*gx.w-gx.px0)/gx.mx/ax;
    var y0 = -(0.5*gx.h-gx.py0)/gx.mx/ay;
    var xa = x0-wx;
    var xb = x0+wx;
    var ya = y0-wy;
    var yb = y0+wy;
    var d = 0.01/ax;
    var k=0;
    for(var x=xa; x<xb; x+=d){
        var a = zeroes_bisection(function(y){return f(x,y);},ya,yb,n);
        for(var i=0; i<a.length; i++){
            gx.spoint(color,ax*x,ay*a[i]);
        }
        if(cond && k%100==0){
            await sleep(20);
        }
        if(cancel(pid,index,pid_stack)) return;
        k++;
    }
    for(var y=ya; y<yb; y+=d){
        var a = zeroes_bisection(function(x){return f(x,y);},xa,xb,n);
        for(var i=0; i<a.length; i++){
            gx.spoint(color,ax*a[i],ay*y);
        }
        if(cond && k%100==0){
            await sleep(20);
        }
        if(cancel(pid,index,pid_stack)) return;
        k++;
    }
    flush(gx);
    labels(gx);
    busy = false;
}

async function vplot(gx,f,d,cond,color){
    var pid = {};
    var index = pid_stack.length;
    pid_stack.push(pid);
    busy = true;
    var spoint = gx.spoint;
    var k=0;
    var t0 = ftab.t0;
    var t1 = ftab.t1;
    for(var t=t0; t<t1; t+=d){
        var v = f(t);
        spoint(color,ax*v[0],ay*v[1]);
        if(cond && k==4000){
            k=0;
            await sleep(10);
        }else{
            k++;
        }
        if(cancel(pid,index,pid_stack)) return;
    }
    flush(gx);
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

async function vplot_async(gx,f,color){
    vplot(gx,f,0.01,false,color);
    while(busy){await sleep(40);}
    await sleep(40);
    vplot(gx,f,0.001,true,color);
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
    }else if(Array.isArray(t) && t[0]==="[]"){
        f = compile(t,["t"]);
        vplot_async(gx,f,color);
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

function eval_statements(s){
    var t = ast(s);
    var value;
    if(Array.isArray(t) && t[0]==="block"){
        for(var i=1; i<t.length; i++){
            value = compile(t[i],[]);
            value();
        }
    }else{
        value = compile(t,[]);
        value();
    }
}

function process_statements(a){
    if(a.length>1){
        if(a.length>2){
            eval_statements(a[2]);
            var inputf = document.getElementById("inputf");
            inputf.value = a[0];
            if(a[1].length>0) inputf.value += ";"+a[1];
        }
        if(a[1].length>0){
            eval_statements(a[1]);
        }
    }
}

function plot(gx){
    var color_index = 0;
    var input = get_value("inputf").trim();
    var a = input.split(";");
    process_statements(a);
    pid_stack = [];

    clear(gx);
    system(gx);
    flush(gx);
    labels(gx);

    if(input.length>0){
        var t = ast(a[0]);
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
            if(Array.isArray(t) && t[0]===":="){
                global_definition(t);
            }else{
                plot_node(gx,t,color_table[0]);
            }
        }
    }
}

function calc(){
    var input = get_value("input-calc");
    var out = document.getElementById("calc-out");
    try{
        var t = ast(input);
        var value = compile(t,[]);
        // out.innerHTML = "<p><code>"+str(t)+"</code>";
        // var t0 = performance.now();
        out.innerHTML = "<p><code>= "+str(value())+"</code>";
        // var t1 = performance.now();
        // out.innerHTML += "<p><code>time: "+(t1-t0)+"ms</code>";
    }catch(e){
        if(e instanceof Err){
            out.innerHTML = "<p><code>"+e.text+"</code>";
        }else{
            throw e;
        }
    }
}

function get_pos(gx){
    return [
        (0.5*gx.w-gx.px0)/gx.mx/ax,
        -(0.5*gx.h-gx.py0)/gx.mx/ay
    ];
}

function set_pos(gx,t){
    var x = t[0];
    var y = t[1];
    gx.px0 = Math.round(0.5*gx.w-x*ax*gx.mx);
    gx.py0 = Math.round(0.5*gx.h+y*ay*gx.mx);
}

function set_position(x,y){
    set_pos(graphics,[x,y]);
    return [x,y];
}

function set_scale(dx,dy){
    if(dy==undefined) dy=dx;
    var t = get_pos(graphics);
    ax = 1/dx;
    ay = 1/dy;
    set_pos(graphics,t);
    return [dx,dy];
}

function scale_inc(scale){
    var m;
    if(scale.index%3==2){
        m = 5/2;
    }else{
        m = 2;
    }
    scale.index++;
    var t = get_pos(graphics);
    if(scale===xscale){
        ax = Math.round(1E10*ax*m)/1E10;
    }else{
        ay = Math.round(1E10*ay*m)/1E10;
    }
    set_pos(graphics,t);
}

function scale_dec(scale){
    var m;
    if(scale.index%3==0){
        m = 5/2;
    }else{
        m = 2;
    }
    scale.index--;
    var t = get_pos(graphics);
    if(scale===xscale){
        ax = Math.round(1E10*ax/m)/1E10;
    }else{
        ay = Math.round(1E10*ay/m)/1E10;
    }
    set_pos(graphics,t);
}

function xyscale_inc(){
    scale_inc(xscale);
    scale_inc(yscale);
    update(graphics);
}

function xyscale_dec(){
    scale_dec(xscale);
    scale_dec(yscale);
    update(graphics);
}

function xscale_inc(){
    scale_inc(xscale);
    update(graphics);
}

function yscale_inc(){
    scale_inc(yscale);
    update(graphics);
}

function xscale_dec(){
    scale_dec(xscale);
    update(graphics);
}

function yscale_dec(){
    scale_dec(yscale);
    update(graphics);
}

function switch_hud(){
    var hud = document.getElementById("hud");
    if(hud_display){
        hud_display = false;
        hud.style.display = "none";
    }else{
        hud_display = true;
        hud.style.display = "block";
    }
}

function update(gx){
    var out = document.getElementById("out");
    out.innerHTML = "";
    // calc();
    try{
        plot(gx);
    }catch(e){
        if(e instanceof Err){
            out.innerHTML = "<br>"+e.text;
        }else{
            throw e;
        }
    }
}

function main(){
    var gx = new_system(graphics);
    graphics = gx;
    update(gx);
}

function keys(event){
    if(event.keyCode==13) main();
}

function keys_calc(event){
    if(event.keyCode==13) calc();
}

function decode_percent(s){
    var a = [];
    var n = s.length;
    var i = 0;
    while(i<n){
        if(i+2<n && s[i]=='%'){
            a.push(decodeURIComponent(s.slice(i,i+3)));
            i+=3;
        }else{
            a.push(s[i]);
            i++;
        }
    }
    return a.join("");
}

function query(href){
    var a = href.split("?");
    if(a.length>1){
        var input = document.getElementById("inputf");
        input.value = decode_percent(a[1]);
        main();
    }
}

window.onload = function(){
    var gx = new_system();
    graphics = gx;
    labels(gx);
    query(window.location.href);
};

