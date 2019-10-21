/*
 * jQuery JavaScript Library v1.6.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Jun 30 14:16:56 2011 -0400
 */
(function(a,b){function cv(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1;
}function cs(a){if(!cg[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");
d.remove();
if(e==="none"||e===""){ch||(ch=c.createElement("iframe"),ch.frameBorder=ch.width=ch.height=0),b.appendChild(ch);
if(!ci||!ch.createElement){ci=(ch.contentWindow||ch.contentDocument).document,ci.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),ci.close();
}d=ci.createElement(a),ci.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ch);
}cg[a]=e;
}return cg[a];
}function cr(a,b){var c={};
f.each(cm.concat.apply([],cm.slice(0,b)),function(){c[this]=a;
});
return c;
}function cq(){cn=b;
}function cp(){setTimeout(cq,0);
return cn=f.now();
}function cf(){try{return new a.ActiveXObject("Microsoft.XMLHTTP");
}catch(b){}}function ce(){try{return new a.XMLHttpRequest;
}catch(b){}}function b$(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));
var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;
for(g=1;
g<i;
g++){if(g===1){for(h in a.converters){typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);
}}l=k,k=d[g];
if(k==="*"){k=l;
}else{if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];
if(!n){p=b;
for(o in e){j=o.split(" ");
if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];
if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);
break;
}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)));
}}}return c;
}function bZ(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;
for(i in g){i in d&&(c[g[i]]=d[i]);
}while(f[0]==="*"){f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));
}if(h){for(i in e){if(e[i]&&e[i].test(h)){f.unshift(i);
break;
}}}if(f[0] in d){j=f[0];
}else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;
break;
}k||(k=i);
}j=j||k;
}if(j){j!==f[0]&&f.unshift(j);
return d[j];
}}function bY(a,b,c,d){if(f.isArray(b)){f.each(b,function(b,e){c||bC.test(a)?d(a,e):bY(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d);
});
}else{if(!c&&b!=null&&typeof b=="object"){for(var e in b){bY(a+"["+e+"]",b[e],c,d);
}}else{d(a,b);
}}}function bX(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;
var h=a[f],i=0,j=h?h.length:0,k=a===bR,l;
for(;
i<j&&(k||!l);
i++){l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bX(a,c,d,e,l,g)));
}(k||!l)&&!g["*"]&&(l=bX(a,c,d,e,"*",g));
return l;
}function bW(a){return function(b,c){typeof b!="string"&&(c=b,b="*");
if(f.isFunction(c)){var d=b.toLowerCase().split(bN),e=0,g=d.length,h,i,j;
for(;
e<g;
e++){h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c);
}}};
}function bA(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bv:bw;
if(d>0){c!=="border"&&f.each(e,function(){c||(d-=parseFloat(f.css(a,"padding"+this))||0),c==="margin"?d+=parseFloat(f.css(a,c+this))||0:d-=parseFloat(f.css(a,"border"+this+"Width"))||0;
});
return d+"px";
}d=bx(a,b,b);
if(d<0||d==null){d=a.style[b]||0;
}d=parseFloat(d)||0,c&&f.each(e,function(){d+=parseFloat(f.css(a,"padding"+this))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+this+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+this))||0);
});
return d+"px";
}function bm(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(be,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b);
}function bl(a){f.nodeName(a,"input")?bk(a):"getElementsByTagName" in a&&f.grep(a.getElementsByTagName("input"),bk);
}function bk(a){if(a.type==="checkbox"||a.type==="radio"){a.defaultChecked=a.checked;
}}function bj(a){return"getElementsByTagName" in a?a.getElementsByTagName("*"):"querySelectorAll" in a?a.querySelectorAll("*"):[];
}function bi(a,b){var c;
if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();
if(c==="object"){b.outerHTML=a.outerHTML;
}else{if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option"){b.selected=a.defaultSelected;
}else{if(c==="input"||c==="textarea"){b.defaultValue=a.defaultValue;
}}}else{a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);
}}b.removeAttribute(f.expando);
}}function bh(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c=f.expando,d=f.data(a),e=f.data(b,d);
if(d=d[c]){var g=d.events;
e=e[c]=f.extend({},d);
if(g){delete e.handle,e.events={};
for(var h in g){for(var i=0,j=g[h].length;
i<j;
i++){f.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data);
}}}}}}function bg(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a;
}function W(a,b,c){b=b||0;
if(f.isFunction(b)){return f.grep(a,function(a,d){var e=!!b.call(a,d,a);
return e===c;
});
}if(b.nodeType){return f.grep(a,function(a,d){return a===b===c;
});
}if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1;
});
if(R.test(b)){return f.filter(b,d,!c);
}b=f.filter(b,d);
}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c;
});
}function V(a){return !a||!a.parentNode||a.parentNode.nodeType===11;
}function N(a,b){return(a&&a!=="*"?a+".":"")+b.replace(z,"`").replace(A,"&");
}function M(a){var b,c,d,e,g,h,i,j,k,l,m,n,o,p=[],q=[],r=f._data(this,"events");
if(!(a.liveFired===this||!r||!r.live||a.target.disabled||a.button&&a.type==="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;
var s=r.live.slice(0);
for(i=0;
i<s.length;
i++){g=s[i],g.origType.replace(x,"")===a.type?q.push(g.selector):s.splice(i--,1);
}e=f(a.target).closest(q,a.currentTarget);
for(j=0,k=e.length;
j<k;
j++){m=e[j];
for(i=0;
i<s.length;
i++){g=s[i];
if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,d=null;
if(g.preType==="mouseenter"||g.preType==="mouseleave"){a.type=g.preType,d=f(a.relatedTarget).closest(g.selector)[0],d&&f.contains(h,d)&&(d=h);
}(!d||d!==h)&&p.push({elem:h,handleObj:g,level:m.level});
}}}for(j=0,k=p.length;
j<k;
j++){e=p[j];
if(c&&e.level>c){break;
}a.currentTarget=e.elem,a.data=e.handleObj.data,a.handleObj=e.handleObj,o=e.handleObj.origHandler.apply(e.elem,arguments);
if(o===!1||a.isPropagationStopped()){c=e.level,o===!1&&(b=!1);
if(a.isImmediatePropagationStopped()){break;
}}}return b;
}}function K(a,c,d){var e=f.extend({},d[0]);
e.type=a,e.originalEvent={},e.liveFired=b,f.event.handle.call(c,e),e.isDefaultPrevented()&&d[0].preventDefault();
}function E(){return !0;
}function D(){return !1;
}function m(a,c,d){var e=c+"defer",g=c+"queue",h=c+"mark",i=f.data(a,e,b,!0);
i&&(d==="queue"||!f.data(a,g,b,!0))&&(d==="mark"||!f.data(a,h,b,!0))&&setTimeout(function(){!f.data(a,g,b,!0)&&!f.data(a,h,b,!0)&&(f.removeData(a,e,!0),i.resolve());
},0);
}function l(a){for(var b in a){if(b!=="toJSON"){return !1;
}}return !0;
}function k(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(j,"$1-$2").toLowerCase();
d=a.getAttribute(e);
if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNaN(d)?i.test(d)?f.parseJSON(d):d:parseFloat(d);
}catch(g){}f.data(a,c,d);
}else{d=b;
}}return d;
}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left");
}catch(a){setTimeout(J,1);
return;
}e.ready();
}}var e=function(a,b){return new e.fn.init(a,b,h);
},f=a.jQuery,g=a.$,h,i=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/\d/,n=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,o=/^[\],:{}\s]*$/,p=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,q=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,r=/(?:^|:|,)(?:\s*\[)+/g,s=/(webkit)[ \/]([\w.]+)/,t=/(opera)(?:.*version)?[ \/]([\w.]+)/,u=/(msie) ([\w.]+)/,v=/(mozilla)(?:.*? rv:([\w.]+))?/,w=/-([a-z])/ig,x=function(a,b){return b.toUpperCase();
},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};
e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;
if(!a){return this;
}if(a.nodeType){this.context=this[0]=a,this.length=1;
return this;
}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;
return this;
}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];
if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=n.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);
return e.merge(this,a);
}h=c.getElementById(g[2]);
if(h&&h.parentNode){if(h.id!==g[2]){return f.find(a);
}this.length=1,this[0]=h;
}this.context=c,this.selector=a;
return this;
}return !d||d.jquery?(d||f).find(a):this.constructor(d).find(a);
}if(e.isFunction(a)){return f.ready(a);
}a.selector!==b&&(this.selector=a.selector,this.context=a.context);
return e.makeArray(a,this);
},selector:"",jquery:"1.6.2",length:0,size:function(){return this.length;
},toArray:function(){return F.call(this,0);
},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a];
},pushStack:function(a,b,c){var d=this.constructor();
e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");
return d;
},each:function(a,b){return e.each(this,a,b);
},ready:function(a){e.bindReady(),A.done(a);
return this;
},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1);
},first:function(){return this.eq(0);
},last:function(){return this.eq(-1);
},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","));
},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b);
}));
},end:function(){return this.prevObject||this.constructor(null);
},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;
typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);
for(;
j<k;
j++){if((a=arguments[j])!=null){for(c in a){d=i[c],f=a[c];
if(i===f){continue;
}l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f);
}}}return i;
},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);
return e;
},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0);
},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body){return setTimeout(e.ready,1);
}e.isReady=!0;
if(a!==!0&&--e.readyWait>0){return;
}A.resolveWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").unbind("ready");
}},bindReady:function(){if(!A){A=e._Deferred();
if(c.readyState==="complete"){return setTimeout(e.ready,1);
}if(c.addEventListener){c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);
}else{if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);
var b=!1;
try{b=a.frameElement==null;
}catch(d){}c.documentElement.doScroll&&b&&J();
}}}},isFunction:function(a){return e.type(a)==="function";
},isArray:Array.isArray||function(a){return e.type(a)==="array";
},isWindow:function(a){return a&&typeof a=="object"&&"setInterval" in a;
},isNaN:function(a){return a==null||!m.test(a)||isNaN(a);
},type:function(a){return a==null?String(a):I[C.call(a)]||"object";
},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a)){return !1;
}if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf")){return !1;
}var c;
for(c in a){}return c===b||D.call(a,c);
},isEmptyObject:function(a){for(var b in a){return !1;
}return !0;
},error:function(a){throw a;
},parseJSON:function(b){if(typeof b!="string"||!b){return null;
}b=e.trim(b);
if(a.JSON&&a.JSON.parse){return a.JSON.parse(b);
}if(o.test(b.replace(p,"@").replace(q,"]").replace(r,""))){return(new Function("return "+b))();
}e.error("Invalid JSON: "+b);
},parseXML:function(b,c,d){a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b)),d=c.documentElement,(!d||!d.nodeName||d.nodeName==="parsererror")&&e.error("Invalid XML: "+b);
return c;
},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b);
})(b);
},camelCase:function(a){return a.replace(w,x);
},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase();
},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);
if(d){if(i){for(f in a){if(c.apply(a[f],d)===!1){break;
}}}else{for(;
g<h;
){if(c.apply(a[g++],d)===!1){break;
}}}}else{if(i){for(f in a){if(c.call(a[f],f,a[f])===!1){break;
}}}else{for(;
g<h;
){if(c.call(a[g],g,a[g++])===!1){break;
}}}}return a;
},trim:G?function(a){return a==null?"":G.call(a);
}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"");
},makeArray:function(a,b){var c=b||[];
if(a!=null){var d=e.type(a);
a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a);
}return c;
},inArray:function(a,b){if(H){return H.call(b,a);
}for(var c=0,d=b.length;
c<d;
c++){if(b[c]===a){return c;
}}return -1;
},merge:function(a,c){var d=a.length,e=0;
if(typeof c.length=="number"){for(var f=c.length;
e<f;
e++){a[d++]=c[e];
}}else{while(c[e]!==b){a[d++]=c[e++];
}}a.length=d;
return a;
},grep:function(a,b,c){var d=[],e;
c=!!c;
for(var f=0,g=a.length;
f<g;
f++){e=!!b(a[f],f),c!==e&&d.push(a[f]);
}return d;
},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));
if(k){for(;
i<j;
i++){f=c(a[i],i,d),f!=null&&(h[h.length]=f);
}}else{for(g in a){f=c(a[g],g,d),f!=null&&(h[h.length]=f);
}}return h.concat.apply([],h);
},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];
c=a,a=d;
}if(!e.isFunction(a)){return b;
}var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)));
};
g.guid=a.guid=a.guid||g.guid||e.guid++;
return g;
},access:function(a,c,d,f,g,h){var i=a.length;
if(typeof c=="object"){for(var j in c){e.access(a,j,c[j],f,g,d);
}return a;
}if(d!==b){f=!h&&f&&e.isFunction(d);
for(var k=0;
k<i;
k++){g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);
}return a;
}return i?g(a[0],c):b;
},now:function(){return(new Date).getTime();
},uaMatch:function(a){a=a.toLowerCase();
var b=s.exec(a)||t.exec(a)||u.exec(a)||a.indexOf("compatible")<0&&v.exec(a)||[];
return{browser:b[1]||"",version:b[2]||"0"};
},sub:function(){function a(b,c){return new a.fn.init(b,c);
}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));
return e.fn.init.call(this,d,f,b);
},a.fn.init.prototype=a.fn;
var b=a(c);
return a;
},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase();
}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready();
}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready());
});
return e;
}(),g="done fail isResolved isRejected promise then always pipe".split(" "),h=[].slice;
f.extend({_Deferred:function(){var a=[],b,c,d,e={done:function(){if(!d){var c=arguments,g,h,i,j,k;
b&&(k=b,b=0);
for(g=0,h=c.length;
g<h;
g++){i=c[g],j=f.type(i),j==="array"?e.done.apply(e,i):j==="function"&&a.push(i);
}k&&e.resolveWith(k[0],k[1]);
}return this;
},resolveWith:function(e,f){if(!d&&!b&&!c){f=f||[],c=1;
try{while(a[0]){a.shift().apply(e,f);
}}finally{b=[e,f],c=0;
}}return this;
},resolve:function(){e.resolveWith(this,arguments);
return this;
},isResolved:function(){return !!c||!!b;
},cancel:function(){d=1,a=[];
return this;
}};
return e;
},Deferred:function(a){var b=f._Deferred(),c=f._Deferred(),d;
f.extend(b,{then:function(a,c){b.done(a).fail(c);
return this;
},always:function(){return b.done.apply(b,arguments).fail.apply(this,arguments);
},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,pipe:function(a,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[c,"reject"]},function(a,c){var e=c[0],g=c[1],h;
f.isFunction(e)?b[a](function(){h=e.apply(this,arguments),h&&f.isFunction(h.promise)?h.promise().then(d.resolve,d.reject):d[g](h);
}):b[a](d[g]);
});
}).promise();
},promise:function(a){if(a==null){if(d){return d;
}d=a={};
}var c=g.length;
while(c--){a[g[c]]=b[g[c]];
}return a;
}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);
return b;
},when:function(a){function i(a){return function(c){b[a]=arguments.length>1?h.call(arguments,0):c,--e||g.resolveWith(g,h.call(b,0));
};
}var b=arguments,c=0,d=b.length,e=d,g=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred();
if(d>1){for(;
c<d;
c++){b[c]&&f.isFunction(b[c].promise)?b[c].promise().then(i(c),g.reject):--e;
}e||g.resolveWith(g,b);
}else{g!==a&&g.resolveWith(g,d?[a]:[]);
}return g.promise();
}}),f.support=function(){var a=c.createElement("div"),b=c.documentElement,d,e,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;
a.setAttribute("className","t"),a.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=a.getElementsByTagName("*"),e=a.getElementsByTagName("a")[0];
if(!d||!d.length||!e){return{};
}g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=a.getElementsByTagName("input")[0],k={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55$/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:a.className!=="t",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,k.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,k.optDisabled=!h.disabled;
try{delete a.test;
}catch(v){k.deleteExpando=!1;
}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function(){k.noCloneEvent=!1;
}),a.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),k.radioValue=i.value==="t",i.setAttribute("checked","checked"),a.appendChild(i),l=c.createDocumentFragment(),l.appendChild(a.firstChild),k.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,a.innerHTML="",a.style.width=a.style.paddingLeft="1px",m=c.getElementsByTagName("body")[0],o=c.createElement(m?"div":"body"),p={visibility:"hidden",width:0,height:0,border:0,margin:0},m&&f.extend(p,{position:"absolute",left:-1000,top:-1000});
for(t in p){o.style[t]=p[t];
}o.appendChild(a),n=m||b,n.insertBefore(o,n.firstChild),k.appendChecked=i.checked,k.boxModel=a.offsetWidth===2,"zoom" in a.style&&(a.style.display="inline",a.style.zoom=1,k.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",k.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",q=a.getElementsByTagName("td"),u=q[0].offsetHeight===0,q[0].style.display="",q[1].style.display="none",k.reliableHiddenOffsets=u&&q[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",a.appendChild(j),k.reliableMarginRight=(parseInt((c.defaultView.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0),o.innerHTML="",n.removeChild(o);
if(a.attachEvent){for(t in {submit:1,change:1,focusin:1}){s="on"+t,u=s in a,u||(a.setAttribute(s,"return;"),u=typeof a[s]=="function"),k[t+"Bubbles"]=u;
}}o=l=g=h=m=j=a=i=null;
return k;
}(),f.boxModel=f.support.boxModel;
var i=/^(?:\{.*\}|\[.*\])$/,j=/([a-z])([A-Z])/g;
f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];
return !!a&&!l(a);
},data:function(a,c,d,e){if(!!f.acceptData(a)){var g=f.expando,h=typeof c=="string",i,j=a.nodeType,k=j?f.cache:a,l=j?a[f.expando]:a[f.expando]&&f.expando;
if((!l||e&&l&&!k[l][g])&&h&&d===b){return;
}l||(j?a[f.expando]=l=++f.uuid:l=f.expando),k[l]||(k[l]={},j||(k[l].toJSON=f.noop));
if(typeof c=="object"||typeof c=="function"){e?k[l][g]=f.extend(k[l][g],c):k[l]=f.extend(k[l],c);
}i=k[l],e&&(i[g]||(i[g]={}),i=i[g]),d!==b&&(i[f.camelCase(c)]=d);
if(c==="events"&&!i[c]){return i[g]&&i[g].events;
}return h?i[f.camelCase(c)]||i[c]:i;
}},removeData:function(b,c,d){if(!!f.acceptData(b)){var e=f.expando,g=b.nodeType,h=g?f.cache:b,i=g?b[f.expando]:f.expando;
if(!h[i]){return;
}if(c){var j=d?h[i][e]:h[i];
if(j){delete j[c];
if(!l(j)){return;
}}}if(d){delete h[i][e];
if(!l(h[i])){return;
}}var k=h[i][e];
f.support.deleteExpando||h!=a?delete h[i]:h[i]=null,k?(h[i]={},g||(h[i].toJSON=f.noop),h[i][e]=k):g&&(f.support.deleteExpando?delete b[f.expando]:b.removeAttribute?b.removeAttribute(f.expando):b[f.expando]=null);
}},_data:function(a,b,c){return f.data(a,b,c,!0);
},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];
if(b){return b!==!0&&a.getAttribute("classid")===b;
}}return !0;
}}),f.fn.extend({data:function(a,c){var d=null;
if(typeof a=="undefined"){if(this.length){d=f.data(this[0]);
if(this[0].nodeType===1){var e=this[0].attributes,g;
for(var h=0,i=e.length;
h<i;
h++){g=e[h].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),k(this[0],g,d[g]));
}}}return d;
}if(typeof a=="object"){return this.each(function(){f.data(this,a);
});
}var j=a.split(".");
j[1]=j[1]?"."+j[1]:"";
if(c===b){d=this.triggerHandler("getData"+j[1]+"!",[j[0]]),d===b&&this.length&&(d=f.data(this[0],a),d=k(this[0],a,d));
return d===b&&j[1]?this.data(j[0]):d;
}return this.each(function(){var b=f(this),d=[j[0],c];
b.triggerHandler("setData"+j[1]+"!",d),f.data(this,a,c),b.triggerHandler("changeData"+j[1]+"!",d);
});
},removeData:function(a){return this.each(function(){f.removeData(this,a);
});
}}),f.extend({_mark:function(a,c){a&&(c=(c||"fx")+"mark",f.data(a,c,(f.data(a,c,b,!0)||0)+1,!0));
},_unmark:function(a,c,d){a!==!0&&(d=c,c=a,a=!1);
if(c){d=d||"fx";
var e=d+"mark",g=a?0:(f.data(c,e,b,!0)||1)-1;
g?f.data(c,e,g,!0):(f.removeData(c,e,!0),m(c,d,"mark"));
}},queue:function(a,c,d){if(a){c=(c||"fx")+"queue";
var e=f.data(a,c,b,!0);
d&&(!e||f.isArray(d)?e=f.data(a,c,f.makeArray(d),!0):e.push(d));
return e||[];
}},dequeue:function(a,b){b=b||"fx";
var c=f.queue(a,b),d=c.shift(),e;
d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),d.call(a,function(){f.dequeue(a,b);
})),c.length||(f.removeData(a,b+"queue",!0),m(a,b,"queue"));
}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");
if(c===b){return f.queue(this[0],a);
}return this.each(function(){var b=f.queue(this,a,c);
a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a);
});
},dequeue:function(a){return this.each(function(){f.dequeue(this,a);
});
},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";
return this.queue(b,function(){var c=this;
setTimeout(function(){f.dequeue(c,b);
},a);
});
},clearQueue:function(a){return this.queue(a||"fx",[]);
},promise:function(a,c){function m(){--h||d.resolveWith(e,[e]);
}typeof a!="string"&&(c=a,a=b),a=a||"fx";
var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;
while(g--){if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f._Deferred(),!0)){h++,l.done(m);
}}m();
return d.promise();
}});
var n=/[\n\t\r]/g,o=/\s+/,p=/\r/g,q=/^(?:button|input)$/i,r=/^(?:button|input|object|select|textarea)$/i,s=/^a(?:rea)?$/i,t=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,u=/\:|^on/,v,w;
f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr);
},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a);
});
},prop:function(a,b){return f.access(this,a,b,!0,f.prop);
},removeProp:function(a){a=f.propFix[a]||a;
return this.each(function(){try{this[a]=b,delete this[a];
}catch(c){}});
},addClass:function(a){var b,c,d,e,g,h,i;
if(f.isFunction(a)){return this.each(function(b){f(this).addClass(a.call(this,b,this.className));
});
}if(a&&typeof a=="string"){b=a.split(o);
for(c=0,d=this.length;
c<d;
c++){e=this[c];
if(e.nodeType===1){if(!e.className&&b.length===1){e.className=a;
}else{g=" "+e.className+" ";
for(h=0,i=b.length;
h<i;
h++){~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");
}e.className=f.trim(g);
}}}}return this;
},removeClass:function(a){var c,d,e,g,h,i,j;
if(f.isFunction(a)){return this.each(function(b){f(this).removeClass(a.call(this,b,this.className));
});
}if(a&&typeof a=="string"||a===b){c=(a||"").split(o);
for(d=0,e=this.length;
d<e;
d++){g=this[d];
if(g.nodeType===1&&g.className){if(a){h=(" "+g.className+" ").replace(n," ");
for(i=0,j=c.length;
i<j;
i++){h=h.replace(" "+c[i]+" "," ");
}g.className=f.trim(h);
}else{g.className="";
}}}}return this;
},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";
if(f.isFunction(a)){return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b);
});
}return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(o);
while(e=j[g++]){i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e);
}}else{if(c==="undefined"||c==="boolean"){this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||"";
}}});
},hasClass:function(a){var b=" "+a+" ";
for(var c=0,d=this.length;
c<d;
c++){if((" "+this[c].className+" ").replace(n," ").indexOf(b)>-1){return !0;
}}return !1;
},val:function(a){var c,d,e=this[0];
if(!arguments.length){if(e){c=f.valHooks[e.nodeName.toLowerCase()]||f.valHooks[e.type];
if(c&&"get" in c&&(d=c.get(e,"value"))!==b){return d;
}d=e.value;
return typeof d=="string"?d.replace(p,""):d==null?"":d;
}return b;
}var g=f.isFunction(a);
return this.each(function(d){var e=f(this),h;
if(this.nodeType===1){g?h=a.call(this,d,e.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+"";
})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];
if(!c||!("set" in c)||c.set(this,h,"value")===b){this.value=h;
}}});
}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;
return !b||b.specified?a.value:a.text;
}},select:{get:function(a){var b,c=a.selectedIndex,d=[],e=a.options,g=a.type==="select-one";
if(c<0){return null;
}for(var h=g?c:0,i=g?c+1:e.length;
h<i;
h++){var j=e[h];
if(j.selected&&(f.support.optDisabled?!j.disabled:j.getAttribute("disabled")===null)&&(!j.parentNode.disabled||!f.nodeName(j.parentNode,"optgroup"))){b=f(j).val();
if(g){return b;
}d.push(b);
}}if(g&&!d.length&&e.length){return f(e[c]).val();
}return d;
},set:function(a,b){var c=f.makeArray(b);
f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0;
}),c.length||(a.selectedIndex=-1);
return c;
}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attrFix:{tabindex:"tabIndex"},attr:function(a,c,d,e){var g=a.nodeType;
if(!a||g===3||g===8||g===2){return b;
}if(e&&c in f.attrFn){return f(a)[c](d);
}if(!("getAttribute" in a)){return f.prop(a,c,d);
}var h,i,j=g!==1||!f.isXMLDoc(a);
j&&(c=f.attrFix[c]||c,i=f.attrHooks[c],i||(t.test(c)?i=w:v&&c!=="className"&&(f.nodeName(a,"form")||u.test(c))&&(i=v)));
if(d!==b){if(d===null){f.removeAttr(a,c);
return b;
}if(i&&"set" in i&&j&&(h=i.set(a,d,c))!==b){return h;
}a.setAttribute(c,""+d);
return d;
}if(i&&"get" in i&&j&&(h=i.get(a,c))!==null){return h;
}h=a.getAttribute(c);
return h===null?b:h;
},removeAttr:function(a,b){var c;
a.nodeType===1&&(b=f.attrFix[b]||b,f.support.getSetAttribute?a.removeAttribute(b):(f.attr(a,b,""),a.removeAttributeNode(a.getAttributeNode(b))),t.test(b)&&(c=f.propFix[b]||b) in a&&(a[c]=!1));
},attrHooks:{type:{set:function(a,b){if(q.test(a.nodeName)&&a.parentNode){f.error("type property can't be changed");
}else{if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;
a.setAttribute("type",b),c&&(a.value=c);
return b;
}}}},tabIndex:{get:function(a){var c=a.getAttributeNode("tabIndex");
return c&&c.specified?parseInt(c.value,10):r.test(a.nodeName)||s.test(a.nodeName)&&a.href?0:b;
}},value:{get:function(a,b){if(v&&f.nodeName(a,"button")){return v.get(a,b);
}return b in a?a.value:null;
},set:function(a,b,c){if(v&&f.nodeName(a,"button")){return v.set(a,b,c);
}a.value=b;
}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e=a.nodeType;
if(!a||e===3||e===8||e===2){return b;
}var g,h,i=e!==1||!f.isXMLDoc(a);
i&&(c=f.propFix[c]||c,h=f.propHooks[c]);
return d!==b?h&&"set" in h&&(g=h.set(a,d,c))!==b?g:a[c]=d:h&&"get" in h&&(g=h.get(a,c))!==b?g:a[c];
},propHooks:{}}),w={get:function(a,c){return f.prop(a,c)?c.toLowerCase():b;
},set:function(a,b,c){var d;
b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));
return c;
}},f.support.getSetAttribute||(f.attrFix=f.propFix,v=f.attrHooks.name=f.attrHooks.title=f.valHooks.button={get:function(a,c){var d;
d=a.getAttributeNode(c);
return d&&d.nodeValue!==""?d.nodeValue:b;
},set:function(a,b,c){var d=a.getAttributeNode(c);
if(d){d.nodeValue=b;
return b;
}}},f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");
return c;
}}});
})),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);
return d===null?b:d;
}});
}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b;
},set:function(a,b){return a.style.cssText=""+b;
}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;
b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);
}})),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value;
}};
}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b)){return a.checked=f.inArray(f(a).val(),b)>=0;
}}});
});
var x=/\.(.*)$/,y=/^(?:textarea|input|select)$/i,z=/\./g,A=/ /g,B=/[^\w\s.|`]/g,C=function(a){return a.replace(B,"\\$&");
};
f.event={add:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){if(d===!1){d=D;
}else{if(!d){return;
}}var g,h;
d.handler&&(g=d,d=g.handler),d.guid||(d.guid=f.guid++);
var i=f._data(a);
if(!i){return;
}var j=i.events,k=i.handle;
j||(i.events=j={}),k||(i.handle=k=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.handle.apply(k.elem,arguments):b;
}),k.elem=a,c=c.split(" ");
var l,m=0,n;
while(l=c[m++]){h=g?f.extend({},g):{handler:d,data:e},l.indexOf(".")>-1?(n=l.split("."),l=n.shift(),h.namespace=n.slice(0).sort().join(".")):(n=[],h.namespace=""),h.type=l,h.guid||(h.guid=d.guid);
var o=j[l],p=f.event.special[l]||{};
if(!o){o=j[l]=[];
if(!p.setup||p.setup.call(a,e,n,k)===!1){a.addEventListener?a.addEventListener(l,k,!1):a.attachEvent&&a.attachEvent("on"+l,k);
}}p.add&&(p.add.call(a,h),h.handler.guid||(h.handler.guid=d.guid)),o.push(h),f.event.global[l]=!0;
}a=null;
}},global:{},remove:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){d===!1&&(d=D);
var g,h,i,j,k=0,l,m,n,o,p,q,r,s=f.hasData(a)&&f._data(a),t=s&&s.events;
if(!s||!t){return;
}c&&c.type&&(d=c.handler,c=c.type);
if(!c||typeof c=="string"&&c.charAt(0)==="."){c=c||"";
for(h in t){f.event.remove(a,h+c);
}return;
}c=c.split(" ");
while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+f.map(m.slice(0).sort(),C).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];
if(!p){continue;
}if(!d){for(j=0;
j<p.length;
j++){q=p[j];
if(l||n.test(q.namespace)){f.event.remove(a,r,q.handler,j),p.splice(j--,1);
}}continue;
}o=f.event.special[h]||{};
for(j=e||0;
j<p.length;
j++){q=p[j];
if(d.guid===q.guid){if(l||n.test(q.namespace)){e==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);
}if(e!=null){break;
}}}if(p.length===0||e!=null&&p.length===1){(!o.teardown||o.teardown.call(a,m)===!1)&&f.removeEvent(a,h,s.handle),g=null,delete t[h];
}}if(f.isEmptyObject(t)){var u=s.handle;
u&&(u.elem=null),delete s.events,delete s.handle,f.isEmptyObject(s)&&f.removeData(a,b,!0);
}}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){var h=c.type||c,i=[],j;
h.indexOf("!")>=0&&(h=h.slice(0,-1),j=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());
if(!!e&&!f.event.customEvent[h]||!!f.event.global[h]){c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.exclusive=j,c.namespace=i.join("."),c.namespace_re=new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)");
if(g||!e){c.preventDefault(),c.stopPropagation();
}if(!e){f.each(f.cache,function(){var a=f.expando,b=this[a];
b&&b.events&&b.events[h]&&f.event.trigger(c,d,b.handle.elem);
});
return;
}if(e.nodeType===3||e.nodeType===8){return;
}c.result=b,c.target=e,d=d!=null?f.makeArray(d):[],d.unshift(c);
var k=e,l=h.indexOf(":")<0?"on"+h:"";
do{var m=f._data(k,"handle");
c.currentTarget=k,m&&m.apply(k,d),l&&f.acceptData(k)&&k[l]&&k[l].apply(k,d)===!1&&(c.result=!1,c.preventDefault()),k=k.parentNode||k.ownerDocument||k===c.target.ownerDocument&&a;
}while(k&&!c.isPropagationStopped());
if(!c.isDefaultPrevented()){var n,o=f.event.special[h]||{};
if((!o._default||o._default.call(e.ownerDocument,c)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)){try{l&&e[h]&&(n=e[l],n&&(e[l]=null),f.event.triggered=h,e[h]());
}catch(p){}n&&(e[l]=n),f.event.triggered=b;
}}return c.result;
}},handle:function(c){c=f.event.fix(c||a.event);
var d=((f._data(this,"events")||{})[c.type]||[]).slice(0),e=!c.exclusive&&!c.namespace,g=Array.prototype.slice.call(arguments,0);
g[0]=c,c.currentTarget=this;
for(var h=0,i=d.length;
h<i;
h++){var j=d[h];
if(e||c.namespace_re.test(j.namespace)){c.handler=j.handler,c.data=j.data,c.handleObj=j;
var k=j.handler.apply(this,g);
k!==b&&(c.result=k,k===!1&&(c.preventDefault(),c.stopPropagation()));
if(c.isImmediatePropagationStopped()){break;
}}}return c.result;
},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[f.expando]){return a;
}var d=a;
a=f.Event(d);
for(var e=this.props.length,g;
e;
){g=this.props[--e],a[g]=d[g];
}a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);
if(a.pageX==null&&a.clientX!=null){var h=a.target.ownerDocument||c,i=h.documentElement,j=h.body;
a.pageX=a.clientX+(i&&i.scrollLeft||j&&j.scrollLeft||0)-(i&&i.clientLeft||j&&j.clientLeft||0),a.pageY=a.clientY+(i&&i.scrollTop||j&&j.scrollTop||0)-(i&&i.clientTop||j&&j.clientTop||0);
}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);
return a;
},guid:100000000,proxy:f.proxy,special:{ready:{setup:f.bindReady,teardown:f.noop},live:{add:function(a){f.event.add(this,N(a.origType,a.selector),f.extend({},a,{handler:M,guid:a.handler.guid}));
},remove:function(a){f.event.remove(this,N(a.origType,a.selector),a);
}},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c);
},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null);
}}}},f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1);
}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c);
},f.Event=function(a,b){if(!this.preventDefault){return new f.Event(a,b);
}a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?E:D):this.type=a,b&&f.extend(this,b),this.timeStamp=f.now(),this[f.expando]=!0;
},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=E;
var a=this.originalEvent;
!a||(a.preventDefault?a.preventDefault():a.returnValue=!1);
},stopPropagation:function(){this.isPropagationStopped=E;
var a=this.originalEvent;
!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0);
},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=E,this.stopPropagation();
},isDefaultPrevented:D,isPropagationStopped:D,isImmediatePropagationStopped:D};
var F=function(a){var b=a.relatedTarget,c=!1,d=a.type;
a.type=a.data,b!==this&&(b&&(c=f.contains(this,b)),c||(f.event.handle.apply(this,arguments),a.type=d));
},G=function(a){a.type=a.data,f.event.handle.apply(this,arguments);
};
f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={setup:function(c){f.event.add(this,b,c&&c.selector?G:F,a);
},teardown:function(a){f.event.remove(this,b,a&&a.selector?G:F);
}};
}),f.support.submitBubbles||(f.event.special.submit={setup:function(a,b){if(!f.nodeName(this,"form")){f.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=b.type;
(c==="submit"||c==="image")&&f(b).closest("form").length&&K("submit",this,arguments);
}),f.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=b.type;
(c==="text"||c==="password")&&f(b).closest("form").length&&a.keyCode===13&&K("submit",this,arguments);
});
}else{return !1;
}},teardown:function(a){f.event.remove(this,".specialSubmit");
}});
if(!f.support.changeBubbles){var H,I=function(a){var b=a.type,c=a.value;
b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?f.map(a.options,function(a){return a.selected;
}).join("-"):"":f.nodeName(a,"select")&&(c=a.selectedIndex);
return c;
},J=function(c){var d=c.target,e,g;
if(!!y.test(d.nodeName)&&!d.readOnly){e=f._data(d,"_change_data"),g=I(d),(c.type!=="focusout"||d.type!=="radio")&&f._data(d,"_change_data",g);
if(e===b||g===e){return;
}if(e!=null||g){c.type="change",c.liveFired=b,f.event.trigger(c,arguments[1],d);
}}};
f.event.special.change={filters:{focusout:J,beforedeactivate:J,click:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";
(c==="radio"||c==="checkbox"||f.nodeName(b,"select"))&&J.call(this,a);
},keydown:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";
(a.keyCode===13&&!f.nodeName(b,"textarea")||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&J.call(this,a);
},beforeactivate:function(a){var b=a.target;
f._data(b,"_change_data",I(b));
}},setup:function(a,b){if(this.type==="file"){return !1;
}for(var c in H){f.event.add(this,c+".specialChange",H[c]);
}return y.test(this.nodeName);
},teardown:function(a){f.event.remove(this,".specialChange");
return y.test(this.nodeName);
}},H=f.event.special.change.filters,H.focus=H.beforeactivate;
}f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){function e(a){var c=f.event.fix(a);
c.type=b,c.originalEvent={},f.event.trigger(c,null,c.target),c.isDefaultPrevented()&&a.preventDefault();
}var d=0;
f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0);
},teardown:function(){--d===0&&c.removeEventListener(a,e,!0);
}};
}),f.each(["bind","one"],function(a,c){f.fn[c]=function(a,d,e){var g;
if(typeof a=="object"){for(var h in a){this[c](h,d,a[h],e);
}return this;
}if(arguments.length===2||d===!1){e=d,d=b;
}c==="one"?(g=function(a){f(this).unbind(a,g);
return e.apply(this,arguments);
},g.guid=e.guid||f.guid++):g=e;
if(a==="unload"&&c!=="one"){this.one(a,d,e);
}else{for(var i=0,j=this.length;
i<j;
i++){f.event.add(this[i],a,g,d);
}}return this;
};
}),f.fn.extend({unbind:function(a,b){if(typeof a=="object"&&!a.preventDefault){for(var c in a){this.unbind(c,a[c]);
}}else{for(var d=0,e=this.length;
d<e;
d++){f.event.remove(this[d],a,b);
}}return this;
},delegate:function(a,b,c,d){return this.live(b,c,d,a);
},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a);
},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this);
});
},triggerHandler:function(a,b){if(this[0]){return f.event.trigger(a,b,this[0],!0);
}},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f.data(this,"lastToggle"+a.guid)||0)%d;
f.data(this,"lastToggle"+a.guid,e+1),c.preventDefault();
return b[e].apply(this,arguments)||!1;
};
e.guid=c;
while(d<b.length){b[d++].guid=c;
}return this.click(e);
},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a);
}});
var L={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};
f.each(["live","die"],function(a,c){f.fn[c]=function(a,d,e,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:f(this.context);
if(typeof a=="object"&&!a.preventDefault){for(var o in a){n[c](o,d,a[o],m);
}return this;
}if(c==="die"&&!a&&g&&g.charAt(0)==="."){n.unbind(g);
return this;
}if(d===!1||f.isFunction(d)){e=d||D,d=b;
}a=(a||"").split(" ");
while((h=a[i++])!=null){j=x.exec(h),k="",j&&(k=j[0],h=h.replace(x,""));
if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);
continue;
}l=h,L[h]?(a.push(L[h]+k),h=h+k):h=(L[h]||h)+k;
if(c==="live"){for(var p=0,q=n.length;
p<q;
p++){f.event.add(n[p],"live."+N(h,m),{data:d,selector:m,handler:e,origType:h,origHandler:e,preType:l});
}}else{n.unbind("live."+N(h,m),e);
}}return this;
};
}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);
return arguments.length>0?this.bind(b,a,c):this.trigger(b);
},f.attrFn&&(f.attrFn[b]=!0);
}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;
g<h;
g++){var i=d[g];
if(i){var j=!1;
i=i[a];
while(i){if(i.sizcache===c){j=d[i.sizset];
break;
}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);
if(typeof b!="string"){if(i===b){j=!0;
break;
}}else{if(k.filter(b,[i]).length>0){j=i;
break;
}}}i=i[a];
}d[g]=j;
}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;
g<h;
g++){var i=d[g];
if(i){var j=!1;
i=i[a];
while(i){if(i.sizcache===c){j=d[i.sizset];
break;
}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);
if(i.nodeName.toLowerCase()===b){j=i;
break;
}i=i[a];
}d[g]=j;
}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d=0,e=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;
[0,0].sort(function(){h=!1;
return 0;
});
var k=function(b,d,f,g){f=f||[],d=d||c;
var h=d;
if(d.nodeType!==1&&d.nodeType!==9){return[];
}if(!b||typeof b!="string"){return f;
}var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;
do{a.exec(""),i=a.exec(y);
if(i){y=i[3],x.push(i[1]);
if(i[2]){o=i[3];
break;
}}}while(i);
if(x.length>1&&m.exec(b)){if(x.length===2&&l.relative[x[0]]){j=v(x[0]+x[1],d);
}else{j=l.relative[x[0]]?[d]:k(x.shift(),d);
while(x.length){b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j);
}}}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);
if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;
while(x.length){r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w);
}}else{n=x=[];
}}n||(n=j),n||k.error(r||b);
if(e.call(n)==="[object Array]"){if(!u){f.push.apply(f,n);
}else{if(d&&d.nodeType===1){for(t=0;
n[t]!=null;
t++){n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&f.push(j[t]);
}}else{for(t=0;
n[t]!=null;
t++){n[t]&&n[t].nodeType===1&&f.push(j[t]);
}}}}else{p(n,f);
}o&&(k(o,h,f,g),k.uniqueSort(f));
return f;
};
k.uniqueSort=function(a){if(r){g=h,a.sort(r);
if(g){for(var b=1;
b<a.length;
b++){a[b]===a[b-1]&&a.splice(b--,1);
}}}return a;
},k.matches=function(a,b){return k(a,null,null,b);
},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0;
},k.find=function(a,b,c){var d;
if(!a){return[];
}for(var e=0,f=l.order.length;
e<f;
e++){var g,h=l.order[e];
if(g=l.leftMatch[h].exec(a)){var j=g[1];
g.splice(1,1);
if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);
if(d!=null){a=a.replace(l.match[h],"");
break;
}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);
return{set:d,expr:a};
},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);
while(a&&c.length){for(var n in l.filter){if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];
g=!1,f.splice(1,1);
if(r.substr(r.length-1)==="\\"){continue;
}j===i&&(i=[]);
if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);
if(!f){g=o=!0;
}else{if(f===!0){continue;
}}}if(f){for(var s=0;
(p=j[s])!=null;
s++){if(p){o=q(p,f,s,j);
var t=e^!!o;
d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0);
}}}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");
if(!g){return[];
}break;
}}}if(a===h){if(g==null){k.error(a);
}else{break;
}}h=a;
}return j;
},k.error=function(a){throw"Syntax error, unrecognized expression: "+a;
};
var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href");
},type:function(a){return a.getAttribute("type");
}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!j.test(b),e=c&&!d;
d&&(b=b.toLowerCase());
for(var f=0,g=a.length,h;
f<g;
f++){if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1){}a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b;
}}e&&k.filter(b,a,!0);
},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;
if(d&&!j.test(b)){b=b.toLowerCase();
for(;
e<f;
e++){c=a[e];
if(c){var g=c.parentNode;
a[e]=g.nodeName.toLowerCase()===b?g:!1;
}}}else{for(;
e<f;
e++){c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);
}d&&k.filter(b,a,!0);
}},"":function(a,b,c){var e,f=d++,g=u;
typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("parentNode",b,f,a,e,c);
},"~":function(a,b,c){var e,f=d++,g=u;
typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("previousSibling",b,f,a,e,c);
}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);
return d&&d.parentNode?[d]:[];
}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);
for(var e=0,f=d.length;
e<f;
e++){d[e].getAttribute("name")===a[1]&&c.push(d[e]);
}return c.length===0?null:c;
}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined"){return b.getElementsByTagName(a[1]);
}}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";
if(f){return a;
}for(var g=0,h;
(h=b[g])!=null;
g++){h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));
}return !1;
},ID:function(a){return a[1].replace(i,"");
},TAG:function(a,b){return a[1].replace(i,"").toLowerCase();
},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");
var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);
a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0;
}else{a[2]&&k.error(a[0]);
}a[0]=d++;
return a;
},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");
!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");
return a;
},PSEUDO:function(b,c,d,e,f){if(b[1]==="not"){if((a.exec(b[3])||"").length>1||/^\w/.test(b[3])){b[3]=k(b[3],null,null,c);
}else{var g=k.filter(b[3],c,d,!0^f);
d||e.push.apply(e,g);
return !1;
}}else{if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0])){return !0;
}}return b;
},POS:function(a){a.unshift(!0);
return a;
}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden";
},disabled:function(a){return a.disabled===!0;
},checked:function(a){return a.checked===!0;
},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;
return a.selected===!0;
},parent:function(a){return !!a.firstChild;
},empty:function(a){return !a.firstChild;
},has:function(a,b,c){return !!k(c[3],a).length;
},header:function(a){return/h\d/i.test(a.nodeName);
},text:function(a){var b=a.getAttribute("type"),c=a.type;
return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null);
},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type;
},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type;
},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type;
},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type;
},submit:function(a){var b=a.nodeName.toLowerCase();
return(b==="input"||b==="button")&&"submit"===a.type;
},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type;
},reset:function(a){var b=a.nodeName.toLowerCase();
return(b==="input"||b==="button")&&"reset"===a.type;
},button:function(a){var b=a.nodeName.toLowerCase();
return b==="input"&&"button"===a.type||b==="button";
},input:function(a){return/input|select|textarea|button/i.test(a.nodeName);
},focus:function(a){return a===a.ownerDocument.activeElement;
}},setFilters:{first:function(a,b){return b===0;
},last:function(a,b,c,d){return b===d.length-1;
},even:function(a,b){return b%2===0;
},odd:function(a,b){return b%2===1;
},lt:function(a,b,c){return b<c[3]-0;
},gt:function(a,b,c){return b>c[3]-0;
},nth:function(a,b,c){return c[3]-0===b;
},eq:function(a,b,c){return c[3]-0===b;
}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];
if(f){return f(a,c,b,d);
}if(e==="contains"){return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;
}if(e==="not"){var g=b[3];
for(var h=0,i=g.length;
h<i;
h++){if(g[h]===a){return !1;
}}return !0;
}k.error(e);
},CHILD:function(a,b){var c=b[1],d=a;
switch(c){case"only":case"first":while(d=d.previousSibling){if(d.nodeType===1){return !1;
}}if(c==="first"){return !0;
}d=a;
case"last":while(d=d.nextSibling){if(d.nodeType===1){return !1;
}}return !0;
case"nth":var e=b[2],f=b[3];
if(e===1&&f===0){return !0;
}var g=b[0],h=a.parentNode;
if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;
for(d=h.firstChild;
d;
d=d.nextSibling){d.nodeType===1&&(d.nodeIndex=++i);
}h.sizcache=g;
}var j=a.nodeIndex-f;
return e===0?j===0:j%e===0&&j/e>=0;
}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b;
},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b;
},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1;
},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];
return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1;
},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];
if(f){return f(a,c,b,d);
}}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1);
};
for(var o in l.match){l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));
}var p=function(a,b){a=Array.prototype.slice.call(a,0);
if(b){b.push.apply(b,a);
return b;
}return a;
};
try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType;
}catch(q){p=function(a,b){var c=0,d=b||[];
if(e.call(a)==="[object Array]"){Array.prototype.push.apply(d,a);
}else{if(typeof a.length=="number"){for(var f=a.length;
c<f;
c++){d.push(a[c]);
}}else{for(;
a[c];
c++){d.push(a[c]);
}}}return d;
};
}var r,s;
c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;
return 0;
}if(!a.compareDocumentPosition||!b.compareDocumentPosition){return a.compareDocumentPosition?-1:1;
}return a.compareDocumentPosition(b)&4?-1:1;
}:(r=function(a,b){if(a===b){g=!0;
return 0;
}if(a.sourceIndex&&b.sourceIndex){return a.sourceIndex-b.sourceIndex;
}var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;
if(h===i){return s(a,b);
}if(!h){return -1;
}if(!i){return 1;
}while(j){e.unshift(j),j=j.parentNode;
}j=i;
while(j){f.unshift(j),j=j.parentNode;
}c=e.length,d=f.length;
for(var k=0;
k<c&&k<d;
k++){if(e[k]!==f[k]){return s(e[k],f[k]);
}}return k===c?s(a,f[k],-1):s(e[k],b,1);
},s=function(a,b,c){if(a===b){return c;
}var d=a.nextSibling;
while(d){if(d===b){return -1;
}d=d.nextSibling;
}return 1;
}),k.getText=function(a){var b="",c;
for(var d=0;
a[d];
d++){c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));
}return b;
},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;
a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);
return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[];
}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");
return a.nodeType===1&&c&&c.nodeValue===b;
}),e.removeChild(a),e=a=null;
}(),function(){var a=c.createElement("div");
a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);
if(a[1]==="*"){var d=[];
for(var e=0;
c[e];
e++){c[e].nodeType===1&&d.push(c[e]);
}c=d;
}return c;
}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2);
}),a=null;
}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";
b.innerHTML="<p class='TEST'></p>";
if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;
if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1]){return p(e.getElementsByTagName(b),f);
}if(h[2]&&l.find.CLASS&&e.getElementsByClassName){return p(e.getElementsByClassName(h[2]),f);
}}if(e.nodeType===9){if(b==="body"&&e.body){return p([e.body],f);
}if(h&&h[3]){var i=e.getElementById(h[3]);
if(!i||!i.parentNode){return p([],f);
}if(i.id===h[3]){return p([i],f);
}}try{return p(e.querySelectorAll(b),f);
}catch(j){}}else{if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);
n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);
try{if(!r||q){return p(e.querySelectorAll("[id='"+o+"'] "+b),f);
}}catch(s){}finally{n||m.removeAttribute("id");
}}}}return a(b,e,f,g);
};
for(var e in a){k[e]=a[e];
}b=null;
}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;
if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;
try{b.call(c.documentElement,"[test!='']:sizzle");
}catch(f){e=!0;
}k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");
if(!k.isXML(a)){try{if(e||!l.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);
if(f||!d||a.document&&a.document.nodeType!==11){return f;
}}}catch(g){}}return k(c,null,null,[a]).length>0;
};
}}(),function(){var a=c.createElement("div");
a.innerHTML="<div class='test e'></div><div class='test'></div>";
if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";
if(a.getElementsByClassName("e").length===1){return;
}l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c){return b.getElementsByClassName(a[1]);
}},a=null;
}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0);
}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return !!(a.compareDocumentPosition(b)&16);
}:k.contains=function(){return !1;
},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;
return b?b.nodeName!=="HTML":!1;
};
var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;
while(c=l.match.PSEUDO.exec(a)){e+=c[0],a=a.replace(l.match.PSEUDO,"");
}a=l.relative[a]?a+"*":a;
for(var g=0,h=f.length;
g<h;
g++){k(a,f[g],d);
}return k.filter(e,d);
};
f.find=k,f.expr=k.selectors,f.expr[":"]=f.expr.filters,f.unique=k.uniqueSort,f.text=k.getText,f.isXMLDoc=k.isXML,f.contains=k.contains;
}();
var O=/Until$/,P=/^(?:parents|prevUntil|prevAll)/,Q=/,/,R=/^.[^:#\[\.,]*$/,S=Array.prototype.slice,T=f.expr.match.POS,U={children:!0,contents:!0,next:!0,prev:!0};
f.fn.extend({find:function(a){var b=this,c,d;
if(typeof a!="string"){return f(a).filter(function(){for(c=0,d=b.length;
c<d;
c++){if(f.contains(b[c],this)){return !0;
}}});
}var e=this.pushStack("","find",a),g,h,i;
for(c=0,d=this.length;
c<d;
c++){g=e.length,f.find(a,this[c],e);
if(c>0){for(h=g;
h<e.length;
h++){for(i=0;
i<g;
i++){if(e[i]===e[h]){e.splice(h--,1);
break;
}}}}}return e;
},has:function(a){var b=f(a);
return this.filter(function(){for(var a=0,c=b.length;
a<c;
a++){if(f.contains(this,b[a])){return !0;
}}});
},not:function(a){return this.pushStack(W(this,a,!1),"not",a);
},filter:function(a){return this.pushStack(W(this,a,!0),"filter",a);
},is:function(a){return !!a&&(typeof a=="string"?f.filter(a,this).length>0:this.filter(a).length>0);
},closest:function(a,b){var c=[],d,e,g=this[0];
if(f.isArray(a)){var h,i,j={},k=1;
if(g&&a.length){for(d=0,e=a.length;
d<e;
d++){i=a[d],j[i]||(j[i]=T.test(i)?f(i,b||this.context):i);
}while(g&&g.ownerDocument&&g!==b){for(i in j){h=j[i],(h.jquery?h.index(g)>-1:f(g).is(h))&&c.push({selector:i,elem:g,level:k});
}g=g.parentNode,k++;
}}return c;
}var l=T.test(a)||typeof a!="string"?f(a,b||this.context):0;
for(d=0,e=this.length;
d<e;
d++){g=this[d];
while(g){if(l?l.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);
break;
}g=g.parentNode;
if(!g||!g.ownerDocument||g===b||g.nodeType===11){break;
}}}c=c.length>1?f.unique(c):c;
return this.pushStack(c,"closest",a);
},index:function(a){if(!a||typeof a=="string"){return f.inArray(this[0],a?f(a):this.parent().children());
}return f.inArray(a.jquery?a[0]:a,this);
},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);
return this.pushStack(V(c[0])||V(d[0])?d:f.unique(d));
},andSelf:function(){return this.add(this.prevObject);
}}),f.each({parent:function(a){var b=a.parentNode;
return b&&b.nodeType!==11?b:null;
},parents:function(a){return f.dir(a,"parentNode");
},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c);
},next:function(a){return f.nth(a,2,"nextSibling");
},prev:function(a){return f.nth(a,2,"previousSibling");
},nextAll:function(a){return f.dir(a,"nextSibling");
},prevAll:function(a){return f.dir(a,"previousSibling");
},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c);
},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c);
},siblings:function(a){return f.sibling(a.parentNode.firstChild,a);
},children:function(a){return f.sibling(a.firstChild);
},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes);
}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c),g=S.call(arguments);
O.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!U[a]?f.unique(e):e,(this.length>1||Q.test(d))&&P.test(a)&&(e=e.reverse());
return this.pushStack(e,a,g.join(","));
};
}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");
return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b);
},dir:function(a,c,d){var e=[],g=a[c];
while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d))){g.nodeType===1&&e.push(g),g=g[c];
}return e;
},nth:function(a,b,c,d){b=b||1;
var e=0;
for(;
a;
a=a[c]){if(a.nodeType===1&&++e===b){break;
}}return a;
},sibling:function(a,b){var c=[];
for(;
a;
a=a.nextSibling){a.nodeType===1&&a!==b&&c.push(a);
}return c;
}});
var X=/ jQuery\d+="(?:\d+|null)"/g,Y=/^\s+/,Z=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,$=/<([\w:]+)/,_=/<tbody/i,ba=/<|&#?\w+;/,bb=/<(?:script|object|embed|option|style)/i,bc=/checked\s*(?:[^=]|=\s*.checked.)/i,bd=/\/(java|ecma)script/i,be=/^\s*<!(?:\[CDATA\[|\-\-)/,bf={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};
bf.optgroup=bf.option,bf.tbody=bf.tfoot=bf.colgroup=bf.caption=bf.thead,bf.th=bf.td,f.support.htmlSerialize||(bf._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a)){return this.each(function(b){var c=f(this);
c.text(a.call(this,b,c.text()));
});
}if(typeof a!="object"&&a!==b){return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));
}return f.text(this);
},wrapAll:function(a){if(f.isFunction(a)){return this.each(function(b){f(this).wrapAll(a.call(this,b));
});
}if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);
this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;
while(a.firstChild&&a.firstChild.nodeType===1){a=a.firstChild;
}return a;
}).append(this);
}return this;
},wrapInner:function(a){if(f.isFunction(a)){return this.each(function(b){f(this).wrapInner(a.call(this,b));
});
}return this.each(function(){var b=f(this),c=b.contents();
c.length?c.wrapAll(a):b.append(a);
});
},wrap:function(a){return this.each(function(){f(this).wrapAll(a);
});
},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes);
}).end();
},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a);
});
},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild);
});
},before:function(){if(this[0]&&this[0].parentNode){return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this);
});
}if(arguments.length){var a=f(arguments[0]);
a.push.apply(a,this.toArray());
return this.pushStack(a,"before",arguments);
}},after:function(){if(this[0]&&this[0].parentNode){return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling);
});
}if(arguments.length){var a=this.pushStack(this,"after",arguments);
a.push.apply(a,f(arguments[0]).toArray());
return a;
}},remove:function(a,b){for(var c=0,d;
(d=this[c])!=null;
c++){if(!a||f.filter(a,[d]).length){!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);
}}return this;
},empty:function(){for(var a=0,b;
(b=this[a])!=null;
a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));
while(b.firstChild){b.removeChild(b.firstChild);
}}return this;
},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;
return this.map(function(){return f.clone(this,a,b);
});
},html:function(a){if(a===b){return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(X,""):null;
}if(typeof a=="string"&&!bb.test(a)&&(f.support.leadingWhitespace||!Y.test(a))&&!bf[($.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Z,"<$1></$2>");
try{for(var c=0,d=this.length;
c<d;
c++){this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a);
}}catch(e){this.empty().append(a);
}}else{f.isFunction(a)?this.each(function(b){var c=f(this);
c.html(a.call(this,b,c.html()));
}):this.empty().append(a);
}return this;
},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a)){return this.each(function(b){var c=f(this),d=c.html();
c.replaceWith(a.call(this,b,d));
});
}typeof a!="string"&&(a=f(a).detach());
return this.each(function(){var b=this.nextSibling,c=this.parentNode;
f(this).remove(),b?f(b).before(a):f(c).append(a);
});
}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this;
},detach:function(a){return this.remove(a,!0);
},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];
if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bc.test(j)){return this.each(function(){f(this).domManip(a,c,d,!0);
});
}if(f.isFunction(j)){return this.each(function(e){var g=f(this);
a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d);
});
}if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;
if(g){c=c&&f.nodeName(g,"tr");
for(var l=0,m=this.length,n=m-1;
l<m;
l++){d.call(c?bg(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h);
}}k.length&&f.each(k,bm);
}return this;
}}),f.buildFragment=function(a,b,d){var e,g,h,i;
b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof a[0]=="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!bb.test(a[0])&&(f.support.checkClone||!bc.test(a[0]))&&(g=!0,h=f.fragments[a[0]],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[a[0]]=h?e:1);
return{fragment:e,cacheable:g};
},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;
if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);
return this;
}for(var h=0,i=e.length;
h<i;
h++){var j=(h>0?this.clone(!0):this).get();
f(e[h])[b](j),d=d.concat(j);
}return this.pushStack(d,a,e.selector);
};
}),f.extend({clone:function(a,b,c){var d=a.cloneNode(!0),e,g,h;
if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bi(a,d),e=bj(a),g=bj(d);
for(h=0;
e[h];
++h){bi(e[h],g[h]);
}}if(b){bh(a,d);
if(c){e=bj(a),g=bj(d);
for(h=0;
e[h];
++h){bh(e[h],g[h]);
}}}e=g=null;
return d;
},clean:function(a,b,d,e){var g;
b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);
var h=[],i;
for(var j=0,k;
(k=a[j])!=null;
j++){typeof k=="number"&&(k+="");
if(!k){continue;
}if(typeof k=="string"){if(!ba.test(k)){k=b.createTextNode(k);
}else{k=k.replace(Z,"<$1></$2>");
var l=($.exec(k)||["",""])[1].toLowerCase(),m=bf[l]||bf._default,n=m[0],o=b.createElement("div");
o.innerHTML=m[1]+k+m[2];
while(n--){o=o.lastChild;
}if(!f.support.tbody){var p=_.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];
for(i=q.length-1;
i>=0;
--i){f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i]);
}}!f.support.leadingWhitespace&&Y.test(k)&&o.insertBefore(b.createTextNode(Y.exec(k)[0]),o.firstChild),k=o.childNodes;
}}var r;
if(!f.support.appendChecked){if(k[0]&&typeof(r=k.length)=="number"){for(i=0;
i<r;
i++){bl(k[i]);
}}else{bl(k);
}}k.nodeType?h.push(k):h=f.merge(h,k);
}if(d){g=function(a){return !a.type||bd.test(a.type);
};
for(j=0;
h[j];
j++){if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript")){e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);
}else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);
h.splice.apply(h,[j+1,0].concat(s));
}d.appendChild(h[j]);
}}}return h;
},cleanData:function(a){var b,c,d=f.cache,e=f.expando,g=f.event.special,h=f.support.deleteExpando;
for(var i=0,j;
(j=a[i])!=null;
i++){if(j.nodeName&&f.noData[j.nodeName.toLowerCase()]){continue;
}c=j[f.expando];
if(c){b=d[c]&&d[c][e];
if(b&&b.events){for(var k in b.events){g[k]?f.event.remove(j,k):f.removeEvent(j,k,b.handle);
}b.handle&&(b.handle.elem=null);
}h?delete j[f.expando]:j.removeAttribute&&j.removeAttribute(f.expando),delete d[c];
}}}});
var bn=/alpha\([^)]*\)/i,bo=/opacity=([^)]*)/,bp=/([A-Z]|^ms)/g,bq=/^-?\d+(?:px)?$/i,br=/^-?\d/,bs=/^[+\-]=/,bt=/[^+\-\.\de]+/g,bu={position:"absolute",visibility:"hidden",display:"block"},bv=["Left","Right"],bw=["Top","Bottom"],bx,by,bz;
f.fn.css=function(a,c){if(arguments.length===2&&c===b){return this;
}return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c);
});
},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bx(a,"opacity","opacity");
return c===""?"1":c;
}return a.style.opacity;
}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];
c=f.cssProps[i]||i;
if(d===b){if(k&&"get" in k&&(g=k.get(a,!1,e))!==b){return g;
}return j[c];
}h=typeof d;
if(h==="number"&&isNaN(d)||d==null){return;
}h==="string"&&bs.test(d)&&(d=+d.replace(bt,"")+parseFloat(f.css(a,c)),h="number"),h==="number"&&!f.cssNumber[i]&&(d+="px");
if(!k||!("set" in k)||(d=k.set(a,d))!==b){try{j[c]=d;
}catch(l){}}}},css:function(a,c,d){var e,g;
c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");
if(g&&"get" in g&&(e=g.get(a,!0,d))!==b){return e;
}if(bx){return bx(a,c);
}},swap:function(a,b,c){var d={};
for(var e in b){d[e]=a.style[e],a.style[e]=b[e];
}c.call(a);
for(e in b){a.style[e]=d[e];
}}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;
if(c){if(a.offsetWidth!==0){return bA(a,b,d);
}f.swap(a,bu,function(){e=bA(a,b,d);
});
return e;
}},set:function(a,b){if(!bq.test(b)){return b;
}b=parseFloat(b);
if(b>=0){return b+"px";
}}};
}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bo.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":"";
},set:function(a,b){var c=a.style,d=a.currentStyle;
c.zoom=1;
var e=f.isNaN(b)?"":"alpha(opacity="+b*100+")",g=d&&d.filter||c.filter||"";
c.filter=bn.test(g)?g.replace(bn,e):g+" "+e;
}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;
f.swap(a,{display:"inline-block"},function(){b?c=bx(a,"margin-right","marginRight"):c=a.style.marginRight;
});
return c;
}});
}),c.defaultView&&c.defaultView.getComputedStyle&&(by=function(a,c){var d,e,g;
c=c.replace(bp,"-$1").toLowerCase();
if(!(e=a.ownerDocument.defaultView)){return b;
}if(g=e.getComputedStyle(a,null)){d=g.getPropertyValue(c),d===""&&!f.contains(a.ownerDocument.documentElement,a)&&(d=f.style(a,c));
}return d;
}),c.documentElement.currentStyle&&(bz=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;
!bq.test(d)&&br.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));
return d===""?"auto":d;
}),bx=by||bz,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;
return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style.display||f.css(a,"display"))==="none";
},f.expr.filters.visible=function(a){return !f.expr.filters.hidden(a);
});
var bB=/%20/g,bC=/\[\]$/,bD=/\r?\n/g,bE=/#.*$/,bF=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bG=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bH=/^(?:about|app|app\-storage|.+\-extension|file|widget):$/,bI=/^(?:GET|HEAD)$/,bJ=/^\/\//,bK=/\?/,bL=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bM=/^(?:select|textarea)/i,bN=/\s+/,bO=/([?&])_=[^&]*/,bP=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bQ=f.fn.load,bR={},bS={},bT,bU;
try{bT=e.href;
}catch(bV){bT=c.createElement("a"),bT.href="",bT=bT.href;
}bU=bP.exec(bT.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bQ){return bQ.apply(this,arguments);
}if(!this.length){return this;
}var e=a.indexOf(" ");
if(e>=0){var g=a.slice(e,a.length);
a=a.slice(0,e);
}var h="GET";
c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));
var i=this;
f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a;
}),i.html(g?f("<div>").append(c.replace(bL,"")).find(g):c)),d&&i.each(d,[c,b,a]);
}});
return this;
},serialize:function(){return f.param(this.serializeArray());
},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this;
}).filter(function(){return this.name&&!this.disabled&&(this.checked||bM.test(this.nodeName)||bG.test(this.type));
}).map(function(a,b){var c=f(this).val();
return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bD,"\r\n")};
}):{name:b.name,value:c.replace(bD,"\r\n")};
}).get();
}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.bind(b,a);
};
}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);
return f.ajax({type:c,url:a,data:d,success:e,dataType:g});
};
}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script");
},getJSON:function(a,b,c){return f.get(a,b,c,"json");
},ajaxSetup:function(a,b){b?f.extend(!0,a,f.ajaxSettings,b):(b=a,a=f.extend(!0,f.ajaxSettings,b));
for(var c in {context:1,url:1}){c in b?a[c]=b[c]:c in f.ajaxSettings&&(a[c]=f.ajaxSettings[c]);
}return a;
},ajaxSettings:{url:bT,isLocal:bH.test(bU[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML}},ajaxPrefilter:bW(bR),ajaxTransport:bW(bS),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a?4:0;
var o,r,u,w=l?bZ(d,v,l):b,x,y;
if(a>=200&&a<300||a===304){if(d.ifModified){if(x=v.getResponseHeader("Last-Modified")){f.lastModified[k]=x;
}if(y=v.getResponseHeader("Etag")){f.etag[k]=y;
}}if(a===304){c="notmodified",o=!0;
}else{try{r=b$(d,w),c="success",o=!0;
}catch(z){c="parsererror",u=z;
}}}else{u=c;
if(!c||a){c="error",a<0&&(a=0);
}}v.status=a,v.statusText=c,o?h.resolveWith(e,[r,c,v]):h.rejectWith(e,[v,c,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.resolveWith(e,[v,c]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"));
}}typeof a=="object"&&(c=a,a=b),c=c||{};
var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f._Deferred(),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();
a=m[c]=m[c]||a,l[a]=b;
}return this;
},getAllResponseHeaders:function(){return s===2?n:null;
},getResponseHeader:function(a){var c;
if(s===2){if(!o){o={};
while(c=bF.exec(n)){o[c[1].toLowerCase()]=c[2];
}}c=o[a.toLowerCase()];
}return c===b?null:c;
},overrideMimeType:function(a){s||(d.mimeType=a);
return this;
},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);
return this;
}};
h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.done,v.statusCode=function(a){if(a){var b;
if(s<2){for(b in a){j[b]=[j[b],a[b]];
}}else{b=a[v.status],v.then(b,b);
}}return this;
},d.url=((a||d.url)+"").replace(bE,"").replace(bJ,bU[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bN),d.crossDomain==null&&(r=bP.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bU[1]&&r[2]==bU[2]&&(r[3]||(r[1]==="http:"?80:443))==(bU[3]||(bU[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bX(bR,d,c,v);
if(s===2){return !1;
}t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bI.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");
if(!d.hasContent){d.data&&(d.url+=(bK.test(d.url)?"&":"?")+d.data),k=d.url;
if(d.cache===!1){var x=f.now(),y=d.url.replace(bO,"$1_="+x);
d.url=y+(y===d.url?(bK.test(d.url)?"&":"?")+"_="+x:"");
}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", */*; q=0.01":""):d.accepts["*"]);
for(u in d.headers){v.setRequestHeader(u,d.headers[u]);
}if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();
return !1;
}for(u in {success:1,error:1,complete:1}){v[u](d[u]);
}p=bX(bS,d,c,v);
if(!p){w(-1,"No Transport");
}else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout");
},d.timeout));
try{s=1,p.send(l,w);
}catch(z){status<2?w(-1,z):f.error(z);
}}return v;
},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b);
};
c===b&&(c=f.ajaxSettings.traditional);
if(f.isArray(a)||a.jquery&&!f.isPlainObject(a)){f.each(a,function(){e(this.name,this.value);
});
}else{for(var g in a){bY(g,a[g],c,e);
}}return d.join("&").replace(bB,"+");
}}),f.extend({active:0,lastModified:{},etag:{}});
var b_=f.now(),ca=/(\=)\?(&|$)|\?\?/i;
f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+b_++;
}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";
if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ca.test(b.url)||e&&ca.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";
b.jsonp!==!1&&(j=j.replace(ca,l),b.url===j&&(e&&(k=k.replace(ca,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a];
},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0]);
}),b.converters["script json"]=function(){g||f.error(h+" was not called");
return g[0];
},b.dataTypes[0]="json";
return"script";
}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);
return a;
}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1);
}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;
return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState)){d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success");
}},e.insertBefore(d,e.firstChild);
},abort:function(){d&&d.onload(0,1);
}};
}});
var cb=a.ActiveXObject?function(){for(var a in cd){cd[a](0,1);
}}:!1,cc=0,cd;
f.ajaxSettings.xhr=a.ActiveXObject?function(){return !this.isLocal&&ce()||cf();
}:ce,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials" in a});
}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;
return{send:function(e,g){var h=c.xhr(),i,j;
c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);
if(c.xhrFields){for(j in c.xhrFields){h[j]=c.xhrFields[j];
}}c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");
try{for(j in e){h.setRequestHeader(j,e[j]);
}}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;
try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cb&&delete cd[i]);
if(e){h.readyState!==4&&h.abort();
}else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;
try{k=h.statusText;
}catch(o){k="";
}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204);
}}}catch(p){e||g(-1,p);
}m&&g(j,k,m,l);
},!c.async||h.readyState===4?d():(i=++cc,cb&&(cd||(cd={},f(a).unload(cb)),cd[i]=d),h.onreadystatechange=d);
},abort:function(){d&&d(0,1);
}};
}});
var cg={},ch,ci,cj=/^(?:toggle|show|hide)$/,ck=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cl,cm=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cn,co=a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame;
f.fn.extend({show:function(a,b,c){var d,e;
if(a||a===0){return this.animate(cr("show",3),a,b,c);
}for(var g=0,h=this.length;
g<h;
g++){d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cs(d.nodeName)));
}for(g=0;
g<h;
g++){d=this[g];
if(d.style){e=d.style.display;
if(e===""||e==="none"){d.style.display=f._data(d,"olddisplay")||"";
}}}return this;
},hide:function(a,b,c){if(a||a===0){return this.animate(cr("hide",3),a,b,c);
}for(var d=0,e=this.length;
d<e;
d++){if(this[d].style){var g=f.css(this[d],"display");
g!=="none"&&!f._data(this[d],"olddisplay")&&f._data(this[d],"olddisplay",g);
}}for(d=0;
d<e;
d++){this[d].style&&(this[d].style.display="none");
}return this;
},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";
f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");
f(this)[b?"show":"hide"]();
}):this.animate(cr("toggle",3),a,b,c);
return this;
},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d);
},animate:function(a,b,c,d){var e=f.speed(b,c,d);
if(f.isEmptyObject(a)){return this.each(e.complete,[!1]);
}a=f.extend({},a);
return this[e.queue===!1?"each":"queue"](function(){e.queue===!1&&f._mark(this);
var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;
b.animatedProperties={};
for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";
if(h==="hide"&&d||h==="show"&&!d){return b.complete.call(this);
}c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(f.support.inlineBlockNeedsLayout?(j=cs(this.nodeName),j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)):this.style.display="inline-block"));
}b.overflow!=null&&(this.style.overflow="hidden");
for(i in a){k=new f.fx(this,b,i),h=a[i],cj.test(h)?k[h==="toggle"?d?"show":"hide":h]():(l=ck.exec(h),m=k.cur(),l?(n=parseFloat(l[2]),o=l[3]||(f.cssNumber[i]?"":"px"),o!=="px"&&(f.style(this,i,(n||1)+o),m=(n||1)/k.cur()*m,f.style(this,i,m+o)),l[1]&&(n=(l[1]==="-="?-1:1)*n+m),k.custom(m,n,o)):k.custom(m,h,""));
}return !0;
});
},stop:function(a,b){a&&this.queue([]),this.each(function(){var a=f.timers,c=a.length;
b||f._unmark(!0,this);
while(c--){a[c].elem===this&&(b&&a[c](!0),a.splice(c,1));
}}),b||this.dequeue();
return this;
}}),f.each({slideDown:cr("show",1),slideUp:cr("hide",1),slideToggle:cr("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d);
};
}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};
d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default,d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue!==!1?f.dequeue(this):a!==!1&&f._unmark(this);
};
return d;
},easing:{linear:function(a,b,c,d){return c+d*a;
},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+0.5)*d+c;
}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{};
}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this);
},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null)){return this.elem[this.prop];
}var a,b=f.css(this.elem,this.prop);
return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a;
},custom:function(a,b,c){function h(a){return d.step(a);
}var d=this,e=f.fx,g;
this.startTime=cn||cp(),this.start=a,this.end=b,this.unit=c||this.unit||(f.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,h.elem=this.elem,h()&&f.timers.push(h)&&!cl&&(co?(cl=!0,g=function(){cl&&(co(g),e.tick());
},co(g)):cl=setInterval(e.tick,e.interval));
},show:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show();
},hide:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0);
},step:function(a){var b=cn||cp(),c=!0,d=this.elem,e=this.options,g,h;
if(a||b>=e.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),e.animatedProperties[this.prop]=!0;
for(g in e.animatedProperties){e.animatedProperties[g]!==!0&&(c=!1);
}if(c){e.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){d.style["overflow"+b]=e.overflow[a];
}),e.hide&&f(d).hide();
if(e.hide||e.show){for(var i in e.animatedProperties){f.style(d,i,e.orig[i]);
}}e.complete.call(d);
}return !1;
}e.duration==Infinity?this.now=b:(h=b-this.startTime,this.state=h/e.duration,this.pos=f.easing[e.animatedProperties[this.prop]](this.state,h,0,1,e.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();
return !0;
}},f.extend(f.fx,{tick:function(){for(var a=f.timers,b=0;
b<a.length;
++b){a[b]()||a.splice(b--,1);
}a.length||f.fx.stop();
},interval:13,stop:function(){clearInterval(cl),cl=null;
},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now);
},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now;
}}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem;
}).length;
});
var ct=/^t(?:able|d|h)$/i,cu=/^(?:body|html)$/i;
"getBoundingClientRect" in c.documentElement?f.fn.offset=function(a){var b=this[0],c;
if(a){return this.each(function(b){f.offset.setOffset(this,a,b);
});
}if(!b||!b.ownerDocument){return null;
}if(b===b.ownerDocument.body){return f.offset.bodyOffset(b);
}try{c=b.getBoundingClientRect();
}catch(d){}var e=b.ownerDocument,g=e.documentElement;
if(!c||!f.contains(g,b)){return c?{top:c.top,left:c.left}:{top:0,left:0};
}var h=e.body,i=cv(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;
return{top:n,left:o};
}:f.fn.offset=function(a){var b=this[0];
if(a){return this.each(function(b){f.offset.setOffset(this,a,b);
});
}if(!b||!b.ownerDocument){return null;
}if(b===b.ownerDocument.body){return f.offset.bodyOffset(b);
}f.offset.initialize();
var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;
while((b=b.parentNode)&&b!==i&&b!==h){if(f.offset.supportsFixedPosition&&k.position==="fixed"){break;
}c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.offset.doesNotAddBorder&&(!f.offset.doesAddBorderForTableAndCells||!ct.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c;
}if(k.position==="relative"||k.position==="static"){l+=i.offsetTop,m+=i.offsetLeft;
}f.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));
return{top:l,left:m};
},f.offset={initialize:function(){var a=c.body,b=c.createElement("div"),d,e,g,h,i=parseFloat(f.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
f.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),d=b.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,this.doesNotAddBorder=e.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,e.style.position="fixed",e.style.top="20px",this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),f.offset.initialize=f.noop;
},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;
f.offset.initialize(),f.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);
return{top:b,left:c};
},setOffset:function(a,b,c){var d=f.css(a,"position");
d==="static"&&(a.style.position="relative");
var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;
j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using" in b?b.using.call(a,k):e.css(k);
}},f.fn.extend({position:function(){if(!this[0]){return null;
}var a=this[0],b=this.offsetParent(),c=this.offset(),d=cu.test(b[0].nodeName)?{top:0,left:0}:b.offset();
c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;
return{top:c.top-d.top,left:c.left-d.left};
},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;
while(a&&!cu.test(a.nodeName)&&f.css(a,"position")==="static"){a=a.offsetParent;
}return a;
});
}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;
f.fn[d]=function(c){var e,g;
if(c===b){e=this[0];
if(!e){return null;
}g=cv(e);
return g?"pageXOffset" in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d];
}return this.each(function(){g=cv(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c;
});
};
}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();
f.fn["inner"+c]=function(){var a=this[0];
return a&&a.style?parseFloat(f.css(a,d,"padding")):null;
},f.fn["outer"+c]=function(a){var b=this[0];
return b&&b.style?parseFloat(f.css(b,d,a?"margin":"border")):null;
},f.fn[d]=function(a){var e=this[0];
if(!e){return a==null?null:this;
}if(f.isFunction(a)){return this.each(function(b){var c=f(this);
c[d](a.call(this,b,c[d]()));
});
}if(f.isWindow(e)){var g=e.document.documentElement["client"+c];
return e.document.compatMode==="CSS1Compat"&&g||e.document.body["client"+c]||g;
}if(e.nodeType===9){return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);
}if(a===b){var h=f.css(e,d),i=parseFloat(h);
return f.isNaN(i)?h:i;
}return this.css(d,typeof a=="string"?a:a+"px");
};
}),a.jQuery=a.$=f;
})(window);
/*
 * jQuery UI 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a,b){var d=a.nodeName.toLowerCase();
if("area"===d){b=a.parentNode;
d=b.name;
if(!a.href||!d||b.nodeName.toLowerCase()!=="map"){return false;
}a=c("img[usemap=#"+d+"]")[0];
return !!a&&l(a);
}return(/input|select|textarea|button|object/.test(d)?!a.disabled:"a"==d?a.href||b:b)&&l(a);
}function l(a){return !c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this);
}).length;
}c.ui=c.ui||{};
if(!c.ui.version){c.extend(c.ui,{version:"1.8.13",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});
c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;
setTimeout(function(){c(d).focus();
b&&b.call(d);
},a);
}):this._focus.apply(this,arguments);
},scrollParent:function(){var a;
a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1));
}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1));
}).eq(0);
return/fixed/.test(this.css("position"))||!a.length?c(document):a;
},zIndex:function(a){if(a!==j){return this.css("zIndex",a);
}if(this.length){a=c(this[0]);
for(var b;
a.length&&a[0]!==document;
){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);
if(!isNaN(b)&&b!==0){return b;
}}a=a.parent();
}}return 0;
},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault();
});
},enableSelection:function(){return this.unbind(".ui-disableSelection");
}});
c.each(["Width","Height"],function(a,b){function d(f,g,m,n){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;
if(m){g-=parseFloat(c.curCSS(f,"border"+this+"Width",true))||0;
}if(n){g-=parseFloat(c.curCSS(f,"margin"+this,true))||0;
}});
return g;
}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};
c.fn["inner"+b]=function(f){if(f===j){return i["inner"+b].call(this);
}return this.each(function(){c(this).css(h,d(this,f)+"px");
});
};
c.fn["outer"+b]=function(f,g){if(typeof f!=="number"){return i["outer"+b].call(this,f);
}return this.each(function(){c(this).css(h,d(this,f,true,g)+"px");
});
};
});
c.extend(c.expr[":"],{data:function(a,b,d){return !!c.data(a,d[3]);
},focusable:function(a){return k(a,!isNaN(c.attr(a,"tabindex")));
},tabbable:function(a){var b=c.attr(a,"tabindex"),d=isNaN(b);
return(d||b>=0)&&k(a,!d);
}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));
c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});
c.support.minHeight=b.offsetHeight===100;
c.support.selectstart="onselectstart" in b;
a.removeChild(b).style.display="none";
});
c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;
for(var e in d){a.plugins[e]=a.plugins[e]||[];
a.plugins[e].push([b,d[e]]);
}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode){for(var e=0;
e<b.length;
e++){a.options[b[e][0]]&&b[e][1].apply(a.element,d);
}}}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b);
},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden"){return false;
}b=b&&b==="left"?"scrollLeft":"scrollTop";
var d=false;
if(a[b]>0){return true;
}a[b]=1;
d=a[b]>0;
a[b]=0;
return d;
},isOverAxis:function(a,b,d){return a>b&&a<b+d;
},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i);
}});
}})(jQuery);
/*
 * jQuery UI Widget 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;
b.cleanData=function(a){for(var c=0,d;
(d=a[c])!=null;
c++){b(d).triggerHandler("remove");
}k(a);
};
}else{var l=b.fn.remove;
b.fn.remove=function(a,c){return this.each(function(){if(!c){if(!a||b.filter(a,[this]).length){b("*",this).add([this]).each(function(){b(this).triggerHandler("remove");
});
}}return l.call(b(this),a,c);
});
};
}b.widget=function(a,c,d){var e=a.split(".")[0],f;
a=a.split(".")[1];
f=e+"-"+a;
if(!d){d=c;
c=b.Widget;
}b.expr[":"][f]=function(h){return !!b.data(h,a);
};
b[e]=b[e]||{};
b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g);
};
c=new c;
c.options=b.extend(true,{},c.options);
b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);
b.widget.bridge(a,b[e][a]);
};
b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;
d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;
if(e&&d.charAt(0)==="_"){return h;
}e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;
if(i!==g&&i!==j){h=i;
return false;
}}):this.each(function(){var g=b.data(this,a);
g?g.option(d||{})._init():b.data(this,a,new c(d,this));
});
return h;
};
};
b.Widget=function(a,c){arguments.length&&this._createWidget(a,c);
};
b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);
this.element=b(c);
this.options=b.extend(true,{},this.options,this._getCreateOptions(),a);
var d=this;
this.element.bind("remove."+this.widgetName,function(){d.destroy();
});
this._create();
this._trigger("create");
this._init();
},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName];
},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);
this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled");
},widget:function(){return this.element;
},option:function(a,c){var d=a;
if(arguments.length===0){return b.extend({},this.options);
}if(typeof a==="string"){if(c===j){return this.options[a];
}d={};
d[a]=c;
}this._setOptions(d);
return this;
},_setOptions:function(a){var c=this;
b.each(a,function(d,e){c._setOption(d,e);
});
return this;
},_setOption:function(a,c){this.options[a]=c;
if(a==="disabled"){this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);
}return this;
},enable:function(){return this._setOption("disabled",false);
},disable:function(){return this._setOption("disabled",true);
},_trigger:function(a,c,d){var e=this.options[a];
c=b.Event(c);
c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();
d=d||{};
if(c.originalEvent){a=b.event.props.length;
for(var f;
a;
){f=b.event.props[--a];
c[f]=c.originalEvent[f];
}}this.element.trigger(c,d);
return !(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented());
}};
})(jQuery);
/*
 * jQuery UI Mouse 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b){var d=false;
b(document).mousedown(function(){d=false;
});
b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;
this.element.bind("mousedown."+this.widgetName,function(c){return a._mouseDown(c);
}).bind("click."+this.widgetName,function(c){if(true===b.data(c.target,a.widgetName+".preventClickEvent")){b.removeData(c.target,a.widgetName+".preventClickEvent");
c.stopImmediatePropagation();
return false;
}});
this.started=false;
},_mouseDestroy:function(){this.element.unbind("."+this.widgetName);
},_mouseDown:function(a){if(!d){this._mouseStarted&&this._mouseUp(a);
this._mouseDownEvent=a;
var c=this,f=a.which==1,g=typeof this.options.cancel=="string"?b(a.target).parents().add(a.target).filter(this.options.cancel).length:false;
if(!f||g||!this._mouseCapture(a)){return true;
}this.mouseDelayMet=!this.options.delay;
if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){c.mouseDelayMet=true;
},this.options.delay);
}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=this._mouseStart(a)!==false;
if(!this._mouseStarted){a.preventDefault();
return true;
}}true===b.data(a.target,this.widgetName+".preventClickEvent")&&b.removeData(a.target,this.widgetName+".preventClickEvent");
this._mouseMoveDelegate=function(e){return c._mouseMove(e);
};
this._mouseUpDelegate=function(e){return c._mouseUp(e);
};
b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);
a.preventDefault();
return d=true;
}},_mouseMove:function(a){if(b.browser.msie&&!(document.documentMode>=9)&&!a.button){return this._mouseUp(a);
}if(this._mouseStarted){this._mouseDrag(a);
return a.preventDefault();
}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);
}return !this._mouseStarted;
},_mouseUp:function(a){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
if(this._mouseStarted){this._mouseStarted=false;
a.target==this._mouseDownEvent.target&&b.data(a.target,this.widgetName+".preventClickEvent",true);
this._mouseStop(a);
}return false;
},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance;
},_mouseDelayMet:function(){return this.mouseDelayMet;
},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true;
}});
})(jQuery);
(function(c){c.ui=c.ui||{};
var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;
c.fn.position=function(b){if(!b||!b.of){return t.apply(this,arguments);
}b=c.extend({},b);
var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;
if(d.nodeType===9){h=a.width();
k=a.height();
j={top:0,left:0};
}else{if(d.setTimeout){h=a.width();
k=a.height();
j={top:a.scrollTop(),left:a.scrollLeft()};
}else{if(d.preventDefault){b.at="left top";
h=k=0;
j={top:b.of.pageY,left:b.of.pageX};
}else{h=a.outerWidth();
k=a.outerHeight();
j=a.offset();
}}}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");
if(f.length===1){f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];
}f[0]=n.test(f[0])?f[0]:"center";
f[1]=o.test(f[1])?f[1]:"center";
b[this]=f;
});
if(g.length===1){g[1]=g[0];
}e[0]=parseInt(e[0],10)||0;
if(e.length===1){e[1]=e[0];
}e[1]=parseInt(e[1],10)||0;
if(b.at[0]==="right"){j.left+=h;
}else{if(b.at[0]==="center"){j.left+=h/2;
}}if(b.at[1]==="bottom"){j.top+=k;
}else{if(b.at[1]==="center"){j.top+=k/2;
}}j.left+=e[0];
j.top+=e[1];
return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+(parseInt(c.curCSS(this,"marginRight",true))||0),w=m+q+(parseInt(c.curCSS(this,"marginBottom",true))||0),i=c.extend({},j),r;
if(b.my[0]==="right"){i.left-=l;
}else{if(b.my[0]==="center"){i.left-=l/2;
}}if(b.my[1]==="bottom"){i.top-=m;
}else{if(b.my[1]==="center"){i.top-=m/2;
}}i.left=Math.round(i.left);
i.top=Math.round(i.top);
r={left:i.left-p,top:i.top-q};
c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at});
});
c.fn.bgiframe&&f.bgiframe();
f.offset(c.extend(i,{using:b.using}));
});
};
c.ui.position={fit:{left:function(b,a){var d=c(window);
d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();
b.left=d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left);
},top:function(b,a){var d=c(window);
d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();
b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top);
}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);
d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();
var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];
b.left+=a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0;
}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);
d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();
var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];
b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0;
}}}};
if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position"))){b.style.position="relative";
}var d=c(b),g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;
g={top:a.top-g.top+e,left:a.left-g.left+h};
"using" in a?a.using.call(b,g):d.css(g);
};
c.fn.offset=function(b){var a=this[0];
if(!a||!a.ownerDocument){return null;
}if(b){return this.each(function(){c.offset.setOffset(this,b);
});
}return u.call(this);
};
}})(jQuery);
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))){this.element[0].style.position="relative";
}this.options.addClasses&&this.element.addClass("ui-draggable");
this.options.disabled&&this.element.addClass("ui-draggable-disabled");
this._mouseInit();
},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
this._mouseDestroy();
return this;
}},_mouseCapture:function(a){var b=this.options;
if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle")){return false;
}this.handle=this._getHandle(a);
if(!this.handle){return false;
}d(b.iframeFix===true?"iframe":b.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(d(this).offset()).appendTo("body");
});
return true;
},_mouseStart:function(a){var b=this.options;
this.helper=this._createHelper(a);
this._cacheHelperProportions();
if(d.ui.ddmanager){d.ui.ddmanager.current=this;
}this._cacheMargins();
this.cssPosition=this.helper.css("position");
this.scrollParent=this.helper.scrollParent();
this.offset=this.positionAbs=this.element.offset();
this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};
d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this.position=this._generatePosition(a);
this.originalPageX=a.pageX;
this.originalPageY=a.pageY;
b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);
b.containment&&this._setContainment();
if(this._trigger("start",a)===false){this._clear();
return false;
}this._cacheHelperProportions();
d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);
this.helper.addClass("ui-draggable-dragging");
this._mouseDrag(a,true);
return true;
},_mouseDrag:function(a,b){this.position=this._generatePosition(a);
this.positionAbs=this._convertPositionTo("absolute");
if(!b){b=this._uiHash();
if(this._trigger("drag",a,b)===false){this._mouseUp({});
return false;
}this.position=b.position;
}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px";
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px";
}d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);
return false;
},_mouseStop:function(a){var b=false;
if(d.ui.ddmanager&&!this.options.dropBehaviour){b=d.ui.ddmanager.drop(this,a);
}if(this.dropped){b=this.dropped;
this.dropped=false;
}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original"){return false;
}if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,b)){var c=this;
d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){c._trigger("stop",a)!==false&&c._clear();
});
}else{this._trigger("stop",a)!==false&&this._clear();
}return false;
},_mouseUp:function(a){this.options.iframeFix===true&&d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this);
});
return d.ui.mouse.prototype._mouseUp.call(this,a);
},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();
return this;
},_getHandle:function(a){var b=!this.options.handle||!d(this.options.handle,this.element).length?true:false;
d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==a.target){b=true;
}});
return b;
},_createHelper:function(a){var b=this.options;
a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone().removeAttr("id"):this.element;
a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);
a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");
return a;
},_adjustOffsetFromHelper:function(a){if(typeof a=="string"){a=a.split(" ");
}if(d.isArray(a)){a={left:+a[0],top:+a[1]||0};
}if("left" in a){this.offset.click.left=a.left+this.margins.left;
}if("right" in a){this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;
}if("top" in a){this.offset.click.top=a.top+this.margins.top;
}if("bottom" in a){this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top;
}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var a=this.offsetParent.offset();
if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();
a.top+=this.scrollParent.scrollTop();
}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie){a={top:0,left:0};
}return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();
return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()};
}else{return{top:0,left:0};
}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0};
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};
},_setContainment:function(){var a=this.options;
if(a.containment=="parent"){a.containment=this.helper[0].parentNode;
}if(a.containment=="document"||a.containment=="window"){this.containment=[(a.containment=="document"?0:d(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(a.containment=="document"?0:d(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
}if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){a=d(a.containment);
var b=a[0];
if(b){a.offset();
var c=d(b).css("overflow")!="hidden";
this.containment=[(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0),(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0),(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];
this.relative_container=a;
}}else{if(a.containment.constructor==Array){this.containment=a.containment;
}}},_convertPositionTo:function(a,b){if(!b){b=this.position;
}a=a=="absolute"?1:-1;
var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);
return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())*a)};
},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,h=a.pageY;
if(this.originalPosition){var g;
if(this.containment){if(this.relative_container){g=this.relative_container.offset();
g=[this.containment[0]+g.left,this.containment[1]+g.top,this.containment[2]+g.left,this.containment[3]+g.top];
}else{g=this.containment;
}if(a.pageX-this.offset.click.left<g[0]){e=g[0]+this.offset.click.left;
}if(a.pageY-this.offset.click.top<g[1]){h=g[1]+this.offset.click.top;
}if(a.pageX-this.offset.click.left>g[2]){e=g[2]+this.offset.click.left;
}if(a.pageY-this.offset.click.top>g[3]){h=g[3]+this.offset.click.top;
}}if(b.grid){h=this.originalPageY+Math.round((h-this.originalPageY)/b.grid[1])*b.grid[1];
h=g?!(h-this.offset.click.top<g[1]||h-this.offset.click.top>g[3])?h:!(h-this.offset.click.top<g[1])?h-b.grid[1]:h+b.grid[1]:h;
e=this.originalPageX+Math.round((e-this.originalPageX)/b.grid[0])*b.grid[0];
e=g?!(e-this.offset.click.left<g[0]||e-this.offset.click.left>g[2])?e:!(e-this.offset.click.left<g[0])?e-b.grid[0]:e+b.grid[0]:e;
}}return{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())};
},_clear:function(){this.helper.removeClass("ui-draggable-dragging");
this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();
this.helper=null;
this.cancelHelperRemoval=false;
},_trigger:function(a,b,c){c=c||this._uiHash();
d.ui.plugin.call(this,a,[b,c]);
if(a=="drag"){this.positionAbs=this._convertPositionTo("absolute");
}return d.Widget.prototype._trigger.call(this,a,b,c);
},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs};
}});
d.extend(d.ui.draggable,{version:"1.8.13"});
d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});
c.sortables=[];
d(f.connectToSortable).each(function(){var h=d.data(this,"sortable");
if(h&&!h.options.disabled){c.sortables.push({instance:h,shouldRevert:h.options.revert});
h.refreshPositions();
h._trigger("activate",a,e);
}});
},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});
d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;
c.cancelHelperRemoval=true;
this.instance.cancelHelperRemoval=false;
if(this.shouldRevert){this.instance.options.revert=true;
}this.instance._mouseStop(a);
this.instance.options.helper=this.instance.options._helper;
c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"});
}else{this.instance.cancelHelperRemoval=false;
this.instance._trigger("deactivate",a,f);
}});
},drag:function(a,b){var c=d(this).data("draggable"),f=this;
d.each(c.sortables,function(){this.instance.positionAbs=c.positionAbs;
this.instance.helperProportions=c.helperProportions;
this.instance.offset.click=c.offset.click;
if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;
this.instance.currentItem=d(f).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",true);
this.instance.options._helper=this.instance.options.helper;
this.instance.options.helper=function(){return b.helper[0];
};
a.target=this.instance.currentItem[0];
this.instance._mouseCapture(a,true);
this.instance._mouseStart(a,true,true);
this.instance.offset.click.top=c.offset.click.top;
this.instance.offset.click.left=c.offset.click.left;
this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;
this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;
c._trigger("toSortable",a);
c.dropped=this.instance.element;
c.currentItem=c.element;
this.instance.fromOutside=c;
}this.instance.currentItem&&this.instance._mouseDrag(a);
}else{if(this.instance.isOver){this.instance.isOver=0;
this.instance.cancelHelperRemoval=true;
this.instance.options.revert=false;
this.instance._trigger("out",a,this.instance._uiHash(this.instance));
this.instance._mouseStop(a,true);
this.instance.options.helper=this.instance.options._helper;
this.instance.currentItem.remove();
this.instance.placeholder&&this.instance.placeholder.remove();
c._trigger("fromSortable",a);
c.dropped=false;
}}});
}});
d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;
if(a.css("cursor")){b._cursor=a.css("cursor");
}a.css("cursor",b.cursor);
},stop:function(){var a=d(this).data("draggable").options;
a._cursor&&d("body").css("cursor",a._cursor);
}});
d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);
b=d(this).data("draggable").options;
if(a.css("opacity")){b._opacity=a.css("opacity");
}a.css("opacity",b.opacity);
},stop:function(a,b){a=d(this).data("draggable").options;
a._opacity&&d(b.helper).css("opacity",a._opacity);
}});
d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");
if(a.scrollParent[0]!=document&&a.scrollParent[0].tagName!="HTML"){a.overflowOffset=a.scrollParent.offset();
}},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;
if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){if(!c.axis||c.axis!="x"){if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity){b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;
}else{if(a.pageY-b.overflowOffset.top<c.scrollSensitivity){b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop-c.scrollSpeed;
}}}if(!c.axis||c.axis!="y"){if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity){b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;
}else{if(a.pageX-b.overflowOffset.left<c.scrollSensitivity){b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed;
}}}}else{if(!c.axis||c.axis!="x"){if(a.pageY-d(document).scrollTop()<c.scrollSensitivity){f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);
}else{if(d(window).height()-(a.pageY-d(document).scrollTop())<c.scrollSensitivity){f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);
}}}if(!c.axis||c.axis!="y"){if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity){f=d(document).scrollLeft(d(document).scrollLeft()-c.scrollSpeed);
}else{if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity){f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed);
}}}}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,a);
}});
d.ui.plugin.add("draggable","snap",{start:function(){var a=d(this).data("draggable"),b=a.options;
a.snapElements=[];
d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();
this!=a.element[0]&&a.snapElements.push({item:this,width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left});
});
},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,h=b.offset.left,g=h+c.helperProportions.width,n=b.offset.top,o=n+c.helperProportions.height,i=c.snapElements.length-1;
i>=0;
i--){var j=c.snapElements[i].left,l=j+c.snapElements[i].width,k=c.snapElements[i].top,m=k+c.snapElements[i].height;
if(j-e<h&&h<l+e&&k-e<n&&n<m+e||j-e<h&&h<l+e&&k-e<o&&o<m+e||j-e<g&&g<l+e&&k-e<n&&n<m+e||j-e<g&&g<l+e&&k-e<o&&o<m+e){if(f.snapMode!="inner"){var p=Math.abs(k-o)<=e,q=Math.abs(m-n)<=e,r=Math.abs(j-g)<=e,s=Math.abs(l-h)<=e;
if(p){b.position.top=c._convertPositionTo("relative",{top:k-c.helperProportions.height,left:0}).top-c.margins.top;
}if(q){b.position.top=c._convertPositionTo("relative",{top:m,left:0}).top-c.margins.top;
}if(r){b.position.left=c._convertPositionTo("relative",{top:0,left:j-c.helperProportions.width}).left-c.margins.left;
}if(s){b.position.left=c._convertPositionTo("relative",{top:0,left:l}).left-c.margins.left;
}}var t=p||q||r||s;
if(f.snapMode!="outer"){p=Math.abs(k-n)<=e;
q=Math.abs(m-o)<=e;
r=Math.abs(j-h)<=e;
s=Math.abs(l-g)<=e;
if(p){b.position.top=c._convertPositionTo("relative",{top:k,left:0}).top-c.margins.top;
}if(q){b.position.top=c._convertPositionTo("relative",{top:m-c.helperProportions.height,left:0}).top-c.margins.top;
}if(r){b.position.left=c._convertPositionTo("relative",{top:0,left:j}).left-c.margins.left;
}if(s){b.position.left=c._convertPositionTo("relative",{top:0,left:l-c.helperProportions.width}).left-c.margins.left;
}}if(!c.snapElements[i].snapping&&(p||q||r||s||t)){c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[i].item}));
}c.snapElements[i].snapping=p||q||r||s||t;
}else{c.snapElements[i].snapping&&c.options.snap.release&&c.options.snap.release.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[i].item}));
c.snapElements[i].snapping=false;
}}}});
d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;
a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),10)||0)-(parseInt(d(f).css("zIndex"),10)||0);
});
if(a.length){var b=parseInt(a[0].style.zIndex)||0;
d(a).each(function(c){this.style.zIndex=b+c;
});
this[0].style.zIndex=b+a.length;
}}});
d.ui.plugin.add("draggable","zIndex",{start:function(a,b){a=d(b.helper);
b=d(this).data("draggable").options;
if(a.css("zIndex")){b._zIndex=a.css("zIndex");
}a.css("zIndex",b.zIndex);
},stop:function(a,b){a=d(this).data("draggable").options;
a._zIndex&&d(b.helper).css("zIndex",a._zIndex);
}});
})(jQuery);
(function(d){d.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var a=this.options,b=a.accept;
this.isover=0;
this.isout=1;
this.accept=d.isFunction(b)?b:function(c){return c.is(b);
};
this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};
d.ui.ddmanager.droppables[a.scope]=d.ui.ddmanager.droppables[a.scope]||[];
d.ui.ddmanager.droppables[a.scope].push(this);
a.addClasses&&this.element.addClass("ui-droppable");
},destroy:function(){for(var a=d.ui.ddmanager.droppables[this.options.scope],b=0;
b<a.length;
b++){a[b]==this&&a.splice(b,1);
}this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
return this;
},_setOption:function(a,b){if(a=="accept"){this.accept=d.isFunction(b)?b:function(c){return c.is(b);
};
}d.Widget.prototype._setOption.apply(this,arguments);
},_activate:function(a){var b=d.ui.ddmanager.current;
this.options.activeClass&&this.element.addClass(this.options.activeClass);
b&&this._trigger("activate",a,this.ui(b));
},_deactivate:function(a){var b=d.ui.ddmanager.current;
this.options.activeClass&&this.element.removeClass(this.options.activeClass);
b&&this._trigger("deactivate",a,this.ui(b));
},_over:function(a){var b=d.ui.ddmanager.current;
if(!(!b||(b.currentItem||b.element)[0]==this.element[0])){if(this.accept.call(this.element[0],b.currentItem||b.element)){this.options.hoverClass&&this.element.addClass(this.options.hoverClass);
this._trigger("over",a,this.ui(b));
}}},_out:function(a){var b=d.ui.ddmanager.current;
if(!(!b||(b.currentItem||b.element)[0]==this.element[0])){if(this.accept.call(this.element[0],b.currentItem||b.element)){this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);
this._trigger("out",a,this.ui(b));
}}},_drop:function(a,b){var c=b||d.ui.ddmanager.current;
if(!c||(c.currentItem||c.element)[0]==this.element[0]){return false;
}var e=false;
this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var g=d.data(this,"droppable");
if(g.options.greedy&&!g.options.disabled&&g.options.scope==c.options.scope&&g.accept.call(g.element[0],c.currentItem||c.element)&&d.ui.intersect(c,d.extend(g,{offset:g.element.offset()}),g.options.tolerance)){e=true;
return false;
}});
if(e){return false;
}if(this.accept.call(this.element[0],c.currentItem||c.element)){this.options.activeClass&&this.element.removeClass(this.options.activeClass);
this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);
this._trigger("drop",a,this.ui(c));
return this.element;
}return false;
},ui:function(a){return{draggable:a.currentItem||a.element,helper:a.helper,position:a.position,offset:a.positionAbs};
}});
d.extend(d.ui.droppable,{version:"1.8.13"});
d.ui.intersect=function(a,b,c){if(!b.offset){return false;
}var e=(a.positionAbs||a.position.absolute).left,g=e+a.helperProportions.width,f=(a.positionAbs||a.position.absolute).top,h=f+a.helperProportions.height,i=b.offset.left,k=i+b.proportions.width,j=b.offset.top,l=j+b.proportions.height;
switch(c){case"fit":return i<=e&&g<=k&&j<=f&&h<=l;
case"intersect":return i<e+a.helperProportions.width/2&&g-a.helperProportions.width/2<k&&j<f+a.helperProportions.height/2&&h-a.helperProportions.height/2<l;
case"pointer":return d.ui.isOver((a.positionAbs||a.position.absolute).top+(a.clickOffset||a.offset.click).top,(a.positionAbs||a.position.absolute).left+(a.clickOffset||a.offset.click).left,j,i,b.proportions.height,b.proportions.width);
case"touch":return(f>=j&&f<=l||h>=j&&h<=l||f<j&&h>l)&&(e>=i&&e<=k||g>=i&&g<=k||e<i&&g>k);
default:return false;
}};
d.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(a,b){var c=d.ui.ddmanager.droppables[a.options.scope]||[],e=b?b.type:null,g=(a.currentItem||a.element).find(":data(droppable)").andSelf(),f=0;
a:for(;
f<c.length;
f++){if(!(c[f].options.disabled||a&&!c[f].accept.call(c[f].element[0],a.currentItem||a.element))){for(var h=0;
h<g.length;
h++){if(g[h]==c[f].element[0]){c[f].proportions.height=0;
continue a;
}}c[f].visible=c[f].element.css("display")!="none";
if(c[f].visible){e=="mousedown"&&c[f]._activate.call(c[f],b);
c[f].offset=c[f].element.offset();
c[f].proportions={width:c[f].element[0].offsetWidth,height:c[f].element[0].offsetHeight};
}}}},drop:function(a,b){var c=false;
d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(this.options){if(!this.options.disabled&&this.visible&&d.ui.intersect(a,this,this.options.tolerance)){c=c||this._drop.call(this,b);
}if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],a.currentItem||a.element)){this.isout=1;
this.isover=0;
this._deactivate.call(this,b);
}}});
return c;
},drag:function(a,b){a.options.refreshPositions&&d.ui.ddmanager.prepareOffsets(a,b);
d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(!(this.options.disabled||this.greedyChild||!this.visible)){var c=d.ui.intersect(a,this,this.options.tolerance);
if(c=!c&&this.isover==1?"isout":c&&this.isover==0?"isover":null){var e;
if(this.options.greedy){var g=this.element.parents(":data(droppable):eq(0)");
if(g.length){e=d.data(g[0],"droppable");
e.greedyChild=c=="isover"?1:0;
}}if(e&&c=="isover"){e.isover=0;
e.isout=1;
e._out.call(e,b);
}this[c]=1;
this[c=="isout"?"isover":"isout"]=0;
this[c=="isover"?"_over":"_out"].call(this,b);
if(e&&c=="isout"){e.isout=0;
e.isover=1;
e._over.call(e,b);
}}}});
}};
})(jQuery);
(function(e){e.widget("ui.resizable",e.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1000},_create:function(){var b=this,a=this.options;
this.element.addClass("ui-resizable");
e.extend(this,{_aspectRatio:!!a.aspectRatio,aspectRatio:a.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:a.helper||a.ghost||a.animate?a.helper||"ui-resizable-helper":null});
if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){/relative/.test(this.element.css("position"))&&e.browser.opera&&this.element.css({position:"relative",top:"auto",left:"auto"});
this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")}));
this.element=this.element.parent().data("resizable",this.element.data("resizable"));
this.elementIsWrapper=true;
this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});
this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});
this.originalResizeStyle=this.originalElement.css("resize");
this.originalElement.css("resize","none");
this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));
this.originalElement.css({margin:this.originalElement.css("margin")});
this._proportionallyResize();
}this.handles=a.handles||(!e(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"});
if(this.handles.constructor==String){if(this.handles=="all"){this.handles="n,e,s,w,se,sw,ne,nw";
}var c=this.handles.split(",");
this.handles={};
for(var d=0;
d<c.length;
d++){var f=e.trim(c[d]),g=e('<div class="ui-resizable-handle '+("ui-resizable-"+f)+'"></div>');
/sw|se|ne|nw/.test(f)&&g.css({zIndex:++a.zIndex});
"se"==f&&g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
this.handles[f]=".ui-resizable-"+f;
this.element.append(g);
}}this._renderAxis=function(h){h=h||this.element;
for(var i in this.handles){if(this.handles[i].constructor==String){this.handles[i]=e(this.handles[i],this.element).show();
}if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var j=e(this.handles[i],this.element),k=0;
k=/sw|ne|nw|se|n|s/.test(i)?j.outerHeight():j.outerWidth();
j=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join("");
h.css(j,k);
this._proportionallyResize();
}e(this.handles[i]);
}};
this._renderAxis(this.element);
this._handles=e(".ui-resizable-handle",this.element).disableSelection();
this._handles.mouseover(function(){if(!b.resizing){if(this.className){var h=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
}b.axis=h&&h[1]?h[1]:"se";
}});
if(a.autoHide){this._handles.hide();
e(this.element).addClass("ui-resizable-autohide").hover(function(){if(!a.disabled){e(this).removeClass("ui-resizable-autohide");
b._handles.show();
}},function(){if(!a.disabled){if(!b.resizing){e(this).addClass("ui-resizable-autohide");
b._handles.hide();
}}});
}this._mouseInit();
},destroy:function(){this._mouseDestroy();
var b=function(c){e(c).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
};
if(this.elementIsWrapper){b(this.element);
var a=this.element;
a.after(this.originalElement.css({position:a.css("position"),width:a.outerWidth(),height:a.outerHeight(),top:a.css("top"),left:a.css("left")})).remove();
}this.originalElement.css("resize",this.originalResizeStyle);
b(this.originalElement);
return this;
},_mouseCapture:function(b){var a=false;
for(var c in this.handles){if(e(this.handles[c])[0]==b.target){a=true;
}}return !this.options.disabled&&a;
},_mouseStart:function(b){var a=this.options,c=this.element.position(),d=this.element;
this.resizing=true;
this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()};
if(d.is(".ui-draggable")||/absolute/.test(d.css("position"))){d.css({position:"absolute",top:c.top,left:c.left});
}e.browser.opera&&/relative/.test(d.css("position"))&&d.css({position:"relative",top:"auto",left:"auto"});
this._renderProxy();
c=m(this.helper.css("left"));
var f=m(this.helper.css("top"));
if(a.containment){c+=e(a.containment).scrollLeft()||0;
f+=e(a.containment).scrollTop()||0;
}this.offset=this.helper.offset();
this.position={left:c,top:f};
this.size=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};
this.originalSize=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};
this.originalPosition={left:c,top:f};
this.sizeDiff={width:d.outerWidth()-d.width(),height:d.outerHeight()-d.height()};
this.originalMousePosition={left:b.pageX,top:b.pageY};
this.aspectRatio=typeof a.aspectRatio=="number"?a.aspectRatio:this.originalSize.width/this.originalSize.height||1;
a=e(".ui-resizable-"+this.axis).css("cursor");
e("body").css("cursor",a=="auto"?this.axis+"-resize":a);
d.addClass("ui-resizable-resizing");
this._propagate("start",b);
return true;
},_mouseDrag:function(b){var a=this.helper,c=this.originalMousePosition,d=this._change[this.axis];
if(!d){return false;
}c=d.apply(this,[b,b.pageX-c.left||0,b.pageY-c.top||0]);
if(this._aspectRatio||b.shiftKey){c=this._updateRatio(c,b);
}c=this._respectSize(c,b);
this._propagate("resize",b);
a.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});
!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();
this._updateCache(c);
this._trigger("resize",b,this.ui());
return false;
},_mouseStop:function(b){this.resizing=false;
var a=this.options,c=this;
if(this._helper){var d=this._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName);
d=f&&e.ui.hasScroll(d[0],"left")?0:c.sizeDiff.height;
f=f?0:c.sizeDiff.width;
f={width:c.helper.width()-f,height:c.helper.height()-d};
d=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null;
var g=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null;
a.animate||this.element.css(e.extend(f,{top:g,left:d}));
c.helper.height(c.size.height);
c.helper.width(c.size.width);
this._helper&&!a.animate&&this._proportionallyResize();
}e("body").css("cursor","auto");
this.element.removeClass("ui-resizable-resizing");
this._propagate("stop",b);
this._helper&&this.helper.remove();
return false;
},_updateCache:function(b){this.offset=this.helper.offset();
if(l(b.left)){this.position.left=b.left;
}if(l(b.top)){this.position.top=b.top;
}if(l(b.height)){this.size.height=b.height;
}if(l(b.width)){this.size.width=b.width;
}},_updateRatio:function(b){var a=this.position,c=this.size,d=this.axis;
if(b.height){b.width=c.height*this.aspectRatio;
}else{if(b.width){b.height=c.width/this.aspectRatio;
}}if(d=="sw"){b.left=a.left+(c.width-b.width);
b.top=null;
}if(d=="nw"){b.top=a.top+(c.height-b.height);
b.left=a.left+(c.width-b.width);
}return b;
},_respectSize:function(b){var a=this.options,c=this.axis,d=l(b.width)&&a.maxWidth&&a.maxWidth<b.width,f=l(b.height)&&a.maxHeight&&a.maxHeight<b.height,g=l(b.width)&&a.minWidth&&a.minWidth>b.width,h=l(b.height)&&a.minHeight&&a.minHeight>b.height;
if(g){b.width=a.minWidth;
}if(h){b.height=a.minHeight;
}if(d){b.width=a.maxWidth;
}if(f){b.height=a.maxHeight;
}var i=this.originalPosition.left+this.originalSize.width,j=this.position.top+this.size.height,k=/sw|nw|w/.test(c);
c=/nw|ne|n/.test(c);
if(g&&k){b.left=i-a.minWidth;
}if(d&&k){b.left=i-a.maxWidth;
}if(h&&c){b.top=j-a.minHeight;
}if(f&&c){b.top=j-a.maxHeight;
}if((a=!b.width&&!b.height)&&!b.left&&b.top){b.top=null;
}else{if(a&&!b.top&&b.left){b.left=null;
}}return b;
},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){for(var b=this.helper||this.element,a=0;
a<this._proportionallyResizeElements.length;
a++){var c=this._proportionallyResizeElements[a];
if(!this.borderDif){var d=[c.css("borderTopWidth"),c.css("borderRightWidth"),c.css("borderBottomWidth"),c.css("borderLeftWidth")],f=[c.css("paddingTop"),c.css("paddingRight"),c.css("paddingBottom"),c.css("paddingLeft")];
this.borderDif=e.map(d,function(g,h){g=parseInt(g,10)||0;
h=parseInt(f[h],10)||0;
return g+h;
});
}e.browser.msie&&(e(b).is(":hidden")||e(b).parents(":hidden").length)||c.css({height:b.height()-this.borderDif[0]-this.borderDif[2]||0,width:b.width()-this.borderDif[1]-this.borderDif[3]||0});
}}},_renderProxy:function(){var b=this.options;
this.elementOffset=this.element.offset();
if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');
var a=e.browser.msie&&e.browser.version<7,c=a?1:0;
a=a?2:-1;
this.helper.addClass(this._helper).css({width:this.element.outerWidth()+a,height:this.element.outerHeight()+a,position:"absolute",left:this.elementOffset.left-c+"px",top:this.elementOffset.top-c+"px",zIndex:++b.zIndex});
this.helper.appendTo("body").disableSelection();
}else{this.helper=this.element;
}},_change:{e:function(b,a){return{width:this.originalSize.width+a};
},w:function(b,a){return{left:this.originalPosition.left+a,width:this.originalSize.width-a};
},n:function(b,a,c){return{top:this.originalPosition.top+c,height:this.originalSize.height-c};
},s:function(b,a,c){return{height:this.originalSize.height+c};
},se:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,a,c]));
},sw:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,a,c]));
},ne:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,a,c]));
},nw:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,a,c]));
}},_propagate:function(b,a){e.ui.plugin.call(this,b,[a,this.ui()]);
b!="resize"&&this._trigger(b,a,this.ui());
},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition};
}});
e.extend(e.ui.resizable,{version:"1.8.13"});
e.ui.plugin.add("resizable","alsoResize",{start:function(){var b=e(this).data("resizable").options,a=function(c){e(c).each(function(){var d=e(this);
d.data("resizable-alsoresize",{width:parseInt(d.width(),10),height:parseInt(d.height(),10),left:parseInt(d.css("left"),10),top:parseInt(d.css("top"),10),position:d.css("position")});
});
};
if(typeof b.alsoResize=="object"&&!b.alsoResize.parentNode){if(b.alsoResize.length){b.alsoResize=b.alsoResize[0];
a(b.alsoResize);
}else{e.each(b.alsoResize,function(c){a(c);
});
}}else{a(b.alsoResize);
}},resize:function(b,a){var c=e(this).data("resizable");
b=c.options;
var d=c.originalSize,f=c.originalPosition,g={height:c.size.height-d.height||0,width:c.size.width-d.width||0,top:c.position.top-f.top||0,left:c.position.left-f.left||0},h=function(i,j){e(i).each(function(){var k=e(this),q=e(this).data("resizable-alsoresize"),p={},r=j&&j.length?j:k.parents(a.originalElement[0]).length?["width","height"]:["width","height","top","left"];
e.each(r,function(n,o){if((n=(q[o]||0)+(g[o]||0))&&n>=0){p[o]=n||null;
}});
if(e.browser.opera&&/relative/.test(k.css("position"))){c._revertToRelativePosition=true;
k.css({position:"absolute",top:"auto",left:"auto"});
}k.css(p);
});
};
typeof b.alsoResize=="object"&&!b.alsoResize.nodeType?e.each(b.alsoResize,function(i,j){h(i,j);
}):h(b.alsoResize);
},stop:function(){var b=e(this).data("resizable"),a=b.options,c=function(d){e(d).each(function(){var f=e(this);
f.css({position:f.data("resizable-alsoresize").position});
});
};
if(b._revertToRelativePosition){b._revertToRelativePosition=false;
typeof a.alsoResize=="object"&&!a.alsoResize.nodeType?e.each(a.alsoResize,function(d){c(d);
}):c(a.alsoResize);
}e(this).removeData("resizable-alsoresize");
}});
e.ui.plugin.add("resizable","animate",{stop:function(b){var a=e(this).data("resizable"),c=a.options,d=a._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName),g=f&&e.ui.hasScroll(d[0],"left")?0:a.sizeDiff.height;
f={width:a.size.width-(f?0:a.sizeDiff.width),height:a.size.height-g};
g=parseInt(a.element.css("left"),10)+(a.position.left-a.originalPosition.left)||null;
var h=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;
a.element.animate(e.extend(f,h&&g?{top:h,left:g}:{}),{duration:c.animateDuration,easing:c.animateEasing,step:function(){var i={width:parseInt(a.element.css("width"),10),height:parseInt(a.element.css("height"),10),top:parseInt(a.element.css("top"),10),left:parseInt(a.element.css("left"),10)};
d&&d.length&&e(d[0]).css({width:i.width,height:i.height});
a._updateCache(i);
a._propagate("resize",b);
}});
}});
e.ui.plugin.add("resizable","containment",{start:function(){var b=e(this).data("resizable"),a=b.element,c=b.options.containment;
if(a=c instanceof e?c.get(0):/parent/.test(c)?a.parent().get(0):c){b.containerElement=e(a);
if(/document/.test(c)||c==document){b.containerOffset={left:0,top:0};
b.containerPosition={left:0,top:0};
b.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight};
}else{var d=e(a),f=[];
e(["Top","Right","Left","Bottom"]).each(function(i,j){f[i]=m(d.css("padding"+j));
});
b.containerOffset=d.offset();
b.containerPosition=d.position();
b.containerSize={height:d.innerHeight()-f[3],width:d.innerWidth()-f[1]};
c=b.containerOffset;
var g=b.containerSize.height,h=b.containerSize.width;
h=e.ui.hasScroll(a,"left")?a.scrollWidth:h;
g=e.ui.hasScroll(a)?a.scrollHeight:g;
b.parentData={element:a,left:c.left,top:c.top,width:h,height:g};
}}},resize:function(b){var a=e(this).data("resizable"),c=a.options,d=a.containerOffset,f=a.position;
b=a._aspectRatio||b.shiftKey;
var g={top:0,left:0},h=a.containerElement;
if(h[0]!=document&&/static/.test(h.css("position"))){g=d;
}if(f.left<(a._helper?d.left:0)){a.size.width+=a._helper?a.position.left-d.left:a.position.left-g.left;
if(b){a.size.height=a.size.width/c.aspectRatio;
}a.position.left=c.helper?d.left:0;
}if(f.top<(a._helper?d.top:0)){a.size.height+=a._helper?a.position.top-d.top:a.position.top;
if(b){a.size.width=a.size.height*c.aspectRatio;
}a.position.top=a._helper?d.top:0;
}a.offset.left=a.parentData.left+a.position.left;
a.offset.top=a.parentData.top+a.position.top;
c=Math.abs((a._helper?a.offset.left-g.left:a.offset.left-g.left)+a.sizeDiff.width);
d=Math.abs((a._helper?a.offset.top-g.top:a.offset.top-d.top)+a.sizeDiff.height);
f=a.containerElement.get(0)==a.element.parent().get(0);
g=/relative|absolute/.test(a.containerElement.css("position"));
if(f&&g){c-=a.parentData.left;
}if(c+a.size.width>=a.parentData.width){a.size.width=a.parentData.width-c;
if(b){a.size.height=a.size.width/a.aspectRatio;
}}if(d+a.size.height>=a.parentData.height){a.size.height=a.parentData.height-d;
if(b){a.size.width=a.size.height*a.aspectRatio;
}}},stop:function(){var b=e(this).data("resizable"),a=b.options,c=b.containerOffset,d=b.containerPosition,f=b.containerElement,g=e(b.helper),h=g.offset(),i=g.outerWidth()-b.sizeDiff.width;
g=g.outerHeight()-b.sizeDiff.height;
b._helper&&!a.animate&&/relative/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});
b._helper&&!a.animate&&/static/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});
}});
e.ui.plugin.add("resizable","ghost",{start:function(){var b=e(this).data("resizable"),a=b.options,c=b.size;
b.ghost=b.originalElement.clone();
b.ghost.css({opacity:0.25,display:"block",position:"relative",height:c.height,width:c.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof a.ghost=="string"?a.ghost:"");
b.ghost.appendTo(b.helper);
},resize:function(){var b=e(this).data("resizable");
b.ghost&&b.ghost.css({position:"relative",height:b.size.height,width:b.size.width});
},stop:function(){var b=e(this).data("resizable");
b.ghost&&b.helper&&b.helper.get(0).removeChild(b.ghost.get(0));
}});
e.ui.plugin.add("resizable","grid",{resize:function(){var b=e(this).data("resizable"),a=b.options,c=b.size,d=b.originalSize,f=b.originalPosition,g=b.axis;
a.grid=typeof a.grid=="number"?[a.grid,a.grid]:a.grid;
var h=Math.round((c.width-d.width)/(a.grid[0]||1))*(a.grid[0]||1);
a=Math.round((c.height-d.height)/(a.grid[1]||1))*(a.grid[1]||1);
if(/^(se|s|e)$/.test(g)){b.size.width=d.width+h;
b.size.height=d.height+a;
}else{if(/^(ne)$/.test(g)){b.size.width=d.width+h;
b.size.height=d.height+a;
b.position.top=f.top-a;
}else{if(/^(sw)$/.test(g)){b.size.width=d.width+h;
b.size.height=d.height+a;
}else{b.size.width=d.width+h;
b.size.height=d.height+a;
b.position.top=f.top-a;
}b.position.left=f.left-h;
}}}});
var m=function(b){return parseInt(b,10)||0;
},l=function(b){return !isNaN(parseInt(b,10));
};
})(jQuery);
(function(e){e.widget("ui.selectable",e.ui.mouse,{options:{appendTo:"body",autoRefresh:true,distance:0,filter:"*",tolerance:"touch"},_create:function(){var c=this;
this.element.addClass("ui-selectable");
this.dragged=false;
var f;
this.refresh=function(){f=e(c.options.filter,c.element[0]);
f.each(function(){var d=e(this),b=d.offset();
e.data(this,"selectable-item",{element:this,$element:d,left:b.left,top:b.top,right:b.left+d.outerWidth(),bottom:b.top+d.outerHeight(),startselected:false,selected:d.hasClass("ui-selected"),selecting:d.hasClass("ui-selecting"),unselecting:d.hasClass("ui-unselecting")});
});
};
this.refresh();
this.selectees=f.addClass("ui-selectee");
this._mouseInit();
this.helper=e("<div class='ui-selectable-helper'></div>");
},destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item");
this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");
this._mouseDestroy();
return this;
},_mouseStart:function(c){var f=this;
this.opos=[c.pageX,c.pageY];
if(!this.options.disabled){var d=this.options;
this.selectees=e(d.filter,this.element[0]);
this._trigger("start",c);
e(d.appendTo).append(this.helper);
this.helper.css({left:c.clientX,top:c.clientY,width:0,height:0});
d.autoRefresh&&this.refresh();
this.selectees.filter(".ui-selected").each(function(){var b=e.data(this,"selectable-item");
b.startselected=true;
if(!c.metaKey){b.$element.removeClass("ui-selected");
b.selected=false;
b.$element.addClass("ui-unselecting");
b.unselecting=true;
f._trigger("unselecting",c,{unselecting:b.element});
}});
e(c.target).parents().andSelf().each(function(){var b=e.data(this,"selectable-item");
if(b){var g=!c.metaKey||!b.$element.hasClass("ui-selected");
b.$element.removeClass(g?"ui-unselecting":"ui-selected").addClass(g?"ui-selecting":"ui-unselecting");
b.unselecting=!g;
b.selecting=g;
(b.selected=g)?f._trigger("selecting",c,{selecting:b.element}):f._trigger("unselecting",c,{unselecting:b.element});
return false;
}});
}},_mouseDrag:function(c){var f=this;
this.dragged=true;
if(!this.options.disabled){var d=this.options,b=this.opos[0],g=this.opos[1],h=c.pageX,i=c.pageY;
if(b>h){var j=h;
h=b;
b=j;
}if(g>i){j=i;
i=g;
g=j;
}this.helper.css({left:b,top:g,width:h-b,height:i-g});
this.selectees.each(function(){var a=e.data(this,"selectable-item");
if(!(!a||a.element==f.element[0])){var k=false;
if(d.tolerance=="touch"){k=!(a.left>h||a.right<b||a.top>i||a.bottom<g);
}else{if(d.tolerance=="fit"){k=a.left>b&&a.right<h&&a.top>g&&a.bottom<i;
}}if(k){if(a.selected){a.$element.removeClass("ui-selected");
a.selected=false;
}if(a.unselecting){a.$element.removeClass("ui-unselecting");
a.unselecting=false;
}if(!a.selecting){a.$element.addClass("ui-selecting");
a.selecting=true;
f._trigger("selecting",c,{selecting:a.element});
}}else{if(a.selecting){if(c.metaKey&&a.startselected){a.$element.removeClass("ui-selecting");
a.selecting=false;
a.$element.addClass("ui-selected");
a.selected=true;
}else{a.$element.removeClass("ui-selecting");
a.selecting=false;
if(a.startselected){a.$element.addClass("ui-unselecting");
a.unselecting=true;
}f._trigger("unselecting",c,{unselecting:a.element});
}}if(a.selected){if(!c.metaKey&&!a.startselected){a.$element.removeClass("ui-selected");
a.selected=false;
a.$element.addClass("ui-unselecting");
a.unselecting=true;
f._trigger("unselecting",c,{unselecting:a.element});
}}}}});
return false;
}},_mouseStop:function(c){var f=this;
this.dragged=false;
e(".ui-unselecting",this.element[0]).each(function(){var d=e.data(this,"selectable-item");
d.$element.removeClass("ui-unselecting");
d.unselecting=false;
d.startselected=false;
f._trigger("unselected",c,{unselected:d.element});
});
e(".ui-selecting",this.element[0]).each(function(){var d=e.data(this,"selectable-item");
d.$element.removeClass("ui-selecting").addClass("ui-selected");
d.selecting=false;
d.selected=true;
d.startselected=true;
f._trigger("selected",c,{selected:d.element});
});
this._trigger("stop",c);
this.helper.remove();
return false;
}});
e.extend(e.ui.selectable,{version:"1.8.13"});
})(jQuery);
(function(d){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var a=this.options;
this.containerCache={};
this.element.addClass("ui-sortable");
this.refresh();
this.floating=this.items.length?a.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):false;
this.offset=this.element.offset();
this._mouseInit();
},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
this._mouseDestroy();
for(var a=this.items.length-1;
a>=0;
a--){this.items[a].item.removeData("sortable-item");
}return this;
},_setOption:function(a,b){if(a==="disabled"){this.options[a]=b;
this.widget()[b?"addClass":"removeClass"]("ui-sortable-disabled");
}else{d.Widget.prototype._setOption.apply(this,arguments);
}},_mouseCapture:function(a,b){if(this.reverting){return false;
}if(this.options.disabled||this.options.type=="static"){return false;
}this._refreshItems(a);
var c=null,e=this;
d(a.target).parents().each(function(){if(d.data(this,"sortable-item")==e){c=d(this);
return false;
}});
if(d.data(a.target,"sortable-item")==e){c=d(a.target);
}if(!c){return false;
}if(this.options.handle&&!b){var f=false;
d(this.options.handle,c).find("*").andSelf().each(function(){if(this==a.target){f=true;
}});
if(!f){return false;
}}this.currentItem=c;
this._removeCurrentsFromItems();
return true;
},_mouseStart:function(a,b,c){b=this.options;
var e=this;
this.currentContainer=this;
this.refreshPositions();
this.helper=this._createHelper(a);
this._cacheHelperProportions();
this._cacheMargins();
this.scrollParent=this.helper.scrollParent();
this.offset=this.currentItem.offset();
this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};
this.helper.css("position","absolute");
this.cssPosition=this.helper.css("position");
d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this._generatePosition(a);
this.originalPageX=a.pageX;
this.originalPageY=a.pageY;
b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);
this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();
this._createPlaceholder();
b.containment&&this._setContainment();
if(b.cursor){if(d("body").css("cursor")){this._storedCursor=d("body").css("cursor");
}d("body").css("cursor",b.cursor);
}if(b.opacity){if(this.helper.css("opacity")){this._storedOpacity=this.helper.css("opacity");
}this.helper.css("opacity",b.opacity);
}if(b.zIndex){if(this.helper.css("zIndex")){this._storedZIndex=this.helper.css("zIndex");
}this.helper.css("zIndex",b.zIndex);
}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){this.overflowOffset=this.scrollParent.offset();
}this._trigger("start",a,this._uiHash());
this._preserveHelperProportions||this._cacheHelperProportions();
if(!c){for(c=this.containers.length-1;
c>=0;
c--){this.containers[c]._trigger("activate",a,e._uiHash(this));
}}if(d.ui.ddmanager){d.ui.ddmanager.current=this;
}d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);
this.dragging=true;
this.helper.addClass("ui-sortable-helper");
this._mouseDrag(a);
return true;
},_mouseDrag:function(a){this.position=this._generatePosition(a);
this.positionAbs=this._convertPositionTo("absolute");
if(!this.lastPositionAbs){this.lastPositionAbs=this.positionAbs;
}if(this.options.scroll){var b=this.options,c=false;
if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<b.scrollSensitivity){this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+b.scrollSpeed;
}else{if(a.pageY-this.overflowOffset.top<b.scrollSensitivity){this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-b.scrollSpeed;
}}if(this.overflowOffset.left+this.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity){this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+b.scrollSpeed;
}else{if(a.pageX-this.overflowOffset.left<b.scrollSensitivity){this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-b.scrollSpeed;
}}}else{if(a.pageY-d(document).scrollTop()<b.scrollSensitivity){c=d(document).scrollTop(d(document).scrollTop()-b.scrollSpeed);
}else{if(d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity){c=d(document).scrollTop(d(document).scrollTop()+b.scrollSpeed);
}}if(a.pageX-d(document).scrollLeft()<b.scrollSensitivity){c=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed);
}else{if(d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity){c=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed);
}}}c!==false&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);
}this.positionAbs=this._convertPositionTo("absolute");
if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px";
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px";
}for(b=this.items.length-1;
b>=0;
b--){c=this.items[b];
var e=c.item[0],f=this._intersectsWithPointer(c);
if(f){if(e!=this.currentItem[0]&&this.placeholder[f==1?"next":"prev"]()[0]!=e&&!d.ui.contains(this.placeholder[0],e)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],e):true)){this.direction=f==1?"down":"up";
if(this.options.tolerance=="pointer"||this._intersectsWithSides(c)){this._rearrange(a,c);
}else{break;
}this._trigger("change",a,this._uiHash());
break;
}}}this._contactContainers(a);
d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);
this._trigger("sort",a,this._uiHash());
this.lastPositionAbs=this.positionAbs;
return false;
},_mouseStop:function(a,b){if(a){d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);
if(this.options.revert){var c=this;
b=c.placeholder.offset();
c.reverting=true;
d(this.helper).animate({left:b.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:b.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(a);
});
}else{this._clear(a,b);
}return false;
}},cancel:function(){var a=this;
if(this.dragging){this._mouseUp({target:null});
this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();
for(var b=this.containers.length-1;
b>=0;
b--){this.containers[b]._trigger("deactivate",null,a._uiHash(this));
if(this.containers[b].containerCache.over){this.containers[b]._trigger("out",null,a._uiHash(this));
this.containers[b].containerCache.over=0;
}}}if(this.placeholder){this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();
d.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});
this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):d(this.domPosition.parent).prepend(this.currentItem);
}return this;
},serialize:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];
a=a||{};
d(b).each(function(){var e=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);
if(e){c.push((a.key||e[1]+"[]")+"="+(a.key&&a.expression?e[1]:e[2]));
}});
!c.length&&a.key&&c.push(a.key+"=");
return c.join("&");
},toArray:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];
a=a||{};
b.each(function(){c.push(d(a.item||this).attr(a.attribute||"id")||"");
});
return c;
},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,e=this.positionAbs.top,f=e+this.helperProportions.height,g=a.left,h=g+a.width,i=a.top,k=i+a.height,j=this.offset.click.top,l=this.offset.click.left;
j=e+j>i&&e+j<k&&b+l>g&&b+l<h;
return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?j:g<b+this.helperProportions.width/2&&c-this.helperProportions.width/2<h&&i<e+this.helperProportions.height/2&&f-this.helperProportions.height/2<k;
},_intersectsWithPointer:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height);
a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width);
b=b&&a;
a=this._getDragVerticalDirection();
var c=this._getDragHorizontalDirection();
if(!b){return false;
}return this.floating?c&&c=="right"||a=="down"?2:1:a&&(a=="down"?2:1);
},_intersectsWithSides:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height);
a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width);
var c=this._getDragVerticalDirection(),e=this._getDragHorizontalDirection();
return this.floating&&e?e=="right"&&a||e=="left"&&!a:c&&(c=="down"&&b||c=="up"&&!b);
},_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;
return a!=0&&(a>0?"down":"up");
},_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;
return a!=0&&(a>0?"right":"left");
},refresh:function(a){this._refreshItems(a);
this.refreshPositions();
return this;
},_connectWith:function(){var a=this.options;
return a.connectWith.constructor==String?[a.connectWith]:a.connectWith;
},_getItemsAsjQuery:function(a){var b=[],c=[],e=this._connectWith();
if(e&&a){for(a=e.length-1;
a>=0;
a--){for(var f=d(e[a]),g=f.length-1;
g>=0;
g--){var h=d.data(f[g],"sortable");
if(h&&h!=this&&!h.options.disabled){c.push([d.isFunction(h.options.items)?h.options.items.call(h.element):d(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h]);
}}}}c.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);
for(a=c.length-1;
a>=0;
a--){c[a][0].each(function(){b.push(this);
});
}return d(b);
},_removeCurrentsFromItems:function(){for(var a=this.currentItem.find(":data(sortable-item)"),b=0;
b<this.items.length;
b++){for(var c=0;
c<a.length;
c++){a[c]==this.items[b].item[0]&&this.items.splice(b,1);
}}},_refreshItems:function(a){this.items=[];
this.containers=[this];
var b=this.items,c=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],a,{item:this.currentItem}):d(this.options.items,this.element),this]],e=this._connectWith();
if(e){for(var f=e.length-1;
f>=0;
f--){for(var g=d(e[f]),h=g.length-1;
h>=0;
h--){var i=d.data(g[h],"sortable");
if(i&&i!=this&&!i.options.disabled){c.push([d.isFunction(i.options.items)?i.options.items.call(i.element[0],a,{item:this.currentItem}):d(i.options.items,i.element),i]);
this.containers.push(i);
}}}}for(f=c.length-1;
f>=0;
f--){a=c[f][1];
e=c[f][0];
h=0;
for(g=e.length;
h<g;
h++){i=d(e[h]);
i.data("sortable-item",a);
b.push({item:i,instance:a,width:0,height:0,left:0,top:0});
}}},refreshPositions:function(a){if(this.offsetParent&&this.helper){this.offset.parent=this._getParentOffset();
}for(var b=this.items.length-1;
b>=0;
b--){var c=this.items[b];
if(!(c.instance!=this.currentContainer&&this.currentContainer&&c.item[0]!=this.currentItem[0])){var e=this.options.toleranceElement?d(this.options.toleranceElement,c.item):c.item;
if(!a){c.width=e.outerWidth();
c.height=e.outerHeight();
}e=e.offset();
c.left=e.left;
c.top=e.top;
}}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this);
}else{for(b=this.containers.length-1;
b>=0;
b--){e=this.containers[b].element.offset();
this.containers[b].containerCache.left=e.left;
this.containers[b].containerCache.top=e.top;
this.containers[b].containerCache.width=this.containers[b].element.outerWidth();
this.containers[b].containerCache.height=this.containers[b].element.outerHeight();
}}return this;
},_createPlaceholder:function(a){var b=a||this,c=b.options;
if(!c.placeholder||c.placeholder.constructor==String){var e=c.placeholder;
c.placeholder={element:function(){var f=d(document.createElement(b.currentItem[0].nodeName)).addClass(e||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
if(!e){f.style.visibility="hidden";
}return f;
},update:function(f,g){if(!(e&&!c.forcePlaceholderSize)){g.height()||g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));
g.width()||g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10));
}}};
}b.placeholder=d(c.placeholder.element.call(b.element,b.currentItem));
b.currentItem.after(b.placeholder);
c.placeholder.update(b,b.placeholder);
},_contactContainers:function(a){for(var b=null,c=null,e=this.containers.length-1;
e>=0;
e--){if(!d.ui.contains(this.currentItem[0],this.containers[e].element[0])){if(this._intersectsWith(this.containers[e].containerCache)){if(!(b&&d.ui.contains(this.containers[e].element[0],b.element[0]))){b=this.containers[e];
c=e;
}}else{if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",a,this._uiHash(this));
this.containers[e].containerCache.over=0;
}}}}if(b){if(this.containers.length===1){this.containers[c]._trigger("over",a,this._uiHash(this));
this.containers[c].containerCache.over=1;
}else{if(this.currentContainer!=this.containers[c]){b=10000;
e=null;
for(var f=this.positionAbs[this.containers[c].floating?"left":"top"],g=this.items.length-1;
g>=0;
g--){if(d.ui.contains(this.containers[c].element[0],this.items[g].item[0])){var h=this.items[g][this.containers[c].floating?"left":"top"];
if(Math.abs(h-f)<b){b=Math.abs(h-f);
e=this.items[g];
}}}if(e||this.options.dropOnEmpty){this.currentContainer=this.containers[c];
e?this._rearrange(a,e,null,true):this._rearrange(a,null,this.containers[c].element,true);
this._trigger("change",a,this._uiHash());
this.containers[c]._trigger("change",a,this._uiHash(this));
this.options.placeholder.update(this.currentContainer,this.placeholder);
this.containers[c]._trigger("over",a,this._uiHash(this));
this.containers[c].containerCache.over=1;
}}}}},_createHelper:function(a){var b=this.options;
a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a,this.currentItem])):b.helper=="clone"?this.currentItem.clone():this.currentItem;
a.parents("body").length||d(b.appendTo!="parent"?b.appendTo:this.currentItem[0].parentNode)[0].appendChild(a[0]);
if(a[0]==this.currentItem[0]){this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};
}if(a[0].style.width==""||b.forceHelperSize){a.width(this.currentItem.width());
}if(a[0].style.height==""||b.forceHelperSize){a.height(this.currentItem.height());
}return a;
},_adjustOffsetFromHelper:function(a){if(typeof a=="string"){a=a.split(" ");
}if(d.isArray(a)){a={left:+a[0],top:+a[1]||0};
}if("left" in a){this.offset.click.left=a.left+this.margins.left;
}if("right" in a){this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;
}if("top" in a){this.offset.click.top=a.top+this.margins.top;
}if("bottom" in a){this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top;
}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var a=this.offsetParent.offset();
if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();
a.top+=this.scrollParent.scrollTop();
}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie){a={top:0,left:0};
}return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.currentItem.position();
return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()};
}else{return{top:0,left:0};
}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0};
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};
},_setContainment:function(){var a=this.options;
if(a.containment=="parent"){a.containment=this.helper[0].parentNode;
}if(a.containment=="document"||a.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
}if(!/^(document|window|parent)$/.test(a.containment)){var b=d(a.containment)[0];
a=d(a.containment).offset();
var c=d(b).css("overflow")!="hidden";
this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top];
}},_convertPositionTo:function(a,b){if(!b){b=this.position;
}a=a=="absolute"?1:-1;
var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);
return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())*a)};
},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);
if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0])){this.offset.relative=this._getRelativeOffset();
}var f=a.pageX,g=a.pageY;
if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0]){f=this.containment[0]+this.offset.click.left;
}if(a.pageY-this.offset.click.top<this.containment[1]){g=this.containment[1]+this.offset.click.top;
}if(a.pageX-this.offset.click.left>this.containment[2]){f=this.containment[2]+this.offset.click.left;
}if(a.pageY-this.offset.click.top>this.containment[3]){g=this.containment[3]+this.offset.click.top;
}}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/b.grid[1])*b.grid[1];
g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;
f=this.originalPageX+Math.round((f-this.originalPageX)/b.grid[0])*b.grid[0];
f=this.containment?!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:!(f-this.offset.click.left<this.containment[0])?f-b.grid[0]:f+b.grid[0]:f;
}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())};
},_rearrange:function(a,b,c,e){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?b.item[0]:b.item[0].nextSibling);
this.counter=this.counter?++this.counter:1;
var f=this,g=this.counter;
window.setTimeout(function(){g==f.counter&&f.refreshPositions(!e);
},0);
},_clear:function(a,b){this.reverting=false;
var c=[];
!this._noFinalSort&&this.currentItem[0].parentNode&&this.placeholder.before(this.currentItem);
this._noFinalSort=null;
if(this.helper[0]==this.currentItem[0]){for(var e in this._storedCSS){if(this._storedCSS[e]=="auto"||this._storedCSS[e]=="static"){this._storedCSS[e]="";
}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
}else{this.currentItem.show();
}this.fromOutside&&!b&&c.push(function(f){this._trigger("receive",f,this._uiHash(this.fromOutside));
});
if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!b){c.push(function(f){this._trigger("update",f,this._uiHash());
});
}if(!d.ui.contains(this.element[0],this.currentItem[0])){b||c.push(function(f){this._trigger("remove",f,this._uiHash());
});
for(e=this.containers.length-1;
e>=0;
e--){if(d.ui.contains(this.containers[e].element[0],this.currentItem[0])&&!b){c.push(function(f){return function(g){f._trigger("receive",g,this._uiHash(this));
};
}.call(this,this.containers[e]));
c.push(function(f){return function(g){f._trigger("update",g,this._uiHash(this));
};
}.call(this,this.containers[e]));
}}}for(e=this.containers.length-1;
e>=0;
e--){b||c.push(function(f){return function(g){f._trigger("deactivate",g,this._uiHash(this));
};
}.call(this,this.containers[e]));
if(this.containers[e].containerCache.over){c.push(function(f){return function(g){f._trigger("out",g,this._uiHash(this));
};
}.call(this,this.containers[e]));
this.containers[e].containerCache.over=0;
}}this._storedCursor&&d("body").css("cursor",this._storedCursor);
this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);
if(this._storedZIndex){this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);
}this.dragging=false;
if(this.cancelHelperRemoval){if(!b){this._trigger("beforeStop",a,this._uiHash());
for(e=0;
e<c.length;
e++){c[e].call(this,a);
}this._trigger("stop",a,this._uiHash());
}return false;
}b||this._trigger("beforeStop",a,this._uiHash());
this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
this.helper[0]!=this.currentItem[0]&&this.helper.remove();
this.helper=null;
if(!b){for(e=0;
e<c.length;
e++){c[e].call(this,a);
}this._trigger("stop",a,this._uiHash());
}this.fromOutside=false;
return true;
},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel();
},_uiHash:function(a){var b=a||this;
return{helper:b.helper,placeholder:b.placeholder||d([]),position:b.position,originalPosition:b.originalPosition,offset:b.positionAbs,item:b.currentItem,sender:a?a.element:null};
}});
d.extend(d.ui.sortable,{version:"1.8.13"});
})(jQuery);
(function(c){c.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:true,clearStyle:false,collapsible:false,event:"click",fillSpace:false,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:false,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase();
}},_create:function(){var a=this,b=a.options;
a.running=0;
a.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");
a.headers=a.element.find(b.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){b.disabled||c(this).addClass("ui-state-hover");
}).bind("mouseleave.accordion",function(){b.disabled||c(this).removeClass("ui-state-hover");
}).bind("focus.accordion",function(){b.disabled||c(this).addClass("ui-state-focus");
}).bind("blur.accordion",function(){b.disabled||c(this).removeClass("ui-state-focus");
});
a.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
if(b.navigation){var d=a.element.find("a").filter(b.navigationFilter).eq(0);
if(d.length){var h=d.closest(".ui-accordion-header");
a.active=h.length?h:d.closest(".ui-accordion-content").prev();
}}a.active=a._findActive(a.active||b.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");
a.active.next().addClass("ui-accordion-content-active");
a._createIcons();
a.resize();
a.element.attr("role","tablist");
a.headers.attr("role","tab").bind("keydown.accordion",function(f){return a._keydown(f);
}).next().attr("role","tabpanel");
a.headers.not(a.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide();
a.active.length?a.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):a.headers.eq(0).attr("tabIndex",0);
c.browser.safari||a.headers.find("a").attr("tabIndex",-1);
b.event&&a.headers.bind(b.event.split(" ").join(".accordion ")+".accordion",function(f){a._clickHandler.call(a,f,this);
f.preventDefault();
});
},_createIcons:function(){var a=this.options;
if(a.icons){c("<span></span>").addClass("ui-icon "+a.icons.header).prependTo(this.headers);
this.active.children(".ui-icon").toggleClass(a.icons.header).toggleClass(a.icons.headerSelected);
this.element.addClass("ui-accordion-icons");
}},_destroyIcons:function(){this.headers.children(".ui-icon").remove();
this.element.removeClass("ui-accordion-icons");
},destroy:function(){var a=this.options;
this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex");
this.headers.find("a").removeAttr("tabIndex");
this._destroyIcons();
var b=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");
if(a.autoHeight||a.fillHeight){b.css("height","");
}return c.Widget.prototype.destroy.call(this);
},_setOption:function(a,b){c.Widget.prototype._setOption.apply(this,arguments);
a=="active"&&this.activate(b);
if(a=="icons"){this._destroyIcons();
b&&this._createIcons();
}if(a=="disabled"){this.headers.add(this.headers.next())[b?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled");
}},_keydown:function(a){if(!(this.options.disabled||a.altKey||a.ctrlKey)){var b=c.ui.keyCode,d=this.headers.length,h=this.headers.index(a.target),f=false;
switch(a.keyCode){case b.RIGHT:case b.DOWN:f=this.headers[(h+1)%d];
break;
case b.LEFT:case b.UP:f=this.headers[(h-1+d)%d];
break;
case b.SPACE:case b.ENTER:this._clickHandler({target:a.target},a.target);
a.preventDefault();
}if(f){c(a.target).attr("tabIndex",-1);
c(f).attr("tabIndex",0);
f.focus();
return false;
}return true;
}},resize:function(){var a=this.options,b;
if(a.fillSpace){if(c.browser.msie){var d=this.element.parent().css("overflow");
this.element.parent().css("overflow","hidden");
}b=this.element.parent().height();
c.browser.msie&&this.element.parent().css("overflow",d);
this.headers.each(function(){b-=c(this).outerHeight(true);
});
this.headers.next().each(function(){c(this).height(Math.max(0,b-c(this).innerHeight()+c(this).height()));
}).css("overflow","auto");
}else{if(a.autoHeight){b=0;
this.headers.next().each(function(){b=Math.max(b,c(this).height("").height());
}).height(b);
}}return this;
},activate:function(a){this.options.active=a;
a=this._findActive(a)[0];
this._clickHandler({target:a},a);
return this;
},_findActive:function(a){return a?typeof a==="number"?this.headers.filter(":eq("+a+")"):this.headers.not(this.headers.not(a)):a===false?c([]):this.headers.filter(":eq(0)");
},_clickHandler:function(a,b){var d=this.options;
if(!d.disabled){if(a.target){a=c(a.currentTarget||b);
b=a[0]===this.active[0];
d.active=d.collapsible&&b?false:this.headers.index(a);
if(!(this.running||!d.collapsible&&b)){var h=this.active;
j=a.next();
g=this.active.next();
e={options:d,newHeader:b&&d.collapsible?c([]):a,oldHeader:this.active,newContent:b&&d.collapsible?c([]):j,oldContent:g};
var f=this.headers.index(this.active[0])>this.headers.index(a[0]);
this.active=b?c([]):a;
this._toggle(j,g,e,b,f);
h.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);
if(!b){a.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected);
a.next().addClass("ui-accordion-content-active");
}}}else{if(d.collapsible){this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);
this.active.next().addClass("ui-accordion-content-active");
var g=this.active.next(),e={options:d,newHeader:c([]),oldHeader:d.active,newContent:c([]),oldContent:g},j=this.active=c([]);
this._toggle(j,g,e);
}}}},_toggle:function(a,b,d,h,f){var g=this,e=g.options;
g.toShow=a;
g.toHide=b;
g.data=d;
var j=function(){if(g){return g._completed.apply(g,arguments);
}};
g._trigger("changestart",null,g.data);
g.running=b.size()===0?a.size():b.size();
if(e.animated){d={};
d=e.collapsible&&h?{toShow:c([]),toHide:b,complete:j,down:f,autoHeight:e.autoHeight||e.fillSpace}:{toShow:a,toHide:b,complete:j,down:f,autoHeight:e.autoHeight||e.fillSpace};
if(!e.proxied){e.proxied=e.animated;
}if(!e.proxiedDuration){e.proxiedDuration=e.duration;
}e.animated=c.isFunction(e.proxied)?e.proxied(d):e.proxied;
e.duration=c.isFunction(e.proxiedDuration)?e.proxiedDuration(d):e.proxiedDuration;
h=c.ui.accordion.animations;
var i=e.duration,k=e.animated;
if(k&&!h[k]&&!c.easing[k]){k="slide";
}h[k]||(h[k]=function(l){this.slide(l,{easing:k,duration:i||700});
});
h[k](d);
}else{if(e.collapsible&&h){a.toggle();
}else{b.hide();
a.show();
}j(true);
}b.prev().attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).blur();
a.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus();
},_completed:function(a){this.running=a?0:--this.running;
if(!this.running){this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""});
this.toHide.removeClass("ui-accordion-content-active");
if(this.toHide.length){this.toHide.parent()[0].className=this.toHide.parent()[0].className;
}this._trigger("change",null,this.data);
}}});
c.extend(c.ui.accordion,{version:"1.8.13",animations:{slide:function(a,b){a=c.extend({easing:"swing",duration:300},a,b);
if(a.toHide.size()){if(a.toShow.size()){var d=a.toShow.css("overflow"),h=0,f={},g={},e;
b=a.toShow;
e=b[0].style.width;
b.width(parseInt(b.parent().width(),10)-parseInt(b.css("paddingLeft"),10)-parseInt(b.css("paddingRight"),10)-(parseInt(b.css("borderLeftWidth"),10)||0)-(parseInt(b.css("borderRightWidth"),10)||0));
c.each(["height","paddingTop","paddingBottom"],function(j,i){g[i]="hide";
j=(""+c.css(a.toShow[0],i)).match(/^([\d+-.]+)(.*)$/);
f[i]={value:j[1],unit:j[2]||"px"};
});
a.toShow.css({height:0,overflow:"hidden"}).show();
a.toHide.filter(":hidden").each(a.complete).end().filter(":visible").animate(g,{step:function(j,i){if(i.prop=="height"){h=i.end-i.start===0?0:(i.now-i.start)/(i.end-i.start);
}a.toShow[0].style[i.prop]=h*f[i.prop].value+f[i.prop].unit;
},duration:a.duration,easing:a.easing,complete:function(){a.autoHeight||a.toShow.css("height","");
a.toShow.css({width:e,overflow:d});
a.complete();
}});
}else{a.toHide.animate({height:"hide",paddingTop:"hide",paddingBottom:"hide"},a);
}}else{a.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},a);
}},bounceslide:function(a){this.slide(a,{easing:a.down?"easeOutBounce":"swing",duration:a.down?1000:200});
}}});
})(jQuery);
(function(d){var e=0;
d.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var a=this,b=this.element[0].ownerDocument,g;
this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(c){if(!(a.options.disabled||a.element.attr("readonly"))){g=false;
var f=d.ui.keyCode;
switch(c.keyCode){case f.PAGE_UP:a._move("previousPage",c);
break;
case f.PAGE_DOWN:a._move("nextPage",c);
break;
case f.UP:a._move("previous",c);
c.preventDefault();
break;
case f.DOWN:a._move("next",c);
c.preventDefault();
break;
case f.ENTER:case f.NUMPAD_ENTER:if(a.menu.active){g=true;
c.preventDefault();
}case f.TAB:if(!a.menu.active){return;
}a.menu.select(c);
break;
case f.ESCAPE:a.element.val(a.term);
a.close(c);
break;
default:clearTimeout(a.searching);
a.searching=setTimeout(function(){if(a.term!=a.element.val()){a.selectedItem=null;
a.search(null,c);
}},a.options.delay);
break;
}}}).bind("keypress.autocomplete",function(c){if(g){g=false;
c.preventDefault();
}}).bind("focus.autocomplete",function(){if(!a.options.disabled){a.selectedItem=null;
a.previous=a.element.val();
}}).bind("blur.autocomplete",function(c){if(!a.options.disabled){clearTimeout(a.searching);
a.closing=setTimeout(function(){a.close(c);
a._change(c);
},150);
}});
this._initSource();
this.response=function(){return a._response.apply(a,arguments);
};
this.menu=d("<ul></ul>").addClass("ui-autocomplete").appendTo(d(this.options.appendTo||"body",b)[0]).mousedown(function(c){var f=a.menu.element[0];
d(c.target).closest(".ui-menu-item").length||setTimeout(function(){d(document).one("mousedown",function(h){h.target!==a.element[0]&&h.target!==f&&!d.ui.contains(f,h.target)&&a.close();
});
},1);
setTimeout(function(){clearTimeout(a.closing);
},13);
}).menu({focus:function(c,f){f=f.item.data("item.autocomplete");
false!==a._trigger("focus",c,{item:f})&&/^key/.test(c.originalEvent.type)&&a.element.val(f.value);
},selected:function(c,f){var h=f.item.data("item.autocomplete"),i=a.previous;
if(a.element[0]!==b.activeElement){a.element.focus();
a.previous=i;
setTimeout(function(){a.previous=i;
a.selectedItem=h;
},1);
}false!==a._trigger("select",c,{item:h})&&a.element.val(h.value);
a.term=a.element.val();
a.close(c);
a.selectedItem=h;
},blur:function(){a.menu.element.is(":visible")&&a.element.val()!==a.term&&a.element.val(a.term);
}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");
d.fn.bgiframe&&this.menu.element.bgiframe();
},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
this.menu.element.remove();
d.Widget.prototype.destroy.call(this);
},_setOption:function(a,b){d.Widget.prototype._setOption.apply(this,arguments);
a==="source"&&this._initSource();
if(a==="appendTo"){this.menu.element.appendTo(d(b||"body",this.element[0].ownerDocument)[0]);
}a==="disabled"&&b&&this.xhr&&this.xhr.abort();
},_initSource:function(){var a=this,b,g;
if(d.isArray(this.options.source)){b=this.options.source;
this.source=function(c,f){f(d.ui.autocomplete.filter(b,c.term));
};
}else{if(typeof this.options.source==="string"){g=this.options.source;
this.source=function(c,f){a.xhr&&a.xhr.abort();
a.xhr=d.ajax({url:g,data:c,dataType:"json",autocompleteRequest:++e,success:function(h){this.autocompleteRequest===e&&f(h);
},error:function(){this.autocompleteRequest===e&&f([]);
}});
};
}else{this.source=this.options.source;
}}},search:function(a,b){a=a!=null?a:this.element.val();
this.term=this.element.val();
if(a.length<this.options.minLength){return this.close(b);
}clearTimeout(this.closing);
if(this._trigger("search",b)!==false){return this._search(a);
}},_search:function(a){this.pending++;
this.element.addClass("ui-autocomplete-loading");
this.source({term:a},this.response);
},_response:function(a){if(!this.options.disabled&&a&&a.length){a=this._normalize(a);
this._suggest(a);
this._trigger("open");
}else{this.close();
}this.pending--;
this.pending||this.element.removeClass("ui-autocomplete-loading");
},close:function(a){clearTimeout(this.closing);
if(this.menu.element.is(":visible")){this.menu.element.hide();
this.menu.deactivate();
this._trigger("close",a);
}},_change:function(a){this.previous!==this.element.val()&&this._trigger("change",a,{item:this.selectedItem});
},_normalize:function(a){if(a.length&&a[0].label&&a[0].value){return a;
}return d.map(a,function(b){if(typeof b==="string"){return{label:b,value:b};
}return d.extend({label:b.label||b.value,value:b.value||b.label},b);
});
},_suggest:function(a){var b=this.menu.element.empty().zIndex(this.element.zIndex()+1);
this._renderMenu(b,a);
this.menu.deactivate();
this.menu.refresh();
b.show();
this._resizeMenu();
b.position(d.extend({of:this.element},this.options.position));
this.options.autoFocus&&this.menu.next(new d.Event("mouseover"));
},_resizeMenu:function(){var a=this.menu.element;
a.outerWidth(Math.max(a.width("").outerWidth(),this.element.outerWidth()));
},_renderMenu:function(a,b){var g=this;
d.each(b,function(c,f){g._renderItem(a,f);
});
},_renderItem:function(a,b){return d("<li></li>").data("item.autocomplete",b).append(d("<a></a>").text(b.label)).appendTo(a);
},_move:function(a,b){if(this.menu.element.is(":visible")){if(this.menu.first()&&/^previous/.test(a)||this.menu.last()&&/^next/.test(a)){this.element.val(this.term);
this.menu.deactivate();
}else{this.menu[a](b);
}}else{this.search(null,b);
}},widget:function(){return this.menu.element;
}});
d.extend(d.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
},filter:function(a,b){var g=new RegExp(d.ui.autocomplete.escapeRegex(b),"i");
return d.grep(a,function(c){return g.test(c.label||c.value||c);
});
}});
})(jQuery);
(function(d){d.widget("ui.menu",{_create:function(){var e=this;
this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(a){if(d(a.target).closest(".ui-menu-item a").length){a.preventDefault();
e.select(a);
}});
this.refresh();
},refresh:function(){var e=this;
this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabindex",-1).mouseenter(function(a){e.activate(a,d(this).parent());
}).mouseleave(function(){e.deactivate();
});
},activate:function(e,a){this.deactivate();
if(this.hasScroll()){var b=a.offset().top-this.element.offset().top,g=this.element.scrollTop(),c=this.element.height();
if(b<0){this.element.scrollTop(g+b);
}else{b>=c&&this.element.scrollTop(g+b-c+a.height());
}}this.active=a.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();
this._trigger("focus",e,{item:a});
},deactivate:function(){if(this.active){this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
this._trigger("blur");
this.active=null;
}},next:function(e){this.move("next",".ui-menu-item:first",e);
},previous:function(e){this.move("prev",".ui-menu-item:last",e);
},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length;
},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length;
},move:function(e,a,b){if(this.active){e=this.active[e+"All"](".ui-menu-item").eq(0);
e.length?this.activate(b,e):this.activate(b,this.element.children(a));
}else{this.activate(b,this.element.children(a));
}},nextPage:function(e){if(this.hasScroll()){if(!this.active||this.last()){this.activate(e,this.element.children(".ui-menu-item:first"));
}else{var a=this.active.offset().top,b=this.element.height(),g=this.element.children(".ui-menu-item").filter(function(){var c=d(this).offset().top-a-b+d(this).height();
return c<10&&c>-10;
});
g.length||(g=this.element.children(".ui-menu-item:last"));
this.activate(e,g);
}}else{this.activate(e,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"));
}},previousPage:function(e){if(this.hasScroll()){if(!this.active||this.first()){this.activate(e,this.element.children(".ui-menu-item:last"));
}else{var a=this.active.offset().top,b=this.element.height();
result=this.element.children(".ui-menu-item").filter(function(){var g=d(this).offset().top-a+b-d(this).height();
return g<10&&g>-10;
});
result.length||(result=this.element.children(".ui-menu-item:first"));
this.activate(e,result);
}}else{this.activate(e,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"));
}},hasScroll:function(){return this.element.height()<this.element[d.fn.prop?"prop":"attr"]("scrollHeight");
},select:function(e){this._trigger("selected",e,{item:this.active});
}});
})(jQuery);
(function(a){var g,i=function(b){a(":ui-button",b.target.form).each(function(){var c=a(this).data("button");
setTimeout(function(){c.refresh();
},1);
});
},h=function(b){var c=b.name,d=b.form,f=a([]);
if(c){f=d?a(d).find("[name='"+c+"']"):a("[name='"+c+"']",b.ownerDocument).filter(function(){return !this.form;
});
}return f;
};
a.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",i);
if(typeof this.options.disabled!=="boolean"){this.options.disabled=this.element.attr("disabled");
}this._determineButtonType();
this.hasTitle=!!this.buttonElement.attr("title");
var b=this,c=this.options,d=this.type==="checkbox"||this.type==="radio",f="ui-state-hover"+(!d?" ui-state-active":"");
if(c.label===null){c.label=this.buttonElement.html();
}if(this.element.is(":disabled")){c.disabled=true;
}this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",function(){if(!c.disabled){a(this).addClass("ui-state-hover");
this===g&&a(this).addClass("ui-state-active");
}}).bind("mouseleave.button",function(){c.disabled||a(this).removeClass(f);
}).bind("focus.button",function(){a(this).addClass("ui-state-focus");
}).bind("blur.button",function(){a(this).removeClass("ui-state-focus");
}).bind("click.button",function(e){c.disabled&&e.stopImmediatePropagation();
});
d&&this.element.bind("change.button",function(){b.refresh();
});
if(this.type==="checkbox"){this.buttonElement.bind("click.button",function(){if(c.disabled){return false;
}a(this).toggleClass("ui-state-active");
b.buttonElement.attr("aria-pressed",b.element[0].checked);
});
}else{if(this.type==="radio"){this.buttonElement.bind("click.button",function(){if(c.disabled){return false;
}a(this).addClass("ui-state-active");
b.buttonElement.attr("aria-pressed",true);
var e=b.element[0];
h(e).not(e).map(function(){return a(this).button("widget")[0];
}).removeClass("ui-state-active").attr("aria-pressed",false);
});
}else{this.buttonElement.bind("mousedown.button",function(){if(c.disabled){return false;
}a(this).addClass("ui-state-active");
g=this;
a(document).one("mouseup",function(){g=null;
});
}).bind("mouseup.button",function(){if(c.disabled){return false;
}a(this).removeClass("ui-state-active");
}).bind("keydown.button",function(e){if(c.disabled){return false;
}if(e.keyCode==a.ui.keyCode.SPACE||e.keyCode==a.ui.keyCode.ENTER){a(this).addClass("ui-state-active");
}}).bind("keyup.button",function(){a(this).removeClass("ui-state-active");
});
this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===a.ui.keyCode.SPACE&&a(this).click();
});
}}this._setOption("disabled",c.disabled);
},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";
if(this.type==="checkbox"||this.type==="radio"){var b=this.element.parents().filter(":last"),c="label[for="+this.element.attr("id")+"]";
this.buttonElement=b.find(c);
if(!this.buttonElement.length){b=b.length?b.siblings():this.element.siblings();
this.buttonElement=b.filter(c);
if(!this.buttonElement.length){this.buttonElement=b.find(c);
}}this.element.addClass("ui-helper-hidden-accessible");
(b=this.element.is(":checked"))&&this.buttonElement.addClass("ui-state-active");
this.buttonElement.attr("aria-pressed",b);
}else{this.buttonElement=this.element;
}},widget:function(){return this.buttonElement;
},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");
this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
this.hasTitle||this.buttonElement.removeAttr("title");
a.Widget.prototype.destroy.call(this);
},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments);
if(b==="disabled"){c?this.element.attr("disabled",true):this.element.removeAttr("disabled");
}this._resetButton();
},refresh:function(){var b=this.element.is(":disabled");
b!==this.options.disabled&&this._setOption("disabled",b);
if(this.type==="radio"){h(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed",true):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false);
});
}else{if(this.type==="checkbox"){this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false);
}}},_resetButton:function(){if(this.type==="input"){this.options.label&&this.element.val(this.options.label);
}else{var b=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),c=a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,f=d.primary&&d.secondary,e=[];
if(d.primary||d.secondary){if(this.options.text){e.push("ui-button-text-icon"+(f?"s":d.primary?"-primary":"-secondary"));
}d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>");
d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>");
if(!this.options.text){e.push(f?"ui-button-icons-only":"ui-button-icon-only");
this.hasTitle||b.attr("title",c);
}}else{e.push("ui-button-text-only");
}b.addClass(e.join(" "));
}}});
a.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset");
},_init:function(){this.refresh();
},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c);
a.Widget.prototype._setOption.apply(this,arguments);
},refresh:function(){this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0];
}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end();
},destroy:function(){this.element.removeClass("ui-buttonset");
this.buttons.map(function(){return a(this).button("widget")[0];
}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
a.Widget.prototype.destroy.call(this);
}});
})(jQuery);
(function(c,l){var m={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},n={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true},o=c.attrFn||{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true,click:true};
c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,position:{my:"center",at:"center",collision:"fit",using:function(a){var b=c(this).css(a).offset().top;
b<0&&c(this).css("top",a.top-b);
}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1000},_create:function(){this.originalTitle=this.element.attr("title");
if(typeof this.originalTitle!=="string"){this.originalTitle="";
}this.options.title=this.options.title||this.originalTitle;
var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);
i.preventDefault();
}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i);
});
a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);
var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){h.addClass("ui-state-hover");
},function(){h.removeClass("ui-state-hover");
}).focus(function(){h.addClass("ui-state-focus");
}).blur(function(){h.removeClass("ui-state-focus");
}).click(function(i){a.close(i);
return false;
}).appendTo(f);
(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);
c("<span></span>").addClass("ui-dialog-title").attr("id",e).html(d).prependTo(f);
if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose)){b.beforeClose=b.beforeclose;
}f.find("*").add(f).disableSelection();
b.draggable&&c.fn.draggable&&a._makeDraggable();
b.resizable&&c.fn.resizable&&a._makeResizable();
a._createButtons(b.buttons);
a._isOpen=false;
c.fn.bgiframe&&g.bgiframe();
},_init:function(){this.options.autoOpen&&this.open();
},destroy:function(){var a=this;
a.overlay&&a.overlay.destroy();
a.uiDialog.hide();
a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");
a.uiDialog.remove();
a.originalTitle&&a.element.attr("title",a.originalTitle);
return a;
},widget:function(){return this.uiDialog;
},close:function(a){var b=this,d,e;
if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();
b.uiDialog.unbind("keypress.ui-dialog");
b._isOpen=false;
if(b.options.hide){b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a);
});
}else{b.uiDialog.hide();
b._trigger("close",a);
}c.ui.dialog.overlay.resize();
if(b.options.modal){d=0;
c(".ui-dialog").each(function(){if(this!==b.uiDialog[0]){e=c(this).css("z-index");
isNaN(e)||(d=Math.max(d,e));
}});
c.ui.dialog.maxZ=d;
}return b;
}},isOpen:function(){return this._isOpen;
},moveToTop:function(a,b){var d=this,e=d.options;
if(e.modal&&!a||!e.stack&&!e.modal){return d._trigger("focus",b);
}if(e.zIndex>c.ui.dialog.maxZ){c.ui.dialog.maxZ=e.zIndex;
}if(d.overlay){c.ui.dialog.maxZ+=1;
d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ);
}a={scrollTop:d.element.attr("scrollTop"),scrollLeft:d.element.attr("scrollLeft")};
c.ui.dialog.maxZ+=1;
d.uiDialog.css("z-index",c.ui.dialog.maxZ);
d.element.attr(a);
d._trigger("focus",b);
return d;
},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;
a.overlay=b.modal?new c.ui.dialog.overlay(a):null;
a._size();
a._position(b.position);
d.show(b.show);
a.moveToTop(true);
b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");
g=g.filter(":last");
if(e.target===g[0]&&!e.shiftKey){f.focus(1);
return false;
}else{if(e.target===f[0]&&e.shiftKey){g.focus(1);
return false;
}}}});
c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();
a._isOpen=true;
a._trigger("open");
return a;
}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);
b.uiDialog.find(".ui-dialog-buttonpane").remove();
typeof a==="object"&&a!==null&&c.each(a,function(){return !(d=true);
});
if(d){c.each(a,function(f,h){h=c.isFunction(h)?{click:h,text:f}:h;
var i=c('<button type="button"></button>').click(function(){h.click.apply(b.element[0],arguments);
}).appendTo(g);
c.each(h,function(j,k){if(j!=="click"){j in o?i[j](k):i.attr(j,k);
}});
c.fn.button&&i.button();
});
e.appendTo(b.uiDialog);
}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset};
}var b=this,d=b.options,e=c(document),g;
b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=d.height==="auto"?"auto":c(this).height();
c(this).height(c(this).height()).addClass("ui-dialog-dragging");
b._trigger("dragStart",f,a(h));
},drag:function(f,h){b._trigger("drag",f,a(h));
},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];
c(this).removeClass("ui-dialog-dragging").height(g);
b._trigger("dragStop",f,a(h));
c.ui.dialog.overlay.resize();
}});
},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,originalSize:f.originalSize,position:f.position,size:f.size};
}a=a===l?this.options.resizable:a;
var d=this,e=d.options,g=d.uiDialog.css("position");
a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";
d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");
d._trigger("resizeStart",f,b(h));
},resize:function(f,h){d._trigger("resize",f,b(h));
},stop:function(f,h){c(this).removeClass("ui-dialog-resizing");
e.height=c(this).height();
e.width=c(this).width();
d._trigger("resizeStop",f,b(h));
c.ui.dialog.overlay.resize();
}}).css("position",g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se");
},_minHeight:function(){var a=this.options;
return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height);
},_position:function(a){var b=[],d=[0,0],e;
if(a){if(typeof a==="string"||typeof a==="object"&&"0" in a){b=a.split?a.split(" "):[a[0],a[1]];
if(b.length===1){b[1]=b[0];
}c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];
b[g]=f;
}});
a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")};
}a=c.extend({},c.ui.dialog.prototype.options.position,a);
}else{a=c.ui.dialog.prototype.options.position;
}(e=this.uiDialog.is(":visible"))||this.uiDialog.show();
this.uiDialog.css({top:0,left:0}).position(c.extend({of:window},a));
e||this.uiDialog.hide();
},_setOptions:function(a){var b=this,d={},e=false;
c.each(a,function(g,f){b._setOption(g,f);
if(g in m){e=true;
}if(g in n){d[g]=f;
}});
e&&this._size();
this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d);
},_setOption:function(a,b){var d=this,e=d.uiDialog;
switch(a){case"beforeclose":a="beforeClose";
break;
case"buttons":d._createButtons(b);
break;
case"closeText":d.uiDialogTitlebarCloseText.text(""+b);
break;
case"dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);
break;
case"disabled":b?e.addClass("ui-dialog-disabled"):e.removeClass("ui-dialog-disabled");
break;
case"draggable":var g=e.is(":data(draggable)");
g&&!b&&e.draggable("destroy");
!g&&b&&d._makeDraggable();
break;
case"position":d._position(b);
break;
case"resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");
g&&typeof b==="string"&&e.resizable("option","handles",b);
!g&&b!==false&&d._makeResizable(b);
break;
case"title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));
break;
}c.Widget.prototype._setOption.apply(d,arguments);
},_size:function(){var a=this.options,b,d,e=this.uiDialog.is(":visible");
this.element.show().css({width:"auto",minHeight:0,height:0});
if(a.minWidth>a.width){a.width=a.minWidth;
}b=this.uiDialog.css({height:"auto",width:a.width}).height();
d=Math.max(0,a.minHeight-b);
if(a.height==="auto"){if(c.support.minHeight){this.element.css({minHeight:d,height:"auto"});
}else{this.uiDialog.show();
a=this.element.css("height","auto").height();
e||this.uiDialog.hide();
this.element.height(Math.max(a,d));
}}else{this.element.height(Math.max(a.height-b,0));
}this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight());
}});
c.extend(c.ui.dialog,{version:"1.8.13",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");
if(!a){this.uuid+=1;
a=this.uuid;
}return"ui-dialog-title-"+a;
},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a);
}});
c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay";
}).join(" "),create:function(a){if(this.instances.length===0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ){return false;
}});
},1);
c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);
d.preventDefault();
}});
c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize);
}var b=(this.oldInstances.pop()||c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});
c.fn.bgiframe&&b.bgiframe();
this.instances.push(b);
return b;
},destroy:function(a){var b=c.inArray(a,this.instances);
b!=-1&&this.oldInstances.push(this.instances.splice(b,1)[0]);
this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");
a.remove();
var d=0;
c.each(this.instances,function(){d=Math.max(d,this.css("z-index"));
});
this.maxZ=d;
},height:function(){var a,b;
if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);
return a<b?c(window).height()+"px":a+"px";
}else{return c(document).height()+"px";
}},width:function(){var a,b;
if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);
b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);
return a<b?c(window).width()+"px":a+"px";
}else{return c(document).width()+"px";
}},resize:function(){var a=c([]);
c.each(c.ui.dialog.overlay.instances,function(){a=a.add(this);
});
a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()});
}});
c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el);
}});
})(jQuery);
(function(d){d.widget("ui.slider",d.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var b=this,a=this.options,c=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f=a.values&&a.values.length||1,e=[];
this._mouseSliding=this._keySliding=false;
this._animateOff=true;
this._handleIndex=null;
this._detectOrientation();
this._mouseInit();
this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"+(a.disabled?" ui-slider-disabled ui-disabled":""));
this.range=d([]);
if(a.range){if(a.range===true){if(!a.values){a.values=[this._valueMin(),this._valueMin()];
}if(a.values.length&&a.values.length!==2){a.values=[a.values[0],a.values[0]];
}}this.range=d("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(a.range==="min"||a.range==="max"?" ui-slider-range-"+a.range:""));
}for(var j=c.length;
j<f;
j+=1){e.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
}this.handles=c.add(d(e.join("")).appendTo(b.element));
this.handle=this.handles.eq(0);
this.handles.add(this.range).filter("a").click(function(g){g.preventDefault();
}).hover(function(){a.disabled||d(this).addClass("ui-state-hover");
},function(){d(this).removeClass("ui-state-hover");
}).focus(function(){if(a.disabled){d(this).blur();
}else{d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
d(this).addClass("ui-state-focus");
}}).blur(function(){d(this).removeClass("ui-state-focus");
});
this.handles.each(function(g){d(this).data("index.ui-slider-handle",g);
});
this.handles.keydown(function(g){var k=true,l=d(this).data("index.ui-slider-handle"),i,h,m;
if(!b.options.disabled){switch(g.keyCode){case d.ui.keyCode.HOME:case d.ui.keyCode.END:case d.ui.keyCode.PAGE_UP:case d.ui.keyCode.PAGE_DOWN:case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:k=false;
if(!b._keySliding){b._keySliding=true;
d(this).addClass("ui-state-active");
i=b._start(g,l);
if(i===false){return;
}}break;
}m=b.options.step;
i=b.options.values&&b.options.values.length?(h=b.values(l)):(h=b.value());
switch(g.keyCode){case d.ui.keyCode.HOME:h=b._valueMin();
break;
case d.ui.keyCode.END:h=b._valueMax();
break;
case d.ui.keyCode.PAGE_UP:h=b._trimAlignValue(i+(b._valueMax()-b._valueMin())/5);
break;
case d.ui.keyCode.PAGE_DOWN:h=b._trimAlignValue(i-(b._valueMax()-b._valueMin())/5);
break;
case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:if(i===b._valueMax()){return;
}h=b._trimAlignValue(i+m);
break;
case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:if(i===b._valueMin()){return;
}h=b._trimAlignValue(i-m);
break;
}b._slide(g,l,h);
return k;
}}).keyup(function(g){var k=d(this).data("index.ui-slider-handle");
if(b._keySliding){b._keySliding=false;
b._stop(g,k);
b._change(g,k);
d(this).removeClass("ui-state-active");
}});
this._refreshValue();
this._animateOff=false;
},destroy:function(){this.handles.remove();
this.range.remove();
this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
this._mouseDestroy();
return this;
},_mouseCapture:function(b){var a=this.options,c,f,e,j,g;
if(a.disabled){return false;
}this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};
this.elementOffset=this.element.offset();
c=this._normValueFromMouse({x:b.pageX,y:b.pageY});
f=this._valueMax()-this._valueMin()+1;
j=this;
this.handles.each(function(k){var l=Math.abs(c-j.values(k));
if(f>l){f=l;
e=d(this);
g=k;
}});
if(a.range===true&&this.values(1)===a.min){g+=1;
e=d(this.handles[g]);
}if(this._start(b,g)===false){return false;
}this._mouseSliding=true;
j._handleIndex=g;
e.addClass("ui-state-active").focus();
a=e.offset();
this._clickOffset=!d(b.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:b.pageX-a.left-e.width()/2,top:b.pageY-a.top-e.height()/2-(parseInt(e.css("borderTopWidth"),10)||0)-(parseInt(e.css("borderBottomWidth"),10)||0)+(parseInt(e.css("marginTop"),10)||0)};
this.handles.hasClass("ui-state-hover")||this._slide(b,g,c);
return this._animateOff=true;
},_mouseStart:function(){return true;
},_mouseDrag:function(b){var a=this._normValueFromMouse({x:b.pageX,y:b.pageY});
this._slide(b,this._handleIndex,a);
return false;
},_mouseStop:function(b){this.handles.removeClass("ui-state-active");
this._mouseSliding=false;
this._stop(b,this._handleIndex);
this._change(b,this._handleIndex);
this._clickOffset=this._handleIndex=null;
return this._animateOff=false;
},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal";
},_normValueFromMouse:function(b){var a;
if(this.orientation==="horizontal"){a=this.elementSize.width;
b=b.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0);
}else{a=this.elementSize.height;
b=b.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0);
}a=b/a;
if(a>1){a=1;
}if(a<0){a=0;
}if(this.orientation==="vertical"){a=1-a;
}b=this._valueMax()-this._valueMin();
return this._trimAlignValue(this._valueMin()+a*b);
},_start:function(b,a){var c={handle:this.handles[a],value:this.value()};
if(this.options.values&&this.options.values.length){c.value=this.values(a);
c.values=this.values();
}return this._trigger("start",b,c);
},_slide:function(b,a,c){var f;
if(this.options.values&&this.options.values.length){f=this.values(a?0:1);
if(this.options.values.length===2&&this.options.range===true&&(a===0&&c>f||a===1&&c<f)){c=f;
}if(c!==this.values(a)){f=this.values();
f[a]=c;
b=this._trigger("slide",b,{handle:this.handles[a],value:c,values:f});
this.values(a?0:1);
b!==false&&this.values(a,c,true);
}}else{if(c!==this.value()){b=this._trigger("slide",b,{handle:this.handles[a],value:c});
b!==false&&this.value(c);
}}},_stop:function(b,a){var c={handle:this.handles[a],value:this.value()};
if(this.options.values&&this.options.values.length){c.value=this.values(a);
c.values=this.values();
}this._trigger("stop",b,c);
},_change:function(b,a){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[a],value:this.value()};
if(this.options.values&&this.options.values.length){c.value=this.values(a);
c.values=this.values();
}this._trigger("change",b,c);
}},value:function(b){if(arguments.length){this.options.value=this._trimAlignValue(b);
this._refreshValue();
this._change(null,0);
}else{return this._value();
}},values:function(b,a){var c,f,e;
if(arguments.length>1){this.options.values[b]=this._trimAlignValue(a);
this._refreshValue();
this._change(null,b);
}else{if(arguments.length){if(d.isArray(arguments[0])){c=this.options.values;
f=arguments[0];
for(e=0;
e<c.length;
e+=1){c[e]=this._trimAlignValue(f[e]);
this._change(null,e);
}this._refreshValue();
}else{return this.options.values&&this.options.values.length?this._values(b):this.value();
}}else{return this._values();
}}},_setOption:function(b,a){var c,f=0;
if(d.isArray(this.options.values)){f=this.options.values.length;
}d.Widget.prototype._setOption.apply(this,arguments);
switch(b){case"disabled":if(a){this.handles.filter(".ui-state-focus").blur();
this.handles.removeClass("ui-state-hover");
this.handles.attr("disabled","disabled");
this.element.addClass("ui-disabled");
}else{this.handles.removeAttr("disabled");
this.element.removeClass("ui-disabled");
}break;
case"orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);
this._refreshValue();
break;
case"value":this._animateOff=true;
this._refreshValue();
this._change(null,0);
this._animateOff=false;
break;
case"values":this._animateOff=true;
this._refreshValue();
for(c=0;
c<f;
c+=1){this._change(null,c);
}this._animateOff=false;
break;
}},_value:function(){var b=this.options.value;
return b=this._trimAlignValue(b);
},_values:function(b){var a,c;
if(arguments.length){a=this.options.values[b];
return a=this._trimAlignValue(a);
}else{a=this.options.values.slice();
for(c=0;
c<a.length;
c+=1){a[c]=this._trimAlignValue(a[c]);
}return a;
}},_trimAlignValue:function(b){if(b<=this._valueMin()){return this._valueMin();
}if(b>=this._valueMax()){return this._valueMax();
}var a=this.options.step>0?this.options.step:1,c=(b-this._valueMin())%a;
alignValue=b-c;
if(Math.abs(c)*2>=a){alignValue+=c>0?a:-a;
}return parseFloat(alignValue.toFixed(5));
},_valueMin:function(){return this.options.min;
},_valueMax:function(){return this.options.max;
},_refreshValue:function(){var b=this.options.range,a=this.options,c=this,f=!this._animateOff?a.animate:false,e,j={},g,k,l,i;
if(this.options.values&&this.options.values.length){this.handles.each(function(h){e=(c.values(h)-c._valueMin())/(c._valueMax()-c._valueMin())*100;
j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";
d(this).stop(1,1)[f?"animate":"css"](j,a.animate);
if(c.options.range===true){if(c.orientation==="horizontal"){if(h===0){c.range.stop(1,1)[f?"animate":"css"]({left:e+"%"},a.animate);
}if(h===1){c.range[f?"animate":"css"]({width:e-g+"%"},{queue:false,duration:a.animate});
}}else{if(h===0){c.range.stop(1,1)[f?"animate":"css"]({bottom:e+"%"},a.animate);
}if(h===1){c.range[f?"animate":"css"]({height:e-g+"%"},{queue:false,duration:a.animate});
}}}g=e;
});
}else{k=this.value();
l=this._valueMin();
i=this._valueMax();
e=i!==l?(k-l)/(i-l)*100:0;
j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";
this.handle.stop(1,1)[f?"animate":"css"](j,a.animate);
if(b==="min"&&this.orientation==="horizontal"){this.range.stop(1,1)[f?"animate":"css"]({width:e+"%"},a.animate);
}if(b==="max"&&this.orientation==="horizontal"){this.range[f?"animate":"css"]({width:100-e+"%"},{queue:false,duration:a.animate});
}if(b==="min"&&this.orientation==="vertical"){this.range.stop(1,1)[f?"animate":"css"]({height:e+"%"},a.animate);
}if(b==="max"&&this.orientation==="vertical"){this.range[f?"animate":"css"]({height:100-e+"%"},{queue:false,duration:a.animate});
}}}});
d.extend(d.ui.slider,{version:"1.8.13"});
})(jQuery);
(function(d,p){function u(){return ++v;
}function w(){return ++x;
}var v=0,x=0;
d.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true);
},_setOption:function(b,e){if(b=="selected"){this.options.collapsible&&e==this.options.selected||this.select(e);
}else{this.options[b]=e;
this._tabify();
}},_tabId:function(b){return b.title&&b.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+u();
},_sanitizeSelector:function(b){return b.replace(/:/g,"\\:");
},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+w());
return d.cookie.apply(null,[b].concat(d.makeArray(arguments)));
},_ui:function(b,e){return{tab:b,panel:e,index:this.anchors.index(b)};
},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=d(this);
b.html(b.data("label.tabs")).removeData("label.tabs");
});
},_tabify:function(b){function e(g,f){g.css("display","");
!d.support.opacity&&f.opacity&&g[0].style.removeAttribute("filter");
}var a=this,c=this.options,h=/^#.+/;
this.list=this.element.find("ol,ul").eq(0);
this.lis=d(" > li:has(a[href])",this.list);
this.anchors=this.lis.map(function(){return d("a",this)[0];
});
this.panels=d([]);
this.anchors.each(function(g,f){var i=d(f).attr("href"),l=i.split("#")[0],q;
if(l&&(l===location.toString().split("#")[0]||(q=d("base")[0])&&l===q.href)){i=f.hash;
f.href=i;
}if(h.test(i)){a.panels=a.panels.add(a.element.find(a._sanitizeSelector(i)));
}else{if(i&&i!=="#"){d.data(f,"href.tabs",i);
d.data(f,"load.tabs",i.replace(/#.*$/,""));
i=a._tabId(f);
f.href="#"+i;
f=a.element.find("#"+i);
if(!f.length){f=d(c.panelTemplate).attr("id",i).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(a.panels[g-1]||a.list);
f.data("destroy.tabs",true);
}a.panels=a.panels.add(f);
}else{c.disabled.push(g);
}}});
if(b){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
this.lis.addClass("ui-state-default ui-corner-top");
this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");
if(c.selected===p){location.hash&&this.anchors.each(function(g,f){if(f.hash==location.hash){c.selected=g;
return false;
}});
if(typeof c.selected!=="number"&&c.cookie){c.selected=parseInt(a._cookie(),10);
}if(typeof c.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length){c.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
}c.selected=c.selected||(this.lis.length?0:-1);
}else{if(c.selected===null){c.selected=-1;
}}c.selected=c.selected>=0&&this.anchors[c.selected]||c.selected<0?c.selected:0;
c.disabled=d.unique(c.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"),function(g){return a.lis.index(g);
}))).sort();
d.inArray(c.selected,c.disabled)!=-1&&c.disabled.splice(d.inArray(c.selected,c.disabled),1);
this.panels.addClass("ui-tabs-hide");
this.lis.removeClass("ui-tabs-selected ui-state-active");
if(c.selected>=0&&this.anchors.length){a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash)).removeClass("ui-tabs-hide");
this.lis.eq(c.selected).addClass("ui-tabs-selected ui-state-active");
a.element.queue("tabs",function(){a._trigger("show",null,a._ui(a.anchors[c.selected],a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash))[0]));
});
this.load(c.selected);
}d(window).bind("unload",function(){a.lis.add(a.anchors).unbind(".tabs");
a.lis=a.anchors=a.panels=null;
});
}else{c.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
}this.element[c.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");
c.cookie&&this._cookie(c.selected,c.cookie);
b=0;
for(var j;
j=this.lis[b];
b++){d(j)[d.inArray(b,c.disabled)!=-1&&!d(j).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");
}c.cache===false&&this.anchors.removeData("cache.tabs");
this.lis.add(this.anchors).unbind(".tabs");
if(c.event!=="mouseover"){var k=function(g,f){f.is(":not(.ui-state-disabled)")&&f.addClass("ui-state-"+g);
},n=function(g,f){f.removeClass("ui-state-"+g);
};
this.lis.bind("mouseover.tabs",function(){k("hover",d(this));
});
this.lis.bind("mouseout.tabs",function(){n("hover",d(this));
});
this.anchors.bind("focus.tabs",function(){k("focus",d(this).closest("li"));
});
this.anchors.bind("blur.tabs",function(){n("focus",d(this).closest("li"));
});
}var m,o;
if(c.fx){if(d.isArray(c.fx)){m=c.fx[0];
o=c.fx[1];
}else{m=o=c.fx;
}}var r=o?function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");
f.hide().removeClass("ui-tabs-hide").animate(o,o.duration||"normal",function(){e(f,o);
a._trigger("show",null,a._ui(g,f[0]));
});
}:function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");
f.removeClass("ui-tabs-hide");
a._trigger("show",null,a._ui(g,f[0]));
},s=m?function(g,f){f.animate(m,m.duration||"normal",function(){a.lis.removeClass("ui-tabs-selected ui-state-active");
f.addClass("ui-tabs-hide");
e(f,m);
a.element.dequeue("tabs");
});
}:function(g,f){a.lis.removeClass("ui-tabs-selected ui-state-active");
f.addClass("ui-tabs-hide");
a.element.dequeue("tabs");
};
this.anchors.bind(c.event+".tabs",function(){var g=this,f=d(g).closest("li"),i=a.panels.filter(":not(.ui-tabs-hide)"),l=a.element.find(a._sanitizeSelector(g.hash));
if(f.hasClass("ui-tabs-selected")&&!c.collapsible||f.hasClass("ui-state-disabled")||f.hasClass("ui-state-processing")||a.panels.filter(":animated").length||a._trigger("select",null,a._ui(this,l[0]))===false){this.blur();
return false;
}c.selected=a.anchors.index(this);
a.abort();
if(c.collapsible){if(f.hasClass("ui-tabs-selected")){c.selected=-1;
c.cookie&&a._cookie(c.selected,c.cookie);
a.element.queue("tabs",function(){s(g,i);
}).dequeue("tabs");
this.blur();
return false;
}else{if(!i.length){c.cookie&&a._cookie(c.selected,c.cookie);
a.element.queue("tabs",function(){r(g,l);
});
a.load(a.anchors.index(this));
this.blur();
return false;
}}}c.cookie&&a._cookie(c.selected,c.cookie);
if(l.length){i.length&&a.element.queue("tabs",function(){s(g,i);
});
a.element.queue("tabs",function(){r(g,l);
});
a.load(a.anchors.index(this));
}else{throw"jQuery UI Tabs: Mismatching fragment identifier.";
}d.browser.msie&&this.blur();
});
this.anchors.bind("click.tabs",function(){return false;
});
},_getIndex:function(b){if(typeof b=="string"){b=this.anchors.index(this.anchors.filter("[href$="+b+"]"));
}return b;
},destroy:function(){var b=this.options;
this.abort();
this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");
this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
this.anchors.each(function(){var e=d.data(this,"href.tabs");
if(e){this.href=e;
}var a=d(this).unbind(".tabs");
d.each(["href","load","cache"],function(c,h){a.removeData(h+".tabs");
});
});
this.lis.unbind(".tabs").add(this.panels).each(function(){d.data(this,"destroy.tabs")?d(this).remove():d(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");
});
b.cookie&&this._cookie(null,b.cookie);
return this;
},add:function(b,e,a){if(a===p){a=this.anchors.length;
}var c=this,h=this.options;
e=d(h.tabTemplate.replace(/#\{href\}/g,b).replace(/#\{label\}/g,e));
b=!b.indexOf("#")?b.replace("#",""):this._tabId(d("a",e)[0]);
e.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);
var j=c.element.find("#"+b);
j.length||(j=d(h.panelTemplate).attr("id",b).data("destroy.tabs",true));
j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");
if(a>=this.lis.length){e.appendTo(this.list);
j.appendTo(this.list[0].parentNode);
}else{e.insertBefore(this.lis[a]);
j.insertBefore(this.panels[a]);
}h.disabled=d.map(h.disabled,function(k){return k>=a?++k:k;
});
this._tabify();
if(this.anchors.length==1){h.selected=0;
e.addClass("ui-tabs-selected ui-state-active");
j.removeClass("ui-tabs-hide");
this.element.queue("tabs",function(){c._trigger("show",null,c._ui(c.anchors[0],c.panels[0]));
});
this.load(0);
}this._trigger("add",null,this._ui(this.anchors[a],this.panels[a]));
return this;
},remove:function(b){b=this._getIndex(b);
var e=this.options,a=this.lis.eq(b).remove(),c=this.panels.eq(b).remove();
if(a.hasClass("ui-tabs-selected")&&this.anchors.length>1){this.select(b+(b+1<this.anchors.length?1:-1));
}e.disabled=d.map(d.grep(e.disabled,function(h){return h!=b;
}),function(h){return h>=b?--h:h;
});
this._tabify();
this._trigger("remove",null,this._ui(a.find("a")[0],c[0]));
return this;
},enable:function(b){b=this._getIndex(b);
var e=this.options;
if(d.inArray(b,e.disabled)!=-1){this.lis.eq(b).removeClass("ui-state-disabled");
e.disabled=d.grep(e.disabled,function(a){return a!=b;
});
this._trigger("enable",null,this._ui(this.anchors[b],this.panels[b]));
return this;
}},disable:function(b){b=this._getIndex(b);
var e=this.options;
if(b!=e.selected){this.lis.eq(b).addClass("ui-state-disabled");
e.disabled.push(b);
e.disabled.sort();
this._trigger("disable",null,this._ui(this.anchors[b],this.panels[b]));
}return this;
},select:function(b){b=this._getIndex(b);
if(b==-1){if(this.options.collapsible&&this.options.selected!=-1){b=this.options.selected;
}else{return this;
}}this.anchors.eq(b).trigger(this.options.event+".tabs");
return this;
},load:function(b){b=this._getIndex(b);
var e=this,a=this.options,c=this.anchors.eq(b)[0],h=d.data(c,"load.tabs");
this.abort();
if(!h||this.element.queue("tabs").length!==0&&d.data(c,"cache.tabs")){this.element.dequeue("tabs");
}else{this.lis.eq(b).addClass("ui-state-processing");
if(a.spinner){var j=d("span",c);
j.data("label.tabs",j.html()).html(a.spinner);
}this.xhr=d.ajax(d.extend({},a.ajaxOptions,{url:h,success:function(k,n){e.element.find(e._sanitizeSelector(c.hash)).html(k);
e._cleanup();
a.cache&&d.data(c,"cache.tabs",true);
e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));
try{a.ajaxOptions.success(k,n);
}catch(m){}},error:function(k,n){e._cleanup();
e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));
try{a.ajaxOptions.error(k,n,b,c);
}catch(m){}}}));
e.element.dequeue("tabs");
return this;
}},abort:function(){this.element.queue([]);
this.panels.stop(false,true);
this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));
if(this.xhr){this.xhr.abort();
delete this.xhr;
}this._cleanup();
return this;
},url:function(b,e){this.anchors.eq(b).removeData("cache.tabs").data("load.tabs",e);
return this;
},length:function(){return this.anchors.length;
}});
d.extend(d.ui.tabs,{version:"1.8.13"});
d.extend(d.ui.tabs.prototype,{rotation:null,rotate:function(b,e){var a=this,c=this.options,h=a._rotate||(a._rotate=function(j){clearTimeout(a.rotation);
a.rotation=setTimeout(function(){var k=c.selected;
a.select(++k<a.anchors.length?k:0);
},b);
j&&j.stopPropagation();
});
e=a._unrotate||(a._unrotate=!e?function(j){j.clientX&&a.rotate(null);
}:function(){t=c.selected;
h();
});
if(b){this.element.bind("tabsshow",h);
this.anchors.bind(c.event+".tabs",e);
h();
}else{clearTimeout(a.rotation);
this.element.unbind("tabsshow",h);
this.anchors.unbind(c.event+".tabs",e);
delete this._rotate;
delete this._unrotate;
}return this;
}});
})(jQuery);
(function(d,B){function M(){this.debug=false;
this._curInst=null;
this._keyEvent=false;
this._disabledInputs=[];
this._inDialog=this._datepickerShowing=false;
this._mainDivId="ui-datepicker-div";
this._inlineClass="ui-datepicker-inline";
this._appendClass="ui-datepicker-append";
this._triggerClass="ui-datepicker-trigger";
this._dialogClass="ui-datepicker-dialog";
this._disableClass="ui-datepicker-disabled";
this._unselectableClass="ui-datepicker-unselectable";
this._currentClass="ui-datepicker-current-day";
this._dayOverClass="ui-datepicker-days-cell-over";
this.regional=[];
this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};
this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false};
d.extend(this._defaults,this.regional[""]);
this.dpDiv=N(d('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
}function N(a){return a.delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a","mouseout",function(){d(this).removeClass("ui-state-hover");
this.className.indexOf("ui-datepicker-prev")!=-1&&d(this).removeClass("ui-datepicker-prev-hover");
this.className.indexOf("ui-datepicker-next")!=-1&&d(this).removeClass("ui-datepicker-next-hover");
}).delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a","mouseover",function(){if(!d.datepicker._isDisabledDatepicker(J.inline?a.parent()[0]:J.input[0])){d(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
d(this).addClass("ui-state-hover");
this.className.indexOf("ui-datepicker-prev")!=-1&&d(this).addClass("ui-datepicker-prev-hover");
this.className.indexOf("ui-datepicker-next")!=-1&&d(this).addClass("ui-datepicker-next-hover");
}});
}function H(a,b){d.extend(a,b);
for(var c in b){if(b[c]==null||b[c]==B){a[c]=b[c];
}}return a;
}d.extend(d.ui,{datepicker:{version:"1.8.13"}});
var z=(new Date).getTime(),J;
d.extend(M.prototype,{markerClassName:"hasDatepicker",log:function(){this.debug&&console.log.apply("",arguments);
},_widgetDatepicker:function(){return this.dpDiv;
},setDefaults:function(a){H(this._defaults,a||{});
return this;
},_attachDatepicker:function(a,b){var c=null;
for(var e in this._defaults){var f=a.getAttribute("date:"+e);
if(f){c=c||{};
try{c[e]=eval(f);
}catch(h){c[e]=f;
}}}e=a.nodeName.toLowerCase();
f=e=="div"||e=="span";
if(!a.id){this.uuid+=1;
a.id="dp"+this.uuid;
}var i=this._newInst(d(a),f);
i.settings=d.extend({},b||{},c||{});
if(e=="input"){this._connectDatepicker(a,i);
}else{f&&this._inlineDatepicker(a,i);
}},_newInst:function(a,b){return{id:a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1"),input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:!b?this.dpDiv:N(d('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))};
},_connectDatepicker:function(a,b){var c=d(a);
b.append=d([]);
b.trigger=d([]);
if(!c.hasClass(this.markerClassName)){this._attachments(c,b);
c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(e,f,h){b.settings[f]=h;
}).bind("getData.datepicker",function(e,f){return this._get(b,f);
});
this._autoSize(b);
d.data(a,"datepicker",b);
}},_attachments:function(a,b){var c=this._get(b,"appendText"),e=this._get(b,"isRTL");
b.append&&b.append.remove();
if(c){b.append=d('<span class="'+this._appendClass+'">'+c+"</span>");
a[e?"before":"after"](b.append);
}a.unbind("focus",this._showDatepicker);
b.trigger&&b.trigger.remove();
c=this._get(b,"showOn");
if(c=="focus"||c=="both"){a.focus(this._showDatepicker);
}if(c=="button"||c=="both"){c=this._get(b,"buttonText");
var f=this._get(b,"buttonImage");
b.trigger=d(this._get(b,"buttonImageOnly")?d("<img/>").addClass(this._triggerClass).attr({src:f,alt:c,title:c}):d('<button type="button"></button>').addClass(this._triggerClass).html(f==""?c:d("<img/>").attr({src:f,alt:c,title:c})));
a[e?"before":"after"](b.trigger);
b.trigger.click(function(){d.datepicker._datepickerShowing&&d.datepicker._lastInput==a[0]?d.datepicker._hideDatepicker():d.datepicker._showDatepicker(a[0]);
return false;
});
}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");
if(c.match(/[DM]/)){var e=function(f){for(var h=0,i=0,g=0;
g<f.length;
g++){if(f[g].length>h){h=f[g].length;
i=g;
}}return i;
};
b.setMonth(e(this._get(a,c.match(/MM/)?"monthNames":"monthNamesShort")));
b.setDate(e(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay());
}a.input.attr("size",this._formatDate(a,b).length);
}},_inlineDatepicker:function(a,b){var c=d(a);
if(!c.hasClass(this.markerClassName)){c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(e,f,h){b.settings[f]=h;
}).bind("getData.datepicker",function(e,f){return this._get(b,f);
});
d.data(a,"datepicker",b);
this._setDate(b,this._getDefaultDate(b),true);
this._updateDatepicker(b);
this._updateAlternate(b);
b.dpDiv.show();
}},_dialogDatepicker:function(a,b,c,e,f){a=this._dialogInst;
if(!a){this.uuid+=1;
this._dialogInput=d('<input type="text" id="'+("dp"+this.uuid)+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
this._dialogInput.keydown(this._doKeyDown);
d("body").append(this._dialogInput);
a=this._dialogInst=this._newInst(this._dialogInput,false);
a.settings={};
d.data(this._dialogInput[0],"datepicker",a);
}H(a.settings,e||{});
b=b&&b.constructor==Date?this._formatDate(a,b):b;
this._dialogInput.val(b);
this._pos=f?f.length?f:[f.pageX,f.pageY]:null;
if(!this._pos){this._pos=[document.documentElement.clientWidth/2-100+(document.documentElement.scrollLeft||document.body.scrollLeft),document.documentElement.clientHeight/2-150+(document.documentElement.scrollTop||document.body.scrollTop)];
}this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px");
a.settings.onSelect=c;
this._inDialog=true;
this.dpDiv.addClass(this._dialogClass);
this._showDatepicker(this._dialogInput[0]);
d.blockUI&&d.blockUI(this.dpDiv);
d.data(this._dialogInput[0],"datepicker",a);
return this;
},_destroyDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");
if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();
d.removeData(a,"datepicker");
if(e=="input"){c.append.remove();
c.trigger.remove();
b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp);
}else{if(e=="div"||e=="span"){b.removeClass(this.markerClassName).empty();
}}}},_enableDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");
if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();
if(e=="input"){a.disabled=false;
c.trigger.filter("button").each(function(){this.disabled=false;
}).end().filter("img").css({opacity:"1.0",cursor:""});
}else{if(e=="div"||e=="span"){b=b.children("."+this._inlineClass);
b.children().removeClass("ui-state-disabled");
b.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled");
}}this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f;
});
}},_disableDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");
if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();
if(e=="input"){a.disabled=true;
c.trigger.filter("button").each(function(){this.disabled=true;
}).end().filter("img").css({opacity:"0.5",cursor:"default"});
}else{if(e=="div"||e=="span"){b=b.children("."+this._inlineClass);
b.children().addClass("ui-state-disabled");
b.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled");
}}this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f;
});
this._disabledInputs[this._disabledInputs.length]=a;
}},_isDisabledDatepicker:function(a){if(!a){return false;
}for(var b=0;
b<this._disabledInputs.length;
b++){if(this._disabledInputs[b]==a){return true;
}}return false;
},_getInst:function(a){try{return d.data(a,"datepicker");
}catch(b){throw"Missing instance data for this datepicker";
}},_optionDatepicker:function(a,b,c){var e=this._getInst(a);
if(arguments.length==2&&typeof b=="string"){return b=="defaults"?d.extend({},d.datepicker._defaults):e?b=="all"?d.extend({},e.settings):this._get(e,b):null;
}var f=b||{};
if(typeof b=="string"){f={};
f[b]=c;
}if(e){this._curInst==e&&this._hideDatepicker();
var h=this._getDateDatepicker(a,true),i=this._getMinMaxDate(e,"min"),g=this._getMinMaxDate(e,"max");
H(e.settings,f);
if(i!==null&&f.dateFormat!==B&&f.minDate===B){e.settings.minDate=this._formatDate(e,i);
}if(g!==null&&f.dateFormat!==B&&f.maxDate===B){e.settings.maxDate=this._formatDate(e,g);
}this._attachments(d(a),e);
this._autoSize(e);
this._setDate(e,h);
this._updateAlternate(e);
this._updateDatepicker(e);
}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c);
},_refreshDatepicker:function(a){(a=this._getInst(a))&&this._updateDatepicker(a);
},_setDateDatepicker:function(a,b){if(a=this._getInst(a)){this._setDate(a,b);
this._updateDatepicker(a);
this._updateAlternate(a);
}},_getDateDatepicker:function(a,b){(a=this._getInst(a))&&!a.inline&&this._setDateFromField(a,b);
return a?this._getDate(a):null;
},_doKeyDown:function(a){var b=d.datepicker._getInst(a.target),c=true,e=b.dpDiv.is(".ui-datepicker-rtl");
b._keyEvent=true;
if(d.datepicker._datepickerShowing){switch(a.keyCode){case 9:d.datepicker._hideDatepicker();
c=false;
break;
case 13:c=d("td."+d.datepicker._dayOverClass+":not(."+d.datepicker._currentClass+")",b.dpDiv);
c[0]?d.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,c[0]):d.datepicker._hideDatepicker();
return false;
case 27:d.datepicker._hideDatepicker();
break;
case 33:d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");
break;
case 34:d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,"stepMonths"),"M");
break;
case 35:if(a.ctrlKey||a.metaKey){d.datepicker._clearDate(a.target);
}c=a.ctrlKey||a.metaKey;
break;
case 36:if(a.ctrlKey||a.metaKey){d.datepicker._gotoToday(a.target);
}c=a.ctrlKey||a.metaKey;
break;
case 37:if(a.ctrlKey||a.metaKey){d.datepicker._adjustDate(a.target,e?+1:-1,"D");
}c=a.ctrlKey||a.metaKey;
if(a.originalEvent.altKey){d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");
}break;
case 38:if(a.ctrlKey||a.metaKey){d.datepicker._adjustDate(a.target,-7,"D");
}c=a.ctrlKey||a.metaKey;
break;
case 39:if(a.ctrlKey||a.metaKey){d.datepicker._adjustDate(a.target,e?-1:+1,"D");
}c=a.ctrlKey||a.metaKey;
if(a.originalEvent.altKey){d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,"stepMonths"),"M");
}break;
case 40:if(a.ctrlKey||a.metaKey){d.datepicker._adjustDate(a.target,+7,"D");
}c=a.ctrlKey||a.metaKey;
break;
default:c=false;
}}else{if(a.keyCode==36&&a.ctrlKey){d.datepicker._showDatepicker(this);
}else{c=false;
}}if(c){a.preventDefault();
a.stopPropagation();
}},_doKeyPress:function(a){var b=d.datepicker._getInst(a.target);
if(d.datepicker._get(b,"constrainInput")){b=d.datepicker._possibleChars(d.datepicker._get(b,"dateFormat"));
var c=String.fromCharCode(a.charCode==B?a.keyCode:a.charCode);
return a.ctrlKey||a.metaKey||c<" "||!b||b.indexOf(c)>-1;
}},_doKeyUp:function(a){a=d.datepicker._getInst(a.target);
if(a.input.val()!=a.lastVal){try{if(d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,d.datepicker._getFormatConfig(a))){d.datepicker._setDateFromField(a);
d.datepicker._updateAlternate(a);
d.datepicker._updateDatepicker(a);
}}catch(b){d.datepicker.log(b);
}}return true;
},_showDatepicker:function(a){a=a.target||a;
if(a.nodeName.toLowerCase()!="input"){a=d("input",a.parentNode)[0];
}if(!(d.datepicker._isDisabledDatepicker(a)||d.datepicker._lastInput==a)){var b=d.datepicker._getInst(a);
d.datepicker._curInst&&d.datepicker._curInst!=b&&d.datepicker._curInst.dpDiv.stop(true,true);
var c=d.datepicker._get(b,"beforeShow");
H(b.settings,c?c.apply(a,[a,b]):{});
b.lastVal=null;
d.datepicker._lastInput=a;
d.datepicker._setDateFromField(b);
if(d.datepicker._inDialog){a.value="";
}if(!d.datepicker._pos){d.datepicker._pos=d.datepicker._findPos(a);
d.datepicker._pos[1]+=a.offsetHeight;
}var e=false;
d(a).parents().each(function(){e|=d(this).css("position")=="fixed";
return !e;
});
if(e&&d.browser.opera){d.datepicker._pos[0]-=document.documentElement.scrollLeft;
d.datepicker._pos[1]-=document.documentElement.scrollTop;
}c={left:d.datepicker._pos[0],top:d.datepicker._pos[1]};
d.datepicker._pos=null;
b.dpDiv.empty();
b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});
d.datepicker._updateDatepicker(b);
c=d.datepicker._checkOffset(b,c,e);
b.dpDiv.css({position:d.datepicker._inDialog&&d.blockUI?"static":e?"fixed":"absolute",display:"none",left:c.left+"px",top:c.top+"px"});
if(!b.inline){c=d.datepicker._get(b,"showAnim");
var f=d.datepicker._get(b,"duration"),h=function(){var i=b.dpDiv.find("iframe.ui-datepicker-cover");
if(i.length){var g=d.datepicker._getBorders(b.dpDiv);
i.css({left:-g[0],top:-g[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()});
}};
b.dpDiv.zIndex(d(a).zIndex()+1);
d.datepicker._datepickerShowing=true;
d.effects&&d.effects[c]?b.dpDiv.show(c,d.datepicker._get(b,"showOptions"),f,h):b.dpDiv[c||"show"](c?f:null,h);
if(!c||!f){h();
}b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus();
d.datepicker._curInst=b;
}}},_updateDatepicker:function(a){var b=d.datepicker._getBorders(a.dpDiv);
J=a;
a.dpDiv.empty().append(this._generateHTML(a));
var c=a.dpDiv.find("iframe.ui-datepicker-cover");
c.length&&c.css({left:-b[0],top:-b[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()});
a.dpDiv.find("."+this._dayOverClass+" a").mouseover();
b=this._getNumberOfMonths(a);
c=b[1];
a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
c>1&&a.dpDiv.addClass("ui-datepicker-multi-"+c).css("width",17*c+"em");
a.dpDiv[(b[0]!=1||b[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi");
a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");
a==d.datepicker._curInst&&d.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&a.input[0]!=document.activeElement&&a.input.focus();
if(a.yearshtml){var e=a.yearshtml;
setTimeout(function(){e===a.yearshtml&&a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml);
e=a.yearshtml=null;
},0);
}},_getBorders:function(a){var b=function(c){return{thin:1,medium:2,thick:3}[c]||c;
};
return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))];
},_checkOffset:function(a,b,c){var e=a.dpDiv.outerWidth(),f=a.dpDiv.outerHeight(),h=a.input?a.input.outerWidth():0,i=a.input?a.input.outerHeight():0,g=document.documentElement.clientWidth+d(document).scrollLeft(),j=document.documentElement.clientHeight+d(document).scrollTop();
b.left-=this._get(a,"isRTL")?e-h:0;
b.left-=c&&b.left==a.input.offset().left?d(document).scrollLeft():0;
b.top-=c&&b.top==a.input.offset().top+i?d(document).scrollTop():0;
b.left-=Math.min(b.left,b.left+e>g&&g>e?Math.abs(b.left+e-g):0);
b.top-=Math.min(b.top,b.top+f>j&&j>f?Math.abs(f+i):0);
return b;
},_findPos:function(a){for(var b=this._get(this._getInst(a),"isRTL");
a&&(a.type=="hidden"||a.nodeType!=1||d.expr.filters.hidden(a));
){a=a[b?"previousSibling":"nextSibling"];
}a=d(a).offset();
return[a.left,a.top];
},_hideDatepicker:function(a){var b=this._curInst;
if(!(!b||a&&b!=d.data(a,"datepicker"))){if(this._datepickerShowing){a=this._get(b,"showAnim");
var c=this._get(b,"duration"),e=function(){d.datepicker._tidyDialog(b);
this._curInst=null;
};
d.effects&&d.effects[a]?b.dpDiv.hide(a,d.datepicker._get(b,"showOptions"),c,e):b.dpDiv[a=="slideDown"?"slideUp":a=="fadeIn"?"fadeOut":"hide"](a?c:null,e);
a||e();
if(a=this._get(b,"onClose")){a.apply(b.input?b.input[0]:null,[b.input?b.input.val():"",b]);
}this._datepickerShowing=false;
this._lastInput=null;
if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});
if(d.blockUI){d.unblockUI();
d("body").append(this.dpDiv);
}}this._inDialog=false;
}}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
},_checkExternalClick:function(a){if(d.datepicker._curInst){a=d(a.target);
a[0].id!=d.datepicker._mainDivId&&a.parents("#"+d.datepicker._mainDivId).length==0&&!a.hasClass(d.datepicker.markerClassName)&&!a.hasClass(d.datepicker._triggerClass)&&d.datepicker._datepickerShowing&&!(d.datepicker._inDialog&&d.blockUI)&&d.datepicker._hideDatepicker();
}},_adjustDate:function(a,b,c){a=d(a);
var e=this._getInst(a[0]);
if(!this._isDisabledDatepicker(a[0])){this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):0),c);
this._updateDatepicker(e);
}},_gotoToday:function(a){a=d(a);
var b=this._getInst(a[0]);
if(this._get(b,"gotoCurrent")&&b.currentDay){b.selectedDay=b.currentDay;
b.drawMonth=b.selectedMonth=b.currentMonth;
b.drawYear=b.selectedYear=b.currentYear;
}else{var c=new Date;
b.selectedDay=c.getDate();
b.drawMonth=b.selectedMonth=c.getMonth();
b.drawYear=b.selectedYear=c.getFullYear();
}this._notifyChange(b);
this._adjustDate(a);
},_selectMonthYear:function(a,b,c){a=d(a);
var e=this._getInst(a[0]);
e._selectingMonthYear=false;
e["selected"+(c=="M"?"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10);
this._notifyChange(e);
this._adjustDate(a);
},_clickMonthYear:function(a){var b=this._getInst(d(a)[0]);
b.input&&b._selectingMonthYear&&setTimeout(function(){b.input.focus();
},0);
b._selectingMonthYear=!b._selectingMonthYear;
},_selectDay:function(a,b,c,e){var f=d(a);
if(!(d(e).hasClass(this._unselectableClass)||this._isDisabledDatepicker(f[0]))){f=this._getInst(f[0]);
f.selectedDay=f.currentDay=d("a",e).html();
f.selectedMonth=f.currentMonth=b;
f.selectedYear=f.currentYear=c;
this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear));
}},_clearDate:function(a){a=d(a);
this._getInst(a[0]);
this._selectDate(a,"");
},_selectDate:function(a,b){a=this._getInst(d(a)[0]);
b=b!=null?b:this._formatDate(a);
a.input&&a.input.val(b);
this._updateAlternate(a);
var c=this._get(a,"onSelect");
if(c){c.apply(a.input?a.input[0]:null,[b,a]);
}else{a.input&&a.input.trigger("change");
}if(a.inline){this._updateDatepicker(a);
}else{this._hideDatepicker();
this._lastInput=a.input[0];
typeof a.input[0]!="object"&&a.input.focus();
this._lastInput=null;
}},_updateAlternate:function(a){var b=this._get(a,"altField");
if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),e=this._getDate(a),f=this.formatDate(c,e,this._getFormatConfig(a));
d(b).each(function(){d(this).val(f);
});
}},noWeekends:function(a){a=a.getDay();
return[a>0&&a<6,""];
},iso8601Week:function(a){a=new Date(a.getTime());
a.setDate(a.getDate()+4-(a.getDay()||7));
var b=a.getTime();
a.setMonth(0);
a.setDate(1);
return Math.floor(Math.round((b-a)/86400000)/7)+1;
},parseDate:function(a,b,c){if(a==null||b==null){throw"Invalid arguments";
}b=typeof b=="object"?b.toString():b+"";
if(b==""){return null;
}var e=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff;
e=typeof e!="string"?e:(new Date).getFullYear()%100+parseInt(e,10);
for(var f=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,h=(c?c.dayNames:null)||this._defaults.dayNames,i=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,g=(c?c.monthNames:null)||this._defaults.monthNames,j=c=-1,l=-1,u=-1,k=false,o=function(p){(p=A+1<a.length&&a.charAt(A+1)==p)&&A++;
return p;
},m=function(p){var C=o(p);
p=new RegExp("^\\d{1,"+(p=="@"?14:p=="!"?20:p=="y"&&C?4:p=="o"?3:2)+"}");
p=b.substring(s).match(p);
if(!p){throw"Missing number at position "+s;
}s+=p[0].length;
return parseInt(p[0],10);
},n=function(p,C,K){p=d.map(o(p)?K:C,function(w,x){return[[x,w]];
}).sort(function(w,x){return -(w[1].length-x[1].length);
});
var E=-1;
d.each(p,function(w,x){w=x[1];
if(b.substr(s,w.length).toLowerCase()==w.toLowerCase()){E=x[0];
s+=w.length;
return false;
}});
if(E!=-1){return E+1;
}else{throw"Unknown name at position "+s;
}},r=function(){if(b.charAt(s)!=a.charAt(A)){throw"Unexpected literal at position "+s;
}s++;
},s=0,A=0;
A<a.length;
A++){if(k){if(a.charAt(A)=="'"&&!o("'")){k=false;
}else{r();
}}else{switch(a.charAt(A)){case"d":l=m("d");
break;
case"D":n("D",f,h);
break;
case"o":u=m("o");
break;
case"m":j=m("m");
break;
case"M":j=n("M",i,g);
break;
case"y":c=m("y");
break;
case"@":var v=new Date(m("@"));
c=v.getFullYear();
j=v.getMonth()+1;
l=v.getDate();
break;
case"!":v=new Date((m("!")-this._ticksTo1970)/10000);
c=v.getFullYear();
j=v.getMonth()+1;
l=v.getDate();
break;
case"'":if(o("'")){r();
}else{k=true;
}break;
default:r();
}}}if(c==-1){c=(new Date).getFullYear();
}else{if(c<100){c+=(new Date).getFullYear()-(new Date).getFullYear()%100+(c<=e?0:-100);
}}if(u>-1){j=1;
l=u;
do{e=this._getDaysInMonth(c,j-1);
if(l<=e){break;
}j++;
l-=e;
}while(1);
}v=this._daylightSavingAdjust(new Date(c,j-1,l));
if(v.getFullYear()!=c||v.getMonth()+1!=j||v.getDate()!=l){throw"Invalid date";
}return v;
},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*10000000,formatDate:function(a,b,c){if(!b){return"";
}var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,h=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort;
c=(c?c.monthNames:null)||this._defaults.monthNames;
var i=function(o){(o=k+1<a.length&&a.charAt(k+1)==o)&&k++;
return o;
},g=function(o,m,n){m=""+m;
if(i(o)){for(;
m.length<n;
){m="0"+m;
}}return m;
},j=function(o,m,n,r){return i(o)?r[m]:n[m];
},l="",u=false;
if(b){for(var k=0;
k<a.length;
k++){if(u){if(a.charAt(k)=="'"&&!i("'")){u=false;
}else{l+=a.charAt(k);
}}else{switch(a.charAt(k)){case"d":l+=g("d",b.getDate(),2);
break;
case"D":l+=j("D",b.getDay(),e,f);
break;
case"o":l+=g("o",(b.getTime()-(new Date(b.getFullYear(),0,0)).getTime())/86400000,3);
break;
case"m":l+=g("m",b.getMonth()+1,2);
break;
case"M":l+=j("M",b.getMonth(),h,c);
break;
case"y":l+=i("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;
break;
case"@":l+=b.getTime();
break;
case"!":l+=b.getTime()*10000+this._ticksTo1970;
break;
case"'":if(i("'")){l+="'";
}else{u=true;
}break;
default:l+=a.charAt(k);
}}}}return l;
},_possibleChars:function(a){for(var b="",c=false,e=function(h){(h=f+1<a.length&&a.charAt(f+1)==h)&&f++;
return h;
},f=0;
f<a.length;
f++){if(c){if(a.charAt(f)=="'"&&!e("'")){c=false;
}else{b+=a.charAt(f);
}}else{switch(a.charAt(f)){case"d":case"m":case"y":case"@":b+="0123456789";
break;
case"D":case"M":return null;
case"'":if(e("'")){b+="'";
}else{c=true;
}break;
default:b+=a.charAt(f);
}}}return b;
},_get:function(a,b){return a.settings[b]!==B?a.settings[b]:this._defaults[b];
},_setDateFromField:function(a,b){if(a.input.val()!=a.lastVal){var c=this._get(a,"dateFormat"),e=a.lastVal=a.input?a.input.val():null,f,h;
f=h=this._getDefaultDate(a);
var i=this._getFormatConfig(a);
try{f=this.parseDate(c,e,i)||h;
}catch(g){this.log(g);
e=b?"":e;
}a.selectedDay=f.getDate();
a.drawMonth=a.selectedMonth=f.getMonth();
a.drawYear=a.selectedYear=f.getFullYear();
a.currentDay=e?f.getDate():0;
a.currentMonth=e?f.getMonth():0;
a.currentYear=e?f.getFullYear():0;
this._adjustInstDate(a);
}},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date));
},_determineDate:function(a,b,c){var e=function(h){var i=new Date;
i.setDate(i.getDate()+h);
return i;
},f=function(h){try{return d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),h,d.datepicker._getFormatConfig(a));
}catch(i){}var g=(h.toLowerCase().match(/^c/)?d.datepicker._getDate(a):null)||new Date,j=g.getFullYear(),l=g.getMonth();
g=g.getDate();
for(var u=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,k=u.exec(h);
k;
){switch(k[2]||"d"){case"d":case"D":g+=parseInt(k[1],10);
break;
case"w":case"W":g+=parseInt(k[1],10)*7;
break;
case"m":case"M":l+=parseInt(k[1],10);
g=Math.min(g,d.datepicker._getDaysInMonth(j,l));
break;
case"y":case"Y":j+=parseInt(k[1],10);
g=Math.min(g,d.datepicker._getDaysInMonth(j,l));
break;
}k=u.exec(h);
}return new Date(j,l,g);
};
if(b=(b=b==null||b===""?c:typeof b=="string"?f(b):typeof b=="number"?isNaN(b)?c:e(b):new Date(b.getTime()))&&b.toString()=="Invalid Date"?c:b){b.setHours(0);
b.setMinutes(0);
b.setSeconds(0);
b.setMilliseconds(0);
}return this._daylightSavingAdjust(b);
},_daylightSavingAdjust:function(a){if(!a){return null;
}a.setHours(a.getHours()>12?a.getHours()+2:0);
return a;
},_setDate:function(a,b,c){var e=!b,f=a.selectedMonth,h=a.selectedYear;
b=this._restrictMinMax(a,this._determineDate(a,b,new Date));
a.selectedDay=a.currentDay=b.getDate();
a.drawMonth=a.selectedMonth=a.currentMonth=b.getMonth();
a.drawYear=a.selectedYear=a.currentYear=b.getFullYear();
if((f!=a.selectedMonth||h!=a.selectedYear)&&!c){this._notifyChange(a);
}this._adjustInstDate(a);
if(a.input){a.input.val(e?"":this._formatDate(a));
}},_getDate:function(a){return !a.currentYear||a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));
},_generateHTML:function(a){var b=new Date;
b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));
var c=this._get(a,"isRTL"),e=this._get(a,"showButtonPanel"),f=this._get(a,"hideIfNoPrevNext"),h=this._get(a,"navigationAsDateFormat"),i=this._getNumberOfMonths(a),g=this._get(a,"showCurrentAtPos"),j=this._get(a,"stepMonths"),l=i[0]!=1||i[1]!=1,u=this._daylightSavingAdjust(!a.currentDay?new Date(9999,9,9):new Date(a.currentYear,a.currentMonth,a.currentDay)),k=this._getMinMaxDate(a,"min"),o=this._getMinMaxDate(a,"max");
g=a.drawMonth-g;
var m=a.drawYear;
if(g<0){g+=12;
m--;
}if(o){var n=this._daylightSavingAdjust(new Date(o.getFullYear(),o.getMonth()-i[0]*i[1]+1,o.getDate()));
for(n=k&&n<k?k:n;
this._daylightSavingAdjust(new Date(m,g,1))>n;
){g--;
if(g<0){g=11;
m--;
}}}a.drawMonth=g;
a.drawYear=m;
n=this._get(a,"prevText");
n=!h?n:this.formatDate(n,this._daylightSavingAdjust(new Date(m,g-j,1)),this._getFormatConfig(a));
n=this._canAdjustMonth(a,-1,m,g)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+z+".datepicker._adjustDate('#"+a.id+"', -"+j+", 'M');\" title=\""+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>":f?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>";
var r=this._get(a,"nextText");
r=!h?r:this.formatDate(r,this._daylightSavingAdjust(new Date(m,g+j,1)),this._getFormatConfig(a));
f=this._canAdjustMonth(a,+1,m,g)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+z+".datepicker._adjustDate('#"+a.id+"', +"+j+", 'M');\" title=\""+r+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+r+"</span></a>":f?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+r+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+r+"</span></a>";
j=this._get(a,"currentText");
r=this._get(a,"gotoCurrent")&&a.currentDay?u:b;
j=!h?j:this.formatDate(j,r,this._getFormatConfig(a));
h=!a.inline?'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+z+'.datepicker._hideDatepicker();">'+this._get(a,"closeText")+"</button>":"";
e=e?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?h:"")+(this._isInRange(a,r)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+z+".datepicker._gotoToday('#"+a.id+"');\">"+j+"</button>":"")+(c?"":h)+"</div>":"";
h=parseInt(this._get(a,"firstDay"),10);
h=isNaN(h)?0:h;
j=this._get(a,"showWeek");
r=this._get(a,"dayNames");
this._get(a,"dayNamesShort");
var s=this._get(a,"dayNamesMin"),A=this._get(a,"monthNames"),v=this._get(a,"monthNamesShort"),p=this._get(a,"beforeShowDay"),C=this._get(a,"showOtherMonths"),K=this._get(a,"selectOtherMonths");
this._get(a,"calculateWeek");
for(var E=this._getDefaultDate(a),w="",x=0;
x<i[0];
x++){for(var O="",G=0;
G<i[1];
G++){var P=this._daylightSavingAdjust(new Date(m,g,a.selectedDay)),t=" ui-corner-all",y="";
if(l){y+='<div class="ui-datepicker-group';
if(i[1]>1){switch(G){case 0:y+=" ui-datepicker-group-first";
t=" ui-corner-"+(c?"right":"left");
break;
case i[1]-1:y+=" ui-datepicker-group-last";
t=" ui-corner-"+(c?"left":"right");
break;
default:y+=" ui-datepicker-group-middle";
t="";
break;
}}y+='">';
}y+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+t+'">'+(/all|left/.test(t)&&x==0?c?f:n:"")+(/all|right/.test(t)&&x==0?c?n:f:"")+this._generateMonthYearHeader(a,g,m,k,o,x>0||G>0,A,v)+'</div><table class="ui-datepicker-calendar"><thead><tr>';
var D=j?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";
for(t=0;
t<7;
t++){var q=(t+h)%7;
D+="<th"+((t+h+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+r[q]+'">'+s[q]+"</span></th>";
}y+=D+"</tr></thead><tbody>";
D=this._getDaysInMonth(m,g);
if(m==a.selectedYear&&g==a.selectedMonth){a.selectedDay=Math.min(a.selectedDay,D);
}t=(this._getFirstDayOfMonth(m,g)-h+7)%7;
D=l?6:Math.ceil((t+D)/7);
q=this._daylightSavingAdjust(new Date(m,g,1-t));
for(var Q=0;
Q<D;
Q++){y+="<tr>";
var R=!j?"":'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(q)+"</td>";
for(t=0;
t<7;
t++){var I=p?p.apply(a.input?a.input[0]:null,[q]):[true,""],F=q.getMonth()!=g,L=F&&!K||!I[0]||k&&q<k||o&&q>o;
R+='<td class="'+((t+h+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(q.getTime()==P.getTime()&&g==a.selectedMonth&&a._keyEvent||E.getTime()==q.getTime()&&E.getTime()==P.getTime()?" "+this._dayOverClass:"")+(L?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!C?"":" "+I[1]+(q.getTime()==u.getTime()?" "+this._currentClass:"")+(q.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!F||C)&&I[2]?' title="'+I[2]+'"':"")+(L?"":' onclick="DP_jQuery_'+z+".datepicker._selectDay('#"+a.id+"',"+q.getMonth()+","+q.getFullYear()+', this);return false;"')+">"+(F&&!C?"&#xa0;":L?'<span class="ui-state-default">'+q.getDate()+"</span>":'<a class="ui-state-default'+(q.getTime()==b.getTime()?" ui-state-highlight":"")+(q.getTime()==u.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+'" href="#">'+q.getDate()+"</a>")+"</td>";
q.setDate(q.getDate()+1);
q=this._daylightSavingAdjust(q);
}y+=R+"</tr>";
}g++;
if(g>11){g=0;
m++;
}y+="</tbody></table>"+(l?"</div>"+(i[0]>0&&G==i[1]-1?'<div class="ui-datepicker-row-break"></div>':""):"");
O+=y;
}w+=O;
}w+=e+(d.browser.msie&&parseInt(d.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':"");
a._keyEvent=false;
return w;
},_generateMonthYearHeader:function(a,b,c,e,f,h,i,g){var j=this._get(a,"changeMonth"),l=this._get(a,"changeYear"),u=this._get(a,"showMonthAfterYear"),k='<div class="ui-datepicker-title">',o="";
if(h||!j){o+='<span class="ui-datepicker-month">'+i[b]+"</span>";
}else{i=e&&e.getFullYear()==c;
var m=f&&f.getFullYear()==c;
o+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+z+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" onclick=\"DP_jQuery_"+z+".datepicker._clickMonthYear('#"+a.id+"');\">";
for(var n=0;
n<12;
n++){if((!i||n>=e.getMonth())&&(!m||n<=f.getMonth())){o+='<option value="'+n+'"'+(n==b?' selected="selected"':"")+">"+g[n]+"</option>";
}}o+="</select>";
}u||(k+=o+(h||!(j&&l)?"&#xa0;":""));
if(!a.yearshtml){a.yearshtml="";
if(h||!l){k+='<span class="ui-datepicker-year">'+c+"</span>";
}else{g=this._get(a,"yearRange").split(":");
var r=(new Date).getFullYear();
i=function(s){s=s.match(/c[+-].*/)?c+parseInt(s.substring(1),10):s.match(/[+-].*/)?r+parseInt(s,10):parseInt(s,10);
return isNaN(s)?r:s;
};
b=i(g[0]);
g=Math.max(b,i(g[1]||""));
b=e?Math.max(b,e.getFullYear()):b;
g=f?Math.min(g,f.getFullYear()):g;
for(a.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+z+".datepicker._selectMonthYear('#"+a.id+"', this, 'Y');\" onclick=\"DP_jQuery_"+z+".datepicker._clickMonthYear('#"+a.id+"');\">";
b<=g;
b++){a.yearshtml+='<option value="'+b+'"'+(b==c?' selected="selected"':"")+">"+b+"</option>";
}a.yearshtml+="</select>";
k+=a.yearshtml;
a.yearshtml=null;
}}k+=this._get(a,"yearSuffix");
if(u){k+=(h||!(j&&l)?"&#xa0;":"")+o;
}k+="</div>";
return k;
},_adjustInstDate:function(a,b,c){var e=a.drawYear+(c=="Y"?b:0),f=a.drawMonth+(c=="M"?b:0);
b=Math.min(a.selectedDay,this._getDaysInMonth(e,f))+(c=="D"?b:0);
e=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(e,f,b)));
a.selectedDay=e.getDate();
a.drawMonth=a.selectedMonth=e.getMonth();
a.drawYear=a.selectedYear=e.getFullYear();
if(c=="M"||c=="Y"){this._notifyChange(a);
}},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min");
a=this._getMinMaxDate(a,"max");
b=c&&b<c?c:b;
return b=a&&b>a?a:b;
},_notifyChange:function(a){var b=this._get(a,"onChangeMonthYear");
if(b){b.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a]);
}},_getNumberOfMonths:function(a){a=this._get(a,"numberOfMonths");
return a==null?[1,1]:typeof a=="number"?[1,a]:a;
},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null);
},_getDaysInMonth:function(a,b){return 32-this._daylightSavingAdjust(new Date(a,b,32)).getDate();
},_getFirstDayOfMonth:function(a,b){return(new Date(a,b,1)).getDay();
},_canAdjustMonth:function(a,b,c,e){var f=this._getNumberOfMonths(a);
c=this._daylightSavingAdjust(new Date(c,e+(b<0?b:f[0]*f[1]),1));
b<0&&c.setDate(this._getDaysInMonth(c.getFullYear(),c.getMonth()));
return this._isInRange(a,c);
},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min");
a=this._getMinMaxDate(a,"max");
return(!c||b.getTime()>=c.getTime())&&(!a||b.getTime()<=a.getTime());
},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");
b=typeof b!="string"?b:(new Date).getFullYear()%100+parseInt(b,10);
return{shortYearCutoff:b,dayNamesShort:this._get(a,"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")};
},_formatDate:function(a,b,c,e){if(!b){a.currentDay=a.selectedDay;
a.currentMonth=a.selectedMonth;
a.currentYear=a.selectedYear;
}b=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(e,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));
return this.formatDate(this._get(a,"dateFormat"),b,this._getFormatConfig(a));
}});
d.fn.datepicker=function(a){if(!this.length){return this;
}if(!d.datepicker.initialized){d(document).mousedown(d.datepicker._checkExternalClick).find("body").append(d.datepicker.dpDiv);
d.datepicker.initialized=true;
}var b=Array.prototype.slice.call(arguments,1);
if(typeof a=="string"&&(a=="isDisabled"||a=="getDate"||a=="widget")){return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));
}if(a=="option"&&arguments.length==2&&typeof arguments[1]=="string"){return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));
}return this.each(function(){typeof a=="string"?d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this].concat(b)):d.datepicker._attachDatepicker(this,a);
});
};
d.datepicker=new M;
d.datepicker.initialized=false;
d.datepicker.uuid=(new Date).getTime();
d.datepicker.version="1.8.13";
window["DP_jQuery_"+z]=d;
})(jQuery);
(function(b,d){b.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()});
this.valueDiv=b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
this.oldValue=this._value();
this._refreshValue();
},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
this.valueDiv.remove();
b.Widget.prototype.destroy.apply(this,arguments);
},value:function(a){if(a===d){return this._value();
}this._setOption("value",a);
return this;
},_setOption:function(a,c){if(a==="value"){this.options.value=c;
this._refreshValue();
this._value()===this.options.max&&this._trigger("complete");
}b.Widget.prototype._setOption.apply(this,arguments);
},_value:function(){var a=this.options.value;
if(typeof a!=="number"){a=0;
}return Math.min(this.options.max,Math.max(this.min,a));
},_percentage:function(){return 100*this._value()/this.options.max;
},_refreshValue:function(){var a=this.value(),c=this._percentage();
if(this.oldValue!==a){this.oldValue=a;
this._trigger("change");
}this.valueDiv.toggle(a>this.min).toggleClass("ui-corner-right",a===this.options.max).width(c.toFixed(0)+"%");
this.element.attr("aria-valuenow",a);
}});
b.extend(b.ui.progressbar,{version:"1.8.13"});
})(jQuery);
jQuery.effects||function(f,j){function m(c){var a;
if(c&&c.constructor==Array&&c.length==3){return c;
}if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c)){return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10)];
}if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c)){return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];
}if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c)){return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)];
}if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c)){return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];
}if(/rgba\(0, 0, 0, 0\)/.exec(c)){return n.transparent;
}return n[f.trim(c).toLowerCase()];
}function s(c,a){var b;
do{b=f.curCSS(c,a);
if(b!=""&&b!="transparent"||f.nodeName(c,"body")){break;
}a="backgroundColor";
}while(c=c.parentNode);
return m(b);
}function o(){var c=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,a={},b,d;
if(c&&c.length&&c[0]&&c[c[0]]){for(var e=c.length;
e--;
){b=c[e];
if(typeof c[b]=="string"){d=b.replace(/\-(\w)/g,function(g,h){return h.toUpperCase();
});
a[d]=c[b];
}}}else{for(b in c){if(typeof c[b]==="string"){a[b]=c[b];
}}}return a;
}function p(c){var a,b;
for(a in c){b=c[a];
if(b==null||f.isFunction(b)||a in t||/scrollbar/.test(a)||!/color/i.test(a)&&isNaN(parseFloat(b))){delete c[a];
}}return c;
}function u(c,a){var b={_:0},d;
for(d in a){if(c[d]!=a[d]){b[d]=a[d];
}}return b;
}function k(c,a,b,d){if(typeof c=="object"){d=a;
b=null;
a=c;
c=a.effect;
}if(f.isFunction(a)){d=a;
b=null;
a={};
}if(typeof a=="number"||f.fx.speeds[a]){d=b;
b=a;
a={};
}if(f.isFunction(b)){d=b;
b=null;
}a=a||{};
b=b||a.duration;
b=f.fx.off?0:typeof b=="number"?b:b in f.fx.speeds?f.fx.speeds[b]:f.fx.speeds._default;
d=d||a.complete;
return[c,a,b,d];
}function l(c){if(!c||typeof c==="number"||f.fx.speeds[c]){return true;
}if(typeof c==="string"&&!f.effects[c]){return true;
}return false;
}f.effects={};
f.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","borderColor","color","outlineColor"],function(c,a){f.fx.step[a]=function(b){if(!b.colorInit){b.start=s(b.elem,a);
b.end=m(b.end);
b.colorInit=true;
}b.elem.style[a]="rgb("+Math.max(Math.min(parseInt(b.pos*(b.end[0]-b.start[0])+b.start[0],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[1]-b.start[1])+b.start[1],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[2]-b.start[2])+b.start[2],10),255),0)+")";
};
});
var n={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},q=["add","remove","toggle"],t={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};
f.effects.animateClass=function(c,a,b,d){if(f.isFunction(b)){d=b;
b=null;
}return this.queue(function(){var e=f(this),g=e.attr("style")||" ",h=p(o.call(this)),r,v=e.attr("class");
f.each(q,function(w,i){c[i]&&e[i+"Class"](c[i]);
});
r=p(o.call(this));
e.attr("class",v);
e.animate(u(h,r),{queue:false,duration:a,easding:b,complete:function(){f.each(q,function(w,i){c[i]&&e[i+"Class"](c[i]);
});
if(typeof e.attr("style")=="object"){e.attr("style").cssText="";
e.attr("style").cssText=g;
}else{e.attr("style",g);
}d&&d.apply(this,arguments);
f.dequeue(this);
}});
});
};
f.fn.extend({_addClass:f.fn.addClass,addClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{add:c},a,b,d]):this._addClass(c);
},_removeClass:f.fn.removeClass,removeClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{remove:c},a,b,d]):this._removeClass(c);
},_toggleClass:f.fn.toggleClass,toggleClass:function(c,a,b,d,e){return typeof a=="boolean"||a===j?b?f.effects.animateClass.apply(this,[a?{add:c}:{remove:c},b,d,e]):this._toggleClass(c,a):f.effects.animateClass.apply(this,[{toggle:c},a,b,d]);
},switchClass:function(c,a,b,d,e){return f.effects.animateClass.apply(this,[{add:a,remove:c},b,d,e]);
}});
f.extend(f.effects,{version:"1.8.13",save:function(c,a){for(var b=0;
b<a.length;
b++){a[b]!==null&&c.data("ec.storage."+a[b],c[0].style[a[b]]);
}},restore:function(c,a){for(var b=0;
b<a.length;
b++){a[b]!==null&&c.css(a[b],c.data("ec.storage."+a[b]));
}},setMode:function(c,a){if(a=="toggle"){a=c.is(":hidden")?"show":"hide";
}return a;
},getBaseline:function(c,a){var b;
switch(c[0]){case"top":b=0;
break;
case"middle":b=0.5;
break;
case"bottom":b=1;
break;
default:b=c[0]/a.height;
}switch(c[1]){case"left":c=0;
break;
case"center":c=0.5;
break;
case"right":c=1;
break;
default:c=c[1]/a.width;
}return{x:c,y:b};
},createWrapper:function(c){if(c.parent().is(".ui-effects-wrapper")){return c.parent();
}var a={width:c.outerWidth(true),height:c.outerHeight(true),"float":c.css("float")},b=f("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0});
c.wrap(b);
b=c.parent();
if(c.css("position")=="static"){b.css({position:"relative"});
c.css({position:"relative"});
}else{f.extend(a,{position:c.css("position"),zIndex:c.css("z-index")});
f.each(["top","left","bottom","right"],function(d,e){a[e]=c.css(e);
if(isNaN(parseInt(a[e],10))){a[e]="auto";
}});
c.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"});
}return b.css(a).show();
},removeWrapper:function(c){if(c.parent().is(".ui-effects-wrapper")){return c.parent().replaceWith(c);
}return c;
},setTransition:function(c,a,b,d){d=d||{};
f.each(a,function(e,g){unit=c.cssUnit(g);
if(unit[0]>0){d[g]=unit[0]*b+unit[1];
}});
return d;
}});
f.fn.extend({effect:function(c){var a=k.apply(this,arguments),b={options:a[1],duration:a[2],callback:a[3]};
a=b.options.mode;
var d=f.effects[c];
if(f.fx.off||!d){return a?this[a](b.duration,b.callback):this.each(function(){b.callback&&b.callback.call(this);
});
}return d.call(this,b);
},_show:f.fn.show,show:function(c){if(l(c)){return this._show.apply(this,arguments);
}else{var a=k.apply(this,arguments);
a[1].mode="show";
return this.effect.apply(this,a);
}},_hide:f.fn.hide,hide:function(c){if(l(c)){return this._hide.apply(this,arguments);
}else{var a=k.apply(this,arguments);
a[1].mode="hide";
return this.effect.apply(this,a);
}},__toggle:f.fn.toggle,toggle:function(c){if(l(c)||typeof c==="boolean"||f.isFunction(c)){return this.__toggle.apply(this,arguments);
}else{var a=k.apply(this,arguments);
a[1].mode="toggle";
return this.effect.apply(this,a);
}},cssUnit:function(c){var a=this.css(c),b=[];
f.each(["em","px","%","pt"],function(d,e){if(a.indexOf(e)>0){b=[parseFloat(a),e];
}});
return b;
}});
f.easing.jswing=f.easing.swing;
f.extend(f.easing,{def:"easeOutQuad",swing:function(c,a,b,d,e){return f.easing[f.easing.def](c,a,b,d,e);
},easeInQuad:function(c,a,b,d,e){return d*(a/=e)*a+b;
},easeOutQuad:function(c,a,b,d,e){return -d*(a/=e)*(a-2)+b;
},easeInOutQuad:function(c,a,b,d,e){if((a/=e/2)<1){return d/2*a*a+b;
}return -d/2*(--a*(a-2)-1)+b;
},easeInCubic:function(c,a,b,d,e){return d*(a/=e)*a*a+b;
},easeOutCubic:function(c,a,b,d,e){return d*((a=a/e-1)*a*a+1)+b;
},easeInOutCubic:function(c,a,b,d,e){if((a/=e/2)<1){return d/2*a*a*a+b;
}return d/2*((a-=2)*a*a+2)+b;
},easeInQuart:function(c,a,b,d,e){return d*(a/=e)*a*a*a+b;
},easeOutQuart:function(c,a,b,d,e){return -d*((a=a/e-1)*a*a*a-1)+b;
},easeInOutQuart:function(c,a,b,d,e){if((a/=e/2)<1){return d/2*a*a*a*a+b;
}return -d/2*((a-=2)*a*a*a-2)+b;
},easeInQuint:function(c,a,b,d,e){return d*(a/=e)*a*a*a*a+b;
},easeOutQuint:function(c,a,b,d,e){return d*((a=a/e-1)*a*a*a*a+1)+b;
},easeInOutQuint:function(c,a,b,d,e){if((a/=e/2)<1){return d/2*a*a*a*a*a+b;
}return d/2*((a-=2)*a*a*a*a+2)+b;
},easeInSine:function(c,a,b,d,e){return -d*Math.cos(a/e*(Math.PI/2))+d+b;
},easeOutSine:function(c,a,b,d,e){return d*Math.sin(a/e*(Math.PI/2))+b;
},easeInOutSine:function(c,a,b,d,e){return -d/2*(Math.cos(Math.PI*a/e)-1)+b;
},easeInExpo:function(c,a,b,d,e){return a==0?b:d*Math.pow(2,10*(a/e-1))+b;
},easeOutExpo:function(c,a,b,d,e){return a==e?b+d:d*(-Math.pow(2,-10*a/e)+1)+b;
},easeInOutExpo:function(c,a,b,d,e){if(a==0){return b;
}if(a==e){return b+d;
}if((a/=e/2)<1){return d/2*Math.pow(2,10*(a-1))+b;
}return d/2*(-Math.pow(2,-10*--a)+2)+b;
},easeInCirc:function(c,a,b,d,e){return -d*(Math.sqrt(1-(a/=e)*a)-1)+b;
},easeOutCirc:function(c,a,b,d,e){return d*Math.sqrt(1-(a=a/e-1)*a)+b;
},easeInOutCirc:function(c,a,b,d,e){if((a/=e/2)<1){return -d/2*(Math.sqrt(1-a*a)-1)+b;
}return d/2*(Math.sqrt(1-(a-=2)*a)+1)+b;
},easeInElastic:function(c,a,b,d,e){c=1.70158;
var g=0,h=d;
if(a==0){return b;
}if((a/=e)==1){return b+d;
}g||(g=e*0.3);
if(h<Math.abs(d)){h=d;
c=g/4;
}else{c=g/(2*Math.PI)*Math.asin(d/h);
}return -(h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g))+b;
},easeOutElastic:function(c,a,b,d,e){c=1.70158;
var g=0,h=d;
if(a==0){return b;
}if((a/=e)==1){return b+d;
}g||(g=e*0.3);
if(h<Math.abs(d)){h=d;
c=g/4;
}else{c=g/(2*Math.PI)*Math.asin(d/h);
}return h*Math.pow(2,-10*a)*Math.sin((a*e-c)*2*Math.PI/g)+d+b;
},easeInOutElastic:function(c,a,b,d,e){c=1.70158;
var g=0,h=d;
if(a==0){return b;
}if((a/=e/2)==2){return b+d;
}g||(g=e*0.3*1.5);
if(h<Math.abs(d)){h=d;
c=g/4;
}else{c=g/(2*Math.PI)*Math.asin(d/h);
}if(a<1){return -0.5*h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)+b;
}return h*Math.pow(2,-10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)*0.5+d+b;
},easeInBack:function(c,a,b,d,e,g){if(g==j){g=1.70158;
}return d*(a/=e)*a*((g+1)*a-g)+b;
},easeOutBack:function(c,a,b,d,e,g){if(g==j){g=1.70158;
}return d*((a=a/e-1)*a*((g+1)*a+g)+1)+b;
},easeInOutBack:function(c,a,b,d,e,g){if(g==j){g=1.70158;
}if((a/=e/2)<1){return d/2*a*a*(((g*=1.525)+1)*a-g)+b;
}return d/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+b;
},easeInBounce:function(c,a,b,d,e){return d-f.easing.easeOutBounce(c,e-a,0,d,e)+b;
},easeOutBounce:function(c,a,b,d,e){return(a/=e)<1/2.75?d*7.5625*a*a+b:a<2/2.75?d*(7.5625*(a-=1.5/2.75)*a+0.75)+b:a<2.5/2.75?d*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:d*(7.5625*(a-=2.625/2.75)*a+0.984375)+b;
},easeInOutBounce:function(c,a,b,d,e){if(a<e/2){return f.easing.easeInBounce(c,a*2,0,d,e)*0.5+b;
}return f.easing.easeOutBounce(c,a*2-e,0,d,e)*0.5+d*0.5+b;
}});
}(jQuery);
(function(b){b.effects.blind=function(c){return this.queue(function(){var a=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(a,c.options.mode||"hide"),d=c.options.direction||"vertical";
b.effects.save(a,g);
a.show();
var e=b.effects.createWrapper(a).css({overflow:"hidden"}),h=d=="vertical"?"height":"width";
d=d=="vertical"?e.height():e.width();
f=="show"&&e.css(h,0);
var i={};
i[h]=f=="show"?d:0;
e.animate(i,c.duration,c.options.easing,function(){f=="hide"&&a.hide();
b.effects.restore(a,g);
b.effects.removeWrapper(a);
c.callback&&c.callback.apply(a[0],arguments);
a.dequeue();
});
});
};
})(jQuery);
(function(e){e.effects.bounce=function(b){return this.queue(function(){var a=e(this),l=["position","top","bottom","left","right"],h=e.effects.setMode(a,b.options.mode||"effect"),d=b.options.direction||"up",c=b.options.distance||20,m=b.options.times||5,i=b.duration||250;
/show|hide/.test(h)&&l.push("opacity");
e.effects.save(a,l);
a.show();
e.effects.createWrapper(a);
var f=d=="up"||d=="down"?"top":"left";
d=d=="up"||d=="left"?"pos":"neg";
c=b.options.distance||(f=="top"?a.outerHeight({margin:true})/3:a.outerWidth({margin:true})/3);
if(h=="show"){a.css("opacity",0).css(f,d=="pos"?-c:c);
}if(h=="hide"){c/=m*2;
}h!="hide"&&m--;
if(h=="show"){var g={opacity:1};
g[f]=(d=="pos"?"+=":"-=")+c;
a.animate(g,i/2,b.options.easing);
c/=2;
m--;
}for(g=0;
g<m;
g++){var j={},k={};
j[f]=(d=="pos"?"-=":"+=")+c;
k[f]=(d=="pos"?"+=":"-=")+c;
a.animate(j,i/2,b.options.easing).animate(k,i/2,b.options.easing);
c=h=="hide"?c*2:c/2;
}if(h=="hide"){g={opacity:0};
g[f]=(d=="pos"?"-=":"+=")+c;
a.animate(g,i/2,b.options.easing,function(){a.hide();
e.effects.restore(a,l);
e.effects.removeWrapper(a);
b.callback&&b.callback.apply(this,arguments);
});
}else{j={};
k={};
j[f]=(d=="pos"?"-=":"+=")+c;
k[f]=(d=="pos"?"+=":"-=")+c;
a.animate(j,i/2,b.options.easing).animate(k,i/2,b.options.easing,function(){e.effects.restore(a,l);
e.effects.removeWrapper(a);
b.callback&&b.callback.apply(this,arguments);
});
}a.queue("fx",function(){a.dequeue();
});
a.dequeue();
});
};
})(jQuery);
(function(b){b.effects.clip=function(e){return this.queue(function(){var a=b(this),i=["position","top","bottom","left","right","height","width"],f=b.effects.setMode(a,e.options.mode||"hide"),c=e.options.direction||"vertical";
b.effects.save(a,i);
a.show();
var d=b.effects.createWrapper(a).css({overflow:"hidden"});
d=a[0].tagName=="IMG"?d:a;
var g={size:c=="vertical"?"height":"width",position:c=="vertical"?"top":"left"};
c=c=="vertical"?d.height():d.width();
if(f=="show"){d.css(g.size,0);
d.css(g.position,c/2);
}var h={};
h[g.size]=f=="show"?c:0;
h[g.position]=f=="show"?0:c/2;
d.animate(h,{queue:false,duration:e.duration,easing:e.options.easing,complete:function(){f=="hide"&&a.hide();
b.effects.restore(a,i);
b.effects.removeWrapper(a);
e.callback&&e.callback.apply(a[0],arguments);
a.dequeue();
}});
});
};
})(jQuery);
(function(c){c.effects.drop=function(d){return this.queue(function(){var a=c(this),h=["position","top","bottom","left","right","opacity"],e=c.effects.setMode(a,d.options.mode||"hide"),b=d.options.direction||"left";
c.effects.save(a,h);
a.show();
c.effects.createWrapper(a);
var f=b=="up"||b=="down"?"top":"left";
b=b=="up"||b=="left"?"pos":"neg";
var g=d.options.distance||(f=="top"?a.outerHeight({margin:true})/2:a.outerWidth({margin:true})/2);
if(e=="show"){a.css("opacity",0).css(f,b=="pos"?-g:g);
}var i={opacity:e=="show"?1:0};
i[f]=(e=="show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+g;
a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){e=="hide"&&a.hide();
c.effects.restore(a,h);
c.effects.removeWrapper(a);
d.callback&&d.callback.apply(this,arguments);
a.dequeue();
}});
});
};
})(jQuery);
(function(j){j.effects.explode=function(a){return this.queue(function(){var c=a.options.pieces?Math.round(Math.sqrt(a.options.pieces)):3,d=a.options.pieces?Math.round(Math.sqrt(a.options.pieces)):3;
a.options.mode=a.options.mode=="toggle"?j(this).is(":visible")?"hide":"show":a.options.mode;
var b=j(this).show().css("visibility","hidden"),g=b.offset();
g.top-=parseInt(b.css("marginTop"),10)||0;
g.left-=parseInt(b.css("marginLeft"),10)||0;
for(var h=b.outerWidth(true),i=b.outerHeight(true),e=0;
e<c;
e++){for(var f=0;
f<d;
f++){b.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-f*(h/d),top:-e*(i/c)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:h/d,height:i/c,left:g.left+f*(h/d)+(a.options.mode=="show"?(f-Math.floor(d/2))*(h/d):0),top:g.top+e*(i/c)+(a.options.mode=="show"?(e-Math.floor(c/2))*(i/c):0),opacity:a.options.mode=="show"?0:1}).animate({left:g.left+f*(h/d)+(a.options.mode=="show"?0:(f-Math.floor(d/2))*(h/d)),top:g.top+e*(i/c)+(a.options.mode=="show"?0:(e-Math.floor(c/2))*(i/c)),opacity:a.options.mode=="show"?1:0},a.duration||500);
}}setTimeout(function(){a.options.mode=="show"?b.css({visibility:"visible"}):b.css({visibility:"visible"}).hide();
a.callback&&a.callback.apply(b[0]);
b.dequeue();
j("div.ui-effects-explode").remove();
},a.duration||500);
});
};
})(jQuery);
(function(b){b.effects.fade=function(a){return this.queue(function(){var c=b(this),d=b.effects.setMode(c,a.options.mode||"hide");
c.animate({opacity:d},{queue:false,duration:a.duration,easing:a.options.easing,complete:function(){a.callback&&a.callback.apply(this,arguments);
c.dequeue();
}});
});
};
})(jQuery);
(function(c){c.effects.fold=function(a){return this.queue(function(){var b=c(this),j=["position","top","bottom","left","right"],d=c.effects.setMode(b,a.options.mode||"hide"),g=a.options.size||15,h=!!a.options.horizFirst,k=a.duration?a.duration/2:c.fx.speeds._default/2;
c.effects.save(b,j);
b.show();
var e=c.effects.createWrapper(b).css({overflow:"hidden"}),f=d=="show"!=h,l=f?["width","height"]:["height","width"];
f=f?[e.width(),e.height()]:[e.height(),e.width()];
var i=/([0-9]+)%/.exec(g);
if(i){g=parseInt(i[1],10)/100*f[d=="hide"?0:1];
}if(d=="show"){e.css(h?{height:0,width:g}:{height:g,width:0});
}h={};
i={};
h[l[0]]=d=="show"?f[0]:g;
i[l[1]]=d=="show"?f[1]:0;
e.animate(h,k,a.options.easing).animate(i,k,a.options.easing,function(){d=="hide"&&b.hide();
c.effects.restore(b,j);
c.effects.removeWrapper(b);
a.callback&&a.callback.apply(b[0],arguments);
b.dequeue();
});
});
};
})(jQuery);
(function(b){b.effects.highlight=function(c){return this.queue(function(){var a=b(this),e=["backgroundImage","backgroundColor","opacity"],d=b.effects.setMode(a,c.options.mode||"show"),f={backgroundColor:a.css("backgroundColor")};
if(d=="hide"){f.opacity=0;
}b.effects.save(a,e);
a.show().css({backgroundImage:"none",backgroundColor:c.options.color||"#ffff99"}).animate(f,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){d=="hide"&&a.hide();
b.effects.restore(a,e);
d=="show"&&!b.support.opacity&&this.style.removeAttribute("filter");
c.callback&&c.callback.apply(this,arguments);
a.dequeue();
}});
});
};
})(jQuery);
(function(d){d.effects.pulsate=function(a){return this.queue(function(){var b=d(this),c=d.effects.setMode(b,a.options.mode||"show");
times=(a.options.times||5)*2-1;
duration=a.duration?a.duration/2:d.fx.speeds._default/2;
isVisible=b.is(":visible");
animateTo=0;
if(!isVisible){b.css("opacity",0).show();
animateTo=1;
}if(c=="hide"&&isVisible||c=="show"&&!isVisible){times--;
}for(c=0;
c<times;
c++){b.animate({opacity:animateTo},duration,a.options.easing);
animateTo=(animateTo+1)%2;
}b.animate({opacity:animateTo},duration,a.options.easing,function(){animateTo==0&&b.hide();
a.callback&&a.callback.apply(this,arguments);
});
b.queue("fx",function(){b.dequeue();
}).dequeue();
});
};
})(jQuery);
(function(c){c.effects.puff=function(b){return this.queue(function(){var a=c(this),e=c.effects.setMode(a,b.options.mode||"hide"),g=parseInt(b.options.percent,10)||150,h=g/100,i={height:a.height(),width:a.width()};
c.extend(b.options,{fade:true,mode:e,percent:e=="hide"?g:100,from:e=="hide"?i:{height:i.height*h,width:i.width*h}});
a.effect("scale",b.options,b.duration,b.callback);
a.dequeue();
});
};
c.effects.scale=function(b){return this.queue(function(){var a=c(this),e=c.extend(true,{},b.options),g=c.effects.setMode(a,b.options.mode||"effect"),h=parseInt(b.options.percent,10)||(parseInt(b.options.percent,10)==0?0:g=="hide"?0:100),i=b.options.direction||"both",f=b.options.origin;
if(g!="effect"){e.origin=f||["middle","center"];
e.restore=true;
}f={height:a.height(),width:a.width()};
a.from=b.options.from||(g=="show"?{height:0,width:0}:f);
h={y:i!="horizontal"?h/100:1,x:i!="vertical"?h/100:1};
a.to={height:f.height*h.y,width:f.width*h.x};
if(b.options.fade){if(g=="show"){a.from.opacity=0;
a.to.opacity=1;
}if(g=="hide"){a.from.opacity=1;
a.to.opacity=0;
}}e.from=a.from;
e.to=a.to;
e.mode=g;
a.effect("size",e,b.duration,b.callback);
a.dequeue();
});
};
c.effects.size=function(b){return this.queue(function(){var a=c(this),e=["position","top","bottom","left","right","width","height","overflow","opacity"],g=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],i=["fontSize"],f=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],k=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=c.effects.setMode(a,b.options.mode||"effect"),n=b.options.restore||false,m=b.options.scale||"both",l=b.options.origin,j={height:a.height(),width:a.width()};
a.from=b.options.from||j;
a.to=b.options.to||j;
if(l){l=c.effects.getBaseline(l,j);
a.from.top=(j.height-a.from.height)*l.y;
a.from.left=(j.width-a.from.width)*l.x;
a.to.top=(j.height-a.to.height)*l.y;
a.to.left=(j.width-a.to.width)*l.x;
}var d={from:{y:a.from.height/j.height,x:a.from.width/j.width},to:{y:a.to.height/j.height,x:a.to.width/j.width}};
if(m=="box"||m=="both"){if(d.from.y!=d.to.y){e=e.concat(f);
a.from=c.effects.setTransition(a,f,d.from.y,a.from);
a.to=c.effects.setTransition(a,f,d.to.y,a.to);
}if(d.from.x!=d.to.x){e=e.concat(k);
a.from=c.effects.setTransition(a,k,d.from.x,a.from);
a.to=c.effects.setTransition(a,k,d.to.x,a.to);
}}if(m=="content"||m=="both"){if(d.from.y!=d.to.y){e=e.concat(i);
a.from=c.effects.setTransition(a,i,d.from.y,a.from);
a.to=c.effects.setTransition(a,i,d.to.y,a.to);
}}c.effects.save(a,n?e:g);
a.show();
c.effects.createWrapper(a);
a.css("overflow","hidden").css(a.from);
if(m=="content"||m=="both"){f=f.concat(["marginTop","marginBottom"]).concat(i);
k=k.concat(["marginLeft","marginRight"]);
h=e.concat(f).concat(k);
a.find("*[width]").each(function(){child=c(this);
n&&c.effects.save(child,h);
var o={height:child.height(),width:child.width()};
child.from={height:o.height*d.from.y,width:o.width*d.from.x};
child.to={height:o.height*d.to.y,width:o.width*d.to.x};
if(d.from.y!=d.to.y){child.from=c.effects.setTransition(child,f,d.from.y,child.from);
child.to=c.effects.setTransition(child,f,d.to.y,child.to);
}if(d.from.x!=d.to.x){child.from=c.effects.setTransition(child,k,d.from.x,child.from);
child.to=c.effects.setTransition(child,k,d.to.x,child.to);
}child.css(child.from);
child.animate(child.to,b.duration,b.options.easing,function(){n&&c.effects.restore(child,h);
});
});
}a.animate(a.to,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){a.to.opacity===0&&a.css("opacity",a.from.opacity);
p=="hide"&&a.hide();
c.effects.restore(a,n?e:g);
c.effects.removeWrapper(a);
b.callback&&b.callback.apply(this,arguments);
a.dequeue();
}});
});
};
})(jQuery);
(function(d){d.effects.shake=function(a){return this.queue(function(){var b=d(this),j=["position","top","bottom","left","right"];
d.effects.setMode(b,a.options.mode||"effect");
var c=a.options.direction||"left",e=a.options.distance||20,l=a.options.times||3,f=a.duration||a.options.duration||140;
d.effects.save(b,j);
b.show();
d.effects.createWrapper(b);
var g=c=="up"||c=="down"?"top":"left",h=c=="up"||c=="left"?"pos":"neg";
c={};
var i={},k={};
c[g]=(h=="pos"?"-=":"+=")+e;
i[g]=(h=="pos"?"+=":"-=")+e*2;
k[g]=(h=="pos"?"-=":"+=")+e*2;
b.animate(c,f,a.options.easing);
for(e=1;
e<l;
e++){b.animate(i,f,a.options.easing).animate(k,f,a.options.easing);
}b.animate(i,f,a.options.easing).animate(c,f/2,a.options.easing,function(){d.effects.restore(b,j);
d.effects.removeWrapper(b);
a.callback&&a.callback.apply(this,arguments);
});
b.queue("fx",function(){b.dequeue();
});
b.dequeue();
});
};
})(jQuery);
(function(c){c.effects.slide=function(d){return this.queue(function(){var a=c(this),h=["position","top","bottom","left","right"],f=c.effects.setMode(a,d.options.mode||"show"),b=d.options.direction||"left";
c.effects.save(a,h);
a.show();
c.effects.createWrapper(a).css({overflow:"hidden"});
var g=b=="up"||b=="down"?"top":"left";
b=b=="up"||b=="left"?"pos":"neg";
var e=d.options.distance||(g=="top"?a.outerHeight({margin:true}):a.outerWidth({margin:true}));
if(f=="show"){a.css(g,b=="pos"?isNaN(e)?"-"+e:-e:e);
}var i={};
i[g]=(f=="show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+e;
a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&a.hide();
c.effects.restore(a,h);
c.effects.removeWrapper(a);
d.callback&&d.callback.apply(this,arguments);
a.dequeue();
}});
});
};
})(jQuery);
(function(e){e.effects.transfer=function(a){return this.queue(function(){var b=e(this),c=e(a.options.to),d=c.offset();
c={top:d.top,left:d.left,height:c.innerHeight(),width:c.innerWidth()};
d=b.offset();
var f=e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(a.options.className).css({top:d.top,left:d.left,height:b.innerHeight(),width:b.innerWidth(),position:"absolute"}).animate(c,a.duration,a.options.easing,function(){f.remove();
a.callback&&a.callback.apply(b[0],arguments);
b.dequeue();
});
});
};
})(jQuery);
function _g(i){return document.getElementById(i);
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
},gns:function(e){var a=e.nextSibling;
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
Util.Detect=function(){return{gecko:function(){return navigator.product==="Gecko";
},webkit:function(){return new RegExp(" AppleWebKit/").test(navigator.userAgent);
},webkitmob:function(){if(this.webkit()&&new RegExp(" Mobile/").test(navigator.userAgent)){var f=new RegExp("(Mozilla/5.0 \\()([^;]+)").exec(navigator.userAgent);
return(!f||f.length<3);
}},ie6:function(){return typeof document.all!=="undefined"&&typeof window.XMLHttpRequest==="undefined"&&typeof document.body.style.maxWidth==="undefined";
}};
}();
Util.i18n=function(){var _i={};
function fu(n,o){var b=_i[n]||{};
_i[n]=Util.mo(b,o,true);
}return{set:function(n,o){if(!n){return null;
}fu(n,o);
return _i[n];
},setString:function(n,k,s){if(!n||!k){return null;
}s=s||"";
var o={};
o[k]=s;
fu(n,o);
return _i[n];
},get:function(n){return _i[n]||{};
},getString:function(n,k){return this.get(n)[k]||"";
},getNamespaces:function(){var n=[],a=0,i;
for(i in _i){n[a++]=i;
}return n;
}};
}();
Util.Load=function(){var U=Util,c=false,e=[],d=document,w=window,t,s,l,rs,dm,am,sc=U.ce("LINK");
if(sc){sc.rel="script";
sc.href="javascript:void(0);";
sc.id="__onload";
_gbt("HEAD")[0].appendChild(sc);
s=_g("__onload");
}l=function(){if(t){clearInterval(t);
t=null;
}for(var i=0;
i<e.length;
i++){e[i].call(this);
}dm();
e=[];
c=true;
};
rs=function(){if(/loaded|complete/.test(d.readyState)){l();
}};
dm=function(){var r=U.removeEvent;
clearInterval(t);
r(w,"load",l);
r(d,"DOMContentLoaded",l);
if(sc){r(sc,"readystatechange",rs);
}};
am=function(){var a=U.addEvent;
a(w,"load",l);
a(d,"DOMContentLoaded",l);
if(sc){a(sc,"readystatechange",rs);
}if(d.readyState){t=setInterval(function(){rs();
},10);
}};
am();
return{add:function(f){if(c){if(U.Detect.webkit()){setTimeout(f,1);
}else{f.call();
}return;
}e.push(f);
}};
}();
Util.Pos=function(){return{gso:function(){var d=document,b=d.body,w=window,e=d.documentElement,et=e.scrollTop,bt=b.scrollTop,el=e.scrollLeft,bl=b.scrollLeft;
if(typeof w.pageYOffset==="number"){return[w.pageYOffset,w.pageXOffset];
}if(typeof et==="number"){if(bt>et||bl>el){return[bt,bl];
}return[et,el];
}return[bt,bl];
},goo:function(e){if(e){return[e.offsetTop,e.offsetLeft,e.offsetHeight,e.offsetWidth];
}return[0,0,0,0];
},gop:function(e){var l=0,t=0;
if(e.offsetParent){l=e.offsetLeft;
t=e.offsetTop;
e=e.offsetParent;
while(e){l+=e.offsetLeft;
t+=e.offsetTop;
e=e.offsetParent;
}}return[t,l];
},gvs:function(){var n=window,d=document,b=d.body,e=d.documentElement;
if(typeof n.innerWidth!=="undefined"){return[n.innerHeight,n.innerWidth];
}else{if(typeof e!=="undefined"&&typeof e.clientWidth!=="undefined"&&e.clientWidth!==0){return[e.clientHeight,e.clientWidth];
}else{return[b.clientHeight,b.clientWidth];
}}}};
}();
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
Util.Timeout=function(){var _d={duration:5,restart:true,confirm:false,namespace:"Timeout",key:"Warning",warning:"",url:null},_o=_d,_t;
function fs(o){var p,n={};
for(p in _o){if(p){n[p]=o[p]!==undefined?o[p]:_o[p];
}}return n;
}function fe(e){var s=_gbt("SCRIPT",e);
for(var i=0;
i<s.length;
++i){eval(s[i].innerHTML);
}}function fr(t){if(t&&t.length>0){var d=Util.ce("DIV"),y=d.style;
y.position="absolute";
y.visibility="hidden";
Util.ac(d,document.body);
d.innerHTML=t;
fe(d);
}}function fst(){if(!_o.url){return;
}_t=setTimeout(fc,(_o.duration*60*1000));
}function fc(){var s=_o.warning.length>0?_o.warning:Util.i18n.getString(_o.namespace,_o.key);
if(_o.confirm&&confirm(s)){Ajax.load(_o.url,fr);
}else{alert(s);
Ajax.load(_o.url,fr);
}if(_o.restart){fst();
}}return{setup:function(u,o){if(!u){return;
}o.url=u;
_o=fs(o);
},reset:function(){_o=_d;
},start:function(){fst();
},cancel:function(){clearTimeout(_t);
}};
}();
Util.Convert=function(){var _a;
function _c(){if(!_a){var _b=document.body;
_a=Util.ce("DIV");
var s=_a.style;
s.position="absolute";
s.left=s.top="-999px";
s.height="100em";
s.width="1px";
s.innerHTML="&nbsp;";
s.background="#FFF";
_b.insertBefore(_a,Util.gc(_b));
}return _a;
}return{px2em:function(p){return(p/_c().offsetHeight)*100;
},em2px:function(e){return Math.round((e*_c().offsetHeight)/100);
}};
}();
var Ajax;
function XmlHttpObject(){function _g(){var x=null;
if(window.XMLHttpRequest){x=new XMLHttpRequest();
}else{if(window.ActiveXObject){x=new ActiveXObject("MSXML2.XMLHTTP.3.0");
}}return x;
}var x=_g();
function _l(u,c,eh,p){try{var s=u.split("?"),ps=s[1]||"";
x.open(p?"POST":"GET",p?s[0]:u,true);
x.onreadystatechange=c;
x.setRequestHeader("XMLHttpRequest","true");
if(p){x.setRequestHeader("Content-type","application/x-www-form-urlencoded");
x.setRequestHeader("Content-length",ps.length);
x.setRequestHeader("Connection","close");
x.send(ps);
}else{x.send(null);
}}catch(e){if(eh){try{eh.call(this,e);
}catch(e2){throw e2;
}}}}return{postContent:function(url,cb,eh){_l(url,cb,eh,true);
},loadContent:function(url,cb,eh){_l(url,cb,eh,0);
},status:function(){return x.status;
},statusText:function(){return x.statusText;
},readyState:function(){return x.readyState;
},responseText:function(){return x.responseText;
},ready:function(){return this.readyState()===4;
},loaded:function(){var s=this.status();
return Ajax.local?s===200||s===0:s===200;
}};
}Ajax=function(){function _bu(o,b,a,s){var u="";
for(var i=0;
i<o.length;
++i){var e=o[i],t=e.type,v=null;
if(t=="select-one"||t=="select-multiple"){for(var q=0;
q<e.options.length;
++q){var r=e.options[q];
if(r.selected){v=r.value;
break;
}}}else{if(t=="radio"||t=="checkbox"){if(!e.checked){continue;
}}else{if(t=="file"||t=="reset"){continue;
}else{if(t=="submit"&&s&&e!=s){continue;
}}}}if(e.name){u+=u!==""?"&":"";
v=v===null?e.value:v;
u+=e.name+"="+encodeURIComponent(v);
}}return b?a+"?"+u:u;
}function _exs(e){var s=_gbt("SCRIPT",e);
for(var i=0;
i<s.length;
++i){eval(s[i].innerHTML);
}}function fl(u,f,e,ps){var x=new XmlHttpObject();
var r=function(r){var n=new Ajax.Error(x,r);
if(e){e.call(this,n);
}else{throw n.error;
}};
var c=function(){try{if(x.ready()){if(x.loaded()){if(f){f.call(this,x.responseText());
}}else{r.call(this);
}}}catch(e){r.call(this,e,x);
}},v=ps?function(){x.postContent(u,c,r);
}:function(){x.loadContent(u,c,r);
};
if(Ajax.local){setTimeout(v,1000);
}else{v();
}}function fp(u,o,f,e,p){if(!u&&!o){return null;
}p=p||{};
var U=Util,S=U.Style,r=("clear" in p)?p.clear:false,s=("wait" in p)?p.wait:true,n=function(t){S.rcss(o,"wait");
o.innerHTML=t;
_exs(o);
if(f){f.call(this,t);
}};
if(s){S.acss(o,"wait");
}if(r){var c=U.gc(o);
while(c){o.removeChild(c);
c=U.gc(o);
}}function ee(err){S.rcss(o,"wait");
if(e){e.call(this,err);
}}return fl(u,n,ee,p.post);
}return{local:false,load:function(u,f,e){fl(u,f,e,0);
},post:function(u,f,e){fl(u,f,e,true);
},place:function(u,o,f,e,p){fp(u,o,f,e,p);
},getFormParams:function(f,b,s){return _bu(f.elements,b,b?f.action:"",s);
},getFSParams:function(f,s){var u=_bu(_gbt("input",f),false,"",s),r=_bu(_gbt("select",f),false,"");
return u===""?r:u+(r!==""?"&":"")+r;
}};
}();
Ajax.Error=function(x,e){return{xmlHttp:x,error:e,message:function(){return"[JavaScript Error] "+(this.errorError()||"None")+", [XMLHttp Error] "+(this.xmlError()||"None");
},errorError:function(){return e?e.message:null;
},xmlError:function(){try{if(!x){return"XMLHTTP object is null";
}else{var s=x.status();
return"Status: "+(s===undefined?"unknown":s)+", Ready State: "+(x.readyState()||"unknown")+", Response: "+(x.responseText()||"unknown");
}}catch(e){return e.message;
}}};
};
function Animator(o){var _a=[],_t=0,_s=0,_lt,_n,_p={inv:15,dur:450,trans:Animator.TX.linear,step:function(){},fin:function(){}};
function fs(o){var p,n={};
for(p in _p){if(p){n[p]=o[p]!==undefined?o[p]:_p[p];
}}return n;
}function fg(){var v=_p.trans(_s);
for(var i=0;
i<_a.length;
i++){_a[i].set(v);
if(_t!=_s){_a[i].step.call(this);
}else{_a[i].fin.call(this);
}}}function fot(){var n=new Date().getTime(),d=n-_lt,m=(d/_p.dur)*(_s<_t?1:-1);
_lt=n;
if(Math.abs(m)>=Math.abs(_s-_t)){_s=_t;
}else{_s+=m;
}try{fg();
}finally{_p.step.call(this);
if(_t==_s){window.clearInterval(_n);
_n=null;
_p.fin.call(this);
}}}function fft(from,to){_t=Math.max(0,Math.min(1,to));
_s=Math.max(0,Math.min(1,from));
_lt=new Date().getTime();
if(!_n){_n=window.setInterval(fot,_p.inv);
}}function ft(to){fft(_s,to);
}o=o||{};
_p=fs(o);
return{toggle:function(){ft(1-_t);
},add:function(a){_a[_a.length]=a;
return this;
},clear:function(){_a=[];
_lt=null;
},play:function(){fft(0,1);
},reverse:function(){fft(1,0);
},setOptions:function(o){_p=fs(o);
},getOptions:function(){return _p;
}};
}Animator.Queue=function(as){var a=false;
function ft(e){if(e===null){return[];
}if(e.tagName||!e.length){return[e];
}return e;
}function fp(o1,o2){o1.setOptions({fin:function(){o1._of.call();
o2.play();
}});
}function fr(o1,o2){o1.setOptions({fin:function(){o2.reverse();
o1._of.call();
}});
}function fl(o){var p=o.getOptions(),f=p.fin;
o.setOptions({fin:function(){a=false;
f.call();
for(var i=0;
i<as.length;
i++){as[i].setOptions({fin:as[i]._of});
}}});
}ft(as);
for(var i=0;
i<as.length;
i++){as[i]._of=as[i].getOptions().fin;
}return{play:function(){if(a){return;
}a=true;
for(var i=0;
i<as.length-1;
i++){fp(as[i],as[i+1]);
}fl(as[as.length-1]);
as[0].play();
},reverse:function(){if(a){return;
}a=true;
for(var i=as.length-1;
i>0;
i--){fr(as[i],as[i-1]);
}fl(as[0]);
as[as.length-1].reverse();
}};
};
Animator.TX=function(){function ei(a){a=a||1;
return function(s){return Math.pow(s,a*2);
};
}function eo(a){a=a||1;
return function(s){return 1-Math.pow(1-s,a*2);
};
}function el(a){return function(s){s=Animator.TX.easeInOut(s);
return((1-Math.cos(s*Math.PI*a))*(1-s))+s;
};
}return{linear:function(x){return x;
},easeIn:ei(1.5),easeOut:eo(1.5),strongEaseIn:ei(2.5),strongEaseOut:eo(2.5),easeInOut:function(pos){return((-Math.cos(pos*Math.PI)/2)+0.5);
},elastic:el(1),veryElastic:el(3)};
}();
Animator.Animation=function(set,step,fin){return{set:set||function(){},step:step||function(){},fin:fin||function(){}};
};
Animator.Animations=function(){function ft(e){if(e===null){return[];
}if(e.tagName||!e.length){return[e];
}return e;
}return{Numeric:function(es,p,f,t,u,o){var ff,tf;
es=ft(es);
u=u||"px";
o=o||{};
if(typeof f==="function"){ff=function(){return f();
};
}else{ff=function(){return f;
};
}if(typeof t==="function"){tf=function(){return t();
};
}else{tf=function(){return t;
};
}var set=function(v){for(var i=0;
i<es.length;
i++){var x=ff()+((tf()-ff())*v);
if(o.enf0){x=x<0?0:x;
}es[i].style[p]=x+u;
}};
var step=o.step||function(){};
var fin=function(){if(o.fin){o.fin.call(this);
}};
return new Animator.Animation(set,step,fin);
},Color:function(es,p,f,t){function fca(c){return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];
}function fh(n){n=n>255?255:n;
var d=n.toString(16);
if(n<16){return"0"+d;
}return d;
}function fp(i,s){return Math.round(f[i]+((t[i]-f[i])*s));
}var set=function(state){var c="#"+fh(fp(0,state))+fh(fp(1,state))+fh(fp(2,state));
for(var i=0;
i<es.length;
i++){es[i].style[p]=c;
}};
var fin=function(){for(var i=0;
i<es.length;
i++){es[i].style[p]=t;
}};
es=ft(es);
for(var i=0;
i<es.length;
i++){es[i].style[p]=f;
}t=fca(t);
f=fca(f);
return new Animator.Animation(set,null,fin);
},Opacity:function(es,f,t){es=ft(es);
function st(v){for(var i=0;
i<es.length;
i++){var e=es[i].style,x=f+(t-f)*v;
e.opacity=e.mozOpacity=x;
e.zoom=1;
e.filter=x===1?"":"alpha(opacity="+x*100+")";
}}function fin(){for(var i=0;
i<es.length;
i++){var e=es[i].style;
if(e.opacity===1){e.filter="";
}}}return new Animator.Animation(st,null,fin);
}};
}();
(function(){function q(a,c,d){if(a===c){return a!==0||1/a==1/c;
}if(a==null){return a===c;
}var e=typeof a;
if(e!=typeof c){return false;
}if(!a!=!c){return false;
}if(b.isNaN(a)){return b.isNaN(c);
}var f=b.isString(a),g=b.isString(c);
if(f||g){return f&&g&&String(a)==String(c);
}f=b.isNumber(a);
g=b.isNumber(c);
if(f||g){return f&&g&&+a==+c;
}f=b.isBoolean(a);
g=b.isBoolean(c);
if(f||g){return f&&g&&+a==+c;
}f=b.isDate(a);
g=b.isDate(c);
if(f||g){return f&&g&&a.getTime()==c.getTime();
}f=b.isRegExp(a);
g=b.isRegExp(c);
if(f||g){return f&&g&&a.source==c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase;
}if(e!="object"){return false;
}if(a._chain){a=a._wrapped;
}if(c._chain){c=c._wrapped;
}if(b.isFunction(a.isEqual)){return a.isEqual(c);
}for(e=d.length;
e--;
){if(d[e]==a){return true;
}}d.push(a);
e=0;
f=true;
if(a.length===+a.length||c.length===+c.length){if(e=a.length,f=e==c.length){for(;
e--;
){if(!(f=e in a==e in c&&q(a[e],c[e],d))){break;
}}}}else{for(var h in a){if(l.call(a,h)&&(e++,!(f=l.call(c,h)&&q(a[h],c[h],d)))){break;
}}if(f){for(h in c){if(l.call(c,h)&&!e--){break;
}}f=!e;
}}d.pop();
return f;
}var r=this,F=r._,n={},k=Array.prototype,o=Object.prototype,i=k.slice,G=k.unshift,u=o.toString,l=o.hasOwnProperty,v=k.forEach,w=k.map,x=k.reduce,y=k.reduceRight,z=k.filter,A=k.every,B=k.some,p=k.indexOf,C=k.lastIndexOf,o=Array.isArray,H=Object.keys,s=Function.prototype.bind,b=function(a){return new m(a);
};
typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):r._=b;
b.VERSION="1.2.0";
var j=b.each=b.forEach=function(a,c,b){if(a!=null){if(v&&a.forEach===v){a.forEach(c,b);
}else{if(a.length===+a.length){for(var e=0,f=a.length;
e<f;
e++){if(e in a&&c.call(b,a[e],e,a)===n){break;
}}}else{for(e in a){if(l.call(a,e)&&c.call(b,a[e],e,a)===n){break;
}}}}}};
b.map=function(a,c,b){var e=[];
if(a==null){return e;
}if(w&&a.map===w){return a.map(c,b);
}j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h);
});
return e;
};
b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=d!==void 0;
a==null&&(a=[]);
if(x&&a.reduce===x){return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);
}j(a,function(a,b,i){f?d=c.call(e,d,a,b,i):(d=a,f=true);
});
if(!f){throw new TypeError("Reduce of empty array with no initial value");
}return d;
};
b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);
if(y&&a.reduceRight===y){return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);
}a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();
return b.reduce(a,c,d,e);
};
b.find=b.detect=function(a,c,b){var e;
D(a,function(a,g,h){if(c.call(b,a,g,h)){return e=a,true;
}});
return e;
};
b.filter=b.select=function(a,c,b){var e=[];
if(a==null){return e;
}if(z&&a.filter===z){return a.filter(c,b);
}j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a);
});
return e;
};
b.reject=function(a,c,b){var e=[];
if(a==null){return e;
}j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a);
});
return e;
};
b.every=b.all=function(a,c,b){var e=true;
if(a==null){return e;
}if(A&&a.every===A){return a.every(c,b);
}j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h))){return n;
}});
return e;
};
var D=b.some=b.any=function(a,c,d){var c=c||b.identity,e=false;
if(a==null){return e;
}if(B&&a.some===B){return a.some(c,d);
}j(a,function(a,b,h){if(e|=c.call(d,a,b,h)){return n;
}});
return !!e;
};
b.include=b.contains=function(a,c){var b=false;
if(a==null){return b;
}if(p&&a.indexOf===p){return a.indexOf(c)!=-1;
}D(a,function(a){if(b=a===c){return true;
}});
return b;
};
b.invoke=function(a,c){var d=i.call(arguments,2);
return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d);
});
};
b.pluck=function(a,c){return b.map(a,function(a){return a[c];
});
};
b.max=function(a,c,d){if(!c&&b.isArray(a)){return Math.max.apply(Math,a);
}if(!c&&b.isEmpty(a)){return -Infinity;
}var e={computed:-Infinity};
j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;
b>=e.computed&&(e={value:a,computed:b});
});
return e.value;
};
b.min=function(a,c,d){if(!c&&b.isArray(a)){return Math.min.apply(Math,a);
}if(!c&&b.isEmpty(a)){return Infinity;
}var e={computed:Infinity};
j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;
b<e.computed&&(e={value:a,computed:b});
});
return e.value;
};
b.shuffle=function(a){var c=[],b;
j(a,function(a,f){f==0?c[0]=a:(b=Math.floor(Math.random()*(f+1)),c[f]=c[b],c[b]=a);
});
return c;
};
b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)};
}).sort(function(a,b){var c=a.criteria,d=b.criteria;
return c<d?-1:c>d?1:0;
}),"value");
};
b.groupBy=function(a,b){var d={};
j(a,function(a,f){var g=b(a,f);
(d[g]||(d[g]=[])).push(a);
});
return d;
};
b.sortedIndex=function(a,c,d){d||(d=b.identity);
for(var e=0,f=a.length;
e<f;
){var g=e+f>>1;
d(a[g])<d(c)?e=g+1:f=g;
}return e;
};
b.toArray=function(a){return !a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):b.values(a);
};
b.size=function(a){return b.toArray(a).length;
};
b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0];
};
b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b));
};
b.last=function(a,b,d){return b!=null&&!d?i.call(a,a.length-b):a[a.length-1];
};
b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b);
};
b.compact=function(a){return b.filter(a,function(a){return !!a;
});
};
b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d)){return a.concat(b.flatten(d));
}a[a.length]=d;
return a;
},[]);
};
b.without=function(a){return b.difference(a,i.call(arguments,1));
};
b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];
b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g))){d[d.length]=g,e[e.length]=a[h];
}return d;
},[]);
return e;
};
b.union=function(){return b.uniq(b.flatten(arguments));
};
b.intersection=b.intersect=function(a){var c=i.call(arguments,1);
return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0;
});
});
};
b.difference=function(a,c){return b.filter(a,function(a){return !b.include(c,a);
});
};
b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;
e<c;
e++){d[e]=b.pluck(a,""+e);
}return d;
};
b.indexOf=function(a,c,d){if(a==null){return -1;
}var e;
if(d){return d=b.sortedIndex(a,c),a[d]===c?d:-1;
}if(p&&a.indexOf===p){return a.indexOf(c);
}for(d=0,e=a.length;
d<e;
d++){if(a[d]===c){return d;
}}return -1;
};
b.lastIndexOf=function(a,b){if(a==null){return -1;
}if(C&&a.lastIndexOf===C){return a.lastIndexOf(b);
}for(var d=a.length;
d--;
){if(a[d]===b){return d;
}}return -1;
};
b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);
for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);
f<e;
){g[f++]=a,a+=d;
}return g;
};
b.bind=function(a,b){if(a.bind===s&&s){return s.apply(a,i.call(arguments,1));
}var d=i.call(arguments,2);
return function(){return a.apply(b,d.concat(i.call(arguments)));
};
};
b.bindAll=function(a){var c=i.call(arguments,1);
c.length==0&&(c=b.functions(a));
j(c,function(c){a[c]=b.bind(a[c],a);
});
return a;
};
b.memoize=function(a,c){var d={};
c||(c=b.identity);
return function(){var b=c.apply(this,arguments);
return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments);
};
};
b.delay=function(a,b){var d=i.call(arguments,2);
return setTimeout(function(){return a.apply(a,d);
},b);
};
b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)));
};
var E=function(a,b,d){var e;
return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g);
};
d&&clearTimeout(e);
if(d||!e){e=setTimeout(h,b);
}};
};
b.throttle=function(a,b){return E(a,b,false);
};
b.debounce=function(a,b){return E(a,b,true);
};
b.once=function(a){var b=false,d;
return function(){if(b){return d;
}b=true;
return d=a.apply(this,arguments);
};
};
b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));
return b.apply(this,d);
};
};
b.compose=function(){var a=i.call(arguments);
return function(){for(var b=i.call(arguments),d=a.length-1;
d>=0;
d--){b=[a[d].apply(this,b)];
}return b[0];
};
};
b.after=function(a,b){return function(){if(--a<1){return b.apply(this,arguments);
}};
};
b.keys=H||function(a){if(a!==Object(a)){throw new TypeError("Invalid object");
}var b=[],d;
for(d in a){l.call(a,d)&&(b[b.length]=d);
}return b;
};
b.values=function(a){return b.map(a,b.identity);
};
b.functions=b.methods=function(a){var c=[],d;
for(d in a){b.isFunction(a[d])&&c.push(d);
}return c.sort();
};
b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b){b[d]!==void 0&&(a[d]=b[d]);
}});
return a;
};
b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b){a[d]==null&&(a[d]=b[d]);
}});
return a;
};
b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a);
};
b.tap=function(a,b){b(a);
return a;
};
b.isEqual=function(a,b){return q(a,b,[]);
};
b.isEmpty=function(a){if(b.isArray(a)||b.isString(a)){return a.length===0;
}for(var c in a){if(l.call(a,c)){return false;
}}return true;
};
b.isElement=function(a){return !!(a&&a.nodeType==1);
};
b.isArray=o||function(a){return u.call(a)==="[object Array]";
};
b.isObject=function(a){return a===Object(a);
};
b.isArguments=function(a){return !(!a||!l.call(a,"callee"));
};
b.isFunction=function(a){return !(!a||!a.constructor||!a.call||!a.apply);
};
b.isString=function(a){return !!(a===""||a&&a.charCodeAt&&a.substr);
};
b.isNumber=function(a){return !!(a===0||a&&a.toExponential&&a.toFixed);
};
b.isNaN=function(a){return a!==a;
};
b.isBoolean=function(a){return a===true||a===false||u.call(a)=="[object Boolean]";
};
b.isDate=function(a){return !(!a||!a.getTimezoneOffset||!a.setUTCFullYear);
};
b.isRegExp=function(a){return !(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===false));
};
b.isNull=function(a){return a===null;
};
b.isUndefined=function(a){return a===void 0;
};
b.noConflict=function(){r._=F;
return this;
};
b.identity=function(a){return a;
};
b.times=function(a,b,d){for(var e=0;
e<a;
e++){b.call(d,e);
}};
b.escape=function(a){return(""+a).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;");
};
b.mixin=function(a){j(b.functions(a),function(c){I(c,b[c]=a[c]);
});
};
var J=0;
b.uniqueId=function(a){var b=J++;
return a?a+b:b;
};
b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape,function(a,b){return"',_.escape("+b.replace(/\\'/g,"'")+"),'";
}).replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'";
}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('";
}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",d=new Function("obj",d);
return c?d(c):d;
};
var m=function(a){this._wrapped=a;
};
b.prototype=m.prototype;
var t=function(a,c){return c?b(a).chain():a;
},I=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);
G.call(a,this._wrapped);
return t(c.apply(b,a),this._chain);
};
};
b.mixin(b);
j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];
m.prototype[a]=function(){b.apply(this._wrapped,arguments);
return t(this._wrapped,this._chain);
};
});
j(["concat","join","slice"],function(a){var b=k[a];
m.prototype[a]=function(){return t(b.apply(this._wrapped,arguments),this._chain);
};
});
m.prototype.chain=function(){this._chain=true;
return this;
};
m.prototype.value=function(){return this._wrapped;
};
})();
_.extendHelper=function(protoProps,classProps){var ctor=function(){};
var inherits=function(parent,protoProps,staticProps){var child;
if(protoProps&&protoProps.hasOwnProperty("constructor")){child=protoProps.constructor;
}else{child=function(){parent.apply(this,arguments);
};
}_.extend(child,parent);
ctor.prototype=parent.prototype;
child.prototype=new ctor();
if(protoProps){_.extend(child.prototype,protoProps);
}if(staticProps){_.extend(child,staticProps);
}child.prototype.constructor=child;
child.__super__=parent.prototype;
return child;
};
var child=inherits(this,protoProps,classProps);
child.inherit=this.inherit;
return child;
};
var handlebars=(function(){var parser={trace:function trace(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,statements:6,simpleInverse:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,inMustache:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,OPEN_PARTIAL:24,params:25,hash:26,param:27,STRING:28,hashSegments:29,hashSegment:30,ID:31,EQUALS:32,pathSegments:33,SEP:34,"$accept":0,"$end":1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",31:"ID",32:"EQUALS",34:"SEP"},productions_:[0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[26,1],[29,2],[29,1],[30,3],[30,3],[21,1],[33,3],[33,1]],performAction:function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$){var $0=$$.length-1;
switch(yystate){case 1:return $$[$0-1];
break;
case 2:this.$=new yy.ProgramNode($$[$0-2],$$[$0]);
break;
case 3:this.$=new yy.ProgramNode($$[$0]);
break;
case 4:this.$=new yy.ProgramNode([]);
break;
case 5:this.$=[$$[$0]];
break;
case 6:$$[$0-1].push($$[$0]);
this.$=$$[$0-1];
break;
case 7:this.$=new yy.InverseNode($$[$0-2],$$[$0-1],$$[$0]);
break;
case 8:this.$=new yy.BlockNode($$[$0-2],$$[$0-1],$$[$0]);
break;
case 9:this.$=$$[$0];
break;
case 10:this.$=$$[$0];
break;
case 11:this.$=new yy.ContentNode($$[$0]);
break;
case 12:this.$=new yy.CommentNode($$[$0]);
break;
case 13:this.$=new yy.MustacheNode($$[$0-1][0],$$[$0-1][1]);
break;
case 14:this.$=new yy.MustacheNode($$[$0-1][0],$$[$0-1][1]);
break;
case 15:this.$=$$[$0-1];
break;
case 16:this.$=new yy.MustacheNode($$[$0-1][0],$$[$0-1][1]);
break;
case 17:this.$=new yy.MustacheNode($$[$0-1][0],$$[$0-1][1],true);
break;
case 18:this.$=new yy.PartialNode($$[$0-1]);
break;
case 19:this.$=new yy.PartialNode($$[$0-2],$$[$0-1]);
break;
case 20:break;
case 21:this.$=[[$$[$0-2]].concat($$[$0-1]),$$[$0]];
break;
case 22:this.$=[[$$[$0-1]].concat($$[$0]),null];
break;
case 23:this.$=[[$$[$0-1]],$$[$0]];
break;
case 24:this.$=[[$$[$0]],null];
break;
case 25:$$[$0-1].push($$[$0]);
this.$=$$[$0-1];
break;
case 26:this.$=[$$[$0]];
break;
case 27:this.$=$$[$0];
break;
case 28:this.$=new yy.StringNode($$[$0]);
break;
case 29:this.$=new yy.HashNode($$[$0]);
break;
case 30:$$[$0-1].push($$[$0]);
this.$=$$[$0-1];
break;
case 31:this.$=[$$[$0]];
break;
case 32:this.$=[$$[$0-2],$$[$0]];
break;
case 33:this.$=[$$[$0-2],new yy.StringNode($$[$0])];
break;
case 34:this.$=new yy.IdNode($$[$0]);
break;
case 35:$$[$0-2].push($$[$0]);
this.$=$$[$0-2];
break;
case 36:this.$=[$$[$0]];
break;
}},table:[{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,31:[1,25],33:24},{17:26,21:23,31:[1,25],33:24},{17:27,21:23,31:[1,25],33:24},{17:28,21:23,31:[1,25],33:24},{21:29,31:[1,25],33:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,31:[1,25],33:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:39,30:42,31:[1,43],33:24},{18:[2,34],28:[2,34],31:[2,34],34:[1,44]},{18:[2,36],28:[2,36],31:[2,36],34:[2,36]},{18:[1,45]},{18:[1,46]},{18:[1,47]},{18:[1,48],21:49,31:[1,25],33:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:50,31:[1,25],33:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:51,27:52,28:[1,41],29:39,30:42,31:[1,43],33:24},{18:[2,23]},{18:[2,26],28:[2,26],31:[2,26]},{18:[2,29],30:53,31:[1,54]},{18:[2,27],28:[2,27],31:[2,27]},{18:[2,28],28:[2,28],31:[2,28]},{18:[2,31],31:[2,31]},{18:[2,36],28:[2,36],31:[2,36],32:[1,55],34:[2,36]},{31:[1,56]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,57]},{18:[1,58]},{18:[2,21]},{18:[2,25],28:[2,25],31:[2,25]},{18:[2,30],31:[2,30]},{32:[1,55]},{21:59,28:[1,60],31:[1,25],33:24},{18:[2,35],28:[2,35],31:[2,35],34:[2,35]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,32],31:[2,32]},{18:[2,33],31:[2,33]}],defaultActions:{16:[2,1],37:[2,23],51:[2,21]},parseError:function parseError(str,hash){throw new Error(str);
},parse:function parse(input){var self=this,stack=[0],vstack=[null],lstack=[],table=this.table,yytext="",yylineno=0,yyleng=0,recovering=0,TERROR=2,EOF=1;
this.lexer.setInput(input);
this.lexer.yy=this.yy;
this.yy.lexer=this.lexer;
if(typeof this.lexer.yylloc=="undefined"){this.lexer.yylloc={};
}var yyloc=this.lexer.yylloc;
lstack.push(yyloc);
if(typeof this.yy.parseError==="function"){this.parseError=this.yy.parseError;
}function popStack(n){stack.length=stack.length-2*n;
vstack.length=vstack.length-n;
lstack.length=lstack.length-n;
}function lex(){var token;
token=self.lexer.lex()||1;
if(typeof token!=="number"){token=self.symbols_[token]||token;
}return token;
}var symbol,preErrorSymbol,state,action,a,r,yyval={},p,len,newState,expected;
while(true){state=stack[stack.length-1];
if(this.defaultActions[state]){action=this.defaultActions[state];
}else{if(symbol==null){symbol=lex();
}action=table[state]&&table[state][symbol];
}if(typeof action==="undefined"||!action.length||!action[0]){if(!recovering){expected=[];
for(p in table[state]){if(this.terminals_[p]&&p>2){expected.push("'"+this.terminals_[p]+"'");
}}var errStr="";
if(this.lexer.showPosition){errStr="Parse error on line "+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(", ");
}else{errStr="Parse error on line "+(yylineno+1)+": Unexpected "+(symbol==1?"end of input":("'"+(this.terminals_[symbol]||symbol)+"'"));
}this.parseError(errStr,{text:this.lexer.match,token:this.terminals_[symbol]||symbol,line:this.lexer.yylineno,loc:yyloc,expected:expected});
}if(recovering==3){if(symbol==EOF){throw new Error(errStr||"Parsing halted.");
}yyleng=this.lexer.yyleng;
yytext=this.lexer.yytext;
yylineno=this.lexer.yylineno;
yyloc=this.lexer.yylloc;
symbol=lex();
}while(1){if((TERROR.toString()) in table[state]){break;
}if(state==0){throw new Error(errStr||"Parsing halted.");
}popStack(1);
state=stack[stack.length-1];
}preErrorSymbol=symbol;
symbol=TERROR;
state=stack[stack.length-1];
action=table[state]&&table[state][TERROR];
recovering=3;
}if(action[0] instanceof Array&&action.length>1){throw new Error("Parse Error: multiple actions possible at state: "+state+", token: "+symbol);
}switch(action[0]){case 1:stack.push(symbol);
vstack.push(this.lexer.yytext);
lstack.push(this.lexer.yylloc);
stack.push(action[1]);
symbol=null;
if(!preErrorSymbol){yyleng=this.lexer.yyleng;
yytext=this.lexer.yytext;
yylineno=this.lexer.yylineno;
yyloc=this.lexer.yylloc;
if(recovering>0){recovering--;
}}else{symbol=preErrorSymbol;
preErrorSymbol=null;
}break;
case 2:len=this.productions_[action[1]][1];
yyval.$=vstack[vstack.length-len];
yyval._$={first_line:lstack[lstack.length-(len||1)].first_line,last_line:lstack[lstack.length-1].last_line,first_column:lstack[lstack.length-(len||1)].first_column,last_column:lstack[lstack.length-1].last_column};
r=this.performAction.call(yyval,yytext,yyleng,yylineno,this.yy,action[1],vstack,lstack);
if(typeof r!=="undefined"){return r;
}if(len){stack=stack.slice(0,-1*len*2);
vstack=vstack.slice(0,-1*len);
lstack=lstack.slice(0,-1*len);
}stack.push(this.productions_[action[1]][0]);
vstack.push(yyval.$);
lstack.push(yyval._$);
newState=table[stack[stack.length-2]][stack[stack.length-1]];
stack.push(newState);
break;
case 3:return true;
}}return true;
}};
var lexer=(function(){var lexer=({EOF:1,parseError:function parseError(str,hash){if(this.yy.parseError){this.yy.parseError(str,hash);
}else{throw new Error(str);
}},setInput:function(input){this._input=input;
this._more=this._less=this.done=false;
this.yylineno=this.yyleng=0;
this.yytext=this.matched=this.match="";
this.conditionStack=["INITIAL"];
this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};
return this;
},input:function(){var ch=this._input[0];
this.yytext+=ch;
this.yyleng++;
this.match+=ch;
this.matched+=ch;
var lines=ch.match(/\n/);
if(lines){this.yylineno++;
}this._input=this._input.slice(1);
return ch;
},unput:function(ch){this._input=ch+this._input;
return this;
},more:function(){this._more=true;
return this;
},pastInput:function(){var past=this.matched.substr(0,this.matched.length-this.match.length);
return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"");
},upcomingInput:function(){var next=this.match;
if(next.length<20){next+=this._input.substr(0,20-next.length);
}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"");
},showPosition:function(){var pre=this.pastInput();
var c=new Array(pre.length+1).join("-");
return pre+this.upcomingInput()+"\n"+c+"^";
},next:function(){if(this.done){return this.EOF;
}if(!this._input){this.done=true;
}var token,match,col,lines;
if(!this._more){this.yytext="";
this.match="";
}var rules=this._currentRules();
for(var i=0;
i<rules.length;
i++){match=this._input.match(this.rules[rules[i]]);
if(match){lines=match[0].match(/\n.*/g);
if(lines){this.yylineno+=lines.length;
}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-1:this.yylloc.last_column+match[0].length};
this.yytext+=match[0];
this.match+=match[0];
this.matches=match;
this.yyleng=this.yytext.length;
this._more=false;
this._input=this._input.slice(match[0].length);
this.matched+=match[0];
token=this.performAction.call(this,this.yy,this,rules[i],this.conditionStack[this.conditionStack.length-1]);
if(token){return token;
}else{return;
}}}if(this._input===""){return this.EOF;
}else{this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno});
}},lex:function lex(){var r=this.next();
if(typeof r!=="undefined"){return r;
}else{return this.lex();
}},begin:function begin(condition){this.conditionStack.push(condition);
},popState:function popState(){return this.conditionStack.pop();
},_currentRules:function _currentRules(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
}});
lexer.performAction=function anonymous(yy,yy_,$avoiding_name_collisions,YY_START){var YYSTATE=YY_START;
switch($avoiding_name_collisions){case 0:this.begin("mu");
if(yy_.yytext){return 14;
}break;
case 1:return 14;
break;
case 2:return 24;
break;
case 3:return 16;
break;
case 4:return 20;
break;
case 5:return 19;
break;
case 6:return 19;
break;
case 7:return 23;
break;
case 8:return 23;
break;
case 9:yy_.yytext=yy_.yytext.substr(3,yy_.yyleng-5);
this.begin("INITIAL");
return 15;
break;
case 10:return 22;
break;
case 11:return 32;
break;
case 12:return 31;
break;
case 13:return 31;
break;
case 14:return 34;
break;
case 15:break;
case 16:this.begin("INITIAL");
return 18;
break;
case 17:this.begin("INITIAL");
return 18;
break;
case 18:yy_.yytext=yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"');
return 28;
break;
case 19:return 31;
break;
case 20:return"INVALID";
break;
case 21:return 5;
break;
}};
lexer.rules=[/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^[a-zA-Z0-9_-]+(?=[=} /.])/,/^./,/^$/];
lexer.conditions={mu:{rules:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],inclusive:false},INITIAL:{rules:[0,1,21],inclusive:true}};
return lexer;
})();
parser.lexer=lexer;
return parser;
})();
if(typeof require!=="undefined"&&typeof exports!=="undefined"){exports.parser=handlebars;
exports.parse=function(){return handlebars.parse.apply(handlebars,arguments);
};
exports.main=function commonjsMain(args){if(!args[1]){throw new Error("Usage: "+args[0]+" FILE");
}if(typeof process!=="undefined"){var source=require("fs").readFileSync(require("path").join(process.cwd(),args[1]),"utf8");
}else{var cwd=require("file").path(require("file").cwd());
var source=cwd.join(args[1]).read({charset:"utf-8"});
}return exports.parser.parse(source);
};
if(typeof module!=="undefined"&&require.main===module){exports.main(typeof process!=="undefined"?process.argv.slice(1):require("system").args);
}}var Handlebars={};
Handlebars.VERSION="1.0.beta.1";
Handlebars.Parser=handlebars;
Handlebars.parse=function(string){Handlebars.Parser.yy=Handlebars.AST;
return Handlebars.Parser.parse(string);
};
Handlebars.print=function(ast){return new Handlebars.PrintVisitor().accept(ast);
};
Handlebars.helpers={};
Handlebars.partials={};
Handlebars.registerHelper=function(name,fn,inverse){if(inverse){fn.not=inverse;
}this.helpers[name]=fn;
};
Handlebars.registerPartial=function(name,str){this.partials[name]=str;
};
Handlebars.registerHelper("helperMissing",function(arg){if(arguments.length===2){return undefined;
}else{throw new Error("Could not find property '"+arg+"'");
}});
Handlebars.registerHelper("blockHelperMissing",function(context,fn,inverse){inverse=inverse||function(){};
var ret="";
var type=Object.prototype.toString.call(context);
if(type==="[object Function]"){context=context();
}if(context===true){return fn(this);
}else{if(context===false||context==null){return inverse(this);
}else{if(type==="[object Array]"){if(context.length>0){for(var i=0,j=context.length;
i<j;
i++){ret=ret+fn(context[i]);
}}else{ret=inverse(this);
}return ret;
}else{return fn(context);
}}}},function(context,fn){return fn(context);
});
Handlebars.registerHelper("each",function(context,fn,inverse){var ret="";
if(context&&context.length>0){for(var i=0,j=context.length;
i<j;
i++){ret=ret+fn(context[i]);
}}else{ret=inverse(this);
}return ret;
});
Handlebars.registerHelper("if",function(context,fn,inverse){if(!context||context==[]){return inverse(this);
}else{return fn(this);
}});
Handlebars.registerHelper("unless",function(context,fn,inverse){return Handlebars.helpers["if"].call(this,context,inverse,fn);
});
Handlebars.registerHelper("with",function(context,fn){return fn(context);
});
Handlebars.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(level,str){}};
Handlebars.log=function(level,str){Handlebars.logger.log(level,str);
};
(function(){Handlebars.AST={};
Handlebars.AST.ProgramNode=function(statements,inverse){this.type="program";
this.statements=statements;
if(inverse){this.inverse=new Handlebars.AST.ProgramNode(inverse);
}};
Handlebars.AST.MustacheNode=function(params,hash,unescaped){this.type="mustache";
this.id=params[0];
this.params=params.slice(1);
this.hash=hash;
this.escaped=!unescaped;
};
Handlebars.AST.PartialNode=function(id,context){this.type="partial";
this.id=id;
this.context=context;
};
var verifyMatch=function(open,close){if(open.original!==close.original){throw new Handlebars.Exception(open.original+" doesn't match "+close.original);
}};
Handlebars.AST.BlockNode=function(mustache,program,close){verifyMatch(mustache.id,close);
this.type="block";
this.mustache=mustache;
this.program=program;
};
Handlebars.AST.InverseNode=function(mustache,program,close){verifyMatch(mustache.id,close);
this.type="inverse";
this.mustache=mustache;
this.program=program;
};
Handlebars.AST.ContentNode=function(string){this.type="content";
this.string=string;
};
Handlebars.AST.HashNode=function(pairs){this.type="hash";
this.pairs=pairs;
};
Handlebars.AST.IdNode=function(parts){this.type="ID";
this.original=parts.join(".");
var dig=[],depth=0;
for(var i=0,l=parts.length;
i<l;
i++){var part=parts[i];
if(part===".."){depth++;
}else{if(part==="."||part==="this"){continue;
}else{dig.push(part);
}}}this.parts=dig;
this.string=dig.join(".");
this.depth=depth;
this.isSimple=(dig.length===1)&&(depth===0);
};
Handlebars.AST.StringNode=function(string){this.type="STRING";
this.string=string;
};
Handlebars.AST.CommentNode=function(comment){this.type="comment";
this.comment=comment;
};
})();
Handlebars.Visitor=function(){};
Handlebars.Visitor.prototype={accept:function(object){return this[object.type](object);
}};
Handlebars.Exception=function(message){this.message=message;
};
Handlebars.SafeString=function(string){this.string=string;
};
Handlebars.SafeString.prototype.toString=function(){return this.string.toString();
};
(function(){var escape={"<":"&lt;",">":"&gt;"};
var badChars=/&(?!\w+;)|[<>]/g;
var possible=/[&<>]/;
var escapeChar=function(chr){return escape[chr]||"&amp;";
};
Handlebars.Utils={escapeExpression:function(string){if(string instanceof Handlebars.SafeString){return string.toString();
}else{if(string==null||string===false){return"";
}}if(!possible.test(string)){return string;
}return string.replace(badChars,escapeChar);
},isEmpty:function(value){if(typeof value==="undefined"){return true;
}else{if(value===null){return true;
}else{if(value===false){return true;
}else{if(Object.prototype.toString.call(value)==="[object Array]"&&value.length===0){return true;
}else{return false;
}}}}}};
})();
Handlebars.Compiler=function(){};
Handlebars.JavaScriptCompiler=function(){};
(function(Compiler,JavaScriptCompiler){Compiler.OPCODE_MAP={appendContent:1,getContext:2,lookupWithHelpers:3,lookup:4,append:5,invokeMustache:6,appendEscaped:7,pushString:8,truthyOrFallback:9,functionOrFallback:10,invokeProgram:11,invokePartial:12,push:13,invokeInverse:14,assignToHash:15,pushStringParam:16};
Compiler.MULTI_PARAM_OPCODES={appendContent:1,getContext:1,lookupWithHelpers:1,lookup:1,invokeMustache:2,pushString:1,truthyOrFallback:1,functionOrFallback:1,invokeProgram:2,invokePartial:1,push:1,invokeInverse:1,assignToHash:1,pushStringParam:1};
Compiler.DISASSEMBLE_MAP={};
for(var prop in Compiler.OPCODE_MAP){var value=Compiler.OPCODE_MAP[prop];
Compiler.DISASSEMBLE_MAP[value]=prop;
}Compiler.multiParamSize=function(code){return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
};
Compiler.prototype={compiler:Compiler,disassemble:function(){var opcodes=this.opcodes,opcode,nextCode;
var out=[],str,name,value;
for(var i=0,l=opcodes.length;
i<l;
i++){opcode=opcodes[i];
if(opcode==="DECLARE"){name=opcodes[++i];
value=opcodes[++i];
out.push("DECLARE "+name+" = "+value);
}else{str=Compiler.DISASSEMBLE_MAP[opcode];
var extraParams=Compiler.multiParamSize(opcode);
var codes=[];
for(var j=0;
j<extraParams;
j++){nextCode=opcodes[++i];
if(typeof nextCode==="string"){nextCode='"'+nextCode.replace("\n","\\n")+'"';
}codes.push(nextCode);
}str=str+" "+codes.join(" ");
out.push(str);
}}return out.join("\n");
},guid:0,compile:function(program,options){this.children=[];
this.depths={list:[]};
this.options=options||{};
return this.program(program);
},accept:function(node){return this[node.type](node);
},program:function(program){var statements=program.statements,statement;
this.opcodes=[];
for(var i=0,l=statements.length;
i<l;
i++){statement=statements[i];
this[statement.type](statement);
}this.depths.list=this.depths.list.sort(function(a,b){return a-b;
});
return this;
},compileProgram:function(program){var result=new this.compiler().compile(program,this.options);
var guid=this.guid++;
this.usePartial=this.usePartial||result.usePartial;
this.children[guid]=result;
for(var i=0,l=result.depths.list.length;
i<l;
i++){depth=result.depths.list[i];
if(depth<2){continue;
}else{this.addDepth(depth-1);
}}return guid;
},block:function(block){var mustache=block.mustache;
var depth,child,inverse,inverseGuid;
var params=this.setupStackForMustache(mustache);
var programGuid=this.compileProgram(block.program);
if(block.program.inverse){inverseGuid=this.compileProgram(block.program.inverse);
this.declare("inverse",inverseGuid);
}this.opcode("invokeProgram",programGuid,params.length);
this.declare("inverse",null);
this.opcode("append");
},inverse:function(block){this.ID(block.mustache.id);
var programGuid=this.compileProgram(block.program);
this.opcode("invokeInverse",programGuid);
this.opcode("append");
},hash:function(hash){var pairs=hash.pairs,pair,val;
this.opcode("push","{}");
for(var i=0,l=pairs.length;
i<l;
i++){pair=pairs[i];
val=pair[1];
this.accept(val);
this.opcode("assignToHash",pair[0]);
}},partial:function(partial){var id=partial.id;
this.usePartial=true;
if(partial.context){this.ID(partial.context);
}else{this.opcode("push","context");
}this.opcode("invokePartial",id.original);
this.opcode("append");
},content:function(content){this.opcode("appendContent",content.string);
},mustache:function(mustache){var params=this.setupStackForMustache(mustache);
this.opcode("invokeMustache",params.length,mustache.id.original);
if(mustache.escaped){this.opcode("appendEscaped");
}else{this.opcode("append");
}},ID:function(id){this.addDepth(id.depth);
this.opcode("getContext",id.depth);
this.opcode("lookupWithHelpers",id.parts[0]||null);
for(var i=1,l=id.parts.length;
i<l;
i++){this.opcode("lookup",id.parts[i]);
}},STRING:function(string){this.opcode("pushString",string.string);
},comment:function(){},pushParams:function(params){var i=params.length,param;
while(i--){param=params[i];
if(this.options.stringParams){if(param.depth){this.addDepth(param.depth);
}this.opcode("getContext",param.depth||0);
this.opcode("pushStringParam",param.string);
}else{this[param.type](param);
}}},opcode:function(name,val1,val2){this.opcodes.push(Compiler.OPCODE_MAP[name]);
if(val1!==undefined){this.opcodes.push(val1);
}if(val2!==undefined){this.opcodes.push(val2);
}},declare:function(name,value){this.opcodes.push("DECLARE");
this.opcodes.push(name);
this.opcodes.push(value);
},addDepth:function(depth){if(depth===0){return;
}if(!this.depths[depth]){this.depths[depth]=true;
this.depths.list.push(depth);
}},setupStackForMustache:function(mustache){var params=mustache.params;
this.pushParams(params);
if(mustache.hash){this.hash(mustache.hash);
}else{this.opcode("push","{}");
}this.ID(mustache.id);
return params;
}};
JavaScriptCompiler.prototype={nameLookup:function(parent,name,type){if(JavaScriptCompiler.RESERVED_WORDS[name]||name.indexOf("-")!==-1){return parent+"['"+name+"']";
}else{return parent+"."+name;
}},appendToBuffer:function(string){return"buffer = buffer + "+string+";";
},initializeBuffer:function(){return this.quotedString("");
},compile:function(environment,options){this.environment=environment;
this.options=options||{};
this.preamble();
this.stackSlot=0;
this.stackVars=[];
this.registers={list:[]};
this.compileChildren(environment,options);
Handlebars.log(Handlebars.logger.DEBUG,environment.disassemble()+"\n\n");
var opcodes=environment.opcodes,opcode,name,declareName,declareVal;
this.i=0;
for(l=opcodes.length;
this.i<l;
this.i++){opcode=this.nextOpcode(0);
if(opcode[0]==="DECLARE"){this.i=this.i+2;
this[opcode[1]]=opcode[2];
}else{this.i=this.i+opcode[1].length;
this[opcode[0]].apply(this,opcode[1]);
}}return this.createFunction();
},nextOpcode:function(n){var opcodes=this.environment.opcodes,opcode=opcodes[this.i+n],name,val;
var extraParams,codes;
if(opcode==="DECLARE"){name=opcodes[this.i+1];
val=opcodes[this.i+2];
return["DECLARE",name,val];
}else{name=Compiler.DISASSEMBLE_MAP[opcode];
extraParams=Compiler.multiParamSize(opcode);
codes=[];
for(var j=0;
j<extraParams;
j++){codes.push(opcodes[this.i+j+1+n]);
}return[name,codes];
}},eat:function(opcode){this.i=this.i+opcode.length;
},preamble:function(){var out=[];
out.push("var buffer = "+this.initializeBuffer()+", currentContext = context");
var copies="helpers = helpers || Handlebars.helpers;";
if(this.environment.usePartial){copies=copies+" partials = partials || Handlebars.partials;";
}out.push(copies);
this.lastContext=0;
this.source=out;
},createFunction:function(){var container={escapeExpression:Handlebars.Utils.escapeExpression,invokePartial:Handlebars.VM.invokePartial,programs:[],program:function(i,helpers,partials,data){var programWrapper=this.programs[i];
if(data){return Handlebars.VM.program(this.children[i],helpers,partials,data);
}else{if(programWrapper){return programWrapper;
}else{programWrapper=this.programs[i]=Handlebars.VM.program(this.children[i],helpers,partials);
return programWrapper;
}}},programWithDepth:Handlebars.VM.programWithDepth,noop:Handlebars.VM.noop};
var locals=this.stackVars.concat(this.registers.list);
if(locals.length>0){this.source[0]=this.source[0]+", "+locals.join(", ");
}this.source[0]=this.source[0]+";";
this.source.push("return buffer;");
var params=["Handlebars","context","helpers","partials"];
if(this.options.data){params.push("data");
}for(var i=0,l=this.environment.depths.list.length;
i<l;
i++){params.push("depth"+this.environment.depths.list[i]);
}if(params.length===4&&!this.environment.usePartial){params.pop();
}params.push(this.source.join("\n"));
var fn=Function.apply(this,params);
fn.displayName="Handlebars.js";
Handlebars.log(Handlebars.logger.DEBUG,fn.toString()+"\n\n");
container.render=fn;
container.children=this.environment.children;
return function(context,options,$depth){try{options=options||{};
var args=[Handlebars,context,options.helpers,options.partials,options.data];
var depth=Array.prototype.slice.call(arguments,2);
args=args.concat(depth);
return container.render.apply(container,args);
}catch(e){throw e;
}};
},appendContent:function(content){this.source.push(this.appendToBuffer(this.quotedString(content)));
},append:function(){var local=this.popStack();
this.source.push("if("+local+" || "+local+" === 0) { "+this.appendToBuffer(local)+" }");
},appendEscaped:function(){var opcode=this.nextOpcode(1),extra="";
if(opcode[0]==="appendContent"){extra=" + "+this.quotedString(opcode[1][0]);
this.eat(opcode);
}this.source.push(this.appendToBuffer("this.escapeExpression("+this.popStack()+")"+extra));
},getContext:function(depth){if(this.lastContext!==depth){this.lastContext=depth;
if(depth===0){this.source.push("currentContext = context;");
}else{this.source.push("currentContext = depth"+depth+";");
}}},lookupWithHelpers:function(name){if(name){var topStack=this.nextStack();
var toPush="if('"+name+"' in helpers) { "+topStack+" = "+this.nameLookup("helpers",name,"helper")+"; } else { "+topStack+" = "+this.nameLookup("currentContext",name,"context")+"; }";
this.source.push(toPush);
}else{this.pushStack("currentContext");
}},lookup:function(name){var topStack=this.topStack();
this.source.push(topStack+" = "+this.nameLookup(topStack,name,"context")+";");
},pushStringParam:function(string){this.pushStack("currentContext");
this.pushString(string);
},pushString:function(string){this.pushStack(this.quotedString(string));
},push:function(name){this.pushStack(name);
},invokeMustache:function(paramSize,original){this.populateParams(paramSize,this.quotedString(original),"{}",null,function(nextStack,helperMissingString,id){this.source.push("else if("+id+"=== undefined) { "+nextStack+" = helpers.helperMissing.call("+helperMissingString+"); }");
this.source.push("else { "+nextStack+" = "+id+"; }");
});
},invokeProgram:function(guid,paramSize){var inverse=this.programExpression(this.inverse);
var mainProgram=this.programExpression(guid);
this.populateParams(paramSize,null,mainProgram,inverse,function(nextStack,helperMissingString,id){this.source.push("else { "+nextStack+" = helpers.blockHelperMissing.call("+helperMissingString+"); }");
});
},populateParams:function(paramSize,helperId,program,inverse,fn){var id=this.popStack(),nextStack;
var params=[],param,stringParam;
var hash=this.popStack();
this.register("tmp1",program);
this.source.push("tmp1.hash = "+hash+";");
if(this.options.stringParams){this.source.push("tmp1.contexts = [];");
}for(var i=0;
i<paramSize;
i++){param=this.popStack();
params.push(param);
if(this.options.stringParams){this.source.push("tmp1.contexts.push("+this.popStack()+");");
}}if(inverse){this.source.push("tmp1.fn = tmp1;");
this.source.push("tmp1.inverse = "+inverse+";");
}if(this.options.data){this.source.push("tmp1.data = data;");
}params.push("tmp1");
if(inverse){params.push(inverse);
}this.populateCall(params,id,helperId||id,fn);
},populateCall:function(params,id,helperId,fn){var paramString=["context"].concat(params).join(", ");
var helperMissingString=["context"].concat(helperId).concat(params).join(", ");
nextStack=this.nextStack();
this.source.push("if(typeof "+id+" === 'function') { "+nextStack+" = "+id+".call("+paramString+"); }");
fn.call(this,nextStack,helperMissingString,id);
},invokeInverse:function(guid){var program=this.programExpression(guid);
var blockMissingParams=["context",this.topStack(),"this.noop",program];
this.pushStack("helpers.blockHelperMissing.call("+blockMissingParams.join(", ")+")");
},invokePartial:function(context){this.pushStack("this.invokePartial("+this.nameLookup("partials",context,"partial")+", '"+context+"', "+this.popStack()+", helpers, partials);");
},assignToHash:function(key){var value=this.popStack();
var hash=this.topStack();
this.source.push(hash+"['"+key+"'] = "+value+";");
},compiler:JavaScriptCompiler,compileChildren:function(environment,options){var children=environment.children,child,compiler;
var compiled=[];
for(var i=0,l=children.length;
i<l;
i++){child=children[i];
compiler=new this.compiler();
compiled[i]=compiler.compile(child,options);
}environment.rawChildren=children;
environment.children=compiled;
},programExpression:function(guid){if(guid==null){return"this.noop";
}var programParams=[guid,"helpers","partials"];
var depths=this.environment.rawChildren[guid].depths.list;
if(this.options.data){programParams.push("data");
}for(var i=0,l=depths.length;
i<l;
i++){depth=depths[i];
if(depth===1){programParams.push("context");
}else{programParams.push("depth"+(depth-1));
}}if(!this.environment.usePartial){if(programParams[3]){programParams[2]="null";
}else{programParams.pop();
}}if(depths.length===0){return"this.program("+programParams.join(", ")+")";
}else{programParams[0]="this.children["+guid+"]";
return"this.programWithDepth("+programParams.join(", ")+")";
}},register:function(name,val){this.useRegister(name);
this.source.push(name+" = "+val+";");
},useRegister:function(name){if(!this.registers[name]){this.registers[name]=true;
this.registers.list.push(name);
}},pushStack:function(item){this.source.push(this.nextStack()+" = "+item+";");
return"stack"+this.stackSlot;
},nextStack:function(){this.stackSlot++;
if(this.stackSlot>this.stackVars.length){this.stackVars.push("stack"+this.stackSlot);
}return"stack"+this.stackSlot;
},popStack:function(){return"stack"+this.stackSlot--;
},topStack:function(){return"stack"+this.stackSlot;
},quotedString:function(str){return'"'+str.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"';
}};
var reservedWords=("break case catch continue default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with null true false").split(" ");
compilerWords=JavaScriptCompiler.RESERVED_WORDS={};
for(var i=0,l=reservedWords.length;
i<l;
i++){compilerWords[reservedWords[i]]=true;
}})(Handlebars.Compiler,Handlebars.JavaScriptCompiler);
Handlebars.VM={programWithDepth:function(fn,helpers,partials,data,$depth){var args=Array.prototype.slice.call(arguments,4);
return function(context,options){options=options||{};
options={helpers:options.helpers||helpers,partials:options.partials||partials,data:options.data||data};
return fn.apply(this,[context,options].concat(args));
};
},program:function(fn,helpers,partials,data){return function(context,options){options=options||{};
return fn(context,{helpers:options.helpers||helpers,partials:options.partials||partials,data:options.data||data});
};
},noop:function(){return"";
},compile:function(string,options){var ast=Handlebars.parse(string);
var environment=new Handlebars.Compiler().compile(ast,options);
return new Handlebars.JavaScriptCompiler().compile(environment,options);
},invokePartial:function(partial,name,context,helpers,partials){if(partial===undefined){throw new Handlebars.Exception("The partial "+name+" could not be found");
}else{if(partial instanceof Function){return partial(context,{helpers:helpers,partials:partials});
}else{partials[name]=Handlebars.VM.compile(partial);
return partials[name](context,{helpers:helpers,partials:partials});
}}}};
Handlebars.compile=Handlebars.VM.compile;
function getXMLCclRequest(){var xmlHttp=null;
if(location.protocol.substr(0,4)=="http"){try{xmlHttp=new XMLHttpRequest();
}catch(e){try{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
}catch(e){xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
}}}else{xmlHttp=new XMLCclRequest();
}return xmlHttp;
}var popupWindowHandle;
function getPopupWindowHandle(){return popupWindowHandle;
}XMLCclRequest=function(options){this.onreadystatechange=function(){return null;
};
this.options=options||{};
this.readyState=0;
this.responseText="";
this.status=0;
this.statusText="";
this.sendFlag=false;
this.errorFlag=false;
this.responseBody=this.responseXML=this.async=true;
this.requestBinding=null;
this.requestText=null;
this.blobIn=null;
this.onerror=this.abort=this.getAllResponseHeaders=this.getResponseHeader=function(){return null;
};
this.open=function(method,url,async){if(method.toLowerCase()!="get"&&method.toLowerCase()!="post"){this.errorFlag=true;
this.status=405;
this.statusText="Method not Allowed";
return false;
}this.method=method.toUpperCase();
this.url=url;
this.async=async!=null?(async?true:false):true;
this.requestHeaders=null;
this.responseText="";
this.responseBody=this.responseXML=null;
this.readyState=1;
this.sendFlag=false;
this.requestText="";
this.onreadystatechange();
};
this.send=function(param){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}this.sendFlag=true;
this.requestLen=param.length;
this.requestText=param;
var uniqueId=this.url+"-"+(new Date()).getTime()+"-"+Math.floor(Math.random()*99999);
XMLCCLREQUESTOBJECTPOINTER[uniqueId]=this;
window.location='javascript:XMLCCLREQUEST_Send("'+uniqueId+'")';
};
this.setRequestHeader=function(name,value){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(!value){return false;
}if(!this.requestHeaders){this.requestHeaders=[];
}this.requestHeaders[name]=value;
};
this.setBlobIn=function(blob){this.blobIn=blob;
};
};
XMLCCLREQUESTOBJECTPOINTER=[];
function evaluate(x){return eval(x);
}function CCLLINK__(program,param,nViewerType){}function CCLLINK(program,param,nViewerType){var paramLength=param.length;
if(paramLength>2000){param=param.substring(0,2000);
}var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLLINK__("'+program+'","'+param+'",'+nViewerType+","+paramLength+")";
el.click();
}function CCLNEWWINDOW(url){var newWindow=window.open(url,"","fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no");
newWindow.focus();
}function CCLEVENT__(eventId,eventData){}function CCLEVENT(eventId,eventData){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLEVENT__("'+eventId+'")';
el.click();
}function CCLNEWSESSIONWINDOW__(sUrl,sName,sFeatures,bReplace,bModal){}function CCLNEWSESSIONWINDOW(sUrl,sName,sFeatures,bReplace,bModal){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLNEWSESSIONWINDOW__("'+sUrl+'","'+sName+'","'+sFeatures+'",'+bReplace+","+bModal+")";
el.click();
if(bModal==0){popupWindowHandle=window.open(sUrl,sName,sFeatures,bReplace);
if(popupWindowHandle){popupWindowHandle.focus();
}}}function APPLINK(mode,appname,param){if(mode==0){window.open("file:///"+appname+" "+param);
}else{window.location="file:///"+appname+" "+param;
}}function MPAGES_EVENT__(eventType,eventParams){}function MPAGES_EVENT(eventType,eventParams){var paramLength=eventParams.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+eventParams+'"';
eventParams=eventParams.substring(0,2000);
}window.location.href="javascript:MPAGES_EVENT__('"+eventType+"','"+eventParams+"',"+paramLength+")";
}function ArgumentURL(){this.getArgument=_getArg;
this.setArgument=_setArg;
this.removeArgument=_removeArg;
this.toString=_toString;
this.arguments=new Array();
var separator=",";
var equalsign="=";
var str=window.location.search.replace(/%20/g," ");
var index=str.indexOf("?");
var sInfo;
var infoArray=new Array();
var tmp;
if(index!=-1){sInfo=str.substring(index+1,str.length);
infoArray=sInfo.split(separator);
}for(var i=0;
i<infoArray.length;
i++){tmp=infoArray[i].split(equalsign);
if(tmp[0]!=""){var t=tmp[0];
this.arguments[tmp[0]]=new Object();
this.arguments[tmp[0]].value=tmp[1];
this.arguments[tmp[0]].name=tmp[0];
}}function _toString(){var s="";
var once=true;
for(i in this.arguments){if(once){s+="?";
once=false;
}s+=this.arguments[i].name;
s+=equalsign;
s+=this.arguments[i].value;
s+=separator;
}return s.replace(/ /g,"%20");
}function _getArg(name){if(typeof(this.arguments[name].name)!="string"){return null;
}else{return this.arguments[name].value;
}}function _setArg(name,value){this.arguments[name]=new Object();
this.arguments[name].name=name;
this.arguments[name].value=value;
}function _removeArg(name){this.arguments[name]=null;
}return this;
}Array.prototype.contains=function(element){for(var i=0;
i<this.length;
i++){if(this[i]===element){return true;
}}return false;
};
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(arrayElement,fromIndex){if(fromIndex==null){fromIndex=0;
}else{if(fromIndex<0){fromIndex=Math.max(0,this.length+fromIndex);
}}for(var i=fromIndex,j=this.length;
i<j;
i++){if(this[i]===arrayElement){return i;
}}return -1;
};
}Array.prototype.removeList=function(fromIndex,toIndex){var array=this,rest=array.slice((toIndex||fromIndex)+1||array.length);
array.length=fromIndex<0?array.length+fromIndex:fromIndex;
return array.push.apply(array,rest);
};
Array.prototype.removeElement=function(element){var result=false;
var array=[];
for(var i=0;
i<this.length;
i++){if(this[i]===element){result=true;
}else{array.push(this[i]);
}}this.clear();
for(var i=0;
i<array.length;
i++){this.push(array[i]);
}array=null;
return result;
};
Array.prototype.clear=function(){this.length=0;
};
Array.prototype.iterate=function(fnc){var cntr=0,len=this.length-1;
if(fnc){for(cntr=len;
cntr>=0;
cntr--){fnc(cntr,this[cntr]);
}}};
Date.prototype.resetTime=function(){this.setHours(0);
this.setMinutes(0);
this.setSeconds(0);
this.setMilliseconds(0);
};
Date.prototype.resetMinTime=function(){this.setMinutes(0);
this.setSeconds(0);
this.setMilliseconds(0);
};
String.prototype.trim=function(){var curString=this;
return curString.replace(/^\s*/,"").replace(/\s*$/,"");
};
String.prototype.padL=function(nLength,sChar){var curString=this;
while(curString.length<nLength){curString=String(sChar)+curString;
}return(curString);
};
String.prototype.encodeToHTML=function(){var str=this,i=str.length,encodedString=[];
while(i--){var iC=str[i].charCodeAt();
if(iC<65||iC>127||(iC>90&&iC<97)){encodedString[i]="&#"+iC+";";
}else{encodedString[i]=str[i];
}}return encodedString.join("");
};
String.prototype.fragmentsBySize=function(fragmentSize){var originalString=this,stringFragments=[],currentFragment,stringSize=originalString.length,fragmentCount,counter=0;
if(fragmentSize>0){fragmentCount=Math.ceil(stringSize/fragmentSize);
for(counter=0;
counter<fragmentCount;
counter++){currentFragment=originalString.substr(counter*fragmentSize,fragmentSize);
stringFragments.push(currentFragment);
}}return(stringFragments);
};
String.prototype.encodeLineBreaks=function(){if(this&&this!=undefined&&this>" "){return this.replace(/\n/g,"&#10;").replace(/\r/g,"&#13;");
}else{return"";
}};
String.prototype.encodeStringDelimiters=function(){if(this&&this!=undefined&&this>" "){return this.split('"').join("&#34;").split("^").join("&#94;");
}else{return"";
}};
var ExternalDebugger=(function(){var debuggerObj=false,prevDebuggerObj,debuggerDefined=false,bufferOutput=" ";
return({initialize:function(dObj){prevDebuggerObj=debuggerObj;
debuggerObj=dObj;
ExternalDebugger.reset();
if(prevDebuggerObj){debuggerObj.innerHTML=prevDebuggerObj.innerHTML;
}},define:function(){debuggerDefined=true;
bufferOutput=" ";
},reset:function(){try{if(debuggerObj){debuggerObj.innerHTML=" ";
}}catch(err){if(prevDebuggerObj){prevDebuggerObj.innerHTML=" ";
}}},isDefined:function(){return debuggerDefined;
},isInitialized:function(){if(debuggerObj){return true;
}return false;
},loadBufferOutput:function(){debuggerObj.innerHTML+=bufferOutput;
},clearBufferOutput:function(){bufferOutput=" ";
},sendBufferOutput:function(outData){bufferOutput+=outData;
},sendOutput:function(outData){try{if(debuggerObj){debuggerObj.innerHTML+=outData;
}}catch(err){if(prevDebuggerObj){prevDebuggerObj.innerHTML+=outData;
}}}});
}());
var UtilJsonXmlDebugWindow;
var UtilJsonXml=function(prefs){var cur_dt_tm=new Date(),_w=window,_d=document,that=this,xCclPanel,messages={json_parsing_failed:"JSON Parsing Failed"},truncate_zeros=true,whtSpEnds=new RegExp("^\\s*|\\s*$","g"),whtSpMult=new RegExp("\\s\\s+","g"),error_handler=function(msg,fnc){alert(msg+" - "+fnc);
},RealTypeOf=function(v){try{if(typeof(v)==="object"){if(v===null){return"null";
}if(v.constructor===([]).constructor){return"array";
}if(v.constructor===(new Date()).constructor){return"date";
}if(v.constructor===(new RegExp()).constructor){return"regex";
}return"object";
}if(v!=""&&!isNaN(Number(v))){return"number";
}else{return typeof(v);
}}catch(e){error_handler(e.message,"RealTypeOf()");
}},format_json=function(jObj,sIndent){try{if(!sIndent){sIndent="";
}var sIndentStyle="&nbsp;&nbsp;",iCount=0,sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=("<br>"+sIndent+sIndentStyle);
}else{sHTML+=("<br>"+sIndent+sIndentStyle+'"'+j+'": ');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=format_json(jObj[j],(sIndent+sIndentStyle));
break;
case"boolean":case"number":sHTML+=jObj[j].toString();
break;
case"null":sHTML+="null";
break;
case"string":sHTML+=('"'+jObj[j]+'"');
break;
case"function":break;
default:sHTML+=("TYPEOF: "+typeof(jObj[j]));
}iCount=iCount+1;
}}if(sDataType==="array"){sHTML+=("<br>"+sIndent+"]");
}else{sHTML+=("<br>"+sIndent+"}");
}return sHTML;
}catch(e){error_handler(e.message,"format_json()");
}},format_xml=function(Obj,sIndent){try{var str="",sIndentStyle="&nbsp;&nbsp;",i=0,j=0;
if(!sIndent){sIndent="";
}for(i=0;
i<Obj.childNodes.length;
i++){if(Obj.childNodes[i].tagName){str+=sIndent+"&#60"+Obj.childNodes[i].tagName;
if(Obj.childNodes[i].attributes){for(j=0;
j<Obj.childNodes[i].attributes.length;
j++){str+="&nbsp;&nbsp;"+Obj.childNodes[i].attributes[j].name+"&nbsp;=&nbsp;'"+Obj.childNodes[i].attributes[j].value+"'";
}}str+="&#62;<br>";
}if(!Obj.childNodes[i].nodeValue&&RealTypeOf(Obj.childNodes[i].childNodes)==="object"){str+=sIndent+format_xml(Obj.childNodes[i],sIndent+sIndentStyle);
}else{if(Obj.childNodes[i].nodeValue){str+=sIndent+Obj.childNodes[i].nodeValue+"<br>";
}}if(Obj.childNodes[i].tagName){str+=sIndent+"&#60/"+Obj.childNodes[i].tagName+"&#62;<br>";
}}return str;
}catch(e){error_handler(e.message,"format_xml()");
}},normalizeString=function(s){s=s.replace(whtSpMult," ");
s=s.replace(whtSpEnds,"");
return(s);
},createDocument=function(){try{if(typeof arguments.callee.activeXString!=="string"){var versions=["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"],i,len=versions.length;
for(i=0;
i<len;
i+=1){try{this.xml_object=new ActiveXObject(versions[i]);
arguments.callee.activeXString=versions[i];
return this.xml_object;
}catch(ex){}}}return new ActiveXObject(arguments.callee.activeXString);
}catch(e){error_handler(e.message,"createDocument()");
}},ReadFromFile=function(sFile){try{var ForReading=1,TriStateFalse=0,fso=new ActiveXObject("Scripting.FileSystemObject"),fileText="",path_split=[],sfile_split=sFile.split("$");
if(sfile_split.length==1){if(location.href){path_split=location.href.split("?")[0];
path_split=path_split.split("%20").join(" ").split("file:///").join("").split("file:").join("").split("/");
path_split=path_split.slice(0,path_split.length-2);
path_split=path_split.join("\\");
sFile=sFile.split("/").join("\\");
}sFile=(path_split+sFile);
}else{sFile=sfile_split[1];
}inFile=fso.OpenTextFile(sFile,ForReading,true);
fileText=inFile.ReadAll();
inFile.close();
return fileText;
}catch(err){error_handler(err.message,"ReadFromFile()");
return"";
}},init=function(){if(prefs&&RealTypeOf(prefs)=="object"){if(prefs.debug_mode_ind){that.debug_mode_ind=prefs.debug_mode_ind;
}if(that.debug_mode_ind==1&&!ExternalDebugger.isInitialized()&&(!prefs.disable_firebug)){ExternalDebugger.define();
appendDebugJavaScriptTag("..\\js\\firebug-lite.js");
console.log("Debugging mode turned on");
if(Firebug){Firebug.extend(function(FBL){with(FBL){var panelName="XmlCclRequest";
Firebug.XmlCclRequest=extend(Firebug.Module,{getPanel:function(){return Firebug.chrome?Firebug.chrome.getPanel(panelName):null;
},clear:function(){ExternalDebugger.clearBufferOutput();
ExternalDebugger.reset();
}});
Firebug.registerModule(Firebug.XmlCclRequest);
function XmlCclRequestPanel(){}XmlCclRequestPanel.prototype=extend(Firebug.Panel,{name:panelName,title:"XmlCclRequest",options:{hasToolButtons:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.clearButton=new Button({caption:"Clear",title:"Clear XmlCclRequest logs",owner:Firebug.XmlCclRequest,onClick:Firebug.XmlCclRequest.clear});
ExternalDebugger.initialize(this.panelNode);
ExternalDebugger.loadBufferOutput();
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments);
this.clearButton.initialize();
},shutdown:function(){this.clearButton.shutdown();
Firebug.Panel.shutdown.apply(this,arguments);
}});
Firebug.registerPanel(XmlCclRequestPanel);
}});
}}}};
appendDebugJavaScriptTag=function(filePath){headID=document.getElementsByTagName("head")[0];
newScript=document.createElement("script");
newScript.type="text/javascript";
newScript.id="firebug_lite_debugger";
newScript.src=filePath;
headID.appendChild(newScript);
};
this.text_debug=" ";
this.debug_mode_ind=0;
this.text_format="html";
this.target_url="";
this.json_object={};
this.xml_object={};
this.browserName="msie";
this.target_debug="_utiljsonxml_";
this.wParams="fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no";
this.trim_float_zeros=function(ind){truncate_zeros=ind;
};
this.setDebugMode=function(dMode){that.debug_mode_ind=dMode;
init();
};
this.launch_debug=function(){try{if(!UtilJsonXmlDebugWindow){UtilJsonXmlDebugWindow=_w.open(this.target_url,this.target_debug,this.wParams,0);
UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>"+this.text_debug+"</div>");
}else{UtilJsonXmlDebugWindow.document.write("<div>"+this.text_debug+"</div>");
}this.text_debug=" ";
}catch(e){try{UtilJsonXmlDebugWindow=_w.open(this.target_url,this.target_debug,this.wParams,0);
UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>"+this.text_debug+"</div>");
}catch(e2){error_handler(e.message,"launch_debug()");
}}};
this.parse_json=function(serializedJSON){try{if(JSON&&JSON.parse){return JSON.parse(serializedJSON);
}}catch(e){}return this.json1_parse(serializedJSON);
};
this.json1_parse=(function(){var at,ch,parseError="",escapee={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},text,error=function(m){parseError=m;
},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of '"+ch+"'");
}ch=text.charAt(at);
at+=1;
return ch;
},number=function(){var number,string="";
if(ch==="-"){string="-";
next("-");
}while(ch>="0"&&ch<="9"){string+=ch;
next();
}if(ch==="."){string+=".";
while(next()&&ch>="0"&&ch<="9"){string+=ch;
}}if(ch==="e"||ch==="E"){string+=ch;
next();
if(ch==="-"||ch==="+"){string+=ch;
next();
}while(ch>="0"&&ch<="9"){string+=ch;
next();
}}if(truncate_zeros==true){number=+string;
}else{number=string;
}if(isNaN(number)){error("Bad number");
}else{return number;
}},string=function(){var hex,i,string="",uffff;
if(ch==='"'){while(next()){if(ch==='"'){next();
return string;
}else{if(ch==="\\"){next();
if(ch==="u"){uffff=0;
for(i=0;
i<4;
i+=1){hex=parseInt(next(),16);
if(!isFinite(hex)){break;
}uffff=uffff*16+hex;
}string+=String.fromCharCode(uffff);
}else{if(typeof escapee[ch]==="string"){string+=escapee[ch];
}else{break;
}}}else{string+=ch;
}}}}error("Bad string");
},white=function(){while(ch&&ch<=" "){next();
}},word=function(){switch(ch){case"t":next("t");
next("r");
next("u");
next("e");
return true;
case"f":next("f");
next("a");
next("l");
next("s");
next("e");
return false;
case"n":next("n");
next("u");
next("l");
next("l");
return null;
}error("Unexpected '"+ch+"'");
},array=function(){var array=[];
if(ch==="["){next("[");
white();
if(ch==="]"){next("]");
return array;
}while(ch){array.push(value());
white();
if(ch==="]"){next("]");
return array;
}next(",");
white();
}}error("Bad array");
},object=function(){var key,object={};
if(ch==="{"){next("{");
white();
if(ch==="}"){next("}");
return object;
}while(ch){key=string();
white();
next(":");
if(Object.hasOwnProperty.call(object,key)){error('Duplicate key "'+key+'"');
}object[key]=value();
white();
if(ch==="}"){next("}");
return object;
}next(",");
white();
}}error("Bad object");
},value=function(){white();
switch(ch){case"{":return object();
case"[":return array();
case'"':return string();
case"-":return number();
default:return ch>="0"&&ch<="9"?number():word();
}};
return function(source,reviver){var result;
text=source;
at=0;
ch=" ";
parseError=result=value();
white();
if(ch){error("Syntax error");
}return typeof reviver==="function"?(function walk(holder,key){var k,v,value=holder[key];
if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);
if(v!==undefined){value[k]=v;
}else{delete value[k];
}}}}return reviver.call(holder,key,value);
}({"":result},"")):(parseError===""?{PARSE_JSON_ERROR:parseError}:result);
};
}());
this.parse_xml=function(data){try{var parser;
if(window.DOMParser){parser=new DOMParser();
this.xml_object=parser.parseFromString(data,"text/xml");
}else{this.xml_object=createDocument();
this.xml_object.async=false;
this.xml_object.loadXML(normalizeString(data));
}return(this.xml_object);
}catch(e){error_handler(e.message,"parse_xml()");
}};
this.loggerExists=function(){if(log){if(log.ajax&&log.info&&log.error){return true;
}}return false;
};
this.append_json=function(jObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** JSON Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_json_string=format_json(jObj,""),debug_string=debug_msg_hdr+debug_json_string;
if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return jObj;
}catch(e){error_handler(e.message,"append_json()");
}};
this.formatted_json=function(jObj){return format_json(jObj,"");
};
this.append_xml=function(xObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** XML Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_xml_string=format_xml(xObj),debug_string=debug_msg_hdr+debug_xml_string;
if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return xObj;
}catch(e){error_handler(e.message,"append_xml()");
}};
this.append_text=function(data){try{if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){if(header===undefined){log.info(data);
}else{log.info(data,header);
}}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(data);
}else{ExternalDebugger.sendBufferOutput(data);
}}else{this.text_debug+=data;
this.launch_debug();
}}}}catch(e){error_handler(e.message,"append_text()");
}};
this.load_json_obj=function(json_text,that){try{that===undefined?this:that;
return(that.append_json(that.parse_json(json_text)));
}catch(e){errmsg(e.message,"load_json_obj()");
}};
this.load_xml_obj=function(xml_text,that){try{that===undefined?this:that;
return(that.append_xml(that.parse_xml(xml_text)));
}catch(e){errmsg(e.message,"load_xml_obj()");
}};
this.load_txt=function(text,that){try{that===undefined?this:that;
return(that.append_text(text));
}catch(e){errmsg(e.message,"load_txt()");
}};
this.json_schema_validate=function(instance,schema){return this._validate_json_schema(instance,schema,false);
};
this.json_schema_property=function(value,schema,property){return this._validate_json_schema(value,schema,property||"property");
};
this._validate_json_schema=function(instance,schema,_changing){var errors=[];
function checkProp(value,schema,path,i){var l;
path+=path?typeof i=="number"?"["+i+"]":typeof i=="undefined"?"":"."+i:i;
function addError(message){errors.push({property:path,message:message});
}if((typeof schema!="object"||schema instanceof Array)&&(path||typeof schema!="function")){if(typeof schema=="function"){if(!(value instanceof schema)){addError("is not an instance of the class/constructor "+schema.name);
}}else{if(schema){addError("Invalid schema/property definition "+schema);
}}return null;
}if(_changing&&schema.readonly){addError("is a readonly field, it can not be changed");
}if(schema["extends"]){checkProp(value,schema["extends"],path,i);
}function checkType(type,value){if(type){if(typeof type=="string"&&type!="any"&&(type=="null"?value!==null:typeof value!=type)&&!(value instanceof Array&&type=="array")&&!(type=="integer"&&value%1===0)){return[{property:path,message:(typeof value)+" value found, but a "+type+" is required"}];
}if(type instanceof Array){var unionErrors=[];
for(var j=0;
j<type.length;
j++){if(!(unionErrors=checkType(type[j],value)).length){break;
}}if(unionErrors.length){return unionErrors;
}}else{if(typeof type=="object"){var priorErrors=errors;
errors=[];
checkProp(value,type,path);
var theseErrors=errors;
errors=priorErrors;
return theseErrors;
}}}return[];
}if(value===undefined){if(!schema.optional){addError("is missing and it is not optional");
}}else{errors=errors.concat(checkType(schema.type,value));
if(schema.disallow&&!checkType(schema.disallow,value).length){addError(" disallowed value was matched");
}if(value!==null){if(value instanceof Array){if(schema.items){if(schema.items instanceof Array){for(i=0,l=value.length;
i<l;
i++){errors.concat(checkProp(value[i],schema.items[i],path,i));
}}else{for(i=0,l=value.length;
i<l;
i++){errors.concat(checkProp(value[i],schema.items,path,i));
}}}if(schema.minItems&&value.length<schema.minItems){addError("There must be a minimum of "+schema.minItems+" in the array");
}if(schema.maxItems&&value.length>schema.maxItems){addError("There must be a maximum of "+schema.maxItems+" in the array");
}}else{if(schema.properties){errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties));
}}if(schema.pattern&&typeof value=="string"&&!value.match(schema.pattern)){addError("does not match the regex pattern "+schema.pattern);
}if(schema.maxLength&&typeof value=="string"&&value.length>schema.maxLength){addError("may only be "+schema.maxLength+" characters long");
}if(schema.minLength&&typeof value=="string"&&value.length<schema.minLength){addError("must be at least "+schema.minLength+" characters long");
}if(typeof schema.minimum!==undefined&&typeof value==typeof schema.minimum&&schema.minimum>value){addError("must have a minimum value of "+schema.minimum);
}if(typeof schema.maximum!==undefined&&typeof value==typeof schema.maximum&&schema.maximum<value){addError("must have a maximum value of "+schema.maximum);
}if(schema["enum"]){var enumer=schema["enum"];
l=enumer.length;
var found;
for(var j=0;
j<l;
j++){if(enumer[j]===value){found=1;
break;
}}if(!found){addError("does not have a value in the enumeration "+enumer.join(", "));
}}if(typeof schema.maxDecimal=="number"&&(value.toString().match(new RegExp("\\.[0-9]{"+(schema.maxDecimal+1)+",}")))){addError("may only have "+schema.maxDecimal+" digits of decimal places");
}}}return null;
}function checkObj(instance,objTypeDef,path,additionalProp){if(typeof objTypeDef=="object"){if(typeof instance!="object"||instance instanceof Array){errors.push({property:path,message:"an object is required"});
}for(var i in objTypeDef){if(objTypeDef.hasOwnProperty(i)&&!(i.charAt(0)=="_"&&i.charAt(1)=="_")){var value=instance[i];
var propDef=objTypeDef[i];
checkProp(value,propDef,path,i);
}}}for(i in instance){if(instance.hasOwnProperty(i)&&!(i.charAt(0)=="_"&&i.charAt(1)=="_")&&objTypeDef&&!objTypeDef[i]&&additionalProp===false){errors.push({property:path,message:(typeof value)+"The property "+i+" is not defined in the schema and the schema does not allow additional properties"});
}var requires=objTypeDef&&objTypeDef[i]&&objTypeDef[i].requires;
if(requires&&!(requires in instance)){errors.push({property:path,message:"the presence of the property "+i+" requires that "+requires+" also be present"});
}value=instance[i];
if(objTypeDef&&typeof objTypeDef=="object"&&!(i in objTypeDef)){checkProp(value,additionalProp,path,i);
}if(!_changing&&value&&value.$schema){errors=errors.concat(checkProp(value,value.$schema,path,i));
}}return errors;
}if(schema){checkProp(instance,schema,"",_changing||"");
}if(!_changing&&instance&&instance.$schema){checkProp(instance,instance.$schema,"","");
}return{valid:!errors.length,errors:errors};
};
this.stringify_json=function(objectJSON){try{if(JSON&&JSON.stringify){return JSON.stringify(objectJSON);
}}catch(e){}return this.json1_stringify(objectJSON);
};
this.json1_stringify=function(jObj){try{var sIndent="",iCount=0,sIndentStyle="",sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=(""+sIndent+sIndentStyle);
}else{sHTML+=(""+sIndent+sIndentStyle+'"'+j+'":');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=this.json1_stringify(jObj[j]);
break;
case"boolean":case"number":sHTML+=jObj[j].toString();
break;
case"null":sHTML+="null";
break;
case"string":sHTML+=('"'+jObj[j]+'"');
break;
case"function":break;
default:sHTML+=("TYPEOF: "+typeof(jObj[j]));
}iCount=iCount+1;
}}if(sDataType==="array"){sHTML+=(""+sIndent+"]");
}else{sHTML+=(""+sIndent+"}");
}return sHTML;
}catch(e){error_handler(e.message,"json1_stringify()");
}};
this.ajax_request=function(spec){try{var requestAsync,load_json_obj_fnc=this.load_json_obj,load_xml_obj_fnc=this.load_xml_obj,append_text_fnc=this.load_txt,json_response_obj,that=this,start_timer=new Date(),elapsed_time,ready_state_msg,status_msg,response_spec,parse_target,parse_target_type,debug_string,send_response_ind,parse_target_text,display_response_text,asyncInd=spec.request.synchronous?false:true;
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM&&spec.loadingDialog.content){spec.loadingDialog.targetDOM.innerHTML=spec.loadingDialog.content;
}}if(spec.request.target.toUpperCase().indexOf(".JSON")==-1&&spec.request.target.toUpperCase().indexOf(".XML")==-1&&spec.request.target.toUpperCase().indexOf(".TXT")==-1){if(spec.request.type==="XMLHTTPREQUEST"){if(window.XMLHttpRequest){requestAsync=new XMLHttpRequest();
}else{if(window.ActiveXObject){requestAsync=new ActiveXObject("MSXML2.XMLHTTP.3.0");
}}}else{requestAsync=getXMLCclRequest();
}if(spec.request.binding&&spec.request.binding>" "){requestAsync.requestBinding=spec.request.binding;
}requestAsync.onreadystatechange=function(){if(requestAsync.readyState===4&&requestAsync.status===200){if(spec.loadingDialog){if(spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="";
}}if(requestAsync.responseText>" "){try{elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
append_text_fnc(debug_string,that);
if(spec.response.type.toUpperCase()==="JSON"){json_response_obj=load_json_obj_fnc(requestAsync.responseText,that);
if(!json_response_obj||(json_response_obj.PARSE_JSON_ERROR&&json_response_obj.PARSE_JSON_ERROR>" ")){send_response_ind=false;
if(spec.loadingDialog&&spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="ERROR: "+messages.json_parsing_failed;
spec.loadingDialog.targetDOM.style.cursor="hand";
spec.loadingDialog.targetDOM.title="Click for more details.";
if(UtilPopup&&(RealTypeOf(UtilPopup)=="object"||RealTypeOf(UtilPopup)=="function")){display_response_text=requestAsync.responseText.split(">").join("&gt;").split("<").join("&lt;");
UtilPopup.attachModalPopup({elementDOM:spec.loadingDialog.targetDOM,event:"click",width:"500px",defaultpos:["30%","20%"],exit:"x",header:"Invalid JSON from "+spec.request.target,content:"<div style='height:500px;width:499px;overflow:auto;'><b>Parameters</b>: "+spec.request.parameters+"<br/><br/><b>Response Text</b>: "+display_response_text+"</div>"});
}else{spec.loadingDialog.targetDOM.onclick=function(event){alert(spec.request.target+"\n"+spec.request.parameters+"\n"+requestAsync.responseText);
};
}}else{alert(messages.json_parsing_failed+" \n\n"+spec.request.target+"\n"+spec.request.parameters);
}}else{send_response_ind=true;
if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={responseText:requestAsync.responseText,response:json_response_obj,parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={responseText:requestAsync.responseText,response:json_response_obj,elapsed:elapsed_time};
}}}else{send_response_ind=true;
if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={responseText:requestAsync.responseText,response:load_xml_obj_fnc(requestAsync.responseText,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={responseText:requestAsync.responseText,response:load_xml_obj_fnc(requestAsync.responseText,that),elapsed:elapsed_time};
}}if(send_response_ind){spec.response.target(response_spec);
}}catch(e){error_handler(e.message,"ajax_request.requestAsync.responseText");
}}}else{try{switch(requestAsync.readyState){case 0:ready_state_msg="0 - Uninitalized";
break;
case 1:ready_state_msg="1 - Loading";
break;
case 2:ready_state_msg="2 - Loaded";
break;
case 3:ready_state_msg="3 - Interactive";
break;
case 4:ready_state_msg="4 - Completed";
break;
}switch(requestAsync.status){case 200:status_msg="200 - Success";
break;
case 405:status_msg="405 - Method Not Allowed";
break;
case 409:status_msg="409 - Invalid State";
break;
case 492:status_msg="492 - Non-Fatal Error";
break;
case 493:status_msg="493 - Memory Error";
break;
case 500:status_msg="500 - Internal Server Exception";
break;
}if(requestAsync.readyState==4&&requestAsync.readyState&&requestAsync.status){ready_state_msg="ajax_request failed on: \n\n Request Target: "+spec.request.target+"\n Request Parameters: "+spec.request.parameters+"\n\n with requestAsync.readyState -> "+ready_state_msg;
status_msg=" requestAsync.status -> "+status_msg;
elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
debug_string+=" <b>requestAsync.readyState </b>"+ready_state_msg;
debug_string+=" <b>requestAsync.status </b>"+status_msg;
append_text_fnc(debug_string,that);
error_handler(ready_state_msg,status_msg);
}}catch(e3){}}};
if(spec.request.type==="XMLHTTPREQUEST"){requestAsync.open("GET",spec.request.target,asyncInd);
if(!spec.request.parameters||spec.request.parameters===null||spec.request.parameters===""){requestAsync.setRequestHeader("Access-Control-Allow-Origin","*");
requestAsync.send(null);
}else{requestAsync.setRequestHeader("Content-type","application/x-www-form-urlencoded");
requestAsync.setRequestHeader("Content-length",spec.request.parameters.length);
requestAsync.setRequestHeader("Connection","close");
requestAsync.send(spec.request.parameters);
}}else{if(location.protocol.substr(0,4)==="http"){var url=location.protocol+"//"+location.host+"/discern/mpages/reports/"+spec.request.target+"?parameters="+spec.request.parameters;
requestAsync.open("GET",url,asyncInd);
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
}catch(e){alert(" requestAsync.setBlobIn not available");
}}requestAsync.send(null);
}else{requestAsync.open("GET",spec.request.target,asyncInd);
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
}catch(e){alert(" requestAsync.setBlobIn not available");
}}requestAsync.send(spec.request.parameters);
}}}else{parse_target=spec.request.target.split(".");
parse_target_type=parse_target[parse_target.length-1].toUpperCase();
parse_target_text=ReadFromFile(spec.request.target);
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="";
}}elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
append_text_fnc(debug_string,that);
switch(parse_target_type){case"JSON":if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:load_json_obj_fnc(parse_target_text,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:load_json_obj_fnc(parse_target_text,that),elapsed:elapsed_time};
}break;
case"XML":if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:load_xml_obj_fnc(parse_target_text,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:load_xml_obj_fnc(parse_target_text,that),elapsed:elapsed_time};
}break;
default:if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:parse_target_text,parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:parse_target_text,elapsed:elapsed_time};
}break;
}spec.response.target(response_spec);
}}catch(e){error_handler(e.message,"ajax_request()");
}};
init();
};
var AjaxHandler=new UtilJsonXml();
var JSON;
if(!JSON){JSON={};
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
}switch(typeof value){case"string":if(JSON.isCCLFloatNumber(value)>" "){return JSON.getCCLFloatNumber(value);
}else{return quote(value);
}case"number":return isFinite(value)?String(value):"null";
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
i+=1){if(typeof rep[i]==="string"){k=rep[i];
v=str(k,value);
if(v){partial.push(quote(k)+(gap?": ":":")+v);
}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);
if(v){partial.push(quote(k)+(gap?": ":":")+v);
}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";
gap=mind;
return v;
}}JSON.stringify=function(value,replacer,space){var i;
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
if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;
function walk(holder,key){var k,v,value=holder[key];
if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);
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
JSON.CCLFLOAT="@CCL_FLOAT@";
JSON.isCCLFloatNumber=function(jsString){if(jsString.indexOf(JSON.CCLFLOAT)===0){return true;
}return false;
};
JSON.setCCLFloatNumber=function(jsNumber){var returnNumber=jsNumber;
if(typeof jsNumber=="number"&&!isNaN(jsNumber)){if(parseFloat(jsNumber)==parseInt(jsNumber,10)){jsNumber=jsNumber.toFixed(2);
}returnNumber=JSON.CCLFLOAT+jsNumber;
}return(returnNumber);
};
JSON.getCCLFloatNumber=function(jsString){var returnNumber="";
returnNumber=jsString.split(JSON.CCLFLOAT).join("");
return(returnNumber);
};
var dateFormat=function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);
len=len||2;
while(val.length<len){val="0"+val;
}return val;
};
return function(date,mask,utc){var dF=dateFormat;
if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;
date=undefined;
}date=date?new Date(date):new Date;
if(isNaN(date)){throw SyntaxError("invalid date");
}mask=String(dF.masks[mask]||mask||dF.masks["default"]);
if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);
utc=true;
}var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:dF.i18n.dayNames[D],dddd:dF.i18n.dayNames[D+7],m:m+1,mm:pad(m+1),mmm:dF.i18n.monthNames[m],mmmm:dF.i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};
return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1);
});
};
}();
dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",shortDate2:"mm/dd/yyyy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",militaryTime:"HH:MM",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",longDateTime:"mm/dd/yyyy h:MM:ss TT Z",longDateTime2:"mm/dd/yy HH:MM",longDateTime3:"mm/dd/yyyy HH:MM",shortDateTime:"mm/dd h:MM TT"};
dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};
Date.prototype.format=function(mask,utc){return dateFormat(this,mask,utc);
};
Date.prototype.setISO8601=function(string){var regexp="([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
var d=string.match(new RegExp(regexp));
var offset=0;
var date=new Date(d[1],0,1);
if(d[3]){date.setMonth(d[3]-1);
}if(d[5]){date.setDate(d[5]);
}if(d[7]){date.setHours(d[7]);
}if(d[8]){date.setMinutes(d[8]);
}if(d[10]){date.setSeconds(d[10]);
}if(d[12]){date.setMilliseconds(Number("0."+d[12])*1000);
}if(d[14]){offset=(Number(d[16])*60)+Number(d[17]);
offset*=((d[15]=="-")?1:-1);
}offset-=date.getTimezoneOffset();
time=(Number(date)+(offset*60*1000));
this.setTime(Number(time));
};
(function(){var doT={version:"0.2.0",templateSettings:{evaluate:/\{\{([\s\S]+?)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:true,append:true,selfcontained:false},template:undefined,compile:undefined};
var global=(function(){return this||(0,eval)("this");
}());
if(typeof module!=="undefined"&&module.exports){module.exports=doT;
}else{if(typeof define==="function"&&define.amd){define(function(){return doT;
});
}else{global.doT=doT;
}}function encodeHTMLSource(){var encodeHTMLRules={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},matchHTML=/&(?!\\w+;)|<|>|"|'|\//g;
return function(code){return code?code.toString().replace(matchHTML,function(m){return encodeHTMLRules[m]||m;
}):code;
};
}global.encodeHTML=encodeHTMLSource();
var startend={append:{start:"'+(",end:")+'",startencode:"'+encodeHTML("},split:{start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("}},skip=/$^/;
function resolveDefs(c,block,def){return((typeof block==="string")?block:block.toString()).replace(c.define||skip,function(m,code,assign,value){if(code.indexOf("def.")===0){code=code.substring(4);
}if(!(code in def)){if(assign===":"){def[code]=value;
}else{eval("def['"+code+"']="+value);
}}return"";
}).replace(c.use||skip,function(m,code){var v=eval(code);
return v?resolveDefs(c,v,def):v;
});
}function unescape(code){return code.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ");
}doT.template=function(tmpl,c,def){c=c||doT.templateSettings;
var cse=c.append?startend.append:startend.split,str,needhtmlencode,sid=0,indv;
if(c.use||c.define){var olddef=global.def;
global.def=def||{};
str=resolveDefs(c,tmpl,global.def);
global.def=olddef;
}else{str=tmpl;
}str=("var out='"+(c.strip?str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):str).replace(/'|\\/g,"\\$&").replace(c.interpolate||skip,function(m,code){return cse.start+unescape(code)+cse.end;
}).replace(c.encode||skip,function(m,code){needhtmlencode=true;
return cse.startencode+unescape(code)+cse.end;
}).replace(c.conditional||skip,function(m,elsecase,code){return elsecase?(code?"';}else if("+unescape(code)+"){out+='":"';}else{out+='"):(code?"';if("+unescape(code)+"){out+='":"';}out+='");
}).replace(c.iterate||skip,function(m,iterate,vname,iname){if(!iterate){return"';} } out+='";
}sid+=1;
indv=iname||"i"+sid;
iterate=unescape(iterate);
return"';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"+vname+"=arr"+sid+"["+indv+"+=1];out+='";
}).replace(c.evaluate||skip,function(m,code){return"';"+unescape(code)+"out+='";
})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|}|^|{)out\+='';/g,"$1").replace(/\+''/g,"").replace(/(\s|;|}|^|{)out\+=''\+/g,"$1out+=");
if(needhtmlencode&&c.selfcontained){str="var encodeHTML=("+encodeHTMLSource.toString()+"());"+str;
}try{return new Function(c.varname,str);
}catch(e){if(typeof console!=="undefined"){console.log("Could not create a template function: "+str);
}throw e;
}};
doT.compile=function(tmpl,def){return doT.template(tmpl,null,def);
};
}());
var HashMap = function () {
	// private
    var ItemCollection = [];
    var isItemExist = function (key) {
    
        var item = new MapItem();
        item.setKey("");
        item.setValue("");
        var flag = false;
        
        for (var i = 0; i < ItemCollection.length; i++) {
        
            if (ItemCollection[i].getKey() === key) {
                flag = true;
                break;
            }
            
        }        
        return flag;        
    };
    
    var MapItem = function (key, value) {
		// Public API
        return {
            key: (_.isNull(key) ? "" : key),
            value: (_.isNull(key) ? "" : value),
            
            getKey: function () {
                return this.key;
            },
            
            getValue: function () {
                return this.value;
            },
            
            setKey: function (key) {
                this.key = key;
            },
            
            setValue: function (value) {
                this.value = value;
            }
        };
    };
    
    var connectMap = function (itemsArray) {
        if (ItemCollection.length === 0) {
            for (var i = 0; i < itemsArray.length; i++) {
                ItemCollection[i] = itemsArray[i];
            }
        }
        else {
            var j = (parseInt(itemsArray.length, 10) + parseInt(ItemCollection.length, 10));
            var orginalLength = parseInt(ItemCollection.length, 10); //save the length of ItemCollection before putting
            for (var i = parseInt(ItemCollection.length, 10); i < j; i++) {
                ItemCollection[i] = itemsArray[i - orginalLength];
            }
        }
    };
    
    var getItem = function (key) {
        var item = new MapItem();
        
        for (var i = 0; i < ItemCollection.length; i++) {
            if (ItemCollection[i].getKey() === key) {
                item = ItemCollection[i];
                break;
            }
        }
        return item;
    };
    
    //Public API
    return {
        getMapCollection: function () {
            return ItemCollection;
        },
        map: function (fnc) {
			var mappedCollection = [], cntr = 0, len = ItemCollection.length, curItem;
			while (cntr < len) {
				curItem = ItemCollection[cntr].value;
				if (fnc(curItem)) {
					mappedCollection.push(curItem);
				}
				cntr++;
			}
			return mappedCollection;
		},
        put: function (key, value) {
            var item = new MapItem();
            if (isItemExist(key) === false) {
                item.setKey(key);
                item.setValue(value);
                ItemCollection[ItemCollection.length] = item;
            }
            else {
                item = getItem(key);
                item.setValue(value);
            }
        },
        putAll: function (itemCollection) {
            if (HashMap.prototype.isPrototypeOf(itemCollection)) {
                connectMap(itemCollection.getMapCollection());                
                return true;
            }
            else {
                if (Array.prototype.isPrototypeOf(itemCollection)) {
                    for (var j = 0; j < itemCollection.length; j++) {
                        if (MapItem.prototype.isPrototypeOf(itemCollection[j]) === false) {
                            return false;
                        }
                    }
                    connectMap(itemCollection);                    
                    return true;
                }
            }
        },
        get: function (key) {
            var value, keys;
			if (key.split("*").length > 1) { // return multiple key/value for key *
				value = [];
				keys = [];
			}
			else {
				value = "";
			}
            for (var i = 0; i < ItemCollection.length; i++) {
				if (key.split("*").length > 1) {
					if (ItemCollection[i].getKey().search(key.split("*")[0]) > -1) {
						keys[keys.length] = ItemCollection[i].getKey();
						value[value.length] = ItemCollection[i].getValue();
					}
				}
				else {
					if (ItemCollection[i].getKey() === key) {
						value = ItemCollection[i].getValue();
						break;
					}
				}
            }
			if (key.split("*").length > 1) {
				return [keys, value];
			}
			else {				
				return value;
			}
        },   
		get_seq: function (key) {
            var value = "";
            for (var i = 0; i < ItemCollection.length; i++) {
                if (ItemCollection[i].getKey() === key) {
                    value = i;
                    break;
                }
            }
            return i;            
        },      
        remove: function (key) {
            for (var i = 0; i < ItemCollection.length; i++) {
            
                if (ItemCollection[i].getKey() === key) {
                    var mid = ItemCollection.length / 2;
                    
                    if (i < mid) {
                        for (var j = i; j > 0; j--) {
                            ItemCollection[j] = ItemCollection[j - 1];
                        }
                    }
                    else {
                        for (var j = i; j < ItemCollection.length; j++) {
                            ItemCollection[j] = ItemCollection[j + 1];
                        }
                    }
                    ItemCollection.length = ItemCollection.length - 1;
                }
            }
        },
        removeAll: function () {
            ItemCollection.length = 0;
        },
        getSize: function () {
            return ItemCollection.length;
        },
        contain: function (key) {
            for (var i = 0; i < ItemCollection.length; i++) {
                if (ItemCollection[i].getKey() === key) {
                    return true;
                }
            }            
            return false;
        }
    };
};
/**
 * Create a new instance of UtilInputText.
 * @classDescription		This class creates a new UtilInputText with to parse/debug JSON and XML.
 * @return {Object}	Returns a new UtilInputText object.
 * @constructor
 */
var UtilInputText = function() {

    /* ******* Private Variables & Methods *** */
    
    var current_sel_index = -1, // Main function to retrieve mouse x-y pos.s
    that = this,
 	dateFormat ="MM/DD/YYYY",
	selected_Index = -1;
	
	function fnc_blur(e) {
		e = e || window.event;
		if (document.activeElement !== that.dom_options_list) {
			hide_popup(e, this, that);
		}
	}

	function fnc_focus(e) {
		e = e || window.event;
		if ( that.dom_input != null && that.dom_input.value > " ") {
			search_values(e, that.dom_input, that);
		} else {
			fnc_blur(e);
		}
	}
	
	function encodeCharacters(cur_value){
		// encode single quotes
		if(cur_value){
			cur_value = cur_value.split("'").join("&#39;");
		}
		else{
			cur_value = ""
		}
		return(cur_value);
	}

	function getMouseXY(e) {
		var tempX, tempY;
		if (event.clientX && event.clientY) { // grab the x-y pos.s if browser is IE
			tempX = event.clientX + document.body.scrollLeft
			tempY = event.clientY + document.body.scrollTop
		} else { // grab the x-y pos.s if browser is NS
			tempX = e.pageX
			tempY = e.pageY
		}
		// catch possible negative values in NS4
		if (tempX < 0) {
			tempX = 0
		}
		if (tempY < 0) {
			tempY = 0
		}

		return {
			x: tempX,
			y: tempY
		}
	}

	function purge(d) {
		var a = d.attributes, i, l, n;
		if (a) {
			l = a.length;
			for (i = 0; i < l; i += 1) {
				n = a[i].name;
				if (typeof d[n] === 'function') {
					d[n] = null;
				}
			}
		}
		a = d.childNodes;
		if (a) {
			l = a.length;
			for (i = 0; i < l; i += 1) {
				purge(d.childNodes[i]);
			}
		}
	}

	/**
	 * Validates a text field for alphabetic input
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Event} Event triggering the check.
	 * @return {Boolean} Result of alphabet check.
	 */
	function validate_alpha(Obj, e) {
		var key;
		var keychar;
		key = get_keycode(e);
		keychar = String.fromCharCode(key);
		var isDecimal = /(\.)+/;
		if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 32) || (key === 27)) { // control keys
			return true;
		} else if ((("abcdefghijklmnopqrstuvwxyz.*,").indexOf(keychar) > -1) || (("ABCDEFGHIJKLMNOPQRSTUVWXYZ").indexOf(keychar) > -1)) { // numbers & decimal point
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Validates a text field for numeric input
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Event} Event triggering the check.
	 * @return {Boolean} Result of numeric check.
	 */
	function validate_numeric(Obj, e) {
		var key, keychar;
		key = get_keycode(e);
		keychar = String.fromCharCode(key);
		var isDecimal = /(\.)+/;
		if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27)) { // control keys
			return true;
		} else if ((("0123456789").indexOf(keychar) > -1) || (keychar === "." && Obj.value.search(isDecimal) === -1)) { // numbers & decimal point
			return true;
		} else {
			return false;
		}
	}

	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}

	function validate_date(Obj, e) {

		var key_code = get_keycode(e), d = new Date();
		// evaluate any hot-key
		switch (key_code) {
			case 84:
				//t -> today
				Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate()).padL(2, "0") + "/" + d.getFullYear();
				break;
			case 89:
				//y -> beginning of year
				Obj.value = String(1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + d.getFullYear();
				break;
			case 82:
				//r -> end of year
				Obj.value = String(12).padL(2, "0") + "/" + String(31).padL(2, "0") + "/" + d.getFullYear();
				break;
			case 77:
				//m -> beginning of month
				Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + d.getFullYear();
				break;
			case 72:
				//h -> end of month
				Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(daysInMonth(d.getMonth(), d.getFullYear())).padL(2, "0") + "/" + d.getFullYear();
				break;
			case 87:
				//w -> beginning of week
				Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate() - d.getDay()).padL(2, "0") + "/" + d.getFullYear();
				break;
			case 75:
				//k -> end of week
				Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate() + (6 - d.getDay())).padL(2, "0") + "/" + d.getFullYear();
				break;
		}

		if (!window.event.shiftKey && !window.event.ctrlKey && !window.event.altKey) {
			if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106)) {
				if (key_code > 95) {
					key_code -= (95 - 47);
				}

				var idx = Obj.value.search(/([*\/]*)[*]([*\/]*)$/);

				if (idx == 0 &&
				(String.fromCharCode(key_code) == '0' ||
				String.fromCharCode(key_code) == '1')) {
					Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
				} else if (idx == 3 &&
				(String.fromCharCode(key_code) == '0' ||
				String.fromCharCode(key_code) == '1' ||
				String.fromCharCode(key_code) == '2' ||
				String.fromCharCode(key_code) == '3')) {
					Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
				} else if (idx == 4) {
					if (Obj.value.substring(3, 4) == '3') {
						if (String.fromCharCode(key_code) == '0' || String.fromCharCode(key_code) == '1') {
							Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
						}
					} else {
						Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
					}
				} else if (idx != 0 && idx != 3) {
					Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
				}

			}

			if (key_code == 8) {
				if (!Obj.value.match(/^[*0-9]{2}\/[*0-9]{2}\/[*0-9]{4}$/)) {
					Obj.value = "**/**/****";
				}

				Obj.value = Obj.value.replace(/([*\/]*)[0-9]([*\/]*)$/, function($0, $1, $2) {
					var idx = Obj.value.search(/([*\/]*)[0-9]([*\/]*)$/);
					if (idx >= 5) {
						return $1 + "*" + $2;
					} else if (idx >= 2) {
						return $1 + "*" + $2;
					} else {
						return $1 + "*" + $2;
					}
				});
				window.event.returnValue = 0;
			}

			if (key_code == 46) {
				Obj.value = "**/**/****";
			}
		}

		if (key_code != 9) {
			event.returnValue = false;
			return false;
		}
		return true;
	}

	function validate_time(Obj, e) {
		var str1, str2, key_code = get_keycode(e), d = new Date();

		switch (key_code) {
			case 78:
				// n -> current time
				Obj.value = String(d.getHours()).padL(2, "0") + ":" + String(d.getMinutes()).padL(2, "0");
				break;
		}
		if (!window.event.shiftKey && !window.event.ctrlKey && !window.event.altKey) {
			if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106)) {
				if (key_code > 95) {
					key_code -= (95 - 47);
				}

				var idx = Obj.value.search(/([*:]*)$/);

				if (idx == 0 &&
				(String.fromCharCode(key_code) == '0' ||
				String.fromCharCode(key_code) == '1' ||
				String.fromCharCode(key_code) == '2')) {
					Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
				} else if (idx == 3 &&
				(String.fromCharCode(key_code) == '0' ||
				String.fromCharCode(key_code) == '1' ||
				String.fromCharCode(key_code) == '2' ||
				String.fromCharCode(key_code) == '3')) {
					Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
				} else if (idx != 0 && idx != 3) {
					Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
				}

			}

			if (key_code == 8) {
				if (!Obj.value.match(/^[*0-9]{2}:[*0-9]{2}$/)) {
					Obj.value = "**:**";
				}

				Obj.value = Obj.value.replace(/([*:]*)[0-9]([*:]*)$/, function($0, $1, $2) {
					var idx = Obj.value.search(/([*:]*)[0-9]([*:]*)$/);
					if (idx >= 5) {
						return $1 + "*" + $2;
					} else if (idx >= 2) {
						return $1 + "*" + $2;
					} else {
						return $1 + "*" + $2;
					}
				});
				window.event.returnValue = 0;
			}

			if (key_code == 46) {
				Obj.value = "**/**/****";
			}
		}

		if (key_code != 9) {
			event.returnValue = false;
			return false;
		}
		return true;
	}

	/**
	 * Parses up the DOM tree to calculate the left and top position of given DOM element.
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Object} DOM Object with to calculate position of.
	 * @return {Object} Array containing the left and top position of given DOM element.
	 * */
	function findPos( oElement ) {
		var ws = window_size();
		function getNextAncestor(oElement) {
			var actualStyle;
			if (window.getComputedStyle) {
				actualStyle = getComputedStyle(oElement, null).position;
			} else if (oElement.currentStyle) {
				actualStyle = oElement.currentStyle.position;
			} else {
				//fallback for browsers with low support - only reliable for inline styles
				actualStyle = oElement.style.position;
			}
			if (actualStyle == 'absolute' || actualStyle == 'fixed') {
				//the offsetParent of a fixed position element is null so it will stop
				return oElement.offsetParent;
			}
			return oElement.parentNode;
		}

		if (typeof(oElement.offsetParent) != 'undefined') {
			var originalElement = oElement;
			for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
				posX += oElement.offsetLeft;
				posY += oElement.offsetTop;
			}
			if (!originalElement.parentNode || !originalElement.style || typeof(originalElement.scrollTop) == 'undefined') {
				//older browsers cannot check element scrolling
				return [posX, posY];
			}
			oElement = getNextAncestor(originalElement);
			while (oElement && oElement != document.body && oElement != document.documentElement) {
				posX -= oElement.scrollLeft;
				posY -= oElement.scrollTop;
				oElement = getNextAncestor(oElement);
			}
			return [posX, posY,  ws.width - 5, ws.height - 5 ,posX, posY - document.body.scrollTop];
		} else {
			return [oElement.x, oElement.y ,  ws.width - 5, ws.height - 5,oElement.x, oElement.y - document.body.scrollTop];
		}
	}
	
	function getScrollingAncestor(childNode){
		var ancestorNode = Util.gp(childNode);
		while(ancestorNode 
				&& ancestorNode.tagName 
				&& ancestorNode.tagName.toUpperCase() != "BODY"){
			if(ancestorNode.scrollHeight>ancestorNode.clientHeight
					&& ancestorNode.tagName.toUpperCase() == "DIV"){				
				break;
			}
			ancestorNode = Util.gp(ancestorNode);
		}
		return(ancestorNode)
	}
	
	function window_size() {
		var w = 0;
		var h = 0;

		//IE
		if (!window.innerWidth) {
			//strict mode
			if (!(document.documentElement.clientWidth == 0)) {
				w = document.documentElement.clientWidth;
				h = document.documentElement.clientHeight;
			}
			//quirks mode
			else {
				w = document.body.clientWidth;
				h = document.body.clientHeight;
			}
		}
		//w3c
		else {
			w = window.innerWidth;
			h = window.innerHeight;
		}
		return {
			width: w,
			height: h
		};
	}

	function autoEllipseText(text, width, classname) {
		var dom_auto_el = document.createElement("span");
		dom_auto_el.whiteSpace = "nowrap";
		dom_auto_el.className = classname;
		dom_auto_el.style.visibility = "hidden";
		dom_auto_el.innerHTML = text;
		dom_auto_el = document.body.appendChild(dom_auto_el);

		if (dom_auto_el.offsetWidth > (width - 20)) {
			var i = 1;
			dom_auto_el.innerHTML = '';
			while (dom_auto_el.offsetWidth < (width - 20) && i < text.length) {
				dom_auto_el.innerHTML = text.substr(0, i) + '...';
				i++;
			}
			returnText = dom_auto_el.innerHTML;
			document.body.removeChild(dom_auto_el);
			return returnText;
		}
		document.body.removeChild(dom_auto_el);
		return text;
	}

	/**
	 * Performs a linear search on the assigned JSON object list and calls functions to display the result list
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Event} Event triggering the search
	 * @param  {Object} DOM Object reference to the row in the search table
	 * @param  {String} JSON object name to search for in the list
	 * @return {Boolean} Pass/Fail of search
	 */
	function search_values(e, Obj, that) {
		if(Obj.value.split(" ").join("") === "") {
			return null;
		}
		var cur_text = Obj.value, jsonIndex,cur_key = get_keycode(e), availHeight,entry = Obj.value, choices = that.maxResults, partialSearch = that.partialSearch, partialChars = 2, ignoreCase = that.ignoreCase, fullSearch = (!partialSearch), ret = [], // Beginning matches
		partial = [],// Inside matches
		value, count = 0;
		if (cur_key === 13 || cur_key === 38 || cur_key === 40) {
			if (that.dom_options_list && that.dom_options_list.hasChildNodes() && that.dom_options_list.style.visibility === "visible") {
				var popup_body;
				if (that.dom_options_list.childNodes[0].tagName.toUpperCase() === "TBODY") {
					popup_body = that.dom_options_list.childNodes[0];
				} else if (that.dom_options_list.childNodes[0].hasChildNodes() && that.dom_options_list.childNodes[0].childNodes[0].tagName.toUpperCase() === "TBODY") {
					popup_body = that.dom_options_list.childNodes[0].childNodes[0];
				}
				if (current_sel_index > popup_body.childNodes.length - 1) {
					current_sel_index = -1;
				}
				if (cur_key === 13 && current_sel_index === -1) {
					current_sel_index = 0;
					that.dom_options_list.scrollTop = 0;
				}
				if (cur_key === 13) { // Enter
					Obj.value = popup_body.childNodes[current_sel_index].id.split("|")[1];
					jsonIndex = popup_body.childNodes[current_sel_index].id.split("|")[2];
					Obj.name = popup_body.childNodes[current_sel_index].title;
					popup_body.childNodes[current_sel_index].className = "ss_list_items";
					that.dom_options_list.style.visibility = "hidden";
					that.dom_options_list_iframe.style.visibility = "hidden";
					current_sel_index = -1;
					if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex]) {
						that.onSelectFnc(that.options_list[jsonIndex]);
					}
				} else if (cur_key === 40) { // Down
					if (current_sel_index >= 0) {
						popup_body.childNodes[current_sel_index].className = "ss_list_items";
					}
					if (current_sel_index === popup_body.childNodes.length - 1 ) {
						current_sel_index = 0;
						that.dom_options_list.scrollTop = 0;
					} else {
						current_sel_index++;
					}
					if((popup_body.childNodes[current_sel_index].offsetTop+popup_body.childNodes[current_sel_index].offsetHeight) > that.dom_options_list.offsetHeight) {
						that.dom_options_list.scrollTop = (popup_body.childNodes[current_sel_index].offsetTop+popup_body.childNodes[current_sel_index].offsetHeight);
					}
					popup_body.childNodes[current_sel_index].className = "ss_list_items_tr_hover";
				} else if (cur_key === 38) { // Up
					if (current_sel_index >= 0) {
						popup_body.childNodes[current_sel_index].className = "ss_list_items";
					}
					if (current_sel_index <= 0) {
						current_sel_index = popup_body.childNodes.length - 1;
						that.dom_options_list.scrollTop = (popup_body.childNodes[current_sel_index].offsetTop+popup_body.childNodes[current_sel_index].offsetHeight);

					} else {
						current_sel_index--;
					}
					if((popup_body.childNodes[current_sel_index].offsetTop) < that.dom_options_list.offsetHeight) {
						that.dom_options_list.scrollTop = popup_body.childNodes[current_sel_index].offsetTop;
					}
					popup_body.childNodes[current_sel_index].className = "ss_list_items_tr_hover";
				}
				//  }
			}
		} else {

			current_sel_index = -1;
			for (var i = 0; i < that.options_list.length && ret.length < choices; i++) {

				var elem = that.options_list[i],
				elem_name = elem[that.search_field],
				elem_value = elem[that.value_field],
				foundPos = ignoreCase ? elem_name.toLowerCase().indexOf(entry.toLowerCase()) : elem_name.indexOf(entry);

				while (foundPos !== -1) {

					if (foundPos === 0) {
						value = "<strong>" + elem_name.substr(0, entry.length) + "</strong>" + elem_name.substr(entry.length);
						ret.push("<tr class='ss_list_items_tr' id= 'ss_list_opt_|" + elem_name + "|" + i + "'   onmouseover='this.className = \"ss_list_items_tr_hover\";' onmouseout= 'this.className = \"ss_list_items_tr\";'><td  id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + "<span  id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + value + "</span>" + "</td></tr>");
						count++;
						break;
					} else if (entry.length >= partialChars && partialSearch && foundPos !== -1) {
						if (fullSearch || /\s/.test(elem_name.substr(foundPos - 1, 1))) {
							value = elem_name.substr(0, foundPos) + "<strong>" +
							elem_name.substr(foundPos, entry.length) +
							"</strong>" +
							elem_name.substr(foundPos + entry.length);
							partial.push("<tr  class='ss_list_items_tr' id= 'ss_list_opt_|" + elem_name + "|" + i + "'   onmouseover='this.className = \"ss_list_items_tr_hover\";' onmouseout= 'this.className = \"ss_list_items_tr\";'><td  id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + "<span id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + value + "</span>" + "</td></tr>");
							count++;
							break;
						}
					}
					foundPos = ignoreCase ? elem_name.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) : elem_name.indexOf(entry, foundPos + 1);
				}
			}
			if (partial.length) {
				ret = ret.concat(partial.slice(0, choices - ret.length));
			}

			if (that.dom_options_list === null || that.dom_options_list === undefined) {
				that.dom_options_list = document.createElement("div");
				that.dom_options_list_iframe = document.createElement("iframe");
				that.dom_options_list.className = "ss_popup";
				that.dom_options_list_iframe.className = "ss_popup";
				that.dom_options_list.style.zIndex = 999999;
				that.dom_options_list_iframe.style.zIndex = 999998;
				that.dom_options_list.innerHTML = "<table>" + ret.join('') + "</table>";
				that.dom_options_list.style.width = Obj.offsetWidth + "px";
				that.dom_options_list_iframe.style.width = Obj.offsetWidth + "px";
				that.dom_options_list.onclick = function(e) {
					var targ,targSplit,jsonIndex;
					e = e || window.event;
					if (e.target) {
						targ = e.target;
					} else {
						if (e.srcElement)
							targ = e.srcElement;
					}
					targSplit = targ.id.split("|");
					if (targSplit[0] === "ss_list_opt_") //fill textfield with selected value
					{
						try {
							current_sel_index = -1;
							jsonIndex = targSplit[2];
							Obj.name = targ.title;
							Obj.value = autoEllipseText(targSplit[1], Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
							if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex]) {
								that.onSelectFnc(that.options_list[jsonIndex]);
							}
						} catch (err) {
							alert("Invalid   option Id");
						}
					}
					that.dom_options_list.style.visibility = "hidden";
					that.dom_options_list_iframe.style.visibility = "hidden";
				};
				that.dom_options_list = document.body.appendChild(that.dom_options_list);
				that.dom_options_list_iframe = document.body.appendChild(that.dom_options_list_iframe);
			} else {
				that.dom_options_list.innerHTML = "";
				that.dom_options_list.style.height = 'auto';
				that.dom_options_list.style.width = Obj.offsetWidth + "px";
				that.dom_options_list.innerHTML = "<table class='ss_list_items'>" + ret.join('') + "</table>";
				that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight+'px';
				that.dom_options_list_iframe.style.width = that.dom_options_list.offsetWidth+'px';
			}
			var cur_pos = findPos(Obj);
			availHeight = (cur_pos[3] - (cur_pos[5] + Obj.offsetHeight));
			topInd = 0;
			if((cur_pos[3]-cur_pos[5]) < cur_pos[5] && that.dom_options_list.offsetHeight > availHeight ) {
				availHeight = ((cur_pos[5]));
				topInd = 1;
			}
			if (that.dom_options_list.offsetHeight > availHeight) {
				that.dom_options_list.style.height = availHeight + "px";
				that.dom_options_list_iframe.style.height = availHeight + "px";
			}

			that.dom_options_list.style.left = (cur_pos[0]) + "px";
			that.dom_options_list_iframe.style.left = (cur_pos[0]) + "px";
			that.dom_options_list.scrollTop = that.selectedMapIndex*(that.dom_options_list.scrollHeight/that.options_list.length);
			if (topInd == 1) {
				that.dom_options_list.style.top = (cur_pos[1]-that.dom_options_list.offsetHeight) + "px";
				that.dom_options_list_iframe.style.top = (cur_pos[1]-that.dom_options_list.offsetHeight) + "px";
			} else {
				that.dom_options_list.style.top = (cur_pos[1] + Obj.offsetHeight) + "px";
				that.dom_options_list_iframe.style.top = (cur_pos[1] + Obj.offsetHeight) + "px";
			}
			that.dom_options_list.onclick = function(e) {
				var targ,targSplit,jsonIndex;
				e = e || window.event;
				if (e.target) {
					targ = e.target;
				} else {
					if (e.srcElement)
						targ = e.srcElement;
				}
				targSplit = targ.id.split("|");
				if (targSplit[0] === "ss_list_opt_") //fill textfield with selected value
				{
					try {
						current_sel_index = -1;
						jsonIndex = targSplit[2];
						Obj.name = targ.title;
						Obj.value = autoEllipseText(targSplit[1], Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
						if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex]) {
							that.onSelectFnc(that.options_list[jsonIndex]);
						}
					} catch (err) {
						alert("Invalid   option Id");
					}
				}
				that.dom_options_list.style.visibility = "hidden";
				that.dom_options_list_iframe.style.visibility = "hidden";
			};
			that.dom_options_list.onblur = function(e) {
				e = e || window.event;
				var el = e.srcElement;
				if (el !== null && typeof el === 'object') {
					var el_pos = findPos(el), m_pos = getMouseXY(e);
					if ((m_pos.x >= el_pos[0] && m_pos.x <= (el_pos[0] + el.offsetWidth)) &&
					(m_pos.y >= el_pos[1] && m_pos.y <= (el_pos[1] + el.offsetHeight))) {
						return false;
					} else {
						hide_popup(e, this, that);
					}
				} else {
					hide_popup(e, this, that);
				}
			};
			//	that.dom_options_list.onfocusout = function(e){
			//       e = e || window.event;
			//		hide_popup(e, this, that);
			//   };

			if (entry > "" && count > 0) {
				that.dom_options_list.style.visibility = "visible";
				that.dom_options_list_iframe.style.visibility = "visible";
				that.dom_options_list.focus();
			} else {
				that.dom_options_list.style.visibility = "hidden";
				that.dom_options_list_iframe.style.visibility = "hidden";
			}
		}
	}

	/**
	 * Performs a linear search on the assigned JSON object list and calls functions to display the result list
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Event} Event triggering the search
	 * @param  {Object} DOM Object reference to the row in the search table
	 * @param  {String} JSON object name to search for in the list
	 * @return {Boolean} Pass/Fail of search
	 */
	function toggle_dropdown_list(e, selectContainerNode, selectDisplayNode, that) {
		var cur_text = selectDisplayNode.innerHTML
		,cur_key = 0
		,entry = selectDisplayNode.innerHTML,scrollTop
		,parentContainer
		,onMouseOverFnc = 'this.style.backgroundColor = "yellow";'
		,onMouseOutFnc = 'this.style.backgroundColor = "white";'
		,disp_list = [], cur_value, category_count = -1, cat_hash = new HashMap(), temp_arr, temp_arr2, temp_obj;
		if (that.dom_options_list == null || that.dom_options_list.style.visibility != "visible") {
			for (var i = 0; i < that.options_list.length; i++) {
				var elem = that.options_list[i], elem_name = elem[that.search_field], elem_icon = that.icon_field ? elem[that.icon_field] : "";
				elem_category = that.category_field ? elem[that.category_field] : "";
				// encode special characters
				elem_category = encodeCharacters(elem_category);
				if (elem_category > "") { // show categories
					if (!cat_hash.contain(elem_category)) {
						category_count += 1;
						temp_arr = [];
						cat_hash.put(elem_category, temp_arr);
						temp_arr = cat_hash.get(elem_category);
						temp_arr.push("<tr  class='ss_list_items_tr_category' id= 'ss_list_opt_category|" + elem_category + "' ><td  id= 'ss_list_opt_category|" + elem_category + "'>" + "<span id= 'ss_list_opt_category|" + elem_category + "'>" + elem_category + "</span>" + "</td></tr>");
						cat_hash.put(elem_category, temp_arr);
					}
					temp_arr = cat_hash.get(elem_category);
					cur_value = "ss_list_opt_|" + elem_name + "|" + category_count + "|" + (i - category_count) + "|" + (i);
					// encode special characters
					cur_value = encodeCharacters(cur_value);
					if ((that.selectedMapIndex == (i - category_count) && that.selectedCategory == category_count) || (that.default_sel > "" && that.default_sel === elem_name)) {

						temp_arr.push("<tr  class='ss_list_items_tr_selected' id = '" + cur_value + "'><td  id = '" + cur_value + "'>" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
						that.selectedMapIndex = (i - category_count);
						that.selectedCategory = category_count;
						that.selectedIndex = i;
						that.default_sel = "";
						selectDisplayNode.innerHTML = autoEllipseText(elem_name, selectDisplayNode.parentNode.offsetWidth - selectDisplayNode.parentNode.childNodes[1].offsetWidth, selectDisplayNode.className);
					} else {
						temp_arr.push("<tr  class='ss_list_items_tr' id = '" + cur_value + "'><td >" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
					}
					cat_hash.put(elem_category, temp_arr);
				} else { // plain list
					cur_value = "ss_list_opt_|" + elem_name + "||" + (i) + "|" + (i);
					// encode special characters
					cur_value = encodeCharacters(cur_value); 
					if ((that.selectedMapIndex == i) || (that.default_sel > "" && that.default_sel === elem_name)) {

						disp_list.push("<tr  class='ss_list_items_tr_selected' id = '" + cur_value + "'><td  id = '" + cur_value + "'>" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
						that.selectedMapIndex = i;
						that.selectedIndex = i;
						that.default_sel = "";
					} else {
						disp_list.push("<tr  class='ss_list_items_tr' id = '" + cur_value + "'  style='width:100%;'><td  id = '" + cur_value + "' style='width:100%;'>" + "<span id = '" + cur_value + "' onmouseover='"+onMouseOverFnc+"' onmouseout= '"+onMouseOutFnc+"' style='width:100.00%'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
					}
				}
			}
			temp_arr = cat_hash.getMapCollection();
			for (var j = 0; j < temp_arr.length; j++) {
				temp_obj = temp_arr[j];
				disp_list.push(temp_obj.getValue().join(''));
			}

			if (that.dom_options_list === null || that.dom_options_list === undefined) {
				that.dom_options_list = document.createElement("div");
				that.dom_options_list_iframe = document.createElement("iframe");
				that.dom_options_list.className = "ss_popup";
				that.dom_options_list_iframe.className = "ss_popup";
				that.dom_options_list.style.zIndex = 999999;
				that.dom_options_list_iframe.style.zIndex = 999998;
				that.dom_options_list.innerHTML = "<table style='width:100%;'>" + disp_list.join('') + "</table>";
				that.dom_options_list.style.width = selectContainerNode.offsetWidth + "px";
				that.dom_options_list_iframe.style.width = selectContainerNode.offsetWidth + "px";
				that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight+'px';
							
			} else {
				that.dom_options_list.innerHTML = "";
				that.dom_options_list.style.height = 'auto';
				that.dom_options_list.style.width = selectContainerNode.offsetWidth + "px";
				that.dom_options_list.innerHTML = "<table class='ss_list_items'>" + disp_list.join('') + "</table>";
				that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight+'px';
				that.dom_options_list_iframe.style.width = that.dom_options_list.offsetWidth+'px';
			}
				parentContainer = getScrollingAncestor(selectContainerNode);
				if(!parentContainer || parentContainer == null || parentContainer.tagName == undefined){
					parentContainer = document.body;
				};
				if(Util.gp(that.dom_options_list) != parentContainer){
					that.dom_options_list = Util.ac(that.dom_options_list,parentContainer);
					that.dom_options_list_iframe = Util.ac(that.dom_options_list_iframe,parentContainer);
				}
			//Position the dropdownlist
			setElementPositionAdjacent(that.dom_options_list_iframe,selectContainerNode);
			setElementPositionAdjacent(that.dom_options_list,selectContainerNode);
			
			
			that.dom_options_list.onclick = function(e) {
				var targ, e = (e || window.event), cur_sel_index = that.selectedMapIndex, targ_id_split;
				if (e.target) {
					targ = e.target;
				} else {
					if (e.srcElement)
						targ = e.srcElement;
				}
				if (targ.id && targ.id.split("|")[0] === "ss_list_opt_") //fill textfield with selected value
				{
					targ_id_split = targ.id.split("|");
					try {
						that.selectedCategory = targ_id_split[2];
						that.selectedMapIndex = targ_id_split[3];
						that.selectedIndex = targ_id_split[4];
						selectDisplayNode.innerHTML = autoEllipseText(targ_id_split[1], selectDisplayNode.parentNode.offsetWidth - selectDisplayNode.parentNode.childNodes[1].offsetWidth, selectDisplayNode.className);
						if (cur_sel_index != that.selectedMapIndex) {
							if (that.onchange !== null &&
							that.onchange != undefined &&
							typeof that.onchange == 'function')
								that.onchange();
						}
					} catch (err) {
						alert("Invalid   option Id");
					}
				}
				that.dom_options_list.style.visibility = "hidden";
				that.dom_options_list_iframe.style.visibility = "hidden";
			};
			that.dom_options_list.onblur = function(e) {
				e = e || window.event;
				var el = e.srcElement;
				if (el !== null && typeof el === 'object') {
					var el_pos = findPos(el), m_pos = getMouseXY(e);
					if ((m_pos.x >= el_pos[0] && m_pos.x <= (el_pos[0] + el.offsetWidth)) &&
					(m_pos.y >= el_pos[1] && m_pos.y <= (el_pos[1] + el.offsetHeight))) {
						return false;
					} else {
						hide_popup(e, this, that);
					}
				} else {
					hide_popup(e, this, that);
				}
			};
			//	that.dom_options_list.onfocusout = function(e){
			//       e = e || window.event;
			//		hide_popup(e, this, that);
			//   };
			that.dom_options_list.style.visibility = "visible";
			that.dom_options_list_iframe.style.visibility = "visible";
			that.dom_options_list.scrollTop = parseInt(that.selectedMapIndex*(that.dom_options_list.scrollHeight/that.options_list.length),10);
			that.dom_options_list.focus();

		} else {
			that.dom_options_list.style.visibility = "hidden";
			that.dom_options_list_iframe.style.visibility = "hidden";
		}
	}

	function sortbyname(name, a, b) {
		return (((a[name].toLowerCase() < b[name].toLowerCase()) ? -1 : ((a[name].toLowerCase() > b[name].toLowerCase()) ? 1 : 0)));
	}

	/**
	 * Hides the search list popup for empty search results or when a result is selected
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Object} DOM Object reference to the input field
	 * @param  {Event} Event triggering the search
	 */
	function hide_popup(e, Obj, that) {
		var targ = document.activeElement,targSplit,jsonIndex;
		try {
			if (targ && targ.id.split("|")[0] === "ss_list_opt_") //fill textfield with selected value
			{
				targSplit = targ.id.split("|");
				current_sel_index = -1;
				jsonIndex = targSplit[2];
				Obj.name = targ.title;
				Obj.value = targSplit[1];
				if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex]) {
					that.onSelectFnc(that.options_list[jsonIndex]);
				}
			}
		} catch (err) {
			alert("Invalid  option Id");
		}

		if (that.dom_options_list !== null) {
			that.dom_options_list.style.visibility = "hidden";
			that.dom_options_list_iframe.style.visibility = "hidden";
		}

	}

	/**
	 * Returns the chractercode for triggering event
	 * @memberOf UtilInputText
	 * @method
	 * @param  {Event} Event triggering with the key
	 */
	function get_keycode(e) {
		var characterCode;
		try {
			if (e && e.which) // NN4 specific code
			{
				e = e;
				characterCode = e.which;
			} else {
				characterCode = e.keyCode; // IE specific code
			}
		} catch(error) {
			characterCode = 0;
		}
		return characterCode;
	}

	function setElementPositionAdjacent(elementToMove,adjacentElement) {
		var adjacentPosition = findPos(adjacentElement)
			, adjacentElementOffsetLeft = adjacentPosition[0]
			, adjacentElementOffsetTop = adjacentPosition[1]
			, windowHeight = adjacentPosition[3]
			, adjacentElementOffsetScrollTop = adjacentPosition[5]
			, adjacentElementOffsetHeight = adjacentElement.offsetHeight
			, elementParentPosition = findPos(Util.gp(elementToMove))
			, elementParentOffsetTop = elementParentPosition[5]
			, elementParentOffsetLeft = elementParentPosition[0]
			, availableHeight
			, parentContainer = Util.gp(elementToMove)
			, displayElementAboveAdjacent = 0;
			if(isNaN(elementParentOffsetLeft)){
				elementParentOffsetLeft = 0;
			}
			if(isNaN(elementParentOffsetTop)){
				elementParentOffsetTop = 0;
			}
			adjacentElementOffsetTop = parseInt(adjacentElementOffsetTop,10) - parseInt(elementParentOffsetTop,10);
			adjacentElementOffsetLeft = parseInt(adjacentElementOffsetLeft,10) - parseInt(elementParentOffsetLeft,10);

		availableHeight = (windowHeight - (adjacentElementOffsetScrollTop + adjacentElementOffsetHeight));
		
		if((windowHeight-adjacentElementOffsetScrollTop) < adjacentElementOffsetScrollTop && that.dom_options_list.offsetHeight > availableHeight ) {
			availableHeight = (adjacentElementOffsetScrollTop)- parseInt(elementParentOffsetTop,10);
			displayElementAboveAdjacent = 1;
		}
		// List larger than available height => add scroll bar
		if (that.dom_options_list.offsetHeight > availableHeight) {
			that.dom_options_list.style.height = availableHeight + "px";
			that.dom_options_list_iframe.style.height = availableHeight + "px";
		}
		// position list
		that.dom_options_list.style.left = adjacentElementOffsetLeft + "px";
		that.dom_options_list_iframe.style.left = adjacentElementOffsetLeft + "px";
		
		if (displayElementAboveAdjacent == 1) {
			that.dom_options_list.style.top = (adjacentElementOffsetTop - that.dom_options_list.offsetHeight + parseInt(parentContainer.scrollTop,10)) + "px";
			that.dom_options_list_iframe.style.top = (adjacentElementOffsetTop - that.dom_options_list.offsetHeight + parseInt(parentContainer.scrollTop,10)) + "px";
		} else {
			that.dom_options_list.style.top = (adjacentElementOffsetTop + adjacentElementOffsetHeight + parseInt(parentContainer.scrollTop,10)) + "px";
			that.dom_options_list_iframe.style.top = (adjacentElementOffsetTop + adjacentElementOffsetHeight + parseInt(parentContainer.scrollTop,10)) + "px";
		}
	}

	/***** Public Methods ****/
	//return{
	this.selectedIndex = -1;
	this.selectedMapIndex = -1;
	this.selectedCategory = -1;
	this.categoryCount = -1;
	this.options_list = null;
	this.search_field = "";
	this.icon_field = "";
	this.category_field = "";
	this.default_sel = "";
	this.ignoreCase = true;
	this.partialSearch = true;
	this.maxResults = 10;
	this.dom_options_list = null;
	this.dom_options_list_iframe = null;
	this.searchType = "LEADING"
	this.sortOrder = "ASC"
	this.sortOffset = 1;
	this.dom_input = null;
	this.onSelectFnc = null;
	var that = this;
	this.searchList = function(prefs) {
		var inputID = prefs.inputID
		,validation = prefs.inputValidation
		,JSONList = prefs.JSONList
		,JSONRefs = prefs.JSONRefs
		,JSONSource = prefs.JSONSource
		,onSelectFnc = prefs.onSelectFnc
		,onKeyUpFnc = prefs.onKeyUpFnc
		,ignoreCase = prefs.ignoreCase
		,partialSearch = prefs.partialSearch
		,searchType = prefs.searchType
		,sortOrder = prefs.sortOrder
		,maxResults = parseInt(prefs.maxResults,10)
		that.onSelectFnc =    onSelectFnc
		if (inputID && inputID > " "&& JSONRefs && JSONRefs.length > 0) {
			that.dom_input = document.getElementById(inputID);
			if (validation && validation > " ") { // define validation
				that.set_value_type(inputID, validation);
			}
			if (searchType != undefined && (searchType   === "LEADING" || searchType === "ANY")) { // search type
				that.searchType = searchType;
			}
			if (ignoreCase != undefined && (ignoreCase   === true || ignoreCase === false)) { // ignore case for search
				that.ignoreCase = ignoreCase;
			}
			if (partialSearch != undefined && (partialSearch   === true || partialSearch === false)) { // partial search
				that.partialSearch = partialSearch;
			}
			if (maxResults && maxResults > 0) { // maximum results to show
				that.maxResults = maxResults;
			}
			if (sortOrder && sortOrder > " ") { // define validation
				that.sortOrder = sortOrder;
				switch(sortOrder) {
					case"ASC":
						that.sortOffset = 1;
						break;
					case"DESC":
						that.sortOffset = -1;
						break;
				}
			}

			that.search_field = JSONRefs[0];
			if (JSONSource && JSONSource === "ASYNC") { // for async type, attach on Key Up Handler
				that.dom_input["onkeyup"] = function(e) {
					e = e || window.event;
					var cur_key = get_keycode(e);
					if (that.dom_input.value > " ") {
						if (cur_key === 13 || cur_key === 38 || cur_key === 40) {	// if up, down or enter => navigate through current list

							search_values(e, that.dom_input, that);
						} else {
							onKeyUpFnc(e, that);
						}
					} else {
						fnc_blur(e);
					}
				}
			} else {
				JSONList.sort( function(a,b) {
					return (that.sortOffset * (sortbyname(JSONRefs[0],a,b)));
				})
				if (JSONList && JSONList.length > 0 ) { // define search list
					that.set_search_list(inputID, JSONList, JSONRefs[0])
				}
			}

			that.dom_input["onblur"] = fnc_blur;
			that.dom_input["onfocusout"] = fnc_blur;
			that.dom_input["onDOMFocusOut"] = fnc_blur;
		}
	}
	this.loadSearchList = function(e, JSONList) {
		var that = this;
		that.options_list = JSONList; // set options_list
		e = e || window.event;
		search_values(e, that.dom_input, that);
		that.dom_input["onDOMFocusIn"] = fnc_focus;
		that.dom_input["onfocus"] = fnc_focus;
	}
	/**
	 * Attach the appropriate event handlers for linear text search
	 * @memberOf UtilInputText
	 * @method
	 * @param  {String} Id of the input field to attach event
	 * @param  {Object} JSON list object with the search data
	 * @param  {String} Object name of the search value
	 */
	this.set_search_list = function(ss_list_id, options_list, search_field) {
		var that = this;
		that.options_list = options_list;
		that.search_field = search_field;
		that.dom_input = document.getElementById(ss_list_id)

		that.dom_input["onkeyup"] = fnc_focus
		that.dom_input["onDOMFocusIn"] = fnc_focus;
		that.dom_input["onfocus"] = fnc_focus;
		that.dom_input["onblur"] = fnc_blur;
		that.dom_input["onfocusout"] = fnc_blur;
		that.dom_input["onDOMFocusOut"] = fnc_blur;
	};
	this.hide_list = function(e,ss_list_id) {
		var dom_el = document.getElementById(ss_list_id);
		hide_popup(e, dom_el, this);
	}
    
    /** 
     * Attach the appropriate event handlers for linear text search
     * @memberOf UtilInputText
     * @method
     * @param  {String} Id of the input field to attach event
     * @param  {Object} JSON list object with the search data
     */
    this.set_dropdown_list = function(ss_dom_el, options_list, search_field, icon_field, category_field, default_sel, default_disp){
        var dom_span_el, dom_btn_el, temp_node,dom_div_el;
        var that = this,cntr;
				
        dom_span_el = document.createElement("span");
        dom_span_el = ss_dom_el.appendChild(dom_span_el);
        dom_span_el.className = "ss_list_dropdown_detail";
        dom_span_el.innerHTML = "&nbsp;";
               
        dom_btn_el = document.createElement("span");
        dom_btn_el = ss_dom_el.appendChild(dom_btn_el);
        dom_btn_el.className = "ss_list_dropdown_btn";
        dom_btn_el.innerHTML = "&#9660;";
        
		dom_div_el = ss_dom_el.appendChild(document.createElement("div"));
		
        that.search_field = search_field;
        that.icon_field = icon_field;
        that.category_field = category_field;
        that.default_sel = default_sel;
        that.options_list = options_list;
		that.view_node = dom_span_el;
		that.selectedIndex = 0;
		for(cntr = 0;cntr < options_list.length;cntr++){
			if(options_list[cntr][search_field] == default_sel){
				that.selectedIndex = cntr;
				break;
			}
		}
        
        ss_dom_el.className = "ss_list_dropdown_span";
	//	ss_dom_el =  ss_dom_el.appendChild(temp_node)
		
        ss_dom_el.onclick = function(e){
            e = e || window.event;
            toggle_dropdown_list(e, ss_dom_el, dom_span_el, that);
        };
        if (default_disp === true) {
            toggle_dropdown_list(null, ss_dom_el, dom_span_el, that);
        }
        if (that.default_sel === "") {
            that.default_sel = that.options_list[0][that.search_field];
        }
        dom_span_el.innerHTML = autoEllipseText(that.default_sel, dom_span_el.parentNode.offsetWidth - dom_span_el.parentNode.childNodes[1].offsetWidth, dom_span_el.className);
       	window.attachEvent("onresize",function(){
			if (that.dom_options_list
				&& that.dom_options_list !== null 
				&& typeof that.dom_options_list === 'object'
				&& typeof that.dom_options_list.onblur === 'function') {
				that.dom_options_list.onblur();
			}
		});
    };
    
    this.shift_option = function(obj){
        var that = this;
        that.options_list.shift(obj);
    };
    
    this.append_option = function(obj){
        var that = this;
        that.options_list.push(obj);
    };
      
    this.setSelectedIndex = function(index){
    	var elem = that.options_list[index],
		elem_name = elem[that.search_field],
		selectDisplayNode = that.view_node;
		
		that.default_sel = elem_name;
		that.selectedIndex =  index;
    	selectDisplayNode.innerHTML = autoEllipseText(elem_name, selectDisplayNode.parentNode.offsetWidth - selectDisplayNode.parentNode.childNodes[1].offsetWidth, selectDisplayNode.className);
	} 
        
    /** 
     * Attach the appropriate event handlers for text validation
     * @memberOf UtilInputText
     * @method
     * @param  {String} Id of the input field to validate
     * @param  {String} value type to validate
     */
    this.set_value_type = function(ss_list_id, value_type){
        var dom_el = document.getElementById(ss_list_id);
        switch (value_type) {
            case "ALPHA":
                dom_el.onkeypress = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_alpha(dom_el, e);
                };
                break;
            case "NUM":
                dom_el.onkeypress = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_numeric(dom_el, e);
                };
                break;
            case "DATE":
                dom_el.value = "**/**/****";
                dom_el.onkeydown = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_date(dom_el, e);
                };
                break;
            case "TIME":
                dom_el.value = "**:**";
                dom_el.onkeydown = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_time(dom_el, e);
                };
                break;
        }
    }
    
     /** 
     * Attach the appropriate event handlers for text validation
     * @memberOf UtilInputText
     * @method
     * @param  {String} Id of the input field to validate
     * @param  {String} value type to validate
     */
    this.set_node_value_type = function(dom_el, value_type){
    	that.dom_input = dom_el; 
        switch (value_type) {
            case "ALPHA":
                dom_el.onkeypress = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_alpha(dom_el, e);
                };
                break;
            case "NUM":
                dom_el.onkeypress = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_numeric(dom_el, e);
                };
                break;
            case "DATE":
                dom_el.value = "**/**/****";
                dom_el.onkeydown = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_date(dom_el, e);
                };
                break;
            case "TIME":
                dom_el.value = "**:**";
                dom_el.onkeydown = function(e){
                    if (!e) {
                        e = window.event;
                    }
                    return validate_time(dom_el, e);
                };
                break;
        }
    }
    
    this.getInputDate = function(){
    	var dateString
 			,inputDate = null
 			,month
 			,date
 			,year;
    	if(that.dom_input){
    		dateString = that.dom_input.value;
    		if(dateString.indexOf("*") == -1){
    			switch(dateFormat){
    				case "MM/DD/YYYY": year = parseInt(dateString.split("/")[2],10);
    								   month = parseInt(dateString.split("/")[0],10)-1;
    								   date = parseInt(dateString.split("/")[1],10);
    								   break;
    			}
			   inputDate =  new Date();
			   inputDate.setHours(0);
			   inputDate.setMinutes(0);
			   inputDate.setSeconds(0);
			   inputDate.setMilliseconds(0);
			   inputDate.setFullYear(year);
			   inputDate.setMonth(month);
			   inputDate.setDate(date);
    		}
    	}
    	return(inputDate)
    }
    
    //}
};

var UtilInputTextController = (function(){
	var curUtilInputTextObj;
	return ({
		setCurrentUtilInputText: function(current_ut_object){
			curUtilInputTextObj = current_ut_object;
		},
		getCurrentUtilInputText: function(){
			return (curUtilInputTextObj);
		},
		selectOption: function(option_node){
			if(curUtilInputTextObj)
			{ var Obj = curUtilInputTextObj.view_node,cur_sel_index = curUtilInputTextObj.selectedMapIndex, targ_id_split;
                if (option_node.id && option_node.id.split("|")[0] === "ss_list_opt_") //fill textfield with selected value
                {	
                    option_node_id_split = option_node.id.split("|");
                    try {
                        curUtilInputTextObj.selectedCategory = option_node_id_split[2];
                        curUtilInputTextObj.selectedMapIndex = option_node_id_split[3];
                        curUtilInputTextObj.selectedIndex = option_node_id_split[4];
                        
                        Obj.innerHTML = autoEllipseText(option_node_id_split[1], Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
                        if (cur_sel_index != curUtilInputTextObj.selectedMapIndex) {
                            if (curUtilInputTextObj.onchange !== null &&
                            curUtilInputTextObj.onchange != undefined &&
                            typeof curUtilInputTextObj.onchange == 'function') 
                                curUtilInputTextObj.onchange();
                        }
                    } 
                    catch (err) {
                        alert("Invalid   option Id");
                    }
                }
                curUtilInputTextObj.dom_options_list.style.visibility = "hidden";
				curUtilInputTextObj.dom_options_list_iframe.style.visibility = "hidden";
            }
		}
		
	});
	
}());/** extern healthe-widget-library-1.3.2-min */
/**
 * @author RB018070
 * Reference
 * attachHover - parameter format
 * 	 {	"elementDOM": "Reference to the DOM element to attach hover behavior to",
      	"event": "elementDOM event to trigger hover behavior",
        "content": "Display content for the hover"
    }
 * 
 * attachPopup - parameter format
 * 	 {	"elementDOM": "Reference to the DOM element to attach Popup behavior to",
      	"event": "elementDOM event to trigger popup behavior",
        "width": "Width of the popup",
        "defaultpos": ["Top Corner position", "Left Corner Position"],					
        "exit": "Display string for the popup exit button",
        "header": "Display string for the popup header",
        "content": "Display content for the popup",
        "displayTimeout": "Timeout before displaying the hover"
    }
 * 
 */
var UtilPopup = (function(){
    var hoverPopupDOM = Util.cep("div", {
        "className": "popup_hover"
    })
	, dragObj = {}
	, popupDOM = null
	, modalPopup = null
	, popupHeaderTextDOM = null
	, popupHeaderDragDOM = null
	, popupContentDOM = null
	, popupHeaderExitDOM = null
	,hideHoverFnc
	,displayTimeOut
	,hideTimeOut
	,currentDragNode = null
	,currentDragCloneNode = null
	,dragTimeOut;
	var dragHolderNode = null;
    function UtilPopup_mpo(e){
        var posx = 0;
        var posy = 0;
        if (!e) 
            var e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else 
            if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
            }
        return [posy, posx];
    }
    function modalWindow(contents){
        var that = "", iBlockr = "", windowGeometry = "", shim = "", iebody = "", dsocleft = 0, dsoctop = 0, blockrHeight = 0, mcontents = contents;
        //Determining document scroll offset coordinates (DSOC) 
        //	var browserName = getBrowserName();
        
        //Verify which web browser that is used.
        //switch(browserName.toLowerCase()){
        //case "firefox":
        //	dsocleft = window.pageXOffset;
        //	dsoctop = window.pageYOffset;
        //	break;
        //case "msie":
        //If your page uses a doctype at the top of the page that causes IE6 to go into standards compliant mode (ie: XHTML strict), 
        //the way to accessing the DSOC properties in IE6 changes, namely, from document.body to document.documentElement.
        //This means is that whenever you're referencing the DSOC properties, your code should take into account the 
        //possibility of IE6 strict mode, and choose between document.documentElement and document.body, respectively.
        iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
        dsocleft = document.all ? iebody.scrollLeft : pageXOffset;
        dsoctop = document.all ? iebody.scrollTop : pageYOffset
        //break;
        //}
        //Create a reference to self.
        that = this;
        //Make the mcontents object hidden but rendered so I can measure it's size.
        mcontents.style.visibility = "hidden";
        
        //Get the size of the mcontents div.
        this.width = mcontents.offsetWidth;
        this.height = mcontents.offsetHeight;
        
        //First create a semi-transparent input blocker to cover the page.
        iBlockr = Util.cep("div", {
            "id": "div-iBlockr",
            "className": "popup-modal-background"
        });
        setOpacity(iBlockr, 0.3); // Make it semi-transparent.
        //Get the size of the document and window and use it to size the input blocker.
        windowGeometry = getWindowGeometry();
        //iBlockr.style.width = windowGeometry.bodyWidth + "px";
        //Note: 600 is added so the "grey area" is longer.
        blockrHeight = parseInt(windowGeometry.bodyHeight);
        iBlockr.style.height = blockrHeight + "px";
        Util.ac(iBlockr, document.body);
        //This function will display the window.
        this.display = function(){
            //Make this window a singleton and keep a global reference.
            window.currentModalWindow = that;
            //Attach the modal input blocker to the document.
            iBlockr.style.display = "";
            mcontents.style.display = "";
            iBlockr.style.visibility = "visible";
            mcontents.style.visibility = "visible";
            mcontents.style.zIndex = 3000;
        }
        //This will eradicate the modal window.
        this.hide = function(){
            //Hide the content window.
            iBlockr.style.display = "none";
            mcontents.style.display = "none";
            iBlockr.style.visibility = "hidden";
            mcontents.style.visibility = "hidden";
            window.currentModalWindow = null;
        }
        
    }
    function setOpacity(elRef, value){
        //Value should be between 0 and 1.
        //W3C browsers and IE7+
        elRef.style.opacity = value;
        //Older versions of IE
        elRef.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';
        
    }
    function getWindowGeometry(){
        var doc = "", browserWidth = "", browserHeight = "", bodyWidth = "", bodyHeight = "", scrollX = "", scrollY = "";
        
        try {
            doc = (!document.compatMode || document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
            if (window.innerWidth) {
                //Most Browsers
                browserWidth = window.innerWidth;
                browserHeight = window.innerHeight;
            }
            else {
                //IE
                browserWidth = doc.clientWidth;
                browserHeight = doc.clientHeight;
            }
            bodyWidth = Math.max(doc.scrollWidth, browserWidth);
            bodyHeight = Math.max(doc.scrollHeight, browserHeight);
            
            scrollX = (bodyWidth > browserWidth);
            scrollY = (bodyHeight > browserHeight);
        } 
        catch (error) {
            showErrorMessage(error.message, "getWindowGeometry");
        }
        return {
            windowWidth: browserWidth,
            windowHeight: browserHeight,
            bodyWidth: bodyWidth,
            bodyHeight: bodyHeight,
            scrollX: scrollX,
            scrollY: scrollY
        };
    }
    function dragStart(e, domObj){
        var el, x, y, e, startMousePosition = UtilPopup_mpo(e);
        if (!e) 
            e = window.event;
        dragObj.elNode = domObj;
        x = UtilPopup_mpo(e);
        y = x[0];
        x = x[1];
        dragObj.cursorStartX = x;
        dragObj.cursorStartY = y;
        dragObj.elStartLeft = dragObj.elNode.offsetLeft;
        dragObj.elStartTop = dragObj.elNode.offsetTop;
		
				document.onmousemove = dragGo;
				document.onmouseup = dragStop;
        Util.cancelBubble(e);
		return false;
    }
    function dragGo(e){
        var mpos,x, y, e;
        if (!e) 
            e = window.event;
        mpos = UtilPopup_mpo(e);
        y = mpos[0];
        x = mpos[1];
        dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
        dragObj.elNode.style.top = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";
		checkDropContainers(mpos);
        Util.cancelBubble(e);
    }
    function dragStop(e){
		try {
			if (!e) 
				e = window.event;
			var deleteNode;
			if (dragTimeOut && dragTimeOut != null) {
				clearTimeout(dragTimeOut);
			}
			
			// handler drag Nodes without any	
			if (currentDragNode != null && dragHolderNode == null) {
				Util.de(currentDragNode);
				currentDragNode = null;
			}
			else 
				if (dragHolderNode != null && currentDragNode != null) {
					currentDragNode.style.position = "relative";
					currentDragNode.style.top = "0px";
					currentDragNode.style.left = "0px";
					currentDragNode.style.width = "100%";
					currentDragNode.style.height = "auto";
					Util.removeEvent(currentDragNode, "mousedown", draggableHandlerFunction);
					
					// show the "x" remove buttons
					$(currentDragNode).find("div.remove-button").css("visibility", "visible");
					
					Util.ia(currentDragNode, dragHolderNode);
					Util.de(dragHolderNode);
					dragHolderNode = null;
				}
			
			
			currentDragNode = null;
			
				document.onmousemove = function(e){};
				document.onmouseup = function(e){};
			Util.cancelBubble(e);
		}
		catch(err){
			errorHandler(err, "dragStop");
		}
    }
    function displayModalPopup(popPrefs,popupType){
         if (popupDOM == null) { // Popup type
            popupDOM = Util.cep("div", {
                "className": "popup-modal"
            });
            popupContentDOM = Util.cep("div", {
                "className": "popup-modal-content"
            });
			
	            popupHeaderWrapDOM = Util.cep("span", {
	                "className": "popup-modal-header-wrapper"
	            });
	            popupHeaderTextDOM = Util.cep("span", {
	                "className": "popup-modal-header-text",
	                "title": "Click and Hold to move popup"
	            });
	            popupHeaderExitDOM = Util.cep("span", {
	                "className": "popup-modal-header-exit",
	                "title": "Click to close popup"
	            });
				
            if(popupType == true){
	            popupHeaderTextDOM = Util.ac(popupHeaderTextDOM, popupHeaderWrapDOM);
	            popupHeaderExitDOM = Util.ac(popupHeaderExitDOM, popupHeaderWrapDOM);
	            popupHeaderWrapDOM = Util.ac(popupHeaderWrapDOM, popupDOM);
			}
            popupContentDOM = Util.ac(popupContentDOM, popupDOM);
            modalPopup = new modalWindow(popupDOM);
			
           if (popupType == true) { // Popup type
           		popupHeaderExitDOM.onclick = function(){
		   			modalPopup.hide();
		   	}
           if (popPrefs.exitFnc) {
		   	popupHeaderExitDOM.onclick = function(){
		   		modalPopup.hide();
		   		popPrefs.exitFnc;
		   	}
		   }
		   Util.addEvent(popupHeaderTextDOM, "mousedown", function(e){
					dragStart(e, popupDOM)
				});
			}
            Util.ac(popupDOM, document.body);
        }
        if (popupType == true) { // Popup type
			popupHeaderTextDOM.innerHTML = (popPrefs.header) ? popPrefs.header : "&nbsp;";
			popupHeaderExitDOM.innerHTML = (popPrefs.exit) ? popPrefs.exit : "x";
		}
        if (popPrefs.defaultpos) {
            if (popPrefs.defaultpos[0]) {
                popupDOM.style.top = popPrefs.defaultpos[0]
            }
            if (popPrefs.defaultpos[1]) {
                popupDOM.style.left = popPrefs.defaultpos[1]
            }
        }
        if (popPrefs.width) {
            popupDOM.style.width = popPrefs.width
        }
		var popchildNodes = Util.gcs(popupContentDOM),popchildNodeslen = popchildNodes.length,idx = 0 ;
			if(popupContentDOM.innerHTML > ""){
				for (idx = 0; idx < popchildNodeslen; idx++) {
					Util.de(popchildNodes[idx])
				}
				popupContentDOM.innerHTML = " ";
		}
		if (popPrefs.content) {
			popupContentDOM.innerHTML = popPrefs.content;
		}
		if (popPrefs.contentDOM) {
			
			Util.ac(popPrefs.contentDOM,popupContentDOM);
		}
        modalPopup.display();
    }
	function draggableHandler(e){
		try {
			var pos, childNodes, index, childNodesLength, childCloneNode, targ, dragNode;
			if (e.target) 
				targ = e.target;
			else 
				if (e.srcElement) 
					targ = e.srcElement;
			if (targ.nodeType == 3) {// defeat Safari bug
				targ = targ.parentNode;
			}
			while (targ.className.indexOf("draggable-element") == -1 && targ != null) {
				targ = Util.gp(targ)
			}
			if (targ != null) {
				dragNode = targ;
				// draggable without clone node
				if (dragNode.className.indexOf("draggable-clone") == -1) {
					dragHolderNode = Util.ce("div")
					dragHolderNode.style.width = "100.00%";
					dragHolderNode.style.height = "auto";
					dragHolderNode.style.border = "1px dashed #000000";
					dragHolderNode.className = dragNode.className;
					Util.ia(dragHolderNode, dragNode);
				}
				else {
					currentDragCloneNode = Util.ce(dragNode.tagName);
					currentDragCloneNode.style.cssText = dragNode.style.cssText;
					currentDragCloneNode.className = dragNode.className;
					childNodes = Util.gcs(dragNode);
					index = 0;
					childNodesLength = childNodes.length;
					while (index < childNodesLength) {
						childCloneNode = childNodes[index].cloneNode(true);
						/*
				 * if this is MSIE 6/7, then we need to copy the innerHTML to
				 * fix a bug related to some form field elements
				 */
						if (!!document.all && childCloneNode.tagName.toUpperCase() != "TABLE") 
							childCloneNode.innerHTML = childNodes[index].innerHTML;
						
						Util.ac(childCloneNode, currentDragCloneNode);
						index += 1;
					}
					Util.addEvent(currentDragCloneNode, "mousedown", draggableHandlerFunction);
					Util.ia(currentDragCloneNode, dragNode);
				}
				dragNode.style.width = dragNode.offsetWidth + "px";
				dragNode.style.height = dragNode.offsetHeight + "px";
				dragNode.style.zIndex = 99999;
				dragNode.style.position = "absolute";
				dragNode.style.display = "block";
				dragNode.className = dragNode.className;
				pos = UtilPopup_mpo(e);
				// not draggable inside parent => add to body
				if (dragNode.className.indexOf("draggable-inside-parent") == -1) {
					dragNode = Util.ac(dragNode, document.body);
					
				}
				dragNode.style.top = (pos[0] - (dragNode.offsetHeight / 2)) + "px";
				dragNode.style.left = (pos[1] - (dragNode.offsetWidth / 2)) + "px";
				currentDragNode = dragNode;
				dragStart(e, dragNode);
			//	Util.preventDefault(e);
			}
			
		} 
		catch (err) {
			errorHandler(err, "draggableHandler");
		}
	}
	function draggableHandlerFunction(e){
		if (!e) {
			var e = window.event;
		}	
		var eventCopy = {};
		for (var i in e) {
		    eventCopy[i] = e[i];    
		}		
		dragTimeOut = setTimeout(function(){
			draggableHandler(eventCopy);
		},500);		
	}
	
	function checkDropContainers(mousepos){
		var droppableContainers = Util.Style.g("droppable-container")
				,droppableLength = droppableContainers.length
				,index
				,dims;
				index = 0;
				while(index < droppableLength){	
					dims = Util.Pos.gop(droppableContainers[index]);
					dims[2] = dims[0]+droppableContainers[index].offsetHeight;
					dims[3] = dims[1]+droppableContainers[index].offsetWidth;
					if(mousepos[0]  >= dims[0] &&  mousepos[0]  <= dims[2] 
						&& mousepos[1]  >= dims[1] &&  mousepos[1]  <= dims[3]){
						break;
					}else{
						index += 1;
					}
				}
				if (index < droppableLength) {
					dropContainer = droppableContainers[index];
					if (!e) 
						var e = window.event;
					if (currentDragNode != null) {
						if (dragHolderNode != null) {
							Util.de(dragHolderNode);
						}
						dragHolderNode = Util.ce("div")
						dragHolderNode.style.width = currentDragNode.offsetWidth + "px";
						dragHolderNode.style.height = currentDragNode.offsetHeight + "px";
						dragHolderNode.style.top = "0px";
						dragHolderNode.style.left = "0px";
						dragHolderNode.style.border = "1px dashed #000000";
						Util.ac(dragHolderNode, dropContainer);
					}
				}
	}
	// return API
    return {
		getDragTimeOut: function(){
			return(dragTimeOut);
		},
        attachHover: function(hvrPrefs){
			try {
				var objDOM = hvrPrefs.elementDOM, hoverAlign = hvrPrefs.align, objDOMPos = Util.Pos.gop(objDOM), objDOMScrollOffsets = hvrPrefs.scrolloffsets, offsets = hvrPrefs.offsets, position = hvrPrefs.position, dimensions = hvrPrefs.dimensions, showHoverFnc, hvrOutFnc = hvrPrefs.hvrOutFnc, hvrTxt = hvrPrefs.content, hvrTxtDOM = hvrPrefs.contentDOM, hvrRef = hvrPrefs.contentRef, stickyTimeOut = hvrPrefs.stickyTimeOut, displayHvr = hvrPrefs.displayHvr, stickyOut;
				if (objDOMScrollOffsets && objDOMScrollOffsets.length === 2) {
					objDOMPos[0] = objDOMPos[0] - objDOMScrollOffsets[0];
					objDOMPos[1] = objDOMPos[1] - objDOMScrollOffsets[1];
				}


				hideHoverFnc = function(e){
					// clear any display timeout
					clearTimeout(displayTimeOut);
					hoverPopupDOM.style.visibility = "hidden";
					hoverPopupDOM.style.display = "none";
					if (hvrRef) {
						hvrRef.innerHTML = hoverPopupDOM.innerHTML;
					}
					if (hvrOutFnc) {
						hvrOutFnc();
					}
					Util.cancelBubble(e);
				}
				if (hvrTxt > "" || hvrRef || hvrTxtDOM) {
                    showHoverFnc = function(e,mousePosition){
                    	
                        if (!e) {
                            e = window.event;
                        }
                        var curMousePosition, curWindowDim = Util.Pos.gvs(), curMaxHeight, curMaxWidth;
                        if(!mousePosition || mousePosition == [] || mousePosition.length == 0){
                        	curMousePosition = UtilPopup_mpo(e);
                        }
                        else{
                        	curMousePosition = mousePosition;
                        }
                        
                        if (hoverPopupDOM.parentNode == null) {
                            hoverPopupDOM = Util.ac(hoverPopupDOM, document.body);
                        }
                        hoverPopupDOM.style.display = "block";
                        //	if(hvrTxtDOM){
                        //		Util.de(hvrTxtDOM,hoverPopupDOM);
                        //	}
                        if (hoverPopupDOM.innerHTML > "") {
                            Util.de(Util.gcs(hoverPopupDOM)[0])
                        }
                        
                        x = curMousePosition[1];
                        y = curMousePosition[0];
                        hoverPopupDOM.style.width = "auto";
                        hoverPopupDOM.style.height = "auto";
                        if (hvrRef) {
                            hoverPopupDOM.innerHTML = hvrRef.innerHTML;
                        }
                        else 
                            if (hvrTxt) {
                                hoverPopupDOM.innerHTML = hvrTxt;
                            }
                            else {
                                hoverPopupDOM.innerHTML = "";
                                hvrTxtDOM = Util.ac(hvrTxtDOM, hoverPopupDOM);
                            }
                        if (dimensions) {
                            hoverPopupDOM.style.width = dimensions[1] ? (dimensions[1] + "px") : "auto";
                            hoverPopupDOM.style.height = dimensions[0] ? (dimensions[0] + "px") : "auto";
                        }
                        if (hoverPopupDOM.offsetHeight > curWindowDim[0] - 50) { // longer than screen height
                            curMaxHeight = (y - hoverPopupDOM.offsetHeight > y) ? y - hoverPopupDOM.offsetHeight : y;
                            hoverPopupDOM.style.height = (curMaxHeight - 10) + "px";
                        }
                        if (hoverPopupDOM.offsetWidth > curWindowDim[1] - 50) { // wider than screen width
                            curMaxWidth = (x - hoverPopupDOM.offsetWidth > x) ? x - hoverPopupDOM.offsetWidth : x;
                            hoverPopupDOM.style.width = (curMaxWidth - 10) + "px";
                        }
                        if (!offsets) {
                            offsets = [0, 0]
                        }
                        if (position && position.length == 2) {
                            x += position[1];
                            y += position[0];
                        }
                        else {
                            if (y < hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // top-right edges of screen
                            {
                                y += 5 + offsets[0];
                                x = (x - hoverPopupDOM.offsetWidth - 5 - offsets[1]);
                            }
                            else 
                                if (y > hoverPopupDOM.offsetHeight && x < hoverPopupDOM.offsetWidth) // bottom-left edges of screen
                                {
                                    y = (y - hoverPopupDOM.offsetHeight - 5 - offsets[0]);
                                    x += 5 + offsets[1];
                                }
                                else 
                                    if (y > hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // bottom-right edges of screen
                                    {
                                        y = (y - hoverPopupDOM.offsetHeight - 5 - offsets[0]);
                                        x = (x - hoverPopupDOM.offsetWidth - 5 - offsets[1]);
                                    }
                                    else { // top-left edges of screen
                                        y += 5 + offsets[0];
                                        x += 5 + offsets[1];
                                    }
                        }
                        if (hoverAlign) {
                            switch (hoverAlign) {
                                case "up-horizontal":
                                    x = (objDOMPos[1]) ;
                                    if (hoverPopupDOM.offsetHeight > objDOMPos[0]) {
                                        y = 0;
                                        hoverPopupDOM.style.height = (objDOMPos[0] - 5);
                                    }
                                    else {
                                        y = (objDOMPos[0] - hoverPopupDOM.offsetHeight);
                                    }
                                    break;
                                case "down-horizontal":
                                    x = (objDOMPos[1]);
                                    if (hoverPopupDOM.offsetHeight > objDOMPos[0]) {
                                        y = 0;
                                        
                                    }
                                    else {
                                        y = (objDOMPos[0] - hoverPopupDOM.offsetHeight);
                                    }
                                    break;
                                    
                            }
                        }
                        hoverPopupDOM.style.top = (y) + "px";
                        hoverPopupDOM.style.left = (x) + "px"
                        hoverPopupDOM.style.visibility = "visible";
                    };
					if (displayHvr === undefined) {
						if(hvrPrefs.displayTimeOut > " ") {
							hvrPrefs.displayTimeOut = parseInt(hvrPrefs.displayTimeOut,10)
						} 
					
						else {
							hvrPrefs.displayTimeOut = 0
						}
						// No display timeout => regular event
						if(hvrPrefs.displayTimeOut == 0) {
							Util.addEvent(objDOM, hvrPrefs.event,function(showHoverEvent) {
								showHoverFnc(showHoverEvent,[]);
							});
						} 
						// Display timeout
						else {
						Util.addEvent(objDOM, hvrPrefs.event, function(showHoverEvent) {
							if (!showHoverEvent) {
								showHoverEvent = window.event;
							}
							var mousePosition = UtilPopup_mpo(showHoverEvent);
							// clear any display timeout
							clearTimeout(displayTimeOut);
							displayTimeOut = setTimeout( function() {
								showHoverFnc(showHoverEvent,mousePosition);
							},hvrPrefs.displayTimeOut);
						});
						}
					} 
					else {
						showHoverFnc(displayHvr,[]);
					}
					
					//Sticky Hover
					if (hvrPrefs.sticky && (hvrPrefs.sticky == 1 || hvrPrefs.sticky == true)) {
						if (!displayHvr) {
								stickyOut = "mouseout";
								stickyTimeOut = (stickyTimeOut && parseInt(stickyTimeOut) > 0) ? stickyTimeOut : 200;
								Util.addEvent(objDOM, "mouseout", function(e){
									hideTimeOut = setTimeout(hideHoverFnc, stickyTimeOut);
									Util.cancelBubble(e);
								});
							
							}
							Util.addEvent(hoverPopupDOM, "mouseenter", function(e){
								clearTimeout(hideTimeOut);
								Util.addEvent(hoverPopupDOM, "mouseleave", hideHoverFnc);
								Util.cancelBubble(e);
							});
						
					}
					//Plain Old Hover
					else {
						Util.addEvent(objDOM, "mouseout", hideHoverFnc);
					}
				}
				
			} 
			catch (err) {
				errorHandler(err, "attachHover");
			}
		},
        attachModalPopup: function(popPrefs){
            var that = this;
            Util.addEvent(popPrefs.elementDOM, popPrefs.event, function(){
                displayModalPopup(popPrefs,true);
            });
        },
		hideHover : function(e){
					// clear any display timeout
					clearTimeout(displayTimeOut);
					// clear any hide timeout
					clearTimeout(hideTimeOut);
					hoverPopupDOM.style.visibility = "hidden";
					hoverPopupDOM.style.display = "none";
					if (e != null && e != undefined) {
						Util.cancelBubble(e);
					}
				},
		launchModalPopup : function(popPrefs){
			displayModalPopup(popPrefs,true);
		},
		launchModalDialog : function(popPrefs){
			displayModalPopup(popPrefs,false);
		},
		closeModalDialog : function(){
			if(modalPopup != null){
				modalPopup.hide();
				popupDOM = null;
			}
		},
		closeModalPopup: function(){
			if(modalPopup != null){
				modalPopup.hide();
			}
        },
		initializeDragDrop: function(parentNode){
			if(!parentNode){
				parentNode = document.body;
			}
			var draggableElements = Util.Style.g("draggable-element",parentNode)
				,draggableLength = draggableElements.length
				,index;
				index = 0;
				document.onmousemove = function(e){};
				document.onmouseup = function(e){};
				while(index < draggableLength){	
					Util.addEvent(draggableElements[index], "mousedown", draggableHandlerFunction);
				/*	Util.addEvent(draggableElements[index], "mouseup", function(){
						if (dragTimeOut && dragTimeOut != null) {
							clearTimeout(dragTimeOut);
						}
					});*/
					index += 1;
				}
				
				
		}
    }
}());

function tabelmObj(argsObj) {
    var arg;
    this.div = null;
    this.classMain = "tabelm";
	this.classMainLive = "tabelmlive";
	this.classTab = "tabelmtab";
	this.classTabDefault = "tabelmtabdefault";
	this.classNav = "tabelmnav";
	this.classTabHide = "tabelmtabhide";
	this.classNavActive = "tabelmactive";
	this.titleElements = ['h2', 'h3', 'h4', 'h5', 'h6'];
	this.titleElementsStripHTML = true;
	this.removeTitle = true;
	this.addLinkId = false;
	this.linkIdFormat = '<tabelmid>nav<tabnumberone>';
	for (arg in argsObj) {
	    this[arg] = argsObj[arg];
	}
	this.REclassMain = new RegExp('\\b' + this.classMain + '\\b', 'gi');
	this.REclassMainLive = new RegExp('\\b' + this.classMainLive + '\\b', 'gi');
	this.REclassTab = new RegExp('\\b' + this.classTab + '\\b', 'gi');
	this.REclassTabDefault = new RegExp('\\b' + this.classTabDefault + '\\b', 'gi');
	this.REclassTabHide = new RegExp('\\b' + this.classTabHide + '\\b', 'gi');
    this.tabs = new Array();
    if (this.div) {
        this.init(this.div);
        this.div = null;
    }
}

tabelmObj.prototype.init = function (e) {
    var childNodes, i, i2, t, defaultTab = 0, DOM_ul, DOM_li, DOM_a, aId, headingElement;
    if (!document.getElementsByTagName) {
        return false;
    }
    if (e.id) {
        this.id = e.id;
    }
    this.tabs.length = 0;
    childNodes = e.childNodes;
    for (i = 0; i < childNodes.length; i++) {
        if (childNodes[i].className && childNodes[i].className.match(this.REclassTab)) {
            t = new Object();
            t.div = childNodes[i];
            this.tabs[this.tabs.length] = t;
            if (childNodes[i].className.match(this.REclassTabDefault)) {
                defaultTab = this.tabs.length - 1;
            }
        }
    }
    DOM_ul = document.createElement("ul");
    DOM_ul.className = this.classNav;
    for (i = 0; i < this.tabs.length; i++) {
	    t = this.tabs[i];
	    t.headingText = t.div.title;
	    if (this.removeTitle) {
	        t.div.title = '';
	    }
	    if (!t.headingText) {
	        for (i2 = 0; i2 < this.titleElements.length; i2++) {
	            headingElement = t.div.getElementsByTagName(this.titleElements[i2])[0];
	            if (headingElement) {
	                t.headingText = headingElement.innerHTML;
	                if (this.titleElementsStripHTML) {
	                    t.headingText.replace(/<br>/gi, " ");
	                    t.headingText = t.headingText.replace(/<[^>]+>/g, "");
	                }
	                break;
	            }
	        }
	    }
	    if (!t.headingText) {
	        t.headingText = " ";
	    }
	    DOM_li = document.createElement("li");
	    t.li = DOM_li;
	    DOM_a = document.createElement("a");
	    DOM_a.id = "tab-" + t.div.getElementsByTagName(this.titleElements[0])[0].value;
	    DOM_a.innerHTML = t.headingText;
	    DOM_a.className = "tab-link";
	 
	    if (headingElement && headingElement.className > " ") {
			DOM_a.className += " "+headingElement.className;
		}
	    // DOM_a.href = "#";
	    DOM_a.title = t.headingText.split("&lt;").join("<").split("&gt;").join(">");
	    //  DOM_a.onclick = this.navClick;
	    DOM_a.tabelm = this;
	    DOM_a.tabelmIndex = i;
	    if (this.addLinkId && this.linkIdFormat) {
	        aId = this.linkIdFormat;
	        aId = aId.replace(/<tabelmid>/gi, this.id);
	        aId = aId.replace(/<tabnumberzero>/gi, i);
	        aId = aId.replace(/<tabnumberone>/gi, i + 1);
	        aId = aId.replace(/<tabtitle>/gi, t.headingText.replace(/[^a-zA-Z0-9\-]/gi, ''));
	        DOM_a.id = aId;
	    }
	    DOM_li.appendChild(DOM_a);
	    DOM_ul.appendChild(DOM_li);
	    this.tabs[i].tab = DOM_a;
	    this.tabs[i].tabelmIndex = i;
	}
	e.insertBefore(DOM_ul, e.firstChild);
	e.className = e.className.replace(this.REclassMain, this.classMainLive);
	
	if (typeof this.onLoad == 'function') {
        this.onLoad({
            tabelm: this
        });
    }
    return this;
};
tabelmObj.prototype.navClick = function (event) {
    var rVal, a, self, tabelmIndex, onClickArgs;
    a = this;
    if (!a.tabelm) {
        return false;
    }
    self = a.tabelm;
    tabelmIndex = a.tabelmIndex;
    a.blur();
    if (typeof self.onClick == 'function') {
    onClickArgs = {
        'tabelm': self,
        'index': tabelmIndex,
        'event': event
        };
        if (!event) {
            onClickArgs.event = window.event
        }
        rVal = self.onClick(onClickArgs);
        if (rVal === false) {
            return false;
        }
    }
    self.tabShow(tabelmIndex);
    return false;
};

tabelmObj.prototype.tabHideAll = function () {
    var i;
    for (i = 0; i < this.tabs.length; i++) {
        this.tabHide(i)
    }
};

tabelmObj.prototype.tabHide = function (tabelmIndex) {
    var div;
    if (!this.tabs[tabelmIndex]) {
        return false
    }
    div = this.tabs[tabelmIndex].div;
    if (!div.className.match(this.REclassTabHide)) {
        div.className += ' ' + this.classTabHide
    }
    this.navClearActive(tabelmIndex);
    return this;
};

tabelmObj.prototype.tabShow = function (tabelmIndex) {
    var div;
    if (!this.tabs[tabelmIndex]) {
        return false
    }
   // this.tabHideAll();
	div = this.tabs[tabelmIndex].div;
	div.className = div.className.replace(this.REclassTabHide, '');
	this.navSetActive(tabelmIndex);
	if (typeof this.onTabDisplay == 'function') {
		this.onTabDisplay({
	        'tabelm': this,
	        'index': tabelmIndex
        });
    }
    return this;
};

tabelmObj.prototype.navSetActive = function (tabelmIndex) {
    this.tabs[tabelmIndex].li.className = this.classNavActive;
    return this;
};

tabelmObj.prototype.navClearActive = function (tabelmIndex) {
    this.tabs[tabelmIndex].li.className = '';
    return this;
};

function tabelmAutomatic(tabelmArgs) {
    var tempObj, divs, i;
    if (!tabelmArgs) {
        tabelmArgs = {}
    }
	var temptabs;
    tempObj = new tabelmObj(tabelmArgs);
    divs = document.getElementsByTagName("div");
    for (i = 0; i < divs.length; i++) {
        if (divs[i].className && divs[i].className.match(tempObj.REclassMain)) {
            tabelmArgs.div = divs[i];
            divs[i].tabelm = new tabelmObj(tabelmArgs);
		 temptabs = divs[i].tabelm;
        }
    }
	return temptabs;
}/* Modified from Original to:
	- handle numeric pad decimal
	- handle numeric pad negative
*/
var InputFieldValidation = (function(){
	function getCaretPosition (ctrl) {
		var CaretPos = 0;	// IE Support
		if (document.selection) {
		ctrl.focus ();
			var Sel = document.selection.createRange ();
			Sel.moveStart ('character', -ctrl.value.length);
			CaretPos = Sel.text.length;
		}
		// Firefox support
		else if (ctrl.selectionStart || ctrl.selectionStart == '0')
			CaretPos = ctrl.selectionStart;
		return (CaretPos);
	}
	function validateInteger (e) 
	 { 
		 var isInteger = false,
				negativeSignIndex = -1,
				caretPosition = getCaretPosition(this),
				key = e.charCode || e.keyCode || 0;
				
		
		negativeSignIndex = $(this).attr("value").indexOf("-");
		
		  // allow backspace, tab, home, end, delete, arrows, first negative sign, ctrl+ (a, c, x, v),numbers and keypad numbers ONLY
		 return (
		 key === 8 || //backspace
		 key === 9 || //tab
		 key === 36 || //home
		 key === 35 || //end
		 key === 46 || //delete
		 (key >= 37 && key <= 40) || // arrows
		 ( key === 189 && negativeSignIndex === -1 && caretPosition === 0)|| // negative sign allowed only if it is first and position at beginning
		 (
			e.ctrlKey  // control +
					&& (
							key === 65 || // a
							key === 67 || // c
							key === 88 || //x
							key === 86  // v   
						)
		  )||
		  // Keypad number
		 (key >= 48 && key <= 57) ||
		 (key >= 96 && key <= 105));
	 }
	 
	 function validateIntegerPaste(e){
		var clipBoardText = getClipBoardText(),isInteger = false;
		if(clipBoardText > " "){	
			isInteger = /^[-+]?[0-9]+$/.test(clipBoardText);
		}
		if(!isInteger){
			clearClipBoardText();
		}
	 }
	 
	 function validateDecimal (e) 
	 { 
		 var isInteger = false,
				negativeSignIndex = -1,
				decimalIndex =  -1,
				caretPosition = getCaretPosition(this),
				key = e.charCode || e.keyCode || 0;
				
		
		negativeSignIndex = $(this).attr("value").indexOf("-");
		decimalIndex = $(this).attr("value").indexOf(".");
		
		  // allow backspace, tab, home, end, delete, arrows, first negative sign, single decmial point and ctrl+ (a, c, x, v),numbers and keypad numbers ONLY
		 return (
		 key === 8 || //backspace
		 key === 9 || //tab
		 key === 36 || //home
		 key === 35 || //end
		 key === 46 || //delete
		 (key >= 37 && key <= 40) || // arrows
		 ((key === 189 || key == 109) && negativeSignIndex === -1 && caretPosition === 0)|| // negative sign allowed only if it is first and position at beginning
		 ((key === 190 || key == 110) && decimalIndex === -1 )|| // single decmial sign allowed only 
		 (
			e.ctrlKey  // control +
					&& (
							key === 65 || // a
							key === 67 || // c
							key === 88 || //x
							key === 86  // v   
						)
		  )||
		  // Keypad number
		 (key >= 48 && key <= 57) ||
		 (key >= 96 && key <= 105));
	 }
	  function validateDecimalPaste(e){
		var clipBoardText = getClipBoardText(),isInteger = false;
		if(clipBoardText > " "){	
			isInteger = /^[-+]?[0-9]+\.[0-9]+$/.test(clipBoardText);
		}
		if(!isInteger){
			clearClipBoardText();
		}
	 }
	  
	  function getClipBoardText(){
		var clipBoardText = "";
			if(window.clipboardData){
					clipBoardText = window.clipboardData.getData('Text');
			}	
		return(clipBoardText);  
	  }
	  
	  function clearClipBoardText(){
		if(window.clipboardData){
			window.clipboardData.clearData("Text")
		}	
	  }
	  
	  return({
		"integer": function(inputElement){	
			$(inputElement).keydown(validateInteger);
			$(inputElement).bind('paste',validateIntegerPaste);
		},
		"decimal": function(inputElement){	
			$(inputElement).keydown(validateDecimal);
			$(inputElement).bind('paste',validateDecimalPaste); 
		}
	  });
  
  })();var OrderDetailsEdit = (function() {
	var self = this;
	
	// Begin Public Methods
	function getElement() {
		return (this.editDetailsElement);
	}

	function setAttribute(attribute, value) {
		this.attributes[attribute] = value;
		// add attribute to each order entry detail
		var orderEntryDetails = this.getOrderEntryDetails();
		_.each(orderEntryDetails, function(orderEntryDetail){
			orderEntryDetail.setParentAttribute(attribute,value);
		});
	}
	

	function setAttributes(attributes) {
		this.attributes = attributes;
		// add attribute to each order entry detail
		var orderEntryDetails = this.getOrderEntryDetails();
		_.each(orderEntryDetails, function(orderEntryDetail){
			orderEntryDetail.setParentAttributes(attributes);
		});
	}

	function getAttribute(attribute) {
		return (this.attributes[attribute]);
	}

	function getAttributes() {
		return (this.attributes);
	}

	function setOrderEntryDetails(orderEntryDetails) {
		this.orderEntryDetails = orderEntryDetails;
	}
	
	
	function getOrderEntryDetails() {
		return (this.orderEntryDetails);
	}

	function getOrderEntryDetail(attribute, value) {
		var orderEntryDetail = null;
		var orderEntryDetails = this.getOrderEntryDetails();
		if(attribute > " ") {
			orderEntryDetail = _.find(orderEntryDetails, function(oeDetail) {
				return (oeDetail.getAttribute(attribute) === value);
			})
		}
		return (orderEntryDetail);
	}

	function triggerSentenceFocusIn() {
		$(this.editDetailsElement).trigger("focus-in");
	}

	function triggerSentenceFocusOut() {
		$(this.editDetailsElement).trigger("focus-out");
	}

	function listenFocusIn(callBack, eventData) {
		if(_.isUndefined(eventData)) {
			eventData = null;
		}
		$(this.editDetailsElement).bind("focus-in", eventData, callBack);
	}

	function listenFocusOut(callBack, eventData) {
		if(_.isUndefined(eventData)) {
			eventData = null;
		}
		$(this.editDetailsElement).bind("focus-out", eventData, callBack);
	}

	// Method to build a detail Line
	var buildLine = function(oeDetails,currentSequence) {
		var orderEntryDetails = this.getOrderEntryDetails();
		var self = this;
		
		this.editDetailsElement = $("<span></span>");
		var editDetailsElement = this.editDetailsElement;

		var listenFocusIn = function(callBack, eventData) {
			if(_.isUndefined(eventData)) {
				eventData = null;
			}
			$(editDetailsElement).bind("focus-in", eventData, callBack);
		}
		var listenFocusOut = function(callBack, eventData) {
			if(_.isUndefined(eventData)) {
				eventData = null;
			}
			$(editDetailsElement).bind("focus-out", eventData, callBack);
		}
		/* ACCEPT_FLAG
		0.00	REQUIRED
		1.00	OPTIONAL
		2.00	NO DISPLAY
		3.00	DISPLAY ONLY
		*/

		// Sort Order Entry Details by Group_seq and Field_seq
		oeDetails.sort(sortOeDetails)

		var prnOeFields = _.filter(oeDetails, function(oeDetail, index) {
			var isPRN = false, isPRNReason = false, oeFieldMeaning = oeDetail["OE_FIELD_MEANING"];
			isPRN = (oeFieldMeaning === "SCH/PRN");
			isPRNReason = (oeFieldMeaning === "PRNREASON" || oeFieldMeaning == "PRNINSTRUCTIONS");
			return (isPRN || isPRNReason)
		});
		// If only a single prn field is found, remove it from details since it doesn't qualify'
		if(prnOeFields.length == 1) {
			oeDetails = _.difference(oeDetails, prnOeFields);
		}

		//Create list of Order Entry Details and Build HTML element for details
		_.each(oeDetails, function(oeDetail, index) {

			oeDetail["SENTENCE_SEQ"] = currentSequence + 1;
			oeDetail["DETAIL_SEQ"] = index + 1;

			var orderEntryDetail = new OrderEntryDetail(oeDetail), delimiter = "", previousOrderEntryDetail, previousOeFieldMeaning, currentOeFieldMeaning, orderEntryDetailElement;
			// set the detail parent attributes 
			orderEntryDetail.setParentAttributes(self.getAttributes());
			orderEntryDetails[orderEntryDetails.length] = orderEntryDetail;
			currentOeFieldMeaning = orderEntryDetail.getAttribute("OE_FIELD_MEANING");
			// append commas before details
			if(index > 0) {
				previousOrderEntryDetail = orderEntryDetails[orderEntryDetails.length - 2];
				previousOeFieldMeaning = previousOrderEntryDetail.getAttribute("OE_FIELD_MEANING");

				// no comma between strength and strength unit
				if(previousOeFieldMeaning == "STRENGTHDOSE" && currentOeFieldMeaning == "STRENGTHDOSEUNIT") {
					delimiter = "&nbsp;";
				}
				// no comma between volume and volume unit
				else if(previousOeFieldMeaning == "VOLUMEDOSE" && currentOeFieldMeaning == "VOLUMEDOSEUNIT") {
					delimiter = "&nbsp;";
				}
				// no comma between dispense quantity and dispense quantity unit
				else if(previousOeFieldMeaning == "DISPENSEQTY" && currentOeFieldMeaning == "DISPENSEQTYUNIT") {
					delimiter = "&nbsp;";
				}
				// no comma between duration and duration unit
				else if(previousOeFieldMeaning == "DURATION" && currentOeFieldMeaning == "DURATIONUNIT") {
					delimiter = "&nbsp;";
				}
				// include comma otherwise
				else {
					delimiter = ",&nbsp;";
				}
				editDetailsElement.append("<span>" + delimiter + "</span>");
			}
			orderEntryDetailElement = orderEntryDetail.getElement();

			orderEntryDetail.listenFocusIn(this.triggerSentenceFocusIn);

			orderEntryDetail.listenFocusOut(this.triggerSentenceFocusOut);

			// Handle PRN and PRN Reason
			if(currentOeFieldMeaning == "SCH/PRN") {
				$(orderEntryDetailElement).bind("change-value", handlePRNChange);
			} 
			else if(currentOeFieldMeaning == "PRNREASON" || currentOeFieldMeaning == "PRNINSTRUCTIONS" ) {
				$(orderEntryDetailElement).bind("change-value", handlePRNReasonChange);
			}
			else if(currentOeFieldMeaning == "FREQ") {
				$(orderEntryDetailElement).bind("change-value", handleFrequencyChange);
			}

			// append detail element
			editDetailsElement.append(orderEntryDetailElement);

		});
		this.setOrderEntryDetails(orderEntryDetails);
	}
	// End Public methods
	
	// Handling PRN and PRN Reason
	function handlePRNChange(event, oeDetail) {
		var PRNReasonOeDetail, PRNValue = oeDetail.getAttribute("OE_FIELD_VALUE"), PRNReasonValue;
		
		PRNReasonOeDetail = self.getOrderEntryDetail("OE_FIELD_MEANING", "PRNREASON");
		// if prn reason not found => try to use prn instructions
		if(!PRNReasonOeDetail){
			PRNReasonOeDetail = self.getOrderEntryDetail("OE_FIELD_MEANING", "PRNINSTRUCTIONS");
		}
		if(PRNReasonOeDetail){
			PRNReasonValue = parseFloat(PRNReasonOeDetail.getAttribute("OE_FIELD_VALUE"))
			if(PRNValue > 0) {
				if(PRNReasonValue === 0) {// set to required only if the PRN reason is empty
					PRNReasonOeDetail.setRequired(true);
				}
			} else {
				PRNReasonOeDetail.setAttribute("OE_FIELD_VALUE", 0);
				PRNReasonOeDetail.updateDisplay({
					"silent" : true
				});
				PRNReasonOeDetail.setRequired(false);
			}
		}
	}

	function handlePRNReasonChange(event, oeDetail) {
		var PRNOeDetail, PRNReasonValue = oeDetail.getAttribute("OE_FIELD_VALUE");
		PRNOeDetail = self.getOrderEntryDetail("OE_FIELD_MEANING", "SCH/PRN");
		if(PRNOeDetail){
			if(PRNReasonValue > 0) {
				PRNOeDetail.setAttribute("OE_FIELD_VALUE", 1);
			} else {
				PRNOeDetail.setAttribute("OE_FIELD_VALUE", 0);
			}
			PRNOeDetail.updateDisplay({
				"silent" : true
			});
		}
	}
	
	function handleFrequencyChange(event,orderEntryDetail){	
		var PRNOeDetail = self.getOrderEntryDetail("OE_FIELD_MEANING", "SCH/PRN");	
		// If PRN field is present
		if(PRNOeDetail){
			var nurseUnitCd = orderEntryDetail.getParentAttribute("NURSE_UNIT_CD") || 0;
			var orderId = orderEntryDetail.getParentAttribute("ORDER_ID") || 0;	
			var catalogCd = 0;
			var activityTypeCd = 0;	
			var oeFieldCache = OrderEntryFields.getCachedOeFieldData(orderEntryDetail);
			if(oeFieldCache){
				var oeCatalogData = oeFieldCache.ORDER_CATALOG_DATA;
				if(oeCatalogData){
					catalogCd = oeCatalogData.CATALOG_CD;
					activityTypeCd = oeCatalogData.ACTIVITY_TYPE_CD;
				}
			}
			
			var parameters  = "^MINE^,"
							+'^{ "FREQUENCY_REQUEST":'
							+'{"FREQUENCY_CD": '+parseFloat(orderEntryDetail.getAttribute("OE_FIELD_VALUE")).toFixed(2)
							+', "ORDER_ID" : '+parseFloat(orderId).toFixed(2)
							+', "ORDER_PROVIDER_ID" : 0.00'
							+', "CATALOG_CD" : '+parseFloat(catalogCd).toFixed(2)
							+', "MED_CLASS_CD" : 0.00'
							+', "NURSE_UNIT_CD" : '+parseFloat(nurseUnitCd).toFixed(2)
							+', "ACTIVITY_TYPE_CD" : '+parseFloat(activityTypeCd).toFixed(2)
							+', "EXCLUDE_INACTIVE_SCHED_IND" : 1'
							+"}}^";
		
			AjaxHandler.ajax_request({
				"request":{
					"type":"XMLCCLREQUEST",
					"target":"INN_RX_GET_FREQ_ID",
					"parameters":parameters
				},
				"response":{
					"type":"JSON",
					"target": function(responseJSON){
						var frequencyDetails = responseJSON.response.RECORD_DATA;
						//if prn is default => set the prn field to Yes
						if(frequencyDetails.PRN_DEFAULT_IND  == 1){
							PRNOeDetail.setAttribute("OE_FIELD_VALUE", 1);
							PRNOeDetail.updateDisplay();
						}
					}
				}
			});
		}
	}

	function sortOeDetails(oeDetail_1, oeDetail_2) {
		var group_seq_1 = parseInt(oeDetail_1.GROUP_SEQ, 10);
		var group_seq_2 = parseInt(oeDetail_2.GROUP_SEQ, 10);
		var field_seq_1 = parseInt(oeDetail_1.FIELD_SEQ, 10);
		var field_seq_2 = parseInt(oeDetail_2.FIELD_SEQ, 10);

		if(group_seq_1 > group_seq_2) {
			return (1);
		} else if(group_seq_1 < group_seq_2) {
			return (-1)
		} else {
			if(field_seq_1 > field_seq_2) {
				return (1);
			} else if(field_seq_1 < field_seq_2) {
				return (-1);
			} else {
				return (0);
			}
		}
	}

	// Attach all inheritable methods to the prototype
	_.extend(OrderDetailsEdit.prototype, {
		"editDetailsElement": null,
		"getElement" : getElement,
		"setAttribute" : setAttribute,
		"setAttributes":setAttributes,
		"setOrderEntryDetails":setOrderEntryDetails,
		"getAttribute" : getAttribute,
		"getAttributes" : getAttributes,
		"getOrderEntryDetails" : getOrderEntryDetails,
		"getOrderEntryDetail" : getOrderEntryDetail,
		"triggerSentenceFocusIn" : triggerSentenceFocusIn,
		"triggerSentenceFocusOut" : triggerSentenceFocusOut,
		"listenFocusIn" : listenFocusIn,
		"listenFocusOut" : listenFocusOut,
		"buildLine" : buildLine
	})

	// Initialize edit control
	this.initialize.apply(this,arguments)
});

OrderDetailsEdit.extend = _.extendHelper;
// Requires Jquery, Underscore
var OrderEntryDetail = function(defaultAttributes, callBack) {
	var attributes = {}, self = this, orderEntryElement,REQUIRED_DETAIL_FLAG = 0
	, parentAttributes = {}
	, changedDetail = false;
	
	this.hasChanged = function(){
		return (changedDetail);	
	}
	
	this.getAttributes = function() {
		return (attributes)
	}
	this.setAttributes = function(newAttributes) {
		_.extend(attributes, newAttributes);
	}
	this.getAttribute = function(attribute) {
		return (attributes[attribute]);
	}
	this.setAttribute = function(attribute, value) {
		if(( typeof value).toUpperCase() === "OBJECT") {
			value = _.clone(value)
		}
		attributes[attribute] = value;
	}
	this.getParentAttributes = function() {
		return (parentAttributes)
	}
	this.setParentAttributes = function(newAttributes) {
		_.extend(parentAttributes, newAttributes);
	}
	this.getParentAttribute = function(attribute) {
		return (parentAttributes[attribute]);
	}
	this.setParentAttribute = function(attribute, value) {
		if(( typeof value).toUpperCase() === "OBJECT") {
			value = _.clone(value)
		}
		parentAttributes[attribute] = value;
	}
	this.getElement = function() {
		return (orderEntryElement);
	}
	this.setDisplay = function() {
		var field_display_value,field_value,field_type_flag;
		field_display_value = attributes["OE_FIELD_DISPLAY_VALUE"]
		field_value = parseFloat(attributes["OE_FIELD_VALUE"]);
		field_type_flag = parseInt(attributes["FIELD_TYPE_FLAG"], 10);
		if(field_type_flag == 7) {
			if(field_value === 1) {
				this.setAttribute("OE_FIELD_DISPLAY_VALUE", "Yes");				
			}
			else {
				if(field_display_value == "0"){
					this.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
				}
				else{
					// for other no
					 if(this.getAttribute("OE_FIELD_DISPLAY_VALUE") > " "){
						this.setAttribute("OE_FIELD_DISPLAY_VALUE", "No");
					}
				}
			}
		}
		else if(field_type_flag == 6) {		
			if(field_value === 0) {
				this.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
			}
		}
	}
	this.updateDisplay = function(options) {
		var displayValue;
		this.setDisplay();
		displayValue = this.getDisplayValue()
		$(".oe-detail-display", orderEntryElement).html(displayValue);
		if(_.isUndefined(options) || _.isNull(options) || options.silent == false) {
			$(orderEntryElement).trigger("change-value", [this]);
		} 
	}
	
	this.setRequired = function(isRequired){
		var oeElement = $(".oe-detail-display", orderEntryElement);
		if(isRequired){
			oeElement.addClass("oe-required-field");
		}
		else{
			oeElement.removeClass("oe-required-field");
		}
	}

	this.getDisplayValue = function() {
		var displayValue, field_display_value, field_value, field_type_flag,accept_flag;
		field_display_value = attributes["OE_FIELD_DISPLAY_VALUE"]
		field_value = parseFloat(attributes["OE_FIELD_VALUE"]);
		accept_flag = parseInt(attributes["ACCEPT_FLAG"]);
		field_type_flag = parseInt(attributes["FIELD_TYPE_FLAG"], 10);
		
		// Use display value if present, else use description
		if(field_display_value && field_display_value > " ") {
			// For Yes/No default to display name is description
			if(field_type_flag == 7) {
				displayValue = attributes["LABEL_TEXT"] + "&nbsp;[" + field_display_value + "]";
			 }
			 else {
				displayValue = field_display_value;
			 }
		} else {
			displayValue = "&lt;" + attributes["LABEL_TEXT"] + "&gt;";
		}
		
		// set required based on display value
		if(attributes["OE_FIELD_DISPLAY_VALUE"] === "" && accept_flag === REQUIRED_DETAIL_FLAG){			
			this.setRequired(true);
		}
		else{
			this.setRequired(false);
		}
		return (displayValue);
	}

	this.createElement = function() {
		var oeElement,  tabIndex = (parseInt(attributes["DETAIL_SEQ"], 10) + parseInt(attributes["SENTENCE_SEQ"], 10) * 100);
		var clinLineLabel = attributes["CLIN_LINE_LABEL"];
		// set the display HTML
		var displayHTML  = "<span class='oe-detail-display' tabIndex='" + tabIndex + "'></span>";
		// has a label
		if(parseInt(attributes["CLIN_LINE_IND"],10) == 1 && clinLineLabel > " "){
			// has a prefix label
			if(parseInt(attributes["CLIN_SUFFIX_IND"],10) == 0){
				displayHTML = "<span class='oe-detail-label-prefix'>"+clinLineLabel+"&nbsp;</span>" + displayHTML;
			}			
			// has a suffix label
			else{
				displayHTML = displayHTML + "<span class='oe-detail-label-suffix'>&nbsp;"+clinLineLabel+"</span>";
			}
		}
		oeElement = $("<span class='oe-detail'>"
						+ displayHTML
					 +"</span>");
		return (oeElement);
	}
	
	this.triggerFocusOut = function(){
		$(orderEntryElement).trigger("focus-out");
	}
	
	this.triggerFocusIn = function(){
		$(orderEntryElement).trigger("focus-in");
	}
	
	this.listenFocusOut = function(callBack){
		$(orderEntryElement).bind("focus-out",callBack);
	}
	
	this.listenFocusIn = function(callBack){
		$(orderEntryElement).bind("focus-in",callBack);
	}
	
	this.encodeAttributeValue = 	function(attribute) {
		var encodedValue = this.getAttribute(attribute);
		encodedValue = encodedValue.replace("&", "&amp;");
		encodedValue = encodedValue.replace("<", "&lt;");
		encodedValue = encodedValue.replace(">", "&gt;");
		encodedValue = encodedValue.replace("\'", "&quot;");
		encodedValue = encodedValue.replace("\"", "&apos;");
		encodedValue = encodedValue.replace("/", ".");
		encodedValue = encodedValue.replace(" ", "-");
		return (encodedValue)
	}

		
	//initialize function
	function initialize() {
		// Set any default attributes
		if(!defaultAttributes || defaultAttributes === null || defaultAttributes === {}) {
			defaultAttributes = {
				"GROUP_SEQ" : 0,
				"FIELD_SEQ" : 0,
				"ACCEPT_FLAG" : 0,
				"OE_FIELD_ID" : 0,
				"OE_FIELD_VALUE" : 0,
				"OE_FIELD_DISPLAY_VALUE" : "",
				"OE_FIELD_MEANING_ID" : 0,
				"OE_FIELD_MEANING" : "",
				"FIELD_TYPE_FLAG" : 0,
				"OE_FIELD_DESCRIPTION" : "",
				"CODESET" : 0,
				"LABEL_TEXT": ""
			}
		}
		self.setAttributes(defaultAttributes)

		//Create element and attach any call backs
		orderEntryElement = self.createElement();
		// Update display value		
		self.updateDisplay({"silent":true});
		
		if(!callBack || !_.isFunction(callBack)) {
			callBack = OrderEntryFields.displayEdit
		}

		$(".oe-detail-display", orderEntryElement).focus(function(event, eventData) {
			if(!eventData || (eventData && eventData.DO_NOT_DISPLAY != true)) {
				self.triggerFocusIn();
				callBack(event, self);				
			}
		});
		
		// set changed indicator to true if value changes
		$(orderEntryElement).bind("change-value",function(){
			changedDetail = true
		});
	}

	initialize();
}//Require orderEntryDetail
var OrderEntryFields = (new function(){
	var code_set_cache = {},self = this,order_entry_fields_cache = {},currentEditContainer = null;
	
	function buildOptionsEditShell(orderEntryDetail,options){		
			var EditShellHtml = []
			,valueDisplay
			,field_value = orderEntryDetail.getAttribute("OE_FIELD_VALUE")
			,field_description = orderEntryDetail.getAttribute("OE_FIELD_DESCRIPTION")
			,field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
			
			valueDisplay = field_display_value;
			
			
			EditShellHtml.push("<div class='oe-edit-popup'>")
			EditShellHtml.push("<table class='oe-edit-tbl'>");
			EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>",valueDisplay,"</span></td><td class='oe-edit-tab-crnr'></td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td><td class='oe-edit-row-tr'>&nbsp;</td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
			//<input type='text' class='oe-edit-value' value='",valueDisplay,"' />
			if(options != null && _.isArray(options)){
				EditShellHtml.push("<select  size='6' class='oe-edit-value'>");
				_.each(options,function(option){
					if(field_display_value.toUpperCase() === option.DISPLAY.toUpperCase()) {
						EditShellHtml.push("<option selected value='" + option.CODE + "'>", option.DISPLAY, "</option>");
					} else {
						EditShellHtml.push("<option value='"+option.CODE+"'>", option.DISPLAY, "</option>");
					}
				});
				EditShellHtml.push("</select>");
			}
			EditShellHtml.push("</td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b' colspan='2'>&nbsp; </td></tr>");
			EditShellHtml.push("</table>");
			EditShellHtml.push("</div>");
			return (EditShellHtml.join(""));
	}
	
	function buildFreeTextEditShell(orderEntryDetail,tagName) {
			var EditShellHtml = [],valueDisplay = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
			EditShellHtml.push("<div class='oe-edit-popup'>")
			EditShellHtml.push("<table class='oe-edit-tbl'>");
			EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>",valueDisplay,"</span></td><td class='oe-edit-tab-crnr'></td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td><td class='oe-edit-row-tr'>&nbsp;</td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
			if(tagName === "textarea"){
				EditShellHtml.push("<textarea type='text' class='oe-edit-value'>",valueDisplay,"</textarea>");
			}
			else {
				EditShellHtml.push("<input type='text' class='oe-edit-value' value='",valueDisplay,"' />");
			}
			EditShellHtml.push("</td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b' colspan='2'>&nbsp; </td></tr>");
			EditShellHtml.push("</table>");
			EditShellHtml.push("</div>");
			return (EditShellHtml.join(""));
		}

	function buildCodeSetEditShell(orderEntryDetail) {
			var EditShellHtml = []
			,valueDisplay = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE")
			,options = null
			,oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)]
			,oeField = oeFieldCache.OE_FIELD_DATA
			,cachedCodeSet = code_set_cache[getCodeSetCacheKey(oeFieldCache)];
			
			// Not an undefined codeSet
			if(cachedCodeSet){
					options = cachedCodeSet;
			}			
			
			EditShellHtml.push("<div class='oe-edit-popup'>")
			EditShellHtml.push("<table class='oe-edit-tbl'>");
			EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>",valueDisplay,"</span></td><td class='oe-edit-tab-crnr'></td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td><td class='oe-edit-row-tr'>&nbsp;</td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
			if(options != null && _.isArray(options)){
				EditShellHtml.push("<select  size='6' class='oe-edit-value'>");
				_.each(options, function(option) {
					if(valueDisplay.toUpperCase() === option.DISPLAY.toUpperCase()){
						EditShellHtml.push("<option selected value='"+option.CODE+"'>", option.DISPLAY, "</option>");
					}
					else{
						EditShellHtml.push("<option value='"+option.CODE+"'>", option.DISPLAY, "</option>");
					}
				});
				EditShellHtml.push("</select>");
			}
			EditShellHtml.push("</td></tr>");
			EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b' colspan='2'>&nbsp; </td></tr>");
			EditShellHtml.push("</table>");
			EditShellHtml.push("</div>");
			return (EditShellHtml.join(""));
		}
		
		
		function setPosition(parentElement, editContainer) {
			parentElement = parentElement.get(0);
			if(parentElement){
				parentElement.style.position = "relative";
			}
				var p = $(parentElement).position()
				, top = $(parentElement).height(), left = 0;
				var tblAdded = $("oe-edit-tbl",editContainer);
				editContainer.css("display","block");
				editContainer.css("position","absolute");
				tblAdded.css("display","block");
				editContainer.css("left",left + "px");
				editContainer.css("top",top + "px");
			}
			
		function launchEditTextPopup(editContainer,orderEntryDetail){		
				var orderEntryDetailElement = orderEntryDetail.getElement();
				// Edit Container not already appended to order detail entry element 
				if(!editContainer.parent().is(orderEntryDetailElement)){					
					var hideEvent = function(event){
						setTextValue(orderEntryDetail,editContainer);	
						orderEntryDetailElement.css("position", "static");
						orderEntryDetail.triggerFocusOut();
						editContainer.hide();
					}
					$(".oe-edit-value",editContainer).attr("tabIndex",$(".oe-detail-display",orderEntryDetailElement).attr("tabIndex"));
					$(".oe-edit-value",editContainer).focusout(hideEvent);
					$(".oe-edit-value",editContainer).dblclick(hideEvent);
					$(".oe-edit-value",editContainer).keyup(function(event) {
						 if ( event.which === 13 ) {
						     hideEvent(event);
						     event.preventDefault();
						   }						
					});					
					
					// focus event to stop propogation to parent element
					$(".oe-edit-value",editContainer).focus(function(event){
						event.stopPropagation();
					});
					
					// append container to body for display
					$(orderEntryDetailElement).append(editContainer);
				}
				// show existing edit container
				else{
					editContainer.show();
				}
							
				// position container
				setPosition(orderEntryDetailElement,editContainer);
					
				currentEditContainer = editContainer;
				
				// set focus on container
				$(".oe-edit-value",editContainer).focus();
				orderEntryDetail.triggerFocusIn();
		}
		
		function launchEditSelectPopup(editContainer,orderEntryDetail){	
			
				var orderEntryDetailElement = orderEntryDetail.getElement();
				var field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
				// Edit Container not already appended to order detail entry element 
				if(!editContainer.parent().is(orderEntryDetailElement)){			
					var hideEvent = function(event){
						setSelectValue(orderEntryDetail,editContainer);					
						orderEntryDetailElement.css("position", "static");
						orderEntryDetail.triggerFocusOut();
						editContainer.hide();
					}
					$(".oe-edit-value",editContainer).attr("tabIndex",$(".oe-detail-display",orderEntryDetailElement).attr("tabIndex"));
					$(".oe-edit-value",editContainer).focusout(hideEvent);
					$(".oe-edit-value",editContainer).dblclick(hideEvent);
					$(".oe-edit-value",editContainer).keyup(function(event) {
						  if ( event.which == 13 ) {
						     hideEvent(event);
						     event.preventDefault();
						   }						
					});					
					
					// focus event to stop propogation to parent element
					$(".oe-edit-value",editContainer).focus(function(event){
						event.stopPropagation();
					});
					
					// append container to body for display
					$(orderEntryDetailElement).append(editContainer);					
					
				}
				// show existing edit container
				else{
					editContainer.show();					
					// select values from dropdown
					$(".oe-edit-value option").filter(function() {
						return $(this).text().toUpperCase() == field_display_value.toUpperCase(); 
					}).attr('selected', true);
				}
							
				// position container
				setPosition(orderEntryDetailElement,editContainer);
					
				currentEditContainer = editContainer;
				
				// set focus on container
				$(".oe-edit-value",editContainer).focus();
				
				orderEntryDetail.triggerFocusIn();
		}
		
		function setTextValue(orderEntryDetail,editContainer){
			var textElement =  $(".oe-edit-value",editContainer)
				,textValue = textElement.val()
				,integertextValue = textValue.split(" ").join("")
				,integerValue = parseFloat(integertextValue);
			if(textValue > " "){
				orderEntryDetail.setAttribute("OE_FIELD_DISPLAY_VALUE",textValue.encodeLineBreaks());
				if(_.isNumber(integerValue)){
					orderEntryDetail.setAttribute("OE_FIELD_VALUE",integerValue); 
				}
				else{
					orderEntryDetail.setAttribute("OE_FIELD_VALUE",0); // reset OE_FIELD_VALUE
				}
				orderEntryDetail.updateDisplay();
			}
		}
		
		function setSelectValue(orderEntryDetail,editContainer){
			var selectElement =  $(".oe-edit-value",editContainer).get(0)
			,selectedIndex = selectElement.selectedIndex
			,selectedOption;
			if(selectedIndex >= 0){ // valid selection made
				selectedOption = selectElement.options[selectedIndex];
				orderEntryDetail.setAttribute("OE_FIELD_DISPLAY_VALUE",selectedOption.innerHTML);
				orderEntryDetail.setAttribute("OE_FIELD_VALUE",parseFloat(selectedOption.value));
				orderEntryDetail.updateDisplay();				
			}
		}
		
		
		function getOeFieldCacheKey(orderEntryDetail){
			var keyString = "";
			var actionType = orderEntryDetail.getParentAttribute("ACTION_TYPE") || "DEFAULT";
			var oeSynonymId = orderEntryDetail.getParentAttribute("SYNONYM_ID") || 0;
			var oeFieldId = orderEntryDetail.getAttribute("OE_FIELD_ID");
			keyString = actionType+"_"+oeSynonymId+"_"+oeFieldId;
			return(keyString)
		}
		
		function getCodeSetCacheKey(oeFieldCache){
			var keyString = "";
			var oeFieldData = oeFieldCache.OE_FIELD_DATA;
			var oeFieldMeaning = oeFieldData["OE_FIELD_MEANING"]
			var codeSet = oeFieldData.CODESET; ;
			var identifier = "";
			switch(oeFieldCache.OE_FORMAT_DATA.FILTER_PARAMS){
				case "ORDERABLE": 
						identifier = oeFieldCache.ORDER_CATALOG_DATA.CATALOG_CD; break;
				case "ACTIVITY TYPE": 
						identifier = oeFieldCache.ORDER_CATALOG_DATA.ACTIVITY_TYPE_CD;break;
				case "CATALOG TYPE": 
						identifier = oeFieldCache.ORDER_CATALOG_DATA.CATALOG_TYPE_CD;break;
			 	default: 
			 			identifier  = "DEFAULT";
			}			
			
			keyString = oeFieldMeaning+"_"+codeSet+"_"+identifier;
			return(keyString)
		}
		
	
	// cleanup
	this.reset = function(){
		delete code_set_cache;
		delete order_entry_fields_cache;
		code_set_cache = {};
		order_entry_fields_cache = {};	
		// Remove any existing containers
		$("div.oe-edit-popup").remove();
		// Reset events and container
		if(currentEditContainer != null){
			currentEditContainer.remove();
			currentEditContainer = null;
		}
	}
	
	this.displayEdit = function(event,orderEntryDetail){		
		
		var fieldTypeFlag = orderEntryDetail.getAttribute("FIELD_TYPE_FLAG")
			,oeFieldId  = orderEntryDetail.getAttribute("OE_FIELD_ID")
			,codeSet  = orderEntryDetail.getAttribute("CODESET")
			,oeFieldMeaning = orderEntryDetail.getAttribute("OE_FIELD_MEANING")
			,callBackFunction = null;
		
		switch(fieldTypeFlag){
			case 0: callBackFunction = self.alphaNumericEdit; break;
			case 1: callBackFunction = self.integerEdit;break;
			case 2: callBackFunction = self.decimalEdit;break;
			case 6: callBackFunction = self.codeSetEdit;break;
			case 7: callBackFunction = self.yesNoEdit;break;
			case 12: if(codeSet > 0 || oeFieldMeaning == "REASONFOREXAM"){
				callBackFunction = self.codeSetEdit;
			}
			break;
		}
		// Not a null or undefined function
		if(!_.isNull(callBackFunction) && !_.isUndefined(callBackFunction)){
			//If oe field was cached, use the cache value
			if(order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)] && (typeof order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)]).toUpperCase() === "OBJECT"){
				callBackFunction(orderEntryDetail)
			}
			//retrieve oe field details
			else{
				self.getOeField(orderEntryDetail,callBackFunction)
			}
		}
		else{
			self.doNothing();
		}
	}	
	
	this.alphaNumericEdit = function (orderEntryDetail){
		var orderEntryDetailElement = orderEntryDetail.getElement()
		,editContainer = $(".oe-edit-popup",orderEntryDetailElement)
		,oeField = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA
		,acceptSize = parseInt(oeField["ACCEPT_SIZE"],10);
		
		// build edit container if not defined
		if(!editContainer.get(0)){
			editContainer = $(buildFreeTextEditShell(orderEntryDetail,"textarea"));
			$("textarea.oe-edit-value",editContainer).attr("rows",4);
			// max length
			if(acceptSize > 0){				
				// max length
			    $("textarea.oe-edit-value",editContainer).live('keyup blur', function() {
			        var val = $(this).val();
			
			        // Trim the field if it has content over the maxlength.
			        if (val.length > maxlength) {
			            $(this).val(val.slice(0, acceptSize));
			        }
			    });
			}
		}
		
		//launch edit Pop-up
		launchEditTextPopup(editContainer,orderEntryDetail)
	};
	
	this.integerEdit = function (orderEntryDetail){
		var orderEntryDetailElement = orderEntryDetail.getElement()
		,editContainer = $(".oe-edit-popup",orderEntryDetailElement)
		,oeField = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA
		,acceptSize = parseInt(oeField["ACCEPT_SIZE"],10);
		
		// build edit container if not defined
		if(!editContainer.get(0)){
			editContainer = $(buildFreeTextEditShell(orderEntryDetail,"input"));
			// max length
			if(acceptSize > 0){
				$("input.oe-edit-value",editContainer).attr("maxlength",acceptSize);
			}
			// set integer input validation
			InputFieldValidation.integer($("input.oe-edit-value",editContainer));
		}
		
		//launch edit Pop-up
		launchEditTextPopup(editContainer,orderEntryDetail)
	};

	this.decimalEdit = function (orderEntryDetail){		
		var orderEntryDetailElement = orderEntryDetail.getElement()
		,editContainer = $(".oe-edit-popup",orderEntryDetailElement)
		,oeField = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA
		,acceptSize = parseInt(oeField["ACCEPT_SIZE"],10);
		
		// build edit container if not defined
		if(!editContainer.get(0)){		
			editContainer = $(buildFreeTextEditShell(orderEntryDetail,"input"));
			// max length
			if(acceptSize > 0){
				$("input.oe-edit-value",editContainer).attr("maxlength",acceptSize);
			}
			// set integer input validation
			InputFieldValidation.decimal($("input.oe-edit-value",editContainer));
		}
		
		//launch edit Pop-up
		launchEditTextPopup(editContainer,orderEntryDetail)
	};
	
	this.codeSetEdit = function (orderEntryDetail){
		var oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)]
		,cachedCodeSet			
		,oeFieldData = oeFieldCache.OE_FIELD_DATA;
		
		codeSet = oeFieldData.CODESET;
		
		cachedCodeSet = code_set_cache[getCodeSetCacheKey(oeFieldCache)];
		
		//If code set was cached, use the cached values
		if(cachedCodeSet){
			if(cachedCodeSet && _.isArray(cachedCodeSet)){
				self.displayCodeSetSelect(orderEntryDetail,codeSet)
			}
		}
		// retrieve code set values
		else{
			self.getCodeSet(orderEntryDetail,codeSet,self.displayCodeSetSelect)
		}
	};
	 
	this.getCodeSet = function(orderEntryDetail,codeSet,callBackFunction){
		// Ajax request for retrieving code value	
		var parameters
		,oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)]
		,oeFieldData = oeFieldCache.OE_FIELD_DATA
		,oeFormatData = oeFieldCache.OE_FORMAT_DATA
		,oeCatalogData = oeFieldCache.ORDER_CATALOG_DATA
		,oeFieldMeaning = oeFieldData["OE_FIELD_MEANING"] ;
		parameters  = "^MINE^,"+codeSet
							+",^"+oeFieldMeaning+"^"
							+',^{ "OE_FIELD_DATA":{"FILTER_PARAMS": "'+oeFormatData.FILTER_PARAMS+'"'
							+', "CATALOG_TYPE_CD" : '+parseFloat(oeCatalogData.CATALOG_TYPE_CD).toFixed(2)
							+', "ACTIVITY_TYPE_CD" : '+parseFloat(oeCatalogData.ACTIVITY_TYPE_CD).toFixed(2)
							+', "CATALOG_CD" : '+parseFloat(oeCatalogData.CATALOG_CD).toFixed(2)
							+"}}^";
		
		AjaxHandler.ajax_request({
			"request":{
				"type":"XMLCCLREQUEST",
				"target":"INN_OM_GET_OE_CODE_VALUES",
				"parameters":parameters
			},
			"response":{
				"type":"JSON",
				"target": function(responseJSON){
					var code_set_key = getCodeSetCacheKey(oeFieldCache);
					code_set_cache[code_set_key] = responseJSON.response.RECORD_DATA.CODES;
					code_set_cache[code_set_key] = _.sortBy(code_set_cache[code_set_key],function(codeValue){
						return (codeValue.DISPLAY.toUpperCase());
					});
					callBackFunction(orderEntryDetail,codeSet);
				}
			}
		});
	}
	//Retrive order entry field details
	this.getOeField = function(orderEntryDetail,callBackFunction){
		var oeFieldId = orderEntryDetail.getAttribute("OE_FIELD_ID");
		var oeSynonymId = orderEntryDetail.getParentAttribute("SYNONYM_ID");
		var actionType = orderEntryDetail.getParentAttribute("ACTION_TYPE");
		
		var parameters = "^MINE^,"
						+"^"+actionType+"^"+","
						+parseFloat(oeSynonymId).toFixed(2)+","
						+parseFloat(oeFieldId).toFixed(2);
						
			AjaxHandler.ajax_request({
				"request":{
					"type":"XMLCCLREQUEST",
					"target":"INN_OM_GET_OEFIELD_FORMAT",
					"parameters":parameters
				},
				"response":{
					"type":"JSON",
					"target": function(responseJSON){
						order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)] = {};
						order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA = responseJSON.response.RECORD_DATA.OE_FIELD;
						order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FORMAT_DATA = responseJSON.response.RECORD_DATA.OE_FORMAT;
						order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].ORDER_CATALOG_DATA = responseJSON.response.RECORD_DATA.ORDER_CATALOG;
						callBackFunction(orderEntryDetail);
					}
				}
			});
	}
	
	this.getCachedOeFieldData = function(orderEntryDetail){
		var oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)];
		return(oeFieldCache);
	}
	
	this.displayCodeSetSelect = function(orderEntryDetail,codeSet){
		var orderEntryDetailElement = orderEntryDetail.getElement()
		,editContainer = $(".oe-edit-popup",orderEntryDetailElement);
		
		// build edit container if not defined
		if(!editContainer.get(0)){		
			editContainer = $(buildCodeSetEditShell(orderEntryDetail,codeSet));		
		}
		//launch edit Pop-up
		launchEditSelectPopup(editContainer,orderEntryDetail)
	}
	
	this.yesNoEdit = function (orderEntryDetail){
		var orderEntryDetailElement = orderEntryDetail.getElement()
		,editContainer = $(".oe-edit-popup",orderEntryDetailElement);
		
		// build edit container if not defined
		if(!editContainer.get(0)){		
			editContainer = $(buildOptionsEditShell(orderEntryDetail ,[
				{
					"CODE":0.0,
					"DISPLAY":"No"
				},
				{
					"CODE":1.0,
					"DISPLAY":"Yes"
				}
			]));
		}
		
		//launch edit Pop-up
		launchEditSelectPopup(editContainer,orderEntryDetail)
	};
	
	this.doNothing = function(){}
	
	this.buildFreeTextEditShell = buildFreeTextEditShell;
	
	this.buildCodeSetEditShell =  buildCodeSetEditShell;
	
	this.buildOptionsEditShell = buildOptionsEditShell;
	
	this.getCodeSetCache = function(){
		return(code_set_cache)
	}
	
	this.getCurrentEditContainer = function(){
		return(currentEditContainer);
	}
	
});
var OrderModify = OrderDetailsEdit.extend({
	reset : function() {
		var orderModifyElement = this.getElement();
		var orderEntryDetails = this.getOrderEntryDetails();
		delete orderEntryDetails;
		orderModifyElement.remove();
	},
	remove : function() {
		this.reset();
		OrderModifyManager.removeOrderModify(this);
	},
	buildModifyXML : function() {
		var xml = "";
		var changedOrderEntryDetails = [];
		var orderEntryDetails = this.getOrderEntryDetails();
		// get template xml
		var OrderModifyXMLTemplate = Handlebars.templates.modifyOrderDetails;
		
		// build JSON for filling out template with changed details only
		_.each(orderEntryDetails, function(oeDetail) {
			// Add encoded field meaning for changed fields for modify xml
			if(oeDetail.hasChanged()){
				oeDetail.setAttribute("OE_FIELD_MEANING_ENCODE",oeDetail.encodeAttributeValue("OE_FIELD_MEANING"))
				changedOrderEntryDetails[changedOrderEntryDetails.length] = oeDetail.getAttributes();
			}
		});
		// Any changed order entry details
		if(changedOrderEntryDetails.length > 0) {
			var orderJSON = this.getAttributes();
			orderJSON.DETQUAL = changedOrderEntryDetails;
			orderJSON.DETQUAL_CNT = orderJSON.DETQUAL.length;
			// Get xml for order
			xml = OrderModifyXMLTemplate(orderJSON);
		}
		return xml;

	},
	//initialize function
	initialize : function(orderid,parentElement) {
		try {
			var self = this;
			// initialize attributes
			self.setAttributes({
				"ORDER_ID" : 0.00,
				"SYNONYM_ID" : 0.0,
				"LAST_UPDT_CNT":0,
				"ACTION_TYPE":"MODIFY"
			});
			self.setOrderEntryDetails([]);

			AjaxHandler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : "INN_GET_ORDER_DETAILS_FIELD",
					parameters : '"MINE", ' + orderid + '.0'
				},
				response : {
					type : "JSON",
					target : function(orderJson) {
						var orderData = orderJson.response;
						var statusData = orderData.REPORT_DATA.STATUS_DATA;
						var status = statusData.STATUS;
						var currentSequence;
						var oeDetails = orderData.REPORT_DATA.DETQUAL;

						if(status === "F") {
							self.handleError("OrderModify.initialize()", statusData);
						} else {
							self.setAttribute("ORDER_ID", orderid);
							self.setAttribute("SYNONYM_ID", orderData.REPORT_DATA.SYNONYM_ID);
							self.setAttribute("OE_FORMAT_ID", orderData.REPORT_DATA.OE_FORMAT_ID);
							self.setAttribute("LAST_UPDT_CNT", orderData.REPORT_DATA.UPDT_CNT);
							self.setAttribute("ORDERABLE_TYPE_FLAG", orderData.REPORT_DATA.ORDERABLE_TYPE_FLAG);
							
							// Successfulyl added to order modify manager
							if(OrderModifyManager.addOrderModify(self)){
								currentSequence = OrderModifyManager.getCurrentOrderModifyseq()
								// build the detail line
								self.buildLine(oeDetails, currentSequence);
								if(parentElement){
									$(parentElement).empty().append(self.getElement());
								}
							}
							// reset invalid Order Modify
							else{
								alert("Order failed - could not add to order ("+orderid+") modify manager")
							}
						}
					}
				}
			});
		} catch(e) {
			alert("Error - >" + e.message + "OrderModify.initialize()")
		}
	},
	handleError : function(methodName, statusObject) {
		var errorMessage = "";
		if(statusObject.SUBEVENTSTATUS.length > 0) {
			errorMessage = JSON.stringify(statusObject.SUBEVENTSTATUS)
		}
		alert("ERROR - OrderModify." + methodName + "() -> " + errorMessage);
	}
});
var OrderModifyManager = (new function(){
	var orders = []
	,currentOrderModifySequence = -1
	,pendingOrderModifyCnt = 0
	,MPAGES_API_ROOT = window.external
	,attributes = [];
		
    function setAttribute(attribute, value) {
		attributes[attribute] = value;
		// add attribute to each order
		_.each(orders, function(order){
			order.setAttribute(attribute,value);
		});
	}
	
	function getAttribute(attribute) {
		return (attributes[attribute]);
	}
   
   function handleError (methodName, statusObject) {	
		if(statusObject.SUBEVENTSTATUS.length > 0) {
			var errorMessage = JSON.stringify(statusObject.SUBEVENTSTATUS)
		}
		alert("ERROR - OrderManager." + methodName + "() -> " + errorMessage);
	}
	
	this.setAttribute = setAttribute;
	this.getAttribute = getAttribute;
	
	this.ordersXmlTemplatePath = "../xml/modifyOrders.xml";
	this.orderDetailsXmlTemplatePath = "../xml/modifyOrderDetails.xml",
	
	this.setMpagesAPIRoot = function(api_root){
		MPAGES_API_ROOT = api_root;
	}

	this.reset = function(){
		_.each(orders,function(order){
			order.reset();
		});		
		orders = [];
		currentOrderModifySequence = -1;
		pendingOrderModifyCnt = 0;
	}
	
	this.isUniqueOrder = function(OrderModifyInstance) {
		var existingOrder = _.find(orders, function(order) {
			return (order.getAttribute("ORDER_ID") == OrderModifyInstance.getAttribute("ORDER_ID"))
		})
		if(existingOrder) {
			return false;
		} else {
			return true;
		}
	}

	
	this.getCurrentOrderModifyseq = function(){
		return (currentOrderModifySequence);
	}
	
	this.addOrderModify = function(OrderModifyInstance){	
		var orderAdded = false;
		if(this.isUniqueOrder(OrderModifyInstance)){
			orders[orders.length] = OrderModifyInstance;
			currentOrderModifySequence += 1;
			orderAdded = true;
		}
		return (orderAdded);
	}
	
	this.removeOrderModify = function(OrderModifyInstance){
		orders = _.without(orders,OrderModifyInstance);
	}

	this.removeOrderModifyWithOrderId = function (OrderId) {
		var orderModifyInstance = _.find(orders, function (order) {
			return order.getAttribute("ORDER_ID") === OrderId;
		});
		this.removeOrderModify(orderModifyInstance);
	}
	
	this.getOrdersModify = function(){
		return (orders);
	}
	
	this.setPendingOrderModifyCnt = function(cnt){
		pendingOrderModifyCnt=cnt;
	}
	
	this.getPendingOrderModifyCnt = function(){
		return (pendingOrderModifyCnt);
	}
	
	this.decreasePendingOrderModifyCnt = function(){
		pendingOrderModifyCnt = pendingOrderModifyCnt-1;
	}
	this.buildModifyXML = function(callBackFunction) {
		try {
			var modifyOrdersXML = "";
			// Any orders to modify
			if(currentOrderModifySequence > -1) {
				// Build xml for orders modified
				_.each(orders, function(order) {
					modifyOrdersXML += order.buildModifyXML();
				});
				// any order modified
				if(modifyOrdersXML > " "){
					// get template xml
					var OrderModifyXMLTemplate = Handlebars.templates.modifyOrders;
					
					// Build complete xml for order
					modifyOrdersXML = OrderModifyXMLTemplate({
						"ORDERS_XML" : modifyOrdersXML
					});
				}
			}
			return(modifyOrdersXML)
		} catch(e) {			
			alert("Error - >" + e.message + "OrderModifyManager.buildModifyXML()");
			return (modifyOrdersXML)
		}
	}

	this.modifyOrders = function(Criterion,callBackFunction) {
		try {
			// Build xml for orders modified
			var modifyOrdersXML = this.buildModifyXML();
			var successInd = false;
			var moewXml = "";
			// Any orders to modify
			if(modifyOrdersXML > " ") {				
				var m_hMOEW = 0;
				var PowerOrdersMPageUtils = MPAGES_API_ROOT.DiscernObjectFactory("POWERORDERS");
				var m_dPersonId = Criterion.person_id;
				var m_dEncounterId = Criterion.encntr_id;
				//Call power orders API for Modify
				m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 24, 2, 127);
				PowerOrdersMPageUtils.CustomizeTabMOEW(m_hMOEW, 2, 127);
				PowerOrdersMPageUtils.CustomizeTabMOEW(m_hMOEW, 3, 127);
				
				var retVal = PowerOrdersMPageUtils.InvokeModifyActionMOEW(m_hMOEW, modifyOrdersXML);
				if(retVal){
					moewXml=PowerOrdersMPageUtils.GetXMLOrdersMOEW(m_hMOEW);
					successInd = true;
				}
				else{
					successInd = false;
				}
				// clean up API call
				PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
				
				// reset data on order modify manager
				OrderModifyManager.reset();
				
				// do call back indicating success/ failure
				callBackFunction(successInd, moewXml);
				
			} else {
				// No modify actions => pass through to call back
				callBackFunction(true, "");
			}
	
	
		} catch(e) {
			alert("Error - >" + e.message + "OrderModifyManager.modifyOrders()")
			callBackFunction(false, "");
		}
	}
	
});var OrderSentence = OrderDetailsEdit.extend({
	reset : function() {
		delete orderEntryDetails;
		$(this.editDetailsElement).remove();
	},
	remove : function() {
		this.reset();
		OrderSentenceManager.removeOrderSentence(this);
	},
	anyDetailsToAdd: function(){
		var orderEntryDetails = this.getOrderEntryDetails();
		var anyDetailsInd = false;
		
		// build detail list and display line
		_.each(orderEntryDetails, function(oeDetail, index) {
			// valid display defined
			if(oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {
				anyDetailsInd = true;
			}
		});
		return(anyDetailsInd);
	},
	buildScriptRequestJSON : function() {
		var Request = {}, detail_list = [], displayLine = "";
		var orderEntryDetails = this.getOrderEntryDetails();
		var attributes = this.getAttributes();
		var displayDetailCnt = 0;
		var validDetailCnt = 0;
		var detailDisplay = "";
		
		// build detail list and display line
		_.each(orderEntryDetails, function(oeDetail, index) {
			var clinLineLabel = oeDetail.getAttribute("CLIN_LINE_LABEL");
			// valid display defined
			if(oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {
							
				//for PRN
				if(oeDetail.getAttribute("OE_FIELD_MEANING") == "SCH/PRN"){
					//the display value is PRN for yes
					if(oeDetail.getAttribute("OE_FIELD_VALUE") == 1){
						detailDisplay = "PRN"
					}
					//the display value is empty for no
					else{
						detailDisplay = "";
					}
				}
				else{
					detailDisplay = oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
				}
				
					
				// apply the clinical display line prefix/suffix to the detailDisplay			
				if(parseInt(oeDetail.getAttribute("CLIN_LINE_IND"),10) == 1 && clinLineLabel > " "){
					// has a prefix label
					if(parseInt(oeDetail.getAttribute("CLIN_SUFFIX_IND"),10) == 0){
						detailDisplay = clinLineLabel + " "+ detailDisplay;
					}			
					// has a suffix label
					else{
						detailDisplay = detailDisplay +" "+ clinLineLabel;
					}						
				}
				
				// build display line for a non-empty detail
				if(detailDisplay > " "){
					if(displayDetailCnt > 0) {
						displayLine += ", ";
					}
					displayLine += detailDisplay;
					displayDetailCnt += 1;
				}
				validDetailCnt += 1;
				
				var detailValue = oeDetail.getAttribute("OE_FIELD_VALUE");
				
				//if not a decimal-> add .00 for the number to be treated as decimal
				if(parseFloat(detailValue) % 1 == 0){
					detailValue = detailValue.toFixed(2);
				}
				else{
					detailValue = ""+detailValue;
				}
							
				var currentDetail = {
					"oe_field_id" : oeDetail.getAttribute("OE_FIELD_ID").toFixed(2),
					"oe_field_display_value" : ""+oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE"),
					"oe_field_value" : detailValue,
					"oe_field_meaning_id" : oeDetail.getAttribute("OE_FIELD_MEANING_ID").toFixed(2),
					"field_type_flag" : oeDetail.getAttribute("FIELD_TYPE_FLAG"),
					"sequence" : (validDetailCnt)
				}
				detail_list[detail_list.length] = currentDetail;
			}
		});
		Request = {
			"order_sentence_display_line" : displayLine,
			"order_sentence_id" : attributes["ORDER_SENTENCE_ID"].toFixed(2),
			"oe_format_id" : attributes["OE_FORMAT_ID"].toFixed(2),
			"parent_entity_name" : "ORDER_CATALOG_SYNONYM",
			"parent_entity_id" : attributes["SYNONYM_ID"].toFixed(2),
			"parent_entity2_name" : "",
			"parent_entity2_id" : (0).toFixed(2),
			"detail_cnt" : detail_list.length,
			"detail_list" : detail_list
		}

		return (JSON.stringify(Request))
	},
	//initialize function
	initialize : function(oeDetails,someOtherParam) {
		//alert(someOtherParam)
		//alert(oeDetails.length+"--"+someOtherParameter)
		// Add to Order Sentence Manager only if valid number of order details are present
		if(oeDetails.length > 0) {
			OrderSentenceManager.addOrderSentence(this);
		}
		// initialize attributes
		this.setAttributes({
			"ORDER_SENTENCE_ID" : 0.00,
			"SYNONYM_ID" : 0.0,
			"OE_FORMAT_ID" : 0.0,
			"ACTION_TYPE":"ORDER"
		});		
		this.setOrderEntryDetails([]);
		
		var currentSequence = OrderSentenceManager.getCurrentOrderSentenceSeq();
		// build the detail line
		this.buildLine(oeDetails,currentSequence);
	}
});
var OrderSentenceManager = (new function(){
	var orderSentences = []
		,currentOrderSentenceSequence = -1
		,createdOrderSentences = []
		,attributes = [];
		
   	function setAttribute(attribute, value) {
		attributes[attribute] = value;
		// add attribute to each order sentence
		_.each(orderSentences, function(orderSentence){
			orderSentence.setAttribute(attribute,value);
		});
	}
	
	function getAttribute(attribute) {
		return (attributes[attribute]);
	}
	
   function handleError (methodName, statusObject) {	
		if(statusObject.SUBEVENTSTATUS.length > 0) {
			var errorMessage = JSON.stringify(statusObject.SUBEVENTSTATUS)
		}
		alert("ERROR - OrderSentenceManager." + methodName + "() -> " + errorMessage);
	}
	
	this.setAttribute = setAttribute;
	this.getAttribute = getAttribute;

	this.reset = function(){
		orderSentences = []
		currentOrderSentenceSequence = -1;
		createdOrderSentences = [];
	}
	this.getCurrentOrderSentenceSeq = function(){
		return (currentOrderSentenceSequence);
	}
	this.addOrderSentence = function(OrderSentenceInstance){
		orderSentences[orderSentences.length] = OrderSentenceInstance;
		currentOrderSentenceSequence += 1;
	}
	this.getOrderSentences = function(){
		return (orderSentences);
	}
	this.removeOrderSentence = function(OrderSentenceInstance){
		orderSentences = _.without(orderSentences,OrderSentenceInstance);
	}
	this.findNewOrderSentences = function(){
		var newOrderSentences = _.filter(orderSentences,function(orderSentence){
			var order_sentence_id = orderSentence.getAttribute("ORDER_SENTENCE_ID");
			var hasDetailsToAdd = orderSentence.anyDetailsToAdd();
			// has no order sentence id and has details to add
			return(order_sentence_id === 0.0 && hasDetailsToAdd)
		});
		return(newOrderSentences);
	}
	
	this.createOrderSentences = function(callBackFunction) {
		try {
			var self = this, addOrderSentences = function(newOrderSentences) {
				// Ajax request for retrieving code value
				var scriptParameters, requestJSON, orderSentencesRequest = "";
				if(newOrderSentences.length > 0){
					// Build script parameters
					_.each(newOrderSentences, function(curOrderSentence, index) {		
						if(index > 0) {
								orderSentencesRequest += ",";
							}
						orderSentencesRequest += curOrderSentence.buildScriptRequestJSON();					
					});
					requestJSON = '{ "order_sentence_request":{  "cnt":' + newOrderSentences.length + ',   "list": [' + orderSentencesRequest + ']}}'
					scriptParameters = "^MINE^,^^";
				}
				 // No new order sentences to add with details
				else{
					callBackFunction(true);
					return true;
				}
				
				AjaxHandler.append_text("INN_ORM_ADD_ORD_SENTENCES blobIn -- > "+requestJSON);
				AjaxHandler.ajax_request({
					"request" : {
						"type" : "XMLCCLREQUEST",
						"target" : "INN_ORM_ADD_ORD_SENTENCES",
						"blobIn": requestJSON,
						"parameters" : scriptParameters
					},
					"response" : {
						"type" : "JSON",
						"target" : function(responseJSON) {
							var statusData = responseJSON.response.RECORD_DATA.STATUS_DATA, status = statusData.STATUS, successInd;
							if(status === "F") {
								successInd = false;
								handleError("createOrderSentences()", statusData);
							} else {
								successInd = true;
								var orderSentenceIds = responseJSON.response.RECORD_DATA.ORDER_SENTENCE_LIST;
								// Set the order sentence id value for new sentences
								_.each(orderSentenceIds, function(orderSentenceObject, index) {
									var orderSentenceId = orderSentenceObject.ORDER_SENTENCE_ID, successInd = orderSentenceObject.SUCCESS_IND, failedOrderSentence;
									// If order sentence creating failed => clear out the order_sentence_id attribute
									if(successInd === 0) {
										failedOrderSentence = _.find(newOrderSentences, function(curOrderSentence) {
											return (curOrderSentence.getAttribute("ORDER_SENTENCE_ID") === orderSentenceId);
										});
										// found a matching failed order_sentence => reset the id to 0
										if(!_.isNull(failedOrderSentence) && !_.isUndefined(failedOrderSentence)) {
											failedOrderSentence.setAttribute("ORDER_SENTENCE_ID", 0.0);
										}
									} else {
										createdOrderSentences[createdOrderSentences.length] = {
											"order_sentence_id" : orderSentenceId,
											"ord_comment_long_text_id" : 0.0
										};
									}
								});
							}
							callBackFunction(successInd);
						}
					}
				});
			}
			this.createOrderSentenceIds(addOrderSentences);
		} catch(e) {
			alert("Error - >" + e.message + "OrderSentenceManager.createOrderSentences()")
		}
	}	

	this.createOrderSentenceIds = function(callBack) {
		try {
			// Ajax request for retrieving order sentence ids
			var newOrderSentences = this.findNewOrderSentences(), scriptParameters, requestJSON = "";
			
			if(newOrderSentences && _.isArray(newOrderSentences)  && newOrderSentences.length > 0) {
				requestJSON = '{ "pw_comp_id_request":{  "id_count":' + newOrderSentences.length + ',   "comp_type_meaning":"REF_SEQ" }}'
				scriptParameters = "^MINE^,^^";
			} else {
				callBack([]);
				return false;
			}
			
			AjaxHandler.append_text("INN_DCP_GET_PW_COMP_ID blobIn -- > "+requestJSON);
			AjaxHandler.ajax_request({
				"request" : {
					"type" : "XMLCCLREQUEST",
					"target" : "INN_DCP_GET_PW_COMP_ID",
					"blobIn": requestJSON,
					"parameters" : scriptParameters
				},
				"response" : {
					"type" : "JSON",
					"target" : function(responseJSON) {
						var statusData = responseJSON.response.RECORD_DATA.STATUS_DATA, status = statusData.STATUS;
						if(status === "F") {
							handleError("createOrderSentenceIds()", statusData);
						} else {
							var orderSentenceIds = responseJSON.response.RECORD_DATA.ID_LIST;
							// Set the order sentence id value for new sentences
							_.each(orderSentenceIds, function(idObject, index) {
								var orderSentenceId = idObject.ID;
								if(newOrderSentences.length > index) {
									newOrderSentences[index].setAttribute("ORDER_SENTENCE_ID", orderSentenceId);
								}
							});
							callBack(newOrderSentences);
						}
					}
				}
			});
		} catch(e) {
			alert("Error - >" + e.message + "OrderSentenceManager.createOrderSentenceIds()")
		}
	}


	this.destroyOrderSentences = function(callBackFunction) {
		try {
			var scriptParameters, orderSentencesRequest = {};
			var requestJSON = "";
			
			orderSentencesRequest.cnt = createdOrderSentences.length;
			orderSentencesRequest.list = createdOrderSentences;
			
			if(orderSentencesRequest.cnt === 0){ // return if now new order sentences created
				callBackFunction(true);
				return true;
			}
			// Build script paramters
			scriptParameters = '^MINE^,^^';
			// Build the request JSON
			requestJSON = '{ "order_sentence_request": {' 
			requestJSON += '"cnt" : '+parseInt(orderSentencesRequest.cnt)+" ,"
			requestJSON += '"list" : [';				
			_.each(orderSentencesRequest.list,function(osItem,index){
				if(index > 0){
					requestJSON += ",";
				}
				requestJSON += '{';
					requestJSON += '"order_sentence_id" : '+parseFloat(osItem.order_sentence_id).toFixed(2)+" ,"
					requestJSON += '"ord_comment_long_text_id" : '+parseFloat(osItem.ord_comment_long_text_id).toFixed(2);
				requestJSON += '}';
			})
			requestJSON +=' ]}}';
	
			// Reset Order Sentence Ids
			_.each(createdOrderSentences, function(createdOrderSentence, index) {
				var orderSentenceId = createdOrderSentence.order_sentence_id, orderSentenceObject;
				orderSentenceObject = _.find(orderSentences, function(curOrderSentence) {
					return (curOrderSentence.getAttribute("ORDER_SENTENCE_ID") === orderSentenceId);
				});
				if(!_.isUndefined(orderSentenceObject) && !_.isNull(orderSentenceObject)) {
					orderSentenceObject.setAttribute("ORDER_SENTENCE_ID", 0.0);
				}
			});
			// Delete Order Sentence Ids
			AjaxHandler.append_text("INN_ORM_DEL_ORD_SENTENCES blobIn -- > "+requestJSON);
			AjaxHandler.ajax_request({
				"request" : {
					"type" : "XMLCCLREQUEST",
					"target" : "INN_ORM_DEL_ORD_SENTENCES",
					"blobIn": requestJSON,
					"parameters" : scriptParameters
				},
				"response" : {
					"type" : "JSON",
					"target" : function(responseJSON) {
						var statusData = responseJSON.response.RECORD_DATA.STATUS_DATA, status = statusData.STATUS, successInd = true;
						if(status === "F") {
							successInd = false;
							handleError("destroyOrderSentences()", statusData);
						}
						callBackFunction(successInd);
					}
				}
			});
		} catch(e) {
			alert("Error - >" + e.message + "OrderSentenceManager.destroyOrderSentences()")
		}
	}

	
});
/**
 * @author RB018070
 */

/* Function: setDttmFormat()
 * Purpose: To get the current date time string in the format specified
 * Parameters:  None
 * Returns: cur_dttm_str (Date) - Date/time Object
 */ 
function setDttmFormat(cur_dttm) {
	var dttmFormat = Preferences.get("GeneralDateTimeFormat");
	
	return (dttmFormat > " ") ? cur_dttm.format(dttmFormat) : cur_dttm.format("default");
}

/* Function: getCurDttmStr()
 * Purpose: To get the current date time string in the format specified
 * Parameters:  None
 * Returns: cur_dttm_str (String) - Current date/time string
 */ 
function getCurDttmStr() {
	var cur_dttm = new Date();
	return setDttmFormat(cur_dttm);
}

/* Function: setDttmFormat()
 * Purpose: To convert and ISO formatted date string to the date/time format
 * Parameters:  None
 * Returns: cur_dttm_str (String) - Current date/time string
 */ 
function cnvtIsoDttmFormat(iso_dttm_str) {
	var cur_dttm = new Date();
	cur_dttm.setISO8601(iso_dttm_str);
	return setDttmFormat(cur_dttm);	
}
/**
 * @author RB018070
 */
/***** Error handling methods ***/
function errorHandler(error_obj, det) {
	if (AjaxHandler && AjaxHandler.debug_mode_ind === 1) {
		if (console && console.error) {
			console.error("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
		} else {
			AjaxHandler.append_text("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
		}
	}
	else {
		alert("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
	}
}
/**
 * @author JL026366
 * @dependencies jQuery, doT, underscore
 */
var FavoriteOrders = (function ($, doT, _) {

	// event function that toggles the folder display open and closed
	folderTitleToggle = function (event) {
		var $el = $(this);
		if ($el.children("span").hasClass("icon-row-closed")) {
			$el.parent().find("ul").show();
			$el.children("span").removeClass("icon-row-closed").addClass("icon-row-open");
		} else {
			$el.parent().find("ul").hide();
			$el.children("span").removeClass("icon-row-open").addClass("icon-row-closed");
		}
		event.preventDefault();
	};
	
	// clones the element and sets a one time drag event to scroll to the top of the modal window
	draggableCloneHelper = function (event) {
		return $(this).clone().removeAttr("id").one("mousemove", function (event) {
			$("#FavoritesModal").scrollTop(0);
		});
	};
	
	// filters folders by departmental (true) / personal (false)
	// using the folder.DEPTIND value
	departmentalFavoritesFilter = function (folder) {
		return (parseInt(folder.DEPTIND, 10) === 1);
	};
	
	// maps the folder data from the jsonData down to what is used by the template
	// _.map passes in the object, key, and list, but we only need the folder object
	favoriteFolderMap = function (folder) {
		var folderObject = {};
		folderObject.name = folder.SNAME + folder.STYPE;
		folderObject.orderCount = folder.OCNT;
		
		// map the order list
		folderObject.orders = _.map(folder.OLIST, function (order) {
			var orderObject = {};
			orderObject.name = order.SDISP;
			if (order.SORDSENTDISP.length > 0) {
				orderObject.sentence = "(" + order.SORDSENTDISP + ")";
			} else {
				orderObject.sentence = "";
			}
			orderObject.value = order.DSYNID+"_"+order.DORDSENTID;
			return orderObject;
		});
		return folderObject;
	};
	
	// given an array of orders and the column type, returns the string needed for the ORDERS API
	// dependent on the Criterion and OrdersLayout object
	generateOrderString = function (orders, columnType) {
		var orderString = [];
		var orderValue = "";
		var orderSynonymId = 0;
		var orderSentenceId = 0;
		
		
		// set up order string prefix
		orderString.push(String(criterion.person_id));
		orderString.push("|");
		orderString.push(String(criterion.encntr_id));
		orderString.push("|");
		
		for (var index = 0; index < orders.length; index++) {
			// default values
			orderSynonymId = 0;
			orderSentenceId = 0;
			orderValue = orders[index].value;
			// Valid order value -> extract the synonym and sentence ids
			if(orderValue > " " && orderValue.split("_").length == 2){
				orderSynonymId = parseFloat(orderValue.split("_")[0]);
				orderSentenceId = parseFloat(orderValue.split("_")[1]);
			}
			// Valid order synonym
			if(orderSynonymId > 0){
				orderString.push("{ORDER|");
				// order synonym
				orderString.push(orderSynonymId);
				// order as perscription if we're in the discharge column
				if (columnType === OrdersLayout.getDischargeColumnType()) {
					orderString.push("|1|");
				} else {
					orderString.push("|0|");
				}
				// order sentence id
				orderString.push(orderSentenceId);
				// nomen id and sign-time interaction
				orderString.push("|0|1}");
			}
		}
		
		// order string postfix
		orderString.push("|24|{2|127}|32|1");
		return orderString.join("");
	};
	
	loadFavorites = function (jsonData) {
		var FOLDERS_TEMPLATE = doT.template($("#FoldersTemplate").html()),
			$departmentalFavorites = $("#tabs-departmental-favorites"),
			$personalFavorites = $("#tabs-personal-favorites"),
			departmentalFavoritesData = {},
			personalFavoritesData = {};

		// seperate departmental and personal favorites
		// and map the JSON data to our data for the doT template
		departmentalFavoritesData.folders = _.map(_.filter(jsonData.response.FDATA.FOLDER_QUAL, departmentalFavoritesFilter), favoriteFolderMap);
		personalFavoritesData.folders = _.map(_.reject(jsonData.response.FDATA.FOLDER_QUAL, departmentalFavoritesFilter), favoriteFolderMap);
		
		// load data into DOM via folders template
		$departmentalFavorites.append(FOLDERS_TEMPLATE(departmentalFavoritesData));
		$personalFavorites.append(FOLDERS_TEMPLATE(personalFavoritesData));
		
		// set folders default to closed
		$(".folder ul").hide();
		
		// set up toggle handlers
		$(".folder-title").click(folderTitleToggle);
		
		// set the draggable items
		$(".folder").draggable({
			appendTo: "#cart",
			containment: "#FavoritesModal",
			cursor: "move",
			helper: draggableCloneHelper,
			refreshPositions: true		// droppable intersection fix for scrolling
		});
		
		$(".order").draggable({
			appendTo: "#cart",
			containment: "#FavoritesModal",
			cursor: "move",
			helper: draggableCloneHelper,
			refreshPositions: true		// droppable intersection fix for scrolling
		});
		
		// set the droppable "cart"
		$("#cart ul").droppable({
			tolerance: "touch",
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			drop: function (event, ui) {
				$(this).find(".placeholder").remove();
				// add the item to the cart
				var $el = $("<li></li>").append($(ui.draggable).clone()).appendTo(this),
					$closeButton = $("<div></div>").click(function (event) {
						$(event.target).parentsUntil("li").parent().detach();
						event.preventDefault();
					}).text("x").attr("title", "Click to remove item");
				
				// set up folder title toggle
				$el.find(".folder-title").click(folderTitleToggle);
				
				// append the "x" remove buttons
				$el.find(".folder").append($closeButton.clone(true).addClass("folder-remove-button")).css("position", "relative");
				$el.find(".order").each(function (index) {
					$(this).find(".order-title").css("width","98%");
					$(this).append($closeButton.clone(true).addClass("order-remove-button")).css("position", "relative");
				});
			}
		});
		
		// set up the tabs
		$("#tabs").tabs({"selected": 0});
		$("#tabs-destination").tabs();
		
		// remove the loading spinner
		$("#loadingSpinner").detach();
	};
	
	return {
		// private functions, for testing purposes
		departmentalFavoritesFilter: departmentalFavoritesFilter,
		favoriteFolderMap: favoriteFolderMap,
		generateOrderString: generateOrderString,
		
		// public functions
		launch: function (columnType) {
			try {
				var cclParam, modalData = {}, $favoritesModalPopup;

				// prepare the data for the modal template
				modalData.personalFavoritesTitle = "Personal Favorites";
				modalData.departmentalFavoritesTitle = "Departmental Favorites";
				switch (columnType) {
				case OrdersLayout.getTransferColumnType():
					modalData.headerDisplay = "Inpatient Favorites";
					modalData.selectedFavoritesTitle = "Selected Inpatient Favorites";
					break;
				case OrdersLayout.getDischargeColumnType():
					modalData.headerDisplay = "Discharge Favorites";
					modalData.selectedFavoritesTitle = "Selected Discharge Favorites";
					break;
				}
				
				// set up the modal window using the modal template
				$favoritesModalPopup = $(doT.template($("#FavoriteOrdersModalTemplate").html())(modalData));
				$favoritesModalPopup.dialog({
					width: 800,
					height: 600,
					modal: true,
					buttons: {
						"Sign": function () {
							FavoriteOrders.signOrderables(columnType);
							$(this).dialog("destroy").remove();
						},
						"Cancel": function () {
							$(this).dialog("destory").remove();
							//ensure whole widget is removed from the DOM
							$("#FavoritesModal").parent().remove();
						}
					},
					close: function (event, ui) {
						// ensure widget is removed from the DOM 
						// when the modal's "X" is clicked
						$(this).dialog("destroy").remove();
						$("#FavoritesModal").parent().remove();
					}
				});
				
				// load orderables
				cclParam = "^MINE^," + columnType + "," + String(criterion.prsnl_id) + ".00," + String(criterion.encntr_id) + ".00"; 
				GlobalAjaxCclHandler.ajax_request({
					request: {
						type: "XMLCCLREQUEST",
						target: "ADVSR_MEDS_REC_GET_FAVORITES:DBA",
						parameters: cclParam
					},
					response: {
						type: "JSON",
						target: loadFavorites
					}
				});
			} catch (err) {
				errorHandler(err, "FavoriteOrders.launch()");
			}
		},
		signOrderables: function (columnType) {
			var orders = $("#cart").find(".order").toArray();
			if (orders.length > 0) {
				MPAGES_EVENT("ORDERS", generateOrderString(orders, columnType));
			}
			// refresh page
			MedRec.refreshPage();
		}
	};
})(jQuery, doT, _);/**
 * @author RB018070
 */

// list of icons displayed on the advisor
var icons = (function () {
	return {
		"restart": "6355_24.png",
		"showComment": "4972.gif",
		"editComment": "5153.gif",
		"documentedOrder": "3796_16.gif",
		"circleLoading": "ajax-loader.gif",
		"editSentence": "4969.gif",
		"root_path": "..",
		"icon_folder_name": "\\img\\"
	};
}());/**
 * @author RB018070
*/
var OrderGroupEntity = function () {
	return {
		order_group_id: "",
		most_recent_order_name: "",
		most_recent_order_as_mnemonic: "",
		most_recent_order_dttm: "",
		most_recent_order_mltm_id: "",
		most_recent_order_action_entity_id: "",
		most_recent_order_col_index: "",
		first_order_action_entity_id: "",
		first_order_col_index: "",
		hx_resume_ind: "",
		most_recent_resume_ind: "",
		med_ind: "",
		discontinued_ind: "",
		discontinued_dt_tm: "",
		suspended_ind: "",
		medicationCategory: ""
	};
};


var OrderGroup = (function () {
	var groupsList = [],
		groupData = {},
		parentTable,
		tableHeader,
		tableColumnsLength,
		visibleSubColumnsLength = 0,
		hiddenColumns = [],
		hiddenSubColumns = [];
	
	return ({
		setTable: function (pTable) {
			parentTable = pTable;
		},
		setTableColumns: function (pTableHeader) {
			tableHeader = pTableHeader.rows[0];
			tableColumnsLength = tableHeader.cells.length;
		},
		setOrderGroupsCSS: function (groupsCSS) {
			var cssCnt = groupsCSS.length, t, tableBodies = parentTable.tBodies, curGroupCss;
			for (t = 0; t < tableBodies.length; t++) {
				if (tableBodies[t].className.indexOf("tbl-fxd-body-tr-grey") === -1) {
					curGroupCss = groupsCSS[t % cssCnt];
					$(tableBodies[t]).addClass(curGroupCss);
				} 
			}
		},
		setVisibleSubColumnsLength: function (num) {
			visibleSubColumnsLength = num;
		},
		reset: function () {
			hiddenSubColumns = [];
			groupsList = [];
			groupData = {};
		},
		getHiddenColumns: function () {
			return hiddenColumns;
		},		
		setHiddenColumns: function (hCols) {
			hiddenColumns = hCols;
		},
		moveOrderGroup: function (referenceGroup, orderGroupDOM) {
			Util.ia(orderGroupDOM, referenceGroup);
			return orderGroupDOM;
		},
		moveOrderGroupsList: function (referenceTable, orderGroupSortList) {
			for (var i = 0; i < orderGroupSortList.length; i++) {
				if (_g(orderGroupSortList[i].order_group_id)) {
					OrderGroup.moveOrderGroup(referenceTable, _g(orderGroupSortList[i].order_group_id));
				}
			}
		},
		setPreviousOrderColumn: function (groupId, columnIndex) {
			groupData[groupId].columnIndex = columnIndex;
		},
		getPreviousOrderColumn: function (groupId) {
			return groupData[groupId].columnIndex;
		},
		getCurrentOrderRow: function (orderGroupDOM) {
			var groupRows = orderGroupDOM.rows,
				groupRowsLength = groupRows.length;				
			return groupRows[groupRowsLength - 2];
		},
		createOrderGroup: function (groupId, insertAfterRow) {
			var orderGroupDOM = Util.cep("tbody", {"id": groupId}), curOrderGroupEntity = new OrderGroupEntity();
			if (!(_.isNull(insertAfterRow) || _.isUndefined(insertAfterRow))) {
				Util.ia(orderGroupDOM, insertAfterRow);
			} else {
				orderGroupDOM = Util.ac(orderGroupDOM, parentTable);
			}
			curOrderGroupEntity.order_group_id = groupId;
			orderGroupEntityList.put("order_group_" + groupId, curOrderGroupEntity);
			return (orderGroupDOM);
		},
		createOrderRows: function (orderGroupDOM, rowId, columnIndex) {
			try {
				var orderRowDOM = Util.cep("tr", {"id": rowId, "className": "col-row"}),
					curCellBackground = "", orderRowCells = [],
					orderDetailRowDOM = Util.cep("tr", {"className": "col-detail-row"}), c, groupId = orderGroupDOM.id;					
				
				// Insert order Row
				for (c = 0; c < tableColumnsLength; c++) {
					cur_cell = Util.ac(Util.cep("td", {"className": "tbl-fxd-body-tr-td-detail"}), orderRowDOM);
					cur_cell.style.width = "33.333%";
					cur_cell.colSpan = tableHeader.cells[c].colSpan;
					cur_cell.innerHTML = "&nbsp;";
					if (hiddenColumns[c] && hiddenColumns[c] === true) {
						cur_cell.style.display = "none";
					}
					orderRowCells.push(cur_cell);
				}		
				// Insert order Detail Row
				for (c = 0; c < tableColumnsLength; c++) {
					cur_cell = Util.ac(Util.cep("td", {"className": "tbl-fxd-body-tr-td-detail", "colSpan": tableHeader.cells[c].colSpan}), orderDetailRowDOM);
					cur_cell.style.width = "33.333%";
					if (hiddenColumns[c] && hiddenColumns[c] === true) {
						cur_cell.style.display = "none";
					}
					cur_cell.innerHTML = "&nbsp;";

					if (c >= 0 && c <= tableColumnsLength - 1) {
						if (c <= tableColumnsLength - 1) {
							cur_cell.style.borderRightWidth = "2px";
						}
						if (c >= 0) {
							orderRowCells[c].style.borderRightWidth = "2px";
						}
					}
				}
				
				orderDetailRowDOM.style.display = "none";
				// Update Group Datat
				if (!groupData[groupId]) {
					groupData[groupId] = {};
				}
				groupData[groupId].columnIndex = columnIndex;
				orderRowDOM = Util.ac(orderRowDOM, orderGroupDOM);
				orderDetailRowDOM = Util.ac(orderDetailRowDOM, orderGroupDOM);
				return [orderRowDOM, orderDetailRowDOM];
			} catch (e2) {
				errorHandler(e2, "createOrderRows()");
			}
		},
		findLastGroup: function (className, collapsibleheader) {
			var nextSibling = Util.gns(collapsibleheader);	
			while (nextSibling) {
				if (_.isNull(Util.gns(nextSibling))) {
					break;
				} else {
					nextSibling = Util.gns(nextSibling);
				}
			}							
			return nextSibling;			
		},
		clearChildRows: function (rowDOM, columnIndex) {
			try {
				var childRow, nextRow = Util.gns(rowDOM), row_id = rowDOM.id, c;		
				//Clear details on same row
				for (c = columnIndex; c < tableColumnsLength; c++) {
					rowDOM.cells[c].innerHTML = "&nbsp;";
					rowDOM.cells[c].className = "tbl-fxd-body-tr-td-detail";
				}
				// remove the order for the location from json	
				for (c = columnIndex; c < tableColumnsLength; c++) {
					OrderableDisplay.removeOrderableJson(row_id + "_" + c);
					if (!(_.isNull(nextRow) || _.isUndefined(nextRow))) {
						nextRow.cells[c].innerHTML = "&nbsp;";
					}
				}
				nextRow.style.display = "none";
				childRow = Util.gns(nextRow);
				while (childRow !== null) {
					// remove the order for the location from json	
					for (c = 0; c < tableColumnsLength; c++) {
						OrderableDisplay.removeOrderableJson(childRow.id + "_" + c);
					}
					Util.de(childRow);
					childRow = Util.gns(nextRow);
				}							
			} catch (e2) {
				errorHandler(e2, "clearChildRows()");
			}	
		},
		toggleTableColumnDisplay: function (columnIndex, displayStyle) {
			try {
				var start_sub_col_index = map_sub_cols[columnIndex] + 1,
					end_sub_col_index = map_sub_cols[columnIndex + 1],
					col_rows = Util.Style.g("col-row", parentTable, "tr"),
					subcol_rows = Util.Style.g("subcol-row", parentTable, "tr"),
					col_detail_rows = Util.Style.g("col-detail-row", parentTable, "tr"),
					collapsible_headers = Util.Style.g("collapsible-header-cell", parentTable, "tbody"),
					headers = Util.Style.g("column-header"),
					sub_headers = Util.Style.g("tbl-fxd-hdr-tr-sub-td"),
					sub_header_width,
					header_width,
					visibleSubColumnsLength = 0;
					
				hiddenColumns[columnIndex] = (displayStyle === "none");
					
				// Update Sub-column based classes	
				for (var i = start_sub_col_index; i <= end_sub_col_index; i++) {	
					for (var j = 0; j < subcol_rows.length ; j ++) {
						subcol_rows[j].cells[i].style.display = displayStyle;
					}
					hiddenSubColumns[i] = (displayStyle === "none"); 
				}
				
				// Update column based classes	
				for (var rowIndex = 0; rowIndex < col_rows.length; rowIndex++) {
					col_rows[rowIndex].cells[columnIndex].style.display = displayStyle;
					if (Util.Style.ccss(col_rows[rowIndex], "no-pre-admit") === true) {
						if (columnIndex > 0 && col_rows[rowIndex].cells[columnIndex]) {
							col_rows[rowIndex].cells[columnIndex].style.visibility = "hidden";
							col_rows[rowIndex].cells[columnIndex].style.display = "none";
						}	
					}
				}
				
				// Update column based classes	
				for (var detailIndex = 0; detailIndex < col_detail_rows.length; detailIndex++) {
					col_detail_rows[detailIndex].cells[columnIndex].style.display = displayStyle;
				}						
				
				// get visibleSubColumnsLength
				for (var headerIndex = 0; headerIndex < headers.length; headerIndex++) {
					if (headers[headerIndex].style.display !== "none") {
						visibleSubColumnsLength += parseInt(headers[headerIndex].colSpan, 10);
					}
				}		
				
				// Update collapsible header colSpan
				for (var collapsibleIndex = 0; collapsibleIndex < collapsible_headers.length; collapsibleIndex++) {
					collapsible_headers[collapsibleIndex].colSpan = visibleSubColumnsLength;
				}	
					
				sub_header_width = 34;
				// Update sub-header width 
				for (var subHeaderIndex = 0; subHeaderIndex < sub_headers.length; subHeaderIndex++) {
                    if (sub_headers[subHeaderIndex].style.display !== "none") { 
					   sub_headers[subHeaderIndex].style.width = sub_header_width + "%";
                    }
				}
                
				sub_header_width = (100 / visibleSubColumnsLength);
				// Update sub-header width 
				for (var subHeaderIndex = 0; subHeaderIndex < sub_headers.length; subHeaderIndex++) {
					sub_headers[subHeaderIndex].style.width = sub_header_width + "%";
				}

			} catch (e) {
				errorHandler(e, "toggleTableColumnDisplay()");
			}
		},
		insertCollapsibleHeader: function (hdrPrefs) {
			try {
				var collapsibleHeaderDOM = Util.cep("tbody", {"className": "collapsible-header"}),
					headerRowDOM = Util.ce("tr"),
					headerRowCellDOM = Util.cep("td", {"className": "collapsible-header-cell orderable-category-header"}),
					headerNameDOM = Util.ce("span"),
					headerToggleDOM = Util.cep("span", {"className": "toggle-collapsible-header"}),
					insertAfterRow = hdrPrefs.insertAfterRow,
					headerName = hdrPrefs.headerName,
					collapseCSS = hdrPrefs.collapseCSS,
					collapseDefault = hdrPrefs.collapseDefault,
					subCatLevel = hdrPrefs.subCatLevel,
					hideCollapse = hdrPrefs.hideCollapse,
					subCatIndentHTML = "",
					curImg,
					curImgTitle,
					displayStyle;
				
				if (collapseDefault === 1) {
					curImg = "icon-row-closed";
					curImgTitle = "Expand";
				} else {
					curImg = "icon-row-open";
					curImgTitle = "Collapse";
				}
				headerNameDOM.innerHTML = headerName;
				Util.Style.acss(headerToggleDOM, curImg);
				headerToggleDOM.title = curImgTitle;
				if (subCatLevel) {
					headerToggleDOM.style.marginLeft = (subCatLevel * 5) + "px";
				}
				
				headerToggleDOM.onclick = function (event) {
					// toggle the icon and set each row to display
					if ($(this).hasClass("icon-row-closed")) {
						displayStyle = "";
						$(this).removeClass("icon-row-closed").addClass("icon-row-open");
					} else {
						displayStyle = "none";
						$(this).removeClass("icon-row-open").addClass("icon-row-closed");
					}
					
					// set each item in the grouping to the display style
					var nextSibling = Util.gns(collapsibleHeaderDOM);
					while (nextSibling && nextSibling.className.indexOf(collapseCSS) >= 0) {
						nextSibling.style.display = displayStyle;
						nextSibling = Util.gns(nextSibling);
					}
				};
				
				headerRowCellDOM.colSpan = 3;
				if (!hideCollapse) {
					headerToggleDOM = Util.ac(headerToggleDOM, headerRowCellDOM);
				}
				headerNameDOM =	Util.ac(headerNameDOM, headerRowCellDOM);
				headerRowCellDOM =	Util.ac(headerRowCellDOM, headerRowDOM);
				
				// append a TD for each of the remaining visible columns
				Util.ac(Util.cep("td", {"className": "orderable-category-header", "colSpan": "3"}), headerRowDOM);
				Util.ac(Util.cep("td", {"className": "orderable-category-header", "colSpan": "3"}), headerRowDOM);
				
				
				headerRowDOM = Util.ac(headerRowDOM, collapsibleHeaderDOM);
				if (!(_.isNull(insertAfterRow) || _.isUndefined(insertAfterRow))) {
					Util.ia(collapsibleHeaderDOM, insertAfterRow);
				} else {
					collapsibleHeaderDOM = Util.ac(collapsibleHeaderDOM, parentTable);
				}
				
				return (collapsibleHeaderDOM);
			} catch (e) {
				errorHandler(e, "insertCollapsibleHeader()");
			}
		}
	});	
})();
/**
 * @author RB018070
 */

var OrderRecon = (function () {
	// private variables
	var orderReconContinue = null,
		orderReconDoNotCnvt = null,
		orderReconDoNotCnvtPreadmit = null,
		orderReconNonMed = null,
		orderReconResume = null,
		orderReconDiscontinue = null,
		orderReconContinue_order_list = [],
		orderReconDoNotCnvt_order_list = [],
		orderReconDoNotCnvtPreadmit_order_list = [],
		orderReconNonMed_order_list = [],
		orderReconResume_order_list = [],
		orderReconDiscontinue_order_list = [],
		finalOrderRecon = [];
	
	function buildReconDetailJSON(reconObj) {
		var reconItem = [];
		reconItem.push("{");
		reconItem.push('"order_id" :', parseFloat(reconObj.order_id).toFixed(2));
		reconItem.push(', "clinical_display_line" : "', reconObj.clinical_display_line, '"');
		reconItem.push(', "simplified_display_line" : "', reconObj.simplified_display_line, '"');
		reconItem.push(', "continue_order_ind" :', parseInt(reconObj.continue_order_ind, 10));
		reconItem.push(', "recon_order_action_mean" : "', reconObj.recon_order_action_mean, '"');
		reconItem.push(', "order_mnemonic" : "', reconObj.order_mnemonic, '"');
		reconItem.push("}");	
		return reconItem.join("");
	}
	
	return ({
		"buildReconDetailJSON": buildReconDetailJSON,
		initialize: function () {
			orderReconContinue = ['{',
				'"recon_type_flag": 2,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "RECON_CONTINUE",',
				'"order_list":'].join('');
			
			orderReconDoNotCnvt = ['{',
				'"recon_type_flag": 3,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "RECON_DO_NOT_CNVT",',
				'"order_list": '].join('');
			
			orderReconDoNotCnvtPreadmit = ['{',
				'"recon_type_flag": 1,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "RECON_DO_NOT_CNVT",',
				'"order_list": '].join('');
				
			orderReconNonMed = ['{',
				'"recon_type_flag": 3,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "RECON_CONTINUE",',
				'"order_list": '].join('');
				
			orderReconResume = ['{',
				'"recon_type_flag": 3,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "RECON_RESUME",',
				'"order_list": '].join('');
				
			orderReconDiscontinue = ['{',
				'"recon_type_flag": 3,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "DISCONTINUE",',
				'"order_list": '].join('');
				
			orderReconPreadmitDiscontinue = ['{',
				'"recon_type_flag": 3,',
				'"to_action_seq": 1,',
				'"no_known_meds_ind": 0,',
				'"reltn_type_mean": "DISCONTINUE",',
				'"order_list": '].join('');
						
			orderReconContinue_order_list = [];
			orderReconDoNotCnvt_order_list = [];
			orderReconDoNotCnvtPreadmit_order_list = [];
			orderReconNonMed_order_list = [];
			orderReconResume_order_list = [];
			orderReconDiscontinue_order_list = [];
			finalOrderRecon = [];
		},
		finalizeRecon: function () {
			if (orderReconContinue_order_list.length > 0) {// valid number of recon continue
				finalOrderRecon.push(orderReconContinue + "[" + orderReconContinue_order_list.join(",") + "]}");
			}
			if (orderReconDoNotCnvt_order_list.length > 0) {// valid number of recon do not convert
				finalOrderRecon.push(orderReconDoNotCnvt + "[" + orderReconDoNotCnvt_order_list.join(",") + "]}");
			}
			if (orderReconDoNotCnvtPreadmit_order_list.length > 0) {// valid number of recon do not convert from preadmit
				finalOrderRecon.push(orderReconDoNotCnvtPreadmit + "[" + orderReconDoNotCnvtPreadmit_order_list.join(",") + "]}");
			}
			if (orderReconNonMed_order_list.length > 0) {// valid number of recon Non Med continue
				finalOrderRecon.push(orderReconNonMed + "[" + orderReconNonMed_order_list.join(",") + "]}");
			}
			if (orderReconResume_order_list.length > 0) {// valid number of recon resume
				finalOrderRecon.push(orderReconResume + "[" + orderReconResume_order_list.join(",") + "]}");
			}
			if (orderReconDiscontinue_order_list.length > 0) {// valid number of recon discontinue
				finalOrderRecon.push(orderReconDiscontinue + "[" + orderReconDiscontinue_order_list.join(",") + "]}");
			}
			return finalOrderRecon;
		},
		appendReconContinue: function (orderRecon) {
			orderReconContinue_order_list.push(buildReconDetailJSON(orderRecon));
		},
		appendReconDoNotCnvt: function (orderRecon) {
			orderReconDoNotCnvt_order_list.push(buildReconDetailJSON(orderRecon));
		},
		appendReconDoNotCnvtPreadmit: function (orderRecon) {
			orderReconDoNotCnvtPreadmit_order_list.push(buildReconDetailJSON(orderRecon));
		},
		appendReconNonMed: function (orderRecon) {
			orderReconNonMed_order_list.push(buildReconDetailJSON(orderRecon));
		},
		appendReconResume: function (orderRecon) {
			orderReconResume_order_list.push(buildReconDetailJSON(orderRecon));
		},
		appendReconDiscontinue: function (orderRecon) {
			orderReconDiscontinue_order_list.push(buildReconDetailJSON(orderRecon));
		}
	});
})();
/**
 * @author RB018070
 */

var OrderableEntity = function () {
	return {
		order_id: "",
		recon_order_action_mean: "",
		search_id: "",
		status_type: "",
		opt_sel: "",
		col_index: "",
		prev_col_index: "",
		row_id: "",
		parent_row_id: "",
		ord_name: "",
		order_phy_name: "",
		ord_cki: "",
		ord_cat_cd: "",
		ord_recon_id: "",
		ord_syn_id: "",
		ord_snt_id: "",
		ord_snt_disp: "",
		ord_comment: "",
		parent_order_id: "",
		parent_clin_disp: "",
		parent_simp_disp: "",
		parent_syn_id: "",
		parent_snt_id: "",
		parent_mnemonic: "",
		parent_group_id: "",
		order_success_ind: false
	};
};

var objPVFrmwkLink = null;
if (window.external && window.external.DiscernObjectFactory) {
	objPVFrmwkLink = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
}

var OrderableDisplay = (function () {
	var parentTable, tableHeader, tableSubHeader, stoppedIcon = icons.discontinued, resumedIcon = icons.documentedOrder, 
		showCommentIcon = icons.showComment, continuedIcon = icons.continued, modifiedIcon = icons.modified, mnem_disp_level,
		required_synonym_msg = "<span class='required-synonym'>Select an alternative</span>";
	
	function loadDiscontinueReasons(json_response) {
		var sel_opt_el,
			dropdown_el =  new UtilInputText(),
			cur_row = json_response.parameters[0],
			col_index = json_response.parameters[1],
			Obj = json_response.parameters[2],
			divlbl = json_response.parameters[3],
			cur_ord_action_entity = orderActionEntityList.get(cur_row.id + col_index),
			defaultMessage = "(None)",
			json_dc_reason_codes = json_response.response.RECORD_DATA.CODES;
		Obj.style.display = "";
					
		sel_opt_el = Util.ce("SPAN");
		sel_opt_el.style.width = 'auto';
		json_drug_data = json_response.response;
		Obj.innerHTML = divlbl;
		sel_opt_el = Obj.appendChild(sel_opt_el);
		
		_.sortBy(json_dc_reason_codes, function (dc_reason) {
			return dc_reason.DISPLAY.toUpperCase();
		});
			
		dropdown_el.set_dropdown_list(sel_opt_el, json_dc_reason_codes, "DISPLAY", "", "", defaultMessage, false);
		
		dropdown_el.onchange = function () {
			var sel_ord_entity = this.options_list[this.selectedIndex];
			cur_ord_action_entity.dc_reason_cd = sel_ord_entity.CODE;
			cur_ord_action_entity.dc_reason_disp = sel_ord_entity.DISPLAY;
			OrderableDisplay.addOrderableJson(cur_ord_action_entity); // update orderable details
		};
		
		if (cur_ord_action_entity.dc_reason_cd  > 0.0) {
		// Find the matching cancel dc reason in list
			_.find(json_dc_reason_codes, function (curReason, index) {
				if (parseFloat(cur_ord_action_entity.dc_reason_cd) === parseFloat(curReason.CODE)) {						
					dropdown_el.setSelectedIndex(index);
					return true;
				}
			});
			// trigger on change
			dropdown_el.onchange();
		}
	}
	
	function removeOrderable(action_entity, disch_flag) {
		var prev_ord_action_entity,
			cur_ord_group_entity,
			first_action_entity;
		
		prev_ord_action_entity = getPreviousActionEntity(action_entity);
		/* Remove Current Orderable Json*/
		OrderableDisplay.removeOrderableJson(action_entity.row_obj.id + "_" + (action_entity.col_index));

		OrderableDisplay.removeOrderSentence(action_entity);

		/* Remove Additonal Reconciliation Actions If Any */
		//Remove any  Reconciliations Objects from previous column
		if(prev_ord_action_entity){
			OrderableDisplay.removeOrderableJson(prev_ord_action_entity.row_obj.id + "_" + (prev_ord_action_entity.col_index));
		}
		// Remove Pre-Admit Discontinue Reconciliations Object
		if (action_entity && action_entity.recon_order_action_mean === "CONVERT_RX" && disch_flag === 0) {
			// for conver rx => discontinue home med
			cur_ord_group_entity = orderGroupEntityList.get("order_group_" + action_entity.order_group_id);
			if (cur_ord_group_entity.first_order_col_index === 0) {
				first_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);
				OrderableDisplay.removeOrderableJson(first_action_entity.row_obj.id + "_" + (first_action_entity.col_index));
			}
		}
	}

	function getPreviousActionEntity(action_entity) {
		var prev_ord_action_entity;
		if (action_entity.restart_order_ind && action_entity.restart_order_ind === 1) {// was  restarted
			prev_ord_action_entity = orderActionEntityList.get(action_entity.parent_row_obj.id + (action_entity.col_index) + "");
		} else {
			prev_ord_action_entity = orderActionEntityList.get(action_entity.row_obj.id + (action_entity.prev_col_index) + "");
		}
		return prev_ord_action_entity;
	}

	function loadTherapeuticAlternativesOrderSentences(json_response) {
		try {
			var json_drug_data = json_response.response,
				sel_opt_el,
				sel_opt_el2,
				dropdown_el = new UtilInputText(),
				sel_opt_index = -1,
				opt_el,
				cur_row = json_response.parameters[0],
				col_index = json_response.parameters[1],
				Obj = json_response.parameters[2],
				altObj = json_response.parameters[3],
				divlbl = json_response.parameters[4],
				Opt = json_response.parameters[5],
				inpInd = json_response.parameters[6],
				ordIncl = json_response.parameters[7],
				cur_ord_action_entity = orderActionEntityList.get(cur_row.id + col_index),
				defaultMessage,
				json_ord_snt_data;
			
			var resetDetailsInd = 0;
			var modifyDetaislInd = 1;
			
			Obj.style.display = "";
			
			if (Opt === 1) {
				sel_opt_el = Util.ce("SPAN");
				sel_opt_el.style.width = 'auto';
				json_drug_data = json_response.response;
				Obj.innerHTML = "";
				sel_opt_el = Obj.appendChild(sel_opt_el);
				// Initialize conver synonym id to 0
				cur_ord_action_entity.orig_cnvt_synonym_id = 0;
				// assign dropdown list
				dropdown_el.onchange = function () {
					OrderableDisplay.removeOrderSentence(cur_ord_action_entity);
					
					var sel_ord_entity = this.options_list[this.selectedIndex];
					
					// Valid synonym Specified
					if (parseFloat(sel_ord_entity.SYNONYMID) > 0.0) {
						// update order entity
						cur_ord_action_entity.order_name = sel_ord_entity.MEDNAME;
						cur_ord_action_entity.order_as_mnemonic = sel_ord_entity.MEDMNEMONIC;
						cur_ord_action_entity.order_hna_mnemonic = cur_ord_action_entity.order_name;
						cur_ord_action_entity.cki = sel_ord_entity.MEDCKI;
						cur_ord_action_entity.catalog_cd = sel_ord_entity.MEDCATCD;
						cur_ord_action_entity.mltm_cat_id = sel_ord_entity.MEDMLTMCATID;
						cur_ord_action_entity.synonym_id =   sel_ord_entity.SYNONYMID;
						cur_ord_action_entity.order_comment = sel_ord_entity.ORDER_COMMENT;					
						cur_ord_action_entity.orig_ord_dt_tm = "";
						cur_ord_action_entity.order_phy_name = criterion.prsnl_name;
						cur_ord_action_entity.order_details = "";
					}
					// Invalid synonym => clear orderable
					else {
						cur_ord_action_entity.synonym_id = 0.0;
						cur_ord_action_entity.order_name = required_synonym_msg;
						cur_ord_action_entity.order_as_mnemonic = required_synonym_msg;
						cur_ord_action_entity.order_hna_mnemonic = required_synonym_msg;
						// clear orderable
						removeOrderable(cur_ord_action_entity, 0);
					}
					
					altObj.innerHTML = "";
					
					//Update Order display
					OrderableDisplay.updateDetail(cur_ord_action_entity, "ORDER_NAME", cur_ord_action_entity.order_as_mnemonic);
					
					// For a valid synonym => update order sentence attributes
					if (cur_ord_action_entity.synonym_id > 0.0) {
						// Allow user to modify order details
						modifyDetaislInd = 1;
						// Do not reset details if the synonym selected is same as original conversion synonym
						if(parseFloat(cur_ord_action_entity.orig_cnvt_synonym_id) === parseFloat(sel_ord_entity.SYNONYMID)){
							resetDetailsInd = 0;
						}
						// Reset details if the synonym selected is different from the original conversion synonym
						else{	
							resetDetailsInd = 1;						
						}
						
						// update sentence attributes
						var	prev_ord_action_entity = orderActionEntityList.get(cur_ord_action_entity.row_obj.id + (cur_ord_action_entity.prev_col_index));
						
						// convert details of previous order
						var cclParam = '"MINE","' + prev_ord_action_entity.order_id 
							+ '",' + (OrdersLayout.isInpatientColumn(prev_ord_action_entity.col_index)) 
							+ ',"' + cur_ord_action_entity.synonym_id+'"' 
							+ "," + modifyDetaislInd
							+ "," + resetDetailsInd;
							
						GlobalAjaxCclHandler.ajax_request({
							request: {
								type: "XMLCCLREQUEST",
								target: 'ADVSR_MEDS_REC_COPY_ORD_DET:dba',
								parameters: cclParam
							},
							loadingDialog: {
								targetDOM: altObj,
								content: "&nbsp;<img src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>"
							},
							response: {
								type: "JSON",
								target: function (json_response) {
									var sentenceDetails = json_response.response.ORDER_DETAILS.SYN[0].DETAILS,
										sentenceDisplay = '';
									
									if (cur_ord_action_entity.order_sentence) {
										delete cur_ord_action_entity.order_sentence;
									}
									cur_ord_action_entity.sentence_id = 0;
																	
									// Any sentence details passed
									if (sentenceDetails.length > 0) {
										cur_ord_action_entity.order_sentence = new OrderSentence(sentenceDetails);														
										cur_ord_action_entity.order_sentence.setAttribute("SYNONYM_ID", sel_ord_entity.SYNONYMID);									
										cur_ord_action_entity.order_sentence.setAttribute("OE_FORMAT_ID", sel_ord_entity.OE_FORMAT_ID);	
										cur_ord_action_entity.order_sentence.listenFocusIn(OrderableDisplay.focusCell, cur_ord_action_entity);
										cur_ord_action_entity.order_sentence.listenFocusOut(OrderableDisplay.unfocusCell, cur_ord_action_entity);											
									}
									OrderableDisplay.updateDetail(cur_ord_action_entity, "ORDER_DETAILS", sentenceDisplay); // Update sentence display
									
									altObj.innerHTML = "<img  src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>";
									var cclParam =  '"MINE","' + criterion.encntr_id + '","' + cur_ord_action_entity.cki + '","' +
										cur_ord_action_entity.synonym_id + '","",' + inpInd + ',"' + criterion.prsnl_id + '","' + icons.root_path + '"';
									GlobalAjaxCclHandler.ajax_request({
										request: {
											type: "XMLCCLREQUEST",
											target: 'ADVSR_MEDS_REC_GET_SYN_SNT:dba',
											parameters: cclParam
										},
										response: {
											type: "JSON",
											target: loadTherapeuticAlternativesOrderSentences,
											parameters: [cur_row, col_index, altObj, altObj, "Order Sentences", 2, inpInd, ordIncl]
										}
									});
									orderActionEntityList.put(cur_row.id + col_index, cur_ord_action_entity);
									showOrderableComment(cur_ord_action_entity);	
									OrderableDisplay.addOrderableJson(cur_ord_action_entity); // update orderable details
				
								},
								parameters: []
							}
						});
					}
				};
				
				SortIt(json_drug_data.AMEDS.MEDS, 1, "MEDCATRANK");
				
				defaultMessage = "";
				
				// if multiple matching synonyms from conversion and also the alternatives
				if (cur_ord_action_entity.synonyms_cnt  && cur_ord_action_entity.synonyms_cnt > 1 && json_drug_data.AMEDS.MEDS.length > 1) {
					defaultMessage = "Multiple matching synonyms found.";
					cur_ord_action_entity.synonym_id = 0.0;
					json_drug_data.AMEDS.MEDS.unshift({
						"MEDDISPLAY": "Multiple matching synonyms found.",
						"SYNONYMID": 0
					});
				}			
				else {				 
					// Find the matching synonym in list
					_.find(json_drug_data.AMEDS.MEDS, function (curMed, index) {
						if (parseFloat(curMed.SYNONYMID) === parseFloat(cur_ord_action_entity.synonym_id)) {		
							defaultMessage = curMed.MEDDISPLAY;
							return true;
						} else {
							return false;
						}
					});
				}
				
											
				// Current is a virtual viewed synonym or a matching doesn't exist => force user to selection
				if (cur_ord_action_entity.virtual_viewed_synonym_ind === 1 || defaultMessage === "") {					
					defaultMessage = "Therapeutic Alternatives";
					cur_ord_action_entity.synonym_id = 0.0;
					json_drug_data.AMEDS.MEDS.unshift({
						"MEDDISPLAY": defaultMessage,
						"SYNONYMID": 0,
						"MEDNAME": "",
						"MEDMNEMONIC": ""
					});
				}	


				if (json_drug_data.AMEDS.FAVIND === 1) {
					dropdown_el.set_dropdown_list(sel_opt_el, json_drug_data.AMEDS.MEDS, "MEDDISPLAY", "", "MEDCATEGORY", defaultMessage, false);
				} else {
					dropdown_el.set_dropdown_list(sel_opt_el, json_drug_data.AMEDS.MEDS, "MEDDISPLAY", "", "", defaultMessage, false);
				}
				
				// Find the matching synonym in list
				_.find(json_drug_data.AMEDS.MEDS, function (curMed, index) {
					if (parseFloat(curMed.SYNONYMID) === parseFloat(cur_ord_action_entity.synonym_id)) {		
						dropdown_el.setSelectedIndex(index);
						// Set convert drug synonym to the matching synonym
						cur_ord_action_entity.orig_cnvt_synonym_id = parseFloat(curMed.SYNONYMID);
						return true;
					} else {
						return false;
					}
				});

				// Initial load of sentences
				dropdown_el.onchange();
			} else {
				sel_opt_el = Util.ce("SPAN");
				sel_opt_el.style.width = 'auto';
				json_ord_snt_data = json_response.response;
				Obj.innerHTML = "";
				
				if (sel_opt_index > -1) {
					sel_opt_el.selectedIndex = sel_opt_index + 2;
				}
				sel_opt_el = Obj.appendChild(sel_opt_el);
				
				// assign dropdown list
				dropdown_el.onchange = function () {
					OrderableDisplay.removeOrderSentence(cur_ord_action_entity);
					var sel_ord_entity = this.options_list[parseInt(this.selectedIndex, 10)];
					if (this.selectedIndex === 0) {
						cur_ord_action_entity.sentence_id = 0;
						OrderableDisplay.updateDetail(cur_ord_action_entity, "ORDER_DETAILS", ""); // empty details
					} else {
						// update order entity
						cur_ord_action_entity.synonym_id = sel_ord_entity.SYNONYM_ID;
						cur_ord_action_entity.sentence_id = sel_ord_entity.SENTENCE_ID;
						cur_ord_action_entity.order_details = sel_ord_entity.SENTENCE_DISP;
						
						var scriptParams = '"MINE", (' + sel_ord_entity.SENTENCE_ID + ")";
						GlobalAjaxCclHandler.ajax_request({
							request: {
								type: "XMLCCLREQUEST",
								target: "INN_OM_GET_SENT_BY_ID",
								parameters: scriptParams
							},
							response: {
								type: "JSON",
								target: function (responseData) {
									var sentenceDetails = responseData.response.RECORD_DATA;
									if (cur_ord_action_entity.order_sentence) {
										delete cur_ord_action_entity.order_sentence;
									}
									// update sentence attributes
									cur_ord_action_entity.order_sentence = new OrderSentence(sentenceDetails.SENTENCES[0].DETAILS);									
									cur_ord_action_entity.order_sentence.setAttribute("SYNONYM_ID", sel_ord_entity.SYNONYM_ID);
									cur_ord_action_entity.order_sentence.setAttribute("OE_FORMAT_ID", sel_ord_entity.OE_FORMAT_ID);
									cur_ord_action_entity.order_sentence.listenFocusIn(OrderableDisplay.focusCell, cur_ord_action_entity);
									cur_ord_action_entity.order_sentence.listenFocusOut(OrderableDisplay.unfocusCell, cur_ord_action_entity);
									
									OrderableDisplay.updateDetail(cur_ord_action_entity, "ORDER_DETAILS", sel_ord_entity.SENTENCE_DISP); // Update sentence display
									orderActionEntityList.put(cur_row.id + col_index, cur_ord_action_entity);
									OrderableDisplay.addOrderableJson(cur_ord_action_entity); // update orderable details
								},
								parameters: []
							}
						});
					}
				};
				
				if (json_ord_snt_data.OSNTS.SNTS.length > 0) {
					json_ord_snt_data.OSNTS.SNTS.unshift({
						"SENTENCE_DISP": "Order Sentences",
						"SENTENCE_ID": 0
					});
					if (cur_ord_action_entity.order_details > " ") {
						defaultMessage = cur_ord_action_entity.order_details;
					} else {
						defaultMessage = "Order Sentences";
					}						
					dropdown_el.set_dropdown_list(sel_opt_el, json_ord_snt_data.OSNTS.SNTS, "SENTENCE_DISP", "", "MEDCATEGORY", defaultMessage, false);
				} 
			}
		} catch (e) {
			errorHandler(e, e.message + " - > OrderableDisplay.loadTherapeuticAlternativesOrderSentences()");
		}
	}
		
	function showOrderableComment(cur_ord_action_entity) {
		try {
			var cur_row = cur_ord_action_entity.row_obj;
			
			if (cur_ord_action_entity.order_comment > " ") {
				if (_g("disch-doc-" + cur_row.id)) {
					_g("disch-doc-" + cur_row.id).value = cur_ord_action_entity.order_comment.split("<br/>").join("\n");
					if (_g("disch-doc-" + cur_row.id).style.display === "none" && _g("disch-doc-icon-" + cur_row.id)) {
						_g("disch-doc-icon-" + cur_row.id).onclick();
					}
				}
			}
		} catch (e) {
			errorHandler(e, "showOrderableComment()");
		}
	}
	
	function toggleCellHighlight(actionEntity) {
		var $cell = $(actionEntity.row_obj.cells[actionEntity.col_index]);
		/* 
		 * ignore the following:
		 *	items in the discharge column
		 *  items that aren't the most recent column
		 *  non actionable items
		 *  items with a status type of Acknowledged or Resumed or Continued
		 *  items with an empty status type
		 *  non med items  
		 */
		var orderGroupEntity = orderGroupEntityList.get("order_group_" + actionEntity.order_group_id);
		if (OrdersLayout.isLastColumn(actionEntity.col_index) || $cell.parent().parent().hasClass("tbl-fxd-body-tr-grey") || 
				orderGroupEntity.most_recent_order_col_index !== actionEntity.col_index || actionEntity.actionable_ind !== 1 ||
				actionEntity.status_type === ACK_STATUS_FLAG || actionEntity.status_type === RESUME_STATUS_FLAG || 
				actionEntity.status_type === RX_CONTINUE_STATUS_FLAG || actionEntity.status_type === "" || actionEntity.med_ind !== 1) {
			return;	
		}

		$cell.toggleClass("cell-highlight");
	}
	
	return ({

		/**
		 * Initialize the ajax_request to load orders table
		 * @method initalizeOrders
		 * @param mdisp {Integer} Mnemonic display level
		 */
		setMnemDispLevel: function (mdisp) {
			mnem_disp_level = mdisp;
		},
		setTable: function (pTable, pTableHeader) {
			parentTable = pTable;
			tableHeader = pTableHeader.rows[0];
			tableSubHeader = pTableHeader.rows[1];
		},
		updateOrderableComment: function (e, textDOM, row_id, col_index) {
			GlobalAjaxCclHandler.append_text(" Entered updateOrderableComment");
			var orderable_id = row_id + "_" + col_index,
				curActionEntity = orderActionEntityList.get("" + row_id + col_index),
				search_index = OrderableDisplay.searchOrderableJson(orderable_id),
				curOrderable,
				keynum,
				keychar,
				numcheck;

			curActionEntity.order_comment =  textDOM.value;
			GlobalAjaxCclHandler.append_text(" textDOM.value  --- > " + textDOM.value);
			GlobalAjaxCclHandler.append_text(" orderable_id  --- > " + orderable_id);
			GlobalAjaxCclHandler.append_text(" search_index  --- > " + search_index);
			if (search_index >= 0) {
				curOrderable = orderableEntityList.ords[search_index];
				curOrderable.ord_comment = textDOM.value.encodeLineBreaks();
				orderableEntityList.ords[search_index] = curOrderable;
			}
			GlobalAjaxCclHandler.append_json(orderableEntityList);
			GlobalAjaxCclHandler.append_text(" Exited updateOrderableComment");
		},
		updateDetail: function (cur_ord_action_entity, detailMeaning, detailValue) {
			try {
				var rowNode = cur_ord_action_entity.row_obj,
					columnIndex = cur_ord_action_entity.col_index,
					orderCellNode = rowNode.cells[columnIndex],
					targetNode = null,
					nextNode;

				if (detailMeaning === "ORDER_NAME") {
					targetNode = Util.Style.g("orderable-name", orderCellNode);
					if (targetNode !== null && targetNode.length === 1) {
						targetNode[0].innerHTML = detailValue;
					}
				} else {
					switch (detailMeaning) {
					case "ORDER_DETAILS":
						targetNode = null;
						
						var detailsNode = Util.Style.g("orderable-details", orderCellNode)[0],							
							order_sentence = cur_ord_action_entity.order_sentence,
							order_sentence_element;
						// remove all child elements
						$(detailsNode).empty();
						if (order_sentence && _.isObject(order_sentence)) {
							order_sentence_element = order_sentence.getElement().get(0);
							if (detailsNode) {
								Util.ac(order_sentence_element, detailsNode);
							}
						} else {
							if (detailsNode) {
								detailsNode.innerHTML =  detailValue;
							}
						}
						
						break;
					case "ORDERING_PHYSICIAN":
						targetNode = Util.Style.g("ordering-physician", orderCellNode);
						break;
					case "ORDER_DT_TM":
						targetNode = Util.Style.g("order-dttm", orderCellNode);
						break;
					}
					
					if (targetNode !== null && targetNode.length === 1) {
						nextNode = Util.gns(targetNode[0]);
						if (detailValue === "" && targetNode[0].innerHTML > " ") {
							if (nextNode && nextNode.tagName.toUpperCase() === "BR") {
								Util.de(nextNode);
							}
						}

						if (detailValue > " " && targetNode[0].innerHTML === "") {
							if (nextNode && nextNode.tagName.toUpperCase() !== "BR") {
								nextNode = Util.ia(Util.ce("br"), targetNode[0]);
							}
						}
						targetNode[0].innerHTML = detailValue;
					}
				}
			} catch (e) {
				errorHandler(e, "updateDetail()");
			}
		},
		showDischDoc: function (Obj, tid) {
			var tObj = _g(tid);
			if (tObj.style.display === "none") {
				tObj.style.display = "inline";
				Obj.title = Obj.title.replace("view", "hide");
			} else {
				tObj.style.display = "none";
				Obj.title = Obj.title.replace("hide", "view");
			}
		},
		/*
		 expand_flag	:		
		 0 - Therapeutic Alternatives and Order Sentences
		 1 - Read Only Order Comments
		 2 - Order Sentences Only ( Default Open)
		 3 - Read/Write Order Comments
		 4 - Discontinue Reason (Default Open)

		 */
		showExpandDetails: function (dom_expand_icon, row_id, col_index, inpInd, expand_flag) {
			try {
				var cur_ord_action_entity = orderActionEntityList.get(row_id + col_index),
					cur_row = cur_ord_action_entity.row_obj,
					cur_detail_row = Util.gns(cur_row),
					cur_subcol_index = map_sub_cols[col_index],
					alt_meds = Util.ce("SPAN"),
					med_ordsnts = Util.cep("SPAN", {"className": "alt-ord-sents"}),
					dc_reasons = Util.ce("SPAN"),
					syns = cur_ord_action_entity.synonym_id,
					disch_doc,
					line_br = Util.ce("BR"),
					cur_cki,
					cclParam,
					fncParam,
					curIcon = dom_expand_icon.innerHTML;

				if (cur_detail_row.style.display === "none") {
					cur_detail_row.style.display = "";
					cur_cki = cur_ord_action_entity.cki;
					dom_expand_icon.title = dom_expand_icon.title.replace("show", "hide");
					if (curIcon.indexOf("img") === -1) {
						dom_expand_icon.innerHTML = "&#9660;";
					}
					
					if (expand_flag === 0 || expand_flag === 2) { // not expand_flag
						if (cur_detail_row.cells[col_index].innerHTML === "&nbsp;") { // empty box
							if (expand_flag === 0 || (expand_flag === 2 && cur_ord_action_entity.synonyms_cnt > 1)) {
								alt_meds = cur_detail_row.cells[col_index].appendChild(alt_meds); // Therapeutic Alternatives options
								cur_detail_row.cells[col_index].appendChild(line_br); // line break
								alt_meds.innerHTML = "<img  src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>";
							}
							med_ordsnts = cur_detail_row.cells[col_index].appendChild(med_ordsnts); // Order sentence options
							med_ordsnts.innerHTML = "<img  src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>";
							if (expand_flag === 0) {
								cclParam = '"MINE","' + criterion.encntr_id + '","' + cur_cki + '","' + syns + '","",' + inpInd + ',1,"' + criterion.prsnl_id + '","' + icons.root_path + '"';
								fncParam = [cur_row, col_index, alt_meds, med_ordsnts, "Therapeutic Alternatives", 1, inpInd, 1];
							} else {

								cclParam = '"MINE","' + criterion.encntr_id + '","' + cur_cki + '","' + syns + '",^' + cur_ord_action_entity.synonyms + 
											'^,' + inpInd + ',"' + criterion.prsnl_id + '","' + icons.root_path + '"';
								fncParam = [cur_row, col_index, alt_meds, med_ordsnts, "Therapeutic Alternatives", 1, inpInd, 0];
							}
							if (expand_flag === 0 || (expand_flag === 2 && cur_ord_action_entity.synonyms_cnt > 1)) {
								GlobalAjaxCclHandler.ajax_request({
									request: {
										type: "XMLCCLREQUEST",
										target: 'ADVSR_MEDS_REC_GET_ALT_SYN:dba',
										parameters: cclParam
									},
									response: {
										type: "JSON",
										target: loadTherapeuticAlternativesOrderSentences,
										parameters: fncParam
									}
								});
							}							
							if (col_index === totalColumns) {
								disch_doc = Util.ce("SPAN");
								cur_detail_row.cells[col_index].appendChild(Util.ce("BR"));
								disch_doc.innerHTML = "<img  id='disch-doc-icon-" + cur_row.id + "'  src=\"" + icons.root_path + icons.icon_folder_name + icons.editComment + 
														"\" class=\"img-medium\"  onclick=\"javascript:OrderableDisplay.showDischDoc(this,'disch-doc-" + cur_row.id + 
														"');\" title =\"Click to add/modify comments\"></img> <textarea id='disch-doc-" + cur_row.id + 
														"' style=\"display:none; width:100.0%;\" onkeyup = \"javascript:OrderableDisplay.updateOrderableComment(event,this,'" + row_id + 
														"'," + col_index + ")\" rows='4' ></textarea>";
								disch_doc = cur_detail_row.cells[col_index].appendChild(disch_doc); // Discharge documentation
								showOrderableComment(cur_ord_action_entity);
							}
						}
					} else {
						if (cur_detail_row.cells[col_index].innerHTML === "&nbsp;") {// empty box
							if (expand_flag === 4) {
								dc_reasons = cur_detail_row.cells[col_index].appendChild(dc_reasons); // Discontinue Reasons
								cur_detail_row.cells[col_index].appendChild(line_br); // line break
								dc_reasons.innerHTML += "<img  src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>";
							
								cclParam = '"MINE", 1309 ';
								fncParam = [cur_row, col_index, dc_reasons, "Discontinue reasons: "];
								
								GlobalAjaxCclHandler.ajax_request({
									request: {
										type: "XMLCCLREQUEST",
										target: 'MP_GET_CODESET:dba',
										parameters: cclParam
									},
									response: {
										type: "JSON",
										target: OrderableDisplay.loadDiscontinueReasons,
										parameters: fncParam
									}
								});
							} else { // Order Comment box
								disch_doc = Util.ce("SPAN");
								if (expand_flag === 3) {
									disch_doc.innerHTML = "<textarea id='disch-doc-" + cur_row.id + "' style=\"width:100.0%;\" onkeyup = \"javascript:OrderableDisplay.updateOrderableComment(event,this,'" + row_id + "'," + col_index + ")\" rows='4' ></textarea>";
								} else {
									disch_doc.innerHTML = "<textarea id='disch-doc-" + cur_row.id + "' style=\"width:100.0%;\" rows='4' readonly>" + cur_ord_action_entity.order_comment.split("<br/>").join("\n") + "</textarea>";
								}
								disch_doc = cur_detail_row.cells[col_index].appendChild(disch_doc);
								// Discharge documentation
							}
						}
					}
				} else { // hide details
					cur_detail_row.style.display = "none";
					if (curIcon.indexOf("img") === -1) {
						dom_expand_icon.innerHTML = "&#9658;";
					}
					dom_expand_icon.title = dom_expand_icon.title.replace("hide", "show");
				}

			} catch (e) {
				errorHandler(e, "showExpandDetails()");
			}
		},
		removeOrderable: function (action_entity, disch_flag) {
			return removeOrderable(action_entity, disch_flag);
		},
		getPreviousActionEntity: function (action_entity) {
			return getPreviousActionEntity(action_entity);
		},
		// populates the display used in the orderable hover tooltip
		getOrderDisplay: function (cur_action_entity) {
			var orderDisplay = "", simpleOrderDisplay = "", name = cur_action_entity.order_name, 
				ordas = cur_action_entity.order_as_mnemonic, hnamMnemonic = cur_action_entity.order_hna_mnemonic;
			if (parseInt(cur_action_entity.med_ind, 10) === 1) { // Medication
				hnamMnemonic = "<span class='order_hna_mnemonic' style=\"font-weight:bold;\">" + hnamMnemonic + "</span>";
				switch (mnem_disp_level) {
				case 0:
					orderDisplay = hnamMnemonic;
					simpleOrderDisplay = cur_action_entity.order_hna_mnemonic;
					break;
				case 1:
					orderDisplay = hnamMnemonic + "  " + ordas + "  ";
					simpleOrderDisplay = cur_action_entity.order_hna_mnemonic + "  " + ordas + "  ";
					break;
				case 2:
					orderDisplay = hnamMnemonic + "  " + ordas + " " + name + "  ";
					simpleOrderDisplay = cur_action_entity.order_hna_mnemonic + "  " + ordas + " " + name + "  ";
					break;
				case 3:
					orderDisplay = hnamMnemonic + "  " + name + "  ";
					simpleOrderDisplay = cur_action_entity.order_hna_mnemonic + "  " + name + "  ";
					break;
				}
			} else {
				orderDisplay = name;
			}
			cur_action_entity.full_order_display = simpleOrderDisplay;
			orderActionEntityList.put(cur_action_entity.hashmap_key, cur_action_entity);

			return ("<span class='order-name'>" + orderDisplay + "</span>");
		},
		addContextHandler: function (targetNode, currentActionEntity) {
			$(targetNode)
				.css("position", "relative")
				.bind("contextmenu", function (eventObject) {
					var $childSpan = $("<span>")
										.hover(function () {
											$(this).addClass("context-hover");
										}, function () {
											$(this).removeClass("context-hover");
										}),
										$rootElement = $("div.action-menu-content");
					
					if ($rootElement.length === 0) {
						$rootElement = $("<div>").addClass("action-menu-content");
					} else {
						$rootElement.trigger("mouseleave").children().remove();
					}
											
					
					OrderableDisplay.focusCell({
						"data": currentActionEntity
					});
					
					if (OrdersLayout.isLastColumn(currentActionEntity.col_index) && currentActionEntity.recon_order_action_mean !== "RECON_RESUME") {
						var $changeToNonRx = $childSpan.clone(true);
						$changeToNonRx
							.click(function () {
								MedRec.evalItemAction(currentActionEntity.hashmap_key, 6, 0);
							})
							.text("Change to non-prescription order")
							.appendTo($rootElement);
						$rootElement.append("<br/>");
					}
					
					$childSpan
						.text("Reset")
						.click(function () {
							MedRec.evalItemAction(currentActionEntity.hashmap_key, 0, 0);
						})
						.appendTo($rootElement);

					$rootElement
						.bind("mouseleave", function () {
							$(this).remove();
							OrderableDisplay.unfocusCell({
								"data": currentActionEntity
							});
						})
						.appendTo(targetNode)
						.css({
							"top": eventObject.offsetY - $rootElement.height() + 2,
							"left": eventObject.clientX - targetNode.offsetLeft - $rootElement.width() + 2
						});
				});
		},
		clearDisplay: function (currentActionEntity) {
			try {
				var columnIndex = currentActionEntity.col_index,
					$orderCell = $(currentActionEntity.row_obj.cells[columnIndex]),
					$orderDetailsCell = $(currentActionEntity.row_obj).next("tr").children().eq(columnIndex);
				// remove all classes, add the default class back and remove all child elements
				$orderCell.removeClass().addClass("tbl-fxd-body-tr-td-detail");
				$orderCell.unbind("contextmenu");
				$orderCell.children().remove();

				// remove classes from the detail cell and set the HTML to " "
				$orderDetailsCell.removeClass().addClass("tbl-fxd-body-tr-td-detail").html("&nbsp;");
				// set the detail row display to none
				$orderDetailsCell.parent().css("display", "none");
			} catch (err) {
				errorHandler(err, "clearDisplay()");
			}
		},
		buildOrderNameCell: function (cur_action_entity, InpatientInd, expandFlag) {
			var orderActionStr = [], dom_cur_row = cur_action_entity.row_obj, cur_col_index = cur_action_entity.col_index, name = cur_action_entity.order_name, ordas = cur_action_entity.order_as_mnemonic, hnamMnemonic = cur_action_entity.order_hna_mnemonic;
			orderActionStr.push("<span class='order-action-icon'>");
			if (expandFlag === -1) {
				orderActionStr.push("<span>");
			} else {
				orderActionStr.push("<span title='Click to show order detail' style='cursor:default;' class='order-toggler order-collapsed' onclick='javascript:OrderableDisplay.showExpandDetails(this,\"" + 
						dom_cur_row.id + "\"," + cur_col_index + "," + InpatientInd + "," + expandFlag + ")'>");
				if (expandFlag === 1) {
					orderActionStr.push("<img src=\"" + icons.root_path + icons.icon_folder_name + showCommentIcon + "\" class=\"img-medium\"  title =\"Click to show/hide comments\" /> ");
				} else if (expandFlag === 3) { // Discharge order without any checkbox
					orderActionStr.push("<img src=\"" + icons.root_path + icons.icon_folder_name + icons.editComment + "\" class=\"img-medium\"  title =\"Click to add/modify comments\" /> ");
				} else {
					orderActionStr.push("&#9658;");
				}
			}
			
			orderActionStr.push("</span>");
			orderActionStr.push("</span>");
			return ({
				"orderActionHTML": orderActionStr.join(""),
				"orderNameHTML": OrderableDisplay.getOrderDisplay(cur_action_entity)
			});
		},
		resetActionSelectors: function (actionEntity) {
			try {
				var $orderActionCell = $(actionEntity.row_obj.cells[actionEntity.col_index]).find(".order-name-actions");
				// remove existing selectors
				$orderActionCell.children().remove();
				
				// can take actions on this entity again
				actionEntity.actionable_ind = 1;
				
				// build and append new selectors
				$orderActionCell.append(OrderableDisplay.buildActionSelector(actionEntity));
			} catch (err) {
				errorHandler(err, "resetActionSelectors()");
			}
		},
		buildActionSelector: function (action_entity) {
			// highlight the cell
			toggleCellHighlight(action_entity);
			var actionWrapperNode = Util.cep("span", {
					"className": "order-name-action-wrapper"
				}),
				cur_ord_group_entity, 
				first_action_entity,
				HXNode,
				keepNode,
				modifyNode,
				stopNode,
				restartNode,
				keepIconTitle,
				modifyIconTitle,
				stopIconTitle,
				resumeIconTitle = Preferences.get("dischResumeTooltip"),
				acknowledgeIconTitle,
				restartIconTitle = Preferences.get("restartTooltip");
			
			// populate correct icon titles from preferences based on the column
			if (OrdersLayout.isPreAdmissionColumn(action_entity.col_index)) {
				keepIconTitle = Preferences.get("admissionKeepTooltip");
				modifyIconTitle = Preferences.get("admissionModifyTooltip");
				stopIconTitle = Preferences.get("admissionStopTooltip");
				acknowledgeIconTitle = Preferences.get("admissionAcknowledgeTooltip");
			} else if (OrdersLayout.isDischargeColumn(action_entity.col_index)) {
				keepIconTitle = Preferences.get("dischKeepTooltip");
				modifyIconTitle = Preferences.get("dischModifyTooltip");
				stopIconTitle = Preferences.get("dischStopTooltip");
			} else if (OrdersLayout.isInpatientColumn(action_entity.col_index)) {
				keepIconTitle = Preferences.get("transferKeepTooltip");
				modifyIconTitle = Preferences.get("transferModifyTooltip");
				stopIconTitle = Preferences.get("transferStopTooltip");
			}
			
			if (action_entity.status_type !== DC_STATUS_FLAG) { // not a stoppped order
				if (action_entity.col_index < totalColumns) { // other actions
					keepNode = Util.cep("span", {
						"className": "order-name-action-icons icon-active-keep",
						"title": keepIconTitle
					});
					modifyNode = Util.cep("span", {
						"className": "order-name-action-icons icon-active-modify",
						"title": modifyIconTitle
					});
					stopNode = Util.cep("span", {
						"className": "order-name-action-icons icon-active-stop",
						"title": stopIconTitle
					});
					
					Util.addEvent(keepNode, "click", function (e) {
						MedRec.evalItemAction(action_entity.hashmap_key, KEEP_ACTION_FLAG, 0);
					});
					Util.addEvent(modifyNode, "click", function (e) {
						MedRec.evalItemAction(action_entity.hashmap_key, MODIFY_ACTION_FLAG, 0);
					});
					Util.addEvent(stopNode, "click", function (e) {
						MedRec.evalItemAction(action_entity.hashmap_key, DISCONTINUE_ACTION_FLAG, 0);
					});
					
					// resume or acknowledge section
					//Add Resume from Hx for latest column Inpatient Meds with Pre-admit documented
					if (action_entity.order_group_id) {
						cur_ord_group_entity = orderGroupEntityList.get("order_group_" + action_entity.order_group_id);
						// For valid group with first order in pre-admit
						// adding action in pre-admit
						// with most recent order not discharged
						if (cur_ord_group_entity && cur_ord_group_entity.first_order_col_index === 0 && cur_ord_group_entity.most_recent_order_col_index < totalColumns) {
							// Get first order action entity in group
							first_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);							
							// Add resume or acknowledge action only if the home med order is not discontinued
							if(first_action_entity.status_type != DC_STATUS_FLAG ){
								// For pre-admit, add acknowledge option if order not acknowledged or resumed
								if (action_entity.col_index === 0 && action_entity.status_type !== ACK_STATUS_FLAG && action_entity.status_type !== RESUME_STATUS_FLAG) {
									HXNode = Util.cep("span", {
										"className": "order-name-action-icons active icon-active-acknowledge",
										"title": acknowledgeIconTitle
									});
									Util.addEvent(HXNode, "click", function (e) {
										MedRec.evalItemAction(action_entity.hashmap_key, ACK_ACTION_FLAG, 0);
									});
								} else {
										HXNode = Util.cep("span", {
											"className": "order-name-action-icons order-name-action-resume icon-active-resume",
											"title": resumeIconTitle
										});
										Util.addEvent(HXNode, "click", function (e) {
											MedRec.evalItemAction(action_entity.hashmap_key, RESUME_ACTION_FLAG, 0);
										});
								}
								// append element
								Util.ac(HXNode, actionWrapperNode);
							}
						}
					}

					Util.ac(keepNode, actionWrapperNode);
					Util.ac(modifyNode, actionWrapperNode);
					Util.ac(stopNode, actionWrapperNode);
				}
			} else {
				// append only if it's discontinued
				restartNode =  Util.cep("span", {
					"className": "order-name-action-icons icon-active-restart",
					"title": restartIconTitle
				});
				
				Util.addEvent(restartNode, "click", function (e) {
					MedRec.evalItemAction(action_entity.hashmap_key, RESTART_ACTION_FLAG, 0);
				});
				//Add Resume from Hx for latest column Inpatient Meds with Pre-admit documented
				if (action_entity.order_group_id) {
					cur_ord_group_entity = orderGroupEntityList.get("order_group_" + action_entity.order_group_id);
					// For valid group with first order in pre-admit
					// adding action in pre-admit
					// with most recent order not discharged
					if (cur_ord_group_entity && cur_ord_group_entity.first_order_col_index === 0 && cur_ord_group_entity.most_recent_order_col_index < totalColumns) {
						// Get first order action entity in group
						first_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);						
						// Add resume action only if the home med order is not discontinued
						if(first_action_entity.status_type != DC_STATUS_FLAG ){						
							HXNode = Util.cep("span", {
								"className": "order-name-action-icons order-name-action-resume icon-active-resume",
								"title": resumeIconTitle
							});
							Util.addEvent(HXNode, "click", function (e) {
								MedRec.evalItemAction(action_entity.hashmap_key, RESUME_ACTION_FLAG, 0);
							});
							// append element
							Util.ac(HXNode, actionWrapperNode);
						}
					}
				}
				Util.ac(restartNode, actionWrapperNode);
			}			
			return actionWrapperNode;
		},
		setHistoricalActionSelector: function (actionEntity) {
			try {
				var orderGroupEntity = orderGroupEntityList.get("order_group_" + actionEntity.order_group_id), 
					$orderActionWrapper = $(".order-name-action-wrapper", actionEntity.row_obj.cells[actionEntity.col_index]);
					
				var $cell = $(actionEntity.row_obj.cells[actionEntity.col_index]);

				
				$orderActionWrapper.children().remove();
				if (orderGroupEntity.hx_resume_ind === 1 && orderGroupEntity.most_recent_order_col_index === actionEntity.col_index) {
					actionEntity.status_type = RESUME_STATUS_FLAG;
				}
				switch (actionEntity.status_type) {
				case KEEP_STATUS_FLAG:
					$("<span>").addClass("icon-historical-keep").appendTo($orderActionWrapper);
					break;
				case MOD_STATUS_FLAG:
					$("<span>").addClass("icon-historical-modify").appendTo($orderActionWrapper);
					break;
				case DC_STATUS_FLAG:
					$("<span>").addClass("icon-historical-stop").appendTo($orderActionWrapper);
					break;
				case SUSP_STATUS_FLAG:
					$("<span>").addClass("icon-historical-stop").appendTo($orderActionWrapper);
					break;
				case RX_CONTINUE_STATUS_FLAG:
					$("<span>").addClass("icon-historical-resume").appendTo($orderActionWrapper);
					break;
				case RESUME_STATUS_FLAG:
					$("<span>").addClass("icon-historical-resume").appendTo($orderActionWrapper);
					break;
				}
				
				// remove cell highlighting
				$cell.removeClass("cell-highlight");
			} catch (err) {
				errorHandler(err, "setHistoricalActionsSelector()");
			}
		},
		setPreviousActionSelector: function (actionEntity, actionType) {
			try {
				var $orderActionWrapper = $(".order-name-action-wrapper", actionEntity.row_obj.cells[actionEntity.col_index]);
				// remove existing selectors
				$orderActionWrapper.children().remove();
				// remove cell highlighting
				toggleCellHighlight(actionEntity);
				switch (actionType) {
				case ACK_ACTION_FLAG:
					$("<span>").addClass("icon-active-acknowledge").click(function () {
						MedRec.evalItemAction(actionEntity.next_hashmap_key, 0, 0); // reset order
					}).appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-keep").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-modify").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-stop").appendTo($orderActionWrapper);
					break;
				case KEEP_ACTION_FLAG:
					if (OrdersLayout.isPreAdmissionColumn(actionEntity.col_index) && actionEntity.status_type !== ACK_STATUS_FLAG) {
						$("<span>").addClass("icon-inactive-acknowledge").appendTo($orderActionWrapper);
					}
					
					$("<span>").addClass("icon-active-keep").click(function () {
						MedRec.evalItemAction(actionEntity.next_hashmap_key, 0, 0); // reset order
					}).appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-modify").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-stop").appendTo($orderActionWrapper);
					break;
				case MODIFY_ACTION_FLAG:
					if (OrdersLayout.isPreAdmissionColumn(actionEntity.col_index) && actionEntity.status_type !== ACK_STATUS_FLAG) {
						$("<span>").addClass("icon-inactive-acknowledge").appendTo($orderActionWrapper);
					}
					
					$("<span>").addClass("icon-inactive-keep").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-active-modify").click(function () {
						MedRec.evalItemAction(actionEntity.next_hashmap_key, 0, 0); // reset order
					}).appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-stop").appendTo($orderActionWrapper);
					break;
				case DISCONTINUE_ACTION_FLAG:
					if (OrdersLayout.isPreAdmissionColumn(actionEntity.col_index) && actionEntity.status_type !== ACK_STATUS_FLAG) {
						$("<span>").addClass("icon-inactive-acknowledge").appendTo($orderActionWrapper);
					}
					
					$("<span>").addClass("icon-inactive-keep").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-modify").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-active-stop").click(function () {
						MedRec.evalItemAction(actionEntity.next_hashmap_key, 0, 0); // reset order
					}).appendTo($orderActionWrapper);
					break;
				case RESUME_ACTION_FLAG:
					$("<span>").addClass("icon-active-resume").click(function () {
							MedRec.evalItemAction(actionEntity.next_hashmap_key, 0, 0);
						}).appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-keep").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-modify").appendTo($orderActionWrapper);
					$("<span>").addClass("icon-inactive-stop").appendTo($orderActionWrapper);
					break;
				case RESTART_ACTION_FLAG:
					$("<span>").addClass("icon-active-keep").click(function () {
							MedRec.evalItemAction(actionEntity.next_hashmap_key, 0, 0);
						}).appendTo($orderActionWrapper);
					break;
				}
				// can no longer take action on this entity
				actionEntity.actionable_ind = 0;
			} catch (err) {
				errorHandler(err, "setPreviousActionSelector()");
			}
		},
		togglePreAdmitActionSelectors: function (action_entity) {
			try {
				// not null or undefined
				if (!(_.isUndefined(action_entity) || _.isNull(action_entity))) {
					var rowNode = action_entity.row_obj,
						columnIndex = action_entity.col_index,
						orderCellNode = rowNode.cells[columnIndex],
						actionSelecterWrapperNode = $(orderCellNode).find("order-name-action-wrapper"),
						toggleOption;
					if (actionSelecterWrapperNode.length === 1) {
						toggleOption = actionSelecterWrapperNode.hasClass(".show-preadmit-actions");
						if (!toggleOption) {
							$(".action-keep", actionSelecterWrapperNode).hide();
							$(".action-modify", actionSelecterWrapperNode).hide();
							$(".action-stop", actionSelecterWrapperNode).hide();
							actionSelecterWrapperNode.addClass(".show-preadmit-actions");
						} else {
							$(".action-keep", actionSelecterWrapperNode).show();
							$(".action-modify", actionSelecterWrapperNode).show();
							$(".action-stop", actionSelecterWrapperNode).show();
							actionSelecterWrapperNode.removeClass(".show-preadmit-actions");
						}
					}
				}
			} catch (e) {
				errorHandler(e, "togglePreAdmitActionSelectors()");
			}
		},
		toggleActionSelectors: function (action_entity, toggleOption) {
			try {
				if (!(_.isUndefined(action_entity) || _.isNull(action_entity))) {
					var rowNode = action_entity.row_obj,
						columnIndex = action_entity.col_index,
						orderCellNode = rowNode.cells[columnIndex],
						$actionSelecterWrapperNode = $(orderCellNode).find("order-name-action-wrapper");
					if ($actionSelecterWrapperNode.length > 0) {
						action_entity.actionable_ind = (toggleOption) ? 1 : 0;
					}
					orderActionEntityList.put(action_entity.hashmap_key, action_entity);
				}
			} catch (e) {
				errorHandler(e, "toggleActionSelectors()");
			}
		},
		addOrderDisplay: function (rowDOM, columnIndex, InpatientInd, expandFlag) {
			try {
				var curColumnLayout, curDisplayStr = "", currentNode, currentNode2,
					temptBodyNode, tempCellNode, tempRowNode, hnaMnemNode, content_str = [],
					c, layoutPrefs, cur_action_entity = orderActionEntityList.get(rowDOM.id + "" + columnIndex),
					medOrderInd = parseInt(cur_action_entity.med_ind, 10), oid = cur_action_entity.order_id, orderDisplayObject;
				
				// if display comment exists, show comment icon
				if (cur_action_entity.order_comment && cur_action_entity.order_comment > " ") {
					expandFlag = 1;
				}

				layoutPrefs = Preferences.get("layoutPreferences");
				switch (columnIndex) {
				case 0:
					curColumnLayout = layoutPrefs.PREADMIT[0];
					break;
				case totalColumns:
					curColumnLayout = layoutPrefs.DISCHARGE[0];
					break;
				default:
					curColumnLayout = layoutPrefs.INPATIENT[0];
					break;
				}
				if (medOrderInd === 0) {
					curColumnLayout = curColumnLayout.NON_MED_ORDERS[0];
				} else {
					curColumnLayout = curColumnLayout.MED_ORDERS[0];
				}
				rowDOM.cells[columnIndex].innerHTML = "";
				
				if (cur_action_entity.order_status_type === "NOT_CONTINUED_RX") {
					var stoppedIcon = $("<span class='order-not-continued-rx icon-active-stop' title='Order not converted to Rx. Click to enable actions on order'></span>").click(function (e) {
						prev_ord_action_entity = orderActionEntityList.get(cur_action_entity.parent_row_obj.id + cur_action_entity.prev_col_index);
						/* Enable Previous Order Action Selectors */
						OrderableDisplay.resetActionSelectors(prev_ord_action_entity);
						$(this).hide();
					});
					$(rowDOM.cells[columnIndex]).append(stoppedIcon);
				} else {				
					Util.Style.acss(rowDOM.cells[columnIndex], "order-cell");
					for (c = 0; c < curColumnLayout.COLUMNS.length; c++) {
						curDisplayStr = "";
						content_str = [];
						currentNode = null;
						switch (curColumnLayout.COLUMNS[c].MEANING) {
						case "ORDER_NAME":
							orderDisplayObject = OrderableDisplay.buildOrderNameCell(cur_action_entity, InpatientInd, expandFlag);
							currentNode = Util.cep("table", {
								"className": "order-name-table"
							});
							temptBodyNode = Util.ce("tbody");
							tempRowNode = Util.ce("tr");
							tempCellNode = Util.ce("td");
							tempCellNode.innerHTML = orderDisplayObject.orderActionHTML + "<span class='orderable-name'>" +
													cur_action_entity.order_as_mnemonic + "</span>";
							
							// For med orders use the simpleified display line
							if (cur_action_entity.med_ind === 1) {
								if (cur_action_entity.order_details > " ") {
									tempCellNode.innerHTML += "&nbsp;&nbsp;<span class='orderable-details'>" + cur_action_entity.order_details + "</span>";
								}
							} else { // For Non-med orders use the clinical display line
								if (cur_action_entity.clin_disp > " ") {
									tempCellNode.innerHTML += "&nbsp;&nbsp;<span class='orderable-details'>" + cur_action_entity.clin_disp + "</span>";
								}								
							}
							Util.ac(tempCellNode, tempRowNode);
							tempCellNode = Util.cep("td", {
								"className": "order-name-actions"
							});

							Util.ac(OrderableDisplay.buildActionSelector(cur_action_entity), tempCellNode);
							Util.ac(tempCellNode, tempRowNode);
							Util.ac(tempRowNode, temptBodyNode);
							Util.ac(temptBodyNode, currentNode);
							
							// hover information
							content_str.push("<div class='hvr-size-large'><span class='hvr-head'></span>");
							content_str.push("<table class=hvr-tab><tr><td class=hvr-label > Order: </td><td class=hvr-res>");
							content_str.push(orderDisplayObject.orderNameHTML);
							content_str.push("</td></tr>");
							content_str.push("<tr><td class=hvr-label >Order Details: </td><td class=hvr-res>");
							// For med orders use the simpleified display line
							if (cur_action_entity.med_ind === 1) {
								content_str.push(cur_action_entity.order_details);
							}
							// For Non-med orders use the clinical display line
							else {
								content_str.push(cur_action_entity.clin_disp);
							}
							content_str.push("</td></tr>");
							content_str.push("<tr><td class=hvr-label >Ordering Physician: </td><td class=hvr-res>");
							content_str.push(cur_action_entity.order_phy_name);
							content_str.push("</td></tr>");
							content_str.push("<tr><td class=hvr-label >Ordered Date/Time: </td><td class=hvr-res>");
							content_str.push(cur_action_entity.orig_ord_dt_tm);
							content_str.push("</td></tr>");
							
							// Preadmit column => display compliance
							if (columnIndex === 0) {
								if (cur_action_entity.compliance_status > " ") {
									content_str.push("<tr><td class=hvr-label >Compliance: </td><td class=hvr-res>");
									content_str.push(cur_action_entity.compliance_status);
									content_str.push("</td></tr>");
								}
								if (cur_action_entity.compliance_comment > " ") {
									content_str.push("<tr><td class=hvr-label >Compliance Comments: </td><td class=hvr-res>");
									content_str.push(cur_action_entity.compliance_comment);
									content_str.push("</td></tr>");
								}
							}
							
							// Display order status on all columns
							if (cur_action_entity.order_status_disp > " ") {
								content_str.push("<tr><td class=hvr-label >Order Status: </td><td class=hvr-res>");
								// display documented as ordered status for preadmit column
								if (columnIndex === 0 && cur_action_entity.order_status_disp.toUpperCase() === "ORDERED") {
									content_str.push("Documented");
								}
								// display prescribed as ordered status for discharge column
								else if (columnIndex === totalColumns && cur_action_entity.order_status_disp.toUpperCase() === "ORDERED") {
									content_str.push("Prescribed");
								}
								else {
									content_str.push(cur_action_entity.order_status_disp);
								}
								content_str.push("</td></tr>");
							}
							
							if (cur_action_entity.discontinue_reason && cur_action_entity.discontinue_reason > " ") {
								content_str.push("<tr><td class=hvr-label >Discontinued Reason: </td><td class=hvr-res>");
								content_str.push(cur_action_entity.discontinue_reason);
								content_str.push("</td></tr>");
							}

							content_str.push("</table></div>");

							hnaMnemNode = Util.Style.g('orderable-name', currentNode);
							if (hnaMnemNode.length === 1) {
								// Attach Hover
								UtilPopup.attachHover({
									"elementDOM": hnaMnemNode[0],
									"event": "mouseover",
									"offsets": [1, 1],
									"content": content_str.join(""),
									"displayTimeOut": 500
								});

							}
							break;
						case "ORDER_DETAILS":
							if (cur_action_entity.order_details > " ") {
								currentNode = Util.ce("span");
								currentNode.style.display = 'none';
								currentNode.innerHTML = cur_action_entity.order_details;
							}
							break;
						case "ORDERING_PHYSICIAN":
							if (cur_action_entity.order_phy_name > " ") {
								currentNode = Util.cep("span", {
									"id": 'ordering-physician-' + oid
								});
								currentNode.style.width  = "100.00%";
								currentNode.style.display = 'none';
								currentNode.innerHTML = "<span class='order-ordering-physician-label'>Ordering Physician: </span>" + cur_action_entity.order_phy_name;								
							}
							break;
						case "ORDER_DT_TM":
							if (cur_action_entity.orig_ord_dt_tm > " ") {
								currentNode = Util.ce("span");
								currentNode.style.display = 'none';
								currentNode.innerHTML = cur_action_entity.orig_ord_dt_tm;
							}
							break;
						}
	
						if (currentNode !== null) {
							currentNode = Util.ac(currentNode, rowDOM.cells[columnIndex]);
							// Add toggle method for acknowedged actions
							if (cur_action_entity.order_status_type === "ACKNOWLEDGED") {
								// hide selectors by default
								OrderableDisplay.togglePreAdmitActionSelectors(cur_action_entity);
								// add event
								var acknolwedgeAction = Util.Style.g("order-action-icon", rowDOM.cells[columnIndex]);
								if (acknolwedgeAction && acknolwedgeAction.length === 1) {
									acknolwedgeAction[0].style.cursor = "pointer";
									acknolwedgeAction[0].onclick = function (e) {
										OrderableDisplay.togglePreAdmitActionSelectors(cur_action_entity);
									};
								}
							}
						}
					}
				}
			} catch (e) {
				errorHandler(e, "addOrderDisplay()");
			}
		},
		buildPendingStatusMessage : function (actionType, actionMeaning) {
			var pendingCellNode = Util.cep("span", {
				"className": "order-name-pending-wrapper"
			});
			pendingCellNode.innerHTML = "Pending";
			return (pendingCellNode);
		},
		addOrderableDisplay: function (rowDOM, columnIndex, InpatientInd, actionableInd, expandFlag) {
			try {
				var curColumnLayout, c,
				cur_action_entity = orderActionEntityList.get(rowDOM.id + "" + columnIndex),
				medOrderInd = parseInt(cur_action_entity.med_ind, 10),
				orderExpandNode, pendingActionClassName = " ", layoutPrefs,
				content_str, orderFullNameDisplay, orderDisplayObject;

				layoutPrefs = Preferences.get("layoutPreferences");
				switch (columnIndex) {
				case 0:
					curColumnLayout = layoutPrefs.PREADMIT[0];
					break;
				case totalColumns:
					curColumnLayout = layoutPrefs.DISCHARGE[0];
					break;
				default:
					curColumnLayout = layoutPrefs.INPATIENT[0];
					break;
				}
				if (medOrderInd === 0) {
					curColumnLayout = curColumnLayout.NON_MED_ORDERS[0];
				} else {
					curColumnLayout = curColumnLayout.MED_ORDERS[0];
				}
				rowDOM.cells[columnIndex].innerHTML = "";

				Util.Style.acss(rowDOM.cells[columnIndex], "order-cell");
				for (c = 0; c < curColumnLayout.COLUMNS.length; c++) {
					curDisplayStr = "";
					content_str = [];
					currentNode = null;
					switch (curColumnLayout.COLUMNS[c].MEANING) {
					case "ORDER_NAME":
						orderDisplayObject = OrderableDisplay.buildOrderNameCell(cur_action_entity, InpatientInd, expandFlag);
						currentNode = Util.cep("table", {
							"className": "order-name-table"
						});
						currentNode.style.width = "100%";
						currentNode.style.tableLayout = "fixed";
						temptBodyNode = Util.ce("tbody");
						tempRowNode = Util.ce("tr");
						tempCellNode = Util.ce("td");
						tempCellNode.innerHTML = orderDisplayObject.orderActionHTML + "<span class='orderable-name'>" + 
													cur_action_entity.order_as_mnemonic + "</span>" +
													"&nbsp;&nbsp;<span class='orderable-details'></span>";
						
						tempCellNode = Util.ac(tempCellNode, tempRowNode);
				
						tempCellNode = Util.cep("td", {
							"className": "order-name-actions"
						});

						Util.ac(tempCellNode, tempRowNode);
						Util.ac(tempRowNode, temptBodyNode);
						Util.ac(temptBodyNode, currentNode);

						switch (cur_action_entity.action_type) {
						case KEEP_ACTION_FLAG:
							if (cur_action_entity.recon_order_action_mean === "RECON_RESUME") {
								pendingActionClassName = "order-name-pending-resume";
							} else {
								pendingActionClassName = "order-name-pending-keep";
							}
							break;
						case MODIFY_ACTION_FLAG:
							pendingActionClassName = "order-name-pending-modify";
							break;
						case DISCONTINUE_ACTION_FLAG:
							pendingActionClassName = "order-name-pending-stop";
							break;
						case RESTART_ACTION_FLAG:
							pendingActionClassName = "order-name-pending-restart";
							break;
						case ACK_ACTION_FLAG:
							pendingActionClassName = "order-name-pending-acknowledge";
							break;
						}

						tempCellNode = Util.cep("td", {
							"className": "order-name-pending " + pendingActionClassName
						});
						
						
						Util.ac(OrderableDisplay.buildPendingStatusMessage(cur_action_entity.action_type, cur_action_entity.recon_order_action_mean), tempCellNode);
						Util.ac(tempCellNode, tempRowNode);
						Util.ac(tempRowNode, temptBodyNode);
						Util.ac(temptBodyNode, currentNode);
						if (expandFlag === 0 || expandFlag === 2 || expandFlag === 4) { // Auto-expand indicator
							orderExpandNode = Util.Style.g("order-toggler", tempRowNode)[0];
							if (orderExpandNode && orderExpandNode.title.indexOf("show") >= 0) {
								orderExpandNode.onclick();
							}

						}
						break;
					case "ORDER_DETAILS":
						currentNode = null;							
						var detailsNode = Util.Style.g("orderable-details", rowDOM.cells[columnIndex])[0],							
							order_sentence = cur_action_entity.order_sentence,
							order_sentence_element;
						if (order_sentence && _.isObject(order_sentence)) {
							order_sentence_element = order_sentence.getElement().get(0);
							Util.ac(order_sentence_element, detailsNode);
						}
						else {
							detailsNode.innerHTML = cur_action_entity.order_details;
						}
						break;
					case "ORDERING_PHYSICIAN":
						if (cur_action_entity.order_phy_name && cur_action_entity.order_phy_name > " ") {
							currentNode = Util.ce("span");
							currentNode.innerHTML = cur_action_entity.order_phy_name;
						} else {
							currentNode = Util.ce("span");
							currentNode.innerHTML  = criterion.prsnl_name;
						}
						currentNode.style.display = 'none';
						currentNode.className = "ordering-physician";
						break;
					case "ORDER_DT_TM":
						currentNode = Util.ce("span");
						currentNode.className = "order-dttm";
						currentNode.innerHTML =  getCurDttmStr();
						break;
					}

					if (!(_.isNull(currentNode))) {
						currentNode = Util.ac(currentNode, rowDOM.cells[columnIndex]);
						
						// on a "pending" action, make sure the order-name-actions element takes up no space
						if (curColumnLayout.COLUMNS[c].MEANING === "ORDER_NAME") {
							var $node = $(tempCellNode).parent();
							$node.find(".order-name-actions").width(0);
							$node.find(".order-name-pending").width(40);
						}
						
						if (c > 0 && c < (curColumnLayout.COLUMNS.length - 1) && currentNode.innerHTML > " ") {
							Util.ac(Util.ce("br"), rowDOM.cells[columnIndex]);
						}
					}
				}
				if (actionableInd > -1) {
					OrderableDisplay.addContextHandler(rowDOM.cells[columnIndex], cur_action_entity);
				}
			} catch (e) {
				errorHandler(e, "addOrderableDisplay()");
			}
		},
		addOrderableJson: function (cur_ord_action_entity) {
			try {
				var ord_json_obj = OrderableDisplay.createOrderable(cur_ord_action_entity);
				OrderableDisplay.InsertOrderableJson(ord_json_obj);
				// Validate if any pending orderables exist
				OrderableDisplay.validatePendingData();
			} catch (e) {
				errorHandler(e, "OrderableDisplay.addOrderableJson()");
			}

		},
		createOrderable: function (cur_ord_action_entity) {
			var ord_json_obj = new OrderableEntity();
			ord_json_obj.parent_order_id = parseInt(cur_ord_action_entity.order_id, 10) + ".0";
			ord_json_obj.recon_order_action_mean = cur_ord_action_entity.recon_order_action_mean;
			ord_json_obj.search_id = cur_ord_action_entity.row_obj.id + "_" + (cur_ord_action_entity.col_index); // search id to track orderables in json
			ord_json_obj.opt_sel = cur_ord_action_entity.action_type; // 1 - Keep, 2- Modify, 3-Stop, 4-Restart
			ord_json_obj.col_index = cur_ord_action_entity.col_index; // location number
			ord_json_obj.prev_col_index = cur_ord_action_entity.prev_col_index; // previous location number
			ord_json_obj.row_id = cur_ord_action_entity.row_obj.id;
			ord_json_obj.parent_row_id = cur_ord_action_entity.parent_row_obj.id;
			ord_json_obj.ord_name = cur_ord_action_entity.order_name;
			ord_json_obj.ord_cki = cur_ord_action_entity.cki;
			ord_json_obj.ord_cat_cd = cur_ord_action_entity.catalog_cd;
			ord_json_obj.ord_syn_id = parseInt(cur_ord_action_entity.synonym_id, 10);
			ord_json_obj.ord_snt_id = parseInt(cur_ord_action_entity.sentence_id, 10);
			ord_json_obj.ord_snt_disp = cur_ord_action_entity.order_details;
			ord_json_obj.mltm_cat_id = cur_ord_action_entity.mltm_cat_id;
			ord_json_obj.ord_comment = cur_ord_action_entity.order_comment;
			ord_json_obj.status_type = cur_ord_action_entity.status_type;
			ord_json_obj.dc_reason_cd = cur_ord_action_entity.dc_reason_cd;
			ord_json_obj.parent_group_id = cur_ord_action_entity.order_group_id;

			if (cur_ord_action_entity.parent_clin_disp) {
				ord_json_obj.parent_clin_disp = cur_ord_action_entity.parent_clin_disp.split('"').join("'");
			}
			if (cur_ord_action_entity.parent_simp_disp) {
				ord_json_obj.parent_simp_disp = cur_ord_action_entity.parent_simp_disp.split('"').join("'");
			}
			if (cur_ord_action_entity.parent_mnemonic) {
				ord_json_obj.parent_mnemonic = cur_ord_action_entity.parent_mnemonic.split('"').join("'");
			}
			ord_json_obj.parent_syn_id = cur_ord_action_entity.parent_syn_id;
			ord_json_obj.parent_snt_id = cur_ord_action_entity.parent_snt_id;
			return ord_json_obj;
		},
		searchOrderableJson: function (search_id) {
			try {
				var json_cntr = 0;
				while (json_cntr < orderableEntityList.ords.length) {
					if (orderableEntityList.ords[json_cntr] && orderableEntityList.ords[json_cntr].search_id === search_id) {
						return json_cntr;
					} else {
						json_cntr++;
					}
				}
				return -1;
			} catch (e) {
				errorHandler(e, "OrderableDisplay.searchOrderableJson()");
				return -1;
			}
		},
		InsertOrderableJson: function (Obj) {
			try {
				var insert_index = OrderableDisplay.searchOrderableJson(Obj.search_id);
				if (insert_index > -1) {
					orderableEntityList.ords.splice(insert_index, 1);
					orderableEntityList.ord_cnt--;
				}
				orderableEntityList.ords.push(Obj);
				orderableEntityList.ord_cnt++;
				GlobalAjaxCclHandler.append_json(orderableEntityList);
			} catch (e) {
				errorHandler(e, "OrderableDisplay.InsertOrderableJson()");
				return -1;
			}
		},
		validatePendingData: function () {
			try {
				if (!(_.isNull(objPVFrmwkLink))) {
					if (orderableEntityList.ord_cnt === 0) {
						objPVFrmwkLink.SetPendingData(0);
					} else {
						objPVFrmwkLink.SetPendingData(1);
					}
				}
			} catch (e) {
			}
		},
		removeOrderableJson: function (search_id) {
			try {
				var insert_index = OrderableDisplay.searchOrderableJson(search_id), signOrderables;
				if (insert_index > -1) {
					orderableEntityList.ords.splice(insert_index, 1);
					orderableEntityList.ord_cnt--;
					GlobalAjaxCclHandler.append_json(orderableEntityList);
					// Validate if any pending orderables exist
					OrderableDisplay.validatePendingData();
				}

			} catch (e) {
				errorHandler(e, "OrderableDisplay.removeOrderableJson()");
				return -1;
			}
		},
		focusCell : function (event) {
			var cur_ord_action_entity = event.data,
				rowNode = cur_ord_action_entity.row_obj,
				cellNode = rowNode.cells[cur_ord_action_entity.col_index],
				detailNode = Util.gns(rowNode).cells[cur_ord_action_entity.col_index];				
			$(cellNode).addClass("action-menu-row-select");
			$(detailNode).addClass("action-menu-row-select");
			$(cellNode).zIndex(1);
		},
		unfocusCell : function (event) {
			var cur_ord_action_entity = event.data;
			var rowNode = cur_ord_action_entity.row_obj,
				cellNode = rowNode.cells[cur_ord_action_entity.col_index],
				detailNode = Util.gns(rowNode).cells[cur_ord_action_entity.col_index];		
			$(cellNode).removeClass("action-menu-row-select");
			$(detailNode).removeClass("action-menu-row-select");
			$(cellNode).zIndex(0);
		},
		removeOrderSentence: function (cur_ord_action_entity) {
			// Remove current order sentence if any
			if (cur_ord_action_entity.order_sentence) {
				cur_ord_action_entity.order_sentence.remove();
				delete cur_ord_action_entity.order_sentence;
			}
		},
		loadDiscontinueReasons: loadDiscontinueReasons 
	});
}());/**
 * @author RB018070
*/
var OrderActionEntity = function () {
	return {
		order_id: "",
		order_name: "",
		order_phy_name : "",
		order_as_mnemonic: "",
		order_hna_mnemonic: "",
		full_order_display: "",
		order_comment: "",
		clin_disp: "",
		order_group_id: "",
		recon_order_action_mean: "",
		cki: "",
		catalog_cd: "",
		mltm_cat_id: "",
		dc_reason_cd: 0,
		synonyms: "",
		synonyms_cnt: "",
		synonym_id: "",
		sentence_id: "",
		order_details: "",
		order_prsnl_id: "",
		orig_ord_dt_tm: "",
		last_dose_dt_tm: "",
		compliance_status: "",
		compliance_information_source: "",
		compliance_comment: "",
		obj_search_id: "",
		parent_row_obj: "",
		row_obj: "",
		prev_col_index: "",
		col_index: "",
		next_col_index: "",
		hashmap_key: "",
		next_hashmap_key: "",
		json_index: "",
		prev_action_type: "",
		action_type: "",
		status_type: "",
		parent_clin_disp: "",
		parent_simp_disp: "",
		parent_syn_id: "",
		parent_snt_id: "",
		parent_mnemonic: "",
		actionable_ind: "",
		excl_ind: "",
		med_ind: "",
		pharmacy_iv_ind: "",
		multi_sentence_ind: 0,
		multi_sentences: "",
		order_status_type: "",
		previous_action_entity_id: "",
		order_ind: "",
		dc_reason_disp: ""
	};
};

/**
 * @author RB018070
*/

var Preferences = (function () {
	var PreferenceData = {
		"discontinuedDays": 10,
		"defaultSortOrder": 1,
		"selectAll": 0,
		"selectAllMedsAndOrders": 0,
		"mnem_disp_level": 0,
		"rootDepartmentFolder": "",
		"preAdmitCancelReasonCd": 0,
		"preAdmitCancelReasonDisp": "",
		"preAdmitHxButton": "Doc Hx",
		"preAdmitRecButton": "Recon",
		"curLocPlanButton": "Cur Loc Plan",
		"curLocFavButton": "Cur Loc Favs",
		"curLocOrdButton": "Cur Loc Ord",
		"dischPlanButton": "Disch Plan",
		"dischFavButton": "Disch Ord",
		"dischOrdButton": "Disch Fav",
		"dischKeepTooltip": "Click to Keep",
		"dischModifyTooltip": "Click to Modify",
		"dischStopTooltip": "Click to Stop",
		"dischResumeTooltip": "Click to Resume from Hx",
		"transferKeepTooltip": "Click to Keep",
		"transferModifyTooltip": "Click to Modify",
		"transferStopTooltip": "Click to Stop",
		"admissionAcknowledgeTooltip": "Click to Acknowledge",
		"admissionKeepTooltip": "Click to Keep",
		"admissionModifyTooltip": "Click to Modify",
		"admissionStopTooltip": "Click to Stop",
		"restartTooltip": "Click to Restart",
		"resumeAllTooltip": "Click to Resume All from Hx",
		"printIconIndicator": true,
		"titleDisplay": ""
	};
	
	return {
		setAll: function (newPreferences) {
			PreferenceData = newPreferences;
		},
		getAll: function () {
			return PreferenceData;
		},
		set: function (preferenceName, preferenceValue) {
			PreferenceData[preferenceName] = preferenceValue;
		},
		get: function (preferenceName) {
			var preferenceValue = PreferenceData[preferenceName];
			return preferenceValue;
		}		
	};
})();
/**
 * @author JL026366
 * @dependencies jQuery, doT
 * originally written by PU025737 for transfer reconciliation mpage
 */
var ProviderSelectionModule = (function ($, doT, _) {
	var cache = [];
	/**
	* "Last" returns { lastName: "Last", firstName: "" }
	* "First Last" returns { lastName: "Last", firstName: "First" }
	* "Last, First" returns { lastName: "Last", firstName: "First" }
	*/
	function getFirstAndLastName (val) {
		var nameObj, index = val.indexOf(",", 1) + 1 || val.indexOf(" ", 1) + 1;
		index = index - 1;

		if (val.indexOf(",", 1) > 0) {
			nameObj = {
				lastName: val.slice(0, index),
				firstName: val.slice(index + 1)
			};
		} else if (val.indexOf(" ", 1) > 0) {
			nameObj = {
				lastName: val.slice(index),
				firstName: val.slice(0, index)
			};
		} else {
			nameObj = {
				lastName: val,
				firstName: ""
			};
		}

		return nameObj;
	};

	function autocompleteSource (request, response) {
		var names = getFirstAndLastName(request.term);
		var cclParams = ["'MINE'", criterion.prsnl_id, '"' + names.lastName + '"', '"' + names.firstName + '"', 10, 0].join(",");
		AjaxHandler.ajax_request({
			request: {
				type: "XMLCCLREQUEST",
				target: 'MP_GET_PRSNL_JSON',
				parameters: cclParams
			},
			response: {
				type: "JSON",
				target: function (scriptResponse) {	
					cache = scriptResponse.response.RECORD_DATA.PRSNL;
					response(_.pluck(scriptResponse.response.RECORD_DATA.PRSNL, 'NAME_FULL_FORMATTED'));
				}
			}
		});
	};


	return {
		launch: function () {
			var dialogDisplayData = {
				headerDisplay: "Reconciliation Provider",
				sectionDisplay: "Please select the provider responsible for reconciling these orders",
				labelDisplay: "Provider Name: "
			};
			
			var $modalTemplate = $(doT.template($("#ProviderSelectTemplate").html())(dialogDisplayData));
			$modalTemplate.dialog({
				width: 400,
				height: 300,
				modal: true,
				buttons: {
					"Ok": function () {
						// check privs here????
						MedRec.reconcileOrderables();
						$(this).dialog("destroy").remove();
					},
					"Cancel": function () {
						$(this).dialog("destroy").remove();
						$("#ProviderDialog").parent().remove();
					}
				},
				close: function (event, ui) {
					// ensure widget is removed from the DOM
					// when the 'x' button is clicked
					$(this).dialog("destroy").remove();
					$("#ProviderDialog").parent().remove();
				}
			});

			$("#providerSearch").autocomplete({
				minLength: 2,
				source: autocompleteSource,
				select: function (event, ui) {
					var ordering_personnel = _.find(cache, function (person) {
						return person.NAME_FULL_FORMATTED === ui.item.value;
					});
					criterion.ordering_personnel_id = ordering_personnel.PERSON_ID;
				}
			});
		},
		"getFirstAndLastName": getFirstAndLastName
	};
})(jQuery, doT, _);/**
 * @author RB018070
 */

var UtilSort = (function () {
	return {
		jsonTableSort: function (sortPrefs) {
			var parentTable = sortPrefs.parentTable,
				jsonList = sortPrefs.jsonList,
				idAttr	= sortPrefs.idAttr,
				curElement,
				tableChildNodes,
				curJSONObject,
				cntr = 0,
				len;
			
			for (cntr = 0, len = jsonList.length; cntr < len; cntr++) {
				curJSONObject = jsonList[cntr];
				curElement = _g(curJSONObject[idAttr]);
				if (curJSONObject && curElement) {
					curElement = Util.ac(curElement, parentTable);	
				}
			}														
		}
	};
})();


function SortIt(TheArr, us, u, vs, v, ws, w, xs, x, ys, y, zs, z) {
    // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
	function Sortsingle(a, b) {
        var swap = 0;
        if (isNaN(a - b)) {
            if ((isNaN(a)) && (isNaN(b))) {
                swap = (b < a) - (a < b);
            }
            else {
                swap = (isNaN(a) ? 1 : -1);
            }
        }
        else {
            swap = (a - b);
        }
        return swap * us;
    }
	
	function Sortmulti(a, b) {
        var swap = 0;
        if (isNaN(a[u] - b[u])) {
            if ((isNaN(a[u])) && (isNaN(b[u]))) {
                swap = (b[u] < a[u]) - (a[u] < b[u]);
            }
            else {
                swap = (isNaN(a[u]) ? 1 : -1);
            }
        }
        else {
            swap = (a[u] - b[u]);
        }
        if ((v === undefined) || (swap !== 0)) {
            return swap * us;
        }
        else {
            if (isNaN(a[v] - b[v])) {
                if ((isNaN(a[v])) && (isNaN(b[v]))) {
                    swap = (b[v] < a[v]) - (a[v] < b[v]);
                }
                else {
                    swap = (isNaN(a[v]) ? 1 : -1);
                }
            }
            else {
                swap = (a[v] - b[v]);
            }
            if ((w === undefined) || (swap !== 0)) {
                return swap * vs;
            }
            else {
                if (isNaN(a[w] - b[w])) {
                    if ((isNaN(a[w])) && (isNaN(b[w]))) {
                        swap = (b[w] < a[w]) - (a[w] < b[w]);
                    }
                    else {
                        swap = (isNaN(a[w]) ? 1 : -1);
                    }
                }
                else {
                    swap = (a[w] - b[w]);
                }
                if ((x === undefined) || (swap !== 0)) {
                    return swap * ws;
                }
                else {
                    if (isNaN(a[x] - b[x])) {
                        if ((isNaN(a[x])) && (isNaN(b[x]))) {
                            swap = (b[x] < a[x]) - (a[x] < b[x]);
                        }
                        else {
                            swap = (isNaN(a[x]) ? 1 : -1);
                        }
                    }
                    else {
                        swap = (a[x] - b[x]);
                    }
                    if ((y === undefined) || (swap !== 0)) {
                        return swap * xs;
                    }
                    else {
                        if (isNaN(a[y] - b[y])) {
                            if ((isNaN(a[y])) && (isNaN(b[y]))) {
                                swap = (b[y] < a[y]) - (a[y] < b[y]);
                            }
                            else {
                                swap = (isNaN(a[y]) ? 1 : -1);
                            }
                        }
                        else {
                            swap = (a[y] - b[y]);
                        }
                        if ((z === undefined) || (swap !== 0)) {
                            return swap * ys;
                        }
                        else {
                            if (isNaN(a[z] - b[z])) {
                                if ((isNaN(a[z])) && (isNaN(b[z]))) {
                                    swap = (b[z] < a[z]) - (a[z] < b[z]);
                                }
                                else {
                                    swap = (isNaN(a[z]) ? 1 : -1);
                                }
                            }
                            else {
                                swap = (a[z] - b[z]);
                            }
                            return swap * zs;
                        }
                    }
                }
            }
        }
    }
	
    if (u === undefined) {
        TheArr.sort(Sortsingle);
    } // if this is a simple array, not multi-dimensional, ie, SortIt(TheArr,1): ascending.
    else {
        TheArr.sort(Sortmulti);
    }
    return TheArr;
}
/**
 * @author RB018070
 */

var TableColumn = (function () {
	
	/* Function: selectTableColumn
	 * Purpose: selects the column with cur_tab as the tab link
	 * Parameters: (tabs_list) - Tabs list object containing the selected and  locked tabs
	 *				(cur_tab) - Reference to the current tab object
	 * Returns: None
	 */
	selectTableColumn = function (tabs_list, cur_tab) {
		cur_tab.tabelmIndex = parseInt(cur_tab.tabelmIndex, 10);
		if (!tabs_list.selectedTabs.contains(cur_tab.tabelmIndex)) { // not a clicked tab
			if (tabs_list.lockedTabs.length < 3) {
				var cntr = 0, hide_col_index;
				while (cntr < tabs_list.selectedTabs.length) {
					if (!tabs_list.lockedTabs.contains(tabs_list.selectedTabs[cntr])) {
						break;
					} else {
						cntr++;
					}
				}
				tabs_list.tabHide(tabs_list.selectedTabs[cntr]);
				OrderGroup.toggleTableColumnDisplay(tabs_list.selectedTabs[cntr], "none");
				hide_col_index = tabs_list.selectedTabs[cntr];
				tabs_list.selectedTabs[cntr] = cur_tab.tabelmIndex;// replace the previous with current selected column
				tabs_list.tabShow(cur_tab.tabelmIndex);
				OrderGroup.toggleTableColumnDisplay(cur_tab.tabelmIndex, "");
			} else {
				alert("All 3 columns are locked, unlock atleast one column to select a new column.");
			}
		}
	};
	
	return {
	
		/* Function: initializeLocks
		 * Purpose: Initializes the locked columns to Pre-admission, Current location and Discharge columns
		 * Parameters: None
		 * Returns: None
		 */
		initializeLocks: function () {
			locs_tabs_list = tabelmAutomatic({});
			if (locs_tabs_list) {
				locs_tabs_list.tabHideAll();
				locs_tabs_list.lockedTabs = [];
				locs_tabs_list.selectedTabs = [];
				_.each(locs_tabs_list.tabs, function (element) {
					$(element).click(function (event) {
						selectTableColumn(locs_tabs_list, this);
					});
				});
			}
		},
		setCssClassTableColumn: function (dom_row, col_index, css_class) {
			try {
				var cellNode = dom_row.cells[col_index], childNodes = Util.gcs(cellNode), currentChildNode, cntr, len = childNodes.length;			
				$(cellNode).addClass(css_class);
				
				for (cntr = 0; cntr < len; cntr++) {
					currentChildNode = childNodes[cntr];
					$(currentChildNode).addClass(css_class);
				}
			} catch (e) {
				errorHandler(e, "TableColumn.setCssClassTableColumn()");
			}
		},
		
		/* Function: UpdtTextPreadmit
		 * Purpose: Sets the display in Pre-admission column if " Not able to obtain" is checked when no medications are found
		 * Parameters:
		 * Returns: None
		 */
		UpdtTextPreadmit: function (checkedEl) {
			var nokhxmeds = _g("nokhxmeds"), nohxmeds = _g("nohxmeds"), uselastcomp = _g("uselastcomp");
			$("#no_pre_meds_div").find(".sel-compl").each(function (selIndex, selCompl) {
				var selEl = selCompl;
				if (selEl !== checkedEl && !Util.Style.ccss(selEl, "sel-disabled")) {
					selEl.checked = false;
					selEl.disabled = checkedEl.checked;
				}
			});
			// reset values
			ordersComplianceList.unable_to_obtain_ind = 0;
			ordersComplianceList.no_known_home_meds_ind = 0;
			ordersComplianceList.encntr_compliance_status_flag = 1;
			_g("no_pre_meds").innerHTML = "Patient has no documented pre-admission medications.";
			
			if (nohxmeds.checked || nokhxmeds.checked) {
				if (nohxmeds.checked) {
					ordersComplianceList.unable_to_obtain_ind = 1;
					_g("no_pre_meds").innerHTML = "Unable To Obtain Information.";
				} else if (nokhxmeds.checked) {
					ordersComplianceList.no_known_home_meds_ind = 1;
					_g("no_pre_meds").innerHTML = "No Known Home Medications.";
				}
			}
			// use last compliance
			else if (uselastcomp.checked) {
				ordersComplianceList.unable_to_obtain_ind = 0;
				ordersComplianceList.no_known_home_meds_ind = 0;
				ordersComplianceList.encntr_compliance_status_flag = 0;
				_g("no_pre_meds").innerHTML = "Use Last Compliance.";
			}
			GlobalAjaxCclHandler.append_json(ordersComplianceList);
		}
	};

})();function adjustStyle(width) {
	width = parseInt(width);
	if (width < 901) {
		$("#size-stylesheet").attr("href", "..\\css\\advsr_meds_rec.low-res.all.css");
	} else {
		$("#size-stylesheet").attr("href", "..\\css\\advsr_meds_rec.high-res.all.css"); 
	}
}

$(function () {
	adjustStyle($(this).width());
	$(window).resize(function () {
		adjustStyle($(this).width());
	});
});

var Windowstorage = (function () {
	return {
		cache: null,
		get: function (key) {
			if (window.name.length > 0) {
				this.cache = eval("(" + window.name + ")");
			} else {
				this.cache = {};
			}
			return unescape(this.cache[key]);
		},
		encodeString: function (value) {
			return encodeURIComponent(value).replace(/'/g, "'");
		},
		set: function (key, value) {
			this.get();
			if (typeof key != "undefined" && typeof value != "undefined" && typeof value != "function") {
				this.cache[key] = value;
			}
			var jsonString = "{";
			var itemCount = 0;
			for (var item in this.cache) {
				if (item != 'clone') {
					if (itemCount > 0) {
						jsonString += ", ";
					}
					jsonString += "'" + this.encodeString(item) + "':'" + this.encodeString(this.cache[item]) + "'";
					itemCount++;
				}
			}
			jsonString += "}";
			window.name = jsonString;
		},
		del: function (key) {
			this.get();
			delete this.cache[key];
			this.serialize(this.cache);
		},
		clear: function () {
			window.name = "";
		}
	};
}());

var actionSelect = {
	"selectedIndex": 0
};

var OrderComplianceEntity = function () {
	return {
		order_nbr: "",
		last_occurred_dt_only_ind: "",
		last_occurred_dt_tm: ""
	};
};

var GlobalAjaxCclHandler;

var map_sub_cols = [];

var criterion = {};

var ordersComplianceList,
	ordersEntityList,
	orderableEntityList,
	orderableEntityUndoList,
	orderActionEntityList,
	orderGroupEntityList,
	locs_tabs_list,
	orders_table,
	meds_table,
	meds_hdr_table = null,
	med_collapsible_hdr = null,
	non_med_collapsible_hdr = null,
	non_meds_hdr_table,
	totalColumns,
	med_hdr_row,
	non_med_hdr_row,
	cur_dttm,
	dttmInputText,
	
	KEEP_STATUS_FLAG = 1,
	MOD_STATUS_FLAG = 2,
	DC_STATUS_FLAG = 3,
	ACK_STATUS_FLAG = 4,
	SUSP_STATUS_FLAG = 5,
	RX_CONTINUE_STATUS_FLAG = 6,
	RESUME_STATUS_FLAG = 7,
	RX_DO_NOT_CNVT_FLAG = 8,
	
	KEEP_ACTION_FLAG = 1,
	MODIFY_ACTION_FLAG = 2,
	DISCONTINUE_ACTION_FLAG = 3,
	RESTART_ACTION_FLAG = 4,
	RESUME_ACTION_FLAG = 5,
	CONTINUE_AS_NON_RX_ACTION_FLAG = 6,
	ACK_ACTION_FLAG = 7,
	
	NOT_STARTED_RECON_STATUS_FLAG = 0,
	COMPLETE_RECON_STATUS_FLAG = 1,
	PARTIAL_RECON_STATUS_FLAG = 2;

var MedRec = (function () {
	var debug_mode_ind,
		img_loader,
		cnt_medrows = 0,
		preInd = 0,
		preAdmitPrevEncntrInd = 0,
		active_entity_count = 0,
		stopped_ord_count = 0,
		med_count = 0,
		non_med_count = 0,
		done_ord_recon  = false,
		done_ord_comments = false,
		active_select_all = null,
		done_ord_compliance = false,
		ONE_DAY = 1000 * 60 * 60 * 24,
		cur_dt_tm = new Date(),
		orderReconciliations = [],
		orderComments = [],
		MPAGES_API_ROOT = window.external,
		MOEWType = "SILENT_MOEW",
		stackMessages = {},
		actionsSize = 0;
	
	function convertFloat(number) {
		return (String(parseInt(number, 10)) + ".000");
	}
	
	function getTotalGroupHeight(groupName) {
		var groupNodes = Util.Style.g(groupName, orders_table),
			g_size = groupNodes.length,
			totalGroupHeight = 0;
		for (var g_cntr = 0; g_cntr < g_size; g_cntr++) {
			totalGroupHeight += groupNodes[g_cntr].offsetHeight;
		}
		return totalGroupHeight;
	}
	
	function getLastGroupNode(groupName) {
		var groupNodes = Util.Style.g(groupName, orders_table),
			g_size = groupNodes.length;
		return (groupNodes[g_size - 1]);
	}

	function resizePage() {
		var detailDOM = _g("div_tbl_outer"),
			hdrRow1DOM = _g("hdr_row_1"),
//			hdrRow2DOM = _g("hdr_row_2"),
//			hdrRow3DOM = _g("hdr_row_3"),
			hdrRow4DOM = _g("hdr_row_4"),
		//ftrRowDOM = _g("ftr_row"),
		advsr_tbl = _g("advsr_tbl");
		if (advsr_tbl !== null) {
			var vs = Util.Pos.gvs(),
			screenHeight = vs[0];
			advsr_tbl.style.width = (vs[1]) + "px";
			detailDOM.style.height = (screenHeight - (hdrRow1DOM.offsetHeight + hdrRow4DOM.offsetHeight)) + "px";
		}
	}

	
	function init(xmlCCLResponse) {
		try {
			var jsonData = xmlCCLResponse.response.INITREC;
			initializePreferences(jsonData);
			fillPatientBanner(jsonData);
			
			GlobalAjaxCclHandler.trim_float_zeros(true);
			initalizeOrders();
		} catch (err) {
			errorHandler(err, "init()");
		}
	}
	
	// initializes the preferences object and criterion's person and prsnl names
	function initializePreferences(jsonData) {
		try {
			criterion.prsnl_name = jsonData.PRSNLNAME;
			criterion.person_name = jsonData.PERSONNAME;
			Preferences.set("selectAll", parseInt(jsonData.SELECTALLIND, 10));
			Preferences.set("selectAllMedsAndOrders", parseInt(jsonData.SELECTALLMEDSIND, 10));
			Preferences.set("discontinuedDays", parseInt(jsonData.DCLOOKBACKDAYS, 10));
			Preferences.set("defaultSortOrder", parseInt(jsonData.DEFAULTSORTORDER, 10));
			Preferences.set("preAdmitCancelReasonCd", jsonData.PREADMITCANCELDCREASONCD || 0);
			Preferences.set("preAdmitCancelReasonDisp", jsonData.PREADMITCANCELDCREASON);
			Preferences.set("preAdmitHxButton", jsonData.PREADMITHXBUTTON);
			Preferences.set("preAdmitRecButton", jsonData.PREADMITRECBUTTON);
			Preferences.set("curLocPlanButton", jsonData.CURLOCPLANBUTTON);
			Preferences.set("curLocFavButton", jsonData.CURLOCFAVBUTTON);
			Preferences.set("curLocOrdButton", jsonData.CURLOCORDBUTTON);
			Preferences.set("dischPlanButton", jsonData.DISCHPLANBUTTON);
			Preferences.set("dischFavButton", jsonData.DISCHFAVBUTTON);
			Preferences.set("dischOrdButton", jsonData.DISCHORDBUTTON);
			Preferences.set("dischKeepTooltip", jsonData.DISCHKEEPTOOLTIP);
			Preferences.set("dischModifyTooltip", jsonData.DISCHMODIFYTOOLTIP);
			Preferences.set("dischStopTooltip", jsonData.DISCHSTOPTOOLTIP);
			Preferences.set("dischResumeTooltip", jsonData.DISCHRESUMETOOLTIP);
			Preferences.set("transferKeepTooltip", jsonData.TRANSFERKEEPTOOLTIP);
			Preferences.set("transferModifyTooltip", jsonData.TRANSFERMODIFYTOOLTIP);
			Preferences.set("transferStopTooltip", jsonData.TRANSFERSTOPTOOLTIP);
			Preferences.set("admissionAcknowledgeTooltip", jsonData.ADMISSIONACKNOWLEDGETOOLTIP);
			Preferences.set("admissionKeepTooltip", jsonData.ADMISSIONKEEPTOOLTIP);
			Preferences.set("admissionModifyTooltip", jsonData.ADMISSIONMODIFYTOOLTIP);
			Preferences.set("admissionStopTooltip", jsonData.ADMISSIONSTOPTOOLTIP);
			Preferences.set("printIconIndicator", jsonData.PRINTICONIND);
			Preferences.set("restartTooltip", jsonData.RESTARTTOOLTIP);
			Preferences.set("resumeAllTooltip", jsonData.RESUMEALLTOOLTIP);
			Preferences.set("medicationGroupingInd", jsonData.MEDICATIONGROUPINGIND);
			Preferences.set("titleDisplay", jsonData.TITLEDISPLAY);
		} catch (err) {
			errorHandler(err, "initializePreferences()");
		}
	}
	
	//function to gather and fill patient banner with basic demographic information
	function fillPatientBanner(jsonData) {
		try {
			// load the patient banner
			var PATIENT_BANNER_TEMPLATE = doT.template($("#PatientBannerTemplate").html());
			
			// append to DOM and resize header
			$(".pg-hd").append(PATIENT_BANNER_TEMPLATE(jsonData)).width($(document).width() - 350);
		} catch (e) {
			errorHandler(e, "fillPatientBanner()");
		}
	}

	/**
	 * Initialize variables used in Meds Rec Advisor
	 * @method initializeVariables
	 * @author RB018070
	 */
	function initializeVariables() {
		try {
			dttmInputText = new UtilInputText();
			orderActionEntityList = new HashMap();
			orderGroupEntityList = new HashMap();
			ordersComplianceList = {};
			ordersComplianceList.encntr_id = criterion.encntr_id;
			ordersComplianceList.encntr_compliance_status_flag = 0;
			ordersComplianceList.performed_prsnl_id = criterion.prsnl_id;
			ordersComplianceList.no_known_home_meds_ind = 0;
			ordersComplianceList.unable_to_obtain_ind = 0;
			ordersComplianceList.order_list = [];
			ordersEntityList	= {};
			ordersEntityList.ords = [];
			ordersEntityList.ord_cnt = 0;
			orderableEntityList = {};
			orderableEntityList.ords = [];
			orderableEntityList.ord_cnt = 0;
			orderableEntityUndoList = {};
			orderableEntityUndoList.ords = [];
			orderableEntityUndoList.ord_cnt = 0;
			OrderRecon.initialize();
			active_select_all = null;
			cnt_medrows = 0;
			preInd = 0;
			preAdmitPrevEncntrInd = 0;
			active_entity_count = 0;
			stopped_ord_count = 0;
			done_ord_recon  = false;
			done_ord_comments = false;
			done_ord_compliance = false;
			orderReconciliations = [];
			orderComments = [];
			criterion.ordering_personnel_id = criterion.prsnl_id;
			// Validate if any pending orderables exist
			OrderableDisplay.validatePendingData();
		} catch (e) {
			errorHandler(e, "initializeVariables()");
		}
	}

	/**
	 * Initialize the ajax_request to load orders table
	 * @method initalizeOrders
	 */
	function initalizeOrders(perform_reconciliation_ind) {
		try {
			// default to not perform reconciliation
			if(!perform_reconciliation_ind){
				perform_reconciliation_ind = 0;
			}
			
			initializeVariables();
			orders_table = _g("table_orders");
			meds_table = _g("section_meds");
			meds_hdr_table = _g("section_hdr_meds");
			non_meds_hdr_table = _g("section_hdr_non_meds");
			GlobalAjaxCclHandler.ajax_request({
				request: {
					type: "XMLCCLREQUEST",
					target: 'ADVSR_MEDS_REC_GET_ORDERS:dba',
					binding: "CpmScriptBatch",
					parameters: "'MINE'" + "" +
						",^" + convertFloat(criterion.person_id) + "^" +
						",^" + convertFloat(criterion.encntr_id) + "^" +
						"," + perform_reconciliation_ind 
				},
				response: {
					type: "JSON",
					target: loadOrdersTable
				}
			});
			
		} catch (e) {
			errorHandler(e, e.message + " - > initalizeOrders()");
		}
	}

	/***** Table row methods **/
	/* Function : getUniqueidTableRow
	 * Purpose: Find an existing row to insert the order into, returns -1 if no row is found
	 * Parameters: (candidate_id) - Id of the row to be insert
	 * Returns: (id) - new id to insert row
	 */
	function getUniqueidTableRow(candidate_id) {
		try {
			if (!_g(candidate_id)) {
				return candidate_id;
			} 
			else {
				var id_cntr = 1;
				while (_g(candidate_id + "_" + id_cntr)) {
					id_cntr++;
				}
				return (candidate_id + "_" + id_cntr);
			}
		} 
		catch (e) {
			errorHandler(e, "getUniqueIdTableRow()");
		}
	}
	function insertSubHeaderTableRow(subhdr_row, value, cnt) {
		subhdr_row.insertCell();
		subhdr_row.cells[cnt].className = "tbl-fxd-hdr-tr-sub-td";
		subhdr_row.cells[cnt].innerHTML = value;
		cnt++;
		return cnt;
	}

	function fillOrders(json_data) {
		try {
			var cur_row, cur_order_id, ord_action_type, prev_ord_action_type,
				prev_ord_col = 0, cur_row_id, cur_ord_status,
				cur_ord_action_entity, prev_ord_action_entity, cur_ord_group_entity, nohxmeds,
				nokhxmeds, cur_order, cur_order_rows, uselastcomp,
				cur_order_group,
				cur_order_group_node,
				cur_order_group_node_id,
				cur_row_cells,
				insert_after_row, inpatientInd, cclParam, listParams, orderGroupCSS,
				discontinuedOrders, discontinuedOrdersCnt = 0, order_status_type, collapsibleHeader,
				cur_order_auto_reconcile_entity, medOrderGroupSortList, orderGroupSortList, orderGroupHxResumeList,
				sortAttr = null,
				sortOrder,
				med_cat_class,
				mostRecentOrder,
				discontinuedLookBackDays = parseInt(Preferences.get("discontinuedDays"), 10), displayTargetRowNode,
				displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag;

			SortIt(json_data.REC_DATA[1].MEDRECORDERS.GROUPS, -1, "ORDERPARENTCATEGORY");
			OrderableDisplay.setMnemDispLevel(parseInt(json_data.REC_DATA[1].MEDRECORDERS.MNEM_DISP_LEVEL, 10));
			for (var g = 0; g < json_data.REC_DATA[1].MEDRECORDERS.GROUPS.length; g++) // loop through order groups
			{
				cur_order_group = json_data.REC_DATA[1].MEDRECORDERS.GROUPS[g];
				cur_order_group_node_id = cur_order_group.GROUP_ID;
				
				for (var o = 0; o < cur_order_group.ORDER_CNT; o++) { // loop through order groups
					cur_order = cur_order_group.ORDERS[o];
					cur_order_id = cur_order.ORDERID;
					order_status_type = "";
					ord_action_type = parseInt(cur_order.MEDSTATUSFLAG, 10);				
					if (parseInt(cur_order.MEDIND, 10) === 1) { // Medication
						insert_after_row = meds_hdr_table;
						if (ord_action_type === DC_STATUS_FLAG) { //Stopped Medication => insert at the bottom of medications
							insert_after_row = Util.gps(non_meds_hdr_table);
						}
					} else {
						insert_after_row = non_meds_hdr_table;
						if (ord_action_type === DC_STATUS_FLAG) { //Stopped Order => insert at the bottom of medications
							insert_after_row = orders_table.tBodies[orders_table.tBodies.length - 1];
						}
					}
					
					// set the action type for discharge continued meds
					if (parseInt(cur_order.DISCHCONTINUEIND, 10) === 1) {
						ord_action_type = RX_CONTINUE_STATUS_FLAG;
					}
					
					// Set appropriate Location sequence for discharged medications
					if (cur_order.LOCSEQ === 999999) {
						cur_order.LOCSEQ = totalColumns;
					}
					
					cur_order_group_node = _g(cur_order_group_node_id);
					
					if (cur_order_group_node !== null) { // previous group found
						cur_row = OrderGroup.getCurrentOrderRow(cur_order_group_node);
						prev_ord_col = OrderGroup.getPreviousOrderColumn(cur_order_group_node_id);
						prev_ord_action_entity = orderActionEntityList.get(cur_row.id + prev_ord_col);
						prev_ord_action_type = prev_ord_action_entity.status_type;
						
						OrderableDisplay.setHistoricalActionSelector(prev_ord_action_entity);
						
						if (prev_ord_col === cur_order.LOCSEQ) {
							if (prev_ord_action_type === DC_STATUS_FLAG && ord_action_type === KEEP_STATUS_FLAG || (prev_ord_action_entity.order_id === cur_order_id)) {
								prev_ord_action_entity.excl_ind = 1;
								orderActionEntityList.put(cur_row.id + "" + prev_ord_col, prev_ord_action_entity);
								if (prev_ord_action_type === DC_STATUS_FLAG) { // only if previous action was stop/ strike off
									order_status_type = "MODIFIED";
								}
							} else {
								cur_order_group_node = null;
								cur_order_group_node_id = getUniqueidTableRow(cur_order_group_node_id);
							}
						}
					}
					
					if (cur_order_group_node === null) { // order group doesn't exist
						cur_row_id = cur_order_group_node_id + "_row_1";
						cur_order_group_node = OrderGroup.createOrderGroup(cur_order_group_node_id, insert_after_row);
						cur_order_rows = OrderGroup.createOrderRows(cur_order_group_node, cur_row_id, cur_order.LOCSEQ);
						cur_row = cur_order_rows[0];
	
						if (parseInt(cur_order.MEDIND, 10) === 0) {
							non_med_count = non_med_count + 1;
						} else {
							med_count = med_count + 1;
						}
						// Updated with first order_action_entity details
						cur_ord_group_entity = orderGroupEntityList.get("order_group_" + cur_order_group_node_id);
						cur_ord_group_entity.medicationCategory = cur_order_group.MEDICATIONCATEGORY;
						cur_ord_group_entity.first_order_action_entity_id = "" + cur_row.id + (cur_order.LOCSEQ);
						cur_ord_group_entity.first_order_col_index = cur_order.LOCSEQ;
						mostRecentOrder = cur_order_group.ORDERS[cur_order_group.ORDER_CNT - 1];
						cur_ord_group_entity.most_recent_order_as_mnemonic = mostRecentOrder.MEDORDAS.toUpperCase();
						if (mostRecentOrder.DISCONTINUEDTTMDISP > " ") {
							cur_ord_group_entity.most_recent_order_dttm = mostRecentOrder.DISCONTINUEDTTM.toUpperCase();
						} else {
							cur_ord_group_entity.most_recent_order_dttm = mostRecentOrder.MEDORDDTTM.toUpperCase();
						}
						cur_ord_group_entity.most_recent_resume_ind =  mostRecentOrder.RECONRESUMEIND;
						cur_ord_group_entity.most_recent_resume_dt_tm = cnvtIsoDttmFormat(mostRecentOrder.RECONRESUMEDTTM);
						cur_ord_group_entity.most_recent_resume_prsnl = mostRecentOrder.RECONRESUMEPHY;						
						cur_ord_group_entity.most_recent_order_mltm_id = mostRecentOrder.MEDMLTMCATID;
						cur_ord_group_entity.most_recent_order_col_index = mostRecentOrder.LOCSEQ;
						cur_ord_group_entity.hx_resume_ind = parseInt(cur_order.RECONRESUMEIND, 10);
						if (cur_order.RECONRESUMEDTTMDISP > " ") {
							cur_ord_group_entity.hx_resume_dt_tm = cnvtIsoDttmFormat(cur_order.RECONRESUMEDTTM);
						}
						cur_ord_group_entity.hx_resume_prsnl = cur_order.RECONRESUMEPHY;
						orderGroupEntityList.put("order_group_" + cur_order_group_node_id, cur_ord_group_entity);
											
						//Set CSS
						med_cat_class = getMedicationCategoryClass(cur_ord_group_entity);
						if (parseInt(cur_order_group.MEDIND, 10) === 0) {
							cur_order_group_node.className = "non-med-order";
						} else {
							cur_order_group_node.className = "med-order " + med_cat_class;
						}
						
								
					} else { // existing order group
						prev_ord_col = OrderGroup.getPreviousOrderColumn(cur_order_group_node_id);
						prev_ord_action_entity = orderActionEntityList.get(cur_row.id + prev_ord_col);
						/* Disable Previous Order Action Selectors */
						OrderableDisplay.toggleActionSelectors(prev_ord_action_entity, false);
						prev_ord_action_type = prev_ord_action_entity.status_type;
						prev_ord_action_entity.excl_ind = 1; // exclusion orders
						prev_ord_action_entity.actionable_ind = -1;
						orderActionEntityList.put(cur_row.id + prev_ord_col, prev_ord_action_entity);
						// End Evaluation
	
						OrderGroup.clearChildRows(cur_row, cur_order.LOCSEQ);
	
						cur_row_id = cur_row.id;
						if (ord_action_type === MOD_STATUS_FLAG || (prev_ord_action_type === DC_STATUS_FLAG && prev_ord_col < meds_hdr_table.rows[0].cells.length - 2)) { // modify action
							order_status_type = "MODIFIED";
						}
						if (ord_action_type === KEEP_STATUS_FLAG) {
							order_status_type = "CONTINUED";
						}
						Util.ia(cur_order_group_node, insert_after_row);
						OrderGroup.setPreviousOrderColumn(cur_order_group_node_id, cur_order.LOCSEQ);
					}
	
					// Remove the order group for complete non-med orders
					if (parseInt(cur_order.MEDIND, 10) === 0 && parseInt(cur_order.COMPLETEDIND, 10) === 1) {
						Util.de(cur_order_group_node);
						non_med_count = non_med_count - 1;
						continue;
					}
	
					if (ord_action_type === DC_STATUS_FLAG) {
						order_status_type = "STOPPED";
					}
					else if (ord_action_type === SUSP_STATUS_FLAG) {
						order_status_type = "SUSPENDED";
					}
					else if (ord_action_type === ACK_STATUS_FLAG) {
						order_status_type = "ACKNOWLEDGED";
					}
					
					cur_row = orders_table.rows[cur_row.rowIndex];
					cur_row_cells = cur_row.cells;
					
					// Create Order Action Entity
					cur_ord_action_entity = new OrderActionEntity();
					cur_ord_action_entity.order_name = cur_order.MEDNAME;
					cur_ord_action_entity.order_as_mnemonic = cur_order.MEDORDAS;
					cur_ord_action_entity.order_hna_mnemonic = cur_order.MEDHNAMNEMONIC;
					cur_ord_action_entity.order_comment = cur_order.MEDCOMMENT;
					cur_ord_action_entity.order_id = cur_order_id;
					cur_ord_action_entity.cki = cur_order.MEDCKI;
					cur_ord_action_entity.catalog_cd = cur_order.CATALOGCD;
					cur_ord_action_entity.mltm_cat_id = cur_order.MEDMLTMCATID;
					cur_ord_action_entity.synonym_id = cur_order.SYNONYM_ID;
					cur_ord_action_entity.sentence_id = cur_order.SENTENCE_ID;
					cur_ord_action_entity.order_details = cur_order.MEDDET;
					cur_ord_action_entity.clin_disp = cur_order.MEDCDET;
					cur_ord_action_entity.order_phy_name = cur_order.MEDORDPHY;
					cur_ord_action_entity.orig_ord_dt_tm = cnvtIsoDttmFormat(cur_order.MEDORDDTTM);
					cur_ord_action_entity.hashmap_key = "" + cur_row.id + (cur_order.LOCSEQ);
					cur_ord_action_entity.col_index = cur_order.LOCSEQ;
					cur_ord_action_entity.prev_col_index = prev_ord_col;
					cur_ord_action_entity.order_group_id = cur_order_group_node_id;
					cur_ord_action_entity.last_dose_dt_tm = cur_order.MEDDOSEDTTMDISP;
					cur_ord_action_entity.compliance_status = cur_order.MEDCOMPLIANCESTATUS;
					cur_ord_action_entity.compliance_information_source = cur_order.MEDCOMPLIANCEINFORMATIONSOURCE;
					cur_ord_action_entity.compliance_comment = cur_order.MEDCOMPLIANCECOMMENT;
					cur_ord_action_entity.row_obj = cur_row;
					cur_ord_action_entity.parent_row_obj = cur_row;
					cur_ord_action_entity.status_type = ord_action_type;
					cur_ord_action_entity.med_ind = parseInt(cur_order.MEDIND, 10);
					cur_ord_action_entity.pharmacy_iv_ind = parseInt(cur_order.PHARMACYIVIND, 10);
					cur_ord_action_entity.order_status_type = order_status_type;
					cur_ord_action_entity.order_status_disp = cur_order.ORDERSTATUSDISP;
					cur_ord_action_entity.order_ind = 1;

					if (parseInt(cur_order.MEDIND, 10) === 0 || ord_action_type === DC_STATUS_FLAG || parseInt(cur_order.DISCHEXCLIND, 10) === 1) {
						cur_ord_action_entity.excl_ind = 1;
						cur_ord_action_entity.actionable_ind = 1;
					} else {
						cur_ord_action_entity.excl_ind = 0;
						cur_ord_action_entity.actionable_ind = 1;
					}
	
					orderActionEntityList.put(cur_ord_action_entity.hashmap_key, cur_ord_action_entity);
	
					// Update order group details
					cur_ord_group_entity = orderGroupEntityList.get("order_group_" + cur_order_group_node_id);
					cur_ord_group_entity.most_recent_order_name = OrderableDisplay.getOrderDisplay(cur_ord_action_entity);
					
					cur_ord_group_entity.most_recent_order_action_entity_id = cur_ord_action_entity.hashmap_key;
					cur_ord_group_entity.med_ind = parseInt(cur_order.MEDIND, 10);
					cur_ord_group_entity.medicationCategory = cur_order_group.MEDICATIONCATEGORY;
					cur_ord_group_entity.sub2Category = cur_order_group.ORDERSUB2CATEGORY;
					cur_ord_group_entity.sub2CategoryDisplay = cur_order_group.ORDERSUB2CATEGORYDISPLAY;
					cur_ord_group_entity.sub2CategorySequence = cur_order_group.ORDERSUB2CATPRIORITY;
					
					if (cur_order.DISCONTINUEDTTMDISP > " " &&
						cur_ord_group_entity.most_recent_resume_ind === 0 && cur_ord_group_entity.hx_resume_ind === 0) {
						cur_ord_group_entity.discontinued_ind = 1;
					} else {
						cur_ord_group_entity.discontinued_ind = 0;
						if (ord_action_type === SUSP_STATUS_FLAG) {
							cur_ord_group_entity.suspended_ind = 1;
						}
						else {
							cur_ord_group_entity.suspended_ind = 0;
						}
					}
					cur_ord_group_entity.discontinued_dt_tm = cur_order.DISCONTINUEDTTM;
					orderGroupEntityList.put("order_group_" + cur_order_group_node_id, cur_ord_group_entity);
					
					//Set CSS
					med_cat_class = getMedicationCategoryClass(cur_ord_group_entity);
					if (parseInt(cur_order_group.MEDIND, 10) === 0) {
						cur_order_group_node.className = "non-med-order";
					} else {
						cur_order_group_node.className = "med-order " + med_cat_class;
					}
	
					if (cur_order.LOCSEQ === 0) { // Pre-Admit Med
						if (cur_order.CURENCIND === 1) {
							preInd = 1;
						}
						else {
							preAdmitPrevEncntrInd = 1;
						}
					}
	
					inpatientInd = OrdersLayout.isInpatientColumn(cur_order.LOCSEQ);
							
					OrderableDisplay.addOrderDisplay(cur_row, cur_order.LOCSEQ, inpatientInd, -1);
						
					if (cur_order.LOCSEQ === totalColumns - 1 && parseInt(cur_order.DISCHCONTINUEIND, 10) === 1) { // continued to discharge
						// Create Order Action Entity
						cur_ord_action_entity = new OrderActionEntity();
						cur_ord_action_entity.order_name = cur_order.MEDNAME;
						cur_ord_action_entity.order_as_mnemonic = cur_order.MEDORDAS;
						cur_ord_action_entity.order_hna_mnemonic = cur_order.MEDHNAMNEMONIC;
						cur_ord_action_entity.order_comment = cur_order.MEDCOMMENT;
						cur_ord_action_entity.order_id = cur_order_id;
						cur_ord_action_entity.cki = cur_order.MEDCKI;
						cur_ord_action_entity.catalog_cd = cur_order.CATALOGCD;
						cur_ord_action_entity.mltm_cat_id = cur_order.MEDMLTMCATID;
						cur_ord_action_entity.synonym_id = cur_order.SYNONYM_ID;
						cur_ord_action_entity.sentence_id = cur_order.SENTENCE_ID;
						cur_ord_action_entity.order_details = cur_order.MEDDET;
						cur_ord_action_entity.clin_disp = cur_order.MEDCDET;
						cur_ord_action_entity.hashmap_key = "" + cur_row.id + (totalColumns);
						cur_ord_action_entity.col_index = totalColumns;
						cur_ord_action_entity.prev_col_index = totalColumns - 1;
						cur_ord_action_entity.last_dose_dt_tm = cur_order.MEDDOSEDTTMDISP;
						cur_ord_action_entity.compliance_status = cur_order.MEDCOMPLIANCESTATUS;
						cur_ord_action_entity.compliance_information_source = cur_order.MEDCOMPLIANCEINFORMATIONSOURCE;
						cur_ord_action_entity.compliance_comment = cur_order.MEDCOMPLIANCECOMMENT;
						cur_ord_action_entity.row_obj = cur_row;
						cur_ord_action_entity.parent_row_obj = cur_row;
						cur_ord_action_entity.status_type = 1;
						cur_ord_action_entity.excl_ind = 1;
						cur_ord_action_entity.actionable_ind = -1;
						cur_ord_action_entity.order_ind = 0;
						cur_ord_action_entity.med_ind = parseInt(cur_order.MEDIND, 10);
												
						cur_ord_action_entity.orig_ord_dt_tm = cnvtIsoDttmFormat(cur_order.DISCHCONTINUEDTTM);
						cur_ord_action_entity.order_phy_name = cur_order.DISCHCONTINUEPHY;	
						cur_ord_action_entity.order_status_disp = cur_order.ORDERSTATUSDISP;
					
						if (cur_ord_action_entity.med_ind === 1) {
							cur_ord_action_entity.order_status_type = "CONTINUED_NON_RX";
						} else {
							cur_ord_action_entity.order_status_type = "CONTINUED";
						}
	
						cur_ord_action_entity.pharmacy_iv_ind = parseInt(cur_order.PHARMACYIVIND, 10);
						orderActionEntityList.put(cur_ord_action_entity.hashmap_key, cur_ord_action_entity);
						OrderableDisplay.addOrderDisplay(cur_row, totalColumns, 0, -1);
						prev_ord_action_entity = orderActionEntityList.get(cur_row.id + cur_order.LOCSEQ);
						prev_ord_action_entity.excl_ind = 1; // exclusion orders
						prev_ord_action_entity.actionable_ind = -1;
						/* Disable Previous Order Action Selectors */
						OrderableDisplay.setHistoricalActionSelector(prev_ord_action_entity);
						/* Disable Current Order Action Selectors */
						OrderableDisplay.toggleActionSelectors(cur_ord_action_entity, false);
					} else if (cur_order.LOCSEQ === totalColumns - 1 && parseInt(cur_order.DISCHDONOTCNVTIND, 10) === 1) { // not continued to discharge
						// Create Order Action Entity
						cur_ord_action_entity = new OrderActionEntity();
						cur_ord_action_entity.order_name = cur_order.MEDNAME;
						cur_ord_action_entity.order_as_mnemonic = cur_order.MEDORDAS;
						cur_ord_action_entity.order_hna_mnemonic = cur_order.MEDHNAMNEMONIC;
						cur_ord_action_entity.order_comment = cur_order.MEDCOMMENT;
						cur_ord_action_entity.order_id = cur_order_id;
						cur_ord_action_entity.cki = cur_order.MEDCKI;
						cur_ord_action_entity.catalog_cd = cur_order.CATALOGCD;
						cur_ord_action_entity.mltm_cat_id = cur_order.MEDMLTMCATID;
						cur_ord_action_entity.synonym_id = cur_order.SYNONYM_ID;
						cur_ord_action_entity.sentence_id = cur_order.SENTENCE_ID;
						cur_ord_action_entity.order_details = cur_order.MEDDET;
						cur_ord_action_entity.clin_disp = cur_order.MEDCDET;
						cur_ord_action_entity.hashmap_key = "" + cur_row.id + (totalColumns);
						cur_ord_action_entity.col_index = totalColumns;
						cur_ord_action_entity.prev_col_index = totalColumns - 1;
						cur_ord_action_entity.last_dose_dt_tm = cur_order.MEDDOSEDTTMDISP;
						cur_ord_action_entity.compliance_status = cur_order.MEDCOMPLIANCESTATUS;
						cur_ord_action_entity.compliance_information_source = cur_order.MEDCOMPLIANCEINFORMATIONSOURCE;
						cur_ord_action_entity.compliance_comment = cur_order.MEDCOMPLIANCECOMMENT;
						cur_ord_action_entity.row_obj = cur_row;
						cur_ord_action_entity.parent_row_obj = cur_row;
						cur_ord_action_entity.status_type = 1;
						cur_ord_action_entity.excl_ind = 1;
						cur_ord_action_entity.actionable_ind = -1;
						cur_ord_action_entity.order_ind = 0;
						cur_ord_action_entity.med_ind = parseInt(cur_order.MEDIND, 10);
												
						cur_ord_action_entity.orig_ord_dt_tm = cnvtIsoDttmFormat(cur_order.DISCHCONTINUEDTTM);
						cur_ord_action_entity.order_phy_name = cur_order.DISCHCONTINUEPHY;	
						cur_ord_action_entity.order_status_disp = cur_order.ORDERSTATUSDISP;
						cur_ord_action_entity.order_status_type = "NOT_CONTINUED_RX";
						cur_ord_action_entity.pharmacy_iv_ind = parseInt(cur_order.PHARMACYIVIND, 10);
						orderActionEntityList.put(cur_ord_action_entity.hashmap_key, cur_ord_action_entity);
						OrderableDisplay.addOrderDisplay(cur_row, totalColumns, 0, -1);
						prev_ord_action_entity = orderActionEntityList.get(cur_row.id + cur_order.LOCSEQ);
						prev_ord_action_entity.excl_ind = 1; // exclusion orders
						prev_ord_action_entity.actionable_ind = -1;
						/* Disable Previous Order Action Selectors */
						OrderableDisplay.setHistoricalActionSelector(prev_ord_action_entity);
						/* Disable Current Order Action Selectors */
						OrderableDisplay.toggleActionSelectors(cur_ord_action_entity, false);
					}
	
					// set styles for stopped orders which are last in group
					if (o === cur_order_group.ORDER_CNT - 1 && (ord_action_type === DC_STATUS_FLAG && cur_ord_group_entity.hx_resume_ind === 0)) {
						cur_ord_action_entity = copyOrderActionEntity(orderActionEntityList.get(cur_ord_group_entity.most_recent_order_action_entity_id));
						cur_ord_action_entity.clin_disp = cur_order.MEDCDET;
						cur_ord_action_entity.excl_ind = 1;
						cur_ord_action_entity.status_type = ord_action_type;
						cur_ord_action_entity.order_comment = cur_order.MEDCOMMENT;
						cur_ord_action_entity.row_obj = cur_row;
						
						// Discontinued in current location => restart in the same location
						if (ord_action_type === DC_STATUS_FLAG) { 
							cur_ord_action_entity.hashmap_key = "" + cur_row.id + (cur_order.LOCSEQ);
							cur_ord_action_entity.prev_col_index = cur_order.LOCSEQ;
							cur_ord_action_entity.col_index = cur_order.LOCSEQ;
							/* Enable Current Order Action Selectors */
							OrderableDisplay.toggleActionSelectors(cur_ord_action_entity, true);						
						} 
						
						cur_ord_action_entity.order_phy_name = cur_order.MEDORDPHY;
						cur_ord_action_entity.discontinue_reason = cur_order.DISCONTINUEREASON;
						cur_ord_action_entity.order_status_disp = cur_order.ORDERSTATUSDISP;
						if (cur_order.DISCONTINUEPHY > " ") {
							cur_ord_action_entity.order_phy_name = cur_order.DISCONTINUEPHY;
						}
						if (cur_order.DISCONTINUEDTTMDISP > " ") {
							cur_ord_action_entity.orig_ord_dt_tm = cnvtIsoDttmFormat(cur_order.DISCONTINUEDTTM);
						}
					
						cur_ord_action_entity.mltm_cat_id = cur_order.MEDMLTMCATID;
						orderActionEntityList.put(cur_ord_action_entity.hashmap_key, cur_ord_action_entity);
						
						// Update display
						OrderableDisplay.addOrderDisplay(cur_row, cur_order.LOCSEQ, inpatientInd, -1);
						if (cur_order.LOCSEQ < (meds_hdr_table.rows[0].cells.length - 2)) {
							TableColumn.setCssClassTableColumn(cur_row, cur_order.LOCSEQ + 1, "tbl-fxd-body-tr-td-cancelled"); // set the appropriate style
						}
					}
					//Remove action entity for disch orders
					if (cur_order.LOCSEQ === totalColumns) {
						cur_ord_action_entity.excl_ind = 1;
					}
				}
			}
			
			// Completed Medication History Status
			if (parseInt(json_data.REC_DATA[1].MEDRECORDERS.MED_HISTORY_STATUS, 10) === 1 || criterion.med_history_no_known_home_meds_ind === 1) {
				_g('status_med_hist').className = "icon-check";
			} else {
				_g('status_med_hist').className = "icon-exclamation";
			}
			
			// Completed Admission Reconciliation Status
			if (parseInt(json_data.REC_DATA[1].MEDRECORDERS.ADMIT_RECON_STATUS, 10) === COMPLETE_RECON_STATUS_FLAG) { 
				_g('status_adm_med').className = "icon-check";
			} 
			// Partial Admission Reconciliation
			else if (parseInt(json_data.REC_DATA[1].MEDRECORDERS.ADMIT_RECON_STATUS, 10) === PARTIAL_RECON_STATUS_FLAG) {
				_g('status_adm_med').className = "icon-inprogress";
			}
			else {
				_g('status_adm_med').className = "icon-exclamation";
			}

			 // Completed Discharge Reconciliation Status
			if (parseInt(json_data.REC_DATA[1].MEDRECORDERS.DISCH_RECON_STATUS, 10) === COMPLETE_RECON_STATUS_FLAG) {
				_g('status_disch_med').className = "icon-check";
			} else {
				_g('status_disch_med').className = "icon-exclamation";
			}

			// Sort Order groups
			switch (Preferences.get("defaultSortOrder")) {
			case 1:// reverse chronological order , descending
				sortAttr = "most_recent_order_dttm";
				sortOrder = 1;
				break; 
			case 2: // alphabetical order , ascending
				sortAttr = "most_recent_order_as_mnemonic";
				sortOrder = -1;
				break; 
			case 3:// Multum drug category id , ascending
				sortAttr = "most_recent_order_mltm_id";
				sortOrder = 1;
				break; 
			} 
			if (sortAttr !== null && sortOrder !== null) {
				// sort Discontinued and active medication orders medication orders
				if (meds_table !== null) {
					orderGroupSortList = orderGroupEntityList.map(function (obj) {
						if (obj.med_ind === 1 && obj.discontinued_ind === 1) {
							Util.Style.acss(_g(obj.order_group_id), "tbl-fxd-body-tr-grey");
							return true;
						} else {
							return false;
						}
					});
					
					SortIt(orderGroupSortList, sortOrder, sortAttr);
					
					GlobalAjaxCclHandler.append_text("<br/> Discontinued Med Order Group Entity list After Sort<br/>");
					GlobalAjaxCclHandler.append_json({
						"orderGroupEntityList": orderGroupSortList
					});
					
					orderGroupSortList = orderGroupEntityList.map(function (obj) {			
						var return_value, cur_disc_dt = new Date();
						if (obj.discontinued_dt_tm > " ") {
							cur_disc_dt.setISO8601(obj.discontinued_dt_tm);
						}
						if (obj.med_ind === 1 && (obj.discontinued_ind === 1 || obj.suspended_ind === 1)) {				
							Util.Style.acss(_g(obj.order_group_id), "tbl-fxd-body-tr-grey");
						}
						var dateQualified =  false;
						if (discontinuedLookBackDays > 0) {
							if (((cur_dt_tm.getTime() - cur_disc_dt.getTime()) / ONE_DAY) <= discontinuedLookBackDays) {
								dateQualified = true;
							}
						}
						else {
							dateQualified = true;
						}
						
						if (obj.med_ind === 1 && ((obj.discontinued_ind === 1 && obj.discontinued_dt_tm > " " && dateQualified) || obj.suspended_ind === 1)) {
							return_value = true;
						} else {
							return_value = false;
						}
						return (return_value);
					});
					SortIt(orderGroupSortList, sortOrder, sortAttr);
							
					GlobalAjaxCclHandler.append_text("<br/> Suspended and Discontinued within past Med Order Group Entity list After Sort<br/>");
					GlobalAjaxCclHandler.append_json({
						"orderGroupEntityList": orderGroupSortList
					});
					
					OrderGroup.moveOrderGroupsList(meds_table, orderGroupSortList);
							
					// If Preference is set to display medication Groupings
					if (Preferences.get("medicationGroupingInd") === 1) {	
						// Create Collapsible Suspended Meds Header
						if (orderGroupSortList.length > 0) {
							var discontinuedLabel = "Discontinued";
							if (discontinuedLookBackDays > 0) {
								discontinuedLabel = "Discontinued within the past " + discontinuedLookBackDays + " days";
							}
					
							var susp_med_collapsible_hdr = OrderGroup.insertCollapsibleHeader({
								"insertAfterRow": meds_table,
								"headerName": "&nbsp;Suspended/" + discontinuedLabel,
								"collapseCSS": "susp-med-order",
								"subCatLevel": 2,
								"collapseDefault": 0
							});
							OrderGroup.moveOrderGroupsList(susp_med_collapsible_hdr, orderGroupSortList);
						}
					}
	
					// Build a list of active med orders
					medOrderGroupSortList = orderGroupEntityList.map(function (obj) {
						return (obj.med_ind === 1 && obj.discontinued_ind === 0 && obj.suspended_ind === 0);
					});
					
					SortIt(medOrderGroupSortList, sortOrder, sortAttr);
					// Build categories of groups
					var categoryGroups = _.groupBy(medOrderGroupSortList, function (orderGroup) {
						return orderGroup.sub2Category;
					});
					// Sort the groups in each category
					_.each(categoryGroups, function (orderGroups, category, catList) {
						if (category > " ") {				
							catList[category] = _.sortBy(orderGroups, function (orderGroup) {
								return orderGroup.sub2CategorySequence * -1;
							});
						}
					});
					// loop through list of groups to insert the category in the first group occurence
					_.each(medOrderGroupSortList, function (orderGroup, index, groupList) {
						var category = orderGroup.sub2Category;
						var categoryDisplay = orderGroup.sub2CategoryDisplay;
						if (category > " " && categoryGroups[category].length > 0) {
							var headerNameDOM,
								headerToggleDOM,
								headerRowCellDOM, 
								hideCategoryClass = "hide-category",
								colIndex = 0,
								// Add the category header
								cur_order_group = OrderGroup.createOrderGroup(category + "_header", meds_hdr_table),
								med_cat_class = getMedicationCategoryClass(orderGroup);
							
							cur_order_rows = OrderGroup.createOrderRows(cur_order_group, category + "_row_1", 0);
							cur_row = cur_order_rows[0];
							cur_row.className = 'tbl-fxd-body-tr-white col-row';
			
							cur_row.style.display = "";
							cur_order_group.className = "med-order collapsible-category-group-header " + med_cat_class;
							cur_order_group.rowSpan = orders_table.rows.length;
							cur_row.style.background = "";
							OrderGroup.moveOrderGroup(meds_table, cur_order_group);
							
							// add Cells for each column
							_.each(_.range(groupList[index].first_order_col_index, groupList[index].most_recent_order_col_index + 1), function (colIndex) {
								var toggleHideClass = "toggle-category-hide",
									toggleShowClass = "toggle-category-show",
									toggleClass = toggleShowClass + "-" + colIndex,
									headerRowCellDOM = cur_row.cells[colIndex];
								
								headerRowCellDOM.className = "collapsible-category-header collapsible-header-cell";
								headerNameDOM = Util.ce("span");
								headerToggleDOM = Util.cep("span", { "className": "icon-row-open collapsible-category-toggle " + toggleClass, "title": "Expand"});
								headerNameDOM.innerHTML  =	"<span class='collapsible-category-name orderable-name'>" + categoryDisplay + "</span>";
								headerToggleDOM.innerHTML = "<span class='' ></span>";
																								
								headerToggleDOM.onclick = function (event) {
									var displayStyle;
									
									if (Util.Style.ccss(cur_order_group, hideCategoryClass)) {											
										displayStyle = "";
										Util.Style.rcss(cur_order_group, hideCategoryClass);
									} else {
										displayStyle = "none";
										Util.Style.acss(cur_order_group, hideCategoryClass);
									}
									_.each(Util.Style.g("collapsible-category-toggle", cur_order_group), function (toggleNode) {											
										if (displayStyle === "") {
											toggleNode.className = toggleNode.className.replace("icon-row-closed", "icon-row-open");
											toggleNode.className = toggleNode.className.replace(toggleHideClass, toggleShowClass);
											toggleNode.title = "Collapse";
										} else {
											toggleNode.className = toggleNode.className.replace("icon-row-open", "icon-row-closed");
											toggleNode.className = toggleNode.className.replace(toggleShowClass, toggleHideClass);
											toggleNode.title = "Expand";
										}
									});
																			
									_.each(groupList[index], function (group) {
										var groupNode = _g(group.order_group_id);
										if (groupNode && !Util.Style.ccss(groupNode, "collapsible-category-group-header")) {
											groupNode.style.display = displayStyle;
										}
									});
								};
								headerToggleDOM = Util.ac(headerToggleDOM, headerRowCellDOM);
								headerNameDOM =	Util.ac(headerNameDOM, headerRowCellDOM);
							});
							
							categoryGroups[category].push({
								"order_group_id": category + "_header",
								"most_recent_order_name": category,
								"most_recent_order_as_mnemonic": category,
								"most_recent_order_dttm": "/DATE(2012-06-11T15:23:50.000+00:00)/",
								"most_recent_order_mltm_id": 0,
								"most_recent_order_action_entity_id": "",
								"most_recent_order_col_index": groupList[index].most_recent_order_col_index,
								"first_order_action_entity_id": "",
								"first_order_col_index": groupList[index].first_order_col_index,
								"hx_resume_ind": 0,
								"most_recent_resume_ind": 0,
								"med_ind": 1,
								"discontinued_ind": 0,
								"discontinued_dt_tm": "/Date(0000-00-00T00:00:00.000+00:00)/",
								"suspended_ind": 0,
								"hx_resume_prsnl": "",
								"most_recent_resume_dt_tm": "",
								"most_recent_resume_prsnl": "",
								"medicationCategory": orderGroup.medicationCategory,
								"sub2Category": category,
								"sub2CategorySequence": 999
							});

							groupList[index] = categoryGroups[category];
							medOrderGroupSortList.push(categoryGroups[category]);
							categoryGroups[category] = [];
							headerToggleDOM.onclick();
						}
					});
					// flatten groups into a single list
					medOrderGroupSortList = _.flatten(medOrderGroupSortList, true);
					// remove any duplicates
					medOrderGroupSortList = _.uniq(medOrderGroupSortList);
					
					OrderGroup.moveOrderGroupsList(meds_table, medOrderGroupSortList);
					
					// If Preference is set to display medication Groupings
					if (Preferences.get("medicationGroupingInd") === 1) {
						// Add IV medications to List
						orderGroupSortList = _.filter(medOrderGroupSortList, function (obj) {
							return (obj.medicationCategory === "IV");
						});
						GlobalAjaxCclHandler.append_text("<br/> Active IV Med Order Group Entity list After Sort<br/>");
						GlobalAjaxCclHandler.append_json({
							"orderGroupEntityList": orderGroupSortList
						});
						// Create Collapsible IV Meds Header
						if (orderGroupSortList.length > 0) {
							var iv_med_collapsible_hdr = OrderGroup.insertCollapsibleHeader({
								"insertAfterRow": meds_table,
								"headerName": "&nbsp;IV",
								"collapseCSS": "iv-med-order",
								"subCatLevel": 2,
								"collapseDefault": 0
							});
							Util.Style.acss(iv_med_collapsible_hdr, "med-order");
							OrderGroup.moveOrderGroupsList(iv_med_collapsible_hdr, orderGroupSortList);
						}
						
						// Add PRN medications to List
						orderGroupSortList = _.filter(medOrderGroupSortList, function (obj) {
							return (obj.medicationCategory === "PRN");
						});
						GlobalAjaxCclHandler.append_text("<br/> Active PRN Med Order Group Entity list After Sort<br/>");
						GlobalAjaxCclHandler.append_json({
							"orderGroupEntityList": orderGroupSortList
						});
						// Create Collapsible PRN Meds Header
						if (orderGroupSortList.length > 0) {
							var prn_med_collapsible_hdr = OrderGroup.insertCollapsibleHeader({
								"insertAfterRow": meds_table,
								"headerName": "&nbsp;PRN",
								"collapseCSS": "prn-med-order",
								"subCatLevel": 2,
								"collapseDefault": 0
							});
							Util.Style.acss(prn_med_collapsible_hdr, "med-order");
							OrderGroup.moveOrderGroupsList(prn_med_collapsible_hdr, orderGroupSortList);
						}
						
						// Add Scheduled medications to List
						orderGroupSortList = _.filter(medOrderGroupSortList, function (obj) {
							return (obj.medicationCategory === "SCHEDULED" || obj.medicationCategory === "");
						});
						GlobalAjaxCclHandler.append_text("<br/> Active Scheduled Med Order Group Entity list After Sort<br/>");
						GlobalAjaxCclHandler.append_json({
							"orderGroupEntityList": orderGroupSortList
						});
						// Create Collapsible Scheduled Meds Header
						if (orderGroupSortList.length > 0) {
							var sched_med_collapsible_hdr = OrderGroup.insertCollapsibleHeader({
								"insertAfterRow": meds_table,
								"headerName": "&nbsp;Scheduled",
								"collapseCSS": "sched-med-order",
								"subCatLevel": 2,
								"collapseDefault": 0
							});
							Util.Style.acss(sched_med_collapsible_hdr, "med-order");
							OrderGroup.moveOrderGroupsList(sched_med_collapsible_hdr, orderGroupSortList);
						}
					}
				}
				
				//sort active non-medication orders and Discontinued non-medication orders
				if (non_meds_hdr_table !== null) {
					//move non-med header to bottom
					non_meds_hdr_table = Util.ac(non_meds_hdr_table, orders_table);
					orderGroupSortList = orderGroupEntityList.map(function (obj) {
						if (obj.med_ind === 0 && obj.discontinued_ind === 1) {
							Util.Style.acss(_g(obj.order_group_id), "tbl-fxd-body-tr-grey");
							return true;
						} else {
							return false;
						}
					});
					SortIt(orderGroupSortList, sortOrder, sortAttr);
					GlobalAjaxCclHandler.append_text("<br/> Discontinued Non-med Order Group Entity list <br/>");
					GlobalAjaxCclHandler.append_json({
						"orderGroupEntityList": orderGroupSortList
					});
					OrderGroup.moveOrderGroupsList(non_meds_hdr_table, orderGroupSortList);
					
					orderGroupSortList = orderGroupEntityList.map(function (obj) {
						return (obj.med_ind === 0 && obj.discontinued_ind === 0 && obj.suspended_ind === 1);
					});
					SortIt(orderGroupSortList, sortOrder, sortAttr);
					GlobalAjaxCclHandler.append_text("<br/> Suspended Non-med Order Group Entity list <br/>");
					GlobalAjaxCclHandler.append_json({
						"orderGroupEntityList": orderGroupSortList
					});
					OrderGroup.moveOrderGroupsList(non_meds_hdr_table, orderGroupSortList);
								
					orderGroupSortList = orderGroupEntityList.map(function (obj) {
						return (obj.med_ind === 0 && obj.discontinued_ind === 0 && obj.suspended_ind === 0);
					});
					SortIt(orderGroupSortList, sortOrder, sortAttr);
					GlobalAjaxCclHandler.append_text("<br/> Active Non-med Order Group Entity list <br/>");
					GlobalAjaxCclHandler.append_json({
						"orderGroupEntityList": orderGroupSortList
					});
					OrderGroup.moveOrderGroupsList(non_meds_hdr_table, orderGroupSortList);
				}
			}

			//Apply order group css
			orderGroupCSS = [" ", " "];
			orderGroupCSS[0] += " tbl-fxd-body-tr-blue";
			orderGroupCSS[1] += " tbl-fxd-body-tr-white";
			
			orderGroupCSS[0] += " tbl-fxd-body-tr-border";
			orderGroupCSS[1] += " tbl-fxd-body-tr-border";
			
			
			OrderGroup.setOrderGroupsCSS(orderGroupCSS);
			
			//Apply Hx Resume orders
			orderGroupHxResumeList = orderGroupEntityList.map(function (obj) {
				try {
					var return_value, new_order_entity, most_recent_order_entity, dom_cur_row;
					
					if ((obj.first_order_col_index === 0 && obj.hx_resume_ind === 1) || obj.most_recent_resume_ind === 1) {
						// disable actions on most recent entity
						most_recent_order_entity = orderActionEntityList.get(obj.most_recent_order_action_entity_id);
						most_recent_order_entity.status_type = RESUME_STATUS_FLAG;
						/* Disable most recent Order Action Selectors */
						OrderableDisplay.setHistoricalActionSelector(most_recent_order_entity);
						
						most_recent_order_entity.excl_ind = 1;
						most_recent_order_entity.actionable_ind = 0;
						
						orderActionEntityList.put(obj.most_recent_order_action_entity_id, most_recent_order_entity);
						//display order in discharge column
						dom_cur_row = most_recent_order_entity.row_obj;
						if (obj.first_order_col_index === 0 && obj.hx_resume_ind === 1) {
							new_order_entity = copyOrderActionEntity(orderActionEntityList.get(obj.first_order_action_entity_id));
							new_order_entity.order_status_type = "RESUMED";
							new_order_entity.status_type = RESUME_STATUS_FLAG;
							new_order_entity.orig_ord_dt_tm = obj.hx_resume_dt_tm;
							new_order_entity.order_phy_name = obj.hx_resume_prsnl;
						} else {
							new_order_entity = copyOrderActionEntity(orderActionEntityList.get(obj.most_recent_order_action_entity_id));
							new_order_entity.order_status_type = "CONTINUED_NON_RX";
							new_order_entity.status_type = RX_CONTINUE_STATUS_FLAG;
							new_order_entity.orig_ord_dt_tm = obj.most_recent_resume_dt_tm;
							new_order_entity.order_phy_name = obj.most_recent_resume_prsnl;
						}
						new_order_entity.col_index = totalColumns;
						new_order_entity.row_obj = dom_cur_row;
						new_order_entity.order_ind = 1;
						new_order_entity.hashmap_key = "" + dom_cur_row.id + totalColumns;
						orderActionEntityList.put(new_order_entity.hashmap_key, new_order_entity);

						displayTargetRowNode = dom_cur_row;
						displayTargetColumnIndex = totalColumns;
						displayTargetInpatientInd = 0;
						displayTargetActionanbleInd = -1;
						displayTargetExpandFlag = -1;
						
						OrderableDisplay.addOrderDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd);
						/* Disable Order Action Selectors */
						OrderableDisplay.toggleActionSelectors(new_order_entity, false);

						return_value = true;
					} else {
						return_value = false;
					}
					return return_value;
				} catch (e) {
					alert(obj.order_group_id);
				}
			});
			// Update Action
			orderActionEntityList.map(function (obj) {
				var return_value = false;
				if (obj.order_ind && obj.order_ind === 1) {
					// Add to total order count unless med was discontinued
					OrdersLayout.addTotalOrders(obj.col_index, 1);
					// add to total meds count
					if (obj.med_ind === 1 && obj.actionable_ind === 1) {
						OrdersLayout.addMedOrder(obj.col_index);
					}

					if (obj.status_type === ACK_STATUS_FLAG) {
						// Remove from total order count is acknowledged
						OrdersLayout.addTotalOrders(obj.col_index, -1);
						return_value = true;
					} else if (obj.actionable_ind !== 1) {
						// Add to actioned order count
						OrdersLayout.addActionedOrders(obj.col_index, 1);
						return_value = true;
					} else {
						return_value = false;
					}
				}
				return return_value;
			});
			OrdersLayout.updateTotalOrdersDisplay(0);
			_g("recon_status_bar").style.display = "";
			if (preInd === 0 || json_data.REC_DATA[1].MEDRECORDERS.GROUPS.length === 0) { // no pre-admission medications found
				var message_position = "";
				cur_order_group = OrderGroup.createOrderGroup("preadmit_group", meds_hdr_table);
				cur_order_rows = OrderGroup.createOrderRows(cur_order_group, "preadmit_row_1", 0);
				cur_row = cur_order_rows[0];
				Util.de(cur_row);
				cur_row = cur_order_rows[1];
				message_position = "relative";
				cur_row.className = 'tbl-fxd-body-tr-white col-row';

				cur_row.style.display = "";
				cur_order_group.className = "med-order";
				cur_order_group.rowSpan = orders_table.rows.length;
				cur_row.style.background = "";
				OrderGroup.moveOrderGroup(meds_table, cur_order_group);
				
				cur_row.cells[0].innerHTML  =
					["<div id=\"no_pre_meds_div\" style=\"position:" + message_position + ";width:99%;z-index:0;\">",
						"<span id=\"no_pre_meds\" style=\"font-weight:bold;padding-top:10px;display:none;\">Patient has no documented pre-admission medications.",
						"</span><form style=\"text-align:left\"><fieldset><legend>Medication History</legend>",
						"<input class='sel-compl' type='checkbox' id='nohxmeds' disabled onclick=\"javascript:TableColumn.UpdtTextPreadmit(this);\">Unable To Obtain Information<br/>",
						"<input class='sel-compl' type='checkbox' id='nokhxmeds' disabled onclick=\"javascript:TableColumn.UpdtTextPreadmit(this);\">No Known Home Medications<br/>",
						"<input class='sel-compl' type='checkbox' id='uselastcomp' disabled onclick=\"javascript:TableColumn.UpdtTextPreadmit(this);\">Use Last Compliance<br/>",
						"<input type=\"button\" value=\"Done\" onclick=\"javascript:MedRec.updateMedHistory()\" style=\"float:right;padding:right:5px\"/></fieldset></form></div>"].join("");
			
				nohxmeds = _g("nohxmeds");
				nokhxmeds = _g("nokhxmeds");
				uselastcomp = _g("uselastcomp");
				nohxmeds.disabled = false;
				nokhxmeds.disabled = false;
				uselastcomp.disabled = false;
				// Hide column only if no pre admit order not found on previous encounter
				if (preAdmitPrevEncntrInd === 0) {
					cur_row.cells[0].style.visibility = "visible";
					cur_row.cells[0].style.display = "block";	
					// disable use last compliance if no orders previous encounter
					uselastcomp.disabled = true;	
					Util.Style.acss(uselastcomp, "sel-disabled");
				}
				else {
					// disable no known medications if hx orders previous encounter
					nokhxmeds.disabled = true;	
					Util.Style.acss(nokhxmeds, "sel-disabled");
				}
				if (criterion.med_history_unable_to_obtain_ind === 1) {
					nohxmeds.checked = true;
					TableColumn.UpdtTextPreadmit(nohxmeds);
				}
				else if (criterion.med_history_no_known_home_meds_ind === 1 && !nokhxmeds.disabled) {
					nokhxmeds.checked = true;
					TableColumn.UpdtTextPreadmit(nokhxmeds);					
				}				
				else if (criterion.med_history_use_last_compliance === 1 && !uselastcomp.disabled) {
					uselastcomp.checked = true;
					TableColumn.UpdtTextPreadmit(uselastcomp);
					cur_order_group.style.display = "none";
					_g("no_pre_meds_div").style.display = "none";
				}
			}
		} catch (e) {
			GlobalAjaxCclHandler.append_text("ERROR fillOrders");
			errorHandler(e, "fillOrders()");
		}
	}
	
	function getMedicationCategoryClass(orderGroup) {
		var medicationCategory = orderGroup.medicationCategory;
		var med_cat_class = "sched-med-order";
		if (orderGroup.suspended_ind === 1 || orderGroup.discontinued_ind === 1) {
			med_cat_class = "susp-med-order";
		}
		else {
			switch (medicationCategory) {
			case "SCHEDULED": 
				med_cat_class = "sched-med-order";
				break;
			case "PRN": 
				med_cat_class = "prn-med-order";
				break;
			case "IV":
				med_cat_class = "iv-med-order";
				break;
			}
		}
		return med_cat_class;
	}


	function loadOrdersTable(json_response) {
		try {
			var json_data = json_response.response,
				locs_tabs = _g("locs_tabs"),
				img_load = _g("img-load-initial"),
				hiddenColumns,
				storedTotalColumns,
				discontinuedOrders,
				discontinuedOrdersCnt = 0,
				collapsibleHeader,
				discontinuedLookBackDays = parseInt(Preferences.get("discontinuedDays"), 10),
				dcMedsCollapsibleHeader = null,
				dcOrdsCollapsibleHeader = null;

			Preferences.set("layoutPreferences", json_data.REC_DATA[2].MEDSRECLAYOUT);
			img_load.style.display = "none";

			if (Preferences.get("rowBorder")) {
				orders_table.border = "1";
				orders_table.rules = "groups";
				orders_table.frame = "hsides";
			}
			
			OrdersLayout.setParent(orders_table);
			OrderGroup.setTable(orders_table);
			OrdersLayout.buildTable(json_data.REC_DATA[0]);
			OrderGroup.setTableColumns(meds_hdr_table);
			
			locs_tabs.innerHTML = OrdersLayout.getLocationTabs();
			TableColumn.initializeLocks();
			totalColumns = meds_hdr_table.rows[0].cells.length - 1;
			
			// Save med history information
			criterion.med_history_unable_to_obtain_ind = parseInt(json_data.REC_DATA[1].MEDRECORDERS.UNABLE_TO_OBTAIN_IND, 10); 
			criterion.med_history_no_known_home_meds_ind = parseInt(json_data.REC_DATA[1].MEDRECORDERS.NO_KNOWN_HOME_MEDS_IND, 10); 
			criterion.med_history_use_last_compliance = parseInt(json_data.REC_DATA[1].MEDRECORDERS.USE_LAST_COMPLIANCE_IND, 10); 
			criterion.encntr_compliance_status_flag = parseInt(json_data.REC_DATA[1].MEDRECORDERS.ENCNTR_COMPLIANCE_STATUS_FLAG, 10); 
			
			fillOrders(json_data);
			hiddenColumns = OrderGroup.getHiddenColumns();
			storedTotalColumns = parseInt(Windowstorage.get("storedTotalColumns"), 10);
			// Show default tabs on initial page load
			// or when the total number of columns have changed since last refresh
			if (hiddenColumns.length === 0 || (storedTotalColumns && storedTotalColumns !== totalColumns)) {
				hiddenColumns = [];
				hiddenColumns[0] = false;
				hiddenColumns[totalColumns - 1] = false;
				hiddenColumns[totalColumns] = false;
				OrderGroup.setHiddenColumns(hiddenColumns);
			}
			
			OrderGroup.setVisibleSubColumnsLength(0);
			for (var i = 0; i < meds_hdr_table.rows[0].cells.length; i++) { // hide columns between
				if (hiddenColumns[i] === false || hiddenColumns[i] === "false") {
					locs_tabs_list.tabShow(i);
					locs_tabs_list.selectedTabs.push(i);
					OrderGroup.toggleTableColumnDisplay(i, "");
				} else {
					OrderGroup.toggleTableColumnDisplay(i, "none");
				}
			}
			// set current column locations to be used by the location selector
			OrdersLayout.setCurrentColumnLocations(locs_tabs_list.selectedTabs);
			

			// Meidcations found or if no pre-admit medications found
			if (med_count > 0 || _g("no_pre_meds_div")) {
				var hideMedCollapse = false;
				// If Preference is set to display medication Groupings
				if (Preferences.get("medicationGroupingInd") === 1) {
					hideMedCollapse = true;
				}	
				// Create Collapsible Meds and Non Meds Header
				med_collapsible_hdr = OrderGroup.insertCollapsibleHeader({
					"insertAfterRow": meds_table,
					"headerName": "&nbsp;Medications",
					"collapseCSS": "med-order",
					"collapseDefault": 0,
					"hideCollapse": hideMedCollapse
				});
			}
			
			if (non_med_count > 0) {
				non_med_collapsible_hdr = OrderGroup.insertCollapsibleHeader({
					"insertAfterRow": non_meds_hdr_table,
					"headerName": "&nbsp;Orders",
					"collapseCSS": "non-med-order",
					"collapseDefault": 0
				});
			}
			// Apply discontinued order preferences
			if (discontinuedLookBackDays >= 0) {
				// meds
				discontinuedOrders = orderGroupEntityList.map(function (obj) {
					try {
						var cur_disc_dt = new Date();
						if (obj.discontinued_dt_tm > " ") {
							cur_disc_dt.setISO8601(obj.discontinued_dt_tm);
						}
						return (obj.med_ind === 1 && obj.discontinued_ind === 1 && obj.discontinued_dt_tm > " " &&
								(((cur_dt_tm.getTime() - cur_disc_dt.getTime()) / ONE_DAY) > discontinuedLookBackDays));
					} catch (e) {
						alert(obj.order_group_id);
					}
				});
				SortIt(discontinuedOrders, 1, "discontinued_dt_tm");
				GlobalAjaxCclHandler.append_text("<br/> Discontinued Medications older than " + discontinuedLookBackDays + " days Order Group Entity list <br/>");
				GlobalAjaxCclHandler.append_json({
					"orderGroupEntityList": discontinuedOrders
				});
				
				discontinuedOrdersCnt = discontinuedOrders.length;
				if (discontinuedOrdersCnt > 0) {
					dcMedsCollapsibleHeader = OrderGroup.insertCollapsibleHeader({
						"insertAfterRow": Util.gps(non_meds_hdr_table),
						"headerName": "&nbsp;Discontinued Medications older than " + discontinuedLookBackDays + " Days",
						"collapseCSS": "tbl-fxd-body-tr-grey",
						"collapseDefault": 1
					});
					for (var i = 0; i < discontinuedOrdersCnt; i++) {
						OrderGroup.moveOrderGroup(dcMedsCollapsibleHeader, _g(discontinuedOrders[i].order_group_id));
						_g(discontinuedOrders[i].order_group_id).style.display = "none";
					}
				}
				
				// non meds
				discontinuedOrders = orderGroupEntityList.map(function (obj) {
					try {
						var return_value, cur_disc_dt = new Date();
						if (obj.discontinued_dt_tm > " ") {
							cur_disc_dt.setISO8601(obj.discontinued_dt_tm);
						}
						return (obj.med_ind === 0 && obj.discontinued_ind === 1 && obj.discontinued_dt_tm > " " && 
								(((cur_dt_tm.getTime() - cur_disc_dt.getTime()) / ONE_DAY) > discontinuedLookBackDays));
					} catch (e) {
						alert(obj.order_group_id);
					}
				});
				SortIt(discontinuedOrders, 1, "discontinued_dt_tm");
				GlobalAjaxCclHandler.append_text("<br/> Discontinued Orders older than " + discontinuedLookBackDays + " days Order Group Entity list <br/>");
				GlobalAjaxCclHandler.append_json({
					"orderGroupEntityList": discontinuedOrders
				});
				
				discontinuedOrdersCnt = discontinuedOrders.length;
				if (discontinuedOrdersCnt > 0) {
					dcOrdsCollapsibleHeader = OrderGroup.insertCollapsibleHeader({
						"insertAfterRow": Util.gps(orders_table.tBodies[orders_table.tBodies.length - 1]),
						"headerName": "&nbsp;Discontinued Orders older than " + discontinuedLookBackDays + " Days",
						"collapseCSS": "tbl-fxd-body-tr-grey",
						"collapseDefault": 1
					});
					for (var i = 0; i < discontinuedOrdersCnt; i++) {
						OrderGroup.moveOrderGroup(dcOrdsCollapsibleHeader, _g(discontinuedOrders[i].order_group_id));
						_g(discontinuedOrders[i].order_group_id).style.display = "none";
					}
				}
				// Hide collapsible header if look back days = 0
				if (discontinuedLookBackDays === 0) {
					if (dcMedsCollapsibleHeader !== null) {
						dcMedsCollapsibleHeader.style.display = "none";
						$(dcMedsCollapsibleHeader).find(".toggle-collapsible-header").get(0).click();
						Util.de(dcMedsCollapsibleHeader);
					}
					if (dcOrdsCollapsibleHeader !== null) {
						dcOrdsCollapsibleHeader.style.display = "none";
						$(dcOrdsCollapsibleHeader).find(".toggle-collapsible-header").get(0).click();
						Util.de(dcOrdsCollapsibleHeader);
					}
				}
			}
			non_meds_hdr_table.style.display = "none";
			
				// If no preadmit medications found & table height is smaller, set the preadmit medication div to relative
			if (_g("no_pre_meds_div") && (getTotalGroupHeight('med-order') < _g("no_pre_meds_div").offsetHeight)) {
				// Add new row to pad
				var cur_order_group = OrderGroup.createOrderGroup("preadmit_group_padding_row", meds_hdr_table),
					cur_order_rows = OrderGroup.createOrderRows(cur_order_group, "preadmit_row_2", 0),
					cur_row = cur_order_rows[0],
					paddingHeight = (_g("no_pre_meds_div").offsetHeight  - getTotalGroupHeight('med-order')) - 10;
				// check to avoid negative height
				paddingHeight = paddingHeight > 0 ? paddingHeight : 0; 
				Util.de(cur_row);
				cur_order_group.className = "med-order";
				cur_row = cur_order_rows[1];
				cur_row.style.display = "";
				cur_row.style.height = paddingHeight + "px";
				cur_row.cells[0].innerHTML = "&nbsp;";
				cur_row.cells[0].style.height = paddingHeight + "px";				
				OrderGroup.moveOrderGroup(OrderGroup.findLastGroup("med-order", med_collapsible_hdr), cur_order_group);
			}
			
			// set the display of the select all icons if we are showing them
			if (Preferences.get("selectAll")) {
				OrdersLayout.setAllSelectAllIconDisplays();
			}

			resizePage();
		} catch (e) {
			errorHandler(e, e.message + " - >  loadOrdersTable()");
		}
	}

	function appendOrderComment(orderId, commentText) {
		var currentComment = [];		
		if (commentText && commentText > " " && commentText !== undefined) {
			commentText = commentText.encodeStringDelimiters();
			currentComment.push("{");
			currentComment.push('  "order_id":  ', parseFloat(orderId).toFixed(2));
			currentComment.push(', "action_sequence":  1');
			currentComment.push(', "order_comment":  "', commentText, '"');
			currentComment.push("}");
			orderComments[orderComments.length] = currentComment.join("");
		}
	}
	
	function purge(d) {
		if (d) {
			var a = d.attributes, i, l, n;
			if (a) {
			    l = a.length;
			    for (i = 0; i < l; i++) {
			        n = a[i].name;
			        if (typeof d[n] === 'function') {
			            d[n] = null;
			        }
			    }
			}
			a = d.childNodes;
			if (a) {
			    l = a.length;
			    for (i = 0; i < l; i++) {
			        purge(d.childNodes[i]);
			    }
			}
		}
	}
	
	function clearTableData() {
		var tableHTML = [];	
		tableHTML.push('<table id="table_orders" class="tbl-fxd">');
		tableHTML.push('<thead id="section_hdr_meds" class="tbl-fxd-hdr"></thead>');
		tableHTML.push('<thead  id="section_hdr_non_meds" ></thead>');
		tableHTML.push('<tbody id="section_meds" class="tbl-fxd-body"></tbody>');
		tableHTML.push('</table>');
		tableHTML.push(img_loader);
		_g("div_tbl_outer").innerHTML = tableHTML.join("");
	}
	
	function getDiscontinuedHxOrders() {
		var dcGroups = Util.Style.g("tbl-fxd-body-tr-grey", orders_table, "tbody"),
			cntr = 0,
			len = dcGroups.length,
			cur_order_action_entity,
			dcCntr = 0,
			dcOrderList = [];
		for (cntr = 0; cntr < len; cntr++) {
			cur_order_action_entity = orderActionEntityList.get(dcGroups[cntr].rows[0].id + 0 + "");
			if (cur_order_action_entity && cur_order_action_entity !== null) {
				dcOrderList[dcCntr] = {};
				dcOrderList[dcCntr].ORDER_NAME = cur_order_action_entity.order_name + " (" + cur_order_action_entity.order_as_mnemonic + ") ";
				dcOrderList[dcCntr].ORDER_DETAIL_LINE = cur_order_action_entity.order_details;
				dcOrderList[dcCntr].ORDER_COMMENTS = "";
				dcOrderList[dcCntr].ORDERING_PHYSICIAN = "";
				dcCntr++;
			}	 
		}
		return dcOrderList;
	}
	
	function getcellIndex(rowDOM, cellDOM) {
		var cellCnt = rowDOM.cells.length, cellCntr;
		for (cellCntr = 0;cellCntr < cellCnt; cellCntr++) {
			if (rowDOM.cells[cellCntr] === cellDOM) {
				return cellCntr;
			}
		}
		return -1;
	}
	
	function getActionColumn(action_entity, action_type) {
		var action_column = action_entity.col_index;
		
		// Discontinued status
		if (action_entity.status_type === DC_STATUS_FLAG) {
			// Re-starting order -> increment counter on latest inpatient
			if (action_type === RESTART_ACTION_FLAG) {
				action_column = (totalColumns - 1);
			}
			else if (action_type === RESUME_ACTION_FLAG) {
				// Resuming order -> increment counter on discharge column
				action_column  = totalColumns;
			}
		}
			
		// Actions on home-med orders
		if (action_entity.col_index === 0) {
			// Acknowledged action Home-med order -> should count towards inpatient column
			if (action_entity.status_type === ACK_STATUS_FLAG) {
				action_column = (totalColumns - 1);
			}
			// Resumed -> should count towards discharge column
			else if (action_entity.status_type === RESUME_STATUS_FLAG) {
				// Resuming order -> increment counter on discharge column
				action_column = totalColumns;
			}
		}
		return action_column;
	}
	
	function evalItemAction(action_entity_key, action_type, disch_flag) {
		try {
			var action_entity = orderActionEntityList.get(action_entity_key),
				first_action_entity,
				cur_ord_group_entity,
				prev_ord_action_entity,
				next_ord_action_entity,
				nextEntityKey,
				dom_cur_row,
				action_success = 0,
				action_column;
			action_entity.prev_action_type = action_entity.action_type;
			action_entity.action_type = action_type;
			
			// Get the first action entity
			if (action_entity.order_group_id) {
				cur_ord_group_entity = orderGroupEntityList.get("order_group_" + action_entity.order_group_id);
				if (cur_ord_group_entity && cur_ord_group_entity.first_order_col_index === 0) {
					first_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);
				}
			}
					
			if (action_type === RESUME_ACTION_FLAG) {
				if (first_action_entity) {
					action_success = 1;
					dom_cur_row = action_entity.row_obj;
					nextEntityKey = dom_cur_row.id + (totalColumns);
					action_entity.next_hashmap_key = nextEntityKey;
					/* Disable Previous Order Action Selectors */
					OrderableDisplay.setPreviousActionSelector(action_entity, action_type);
	
					// Recon Resume with Home Med Details
					next_ord_action_entity = copyOrderActionEntity(first_action_entity);
					next_ord_action_entity.prev_col_index = action_entity.col_index;
					next_ord_action_entity.col_index = totalColumns;
					next_ord_action_entity.action_type = 1;
					next_ord_action_entity.recon_order_action_mean = "RECON_RESUME";
					next_ord_action_entity.hashmap_key = nextEntityKey;
					next_ord_action_entity.order_phy_name = criterion.prsnl_name;
					orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity);
					OrderableDisplay.addOrderableDisplay(dom_cur_row, totalColumns, 0, 0, -1);
					OrderableDisplay.addOrderableJson(next_ord_action_entity);
				}
			} else { 
				if (action_type > 0) { // Non-remove Actions
					if (action_type === CONTINUE_AS_NON_RX_ACTION_FLAG) { // Order as Nursing
						action_success = 1;
						dom_cur_row = action_entity.row_obj;
						nextEntityKey = dom_cur_row.id + totalColumns;
						action_entity.next_hashmap_key = nextEntityKey;
						/* Clear display of orderable */
						OrderableDisplay.clearDisplay(action_entity);
						/* Disable Previous Order Action Selectors */
						OrderableDisplay.setPreviousActionSelector(action_entity, action_type);
						
						// Recon Do Not Convert for current Inpatient Med
						prev_ord_action_entity = orderActionEntityList.get(action_entity.row_obj.id + action_entity.prev_col_index);
						prev_ord_action_entity.recon_order_action_mean = "RECON_DO_NOT_CNVT";
						prev_ord_action_entity.action_type = 3;
						prev_ord_action_entity.parent_clin_disp = action_entity.clin_disp;
						prev_ord_action_entity.parent_simp_disp = action_entity.order_details;
						if (prev_ord_action_entity.order_details === "") {
							prev_ord_action_entity.order_details = action_entity.order_details;
						}
						prev_ord_action_entity.parent_mnemonic = prev_ord_action_entity.order_name + " (" + prev_ord_action_entity.order_as_mnemonic + ")";
						prev_ord_action_entity.parent_syn_id = prev_ord_action_entity.synonym_id;
						prev_ord_action_entity.parent_snt_id = prev_ord_action_entity.sentence_id;
						prev_ord_action_entity.next_col_index = totalColumns;
						OrderableDisplay.addOrderableJson(prev_ord_action_entity);
						
						// Recon Resume with current Inpatient Med
						action_entity = copyOrderActionEntity(prev_ord_action_entity);
						action_entity.col_index = totalColumns;
						action_entity.prev_col_index = totalColumns - 1;
						action_entity.action_type = 1;
						action_entity.recon_order_action_mean = "RECON_NON_MED_RX";
						action_entity.hashmap_key = nextEntityKey;
						action_entity.order_phy_name = criterion.prsnl_name;
						orderActionEntityList.put(action_entity.hashmap_key, action_entity);
						OrderableDisplay.addOrderableDisplay(dom_cur_row, totalColumns, 0, 0, -1);
						OrderableDisplay.addOrderableJson(action_entity);
					} else if (action_type === ACK_ACTION_FLAG) { // acknowledge on
						action_success = 1;
						dom_cur_row = action_entity.row_obj;
						nextEntityKey = dom_cur_row.id + (totalColumns - 1);
						action_entity.next_hashmap_key = nextEntityKey;
						/* Disable Previous Order Action Selectors */
						OrderableDisplay.setPreviousActionSelector(action_entity, action_type);
						
						next_ord_action_entity = copyOrderActionEntity(action_entity);
						next_ord_action_entity.prev_col_index = action_entity.col_index;
						next_ord_action_entity.col_index = totalColumns - 1;
						next_ord_action_entity.action_type = ACK_ACTION_FLAG;
						next_ord_action_entity.recon_order_action_mean = "RECON_DO_NOT_CNVT";
						next_ord_action_entity.hashmap_key = nextEntityKey;
						next_ord_action_entity.order_phy_name = criterion.prsnl_name;
						orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity);
						OrderableDisplay.addOrderableJson(next_ord_action_entity);
					} else {
						if (action_entity.status_type === DC_STATUS_FLAG) {
							// Restart action only
							if (action_type === RESTART_ACTION_FLAG) {
								action_success = 1;
								evalRestartAction(action_entity);
							} else {
								actionDone();
							}
						} else {
							action_success = 1;
							evalAction(action_entity, 0, action_type);
						}
					}	
				} else { //Remove Action
					prev_ord_action_entity = OrderableDisplay.getPreviousActionEntity(action_entity);
				
					// Remove orderable data
					OrderableDisplay.removeOrderable(action_entity, disch_flag);
					
					// Remove any action applied on the first orderable in the group
					if (first_action_entity) {
						OrderableDisplay.removeOrderable(first_action_entity, disch_flag);
					}

					/* Clear display of orderable */
					OrderableDisplay.clearDisplay(action_entity);			
					
					/* Re-build Previous Order Action Selectors */
					OrderableDisplay.resetActionSelectors(prev_ord_action_entity);
					
												
					/* Update Orderable Queue */
					if (prev_ord_action_entity.col_index > 0) {	
						action_column = getActionColumn(action_entity, action_entity.action_type);	
					} else {
						action_column = getActionColumn(prev_ord_action_entity, prev_ord_action_entity.action_type);
					}	
					OrdersLayout.addToOrderableQueue(action_column, -1);
				}
			}
			
			if (action_success === 1) { //if action successful
				if ((action_type > 0 && action_type !== 6) || disch_flag === 1) {
					/* Disable Current Order Action Selectors */
					/* Update Orderable Queue */
					if (action_entity.col_index > 0) {
						OrdersLayout.addToOrderableQueue(action_entity.next_col_index, 1);
					} else {
						action_column = getActionColumn(action_entity, action_type);						
						OrdersLayout.addToOrderableQueue(action_column, 1);
					}
				}
			}
		} catch (e) {
	        errorHandler(e, "evalItemAction() ");//+action_entity.parent_row_obj.id+"---"+action_entity.row_obj.id)
		}
	}
	
	/***** Load JSON methods ****/
	function loadConvertedRx(json_response) {
		try {	
			var json_rx_data = json_response.response,
				recordName = "RMED",
				cnt = 0,
				cntr = 0,
				order_display,
				order_mnemonic,
				json_response_params = json_response.parameters,
				disch_flag = parseInt(json_response_params[0], 10),
				dom_beg_row = json_response_params[1],
				dom_dest_row = json_response_params[2],
				prev_col_index = parseInt(json_response_params[3], 10),
				col_index = parseInt(json_response_params[4], 10),
				opt_sel = parseInt(json_response_params[5], 10),
				cur_ord_action_entity = orderActionEntityList.get(dom_dest_row.id + col_index),
				prev_ord_action_entity = orderActionEntityList.get(dom_beg_row.id + cur_ord_action_entity.prev_col_index),
				medOrderInd = parseInt(cur_ord_action_entity.med_ind, 10),
				pharmacyIvInd = parseInt(cur_ord_action_entity.pharmacy_iv_ind, 10),
				displayTargetRowNode,
				displayTargetColumnIndex, 
				displayTargetInpatientInd,
				displayTargetActionanbleInd, 
				displayTargetExpandFlag = -1; 
			cur_ord_action_entity.prev_col_index = prev_col_index;
				
			if (cur_ord_action_entity) {
				if (disch_flag === 0) {
					if (opt_sel === 2) {
						if (medOrderInd === 1 && pharmacyIvInd === 0) { // Medication and not a pharmacy IV
							displayTargetExpandFlag = 0;
						}
					}
					else if (opt_sel === 1) {
						displayTargetExpandFlag = 3;
					}
					else if (opt_sel === 4) {
						displayTargetExpandFlag = 2;
					}
				}
				if (json_rx_data[recordName].SYNCNT > 0) {
					var syn_str = [];
					syn_str.push('{"ord_syns":{"synonyms_cnt":' + json_rx_data[recordName].SYNCNT + ',"synonyms":[');
					for (cntr = 0, cnt = json_rx_data[recordName].SYNCNT; cntr < cnt; cntr++) {
						syn_str.push("{");
						syn_str.push('"synonym_id":' + parseInt(json_rx_data[recordName].SYN[cntr].SYNONYM_ID, 10) + '.0');
						syn_str.push("}");
					}
					syn_str.push("]}}");
					
					if (disch_flag === 0 && (opt_sel === 1 || opt_sel === 4) && json_rx_data[recordName].SYNCNT > 1) {
						displayTargetExpandFlag = 2;
					}
				
					cur_ord_action_entity.sentence_id = 0;
					cur_ord_action_entity.order_details = " ";
														
					cur_ord_action_entity.synonym_id = json_rx_data[recordName].SYN[0].SYNONYM_ID;
					cur_ord_action_entity.order_name = json_rx_data[recordName].SYN[0].DISPLAY;
					cur_ord_action_entity.order_comment = json_rx_data[recordName].SYN[0].ORDER_COMMENT;
					cur_ord_action_entity.order_as_mnemonic = json_rx_data[recordName].SYN[0].MNEMONIC;
										
					cur_ord_action_entity.synonyms = syn_str.join("");
					cur_ord_action_entity.synonyms_cnt = parseInt(json_rx_data[recordName].SYNCNT, 10);
					cur_ord_action_entity.order_sentence = new OrderSentence(json_rx_data[recordName].SYN[0].DETAILS);
					cur_ord_action_entity.order_sentence.setAttribute("SYNONYM_ID", json_rx_data[recordName].SYN[0].SYNONYM_ID);
					cur_ord_action_entity.order_sentence.setAttribute("OE_FORMAT_ID", json_rx_data[recordName].SYN[0].OE_FORMAT_ID);
					cur_ord_action_entity.order_sentence.listenFocusIn(OrderableDisplay.focusCell, cur_ord_action_entity);
					cur_ord_action_entity.order_sentence.listenFocusOut(OrderableDisplay.unfocusCell, cur_ord_action_entity);
					
				}
				else {
					cur_ord_action_entity.sentence_id =  0;
					cur_ord_action_entity.synonyms_cnt = 0;
					cur_ord_action_entity.order_details = " ";
				}
				if (opt_sel === 4) {			
					cur_ord_action_entity.recon_order_action_mean = "CANCEL REORD";
				}
				else {
					if (medOrderInd === 1 && pharmacyIvInd === 0) { // Medication and not a pharmacy IV
						cur_ord_action_entity.recon_order_action_mean = "CONVERT_RX";
					}
					else {
						cur_ord_action_entity.recon_order_action_mean = "RECON_NON_MED_RX";
						// exclude order sentence
						delete cur_ord_action_entity.order_sentence;
						// set display from previous 
						cur_ord_action_entity.order_details = prev_ord_action_entity.clin_disp;
					}
				}
				
				// invalid synonym
				if (json_rx_data[recordName].SYNCNT === 1) {
					if (json_rx_data[recordName].SYN[0].VIRTUAL_VIEW_IND === 1 || json_rx_data[recordName].SYN[0].HIDDEN_SYNONYM_IND === 1 || json_rx_data[recordName].SYN[0].INACTIVE_SYNONYM_IND === 1) {
						cur_ord_action_entity.invalid_synonym_ind = 1;						
					}
				}
			
				orderActionEntityList.put(dom_dest_row.id + col_index, cur_ord_action_entity); 
					
				// Build display
				if (disch_flag === 1) { //auto converted discharge order => has actions
					displayTargetRowNode = dom_dest_row;
					displayTargetColumnIndex = col_index;
					displayTargetInpatientInd = 0;
					displayTargetActionanbleInd = 1;
					OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
					
				}
				else { // normal order
					// expand options for keep or restart
					if (opt_sel === 1 || opt_sel === 4) {
						if (cur_ord_action_entity.synonyms_cnt === 0) {
							displayTargetExpandFlag = 2;
						}
					}
					displayTargetRowNode = dom_dest_row;
					displayTargetColumnIndex = col_index;
					displayTargetInpatientInd = 0;
					displayTargetActionanbleInd = 0;
					OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
				}
				
				if (disch_flag === 0) { // normal order
					OrderableDisplay.addOrderableJson(cur_ord_action_entity);
				}
				// Attempting to keep an invalid synonym
				if (cur_ord_action_entity.invalid_synonym_ind === 1 && (json_rx_data[recordName].SYNCNT === 1 || json_rx_data[recordName].SYNCNT === 0)) {
					var message = "The following are invalid prescription order catalog synonym(s). To select an alternative, choose the modify icon next to the medication order";
					addtoMessageStack(message, json_rx_data[recordName].SYN[0].MNEMONIC);
					// clear orderable
					MedRec.evalItemAction(cur_ord_action_entity.hashmap_key, 0, 0);
				}					
				actionDone();
			}
		} catch (e) {
	        errorHandler(e, "loadConvertedRx()");
		}
	}
	
	function actionDone() {
		if (actionsSize > 0) {
			actionsSize -= 1;
		}
		if (actionsSize === 0) {
			displayMessageStack();
		}
	}
	
	function addtoMessageStack(key, value) {
		if (!stackMessages[key]) {
			stackMessages[key] = [];
		}
		stackMessages[key][stackMessages[key].length] = value;		
	}
	
	function initializeMessageStack() {
		stackMessages = {};
	}
	
	function displayMessageStack() {
		var headers = _.keys(stackMessages), messages, messageContent = "";
		
		if (headers && headers.length > 0) {
			_.each(headers, function (header) {
				messages = stackMessages[header];
				if (messages && messages.length > 0) {
					messageContent += "\n" + header + " :\n";
					_.each(messages, function (message) {
						messageContent += "\n	" + message;
					});
				}
			});
			alert(messageContent);
			initializeMessageStack();
		}
	}
	
	function loadConvertedInpatient(json_response) {
		try {
			var json_rx_data = json_response.response, 
				json_response_params = json_response.parameters,
				dom_beg_row = json_response_params[0],
				dom_dest_row = json_response_params[1],
				prev_col_index = parseInt(json_response_params[2], 10),
				col_index = parseInt(json_response_params[3], 10),
				opt_sel = parseInt(json_response_params[4], 10),
				cnt = 0,
				cntr = 0,
				order_mnemonic,
				order_display,
				expandFlag = -1,
				cur_ord_action_entity = orderActionEntityList.get(dom_dest_row.id + col_index),
				prev_ord_action_entity = orderActionEntityList.get(dom_beg_row.id + col_index),
				displayTargetRowNode,
				displayTargetColumnIndex, 
				displayTargetInpatientInd,
				displayTargetActionanbleInd, 
				displayTargetExpandFlag = -1; 
			
			if (cur_ord_action_entity) {
				if (json_rx_data.RMED.SYNCNT > 0) {
					var syn_str = [];
					syn_str.push('{"ord_syns":{"synonyms_cnt":' + json_rx_data.RMED.SYNCNT + ',"synonyms":[');
					for (cntr = 0, cnt = json_rx_data.RMED.SYNCNT; cntr < cnt; cntr++) {
						syn_str.push("{");
						syn_str.push('"synonym_id":' + parseInt(json_rx_data.RMED.SYN[cntr].SYNONYM_ID, 10) + ".0");
						syn_str.push("}");
					}
					syn_str.push("]}}");
					
					
					cur_ord_action_entity.sentence_id = 0;
					cur_ord_action_entity.order_details = " ";
										
					if (json_rx_data.RMED.SYNCNT === 1) {
						cur_ord_action_entity.synonym_id = json_rx_data.RMED.SYN[0].SYNONYM_ID;
						cur_ord_action_entity.order_name = json_rx_data.RMED.SYN[0].DISPLAY;
						cur_ord_action_entity.order_as_mnemonic = json_rx_data.RMED.SYN[0].MNEMONIC;
					}
					
					cur_ord_action_entity.synonyms = syn_str.join("");
					cur_ord_action_entity.synonyms_cnt = parseInt(json_rx_data.RMED.SYNCNT, 10);
					
					cur_ord_action_entity.order_sentence = new OrderSentence(json_rx_data.RMED.SYN[0].DETAILS);
					cur_ord_action_entity.order_sentence.setAttribute("SYNONYM_ID", json_rx_data.RMED.SYN[0].SYNONYM_ID);
					cur_ord_action_entity.order_sentence.setAttribute("OE_FORMAT_ID", json_rx_data.RMED.SYN[0].OE_FORMAT_ID);
					cur_ord_action_entity.order_sentence.listenFocusIn(OrderableDisplay.focusCell, cur_ord_action_entity);
					cur_ord_action_entity.order_sentence.listenFocusOut(OrderableDisplay.unfocusCell, cur_ord_action_entity);
				}
				else {
					cur_ord_action_entity.sentence_id = 0;
					cur_ord_action_entity.synonyms_cnt = 0;
					cur_ord_action_entity.order_details = " ";
				}
				if (prev_col_index === totalColumns) {
					cur_ord_action_entity.recon_order_action_mean = "CONVERT_RX";
				}
				else {
					cur_ord_action_entity.recon_order_action_mean = "CONVERT_INPAT";
				}
				
				// invalid synonym
				if (json_rx_data.RMED.SYNCNT === 1) {
					if (json_rx_data.RMED.SYN[0].VIRTUAL_VIEW_IND === 1 || json_rx_data.RMED.SYN[0].HIDDEN_SYNONYM_IND === 1  || json_rx_data.RMED.SYN[0].INACTIVE_SYNONYM_IND === 1) {
						cur_ord_action_entity.invalid_synonym_ind =  1;						
					}
				}
				
				orderActionEntityList.put(dom_dest_row.id + (col_index), cur_ord_action_entity);
				
				
				// Build display properties for modified row
				if (opt_sel === 2) {
					displayTargetExpandFlag = 0;
				}
				else if (opt_sel === 3) {
					displayTargetExpandFlag = 4;
				}
				else if (opt_sel === 1 || opt_sel === 4) {
					if (json_rx_data.RMED.SYNCNT > 1) {
						displayTargetExpandFlag = 2;
					}
				}
				
				
				displayTargetRowNode = dom_dest_row;
				displayTargetColumnIndex = col_index;
				displayTargetInpatientInd = 1;
				displayTargetActionanbleInd = 0;
			
				OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
				
				if ((cur_ord_action_entity.synonyms_cnt <= 1 && (opt_sel === 1 || opt_sel === 4)) || opt_sel === 2) { // for keep add orderable if only a single synonym is provided, otherwise add orderable
					OrderableDisplay.addOrderableJson(cur_ord_action_entity);
				}
				// virtual viewed synonym alert					
				// For keep action or if no alternatives are found => remove orderable
				if (cur_ord_action_entity.invalid_synonym_ind === 1 && (opt_sel === 1 || json_rx_data.RMED.SYNCNT === 0)) {
					var message = "The following are invalid inpatient order catalog synonym(s). To select an alternative, choose the modify icon next to the medication order";
					addtoMessageStack(message, json_rx_data.RMED.SYN[0].MNEMONIC);
					// clear orderable
					MedRec.evalItemAction(cur_ord_action_entity.hashmap_key, 0, 0);
				}
				actionDone();
			}
		} catch (e) {
	        errorHandler(e, "loadConvertedInpatient()");
		}
	}
	
	/***** Evaluation methods**/
		
	/* Function: evalAction(this,)
	 * Purpose: To evaluate keep, modify, stop actions on a medication 
	 * Parameters: 
	 * Returns:
	 */
	function evalAction(action_entity, disch_flag, action_type) {
		try {
			var opt_sel = parseInt(action_entity.action_type, 10),
				col_index = parseInt(action_entity.col_index, 10),
				cki = action_entity.cki,
				next_col_index = meds_hdr_table.rows[0].cells.length - 2,
				dom_cur_row = action_entity.row_obj,
				dom_mod_row,
				cur_ord_group_entity,
				cur_ord_action_entity,
				next_ord_action_entity,
				prev_ord_action_entity,
				inp_parameters,
				disch_parameters,
				cclParam,
				loadingDialogTargetNode,
				displayTargetRowNode,
				displayTargetColumnIndex,
				displayTargetInpatientInd,
				displayTargetActionanbleInd,
				displayTargetExpandFlag,
				first_ord_action_entity,
				hx_order_id = 0;
			var cur_med_text = action_entity.med_name + action_entity.order_details;
			if (col_index < meds_hdr_table.rows[0].cells.length) {
				cur_ord_action_entity = orderActionEntityList.get(dom_cur_row.id + col_index);
				if (col_index !== totalColumns) { // not discharge column -> copy action entity
					next_ord_action_entity = copyOrderActionEntity(cur_ord_action_entity); // get order entity object
					next_ord_action_entity.actionable_ind = 0;
				} else {
					next_ord_action_entity = cur_ord_action_entity;
				}
				if (col_index === meds_hdr_table.rows[0].cells.length - 2) {
					next_col_index = col_index + 1;
				}
				if (col_index === totalColumns) {
					next_col_index = col_index;
				}
				if (disch_flag === 1) {
					next_col_index = totalColumns;
				}
				cur_ord_action_entity.next_hashmap_key = dom_cur_row.id + (next_col_index);
				OrderableDisplay.setPreviousActionSelector(cur_ord_action_entity, action_type);
				if (disch_flag !== 1) {
					prev_ord_action_entity = orderActionEntityList.get(dom_cur_row.id + cur_ord_action_entity.prev_col_index);
				}
				cur_ord_action_entity.next_col_index = next_col_index;
				orderActionEntityList.put("" + dom_cur_row.id + (col_index), cur_ord_action_entity);
				
				if (col_index < parseInt(next_ord_action_entity.prev_col_index, 10) || next_ord_action_entity.prev_col_index === 0) {
					next_ord_action_entity.prev_col_index = col_index;
				}
				
				next_ord_action_entity.col_index = next_col_index;
				next_ord_action_entity.order_phy_name = criterion.prsnl_name;
				next_ord_action_entity.hashmap_key = "" + dom_cur_row.id + (next_col_index);
				orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity); //insert next column details
				if (opt_sel === 2) {
					var row_modid = dom_cur_row.id + "_mod";
					dom_mod_row = dom_cur_row;//OrderGroup.createOrderRows(Util.gp(dom_cur_row),row_modid,next_col_index)[0];
					next_ord_action_entity.row_obj = dom_mod_row;
					next_ord_action_entity.parent_row_obj = dom_cur_row;
					orderActionEntityList.put(dom_mod_row.id + (next_col_index), next_ord_action_entity); // copy order entity object	for mod row
				}
				
				if (disch_flag === 1) {
					col_index = meds_hdr_table.rows[0].cells.length - 2;
				}
				if (opt_sel === 3) { // stop option
					next_ord_action_entity.recon_order_action_mean = "DISCONTINUE";
				}
				switch (col_index) {
				case 0:
					// incoming from pre-admission								
					if (opt_sel === 1 || opt_sel === 2 || opt_sel === 3) { // keep/modify for convert to rx option	
						if (opt_sel === 1 || opt_sel === 2) {
							next_ord_action_entity.recon_order_action_mean = "CONVERT_INPAT";
						}
						// Set initial display details for Stopped or Modified orderable		
						if (opt_sel === 2 || opt_sel === 3) {
							displayTargetRowNode = dom_cur_row;
							displayTargetColumnIndex = next_col_index;
							displayTargetInpatientInd = 0;
							displayTargetActionanbleInd = 0;
							displayTargetExpandFlag = -1;
							if (opt_sel === 3) {
								displayTargetExpandFlag = 4; // display dc reasons drop-down
								next_ord_action_entity.recon_order_action_mean = "CANCEL DC";
								next_ord_action_entity.dc_reason_cd = Preferences.get("preAdmitCancelReasonCd");
								next_ord_action_entity.dc_reason_disp = Preferences.get("preAdmitCancelReasonDisp");
								orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity); // Update Order Action Entity
								OrderableDisplay.addOrderableJson(next_ord_action_entity);
							}
							OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
						}
						// Conver only for keep or modify
						if (opt_sel === 1 || opt_sel === 2) {
							// convert med to rx
							cclParam = '"MINE","' + next_ord_action_entity.synonym_id + '","' + next_ord_action_entity.sentence_id + '","' + next_ord_action_entity.order_id + '",0';

							if (opt_sel === 1) {
								inp_parameters = [dom_cur_row, dom_cur_row, col_index, next_col_index, opt_sel];
								loadingDialogTargetNode = dom_cur_row.cells[next_col_index];
							}
							else {
								inp_parameters = [dom_cur_row, dom_mod_row, col_index, next_col_index, opt_sel];
								loadingDialogTargetNode = dom_mod_row.cells[next_col_index];
							}
									
							
							// Convert Pre-admit to Inpatient
							GlobalAjaxCclHandler.ajax_request({
								request: {
									type: "XMLCCLREQUEST",
									target: 'ADVSR_MEDS_REC_CNVT_SYN_DET:dba',
									parameters: cclParam
								}, 
								loadingDialog: {
									targetDOM: loadingDialogTargetNode,
									content: "<img src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>"
								},
								response: {
									type: "JSON",  
									target: loadConvertedInpatient,
									parameters: inp_parameters
								}
							});
						}
					}   
					break;
				case totalColumns: // Incoming from discharge column
					if (disch_flag === 2) { // Converting to Nursing Order
						/* Clear display of current orderable */
						OrderableDisplay.clearDisplay(action_entity);
						
						// convert med to rx
						cclParam = '"MINE","' + action_entity.synonym_id + '","' + action_entity.sentence_id + '","' + action_entity.order_id + '",0';
						
						inp_parameters = [dom_cur_row, dom_cur_row, col_index, col_index, opt_sel];
						loadingDialogTargetNode = dom_cur_row.cells[col_index];
						
						// Convert Inpatient to Inpatient
						GlobalAjaxCclHandler.ajax_request({
							request: {
								type: "XMLCCLREQUEST",
								target: 'ADVSR_MEDS_REC_CNVT_SYN_DET:dba',
								parameters: cclParam
							},
							loadingDialog: {
								targetDOM: loadingDialogTargetNode,
								content: "<img src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>"
							},
							response: {
								type: "JSON",
								target: loadConvertedInpatient,
								parameters: inp_parameters
							}
						});
					} else {
						// Set properties for Keep/Modify
						if (opt_sel === 1 || opt_sel === 2) {
							if (next_ord_action_entity.pharmacy_iv_ind === 0) {
								next_ord_action_entity.recon_order_action_mean = "CONVERT_RX";
							} else {
								next_ord_action_entity.recon_order_action_mean = "RECON_NON_MED_RX";
							}
							
							// Add displayTarget Properties for Keep Action
							if (opt_sel === 1) {
								// If multiple synonyms exist => set expand f
								if (action_entity.synonyms_cnt > 0 || action_entity.order_details == " ") {
									displayTargetRowNode = dom_cur_row;
									displayTargetColumnIndex = next_col_index;
									displayTargetInpatientInd = 0;
									displayTargetActionanbleInd = 1;
									displayTargetExpandFlag = 2;
								} else { // single synonym => display with comment box
									displayTargetRowNode = dom_cur_row;
									displayTargetColumnIndex = next_col_index;
									displayTargetInpatientInd = 0;
									displayTargetActionanbleInd = 1;
									displayTargetExpandFlag = 3;
								}
							}
							if (opt_sel === 2) { // on modified option, copy details to a new row
								displayTargetRowNode = dom_mod_row;
								displayTargetColumnIndex = next_col_index;
								displayTargetInpatientInd = 0;
								displayTargetActionanbleInd = 0;
								displayTargetExpandFlag = 0;
							}
						} else { // Set properties for Stop
							if (opt_sel === 3) {
								prev_ord_action_entity = orderActionEntityList.get(dom_cur_row.id + (cur_ord_action_entity.prev_col_index));
								next_ord_action_entity.recon_order_action_mean = "RECON_DO_NOT_CNVT";
								next_ord_action_entity.clin_disp = prev_ord_action_entity.clin_disp;
								next_ord_action_entity.parent_clin_disp = prev_ord_action_entity.clin_disp;
								next_ord_action_entity.parent_simp_disp = prev_ord_action_entity.order_details;
								next_ord_action_entity.parent_mnemonic = prev_ord_action_entity.order_name + " (" + prev_ord_action_entity.order_as_mnemonic + ")";
								next_ord_action_entity.parent_syn_id = prev_ord_action_entity.synonym_id;
								next_ord_action_entity.parent_snt_id = prev_ord_action_entity.sentence_id;
								next_ord_action_entity.order_details = prev_ord_action_entity.order_details;
								next_ord_action_entity.order_as_mnemonic = prev_ord_action_entity.order_as_mnemonic;
								next_ord_action_entity.synonym_id = prev_ord_action_entity.synonym_id;
								next_ord_action_entity.sentence_id = prev_ord_action_entity.sentence_id;
								OrderableDisplay.addOrderableJson(next_ord_action_entity);
							}
						}
						// for keep add orderable if only a single synonym is provided, add orderable					
						if ((next_ord_action_entity.synonyms_cnt <= 1 && (opt_sel === 1 || opt_sel === 4)) || opt_sel === 2) {
							OrderableDisplay.addOrderableJson(next_ord_action_entity);
						}
						// Add Orderable Display
						OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
					}					
					break;
				case meds_hdr_table.rows[0].cells.length - 2:// incoming from before discharge	
					col_index = action_entity.col_index;
					
					if (opt_sel === 1 || opt_sel === 2) { // keep/modify for convert to rx option	
						next_ord_action_entity.recon_order_action_mean = "CONVERT_RX";
						
						cur_ord_group_entity = orderGroupEntityList.get("order_group_" + next_ord_action_entity.order_group_id);
						first_ord_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);	
						hx_order_id = 0;
						if (first_ord_action_entity	&& first_ord_action_entity.col_index === 0) {
							hx_order_id = first_ord_action_entity.order_id;
						}
									
						// convert med to rx
						cclParam = '"MINE","' + next_ord_action_entity.order_id + '","' + next_ord_action_entity.synonym_id + 
										'","' + next_ord_action_entity.sentence_id + '","' + hx_order_id + '"';
						
						// Set initial display details for Stopped or Modified orderable		
						if (opt_sel === 2 || opt_sel === 3) {
							displayTargetRowNode = dom_cur_row;
							displayTargetColumnIndex = next_col_index;
							displayTargetInpatientInd = 0;
							displayTargetActionanbleInd = 0;
							displayTargetExpandFlag = -1;
							OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
						}
						
						if (opt_sel === 1) { // keep
							disch_parameters = [disch_flag, dom_cur_row, dom_cur_row, col_index, next_col_index, opt_sel];
							loadingDialogTargetNode = dom_cur_row.cells[next_col_index];
						} else { // modify
							disch_parameters = [0, dom_cur_row, dom_mod_row, col_index, next_col_index, opt_sel];
							loadingDialogTargetNode = dom_mod_row.cells[next_col_index];
						}
						GlobalAjaxCclHandler.ajax_request({
							request: {
								type: "XMLCCLREQUEST",
								target: 'ADVSR_MEDS_REC_CNVT_SYN_RX:dba',
								parameters: cclParam
							},
							loadingDialog: {
								targetDOM: loadingDialogTargetNode,
								content: "<img src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>"
							},
							response: {
								type: "JSON",
								target: loadConvertedRx,
								parameters: disch_parameters
							}
						});
					} else { // Set initial display details for Stopped orderable 
						if (opt_sel === 3) {
							// set do not convert on the inpatient med
							displayTargetRowNode = dom_cur_row;
							displayTargetColumnIndex = next_col_index;
							displayTargetInpatientInd = 0;
							displayTargetActionanbleInd = 0;
							displayTargetExpandFlag = -1;
							next_ord_action_entity.recon_order_action_mean = "RECON_DO_NOT_CNVT";
							next_ord_action_entity.clin_disp = action_entity.clin_disp;
							next_ord_action_entity.order_details = action_entity.order_details;
							next_ord_action_entity.order_name = action_entity.order_name;
							next_ord_action_entity.order_as_mnemonic = action_entity.order_as_mnemonic;
							next_ord_action_entity.order_hna_mnemonic = action_entity.order_hna_mnemonic;
							next_ord_action_entity.synonym_id = action_entity.synonym_id;
							next_ord_action_entity.sentence_id = action_entity.sentence_id;
							next_ord_action_entity.prev_col_index = action_entity.col_index;
							orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity);
							OrderableDisplay.addOrderableJson(next_ord_action_entity);
							OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
							
							// discontinue existing home medication

							// for do not convert inpatient => discontinue home med
							cur_ord_group_entity = orderGroupEntityList.get("order_group_" + action_entity.order_group_id);
							if (cur_ord_group_entity.first_order_col_index === 0) {
								prev_ord_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);
								prev_ord_action_entity.action_type = 3;
								prev_ord_action_entity.prev_col_index = totalColumns - 1;
								prev_ord_action_entity.clin_disp = prev_ord_action_entity.clin_disp;
								prev_ord_action_entity.parent_clin_disp = prev_ord_action_entity.clin_disp;
								prev_ord_action_entity.parent_simp_disp = prev_ord_action_entity.order_details;
								prev_ord_action_entity.parent_mnemonic = prev_ord_action_entity.order_name + " (" + prev_ord_action_entity.order_as_mnemonic + ")";
								prev_ord_action_entity.parent_syn_id = prev_ord_action_entity.synonym_id;
								prev_ord_action_entity.parent_snt_id = prev_ord_action_entity.sentence_id;
								prev_ord_action_entity.recon_order_action_mean = "DISCONTINUE";
								if (prev_ord_action_entity.action_type !== DC_STATUS_FLAG) {
									prev_ord_action_entity.opt_sel = DISCONTINUE_ACTION_FLAG;
									prev_ord_action_entity.action_type = DC_STATUS_FLAG;
								}
								OrderableDisplay.addOrderableJson(prev_ord_action_entity);
							}
						}
					}
					break;
				default: // Inpatient to Inpatient
					// Set displayTarget properties		
					if (opt_sel === 1) {
						next_ord_action_entity.recon_order_action_mean = "RECON_CONTINUE";
						displayTargetRowNode = dom_cur_row;
						displayTargetColumnIndex = next_col_index;
						displayTargetInpatientInd = 1;
						displayTargetActionanbleInd = 0;
						displayTargetExpandFlag = -1;
					} else { 
						if (opt_sel === 2) { // on modified option, copy details to a new row
							next_ord_action_entity.recon_order_action_mean = "RECON_MODIFY";
							displayTargetRowNode = dom_mod_row;
							displayTargetColumnIndex = next_col_index;
							displayTargetInpatientInd = 1;
							displayTargetActionanbleInd = 0;
							displayTargetExpandFlag = -1;
						} else { 
							if (opt_sel === 3) {
								next_ord_action_entity.recon_order_action_mean = "CANCEL DC";
								displayTargetRowNode = dom_cur_row;
								displayTargetColumnIndex = next_col_index;
								displayTargetInpatientInd = 1;
								displayTargetActionanbleInd = 0;
								displayTargetExpandFlag = 4; // display dc reasons drop-down
							}
						}
					}
					
					var medOrderInd = parseInt(cur_ord_action_entity.med_ind, 10);
					var pharmacyIvInd = parseInt(cur_ord_action_entity.pharmacy_iv_ind, 10);	
					if (medOrderInd === 0 || pharmacyIvInd === 1) { // Non med -> set order details display to clinical display line
						// set order details to clinical display line
						next_ord_action_entity.order_details = cur_ord_action_entity.clin_disp;
					}
					
					// Add Orderable Object				
					OrderableDisplay.addOrderableJson(next_ord_action_entity);
					// Add Orderable Display
					OrderableDisplay.addOrderableDisplay(displayTargetRowNode, displayTargetColumnIndex, displayTargetInpatientInd, displayTargetActionanbleInd, displayTargetExpandFlag);
					break;
				}
				
				if (next_ord_action_entity && next_ord_action_entity.recon_order_action_mean === "CONVERT_RX" && disch_flag === 0) {
					// for convert rx => discontinue home med
					cur_ord_group_entity = orderGroupEntityList.get("order_group_" + action_entity.order_group_id);
					if (cur_ord_group_entity.first_order_col_index === 0) {
						prev_ord_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);
						prev_ord_action_entity.action_type = 3;
						prev_ord_action_entity.prev_col_index = totalColumns - 1;
						prev_ord_action_entity.clin_disp = prev_ord_action_entity.clin_disp;
						prev_ord_action_entity.parent_clin_disp = prev_ord_action_entity.clin_disp;
						prev_ord_action_entity.parent_simp_disp = prev_ord_action_entity.order_details;
						prev_ord_action_entity.parent_mnemonic = prev_ord_action_entity.order_name + " (" + prev_ord_action_entity.order_as_mnemonic + ")";
						prev_ord_action_entity.parent_syn_id = prev_ord_action_entity.synonym_id;
						prev_ord_action_entity.parent_snt_id = prev_ord_action_entity.sentence_id;
						prev_ord_action_entity.recon_order_action_mean = "DISCONTINUE";
						if (prev_ord_action_entity.action_type !== DC_STATUS_FLAG) {
							prev_ord_action_entity.opt_sel = DISCONTINUE_ACTION_FLAG;
							prev_ord_action_entity.action_type = DC_STATUS_FLAG;
						}
						OrderableDisplay.addOrderableJson(prev_ord_action_entity);
					}
				}
				
				if (opt_sel === 0 || opt_sel === 1) {
					TableColumn.setCssClassTableColumn(dom_cur_row, next_col_index, "tbl-fxd-body-tr-td-continued");
				}
				if (opt_sel === 2 || opt_sel === 3) {
					TableColumn.setCssClassTableColumn(dom_cur_row, next_col_index, "tbl-fxd-body-tr-td-cancelled");
					if (opt_sel === 2) {
						TableColumn.setCssClassTableColumn(dom_mod_row, next_col_index, "tbl-fxd-body-tr-td-continued");
					}
				}
			}
		} catch (e) {
			errorHandler(e, "evalAction()");
		}
	}
	
	/* Function: evalRestartAction(this,)
	 * Purpose: To evaluate restart action on a Discontinued/Stopped medication 
	 * Parameters: (action_entity) - action_entity object of the original order
	 *				(cki) - Cki value of the order
	 * Returns:	None
	 */
	function evalRestartAction(action_entity) {
	    try {
			var dom_cur_row = action_entity.row_obj,
				row_index = dom_cur_row.rowIndex - 2,
				col_index = action_entity.col_index,
				prev_col_index = action_entity.prev_col_index,
				cki = action_entity.cki,
				row_modid = dom_cur_row.id + "_rst",
				dom_rst_row = _g(row_modid),
				opt_sel = action_entity.action_type,
				next_ord_action_entity,
				cclParam,
				opt_sel_flag = 4,
				cur_ord_group_entity, 
				first_ord_action_entity,
				hx_order_id = 0;
				
							
			if (!dom_rst_row) { //increment to the highest modified id
				dom_rst_row = OrderGroup.createOrderRows(Util.gp(dom_cur_row), row_modid, col_index)[0];// insert a complete row into group		
				dom_rst_row.id = row_modid;
			}
			next_ord_action_entity = copyOrderActionEntity(action_entity); // get order entity object
			next_ord_action_entity.row_obj = dom_rst_row;
			next_ord_action_entity.parent_row_obj = dom_cur_row;
			next_ord_action_entity.actionable_ind = -1;
			next_ord_action_entity.action_type = RESTART_ACTION_FLAG;			
			next_ord_action_entity.hashmap_key = "" + row_modid + col_index;
			next_ord_action_entity.restart_order_ind = 1;
			orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity); //insert next column details
			
			action_entity.action_type = RESTART_ACTION_FLAG;
			action_entity.next_col_index = col_index;
			action_entity.next_hashmap_key = next_ord_action_entity.hashmap_key;
			orderActionEntityList.put("" + dom_cur_row.id + col_index, action_entity);
			/* Disable Previous Order Action Selectors */
			OrderableDisplay.setPreviousActionSelector(action_entity, action_entity.action_type);
			
			// incoming from pre-admission				
			if (prev_col_index === 0) {				
				// convert med to rx
				cclParam = '"MINE","' + next_ord_action_entity.synonym_id + '","' + next_ord_action_entity.sentence_id + '","' + next_ord_action_entity.order_id + '",0';
				GlobalAjaxCclHandler.ajax_request({
					request: {
						type: "XMLCCLREQUEST",
						target: 'ADVSR_MEDS_REC_CNVT_SYN_DET:dba',
						parameters: cclParam
					},
					loadingDialog: {
						targetDOM: dom_rst_row.cells[col_index],
						content: "&nbsp;<img src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>"
					},
					response: {
						type: "JSON",
						target: loadConvertedInpatient,
						parameters: [dom_cur_row, dom_rst_row, col_index, col_index, 4]
					}
				});
			}
			// incoming from before discharge		
			else if (prev_col_index === totalColumns - 1 && col_index === totalColumns) {		
				cur_ord_group_entity = orderGroupEntityList.get("order_group_" + next_ord_action_entity.order_group_id);
				first_ord_action_entity = orderActionEntityList.get(cur_ord_group_entity.first_order_action_entity_id);	
				hx_order_id = 0;
				if (first_ord_action_entity	&& first_ord_action_entity.col_index === 0) {
					hx_order_id = first_ord_action_entity.order_id;
				}
								
				// convert med to rx
				cclParam = '"MINE","' + next_ord_action_entity.order_id + '","' + next_ord_action_entity.synonym_id + 
							'","' + next_ord_action_entity.sentence_id + '","' + hx_order_id + '"';
				GlobalAjaxCclHandler.ajax_request({
					request: {
						type: "XMLCCLREQUEST",
						target: 'ADVSR_MEDS_REC_CNVT_SYN_RX:dba',
						parameters: cclParam
					},
					loadingDialog: {
						targetDOM: dom_rst_row.cells[col_index],
						content: "&nbsp;<img src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img>"
					},
					response: {
						type: "JSON",
						target: loadConvertedRx,
						parameters: [0, dom_cur_row, dom_rst_row, action_entity.prev_col_index, col_index, opt_sel_flag]
					}
				});
			} else {
				// copy over the previous details to the next column	
				next_ord_action_entity.order_details = " ";
				OrderableDisplay.addOrderableDisplay(dom_rst_row, col_index, 1, 0, -1); // build display	
				next_ord_action_entity.recon_order_action_mean = "CANCEL REORD";
				next_ord_action_entity.action_type = 1;
				
				// copy details from previous order
				cclParam = '"MINE","' + action_entity.order_id + '",2,"' + next_ord_action_entity.synonym_id + '",1';
				GlobalAjaxCclHandler.ajax_request({
					request: {
						type: "XMLCCLREQUEST",
						target: 'ADVSR_MEDS_REC_COPY_ORD_DET:dba',
						parameters: cclParam
					},
					response: {
						type: "JSON",
						target: function (json_response) {
							var copiedDetails = json_response.response.ORDER_DETAILS,
								sentenceDetails = copiedDetails.SYN[0].DETAILS,
								sentenceDisplay = '';
							
							if (next_ord_action_entity.order_sentence) {
								delete next_ord_action_entity.order_sentence;
							}
							next_ord_action_entity.sentence_id = 0;
							
							// Any sentence details passed
							if (sentenceDetails.length > 0) {
								next_ord_action_entity.order_sentence = new OrderSentence(sentenceDetails);														
								next_ord_action_entity.order_sentence.setAttribute("SYNONYM_ID", copiedDetails.SYN[0].SYNONYM_ID);									
								next_ord_action_entity.order_sentence.setAttribute("OE_FORMAT_ID", copiedDetails.SYN[0].OE_FORMAT_ID);	
								next_ord_action_entity.order_sentence.listenFocusIn(OrderableDisplay.focusCell, next_ord_action_entity);
								next_ord_action_entity.order_sentence.listenFocusOut(OrderableDisplay.unfocusCell, next_ord_action_entity);											
							}
							OrderableDisplay.updateDetail(next_ord_action_entity, "ORDER_DETAILS", sentenceDisplay); // Update sentence display
							orderActionEntityList.put(next_ord_action_entity.hashmap_key, next_ord_action_entity); //insert next column details
							OrderableDisplay.addOrderableJson(next_ord_action_entity); // update orderable details
						},
						parameters: []
					}
				});
			}
			TableColumn.setCssClassTableColumn(dom_rst_row, col_index, "tbl-fxd-body-tr-td-continued");
		} catch (e) {
			errorHandler(e, "evalRestartAction()");
		}
	}

	/***** Order entry & Orderables methods ****/
	function signCancelDCOrders() {		
		try {
			var cancelDcOrders, orderable_cnt = 0;
			// get the filtered list of orders to discontinue
			cancelDcOrders = _.filter(orderableEntityList.ords, function (curorderable) {
				return (parseInt(curorderable.opt_sel,10) === 3);
			});
			// Any cancel DC orders
			if (cancelDcOrders.length > 0) {
				var cancelDate = new Date().format("yyyymmddHHMMss00");
				// Open MOEW handle
				var PowerOrdersMPageUtils = MPAGES_API_ROOT.DiscernObjectFactory("POWERORDERS");
				var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(criterion.person_id, criterion.encntr_id, 0, 2, 127);
				
				_.each(cancelDcOrders, function (curorderable) {
					var cancelDCReason = 0.0,
						orderAddedSuccess = 0,
						reconJSON = [],
						reconTypeFlag = 1,
						toActionSeq = 2;
					
					if (curorderable.dc_reason_cd) {
						cancelDCReason = curorderable.dc_reason_cd;
					}
					// Add DC order to scratch-pad
					orderAddedSuccess = PowerOrdersMPageUtils.InvokeCancelDCAction(m_hMOEW, curorderable.parent_order_id, cancelDate, cancelDCReason);
					
					// If order added successfully -> add reconciliation
					if (parseInt(orderAddedSuccess,10) === 1 || orderAddedSuccess === true) {
						// coming from preadmit => preadmit reconciliation
						if (parseInt(curorderable.prev_col_index,10) === 0) {
							reconTypeFlag = 1;
						}
						// coming from before discharge => transfer reconciliation
						else if (curorderable.prev_col_index < totalColumns - 1) {
							reconTypeFlag = 2;
						}
						// discharge reconciliation
						else {
							reconTypeFlag = 3;
						}								
						reconJSON = [];
						reconJSON.push("{");
						reconJSON.push('"recon_type_flag" : ', reconTypeFlag, ",");
						reconJSON.push('"no_known_meds_ind" : 0', ",");
						reconJSON.push('"to_action_seq" : ', toActionSeq, ",");
						reconJSON.push('"reltn_type_mean" : "DISCONTINUE"', ",");
						reconJSON.push('"order_list" : [');
					
						reconJSON.push(OrderRecon.buildReconDetailJSON({
							"order_id": curorderable.parent_order_id,
							"clinical_display_line": curorderable.parent_clin_disp,
							"simplified_display_line": curorderable.parent_simp_disp,
							"continue_order_ind": 2,
							"recon_order_action_mean": curorderable.recon_order_action_mean,
							"order_mnemonic": curorderable.parent_mnemonic
						}));
						reconJSON.push("]");								
						reconJSON.push("}");
						orderReconciliations.push(reconJSON.join(""));
						
						// coming from preadmit => add a do not convert discharge reconciliation
						if (parseInt(curorderable.prev_col_index,10) === 0) {
							reconJSON = [];
							reconJSON.push("{");
							reconJSON.push('"recon_type_flag" : 3,');
							reconJSON.push('"no_known_meds_ind" : 0', ",");
							reconJSON.push('"to_action_seq" : ', toActionSeq, ",");
							reconJSON.push('"reltn_type_mean" : "RECON_DO_NOT_CNVT"', ",");
							reconJSON.push('"order_list" : [');
							reconJSON.push(OrderRecon.buildReconDetailJSON({
								"order_id": curorderable.parent_order_id,
								"clinical_display_line": curorderable.parent_clin_disp,
								"simplified_display_line": curorderable.parent_simp_disp,
								"continue_order_ind": 2,
								"recon_order_action_mean": "RECON_DO_NOT_CNVT",
								"order_mnemonic": curorderable.parent_mnemonic
							}));
							reconJSON.push("]");
							reconJSON.push("}");
							orderReconciliations.push(reconJSON.join(""));									
						}								
						orderable_cnt += 1;
					}					
				});
				// Any DC orders
				if (orderable_cnt > 0) {
					PowerOrdersMPageUtils.SignOrders(m_hMOEW);
				}
				PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
			}
		} catch (e) {
			errorHandler(e, "signCancelDCOrders()");
		}
	}
	
	
	function generateMOEWParameters() {
		try {
			var ord_str = [],
				keep_only_ind = 0,
				orderable_cnt = 0,
				curorderable,
				curreconmean,
				curorderid;
	
			ord_str.push(String(criterion.person_id)); 
			ord_str.push("|"); 
			ord_str.push(String(criterion.encntr_id));  
			ord_str.push("|");
			for (var i = 0; i < orderableEntityList.ords.length; i++) {
				curorderable = orderableEntityList.ords[i];
				curorderid = parseFloat(curorderable.parent_order_id).toFixed(2);
				if (curorderable.recon_order_action_mean === "RECON_CONTINUE") {
					OrderRecon.appendReconContinue({
						"order_id":  curorderid,
						"clinical_display_line": curorderable.parent_clin_disp,
						"simplified_display_line": curorderable.parent_simp_disp,
						"continue_order_ind": 1,
						"recon_order_action_mean": "RECON_CONTINUE",
						"order_mnemonic": curorderable.parent_mnemonic 
					});
					OrderableDisplay.removeOrderableJson(curorderable.search_id);
					i -= 1;
				}
				else if (curorderable.recon_order_action_mean === "RECON_DO_NOT_CNVT") {
					// preadmit action or acknowledge action
					if (curorderable.col_index === 0 || curorderable.opt_sel === ACK_ACTION_FLAG) {
						OrderRecon.appendReconDoNotCnvtPreadmit({
							"order_id":  curorderid,
							"clinical_display_line": curorderable.parent_clin_disp,
							"simplified_display_line": curorderable.parent_simp_disp,
							"continue_order_ind": 2,
							"recon_order_action_mean": "RECON_DO_NOT_CNVT",
							"order_mnemonic": curorderable.parent_mnemonic 
						});
					}
					else {					
						OrderRecon.appendReconDoNotCnvt({
							"order_id":  curorderid,
							"clinical_display_line": curorderable.parent_clin_disp,
							"simplified_display_line": curorderable.parent_simp_disp,
							"continue_order_ind": 2,
							"recon_order_action_mean": "RECON_DO_NOT_CNVT",
							"order_mnemonic": curorderable.parent_mnemonic 
						});
					}
					OrderableDisplay.removeOrderableJson(curorderable.search_id);
					i -= 1;
				} 
				else if (curorderable.recon_order_action_mean === "RECON_NON_MED_RX") {
					OrderRecon.appendReconNonMed({
						"order_id": curorderid,
						"clinical_display_line": curorderable.parent_clin_disp,
						"simplified_display_line": curorderable.parent_simp_disp,
						"continue_order_ind": 1,
						"recon_order_action_mean": "RECON_CONTINUE",
						"order_mnemonic": curorderable.parent_mnemonic 
					});			
					appendOrderComment(curorderable.parent_order_id, curorderable.ord_comment);	
					OrderableDisplay.removeOrderableJson(curorderable.search_id);
					i -= 1;
				}
				//Resumed from pre-admit
				else if (curorderable.recon_order_action_mean === "RECON_RESUME") {
					OrderRecon.appendReconResume({
						"order_id": curorderid,
						"clinical_display_line": curorderable.parent_clin_disp,
						"simplified_display_line": curorderable.parent_simp_disp,
						"continue_order_ind": 1,
						"recon_order_action_mean": "RECON_RESUME",
						"order_mnemonic": curorderable.parent_mnemonic 
					});
					OrderableDisplay.removeOrderableJson(curorderable.search_id);		
					i -= 1;	
				}
				//Already cancelled => make a recon note it was re-conciled
				else if (curorderable.status_type === DC_STATUS_FLAG &&
						 (curorderable.recon_order_action_mean === "CANCEL DC" || curorderable.recon_order_action_mean === "DISCONTINUE")) {
					OrderRecon.appendReconDiscontinue({
						"order_id": curorderid,
						"clinical_display_line": curorderable.parent_clin_disp,
						"simplified_display_line": curorderable.parent_simp_disp,
						"continue_order_ind": 2,
						"recon_order_action_mean": "DISCONTINUE",
						"order_mnemonic": curorderable.parent_mnemonic 
					});
					OrderableDisplay.removeOrderableJson(curorderable.search_id);
					i -= 1;
				}
				else if (curorderable.opt_sel === 1 || curorderable.opt_sel === 2 || curorderable.opt_sel === 4 || curorderable.opt_sel === 5) {		
					switch (curorderable.opt_sel) {
					case 1: 
						ord_str.push(buildNewOrder(curorderable));
						break;
					case 2: 
						if (isNewOrder(curorderable)) {
							ord_str.push(buildNewOrder(curorderable));
						}
						else {
							ord_str.push("{MODIFY|");
						}
						keep_only_ind = 0;
						break;	
					case 4: 
						ord_str.push(buildNewOrder(curorderable));
						keep_only_ind = 0;
						break;			
					case 5: 
						ord_str.push(buildNewOrder(curorderable));
						break;				
					}
					if (curorderable.opt_sel > 1) {
						ord_str.push(curorderable.parent_order_id);
						ord_str.push("}");
					}
					orderable_cnt += 1;
				}	
							
			}
			if (MOEWType === "PLANS_MOEW") {
				ord_str.push("|24|{2|127}{3|127}|8");	// Plans
			}
			else {
				ord_str.push("|24|{2|127}|32|1");	// silent sign
			}
				
			if (orderable_cnt === 0) {
				return "";
			}
			else {
				return (ord_str.join(""));
			}
		} catch (e) {
			errorHandler(e, "generateMOEWParameters()");	
			return "";
		}
	}
	
	function checkContinuedReconciliations() {
		try {
			var removeCancelOrderables = _.filter(orderableEntityList.ords, function (orderable) {
				var most_recent_orderable, return_value = false;
					
				if (orderable.col_index === 0 && orderable.opt_sel === 3) {
					
					// find the most recent orderable in the group
					most_recent_orderable = _.find(orderableEntityList.ords, function (search_orderable) {
						return (orderable.search_id !== search_orderable.search_id && orderable.parent_group_id === search_orderable.parent_group_id);
					});
					if (most_recent_orderable) {
						if (most_recent_orderable.order_success_ind === false) {
							return_value = true;
						}
					}					
				}
				return (return_value);
			});
			// remove orderables to cancel 
			if(removeCancelOrderables){
				if(removeCancelOrderables.length >= 0){
					orderableEntityList.ords = _.difference(orderableEntityList.ords, removeCancelOrderables);
					orderableEntityList.ord_cnt = orderableEntityList.ords.length;
				}
			}
			
		} catch (e) {
			errorHandler(e, "checkContinuedReconciliations()");	
			return false;
		}
	}
	
	function signOrderables() {
		try {
			var MOEWXml = "",
				moew_param_string = "";
			
			if (orderableEntityList.ords.length > 0) { // Orders to sign ??	
				moew_param_string = generateMOEWParameters();
				if (moew_param_string > " ") { // valid number of orderables
					MOEWXml = MPAGES_API_ROOT.MPAGES_EVENT("ORDERS", moew_param_string);
					addMOEWReconciliations(MOEWXml);
				}
				//Check for any inpatient -> rx orders reconciled from hx
				// this is done to ensure an hx without a continued rx is not discontinued
				checkContinuedReconciliations();

				// Sign any Cancel DC orders
				signCancelDCOrders();
								
			}
			// Destroy any order sentences
			OrderSentenceManager.destroyOrderSentences(function (successInd) {
				MedRec.reconcileOrderables();
			});

			AjaxHandler.append_text("after destroyOrderSentences()");
		} catch (e) {
			// Destroy any order sentences
			OrderSentenceManager.destroyOrderSentences(function (successInd) {});	
			errorHandler(e, "signOrderables()");	
		}
	}
	
	function assignNewOrderSentenceIds(successInd) {
		try {
			//Assign order sentence id from action entity to orderable
			_.each(orderableEntityList.ords, function (orderable) {
				var row_id = orderable.row_id,
					col_index = orderable.col_index,
					action_entity  = orderActionEntityList.get("" + row_id + col_index),
					ord_sentence;
				ord_sentence = action_entity.order_sentence;
				if (ord_sentence) {
					orderable.ord_snt_id = ord_sentence.getAttribute("ORDER_SENTENCE_ID");
				}
			});
			
			//Proceed with signing the orderables
			signOrderables();
		} catch (e) {
			// Destroy any order sentences
			OrderSentenceManager.destroyOrderSentences(function (successInd) {});	
			errorHandler(e, "assignNewOrderSentenceIds()");	
			return false;
		}
	}

	function anyOrdersToSign() {
		try {
			var orders_to_sign = false;
			if (orderableEntityList.ord_cnt > 0) {
				orders_to_sign = true; 
			}	
			return (orders_to_sign);	
		} catch (e) {
			errorHandler(e, "anyOrdersToSign()");	
			return false;
		}
	}
	
	function initiateSign() {
		try {
			if (anyOrdersToSign()) {
				// Create any order sentences
				OrderSentenceManager.createOrderSentences(assignNewOrderSentenceIds);	
			}	
		} catch (e) {
			errorHandler(e, "initiateSign()");	
		}
	}
	
	function updateMedHistory() {
		try {
			var ord_str = [], retxml, cclParam, 
				nokhxmeds = _g("nokhxmeds"),
				nohxmeds = _g("nohxmeds"),
				uselastcomp = _g("uselastcomp");
			
			if (nokhxmeds.checked) {
				ordersComplianceList.no_known_home_meds_ind = 1;
			}
			else {
				ordersComplianceList.no_known_home_meds_ind = 0;
			}
			// Encounter compliance is incomplete with unable to obtain home meds, otherwise it is complete
			if (nohxmeds.checked) {
				ordersComplianceList.unable_to_obtain_ind = 1;
				ordersComplianceList.encntr_compliance_status_flag = 1;
			}
			else {
				ordersComplianceList.unable_to_obtain_ind = 0;
				ordersComplianceList.encntr_compliance_status_flag = 0;
			}
			
						
			// Need to do Orders compliance ??
			if (ordersComplianceList.order_list.length > 0 ||
					(criterion.med_history_unable_to_obtain_ind !== ordersComplianceList.unable_to_obtain_ind || 
							criterion.med_history_no_known_home_meds_ind !== ordersComplianceList.no_known_home_meds_ind ||
							criterion.encntr_compliance_status_flag !== ordersComplianceList.encntr_compliance_status_flag ||
							(uselastcomp && uselastcomp.checked))) {
				
				done_ord_recon = true;
				done_ord_comments = true;
				// Launch loading dialog
				UtilPopup.launchModalDialog({
					"width": "60.00%",
					"defaultpos": ["30%", "20%"],
					"content": "<p class=\"modalDialog\">Updating Order Compliance...Please Wait...<br/>" + "<img  src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img></p>"
				});
				
				cclParam = '"MINE",^{"req_ord_compl":' + (GlobalAjaxCclHandler.stringify_json(ordersComplianceList)) + '}^';
				GlobalAjaxCclHandler.ajax_request({
					request: {
						type: "XMLCCLREQUEST",
						target: 'ADVSR_MEDS_REC_ADD_ORD_CMPL:dba',
						parameters: cclParam
					},
					response: {
						type: "JSON",
						target: MedRec.doneOrderReconciliations,
						parameters: [1, "ADVSR_MEDS_REC_ADD_ORD_CMPL"]
					}
				});
			}
		} catch (e) {
			errorHandler(e, "updateMedHistory()");
		}
	}
	
	function performReconciliation(refreshPageInd) {
		try {
			var cclParam, reconObj = generateReconcilationString();
            // Any reconciliations
			if (reconObj.ORDER_RECON_STRING > " ") {
				// Launch loading dialog
				UtilPopup.launchModalDialog({
					"width" : "60.00%",
					"defaultpos" : ["30%", "20%"],
					"content" : "<p class=\"modalDialog\">Reconciling Orders...Please Wait...<br/>" + "<img  src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "'></img></p>"
				});
				
				cclParam = '^MINE^,^' + reconObj.ORDER_RECON_STRING + '^';
				GlobalAjaxCclHandler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : "ADVSR_MEDS_REC_ADD_ORD_RECON:dba",
						parameters : cclParam
					},
					response : {
						type : "JSON",
						target : MedRec.doneOrderReconciliations,
						parameters : [refreshPageInd, "ADVSR_MEDS_REC_ADD_ORD_RECON"]
					}
				});
				
				// Any comments
				if (reconObj.ORDER_COMMENT_STRING > " ") {
					cclParam = '^MINE^,^' + reconObj.ORDER_COMMENT_STRING + '^';
					GlobalAjaxCclHandler.ajax_request({
						request : {
							type : "XMLCCLREQUEST",
							target : 'ADVSR_MEDS_REC_ADD_ORD_CMNT:dba',
							parameters : cclParam
						},
						response : {
							type : "JSON",
							target : MedRec.doneOrderReconciliations,
							parameters : [refreshPageInd, "ADVSR_MEDS_REC_ADD_ORD_CMNT"]
						}
					});
				} else {
                    // call doneOrderReconciliations for the comment flag so the page can still refresh
                    MedRec.doneOrderReconciliations({ parameters: [1, "ADVSR_MEDS_REC_ADD_ORD_CMNT"] });
                }
                
                // flag the compliance as complete, even though it's a seperate piece - we need to refresh the page!
                MedRec.doneOrderReconciliations({ parameters: [1, "ADVSR_MEDS_REC_ADD_ORD_CMPL"]});
			}
			// refresh page since no reconciliation
			else {
				refreshPage();
			}
			
		} catch (e) {
			UtilPopup.closeModalDialog();
			errorHandler(e, e.message + " - > performReconciliation()");
		}
		return null;
	}
	

	function addMOEWReconciliations(MOEWXml) {
		try {
			var curactionseq,
				curorder,
				curorderable,
				curorderid,
				curordercomment,
				curorderrecontypeflag,
				curordercdisp,
				curordersdisp,
				curorderactionmean,
				curordercontinueind,
				curordermnemomic,
				curordersentid,
				curordersynid,
				curRecon,
				curCommentItem,
				xmlObj,
				xmlorders;
			
			// Valid MOEW xml string
			if (MOEWXml > " ") {
				xmlObj = GlobalAjaxCclHandler.parse_xml(MOEWXml);
				xmlorders = xmlObj.getElementsByTagName("Orders")[0].getElementsByTagName("Order");
				ordersEntityList.ord_cnt = xmlorders.length;
				for (var i = 0; i < xmlorders.length; i++) {
					curorder = xmlorders[i];
					curorderid = getXMLNodeValue(curorder.getElementsByTagName("OrderId")[0]);
					curordercdisp = getXMLNodeValue(curorder.getElementsByTagName("ClinDisplayLine")[0]);
					curordersdisp = getXMLNodeValue(curorder.getElementsByTagName("SimpleDisplayLine")[0]);
					curordermnemomic = getXMLNodeValue(curorder.getElementsByTagName("OrderedAsMnemonic")[0]);
					curordersentid = getXMLNodeValue(curorder.getElementsByTagName("OrderSentenceId")[0]);
					curordersynid = getXMLNodeValue(curorder.getElementsByTagName("SynonymId")[0]);
					curactionseq = getXMLNodeValue(curorder.getElementsByTagName("LastActionSeq")[0]);
					curactionseq = (curactionseq > "") ? curactionseq : "0";
					curactionseq = parseInt(curactionseq, 10);

					// update ordering personnel id
					criterion.ordering_personnel_id = getXMLNodeValue(curorder.getElementsByTagName("ProviderId")[0]);
		
					// Handle double-quotes
					curordercdisp = curordercdisp.split('"').join("'");
					curordersdisp = curordersdisp.split('"').join("'");
					curordermnemomic = curordermnemomic.split('"').join("'");
					curordersynid = (curordersynid > "") ? curordersynid : "0";
					curordersentid = (curordersentid > "") ? curordersentid : "0";
					ordersEntityList.ords[i] = {};
		
					ordersEntityList.ords[i].order_id = curorderid;
					ordersEntityList.ords[i].mnemonic = curordermnemomic;
					ordersEntityList.ords[i].clin_disp = curordersdisp;
					ordersEntityList.ords[i].simp_disp = curordersdisp;
					ordersEntityList.ords[i].synonym_id = parseInt(curordersynid, 10);
					ordersEntityList.ords[i].sentence_id = parseInt(curordersentid, 10);
					ordersEntityList.ords[i].action_seq = curactionseq + 1;
					ordersEntityList.ords[i].last_action_seq = curactionseq;
					ordersEntityList.ords[i].reconciled_ind = 0;
				}
				//Sort By Synonym_id and order_sentence_id
				SortIt(ordersEntityList.ords, 1, "synonym_id", 1, "sentence_id");
				SortIt(orderableEntityList.ords, 1, "ord_syn_id", 1, "ord_snt_id");
				for (var i = 0; i < orderableEntityList.ord_cnt; i++) {
					for (var j = 0; j < ordersEntityList.ord_cnt; j++) {
						curorder = ordersEntityList.ords[j];
						curorderable = orderableEntityList.ords[i];
						// valid order which has not yet been reconciled
						if (curorder && curorder !== null && curorder.reconciled_ind === 0 && (
							// Moew on an existing order
							((curorderable.recon_order_action_mean === "DISCONTINUE" || curorderable.recon_order_action_mean === "RECON_MODIFY" || 
									curorderable.recon_order_action_mean === "CANCEL DC") && parseFloat(curorder.order_id) === parseFloat(curorderable.parent_order_id)) ||
							// or a single orderable passed through
							(orderableEntityList.ord_cnt === 1 && orderableEntityList.ord_cnt === ordersEntityList.ord_cnt) || (
								// check for brand new orders (last action seq = 0 or 1) with convert rx, convert inpt and cancel reord
								(curorder.last_action_seq <= 1 && (curorder.synonym_id === curorderable.ord_syn_id && curorder.sentence_id === curorderable.ord_snt_id) && 
										(curorderable.recon_order_action_mean === "CONVERT_RX" || curorderable.recon_order_action_mean === "CONVERT_INPAT" || 
												curorderable.recon_order_action_mean === "CANCEL REORD")) ||
								// or orders continued and resumed
								(curorderable.recon_order_action_mean === "RECON_CONTINUE" || curorderable.recon_order_action_mean === "RECON_RESUME" || 
										curorderable.recon_order_action_mean === "RECON_NON_MED_RX" || curorderable.recon_order_action_mean === "RECON_DO_NOT_CNVT")
							)
						)) {
							// set the order as reconciled
							curorder.reconciled_ind = 1;
							curorderid = curorder.order_id;
							curordercdisp = curorder.clin_disp;
							curordersdisp = curorder.simp_disp;
							curordermnemomic = curorder.mnemonic;
							curordersentid = curorder.sentence_id;
							curordersynid = curorder.synonym_id;
							curactionseq = curorder.action_seq;
							switch (curorderable.opt_sel) {
							case 1:
								// Continue the order -> Keep
								curordercontinueind = 1;
								break;
							case 2:
								// Continue the other with changes - > Modify
								curordercontinueind = 3;
								break;
							case 3:
								// Do not continue the order - > Stop
								curordercontinueind = 2;
								break;
							case 4:
								// Continue the order - > Restart
								curordercontinueind = 1;
								break;
							}
							curorderactionmean = curorderable.recon_order_action_mean;
							// Handle double-quotes
							curordercdisp = curordercdisp.split('"').join("'");
							curordersdisp = curordersdisp.split('"').join("'");
							curorderactionmean = curorderactionmean.split('"').join("'");
							curordermnemomic = curordermnemomic.split('"').join("'");
							curordercomment = curorderable.ord_comment;
							if (curordercomment > " ") {
								curordercomment = curordercomment.encodeStringDelimiters();
							}
							if (curorderactionmean === "RECON_MODIFY") {
								curorderactionmean = "RECON_CONTINUE";
							}
							switch (curorderable.prev_col_index) {
							case 0:
								// Admission
								curorderrecontypeflag = 1;
								break;
							case totalColumns:
								// Discharge
								curorderrecontypeflag = 3;
								break;
							case totalColumns - 1:
								// Before Discharge
								if (curorderactionmean === "CANCEL REORD") {// Restart -> transfer recon
									curorderrecontypeflag = 2;
								} else {
									curorderrecontypeflag = 3;
								}
								break;
							default:
								// Transfer
								curorderrecontypeflag = 2;
								break;
							}
		
							if (curorderactionmean === "CONVERT_INPAT") {// Admission recon
								curorderrecontypeflag = 1;
							}
							if (curorderactionmean === "CONVERT_RX") {// Discharge recon
								curorderrecontypeflag = 3;
							}
							curRecon = [];
							curRecon.push("{");
							curRecon.push('"recon_type_flag" :', curorderrecontypeflag);
							curRecon.push(', "no_known_meds_ind" :', 0);
							// Always reconciled orders
							curRecon.push(', "to_action_seq" :', curactionseq);
							curRecon.push(', "reltn_type_mean" : "', curorderactionmean, '"');
							curRecon.push(', "order_list" : [');
	
							if (curorderactionmean === "CONVERT_RX" || curorderactionmean === "CONVERT_INPAT" || curorderactionmean === "CANCEL REORD") {
								curRecon.push(OrderRecon.buildReconDetailJSON({
									"order_id": curorderid,
									"clinical_display_line": curordercdisp,
									"simplified_display_line": curordersdisp,
									"continue_order_ind": curordercontinueind,
									"recon_order_action_mean": "ORDER",
									"order_mnemonic": curordermnemomic
								}));									
											
								curRecon.push(",");
								
								curRecon.push(OrderRecon.buildReconDetailJSON({
									"order_id": curorderable.parent_order_id,
									"clinical_display_line": curorderable.parent_clin_disp,
									"simplified_display_line": curorderable.parent_simp_disp,
									"continue_order_ind": curordercontinueind,
									"recon_order_action_mean": curorderactionmean,
									"order_mnemonic": curorderable.parent_mnemonic
								}));	
								
							} else {
								curRecon.push(OrderRecon.buildReconDetailJSON({
									"order_id": curorderid,
									"clinical_display_line": curordercdisp,
									"simplified_display_line": curordersdisp,
									"continue_order_ind": curordercontinueind,
									"recon_order_action_mean": curorderactionmean,
									"order_mnemonic": curordermnemomic
								}));								
							}
							curRecon.push("]");						
							curRecon.push("}");	
							orderReconciliations[orderReconciliations.length] = curRecon.join(""); 
							curorderable.order_success_ind = true;
		
							// Comments found
							if (curordercomment.length > 0) {
								appendOrderComment(curorderid, curordercomment);
							}
							j = ordersEntityList.ord_cnt;
							// Terminate ordersEntity loop
						}
					}
				}
			}
		} catch (e) {
			errorHandler(e, "addMOEWReconciliations()");
		}
	}

	
	function generateReconcilationString() {
		var finalizedReconString = " ",
			other_recon_list,
			ord_recon_data,
			ord_comment_data,
			order_recon_json = "",
			order_comment_json = "";
	
		//append other reconciliations if they exist	
		other_recon_list = OrderRecon.finalizeRecon();
		if (other_recon_list.length > 0) {
			orderReconciliations = orderReconciliations.concat(other_recon_list);
		}
		
		// Now Build Reconciliation object
		ord_recon_data = [];
		ord_recon_data.push("{");
		ord_recon_data.push('"ord_recon_list":');
		ord_recon_data.push("{");
		ord_recon_data.push('"encntr_id" : ', parseFloat(criterion.encntr_id).toFixed(2));
		ord_recon_data.push(', "performed_prsnl_id" : ', parseFloat(criterion.ordering_personnel_id).toFixed(2));
		ord_recon_data.push(', "ord_recons" : [', orderReconciliations.join(","), ']');
		ord_recon_data.push('}');
		ord_recon_data.push("}");
			
		// build order comments 
		ord_comment_data = [];
		ord_comment_data.push("{");
		ord_comment_data.push('"ord_comment_list" : ');
		ord_comment_data.push("{");
		ord_comment_data.push('"encntr_id" : ', parseFloat(criterion.encntr_id).toFixed(2));
		ord_comment_data.push(', "performed_prsnl_id" : ', parseFloat(criterion.ordering_personnel_id).toFixed(2));
		ord_comment_data.push(', "ord_comments" : [', orderComments.join(","), ']');
		ord_comment_data.push("}");
		ord_comment_data.push("}");
		
		// Any reconciliation
		if (orderReconciliations.length > 0) {
			order_recon_json = ord_recon_data.join("");
		}
		else {
			order_recon_json = "";
		}
		
		// Any comments
		if (orderComments.length > 0) {
			order_comment_json = ord_comment_data.join("");
		}
		else {
			order_comment_json = "";
		}
		
		done_ord_recon = false;
		done_ord_comments = false;

		return ({
			"ORDER_RECON_STRING": order_recon_json,
			"ORDER_COMMENT_STRING":	order_comment_json
		});
	}
	
	function getXMLNodeValue(xmlnode) {
	    if (xmlnode && xmlnode !== null) {    
	        if (xmlnode.firstChild && xmlnode.firstChild !== null) {
	            return (xmlnode.firstChild.nodeValue);
	        }
	        else {
	            return ("");
	        }
	    }
	    else {
	        return ("");
	    }
	}
	
	function doneOrderReconciliations(jsonData) {
		var refreshPageInd = jsonData.parameters[0],
			callDesc = jsonData.parameters[1];
		var perform_reconciliation_ind = 0;
		switch (callDesc) {
		case "ADVSR_MEDS_REC_ADD_ORD_RECON": 
			done_ord_recon = true;
			break;
		case "ADVSR_MEDS_REC_ADD_ORD_CMNT": 
			done_ord_comments = true;
			break;
		case "ADVSR_MEDS_REC_ADD_ORD_CMPL": 
			done_ord_compliance = true;
			break;
		}
		if (done_ord_recon === true && done_ord_comments === true && done_ord_compliance === true) {
			UtilPopup.closeModalDialog();
			if (refreshPageInd) { // refreshing entire page	
				perform_reconciliation_ind = 1;		
				refreshPage(perform_reconciliation_ind);
			}
			done_ord_recon = false;
			done_ord_comments = false;
			done_ord_compliance = false;
		}
	}
	
	function refreshPage(perform_reconciliation_ind) {
	    var hiddenColumns = OrderGroup.getHiddenColumns().join("-");
	    Windowstorage.set("storedHiddenColumns", hiddenColumns);
	    Windowstorage.set("storedTotalColumns", totalColumns);
	    OrderGroup.reset();
	    purge(orders_table); // clear table handlers to plug memory leaks
	    clearTableData();
	    initalizeOrders(perform_reconciliation_ind);
	}
	
	function buildNewOrder(ord_json_obj) {
		var ord_str  = [];
		ord_str.push("{ORDER|");
		ord_str.push(ord_json_obj.ord_syn_id);
		if (ord_json_obj.col_index === totalColumns) { // Discharge column med -> order as prescription
			ord_str.push("|1|");
		}
		else {
			ord_str.push("|0|");
		}
		ord_str.push(ord_json_obj.ord_snt_id);
		ord_str.push("|0|1}");
		return ord_str.join("");
	}
	
	function copyOrderActionEntity(Obj) {
	    var copyObj = new OrderActionEntity();
	    copyObj.order_id			= Obj.order_id;
	    copyObj.order_name			= Obj.order_name;
	    copyObj.order_group_id		= Obj.order_group_id;
	    copyObj.order_comment		= Obj.order_comment;
	    copyObj.order_as_mnemonic	= Obj.order_as_mnemonic;
	    copyObj.order_hna_mnemonic	= Obj.order_hna_mnemonic;
	    copyObj.cki					= Obj.cki;
	    copyObj.catalog_cd			= Obj.catalog_cd;
	    copyObj.mltm_cat_id			= Obj.mltm_cat_id;
	    copyObj.dc_reason_cd		= Obj.dc_reason_cd;
	    copyObj.synonyms			= Obj.synonyms;
	    copyObj.synonym_id			= Obj.synonym_id;
	    copyObj.sentence_id			= Obj.sentence_id;
		copyObj.order_details		= Obj.order_details;
	    copyObj.order_prsnl_id		= Obj.order_prsnl_id;
	    copyObj.orig_ord_dt_tm		= Obj.orig_ord_dt_tm;
	    copyObj.obj_search_id		= Obj.obj_search_id;
	    copyObj.row_obj				= Obj.row_obj;
	    copyObj.parent_row_obj		= Obj.parent_row_obj;
	    copyObj.prev_col_index		= Obj.prev_col_index;
	    copyObj.col_index			= Obj.col_index;
	    copyObj.next_col_index		= Obj.next_col_index;
	    copyObj.cki					= Obj.cki;
	    copyObj.prev_action_type	= Obj.prev_action_type;
	    copyObj.action_type			= Obj.action_type;
		copyObj.status_type			= Obj.status_type;
	    copyObj.actionable_ind		= Obj.actionable_ind;	
		copyObj.parent_clin_disp	= Obj.clin_disp;
		copyObj.parent_simp_disp	= Obj.order_details;
		copyObj.parent_mnemonic		= Obj.order_name + " (" + Obj.order_as_mnemonic + ")";
		copyObj.parent_syn_id		= Obj.synonym_id;
		copyObj.parent_snt_id		= Obj.sentence_id;
		copyObj.order_phy_name		= "";
		copyObj.med_ind				= Obj.med_ind;
		copyObj.pharmacy_iv_ind		= Obj.pharmacy_iv_ind;
		copyObj.excl_ind			= Obj.excl_ind;
		copyObj.synonyms_cnt		= Obj.synonyms_cnt;
		copyObj.synonyms			= Obj.synonyms;
		copyObj.discontinue_reason	= Obj.discontinue_reason;
		
		return copyObj;
	}
	
	function isNewOrder(cur_order_entity) {
		return (cur_order_entity.prev_col_index === 0 || cur_order_entity.col_index === totalColumns); // not a list of excluded meds
	}
	
	/****** Report methods ***/
	
	/* Function: launchDischRpt
	 * Purpose: Collect orders data from the discharge column into a JSON object and return the object
	 * Parameter: None
	 * Returns: (json_disch_rpt) - JSON object containing order information for orders in discharge column
	 */
	function launchDischRpt() {
		try {
			var window_height = 0;
			var window_width = 0;
								
			if (window.innerHeight && window.innerWidth) {
				window_height = window.innerHeight;
				window_width = window.innerWidth; 
			}
			else if (document.documentElement.clientHeight && document.documentElement.clientWidth) {
				window_height = document.documentElement.clientHeight;
				window_width = document.documentElement.clientWidth;
			}
			else if (document.body.clientHeight && document.body.clientWidth) {
				window_height = document.body.clientHeight;
				window_width = document.body.clientWidth;
			}
			
			checkUnactedPreAdmitOrders();		
			
			var wParams	= "fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no,left=" + (window_width / 3) + 
							",top=" + (window_height / 3) + ",width=" + (window_width / 3) + ",height=" + (window_height / 2) + "";									
			CCLNEWWINDOW('javascript:CCLLINK("DC_MP_OPEN_MPAGE","' + '^MINE^' +
				',^static_content\\advsr_meds_rec\\html\\advsr_meds_rec_disch_rpt.html^' +
				',^' + criterion.person_id + '^' +
				',^' + criterion.encntr_id + '^' +
				',^' + criterion.prsnl_id + '^' +
				',^' + criterion.debug_mode_ind + '^' +
				'",1)', '_dischrpt', "'" + wParams + "'", 1, 1);
		} catch (e) {
	        errorHandler(e, "launchDischRpt()");
	    }
	} 
	
	function checkUnactedPreAdmitOrders() {
		var curEntity, curcolIndex, entityList = orderActionEntityList.getMapCollection(), idx = 0, len = entityList.length,
			inactorders = "",
			inactdiscorders = "",
			inactcnt = 0,
			inactdisccnt = 0,
			alertStr,
			alertMsg = " The following are Documented Med(s) by Hx. No action has been taken since admission; please review: \n\n $ORDERNAME$ ",
			alertMsg2 = "The following are discontinued Documented Med(s) by Hx. No action has been taken since admission; please review:  \n $ORDERNAME$ ";
		for (idx = 0; idx < len; idx++) {			
			curEntity = entityList[idx].getValue();
			// Only valid actions
			if (parseInt(curEntity.actionable_ind, 10) === 1 && curEntity.col_index === 0 &&
					curEntity.status_type !== ACK_STATUS_FLAG) {
				if (curEntity.status_type === 3) { // discontinued med
					if (inactdisccnt > 0) {
						inactdiscorders = inactdiscorders + ", \n ";
					}
					inactdiscorders += curEntity.order_as_mnemonic;
					inactdisccnt += 1;
				}
				else {
					if (inactcnt > 0) {
						inactorders = inactorders + ", \n ";
					}
					inactorders = inactorders + curEntity.order_as_mnemonic;
					inactcnt += 1;
				}
			}
		}
		if (inactorders > " ") {
			alertStr = alertMsg.split("$ORDERNAME$").join(inactorders);
		}
		if (alertStr > " ") {
			alert(alertStr);
		}
	}

	return {
		unloadURLParameters: function () {
			var cur_params = window.location.search.replace(/%20/g, " ").split("?").join("").split(",");
			criterion.person_id = parseFloat(cur_params[1]);
			criterion.encntr_id = parseFloat(cur_params[2]);
			criterion.prsnl_id = parseFloat(cur_params[3]);
			criterion.debug_mode_ind = 0; 
			if (cur_params[4]) {
				if (!(_.isNaN(parseInt(cur_params[4], 10)))) {
					criterion.debug_mode_ind = parseInt(cur_params[4], 10);
				}
			}
			Windowstorage.set("debugModeIndicator", criterion.debug_mode_ind);
			GlobalAjaxCclHandler = AjaxHandler;
			GlobalAjaxCclHandler.setDebugMode(criterion.debug_mode_ind);
			GlobalAjaxCclHandler.trim_float_zeros(false);

			return criterion;
		},
		
		initializeMpage: function () {
			img_loader = "<img id='img-load-initial' src='" + icons.root_path + icons.icon_folder_name + icons.circleLoading + "' class='img-abs-center'></img>";
			
			_g("div_tbl_outer").innerHTML += img_loader;

			var storedHiddenColumns = Windowstorage.get("storedHiddenColumns").split("-");
			if (storedHiddenColumns && storedHiddenColumns.length > 1) {
				OrderGroup.setHiddenColumns(storedHiddenColumns);
			}
			GlobalAjaxCclHandler.ajax_request({
				request: {
					type: "XMLCCLREQUEST",
					target: "ADVSR_MEDS_REC_INIT:dba",
					parameters: "^MINE^,^" + convertFloat(criterion.person_id) + "^,^" +
						convertFloat(criterion.encntr_id) + "^,^" + convertFloat(criterion.prsnl_id) + "^"
				},
				response: {
					type: "JSON",
					target: init
				}
			});
			resizePage();
		},
		
		checkReconciliationPrivileges: function (personnel_id, encounter_id) {
			var privilegeFlag = false, cclParams = ["^MINE^", encounter_id, personnel_id].join(",");

			GlobalAjaxCclHandler.ajax_request({
				request: {
					type: "XMLCCLREQUEST",
					target: "INN_MP_GET_TRANSF_PRIV",
					parameters: cclParams,
					synchronous: true
				},
				response: {
					type: "JSON",
					target: function (reply) {
						_.find(reply.response.PRIV_REPLY.PRIVILEGE.PRIVILEGES, function (priv) {
							if (priv.PRIVILEGE_CD_MEAN === "ORDERRECON" && priv.PRIVILEGE_TYPE_CD_MEAN === "YES") {
								privilegeFlag = true;
							}
						});
					}
				}
			});

			return privilegeFlag;
		},

		reconcileOrderables: function () {
			try {
				// verify privileges
				if (MedRec.checkReconciliationPrivileges(criterion.ordering_personnel_id, criterion.encntr_id)) {
					MedRec.performReconciliation(true);
				} else {
					// insufficient privs, launch provider selection dialog
					ProviderSelectionModule.launch();
				}
			} catch (e) {
				errorHandler(e, "reconcileOrderables()");
			}
		},

		evalItemGroupAction: function (columnIndex, actionType) {
			try {
				var evalCntr = 0,
					ordersToEval = orderActionEntityList.map(function (obj) {
						var return_value, orderGroup = orderGroupEntityList.get("order_group_" + obj.order_group_id);
						var applicable_action_ind = false;
						// actionable only
						if (obj.actionable_ind === 1) {
							// resume all
							if (actionType === 5) {
								// should resume on acknowledged pre-admit meds or inpatient orders
								if ((obj.status_type === ACK_STATUS_FLAG && obj.col_index === 0) || obj.col_index > 0) {
									applicable_action_ind = true;
								}
							}
							// other actions
							else {
								applicable_action_ind = true;
							}
						}
						
						// object has an applicable action and not discontinued 
						if (applicable_action_ind && orderGroup.discontinued_ind !== 1 &&
								// Always selecting meds, but if selectAllMedsAndOrders is on we'll select orders too
								(Preferences.get("selectAllMedsAndOrders") === 1 || obj.med_ind === 1) &&
								// For resume all (actiontype = 5), only on acknowledged medications
								// For all other actions, apply action to current column
								(actionType === 5 || obj.col_index === columnIndex)) {
							return_value = true;		
						} else {
							return_value = false;
						}
						return return_value;
					});
				//expand collapsible category rows
				if (ordersToEval.length > 0) {
					$(".collapsible-header-cell span.icon-row-closed").click();
				}
				initializeMessageStack();
				actionsSize = ordersToEval.length;
				for (evalCntr = 0; evalCntr < actionsSize; evalCntr++) {						
					evalItemAction(ordersToEval[evalCntr].hashmap_key, actionType, 0);
				}
			} catch (e) {
		        errorHandler(e, "evalItemGroupAction()");
			}
		},
		evalItemAction: function (action_entity_key, action_type, disch_flag) {
			evalItemAction(action_entity_key, action_type, disch_flag);
		},
		unloadMpage: function (e) {
			purge(orders_table);// clear table handlers to plug memory leaks
			if (locs_tabs_list) {
				var hiddenColumns = OrderGroup.getHiddenColumns().join("-");
				Windowstorage.set("storedHiddenColumns", hiddenColumns);
				Windowstorage.set("storedTotalColumns", totalColumns);
				window.location.reload(true);
			}
		},
		resizeMPage: function () {
			resizePage();
		},
		initializeVariables: function () {
			initializeVariables();
		},
		"initiateSign": initiateSign,
		"anyOrdersToSign": anyOrdersToSign,
		"performReconciliation": performReconciliation,
		launchHxMOEW: function () {
			var str = criterion.person_id + "|" + criterion.encntr_id + "|{ORDER|0|0|0|0|0}|24|{3|127}|16}";
			MPAGES_EVENT("ORDERS", str);
			// refresh page only if no orders to sign
			if (!anyOrdersToSign()) {	
				refreshPage();
			}
		},	
		launchOrdersMOEW: function () {
			var str = criterion.person_id + "|" + criterion.encntr_id + "|{ORDER|0|0|0|0|0}|0|{2|127}{3|127}|8}";
			MPAGES_EVENT("ORDERS", str);
			// refresh page only if no orders to sign
			if (!anyOrdersToSign()) {	
				refreshPage();
			}
		},	
		launchPlansMOEW: function () {
			var str = criterion.person_id + "|" + criterion.encntr_id + "|{ORDER|0|0|0|0|0}|24|{2|127}{3|127}|8}";
			MPAGES_EVENT("ORDERS", str);
			// refresh page only if no orders to sign
			if (!anyOrdersToSign()) {	
				refreshPage();
			}
		},
		refreshPage: function () {
			refreshPage();
		},
		updateMedHistory: function () {
			updateMedHistory();
		},
		launchDischRpt: function () {
			launchDischRpt();
		},
		getDiscontinuedHxOrders: function () {
			return getDiscontinuedHxOrders();
		},
		"doneOrderReconciliations": doneOrderReconciliations,
		// Method used for injecting unit tests
		setMpagesAPIRoot: function (method) {
			MPAGES_API_ROOT = method;
		},
		setMOEWType: function (mType) {
			MOEWType = mType;
		}
	};
}());

/* Unload parameters (person_id,encntr_id, prsnl_id e.t.c.) from URL*/
MedRec.unloadURLParameters();

/* Attach global window event handlers */
Util.addEvent(window, "load", MedRec.initializeMpage);

Util.addEvent(window, "resize", MedRec.resizeMPage);

Util.addEvent(window, "unload", MedRec.unloadMpage);
var OrdersLayout = (function ($, doT) {
	var parentTable,
	headerRow,
	columnsCount,
	totalColumnsCount = 0,
	locationTabsHTML = "<div id='location-tabs' class='tabelm'>",
	map_column_actioned = {},
	map_column_total = {},
	map_column_queue = {},
	mapColumnMedTotal = {},
	layoutPrefs,
	meds_hdr_table, 
	PREADMIT_COLUMN_TYPE = 0,
	INPATIENT_COLUMN_TYPE = 1,
	DISCHARGE_COLUMN_TYPE = 2,
	LOCATION_SELECTOR_TEMPLATE, // templates loaded in setParent
	PREADMIT_HEADER_TEMPLATE,	// since we use jQuery to load them
	TRANSFER_HEADER_TEMPLATE,
	DISCHARGE_HEADER_TEMPLATE,
	currentColumnLocations; // tracks which locations are displayed in what location
	
	
	
	function buildFirstColumnSelector(locationNames) {
		var locationData = [], location, iterator;
		
		// all locations until the middle column
		for (iterator = 0; iterator < currentColumnLocations[1]; iterator++) {
			location = {};
			// selection is available, unless it's the current column
			location.cssClass = (iterator !== currentColumnLocations[0]) ? "available" : "current";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// add the rest of the unavailable locations
		for (iterator = currentColumnLocations[1]; iterator < totalColumnsCount; iterator++) {
			location = {};
			location.cssClass = "unavailable";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// pass the data through the template and return the resulting HTML
		return LOCATION_SELECTOR_TEMPLATE(locationData);
	}
	
	function buildMiddleColumnSelector(locationNames) {
		var locationData = [], location, iterator;
		
		// unavailable selections before and including the first visible column
		for (iterator = 0; iterator <= currentColumnLocations[0]; iterator++) {
			location = {};
			location.cssClass = "unavailable";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// available middle selections
		for (iterator = currentColumnLocations[0] + 1; iterator < currentColumnLocations[2]; iterator++) {
			location = {};
			// selection is available, unless it's the current column
			location.cssClass = (iterator !== currentColumnLocations[1]) ? "available" : "current";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// rest of the columns unavailable starting with the last visible column
		for (iterator = currentColumnLocations[2]; iterator < totalColumnsCount; iterator++) {
			location = {};
			location.cssClass = "unavailable";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// pass the data through the template and return the resulting HTML
		return LOCATION_SELECTOR_TEMPLATE(locationData);
	}
	
	function buildLastColumnSelector(locationNames) {
		var locationData = [], location, iterator;
		
		// unavailable selections up to and including the middle column
		for (iterator = 0; iterator <= currentColumnLocations[1]; iterator++) {
			location = {};
			location.cssClass = "unavailable";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// available selections after the middle column
		for (iterator = currentColumnLocations[1] + 1; iterator < totalColumnsCount; iterator++) {
			location = {};
			// selection is available, unless it's the current column
			location.cssClass = (iterator !== currentColumnLocations[2]) ? "available" : "current";
			location.name = locationNames[iterator];
			locationData.push(location);
		}
		
		// pass the data through the template and return the resulting HTML
		return LOCATION_SELECTOR_TEMPLATE(locationData);
	}
	
	// returns a builder for the location selector based on the column index
	function getColumnSelectorFunction(columnIndex, locationNames) {
		var currentLocation = currentColumnLocations.indexOf(columnIndex); 
		
		if (currentLocation === 0) {
			return buildFirstColumnSelector(locationNames);
		}
		else if (currentLocation === 1) {
			return buildMiddleColumnSelector(locationNames);
		}
		else if (currentLocation === 2) {
			return buildLastColumnSelector(locationNames);
		}
	}
	
	function setReconcileButtonDisplay(displayNode, columnIndex) {
		try {
			if (displayNode && map_column_actioned[columnIndex] >= 0 && map_column_total[columnIndex] >= 0 && map_column_queue[columnIndex] >= 0) {
				displayNode.value = Preferences.get("preAdmitRecButton") + " (" + (map_column_queue[columnIndex]) + " of " + (map_column_total[columnIndex] - map_column_actioned[columnIndex]) + ")";
				displayNode.title = "Click to " + displayNode.value;
			}
		} catch (e) {
			errorHandler(e, "setReconcileButtonDisplay()");
		}
	}
	
	
	function setSelectAllIconDisplay($iconGrouping, columnIndex, headerIndex) {
		// have to determine if the Select All icons action on meds only or all items
		// in the preadmit column, we use map_column_total and map_column_actioned
		// all other columns will use mapColumnMedTotal and 0 unless "selectAllMedsAndOrders" is disabled
		var columnTotal, actionedTotal = 0;
		if (Preferences.get("selectAllMedsAndOrders") === 0 && columnIndex > 0) {
			columnTotal = mapColumnMedTotal[headerIndex];
		}
		else {
			columnTotal = map_column_total[headerIndex];
		}
			
		
		if (!(Preferences.get("selectAllMedsAndOrders") === 0 && columnIndex === 0)) {
			actionedTotal = map_column_actioned[columnIndex];
		}
		
		if (map_column_queue[columnIndex] >= columnTotal - actionedTotal) {
			$iconGrouping.find(".icon-active-acknowledge").removeClass("icon-active-acknowledge").addClass("icon-inactive-acknowledge");
			$iconGrouping.find(".icon-active-keep").removeClass("icon-active-keep").addClass("icon-inactive-keep");
			$iconGrouping.find(".icon-active-modify").removeClass("icon-active-modify").addClass("icon-inactive-modify");
			$iconGrouping.find(".icon-active-stop").removeClass("icon-active-stop").addClass("icon-inactive-stop");
		} 
		else {
			$iconGrouping.find(".icon-inactive-acknowledge").removeClass("icon-inactive-acknowledge").addClass("icon-active-acknowledge");
			$iconGrouping.find(".icon-inactive-keep").removeClass("icon-inactive-keep").addClass("icon-active-keep");
			$iconGrouping.find(".icon-inactive-modify").removeClass("icon-inactive-modify").addClass("icon-active-modify");
			$iconGrouping.find(".icon-inactive-stop").removeClass("icon-inactive-stop").addClass("icon-active-stop");
		}
	}
	
	// OrdersLayout public API
	return {
		isInpatientColumn: function (colIndex) {
			return (colIndex > 0  && colIndex <= columnsCount);
		},
		isPreAdmissionColumn: function (colIndex) {
			return (colIndex === 0);
		},
		// this determines if the column's actions will be for discharge
		isDischargeColumn: function (colIndex) {
			return (colIndex === columnsCount);
		},
		isLastColumn: function (colIndex) {
			return (colIndex === columnsCount + 1);
		},
		getPreAdmitColumnType: function () {
			return PREADMIT_COLUMN_TYPE;
		},
		getTransferColumnType: function () {
			return INPATIENT_COLUMN_TYPE;
		},
		getDischargeColumnType: function () {
			return DISCHARGE_COLUMN_TYPE;
		},
		getLocationTabs: function () {
			return locationTabsHTML;
		},
		getTotalColumnCount: function () {
			return totalColumnsCount;
		},
		getCurrentColumnLocations: function(){
			return(currentColumnLocations);
		},
		setCurrentColumnLocations: function (arrayColumnLocations) {
			currentColumnLocations = arrayColumnLocations;
		},
		setParent: function (pDOM) {
			meds_hdr_table = _g("section_hdr_meds");
		
			parentTable = pDOM;
			totalColumnsCount = 0;
			
			locationTabsHTML = "<div id='location-tabs' class='tabelm'>";
			
			headerRow = meds_hdr_table.insertRow();
			headerRow.className = "tbl-fxd-hdr-tr col-row";
			
			headerRow.style.position = "relative";
			headerRow.style.zIndex = 10;
			
			LOCATION_SELECTOR_TEMPLATE = doT.template($("#LocationSelectorTemplate").html());
			PREADMIT_HEADER_TEMPLATE = doT.template($("#PreadmitHeaderTemplate").html());
			TRANSFER_HEADER_TEMPLATE = doT.template($("#TransferHeaderTemplate").html());
			DISCHARGE_HEADER_TEMPLATE = doT.template($("#DischargeHeaderTemplate").html());
		},
		buildTable: function (dataPrefs) {
			try {
				var curColumnLayoutPrefs, locationNames = [];
				// Set total columns count => locations count + preadmit + discharge
				totalColumnsCount = dataPrefs.MEDSRECLOCATIONS.LOCS.length + 2;
				
				// populate locationNames
				locationNames.push("Pre-Admission Orders");
				for (var locIndex = 0, length = dataPrefs.MEDSRECLOCATIONS.LOCS.length; locIndex < length; locIndex++) {
					// last inpatient column is the current location, denoted by <angle brackets>
					if (locIndex === length - 1 && dataPrefs.MEDSRECLOCATIONS.LOCS[locIndex].LOCNAME > " ") {
						locationNames.push("Inpatient (&lt; " + dataPrefs.MEDSRECLOCATIONS.LOCS[locIndex].LOCNAME + " &gt;) Orders");						
					}
					else {
						locationNames.push("Inpatient (" + dataPrefs.MEDSRECLOCATIONS.LOCS[locIndex].LOCNAME + ") Orders");
					}
				}
				locationNames.push("Discharge Orders");
				
				// get layout preferences
				layoutPrefs = Preferences.get("layoutPreferences");
				
				// pre-admit column
				OrdersLayout.buildColumn({
					"columnIndex": 0,
					"columnType": PREADMIT_COLUMN_TYPE,
					"locationNames": locationNames
				});
				locationTabsHTML += "<div id='tab0' class='tabelmtab' ><h2>Pre-Admission</h2></div>";
				
				// inpatient columns
				columnsCount = dataPrefs.MEDSRECLOCATIONS.LOCS.length;
				for (var i = 0; i < columnsCount; i++) {
					OrdersLayout.buildColumn({
						"columnIndex": (i + 1), // i+1 since the inpatient columns start at columnIndex = 1 and i starts at 0
						"columnType": INPATIENT_COLUMN_TYPE,
						"locationNames": locationNames
					});
					locationTabsHTML += "<div id='tab" + (i + 1) + "' class='tabelmtab' ><h2>" + dataPrefs.MEDSRECLOCATIONS.LOCS[i].LOCNAME + "</h2></div>";
				}
				
				// discharge column		
				OrdersLayout.buildColumn({
					"columnIndex": columnsCount + 1,
					"columnType": DISCHARGE_COLUMN_TYPE,
					"locationNames": locationNames
				});
				locationTabsHTML += "<div id='tab" + (columnsCount + 1) + "' class='tabelmtab' ><h2>Discharge</h2></div>";
				locationTabsHTML += "</div>";
			} catch (e) {
				errorHandler(e, "buildTable()");
			}			
		},
		buildColumn: function (colPrefs) {
			try {
				var columnIndex = colPrefs.columnIndex, locationNames = colPrefs.locationNames, curColumnCell, templateData = {};
				
				// Initialize Column Queue to 0
				map_column_queue[columnIndex] = 0;
				map_column_actioned[columnIndex] = 0;
				map_column_total[columnIndex] = 0;
				mapColumnMedTotal[columnIndex] = 0;
				
				// create the table cell
				curColumnCell = headerRow.insertCell();
				curColumnCell.colSpan = 3;
				curColumnCell.className = "column-header";

				templateData.selectAll = Preferences.get("selectAll");
				templateData.columnIndex = columnIndex;
				
				switch (colPrefs.columnType) {
				case PREADMIT_COLUMN_TYPE:
					// build JSON object for template 
					// button tooltips
					templateData.historicalValue = Preferences.get("preAdmitHxButton");
					templateData.reconcileValue = Preferences.get("preAdmitRecButton");
					// selectAll icon tooltips
					templateData.keepIconTitle = Preferences.get("admissionKeepTooltip");
					templateData.modifyIconTitle = Preferences.get("admissionModifyTooltip");
					templateData.stopIconTitle = Preferences.get("admissionStopTooltip");
					templateData.acknowledgeIconTitle = Preferences.get("admissionAcknowledgeTooltip");
					$(curColumnCell).html(PREADMIT_HEADER_TEMPLATE(templateData));
					
					// bind button functions
					
					// historical button
					$(curColumnCell).find("input.order-column-historical").first().click(function () { // hx
						MedRec.launchHxMOEW();
					});
					
					// column queue button
					$(curColumnCell).find("input.order-column-queue").first().click(function () { // reconcile
						if (MedRec.anyOrdersToSign()) {
							MedRec.setMOEWType("SILENT_MOEW");
							MedRec.initiateSign();
						} else {
							MedRec.launchOrdersMOEW();
						}
					});
					break;
				case INPATIENT_COLUMN_TYPE:
					templateData.plansValue = Preferences.get("curLocPlanButton");
					templateData.favoritesValue = Preferences.get("curLocFavButton");
					templateData.ordersValue = Preferences.get("curLocOrdButton");
					
					// selectAll icon tooltips, dependent on the destination (transfer or discharge from inpatient location)
					if (OrdersLayout.isDischargeColumn(columnIndex)) {
						templateData.keepIconTitle = Preferences.get("dischKeepTooltip");
						templateData.modifyIconTitle = Preferences.get("dischModifyTooltip");
						templateData.stopIconTitle = Preferences.get("dischStopTooltip");
					} else {
						templateData.keepIconTitle = Preferences.get("transferKeepTooltip");
						templateData.modifyIconTitle = Preferences.get("transferModifyTooltip");
						templateData.stopIconTitle = Preferences.get("transferStopTooltip");
					}
					
					
					templateData.locationName = locationNames[columnIndex];
					$(curColumnCell).html(TRANSFER_HEADER_TEMPLATE(templateData));
					
					// bind button functions
					// plans button
					$(curColumnCell).find("input.order-column-plans").first().click(function () { // plans
						if (MedRec.anyOrdersToSign()) {
							MedRec.setMOEWType("PLANS_MOEW");
							MedRec.initiateSign();
						} else {
							MedRec.launchPlansMOEW();
						}
					});
					// favorites button
					$(curColumnCell).find("input.order-column-favorites").first().click(function () { // favorites
						FavoriteOrders.launch(INPATIENT_COLUMN_TYPE);
					});
					
					// column queue
					$(curColumnCell).find("input.order-column-queue").first().click(function () { // orders
						if (MedRec.anyOrdersToSign()) {
							MedRec.setMOEWType("SILENT_MOEW");
							MedRec.initiateSign();
						} else {
							MedRec.launchOrdersMOEW();
						}
					});
					break;
				case DISCHARGE_COLUMN_TYPE:
					templateData.plansValue = Preferences.get("dischPlanButton");
					templateData.favoritesValue = Preferences.get("dischFavButton");
					templateData.ordersValue = Preferences.get("dischOrdButton");
					templateData.printValue = Preferences.get("printIconIndicator");
					templateData.resumeAllTooltip = Preferences.get("resumeAllTooltip");
					$(curColumnCell).html(DISCHARGE_HEADER_TEMPLATE(templateData));
					
					// bind button functions
					// plans button
					$(curColumnCell).find("input.order-column-plans").first().click(function () { // plans
						if (MedRec.anyOrdersToSign()) {
							MedRec.setMOEWType("PLANS_MOEW");
							MedRec.initiateSign();
						} else {
							MedRec.launchPlansMOEW();
						}
					});
					// favorites button
					$(curColumnCell).find("input.order-column-favorites").first().click(function () { // favorites
						FavoriteOrders.launch(DISCHARGE_COLUMN_TYPE);
					});
					
					// column queue
					$(curColumnCell).find("input.order-column-queue").first().click(function () { // orders
						if (MedRec.anyOrdersToSign()) {
							MedRec.setMOEWType("SILENT_MOEW");
							MedRec.initiateSign();
						} else {
							MedRec.launchOrdersMOEW();
						}
					});
					break;
				}
				
				// location selector only for more than 3 levels of care
				if (locationNames.length > 3) {
					$(curColumnCell).find(".column-title").first()
						// apply the hover style
						.hover(function () {
							$(this).addClass("hover");
						}, function () {
							$(this).removeClass("hover").removeClass("clicked");
							$(this).find("ul.location-selector").remove();
						})
						// attach click handler to the column title
						.click(function (columnEvent) {
							$(this)
								.removeClass("hover")
								.addClass("clicked");
							// remove selector if it exists
							var $selector = $(this).find("ul.location-selector");
							if ($selector.length) {
								$selector.remove();
								$(this).removeClass("clicked");
								return;
							}
							// have to dynamically evaluate where the column is located
							var locationSelector = getColumnSelectorFunction(columnIndex, locationNames);
							
							$(locationSelector)
								.css({
									"left": 0,
									"top": $(this).height() + 2
								})
								.delegate("li.available", "mouseenter", function (hoverEnterEvent) {
									$(this).addClass("hover");
								})
								.delegate("li.available", "mouseleave", function (hoverLeaveEvent) {
									$(this).removeClass("hover");
								})
								.delegate("li.available", "click", function (liClickEvent) {
									var newIndex = $(this).index();
									// swap columns
									OrderGroup.toggleTableColumnDisplay(columnIndex, "none");
									OrderGroup.toggleTableColumnDisplay(newIndex, "block");
									
									// update the current column locations
									currentColumnLocations[currentColumnLocations.indexOf(columnIndex)] = newIndex;
								})
								.appendTo(this);
						});
				}
			} catch (e) {
				errorHandler(e, "buildColumn()");
			}			
		},
		setAllSelectAllIconDisplays: function () {
			try {
				var iconGroupings = $(".icon-grouping").toArray();

				for (var columnIndex = 0, len = iconGroupings.length; columnIndex < len; columnIndex++) {
					var headerIndex = columnIndex;
					if (!(OrdersLayout.isPreAdmissionColumn(columnIndex))) {
						headerIndex = columnIndex - 1;
					}
					
					/*
					 * setSelectAllIconDisplay($(iconGroupings[columnIndex]), columnIndex, headerIndex);
					 */
				}
			} catch (err) {
				errorHandler(err, "setAllSelectAllIconDisplays()");
			}
		},
		addToOrderableQueue: function (columnIndex, addNum) {
			var columnCellNode = $(headerRow.cells[columnIndex]).find(".button-container").get(0),
				queueButtonNode = Util.Style.g("order-column-queue", columnCellNode)[0],
				curButtonDisplay;
			if ((map_column_queue[columnIndex] + addNum) >= 0) {
				map_column_queue[columnIndex] = parseInt(map_column_queue[columnIndex], 10) + addNum;
			}
			
			// fieldset legend text for select all
			var headerIndex = columnIndex;
			if (!(OrdersLayout.isPreAdmissionColumn(columnIndex))) {
				headerIndex = columnIndex - 1;
			}
				
			
			var $iconGrouping = $(".column-header").eq(headerIndex).find(".icon-grouping");
			
			if (map_column_queue[columnIndex] > 0) {
				$iconGrouping.find("fieldset legend").text("Remaining");
			} else { 
				$iconGrouping.find("fieldset legend").text("All");
			}
			
			
			if (columnCellNode && queueButtonNode) {
				if (OrdersLayout.isPreAdmissionColumn(columnIndex)) {
					setReconcileButtonDisplay(queueButtonNode, columnIndex);
				} else {
					if (OrdersLayout.isInpatientColumn(columnIndex)) {
						curButtonDisplay = Preferences.get("curLocOrdButton");
					} else {	
						curButtonDisplay = Preferences.get("dischOrdButton");
					}

					queueButtonNode.value = curButtonDisplay + " (" + map_column_queue[columnIndex] + ")";
					if (map_column_queue[columnIndex] === 0) {
						queueButtonNode.title = "Add " + curButtonDisplay;
					} else {
						queueButtonNode.title = "Click to Sign " + curButtonDisplay;
					}
				}
			}
		},
		addActionedOrders: function (columnIndex, addNum) {
			if (map_column_actioned[columnIndex] + addNum >= 0) {
				map_column_actioned[columnIndex] = parseInt(map_column_actioned[columnIndex], 10) + addNum;
			}
		},
		addTotalOrders: function (columnIndex, addNum) {
			if (map_column_total[columnIndex] + addNum >= 0) {
				map_column_total[columnIndex] = parseInt(map_column_total[columnIndex], 10) + addNum;
			}
		},
		addMedOrder: function (columnIndex) {
			if (mapColumnMedTotal[columnIndex] + 1 >= 0) {
				mapColumnMedTotal[columnIndex] = parseInt(mapColumnMedTotal[columnIndex], 10) + 1;
			}
		},
		updateTotalOrdersDisplay: function (columnIndex) {
			var columnCellNode = $(headerRow.cells[columnIndex]).find(".button-container").get(0),
				queueButtonNode = Util.Style.g("order-column-queue", columnCellNode)[0],
				curButtonDisplay;
			if (columnCellNode && queueButtonNode) {
				if (OrdersLayout.isPreAdmissionColumn(columnIndex)) {
					map_column_actioned[columnIndex] += map_column_queue[columnIndex];
					setReconcileButtonDisplay(queueButtonNode, columnIndex);
				} else { 
					if (OrdersLayout.isInpatientColumn(columnIndex)) {							
						curButtonDisplay = Preferences.get("curLocOrdButton");
					} else {	
						curButtonDisplay = Preferences.get("dischOrdButton");
					}
					queueButtonNode.value = curButtonDisplay + " (" + map_column_queue[columnIndex] + ")";
				}
			}
		}	
	};
})($, doT);