
function get_index(s){
    for(var i=0; i<index.length; i++){
        if(s==index[i][0].toLowerCase()) return i;
    }
    return -1;
}

function get_indizes(s){
    var a=[];
    for(var i=0; i<index.length; i++){
        if(index[i][0].toLowerCase().indexOf(s)>=0){
            a.push(i);
        }
    }
    return a;
}

function last_part(s){
    var i=s.length-1;
    while(i>=0 && s[i]!='/') i--;
    return s.substr(i+1);
}

function get_ref(s){
    return s.substr(2);
}

function trim_extension(name){
    var a = name.split('.');
    return a.length==1 ? a[0] : a.slice(0,-1).join('.');
}

function file_list_to_html(a){
    var buffer=[];
    for(var i=0; i<a.length; i++){
        console.log(last_part(a[i]));
        buffer.push(["<a href='", get_ref(a[i]),
            "'>"+trim_extension(last_part(a[i])), "</a>"].join(""));
    }
    return buffer.join(", ");
}

function index_to_html(i){
    return "<dt>"+index[i][0]+"\n<dd>"+file_list_to_html(index[i][1]);
}

function search(){
    var input = document.getElementById("input1");
    var output = document.getElementById("output");
    var s = input.value.toLowerCase();
    if(s.length<2){
        output.innerHTML = "Zeichenkette zu kurz";
        return;
    }
    var i = get_index(s);
    output.innerHTML = "<h2>Exakt</h2>\n"
    if(i<0){
        output.innerHTML += "nichts gefunden<br><br>"
    }else{
        output.innerHTML += "<dl>"+index_to_html(i)+"</dl>";
    }
    var a = get_indizes(s);
    if(a.length>0){
        output.innerHTML += "<h2>Als Teilzeichenkette</h2>";
        var buffer=[];
        for(i=0; i<a.length; i++){
            buffer.push(index_to_html(a[i]));
        }
        output.innerHTML+="<dl>"+buffer.join("")+"</dl>";
    }
}

function handle_keys(event){
    if(event.keyCode==13){
        search();
    }
}
