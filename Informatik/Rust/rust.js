

function isalpha(s){
  return /^[a-z]+$/i.test(s);
}

function isdigit(s){
  return /^\d+$/.test(s);
}

var rust_keyword = {
  "as": 0, "continue": 0,
  "else": 0, "enum": 0, "false": 0, "fn": 0, "for": 0,
  "if": 0, "impl": 0, "in": 0, "let": 0, "loop": 0,
  "match": 0, "mod": 0, "mut": 0, "pub": 0,
  "return": 0, "static": 0, "struct": 0,
  "trait": 0, "true": 0, "type": 0, "use": 0,
  "where": 0, "while": 0
};

function rust_syntax(s){
  var id,s2,st,c;
  s2="";
  var i=0;
  while(i<s.length){
    c=s[i];
    if(isalpha(c) || s[i]=='_'){
      id="";
      while(i<s.length && (isalpha(s[i]) || isdigit(s[i]) || s[i]=='_')){
        id+=s[i];
        i++;
      }
      if(rust_keyword.hasOwnProperty(id)){
        if(rust_keyword[id]==0){
          s2+="<span class='keyword'>"+id+"</span>";
        }else{
          s2+="<span class='special'>"+id+"</span>";
        }
      }else{
        s2+=id;
      }
    }else if(isdigit(c)){
      st="";
      while(i<s.length && isdigit(s[i])){
        st+=s[i];
        i++;
      }
      s2+="<span class='number'>"+st+"</span>";
    }else if(c=='"'){
      st="<span class='string'>\"";
      i++;
      while(i<s.length && s[i]!='"'){
        st+=s[i];
        i++;
      }
      i++;
      st+="\"</span>";
      s2+=st;
    }else if(c=="'"){
      if(i+2<s.length && (s[i+2]=="'" || s[i+1]=='\\')){
        st="<span class='string'>'";
        i++;
        while(i<s.length && s[i]!="'"){
          st+=s[i];
          i++;
        }
        i++;
        st+="'</span>";
        s2+=st;
      }else{
        s2 += "<span class='symbol'>'</span>";
        i++;
      }
    }else if(c=='#'){
      st="<span class='preprocessor'>";
      while(i<s.length && s[i]!='\n'){
        st+=s[i];
        i++;
      }
      st+="</span>";
      s2+=st;
    }else if(c=='/' && i+1<s.length && s[i+1]=='/'){
      st="<span class='comment'>";
      while(i<s.length && s[i]!='\n'){
        st+=s[i];
        i++;
      }
      st+="</span>";
      s2+=st;
    }else if(c=='/' && i+1<s.length && s[i+1]=='*'){
      st="<span class='comment'>/*";
      i+=2;
      while(i+1<s.length && s[i]!='*' && s[i+1]!='/'){
        st+=s[i];
        i++;
      }
      i+=2;
      st+="*/</span>";
      s2+=st;
    }else if(c=='&'){
      st="";
      while(i<s.length && s[i]!=';'){
        st+=s[i];
        i++;
      }
      s2+="<span class='symbol'>"+st+";</span>";
      i++;
    }else if(c=='(' || c==')' || c=='[' || c==']' || c=='{' || c=='}'){
      s2+="<span class='bracket'>"+c+"</span>";
      i++;
    }else if(c=='+' || c=='-' || c=='*' || c=='/' || c=='|' ||
      c=='.' || c=='=' || c=='!' || c==':' || c=='%' || c=='^' ||
      c=='~'
    ){
      s2+="<span class='symbol'>"+c+"</span>";
      i++;
    }else{
      s2+=c;
      i++;
    }
  }
  return s2;
}

function main(){
  var a = document.getElementsByClassName("rust");
  for(var i=0; i<a.length; i++){
    a[i].innerHTML = rust_syntax(a[i].innerHTML);
  }
}

window.onload = main;
