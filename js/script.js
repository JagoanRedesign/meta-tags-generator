
console.log("Loaded script.js");


//Based on https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
function urlParameters(){
    var search = location.search.substring(1);
    return JSON.parse(
        '{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', 
        function(key, value) { return key===""?value:decodeURIComponent(value) }
        )
}


function autofill(frm){
    var frm=document.forms[0];
    if (frm.description.value=="" && frm.title.value!=""){
        frm.description.value=frm.title.value;
    }

}

function readUrl(url){
    request(url,function(data){
        var frm=document.forms[0];
        var pos1=data.indexOf("<head>");
        var pos2=data.indexOf("</head>");
        var doc=document.createElement("div");
        doc.innerHTML=data.substring(pos1+6,pos2);
        console.log(doc.innerHTML);	
        var title1=(doc.querySelector("title"));
        var desc1=(doc.querySelector("meta[name='description']"));
        var keyw1=(doc.querySelector("meta[name='keywords']"));
        console.log("TITLE",title1.textContent);
        console.log("DESC",desc1.getAttribute("content"));
        if (title1 && frm.title.value==""){
            frm.title.value=title1.textContent;
        }
        if (desc1 && frm.description.value==""){
            frm.description.value=desc1.getAttribute("content");
        }
        if (keyw1 && frm.keywords.value==""){
            frm.keywords.value=keyw1.getAttribute("content");
        }
        autofill();
        
        
    },function(){
        
    })
}

function request(url,callback,error){
    var req=new XMLHttpRequest();
    req.open("GET",url);
    //req.setRequestHeader("Authorization","test");
    req.onload=function(){
        
        callback(this.responseText);
    }
    req.onerror=function(){
        error();
    }
    req.send();
}

function generate(){
    
    var template=`<!-- Page title -->
<title>%title%</title>
<meta name="keywords" content="%keywords%"/>
<meta name="description" content="%description%"/>

<!-- Facebook OpenGraph  Social media attributes -->
<meta property="og:title" content="%title%"/>
<meta property="og:description" content="%description%"/>
<meta property="og:site_name" content="%title%"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="%url%"/>
<link rel="canonical" href="%url%" />

<!-- Facebook OpenGraph  Social media image link url and size (must be http, not https) -->
<meta property="og:image" content="%image%"/>
<meta property="og:image:width" content="%image_width%"/>
<meta property="og:image:height" content="%image_height%"/>

<!-- Fav Icon / App Icon -->
<link rel="shortcut icon" href="%icon%"/>
<link rel="icon" type="image/png" href="%icon%" sizes="%image_width%x%image_height%"/>
<link rel="apple-touch-icon" sizes="%icon%" href="images/icon.png"/>`;
    
    for(var key in params){
        var reg=new RegExp("%"+key+"%","g");
        template=template.replace(reg,params[key]);
    }
    document.getElementById("code").innerText=template;
}

function prefill(params){
    var frm=document.forms[0];
    for(var key in params){
        frm[key].value=params[key];
    }
}

function submit(){
    document.forms[0].submit();
}

var params=urlParameters();

prefill(params);
generate();