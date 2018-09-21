
"use strict";

var cdiff = cdiffh(0.001);

var cglobal_ftab = {
"+": "cadd", "-": "csub", "*": "cmul", "/": "cdiv",
"^": "cpow", "~": "cneg", "=": "ceq",
abs: "ccabs", arg: "ccarg", sgn: "csgn", conj: "conj",
re: "cre", im: "cim", Re: "cre", Im: "cim",
floor: "cfloor", ceil: "cceil", rd: "crd", frac: "cfrac",
exp: "cexp", sqrt: "csqrt", root: "croot", rt: "croot",
ln: "cln", lg: "clg", ld: "cld", lb: "cld", log: "clog",
sin: "csin", cos: "ccos", tan: "ctan", cot: "ccot",
sinh: "csinh", cosh: "ccosh", tanh: "ctanh", coth: "ccoth",
asin: "casin", acos: "cacos", atan: "catan", acot: "cacot",
arcsin: "casin", arccos: "cacos", arctan: "catan", arccot: "cacot",
asinh: "casinh", acosh: "cacosh", atanh: "catanh", acoth: "cacoth",
arsinh: "casinh", arcosh: "cacosh", artanh: "catanh", arcoth: "cacoth",
gamma: "cgamma", fac: "cfac", sum: "csum", prod: "cprod",
diff: "cdiff", int: "cint", pow: "citerate", img: "cplot_img"
};

var cftab = {
    pi: complex(Math.PI,0), tau: complex(2*Math.PI,0),
    e: complex(Math.E,0), i: complex(0,1), nan: complex(NaN,NaN),
    deg: complex(Math.PI/180,0), grad: complex(Math.PI/180,0),
    gon: complex(Math.PI/200,0), gc: complex(GAMMA,0)
};

ftab["colorfn"] = colorfn;

function complex(x,y){
    return {re: x, im: y};
}

function conj(z){
    return {re: z.re, im: -z.im};
}

function cabs(z){
    return Math.hypot(z.re,z.im);
}

function csgn(z){
    return cmulr(z,1/cabs(z));
}

function carg(z){
    return Math.atan2(z.im,z.re);
}

function carg_positive(z){
    var r = cabs(z);
    var phi = Math.atan2(z.im,z.re);
    return phi<0? phi+2*Math.PI: phi;
}

function ccabs(z){
    return {re: Math.hypot(z.re,z.im), im: 0};
}

function ccarg(z){
    return {re: Math.atan2(z.im,z.re), im: 0};
}

function cadd(a,b){
    return {re: a.re+b.re, im: a.im+b.im};
}

function csub(a,b){
    return {re: a.re-b.re, im: a.im-b.im};
}

function cmul(a,b){
    return {re: a.re*b.re-a.im*b.im, im: a.re*b.im+a.im*b.re};
}

function cdiv(a,b){
    var r = 1/(b.re*b.re+b.im*b.im);
    return {re: r*(a.re*b.re+a.im*b.im), im: r*(a.im*b.re-a.re*b.im)};
}

function crdiv(a,b){
    var r = a/(b.re*b.re+b.im*b.im);
    return {re: r*b.re, im: -r*b.im};
}

function cneg(a){return {re: -a.re, im: -a.im};}
function caddr(a,b){return {re: a.re+b, im: a.im};}
function csubr(a,b){return {re: a.re-b, im: a.im};}
function crsub(a,b){return {re: a-b.re, im: -b.im};}
function cmulr(a,b){return {re: a.re*b, im: a.im*b};}
function cre(z){return {re: z.re, im: 0};}
function cim(z){return {re: z.im, im: 0};}
function cfloor(z){return {re:Math.floor(z.re),im:Math.floor(z.im)};}
function cceil(z){return {re:Math.ceil(z.re),im:Math.ceil(z.im)};}
function crd(z){return {re:Math.round(z.re),im:Math.round(z.im)};}
function cfrac(z){return {re:frac(z.re),im:frac(z.im)};}

