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
/*!
 * jQuery UI 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.7",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(c){c.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(b){return a._mouseDown(b)}).bind("click."+this.widgetName,function(b){if(true===c.data(b.target,a.widgetName+".preventClickEvent")){c.removeData(b.target,a.widgetName+".preventClickEvent");b.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(a){a.originalEvent=
a.originalEvent||{};if(!a.originalEvent.mouseHandled){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var b=this,e=a.which==1,f=typeof this.options.cancel=="string"?c(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!e||f||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){b.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}this._mouseMoveDelegate=function(d){return b._mouseMove(d)};this._mouseUpDelegate=function(d){return b._mouseUp(d)};c(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return a.originalEvent.mouseHandled=true}},_mouseMove:function(a){if(c.browser.msie&&!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);
return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){c(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;a.target==this._mouseDownEvent.target&&c.data(a.target,this.widgetName+".preventClickEvent",
true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;/*
 * jQuery UI Draggable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(a){var b=
this.options;if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(a);if(!this.handle)return false;return true},_mouseStart:function(a){var b=this.options;this.helper=this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-
this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);b.containment&&this._setContainment();if(this._trigger("start",a)===false){this._clear();return false}this._cacheHelperProportions();
d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,true);return true},_mouseDrag:function(a,b){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!b){b=this._uiHash();if(this._trigger("drag",a,b)===false){this._mouseUp({});return false}this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||
this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return false},_mouseStop:function(a){var b=false;if(d.ui.ddmanager&&!this.options.dropBehaviour)b=d.ui.ddmanager.drop(this,a);if(this.dropped){b=this.dropped;this.dropped=false}if(!this.element[0]||!this.element[0].parentNode)return false;if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,
b)){var c=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){c._trigger("stop",a)!==false&&c._clear()})}else this._trigger("stop",a)!==false&&this._clear();return false},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var b=!this.options.handle||!d(this.options.handle,this.element).length?true:false;d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==
a.target)b=true});return b},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone():this.element;a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||
0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-
(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment==
"parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[(a.containment=="document"?0:d(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(a.containment=="document"?0:d(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?
0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){var b=d(a.containment)[0];if(b){a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),
10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}}else if(a.containment.constructor==
Array)this.containment=a.containment},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():
f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,g=a.pageY;
if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])e=this.containment[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])e=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/
b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;e=this.originalPageX+Math.round((e-this.originalPageX)/b.grid[0])*b.grid[0];e=this.containment?!(e-this.offset.click.left<this.containment[0]||e-this.offset.click.left>this.containment[2])?e:!(e-this.offset.click.left<this.containment[0])?e-b.grid[0]:e+b.grid[0]:e}}return{top:g-this.offset.click.top-
this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=
this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(a,b,c){c=c||this._uiHash();d.ui.plugin.call(this,a,[b,c]);if(a=="drag")this.positionAbs=this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,b,c)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"1.8.7"});
d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});c.sortables=[];d(f.connectToSortable).each(function(){var g=d.data(this,"sortable");if(g&&!g.options.disabled){c.sortables.push({instance:g,shouldRevert:g.options.revert});g._refreshItems();g._trigger("activate",a,e)}})},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=
0;c.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",a,f)}})},drag:function(a,b){var c=d(this).data("draggable"),f=this;d.each(c.sortables,function(){this.instance.positionAbs=
c.positionAbs;this.instance.helperProportions=c.helperProportions;this.instance.offset.click=c.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=d(f).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return b.helper[0]};a.target=this.instance.currentItem[0];this.instance._mouseCapture(a,
true);this.instance._mouseStart(a,true,true);this.instance.offset.click.top=c.offset.click.top;this.instance.offset.click.left=c.offset.click.left;this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;c._trigger("toSortable",a);c.dropped=this.instance.element;c.currentItem=c.element;this.instance.fromOutside=c}this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver){this.instance.isOver=
0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",a,this.instance._uiHash(this.instance));this.instance._mouseStop(a,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();c._trigger("fromSortable",a);c.dropped=false}})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;if(a.css("cursor"))b._cursor=
a.css("cursor");a.css("cursor",b.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","iframeFix",{start:function(){var a=d(this).data("draggable").options;d(a.iframeFix===true?"iframe":a.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")})},
stop:function(){d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}});d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("opacity"))b._opacity=a.css("opacity");a.css("opacity",b.opacity)},stop:function(a,b){a=d(this).data("draggable").options;a._opacity&&d(b.helper).css("opacity",a._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");if(a.scrollParent[0]!=
document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){if(!c.axis||c.axis!="x")if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;else if(a.pageY-b.overflowOffset.top<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop-
c.scrollSpeed;if(!c.axis||c.axis!="y")if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;else if(a.pageX-b.overflowOffset.left<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed}else{if(!c.axis||c.axis!="x")if(a.pageY-d(document).scrollTop()<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);else if(d(window).height()-
(a.pageY-d(document).scrollTop())<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);if(!c.axis||c.axis!="y")if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()-c.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed)}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,a)}});d.ui.plugin.add("draggable",
"snap",{start:function(){var a=d(this).data("draggable"),b=a.options;a.snapElements=[];d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();this!=a.element[0]&&a.snapElements.push({item:this,width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left})})},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,g=b.offset.left,n=g+c.helperProportions.width,m=b.offset.top,o=m+c.helperProportions.height,h=
c.snapElements.length-1;h>=0;h--){var i=c.snapElements[h].left,k=i+c.snapElements[h].width,j=c.snapElements[h].top,l=j+c.snapElements[h].height;if(i-e<g&&g<k+e&&j-e<m&&m<l+e||i-e<g&&g<k+e&&j-e<o&&o<l+e||i-e<n&&n<k+e&&j-e<m&&m<l+e||i-e<n&&n<k+e&&j-e<o&&o<l+e){if(f.snapMode!="inner"){var p=Math.abs(j-o)<=e,q=Math.abs(l-m)<=e,r=Math.abs(i-n)<=e,s=Math.abs(k-g)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j-c.helperProportions.height,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",
{top:l,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i-c.helperProportions.width}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k}).left-c.margins.left}var t=p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(j-m)<=e;q=Math.abs(l-o)<=e;r=Math.abs(i-g)<=e;s=Math.abs(k-n)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:l-c.helperProportions.height,
left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k-c.helperProportions.width}).left-c.margins.left}if(!c.snapElements[h].snapping&&(p||q||r||s||t))c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=p||q||r||s||t}else{c.snapElements[h].snapping&&c.options.snap.release&&c.options.snap.release.call(c.element,
a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=false}}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(a.length){var b=parseInt(a[0].style.zIndex)||0;d(a).each(function(c){this.style.zIndex=b+c});this[0].style.zIndex=b+a.length}}});d.ui.plugin.add("draggable","zIndex",{start:function(a,
b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("zIndex"))b._zIndex=a.css("zIndex");a.css("zIndex",b.zIndex)},stop:function(a,b){a=d(this).data("draggable").options;a._zIndex&&d(b.helper).css("zIndex",a._zIndex)}})})(jQuery);
;/*
 * jQuery UI Sortable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function(){this.containerCache={};this.element.addClass("ui-sortable");
this.refresh();this.floating=this.items.length?/left|right/.test(this.items[0].item.css("float")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var a=this.items.length-1;a>=0;a--)this.items[a].item.removeData("sortable-item");return this},_setOption:function(a,b){if(a==="disabled"){this.options[a]=b;this.widget()[b?"addClass":"removeClass"]("ui-sortable-disabled")}else d.Widget.prototype._setOption.apply(this,
arguments)},_mouseCapture:function(a,b){if(this.reverting)return false;if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(a);var c=null,e=this;d(a.target).parents().each(function(){if(d.data(this,"sortable-item")==e){c=d(this);return false}});if(d.data(a.target,"sortable-item")==e)c=d(a.target);if(!c)return false;if(this.options.handle&&!b){var f=false;d(this.options.handle,c).find("*").andSelf().each(function(){if(this==a.target)f=true});if(!f)return false}this.currentItem=
c;this._removeCurrentsFromItems();return true},_mouseStart:function(a,b,c){b=this.options;var e=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(a);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");d.extend(this.offset,
{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();this._createPlaceholder();b.containment&&this._setContainment();
if(b.cursor){if(d("body").css("cursor"))this._storedCursor=d("body").css("cursor");d("body").css("cursor",b.cursor)}if(b.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",b.opacity)}if(b.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",b.zIndex)}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",
a,this._uiHash());this._preserveHelperProportions||this._cacheHelperProportions();if(!c)for(c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("activate",a,e._uiHash(this));if(d.ui.ddmanager)d.ui.ddmanager.current=this;d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(a);return true},_mouseDrag:function(a){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");
if(!this.lastPositionAbs)this.lastPositionAbs=this.positionAbs;if(this.options.scroll){var b=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+b.scrollSpeed;else if(a.pageY-this.overflowOffset.top<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-b.scrollSpeed;if(this.overflowOffset.left+
this.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+b.scrollSpeed;else if(a.pageX-this.overflowOffset.left<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-b.scrollSpeed}else{if(a.pageY-d(document).scrollTop()<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()-b.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()+
b.scrollSpeed);if(a.pageX-d(document).scrollLeft()<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed)}c!==false&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+
"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(b=this.items.length-1;b>=0;b--){c=this.items[b];var e=c.item[0],f=this._intersectsWithPointer(c);if(f)if(e!=this.currentItem[0]&&this.placeholder[f==1?"next":"prev"]()[0]!=e&&!d.ui.contains(this.placeholder[0],e)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],e):true)){this.direction=f==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(c))this._rearrange(a,
c);else break;this._trigger("change",a,this._uiHash());break}}this._contactContainers(a);d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);this._trigger("sort",a,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(a,b){if(a){d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);if(this.options.revert){var c=this;b=c.placeholder.offset();c.reverting=true;d(this.helper).animate({left:b.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==
document.body?0:this.offsetParent[0].scrollLeft),top:b.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(a)})}else this._clear(a,b);return false}},cancel:function(){var a=this;if(this.dragging){this._mouseUp();this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var b=this.containers.length-1;b>=0;b--){this.containers[b]._trigger("deactivate",
null,a._uiHash(this));if(this.containers[b].containerCache.over){this.containers[b]._trigger("out",null,a._uiHash(this));this.containers[b].containerCache.over=0}}}this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();d.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):
d(this.domPosition.parent).prepend(this.currentItem);return this},serialize:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};d(b).each(function(){var e=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);if(e)c.push((a.key||e[1]+"[]")+"="+(a.key&&a.expression?e[1]:e[2]))});!c.length&&a.key&&c.push(a.key+"=");return c.join("&")},toArray:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};b.each(function(){c.push(d(a.item||this).attr(a.attribute||
"id")||"")});return c},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,e=this.positionAbs.top,f=e+this.helperProportions.height,g=a.left,h=g+a.width,i=a.top,k=i+a.height,j=this.offset.click.top,l=this.offset.click.left;j=e+j>i&&e+j<k&&b+l>g&&b+l<h;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?j:g<b+
this.helperProportions.width/2&&c-this.helperProportions.width/2<h&&i<e+this.helperProportions.height/2&&f-this.helperProportions.height/2<k},_intersectsWithPointer:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width);b=b&&a;a=this._getDragVerticalDirection();var c=this._getDragHorizontalDirection();if(!b)return false;return this.floating?c&&c=="right"||a=="down"?2:1:a&&(a=="down"?
2:1)},_intersectsWithSides:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width);var c=this._getDragVerticalDirection(),e=this._getDragHorizontalDirection();return this.floating&&e?e=="right"&&a||e=="left"&&!a:c&&(c=="down"&&b||c=="up"&&!b)},_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},
_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){this._refreshItems(a);this.refreshPositions();return this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(a){var b=[],c=[],e=this._connectWith();if(e&&a)for(a=e.length-1;a>=0;a--)for(var f=d(e[a]),g=f.length-1;g>=0;g--){var h=d.data(f[g],"sortable");if(h&&h!=
this&&!h.options.disabled)c.push([d.isFunction(h.options.items)?h.options.items.call(h.element):d(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])}c.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(a=c.length-1;a>=0;a--)c[a][0].each(function(){b.push(this)});return d(b)},_removeCurrentsFromItems:function(){for(var a=
this.currentItem.find(":data(sortable-item)"),b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(a){this.items=[];this.containers=[this];var b=this.items,c=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],a,{item:this.currentItem}):d(this.options.items,this.element),this]],e=this._connectWith();if(e)for(var f=e.length-1;f>=0;f--)for(var g=d(e[f]),h=g.length-1;h>=0;h--){var i=d.data(g[h],"sortable");
if(i&&i!=this&&!i.options.disabled){c.push([d.isFunction(i.options.items)?i.options.items.call(i.element[0],a,{item:this.currentItem}):d(i.options.items,i.element),i]);this.containers.push(i)}}for(f=c.length-1;f>=0;f--){a=c[f][1];e=c[f][0];h=0;for(g=e.length;h<g;h++){i=d(e[h]);i.data("sortable-item",a);b.push({item:i,instance:a,width:0,height:0,left:0,top:0})}}},refreshPositions:function(a){if(this.offsetParent&&this.helper)this.offset.parent=this._getParentOffset();for(var b=this.items.length-1;b>=
0;b--){var c=this.items[b],e=this.options.toleranceElement?d(this.options.toleranceElement,c.item):c.item;if(!a){c.width=e.outerWidth();c.height=e.outerHeight()}e=e.offset();c.left=e.left;c.top=e.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(b=this.containers.length-1;b>=0;b--){e=this.containers[b].element.offset();this.containers[b].containerCache.left=e.left;this.containers[b].containerCache.top=e.top;this.containers[b].containerCache.width=
this.containers[b].element.outerWidth();this.containers[b].containerCache.height=this.containers[b].element.outerHeight()}return this},_createPlaceholder:function(a){var b=a||this,c=b.options;if(!c.placeholder||c.placeholder.constructor==String){var e=c.placeholder;c.placeholder={element:function(){var f=d(document.createElement(b.currentItem[0].nodeName)).addClass(e||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!e)f.style.visibility="hidden";return f},
update:function(f,g){if(!(e&&!c.forcePlaceholderSize)){g.height()||g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));g.width()||g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10))}}}}b.placeholder=d(c.placeholder.element.call(b.element,b.currentItem));b.currentItem.after(b.placeholder);c.placeholder.update(b,b.placeholder)},_contactContainers:function(a){for(var b=
null,c=null,e=this.containers.length-1;e>=0;e--)if(!d.ui.contains(this.currentItem[0],this.containers[e].element[0]))if(this._intersectsWith(this.containers[e].containerCache)){if(!(b&&d.ui.contains(this.containers[e].element[0],b.element[0]))){b=this.containers[e];c=e}}else if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",a,this._uiHash(this));this.containers[e].containerCache.over=0}if(b)if(this.containers.length===1){this.containers[c]._trigger("over",a,this._uiHash(this));
this.containers[c].containerCache.over=1}else if(this.currentContainer!=this.containers[c]){b=1E4;e=null;for(var f=this.positionAbs[this.containers[c].floating?"left":"top"],g=this.items.length-1;g>=0;g--)if(d.ui.contains(this.containers[c].element[0],this.items[g].item[0])){var h=this.items[g][this.containers[c].floating?"left":"top"];if(Math.abs(h-f)<b){b=Math.abs(h-f);e=this.items[g]}}if(e||this.options.dropOnEmpty){this.currentContainer=this.containers[c];e?this._rearrange(a,e,null,true):this._rearrange(a,
null,this.containers[c].element,true);this._trigger("change",a,this._uiHash());this.containers[c]._trigger("change",a,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}}},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a,this.currentItem])):b.helper=="clone"?this.currentItem.clone():this.currentItem;a.parents("body").length||
d(b.appendTo!="parent"?b.appendTo:this.currentItem[0].parentNode)[0].appendChild(a[0]);if(a[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(a[0].style.width==""||b.forceHelperSize)a.width(this.currentItem.width());if(a[0].style.height==""||b.forceHelperSize)a.height(this.currentItem.height());return a},_adjustOffsetFromHelper:function(a){if(typeof a==
"string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition==
"absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition==
"relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},
_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-
this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)){var b=d(a.containment)[0];a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),
10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?
this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=
this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0]))this.offset.relative=this._getRelativeOffset();var f=a.pageX,g=a.pageY;if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])f=this.containment[0]+
this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])f=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?
g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;f=this.originalPageX+Math.round((f-this.originalPageX)/b.grid[0])*b.grid[0];f=this.containment?!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:!(f-this.offset.click.left<this.containment[0])?f-b.grid[0]:f+b.grid[0]:f}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():
e?0:c.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())}},_rearrange:function(a,b,c,e){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?b.item[0]:b.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var f=this,g=this.counter;window.setTimeout(function(){g==
f.counter&&f.refreshPositions(!e)},0)},_clear:function(a,b){this.reverting=false;var c=[];!this._noFinalSort&&this.currentItem[0].parentNode&&this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var e in this._storedCSS)if(this._storedCSS[e]=="auto"||this._storedCSS[e]=="static")this._storedCSS[e]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!b&&c.push(function(f){this._trigger("receive",
f,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!b)c.push(function(f){this._trigger("update",f,this._uiHash())});if(!d.ui.contains(this.element[0],this.currentItem[0])){b||c.push(function(f){this._trigger("remove",f,this._uiHash())});for(e=this.containers.length-1;e>=0;e--)if(d.ui.contains(this.containers[e].element[0],this.currentItem[0])&&!b){c.push(function(f){return function(g){f._trigger("receive",
g,this._uiHash(this))}}.call(this,this.containers[e]));c.push(function(f){return function(g){f._trigger("update",g,this._uiHash(this))}}.call(this,this.containers[e]))}}for(e=this.containers.length-1;e>=0;e--){b||c.push(function(f){return function(g){f._trigger("deactivate",g,this._uiHash(this))}}.call(this,this.containers[e]));if(this.containers[e].containerCache.over){c.push(function(f){return function(g){f._trigger("out",g,this._uiHash(this))}}.call(this,this.containers[e]));this.containers[e].containerCache.over=
0}}this._storedCursor&&d("body").css("cursor",this._storedCursor);this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!b){this._trigger("beforeStop",a,this._uiHash());for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}return false}b||this._trigger("beforeStop",a,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
this.helper[0]!=this.currentItem[0]&&this.helper.remove();this.helper=null;if(!b){for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel()},_uiHash:function(a){var b=a||this;return{helper:b.helper,placeholder:b.placeholder||d([]),position:b.position,originalPosition:b.originalPosition,offset:b.positionAbs,item:b.currentItem,sender:a?a.element:null}}});
d.extend(d.ui.sortable,{version:"1.8.7"})})(jQuery);
;if(!document.createElement("canvas").getContext){(function(){var Y=Math;var q=Y.round;var o=Y.sin;var B=Y.cos;var H=Y.abs;var N=Y.sqrt;var d=10;var f=d/2;function A(){return this.context_||(this.context_=new D(this))}var v=Array.prototype.slice;function g(j,m,p){var i=v.call(arguments,2);return function(){return j.apply(m,i.concat(v.call(arguments)))}}function ad(i){return String(i).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}function R(j){if(!j.namespaces.g_vml_){j.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML")}if(!j.namespaces.g_o_){j.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML")}if(!j.styleSheets.ex_canvas_){var i=j.createStyleSheet();i.owningElement.id="ex_canvas_";i.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"}}R(document);var e={init:function(i){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var j=i||document;j.createElement("canvas");j.attachEvent("onreadystatechange",g(this.init_,this,j))}},init_:function(p){var m=p.getElementsByTagName("canvas");for(var j=0;j<m.length;j++){this.initElement(m[j])}},initElement:function(j){if(!j.getContext){j.getContext=A;R(j.ownerDocument);j.innerHTML="";j.attachEvent("onpropertychange",z);/*j.attachEvent("onresize",V);*/var i=j.attributes;if(i.width&&i.width.specified){j.style.width=i.width.nodeValue+"px"}else{j.width=j.clientWidth}if(i.height&&i.height.specified){j.style.height=i.height.nodeValue+"px"}else{j.height=j.clientHeight}}return j}};function z(j){var i=j.srcElement;switch(j.propertyName){case"width":i.getContext().clearRect();i.style.width=i.attributes.width.nodeValue+"px";i.firstChild.style.width=i.clientWidth+"px";break;case"height":i.getContext().clearRect();i.style.height=i.attributes.height.nodeValue+"px";i.firstChild.style.height=i.clientHeight+"px";break}}function V(j){var i=j.srcElement;if(i.firstChild){i.firstChild.style.width=i.clientWidth+"px";i.firstChild.style.height=i.clientHeight+"px"}}e.init();var n=[];for(var ac=0;ac<16;ac++){for(var ab=0;ab<16;ab++){n[ac*16+ab]=ac.toString(16)+ab.toString(16)}}function C(){return[[1,0,0],[0,1,0],[0,0,1]]}function J(p,m){var j=C();for(var i=0;i<3;i++){for(var af=0;af<3;af++){var Z=0;for(var ae=0;ae<3;ae++){Z+=p[i][ae]*m[ae][af]}j[i][af]=Z}}return j}function x(j,i){i.fillStyle=j.fillStyle;i.lineCap=j.lineCap;i.lineJoin=j.lineJoin;i.lineWidth=j.lineWidth;i.miterLimit=j.miterLimit;i.shadowBlur=j.shadowBlur;i.shadowColor=j.shadowColor;i.shadowOffsetX=j.shadowOffsetX;i.shadowOffsetY=j.shadowOffsetY;i.strokeStyle=j.strokeStyle;i.globalAlpha=j.globalAlpha;i.font=j.font;i.textAlign=j.textAlign;i.textBaseline=j.textBaseline;i.arcScaleX_=j.arcScaleX_;i.arcScaleY_=j.arcScaleY_;i.lineScale_=j.lineScale_}var b={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgreen:"#006400",darkgrey:"#A9A9A9",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",grey:"#808080",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4",indianred:"#CD5C5C",indigo:"#4B0082",ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",lightgreen:"#90EE90",lightgrey:"#D3D3D3",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",mediumaquamarine:"#66CDAA",mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370DB",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",oldlace:"#FDF5E6",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#DB7093",papayawhip:"#FFEFD5",peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",whitesmoke:"#F5F5F5",yellowgreen:"#9ACD32"};function M(j){var p=j.indexOf("(",3);var i=j.indexOf(")",p+1);var m=j.substring(p+1,i).split(",");if(m.length==4&&j.substr(3,1)=="a"){alpha=Number(m[3])}else{m[3]=1}return m}function c(i){return parseFloat(i)/100}function u(j,m,i){return Math.min(i,Math.max(m,j))}function I(af){var m,j,i;h=parseFloat(af[0])/360%360;if(h<0){h++}s=u(c(af[1]),0,1);l=u(c(af[2]),0,1);if(s==0){m=j=i=l}else{var Z=l<0.5?l*(1+s):l+s-l*s;var ae=2*l-Z;m=a(ae,Z,h+1/3);j=a(ae,Z,h);i=a(ae,Z,h-1/3)}return"#"+n[Math.floor(m*255)]+n[Math.floor(j*255)]+n[Math.floor(i*255)]}function a(j,i,m){if(m<0){m++}if(m>1){m--}if(6*m<1){return j+(i-j)*6*m}else{if(2*m<1){return i}else{if(3*m<2){return j+(i-j)*(2/3-m)*6}else{return j}}}}function F(j){var ae,Z=1;j=String(j);if(j.charAt(0)=="#"){ae=j}else{if(/^rgb/.test(j)){var p=M(j);var ae="#",af;for(var m=0;m<3;m++){if(p[m].indexOf("%")!=-1){af=Math.floor(c(p[m])*255)}else{af=Number(p[m])}ae+=n[u(af,0,255)]}Z=p[3]}else{if(/^hsl/.test(j)){var p=M(j);ae=I(p);Z=p[3]}else{ae=b[j]||j}}}return{color:ae,alpha:Z}}var r={style:"normal",variant:"normal",weight:"normal",size:10,family:"sans-serif"};var L={};function E(i){if(L[i]){return L[i]}var p=document.createElement("div");var m=p.style;try{m.font=i}catch(j){}return L[i]={style:m.fontStyle||r.style,variant:m.fontVariant||r.variant,weight:m.fontWeight||r.weight,size:m.fontSize||r.size,family:m.fontFamily||r.family}}function w(m,j){var i={};for(var af in m){i[af]=m[af]}var ae=parseFloat(j.currentStyle.fontSize),Z=parseFloat(m.size);if(typeof m.size=="number"){i.size=m.size}else{if(m.size.indexOf("px")!=-1){i.size=Z}else{if(m.size.indexOf("em")!=-1){i.size=ae*Z}else{if(m.size.indexOf("%")!=-1){i.size=(ae/100)*Z}else{if(m.size.indexOf("pt")!=-1){i.size=ae*(4/3)*Z}else{i.size=ae}}}}}i.size*=0.981;return i}function aa(i){return i.style+" "+i.variant+" "+i.weight+" "+i.size+"px "+i.family}function S(i){switch(i){case"butt":return"flat";case"round":return"round";case"square":default:return"square"}}function D(j){this.m_=C();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.strokeStyle="#000";this.fillStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=d*1;this.globalAlpha=1;this.font="10px sans-serif";this.textAlign="left";this.textBaseline="alphabetic";this.canvas=j;var i=j.ownerDocument.createElement("div");i.style.width=j.clientWidth+"px";i.style.height=j.clientHeight+"px";i.style.overflow="hidden";i.style.position="absolute";j.appendChild(i);this.element_=i;this.arcScaleX_=1;this.arcScaleY_=1;this.lineScale_=1}var t=D.prototype;t.clearRect=function(){if(this.textMeasureEl_){this.textMeasureEl_.removeNode(true);this.textMeasureEl_=null}this.element_.innerHTML=""};t.beginPath=function(){this.currentPath_=[]};t.moveTo=function(j,i){var m=this.getCoords_(j,i);this.currentPath_.push({type:"moveTo",x:m.x,y:m.y});this.currentX_=m.x;this.currentY_=m.y};t.lineTo=function(j,i){var m=this.getCoords_(j,i);this.currentPath_.push({type:"lineTo",x:m.x,y:m.y});this.currentX_=m.x;this.currentY_=m.y};t.bezierCurveTo=function(m,j,ai,ah,ag,ae){var i=this.getCoords_(ag,ae);var af=this.getCoords_(m,j);var Z=this.getCoords_(ai,ah);K(this,af,Z,i)};function K(i,Z,m,j){i.currentPath_.push({type:"bezierCurveTo",cp1x:Z.x,cp1y:Z.y,cp2x:m.x,cp2y:m.y,x:j.x,y:j.y});i.currentX_=j.x;i.currentY_=j.y}t.quadraticCurveTo=function(ag,m,j,i){var af=this.getCoords_(ag,m);var ae=this.getCoords_(j,i);var ah={x:this.currentX_+2/3*(af.x-this.currentX_),y:this.currentY_+2/3*(af.y-this.currentY_)};var Z={x:ah.x+(ae.x-this.currentX_)/3,y:ah.y+(ae.y-this.currentY_)/3};K(this,ah,Z,ae)};t.arc=function(aj,ah,ai,ae,j,m){ai*=d;var an=m?"at":"wa";var ak=aj+B(ae)*ai-f;var am=ah+o(ae)*ai-f;var i=aj+B(j)*ai-f;var al=ah+o(j)*ai-f;if(ak==i&&!m){ak+=0.125}var Z=this.getCoords_(aj,ah);var ag=this.getCoords_(ak,am);var af=this.getCoords_(i,al);this.currentPath_.push({type:an,x:Z.x,y:Z.y,radius:ai,xStart:ag.x,yStart:ag.y,xEnd:af.x,yEnd:af.y})};t.rect=function(m,j,i,p){this.moveTo(m,j);this.lineTo(m+i,j);this.lineTo(m+i,j+p);this.lineTo(m,j+p);this.closePath()};t.strokeRect=function(m,j,i,p){var Z=this.currentPath_;this.beginPath();this.moveTo(m,j);this.lineTo(m+i,j);this.lineTo(m+i,j+p);this.lineTo(m,j+p);this.closePath();this.stroke();this.currentPath_=Z};t.fillRect=function(m,j,i,p){var Z=this.currentPath_;this.beginPath();this.moveTo(m,j);this.lineTo(m+i,j);this.lineTo(m+i,j+p);this.lineTo(m,j+p);this.closePath();this.fill();this.currentPath_=Z};t.createLinearGradient=function(j,p,i,m){var Z=new U("gradient");Z.x0_=j;Z.y0_=p;Z.x1_=i;Z.y1_=m;return Z};t.createRadialGradient=function(p,ae,m,j,Z,i){var af=new U("gradientradial");af.x0_=p;af.y0_=ae;af.r0_=m;af.x1_=j;af.y1_=Z;af.r1_=i;return af};t.drawImage=function(ao,m){var ah,af,aj,aw,am,ak,aq,ay;var ai=ao.runtimeStyle.width;var an=ao.runtimeStyle.height;ao.runtimeStyle.width="auto";ao.runtimeStyle.height="auto";var ag=ao.width;var au=ao.height;ao.runtimeStyle.width=ai;ao.runtimeStyle.height=an;if(arguments.length==3){ah=arguments[1];af=arguments[2];am=ak=0;aq=aj=ag;ay=aw=au}else{if(arguments.length==5){ah=arguments[1];af=arguments[2];aj=arguments[3];aw=arguments[4];am=ak=0;aq=ag;ay=au}else{if(arguments.length==9){am=arguments[1];ak=arguments[2];aq=arguments[3];ay=arguments[4];ah=arguments[5];af=arguments[6];aj=arguments[7];aw=arguments[8]}else{throw Error("Invalid number of arguments")}}}var ax=this.getCoords_(ah,af);var p=aq/2;var j=ay/2;var av=[];var i=10;var ae=10;av.push(" <g_vml_:group",' coordsize="',d*i,",",d*ae,'"',' coordorigin="0,0"',' style="width:',i,"px;height:",ae,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]||this.m_[1][1]!=1||this.m_[1][0]){var Z=[];Z.push("M11=",this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",q(ax.x/d),",","Dy=",q(ax.y/d),"");var at=ax;var ar=this.getCoords_(ah+aj,af);var ap=this.getCoords_(ah,af+aw);var al=this.getCoords_(ah+aj,af+aw);at.x=Y.max(at.x,ar.x,ap.x,al.x);at.y=Y.max(at.y,ar.y,ap.y,al.y);av.push("padding:0 ",q(at.x/d),"px ",q(at.y/d),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",Z.join(""),", sizingmethod='clip');")}else{av.push("top:",q(ax.y/d),"px;left:",q(ax.x/d),"px;")}av.push(' ">','<g_vml_:image src="',ao.src,'"',' style="width:',d*aj,"px;"," height:",d*aw,'px"',' cropleft="',am/ag,'"',' croptop="',ak/au,'"',' cropright="',(ag-am-aq)/ag,'"',' cropbottom="',(au-ak-ay)/au,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",av.join(""))};t.stroke=function(aj){var ah=[];var Z=false;var m=10;var ak=10;ah.push("<g_vml_:shape",' filled="',!!aj,'"',' style="position:absolute;width:',m,"px;height:",ak,'px;"',' coordorigin="0,0"',' coordsize="',d*m,",",d*ak,'"',' stroked="',!aj,'"',' path="');var al=false;var ae={x:null,y:null};var ai={x:null,y:null};for(var af=0;af<this.currentPath_.length;af++){var j=this.currentPath_[af];var ag;switch(j.type){case"moveTo":ag=j;ah.push(" m ",q(j.x),",",q(j.y));break;case"lineTo":ah.push(" l ",q(j.x),",",q(j.y));break;case"close":ah.push(" x ");j=null;break;case"bezierCurveTo":ah.push(" c ",q(j.cp1x),",",q(j.cp1y),",",q(j.cp2x),",",q(j.cp2y),",",q(j.x),",",q(j.y));break;case"at":case"wa":ah.push(" ",j.type," ",q(j.x-this.arcScaleX_*j.radius),",",q(j.y-this.arcScaleY_*j.radius)," ",q(j.x+this.arcScaleX_*j.radius),",",q(j.y+this.arcScaleY_*j.radius)," ",q(j.xStart),",",q(j.yStart)," ",q(j.xEnd),",",q(j.yEnd));break}if(j){if(ae.x==null||j.x<ae.x){ae.x=j.x}if(ai.x==null||j.x>ai.x){ai.x=j.x}if(ae.y==null||j.y<ae.y){ae.y=j.y}if(ai.y==null||j.y>ai.y){ai.y=j.y}}}ah.push(' ">');if(!aj){y(this,ah)}else{G(this,ah,ae,ai)}ah.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",ah.join(""))};function y(m,ae){var j=F(m.strokeStyle);var p=j.color;var Z=j.alpha*m.globalAlpha;var i=m.lineScale_*m.lineWidth;if(i<1){Z*=i}ae.push("<g_vml_:stroke",' opacity="',Z,'"',' joinstyle="',m.lineJoin,'"',' miterlimit="',m.miterLimit,'"',' endcap="',S(m.lineCap),'"',' weight="',i,'px"',' color="',p,'" />')}function G(ao,ag,aI,ap){var ah=ao.fillStyle;var az=ao.arcScaleX_;var ay=ao.arcScaleY_;var j=ap.x-aI.x;var p=ap.y-aI.y;if(ah instanceof U){var al=0;var aD={x:0,y:0};var av=0;var ak=1;if(ah.type_=="gradient"){var aj=ah.x0_/az;var m=ah.y0_/ay;var ai=ah.x1_/az;var aK=ah.y1_/ay;var aH=ao.getCoords_(aj,m);var aG=ao.getCoords_(ai,aK);var ae=aG.x-aH.x;var Z=aG.y-aH.y;al=Math.atan2(ae,Z)*180/Math.PI;if(al<0){al+=360}if(al<0.000001){al=0}}else{var aH=ao.getCoords_(ah.x0_,ah.y0_);aD={x:(aH.x-aI.x)/j,y:(aH.y-aI.y)/p};j/=az*d;p/=ay*d;var aB=Y.max(j,p);av=2*ah.r0_/aB;ak=2*ah.r1_/aB-av}var at=ah.colors_;at.sort(function(aL,i){return aL.offset-i.offset});var an=at.length;var ar=at[0].color;var aq=at[an-1].color;var ax=at[0].alpha*ao.globalAlpha;var aw=at[an-1].alpha*ao.globalAlpha;var aC=[];for(var aF=0;aF<an;aF++){var am=at[aF];aC.push(am.offset*ak+av+" "+am.color)}ag.push('<g_vml_:fill type="',ah.type_,'"',' method="none" focus="100%"',' color="',ar,'"',' color2="',aq,'"',' colors="',aC.join(","),'"',' opacity="',aw,'"',' g_o_:opacity2="',ax,'"',' angle="',al,'"',' focusposition="',aD.x,",",aD.y,'" />')}else{if(ah instanceof T){if(j&&p){var af=-aI.x;var aA=-aI.y;ag.push("<g_vml_:fill",' position="',af/j*az*az,",",aA/p*ay*ay,'"',' type="tile"',' src="',ah.src_,'" />')}}else{var aJ=F(ao.fillStyle);var au=aJ.color;var aE=aJ.alpha*ao.globalAlpha;ag.push('<g_vml_:fill color="',au,'" opacity="',aE,'" />')}}}t.fill=function(){this.stroke(true)};t.closePath=function(){this.currentPath_.push({type:"close"})};t.getCoords_=function(p,j){var i=this.m_;return{x:d*(p*i[0][0]+j*i[1][0]+i[2][0])-f,y:d*(p*i[0][1]+j*i[1][1]+i[2][1])-f}};t.save=function(){var i={};x(this,i);this.aStack_.push(i);this.mStack_.push(this.m_);this.m_=J(C(),this.m_)};t.restore=function(){if(this.aStack_.length){x(this.aStack_.pop(),this);this.m_=this.mStack_.pop()}};function k(i){return isFinite(i[0][0])&&isFinite(i[0][1])&&isFinite(i[1][0])&&isFinite(i[1][1])&&isFinite(i[2][0])&&isFinite(i[2][1])}function X(j,i,p){if(!k(i)){return}j.m_=i;if(p){var Z=i[0][0]*i[1][1]-i[0][1]*i[1][0];j.lineScale_=N(H(Z))}}t.translate=function(m,j){var i=[[1,0,0],[0,1,0],[m,j,1]];X(this,J(i,this.m_),false)};t.rotate=function(j){var p=B(j);var m=o(j);var i=[[p,m,0],[-m,p,0],[0,0,1]];X(this,J(i,this.m_),false)};t.scale=function(m,j){this.arcScaleX_*=m;this.arcScaleY_*=j;var i=[[m,0,0],[0,j,0],[0,0,1]];X(this,J(i,this.m_),true)};t.transform=function(Z,p,af,ae,j,i){var m=[[Z,p,0],[af,ae,0],[j,i,1]];X(this,J(m,this.m_),true)};t.setTransform=function(ae,Z,ag,af,p,j){var i=[[ae,Z,0],[ag,af,0],[p,j,1]];X(this,i,true)};t.drawText_=function(ak,ai,ah,an,ag){var am=this.m_,aq=1000,j=0,ap=aq,af={x:0,y:0},ae=[];var i=w(E(this.font),this.element_);var p=aa(i);var ar=this.element_.currentStyle;var Z=this.textAlign.toLowerCase();switch(Z){case"left":case"center":case"right":break;case"end":Z=ar.direction=="ltr"?"right":"left";break;case"start":Z=ar.direction=="rtl"?"right":"left";break;default:Z="left"}switch(this.textBaseline){case"hanging":case"top":af.y=i.size/1.75;break;case"middle":break;default:case null:case"alphabetic":case"ideographic":case"bottom":af.y=-i.size/2.25;break}switch(Z){case"right":j=aq;ap=0.05;break;case"center":j=ap=aq/2;break}var ao=this.getCoords_(ai+af.x,ah+af.y);ae.push('<g_vml_:line from="',-j,' 0" to="',ap,' 0.05" ',' coordsize="100 100" coordorigin="0 0"',' filled="',!ag,'" stroked="',!!ag,'" style="position:absolute;width:1px;height:1px;">');if(ag){y(this,ae)}else{G(this,ae,{x:-j,y:0},{x:ap,y:i.size})}var al=am[0][0].toFixed(3)+","+am[1][0].toFixed(3)+","+am[0][1].toFixed(3)+","+am[1][1].toFixed(3)+",0,0";var aj=q(ao.x/d)+","+q(ao.y/d);ae.push('<g_vml_:skew on="t" matrix="',al,'" ',' offset="',aj,'" origin="',j,' 0" />','<g_vml_:path textpathok="true" />','<g_vml_:textpath on="true" string="',ad(ak),'" style="v-text-align:',Z,";font:",ad(p),'" /></g_vml_:line>');this.element_.insertAdjacentHTML("beforeEnd",ae.join(""))};t.fillText=function(m,i,p,j){this.drawText_(m,i,p,j,false)};t.strokeText=function(m,i,p,j){this.drawText_(m,i,p,j,true)};t.measureText=function(m){if(!this.textMeasureEl_){var i='<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';this.element_.insertAdjacentHTML("beforeEnd",i);this.textMeasureEl_=this.element_.lastChild}var j=this.element_.ownerDocument;this.textMeasureEl_.innerHTML="";this.textMeasureEl_.style.font=this.font;this.textMeasureEl_.appendChild(j.createTextNode(m));return{width:this.textMeasureEl_.offsetWidth}};t.clip=function(){};t.arcTo=function(){};t.createPattern=function(j,i){return new T(j,i)};function U(i){this.type_=i;this.x0_=0;this.y0_=0;this.r0_=0;this.x1_=0;this.y1_=0;this.r1_=0;this.colors_=[]}U.prototype.addColorStop=function(j,i){i=F(i);this.colors_.push({offset:j,color:i.color,alpha:i.alpha})};function T(j,i){Q(j);switch(i){case"repeat":case null:case"":this.repetition_="repeat";break;case"repeat-x":case"repeat-y":case"no-repeat":this.repetition_=i;break;default:O("SYNTAX_ERR")}this.src_=j.src;this.width_=j.width;this.height_=j.height}function O(i){throw new P(i)}function Q(i){if(!i||i.nodeType!=1||i.tagName!="IMG"){O("TYPE_MISMATCH_ERR")}if(i.readyState!="complete"){O("INVALID_STATE_ERR")}}function P(i){this.code=this[i];this.message=i+": DOM Exception "+this.code}var W=P.prototype=new Error;W.INDEX_SIZE_ERR=1;W.DOMSTRING_SIZE_ERR=2;W.HIERARCHY_REQUEST_ERR=3;W.WRONG_DOCUMENT_ERR=4;W.INVALID_CHARACTER_ERR=5;W.NO_DATA_ALLOWED_ERR=6;W.NO_MODIFICATION_ALLOWED_ERR=7;W.NOT_FOUND_ERR=8;W.NOT_SUPPORTED_ERR=9;W.INUSE_ATTRIBUTE_ERR=10;W.INVALID_STATE_ERR=11;W.SYNTAX_ERR=12;W.INVALID_MODIFICATION_ERR=13;W.NAMESPACE_ERR=14;W.INVALID_ACCESS_ERR=15;W.VALIDATION_ERR=16;W.TYPE_MISMATCH_ERR=17;G_vmlCanvasManager=e;CanvasRenderingContext2D=D;CanvasGradient=U;CanvasPattern=T;DOMException=P})()};(function($){var undefined;$.jqplot=function(target,data,options){var _data,_options;if(data==null){throw"No data specified";}if(data.constructor==Array&&data.length==0||data[0].constructor!=Array){throw"Improper Data Array";}if(options==null){if(data instanceof Array){_data=data;_options=null}else if(data.constructor==Object){_data=null;_options=data}}else{_data=data;_options=options}var plot=new jqPlot();plot.init(target,_data,_options);plot.draw();return plot};$.jqplot.debug=1;$.jqplot.config={debug:1,enablePlugins:true,defaultHeight:300,defaultWidth:400};$.jqplot.enablePlugins=$.jqplot.config.enablePlugins;$.jqplot.preInitHooks=[];$.jqplot.postInitHooks=[];$.jqplot.preParseOptionsHooks=[];$.jqplot.postParseOptionsHooks=[];$.jqplot.preDrawHooks=[];$.jqplot.postDrawHooks=[];$.jqplot.preDrawSeriesHooks=[];$.jqplot.postDrawSeriesHooks=[];$.jqplot.preDrawLegendHooks=[];$.jqplot.addLegendRowHooks=[];$.jqplot.preSeriesInitHooks=[];$.jqplot.postSeriesInitHooks=[];$.jqplot.preParseSeriesOptionsHooks=[];$.jqplot.postParseSeriesOptionsHooks=[];$.jqplot.eventListenerHooks=[];$.jqplot.preDrawSeriesShadowHooks=[];$.jqplot.postDrawSeriesShadowHooks=[];$.jqplot.ElemContainer=function(){this._elem;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null}};$.jqplot.ElemContainer.prototype.getWidth=function(){if(this._elem){return this._elem.outerWidth(true)}else{return null}};$.jqplot.ElemContainer.prototype.getHeight=function(){if(this._elem){return this._elem.outerHeight(true)}else{return null}};$.jqplot.ElemContainer.prototype.getPosition=function(){if(this._elem){return this._elem.position()}else{return{top:null,left:null,bottom:null,right:null}}};$.jqplot.ElemContainer.prototype.getTop=function(){return this.getPosition().top};$.jqplot.ElemContainer.prototype.getLeft=function(){return this.getPosition().left};$.jqplot.ElemContainer.prototype.getBottom=function(){return this._elem.css('bottom')};$.jqplot.ElemContainer.prototype.getRight=function(){return this._elem.css('right')};function Axis(name){$.jqplot.ElemContainer.call(this);this.name=name;this._series=[];this.show=false;this.tickRenderer=$.jqplot.AxisTickRenderer;this.tickOptions={};this.labelRenderer=$.jqplot.AxisLabelRenderer;this.labelOptions={};this.label=null;this.showLabel=true;this.min=null;this.max=null;this.autoscale=false;this.autoscaleOnZoom=null;this.pad=1.2;this.padMax=null;this.padMin=null;this.ticks=[];this.numberTicks;this.tickInterval;this.renderer=$.jqplot.LinearAxisRenderer;this.rendererOptions={};this.showTicks=true;this.showTickMarks=true;this.showMinorTicks=true;this.useSeriesColor=false;this.borderWidth=null;this.borderColor=null;this._dataBounds={min:null,max:null};this._offsets={min:null,max:null};this._ticks=[];this._label=null;this.syncTicks=null;this.tickSpacing=75;this._min=null;this._max=null;this._tickInterval=null;this._numberTicks=null;this.__ticks=null}Axis.prototype=new $.jqplot.ElemContainer();Axis.prototype.constructor=Axis;Axis.prototype.init=function(){this.renderer=new this.renderer();this.tickOptions.axis=this.name;if(this.label==null||this.label==''){this.showLabel=false}else{this.labelOptions.label=this.label}if(this.showLabel==false){this.labelOptions.show=false}if(this.pad==0){this.pad=1.0}if(this.padMax==0){this.padMax=1.0}if(this.padMin==0){this.padMin=1.0}if(this.padMax==null){this.padMax=(this.pad-1)/2+1}if(this.padMin==null){this.padMin=(this.pad-1)/2+1}this.pad=this.padMax+this.padMin-1;if(this.min!=null||this.max!=null){this.autoscale=false}if(this.syncTicks==null&&this.name.indexOf('y')>-1){this.syncTicks=true}else if(this.syncTicks==null){this.syncTicks=false}this.renderer.init.call(this,this.rendererOptions)};Axis.prototype.draw=function(ctx){return this.renderer.draw.call(this,ctx)};Axis.prototype.set=function(){this.renderer.set.call(this)};Axis.prototype.pack=function(pos,offsets){if(this.show){this.renderer.pack.call(this,pos,offsets)}if(this._min==null){this._min=this.min;this._max=this.max;this._tickInterval=this.tickInterval;this._numberTicks=this.numberTicks;this.__ticks=this._ticks}};Axis.prototype.reset=function(){this.renderer.reset.call(this)};Axis.prototype.resetScale=function(){this.min=null;this.max=null;this.numberTicks=null;this.tickInterval=null};function Legend(options){$.jqplot.ElemContainer.call(this);this.show=false;this.location='ne';this.xoffset=12;this.yoffset=12;this.border;this.background;this.textColor;this.fontFamily;this.fontSize;this.rowSpacing='0.5em';this.renderer=$.jqplot.TableLegendRenderer;this.rendererOptions={};this.preDraw=false;this.escapeHtml=false;this._series=[];$.extend(true,this,options)}Legend.prototype=new $.jqplot.ElemContainer();Legend.prototype.constructor=Legend;Legend.prototype.init=function(){this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions)};Legend.prototype.draw=function(offsets){for(var i=0;i<$.jqplot.preDrawLegendHooks.length;i++){$.jqplot.preDrawLegendHooks[i].call(this,offsets)}return this.renderer.draw.call(this,offsets)};Legend.prototype.pack=function(offsets){this.renderer.pack.call(this,offsets)};function Title(text){$.jqplot.ElemContainer.call(this);this.text=text;this.show=true;this.fontFamily;this.fontSize;this.textAlign;this.textColor;this.renderer=$.jqplot.DivTitleRenderer;this.rendererOptions={}}Title.prototype=new $.jqplot.ElemContainer();Title.prototype.constructor=Title;Title.prototype.init=function(){this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions)};Title.prototype.draw=function(width){return this.renderer.draw.call(this,width)};Title.prototype.pack=function(){this.renderer.pack.call(this)};function Series(){$.jqplot.ElemContainer.call(this);this.show=true;this.xaxis='xaxis';this._xaxis;this.yaxis='yaxis';this._yaxis;this.gridBorderWidth=2.0;this.renderer=$.jqplot.LineRenderer;this.rendererOptions={};this.data=[];this.gridData=[];this.label='';this.showLabel=true;this.color;this.lineWidth=2.5;this.shadow=true;this.shadowAngle=45;this.shadowOffset=1.25;this.shadowDepth=3;this.shadowAlpha='0.1';this.breakOnNull=false;this.markerRenderer=$.jqplot.MarkerRenderer;this.markerOptions={};this.showLine=true;this.showMarker=true;this.index;this.fill=false;this.fillColor;this.fillAlpha;this.fillAndStroke=false;this.disableStack=false;this._stack=false;this.neighborThreshold=4;this.fillToZero=false;this.fillAxis='y';this.useNegativeColors=true;this._stackData=[];this._plotData=[];this._plotValues={x:[],y:[]};this._intervals={x:{},y:{}};this._prevPlotData=[];this._prevGridData=[];this._stackAxis='y';this._primaryAxis='_xaxis';this.canvas=new $.jqplot.GenericCanvas();this.shadowCanvas=new $.jqplot.GenericCanvas();this.plugins={};this._sumy=0;this._sumx=0;this.minX=null;this.maxX=null;this.minY=null;this.maxY=null}Series.prototype=new $.jqplot.ElemContainer();Series.prototype.constructor=Series;Series.prototype.init=function(index,gridbw,plot){this.index=index;this.gridBorderWidth=gridbw;var d=this.data;for(var i=0;i<d.length;i++){if(!this.breakOnNull){if(d[i]==null||d[i][0]==null||d[i][1]==null){d.splice(i,1);continue}}else{if(d[i]==null||d[i][0]==null||d[i][1]==null){var undefined}}}if(!this.fillColor){this.fillColor=this.color}if(this.fillAlpha){var comp=$.jqplot.normalize2rgb(this.fillColor);var comp=$.jqplot.getColorComponents(comp);this.fillColor='rgba('+comp[0]+','+comp[1]+','+comp[2]+','+this.fillAlpha+')'}this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions,plot);this.markerRenderer=new this.markerRenderer();if(!this.markerOptions.color){this.markerOptions.color=this.color}if(this.markerOptions.show==null){this.markerOptions.show=this.showMarker}this.markerRenderer.init(this.markerOptions)};Series.prototype.draw=function(sctx,opts,plot){var options=(opts==undefined)?{}:opts;sctx=(sctx==undefined)?this.canvas._ctx:sctx;for(var j=0;j<$.jqplot.preDrawSeriesHooks.length;j++){$.jqplot.preDrawSeriesHooks[j].call(this,sctx,options)}if(this.show){this.renderer.setGridData.call(this,plot);if(!options.preventJqPlotSeriesDrawTrigger){$(sctx.canvas).trigger('jqplotSeriesDraw',[this.data,this.gridData])}var data=[];if(options.data){data=options.data}else if(!this._stack){data=this.data}else{data=this._plotData}var gridData=options.gridData||this.renderer.makeGridData.call(this,data,plot);this.renderer.draw.call(this,sctx,gridData,options)}for(var j=0;j<$.jqplot.postDrawSeriesHooks.length;j++){$.jqplot.postDrawSeriesHooks[j].call(this,sctx,options)}};Series.prototype.drawShadow=function(sctx,opts,plot){var options=(opts==undefined)?{}:opts;sctx=(sctx==undefined)?this.shadowCanvas._ctx:sctx;for(var j=0;j<$.jqplot.preDrawSeriesShadowHooks.length;j++){$.jqplot.preDrawSeriesShadowHooks[j].call(this,sctx,options)}if(this.shadow){this.renderer.setGridData.call(this,plot);var data=[];if(options.data){data=options.data}else if(!this._stack){data=this.data}else{data=this._plotData}var gridData=options.gridData||this.renderer.makeGridData.call(this,data,plot);this.renderer.drawShadow.call(this,sctx,gridData,options)}for(var j=0;j<$.jqplot.postDrawSeriesShadowHooks.length;j++){$.jqplot.postDrawSeriesShadowHooks[j].call(this,sctx,options)}};function Grid(){$.jqplot.ElemContainer.call(this);this.drawGridlines=true;this.gridLineColor='#cccccc';this.gridLineWidth=1.0;this.background='#fffdf6';this.borderColor='#999999';this.borderWidth=2.0;this.shadow=true;this.shadowAngle=45;this.shadowOffset=1.5;this.shadowWidth=3;this.shadowDepth=3;this.shadowAlpha='0.07';this._left;this._top;this._right;this._bottom;this._width;this._height;this._axes=[];this.renderer=$.jqplot.CanvasGridRenderer;this.rendererOptions={};this._offsets={top:null,bottom:null,left:null,right:null}}Grid.prototype=new $.jqplot.ElemContainer();Grid.prototype.constructor=Grid;Grid.prototype.init=function(){this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions)};Grid.prototype.createElement=function(offsets){this._offsets=offsets;return this.renderer.createElement.call(this)};Grid.prototype.draw=function(){this.renderer.draw.call(this)};$.jqplot.GenericCanvas=function(){$.jqplot.ElemContainer.call(this);this._ctx};$.jqplot.GenericCanvas.prototype=new $.jqplot.ElemContainer();$.jqplot.GenericCanvas.prototype.constructor=$.jqplot.GenericCanvas;$.jqplot.GenericCanvas.prototype.createElement=function(offsets,clss,plotDimensions){this._offsets=offsets;var klass='jqplot';if(clss!=undefined){klass=clss}var elem=document.createElement('canvas');if(plotDimensions!=undefined){this._plotDimensions=plotDimensions}elem.width=this._plotDimensions.width-this._offsets.left-this._offsets.right;elem.height=this._plotDimensions.height-this._offsets.top-this._offsets.bottom;this._elem=$(elem);this._elem.addClass(klass);this._elem.css({position:'absolute',left:this._offsets.left,top:this._offsets.top});if($.browser.msie){window.G_vmlCanvasManager.init_(document)}if($.browser.msie){elem=window.G_vmlCanvasManager.initElement(elem)}return this._elem};$.jqplot.GenericCanvas.prototype.setContext=function(){this._ctx=this._elem.get(0).getContext("2d");return this._ctx};function jqPlot(){this.data=[];this.targetId=null;this.graphName='graph';this.performOnPlot=function(){};this.performAfterPlot=function(){};this.target=null;this.defaults={axesDefaults:{},axes:{xaxis:{},yaxis:{},x2axis:{},y2axis:{},y3axis:{},y4axis:{},y5axis:{},y6axis:{},y7axis:{},y8axis:{},y9axis:{}},seriesDefaults:{},gridPadding:{top:10,right:10,bottom:23,left:10},series:[]};this.series=[];this.axes={xaxis:new Axis('xaxis'),yaxis:new Axis('yaxis'),x2axis:new Axis('x2axis'),y2axis:new Axis('y2axis'),y3axis:new Axis('y3axis'),y4axis:new Axis('y4axis'),y5axis:new Axis('y5axis'),y6axis:new Axis('y6axis'),y7axis:new Axis('y7axis'),y8axis:new Axis('y8axis'),y9axis:new Axis('y9axis')};this.grid=new Grid();this.legend=new Legend();this.baseCanvas=new $.jqplot.GenericCanvas();this.eventCanvas=new $.jqplot.GenericCanvas();this._width=null;this._height=null;this._plotDimensions={height:null,width:null};this._gridPadding={top:10,right:10,bottom:10,left:10};this.syncXTicks=true;this.syncYTicks=true;this.seriesColors=["#4bb2c5","#EAA228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3","#bd70c7"];this.negativeSeriesColors=["#498991","#C08840","#9F9274","#546D61","#646C4A","#6F6621","#6E3F5F","#4F64B0","#A89050","#C45923","#187399","#945381","#959E5C","#C7AF7B","#478396","#907294"];this.sortData=true;var seriesColorsIndex=0;this.textColor;this.fontFamily;this.fontSize;this.title=new Title();this.options={};this.stackSeries=false;this._stackData=[];this._plotData=[];this.plugins={};this._drawCount=0;this.drawIfHidden=false;this._sumy=0;this._sumx=0;this.colorGenerator=$.jqplot.ColorGenerator;this.init=function(target,data,options){for(var i=0;i<$.jqplot.preInitHooks.length;i++){$.jqplot.preInitHooks[i].call(this,target,data,options)}if(options){if(options.graphName)this.graphName=options.graphName;if(options.performOnPlot)this.performOnPlot=options.performOnPlot;if(options.performAfterPlot)this.performAfterPlot=options.performAfterPlot}this.targetId='#'+target;this.target=$('#'+target);if(!this.target.get(0)){throw"No plot target specified";}if(this.target.css('position')=='static'){this.target.css('position','relative')}if(!this.target.hasClass('jqplot-target')){this.target.addClass('jqplot-target')}if(!this.target.height()){var h;if(options&&options.height){h=parseInt(options.height,10)}else if(this.target.attr('data-height')){h=parseInt(this.target.attr('data-height'),10)}else{h=parseInt($.jqplot.config.defaultHeight,10)}this._height=h;this.target.css('height',h+'px')}else{this._height=this.target.height()}if(!this.target.width()){var w;if(options&&options.width){w=parseInt(options.width,10)}else if(this.target.attr('data-width')){w=parseInt(this.target.attr('data-width'),10)}else{w=parseInt($.jqplot.config.defaultWidth,10)}this._width=w;this.target.css('width',w+'px')}else{this._width=this.target.width()}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;if(this._height<=0||this._width<=0||!this._height||!this._width){throw"Canvas dimension not set";}this.data=data;this.parseOptions(options);if(this.textColor){this.target.css('color',this.textColor)}if(this.fontFamily){this.target.css('font-family',this.fontFamily)}if(this.fontSize){this.target.css('font-size',this.fontSize)}this.title.init();this.legend.init();this._sumy=0;this._sumx=0;for(var i=0;i<this.series.length;i++){this.series[i].shadowCanvas._plotDimensions=this._plotDimensions;this.series[i].canvas._plotDimensions=this._plotDimensions;for(var j=0;j<$.jqplot.preSeriesInitHooks.length;j++){$.jqplot.preSeriesInitHooks[j].call(this.series[i],target,data,this.options.seriesDefaults,this.options.series[i])}this.populatePlotData(this.series[i],i);this.series[i]._plotDimensions=this._plotDimensions;this.series[i].init(i,this.grid.borderWidth,this);for(var j=0;j<$.jqplot.postSeriesInitHooks.length;j++){$.jqplot.postSeriesInitHooks[j].call(this.series[i],target,data,this.options.seriesDefaults,this.options.series[i])}this._sumy+=this.series[i]._sumy;this._sumx+=this.series[i]._sumx}for(var name in this.axes){this.axes[name]._plotDimensions=this._plotDimensions;this.axes[name].init()}if(this.sortData){sortData(this.series)}this.grid.init();this.grid._axes=this.axes;this.legend._series=this.series;for(var i=0;i<$.jqplot.postInitHooks.length;i++){$.jqplot.postInitHooks[i].call(this,target,data,options)}};this.resetAxesScale=function(axes){var ax=(axes!=undefined)?axes:this.axes;if(ax===true){ax=this.axes}if(ax.constructor===Array){for(var i=0;i<ax.length;i++){this.axes[ax[i]].resetScale()}}else if(ax.constructor===Object){for(var name in ax){this.axes[name].resetScale()}}};this.reInitialize=function(){if(!this.target.height()){var h;if(options&&options.height){h=parseInt(options.height,10)}else if(this.target.attr('data-height')){h=parseInt(this.target.attr('data-height'),10)}else{h=parseInt($.jqplot.config.defaultHeight,10)}this._height=h;this.target.css('height',h+'px')}else{this._height=this.target.height()}if(!this.target.width()){var w;if(options&&options.width){w=parseInt(options.width,10)}else if(this.target.attr('data-width')){w=parseInt(this.target.attr('data-width'),10)}else{w=parseInt($.jqplot.config.defaultWidth,10)}this._width=w;this.target.css('width',w+'px')}else{this._width=this.target.width()}if(this._height<=0||this._width<=0||!this._height||!this._width){throw"Target dimension not set";}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;for(var n in this.axes){var axis=this.axes[n];axis._plotWidth=this._width;axis._plotHeight=this._height}this.title._plotWidth=this._width;if(this.textColor){this.target.css('color',this.textColor)}if(this.fontFamily){this.target.css('font-family',this.fontFamily)}if(this.fontSize){this.target.css('font-size',this.fontSize)}this._sumy=0;this._sumx=0;for(var i=0;i<this.series.length;i++){this.populatePlotData(this.series[i],i);this.series[i]._plotDimensions=this._plotDimensions;this.series[i].canvas._plotDimensions=this._plotDimensions;this._sumy+=this.series[i]._sumy;this._sumx+=this.series[i]._sumx}for(var name in this.axes){this.axes[name]._plotDimensions=this._plotDimensions;this.axes[name]._ticks=[];this.axes[name].renderer.init.call(this.axes[name],{})}if(this.sortData){sortData(this.series)}this.grid._axes=this.axes;this.legend._series=this.series};function sortData(series){var d,ret;for(var i=0;i<series.length;i++){d=series[i].data;var check=true;if(series[i]._stackAxis=='x'){for(var j=0;j<d.length;j++){if(typeof(d[j][1])!="number"){check=false;break}}if(check){d.sort(function(a,b){return a[1]-b[1]})}}else{for(var j=0;j<d.length;j++){if(typeof(d[j][0])!="number"){check=false;break}}if(check){d.sort(function(a,b){return a[0]-b[0]})}}}}this.populatePlotData=function(series,index){this._plotData=[];this._stackData=[];series._stackData=[];series._plotData=[];var plotValues={x:[],y:[]};if(this.stackSeries&&!series.disableStack){series._stack=true;var sidx=series._stackAxis=='x'?0:1;var idx=sidx?0:1;var temp=$.extend(true,[],series.data);var plotdata=$.extend(true,[],series.data);for(var j=0;j<index;j++){var cd=this.series[j].data;for(var k=0;k<cd.length;k++){temp[k][0]+=cd[k][0];temp[k][1]+=cd[k][1];plotdata[k][sidx]+=cd[k][sidx]}}for(var i=0;i<plotdata.length;i++){plotValues.x.push(plotdata[i][0]);plotValues.y.push(plotdata[i][1])}this._plotData.push(plotdata);this._stackData.push(temp);series._stackData=temp;series._plotData=plotdata;series._plotValues=plotValues}else{for(var i=0;i<series.data.length;i++){plotValues.x.push(series.data[i][0]);plotValues.y.push(series.data[i][1])}this._stackData.push(series.data);this.series[index]._stackData=series.data;this._plotData.push(series.data);series._plotData=series.data;series._plotValues=plotValues}if(index>0){series._prevPlotData=this.series[index-1]._plotData}series._sumy=0;series._sumx=0;for(i=series.data.length-1;i>-1;i--){series._sumy+=series.data[i][1];series._sumx+=series.data[i][0]}};this.getNextSeriesColor=(function(t){var idx=0;var sc=t.seriesColors;return function(){if(idx<sc.length){return sc[idx++]}else{idx=0;return sc[idx++]}}})(this);this.parseOptions=function(options){for(var i=0;i<$.jqplot.preParseOptionsHooks.length;i++){$.jqplot.preParseOptionsHooks[i].call(this,options)}this.options=$.extend(true,{},this.defaults,options);this.stackSeries=this.options.stackSeries;if(this.options.seriesColors){this.seriesColors=this.options.seriesColors}var cg=new this.colorGenerator(this.seriesColors);$.extend(true,this._gridPadding,this.options.gridPadding);this.sortData=(this.options.sortData!=null)?this.options.sortData:this.sortData;for(var n in this.axes){var axis=this.axes[n];$.extend(true,axis,this.options.axesDefaults,this.options.axes[n]);axis._plotWidth=this._width;axis._plotHeight=this._height}if(this.data.length==0){this.data=[];for(var i=0;i<this.options.series.length;i++){this.data.push(this.options.series.data)}}var normalizeData=function(data,dir){var temp=[];var i;dir=dir||'vertical';if(!(data[0]instanceof Array)){for(var i=0;i<data.length;i++){if(dir=='vertical'){temp.push([i+1,data[i]])}else{temp.push([data[i],i+1])}}}else{$.extend(true,temp,data)}return temp};for(var i=0;i<this.data.length;i++){var temp=new Series();for(var j=0;j<$.jqplot.preParseSeriesOptionsHooks.length;j++){$.jqplot.preParseSeriesOptionsHooks[j].call(temp,this.options.seriesDefaults,this.options.series[i])}$.extend(true,temp,{seriesColors:this.seriesColors,negativeSeriesColors:this.negativeSeriesColors},this.options.seriesDefaults,this.options.series[i]);var dir='vertical';if(temp.renderer.constructor==$.jqplot.barRenderer&&temp.rendererOptions&&temp.rendererOptions.barDirection=='horizontal'){dir='horizontal'}temp.data=normalizeData(this.data[i],dir);switch(temp.xaxis){case'xaxis':temp._xaxis=this.axes.xaxis;break;case'x2axis':temp._xaxis=this.axes.x2axis;break;default:break}temp._yaxis=this.axes[temp.yaxis];temp._xaxis._series.push(temp);temp._yaxis._series.push(temp);if(temp.show){temp._xaxis.show=true;temp._yaxis.show=true}if(!temp.color&&temp.show!=false){temp.color=cg.next()}if(!temp.label){temp.label='Series '+(i+1).toString()}this.series.push(temp);for(var j=0;j<$.jqplot.postParseSeriesOptionsHooks.length;j++){$.jqplot.postParseSeriesOptionsHooks[j].call(this.series[i],this.options.seriesDefaults,this.options.series[i])}}$.extend(true,this.grid,this.options.grid);for(var n in this.axes){var axis=this.axes[n];if(axis.borderWidth==null){axis.borderWidth=this.grid.borderWidth}if(axis.borderColor==null){if(n!='xaxis'&&n!='x2axis'&&axis.useSeriesColor===true&&axis.show){axis.borderColor=axis._series[0].color}else{axis.borderColor=this.grid.borderColor}}}if(typeof this.options.title=='string'){this.title.text=this.options.title}else if(typeof this.options.title=='object'){$.extend(true,this.title,this.options.title)}this.title._plotWidth=this._width;$.extend(true,this.legend,this.options.legend);for(var i=0;i<$.jqplot.postParseOptionsHooks.length;i++){$.jqplot.postParseOptionsHooks[i].call(this,options)}};this.replot=function(options){this.performOnPlot();var opts=(options!=undefined)?options:{};var clear=(opts.clear!=undefined)?opts.clear:true;var resetAxes=(opts.resetAxes!=undefined)?opts.resetAxes:false;this.target.trigger('jqplotPreReplot');if(clear){this.target.empty()}if(resetAxes){this.resetAxesScale(resetAxes)}this.reInitialize();this.draw();this.target.trigger('jqplotPostReplot');this.performAfterPlot()};this.redraw=function(clear){this.performOnPlot();clear=(clear!=null)?clear:true;this.target.trigger('jqplotPreRedraw');if(clear){this.target.empty()}for(var ax in this.axes){this.axes[ax]._ticks=[]}for(var i=0;i<this.series.length;i++){this.populatePlotData(this.series[i],i)}this._sumy=0;this._sumx=0;for(i=0;i<this.series.length;i++){this._sumy+=this.series[i]._sumy;this._sumx+=this.series[i]._sumx}this.draw();this.target.trigger('jqplotPostRedraw');this.performAfterPlot()};this.draw=function(){if(this.drawIfHidden||this.target.is(':visible')){this.target.trigger('jqplotPreDraw');var i;for(i=0;i<$.jqplot.preDrawHooks.length;i++){$.jqplot.preDrawHooks[i].call(this)}this.target.append(this.baseCanvas.createElement({left:0,right:0,top:0,bottom:0},'jqplot-base-canvas'));var bctx=this.baseCanvas.setContext();this.target.append(this.title.draw());this.title.pack({top:0,left:0});for(var name in this.axes){this.target.append(this.axes[name].draw(bctx));this.axes[name].set()}if(this.axes.yaxis.show){this._gridPadding.left=this.axes.yaxis.getWidth()}var ra=['y2axis','y3axis','y4axis','y5axis','y6axis','y7axis','y8axis','y9axis'];var rapad=[0,0,0,0];var gpr=0;var n,ax;for(n=8;n>0;n--){ax=this.axes[ra[n-1]];if(ax.show){rapad[n-1]=gpr;gpr+=ax.getWidth()}}if(gpr>this._gridPadding.right){this._gridPadding.right=gpr}if(this.title.show&&this.axes.x2axis.show){this._gridPadding.top=this.title.getHeight()+this.axes.x2axis.getHeight()}else if(this.title.show){this._gridPadding.top=this.title.getHeight()}else if(this.axes.x2axis.show){this._gridPadding.top=this.axes.x2axis.getHeight()}if(this.axes.xaxis.show){this._gridPadding.bottom=this.axes.xaxis.getHeight()}this.axes.xaxis.pack({position:'absolute',bottom:0,left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right});this.axes.yaxis.pack({position:'absolute',top:0,left:0,height:this._height},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top});this.axes.x2axis.pack({position:'absolute',top:this.title.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right});for(i=8;i>0;i--){this.axes[ra[i-1]].pack({position:'absolute',top:0,right:rapad[i-1]},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top})}this.target.append(this.grid.createElement(this._gridPadding));this.grid.draw();for(i=0;i<this.series.length;i++){this.target.append(this.series[i].shadowCanvas.createElement(this._gridPadding,'jqplot-series-canvas jqplot-shadow'));this.series[i].shadowCanvas.setContext()}for(i=0;i<this.series.length;i++){this.target.append(this.series[i].canvas.createElement(this._gridPadding,'jqplot-series-canvas'));this.series[i].canvas.setContext()}this.target.append(this.eventCanvas.createElement(this._gridPadding,'jqplot-event-canvas'));var ectx=this.eventCanvas.setContext();ectx.fillStyle='rgba(0,0,0,0)';ectx.fillRect(0,0,ectx.canvas.width,ectx.canvas.height);this.bindCustomEvents();if(this.legend.preDraw){this.target.append(this.legend.draw());this.legend.pack(this._gridPadding);if(this.legend._elem){this.drawSeries({legendInfo:{location:this.legend.location,width:this.legend.getWidth(),height:this.legend.getHeight(),xoffset:this.legend.xoffset,yoffset:this.legend.yoffset}})}else{this.drawSeries()}}else{this.drawSeries();$(this.series[this.series.length-1].canvas._elem).after(this.legend.draw());this.legend.pack(this._gridPadding)}for(var i=0;i<$.jqplot.eventListenerHooks.length;i++){var h=$.jqplot.eventListenerHooks[i];this.eventCanvas._elem.bind(h[0],{plot:this},h[1])}for(var i=0;i<$.jqplot.postDrawHooks.length;i++){$.jqplot.postDrawHooks[i].call(this)}if(this.target.is(':visible')){this._drawCount+=1}this.target.trigger('jqplotPostDraw',[this])}};this.bindCustomEvents=function(){this.eventCanvas._elem.bind('click',{plot:this},this.onClick);this.eventCanvas._elem.bind('dblclick',{plot:this},this.onDblClick);this.eventCanvas._elem.bind('mousedown',{plot:this},this.onMouseDown);this.eventCanvas._elem.bind('mouseup',{plot:this},this.onMouseUp);this.eventCanvas._elem.bind('mousemove',{plot:this},this.onMouseMove);this.eventCanvas._elem.bind('mouseenter',{plot:this},this.onMouseEnter);this.eventCanvas._elem.bind('mouseleave',{plot:this},this.onMouseLeave)};function getEventPosition(ev){var plot=ev.data.plot;var offsets=plot.eventCanvas._elem.offset();var gridPos={x:ev.pageX-offsets.left,y:ev.pageY-offsets.top};var dataPos={xaxis:null,yaxis:null,x2axis:null,y2axis:null,y3axis:null,y4axis:null,y5axis:null,y6axis:null,y7axis:null,y8axis:null,y9axis:null};var an=['xaxis','yaxis','x2axis','y2axis','y3axis','y4axis','y5axis','y6axis','y7axis','y8axis','y9axis'];var ax=plot.axes;for(var n=11;n>0;n--){var axis=an[n-1];if(ax[axis].show){dataPos[axis]=ax[axis].series_p2u(gridPos[axis.charAt(0)])}}return({offsets:offsets,gridPos:gridPos,dataPos:dataPos})}function getNeighborPoint(plot,x,y){var ret=null;var s,i,d0,d,j,r;var threshold;for(var i=0;i<plot.series.length;i++){s=plot.series[i];r=s.renderer;if(s.show){threshold=Math.abs(s.markerRenderer.size/2+s.neighborThreshold);for(var j=0;j<s.gridData.length;j++){p=s.gridData[j];if(r.constructor==$.jqplot.OHLCRenderer){if(r.candleStick){var yp=s._yaxis.series_u2p;if(x>=p[0]-r._bodyWidth/2&&x<=p[0]+r._bodyWidth/2&&y>=yp(s.data[j][2])&&y<=yp(s.data[j][3])){ret={seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}}else if(!r.hlc){var yp=s._yaxis.series_u2p;if(x>=p[0]-r._tickLength&&x<=p[0]+r._tickLength&&y>=yp(s.data[j][2])&&y<=yp(s.data[j][3])){ret={seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}}else{var yp=s._yaxis.series_u2p;if(x>=p[0]-r._tickLength&&x<=p[0]+r._tickLength&&y>=yp(s.data[j][1])&&y<=yp(s.data[j][2])){ret={seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}}}else{d=Math.sqrt((x-p[0])*(x-p[0])+(y-p[1])*(y-p[1]));if(d<=threshold&&(d<=d0||d0==null)){d0=d;ret={seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]}}}}}}return ret}this.onClick=function(ev){var positions=getEventPosition(ev);var p=ev.data.plot;var neighbor=getNeighborPoint(p,positions.gridPos.x,positions.gridPos.y);ev.data.plot.eventCanvas._elem.trigger('jqplotClick',[positions.gridPos,positions.dataPos,neighbor,p])};this.onDblClick=function(ev){var positions=getEventPosition(ev);var p=ev.data.plot;var neighbor=getNeighborPoint(p,positions.gridPos.x,positions.gridPos.y);ev.data.plot.eventCanvas._elem.trigger('jqplotDblClick',[positions.gridPos,positions.dataPos,neighbor,p])};this.onMouseDown=function(ev){var positions=getEventPosition(ev);var p=ev.data.plot;var neighbor=getNeighborPoint(p,positions.gridPos.x,positions.gridPos.y);ev.data.plot.eventCanvas._elem.trigger('jqplotMouseDown',[positions.gridPos,positions.dataPos,neighbor,p])};this.onMouseUp=function(ev){var positions=getEventPosition(ev);ev.data.plot.eventCanvas._elem.trigger('jqplotMouseUp',[positions.gridPos,positions.dataPos,null,ev.data.plot])};this.onMouseMove=function(ev){var positions=getEventPosition(ev);var p=ev.data.plot;var neighbor=getNeighborPoint(p,positions.gridPos.x,positions.gridPos.y);ev.data.plot.eventCanvas._elem.trigger('jqplotMouseMove',[positions.gridPos,positions.dataPos,neighbor,p])};this.onMouseEnter=function(ev){var positions=getEventPosition(ev);var p=ev.data.plot;ev.data.plot.eventCanvas._elem.trigger('jqplotMouseEnter',[positions.gridPos,positions.dataPos,null,p])};this.onMouseLeave=function(ev){var positions=getEventPosition(ev);var p=ev.data.plot;ev.data.plot.eventCanvas._elem.trigger('jqplotMouseLeave',[positions.gridPos,positions.dataPos,null,p])};this.drawSeries=function(options,idx){var i,series,ctx;if(idx!=undefined){series=this.series[idx];ctx=series.shadowCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);series.drawShadow(ctx,options,this);ctx=series.canvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);series.draw(ctx,options,this)}else{for(i=0;i<this.series.length;i++){series=this.series[i];ctx=series.shadowCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);series.drawShadow(ctx,options,this);ctx=series.canvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);series.draw(ctx,options,this)}}}}$.jqplot.ColorGenerator=function(colors){var idx=0;this.next=function(){if(idx<colors.length){return colors[idx++]}else{idx=0;return colors[idx++]}};this.previous=function(){if(idx>0){return colors[idx--]}else{idx=colors.length-1;return colors[idx]}};this.get=function(i){return colors[i]};this.setColors=function(c){colors=c};this.reset=function(){idx=0}};$.jqplot.hex2rgb=function(h,a){h=h.replace('#','');if(h.length==3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]}var rgb;rgb='rgba('+parseInt(h.slice(0,2),16)+', '+parseInt(h.slice(2,4),16)+', '+parseInt(h.slice(4,6),16);if(a){rgb+=', '+a}rgb+=')';return rgb};$.jqplot.rgb2hex=function(s){var pat=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/;var m=s.match(pat);var h='#';for(i=1;i<4;i++){var temp;if(m[i].search(/%/)!=-1){temp=parseInt(255*m[i]/100,10).toString(16);if(temp.length==1){temp='0'+temp}}else{temp=parseInt(m[i],10).toString(16);if(temp.length==1){temp='0'+temp}}h+=temp}return h};$.jqplot.normalize2rgb=function(s,a){if(s.search(/^ *rgba?\(/)!=-1){return s}else if(s.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/)!=-1){return $.jqplot.hex2rgb(s,a)}else{throw'invalid color spec';}};$.jqplot.getColorComponents=function(s){var rgb=$.jqplot.normalize2rgb(s);var pat=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/;var m=rgb.match(pat);var ret=[];for(i=1;i<4;i++){if(m[i].search(/%/)!=-1){ret[i-1]=parseInt(255*m[i]/100,10)}else{ret[i-1]=parseInt(m[i],10)}}ret[3]=parseFloat(m[4])?parseFloat(m[4]):1.0;return ret};$.jqplot.log=function(){if(window.console&&$.jqplot.debug){if(arguments.length==1){console.log(arguments[0])}else{console.log(arguments)}}};var log=$.jqplot.log;$.jqplot.AxisLabelRenderer=function(options){$.jqplot.ElemContainer.call(this);this.axis;this.show=true;this.label='';this._elem;this.escapeHTML=false;$.extend(true,this,options)};$.jqplot.AxisLabelRenderer.prototype=new $.jqplot.ElemContainer();$.jqplot.AxisLabelRenderer.prototype.constructor=$.jqplot.AxisLabelRenderer;$.jqplot.AxisLabelRenderer.prototype.init=function(options){$.extend(true,this,options)};$.jqplot.AxisLabelRenderer.prototype.draw=function(){this._elem=$('<div style="position:absolute;" class="jqplot-'+this.axis+'-label"></div>');if(Number(this.label)){this._elem.css('white-space','nowrap')}if(!this.escapeHTML){this._elem.html(this.label)}else{this._elem.text(this.label)}return this._elem};$.jqplot.AxisLabelRenderer.prototype.pack=function(){};$.jqplot.AxisTickRenderer=function(options){$.jqplot.ElemContainer.call(this);this.mark='outside';this.axis;this.showDate=false;this.showMark=true;this.showGridline=true;this.isMinorTick=false;this.size=4;this.markSize=6;this.show=true;this.showLabel=true;this.label='';this.value=null;this._styles={};this.formatter=$.jqplot.DefaultTickFormatter;this.formatString='';this.fontFamily;this.fontSize;this.textColor;this._elem;$.extend(true,this,options)};$.jqplot.AxisTickRenderer.prototype.init=function(options){$.extend(true,this,options)};$.jqplot.AxisTickRenderer.prototype=new $.jqplot.ElemContainer();$.jqplot.AxisTickRenderer.prototype.constructor=$.jqplot.AxisTickRenderer;$.jqplot.AxisTickRenderer.prototype.setTick=function(value,axisName,isMinor){this.value=value;this.axis=axisName;this.showDate=(arguments.length==4&&arguments[3]);if(isMinor){this.isMinorTick=true}return this};$.jqplot.AxisTickRenderer.prototype.draw=function(){if(!this.label){this.label=this.formatter(this.formatString,this.value,this.showDate)}style='style="position:absolute;';if(Number(this.label)){style+='white-space:nowrap;'}style+='"';if(this.axis==='yaxis'){var nTotal=parseFloat(this.label);var prec=MP_Util.CalculatePrecision(nTotal);var nf=MP_Util.GetNumericFormatter();var tempVal=nf.format(nTotal,"^."+prec);this.label=tempVal+=''}this._elem=$('<div '+style+' class="jqplot-'+this.axis+'-tick">'+this.label+'</div>');for(var s in this._styles){this._elem.css(s,this._styles[s])}if(this.fontFamily){this._elem.css('font-family',this.fontFamily)}if(this.fontSize){this._elem.css('font-size',this.fontSize)}if(this.textColor){this._elem.css('color',this.textColor)}return this._elem};$.jqplot.DefaultTickFormatter=function(format,val){if(typeof val=='number'){if(!format){format='%.1f'}return $.jqplot.sprintf(format,val)}else{return String(val)}};$.jqplot.AxisTickRenderer.prototype.pack=function(){};$.jqplot.CanvasGridRenderer=function(){this.shadowRenderer=new $.jqplot.ShadowRenderer()};$.jqplot.CanvasGridRenderer.prototype.init=function(options){this._ctx;$.extend(true,this,options);var sopts={lineJoin:'miter',lineCap:'round',fill:false,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.shadowWidth,closePath:false};this.renderer.shadowRenderer.init(sopts)};$.jqplot.CanvasGridRenderer.prototype.createElement=function(){var elem=document.createElement('canvas');var w=this._plotDimensions.width;var h=this._plotDimensions.height;elem.width=w;elem.height=h;this._elem=$(elem);this._elem.addClass('jqplot-grid-canvas');this._elem.css({position:'absolute',left:0,top:0});if($.browser.msie){window.G_vmlCanvasManager.init_(document)}if($.browser.msie){elem=window.G_vmlCanvasManager.initElement(elem)}this._top=this._offsets.top;this._bottom=h-this._offsets.bottom;this._left=this._offsets.left;this._right=w-this._offsets.right;this._width=this._right-this._left;this._height=this._bottom-this._top;return this._elem};$.jqplot.CanvasGridRenderer.prototype.draw=function(){this._ctx=this._elem.get(0).getContext("2d");var ctx=this._ctx;var axes=this._axes;ctx.save();ctx.fillStyle=this.background;ctx.fillRect(this._left,this._top,this._width,this._height);if(this.drawGridlines){ctx.save();ctx.lineJoin='miter';ctx.lineCap='butt';ctx.lineWidth=this.gridLineWidth;ctx.strokeStyle=this.gridLineColor;var b,e;var ax=['xaxis','yaxis','x2axis','y2axis'];for(var i=4;i>0;i--){var name=ax[i-1];var axis=axes[name];var ticks=axis._ticks;var tickWeight=(axis.tickOptions.weight?axis.tickOptions.weight:this.gridLineWidth);var tickColor=(axis.tickOptions.color?axis.tickOptions.color:this.gridLineColor);if(axis.show){for(var j=ticks.length;j>0;j--){var t=ticks[j-1];if(t.show){var pos=Math.round(axis.u2p(t.value))+0.5;switch(name){case'xaxis':if(t.showGridline){drawLine(pos,this._top,pos,this._bottom)}if(t.showMark&&t.mark){s=t.markSize;m=t.mark;var pos=Math.round(axis.u2p(t.value))+0.5;switch(m){case'outside':b=this._bottom;e=this._bottom+s;break;case'inside':b=this._bottom-s;e=this._bottom;break;case'cross':b=this._bottom-s;e=this._bottom+s;break;default:b=this._bottom;e=this._bottom+s;break}if(this.shadow){this.renderer.shadowRenderer.draw(ctx,[[pos,b],[pos,e]],{lineCap:'butt',lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}ctx.lineWidth=tickWeight;ctx.strokeStyle=tickColor;drawLine(pos,b,pos,e);ctx.lineWidth=this.gridLineWidth;ctx.strokeStyle=this.gridLineColor}break;case'yaxis':if(t.showGridline){var gridLineStyle=axis.tickOptions.gridStyle;if((!gridLineStyle)||gridLineStyle==='solid'){drawLine(this._right,pos,this._left,pos)}else{drawDashedLine(this._right,pos,this._left,pos)}}if(t.showMark&&t.mark){s=t.markSize;m=t.mark;var pos=Math.round(axis.u2p(t.value))+0.5;switch(m){case'outside':b=this._left-s;e=this._left;break;case'inside':b=this._left;e=this._left+s;break;case'cross':b=this._left-s;e=this._left+s;break;default:b=this._left-s;e=this._left;break}if(this.shadow){this.renderer.shadowRenderer.draw(ctx,[[b,pos],[e,pos]],{lineCap:'butt',lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}ctx.lineWidth=tickWeight;ctx.strokeStyle=tickColor;drawLine(b,pos,e,pos,{strokeStyle:axis.borderColor});ctx.lineWidth=this.gridLineWidth;ctx.strokeStyle=this.gridLineColor}break;case'x2axis':if(t.showGridline){drawLine(pos,this._bottom,pos,this._top)}if(t.showMark&&t.mark){s=t.markSize;m=t.mark;var pos=Math.round(axis.u2p(t.value))+0.5;switch(m){case'outside':b=this._top-s;e=this._top;break;case'inside':b=this._top;e=this._top+s;break;case'cross':b=this._top-s;e=this._top+s;break;default:b=this._top-s;e=this._top;break}if(this.shadow){this.renderer.shadowRenderer.draw(ctx,[[pos,b],[pos,e]],{lineCap:'butt',lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}ctx.lineWidth=tickWeight;ctx.strokeStyle=tickColor;drawLine(pos,b,pos,e);ctx.lineWidth=this.gridLineWidth;ctx.strokeStyle=this.gridLineColor}ctx.lineWidth=1.0;break;case'y2axis':if(t.showGridline){drawLine(this._left,pos,this._right,pos)}if(t.showMark&&t.mark){s=t.markSize;m=t.mark;var pos=Math.round(axis.u2p(t.value))+0.5;switch(m){case'outside':b=this._right;e=this._right+s;break;case'inside':b=this._right-s;e=this._right;break;case'cross':b=this._right-s;e=this._right+s;break;default:b=this._right;e=this._right+s;break}if(this.shadow){this.renderer.shadowRenderer.draw(ctx,[[b,pos],[e,pos]],{lineCap:'butt',lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}ctx.lineWidth=tickWeight;ctx.strokeStyle=tickColor;drawLine(b,pos,e,pos,{strokeStyle:axis.borderColor});ctx.lineWidth=this.gridLineWidth;ctx.strokeStyle=this.gridLineColor}break;default:break}}}}}ax=['y3axis','y4axis','y5axis','y6axis','y7axis','y8axis','y9axis'];for(var i=7;i>0;i--){var axis=axes[ax[i-1]];var ticks=axis._ticks;if(axis.show){var tn=ticks[axis.numberTicks-1];var t0=ticks[0];var left=axis.getLeft();var points=[[left,tn.getTop()+tn.getHeight()/2],[left,t0.getTop()+t0.getHeight()/2+1.0]];if(this.shadow){this.renderer.shadowRenderer.draw(ctx,points,{lineCap:'butt',fill:false,closePath:false})}drawLine(points[0][0],points[0][1],points[1][0],points[1][1],{lineCap:'butt',strokeStyle:axis.borderColor,lineWidth:axis.borderWidth});for(var j=ticks.length;j>0;j--){var t=ticks[j-1];s=t.markSize;m=t.mark;var pos=Math.round(axis.u2p(t.value))+0.5;if(t.showMark&&t.mark){switch(m){case'outside':b=left;e=left+s;break;case'inside':b=left-s;e=left;break;case'cross':b=left-s;e=left+s;break;default:b=left;e=left+s;break}points=[[b,pos],[e,pos]];if(this.shadow){this.renderer.shadowRenderer.draw(ctx,points,{lineCap:'butt',lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}drawLine(b,pos,e,pos,{strokeStyle:axis.borderColor})}}}}ctx.restore()}function drawLine(bx,by,ex,ey,opts){ctx.save();opts=opts||{};$.extend(true,ctx,opts);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.stroke();ctx.restore()}function drawDashedLine(x2,y2,x1,y1,opts){var dashWidth=3;var incrementer=dashWidth*2;var i=x1;var il=x2-dashWidth;for(i;i<=il;i+=incrementer){ctx.beginPath();ctx.moveTo(i,y1);ctx.lineTo(i+dashWidth,y2);ctx.stroke();ctx.restore()}}if(this.shadow){var points=[[this._left,this._bottom],[this._right,this._bottom],[this._right,this._top]];this.renderer.shadowRenderer.draw(ctx,points)}drawLine(this._left,this._top,this._right,this._top,{lineCap:'round',strokeStyle:axes.x2axis.borderColor,lineWidth:axes.x2axis.borderWidth});drawLine(this._right,this._top,this._right,this._bottom,{lineCap:'round',strokeStyle:axes.y2axis.borderColor,lineWidth:axes.y2axis.borderWidth});drawLine(this._right,this._bottom,this._left,this._bottom,{lineCap:'round',strokeStyle:axes.xaxis.borderColor,lineWidth:axes.xaxis.borderWidth});drawLine(this._left,this._bottom,this._left,this._top,{lineCap:'round',strokeStyle:axes.yaxis.borderColor,lineWidth:axes.yaxis.borderWidth});ctx.restore()};var day=24*60*60*1000;var zeroPad=function(number,digits){number=String(number);while(number.length<digits){number='0'+number}return number};var multipliers={millisecond:1,second:1000,minute:60*1000,hour:60*60*1000,day:day,week:7*day,month:{add:function(d,number){multipliers.year.add(d,Math[number>0?'floor':'ceil'](number/12));var prevMonth=d.getMonth()+(number%12);if(prevMonth==12){prevMonth=0;d.setYear(d.getFullYear()+1)}else if(prevMonth==-1){prevMonth=11;d.setYear(d.getFullYear()-1)}d.setMonth(prevMonth)},diff:function(d1,d2){var diffYears=d1.getFullYear()-d2.getFullYear();var diffMonths=d1.getMonth()-d2.getMonth()+(diffYears*12);var diffDays=d1.getDate()-d2.getDate();return diffMonths+(diffDays/30)}},year:{add:function(d,number){d.setYear(d.getFullYear()+Math[number>0?'floor':'ceil'](number))},diff:function(d1,d2){return multipliers.month.diff(d1,d2)/12}}};for(var unit in multipliers){if(unit.substring(unit.length-1)!='s'){multipliers[unit+'s']=multipliers[unit]}}var format=function(d,code){if(Date.prototype.strftime.formatShortcuts[code]){return d.strftime(Date.prototype.strftime.formatShortcuts[code])}else{var getter=(Date.prototype.strftime.formatCodes[code]||'').split('.');var nbr=d['get'+getter[0]]?d['get'+getter[0]]():'';if(getter[1]){nbr=zeroPad(nbr,getter[1])}return nbr}};var instanceMethods={succ:function(unit){return this.clone().add(1,unit)},add:function(number,unit){var factor=multipliers[unit]||multipliers.day;if(typeof factor=='number'){this.setTime(this.getTime()+(factor*number))}else{factor.add(this,number)}return this},addNoDST:function(number,unit){var aVal=parseFloat(number);var rVal=null;switch(unit.toLowerCase()){case"second":case"seconds":this.setSeconds(this.getSeconds()+aVal);break;case"minute":case"minutes":this.setMinutes(this.getMinutes()+aVal);break;case"hour":case"hours":this.setHours(this.getHours()+aVal);break;case"day":case"days":this.setDate(this.getDate()+aVal);break;case"week":case"weeks":var daysFromWeek=aVal*7;this.setDate(this.getDate()+daysFromWeek);break;case"month":case"months":this.setMonth(this.getMonth()+aVal);break;case"year":case"years":this.setYear(this.getYear()+aVal);break;default:this.setMilliseconds(this.getMilliseconds()+aVal);break}return this},round:function(unit,option){if(unit!=null){switch(unit.toLowerCase()){case"seconds":this.setSeconds((option=="down")?0:60);this.setMilliseconds(0);break;case"minutes":this.setMinutes((option=="down")?0:60);this.setSeconds(0);this.setMilliseconds(0);break;case"hours":this.setHours((option=="down")?0:24);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);break;default:break}}return this},diff:function(dateObj,unit,allowDecimal){dateObj=Date.create(dateObj);if(dateObj===null){return null}var factor=multipliers[unit]||multipliers.day;if(typeof factor=='number'){var unitDiff=(this.getTime()-dateObj.getTime())/factor}else{var unitDiff=factor.diff(this,dateObj)}return(allowDecimal?unitDiff:Math[unitDiff>0?'floor':'ceil'](unitDiff))},strftime:function(formatStr){var source=formatStr||'%Y-%m-%d',result='',match;while(source.length>0){if(match=source.match(Date.prototype.strftime.formatCodes.matcher)){result+=source.slice(0,match.index);result+=(match[1]||'')+format(this,match[2]);source=source.slice(match.index+match[0].length)}else{result+=source;source=''}}return result},getShortYear:function(){return this.getYear()%100},getMonthNumber:function(){return this.getMonth()+1},getMonthName:function(){return Date.MONTHNAMES[this.getMonth()]},getAbbrMonthName:function(){return Date.ABBR_MONTHNAMES[this.getMonth()]},getDayName:function(){return Date.DAYNAMES[this.getDay()]},getAbbrDayName:function(){return Date.ABBR_DAYNAMES[this.getDay()]},getDayOrdinal:function(){return Date.ORDINALNAMES[this.getDate()%10]},getHours12:function(){var hours=this.getHours();return hours>12?hours-12:(hours==0?12:hours)},getAmPm:function(){return this.getHours()>=12?'PM':'AM'},getUnix:function(){return Math.round(this.getTime()/1000,0)},getGmtOffset:function(){var hours=this.getTimezoneOffset()/60;var prefix=hours<0?'+':'-';hours=Math.abs(hours);return prefix+zeroPad(Math.floor(hours),2)+':'+zeroPad((hours%1)*60,2)},getTimezoneName:function(){var match=/(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());return match[1]||match[2]||'GMT'+this.getGmtOffset()},toYmdInt:function(){return(this.getFullYear()*10000)+(this.getMonthNumber()*100)+this.getDate()},clone:function(){return new Date(this.getTime())}};for(var name in instanceMethods){Date.prototype[name]=instanceMethods[name]}var staticMethods={create:function(date){if(date instanceof Date){return date}if(typeof date=='number'){return new Date(date)}var parsable=String(date).replace(/^\s*(.+)\s*$/,'$1'),i=0,length=Date.create.patterns.length,pattern;var current=parsable;while(i<length){ms=Date.parse(current);if(!isNaN(ms)){return new Date(ms)}pattern=Date.create.patterns[i];if(typeof pattern=='function'){obj=pattern(current);if(obj instanceof Date){return obj}}else{current=parsable.replace(pattern[0],pattern[1])}i++}return NaN},MONTHNAMES:'January February March April May June July August September October November December'.split(' '),ABBR_MONTHNAMES:'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),DAYNAMES:'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),ABBR_DAYNAMES:'Sun Mon Tue Wed Thu Fri Sat'.split(' '),ORDINALNAMES:'th st nd rd th th th th th th'.split(' '),ISO:'%Y-%m-%dT%H:%M:%S.%N%G',SQL:'%Y-%m-%d %H:%M:%S',daysInMonth:function(year,month){if(month==2){return new Date(year,1,29).getDate()==29?29:28}return[undefined,31,undefined,31,30,31,30,31,31,30,31,30,31][month]}};for(var name in staticMethods){Date[name]=staticMethods[name]}Date.prototype.strftime.formatCodes={matcher:/()%(#?(%|[a-z]))/i,Y:'FullYear',y:'ShortYear.2',m:'MonthNumber.2','#m':'MonthNumber',B:'MonthName',b:'AbbrMonthName',d:'Date.2','#d':'Date',e:'Date',A:'DayName',a:'AbbrDayName',w:'Day',o:'DayOrdinal',H:'Hours.2','#H':'Hours',I:'Hours12.2','#I':'Hours12',p:'AmPm',M:'Minutes.2','#M':'Minutes',S:'Seconds.2','#S':'Seconds',s:'Unix',N:'Milliseconds.3','#N':'Milliseconds',O:'TimezoneOffset',Z:'TimezoneName',G:'GmtOffset'};Date.prototype.strftime.formatShortcuts={F:'%Y-%m-%d',T:'%H:%M:%S',X:'%H:%M:%S',x:'%m/%d/%y',D:'%m/%d/%y','#c':'%a %b %e %H:%M:%S %Y',v:'%e-%b-%Y',R:'%H:%M',r:'%I:%M:%S %p',t:'\t',n:'\n','%':'%'};Date.create.patterns=[[/-/g,'/'],[/st|nd|rd|th/g,''],[/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/,'$2/$1/$3'],[/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/,'$2/$3/$1'],function(str){var match=str.match(/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i);if(match){if(match[1]){var d=Date.create(match[1]);if(isNaN(d)){return}}else{var d=new Date();d.setMilliseconds(0)}var hour=parseFloat(match[2]);if(match[6]){hour=match[6].toLowerCase()=='am'?(hour==12?0:hour):(hour==12?12:hour+12)}d.setHours(hour,parseInt(match[3]||0,10),parseInt(match[4]||0,10),((parseFloat(match[5]||0))||0)*1000);return d}else{return str}},function(str){var match=str.match(/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i);if(match){if(match[1]){var d=Date.create(match[1]);if(isNaN(d)){return}}else{var d=new Date();d.setMilliseconds(0)}var hour=parseFloat(match[2]);d.setHours(hour,parseInt(match[3],10),parseInt(match[4],10),parseFloat(match[5])*1000);return d}else{return str}},function(str){var match=str.match(/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/);if(match){var d=new Date();var y=parseFloat(String(d.getFullYear()).slice(2,4));var cent=parseInt(String(d.getFullYear())/100,10)*100;var centoffset=1;var m1=parseFloat(match[1]);var m3=parseFloat(match[3]);var ny,nd,nm;if(m1>31){nd=match[3];if(m1<y+centoffset){ny=cent+m1}else{ny=cent-100+m1}}else{nd=match[1];if(m3<y+centoffset){ny=cent+m3}else{ny=cent-100+m3}}var nm=$.inArray(match[2],Date.ABBR_MONTHNAMES);if(nm==-1){nm=$.inArray(match[2],Date.MONTHNAMES)}d.setFullYear(ny,nm,nd);d.setHours(0,0,0,0);return d}else{return str}}];if($.jqplot.config.debug){$.date=Date.create}$.jqplot.DivTitleRenderer=function(){};$.jqplot.DivTitleRenderer.prototype.init=function(options){$.extend(true,this,options)};$.jqplot.DivTitleRenderer.prototype.draw=function(){var r=this.renderer;if(!this.text){this.show=false;this._elem=$('<div style="height:0px;width:0px;"></div>')}else if(this.text){var styletext='position:absolute;top:0px;left:0px;';styletext+=(this._plotWidth)?'width:'+this._plotWidth+'px;':'';styletext+=(this.fontFamily)?'font-family:'+this.fontFamily+';':'';styletext+=(this.fontSize)?'font-size:'+this.fontSize+';':'';styletext+=(this.textAlign)?'text-align:'+this.textAlign+';':'text-align:center;';styletext+=(this.textColor)?'color:'+this.textColor+';':'';this._elem=$('<div class="jqplot-title" style="'+styletext+'">'+this.text+'</div>')}return this._elem};$.jqplot.DivTitleRenderer.prototype.pack=function(){};$.jqplot.LineRenderer=function(){this.shapeRenderer=new $.jqplot.ShapeRenderer();this.shadowRenderer=new $.jqplot.ShadowRenderer()};$.jqplot.LineRenderer.prototype.init=function(options){$.extend(true,this.renderer,options);var opts={lineJoin:'round',lineCap:'round',fill:this.fill,isarc:false,strokeStyle:this.color,fillStyle:this.fillColor,lineWidth:this.lineWidth,closePath:this.fill};this.renderer.shapeRenderer.init(opts);if(this.lineWidth>2.5){var shadow_offset=this.shadowOffset*(1+(Math.atan((this.lineWidth/2.5))/0.785398163-1)*0.6)}else{var shadow_offset=this.shadowOffset*Math.atan((this.lineWidth/2.5))/0.785398163}var sopts={lineJoin:'round',lineCap:'round',fill:this.fill,isarc:false,angle:this.shadowAngle,offset:shadow_offset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.lineWidth,closePath:this.fill};this.renderer.shadowRenderer.init(sopts)};$.jqplot.LineRenderer.prototype.setGridData=function(plot){var xp=this._xaxis.series_u2p;var yp=this._yaxis.series_u2p;var data=this._plotData;var pdata=this._prevPlotData;this.gridData=[];this._prevGridData=[];for(var i=0;i<this.data.length;i++){if(data[i]!=null){this.gridData.push([xp.call(this._xaxis,data[i][0]),yp.call(this._yaxis,data[i][1])])}if(pdata[i]!=null){this._prevGridData.push([xp.call(this._xaxis,pdata[i][0]),yp.call(this._yaxis,pdata[i][1])])}}};$.jqplot.LineRenderer.prototype.makeGridData=function(data,plot){var xp=this._xaxis.series_u2p;var yp=this._yaxis.series_u2p;var gd=[];var pgd=[];for(var i=0;i<data.length;i++){if(data[i]!=null){gd.push([xp.call(this._xaxis,data[i][0]),yp.call(this._yaxis,data[i][1])])}}return gd};$.jqplot.LineRenderer.prototype.draw=function(ctx,gd,options){var i;var opts=(options!=undefined)?options:{};var shadow=(opts.shadow!=undefined)?opts.shadow:this.shadow;var showLine=(opts.showLine!=undefined)?opts.showLine:this.showLine;var fill=(opts.fill!=undefined)?opts.fill:this.fill;var fillAndStroke=(opts.fillAndStroke!=undefined)?opts.fillAndStroke:this.fillAndStroke;ctx.save();if(gd.length){if(showLine){if(fill){if(this.fillToZero){var negativeColors=new $.jqplot.ColorGenerator(this.negativeSeriesColors);var negativeColor=negativeColors.get(this.index);if(!this.useNegativeColors){negativeColor=opts.fillStyle}var isnegative=false;var posfs=opts.fillStyle;if(fillAndStroke){var fasgd=gd.slice(0)}if(this.index==0||!this._stack){var tempgd=[];var pyzero=this._yaxis.series_u2p(0);var pxzero=this._xaxis.series_u2p(0);if(this.fillAxis=='y'){tempgd.push([gd[0][0],pyzero]);for(var i=0;i<gd.length-1;i++){tempgd.push(gd[i]);if(this._plotData[i][1]*this._plotData[i+1][1]<0){if(this._plotData[i][1]<0){isnegative=true;opts.fillStyle=negativeColor}else{isnegative=false;opts.fillStyle=posfs}var xintercept=gd[i][0]+(gd[i+1][0]-gd[i][0])*(pyzero-gd[i][1])/(gd[i+1][1]-gd[i][1]);tempgd.push([xintercept,pyzero]);if(shadow){this.renderer.shadowRenderer.draw(ctx,tempgd,opts)}this.renderer.shapeRenderer.draw(ctx,tempgd,opts);tempgd=[[xintercept,pyzero]]}}if(this._plotData[gd.length-1][1]<0){isnegative=true;opts.fillStyle=negativeColor}else{isnegative=false;opts.fillStyle=posfs}tempgd.push(gd[gd.length-1]);tempgd.push([gd[gd.length-1][0],pyzero])}if(shadow){this.renderer.shadowRenderer.draw(ctx,tempgd,opts)}this.renderer.shapeRenderer.draw(ctx,tempgd,opts)}else{var prev=this._prevGridData;for(var i=prev.length;i>0;i--){gd.push(prev[i-1])}if(shadow){this.renderer.shadowRenderer.draw(ctx,gd,opts)}this.renderer.shapeRenderer.draw(ctx,gd,opts)}}else{if(fillAndStroke){var fasgd=gd.slice(0)}if(this.index==0||!this._stack){var gridymin=ctx.canvas.height;gd.unshift([gd[0][0],gridymin]);len=gd.length;gd.push([gd[len-1][0],gridymin])}else{var prev=this._prevGridData;for(var i=prev.length;i>0;i--){gd.push(prev[i-1])}}if(shadow){this.renderer.shadowRenderer.draw(ctx,gd,opts)}this.renderer.shapeRenderer.draw(ctx,gd,opts)}if(fillAndStroke){var fasopts=$.extend(true,{},opts,{fill:false,closePath:false});this.renderer.shapeRenderer.draw(ctx,fasgd,fasopts);if(this.markerRenderer.show){for(i=0;i<fasgd.length;i++){this.markerRenderer.draw(fasgd[i][0],fasgd[i][1],ctx,opts.markerOptions)}}}}else{if(shadow){this.renderer.shadowRenderer.draw(ctx,gd,opts)}this.renderer.shapeRenderer.draw(ctx,gd,opts)}}if(this.markerRenderer.show&&!fill){for(i=0;i<gd.length;i++){this.markerRenderer.draw(gd[i][0],gd[i][1],ctx,opts.markerOptions)}}}ctx.restore()};$.jqplot.LineRenderer.prototype.drawShadow=function(ctx,gd,options){};$.jqplot.LinearAxisRenderer=function(){};$.jqplot.LinearAxisRenderer.prototype.init=function(options){$.extend(true,this,options);var db=this._dataBounds;for(var i=0;i<this._series.length;i++){var s=this._series[i];var d=s._plotData;for(var j=0;j<d.length;j++){if(this.name=='xaxis'||this.name=='x2axis'){if(d[j][0]<db.min||db.min==null){db.min=d[j][0]}if(d[j][0]>db.max||db.max==null){db.max=d[j][0]}}else{if(d[j][1]<db.min||db.min==null){db.min=d[j][1]}if(d[j][1]>db.max||db.max==null){db.max=d[j][1]}}}}};$.jqplot.LinearAxisRenderer.prototype.draw=function(ctx){if(this.show){this.renderer.createTicks.call(this);var dim=0;var temp;this._elem=$('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');if(this.name=='xaxis'||this.name=='x2axis'){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var elem=this._label.draw(ctx);elem.appendTo(this._elem)}if(this.showTicks){var t=this._ticks;for(var i=0;i<t.length;i++){var tick=t[i];if(tick.showLabel&&(!tick.isMinorTick||this.showMinorTicks)){var elem=tick.draw(ctx);elem.appendTo(this._elem)}}}}return this._elem};$.jqplot.LinearAxisRenderer.prototype.reset=function(){this.min=this._min;this.max=this._max;this.tickInterval=this._tickInterval;this.numberTicks=this._numberTicks};$.jqplot.LinearAxisRenderer.prototype.set=function(){var dim=0;var temp;var w=0;var h=0;var lshow=(this._label==null)?false:this._label.show;if(this.show&&this.showTicks){var t=this._ticks;for(var i=0;i<t.length;i++){var tick=t[i];if(tick.showLabel&&(!tick.isMinorTick||this.showMinorTicks)){if(this.name=='xaxis'||this.name=='x2axis'){temp=tick._elem.outerHeight(true)}else{temp=tick._elem.outerWidth(true)}if(temp>dim){dim=temp}}}if(lshow){w=this._label._elem.outerWidth(true);h=this._label._elem.outerHeight(true)}if(this.name=='xaxis'){dim=dim+h;this._elem.css({'height':dim+'px',left:'0px',bottom:'0px'})}else if(this.name=='x2axis'){dim=dim+h;this._elem.css({'height':dim+'px',left:'0px',top:'0px'})}else if(this.name=='yaxis'){dim=dim+w;this._elem.css({'width':dim+'px',left:'0px',top:'0px'});if(lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer){this._label._elem.css('width',w+'px')}}else{dim=dim+w;this._elem.css({'width':dim+'px',right:'0px',top:'0px'});if(lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer){this._label._elem.css('width',w+'px')}}}};$.jqplot.LinearAxisRenderer.prototype.createTicks=function(){var ticks=this._ticks;var userTicks=this.ticks;var name=this.name;var db=this._dataBounds;var dim,interval;var min,max;var pos1,pos2;var tt,i;if(userTicks.length){for(i=0;i<userTicks.length;i++){var ut=userTicks[i];var t=new this.tickRenderer(this.tickOptions);if(ut.constructor==Array){t.value=ut[0];t.label=ut[1];if(!this.showTicks){t.showLabel=false;t.showMark=false}else if(!this.showTickMarks){t.showMark=false}t.setTick(ut[0],this.name);this._ticks.push(t)}else{t.value=ut;if(!this.showTicks){t.showLabel=false;t.showMark=false}else if(!this.showTickMarks){t.showMark=false}t.setTick(ut,this.name);this._ticks.push(t)}}this.numberTicks=userTicks.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value;this.tickInterval=(this.max-this.min)/(this.numberTicks-1)}else{if(name=='xaxis'||name=='x2axis'){dim=this._plotDimensions.width}else{dim=this._plotDimensions.height}if(!this.autoscale&&this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null}min=((this.min!=null)?this.min:db.min);max=((this.max!=null)?this.max:db.max);if(min==max){var adj=0.05;if(min>0){adj=Math.max(Math.log(min)/Math.LN10,0.05)}min-=adj;max+=adj}var range=max-min;var rmin,rmax;var temp;if(this.autoscale&&this.min==null&&this.max==null){var rrange,ti,margin;var forceMinZero=false;var forceZeroLine=false;var intervals={min:null,max:null,average:null,stddev:null};for(var i=0;i<this._series.length;i++){var s=this._series[i];var faname=(s.fillAxis=='x')?s._xaxis.name:s._yaxis.name;if(this.name==faname){var vals=s._plotValues[s.fillAxis];var vmin=vals[0];var vmax=vals[0];for(var j=1;j<vals.length;j++){if(vals[j]<vmin){vmin=vals[j]}else if(vals[j]>vmax){vmax=vals[j]}}var dp=(vmax-vmin)/vmax;if(s.renderer.constructor==$.jqplot.BarRenderer){if(vmin>=0&&(s.fillToZero||dp>0.1)){forceMinZero=true}else{forceMinZero=false;if(s.fill&&s.fillToZero&&vmin<0&&vmax>0){forceZeroLine=true}else{forceZeroLine=false}}}else if(s.fill){if(vmin>=0&&(s.fillToZero||dp>0.1)){forceMinZero=true}else if(vmin<0&&vmax>0&&s.fillToZero){forceMinZero=false;forceZeroLine=true}else{forceMinZero=false;forceZeroLine=false}}else if(vmin<0){forceMinZero=false}}}if(forceMinZero){this.numberTicks=2+Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);this.min=0;ti=max/(this.numberTicks-1);temp=Math.pow(10,Math.abs(Math.floor(Math.log(ti)/Math.LN10)));if(ti/temp==parseInt(ti/temp,10)){ti+=temp}this.tickInterval=Math.ceil(ti/temp)*temp;this.max=this.tickInterval*(this.numberTicks-1)}else if(forceZeroLine){this.numberTicks=2+Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);var ntmin=Math.ceil(Math.abs(min)/range*(this.numberTicks-1));var ntmax=this.numberTicks-1-ntmin;ti=Math.max(Math.abs(min/ntmin),Math.abs(max/ntmax));temp=Math.pow(10,Math.abs(Math.floor(Math.log(ti)/Math.LN10)));this.tickInterval=Math.ceil(ti/temp)*temp;this.max=this.tickInterval*ntmax;this.min=-this.tickInterval*ntmin}else{if(this.numberTicks==null){if(this.tickInterval){this.numberTicks=3+Math.ceil(range/this.tickInterval)}else{this.numberTicks=2+Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing)}}if(this.tickInterval==null){ti=range/(this.numberTicks-1);if(ti<1){temp=Math.pow(10,Math.abs(Math.floor(Math.log(ti)/Math.LN10)))}else{temp=1}this.tickInterval=Math.ceil(ti*temp*this.pad)/temp}else{temp=1/this.tickInterval}rrange=this.tickInterval*(this.numberTicks-1);margin=(rrange-range)/2;if(this.min==null){this.min=Math.floor(temp*(min-margin))/temp}if(this.max==null){this.max=this.min+rrange}}}else{rmin=(this.min!=null)?this.min:min-range*(this.padMin-1);rmax=(this.max!=null)?this.max:max+range*(this.padMax-1);this.min=rmin;this.max=rmax;range=this.max-this.min;if(this.numberTicks==null){if(this.tickInterval!=null){this.numberTicks=Math.ceil((this.max-this.min)/this.tickInterval)+1;this.max=this.min+this.tickInterval*(this.numberTicks-1)}else if(dim>100){this.numberTicks=parseInt(3+(dim-100)/75,10)}else{this.numberTicks=2}}if(this.tickInterval==null){this.tickInterval=range/(this.numberTicks-1)}}for(var i=0;i<this.numberTicks;i++){tt=this.min+i*this.tickInterval;var t=new this.tickRenderer(this.tickOptions);if(!this.showTicks){t.showLabel=false;t.showMark=false}else if(!this.showTickMarks){t.showMark=false}t.setTick(tt,this.name);this._ticks.push(t)}}};$.jqplot.LinearAxisRenderer.prototype.pack=function(pos,offsets){var ticks=this._ticks;var max=this.max;var min=this.min;var offmax=offsets.max;var offmin=offsets.min;var lshow=(this._label==null)?false:this._label.show;for(var p in pos){this._elem.css(p,pos[p])}this._offsets=offsets;var pixellength=offmax-offmin;var unitlength=max-min;this.p2u=function(p){return(p-offmin)*unitlength/pixellength+min};this.u2p=function(u){return(u-min)*pixellength/unitlength+offmin};if(this.name=='xaxis'||this.name=='x2axis'){this.series_u2p=function(u){return(u-min)*pixellength/unitlength};this.series_p2u=function(p){return p*unitlength/pixellength+min}}else{this.series_u2p=function(u){return(u-max)*pixellength/unitlength};this.series_p2u=function(p){return p*unitlength/pixellength+max}}if(this.show){if(this.name=='xaxis'||this.name=='x2axis'){for(i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){var temp=(this.name=='xaxis')?1:-1;switch(t.labelPosition){case'auto':if(temp*t.angle<0){shim=-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2}else{shim=-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2}break;case'end':shim=-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;case'start':shim=-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;break;case'middle':shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;default:shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break}}else{shim=-t.getWidth()/2}var val=this.u2p(t.value)+shim+'px';t._elem.css('left',val);t.pack()}}if(lshow){var w=this._label._elem.outerWidth(true);this._label._elem.css('left',offmin+pixellength/2-w/2+'px');if(this.name=='xaxis'){this._label._elem.css('bottom','0px')}else{this._label._elem.css('top','0px')}this._label.pack()}}else{for(i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){var temp=(this.name=='yaxis')?1:-1;switch(t.labelPosition){case'auto':case'end':if(temp*t.angle<0){shim=-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2}else{shim=-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2}break;case'start':if(t.angle>0){shim=-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2}else{shim=-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2}break;case'middle':shim=-t.getHeight()/2;break;default:shim=-t.getHeight()/2;break}}else{shim=-t.getHeight()/2}var val=this.u2p(t.value)+shim+'px';t._elem.css('top',val);t.pack()}}if(lshow){var h=this._label._elem.outerHeight(true);this._label._elem.css('top',offmax-pixellength/2-h/2+'px');if(this.name=='yaxis'){this._label._elem.css('left','0px')}else{this._label._elem.css('right','0px')}this._label.pack()}}}};$.jqplot.MarkerRenderer=nMarkerRenderer;$.jqplot.ShadowRenderer=nShadowRenderer;$.jqplot.ShapeRenderer=nShapeRenderer;$.jqplot.TableLegendRenderer=function(){};$.jqplot.TableLegendRenderer.prototype.init=function(options){$.extend(true,this,options)};$.jqplot.TableLegendRenderer.prototype.addrow=function(label,color,pad){var rs=(pad)?this.rowSpacing:'0';var tr=$('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);$('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+'<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+'</div></td>').appendTo(tr);var elem=$('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');elem.appendTo(tr);if(this.escapeHtml){elem.text(label)}else{elem.html(label)}};$.jqplot.TableLegendRenderer.prototype.draw=function(){var legend=this;if(this.show){var series=this._series;var ss='position:absolute;';ss+=(this.background)?'background:'+this.background+';':'';ss+=(this.border)?'border:'+this.border+';':'';ss+=(this.fontSize)?'font-size:'+this.fontSize+';':'';ss+=(this.fontFamily)?'font-family:'+this.fontFamily+';':'';ss+=(this.textColor)?'color:'+this.textColor+';':'';this._elem=$('<table class="jqplot-table-legend" style="'+ss+'"></table>');var pad=false;for(var i=0;i<series.length;i++){s=series[i];if(s.show&&s.showLabel){var lt=s.label.toString();if(lt){var color=s.color;if(s._stack&&!s.fill){color=''}this.renderer.addrow.call(this,lt,color,pad);pad=true}for(var j=0;j<$.jqplot.addLegendRowHooks.length;j++){var item=$.jqplot.addLegendRowHooks[j].call(this,s);if(item){this.renderer.addrow.call(this,item.label,item.color,pad);pad=true}}}}}return this._elem};$.jqplot.TableLegendRenderer.prototype.pack=function(offsets){if(this.show){var grid={_top:offsets.top,_left:offsets.left,_right:offsets.right,_bottom:this._plotDimensions.height-offsets.bottom};switch(this.location){case'nw':var a=grid._left+this.xoffset;var b=grid._top+this.yoffset;this._elem.css('left',a);this._elem.css('top',b);break;case'n':var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2;var b=grid._top+this.yoffset;this._elem.css('left',a);this._elem.css('top',b);break;case'ne':var a=offsets.right+this.xoffset;var b=grid._top+this.yoffset;this._elem.css({right:a,top:b});break;case'e':var a=offsets.right+this.xoffset;var b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({right:a,top:b});break;case'se':var a=offsets.right+this.xoffset;var b=offsets.bottom+this.yoffset;this._elem.css({right:a,bottom:b});break;case's':var a=(offsets.left+(this._plotDimensions.width-offsets.right))/2-this.getWidth()/2;var b=offsets.bottom+this.yoffset;this._elem.css({left:a,bottom:b});break;case'sw':var a=grid._left+this.xoffset;var b=offsets.bottom+this.yoffset;this._elem.css({left:a,bottom:b});break;case'w':var a=grid._left+this.xoffset;var b=(offsets.top+(this._plotDimensions.height-offsets.bottom))/2-this.getHeight()/2;this._elem.css({left:a,top:b});break;default:var a=grid._right-this.xoffset;var b=grid._bottom+this.yoffset;this._elem.css({right:a,bottom:b});break}}};$.jqplot.sprintf=function(){function pad(str,len,chr,leftJustify){var padding=(str.length>=len)?'':Array(1+len-str.length>>>0).join(chr);return leftJustify?str+padding:padding+str}function justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace){var diff=minWidth-value.length;if(diff>0){var spchar=' ';if(htmlSpace){spchar='&nbsp;'}if(leftJustify||!zeroPad){value=pad(value,minWidth,spchar,leftJustify)}else{value=value.slice(0,prefix.length)+pad('',diff,'0',true)+value.slice(prefix.length)}}return value}function formatBaseX(value,base,prefix,leftJustify,minWidth,precision,zeroPad,htmlSpace){var number=value>>>0;prefix=prefix&&number&&{'2':'0b','8':'0','16':'0x'}[base]||'';value=prefix+pad(number.toString(base),precision||0,'0',false);return justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)}function formatString(value,leftJustify,minWidth,precision,zeroPad,htmlSpace){if(precision!=null){value=value.slice(0,precision)}return justify(value,'',leftJustify,minWidth,zeroPad,htmlSpace)}var a=arguments,i=0,format=a[i++];return format.replace($.jqplot.sprintf.regex,function(substring,valueIndex,flags,minWidth,_,precision,type){if(substring=='%%'){return'%'}var leftJustify=false,positivePrefix='',zeroPad=false,prefixBaseX=false,htmlSpace=false;for(var j=0;flags&&j<flags.length;j++)switch(flags.charAt(j)){case' ':positivePrefix=' ';break;case'+':positivePrefix='+';break;case'-':leftJustify=true;break;case'0':zeroPad=true;break;case'#':prefixBaseX=true;break;case'&':htmlSpace=true;break}if(!minWidth){minWidth=0}else if(minWidth=='*'){minWidth=+a[i++]}else if(minWidth.charAt(0)=='*'){minWidth=+a[minWidth.slice(1,-1)]}else{minWidth=+minWidth}if(minWidth<0){minWidth=-minWidth;leftJustify=true}if(!isFinite(minWidth)){throw new Error('$.jqplot.sprintf: (minimum-)width must be finite');}if(!precision){precision='fFeE'.indexOf(type)>-1?6:(type=='d')?0:void(0)}else if(precision=='*'){precision=+a[i++]}else if(precision.charAt(0)=='*'){precision=+a[precision.slice(1,-1)]}else{precision=+precision}var value=valueIndex?a[valueIndex.slice(0,-1)]:a[i++];switch(type){case's':{if(value==null){return''}return formatString(String(value),leftJustify,minWidth,precision,zeroPad,htmlSpace)}case'c':return formatString(String.fromCharCode(+value),leftJustify,minWidth,precision,zeroPad,htmlSpace);case'b':return formatBaseX(value,2,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case'o':return formatBaseX(value,8,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case'x':return formatBaseX(value,16,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case'X':return formatBaseX(value,16,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace).toUpperCase();case'u':return formatBaseX(value,10,prefixBaseX,leftJustify,minWidth,precision,zeroPad,htmlSpace);case'i':case'd':{var number=parseInt(+value,10);if(isNaN(number)){return''}var prefix=number<0?'-':positivePrefix;value=prefix+pad(String(Math.abs(number)),precision,'0',false);return justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)}case'e':case'E':case'f':case'F':case'g':case'G':{var number=+value;if(isNaN(number)){return''}var prefix=number<0?'-':positivePrefix;var method=['toExponential','toFixed','toPrecision']['efg'.indexOf(type.toLowerCase())];var textTransform=['toString','toUpperCase']['eEfFgG'.indexOf(type)%2];value=prefix+Math.abs(number)[method](precision);return justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)[textTransform]()}case'p':case'P':{var number=+value;if(isNaN(number)){return''}var prefix=number<0?'-':positivePrefix;var parts=String(Number(Math.abs(number)).toExponential()).split(/e|E/);var sd=(parts[0].indexOf('.')!=-1)?parts[0].length-1:parts[0].length;var zeros=(parts[1]<0)?-parts[1]-1:0;if(Math.abs(number)<1){if(sd+zeros<=precision){value=prefix+Math.abs(number).toPrecision(sd)}else{if(sd<=precision-1){value=prefix+Math.abs(number).toExponential(sd-1)}else{value=prefix+Math.abs(number).toExponential(precision-1)}}}else{var prec=(sd<=precision)?sd:precision;value=prefix+Math.abs(number).toPrecision(prec)}var textTransform=['toString','toUpperCase']['pP'.indexOf(type)%2];return justify(value,prefix,leftJustify,minWidth,zeroPad,htmlSpace)[textTransform]()}case'n':return'';default:return substring}})};$.jqplot.sprintf.regex=/%%|%(\d+\$)?([-+#0& ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g})(jQuery);function nMarkerRenderer(options){this.show=true;this.style='filledCircle';this.lineWidth=2;this.size=9.0;this.color='#666666';this.shadow=true;this.shadowAngle=45;this.shadowOffset=1;this.shadowDepth=3;this.shadowAlpha='0.07';this.shadowRenderer=new nShadowRenderer();this.shapeRenderer=new nShapeRenderer();this.image=null;this.draw=function(x,y,ctx,options){options=options||{};if(this.image){var xAdjust=0;var yAdjust=0;switch(this.image.halign){case'right':xAdjust=-16;break;case'center':xAdjust=-8;break}switch(this.image.valign){case'center':yAdjust=-8;break;case'bottom':yAdjust=-16;break}var img=new Image();img.onload=function(){ctx.drawImage(img,x+xAdjust,y+yAdjust,16,16)};img.src=this.image.source}else{switch(this.style){case'upVee':this.drawUpVee(x,y,ctx,false,options);break;case'downVee':this.drawDownVee(x,y,ctx,false,options);break;case'diamond':this.drawDiamond(x,y,ctx,false,options);break;case'filledDiamond':this.drawDiamond(x,y,ctx,true,options);break;case'star':this.drawStar(x,y,ctx,false,options);break;case'filledStar':this.drawStar(x,y,ctx,true,options);break;case'rectDiagRight':this.drawRectangleDiag(x,y,ctx,false,options,"r");break;case'filledRectDiagRight':this.drawRectangleDiag(x,y,ctx,true,options,"r");break;case'rectDiagLeft':this.drawRectangleDiag(x,y,ctx,false,options,"l");break;case'filledRectDiagLeft':this.drawRectangleDiag(x,y,ctx,true,options,"l");break;case'triangleRight':this.drawTriangle(x,y,ctx,false,options,"r");break;case'filledTriangleRight':this.drawTriangle(x,y,ctx,true,options,"r");break;case'triangleLeft':this.drawTriangle(x,y,ctx,false,options,"l");break;case'filledTriangleLeft':this.drawTriangle(x,y,ctx,true,options,"l");break;case'triangleUp':this.drawTriangle(x,y,ctx,false,options,"u");break;case'filledTriangleUp':this.drawTriangle(x,y,ctx,true,options,"u");break;case'triangleDown':this.drawTriangle(x,y,ctx,false,options,"d");break;case'filledTriangleDown':this.drawTriangle(x,y,ctx,true,options,"d");break;case'rectHorizontal':this.drawRectangle(x,y,ctx,false,options,"h");break;case'filledRectHorizontal':this.drawRectangle(x,y,ctx,true,options,"h");break;case'rectVertical':this.drawRectangle(x,y,ctx,false,options,"v");break;case'filledRectVertical':this.drawRectangle(x,y,ctx,true,options,"v");break;case'heart':this.drawHeart(x,y,ctx,false,options);break;case'filledHeart':this.drawHeart(x,y,ctx,true,options);break;case'circle':this.drawCircle(x,y,ctx,false,options);break;case'filledCircle':this.drawCircle(x,y,ctx,true,options);break;case'square':this.drawSquare(x,y,ctx,false,options);break;case'filledSquare':this.drawSquare(x,y,ctx,true,options);break;case'x':this.drawX(x,y,ctx,true,options);break;case'plus':this.drawPlus(x,y,ctx,true,options);break;case'dash':this.drawDash(x,y,ctx,true,options);break;default:this.drawDiamond(x,y,ctx,false,options);break}}};this.init=function(options){$.extend(true,this,options);var sdopt={angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,lineWidth:this.lineWidth,depth:this.shadowDepth,closePath:true};if(this.style.indexOf('filled')!=-1){sdopt.fill=true}if(this.style.indexOf('ircle')!=-1){sdopt.isarc=true;sdopt.closePath=false}this.shadowRenderer.init(sdopt);var shopt={fill:false,isarc:false,strokeStyle:this.color,fillStyle:this.color,lineWidth:this.lineWidth,closePath:true};if(this.style.indexOf('filled')!=-1){shopt.fill=true}if(this.style.indexOf('ircle')!=-1){shopt.isarc=true;shopt.closePath=false}this.shapeRenderer.init(shopt)};this.drawLine=function(x1,y1,x2,y2,ctx){ctx.save();ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=this.color;ctx.stroke();ctx.restore()};this.drawUpVee=function(x,y,ctx,fill,options){var stretch=1.2;var dx=this.size/1/stretch;var dy=this.size/1*stretch;var opts=$.extend(true,{},this.options,{closePath:false});var points=[[x+dx,y+dy],[x,y],[x-dx,y+dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points,{closePath:false})}this.shapeRenderer.draw(ctx,points,opts);ctx.restore()};this.drawDownVee=function(x,y,ctx,fill,options){var stretch=1.2;var dx=this.size/1/stretch;var dy=this.size/1*stretch;var opts=$.extend(true,{},this.options,{closePath:false});var points=[[x+dx,y-dy],[x,y],[x-dx,y-dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points,{closePath:false})}this.shapeRenderer.draw(ctx,points,opts);ctx.restore()};this.drawDiamond=function(x,y,ctx,fill,options){var stretch=1.2;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var points=[[x-dx,y],[x,y+dy],[x+dx,y],[x,y-dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawStar=function(x,y,ctx,fill,options){var stretch=1.2;var dx=this.size/2*stretch;var dy=0-(this.size/2*stretch);var dyE=0-(this.size/1.5*stretch);var points=[[x,y+dyE],[x+(dx/3),y+(dy/2)],[x+dx,y+(dy/2)],[x+(dx/2),y],[x+dx,y-dy],[x,y-(dy/2)],[x-dx,y-dy],[x-(dx/2),y],[x-dx,y+(dy/2)],[x-(dx/3),y+(dy/2)]];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawRectangleDiag=function(x,y,ctx,fill,options,direction){var stretch=1.2;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var points=null;switch(direction){case"l":points=[[x,y+dy],[x+dx,y+(dy/2)],[x,y-dx],[x-dx,y-(dy/2)]];break;default:points=[[x,y+dy],[x+dx,y-(dy/2)],[x,y-dx],[x-dx,y+(dy/2)]];break}if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawTriangle=function(x,y,ctx,fill,options,direction){var stretch=1.2;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var points=null;switch(direction){case"r":points=[[x+dx,y],[x-dx,y-dy],[x-dx,y+dx]];break;case"l":points=[[x-dx,y],[x+dx,y-dy],[x+dx,y+dx]];break;case"d":points=[[x,y+dy],[x-dx,y-dy],[x+dx,y-dx]];break;default:points=[[x,y-dy],[x-dx,y+dy],[x+dx,y+dx]];break}if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawRectangle=function(x,y,ctx,fill,options,direction){var stretch=1.2;var dx=this.size/2*stretch;var dy=this.size/2*stretch;switch(direction){case"v":dx=this.size/4*stretch;break;default:dy=this.size/4*stretch;break}var points=[[x-dx,y-dy],[x-dx,y+dy],[x+dx,y+dy],[x+dx,y-dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawHeart=function(x,y,ctx,fill,options){var stretch=1.5;var dx=this.size/2*stretch;var dy=0-(this.size/2*stretch);var points=[[x,y+(dy/2)],[x+(dx/3),y+dy],[x+dx,y+dy],[x+dx,y],[x,y-dy],[x-dx,y],[x-dx,y+dy],[x-(dx/3),y+dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawPlus=function(x,y,ctx,fill,options){var stretch=1.0;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var points1=[[x,y-dy],[x,y+dy]];var points2=[[x+dx,y],[x-dx,y]];var opts=$.extend(true,{},this.options,{closePath:false});if(this.shadow){this.shadowRenderer.draw(ctx,points1,{closePath:false});this.shadowRenderer.draw(ctx,points2,{closePath:false})}this.shapeRenderer.draw(ctx,points1,opts);this.shapeRenderer.draw(ctx,points2,opts);ctx.restore()};this.drawX=function(x,y,ctx,fill,options){var stretch=1.0;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var opts=$.extend(true,{},this.options,{closePath:false});var points1=[[x-dx,y-dy],[x+dx,y+dy]];var points2=[[x-dx,y+dy],[x+dx,y-dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points1,{closePath:false});this.shadowRenderer.draw(ctx,points2,{closePath:false})}this.shapeRenderer.draw(ctx,points1,opts);this.shapeRenderer.draw(ctx,points2,opts);ctx.restore()};this.drawDash=function(x,y,ctx,fill,options){var stretch=1.0;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var points=[[x-dx,y],[x+dx,y]];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawSquare=function(x,y,ctx,fill,options){var stretch=1.0;var dx=this.size/2*stretch;var dy=this.size/2*stretch;var points=[[x-dx,y-dy],[x-dx,y+dy],[x+dx,y+dy],[x+dx,y-dy]];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.drawCircle=function(x,y,ctx,fill,options){var radius=this.size/2;var end=2*Math.PI;var points=[x,y,radius,0,end,true];if(this.shadow){this.shadowRenderer.draw(ctx,points)}this.shapeRenderer.draw(ctx,points,options);ctx.restore()};this.init(options)}function nShadowRenderer(options){this.angle=45;this.offset=1;this.alpha=0.07;this.lineWidth=1.5;this.lineJoin='miter';this.lineCap='round';this.closePath=false;this.fill=false;this.depth=3;this.isarc=false;this.draw=function(ctx,points,options){ctx.save();var opts=(options!=null)?options:{};var fill=(opts.fill!=null)?opts.fill:this.fill;var closePath=(opts.closePath!=null)?opts.closePath:this.closePath;var offset=(opts.offset!=null)?opts.offset:this.offset;var alpha=(opts.alpha!=null)?opts.alpha:this.alpha;var depth=(opts.depth!=null)?opts.depth:this.depth;ctx.lineWidth=(opts.lineWidth!=null)?opts.lineWidth:this.lineWidth;ctx.lineJoin=(opts.lineJoin!=null)?opts.lineJoin:this.lineJoin;ctx.lineCap=(opts.lineCap!=null)?opts.lineCap:this.lineCap;ctx.strokeStyle='rgba(0,0,0,'+alpha+')';ctx.fillStyle='rgba(0,0,0,'+alpha+')';for(var j=0;j<depth;j++){ctx.translate(Math.cos(this.angle*Math.PI/180)*offset,Math.sin(this.angle*Math.PI/180)*offset);ctx.beginPath();if(this.isarc){try{ctx.arc(points[0],points[1],points[2],points[3],points[4],true)}catch(e){}}else{ctx.moveTo(points[0][0],points[0][1]);for(var i=1;i<points.length;i++){ctx.lineTo(points[i][0],points[i][1])}}if(closePath){ctx.closePath()}if(fill){ctx.fill()}else{ctx.stroke()}}ctx.restore()};this.init=function(options){$.extend(true,this,options)};$.extend(true,this,options)}function nShapeRenderer(options){this.lineWidth=1.5;this.lineJoin='miter';this.lineCap='round';this.closePath=false;this.fill=false;this.isarc=false;this.fillRect=false;this.strokeRect=false;this.clearRect=false;this.strokeStyle='#999999';this.fillStyle='#999999';this.draw=function(ctx,points,options){ctx.save();var opts=(options!=null)?options:{};var fill=(opts.fill!=null)?opts.fill:this.fill;var closePath=(opts.closePath!=null)?opts.closePath:this.closePath;var fillRect=(opts.fillRect!=null)?opts.fillRect:this.fillRect;var strokeRect=(opts.strokeRect!=null)?opts.strokeRect:this.strokeRect;var clearRect=(opts.clearRect!=null)?opts.clearRect:this.clearRect;var isarc=(opts.isarc!=null)?opts.isarc:this.isarc;ctx.lineWidth=opts.lineWidth||this.lineWidth;ctx.lineJoin=opts.lineJoing||this.lineJoin;ctx.lineCap=opts.lineCap||this.lineCap;ctx.strokeStyle=(opts.strokeStyle||opts.color)||this.strokeStyle;ctx.fillStyle=opts.fillStyle||this.fillStyle;ctx.beginPath();if(isarc){ctx.arc(points[0],points[1],points[2],points[3],points[4],true);if(closePath){ctx.closePath()}if(fill){ctx.fill()}else{ctx.stroke()}ctx.restore();return}else if(clearRect){ctx.clearRect(points[0],points[1],points[2],points[3]);ctx.restore();return}else if(fillRect||strokeRect){if(fillRect){ctx.fillRect(points[0],points[1],points[2],points[3])}if(strokeRect){ctx.strokeRect(points[0],points[1],points[2],points[3]);ctx.restore();return}}else{ctx.moveTo(points[0][0],points[0][1]);for(var i=1;i<points.length;i++){ctx.lineTo(points[i][0],points[i][1])}if(closePath){ctx.closePath()}if(fill){ctx.fill()}else{ctx.stroke()}}ctx.restore()};this.init=function(options){$.extend(true,this,options)};$.extend(true,this,options)}(function($){$.jqplot.DateAxisRenderer=function(){$.jqplot.LinearAxisRenderer.call(this)};$.jqplot.DateAxisRenderer.prototype=new $.jqplot.LinearAxisRenderer();$.jqplot.DateAxisRenderer.prototype.constructor=$.jqplot.DateAxisRenderer;$.jqplot.DateTickFormatter=function(format,val){if(!format){format='%Y/%m/%d'}return Date.create(val).strftime(format)};$.jqplot.DateTickFormatterSpecial=function(format,val,showDate){var iDate=Date.create(Math.abs(val));var curDtTm=new Date;curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);var nFormat="<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span><span class='jqplot-elem-hideOnHover nowTime'>%H:%M</span>";return iDate.strftime(nFormat)};$.jqplot.DateTickFormatterXSpecial=function(format,val,showDate){var iDate=Date.create(Math.abs(val));var curDtTm=new Date();curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);var nFormat=format;if(DAR_HELPERS.createdNow&&iDate.getTime()==curDtTm.getTime()){nFormat="<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>"}else if(showDate||(iDate.getMilliseconds()==0&&iDate.getSeconds()==0&&iDate.getMinutes()==0&&iDate.getHours()==0)){nFormat="<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M<br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-hideOnHover'>%#m/%#d/%y</span>"}else{nFormat="<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M"}return iDate.strftime(nFormat)};$.jqplot.DateTickFormatterX2Special=function(format,val,showDate){var iDate=Date.create(Math.abs(val));var df=MP_Util.GetDateFormatter();var iDate2=df.format(iDate,mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);var iDate4=df.format(iDate,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);var curDtTm=new Date();curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);var nFormat=format;if(DAR_HELPERS.createdNow&&iDate.getTime()==curDtTm.getTime()){nFormat="<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>"+iDate4+"&nbsp;%H:%M</span>"}else if(showDate||(iDate.getMilliseconds()==0&&iDate.getSeconds()==0&&iDate.getMinutes()==0&&iDate.getHours()==0)){nFormat="<span class='jqplot-elem-showOnHover'>"+iDate4+"</span><span class='jqplot-elem-hideOnHover'>"+iDate2+"</span><br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-showOnHover'>&nbsp;</span>%H:%M"}else{nFormat="<span class='jqplot-elem-showOnHover'>"+iDate4+"</span>&nbsp;<br class='jqplot-elem-hideOnHover'/>%H:%M"}return iDate.strftime(nFormat)};$.jqplot.DateTickFormatterYSpecial=function(format,val,showDate){var iDate=Date.create(Math.abs(val));var curDtTm=new Date();curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);var nFormat=format;if(DAR_HELPERS.createdNow&&iDate.getTime()==curDtTm.getTime()){nFormat="<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>"}else if(showDate||(iDate.getMilliseconds()==0&&iDate.getSeconds()==0&&iDate.getMinutes()==0&&iDate.getHours()==0)){nFormat="%#m/%#d/<span class='jqplot-elem-showOnHover'>%Y</span><span class='jqplot-elem-hideOnHover'>%y</span><br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-showOnHover'>&nbsp;</span>%H:%M"}else{nFormat="<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M"}return iDate.strftime(nFormat)};$.jqplot.DateAxisRenderer.prototype.init=function(options){this.daTickInterval=null;this._daTickInterval=null;$.extend(true,this,options);if(this.specialFormat&&this.specialFormatFlag!=null&&this.specialFormatFlag==1){this.tickOptions.formatter=$.jqplot.DateTickFormatterSpecial}else if(this.specialFormat&&this.name.match("xaxis")!=null){this.tickOptions.formatter=$.jqplot.DateTickFormatterXSpecial}else if(this.specialFormat&&this.name.match(/^x/)!=null){this.tickOptions.formatter=$.jqplot.DateTickFormatterX2Special}else if(this.specialFormat&&this.name.match(/^y/)!=null){this.tickOptions.formatter=$.jqplot.DateTickFormatterYSpecial}else{this.tickOptions.formatter=$.jqplot.DateTickFormatter}var db=this._dataBounds;for(var i=0;i<this._series.length;i++){var s=this._series[i];var d=s.data;var pd=s._plotData;var sd=s._stackData;for(var j=0;j<d.length;j++){if(this.name.match(/^x/)){d[j][0]=Date.create(d[j][0]).getTime();pd[j][0]=Date.create(d[j][0]).getTime();sd[j][0]=Date.create(d[j][0]).getTime();if(d[j][0]<db.min||db.min==null){db.min=d[j][0]}if(d[j][0]>db.max||db.max==null){db.max=d[j][0]}}else{d[j][1]=Date.create(d[j][1]).getTime();pd[j][1]=Date.create(d[j][1]).getTime();sd[j][1]=Date.create(d[j][1]).getTime();if(d[j][1]<db.min||db.min==null){db.min=d[j][1]}if(d[j][1]>db.max||db.max==null){db.max=d[j][1]}}}}};$.jqplot.DateAxisRenderer.prototype.reset=function(){this.min=this._min;this.max=this._max;this.tickInterval=this._tickInterval;this.numberTicks=this._numberTicks;this.daTickInterval=this._daTickInterval;this.useDST=this._useDST;this.specialFormat=this._specialFormat;this.specialFormatFlag=this._specialFormatFlag};$.jqplot.DateAxisRenderer.prototype.createTicks=function(){var ticks=this._ticks;var userTicks=this.ticks;var name=this.name;var db=this._dataBounds;var midnightExists=false;var dim,interval;var min,max;var pos1,pos2;var tt,i;if(this.specialFormat){if(this.specialFormatFlag==null||this.specialFormatFlag!=1){var minDtTm=Date.create(this.min);var maxDtTm=Date.create(this.max);DAR_HELPERS.createdNow=true;var tickVals=DAR_HELPERS.DynamicRangeTickCalc(minDtTm.getTime(),maxDtTm.getTime());this.numberTicks=tickVals.length;userTicks=tickVals;midnightExists=false;for(var i=0;i<userTicks.length;i++){var tDate=Date.create(userTicks[i]);if(tDate.getMilliseconds()==0&&tDate.getSeconds()==0&&tDate.getMinutes()==0&&tDate.getHours()==0)midnightExists=true}this.min=tickVals[0];this.max=tickVals[tickVals.length-1];this.daTickInterval=[(this.max-this.min)/(this.numberTicks-1)/1000,'seconds']}else if(this.specialFormatFlag==1)userTicks=[new Date().getTime()];if(this.specialFormatFlag==2){var tempTicks=[],cDiffOpt=null,cDiff=null;for(var i=0;i<userTicks.length;i++){var t1Time=(userTicks[i].constructor==Array)?userTicks[i][0]:userTicks[i];if(i==0)tempTicks.push(t1Time);else{var t2Time=(userTicks[i-1].constructor==Array)?userTicks[i-1][0]:userTicks[i-1];cDiff=t1Time-t2Time;var t1Date=Date.create(t1Time),t2Date=Date.create(t2Time);eval(["t1Date.set",DAR_HELPERS.tickDiff[1],"(t1Date.get",DAR_HELPERS.tickDiff[1],"()-DAR_HELPERS.tickDiff[0]);"].join(""));if(t1Date.getTime()==t2Date.getTime()){tempTicks.push(Math.round(t2Time+(cDiff/2)));tempTicks.push(t1Time)}else{if(DAR_HELPERS.tickDiff[0]==1&&DAR_HELPERS.tickDiff[1]=="Date")t2Date.setHours(t2Date.getHours()+12);else if(DAR_HELPERS.tickDiff[0]==1&&DAR_HELPERS.tickDiff[1]=="Month")t2Date.setDate(t2Date.getDate()+15);else eval(["t2Date.set",DAR_HELPERS.tickDiff[1],"(t2Date.get",DAR_HELPERS.tickDiff[1],"()+Math.round(DAR_HELPERS.tickDiff[0]/2));"].join(""));var t2TempTime=t2Date.getTime();if(t2TempTime>=t1Time){tempTicks.push(t1Time)}else{tempTicks.push(t2TempTime);tempTicks.push(t1Time)}}}}userTicks=tempTicks;this.numberTicks=userTicks.length}}if(userTicks.length){for(i=0;i<userTicks.length;i++){var t=new this.tickRenderer(this.tickOptions);t.value=Date.create((userTicks[i].constructor==Array)?userTicks[i][0]:userTicks[i]).getTime();if(t.value>this.max)continue;t.label=(userTicks[i].constructor==Array)?userTicks[i][1]:null;var dateShown=false;if(this.specialFormat){if(i==0&&!midnightExists)dateShown=true;if(this.specialFormatFlag!=null&&this.specialFormatFlag==2){if(i==0||i==(userTicks.length-1)){t.showLabel=false;t.showGridline=false;t.showMark=false}else if((i%2)==0){t.showGridline=false;t.showLabel=true;t.showMark=false}else{t.showGridline=true;t.showLabel=false;t.showMark=true}}else if(userTicks.length>=2&&i==(userTicks.length-1)&&userTicks[userTicks.length-1]==this.max){var t1Date=Date.create((userTicks[i-1].constructor==Array)?userTicks[i-1][0]:userTicks[i-1]);var t2Date=Date.create((userTicks[i].constructor==Array)?userTicks[i][0]:userTicks[i]);eval(["t2Date.set",DAR_HELPERS.tickDiff[1],"(t2Date.get",DAR_HELPERS.tickDiff[1],"()-DAR_HELPERS.tickDiff[0]);"].join(""));if(t1Date.getTime()!=t2Date.getTime()){t.showLabel=false;t.showGridline=false;t.showMark=false}}}if(!this.showTicks){t.showLabel=false;t.showMark=false}else if(!this.showTickMarks){t.showMark=false}t.setTick(t.value,this.name,false,dateShown);this._ticks.push(t)}this.numberTicks=userTicks.length;if(!this.specialFormat){this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value}this.daTickInterval=[(this.max-this.min)/(this.numberTicks-1)/1000,'seconds']}else{if(name.match(/^x/)){dim=this._plotDimensions.width}else{dim=this._plotDimensions.height}if(this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null}if(this.tickInterval!=null){if(Number(this.tickInterval)){this.daTickInterval=[Number(this.tickInterval),'seconds']}else if(typeof this.tickInterval=="string"){var parts=this.tickInterval.split(' ');if(parts.length==1){this.daTickInterval=[1,parts[0]]}else if(parts.length==2){this.daTickInterval=[parts[0],parts[1]]}}}min=((this.min!=null)?Date.create(this.min).getTime():db.min);max=((this.max!=null)?Date.create(this.max).getTime():db.max);if(min==max){var adj=24*60*60*500;min-=adj;max+=adj}var range=max-min;var rmin,rmax;rmin=(this.min!=null)?Date.create(this.min).getTime():min-range/2*(this.padMin-1);rmax=(this.max!=null)?Date.create(this.max).getTime():max+range/2*(this.padMax-1);this.min=rmin;this.max=rmax;range=this.max-this.min;if(this.numberTicks==null){if(this.daTickInterval!=null){var nc=Date.create(this.max).diff(this.min,this.daTickInterval[1],true);this.numberTicks=Math.ceil(nc/this.daTickInterval[0])+1;this.max=Date.create(this.min).add((this.numberTicks-1)*this.daTickInterval[0],this.daTickInterval[1]).getTime()}else if(dim>200){this.numberTicks=parseInt(3+(dim-200)/100,10)}else{this.numberTicks=2}}if(this.daTickInterval==null){this.daTickInterval=[range/(this.numberTicks-1)/1000,'seconds']}for(var i=0;i<this.numberTicks;i++){var min=Date.create(this.min);if(this.useDST){tt=min.add(i*this.daTickInterval[0],this.daTickInterval[1]).getTime()}else{tt=min.addNoDST(i*this.daTickInterval[0],this.daTickInterval[1]).getTime()}var t=new this.tickRenderer(this.tickOptions);if(!this.showTicks){t.showLabel=false;t.showMark=false}else if(!this.showTickMarks){t.showMark=false}t.setTick(tt,this.name);this._ticks.push(t)}}if(this._daTickInterval==null){this._daTickInterval=this.daTickInterval}}})(jQuery);var DAR_HELPERS=function(){return{createdNow:false,tickDiff:null,minuteCntPerTickSpecial:0,DynamicRangeTickCalc:function(iMin,iMax){var unitSize={"second":1000,"minute":60*1000,"hour":60*60*1000,"day":24*60*60*1000,"month":30*24*60*60*1000,"year":365.2425*24*60*60*1000};var minDtTm=Date.create(iMin);var maxDtTm=Date.create(iMax);var dtTmDiff=iMax-iMin;var tickVals=[],curDtTm=new Date(),noNowTick=false;var minuteCnt=DAR_HELPERS.minuteCntPerTickSpecial;curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);if(minuteCnt>0){DAR_HELPERS.tickDiff=[minuteCnt,"Minutes"];if((maxDtTm.getMinutes()%minuteCnt)!=0||((maxDtTm.getMinutes()%minuteCnt)==0&&(maxDtTm.getSeconds()>0||maxDtTm.getMilliseconds()>0)))maxDtTm.setMinutes(maxDtTm.getMinutes()+(minuteCnt-(maxDtTm.getMinutes()%minuteCnt)));maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);tickVals.push(maxDtTm.getTime());DAR_HELPERS.createdNow=false;while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setMinutes(maxDtTm.getMinutes()-minuteCnt);tickVals.push(maxDtTm.getTime())}tickVals.reverse();return tickVals}else{if(dtTmDiff<=(2*unitSize["second"])){DAR_HELPERS.tickDiff=[250,"Milliseconds"];if((maxDtTm.getMilliseconds()%250)!=0)maxDtTm.setMilliseconds(maxDtTm.getMilliseconds()+(250-(maxDtTm.getMilliseconds()%250)));tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setMilliseconds(maxDtTm.getMilliseconds()-250);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else if(dtTmDiff<=((2*unitSize["minute"])+(15*unitSize["second"]))){DAR_HELPERS.tickDiff=[15,"Seconds"];if((maxDtTm.getSeconds()%15)!=0||((maxDtTm.getSeconds()%15)==0&&maxDtTm.getMilliseconds()>0))maxDtTm.setSeconds(maxDtTm.getSeconds()+(15-(maxDtTm.getSeconds()%15)));maxDtTm.setMilliseconds(0);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setSeconds(maxDtTm.getSeconds()-15);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else if(dtTmDiff<=((2*unitSize["hour"])+(15*unitSize["minute"]))){DAR_HELPERS.tickDiff=[15,"Minutes"];if((maxDtTm.getMinutes()%15)!=0||((maxDtTm.getMinutes()%15)==0&&(maxDtTm.getSeconds()>0||maxDtTm.getMilliseconds()>0)))maxDtTm.setMinutes(maxDtTm.getMinutes()+(15-(maxDtTm.getMinutes()%15)));maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setMinutes(maxDtTm.getMinutes()-15);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else if(dtTmDiff<=(unitSize["day"]+(2*unitSize["hour"]))){DAR_HELPERS.tickDiff=[2,"Hours"];if((maxDtTm.getHours()%2)!=0||((maxDtTm.getHours()%2)==0&&(maxDtTm.getMinutes()>0||maxDtTm.getSeconds()>0||maxDtTm.getMilliseconds()>0)))maxDtTm.setHours(maxDtTm.getHours()+(2-(maxDtTm.getHours()%2)));maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);maxDtTm.setMinutes(0);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setHours(maxDtTm.getHours()-2);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else if(dtTmDiff<=((2*unitSize["day"])+(4*unitSize["hour"]))){DAR_HELPERS.tickDiff=[4,"Hours"];if((maxDtTm.getHours()%4)!=0||((maxDtTm.getHours()%4)==0&&(maxDtTm.getMinutes()>0||maxDtTm.getSeconds()>0||maxDtTm.getMilliseconds()>0)))maxDtTm.setHours(maxDtTm.getHours()+(4-(maxDtTm.getHours()%4)));maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);maxDtTm.setMinutes(0);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setHours(maxDtTm.getHours()-4);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else if(dtTmDiff<=(15*unitSize["day"])){DAR_HELPERS.tickDiff=[1,"Date"];if(maxDtTm.getMilliseconds()>0||maxDtTm.getSeconds()>0||maxDtTm.getMinutes()>0||maxDtTm.getHours()>0)maxDtTm.setDate(maxDtTm.getDate()+1);maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);maxDtTm.setMinutes(0);maxDtTm.setHours(0);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setDate(maxDtTm.getDate()-1);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else if(dtTmDiff<=((2*unitSize["month"])+(7*unitSize["day"]))){DAR_HELPERS.tickDiff=[7,"Date"];if(maxDtTm.getMilliseconds()>0||maxDtTm.getSeconds()>0||maxDtTm.getMinutes()>0||maxDtTm.getHours()>0)maxDtTm.setDate(maxDtTm.getDate()+1);maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);maxDtTm.setMinutes(0);maxDtTm.setHours(0);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setDate(maxDtTm.getDate()-7);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}else{DAR_HELPERS.tickDiff=[1,"Month"];if(maxDtTm.getDate()>1||(maxDtTm.getDate()==1&&(maxDtTm.getMilliseconds()>0||maxDtTm.getSeconds()>0||maxDtTm.getMinutes()>0||maxDtTm.getHours()>0)))maxDtTm.setMonth(maxDtTm.getMonth()+1);maxDtTm.setMilliseconds(0);maxDtTm.setSeconds(0);maxDtTm.setMinutes(0);maxDtTm.setHours(0);maxDtTm.setDate(1);tickVals.push(maxDtTm.getTime());while(maxDtTm.getTime()>minDtTm.getTime()){maxDtTm.setMonth(maxDtTm.getMonth()-1);if(maxDtTm.getTime()==curDtTm.getTime())noNowTick=true;else if(!noNowTick&&!DAR_HELPERS.createdNow&&maxDtTm.getTime()<curDtTm.getTime()){DAR_HELPERS.createdNow=true;tickVals.push(curDtTm.getTime())}tickVals.push(maxDtTm.getTime())}}}tickVals.reverse();if(tickVals[tickVals.length-1]>new Date().getTime())tickVals[tickVals.length-1]=new Date().getTime();return tickVals}}}();(function($){$.jqplot.Cursor=function(options){this.style='default';this.previousCursor='auto';this.snapZoomTo=null;this.show=$.jqplot.config.enablePlugins;this.performOnZoom=function(plot){};this.performAfterZoom=function(plot){};this.showTooltip=true;this.followMouse=false;this.tooltipLocation='se';this.tooltipOffset=6;this.showTooltipGridPosition=false;this.showTooltipUnitPosition=true;this.showTooltipDataPosition=false;this.tooltipFormatString='%.4P, %.4P';this.useAxesFormatters=true;this.tooltipAxisGroups=[];this.zoom=false;this.zoomProxy=false;this.zoomOnController=false;this.zoomTarget=false;this.clickReset=false;this.dblClickReset=true;this.showVerticalLine=false;this.showHorizontalLine=false;this.constrainZoomTo='none';this.shapeRenderer=new $.jqplot.ShapeRenderer();this._zoom={start:[],end:[],started:false,zooming:false,isZoomed:false,axes:{start:{},end:{}}};this._tooltipElem;this.zoomCanvas;this.cursorCanvas;this.intersectionThreshold=2;this.showCursorLegend=false;this.cursorLegendFormatString=$.jqplot.Cursor.cursorLegendFormatString;$.extend(true,this,options)};$.jqplot.Cursor.cursorLegendFormatString='%s x:%s, y:%s';$.jqplot.Cursor.init=function(target,data,opts){var options=opts||{};this.plugins.cursor=new $.jqplot.Cursor(options.cursor);var c=this.plugins.cursor;if(c.show){$.jqplot.eventListenerHooks.push(['jqplotMouseEnter',handleMouseEnter]);$.jqplot.eventListenerHooks.push(['jqplotMouseLeave',handleMouseLeave]);$.jqplot.eventListenerHooks.push(['jqplotMouseMove',handleMouseMove]);if(c.showCursorLegend){opts.legend=opts.legend||{};opts.legend.renderer=$.jqplot.CursorLegendRenderer;opts.legend.formatString=this.plugins.cursor.cursorLegendFormatString;opts.legend.show=true}if(c.zoom){$.jqplot.eventListenerHooks.push(['jqplotMouseDown',handleMouseDown]);$.jqplot.eventListenerHooks.push(['jqplotMouseUp',handleMouseUp]);if(c.clickReset){$.jqplot.eventListenerHooks.push(['jqplotClick',handleClick])}if(c.dblClickReset){$.jqplot.eventListenerHooks.push(['jqplotDblClick',handleDblClick])}}this.resetZoom=function(){var axes=this.axes;if(!c.zoomProxy){for(var ax in axes){axes[ax].reset()}this.replot()}else{var ctx=this.plugins.cursor.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)}this.plugins.cursor._zoom.isZoomed=false;this.target.trigger('jqplotResetZoom',[this,this.plugins.cursor])};if(c.showTooltipDataPosition){c.showTooltipUnitPosition=false;c.showTooltipGridPosition=false;if(options.cursor.tooltipFormatString==undefined){c.tooltipFormatString=$.jqplot.Cursor.cursorLegendFormatString}}}};$.jqplot.Cursor.postDraw=function(){var c=this.plugins.cursor;c.zoomCanvas=new $.jqplot.GenericCanvas();this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding,'jqplot-zoom-canvas',this._plotDimensions));var zctx=c.zoomCanvas.setContext();c._tooltipElem=$('<div class="jqplot-cursor-tooltip" style="position:absolute;display:none"></div>');c.zoomCanvas._elem.before(c._tooltipElem);if(c.showVerticalLine||c.showHorizontalLine){c.cursorCanvas=new $.jqplot.GenericCanvas();this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding,'jqplot-cursor-canvas',this._plotDimensions));var zctx=c.cursorCanvas.setContext()}if(c.showTooltipUnitPosition){if(c.tooltipAxisGroups.length===0){var series=this.series;var s;var temp=[];for(var i=0;i<series.length;i++){s=series[i];var ax=s.xaxis+','+s.yaxis;if($.inArray(ax,temp)==-1){temp.push(ax)}}for(var i=0;i<temp.length;i++){c.tooltipAxisGroups.push(temp[i].split(','))}}}};$.jqplot.Cursor.zoomProxy=function(targetPlot,controllerPlot,zoomOnController){var tc=targetPlot.plugins.cursor;var cc=controllerPlot.plugins.cursor;cc.zoomOnController=zoomOnController;tc.zoomTarget=true;tc.zoom=true;tc.style='auto';tc.dblClickReset=false;cc.zoom=true;cc.zoomProxy=true;controllerPlot.target.bind('jqplotZoom',plotZoom);controllerPlot.target.bind('jqplotResetZoom',plotReset);function plotZoom(ev,gridpos,datapos,plot,cursor){tc.doZoom(gridpos,datapos,targetPlot,cursor)}function plotReset(ev,plot,cursor){var cax=cursor._zoom.axes;var axes=targetPlot.axes;for(var ax in axes){axes[ax]._ticks=[];axes[ax].min=cax[ax].min;axes[ax].max=cax[ax].max;axes[ax].autoscale=cax[ax].autoscale;axes[ax].numberTicks=cax[ax].numberTicks;axes[ax].tickInterval=cax[ax].tickInterval;axes[ax].specialFormat=cax[ax].specialFormat;axes[ax].specialFormatFlag=cax[ax].specialFormatFlag;axes[ax].useDST=cax[ax].useDST;axes[ax].daTickInterval=cax[ax].daTickInterval;var newMin=Number.POSITIVE_INFINITY,newMax=Number.NEGATIVE_INFINITY;for(var i=0;i<targetPlot.series.length;i++){var sObj=targetPlot.series[i];var dStr=ax.match(/^[xy]/);if(sObj.show&&sObj[dStr+"axis"]==ax){var minStr=(dStr=="x")?"minX":"minY";var maxStr=(dStr=="x")?"maxX":"maxY";if(sObj[minStr]&&sObj[minStr]<newMin)newMin=sObj[minStr];if(sObj[maxStr]&&sObj[maxStr]>newMax)newMax=sObj[maxStr]}}if(newMin!=Number.POSITIVE_INFINITY){axes[ax].min=(newMin>0&&(newMin*0.9)<0)?0:newMin*0.9;axes[ax].numberTicks=null;axes[ax].tickInterval=null;axes[ax].daTickInterval=null}if(newMax!=Number.NEGATIVE_INFINITY){axes[ax].max=newMax*1.1;axes[ax].numberTicks=null;axes[ax].tickInterval=null;axes[ax].daTickInterval=null}}targetPlot.redraw();cursor._zoom.isZoomed=false}};$.jqplot.Cursor.prototype.resetZoom=function(plot,cursor){var axes=plot.axes;var cax=cursor._zoom.axes;if((!plot.plugins.cursor.zoomProxy||plot.plugins.cursor.zoomOnController)&&cursor._zoom.isZoomed){for(var ax in axes){axes[ax]._ticks=[];axes[ax].min=cax[ax].min;axes[ax].max=cax[ax].max;axes[ax].autoscale=cax[ax].autoscale;axes[ax].numberTicks=cax[ax].numberTicks;axes[ax].tickInterval=cax[ax].tickInterval;axes[ax].daTickInterval=cax[ax].daTickInterval;axes[ax].specialFormat=cax[ax].specialFormat;axes[ax].specialFormatFlag=cax[ax].specialFormatFlag;axes[ax].useDST=cax[ax].useDST}plot.redraw();cursor._zoom.isZoomed=false}else{var ctx=cursor.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)}plot.target.trigger('jqplotResetZoom',[plot,cursor])};$.jqplot.Cursor.resetZoom=function(plot){plot.resetZoom()};$.jqplot.Cursor.prototype.doZoom=function(gridpos,datapos,plot,cursor){this.performOnZoom(plot);var c=cursor;var axes=plot.axes;var zaxes=c._zoom.axes;var start=zaxes.start;var end=zaxes.end;var min,max;var ctx=plot.plugins.cursor.zoomCanvas._ctx;if((c.constrainZoomTo=='none'&&Math.abs(gridpos.x-c._zoom.start[0])>6&&Math.abs(gridpos.y-c._zoom.start[1])>6)||(c.constrainZoomTo=='x'&&Math.abs(gridpos.x-c._zoom.start[0])>6)||(c.constrainZoomTo=='y'&&Math.abs(gridpos.y-c._zoom.start[1])>6)){if(!plot.plugins.cursor.zoomProxy||plot.plugins.cursor.zoomOnController){for(var ax in datapos){if(c._zoom.axes[ax]==undefined){c._zoom.axes[ax]={};c._zoom.axes[ax].numberTicks=axes[ax].numberTicks;c._zoom.axes[ax].tickInterval=axes[ax].tickInterval;c._zoom.axes[ax].autoscale=axes[ax].autoscale;c._zoom.axes[ax].daTickInterval=axes[ax].daTickInterval;c._zoom.axes[ax].specialFormat=axes[ax].specialFormat;c._zoom.axes[ax].specialFormatFlag=axes[ax].specialFormatFlag;c._zoom.axes[ax].useDST=axes[ax].useDST;c._zoom.axes[ax].min=axes[ax].min;c._zoom.axes[ax].max=axes[ax].max}if((c.constrainZoomTo=='none')||(c.constrainZoomTo=='x'&&ax.charAt(0)=='x')||(c.constrainZoomTo=='y'&&ax.charAt(0)=='y')){dp=datapos[ax];if(dp!=null){if(dp>start[ax]){var newMin=(axes[ax].renderer==$.jqplot.DateAxisRenderer)?(Date.create(start[ax])).round(c.snapZoomTo,'down'):start[ax];var newMax=(axes[ax].renderer==$.jqplot.DateAxisRenderer)?(Date.create(dp)).round(c.snapZoomTo,'up'):dp}else{span=start[ax]-dp;var newMin=(axes[ax].renderer==$.jqplot.DateAxisRenderer)?(Date.create(dp)).round(c.snapZoomTo,'down'):dp;var newMax=(axes[ax].renderer==$.jqplot.DateAxisRenderer)?(Date.create(start[ax])).round(c.snapZoomTo,'up'):start[ax]}if(newMin!=newMax){axes[ax].min=newMin;axes[ax].max=newMax}axes[ax].tickInterval=null;axes[ax].daTickInterval=null;axes[ax]._ticks=[]}if(axes[ax].autoscaleOnZoom!=null)axes[ax].autoscale=this.autoscaleOnZoom}}ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);plot.redraw();c._zoom.isZoomed=true}this.performAfterZoom(plot);plot.target.trigger('jqplotZoom',[gridpos,datapos,plot,cursor])}};$.jqplot.preInitHooks.push($.jqplot.Cursor.init);$.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);function updateTooltip(gridpos,datapos,plot){var c=plot.plugins.cursor;var s='';var addbr=false;if(c.showTooltipGridPosition){s=gridpos.x+', '+gridpos.y;addbr=true}if(c.showTooltipUnitPosition){var g;for(var i=0;i<c.tooltipAxisGroups.length;i++){g=c.tooltipAxisGroups[i];if(addbr){s+='<br />'}if(c.useAxesFormatters){var xf=plot.axes[g[0]]._ticks[0].formatter;var yf=plot.axes[g[1]]._ticks[0].formatter;var xfstr=plot.axes[g[0]]._ticks[0].formatString;var yfstr=plot.axes[g[1]]._ticks[0].formatString;s+=xf(xfstr,datapos[g[0]])+', '+yf(yfstr,datapos[g[1]])}else{s+=$.jqplot.sprintf(c.tooltipFormatString,datapos[g[0]],datapos[g[1]])}addbr=true}}if(c.showTooltipDataPosition){var series=plot.series;var ret=getIntersectingPoints(plot,gridpos.x,gridpos.y);var addbr=false;for(var i=0;i<series.length;i++){if(series[i].show){var idx=series[i].index;var label=series[i].label.toString();var cellid=$.inArray(idx,ret.indices);var sx=undefined;var sy=undefined;if(cellid!=-1){var data=ret.data[cellid].data;if(c.useAxesFormatters){var xf=series[i]._xaxis._ticks[0].formatter;var yf=series[i]._yaxis._ticks[0].formatter;var xfstr=series[i]._xaxis._ticks[0].formatString;var yfstr=series[i]._yaxis._ticks[0].formatString;sx=xf(xfstr,data[0]);sy=yf(yfstr,data[1])}else{sx=data[0];sy=data[1]}if(addbr){s+='<br />'}s+=$.jqplot.sprintf(c.tooltipFormatString,label,sx,sy);addbr=true}}}}c._tooltipElem.html(s)}function moveLine(gridpos,plot){var c=plot.plugins.cursor;var ctx=c.cursorCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);if(c.showVerticalLine){c.shapeRenderer.draw(ctx,[[gridpos.x,0],[gridpos.x,ctx.canvas.height]])}if(c.showHorizontalLine){c.shapeRenderer.draw(ctx,[[0,gridpos.y],[ctx.canvas.width,gridpos.y]])}var ret=getIntersectingPoints(plot,gridpos.x,gridpos.y);if(c.showCursorLegend){var cells=$(plot.targetId+' td.jqplot-cursor-legend-label');for(var i=0;i<cells.length;i++){var idx=$(cells[i]).data('seriesIndex');var series=plot.series[idx];var label=series.label.toString();var cellid=$.inArray(idx,ret.indices);var sx=undefined;var sy=undefined;if(cellid!=-1){var data=ret.data[cellid].data;if(c.useAxesFormatters){var xf=series._xaxis._ticks[0].formatter;var yf=series._yaxis._ticks[0].formatter;var xfstr=series._xaxis._ticks[0].formatString;var yfstr=series._yaxis._ticks[0].formatString;sx=xf(xfstr,data[0]);sy=yf(yfstr,data[1])}else{sx=data[0];sy=data[1]}}if(plot.legend.escapeHtml){$(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString,label,sx,sy))}else{$(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString,label,sx,sy))}}}}function getIntersectingPoints(plot,x,y){var ret={indices:[],data:[]};var s,i,d0,d,j,r;var threshold;var c=plot.plugins.cursor;for(var i=0;i<plot.series.length;i++){s=plot.series[i];r=s.renderer;if(s.show){threshold=c.intersectionThreshold;if(s.showMarker){threshold+=s.markerRenderer.size/2}for(var j=0;j<s.gridData.length;j++){p=s.gridData[j];if(c.showVerticalLine){if(Math.abs(x-p[0])<=threshold){ret.indices.push(i);ret.data.push({seriesIndex:i,pointIndex:j,gridData:p,data:s.data[j]})}}}}}return ret}function moveTooltip(gridpos,plot){var c=plot.plugins.cursor;var elem=c._tooltipElem;switch(c.tooltipLocation){case'nw':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top-c.tooltipOffset-elem.outerHeight(true);break;case'n':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)/2;var y=gridpos.y+plot._gridPadding.top-c.tooltipOffset-elem.outerHeight(true);break;case'ne':var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top-c.tooltipOffset-elem.outerHeight(true);break;case'e':var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top-elem.outerHeight(true)/2;break;case'se':var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break;case's':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)/2;var y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break;case'sw':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break;case'w':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top-elem.outerHeight(true)/2;break;default:var x=gridpos.x+plot._gridPadding.left+c.tooltipOffset;var y=gridpos.y+plot._gridPadding.top+c.tooltipOffset;break}c._tooltipElem.css('left',x);c._tooltipElem.css('top',y)}function positionTooltip(plot){var grid=plot._gridPadding;var c=plot.plugins.cursor;var elem=c._tooltipElem;switch(c.tooltipLocation){case'nw':var a=grid.left+c.tooltipOffset;var b=grid.top+c.tooltipOffset;elem.css('left',a);elem.css('top',b);break;case'n':var a=(grid.left+(plot._plotDimensions.width-grid.right))/2-elem.outerWidth(true)/2;var b=grid.top+c.tooltipOffset;elem.css('left',a);elem.css('top',b);break;case'ne':var a=grid.right+c.tooltipOffset;var b=grid.top+c.tooltipOffset;elem.css({right:a,top:b});break;case'e':var a=grid.right+c.tooltipOffset;var b=(grid.top+(plot._plotDimensions.height-grid.bottom))/2-elem.outerHeight(true)/2;elem.css({right:a,top:b});break;case'se':var a=grid.right+c.tooltipOffset;var b=grid.bottom+c.tooltipOffset;elem.css({right:a,bottom:b});break;case's':var a=(grid.left+(plot._plotDimensions.width-grid.right))/2-elem.outerWidth(true)/2;var b=grid.bottom+c.tooltipOffset;elem.css({left:a,bottom:b});break;case'sw':var a=grid.left+c.tooltipOffset;var b=grid.bottom+c.tooltipOffset;elem.css({left:a,bottom:b});break;case'w':var a=grid.left+c.tooltipOffset;var b=(grid.top+(plot._plotDimensions.height-grid.bottom))/2-elem.outerHeight(true)/2;elem.css({left:a,top:b});break;default:var a=grid.right-c.tooltipOffset;var b=grid.bottom+c.tooltipOffset;elem.css({right:a,bottom:b});break}}function handleClick(ev,gridpos,datapos,neighbor,plot){ev.stopPropagation();ev.preventDefault();var c=plot.plugins.cursor;if(c.clickReset){c.resetZoom(plot,c)}return false}function handleDblClick(ev,gridpos,datapos,neighbor,plot){ev.stopPropagation();ev.preventDefault();var c=plot.plugins.cursor;if(c.dblClickReset){c.resetZoom(plot,c)}return false}function handleMouseLeave(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;if(c.show){$(ev.target).css('cursor',c.previousCursor);if(c.showTooltip){c._tooltipElem.hide()}if(c.zoom){c._zoom.started=false;c._zoom.zooming=false;if(!c.zoomProxy){var ctx=c.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)}}if(c.showVerticalLine||c.showHorizontalLine){var ctx=c.cursorCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)}if(c.showCursorLegend){var cells=$(plot.targetId+' td.jqplot-cursor-legend-label');for(var i=0;i<cells.length;i++){var idx=$(cells[i]).data('seriesIndex');var series=plot.series[idx];var label=series.label.toString();if(plot.legend.escapeHtml){$(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString,label,undefined,undefined))}else{$(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString,label,undefined,undefined))}}}}}function handleMouseEnter(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;if(c.show){c.previousCursor=ev.target.style.cursor;ev.target.style.cursor=c.style;if(c.showTooltip){updateTooltip(gridpos,datapos,plot);if(c.followMouse){moveTooltip(gridpos,plot)}else{positionTooltip(plot)}c._tooltipElem.show()}if(c.showVerticalLine||c.showHorizontalLine){moveLine(gridpos,plot)}}}function handleMouseMove(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;var ctx=c.zoomCanvas._ctx;if(c.show){if(c.showTooltip){updateTooltip(gridpos,datapos,plot);if(c.followMouse){moveTooltip(gridpos,plot)}}if(c.zoom&&c._zoom.started&&!c.zoomTarget){c._zoom.zooming=true;if(c.constrainZoomTo=='x'){c._zoom.end=[gridpos.x,ctx.canvas.height]}else if(c.constrainZoomTo=='y'){c._zoom.end=[ctx.canvas.width,gridpos.y]}else{c._zoom.end=[gridpos.x,gridpos.y]}drawZoomBox.call(c)}if(c.showVerticalLine||c.showHorizontalLine){moveLine(gridpos,plot)}}}function handleMouseDown(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;var axes=plot.axes;if(c.zoom){if(!c.zoomProxy){var ctx=c.zoomCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)}if(c.constrainZoomTo=='x'){c._zoom.start=[gridpos.x,0]}else if(c.constrainZoomTo=='y'){c._zoom.start=[0,gridpos.y]}else{c._zoom.start=[gridpos.x,gridpos.y]}c._zoom.started=true;for(var ax in datapos){c._zoom.axes.start[ax]=datapos[ax]}}}function handleMouseUp(ev,gridpos,datapos,neighbor,plot){var c=plot.plugins.cursor;if(c.zoom&&c._zoom.zooming&&!c.zoomTarget){c.doZoom(gridpos,datapos,plot,c)}c._zoom.started=false;c._zoom.zooming=false}$.jqplot.CursorLegendRenderer=function(options){$.jqplot.TableLegendRenderer.call(this,options);this.formatString='%s'};$.jqplot.CursorLegendRenderer.prototype=new $.jqplot.TableLegendRenderer();$.jqplot.CursorLegendRenderer.prototype.constructor=$.jqplot.CursorLegendRenderer;$.jqplot.CursorLegendRenderer.prototype.draw=function(){if(this.show){var series=this._series;this._elem=$('<table class="jqplot-legend jqplot-cursor-legend" style="position:absolute"></table>');var pad=false;for(var i=0;i<series.length;i++){s=series[i];if(s.show){var lt=$.jqplot.sprintf(this.formatString,s.label.toString());if(lt){var color=s.color;if(s._stack&&!s.fill){color=''}addrow.call(this,lt,color,pad,i);pad=true}for(var j=0;j<$.jqplot.addLegendRowHooks.length;j++){var item=$.jqplot.addLegendRowHooks[j].call(this,s);if(item){addrow.call(this,item.label,item.color,pad);pad=true}}}}}function addrow(label,color,pad,idx){var rs=(pad)?this.rowSpacing:'0';var tr=$('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);tr.data('seriesIndex',idx);$('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+rs+';">'+'<div style="border:1px solid #cccccc;padding:0.2em;">'+'<div class="jqplot-cursor-legend-swatch" style="background-color:'+color+';"></div>'+'</div></td>').appendTo(tr);var td=$('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:'+rs+';"></td>');td.appendTo(tr);td.data('seriesIndex',idx);if(this.escapeHtml){td.text(label)}else{td.html(label)}}return this._elem}})(jQuery);function drawZoomBox(){var start=this._zoom.start;var end=this._zoom.end;var ctx=this.zoomCanvas._ctx;var l,t,h,w;if(end[0]>start[0]){l=start[0];w=end[0]-start[0]}else{l=end[0];w=start[0]-end[0]}if(end[1]>start[1]){t=start[1];h=end[1]-start[1]}else{t=end[1];h=start[1]-end[1]}ctx.fillStyle='rgba(0,0,0,0.2)';ctx.strokeStyle='#999999';ctx.lineWidth=1.0;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.clearRect(l,t,w,h);ctx.strokeRect(l,t,w,h);if($.browser.msie)ctx.fillRect(l,t,w,h)}(function($){$.jqplot.eventListenerHooks.push(['jqplotMouseMove',handleMove]);$.jqplot.Highlighter=function(options){this.show=$.jqplot.config.enablePlugins;this.markerRenderer=new $.jqplot.MarkerRenderer({shadow:false});this.showMarker=true;this.lineWidthAdjust=2.5;this.sizeAdjust=5;this.showTooltip=true;this.tooltipLocation='nw';this.fadeTooltip=true;this.tooltipFadeSpeed="fast";this.tooltipOffset=2;this.tooltipAxes='both';this.tooltipSeparator=', ';this.useAxesFormatters=true;this.tooltipFormatString='%.5P';this.formatString=null;this.yvalues=1;this._tooltipElem;this.isHighlighting=false;$.extend(true,this,options)};$.jqplot.Highlighter.init=function(target,data,opts){var options=opts||{};this.plugins.highlighter=new $.jqplot.Highlighter(options.highlighter)};$.jqplot.Highlighter.parseOptions=function(defaults,options){this.showHighlight=true};$.jqplot.Highlighter.postPlotDraw=function(){this.plugins.highlighter.highlightCanvas=new $.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding,'jqplot-highlight-canvas',this._plotDimensions));var hctx=this.plugins.highlighter.highlightCanvas.setContext();var p=this.plugins.highlighter;p._tooltipElem=$('<div class="jqplot-highlighter-tooltip" style="position:absolute;display:none"></div>');this.target.append(p._tooltipElem)};$.jqplot.preInitHooks.push($.jqplot.Highlighter.init);$.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);$.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);function draw(plot,neighbor){var hl=plot.plugins.highlighter;var s=plot.series[neighbor.seriesIndex];var smr=s.markerRenderer;var mr=hl.markerRenderer;mr.style=smr.style;mr.lineWidth=smr.lineWidth+hl.lineWidthAdjust;mr.size=smr.size+hl.sizeAdjust;var rgba=$.jqplot.getColorComponents(smr.color);var newrgb=[rgba[0],rgba[1],rgba[2]];var alpha=(rgba[3]>=0.6)?rgba[3]*0.6:rgba[3]*(2-rgba[3]);mr.color='rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';mr.init();mr.draw(s.gridData[neighbor.pointIndex][0],s.gridData[neighbor.pointIndex][1],hl.highlightCanvas._ctx)}function showTooltip(plot,series,neighbor){var hl=plot.plugins.highlighter;var elem=hl._tooltipElem;if(hl.useAxesFormatters){var xf=series._xaxis._ticks[0].formatter;var yf=series._yaxis._ticks[0].formatter;var xfstr=series._xaxis._ticks[0].formatString;var yfstr=series._yaxis._ticks[0].formatString;var str;var xstr=xf(xfstr,neighbor.data[0]);var ystrs=[];for(var i=1;i<hl.yvalues+1;i++){ystrs.push(yf(yfstr,neighbor.data[i]))}if(hl.formatString){switch(hl.tooltipAxes){case'both':case'xy':ystrs.unshift(xstr);ystrs.unshift(hl.formatString);str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break;case'yx':ystrs.push(xstr);ystrs.unshift(hl.formatString);str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break;case'x':str=$.jqplot.sprintf.apply($.jqplot.sprintf,[hl.formatString,xstr]);break;case'y':ystrs.unshift(hl.formatString);str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break;default:ystrs.unshift(xstr);ystrs.unshift(hl.formatString);str=$.jqplot.sprintf.apply($.jqplot.sprintf,ystrs);break}}else{switch(hl.tooltipAxes){case'both':case'xy':str=xstr;for(var i=0;i<ystrs.length;i++){str+=hl.tooltipSeparator+ystrs[i]}break;case'yx':str='';for(var i=0;i<ystrs.length;i++){str+=ystrs[i]+hl.tooltipSeparator}str+=xstr;break;case'x':str=xstr;break;case'y':str='';for(var i=0;i<ystrs.length;i++){str+=ystrs[i]+hl.tooltipSeparator}break;default:str=xstr;for(var i=0;i<ystrs.length;i++){str+=hl.tooltipSeparator+ystrs[i]}break}}}else{var str;if(hl.tooltipAxes=='both'||hl.tooltipAxes=='xy'){str=$.jqplot.sprintf(hl.tooltipFormatString,neighbor.data[0])+hl.tooltipSeparator+$.jqplot.sprintf(hl.tooltipFormatString,neighbor.data[1])}else if(hl.tooltipAxes=='yx'){str=$.jqplot.sprintf(hl.tooltipFormatString,neighbor.data[1])+hl.tooltipSeparator+$.jqplot.sprintf(hl.tooltipFormatString,neighbor.data[0])}else if(hl.tooltipAxes=='x'){str=$.jqplot.sprintf(hl.tooltipFormatString,neighbor.data[0])}else if(hl.tooltipAxes=='y'){str=$.jqplot.sprintf(hl.tooltipFormatString,neighbor.data[1])}}str=str.replace(/%l/,series.label);if(neighbor.data[2]!=undefined&&neighbor.data[2])str=str.replace(/%1/,neighbor.data[2]);else str=str.replace(/%1/,"");if(neighbor.data[3]!=undefined&&neighbor.data[3])str=str.replace(/%2/,neighbor.data[3]);else str=str.replace(/%2/,"");if(neighbor.data[4]!=undefined&&neighbor.data[4])str=str.replace(/%3/,neighbor.data[4]);else str=str.replace(/%3/,"");if(neighbor.data[5]!=undefined&&neighbor.data[5])str=str.replace(/%4/,neighbor.data[5]);else str=str.replace(/%4/,"");if(neighbor.data[8]!=undefined&&neighbor.data[8])str=str.replace(/%5/,neighbor.data[8]);else str=str.replace(/%5/,"");if(neighbor.data[7]!=undefined&&neighbor.data[7])str=str.replace(/%6/,neighbor.data[7]);else str=str.replace(/%6/,"");elem.html(str);var gridpos={x:neighbor.gridData[0],y:neighbor.gridData[1]};var ms=0;var fact=0.707;if(series.markerRenderer.show==true){ms=(series.markerRenderer.size+hl.sizeAdjust)/2}switch(hl.tooltipLocation){case'nw':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-hl.tooltipOffset-fact*ms;var y=gridpos.y+plot._gridPadding.top-hl.tooltipOffset-elem.outerHeight(true)-fact*ms;break;case'n':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)/2;var y=gridpos.y+plot._gridPadding.top-hl.tooltipOffset-elem.outerHeight(true)-ms;break;case'ne':var x=gridpos.x+plot._gridPadding.left+hl.tooltipOffset+fact*ms;var y=gridpos.y+plot._gridPadding.top-hl.tooltipOffset-elem.outerHeight(true)-fact*ms;break;case'e':var x=gridpos.x+plot._gridPadding.left+hl.tooltipOffset+ms;var y=gridpos.y+plot._gridPadding.top-elem.outerHeight(true)/2;break;case'se':var x=gridpos.x+plot._gridPadding.left+hl.tooltipOffset+fact*ms;var y=gridpos.y+plot._gridPadding.top+hl.tooltipOffset+fact*ms;break;case's':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)/2;var y=gridpos.y+plot._gridPadding.top+hl.tooltipOffset+ms;break;case'sw':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-hl.tooltipOffset-fact*ms;var y=gridpos.y+plot._gridPadding.top+hl.tooltipOffset+fact*ms;break;case'w':var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-hl.tooltipOffset-ms;var y=gridpos.y+plot._gridPadding.top-elem.outerHeight(true)/2;break;default:var x=gridpos.x+plot._gridPadding.left-elem.outerWidth(true)-hl.tooltipOffset-fact*ms;var y=gridpos.y+plot._gridPadding.top-hl.tooltipOffset-elem.outerHeight(true)-fact*ms;break}elem.css('left',x);elem.css('top',y);if(hl.fadeTooltip){elem.fadeIn(hl.tooltipFadeSpeed)}else{elem.show()}}function handleMove(ev,gridpos,datapos,neighbor,plot){var hl=plot.plugins.highlighter;if(hl.show){if(neighbor==null&&hl.isHighlighting&&HIGHLIGHTER_HELPERS.isHighlighting){var ctx=hl.highlightCanvas._ctx;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);if(hl.fadeTooltip){hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed)}else{hl._tooltipElem.hide()}hl.isHighlighting=false;HIGHLIGHTER_HELPERS.isHighlighting=false}if(neighbor!=null&&plot.series[neighbor.seriesIndex].showHighlight&&!hl.isHighlighting&&!HIGHLIGHTER_HELPERS.isHighlighting){hl.isHighlighting=true;HIGHLIGHTER_HELPERS.isHighlighting=true;if(hl.showMarker){draw(plot,neighbor)}if(hl.showTooltip){showTooltip(plot,plot.series[neighbor.seriesIndex],neighbor)}}}}})(jQuery);var HIGHLIGHTER_HELPERS=function(){return{isHighlighting:false}}();(function($){$.jqplot.PointLabels=function(options){this.show=$.jqplot.config.enablePlugins;this.location='n';this.labelsFromSeries=false;this.seriesLabelIndex=null;this.labels=[];this.stackedValue=false;this.ypadding=6;this.xpadding=6;this.escapeHTML=true;this.edgeTolerance=0;this.hideZeros=false;$.extend(true,this,options)};var locations=['nw','n','ne','e','se','s','sw','w'];var locationIndicies={'nw':0,'n':1,'ne':2,'e':3,'se':4,'s':5,'sw':6,'w':7};var oppositeLocations=['se','s','sw','w','nw','n','ne','e'];$.jqplot.PointLabels.init=function(target,data,seriesDefaults,opts){var options=$.extend(true,{},seriesDefaults,opts);this.plugins.pointLabels=new $.jqplot.PointLabels(options.pointLabels);var p=this.plugins.pointLabels;if(p.labels.length==0||p.labelsFromSeries){if(p.stackedValue){if(this._plotData.length&&this._plotData[0].length){var idx=p.seriesLabelIndex||this._plotData[0].length-1;for(var i=0;i<this._plotData.length;i++){p.labels.push(this._plotData[i][idx])}}}else{var d=this.data;if(this.renderer.constructor==$.jqplot.BarRenderer&&this.waterfall){d=this._data}if(d.length&&d[0].length){var idx=p.seriesLabelIndex||d[0].length-1;for(var i=0;i<d.length;i++){p.labels.push(d[i][idx])}}}}};$.jqplot.PointLabels.prototype.xOffset=function(elem,location,padding){location=location||this.location;padding=padding||this.xpadding;var offset;switch(location){case'nw':offset=-elem.outerWidth(true)-this.xpadding;break;case'n':offset=-elem.outerWidth(true)/2;break;case'ne':offset=this.xpadding;break;case'e':offset=this.xpadding;break;case'se':offset=this.xpadding;break;case's':offset=-elem.outerWidth(true)/2;break;case'sw':offset=-elem.outerWidth(true)-this.xpadding;break;case'w':offset=-elem.outerWidth(true)-this.xpadding;break;default:offset=-elem.outerWidth(true)-this.xpadding;break}return offset};$.jqplot.PointLabels.prototype.yOffset=function(elem,location,padding){location=location||this.location;padding=padding||this.xpadding;var offset;switch(location){case'nw':offset=-elem.outerHeight(true)-this.ypadding;break;case'n':offset=-elem.outerHeight(true)-this.ypadding;break;case'ne':offset=-elem.outerHeight(true)-this.ypadding;break;case'e':offset=-elem.outerHeight(true)/2;break;case'se':offset=this.ypadding;break;case's':offset=this.ypadding;break;case'sw':offset=this.ypadding;break;case'w':offset=-elem.outerHeight(true)/2;break;default:offset=-elem.outerHeight(true)-this.ypadding;break}return offset};$.jqplot.PointLabels.draw=function(sctx,options){var p=this.plugins.pointLabels;if(p.show){for(var i=0;i<p.labels.length;i++){var pd=this._plotData;var xax=this._xaxis;var yax=this._yaxis;var label=p.labels[i];if(p.hideZeros&&parseInt(p.labels[i],10)==0){label=''}var elem=$('<div class="jqplot-point-label" style="position:absolute"></div>');elem.insertAfter(sctx.canvas);if(p.escapeHTML){elem.text(label)}else{elem.html(label)}var location=p.location;if(this.waterfall&&parseInt(label,10)<0){location=oppositeLocations[locationIndicies[location]]}var ell=xax.u2p(pd[i][0])+p.xOffset(elem,location);var elt=yax.u2p(pd[i][1])+p.yOffset(elem,location);elem.css('left',ell);elem.css('top',elt);var elr=ell+$(elem).width();var elb=elt+$(elem).height();var et=p.edgeTolerance;var scl=$(sctx.canvas).position().left;var sct=$(sctx.canvas).position().top;var scr=sctx.canvas.width+scl;var scb=sctx.canvas.height+sct;if(ell-et<scl||elt-et<sct||elr+et>scr||elb+et>scb){$(elem).remove()}}}};$.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);$.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw)})(jQuery);Function.prototype.method=function(name,func){this.prototype[name]=func;
return this;
};
Function.method("inherits",function(Parent){var d={},p=(this.prototype=new Parent());
this.method("uber",function uber(name){if(!(name in d)){d[name]=0;
}var f,r,t=d[name],v=Parent.prototype;
if(t){while(t){v=v.constructor.prototype;
t-=1;
}f=v[name];
}else{f=p[name];
if(f==this[name]){f=v[name];
}}d[name]+=1;
r=f.apply(this,Array.prototype.slice.apply(arguments,[1]));
d[name]-=1;
return r;
});
return this;
});
function MPageComponent(){this.m_componentId=0;
this.m_reportId=0;
this.m_label="";
this.m_subLabel="";
this.m_column=0;
this.m_sequence=0;
this.m_link="";
this.m_totalResults=false;
this.m_xOFy=false;
this.m_isExpanded=false;
this.m_isAlwaysExpanded=false;
this.m_scrollNumber=0;
this.m_isScrollEnabled=false;
this.m_styles=null;
this.m_groups=null;
this.m_pageGroupSeq=0;
this.m_lookbackDays=0;
this.m_newLink=false;
this.criterion=null;
this.m_isPlusAdd=false;
this.m_scope=0;
this.m_rootComponentNode=null;
this.m_sectionContentNode=null;
this.m_compLoadTimerName="";
this.m_compRenderTimerName="";
this.m_includeLineNumber=false;
this.m_lookbackUnitTypeFlag=0;
this.m_lookbackUnits=0;
this.m_brlookbackUnitTypeFlag=0;
this.m_brlookbackUnits=0;
this.m_dateFormat=2;
this.m_isCustomizeView=false;
this.m_menuItems=null;
this.m_lookBackMenuItems=null;
this.m_displayFilters=null;
this.m_AutoSuggestScript="";
this.m_AutoSuggestAddTimerName="";
this.m_editMode=false;
this.m_compDisp=true;
this.m_footerText="";
this.m_hasLookBackDropDown=false;
this.m_ScopeHTML="";
this.m_compLoad=false;
this.m_hasCompFilters=false;
this.m_grouper_arr=[];
this.m_grouperFilterLabel="";
this.m_grouperFilterEventSets=null;
this.m_selectedTimeFrame=null;
this.m_selectedDataGroup=null;
MPageComponent.method("isDisplayable",function(){if(this.m_displayFilters!==null&&this.m_displayFilters.length>0){for(var x=this.m_displayFilters.length;
x--;
){var displayFilter=this.m_displayFilters[x];
if(displayFilter.checkFilters()===false){CERN_EventListener.removeAllListeners(this,this);
return false;
}}}return this.m_compDisp;
});
MPageComponent.method("getDisplayFilters",function(){return this.m_displayFilters;
});
MPageComponent.method("setDisplayFilters",function(value){this.m_displayFilters=value;
});
MPageComponent.method("addDisplayFilter",function(value){if(this.m_displayFilters===null){this.m_displayFilters=[];
}this.m_displayFilters.push(value);
});
MPageComponent.method("getLookbackMenuItems",function(){return this.m_lookBackMenuItems;
});
MPageComponent.method("setLookbackMenuItems",function(value){this.m_lookBackMenuItems=value;
});
MPageComponent.method("addLookbackMenuItem",function(value){if(this.m_lookBackMenuItems===null){this.m_lookBackMenuItems=[];
}this.m_lookBackMenuItems.push(value);
});
MPageComponent.method("getMenuItems",function(){return this.m_menuItems;
});
MPageComponent.method("setMenuItems",function(value){this.m_menuItems=value;
});
MPageComponent.method("addMenuItem",function(value){if(this.m_menuItems===null){this.m_menuItems=[];
}this.m_menuItems.push(value);
});
MPageComponent.method("getCustomizeView",function(){return this.m_isCustomizeView;
});
MPageComponent.method("setCustomizeView",function(value){this.m_isCustomizeView=value;
});
MPageComponent.method("InsertData",function(){alert("ERROR: InsertData has not been implemented within the component");
});
MPageComponent.method("HandleSuccess",function(){alert("ERROR: HandleSuccess has not been implemented within the component");
});
MPageComponent.method("openTab",function(){alert("ERROR: openTab has not been implemented within the component");
});
MPageComponent.method("getComponentLoadTimerName",function(){return(this.m_compLoadTimerName);
});
MPageComponent.method("setComponentLoadTimerName",function(value){this.m_compLoadTimerName=value;
});
MPageComponent.method("getComponentRenderTimerName",function(){return(this.m_compRenderTimerName);
});
MPageComponent.method("setComponentRenderTimerName",function(value){this.m_compRenderTimerName=value;
});
MPageComponent.method("getRootComponentNode",function(){if(this.m_rootComponentNode===null){var style=this.getStyles();
this.m_rootComponentNode=_g(style.getId());
}return(this.m_rootComponentNode);
});
MPageComponent.method("setRootComponentNode",function(value){this.m_rootComponentNode=value;
});
MPageComponent.method("getSectionContentNode",function(){if(this.m_sectionContentNode===null){var style=this.getStyles();
this.m_sectionContentNode=_g(style.getContentId());
}return(this.m_sectionContentNode);
});
MPageComponent.method("setSectionContentNode",function(value){this.m_sectionContentNode=value;
});
MPageComponent.method("getMPageName",function(){return(this.m_MPageName);
});
MPageComponent.method("setMPageName",function(value){this.m_MPageName=value;
});
MPageComponent.method("getScope",function(){return(this.m_scope);
});
MPageComponent.method("setScope",function(value){this.m_scope=value;
});
MPageComponent.method("isPlusAddEnabled",function(){return(this.m_isPlusAdd);
});
MPageComponent.method("setPlusAddEnabled",function(value){this.m_isPlusAdd=value;
});
MPageComponent.method("getCriterion",function(){return(this.criterion);
});
MPageComponent.method("setCriterion",function(value){this.criterion=value;
});
MPageComponent.method("isNewLink",function(){return(this.m_newLink);
});
MPageComponent.method("setNewLink",function(value){this.m_newLink=value;
});
MPageComponent.method("getPageGroupSequence",function(){return(this.m_pageGroupSeq);
});
MPageComponent.method("setPageGroupSequence",function(value){this.m_pageGroupSeq=value;
});
MPageComponent.method("getLookbackDays",function(){return(this.m_lookbackDays);
});
MPageComponent.method("setLookbackDays",function(value){this.m_lookbackDays=value;
});
MPageComponent.method("getComponentId",function(){return(this.m_componentId);
});
MPageComponent.method("setComponentId",function(value){this.m_componentId=value;
var styles=this.getStyles();
if(styles!==null){styles.setComponentId(value);
}});
MPageComponent.method("getReportId",function(){return(this.m_reportId);
});
MPageComponent.method("setReportId",function(value){this.m_reportId=value;
});
MPageComponent.method("getLabel",function(){return(this.m_label);
});
MPageComponent.method("setLabel",function(value){this.m_label=value;
});
MPageComponent.method("updateLabel",function(value){this.m_label=value;
var rootComponentNode=this.getRootComponentNode();
var secHead=Util.gc(rootComponentNode,0);
var secTitle=Util.gc(Util.Style.g("sec-title",secHead,"span")[0],0);
var anchor=_gbt("a",secTitle);
if(anchor[0]){anchor[0].innerHTML=value;
}else{secTitle.innerHTML=value;
}});
MPageComponent.method("getSubLabel",function(){return(this.m_subLabel);
});
MPageComponent.method("setSubLabel",function(value){this.m_subLabel=value;
});
MPageComponent.method("updateSubLabel",function(value){this.m_subLabel=value;
var rootComponentNode=this.getRootComponentNode();
var totalCount=Util.Style.g("sec-total",rootComponentNode,"span");
totalCount[0].innerHTML=this.m_subLabel;
});
MPageComponent.method("getColumn",function(){return(this.m_column);
});
MPageComponent.method("setColumn",function(value){this.m_column=value;
});
MPageComponent.method("getSequence",function(){return(this.m_sequence);
});
MPageComponent.method("setSequence",function(value){this.m_sequence=value;
});
MPageComponent.method("getLink",function(){return(this.m_link);
});
MPageComponent.method("setLink",function(value){this.m_link=value;
});
MPageComponent.method("isResultsDisplayEnabled",function(){return(this.m_totalResults);
});
MPageComponent.method("setResultsDisplayEnabled",function(value){this.m_totalResults=value;
});
MPageComponent.method("isXofYEnabled",function(){return(this.m_xOFy);
});
MPageComponent.method("setXofYEnabled",function(value){this.m_xOFy=value;
});
MPageComponent.method("isExpanded",function(){return(this.m_isExpanded);
});
MPageComponent.method("setExpanded",function(value){this.m_isExpanded=value;
});
MPageComponent.method("setExpandCollapseState",function(value){this.m_isExpanded=value;
var i18nCore=i18n.discernabu;
var parentNode=this.getRootComponentNode();
var expColNode=Util.Style.g("sec-hd-tgl",parentNode,"span");
if(value){Util.Style.rcss(parentNode,"closed");
expColNode[0].innerHTML="-";
expColNode[0].title=i18nCore.HIDE_SECTION;
}else{Util.Style.acss(parentNode,"closed");
expColNode[0].innerHTML="+";
expColNode[0].title=i18nCore.SHOW_SECTION;
}});
MPageComponent.method("isAlwaysExpanded",function(){return(this.m_isAlwaysExpanded);
});
MPageComponent.method("setAlwaysExpanded",function(value){this.m_isAlwaysExpanded=value;
});
MPageComponent.method("getScrollNumber",function(){return(this.m_scrollNumber);
});
MPageComponent.method("setScrollNumber",function(value){this.m_scrollNumber=value;
});
MPageComponent.method("isScrollingEnabled",function(){return(this.m_isScrollEnabled);
});
MPageComponent.method("setScrollingEnabled",function(value){this.m_isScrollEnabled=value;
});
MPageComponent.method("getStyles",function(){return(this.m_styles);
});
MPageComponent.method("setStyles",function(value){this.m_styles=value;
});
MPageComponent.method("getFilters",function(){return(this.m_filters);
});
MPageComponent.method("getGroups",function(){if(this.m_groups===null){this.m_groups=[];
}return(this.m_groups);
});
MPageComponent.method("setGroups",function(value){this.m_groups=value;
});
MPageComponent.method("addGroup",function(value){if(this.m_groups===null){this.m_groups=[];
}this.m_groups.push(value);
});
MPageComponent.method("getLookbackUnitTypeFlag",function(){return(this.m_lookbackUnitTypeFlag);
});
MPageComponent.method("setLookbackUnitTypeFlag",function(value){this.m_lookbackUnitTypeFlag=value;
});
MPageComponent.method("getLookbackUnits",function(){return(this.m_lookbackUnits);
});
MPageComponent.method("setLookbackUnits",function(value){this.m_lookbackUnits=value;
});
MPageComponent.method("getBrLookbackUnitTypeFlag",function(){return(this.m_brlookbackUnitTypeFlag);
});
MPageComponent.method("setBrLookbackUnitTypeFlag",function(value){this.m_brlookbackUnitTypeFlag=value;
});
MPageComponent.method("getBrLookbackUnits",function(){return(this.m_brlookbackUnits);
});
MPageComponent.method("setBrLookbackUnits",function(value){this.m_brlookbackUnits=value;
});
MPageComponent.method("isLineNumberIncluded",function(){return this.m_includeLineNumber;
});
MPageComponent.method("setIncludeLineNumber",function(value){this.m_includeLineNumber=value;
});
MPageComponent.method("getDateFormat",function(){return(this.m_dateFormat);
});
MPageComponent.method("setDateFormat",function(value){this.m_dateFormat=value;
});
MPageComponent.method("setAutoSuggestAddScript",function(value){this.m_AutoSuggestScript=value;
});
MPageComponent.method("getAutoSuggestAddScript",function(){return(this.m_AutoSuggestScript);
});
MPageComponent.method("setAutoSuggestAddTimerName",function(value){this.m_AutoSuggestAddTimerName=value;
});
MPageComponent.method("getAutoSuggestAddTimerName",function(){return(this.m_AutoSuggestAddTimerName);
});
MPageComponent.method("setEditMode",function(value){this.m_editMode=value;
});
MPageComponent.method("isEditMode",function(){return(this.m_editMode);
});
MPageComponent.method("setDisplayEnabled",function(value){this.m_compDisp=value;
});
MPageComponent.method("getDisplayEnabled",function(){return(this.m_compDisp);
});
MPageComponent.method("setFooterText",function(value){this.m_footerText=value;
});
MPageComponent.method("getFooterText",function(){return(this.m_footerText);
});
MPageComponent.method("hasLookBackDropDown",function(){return(this.m_hasLookBackDropDown);
});
MPageComponent.method("setLookBackDropDown",function(value){this.m_hasLookBackDropDown=value;
});
MPageComponent.method("setScopeHTML",function(value){this.m_ScopeHTML=value;
});
MPageComponent.method("getScopeHTML",function(){return(this.m_ScopeHTML);
});
MPageComponent.method("isLoaded",function(){return(this.m_compLoad);
});
MPageComponent.method("setLoaded",function(value){this.m_compLoad=value;
});
MPageComponent.method("hasCompFilters",function(){return(this.m_hasCompFilters);
});
MPageComponent.method("setCompFilters",function(value){this.m_hasCompFilters=value;
});
MPageComponent.method("getGrouperFilterLabel",function(){return this.m_grouperFilterLabel;
});
MPageComponent.method("setGrouperFilterLabel",function(value){this.m_grouperFilterLabel=value;
});
MPageComponent.method("getGrouperFilterEventSets",function(){return this.m_grouperFilterEventSets;
});
MPageComponent.method("setGrouperFilterEventSets",function(value){this.m_grouperFilterEventSets=value;
});
MPageComponent.method("addGrouperFilterEventSets",function(value){if(this.m_grouperFilterEventSets===null){this.m_grouperFilterEventSets=[];
}this.m_grouperFilterEventSets.push(value);
});
MPageComponent.method("setGrp1Label",function(value){this.setGrouperLabel(0,value);
});
MPageComponent.method("getGrp1Label",function(){return this.getGrouperLabel(0);
});
MPageComponent.method("setGrp1EventSets",function(value){this.setGrouperEventSets(0,value);
});
MPageComponent.method("getGrp1EventSets",function(){return this.getGrouperEventSets(0);
});
MPageComponent.method("setGrp2Label",function(value){this.setGrouperLabel(1,value);
});
MPageComponent.method("getGrp2Label",function(){return this.getGrouperLabel(1);
});
MPageComponent.method("setGrp2EventSets",function(value){this.setGrouperEventSets(1,value);
});
MPageComponent.method("getGrp2EventSets",function(){return this.getGrouperEventSets(1);
});
MPageComponent.method("setGrp3Label",function(value){this.setGrouperLabel(2,value);
});
MPageComponent.method("getGrp3Label",function(){return this.getGrouperLabel(2);
});
MPageComponent.method("setGrp3EventSets",function(value){this.setGrouperEventSets(2,value);
});
MPageComponent.method("getGrp3EventSets",function(){return this.getGrouperEventSets(2);
});
MPageComponent.method("setGrp4Label",function(value){this.setGrouperLabel(3,value);
});
MPageComponent.method("getGrp4Label",function(){return this.getGrouperLabel(3);
});
MPageComponent.method("setGrp4EventSets",function(value){this.setGrouperEventSets(3,value);
});
MPageComponent.method("getGrp4EventSets",function(){return this.getGrouperEventSets(3);
});
MPageComponent.method("setGrp5Label",function(value){this.setGrouperLabel(4,value);
});
MPageComponent.method("getGrp5Label",function(){return this.getGrouperLabel(4);
});
MPageComponent.method("setGrp5EventSets",function(value){this.setGrouperEventSets(4,value);
});
MPageComponent.method("getGrp5EventSets",function(){return this.getGrouperEventSets(4);
});
MPageComponent.method("setGrp6Label",function(value){this.setGrouperLabel(5,value);
});
MPageComponent.method("getGrp6Label",function(){return this.getGrouperLabel(5);
});
MPageComponent.method("setGrp6EventSets",function(value){this.setGrouperEventSets(5,value);
});
MPageComponent.method("getGrp6EventSets",function(){return this.getGrouperEventSets(5);
});
MPageComponent.method("setGrp7Label",function(value){this.setGrouperLabel(6,value);
});
MPageComponent.method("getGrp7Label",function(){return this.getGrouperLabel(6);
});
MPageComponent.method("setGrp7EventSets",function(value){this.setGrouperEventSets(6,value);
});
MPageComponent.method("getGrp7EventSets",function(){return this.getGrouperEventSets(6);
});
MPageComponent.method("setGrp8Label",function(value){this.setGrouperLabel(7,value);
});
MPageComponent.method("getGrp8Label",function(){return this.getGrouperLabel(7);
});
MPageComponent.method("setGrp8EventSets",function(value){this.setGrouperEventSets(7,value);
});
MPageComponent.method("getGrp8EventSets",function(){return this.getGrouperEventSets(7);
});
MPageComponent.method("setGrp9Label",function(value){this.setGrouperLabel(8,value);
});
MPageComponent.method("getGrp9Label",function(){return this.getGrouperLabel(8);
});
MPageComponent.method("setGrp9EventSets",function(value){this.setGrouperEventSets(8,value);
});
MPageComponent.method("getGrp9EventSets",function(){return this.getGrouperEventSets(8);
});
MPageComponent.method("setGrp10Label",function(value){this.setGrouperLabel(9,value);
});
MPageComponent.method("getGrp10Label",function(){return this.getGrouperLabel(9);
});
MPageComponent.method("setGrp10EventSets",function(value){this.setGrouperEventSets(9,value);
});
MPageComponent.method("getGrp10EventSets",function(){return this.getGrouperEventSets(9);
});
MPageComponent.method("setGrouperLabel",function(index,label){if(index!==null&&!isNaN(index)){if(this.m_grouper_arr[index]){this.m_grouper_arr[index]["label"]=label;
}else{this.m_grouper_arr[index]={};
this.m_grouper_arr[index]["label"]=label;
}}});
MPageComponent.method("getGrouperLabel",function(index){if(index!==null&&!isNaN(index)){return(this.m_grouper_arr[index])?this.m_grouper_arr[index].label:"";
}});
MPageComponent.method("setGrouperEventSets",function(index,EventSetItem){if(index!==null&&!isNaN(index)){if(this.m_grouper_arr[index]){this.m_grouper_arr[index]["eventSets"]=EventSetItem;
}else{this.m_grouper_arr[index]={};
this.m_grouper_arr[index]["eventSets"]=EventSetItem;
}}});
MPageComponent.method("getGrouperEventSets",function(index){if(index!==null&&!isNaN(index)){return(this.m_grouper_arr[index])?this.m_grouper_arr[index].eventSets:"";
}});
MPageComponent.method("sortGrouperArrayByLabel",function(){this.m_grouper_arr.sort(function(a,b){var a;
var b;
if(a.label&&b.label){a=a.label.toUpperCase();
b=b.label.toUpperCase();
if(a<b){return -1;
}else{if(a===b){return 0;
}else{return 1;
}}}else{if(a.label){return 1;
}else{return -1;
}}});
});
MPageComponent.method("getSelectedTimeFrame",function(){return(this.m_selectedTimeFrame);
});
MPageComponent.method("setSelectedTimeFrame",function(value){this.m_selectedTimeFrame=value;
});
MPageComponent.method("getSelectedDataGroup",function(){return(this.m_selectedDataGroup);
});
MPageComponent.method("setSelectedDataGroup",function(value){this.m_selectedDataGroup=value;
});
}function MPageComponentInteractive(){this.m_DocPrivObj=null;
this.m_DocPrivMask=0;
MPageComponentInteractive.method("setPrivObj",function(value){this.m_DocPrivObj=value;
});
MPageComponentInteractive.method("getDocPrivObj",function(){return(m_DocPrivObj);
});
MPageComponentInteractive.method("setIsCompViewable",function(value){this.m_isCompViewable=value;
});
MPageComponentInteractive.method("setIsCompAddable",function(value){this.m_isCompAddable=value;
});
MPageComponentInteractive.method("setIsCompModifiable",function(value){this.m_isCompModifiable=value;
});
MPageComponentInteractive.method("setIsCompUnchartable",function(value){this.m_isCompUnchartable=value;
});
MPageComponentInteractive.method("setIsCompSignable",function(value){this.m_isCompSignable=value;
});
MPageComponentInteractive.method("getCompPrivMask",function(){var VIEW_MASK=parseInt("1",2);
var ADD_MASK=parseInt("10",2);
var MODIFY_MASK=parseInt("100",2);
var UNCHART_MASK=parseInt("1000",2);
var SIGN_MASK=parseInt("10000",2);
var privMask=0;
privMask=((this.m_isCompViewable)?VIEW_MASK:0)|((this.m_isCompAddable)?ADD_MASK:0)|((this.m_isCompModifiable)?MODIFY_MASK:0)|((this.m_isCompUnchartable)?UNCHART_MASK:0)|((this.m_isCompSignable)?SIGN_MASK:0);
return(privMask);
});
MPageComponentInteractive.method("getPrivFromArray",function(eventCd,array){var i=array.length;
while(i--){if(eventCd==array[i].EVENT_CD){return(true);
}}return(false);
});
MPageComponentInteractive.method("isResultEventCodeSignable",function(eventCd){if(this.getPrivFromArray(eventCd,m_DocPrivObj.getResponse().EVENT_PRIVILEGES.VIEW_RESULTS.GRANTED.EVENT_CODES)){return(true);
}else{return(false);
}});
MPageComponentInteractive.method("isResultEventCodeAddable",function(eventCd){if(this.getPrivFromArray(eventCd,m_DocPrivObj.getResponse().EVENT_PRIVILEGES.ADD_DOCUMENTATION.GRANTED.EVENT_CODES)){return(true);
}else{return(false);
}});
MPageComponentInteractive.method("isResultEventCodeModifiable",function(eventCd){if(this.getPrivFromArray(eventCd,m_DocPrivObj.getResponse().EVENT_PRIVILEGES.MODIFY_DOCUMENTATION.GRANTED.EVENT_CODES)){return(true);
}else{return(false);
}});
MPageComponentInteractive.method("isResultEventCodeUnchartable",function(eventCd){if(this.getPrivFromArray(eventCd,m_DocPrivObj.getResponse().EVENT_PRIVILEGES.UNCHART_DOCUMENTATION.GRANTED.EVENT_CODES)){return(true);
}else{return(false);
}});
MPageComponentInteractive.method("isResultEventCodeSignable",function(eventCd){if(this.getPrivFromArray(eventCd,m_DocPrivObj.getResponse().EVENT_PRIVILEGES.SIGN_DOCUMENTATION.GRANTED.EVENT_CODES)){return(true);
}else{return(false);
}});
MPageComponentInteractive.method("getEventCdPrivs",function(component,eventArr){var criterion=this.getCriterion();
var paramEventCd=MP_Util.CreateParamArray(eventArr,1);
var paramPrivMask=this.getCompPrivMask();
var sendAr=["^MINE^",criterion.provider_id+".0",paramEventCd,"0.0",paramPrivMask,criterion.ppr_cd+".0"];
var request=new MP_Core.ScriptRequest(this,"ENG:MPG.MPCINTERACTIVE - Get Doc prefs");
request.setParameters(sendAr);
request.setName("getCompPrivs");
request.setProgramName("MP_GET_PRIVS_BY_CODE_JSON");
request.setAsync(false);
MP_Core.XMLCCLRequestCallBack(component,request,this.processEventCdReply);
});
MPageComponentInteractive.method("processEventCdReply",function(reply){m_DocPrivObj=reply;
});
}MPageComponentInteractive.inherits(MPageComponent);
function MPageGrouper(){this.m_groups=null;
MPageGrouper.method("setGroups",function(value){this.m_groups=value;
});
MPageGrouper.method("getGroups",function(){return this.m_groups;
});
MPageGrouper.method("addGroup",function(value){if(this.m_groups===null){this.m_groups=[];
}this.m_groups.push(value);
});
}MPageGrouper.inherits(MPageGroup);
function MPageGroup(){this.m_groupName="";
this.m_groupSeq=0;
this.m_groupId=0;
MPageGroup.method("setGroupId",function(value){this.m_groupId=value;
});
MPageGroup.method("getGroupId",function(){return this.m_groupId;
});
MPageGroup.method("setGroupName",function(value){this.m_groupName=value;
});
MPageGroup.method("getGroupName",function(){return this.m_groupName;
});
MPageGroup.method("setSequence",function(value){this.m_groupSeq=value;
});
MPageGroup.method("getSequence",function(){return this.m_groupSeq;
});
}function MPageEventSetGroup(){this.m_eventSets=null;
this.m_isSequenced=false;
MPageEventSetGroup.method("isSequenced",function(){return this.m_isSequenced;
});
MPageEventSetGroup.method("setSequenced",function(value){this.m_isSequenced=value;
});
MPageEventSetGroup.method("getEventSets",function(){return this.m_eventSets;
});
MPageEventSetGroup.method("setEventSets",function(value){this.m_eventSets=value;
});
MPageEventSetGroup.method("addEventSet",function(value){if(this.m_eventSets===null){this.m_eventSets=[];
}this.m_eventSets.push(value);
});
}MPageEventSetGroup.inherits(MPageGroup);
function MPageEventCodeGroup(){this.m_eventCodes=null;
this.m_isSequenced=false;
MPageEventCodeGroup.method("isSequenced",function(){return this.m_isSequenced;
});
MPageEventCodeGroup.method("setSequenced",function(value){this.m_isSequenced=value;
});
MPageEventCodeGroup.method("getEventCodes",function(){return this.m_eventCodes;
});
MPageEventCodeGroup.method("setEventCodes",function(value){this.m_eventCodes=value;
});
MPageEventCodeGroup.method("addEventCode",function(value){if(this.m_eventCodes===null){this.m_eventCodes=[];
}this.m_eventCodes.push(value);
});
}MPageEventCodeGroup.inherits(MPageGroup);
function MPageCodeValueGroup(){this.m_codes=null;
MPageCodeValueGroup.method("getCodes",function(){return this.m_codes;
});
MPageCodeValueGroup.method("setCodes",function(value){this.m_codes=value;
});
MPageCodeValueGroup.method("addCode",function(value){if(this.m_codes===null){this.m_codes=[];
}this.m_codes.push(value);
});
}MPageCodeValueGroup.inherits(MPageGroup);
function MPageSequenceGroup(){this.m_items=null;
this.m_mapItems=null;
this.m_isMultiType=false;
MPageSequenceGroup.method("getItems",function(){return this.m_items;
});
MPageSequenceGroup.method("setItems",function(value){this.m_items=value;
});
MPageSequenceGroup.method("addItem",function(value){if(this.m_items===null){this.m_items=[];
}this.m_items.push(value);
});
MPageSequenceGroup.method("setMultiValue",function(value){this.m_isMultiType=value;
});
MPageSequenceGroup.method("isMultiValue",function(){return(this.m_isMultiType);
});
MPageSequenceGroup.method("getMapItems",function(){return this.m_mapItems;
});
MPageSequenceGroup.method("setMapItems",function(value){this.m_mapItems=value;
});
}MPageSequenceGroup.inherits(MPageGroup);
function MPageGroupValue(){this.m_id=0;
this.m_name="";
MPageGroupValue.method("getId",function(){return this.m_id;
});
MPageGroupValue.method("setId",function(value){this.m_id=value;
});
MPageGroupValue.method("getName",function(){return this.m_name;
});
MPageGroupValue.method("setName",function(value){this.m_name=value;
});
}function ComponentStyle(){this.m_nameSpace="";
this.m_id="";
this.m_className="section";
this.m_contentId="";
this.m_contentClass="sec-content";
this.m_headerClass="sec-hd";
this.m_headToggle="sec-hd-tgl";
this.m_secTitle="sec-title";
this.m_aLink="";
this.m_secTotal="sec-total";
this.m_info="";
this.m_subSecHeaderClass="sub-sec-hd";
this.m_subSecTitleClass="sub-sec-title";
this.m_subSecContentClass="sub-sec-content";
this.m_contentBodyClass="content-body";
this.m_searchBoxDiv="search-box-div";
this.m_subTitleDisp="sub-title-disp";
this.m_componentId=0;
this.m_color="";
ComponentStyle.method("initByNamespace",function(value){this.m_nameSpace=value;
this.m_id=value;
this.m_className+=(" "+value+"-sec");
this.m_contentId=value+"Content";
this.m_aLink=value+"Link";
this.m_info=value+"-info";
});
ComponentStyle.method("getNameSpace",function(){return this.m_nameSpace;
});
ComponentStyle.method("getId",function(){return this.m_id+this.m_componentId;
});
ComponentStyle.method("getClassName",function(){return this.m_className;
});
ComponentStyle.method("getColor",function(){return this.m_color;
});
ComponentStyle.method("getContentId",function(){return this.m_contentId+this.m_componentId;
});
ComponentStyle.method("getContentBodyClass",function(){return this.m_contentBodyClass;
});
ComponentStyle.method("getContentClass",function(){return this.m_contentClass;
});
ComponentStyle.method("getHeaderClass",function(){return this.m_headerClass;
});
ComponentStyle.method("getHeaderToggle",function(){return this.m_headToggle;
});
ComponentStyle.method("getTitle",function(){return this.m_secTitle;
});
ComponentStyle.method("getLink",function(){return this.m_aLink;
});
ComponentStyle.method("getTotal",function(){return this.m_secTotal;
});
ComponentStyle.method("getInfo",function(){return this.m_info;
});
ComponentStyle.method("getSearchBoxDiv",function(){return this.m_searchBoxDiv;
});
ComponentStyle.method("getSubSecContentClass",function(){return this.m_subSecContentClass;
});
ComponentStyle.method("getSubSecContentClass",function(){return this.m_subSecContentClass;
});
ComponentStyle.method("getSubSecHeaderClass",function(){return this.m_subSecHeaderClass;
});
ComponentStyle.method("getSubSecTitleClass",function(){return this.m_subSecTitleClass;
});
ComponentStyle.method("getSubTitleDisp",function(){return this.m_subTitleDisp;
});
ComponentStyle.method("setComponentId",function(value){this.m_componentId=value;
});
ComponentStyle.method("setNameSpace",function(value){this.m_nameSpace=value;
});
ComponentStyle.method("setId",function(value){this.m_id=value;
});
ComponentStyle.method("setClassName",function(value){this.m_className=value;
});
ComponentStyle.method("setColor",function(value){this.m_color=value;
this.setClassName(this.getClassName()+" "+value);
});
ComponentStyle.method("setContextId",function(value){this.m_contentId=value;
});
ComponentStyle.method("setContentBodyClass",function(value){this.m_contentBodyClass=value;
});
ComponentStyle.method("setContentClass",function(value){this.m_contentClass=value;
});
ComponentStyle.method("setContextClass",function(value){this.m_contentClass=value;
});
ComponentStyle.method("setHeaderClass",function(value){this.m_headerClass=value;
});
ComponentStyle.method("setHeaderToggle",function(value){this.m_headToggle=value;
});
ComponentStyle.method("setSearchBoxDiv",function(value){this.m_searchBoxDiv=value;
});
ComponentStyle.method("setSubSecContentClass",function(value){this.m_subSecContentClass=value;
});
ComponentStyle.method("setSubSecHeaderClass",function(value){this.m_subSecHeaderClass=value;
});
ComponentStyle.method("setSubSecTitleClass",function(value){this.m_subSecTitleClass=value;
});
ComponentStyle.method("setSubTitleDisp",function(value){this.m_subTitleDisp=value;
});
ComponentStyle.method("setTitle",function(value){this.m_secTitle=value;
});
ComponentStyle.method("setLink",function(value){this.m_aLink=value;
});
ComponentStyle.method("setTotal",function(value){this.m_secTotal=value;
});
ComponentStyle.method("setInfo",function(value){this.m_info=value;
});
}function MPageView(){this.pageId=0;
this.name=null;
this.components=null;
this.banner=true;
this.helpFileName="";
this.helpFileURL="";
this.criterion=null;
this.componentIds=null;
this.isCustomizeView=false;
this.m_isCustomizeEnabled=true;
this.m_titleAnchors=null;
this.m_csEnabled=false;
this.printableReportName=null;
MPageView.method("getTitleAnchors",function(){return this.m_titleAnchors;
});
MPageView.method("setTitleAnchors",function(value){this.m_titleAnchors=value;
});
MPageView.method("addTitleAnchor",function(value){if(this.m_titleAnchors===null){this.m_titleAnchors=[];
}this.m_titleAnchors.push(value);
});
MPageView.method("getCustomizeEnabled",function(){return this.m_isCustomizeEnabled;
});
MPageView.method("setCustomizeEnabled",function(value){this.m_isCustomizeEnabled=value;
});
MPageView.method("getCustomizeView",function(){return this.isCustomizeView;
});
MPageView.method("setCustomizeView",function(value){this.isCustomizeView=value;
});
MPageView.method("getComponentIds",function(){return(this.componentIds);
});
MPageView.method("setComponentIds",function(value){this.componentIds=value;
});
MPageView.method("addComponentId",function(value){if(this.componentIds===null){this.componentIds=[];
}this.componentIds.push(value);
});
MPageView.method("getCriterion",function(){return(this.criterion);
});
MPageView.method("setCriterion",function(value){this.criterion=value;
});
MPageView.method("getHelpFileName",function(){return this.helpFileName;
});
MPageView.method("setHelpFileName",function(value){this.helpFileName=value;
});
MPageView.method("getHelpFileURL",function(){return this.helpFileURL;
});
MPageView.method("setHelpFileURL",function(value){this.helpFileURL=value;
});
MPageView.method("isBannerEnabled",function(){return this.banner;
});
MPageView.method("setBannerEnabled",function(value){this.banner=value;
});
MPageView.method("isChartSearchEnabled",function(){return this.m_csEnabled;
});
MPageView.method("setChartSearchEnabled",function(value){this.m_csEnabled=value;
});
MPageView.method("setPrintableReportName",function(value){this.printableReportName=value;
});
MPageView.method("getPrintableReportName",function(){return this.printableReportName;
});
MPageView.method("getPageId",function(){return this.pageId;
});
MPageView.method("setPageId",function(value){this.pageId=value;
});
MPageView.method("getName",function(){return this.name;
});
MPageView.method("setName",function(value){this.name=value;
});
MPageView.method("getComponents",function(){return this.components;
});
MPageView.method("setComponents",function(value){this.components=value;
});
MPageView.method("addComponent",function(value){if(this.components===null){this.components=[];
}this.components.push(value);
});
}function SortMPageComponentRows(c1,c2){if(c1.getSequence()<c2.getSequence()){return -1;
}if(c1.getSequence()>c2.getSequence()){return 1;
}return 0;
}function SortMPageComponentCols(c1,c2){if(c1.getColumn()<c2.getColumn()){return -1;
}if(c1.getColumn()>c2.getColumn()){return 1;
}return SortMPageComponentRows(c1,c2);
}function SortMPageComponents(c1,c2){if(c1.getPageGroupSequence()<c2.getPageGroupSequence()){return -1;
}if(c1.getPageGroupSequence()>c2.getPageGroupSequence()){return 1;
}return SortMPageComponentCols(c1,c2);
}
var CERN_EventListener=null;
var CERN_MPageComponents=null;
var CERN_TabManagers=null;
var CERN_MPages=null;
var CK_DATA={};
var STR_PAD_LEFT=1;
var STR_PAD_RIGHT=2;
var STR_PAD_BOTH=3;
Array.prototype.addAll=function(v){if(v&&v.length>0){for(var x=0,xl=v.length;
x<xl;
x++){this.push(v[x]);
}}};
var MP_Core=function(){return{Criterion:function(jsCrit,static_content){var m_patInfo=null;
var m_prsnlInfo=null;
var m_periop_cases=null;
var m_encntrOverride=[];
this.person_id=jsCrit.PERSON_ID;
this.encntr_id=(jsCrit.ENCNTRS.length>0)?jsCrit.ENCNTRS[0].ENCNTR_ID:0;
this.provider_id=jsCrit.PRSNL_ID;
this.executable=jsCrit.EXECUTABLE;
this.static_content=static_content;
this.position_cd=jsCrit.POSITION_CD;
this.ppr_cd=jsCrit.PPR_CD;
this.debug_ind=(jsCrit.DEBUG_IND==1)?true:false;
this.help_file_local_ind=jsCrit.HELP_FILE_LOCAL_IND;
this.category_mean=jsCrit.CATEGORY_MEAN;
this.locale_id=(this.debug_ind)?"en_us":jsCrit.LOCALE_ID;
this.device_location="";
var encntrOR=jsCrit.ENCNTR_OVERRIDE;
if(encntrOR){for(var x=encntrOR.length;
x--;
){m_encntrOverride.push(encntrOR[x].ENCNTR_ID);
}}else{m_encntrOverride.push(this.encntr_id);
}this.setPatientInfo=function(value){m_patInfo=value;
};
this.getPatientInfo=function(){return m_patInfo;
};
this.setPeriopCases=function(value){m_periop_cases=value;
};
this.getPeriopCases=function(){return m_periop_cases;
};
this.getPersonnelInfo=function(){if(!m_prsnlInfo){m_prsnlInfo=new MP_Core.PersonnelInformation(this.provider_id,this.person_id);
}return m_prsnlInfo;
};
this.getEncounterOverride=function(){return m_encntrOverride;
};
},PatientInformation:function(){var m_dob=null;
var m_sex=null;
this.setSex=function(value){m_sex=value;
};
this.getSex=function(){return m_sex;
};
this.setDOB=function(value){m_dob=value;
};
this.getDOB=function(){return m_dob;
};
},PeriopCases:function(){var m_case_id=null;
var m_prior_ind=null;
var m_days=null;
var m_hours=null;
var m_mins=null;
var m_cntdwn_desc_flag=null;
this.setCaseID=function(value){m_case_id=value;
};
this.getCaseID=function(){return m_case_id;
};
this.setDays=function(value){m_days=value;
};
this.getDays=function(){return m_days;
};
this.setHours=function(value){m_hours=value;
};
this.getHours=function(){return m_hours;
};
this.setMins=function(value){m_mins=value;
};
this.getMins=function(){return m_mins;
};
this.setCntdwnDscFlg=function(value){m_cntdwn_desc_flag=value;
};
this.getCntdwnDscFlg=function(){return m_cntdwn_desc_flag;
};
},ScriptRequest:function(component,loadTimerName){var m_comp=component;
var m_load=loadTimerName;
var m_name="";
var m_programName="";
var m_params=null;
var m_async=true;
this.getComponent=function(){return m_comp;
};
this.getLoadTimer=function(){return m_load;
};
this.setName=function(value){m_name=value;
};
this.getName=function(){return m_name;
};
this.setProgramName=function(value){m_programName=value;
};
this.getProgramName=function(){return m_programName;
};
this.setParameters=function(value){m_params=value;
};
this.getParameters=function(){return m_params;
};
this.setAsync=function(value){m_async=value;
};
this.isAsync=function(){return m_async;
};
},ScriptReply:function(component){var m_name="";
var m_status="F";
var m_err="";
var m_resp=null;
var m_comp=component;
this.setName=function(value){m_name=value;
};
this.getName=function(){return m_name;
};
this.setStatus=function(value){m_status=value;
};
this.getStatus=function(){return m_status;
};
this.setError=function(value){m_err=value;
};
this.getError=function(){return m_err;
};
this.setResponse=function(value){m_resp=value;
};
this.getResponse=function(){return m_resp;
};
this.getComponent=function(){return m_comp;
};
},PersonnelInformation:function(prsnlId,patientId){var m_prsnlId=prsnlId;
var m_viewableEncntrs=null;
var patConObj=null;
try{patConObj=window.external.DiscernObjectFactory("PVCONTXTMPAGE");
MP_Util.LogDiscernInfo(null,"PVCONTXTMPAGE","mp_core.js","PersonnelInformation");
if(patConObj){m_viewableEncntrs=patConObj.GetValidEncounters(patientId);
MP_Util.LogDebug("Viewable Encounters: "+m_viewableEncntrs);
}}catch(e){}finally{patConObj=null;
}this.getPersonnelId=function(){return m_prsnlId;
};
this.getViewableEncounters=function(){return m_viewableEncntrs;
};
},XMLCclRequestWrapper:function(component,program,paramAr,async){var timerLoadComponent=MP_Util.CreateTimer(component.getComponentLoadTimerName(),component.getCriterion().category_mean);
var i18nCore=i18n.discernabu;
var info=new XMLCclRequest();
info.onreadystatechange=function(){var countText="";
var errMsg=null;
if(this.readyState==4&&this.status==200){try{MP_Util.LogScriptCallInfo(component,this,"mp_core.js","XMLCclRequestWrapper");
var jsonEval=JSON.parse(this.responseText);
var recordData=jsonEval.RECORD_DATA;
if(recordData.STATUS_DATA.STATUS=="Z"){countText=(component.isLineNumberIncluded()?"(0)":"");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()),component,countText);
}else{if(recordData.STATUS_DATA.STATUS=="S"){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName(),component.getCriterion().category_mean);
try{var rootComponentNode=component.getRootComponentNode();
var secTitle=Util.Style.g("sec-total",rootComponentNode,"span");
secTitle[0].innerHTML=i18nCore.RENDERING_DATA+"...";
component.HandleSuccess(recordData);
}catch(err){MP_Util.LogJSError(err,component,"mp_core.js","XMLCclRequestWrapper");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}else{MP_Util.LogScriptCallError(component,this,"mp_core.js","XMLCclRequestWrapper");
errMsg=[];
var ss=null;
errMsg.push("<b>",i18nCore.DISCERN_ERROR,"</b><br /><ul><li>",i18nCore.STATUS,": ",this.status,"</li><li>",i18nCore.REQUEST,": ",this.requestText,"</li>");
var statusData=recordData.STATUS_DATA;
if(statusData.SUBEVENTSTATUS.length&&statusData.SUBEVENTSTATUS.length>0){for(var x=0,xl=statusData.SUBEVENTSTATUS.length;
x<xl;
x++){ss=statusData.SUBEVENTSTATUS[x];
errMsg.push("<li>",i18nCore.ERROR_OPERATION,": ",ss.OPERATIONNAME,"</li><li>",i18nCore.ERROR_OPERATION_STATUS,": ",ss.OPERATIONSTATUS,"</li><li>",i18nCore.ERROR_TARGET_OBJECT,": ",ss.TARGETOBJECTNAME,"</li><li>",i18nCore.ERROR_TARGET_OBJECT_VALUE,": ",ss.TARGETOBJECTVALUE,"</li>");
}}else{if(statusData.SUBEVENTSTATUS.length===undefined){ss=statusData.SUBEVENTSTATUS;
errMsg.push("<li>",i18nCore.ERROR_OPERATION,": ",ss.OPERATIONNAME,"</li><li>",i18nCore.ERROR_OPERATION_STATUS,": ",ss.OPERATIONSTATUS,"</li><li>",i18nCore.ERROR_TARGET_OBJECT,": ",ss.TARGETOBJECTNAME,"</li><li>",i18nCore.ERROR_TARGET_OBJECT_VALUE,": ",ss.TARGETOBJECTVALUE,"</li>");
}}errMsg.push("</ul>");
countText=(component.isLineNumberIncluded()?"(0)":"");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
}}}catch(err){MP_Util.LogJSError(err,component,"mp_core.js","XMLCclRequestWrapper");
errMsg=[];
errMsg.push("<b>",i18nCore.JS_ERROR,"</b><br /><ul><li>",i18nCore.MESSAGE,": ",err.message,"</li><li>",i18nCore.NAME,": ",err.name,"</li><li>",i18nCore.NUMBER,": ",(err.number&65535),"</li><li>",i18nCore.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
if(timerLoadComponent){timerLoadComponent.Abort();
timerLoadComponent=null;
}}finally{if(timerLoadComponent){timerLoadComponent.Stop();
}}}else{if(this.readyState==4&&this.status!=200){MP_Util.LogScriptCallError(component,this,"mp_core.js","XMLCclRequestWrapper");
errMsg=[];
errMsg.push("<b>",i18nCore.DISCERN_ERROR,"</b><br /><ul><li>",i18nCore.STATUS,": ",this.status,"</li><li>",i18nCore.REQUEST,": ",this.requestText,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,"");
if(timerLoadComponent){timerLoadComponent.Abort();
}}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET",program,async);
info.send(paramAr.join(","));
},XMLCCLRequestCallBack:function(component,request,funcCallback){var timerLoad=MP_Util.CreateTimer(request.getLoadTimer());
var i18nCore=i18n.discernabu;
var info=new XMLCclRequest();
var reply=new MP_Core.ScriptReply(component);
reply.setName(request.getName());
info.onreadystatechange=function(){var errMsg=null;
if(this.readyState==4&&this.status==200){try{MP_Util.LogScriptCallInfo(component,this,"mp_core.js","XMLCclRequestCallBack");
var jsonEval=JSON.parse(info.responseText);
var recordData=jsonEval.RECORD_DATA;
var status=recordData.STATUS_DATA.STATUS;
reply.setStatus(status);
if(status=="Z"){reply.setResponse(recordData);
funcCallback(reply);
}else{if(status=="S"){reply.setResponse(recordData);
funcCallback(reply);
}else{MP_Util.LogScriptCallError(component,this,"mp_core.js","XMLCclRequestCallBack");
errMsg=[];
errMsg.push("<b>",i18nCore.DISCERN_ERROR,"</b><br /><ul><li>",i18nCore.STATUS,": ",this.status,"</li><li>",i18nCore.REQUEST,": ",this.requestText,"</li>");
var statusData=recordData.STATUS_DATA;
if(statusData.SUBEVENTSTATUS.length&&statusData.SUBEVENTSTATUS.length>0){for(var x=0,xl=statusData.SUBEVENTSTATUS.length;
x<xl;
x++){var ss=statusData.SUBEVENTSTATUS[x];
errMsg.push("<li>",i18nCore.ERROR_OPERATION,": ",ss.OPERATIONNAME,"</li><li>",i18nCore.ERROR_OPERATION_STATUS,": ",ss.OPERATIONSTATUS,"</li><li>",i18nCore.ERROR_TARGET_OBJECT,": ",ss.TARGETOBJECTNAME,"</li><li>",i18nCore.ERROR_TARGET_OBJECT_VALUE,": ",ss.TARGETOBJECTVALUE,"</li>");
}}else{if(statusData.SUBEVENTSTATUS.length==undefined){var ss=statusData.SUBEVENTSTATUS;
errMsg.push("<li>",i18nCore.ERROR_OPERATION,": ",ss.OPERATIONNAME,"</li><li>",i18nCore.ERROR_OPERATION_STATUS,": ",ss.OPERATIONSTATUS,"</li><li>",i18nCore.ERROR_TARGET_OBJECT,": ",ss.TARGETOBJECTNAME,"</li><li>",i18nCore.ERROR_TARGET_OBJECT_VALUE,": ",ss.TARGETOBJECTVALUE,"</li>");
}}errMsg.push("</ul>");
reply.setError(errMsg.join(""));
funcCallback(reply);
}}}catch(err){MP_Util.LogJSError(err,component,"mp_core.js","XMLCclRequestCallBack");
errMsg=[];
errMsg.push("<b>",i18nCore.DISCERN_ERROR,"</b><br /><ul><li>",i18nCore.STATUS,": ",this.status,"</li><li>",i18nCore.REQUEST,": ",this.requestText,"</li></ul>");
reply.setError(errMsg.join(""));
if(timerLoad){timerLoad.Abort();
timerLoad=null;
}}finally{if(timerLoad){timerLoad.Stop();
}}}else{if(info.readyState==4&&info.status!=200){MP_Util.LogScriptCallError(component,this,"mp_core.js","XMLCclRequestCallBack");
errMsg=[];
errMsg.push("<b>",i18nCore.DISCERN_ERROR,"</b><br /><ul><li>",i18nCore.STATUS,": ",this.status,"</li><li>",i18nCore.REQUEST,": ",this.requestText,"</li></ul>");
reply.setError(errMsg.join(""));
if(timerLoad){timerLoad.Abort();
}funcCallback(reply);
}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET",request.getProgramName(),request.isAsync());
info.send(request.getParameters().join(","));
},XMLCCLRequestThread:function(name,component,request){var m_name=name;
var m_comp=component;
var m_request=request;
m_request.setName(name);
this.getName=function(){return m_name;
};
this.getComponent=function(){return m_comp;
};
this.getRequest=function(){return m_request;
};
},XMLCCLRequestThreadManager:function(callbackFunction,component,handleFinalize){var m_threads=null;
var m_replyAr=null;
var m_isData=false;
var m_isError=false;
this.addThread=function(thread){if(!m_threads){m_threads=[];
}m_threads.push(thread);
};
this.begin=function(){if(m_threads&&m_threads.length>0){for(x=m_threads.length;
x--;
){var thread=m_threads[x];
MP_Core.XMLCCLRequestCallBack(thread.getComponent(),thread.getRequest(),this.completeThread);
}}else{if(handleFinalize){var countText=(component.isLineNumberIncluded()?"(0)":"");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()),component,countText);
}else{callbackFunction(null,component);
}}};
this.completeThread=function(reply){if(!m_replyAr){m_replyAr=[];
}if(reply.getStatus()==="S"){m_isData=true;
}else{if(reply.getStatus()==="F"){m_isError=true;
}}m_replyAr.push(reply);
if(m_replyAr.length===m_threads.length){var countText=(component.isLineNumberIncluded()?"(0)":"");
var errMsg=null;
try{if(handleFinalize){if(m_isError){errMsg=[];
for(var x=m_replyAr.length;
x--;
){var rep=m_replyAr[x];
if(rep.getStatus()==="F"){errMsg.push(rep.getError());
}}MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("<br />")),component,"");
}else{if(!m_isData){countText=(component.isLineNumberIncluded()?"(0)":"");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()),component,countText);
}else{callbackFunction(m_replyAr,component);
}}}else{callbackFunction(m_replyAr,component);
}}catch(err){MP_Util.LogJSError(err,component,"mp_core.js","XMLCCLRequestThreadManager");
var i18nCore=i18n.discernabu;
errMsg=["<b>",i18nCore.JS_ERROR,"</b><br /><ul><li>",i18nCore.MESSAGE,": ",err.message,"</li><li>",i18nCore.NAME,": ",err.name,"</li><li>",i18nCore.NUMBER,": ",(err.number&65535),"</li><li>",i18nCore.DESCRIPTION,": ",err.description,"</li></ul>"];
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
}}};
},MapObject:function(name,value){this.name=name;
this.value=value;
},TabItem:function(key,name,components,prefIdentifier){this.key=key;
this.name=name;
this.components=components;
this.prefIdentifier=prefIdentifier;
},TabManager:function(tabItem){var m_isLoaded=false;
var m_tabItem=tabItem;
var m_isExpandAll=false;
var m_isSelected=false;
this.toggleExpandAll=function(){m_isExpandAll=(!m_isExpandAll);
};
this.loadTab=function(){if(!m_isLoaded){m_isLoaded=true;
var components=m_tabItem.components;
if(components){for(var xl=components.length;
xl--;
){var component=components[xl];
if(component.isDisplayable()){component.InsertData();
}}}}};
this.getTabItem=function(){return m_tabItem;
};
this.getSelectedTab=function(){return m_isSelected;
};
this.setSelectedTab=function(value){m_isSelected=value;
};
},ReferenceRangeResult:function(){var m_valNLow=-1,m_valNHigh=-1,m_valCLow=-1,m_valCHigh=-1;
var m_uomNLow=null,m_uomNHigh=null,m_uomCLow=null,m_uomCHigh=null;
this.init=function(refRange,codeArray){var nf=MP_Util.GetNumericFormatter();
m_valCLow=nf.format(refRange.CRITICAL_LOW.NUMBER);
if(refRange.CRITICAL_LOW.UNIT_CD!=""){m_uomCLow=MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD,codeArray);
}m_valCHigh=nf.format(refRange.CRITICAL_HIGH.NUMBER);
if(refRange.CRITICAL_HIGH.UNIT_CD!=""){m_uomCHigh=MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD,codeArray);
}m_valNLow=nf.format(refRange.NORMAL_LOW.NUMBER);
if(refRange.NORMAL_LOW.UNIT_CD!=""){m_uomNLow=MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD,codeArray);
}m_valNHigh=nf.format(refRange.NORMAL_HIGH.NUMBER);
if(refRange.NORMAL_HIGH.UNIT_CD!=""){m_uomNHigh=MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD,codeArray);
}};
this.getNormalLow=function(){return m_valNLow;
};
this.getNormalHigh=function(){return m_valNHigh;
};
this.getNormalLowUOM=function(){return m_uomNLow;
};
this.getNormalHighUOM=function(){return m_uomNHigh;
};
this.getCriticalLow=function(){return m_valCLow;
};
this.getCriticalHigh=function(){return m_valCHigh;
};
this.getCriticalLowUOM=function(){return m_uomCLow;
};
this.getCriticalHighUOM=function(){return m_uomCHigh;
};
this.toNormalInlineString=function(){var low=(m_uomNLow)?m_uomNLow.display:"";
var high=(m_uomNHigh)?m_uomNHigh.display:"";
if(m_valNLow!=0||m_valNHigh!=0){return(m_valNLow+"&nbsp;"+low+" - "+m_valNHigh+"&nbsp;"+high);
}else{return"";
}};
this.toCriticalInlineString=function(){var low=(m_uomCLow)?m_uomCLow.display:"";
var high=(m_uomCHigh)?m_uomCHigh.display:"";
if(m_valCLow!=0||m_valCHigh!=0){return(m_valCLow+"&nbsp;"+low+" - "+m_valCHigh+"&nbsp;"+high);
}else{return"";
}};
},QuantityValue:function(){var m_val,m_precision;
var m_uom=null;
var m_refRange=null;
var m_rawValue=0;
var m_hasModifier=false;
this.init=function(result,codeArray){var quantityValue=result.QUANTITY_VALUE;
var referenceRange=result.REFERENCE_RANGE;
for(var l=0,ll=quantityValue.length;
l<ll;
l++){var numRes=quantityValue[l].NUMBER;
m_precision=quantityValue[l].PRECISION;
if(!isNaN(numRes)){m_val=MP_Util.Measurement.SetPrecision(numRes,m_precision);
m_rawValue=numRes;
}if(quantityValue[l].MODIFIER_CD!=""){var modCode=MP_Util.GetValueFromArray(quantityValue[l].MODIFIER_CD,codeArray);
if(modCode){m_val=modCode.display+m_val;
m_hasModifier=true;
}}if(quantityValue[l].UNIT_CD!=""){m_uom=MP_Util.GetValueFromArray(quantityValue[l].UNIT_CD,codeArray);
}for(var m=0,ml=referenceRange.length;
m<ml;
m++){m_refRange=new MP_Core.ReferenceRangeResult();
m_refRange.init(referenceRange[m],codeArray);
}}};
this.getValue=function(){return m_val;
};
this.getRawValue=function(){return m_rawValue;
};
this.getUOM=function(){return m_uom;
};
this.getRefRange=function(){return m_refRange;
};
this.getPrecision=function(){return m_precision;
};
this.toString=function(){if(m_uom){return(m_val+" "+m_uom.display);
}return m_val;
};
this.hasModifier=function(){return m_hasModifier;
};
},Measurement:function(){var m_eventId=0;
var m_personId=0;
var m_encntrId=0;
var m_eventCode=null;
var m_dateTime=null;
var m_updateDateTime=null;
var m_result=null;
var m_normalcy=null;
var m_status=null;
this.init=function(eventId,personId,encntrId,eventCode,dateTime,resultObj,updateDateTime){m_eventId=eventId;
m_personId=personId;
m_encntrId=encntrId;
m_eventCode=eventCode;
m_dateTime=dateTime;
m_result=resultObj;
m_updateDateTime=updateDateTime;
};
this.initFromRec=function(measObj,codeArray){var effectiveDateTime=new Date();
var updateDateTime=new Date();
m_eventId=measObj.EVENT_ID;
m_personId=measObj.PATIENT_ID;
m_encntrId=measObj.ENCOUNTER_ID;
m_eventCode=MP_Util.GetValueFromArray(measObj.EVENT_CD,codeArray);
effectiveDateTime.setISO8601(measObj.EFFECTIVE_DATE);
m_dateTime=effectiveDateTime;
m_result=MP_Util.Measurement.GetObject(measObj,codeArray);
updateDateTime.setISO8601(measObj.UPDATE_DATE);
m_updateDateTime=updateDateTime;
m_normalcy=MP_Util.GetValueFromArray(measObj.NORMALCY_CD,codeArray);
m_status=MP_Util.GetValueFromArray(measObj.STATUS_CD,codeArray);
};
this.getEventId=function(){return m_eventId;
};
this.getPersonId=function(){return m_personId;
};
this.getEncntrId=function(){return m_encntrId;
};
this.getEventCode=function(){return m_eventCode;
};
this.getDateTime=function(){return m_dateTime;
};
this.getUpdateDateTime=function(){return m_updateDateTime;
};
this.getResult=function(){return m_result;
};
this.setNormalcy=function(value){m_normalcy=value;
};
this.getNormalcy=function(){return m_normalcy;
};
this.setStatus=function(value){m_status=value;
};
this.getStatus=function(){return m_status;
};
this.isModified=function(){if(m_status){var mean=m_status.meaning;
if(mean==="MODIFIED"||mean==="ALTERED"){return true;
}}return false;
};
},MenuItem:function(){var m_name="";
var m_desc="";
var m_id=0;
var m_meaning;
this.setDescription=function(value){m_desc=value;
};
this.getDescription=function(){return m_desc;
};
this.setName=function(value){m_name=value;
};
this.getName=function(){return m_name;
};
this.setId=function(value){m_id=value;
};
this.getId=function(){return m_id;
};
this.setMeaning=function(value){m_meaning=value;
};
this.getMeaning=function(){return m_meaning;
};
},CriterionFilters:function(criterion){var m_criterion=criterion;
var m_evalAr=[];
this.addFilter=function(type,value){m_evalAr.push(new MP_Core.MapObject(type,value));
};
this.checkFilters=function(){var pass=false;
var patInfo=m_criterion.getPatientInfo();
for(var x=m_evalAr.length;
x--;
){var filter=m_evalAr[x];
var dob=null;
switch(filter.name){case MP_Core.CriterionFilters.SEX_MEANING:var sex=patInfo.getSex();
if(sex){if(filter.value==sex.meaning){continue;
}}return false;
case MP_Core.CriterionFilters.DOB_OLDER_THAN:dob=patInfo.getDOB();
if(dob){if(dob<=filter.value){continue;
}}return false;
case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:dob=patInfo.getDOB();
if(dob){if(dob>=filter.value){continue;
}}return false;
default:alert("Unhandled criterion filter");
return false;
}}return true;
};
},CreateSimpleError:function(component,sMessage){var errMsg=[];
var i18nCore=i18n.discernabu;
var countText=(component.isLineNumberIncluded()?"(0)":"");
errMsg.push("<b>",i18nCore.DISCERN_ERROR,"</b><br /><ul><li>",sMessage,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
}};
}();
MP_Core.CriterionFilters.SEX_MEANING=1;
MP_Core.CriterionFilters.DOB_OLDER_THAN=2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN=3;
MP_Core.AppUserPreferenceManager=function(){var m_criterion=null;
var m_prefIdent="";
var m_jsonObject=null;
return{Initialize:function(criterion,preferenceIdentifier){m_criterion=criterion;
m_prefIdent=preferenceIdentifier;
m_jsonObject=null;
},SetPreferences:function(prefString){var jsonEval=JSON.parse(prefString);
m_jsonObject=jsonEval;
},LoadPreferences:function(){if(!m_criterion){alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
return null;
}if(m_jsonObject){return;
}else{var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){MP_Util.LogScriptCallInfo(null,this,"mp_core.js","LoadPreferences");
var jsonEval=JSON.parse(this.responseText);
var recordData=jsonEval.RECORD_DATA;
if(recordData.STATUS_DATA.STATUS=="S"){m_jsonObject=JSON.parse(recordData.PREF_STRING);
}else{if(recordData.STATUS_DATA.STATUS=="Z"){return;
}else{MP_Util.LogScriptCallError(null,this,"mp_core.js","LoadPreferences");
var errAr=[];
var statusData=recordData.STATUS_DATA;
errAr.push("STATUS: "+statusData.STATUS);
for(var x=0,xl=statusData.SUBEVENTSTATUS.length;
x<xl;
x++){var ss=statusData.SUBEVENTSTATUS[x];
errAr.push(ss.OPERATIONNAME,ss.OPERATIONSTATUS,ss.TARGETOBJECTNAME,ss.TARGETOBJECTVALUE);
}window.status="Error retrieving user preferences "+errAr.join(",");
return;
}}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_GET_USER_PREFS",false);
var ar=["^mine^",m_criterion.provider_id+".0","^"+m_prefIdent+"^"];
info.send(ar.join(","));
return;
}},GetPreferences:function(){if(!m_criterion){alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
return null;
}if(!m_jsonObject){this.LoadPreferences();
}return m_jsonObject;
},SavePreferences:function(){var body=document.body;
var groups=Util.Style.g("col-group",body,"div");
var grpId=0;
var colId=0;
var rowId=0;
var compId=0;
var jsonObject={};
var userPrefs=jsonObject.user_prefs={};
var pagePrefs=userPrefs.page_prefs={};
var components=pagePrefs.components=[];
var cclParams=[];
for(var x=0,xl=groups.length;
x<xl;
x++){grpId=x+1;
var liqLay=Util.Style.g("col-outer1",groups[x],"div");
if(liqLay.length>0){var cols=Util.gcs(liqLay[0]);
for(var y=0,yl=cols.length;
y<yl;
y++){colId=y+1;
var rows=Util.gcs(cols[y]);
for(var z=0,zl=rows.length;
z<zl;
z++){var component=new Object();
rowId=z+1;
compId=jQuery(rows[z]).attr("id");
var compObj=MP_Util.GetCompObjByStyleId(compId);
component.id=compObj.getComponentId();
component.group_seq=grpId;
component.col_seq=colId;
component.row_seq=rowId;
component.lookbackunits=compObj.getLookbackUnits();
component.lookbacktypeflag=compObj.getLookbackUnitTypeFlag();
component.grouperFilterLabel=compObj.getGrouperFilterLabel();
component.grouperFilterEventSets=compObj.getGrouperFilterEventSets();
component.selectedTimeFrame=compObj.getSelectedTimeFrame();
component.selectedDataGroup=compObj.getSelectedDataGroup();
if(jQuery(rows[z]).hasClass("closed")){component.expanded=false;
}else{component.expanded=true;
}components.push(component);
}}}}WritePreferences(jsonObject);
if(typeof m_viewpointJSON=="undefined"){cclParams.push("^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+m_criterion.category_mean+"^",m_criterion.debug_ind);
CCLLINK("MP_DRIVER",cclParams.join(","),1);
}else{var viewpointJSON=JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
m_jsonObject=jsonObject;
cclParams.push("^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+viewpointJSON.VIEWPOINT_NAME_KEY+"^",m_criterion.debug_ind,"^^",0,"^"+viewpointJSON.ACTIVE_VIEW_CAT_MEAN+"^");
CCLLINK("MP_VIEWPOINT_DRIVER",cclParams.join(","),1);
}},ClearCompPreferences:function(componentId){var compObj=MP_Util.GetCompObjById(componentId);
var style=compObj.getStyles();
var ns=style.getNameSpace();
var prefObj=m_jsonObject;
var filterArr=null;
if(prefObj!=null){var strEval=JSON.parse(JSON.stringify(prefObj));
var strObj=strEval.user_prefs.page_prefs.components;
for(var x=strObj.length;
x--;
){if(strEval&&strObj[x].id===componentId){strObj[x].lookbackunits=compObj.getBrLookbackUnits();
strObj[x].lookbacktypeflag=compObj.getBrLookbackUnitTypeFlag();
strObj[x].grouperFilterLabel="";
strObj[x].grouperFilterEventSets=filterArr;
strObj[x].selectedTimeFrame="";
strObj[x].selectedDataGroup="";
}}compObj.setLookbackUnits(compObj.getBrLookbackUnits());
compObj.setLookbackUnitTypeFlag(compObj.getBrLookbackUnitTypeFlag());
compObj.setGrouperFilterLabel("");
compObj.setGrouperFilterEventSets(filterArr);
compObj.setSelectedTimeFrame("");
compObj.setSelectedDataGroup("");
m_jsonObject=strEval;
WritePreferences(m_jsonObject);
MP_Util.Doc.CreateLookBackMenu(compObj,2,"");
if(ns==="lab"||ns==="dg"){var contentNode=compObj.getSectionContentNode().innerHTML="";
}compObj.InsertData();
}},SaveCompPreferences:function(componentId){var compObj=MP_Util.GetCompObjById(componentId);
var prefObj=m_jsonObject;
if(prefObj!=null){var strEval=JSON.parse(JSON.stringify(prefObj));
var strObj=strEval.user_prefs.page_prefs.components;
for(var x=strObj.length;
x--;
){if(strEval&&strObj[x].id===componentId){strObj[x].lookbackunits=compObj.getLookbackUnits();
strObj[x].lookbacktypeflag=compObj.getLookbackUnitTypeFlag();
strObj[x].grouperFilterLabel=compObj.getGrouperFilterLabel();
strObj[x].grouperFilterEventSets=compObj.getGrouperFilterEventSets();
strObj[x].selectedTimeFrame=compObj.getSelectedTimeFrame();
strObj[x].selectedDataGroup=compObj.getSelectedDataGroup();
}}m_jsonObject=strEval;
WritePreferences(m_jsonObject);
}else{var body=document.body;
var groups=Util.Style.g("col-group",body,"div");
var grpId=0;
var colId=0;
var rowId=0;
var compId=0;
var jsonObject={};
var userPrefs=jsonObject.user_prefs={};
var pagePrefs=userPrefs.page_prefs={};
var components=pagePrefs.components=[];
var cclParams=[];
for(var x=0,xl=groups.length;
x<xl;
x++){grpId=x+1;
var liqLay=Util.Style.g("col-outer1",groups[x],"div");
if(liqLay.length>0){var cols=Util.gcs(liqLay[0]);
for(var y=0,yl=cols.length;
y<yl;
y++){colId=y+1;
var rows=Util.gcs(cols[y]);
for(var z=0,zl=rows.length;
z<zl;
z++){var component=new Object();
rowId=z+1;
compId=jQuery(rows[z]).attr("id");
var compObj=MP_Util.GetCompObjByStyleId(compId);
component.id=compObj.getComponentId();
component.group_seq=grpId;
component.col_seq=colId;
component.row_seq=rowId;
component.lookbackunits=compObj.getLookbackUnits();
component.lookbacktypeflag=compObj.getLookbackUnitTypeFlag();
component.grouperFilterLabel=compObj.getGrouperFilterLabel();
component.grouperFilterEventSets=compObj.getGrouperFilterEventSets();
component.selectedTimeFrame=compObj.getSelectedTimeFrame();
component.selectedDataGroup=compObj.getSelectedDataGroup();
if(jQuery(rows[z]).hasClass("closed")){component.expanded=false;
}else{component.expanded=true;
}components.push(component);
}}}}WritePreferences(jsonObject);
m_jsonObject=jsonObject;
}},SaveViewpointPreferences:function(vpNameKey,vwpObj){WriteViewpointPreferences(vwpObj.VIEWS,vpNameKey);
},SaveQOCPreferences:function(jsonObj){m_prefIdent="MP_COMMON_ORDERS_V4";
WritePreferences(jsonObj);
},GetQOCPreferences:function(){if(!m_criterion){alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
return null;
}if(!m_jsonObject){m_prefIdent="MP_COMMON_ORDERS_V4";
this.LoadPreferences();
}return m_jsonObject;
},ClearPreferences:function(){WritePreferences(null);
if(typeof m_viewpointJSON=="undefined"){var cclParams=["^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+m_criterion.category_mean+"^",m_criterion.debug_ind];
CCLLINK("MP_DRIVER",cclParams.join(","),1);
}else{var viewpointJSON=JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
var cclParams=["^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+viewpointJSON.VIEWPOINT_NAME_KEY+"^",m_criterion.debug_ind,"^^",0,"^"+viewpointJSON.ACTIVE_VIEW_CAT_MEAN+"^"];
CCLLINK("MP_VIEWPOINT_DRIVER",cclParams.join(","),1);
}},GetComponentById:function(id){if(m_jsonObject){var components=m_jsonObject.user_prefs.page_prefs.components;
for(var x=components.length;
x--;
){var component=components[x];
if(component.id==id){return component;
}}}return null;
}};
function WriteViewpointPreferences(jsonObject,viewpointNameKey,successMessage){var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){MP_Util.LogScriptCallInfo(null,this,"mp_core.js","WriteViewpointPreferences");
var jsonEval=JSON.parse(this.responseText);
var recordData=jsonEval.RECORD_DATA;
if(recordData.STATUS_DATA.STATUS=="Z"){m_jsonObject=null;
}else{if(recordData.STATUS_DATA.STATUS=="S"){m_jsonObject=jsonObject;
if(successMessage&&successMessage.length>0){alert(successMessage);
}}else{MP_Util.LogScriptCallError(null,this,"mp_core.js","WriteViewpointPreferences");
var errAr=[];
var statusData=recordData.STATUS_DATA;
errAr.push("STATUS: "+statusData.STATUS);
for(var x=0,xl=statusData.SUBEVENTSTATUS.length;
x<xl;
x++){var ss=statusData.SUBEVENTSTATUS[x];
errAr.push(ss.OPERATIONNAME,ss.OPERATIONSTATUS,ss.TARGETOBJECTNAME,ss.TARGETOBJECTVALUE);
}window.status="Error saving viewpoint user preferences: "+errAr.join(",");
}}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_MAINTAIN_USER_PREFS",false);
var sJson=(jsonObject!=null)?JSON.stringify(jsonObject):"";
var ar=["^mine^",m_criterion.provider_id+".0","^"+viewpointNameKey+"^","^"+sJson+"^"];
info.send(ar.join(","));
}function WritePreferences(jsonObject,successMessage){var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){MP_Util.LogScriptCallInfo(null,this,"mp_core.js","WritePreferences");
var jsonEval=JSON.parse(this.responseText);
var recordData=jsonEval.RECORD_DATA;
if(recordData.STATUS_DATA.STATUS=="Z"){m_jsonObject=null;
}else{if(recordData.STATUS_DATA.STATUS=="S"){m_jsonObject=jsonObject;
if(successMessage&&successMessage.length>0){alert(successMessage);
}}else{MP_Util.LogScriptCallError(null,this,"mp_core.js","WritePreferences");
var errAr=[];
var statusData=recordData.STATUS_DATA;
errAr.push("STATUS: "+statusData.STATUS);
for(var x=0,xl=statusData.SUBEVENTSTATUS.length;
x<xl;
x++){var ss=statusData.SUBEVENTSTATUS[x];
errAr.push(ss.OPERATIONNAME,ss.OPERATIONSTATUS,ss.TARGETOBJECTNAME,ss.TARGETOBJECTVALUE);
}window.status="Error saving user preferences: "+errAr.join(",");
}}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_MAINTAIN_USER_PREFS",false);
var sJson=(jsonObject!=null)?JSON.stringify(jsonObject):"";
var ar=["^mine^",m_criterion.provider_id+".0","^"+m_prefIdent+"^","^"+sJson+"^"];
info.send(ar.join(","));
}}();
var MP_Util=function(){var m_df=null;
var m_nf=null;
var m_codeSets=[];
return{GetCriterion:function(js_criterion,static_content){MP_Util.LogDebug("Criterion: "+JSON.stringify(js_criterion));
var jsCrit=js_criterion.CRITERION;
var criterion=new MP_Core.Criterion(jsCrit,static_content);
var codeArray=MP_Util.LoadCodeListJSON(jsCrit.CODES);
var jsPatInfo=jsCrit.PATIENT_INFO;
var patInfo=new MP_Core.PatientInformation();
var jsPeriopCases=jsCrit.PERIOP_CASE;
var oPeriopCases=new MP_Core.PeriopCases();
patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD,codeArray));
if(jsPatInfo.DOB!=""){var dt=new Date();
dt.setISO8601(jsPatInfo.DOB);
patInfo.setDOB(dt);
}criterion.setPatientInfo(patInfo);
oPeriopCases.setCaseID(jsPeriopCases.CASE_ID);
oPeriopCases.setDays(jsPeriopCases.DAYS);
oPeriopCases.setHours(jsPeriopCases.HOURS);
oPeriopCases.setMins(jsPeriopCases.MINS);
oPeriopCases.setCntdwnDscFlg(jsPeriopCases.CNTDWN_DESC_FLAG);
criterion.setPeriopCases(oPeriopCases);
return criterion;
},CalcLookbackDate:function(lookbackDays){var retDate=new Date();
var hrs=retDate.getHours();
hrs-=(lookbackDays*24);
retDate.setHours(hrs);
return retDate;
},CalcWithinTime:function(dateTime){return(GetDateDiffString(dateTime,null,null,true));
},CalcAge:function(birthDt,fromDate){fromDate=(fromDate)?fromDate:new Date();
return(GetDateDiffString(birthDt,fromDate,1,false));
},DisplayDateByOption:function(component,date){var df=MP_Util.GetDateFormatter();
var dtFormatted="";
switch(component.getDateFormat()){case 1:return(df.format(date,mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR));
case 2:return(df.format(date,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
case 3:return(MP_Util.CalcWithinTime(date));
case 4:return("&nbsp");
default:return df.format(date,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}},DisplaySelectedTab:function(showDiv,anchorId){if(window.name=="a-tab0"){window.name="";
}else{window.name=showDiv+","+anchorId;
}var body=document.body;
var divs=Util.Style.g("div-tab-item",body);
for(var i=divs.length;
i--;
){if(divs[i].id==showDiv){divs[i].style.display="block";
}else{divs[i].style.display="none";
}}var anchors=Util.Style.g("anchor-tab-item",body);
for(var i=anchors.length;
i--;
){if(anchors[i].id==anchorId){anchors[i].className="anchor-tab-item active";
}else{anchors[i].className="anchor-tab-item inactive";
}}var custNode=_g("custView");
if(custNode!=null){custNode.href="";
custNode.innerHTML="";
}for(var yl=CERN_TabManagers.length;
yl--;
){var tabManager=CERN_TabManagers[yl];
var tabItem=tabManager.getTabItem();
if(tabItem.key==showDiv){tabManager.loadTab();
tabManager.setSelectedTab(true);
var components=tabItem.components;
if(components!=null&&components.length>0){for(var xl=components.length;
xl--;
){var component=components[xl];
MP_Util.Doc.AddCustomizeLink(component.getCriterion());
break;
}}}else{tabManager.setSelectedTab(false);
}}},DisplaySelectedTabQOC:function(showDiv,anchorId,noViewSaved){if(noViewSaved){var dropDownList=_g("viewListSelectorID");
if(dropDownList.options[dropDownList.options.length-1].value=="Blank_Space"){dropDownList.remove(dropDownList.options.length-1);
}var noSavedViewsStatement=_g("noSavedViews");
if(!Util.Style.ccss(noSavedViewsStatement,"hidden")){Util.Style.acss(noSavedViewsStatement,"hidden");
}}if(window.name=="a-tab0"){window.name="";
}else{window.name=showDiv+","+anchorId;
}var body=document.body;
var divs=Util.Style.g("div-tab-item",body);
for(var i=divs.length;
i--;
){if(divs[i].id==showDiv){divs[i].style.display="block";
}else{divs[i].style.display="none";
}}var anchors=Util.Style.g("anchor-tab-item",body);
for(var i=anchors.length;
i--;
){if(anchors[i].id==anchorId){anchors[i].className="anchor-tab-item active";
}else{anchors[i].className="anchor-tab-item inactive";
}}var custNode=_g("custView");
if(custNode){custNode.href="";
custNode.innerHTML="";
}for(var yl=CERN_TabManagers.length;
yl--;
){var tabManager=CERN_TabManagers[yl];
var tabItem=tabManager.getTabItem();
if(tabItem.key==showDiv){tabManager.loadTab();
tabManager.setSelectedTab(true);
var jsonObj=MP_Core.AppUserPreferenceManager.GetQOCPreferences();
var userPrefs,pagePrefs,components,lastSavedView;
if(jsonObj){userPrefs=jsonObj.user_prefs;
pagePrefs=userPrefs.page_prefs;
pagePrefs.last_saved_view=tabItem.name;
}else{jsonObj={};
userPrefs=jsonObj.user_prefs={};
pagePrefs=userPrefs.page_prefs={};
components=pagePrefs.components=[];
lastSavedView=pagePrefs.last_saved_view=tabItem.name;
}MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObj);
var components=tabItem.components;
if(components!=null&&components.length>0){for(var xl=components.length;
xl--;
){var component=components[xl];
MP_Util.Doc.AddCustomizeLink(component.getCriterion());
break;
}}}else{tabManager.setSelectedTab(false);
}}},OpenTab:function(compId){for(var x=0,xl=CERN_MPageComponents.length;
x<xl;
x++){var comp=CERN_MPageComponents[x];
var styles=comp.getStyles();
if(styles.getId()==compId){comp.openTab();
}}},LaunchMenuSelection:function(compId,menuItemId){for(var x=0,xl=CERN_MPageComponents.length;
x<xl;
x++){var comp=CERN_MPageComponents[x];
var crit=comp.getCriterion();
var styles=comp.getStyles();
if(styles.getId()==compId){comp.openDropDown(menuItemId);
break;
}}},LaunchMenu:function(menuId,componentId){var menu=_g(menuId);
MP_Util.closeMenuInit(menu,componentId);
if(menu!=null){if(Util.Style.ccss(menu,"menu-hide")){_g(componentId).style.zIndex=2;
Util.Style.rcss(menu,"menu-hide");
}else{_g(componentId).style.zIndex=1;
Util.Style.acss(menu,"menu-hide");
}}},LaunchLookBackSelection:function(compId,lookBackUnits,lookBackType){var i18nCore=i18n.discernabu;
var rootId=parseInt(compId,10);
var component=MP_Util.GetCompObjById(rootId);
var style=component.getStyles();
var ns=style.getNameSpace();
var scope=component.getScope();
var displayText="";
var lbtVal=parseInt(lookBackType,10);
if(component.getLookbackUnits()!==lookBackUnits||component.getLookbackUnitTypeFlag()!==lbtVal){component.setLookbackUnits(lookBackUnits);
component.setLookbackUnitTypeFlag(lbtVal);
if(scope>0){if(lookBackUnits>0&&lbtVal>0){var newText="";
switch(lbtVal){case 1:newText=i18nCore.LAST_N_HOURS.replace("{0}",lookBackUnits);
break;
case 2:newText=i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
break;
case 3:newText=i18nCore.LAST_N_WEEKS.replace("{0}",lookBackUnits);
break;
case 4:newText=i18nCore.LAST_N_MONTHS.replace("{0}",lookBackUnits);
break;
case 5:newText=i18nCore.LAST_N_YEARS.replace("{0}",lookBackUnits);
break;
default:newText=i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
break;
}switch(scope){case 1:displayText=i18nCore.ALL_N_VISITS.replace("{0}",newText);
break;
case 2:displayText=i18nCore.SELECTED_N_VISIT.replace("{0}",newText);
break;
}}else{switch(scope){case 1:displayText=i18nCore.All_VISITS;
break;
case 2:displayText=i18nCore.SELECTED_VISIT;
break;
}}}MP_Util.Doc.CreateLookBackMenu(component,2,displayText);
if(ns==="lab"||ns==="dg"){var contentNode=component.getSectionContentNode().innerHTML="";
}component.InsertData();
}},LaunchCompFilterSelection:function(compId,filterLabel,eventSetIndex,applyFilterInd){var component=MP_Util.GetCompObjById(compId);
var i18nCore=i18n.discernabu;
var mnuDisplay=filterLabel;
var dispVar=i18nCore.FACILITY_DEFINED_VIEW;
var style=component.getStyles();
var ns=style.getNameSpace();
var styleId=style.getId();
var loc=component.getCriterion().static_content;
var mnuId=styleId+"TypeMenu";
var z=0;
var eventSetList=component.getGrouperEventSets(eventSetIndex);
component.setGrouperFilterLabel(filterLabel);
if(filterLabel!==dispVar){component.setGrouperFilterEventSets(eventSetList);
}else{component.setGrouperFilterEventSets(null);
}var filterAppliedSpan=_g("cf"+compId+"msg");
if(filterAppliedSpan){Util.de(filterAppliedSpan);
}if(filterLabel!==dispVar){var newFilterAppliedSpan=Util.ce("span");
var filterAppliedArr=["<span id='cf",compId,"msg' class='filter-applied-msg' title='",filterLabel,"'>",i18nCore.FILTER_APPLIED,"</span>"];
newFilterAppliedSpan.innerHTML=filterAppliedArr.join("");
var lbDropDownDiv=_g("lbMnuDisplay"+compId);
Util.ia(newFilterAppliedSpan,lbDropDownDiv);
}else{var newFilterAppliedSpan=Util.ce("span");
var filterAppliedArr=["<span id='cf",compId,"msg' class='filter-applied-msg' title=''></span>"];
newFilterAppliedSpan.innerHTML=filterAppliedArr.join("");
var lbDropDownDiv=_g("lbMnuDisplay"+compId);
Util.ia(newFilterAppliedSpan,lbDropDownDiv);
}var contentDiv=_g("Accordion"+compId+"ContentDiv");
contentDiv.innerHTML="";
var contentDivArr=[];
contentDivArr.push("<div id='cf",mnuId,"' class='acc-mnu'>");
contentDivArr.push("<span id='cflabel",compId,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',styleId,"\");'>",i18nCore.FILTER_LABEL,mnuDisplay,"<a id='compFilterDrop",compId,"'><img src='",loc,"\\images\\3943_16.gif'></a></span>");
contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='acc-mnu-contentbox'>");
contentDivArr.push("<div><span id='cf",styleId,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,',"',dispVar,'","",1);\'>',i18nCore.FACILITY_DEFINED_VIEW,"</span></div>");
var groupLen=component.m_grouper_arr.length;
for(z=0;
z<groupLen;
z++){if(component.getGrouperLabel(z)){var esIndex=z;
contentDivArr.push("<div><span id='cf",styleId,z,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,',"',component.getGrouperLabel(z),'",',esIndex,",1);'>",component.getGrouperLabel(z),"</span></div>");
}}contentDivArr.push("</div></div></div>");
contentDiv.innerHTML=contentDivArr.join("");
if(applyFilterInd===1){if(filterLabel===i18nCore.FACILITY_DEFINED_VIEW){component.InsertData();
}else{component.FilterRefresh(filterLabel,eventSetList);
}}},LaunchViewMenu:function(menuId){var menu=_g(menuId);
MP_Util.closeViewMenuInit(menu);
if(menu){if(Util.Style.ccss(menu,"menu-hide")){_g(menu.id).style.zIndex=2;
Util.Style.rcss(menu,"menu-hide");
}else{_g(menu.id).style.zIndex=1;
Util.Style.acss(menu,"menu-hide");
}var js_viewpoint=JSON.parse(m_viewpointJSON);
if(parseInt(js_viewpoint.VIEWPOINTINFO_REC.CS_ENABLED,10)){var sec=_g("viewDrop");
var ofs=Util.goff(sec);
menu.style.left=(ofs[0]-5)+"px";
menu.style.top=(ofs[1]+24)+"px";
}}},closeViewMenuInit:function(inMenu){var menuId=inMenu.id;
var e=window.event;
if(window.attachEvent){Util.addEvent(inMenu,"mouseleave",function(){Util.Style.acss(inMenu,"menu-hide");
});
}else{Util.addEvent(inMenu,"mouseout",menuLeave);
}menuLeave:function(e){if(!e){var e=window.event;
}var relTarg=e.relatedTarget||e.toElement;
if(e.relatedTarget.id==inMenu.id){Util.Style.acss(inMenu,"menu-hide");
}e.stopPropagation();
Util.cancelBubble(e);
}},closeMenuInit:function(inMenu,compId){var menuId;
var docMenuId=compId+"Menu";
var lbMenuId=compId+"Mnu";
var cfMenuId=compId+"TypeMenu";
if(inMenu.id==docMenuId||inMenu.id==lbMenuId||inMenu.id==cfMenuId){menuId=compId;
}if(!e){var e=window.event;
}if(window.attachEvent){Util.addEvent(inMenu,"mouseleave",function(){Util.Style.acss(inMenu,"menu-hide");
_g(menuId).style.zIndex=1;
});
}else{Util.addEvent(inMenu,"mouseout",menuLeave);
}menuLeave:function(e){if(!e){var e=window.event;
}var relTarg=e.relatedTarget||e.toElement;
if(e.relatedTarget.id==inMenu.id){Util.Style.acss(inMenu,"menu-hide");
_g(menuId).style.zIndex=1;
}e.stopPropagation();
Util.cancelBubble(e);
}},CreateTitleText:function(component,nbr,optionalText){var ar=[];
if(component.isLineNumberIncluded()){ar.push("(",nbr,")");
}if(optionalText&&optionalText!==""){ar.push(" ",optionalText);
}return ar.join("");
},GetContentClass:function(component,nbr){if(component.isScrollingEnabled()){var scrollNbr=component.getScrollNumber();
if(nbr>=scrollNbr&&scrollNbr>0){return"content-body scrollable";
}}return"content-body";
},CreateTimer:function(timerName,subTimerName,metaData1,metaData2,metaData3){try{var slaTimer=window.external.DiscernObjectFactory("SLATIMER");
MP_Util.LogTimerInfo(timerName,subTimerName,"SLATIMER","mp_core.js","CreateTimer");
}catch(err){return null;
}if(slaTimer){slaTimer.TimerName=timerName;
if(subTimerName){slaTimer.SubtimerName=subTimerName;
}if(metaData1){slaTimer.Metadata1=String(metaData1);
}if(metaData2){slaTimer.Metadata2=String(metaData2);
}if(metaData3){slaTimer.Metadata3=String(metaData3);
}slaTimer.Start();
return slaTimer;
}else{return null;
}},GetCodeSet:function(codeSet,async){var codes=new Array();
var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){MP_Util.LogScriptCallInfo(null,this,"mp_core.js","GetCodeSet");
var jsonEval=JSON.parse(this.responseText);
if(jsonEval.RECORD_DATA.STATUS_DATA.STATUS=="S"){codes=MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
}return codes;
}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_GET_CODESET",async);
var sendVal="^MINE^, "+codeSet+".0";
info.send(sendVal);
return codes;
},GetCodeByMeaning:function(mapCodes,meaning){for(var x=mapCodes.length;
x--;
){var code=mapCodes[x].value;
if(code.meaning==meaning){return code;
}}return null;
},GetCodeValueByMeaning:function(meaning,codeSet){var codeValue=0;
var list=m_codeSets[codeSet];
if(!list){list=m_codeSets[codeSet]=MP_Util.GetCodeSet(codeSet,false);
}if(list&&list.length>0){for(var x=list.length;
x--;
){var code=list[x].value;
if(code.meaning===meaning){return code;
}}}return null;
},GetItemFromMapArray:function(mapItems,item){for(var x=0;
x<mapItems.length;
x++){if(mapItems[x].name==item){return mapItems[x].value;
}}},AddItemToMapArray:function(mapItems,key,value){var ar=MP_Util.GetItemFromMapArray(mapItems,key);
if(!ar){ar=[];
mapItems.push(new MP_Core.MapObject(key,ar));
}ar.push(value);
},LookBackTime:function(component){var i18nCore=i18n.discernabu;
var remainder=0;
var lookbackDays=component.getLookbackDays();
if(lookbackDays==0){return(i18nCore.SELECTED_VISIT);
}else{if(lookbackDays==1){return(i18nCore.LAST_N_HOURS.replace("{0}",lookbackDays*24));
}else{return(i18nCore.LAST_N_DAYS.replace("{0}",lookbackDays));
}}},CreateClinNoteLink:function(patient_id,encntr_id,event_id,display,docViewerType,pevent_id){var docType=(docViewerType&&docViewerType>"")?docViewerType:"STANDARD";
var doclink="";
if(event_id>0){var ar=[];
ar.push(patient_id,encntr_id,event_id,'"'+docType+'"',pevent_id);
doclink="<a onclick='javascript:MP_Util.LaunchClinNoteViewer("+ar.join(",")+"); return false;' href='#'>"+display+"</a>";
}else{doclink=display;
}return(doclink);
},LaunchClinNoteViewer:function(patient_id,encntr_id,event_id,docViewerType,pevent_id){var x=0;
var m_dPersonId=parseFloat(patient_id);
var m_dEncntrId=parseFloat(encntr_id);
var m_dPeventId=parseFloat(pevent_id);
var viewerObj=window.external.DiscernObjectFactory("PVVIEWERMPAGE");
MP_Util.LogDiscernInfo(null,"PVVIEWERMPAGE","mp_core.js","LaunchClinNoteViewer");
try{switch(docViewerType){case"AP":viewerObj.CreateAPViewer();
viewerObj.AppendAPEvent(event_id,m_dPeventId);
viewerObj.LaunchAPViewer();
break;
case"DOC":viewerObj.CreateDocViewer(m_dPersonId);
if(MP_Util.IsArray(event_id)){for(var x=event_id.length;
x--;
){viewerObj.AppendDocEvent(event_id[x]);
}}else{viewerObj.AppendDocEvent(event_id);
}viewerObj.LaunchDocViewer();
break;
case"EVENT":viewerObj.CreateEventViewer(m_dPersonId);
if(MP_Util.IsArray(event_id)){for(var x=event_id.length;
x--;
){viewerObj.AppendEvent(event_id[x]);
}}else{viewerObj.AppendEvent(event_id);
}viewerObj.LaunchEventViewer();
break;
case"MICRO":viewerObj.CreateMicroViewer(m_dPersonId);
if(MP_Util.IsArray(event_id)){for(var x=event_id.length;
x--;
){viewerObj.AppendMicroEvent(event_id[x]);
}}else{viewerObj.AppendMicroEvent(event_id);
}viewerObj.LaunchMicroViewer();
break;
case"GRP":viewerObj.CreateGroupViewer();
if(MP_Util.IsArray(event_id)){for(var x=event_id.length;
x--;
){viewerObj.AppendGroupEvent(event_id[x]);
}}else{viewerObj.AppendGroupEvent(event_id);
}viewerObj.LaunchGroupViewer();
break;
case"PROC":viewerObj.CreateProcViewer(m_dPersonId);
if(MP_Util.IsArray(event_id)){for(var x=event_id.length;
x--;
){viewerObj.AppendProcEvent(event_id[x]);
}}else{viewerObj.AppendProcEvent(event_id);
}viewerObj.LaunchProcViewer();
break;
case"HLA":viewerObj.CreateAndLaunchHLAViewer(m_dPersonId,m_dEventId);
break;
case"NR":viewerObj.LaunchRemindersViewer(event_id);
break;
case"STANDARD":alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS);
break;
}}catch(err){MP_Util.LogJSError(err,null,"mp_core.js","LaunchClinNoteViewer");
alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS+"  "+i18n.discernabu.CONTACT_ADMINISTRATOR);
}},IsArray:function(input){return(typeof(input)=="object"&&(input instanceof Array));
},IsString:function(input){return(typeof(input)=="string");
},HandleNoDataResponse:function(nameSpace){var i18nCore=i18n.discernabu;
return("<h3 class='info-hd'><span class='res-normal'>"+i18nCore.NO_RESULTS_FOUND+"</span></h3><span class='res-none'>"+i18nCore.NO_RESULTS_FOUND+"</span>");
},HandleErrorResponse:function(nameSpace,errorMessage){var ar=[];
var i18nCore=i18n.discernabu;
var ns=(nameSpace&&nameSpace.length>0)?nameSpace+"-":"";
ar.push("<h3 class='info-hd'><span class='res-normal'>",i18nCore.ERROR_RETREIVING_DATA,"</span></h3>");
ar.push("<dl class='",ns,"info'><dd><span>",i18nCore.ERROR_RETREIVING_DATA,"</span></dd></dl>");
if(errorMessage!=null&&errorMessage.length>0){ar.push("<h4 class='det-hd'><span>DETAILS</span></h4><div class='hvr'><dl class='",ns,"det'><dd><span>",errorMessage,"</span></dd></dl></div>");
}return ar.join("");
},GetValueFromArray:function(name,array){if(array!=null){for(var x=0,xi=array.length;
x<xi;
x++){if(array[x].name==name){return(array[x].value);
}}}return(null);
},GetPrsnlObjByIdAndDate:function(name,date,personnelArray){var prsnlObj;
var latestPrsnlObj;
try{if(personnelArray&&personnelArray.length){for(var x=0,xi=personnelArray.length;
x<xi;
x++){if(personnelArray[x].name==name){prsnlObj=personnelArray[x].value;
if(!latestPrsnlObj){latestPrsnlObj=prsnlObj;
}if(typeof date=="string"){if(/^\/Date\(/.exec(date)){date=/[0-9]+-[0-9]+-[0-9]+/.exec(date)+"T"+/[0-9]+:[0-9]+:[0-9]+/.exec(date)+"Z";
}if((date>prsnlObj.beg_dt_tm_string&&date<prsnlObj.end_dt_tm_string)||date==prsnlObj.beg_dt_tm_string||date==prsnlObj.end_dt_tm_string){return(prsnlObj);
}}else{throw (new Error("Invalid date object passed into GetPrsnlObjByIdAndDate.  The date object must be a string."));
}}}return(latestPrsnlObj);
}return(null);
}catch(err){MP_Util.LogJSError(err,null,"mp_core.js","GetPrsnlObjByIdAndDate");
return(null);
}},GetCompObjById:function(id){var comps=CERN_MPageComponents;
var cLen=comps.length;
for(var i=cLen;
i--;
){var comp=comps[i];
if(comp.m_componentId===id){return comp;
}}return(null);
},GetCompObjByStyleId:function(id){var cLen=CERN_MPageComponents.length;
for(var i=cLen;
i--;
){var comp=CERN_MPageComponents[i];
var styles=comp.getStyles();
if(styles.getId()===id){return comp;
}}return(null);
},LoadCodeListJSON:function(parentElement){var codeArray=new Array();
if(parentElement!=null){for(var x=0;
x<parentElement.length;
x++){var codeObject=new Object();
codeElement=parentElement[x];
codeObject.codeValue=codeElement.CODE;
codeObject.display=codeElement.DISPLAY;
codeObject.description=codeElement.DESCRIPTION;
codeObject.codeSet=codeElement.CODE_SET;
codeObject.sequence=codeElement.SEQUENCE;
codeObject.meaning=codeElement.MEANING;
var mapObj=new MP_Core.MapObject(codeObject.codeValue,codeObject);
codeArray.push(mapObj);
}}return(codeArray);
},LoadPersonelListJSON:function(parentElement){var personnelArray=[];
var codeElement;
if(parentElement!=null){for(var x=0;
x<parentElement.length;
x++){var prsnlObj={};
codeElement=parentElement[x];
prsnlObj.id=codeElement.ID;
if(codeElement.BEG_EFFECTIVE_DT_TM){prsnlObj.beg_dt_tm=codeElement.BEG_EFFECTIVE_DT_TM;
prsnlObj.beg_dt_tm_string=/[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM)+"T"+/[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM)+"Z";
}if(codeElement.END_EFFECTIVE_DT_TM){prsnlObj.end_dt_tm=codeElement.END_EFFECTIVE_DT_TM;
prsnlObj.end_dt_tm_string=/[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM)+"T"+/[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM)+"Z";
}prsnlObj.fullName=codeElement.PROVIDER_NAME.NAME_FULL;
prsnlObj.firstName=codeElement.PROVIDER_NAME.NAME_FIRST;
prsnlObj.middleName=codeElement.PROVIDER_NAME.NAME_MIDDLE;
prsnlObj.lastName=codeElement.PROVIDER_NAME.NAME_LAST;
prsnlObj.userName=codeElement.PROVIDER_NAME.USERNAME;
prsnlObj.initials=codeElement.PROVIDER_NAME.INITIALS;
prsnlObj.title=codeElement.PROVIDER_NAME.TITLE;
var mapObj=new MP_Core.MapObject(prsnlObj.id,prsnlObj);
personnelArray[x]=mapObj;
}}return(personnelArray);
},WriteToFile:function(sText){try{var ForAppending=8;
var TriStateFalse=0;
var fso=new ActiveXObject("Scripting.FileSystemObject");
var newFile=fso.OpenTextFile("c:\\temp\\test.txt",ForAppending,true,TriStateFalse);
newFile.write(sText);
newFile.close();
}catch(err){var strErr="Error:";
strErr+="\nNumber:"+err.number;
strErr+="\nDescription:"+err.description;
document.write(strErr);
}},CalculateAge:function(bdate){var age;
var bdate=new Date(bdate);
var byear=bdate.getFullYear();
var bmonth=bdate.getMonth();
var bday=bdate.getDate();
var bhours=bdate.getHours();
today=new Date();
year=today.getFullYear();
month=today.getMonth();
day=today.getDate();
hours=today.getHours();
if(year==byear&&(day==bday)){age=hours-bhours;
age+=" Hours";
return age;
}else{if(year==byear&&(month==bmonth)){age=day-bday;
age+=" Days";
return age;
}}if(year==byear){age=month-bmonth;
age+=" Months";
return age;
}else{if(month<bmonth){age=year-byear-1;
}else{if(month>bmonth){age=year-byear;
}else{if(month==bmonth){if(day<bday){age=year-byear-1;
}else{if(day>bday){age=year-byear;
}else{if(day==bday){age=year-byear;
}}}}}}}age+=" Years";
return age;
},pad:function(str,len,pad,dir){if(typeof(len)=="undefined"){var len=0;
}if(typeof(pad)=="undefined"){var pad=" ";
}if(typeof(dir)=="undefined"){var dir=STR_PAD_RIGHT;
}if(len+1>=str.length){switch(dir){case STR_PAD_LEFT:str=Array(len+1-str.length).join(pad)+str;
break;
case STR_PAD_BOTH:var right=Math.ceil((padlen=len-str.length)/2);
var left=padlen-right;
str=Array(left+1).join(pad)+str+Array(right+1).join(pad);
break;
default:str=str+Array(len+1-str.length).join(pad);
break;
}}return str;
},GraphResults:function(eventCd,compID,groupID){var component=MP_Util.GetCompObjById(compID);
var lookBackUnits=(component.getLookbackUnits()!=null&&component.getLookbackUnits()>0)?component.getLookbackUnits():"365";
var lookBackType=(component.getLookbackUnitTypeFlag()!=null&&component.getLookbackUnitTypeFlag()>0)?component.getLookbackUnitTypeFlag():"2";
var i18nCore=i18n.discernabu;
var subTitleText="";
var scope=component.getScope();
var lookBackText="";
var criterion=component.getCriterion();
component.setLookbackUnits(lookBackUnits);
component.setLookbackUnitTypeFlag(lookBackType);
if(scope>0){switch(lookBackType){case 1:var replaceText=i18nCore.LAST_N_HOURS.replace("{0}",lookBackUnits);
break;
case 2:var replaceText=i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
break;
case 3:var replaceText=i18nCore.LAST_N_WEEKS.replace("{0}",lookBackUnits);
break;
case 4:var replaceText=i18nCore.LAST_N_MONTHS.replace("{0}",lookBackUnits);
break;
case 5:var replaceText=i18nCore.LAST_N_YEARS.replace("{0}",lookBackUnits);
break;
default:var replaceText=i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
break;
}switch(scope){case 1:lookBackText=i18nCore.ALL_N_VISITS.replace("{0}",replaceText);
var encntrOption="0.0";
break;
case 2:lookBackText=i18nCore.SELECTED_N_VISIT.replace("{0}",replaceText);
var encntrOption=criterion.encntr_id;
break;
}}var wParams="left=0,top=0,width=1200,height=700,toolbar=no";
var sParams="^MINE^,"+criterion.person_id+".0,"+encntrOption+","+eventCd+".0,^"+criterion.static_content+"\\discrete-graphing^,"+groupID+".0,"+criterion.provider_id+".0,"+criterion.position_cd+".0,"+criterion.ppr_cd+".0,"+lookBackUnits+","+lookBackType+",200,^"+lookBackText+"^";
var graphCall="javascript:CCLLINK('mp_retrieve_graph_results', '"+sParams+"',1)";
MP_Util.LogCclNewSessionWindowInfo(null,graphCall,"mp_core.js","GraphResults");
javascript:CCLNEWSESSIONWINDOW(graphCall,"_self",wParams,0,1);
Util.preventDefault();
},ReleaseRequestReference:function(reqObj){if(XMLCCLREQUESTOBJECTPOINTER){for(var id in XMLCCLREQUESTOBJECTPOINTER){if(XMLCCLREQUESTOBJECTPOINTER[id]==reqObj){delete (XMLCCLREQUESTOBJECTPOINTER[id]);
}}}},CreateAutoSuggestBoxHtml:function(component){var searchBoxHTML=[];
var compNs=component.getStyles().getNameSpace();
var compId=component.getComponentId();
searchBoxHTML.push("<div class='search-box-div'><form name='contentForm'><input type='text' id='",compNs,"contentCtrl",compId,"'"," class='search-box'></form></div>");
return searchBoxHTML.join("");
},AddAutoSuggestControl:function(component,queryHandler,selectionHandler,selectDisplayHandler){new AutoSuggestControl(component,queryHandler,selectionHandler,selectDisplayHandler);
},RetrieveAutoSuggestSearchBox:function(component){var componentNamespace=component.getStyles().getNameSpace();
var componentId=component.getComponentId();
return _g(componentNamespace+"contentCtrl"+componentId);
},CreateParamArray:function(ar,type){var returnVal=(type===1)?"0.0":"0";
if(ar&&ar.length>0){if(ar.length>1){if(type===1){returnVal="value("+ar.join(".0,")+".0)";
}else{returnVal="value("+ar.join(",")+")";
}}else{returnVal=(type===1)?ar[0]+".0":ar[0];
}}return returnVal;
},GetDateFormatter:function(){if(!m_df){m_df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
}return m_df;
},GetNumericFormatter:function(){if(!m_nf){m_nf=new mp_formatter.NumericFormatter(MPAGE_LOCALE);
}return m_nf;
},PrintReport:function(reportName,person_id,encounter_id){var paramString="^MINE^,^"+reportName+"^,"+person_id+","+encounter_id;
CCLLINK("pwx_rpt_driver_to_mpage",paramString,1);
},CalculatePrecision:function(valRes){var precision=0;
var str=(MP_Util.IsString(valRes))?valRes:valRes.toString();
var decLoc=str.search(/\.(\d)/);
if(decLoc!==-1){var strSize=str.length;
precision=strSize-decLoc-1;
}return precision;
},CreateDateParameter:function(date){var day=date.getDate();
var month="";
var rest=date.format("yyyy HH:MM:ss");
switch(date.getMonth()){case (0):month="JAN";
break;
case (1):month="FEB";
break;
case (2):month="MAR";
break;
case (3):month="APR";
break;
case (4):month="MAY";
break;
case (5):month="JUN";
break;
case (6):month="JUL";
break;
case (7):month="AUG";
break;
case (8):month="SEP";
break;
case (9):month="OCT";
break;
case (10):month="NOV";
break;
case (11):month="DEC";
break;
default:alert("unknown month");
}return(day+"-"+month+"-"+rest);
},LogDebug:function(debugString){if(debugString){log.debug(debugString);
}},LogWarn:function(warnString){if(warnString){log.warn(warnString);
}},LogInfo:function(infoString){if(infoString){log.info(infoString);
}},LogError:function(errorString){if(errorString){log.error(errorString);
}},LogScriptCallInfo:function(component,request,file,funcName){log.debug(["Component: ",(component?component.getLabel():""),"<br />ID: ",(component?component.getComponentId():""),"<br />File: ",file,"<br />Function: ",funcName,"<br />Script: ",request.url,"<br />Request: ",request.requestText,"<br />Reply: ",request.responseText].join(""));
},LogScriptCallError:function(component,request,file,funcName){log.error(["Component: ",(component?component.getLabel():""),"<br />ID: ",(component?component.getComponentId():""),"<br />File: ",file,"<br />Function: ",funcName,"<br />Script: ",request.url,"<br />Request: ",request.requestText,"<br />Reply: ",request.responseText,"<br />Status: ",request.status].join(""));
},LogJSError:function(err,component,file,funcName){log.error(["Component: ",(component?component.getLabel():""),"<br />ID: ",(component?component.getComponentId():""),"<br />File: ",file,"<br />Function: ",funcName,"<br />JS Error","<br />Message: ",err.message,"<br />Name: ",err.name,"<br />Number: ",(err.number&65535),"<br />Description: ",err.description].join(""));
},LogDiscernInfo:function(component,objectName,file,funcName){log.debug(["Component: ",(component?component.getLabel():""),"<br />ID: ",(component?component.getComponentId():""),"<br />File: ",file,"<br />Function: ",funcName,"<br />Discern Object: ",objectName].join(""));
},LogMpagesEventInfo:function(component,eventName,params,file,funcName){log.debug(["Component: ",(component?component.getLabel():""),"<br />ID: ",(component?component.getComponentId():""),"<br />File: ",file,"<br />Function: ",funcName,"<br />MPAGES_EVENT: ",eventName,"<br />Params: ",params].join(""));
},LogCclNewSessionWindowInfo:function(component,params,file,funcName){log.debug(["CCLNEWSESSIONWINDOW Creation","Component: ",(component?component.getLabel():""),"<br />ID: ",(component?component.getComponentId():""),"<br />File: ",file,"<br />Function: ",funcName,"<br />Params: ",params].join(""));
},LogTimerInfo:function(timerName,subTimerName,timerType,file,funcName){log.debug(["Timer Name: ",timerName,"<br />Subtime Name:  ",subTimerName,"<br />Timer Type: ",timerType,"<br />File: ",file,"<br />Function: ",funcName].join(""));
},AddCookieProperty:function(compId,propName,propValue){var cookie=CK_DATA[compId];
if(!cookie){cookie={};
}cookie[propName]=propValue;
CK_DATA[compId]=cookie;
},GetCookieProperty:function(compId,propName){var cookie=CK_DATA[compId];
if(cookie&&cookie[propName]){return cookie[propName];
}else{return null;
}},WriteCookie:function(){var cookieJarJSON=JSON.stringify(CK_DATA);
document.cookie="CookieJar="+cookieJarJSON+";";
},RetrieveCookie:function(){var cookies=document.cookie;
var match=cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
if(match&&match[1]){CK_DATA=JSON.parse(match[1]);
}}};
function GetDateDiffString(beginDate,endDate,mathFlag,abbreviateFlag){var i18nCore=i18n.discernabu;
var timeDiff=0;
var returnVal="";
endDate=(!endDate)?new Date():endDate;
mathFlag=(!mathFlag)?0:mathFlag;
var one_minute=1000*60;
var one_hour=one_minute*60;
var one_day=one_hour*24;
var one_week=one_day*7;
var valMinutes=0;
var valHours=0;
var valDays=0;
var valWeeks=0;
var valMonths=0;
var valYears=0;
timeDiff=(endDate.getTime()-beginDate.getTime());
var mathFunc=null;
var comparisonFunc=null;
if(mathFlag==0){mathFunc=function(val){return Math.ceil(val);
};
comparisonFunc=function(lowerVal,upperVal){return(lowerVal<=upperVal);
};
}else{mathFunc=function(val){return Math.floor(val);
};
comparisonFunc=function(lowerVal,upperVal){return(lowerVal<upperVal);
};
}var calcMonths=function(){var removeCurYr=0;
var removeCurMon=0;
var yearDiff=0;
var monthDiff=0;
var dayDiff=endDate.getDate();
if(endDate.getMonth()>beginDate.getMonth()){monthDiff=endDate.getMonth()-beginDate.getMonth();
if(endDate.getDate()<beginDate.getDate()){removeCurMon=1;
}}else{if(endDate.getMonth()<beginDate.getMonth()){monthDiff=12-beginDate.getMonth()+endDate.getMonth();
removeCurYr=1;
if(endDate.getDate()<beginDate.getDate()){removeCurMon=1;
}}else{if(endDate.getDate()<beginDate.getDate()){removeCurYr=1;
monthDiff=11;
}}}if(endDate.getDate()>=beginDate.getDate()){dayDiff=endDate.getDate()-beginDate.getDate();
}yearDiff=(endDate.getFullYear()-beginDate.getFullYear())-removeCurYr;
monthDiff+=(yearDiff*12)+(dayDiff/32)-removeCurMon;
return monthDiff;
};
valMinutes=mathFunc(timeDiff/one_minute);
valHours=mathFunc(timeDiff/one_hour);
valDays=mathFunc(timeDiff/one_day);
valWeeks=mathFunc(timeDiff/one_week);
valMonths=calcMonths();
valMonths=mathFunc(valMonths);
valYears=mathFunc(valMonths/12);
if(comparisonFunc(valHours,2)){returnVal=abbreviateFlag?(i18nCore.WITHIN_MINS.replace("{0}",valMinutes)):(i18nCore.X_MINUTES.replace("{0}",valMinutes));
}else{if(comparisonFunc(valDays,2)){returnVal=abbreviateFlag?(i18nCore.WITHIN_HOURS.replace("{0}",valHours)):(i18nCore.X_HOURS.replace("{0}",valHours));
}else{if(comparisonFunc(valWeeks,2)){returnVal=abbreviateFlag?(i18nCore.WITHIN_DAYS.replace("{0}",valDays)):(i18nCore.X_DAYS.replace("{0}",valDays));
}else{if(comparisonFunc(valMonths,2)){returnVal=abbreviateFlag?(i18nCore.WITHIN_WEEKS.replace("{0}",valWeeks)):(i18nCore.X_WEEKS.replace("{0}",valWeeks));
}else{if(comparisonFunc(valYears,2)){returnVal=abbreviateFlag?(i18nCore.WITHIN_MONTHS.replace("{0}",valMonths)):(i18nCore.X_MONTHS.replace("{0}",valMonths));
}else{returnVal=abbreviateFlag?(i18nCore.WITHIN_YEARS.replace("{0}",valYears)):(i18nCore.X_YEARS.replace("{0}",valYears));
}}}}}return(returnVal);
}}();
MP_Util.Doc=function(){var isExpandedAll=false;
var openAccordion="";
return{InitMPageTabLayout:function(arMapObjects,title,displayType,criterionGroup){var arItems=[];
var sc="",helpFile="",helpURL="",debugInd=false;
var bDisplayBanner=false;
var criterion=null;
var custInd=true;
var anchorArray=null;
for(var x=0,xl=arMapObjects.length;
x<xl;
x++){var key=arMapObjects[x].name;
var page=arMapObjects[x].value;
criterion=page.getCriterion();
arItems.push(new MP_Core.TabItem(key,page.getName(),page.getComponents(),criterion.category_mean));
sc=criterion.static_content;
debugInd=criterion.debug_ind;
helpFile=page.getHelpFileName();
helpURL=page.getHelpFileURL();
custInd=page.getCustomizeEnabled();
anchorArray=page.getTitleAnchors();
if(page.isBannerEnabled()){bDisplayBanner=page.isBannerEnabled();
}}if(displayType===1){MP_Util.Doc.InitSelectorLayout(arItems,title,sc,helpFile,helpURL,bDisplayBanner,0,criterionGroup,custInd,anchorArray);
}else{MP_Util.Doc.InitTabLayout(arItems,title,sc,helpFile,helpURL,bDisplayBanner,0,criterion,custInd,anchorArray);
}},InitTabLayout:function(arTabItems,title,sc,helpFile,helpURL,includeBanner,debugInd,criterion,custInd,anchorArray){var body=document.body;
var i18nCore=i18n.discernabu;
MP_Util.Doc.AddPageTitle(title,body,debugInd,custInd,anchorArray,helpFile,helpURL,criterion);
if(includeBanner){body.innerHTML+="<div id='banner' class='demo-banner'></div>";
}body.innerHTML+="<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";
AddPageTabs(arTabItems,body);
CERN_TabManagers=[];
for(var x=0,xl=arTabItems.length;
x<xl;
x++){var tabItem=arTabItems[x];
var tabManager=new MP_Core.TabManager(tabItem);
if(x==0){tabManager.setSelectedTab(true);
}CERN_TabManagers.push(tabManager);
CreateLiquidLayout(tabItem.components,_g(arTabItems[x].key));
SetupCompFilters(tabItem.components);
}MP_Util.Doc.AddCustomizeLink(criterion);
SetupExpandCollapse();
},InitSelectorLayout:function(arTabItems,title,sc,helpFile,helpURL,includeBanner,debugInd,criterion,custInd,anchorArray){var body=document.body;
var i18nCore=i18n.discernabu;
var jsonObject=MP_Core.AppUserPreferenceManager.GetQOCPreferences();
var lastSavedView;
if(jsonObject){var view=jsonObject.user_prefs.page_prefs.last_saved_view;
if(view){lastSavedView=view;
}else{lastSavedView="";
}}else{lastSavedView="";
}MP_Util.Doc.AddPageTitle(title,body,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,null);
if(includeBanner){body.innerHTML+="<div id='banner' class='demo-banner'></div>";
}body.innerHTML+="<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";
LoadPageSelector(arTabItems,body,lastSavedView,criterion);
CERN_TabManagers=[];
for(var x=0,xl=arTabItems.length;
x<xl;
x++){var tabItem=arTabItems[x];
var tabManager=new MP_Core.TabManager(tabItem);
if(x==0){tabManager.setSelectedTab(true);
}CERN_TabManagers.push(tabManager);
CreateLiquidLayout(tabItem.components,_g(arTabItems[x].key));
}SetupExpandCollapse();
},InitLayout:function(mPage,helpFile,helpURL,categoryMeaning){var i18nCore=i18n.discernabu;
var criterion=mPage.getCriterion();
if(categoryMeaning){var body=_g(categoryMeaning);
}else{var body=document.body;
}MP_Util.Doc.AddPageTitle(mPage.getName(),body,criterion.debug_ind,mPage.getCustomizeEnabled(),mPage.getTitleAnchors(),helpFile,helpURL,criterion,categoryMeaning);
if(mPage.isBannerEnabled()){body.innerHTML+="<div id='banner"+criterion.category_mean+"' class='demo-banner'></div>";
}body.innerHTML+="<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";
CreateLiquidLayout(mPage.getComponents(),body);
MP_Util.Doc.AddCustomizeLink(criterion);
SetupExpandCollapse();
SetupCompFilters(mPage.getComponents());
},CustomizeLayout:function(title,components,criterion){var body=document.body;
var i18nCore=i18n.discernabu;
MP_Util.Doc.AddPageTitle(title,body,0,false,null,null,null,criterion);
MP_Util.Doc.AddClearPreferences(body,criterion);
MP_Util.Doc.AddSavePreferences(body,criterion);
body.innerHTML+="<div id='disclaimer' class='disclaimer'><span>"+i18nCore.USER_CUST_DISCLAIMER+"</span></div>";
var compAr=[];
for(var x=components.length;
x--;
){var component=components[x];
if(component.getColumn()!=99){compAr.push(component);
}}CreateCustomizeLiquidLayout(compAr,body);
SetupExpandCollapse();
SetupCompFilters(compAr);
},GetComments:function(par,personnelArray){var com="",recDate="";
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
for(var j=0,m=par.COMMENTS.length;
j<m;
j++){if(personnelArray.length!=null){if(par.COMMENTS[j].RECORDED_BY){perCodeObj=MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY,personnelArray);
}if(par.COMMENTS[j].RECORDED_DT_TM!=""){recDate=df.formatISO8601(par.COMMENTS[j].RECORDED_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
}if(j>0){com+="<br />";
}com+=recDate+" -  "+perCodeObj.fullName+"<br />"+par.COMMENTS[j].COMMENT_TEXT;
}}return com;
},FinalizeComponent:function(contentHTML,component,countText){var styles=component.getStyles();
var rootComponentNode=component.getRootComponentNode();
if(rootComponentNode){var totalCount=Util.Style.g("sec-total",rootComponentNode,"span");
totalCount[0].innerHTML=countText;
var node=component.getSectionContentNode();
node.innerHTML=contentHTML;
MP_Util.Doc.InitHovers(styles.getInfo(),node,component);
MP_Util.Doc.InitSubToggles(node,"sub-sec-hd-tgl");
MP_Util.Doc.InitScrolling(Util.Style.g("scrollable",node,"div"),component.getScrollNumber(),"1.6");
}},InitScrolling:function(content,num,ht){for(var k=0;
k<content.length;
k++){MP_Util.Doc.InitSectionScrolling(content[k],num,ht);
}},InitSectionScrolling:function(sec,num,ht){var th=num*ht;
var totalHeight=th+"em";
sec.style.height=totalHeight;
sec.style.overflowY="scroll";
sec.style.overflowX="hidden";
},InitHovers:function(trg,par,component){gen=Util.Style.g(trg,par,"DL");
for(var i=0,l=gen.length;
i<l;
i++){var m=gen[i];
if(m){var nm=Util.gns(Util.gns(m));
if(nm){if(Util.Style.ccss(nm,"hvr")){hs(m,nm,component);
}}}}},InitSubToggles:function(par,tog){var i18nCore=i18n.discernabu;
var toggleArray=Util.Style.g(tog,par,"span");
for(var k=0;
k<toggleArray.length;
k++){Util.addEvent(toggleArray[k],"click",MP_Util.Doc.ExpandCollapse);
var checkClosed=Util.gp(Util.gp(toggleArray[k]));
if(Util.Style.ccss(checkClosed,"closed")){toggleArray[k].innerHTML="+";
toggleArray[k].title=i18nCore.SHOW_SECTION;
}}},ExpandCollapseAll:function(ID){var i18nCore=i18n.discernabu;
var tabSection=_g(ID.replace("expAll",""));
var expNode=_g(ID);
var allSections=Util.Style.g("section",tabSection);
if(isExpandedAll){for(var i=0,asLen=allSections.length;
i<asLen;
i++){var secHandle=Util.gc(Util.gc(allSections[i]));
if(secHandle.innerHTML=="-"||secHandle.innerHTML=="+"){Util.Style.acss(allSections[i],"closed");
secHandle.innerHTML="+";
secHandle.title=i18nCore.SHOW_SECTION;
}else{var allSubSections=Util.Style.g("sub-sec",allSections[i],"div");
for(var j=0,aSubLen=allSubSections.length;
j<aSubLen;
j++){var subSecTgl=Util.gc(Util.gc(allSubSections[j]));
Util.Style.acss(allSubSections[j],"closed");
subSecTgl.innerHTML="+";
subSecTgl.title=i18nCore.SHOW_SECTION;
}}}expNode.innerHTML=i18nCore.EXPAND_ALL;
isExpandedAll=false;
}else{for(var i=0,asLen=allSections.length;
i<asLen;
i++){var secHandle=Util.gc(Util.gc(allSections[i]));
if(secHandle.innerHTML=="-"||secHandle.innerHTML=="+"){Util.Style.rcss(allSections[i],"closed");
secHandle.innerHTML="-";
secHandle.title=i18nCore.HIDE_SECTION;
}else{var allSubSections=Util.Style.g("sub-sec",allSections[i],"div");
for(var j=0,aSubLen=allSubSections.length;
j<aSubLen;
j++){var subSecTgl=Util.gc(Util.gc(allSubSections[j]));
Util.Style.rcss(allSubSections[j],"closed");
subSecTgl.innerHTML="-";
subSecTgl.title=i18nCore.HIDE_SECTION;
}}}expNode.innerHTML=i18nCore.COLLAPSE_ALL;
isExpandedAll=true;
}},AddChartSearch:function(criterion,inViewPoint){var csCallback=function(url){try{if(url){var fwObj=window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
fwObj.SetPopupStringProp("REPORT_NAME","<url>"+url);
fwObj.SetPopupDoubleProp("WIDTH",1200);
fwObj.SetPopupDoubleProp("HEIGHT",700);
fwObj.SetPopupBoolProp("SHOW_BUTTONS",0);
fwObj.LaunchPopup();
}else{MP_Util.LogError("Error retriving URL from search");
}}catch(err){alert(i18n.discernabu.CODE_LEVEL);
MP_Util.LogError("Error creating PVFRAMEWORKLINK window <br />Message: "+err.description+"<br />Name: "+err.name+"<br />Number: "+(err.number&65535)+"<br />Description: "+err.description);
}};
var csDiv=Util.cep("div",{id:"chrtSearchBox"});
csDiv.innerHTML="<div id='chart-search-input-box'></div>";
if(inViewPoint){var vpTl=_g("vwpTabList");
Util.ac(csDiv,vpTl);
}else{var pgCtrl=_g("pageCtrl"+criterion.category_mean);
pgCtrl.parentNode.insertBefore(csDiv,pgCtrl);
}var csParams={patientId:criterion.person_id,userId:criterion.provider_id,callback:csCallback};
try{ChartSearchInput.embed("chart-search-input-box",csParams);
}catch(err){MP_Util.LogError("Error calling Chart Search embed <br />Message: "+err.description+"<br />Name: "+err.name+"<br />Number: "+(err.number&65535)+"<br />Description: "+err.description);
}},AddPageTitle:function(title,bodyTag,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,categoryMeaning){var i18nCore=i18n.discernabu;
var ar=[];
var imgSource=criterion.static_content+"\\images\\3865_16.gif";
if(categoryMeaning){title="";
bodyTag=_g(categoryMeaning);
bodyTag.innerHTML="";
}else{if(bodyTag){bodyTag=document.body;
}}ar.push("<div class='pg-hd'>");
ar.push("<h1><span class='pg-title'>",title,"</span></h1><span id='pageCtrl",criterion.category_mean,"' class='page-ctrl'>");
if(categoryMeaning){var df=MP_Util.GetDateFormatter();
ar.push("<span class='other-anchors'>",i18nCore.AS_OF_TIME.replace("{0}",df.format(new Date(),mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)),"</span>");
}if(anchorArray){for(var x=0,xl=anchorArray.length;
x<xl;
x++){ar.push("<span class='other-anchors'>"+anchorArray[x]+"</span>");
}}ar.push("<a id='expAll",criterion.category_mean,"' class='expAll' onclick='MP_Util.Doc.ExpandCollapseAll(\"expAll",criterion.category_mean,"\")'>",i18nCore.EXPAND_ALL,"</a>");
if(custInd){ar.push("<a id='custView",criterion.category_mean,"' class='custView'></a>");
}if(criterion.help_file_local_ind===1&&helpFile&&helpFile.length>0){ar.push("<a id='helpMenu",criterion.category_mean,"' onclick='MP_Util.Doc.LaunchHelpWindow(\""+helpFile+"\")' >",i18nCore.HELP,"</a><img src='",imgSource,"'/></span></div>");
}else{if(helpURL&&helpURL.length>0){ar.push("<a id='helpMenu",criterion.category_mean,"' onclick='MP_Util.Doc.LaunchHelpWindow(\""+helpURL+"\")' >",i18nCore.HELP,"</a><img src='",imgSource,"'/></span></div>");
}}ar.push("</span></div>");
bodyTag.innerHTML+=ar.join("");
return;
},LaunchHelpWindow:function(helpURL){var wParams="left=0,top=0,width=1200,height=700,toolbar=no";
MP_Util.LogCclNewSessionWindowInfo(null,helpURL,"mp_core.js","LaunchHelpWindow");
CCLNEWSESSIONWINDOW(helpURL,"_self",wParams,0,1);
Util.preventDefault();
},AddClearPreferences:function(body,criterion){var i18nCore=i18n.discernabu;
var pageCtrl=_g("pageCtrl"+criterion.category_mean);
var clearPrefNode=Util.cep("A",{id:"clearPrefs",onclick:"javascript:MP_Core.AppUserPreferenceManager.ClearPreferences();"});
clearPrefNode.innerHTML=i18nCore.CLEAR_PREFERENCES;
Util.ac(clearPrefNode,pageCtrl);
},AddSavePreferences:function(body,criterion){var i18nCore=i18n.discernabu;
var pageCtrl=_g("pageCtrl"+criterion.category_mean);
var savePrefNode=Util.cep("A",{id:"savePrefs",onclick:"javascript:MP_Core.AppUserPreferenceManager.SavePreferences();"});
savePrefNode.innerHTML=i18nCore.SAVE_PREFERENCES;
Util.ac(savePrefNode,pageCtrl);
},AddCustomizeLink:function(criterion){var i18nCore=i18n.discernabu;
var custNode=_g("custView"+criterion.category_mean);
if(custNode){custNode.innerHTML=i18nCore.CUSTOMIZE;
var compReportIds=GetPageReportIds();
if(typeof m_viewpointJSON=="undefined"){var cclParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+criterion.executable+"^","^^","^"+criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+criterion.category_mean+"^",criterion.debug_ind,"value("+compReportIds.join(".0,")+")","1"];
custNode.onclick=function(){CCLLINK("MP_DRIVER",cclParams.join(","),1);
Util.preventDefault();
};
}else{var js_viewpoint=JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
var cclParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+criterion.executable+"^","^"+criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+js_viewpoint.VIEWPOINT_NAME_KEY+"^",criterion.debug_ind,"value("+compReportIds.join(".0,")+")","1","^"+criterion.category_mean+"^"];
custNode.onclick=function(){CCLLINK("MP_VIEWPOINT_DRIVER",cclParams.join(","),1);
Util.preventDefault();
};
}}},RenderLayout:function(){if(CERN_TabManagers!=null){var tabManager=null;
if(window.name.length>0){var paramList=window.name.split(",");
MP_Util.DisplaySelectedTab(paramList[0],paramList[1]);
}else{tabManager=CERN_TabManagers[0];
tabManager.setSelectedTab(true);
tabManager.loadTab();
}}else{if(CERN_MPageComponents!=null){for(var x=0;
x<CERN_MPageComponents.length;
x++){var comp=CERN_MPageComponents[x];
if(comp.isDisplayable()&&!comp.isLoaded()){comp.setLoaded(true);
comp.InsertData();
}}}}},ExpandCollapse:function(){var i18nCore=i18n.discernabu;
var gpp=Util.gp(Util.gp(this));
if(Util.Style.ccss(gpp,"closed")){Util.Style.rcss(gpp,"closed");
this.innerHTML="-";
this.title=i18nCore.HIDE_SECTION;
}else{Util.Style.acss(gpp,"closed");
this.innerHTML="+";
this.title=i18nCore.SHOW_SECTION;
}},HideHovers:function(){var hovers=Util.Style.g("hover",document.body,"DIV");
for(var i=hovers.length;
i--;
){if(Util.gp(hovers[i]).nodeName=="BODY"){hovers[i].style.display="none";
Util.de(hovers[i]);
}}},ReplaceSubTitleText:function(component,text){var compNode=component.getRootComponentNode();
var subTitle=Util.Style.g("sub-title-disp",compNode,"div");
if(subTitle){subTitle[0].innerHTML=text;
}},ReInitSubTitleText:function(component){if(component.getScope()>0){var st=Util.Style.g("sub-title-disp",component.getRootComponentNode(),"div");
st[0].innerHTML=CreateSubTitleText(component);
}},RunAccordion:function(index){var titleAr=[];
var nID="Accordion"+index+"Content";
var TimeToSlide=100;
var titleDiv=_g("Accordion"+index+"Title");
var containerDiv=_g("AccordionContainer"+index);
var component=MP_Util.GetCompObjById(index);
var location=component.getCriterion().static_content;
if(Util.Style.ccss(titleDiv,"Expanded")){Util.Style.rcss(titleDiv,"Expanded");
Util.Style.rcss(containerDiv,"Expanded");
}else{Util.Style.acss(titleDiv,"Expanded");
Util.Style.acss(containerDiv,"Expanded");
}if(openAccordion==nID){nID="";
}setTimeout("MP_Util.Doc.Animate("+new Date().getTime()+","+TimeToSlide+",'"+openAccordion+"','"+nID+"',"+index+")",33);
openAccordion=nID;
},Animate:function(lastTick,timeLeft,closingId,openingId,compID){var TimeToSlide=timeLeft;
var curTick=new Date().getTime();
var elapsedTicks=curTick-lastTick;
var ContentHeight=275;
var opening=(openingId=="")?null:_g(openingId);
var closing=(closingId=="")?null:_g(closingId);
if(timeLeft<=elapsedTicks){if(opening){opening.style.height=ContentHeight+"px";
}if(closing){closing.style.display="none";
closing.style.height="0px";
var filterListAr=Util.Style.g("acc-filter-list-item"+compID);
var filtersSelected=MP_Util.Doc.GetSelected(filterListAr);
}return;
}timeLeft-=elapsedTicks;
var newClosedHeight=Math.round((timeLeft/TimeToSlide)*ContentHeight);
if(opening){if(opening.style.display!="block"){opening.style.display="block";
opening.style.height=(ContentHeight-newClosedHeight)+"px";
}}if(closing){closing.style.height=newClosedHeight+"px";
}setTimeout("MP_Util.Doc.Animate("+curTick+","+timeLeft+",'"+closingId+"','"+openingId+"',"+compID+")",33);
},GetSelected:function(opt){var selected=[];
var index=0;
var optLen=opt.length;
for(var intLoop=0;
intLoop<optLen;
intLoop++){if(opt[intLoop].selected){index=selected.length;
selected[index]={};
selected[index].value=opt[intLoop].value;
selected[index].index=intLoop;
}}return selected;
},CreateLookBackMenu:function(component,loadInd,text){var i18nCore=i18n.discernabu;
var ar=[];
var style=component.getStyles();
var ns=style.getNameSpace();
var compId=style.getId();
var mnuCompId=component.getComponentId();
var loc=component.getCriterion().static_content;
var mnuItems=[];
var mnuId=compId+"Mnu";
var scope=component.getScope();
var lookBackText="";
var lookBackUnits="";
var lookBackType=0;
var filterMsg="";
var filterMsgElementTitle="";
if(component.m_grouper_arr.length===0){component.setCompFilters(false);
}else{component.setCompFilters(true);
}if(loadInd===2){var lbMenu=_g("lb"+mnuId);
if(component.hasCompFilters()){if(!text){MP_Util.LaunchCompFilterSelection(mnuCompId,i18nCore.FACILITY_DEFINED_VIEW,"",2);
}else{var filterMsgElement=_g("cf"+mnuCompId+"msg");
filterMsgElementTitle=filterMsgElement.title;
filterMsg=filterMsgElement.innerHTML;
}}if(lbMenu){lbMenu.innerHTML="";
}}if(!text){var mnuDisplay=CreateSubTitleText(component);
}else{var mnuDisplay=text;
}var menuItems=component.getLookbackMenuItems();
if(menuItems){for(var x=0;
x<menuItems.length;
x++){mnuItems[x]=new Array();
lookBackUnits=parseInt(menuItems[x].getDescription(),10);
var tempTypeId=menuItems[x].getId();
switch(tempTypeId){case 1:lookBackType=1;
break;
case 2:lookBackType=2;
break;
case 3:lookBackType=3;
break;
case 4:lookBackType=4;
break;
case 5:lookBackType=5;
break;
default:lookBackType=tempTypeId;
break;
}if(scope>0){if(lookBackUnits>0&&lookBackType>0){var replaceText="";
switch(lookBackType){case 1:replaceText=i18nCore.LAST_N_HOURS.replace("{0}",lookBackUnits);
break;
case 2:replaceText=i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
break;
case 3:replaceText=i18nCore.LAST_N_WEEKS.replace("{0}",lookBackUnits);
break;
case 4:replaceText=i18nCore.LAST_N_MONTHS.replace("{0}",lookBackUnits);
break;
case 5:replaceText=i18nCore.LAST_N_YEARS.replace("{0}",lookBackUnits);
break;
default:replaceText=i18nCore.LAST_N_DAYS.replace("{0}",lookBackUnits);
break;
}switch(scope){case 1:lookBackText=i18nCore.ALL_N_VISITS.replace("{0}",replaceText);
break;
case 2:lookBackText=i18nCore.SELECTED_N_VISIT.replace("{0}",replaceText);
break;
}}else{switch(scope){case 1:lookBackText=i18nCore.All_VISITS;
break;
case 2:lookBackText=i18nCore.SELECTED_VISIT;
break;
}}}mnuItems[x][0]=lookBackText;
mnuItems[x][1]=lookBackUnits;
mnuItems[x][2]=lookBackType;
}ar.push("<div id='lb",mnuId,"'><div id='stt",compId,"' class='sub-title-disp lb-drop-down'>");
ar.push("<span id='lbMnuDisplay",mnuCompId,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',compId,"\");'>",mnuDisplay,"<a id='",ns,"Drop'><img src='",loc,"\\images\\3943_16.gif'></a></span><span id='cf",mnuCompId,"msg' class='filter-applied-msg' title='",filterMsgElementTitle,"'>",filterMsg,"</span></div>");
ar.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='mnu-labelbox'>",mnuDisplay,"</div><div class='mnu-contentbox'>");
for(var x=0,xl=mnuItems.length;
x<xl;
x++){var item=mnuItems[x];
ar.push("<div><span class='lb-mnu' id='lb",compId,x,"' onclick='MP_Util.LaunchLookBackSelection(\"",mnuCompId,'",',item[1],',"',item[2],"\");'>",item[0],"</span></div>");
}ar.push("</div></div></div>");
}else{ar.push("<div id='lb",mnuId,"'><div id='stt",compId,"' class='sub-title-disp lb-drop-down'>");
ar.push("<span id='lbMnuDisplay",mnuCompId,"'>",mnuDisplay,"</span><span id='cf",mnuCompId,"msg' class='filter-applied-msg' title='",filterMsgElementTitle,"'>",filterMsg,"</span></div></div>");
}if(component.hasCompFilters()&&loadInd===1){ar.push("<div id='AccordionContainer",mnuCompId,"' class='accordion-container'>");
ar.push("<div id='Accordion",mnuCompId,"Content' class='accordion-content'><div id='Accordion",mnuCompId,"ContentDiv' class='acc-content-div'></div><div class='lb-pg-hd lb-page-ctrl'><a class='setDefault' href='#' onclick='MP_Core.AppUserPreferenceManager.SaveCompPreferences(",mnuCompId,"); return false;'>",i18nCore.SET_AS_DEFAULT,"</a><a class='resetAll' href='#' onclick='MP_Core.AppUserPreferenceManager.ClearCompPreferences(",mnuCompId,"); return false;'>",i18nCore.RESET_ALL,"</a></div></div>");
ar.push("<div id='Accordion",mnuCompId,"Title' class='accordion-title' onclick='MP_Util.Doc.RunAccordion(",mnuCompId,");' onselectstart='return false;'></div></div>");
}switch(loadInd){case 2:lbMenu.innerHTML=ar.join("");
break;
default:var arHtml=ar.join("");
return arHtml;
}}};
function GetPreferenceIdentifier(){var prefIdentifier="";
if(CERN_TabManagers!=null){for(var x=CERN_TabManagers.length;
x--;
){var tabManager=CERN_TabManagers[x];
if(tabManager.getSelectedTab()){var tabItem=tabManager.getTabItem();
return tabItem.prefIdentifier;
}}}else{if(CERN_MPageComponents!=null){for(var x=CERN_MPageComponents.length;
x--;
){var criterion=CERN_MPageComponents[x].getCriterion();
return criterion.category_mean;
}}}return prefIdentifier;
}function GetPageReportIds(){var ar=[];
if(CERN_TabManagers!=null){for(var x=CERN_TabManagers.length;
x--;
){var tabManager=CERN_TabManagers[x];
if(tabManager.getSelectedTab()){var tabItem=tabManager.getTabItem();
var components=tabItem.components;
if(components!=null&&components.length>0){for(var y=components.length;
y--;
){ar.push(components[y].getReportId());
}}break;
}}}else{if(CERN_MPageComponents!=null){for(var x=CERN_MPageComponents.length;
x--;
){ar.push(CERN_MPageComponents[x].getReportId());
}}}return ar;
}function GetComponentArray(components){var grpAr=[];
var colAr=[];
var rowAr=[];
var curCol=-1;
var curGrp=-1;
var sHTML=[];
if(components!=null){components.sort(SortMPageComponents);
for(var x=0,xl=components.length;
x<xl;
x++){var component=components[x];
if(CERN_MPageComponents==null){CERN_MPageComponents=[];
}CERN_MPageComponents.push(component);
if(component.isDisplayable()){var compGrp=component.getPageGroupSequence();
var compCol=component.getColumn();
if(compGrp!=curGrp){curCol=-1;
colAr=[];
grpAr.push(colAr);
curGrp=compGrp;
}if(compCol!=curCol){rowAr=[];
colAr.push(rowAr);
curCol=compCol;
}rowAr.push(component);
}}}return grpAr;
}function CreateCustomizeLiquidLayout(components,parentNode){var sHTML=[];
var grpAr=GetComponentArray(components);
sHTML.push("<div class=pref-columns>");
for(var x=0,xl=grpAr.length;
x<xl;
x++){colAr=grpAr[x];
sHTML.push("<div>");
var colLen=colAr.length;
sHTML.push("<div class='col-group three-col'>");
sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
for(var y=0;
y<colLen;
y++){var comps=colAr[y];
var colClassName="col"+(y+1)+" cust-col";
sHTML.push("<div class='",colClassName,"'>");
for(var z=0,zl=comps.length;
z<zl;
z++){sHTML.push(CreateCompDiv(comps[z]));
}sHTML.push("</div>");
}for(var y=colLen+1;
y<=3;
y++){var colClassName="col"+(y)+" cust-col";
sHTML.push("<div class='",colClassName,"'></div>");
}sHTML.push("</div></div></div></div>");
}sHTML.push("</div>");
parentNode.innerHTML+=sHTML.join("");
}function CreateLiquidLayout(components,parentNode){var grpAr=GetComponentArray(components);
var sHTML=[];
for(var x=0,xl=grpAr.length;
x<xl;
x++){colAr=grpAr[x];
sHTML.push("<div>");
var colLen=colAr.length;
switch(colLen){case 1:sHTML.push("<div class='col-group one-col'>");
break;
case 2:sHTML.push("<div class='col-group two-col'>");
break;
case 3:sHTML.push("<div class='col-group three-col'>");
break;
case 4:sHTML.push("<div class='col-group four-col'>");
break;
default:sHTML.push("<div class='col-group five-col'>");
}sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
for(var y=0;
y<colLen;
y++){var colClassName="col"+(y+1);
var comps=colAr[y];
sHTML.push("<div class='",colClassName,"'>");
for(var z=0,zl=comps.length;
z<zl;
z++){sHTML.push(CreateCompDiv(comps[z]));
}sHTML.push("</div>");
}sHTML.push("</div></div></div></div>");
}parentNode.innerHTML+=sHTML.join("");
}function SetupExpandCollapse(){var i18nCore=i18n.discernabu;
var toggleArray=Util.Style.g("sec-hd-tgl");
for(var k=0;
k<toggleArray.length;
k++){Util.addEvent(toggleArray[k],"click",MP_Util.Doc.ExpandCollapse);
var checkClosed=Util.gp(Util.gp(toggleArray[k]));
if(Util.Style.ccss(checkClosed,"closed")){toggleArray[k].innerHTML="+";
toggleArray[k].title=i18nCore.SHOW_SECTION;
}}}function SetupCompFilters(compArray){var compArrayLen=compArray.length;
for(var x=0;
x<compArrayLen;
x++){if(compArray[x].m_grouper_arr.length===0){compArray[x].setCompFilters(false);
}else{compArray[x].setCompFilters(true);
}if(compArray[x].hasCompFilters()){var i18nCore=i18n.discernabu;
var mnuDisplay=i18nCore.FACILITY_DEFINED_VIEW;
var dispVar=i18nCore.FACILITY_DEFINED_VIEW;
var compID=compArray[x].getComponentId();
var style=compArray[x].getStyles();
var ns=style.getNameSpace();
var styleId=style.getId();
var loc=compArray[x].getCriterion().static_content;
var mnuId=styleId+"TypeMenu";
var z=0;
compArray[x].sortGrouperArrayByLabel();
if(compArray[x].getGrouperFilterEventSets()){mnuDisplay=compArray[x].getGrouperFilterLabel();
var filterAppliedSpan=_g("cf"+compID+"msg");
if(filterAppliedSpan){Util.de(filterAppliedSpan);
}if(compArray[x].getGrouperFilterLabel()!==dispVar){var newFilterAppliedSpan=Util.ce("span");
var filterAppliedArr=["<span id='cf",compID,"msg' class='filter-applied-msg' title='",compArray[x].getGrouperFilterLabel(),"'>",i18nCore.FILTER_APPLIED,"</span>"];
newFilterAppliedSpan.innerHTML=filterAppliedArr.join("");
var lbDropDownDiv=_g("lbMnuDisplay"+compID);
Util.ia(newFilterAppliedSpan,lbDropDownDiv);
}}var contentDiv=_g("Accordion"+compID+"ContentDiv");
var contentDivArr=[];
var groupLen=compArray[x].m_grouper_arr.length;
contentDivArr.push("<div id='cf",mnuId,"' class='acc-mnu'>");
contentDivArr.push("<span id='cflabel",compID,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',styleId,"\");'>",i18nCore.FILTER_LABEL,mnuDisplay,"<a id='compFilterDrop",compID,"'><img src='",loc,"\\images\\3943_16.gif'></a></span>");
contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='acc-mnu-contentbox'>");
contentDivArr.push("<div><span id='cf",styleId,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compID,',"',dispVar,'","",1);\'>',i18nCore.FACILITY_DEFINED_VIEW,"</span></div>");
for(z=0;
z<groupLen;
z++){if(compArray[x].getGrouperLabel(z)){var esIndex=z;
contentDivArr.push("<div><span id='cf",styleId,z,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compID,',"',compArray[x].getGrouperLabel(z),'",',esIndex,",1);'>",compArray[x].getGrouperLabel(z),"</span></div>");
}}contentDivArr.push("</div></div></div>");
contentDiv.innerHTML=contentDivArr.join("");
}}}function CreateCompDiv(component){var i18nCore=i18n.discernabu;
var ar=[];
var style=component.getStyles();
var ns=style.getNameSpace();
var compId=style.getId();
var mnuCompId=component.getComponentId();
var secClass=style.getClassName();
var tabLink=component.getLink();
var loc=component.getCriterion().static_content;
var tglCode=(!component.isAlwaysExpanded())?["<span class='",style.getHeaderToggle(),"' title='",i18nCore.HIDE_SECTION,"'>-</span>"].join(""):"";
if(!component.isExpanded()&&!component.isAlwaysExpanded()){secClass+=" closed";
}var sAnchor=(tabLink!=""&&component.getCustomizeView()==false)?CreateComponentAnchor(component):component.getLabel();
ar.push("<div id='",style.getId(),"' class='",secClass,"'>","<h2 class='",style.getHeaderClass(),"'>",tglCode,"<span class='",style.getTitle(),"'><span>",sAnchor,"</span>");
if(component.getCustomizeView()==false){ar.push("<span class='",style.getTotal(),"'>",i18nCore.LOADING_DATA+"...","</span></span>");
if(component.isPlusAddEnabled()){ar.push("<a id='",ns,"Add' class=add-plus onclick='MP_Util.OpenTab(\"",compId,"\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>",i18nCore.ADD,"</span></a>");
var menuItems=component.getMenuItems();
if(menuItems!=null||menuItems>0){var menuId=compId+"Menu";
ar.push("<a id='",ns,"Drop' class='drop-Down'><img src='",loc,"\\images\\3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"",menuId,'", "',compId,"\");'></a>");
ar.push("<div class='form-menu menu-hide' id='",menuId,"'><span>");
for(var x=0,xl=menuItems.length;
x<xl;
x++){var item=menuItems[x];
ar.push("<div>");
ar.push("<a id='lnkID",x,"' href='#' onclick='javascript:MP_Util.LaunchMenuSelection(\"",compId,'",',item.getId(),");'>",item.getDescription(),"</a>");
ar.push("</div>");
}ar.push("</span></div>");
}}}else{ar.push("</span>");
}ar.push("</h2>");
if(component.getCustomizeView()==false){var scope=component.getScope();
if(scope===3){ar.push(component.getScopeHTML());
}else{if(scope>0){var lbMenuItems=component.getLookbackMenuItems();
if(lbMenuItems){component.setLookBackDropDown(true);
}else{component.setLookBackDropDown(false);
}if(component.m_grouper_arr.length===0){component.setCompFilters(false);
}else{component.setCompFilters(true);
}ar.push(MP_Util.Doc.CreateLookBackMenu(component,1,""));
}}}ar.push("<div id='",style.getContentId(),"' class='",style.getContentClass(),"'></div>");
var footerText=component.getFooterText();
if(footerText&&footerText!==""){ar.push("<div class=sec-footer>",footerText,"</div>");
}ar.push("</div>");
var arHtml=ar.join("");
return arHtml;
}function CreateSubTitleText(component){var i18nCore=i18n.discernabu;
var subTitleText="";
var scope=component.getScope();
var lookbackDays=component.getLookbackDays();
var lookbackUnits=(lookbackDays>0)?lookbackDays:component.getLookbackUnits();
var lookbackFlag=(lookbackDays>0)?2:component.getLookbackUnitTypeFlag();
if(scope>0){if(lookbackFlag>0&&lookbackUnits>0){var replaceText="";
switch(lookbackFlag){case 1:replaceText=i18nCore.LAST_N_HOURS.replace("{0}",lookbackUnits);
break;
case 2:replaceText=i18nCore.LAST_N_DAYS.replace("{0}",lookbackUnits);
break;
case 3:replaceText=i18nCore.LAST_N_WEEKS.replace("{0}",lookbackUnits);
break;
case 4:replaceText=i18nCore.LAST_N_MONTHS.replace("{0}",lookbackUnits);
break;
case 5:replaceText=i18nCore.LAST_N_YEARS.replace("{0}",lookbackUnits);
break;
}switch(scope){case 1:subTitleText=i18nCore.ALL_N_VISITS.replace("{0}",replaceText);
break;
case 2:subTitleText=i18nCore.SELECTED_N_VISIT.replace("{0}",replaceText);
break;
}}else{switch(scope){case 1:subTitleText=i18nCore.All_VISITS;
break;
case 2:subTitleText=i18nCore.SELECTED_VISIT;
break;
}}}return subTitleText;
}function CreateComponentAnchor(component){var i18nCore=i18n.discernabu;
var style=component.getStyles();
var criterion=component.getCriterion();
var sParms='javascript:APPLINK(0,"'+criterion.executable+'","/PERSONID='+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+component.getLink()+'^"); return false;';
var sAnchor="<a id="+style.getLink()+" title='"+i18nCore.GO_TO_TAB.replace("{0}",component.getLink())+"' href='#' onclick='"+sParms+"'>"+component.getLabel()+"</a>";
return sAnchor;
}function LoadPageSelector(items,bodyTag,lastSavedView,criterion){var i18nCore=i18n.discernabu;
var activeInd;
var ar=[];
var divAr=[];
var pageKey="-1";
var pageCtrl=_g("pageCtrl"+criterion.category_mean);
if(lastSavedView){var lastSavedViewFound=false;
var i=items.length;
while(i--){if(items[i].name==lastSavedView){window.name=items[i].key+",'a-tab'"+i;
pageKey=items[i].key;
lastSavedViewFound=true;
break;
}}if(lastSavedViewFound){ar.push("<span class='qoc-view-selector'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,false)>");
for(var x=0,xl=items.length;
x<xl;
x++){var item=items[x];
if(item.key==pageKey){activeInd=1;
}else{activeInd=0;
}ar.push("<option value='",item.key,"'",(activeInd==1)?" selected='selected'":"",">",item.name,"</option>");
divAr.push("<div id='",item.key,"' class='div-tab-item",(activeInd==1)?" div-tab-item-selected":" div-tab-item-not-selected","'></div>");
}ar.push("</select></span>");
pageCtrl.innerHTML=ar.join("")+pageCtrl.innerHTML;
bodyTag.innerHTML+=divAr.join("");
}else{ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>",i18nCore.VIEW_NOT_SELECTED,"</span>");
ar.push("<span class='qoc-view-selector'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
for(var x=0,xl=items.length;
x<xl;
x++){var item=items[x];
ar.push("<option value='",item.key,"'>",item.name,"</option>");
divAr.push("<div id='",item.key,"' class='div-tab-item div-tab-item-not-selected'></div>");
}ar.push("<option value='Blank_Space' selected='selected'></option>");
divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
ar.push("</select></span>");
pageCtrl.innerHTML=ar.join("")+pageCtrl.innerHTML;
bodyTag.innerHTML+=divAr.join("");
window.name="QOC_PAGE_TAB_"+items.length+",'a-tab'"+items.length;
}}else{ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>",i18nCore.VIEW_NOT_SELECTED,"</span>");
ar.push("<span class='qoc-view-selector'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
for(var x=0,xl=items.length;
x<xl;
x++){var item=items[x];
ar.push("<option value='",item.key,"'>",item.name,"</option>");
divAr.push("<div id='",item.key,"' class='div-tab-item div-tab-item-not-selected'></div>");
}ar.push("<option value='Blank_Space' selected='selected'></option>");
divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
ar.push("</select></span>");
pageCtrl.innerHTML=ar.join("")+pageCtrl.innerHTML;
bodyTag.innerHTML+=divAr.join("");
window.name="QOC_PAGE_TAB_"+items.length+",'a-tab'"+items.length;
}}function AddPageTabs(items,bodyTag){var ar=[];
var divAr=[];
if(bodyTag==null){bodyTag=document.body;
}ar.push("<ul class=tabmenu>");
for(var x=0,xl=items.length;
x<xl;
x++){var item=items[x];
var activeInd=(x==0)?1:0;
ar.push(CreateTabLi(item,activeInd,x));
divAr.push("<div id='",item.key,"' class='div-tab-item'></div>");
}ar.push("</ul>");
bodyTag.innerHTML+=(ar.join("")+divAr.join(""));
}function CreateTabLi(item,activeInd,sequence){var ar=[];
var tabName="";
tabName=item.name;
ar.push("<li>");
var seqClass="a-tab"+sequence;
if(activeInd){ar.push("<a id='",seqClass,"' class='anchor-tab-item active' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"",item.key,'","',seqClass,"\");return false;'>",tabName,"</a>");
}else{ar.push("<a id='",seqClass,"' class='anchor-tab-item inactive' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"",item.key,'","',seqClass,"\");return false;'>",tabName,"</a>");
}ar.push("</li>");
return(ar.join(""));
}}();
MP_Util.Measurement=function(){var m_nf=null;
return{GetString:function(result,codeArray,dateMask,excludeUOM){var obj=(result instanceof MP_Core.Measurement)?result.getResult():MP_Util.Measurement.GetObject(result,codeArray);
if(obj instanceof MP_Core.QuantityValue){if(excludeUOM){return obj.getValue();
}return obj.toString();
}else{if(obj instanceof Date){return obj.format(dateMask);
}}return obj;
},GetObject:function(result,codeArray){switch(result.CLASSIFICATION.toUpperCase()){case"QUANTITY_VALUE":return GetQuantityValue(result,codeArray);
case"STRING_VALUE":return(GetStringValue(result));
case"DATE_VALUE":return(GetDateValue(result));
case"CODIFIED_VALUES":case"CODE_VALUE":return(GetCodedResult(result));
case"ENCAPSULATED_VALUE":return(GetEncapsulatedValue(result));
}},SetPrecision:function(num,dec){var nf=MP_Util.GetNumericFormatter();
return nf.format(num,"^."+dec);
},GetModifiedIcon:function(result){return(result.isModified())?"<span class='res-modified'>&nbsp;</span>":"";
},GetNormalcyClass:function(oMeasurement){var normalcy="res-normal";
var nc=oMeasurement.getNormalcy();
if(nc!=null){var normalcyMeaning=nc.meaning;
if(normalcyMeaning!=null){if(normalcyMeaning==="LOW"){normalcy="res-low";
}else{if(normalcyMeaning==="HIGH"){normalcy="res-high";
}else{if(normalcyMeaning==="CRITICAL"||normalcyMeaning==="EXTREMEHIGH"||normalcyMeaning==="PANICHIGH"||normalcyMeaning==="EXTREMELOW"||normalcyMeaning==="PANICLOW"||normalcyMeaning==="VABNORMAL"||normalcyMeaning==="POSITIVE"){normalcy="res-severe";
}else{if(normalcyMeaning==="ABNORMAL"){normalcy="res-abnormal";
}}}}}}return normalcy;
},GetNormalcyResultDisplay:function(oMeasurement,excludeUOM){var ar=["<span class='",MP_Util.Measurement.GetNormalcyClass(oMeasurement),"'><span class='res-ind'>&nbsp;</span><span class='res-value'>",GetEventViewerLink(oMeasurement,MP_Util.Measurement.GetString(oMeasurement,null,"longDateTime2",excludeUOM)),"</span>",MP_Util.Measurement.GetModifiedIcon(oMeasurement),"</span>"];
return ar.join("");
}};
function GetEventViewerLink(oMeasurement,sResultDisplay){var params=[oMeasurement.getPersonId(),oMeasurement.getEncntrId(),oMeasurement.getEventId(),'"EVENT"'];
var ar=["<a onclick='MP_Util.LaunchClinNoteViewer(",params.join(","),"); return false;' href='#'>",sResultDisplay,"</a>"];
return ar.join("");
}function GetEncapsulatedValue(result){var ar=[];
var encap=result.ENCAPSULATED_VALUE;
if(encap&&encap.length>0){for(var n=0,nl=encap.length;
n<nl;
n++){var txt=encap[n].TEXT_PLAIN;
if(txt!=null&&txt.length>0){ar.push(txt);
}}}return ar.join("");
}function GetQuantityValue(result,codeArray){var qv=new MP_Core.QuantityValue();
qv.init(result,codeArray);
return qv;
}function GetDateValue(result){for(var x=0,xl=result.DATE_VALUE.length;
x<xl;
x++){var date=result.DATE_VALUE[x];
if(date.DATE!=""){var dateTime=new Date();
dateTime.setISO8601(date.DATE);
return dateTime;
}}return null;
}function GetCodedResult(result){var cdValue=result.CODE_VALUE;
var ar=[];
for(var n=0,nl=cdValue.length;
n<nl;
n++){var values=cdValue[n].VALUES;
for(var p=0,pl=values.length;
p<pl;
p++){ar.push(values[p].SOURCE_STRING);
}var sOther=cdValue[n].OTHER_RESPONSE;
if(sOther!=""){ar.push(sOther);
}}return ar.join(", ");
}function GetStringValue(result){var strValue=result.STRING_VALUE;
var ar=[];
for(var n=0,nl=strValue.length;
n<nl;
n++){ar.push(strValue[n].VALUE);
}return ar.join(", ");
}}();
document.getElementsByClassName=function(cl,e){var retnode=[];
var clssnm=new RegExp("\\b"+cl+"\\b");
var elem=this.getElementsByTagName("*",e);
for(var u=0;
u<elem.length;
u++){var classes=elem[u].className;
if(clssnm.test(classes)){retnode.push(elem[u]);
}}return retnode;
};
Function.prototype.bind=function(object){var method=this;
return function(){return method.apply(object,arguments);
};
};
function EventListener(){this.events=[];
this.builtinEvts=[];
}EventListener.prototype.getActionIdx=function(obj,evt,action,binding){if(obj&&evt){var curel=this.events[obj][evt];
if(curel){var len=curel.length;
for(var i=len-1;
i>=0;
i--){if(curel[i].action==action&&curel[i].binding==binding){return i;
}}}else{return -1;
}}return -1;
};
EventListener.prototype.addListener=function(obj,evt,action,binding){if(this.events[obj]){if(this.events[obj][evt]){if(this.getActionIdx(obj,evt,action,binding)==-1){var curevt=this.events[obj][evt];
curevt[curevt.length]={action:action,binding:binding};
}}else{this.events[obj][evt]=[];
this.events[obj][evt][0]={action:action,binding:binding};
}}else{this.events[obj]=[];
this.events[obj][evt]=[];
this.events[obj][evt][0]={action:action,binding:binding};
}};
EventListener.prototype.removeListener=function(obj,evt,action,binding){if(this.events[obj]){if(this.events[obj][evt]){var idx=this.getActionIdx(obj,evt,action,binding);
if(idx>=0){this.events[obj][evt].splice(idx,1);
}}}};
EventListener.prototype.removeAllListeners=function(obj,binding){if(this.events[obj]){for(var el=this.events[obj].length;
el--;
){if(this.events[obj][el]){for(var ev=this.events[obj][el].length;
ev--;
){if(this.events[obj][el][ev].binding==binding){this.events[obj][el].splice(ev,1);
}}}}}};
EventListener.prototype.fireEvent=function(e,obj,evt,args){if(!e){e=window.event;
}if(obj&&this.events){var evtel=this.events[obj];
if(evtel){var curel=evtel[evt];
if(curel){for(var act=curel.length;
act--;
){var action=curel[act].action;
if(curel[act].binding){action=action.bind(curel[act].binding);
}action(e,args);
}}}}};
CERN_EventListener=new EventListener();
EventListener.EVENT_CLINICAL_EVENT=1;
EventListener.EVENT_ORDER_ACTION=2;
EventListener.EVENT_ADD_DOC=3;
EventListener.EVENT_PREGNANCY_EVENT=4;

if(typeof MPage=="undefined"){MPage={_Components:[],Properties:{mine:"mine",personId:0,encounter:0,userId:0,pprCd:0,posCd:0},Event:{registerEvent:function(event,listener,component){return null;
},triggerEvent:function(event){return null;
},removeEvent:function(event,listener){return null;
}},namespace:function(name){var parts=name.split(".");
var result=window;
while(parts.length){var part=parts.shift();
result=result[part]=result[part]||{};
}return result;
},registerUnloadEvent:function(){Util.addEvent(window,"beforeunload",MPage.fireUnload);
},registerResizeEvent:function(){Util.addEvent(window,"resize",MPage.fireResize);
},fireResize:function(){var tempComp;
var x;
for(x=MPage._Components.length;
x--;
){tempComp=MPage._Components[x];
compContainer=tempComp.getTarget();
tempComp.resize($(compContainer).width(),$(compContainer).height());
}},fireUnload:function(){var x;
for(x=MPage._Components.length;
x--;
){MPage._Components[x].unload();
}},addCustomComp:function(compObj){MPage._Components.push(compObj);
},getCustomComp:function(compId){var tempComp;
var x;
for(x=MPage._Components.length;
x--;
){tempComp=MPage._Components[x];
if(tempComp.getStyles().getId()===compId){return tempComp;
}}return null;
}};
}MPage.Component=function(){this.baseclassSpecVersion=1;
this.componentMinimumSpecVersion=1;
};
MPage.Component.prototype.init=function(){};
MPage.Component.prototype.generate=function(target,callback,options){var combined;
var funcCallback;
if(!target){target=component.getTarget();
}if(!callback){funcCallback=function(component){component.render();
};
}else{funcCallback=function(component){component.render();
callback(component);
};
}if(options){combined={};
combined=this.options;
for(attr in options){combined[attr]=options[attr];
}this.options=combined;
}this.init();
this.loadData(funcCallback);
return this;
};
MPage.Component.prototype.loadData=function(callback){var component=this;
var funcCallback;
funcCallback=function(response){component.data=response;
callback(component);
};
if(this.cclDataType==="undefined"){this.cclDataType="JSON";
}if(this.cclProgram&&this.cclParams&&(this.cclParams.length>0)){this.loadCCL(this.cclProgram,this.cclParams,funcCallback,this.cclDataType);
}else{callback(component);
}};
MPage.Component.prototype.loadCCL=function(cclProgram,cclParams,callback,dataType){var that=this;
var info=new XMLCclRequest();
var tempData=null;
var paramString="";
var x;
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){try{MP_Util.LogScriptCallInfo(null,this,"mp_custom_component_core.js","loadCCL");
switch(dataType){case"XML":if(window.ActiveXObject){xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
xmlDoc.async="false";
xmlDoc.loadXML(this.responseText);
}else{if(document.implementation&&document.implementation.createDocument){parser=new DOMParser();
xmlDoc=parser.parseFromString(this.responseText,"text/xml");
}}callback.call(that,xmlDoc);
break;
case"TEXT":callback.call(that,this.responseText);
break;
case"JSON":default:callback.call(that,JSON.parse(this.responseText));
break;
}}catch(err){MP_Util.LogJSError(err,null,"mp_custom_component_core.js","loadCCL");
}}else{if(this.readyState==4&&this.status!=200){MP_Util.LogScriptCallError(null,this,"mp_custom_component_core.js","loadCCL");
}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
for(x=cclParams.length;
x--;
){if(typeof cclParams[x]=="string"){if(!/^'.*'$/.test(cclParams[x])&&!/^".*"$/.test(cclParams[x])&&!/^\^.*\^$/.test(cclParams[x])){cclParams[x]="^"+cclParams[x]+"^";
}}else{if(typeof cclParams[x]=="number"){if(!/\.0$/.test(cclParams[x])){cclParams[x]=cclParams[x]+".0";
}}}}info.open("GET",cclProgram,true);
info.send(cclParams.join(","));
};
MPage.Component.prototype.render=function(){var target;
if(typeof this.data==="string"){target=this.getTarget();
target.innerHTML=this.data;
}};
MPage.Component.prototype.getOption=function(name){if(this.options&&this.options[name]){return this.options[name];
}else{return null;
}};
MPage.Component.prototype.setOption=function(name,value){if(!this.options){this.options={};
}this.options[name]=value;
};
MPage.Component.prototype.getProperty=function(name){if(this.properties&&this.properties[name]){return this.properties[name];
}else{if(MPage.Properties[name]){return MPage.Properties[name];
}else{return"undefined";
}}};
MPage.Component.prototype.setProperty=function(name,value){if(this.properties){this.properties[name]=value;
}else{this.properties={};
this.properties[name]=value;
}if("headerTitle|headerSubTitle|headerShowHideState".indexOf(name)>=0){var parentComp=this.getOption("parentComp");
switch(name){case"headerTitle":parentComp.updateLabel(value);
break;
case"headerSubTitle":parentComp.updateSubLabel(value);
break;
case"headerShowHideState":parentComp.setExpandCollapseState(value);
break;
}}return this;
};
MPage.Component.prototype.getTarget=function(){var target=undefined;
if(this.options&&this.options.target){target=this.options.target;
}return target;
};
MPage.Component.prototype.setTarget=function(target){if(this.options){this.options.target=target;
}else{this.options={};
this.options.target=target;
}};
MPage.Component.prototype.resize=function(width,height){return null;
};
MPage.Component.prototype.unload=function(){return null;
};
MPage.Component.prototype.getComponentUid=function(){return this.getOption("id");
};
MPage.Component.prototype.throwNewError=function(description,err){var error=err||new Error(description);
MP_Util.LogError("Error occurred in a custom component: "+description);
MP_Util.LogJSError(error,null,"mp_custom_component_core.js","MPage.Component.prototype.throwNewError");
throw (error);
};

function hmo(evt,n,comp){evt=evt||window.event;
var s=n.style,p=getPosition(evt),top=p.y+30,left=p.x+20;
n._ps=n.previousSibling;
n.hmo=true;
function hover(){if(n.hmo==true){if(comp){if(comp.isEditMode()){clearTimeout(n.timer);
return;
}}document.body.appendChild(n);
s.display="block";
s.left=left+"px";
s.top=top+"px";
n.show=true;
}}n.timer=setTimeout(hover,500);
}function hmm(evt,n,comp){if(!n.show){return;
}if(comp){if(comp.isEditMode()){clearTimeout(n.timer);
return;
}}var s=n.style,p=getPosition(evt),vp=gvs(),so=gso(),left=p.x+20,top=p.y+20;
if(left+n.offsetWidth>vp[1]+so[1]){left=left-40-n.offsetWidth;
if(left<0){left=0;
}}if(top+n.offsetHeight>vp[0]+so[0]){if(top-40-n.offsetHeight<so[0]){if(left>0){top=10+so[0];
}}else{top=top-40-n.offsetHeight;
}}evt=evt||window.event;
s.top=top+"px";
s.left=left+"px";
}function hmt(evt,n,comp){if(comp){if(comp.isEditMode()){clearTimeout(n.timer);
return;
}}n.hmo=false;
if(!n._ps){n._ps=n.previousSibling;
}clearTimeout(n.timer);
evt=evt||window.event;
n.style.display="";
Util.ia(n,n._ps);
n.show=false;
}function hs(e,n,comp){var priorBgColor=e.style.backgroundColor;
var priorBorderColor=e.style.borderColor;
var editMode;
if(n&&n.tagName=="DIV"){e.onmouseenter=function(evt){if(comp){if(comp.isEditMode()){return;
}}e.onmouseover=null;
e.onmouseout=null;
hmo(evt,n,comp);
};
e.onmouseover=function(evt){if(comp){if(comp.isEditMode()||Util.Style.ccss(this,"row-selected")){return;
}}e.style.backgroundColor="#FFFFCC";
e.style.borderColor="#CCCCCC";
hmo(evt,n,comp);
};
e.onmousemove=function(evt){if(comp){if(comp.isEditMode()||Util.Style.ccss(this,"row-selected")){return;
}}e.style.backgroundColor="#FFFFCC";
e.style.borderColor="#CCCCCC";
hmm(evt,n,comp);
};
e.onmouseout=function(evt){e.style.backgroundColor=priorBgColor;
e.style.borderColor=priorBorderColor;
hmt(evt,n,comp);
};
e.onmouseleave=function(evt){e.style.backgroundColor=priorBgColor;
e.style.borderColor=priorBorderColor;
e.onmouseover=null;
e.onmouseout=null;
hmt(evt,n,comp);
};
Util.Style.acss(n,"hover");
}}function _g(i){return document.getElementById(i);
}function _gbt(t,e){e=e||document;
return e.getElementsByTagName(t);
}var Util=function(){var _e=[],_d=document,_w=window;
return{EventCache:function(){var l=[];
return{add:function(o,e,f){l.push(arguments);
},remove:function(o,e,f){var n;
for(var i=l.length-1;
i>=0;
i=i-1){if(o==l[i][0]&&e==l[i][1]&&f==l[i][2]){n=l[i];
if(n[0].removeEventListener){n[0].removeEventListener(n[1],n[2],n[3]);
}else{if(n[0].detachEvent){if(n[1].substring(0,2)!="on"){n[1]="on"+n[1];
}n[0].detachEvent(n[1],n[0][e+f]);
}}}}},flush:function(){var e;
for(var i=l.length-1;
i>=0;
i=i-1){var o=l[i];
if(o[0].removeEventListener){o[0].removeEventListener(o[1],o[2],o[3]);
}e=o[1];
if(o[1].substring(0,2)!="on"){o[1]="on"+o[1];
}if(o[0].detachEvent){o[0].detachEvent(o[1],o[2]);
if(o[0][e+o[2]]){o[0].detachEvent(o[1],o[0][e+o[2]]);
}}}}};
}(),ce:function(t){var a=_e[t];
if(!a){a=_e[t]=_d.createElement(t);
}if(!a){return null;
}else{return a.cloneNode(false);
}},cep:function(t,p){var e=this.ce(t);
return this.mo(e,p);
},mo:function(o1,o2,d){o1=o1||{};
o2=o2||{};
var p;
for(p in o2){if(p){o1[p]=(o1[p]===undefined)?o2[p]:!d?o2[p]:o1[p];
}}return o1;
},de:function(e){if(e){this.gp(e).removeChild(e);
}},cancelBubble:function(e){e=_w.event||e;
if(!e){return;
}if(e.stopPropagation){e.stopPropagation();
}else{e.cancelBubble=true;
}},preventDefault:function(e){e=_w.event||e;
if(!e){return;
}if(e.preventDefault){e.preventDefault();
}else{e.returnValue=false;
}},goff:function(e){var l=0,t=0;
if(e.offsetParent){while(e.offsetParent){l+=e.offsetLeft;
t+=e.offsetTop;
e=e.offsetParent;
}}else{if(e.x||e.y){l+=e.x||0;
t+=e.y||0;
}}return[l,t];
},gp:function(e){if(!e.parentNode){return e;
}e=e.parentNode;
while(e.nodeType===3&&e.parentNode){e=e.parentNode;
}return e;
},gc:function(e,i){i=i||0;
var j=-1;
if(!e.childNodes[i]){return null;
}e=e.childNodes[0];
while(e&&j<i){if(e.nodeType===1){j++;
if(j===i){break;
}}e=this.gns(e);
}return e;
},gcs:function(e){var r=[],es=e.childNodes;
for(var i=0;
i<es.length;
i++){var x=es[i];
if(x.nodeType===1){r.push(x);
}}return r;
},gns:function(e){if(!e){return null;
}var a=e.nextSibling;
while(a&&a.nodeType!==1){a=a.nextSibling;
}return a;
},gps:function(e){var a=e.previousSibling;
while(a&&a.nodeType!==1){a=a.previousSibling;
}return a;
},ac:function(e,p){p.appendChild(e);
return e;
},ia:function(nn,rn){var p=Util.gp(rn),n=Util.gns(rn);
if(n){p.insertBefore(nn,n);
}else{Util.ac(nn,p);
}},addEvent:function(o,e,f){function ae(obj,evt,fnc){if(!obj.myEvents){obj.myEvents={};
}if(!obj.myEvents[evt]){obj.myEvents[evt]=[];
}var evts=obj.myEvents[evt];
evts[evts.length]=fnc;
}function fe(obj,evt){if(!obj||!obj.myEvents||!obj.myEvents[evt]){return;
}var evts=obj.myEvents[evt];
for(var i=0,len=evts.length;
i<len;
i++){evts[i]();
}}if(o.addEventListener){o.addEventListener(e,f,false);
Util.EventCache.add(o,e,f);
}else{if(o.attachEvent){o["e"+e+f]=f;
o[e+f]=function(){o["e"+e+f](window.event);
};
o.attachEvent("on"+e,o[e+f]);
Util.EventCache.add(o,e,f);
}else{ae(o,e,f);
o["on"+e]=function(){fe(o,e);
};
}}},removeEvent:function(o,e,f){Util.EventCache.remove(o,e,f);
},popup:function(u,n,o){if(!window.open){return false;
}var d={w:screen.width,h:screen.height,rz:true,mb:true,scb:true,stb:true,tb:true,lb:true,tp:null,lft:null,sx:null,sy:null,dp:"no",dr:"no",fs:"no"};
function f(n,v){if(!v){return"";
}return n+"="+v+",";
}function fs(){o=o||{};
var p,n={};
for(p in d){if(p){n[p]=o[p]!==undefined?o[p]:d[p];
}}return n;
}o=fs();
var p=f("dependent",o.dp)+f("directories",o.dr)+f("fullscreen",o.fs)+f("location",o.lb?1:0)+f("menubar",o.mb)+f("resizable",o.rz?1:0)+f("scrollbars",o.scb?1:0)+f("status",o.stb?1:0)+f("toolbar",o.tb?1:0)+f("top",o.tp)+f("left",o.lft)+f("width",o.w)+f("height",o.h)+f("screenX",o.sx)+f("screenY",o.sy);
p=p.substring(0,p.length-1);
var nw=window.open(u,n,p);
window.blur();
if(nw.focus){nw.focus();
}return true;
},Convert:{},Cookie:{},Detect:{},i18n:{},Load:{},Pos:{},Style:{},Timeout:{}};
}();
function insertAfter(nn,rn){Util.ia(nn,rn);
}Util.addEvent(window,"unload",Util.EventCache.flush);
Util.Style=function(){return{ccss:function(e,c){if(typeof(e.className)==="undefined"||!e.className){return false;
}var a=e.className.split(" ");
for(var i=0,b=a.length;
i<b;
i++){if(a[i]===c){return true;
}}return false;
},acss:function(e,c){if(this.ccss(e,c)){return e;
}e.className=(e.className?e.className+" ":"")+c;
return e;
},rcss:function(e,c){if(!this.ccss(e,c)){return e;
}var a=e.className.split(" "),d="";
for(var i=0,b=a.length;
i<b;
i++){var f=a[i];
if(f!==c){d+=d.length>0?(" "+f):f;
}}e.className=d;
return e;
},tcss:function(e,c){if(this.ccss(e,c)){this.rcss(e,c);
return false;
}else{this.acss(e,c);
return true;
}},co:function(e){e.style.MozOpacity="";
e.style.opacity="";
e.style.filter="";
},g:function(c,e,t){e=e||document;
t=t||"*";
var ns=[],es=_gbt(t,e),l=es.length;
for(var i=0,j=0;
i<l;
i++){if(this.ccss(es[i],c)){ns[j]=es[i];
j++;
}}return ns;
}};
}();
function getPosition(e){e=e||window.event;
var cursor={x:0,y:0};
if(e.pageX||e.pageY){cursor.x=e.pageX;
cursor.y=e.pageY;
}else{var de=document.documentElement;
var b=document.body;
cursor.x=e.clientX+(de.scrollLeft||b.scrollLeft)-(de.clientLeft||0);
cursor.y=e.clientY+(de.scrollTop||b.scrollTop)-(de.clientTop||0);
}return cursor;
}function gvs(){var n=window,d=document,b=d.body,e=d.documentElement;
if(typeof n.innerWidth!=="undefined"){return[n.innerHeight,n.innerWidth];
}else{if(typeof e!=="undefined"&&typeof e.clientWidth!=="undefined"&&e.clientWidth!==0){return[e.clientHeight,e.clientWidth];
}else{return[b.clientHeight,b.clientWidth];
}}}function gso(){var d=document,b=d.body,w=window,e=d.documentElement,et=e.scrollTop,bt=b.scrollTop,el=e.scrollLeft,bl=b.scrollLeft;
if(typeof w.pageYOffset==="number"){return[w.pageYOffset,w.pageXOffset];
}if(typeof et==="number"){if(bt>et||bl>el){return[bt,bl];
}return[et,el];
}return[bt,bl];
}
if(!this.JSON){this.JSON={};
}(function(){function f(n){return n<10?"0"+n:n;
}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null;
};
String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();
};
}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;
function quote(string){escapable.lastIndex=0;
return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+'"':'"'+string+'"';
}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];
if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key);
}if(typeof rep==="function"){value=rep.call(holder,key,value);
}switch(typeof value){case"string":return quote(value);
case"number":return isFinite(value)?String(value):"null";
case"boolean":case"null":return String(value);
case"object":if(!value){return"null";
}gap+=indent;
partial=[];
if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;
for(i=0;
i<length;
i+=1){partial[i]=str(i,value)||"null";
}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";
gap=mind;
return v;
}if(rep&&typeof rep==="object"){length=rep.length;
for(i=0;
i<length;
i+=1){k=rep[i];
if(typeof k==="string"){v=str(k,value);
if(v){partial.push(quote(k)+(gap?": ":":")+v);
}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);
if(v){partial.push(quote(k)+(gap?": ":":")+v);
}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";
gap=mind;
return v;
}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;
gap="";
indent="";
if(typeof space==="number"){for(i=0;
i<space;
i+=1){indent+=" ";
}}else{if(typeof space==="string"){indent=space;
}}rep=replacer;
if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify");
}return str("",{"":value});
};
}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;
function walk(holder,key){var k,v,value=holder[key];
if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);
if(v!==undefined){value[k]=v;
}else{delete value[k];
}}}}return reviver.call(holder,key,value);
}text=String(text);
cx.lastIndex=0;
if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");
return typeof reviver==="function"?walk({"":j},""):j;
}throw new SyntaxError("JSON.parse");
};
}}());

function AutoSuggestControl(oComponent,oQueryHandler,oSelectionHandler,oSuggestionDisplayHandler){this.cur=0;
this.layer=null;
this.component=oComponent;
this.queryHandler=oQueryHandler;
this.selectionHandler=oSelectionHandler;
this.suggestionDisplayHandler=oSuggestionDisplayHandler;
this.textbox=_g(oComponent.getStyles().getNameSpace()+"ContentCtrl"+oComponent.getComponentId());
this.objArray="";
this.init();
}AutoSuggestControl.prototype.autosuggest=function(aSuggestions){this.layer.style.width=this.textbox.offsetWidth;
this.objArray=aSuggestions;
if(aSuggestions&&aSuggestions.length>0){this.showSuggestions(aSuggestions);
}else{this.hideSuggestions();
}};
AutoSuggestControl.prototype.createDropDown=function(){var oThis=this;
this.layer=document.createElement("div");
this.layer.className="suggestions";
this.layer.style.visibility="hidden";
this.layer.style.width=this.textbox.offsetWidth;
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
if(oEvent.type=="mousedown"){var index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.selectionHandler(oThis.objArray[index],oThis.textbox,oThis.component);
oThis.hideSuggestions();
}else{if(oEvent.type=="mouseover"){var index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.cur=index;
oThis.highlightSuggestion(oTarget);
}else{oThis.textbox.focus();
}}};
document.body.appendChild(this.layer);
};
AutoSuggestControl.prototype.getLeft=function(){var oNode=this.textbox;
var iLeft=0;
while(oNode&&oNode.tagName!="BODY"){iLeft+=oNode.offsetLeft;
oNode=oNode.offsetParent;
}return iLeft;
};
AutoSuggestControl.prototype.getTop=function(){var oNode=this.textbox;
var iTop=0;
while(oNode&&oNode.tagName!="BODY"){iTop+=oNode.offsetTop;
oNode=oNode.offsetParent;
}return iTop;
};
AutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.visibility!="hidden"){switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:this.selectionHandler(this.objArray[this.cur],this.textbox,this.component);
this.hideSuggestions();
break;
}}};
AutoSuggestControl.prototype.handleKeyUp=function(oEvent){var iKeyCode=oEvent.keyCode;
if(iKeyCode==8||iKeyCode==46){if(this.textbox.value.length>0){this.queryHandler(this,this.textbox,this.component);
}else{this.hideSuggestions();
}}else{if(iKeyCode<32||(iKeyCode>=33&&iKeyCode<46)||(iKeyCode>=112&&iKeyCode<=123)){}else{this.queryHandler(this,this.textbox,this.component);
}}};
AutoSuggestControl.prototype.hideSuggestions=function(){this.layer.style.visibility="hidden";
};
AutoSuggestControl.prototype.highlightSuggestion=function(oSuggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var oNode=this.layer.childNodes[i];
if(oNode==oSuggestionNode||oNode==oSuggestionNode.parentNode){oNode.className="current";
}else{if(oNode.className=="current"){oNode.className="";
}}}};
AutoSuggestControl.prototype.init=function(){var oThis=this;
this.textbox.onkeyup=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyUp(oEvent);
};
this.textbox.onkeydown=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyDown(oEvent);
};
this.textbox.onblur=function(){oThis.hideSuggestions();
};
this.createDropDown();
};
AutoSuggestControl.prototype.nextSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur<cSuggestionNodes.length-1){var oNode=cSuggestionNodes[++this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.previousSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur>0){var oNode=cSuggestionNodes[--this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.showSuggestions=function(aSuggestions){var oDiv=null;
this.layer.innerHTML="";
for(var i=0;
i<aSuggestions.length;
i++){oDiv=document.createElement("div");
if(i==0){oDiv.className="current";
}this.cur=0;
var domText=this.suggestionDisplayHandler(aSuggestions[i],this.textbox.value);
oDiv.innerHTML=domText;
oDiv.appendChild(document.createTextNode(""));
this.layer.appendChild(oDiv);
}this.layer.style.left=this.getLeft()+"px";
this.layer.style.top=(this.getTop()+this.textbox.offsetHeight)+"px";
this.layer.style.visibility="visible";
this.layer.style.position="absolute";
};
AutoSuggestControl.prototype.indexOf=function(parent,el){var nodeList=parent.childNodes;
for(var i=0;
i<nodeList.length;
i++){var oNode=nodeList[i];
if(oNode==el||oNode==el.parentNode){return i;
}}return -1;
};
AutoSuggestControl.prototype.highlight=function(value,term){return"<strong>"+value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong>")+"</strong>";
};
function BedrockMPage(categoryMean){this.mean=categoryMean;
BedrockMPage.method("getCategoryMean",function(){return this.mean;
});
}BedrockMPage.inherits(MPageView);
function BedrockMPageGroupValue(){m_sequence=0;
m_description="";
m_meaning="";
MPageGroupValue.method("getSequence",function(){return this.m_sequence;
});
MPageGroupValue.method("setSequence",function(value){this.m_sequence=value;
});
MPageGroupValue.method("getDescription",function(){return this.m_description;
});
MPageGroupValue.method("setDescription",function(value){this.m_description=value;
});
MPageGroupValue.method("getMeaning",function(){return this.m_meaning;
});
MPageGroupValue.method("setMeaning",function(value){this.m_meaning=value;
});
}BedrockMPageGroupValue.inherits(MPageGroupValue);
var MP_Bedrock=function(){return{LoadingPolicy:function(){var m_loadPageDetails=false;
var m_loadComponentBasic=false;
var m_loadComponentDetail=false;
var m_loadCustomizeView=false;
var m_categoryMean="";
var m_criterion=null;
this.setLoadPageDetails=function(value){m_loadPageDetails=value;
};
this.getLoadPageDetails=function(){return m_loadPageDetails;
};
this.setLoadComponentBasics=function(value){m_loadComponentBasic=value;
};
this.getLoadComponentBasics=function(){return m_loadComponentBasic;
};
this.setLoadComponentDetails=function(value){m_loadComponentDetail=value;
};
this.getLoadComponentDetails=function(){return m_loadComponentDetail;
};
this.setCategoryMean=function(value){m_categoryMean=value;
};
this.getCategoryMean=function(){return m_categoryMean;
};
this.setCriterion=function(value){m_criterion=value;
};
this.getCriterion=function(){return m_criterion;
};
this.setCustomizeView=function(value){m_loadCustomizeView=value;
};
this.getCustomizeView=function(){return m_loadCustomizeView;
};
},GetPageFromRec:function(recordData,loadingPolicy){var categoryMean=loadingPolicy.getCategoryMean();
for(var x=recordData.MPAGE.length;
x--;
){if(categoryMean.toUpperCase()===recordData.MPAGE[x].CATEGORY_MEAN.toUpperCase()){return(recordData.MPAGE[x]);
}}}};
}();
MP_Bedrock.MPage=function(){return{LoadBedrockMPage:function(loadingPolicy){var categoryMean=loadingPolicy.getCategoryMean();
var returnPage=new BedrockMPage(categoryMean);
var criterion=loadingPolicy.getCriterion();
criterion.category_mean=categoryMean;
returnPage.setCriterion(criterion);
returnPage.setCustomizeView(loadingPolicy.getCustomizeView());
if(m_bedrockMpage.MPAGE.length>0){MP_Util.LogDebug("Bedrock JSON: "+JSON.stringify(m_bedrockMpage));
var page=MP_Bedrock.GetPageFromRec(m_bedrockMpage,loadingPolicy);
if(!page){var cclParams=["^MINE^",criterion.provider_id+".0",criterion.position_cd+".0","^"+categoryMean+"^"];
var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){try{m_bedrockMpage=JSON.parse(info.responseText).BR_MPAGE;
MP_Util.LogScriptCallInfo(null,this,"bedrock.js","LoadBedrockMPage");
}catch(error){MP_Util.LogJSError(err,null,"bedrock.js","LoadBedrockMPage");
}page=m_bedrockMpage.MPAGE[0];
}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_VIEW_DATA_LOAD",false);
info.send(cclParams.join(","));
}var prefManager=MP_Core.AppUserPreferenceManager;
prefManager.Initialize(criterion,categoryMean);
if(page.USER_PREFS.PREF_STRING.length>0){prefManager.SetPreferences(page.USER_PREFS.PREF_STRING);
}returnPage.setPageId(page.BR_DATAMART_CATEGORY_ID);
var jsMPage=page.PARAMS;
var y=0;
for(y=0,yl=jsMPage.length;
y<yl;
y++){var curMPage=jsMPage[y];
var valMPage=curMPage.VALUES;
var pageSetPrefFunc=GetPageFilterFuncs(categoryMean);
pageSetPrefFunc(returnPage,curMPage.FILTER_MEAN,curMPage);
if(curMPage.FILTER_MEAN==="VIEWPOINT_LABEL"){for(var z=valMPage.length;
z--;
){var curVal=valMPage[z];
if(curVal.FREETEXT_DESC){returnPage.setName(curVal.FREETEXT_DESC);
}}}}var components=page.COMPONENT;
for(y=0,yl=components.length;
y<yl;
y++){var jsonComponent=components[y];
returnPage.addComponentId(jsonComponent.BR_DATAMART_REPORT_ID);
}}var loadComponentIndicator=(loadingPolicy.getLoadComponentBasics())?1:0;
if(loadComponentIndicator>0){var components=MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy,returnPage.getComponentIds());
returnPage.setComponents(components);
}return returnPage;
}};
function BRPagePrefSetFuncCreation(filterMappings){var ExecuteBRPrefFunction=function(mPage,filterMean,brFilterValues){var bValue;
var execResult;
var filter;
var filterField;
var filterType;
var i;
var location;
var ret;
var setFuncName;
var sValue;
if(!filterMean||!brFilterValues){return;
}for(i=filterMappings.length;
i--;
){filter=filterMappings[i];
if(filter.m_filterMean.toUpperCase()===filterMean.toUpperCase()){setFuncName=filter.m_functionName;
filterType=filter.m_dataType;
filterField=filter.m_field;
break;
}}if(!setFuncName){return;
}else{switch(filterType.toUpperCase()){case"BOOLEAN":location="brFilterValues.VALUES[0]."+filterField;
sValue=eval(location);
bValue=(sValue==="0")?false:true;
strFunc="mPage."+setFuncName+"("+bValue+")";
ret=eval(strFunc);
break;
case"STRING":location="brFilterValues.VALUES[0]."+filterField;
sValue=eval(location);
strFunc="mPage."+setFuncName+"('"+sValue+"')";
ret=eval(strFunc);
break;
}}};
return ExecuteBRPrefFunction;
}function PageFilterMapping(filterMean,functionName,dataType,field){this.m_filterMean=filterMean;
this.m_functionName=functionName;
this.m_dataType=dataType;
this.m_field=field;
}function GetPageFilterFuncs(categoryMean){var pageFilterMaps=[];
if(categoryMean){switch(categoryMean.toUpperCase()){case"MP_AMB_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_DABU_STD":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_DC_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ED_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ICU_DASHBOARD":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ICU_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_INPT_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_NC_ASSESS_V4":pageFilterMaps.push(new PageFilterMapping("NC_PT_BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_NC_REC_V4":pageFilterMaps.push(new PageFilterMapping("NC_PT_BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_NC_SIT_BACK_V4":pageFilterMaps.push(new PageFilterMapping("NC_PT_BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ORTHO_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_PREG_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("PREG_PRINT","setPrintableReportName","String","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_REHAB_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_RT_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_INTRAOP_COMM_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_POSTOP_COMM_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_PREOP_COMM_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_SIBR_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH","setChartSearchEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_COMMON_ORDERS_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_FUTURE_ORD":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
default:pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
}return BRPagePrefSetFuncCreation(pageFilterMaps);
}}}();
MP_Bedrock.MPage.Component=function(){return{LoadBedrockComponents:function(loadingPolicy,compIdAr){if(compIdAr&&compIdAr!==null&&compIdAr.length>0){var ComponentType=null;
var returnAr=[];
var reportData=MP_Bedrock.GetPageFromRec(m_bedrockMpage,loadingPolicy);
var prefManager=MP_Core.AppUserPreferenceManager;
var criterion=loadingPolicy.getCriterion();
var isCustomizeView=loadingPolicy.getCustomizeView();
for(var x=reportData.COMPONENT.length;
x--;
){var jsonComponent=reportData.COMPONENT[x];
if(!isCustomizeView){ComponentType=getComponentByFilterMean(jsonComponent.FILTER_MEAN);
}if((ComponentType)||isCustomizeView){var jsComponentFunc=null;
var component=null;
if(isCustomizeView){component=new MPageComponent();
component.setCriterion(criterion);
component.setStyles(new ComponentStyle());
}else{component=new ComponentType(criterion);
}component.setCustomizeView(loadingPolicy.getCustomizeView());
component.setComponentId(jsonComponent.BR_DATAMART_FILTER_ID);
component.setReportId(jsonComponent.BR_DATAMART_REPORT_ID);
var userPrefComp=prefManager.GetComponentById(component.getComponentId());
if(userPrefComp&&userPrefComp!==null){component.setExpanded(userPrefComp.expanded);
component.setColumn(userPrefComp.col_seq);
component.setSequence(userPrefComp.row_seq);
component.setPageGroupSequence(userPrefComp.group_seq);
if(userPrefComp.lookbackunits){component.setLookbackUnits(userPrefComp.lookbackunits);
}else{component.setLookbackUnits(jsonComponent.LOOKBACKUNITS);
}if(userPrefComp.lookbacktypeflag){component.setLookbackUnitTypeFlag(userPrefComp.lookbacktypeflag);
}else{component.setLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
}if(userPrefComp.grouperFilterLabel){component.setGrouperFilterLabel(userPrefComp.grouperFilterLabel);
}else{component.setGrouperFilterLabel("");
}if(userPrefComp.grouperFilterEventSets){component.setGrouperFilterEventSets(userPrefComp.grouperFilterEventSets);
}else{component.setGrouperFilterEventSets(null);
}if(userPrefComp.selectedTimeFrame){component.setSelectedTimeFrame(userPrefComp.selectedTimeFrame);
}else{component.setSelectedTimeFrame(null);
}if(userPrefComp.selectedDataGroup){component.setSelectedDataGroup(userPrefComp.selectedDataGroup);
}else{component.setSelectedDataGroup(null);
}}else{component.setExpanded(jsonComponent.EXPANDED);
component.setColumn(jsonComponent.COL_SEQ);
component.setSequence(jsonComponent.ROW_SEQ);
component.setPageGroupSequence(jsonComponent.GROUP_SEQ);
var style=component.getStyles();
if(style){var color=jsonComponent.THEME;
if(color&&color.length>0){style.setColor(color);
}}}component.setLabel(jsonComponent.LABEL);
component.setLink(jsonComponent.LINK);
component.setResultsDisplayEnabled(jsonComponent.TOTAL_RESULTS);
component.setXofYEnabled(jsonComponent.X_OF_Y);
component.setScrollNumber(jsonComponent.SCROLL_NUM);
component.setScrollingEnabled(jsonComponent.SCROLL_ENABLED);
if(component.getLookbackDays()===0){component.setLookbackDays(jsonComponent.LOOKBACK_DAYS);
}component.setPlusAddEnabled((jsonComponent.ISPLUSADD==1?true:false));
if(component.getLookbackUnits()===0){component.setLookbackUnits(jsonComponent.LOOKBACKUNITS);
}if(component.getLookbackUnitTypeFlag()===0){component.setLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
}if(component.getBrLookbackUnits()===0){component.setBrLookbackUnits(jsonComponent.LOOKBACKUNITS);
}if(component.getBrLookbackUnitTypeFlag()===0){component.setBrLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
}component.setDateFormat(jsonComponent.DATE_DISPLAY_FLAG);
if(component.getScope()===0){component.setScope(jsonComponent.SCOPE);
}var compSetPrefFunc=GetComponentFilterFuncs(component.getStyles().getNameSpace(),jsonComponent.REPORT_MEAN);
for(var y=0,yl=jsonComponent.FILTER.length;
y<yl;
y++){var filter=jsonComponent.FILTER[y];
switch(filter.FILTER_CATEGORY_MEAN){case"EVENT":var aValue=GetFilterValues(filter);
if(compSetPrefFunc){if(compSetPrefFunc(component,filter.FILTER_MEAN,aValue)){break;
}}var eGroup=new MPageEventCodeGroup();
for(var z=0,zl=aValue.length;
z<zl;
z++){eGroup.addEventCode(aValue[z].getId());
}eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
eGroup.setGroupName(filter.FILTER_MEAN);
eGroup.setSequence(filter.FILTER_SEQ);
component.addGroup(eGroup);
break;
case"EVENT_SET":case"PRIM_EVENT_SET":var aValue=GetFilterValues(filter);
if(compSetPrefFunc){if(compSetPrefFunc(component,filter.FILTER_MEAN,aValue)){break;
}}var eGroup=new MPageEventSetGroup();
for(var z=0,zl=aValue.length;
z<zl;
z++){eGroup.addEventSet(aValue[z].getId());
}eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
eGroup.setGroupName(filter.FILTER_MEAN);
eGroup.setSequence(filter.FILTER_SEQ);
component.addGroup(eGroup);
break;
case"LOOK_BACK":var aValue=GetFilterValues(filter);
if(compSetPrefFunc){if(compSetPrefFunc(component,filter.FILTER_MEAN,aValue)){break;
}}for(var z=0,zl=aValue.length;
z<zl;
z++){var value=aValue[z];
var item=new MP_Core.MenuItem();
item.setName(value.getName());
item.setDescription(value.getDescription());
item.setMeaning(value.getMeaning());
var tempMeaning=item.getMeaning();
switch(tempMeaning){case"HOURS":item.setId(1);
break;
case"DAYS":item.setId(2);
break;
case"WEEKS":item.setId(3);
break;
case"MONTHS":item.setId(4);
break;
case"YEARS":item.setId(5);
break;
}component.addLookbackMenuItem(item);
}var defaultItem=new MP_Core.MenuItem();
defaultItem.setName("CODE_VALUE");
defaultItem.setDescription(component.getBrLookbackUnits());
defaultItem.setId(component.getBrLookbackUnitTypeFlag());
component.addLookbackMenuItem(defaultItem);
break;
case"PF_MULTI_SELECT":var aValue=GetFilterValues(filter);
for(var z=0,zl=aValue.length;
z<zl;
z++){var value=aValue[z];
var item=new MP_Core.MenuItem();
item.setName(value.getName());
item.setDescription(value.getDescription());
item.setId(value.getId());
component.addMenuItem(item);
}break;
case"CAT_TYPE_ASSIGN":var aValue=GetFilterValues(filter);
if(compSetPrefFunc){if(compSetPrefFunc(component,filter.FILTER_MEAN,aValue)){break;
}}var eGrouper=new MPageGrouper();
var eGroup=null;
var curSeq=-1;
for(var z=0,zl=aValue.length;
z<zl;
z++){var val=aValue[z];
if(val.getSequence()!=curSeq){curSeq=val.getSequence();
eGroup=new MPageCodeValueGroup();
eGroup.setSequence(curSeq);
eGrouper.addGroup(eGroup);
}eGroup.addCode(val.getId());
}component.addGroup(eGrouper);
break;
case"CE_GROUP":var groups=component.getGroups();
if(groups!=null){for(var z=0,zl=groups.length;
z<zl;
z++){var group=groups[z];
if(group.getSequence()==filter.FILTER_SEQ){var aValue=GetFilterValues(filter);
if(compSetPrefFunc){if(compSetPrefFunc(component,filter.FILTER_MEAN,aValue)){break;
}}var eGrouper=new MPageGrouper();
eGrouper.setGroupId(group.getGroupId());
eGrouper.setGroupName(group.getGroupName());
var eGroup=null;
var curSeq=-1;
for(var i=0,il=aValue.length;
i<il;
i++){var val=aValue[i];
if(val.getSequence()!=curSeq){curSeq=val.getSequence();
eGroup=new MPageEventCodeGroup();
eGroup.setSequence(curSeq);
eGrouper.addGroup(eGroup);
}var id=val.getId();
var desc=val.getDescription();
var name=val.getName();
if(id>0){eGroup.addEventCode(id);
}if(desc!=""){eGroup.setGroupName(desc);
}}groups[z]=eGrouper;
}}}break;
default:var aValue=GetFilterValues(filter);
if(compSetPrefFunc){if(compSetPrefFunc(component,filter.FILTER_MEAN,aValue)){break;
}}}}for(var y=0,yl=jsonComponent.FILTER.length;
y<yl;
y++){var filter=jsonComponent.FILTER[y];
switch(filter.FILTER_CATEGORY_MEAN){case"EVENT_SEQ":var groups=component.getGroups();
if(groups){for(var z=0,zl=groups.length;
z<zl;
z++){var group=groups[z];
if(group.getSequence()==filter.FILTER_SEQ){group.setEventCodes(null);
group.setSequenced(true);
var aValue=GetFilterValues(filter);
for(var a=0,bl=aValue.length;
a<bl;
a++){group.addEventCode(aValue[a].getId());
}}}}break;
case"EVENT_SET_SEQ":var groups=component.getGroups();
if(groups){for(var z=0,zl=groups.length;
z<zl;
z++){var group=groups[z];
if(group.getSequence()==filter.FILTER_SEQ){group.setEventSets(null);
group.setSequenced(true);
var aValue=GetFilterValues(filter);
var tempAr=[];
var tempMap=[];
var filterType="CODE_VALUE";
var isMultiValue=false;
for(var zz=0,zzl=aValue.length;
zz<zzl;
zz++){var val=aValue[zz];
tempAr.push(val.getId());
if(filterType!=val.getName()){isMultiValue=true;
}MP_Util.AddItemToMapArray(tempMap,val.getName(),val.getId());
}if(isMultiValue){var eGroup=new MPageSequenceGroup();
eGroup.setMultiValue(isMultiValue);
eGroup.setItems(tempAr);
eGroup.setMapItems(tempMap);
eGroup.setSequence(true);
eGroup.setGroupId(group.getGroupId());
eGroup.setGroupName(group.getGroupName());
groups[z]=eGroup;
}else{group.setEventSets(tempAr);
}}}}break;
default:var aValue=GetFilterValues(filter);
if(jsComponentFunc!=null){var filterFunc=GetFunctionByFilterMean(jsComponentFunc,filter.FILTER_MEAN);
if(filterFunc){var strFunc=GetValueFromComponentFunc(filterFunc,aValue);
var ret=eval(strFunc);
}}}}returnAr.push(component);
}}return returnAr;
}}};
function GetFilterValues(jsonFilter){var aReturn=[];
for(var x=0,xl=jsonFilter.VALUES.length;
x<xl;
x++){var jsonValue=jsonFilter.VALUES[x];
var value=new BedrockMPageGroupValue();
value.setId(jsonValue.PARENT_ENTITY_ID);
value.setName(jsonValue.PARENT_ENTITY_NAME);
value.setMeaning(jsonValue.CDF_MEANING);
value.setDescription(jsonValue.FREETEXT_DESC);
value.setSequence(jsonValue.GROUP_SEQ);
aReturn.push(value);
}return aReturn;
}function getComponentByFilterMean(filterMean){var fMEAN=filterMean.toUpperCase();
switch(fMEAN){case"ALLERGY":return AllergyComponent;
case"ANCIL_DOC":return DocumentComponent;
case"APNEA":return ABDComponent;
case"APPOINTMENTS":return AppointmentsComponent;
case"CLIN_DOC":return DocumentComponent;
case"CONSOL_PROBLEMS":return CvComponent;
case"CURR_STATUS":return CurStatusComponentO1;
case"CUSTOM_COMP_1":case"CUSTOM_COMP_2":case"CUSTOM_COMP_3":case"CUSTOM_COMP_4":case"CUSTOM_COMP_5":case"CUSTOM_COMP_6":case"CUSTOM_COMP_7":case"CUSTOM_COMP_8":case"CUSTOM_COMP_9":case"CUSTOM_COMP_10":case"CUSTOM_COMP_11":case"CUSTOM_COMP_12":case"CUSTOM_COMP_13":case"CUSTOM_COMP_14":case"CUSTOM_COMP_15":case"CUSTOM_COMP_16":case"CUSTOM_COMP_17":case"CUSTOM_COMP_18":case"CUSTOM_COMP_19":case"CUSTOM_COMP_20":return CustomComponent;
case"DC_ACTIVITIES":return ActivitiesComponent;
case"DC_CARE_MGMT":return DischargePlanningComponent;
case"DC_DIAGNOSIS":case"DIAGNOSIS":case"DX":return DiagnosesComponent;
case"DC_ORDER":return DischargeOrdersComponent;
case"DC_READINESS":return DischargeIndicatorComponent;
case"DC_RESULTS":return ResultsComponent;
case"DC_SOCIAL":return SocialComponent;
case"ED_TIMELINE":return TimelineComponent;
case"FAMILY_HX":return FamilyHistoryComponent;
case"FIM":return FunIndepMeasuresComponentO1;
case"FLAG_EVENTS":return FlaggedEventsComponent;
case"FLD_BAL":return IntakeOutputComponent;
case"FOLLOWUP":return FollowUpComponent;
case"GOALS":return GoalsComponentO1;
case"GRAPH":return RespTimelineComponent;
case"GRAPHS":return VSTimelineComponent;
case"GROWTH_CHART":return GrowthChartComponent;
case"HEALTH_MAINT":return HmiComponent;
case"HOME_MEDS":return HomeMedicationsComponent;
case"ICU_FLOWSHEET":return icuFlowsheetComponent;
case"IMMUNIZATIONS":return ImmunizationComponent;
case"INCOMPLETE_ORDERS":case"ORDERS":return OrdersComponent;
case"ORD_SEL_ADD_FAV_FOLDER":return OrderSelectionComponent;
case"INTER_TEAM":return InterTeamComponentO1;
case"LAB":return LaboratoryComponent;
case"LINES":return LinesTubesDrainsComponent;
case"MEDS":return MedicationsComponent;
case"MED_REC":return MedicationReconciliationComponent;
case"MICRO":return MicrobiologyComponent;
case"NC_DC_PLAN":return DischargePlanComponent;
case"NC_OVERDUE_TASKS":case"OVERDUE_TASKS":return TaskActivityComponent;
case"NC_PLAN":return PlanofCareComponent;
case"NC_PSYCHOSOC":return PsychosocialFactorsComponent;
case"NC_PT_ASSESS":return PatientAssessmentComponent;
case"NC_PT_BACKGROUND":return PatientBackgroundComponent;
case"NEW_DOC":return NewDocumentEntryComponent;
case"NEW_ORDERS":return NewOrderEntryComponent;
case"NOTES":return NotesRemindersComponent;
case"PAST_MED_HX":case"PAST_MHX":return PastMedicalHistoryComponent;
case"PATH":return PathologyComponent;
case"PAT_ED":case"PT_ED":return PatientFamilyEduSumComponent;
case"PRECAUTIONS":return PrecautionsComponentO1;
case"PREG_ASSESS":return PregAssessmentComponent;
case"PREG_ASSESS_2":return PregAssessment2Component;
case"PREG_BIRTH_PLAN":return BirthPlanComponent;
case"PREG_ED":return EducationAndCounselingComponent;
case"PREG_EDD_MAINT":return EDDMaintenanceComponent;
case"PREG_FETAL_MON":return FetalMonitoringComponent;
case"PREG_GENETIC_SCR":return GeneticScreeningComponent;
case"PREG_HX":return PregnancyHistoryComponent;
case"PREG_OVERVIEW":return PregnancyOverviewComponent;
case"PREG_RESULTS":return ResultTimelineComponent;
case"PROBLEM":return ProblemsComponent;
case"PROC_HX":return ProcedureComponent;
case"PT_INFO":return PatientInfoComponent;
case"QM":return QualityMeasuresComponent;
case"RAD":return DiagnosticsComponent;
case"RESP":return RespiratoryComponent;
case"RESP_ASSESS":return RespAssessmentsComponent;
case"RESP_TX":return RespTreatmentsComponent;
case"RESTRAINTS":return RestraintsComponent;
case"SIG_EVENTS":return SignificantEventO1Component;
case"SOCIAL_HX":return SocialHistoryComponent;
case"TREATMENTS":return TreatmentsComponentO1;
case"TRIAGE_DOCUMENT":return TriageDocComponent;
case"VENT_MON":return VentMonitoringComponent;
case"VISITS":return VisitsComponent;
case"VS":return VitalSignComponent;
case"WEIGHT":return WeightsComponent;
case"PROC_INFO":return ProceduralInfoComponent;
case"PERIOP_TRACK":return PeriopTrackComponent;
case"INTRAOP_SUMMARY":return IntraopSummaryComponent;
case"PREOP_CHECKLIST":return PreopChcklstComponent;
case"POSTOP_SUMMARY":return PostopSummaryComponent;
case"EP_DA":return DiscernAnalyticsComponent;
case"FUTURE_ORD":return FutureOrdersComponent;
default:alert("Unknown filter mean: ["+fMEAN+"]");
}}function BRCompPrefSetFuncCreation(filterMappings){var ExecuteBRPrefFunction=function(component,filterMean,brFilterValues){var execResult;
var functionArgs=[];
var filter;
var filterField;
var filterType;
var functionCall;
var i;
var setFuncName;
if(!filterMean||!brFilterValues){return false;
}for(i=filterMappings.length;
i--;
){filter=filterMappings[i];
if(filter.m_filterMean.toUpperCase()===filterMean.toUpperCase()){setFuncName=filter.m_functionName;
filterType=filter.m_dataType;
filterField=filter.m_field;
break;
}}if(!setFuncName){return false;
}else{for(var x=brFilterValues.length;
x--;
){var val=brFilterValues[x];
switch(filterField.toUpperCase()){case"FREETEXT_DESC":functionArgs.push(val.getDescription());
break;
case"PARENT_ENTITY_ID":functionArgs.push(val.getId());
break;
case"LOOK_BACK":functionArgs.push("{value:"+val.getDescription()+', units:"'+val.getMeaning()+'"}');
break;
default:break;
}}switch(filterType.toUpperCase()){case"ARRAY":functionCall="component."+setFuncName+"(["+functionArgs.join(",")+"])";
break;
case"STRING":functionCall="component."+setFuncName+"('"+functionArgs.join(",")+"')";
break;
case"NUMBER":functionCall="component."+setFuncName+"("+functionArgs.join(",")+")";
break;
case"BOOLEAN":var bVal=(functionArgs[0]=="1")?true:false;
functionCall="component."+setFuncName+"("+bVal+")";
break;
default:break;
}eval(functionCall);
return true;
}};
return ExecuteBRPrefFunction;
}function FilterMapping(filterMean,functionName,dataType,field){this.m_filterMean=filterMean;
this.m_functionName=functionName;
this.m_dataType=dataType;
this.m_field=field;
}function GetComponentFilterFuncs(nameSpace,reportMean){var compFilterMaps=[];
var custCompNum;
if(nameSpace){switch(nameSpace){case"abd":compFilterMaps.push(new FilterMapping("MP_ABD_PT_DAYS","setAgeDays","Number","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MP_ABD_APNEA","setApneaEventCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_APNEA_NOMEN","setApneaNomenIds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_BRADY","setBradyEventCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_BRADY_NOMEN","setBradyNomenIds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_DESAT","setDesatEventCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_DESAT_NOMEN","setDesatNomenIds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_O2_SAT","setO2SatCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_HR","setHRCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_SKIN_COLOR","setSkinColorCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_ACTIVITY","setActivityCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_POSITION","setPositionCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_STIMULATION","setStimulationCds","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MP_ABD_DURATION","setDurationCds","Array","PARENT_ENTITY_ID"));
break;
case"cm":compFilterMaps.push(new FilterMapping("DC_DC_PLAN_CE","setDischScreenPlan","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_DC_DISP_CE","setDischDisposition","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_TRANSP_ARR_CE","setDocTransArrangement","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_PROF_SKILL_ANT_CE","setProfSkillServices","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_DME_ANT_CE","setDurableMedEquipment","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_DME_COORD_CE","setDurableMedEquipmentCoordinated","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_PLAN_DC_DT_TM_CE","setPlannedDischDate","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_ADM_MIM_CE","setAdmissionMIMSigned","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DC_DSCH_MIM_CE","setDischMIMGiven","Array","PARENT_ENTITY_ID"));
break;
case"cv":compFilterMaps.push(new FilterMapping("DEFAULT_SEARCH_VOCAB","setDefaultSearchVocab","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VISIT_VOCAB","setVisitVocab","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ACTIVE_VOCAB","setActiveVocab","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ACTIVE_LABEL","setActiveLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("VISIT_LABEL","setVisitLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("HISTORICAL_LABEL","setHistoricalLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_TYPE_DX","setVisitAddType","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_CLASS","setActiveAddClass","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_TYPE_CONFIRM","setActiveAddType","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_CLASS_DX","setVisitAddClass","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MODAL_DIALOG_IND","setModifyInd","Boolean","FREETEXT_DESC"));
break;
case"curstat":compFilterMaps.push(new FilterMapping("CS_ASSESSMENTS","setAssessmentEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_VITAL_MEASURE","setVitalMeasureEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_BOWEL_BLADDER","setBowelBladderEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_SKIN_ASSESS_TOL","setSkinAssessTolEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_ORTHOTICS_SCHED","setOrthonticsShedEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_ADL","setADLEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_IADL","setIADLEventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CS_COG_COMMUNICATE","setCogCommunicateEventSets","Array","PARENT_ENTITY_ID"));
break;
case"cust":custCompNum=reportMean.match(/[0-9]+$/);
if(custCompNum){compFilterMaps.push(new FilterMapping("CUSTOM_COMP_PRG_"+custCompNum[0],"setComponentNamespace","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CUSTOM_COMP_OBJ_"+custCompNum[0],"setComponentOptionsObjectName","String","FREETEXT_DESC"));
}break;
case"da":compFilterMaps.push(new FilterMapping("EP_DA_TEXT","setCustTxt","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("EP_DA_PF","setFormId","String","PARENT_ENTITY_ID"));
break;
case"dishord":compFilterMaps.push(new FilterMapping("DC_ORDER_SELECT","setCatalogCodes","Array","PARENT_ENTITY_ID"));
break;
case"doc":compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP1_LABEL","setGrp1Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP1_ES","setGrp1EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP2_LABEL","setGrp2Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP2_ES","setGrp2EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP3_LABEL","setGrp3Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP3_ES","setGrp3EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP4_LABEL","setGrp4Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP4_ES","setGrp4EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP5_LABEL","setGrp5Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP5_ES","setGrp5EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP6_LABEL","setGrp6Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP6_ES","setGrp6EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP7_LABEL","setGrp7Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP7_ES","setGrp7EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP8_LABEL","setGrp8Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP8_ES","setGrp8EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP9_LABEL","setGrp9Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP9_ES","setGrp9EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP10_LABEL","setGrp10Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP10_ES","setGrp10EventSets","Array","PARENT_ENTITY_ID"));
break;
case"dx":compFilterMaps.push(new FilterMapping("DIAGNOSIS_TYPE","setDiagnosisType","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_VOCAB","setDiagnosisVocab","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_TYPE","setDiagnosisAddTypeCd","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_CLASS_DX","setDiagnosisClassification","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_VOCAB_IND","setDiagnosisVocabInd","Number","FREETEXT_DESC"));
break;
case"edu":compFilterMaps.push(new FilterMapping("PREG_ED_PF","setEdCounselingPF","Array","PARENT_ENTITY_ID"));
break;
case"fim":compFilterMaps.push(new FilterMapping("TARGET_DC_DT","setAnticipatedDischargeDateDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ANTI_DISPOSITION","setAnticipatedDispositionDateDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PRIMARY_IMPAIR_CDS","setPrimaryImpairmentCodeDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_EAT","setEatingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_EAT_GOAL","setEatingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_GROOM","setGroomingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_GROOM_GOAL","setGroomingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BATH","setBathingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BATH_GOAL","setBathingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_UP_EXT_DRESS","setUpperExtremityDressingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_UP_EXT_DRESS_GOAL","setUpperExtremityDressingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOW_EXT_DRESS","setLowerExtremityDressingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOW_EXT_DRESS_GOAL","setLowerExtremityDressingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET","setToiletingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET_GOAL","setToiletingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_LEV_ASSIST","setBladderLevelofAssistanceDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_LEV_ASSIST_GOAL","setBladderLevelofAssistanceGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_ACC","setBladderAccidentsDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_ACC_4","setBladderAccidentsPast4DaysDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BOWEL_LEV_ASSIST","setBowelLevelofAssistanceDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BWL_LVL_ASSIST_GOAL","setBowelLevelofAssistanceGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BOWEL_ACC","setBowelAccidentsDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BOWEL_ACC_4","setBowelAccidentsPast4DaysDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BED_CHAIR_WHEEL","setBedChairWheelChairDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_BED_CHAIR_WHEEL_GOAL","setBedChairWheelChairGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET_TRANS","setToiletTransferDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET_TRANS_GOAL","setToiletTransferGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_TUB_TRANS","setTubTransferDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_SHOWER_TRANS","setShowerTransferDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_TUB_SHOWER_GOAL","setTubShowerTransfergoaldocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WALK","setLocomotionWalkDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WALK_GOAL","setLocomotionWalkGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WHEEL","setLocomotionWheelChairDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WHEEL_GOAL","setLocomotionWheelChairGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_STAIR","setLocomotionStairDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_STAIR_GOAL","setLocomotionStairGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_COMP","setComprehensionDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_COMP_GOAL","setComprehensionGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_EXPRESS","setExpressionDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_EXPRESS_GOAL","setExpressionGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_SOC_INTER","setSocialInteractionDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_SOC_INTER_GOAL","setSocialInteractionGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_PROB_SOLVE","setProblemSolvingDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_PROB_SOLVE_GOAL","setProblemSolvingGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_MEMORY","setMemoryDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("FIM_COG_MEMORY_GOAL","setMemoryGoalDocumented","Array","PARENT_ENTITY_ID"));
break;
case"fo":compFilterMaps.push(new FilterMapping("CAT_TYPE_1","setTab1","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_1_DISP","setTabDisplay1","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_2","setTab2","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_2_DISP","setTabDisplay2","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_3","setTab3","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_3_DISP","setTabDisplay3","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_4","setTab4","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_4_DISP","setTabDisplay4","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_5","setTab5","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_5_DISP","setTabDisplay5","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_6","setTab6","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_6_DISP","setTabDisplay6","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_7","setTab7","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_7_DISP","setTabDisplay7","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_8","setTab8","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_8_DISP","setTabDisplay8","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_9","setTab9","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_9_DISP","setTabDisplay9","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("CAT_TYPE_10_DISP","setAllTabDisplay","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("FUTURE_ORD_LOOK_BACK","setLookBack","Number","LOOK_BACK"));
compFilterMaps.push(new FilterMapping("FUTURE_ORD_LOOK_FORWARD","setLookAhead","Number","LOOK_BACK"));
break;
case"goals":compFilterMaps.push(new FilterMapping("NURSE_GOAL_DOC","setNursingGoals","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("OT_STG_DOC","setOTShortTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("OT_LTG_DOC","setOTLongTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PT_STG_DOC","setPTShortTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PT_LTG_DOC","setPTLongTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("SLP_STG_DOC","setSLPShortTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("SLP_LTG_DOC","setSLPLongTermGoalDocumented","Array","PARENT_ENTITY_ID"));
break;
case"hml":compFilterMaps.push(new FilterMapping("MEDS_MODS","setMedModInd","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DISCH_MED_REC_MOD","setMedRec","Boolean","FREETEXT_DESC"));
break;
case"icufs":compFilterMaps.push(new FilterMapping("VITALS_GRAPH_LABEL","setBPGraphTitle","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("VITALS_HEMO_LABEL","setVitalLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_LABEL","setLabLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("RESP_LABEL","setRespLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEURO_LABEL","setNeuroLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("ENDO_LABEL","setEndoLabel","String","FREETEXT_DESC"));
break;
case"intm":compFilterMaps.push(new FilterMapping("TEAM_CONF_ORDER","setTeamConfOrder","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAST_TEAM_DISC","setLastTeamDiscussionDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("BARRIERS_DC_DOC","setBarriersToDischargeDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PRIM_OT_NAME_DOC","setPrimaryOccupationalTherapists","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PRIM_PT_NAME_DOC","setPrimaryPhysicalTherapists","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PRIM_ST_NAME_DOC","setPrimarySpeechTherapists","Array","PARENT_ENTITY_ID"));
break;
case"io":compFilterMaps.push(new FilterMapping("OUTPUT_COUNT","setCounts","Array","PARENT_ENTITY_ID"));
break;
case"lab":compFilterMaps.push(new FilterMapping("LAB_PRIMARY_LABEL","setPrimaryLabel","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_RESULTS_IND","setShowTodayValue","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP1_LABEL","setGrp1Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP1_ES","setGrp1EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP2_LABEL","setGrp2Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP2_ES","setGrp2EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP3_LABEL","setGrp3Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP3_ES","setGrp3EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP4_LABEL","setGrp4Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP4_ES","setGrp4EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP5_LABEL","setGrp5Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP5_ES","setGrp5EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP6_LABEL","setGrp6Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP6_ES","setGrp6EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP7_LABEL","setGrp7Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP7_ES","setGrp7EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP8_LABEL","setGrp8Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP8_ES","setGrp8EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP9_LABEL","setGrp9Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP9_ES","setGrp9EventSets","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP10_LABEL","setGrp10Label","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP10_ES","setGrp10EventSets","Array","PARENT_ENTITY_ID"));
break;
case"ld":compFilterMaps.push(new FilterMapping("LINES_ES","setLineCodes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("TUBES_DRAINS_ES","setTubeCodes","Array","PARENT_ENTITY_ID"));
break;
case"med":compFilterMaps.push(new FilterMapping("MEDS_SCHED","setScheduled","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_PRN","setPRN","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_DISC","setDiscontinued","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_ADM","setAdministered","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_SUS","setSuspended","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_CONT","setContinuous","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_ADM_LB_HRS","setAdministeredLookBkHrs","Number","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MEDS_DISC_LB_HRS","setDiscontinuedLookBkHr","Number","FREETEXT_DESC"));
break;
case"nde":compFilterMaps.push(new FilterMapping("NEW_DOC_IND","setDisplayEnabled","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_DOC_TITLE","setDocTitle","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_1","setLabelOne","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_2","setLabelTwo","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_3","setLabelThree","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_4","setLabelFour","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_DOC_CE","setDocEventCode","Number","PARENT_ENTITY_ID"));
break;
case"noe":compFilterMaps.push(new FilterMapping("ORD_SRCH_IND","setOrderSearchInd","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("NEW_ORD_ENTRY","setVenueType","Boolean","FREETEXT_DESC"));
break;
case"nr":compFilterMaps.push(new FilterMapping("STICKY_NOTE_TYPES","setStickyNoteTypeCodes","Array","PARENT_ENTITY_ID"));
break;
case"ord":compFilterMaps.push(new FilterMapping("INCOMPLETE_ORDERS_CAT_TYPE","setCatalogCodes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("INCOMPLETE_ORDERS_STATUS","setOrderStatuses","Array","PARENT_ENTITY_ID"));
break;
case"ordsel":compFilterMaps.push(new FilterMapping("ROOT_FAVORITE","setFavFolderId","Number","PARENT_ENTITY_ID"));
break;
case"pbg":compFilterMaps.push(new FilterMapping("NC_PAIN_SCR","setPainScores","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_ASSIST_DEV","setDevices","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_DIET_ORD","setDietOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_PT_ACT_ORD","setPatientActivityOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_RESUS_ORD","setResucitationOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_SEIZURE_ORD","setSeizureOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_ISOLATION_ORD","setIsolationOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_ADV_DIR","setAdvancedDirectives","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_PARA","setParas","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_GRAVIDA","setGravidas","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_FALL_PRECAUTIONS","setFallPrecautions","Array","PARENT_ENTITY_ID"));
break;
case"pc":compFilterMaps.push(new FilterMapping("NC_PLAN_STATUS","setPlanStatusCodes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NC_PLAN_CLASS","setPlanClassificationCodes","Array","PARENT_ENTITY_ID"));
break;
case"pl":compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_VOCAB","setProblemsVocab","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_TYPE","setProblemsAddTypeCd","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_CLASS","setProblemsClassification","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_VOCAB_IND","setProblemsVocabInd","Number","FREETEXT_DESC"));
break;
case"pa":compFilterMaps.push(new FilterMapping("PREG_ANTEPARTUM_NOTE","setAntepartumNote","Array","PARENT_ENTITY_ID"));
break;
case"pa2":compFilterMaps.push(new FilterMapping("PREG_ANTEPARTUM_NOTE_2","setAntepartumNote2","Array","PARENT_ENTITY_ID"));
break;
case"pch":compFilterMaps.push(new FilterMapping("PREOP_LAST_FOOD_INTAKE","setLastFdIntake","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_LAST_FLD_INTAKE","setLastFlIntake","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_ANES_CONSENT","setAnesCnst","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_BLD_CONSENT","setBldCnst","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_SURG_CONSENT","setSurgCnst","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_ORDERS_CMPLT","setOrdrsCmplt","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_ECG_ORDERS","setEcgOrdrs","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_HCG_ORDERS","setHcgOrdrs","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_HX_PHYSICAL_REC","setHnP","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_SURG_PREP_VER","setSurgPrepVer","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_ALLERGY_BAND","setIdVerf","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_BLD_BAND","setBldBand","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_ID_BAND","setPrIdBand","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_SITE_VER_PT","setPrSiteVer","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_SITE_VER_RN","setPrSiteVerRN","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_SITE_VER_MD","setPrSiteVerMD","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_IMPLANT_AVAILABLE","setPrImplntAvail","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_BLD_AVAILABLE","setPrBldAvail","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_EQUIP_AVAILABLE","setPrEquipAvail","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_MD_WHO_VER_SITE","setWhoVerfSite","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREOP_RN_WHO_VER_SITE","setRNWhoVerfSite","Array","PARENT_ENTITY_ID"));
case"po":compFilterMaps.push(new FilterMapping("PREG_GRAVIDA","setGravida","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PARA","setPara","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PARA_ABORT","setParaAbort","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PARA_PREM","setParaPremature","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PARA_FT","setParaFullTerm","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_LIVE_CHILD_HX","setLiving","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_MULTI_BIRTH_HX","setMulitBirths","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_ECTOPIC_HX","setEctopic","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_SPON_ABORT_HX","setSpontAbort","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_IND_ABORT_HX","setInducedAbort","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PRE_WT","setPrePregWeight","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_HT","setHeight","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_LAST_DOC_HT_WT","setBMI","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_ABORH_TYPE","setABORhType","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_BLD_TYPE","setBloodType","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_RH_TYPE","setRhType","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_CURR_WT","setCurrentWeight","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_EPI_DEGREE","setEpiDegree","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_EPI_MIDLINE","setEpiMidline","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_EPI_MEDIO","setEpiMedio","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_EPI_PERF","setEpiPerformed","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_EPI_OTHER","setEpiOther","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PERI_INTACT","setPerineumIntact","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_CX_LAC","setCervicalLac","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PERINEIAL_LAC","setPerinealLac","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_PERIURETHRAL_LAC","setPeriurethralLac","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_SUPER_LAC","setSuperficialLac","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_VAG_LAC","setVaginalLac","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_LABIAL_LAC","setLabialLac","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_ANESTH_TYPE","setAnesthType","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_ANESTH_OB_TYPE","setAnesthOB","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_DT_TM_BIRTH","setBirthDtTm","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_GENDER","setGender","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_BIRTH_WT","setBirthWeight","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_NEO_OUTCOME","setNeoOutcome","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_NEO_COMP","setNeoComps","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_APGAR_1_MIN","setApgar1","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_APGAR_5_MIN","setApgar5","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_APGAR_10_MIN","setApgar10","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_FEED_TYPE_NB","setFeeding","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_DELIVERY_TYPE","setDeliveryType","Array","PARENT_ENTITY_ID"));
break;
case"pso":compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_EXPLANT","setImplantExplant","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_DESC","setImplantDesc","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_SERIAL_NBR","setImplantSerNbr","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_LOT_NBR","setImplantLotNbr","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_MANU","setImplantManu","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_CAT_NBR","setImplantCatNbr","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_SIZE","setImplantSize","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_EXP_DT","setImplantExpDt","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_SITE","setImplantSite","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_QTY","setImplantQty","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_DRESS_COND","setDressCond","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_DRESS_DRAINAGE","setDressDrain","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_DRESS_DESC","setDressDesc","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_DRESS_CARE","setDressCare","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_DRESS_LOC","setDressLoc","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_PAIN_LOC","setPainLoc","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_PAIN_RATING","setPainRating","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_PAIN_SCALE","setPainScale","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_PAIN_QUAL","setPainQual","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("POSTOP_PAIN_INTERVENTIONS","setPainInterv","Array","PARENT_ENTITY_ID"));
break;
case"pt":compFilterMaps.push(new FilterMapping("CHIEF_COMP_CE","setChiefComplaint","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("RESUS_ORDER","setResusOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ADV_DIRECTIVE","setAdvancedDirectives","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("MODE_ARRIVAL_CE","setModeofArrival","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("NOTE_ES","setDocumentTypes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("TARGET_DC_DT","setEstimatedDischargeDate","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ENC_TYPE","setVisitTypeCodes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("REASON_IND","setRFVDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("PRIMARY_DR_IND","setPrimaryPhysDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("ED_CONTACT_IND","setEmergencyContactsDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("ADMIT_DR_IND","setAdmittingPhysDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("RM_IND","setRoomBedDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("ATTEND_DR_IND","setAttendingPhysDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("ADM_DT_IND","setAdmitDateDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("MED_SVC_IND","setMedicalServiceDisplay","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("DIET_ORD","setDietOrders","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ACTIVITY_ORD","setPatientActivityOrders","Array","PARENT_ENTITY_ID"));
break;
case"qm":compFilterMaps.push(new FilterMapping("PLAN_STATUS","setPlanStatusCodes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PLAN_CLASS","setPlanClassificationCodes","Array","PARENT_ENTITY_ID"));
break;
case"reh_prec":compFilterMaps.push(new FilterMapping("PRECAUTION_ORDERS","setOrders","Array","PARENT_ENTITY_ID"));
break;
case"resp-tmln":compFilterMaps.push(new FilterMapping("GRAPH_SEQ_1","setTimelineCds1","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_2","setTimelineCds2","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_3","setTimelineCds3","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_4","setTimelineCds4","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_5","setTimelineCds5","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_6","setTimelineCds6","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_7","setTimelineCds7","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_8","setTimelineCds8","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_9","setTimelineCds9","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_10","setTimelineCds10","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_11","setTimelineCds11","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_12","setTimelineCds12","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_13","setTimelineCds13","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_14","setTimelineCds14","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_SEQ_15","setTimelineCds15","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPH_DEFAULTS","setDefaultSelected","Array","PARENT_ENTITY_ID"));
break;
case"rt":compFilterMaps.push(new FilterMapping("PREG_TIMELINE_LAB","setResultLabs","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PREG_TIMELINE_US","setResultUltrasounds","Array","PARENT_ENTITY_ID"));
break;
case"se":compFilterMaps.push(new FilterMapping("FLAG_DATE_FORMAT_IND","setIsDateWithinInd","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("FLAG_COM_FACEUP_IND","setFaceupCommentsDisplayEnabled","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("EVENT_CODES_IST_IND","setISTEventCodesMappedInd","Boolean","FREETEXT_DESC"));
break;
case"seo2":compFilterMaps.push(new FilterMapping("SIG_EVENTS_SELECT_COND","setEventFilters","Array","PARENT_ENTITY_ID"));
break;
case"tl":compFilterMaps.push(new FilterMapping("ED_TIMELINE_IND","setDisplayEnabled","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("ED_LAB_RAD_CAT_TYPE","setLabRadCatalogTypes","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("ED_TIMELINE_ORDERS","setDocCatalogCds","Array","PARENT_ENTITY_ID"));
break;
case"tmln":compFilterMaps.push(new FilterMapping("GRAPHS_IND","setDisplayEnabled","Boolean","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("GRAPHS_SUB_CONTROLLER","setMasterGraphTitle","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("GRAPHS_SUB_VS","setVitalSignTitle","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_DEFAULTS","setDefaultSelected","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_1","setTimelineCds1","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_2","setTimelineCds2","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_3","setTimelineCds3","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_4","setTimelineCds4","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_5","setTimelineCds5","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_6","setTimelineCds6","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_7","setTimelineCds7","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_8","setTimelineCds8","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_9","setTimelineCds9","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_10","setTimelineCds10","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPHS_SUB_BP","setBloodPressureTitle","String","FREETEXT_DESC"));
compFilterMaps.push(new FilterMapping("BP_GRAPH_SYS_INVASIVE","setTimelineCds11","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("BP_GRAPH_DIAS_INVASIVE","setTimelineCds12","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("BP_GRAPH_SYS_NONINVASIVE","setTimelineCds13","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("BP_GRAPH_DIAS_NONINVASIVE","setTimelineCds14","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("BP_GRAPH_MAP_INVASIVE","setTimelineCds15","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("BP_GRAPH_MAP_CUFF","setTimelineCds16","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("GRAPHS_SUB_VS_TABLE","setTableGraphTitle","String","FREETEXT_DESC"));
break;
case"treat":compFilterMaps.push(new FilterMapping("OT_TREAT_DOC","setOTTreatments","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PT_TREAT_DOC","setPTTreatments","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("SLP_TREAT_DOC","setSLPTreatments","Array","PARENT_ENTITY_ID"));
break;
case"vs":compFilterMaps.push(new FilterMapping("VS_RESULTS_IND","setShowTodayValue","Boolean","FREETEXT_DESC"));
case"wm":compFilterMaps.push(new FilterMapping("WT_RESULTS_IND","setShowTodayValue","Boolean","FREETEXT_DESC"));
}return BRCompPrefSetFuncCreation(compFilterMaps);
}}}();
/*Listen for a ctrl + \ key combination and activate logging once pressed*/
document.onkeypress = function(evt){
	if (!evt) {
        evt = window.event;
    }

	if(evt.ctrlKey==1 && evt.keyCode == 28){
		log.activateLogging();
	}
};

/*
	Blackbird - Open Source JavaScript Logging Utility
	Author: G Scott Olson
	Web: http://blackbirdjs.googlecode.com/
	     http://www.gscottolson.com/blackbirdjs/
	Version: 1.0

	The MIT License - Copyright (c) 2008 Blackbird Project
*/
( function() {
	var NAMESPACE = 'log';
	var IE6_POSITION_FIXED = true; // enable IE6 {position:fixed}
	
	var bbird;
	var outputList;
	var cache = [];
	var loggingActive;
	var state = getState();
	var classes = {};
	var profiler = {};
	var IDs = {
		blackbird: 'blackbird',
		checkbox: 'bbVis',
		filters: 'bbFilters',
		controls: 'bbControls',
		size: 'bbSize'
	}
	var messageTypes = { //order of these properties imply render order of filter controls
		debug: true,
		info: true,
		warn: true,
		error: true,
		profile: true
	};
	
	function isLoggingActive(){
		return (state.active || loggingActive) ? true : false;
	}
	
	function generateMarkup() { //build markup
		var spans = [];
		for ( type in messageTypes ) {
			spans.push( [ '<span class="', type, '" type="', type, '"></span>'].join( '' ) );
		}

		var newNode = document.createElement( 'DIV' );
		newNode.id = IDs.blackbird;
		newNode.style.display = 'none';
		newNode.innerHTML = [
			'<div class="header">',
				'<div class="left">',
					'<div id="', IDs.filters, '" class="filters" title="click to filter by message type">', spans.join( '' ), '</div>',
				'</div>',
				'<div class="right">',
					'<div id="', IDs.controls, '" class="controls">',
						'<span id="', IDs.size ,'" title="contract" op="resize"></span>',
						'<span class="clear" title="clear" op="clear"></span>',
						'<span class="close" title="close" op="close"></span>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="main">',
				'<div class="left"></div><div class="mainBody">',
					'<ol>', cache.join( '' ), '</ol>',
				'</div><div class="right"></div>',
			'</div>'/*,
			'<div class="footer">',
				'<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
				'<div class="right"></div>',
			'</div>'*/
		].join( '' );
		return newNode;
	}

	function backgroundImage() { //(IE6 only) change <BODY> tag's background to resolve {position:fixed} support
		var bodyTag = document.getElementsByTagName( 'BODY' )[ 0 ];
		
		if ( bodyTag.currentStyle && IE6_POSITION_FIXED ) {
			if (bodyTag.currentStyle.backgroundImage == 'none' ) {
				bodyTag.style.backgroundImage = 'url(about:blank)';
			}
			if (bodyTag.currentStyle.backgroundAttachment == 'scroll' ) {
				bodyTag.style.backgroundAttachment = 'fixed';
			}
		}
	}

	function addMessage( type, content ) { //adds a message to the output list
		content = ( content.constructor == Array ) ? content.join( '' ) : content;
		if ( outputList ) {
			var newMsg = document.createElement( 'LI' );
			newMsg.className = type;
			newMsg.innerHTML = [ '<span class="icon"></span>', content ].join( '' );
			outputList.appendChild( newMsg );
			scrollToBottom();
		} else {
			cache.push( [ '<li class="', type, '"><span class="icon"></span>', content, '</li>' ].join( '' ) );
		}
	}
	
	function clear() { //clear list output
		outputList.innerHTML = '';
	}
	
	function clickControl( evt ) {
		if ( !evt ) evt = window.event;
		var el = ( evt.target ) ? evt.target : evt.srcElement;

		if ( el.tagName == 'SPAN' ) {
			switch ( el.getAttributeNode( 'op' ).nodeValue ) {
				case 'resize': resize(); break;
				case 'clear':  clear();  break;
				case 'close':  hide();   break;
			}
		}
	}
	
	function clickFilter( evt ) { //show/hide a specific message type
		if ( !evt ) evt = window.event;
		var span = ( evt.target ) ? evt.target : evt.srcElement;

		if ( span && span.tagName == 'SPAN' ) {

			var type = span.getAttributeNode( 'type' ).nodeValue;

			if ( evt.altKey ) {
				var filters = document.getElementById( IDs.filters ).getElementsByTagName( 'SPAN' );

				var active = 0;
				for ( entry in messageTypes ) {
					if ( messageTypes[ entry ] ) active++;
				}
				var oneActiveFilter = ( active == 1 && messageTypes[ type ] );

				for ( var i = 0; filters[ i ]; i++ ) {
					var spanType = filters[ i ].getAttributeNode( 'type' ).nodeValue;

					filters[ i ].className = ( oneActiveFilter || ( spanType == type ) ) ? spanType : spanType + 'Disabled';
					messageTypes[ spanType ] = oneActiveFilter || ( spanType == type );
				}
			}
			else {
				messageTypes[ type ] = ! messageTypes[ type ];
				span.className = ( messageTypes[ type ] ) ? type : type + 'Disabled';
			}

			//build outputList's class from messageTypes object
			var disabledTypes = [];
			for ( type in messageTypes ) {
				if ( ! messageTypes[ type ] ) disabledTypes.push( type );
			}
			disabledTypes.push( '' );
			outputList.className = disabledTypes.join( 'Hidden ' );

			scrollToBottom();
		}
	}

	function clickVis( evt ) {
		if ( !evt ) evt = window.event;
		var el = ( evt.target ) ? evt.target : evt.srcElement;

		state.load = el.checked;
		setState();
	}
	
	
	function scrollToBottom() { //scroll list output to the bottom
		outputList.scrollTop = outputList.scrollHeight;
	}
	
	function isVisible() { //determine the visibility
		return ( bbird.style.display == 'block' );
	}

	function hide() { 
	  bbird.style.display = 'none';
	}
			
	function show() {
		var body = document.getElementsByTagName( 'BODY' )[ 0 ];
		body.removeChild( bbird );
		body.appendChild( bbird );
		bbird.style.display = 'block';
	}
	
	//sets the position
	function reposition( position ) {
		if ( position === undefined || position == null ) {
			position = ( state && state.pos === null ) ? 1 : ( state.pos + 1 ) % 4; //set to initial position ('topRight') or move to next position
		}
				
		switch ( position ) {
			case 0: classes[ 0 ] = 'bbTopLeft'; break;
			case 1: classes[ 0 ] = 'bbTopRight'; break;
			case 2: classes[ 0 ] = 'bbBottomLeft'; break;
			case 3: classes[ 0 ] = 'bbBottomRight'; break;
		}
		state.pos = position;
		setState();
	}

	function resize( size ) {
		if ( size === undefined || size === null ) {
			size = ( state && state.size == null ) ? 1 : ( state.size + 1 ) % 2;
	  	}

		classes[ 1 ] = ( size === 0 ) ? 'bbSmall' : 'bbLarge'

		var span = document.getElementById( IDs.size );
		span.title = ( size === 1 ) ? 'small' : 'large';
		span.className = span.title;	  

		state.size = size;
		setState();
		scrollToBottom();
	}

	function setLogging(){
		state.active = true;
		state.load = true;
		state.size = 1;
		setState();
	}
	
	function setState() {
		var props = [];
		for ( entry in state ) {
			var value = ( state[ entry ] && state[ entry ].constructor === String ) ? '"' + state[ entry ] + '"' : state[ entry ]; 
			props.push( entry + ':' + value );
		}
		props = props.join( ',' );
		
		var expiration = new Date();
		expiration.setDate( expiration.getDate() + 14 );
		document.cookie = [ 'blackbird={', props, '};'].join( '' );

		var newClass = [];
		for ( word in classes ) {
			newClass.push( classes[ word ] );
		}
		bbird.className = newClass.join( ' ' );
	}
	
	function getState() {
		var re = new RegExp( /blackbird=({[^;]+})(;|\b|$)/ );
		var match = re.exec( document.cookie );
		return ( match && match[ 1 ] ) ? eval( '(' + match[ 1 ] + ')' ) : { pos:null, size:null, load:null, active:null };
	}
	
	//event handler for 'keyup' event for window
	function readKey( evt ) {
		if ( !evt ) evt = window.event;
		var code = 113; //F2 key
					
		if ( evt && evt.keyCode == code ) {
					
			var visible = isVisible();
					
			if ( visible && evt.shiftKey && evt.altKey ) clear();
			else if	 (visible && evt.shiftKey ) reposition();
			else if ( !evt.shiftKey && !evt.altKey ) {
			  if(isLoggingActive()){
			    ( visible ) ? hide() : show();
			  }
			}
		}
	}

	//event management ( thanks John Resig )
	function addEvent( obj, type, fn ) {
		var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;
		if ( obj.attachEvent ) {
			obj[ 'e' + type + fn ] = fn;
			obj[ type + fn ] = function(){ obj[ 'e' + type + fn ]( window.event ) };
			obj.attachEvent( 'on' + type, obj[ type + fn ] );
		} else obj.addEventListener( type, fn, false );
	}
	function removeEvent( obj, type, fn ) {
		var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;
		if ( obj.detachEvent ) {
			obj.detachEvent( 'on' + type, obj[ type + fn ] );
			obj[ type + fn ] = null;
	  } else obj.removeEventListener( type, fn, false );
	}

	window[ NAMESPACE ] = {
		toggle:
			function() { if(isLoggingActive()){( isVisible() ) ? hide() : show(); }},
		resize:
			function() { resize(); },
		clear:
			function() { clear(); },
		move:
			function() { reposition(); },
		debug: 
			function( msg ) { if(isLoggingActive()){addMessage( 'debug', msg ); }},
		warn:
			function( msg ) { if(isLoggingActive()){addMessage( 'warn', msg ); }},
		info:
			function( msg ) { if(isLoggingActive()){addMessage( 'info', msg ); }},
		error: 
			function( msg ) { if(isLoggingActive()){addMessage( 'error', msg ); }},
		activateLogging:
			function(){
				//Set the state.active to true
				setLogging();
			},
		profile: 
			function( label ) {
				var currentTime = new Date(); //record the current time when profile() is executed
				
				if ( label == undefined || label == '' ) {
					addMessage( 'error', '<b>ERROR:</b> Please specify a label for your profile statement' );
				}
				else if ( profiler[ label ] ) {
					addMessage( 'profile', [ label, ': ', currentTime - profiler[ label ],	'ms' ].join( '' ) );
					delete profiler[ label ];
				}
				else {
					profiler[ label ] = currentTime;
					addMessage( 'profile', label );
				}
				return currentTime;
			}
	}

	addEvent( window, 'load', 
		/* initialize Blackbird when the page loads */
		function() {
			var body = document.getElementsByTagName( 'BODY' )[ 0 ];
			bbird = body.appendChild( generateMarkup() );
			outputList = bbird.getElementsByTagName( 'OL' )[ 0 ];
		
			backgroundImage();
		
			//add events
			//addEvent( IDs.checkbox, 'click', clickVis );
			addEvent( IDs.filters, 'click', clickFilter );
			addEvent( IDs.controls, 'click', clickControl );
			addEvent( document, 'keyup', readKey);

			resize( state.size );
			reposition( state.pos );
			if ( state.load ) {
				show();
				//document.getElementById( IDs.checkbox ).checked = true; 
			}

			scrollToBottom();

			window[ NAMESPACE ].init = function() {
				show();
				window[ NAMESPACE ].error( [ '<b>', NAMESPACE, '</b> can only be initialized once' ] );
			}

			addEvent( window, 'unload', function() {
				//removeEvent( IDs.checkbox, 'click', clickVis );
				removeEvent( IDs.filters, 'click', clickFilter );
				removeEvent( IDs.controls, 'click', clickControl );
				removeEvent( document, 'keyup', readKey );
			});
			
			if(state.active){
				//Prevent logging from occuring next reload
				loggingActive = true;
				state.active = false;
				state.load = false;
				state.size = 1;
				setState();
			}
		});
})();mp_formatter={};
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
function DocumentBaseComponent(){this.m_resultStatusCodes=null;
this.m_resultStatusMeanings=null;
this.m_includeHover=true;
this.m_pcnFavorites=true;
this.setIncludeLineNumber(true);
DocumentBaseComponent.method("InsertData",function(){if(this.getGrouperFilterEventSets()){CERN_DOCUMENT_BASE_O1.RefreshDocumentsTable(this,this.getGrouperFilterLabel(),this.getGrouperFilterEventSets());
}else{CERN_DOCUMENT_BASE_O1.GetDocumentsTable(this);
}});
DocumentBaseComponent.method("setResultStatusCodes",function(value){this.m_resultStatusCodes=value;
});
DocumentBaseComponent.method("addResultStatusCode",function(value){if(!this.m_resultStatusCodes){this.m_resultStatusCodes=[];
}this.m_resultStatusCodes.push(value);
});
DocumentBaseComponent.method("getResultStatusCodes",function(){if(this.m_resultStatusCodes){return this.m_resultStatusCodes;
}else{if(this.m_resultStatusMeanings){var resStatusCodeSet=MP_Util.GetCodeSet(8,false);
if(this.m_resultStatusMeanings&&this.m_resultStatusMeanings.length>0){for(var x=this.m_resultStatusMeanings.length;
x--;
){var code=MP_Util.GetCodeByMeaning(resStatusCodeSet,this.m_resultStatusMeanings[x]);
if(code){this.addResultStatusCode(code.codeValue);
}}}}}return this.m_resultStatusCodes;
});
DocumentBaseComponent.method("addResultStatusMeaning",function(value){if(!this.m_resultStatusMeanings){this.m_resultStatusMeanings=[];
}this.m_resultStatusMeanings.push(value);
});
DocumentBaseComponent.method("setResultStatusMeanings",function(value){this.m_resultStatusMeanings=value;
});
DocumentBaseComponent.method("isHoverEnabled",function(){return this.m_includeHover;
});
DocumentBaseComponent.method("setHoverEnabled",function(value){this.m_includeHover=value;
});
DocumentBaseComponent.method("isPcnFavEnabled",function(){return this.m_pcnFavorites;
});
DocumentBaseComponent.method("setPcnFavEnabled",function(value){this.m_pcnFavorites=value;
});
DocumentBaseComponent.method("FilterRefresh",function(label,esArray){CERN_DOCUMENT_BASE_O1.RefreshDocumentsTable(this,label,esArray);
});
DocumentBaseComponent.method("HandleSuccess",function(recordData){CERN_DOCUMENT_BASE_O1.RenderComponent(this,recordData);
});
}DocumentBaseComponent.inherits(MPageComponent);
var CERN_DOCUMENT_BASE_O1=function(){return{GetDocumentsTable:function(component){var mgr=new MP_Core.XMLCCLRequestThreadManager(CERN_DOCUMENT_BASE_O1.RenderReply,component,false);
var sendAr=[];
var request=null;
var thread=null;
var criterion=component.getCriterion();
var groups=component.getGroups();
var codes=component.getResultStatusCodes();
var events=(groups!=null&&groups.length>0)?groups[0].getEventSets():null;
var results=(codes!=null&&codes.length>0)?codes:null;
var encntrOption=(component.getScope()==2)?(criterion.encntr_id+".0"):"0.0";
sendAr.push("^MINE^",criterion.person_id+".0",encntrOption,criterion.provider_id+".0",component.getLookbackUnits());
if(events){sendAr.push("value("+events.join(",")+")");
}else{sendAr.push("0.0");
}if(results){sendAr.push("value("+results.join(",")+")");
}else{sendAr.push("0.0");
}var unitType=component.getLookbackUnitTypeFlag();
sendAr.push(criterion.ppr_cd+".0",unitType);
request=new MP_Core.ScriptRequest(component,"ENG:MPG.DOC.O1 - load documents");
request.setProgramName("MP_RETRIEVE_DOCUMENTS_JSON");
request.setParameters(sendAr);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread("GetDocumentData",component,request);
mgr.addThread(thread);
if(component.isPlusAddEnabled()){sendAr=[];
sendAr.push("^MINE^",criterion.provider_id);
request=new MP_Core.ScriptRequest(component,"ENG:MPG.DOC.O1 - load PCN Favs");
request.setProgramName("MP_GET_DOCUMENT_FAVORITES");
request.setParameters(sendAr);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread("GetPcnFavorites",component,request);
mgr.addThread(thread);
}mgr.begin();
},RefreshDocumentsTable:function(component,filterLabel,filterESArray){var mgr=new MP_Core.XMLCCLRequestThreadManager(CERN_DOCUMENT_BASE_O1.RenderReply,component,false);
var sendAr=[];
var request=null;
var thread=null;
var criterion=component.getCriterion();
var codes=component.getResultStatusCodes();
var events=(filterESArray)?MP_Util.CreateParamArray(filterESArray,1):"0.0";
var results=(codes)?MP_Util.CreateParamArray(codes,1):"0.0";
var encntrOption=(component.getScope()==2)?(criterion.encntr_id+".0"):"0.0";
sendAr.push("^MINE^",criterion.person_id+".0",encntrOption,criterion.provider_id+".0",component.getLookbackUnits());
sendAr.push(events);
sendAr.push(results);
var unitType=component.getLookbackUnitTypeFlag();
sendAr.push(criterion.ppr_cd+".0",unitType);
request=new MP_Core.ScriptRequest(component,"ENG:MPG.DOC.O1 - load documents");
request.setProgramName("MP_RETRIEVE_DOCUMENTS_JSON");
request.setParameters(sendAr);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread("GetDocumentData",component,request);
mgr.addThread(thread);
if(component.isPlusAddEnabled()){sendAr=[];
sendAr.push("^MINE^",criterion.provider_id);
request=new MP_Core.ScriptRequest(component,"ENG:MPG.DOC.O1 - load PCN Favs");
request.setProgramName("MP_GET_DOCUMENT_FAVORITES");
request.setParameters(sendAr);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread("GetPcnFavorites",component,request);
mgr.addThread(thread);
}mgr.begin();
},RenderReply:function(replyAr,component){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
var countText="";
var compNS=component.getStyles().getNameSpace();
var errMsg=[];
try{for(var repCnt=replyAr.length;
repCnt--;
){var reply=replyAr[repCnt];
var repStatus=reply.getStatus();
switch(reply.getName()){case"GetPcnFavorites":var favData=reply.getResponse();
if(repStatus=="S"){appendDropDown(compNS,component,favData,component.getCriterion().static_content);
}break;
case"GetDocumentData":if(repStatus=="F"){errMsg.push(reply.getError());
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("<br />")),component,"");
}else{if(repStatus=="S"){var recordData=reply.getResponse();
var sHTML="";
sHTML=CERN_DOCUMENT_BASE_O1.RenderComponent(component,recordData);
countText=MP_Util.CreateTitleText(component,recordData.DOCS.length);
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
if(component.isScrollingEnabled()&&(recordData.DOCS.length>=component.getScrollNumber())){var xNode=Util.Style.g(compNS+"-info-hdr",document.body,"DL");
if(xNode[0]){Util.Style.acss(xNode[0],"hdr-scroll");
}}}else{countText=(component.isLineNumberIncluded()?"(0)":"");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()),component,countText);
}}break;
}}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}},RenderComponent:function(component,recordData){var compNS=component.getStyles().getNameSpace();
var DocI18n=i18n.discernabu.documents_base_o1;
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var sHTML="";
var countText="";
var jsHTML=[];
jsHTML.push("<div class='content-hdr'><dl class='",compNS,"-info-hdr hdr'><dd class='",compNS+"-cat-hd'><span></span></dd>");
jsHTML.push("<dd class='",compNS,"-auth-hd'><span>",DocI18n.AUTHOR,"</span></dd>");
if(PathologyComponent&&(component instanceof PathologyComponent)){jsHTML.push("<dd class='",compNS,"-dt-hd'><span>",DocI18n.DATE,"</span></dd>");
}else{jsHTML.push("<dd class='",compNS,"-dt-hd'><span>",DocI18n.DATE_TIME,"</span></dd>");
}if(component.getDateFormat()==3){jsHTML.push("<dd class='",compNS+"-cat-hd'><span></span></dd><dd class='",compNS,"-auth-hd'><span></span></dd><dd class='",compNS,"-dt-hd'><span>",DocI18n.WITHIN,"</span></dd>");
}jsHTML.push("</dl></div>");
recordData.DOCS.sort(DocumentSorter);
jsHTML.push("<div class='",MP_Util.GetContentClass(component,recordData.DOCS.length),"'>");
for(var x=0,xl=recordData.DOCS.length;
x<xl;
x++){var dtHvr="",lastPrsnl="";
var author=DocI18n.UNKNOWN;
var docObj=recordData.DOCS[x];
var patId=docObj.PERSON_ID+".0";
var enctrId=docObj.ENCNTR_ID+".0";
var evntId=docObj.EVENT_ID+".0";
var docStatus=MP_Util.GetValueFromArray(docObj.RESULT_STATUS_CD,codeArray);
var doc=MP_Util.GetValueFromArray(docObj.EVENT_CD,codeArray);
var parentEventId=docObj.PARENT_EVENT_ID+".0";
var viewerType=docObj.VIEWER_TYPE;
var dateOfService=null;
var withinDateDos=null;
var dateTime=new Date();
if(docObj.EFFECTIVE_DT_TM!=""){dateTime.setISO8601(docObj.EFFECTIVE_DT_TM);
dateOfService=MP_Util.DisplayDateByOption(component,dateTime);
withinDateDos=MP_Util.CalcWithinTime(dateTime);
}else{dateOfService=DocI18n.UNKNOWN;
withinDateDos=DocI18n.UNKNOWN;
}var recentPart=GetLatestParticipation(docObj);
var authorPart=GetAuthorParticipant(docObj,codeArray);
if(authorPart){author=MP_Util.GetValueFromArray(authorPart.PRSNL_ID,personnelArray).fullName;
}if(recentPart&&recentPart.PRSNL_ID>0){lastPrsnl=MP_Util.GetValueFromArray(recentPart.PRSNL_ID,personnelArray).fullName;
var dtTm=new Date();
if(recentPart.DATE!==""){dtTm.setISO8601(recentPart.DATE);
dtHvr=df.format(dtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
}else{dtHvr=DocI18n.UNKNOWN;
}}else{lastPrsnl=DocI18n.UNKNOWN;
dtHvr=DocI18n.UNKNOWN;
}jsHTML.push("<dl class='",compNS,"-info'><dd class='",compNS+"-cat'><span>",MP_Util.CreateClinNoteLink(patId,enctrId,evntId,doc.display,viewerType,parentEventId),"</span>");
if(docStatus.meaning=="MODIFIED"||docStatus.meaning=="ALTERED"){jsHTML.push("<span class='res-modified'>&nbsp;</span>");
}jsHTML.push("</dd>");
jsHTML.push("<dd class='",compNS,"-auth'><span>",author,"</span></dd>");
if(component.getDateFormat()==3){jsHTML.push("<dd class='",compNS,"-dt'><span class='date-time'>",withinDateDos,"</span></dd>");
}else{jsHTML.push("<dd class='",compNS,"-dt'><span class='date-time'>",dateOfService,"</span></dd>");
}jsHTML.push("<dd class='",compNS,"-image'>");
if(docObj.IMAGE_URL!==""){var urlParam='javascript:MPAGES_SVC_EVENT("'+docObj.IMAGE_URL+'",^MINE,$PAT_PersonId$^)';
jsHTML.push("<a class='",compNS,"-image-found' href='",urlParam,"'>&nbsp;</a>");
}else{jsHTML.push("&nbsp;");
}jsHTML.push("</dd></dl>");
if(component.isHoverEnabled()){jsHTML.push("<h4 class='det-hd'><span>",DocI18n.DOCUMENTATION_DETAILS,"</span></h4><div class='hvr'><dl class='",compNS,"-det'><dt><span>",DocI18n.NAME,":</span></dt><dd class='",compNS,"-det-name'><span>",doc.display,"</span></dd><dt><span>",DocI18n.SUBJECT,":</span></dt><dd class='",compNS,"-det-subj'><span>",docObj.SUBJECT,"</span></dd><dt><span>",DocI18n.STATUS,":</span></dt><dd class='",compNS,"-det-status'><span>",MP_Util.GetValueFromArray(docObj.RESULT_STATUS_CD,codeArray).display,"</span></dd><dt><span>",DocI18n.LAST_UPDATED,":</span></dt><dd class='",compNS,"-det-dt'><span>",dtHvr,"</span></dd><dt><span>",DocI18n.LAST_UPDATED_BY,":</span></dt><dd class='",compNS,"-det-dt'><span>",lastPrsnl,"</span></dd></dl></div>");
}}jsHTML.push("</div>");
sHTML=jsHTML.join("");
return sHTML;
}};
function GetLatestParticipation(doc){var returnPart=null;
for(var x=doc.ACTION_PROVIDERS.length;
x--;
){var part=doc.ACTION_PROVIDERS[x];
if(!returnPart||part.DATE>returnPart.DATE){returnPart=part;
}}return(returnPart);
}function DocumentSorter(a,b){var aPart=GetLatestParticipation(a);
var bPart=GetLatestParticipation(b);
var aDate="";
var bDate="";
if(aPart){aDate=aPart.EFFECTIVE_DT_TM;
}if(bPart){bDate=bPart.EFFECTIVE_DT_TM;
}if(aDate>bDate){return -1;
}else{if(aDate<bDate){return 1;
}else{return 0;
}}}function GetAuthorParticipant(doc,codeArray){var returnPart=null,type_cd=null,status_cd=null,part=null,strPerform="PERFORM",strCompleted="COMPLETED";
for(var y=doc.ACTION_PROVIDERS.length;
y--;
){part=doc.ACTION_PROVIDERS[y];
type_cd=MP_Util.GetValueFromArray(part.TYPE_CD,codeArray);
status_cd=MP_Util.GetValueFromArray(part.STATUS_CD,codeArray);
if((type_cd&&type_cd.meaning===strPerform)&&(status_cd&&status_cd.meaning===strCompleted)){returnPart=part;
break;
}}return(returnPart);
}function appendDropDown(preSec,component,pcnFav,contentPath){if(preSec!="doc"){return;
}pre=component.getStyles().getId();
if((_g(pre+"Drop")!=null)&&_g(pre+"Menu")!=null){return;
}var img=Util.cep("img",{src:contentPath+"\\images\\3943_16.gif"});
var link=Util.cep("a",{className:"drop-Down",id:pre+"Drop"});
var menu=Util.cep("div",{id:pre+"Menu",className:"form-menu menu-hide"});
Util.ac(img,link);
var sec=_g(component.getStyles().getId());
var secCL=Util.Style.g("sec-hd",sec,"h2");
var secSpan=secCL[0];
Util.ac(link,secSpan);
Util.ac(menu,secSpan);
pcnFavLoad(pcnFav,component);
}function pcnFavLoad(pcnFav,component){var jsonPcnFav=pcnFav;
var docDropId=component.getStyles().getId()+"Drop";
var docDrop=_g(docDropId);
var htmlPcnFav=[];
var numId=0;
var pcn=jsonPcnFav.PRE_COMPLETED;
pcn.sort(function(obj1,obj2){function checkStrings(s1,s2){return(s1===s2)?0:((s1>s2)?1:-1);
}return checkStrings(obj1.DISPLAY.toUpperCase(),obj2.DISPLAY.toUpperCase());
});
if(!pcn[0]){htmlPcnFav.push("<div>",i18n.discernabu.documents_base_o1.DOCUMENT_FAVS,'<span class="favHidden" id="docCKI',numId,'">',i18n.DOCUMENT_FAVS,"</span></div>");
}else{var crit=component.getCriterion();
for(var j=0,l=pcn.length;
j<l;
j++){var pcNote=pcn[j];
numId=numId+1;
htmlPcnFav.push('<div><a id="doc',numId,'" href="#">',pcNote.DISPLAY,"</a>",'<span class="favHidden" id="docCKI',numId,'">',pcNote.SOURCE_IDENTIFIER,"</span>",'<span class="favHidden" id="docStyleID',numId,'">',component.getStyles().getId(),"</span>","</div>");
}}var pcnArray=htmlPcnFav.join("");
var newSpan=Util.cep("span");
newSpan.innerHTML=pcnArray;
var docMenuId=component.getStyles().getId()+"Menu";
var docMenu=_g(docMenuId);
Util.ac(newSpan,docMenu);
var docMenuList=_gbt("a",docMenu);
var dmLen=docMenuList.length;
for(var i=dmLen;
i--;
){Util.addEvent(docMenuList[i],"click",addDocDet);
}closeMenuInit(docMenu,component.getStyles().getId());
Util.addEvent(docDrop,"click",function(){if(Util.Style.ccss(Util.gns(this),"menu-hide")){_g(component.getStyles().getId()).style.zIndex=2;
Util.preventDefault();
Util.Style.rcss(Util.gns(this),"menu-hide");
}else{_g(component.getStyles().getId()).style.zIndex=1;
Util.Style.acss(Util.gns(this),"menu-hide");
}});
}function addDocDet(){try{var PowerNoteMPageUtils=window.external.DiscernObjectFactory("POWERNOTE");
MP_Util.LogDiscernInfo(null,"POWERNOTE","documentbase.js","addDocDet");
var comp={};
if(PowerNoteMPageUtils){var menuVal=Util.gns(this);
var cki=menuVal.firstChild.data;
var spanDocStyleID=Util.gns(menuVal);
for(var x=0,xl=CERN_MPageComponents.length;
x<xl;
x++){comp=CERN_MPageComponents[x];
var styles=comp.getStyles();
if(styles.getId()==spanDocStyleID.firstChild.data){break;
}}var crit=comp.getCriterion();
PowerNoteMPageUtils.BeginNoteFromPrecompletedNote(crit.person_id+".0",crit.encntr_id+".0",cki+".0");
CERN_DOCUMENT_BASE_O1.GetDocumentsTable(comp);
}}catch(err){alert('An error has occured calling DiscernObjectFactory("POWERNOTE"): '+err.name+" "+err.message);
return;
}}function closeMenuInit(inMenu,compId){var menuId;
var docMenuId=compId+"Menu";
if(inMenu.id==docMenuId){menuId=compId;
}if(!e){var e=window.event;
}if(window.attachEvent){Util.addEvent(inMenu,"mouseleave",function(){Util.Style.acss(inMenu,"menu-hide");
_g(menuId).style.zIndex=1;
});
}else{Util.addEvent(inMenu,"mouseout",menuLeave);
}function menuLeave(e){if(!e){var e=window.event;
}var relTarg=e.relatedTarget||e.toElement;
if(e.relatedTarget.id==inMenu.id){Util.Style.acss(inMenu,"menu-hide");
_g(menuId).style.zIndex=1;
}e.stopPropagation();
Util.cancelBubble(e);
}}}();
function MeasurementBaseComponent(criterion){this.m_resultCount=0;
this.m_isEventSetInfo=false;
MeasurementBaseComponent.method("setResultCount",function(value){this.m_resultCount=value;
});
MeasurementBaseComponent.method("getResultCount",function(){return(this.m_resultCount);
});
MeasurementBaseComponent.method("setIncludeEventSetInfo",function(value){this.m_isEventSetInfo=value;
});
MeasurementBaseComponent.method("includeEventSetInfo",function(){return(this.m_isEventSetInfo);
});
MeasurementBaseComponent.method("InsertData",function(){getMeasurementData(this);
});
function getMeasurementData(component){var groups=component.getGroups();
if(groups&&groups.length>0){var mgr=new MP_Core.XMLCCLRequestThreadManager(component.HandleSuccess,component,true);
var criterion=component.getCriterion();
var programName="MP_RETRIEVE_N_RESULTS_JSON";
for(var x=0,xl=groups.length;
x<xl;
x++){var group=groups[x];
var sEventSets="0.0",sEventCodes="0.0";
var esInfo=(component.includeEventSetInfo())?1:0;
var sendAr=[];
var request=null;
var thread=null;
var sEncntr=(component.getScope()===2)?criterion.encntr_id+".0":"0.0";
if(group instanceof MPageEventSetGroup){sEventSets=MP_Util.CreateParamArray(group.getEventSets(),1);
}else{if(group instanceof MPageEventCodeGroup){sEventCodes=MP_Util.CreateParamArray(group.getEventCodes(),1);
}else{if(group instanceof MPageSequenceGroup){var mapItems=group.getMapItems();
sEventSets=MP_Util.CreateParamArray(MP_Util.GetValueFromArray("CODE_VALUE",mapItems),1);
}else{if(group instanceof MPageGrouper){var g=group.getGroups();
var ec=[];
for(var y=0,yl=g.length;
y<yl;
y++){if(g[y] instanceof MPageEventCodeGroup){ec=ec.concat(g[y].getEventCodes());
}}sEventCodes=MP_Util.CreateParamArray(ec,1);
}else{continue;
}}}}sendAr.push("^MINE^",criterion.person_id+".0",sEncntr,criterion.provider_id+".0",criterion.ppr_cd+".0",component.getResultCount(),"^^",sEventSets,sEventCodes,component.getLookbackUnits(),component.getLookbackUnitTypeFlag(),esInfo);
request=new MP_Core.ScriptRequest(component,"ENG:MPG.MEASBASE.O1 - load "+group.getGroupName());
request.setProgramName(programName);
request.setParameters(sendAr);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread(group.getGroupName(),component,request);
mgr.addThread(thread);
}mgr.begin();
}else{MP_Core.CreateSimpleError(component,i18n.discernabu.measurement_base_o1.ERROR_MISSING_ES_EC);
}}}MeasurementBaseComponent.inherits(MPageComponent);
var CERN_MEASUREMENT_BASE_O1=function(){function getMeasurementDataArray(recordData,personnelArray,codeArray){var measureArray=[];
if(!codeArray){codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
}if(!personnelArray){personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
}var results=recordData.RESULTS;
for(var i=0,il=results.length;
i<il;
i++){var result=results[i];
if(result.CLINICAL_EVENTS.length>0){for(var j=0,jl=result.CLINICAL_EVENTS.length;
j<jl;
j++){var meas=result.CLINICAL_EVENTS[j];
for(var k=0,kl=meas.MEASUREMENTS.length;
k<kl;
k++){var measurement=new MP_Core.Measurement();
measurement.initFromRec(meas.MEASUREMENTS[k],codeArray);
measureArray.push(measurement);
}}}}return measureArray;
}return{LoadMeasurementDataMap:function(recordData,personnelArray,codeArray,sortOption){var mapObjects=[];
var results=recordData.RESULTS;
if(!codeArray){codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
}if(!personnelArray){personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
}for(var i=0,il=results.length;
i<il;
i++){var result=results[i];
if(result.CLINICAL_EVENTS.length>0){for(var j=0,jl=result.CLINICAL_EVENTS.length;
j<jl;
j++){var measureArray=[];
var mapObject=null;
if(result.EVENT_CD>0){mapObject=new MP_Core.MapObject(result.EVENT_CD,measureArray);
}else{mapObject=new MP_Core.MapObject(result.EVENT_SET_NAME,measureArray);
}var meas=result.CLINICAL_EVENTS[j];
for(var k=0,kl=meas.MEASUREMENTS.length;
k<kl;
k++){var measurement=new MP_Core.Measurement();
measurement.initFromRec(meas.MEASUREMENTS[k],codeArray);
measureArray.push(measurement);
}if(measureArray.length>0){if(sortOption){measureArray.sort(sortOption);
}else{measureArray.sort(CERN_MEASUREMENT_BASE_O1.SortByEffectiveDateDesc);
}mapObjects.push(mapObject);
}}}}return mapObjects;
},LoadMeasurementDataArray:function(recordData,personnelArray,codeArray,sortOption){var measureArray=getMeasurementDataArray(recordData,personnelArray,codeArray);
if(measureArray.length>0){if(sortOption){measureArray.sort(sortOption);
}else{measureArray.sort(CERN_MEASUREMENT_BASE_O1.SortByEffectiveDateDesc);
}}return measureArray;
},LoadMeasurementDataArrayNoSort:function(recordData,personnelArray,codeArray){return getMeasurementDataArray(recordData,personnelArray,codeArray);
},SortByEffectiveDateDesc:function(a,b){if(a.getDateTime()>b.getDateTime()){return -1;
}else{if(a.getDateTime()<b.getDateTime()){return 1;
}}return 0;
}};
}();
function ABDComponentStyle(){this.initByNamespace("abd");
}ABDComponentStyle.inherits(ComponentStyle);
function ABDComponent(criterion){this.setCriterion(criterion);
this.setStyles(new ABDComponentStyle());
this.setComponentLoadTimerName("USR:MPG.ABD.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.ABD.O1 - render component");
this.setIncludeLineNumber(false);
ABDComponent.method("setAgeDays",function(value){this.m_ageDay=value;
});
ABDComponent.method("getAgeDays",function(){return((this.m_ageDay==null)?365:this.m_ageDay);
});
ABDComponent.method("getApneaEventCds",function(){return(this.m_apnea);
});
ABDComponent.method("setApneaEventCds",function(value){this.m_apnea=value;
});
ABDComponent.method("addApneaEventCd",function(value){if(this.m_apnea==null){this.m_apnea=[];
}this.m_apnea.push(value);
});
ABDComponent.method("getApneaNomenIds",function(){return(this.m_anomen);
});
ABDComponent.method("setApneaNomenIds",function(value){this.m_anomen=value;
});
ABDComponent.method("addApneaNomenId",function(value){if(this.m_anomen==null){this.m_anomen=[];
}this.m_anomen.push(value);
});
ABDComponent.method("getBradyEventCds",function(){return(this.m_brady);
});
ABDComponent.method("setBradyEventCds",function(value){this.m_brady=value;
});
ABDComponent.method("addBradyEventCd",function(value){if(this.m_brady==null){this.m_brady=[];
}this.m_brady.push(value);
});
ABDComponent.method("getBradyNomenIds",function(){return(this.m_bnomen);
});
ABDComponent.method("setBradyNomenIds",function(value){this.m_bnomen=value;
});
ABDComponent.method("addBradyNomenId",function(value){if(this.m_bnomen==null){this.m_bnomen=[];
}this.m_bnomen.push(value);
});
ABDComponent.method("getDesatEventCds",function(){return(this.m_desat);
});
ABDComponent.method("setDesatEventCds",function(value){this.m_desat=value;
});
ABDComponent.method("addDesatEventCd",function(value){if(this.m_desat==null){this.m_desat=[];
}this.m_desat.push(value);
});
ABDComponent.method("getDesatNomenIds",function(){return(this.m_dnomen);
});
ABDComponent.method("setDesatNomenIds",function(value){this.m_dnomen=value;
});
ABDComponent.method("addDesatNomenId",function(value){if(this.m_dnomen==null){this.m_dnomen=[];
}this.m_dnomen.push(value);
});
ABDComponent.method("getO2SatCds",function(){return(this.m_o2);
});
ABDComponent.method("setO2SatCds",function(value){this.m_o2=value;
});
ABDComponent.method("addO2SatCd",function(value){if(this.m_o2==null){this.m_o2=[];
}this.m_o2.push(value);
});
ABDComponent.method("getHRCds",function(){return(this.m_hr);
});
ABDComponent.method("setHRCds",function(value){this.m_hr=value;
});
ABDComponent.method("addHRCd",function(value){if(this.m_hr==null){this.m_hr=[];
}this.m_hr.push(value);
});
ABDComponent.method("getSkinColorCds",function(){return(this.m_skin);
});
ABDComponent.method("setSkinColorCds",function(value){this.m_skin=value;
});
ABDComponent.method("addSkinColorCd",function(value){if(this.m_skin==null){this.m_skin=[];
}this.m_skin.push(value);
});
ABDComponent.method("getActivityCds",function(){return(this.m_act);
});
ABDComponent.method("setActivityCds",function(value){this.m_act=value;
});
ABDComponent.method("addActivityCd",function(value){if(this.m_act==null){this.m_act=[];
}this.m_act.push(value);
});
ABDComponent.method("getPositionCds",function(){return(this.m_pos);
});
ABDComponent.method("setPositionCds",function(value){this.m_pos=value;
});
ABDComponent.method("addPositionCd",function(value){if(this.m_pos==null){this.m_pos=[];
}this.m_pos.push(value);
});
ABDComponent.method("getStimulationCds",function(){return(this.m_stim);
});
ABDComponent.method("setStimulationCds",function(value){this.m_stim=value;
});
ABDComponent.method("addStimulationCd",function(value){if(this.m_stim==null){this.m_stim=[];
}this.m_stim.push(value);
});
ABDComponent.method("getDurationCds",function(){return(this.m_dur);
});
ABDComponent.method("setDurationCds",function(value){this.m_dur=value;
});
ABDComponent.method("addDurationCd",function(value){if(this.m_dur==null){this.m_dur=[];
}this.m_dur.push(value);
});
ABDComponent.method("InsertData",function(){CERN_ABD_O1.GetABDEvents(this);
});
ABDComponent.method("HandleSuccess",function(recordData){CERN_ABD_O1.RenderABD(this,recordData);
});
}ABDComponent.inherits(MPageComponent);
var CERN_ABD_O1=function(){return{RenderABD:function(component,recordData){var rowCnt=0,rowClass="",countText="",sHTML="",jsHTML=[],nameSpace=component.getStyles().getNameSpace();
var apneaCds=component.getApneaEventCds();
var apneaIds=component.getApneaNomenIds();
var bradyCds=component.getBradyEventCds();
var bradyIds=component.getBradyNomenIds();
var desatCds=component.getDesatEventCds();
var desatIds=component.getDesatNomenIds();
var o2Cds=component.getO2SatCds();
var hrCds=component.getHRCds();
var skinCds=component.getSkinColorCds();
var actCds=component.getActivityCds();
var posCds=component.getPositionCds();
var stimCds=component.getStimulationCds();
var durCds=component.getDurationCds();
if(recordData.CNT>0){jsHTML.push("<div class='",MP_Util.GetContentClass(component,recordData.CNT),"'><table class='abd-table'><thead><tr class='hdr'><th style='width:90px'>Date/Time</th>");
if(apneaCds!=null||bradyCds!=null||desatCds!=null){jsHTML.push("<th style='width:40px'>Event</th>");
}if(o2Cds!=null){jsHTML.push("<th style='width:40px'>O2 Sat</th>");
}if(hrCds!=null){jsHTML.push("<th style='width:30px'>HR</th>");
}if(skinCds!=null){jsHTML.push("<th>Skin Color</th>");
}if(actCds!=null){jsHTML.push("<th>Activity</th>");
}if(posCds!=null){jsHTML.push("<th>Position</th>");
}if(stimCds!=null){jsHTML.push("<th>Stimulation</th>");
}if(durCds!=null){jsHTML.push("<th style='width:60px'>Duration</th>");
}jsHTML.push("</tr></thead><tbody>");
for(var i=0;
i<recordData.CNT;
i++){rowCnt++;
if(rowCnt%2){rowClass="odd";
}else{rowClass="even";
}var dataElem=recordData.QUAL[i];
var resultDtTm=new Date();
resultDtTm.setISO8601(dataElem.RAW_DT_TM);
var dataDtTm=resultDtTm.format("longDateTime2");
var hvrDtTm=resultDtTm.format("longDateTime3");
jsHTML.push("<tr class='",rowClass,"'><td class='date-time'>",dataDtTm,"</td>");
if(apneaCds!=null||bradyCds!=null||desatCds!=null){jsHTML.push("<td class='result'>",dataElem.ABD_EVENT,"</td>");
}if(o2Cds!=null){jsHTML.push("<td class='result'>",dataElem.O2_SAT,"</td>");
}if(hrCds!=null){jsHTML.push("<td class='result'>",dataElem.HEART_RATE,"</td>");
}if(skinCds!=null){jsHTML.push("<td class='result'>",dataElem.SKIN_COLOR,"</td>");
}if(actCds!=null){jsHTML.push("<td class='result'>",dataElem.ACTIVITY,"</td>");
}if(posCds!=null){jsHTML.push("<td class='result'>",dataElem.POSITION,"</td>");
}if(stimCds!=null){jsHTML.push("<td class='result'>",dataElem.STIMULATION,"</td>");
}if(durCds!=null){jsHTML.push("<td class='result'>",dataElem.DURATION,"</td>");
}jsHTML.push("</tr>");
}jsHTML.push("</tbody></table></div>");
}countText="";
sHTML=jsHTML.join("");
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
return;
},GetABDEvents:function(component){var criterion=component.getCriterion();
var lookBackUnits=component.getLookbackUnits();
var lookBackUnitTypeFlag=component.getLookbackUnitTypeFlag();
var ageDays=component.getAgeDays();
var apneaCds=component.getApneaEventCds();
var apneaIds=component.getApneaNomenIds();
var bradyCds=component.getBradyEventCds();
var bradyIds=component.getBradyNomenIds();
var desatCds=component.getDesatEventCds();
var desatIds=component.getDesatNomenIds();
var o2Cds=component.getO2SatCds();
var hrCds=component.getHRCds();
var skinCds=component.getSkinColorCds();
var actCds=component.getActivityCds();
var posCds=component.getPositionCds();
var stimCds=component.getStimulationCds();
var durCds=component.getDurationCds();
var sApneaCds="";
sApneaCds=formatCodes(apneaCds);
var sApneaIds="";
sApneaIds=formatCodes(apneaIds);
var sBradyCds="";
sBradyCds=formatCodes(bradyCds);
var sBradyIds="";
sBradyIds=formatCodes(bradyIds);
var sDesatCds="";
sDesatCds=formatCodes(desatCds);
var sDesatIds="";
sDesatIds=formatCodes(desatIds);
var sO2Cds="";
sO2Cds=formatCodes(o2Cds);
var sHRCds="";
sHRCds=formatCodes(hrCds);
var sSkinCds="";
sSkinCds=formatCodes(skinCds);
var sActivityCds="";
sActivityCds=formatCodes(actCds);
var sPosCds="";
sPosCds=formatCodes(posCds);
var sStimCds="";
sStimCds=formatCodes(stimCds);
var sDurCds="";
sDurCds=formatCodes(durCds);
var sendArr=["^MINE^",criterion.person_id+".0",((component.getScope()==2)?criterion.encntr_id+".0":"0.0"),lookBackUnits,lookBackUnitTypeFlag,ageDays,sApneaCds,sApneaIds,sBradyCds,sBradyIds,sDesatCds,sDesatIds,sO2Cds,sHRCds,sSkinCds,sActivityCds,sPosCds,sStimCds,sDurCds];
MP_Core.XMLCclRequestWrapper(component,"MP_GET_ABD",sendArr,true);
return;
}};
function formatCodes(codeArray){var codeString="0.0";
if((codeArray!=null)&&(codeArray.length>0)){codeString="value(";
for(x=0;
x<codeArray.length;
x++){if(x>0){codeString+=",";
}codeString+=codeArray[x]+".0";
}codeString+=")";
}return(codeString);
}}();
function CustomComponentStyle(){this.initByNamespace("cust");
}CustomComponentStyle.inherits(ComponentStyle);
function CustomComponent(criterion){var m_compNamespace="";
var m_compOptionsObjName="";
var m_custCompRef=null;
this.setCriterion(criterion);
this.setStyles(new CustomComponentStyle());
this.setComponentLoadTimerName("USR:MPG.CUSTOM_COMP.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.CUSTOM_COMP.O1 - render component");
CustomComponent.method("setComponentNamespace",function(value){this.m_compNamespace=value;
});
CustomComponent.method("getComponentNamespace",function(){return this.m_compNamespace;
});
CustomComponent.method("setComponentOptionsObjectName",function(value){this.m_compOptionsObjName=value;
});
CustomComponent.method("getComponentOptionsObjectName",function(){return this.m_compOptionsObjName;
});
CustomComponent.method("setCustomComponentReference",function(value){this.m_custCompRef=value;
});
CustomComponent.method("getCustomComponentReference",function(){return this.m_custCompRef;
});
CustomComponent.method("InsertData",function(){CERN_CUSTOM_COMP_O1.GetCustomCompTable(this);
});
CustomComponent.method("openTab",function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
this.InsertData();
});
}CustomComponent.inherits(MPageComponent);
var CERN_CUSTOM_COMP_O1=function(){return{GetCustomCompTable:function(component){var criterion=component.getCriterion();
var compId;
var compNamespace;
var custComp;
var callback;
var optionsObjectName;
var options;
try{compNamespace=component.getComponentNamespace();
eval("custComp = new "+compNamespace+"();");
}catch(err){if(compNamespace){err=new Error(i18n.discernabu.customcomponents_o1.INVALID_NAMESPACE.replace("{0}",compNamespace));
}else{err=new Error(i18n.discernabu.customcomponents_o1.UNDEFINED_NAMESPACE);
}MP_Util.LogJSError(err,component,"customcomp.js","GetCustomCompTable");
CERN_CUSTOM_COMP_O1.FinalizeCustomComp(component,err);
return;
}try{optionsObjectName=component.getComponentOptionsObjectName();
if(optionsObjectName){eval("options = "+optionsObjectName+";");
}else{options=null;
}}catch(err){if(!options){err=new Error(i18n.discernabu.customcomponents_o1.INVALID_OPTIONS.replace("{0}",optionsObjectName));
}MP_Util.LogJSError(err,component,"customcomp.js","GetCustomCompTable");
CERN_CUSTOM_COMP_O1.FinalizeCustomComp(component,err);
return;
}try{compId=component.getStyles().getId();
custComp.setOption("id",compId);
custComp.setOption("parentComp",component);
custComp.setProperty("compId",component.getComponentId());
custComp.setProperty("personId",criterion.person_id);
custComp.setProperty("userId",criterion.provider_id);
custComp.setProperty("encounterId",criterion.encntr_id);
custComp.setProperty("pprCd",criterion.ppr_cd);
custComp.setProperty("staticContent",criterion.static_content);
custComp.setProperty("positionCd",criterion.position_cd);
custComp.setProperty("categoryMean",criterion.category_mean);
custComp.setProperty("viewableEncounters",criterion.getPersonnelInfo().getViewableEncounters());
custComp.setProperty("headerTitle",component.getLabel());
custComp.setProperty("headerOverflowState",component.isScrollingEnabled());
custComp.setTarget(component.getSectionContentNode());
MPage.addCustomComp(custComp);
component.setCustomComponentReference(custComp);
callback=function(custCompRef){CERN_CUSTOM_COMP_O1.FinalizeCustomComp(component,null);
};
custComp.generate(custComp.getTarget(),callback,options);
}catch(err){MP_Util.LogJSError(err,component,"customcomp.js","GetCustomCompTable");
CERN_CUSTOM_COMP_O1.FinalizeCustomComp(component,err);
}},FinalizeCustomComp:function(component,error){if(error){var countText="";
var errMsg=["<b>",i18n.ERROR_OCCURED,"</b><br /><ul><li>",error.description,"</li></ul>"];
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
}else{var rootComponentNode=component.getRootComponentNode();
var totalCount=Util.Style.g("sec-total",rootComponentNode,"span");
var custCompRef=component.getCustomComponentReference();
if(custCompRef.getProperty("headerSubTitle")!=="undefined"){totalCount[0].innerHTML=custCompRef.getProperty("headerSubTitle");
}else{totalCount[0].innerHTML="";
}}}};
}();
var CERN_DEMO_BANNER_O1=function(){return{GetPatientDemographics:function(demoBanner,criterion){timerPatDemLoad=MP_Util.CreateTimer("USR:MPG.DEMO_BANNER.O1 - load component");
if(timerPatDemLoad){timerPatDemLoad.Start();
}var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){var timer=MP_Util.CreateTimer("ENG:MPG.DEMO_BANNER.O1 – render component");
MP_Util.LogScriptCallInfo(null,this,"demobanner.js","GetPatientDemographics");
try{var age="";
var birthDate="";
var birthDtTm=new Date();
var codeArray=null;
var deceasedDate="";
var deceasedDtTm=new Date();
var enCodeArray=[];
var finNbr="";
var isolation="";
var jsHTML=[];
var jsonText=null;
var localBirthDtTm=new Date();
var localDeceasedDtTm=new Date();
var mrnNbr="";
var nameFull="";
var patInfo=null;
var ptCodeArray=[];
var sexDisp="";
var sexObj=null;
var visitReason="";
jsonText=JSON.parse(this.responseText);
codeArray=MP_Util.LoadCodeListJSON(jsonText.RECORD_DATA.CODES);
patInfo=jsonText.RECORD_DATA.DEMOGRAPHICS.PATIENT_INFO;
nameFull=patInfo.PATIENT_NAME.NAME_FULL;
if(patInfo.ABS_BIRTH_DT_TM!==""){var regexp="([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
var d=patInfo.ABS_BIRTH_DT_TM.match(new RegExp(regexp));
birthDtTm=new Date(d[1],d[3]-1,d[5],d[7],d[8],d[10]);
birthDate=birthDtTm.format("shortDate2");
}else{if(patInfo.BIRTH_DT_TM!==""){birthDtTm.setISO8601(patInfo.BIRTH_DT_TM);
birthDate=birthDtTm.format("shortDate2");
}}if(patInfo.DECEASED_DT_TM!==""){deceasedDtTm.setISO8601(patInfo.DECEASED_DT_TM);
deceasedDate=deceasedDtTm.format("shortDate2");
}if(patInfo.LOCAL_DECEASED_DT_TM&&patInfo.LOCAL_BIRTH_DT_TM){localBirthDtTm.setISO8601(patInfo.LOCAL_BIRTH_DT_TM);
localDeceasedDtTm.setISO8601(patInfo.LOCAL_DECEASED_DT_TM);
age=MP_Util.CalcAge(localBirthDtTm,localDeceasedDtTm);
}else{if(patInfo.LOCAL_BIRTH_DT_TM){localBirthDtTm.setISO8601(patInfo.LOCAL_BIRTH_DT_TM);
age=MP_Util.CalcAge(localBirthDtTm);
}}var encntrInfo=jsonText.RECORD_DATA.DEMOGRAPHICS.ENCOUNTER_INFO;
for(var j=0,e=encntrInfo.length;
j<e;
j++){visitReason=encntrInfo[j].REASON_VISIT;
for(var i=0,l=encntrInfo[j].ALIAS.length;
i<l;
i++){enCodeArray[i]=MP_Util.GetValueFromArray(encntrInfo[j].ALIAS[i].ALIAS_TYPE_CD,codeArray);
if(enCodeArray[i].meaning=="FIN NBR"){finNbr=encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
}if(enCodeArray[i].meaning=="MRN"){mrnNbr=encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
}}if(encntrInfo[j].ISOLATION_CD>0){var isoObj=MP_Util.GetValueFromArray(encntrInfo[j].ISOLATION_CD,codeArray);
isolation=isoObj.display;
}}aliasArry=jsonText.RECORD_DATA.DEMOGRAPHICS.PATIENT_INFO.ALIAS;
if(mrnNbr===""){for(var i=0,l=aliasArry.length;
i<l;
i++){ptCodeArray[i]=MP_Util.GetValueFromArray(aliasArry[i].ALIAS_TYPE_CD,codeArray);
if(ptCodeArray[i].meaning=="MRN"){mrnNbr=aliasArry[i].FORMATTED_ALIAS;
}}}sexObj=MP_Util.GetValueFromArray(patInfo.SEX_CD,codeArray);
sexDisp=(sexObj)?sexObj.display:i18n.UNKNOWN;
jsHTML.push("<div id='demobanner'",criterion.category_mean,"><dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>",i18n.NAME,"</span></dt><dd class='dmg-pt-name'><span>",nameFull,"</span></dd><dt class='dmg-sex-lbl'><span>",i18n.SEX," ","</span></dt><dd class='dmg-sex'><span>",sexDisp," ","</span></dd><dt class='dmg-age-lbl'><span>",i18n.AGE,"</span></dt>");
if(deceasedDate!==""){jsHTML.push("<span class='dmg-deceased'>",age,"</span><h4 class='det-hd'><span class='dmg-info'>",i18n.AGE,"</span></h4><div class='hvr'><dl class='dmg-info'><dt class='dmg-info'><span >",i18n.DECEASED,":</span></dt><dd class='dmg-info'><span>",deceasedDate,"</span></dd></dl></div>");
}else{jsHTML.push("<dd class='dmg-age'><span>",age,"</span></dd>");
}jsHTML.push("<dt><span>",i18n.DOB,":</span></dt><dd class='dmg-dob'><span>",birthDate,"</span></dd><dt><span>",i18n.MRN,":</span></dt><dd class='dmg-mrn'><span>",mrnNbr,"</span></dd><dt><span>",i18n.FIN,":</span></dt><dd class='dmg-fin'><span>",finNbr,"</span></dd><dt><span>",i18n.ISOLATION,":</span></dt><dd class='dmg-isolation'><span>",isolation,"</span></dd><dt><span>",i18n.VISIT_REASON,":</span></dt><dd class='dmg-rfv'><span>",visitReason,"</span></dd></dl></div>");
demoBanner.innerHTML=jsHTML.join("");
initHoversDemoBanner("dmg-deceased",_g("demobanner"+criterion.category_mean));
}catch(err){MP_Util.LogJSError(err,null,"demobanner.js","GetPatientDemographics");
}finally{if(timer){timer.Stop();
}if(timerPatDemLoad){timerPatDemLoad.Stop();
}}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_GET_PATIENT_DEMO",0);
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0");
info.send(sendAr.join(","));
}};
function initHoversDemoBanner(trg,par){gen=Util.Style.g(trg,par,"SPAN");
for(var i=0,l=gen.length;
i<l;
i++){var m=gen[i];
if(m){var nm=Util.gns(Util.gns(m));
if(nm){if(Util.Style.ccss(nm,"hvr")){hs(m,nm);
}}}}}}();
function DiagnosticsComponentStyle(){this.initByNamespace("dg");
}DiagnosticsComponentStyle.inherits(ComponentStyle);
function DiagnosticsComponent(criterion){this.setCriterion(criterion);
this.setLookBackDropDown(true);
this.setStyles(new DiagnosticsComponentStyle());
this.setComponentLoadTimerName("USR:MPG.DIAGNOSTICS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.DIAGNOSTICS.O1 - render component");
this.setIncludeLineNumber(true);
DiagnosticsComponent.method("InsertData",function(){var nameSpace=new CERN_DIAGNOSTICS_O1();
nameSpace.GetDiagnostics(this);
});
DiagnosticsComponent.method("setResultStatusCodes",function(value){this.m_resultStatusCodes=value;
});
DiagnosticsComponent.method("addResultStatusCode",function(value){if(this.m_resultStatusCodes==null){this.m_resultStatusCodes=[];
}this.m_resultStatusCodes.push(value);
});
DiagnosticsComponent.method("getResultStatusCodes",function(){if(this.m_resultStatusCodes!=null){return this.m_resultStatusCodes;
}else{if(this.m_resultStatusMeanings!=null){var resStatusCodeSet=MP_Util.GetCodeSet(8,false);
if(this.m_resultStatusMeanings&&this.m_resultStatusMeanings.length>0){for(var x=this.m_resultStatusMeanings.length;
x--;
){var code=MP_Util.GetCodeByMeaning(resStatusCodeSet,this.m_resultStatusMeanings[x]);
if(code!=null){this.addResultStatusCode(code.codeValue);
}}}}}return this.m_resultStatusCodes;
});
DiagnosticsComponent.method("addResultStatusMeaning",function(value){if(this.m_resultStatusMeanings==null){this.m_resultStatusMeanings=[];
}this.m_resultStatusMeanings.push(value);
});
DiagnosticsComponent.method("setResultStatusMeanings",function(value){this.m_resultStatusMeanings=value;
});
}DiagnosticsComponent.inherits(MPageComponent);
var CERN_DIAGNOSTICS_O1=function(){var isErrorLoadingData=false;
var isDataFound=false;
var totalResultCount=0;
var m_comp=null;
var m_contentNode=null;
var m_rootComponentNode=null;
var m_threadCount=0;
return{GetDiagnostics:function(component){m_comp=component;
var styles=component.getStyles();
m_rootComponentNode=component.getRootComponentNode();
m_contentNode=component.getSectionContentNode();
var groups=component.getGroups();
var xl=(groups!=null)?groups.length:0;
m_threadCount=xl;
CreateInfoHeader(m_contentNode);
if(component.getDateFormat()==3){CreateWithinHeader(m_contentNode);
}for(var x=0;
x<xl;
x++){var group=groups[x];
var subSection=CreateSubHeader(group.getGroupName());
GetVariousAssessment(group,subSection);
}if(m_threadCount===0){FinalizeComponent();
}}};
function CreateWithinHeader(contentNode){var dl=Util.cep("dl",{className:"dg-info-hdr hdr"});
var dd=Util.cep("dd",{className:"dg-name-hd"});
Util.ac(dd,dl);
var span=Util.cep("span");
Util.ac(span,dd);
var txtNbsp=document.createTextNode(String.fromCharCode(160));
Util.ac(txtNbsp,span);
var ddWithin=Util.cep("dd",{className:"dg-within-hd"});
Util.ac(ddWithin,dl);
var spanWithin=Util.cep("span");
Util.ac(spanWithin,ddWithin);
var txtWithin=document.createTextNode(i18n.WITHIN);
Util.ac(txtWithin,spanWithin);
Util.ac(dl,contentNode);
}function CreateInfoHeader(contentNode){var dl=Util.cep("dl",{className:"dg-info-hdr hdr"});
var dd=Util.cep("dd",{className:"dg-name-hd"});
Util.ac(dd,dl);
var span=Util.cep("span");
Util.ac(span,dd);
var txtNbsp=document.createTextNode(String.fromCharCode(160));
Util.ac(txtNbsp,span);
var ddWithin=Util.cep("dd",{className:"dg-within-hd"});
Util.ac(ddWithin,dl);
var spanWithin=Util.cep("span");
Util.ac(spanWithin,ddWithin);
var txtWithin=document.createTextNode(i18n.DATE_TIME);
Util.ac(txtWithin,spanWithin);
var ddStat=Util.cep("dd",{className:"dg-stat-hd"});
Util.ac(ddStat,dl);
var spanStat=Util.cep("span");
Util.ac(spanStat,ddStat);
var txtStat=document.createTextNode(i18n.STATUS);
Util.ac(txtStat,spanStat);
Util.ac(dl,contentNode);
}function CreateSubHeader(label){var subSec=Util.cep("div",{className:"sub-sec"});
var h3=Util.cep("h3",{className:"sub-sec-hd"});
subSec.appendChild(h3);
var spanTgl=Util.cep("span",{className:"sub-sec-hd-tgl",title:i18n.HIDE_SECTION});
h3.appendChild(spanTgl);
var TgltxtNode=document.createTextNode("-");
spanTgl.appendChild(TgltxtNode);
var spanTitle=Util.cep("span",{className:"sub-sec-title"});
h3.appendChild(spanTitle);
var labelTextNode=document.createTextNode(label);
spanTitle.appendChild(labelTextNode);
m_contentNode.appendChild(subSec);
return(subSec);
}function GetDocResults(group,subSection,subSecTitle,events){var ar=[];
var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){MP_Util.LogScriptCallInfo(null,this,"diagnostics.js","GetDocResults");
m_threadCount--;
var strHTML="",sDate="",sDateHvr="",sDisplay="",sResult="",sStatus="";
var jsonEval=JSON.parse(this.responseText);
var subCnt=0;
if(jsonEval.RECORD_DATA.STATUS_DATA.STATUS=="S"){isDataFound=true;
var codeArray=MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
ar.push("<div class='content-body'>");
var docs=jsonEval.RECORD_DATA.DOCS;
docs.sort(SortByEffectiveDate);
for(var i=0,l=docs.length;
i<l;
i++){var ce=docs[i];
var link="";
if(ce.EVENT_CD!==""){var eventObj=MP_Util.GetValueFromArray(ce.EVENT_CD,codeArray);
sDisplay=eventObj.display;
link=MP_Util.CreateClinNoteLink(ce.PERSON_ID+".0",ce.ENCNTR_ID+".0",ce.EVENT_ID+".0",sDisplay,ce.VIEWER_TYPE,ce.PARENT_EVENT_ID+".0");
}if(ce.EFFECTIVE_DATE!==""){var dateTime=new Date();
dateTime.setISO8601(ce.EFFECTIVE_DATE);
sDate=MP_Util.DisplayDateByOption(m_comp,dateTime);
sDateHvr=dateTime.format("longDateTime3");
}if(ce.RESULT_STATUS_CD>0){var statusObj=MP_Util.GetValueFromArray(ce.RESULT_STATUS_CD,codeArray);
sStatus=statusObj.display;
}ar.push("<h3 class='info-hd'>",sDisplay,"</h3><dl class ='dg-info'><dt><span>"+i18n.DIAGNOSTIC+":</span></dt><dd class ='dg-name'><span>",link,"</span>");
if(statusObj.meaning=="MODIFIED"||statusObj.meaning=="ALTERED"){ar.push("<span class='res-modified'>&nbsp;</span>");
}ar.push("</dd><dt><span>",i18n.DATE_TIME,"</span></dt><dd class ='dg-within'>",sDate,"</dd><dt><span>",i18n.STATUS,":</span></dt><dd class='dg-stat'><span>",sStatus,"</span></dd><dd class='dg-image'>");
if(ce.IMAGE_URL!==""){var urlParam='javascript:MPAGES_SVC_EVENT("'+ce.IMAGE_URL+'",^MINE,$PAT_PersonId$^)';
ar.push("<a class='dg-image-found' href='",urlParam,"'>&nbsp;</a>");
}else{ar.push("&nbsp;");
}ar.push("</dd></dl>");
ar.push("<h4 class='det-hd'><span>",i18n.DIAGNOSTIC_DETAILS,"</span></h4><div class='hvr'><dl class='dg-det'><dt><span>",i18n.STUDY,":</span></dt><dd><span>",sDisplay,"</span></dd><dt><span>",i18n.DATE_TIME,":</span></dt><dd><span>",sDateHvr,"</span></dd></dl></div>");
subCnt++;
}ar.push("</div>");
strHTML=ar.join("");
subSecTitle[0].innerHTML=group.getGroupName()+" ("+subCnt+")";
totalResultCount+=subCnt;
var subContent=Util.cep("div",{className:"sub-sec-content"});
subSection.appendChild(subContent);
var contentBody=Util.cep("div",{className:"content-body"});
subContent.appendChild(contentBody);
contentBody.innerHTML=strHTML;
}else{if(jsonEval.RECORD_DATA.STATUS_DATA.STATUS=="Z"){subSecTitle[0].innerHTML=group.getGroupName()+" (0)";
var subContent1=Util.cep("div",{className:"sub-sec-content"});
subSection.appendChild(subContent1);
var contentBody1=Util.cep("div",{className:"content-body"});
subContent1.appendChild(contentBody1);
contentBody1.innerHTML="<div ><span class='res-none'>"+i18n.NO_RESULTS_FOUND+"</span> </div>";
}else{if(jsonEval.RECORD_DATA.STATUS_DATA.STATUS!="Z"){isErrorLoadingData=true;
}}}if(m_threadCount===0){FinalizeComponent();
}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
var criterion=m_comp.getCriterion();
info.open("GET","MP_RETRIEVE_DOCUMENTS_JSON");
var encntrOption=(m_comp.getScope()==2)?(criterion.encntr_id+".0"):"0.0";
var codes=m_comp.getResultStatusCodes();
var statusCodes=(codes!=null&&codes.length>0)?"value("+codes.join(",")+")":"0.0";
var eventCodes=(events!=null&&events.length>0)?"value("+events.join(",")+")":"0.0";
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",encntrOption,criterion.provider_id+".0",m_comp.getLookbackUnits(),eventCodes,statusCodes,criterion.ppr_cd+".0",m_comp.getLookbackUnitTypeFlag());
info.send(sendAr.join(","));
return;
}function GetVariousAssessment(group,subSection){var events=(group.getEventSets()!=null&&group.getEventSets().length>0)?group.getEventSets():null;
var subSecTitle=Util.Style.g("sub-sec-title",subSection,"SPAN");
if(events==null){subSecTitle[0].innerHTML=group.getGroupName()+" (0)";
m_threadCount--;
return;
}GetDocResults(group,subSection,subSecTitle,events);
}function SortByEffectiveDate(a,b){if(a.EFFECTIVE_DATE>b.EFFECTIVE_DATE){return -1;
}else{if(a.EFFECTIVE_DATE<b.EFFECTIVE_DATE){return 1;
}else{return 0;
}}}function FinalizeComponent(){var styles=m_comp.getStyles();
var totalCount=Util.Style.g("sec-total",m_rootComponentNode,"span");
var sResultText="";
if(isErrorLoadingData){m_contentNode.innerHTML=MP_Util.HandleErrorResponse(styles.getNameSpace());
}else{if(totalResultCount===0){sResultText=MP_Util.CreateTitleText(m_comp,totalResultCount);
m_contentNode.innerHTML=MP_Util.HandleNoDataResponse(styles.getNameSpace());
}else{sResultText=MP_Util.CreateTitleText(m_comp,totalResultCount);
var contentHtml=[];
contentHtml.push("<div class ='",MP_Util.GetContentClass(m_comp,totalResultCount),"'>");
contentHtml.push(m_contentNode.innerHTML);
contentHtml.push("</div>");
m_contentNode.innerHTML=contentHtml.join("");
MP_Util.Doc.InitHovers(styles.getInfo(),m_contentNode);
MP_Util.Doc.InitSubToggles(m_contentNode,"sub-sec-hd-tgl");
MP_Util.Doc.InitScrolling(Util.Style.g("scrollable",m_contentNode,"div"),m_comp.getScrollNumber(),1.6);
}}totalCount[0].innerHTML=sResultText;
}};
function GrowthChartComponentStyle(){this.initByNamespace("gc");
}GrowthChartComponentStyle.inherits(ComponentStyle);
function GrowthChartComponent(criterion){var tabRefId=0;
var getFormCalled=false;
this.setCriterion(criterion);
this.setStyles(new GrowthChartComponentStyle());
this.setComponentLoadTimerName("USR:MPG.GROWTHCHART.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.GROWTHCHART.O1 - render component");
GrowthChartComponent.method("InsertData",function(){CERN_GROWTH_CHART_O1.GetGrowthChartTable(this);
});
GrowthChartComponent.method("HandleSuccess",function(recordData){tabRefId=recordData.PLUS_ADD_FORM.REF_ID;
CERN_GROWTH_CHART_O1.RenderComponent(this,recordData);
});
GrowthChartComponent.method("openTab",function(){if(tabRefId>0){var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+tabRefId+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"growthchart.js","openTab");
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"GrowthChart");
}});
CERN_EventListener.addListener(this,EventListener.EVENT_CLINICAL_EVENT,this.InsertData,this);
}GrowthChartComponent.inherits(MPageComponent);
var CERN_GROWTH_CHART_O1=function(){var lookBackType=0;
var lookBackUnits=0;
return{GetGrowthChartTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
lookBackUnits=(component.getLookbackUnits()!=null)?component.getLookbackUnits():"0";
lookBackType=(component.getLookbackUnitTypeFlag()!=null)?component.getLookbackUnitTypeFlag():"-1";
var prsnlInfo=criterion.getPersonnelInfo();
var encntrs=prsnlInfo.getViewableEncounters();
var encntrVal=(encntrs)?"value("+encntrs+")":"0.0";
var encntrValScope=(component.getScope()==2)?"value("+criterion.encntr_id+".0 )":encntrVal;
var request=new MP_Core.ScriptRequest(component,component.getComponentRenderTimerName());
request.setProgramName("MP_RETRIEVE_GROWTH_CHART");
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",encntrValScope,lookBackUnits,lookBackType,criterion.ppr_cd+".0");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){component.HandleSuccess(reply.getResponse());
});
},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var criterion=component.getCriterion();
var precision=2;
var dtFormat=component.getDateFormat();
var jsGcHTML=[];
var gcHTML="";
var gcLen=0;
var gcHd="";
var countText="";
var gcObj=recordData.AGC;
gcLen=gcObj.length;
if(gcLen===0){countText=MP_Util.CreateTitleText(component,gcLen);
MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()),component,countText);
return;
}var patBirthDtTm=new Date();
patBirthDtTm.setISO8601(recordData.BIRTH_DT_TM);
var gcI18n=i18n.discernabu.gc_o1;
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var nf=new mp_formatter.NumericFormatter(MPAGE_LOCALE);
var latestText=dtFormat==3?gcI18n.LATEST+"<br/>"+gcI18n.WITHIN:gcI18n.LATEST;
var previousText=dtFormat==3?gcI18n.PREVIOUS+"<br/>"+gcI18n.WITHIN:gcI18n.PREVIOUS;
var contentClass=MP_Util.GetContentClass(component,gcLen);
var headerClass="hdr";
if(component.isScrollingEnabled()&&(gcLen>=component.getScrollNumber())){contentClass+=" gc-scrl-tbl";
headerClass+=" gc-scrl-tbl-hdr";
}jsGcHTML.push("<div class='",headerClass,"'><table class='gc-table'><thead ><tr><th class='gc-lbl'><span>&nbsp;</span></th><th class='gc-res1 '><span>",latestText,"</span></th><th class='gc-res2'><span>",previousText,"</span></th><th class='gc-res3'><span>",previousText,"</span></th></tr></thead></table></div>");
jsGcHTML.push("<div class='",contentClass,"'><table class='gc-table'>");
for(var i=0;
i<gcLen;
i++){var gcItem=gcObj[i];
var gcName=gcItem.EVENT_NAME;
var oddEven="odd";
if(i%2==0){oddEven="even";
}jsGcHTML.push("<tr class='",oddEven,"'><td class='gc-lbl'><span class='row-label'>",gcName,"</span></td>");
var gcMeas=gcItem.MEASUREMENTS;
var gcResLen=gcMeas.length;
if(gcResLen>3){gcResLen=3;
}for(var j=0;
j<3;
j++){if(j<gcResLen){var gcRes=gcMeas[j];
var gcVal=nf.format(gcRes.VALUE,"."+precision);
var gcPct=nf.format(gcRes.PERCENTILE,"."+precision);
var gcResultVal="";
var gcHvrVal="";
var resModified=(gcRes.MODIFIED_IND===1)?"<span class='res-modified'>&nbsp;</span>":"";
var measDate=new Date();
measDate.setISO8601(gcRes.MEAS_DT_TM);
var measAge=MP_Util.CalcAge(patBirthDtTm,measDate);
var measDateDisp=df.format(measDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
var faceUpMeasDateDisp=MP_Util.DisplayDateByOption(component,measDate);
gcResultVal=gcVal+" ("+gcPct+"%)";
gcHvrVal=gcVal;
jsGcHTML.push("<td class='gc-res",j+1,"'><dl class='gc-info'><dt><span>",gcName,"</span></dt><dd class='gc-res'>",GetEventViewerLink(criterion,gcRes.EVENT_ID,gcResultVal),resModified,"<br /><span class='within'>",faceUpMeasDateDisp,"</span></dd></dl><h4 class='det-hd'><span>",gcI18n.RESULT_DETAILS,":</span></h4><div class='hvr'><dl class='gc-det-age'>","<dt><span>",gcI18n.AGE,":</span></dt><dd>",measAge,"</dd>","<dt><span>",gcI18n.RESULT_DT_TM,":</span></dt><dd>",measDateDisp,"</dd>","<dt><span>",gcI18n.RESULT,":</span></dt><dd>",gcHvrVal+" "+gcRes.RESULT_UNITS,"</dd><dt><span>",gcI18n.PERCENTILE,":</span></dt><dd><span>",gcPct,"</span></dd><dt><span>",gcI18n.ZSCORE,":</span></dt><dd><span>",nf.format(gcRes.Z_SCORE),"</span></dd><dt><span>",gcI18n.STATUS,":</span></dt><dd><span>",gcRes.STATUS_DISP,"</span></dd></dl></div></td>");
}else{jsGcHTML.push("<td class='gc-res",j+1,"'><span>--</span></td>");
}}jsGcHTML.push("</tr>");
}jsGcHTML.push("</table>");
jsGcHTML.push("</div>");
gcHTML=jsGcHTML.join("");
countText=MP_Util.CreateTitleText(component,gcLen);
MP_Util.Doc.FinalizeComponent(gcHTML,component,countText);
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
function GetEventViewerLink(criterion,eventId,res){var ar=[];
var params=[criterion.person_id,criterion.encntr_id,eventId,'"EVENT"'];
ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(",params.join(","),"); return false;' href='#'>",res,"</a>");
return ar.join("");
}}();
function LaboratoryComponentStyle(){this.initByNamespace("lab");
}LaboratoryComponentStyle.inherits(ComponentStyle);
function LaboratoryComponent(criterion){this.setCriterion(criterion);
this.setLookBackDropDown(true);
this.setStyles(new LaboratoryComponentStyle());
this.setIncludeLineNumber(false);
this.m_graphLink=1;
this.m_showTodayValue=false;
this.m_primaryLabel=i18n.discernabu.laboratory_o1.PRIMARY_RESULTS;
this.m_errorLoadingData=false;
this.m_totalResultCount=0;
this.m_filterLabel="";
LaboratoryComponent.method("InsertData",function(){if(this.getGrouperFilterEventSets()){CERN_LABORATORY_O1.RefreshLabTable(this,this.getGrouperFilterLabel(),this.getGrouperFilterEventSets());
}else{CERN_LABORATORY_O1.GetLaboratoryTable(this);
}});
LaboratoryComponent.method("FilterRefresh",function(label,esArray){CERN_LABORATORY_O1.RefreshLabTable(this,label,esArray);
});
LaboratoryComponent.method("HandleSuccess",function(recordData){CERN_LABORATORY_O1.RenderComponent(this,recordData);
});
LaboratoryComponent.method("setGraphFlag",function(value){this.m_graphLink=value;
});
LaboratoryComponent.method("getGraphFlag",function(){return(this.m_graphLink);
});
LaboratoryComponent.method("setShowTodayValue",function(value){this.m_showTodayValue=value;
});
LaboratoryComponent.method("isShowTodayValue",function(){return(this.m_showTodayValue);
});
LaboratoryComponent.method("setPrimaryLabel",function(value){this.m_primaryLabel=value;
});
LaboratoryComponent.method("getPrimaryLabel",function(){return(this.m_primaryLabel);
});
LaboratoryComponent.method("refresh",function(event,args){if(args!="GrowthChart"){var contentNode=this.getSectionContentNode();
contentNode.innerHTML="";
this.InsertData();
}});
CERN_EventListener.addListener(this,EventListener.EVENT_CLINICAL_EVENT,this.refresh,this);
}LaboratoryComponent.inherits(MPageComponent);
var CERN_LABORATORY_O1=function(){return{GetLaboratoryTable:function(component){var m_comp=component;
var m_rootComponentNode=component.getRootComponentNode();
var m_contentNode=component.getSectionContentNode();
m_contentNode.innerHTML="";
var m_contentSecNode=Util.cep("div",{className:"content-body"});
var groups=component.getGroups();
var xl=(groups!==null)?groups.length:0;
CreateInfoHeader(component,m_contentNode,m_contentSecNode);
var eventSetArray=[];
var group;
var groupES;
var set={};
var esLength;
for(var x=0;
x<xl;
x++){group=groups[x];
groupES=group.getEventSets();
esLength=groupES.length;
for(var y=0;
y<esLength;
y++){set[groupES[y]]=true;
}}for(var eventSet in set){eventSetArray.push(eventSet);
}GetLaboratoryResults(eventSetArray,m_comp,m_contentNode,m_contentSecNode);
},RefreshLabTable:function(component,filterLabel,filterESArray){var m_comp=component;
m_comp.m_filterLabel=filterLabel;
var filterEventSetArray=MP_Util.CreateParamArray(filterESArray,1);
var eventCodeParam="0.0";
var criterion=m_comp.getCriterion();
var sEncntr=(m_comp.getScope()==2)?criterion.encntr_id+".0":"0.0";
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",sEncntr,criterion.provider_id+".0",criterion.ppr_cd+".0",3,"^^",filterEventSetArray,eventCodeParam,m_comp.getLookbackUnits(),m_comp.getLookbackUnitTypeFlag(),1);
var request=new MP_Core.ScriptRequest(m_comp,m_comp.getComponentLoadTimerName());
request.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(m_comp,request,CERN_LABORATORY_O1.RenderComponent);
},RenderComponent:function(reply){var m_comp=reply.getComponent();
var m_rootComponentNode=m_comp.getRootComponentNode();
m_comp.getSectionContentNode().innerHTML="";
var m_contentNode=m_comp.getSectionContentNode();
var m_contentSecNode=Util.cep("div",{className:"content-body"});
CreateInfoHeader(m_comp,m_contentNode,m_contentSecNode);
var sHTML="";
var countText="";
var subCnt=0;
var recordData=reply.getResponse();
switch(recordData.STATUS_DATA.STATUS){case"S":var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var mappedResults=CERN_LABORATORY_O1_UTIL.LoadMeasurementData(reply.getResponse(),personnelArray,codeArray,1);
var groupName=m_comp.m_filterLabel;
var groupSubsection=CreateSubHeader(groupName,false,m_contentSecNode);
var subSecTitle=Util.Style.g("sub-sec-title",groupSubsection,"SPAN");
var subContent=Util.cep("div",{className:"sub-sec-content"});
groupSubsection.appendChild(subContent);
var secContentBody=Util.cep("div",{className:"content-body"});
subContent.appendChild(secContentBody);
AssociateResultsToGroup(groupSubsection,groupName,mappedResults,subSecTitle[0],secContentBody,m_comp);
break;
case"Z":m_comp.m_totalResultCount=0;
break;
case"F":m_comp.m_errorLoadingData=true;
break;
}FinalizeComponent(m_comp,m_contentNode,m_contentSecNode);
}};
function CreateInfoHeader(component,secContentNode,contentSecNode){var m_comp=component;
var labI18n=i18n.discernabu.laboratory_o1;
var firstColumnHeader=component.isShowTodayValue()?labI18n.TODAY:labI18n.LATEST;
var contentHdr=Util.cep("div",{className:"content-hdr"});
Util.ac(contentHdr,secContentNode);
var ar=[];
var withinTH="";
if(m_comp.getDateFormat()==3){withinTH="<br /><span>"+labI18n.WITHIN+"</span>";
}ar.push("<table class='lab-table'><tr class='hdr'><th class='lab-lbl'><span>&nbsp;</span></th><th class='lab-res0'><span>",firstColumnHeader,"</span>",withinTH,"</th><th class='lab-res1'><span>",labI18n.PREVIOUS,"</span>",withinTH,"</th></tr></table>");
contentHdr.innerHTML=ar.join("");
Util.ac(contentSecNode,secContentNode);
}function FinalizeComponent(component,secContentNode,contentSecNode){var m_comp=component;
var m_rootComponentNode=m_comp.getRootComponentNode();
var styles=m_comp.getStyles();
var totalCount=Util.Style.g("sec-total",m_rootComponentNode,"span");
var sResultText="";
if(m_comp.m_errorLoadingData){secContentNode.innerHTML=MP_Util.HandleErrorResponse(styles.getNameSpace());
}else{if(m_comp.m_totalResultCount===0){sResultText=MP_Util.CreateTitleText(m_comp,m_comp.m_totalResultCount);
secContentNode.innerHTML=MP_Util.HandleNoDataResponse();
}else{sResultText=MP_Util.CreateTitleText(m_comp,m_comp.m_totalResultCount);
if(m_comp.m_totalResultCount>m_comp.getScrollNumber()&&m_comp.isScrollingEnabled()){Util.Style.acss(contentSecNode,"scrollable ");
var contentHdr=Util.Style.g("content-hdr",m_rootComponentNode,"div");
Util.Style.acss(contentHdr[0],"lab-scrl-tbl-hd");
}MP_Util.Doc.InitHovers(styles.getInfo(),contentSecNode);
MP_Util.Doc.InitSubToggles(contentSecNode,"sub-sec-hd-tgl");
if(m_comp.isScrollingEnabled()){MP_Util.Doc.InitScrolling(Util.Style.g("scrollable",m_rootComponentNode,"div"),m_comp.getScrollNumber(),"2.8");
}}}totalCount[0].innerHTML=sResultText;
}function CreateSubHeader(label,includeContentBody,contentSecNode){var subSec=Util.cep("div",{className:"sub-sec"});
var h3=Util.cep("h3",{className:"sub-sec-hd lab-sub-scrl-hd"});
subSec.appendChild(h3);
var spanTgl=Util.cep("span",{className:"sub-sec-hd-tgl",title:i18n.discernabu.laboratory_o1.COLLAPSE});
h3.appendChild(spanTgl);
var TgltxtNode=document.createTextNode("-");
spanTgl.appendChild(TgltxtNode);
var spanTitle=Util.cep("span",{className:"sub-sec-title"});
h3.appendChild(spanTitle);
var labelTextNode=document.createTextNode(label);
spanTitle.appendChild(labelTextNode);
if(includeContentBody){var subContent=Util.cep("div",{className:"sub-sec-content"});
subSec.appendChild(subContent);
var contentBody=Util.cep("div",{className:"content-body"});
subContent.appendChild(contentBody);
}contentSecNode.appendChild(subSec);
return(subSec);
}function GetLaboratoryResults(eventSets,component,secContentNode,contentSecNode){var m_comp=component;
var eventSetParams=MP_Util.CreateParamArray(eventSets,1);
var eventCodeParam="0.0";
var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){MP_Util.LogScriptCallInfo(m_comp,this,"laboratory.js","GetResultsByGroup");
var sHTML="";
var countText="";
var subCnt=0;
var jsonEval=JSON.parse(this.responseText);
var recordData=jsonEval.RECORD_DATA;
switch(recordData.STATUS_DATA.STATUS){case"S":var codeArray=MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(jsonEval.RECORD_DATA.PRSNL);
var mappedResults=CERN_LABORATORY_O1_UTIL.LoadMeasurementData(jsonEval,personnelArray,codeArray);
BuildLaboratoryComponent(mappedResults,m_comp,contentSecNode);
break;
case"Z":m_comp.m_totalResultCount=0;
break;
case"F":m_comp.m_errorLoadingData=true;
break;
}FinalizeComponent(m_comp,secContentNode,contentSecNode);
}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
var criterion=m_comp.getCriterion();
info.open("GET","MP_RETRIEVE_N_RESULTS_JSON");
var sEncntr=(m_comp.getScope()==2)?criterion.encntr_id+".0":"0.0";
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",sEncntr,criterion.provider_id+".0",criterion.ppr_cd+".0",3,"^^",eventSetParams,eventCodeParam,m_comp.getLookbackUnits(),m_comp.getLookbackUnitTypeFlag(),1);
info.send(sendAr.join(","));
}function BuildLaboratoryComponent(mapObjects,component,contentSecNode){var m_comp=component;
var groups=m_comp.getGroups();
var measurementHasMap=getMeasurementHashMap(mapObjects);
for(var x=0,xl=groups.length;
x<xl;
x++){var groupName=groups[x].getGroupName();
var groupEventSets=groups[x].getEventSets();
var sGroupName="";
var measAr=[];
var groupSubsection=CreateSubHeader(groupName,false,contentSecNode);
var subSecTitle=Util.Style.g("sub-sec-title",groupSubsection,"SPAN");
groupMeasurements=returnMeasureArrayByGroupEventSets(groupEventSets,measurementHasMap);
if(groupMeasurements.length===0){if(groupName===i18n.PRIMARY_RESULTS){groupName=m_comp.getPrimaryLabel();
}subSecTitle[0].innerHTML=groupName+" (0)";
}else{if(groupName===i18n.PRIMARY_RESULTS){sGroupName=m_comp.getPrimaryLabel();
var subContent=Util.cep("div",{className:"sub-sec-content"});
groupSubsection.appendChild(subContent);
var secContentBody=Util.cep("div",{className:"content-body"});
subContent.appendChild(secContentBody);
AssociateResultsToGroup(groupSubsection,sGroupName,groupMeasurements,subSecTitle[0],secContentBody,m_comp);
}else{var measurementSubsection;
var measurementSubsectionName="";
var subsectionMeasurements;
contentSecNode.removeChild(groupSubsection);
for(var x=0,xl=groupMeasurements.length;
x<xl;
x++){if(measurementSubsectionName!=groupMeasurements[x].name){subsectionMeasurements=[];
measurementSubsectionName=groupMeasurements[x].name;
measurementSubsection=CreateSubHeader(measurementSubsectionName,false,contentSecNode);
subSecTitle=Util.Style.g("sub-sec-title",measurementSubsection,"SPAN");
var subContent=Util.cep("div",{className:"sub-sec-content"});
measurementSubsection.appendChild(subContent);
var secContentBody=Util.cep("div",{className:"content-body"});
subContent.appendChild(secContentBody);
}subsectionMeasurements.push(groupMeasurements[x]);
if((x===(xl-1))||(x!==(xl-1)&&groupMeasurements[x+1].name!==measurementSubsectionName)){AssociateResultsToGroup(measurementSubsection,measurementSubsectionName,subsectionMeasurements,subSecTitle[0],secContentBody,m_comp);
}}}}}}function returnMeasureArrayByGroupEventSets(groupEventSets,mapObjects){var measurementArray=[];
for(var i=0;
i<groupEventSets.length;
i++){if(mapObjects[groupEventSets[i]]){for(var j=0;
j<mapObjects[groupEventSets[i]].length;
j++){measurementArray.push(mapObjects[groupEventSets[i]][j]);
}}}return measurementArray;
}function getMeasurementHashMap(mapObjects){var measHash=[];
for(var x=0;
x<mapObjects.length;
x++){if(!measHash[mapObjects[x].eventSetCode]){measHash[mapObjects[x].eventSetCode]=[];
}measHash[mapObjects[x].eventSetCode].push(mapObjects[x]);
}return measHash;
}function AssociateResultsToGroup(subSection,subGroupName,measurements,subSecTitle,secContentBody,component){var m_comp=component;
var compId=component.getComponentId();
var subCnt=measurements.length;
var timeNow=new Date();
var ar=[];
ar.push("<table class='lab-table'>");
for(var x=0,xl=measurements.length;
x<xl;
x++){var meas=measurements[x];
var latestMeasDateTime=meas.value[0].getDateTime();
var rowClass=(x%2)?"even":"odd";
ar.push("<tr class='",rowClass,"'>");
var m1=meas.value[0];
if(component.getGraphFlag()===1){ar.push("<td class='lab-lbl'><span class='row-label'><a onClick='MP_Util.GraphResults(",m1.getEventCode().codeValue,",",compId,",0.0);'>",m1.getEventCode().display,"</a></span></td>");
}else{ar.push("<td class='lab-lbl'><span class='row-label'>",m1.getEventCode().display,"</span></td>");
}if(component.isShowTodayValue()){if(timeNow.getFullYear()===latestMeasDateTime.getFullYear()&&timeNow.getMonth()===latestMeasDateTime.getMonth()&&timeNow.getDate()===latestMeasDateTime.getDate()){ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[0],0,m_comp));
ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[1],1,m_comp));
ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[2],2,m_comp));
}else{ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(null,0,m_comp));
ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[0],1,m_comp));
ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[1],2,m_comp));
}}else{ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[0],0,m_comp));
ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[1],1,m_comp));
ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[2],2,m_comp));
}ar.push("</tr>");
}ar.push("</table>");
secContentBody.innerHTML=ar.join("");
subSecTitle.innerHTML=subGroupName+" ("+subCnt+")";
m_comp.m_totalResultCount+=subCnt;
}}();
var CERN_LABORATORY_O1_UTIL=function(){var m_df=null;
return{LoadMeasurementData:function(jsonEval,personnelArray,codeArray,refreshInd){var mapObjects=[];
if(refreshInd){var results=jsonEval.RESULTS;
}else{var results=jsonEval.RECORD_DATA.RESULTS;
}for(var i=0,il=results.length;
i<il;
i++){if(results[i].CLINICAL_EVENTS.length>0){for(var j=0,jl=results[i].CLINICAL_EVENTS.length;
j<jl;
j++){var measureArray=[];
var mapObject=null;
if(results[i].EVENT_CD>0){mapObject=new MP_Core.MapObject(results[i].EVENT_CD,measureArray);
}else{mapObject=new MP_Core.MapObject(results[i].EVENT_SET_NAME,measureArray);
}if(results[i].EVENT_SET_CD&&results[i].EVENT_SET_CD>0){mapObject.eventSetCode=results[i].EVENT_SET_CD;
}var meas=results[i].CLINICAL_EVENTS[j];
for(var k=0,kl=meas.MEASUREMENTS.length;
k<kl;
k++){var measurement=new MP_Core.Measurement();
measurement.initFromRec(meas.MEASUREMENTS[k],codeArray);
measureArray.push(measurement);
}measureArray.sort(SortByEffectiveDate);
if(measureArray.length>0){mapObjects.push(mapObject);
}}}}return mapObjects;
},CreateResultCell:function(result,idx,component){var ar=[];
var labI18n=i18n.discernabu.laboratory_o1;
if(result==null){ar.push("<td class='lab-res",idx,"'><dl class='lab-info'><dt><span>",labI18n.VALUE,"</span></dt><dd class='lab-res'><span>--</span></dd></dl></td>");
}else{var obj=result.getResult();
var resStr=GetStringResult(obj,false);
var resHvrStr=GetStringResult(obj,true);
var display=result.getEventCode().display;
var dateTime=result.getDateTime();
var labNormalcy=CalculateNormalcy(result);
var within=MP_Util.CalcWithinTime(dateTime);
var resStatus=result.getStatus().display;
var sCritHigh="",sCritLow="",sNormHigh="",sNormLow="";
if(obj instanceof MP_Core.QuantityValue){var refRange=obj.getRefRange();
if(refRange!=null){if(refRange.getCriticalHigh()!=0||refRange.getCriticalLow()!=0){sCritHigh=refRange.getCriticalHigh();
sCritLow=refRange.getCriticalLow();
}if(refRange.getNormalHigh()!=0||refRange.getNormalLow()!=0){sNormHigh=refRange.getNormalHigh();
sNormLow=refRange.getNormalLow();
}}}var df=GetDateFormatter();
ar.push("<td class='lab-res",idx,"'><dl class='lab-info'><dt><span>",labI18n.VALUE,"</span></dt><dd class='lab-res'><span class='",labNormalcy,"'><span class='res-ind'>&nbsp;</span><span class='res-value'>",GetEventViewerLink(result,resStr),"</span>",MP_Util.Measurement.GetModifiedIcon(result),"</span>");
if(component.getDateFormat()!=4){ar.push("<br /><span class='within'>",MP_Util.DisplayDateByOption(component,dateTime),"</span>");
}ar.push("</dd></dl><h4 class='det-hd'><span>",labI18n.LABORATORY_DETAILS,"</span></h4><div class='hvr'><dl class='lab-det'><dt class='lab-det-type'><span>",display,":</span></dt><dd class='result'><span class='",labNormalcy,"'>",resHvrStr,"</span></dd><dt class='lab-det-type'><span>",labI18n.DATE_TIME,":</span></dt><dd class='result'><span>",df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR),"</span></dd><dt class='lab-det-type'><span>",labI18n.NORMAL_LOW,":</span></dt><dd class='result'><span>",sNormLow,"</span></dd><dt class='lab-det-type'><span>",labI18n.NORMAL_HIGH,":</span></dt><dd class='result'><span>",sNormHigh,"</span></dd><dt class='lab-det-type'><span>",labI18n.CRITICAL_LOW,":</span></dt><dd class='result'><span>",sCritLow,"</span></dd><dt class='lab-det-type'><span>",labI18n.CRITICAL_HIGH,":</span></dt><dd class='result'><span>",sCritHigh,"</span></dd><dt class='lab-det-type'><span>",labI18n.STATUS,":</span></dt><dd class='result'><span>",resStatus,"</span></dd></dl></div></td>");
}return ar.join("");
}};
function GetDateFormatter(){if(m_df==null){m_df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
}return m_df;
}function SortByEffectiveDate(a,b){if(a.getDateTime()>b.getDateTime()){return -1;
}else{if(a.getDateTime()<b.getDateTime()){return 1;
}else{return 0;
}}}function CreateHoverForMeasurement(measurement){var ar=[];
var labI18n=i18n.discernabu.laboratory_o1;
var obj=measurement.getResult();
var resStr=GetStringResult(obj,false);
var resHvrStr=GetStringResult(obj,true);
var display=measurement.getEventCode().display;
var dateTime=measurement.getDateTime();
var labNormalcy=CalculateNormalcy(measurement);
var sCritHigh="",sCritLow="",sNormHigh="",sNormLow="";
if(obj instanceof MP_Core.QuantityValue){var refRange=obj.getRefRange();
if(refRange!=null){if(refRange.getCriticalHigh()!=0||refRange.getCriticalLow()!=0){sCritHigh=refRange.getCriticalHigh();
sCritLow=refRange.getCriticalLow();
}if(refRange.getNormalHigh()!=0||refRange.getNormalLow()!=0){sNormHigh=refRange.getNormalHigh();
sNormLow=refRange.getNormalLow();
}}}var df=GetDateFormatter();
ar.push("<dt class='lab-res'><span>",display,":</span></dt><dd class='lab-det-type'><span class='",labNormalcy,"'>",resHvrStr,"</span></dd><dt class='lab-res'><span>",labI18n.DATE_TIME,":</span></dt><dd class='lab-det-type'><span>",df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR),"</span></dd><dt class='lab-res'><span>",labI18n.NORMAL_LOW,":</span></dt><dd class='lab-det-type'><span>",sNormLow,"</span></dd><dt class='lab-res'><span>",labI18n.NORMAL_HIGH,":</span></dt><dd class='lab-det-type'><span>",sNormHigh,"</span></dd><dt class='lab-res'><span>",labI18n.CRITICAL_LOW,":</span></dt><dd class='lab-det-type'><span>",sCritLow,"</span></dd><dt class='lab-res'><span>",labI18n.CRITICAL_HIGH,":</span></dt><dd class='lab-det-type'><span>",sCritHigh,"</span></dd>");
return(ar.join(""));
}function GetStringResult(result,includeUOM){var value="";
var df=GetDateFormatter();
if(result instanceof MP_Core.QuantityValue){if(includeUOM){value=result.toString();
}else{value=result.getValue();
}}else{if(result instanceof Date){value=df.format(result,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
}else{value=result;
}}return value;
}function CalculateCriticalRange(result){var rv="";
if(result instanceof MP_Core.QuantityValue){var rr=result.getRefRange();
if(rr!=null){rv=rr.toCriticalInlineString();
}}return rv;
}function CalculateNormalRange(result){var rv="";
if(result instanceof MP_Core.QuantityValue){var rr=result.getRefRange();
if(rr!=null){rv=rr.toNormalInlineString();
}}return rv;
}function CalculateNormalcy(result){var normalcy="res-normal";
var nc=result.getNormalcy();
if(nc!=null){var normalcyMeaning=nc.meaning;
if(normalcyMeaning!=null){if(normalcyMeaning==="LOW"){normalcy="res-low";
}else{if(normalcyMeaning==="HIGH"){normalcy="res-high";
}else{if(normalcyMeaning==="CRITICAL"||normalcyMeaning==="EXTREMEHIGH"||normalcyMeaning==="PANICHIGH"||normalcyMeaning==="EXTREMELOW"||normalcyMeaning==="PANICLOW"||normalcyMeaning==="VABNORMAL"||normalcyMeaning==="POSITIVE"){normalcy="res-severe";
}else{if(normalcyMeaning==="ABNORMAL"){normalcy="res-abnormal";
}}}}}}return normalcy;
}function GetEventViewerLink(measObject,res){var ar=[];
var params=[measObject.getPersonId(),measObject.getEncntrId(),measObject.getEventId(),'"EVENT"'];
ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(",params.join(","),"); return false;' href='#'>",res,"</a>");
return ar.join("");
}}();
function FutureOrdersComponentStyle(){this.initByNamespace("fo");
}FutureOrdersComponentStyle.inherits(ComponentStyle);
function FutureOrdersComponent(criterion){this.setCriterion(criterion);
this.setStyles(new FutureOrdersComponentStyle());
this.setComponentLoadTimerName("USR:MPG.FUTURE_ORDERS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.FUTURE_ORDERS.O1 - render component");
this.setScope(0);
this.firstOverdueValue=3;
this.firstOverdueUnit="M";
this.lastUpcomingValue=3;
this.lastUpcomingUnit="M";
this.m_tab1=null;
this.m_tabDisplay1=null;
this.m_tab2=null;
this.m_tabDisplay2=null;
this.m_tab3=null;
this.m_tabDisplay3=null;
this.m_tab4=null;
this.m_tabDisplay4=null;
this.m_tab5=null;
this.m_tabDisplay5=null;
this.m_tab6=null;
this.m_tabDisplay6=null;
this.m_tab7=null;
this.m_tabDisplay7=null;
this.m_tab8=null;
this.m_tabDisplay8=null;
this.m_tab9=null;
this.m_tabDisplay9=null;
this.m_allTabDisplay=null;
FutureOrdersComponent.method("setTab1",function(value){this.m_tab1=value;
});
FutureOrdersComponent.method("getTab1",function(){return this.m_tab1;
});
FutureOrdersComponent.method("setTabDisplay1",function(value){this.m_tabDisplay1=value;
});
FutureOrdersComponent.method("getTabDisplay1",function(){return this.m_tabDisplay1;
});
FutureOrdersComponent.method("setTab2",function(value){this.m_tab2=value;
});
FutureOrdersComponent.method("getTab2",function(){return this.m_tab2;
});
FutureOrdersComponent.method("setTabDisplay2",function(value){this.m_tabDisplay2=value;
});
FutureOrdersComponent.method("getTabDisplay2",function(){return this.m_tabDisplay2;
});
FutureOrdersComponent.method("setTab3",function(value){this.m_tab3=value;
});
FutureOrdersComponent.method("getTab3",function(){return this.m_tab3;
});
FutureOrdersComponent.method("setTabDisplay3",function(value){this.m_tabDisplay3=value;
});
FutureOrdersComponent.method("getTabDisplay3",function(){return this.m_tabDisplay3;
});
FutureOrdersComponent.method("setTab4",function(value){this.m_tab4=value;
});
FutureOrdersComponent.method("getTab4",function(){return this.m_tab4;
});
FutureOrdersComponent.method("setTabDisplay4",function(value){this.m_tabDisplay4=value;
});
FutureOrdersComponent.method("getTabDisplay4",function(){return this.m_tabDisplay4;
});
FutureOrdersComponent.method("setTab5",function(value){this.m_tab5=value;
});
FutureOrdersComponent.method("getTab5",function(){return this.m_tab5;
});
FutureOrdersComponent.method("setTabDisplay5",function(value){this.m_tabDisplay5=value;
});
FutureOrdersComponent.method("getTabDisplay5",function(){return this.m_tabDisplay5;
});
FutureOrdersComponent.method("setTab6",function(value){this.m_tab6=value;
});
FutureOrdersComponent.method("getTab6",function(){return this.m_tab6;
});
FutureOrdersComponent.method("setTabDisplay6",function(value){this.m_tabDisplay6=value;
});
FutureOrdersComponent.method("getTabDisplay6",function(){return this.m_tabDisplay6;
});
FutureOrdersComponent.method("setTab7",function(value){this.m_tab7=value;
});
FutureOrdersComponent.method("getTab7",function(){return this.m_tab7;
});
FutureOrdersComponent.method("setTabDisplay7",function(value){this.m_tabDisplay7=value;
});
FutureOrdersComponent.method("getTabDisplay7",function(){return this.m_tabDisplay7;
});
FutureOrdersComponent.method("setTab8",function(value){this.m_tab8=value;
});
FutureOrdersComponent.method("getTab8",function(){return this.m_tab8;
});
FutureOrdersComponent.method("setTabDisplay8",function(value){this.m_tabDisplay8=value;
});
FutureOrdersComponent.method("getTabDisplay8",function(){return this.m_tabDisplay8;
});
FutureOrdersComponent.method("setTab9",function(value){this.m_tab9=value;
});
FutureOrdersComponent.method("getTab9",function(){return this.m_tab9;
});
FutureOrdersComponent.method("setTabDisplay9",function(value){this.m_tabDisplay9=value;
});
FutureOrdersComponent.method("getTabDisplay9",function(){return this.m_tabDisplay9;
});
FutureOrdersComponent.method("setAllTabDisplay",function(value){this.m_allTabDisplay=value;
});
FutureOrdersComponent.method("getAllTabDisplay",function(){return this.m_allTabDisplay;
});
FutureOrdersComponent.method("setLookBack",function(object){this.firstOverdueValue=object.value;
this.firstOverdueUnit=object.units.substr(0,1);
var upperUnit=this.firstOverdueUnit.toUpperCase();
if(upperUnit!="M"&&upperUnit!="W"&&upperUnit!="D"){this.firstOverdueUnit="M";
}});
FutureOrdersComponent.method("getLookBack",function(){return this.firstOverdueValue+","+this.firstOverdueUnit;
});
FutureOrdersComponent.method("setLookAhead",function(object){this.lastUpcomingValue=object.value;
this.lastUpcomingUnit=object.units.substr(0,1);
var upperUnit=this.lastUpcomingUnit.toUpperCase();
if(upperUnit!="M"&&upperUnit!="W"&&upperUnit!="D"){this.lastUpcomingUnit="M";
}});
FutureOrdersComponent.method("getLookAhead",function(){return this.lastUpcomingValue+","+this.lastUpcomingUnit;
});
FutureOrdersComponent.method("InsertData",function(){CERN_FUTURE_ORDERS_O1.GetFutureOrders(this);
});
FutureOrdersComponent.method("HandleSuccess",function(recordData){CERN_FUTURE_ORDERS_O1.RenderComponent(this,recordData);
});
this.catalogTypeCodes=MP_Util.GetCodeSet(6000,false);
this.arrFutureOrderTabData=[];
this.tabOrder=[];
this.tabDisplay=[];
this.sortOrderArray=[];
this.isFirstLoad=true;
this.numAJAXCalls=0;
this.PowerOrdersMPageUtils=null;
this.currentTab=0;
this.allTabIdx=-1;
this.providerFilterList=[];
this.selectedProviderFilter="all";
this.locationFilterList=[];
this.selectedLocationFilter="all";
this.totalNumOrders=0;
this.typeTimer=0;
this.openAccordion="";
}FutureOrdersComponent.inherits(MPageComponent);
var CERN_FUTURE_ORDERS_O1=function(){return{GetFutureOrders:function(component){var sendAr=BuildRequestParameters(component);
MP_Core.XMLCclRequestWrapper(component,"MP_CPOE_GET_FUTURE_ORDERS",sendAr,true);
},SetProcessing:function(componentId,increment){var component=MP_Util.GetCompObjById(componentId);
var processingElement=_g("foProcessing"+componentId);
component.numAJAXCalls+=increment;
if(component.numAJAXCalls==0){Util.Style.acss(processingElement,"fo-hide");
}else{Util.Style.rcss(processingElement,"fo-hide");
}},RefreshFutureOrdersTable:function(componentId){var component=MP_Util.GetCompObjById(componentId);
component.setEditMode(true);
CERN_FUTURE_ORDERS_O1.SetProcessing(componentId,1);
component.selectedProviderFilter=_g(componentId+"-provider-filter").value;
component.selectedLocationFilter=_g(componentId+"-location-filter").value;
component.firstOverdueValue=_g(componentId+"-overdue-value").value;
component.firstOverdueUnit=_g(componentId+"-overdue-units").value;
component.lastUpcomingValue=_g(componentId+"-upcoming-value").value;
component.lastUpcomingUnit=_g(componentId+"-upcoming-units").value;
var sendAr=BuildRequestParameters(component);
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("MP_CPOE_GET_FUTURE_ORDERS");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,CERN_FUTURE_ORDERS_O1.RefreshCallBack);
},RefreshCallBack:function(reply){try{var component=reply.getComponent();
var recordData=reply.getResponse();
var componentId=component.getComponentId();
component.arrFutureOrderTabData=[];
component.totalNumOrders=0;
CERN_FUTURE_ORDERS_O1.InitiateTabArray(component);
CERN_FUTURE_ORDERS_O1.FillOutTabArray(component,recordData);
CERN_FUTURE_ORDERS_O1.CreateTabs(component);
CERN_FUTURE_ORDERS_O1.CreateTabTables(component);
BuildProviderFilter(component);
BuildLocationFilter(component);
component.setEditMode(false);
if(component.isFirstLoad==false){CERN_FUTURE_ORDERS_O1.SetProcessing(componentId,-1);
}}catch(err){var errMsg=[];
errMsg.push("<b>",i18n.JS_ERROR,"</b><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
var countText=MP_Util.CreateTitleText(component,component.totalNumOrders);
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var componentId=component.getComponentId();
var foI18N=i18n.cpoe.future_orders_o1;
var secHTMLArray=[];
var countText="";
component.setEditMode(true);
component.totalNumOrders=recordData.PATIENTS[0].ORDERS.length;
if(component.isFirstLoad==true){var foRootNode=_g("fo"+componentId);
var titleFrag=Util.ce("span");
var innerHTMLArr=[];
innerHTMLArr.push('<span id="foProcessing',+componentId,'" class="fo-processing fo-subtext fo-hide">',foI18N.PROCESSING,"</span>");
titleFrag.innerHTML=innerHTMLArr.join("");
var secTitle=Util.Style.g("sec-title",foRootNode,"span")[0];
Util.ia(titleFrag,secTitle);
}secHTMLArray.push("<div id='",componentId,"-body' class='",MP_Util.GetContentClass(component,component.totalNumOrders),"'>");
CERN_FUTURE_ORDERS_O1.InitiateTabArray(component);
CERN_FUTURE_ORDERS_O1.FillOutTabArray(component,recordData);
secHTMLArray.push("<div id='AccordionContainer",componentId,"' class='fo-accordion-container'>");
secHTMLArray.push("<div id='Accordion",componentId,"Content' class='fo-accordion-content'>");
secHTMLArray.push("<div id='Accordion",componentId,"ContentDiv' class='fo-acc-content-div'></div>");
secHTMLArray.push("<div id='",componentId,"-date-filter-row' class='fo-filter-row fo-filter-row-hd'></div>");
secHTMLArray.push("<div id='",componentId,"-filter-row' class='fo-filter-row fo-filter-row-hd'></div>");
secHTMLArray.push("</div><div id='Accordion",componentId,"Title' class='fo-accordion-title'","onclick='CERN_FUTURE_ORDERS_O1.foRunAccordion(",componentId,");' onselectstart='return false;'>");
secHTMLArray.push("</div></div><div class='fo-accordion-bottom'></div>");
secHTMLArray.push("<div class='fo-hd'><ul id='",componentId,"-tabs' class='fo-tabrow'></ul></div>");
secHTMLArray.push("<div id='",componentId,"-tab-sections' class='fo-body'></div>");
secHTMLArray.push("</div>");
countText=MP_Util.CreateTitleText(component,component.totalNumOrders);
MP_Util.Doc.FinalizeComponent(secHTMLArray.join(""),component,countText);
CERN_FUTURE_ORDERS_O1.CreateFilterRow(component);
CERN_FUTURE_ORDERS_O1.CreateTabs(component);
CERN_FUTURE_ORDERS_O1.CreateTabTables(component);
}catch(err){var errMsg=[];
errMsg.push("<b>",i18n.JS_ERROR,"</b><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
countText=MP_Util.CreateTitleText(component,component.totalNumOrders);
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}component.setEditMode(false);
component.isFirstLoad=false;
}},InitiateTabArray:function(component){if(component.isFirstLoad){component.tabOrder.push(component.getTab1());
component.tabOrder.push(component.getTab2());
component.tabOrder.push(component.getTab3());
component.tabOrder.push(component.getTab4());
component.tabOrder.push(component.getTab5());
component.tabOrder.push(component.getTab6());
component.tabOrder.push(component.getTab7());
component.tabOrder.push(component.getTab8());
component.tabOrder.push(component.getTab9());
component.tabDisplay.push(component.getTabDisplay1());
component.tabDisplay.push(component.getTabDisplay2());
component.tabDisplay.push(component.getTabDisplay3());
component.tabDisplay.push(component.getTabDisplay4());
component.tabDisplay.push(component.getTabDisplay5());
component.tabDisplay.push(component.getTabDisplay6());
component.tabDisplay.push(component.getTabDisplay7());
component.tabDisplay.push(component.getTabDisplay8());
component.tabDisplay.push(component.getTabDisplay9());
component.catalogTypeCodes.sort(theSubset("value",byString("display",1)));
component.catalogTypeCodes.sort(theSubset("value",byInt("sequence",1,true)));
}var catalogTypeCodes=component.catalogTypeCodes;
component.arrFutureOrderTabData=[];
var tabOrderCount=component.tabOrder.length;
for(var i=0;
i<tabOrderCount;
i++){if(!component.tabOrder[i]){continue;
}var tabData={};
if(component.tabDisplay[i]){tabData.tabDisplay=component.tabDisplay[i];
}else{var catalogTypeCount=catalogTypeCodes.length;
for(var j=0;
j<catalogTypeCount;
j++){if(component.tabOrder[i]==catalogTypeCodes[j].value.codeValue){tabData.tabDisplay=catalogTypeCodes[j].value.display;
break;
}}}tabData.tabCodeValue=component.tabOrder[i];
tabData.tabOrders=[];
tabData.tabSelectedOrders=[];
component.arrFutureOrderTabData.push(tabData);
if(component.isFirstLoad){var overdueSort={field:"START_DT_TM",order:1};
var dueSort={field:"START_DT_TM",order:1};
var upcomingSort={field:"START_DT_TM",order:1};
var subSectionArray=[];
subSectionArray.push(overdueSort);
subSectionArray.push(dueSort);
subSectionArray.push(upcomingSort);
component.sortOrderArray.push(subSectionArray);
}}component.allTabIdx=component.arrFutureOrderTabData.length;
tabData={};
var allTabDisplay=component.getAllTabDisplay();
if(!allTabDisplay){tabData.tabDisplay=i18n.cpoe.future_orders_o1.ALL;
}else{tabData.tabDisplay=allTabDisplay;
}tabData.tabCodeValue=-1;
tabData.tabTotalNumOrders=0;
tabData.tabOrders=[];
tabData.tabSelectedOrders=[];
component.arrFutureOrderTabData.push(tabData);
if(component.isFirstLoad){subSectionArray=[];
component.sortOrderArray.push(subSectionArray);
}},FillOutTabArray:function(component,recordData){var futureOrderTabs=component.arrFutureOrderTabData;
var catalogTypeCodes=component.catalogTypeCodes;
var orderCount=recordData.PATIENTS[0].ORDERS.length;
for(var i=0;
i<orderCount;
i++){var oOrder=recordData.PATIENTS[0].ORDERS[i];
if(component.selectedProviderFilter!=oOrder.RESPONSIBLE_PROVIDER_NAME&&component.selectedProviderFilter!="all"){continue;
}if(component.selectedLocationFilter!="all"){if(oOrder.ORDERING_LOCATION_INFORMATION.length==1){if(component.selectedLocationFilter!=oOrder.ORDERING_LOCATION_INFORMATION[0].ORDERING_LOCATION_DISPLAY){continue;
}}else{continue;
}}var bCatalogTypeFound=false;
if(component.allTabIdx!=-1){var allTabOrders=futureOrderTabs[component.allTabIdx].tabOrders;
var allTabOrdersCount=allTabOrders.length;
for(var j=0;
j<allTabOrdersCount;
j++){if(allTabOrders[j].subSectionCodeValue==oOrder.CATALOG_TYPE_CD){allTabOrders[j].subSectionOrders.push(oOrder);
futureOrderTabs[component.allTabIdx].tabTotalNumOrders++;
bCatalogTypeFound=true;
break;
}}if(bCatalogTypeFound==false){var catalogTypesCount=catalogTypeCodes.length;
for(var j=0;
j<catalogTypesCount;
j++){var catTypeCodeValue=catalogTypeCodes[j].value;
if(catTypeCodeValue.codeValue==oOrder.CATALOG_TYPE_CD){var subSectionData={};
subSectionData.subSectionDisplay=catTypeCodeValue.display;
subSectionData.subSectionCodeValue=catTypeCodeValue.codeValue;
subSectionData.subSectionOrders=[];
subSectionData.subSectionOrders.push(oOrder);
futureOrderTabs[component.allTabIdx].tabTotalNumOrders++;
allTabOrders.push(subSectionData);
var bSortIndexFound=false;
var sortCatTypeArrayCount=component.sortOrderArray[component.allTabIdx].length;
for(var k=0;
k<sortCatTypeArrayCount;
k++){if(catTypeCodeValue.codeValue==component.sortOrderArray[component.allTabIdx][k].categoryTypeCd){bSortIndexFound=true;
break;
}}if(component.isFirstLoad||!bSortIndexFound){var overdueSort={field:"START_DT_TM",order:1};
var dueSort={field:"START_DT_TM",order:1};
var upcomingSort={field:"START_DT_TM",order:1};
var subSectionCategoryType={};
subSectionCategoryType.categoryTypeCd=catTypeCodeValue.codeValue;
subSectionCategoryType.subSectionArray=[];
subSectionCategoryType.subSectionArray.push(overdueSort);
subSectionCategoryType.subSectionArray.push(dueSort);
subSectionCategoryType.subSectionArray.push(upcomingSort);
component.sortOrderArray[component.allTabIdx].push(subSectionCategoryType);
}break;
}}}}var futureOrderTabsCount=futureOrderTabs.length;
for(var j=0;
j<futureOrderTabsCount;
j++){if(futureOrderTabs[j].tabCodeValue==oOrder.CATALOG_TYPE_CD){futureOrderTabs[j].tabOrders.push(oOrder);
break;
}}var bFound=false;
var providerFilterCount=component.providerFilterList.length;
for(j=0;
j<providerFilterCount;
j++){if(oOrder.RESPONSIBLE_PROVIDER_NAME==component.providerFilterList[j]){bFound=true;
}}if(bFound===false&&oOrder.RESPONSIBLE_PROVIDER_NAME!=""){component.providerFilterList.push(oOrder.RESPONSIBLE_PROVIDER_NAME);
}if(oOrder.ORDERING_LOCATION_INFORMATION.length==1){bFound=false;
var locationFilterCount=component.locationFilterList.length;
for(j=0;
j<locationFilterCount;
j++){if(oOrder.ORDERING_LOCATION_INFORMATION[0].ORDERING_LOCATION_DISPLAY==component.locationFilterList[j]){bFound=true;
}}if(bFound===false&&oOrder.ORDERING_LOCATION_INFORMATION[0].ORDERING_LOCATION_DISPLAY!=""){component.locationFilterList.push(oOrder.ORDERING_LOCATION_INFORMATION[0].ORDERING_LOCATION_DISPLAY);
}}}},CreateFilterRow:function(component){var componentId=component.getComponentId();
var foI18N=i18n.cpoe.future_orders_o1;
var filterHTMLArray=[];
var dateHTMLArray=[];
var codeDays=MP_Util.GetCodeValueByMeaning("DAYS",54);
var codeWeeks=MP_Util.GetCodeValueByMeaning("WEEKS",54);
var codeMonths=MP_Util.GetCodeValueByMeaning("MONTHS",54);
dateHTMLArray.push("<span class='fo-filter'>",foI18N.LOOK_BACK,":&nbsp;","<input type='text' id='",componentId,"-overdue-value' maxLength=3 class='fo-input' ","onClick='this.select();' ","onkeypress='return CERN_FUTURE_ORDERS_O1.foValidateIntegerInput(event);' ","onkeyup='CERN_FUTURE_ORDERS_O1.TypeTimer(",componentId,", ","function(){CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");}, 1000 );' />","<select id='",componentId,"-overdue-units' class='fo-select-list' ","onChange='CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");'>","<option value='D' selected='selected'>",codeDays.display,"</option>","<option value='W'>",codeWeeks.display,"</option>","<option value='M'>",codeMonths.display,"</option></select>","</span>");
dateHTMLArray.push("<span class='fo-filter'>",foI18N.LOOK_FORWARD,":&nbsp;","<input type='text' id='",componentId,"-upcoming-value' maxLength=3 class='fo-input' ","onClick='this.select();' ","onkeypress='return CERN_FUTURE_ORDERS_O1.foValidateIntegerInput(event);' ","onkeyup='CERN_FUTURE_ORDERS_O1.TypeTimer(",componentId,", ","function(){CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");}, 1000 );' />","<select id='",componentId,"-upcoming-units' class='fo-select-list' ","onChange='CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");'>","<option value='D' selected='selected'>",codeDays.display,"</option>","<option value='W'>",codeWeeks.display,"</option>","<option value='M'>",codeMonths.display,"</option></select>","</span>");
filterHTMLArray.push("<span class='fo-filter'>",foI18N.PROVIDER,":&nbsp;","<select id='",componentId,"-provider-filter' class='fo-select-list' ","onChange='CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");'>","<option value='all'>",foI18N.ALL_PROVIDERS,"</option></select></span>");
filterHTMLArray.push("<span class='fo-filter'>",foI18N.LOCATION,":&nbsp;","<select id='",componentId,"-location-filter' class='fo-select-list' ","onChange='CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");'>","<option value='all'>",foI18N.ALL_LOCATIONS,"</option></select></span>");
var dateFilterNode=_g(componentId+"-date-filter-row");
dateFilterNode.innerHTML=dateHTMLArray.join("");
var filterNode=_g(componentId+"-filter-row");
filterNode.innerHTML=filterHTMLArray.join("");
BuildProviderFilter(component);
BuildLocationFilter(component);
setTimeout(function(){CERN_FUTURE_ORDERS_O1.foRunAccordion(componentId);
},1000);
_g(componentId+"-provider-filter").value=component.selectedProviderFilter;
_g(componentId+"-location-filter").value=component.selectedLocationFilter;
_g(componentId+"-overdue-value").value=component.firstOverdueValue;
_g(componentId+"-overdue-units").value=component.firstOverdueUnit;
_g(componentId+"-upcoming-value").value=component.lastUpcomingValue;
_g(componentId+"-upcoming-units").value=component.lastUpcomingUnit;
},CreateTabs:function(component){var componentId=component.getComponentId();
var futureOrderTabs=component.arrFutureOrderTabData;
var tabsHTMLArray=[];
if(futureOrderTabs.length==1){var tabsNode=_g(componentId+"-tabs");
if(component.allTabIdx==-1){tabsHTMLArray.push("<h3 class='fo-hdr-txt'>",futureOrderTabs[0].tabDisplay,"</h3>");
tabsNode.innerHTML=tabsHTMLArray.join("");
}else{Util.Style.rcss(tabsNode,"fo-hd");
}return;
}var futureOrderTabsCount=futureOrderTabs.length;
for(var i=0;
i<futureOrderTabsCount;
i++){if(i==component.currentTab){tabsHTMLArray.push("<li id='",componentId,"tab",i,"' class='fo-selected'>",futureOrderTabs[i].tabDisplay);
}else{tabsHTMLArray.push("<li id='",componentId,"tab",i,"'>",futureOrderTabs[i].tabDisplay);
}if(i==component.allTabIdx){tabsHTMLArray.push(" (",futureOrderTabs[i].tabTotalNumOrders,")</li>");
}else{tabsHTMLArray.push(" (",futureOrderTabs[i].tabOrders.length,")</li>");
}}var tabsNode=_g(componentId+"-tabs");
tabsNode.innerHTML=tabsHTMLArray.join("");
for(i=0;
i<futureOrderTabsCount;
i++){var tabId=componentId+"tab"+i;
var curTab=_g(tabId);
if(curTab){Util.addEvent(curTab,"click",function(){foSelectTab(componentId,this.id);
});
}}},CreateTabTables:function(component){var componentId=component.getComponentId();
var futureOrderTabs=component.arrFutureOrderTabData;
var foI18N=i18n.cpoe.future_orders_o1;
var tabSecHTMLArray=[];
var futureOrderTabsCount=futureOrderTabs.length;
for(var i=0;
i<futureOrderTabsCount;
i++){if(i==component.currentTab){tabSecHTMLArray.push("<div id='",componentId,"tabsec",i,"' class='fo-tabsec-display'>");
}else{tabSecHTMLArray.push("<div id='",componentId,"tabsec",i,"' class='fo-tabsec-hide'>");
}if(i===component.allTabIdx){if(futureOrderTabs[i].tabTotalNumOrders==0){tabSecHTMLArray.push("<div class='sub-sec'><h5 class='fo-cat-type-sec-hd'>","<div class='sub-sec-hd-hide'></div>","<span class='sub-sec-title'>",foI18N.ALL_ORDERS,"</span></h5>","<div class='fo-cat-type-sec-content'>");
tabSecHTMLArray.push("<span class='res-none'>",foI18N.NO_ORDERS,"</span></div></div>");
}var catalogTypesCount=component.catalogTypeCodes.length;
for(var j=0;
j<catalogTypesCount;
j++){var tabOrdersCount=futureOrderTabs[i].tabOrders.length;
for(var k=0;
k<tabOrdersCount;
k++){if(component.catalogTypeCodes[j].value.codeValue==futureOrderTabs[i].tabOrders[k].subSectionCodeValue){var allTabSection=futureOrderTabs[i].tabOrders[k];
if(allTabSection.subSectionOrders.length===0){tabSecHTMLArray.push("<div class='sub-sec closed'><h2 class='fo-sub-sec-hd fo-cat-type'>","<div class='sub-sec-hd-hide'></div>");
}else{tabSecHTMLArray.push("<div class='sub-sec'><h2 class='fo-sub-sec-hd fo-cat-type'>","<span class='sub-sec-hd-tgl' title='",foI18N.HIDE_SECTION,"'>-</span>");
}tabSecHTMLArray.push("<span class='sub-sec-title'>",allTabSection.subSectionDisplay," <span class='fo-subtext'>(",allTabSection.subSectionOrders.length,")</span></span></h2>","<div class='fo-cat-type-sec-content'>");
var sortOrderArrayIndex=0;
var sortArrayLength=component.sortOrderArray[i].length;
for(var m=0;
m<sortArrayLength;
m++){if(component.sortOrderArray[i][m].categoryTypeCd==futureOrderTabs[i].tabOrders[k].subSectionCodeValue){sortOrderArrayIndex=m;
break;
}}tabSecHTMLArray.push(CERN_FUTURE_ORDERS_O1.BuildSubSection(component,allTabSection.subSectionOrders,component.sortOrderArray[i][sortOrderArrayIndex].subSectionArray,sortOrderArrayIndex));
tabSecHTMLArray.push("</div></div>");
tabSecHTMLArray.push("<br />");
break;
}}}}else{tabSecHTMLArray.push(CERN_FUTURE_ORDERS_O1.BuildSubSection(component,futureOrderTabs[i].tabOrders,component.sortOrderArray[i]));
}var codeActivate=MP_Util.GetCodeValueByMeaning("ACTIVATE",6003);
var codeCancelDC=MP_Util.GetCodeValueByMeaning("CANCEL DC",6003);
var sActivate="";
var sCanceDC="";
if(codeActivate==null){sActivate=foI18N.ACTIVATE;
}else{sActivate=codeActivate.display;
}if(codeCancelDC==null){sCancelDC=foI18N.CANCEL;
}else{sCancelDC=codeCancelDC.display;
}tabSecHTMLArray.push('<div class="fo-btn-row">');
tabSecHTMLArray.push("<span class='fo-filter'>","<a onclick='CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(",componentId,");'>","<img src='",component.getCriterion().static_content,"\\images\\3688_16.png' />","&nbsp;",foI18N.REFRESH,"</a></span>");
tabSecHTMLArray.push('<input type="button" id="btnActivateTab',i,'" name="btnActivateTab',i,'" class="fo-btn" disabled="false" value="',sActivate,'" onclick="CERN_FUTURE_ORDERS_O1.foOnActivate(',componentId,", ",i,');" />');
tabSecHTMLArray.push('<input type="button" id="btnCancelTab',i,'" name="btnCancelTab',i,'" class="fo-btn" disabled="false" value="',sCancelDC,'" onclick="CERN_FUTURE_ORDERS_O1.foOnCancel(',componentId,", ",i,');"/>');
tabSecHTMLArray.push("</div>");
tabSecHTMLArray.push("</div>");
}var tabSectionsNode=_g(componentId+"-tab-sections");
tabSectionsNode.innerHTML=tabSecHTMLArray.join("");
var styles=component.getStyles();
var node=component.getSectionContentNode();
MP_Util.Doc.InitHovers(styles.getInfo(),node,component);
MP_Util.Doc.InitSubToggles(node,"sub-sec-hd-tgl");
},BuildSubSection:function(component,orderArray,sortOrderArray,allSubSection){var componentId=component.getComponentId();
var secHTMLArray=[];
var foI18N=i18n.cpoe.future_orders_o1;
var subHeaders=[foI18N.OVERDUE,foI18N.DUE,foI18N.UPCOMING];
var arrOrdersSections=[];
var arrOrdersDue=[];
var arrOrdersOverdue=[];
var arrOrdersUpcoming=[];
var allSubSectionDisplay;
var dtEstStart=new Date();
var dtBeginDue=new Date();
var dtDueBy=new Date();
if(allSubSection!=undefined){allSubSectionDisplay=","+allSubSection;
}else{allSubSectionDisplay="";
}var orderArrayCount=orderArray.length;
for(var i=0;
i<orderArrayCount;
i++){var oOrder=orderArray[i];
if(oOrder.DUE_STATUS_FLAG==1){arrOrdersDue.push(oOrder);
}else{if(oOrder.DUE_STATUS_FLAG==2){arrOrdersOverdue.push(oOrder);
}else{if(oOrder.DUE_STATUS_FLAG==0){arrOrdersUpcoming.push(oOrder);
}}}}arrOrdersSections.splice(0,0,arrOrdersOverdue);
arrOrdersSections.splice(1,0,arrOrdersDue);
arrOrdersSections.splice(2,0,arrOrdersUpcoming);
for(i=0;
i<3;
i++){var arrSectionOrders=arrOrdersSections[i];
var sortIdx=sortOrderArray[i].field;
var sortOrder=sortOrderArray[i].order;
if(arrSectionOrders.length>0){secHTMLArray.push("<div class='sub-sec'><h6 class='fo-sub-sec-hd'>");
secHTMLArray.push("<span class='sub-sec-hd-tgl' title='",foI18N.HIDE_SECTION,"'>-</span>","<span class='sub-sec-title'>");
}else{secHTMLArray.push("<div class='sub-sec closed'><h6 class='fo-sub-sec-hd'>");
secHTMLArray.push("<div class='sub-sec-hd-hide'></div><span class='fo-sub-sec-disabled'>");
}secHTMLArray.push(subHeaders[i]," <span class='fo-subtext'>(",arrSectionOrders.length,") </span></span></h6>","<div class='sub-sec-content'><div class='content-hdr'>");
if(arrSectionOrders.length>0){switch(sortIdx){case"MNEMONIC":case"RESPONSIBLE_PROVIDER_NAME":arrSectionOrders.sort(byString(sortIdx,sortOrder,true));
break;
case"START_DT_TM":case"BEGIN_DUE_DT_TM":arrSectionOrders.sort(byISO8601Date(sortIdx,sortOrder));
break;
case"ORDERING_LOCATION_DISPLAY":arrSectionOrders.sort(theArrayIndex("ORDERING_LOCATION_INFORMATION",0,byString(sortIdx,sortOrder,true)));
break;
default:arrSectionOrders.sort(byString(sortIdx,sortOrder,true));
}secHTMLArray.push("<dl class='fo-info-hdr fo-hdr'>","<dd class='fo-ico'></dd>");
secHTMLArray.push("<dd class='fo-col-hdr fo-txt ",DetermineSortClass("MNEMONIC",sortIdx,sortOrder),"' onclick='CERN_FUTURE_ORDERS_O1.foSortColumn(",componentId,",",i,",",'"MNEMONIC",',-sortOrder,allSubSectionDisplay,");'>",foI18N.ORDER,"</dd>");
secHTMLArray.push("<dd class='fo-col-hdr fo-dt ",DetermineSortClass("START_DT_TM",sortIdx,sortOrder),"' onclick='CERN_FUTURE_ORDERS_O1.foSortColumn(",componentId,",",i,",",'"START_DT_TM",',-sortOrder,allSubSectionDisplay,");'>",foI18N.START_DATE,"</dd>");
secHTMLArray.push("<dd class='fo-col-hdr fo-txt ",DetermineSortClass("BEGIN_DUE_DT_TM",sortIdx,sortOrder),"' onclick='CERN_FUTURE_ORDERS_O1.foSortColumn(",componentId,",",i,",",'"BEGIN_DUE_DT_TM",',-sortOrder,allSubSectionDisplay,");'>",foI18N.GRACE_PERIOD,"</dd>");
secHTMLArray.push("<dd class='fo-col-hdr fo-txt ",DetermineSortClass("RESPONSIBLE_PROVIDER_NAME",sortIdx,sortOrder),"' onclick='CERN_FUTURE_ORDERS_O1.foSortColumn(",componentId,",",i,",",'"RESPONSIBLE_PROVIDER_NAME",',-sortOrder,allSubSectionDisplay,");'>",foI18N.PROVIDER,"</dd>");
secHTMLArray.push("<dd class='fo-col-hdr fo-txt ",DetermineSortClass("ORDERING_LOCATION_DISPLAY",sortIdx,sortOrder),"' onclick='CERN_FUTURE_ORDERS_O1.foSortColumn(",componentId,",",i,",",'"ORDERING_LOCATION_DISPLAY",',-sortOrder,allSubSectionDisplay,");'>",foI18N.LOCATION,"</dd>");
secHTMLArray.push("</dl></div><div class='content-body'>");
sectionOrdersCount=arrSectionOrders.length;
for(var j=0;
j<sectionOrdersCount;
j++){var oOrder=arrSectionOrders[j];
dtEstStart.setISO8601(oOrder.START_DT_TM);
dtBeginDue.setISO8601(oOrder.BEGIN_DUE_DT_TM);
dtDueBy.setISO8601(oOrder.END_DUE_DT_TM);
secHTMLArray.push("<dl class='fo-info ",(j%2)==0?"even":"odd","' onclick='CERN_FUTURE_ORDERS_O1.foSelectRow(",componentId,", this, ",oOrder.ORDER_ID,")'>","<dt class='fo-ico'>&nbsp;</dt>");
if(oOrder.PLAN_INFORMATION.length==1){secHTMLArray.push("<dd class='fo-ico'><img src='",component.getCriterion().static_content,"\\images\\6404_16.png' /></dd>");
}else{if(oOrder.ORDER_SET_INFORMATION.length==1){secHTMLArray.push("<dd class='fo-ico'><img src='",component.getCriterion().static_content,"\\images\\order_set.png' /></dd>");
}else{secHTMLArray.push("<dd class='fo-ico'></dd>");
}}secHTMLArray.push("<dt class='fo-lbl'>",foI18N.ORDER,"</dt>","<dd class='fo-lbl'>",oOrder.MNEMONIC,"</dd>","<dt class='fo-dt'>",foI18N.START_DATE,"</dt>","<dd class='fo-dt'>",dtEstStart.format("shortDate2"),"</dd>","<dt class='fo-txt'>",foI18N.GRACE_PERIOD,"</dt>","<dd class='fo-txt'>",dtBeginDue.format("shortDate2")," - ",dtDueBy.format("shortDate2"),"</dd>","<dt class='fo-txt'>",foI18N.PROVIDER,"</dt>","<dd class='fo-txt'>",oOrder.RESPONSIBLE_PROVIDER_NAME,"</dd>","<dt class='fo-txt'>",foI18N.LOCATION,"</dt>");
if(oOrder.ORDERING_LOCATION_INFORMATION.length==1){secHTMLArray.push("<dd class='fo-txt'>",oOrder.ORDERING_LOCATION_INFORMATION[0].ORDERING_LOCATION_DISPLAY,"</dd>");
}else{secHTMLArray.push("<dd class='fo-txt'></dd>");
}secHTMLArray.push("</dl>");
secHTMLArray.push("<h4 class='det-hd'><span>",foI18N.ORDER,"</span></h4>","<div class='hvr'><dl class='fo-det'>","<dt class='fo-det-dt'><span>",foI18N.ORDER,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.MNEMONIC,"</span></dd>","<dt class='fo-det-dt'><span>",foI18N.DETAILS,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.CLINICAL_DISPLAY_LINE,"</span></dd>");
if(oOrder.PLAN_INFORMATION.length==1){secHTMLArray.push("<dt class='fo-det-dt'><span>",foI18N.PLAN_NAME,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.PLAN_INFORMATION[0].PLAN_NAME,"</span></dd>");
}if(oOrder.ORDER_SET_INFORMATION.length==1){secHTMLArray.push("<dt class='fo-det-dt'><span>",foI18N.CARE_SET_NAME,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.ORDER_SET_INFORMATION[0].ORDER_SET_NAME,"</span></dd>");
}secHTMLArray.push("<dt class='fo-det-dt'><span>",foI18N.PROVIDER,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.RESPONSIBLE_PROVIDER_NAME,"</span></dd>","<dt class='fo-det-dt'><span>",foI18N.START_DATE,":</span></dt>","<dd class='fo-det-dt'><span>",dtEstStart.format("shortDate2"),"</span></dd>","<dt class='fo-det-dt'><span>",foI18N.GRACE_PERIOD,":</span></dt>","<dd class='fo-det-dt'><span>",dtBeginDue.format("shortDate2")," - ",dtDueBy.format("shortDate2"),"</span></dd>");
if(oOrder.ORDERING_LOCATION_INFORMATION.length==1){secHTMLArray.push("<dt class='fo-det-dt'><span>",foI18N.LOCATION,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.ORDERING_LOCATION_INFORMATION[0].ORDERING_LOCATION_DISPLAY,"</span></dd>");
}secHTMLArray.push("<dt class='fo-det-dt'><span>",foI18N.COMMENTS,":</span></dt>","<dd class='fo-det-dt'><span>",oOrder.ORDER_COMMENT,"</span></dd>","</dl></div>");
}secHTMLArray.push("</div></div></div>");
}else{secHTMLArray.push("<span class='res-none'>",foI18N.NO_ORDERS,"</span></div></div></div>");
}}return secHTMLArray.join("");
},TypeTimer:function(componentId,callback,ms){var component=MP_Util.GetCompObjById(componentId);
clearTimeout(component.typeTimer);
component.typeTimer=setTimeout(callback,ms);
},foRunAccordion:function(componentId){var titleAr=[];
var nID="Accordion"+componentId+"Content";
var TimeToSlide=100;
var titleDiv=_g("Accordion"+componentId+"Title");
var containerDiv=_g("AccordionContainer"+componentId);
var component=MP_Util.GetCompObjById(componentId);
var location=component.getCriterion().static_content;
if(Util.Style.ccss(titleDiv,"expanded")){Util.Style.rcss(titleDiv,"expanded");
Util.Style.rcss(containerDiv,"expanded");
}else{Util.Style.acss(titleDiv,"expanded");
Util.Style.acss(containerDiv,"expanded");
}if(CERN_FUTURE_ORDERS_O1.openAccordion==nID){nID="";
}setTimeout("CERN_FUTURE_ORDERS_O1.foAnimate("+new Date().getTime()+","+TimeToSlide+",'"+CERN_FUTURE_ORDERS_O1.openAccordion+"','"+nID+"','"+componentId+"')",20);
CERN_FUTURE_ORDERS_O1.openAccordion=nID;
},foAnimate:function(lastTick,timeLeft,closingId,openingId,componentId){var TimeToSlide=timeLeft;
var curTick=new Date().getTime();
var elapsedTicks=curTick-lastTick;
var ContentHeight=60;
var opening=(openingId=="")?null:_g(openingId);
var closing=(closingId=="")?null:_g(closingId);
if(timeLeft<=elapsedTicks){if(opening){opening.style.height=ContentHeight+"px";
}if(closing){closing.style.display="none";
closing.style.height="0px";
}return;
}timeLeft-=elapsedTicks;
var newClosedHeight=Math.round((timeLeft/TimeToSlide)*ContentHeight);
if(opening){if(opening.style.display!="block"){opening.style.display="block";
opening.style.height=(ContentHeight-newClosedHeight)+"px";
}}if(closing){closing.style.height=newClosedHeight+"px";
}setTimeout("CERN_FUTURE_ORDERS_O1.foAnimate("+curTick+","+timeLeft+",'"+closingId+"','"+openingId+"','"+componentId+"')",2);
},foSortColumn:function(componentId,sectionIdx,colHeader,sortDir,allCatTypeSection){var component=MP_Util.GetCompObjById(componentId);
var currTab=component.currentTab;
if(allCatTypeSection!=undefined||allCatTypeSection!=null){component.sortOrderArray[currTab][allCatTypeSection].subSectionArray[sectionIdx].field=colHeader;
component.sortOrderArray[currTab][allCatTypeSection].subSectionArray[sectionIdx].order=sortDir;
}else{component.sortOrderArray[currTab][sectionIdx].field=colHeader;
component.sortOrderArray[currTab][sectionIdx].order=sortDir;
}CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(componentId);
},foValidateIntegerInput:function(e){var keynum;
var keychar;
var numcheck;
if(window.event){keynum=e.keyCode;
}else{if(e.which){keynum=e.which;
}}keychar=String.fromCharCode(keynum);
numcheck=/\d/;
return numcheck.test(keychar);
},foSelectRow:function(componentId,row,orderId){var component=MP_Util.GetCompObjById(componentId);
var currTab=component.currentTab;
var selectedTabData=component.arrFutureOrderTabData[currTab].tabSelectedOrders;
if(Util.Style.tcss(row,"row-selected")){if(!component.PowerOrdersMPageUtils){component.PowerOrdersMPageUtils=window.external.DiscernObjectFactory("POWERORDERS");
}var hMOEW=component.PowerOrdersMPageUtils.CreateMOEW(component.getCriterion().person_id,component.getCriterion().encntr_id,0,2,127);
var actionString=component.PowerOrdersMPageUtils.GetAvailableOrderActions(hMOEW,orderId);
component.PowerOrdersMPageUtils.DestroyMOEW(hMOEW);
var orderObj=new foOrderActions();
orderObj.orderId=parseInt(orderId,10);
orderObj.canActivate=((actionString&4)==4);
orderObj.canCancel=((actionString&1)==1);
selectedTabData.push(orderObj);
}else{for(var i=selectedTabData.length;
i--;
){if(selectedTabData[i].orderId==parseInt(orderId,10)){selectedTabData.splice(i,1);
break;
}}}var actionFlag=foCanEnableActionBtn(selectedTabData);
if((actionFlag&1)==1){_g("btnActivateTab"+currTab).disabled=false;
}else{_g("btnActivateTab"+currTab).disabled=true;
}if((actionFlag&2)==2){_g("btnCancelTab"+currTab).disabled=false;
}else{_g("btnCancelTab"+currTab).disabled=true;
}},foOnActivate:function(componentId,tabIdx){var component=MP_Util.GetCompObjById(componentId);
var selectedTabData=component.arrFutureOrderTabData[tabIdx].tabSelectedOrders;
var MoewObj=component.PowerOrdersMPageUtils;
var hMOEW=MoewObj.CreateMOEW(component.getCriterion().person_id,component.getCriterion().encntr_id,0,2,127);
var d=new Date();
var twoDigit=function(num){(String(num).length<2)?num=String("0"+num):num=String(num);
return num;
};
var activateDate=""+d.getFullYear()+twoDigit((d.getMonth()+1))+twoDigit(d.getDate())+twoDigit(d.getHours())+twoDigit(d.getMinutes())+twoDigit(d.getSeconds())+"99";
var selectedTabCount=selectedTabData.length;
for(var i=selectedTabCount;
i--;
){var success=MoewObj.InvokeActivateAction(hMOEW,selectedTabData[i].orderId,activateDate);
}if(success==1){success=MoewObj.SignOrders(hMOEW);
}MoewObj.DestroyMOEW(hMOEW);
if(success==1){CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(componentId);
}},foOnCancel:function(componentId,tabIdx){var component=MP_Util.GetCompObjById(componentId);
var selectedTabData=component.arrFutureOrderTabData[tabIdx].tabSelectedOrders;
var MoewObj=component.PowerOrdersMPageUtils;
var hMOEW=MoewObj.CreateMOEW(component.getCriterion().person_id,component.getCriterion().encntr_id,0,2,127);
var m_dCancelDCReason=0;
var d=new Date();
var twoDigit=function(num){(String(num).length<2)?num=String("0"+num):num=String(num);
return num;
};
var cancelDate=""+d.getFullYear()+twoDigit((d.getMonth()+1))+twoDigit(d.getDate())+twoDigit(d.getHours())+twoDigit(d.getMinutes())+twoDigit(d.getSeconds())+"99";
var selectedTabCount=selectedTabData.length;
for(var i=selectedTabCount;
i--;
){var success=MoewObj.InvokeCancelDCAction(hMOEW,selectedTabData[i].orderId,cancelDate,m_dCancelDCReason);
}if(success==1){success=MoewObj.SignOrders(hMOEW);
}MoewObj.DestroyMOEW(hMOEW);
if(success==1){CERN_FUTURE_ORDERS_O1.RefreshFutureOrdersTable(componentId);
}}};
function BuildRequestParameters(component){var criterion=component.getCriterion();
var sEncntr=criterion.encntr_id;
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.encntr_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+component.getLookBack()+"^","^"+component.getLookAhead()+"^","^^");
return sendAr;
}function DetermineSortClass(colHeader,sortIdx,sortOrder){if(colHeader==sortIdx){return(sortOrder==1?"fo-hdr-asc":"fo-hdr-desc");
}else{return"";
}}function BuildProviderFilter(component){var componentId=component.getComponentId();
var providerSelect=_g(componentId+"-provider-filter");
providerSelect.innerHTML="";
var newOption=Util.ce("option");
newOption.value="all";
newOption.text=i18n.cpoe.future_orders_o1.ALL_PROVIDERS;
newOption.selected=true;
providerSelect.add(newOption);
var providerListCount=component.providerFilterList.length;
for(var i=0;
i<providerListCount;
i++){newOption=Util.ce("option");
newOption.value=component.providerFilterList[i];
newOption.text=component.providerFilterList[i];
if(component.providerFilterList[i]==component.selectedProviderFilter){newOption.selected=true;
}providerSelect.add(newOption);
}}function BuildLocationFilter(component){var componentId=component.getComponentId();
var locationSelect=_g(componentId+"-location-filter");
locationSelect.innerHTML="";
var newOption=Util.ce("option");
newOption.value="all";
newOption.text=i18n.cpoe.future_orders_o1.ALL_LOCATIONS;
newOption.selected=true;
locationSelect.add(newOption);
var locationListCount=component.locationFilterList.length;
for(var i=0;
i<locationListCount;
i++){newOption=Util.ce("option");
newOption.value=component.locationFilterList[i];
newOption.text=component.locationFilterList[i];
if(component.locationFilterList[i]==component.selectedLocationFilter){newOption.selected=true;
}locationSelect.add(newOption);
}}function byString(index,dir,pushEmptyFieldsDown){return function(a,b){if(a==undefined||a==null){if(pushEmptyFieldsDown==true&&dir>0){a="zzzzzzzzzzzz";
}else{a="";
}}else{a=a[index];
}if(b==undefined||b==null){if(pushEmptyFieldsDown==true&&dir>0){b="zzzzzzzzzzzz";
}else{b="";
}}else{b=b[index];
}return a.toLowerCase()==b.toLowerCase()?0:(a.toLowerCase()<b.toLowerCase()?-1*dir:dir);
};
}function byInt(index,dir,pushNullZeroAndNegativeDown){return function(a,b){if(a==undefined||a==null){if(pushNullZeroAndNegativeDown==true&&dir>0){a=Number.MAX_VALUE;
}else{a=Number.MIN_VALUE;
}}else{a=parseInt(parseFloat(a[index]));
if(pushNullZeroAndNegativeDown==true&&a<=0){if(dir>0){a=Number.MAX_VALUE;
}else{a=Number.MIN_VALUE;
}}}if(b==undefined||b==null){if(pushNullZeroAndNegativeDown==true&&dir>0){b=Number.MAX_VALUE;
}else{b=Number.MIN_VALUE;
}}else{b=parseInt(parseFloat(b[index]));
if(pushNullZeroAndNegativeDown==true&&b<=0){if(dir>0){b=Number.MAX_VALUE;
}else{b=Number.MIN_VALUE;
}}}return a==b?0:(a<b?-1*dir:dir);
};
}function byISO8601Date(index,dir){return function(a,b){if(a==undefined||a==null){var dtA=new Date(1800,1,1);
}else{var dtA=new Date();
dtA.setISO8601(a[index]);
}if(b==undefined||b==null){var dtB=new Date(1800,1,1);
}else{var dtB=new Date();
dtB.setISO8601(b[index]);
}return dtA==dtB?0:(dtA<dtB?-1*dir:dir);
};
}function theSubset(subset,callback){return function(a,b){if(a==undefined||a==null){var A=undefined;
}else{var A=a[subset];
}if(b==undefined||b==null){var B=undefined;
}else{var B=b[subset];
}return callback(A,B);
};
}function theArrayIndex(array,index,callback){return function(a,b){if(a==undefined||a==null){var A=undefined;
}else{var arrA=a[array];
if(arrA.length>0){var A=arrA[index];
}else{A=undefined;
}}if(b==undefined||b==null){var B=undefined;
}else{var arrB=b[array];
if(arrB.length>0){var B=arrB[index];
}else{B=undefined;
}}return callback(A,B);
};
}function foSelectTab(componentId,selectedTabId){var component=MP_Util.GetCompObjById(componentId);
var tabs=component.arrFutureOrderTabData;
var tabsCount=tabs.length;
for(var i=0;
i<tabsCount;
i++){var tempTabId=componentId+"tab"+i;
var tempTabSecId=componentId+"tabsec"+i;
var tab=_g(tempTabId);
var tabsec=_g(tempTabSecId);
if(tempTabId==selectedTabId){tab.className="fo-selected";
tabsec.className="fo-tabsec-display";
component.currentTab=i;
}else{tab.className="";
tabsec.className="fo-tabsec-hide";
}}}function foCanEnableActionBtn(orderActionArray){if(orderActionArray.length==0){return 0;
}var activateInd=1;
var cancelInd=2;
for(var i=orderActionArray.length;
i--;
){var order=orderActionArray[i];
if(!order.canActivate){activateInd=0;
}if(!order.canCancel){cancelInd=0;
}if(!(activateInd||cancelInd)){return 0;
}}return activateInd+cancelInd;
}function foOrderActions(){this.orderId=0;
this.canActivate=false;
this.canCancel=false;
}}();
function PatientAssessmentComponentStyle(){this.initByNamespace("pta");
}PatientAssessmentComponentStyle.inherits(ComponentStyle);
function PatientAssessmentComponent(criterion){this.setCriterion(criterion);
this.setStyles(new PatientAssessmentComponentStyle());
this.setComponentLoadTimerName("USR:MPG.PATIENTASSESSMENT.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.PATIENTASSESSMENT.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(2);
this.setResultCount(1);
PatientAssessmentComponent.method("HandleSuccess",function(replyAr,component){CERN_PATIENT_ASSESSMENT_O1.RenderComponent(component,replyAr);
});
}PatientAssessmentComponent.inherits(MeasurementBaseComponent);
var CERN_PATIENT_ASSESSMENT_O1=function(){return{RenderComponent:function(component,replyAr){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var ar=[];
var totalCnt=0;
var groups=component.getGroups();
for(var x=0,xl=groups.length;
x<xl;
x++){var group=groups[x];
for(var y=replyAr.length;
y--;
){var reply=replyAr[y];
if(group.getGroupName()===reply.getName()){totalCnt+=getSubsection(group,reply.getResponse(),ar);
break;
}}}ar.unshift("<div class='",MP_Util.GetContentClass(component,totalCnt),"'>");
ar.push("</div>");
var sHTML=ar.join("");
var countText=MP_Util.CreateTitleText(component,totalCnt);
var compNS=component.getStyles().getNameSpace();
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
function getSubsection(group,recordData,ar){var sHTML="",countText="";
var measAr=[];
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var measureArray=CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArrayNoSort(recordData,personnelArray,codeArray);
var df=MP_Util.GetDateFormatter();
var measLen=measureArray.length;
for(var x=0;
x<measLen;
x++){var measObject=measureArray[x];
var display=measObject.getEventCode().display;
var oDate=measObject.getDateTime();
var sDate=(oDate)?df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR):"";
measAr.push("<dl class='pta-info'><dt class='pta-disp-lbl'>",display,"</dt><dd class='pta-name'>",display,"</dd><dt class='pta-res-lbl'>",i18n.discernabu.patientassessment_o1.RESULT," </dt><dd class ='pta-res'>");
measAr.push(MP_Util.Measurement.GetNormalcyResultDisplay(measObject));
measAr.push("</dd><dt class='ptadate'>",sDate,"</dt><dd class='pta-dt'><span class='date-time'>",sDate,"</span></dd></dl>");
}ar.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",group.getGroupName()," (",measLen,")</span></h3>");
if(measLen>0){ar.push("<div class='sub-sec-content'><div class='content-body'",">",measAr.join(""),"</div></div>");
}ar.push("</div>");
return measLen;
}}();
function PregnancyHistoryComponentStyle(){this.initByNamespace("preg");
}PregnancyHistoryComponentStyle.inherits(ComponentStyle);
function PregnancyHistoryComponent(criterion){this.setCriterion(criterion);
this.setStyles(new PregnancyHistoryComponentStyle());
this.setComponentLoadTimerName("USR:MPG.PREGNANCY_HISTORY.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.PREGNANCY_HISTORY.O1 - render component");
this.setIncludeLineNumber(true);
PregnancyHistoryComponent.method("InsertData",function(){CERN_PREG_HISTORY_O1.GetPregTable(this);
});
PregnancyHistoryComponent.method("HandleSuccess",function(recordData){CERN_PREG_HISTORY_O1.RenderComponent(this,recordData);
});
}PregnancyHistoryComponent.inherits(MPageComponent);
var CERN_PREG_HISTORY_O1=function(){return{GetPregTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0");
MP_Core.XMLCclRequestWrapper(component,"mp_get_pregnancy_history",sendAr,true);
},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var jsPREGHTML=[];
var buildSec=[];
var pregHTML="";
var childRecord="";
var childDetl="";
var eventObj="";
var sec="";
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var len=recordData.PREG_CNT;
jsPREGHTML.push("<div class ='",MP_Util.GetContentClass(component,len),"'>");
for(var i=0;
i<len;
i++){pregNum=i+1;
var pregRecord=recordData.PREG[i];
var childCnt=pregRecord.CHILD_CNT;
var tableBody=[];
var pregSpan="";
for(var j=0;
j<childCnt;
j++){num=j+1;
childRecord=pregRecord.CHILD[j];
childDetl=getDeliveryDatePrecision(childRecord);
if(childRecord.NEONATE_OUTCOME>0){eventObj=MP_Util.GetValueFromArray(childRecord.NEONATE_OUTCOME,codeArray);
childDetl+=", "+eventObj.display;
}if(childRecord.PREG_OUTCOME>0){eventObj=MP_Util.GetValueFromArray(childRecord.PREG_OUTCOME,codeArray);
childDetl+=", "+eventObj.display;
}if(childRecord.CHILD_GENDER){eventObj=MP_Util.GetValueFromArray(childRecord.CHILD_GENDER,codeArray);
childDetl+=", "+eventObj.display;
}if(childRecord.INFANT_WT!=""){childDetl+=", "+childRecord.INFANT_WT;
}if(childRecord.GEST_AT_BIRTH){childDetl+=", "+childRecord.GEST_AT_BIRTH;
}tableBody.push(" <dl class='preg-info'><dt>",i18n.PREGNANCY,"</dt><dd class='preg-baby'><span>",i18n.BABY,num,":</span><span class='preg-stat detail-line'>",childDetl,"</span></dd></dl><h4><span class='det-hd'>",i18n.PREGNANCY_DETAILS,"</span></h4><div class='hvr'><dl class='preg-det'><dt><span>",i18n.LENGTH_OF_LABOR,":</span></dt><dd><span>",childRecord.LENGTH_LABOR,"</span></dd><dt><span>",i18n.DELIVERY_HOSPITAL,":</span></dt><dd><span>",childRecord.DLV_HOSP,"</span></dd><dt><span>",i18n.CHILD_NAME,":</span></dt><dd><span>",childRecord.CHILD_NAME,"</span></dd><dt><span>",i18n.FATHER_NAME,":</span></dt><dd><span>",childRecord.FATHER_NAME,"</span></dd></dl></div>");
}var sensitivity=pregRecord.BSENSITIVITYIND;
if(sensitivity==1){pregSpan="preg-pic";
}else{pregSpan="preg-result";
}buildSec.push(" <div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='",pregSpan,"'></span><span class='sub-sec-title'>",i18n.PREGNANCY," #",pregNum,"</span></h3><div class='sub-sec-content'>",tableBody.join(""),"</div> </div>");
}jsPREGHTML.push(buildSec.join(""),"</div>");
pregHTML=jsPREGHTML.join("");
countText=MP_Util.CreateTitleText(component,len);
MP_Util.Doc.FinalizeComponent(pregHTML,component,countText);
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
function getDeliveryDatePrecision(childRecord){var dlvDT="";
var flag=childRecord.DLV_DATE_PRECISION_FLG;
if(flag==0){var dateTime=new Date();
dateTime.setISO8601(childRecord.DLV_DATE);
dlvDT=dateTime.format("shortDate3");
}else{dlvDT=childRecord.DLV_DATE;
}return dlvDT;
}}();
function VitalSignComponentStyle(){this.initByNamespace("vs");
}VitalSignComponentStyle.inherits(ComponentStyle);
function VitalSignComponent(criterion){this.setCriterion(criterion);
this.setLookBackDropDown(true);
this.setStyles(new VitalSignComponentStyle());
this.setIncludeLineNumber(false);
this.m_graphLink=1;
this.m_showTodayValue=false;
this.setResultCount(3);
this.setIncludeEventSetInfo(true);
this.setComponentLoadTimerName("USR:MPG.VITALSIGNS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.VITALSIGNS.O1 - render component");
VitalSignComponent.method("HandleSuccess",function(replyAr,component){CERN_VITALSIGN_O1.RenderComponent(component,replyAr);
});
VitalSignComponent.method("setGraphFlag",function(value){this.m_graphLink=value;
});
VitalSignComponent.method("getGraphFlag",function(){return(this.m_graphLink);
});
VitalSignComponent.method("setShowTodayValue",function(value){this.m_showTodayValue=value;
});
VitalSignComponent.method("isShowTodayValue",function(){return(this.m_showTodayValue);
});
VitalSignComponent.method("openTab",function(){var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+0+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"vitals.js","openTab");
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"VitalSigns");
});
VitalSignComponent.method("openDropDown",function(formID){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+formID+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"vitals.js","openDropDown");
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"VitalSigns");
});
VitalSignComponent.method("refresh",function(event,args){this.setEditMode(true);
MP_Util.Doc.HideHovers();
this.InsertData();
});
CERN_EventListener.addListener(this,EventListener.EVENT_CLINICAL_EVENT,this.refresh,this);
}VitalSignComponent.inherits(MeasurementBaseComponent);
var CERN_VITALSIGN_O1=function(){var VitalTable=function(seqGroup){var m_seqGroup=seqGroup;
var m_rows=[];
var m_eventSets=[];
this.addRows=function(group,recordData){var vitalsI18N=i18n.discernabu.vitals_o1;
var results=null;
var oVitalRow=null;
switch(group.getGroupName()){case vitalsI18N.TEMPERATURE:case vitalsI18N.HEART_RATE:case vitalsI18N.BLOOD_PRESSURE:results=CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArray(recordData);
oVitalRow=new VitalRow(group,m_seqGroup);
oVitalRow.init(results);
m_rows.push(oVitalRow);
break;
default:results=CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataMap(recordData);
flattenEventSets(recordData.EVENT_SETS);
for(var x=results.length;
x--;
){oVitalRow=new VitalRow(group,m_seqGroup);
var result=results[x];
oVitalRow.setId(m_eventSets[result.name]);
oVitalRow.init(result);
m_rows.push(oVitalRow);
}break;
}};
this.getRows=function(){return m_rows;
};
function flattenEventSets(eventSets){if(eventSets&&!m_eventSets.length){for(var x=eventSets.length;
x--;
){var eventSet=eventSets[x];
m_eventSets[eventSet.EVENT_SET_NAME]=eventSet.EVENT_SET_CD;
}}}};
var BPResult=function(label,measAr){var m_ar=measAr;
var m_disp=label;
var m_date=null;
if(measAr&&measAr.length>0){m_date=(measAr[0])?measAr[0].getDateTime():measAr[1].getDateTime();
}this.getDisplay=function(){return m_disp;
};
this.getResults=function(){return m_ar;
};
this.getDateTime=function(){return m_date;
};
};
var VitalRow=function(group,seqGroup){var m_dis=null;
var m_seq=0;
var m_id=0;
var m_measAr=null;
var m_type=0;
var m_group=group;
var m_seqGroup=seqGroup;
this.init=function(results){var vitalsI18N=i18n.discernabu.vitals_o1;
switch(m_group.getGroupName()){case vitalsI18N.TEMPERATURE:m_seq=1;
m_measAr=results;
m_dis=vitalsI18N.TEMPERATURE;
m_id=m_group.getGroupId();
m_type=CERN_VITALSIGN_O1.TYPE_TEMPERATURE;
break;
case vitalsI18N.HEART_RATE:m_seq=2;
m_measAr=results;
m_dis=vitalsI18N.HEART_RATE;
m_id=m_group.getGroupId();
m_type=CERN_VITALSIGN_O1.TYPE_STANDARD_GROUPING;
break;
case vitalsI18N.BLOOD_PRESSURE:m_seq=3;
m_measAr=pairResults(results);
m_dis=vitalsI18N.BLOOD_PRESSURE;
m_id=m_group.getGroupId();
m_type=CERN_VITALSIGN_O1.TYPE_BLOOD_PRESSURE;
break;
default:m_seq=4;
m_measAr=results.value;
m_dis=results.name;
m_type=CERN_VITALSIGN_O1.TYPE_DISCRETE_RESULT;
break;
}if(m_seqGroup){var items=m_seqGroup.getItems();
for(var x=items.length;
x--;
){if(items[x]===m_id){m_seq=x;
break;
}}}};
this.getDisplay=function(){return m_dis;
};
this.getSequence=function(){return m_seq;
};
this.setId=function(val){m_id=val;
};
this.getId=function(){return m_id;
};
this.getMeasureArray=function(){return m_measAr;
};
this.getType=function(){return m_type;
};
this.getEventSets=function(){if(m_group instanceof MPageEventSetGroup){return m_group.getEventSets();
}return null;
};
function pairResults(meas){var bpMeas1=[];
var bpMeas2=[];
var bpMeas3=[];
var measCnt=0;
var label1="";
var label2="";
var label3="";
var currMeas=0;
var bpEventCds=[];
for(var j=0;
((j<meas.length)&&(measCnt<3));
j++){currMeas=meas[j];
var k=j;
var matchFound=false;
var label=[];
var meas1,meas2;
if(currMeas!=-1){if(k+1<(meas.length)){while(currMeas.getDateTime().getTime()==meas[k+1].getDateTime().getTime()){if(currMeas.getUpdateDateTime().getTime()==meas[k+1].getUpdateDateTime().getTime()){label=checkBPPair(currMeas.getEventCode().codeValue,meas[k+1].getEventCode().codeValue,group);
if(label[0]){matchFound=true;
measCnt++;
if(label[1]){meas1=currMeas;
meas2=meas[k+1];
}else{meas2=currMeas;
meas1=meas[k+1];
}if(measCnt==1){bpMeas1.push(meas1);
bpMeas1.push(meas2);
label1=label[0];
}if(measCnt==2){bpMeas2.push(meas1);
bpMeas2.push(meas2);
label2=label[0];
}if(measCnt==3){bpMeas3.push(meas1);
bpMeas3.push(meas2);
label3=label[0];
}meas.splice(k+1,1);
break;
}}k++;
if(k>=(meas.length-1)){break;
}}}if(!matchFound){measCnt++;
var labelOrder=getBPLabel(currMeas.getEventCode().codeValue,group);
if(labelOrder[1]==0){meas1=currMeas;
meas2=0;
}else{meas2=currMeas;
meas1=0;
}if(measCnt==1){bpMeas1.push(meas1);
bpMeas1.push(meas2);
label1=labelOrder[0];
}if(measCnt==2){bpMeas2.push(meas1);
bpMeas2.push(meas2);
label2=labelOrder[0];
}if(measCnt==3){bpMeas3.push(meas1);
bpMeas3.push(meas2);
label3=labelOrder[0];
}}}}var returnAr=[];
if(bpMeas1&&bpMeas1.length>0){returnAr.push(new BPResult(label1,bpMeas1));
}if(bpMeas2&&bpMeas2.length>0){returnAr.push(new BPResult(label2,bpMeas2));
}if(bpMeas3&&bpMeas3.length>0){returnAr.push(new BPResult(label3,bpMeas3));
}return returnAr;
}function getBPLabel(codeValue,group){if(group instanceof MPageGrouper){var bpGroups=group.getGroups();
for(var y=0;
y<bpGroups.length;
y++){if(bpGroups[y] instanceof MPageEventCodeGroup){var groupName=bpGroups[y].getGroupName();
ecArry=bpGroups[y].getEventCodes();
for(var i=0;
i<ecArry.length;
i++){if(ecArry[i]==codeValue){if(i==0){return[groupName,0];
}else{return[groupName,1];
}}}}}}}function checkBPPair(eventCd1,eventCd2,group){var cd1Fnd=false,cd2Fnd=false;
var ec="";
var correctOrder=true;
var ecArry=[];
if(group instanceof MPageGrouper){var bpGroups=group.getGroups();
for(var y=0;
y<bpGroups.length;
y++){if(bpGroups[y] instanceof MPageEventCodeGroup){ecArry=bpGroups[y].getEventCodes();
for(var i=0;
i<ecArry.length;
i++){if(ecArry[i]==eventCd1){cd1Fnd=true;
if(i==0){correctOrder=true;
}else{correctOrder=false;
}}else{if(ecArry[i]==eventCd2){cd2Fnd=true;
}}}if(cd1Fnd&&cd2Fnd){return([bpGroups[y].getGroupName(),correctOrder]);
}}cd1Fnd=false;
cd2Fnd=false;
}}return([false,false]);
}};
var HoverResults=function(oMeasure){var m_df=MP_Util.GetDateFormatter();
var m_normalcy=MP_Util.Measurement.GetNormalcyClass(oMeasure);
var m_date=m_df.format(oMeasure.getDateTime(),mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
var m_display=(oMeasure.getEventCode())?oMeasure.getEventCode().display:"";
var m_status=(oMeasure.getStatus())?oMeasure.getStatus().display:"";
var m_sResult=MP_Util.Measurement.GetString(oMeasure);
var m_sCritHigh="",m_sCritLow="",m_sNormHigh="",m_sNormLow="";
var m_results=oMeasure.getResult();
if(m_results instanceof MP_Core.QuantityValue){var refRange=m_results.getRefRange();
if(refRange){if(refRange.getCriticalHigh()!=0||refRange.getCriticalLow()!=0){m_sCritHigh=refRange.getCriticalHigh();
m_sCritLow=refRange.getCriticalLow();
}if(refRange.getNormalHigh()!=0||refRange.getNormalLow()!=0){m_sNormHigh=refRange.getNormalHigh();
m_sNormLow=refRange.getNormalLow();
}}}this.getDisplay=function(){return m_display;
};
this.getStatus=function(){return m_status;
};
this.getDateTime=function(){return m_date;
};
this.getNormalcy=function(){return m_normalcy;
};
this.getCriticalHigh=function(){return m_sCritHigh;
};
this.getCriticalLow=function(){return m_sCritLow;
};
this.getNormalHigh=function(){return m_sNormHigh;
};
this.getNormalLow=function(){return m_sNormLow;
};
this.getResultDisplay=function(){return m_sResult;
};
this.toHTML=function(){var vitalsI18n=i18n.discernabu.vitals_o1;
var ar=["<h4 class='det-hd'><span>",vitalsI18n.LABORATORY_DETAILS,"</span></h4><div class='hvr'><dl class='vs-det'><dt class='vs-det-type'><span>",m_display,":</span></dt><dd class='result'><span class='",m_normalcy,"'>",m_sResult,"</span></dd><dt class='vs-det-type'><span>",vitalsI18n.DATE_TIME,":</span></dt><dd class='result'><span>",m_date,"</span></dd><dt class='vs-det-type'><span>",vitalsI18n.STATUS,":</span></dt><dd class='result'><span>",m_status,"</span></dd><dt class='vs-det-type'><span>",vitalsI18n.NORMAL_LOW,":</span></dt><dd class='result'><span>",m_sNormLow,"</span></dd><dt class='vs-det-type'><span>",vitalsI18n.NORMAL_HIGH,":</span></dt><dd class='result'><span>",m_sNormHigh,"</span></dd><dt class='vs-det-type'><span>",vitalsI18n.CRITICAL_LOW,":</span></dt><dd class='result'><span>",m_sCritLow,"</span></dd><dt class='vs-det-type'><span>",vitalsI18n.CRITICAL_HIGH,":</span></dt><dd class='result'><span>",m_sCritHigh,"</span></dd></dl></div>"];
return ar.join("");
};
};
return{RenderComponent:function(component,replyAr){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var ar=[];
var x=0,y=0,xl=0;
var vitalsI18n=i18n.discernabu.vitals_o1;
var seqGroup=null;
var withinText=(component.getDateFormat()==3)?("<span>"+vitalsI18n.WITHIN+"</span>"):"";
var firstColumnHeader=component.isShowTodayValue()?vitalsI18n.TODAY:vitalsI18n.LATEST;
var groups=component.getGroups();
for(x=groups.length;
x--;
){if(groups[x] instanceof MPageSequenceGroup){seqGroup=groups[x];
break;
}}var oVitalTable=new VitalTable(seqGroup);
for(x=replyAr.length;
x--;
){var reply=replyAr[x];
if(reply.getStatus()==="S"){for(y=groups.length;
y--;
){var group=groups[y];
if(group.getGroupName()===reply.getName()){oVitalTable.addRows(group,reply.getResponse());
}}}}var vitalRows=oVitalTable.getRows();
vitalRows.sort(SortVitalRows);
ar.push("<div class='",MP_Util.GetContentClass(component,vitalRows.length),"'>");
ar.push("<div class='content-hdr'><table class='vs-table'><tr class='hdr'><th class='vs-lbl'><span>&nbsp;</span></th><th class='vs-res0'><span>",firstColumnHeader,"</span><br /><span>",withinText,"</span></th><th class='vs-res1'><span>",vitalsI18n.PREVIOUS,"</span><br /><span>",withinText,"</span></th></tr></table><table class='vs-table'>");
for(x=0,xl=vitalRows.length;
x<xl;
x++){ar.push("<tr class='",((x%2)==0)?"odd":"even","'>");
ar.push(createVitalRow(vitalRows[x],component));
ar.push("</tr>");
}ar.push("</table></div></div>");
var sHTML=ar.join("");
var countText=MP_Util.CreateTitleText(component,vitalRows.length);
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}component.setEditMode(false);
}}};
function createVitalRow(row,component){var ar=[];
if(component.getGraphFlag()===1){var compId=component.getComponentId();
var groupId=(row.getType()!==CERN_VITALSIGN_O1.TYPE_DISCRETE_RESULT)?row.getId():0;
var eventCode=(row.getType()===CERN_VITALSIGN_O1.TYPE_DISCRETE_RESULT)?row.getMeasureArray()[0].getEventCode().codeValue:0;
ar.push("<td class='vs-lbl'><span class='row-label'><a onClick='MP_Util.GraphResults(",eventCode,",",compId,",",groupId,");'>",row.getDisplay(),"</a></span></td>");
}else{ar.push("<td class='vs-lbl'><span class='row-label'>",row.getDisplay(),"</span></td>");
}ar.push(createVitalCells(row,component));
return ar.join("");
}function createVitalCells(row,component){var ar=[];
var x=0;
var vitalsI18n=i18n.discernabu.vitals_o1;
var oMeasures=row.getMeasureArray();
var nMeasures=(oMeasures.length>3)?3:oMeasures.length;
var timeNow=new Date();
var colNumber=0;
var firstVal=oMeasures[0];
if(component.isShowTodayValue()){if(timeNow.getFullYear()!==firstVal.getDateTime().getFullYear()||timeNow.getMonth()!==firstVal.getDateTime().getMonth()||timeNow.getDate()!==firstVal.getDateTime().getDate()){nMeasures=(oMeasures.length>2)?2:oMeasures.length;
ar.push("<td class='vs-res",colNumber,"'><dl class='vs-info'><dt><span>",vitalsI18n.VALUE,"</span></dt><dd class='vs-res'><span>--</span></dd></dl></td>");
colNumber++;
}}for(x=0;
x<nMeasures;
x++){var oVal=oMeasures[x];
var faceUpDtTm=null;
if(row.getType()!==CERN_VITALSIGN_O1.TYPE_BLOOD_PRESSURE){faceUpDtTm=MP_Util.DisplayDateByOption(component,oVal.getDateTime());
var includeMaxResult=(row.getType()===CERN_VITALSIGN_O1.TYPE_TEMPERATURE&&x===0)?true:false;
if(includeMaxResult){var criterion=component.getCriterion();
var sEncntr=(component.getScope()==2)?criterion.encntr_id+".0":"0.0";
var sEventSets=MP_Util.CreateParamArray(row.getEventSets(),1);
var tempAr=[criterion.person_id+".0",sEncntr,criterion.provider_id+".0",criterion.position_cd+".0",'"'+sEventSets+'"'];
ar.push("<td onmouseover='CERN_VITALSIGNS_O1_UTIL.GetMaxMinTempResult(this, ",tempAr.join(","),");' class='vs-res",colNumber,"'>");
}else{ar.push("<td class='vs-res",colNumber,"'>");
}ar.push("<dl class='vs-info'><dt><span>",vitalsI18n.VALUE,"</span></dt><dd class='vs-res'>",MP_Util.Measurement.GetNormalcyResultDisplay(oVal,true),"<br /><span class='within'>",faceUpDtTm,"</span></dd></dl>",createVitalCellHover(oVal),"</td>");
}else{var resAr=oVal.getResults();
faceUpDtTm=MP_Util.DisplayDateByOption(component,oVal.getDateTime());
var sRes1=(resAr[0])?MP_Util.Measurement.GetNormalcyResultDisplay(resAr[0],true):"--";
var sRes2=(resAr[1])?MP_Util.Measurement.GetNormalcyResultDisplay(resAr[1],true):"--";
ar.push("<td class='vs-res",colNumber,"'><dl class='vs-info'><dt><span>",vitalsI18n.VALUE,"</span></dt><dd class='vs-res'>",sRes1,"/",sRes2,"<br /><span class='within'>",faceUpDtTm,"</span></dd></dl>",createVitalCellHover(oVal),"</td>");
}colNumber++;
}for(x=nMeasures;
x<3;
x++){ar.push("<td class='vs-res",x,"'><dl class='vs-info'><dt><span>",vitalsI18n.VALUE,"</span></dt><dd class='vs-res'><span>--</span></dd></dl></td>");
}return ar.join("");
}function createBPHoverSpan(val1,val2,label,spanClass1,spanClass2){if((!val1||val1==="")&&(!val2||val2==="")){return("<dt class='vs-det-type'><span>"+label+":</span></dt><dd class='result'></dd>");
}var returnAr=["<dt class='vs-det-type'><span>",label,":</span></dt><dd class='result'>"];
var span1=(spanClass1)?"<span class='"+spanClass1+"'>":"<span>";
var span2=(spanClass2)?"<span class='"+spanClass2+"'>":"<span>";
if(val1&&val1!==""){returnAr.push(span1,val1,"</span>");
}else{returnAr.push(span1,"--</span>");
}returnAr.push(" / ");
if(val2&&val2!==""){returnAr.push(span2,val2,"</span>");
}else{returnAr.push(span2,"--</span>");
}returnAr.push("</dd>");
return returnAr.join("");
}function createVitalCellHover(meas){var ar=[];
var vitalsI18n=i18n.discernabu.vitals_o1;
if(meas instanceof BPResult){var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var measAr=meas.getResults();
var meas1=measAr[0];
var meas2=measAr[1];
var hov1=(meas1)?new HoverResults(meas1):null;
var hov2=(meas2)?new HoverResults(meas2):null;
var resVal1=null;
var resVal2=null;
var resNormalcy1=null;
var resNormalcy2=null;
var normLow1=null;
var normLow2=null;
var normHigh1=null;
var normHigh2=null;
var critLow1=null;
var critLow2=null;
var critHigh1=null;
var critHigh2=null;
var status1=null;
var status2=null;
var dateTime=null;
if(meas1){resNormalcy1=hov1.getNormalcy();
resVal1=hov1.getResultDisplay();
normLow1=hov1.getNormalLow();
normHigh1=hov1.getNormalHigh();
critLow1=hov1.getCriticalLow();
critHigh1=hov1.getCriticalHigh();
status1=hov1.getStatus();
dateTime=hov1.getDateTime();
}if(meas2){resNormalcy2=hov2.getNormalcy();
resVal2=hov2.getResultDisplay();
normLow2=hov2.getNormalLow();
normHigh2=hov2.getNormalHigh();
critLow2=hov2.getCriticalLow();
critHigh2=hov2.getCriticalHigh();
status2=hov2.getStatus();
dateTime=hov2.getDateTime();
}ar.push("<h4 class='det-hd'><span>",vitalsI18n.LABORATORY_DETAILS,"</span></h4><div class='hvr'><dl class='vs-det'>",createBPHoverSpan(resVal1,resVal2,meas.getDisplay(),resNormalcy1,resNormalcy2),"<dt class='vs-det-type'><span>",vitalsI18n.DATE_TIME,":</span></dt><dd class='result'><span>",dateTime,"</span></dd>",createBPHoverSpan(status1,status2,vitalsI18n.STATUS),createBPHoverSpan(normLow1,normLow2,vitalsI18n.NORMAL_LOW),createBPHoverSpan(normHigh1,normHigh2,vitalsI18n.NORMAL_HIGH),createBPHoverSpan(critLow1,critLow2,vitalsI18n.CRITICAL_LOW),createBPHoverSpan(critHigh1,critHigh2,vitalsI18n.CRITICAL_HIGH));
ar.push("</dl></div>");
}else{var hover=new HoverResults(meas);
ar.push(hover.toHTML());
}return ar.join("");
}function SortVitalRows(a,b){if(a.getSequence()>b.getSequence()){return 1;
}else{if(a.getSequence()<b.getSequence()){return -1;
}}if(a.getDisplay().toUpperCase()>b.getDisplay().toUpperCase()){return 1;
}if(a.getDisplay().toUpperCase()<b.getDisplay().toUpperCase()){return -1;
}return 0;
}}();
CERN_VITALSIGN_O1.TYPE_STANDARD_GROUPING=0;
CERN_VITALSIGN_O1.TYPE_TEMPERATURE=1;
CERN_VITALSIGN_O1.TYPE_BLOOD_PRESSURE=2;
CERN_VITALSIGN_O1.TYPE_DISCRETE_RESULT=3;
var CERN_VITALSIGNS_O1_UTIL=function(){return{GetMaxMinTempResult:function(cell,personId,encntrId,providerId,pprCd,eventSetCds){if(!Util.Style.ccss(cell,"vs-cached")){var vitalI18N=i18n.discernabu.vitals_o1;
Util.Style.acss(cell,"vs-cached");
var hvrDiv=Util.Style.g("hvr",cell,"div");
var dl=Util.Style.g("vs-det",hvrDiv[0],"dl");
var spanMaxResult=AddAdditionalElement(dl[0],vitalI18N.TWO_DAY_MAX);
var spanMinResult=AddAdditionalElement(dl[0],vitalI18N.TWO_DAY_MIN);
var timerGetMaxTemp=MP_Util.CreateTimer("ENG:MPG.VITALSIGNS.O1 - get 48 hour max temp");
var info=new XMLCclRequest();
info.onreadystatechange=function(){if(this.readyState==4&&this.status==200){try{MP_Util.LogScriptCallInfo(null,this,"vitals.js","GetMaxMinTempResult");
var jsonEval=JSON.parse(this.responseText);
var recordData=jsonEval.RECORD_DATA;
var df=MP_Util.GetDateFormatter();
if(recordData.STATUS_DATA.STATUS==="S"){var results=CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArray(recordData);
results.sort(SortTemperatures);
var maxResult=results[0];
var minResult=results[results.length-1];
var sDateMax="&nbsp;<span>"+df.format(maxResult.getDateTime(),mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)+"</span>";
var sDateMin="&nbsp;<span>"+df.format(minResult.getDateTime(),mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)+"</span>";
spanMaxResult.innerHTML=MP_Util.Measurement.GetNormalcyResultDisplay(maxResult)+sDateMax;
spanMinResult.innerHTML=MP_Util.Measurement.GetNormalcyResultDisplay(minResult)+sDateMin;
}else{if(recordData.STATUS_DATA.STATUS==="Z"){spanMaxResult.innerHTML="&nbsp;";
spanMinResult.innerHTML="&nbsp;";
}else{spanMaxResult.innerHTML=vitalI18N.ERROR_RETREIVING_DATA;
spanMinResult.innerHTML=vitalI18N.ERROR_RETREIVING_DATA;
}}}catch(err){MP_Util.LogJSError(err,null,"vitals.js","GetMaxMinTempResult");
if(timerGetMaxTemp){timerGetMaxTemp.Abort();
timerGetMaxTemp=null;
}spanMaxResult.innerHTML=vitalI18N.ERROR_RETREIVING_DATA;
spanMinResult.innerHTML=vitalI18N.ERROR_RETREIVING_DATA;
}finally{if(timerGetMaxTemp){timerGetMaxTemp.Stop();
}}}if(this.readyState==4){MP_Util.ReleaseRequestReference(this);
}};
info.open("GET","MP_RETRIEVE_N_RESULTS_JSON",true);
var sendAr=["^MINE^",personId+".0",encntrId+".0",providerId+".0",pprCd+".0",200,"^^",eventSetCds,"0.0",2,2];
info.send(sendAr.join(","));
}}};
function SortTemperatures(a,b){var val1=GetFahrenheitValue(a);
var val2=GetFahrenheitValue(b);
if(val1>val2){return -1;
}else{if(val1<val2){return 1;
}}return 0;
}function GetFahrenheitValue(temp){var tempObj=temp.getResult();
var uom=(tempObj.getUOM())?tempObj.getUOM().meaning:"";
var tempVal=parseFloat(MP_Util.Measurement.GetString(temp,null,null,true));
if(uom==="DEGC"||tempVal<55){tempVal=(tempVal*1.8)+32;
}return tempVal;
}function AddAdditionalElement(dl,label){var dt=Util.cep("dt",{className:"vs-det-type"});
var span=Util.cep("span");
var txt=document.createTextNode(label+":");
Util.ac(txt,span);
Util.ac(span,dt);
Util.ac(dt,dl);
var dd=Util.cep("dd",{className:"result"});
var spanResult=Util.cep("span");
var txtResult=document.createTextNode(i18n.discernabu.vitals_o1.LOADING_DATA+"...");
Util.ac(txtResult,spanResult);
Util.ac(spanResult,dd);
Util.ac(dd,dl);
return spanResult;
}}();
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
	var ieVersion=new Number(RegExp.$1); // capture x.x portion and store as a number
}
else {
	var ieVersion=0;
}

function RenderNursingCommunication(){
	MP_Util.LogDebug("Rendering Nursing Communication mPages");
    var sitCriterion = createPageCriterion("MP_NC_SIT_BACK_V4");
	var assessmentCriterion = createPageCriterion("MP_NC_ASSESS_V4");
	var recommendationCriterion = createPageCriterion("MP_NC_REC_V4");
	

	var tab1 = retrieveMPage(sitCriterion, sitCriterion.category_mean);
	var tab2 = retrieveMPage(assessmentCriterion, assessmentCriterion.category_mean);
	var tab3 = retrieveMPage(recommendationCriterion, recommendationCriterion.category_mean);

	setupNursingSpecificComponentSettings(tab1.getComponents());
	setupNursingSpecificComponentSettings(tab2.getComponents());
	setupNursingSpecificComponentSettings(tab3.getComponents());
	
	var mpAr = [tab1,tab2,tab3];

    //Extra padding added to fill the background tab image
    if(!tab1.getName()) {
		tab1.setName(i18n.SITUATION_BACKGROUND);
	}
	
	if(!tab2.getName()) {
		tab2.setName(i18n.ASSESSMENT);
	}
	
	if(!tab3.getName()) {
		tab3.setName(i18n.RECOMMENDATION);
	}
    
	tab1.setHelpFileURL("https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Nursing&culture=en-US&release=4");
	tab2.setHelpFileURL("https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Nursing&culture=en-US&release=4");
	tab3.setHelpFileURL("https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Nursing&culture=en-US&release=4");
	
	tab1.setHelpFileName(sitCriterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\nursingcommunication\\\\R4 Nursing Communication Help.html");
	tab2.setHelpFileName(assessmentCriterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\nursingcommunication\\\\R4 Nursing Communication Help.html");
	tab3.setHelpFileName(recommendationCriterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\nursingcommunication\\\\R4 Nursing Communication Help.html");
    
	tab1.setCustomizeEnabled(false);
	tab2.setCustomizeEnabled(false);
	tab3.setCustomizeEnabled(false);

	var tabAr = [new MP_Core.MapObject("PAGE_TAB_01", tab1), new MP_Core.MapObject("PAGE_TAB_02", tab2), new MP_Core.MapObject("PAGE_TAB_03", tab3)];

    var bDisplayBanner = false;
    var csEnabled = false;
    for (x = tabAr.length; x--;) {
        var tabObj = tabAr[x];
        var page = tabObj.value;
        if (page.isBannerEnabled()) {
            bDisplayBanner = page.isBannerEnabled();
        }

        if (page.isChartSearchEnabled()) {
            csEnabled = page.isChartSearchEnabled();
        }
    }

	setupTabbedMPage(recommendationCriterion, tabAr, i18n.NURSING_COMMUNICATION, bDisplayBanner, csEnabled);
}


function RenderPregnancySummary(){
	MP_Util.LogDebug("Rendering Pregnancy Summary mPage");
	var mpageCategoryMean ="MP_PREG_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
	}
	if (timerMPage) {
		timerMPage.Stop();
	}
	
	//This function will load all pregnancy specific data	
	PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(criterion);
	
	//this function will check if the patient is a female/male AND
	//if female, then if they have active open pregnancy before displaying pregnancy summary mpage.
	var loadingRequirementsFailed = PREGNANCY_BASE_UTIL_O1.CheckPregnancySummaryLoadRequirement();
		
								 
	if (!loadingRequirementsFailed) {
		var mpage = retrieveMPage(criterion, mpageCategoryMean);
		if(!mpage.getName()) {
			mpage.setName(i18n.PREGNANCY_SUMMARY);
		}
		setupPregnancySpecificComponentSettings(mpage.getComponents());
		//only display the Printable Report link, if the bedrock preference with the report name is set/populated under the page level settings.
		var printReportName = mpage.getPrintableReportName();
		if(printReportName !== ""){
			mpage.addTitleAnchor("<a id=printView onclick='MP_Util.PrintReport(\"" + printReportName + "\"," + criterion.person_id + "," + criterion.encntr_id + ");'>"+i18n.PRINT_REPORT+"</a>");
		}
		setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Pregnancy&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\pregnancysummary\\\\R4 Pregnancy Summary Help.html");		
	}
}

function setupPregnancySpecificComponentSettings(components){
	if (components && components.length > 0) {
		for (var x = components.length; x--;) {
			var component = components[x];
			// the lookback date will be bedrock preference for: home medication, and medication components
			if (component instanceof DiagnosticsComponent ||
				component instanceof LaboratoryComponent ||
				component instanceof MicrobiologyComponent ||
				component instanceof DocumentComponent ||
				component instanceof NotesRemindersComponent ||
				component instanceof PathologyComponent ||
				component instanceof EducationAndCounselingComponent ||
				component instanceof BirthPlanComponent) {
				component.setLookbackUnitTypeFlag(2);
				component.setLookbackUnits(PREGNANCY_BASE_UTIL_O1.getLookBack());
			}
		}
	}
}


function RenderDischargeSummary(){
	MP_Util.LogDebug("Rendering Discharge Summary mPage");
	var mpageCategoryMean = "MP_DC_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);

	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
	}
	if (timerMPage) {
		timerMPage.Stop();
	}

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.DISCHARGE_SUMMARY);
	}
	mpage.addTitleAnchor("<a id=otherAnchors title='"+i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS+"' onclick='javascript:OpenDischargeProcess("+criterion.encntr_id+","+criterion.person_id+","+criterion.provider_id+");'>"+i18n.DISCHARGE_PROCESS+"</a>");
	
	//unique to the discharge summary mpage, set the mpage name on all the components
	var components = mpage.getComponents();
	for ( var x = components.length; x--;) {
		components[x].setMPageName(mpageCategoryMean);
	}
	
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=DischargeReadiness&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\dischargesummary\\\\R4 Discharge Readiness Help.html");
}

function RenderPulmonarySummary(){
	MP_Util.LogDebug("Rendering Pulmonary Summary mPage");
	var mpageCategoryMean = "MP_RT_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
		timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
		timerMPage.Stop();
    }

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.PULMONARY_SUMMARY);
	}
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=PulmonarySummary&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\pulmonarysummary\\\\R4 Pulmonary Summary Help.html");
}

function RenderICUDashboard(){
	MP_Util.LogDebug("Rendering ICU Dashboard mPage");
	var mpageCategoryMean = "MP_ICU_DASHBOARD";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
		timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
		timerMPage.Stop();
    }

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.discernabu.ICU_DASHBOARD);
	}
	mpage.setCustomizeEnabled(false);
	setupSingleMPage(criterion, mpage);
}

function RenderICUSummary(){
	MP_Util.LogDebug("Rendering ICU Summary mPage");
	var mpageCategoryMean = "MP_ICU_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
		timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
		timerMPage.Stop();
    }

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.ICU_SUMMARY);
	}
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=ICUSummary&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\icusummary\\\\R4 ICU Summary Help.html");
}

function RenderInpatientSummary(){
	MP_Util.LogDebug("Rendering Inpatient Summary mPage");
	var mpageCategoryMean = "MP_INPT_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
		timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
		timerMPage.Stop();
    }

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.INPATIENT_SUMMARY);
	}
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=InpatientSummary&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\ipsummary\\\\R4 Inpatient Summary Help.html");
}

function RenderIntraopComm(){
    MP_Util.LogDebug("Rendering Intraoperative Communication Summary mPage");
    var mpageCategoryMean = "MP_INTRAOP_COMM_V4";
    var criterion = createPageCriterion(mpageCategoryMean);
    
    var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
        timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
        timerMPage.Stop();
    }

    var mpage = retrieveMPage(criterion, mpageCategoryMean);
    if(!mpage.getName()) {
    	mpage.setName(i18n.INTRAOP_COMM);
    }
    setupSingleMPage(criterion, mpage, "", "");
}

function RenderPostopComm(){
    MP_Util.LogDebug("Rendering Postoperative Communication Summary mPage");
    var mpageCategoryMean = "MP_POSTOP_COMM_V4";
    var criterion = createPageCriterion(mpageCategoryMean);
    
    var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
        timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
        timerMPage.Stop();
    }

    var mpage = retrieveMPage(criterion, mpageCategoryMean);
    if(!mpage.getName()) {
    	mpage.setName(i18n.POSTOP_COMM);
    }
    setupSingleMPage(criterion, mpage, "", "");
}
         
function RenderPreopComm(){  
    MP_Util.LogDebug("Rendering Preoperative Communication Summary mPage");
    var mpageCategoryMean = "MP_PREOP_COMM_V4";
    var criterion = createPageCriterion(mpageCategoryMean);
    
    var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
        timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
        timerMPage.Stop();
    }

    var mpage = retrieveMPage(criterion, mpageCategoryMean);
    if(!mpage.getName()) {
    	mpage.setName(i18n.PREOP_COMM);
    }
    setupSingleMPage(criterion, mpage, "", "");
}

function RenderEDSummary(){
	MP_Util.LogDebug("Rendering ED Summary mPage");
	var mpageCategoryMean = "MP_ED_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);

	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
	}
	if (timerMPage) {
		timerMPage.Stop();
	}

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.ED_SUMMARY);
	}
	
	
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=EDSummary&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\edsummary\\\\R4 ED Summary Help.html");
}

function RenderAmbulatorySummary() {
	MP_Util.LogDebug("Rendering Ambulatory Summary mPage");
	var mpageCategoryMean = "MP_AMB_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);

	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
	}
	if (timerMPage) {
		timerMPage.Stop();
	}

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.AMBULATORYSUMMARYMPAGE);
	}
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=AmbulatorySummary&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\ambulatorysummary\\\\R4 Ambulatory Summary Help.html");
}

function RenderMasterSummary() {
	MP_Util.LogDebug("Rendering Master Summary mPage");
	var mpageCategoryMean = "MP_DABU_STD";
	var criterion = createPageCriterion(mpageCategoryMean);

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName("Discern Master Summary");
	}
	
	/*Special case handling the setup of the Overdue Tasks component.  Currently no BR settings for this.*/
	var componentList = mpage.getComponents();
	if (componentList.length) {
		for ( var x = componentList.length; x--;) {
			var component = componentList[x];
			if (component instanceof TaskActivityComponent) {
				component.setLookbackDays(1);
				component.addTaskStatusMeaning("OVERDUE");
			}
		}
	}
	setupSingleMPage(criterion, mpage);
}
function RenderRehabilitationSummary() {
	MP_Util.LogDebug("Rendering Rehabilitation Summary mPage");
	var mpageCategoryMean = "MP_REHAB_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);

	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
	}
	if (timerMPage) {
		timerMPage.Stop();
	}

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName("Rehabilitation Summary");
	}
	setupSingleMPage(criterion, mpage,"https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Rehabilitation&culture=en-US&release=4",criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\rehabsummary\\\\R4 Rehabilitation Summary Help.html");		 
}
function RenderOrthopedicSummary(){
	MP_Util.LogDebug("Rendering Orthopedic Summary mPage");
	var mpageCategoryMean = "MP_ORTHO_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
		timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
		timerMPage.Stop();
    }
    
	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	//Add links once help file is available
	if(!mpage.getName()) {
		mpage.setName("Orthopedic Summary");
	}
	setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=OrthopedicSummary&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\orthopedicsummary\\\\R4 Orthopedic Summary Help.html");
}
function RenderSIBRSummary() {
	MP_Util.LogDebug("Rendering SIBR Summary mPage");
	var mpageCategoryMean = "MP_SIBR_SUMMARY_V4";
	var criterion = createPageCriterion(mpageCategoryMean);

	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
	}
	if (timerMPage) {
		timerMPage.Stop();
	}

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.SIBRSUMMARYMPAGE);
	}
	setupSingleMPage(criterion, mpage, "", "");
}
function RenderCommonOrders(){
	var mpageCategoryMean = "MP_COMMON_ORDERS_V4";
	var criterion = createPageCriterion(mpageCategoryMean);

	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
	if (timerMPage) {
		timerMPage.SubtimerName = mpageCategoryMean;
		timerMPage.Stop();
	}
	
	MP_Util.LogInfo("Rendering Quick Orders and Charges mPages");
	var viewObj = JSON.parse(viewJSONObject);
	var vArr = [];
	var tabAr = [];
	var tab = null;
	var vCriterion = null;
	var tabName = "QOC_PAGE_TAB_";
	var tabNameStr = "";
	var tabId = 0;

	var vl = viewObj.order_selection.views.length;
	if (vl)
	{
		for (var v = 0; v < vl; v++) {
			vCriterion = createPageCriterion(viewObj.order_selection.views[v].label);
			tab = retrieveMPage(vCriterion, vCriterion.category_mean);
			tab.setName(viewObj.order_selection.views[v].label);
			tab.setCustomizeEnabled(false);
			tab.setHelpFileURL("https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=quickorders&culture=en-US&release=4");
			tab.setHelpFileName(criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\quickordersandcharges\\\\R4 Quick Orders and Charges MPages View Help.html");
			tabNameStr = tabName+(v < 10 ? '0':'') + v;
			tabAr.push(new MP_Core.MapObject(tabNameStr, tab));
		}
	
		var bDisplayBanner = false;
		for (var x = tabAr.length; x--;) {
			var tabObj = tabAr[x];
			
			//modify component id so it is unique per view/venue
			var key = tabAr[x].name;
			var page = tabAr[x].value;
			var arrComp = page.getComponents()
			for (var y = arrComp.length; y--;) {
				var newCompId = arrComp[y].getComponentId() + "|" + key;
				arrComp[y].setComponentId(newCompId);
			}
	
			var page = tabObj.value;
			if (page.isBannerEnabled()) {
				bDisplayBanner = page.isBannerEnabled();
			}
		}
		
		setupSelectorMPage(criterion, tabAr, i18n.COMMON_ORDERS, bDisplayBanner);
	}
	else
	{
		var mpage = retrieveMPage(criterion,mpageCategoryMean)
		mpage.setName(i18n.COMMON_ORDERS);
		setupSingleMPage(criterion, mpage, "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=quickorders&culture=en-US&release=4", criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\quickordersandcharges\\\\R4 Quick Orders and Charges MPages View Help.html");

		//add fixes to have QOC page render properly if no views have been defined
		var i18nCore = i18n.discernabu;
		var pgCtrl = _g("pageCtrl"+criterion.category_mean);
		if (pgCtrl)
		{
			Util.Style.acss(pgCtrl,"qoc");
			var pgHd = Util.gp(pgCtrl);
			if (pgHd)
			{
				Util.Style.acss(pgHd,"qoc");
			}
			var cust = _g("custView" + mpageCategoryMean);
			if (cust)
			{
				Util.de(cust);
			}
			var noViewsDefined = Util.ce("span");
			noViewsDefined.innerHTML = "<span class='qoc-no-views-defined'>"+i18nCore.NO_VIEWS_DEFINED+"</span>";
			Util.ia(noViewsDefined,pgCtrl);
		}
	}
}
function RenderFutureOrders(){
	MP_Util.LogDebug("Rendering Future Orders mPage");
	var mpageCategoryMean = "MP_FUTURE_ORD";
	var criterion = createPageCriterion(mpageCategoryMean);
	
	var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch MPage");
    if (timerMPage){ 
		timerMPage.SubtimerName = mpageCategoryMean;
    }
    if (timerMPage){ 
		timerMPage.Stop();
    }

	var mpage = retrieveMPage(criterion, mpageCategoryMean);
	if(!mpage.getName()) {
		mpage.setName(i18n.FUTURE_ORDERS);
	}
	setupSingleMPage(criterion, mpage, "", "");
}
var View = function (view) {
    var m_name = view.VIEW_NAME;
    var m_seq = view.VIEW_SEQUENCE;
    var m_mean = view.VIEW_CAT_MEAN;
    var m_id = view.VIEW_CAT_ID;
    var m_criterion = createViewCriterion(m_mean);
    var m_comps = null;

    return {
        getName: function () {
            return m_name;
        },
        getSequence: function () {
            return m_seq;
        },
        getMeaning: function () {
            return m_mean;
        },
        getId: function () {
            return m_id;
        },
        getComponents: function () {
            if (m_comps) {
                return m_comps;
            }
            var loadingPolicy = new MP_Bedrock.LoadingPolicy();
            loadingPolicy.setLoadPageDetails(true);
            loadingPolicy.setLoadComponentBasics(true);
            loadingPolicy.setLoadComponentDetails(true);
            loadingPolicy.setCategoryMean(m_mean);
            loadingPolicy.setCriterion(m_criterion);
            var mpage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy);

            m_comps = mpage.getComponents();
            return m_comps;
        },
		getCriterion: function () {
            return m_criterion;
        }
    };

    function createViewCriterion(categoryMean) {
        var js_criterion = JSON.parse(m_criterionJSON);
        var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
        criterion.category_mean = categoryMean;
        return criterion;
    }
}

var ViewPointManager = function (jsViewpoint) {
    var m_name = jsViewpoint.VIEWPOINT_NAME;
    var m_key = jsViewpoint.VIEWPOINT_NAME_KEY;
    var m_views = [];
    var m_viewKeys = [];
    var m_viewpoint_cnt = jsViewpoint.CNT;

    for (var x = 0; x < m_viewpoint_cnt; x++) {
        var view = jsViewpoint.VIEWS[x];
        m_views[view.VIEW_CAT_MEAN] = new View(view);
        m_viewKeys.push(view.VIEW_CAT_MEAN);
    }

    return {
        getViews: function () {
            return m_views;
        },
        getViewKeys: function () {
            return m_viewKeys;
        },
		getViewByMeaning: function (categoryMeaning) {
			return m_views[categoryMeaning];
		}
    }
}

function RenderViewpoint() {
	MP_Util.LogDebug("Viewpoint Settings: " + m_viewpointJSON);
	var js_viewpoint = JSON.parse(m_viewpointJSON);
	var viewpoint = js_viewpoint.VIEWPOINTINFO_REC;
	
	//Create the tabs and the content divs for each tab and insert it into the document body
    var vpInfo = createViewpoint();
    document.body.innerHTML += vpInfo[0];

	// Associate appropriate click events to tabs
	initTabs(viewpoint);
	
	var sortHelp = function(e, ui) {
		ui.children().each(function() {
			$(this).width($(this).width());
		});
		return ui;
	};
	
	//Make the tabs sortable
	$(document).ready(function() {
		$( "#vwpTabList" ).sortable({ axis: "x" },{ tolerance: 'pointer' }, {appendTo: '#vwpTabList'}, {items: '.vwp-tab-container'}, { helper: sortHelp}, {
			stop: function(event, ui) {} });
	});
	
    //embed chart search if enabled for any of the views
	if (parseInt(js_viewpoint.VIEWPOINTINFO_REC.CS_ENABLED, 10)) {
		MP_Util.Doc.AddChartSearch(vpInfo[1], true);
	}
	
	$( "#vwpTabList" ).bind( "sortstop", function(event, ui) {
		//Will need to update the view_sequence before saving prefs
		//Get the tab dom elements
		var curViewContIndx;
		var curViewIndxSet = false;
		var view;
		var viewObj;
		var viewCatMean;
		var viewpointObject = _g('vwpTabList');
		var viewpointLefts = Util.Style.g('vwp-left-item', viewpointObject, "span");
		var viewpointRights = Util.Style.g('vwp-right-item', viewpointObject, "span");
		var viewpointTabs = Util.Style.g('vwp-tab-item', viewpointObject, "span");
		
		//Get the currently shown tab content index
		tabCont = _g('vwpTabCont');
		curViewContIndx = tabCont.className.match(/vwp-tabview[0-9]+/)[0];
		curViewContIndx = curViewContIndx.replace(/vwp-tabview/, "");
		curViewContIndx = parseInt(curViewContIndx, 10);
		
		//Update the sequences of the views and update the click events
		for(var x = 0; x < viewpointTabs.length; x++){
			view = viewpointTabs[x];
			viewCatMean = view.id.replace(/^Tab[0-9]+/, "");
			viewObj = getViewObject(viewCatMean);
			if(viewObj){
				if(!curViewIndxSet && viewObj.VIEW_SEQUENCE === curViewContIndx){
					viewObj.VIEW_SEQUENCE = x
					curViewContIndx = viewObj.VIEW_SEQUENCE;
					curViewIndxSet = true;
				}
				else{
					viewObj.VIEW_SEQUENCE = x;
				}
			}
		}	
		
		//Update all of the tab class names since they have been rearranged
		for(var x = 0; x < viewpointTabs.length; x++){
			//Check to see if it is the extra tab
			if(viewpointLefts[x].id !== "TabLeftExtra"){
				viewpointLefts[x].id = "TabLeft" + x;
				viewpointRights[x].id = "TabRight" + x;
				viewpointTabs[x].id = viewpointTabs[x].id.replace(/^Tab[0-9]+/, "Tab" + x);
				viewpointTabs[x].className = viewpointTabs[x].className.replace(/vwp-tab[0-9]+/, "vwp-tab" + x);
			}
		}
		
		//Update the content containers since the tabs have been rearranged
		tabCont = _g('vwpTabCont');
		var viewContainers = Util.Style.g('vwp-tab-data', tabCont, "div");
		var cachedClass;
		for(x = viewContainers.length; x--; ){
			//Get each view container and determine which view it is associated with
			viewCatMean = viewContainers[x].id;
			cachedClass = (Util.Style.ccss(viewContainers[x], "vwp-cached"))?"vwp-cached":"";
			viewObj = getViewObject(viewCatMean);
			if(viewObj){
				viewContainers[x].className = "vwp-tab-data vwp-data" + viewObj.VIEW_SEQUENCE + " " + cachedClass;
			}
		}
		
		//Update Click events
		if(viewpoint.VIEWS[0] && viewpoint.VIEWS[0].SHOWN_IND === 1){
			curTab = _g('Tab' + viewpoint.VIEWS[0].VIEW_SEQUENCE + viewpoint.VIEWS[0].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[0].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[0].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(viewpoint.VIEWS[0].VIEW_SEQUENCE, viewpoint.VIEWS[0].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[1] && viewpoint.VIEWS[1].SHOWN_IND === 1){
			curTab = _g('Tab' + viewpoint.VIEWS[1].VIEW_SEQUENCE + viewpoint.VIEWS[1].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[1].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[1].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(viewpoint.VIEWS[1].VIEW_SEQUENCE, viewpoint.VIEWS[1].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[2] && viewpoint.VIEWS[2].SHOWN_IND === 1){
			curTab = _g('Tab' + viewpoint.VIEWS[2].VIEW_SEQUENCE + viewpoint.VIEWS[2].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[2].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[2].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(viewpoint.VIEWS[2].VIEW_SEQUENCE, viewpoint.VIEWS[2].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[3] && viewpoint.VIEWS[3].SHOWN_IND === 1){
			curTab = _g('Tab' + viewpoint.VIEWS[3].VIEW_SEQUENCE + viewpoint.VIEWS[3].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[3].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[3].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(viewpoint.VIEWS[3].VIEW_SEQUENCE, viewpoint.VIEWS[3].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[4] && viewpoint.VIEWS[4].SHOWN_IND === 1){
			curTab = _g('Tab' + viewpoint.VIEWS[4].VIEW_SEQUENCE + viewpoint.VIEWS[4].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[4].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[4].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(viewpoint.VIEWS[4].VIEW_SEQUENCE, viewpoint.VIEWS[4].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[5] && viewpoint.VIEWS[5].SHOWN_IND === 1){
			curTab = _g('Tab' + viewpoint.VIEWS[5].VIEW_SEQUENCE + viewpoint.VIEWS[5].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[5].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[5].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(viewpoint.VIEWS[5].VIEW_SEQUENCE, viewpoint.VIEWS[5].VIEW_CAT_MEAN);
				};
			}
		}
		
		//Need to update the selected tab css since the tab has moved and the classes updated.
		tabCont = _g('vwpTabCont');
		tabCont.className = "vwp-tab-cont vwp-tabview" + curViewContIndx;

		MP_Core.AppUserPreferenceManager.SaveViewpointPreferences(viewpoint.VIEWPOINT_NAME_KEY, viewpoint);

	});
	

	function getViewObject(tabCatMean){
		for(var x = viewpoint.VIEWS.length; x--; x){
			if(viewpoint.VIEWS[x].VIEW_CAT_MEAN === tabCatMean){
				return viewpoint.VIEWS[x];
			}
		}
		return null;
	};

	/*Retrieve the name which should be used for a view*/
	function getViewName(viewCatMean){
		for(var x = viewpoint.VIEWS.length; x--; x){
			if(viewpoint.VIEWS[x].VIEW_CAT_MEAN === viewCatMean){
				if(viewpoint.VIEWS[x].VIEW_NAME) {
					return viewpoint.VIEWS[x].VIEW_NAME;
				} 
				else {
					switch(viewCatMean) {
						case "MP_DC_SUMMARY_V4":
							return i18n.DISCHARGE_SUMMARY;
							break;
						case "MP_RT_SUMMARY_V4":
							return i18n.PULMONARY_SUMMARY;
							break;
						case "MP_ICU_DASHBOARD":
							return i18n.discernabu.ICU_DASHBOARD;
							break;
						case "MP_ICU_SUMMARY_V4":
							return i18n.ICU_SUMMARY;
							break;
						case "MP_INPT_SUMMARY_V4":
							return i18n.INPATIENT_SUMMARY;
							break;
						case "MP_ED_SUMMARY_V4":
							return i18n.ED_SUMMARY;
							break;
						case "MP_AMB_SUMMARY_V4":
							return i18n.AMBULATORYSUMMARYMPAGE;
							break;
						case "MP_DABU_STD":
							return "Discern Master Summary";
							break;
						case "MP_REHAB_SUMMARY_V4":
							return "Rehabilitation Summary";
							break;
						case "MP_ORTHO_SUMMARY_V4":
							return "Orthopedic Summary";
							break;
						case "MP_PREG_SUMMARY_V4":
							return i18n.PREGNANCY_SUMMARY;
							break;
						case "MP_NC_SIT_BACK_V4":
							return i18n.SITUATION_BACKGROUND;
							break;
						case "MP_NC_ASSESS_V4":
							return i18n.ASSESSMENT;
							break;
						case "MP_NC_REC_V4":
							return i18n.RECOMMENDATION;
							break;
						case "MP_SIBR_SUMMARY_V4":
							return "Interdisciplinary Rounding Summary";
							break;
						case "MP_COMMON_ORDERS_V4":
							return i18n.COMMON_ORDERS;
							break;
						case "MP_INTRAOP_COMM_V4":
							return i18n.INTRAOP_COMM;
							break;
						case "MP_POSTOP_COMM_V4":
							return i18n.POSTOP_COMM;
							break;
						case "MP_PREOP_COMM_V4":
							return i18n.PREOP_COMM;
							break;
						case "MP_FUTURE_ORD":
							return i18n.FUTURE_ORDERS;
							break;
					}
				}
			}
		}
	};
	
	/* Construct HTML for tabs and the drop down menu*/
	function createViewpoint(){
		var criterion = createPageCriterion(viewpoint.VIEWS[0].VIEW_CAT_MEAN);
		var loc = criterion.static_content;
		var viewLen = viewpoint.VIEWS.length;
		var vwpHTML = [];
		var extraViewsHTML = [];
		var pageLoadingHTML = [];
		var tabCatMean = "";
		var displayName = "";
		var tabTitle = "";
		var shownTabCnt = 0;
		var menuItemCnt = 0;
		var tabSeq;
		MP_Util.LogInfo(JSON.stringify(viewpoint));
		//Create the initial viewpoint HTML
		vwpHTML.push("<div class='vwp'><div class='vwp-tab-cont' id='vwpTabCont'><div class='vwp-tab-hd' id='vwpTabList'>");
		//Create the initial extra viewpoint menu items HTML
		extraViewsHTML.push("<div id='vwpViewList' onclick='MP_Util.LaunchViewMenu(\"vwpViewListCont\");'><a id='viewDrop' class='drop-Down'><img src='", loc, "\\images\\3943_16.gif'></a></div><div class='vwp-ClassDiv vwp-mnu-selectWindow vwp-menu2 menu-hide' id='vwpViewListCont'><div class='vwp-mnu-labelbox'>",i18n.AVAILABLE_VIEWS,"</div><div class='vwp-mnu-contentbox' id='mnuContent'>")
		//Load the default/user defined tabs
		for (x=0;x<viewLen;x++) {
			tabCatMean = viewpoint.VIEWS[x].VIEW_CAT_MEAN;
			
			//Set the tab title and display name
			displayName = getViewName(tabCatMean);
			tabTitle = displayName;
			
			if(viewpoint.VIEWS[x].SHOWN_IND === 1){
				shownTabCnt++;
				tabSeq = viewpoint.VIEWS[x].VIEW_SEQUENCE;
				vwpHTML.push("<span class='vwp-tab-container'><span class='vwp-inactive-left vwp-left-item' id='TabLeft",tabSeq,"'></span><span class='vwp-tab-item vwp-tab", tabSeq,"' id='Tab",tabSeq,tabCatMean,"' title='",tabTitle,"'>",displayName,"</span><span class='vwp-inactive-right vwp-right-item' id='TabRight",tabSeq,"'></span></span>");
				pageLoadingHTML.push("<div class='vwp-tab-data vwp-data",tabSeq,"' id='",tabCatMean,"'>",i18n.LOADING_DATA,"</div>");
			}
			
			if(viewpoint.VIEWS[x].MENU_ITEM === 1){
				extraViewsHTML.push("<div class='vwp-mnu' id='list",tabCatMean,"' title='",displayName,"'>", displayName, "</div>");
				menuItemCnt++;
			}
		}
		
		if(shownTabCnt < 6) {
			vwpHTML.push("<span class='vwp-tab-container vwp-hide'><span class='vwp-inactive-left vwp-hide vwp-left-item' id='TabLeftExtra'></span><span class='vwp-tab-item vwp-tabExtra vwp-hide' id='TabExtra' title=''></span><span class='vwp-inactive-right vwp-hide vwp-right-item' id='TabRightExtra'></span></span>");
			pageLoadingHTML.push("<div class='vwp-tab-data vwp-dataExtra vwp-hide' id='TabExtraContent'><div>",i18n.LOADING_DATA,"</div></div>");
		}
		
		//Add the dropdown HTML if there is any needed
		if(menuItemCnt > 0){
			extraViewsHTML.push("</div></div>");
			vwpHTML.push(extraViewsHTML.join(""));
		}
		
		//Finish up the tabs HTML
		vwpHTML.push("</div><div class='vwp-tab-body' id='vwpContentBody'>");
		//Add the default Loading...HTML
		vwpHTML.push(pageLoadingHTML.join(""));
		//Finish up the viewpoint HTML
		vwpHTML.push("</div></div></div>");
		return [vwpHTML.join(""), criterion];
	};
	
	/**
	 * Change the tab in focus and add tab content
	 *
	 * @param {int} tabIdx : The index/number of the tab (first tab = 1)
	 * @param {string} tabCatMean : The category meaning of the tab being loaded.
	 */
	function changeTab(tabIdx, tabCatMean){
		var criterion = createPageCriterion(tabCatMean);
		var helpUrl = "";
		var helpLink = "";
		var vwpInd = 1;
		if (tabIdx >= 0) {
			// Change class name of tab content div to reflect tab in focus
			tabCont = _g('vwpTabCont');
			tabCont.className = "vwp-tab-cont vwp-tabview" + tabIdx;
			tabContLeft = _g("TabLeft"+tabIdx);
			tabContRight = _g("TabRight"+tabIdx);

			if (tabContLeft) {
				Util.Style.rcss(tabContLeft, "vwp-inactive-left");
				Util.Style.acss(tabContLeft, "vwp-active-left");
			}
			
			if (tabContRight) {
				Util.Style.rcss(tabContRight, "vwp-inactive-right");
				Util.Style.acss(tabContRight, "vwp-active-right");
			}
			//Retrieve the DOM object of the selected tab
			var curTab = _g(tabCatMean);
			if (curTab) {
				// Check if tab has cached data; do nothing if data is cached
				if (!Util.Style.ccss(curTab, "vwp-cached")) {
					// Mark tab as cached
					Util.Style.acss(curTab, "vwp-cached");
					if (CERN_MPages == null) {
						CERN_MPages = [];
					}
					switch(tabCatMean) {
						case "MP_DC_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.DISCHARGE_SUMMARY);
							}
							mpage.addTitleAnchor("<a id=otherAnchors title='"+i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS+"' onclick='OpenDischargeProcess("+criterion.encntr_id+","+criterion.person_id+","+criterion.provider_id+");'>"+i18n.DISCHARGE_PROCESS+"</a>");
	
							//unique to the discharge summary mpage, set the mpage name on all the components
							var components = mpage.getComponents();
							for ( var x = components.length; x--;) {
								components[x].setMPageName(tabCatMean);
							}
							
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=DischargeReadiness&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\dischargesummary\\\\R4 Discharge Readiness Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_RT_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.PULMONARY_SUMMARY);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=PulmonarySummary&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\pulmonarysummary\\\\R4 Pulmonary Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_ICU_DASHBOARD":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.discernabu.ICU_DASHBOARD);
							}
							mpage.setCustomizeEnabled(false);
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_ICU_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.ICU_SUMMARY);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=ICUSummary&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\icusummary\\\\R4 ICU Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_INPT_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.INPATIENT_SUMMARY);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=InpatientSummary&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\ipsummary\\\\R4 Inpatient Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_ED_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.ED_SUMMARY);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=EDSummary&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\edsummary\\\\R4 ED Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_AMB_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.AMBULATORYSUMMARYMPAGE);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=AmbulatorySummary&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\ambulatorysummary\\\\R4 Ambulatory Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_DABU_STD":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName("Discern Master Summary");
							}
	
							/*Special case handling the setup of the Overdue Tasks component.  Currently no BR settings for this.*/
							var componentList = mpage.getComponents();
							if (componentList.length) {
								for ( var x = componentList.length; x--;) {
									var component = componentList[x];
									if (component instanceof TaskActivityComponent) {
										component.setLookbackDays(1);
										component.addTaskStatusMeaning("OVERDUE");
									}
								}
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_REHAB_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName("Rehabilitation Summary");
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Rehabilitation&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\rehabsummary\\\\R4 Rehabilitation Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_ORTHO_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName("Orthopedic Summary");
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=OrthopedicSummary&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\orthopedicsummary\\\\R4 Orthopedic Summary Help.html";
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_PREG_SUMMARY_V4":
							//This function will load all pregnancy specific data	
							PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(criterion);
							
							//this function will check if the patient is a female/male AND
							//if female, then if they have active open pregnancy before displaying pregnancy summary mpage.
							var loadingRequirementsFailed = PREGNANCY_BASE_UTIL_O1.CheckPregnancySummaryLoadRequirement(vwpInd);
														 
							if (!loadingRequirementsFailed) {
								var mpage = retrieveMPage(criterion, tabCatMean);
								if(!mpage.getName()) {
									mpage.setName(i18n.PREGNANCY_SUMMARY);
								}
								setupPregnancySpecificComponentSettings(mpage.getComponents());
								//only display the Printable Report link, if the bedrock preference with the report name is set/populated under the page level settings.
								var printReportName = mpage.getPrintableReportName();
								if(printReportName !== ""){
									mpage.addTitleAnchor("<a id=printView onclick='MP_Util.PrintReport(\"" + printReportName + "\"," + criterion.person_id + "," + criterion.encntr_id + ");'>"+i18n.PRINT_REPORT+"</a>");
								}
								helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Pregnancy&culture=en-US&release=4";
								helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\pregnancysummary\\\\R4 Pregnancy Summary Help.html";
								CERN_MPages[tabCatMean] = mpage;
								setupSingleView(criterion, mpage, tabCatMean, helpUrl, helpLink);
							}
							else{
								//This sets up the criterion informaiton which is used elsewhere.
								var mpage = retrieveMPage(criterion, tabCatMean);
							}
							break;
						case "MP_NC_SIT_BACK_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							setupNursingSpecificComponentSettings(mpage.getComponents());
							if(!mpage.getName()) {
								mpage.setName(i18n.SITUATION_BACKGROUND);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Nursing&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\nursingcommunication\\\\R4 Nursing Communication Help.html";
							mpage.setCustomizeEnabled(false);
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_NC_ASSESS_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							setupNursingSpecificComponentSettings(mpage.getComponents());
							if(!mpage.getName()) {
								mpage.setName(i18n.ASSESSMENT);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Nursing&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\nursingcommunication\\\\R4 Nursing Communication Help.html";
							mpage.setCustomizeEnabled(false);
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_NC_REC_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							setupNursingSpecificComponentSettings(mpage.getComponents());
							if(!mpage.getName()) {
								mpage.setName(i18n.RECOMMENDATION);
							}
							helpUrl = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=MPages&cas=Nursing&culture=en-US&release=4";
							helpLink = criterion.static_content.replace(/\\/g,"\\\\")+"\\\\html\\\\nursingcommunication\\\\R4 Nursing Communication Help.html";
							mpage.setCustomizeEnabled(false);
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_SIBR_SUMMARY_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName("Interdisciplinary Rounding Summary");
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_COMMON_ORDERS_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.COMMON_ORDERS);
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_INTRAOP_COMM_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.discernabu.INTRAOP_COMM);
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_POSTOP_COMM_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.discernabu.POSTOP_COMM);
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_PREOP_COMM_V4":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.discernabu.PREOP_COMM);
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
						case "MP_FUTURE_ORD":
							var mpage = retrieveMPage(criterion, tabCatMean);
							if(!mpage.getName()) {
								mpage.setName(i18n.FUTURE_ORDERS);
							}
							CERN_MPages[tabCatMean] = mpage;
							break;
					}
					
					if(tabCatMean != "MP_PREG_SUMMARY_V4") {
						setupSingleView(criterion, mpage, tabCatMean, helpUrl, helpLink);
					}
				} else {
					if (CERN_MPages[tabCatMean]) {
						var viewCompLen = CERN_MPages[tabCatMean].components.length;
						for (x = viewCompLen; x--; ){
							var component = MP_Util.GetCompObjById(CERN_MPages[tabCatMean].components[x].m_componentId);
							if(component.isDisplayable() && !component.isLoaded()) {
								component.setLoaded(true);
								component.InsertData();
							}
						}
					}
				} 
			}
		}
	};
	
	/** This function will replace the Tab Extra div with the new content choosen by the
	 * user from the drop down list of views.
	 * Change tab Extra to the view selected by the user
	 *
	 */
	function LaunchViewSelection(e){
		var e = e || window.event;
        var target = e.target || e.srcElement;
		var targetId = target.id;
		var viewCatMean = targetId.replace("list","");
		var newTabName = getViewName(viewCatMean);
		var insertIndx = null;
		var viewLen = viewpoint.VIEWS.length;
		var extraTabLeft = null;
		var extraTabRight = null;
		var extraTabContainer = null;
		var extraTab = null;
		var initialExtraTabLoad = false;
		var parent;
		var prevView;
		var nextView;
		var x;
		var viewIndx;
		var viewObj = getViewObject(viewCatMean);
		
		//If the menu body was clicked instead of a menu item		
		if(targetId === "mnuContent"){ return; }
		
		//Determine if there is already an extra tab showing
		for(x = viewLen; x--; ){
			//If the tab is selectable in the drop down and it is currently showing in the extra tab
			if(viewpoint.VIEWS[x].MENU_ITEM && viewpoint.VIEWS[x].SHOWN_IND){
				insertIndx = viewpoint.VIEWS[x].VIEW_SEQUENCE;
				viewIndx = x;
				break;
			}
		}
		
		//Determine if the view selected is already showing, if so dont do anything
		var tabCont = _g('vwpTabCont');
		var curViewContIndx = tabCont.className.match(/vwp-tabview[0-9]+/)[0];
		curViewContIndx = curViewContIndx.replace(/vwp-tabview/, "");
		curViewContIndx = parseInt(curViewContIndx, 10);
		if(curViewContIndx === viewObj.VIEW_SEQUENCE){
			return;
		}
		
		//This is a specific check for null DO NOT CHANGE
		if(insertIndx !== null){ //Previously selected drop down item showing.  Replace it and mark it as not showing
			viewpoint.VIEWS[viewIndx].SHOWN_IND = 0;
			viewpoint.VIEWS[viewIndx].VIEW_SEQUENCE = 99;
			extraTabLeft = _g('TabLeft' + insertIndx);
			extraTabContainer = Util.gp(extraTabLeft);
		}
		else{//Populate the extra tab since it isnt already shown
			extraTabLeft = _g('TabLeftExtra');
			extraTabContainer = Util.gp(extraTabLeft);
			insertIndx = 5;
			initialExtraTabLoad = true;
		}
		
		//Mark the newly selected tab as showing and note its view sequence
		if(viewObj){
			viewObj.SHOWN_IND = 1;
			viewObj.VIEW_SEQUENCE = insertIndx;
		}
		
		//Delete the existing tab
		Util.de(extraTabContainer);
		
		var extraTabSpan = Util.ce('span');
		var extraTabInnerHTML = [];
		extraTabInnerHTML.push("<span class='vwp-tab-container'><span class='vwp-inactive-left vwp-left-item' id='TabLeft",insertIndx,"'></span><span class='vwp-tab-item vwp-tab",insertIndx,"' id='Tab",insertIndx,viewCatMean,"' title='", newTabName,"'>", newTabName, "</span><span class='vwp-inactive-right vwp-right-item' id='TabRight",insertIndx,"'></span></span>");
		extraTabSpan.innerHTML = extraTabInnerHTML.join('');
		if(insertIndx === 0){ //Tab to replace is at the beginning of the viewPoint
			parent = _g('vwpTabList');
			nextView = _g('TabLeft1');
			nextView = Util.gp(nextView);
			parent.insertBefore(extraTabSpan, nextView);
		}
		else{ //Tab is not at the beginning
			prevView = _g('TabRight' + ( insertIndx - 1 ));
			prevView = Util.gp(prevView);
			Util.ia(extraTabSpan, prevView);
		}
		//Add click events to the extra tab
		extraTab = _g("Tab" + insertIndx + viewCatMean);
		if(extraTab){
			extraTab.onclick = function(){
				MP_Util.AddCookieProperty("viewpoint", "viewName", newTabName);
				MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewCatMean);
				MP_Util.WriteCookie();
				changeTab(insertIndx, viewCatMean);
			};
		}
		
		var extraTabContentDiv = null;
		var tabCont = _g('vwpTabCont');
		var tabPrior = null;
		var tempTabContentDiv = null;
		var viewPointTabsDiv = null;
		
		//Load the tab content
		if(initialExtraTabLoad){ //If the extra tab isnt shown already
			extraTabContentDiv = _g('TabExtraContent');
			Util.de(extraTabContentDiv);
			//Create the replacement tab content with the proper class names and id
			extraTabContentDiv = Util.ce('div');
			extraTabContentDiv.id = viewCatMean;
			extraTabContentDiv.className = "vwp-tab-data vwp-data"+insertIndx;
			tabPrior = "vwp-data" + (insertIndx - 1);
			tempTabContentDiv = Util.Style.g(tabPrior, tabCont, 'div')[0];
			Util.ia(extraTabContentDiv, tempTabContentDiv);
		}
		else{
			viewPointTabsDiv = _g('vwpTabCont');
			extraTabContentDiv = Util.Style.g('vwp-data'+insertIndx, viewPointTabsDiv, 'div')[0];
			Util.de(extraTabContentDiv);
			
			//Create the replacement tab content with the proper class names and id
			var extraTabContentDiv = Util.ce('div');
			extraTabContentDiv.id = viewCatMean;
			extraTabContentDiv.className = "vwp-tab-data vwp-data"+insertIndx;

			//Insert extra tab content div
			var parent = _g('vwpContentBody');
			if(insertIndx === 0) {
				tempTabContentDiv = Util.Style.g("vwp-data1", tabCont, 'div')[0];
				parent.insertBefore(extraTabContentDiv, tempTabContentDiv);
			}
			else {
				tabPrior = "vwp-data" + (insertIndx - 1);
				tempTabContentDiv = Util.Style.g(tabPrior, tabCont, 'div')[0];
				Util.ia(extraTabContentDiv, tempTabContentDiv);
			}
		}
		
		//Save the canges to the user preferences and the cookie if the insertIndx is not the last tab
		if(insertIndx < 5){
			MP_Core.AppUserPreferenceManager.SaveViewpointPreferences(viewpoint.VIEWPOINT_NAME_KEY, viewpoint);
		}	
		//Update the cookie with the new information
		MP_Util.AddCookieProperty("viewpoint", "viewName", newTabName);
		MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewCatMean);
		MP_Util.WriteCookie();
		changeTab(insertIndx, viewCatMean);
	}
	
	/**
	 * Initialize tabs (associate click events)
	 *
	 * @param {object} viewpoint : The viewpoint object
	 */
	function initTabs(viewpoint) {
		var selectedTabCatMean = "";
		var viewLen = viewpoint.VIEWS.length;
		var curTab;
		
		//Initialize each tab with click events
		if(viewpoint.VIEWS[0]){
			curTab = _g('Tab0' + viewpoint.VIEWS[0].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[0].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[0].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(0, viewpoint.VIEWS[0].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[1]){
			curTab = _g('Tab1' + viewpoint.VIEWS[1].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[1].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[1].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(1, viewpoint.VIEWS[1].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[2]){
			curTab = _g('Tab2' + viewpoint.VIEWS[2].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[2].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[2].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(2, viewpoint.VIEWS[2].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[3]){
			curTab = _g('Tab3' + viewpoint.VIEWS[3].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[3].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[3].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(3, viewpoint.VIEWS[3].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[4]){
			curTab = _g('Tab4' + viewpoint.VIEWS[4].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[4].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[4].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(4, viewpoint.VIEWS[4].VIEW_CAT_MEAN);
				};
			}
		}
		
		if(viewpoint.VIEWS[5]){
			curTab = _g('Tab5' + viewpoint.VIEWS[5].VIEW_CAT_MEAN);
			if(curTab){ //If the tab is shown to the user add the click events
				curTab.onclick = function(){
					MP_Util.AddCookieProperty("viewpoint", "viewName", viewpoint.VIEWS[5].VIEW_NAME);
					MP_Util.AddCookieProperty("viewpoint", "viewCatMean", viewpoint.VIEWS[5].VIEW_CAT_MEAN);
					MP_Util.WriteCookie();
					changeTab(5, viewpoint.VIEWS[5].VIEW_CAT_MEAN);
				};
			}
		}

	    //Initialize the drop down menu with click events		
		var mnuList = _g('mnuContent');
		if(mnuList){
			Util.addEvent(mnuList, "click", LaunchViewSelection);
		}
		
		//Determine which tab was loaded last if we are in an existing session.
		MP_Util.RetrieveCookie();
		var viewpointState = MP_Util.GetCookieProperty("viewpoint", "viewCatMean");

		if(viewpointState) {
			selectedTabCatMean = viewpointState;
		}
		else if(viewpoint.ACTIVE_VIEW_CAT_MEAN) {
			selectedTabCatMean = viewpoint.ACTIVE_VIEW_CAT_MEAN;
		}
		else if(viewpoint.VIEWS[0] && viewpoint.VIEWS[0].VIEW_CAT_MEAN){
			selectedTabCatMean = viewpoint.VIEWS[0].VIEW_CAT_MEAN;
		}

		//Load the tab which was previously selected
		if(selectedTabCatMean) {
			for(x = viewLen; x--; ){
				if(viewpoint.VIEWS[x].VIEW_CAT_MEAN === selectedTabCatMean){
					//Need to check and see if the tab is currently shown.  If not, populate the extra tab
					if(viewpoint.VIEWS[x].SHOWN_IND === 1){
						changeTab(viewpoint.VIEWS[x].VIEW_SEQUENCE, selectedTabCatMean);
					}
					else{
						var extraTab;
						var extraTabRight;
						var extraTabLeft = _g('TabLeftExtra');
						//If the extra tab was reordered back to the last last and then switched
						if(extraTabLeft){
							var extraTabContainer = Util.gp(extraTabLeft);
							var insertIndx = 5;
						}
						else{
							//Default and select tab 0
							if(viewpoint.VIEWS[0] && viewpoint.VIEWS[0].VIEW_CAT_MEAN){
								selectedTabCatMean = viewpoint.VIEWS[0].VIEW_CAT_MEAN;
							}
							changeTab(0, viewpoint.VIEWS[0].VIEW_CAT_MEAN);
							return;
						}
						
						var newTabName = getViewName(selectedTabCatMean);
						
						//Mark the newly selected tab as showing and note its view sequence
						var viewObj = getViewObject(selectedTabCatMean);
						if(viewObj){
							viewObj.SHOWN_IND = 1;
							viewObj.VIEW_SEQUENCE = insertIndx;
						}
						
						//Delete the existing extra tab placeholder
						Util.de(extraTabContainer);
						
						var extraTabSpan = Util.ce('span');
						var extraTabInnerHTML = [];
						extraTabInnerHTML.push("<span class='vwp-tab-container'><span class='vwp-inactive-left vwp-left-item' id='TabLeft",insertIndx,"'></span><span class='vwp-tab-item vwp-tab",insertIndx,"' id='Tab",insertIndx,selectedTabCatMean,"' title='", newTabName,"'>", newTabName, "</span><span class='vwp-inactive-right vwp-right-item' id='TabRight",insertIndx,"'></span></span>");
						extraTabSpan.innerHTML = extraTabInnerHTML.join('');
						
						//Insert the tab
						prevView = _g('TabRight' + ( insertIndx - 1 ));
						prevView = Util.gp(prevView);
						Util.ia(extraTabSpan, prevView);
						
						//Add click events to the extra tab
						extraTab = _g("Tab" + insertIndx + selectedTabCatMean);
						if(extraTab){
							extraTab.onclick = function(){
								MP_Util.AddCookieProperty("viewpoint", "viewName", newTabName);
								MP_Util.AddCookieProperty("viewpoint", "viewCatMean", selectedTabCatMean);
								MP_Util.WriteCookie();
								changeTab(insertIndx, selectedTabCatMean);
							};
						}
						
						var extraTabContentDiv = null;
						var tabCont = _g('vwpTabCont');
						var tabPrior = null;
						var tempTabContentDiv = null;
						var viewPointTabsDiv = null;
						
						//Delete the existing tab data
						extraTabContentDiv = _g('TabExtraContent');
						Util.de(extraTabContentDiv);
						//Create the new tab data container
						extraTabContentDiv = Util.ce('div');
						extraTabContentDiv.id = selectedTabCatMean;
						extraTabContentDiv.className = "vwp-tab-data vwp-data"+insertIndx;
						//Insert the View data after the last listed div
						tabPrior = "vwp-data" + (insertIndx - 1);
						tempTabContentDiv = Util.Style.g(tabPrior, tabCont, 'div')[0];
						Util.ia(extraTabContentDiv, tempTabContentDiv);
						
						changeTab(insertIndx, selectedTabCatMean);
					}
					return;
				}
			}
			//If we make it to this point the cookie tab is no longer available and we should select the defualt tab.
			changeTab(0, viewpoint.VIEWS[0].VIEW_CAT_MEAN);
		}
	}
}

function retrieveMPage(criterion, mpageCategoryMean){
	// Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageCategoryMean); 
	loadingPolicy.setCriterion(criterion); 
	var mpage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy);

	// setup filter to only display a component when the patient is female
	var sexFilter = new MP_Core.CriterionFilters(criterion);
	sexFilter.addFilter(MP_Core.CriterionFilters.SEX_MEANING, "FEMALE");
	
	// setup filter to only display a component when the patient is less than or
	// equal to 22 years of age
	var dateFilter = new MP_Core.CriterionFilters(criterion);
	var dateCheck = new Date();
	dateCheck.setFullYear(dateCheck.getFullYear() - 22);
	dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, dateCheck);

	var components = mpage.getComponents();
	if (components && components.length > 0) {
		for (var y = components.length; y--;) {
			var groups = null;
			var group = null;
			var z = 0;
			var component = components[y];
			if (component instanceof GrowthChartComponent){
				component.addDisplayFilter(dateFilter);
			}
			else if (component instanceof PregnancyHistoryComponent){
				component.addDisplayFilter(sexFilter);
			}
			else if (component instanceof DiagnosticsComponent) {
				groups = component.getGroups();
				if (groups && groups.length > 0){
					for (z = 0; z < groups.length; z++) {
						group = groups[z];
						switch (group.getGroupName()) {
							case "CXR_ABD_CE":	
							case "ED_CXR_ABD_CE":
							case "IS_CXR_ABD_CE":	
							case "NC_CXR_ABD_CE":
								group.setGroupName(i18n.CHEST_ABD_XR);
								break;
							case "EKG_CE":
							case "ED_EKG_CE":
							case "IS_EKG_CE":
							case "NC_EKG_CE":
								group.setGroupName(i18n.EKG);
								break;
							case "OTHER_RAD_ES":
							case "ED_OTHER_RAD_ES":
							case "IS_OTHER_RAD_ES":
							case "NC_OTHER_RAD_ES":
								group.setGroupName(i18n.OTHER_DIAGNOSTICS);
								break;
						}
					}
				}
			}
            else if (component instanceof VitalSignComponent) {
                groups = component.getGroups();
                if (groups && groups.length > 0) {
                    for (z = groups.length; z--;) {
                        group = groups[z];
                        switch (group.getGroupName()) {
                            case "TEMP_CE":
                            case "ED_TEMP_CE":
                            case "IS_TEMP_CE":
							case "NC_TEMP_CE":
                                group.setGroupName(i18n.discernabu.vitals_o1.TEMPERATURE);
                                break;
                            case "BP_CE":
                            case "ED_BP_CE":
                            case "IS_BP_CE":
							case "NC_BP_CE":
                                group.setGroupName(i18n.discernabu.vitals_o1.BLOOD_PRESSURE);
                                break;
                            case "HR_CE":
                            case "ED_HR_CE":
                            case "IS_HR_CE":
							case "NC_HR_CE":
                                group.setGroupName(i18n.discernabu.vitals_o1.HEART_RATE);
                                break;
                            case "VS_CE":
                            case "ED_VS_CE":
                            case "IS_VS_CE":
							case "NC_VS_CE":
                                group.setGroupName("");
                                break;
                        }
                    }
                }
            }
            else if (component instanceof LaboratoryComponent) {
                groups = component.getGroups();
                if (groups && groups.length > 0) {
                    for (z = groups.length; z--;) {
                        group = groups[z];
                        switch (group.getGroupName()) {
                            case "LAB_PRIMARY_CE":
                            case "ED_LAB_PRIMARY_CE":
                            case "IS_LAB_PRIMARY_CE":
							case "NC_LAB_PRIMARY_CE":
                                group.setGroupName(i18n.PRIMARY_RESULTS);
                                break;
                            case "LAB_SECONDARY_ES":
                            case "ED_LAB_SECONDARY_ES":
                            case "IS_LAB_SECONDARY_ES":
							case "NC_LAB_SECONDARY_ES":
                                group.setGroupName(i18n.SECONDARY_RESULTS);
                                break;
						}
                    }
                }
            }
            else if (component instanceof ABDComponent) {
                var dateFilter1 = new MP_Core.CriterionFilters(criterion);
                var ageDays = component.getAgeDays();
                var myDate = new Date();
                myDate.setDate(myDate.getDate() - ageDays);
                dateFilter1.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, myDate);
                component.addDisplayFilter(dateFilter1);
            }
			else if (component instanceof PatientAssessmentComponent) {
				groups = component.getGroups();
				if (groups && groups.length > 0) {
					for (z = groups.length; z--;) {
						group = groups[z];
						switch (group.getGroupName()) {
						case "NC_PT_ASSESS_GEN":
							group.setGroupName(i18n.GENERAL_ASSESSMENT);
							break;
						case "NC_PT_ASSESS_PAIN":
							group.setGroupName(i18n.PAIN);
							break;
						case "NC_PT_ASSESS_NEURO":
							group.setGroupName(i18n.NEURO);
							break;
						case "NC_PT_ASSESS_RESP":
							group.setGroupName(i18n.RESPIRATORY);
							break;
						case "NC_PT_ASSESS_CARD":
							group.setGroupName(i18n.CARDIO);
							break;
						case "NC_PT_ASSESS_GI":
							group.setGroupName(i18n.GI);
							break;
						case "NC_PT_ASSESS_GU":
							group.setGroupName(i18n.GU);
							break;
						case "NC_PT_ASSESS_MS":
							group.setGroupName(i18n.MUSCULOSKELETAL);
							break;
						case "NC_PT_ASSESS_INTEG":
							group.setGroupName(i18n.INTEGUMENTARY);
							break;
						}
					}
				}
			}
//            else if (component instanceof SignificantEventO2Component) {
//                component.setLookbackDays(30);
//            }
		}
	}
	return mpage;
}
function setupSingleView(criterion, mpage, viewCatMeaning, helpURL, helpLink) {
	MP_Util.LogInfo("MPages Content Version: 4.2");
	//Register events for the Custom Components Standard
	MPage.registerUnloadEvent();
	MPage.registerResizeEvent();
	MP_Util.Doc.InitLayout(mpage, helpLink, helpURL, viewCatMeaning);

	if (mpage.isBannerEnabled()) {
		var patDemo = _g("banner"+criterion.category_mean);
		CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
	}

	window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
}

function setupSingleMPage(criterion, mpage, helpURL, helpLink) {
	MP_Util.LogInfo("MPages Content Version: 4.2");
	//Register events for the Custom Components Standard
	MPage.registerUnloadEvent();
	MPage.registerResizeEvent();
	MP_Util.Doc.InitLayout(mpage, helpLink, helpURL);
	
	if (mpage.isChartSearchEnabled()) { 
		MP_Util.Doc.AddChartSearch(criterion, false);
	}

	if (mpage.isBannerEnabled()) {
		var patDemo = _g("banner"+criterion.category_mean);
		CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
	}

	window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
}

function setupSelectorMPage(criterion, tabAr, pageName, bDisplayBanner) {
	MP_Util.LogInfo("MPages Content Version: 4.2");
	//Register events for the Custom Components Standard
	MPage.registerUnloadEvent();
	MPage.registerResizeEvent();
	MP_Util.Doc.InitMPageTabLayout(tabAr, pageName, 1,criterion);

	if (bDisplayBanner) // if add patient demographic banner
	{
		var patDemo = _g("banner");
		CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
	}

	window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
}

function setupTabbedMPage(criterion, tabAr, pageName, bDisplayBanner, csEnabled) {
	MP_Util.LogInfo("MPages Content Version: 4.2");
	//Register events for the Custom Components Standard
	MPage.registerUnloadEvent();
	MPage.registerResizeEvent();
	MP_Util.Doc.InitMPageTabLayout(tabAr, pageName);
	
    if (csEnabled) { 
		MP_Util.Doc.AddChartSearch(criterion, false);
    }

	if (bDisplayBanner) // if add patient demographic banner
	{
		var patDemo = _g("banner");
		CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
	}

	window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
}

function createPageCriterion(categoryMean) {
	var js_criterion = JSON.parse(m_criterionJSON);
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	criterion.category_mean = categoryMean;
	return criterion;
}


function setupNursingSpecificComponentSettings(components) {
	if (components && components.length > 0) {
		for ( var x = components.length; x--;) {
			var component = components[x];
			if (component instanceof MedicationsComponent) {
				component.setPRNLookbackDays(2);
				component.setSchedLookaheadHrs(12);
				component.setPRN(true);
				component.setScheduled(true);
				component.setContinuous(true);
				component.setPRNAdminSort(CERN_MEDS_O1.LastDoseDateTime);
				component.setScheduledSort(CERN_MEDS_O1.NextDoseDateTime);
				component.setDisplayScheduleFaceUpDt(true);
			} else if (component instanceof TaskActivityComponent) {
				component.setLookbackDays(1);
				component.addTaskStatusMeaning("OVERDUE");
			}
		}
	}
}

function OpenDischargeProcess(encntrID, personID, userID) {
	var dpObject = {};
	dpObject = window.external.DiscernObjectFactory("DISCHARGEPROCESS");
	dpObject.person_id = personID;
	dpObject.encounter_id = encntrID;
	dpObject.user_id = userID;
	dpObject.LaunchDischargeDialog();
}
