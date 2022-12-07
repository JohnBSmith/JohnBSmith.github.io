
function isalpha(s){
    return /^[a-z]+$/i.test(s);
}

function isdigit(s){
    return /^\d+$/.test(s);
}

var gallina_keyword = {
    "Admitted":0, "Check":0, "Compute":0, "Defined":0, "Definition":0,
    "end":0, "fix":0, "forall":0, "fun":0, "Goal":0, "Import":0,
    "Inductive":0, "Local":0, "match":0, "Open":0, "Proof":0, "Qed":0,
    "Record":0, "Require":0, "Scope":0, "Theorem":0, "with":0
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
            if(gallina_keyword.hasOwnProperty(id)){
                if(gallina_keyword[id]==0){
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
        }else if(c=='(' && i+1<s.length && s[i+1]=='*'){
            st = "<span class='comment'>(*";
            i+=2;
            var nesting = 1;
            while(i+1 < s.length){
                if(s[i] == '*' && s[i+1] == ')') nesting -= 1;
                else if(s[i] == '(' && s[i+1] == '*') nesting += 1;
                if(nesting == 0) break;
                st += s[i]; i++;
            }
            i+=2;
            st+="*)</span>";
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

function gallina_syntax(){
    var a = document.getElementsByClassName("gallina");
    for(var i=0; i<a.length; i++){
        a[i].innerHTML = node_syntax(a[i].innerHTML);
    }
}

window.addEventListener("load", gallina_syntax);