function cexp(z){
    var r = Math.exp(z.re);
    return {re: r*Math.cos(z.im), im: r*Math.sin(z.im)};
}

function cln(z){
    return {re: Math.log(cabs(z)), im: carg(z)};
}

function clg(z){
    return cmulr(cln(z),0.43429448190325176);
}

function cld(z){
    return cmulr(cln(z),1.4426950408889634);
}

function clog(z,b){
    return cdiv(cln(z),cln(b));
}

function cpow(a,b){
    if(a.re==0 && a.im==0){
        if(b.re==0 && b.im==0){
            return {re: 1, im: 0};
        }else{
            return {re: 0, im: 0};
        }
    }else{
        var lnr = 0.5*Math.log(a.re*a.re+a.im*a.im);
        var phi = Math.atan2(a.im,a.re);
        var r1 = Math.exp(lnr*b.re-phi*b.im);
        var phi1 = lnr*b.im+phi*b.re;
        return {re: r1*Math.cos(phi1), im: r1*Math.sin(phi1)};
    }
}

function cpow2(z){
    return {re: z.re*z.re-z.im*z.im, im: 2*z.re*z.im};
}

function cpown(z,n){
    var y = z;
    n--;
    while(n>0){
        if(n%2==0){
            n/=2; z = cpow2(z);
        }else{
            n--; y = cmul(y,z);
        }
    }
    return y;
}

function csqrt(z){
    return cexp(cmulr(cln(z),0.5));
}

function croot(n,z){
    return cexp(cmul(cln(z),crdiv(1,n)));
}

function csin(z){
    var c = Math.cos(z.re);
    var s = Math.sin(z.re);
    var p = 0.5*Math.exp(z.im);
    var q = 0.5*Math.exp(-z.im);
    return {re: (p+q)*s, im: (p-q)*c};
}

function ccos(z){
    var c = Math.cos(z.re);
    var s = Math.sin(z.re);
    var p = 0.5*Math.exp(-z.im);
    var q = 0.5*Math.exp(z.im);
    return {re: (p+q)*c, im: (p-q)*s};
}

function ctan(z){
    return cdiv(csin(z),ccos(z));
}

function ccot(z){
    return cdiv(ccos(z),csin(z));
}

function csinh(z){
    return cmulr(csub(cexp(z),cexp(cneg(z))),0.5);
}

function ccosh(z){
    return cmulr(cadd(cexp(z),cexp(cneg(z))),0.5);
}

function ctanh(z){
    return cdiv(csinh(z),ccosh(z));
}

function ccoth(z){
    return cdiv(ccosh(z),csinh(z));
}

function casin(z){
    var a = csqrt(crsub(1,cmul(z,z)));
    var b = cadd(cmul({re:0,im:1},z),a);
    return cmul({re:0,im:-1},cln(b));
}

function cacos(z){
    var a = csqrt(crsub(1,cmul(z,z)));
    var b = cadd(z,cmul({re:0,im:1},a));
    return cmul({re:0,im:-1},cln(b));
}

function catan(z){
    var a = cmul({re:0,im:1},z);
    var b = csub(cln(crsub(1,a)),cln(caddr(a,1)));
    return cmul({re:0,im:0.5},b);
}

function cacot(z){
    var a = cdiv({re:0,im:1},z);
    var b = csub(cln(crsub(1,a)),cln(caddr(a,1)));
    return cmul({re:0,im:0.5},b);
}

function casinh(z){
    var a = csqrt(caddr(cmul(z,z),1));
    return cln(cadd(z,a));
}

function cacosh(z){
    var a = csqrt(caddr(z,1));
    var b = csqrt(csubr(z,1));
    return cln(cadd(z,cmul(a,b)));
}

function catanh(z){
    var a = cdiv(caddr(z,1),crsub(1,z));
    return cmulr(cln(a),0.5);
}

