
var cglobal_ftab = {
    "+": "cadd", "-": "csub", "*": "cmul", "/": "cdiv",
    "^": "cpow", "~": "cneg", "=": "ceq",
    abs: "ccabs", arg: "ccarg",
    re: "cre", im: "cim", Re: "cre", Im: "cim",
    exp: "cexp", ln: "cln", sqrt: "csqrt",
    sin: "csin", cos: "ccos", tan: "ctan", cot: "ccot",
    gamma: "cgamma"
};

var cftab = {
    pi: [Math.PI,0], tau: [2*Math.PI,0],
    e: [Math.E,0], i: [0,1], nan: [NaN,NaN],
    deg: [Math.PI/180,0], grad: [Math.PI/180,0], gon: [Math.PI/200,0],
    gc: [GAMMA,0]
};

function cabs(z){
    return Math.hypot(z[0],z[1]);
}

function sgn(x){
    return x<0? -1: (x>0? 1: 0);
}

function carg(z){
    return Math.atan2(z[1],z[0]);
}

function carg_positive(z){
    var r = cabs(z);
    var phi = Math.atan2(z[1],z[0]);
    return phi<0? phi+2*Math.PI: phi;
}

function ccabs(z){
    return [Math.hypot(z[0],z[1]),0];
}

function ccarg(z){
    return [Math.atan2(z[1],z[0]),0];
}

function cadd(a,b){
    return [a[0]+b[0],a[1]+b[1]];
}

function csub(a,b){
    return [a[0]-b[0],a[1]-b[1]];
}

function cmul(a,b){
    return [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
}

function cdiv(a,b){
    var r = 1/(b[0]*b[0]+b[1]*b[1]);
    return [r*(a[0]*b[0]+a[1]*b[1]),r*(a[1]*b[0]-a[0]*b[1])];
}

function crdiv(a,b){
    var r = a/(b[0]*b[0]+b[1]*b[1]);
    return [r*b[0],-r*b[1]];
}

function cneg(a){return [-a[0],-a[1]];}
function caddr(a,b){return [a[0]+b,a[1]];}
function csubr(a,b){return [a[0]-b,a[1]];}
function crsub(a,b){return [a-b[0],-b[1]];}
function cmulr(a,b){return [a[0]*b,a[1]*b];}
function cre(z){return [z[0],0];}
function cim(z){return [z[1],0];}

function cexp(z){
    var r = Math.exp(z[0]);
    return [r*Math.cos(z[1]),r*Math.sin(z[1])];
}

function cln(z){
    return [Math.log(cabs(z)),carg(z)];
}

function cpow(a,b){
    return cexp(cmul(cln(a),b));
}

function csqrt(z){
    return cexp(cmulr(cln(z),0.5));
}

function csin(z){
    var c = Math.cos(z[0]);
    var s = Math.sin(z[0]);
    var p = 0.5*Math.exp(z[1]);
    var q = 0.5*Math.exp(-z[1]);
    return [(p+q)*s,(p-q)*c];
}

function ccos(z){
    var c = Math.cos(z[0]);
    var s = Math.sin(z[0]);
    var p = 0.5*Math.exp(-z[1]);
    var q = 0.5*Math.exp(z[1]);
    return [(p+q)*c,(p-q)*s];
}

function ctan(z){
    return cdiv(csin(z),ccos(z));
}

function ccot(z){
    return cdiv(ccos(z),csin(z));
}

function gamma_lancos(z){
    var p=[0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    z = csubr(z,1);
    var y = [p[0],0];
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
    if(z[0]<0.5){
        var d = cmul(csin(cmulr(z,Math.PI)),gamma_lancos(crsub(1,z)));
        return crdiv(Math.PI,d);
    }else{
        return gamma_lancos(z);
    }
}

function hsl_to_rgb(H,S,L){
    var C = (1-Math.abs(2*L-1))*S;
    var R1,G1,B1,Hp,X,m;
    Hp = 3*H/Math.PI;
    X = C*(1-Math.abs(Hp%2-1));
    if(0<=Hp && Hp<1){
        R1=C; G1=X; B1=0;
    }else if(1<=Hp && Hp<2){
        R1=X; G1=C; B1=0;
    }else if(2<=Hp && Hp<3){
        R1=0; G1=C; B1=X;
    }else if(3<=Hp && Hp<4){
        R1=0; G1=X; B1=C;
    }else if(4<=Hp && Hp<5){
        R1=X; G1=0; B1=C;
    }else if(5<=Hp && Hp<6.01){
        R1=C; G1=0; B1=X;
    }else{
        R1=0; G1=0; B1=0;
    }
    m = L-C/2;
    return [R1+m,G1+m,B1+m];
}

function hsl_to_rgb_u8(H,S,L){
    var t = hsl_to_rgb(H,S,L);
    return [255*t[0],255*t[1],255*t[2]];
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
        a.push("[");
        a.push(t);
        a.push(",0]");
    }else if(typeof t == "string"){
        if(t in context.local){
            a.push(t);
        }else if(cftab.hasOwnProperty(t)){
            context.pre.push("var "+t+"=cftab[\""+t+"\"];");
            context.local[t] = true;
            a.push(t);
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
        }else if(op=="||"){
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
            ccompile_application(a,cglobal_ftab[op],t,context);
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

function rect(pset,color,px0,py0,w,h){
    var px1 = px0+w;
    var py1 = py0+h;
    for(var py=py0; py<py1; py++){
        for(var px=px0; px<px1; px++){
            pset(color,px,py);
        }
    }
}

async function cplot(gx,f,n,cond){
    var pid = {};
    var index = pid_stack.length;
    pid_stack.push(pid);
    busy = true;

    var W = gx.w;
    var H = gx.h;
    var px,py,x,y,z,w,r,phi,color;
    var pset = gx.pset;
    var px0 = gx.px0;
    var py0 = gx.py0;
    var k = 0;
    
    for(py=0; py<H; py+=n){
        for(px=0; px<W; px+=n){
            x = (px-px0)/gx.mx/ax;
            y = -(py-py0)/gx.mx/ay;
            z = [x,y];
            w = f(z);
            r = cabs(w);
            phi = carg_positive(w);
            color = hsl_to_rgb_u8(phi,0.5,Math.tanh(r/10));
            rect(pset,color,px,py,n,n);
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
    if(plot_refresh){
        plot_refresh = false;
        cplot(gx,f,20,false);
    }else{
        cplot(gx,f,4,false);
        while(busy){await sleep(40);}
        await sleep(40);
        cplot(gx,f,1,true);
    }
}

function plot_node(gx,t,color){
    var f = ccompile(t,["z"]);
    cplot_async(gx,f);
}

var plot_refresh = false;

function refresh(gx){
    plot_refresh = true;
    update(gx);
}

color_dark_axes = [80,80,80];
dark = true;


