

function cas_int(x){
  return {"type": "int", "value": x};
}

function cas_id(x){
  return {"type": "id", "value": x};
}

function cas_add(x,y){
  return {"type": "op", "value": "+", "a": [x,y]};
}

function cas_sub(x,y){
  return {"type": "op", "value": "-", "a": [x,y]};
}

function cas_mpy(x,y){
  return {"type": "op", "value": "*", "a": [x,y]};
}

function cas_div(x,y){
  return {"type": "op", "value": "/", "a": [x,y]};
}

function cas_pow(x,y){
  return {"type": "op", "value": "^", "a": [x,y]};
}

function cas_neg(x){
  return {"type": "op", "value": "u-", "a": [x]};
}

function cas_apply(id,a){
  return {"type": "app", "value": id, "a": a};
}

function cas_apply_diff(t,id){
  return cas_apply("diff",[t,cas_id(id)]);
}

function cas_isconst(t,id){
  var type=t.type;
  if(type=="int" || type=="float"){
    return true;
  }else if(type=="id"){
    return t.value!=id;
  }else if(type=="op"){
    for(var i=0; i<t.a.length; i++){
      if(!cas_isconst(t.a[i],id)) return false;
    }
    return true;
  }else{
    return false;
  }
}

function cas_eq(x,y){
  if(x.type=="int" && y.type=="int"){
    return x.value==y.value;
  }else if(x.type=="id" && y.type=="id"){
    return x.value==y.value;
  }else if(x.type=="op" && y.type=="op"){
    if(x.value==y.value){
      for(var i=0; i<x.a.length; i++){
        if(!cas_eq(x.a[i],y.a[i])) return false;
      }
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function cas_diff(t,id){
  var type=t.type;
  if(type=="id"){
    if(t.value==id){
      return cas_int(1);
    }else{
      return cas_int(0);
    }
  }else if(type=="int" || type=="float"){
    return cas_int(0);
  }else if(type=="op"){
    if(t.value=="+"){
      return cas_add(cas_diff(t.a[0],id),cas_diff(t.a[1],id));
    }else if(t.value=="-"){
      return cas_sub(cas_diff(t.a[0],id),cas_diff(t.a[1],id));
    }else if(t.value=="*"){
      if(cas_isconst(t.a[0],id)){
        return cas_mpy(t.a[0],cas_diff(t.a[1],id));
      }else{
        return cas_add(
          cas_mpy(t.a[0],cas_diff(t.a[1],id)),
          cas_mpy(t.a[1],cas_diff(t.a[0],id)));
      }
    }else if(t.value=="/"){
      if(cas_isconst(t.a[1],id)){
        return cas_div(cas_diff(t.a[0],id),t.a[1]);
      }else{
        return cas_div(
          cas_sub(
            cas_mpy(t.a[1],cas_diff(t.a[0],id)),
            cas_mpy(t.a[0],cas_diff(t.a[1],id))
          ), cas_mpy(t.a[1],t.a[1]));
      }
    }else if(t.value=="^"){
      if(cas_isconst(t.a[1],id)){
        return cas_mpy(
          cas_mpy(t.a[1],cas_pow(t.a[0],cas_sub(t.a[1],cas_int("1")))),
          cas_diff(t.a[0],id)
        );
      }else{
        return cas_apply_diff(t,id);
      }
    }else if(t.value=="u-"){
      return cas_neg(cas_diff(t.a[0],id));
    }else{
      return cas_apply_diff(t,id);
    }
  }else{
    return cas_apply_diff(t,id);
  }
}

function cas_compare_add(a,b){
  var x,y,p,q;
  x=a[0]; y=b[0];
  if(x.type=="id" && y.type=="id"){
    if(x.value<y.value) return -1;
    else if(x.value>y.value) return 1;
    else return 0;
  }else if(x.type=="id" && y.type=="op"){
    return 1;
  }else if(x.type=="op" && y.type=="id"){
    return -1;
  }else if(x.type=="op" && y.type=="op"){
    if(x.value=="^" && y.value=="^"){
      if(x.a[0].type=="id" && y.a[0].type=="id" &&
        x.a[1].type=="int" && y.a[1].type=="int"
      ){
        p=x.a[1].value; q=y.a[1].value;
        x=x.a[0].value; y=y.a[0].value;
        if(p>q) return -1;
        else if(p<q) return 1;
        else if(x<y) return -1;
        else if(x>y) return 1;
        else return 0;
      }else{
        return 0;
      }
    }else{
      return 0;
    }
  }else{
    return 0;
  }
}

function cas_compare_mpy(a,b){
  var x,y;
  x=a[0]; y=b[0];
  if(x.type=="id" && y.type=="id"){
    if(x.value<y.value) return -1;
    else if(x.value>y.value) return 1;
    else return 0;
  }else if(x.type=="id" && y.type=="op"){
    return 1;
  }else if(x.type=="op" && y.type=="id"){
    return -1;
  }else{
    return 0;
  }
}

// transform 2x to [x,2]
function cas_coefficient(a){
  var t;
  for(var i=0; i<a.length; i++){
    t=a[i][0];
    if(t.type=="op" && t.value=="*" && t.a[0].type=="int"){
      a[i][1]*=t.a[0].value;
      a[i][0]=t.a[1];
    }
  }
}

// transform x^2 to [x,2]
function cas_exponent(a){
  var t;
  for(var i=0; i<a.length; i++){
    t=a[i][0];
    if(t.type=="op" && t.value=="^" && t.a[1].type=="int"){
      a[i][1]*=t.a[1].value;
      a[i][0]=t.a[0];
    }
  }
}

function cas_uniq_list(a){
  var i,j;
  var b=[];
  for(i=0; i<a.length; i++){
    if(a[i]==undefined) continue;
    for(j=i+1; j<a.length; j++){
      if(a[j]==undefined) continue;
      if(cas_eq(a[i][0],a[j][0])){
        a[i][1]+=a[j][1];
        a[j]=undefined;
      }
    }
  }
  for(i=0; i<a.length; i++){
    if(a[i]==undefined) continue;
    b.push(a[i]);
  }
  return b;
}

function cas_collect_add(t,a){
  var x,y;
  if(t.type=="int"){
    a[0]+=t.value;
  }else if(t.type=="op" && t.value=="+"){
    x = cas_simp(t.a[0]);
    y = cas_simp(t.a[1]);
    cas_collect_add(x,a);
    cas_collect_add(y,a);
  }else{
    a[1].push([t,1]);
  }
}

function cas_collect_mpy(t,a){
  var x,y;
  if(t.type=="int"){
    a[0]*=t.value;
  }else if(t.type=="op" && t.value=="*"){
    x = cas_simp(t.a[0]);
    y = cas_simp(t.a[1]);
    cas_collect_mpy(x,a);
    cas_collect_mpy(y,a);
  }else{
    a[1].push([t,1]);
  }
}

function cas_sum_to_tree(a){
  var v = a[1];
  var t;
  if(v.length>0){
    if(v[0][1]==1){
      t=v[0][0];
    }else{
      t=cas_mpy(cas_int(v[0][1]),v[0][0]);
    }
    for(var i=1; i<v.length; i++){
      if(v[i][1]==1){
        t=cas_add(t,v[i][0]);
      }else{
        t=cas_add(t,cas_mpy(cas_int(v[i][1]),v[i][0]));
      }
    }
    if(a[0]!=0){
      t=cas_add(t,cas_int(a[0]));
    }
  }else{
    t=cas_int(a[0]);
  }
  return t;
}

function cas_prod_to_tree(a){
  var v = a[1];
  var t;
  if(v.length>0){
    if(a[0]==0){
      return cas_int(0);
    }
    if(v[0][1]==1){
      t=v[0][0];
    }else{
      t=cas_pow(v[0][0],cas_int(v[0][1]));
    }
    for(var i=1; i<v.length; i++){
      if(v[i][1]==1){
        t=cas_mpy(t,v[i][0]);
      }else{
        t=cas_mpy(t,cas_pow(v[i][0],cas_int(v[i][1])));
      }
    }
    if(a[0]!=1){
      t=cas_mpy(cas_int(a[0]),t);
    }
  }else{
    t=cas_int(a[0]);
  }
  return t;
}

function cas_simp(t){
  var x,y,a;
  if(t.type=="op"){
    if(t.value=="+"){
      a=[0,[]];
      cas_collect_add(t,a);
      cas_coefficient(a[1]);
      a[1]=cas_uniq_list(a[1]);
      a[1].sort(cas_compare_add);
      return cas_sum_to_tree(a);
    }else if(t.value=="-"){
      return cas_simp(cas_add(t.a[0],cas_neg(t.a[1])));
    }else if(t.value=="*"){
      a=[1,[]];
      cas_collect_mpy(t,a);
      cas_exponent(a[1]);
      a[1]=cas_uniq_list(a[1]);
      a[1].sort(cas_compare_mpy);
      return cas_prod_to_tree(a);
    }else if(t.value=="/"){
      x = cas_simp(t.a[0]);
      y = cas_simp(t.a[1]);
      return cas_div(x,y);
    }else if(t.value=="^"){
      x = cas_simp(t.a[0]);
      y = cas_simp(t.a[1]);
      if(y.type=="int"){
        if(y.value==0){
          return cas_int(1);
        }else if(y.value==1){
          return x;
        }else if(x.type=="int"){
          if(y.value>=0){
            return cas_int(Math.pow(x.value,y.value));
          }else{
            return cas_pow(x,y);
          }
        }else{
          return cas_pow(x,y);
        }
      }else if(x.type=="int"){
        if(x.value==1){
          return cas_int(1);
        }else{
          return cas_pow(x,y);
        }
      }else{
        return cas_pow(x,y);
      }
    }else if(t.value=="u-"){
      x = cas_simp(t.a[0]);
      if(x.type=="int"){
        return cas_int(-x.value);
      }else{
        return cas_neg(x);
      }
    }else{
      return t;
    }
  }else{
    return t;
  }
}

function cas_eval_symbolic(t){
  if(t.type=="app"){
    if(t.value=="diff"){
      return cas_simp(cas_diff(t.a[0],t.a[1].value));
    }else if(t.value=="simp"){
      return cas_simp(t.a[0]);
    }else{
      var a = t.a.map(cas_eval_symbolic);
      return {"type": "app", "value": t.value, "a": a};
    }
  }else if(t.type=="op"){
    var a = t.a.map(cas_eval_symbolic);
    return {"type": "op", "value": t.value, "a": a};
  }else{
    return t;
  }
}
