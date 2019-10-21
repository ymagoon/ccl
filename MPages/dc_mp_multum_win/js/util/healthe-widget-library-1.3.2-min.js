
function _g(i){return document.getElementById(i);}
function _gbt(t,e){e=e||document;return e.getElementsByTagName(t);}
var Util=function(){var _e=[],_d=document,_w=window;return{EventCache:function(){var l=[];return{add:function(o,e,f){l.push(arguments);},remove:function(o,e,f){var n;for(var i=l.length-1;i>=0;i=i-1){if(o==l[i][0]&&e==l[i][1]&&f==l[i][2]){n=l[i];if(n[0].removeEventListener){n[0].removeEventListener(n[1],n[2],n[3]);}
else if(n[0].detachEvent){if(n[1].substring(0,2)!="on"){n[1]="on"+n[1];}
n[0].detachEvent(n[1],n[0][e+f]);}}}},flush:function(){var e;for(var i=l.length-1;i>=0;i=i-1){var o=l[i];if(o[0].removeEventListener){o[0].removeEventListener(o[1],o[2],o[3]);}
e=o[1];if(o[1].substring(0,2)!="on"){o[1]="on"+o[1];}
if(o[0].detachEvent){o[0].detachEvent(o[1],o[2]);if(o[0][e+o[2]]){o[0].detachEvent(o[1],o[0][e+o[2]]);}}}}};}(),ce:function(t){var a=_e[t];if(!a){a=_e[t]=_d.createElement(t);}
if(!a){return null;}
else{return a.cloneNode(false);}},cep:function(t,p){var e=this.ce(t);return this.mo(e,p);},mo:function(o1,o2,d){o1=o1||{};o2=o2||{};var p;for(p in o2){if(p){o1[p]=(o1[p]===undefined)?o2[p]:!d?o2[p]:o1[p];}}
return o1;},de:function(e){if(e){this.gp(e).removeChild(e);}},cancelBubble:function(e){e=_w.event||e;if(!e){return;}
if(e.stopPropagation){e.stopPropagation();}
else{e.cancelBubble=true;}},preventDefault:function(e){e=_w.event||e;if(!e){return;}
if(e.preventDefault){e.preventDefault();}
else{e.returnValue=false;}},goff:function(e){var l=0,t=0;if(e.offsetParent){while(e.offsetParent){l+=e.offsetLeft;t+=e.offsetTop;e=e.offsetParent;}}
else if(e.x||e.y){l+=e.x||0;t+=e.y||0;}
return[l,t];},gp:function(e){if(!e.parentNode){return e;}
e=e.parentNode;while(e.nodeType===3&&e.parentNode){e=e.parentNode;}
return e;},gc:function(e,i){i=i||0;var j=-1;if(!e.childNodes[i]){return null;}
e=e.childNodes[0];while(e&&j<i){if(e.nodeType===1){j++;if(j===i){break;}}
e=this.gns(e);}
return e;},gcs:function(e){var r=[],es=e.childNodes;for(var i=0;i<es.length;i++){var x=es[i];if(x.nodeType===1){r.push(x);}}
return r;},gns:function(e){var a=e.nextSibling;while(a&&a.nodeType!==1){a=a.nextSibling;}
return a;},gps:function(e){var a=e.previousSibling;while(a&&a.nodeType!==1){a=a.previousSibling;}
return a;},ac:function(e,p){p.appendChild(e);return e;},ia:function(nn,rn){var p=Util.gp(rn),n=Util.gns(rn);if(n){p.insertBefore(nn,n);}
else{Util.ac(nn,p);}},addEvent:function(o,e,f){function ae(obj,evt,fnc){if(!obj.myEvents){obj.myEvents={};}
if(!obj.myEvents[evt]){obj.myEvents[evt]=[];}
var evts=obj.myEvents[evt];evts[evts.length]=fnc;}
function fe(obj,evt){if(!obj||!obj.myEvents||!obj.myEvents[evt]){return;}
var evts=obj.myEvents[evt];for(var i=0,len=evts.length;i<len;i++){evts[i]();}}
if(o.addEventListener){o.addEventListener(e,f,false);Util.EventCache.add(o,e,f);}
else if(o.attachEvent){o["e"+e+f]=f;o[e+f]=function(){o["e"+e+f](window.event);};o.attachEvent("on"+e,o[e+f]);Util.EventCache.add(o,e,f);}
else{ae(o,e,f);o['on'+e]=function(){fe(o,e);};}},removeEvent:function(o,e,f){Util.EventCache.remove(o,e,f);},popup:function(u,n,o){if(!window.open){return false;}
var d={w:screen.width,h:screen.height,rz:true,mb:true,scb:true,stb:true,tb:true,lb:true,tp:null,lft:null,sx:null,sy:null,dp:"no",dr:"no",fs:"no"};function f(n,v)
{if(!v){return"";}
return n+'='+v+',';}
function fs(){o=o||{};var p,n={};for(p in d){if(p){n[p]=o[p]!==undefined?o[p]:d[p];}}
return n;}
o=fs();var p=f("dependent",o.dp)+f("directories",o.dr)+f("fullscreen",o.fs)+f("location",o.lb?1:0)+f("menubar",o.mb)+f("resizable",o.rz?1:0)+f("scrollbars",o.scb?1:0)+f("status",o.stb?1:0)+f("toolbar",o.tb?1:0)+f("top",o.tp)+f("left",o.lft)+f("width",o.w)+f("height",o.h)+f("screenX",o.sx)+f("screenY",o.sy);p=p.substring(0,p.length-1);var nw=window.open(u,n,p);window.blur();if(nw.focus){nw.focus();}
return true;},Convert:{},Cookie:{},Detect:{},i18n:{},Load:{},Pos:{},Style:{},Timeout:{}};}();function insertAfter(nn,rn){Util.ia(nn,rn);}
Util.addEvent(window,'unload',Util.EventCache.flush);Util.Detect=function(){return{gecko:function(){return navigator.product==="Gecko";},webkit:function(){return new RegExp(" AppleWebKit/").test(navigator.userAgent);},webkitmob:function(){if(this.webkit()&&new RegExp(" Mobile/").test(navigator.userAgent)){var f=new RegExp("(Mozilla/5.0 \\()([^;]+)").exec(navigator.userAgent);return(!f||f.length<3);}},ie6:function(){return typeof document.all!=="undefined"&&typeof window.XMLHttpRequest==="undefined"&&typeof document.body.style.maxWidth==="undefined";}};}();Util.i18n=function(){var _i={};function fu(n,o){var b=_i[n]||{};_i[n]=Util.mo(b,o,true);}
return{set:function(n,o){if(!n){return null;}
fu(n,o);return _i[n];},setString:function(n,k,s){if(!n||!k){return null;}
s=s||"";var o={};o[k]=s;fu(n,o);return _i[n];},get:function(n){return _i[n]||{};},getString:function(n,k){return this.get(n)[k]||"";},getNamespaces:function(){var n=[],a=0,i;for(i in _i){n[a++]=i;}
return n;}};}();Util.Load=function(){var U=Util,c=false,e=[],d=document,w=window,t,s,l,rs,dm,am,sc=U.ce("LINK");if(sc){sc.rel="script";sc.href="javascript:void(0);";sc.id="__onload";_gbt("HEAD")[0].appendChild(sc);s=_g("__onload");}
l=function(){if(t){clearInterval(t);t=null;}
for(var i=0;i<e.length;i++){e[i].call(this);}
dm();e=[];c=true;};rs=function(){if(/loaded|complete/.test(d.readyState)){l();}};dm=function(){var r=U.removeEvent;clearInterval(t);r(w,"load",l);r(d,"DOMContentLoaded",l);if(sc){r(sc,"readystatechange",rs);}};am=function(){var a=U.addEvent;a(w,"load",l);a(d,"DOMContentLoaded",l);if(sc){a(sc,"readystatechange",rs);}
if(d.readyState){t=setInterval(function(){rs();},10);}};am();return{add:function(f){if(c){if(U.Detect.webkit()){setTimeout(f,1);}
else{f.call();}
return;}
e.push(f);}};}();Util.Pos=function(){return{gso:function(){var d=document,b=d.body,w=window,e=d.documentElement,et=e.scrollTop,bt=b.scrollTop,el=e.scrollLeft,bl=b.scrollLeft;if(typeof w.pageYOffset==="number"){return[w.pageYOffset,w.pageXOffset];}
if(typeof et==="number"){if(bt>et||bl>el){return[bt,bl];}
return[et,el];}
return[bt,bl];},goo:function(e){if(e){return[e.offsetTop,e.offsetLeft,e.offsetHeight,e.offsetWidth];}
return[0,0,0,0];},gop:function(e){var l=0,t=0;if(e.offsetParent)
{l=e.offsetLeft;t=e.offsetTop;e=e.offsetParent;while(e)
{l+=e.offsetLeft;t+=e.offsetTop;e=e.offsetParent;}}
return[t,l];},gvs:function(){var n=window,d=document,b=d.body,e=d.documentElement;if(typeof n.innerWidth!=='undefined'){return[n.innerHeight,n.innerWidth];}
else if(typeof e!=='undefined'&&typeof e.clientWidth!=='undefined'&&e.clientWidth!==0){return[e.clientHeight,e.clientWidth];}
else{return[b.clientHeight,b.clientWidth];}}};}();Util.Style=function(){return{ccss:function(e,c){if(typeof(e.className)==='undefined'||!e.className){return false;}
var a=e.className.split(' ');for(var i=0,b=a.length;i<b;i++){if(a[i]===c){return true;}}
return false;},acss:function(e,c){if(this.ccss(e,c)){return e;}
e.className=(e.className?e.className+' ':'')+c;return e;},rcss:function(e,c){if(!this.ccss(e,c)){return e;}
var a=e.className.split(' '),d="";for(var i=0,b=a.length;i<b;i++){var f=a[i];if(f!==c){d+=d.length>0?(" "+f):f;}}
e.className=d;return e;},tcss:function(e,c){if(this.ccss(e,c)){this.rcss(e,c);return false;}
else{this.acss(e,c);return true;}},co:function(e){e.style.MozOpacity="";e.style.opacity="";e.style.filter="";},g:function(c,e,t){e=e||document;t=t||'*';var ns=[],es=_gbt(t,e),l=es.length;for(var i=0,j=0;i<l;i++){if(this.ccss(es[i],c)){ns[j]=es[i];j++;}}
return ns;}};}();Util.Timeout=function(){var _d={"duration":5,"restart":true,"confirm":false,"namespace":"Timeout","key":"Warning","warning":"","url":null},_o=_d,_t;function fs(o){var p,n={};for(p in _o){if(p){n[p]=o[p]!==undefined?o[p]:_o[p];}}
return n;}
function fe(e){var s=_gbt("SCRIPT",e);for(var i=0;i<s.length;++i){eval(s[i].innerHTML);}}
function fr(t){if(t&&t.length>0){var d=Util.ce("DIV"),y=d.style;y.position="absolute";y.visibility="hidden";Util.ac(d,document.body);d.innerHTML=t;fe(d);}}
function fst(){if(!_o.url){return;}
_t=setTimeout(fc,(_o.duration*60*1000));}
function fc(){var s=_o.warning.length>0?_o.warning:Util.i18n.getString(_o.namespace,_o.key);if(_o.confirm&&confirm(s)){Ajax.load(_o.url,fr);}
else{alert(s);Ajax.load(_o.url,fr);}
if(_o.restart){fst();}}
return{setup:function(u,o){if(!u){return;}
o.url=u;_o=fs(o);},reset:function(){_o=_d;},start:function(){fst();},cancel:function(){clearTimeout(_t);}};}();Util.Convert=function(){var _a;function _c(){if(!_a){var _b=document.body;_a=Util.ce("DIV");var s=_a.style;s.position="absolute";s.left=s.top="-999px";s.height="100em";s.width="1px";s.innerHTML="&nbsp;";s.background="#FFF";_b.insertBefore(_a,Util.gc(_b));}
return _a;}
return{px2em:function(p){return(p/_c().offsetHeight)*100;},em2px:function(e){return Math.round((e*_c().offsetHeight)/100);}};}();var Ajax;function XmlHttpObject(){function _g(){var x=null;if(window.XMLHttpRequest){x=new XMLHttpRequest();}
else if(window.ActiveXObject){x=new ActiveXObject('MSXML2.XMLHTTP.3.0');}
return x;}
var x=_g();function _l(u,c,eh,p){try
{var s=u.split("?"),ps=s[1]||"";x.open(p?"POST":"GET",p?s[0]:u,true);x.onreadystatechange=c;x.setRequestHeader("XMLHttpRequest","true");if(p){x.setRequestHeader("Content-type","application/x-www-form-urlencoded");x.setRequestHeader("Content-length",ps.length);x.setRequestHeader("Connection","close");x.send(ps);}
else{x.send(null);}}
catch(e){if(eh){try{eh.call(this,e);}
catch(e2){throw e2;}}}}
return{postContent:function(url,cb,eh){_l(url,cb,eh,true);},loadContent:function(url,cb,eh){_l(url,cb,eh,0);},status:function(){return x.status;},statusText:function(){return x.statusText;},readyState:function(){return x.readyState;},responseText:function(){return x.responseText;},ready:function(){return this.readyState()===4;},loaded:function(){var s=this.status();return Ajax.local?s===200||s===0:s===200;}};}
Ajax=function(){function _bu(o,b,a,s){var u="";for(var i=0;i<o.length;++i){var e=o[i],t=e.type,v=null;if(t=="select-one"||t=="select-multiple"){for(var q=0;q<e.options.length;++q)
{var r=e.options[q];if(r.selected)
{v=r.value;break;}}}
else if(t=="radio"||t=="checkbox"){if(!e.checked){continue;}}
else if(t=="file"||t=="reset"){continue;}else if(t=="submit"&&s&&e!=s){continue;}
if(e.name){u+=u!==""?"&":"";v=v===null?e.value:v;u+=e.name+"="+encodeURIComponent(v);}}
return b?a+"?"+u:u;}
function _exs(e){var s=_gbt("SCRIPT",e);for(var i=0;i<s.length;++i){eval(s[i].innerHTML);}}
function fl(u,f,e,ps){var x=new XmlHttpObject();var r=function(r){var n=new Ajax.Error(x,r);if(e){e.call(this,n);}
else{throw n.error;}};var c=function(){try{if(x.ready()){if(x.loaded()){if(f){f.call(this,x.responseText());}}
else{r.call(this);}}}
catch(e){r.call(this,e,x);}},v=ps?function(){x.postContent(u,c,r);}:function(){x.loadContent(u,c,r);};if(Ajax.local){setTimeout(v,1000);}
else{v();}}
function fp(u,o,f,e,p){if(!u&&!o){return null;}
p=p||{};var U=Util,S=U.Style,r=("clear"in p)?p.clear:false,s=("wait"in p)?p.wait:true,n=function(t){S.rcss(o,"wait");o.innerHTML=t;_exs(o);if(f){f.call(this,t);}};if(s){S.acss(o,"wait");}
if(r){var c=U.gc(o);while(c){o.removeChild(c);c=U.gc(o);}}
function ee(err){S.rcss(o,"wait");if(e){e.call(this,err);}}
return fl(u,n,ee,p.post);}
return{local:false,load:function(u,f,e){fl(u,f,e,0);},post:function(u,f,e){fl(u,f,e,true);},place:function(u,o,f,e,p){fp(u,o,f,e,p);},getFormParams:function(f,b,s){return _bu(f.elements,b,b?f.action:"",s);},getFSParams:function(f,s){var u=_bu(_gbt("input",f),false,"",s),r=_bu(_gbt("select",f),false,"");return u===""?r:u+(r!==""?"&":"")+r;}};}();Ajax.Error=function(x,e){return{xmlHttp:x,error:e,message:function(){return"[JavaScript Error] "+(this.errorError()||"None")+", [XMLHttp Error] "+(this.xmlError()||"None");},errorError:function(){return e?e.message:null;},xmlError:function(){try{if(!x){return"XMLHTTP object is null";}
else{var s=x.status();return"Status: "+(s===undefined?"unknown":s)+", Ready State: "+(x.readyState()||"unknown")+", Response: "+(x.responseText()||"unknown");}}
catch(e){return e.message;}}};};function Animator(o){var _a=[],_t=0,_s=0,_lt,_n,_p={inv:15,dur:450,trans:Animator.TX.linear,step:function(){},fin:function(){}};function fs(o){var p,n={};for(p in _p){if(p){n[p]=o[p]!==undefined?o[p]:_p[p];}}
return n;}
function fg(){var v=_p.trans(_s);for(var i=0;i<_a.length;i++){_a[i].set(v);if(_t!=_s){_a[i].step.call(this);}
else{_a[i].fin.call(this);}}}
function fot(){var n=new Date().getTime(),d=n-_lt,m=(d/_p.dur)*(_s<_t?1:-1);_lt=n;if(Math.abs(m)>=Math.abs(_s-_t)){_s=_t;}
else{_s+=m;}
try{fg();}finally{_p.step.call(this);if(_t==_s){window.clearInterval(_n);_n=null;_p.fin.call(this);}}}
function fft(from,to){_t=Math.max(0,Math.min(1,to));_s=Math.max(0,Math.min(1,from));_lt=new Date().getTime();if(!_n){_n=window.setInterval(fot,_p.inv);}}
function ft(to){fft(_s,to);}
o=o||{};_p=fs(o);return{toggle:function(){ft(1-_t);},add:function(a){_a[_a.length]=a;return this;},clear:function(){_a=[];_lt=null;},play:function(){fft(0,1);},reverse:function(){fft(1,0);},setOptions:function(o){_p=fs(o);},getOptions:function(){return _p;}};}
Animator.Queue=function(as){var a=false;function ft(e){if(e===null){return[];}
if(e.tagName||!e.length){return[e];}
return e;}
function fp(o1,o2){o1.setOptions({fin:function(){o1._of.call();o2.play();}});}
function fr(o1,o2){o1.setOptions({fin:function(){o2.reverse();o1._of.call();}});}
function fl(o){var p=o.getOptions(),f=p.fin;o.setOptions({fin:function(){a=false;f.call();for(var i=0;i<as.length;i++){as[i].setOptions({fin:as[i]._of});}}});}
ft(as);for(var i=0;i<as.length;i++){as[i]._of=as[i].getOptions().fin;}
return{play:function(){if(a){return;}
a=true;for(var i=0;i<as.length-1;i++){fp(as[i],as[i+1]);}
fl(as[as.length-1]);as[0].play();},reverse:function(){if(a){return;}
a=true;for(var i=as.length-1;i>0;i--){fr(as[i],as[i-1]);}
fl(as[0]);as[as.length-1].reverse();}};};Animator.TX=function(){function ei(a){a=a||1;return function(s){return Math.pow(s,a*2);};}
function eo(a){a=a||1;return function(s){return 1-Math.pow(1-s,a*2);};}
function el(a){return function(s){s=Animator.TX.easeInOut(s);return((1-Math.cos(s*Math.PI*a))*(1-s))+s;};}
return{linear:function(x){return x;},easeIn:ei(1.5),easeOut:eo(1.5),strongEaseIn:ei(2.5),strongEaseOut:eo(2.5),easeInOut:function(pos){return((-Math.cos(pos*Math.PI)/2)+0.5);},elastic:el(1),veryElastic:el(3)};}();Animator.Animation=function(set,step,fin){return{set:set||function(){},step:step||function(){},fin:fin||function(){}};};Animator.Animations=function(){function ft(e){if(e===null){return[];}
if(e.tagName||!e.length){return[e];}
return e;}
return{Numeric:function(es,p,f,t,u,o){var ff,tf;es=ft(es);u=u||"px";o=o||{};if(typeof f==="function"){ff=function(){return f();};}
else{ff=function(){return f;};}
if(typeof t==="function"){tf=function(){return t();};}
else{tf=function(){return t;};}
var set=function(v){for(var i=0;i<es.length;i++){var x=ff()+((tf()-ff())*v);if(o.enf0){x=x<0?0:x;}
es[i].style[p]=x+u;}};var step=o.step||function(){};var fin=function(){if(o.fin){o.fin.call(this);}};return new Animator.Animation(set,step,fin);},Color:function(es,p,f,t){function fca(c){return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function fh(n){n=n>255?255:n;var d=n.toString(16);if(n<16){return'0'+d;}
return d;}
function fp(i,s){return Math.round(f[i]+((t[i]-f[i])*s));}
var set=function(state){var c='#'+fh(fp(0,state))+fh(fp(1,state))+fh(fp(2,state));for(var i=0;i<es.length;i++){es[i].style[p]=c;}};var fin=function(){for(var i=0;i<es.length;i++){es[i].style[p]=t;}};es=ft(es);for(var i=0;i<es.length;i++){es[i].style[p]=f;}
t=fca(t);f=fca(f);return new Animator.Animation(set,null,fin);},Opacity:function(es,f,t){es=ft(es);function st(v){for(var i=0;i<es.length;i++){var e=es[i].style,x=f+(t-f)*v;e.opacity=e.mozOpacity=x;e.zoom=1;e.filter=x===1?"":"alpha(opacity="+x*100+")";}}
function fin(){for(var i=0;i<es.length;i++){var e=es[i].style;if(e.opacity===1){e.filter="";}}}
return new Animator.Animation(st,null,fin);}};}();