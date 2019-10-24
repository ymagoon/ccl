// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
document.createElement("canvas").getContext||(function(){var s=Math,j=s.round,F=s.sin,G=s.cos,V=s.abs,W=s.sqrt,k=10,v=k/2;function X(){return this.context_||(this.context_=new H(this))}var L=Array.prototype.slice;function Y(b,a){var c=L.call(arguments,2);return function(){return b.apply(a,c.concat(L.call(arguments)))}}var M={init:function(b){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var a=b||document;a.createElement("canvas");a.attachEvent("onreadystatechange",Y(this.init_,this,a))}},init_:function(b){b.namespaces.g_vml_||
b.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML");b.namespaces.g_o_||b.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML");if(!b.styleSheets.ex_canvas_){var a=b.createStyleSheet();a.owningElement.id="ex_canvas_";a.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}"}var c=b.getElementsByTagName("canvas"),d=0;for(;d<c.length;d++)this.initElement(c[d])},
initElement:function(b){if(!b.getContext){b.getContext=X;b.innerHTML="";b.attachEvent("onpropertychange",Z);b.attachEvent("onresize",$);var a=b.attributes;if(a.width&&a.width.specified)b.style.width=a.width.nodeValue+"px";else b.width=b.clientWidth;if(a.height&&a.height.specified)b.style.height=a.height.nodeValue+"px";else b.height=b.clientHeight}return b}};function Z(b){var a=b.srcElement;switch(b.propertyName){case "width":a.style.width=a.attributes.width.nodeValue+"px";a.getContext().clearRect();
break;case "height":a.style.height=a.attributes.height.nodeValue+"px";a.getContext().clearRect();break}}function $(b){var a=b.srcElement;if(a.firstChild){a.firstChild.style.width=a.clientWidth+"px";a.firstChild.style.height=a.clientHeight+"px"}}M.init();var N=[],B=0;for(;B<16;B++){var C=0;for(;C<16;C++)N[B*16+C]=B.toString(16)+C.toString(16)}function I(){return[[1,0,0],[0,1,0],[0,0,1]]}function y(b,a){var c=I(),d=0;for(;d<3;d++){var f=0;for(;f<3;f++){var h=0,g=0;for(;g<3;g++)h+=b[d][g]*a[g][f];c[d][f]=
h}}return c}function O(b,a){a.fillStyle=b.fillStyle;a.lineCap=b.lineCap;a.lineJoin=b.lineJoin;a.lineWidth=b.lineWidth;a.miterLimit=b.miterLimit;a.shadowBlur=b.shadowBlur;a.shadowColor=b.shadowColor;a.shadowOffsetX=b.shadowOffsetX;a.shadowOffsetY=b.shadowOffsetY;a.strokeStyle=b.strokeStyle;a.globalAlpha=b.globalAlpha;a.arcScaleX_=b.arcScaleX_;a.arcScaleY_=b.arcScaleY_;a.lineScale_=b.lineScale_}function P(b){var a,c=1;b=String(b);if(b.substring(0,3)=="rgb"){var d=b.indexOf("(",3),f=b.indexOf(")",d+
1),h=b.substring(d+1,f).split(",");a="#";var g=0;for(;g<3;g++)a+=N[Number(h[g])];if(h.length==4&&b.substr(3,1)=="a")c=h[3]}else a=b;return{color:a,alpha:c}}function aa(b){switch(b){case "butt":return"flat";case "round":return"round";case "square":default:return"square"}}function H(b){this.m_=I();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.fillStyle=this.strokeStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=k*1;this.globalAlpha=1;this.canvas=b;
var a=b.ownerDocument.createElement("div");a.style.width=b.clientWidth+"px";a.style.height=b.clientHeight+"px";a.style.overflow="hidden";a.style.position="absolute";b.appendChild(a);this.element_=a;this.lineScale_=this.arcScaleY_=this.arcScaleX_=1}var i=H.prototype;i.clearRect=function(){this.element_.innerHTML=""};i.beginPath=function(){this.currentPath_=[]};i.moveTo=function(b,a){var c=this.getCoords_(b,a);this.currentPath_.push({type:"moveTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};
i.lineTo=function(b,a){var c=this.getCoords_(b,a);this.currentPath_.push({type:"lineTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};i.bezierCurveTo=function(b,a,c,d,f,h){var g=this.getCoords_(f,h),l=this.getCoords_(b,a),e=this.getCoords_(c,d);Q(this,l,e,g)};function Q(b,a,c,d){b.currentPath_.push({type:"bezierCurveTo",cp1x:a.x,cp1y:a.y,cp2x:c.x,cp2y:c.y,x:d.x,y:d.y});b.currentX_=d.x;b.currentY_=d.y}i.quadraticCurveTo=function(b,a,c,d){var f=this.getCoords_(b,a),h=this.getCoords_(c,d),g={x:this.currentX_+
0.6666666666666666*(f.x-this.currentX_),y:this.currentY_+0.6666666666666666*(f.y-this.currentY_)};Q(this,g,{x:g.x+(h.x-this.currentX_)/3,y:g.y+(h.y-this.currentY_)/3},h)};i.arc=function(b,a,c,d,f,h){c*=k;var g=h?"at":"wa",l=b+G(d)*c-v,e=a+F(d)*c-v,m=b+G(f)*c-v,r=a+F(f)*c-v;if(l==m&&!h)l+=0.125;var n=this.getCoords_(b,a),o=this.getCoords_(l,e),q=this.getCoords_(m,r);this.currentPath_.push({type:g,x:n.x,y:n.y,radius:c,xStart:o.x,yStart:o.y,xEnd:q.x,yEnd:q.y})};i.rect=function(b,a,c,d){this.moveTo(b,
a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath()};i.strokeRect=function(b,a,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(b,a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath();this.stroke();this.currentPath_=f};i.fillRect=function(b,a,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(b,a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath();this.fill();this.currentPath_=f};i.createLinearGradient=function(b,
a,c,d){var f=new D("gradient");f.x0_=b;f.y0_=a;f.x1_=c;f.y1_=d;return f};i.createRadialGradient=function(b,a,c,d,f,h){var g=new D("gradientradial");g.x0_=b;g.y0_=a;g.r0_=c;g.x1_=d;g.y1_=f;g.r1_=h;return g};i.drawImage=function(b){var a,c,d,f,h,g,l,e,m=b.runtimeStyle.width,r=b.runtimeStyle.height;b.runtimeStyle.width="auto";b.runtimeStyle.height="auto";var n=b.width,o=b.height;b.runtimeStyle.width=m;b.runtimeStyle.height=r;if(arguments.length==3){a=arguments[1];c=arguments[2];h=g=0;l=d=n;e=f=o}else if(arguments.length==
5){a=arguments[1];c=arguments[2];d=arguments[3];f=arguments[4];h=g=0;l=n;e=o}else if(arguments.length==9){h=arguments[1];g=arguments[2];l=arguments[3];e=arguments[4];a=arguments[5];c=arguments[6];d=arguments[7];f=arguments[8]}else throw Error("Invalid number of arguments");var q=this.getCoords_(a,c),t=[];t.push(" <g_vml_:group",' coordsize="',k*10,",",k*10,'"',' coordorigin="0,0"',' style="width:',10,"px;height:",10,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]){var E=[];E.push("M11=",
this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",j(q.x/k),",","Dy=",j(q.y/k),"");var p=q,z=this.getCoords_(a+d,c),w=this.getCoords_(a,c+f),x=this.getCoords_(a+d,c+f);p.x=s.max(p.x,z.x,w.x,x.x);p.y=s.max(p.y,z.y,w.y,x.y);t.push("padding:0 ",j(p.x/k),"px ",j(p.y/k),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",E.join(""),", sizingmethod='clip');")}else t.push("top:",j(q.y/k),"px;left:",j(q.x/k),"px;");t.push(' ">','<g_vml_:image src="',b.src,
'"',' style="width:',k*d,"px;"," height:",k*f,'px;"',' cropleft="',h/n,'"',' croptop="',g/o,'"',' cropright="',(n-h-l)/n,'"',' cropbottom="',(o-g-e)/o,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",t.join(""))};i.stroke=function(b){var a=[],c=P(b?this.fillStyle:this.strokeStyle),d=c.color,f=c.alpha*this.globalAlpha;a.push("<g_vml_:shape",' filled="',!!b,'"',' style="position:absolute;width:',10,"px;height:",10,'px;"',' coordorigin="0 0" coordsize="',k*10," ",k*10,'"',' stroked="',
!b,'"',' path="');var h={x:null,y:null},g={x:null,y:null},l=0;for(;l<this.currentPath_.length;l++){var e=this.currentPath_[l];switch(e.type){case "moveTo":a.push(" m ",j(e.x),",",j(e.y));break;case "lineTo":a.push(" l ",j(e.x),",",j(e.y));break;case "close":a.push(" x ");e=null;break;case "bezierCurveTo":a.push(" c ",j(e.cp1x),",",j(e.cp1y),",",j(e.cp2x),",",j(e.cp2y),",",j(e.x),",",j(e.y));break;case "at":case "wa":a.push(" ",e.type," ",j(e.x-this.arcScaleX_*e.radius),",",j(e.y-this.arcScaleY_*e.radius),
" ",j(e.x+this.arcScaleX_*e.radius),",",j(e.y+this.arcScaleY_*e.radius)," ",j(e.xStart),",",j(e.yStart)," ",j(e.xEnd),",",j(e.yEnd));break}if(e){if(h.x==null||e.x<h.x)h.x=e.x;if(g.x==null||e.x>g.x)g.x=e.x;if(h.y==null||e.y<h.y)h.y=e.y;if(g.y==null||e.y>g.y)g.y=e.y}}a.push(' ">');if(b)if(typeof this.fillStyle=="object"){var m=this.fillStyle,r=0,n={x:0,y:0},o=0,q=1;if(m.type_=="gradient"){var t=m.x1_/this.arcScaleX_,E=m.y1_/this.arcScaleY_,p=this.getCoords_(m.x0_/this.arcScaleX_,m.y0_/this.arcScaleY_),
z=this.getCoords_(t,E);r=Math.atan2(z.x-p.x,z.y-p.y)*180/Math.PI;if(r<0)r+=360;if(r<1.0E-6)r=0}else{var p=this.getCoords_(m.x0_,m.y0_),w=g.x-h.x,x=g.y-h.y;n={x:(p.x-h.x)/w,y:(p.y-h.y)/x};w/=this.arcScaleX_*k;x/=this.arcScaleY_*k;var R=s.max(w,x);o=2*m.r0_/R;q=2*m.r1_/R-o}var u=m.colors_;u.sort(function(ba,ca){return ba.offset-ca.offset});var J=u.length,da=u[0].color,ea=u[J-1].color,fa=u[0].alpha*this.globalAlpha,ga=u[J-1].alpha*this.globalAlpha,S=[],l=0;for(;l<J;l++){var T=u[l];S.push(T.offset*q+
o+" "+T.color)}a.push('<g_vml_:fill type="',m.type_,'"',' method="none" focus="100%"',' color="',da,'"',' color2="',ea,'"',' colors="',S.join(","),'"',' opacity="',ga,'"',' g_o_:opacity2="',fa,'"',' angle="',r,'"',' focusposition="',n.x,",",n.y,'" />')}else a.push('<g_vml_:fill color="',d,'" opacity="',f,'" />');else{var K=this.lineScale_*this.lineWidth;if(K<1)f*=K;a.push("<g_vml_:stroke",' opacity="',f,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',aa(this.lineCap),
'"',' weight="',K,'px"',' color="',d,'" />')}a.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",a.join(""))};i.fill=function(){this.stroke(true)};i.closePath=function(){this.currentPath_.push({type:"close"})};i.getCoords_=function(b,a){var c=this.m_;return{x:k*(b*c[0][0]+a*c[1][0]+c[2][0])-v,y:k*(b*c[0][1]+a*c[1][1]+c[2][1])-v}};i.save=function(){var b={};O(this,b);this.aStack_.push(b);this.mStack_.push(this.m_);this.m_=y(I(),this.m_)};i.restore=function(){O(this.aStack_.pop(),
this);this.m_=this.mStack_.pop()};function ha(b){var a=0;for(;a<3;a++){var c=0;for(;c<2;c++)if(!isFinite(b[a][c])||isNaN(b[a][c]))return false}return true}function A(b,a,c){if(!!ha(a)){b.m_=a;if(c)b.lineScale_=W(V(a[0][0]*a[1][1]-a[0][1]*a[1][0]))}}i.translate=function(b,a){A(this,y([[1,0,0],[0,1,0],[b,a,1]],this.m_),false)};i.rotate=function(b){var a=G(b),c=F(b);A(this,y([[a,c,0],[-c,a,0],[0,0,1]],this.m_),false)};i.scale=function(b,a){this.arcScaleX_*=b;this.arcScaleY_*=a;A(this,y([[b,0,0],[0,a,
0],[0,0,1]],this.m_),true)};i.transform=function(b,a,c,d,f,h){A(this,y([[b,a,0],[c,d,0],[f,h,1]],this.m_),true)};i.setTransform=function(b,a,c,d,f,h){A(this,[[b,a,0],[c,d,0],[f,h,1]],true)};i.clip=function(){};i.arcTo=function(){};i.createPattern=function(){return new U};function D(b){this.type_=b;this.r1_=this.y1_=this.x1_=this.r0_=this.y0_=this.x0_=0;this.colors_=[]}D.prototype.addColorStop=function(b,a){a=P(a);this.colors_.push({offset:b,color:a.color,alpha:a.alpha})};function U(){}G_vmlCanvasManager=
M;CanvasRenderingContext2D=H;CanvasGradient=D;CanvasPattern=U})();
/*!
 * jQuery JavaScript Library v1.4.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 11 19:04:53 2010 -0500
 */
(function(E,B){function ka(a,b,d){if(d===B&&a.nodeType===1){d=a.getAttribute("data-"+b);if(typeof d==="string"){try{d=d==="true"?true:d==="false"?false:d==="null"?null:!c.isNaN(d)?parseFloat(d):Ja.test(d)?c.parseJSON(d):d}catch(e){}c.data(a,b,d)}else d=B}return d}function U(){return false}function ca(){return true}function la(a,b,d){d[0].type=a;return c.event.handle.apply(b,d)}function Ka(a){var b,d,e,f,h,l,k,o,x,r,A,C=[];f=[];h=c.data(this,this.nodeType?"events":"__events__");if(typeof h==="function")h=
h.events;if(!(a.liveFired===this||!h||!h.live||a.button&&a.type==="click")){if(a.namespace)A=RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)");a.liveFired=this;var J=h.live.slice(0);for(k=0;k<J.length;k++){h=J[k];h.origType.replace(X,"")===a.type?f.push(h.selector):J.splice(k--,1)}f=c(a.target).closest(f,a.currentTarget);o=0;for(x=f.length;o<x;o++){r=f[o];for(k=0;k<J.length;k++){h=J[k];if(r.selector===h.selector&&(!A||A.test(h.namespace))){l=r.elem;e=null;if(h.preType==="mouseenter"||
h.preType==="mouseleave"){a.type=h.preType;e=c(a.relatedTarget).closest(h.selector)[0]}if(!e||e!==l)C.push({elem:l,handleObj:h,level:r.level})}}}o=0;for(x=C.length;o<x;o++){f=C[o];if(d&&f.level>d)break;a.currentTarget=f.elem;a.data=f.handleObj.data;a.handleObj=f.handleObj;A=f.handleObj.origHandler.apply(f.elem,arguments);if(A===false||a.isPropagationStopped()){d=f.level;if(A===false)b=false;if(a.isImmediatePropagationStopped())break}}return b}}function Y(a,b){return(a&&a!=="*"?a+".":"")+b.replace(La,
"`").replace(Ma,"&")}function ma(a,b,d){if(c.isFunction(b))return c.grep(a,function(f,h){return!!b.call(f,h,f)===d});else if(b.nodeType)return c.grep(a,function(f){return f===b===d});else if(typeof b==="string"){var e=c.grep(a,function(f){return f.nodeType===1});if(Na.test(b))return c.filter(b,e,!d);else b=c.filter(b,e)}return c.grep(a,function(f){return c.inArray(f,b)>=0===d})}function na(a,b){var d=0;b.each(function(){if(this.nodeName===(a[d]&&a[d].nodeName)){var e=c.data(a[d++]),f=c.data(this,
e);if(e=e&&e.events){delete f.handle;f.events={};for(var h in e)for(var l in e[h])c.event.add(this,h,e[h][l],e[h][l].data)}}})}function Oa(a,b){b.src?c.ajax({url:b.src,async:false,dataType:"script"}):c.globalEval(b.text||b.textContent||b.innerHTML||"");b.parentNode&&b.parentNode.removeChild(b)}function oa(a,b,d){var e=b==="width"?a.offsetWidth:a.offsetHeight;if(d==="border")return e;c.each(b==="width"?Pa:Qa,function(){d||(e-=parseFloat(c.css(a,"padding"+this))||0);if(d==="margin")e+=parseFloat(c.css(a,
"margin"+this))||0;else e-=parseFloat(c.css(a,"border"+this+"Width"))||0});return e}function da(a,b,d,e){if(c.isArray(b)&&b.length)c.each(b,function(f,h){d||Ra.test(a)?e(a,h):da(a+"["+(typeof h==="object"||c.isArray(h)?f:"")+"]",h,d,e)});else if(!d&&b!=null&&typeof b==="object")c.isEmptyObject(b)?e(a,""):c.each(b,function(f,h){da(a+"["+f+"]",h,d,e)});else e(a,b)}function S(a,b){var d={};c.each(pa.concat.apply([],pa.slice(0,b)),function(){d[this]=a});return d}function qa(a){if(!ea[a]){var b=c("<"+
a+">").appendTo("body"),d=b.css("display");b.remove();if(d==="none"||d==="")d="block";ea[a]=d}return ea[a]}function fa(a){return c.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:false}var t=E.document,c=function(){function a(){if(!b.isReady){try{t.documentElement.doScroll("left")}catch(j){setTimeout(a,1);return}b.ready()}}var b=function(j,s){return new b.fn.init(j,s)},d=E.jQuery,e=E.$,f,h=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,l=/\S/,k=/^\s+/,o=/\s+$/,x=/\W/,r=/\d/,A=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,
C=/^[\],:{}\s]*$/,J=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,w=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,I=/(?:^|:|,)(?:\s*\[)+/g,L=/(webkit)[ \/]([\w.]+)/,g=/(opera)(?:.*version)?[ \/]([\w.]+)/,i=/(msie) ([\w.]+)/,n=/(mozilla)(?:.*? rv:([\w.]+))?/,m=navigator.userAgent,p=false,q=[],u,y=Object.prototype.toString,F=Object.prototype.hasOwnProperty,M=Array.prototype.push,N=Array.prototype.slice,O=String.prototype.trim,D=Array.prototype.indexOf,R={};b.fn=b.prototype={init:function(j,
s){var v,z,H;if(!j)return this;if(j.nodeType){this.context=this[0]=j;this.length=1;return this}if(j==="body"&&!s&&t.body){this.context=t;this[0]=t.body;this.selector="body";this.length=1;return this}if(typeof j==="string")if((v=h.exec(j))&&(v[1]||!s))if(v[1]){H=s?s.ownerDocument||s:t;if(z=A.exec(j))if(b.isPlainObject(s)){j=[t.createElement(z[1])];b.fn.attr.call(j,s,true)}else j=[H.createElement(z[1])];else{z=b.buildFragment([v[1]],[H]);j=(z.cacheable?z.fragment.cloneNode(true):z.fragment).childNodes}return b.merge(this,
j)}else{if((z=t.getElementById(v[2]))&&z.parentNode){if(z.id!==v[2])return f.find(j);this.length=1;this[0]=z}this.context=t;this.selector=j;return this}else if(!s&&!x.test(j)){this.selector=j;this.context=t;j=t.getElementsByTagName(j);return b.merge(this,j)}else return!s||s.jquery?(s||f).find(j):b(s).find(j);else if(b.isFunction(j))return f.ready(j);if(j.selector!==B){this.selector=j.selector;this.context=j.context}return b.makeArray(j,this)},selector:"",jquery:"1.4.4",length:0,size:function(){return this.length},
toArray:function(){return N.call(this,0)},get:function(j){return j==null?this.toArray():j<0?this.slice(j)[0]:this[j]},pushStack:function(j,s,v){var z=b();b.isArray(j)?M.apply(z,j):b.merge(z,j);z.prevObject=this;z.context=this.context;if(s==="find")z.selector=this.selector+(this.selector?" ":"")+v;else if(s)z.selector=this.selector+"."+s+"("+v+")";return z},each:function(j,s){return b.each(this,j,s)},ready:function(j){b.bindReady();if(b.isReady)j.call(t,b);else q&&q.push(j);return this},eq:function(j){return j===
-1?this.slice(j):this.slice(j,+j+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(N.apply(this,arguments),"slice",N.call(arguments).join(","))},map:function(j){return this.pushStack(b.map(this,function(s,v){return j.call(s,v,s)}))},end:function(){return this.prevObject||b(null)},push:M,sort:[].sort,splice:[].splice};b.fn.init.prototype=b.fn;b.extend=b.fn.extend=function(){var j,s,v,z,H,G=arguments[0]||{},K=1,Q=arguments.length,ga=false;
if(typeof G==="boolean"){ga=G;G=arguments[1]||{};K=2}if(typeof G!=="object"&&!b.isFunction(G))G={};if(Q===K){G=this;--K}for(;K<Q;K++)if((j=arguments[K])!=null)for(s in j){v=G[s];z=j[s];if(G!==z)if(ga&&z&&(b.isPlainObject(z)||(H=b.isArray(z)))){if(H){H=false;v=v&&b.isArray(v)?v:[]}else v=v&&b.isPlainObject(v)?v:{};G[s]=b.extend(ga,v,z)}else if(z!==B)G[s]=z}return G};b.extend({noConflict:function(j){E.$=e;if(j)E.jQuery=d;return b},isReady:false,readyWait:1,ready:function(j){j===true&&b.readyWait--;
if(!b.readyWait||j!==true&&!b.isReady){if(!t.body)return setTimeout(b.ready,1);b.isReady=true;if(!(j!==true&&--b.readyWait>0))if(q){var s=0,v=q;for(q=null;j=v[s++];)j.call(t,b);b.fn.trigger&&b(t).trigger("ready").unbind("ready")}}},bindReady:function(){if(!p){p=true;if(t.readyState==="complete")return setTimeout(b.ready,1);if(t.addEventListener){t.addEventListener("DOMContentLoaded",u,false);E.addEventListener("load",b.ready,false)}else if(t.attachEvent){t.attachEvent("onreadystatechange",u);E.attachEvent("onload",
b.ready);var j=false;try{j=E.frameElement==null}catch(s){}t.documentElement.doScroll&&j&&a()}}},isFunction:function(j){return b.type(j)==="function"},isArray:Array.isArray||function(j){return b.type(j)==="array"},isWindow:function(j){return j&&typeof j==="object"&&"setInterval"in j},isNaN:function(j){return j==null||!r.test(j)||isNaN(j)},type:function(j){return j==null?String(j):R[y.call(j)]||"object"},isPlainObject:function(j){if(!j||b.type(j)!=="object"||j.nodeType||b.isWindow(j))return false;if(j.constructor&&
!F.call(j,"constructor")&&!F.call(j.constructor.prototype,"isPrototypeOf"))return false;for(var s in j);return s===B||F.call(j,s)},isEmptyObject:function(j){for(var s in j)return false;return true},error:function(j){throw j;},parseJSON:function(j){if(typeof j!=="string"||!j)return null;j=b.trim(j);if(C.test(j.replace(J,"@").replace(w,"]").replace(I,"")))return E.JSON&&E.JSON.parse?E.JSON.parse(j):(new Function("return "+j))();else b.error("Invalid JSON: "+j)},noop:function(){},globalEval:function(j){if(j&&
l.test(j)){var s=t.getElementsByTagName("head")[0]||t.documentElement,v=t.createElement("script");v.type="text/javascript";if(b.support.scriptEval)v.appendChild(t.createTextNode(j));else v.text=j;s.insertBefore(v,s.firstChild);s.removeChild(v)}},nodeName:function(j,s){return j.nodeName&&j.nodeName.toUpperCase()===s.toUpperCase()},each:function(j,s,v){var z,H=0,G=j.length,K=G===B||b.isFunction(j);if(v)if(K)for(z in j){if(s.apply(j[z],v)===false)break}else for(;H<G;){if(s.apply(j[H++],v)===false)break}else if(K)for(z in j){if(s.call(j[z],
z,j[z])===false)break}else for(v=j[0];H<G&&s.call(v,H,v)!==false;v=j[++H]);return j},trim:O?function(j){return j==null?"":O.call(j)}:function(j){return j==null?"":j.toString().replace(k,"").replace(o,"")},makeArray:function(j,s){var v=s||[];if(j!=null){var z=b.type(j);j.length==null||z==="string"||z==="function"||z==="regexp"||b.isWindow(j)?M.call(v,j):b.merge(v,j)}return v},inArray:function(j,s){if(s.indexOf)return s.indexOf(j);for(var v=0,z=s.length;v<z;v++)if(s[v]===j)return v;return-1},merge:function(j,
s){var v=j.length,z=0;if(typeof s.length==="number")for(var H=s.length;z<H;z++)j[v++]=s[z];else for(;s[z]!==B;)j[v++]=s[z++];j.length=v;return j},grep:function(j,s,v){var z=[],H;v=!!v;for(var G=0,K=j.length;G<K;G++){H=!!s(j[G],G);v!==H&&z.push(j[G])}return z},map:function(j,s,v){for(var z=[],H,G=0,K=j.length;G<K;G++){H=s(j[G],G,v);if(H!=null)z[z.length]=H}return z.concat.apply([],z)},guid:1,proxy:function(j,s,v){if(arguments.length===2)if(typeof s==="string"){v=j;j=v[s];s=B}else if(s&&!b.isFunction(s)){v=
s;s=B}if(!s&&j)s=function(){return j.apply(v||this,arguments)};if(j)s.guid=j.guid=j.guid||s.guid||b.guid++;return s},access:function(j,s,v,z,H,G){var K=j.length;if(typeof s==="object"){for(var Q in s)b.access(j,Q,s[Q],z,H,v);return j}if(v!==B){z=!G&&z&&b.isFunction(v);for(Q=0;Q<K;Q++)H(j[Q],s,z?v.call(j[Q],Q,H(j[Q],s)):v,G);return j}return K?H(j[0],s):B},now:function(){return(new Date).getTime()},uaMatch:function(j){j=j.toLowerCase();j=L.exec(j)||g.exec(j)||i.exec(j)||j.indexOf("compatible")<0&&n.exec(j)||
[];return{browser:j[1]||"",version:j[2]||"0"}},browser:{}});b.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(j,s){R["[object "+s+"]"]=s.toLowerCase()});m=b.uaMatch(m);if(m.browser){b.browser[m.browser]=true;b.browser.version=m.version}if(b.browser.webkit)b.browser.safari=true;if(D)b.inArray=function(j,s){return D.call(s,j)};if(!/\s/.test("\u00a0")){k=/^[\s\xA0]+/;o=/[\s\xA0]+$/}f=b(t);if(t.addEventListener)u=function(){t.removeEventListener("DOMContentLoaded",u,
false);b.ready()};else if(t.attachEvent)u=function(){if(t.readyState==="complete"){t.detachEvent("onreadystatechange",u);b.ready()}};return E.jQuery=E.$=b}();(function(){c.support={};var a=t.documentElement,b=t.createElement("script"),d=t.createElement("div"),e="script"+c.now();d.style.display="none";d.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var f=d.getElementsByTagName("*"),h=d.getElementsByTagName("a")[0],l=t.createElement("select"),
k=l.appendChild(t.createElement("option"));if(!(!f||!f.length||!h)){c.support={leadingWhitespace:d.firstChild.nodeType===3,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/red/.test(h.getAttribute("style")),hrefNormalized:h.getAttribute("href")==="/a",opacity:/^0.55$/.test(h.style.opacity),cssFloat:!!h.style.cssFloat,checkOn:d.getElementsByTagName("input")[0].value==="on",optSelected:k.selected,deleteExpando:true,optDisabled:false,checkClone:false,
scriptEval:false,noCloneEvent:true,boxModel:null,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableHiddenOffsets:true};l.disabled=true;c.support.optDisabled=!k.disabled;b.type="text/javascript";try{b.appendChild(t.createTextNode("window."+e+"=1;"))}catch(o){}a.insertBefore(b,a.firstChild);if(E[e]){c.support.scriptEval=true;delete E[e]}try{delete b.test}catch(x){c.support.deleteExpando=false}a.removeChild(b);if(d.attachEvent&&d.fireEvent){d.attachEvent("onclick",function r(){c.support.noCloneEvent=
false;d.detachEvent("onclick",r)});d.cloneNode(true).fireEvent("onclick")}d=t.createElement("div");d.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";a=t.createDocumentFragment();a.appendChild(d.firstChild);c.support.checkClone=a.cloneNode(true).cloneNode(true).lastChild.checked;c(function(){var r=t.createElement("div");r.style.width=r.style.paddingLeft="1px";t.body.appendChild(r);c.boxModel=c.support.boxModel=r.offsetWidth===2;if("zoom"in r.style){r.style.display="inline";r.style.zoom=
1;c.support.inlineBlockNeedsLayout=r.offsetWidth===2;r.style.display="";r.innerHTML="<div style='width:4px;'></div>";c.support.shrinkWrapBlocks=r.offsetWidth!==2}r.innerHTML="<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";var A=r.getElementsByTagName("td");c.support.reliableHiddenOffsets=A[0].offsetHeight===0;A[0].style.display="";A[1].style.display="none";c.support.reliableHiddenOffsets=c.support.reliableHiddenOffsets&&A[0].offsetHeight===0;r.innerHTML="";t.body.removeChild(r).style.display=
"none"});a=function(r){var A=t.createElement("div");r="on"+r;var C=r in A;if(!C){A.setAttribute(r,"return;");C=typeof A[r]==="function"}return C};c.support.submitBubbles=a("submit");c.support.changeBubbles=a("change");a=b=d=f=h=null}})();var ra={},Ja=/^(?:\{.*\}|\[.*\])$/;c.extend({cache:{},uuid:0,expando:"jQuery"+c.now(),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},data:function(a,b,d){if(c.acceptData(a)){a=a==E?ra:a;var e=a.nodeType,f=e?a[c.expando]:null,h=
c.cache;if(!(e&&!f&&typeof b==="string"&&d===B)){if(e)f||(a[c.expando]=f=++c.uuid);else h=a;if(typeof b==="object")if(e)h[f]=c.extend(h[f],b);else c.extend(h,b);else if(e&&!h[f])h[f]={};a=e?h[f]:h;if(d!==B)a[b]=d;return typeof b==="string"?a[b]:a}}},removeData:function(a,b){if(c.acceptData(a)){a=a==E?ra:a;var d=a.nodeType,e=d?a[c.expando]:a,f=c.cache,h=d?f[e]:e;if(b){if(h){delete h[b];d&&c.isEmptyObject(h)&&c.removeData(a)}}else if(d&&c.support.deleteExpando)delete a[c.expando];else if(a.removeAttribute)a.removeAttribute(c.expando);
else if(d)delete f[e];else for(var l in a)delete a[l]}},acceptData:function(a){if(a.nodeName){var b=c.noData[a.nodeName.toLowerCase()];if(b)return!(b===true||a.getAttribute("classid")!==b)}return true}});c.fn.extend({data:function(a,b){var d=null;if(typeof a==="undefined"){if(this.length){var e=this[0].attributes,f;d=c.data(this[0]);for(var h=0,l=e.length;h<l;h++){f=e[h].name;if(f.indexOf("data-")===0){f=f.substr(5);ka(this[0],f,d[f])}}}return d}else if(typeof a==="object")return this.each(function(){c.data(this,
a)});var k=a.split(".");k[1]=k[1]?"."+k[1]:"";if(b===B){d=this.triggerHandler("getData"+k[1]+"!",[k[0]]);if(d===B&&this.length){d=c.data(this[0],a);d=ka(this[0],a,d)}return d===B&&k[1]?this.data(k[0]):d}else return this.each(function(){var o=c(this),x=[k[0],b];o.triggerHandler("setData"+k[1]+"!",x);c.data(this,a,b);o.triggerHandler("changeData"+k[1]+"!",x)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({queue:function(a,b,d){if(a){b=(b||"fx")+"queue";var e=
c.data(a,b);if(!d)return e||[];if(!e||c.isArray(d))e=c.data(a,b,c.makeArray(d));else e.push(d);return e}},dequeue:function(a,b){b=b||"fx";var d=c.queue(a,b),e=d.shift();if(e==="inprogress")e=d.shift();if(e){b==="fx"&&d.unshift("inprogress");e.call(a,function(){c.dequeue(a,b)})}}});c.fn.extend({queue:function(a,b){if(typeof a!=="string"){b=a;a="fx"}if(b===B)return c.queue(this[0],a);return this.each(function(){var d=c.queue(this,a,b);a==="fx"&&d[0]!=="inprogress"&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,
a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var sa=/[\n\t]/g,ha=/\s+/,Sa=/\r/g,Ta=/^(?:href|src|style)$/,Ua=/^(?:button|input)$/i,Va=/^(?:button|input|object|select|textarea)$/i,Wa=/^a(?:rea)?$/i,ta=/^(?:radio|checkbox)$/i;c.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",
colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"};c.fn.extend({attr:function(a,b){return c.access(this,a,b,true,c.attr)},removeAttr:function(a){return this.each(function(){c.attr(this,a,"");this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(c.isFunction(a))return this.each(function(x){var r=c(this);r.addClass(a.call(this,x,r.attr("class")))});if(a&&typeof a==="string")for(var b=(a||"").split(ha),d=0,e=this.length;d<e;d++){var f=this[d];if(f.nodeType===
1)if(f.className){for(var h=" "+f.className+" ",l=f.className,k=0,o=b.length;k<o;k++)if(h.indexOf(" "+b[k]+" ")<0)l+=" "+b[k];f.className=c.trim(l)}else f.className=a}return this},removeClass:function(a){if(c.isFunction(a))return this.each(function(o){var x=c(this);x.removeClass(a.call(this,o,x.attr("class")))});if(a&&typeof a==="string"||a===B)for(var b=(a||"").split(ha),d=0,e=this.length;d<e;d++){var f=this[d];if(f.nodeType===1&&f.className)if(a){for(var h=(" "+f.className+" ").replace(sa," "),
l=0,k=b.length;l<k;l++)h=h.replace(" "+b[l]+" "," ");f.className=c.trim(h)}else f.className=""}return this},toggleClass:function(a,b){var d=typeof a,e=typeof b==="boolean";if(c.isFunction(a))return this.each(function(f){var h=c(this);h.toggleClass(a.call(this,f,h.attr("class"),b),b)});return this.each(function(){if(d==="string")for(var f,h=0,l=c(this),k=b,o=a.split(ha);f=o[h++];){k=e?k:!l.hasClass(f);l[k?"addClass":"removeClass"](f)}else if(d==="undefined"||d==="boolean"){this.className&&c.data(this,
"__className__",this.className);this.className=this.className||a===false?"":c.data(this,"__className__")||""}})},hasClass:function(a){a=" "+a+" ";for(var b=0,d=this.length;b<d;b++)if((" "+this[b].className+" ").replace(sa," ").indexOf(a)>-1)return true;return false},val:function(a){if(!arguments.length){var b=this[0];if(b){if(c.nodeName(b,"option")){var d=b.attributes.value;return!d||d.specified?b.value:b.text}if(c.nodeName(b,"select")){var e=b.selectedIndex;d=[];var f=b.options;b=b.type==="select-one";
if(e<0)return null;var h=b?e:0;for(e=b?e+1:f.length;h<e;h++){var l=f[h];if(l.selected&&(c.support.optDisabled?!l.disabled:l.getAttribute("disabled")===null)&&(!l.parentNode.disabled||!c.nodeName(l.parentNode,"optgroup"))){a=c(l).val();if(b)return a;d.push(a)}}return d}if(ta.test(b.type)&&!c.support.checkOn)return b.getAttribute("value")===null?"on":b.value;return(b.value||"").replace(Sa,"")}return B}var k=c.isFunction(a);return this.each(function(o){var x=c(this),r=a;if(this.nodeType===1){if(k)r=
a.call(this,o,x.val());if(r==null)r="";else if(typeof r==="number")r+="";else if(c.isArray(r))r=c.map(r,function(C){return C==null?"":C+""});if(c.isArray(r)&&ta.test(this.type))this.checked=c.inArray(x.val(),r)>=0;else if(c.nodeName(this,"select")){var A=c.makeArray(r);c("option",this).each(function(){this.selected=c.inArray(c(this).val(),A)>=0});if(!A.length)this.selectedIndex=-1}else this.value=r}})}});c.extend({attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},
attr:function(a,b,d,e){if(!a||a.nodeType===3||a.nodeType===8)return B;if(e&&b in c.attrFn)return c(a)[b](d);e=a.nodeType!==1||!c.isXMLDoc(a);var f=d!==B;b=e&&c.props[b]||b;var h=Ta.test(b);if((b in a||a[b]!==B)&&e&&!h){if(f){b==="type"&&Ua.test(a.nodeName)&&a.parentNode&&c.error("type property can't be changed");if(d===null)a.nodeType===1&&a.removeAttribute(b);else a[b]=d}if(c.nodeName(a,"form")&&a.getAttributeNode(b))return a.getAttributeNode(b).nodeValue;if(b==="tabIndex")return(b=a.getAttributeNode("tabIndex"))&&
b.specified?b.value:Va.test(a.nodeName)||Wa.test(a.nodeName)&&a.href?0:B;return a[b]}if(!c.support.style&&e&&b==="style"){if(f)a.style.cssText=""+d;return a.style.cssText}f&&a.setAttribute(b,""+d);if(!a.attributes[b]&&a.hasAttribute&&!a.hasAttribute(b))return B;a=!c.support.hrefNormalized&&e&&h?a.getAttribute(b,2):a.getAttribute(b);return a===null?B:a}});var X=/\.(.*)$/,ia=/^(?:textarea|input|select)$/i,La=/\./g,Ma=/ /g,Xa=/[^\w\s.|`]/g,Ya=function(a){return a.replace(Xa,"\\$&")},ua={focusin:0,focusout:0};
c.event={add:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(c.isWindow(a)&&a!==E&&!a.frameElement)a=E;if(d===false)d=U;else if(!d)return;var f,h;if(d.handler){f=d;d=f.handler}if(!d.guid)d.guid=c.guid++;if(h=c.data(a)){var l=a.nodeType?"events":"__events__",k=h[l],o=h.handle;if(typeof k==="function"){o=k.handle;k=k.events}else if(!k){a.nodeType||(h[l]=h=function(){});h.events=k={}}if(!o)h.handle=o=function(){return typeof c!=="undefined"&&!c.event.triggered?c.event.handle.apply(o.elem,
arguments):B};o.elem=a;b=b.split(" ");for(var x=0,r;l=b[x++];){h=f?c.extend({},f):{handler:d,data:e};if(l.indexOf(".")>-1){r=l.split(".");l=r.shift();h.namespace=r.slice(0).sort().join(".")}else{r=[];h.namespace=""}h.type=l;if(!h.guid)h.guid=d.guid;var A=k[l],C=c.event.special[l]||{};if(!A){A=k[l]=[];if(!C.setup||C.setup.call(a,e,r,o)===false)if(a.addEventListener)a.addEventListener(l,o,false);else a.attachEvent&&a.attachEvent("on"+l,o)}if(C.add){C.add.call(a,h);if(!h.handler.guid)h.handler.guid=
d.guid}A.push(h);c.event.global[l]=true}a=null}}},global:{},remove:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(d===false)d=U;var f,h,l=0,k,o,x,r,A,C,J=a.nodeType?"events":"__events__",w=c.data(a),I=w&&w[J];if(w&&I){if(typeof I==="function"){w=I;I=I.events}if(b&&b.type){d=b.handler;b=b.type}if(!b||typeof b==="string"&&b.charAt(0)==="."){b=b||"";for(f in I)c.event.remove(a,f+b)}else{for(b=b.split(" ");f=b[l++];){r=f;k=f.indexOf(".")<0;o=[];if(!k){o=f.split(".");f=o.shift();x=RegExp("(^|\\.)"+
c.map(o.slice(0).sort(),Ya).join("\\.(?:.*\\.)?")+"(\\.|$)")}if(A=I[f])if(d){r=c.event.special[f]||{};for(h=e||0;h<A.length;h++){C=A[h];if(d.guid===C.guid){if(k||x.test(C.namespace)){e==null&&A.splice(h--,1);r.remove&&r.remove.call(a,C)}if(e!=null)break}}if(A.length===0||e!=null&&A.length===1){if(!r.teardown||r.teardown.call(a,o)===false)c.removeEvent(a,f,w.handle);delete I[f]}}else for(h=0;h<A.length;h++){C=A[h];if(k||x.test(C.namespace)){c.event.remove(a,r,C.handler,h);A.splice(h--,1)}}}if(c.isEmptyObject(I)){if(b=
w.handle)b.elem=null;delete w.events;delete w.handle;if(typeof w==="function")c.removeData(a,J);else c.isEmptyObject(w)&&c.removeData(a)}}}}},trigger:function(a,b,d,e){var f=a.type||a;if(!e){a=typeof a==="object"?a[c.expando]?a:c.extend(c.Event(f),a):c.Event(f);if(f.indexOf("!")>=0){a.type=f=f.slice(0,-1);a.exclusive=true}if(!d){a.stopPropagation();c.event.global[f]&&c.each(c.cache,function(){this.events&&this.events[f]&&c.event.trigger(a,b,this.handle.elem)})}if(!d||d.nodeType===3||d.nodeType===
8)return B;a.result=B;a.target=d;b=c.makeArray(b);b.unshift(a)}a.currentTarget=d;(e=d.nodeType?c.data(d,"handle"):(c.data(d,"__events__")||{}).handle)&&e.apply(d,b);e=d.parentNode||d.ownerDocument;try{if(!(d&&d.nodeName&&c.noData[d.nodeName.toLowerCase()]))if(d["on"+f]&&d["on"+f].apply(d,b)===false){a.result=false;a.preventDefault()}}catch(h){}if(!a.isPropagationStopped()&&e)c.event.trigger(a,b,e,true);else if(!a.isDefaultPrevented()){var l;e=a.target;var k=f.replace(X,""),o=c.nodeName(e,"a")&&k===
"click",x=c.event.special[k]||{};if((!x._default||x._default.call(d,a)===false)&&!o&&!(e&&e.nodeName&&c.noData[e.nodeName.toLowerCase()])){try{if(e[k]){if(l=e["on"+k])e["on"+k]=null;c.event.triggered=true;e[k]()}}catch(r){}if(l)e["on"+k]=l;c.event.triggered=false}}},handle:function(a){var b,d,e,f;d=[];var h=c.makeArray(arguments);a=h[0]=c.event.fix(a||E.event);a.currentTarget=this;b=a.type.indexOf(".")<0&&!a.exclusive;if(!b){e=a.type.split(".");a.type=e.shift();d=e.slice(0).sort();e=RegExp("(^|\\.)"+
d.join("\\.(?:.*\\.)?")+"(\\.|$)")}a.namespace=a.namespace||d.join(".");f=c.data(this,this.nodeType?"events":"__events__");if(typeof f==="function")f=f.events;d=(f||{})[a.type];if(f&&d){d=d.slice(0);f=0;for(var l=d.length;f<l;f++){var k=d[f];if(b||e.test(k.namespace)){a.handler=k.handler;a.data=k.data;a.handleObj=k;k=k.handler.apply(this,h);if(k!==B){a.result=k;if(k===false){a.preventDefault();a.stopPropagation()}}if(a.isImmediatePropagationStopped())break}}}return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
fix:function(a){if(a[c.expando])return a;var b=a;a=c.Event(b);for(var d=this.props.length,e;d;){e=this.props[--d];a[e]=b[e]}if(!a.target)a.target=a.srcElement||t;if(a.target.nodeType===3)a.target=a.target.parentNode;if(!a.relatedTarget&&a.fromElement)a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;if(a.pageX==null&&a.clientX!=null){b=t.documentElement;d=t.body;a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0);a.pageY=a.clientY+(b&&b.scrollTop||
d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0)}if(a.which==null&&(a.charCode!=null||a.keyCode!=null))a.which=a.charCode!=null?a.charCode:a.keyCode;if(!a.metaKey&&a.ctrlKey)a.metaKey=a.ctrlKey;if(!a.which&&a.button!==B)a.which=a.button&1?1:a.button&2?3:a.button&4?2:0;return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,Y(a.origType,a.selector),c.extend({},a,{handler:Ka,guid:a.handler.guid}))},remove:function(a){c.event.remove(this,
Y(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,d){if(c.isWindow(this))this.onbeforeunload=d},teardown:function(a,b){if(this.onbeforeunload===b)this.onbeforeunload=null}}}};c.removeEvent=t.removeEventListener?function(a,b,d){a.removeEventListener&&a.removeEventListener(b,d,false)}:function(a,b,d){a.detachEvent&&a.detachEvent("on"+b,d)};c.Event=function(a){if(!this.preventDefault)return new c.Event(a);if(a&&a.type){this.originalEvent=a;this.type=a.type}else this.type=a;this.timeStamp=
c.now();this[c.expando]=true};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=ca;var a=this.originalEvent;if(a)if(a.preventDefault)a.preventDefault();else a.returnValue=false},stopPropagation:function(){this.isPropagationStopped=ca;var a=this.originalEvent;if(a){a.stopPropagation&&a.stopPropagation();a.cancelBubble=true}},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=ca;this.stopPropagation()},isDefaultPrevented:U,isPropagationStopped:U,isImmediatePropagationStopped:U};
var va=function(a){var b=a.relatedTarget;try{for(;b&&b!==this;)b=b.parentNode;if(b!==this){a.type=a.data;c.event.handle.apply(this,arguments)}}catch(d){}},wa=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?wa:va,a)},teardown:function(d){c.event.remove(this,b,d&&d.selector?wa:va)}}});if(!c.support.submitBubbles)c.event.special.submit={setup:function(){if(this.nodeName.toLowerCase()!==
"form"){c.event.add(this,"click.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="submit"||d==="image")&&c(b).closest("form").length){a.liveFired=B;return la("submit",this,arguments)}});c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="text"||d==="password")&&c(b).closest("form").length&&a.keyCode===13){a.liveFired=B;return la("submit",this,arguments)}})}else return false},teardown:function(){c.event.remove(this,".specialSubmit")}};if(!c.support.changeBubbles){var V,
xa=function(a){var b=a.type,d=a.value;if(b==="radio"||b==="checkbox")d=a.checked;else if(b==="select-multiple")d=a.selectedIndex>-1?c.map(a.options,function(e){return e.selected}).join("-"):"";else if(a.nodeName.toLowerCase()==="select")d=a.selectedIndex;return d},Z=function(a,b){var d=a.target,e,f;if(!(!ia.test(d.nodeName)||d.readOnly)){e=c.data(d,"_change_data");f=xa(d);if(a.type!=="focusout"||d.type!=="radio")c.data(d,"_change_data",f);if(!(e===B||f===e))if(e!=null||f){a.type="change";a.liveFired=
B;return c.event.trigger(a,b,d)}}};c.event.special.change={filters:{focusout:Z,beforedeactivate:Z,click:function(a){var b=a.target,d=b.type;if(d==="radio"||d==="checkbox"||b.nodeName.toLowerCase()==="select")return Z.call(this,a)},keydown:function(a){var b=a.target,d=b.type;if(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(d==="checkbox"||d==="radio")||d==="select-multiple")return Z.call(this,a)},beforeactivate:function(a){a=a.target;c.data(a,"_change_data",xa(a))}},setup:function(){if(this.type===
"file")return false;for(var a in V)c.event.add(this,a+".specialChange",V[a]);return ia.test(this.nodeName)},teardown:function(){c.event.remove(this,".specialChange");return ia.test(this.nodeName)}};V=c.event.special.change.filters;V.focus=V.beforeactivate}t.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.trigger(e,null,e.target)}c.event.special[b]={setup:function(){ua[b]++===0&&t.addEventListener(a,d,true)},teardown:function(){--ua[b]===
0&&t.removeEventListener(a,d,true)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(d,e,f){if(typeof d==="object"){for(var h in d)this[b](h,e,d[h],f);return this}if(c.isFunction(e)||e===false){f=e;e=B}var l=b==="one"?c.proxy(f,function(o){c(this).unbind(o,l);return f.apply(this,arguments)}):f;if(d==="unload"&&b!=="one")this.one(d,e,f);else{h=0;for(var k=this.length;h<k;h++)c.event.add(this[h],d,l,e)}return this}});c.fn.extend({unbind:function(a,b){if(typeof a==="object"&&!a.preventDefault)for(var d in a)this.unbind(d,
a[d]);else{d=0;for(var e=this.length;d<e;d++)c.event.remove(this[d],a,b)}return this},delegate:function(a,b,d,e){return this.live(b,d,e,a)},undelegate:function(a,b,d){return arguments.length===0?this.unbind("live"):this.die(b,null,d,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var d=c.Event(a);d.preventDefault();d.stopPropagation();c.event.trigger(d,b,this[0]);return d.result}},toggle:function(a){for(var b=arguments,d=
1;d<b.length;)c.proxy(a,b[d++]);return this.click(c.proxy(a,function(e){var f=(c.data(this,"lastToggle"+a.guid)||0)%d;c.data(this,"lastToggle"+a.guid,f+1);e.preventDefault();return b[f].apply(this,arguments)||false}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var ya={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(d,e,f,h){var l,k=0,o,x,r=h||this.selector;h=h?this:c(this.context);if(typeof d===
"object"&&!d.preventDefault){for(l in d)h[b](l,e,d[l],r);return this}if(c.isFunction(e)){f=e;e=B}for(d=(d||"").split(" ");(l=d[k++])!=null;){o=X.exec(l);x="";if(o){x=o[0];l=l.replace(X,"")}if(l==="hover")d.push("mouseenter"+x,"mouseleave"+x);else{o=l;if(l==="focus"||l==="blur"){d.push(ya[l]+x);l+=x}else l=(ya[l]||l)+x;if(b==="live"){x=0;for(var A=h.length;x<A;x++)c.event.add(h[x],"live."+Y(l,r),{data:e,selector:r,handler:f,origType:l,origHandler:f,preType:o})}else h.unbind("live."+Y(l,r),f)}}return this}});
c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){c.fn[b]=function(d,e){if(e==null){e=d;d=null}return arguments.length>0?this.bind(b,d,e):this.trigger(b)};if(c.attrFn)c.attrFn[b]=true});E.attachEvent&&!E.addEventListener&&c(E).bind("unload",function(){for(var a in c.cache)if(c.cache[a].handle)try{c.event.remove(c.cache[a].handle.elem)}catch(b){}});
(function(){function a(g,i,n,m,p,q){p=0;for(var u=m.length;p<u;p++){var y=m[p];if(y){var F=false;for(y=y[g];y;){if(y.sizcache===n){F=m[y.sizset];break}if(y.nodeType===1&&!q){y.sizcache=n;y.sizset=p}if(y.nodeName.toLowerCase()===i){F=y;break}y=y[g]}m[p]=F}}}function b(g,i,n,m,p,q){p=0;for(var u=m.length;p<u;p++){var y=m[p];if(y){var F=false;for(y=y[g];y;){if(y.sizcache===n){F=m[y.sizset];break}if(y.nodeType===1){if(!q){y.sizcache=n;y.sizset=p}if(typeof i!=="string"){if(y===i){F=true;break}}else if(k.filter(i,
[y]).length>0){F=y;break}}y=y[g]}m[p]=F}}}var d=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,h=false,l=true;[0,0].sort(function(){l=false;return 0});var k=function(g,i,n,m){n=n||[];var p=i=i||t;if(i.nodeType!==1&&i.nodeType!==9)return[];if(!g||typeof g!=="string")return n;var q,u,y,F,M,N=true,O=k.isXML(i),D=[],R=g;do{d.exec("");if(q=d.exec(R)){R=q[3];D.push(q[1]);if(q[2]){F=q[3];
break}}}while(q);if(D.length>1&&x.exec(g))if(D.length===2&&o.relative[D[0]])u=L(D[0]+D[1],i);else for(u=o.relative[D[0]]?[i]:k(D.shift(),i);D.length;){g=D.shift();if(o.relative[g])g+=D.shift();u=L(g,u)}else{if(!m&&D.length>1&&i.nodeType===9&&!O&&o.match.ID.test(D[0])&&!o.match.ID.test(D[D.length-1])){q=k.find(D.shift(),i,O);i=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]}if(i){q=m?{expr:D.pop(),set:C(m)}:k.find(D.pop(),D.length===1&&(D[0]==="~"||D[0]==="+")&&i.parentNode?i.parentNode:i,O);u=q.expr?k.filter(q.expr,
q.set):q.set;if(D.length>0)y=C(u);else N=false;for(;D.length;){q=M=D.pop();if(o.relative[M])q=D.pop();else M="";if(q==null)q=i;o.relative[M](y,q,O)}}else y=[]}y||(y=u);y||k.error(M||g);if(f.call(y)==="[object Array]")if(N)if(i&&i.nodeType===1)for(g=0;y[g]!=null;g++){if(y[g]&&(y[g]===true||y[g].nodeType===1&&k.contains(i,y[g])))n.push(u[g])}else for(g=0;y[g]!=null;g++)y[g]&&y[g].nodeType===1&&n.push(u[g]);else n.push.apply(n,y);else C(y,n);if(F){k(F,p,n,m);k.uniqueSort(n)}return n};k.uniqueSort=function(g){if(w){h=
l;g.sort(w);if(h)for(var i=1;i<g.length;i++)g[i]===g[i-1]&&g.splice(i--,1)}return g};k.matches=function(g,i){return k(g,null,null,i)};k.matchesSelector=function(g,i){return k(i,null,null,[g]).length>0};k.find=function(g,i,n){var m;if(!g)return[];for(var p=0,q=o.order.length;p<q;p++){var u,y=o.order[p];if(u=o.leftMatch[y].exec(g)){var F=u[1];u.splice(1,1);if(F.substr(F.length-1)!=="\\"){u[1]=(u[1]||"").replace(/\\/g,"");m=o.find[y](u,i,n);if(m!=null){g=g.replace(o.match[y],"");break}}}}m||(m=i.getElementsByTagName("*"));
return{set:m,expr:g}};k.filter=function(g,i,n,m){for(var p,q,u=g,y=[],F=i,M=i&&i[0]&&k.isXML(i[0]);g&&i.length;){for(var N in o.filter)if((p=o.leftMatch[N].exec(g))!=null&&p[2]){var O,D,R=o.filter[N];D=p[1];q=false;p.splice(1,1);if(D.substr(D.length-1)!=="\\"){if(F===y)y=[];if(o.preFilter[N])if(p=o.preFilter[N](p,F,n,y,m,M)){if(p===true)continue}else q=O=true;if(p)for(var j=0;(D=F[j])!=null;j++)if(D){O=R(D,p,j,F);var s=m^!!O;if(n&&O!=null)if(s)q=true;else F[j]=false;else if(s){y.push(D);q=true}}if(O!==
B){n||(F=y);g=g.replace(o.match[N],"");if(!q)return[];break}}}if(g===u)if(q==null)k.error(g);else break;u=g}return F};k.error=function(g){throw"Syntax error, unrecognized expression: "+g;};var o=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(g){return g.getAttribute("href")}},relative:{"+":function(g,i){var n=typeof i==="string",m=n&&!/\W/.test(i);n=n&&!m;if(m)i=i.toLowerCase();m=0;for(var p=g.length,q;m<p;m++)if(q=g[m]){for(;(q=q.previousSibling)&&q.nodeType!==1;);g[m]=n||q&&q.nodeName.toLowerCase()===
i?q||false:q===i}n&&k.filter(i,g,true)},">":function(g,i){var n,m=typeof i==="string",p=0,q=g.length;if(m&&!/\W/.test(i))for(i=i.toLowerCase();p<q;p++){if(n=g[p]){n=n.parentNode;g[p]=n.nodeName.toLowerCase()===i?n:false}}else{for(;p<q;p++)if(n=g[p])g[p]=m?n.parentNode:n.parentNode===i;m&&k.filter(i,g,true)}},"":function(g,i,n){var m,p=e++,q=b;if(typeof i==="string"&&!/\W/.test(i)){m=i=i.toLowerCase();q=a}q("parentNode",i,p,g,m,n)},"~":function(g,i,n){var m,p=e++,q=b;if(typeof i==="string"&&!/\W/.test(i)){m=
i=i.toLowerCase();q=a}q("previousSibling",i,p,g,m,n)}},find:{ID:function(g,i,n){if(typeof i.getElementById!=="undefined"&&!n)return(g=i.getElementById(g[1]))&&g.parentNode?[g]:[]},NAME:function(g,i){if(typeof i.getElementsByName!=="undefined"){for(var n=[],m=i.getElementsByName(g[1]),p=0,q=m.length;p<q;p++)m[p].getAttribute("name")===g[1]&&n.push(m[p]);return n.length===0?null:n}},TAG:function(g,i){return i.getElementsByTagName(g[1])}},preFilter:{CLASS:function(g,i,n,m,p,q){g=" "+g[1].replace(/\\/g,
"")+" ";if(q)return g;q=0;for(var u;(u=i[q])!=null;q++)if(u)if(p^(u.className&&(" "+u.className+" ").replace(/[\t\n]/g," ").indexOf(g)>=0))n||m.push(u);else if(n)i[q]=false;return false},ID:function(g){return g[1].replace(/\\/g,"")},TAG:function(g){return g[1].toLowerCase()},CHILD:function(g){if(g[1]==="nth"){var i=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2]==="even"&&"2n"||g[2]==="odd"&&"2n+1"||!/\D/.test(g[2])&&"0n+"+g[2]||g[2]);g[2]=i[1]+(i[2]||1)-0;g[3]=i[3]-0}g[0]=e++;return g},ATTR:function(g,i,n,
m,p,q){i=g[1].replace(/\\/g,"");if(!q&&o.attrMap[i])g[1]=o.attrMap[i];if(g[2]==="~=")g[4]=" "+g[4]+" ";return g},PSEUDO:function(g,i,n,m,p){if(g[1]==="not")if((d.exec(g[3])||"").length>1||/^\w/.test(g[3]))g[3]=k(g[3],null,null,i);else{g=k.filter(g[3],i,n,true^p);n||m.push.apply(m,g);return false}else if(o.match.POS.test(g[0])||o.match.CHILD.test(g[0]))return true;return g},POS:function(g){g.unshift(true);return g}},filters:{enabled:function(g){return g.disabled===false&&g.type!=="hidden"},disabled:function(g){return g.disabled===
true},checked:function(g){return g.checked===true},selected:function(g){return g.selected===true},parent:function(g){return!!g.firstChild},empty:function(g){return!g.firstChild},has:function(g,i,n){return!!k(n[3],g).length},header:function(g){return/h\d/i.test(g.nodeName)},text:function(g){return"text"===g.type},radio:function(g){return"radio"===g.type},checkbox:function(g){return"checkbox"===g.type},file:function(g){return"file"===g.type},password:function(g){return"password"===g.type},submit:function(g){return"submit"===
g.type},image:function(g){return"image"===g.type},reset:function(g){return"reset"===g.type},button:function(g){return"button"===g.type||g.nodeName.toLowerCase()==="button"},input:function(g){return/input|select|textarea|button/i.test(g.nodeName)}},setFilters:{first:function(g,i){return i===0},last:function(g,i,n,m){return i===m.length-1},even:function(g,i){return i%2===0},odd:function(g,i){return i%2===1},lt:function(g,i,n){return i<n[3]-0},gt:function(g,i,n){return i>n[3]-0},nth:function(g,i,n){return n[3]-
0===i},eq:function(g,i,n){return n[3]-0===i}},filter:{PSEUDO:function(g,i,n,m){var p=i[1],q=o.filters[p];if(q)return q(g,n,i,m);else if(p==="contains")return(g.textContent||g.innerText||k.getText([g])||"").indexOf(i[3])>=0;else if(p==="not"){i=i[3];n=0;for(m=i.length;n<m;n++)if(i[n]===g)return false;return true}else k.error("Syntax error, unrecognized expression: "+p)},CHILD:function(g,i){var n=i[1],m=g;switch(n){case "only":case "first":for(;m=m.previousSibling;)if(m.nodeType===1)return false;if(n===
"first")return true;m=g;case "last":for(;m=m.nextSibling;)if(m.nodeType===1)return false;return true;case "nth":n=i[2];var p=i[3];if(n===1&&p===0)return true;var q=i[0],u=g.parentNode;if(u&&(u.sizcache!==q||!g.nodeIndex)){var y=0;for(m=u.firstChild;m;m=m.nextSibling)if(m.nodeType===1)m.nodeIndex=++y;u.sizcache=q}m=g.nodeIndex-p;return n===0?m===0:m%n===0&&m/n>=0}},ID:function(g,i){return g.nodeType===1&&g.getAttribute("id")===i},TAG:function(g,i){return i==="*"&&g.nodeType===1||g.nodeName.toLowerCase()===
i},CLASS:function(g,i){return(" "+(g.className||g.getAttribute("class"))+" ").indexOf(i)>-1},ATTR:function(g,i){var n=i[1];n=o.attrHandle[n]?o.attrHandle[n](g):g[n]!=null?g[n]:g.getAttribute(n);var m=n+"",p=i[2],q=i[4];return n==null?p==="!=":p==="="?m===q:p==="*="?m.indexOf(q)>=0:p==="~="?(" "+m+" ").indexOf(q)>=0:!q?m&&n!==false:p==="!="?m!==q:p==="^="?m.indexOf(q)===0:p==="$="?m.substr(m.length-q.length)===q:p==="|="?m===q||m.substr(0,q.length+1)===q+"-":false},POS:function(g,i,n,m){var p=o.setFilters[i[2]];
if(p)return p(g,n,i,m)}}},x=o.match.POS,r=function(g,i){return"\\"+(i-0+1)},A;for(A in o.match){o.match[A]=RegExp(o.match[A].source+/(?![^\[]*\])(?![^\(]*\))/.source);o.leftMatch[A]=RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[A].source.replace(/\\(\d+)/g,r))}var C=function(g,i){g=Array.prototype.slice.call(g,0);if(i){i.push.apply(i,g);return i}return g};try{Array.prototype.slice.call(t.documentElement.childNodes,0)}catch(J){C=function(g,i){var n=0,m=i||[];if(f.call(g)==="[object Array]")Array.prototype.push.apply(m,
g);else if(typeof g.length==="number")for(var p=g.length;n<p;n++)m.push(g[n]);else for(;g[n];n++)m.push(g[n]);return m}}var w,I;if(t.documentElement.compareDocumentPosition)w=function(g,i){if(g===i){h=true;return 0}if(!g.compareDocumentPosition||!i.compareDocumentPosition)return g.compareDocumentPosition?-1:1;return g.compareDocumentPosition(i)&4?-1:1};else{w=function(g,i){var n,m,p=[],q=[];n=g.parentNode;m=i.parentNode;var u=n;if(g===i){h=true;return 0}else if(n===m)return I(g,i);else if(n){if(!m)return 1}else return-1;
for(;u;){p.unshift(u);u=u.parentNode}for(u=m;u;){q.unshift(u);u=u.parentNode}n=p.length;m=q.length;for(u=0;u<n&&u<m;u++)if(p[u]!==q[u])return I(p[u],q[u]);return u===n?I(g,q[u],-1):I(p[u],i,1)};I=function(g,i,n){if(g===i)return n;for(g=g.nextSibling;g;){if(g===i)return-1;g=g.nextSibling}return 1}}k.getText=function(g){for(var i="",n,m=0;g[m];m++){n=g[m];if(n.nodeType===3||n.nodeType===4)i+=n.nodeValue;else if(n.nodeType!==8)i+=k.getText(n.childNodes)}return i};(function(){var g=t.createElement("div"),
i="script"+(new Date).getTime(),n=t.documentElement;g.innerHTML="<a name='"+i+"'/>";n.insertBefore(g,n.firstChild);if(t.getElementById(i)){o.find.ID=function(m,p,q){if(typeof p.getElementById!=="undefined"&&!q)return(p=p.getElementById(m[1]))?p.id===m[1]||typeof p.getAttributeNode!=="undefined"&&p.getAttributeNode("id").nodeValue===m[1]?[p]:B:[]};o.filter.ID=function(m,p){var q=typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id");return m.nodeType===1&&q&&q.nodeValue===p}}n.removeChild(g);
n=g=null})();(function(){var g=t.createElement("div");g.appendChild(t.createComment(""));if(g.getElementsByTagName("*").length>0)o.find.TAG=function(i,n){var m=n.getElementsByTagName(i[1]);if(i[1]==="*"){for(var p=[],q=0;m[q];q++)m[q].nodeType===1&&p.push(m[q]);m=p}return m};g.innerHTML="<a href='#'></a>";if(g.firstChild&&typeof g.firstChild.getAttribute!=="undefined"&&g.firstChild.getAttribute("href")!=="#")o.attrHandle.href=function(i){return i.getAttribute("href",2)};g=null})();t.querySelectorAll&&
function(){var g=k,i=t.createElement("div");i.innerHTML="<p class='TEST'></p>";if(!(i.querySelectorAll&&i.querySelectorAll(".TEST").length===0)){k=function(m,p,q,u){p=p||t;m=m.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!u&&!k.isXML(p))if(p.nodeType===9)try{return C(p.querySelectorAll(m),q)}catch(y){}else if(p.nodeType===1&&p.nodeName.toLowerCase()!=="object"){var F=p.getAttribute("id"),M=F||"__sizzle__";F||p.setAttribute("id",M);try{return C(p.querySelectorAll("#"+M+" "+m),q)}catch(N){}finally{F||
p.removeAttribute("id")}}return g(m,p,q,u)};for(var n in g)k[n]=g[n];i=null}}();(function(){var g=t.documentElement,i=g.matchesSelector||g.mozMatchesSelector||g.webkitMatchesSelector||g.msMatchesSelector,n=false;try{i.call(t.documentElement,"[test!='']:sizzle")}catch(m){n=true}if(i)k.matchesSelector=function(p,q){q=q.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(p))try{if(n||!o.match.PSEUDO.test(q)&&!/!=/.test(q))return i.call(p,q)}catch(u){}return k(q,null,null,[p]).length>0}})();(function(){var g=
t.createElement("div");g.innerHTML="<div class='test e'></div><div class='test'></div>";if(!(!g.getElementsByClassName||g.getElementsByClassName("e").length===0)){g.lastChild.className="e";if(g.getElementsByClassName("e").length!==1){o.order.splice(1,0,"CLASS");o.find.CLASS=function(i,n,m){if(typeof n.getElementsByClassName!=="undefined"&&!m)return n.getElementsByClassName(i[1])};g=null}}})();k.contains=t.documentElement.contains?function(g,i){return g!==i&&(g.contains?g.contains(i):true)}:t.documentElement.compareDocumentPosition?
function(g,i){return!!(g.compareDocumentPosition(i)&16)}:function(){return false};k.isXML=function(g){return(g=(g?g.ownerDocument||g:0).documentElement)?g.nodeName!=="HTML":false};var L=function(g,i){for(var n,m=[],p="",q=i.nodeType?[i]:i;n=o.match.PSEUDO.exec(g);){p+=n[0];g=g.replace(o.match.PSEUDO,"")}g=o.relative[g]?g+"*":g;n=0;for(var u=q.length;n<u;n++)k(g,q[n],m);return k.filter(p,m)};c.find=k;c.expr=k.selectors;c.expr[":"]=c.expr.filters;c.unique=k.uniqueSort;c.text=k.getText;c.isXMLDoc=k.isXML;
c.contains=k.contains})();var Za=/Until$/,$a=/^(?:parents|prevUntil|prevAll)/,ab=/,/,Na=/^.[^:#\[\.,]*$/,bb=Array.prototype.slice,cb=c.expr.match.POS;c.fn.extend({find:function(a){for(var b=this.pushStack("","find",a),d=0,e=0,f=this.length;e<f;e++){d=b.length;c.find(a,this[e],b);if(e>0)for(var h=d;h<b.length;h++)for(var l=0;l<d;l++)if(b[l]===b[h]){b.splice(h--,1);break}}return b},has:function(a){var b=c(a);return this.filter(function(){for(var d=0,e=b.length;d<e;d++)if(c.contains(this,b[d]))return true})},
not:function(a){return this.pushStack(ma(this,a,false),"not",a)},filter:function(a){return this.pushStack(ma(this,a,true),"filter",a)},is:function(a){return!!a&&c.filter(a,this).length>0},closest:function(a,b){var d=[],e,f,h=this[0];if(c.isArray(a)){var l,k={},o=1;if(h&&a.length){e=0;for(f=a.length;e<f;e++){l=a[e];k[l]||(k[l]=c.expr.match.POS.test(l)?c(l,b||this.context):l)}for(;h&&h.ownerDocument&&h!==b;){for(l in k){e=k[l];if(e.jquery?e.index(h)>-1:c(h).is(e))d.push({selector:l,elem:h,level:o})}h=
h.parentNode;o++}}return d}l=cb.test(a)?c(a,b||this.context):null;e=0;for(f=this.length;e<f;e++)for(h=this[e];h;)if(l?l.index(h)>-1:c.find.matchesSelector(h,a)){d.push(h);break}else{h=h.parentNode;if(!h||!h.ownerDocument||h===b)break}d=d.length>1?c.unique(d):d;return this.pushStack(d,"closest",a)},index:function(a){if(!a||typeof a==="string")return c.inArray(this[0],a?c(a):this.parent().children());return c.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var d=typeof a==="string"?c(a,b||this.context):
c.makeArray(a),e=c.merge(this.get(),d);return this.pushStack(!d[0]||!d[0].parentNode||d[0].parentNode.nodeType===11||!e[0]||!e[0].parentNode||e[0].parentNode.nodeType===11?e:c.unique(e))},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",d)},next:function(a){return c.nth(a,2,"nextSibling")},prev:function(a){return c.nth(a,
2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},function(a,
b){c.fn[a]=function(d,e){var f=c.map(this,b,d);Za.test(a)||(e=d);if(e&&typeof e==="string")f=c.filter(e,f);f=this.length>1?c.unique(f):f;if((this.length>1||ab.test(e))&&$a.test(a))f=f.reverse();return this.pushStack(f,a,bb.call(arguments).join(","))}});c.extend({filter:function(a,b,d){if(d)a=":not("+a+")";return b.length===1?c.find.matchesSelector(b[0],a)?[b[0]]:[]:c.find.matches(a,b)},dir:function(a,b,d){var e=[];for(a=a[b];a&&a.nodeType!==9&&(d===B||a.nodeType!==1||!c(a).is(d));){a.nodeType===1&&
e.push(a);a=a[b]}return e},nth:function(a,b,d){b=b||1;for(var e=0;a;a=a[d])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){for(var d=[];a;a=a.nextSibling)a.nodeType===1&&a!==b&&d.push(a);return d}});var za=/ jQuery\d+="(?:\d+|null)"/g,$=/^\s+/,Aa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Ba=/<([\w:]+)/,db=/<tbody/i,eb=/<|&#?\w+;/,Ca=/<(?:script|object|embed|option|style)/i,Da=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/\=([^="'>\s]+\/)>/g,P={option:[1,
"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};P.optgroup=P.option;P.tbody=P.tfoot=P.colgroup=P.caption=P.thead;P.th=P.td;if(!c.support.htmlSerialize)P._default=[1,"div<div>","</div>"];c.fn.extend({text:function(a){if(c.isFunction(a))return this.each(function(b){var d=
c(this);d.text(a.call(this,b,d.text()))});if(typeof a!=="object"&&a!==B)return this.empty().append((this[0]&&this[0].ownerDocument||t).createTextNode(a));return c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(d){c(this).wrapAll(a.call(this,d))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(true);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var d=this;d.firstChild&&d.firstChild.nodeType===1;)d=d.firstChild;return d}).append(this)}return this},
wrapInner:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapInner(a.call(this,b))});return this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.appendChild(a)})},
prepend:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,this)});else if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,
this.nextSibling)});else if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,e;(e=this[d])!=null;d++)if(!a||c.filter(a,[e]).length){if(!b&&e.nodeType===1){c.cleanData(e.getElementsByTagName("*"));c.cleanData([e])}e.parentNode&&e.parentNode.removeChild(e)}return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++)for(b.nodeType===1&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);
return this},clone:function(a){var b=this.map(function(){if(!c.support.noCloneEvent&&!c.isXMLDoc(this)){var d=this.outerHTML,e=this.ownerDocument;if(!d){d=e.createElement("div");d.appendChild(this.cloneNode(true));d=d.innerHTML}return c.clean([d.replace(za,"").replace(fb,'="$1">').replace($,"")],e)[0]}else return this.cloneNode(true)});if(a===true){na(this,b);na(this.find("*"),b.find("*"))}return b},html:function(a){if(a===B)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(za,""):null;
else if(typeof a==="string"&&!Ca.test(a)&&(c.support.leadingWhitespace||!$.test(a))&&!P[(Ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Aa,"<$1></$2>");try{for(var b=0,d=this.length;b<d;b++)if(this[b].nodeType===1){c.cleanData(this[b].getElementsByTagName("*"));this[b].innerHTML=a}}catch(e){this.empty().append(a)}}else c.isFunction(a)?this.each(function(f){var h=c(this);h.html(a.call(this,f,h.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=
c(this),e=d.html();d.replaceWith(a.call(this,b,e))});if(typeof a!=="string")a=c(a).detach();return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}else return this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,true)},domManip:function(a,b,d){var e,f,h,l=a[0],k=[];if(!c.support.checkClone&&arguments.length===3&&typeof l==="string"&&Da.test(l))return this.each(function(){c(this).domManip(a,
b,d,true)});if(c.isFunction(l))return this.each(function(x){var r=c(this);a[0]=l.call(this,x,b?r.html():B);r.domManip(a,b,d)});if(this[0]){e=l&&l.parentNode;e=c.support.parentNode&&e&&e.nodeType===11&&e.childNodes.length===this.length?{fragment:e}:c.buildFragment(a,this,k);h=e.fragment;if(f=h.childNodes.length===1?h=h.firstChild:h.firstChild){b=b&&c.nodeName(f,"tr");f=0;for(var o=this.length;f<o;f++)d.call(b?c.nodeName(this[f],"table")?this[f].getElementsByTagName("tbody")[0]||this[f].appendChild(this[f].ownerDocument.createElement("tbody")):
this[f]:this[f],f>0||e.cacheable||this.length>1?h.cloneNode(true):h)}k.length&&c.each(k,Oa)}return this}});c.buildFragment=function(a,b,d){var e,f,h;b=b&&b[0]?b[0].ownerDocument||b[0]:t;if(a.length===1&&typeof a[0]==="string"&&a[0].length<512&&b===t&&!Ca.test(a[0])&&(c.support.checkClone||!Da.test(a[0]))){f=true;if(h=c.fragments[a[0]])if(h!==1)e=h}if(!e){e=b.createDocumentFragment();c.clean(a,b,e,d)}if(f)c.fragments[a[0]]=h?e:1;return{fragment:e,cacheable:f}};c.fragments={};c.each({appendTo:"append",
prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var e=[];d=c(d);var f=this.length===1&&this[0].parentNode;if(f&&f.nodeType===11&&f.childNodes.length===1&&d.length===1){d[b](this[0]);return this}else{f=0;for(var h=d.length;f<h;f++){var l=(f>0?this.clone(true):this).get();c(d[f])[b](l);e=e.concat(l)}return this.pushStack(e,a,d.selector)}}});c.extend({clean:function(a,b,d,e){b=b||t;if(typeof b.createElement==="undefined")b=b.ownerDocument||
b[0]&&b[0].ownerDocument||t;for(var f=[],h=0,l;(l=a[h])!=null;h++){if(typeof l==="number")l+="";if(l){if(typeof l==="string"&&!eb.test(l))l=b.createTextNode(l);else if(typeof l==="string"){l=l.replace(Aa,"<$1></$2>");var k=(Ba.exec(l)||["",""])[1].toLowerCase(),o=P[k]||P._default,x=o[0],r=b.createElement("div");for(r.innerHTML=o[1]+l+o[2];x--;)r=r.lastChild;if(!c.support.tbody){x=db.test(l);k=k==="table"&&!x?r.firstChild&&r.firstChild.childNodes:o[1]==="<table>"&&!x?r.childNodes:[];for(o=k.length-
1;o>=0;--o)c.nodeName(k[o],"tbody")&&!k[o].childNodes.length&&k[o].parentNode.removeChild(k[o])}!c.support.leadingWhitespace&&$.test(l)&&r.insertBefore(b.createTextNode($.exec(l)[0]),r.firstChild);l=r.childNodes}if(l.nodeType)f.push(l);else f=c.merge(f,l)}}if(d)for(h=0;f[h];h++)if(e&&c.nodeName(f[h],"script")&&(!f[h].type||f[h].type.toLowerCase()==="text/javascript"))e.push(f[h].parentNode?f[h].parentNode.removeChild(f[h]):f[h]);else{f[h].nodeType===1&&f.splice.apply(f,[h+1,0].concat(c.makeArray(f[h].getElementsByTagName("script"))));
d.appendChild(f[h])}return f},cleanData:function(a){for(var b,d,e=c.cache,f=c.event.special,h=c.support.deleteExpando,l=0,k;(k=a[l])!=null;l++)if(!(k.nodeName&&c.noData[k.nodeName.toLowerCase()]))if(d=k[c.expando]){if((b=e[d])&&b.events)for(var o in b.events)f[o]?c.event.remove(k,o):c.removeEvent(k,o,b.handle);if(h)delete k[c.expando];else k.removeAttribute&&k.removeAttribute(c.expando);delete e[d]}}});var Ea=/alpha\([^)]*\)/i,gb=/opacity=([^)]*)/,hb=/-([a-z])/ig,ib=/([A-Z])/g,Fa=/^-?\d+(?:px)?$/i,
jb=/^-?\d/,kb={position:"absolute",visibility:"hidden",display:"block"},Pa=["Left","Right"],Qa=["Top","Bottom"],W,Ga,aa,lb=function(a,b){return b.toUpperCase()};c.fn.css=function(a,b){if(arguments.length===2&&b===B)return this;return c.access(this,a,b,true,function(d,e,f){return f!==B?c.style(d,e,f):c.css(d,e)})};c.extend({cssHooks:{opacity:{get:function(a,b){if(b){var d=W(a,"opacity","opacity");return d===""?"1":d}else return a.style.opacity}}},cssNumber:{zIndex:true,fontWeight:true,opacity:true,
zoom:true,lineHeight:true},cssProps:{"float":c.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,d,e){if(!(!a||a.nodeType===3||a.nodeType===8||!a.style)){var f,h=c.camelCase(b),l=a.style,k=c.cssHooks[h];b=c.cssProps[h]||h;if(d!==B){if(!(typeof d==="number"&&isNaN(d)||d==null)){if(typeof d==="number"&&!c.cssNumber[h])d+="px";if(!k||!("set"in k)||(d=k.set(a,d))!==B)try{l[b]=d}catch(o){}}}else{if(k&&"get"in k&&(f=k.get(a,false,e))!==B)return f;return l[b]}}},css:function(a,b,d){var e,f=c.camelCase(b),
h=c.cssHooks[f];b=c.cssProps[f]||f;if(h&&"get"in h&&(e=h.get(a,true,d))!==B)return e;else if(W)return W(a,b,f)},swap:function(a,b,d){var e={},f;for(f in b){e[f]=a.style[f];a.style[f]=b[f]}d.call(a);for(f in b)a.style[f]=e[f]},camelCase:function(a){return a.replace(hb,lb)}});c.curCSS=c.css;c.each(["height","width"],function(a,b){c.cssHooks[b]={get:function(d,e,f){var h;if(e){if(d.offsetWidth!==0)h=oa(d,b,f);else c.swap(d,kb,function(){h=oa(d,b,f)});if(h<=0){h=W(d,b,b);if(h==="0px"&&aa)h=aa(d,b,b);
if(h!=null)return h===""||h==="auto"?"0px":h}if(h<0||h==null){h=d.style[b];return h===""||h==="auto"?"0px":h}return typeof h==="string"?h:h+"px"}},set:function(d,e){if(Fa.test(e)){e=parseFloat(e);if(e>=0)return e+"px"}else return e}}});if(!c.support.opacity)c.cssHooks.opacity={get:function(a,b){return gb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var d=a.style;d.zoom=1;var e=c.isNaN(b)?"":"alpha(opacity="+b*100+")",f=
d.filter||"";d.filter=Ea.test(f)?f.replace(Ea,e):d.filter+" "+e}};if(t.defaultView&&t.defaultView.getComputedStyle)Ga=function(a,b,d){var e;d=d.replace(ib,"-$1").toLowerCase();if(!(b=a.ownerDocument.defaultView))return B;if(b=b.getComputedStyle(a,null)){e=b.getPropertyValue(d);if(e===""&&!c.contains(a.ownerDocument.documentElement,a))e=c.style(a,d)}return e};if(t.documentElement.currentStyle)aa=function(a,b){var d,e,f=a.currentStyle&&a.currentStyle[b],h=a.style;if(!Fa.test(f)&&jb.test(f)){d=h.left;
e=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;h.left=b==="fontSize"?"1em":f||0;f=h.pixelLeft+"px";h.left=d;a.runtimeStyle.left=e}return f===""?"auto":f};W=Ga||aa;if(c.expr&&c.expr.filters){c.expr.filters.hidden=function(a){var b=a.offsetHeight;return a.offsetWidth===0&&b===0||!c.support.reliableHiddenOffsets&&(a.style.display||c.css(a,"display"))==="none"};c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)}}var mb=c.now(),nb=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
ob=/^(?:select|textarea)/i,pb=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,qb=/^(?:GET|HEAD)$/,Ra=/\[\]$/,T=/\=\?(&|$)/,ja=/\?/,rb=/([?&])_=[^&]*/,sb=/^(\w+:)?\/\/([^\/?#]+)/,tb=/%20/g,ub=/#.*$/,Ha=c.fn.load;c.fn.extend({load:function(a,b,d){if(typeof a!=="string"&&Ha)return Ha.apply(this,arguments);else if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var f=a.slice(e,a.length);a=a.slice(0,e)}e="GET";if(b)if(c.isFunction(b)){d=b;b=null}else if(typeof b===
"object"){b=c.param(b,c.ajaxSettings.traditional);e="POST"}var h=this;c.ajax({url:a,type:e,dataType:"html",data:b,complete:function(l,k){if(k==="success"||k==="notmodified")h.html(f?c("<div>").append(l.responseText.replace(nb,"")).find(f):l.responseText);d&&h.each(d,[l.responseText,k,l])}});return this},serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?c.makeArray(this.elements):this}).filter(function(){return this.name&&
!this.disabled&&(this.checked||ob.test(this.nodeName)||pb.test(this.type))}).map(function(a,b){var d=c(this).val();return d==null?null:c.isArray(d)?c.map(d,function(e){return{name:b.name,value:e}}):{name:b.name,value:d}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){c.fn[b]=function(d){return this.bind(b,d)}});c.extend({get:function(a,b,d,e){if(c.isFunction(b)){e=e||d;d=b;b=null}return c.ajax({type:"GET",url:a,data:b,success:d,dataType:e})},
getScript:function(a,b){return c.get(a,null,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},post:function(a,b,d,e){if(c.isFunction(b)){e=e||d;d=b;b={}}return c.ajax({type:"POST",url:a,data:b,success:d,dataType:e})},ajaxSetup:function(a){c.extend(c.ajaxSettings,a)},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return new E.XMLHttpRequest},accepts:{xml:"application/xml, text/xml",html:"text/html",
script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},ajax:function(a){var b=c.extend(true,{},c.ajaxSettings,a),d,e,f,h=b.type.toUpperCase(),l=qb.test(h);b.url=b.url.replace(ub,"");b.context=a&&a.context!=null?a.context:b;if(b.data&&b.processData&&typeof b.data!=="string")b.data=c.param(b.data,b.traditional);if(b.dataType==="jsonp"){if(h==="GET")T.test(b.url)||(b.url+=(ja.test(b.url)?"&":"?")+(b.jsonp||"callback")+"=?");else if(!b.data||
!T.test(b.data))b.data=(b.data?b.data+"&":"")+(b.jsonp||"callback")+"=?";b.dataType="json"}if(b.dataType==="json"&&(b.data&&T.test(b.data)||T.test(b.url))){d=b.jsonpCallback||"jsonp"+mb++;if(b.data)b.data=(b.data+"").replace(T,"="+d+"$1");b.url=b.url.replace(T,"="+d+"$1");b.dataType="script";var k=E[d];E[d]=function(m){if(c.isFunction(k))k(m);else{E[d]=B;try{delete E[d]}catch(p){}}f=m;c.handleSuccess(b,w,e,f);c.handleComplete(b,w,e,f);r&&r.removeChild(A)}}if(b.dataType==="script"&&b.cache===null)b.cache=
false;if(b.cache===false&&l){var o=c.now(),x=b.url.replace(rb,"$1_="+o);b.url=x+(x===b.url?(ja.test(b.url)?"&":"?")+"_="+o:"")}if(b.data&&l)b.url+=(ja.test(b.url)?"&":"?")+b.data;b.global&&c.active++===0&&c.event.trigger("ajaxStart");o=(o=sb.exec(b.url))&&(o[1]&&o[1].toLowerCase()!==location.protocol||o[2].toLowerCase()!==location.host);if(b.dataType==="script"&&h==="GET"&&o){var r=t.getElementsByTagName("head")[0]||t.documentElement,A=t.createElement("script");if(b.scriptCharset)A.charset=b.scriptCharset;
A.src=b.url;if(!d){var C=false;A.onload=A.onreadystatechange=function(){if(!C&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){C=true;c.handleSuccess(b,w,e,f);c.handleComplete(b,w,e,f);A.onload=A.onreadystatechange=null;r&&A.parentNode&&r.removeChild(A)}}}r.insertBefore(A,r.firstChild);return B}var J=false,w=b.xhr();if(w){b.username?w.open(h,b.url,b.async,b.username,b.password):w.open(h,b.url,b.async);try{if(b.data!=null&&!l||a&&a.contentType)w.setRequestHeader("Content-Type",
b.contentType);if(b.ifModified){c.lastModified[b.url]&&w.setRequestHeader("If-Modified-Since",c.lastModified[b.url]);c.etag[b.url]&&w.setRequestHeader("If-None-Match",c.etag[b.url])}o||w.setRequestHeader("X-Requested-With","XMLHttpRequest");w.setRequestHeader("Accept",b.dataType&&b.accepts[b.dataType]?b.accepts[b.dataType]+", */*; q=0.01":b.accepts._default)}catch(I){}if(b.beforeSend&&b.beforeSend.call(b.context,w,b)===false){b.global&&c.active--===1&&c.event.trigger("ajaxStop");w.abort();return false}b.global&&
c.triggerGlobal(b,"ajaxSend",[w,b]);var L=w.onreadystatechange=function(m){if(!w||w.readyState===0||m==="abort"){J||c.handleComplete(b,w,e,f);J=true;if(w)w.onreadystatechange=c.noop}else if(!J&&w&&(w.readyState===4||m==="timeout")){J=true;w.onreadystatechange=c.noop;e=m==="timeout"?"timeout":!c.httpSuccess(w)?"error":b.ifModified&&c.httpNotModified(w,b.url)?"notmodified":"success";var p;if(e==="success")try{f=c.httpData(w,b.dataType,b)}catch(q){e="parsererror";p=q}if(e==="success"||e==="notmodified")d||
c.handleSuccess(b,w,e,f);else c.handleError(b,w,e,p);d||c.handleComplete(b,w,e,f);m==="timeout"&&w.abort();if(b.async)w=null}};try{var g=w.abort;w.abort=function(){w&&Function.prototype.call.call(g,w);L("abort")}}catch(i){}b.async&&b.timeout>0&&setTimeout(function(){w&&!J&&L("timeout")},b.timeout);try{w.send(l||b.data==null?null:b.data)}catch(n){c.handleError(b,w,null,n);c.handleComplete(b,w,e,f)}b.async||L();return w}},param:function(a,b){var d=[],e=function(h,l){l=c.isFunction(l)?l():l;d[d.length]=
encodeURIComponent(h)+"="+encodeURIComponent(l)};if(b===B)b=c.ajaxSettings.traditional;if(c.isArray(a)||a.jquery)c.each(a,function(){e(this.name,this.value)});else for(var f in a)da(f,a[f],b,e);return d.join("&").replace(tb,"+")}});c.extend({active:0,lastModified:{},etag:{},handleError:function(a,b,d,e){a.error&&a.error.call(a.context,b,d,e);a.global&&c.triggerGlobal(a,"ajaxError",[b,a,e])},handleSuccess:function(a,b,d,e){a.success&&a.success.call(a.context,e,d,b);a.global&&c.triggerGlobal(a,"ajaxSuccess",
[b,a])},handleComplete:function(a,b,d){a.complete&&a.complete.call(a.context,b,d);a.global&&c.triggerGlobal(a,"ajaxComplete",[b,a]);a.global&&c.active--===1&&c.event.trigger("ajaxStop")},triggerGlobal:function(a,b,d){(a.context&&a.context.url==null?c(a.context):c.event).trigger(b,d)},httpSuccess:function(a){try{return!a.status&&location.protocol==="file:"||a.status>=200&&a.status<300||a.status===304||a.status===1223}catch(b){}return false},httpNotModified:function(a,b){var d=a.getResponseHeader("Last-Modified"),
e=a.getResponseHeader("Etag");if(d)c.lastModified[b]=d;if(e)c.etag[b]=e;return a.status===304},httpData:function(a,b,d){var e=a.getResponseHeader("content-type")||"",f=b==="xml"||!b&&e.indexOf("xml")>=0;a=f?a.responseXML:a.responseText;f&&a.documentElement.nodeName==="parsererror"&&c.error("parsererror");if(d&&d.dataFilter)a=d.dataFilter(a,b);if(typeof a==="string")if(b==="json"||!b&&e.indexOf("json")>=0)a=c.parseJSON(a);else if(b==="script"||!b&&e.indexOf("javascript")>=0)c.globalEval(a);return a}});
if(E.ActiveXObject)c.ajaxSettings.xhr=function(){if(E.location.protocol!=="file:")try{return new E.XMLHttpRequest}catch(a){}try{return new E.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}};c.support.ajax=!!c.ajaxSettings.xhr();var ea={},vb=/^(?:toggle|show|hide)$/,wb=/^([+\-]=)?([\d+.\-]+)(.*)$/,ba,pa=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];c.fn.extend({show:function(a,b,d){if(a||a===0)return this.animate(S("show",
3),a,b,d);else{d=0;for(var e=this.length;d<e;d++){a=this[d];b=a.style.display;if(!c.data(a,"olddisplay")&&b==="none")b=a.style.display="";b===""&&c.css(a,"display")==="none"&&c.data(a,"olddisplay",qa(a.nodeName))}for(d=0;d<e;d++){a=this[d];b=a.style.display;if(b===""||b==="none")a.style.display=c.data(a,"olddisplay")||""}return this}},hide:function(a,b,d){if(a||a===0)return this.animate(S("hide",3),a,b,d);else{a=0;for(b=this.length;a<b;a++){d=c.css(this[a],"display");d!=="none"&&c.data(this[a],"olddisplay",
d)}for(a=0;a<b;a++)this[a].style.display="none";return this}},_toggle:c.fn.toggle,toggle:function(a,b,d){var e=typeof a==="boolean";if(c.isFunction(a)&&c.isFunction(b))this._toggle.apply(this,arguments);else a==null||e?this.each(function(){var f=e?a:c(this).is(":hidden");c(this)[f?"show":"hide"]()}):this.animate(S("toggle",3),a,b,d);return this},fadeTo:function(a,b,d,e){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,d,e)},animate:function(a,b,d,e){var f=c.speed(b,
d,e);if(c.isEmptyObject(a))return this.each(f.complete);return this[f.queue===false?"each":"queue"](function(){var h=c.extend({},f),l,k=this.nodeType===1,o=k&&c(this).is(":hidden"),x=this;for(l in a){var r=c.camelCase(l);if(l!==r){a[r]=a[l];delete a[l];l=r}if(a[l]==="hide"&&o||a[l]==="show"&&!o)return h.complete.call(this);if(k&&(l==="height"||l==="width")){h.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];if(c.css(this,"display")==="inline"&&c.css(this,"float")==="none")if(c.support.inlineBlockNeedsLayout)if(qa(this.nodeName)===
"inline")this.style.display="inline-block";else{this.style.display="inline";this.style.zoom=1}else this.style.display="inline-block"}if(c.isArray(a[l])){(h.specialEasing=h.specialEasing||{})[l]=a[l][1];a[l]=a[l][0]}}if(h.overflow!=null)this.style.overflow="hidden";h.curAnim=c.extend({},a);c.each(a,function(A,C){var J=new c.fx(x,h,A);if(vb.test(C))J[C==="toggle"?o?"show":"hide":C](a);else{var w=wb.exec(C),I=J.cur()||0;if(w){var L=parseFloat(w[2]),g=w[3]||"px";if(g!=="px"){c.style(x,A,(L||1)+g);I=(L||
1)/J.cur()*I;c.style(x,A,I+g)}if(w[1])L=(w[1]==="-="?-1:1)*L+I;J.custom(I,L,g)}else J.custom(I,C,"")}});return true})},stop:function(a,b){var d=c.timers;a&&this.queue([]);this.each(function(){for(var e=d.length-1;e>=0;e--)if(d[e].elem===this){b&&d[e](true);d.splice(e,1)}});b||this.dequeue();return this}});c.each({slideDown:S("show",1),slideUp:S("hide",1),slideToggle:S("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){c.fn[a]=function(d,e,f){return this.animate(b,
d,e,f)}});c.extend({speed:function(a,b,d){var e=a&&typeof a==="object"?c.extend({},a):{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,easing:d&&b||b&&!c.isFunction(b)&&b};e.duration=c.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in c.fx.speeds?c.fx.speeds[e.duration]:c.fx.speeds._default;e.old=e.complete;e.complete=function(){e.queue!==false&&c(this).dequeue();c.isFunction(e.old)&&e.old.call(this)};return e},easing:{linear:function(a,b,d,e){return d+e*a},swing:function(a,b,d,e){return(-Math.cos(a*
Math.PI)/2+0.5)*e+d}},timers:[],fx:function(a,b,d){this.options=b;this.elem=a;this.prop=d;if(!b.orig)b.orig={}}});c.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||c.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a=parseFloat(c.css(this.elem,this.prop));return a&&a>-1E4?a:0},custom:function(a,b,d){function e(l){return f.step(l)}
var f=this,h=c.fx;this.startTime=c.now();this.start=a;this.end=b;this.unit=d||this.unit||"px";this.now=this.start;this.pos=this.state=0;e.elem=this.elem;if(e()&&c.timers.push(e)&&!ba)ba=setInterval(h.tick,h.interval)},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=true;this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=true;
this.custom(this.cur(),0)},step:function(a){var b=c.now(),d=true;if(a||b>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;for(var e in this.options.curAnim)if(this.options.curAnim[e]!==true)d=false;if(d){if(this.options.overflow!=null&&!c.support.shrinkWrapBlocks){var f=this.elem,h=this.options;c.each(["","X","Y"],function(k,o){f.style["overflow"+o]=h.overflow[k]})}this.options.hide&&c(this.elem).hide();if(this.options.hide||
this.options.show)for(var l in this.options.curAnim)c.style(this.elem,l,this.options.orig[l]);this.options.complete.call(this.elem)}return false}else{a=b-this.startTime;this.state=a/this.options.duration;b=this.options.easing||(c.easing.swing?"swing":"linear");this.pos=c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||b](this.state,a,0,1,this.options.duration);this.now=this.start+(this.end-this.start)*this.pos;this.update()}return true}};c.extend(c.fx,{tick:function(){for(var a=
c.timers,b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||c.fx.stop()},interval:13,stop:function(){clearInterval(ba);ba=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){if(a.elem.style&&a.elem.style[a.prop]!=null)a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit;else a.elem[a.prop]=a.now}}});if(c.expr&&c.expr.filters)c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===
b.elem}).length};var xb=/^t(?:able|d|h)$/i,Ia=/^(?:body|html)$/i;c.fn.offset="getBoundingClientRect"in t.documentElement?function(a){var b=this[0],d;if(a)return this.each(function(l){c.offset.setOffset(this,a,l)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);try{d=b.getBoundingClientRect()}catch(e){}var f=b.ownerDocument,h=f.documentElement;if(!d||!c.contains(h,b))return d||{top:0,left:0};b=f.body;f=fa(f);return{top:d.top+(f.pageYOffset||c.support.boxModel&&
h.scrollTop||b.scrollTop)-(h.clientTop||b.clientTop||0),left:d.left+(f.pageXOffset||c.support.boxModel&&h.scrollLeft||b.scrollLeft)-(h.clientLeft||b.clientLeft||0)}}:function(a){var b=this[0];if(a)return this.each(function(x){c.offset.setOffset(this,a,x)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d,e=b.offsetParent,f=b.ownerDocument,h=f.documentElement,l=f.body;d=(f=f.defaultView)?f.getComputedStyle(b,null):b.currentStyle;
for(var k=b.offsetTop,o=b.offsetLeft;(b=b.parentNode)&&b!==l&&b!==h;){if(c.offset.supportsFixedPosition&&d.position==="fixed")break;d=f?f.getComputedStyle(b,null):b.currentStyle;k-=b.scrollTop;o-=b.scrollLeft;if(b===e){k+=b.offsetTop;o+=b.offsetLeft;if(c.offset.doesNotAddBorder&&!(c.offset.doesAddBorderForTableAndCells&&xb.test(b.nodeName))){k+=parseFloat(d.borderTopWidth)||0;o+=parseFloat(d.borderLeftWidth)||0}e=b.offsetParent}if(c.offset.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"){k+=
parseFloat(d.borderTopWidth)||0;o+=parseFloat(d.borderLeftWidth)||0}d=d}if(d.position==="relative"||d.position==="static"){k+=l.offsetTop;o+=l.offsetLeft}if(c.offset.supportsFixedPosition&&d.position==="fixed"){k+=Math.max(h.scrollTop,l.scrollTop);o+=Math.max(h.scrollLeft,l.scrollLeft)}return{top:k,left:o}};c.offset={initialize:function(){var a=t.body,b=t.createElement("div"),d,e,f,h=parseFloat(c.css(a,"marginTop"))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",
height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";a.insertBefore(b,a.firstChild);d=b.firstChild;e=d.firstChild;f=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=e.offsetTop!==5;this.doesAddBorderForTableAndCells=
f.offsetTop===5;e.style.position="fixed";e.style.top="20px";this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15;e.style.position=e.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==h;a.removeChild(b);c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();if(c.offset.doesNotIncludeMarginInBodyOffset){b+=parseFloat(c.css(a,
"marginTop"))||0;d+=parseFloat(c.css(a,"marginLeft"))||0}return{top:b,left:d}},setOffset:function(a,b,d){var e=c.css(a,"position");if(e==="static")a.style.position="relative";var f=c(a),h=f.offset(),l=c.css(a,"top"),k=c.css(a,"left"),o=e==="absolute"&&c.inArray("auto",[l,k])>-1;e={};var x={};if(o)x=f.position();l=o?x.top:parseInt(l,10)||0;k=o?x.left:parseInt(k,10)||0;if(c.isFunction(b))b=b.call(a,d,h);if(b.top!=null)e.top=b.top-h.top+l;if(b.left!=null)e.left=b.left-h.left+k;"using"in b?b.using.call(a,
e):f.css(e)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),e=Ia.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.css(a,"marginTop"))||0;d.left-=parseFloat(c.css(a,"marginLeft"))||0;e.top+=parseFloat(c.css(b[0],"borderTopWidth"))||0;e.left+=parseFloat(c.css(b[0],"borderLeftWidth"))||0;return{top:d.top-e.top,left:d.left-e.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||t.body;a&&!Ia.test(a.nodeName)&&
c.css(a,"position")==="static";)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+b;c.fn[d]=function(e){var f=this[0],h;if(!f)return null;if(e!==B)return this.each(function(){if(h=fa(this))h.scrollTo(!a?e:c(h).scrollLeft(),a?e:c(h).scrollTop());else this[d]=e});else return(h=fa(f))?"pageXOffset"in h?h[a?"pageYOffset":"pageXOffset"]:c.support.boxModel&&h.document.documentElement[d]||h.document.body[d]:f[d]}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();
c.fn["inner"+b]=function(){return this[0]?parseFloat(c.css(this[0],d,"padding")):null};c.fn["outer"+b]=function(e){return this[0]?parseFloat(c.css(this[0],d,e?"margin":"border")):null};c.fn[d]=function(e){var f=this[0];if(!f)return e==null?null:this;if(c.isFunction(e))return this.each(function(l){var k=c(this);k[d](e.call(this,l,k[d]()))});if(c.isWindow(f))return f.document.compatMode==="CSS1Compat"&&f.document.documentElement["client"+b]||f.document.body["client"+b];else if(f.nodeType===9)return Math.max(f.documentElement["client"+
b],f.body["scroll"+b],f.documentElement["scroll"+b],f.body["offset"+b],f.documentElement["offset"+b]);else if(e===B){f=c.css(f,d);var h=parseFloat(f);return c.isNaN(h)?f:h}else return this.css(d,typeof e==="string"?e:e+"px")}})})(window);
(function(){jQuery.color={};jQuery.color.make=function(G,H,J,I){var A={};A.r=G||0;A.g=H||0;A.b=J||0;A.a=I!=null?I:1;A.add=function(C,D){for(var E=0;E<C.length;++E){A[C.charAt(E)]+=D}return A.normalize()};A.scale=function(C,D){for(var E=0;E<C.length;++E){A[C.charAt(E)]*=D}return A.normalize()};A.toString=function(){if(A.a>=1){return"rgb("+[A.r,A.g,A.b].join(",")+")"}else{return"rgba("+[A.r,A.g,A.b,A.a].join(",")+")"}};A.normalize=function(){function C(E,D,F){return D<E?E:(D>F?F:D)}A.r=C(0,parseInt(A.r),255);A.g=C(0,parseInt(A.g),255);A.b=C(0,parseInt(A.b),255);A.a=C(0,A.a,1);return A};A.clone=function(){return jQuery.color.make(A.r,A.b,A.g,A.a)};return A.normalize()};jQuery.color.extract=function(E,F){var A;do{A=E.css(F).toLowerCase();if(A!=""&&A!="transparent"){break}E=E.parent()}while(!jQuery.nodeName(E.get(0),"body"));if(A=="rgba(0, 0, 0, 0)"){A="transparent"}return jQuery.color.parse(A)};jQuery.color.parse=function(A){var F,H=jQuery.color.make;if(F=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(A)){return H(parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10))}if(F=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(A)){return H(parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10),parseFloat(F[4]))}if(F=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(A)){return H(parseFloat(F[1])*2.55,parseFloat(F[2])*2.55,parseFloat(F[3])*2.55)}if(F=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(A)){return H(parseFloat(F[1])*2.55,parseFloat(F[2])*2.55,parseFloat(F[3])*2.55,parseFloat(F[4]))}if(F=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(A)){return H(parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16))}if(F=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(A)){return H(parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16))}var G=jQuery.trim(A).toLowerCase();if(G=="transparent"){return H(255,255,255,0)}else{F=B[G];return H(F[0],F[1],F[2])}};var B={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})();(function(C){function B(l,W,X,E){var O=[],g={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],legend:{show:true,noColumns:1,labelFormatter:null,labelBoxBorderColor:"#ccc",container:null,position:"ne",margin:5,backgroundColor:null,backgroundOpacity:0.85},xaxis:{mode:null,transform:null,inverseTransform:null,min:null,max:null,autoscaleMargin:null,ticks:null,tickFormatter:null,labelWidth:null,labelHeight:null,tickDecimals:null,tickSize:null,minTickSize:null,monthNames:null,timeformat:null,twelveHourClock:false},yaxis:{autoscaleMargin:0.02},x2axis:{autoscaleMargin:null},y2axis:{autoscaleMargin:0.02},series:{points:{show:false,radius:3,lineWidth:2,fill:true,fillColor:"#ffffff"},lines:{lineWidth:2,fill:false,fillColor:null,steps:false},bars:{show:false,lineWidth:2,barWidth:1,fill:true,fillColor:null,align:"left",horizontal:false},shadowSize:3},grid:{show:true,aboveData:false,color:"#545454",backgroundColor:null,tickColor:"rgba(0,0,0,0.15)",labelMargin:5,borderWidth:2,borderColor:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:false,hoverable:false,autoHighlight:true,mouseActiveRadius:10},hooks:{}},P=null,AC=null,AD=null,Y=null,AJ=null,s={xaxis:{},yaxis:{},x2axis:{},y2axis:{}},e={left:0,right:0,top:0,bottom:0},y=0,Q=0,I=0,t=0,L={processOptions:[],processRawData:[],processDatapoints:[],draw:[],bindEvents:[],drawOverlay:[]},G=this;G.setData=f;G.setupGrid=k;G.draw=AH;G.getPlaceholder=function(){return l};G.getCanvas=function(){return P};G.getPlotOffset=function(){return e};G.width=function(){return I};G.height=function(){return t};G.offset=function(){var AK=AD.offset();AK.left+=e.left;AK.top+=e.top;return AK};G.getData=function(){return O};G.getAxes=function(){return s};G.getOptions=function(){return g};G.highlight=AE;G.unhighlight=x;G.triggerRedrawOverlay=q;G.pointOffset=function(AK){return{left:parseInt(T(AK,"xaxis").p2c(+AK.x)+e.left),top:parseInt(T(AK,"yaxis").p2c(+AK.y)+e.top)}};G.hooks=L;b(G);r(X);c();f(W);k();AH();AG();function Z(AM,AK){AK=[G].concat(AK);for(var AL=0;AL<AM.length;++AL){AM[AL].apply(this,AK)}}function b(){for(var AK=0;AK<E.length;++AK){var AL=E[AK];AL.init(G);if(AL.options){C.extend(true,g,AL.options)}}}function r(AK){C.extend(true,g,AK);if(g.grid.borderColor==null){g.grid.borderColor=g.grid.color}if(g.xaxis.noTicks&&g.xaxis.ticks==null){g.xaxis.ticks=g.xaxis.noTicks}if(g.yaxis.noTicks&&g.yaxis.ticks==null){g.yaxis.ticks=g.yaxis.noTicks}if(g.grid.coloredAreas){g.grid.markings=g.grid.coloredAreas}if(g.grid.coloredAreasColor){g.grid.markingsColor=g.grid.coloredAreasColor}if(g.lines){C.extend(true,g.series.lines,g.lines)}if(g.points){C.extend(true,g.series.points,g.points)}if(g.bars){C.extend(true,g.series.bars,g.bars)}if(g.shadowSize){g.series.shadowSize=g.shadowSize}for(var AL in L){if(g.hooks[AL]&&g.hooks[AL].length){L[AL]=L[AL].concat(g.hooks[AL])}}Z(L.processOptions,[g])}function f(AK){O=M(AK);U();m()}function M(AN){var AL=[];for(var AK=0;AK<AN.length;++AK){var AM=C.extend(true,{},g.series);if(AN[AK].data){AM.data=AN[AK].data;delete AN[AK].data;C.extend(true,AM,AN[AK]);AN[AK].data=AM.data}else{AM.data=AN[AK]}AL.push(AM)}return AL}function T(AM,AK){var AL=AM[AK];if(!AL||AL==1){return s[AK]}if(typeof AL=="number"){return s[AK.charAt(0)+AL+AK.slice(1)]}return AL}function U(){var AP;var AV=O.length,AK=[],AN=[];for(AP=0;AP<O.length;++AP){var AS=O[AP].color;if(AS!=null){--AV;if(typeof AS=="number"){AN.push(AS)}else{AK.push(C.color.parse(O[AP].color))}}}for(AP=0;AP<AN.length;++AP){AV=Math.max(AV,AN[AP]+1)}var AL=[],AO=0;AP=0;while(AL.length<AV){var AR;if(g.colors.length==AP){AR=C.color.make(100,100,100)}else{AR=C.color.parse(g.colors[AP])}var AM=AO%2==1?-1:1;AR.scale("rgb",1+AM*Math.ceil(AO/2)*0.2);AL.push(AR);++AP;if(AP>=g.colors.length){AP=0;++AO}}var AQ=0,AW;for(AP=0;AP<O.length;++AP){AW=O[AP];if(AW.color==null){AW.color=AL[AQ].toString();++AQ}else{if(typeof AW.color=="number"){AW.color=AL[AW.color].toString()}}if(AW.lines.show==null){var AU,AT=true;for(AU in AW){if(AW[AU].show){AT=false;break}}if(AT){AW.lines.show=true}}AW.xaxis=T(AW,"xaxis");AW.yaxis=T(AW,"yaxis")}}function m(){var AW=Number.POSITIVE_INFINITY,AQ=Number.NEGATIVE_INFINITY,Ac,Aa,AZ,AV,AL,AR,Ab,AX,AP,AO,AK,Ai,Af,AT;for(AK in s){s[AK].datamin=AW;s[AK].datamax=AQ;s[AK].used=false}function AN(Al,Ak,Aj){if(Ak<Al.datamin){Al.datamin=Ak}if(Aj>Al.datamax){Al.datamax=Aj}}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];AR.datapoints={points:[]};Z(L.processRawData,[AR,AR.data,AR.datapoints])}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];var Ah=AR.data,Ae=AR.datapoints.format;if(!Ae){Ae=[];Ae.push({x:true,number:true,required:true});Ae.push({y:true,number:true,required:true});if(AR.bars.show){Ae.push({y:true,number:true,required:false,defaultValue:0})}AR.datapoints.format=Ae}if(AR.datapoints.pointsize!=null){continue}if(AR.datapoints.pointsize==null){AR.datapoints.pointsize=Ae.length}AX=AR.datapoints.pointsize;Ab=AR.datapoints.points;insertSteps=AR.lines.show&&AR.lines.steps;AR.xaxis.used=AR.yaxis.used=true;for(Aa=AZ=0;Aa<Ah.length;++Aa,AZ+=AX){AT=Ah[Aa];var AM=AT==null;if(!AM){for(AV=0;AV<AX;++AV){Ai=AT[AV];Af=Ae[AV];if(Af){if(Af.number&&Ai!=null){Ai=+Ai;if(isNaN(Ai)){Ai=null}}if(Ai==null){if(Af.required){AM=true}if(Af.defaultValue!=null){Ai=Af.defaultValue}}}Ab[AZ+AV]=Ai}}if(AM){for(AV=0;AV<AX;++AV){Ai=Ab[AZ+AV];if(Ai!=null){Af=Ae[AV];if(Af.x){AN(AR.xaxis,Ai,Ai)}if(Af.y){AN(AR.yaxis,Ai,Ai)}}Ab[AZ+AV]=null}}else{if(insertSteps&&AZ>0&&Ab[AZ-AX]!=null&&Ab[AZ-AX]!=Ab[AZ]&&Ab[AZ-AX+1]!=Ab[AZ+1]){for(AV=0;AV<AX;++AV){Ab[AZ+AX+AV]=Ab[AZ+AV]}Ab[AZ+1]=Ab[AZ-AX+1];AZ+=AX}}}}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];Z(L.processDatapoints,[AR,AR.datapoints])}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];Ab=AR.datapoints.points,AX=AR.datapoints.pointsize;var AS=AW,AY=AW,AU=AQ,Ad=AQ;for(Aa=0;Aa<Ab.length;Aa+=AX){if(Ab[Aa]==null){continue}for(AV=0;AV<AX;++AV){Ai=Ab[Aa+AV];Af=Ae[AV];if(!Af){continue}if(Af.x){if(Ai<AS){AS=Ai}if(Ai>AU){AU=Ai}}if(Af.y){if(Ai<AY){AY=Ai}if(Ai>Ad){Ad=Ai}}}}if(AR.bars.show){var Ag=AR.bars.align=="left"?0:-AR.bars.barWidth/2;if(AR.bars.horizontal){AY+=Ag;Ad+=Ag+AR.bars.barWidth}else{AS+=Ag;AU+=Ag+AR.bars.barWidth}}AN(AR.xaxis,AS,AU);AN(AR.yaxis,AY,Ad)}for(AK in s){if(s[AK].datamin==AW){s[AK].datamin=null}if(s[AK].datamax==AQ){s[AK].datamax=null}}}function c(){var IE_VERSION = 0;function AK(AM,AL){var AN=document.createElement("canvas");AN.width=AM;AN.height=AL;if(C.browser.msie){IE_VERSION= document.documentMode;if(IE_VERSION<=8){AN=window.G_vmlCanvasManager.initElement(AN)}}return AN}y=l.width();Q=l.height();l.html("");if(l.css("position")=="static"){l.css("position","relative")}if(y<=0||Q<=0){throw"Invalid dimensions for plot, width = "+y+", height = "+Q}if(C.browser.msie){IE_VERSION= document.documentMode;if(IE_VERSION<=8){window.G_vmlCanvasManager.init_(document)}}P=C(AK(y,Q)).appendTo(l).get(0);Y=P.getContext("2d");AC=C(AK(y,Q)).css({position:"absolute",left:0,top:0}).appendTo(l).get(0);AJ=AC.getContext("2d");AJ.stroke()}function AG(){AD=C([AC,P]);if(g.grid.hoverable){AD.mousemove(D)}if(g.grid.clickable){AD.click(d)}Z(L.bindEvents,[AD])}function k(){function AL(AT,AU){function AP(AV){return AV}var AS,AO,AQ=AU.transform||AP,AR=AU.inverseTransform;if(AT==s.xaxis||AT==s.x2axis){AS=AT.scale=I/(AQ(AT.max)-AQ(AT.min));AO=AQ(AT.min);if(AQ==AP){AT.p2c=function(AV){return(AV-AO)*AS}}else{AT.p2c=function(AV){return(AQ(AV)-AO)*AS}}if(!AR){AT.c2p=function(AV){return AO+AV/AS}}else{AT.c2p=function(AV){return AR(AO+AV/AS)}}}else{AS=AT.scale=t/(AQ(AT.max)-AQ(AT.min));AO=AQ(AT.max);if(AQ==AP){AT.p2c=function(AV){return(AO-AV)*AS}}else{AT.p2c=function(AV){return(AO-AQ(AV))*AS}}if(!AR){AT.c2p=function(AV){return AO-AV/AS}}else{AT.c2p=function(AV){return AR(AO-AV/AS)}}}}function AN(AR,AT){var AQ,AS=[],AP;AR.labelWidth=AT.labelWidth;AR.labelHeight=AT.labelHeight;if(AR==s.xaxis||AR==s.x2axis){if(AR.labelWidth==null){AR.labelWidth=y/(AR.ticks.length>0?AR.ticks.length:1)}if(AR.labelHeight==null){AS=[];for(AQ=0;AQ<AR.ticks.length;++AQ){AP=AR.ticks[AQ].label;if(AP){AS.push('<div class="tickLabel" style="float:left;width:'+AR.labelWidth+'px">'+AP+"</div>")}}if(AS.length>0){var AO=C('<div style="position:absolute;top:-10000px;width:10000px;font-size:smaller">'+AS.join("")+'<div style="clear:left"></div></div>').appendTo(l);AR.labelHeight=AO.height();AO.remove()}}}else{if(AR.labelWidth==null||AR.labelHeight==null){for(AQ=0;AQ<AR.ticks.length;++AQ){AP=AR.ticks[AQ].label;if(AP){AS.push('<div class="tickLabel">'+AP+"</div>")}}if(AS.length>0){var AO=C('<div style="position:absolute;top:-10000px;font-size:smaller">'+AS.join("")+"</div>").appendTo(l);if(AR.labelWidth==null){AR.labelWidth=AO.width()}if(AR.labelHeight==null){AR.labelHeight=AO.find("div").height()}AO.remove()}}}if(AR.labelWidth==null){AR.labelWidth=0}if(AR.labelHeight==null){AR.labelHeight=0}}function AM(){var AP=g.grid.borderWidth;for(i=0;i<O.length;++i){AP=Math.max(AP,2*(O[i].points.radius+O[i].points.lineWidth/2))}e.left=e.right=e.top=e.bottom=AP;var AO=g.grid.labelMargin+g.grid.borderWidth;if(s.xaxis.labelHeight>0){e.bottom=Math.max(AP,s.xaxis.labelHeight+AO)}if(s.yaxis.labelWidth>0){e.left=Math.max(AP,s.yaxis.labelWidth+AO)}if(s.x2axis.labelHeight>0){e.top=Math.max(AP,s.x2axis.labelHeight+AO)}if(s.y2axis.labelWidth>0){e.right=Math.max(AP,s.y2axis.labelWidth+AO)}I=y-e.left-e.right;t=Q-e.bottom-e.top}var AK;for(AK in s){K(s[AK],g[AK])}if(g.grid.show){for(AK in s){F(s[AK],g[AK]);p(s[AK],g[AK]);AN(s[AK],g[AK])}AM()}else{e.left=e.right=e.top=e.bottom=0;I=y;t=Q}for(AK in s){AL(s[AK],g[AK])}if(g.grid.show){h()}AI()}function K(AN,AQ){var AM=+(AQ.min!=null?AQ.min:AN.datamin),AK=+(AQ.max!=null?AQ.max:AN.datamax),AP=AK-AM;if(AP==0){var AL=AK==0?1:0.01;if(AQ.min==null){AM-=AL}if(AQ.max==null||AQ.min!=null){AK+=AL}}else{var AO=AQ.autoscaleMargin;if(AO!=null){if(AQ.min==null){AM-=AP*AO;if(AM<0&&AN.datamin!=null&&AN.datamin>=0){AM=0}}if(AQ.max==null){AK+=AP*AO;if(AK>0&&AN.datamax!=null&&AN.datamax<=0){AK=0}}}}AN.min=AM;AN.max=AK}function F(AP,AS){var AO;if(typeof AS.ticks=="number"&&AS.ticks>0){AO=AS.ticks}else{if(AP==s.xaxis||AP==s.x2axis){AO=0.3*Math.sqrt(y)}else{AO=0.3*Math.sqrt(Q)}}var AX=(AP.max-AP.min)/AO,AZ,AT,AV,AW,AR,AM,AL;if(AS.mode=="time"){var AU={second:1000,minute:60*1000,hour:60*60*1000,day:24*60*60*1000,month:30*24*60*60*1000,year:365.2425*24*60*60*1000};var AY=[[1,"second"],[2,"second"],[5,"second"],[10,"second"],[30,"second"],[1,"minute"],[2,"minute"],[5,"minute"],[10,"minute"],[30,"minute"],[1,"hour"],[2,"hour"],[4,"hour"],[8,"hour"],[12,"hour"],[1,"day"],[2,"day"],[3,"day"],[0.25,"month"],[0.5,"month"],[1,"month"],[2,"month"],[3,"month"],[6,"month"],[1,"year"]];var AN=0;if(AS.minTickSize!=null){if(typeof AS.tickSize=="number"){AN=AS.tickSize}else{AN=AS.minTickSize[0]*AU[AS.minTickSize[1]]}}for(AR=0;AR<AY.length-1;++AR){if(AX<(AY[AR][0]*AU[AY[AR][1]]+AY[AR+1][0]*AU[AY[AR+1][1]])/2&&AY[AR][0]*AU[AY[AR][1]]>=AN){break}}AZ=AY[AR][0];AV=AY[AR][1];if(AV=="year"){AM=Math.pow(10,Math.floor(Math.log(AX/AU.year)/Math.LN10));AL=(AX/AU.year)/AM;if(AL<1.5){AZ=1}else{if(AL<3){AZ=2}else{if(AL<7.5){AZ=5}else{AZ=10}}}AZ*=AM}if(AS.tickSize){AZ=AS.tickSize[0];AV=AS.tickSize[1]}AT=function(Ac){var Ah=[],Af=Ac.tickSize[0],Ai=Ac.tickSize[1],Ag=new Date(Ac.min);var Ab=Af*AU[Ai];if(Ai=="second"){Ag.setUTCSeconds(A(Ag.getUTCSeconds(),Af))}if(Ai=="minute"){Ag.setUTCMinutes(A(Ag.getUTCMinutes(),Af))}if(Ai=="hour"){Ag.setUTCHours(A(Ag.getUTCHours(),Af))}if(Ai=="month"){Ag.setUTCMonth(A(Ag.getUTCMonth(),Af))}if(Ai=="year"){Ag.setUTCFullYear(A(Ag.getUTCFullYear(),Af))}Ag.setUTCMilliseconds(0);if(Ab>=AU.minute){Ag.setUTCSeconds(0)}if(Ab>=AU.hour){Ag.setUTCMinutes(0)}if(Ab>=AU.day){Ag.setUTCHours(0)}if(Ab>=AU.day*4){Ag.setUTCDate(1)}if(Ab>=AU.year){Ag.setUTCMonth(0)}var Ak=0,Aj=Number.NaN,Ad;do{Ad=Aj;Aj=Ag.getTime();Ah.push({v:Aj,label:Ac.tickFormatter(Aj,Ac)});if(Ai=="month"){if(Af<1){Ag.setUTCDate(1);var Aa=Ag.getTime();Ag.setUTCMonth(Ag.getUTCMonth()+1);var Ae=Ag.getTime();Ag.setTime(Aj+Ak*AU.hour+(Ae-Aa)*Af);Ak=Ag.getUTCHours();Ag.setUTCHours(0)}else{Ag.setUTCMonth(Ag.getUTCMonth()+Af)}}else{if(Ai=="year"){Ag.setUTCFullYear(Ag.getUTCFullYear()+Af)}else{Ag.setTime(Aj+Ab)}}}while(Aj<Ac.max&&Aj!=Ad);return Ah};AW=function(Aa,Ad){var Af=new Date(Aa);if(AS.timeformat!=null){return C.plot.formatDate(Af,AS.timeformat,AS.monthNames)}var Ab=Ad.tickSize[0]*AU[Ad.tickSize[1]];var Ac=Ad.max-Ad.min;var Ae=(AS.twelveHourClock)?" %p":"";if(Ab<AU.minute){fmt="%h:%M:%S"+Ae}else{if(Ab<AU.day){if(Ac<2*AU.day){fmt="%h:%M"+Ae}else{fmt="%b %d %h:%M"+Ae}}else{if(Ab<AU.month){fmt="%b %d"}else{if(Ab<AU.year){if(Ac<AU.year){fmt="%b"}else{fmt="%b %y"}}else{fmt="%y"}}}}return C.plot.formatDate(Af,fmt,AS.monthNames)}}else{var AK=AS.tickDecimals;var AQ=-Math.floor(Math.log(AX)/Math.LN10);if(AK!=null&&AQ>AK){AQ=AK}AM=Math.pow(10,-AQ);AL=AX/AM;if(AL<1.5){AZ=1}else{if(AL<3){AZ=2;if(AL>2.25&&(AK==null||AQ+1<=AK)){AZ=2.5;++AQ}}else{if(AL<7.5){AZ=5}else{AZ=10}}}AZ*=AM;if(AS.minTickSize!=null&&AZ<AS.minTickSize){AZ=AS.minTickSize}if(AS.tickSize!=null){AZ=AS.tickSize}AP.tickDecimals=Math.max(0,(AK!=null)?AK:AQ);AT=function(Ac){var Ae=[];var Af=A(Ac.min,Ac.tickSize),Ab=0,Aa=Number.NaN,Ad;do{Ad=Aa;Aa=Af+Ab*Ac.tickSize;Ae.push({v:Aa,label:Ac.tickFormatter(Aa,Ac)});++Ab}while(Aa<Ac.max&&Aa!=Ad);return Ae};AW=function(Aa,Ab){return Aa.toFixed(Ab.tickDecimals)}}AP.tickSize=AV?[AZ,AV]:AZ;AP.tickGenerator=AT;if(C.isFunction(AS.tickFormatter)){AP.tickFormatter=function(Aa,Ab){return""+AS.tickFormatter(Aa,Ab)}}else{AP.tickFormatter=AW}}function p(AO,AQ){AO.ticks=[];if(!AO.used){return }if(AQ.ticks==null){AO.ticks=AO.tickGenerator(AO)}else{if(typeof AQ.ticks=="number"){if(AQ.ticks>0){AO.ticks=AO.tickGenerator(AO)}}else{if(AQ.ticks){var AP=AQ.ticks;if(C.isFunction(AP)){AP=AP({min:AO.min,max:AO.max})}var AN,AK;for(AN=0;AN<AP.length;++AN){var AL=null;var AM=AP[AN];if(typeof AM=="object"){AK=AM[0];if(AM.length>1){AL=AM[1]}}else{AK=AM}if(AL==null){AL=AO.tickFormatter(AK,AO)}AO.ticks[AN]={v:AK,label:AL}}}}}if(AQ.autoscaleMargin!=null&&AO.ticks.length>0){if(AQ.min==null){AO.min=Math.min(AO.min,AO.ticks[0].v)}if(AQ.max==null&&AO.ticks.length>1){AO.max=Math.max(AO.max,AO.ticks[AO.ticks.length-1].v)}}}function AH(){Y.clearRect(0,0,y,Q);var AL=g.grid;if(AL.show&&!AL.aboveData){S()}for(var AK=0;AK<O.length;++AK){AA(O[AK])}Z(L.draw,[Y]);if(AL.show&&AL.aboveData){S()}}function N(AL,AR){var AO=AR+"axis",AK=AR+"2axis",AN,AQ,AP,AM;if(AL[AO]){AN=s[AO];AQ=AL[AO].from;AP=AL[AO].to}else{if(AL[AK]){AN=s[AK];AQ=AL[AK].from;AP=AL[AK].to}else{AN=s[AO];AQ=AL[AR+"1"];AP=AL[AR+"2"]}}if(AQ!=null&&AP!=null&&AQ>AP){return{from:AP,to:AQ,axis:AN}}return{from:AQ,to:AP,axis:AN}}function S(){var AO;Y.save();Y.translate(e.left,e.top);if(g.grid.backgroundColor){Y.fillStyle=R(g.grid.backgroundColor,t,0,"rgba(255, 255, 255, 0)");Y.fillRect(0,0,I,t)}var AL=g.grid.markings;if(AL){if(C.isFunction(AL)){AL=AL({xmin:s.xaxis.min,xmax:s.xaxis.max,ymin:s.yaxis.min,ymax:s.yaxis.max,xaxis:s.xaxis,yaxis:s.yaxis,x2axis:s.x2axis,y2axis:s.y2axis})}for(AO=0;AO<AL.length;++AO){var AK=AL[AO],AQ=N(AK,"x"),AN=N(AK,"y");if(AQ.from==null){AQ.from=AQ.axis.min}if(AQ.to==null){AQ.to=AQ.axis.max}if(AN.from==null){AN.from=AN.axis.min}if(AN.to==null){AN.to=AN.axis.max}if(AQ.to<AQ.axis.min||AQ.from>AQ.axis.max||AN.to<AN.axis.min||AN.from>AN.axis.max){continue}AQ.from=Math.max(AQ.from,AQ.axis.min);AQ.to=Math.min(AQ.to,AQ.axis.max);AN.from=Math.max(AN.from,AN.axis.min);AN.to=Math.min(AN.to,AN.axis.max);if(AQ.from==AQ.to&&AN.from==AN.to){continue}AQ.from=AQ.axis.p2c(AQ.from);AQ.to=AQ.axis.p2c(AQ.to);AN.from=AN.axis.p2c(AN.from);AN.to=AN.axis.p2c(AN.to);if(AQ.from==AQ.to||AN.from==AN.to){Y.beginPath();Y.strokeStyle=AK.color||g.grid.markingsColor;Y.lineWidth=AK.lineWidth||g.grid.markingsLineWidth;Y.moveTo(AQ.from,AN.from);Y.lineTo(AQ.to,AN.to);Y.stroke()}else{Y.fillStyle=AK.color||g.grid.markingsColor;Y.fillRect(AQ.from,AN.to,AQ.to-AQ.from,AN.from-AN.to)}}}Y.lineWidth=1;Y.strokeStyle=g.grid.tickColor;Y.beginPath();var AM,AP=s.xaxis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=s.xaxis.max){continue}Y.moveTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,0);Y.lineTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,t)}AP=s.yaxis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=AP.max){continue}Y.moveTo(0,Math.floor(AP.p2c(AM))+Y.lineWidth/2);Y.lineTo(I,Math.floor(AP.p2c(AM))+Y.lineWidth/2)}AP=s.x2axis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=AP.max){continue}Y.moveTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,-5);Y.lineTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,5)}AP=s.y2axis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=AP.max){continue}Y.moveTo(I-5,Math.floor(AP.p2c(AM))+Y.lineWidth/2);Y.lineTo(I+5,Math.floor(AP.p2c(AM))+Y.lineWidth/2)}Y.stroke();if(g.grid.borderWidth){var AR=g.grid.borderWidth;Y.lineWidth=AR;Y.strokeStyle=g.grid.borderColor;Y.strokeRect(-AR/2,-AR/2,I+AR,t+AR)}Y.restore()}function h(){l.find(".tickLabels").remove();var AK=['<div class="tickLabels" style="font-size:smaller;color:'+g.grid.color+'">'];function AM(AP,AQ){for(var AO=0;AO<AP.ticks.length;++AO){var AN=AP.ticks[AO];if(!AN.label||AN.v<AP.min||AN.v>AP.max){continue}AK.push(AQ(AN,AP))}}var AL=g.grid.labelMargin+g.grid.borderWidth;AM(s.xaxis,function(AN,AO){return'<div style="position:absolute;top:'+(e.top+t+AL)+"px;left:"+Math.round(e.left+AO.p2c(AN.v)-AO.labelWidth/2)+"px;width:"+AO.labelWidth+'px;text-align:center" class="tickLabel">'+AN.label+"</div>"});AM(s.yaxis,function(AN,AO){return'<div style="position:absolute;top:'+Math.round(e.top+AO.p2c(AN.v)-AO.labelHeight/2)+"px;right:"+(e.right+I+AL)+"px;width:"+AO.labelWidth+'px;text-align:right" class="tickLabel">'+AN.label+"</div>"});AM(s.x2axis,function(AN,AO){return'<div style="position:absolute;bottom:'+(e.bottom+t+AL)+"px;left:"+Math.round(e.left+AO.p2c(AN.v)-AO.labelWidth/2)+"px;width:"+AO.labelWidth+'px;text-align:center" class="tickLabel">'+AN.label+"</div>"});AM(s.y2axis,function(AN,AO){return'<div style="position:absolute;top:'+Math.round(e.top+AO.p2c(AN.v)-AO.labelHeight/2)+"px;left:"+(e.left+I+AL)+"px;width:"+AO.labelWidth+'px;text-align:left" class="tickLabel">'+AN.label+"</div>"});AK.push("</div>");l.append(AK.join(""))}function AA(AK){if(AK.lines.show){a(AK)}if(AK.bars.show){n(AK)}if(AK.points.show){o(AK)}}function a(AN){function AM(AY,AZ,AR,Ad,Ac){var Ae=AY.points,AS=AY.pointsize,AW=null,AV=null;Y.beginPath();for(var AX=AS;AX<Ae.length;AX+=AS){var AU=Ae[AX-AS],Ab=Ae[AX-AS+1],AT=Ae[AX],Aa=Ae[AX+1];if(AU==null||AT==null){continue}if(Ab<=Aa&&Ab<Ac.min){if(Aa<Ac.min){continue}AU=(Ac.min-Ab)/(Aa-Ab)*(AT-AU)+AU;Ab=Ac.min}else{if(Aa<=Ab&&Aa<Ac.min){if(Ab<Ac.min){continue}AT=(Ac.min-Ab)/(Aa-Ab)*(AT-AU)+AU;Aa=Ac.min}}if(Ab>=Aa&&Ab>Ac.max){if(Aa>Ac.max){continue}AU=(Ac.max-Ab)/(Aa-Ab)*(AT-AU)+AU;Ab=Ac.max}else{if(Aa>=Ab&&Aa>Ac.max){if(Ab>Ac.max){continue}AT=(Ac.max-Ab)/(Aa-Ab)*(AT-AU)+AU;Aa=Ac.max}}if(AU<=AT&&AU<Ad.min){if(AT<Ad.min){continue}Ab=(Ad.min-AU)/(AT-AU)*(Aa-Ab)+Ab;AU=Ad.min}else{if(AT<=AU&&AT<Ad.min){if(AU<Ad.min){continue}Aa=(Ad.min-AU)/(AT-AU)*(Aa-Ab)+Ab;AT=Ad.min}}if(AU>=AT&&AU>Ad.max){if(AT>Ad.max){continue}Ab=(Ad.max-AU)/(AT-AU)*(Aa-Ab)+Ab;AU=Ad.max}else{if(AT>=AU&&AT>Ad.max){if(AU>Ad.max){continue}Aa=(Ad.max-AU)/(AT-AU)*(Aa-Ab)+Ab;AT=Ad.max}}if(AU!=AW||Ab!=AV){Y.moveTo(Ad.p2c(AU)+AZ,Ac.p2c(Ab)+AR)}AW=AT;AV=Aa;Y.lineTo(Ad.p2c(AT)+AZ,Ac.p2c(Aa)+AR)}Y.stroke()}function AO(AX,Ae,Ac){var Af=AX.points,AR=AX.pointsize,AS=Math.min(Math.max(0,Ac.min),Ac.max),Aa,AV=0,Ad=false;for(var AW=AR;AW<Af.length;AW+=AR){var AU=Af[AW-AR],Ab=Af[AW-AR+1],AT=Af[AW],AZ=Af[AW+1];if(Ad&&AU!=null&&AT==null){Y.lineTo(Ae.p2c(AV),Ac.p2c(AS));Y.fill();Ad=false;continue}if(AU==null||AT==null){continue}if(AU<=AT&&AU<Ae.min){if(AT<Ae.min){continue}Ab=(Ae.min-AU)/(AT-AU)*(AZ-Ab)+Ab;AU=Ae.min}else{if(AT<=AU&&AT<Ae.min){if(AU<Ae.min){continue}AZ=(Ae.min-AU)/(AT-AU)*(AZ-Ab)+Ab;AT=Ae.min}}if(AU>=AT&&AU>Ae.max){if(AT>Ae.max){continue}Ab=(Ae.max-AU)/(AT-AU)*(AZ-Ab)+Ab;AU=Ae.max}else{if(AT>=AU&&AT>Ae.max){if(AU>Ae.max){continue}AZ=(Ae.max-AU)/(AT-AU)*(AZ-Ab)+Ab;AT=Ae.max}}if(!Ad){Y.beginPath();Y.moveTo(Ae.p2c(AU),Ac.p2c(AS));Ad=true}if(Ab>=Ac.max&&AZ>=Ac.max){Y.lineTo(Ae.p2c(AU),Ac.p2c(Ac.max));Y.lineTo(Ae.p2c(AT),Ac.p2c(Ac.max));AV=AT;continue}else{if(Ab<=Ac.min&&AZ<=Ac.min){Y.lineTo(Ae.p2c(AU),Ac.p2c(Ac.min));Y.lineTo(Ae.p2c(AT),Ac.p2c(Ac.min));AV=AT;continue}}var Ag=AU,AY=AT;if(Ab<=AZ&&Ab<Ac.min&&AZ>=Ac.min){AU=(Ac.min-Ab)/(AZ-Ab)*(AT-AU)+AU;Ab=Ac.min}else{if(AZ<=Ab&&AZ<Ac.min&&Ab>=Ac.min){AT=(Ac.min-Ab)/(AZ-Ab)*(AT-AU)+AU;AZ=Ac.min}}if(Ab>=AZ&&Ab>Ac.max&&AZ<=Ac.max){AU=(Ac.max-Ab)/(AZ-Ab)*(AT-AU)+AU;Ab=Ac.max}else{if(AZ>=Ab&&AZ>Ac.max&&Ab<=Ac.max){AT=(Ac.max-Ab)/(AZ-Ab)*(AT-AU)+AU;AZ=Ac.max}}if(AU!=Ag){if(Ab<=Ac.min){Aa=Ac.min}else{Aa=Ac.max}Y.lineTo(Ae.p2c(Ag),Ac.p2c(Aa));Y.lineTo(Ae.p2c(AU),Ac.p2c(Aa))}Y.lineTo(Ae.p2c(AU),Ac.p2c(Ab));Y.lineTo(Ae.p2c(AT),Ac.p2c(AZ));if(AT!=AY){if(AZ<=Ac.min){Aa=Ac.min}else{Aa=Ac.max}Y.lineTo(Ae.p2c(AT),Ac.p2c(Aa));Y.lineTo(Ae.p2c(AY),Ac.p2c(Aa))}AV=Math.max(AT,AY)}if(Ad){Y.lineTo(Ae.p2c(AV),Ac.p2c(AS));Y.fill()}}Y.save();Y.translate(e.left,e.top);Y.lineJoin="round";var AP=AN.lines.lineWidth,AK=AN.shadowSize;if(AP>0&&AK>0){Y.lineWidth=AK;Y.strokeStyle="rgba(0,0,0,0.1)";var AQ=Math.PI/18;AM(AN.datapoints,Math.sin(AQ)*(AP/2+AK/2),Math.cos(AQ)*(AP/2+AK/2),AN.xaxis,AN.yaxis);Y.lineWidth=AK/2;AM(AN.datapoints,Math.sin(AQ)*(AP/2+AK/4),Math.cos(AQ)*(AP/2+AK/4),AN.xaxis,AN.yaxis)}Y.lineWidth=AP;Y.strokeStyle=AN.color;var AL=V(AN.lines,AN.color,0,t);if(AL){Y.fillStyle=AL;AO(AN.datapoints,AN.xaxis,AN.yaxis)}if(AP>0){AM(AN.datapoints,0,0,AN.xaxis,AN.yaxis)}Y.restore()}function o(AN){function AP(AU,AT,Ab,AR,AV,AZ,AY){var Aa=AU.points,AQ=AU.pointsize;for(var AS=0;AS<Aa.length;AS+=AQ){var AX=Aa[AS],AW=Aa[AS+1];if(AX==null||AX<AZ.min||AX>AZ.max||AW<AY.min||AW>AY.max){continue}Y.beginPath();Y.arc(AZ.p2c(AX),AY.p2c(AW)+AR,AT,0,AV,false);if(Ab){Y.fillStyle=Ab;Y.fill()}Y.stroke()}}Y.save();Y.translate(e.left,e.top);var AO=AN.lines.lineWidth,AL=AN.shadowSize,AK=AN.points.radius;if(AO>0&&AL>0){var AM=AL/2;Y.lineWidth=AM;Y.strokeStyle="rgba(0,0,0,0.1)";AP(AN.datapoints,AK,null,AM+AM/2,Math.PI,AN.xaxis,AN.yaxis);Y.strokeStyle="rgba(0,0,0,0.2)";AP(AN.datapoints,AK,null,AM/2,Math.PI,AN.xaxis,AN.yaxis)}Y.lineWidth=AO;Y.strokeStyle=AN.color;AP(AN.datapoints,AK,V(AN.points,AN.color),0,2*Math.PI,AN.xaxis,AN.yaxis);Y.restore()}function AB(AV,AU,Ad,AQ,AY,AN,AL,AT,AS,Ac,AZ){var AM,Ab,AR,AX,AO,AK,AW,AP,Aa;if(AZ){AP=AK=AW=true;AO=false;AM=Ad;Ab=AV;AX=AU+AQ;AR=AU+AY;if(Ab<AM){Aa=Ab;Ab=AM;AM=Aa;AO=true;AK=false}}else{AO=AK=AW=true;AP=false;AM=AV+AQ;Ab=AV+AY;AR=Ad;AX=AU;if(AX<AR){Aa=AX;AX=AR;AR=Aa;AP=true;AW=false}}if(Ab<AT.min||AM>AT.max||AX<AS.min||AR>AS.max){return }if(AM<AT.min){AM=AT.min;AO=false}if(Ab>AT.max){Ab=AT.max;AK=false}if(AR<AS.min){AR=AS.min;AP=false}if(AX>AS.max){AX=AS.max;AW=false}AM=AT.p2c(AM);AR=AS.p2c(AR);Ab=AT.p2c(Ab);AX=AS.p2c(AX);if(AL){Ac.beginPath();Ac.moveTo(AM,AR);Ac.lineTo(AM,AX);Ac.lineTo(Ab,AX);Ac.lineTo(Ab,AR);Ac.fillStyle=AL(AR,AX);Ac.fill()}if(AO||AK||AW||AP){Ac.beginPath();Ac.moveTo(AM,AR+AN);if(AO){Ac.lineTo(AM,AX+AN)}else{Ac.moveTo(AM,AX+AN)}if(AW){Ac.lineTo(Ab,AX+AN)}else{Ac.moveTo(Ab,AX+AN)}if(AK){Ac.lineTo(Ab,AR+AN)}else{Ac.moveTo(Ab,AR+AN)}if(AP){Ac.lineTo(AM,AR+AN)}else{Ac.moveTo(AM,AR+AN)}Ac.stroke()}}function n(AM){function AL(AS,AR,AU,AP,AT,AW,AV){var AX=AS.points,AO=AS.pointsize;for(var AQ=0;AQ<AX.length;AQ+=AO){if(AX[AQ]==null){continue}AB(AX[AQ],AX[AQ+1],AX[AQ+2],AR,AU,AP,AT,AW,AV,Y,AM.bars.horizontal)}}Y.save();Y.translate(e.left,e.top);Y.lineWidth=AM.bars.lineWidth;Y.strokeStyle=AM.color;var AK=AM.bars.align=="left"?0:-AM.bars.barWidth/2;var AN=AM.bars.fill?function(AO,AP){return V(AM.bars,AM.color,AO,AP)}:null;AL(AM.datapoints,AK,AK+AM.bars.barWidth,0,AN,AM.xaxis,AM.yaxis);Y.restore()}function V(AM,AK,AL,AO){var AN=AM.fill;if(!AN){return null}if(AM.fillColor){return R(AM.fillColor,AL,AO,AK)}var AP=C.color.parse(AK);AP.a=typeof AN=="number"?AN:0.4;AP.normalize();return AP.toString()}function AI(){l.find(".legend").remove();if(!g.legend.show){return }var AP=[],AN=false,AV=g.legend.labelFormatter,AU,AR;for(i=0;i<O.length;++i){AU=O[i];AR=AU.label;if(!AR){continue}if(i%g.legend.noColumns==0){if(AN){AP.push("</tr>")}AP.push("<tr>");AN=true}if(AV){AR=AV(AR,AU)}AP.push('<td class="legendColorBox"><div style="border:1px solid '+g.legend.labelBoxBorderColor+';padding:1px"><div style="width:4px;height:0;border:5px solid '+AU.color+';overflow:hidden"></div></div></td><td class="legendLabel">'+AR+"</td>")}if(AN){AP.push("</tr>")}if(AP.length==0){return }var AT='<table style="font-size:smaller;color:'+g.grid.color+'">'+AP.join("")+"</table>";if(g.legend.container!=null){C(g.legend.container).html(AT)}else{var AQ="",AL=g.legend.position,AM=g.legend.margin;if(AM[0]==null){AM=[AM,AM]}if(AL.charAt(0)=="n"){AQ+="top:"+(AM[1]+e.top)+"px;"}else{if(AL.charAt(0)=="s"){AQ+="bottom:"+(AM[1]+e.bottom)+"px;"}}if(AL.charAt(1)=="e"){AQ+="right:"+(AM[0]+e.right)+"px;"}else{if(AL.charAt(1)=="w"){AQ+="left:"+(AM[0]+e.left)+"px;"}}var AS=C('<div class="legend">'+AT.replace('style="','style="position:absolute;'+AQ+";")+"</div>").appendTo(l);if(g.legend.backgroundOpacity!=0){var AO=g.legend.backgroundColor;if(AO==null){AO=g.grid.backgroundColor;if(AO&&typeof AO=="string"){AO=C.color.parse(AO)}else{AO=C.color.extract(AS,"background-color")}AO.a=1;AO=AO.toString()}var AK=AS.children();C('<div style="position:absolute;width:'+AK.width()+"px;height:"+AK.height()+"px;"+AQ+"background-color:"+AO+';"> </div>').prependTo(AS).css("opacity",g.legend.backgroundOpacity)}}}var w=[],J=null;function AF(AR,AP,AM){var AX=g.grid.mouseActiveRadius,Aj=AX*AX+1,Ah=null,Aa=false,Af,Ad;for(Af=0;Af<O.length;++Af){if(!AM(O[Af])){continue}var AY=O[Af],AQ=AY.xaxis,AO=AY.yaxis,Ae=AY.datapoints.points,Ac=AY.datapoints.pointsize,AZ=AQ.c2p(AR),AW=AO.c2p(AP),AL=AX/AQ.scale,AK=AX/AO.scale;if(AY.lines.show||AY.points.show){for(Ad=0;Ad<Ae.length;Ad+=Ac){var AT=Ae[Ad],AS=Ae[Ad+1];if(AT==null){continue}if(AT-AZ>AL||AT-AZ<-AL||AS-AW>AK||AS-AW<-AK){continue}var AV=Math.abs(AQ.p2c(AT)-AR),AU=Math.abs(AO.p2c(AS)-AP),Ab=AV*AV+AU*AU;if(Ab<=Aj){Aj=Ab;Ah=[Af,Ad/Ac]}}}if(AY.bars.show&&!Ah){var AN=AY.bars.align=="left"?0:-AY.bars.barWidth/2,Ag=AN+AY.bars.barWidth;for(Ad=0;Ad<Ae.length;Ad+=Ac){var AT=Ae[Ad],AS=Ae[Ad+1],Ai=Ae[Ad+2];if(AT==null){continue}if(O[Af].bars.horizontal?(AZ<=Math.max(Ai,AT)&&AZ>=Math.min(Ai,AT)&&AW>=AS+AN&&AW<=AS+Ag):(AZ>=AT+AN&&AZ<=AT+Ag&&AW>=Math.min(Ai,AS)&&AW<=Math.max(Ai,AS))){Ah=[Af,Ad/Ac]}}}}if(Ah){Af=Ah[0];Ad=Ah[1];Ac=O[Af].datapoints.pointsize;return{datapoint:O[Af].datapoints.points.slice(Ad*Ac,(Ad+1)*Ac),dataIndex:Ad,series:O[Af],seriesIndex:Af}}return null}function D(AK){if(g.grid.hoverable){H("plothover",AK,function(AL){return AL.hoverable!=false})}}function d(AK){H("plotclick",AK,function(AL){return AL.clickable!=false})}function H(AL,AK,AM){var AN=AD.offset(),AS={pageX:AK.pageX,pageY:AK.pageY},AQ=AK.pageX-AN.left-e.left,AO=AK.pageY-AN.top-e.top;if(s.xaxis.used){AS.x=s.xaxis.c2p(AQ)}if(s.yaxis.used){AS.y=s.yaxis.c2p(AO)}if(s.x2axis.used){AS.x2=s.x2axis.c2p(AQ)}if(s.y2axis.used){AS.y2=s.y2axis.c2p(AO)}var AT=AF(AQ,AO,AM);if(AT){AT.pageX=parseInt(AT.series.xaxis.p2c(AT.datapoint[0])+AN.left+e.left);AT.pageY=parseInt(AT.series.yaxis.p2c(AT.datapoint[1])+AN.top+e.top)}if(g.grid.autoHighlight){for(var AP=0;AP<w.length;++AP){var AR=w[AP];if(AR.auto==AL&&!(AT&&AR.series==AT.series&&AR.point==AT.datapoint)){x(AR.series,AR.point)}}if(AT){AE(AT.series,AT.datapoint,AL)}}l.trigger(AL,[AS,AT])}function q(){if(!J){J=setTimeout(v,30)}}function v(){J=null;AJ.save();AJ.clearRect(0,0,y,Q);AJ.translate(e.left,e.top);var AL,AK;for(AL=0;AL<w.length;++AL){AK=w[AL];if(AK.series.bars.show){z(AK.series,AK.point)}else{u(AK.series,AK.point)}}AJ.restore();Z(L.drawOverlay,[AJ])}function AE(AM,AK,AN){if(typeof AM=="number"){AM=O[AM]}if(typeof AK=="number"){AK=AM.data[AK]}var AL=j(AM,AK);if(AL==-1){w.push({series:AM,point:AK,auto:AN});q()}else{if(!AN){w[AL].auto=false}}}function x(AM,AK){if(AM==null&&AK==null){w=[];q()}if(typeof AM=="number"){AM=O[AM]}if(typeof AK=="number"){AK=AM.data[AK]}var AL=j(AM,AK);if(AL!=-1){w.splice(AL,1);q()}}function j(AM,AN){for(var AK=0;AK<w.length;++AK){var AL=w[AK];if(AL.series==AM&&AL.point[0]==AN[0]&&AL.point[1]==AN[1]){return AK}}return -1}function u(AN,AM){var AL=AM[0],AR=AM[1],AQ=AN.xaxis,AP=AN.yaxis;if(AL<AQ.min||AL>AQ.max||AR<AP.min||AR>AP.max){return }var AO=AN.points.radius+AN.points.lineWidth/2;AJ.lineWidth=AO;AJ.strokeStyle=C.color.parse(AN.color).scale("a",0.5).toString();var AK=1.5*AO;AJ.beginPath();AJ.arc(AQ.p2c(AL),AP.p2c(AR),AK,0,2*Math.PI,false);AJ.stroke()}function z(AN,AK){AJ.lineWidth=AN.bars.lineWidth;AJ.strokeStyle=C.color.parse(AN.color).scale("a",0.5).toString();var AM=C.color.parse(AN.color).scale("a",0.5).toString();var AL=AN.bars.align=="left"?0:-AN.bars.barWidth/2;AB(AK[0],AK[1],AK[2]||0,AL,AL+AN.bars.barWidth,0,function(){return AM},AN.xaxis,AN.yaxis,AJ,AN.bars.horizontal)}function R(AM,AL,AQ,AO){if(typeof AM=="string"){return AM}else{var AP=Y.createLinearGradient(0,AQ,0,AL);for(var AN=0,AK=AM.colors.length;AN<AK;++AN){var AR=AM.colors[AN];if(typeof AR!="string"){AR=C.color.parse(AO).scale("rgb",AR.brightness);AR.a*=AR.opacity;AR=AR.toString()}AP.addColorStop(AN/(AK-1),AR)}return AP}}}C.plot=function(G,E,D){var F=new B(C(G),E,D,C.plot.plugins);return F};C.plot.plugins=[];C.plot.formatDate=function(H,E,G){var L=function(N){N=""+N;return N.length==1?"0"+N:N};var D=[];var M=false;var K=H.getUTCHours();var I=K<12;if(G==null){G=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}if(E.search(/%p|%P/)!=-1){if(K>12){K=K-12}else{if(K==0){K=12}}}for(var F=0;F<E.length;++F){var J=E.charAt(F);if(M){switch(J){case"h":J=""+K;break;case"H":J=L(K);break;case"M":J=L(H.getUTCMinutes());break;case"S":J=L(H.getUTCSeconds());break;case"d":J=""+H.getUTCDate();break;case"m":J=""+(H.getUTCMonth()+1);break;case"y":J=""+H.getUTCFullYear();break;case"b":J=""+G[H.getUTCMonth()];break;case"p":J=(I)?("am"):("pm");break;case"P":J=(I)?("AM"):("PM");break}D.push(J);M=false}else{if(J=="%"){M=true}else{D.push(J)}}}return D.join("")};function A(E,D){return D*Math.floor(E/D)}})(jQuery);
/*
Flot plugin for selecting regions.

The plugin defines the following options:

  selection: {
    mode: null or "x" or "y" or "xy",
    color: color
  }

You enable selection support by setting the mode to one of "x", "y" or
"xy". In "x" mode, the user will only be able to specify the x range,
similarly for "y" mode. For "xy", the selection becomes a rectangle
where both ranges can be specified. "color" is color of the selection.

When selection support is enabled, a "plotselected" event will be emitted
on the DOM element you passed into the plot function. The event
handler gets one extra parameter with the ranges selected on the axes,
like this:

  placeholder.bind("plotselected", function(event, ranges) {
    alert("You selected " + ranges.xaxis.from + " to " + ranges.xaxis.to)
    // similar for yaxis, secondary axes are in x2axis
    // and y2axis if present
  });

The "plotselected" event is only fired when the user has finished
making the selection. A "plotselecting" event is fired during the
process with the same parameters as the "plotselected" event, in case
you want to know what's happening while it's happening,

A "plotunselected" event with no arguments is emitted when the user
clicks the mouse to remove the selection.

The plugin allso adds the following methods to the plot object:

- setSelection(ranges, preventEvent)

  Set the selection rectangle. The passed in ranges is on the same
  form as returned in the "plotselected" event. If the selection
  mode is "x", you should put in either an xaxis (or x2axis) object,
  if the mode is "y" you need to put in an yaxis (or y2axis) object
  and both xaxis/x2axis and yaxis/y2axis if the selection mode is
  "xy", like this:

    setSelection({ xaxis: { from: 0, to: 10 }, yaxis: { from: 40, to: 60 } });

  setSelection will trigger the "plotselected" event when called. If
  you don't want that to happen, e.g. if you're inside a
  "plotselected" handler, pass true as the second parameter.
  
- clearSelection(preventEvent)

  Clear the selection rectangle. Pass in true to avoid getting a
  "plotunselected" event.

- getSelection()

  Returns the current selection in the same format as the
  "plotselected" event. If there's currently no selection, the
  function returns null.

*/

(function ($) {
    function init(plot) {
        var selection = {
                first: { x: -1, y: -1}, second: { x: -1, y: -1},
                show: false,
                active: false
            };

        // FIXME: The drag handling implemented here should be
        // abstracted out, there's some similar code from a library in
        // the navigation plugin, this should be massaged a bit to fit
        // the Flot cases here better and reused. Doing this would
        // make this plugin much slimmer.
        var savedhandlers = {};

        function onMouseMove(e) {
            if (selection.active) {
                plot.getPlaceholder().trigger("plotselecting", [ getSelection() ]);

                updateSelection(e);
            }
        }

        function onMouseDown(e) {
            if (e.which != 1)  // only accept left-click
                return;
            
            // cancel out any text selections
            document.body.focus();

            // prevent text selection and drag in old-school browsers
            if (document.onselectstart !== undefined && savedhandlers.onselectstart == null) {
                savedhandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () { return false; };
            }
            if (document.ondrag !== undefined && savedhandlers.ondrag == null) {
                savedhandlers.ondrag = document.ondrag;
                document.ondrag = function () { return false; };
            }

            setSelectionPos(selection.first, e);

            selection.active = true;
            
            $(document).one("mouseup", onMouseUp);
        }

        function onMouseUp(e) {
            // revert drag stuff for old-school browsers
            if (document.onselectstart !== undefined)
                document.onselectstart = savedhandlers.onselectstart;
            if (document.ondrag !== undefined)
                document.ondrag = savedhandlers.ondrag;

            // no more draggy-dee-drag
            selection.active = false;
            updateSelection(e);

            if (selectionIsSane())
                triggerSelectedEvent();
            else {
                // this counts as a clear
                plot.getPlaceholder().trigger("plotunselected", [ ]);
                plot.getPlaceholder().trigger("plotselecting", [ null ]);
            }

            return false;
        }

        function getSelection() {
            if (!selectionIsSane())
                return null;

            var x1 = Math.min(selection.first.x, selection.second.x),
                x2 = Math.max(selection.first.x, selection.second.x),
                y1 = Math.max(selection.first.y, selection.second.y),
                y2 = Math.min(selection.first.y, selection.second.y);

            var r = {};
            var axes = plot.getAxes();
            if (axes.xaxis.used)
                r.xaxis = { from: axes.xaxis.c2p(x1), to: axes.xaxis.c2p(x2) };
            if (axes.x2axis.used)
                r.x2axis = { from: axes.x2axis.c2p(x1), to: axes.x2axis.c2p(x2) };
            if (axes.yaxis.used)
                r.yaxis = { from: axes.yaxis.c2p(y1), to: axes.yaxis.c2p(y2) };
            if (axes.y2axis.used)
                r.y2axis = { from: axes.y2axis.c2p(y1), to: axes.y2axis.c2p(y2) };
            return r;
        }

        function triggerSelectedEvent() {
            var r = getSelection();

            plot.getPlaceholder().trigger("plotselected", [ r ]);

            // backwards-compat stuff, to be removed in future
            var axes = plot.getAxes();
            if (axes.xaxis.used && axes.yaxis.used)
                plot.getPlaceholder().trigger("selected", [ { x1: r.xaxis.from, y1: r.yaxis.from, x2: r.xaxis.to, y2: r.yaxis.to } ]);
        }

        function clamp(min, value, max) {
            return value < min? min: (value > max? max: value);
        }

        function setSelectionPos(pos, e) {
            var o = plot.getOptions();
            var offset = plot.getPlaceholder().offset();
            var plotOffset = plot.getPlotOffset();
            pos.x = clamp(0, e.pageX - offset.left - plotOffset.left, plot.width());
            pos.y = clamp(0, e.pageY - offset.top - plotOffset.top, plot.height());

            if (o.selection.mode == "y")
                pos.x = pos == selection.first? 0: plot.width();

            if (o.selection.mode == "x")
                pos.y = pos == selection.first? 0: plot.height();
        }

        function updateSelection(pos) {
            if (pos.pageX == null)
                return;

            setSelectionPos(selection.second, pos);
            if (selectionIsSane()) {
                selection.show = true;
                plot.triggerRedrawOverlay();
            }
            else
                clearSelection(true);
        }

        function clearSelection(preventEvent) {
            if (selection.show) {
                selection.show = false;
                plot.triggerRedrawOverlay();
                if (!preventEvent)
                    plot.getPlaceholder().trigger("plotunselected", [ ]);
            }
        }

        function setSelection(ranges, preventEvent) {
            var axis, range, axes = plot.getAxes();
            var o = plot.getOptions();

            if (o.selection.mode == "y") {
                selection.first.x = 0;
                selection.second.x = plot.width();
            }
            else {
                axis = ranges["xaxis"]? axes["xaxis"]: (ranges["x2axis"]? axes["x2axis"]: axes["xaxis"]);
                range = ranges["xaxis"] || ranges["x2axis"] || { from:ranges["x1"], to:ranges["x2"] }
                selection.first.x = axis.p2c(Math.min(range.from, range.to));
                selection.second.x = axis.p2c(Math.max(range.from, range.to));
            }

            if (o.selection.mode == "x") {
                selection.first.y = 0;
                selection.second.y = plot.height();
            }
            else {
                axis = ranges["yaxis"]? axes["yaxis"]: (ranges["y2axis"]? axes["y2axis"]: axes["yaxis"]);
                range = ranges["yaxis"] || ranges["y2axis"] || { from:ranges["y1"], to:ranges["y2"] }
                selection.first.y = axis.p2c(Math.min(range.from, range.to));
                selection.second.y = axis.p2c(Math.max(range.from, range.to));
            }

            selection.show = true;
            plot.triggerRedrawOverlay();
            if (!preventEvent)
                triggerSelectedEvent();
        }

        function selectionIsSane() {
            var minSize = 5;
            return Math.abs(selection.second.x - selection.first.x) >= minSize &&
                Math.abs(selection.second.y - selection.first.y) >= minSize;
        }

        plot.clearSelection = clearSelection;
        plot.setSelection = setSelection;
        plot.getSelection = getSelection;

        plot.hooks.bindEvents.push(function(plot, eventHolder) {
            var o = plot.getOptions();
            if (o.selection.mode != null)
                eventHolder.mousemove(onMouseMove);

            if (o.selection.mode != null)
                eventHolder.mousedown(onMouseDown);
        });


        plot.hooks.drawOverlay.push(function (plot, ctx) {
            // draw selection
            if (selection.show && selectionIsSane()) {
                var plotOffset = plot.getPlotOffset();
                var o = plot.getOptions();

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                var c = $.color.parse(o.selection.color);

                ctx.strokeStyle = c.scale('a', 0.8).toString();
                ctx.lineWidth = 1;
                ctx.lineJoin = "round";
                ctx.fillStyle = c.scale('a', 0.4).toString();

                var x = Math.min(selection.first.x, selection.second.x),
                    y = Math.min(selection.first.y, selection.second.y),
                    w = Math.abs(selection.second.x - selection.first.x),
                    h = Math.abs(selection.second.y - selection.first.y);

                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);

                ctx.restore();
            }
        });
    }

    $.plot.plugins.push({
        init: init,
        options: {
            selection: {
                mode: null, // one of null, "x", "y" or "xy"
                color: "#e8cfac"
            }
        },
        name: 'selection',
        version: '1.0'
    });
})(jQuery);
/******************************************************************************
 *
 * jquery.graphTable-0.2.js
 * by rebecca murphey
 * http://blog.rebeccamurphey.com
 * rmurphey gmail com
 * License: GPL
 * 17 December 2007
 *
 * requires:
 *
 *   - jquery.js (http://jquery.com) -- tested with 1.2.1
 *   - jquery.flot.js (http://code.google.com/p/flot/)
 *
 * usage:
 *
 *   $('#myTable').graphTable(graphTableOptionsObject,flotOptionsObject);
 *
 *   - both arguments are optional; defaults will work in most cases
 *     but you'll need to include {series: 'columns'} if your data is
 *     in columns.
 *   - for details on graphTable options and defaults, see below.
 *   - for details on flot options and defaults, see
 *     http://code.google.com/p/flot/
 *
 * notes:
 *
 *   - this isn't going to work well with tables that use rowspan or colspan
 *   - make sure to use the transform args to transform your cell contents into
 *     something flot can understand -- especially important if your cells
 *     contain currency or dates
 *
 ******************************************************************************/
 
(function($) {
 
	$.fn.graphTable = function(graphArgs_,flotArgs_) {
 
		var args = {
	 
			/*
			* options for reading the table -- defaults will work in most cases except
			* you'll want to override the default args.series if your series are in columns
			*
			* note that anywhere the word "index" is used, the count starts from 0 at
			* the top left of the table
			*
			*/
			graphNum: 0, //The identifier of the graph which should be populated
			// overviewFrom: 0,
			// overviewTo: 0,
			series: 'rows', // are the series in rows or columns?
			labels: 0, // index of the cell in the series row/column that contains the label for the series
			xaxis: 0, // index of the row/column (whatever args.series is) that contains the x values
			firstSeries: 1, // index of the row/column containing the first series
			lastSeries: null, // index of the row/column containing the last series; will use the last cell in the row/col if not set
			dataStart: 0, // index of the first cell in the series containing data
			dataEnd: null, // index of the last cell in the series containing data; will use the last cell in the row/col if not set
			legendLabels: null, //Label for the each series to be used in the legend

			/* graph size and position */
			position: 'after', // before the table, after the table, or replace the table
			width: null, // set to null to use the width of the table
			height: null, // set to null to use the height of the table
			min: 0, // defaults to minimum y value in the table
			max: 0, // defaults to maximum y value in the table

			/* data transformation before plotting */
			dataTransform: null, // function to run on cell contents before passing to flot; string -> string
			labelTransform: null, // function to run on cell contents before passing to flot; string -> string
			xaxisTransform: null // function to run on cell contents before passing to flot; string -> string
	 
		}
		
		
		// override defaults with user args
		$.extend(true,args,graphArgs_);
		
		/* default to last cell in the row/col for
		 * lastSeries and dataEnd if they haven't been set yet */
	 
		// index of the row/column containing the last series
		if (! args.lastSeries) {
			args.lastSeries = (args.series == 'columns') ?
				$('tr',$(this)).eq(args.labels).find('th,td').length - 1 :
				$('tr',$(this)).length - 1;
		}
	 
		// index of the last cell in the series containing data
		if (! args.dataEnd) {
			args.dataEnd = (args.series == 'rows') ?
				$('tr',$(this)).eq(args.firstSeries).find('th,td').length - 1:
				$('tr',$(this)).length - 1;
		}
	 
		return $(this).each(function() {
			// use local min/max for y of each graph, based on initial args
			var $table = $(this);
	 
			// make sure the table is a table!
			if (! $table.is('table')) { return; }
	 
			// if no height and width have been set, then set
			// width and height based on the width and height of the table
			if (! args.width) { args.width = $table.width(); }
			if (! args.height) { args.height = $table.height(); }
	 
			var min = args.min;
			var max = args.max;
			var $rows = $('tr',$table);
			var tableData = new Array();
	 
			switch (args.series) {
			case 'rows':
				 
				var $xaxisRow = $rows.eq(args.xaxis);
 
				// iterate over each of the rows in the series
				for (i=args.firstSeries;i<=args.lastSeries;i++) {
					var rowData = new Array();
	 
					$dataRow = $('tr',$table).eq(i);
	 
					// get the label for the whole row
					var label = graphUnits[args.graphNum - 1];
	 
					if (args.labelTransform) { label = args.labelTransform(label); }
	 
					for (j=args.dataStart;j<=args.dataEnd;j++) {
						var x = $('th,td',$xaxisRow).eq(j).text();
						var y = $('th,td',$dataRow).eq(j).text();
						
						if (!isNaN(y)) {
							if (args.dataTransform) { y = args.dataTransform(y); }
							if (args.xaxisTransform) { x = args.xaxisTransform(x); }
							
							test_x = parseFloat(x);
							test_y = parseFloat(y);

							if (test_y < min) { min = test_y; }
							else if (test_y > max) { max = test_y; }
                        }
						else {
						  x = null;
						  y = null;
						}

						rowData[rowData.length] = [x,y];
					}
		 
					tableData[tableData.length] = { label: label, data: rowData };
				}
				break; 
			case 'columns':
				// iterate over each of the columns in the series					
				for (j=args.firstSeries;j<=args.lastSeries;j++) { // j designates the column
					var colData = new Array();
					
					var label = "";
					
					if(args.legendLabels != null){
						label = args.legendLabels[j-1];
					}
					else{	
						// get the label for the whole row
						label = graphUnits[args.graphNum - 1];
					}

					if (args.labelTransform) { label = args.labelTransform(label); }
 
					for (i=args.dataStart;i<=args.dataEnd;i++) { // i designates the row

						$cell = $rows.eq(i).find('th,td').eq(j);
						var y = $cell.text();
						var x = $rows.eq(i).find('th,td').eq(args.xaxis).text();
						
						if (!isNaN(y)) {
							if (args.dataTransform) { y = args.dataTransform(y); }
							if (args.xaxisTransform) { x = args.xaxisTransform(x); }
							
							test_x = parseFloat(x);
							test_y = parseFloat(y);
	 
							if (test_y < min) { min = test_y - 2; }
							else if (test_y > max) { max = test_y + 2; }
							
							if(i == args.dataStart){
								overviewFrom = test_x;
							}
							else if(i == args.dataEnd){
								overviewTo = test_x;
							}
						}
						else {
						  x = null;
						  y = null;
						}

						colData[colData.length] = [x,y];
					}
					tableData[tableData.length] = { label: label, data: colData };
				}
				break;
			}
			
			var flotArgs = { yaxis: { min: min, max: max }};
			var placeholder = $("#placeHolder" + args.graphNum)
			placeholder.width(args.width).height(args.height);
			$.extend(true,flotArgs,flotArgs_);
			var plot = $.plot(placeholder, tableData, flotArgs);
			
			
			// setup overview
			var overview = $("#overviewGraph" + args.graphNum)
			overview.width(150).height(50);
			
			var overviewPlot = $.plot(overview, tableData, {
				legend: {show: false},
				series: {
					lines: { show: true, lineWidth: 1 },
					shadowSize: 0
				},
				xaxis: { ticks: 0 },
				yaxis: { ticks: 0, min: args.min, max: args.max  },
				grid: { color: "#999", backgroundColor: { colors: ["#DBE9CF", "#fff"]} },
				selection: { mode: "x" }
			});
			/*Zoom into data*/
			placeholder.bind("plotselected", function (event, ranges) {
				// clamp the zooming to prevent eternal zoom
				if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
					ranges.xaxis.to = ranges.xaxis.from + 0.00001;
				if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
					ranges.yaxis.to = ranges.yaxis.from + 0.00001;

				plot = $.plot(placeholder, tableData, $.extend(true, {}, flotArgs, {xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to}, series: {show: true, lineWidth: 1}}));
				
				// don't fire event on the overview to prevent eternal loop
				overviewPlot.setSelection(ranges, true);
			});
			
			overview.bind("plotselected", function (event, ranges) {
				plot.setSelection(ranges);
			});
		});
	};
})(jQuery);mp_formatter={};
mp_formatter.Locale=function(properties){this._className="mp_formatter.Locale";
this._parseList=function(names,expectedItems){var array=[];
if(names===null){throw"Names not defined";
}else{if(typeof names=="object"){array=names;
}else{if(typeof names=="string"){array=names.split(";",expectedItems);
for(var i=0;
i<array.length;
i++){if(array[i][0]=='"'&&array[i][array[i].length-1]=='"'){array[i]=array[i].slice(1,-1);
}else{throw"Missing double quotes";
}}}else{throw"Names must be an array or a string";
}}}if(array.length!=expectedItems){throw"Expected "+expectedItems+" items, got "+array.length;
}return array;
};
this._validateFormatString=function(formatString){if(typeof formatString=="string"&&formatString.length>0){return formatString;
}else{throw"Empty or no string";
}};
if(properties===null||typeof properties!="object"){throw"Error: Invalid/missing locale properties";
}if(typeof properties.decimal_point!="string"){throw"Error: Invalid/missing decimal_point property";
}this.decimal_point=properties.decimal_point;
if(typeof properties.thousands_sep!="string"){throw"Error: Invalid/missing thousands_sep property";
}this.thousands_sep=properties.thousands_sep;
if(typeof properties.grouping!="string"){throw"Error: Invalid/missing grouping property";
}this.grouping=properties.grouping;
if(properties===null||typeof properties!="object"){throw"Error: Invalid/missing time locale properties";
}try{this.time24hr=this._validateFormatString(properties.time24hr);
}catch(error){throw"Error: Invalid time24hr property: "+error;
}try{this.time24hrnosec=this._validateFormatString(properties.time24hrnosec);
}catch(error){throw"Error: Invalid time24hrnosec property: "+error;
}try{this.shortdate2yr=this._validateFormatString(properties.shortdate2yr);
}catch(error){throw"Error: Invalid shortdate2yr property: "+error;
}try{this.fulldate4yr=this._validateFormatString(properties.fulldate4yr);
}catch(error){throw"Error: Invalid fulldate4yr property: "+error;
}try{this.fulldate2yr=this._validateFormatString(properties.fulldate2yr);
}catch(error){throw"Error: Invalid fulldate2yr property: "+error;
}try{this.fullmonth4yrnodate=this._validateFormatString(properties.fullmonth4yrnodate);
}catch(error){throw"Error: Invalid fullmonth4yrnodate property: "+error;
}try{this.full4yr=this._validateFormatString(properties.full4yr);
}catch(error){throw"Error: Invalid full4yr property: "+error;
}try{this.fulldatetime2yr=this._validateFormatString(properties.fulldatetime2yr);
}catch(error){throw"Error: Invalid fulldatetime2yr property: "+error;
}try{this.fulldatetime4yr=this._validateFormatString(properties.fulldatetime4yr);
}catch(error){throw"Error: Invalid fulldatetime4yr property: "+error;
}try{this.fulldatetimenoyr=this._validateFormatString(properties.fulldatetimenoyr);
}catch(error){throw"Error: Invalid fulldatetimenoyr property: "+error;
}};
mp_formatter._getPrecision=function(optionsString){if(typeof optionsString!="string"){return -1;
}var m=optionsString.match(/\.(\d)/);
if(m){return parseInt(m[1],10);
}else{return -1;
}};
mp_formatter._isNumber=function(arg){if(typeof arg=="number"){return true;
}if(typeof arg!="string"){return false;
}var s=arg+"";
return(/^-?(\d+|\d*\.\d+)$/).test(s);
};
mp_formatter._isDate=function(arg){if(arg.getDate){return true;
}return false;
};
mp_formatter._trim=function(str){var whitespace=" \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
for(var i=0;
i<str.length;
i++){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(i);
break;
}}for(i=str.length-1;
i>=0;
i--){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(0,i+1);
break;
}}return whitespace.indexOf(str.charAt(0))===-1?str:"";
};
mp_formatter._splitNumber=function(amount){if(typeof amount=="number"){amount=amount+"";
}var obj={};
if(amount.charAt(0)=="-"){amount=amount.substring(1);
}var amountParts=amount.split(".");
if(!amountParts[1]){amountParts[1]="";
}obj.integer=amountParts[0];
obj.fraction=amountParts[1];
return obj;
};
mp_formatter._formatIntegerPart=function(intPart,grouping,thousandsSep){if(thousandsSep===""||grouping=="-1"){return intPart;
}var groupSizes=grouping.split(";");
var out="";
var pos=intPart.length;
var size;
while(pos>0){if(groupSizes.length>0){size=parseInt(groupSizes.shift(),10);
}if(isNaN(size)){throw"Error: Invalid grouping";
}if(size==-1){out=intPart.substring(0,pos)+out;
break;
}pos-=size;
if(pos<1){out=intPart.substring(0,pos+size)+out;
break;
}out=thousandsSep+intPart.substring(pos,pos+size)+out;
}return out;
};
mp_formatter._formatFractionPart=function(fracPart,precision){for(var i=0;
fracPart.length<precision;
i++){fracPart=fracPart+"0";
}return fracPart;
};
mp_formatter._hasOption=function(option,optionsString){if(typeof option!="string"||typeof optionsString!="string"){return false;
}if(optionsString.indexOf(option)!=-1){return true;
}else{return false;
}};
mp_formatter._validateFormatString=function(formatString){if(typeof formatString=="string"&&formatString.length>0){return true;
}else{return false;
}};
mp_formatter.NumericFormatter=function(locale){if(typeof locale!="object"||locale._className!="mp_formatter.Locale"){throw"Constructor error: You must provide a valid mp_formatter.Locale instance";
}this.lc=locale;
this.format=function(number,options){if(typeof number=="string"){number=mp_formatter._trim(number);
}if(!mp_formatter._isNumber(number)){throw"Error: The input is not a number";
}var floatAmount=parseFloat(number,10);
var reqPrecision=mp_formatter._getPrecision(options);
if(reqPrecision!=-1){floatAmount=Math.round(floatAmount*Math.pow(10,reqPrecision))/Math.pow(10,reqPrecision);
}var parsedAmount=mp_formatter._splitNumber(String(floatAmount));
var formattedIntegerPart;
if(floatAmount===0){formattedIntegerPart="0";
}else{formattedIntegerPart=mp_formatter._hasOption("^",options)?parsedAmount.integer:mp_formatter._formatIntegerPart(parsedAmount.integer,this.lc.grouping,this.lc.thousands_sep);
}var formattedFractionPart=reqPrecision!=-1?mp_formatter._formatFractionPart(parsedAmount.fraction,reqPrecision):parsedAmount.fraction;
var formattedAmount=formattedFractionPart.length?formattedIntegerPart+this.lc.decimal_point+formattedFractionPart:formattedIntegerPart;
if(mp_formatter._hasOption("~",options)||floatAmount===0){return formattedAmount;
}else{if(mp_formatter._hasOption("+",options)||floatAmount<0){if(floatAmount>0){return"+"+formattedAmount;
}else{if(floatAmount<0){return"-"+formattedAmount;
}else{return formattedAmount;
}}}else{return formattedAmount;
}}};
};
mp_formatter.DateTimeFormatter=function(locale){if(typeof locale!="object"||locale._className!="mp_formatter.Locale"){throw"Constructor error: You must provide a valid mp_formatter.Locale instance";
}this.lc=locale;
this.formatISO8601=function(dateStr,option){if(!mp_formatter._validateFormatString(dateStr)){throw"Error: The input is either empty or no string";
}var date=new Date();
date.setISO8601(dateStr);
return this.format(date,option);
};
this.format=function(dateTime,option){if(!mp_formatter._isDate(dateTime)){throw"Error: The input is not a date object";
}switch(option){case mp_formatter.DateTimeFormatter.TIME_24HOUR:return dateTime.format(this.lc.time24hr);
case mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS:return dateTime.format(this.lc.time24hrnosec);
case mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR:return dateTime.format(this.lc.shortdate2yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR:return dateTime.format(this.lc.fulldate4yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR:return dateTime.format(this.lc.fulldate2yr);
case mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE:return dateTime.format(this.lc.fullmonth4yrnodate);
case mp_formatter.DateTimeFormatter.FULL_4YEAR:return dateTime.format(this.lc.full4yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR:return dateTime.format(this.lc.fulldatetime2yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR:return dateTime.format(this.lc.fulldatetime4yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR:return dateTime.format(this.lc.fulldatetimenoyr);
default:alert("Unhandled date time formatting option");
}};
};
mp_formatter.DateTimeFormatter.TIME_24HOUR=1;
mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS=2;
mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR=3;
mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR=4;
mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR=5;
mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE=6;
mp_formatter.DateTimeFormatter.FULL_4YEAR=7;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR=8;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR=9;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR=10;
function internationalizelabels(){
 var graphi18n = i18n.discernabu.graph;
 $('#noResHdr').text(graphi18n.GRAPH_NO_RESULTS); 
 $('#graphDtHdr').text(graphi18n.DATE); 
 $('#sysHdr').text(graphi18n.SYS);
 $('#diaHdr').text(graphi18n.DIA);
 $('#noStaticContent').text(graphi18n.MISSING_STATIC_CONTENT_LOC);
 $('#noUnitsFound').text(graphi18n.NO_UNITS_FOUND);
 $('#unGraphableWarning').text(graphi18n.UNGRAPHABLE_WARNING);
 $('#printGraph').text(graphi18n.PRINTGRAPH);
 
 $('.dtTmHdr').each(function(){
   $(this).text(graphi18n.DATE_TIME);
 });
 $('.resHdr').each(function(){
   $(this).text(graphi18n.RESULT);
 });
}

$(function(){
	var graphi18n = i18n.discernabu.graph;
	internationalizelabels();
    $('.innerTable').each(function(){
        var numRows = $(this).find('tr').length;
        if (numRows >= 12) {
            $(this).parent().css('height', '16em');
        }
        else {
            $(this).parent().css('height', 'auto');
        }
    });
    var MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC[m_localeObjectName]);
    var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
    var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    
    for (var i = 1; i <= graphCount; i++) {
    
        $('#flotTable' + i + ' .dateHead').each(function(){
            var valDate = $(this).text();
            var tempDate = new Date();
            tempDate.setISO8601(valDate);
            $(this).text(tempDate.getTime());
        });
		
			
		var calculatePrecision = function  (valRes){	
		 valRes =  valRes +"";	
		 var precision = 0;	
		 var decLoc = valRes.search(/\.(\d)/);  						//locate the decimal point
		 if (decLoc !== -1){
			var strSize = valRes.length;
			precision = strSize - decLoc - 1;
		 }	
		 return precision;
		};
        
     
        
        $('#flotTable' + i).each(function(){
        
            var tableMin = parseFloat($(this).find('td:first').text());
            var tableMax = 0;
            
            $(this).find('td').each(function(){
                var tempFloat = parseFloat($(this).text());
                
                if (isNaN(tableMin)) {
                    tableMin = tempFloat;
                }
                if (tempFloat < tableMin && !isNaN(tempFloat)) {
                    tableMin = tempFloat;
                }
                
                if (tempFloat > tableMax && !isNaN(tempFloat)) {
                    tableMax = tempFloat;
                }
            });
            //need to get range in relevance for determining padding on the upper and lower bounds of the table
            var tableRange = (tableMax - tableMin) ? tableMax - tableMin : tableMax;
            if ($(this).hasClass('bpTable')) {
                tableMin -= (tableRange * 0.1);
                tableMax += (tableRange * 0.3);
                $(this).graphTable({
                    graphNum: i,
                    series: 'columns',
                    width: '50em',
                    height: '200px',
                    min: tableMin,
                    max: tableMax,
                    legendLabels: [graphi18n.SYS, graphi18n.DIA]
                }, {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        backgroundColor: {
                            colors: ["#DBE9CF", "#fff"]
                        }
                    },
                    xaxis: {
                        mode: "time",
                        tickFormatter: function(val, axis){
                            var d = new Date();
                            d.setTime(val);
                            
                            switch (axis.tickSize[1]) {
                                case "second":
                                case "minute":
                                    return d.format("isoTime");
                                case "hour":
                                    return d.format("longDateTime2");
                                case "day":
                                case "month":
                                case "year":
                                    return d.format("shortDate3");
                                default:
                                    return d.format("shortDate3");
                            }
                        }
                    },
                    legend: {
                        show: true,
                        noColumns: 2
                    },
                    selection: {
                        mode: "x"
                    }
                });
            }
			
		    else if ($(this).hasClass('evtTable')) {
                var mappedData = mappedResults.MAPPED_DATA;
                var evt1GraphLabel = mappedData.EVT1_GRAPH_LABEL;
                var evt2GraphLabel = mappedData.EVT2_GRAPH_LABEL;
                tableMin -= (tableRange * 0.1);
                tableMax += (tableRange * 0.3);
                $(this).graphTable({
                    graphNum: i,
                    series: 'columns',
                    width: '50em',
                    height: '200px',
                    min: tableMin,
                    max: tableMax,
                    legendLabels: [evt1GraphLabel, evt2GraphLabel]
                }, {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        backgroundColor: {
                            colors: ["#DBE9CF", "#fff"]
                        }
                    },
                    xaxis: {
                        mode: "time",
                        tickFormatter: function(val, axis){
                            var d = new Date();
                            d.setTime(val);
                            
                            switch (axis.tickSize[1]) {
                                case "second":
                                case "minute":
                                    return d.format("isoTime");
                                case "hour":
                                    return d.format("longDateTime2");
                                case "day":
                                case "month":
                                case "year":
                                    return d.format("shortDate3");
                                default:
                                    return d.format("shortDate3");
                            }
                        }
                    },
                    legend: {
                        show: true,
                        noColumns: 2
                    },
                    selection: {
                        mode: "x"
                    }
                });
            }
			
            else {
                tableMin -= (tableRange * 0.1);
                tableMax += (tableRange * 0.1);
                $(this).graphTable({
                    graphNum: i,
                    series: 'columns',
                    width: '50em',
                    height: '200px',
                    min: tableMin,
                    max: tableMax
                }, {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        backgroundColor: {
                            colors: ["#DBE9CF", "#fff"]
                        }
                    },
                    xaxis: {
                        mode: "time",
                        tickFormatter: function(val, axis){
                            var d = new Date();
                            d.setTime(val);
                            
                            switch (axis.tickSize[1]) {
                                case "second":
                                case "minute":
                                    return d.format("isoTime");
                                case "hour":
                                    return d.format("longDateTime2");
                                case "day":
                                case "month":
                                case "year":
                                    return d.format("shortDate3");
                                default:
                                    return d.format("shortDate3");
                            }
                        }
                    },
					 yaxis: {
                        tickFormatter: function(val, axis){
						var tickVal = val+'';
						var prec = calculatePrecision(tickVal);
						if (!isNaN(tickVal)) {
								return(nf.format(tickVal,"^"+prec));
							} 
							else { 
								return tickVal;
							}
						}
                    },
                    legend: {
                        show: false
                    },
                    selection: {
                        mode: "x"
                    }
                });
            }
            
        });
		
         var getHeadsUpDateDisplay = function (flotDate){
          var tempDate = new Date();
          tempDate.setTime(flotDate);
		  return df.format(tempDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
        };
		
        $('#flotTable' + i + ' th.dateHead').each(function(){
            var valDate = getHeadsUpDateDisplay(parseFloat($(this).text()));
            $(this).text(valDate);
        });
        
        $('#flotTable' + i + ' .unitOther').each(function(){
            var valRes = $(this).text();
			var formatVal;
			var precision = 0;
			
			if(!isNaN(valRes)) {
				precision = calculatePrecision(valRes);	
				formatVal= nf.format(valRes, "^"+precision);
			}
			else {
				formatVal = valRes;
			}				
            $(this).text(formatVal);
        });
        
        
       var showTooltip  = function  (x, y, contents){
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 10,
                left: x + 10,
                border: '1px solid #000',
                padding: '2px',
                'background-color': '#FFF',
                opacity: 100,
                textAlign: 'left'
            }).appendTo("body").fadeIn(200);
        };
        
       var calculateNormalcy = function (normalcyMeaning){
            var normalcy = "res-normal";
            
            if (normalcyMeaning) {
                if (normalcyMeaning === "LOW") {
                    normalcy = "res-low";
                }
                else if (normalcyMeaning === "HIGH") {
                    normalcy = "res-high";
                }
                else if (normalcyMeaning === "CRITICAL" || normalcyMeaning === "EXTREMEHIGH" || normalcyMeaning === "PANICHIGH" || normalcyMeaning === "EXTREMELOW" || normalcyMeaning === "PANICLOW" || normalcyMeaning === "VABNORMAL") {
                    normalcy = "res-severe";
                }
                else if (normalcyMeaning === "ABNORMAL" || normalcyMeaning === "POSITIVE") {
                    normalcy = "res-abnormal";
                }
            }
            return normalcy;
        };
        
       
        
        var getHoverDateDisplay =function (flotDate){
          var tempDate = new Date();
          tempDate.setTime(flotDate);
		  return df.format(tempDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
        };
	
        
        var previousPoint = null;
        $(".flot-graph").bind("plothover", function(event, pos, item){
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
            
            if (item) {
                if (previousPoint != item.datapoint) {
                    var graphDetails = null;
					var isCE = false;
                    var isBP = false;
					var isEVT = false; //graph for two events.					
                    var mappedData = mappedResults.MAPPED_DATA;
                    //locate the corresponding datapoint in the json record for displaying the details
                    for (var zl = mappedData.QUAL.length; zl--;) {
                        var graphResults = mappedData.QUAL[zl];
                        if (graphResults.ID == event.currentTarget.id) {
                            if (graphResults.CE.length) {
								isCE = true;
                                graphDetails = graphResults.CE[item.dataIndex];
                            }
                            else if (graphResults.BP.length) {
                                graphDetails = graphResults.BP[item.dataIndex];
                                isBP = true;
                            }
							else if (graphResults.EVT.length){
								graphDetails = graphResults.EVT[item.dataIndex];
                                isEVT = true;
                            }
                        }
                    }
                    previousPoint = item.datapoint;
                    
                    $("#tooltip").remove();
                    var x = item.datapoint[0], y = item.datapoint[1];
                    
                    var dateTime = getHoverDateDisplay(x);
                    var refRange = "";
                    var maxTemp = "";
                    var minTemp = "";
                    var ar = [];
                    var arRefRange = [];
                    var arMaxTemp = [];
                    var displayEvent = "";
					
					var normHighPrec = 0;
					var normLowPrec = 0;
					var critHighPrec = 0;
					var critLowPrec = 0;
				
                    var nfNormHigh = "";
					var nfNormLow = "";
					var nfCritHigh= "";
					var nfCritLow= "";
					var normalcy = "";
					var arMinTemp =[];
					
					if (isCE) {
                         normalcy = calculateNormalcy(graphDetails.NORMALCY);
                        
                        displayEvent = graphDetails.EVENT;
						
						if (graphDetails.NORM_HIGH != "&nbsp"){
							normHighPrec = calculatePrecision(graphDetails.NORM_HIGH);
							nfNormHigh = nf.format(graphDetails.NORM_HIGH, "."+normHighPrec);
						}
						else {
							nfNormHigh = graphDetails.NORM_HIGH;
							
						}
						
						if (graphDetails.NORM_LOW != "&nbsp"){
							normLowPrec = calculatePrecision(graphDetails.NORM_LOW);
							nfNormLow = nf.format(graphDetails.NORM_LOW, "."+normLowPrec);
						}
						else {
							nfNormLow = graphDetails.NORM_LOW;					
						}
						
						if(graphDetails.CRIT_HIGH != "&nbsp" ){
							critHighPrec = calculatePrecision(graphDetails.CRIT_HIGH);
							nfCritHigh = nf.format(graphDetails.CRIT_HIGH, "."+critHighPrec);
						}
						else {
							nfCritHigh = graphDetails.CRIT_HIGH;
							
						}
						
						if (graphDetails.CRIT_LOW != "&nbsp"){
							critLowPrec = calculatePrecision(graphDetails.CRIT_LOW);
							nfCritLow = nf.format(graphDetails.CRIT_LOW, "."+critLowPrec);
						}
						else {
							nfCritLow = graphDetails.CRIT_LOW;
						}
                        
                       if (graphDetails.NORM_LOW != "&nbsp" || graphDetails.NORM_HIGH != "&nbsp" || graphDetails.CRIT_LOW != "&nbsp" || graphDetails.CRIT_HIGH != "&nbsp") {

						
						arRefRange.push("<dt><span>",graphi18n.NORMAL_LOW,":</span></dt><dd><span>", nfNormLow, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.NORMAL_HIGH,":</span></dt><dd><span>", nfNormHigh, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.CRITICAL_LOW ,":</span></dt><dd><span>", nfCritLow, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.CRITICAL_HIGH ,":</span></dt><dd><span>", nfCritHigh, "</span></dd>");	
			        }
                        
                        if (mappedData.MAX48HTEMP) {
                            var max48HNormalcy = calculateNormalcy(mappedData.MAX48HNORMALCY);
                            valDate = mappedData.MAX48HTEMPDT;
                            var tempDateMax = new Date();
                            tempDateMax.setISO8601(valDate);
                            arMaxTemp.push("<dt><span>",graphi18n.TWO_DAY_MAX,":</span></dt><dd><span class='", max48HNormalcy, "'>", mappedData.MAX48HTEMP, "</span><span>&nbsp" ,df.format(tempDateMax,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) ,"</span></dd>");
                            maxTemp = arMaxTemp.join("");
                        }
                        
                        if (mappedData.MIN48HTEMP) {
                            var min48HNormalcy = calculateNormalcy(mappedData.MIN48HNORMALCY);
                            valDate = mappedData.MIN48HTEMPDT;
                            var tempDate = new Date();
                            tempDate.setISO8601(valDate);
                            arMinTemp.push("<dt><span>",graphi18n.TWO_DAY_MIN,":</span></dt><dd><span class='", min48HNormalcy, "'>", mappedData.MIN48HTEMP, "</span><span>&nbsp" ,df.format(tempDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) ,"</span></dd>");
                            minTemp = arMinTemp.join("");
                        }
                        
                    }
                    else if (isBP) { //BP
                        if (item.seriesIndex === 0) {//Systolic
                            displayEvent = graphDetails.SYS_BP_LABEL;
                             normalcy = calculateNormalcy(graphDetails.SYS_NORMALCY);
                          
						    norm_low = "";
                            norm_high = "" ;
                            crit_low = "" ;
                            crit_high ="";
                        	
							if (graphDetails.SYS_NORM_HIGH != "&nbsp"){
								normHighPrec  = calculatePrecision(graphDetails.SYS_NORM_HIGH);
								norm_high = nf.format(graphDetails.SYS_NORM_HIGH, "."+normHighPrec);
							}
							else {
								  norm_high = graphDetails.SYS_NORM_HIGH;
							}
							
							
							if (graphDetails.SYS_NORM_LOW != "&nbsp"){
								normLowPrec  = calculatePrecision(graphDetails.SYS_NORM_LOW);
								norm_low = nf.format(graphDetails.SYS_NORM_LOW, "."+normLowPrec);
							}
							else {
								  norm_low = graphDetails.SYS_NORM_LOW;
							}
							
							if (graphDetails.SYS_CRIT_LOW != "&nbsp"){
								critLowPrec  = calculatePrecision(graphDetails.SYS_CRIT_LOW);
								crit_low = nf.format(graphDetails.SYS_CRIT_LOW, "."+critLowPrec);
							}
							else {
								  crit_low = graphDetails.SYS_CRIT_LOW;
							}
							
							if (graphDetails.SYS_CRIT_HIGH != "&nbsp"){
								critHighPrec  = calculatePrecision(graphDetails.SYS_CRIT_HIGH);
								crit_high = nf.format(graphDetails.SYS_CRIT_HIGH, "."+critHighPrec);
							}
							else {
								  crit_high = graphDetails.SYS_CRIT_HIGH;
							}							
							
						}
                        else {
                            displayEvent = graphDetails.DIA_BP_LABEL;
                             normalcy = calculateNormalcy(graphDetails.DIA_NORMALCY);
                          	norm_low = "";
                            norm_high = "" ;
                            crit_low = "" ;
                            crit_high ="";

							if (graphDetails.DIA_NORM_HIGH != "&nbsp"){
								normHighPrec  = calculatePrecision(graphDetails.DIA_NORM_HIGH);
								norm_high = nf.format(graphDetails.DIA_NORM_HIGH, "."+normHighPrec);
							}
							else {
								  norm_high = graphDetails.DIA_NORM_HIGH;
							}
							
							
							if (graphDetails.DIA_NORM_LOW!= "&nbsp"){
								normLowPrec  = calculatePrecision(graphDetails.DIA_NORM_LOW);
								norm_low = nf.format(graphDetails.DIA_NORM_LOW, "."+normLowPrec);
							}
							else {
								  norm_low = graphDetails.DIA_NORM_LOW;
							}
							
							if (graphDetails.DIA_CRIT_LOW != "&nbsp"){
								critLowPrec  = calculatePrecision(graphDetails.DIA_CRIT_LOW);
								crit_low = nf.format(graphDetails.DIA_CRIT_LOW, "."+critLowPrec);
							}
							else {
								  crit_low = graphDetails.DIA_CRIT_LOW;
							}
							
							if (graphDetails.DIA_CRIT_HIGH != "&nbsp"){
								critHighPrec  = calculatePrecision(graphDetails.DIA_CRIT_HIGH);
								crit_high = nf.format(graphDetails.DIA_CRIT_HIGH, "."+critHighPrec);
							}
							else {
								  crit_high = graphDetails.DIA_CRIT_HIGH;
							}								

						}

						arRefRange.push("<dt><span>",graphi18n.NORMAL_LOW,":</span></dt><dd><span>", norm_low, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.NORMAL_HIGH,":</span></dt><dd><span>", norm_high, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.CRITICAL_LOW ,":</span></dt><dd><span>", crit_low, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.CRITICAL_HIGH ,":</span></dt><dd><span>", crit_high, "</span></dd>");
                    }
                    else if (isEVT){
                        if (item.seriesIndex === 0) {//evt1 label
                            displayEvent = graphDetails.EVT1_LABEL;
                            normalcy = calculateNormalcy(graphDetails.EVT1_NORMALCY);
                          
                            norm_low = "";
                            norm_high = "" ;
                            crit_low = "" ;
                            crit_high ="";
                            
                            if (graphDetails.EVT1_NORM_HIGH != "&nbsp"){
                                normHighPrec  = calculatePrecision(graphDetails.EVT1_NORM_HIGH);
                                norm_high = nf.format(graphDetails.EVT1_NORM_HIGH, "."+normHighPrec);
                            }                            
                            
                            if (graphDetails.EVT1_NORM_LOW != "&nbsp"){
                                normLowPrec  = calculatePrecision(graphDetails.EVT1_NORM_LOW);
                                norm_low = nf.format(graphDetails.EVT1_NORM_LOW, "."+normLowPrec);
                            }                            
                            
                            if (graphDetails.EVT1_CRIT_LOW != "&nbsp"){
                                critLowPrec  = calculatePrecision(graphDetails.EVT1_CRIT_LOW);
                                crit_low = nf.format(graphDetails.EVT1_CRIT_LOW, "."+critLowPrec);
                            }
                            
                            if (graphDetails.EVT1_CRIT_HIGH != "&nbsp"){
                                critHighPrec  = calculatePrecision(graphDetails.EVT1_CRIT_HIGH);
                                crit_high = nf.format(graphDetails.EVT1_CRIT_HIGH, "."+critHighPrec);
                            }                        
                            
                        }
                        else {
                            displayEvent = graphDetails.EVT2_LABEL;
                            var normalcy = calculateNormalcy(graphDetails.EVT2_NORMALCY);
                            norm_low = "";
                            norm_high = "" ;
                            crit_low = "" ;
                            crit_high ="";

                            if (graphDetails.EVT2_NORM_HIGH != "&nbsp"){
                                normHighPrec  = calculatePrecision(graphDetails.EVT2_NORM_HIGH);
                                norm_high = nf.format(graphDetails.EVT2_NORM_HIGH, "."+normHighPrec);
                            }
                            else {
                                  norm_high = graphDetails.EVT2_NORM_HIGH;
                            }
                            
                            
                            if (graphDetails.EVT2_NORM_LOW!= "&nbsp"){
                                normLowPrec  = calculatePrecision(graphDetails.EVT2_NORM_LOW);
                                norm_low = nf.format(graphDetails.EVT2_NORM_LOW, "."+normLowPrec);
                            }
                            else {
                                  norm_low = graphDetails.EVT2_NORM_LOW;
                            }
                            
                            if (graphDetails.EVT2_CRIT_LOW != "&nbsp"){
                                critLowPrec  = calculatePrecision(graphDetails.EVT2_CRIT_LOW);
                                crit_low = nf.format(graphDetails.EVT2_CRIT_LOW, "."+critLowPrec);
                            }
                            else {
                                  crit_low = graphDetails.EVT2_CRIT_LOW;
                            }
                            
                            if (graphDetails.EVT2_CRIT_HIGH != "&nbsp"){
                                critHighPrec  = calculatePrecision(graphDetails.EVT2_CRIT_HIGH);
                                crit_high = nf.format(graphDetails.EVT2_CRIT_HIGH, "."+critHighPrec);
                            }
                            else {
                                  crit_high = graphDetails.EVT2_CRIT_HIGH;
                            }                               

                        }

                        arRefRange.push("<dt><span>",graphi18n.NORMAL_LOW,":</span></dt><dd><span>", norm_low, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.NORMAL_HIGH,":</span></dt><dd><span>", norm_high, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.CRITICAL_LOW ,":</span></dt><dd><span>", crit_low, "</span></dd>");
                        arRefRange.push("<dt><span>",graphi18n.CRITICAL_HIGH ,":</span></dt><dd><span>", crit_high, "</span></dd>");
                    }
                    var yPrec  = calculatePrecision(y);
                    ar.push("<div class='hvr'><dl><dt><span>", displayEvent, ":</span></dt><dd><span class='", normalcy, "'>", nf.format(y, "^"+yPrec), " " + graphDetails.UNITS, "</span></dd><br/><dt><span>",graphi18n.DATE_TIME ,":</span></dt><dd><span>", dateTime, "</span></dd><br/><dt><span>",graphi18n.STATUS , ":</span></dt><dd><span>", graphDetails.STATUS, "</span></dd>");
                    var hoverContent = ar.join("") + arRefRange.join("") + arMinTemp.join("") + arMaxTemp.join("") + "</dl></div>";
                    showTooltip(item.pageX, item.pageY, hoverContent);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }
 
    //add print button
	    $('h1:first').append('<a href="#" id="printGraph">'+graphi18n.PRINTGRAPH+'</a>');
	    $('#printGraph').click(function() {
	      window.print();
	    });
	  //end print button
    var tWdth = window.innerWidth || document.documentElement.clientWidth;
    $('body, hr').width(tWdth);
});