function cacoth(z){
    var a = cdiv(caddr(z,1),csubr(z,1));
    return cmulr(cln(a),0.5);
}

function gamma_lanczos(z){
    var p=[0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    z = csubr(z,1);
    var y = {re: p[0], im: 0};
    for(var i=1; i<9; i++){
        y = cadd(y,crdiv(p[i],caddr(z,i)));
    }
    var t = caddr(z,7.5);
    return cmulr(
        cmul(cpow(t,caddr(z,0.5)),cdiv(y,cexp(t))),
        Math.sqrt(2*Math.PI)
    );
}

function cgamma(z){
    if(z.re<0.5){
        var d = cmul(csin(cmulr(z,Math.PI)),gamma_lanczos(crsub(1,z)));
        return crdiv(Math.PI,d);
    }else{
        return gamma_lanczos(z);
    }
}

function cfac(z){
    return cgamma(caddr(z,1));
}

function csum(a,b,f){
    a = Math.round(a.re);
    b = Math.round(b.re);
    var y = {re: 0, im: 0};
    for(var k=a; k<=b; k++){
        y = cadd(y,f({re: k, im: 0}));
    }
    return y;
}

function cprod(a,b,f){
    a = Math.round(a.re);
    b = Math.round(b.re);
    var y = {re: 1, im: 0};
    for(var k=a; k<=b; k++){
        y = cmul(y,f({re: k, im: 0}));
    }
    return y;
}

var cdiff_tab = [
[1],
[-1/60,3/20,-3/4,0,3/4,-3/20,1/60],
[1/90,-3/20,3/2,-49/18,3/2,-3/20,1/90],
[-7/240,3/10,-169/120,61/30,0,-61/30,169/120,-3/10,7/240],
[7/240,-2/5,169/60,-122/15,91/8,-122/15,169/60,-2/5,7/240],

[139/12096,-121/756,3125/3024,-3011/756,33853/4032,-1039/126,0,
1039/126,-33853/4032,3011/756,-3125/3024,121/756,-139/12096],
[-139/12096,121/630,-3125/2016,3011/378,-33853/1344,1039/21,
-44473/720,1039/21,-33853/1344,3011/378,-3125/2016,121/630,
-139/12096],
[-2473/518400, 2747/32400, -1363/1920, 4787/1296, -678739/51840,
37517/1200, -12312353/259200, 251539/6480, 0, -251539/6480,
12312353/259200, -37517/1200, 678739/51840, -4787/1296, 1363/1920,
-2747/32400, 2473/518400],
[2473/518400, -2747/28350, 1363/1440, -4787/810, 678739/25920,
-37517/450, 12312353/64800, -251539/810, 4913051/13440, -251539/810,
12312353/64800, -37517/450, 678739/25920, -4787/810, 1363/1440,
-2747/28350, 2473/518400],
[-2021/268800, 7403/50400, -156031/115200, 65377/8400, -248167/8064,
309691/3600, -1618681/9600, 5586823/25200, -66976673/403200, 0,
66976673/403200, -5586823/25200, 1618681/9600, -309691/3600,
248167/8064, -65377/8400, 156031/115200, -7403/50400, 2021/268800],
];

function ctab_diff(h){
    return function(f,z,n){
        if(n==0){
            return f(z);
        }else{
            var a = cdiff_tab[n];
            var m = Math.floor(a.length/2);
            var d = Math.pow(h,1/n);
            var y = {re: 0, im: 0};
            for(var k=-m; k<=m; k++){
                y = cadd(y,cmulr(f(caddr(z,k*d)),a[m+k]));
            }
            return cmulr(y,1/h);
        }
    }
}

function cdiffh(h){
    var tab_diff = ctab_diff(0.001);
    return function(f,z,n){
        if(n==undefined){
            return cmulr(csub(f(caddr(z,h)),f(csubr(z,h))),0.5/h);
        }else{
            return tab_diff(f,z,Math.round(n.re));
        }
    };
}

var g32 = [
[-0.9972638618494816, 0.007018610009470141],
[-0.9856115115452684, 0.01627439473090563],
[-0.9647622555875064, 0.02539206530926208],
[-0.9349060759377397, 0.03427386291302148],
[-0.8963211557660522, 0.04283589802222668],
[-0.8493676137325699, 0.05099805926237622],
[-0.7944837959679425, 0.05868409347853551],
[-0.7321821187402897, 0.06582222277636184],
[-0.6630442669302152, 0.07234579410884850],
[-0.5877157572407623, 0.07819389578707028],
[-0.5068999089322295, 0.08331192422694673],
[-0.4213512761306354, 0.08765209300440380],
[-0.3318686022821277, 0.09117387869576390],
[-0.2392873622521371, 0.09384439908080457],
[-0.1444719615827965, 0.09563872007927489],
[-0.04830766568773831,0.09654008851472778],
[ 0.04830766568773831,0.09654008851472778],
[ 0.1444719615827965, 0.09563872007927489],
[ 0.2392873622521371, 0.09384439908080457],
[ 0.3318686022821277, 0.09117387869576390],
[ 0.4213512761306354, 0.08765209300440380],
[ 0.5068999089322295, 0.08331192422694673],
[ 0.5877157572407623, 0.07819389578707028],
[ 0.6630442669302152, 0.07234579410884850],
[ 0.7321821187402897, 0.06582222277636184],
[ 0.7944837959679425, 0.05868409347853551],
[ 0.8493676137325699, 0.05099805926237622],
[ 0.8963211557660522, 0.04283589802222668],
[ 0.9349060759377397, 0.03427386291302148],
[ 0.9647622555875064, 0.02539206530926208],
[ 0.9856115115452684, 0.01627439473090563],
[ 0.9972638618494816, 0.007018610009470141]
];

function cgauss(f,a,b,n){
    var h = (b-a)/n;
    var p = 0.5*h;
    var s = {re: 0, im: 0};
    var N = g32.length;
    var i,j,sj,q;
    for(j=0; j<n; j++){
        q = p+a+j*h;
        sj = {re: 0, im: 0};
        for(i=0; i<N; i++){
            sj = cadd(sj,cmulr(f(p*g32[i][0]+q),g32[i][1]));
        }
        s = cadd(s,cmulr(sj,p));
    }
    return s;
}

function cint(p,f,n){
    if(n==undefined) {n=1} else {n=Math.round(n.re)};
    var s = {re: 0, im: 0};
    var N = p.length-1;
    for(var i=0; i<N; i++){
        var a = p[i];
        var b = p[i+1];
        var m = csub(b,a);
        var g = function(t){
            return f({re: a.re+m.re*t, im: a.im+m.im*t});
        };
        s = cadd(s,cmul(m,cgauss(g,0,1,n)));
    }
    return s;
}

function citerate(f,n,z){
    n = Math.round(n.re);
    for(var i=0; i<n; i++){
        z = f(z);
    }
    return z;
}

function ccompile_application(a,id,t,context){
    if(id.length>0) a.push(id);
    a.push("(");
    var first = true;
    for(var i=1; i<t.length; i++){
        if(first){first = false;}
        else{a.push(",");}
        ccompile_expression(a,t[i],context);
    }
    a.push(")");
}

function ccompile_list(a,t,context){
    a.push("[");
    var first = true;
    for(var i=1; i<t.length; i++){
        if(first){first = false;}
        else{a.push(",");}
        ccompile_expression(a,t[i],context);
    }
    a.push("]");
}

function ccompile_lambda_expression(a,argv,body,context){
    if(!Array.isArray(argv)) argv = [argv];
    var local = Object.create(context.local);
    for(var i=0; i<argv.length; i++){
        local[argv[i]] = true;
    }
    var sub_context = {local: local, pre: context.pre};
    a.push("function("+argv.join(",")+"){return ");
    ccompile_expression(a,body,sub_context);
    a.push(";}");
}

function ccompile_block(a,t,context){
    var n = t.length-1;
    var b = [];
    for(var i=1; i<n; i++){
        ccompile_expression(b,t[i],context);
        b.push(";");
    }
    context.statements.push(b.join(""));
    ccompile_expression(a,t[n],context);
}

function ccompile_assignment(a,t,context){
    a.push("var "+t[1]+"=");
    ccompile_expression(a,t[2],context);
    context.local[t[1]] = true;
}

var coperator_table = {
    "<": "<", ">": ">", "<=": "<=", ">=": ">=",
    "&": "&&", "|": "||"
};

function ccompile_expression(a,t,context){
    if(typeof t == "number"){
        a.push("{re:");
        a.push(t);
        a.push(",im:0}");
    }else if(typeof t == "string"){
        if(t in context.local){
            a.push(t);
        }else if(cftab.hasOwnProperty(t)){
            context.pre.push("var "+t+"=cftab[\""+t+"\"];");
            context.local[t] = true;
            a.push(t);
        }else if(cglobal_ftab.hasOwnProperty(t)){
            a.push(cglobal_ftab[t]);
        }else if(!ftab_extension_loaded){
            async_continuation = "await";
            load_ftab_extension();
            throw new Repeat();
        }else{
            throw new Err("Error: undefined variable: '"+t+"'.");
        }
    }else if(Array.isArray(t)){
        var op = t[0];
        if(Array.isArray(op)){
            ccompile_expression(a,op,context);
            ccompile_application(a,"",t,context);
        }else if(coperator_table.hasOwnProperty(op)){
            a.push("(");
            ccompile_expression(a,t[1],context);
            a.push(coperator_table[op]);
            ccompile_expression(a,t[2],context);
            a.push(")");
        }else if(op=="fn"){
            ccompile_lambda_expression(a,t[1],t[2],context);
        }else if(op=="[]"){
            ccompile_list(a,t,context);
        }else if(op==":="){
            ccompile_assignment(a,t,context);
        }else if(op=="block"){
            ccompile_block(a,t,context);
        }else if(op=="index"){
            ccompile_expression(a,t[1],context);
            a.push("[");
            ccompile_expression(a,t[2],context);
            a.push("]");
        }else if(op=="if"){
            a.push("(");
            ccompile_expression(a,t[1],context);
            a.push("?");
            ccompile_expression(a,t[2],context);
            a.push(":");
            if(t.length<4){
                a.push("NaN");
            }else{
                ccompile_expression(a,t[3],context);
            }
            a.push(")");
        }else if(cglobal_ftab.hasOwnProperty(op)){
            var n = t[2];
            if(op==="^" && typeof n=="number" &&
                Number.isInteger(n) && n>0 && n<40
            ){
                if(n==1){
                    ccompile_expression(a,t[1],context);
                }else if(n==2){
                    ccompile_application(a,"cpow2",["",t[1]],context);
                }else{
                    a.push("cpown(");
                    ccompile_expression(a,t[1],context);
                    a.push(","+n+")");
                }
            }else{
                ccompile_application(a,cglobal_ftab[op],t,context);
            }
        }else{
            ccompile_expression(a,op,context);
            ccompile_application(a,"",t,context);
        }
    }else{
        throw "panic";
    }
}

function ccompile(t,argv){
    var a = [];
    var local = Object.create(null);
    for(var i=0; i<argv.length; i++){
        local[argv[i]] = true;
    }
    var context = {
        pre: [],
        local: local,
        statements: []
    };
    a.push("(function(){");
    a.push("return function("+argv.join(",")+"){");
    var statements_index = a.length;
    a.push("");
    a.push("return ");
    ccompile_expression(a,t,context);
    a.push(";};");
    a.push("})()");
    a[0] += context.pre.join("");
    if(context.statements.length>0){
        a[statements_index] = context.statements.join("");
    }
    return window.eval(a.join(""));
}

function ccompile_string(s,argv){
    var t = ast(s);
    return ccompile(t,argv);
}

function colorfn(n){
    var a = document.getElementById("method").options;
    for(var i=0; i<a.length; i++){
        a[i].selected = i==n;
    }
}

function pulse(x,a){
    return Math.pow(Math.cos(Math.PI*x),a);
}

function color_hsl(w){
    var r = cabs(w);
    var phi = carg_positive(w);
    return hsl_to_rgb_u8(phi,0.8,Math.tanh(r/10));
}

function color_hsl_and_rect(w){
    var r = cabs(w);
    var phi = carg_positive(w);
    return hsl_to_rgb_u8(phi,0.8,Math.tanh(r/10*(1+pulse(w.re,100))*(1+pulse(w.im,100))));
}

function color_hsl_and_polar(w){
    var r = cabs(w);
    var phi = carg_positive(w);
    var iso_r = 1+pulse(r,100);
    var iso_phi = 1-1/Math.sqrt(r)*pulse(6*phi/Math.PI,100);
    return hsl_to_rgb_u8(phi,0.8,Math.tanh(r/10*iso_r*iso_phi));
}

function smooth_mod(a){
    var x0 = a/(a+1);
    return function(x,m){
        x = mod(x,m);
        return x<x0?x:a*(1-x);
    };
}
var smod = smooth_mod(20);

function color_lb_repeat(w){
    var r = cabs(w);
    var phi = carg_positive(w);
    var iso_phi = 0.5*pulse(6*phi/Math.PI,100);
    return hsl_to_rgb_u8(phi,0.9,Math.tanh(0.25+0.5*smod(ld(r),1)+iso_phi));
}

var color_method_tab = {
    "0": color_hsl,
    "1": color_hsl_and_rect,
    "2": color_hsl_and_polar,
    "3": color_lb_repeat
};

var img_color = color_hsl;

async function cplot(gx,f,n,cond){
    var pid = {};
    var index = pid_stack.length;
    pid_stack.push(pid);
    busy = true;

    var W = gx.w;
    var H = gx.h;
    var px,py,x,y,z;
    var pset = gx.pset;
    var px0 = gx.px0;
    var py0 = gx.py0;
    var k = 0;
    
    for(py=0; py<H; py+=n){
        for(px=0; px<W; px+=n){
            x = (px-px0)/gx.mx/ax;
            y = -(py-py0)/gx.mx/ay;
            z = {re: x, im: y};
            rect(pset,img_color(f(z)),px,py,n,n);
        }
        if(cond && k==10){
            k=0;
            await sleep(20);
        }else{
            k++;
        }
        if(cancel(pid,index,pid_stack)) return;
    }

    system(gx,true,0.02,0.2);
    flush(gx);
    labels(gx);
    busy = false;
}

async function cplot_async(gx,f){
    if(gx.sync_mode==true){
        cplot(gx,f,1,false);
    }else if(plot_refresh){
        plot_refresh = false;
        cplot(gx,f,20,false);
    }else{
        cplot(gx,f,4,false);
        while(busy){await sleep(40);}
        await sleep(40);
        cplot(gx,f,1,true);
    }
}

var plot_refresh = false;

function refresh(gx){
    plot_refresh = true;
    update(gx);
}

function plot_node(gx,t,color){
    var index = document.getElementById("method").value;
    img_color = color_method_tab[index];  
    var f = ccompile(t,["z"]);
    cplot_async(gx,f);
}

function global_definition(t){
    if(Array.isArray(t[1])){
        var app = t[1];
        var value = ccompile(t[2],app.slice(1));
        cftab[app[0]] = value;
    }else{
        var value = ccompile(t[2],[]);
        cftab[t[1]] = value();
    }
}

function calc(){
    calculate(ccompile);
}

function cplot_img(w,h){
    return plot_img(w.re,h.re);
}

color_dark_axes = [80,80,80];
dark = true;


