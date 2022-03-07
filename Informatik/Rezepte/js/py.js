
function isalpha(s){
    return /^[a-z]+$/i.test(s);
}

function isdigit(s){
    return /^\d+$/.test(s);
}

var python_keyword = {
   "False":0, "None":0, "True":0,
   "and":0, "as":0, "assert":0, "async":0, "await":0, "break":0,
   "class":0, "continue":0, "def":0, "del":0, "elif":0, "else":0,
   "except":0, "finally":0, "for":0, "from":0, "global":0, "if":0,
   "import":0, "in":0, "is":0, "lambda":0, "nonlocal":0, "not":0,
   "or":0, "pass":0, "raise":0, "return":0, "try":0, "while":0,
   "with":0, "yield":0
};

function node_syntax(s){
    var id,s2,st,c;
    s2 = "";
    var i = 0;
    while(i<s.length){
        c = s[i];
        if(isalpha(c) || s[i]=='_'){
            id = "";
            while(i<s.length && (isalpha(s[i]) || isdigit(s[i]) || s[i]=='_')){
                id+=s[i];
                i++;
            }
            if(python_keyword.hasOwnProperty(id)){
                if(python_keyword[id]==0){
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
            st = "<span class='string'>\"";
            i++;
            while(i<s.length && s[i]!='"'){st+=s[i]; i++;}
            i++;
            st+="\"</span>";
            s2+=st;
        }else if(c=="'"){
            if(i+2<s.length && (s[i+2]=="'" || s[i+1]=='\\' || s[i+1]=='&')){
                st = "<span class='string'>'";
                i++;
                while(i<s.length && s[i]!="'"){st+=s[i]; i++;}
                i++;
                st+="'</span>";
                s2+=st;
            }else{
                s2 += "<span class='symbol'>'</span>";
                i++;
            }
        }else if(c=='#'){
            st = "<span class='comment'>";
            while(i<s.length && s[i]!='\n'){st+=s[i]; i++;}
            st+="</span>";
            s2+=st;
        }else if(c=='/' && i+1<s.length && s[i+1]=='*'){
            st = "<span class='comment'>/*";
            i+=2;
            while(i+1<s.length && s[i]!='*' && s[i+1]!='/'){
                st+=s[i]; i++;
            }
            i+=2;
            st+="*/</span>";
            s2+=st;
        }else if(c=='&'){
            st = "";
            while(i<s.length && s[i]!=';'){st+=s[i]; i++;}
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

function py_syntax(){
    var a = document.getElementsByClassName("python");
    for(var i=0; i<a.length; i++){
        a[i].innerHTML = node_syntax(a[i].innerHTML);
    }
}

window.addEventListener("load",py_syntax);

