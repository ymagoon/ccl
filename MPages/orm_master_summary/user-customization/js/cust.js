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
;Function.prototype.method=function(name,func){this.prototype[name]=func;
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
break;
case"MP_DABU_STD":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_DC_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ED_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ICU_DASHBOARD":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ICU_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_INPT_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_NC_ASSESS_V4":pageFilterMaps.push(new PageFilterMapping("NC_PT_BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_NC_REC_V4":pageFilterMaps.push(new PageFilterMapping("NC_PT_BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_NC_SIT_BACK_V4":pageFilterMaps.push(new PageFilterMapping("NC_PT_BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_ORTHO_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_PREG_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
pageFilterMaps.push(new PageFilterMapping("PREG_PRINT","setPrintableReportName","String","FREETEXT_DESC"));
break;
case"MP_REHAB_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_RT_SUMMARY_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_INTRAOP_COMM_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_POSTOP_COMM_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
case"MP_PREOP_COMM_V4":pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
break;
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
}}else{component.setExpanded(jsonComponent.EXPANDED);
component.setColumn(jsonComponent.COL_SEQ);
component.setSequence(jsonComponent.ROW_SEQ);
component.setPageGroupSequence(jsonComponent.GROUP_SEQ);
}component.setLabel(jsonComponent.LABEL);
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
case"EVENT_SEQ":var groups=component.getGroups();
if(groups&&groups!==null){for(var z=0,zl=groups.length;
z<zl;
z++){var group=groups[z];
if(group.getSequence()==filter.FILTER_SEQ){group.setEventCodes(null);
group.setSequenced(true);
var aValue=GetFilterValues(filter);
for(var z=0,zl=aValue.length;
z<zl;
z++){group.addEventCode(aValue[z].getId());
}}}}break;
case"EVENT_SET_SEQ":var groups=component.getGroups();
if(groups&&groups!==null){for(var z=0,zl=groups.length;
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
}if(isMultiValue===true){var eGroup=new MPageSequenceGroup();
eGroup.setMultiValue(isMultiValue);
eGroup.setItems(tempAr);
eGroup.setMapItems(tempMap);
eGroup.setSequence(true);
eGroup.setGroupId(group.getGroupId());
eGroup.setGroupName(group.getGroupName());
groups[z]=eGroup;
}else{group.setEventSets(tempAr);
}}}}break;
case"LOOK_BACK":var aValue=GetFilterValues(filter);
for(var z=0,zl=aValue.length;
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
case"dishord":compFilterMaps.push(new FilterMapping("DC_ORDER_SELECT","setCatalogCodes","Array","PARENT_ENTITY_ID"));
break;
case"dx":compFilterMaps.push(new FilterMapping("DIAGNOSIS_TYPE","setDiagnosisType","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_VOCAB","setDiagnosisVocab","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_TYPE","setDiagnosisAddTypeCd","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_CLASS_DX","setDiagnosisClassification","Number","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_VOCAB_IND","setDiagnosisVocabInd","Number","FREETEXT_DESC"));
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
case"goals":compFilterMaps.push(new FilterMapping("NURSE_GOAL_DOC","setNursingGoals","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("OT_STG_DOC","setOTShortTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("OT_LTG_DOC","setOTLongTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PT_STG_DOC","setPTShortTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("PT_LTG_DOC","setPTLongTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("SLP_STG_DOC","setSLPShortTermGoalDocumented","Array","PARENT_ENTITY_ID"));
compFilterMaps.push(new FilterMapping("SLP_LTG_DOC","setSLPLongTermGoalDocumented","Array","PARENT_ENTITY_ID"));
break;
case"hml":compFilterMaps.push(new FilterMapping("MEDS_MODS","setMedModInd","Boolean","FREETEXT_DESC"));
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
			size = ( state && state.size == null ) ? 0 : ( state.size + 1 ) % 2;
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
		document.cookie = [ 'blackbird={', props, '}; expires=', expiration.toUTCString() ,';' ].join( '' );

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
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1) // capture x.x portion and store as a number
}
else {
    var ieVersion = 0;
}

function ConfigurePage(){
   
	var js_criterion = JSON.parse(m_criterionJSON).CRITERION;
	MP_Util.LogDebug("Criterion: " + m_criterionJSON);
	var criterion = new MP_Core.Criterion(js_criterion, js_criterion.STATIC_CONTENT);
	
	var js_reportIds = JSON.parse(reportIds)
	var reportValues = js_reportIds.REPORTID_REC.QUAL
	var ar = [];
	for (var i = 0; i < reportValues.length; i++){
		ar.push(reportValues[i].VALUE);
	}

	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(false);
	loadingPolicy.setLoadComponentBasics(true);
	loadingPolicy.setCategoryMean(criterion.category_mean);
	loadingPolicy.setCriterion(criterion);
	loadingPolicy.setCustomizeView(true);
	
	var prefManager = MP_Core.AppUserPreferenceManager;
	prefManager.Initialize(criterion, criterion.category_mean);
	prefManager.LoadPreferences();

	var components = MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy,ar,null,null);
	
	MP_Util.Doc.CustomizeLayout(i18n.discernabu.USER_CUSTOMIZATION, components, criterion);
	
	//JQuery sortable set up
	$(".cust-col").sortable({connectWith: '.cust-col'},{zIndex: 1005}, {appendTo: 'body'});
}

