
function load_css(path) {
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    link.async = false;
    head.appendChild(link);
}

function query_style() {
    var a = window.location.href.split("?");
    if(a.length>1) {
        sessionStorage.setItem("style",a[1]);
    }
    var style = sessionStorage.getItem("style");
    if(style!=null && style.length!=0) {
        load_css("css/"+style+".css");
    }
}
query_style();

