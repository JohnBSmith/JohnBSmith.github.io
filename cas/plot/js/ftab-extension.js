
// Lanczos approximation
function lngammapx(x){
  var p=[0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x--;
  var y=p[0];
  for(var i=1; i<9; i++){
    y+=p[i]/(x+i);
  }
  var t=x+7.5;
  return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(y);
}

function bc(x,k){
    if(k!=Math.round(k)){
        return gamma(x+1)/gamma(k+1)/gamma(x-k+1);
    }else if(k<0){
        return 0;
    }
    var y=1;
    for(var i=1; i<=k; i++){
        y = y*(x-i+1)/i;
    }
    return y;
}

function ChebyshevT(n,x){
    if(Math.abs(x)<1){
        return Math.cos(n*Math.acos(x));
    }else if(x>=1){
        return cosh(n*acosh(x));
    }else{
        return Math.cos(Math.PI*n)*cosh(n*acosh(-x));
    }
}

function ChebyshevU(n,x){
    return (ChebyshevT(n+2,x)-x*ChebyshevT(n+1,x))/(x*x-1);
}

function Hermite(n,x){
    var y=0, m=Math.floor(n/2);
    for(var k=0; k<=m; k++){
        y += Math.cos(k*Math.PI)/fac(k)/fac(n-2*k)*Math.pow(2*x,n-2*k);
    }
    return y*fac(n);
}

function Laguerre(n,a,x){
    var y=0;
    for(var k=0; k<=n; k++){
        y += Math.cos(k*Math.PI)*bc(n+a,n-k)/fac(k)*Math.pow(x,k);
    }
    return y;
}

function ALP(n,m,x){
    if(n==m){
        return Math.sqrt(Math.PI)/gamma(0.5-n)*Math.pow(2*Math.sqrt(1-x*x),n);
    }else if(n-1==m){
        return x*(2.0*n-1)*ALP(m,m,x);
    }else{
        var a = ALP(m,m,x);
        var b = ALP(m+1,m,x);
        var h;
        for(var k=m+2; k<=n; k++){
          h = ((2.0*k-1)*x*b-(k-1.0+m)*a)/(k-m);
          a=b; b=h;
        }
        return b;
    }
}

function Legendre(n,m,x){
    n = Math.round(n);
    m = Math.round(m);
    if(n<0) n=-n-1;
    if(Math.abs(m)>n){
        return 0;
    }else if(m<0){
        m = -m;
        return((m%2<0.5?1:-1)*
          Math.exp(lngammapx(n-m+1)-lngammapx(n+m+1))*
          ALP(n,m,x)
        );
    }else{
        return ALP(n,m,x);
    }
}



({PT: ChebyshevT, PU: ChebyshevU, PH: Hermite, 
  PP: Legendre, PL: Laguerre})
