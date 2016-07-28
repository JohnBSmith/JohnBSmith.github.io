
"use strict";

var vcr=0, vcg=0, vcb=100;
var cr1=0, cg1=0, cb1=100;
var cr2=0, cg2=80, cb2=0;
var cr3=80, cg3=0, cb3=80;

function init(canvas,w,h){
  var gx={};
  gx.canvas=canvas;
  gx.context = canvas.getContext("2d");
  gx.context.font = "12px \"FreeMono\", \"Courier New\", monospace";
  gx.context.clearRect(0,0,w,h);
  gx.img = gx.context.createImageData(w,h);
  gx.data = gx.img.data;
  gx.w=w; gx.h=h;
  gx.w2=w/2; gx.h2=h/2;
  return gx;
}

function pset(gx,x,y){
  var i;
  if(x>=0 && x<gx.w && y>=0 && y<gx.h){
    i=(x+y*gx.w)*4;
    gx.data[i+0]=vcr;
    gx.data[i+1]=vcg;
    gx.data[i+2]=vcb;
    gx.data[i+3]=255;
  }
}

function pset4(gx,x,y){
  pset(gx,x,y);
  pset(gx,x+1,y);
  pset(gx,x,y+1);
  pset(gx,x+1,y+1);
}

function point(gx,x,y){
  var px = Math.floor(36*x+gx.w2);
  var py = Math.floor(-36*y+gx.h2);
  pset4(gx,px,py);
}

function Point(gx,x,y){
  if(float_tab.isPrototypeOf(y)){
    point(gx,x,y.value);
  }else if(complex_tab.isPrototypeOf(y)){
    vcr=80; vcg=20; vcb=80;
    point(gx,x,y.re);
    vcr=20; vcg=80; vcb=20;
    point(gx,x,y.im);
    vcr=0; vcg=0; vcb=100;
  }else if(list_tab.isPrototypeOf(y)){
    var a=y.value;
    for(var i=0; i<a.length; i++){
      Point(gx,x,a[i]);
    }
  }
}

function vpoint(gx,x){
  if(list_tab.isPrototypeOf(x)){
    x=x.value;
    point(gx,x[0].value,x[1].value);
  }else if(complex_tab.isPrototypeOf(x)){
    point(gx,x.re,x.im);
  }else if(float_tab.isPrototypeOf(x)){
    point(gx,x.value,0);
  }
}

function hline(gx,y){
  var py;
  for(var px=0; px<gx.w; px++){
    py = Math.floor(-36*y+gx.h2);
    pset4(gx,px,py);
  }
}

function vline(gx,x){
  var px;
  for(var py=0; py<gx.h; py++){
    px = Math.floor(36*x+gx.w2);
    pset4(gx,px,py);
  }
}

function gets(id){
  return document.getElementById(id).value.trim();
}

function plot(){
  var canvas = document.getElementById("canvas");
  var gx = init(canvas,720,480);
  var ans = document.getElementById("ans");
  var input;
  var f,g,h;
  vcr=0xe0; vcg=0xe0; vcb=0xc0; 
  hline(gx,0);
  vline(gx,0);
  try{
    input = gets("inputf");
    if(input.length>0){
      f = compile_string(input,"x");
      vcr=cr1; vcg=cg1; vcb=cb1;
      for(var x=-10; x<10; x+=0.01){
        var y = f(float(x));
        Point(gx,x,y);
      }
    }
    input = gets("inputg");
    if(input.length>0){
      g = compile_string(input,"x");
      vcr=cr2; vcg=cg2; vcb=cb2;
      for(var x=-10; x<10; x+=0.01){
        var y = g(float(x));
        Point(gx,x,y);
      }
    }
    input = gets("inputh");
    if(input.length>0){
      h = compile_string(input,"x");
      vcr=cr3; vcg=cg3; vcb=cb3;
      for(var x=-10; x<10; x+=0.01){
        var y = h(float(x));
        Point(gx,x,y);
      }
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
  gx.context.putImageData(gx.img,0,0);
}

function pplot(){
  var canvas = document.getElementById("canvas");
  var gx = init(canvas,720,480);
  var ans = document.getElementById("ans");
  var input;
  var f,g,h;
  vcr=0xe0; vcg=0xe0; vcb=0xc0; 
  hline(gx,0);
  vline(gx,0);
  try{
    input = gets("inputf");
    if(input.length>0){
      f = compile_string(input,"t");
      vcr=cr1; vcg=cg1; vcb=cb1;
      for(var t=-10; t<10; t+=0.01){
        var x = f(float(t));
        vpoint(gx,x);
      }
    }
    input = gets("inputg");
    if(input.length>0){
      g = compile_string(input,"t");
      vcr=cr2; vcg=cg2; vcb=cb2;
      for(var t=-10; t<10; t+=0.01){
        var x = g(float(t));
        vpoint(gx,x);
      }
    }
    input = gets("inputh");
    if(input.length>0){
      h = compile_string(input,"t");
      vcr=cr3; vcg=cg3; vcb=cb3;
      for(var t=-10; t<10; t+=0.01){
        var x = h(float(t));
        vpoint(gx,x);
      }
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
  gx.context.putImageData(gx.img,0,0);
}

function splot(){
  var canvas = document.getElementById("canvas");
  var gx = init(canvas,720,480);
  var ans = document.getElementById("ans");
  var input;
  var f,g,h;
  vcr=0xe0; vcg=0xe0; vcb=0xc0; 
  hline(gx,0);
  vline(gx,0);
  try{
    input = gets("inputf");
    if(input.length>0){
      f = compile_string(input,"u","v");
      vcr=cr1; vcg=cg1; vcb=cb1;
      var u,v,x;
      for(v=-10; v<=10; v++){
        for(u=-10; u<10; u+=0.02){
          x = f(float(u),float(v));
          vpoint(gx,x);
        }
      }
      for(u=-10; u<=10; u++){
        for(v=-10; v<10; v+=0.02){
          x = f(float(u),float(v));
          vpoint(gx,x);
        }
      }
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
  gx.context.putImageData(gx.img,0,0);
}
