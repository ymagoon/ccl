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
function hmo(evt,n,comp){evt=evt||window.event;
var s=n.style,p=getPosition(evt),vp=gvs(),so=gso(),left=p.x+20,top=p.y+20;
n._ps=n.previousSibling;
n.hmo=true;
function hover(){if(n.hmo==true){s.display="block";
if(comp){if(comp.isEditMode()){clearTimeout(n.timer);
return;
}}if(left+n.offsetWidth>vp[1]+so[1]){left=left-40-n.offsetWidth;
if(left<0){left=0;
}}if(top+n.offsetHeight>vp[0]+so[0]){if(top-40-n.offsetHeight<so[0]){if(left>0){top=10+so[0];
}}else{top=top-40-n.offsetHeight;
}}document.body.appendChild(n);
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
}(function(){function q(a,c,d){if(a===c){return a!==0||1/a==1/c;
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
(function(){var h=this,p=h.Backbone,e;
e=typeof exports!=="undefined"?exports:h.Backbone={};
e.VERSION="0.5.3";
var f=h._;
if(!f&&typeof require!=="undefined"){f=require("underscore")._;
}var g=h.jQuery||h.Zepto;
e.noConflict=function(){h.Backbone=p;
return this;
};
e.emulateHTTP=!1;
e.emulateJSON=!1;
e.Events={bind:function(a,b,c){var d=this._callbacks||(this._callbacks={});
(d[a]||(d[a]=[])).push([b,c]);
return this;
},unbind:function(a,b){var c;
if(a){if(c=this._callbacks){if(b){c=c[a];
if(!c){return this;
}for(var d=0,e=c.length;
d<e;
d++){if(c[d]&&b===c[d][0]){c[d]=null;
break;
}}}else{c[a]=[];
}}}else{this._callbacks={};
}return this;
},trigger:function(a){var b,c,d,e,f=2;
if(!(c=this._callbacks)){return this;
}for(;
f--;
){if(b=f?a:"all",b=c[b]){for(var g=0,h=b.length;
g<h;
g++){(d=b[g])?(e=f?Array.prototype.slice.call(arguments,1):arguments,d[0].apply(d[1]||this,e)):(b.splice(g,1),g--,h--);
}}}return this;
}};
e.Model=function(a,b){var c;
a||(a={});
if(c=this.defaults){f.isFunction(c)&&(c=c.call(this)),a=f.extend({},c,a);
}this.attributes={};
this._escapedAttributes={};
this.cid=f.uniqueId("c");
this.set(a,{silent:!0});
this._changed=!1;
this._previousAttributes=f.clone(this.attributes);
if(b&&b.collection){this.collection=b.collection;
}this.initialize(a,b);
};
f.extend(e.Model.prototype,e.Events,{_previousAttributes:null,_changed:!1,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes);
},get:function(a){return this.attributes[a];
},escape:function(a){var b;
if(b=this._escapedAttributes[a]){return b;
}b=this.attributes[a];
return this._escapedAttributes[a]=(b==null?"":""+b).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;");
},has:function(a){return this.attributes[a]!=null;
},set:function(a,b){b||(b={});
if(!a){return this;
}if(a.attributes){a=a.attributes;
}var c=this.attributes,d=this._escapedAttributes;
if(!b.silent&&this.validate&&!this._performValidation(a,b)){return !1;
}if(this.idAttribute in a){this.id=a[this.idAttribute];
}var e=this._changing;
this._changing=!0;
for(var g in a){var h=a[g];
if(!f.isEqual(c[g],h)){c[g]=h,delete d[g],this._changed=!0,b.silent||this.trigger("change:"+g,this,h,b);
}}!e&&!b.silent&&this._changed&&this.change(b);
this._changing=!1;
return this;
},unset:function(a,b){if(!(a in this.attributes)){return this;
}b||(b={});
var c={};
c[a]=void 0;
if(!b.silent&&this.validate&&!this._performValidation(c,b)){return !1;
}delete this.attributes[a];
delete this._escapedAttributes[a];
a==this.idAttribute&&delete this.id;
this._changed=!0;
b.silent||(this.trigger("change:"+a,this,void 0,b),this.change(b));
return this;
},clear:function(a){a||(a={});
var b,c=this.attributes,d={};
for(b in c){d[b]=void 0;
}if(!a.silent&&this.validate&&!this._performValidation(d,a)){return !1;
}this.attributes={};
this._escapedAttributes={};
this._changed=!0;
if(!a.silent){for(b in c){this.trigger("change:"+b,this,void 0,a);
}this.change(a);
}return this;
},fetch:function(a){a||(a={});
var b=this,c=a.success;
a.success=function(d,e,f){if(!b.set(b.parse(d,f),a)){return !1;
}c&&c(b,d);
};
a.error=i(a.error,b,a);
return(this.sync||e.sync).call(this,"read",this,a);
},save:function(a,b){b||(b={});
if(a&&!this.set(a,b)){return !1;
}var c=this,d=b.success;
b.success=function(a,e,f){if(!c.set(c.parse(a,f),b)){return !1;
}d&&d(c,a,f);
};
b.error=i(b.error,c,b);
var f=this.isNew()?"create":"update";
return(this.sync||e.sync).call(this,f,this,b);
},destroy:function(a){a||(a={});
if(this.isNew()){return this.trigger("destroy",this,this.collection,a);
}var b=this,c=a.success;
a.success=function(d){b.trigger("destroy",b,b.collection,a);
c&&c(b,d);
};
a.error=i(a.error,b,a);
return(this.sync||e.sync).call(this,"delete",this,a);
},url:function(){var a=k(this.collection)||this.urlRoot||l();
if(this.isNew()){return a;
}return a+(a.charAt(a.length-1)=="/"?"":"/")+encodeURIComponent(this.id);
},parse:function(a){return a;
},clone:function(){return new this.constructor(this);
},isNew:function(){return this.id==null;
},change:function(a){this.trigger("change",this,a);
this._previousAttributes=f.clone(this.attributes);
this._changed=!1;
},hasChanged:function(a){if(a){return this._previousAttributes[a]!=this.attributes[a];
}return this._changed;
},changedAttributes:function(a){a||(a=this.attributes);
var b=this._previousAttributes,c=!1,d;
for(d in a){f.isEqual(b[d],a[d])||(c=c||{},c[d]=a[d]);
}return c;
},previous:function(a){if(!a||!this._previousAttributes){return null;
}return this._previousAttributes[a];
},previousAttributes:function(){return f.clone(this._previousAttributes);
},_performValidation:function(a,b){var c=this.validate(a);
if(c){return b.error?b.error(this,c,b):this.trigger("error",this,c,b),!1;
}return !0;
}});
e.Collection=function(a,b){b||(b={});
if(b.comparator){this.comparator=b.comparator;
}f.bindAll(this,"_onModelEvent","_removeReference");
this._reset();
a&&this.reset(a,{silent:!0});
this.initialize.apply(this,arguments);
};
f.extend(e.Collection.prototype,e.Events,{model:e.Model,initialize:function(){},toJSON:function(){return this.map(function(a){return a.toJSON();
});
},add:function(a,b){if(f.isArray(a)){for(var c=0,d=a.length;
c<d;
c++){this._add(a[c],b);
}}else{this._add(a,b);
}return this;
},remove:function(a,b){if(f.isArray(a)){for(var c=0,d=a.length;
c<d;
c++){this._remove(a[c],b);
}}else{this._remove(a,b);
}return this;
},get:function(a){if(a==null){return null;
}return this._byId[a.id!=null?a.id:a];
},getByCid:function(a){return a&&this._byCid[a.cid||a];
},at:function(a){return this.models[a];
},sort:function(a){a||(a={});
if(!this.comparator){throw Error("Cannot sort a set without a comparator");
}this.models=this.sortBy(this.comparator);
a.silent||this.trigger("reset",this,a);
return this;
},pluck:function(a){return f.map(this.models,function(b){return b.get(a);
});
},reset:function(a,b){a||(a=[]);
b||(b={});
this.each(this._removeReference);
this._reset();
this.add(a,{silent:!0});
b.silent||this.trigger("reset",this,b);
return this;
},fetch:function(a){a||(a={});
var b=this,c=a.success;
a.success=function(d,f,e){b[a.add?"add":"reset"](b.parse(d,e),a);
c&&c(b,d);
};
a.error=i(a.error,b,a);
return(this.sync||e.sync).call(this,"read",this,a);
},create:function(a,b){var c=this;
b||(b={});
a=this._prepareModel(a,b);
if(!a){return !1;
}var d=b.success;
b.success=function(a,e,f){c.add(a,b);
d&&d(a,e,f);
};
a.save(null,b);
return a;
},parse:function(a){return a;
},chain:function(){return f(this.models).chain();
},_reset:function(){this.length=0;
this.models=[];
this._byId={};
this._byCid={};
},_prepareModel:function(a,b){if(a instanceof e.Model){if(!a.collection){a.collection=this;
}}else{var c=a;
a=new this.model(c,{collection:this});
a.validate&&!a._performValidation(c,b)&&(a=!1);
}return a;
},_add:function(a,b){b||(b={});
a=this._prepareModel(a,b);
if(!a){return !1;
}var c=this.getByCid(a);
if(c){throw Error(["Can't add the same model to a set twice",c.id]);
}this._byId[a.id]=a;
this._byCid[a.cid]=a;
this.models.splice(b.at!=null?b.at:this.comparator?this.sortedIndex(a,this.comparator):this.length,0,a);
a.bind("all",this._onModelEvent);
this.length++;
b.silent||a.trigger("add",a,this,b);
return a;
},_remove:function(a,b){b||(b={});
a=this.getByCid(a)||this.get(a);
if(!a){return null;
}delete this._byId[a.id];
delete this._byCid[a.cid];
this.models.splice(this.indexOf(a),1);
this.length--;
b.silent||a.trigger("remove",a,this,b);
this._removeReference(a);
return a;
},_removeReference:function(a){this==a.collection&&delete a.collection;
a.unbind("all",this._onModelEvent);
},_onModelEvent:function(a,b,c,d){(a=="add"||a=="remove")&&c!=this||(a=="destroy"&&this._remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,arguments));
}});
f.each(["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","sortBy","sortedIndex","toArray","size","first","rest","last","without","indexOf","lastIndexOf","isEmpty","groupBy"],function(a){e.Collection.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)));
};
});
e.Router=function(a){a||(a={});
if(a.routes){this.routes=a.routes;
}this._bindRoutes();
this.initialize.apply(this,arguments);
};
var q=/:([\w\d]+)/g,r=/\*([\w\d]+)/g,s=/[-[\]{}()+?.,\\^$|#\s]/g;
f.extend(e.Router.prototype,e.Events,{initialize:function(){},route:function(a,b,c){e.history||(e.history=new e.History);
f.isRegExp(a)||(a=this._routeToRegExp(a));
e.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);
c.apply(this,d);
this.trigger.apply(this,["route:"+b].concat(d));
},this));
},navigate:function(a,b){e.history.navigate(a,b);
},_bindRoutes:function(){if(this.routes){var a=[],b;
for(b in this.routes){a.unshift([b,this.routes[b]]);
}b=0;
for(var c=a.length;
b<c;
b++){this.route(a[b][0],a[b][1],this[a[b][1]]);
}}},_routeToRegExp:function(a){a=a.replace(s,"\\$&").replace(q,"([^/]*)").replace(r,"(.*?)");
return RegExp("^"+a+"$");
},_extractParameters:function(a,b){return a.exec(b).slice(1);
}});
e.History=function(){this.handlers=[];
f.bindAll(this,"checkUrl");
};
var j=/^#*/,t=/msie [\w.]+/,m=!1;
f.extend(e.History.prototype,{interval:50,getFragment:function(a,b){if(a==null){if(this._hasPushState||b){a=window.location.pathname;
var c=window.location.search;
c&&(a+=c);
a.indexOf(this.options.root)==0&&(a=a.substr(this.options.root.length));
}else{a=window.location.hash;
}}return decodeURIComponent(a.replace(j,""));
},start:function(a){if(m){throw Error("Backbone.history has already been started");
}this.options=f.extend({},{root:"/"},this.options,a);
this._wantsPushState=!!this.options.pushState;
this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);
a=this.getFragment();
var b=document.documentMode;
if(b=t.exec(navigator.userAgent.toLowerCase())&&(!b||b<=7)){this.iframe=g('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a);
}this._hasPushState?g(window).bind("popstate",this.checkUrl):"onhashchange" in window&&!b?g(window).bind("hashchange",this.checkUrl):setInterval(this.checkUrl,this.interval);
this.fragment=a;
m=!0;
a=window.location;
b=a.pathname==this.options.root;
if(this._wantsPushState&&!this._hasPushState&&!b){return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;
}else{if(this._wantsPushState&&this._hasPushState&&b&&a.hash){this.fragment=a.hash.replace(j,""),window.history.replaceState({},document.title,a.protocol+"//"+a.host+this.options.root+this.fragment);
}}if(!this.options.silent){return this.loadUrl();
}},route:function(a,b){this.handlers.unshift({route:a,callback:b});
},checkUrl:function(){var a=this.getFragment();
a==this.fragment&&this.iframe&&(a=this.getFragment(this.iframe.location.hash));
if(a==this.fragment||a==decodeURIComponent(this.fragment)){return !1;
}this.iframe&&this.navigate(a);
this.loadUrl()||this.loadUrl(window.location.hash);
},loadUrl:function(a){var b=this.fragment=this.getFragment(a);
return f.any(this.handlers,function(a){if(a.route.test(b)){return a.callback(b),!0;
}});
},navigate:function(a,b){var c=(a||"").replace(j,"");
if(!(this.fragment==c||this.fragment==decodeURIComponent(c))){if(this._hasPushState){var d=window.location;
c.indexOf(this.options.root)!=0&&(c=this.options.root+c);
this.fragment=c;
window.history.pushState({},document.title,d.protocol+"//"+d.host+c);
}else{if(window.location.hash=this.fragment=c,this.iframe&&c!=this.getFragment(this.iframe.location.hash)){this.iframe.document.open().close(),this.iframe.location.hash=c;
}}b&&this.loadUrl(a);
}}});
e.View=function(a){this.cid=f.uniqueId("view");
this._configure(a||{});
this._ensureElement();
this.delegateEvents();
this.initialize.apply(this,arguments);
};
var u=/^(\S+)\s*(.*)$/,n=["model","collection","el","id","attributes","className","tagName"];
f.extend(e.View.prototype,e.Events,{tagName:"div",$:function(a){return g(a,this.el);
},initialize:function(){},render:function(){return this;
},remove:function(){g(this.el).remove();
return this;
},make:function(a,b,c){a=document.createElement(a);
b&&g(a).attr(b);
c&&g(a).html(c);
return a;
},delegateEvents:function(a){if(a||(a=this.events)){for(var b in f.isFunction(a)&&(a=a.call(this)),g(this.el).unbind(".delegateEvents"+this.cid),a){var c=this[a[b]];
if(!c){throw Error('Event "'+a[b]+'" does not exist');
}var d=b.match(u),e=d[1];
d=d[2];
c=f.bind(c,this);
e+=".delegateEvents"+this.cid;
d===""?g(this.el).bind(e,c):g(this.el).delegate(d,e,c);
}}},_configure:function(a){this.options&&(a=f.extend({},this.options,a));
for(var b=0,c=n.length;
b<c;
b++){var d=n[b];
a[d]&&(this[d]=a[d]);
}this.options=a;
},_ensureElement:function(){if(this.el){if(f.isString(this.el)){this.el=g(this.el).get(0);
}}else{var a=this.attributes||{};
if(this.id){a.id=this.id;
}if(this.className){a["class"]=this.className;
}this.el=this.make(this.tagName,a);
}}});
e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=function(a,b){var c=v(this,a,b);
c.extend=this.extend;
return c;
};
var w={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};
e.sync=function(a,b,c){var d=w[a];
c=f.extend({type:d,dataType:"json"},c);
if(!c.url){c.url=k(b)||l();
}if(!c.data&&b&&(a=="create"||a=="update")){c.contentType="application/json",c.data=JSON.stringify(b.toJSON());
}if(e.emulateJSON){c.contentType="application/x-www-form-urlencoded",c.data=c.data?{model:c.data}:{};
}if(e.emulateHTTP&&(d==="PUT"||d==="DELETE")){if(e.emulateJSON){c.data._method=d;
}c.type="POST";
c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d);
};
}if(c.type!=="GET"&&!e.emulateJSON){c.processData=!1;
}return g.ajax(c);
};
var o=function(){},v=function(a,b,c){var d;
d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments);
};
f.extend(d,a);
o.prototype=a.prototype;
d.prototype=new o;
b&&f.extend(d.prototype,b);
c&&f.extend(d,c);
d.prototype.constructor=d;
d.__super__=a.prototype;
return d;
},k=function(a){if(!a||!a.url){return null;
}return f.isFunction(a.url)?a.url():a.url;
},l=function(){throw Error('A "url" property or function must be specified');
},i=function(a,b,c){return function(d){a?a(b,d,c):b.trigger("error",b,d,c);
};
};
}).call(this);
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
Array.prototype.contains=function(element){for(var i=0;
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
var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:XMLCCLREQUEST_Send("'+uniqueId+'")';
el.click();
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
}var ExternalDebugger=(function(){var debuggerObj=false,prevDebuggerObj,debuggerDefined=false,bufferOutput=" ";
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
this.parse_json=(function(){var at,ch,parseError="",escapee={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},text,error=function(m){parseError=m;
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
this.append_json=function(jObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** JSON Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_json_string=format_json(jObj,""),debug_string=debug_msg_hdr+debug_json_string;
if(this.debug_mode_ind===1){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}return jObj;
}catch(e){error_handler(e.message,"append_json()");
}};
this.formatted_json=function(jObj){return format_json(jObj,"");
};
this.append_xml=function(xObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** XML Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_xml_string=format_xml(xObj),debug_string=debug_msg_hdr+debug_xml_string;
if(this.debug_mode_ind===1){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}return xObj;
}catch(e){error_handler(e.message,"append_xml()");
}};
this.append_text=function(data){try{if(this.debug_mode_ind===1){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(data);
}else{ExternalDebugger.sendBufferOutput(data);
}}else{this.text_debug+=data;
this.launch_debug();
}}}catch(e){error_handler(e.message,"append_text()");
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
this.stringify_json=function(jObj){try{var sIndent="",iCount=0,sIndentStyle="",sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=(""+sIndent+sIndentStyle);
}else{sHTML+=(""+sIndent+sIndentStyle+'"'+j+'":');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=this.stringify_json(jObj[j]);
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
}catch(e){error_handler(e.message,"stringify_json()");
}};
this.ajax_request=function(spec){try{var requestAsync,load_json_obj_fnc=this.load_json_obj,load_xml_obj_fnc=this.load_xml_obj,append_text_fnc=this.load_txt,json_response_obj,that=this,start_timer=new Date(),elapsed_time,ready_state_msg,status_msg,response_spec,parse_target,parse_target_type,debug_string,send_response_ind,parse_target_text,display_response_text;
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM&&spec.loadingDialog.content){spec.loadingDialog.targetDOM.innerHTML=spec.loadingDialog.content;
}}if(spec.request.target.toUpperCase().indexOf(".JSON")==-1&&spec.request.target.toUpperCase().indexOf(".XML")==-1&&spec.request.target.toUpperCase().indexOf(".TXT")==-1){if(spec.request.type==="XMLHTTPREQUEST"){if(window.XMLHttpRequest){requestAsync=new XMLHttpRequest();
}else{if(window.ActiveXObject){requestAsync=new ActiveXObject("MSXML2.XMLHTTP.3.0");
}}}else{requestAsync=getXMLCclRequest();
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
if(spec.request.type==="XMLHTTPREQUEST"){requestAsync.open("GET",spec.request.target);
if(!spec.request.parameters||spec.request.parameters===null||spec.request.parameters===""){requestAsync.setRequestHeader("Access-Control-Allow-Origin","*");
requestAsync.send(null);
}else{requestAsync.setRequestHeader("Content-type","application/x-www-form-urlencoded");
requestAsync.setRequestHeader("Content-length",spec.request.parameters.length);
requestAsync.setRequestHeader("Connection","close");
requestAsync.send(spec.request.parameters);
}}else{if(location.protocol.substr(0,4)==="http"){var url=location.protocol+"//"+location.host+"/discern/mpages/reports/"+spec.request.target+"?parameters="+spec.request.parameters;
requestAsync.open("GET",url);
requestAsync.send(null);
}else{requestAsync.open("GET",spec.request.target);
requestAsync.send(spec.request.parameters);
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
var MpageAdvisorEvent={saved_fragment_count:0,total_save_fragment_count:0,person_id:0,encntr_id:0,clear:function(){this.saved_fragment_count=0;
this.total_save_fragment_count=0;
},createdataFragments:function(data){var dataFragments=data.fragmentsBySize(31000);
return(dataFragments);
},addAdvisorGroup:function(person_id,encntr_id,prev_advsr_group_id,type_meaning,status_meaning,description,data,callBack){var cclParam="",self=this,dataFragments=self.createdataFragments(data);
cclParam="'MINE',"+prev_advsr_group_id+",'"+type_meaning+"',1";
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"EKS_ADD_ADVSR_GROUP",parameters:cclParam},response:{type:"JSON",target:function(jsonResponse){var advsr_group_id=jsonResponse.response.GROUP_REPLY.GROUP_ID;
self.addAdvisorGroupEvents(person_id,encntr_id,advsr_group_id,type_meaning,status_meaning,description,dataFragments,callBack);
}}});
},addAdvisorGroupEvents:function(person_id,encntr_id,advsr_group_id,type_meaning,status_meaning,description,dataFragments,callBack){var cclParam="",cur_data_string="",cur_description="",self=this;
this.saved_fragment_count=0;
this.total_save_fragment_count=dataFragments.length;
for(var i=0,len=dataFragments.length;
i<len;
i++){cur_description=description+"_"+(i+1);
cur_data_string=dataFragments[i];
cur_data_string=cur_data_string.split("~").join("&#126;");
cclParam="'MINE',"+person_id+","+encntr_id+","+advsr_group_id+",'"+type_meaning+"','"+status_meaning+"','"+cur_description+"',~"+cur_data_string+"~";
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"EKS_ADD_ADVSR_GROUP_EVENT",parameters:cclParam},response:{type:"JSON",target:function(jsonResponse){try{self.verifyAdvisorSaveComplete(callBack);
}catch(error){alert(error.message+" -> MpageAdvisorEvent.addAdvisorGroupEvents()");
}}}});
}},verifyAdvisorSaveComplete:function(callBack){this.saved_fragment_count+=1;
if(this.total_save_fragment_count==this.saved_fragment_count){callBack();
}}};
/**
 * Criterion contains Application-level variables passed in from PrefMaint.exe.
 */
var Criterion = {
	MPAGE_API: window.external,
	person_id : 0,
	encntr_id: 0,
	personnel_id : 0,
	debug_mode_ind : 0,	
	unloadParams : function() {
		try {
			var cur_params = window.location.search.replace(/%20/g, " ").split("?").join("").split(",");
			if (cur_params[1]) {				
				this.person_id = cur_params[1];
			}
			if (cur_params[2]) {
				this.encntr_id = cur_params[2];
			}
			if (cur_params[3]) { 
				this.personnel_id = cur_params[3];
			}
			if (cur_params[4]) {
				this.debug_mode_ind = parseInt(cur_params[4]);
			}
			AjaxHandler.debug_mode_ind = this.debug_mode_ind;
		} catch (e) {
			errmsg(e.message, "unloadParams()");
		}
	}	 
};
/**
 * LocationModel handles INN_MP_TRANSF_REC_PREFS script and all data returned from it
 * @author JJ7138
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2
 */
var LocationsModel = Backbone.Model.extend({
	defaults : {
		"DEST_MEANING":"",
		"DEST_DISPLAY":""
	},
	initialize : function() {
		_.bindAll(this);		
	},
	/**
	 * Retrieve Locations from CCL via INN_MP_GET_LOCS script
	 */
	retrieve : function(){
		var cclParam = "'MINE'";
		AjaxHandler.ajax_request({
			request: {
				type: "XMLCCLREQUEST",
				target: 'INN_MP_GET_TRANSF_AREAS',
				parameters: cclParam
			},
			response: {
				type: "JSON",
				target: this.receiveCCLResponse
			}
		});
	},
	/**
	 * Receives data returned from INN_MP_GET_LOCS script
	 * @param {Object} json_response json_response.response.OLIST is json returned
	 */
	receiveCCLResponse : function (json_response){
		this.set( json_response.response.ALIST,{
			silent : true
		});
		this.trigger("change");
	}
});/**
 * OrderableModel handles INN_MP_GET_TRANSF_REC script and all data returned from it
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2
 */
var OrderableModel = Backbone.Model.extend({
	defaults : {		
			"LOCSEQ" : 0,
			"LOCNAME" : "",
			"ORDERID" : 00,
			"CATALOGCD" : 00,
			"MEDNAME" : "",
			"ORDAS" : "",
			"MEDCKI" : "",
			"ORDSTATUSFLAG" : 0,
			"MEDDET" : "",
			"MEDRSN" : "",
			"MEDORDFLAG" : 0,
			"MEDORDPHY" : "",
			"MEDORDDTTM" : "",
			"MEDORDDTTMDISP" : "",
			"MEDCOMMENT" : "",
			"MEDFLAG" : 0,
			"TASKCLASSFLAG" : 0,
			"KEEP_FLAG" : "",
			"O_STATUS_DISP": "",
        	"O_LAST_ACT_SEQ": 0,
        	"ACTION_BITMAP" : 0,
        	"MOD_COMMENT" : ""
	},
	initialize : function() {
		_.bindAll(this);
	},
	applyAction : function(action,select){
		this.trigger("select-action",action,select)
	},
	setDisplay: function(displayValue){
		this.display = displayValue;
		this.trigger(displayValue);
	},
	disableSuspend: function(attrVal){
		alert("OrderableModel [disable suspend]");
	},
	enableSuspend: function(select){
		alert("OrderableModel [enable suspend]");
	},
	applySuspendView: function(action,flag){
		this.trigger("location-change",action,flag);
	},
	applyBtnView: function(action,flag){
		this.trigger("location-change",action,flag);
	},
	setAction : function(keep_flag,actionSelected){
		this.set({"KEEP_FLAG":keep_flag},{silent: true});
		this.trigger("action-changed",actionSelected);
	},
	/**
	 * Retrieve data
	 */
	retrieve : function() {
	},
	/**
	 * Receives data None
	 */
	recieveCCLResponse : function() {
	}
});
/**
 * PatientDemographicModel handles INN_MP_TRANSF_REC_PTINFO script and all data returned from it
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2
 */
var PatientDemographicModel = Backbone.Model.extend({
	defaults : {},
	initialize : function() {
		_.bindAll(this);		
	},
	/**
	 * Retrieve PatientDemographic from CCL via INN_MP_TRANSF_REC_PREFS script
	 */
	retrieve : function(){
		var cclParam = "'MINE'" + "," + Criterion.person_id + "," + Criterion.encntr_id;
		AjaxHandler.ajax_request({
			request: {
				type: "XMLCCLREQUEST",
				target: 'INN_MP_TRANSF_REC_PTINFO',
				parameters: cclParam
			},
			response: {
				type: "JSON",
				target: this.recieveCCLResponse
			}
		});
	},
	/**
	 * Receives data returned from INN_MP_TRANSF_REC_PREFS script
	 * @param {Object} json_response json_response.response.PREFREC is json returned
	 */
	recieveCCLResponse : function (json_response){
		this.set( json_response.response.PTINFO
		,{
			silent : true
		});
		
		this.trigger("change");
	}
});/**
 * PreferenceModel handles INN_MP_TRANSF_REC_PREFS script and all data returned from it
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2
 */
var PreferenceModel = Backbone.Model.extend({
	defaults : {},
	initialize : function() {
		_.bindAll(this);		
	},
	/**
	 * Retrieve Preferences from CCL via INN_MP_TRANSF_REC_PREFS script
	 */
	retrieve : function(){
		var cclParam = "'MINE'";
		AjaxHandler.ajax_request({
			request: {
				type: "XMLCCLREQUEST",
				target: 'INN_MP_TRANSF_REC_PREFS',
				parameters: cclParam
			},
			response: {
				type: "JSON",
				target: this.recieveCCLResponse
			}
		});
	},
	/**
	 * Receives data returned from INN_MP_TRANSF_REC_PREFS script
	 * @param {Object} json_response json_response.response.PREFREC is json returned
	 */
	recieveCCLResponse : function (json_response){
		this.set( json_response.response.PREFREC,{
			silent : true
		});
		
		this.trigger("change");
	}
});/**
 * OrderableCollection handles INN_MP_GET_TRANSF_REC script and all data returned from it
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2,OrderableModel
 */
var OrderableCollection = Backbone.Collection.extend({
	/**
	 * Collection model
	 */
	model : OrderableModel,

	orderableActions : 0,

	allOrderables : [],
	
	homeMedOrderables: [],

	scheduledOrderables : [],

	unscheduledOrderables : [],

	prnOrderables : [],

	inactiveOrderables : [],

	reconOrderables : [],

	advsr_event_type_meaning : "TRANSF_ORD",

	advsr_in_progress_status_meaning : "INPROGRESS",

	advsr_complete_status_meaning : "COMPLETE",

	advsr_event_id : 0,

	advsr_group_id : 0,

	origin_encntr_id : 0,

	cur_encntr_id : 0,

	origin_facility_cd : 0,

	cur_facility_cd : 0,

	origin_location_cd : 0,

	cur_location_cd : 0,

	svd_location_cd : 0,

	patientDemographicModel : null,

	locationModel : null,

	preferenceModel : null,

	same_encntr_flag : 0,
	
	save_sign_view_ind: 0,

	loc_selected_idx : 0,

	loc_selected_idx : 0,

	suspend_flag : 0,

	inactive_flag : 0,

	ordersData : [],

	synonymsData : [],

	virtualViewPrefs : null,

	AjaxIconHTML : '<span valign="top"><img src="../img/ajax-loader.gif"  alt="Ajax Loader" width="16" height="16" /></span>',

	/**
	 * Orderable Types
	 */
	orderableTypes : [],

	initialize : function() {
		_.bindAll(this);
		this.allOrderables = [];
		this.homeMedOrderables = [];
		this.scheduledOrderables = [];
		this.unscheduledOrderables = [];
		this.inactiveOrderables = [];
		this.reconOrderables = [];
		this.allOrderables = [];
	},
	/**
	 * Retrieve
	 */
	retrieve : function() {
		var cclParam = "^MINE^";
		var self = this;
		AjaxHandler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : 'INN_MP_GET_VV_PREFS',
				parameters : cclParam
			},
			loadingDialog : {
				targetDOM : $(".loading-dialog").get(0),
				content : '<span valign="top"><b>' + "Loading Orders..." + '</b></span>' + this.AjaxIconHTML
			},
			response : {
				type : "JSON",
				target : function(prefsData) {
					self.loadOrders(prefsData)
				}
			}
		});
	},
	loadOrders : function(prefsData) {
		this.virtualViewPrefs = prefsData.response.RECORD_DATA;
		var cclParam = "'MINE'" + "," + Criterion.person_id + "," + Criterion.encntr_id;
		var self = this;
		AjaxHandler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : 'INN_MP_GET_TRANSF_REC',
				parameters : cclParam
			},
			loadingDialog : {
				targetDOM : $(".loading-dialog").get(0),
				content : '<span valign="top"><b>' + "Loading Orders..." + '</b></span>' + this.AjaxIconHTML
			},
			response : {
				type : "JSON",
				target : self.loadOrdersInfo
			}
		});
	},
	loadOrdersInfo : function(transfRecData) {
		var ordersRequest = {
			"orders_request" : {
				"cs_parent_mnemonic_ind" : 0,
				"qual" : []
			}
		};
		var cclParams = "";
		var orderableData = transfRecData.response.AORDERS;
		var orderableList = orderableData.ORDS;
		var self = this;

		self.locationModel.set({
			"DEST_MEANING" : orderableData.DEST_MEANING,
			"DEST_DISPLAY" : orderableData.DEST_DISPLAY
		}, {
			silent : true
		});
		self.locationModel.trigger("select-location");

		_.each(orderableList, function(orderable) {
			var orderInfo = {
				"order_id" : JSON.setCCLFloatNumber(parseFloat(orderable.ORDERID))
			}
			ordersRequest.orders_request.qual.push(orderInfo);
		});
		cclParams = "^MINE^,^" + JSON.stringify(ordersRequest) + "^";
		AjaxHandler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : 'INN_ORM_GET_ORDERS_FROM_ID',
				parameters : cclParams
			},
			loadingDialog : {
				targetDOM : $(".loading-dialog").get(0),
				content : '<span valign="top"><b>' + "Loading Orders..." + '</b></span>' + this.AjaxIconHTML
			},
			response : {
				type : "JSON",
				target : function(ordersData) {
					self.ordersData = ordersData.response.RECORD_DATA.QUAL;
					self.recieveCCLResponse(transfRecData);
				}
			}
		});
	},
	setSameEncntrFlag : function(flag) {
		this.same_encntr_flag = parseInt(flag, 10);
	},
	setSaveSignViewInd : function(ind){
		this.save_sign_view_ind = parseInt(ind,10);
	},
	getSameEncntrFlag : function() {
		return(this.same_encntr_flag);
	},
	getSaveSignViewInd : function(){
		return(this.save_sign_view_ind);
	},
	setLocationIdx : function(idx) {
		this.loc_selected_idx = idx;
	},
	toggleHomeMedOrders: function(homeMedsComponentView,showOrHide){
		$(".related-hx-display").toggle(showOrHide);
		if(homeMedsComponentView){
			$(homeMedsComponentView.el).toggle(showOrHide);
		}
	},
	updateHomeMedOrdersDisplay: function(same_enc_ind,homeMedsComponentView){
		var showHxOrdersInd = this.showHxOrderables(same_enc_ind);
		
		if(showHxOrdersInd){
			this.toggleHomeMedOrders(homeMedsComponentView,true);
		}
		else{
			this.toggleHomeMedOrders(homeMedsComponentView,false);
		}
	},
	toggleNonMedOrders : function(toggleEvent) {
		var allOrderables = this.allOrderables;
		var nonMedOrders = _.filter(allOrderables, function(orderableModel) {
			return (orderableModel.get("MEDFLAG") != 1)
		});
		;
		_.each(nonMedOrders, function(nonMedOrderableModel) {
			nonMedOrderableModel.setDisplay(toggleEvent);
		});
	},
	showAllOrders : function() {
		this.toggleNonMedOrders("show");
	},
	showMedicationOrders : function() {
		this.toggleNonMedOrders("hide");
	},
	displaySavedOrderables : function() {
		var savedOrderables = this.getActionedOrderables();
		// any actual orderables were saved
		if(savedOrderables.length > 0){
			this.trigger("save");
		}
	},
	displaySignedOrderables : function() {
		this.trigger("sign");
	},
	getActionedOrderables : function() {
		var actionedOrderables = [];
		_.each(this.allOrderables, function(orderableModel) {
			if(orderableModel.get("KEEP_FLAG") > " ") {
				actionedOrderables.push(orderableModel);
			}
		});
		return (actionedOrderables);
	},
	getOrderData : function(order_id) {
		var validOrderData = null;
		var ordersData = this.ordersData;
		_.find(ordersData, function(orderData) {
			if(parseFloat(orderData.ORDER_ID) === parseFloat(order_id)) {
				validOrderData = orderData;
				return true;
			}
		});
		return (validOrderData);
	},
	getSynonymData : function(synonym_id) {
		var validSynonymData = null;
		var synonymsData = this.synonymsData;

		_.find(synonymsData, function(synonymData) {
			if(parseFloat(synonymData.SYNONYM_ID) === parseFloat(synonym_id)) {
				validSynonymData = synonymData;
				return true;
			}
		});
		return (validSynonymData);
	},
	buildMOEWParams : function(actionedOrderables) {
		var sendFlag = 0;
		var MOEWParams = [], keep_flag, order_id, validOrderableCnt = 0, synonym_id, orderData, invalidOrders = [], invalidOrderableCnt = 0;

		//Create MOEW for checking available actions
		var PowerOrdersMPageUtils = Criterion.MPAGE_API.DiscernObjectFactory("POWERORDERS");
		var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(Criterion.person_id, Criterion.encntr_id, 0, 2, 127);
		var m_availableActionsStr;
		var self = this;
		var valid_synonym_ind;
		var validOrder;
		var same_encntr_flag = this.same_encntr_flag;
		var keep_flag;
		var ordered_as_flag;
		var moew_action_ind ;
		// Add Orders
		_.each(actionedOrderables, function(orderable) {
			/*
			 * Available actions:
			 * ------------------
			 * "REPEAT" 	{keep}
			 * "MODIFY"		{modify}
			 * "CANCEL DC"	{stop}
			 * "SUSPEND"	{stop}
			 * "RESUME"		{????}
			 */
			order_id = orderable.get("ORDERID");
			var oActionStr = PowerOrdersMPageUtils.GetAvailableOrderActions(m_hMOEW, parseFloat(order_id));
			orderData = self.getOrderData(order_id);
			if(orderData != null) {
				// check if order is a valid synonym
				valid_synonym_ind = self.isValidSynonym(orderData, orderData.SYNONYM_ID);
				keep_flag = orderable.get("KEEP_FLAG").toUpperCase();
				ordered_as_flag  = parseInt(orderable.get("MEDORDFLAG"),10)
				// Valid actions
				if(keep_flag > "") {					
					moew_action_ind = false;			
					validOrder = true;
					// Home med orders are not pushed to MOEW
					if(ordered_as_flag != 2){
						switch(keep_flag) {
							// KEEP
							case "K":
								// within different encounter
								if(same_encntr_flag === 0) {
									// valid synonym
									if(valid_synonym_ind) {
										moew_action_ind = true;
										if(oActionStr & 32) {
											MOEWParams.push('{REPEAT|', order_id, '}');
										}
										// else do a new order with the synonym
										else {
											MOEWParams.push('{ORDER|' + orderData.SYNONYM_ID + '|0|0|0|0}');
										}
									} else {
										validOrder = false;
									}
								}
								break;
							// MODIFY
							case "M":
								// within different encounter => do a repeat
								if(same_encntr_flag == 0) {
									// valid synonym
									if(valid_synonym_ind) {
										moew_action_ind = true;
										// Repeat action possible on same order
										if(oActionStr & 32) {
											MOEWParams.push('{REPEAT|', order_id, '}');
										}
										// else do a new order with the synonym
										else {
											MOEWParams.push('{ORDER|' + orderData.SYNONYM_ID + '|0|0|0|0}');
										}
									} else {
										validOrder = false;
									}
								} else {
									moew_action_ind = true;
									if(oActionStr & 2) {
										MOEWParams.push('{MODIFY|', order_id, '}');
									}
								}
								break;
							// SUSPEND
							case "P":
								moew_action_ind = true;
								if(oActionStr & 512) {
									MOEWParams.push('{SUSPEND|', order_id, '}');
								}
								break;
							// STOP -- DISCONTINUE
							case "S":
								// reset keep flag for stop action across different encounters
								if(same_encntr_flag == 0) {
									orderable.set({
										"KEEP_FLAG" : ""
									}, {
										"silent" : true
									});
								} else {
									moew_action_ind = true;
									if(oActionStr & 1) {
										MOEWParams.push('{CANCEL DC|', order_id, '}');
									}
								}
								break;
							// RESTART
							case"R":
								// Restart on same encounter is resume
								if(same_encntr_flag == 1 && oActionStr & 1024) {
									MOEWParams.push('{RESUME|', order_id, '}');
									moew_action_ind = true;
								} else {
									// valid synonym
									if(valid_synonym_ind) {									
										moew_action_ind = true;
										// Repeat Action available
										if(oActionStr & 32) {
											MOEWParams.push('{REPEAT|', order_id, '}');		
										}
										// else do a new order with the synonym
										else {
											MOEWParams.push('{ORDER|' + orderData.SYNONYM_ID + '|0|0|0|0}');
										}
									} else {
										validOrder = false;
									}
								}
								break;
						}
						// set indicator for MOEW Action
						orderable.set({"MOEW_ACTION_IND" : moew_action_ind}, {"silent" : true});
					}
					// valid order
					if(validOrder) {
						validOrderableCnt += 1;
					}
					// add to List of virtual viewed orders to display
					else {
						invalidOrderableCnt += 1;
						invalidOrders[invalidOrders.length] = orderData;
						// clear action on orderable
						orderable.set({
							"KEEP_FLAG" : ""
						}, {
							"silent" : true
						});
					}
				}
			}
		});
		// Found any invalid order synonyms -> display alert message
		if(invalidOrderableCnt > 0) {
			var alertMsg = "The following are invalid order catalog synonym(s) and are not available for ordering:\n";
			_.each(invalidOrders, function(invalidOrder) {
				alertMsg += "\n" + invalidOrder.ORDER_MNEMONIC;
			});
			alert(alertMsg);
		}
		//Destroy MOEW
		PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
		//Add Other options
		if(MOEWParams.length > 0) {
			//Add person and encounter id
			MOEWParams.unshift(Criterion.person_id, '|', Criterion.encntr_id, '|');
			MOEWParams.push('|24|{2|127}|32|1');
		}
		//No Orders to launch => no params
		if(validOrderableCnt == 0) {
			MOEWParams = []
		}
		return (MOEWParams.join(""))
	},
	isValidSynonym : function(orderData, synonym_id) {
		var synonymData = this.getSynonymData(synonym_id);
		var isValid = false;
		var ordered_as_flag = parseInt(orderData.ORIG_ORD_AS_FLAG, 10);
		var virtual_qual = false;
		var virtualViewPrefs = this.virtualViewPrefs;
		if(ordered_as_flag === 1 || ordered_as_flag == 2) {
			if(virtualViewPrefs.FILTER_RX_FLAG === 1) {
				virtual_qual = true;
			}
		} else if(virtualViewPrefs.FILTER_O_FLAG == 1) {
			virtual_qual = true;
		}
		// if virtual view prefs defined and synonym is valid
		if(synonymData != null) {
			if(synonymData.ACTIVE_IND === 1 && synonymData.HIDE_FLAG === 0) {
				if(!(virtual_qual) || (virtual_qual && synonymData.VIRTUAL_VIEW_IND === 1)) {
					isValid = true;
				}
			}
		}

		return (isValid)
	},
	launchMOEW : function(actionedOrderables) {
		var MOEWParams = this.buildMOEWParams(actionedOrderables), ordersXMLString = "";
		// Launch window with orders, this statement is synchronous( i.e. will return only after the window is closed/signed)
		if(MOEWParams.length > 0) {
			ordersXMLString = Criterion.MPAGE_API.MPAGES_EVENT("ORDERS", MOEWParams);
		}
		return (ordersXMLString)
	},
	buildSaveJSON : function() {
		var saveData = {}, savedOrderables = [], saveDataJSON = "", selectLocations = $("selLocList");
		var dest_meaning = this.locationModel.get("DEST_MEANING");
		var dest_display = this.locationModel.get("DEST_DISPLAY");
		// default value
		if(_.isUndefined(dest_meaning)) {
			dest_meaning = "";
		}
		if(_.isUndefined(dest_display)) {
			dest_display = "";
		}
		// build out the save Data object only if destination is defined
		if(dest_meaning > " "){
			saveData.AORDERS = {};
			saveData.AORDERS.EID = JSON.setCCLFloatNumber(parseFloat(this.cur_encntr_id));
			saveData.AORDERS.ORIGIN_EID = JSON.setCCLFloatNumber(parseFloat(this.origin_encntr_id));
			saveData.AORDERS.FAC_CD = JSON.setCCLFloatNumber(parseFloat(this.cur_facility_cd));
			saveData.AORDERS.ORIGIN_FAC_CD = JSON.setCCLFloatNumber(parseFloat(this.origin_facility_cd));
			saveData.AORDERS.LOC_CD = JSON.setCCLFloatNumber(parseFloat(this.cur_location_cd));
			saveData.AORDERS.ORIGIN_LOC_CD = JSON.setCCLFloatNumber(parseFloat(this.origin_location_cd));
			saveData.AORDERS.DEST_MEANING = dest_meaning;
			saveData.AORDERS.DEST_DISPLAY = dest_display;
			saveData.AORDERS.OCNT = 0;
			saveData.AORDERS.ORDS = [];
			savedOrderables = this.getActionedOrderables();
			saveData.AORDERS.OCNT = savedOrderables.length;
			_.each(savedOrderables, function(orderableModel) {
					saveData.AORDERS.ORDS.push(orderableModel.toJSON());
			});
			saveDataJSON = JSON.stringify(saveData);
			
			// no order actions were saved
			if(savedOrderables.length === 0){
				alert("Patient destination has been saved; no order actions are selected for save.");
			}
		}
		
		return (saveDataJSON)
	},
	buildSaveDescription : function() {
		var saveDescription = "TRANSFER_RECONCILIATION";
		return (saveDescription);
	},
	getXMLNodeValue : function(xmlnode) {
		if(xmlnode && xmlnode !== null) {
			if(xmlnode.firstChild && xmlnode.firstChild !== null) {
				return (xmlnode.firstChild.nodeValue);
			} else {
				return ("");
			}
		} else {
			return ("");
		}
	},
	getMOEWOrders : function(MOEWOrdersXML) {
		var ordersXMLObj = AjaxHandler.parse_xml(MOEWOrdersXML), self = this
		var MOEWOrders = [];
		var signedOrderables = [];

		if(MOEWOrdersXML.length > 0) {
			ordersXMLObj = ordersXMLObj.getElementsByTagName("Orders")[0].getElementsByTagName("Order");
			// Build array of signed orders
			for(var cntr = 0, len = ordersXMLObj.length; cntr < len; cntr++) {
				MOEWOrders.push(ordersXMLObj[cntr]);
			};
		}
		return (MOEWOrders)
	},
	filterSignedMOEWOrderables : function(actionedOrderables, MOEWOrders) {
		var self = this;
		// Loop through each orderableModel for sign and reset orderable models not signed through MOEW
		_.each(actionedOrderables, function(orderableModel) {
			// order was action through MOEW
			if(orderableModel.get("MOEW_ACTION_IND")){
				var orderId = parseFloat(orderableModel.get("ORDERID"));
				var orderData = self.getOrderData(orderId);
				var synonymId = orderData.SYNONYM_ID;
				var orderSigned = false;
				
				// Any MOEW Orders => check it was signed
				if(MOEWOrders != null) {
					orderSigned = _.any(MOEWOrders, function(signedOrder) {
						var newOrderId = null;
						var relatedFromOrderId = null;
						var relatedSynonymId = null;
						if(signedOrder) {
							newOrderId = parseFloat(self.getXMLNodeValue(signedOrder.getElementsByTagName("OrderId")[0]));
							relatedFromOrderId = parseFloat(self.getXMLNodeValue(signedOrder.getElementsByTagName("RelatedFromOrderId")[0]));
							relatedSynonymId = parseFloat(self.getXMLNodeValue(signedOrder.getElementsByTagName("SynonymId")[0]));
						}
						// is the original order or related to the original order or the same synonym as original order
						return (orderId === newOrderId || orderId === relatedFromOrderId || synonymId === relatedSynonymId)					
					});
				}
				// Order was not signed through => reset order action
				if(!orderSigned) {
					orderableModel.set({"KEEP_FLAG" : ""}, {"silent" : true});			
				}
			}
			// remove moew ind
			orderableModel.unset("MOEW_ACTION_IND",{"silent" : true	});
		});
		return (actionedOrderables);
	},
	initiateSave : function() {
		var savedOrderables = this.getActionedOrderables();
		var same_encntr_flag = this.locationModel.get("SAME_ENC_LOCATION");
		// Any orders to save
		// and saving for a different encounter => go through recon and then save
		if(savedOrderables.length > 0 && same_encntr_flag === 0) {
				this.reconcileSavedCrossEncounterOrderables(savedOrderables, this.performSave);
		}
		// do a regular save
		else{
			this.performSave();
		}
	},
	performSave : function() {
		var saveDescription, saveJSON;
		saveDescription = this.buildSaveDescription();
		saveJSON = this.buildSaveJSON();
		//Save a In progress group instance to advsr_event_table
		MpageAdvisorEvent.addAdvisorGroup(Criterion.person_id, Criterion.encntr_id, this.advsr_group_id, this.advsr_event_type_meaning, this.advsr_in_progress_status_meaning, saveDescription, saveJSON, this.displaySavedOrderables);
	},
	initiateSign : function() {

		var synonymsRequest = {
			"synonyms_request" : {
				"facility_cd" : 0.00,
				"qual" : []
			}
		};
		var cclParams = "";
		var orderableList = this.ordersData;
		var self = this;
		synonymsRequest.synonyms_request.facility_cd = JSON.setCCLFloatNumber(parseFloat(this.cur_facility_cd))
		_.each(orderableList, function(orderable) {
			var synonym_info = {
				"synonym_id" : JSON.setCCLFloatNumber(parseFloat(orderable.SYNONYM_ID))
			}
			synonymsRequest.synonyms_request.qual.push(synonym_info);
		});
		cclParams = "^MINE^,^" + JSON.stringify(synonymsRequest) + "^";
		AjaxHandler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : 'INN_ORM_IS_SYNONYM_VALID',
				parameters : cclParams
			},
			response : {
				type : "JSON",
				target : function(synonymsData) {
					self.synonymsData = synonymsData.response.RECORD_DATA.QUAL;
					self.performSign();
				}
			}
		});
	},
	saveSignedOrderables : function() {
		// Get Orderables which were signed
		var saveJSON = this.buildSaveJSON();
		var saveDescription = this.buildSaveDescription();
		if(saveJSON > " ") {
			//Save a completed group instance to advsr_event_table
			MpageAdvisorEvent.addAdvisorGroup(Criterion.person_id, Criterion.encntr_id, this.advsr_group_id, this.advsr_event_type_meaning, this.advsr_complete_status_meaning, saveDescription, saveJSON, this.displaySignedOrderables);
		}
	},
	performSign : function() {
		var actionedOrderables;
		var signedOrderables = [], MOEWXmlString = "", MOEWOrders = null;
		var same_encntr_flag = this.same_encntr_flag;
		signJSON = this.buildSaveJSON();
		actionedOrderables = this.getActionedOrderables();
		
		// Any orders to sign
		if(signJSON > " ") {
			// Launch MOEW and pass orders
			MOEWXmlString = this.launchMOEW(actionedOrderables);
			
			// MOEW launched => get MOEW data
			if(MOEWXmlString > " ") {
				if(MOEWXmlString > " "){
					MOEWOrders = this.getMOEWOrders(MOEWXmlString);
				}
			}
			
			// Filter any orderables signed through MOEW
			actionedOrderables = this.filterSignedMOEWOrderables(actionedOrderables, MOEWOrders);
			
			// If within same encounter => reconcile orderable actions
			if(same_encntr_flag === 1) {
				this.reconcileSameEncounterTransferOrderables(actionedOrderables, MOEWOrders, this.saveSignedOrderables);
			}
			// for different encounter => admit reconcile and save signed orderables
			else {
				this.reconcileAdmitOrderables(actionedOrderables,MOEWOrders,this.saveSignedOrderables);
			}
			
		}
	},
	getReconActionMean : function(orderData,recon_type_flag, orderableJSON) {
		/*
		 * indicates the reconciliation action mean
		 */
		var actionMean = "";
		var keep_flag = orderableJSON.KEEP_FLAG;
		var ord_as_flag = parseInt(orderableJSON.MEDORDFLAG,10)
		keep_flag = keep_flag.toUpperCase();
		switch(keep_flag) {
			// Keep
			case "K":
				// admit reconciliation
				if(recon_type_flag === 1 ){
					// a reconciled hx is a treated as continue
					if( ord_as_flag === 2){
						actionMean = "RECON_CONTINUE";
					}
					else{
						actionMean = "ORDER";
					}
				}
				else{					
					actionMean = "RECON_CONTINUE";
				}
				break;
			//Restart, Resume
			case "R":
				// Restart
				if(orderData.DISCONTINUE_IND === 1) {
					actionMean = "CANCEL REORD";
				}
				//Resume
				else {
					actionMean = "RESUME";
				}
				break;
			// Stop
			case "S":
				// on admit or transfer reoncile and a stop on home med is a do not convert
				if((recon_type_flag === 1 || recon_type_flag === 2) && ord_as_flag === 2){	
					actionMean = "RECON_DO_NOT_CNVT"
				}
				else{
					actionMean = "CANCEL DC";
				}
				break;
			//Suspend
			case "P":
				actionMean = "SUSPEND";
				break;
			// Modify
			case "M":
				// on admit a modify is a new order
				if(recon_type_flag === 1){					
					// a reconciled hx is a treated as continue
					if( ord_as_flag === 2){
						actionMean = "RECON_CONTINUE";
					}
					else{
						actionMean = "ORDER";
					}
				}
				// on discharge a modify is a keep
				else if(recon_type_flag === 3){
					actionMean = "RECON_CONTINUE";
				}
				else{
					actionMean = "RECON_CONTINUE";
				}
				break;
		}
		return (actionMean);
	},
	getContinueInd : function(recon_type_flag,keep_flag) {
		/*
		 * indicates whether the personnel that performed the reconciliation chose to continue the order.
		 * 1 - continue the order
		 * 2 - do not continue the order
		 * 3 - continue the order with changes.
		 */
		var continueInd = 1;
		keep_flag = keep_flag.toUpperCase();
		switch(keep_flag) {
			// Keep, Resume, Restart
			case "K":
			case "R":
				continueInd = 1;
				break;
			// Stop, Suspend
			case "S":
			case "P":
				continueInd = 2;
				break;
			// Modify
			case "M":
				// on discharge a modify is a keep
				if(recon_type_flag === 3){
					continueInd = 1;
				}
				else{
					continueInd = 3;
				}
				break;
		}
		return (continueInd);
	},
	isReconcilable: function(actionedOrderable,recon_type_flag){
		var preferenceModel = this.preferenceModel;		
		var isReconcilable = false;
		// If preference to write to order reconciliation tables
		if(preferenceModel != null) {
			
			switch(recon_type_flag){
				// admission
				case 1:if(preferenceModel.get("ADMITRECONIND") === 1){
							// allow keep and modify admit reconcile on any order
							if(actionedOrderable.get("KEEP_FLAG") == "K"|| actionedOrderable.get("KEEP_FLAG") == "M"
							// allow stop admit reconcile only on home med orders
							|| (actionedOrderable.get("KEEP_FLAG") == "S" && parseInt(actionedOrderable.get("MEDORDFLAG"),10) === 2)){
								isReconcilable = true;
							}
						}
						break;
				// transfer
				case 2:if(preferenceModel.get("TRANSFERRECONIND") === 1){
							isReconcilable = true;
						}
						break;
				// discharge
				case 3: if(preferenceModel.get("DISCHARGERECONIND") === 1){
							isReconcilable = true;
						}
						break;
			}
			
		}
		return (isReconcilable);		
	},
	builderOrderReconciliations : function(reconInfo) {
		var self = this, actionedOrderables = reconInfo.actionedOrderables, encntr_id = reconInfo.encntr_id;
		var personnel_id = reconInfo.personnel_id, recon_type_flag = reconInfo.recon_type_flag, MOEWOrders = reconInfo.MOEWOrders, ord_recon_data = {
			"ord_recon_list" : {
				"encntr_id" : JSON.setCCLFloatNumber(parseFloat(reconInfo.encntr_id)),
				"performed_prsnl_id" : JSON.setCCLFloatNumber(parseFloat(reconInfo.personnel_id)),
				"ord_recons" : []
			}
		}, recon_list = [], cur_recon = {};
		// Loop through each orderableModel for sign and reset orderable models not signed through MOEW
		_.each(actionedOrderables, function(actionedOrderable) {
			var orderableJSON = actionedOrderable.toJSON();
			var continue_order_ind = 1;
			var recon_order_action_mean = "";
			var reltn_type_mean = "";
			var orderId = parseFloat(actionedOrderable.get("ORDERID"));
			var orderData = self.getOrderData(orderId);
			var to_action_seq = orderData.LAST_ACTION_SEQUENCE;
			var synonymId = orderData.SYNONYM_ID;
			var newOrderId;
			var newOrderMnemonic;
			var newOrderSimpleDisp;
			var newOrderClinDisp;

			// orderable with a valid action
			if(orderableJSON.KEEP_FLAG > " " && self.isReconcilable(actionedOrderable,recon_type_flag)) {
				continue_order_ind = self.getContinueInd(recon_type_flag,orderableJSON.KEEP_FLAG);
				recon_order_action_mean = self.getReconActionMean(orderData, recon_type_flag,orderableJSON);
				reltn_type_mean = recon_order_action_mean;
				
				// Increment action sequence for any non continue action
				if(continue_order_ind != 1) {
					to_action_seq += 1;
				}
				// for admit reconciliations which have a related home med
				if(recon_type_flag == 1 && parseFloat(actionedOrderable.get("RELATED_FROM_HX_ORDER_ID")) > 0){
						reltn_type_mean = "CONVERT_INPAT"				
						cur_recon = {
							"recon_type_flag" : recon_type_flag,
							"to_action_seq" : to_action_seq,
							"no_known_meds_ind" : 0, // Always reconciled orders
							"reltn_type_mean" : reltn_type_mean,
							"order_list" : [{
								"order_id" : JSON.setCCLFloatNumber(parseFloat(actionedOrderable.get("RELATED_FROM_HX_ORDER_ID"))),
								"clinical_display_line" : actionedOrderable.get("RELATED_FROM_HX_CLIN_DISP"),
								"simplified_display_line" : actionedOrderable.get("RELATED_FROM_HX_SIMPLE_DISP"),
								"continue_order_ind" : continue_order_ind,
								"recon_order_action_mean" : "CONVERT_INPAT",
								"order_mnemonic" : actionedOrderable.get("RELATED_FROM_HX_ORDER_NAME")
							}]
						}
				}
				// Add entry for reconcile on the original order
				else{
					cur_recon = {
						"recon_type_flag" : recon_type_flag,
						"to_action_seq" : to_action_seq,
						"no_known_meds_ind" : 0, // Always reconciled orders
						"reltn_type_mean" : reltn_type_mean,
						"order_list" : [{
							"order_id" : JSON.setCCLFloatNumber(parseFloat(orderableJSON.ORDERID)),
							"clinical_display_line" : orderData.CLINICAL_DISPLAY_LINE,
							"simplified_display_line" : orderData.SIMPLIFIED_DISPLAY_LINE,
							"continue_order_ind" : continue_order_ind,
							"recon_order_action_mean" : recon_order_action_mean,
							"order_mnemonic" : orderableJSON.MEDNAME
						}]
					}
				}
				
				// If new orders were added or modified through MOEW => add them for reconcile
				if(MOEWOrders != null) {
					var newOrder = _.find(MOEWOrders, function(MOEWOrder) {
						var newOrderId = null;
						var relatedSynonymId = null;
						var relatedOrderId = null;

						if(MOEWOrder) {
							newOrderId = parseFloat(self.getXMLNodeValue(MOEWOrder.getElementsByTagName("OrderId")[0]));
							relatedOrderId = parseFloat(self.getXMLNodeValue(MOEWOrder.getElementsByTagName("RelatedFromOrderId")[0]));
							relatedSynonymId = parseFloat(self.getXMLNodeValue(MOEWOrder.getElementsByTagName("SynonymId")[0]));
						}
						// modified an existing order, related to an existing order or finally the same synonym as existing order
						if(orderId == newOrderId || orderId === relatedOrderId || synonymId === relatedSynonymId ) {
							return true;
						}
					});
					// Order selected for sign
					if(newOrder != null) {			
						newOrderId = parseFloat(self.getXMLNodeValue(newOrder.getElementsByTagName("OrderId")[0]));
						newOrderMnemonic = self.getXMLNodeValue(newOrder.getElementsByTagName("OrderMnemonic")[0]);
						newOrderSimpleDisp = self.getXMLNodeValue(newOrder.getElementsByTagName("SimpleDisplayLine")[0]);
						newOrderClinDisp = self.getXMLNodeValue(newOrder.getElementsByTagName("ClinDisplayLine")[0]);			
						// for admit reconciliations
						if(recon_type_flag === 1){
							// a related hx exists => add a related reconcile
							if(parseFloat(actionedOrderable.get("RELATED_FROM_HX_ORDER_ID")) > 0){
								// Always a new order
								recon_order_action_mean = "ORDER";
							}
							// clear order list for indicating a single order reconcile
							else{
								cur_recon.order_list = []
							}
							cur_recon.order_list.unshift({
								"order_id" : JSON.setCCLFloatNumber(newOrderId),
								"clinical_display_line" : newOrderClinDisp,
								"simplified_display_line" : newOrderSimpleDisp,
								"continue_order_ind" : continue_order_ind,
								"recon_order_action_mean" : recon_order_action_mean,
								"order_mnemonic" : newOrderMnemonic
							});
						}
						// for other type of reconciliations
						else{
							// For Restart => add a related reconcile
							if(recon_order_action_mean === "CANCEL REORD") {
								// Always a new order
								recon_order_action_mean = "ORDER";
							}
							// clear order list for indicating a single order reconcile
							else{
								cur_recon.order_list = []
							}
							// Pushed related order 
							cur_recon.order_list.unshift({
								"order_id" : JSON.setCCLFloatNumber(newOrderId),
								"clinical_display_line" : newOrderClinDisp,
								"simplified_display_line" : newOrderSimpleDisp,
								"continue_order_ind" : continue_order_ind,
								"recon_order_action_mean" : recon_order_action_mean,
								"order_mnemonic" : newOrderMnemonic
							});
							
						}
					}
				}
					
				recon_list[recon_list.length] = cur_recon;
			}
		});
		//
		ord_recon_data["ord_recon_list"]["ord_recons"] = recon_list;

		return (ord_recon_data);
	},
	reconcileSameEncounterTransferOrderables : function(signedOrderables, MOEWOrders, callBack) {
		var preferenceModel = this.preferenceModel;	
		var ord_recon_data, cclParam, self = this;
		ord_recon_data = self.builderOrderReconciliations({
			"encntr_id" : Criterion.encntr_id,
			"personnel_id" : Criterion.personnel_id,
			"recon_type_flag" : 2,
			"actionedOrderables" : signedOrderables,
			"MOEWOrders" : MOEWOrders
		})
		// Any reconciliations to perform ?
		if(ord_recon_data.ord_recon_list.ord_recons.length > 0 ){
			//Call CCL script to reconcile orderables
			cclParam = '"MINE",^' + JSON.stringify(ord_recon_data) + '^';
			AjaxHandler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : 'ADVSR_MEDS_REC_ADD_ORD_RECON:dba',
					parameters : cclParam
				},
				response : {
					type : "JSON",
					target : callBack,
					parameters : []
				}
			});
		}
		else{
			callBack();
		}
		
	},
	reconcileAdmitOrderables : function(savedOrderables, MOEWOrders,callBack) {		
		var ord_recon_data, cclParam, self = this;
		// any related hx admit rec
		if(savedOrderables.length > 0) {
			ord_recon_data = self.builderOrderReconciliations({
				"encntr_id" : Criterion.encntr_id,
				"personnel_id" : Criterion.personnel_id,
				"recon_type_flag" : 1,
				"actionedOrderables" : savedOrderables,
				"MOEWOrders" : MOEWOrders
			})

			// Any reconciliations to perform ?
			if(ord_recon_data.ord_recon_list.ord_recons.length > 0) {
				//Call CCL script to reconcile orderables
				cclParam = '"MINE",^' + JSON.stringify(ord_recon_data) + '^';
				AjaxHandler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : 'ADVSR_MEDS_REC_ADD_ORD_RECON:dba',
						parameters : cclParam
					},
					response : {
						type : "JSON",
						target : callBack,
						parameters : []
					}
				});
			} 
			else {
				callBack();
			}
		}
		else {
			callBack();
		}
		
	},
	reconcileSavedCrossEncounterOrderables : function(savedOrderables, callBack) {
		
		var ord_recon_data, cclParam, self = this;
		
		ord_recon_data = self.builderOrderReconciliations({
			"encntr_id" : Criterion.encntr_id,
			"personnel_id" : Criterion.personnel_id,
			"recon_type_flag" : 3,
			"actionedOrderables" : savedOrderables,
			"MOEWOrders" : null
		})
			
		// Any reconciliations to perform ?
		if(ord_recon_data.ord_recon_list.ord_recons.length > 0 ){
			//Call CCL script to reconcile orderables
			cclParam = '"MINE",^' + JSON.stringify(ord_recon_data) + '^';
			AjaxHandler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : 'ADVSR_MEDS_REC_ADD_ORD_RECON:dba',
					parameters : cclParam
				},
				response : {
					type : "JSON",
					target : callBack,
					parameters : []
				}
			});
		}
		else{
			callBack();
		}
		
	},
	loadFacilityInfo : function() {
		var patientDemographicModel = this.patientDemographicModel;
		if(patientDemographicModel) {
			this.cur_facility_cd = patientDemographicModel.get("FAC_CD");
			this.cur_location_cd = patientDemographicModel.get("LOC_CD");
			this.advsr_event_id = patientDemographicModel.get("AE_EVENT_ID");
			this.advsr_group_id = patientDemographicModel.get("AE_GROUP_ID");

			// Default origin to current if not found
			if(this.origin_facility_cd == 0) {
				this.origin_facility_cd = patientDemographicModel.get("FAC_CD");
			}
			if(this.origin_location_cd == 0) {
				this.origin_location_cd = patientDemographicModel.get("LOC_CD");
			}
		}
	},
	setDemographicModel : function(ptDemoModel) {
		this.patientDemographicModel = ptDemoModel;
	},
	setPreferenceModel : function(preferenceModel) {
		this.preferenceModel = preferenceModel;
	},
	setLocationsModel : function(locationModel) {
		this.locationModel = locationModel;
	},
	/**
	 * recieveCCLResponse will process transfer reconciliation orderables
	 * @param {Object} JSON response object containing transfer reconciliation orderables
	 */
	recieveCCLResponse : function(json_response) {
		$(".loading-dialog").hide();
		var transf_rec_data = json_response.response.AORDERS, orderableList = transf_rec_data.ORDS, signableOrders = false;
		this.loadFacilityInfo();

		if(transf_rec_data.ORIGIN_FAC_CD > 0) {
			this.origin_facility_cd = transf_rec_data.ORIGIN_FAC_CD;
		}
		if(transf_rec_data.ORIGIN_LOC_CD > 0) {
			this.origin_location_cd = transf_rec_data.ORIGIN_LOC_CD;
		}
		if(transf_rec_data.LOC_CD > 0) {
			this.svd_location_cd = transf_rec_data.LOC_CD;
		}
		if(transf_rec_data.ORIGIN_EID) {
			this.origin_encntr_id = transf_rec_data.ORIGIN_EID
		} else {
			this.origin_encntr_id = Criterion.encntr_id;
		}
		this.cur_encntr_id = Criterion.encntr_id;

		if(this.advsr_event_id > 0 && ((parseFloat(this.origin_encntr_id) != parseFloat(Criterion.encntr_id)) || (parseFloat(this.cur_facility_cd) != parseFloat(this.origin_facility_cd)) || (parseFloat(this.cur_location_cd) != parseFloat(this.origin_location_cd)) )) {
			signableOrders = true;
		}
		
		// Set same encounter flag based on the encounter picked
		if (parseFloat(this.origin_encntr_id) ===  parseFloat(Criterion.encntr_id) ){
			this.setSameEncntrFlag(1);
		}		
		else{
			this.setSameEncntrFlag(0);
		}

		var self = this;

		// Loop through all orderables and set action_bitmap
		var PowerOrdersMPageUtils = Criterion.MPAGE_API.DiscernObjectFactory("POWERORDERS");
		var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(Criterion.person_id, Criterion.encntr_id, 0, 2, 127);
		
		// For each orderable, create an OrderableModel
		_.each(orderableList, function(curOrderable) {
			//if orderable model already exists, retrieve it
			var orderable = self.detect(function(orderableModel) {
				return parseFloat(orderableModel.get("ORDERID")) === parseFloat(curOrderable.ORDERID);
			});
			//if orderable doesn't exist, then create it
			if(_.isEmpty(orderable)) {
				var orderable = new OrderableModel;
				orderable.set(curOrderable);
				self.add(orderable, {
					silent : true
				});
			}
			orderable.set({
				"ACTION_BITMAP" : PowerOrdersMPageUtils.GetAvailableOrderActions(m_hMOEW, parseFloat(orderable.get("ORDERID")))
			}, {
				silent : true
			});
			if(self.suspend_flag == 0) {
				var oa_susp_flag = orderable.get("ACTION_BITMAP");
				if(oa_susp_flag & 512) {
					//Suspend Available
					self.suspend_flag = 1;
				}
			}
			// if(signableOrders && curOrderable.ORDSTATUSFLAG == 5) {
			if(curOrderable.ORDSTATUSFLAG == 5) {
				$("#modified-orders-message").show();
			}
			//Push orderable to lists based on flag
			var flag = parseInt(curOrderable.TASKCLASSFLAG, 10);
			var moFlag = parseInt(curOrderable.MEDORDFLAG, 10);
					
			// all normal orders or hx orders with the show pref 
			self.allOrderables.push(orderable);
			if(moFlag === 2){
				// Home Medications
				self.homeMedOrderables.push(orderable);				
			}
			else if ((moFlag === 0)){
				switch(flag) {
					case 0:
						// Scheduled
						self.scheduledOrderables.push(orderable);
						break;
					case 1:
						// Unscheduled
						self.unscheduledOrderables.push(orderable);
						break;
					case 2:
						// PRN
						self.prnOrderables.push(orderable);
						break;
					case 3:
						// Inactive Orders
						self.inactiveOrderables.push(orderable);
						break;
				}
			}
				
		});
		PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
		this.trigger("change")
	},
	showHxOrderables: function(same_encntr_flag){
		var preferenceModel = this.preferenceModel;	
		var showHx = false;
		
		// single encounter display pref set to false
		if(same_encntr_flag == 1 && preferenceModel.get("DOCHXSINGLEENCIND") === 1){
			showHx = true;
		}
		// double encounter display pref set to false
		else if(same_encntr_flag == 0 && preferenceModel.get("DOCHXDOUBLEENCIND") === 1){
			showHx = true;
		}		
		return(showHx)
	},
	sortModelsBy : function(attribute, reverseSort) {
		this.models = _.sortBy(this.models, function(orderableModel) {
			return (orderableModel.get(attribute));
		})
		if(reverseSort) {
			this.models.reverse();
		}
		this.trigger("sort");
	},
	destroy : function() {
		_.each(this.allOrderables, function(curOrderableModel) {
			curOrderableModel.destroy();
		});
	}
});
/**
 * OrderableSubCollection handles sub-collections of orderable retrieved from INN_MP_GET_TRANSF_REC script and all data returned from it
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2,OrderableModel
 */
var OrderableSubCollection = Backbone.Collection.extend({
	/**
	 * Collection model
	 */
	model : OrderableModel,

	/**
	 * Orderable Types
	 */
	orderableTypes : [],

	initialize : function() {
		_.bindAll(this);
	},
	/**
	 * Retrieve
	 */
	retrieve : function() {
	},
	/**
	 * recieveCCLResponse will process transfer reconciliation orderables
	 * @param {Object} JSON response object containing transfer reconciliation orderables
	 */
	recieveCCLResponse : function(json_response) {
	},
	sortModelsBy : function(attribute, reverseSort) {
		this.models = _.sortBy(this.models, function(orderableModel) {
			var sortValue = "";
			if(attribute.length == 1) {
				sortValue = (orderableModel.get(attribute[0]));
			} else if(attribute.length == 2) {
				sortValue = (orderableModel.get(attribute[0])) + "_" + (orderableModel.get(attribute[1]));
			}
			return (sortValue.toUpperCase());
		})
		if(reverseSort) {
			this.models.reverse();
		}
		this.trigger("sort");
	},
	destroyViews: function(){
		_.each(this.models,function(orderableModel){
			$(orderableModel.view).remove();
			orderableModel.view = null;
		});
	}
});
/**
 * Component View
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,doT,PreferenceModel, OrderableSubCollection
 */
var ComponentView = Backbone.View.extend({	
	tagName: "div",		
	className: "section",
	thead  : $("<thead></thead"),
	tbody : $("<tbody></tbody"),	
	saved: false,
	signed:false,
	template : doT.template($("#ComponentTemplate").html()),	
	orderableHeaderTemplate : doT.template($("#OrderableHeaderTemplate").html()),	
	/**
	 * Event handlers
	 */
	events:{
		"click span.sec-hd-tgl" : "toggleComponentDisplay",
		"click td.start-dt-tm":"sortByStartDtTm",
		"click td.orderable-name":"sortByOrderableName",
		"click td.orderable-details":"sortByOrderableDetails",
		"click td.keep" : "keepAllOrders",
		"click td.modify" : "modifyAllOrders",
		"click td.stop" : "stopAllOrders",
		"click td.suspend" : "suspendAllOrders",
		"click td.restart" : "restartAllOrders"
	},
	/**
	 * Initialize View.  Creates subviews.  Renders on PreferenceModel "load" event followed by OrderableModel "load" event.
	 */
	initialize : function() {
		var self = this;		
		_.bindAll(this);		
		this.saved = this.options.saved;
		this.signed = this.options.signed;
		this.preferenceModel = this.options.preferenceModel;
		this.orderableModels = this.options.orderables;
		this.collection.bind("destroy",this.removeView,this);	
		this.render();	
	},
	/**
	 * creates component view
	 */
	createView : function(){	
	  var el = this.el;	
	  $(el).html(this.template(this.model));
	  return el;
	},
	/**
	 * Render View HTML
	 * @returns {ComponentView} this view
	 */
	render : function() {
		var el = this.el;		
		//remove all div
		this.$("div").detach();	
		
		this.view = this.createView();
		var strsearch = this.view.innerHTML.toUpperCase();
		var nInactive = strsearch.search("INACTIVE");
		this.thead = $("thead",this.el);
		this.tbody = $("thead",this.el);
		this.attachOrderableHeaderView(nInactive);
		this.attachOrderableViews();
		
			// attach any hovers using the hvr classname
			$(".hvr",$(this.el)).each(function(){
				hs($(this).prev().get(0) ,$(this).get(0),null)
			});
			
		this.collection.bind("sort",this.attachOrderableViews);
		return this;
	},
	/**
	 * Attach Orderable Header View to Component View
	 */
	attachOrderableHeaderView : function(flag) {
		var thead = this.thead,
		    trow  = $("<tr></tr>"),
		    singleActionInd = this.preferenceModel.get("SINGLEACTIONIND");
		    
		var start_dt_tm_disp_width ;
		var order_name_disp_width ;
		var order_detail_disp_width ;
		    
		if(this.saved || this.signed) {
			start_dt_tm_disp_width = "15.00%";
			order_name_disp_width = "30.000%";
			order_detail_disp_width = "40.000%";
		} else {
			start_dt_tm_disp_width = "15.00%";
			order_name_disp_width = "30.000%";
			order_detail_disp_width = "34.000%";
		}    
		
		$(trow).append(this.orderableHeaderTemplate({
			"LABEL" : "&nbsp;Start Date/Time",
			"SORT_CSS" : "sort-start-dt-tm",
			"CSS" : "hdrl start-dt-tm",
			"WIDTH":start_dt_tm_disp_width,
			"SORT_TITLE" : "Sort By Start Date/Time"
		}));
		$(trow).append(this.orderableHeaderTemplate({
			"LABEL" : "Orderable",
			"SORT_CSS" : "sort-orderable-name",
			"CSS" : "hdrl orderable-name",
			"WIDTH":order_name_disp_width,
			"SORT_TITLE" : "Sort By Orderable"
		}));
		$(trow).append(this.orderableHeaderTemplate({
			"LABEL" : "Order Details",
			"SORT_CSS" : "sort-orderable-details",
			"CSS" : "hdrl orderable-details",
			"WIDTH":order_detail_disp_width,
			"SORT_TITLE" : "Sort By Order Details"
		}));
		if(flag >= 0) {
			$(trow).append(this.orderableHeaderTemplate({
				"CSS" : "hdrl ctr restart",
				"LABEL" : "Restart",
				"SORT_TITLE" : "Click to Resume/Reorder All"
			}));
		} else {
			if(this.saved || this.signed) {
				$(trow).append(this.orderableHeaderTemplate({
					"CSS" : "hdrl ctr",
					"LABEL" : "",
					"SORT_TITLE" : ""
				}));
			} else {
				if(singleActionInd) {
					$(trow).append(this.orderableHeaderTemplate({
						"CSS" : "hdrl ctr keep",
						"LABEL" : "Keep/Modify",
						"SORT_TITLE" : "Click to Keep/Modify All"
					}));
				} else {
					$(trow).append(this.orderableHeaderTemplate({
						"CSS" : "hdrl ctr keep",
						"LABEL" : "Keep",
						"SORT_TITLE" : "Click to Keep All"
					}));
					$(trow).append(this.orderableHeaderTemplate({
						"CSS" : "hdrl ctr modify",
						"LABEL" : "Modify",
						"SORT_TITLE" : "Click to Modify All"
					}));
					$(trow).append(this.orderableHeaderTemplate({
						"CSS" : "hdrl ctr suspend",
						"LABEL" : "Suspend",
						"SORT_TITLE" : "Click to Suspend All"
					}));
					$(trow).append(this.orderableHeaderTemplate({
						"CSS" : "hdrl ctr stop",
						"LABEL" : "Stop",
						"SORT_TITLE" : "Click to Stop All"
					}));
				}

			}
		}

		$(thead).append(trow);	
	},
	/**
	 * Attach Orderable Views to Component View
	 */
	attachOrderableViews : function() {
		var tbody = this.tbody,self = this;		
		this.collection.each(function(orderable,index){
			
			var orderableCSS = "even",addCSS = "",removeCSS = "";			
			if(!orderable.view) {
				var orderableView = new OrderableView({
					"model" : orderable,
					"preferenceModel" : self.preferenceModel,
					"saved":self.saved,
					"signed":self.signed
				});				
			}
			orderableView = orderable.view;
			if(index%2 == 0){
				addCSS = "odd";
				removeCSS = "even";
			}
			else{
				addCSS = "even";
				removeCSS = "odd";
			}
			orderableView.setViewCSS(addCSS,removeCSS);
			tbody.append(orderable.view.el);
		});
	},
	toggleComponentDisplay : function(){
		var targetNode = $(".sec-hd-tgl",this.el)
		, el = this.el
			,componentBodyNode;
		if(targetNode){
			componentBodyNode = $(".sec-body",this.el);
			if($(componentBodyNode).hasClass("hidden")){
				$(el).removeClass("closed");	
				$(targetNode).attr("title","Hide Section");
			}
			else{
				$(el).addClass("closed");	
				$(targetNode).attr("title","Show Section");
			}
			$(componentBodyNode).toggleClass("hidden");
		}
	},
	isHidden: function(){
		var componentBodyNode = $(".sec-body",this.el);
		if(componentBodyNode){
			return($(componentBodyNode).hasClass("hidden"));
		}
		else{
			return false;
		}
	},
	sortBy: function(sortbyAttribute,sortbyCSS){
		$('.sortable').hide();
		var targetNode = $("."+sortbyCSS,this.el);
		if(targetNode){
			$(targetNode).show();
			this.collection.sortModelsBy(sortbyAttribute,$(targetNode).hasClass("ascending"));	
			if($(targetNode).hasClass("ascending"))
				$(targetNode).html('&#8595');
			else
				$(targetNode).html("&#8593");
			$(targetNode).toggleClass("ascending");
		}
	},
	sortByStartDtTm : function(ev){
		this.sortBy(["MEDORDDTTMDISP"],"sort-start-dt-tm");
	},
	sortByOrderableName: function(ev){		
		this.sortBy(["MEDORDFLAG","MEDNAME"],"sort-orderable-name");
	},
	sortByOrderableDetails: function(ev){		
		this.sortBy(["MEDDET"],"sort-orderable-details");
	},
	applyOrderAction: function(action,select){		
		//alert("applyOrderAction...\naction:\t"+action+"\nselect:\t"+select);
		this.collection.each(function(orderable){
			orderable.applyAction(action,select);
		});
	},
	applyDisableSuspend: function(action,select){
		this.collection.each(function(orderable){
			orderable.applyDisable(action,select);
		});
	},
	doSelectAll : function(ev,type){
		var selectAll = false;
		var tClass = "action " + type;
		var el = this.el
		if(ev.currentTarget){
			targetNode = ev.currentTarget;
			// check for select all
			if ( $("[class^='"+tClass+"']",el).attr("checked") ){
				selectAll = true;
			} 
			else{ 
				selectAll = false;
			}
			// clear out other headers in component
			$("td.hdrl",el).each(function(index,element){
				if(element != targetNode){
					$(element).removeClass("select-all");
				}
			});
			// change class on current header
			if (selectAll == false){
				$(targetNode).addClass("select-all");
			}
			else{
				$(targetNode).removeClass("select-all");
			}
			// invert action
			selectAll = !selectAll; 
		}
		return (selectAll)
	},
	keepAllOrders: function(ev){
		var selectAll = this.doSelectAll(ev,"keep");
		this.applyOrderAction("KEEP",selectAll);
	},
	modifyAllOrders: function(ev){
		var selectAll = this.doSelectAll(ev,"modify");
		this.applyOrderAction("MODIFY",selectAll);
	},
	suspendAllOrders:function(ev){
		var selectAll = this.doSelectAll(ev,"suspend");
		this.applyOrderAction("SUSPEND",selectAll);
	},
	restartAllOrders:function(ev){
		var selectAll = this.doSelectAll(ev,"restart");
		this.applyOrderAction("RESTART",selectAll);
	},
	stopAllOrders:function(ev){
		var selectAll = this.doSelectAll(ev,"stop");
		this.applyOrderAction("STOP",selectAll);
	},
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function(){
		this.collection.unbind("destroy",this.removeView,this);
		this.collection = null;
		this.model = null;
		$(this.el).empty().remove();
	}	
});
/**
 * Patient Demographic View
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,doT,model
 */
var LocationsView = Backbone.View.extend({
	tagName : "span",

	className : "",

	template : doT.template($("#LocationsTemplate").html()),

	/**
	 * Initialize View.  Creates subviews.  Renders on PatientCollection's "change:timeInterval" event.
	 */
	initialize : function() {
		_.bindAll(this);
		this.locationsModel = this.options.locationsModel;
		this.model.bind("change", this.render);
		this.model.bind("select-location", this.selectLocation);
		this.model.bind("destroy", this.removeView, this);
	},
	orderableSelected : function() {

	},
	/********************
	 * creates the view *
	 ********************/
	createView : function() {
		var el = this.el;
		$(el).html(this.template(this.model.toJSON()));
		return el;
	},
	/**
	 * Render View HTML
	 * @returns {LocationView} this view
	 */
	render : function() {
		var self = this;
		var el = this.el;
		var locList = this.model.toJSON();
		//remove all div
		this.$("div").detach();
		this.view = this.createView();
		$("#divLocations").append(this.view);
		$(".sp-loc-sel", el).change(function() {
			var dest_meaning;
			var dest_display;
			$(".sp-loc-sel option:selected", el).each(function() {
				dest_meaning = $(this).attr("id");
				dest_display = $(this).text();
			});
			self.model.set({
				"DEST_MEANING" : dest_meaning,
				"DEST_DISPLAY" : dest_display
			}, {
				silent : true
			});
			self.model.trigger("location-change");
		});
		return this;
	},
	selectLocation : function(){
		var dest_meaning = this.model.get("DEST_MEANING");
		var el = this.el;
		$(".sp-loc-sel option", el).each(function() {
				if($(this).attr("id") === dest_meaning){
					$(this).attr("selected",true); 
				}			
			});
		
	},
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function() {
		this.model.unbind("destroy", this.removeView, this);
		$(this.el).empty().remove();
	}
});
/**
 * OrderableView View
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,doT,OrderableModel
 */
var OrderableView = Backbone.View.extend({
	tagName : "tr",

	className : "even",
	signedActionDisplay : "Signed...",
	savedActionDisplay : "Saved for transfer...",
	signed : false,
	saved : false,

	template : doT.template($("#OrderableTemplate").html()),
	
	orderDateTimeTemplate : doT.template($("#OrderableDateTimeTemplate").html()),

	orderActiontemplate : doT.template($("#OrderableActionTemplate").html()),

	orderSavedtemplate : doT.template($("#OrderableSavedTemplate").html()),

	/**
	 * Event handlers
	 */
	events : {
		"click input.action" : "selectAction",
		"dblclick input.action" : "unselectAction",
		"mouseover" : "activeRow",
		"mouseout" : "unactiveRow"
	},

	/**
	 * Initialize View.  Creates subviews.  Renders on PreferenceModel "load" event followed by OrderableModel "load" event.
	 */
	initialize : function() {
		var self = this;

		_.bindAll(this);

		this.model.view = this;
		this.preferenceModel = this.options.preferenceModel;
		this.signed = this.options.signed;
		this.saved = this.options.saved;

		this.render();

		this.model.bind("hide", this.hideView, this);
		this.model.bind("show", this.showView, this);
		this.model.bind("select-action", this.triggerSelectAction, this)
		this.model.bind("destroy", this.removeView, this);

	},
	getIconDisplay : function(orderedAsFlag) {
		var imgSrc = "";
		orderedAsFlag = parseInt(orderedAsFlag, 10);
		switch(orderedAsFlag) {
			case 1:
				imgSrc = "..\\img\\4969.gif";
				break;
			case 2:
				imgSrc = "..\\img\\3796_16.gif";
				break;
		}
		return (imgSrc)
	},
	createOrderSaveView : function() {
		var el = this.el, action_disp_width = "15.000%";
		$(el).append(this.orderSavedtemplate({
			"CSS" : "mc svd",
			"WIDTH" : action_disp_width,
			"ACTION_DISPLAY" : this.savedActionDisplay
		}));

	},
	createOrderSignView : function() {
		var el = this.el, action_disp_width = "15.000%";
		$(el).append(this.orderSavedtemplate({
			"CSS" : "mc svd",
			"WIDTH" : action_disp_width,
			"ACTION_DISPLAY" : this.signedActionDisplay
		}));
	},
	/**
	 * creates Order Action view
	 */
	createOrderActionView : function() {
		var el = this.el, self = this, model = this.model, action_disp_width, actionName = "ACTION_" + model.get("ORDERID");

		var oActionStr = model.get("ACTION_BITMAP");
		var cssAVAILABLE = " avail";
		var cssNOT_AVAILABLE = " unavailable";
		var cssAction = "";
		var showActionInd ;

		if(model.get("TASKCLASSFLAG") == 3) {
			// Show restart action only for normal orders
			showActionInd = (parseInt(model.get("MEDORDFLAG"), 10) < 1);
			action_disp_width = "20.00%";
			if(model.get("O_STATUS_DISP").toUpperCase() == "SUSPENDED") {
				if(oActionStr & 1024) {
					cssAction = cssAVAILABLE;
				} else {
					cssAction = cssNOT_AVAILABLE;
				}
			} else {
				if(model.get("O_STATUS_DISP").toUpperCase() == "DISCONTINUED" || model.get("O_STATUS_DISP").toUpperCase() == "CANCELLED") {
					// restart is always available
					cssAction = cssAVAILABLE;
				}
			}
			$(el).append(this.orderActiontemplate({
				"CSS" : "ctr",
				"ACTION_CSS" : "action restart" + cssAction,
				"WIDTH" : action_disp_width,
				"ACTION_NAME" : actionName,
				"SHOW_ACTION":showActionInd
			}));

		} else {
			
			// KEEP
			action_disp_width = "5.00%";
			// always available
			cssAction = cssAVAILABLE;

			$(el).append(this.orderActiontemplate({
				"CSS" : "ctr",
				"ACTION_CSS" : "action keep" + cssAction,
				"WIDTH" : action_disp_width,
				"ACTION_NAME" : actionName,
				"SHOW_ACTION":true
			}));

			// MODIFY			
			// Show modify action only for normal orders
			showActionInd = (parseInt(model.get("MEDORDFLAG"), 10) < 1);
			if(oActionStr & 2) {
				cssAction = cssAVAILABLE;
			} else {
				cssAction = cssNOT_AVAILABLE;
			}
			$(el).append(this.orderActiontemplate({
				"CSS" : "ctr",
				"ACTION_CSS" : "action modify" + cssAction,
				"WIDTH" : action_disp_width,
				"ACTION_NAME" : actionName,
				"SHOW_ACTION":showActionInd
			}));

			// SUSPEND
			// Show suspend action only for normal orders
			showActionInd = (parseInt(model.get("MEDORDFLAG"), 10) < 1);
			if(oActionStr & 512) {
				cssAction = cssAVAILABLE;
			} else {
				cssAction = cssNOT_AVAILABLE;
			}
			$(el).append(this.orderActiontemplate({
				"CSS" : "ctr",
				"ACTION_CSS" : "action suspend" + cssAction,
				"WIDTH" : action_disp_width,
				"ACTION_NAME" : actionName,
				"SHOW_ACTION":showActionInd
			}));

			// STOP
			if(oActionStr & 1) {
				cssAction = cssAVAILABLE;
			} else {
				cssAction = cssNOT_AVAILABLE;
			}
			$(el).append(this.orderActiontemplate({
				"CSS" : "ctr",
				"ACTION_CSS" : "action stop" + cssAction,
				"WIDTH" : action_disp_width,
				"ACTION_NAME" : actionName,
				"SHOW_ACTION":true
			}));

		}

		switch(model.get("KEEP_FLAG").toUpperCase()) {
			case "K":
				$("input.keep", el).attr("checked", true);
				break;
			case "M":
				$("input.modify", el).attr("checked", true);
				break;
			case "P":
				$("input.suspend", el).attr("checked", true);
				break;
			case "S":
				$("input.stop", el).attr("checked", true);
				break;
			case "R":
				$("input.restart", el).attr("checked", true);
				break;
		}
		
		
		return el;
	},
	/**
	 * creates sign view
	 */
	createOrderView : function() {
		var el = this.el, model = this.model, start_dt_tm_disp, start_dt_tm_disp_width, order_name_disp, order_name_disp_width, order_detail_disp, order_detail_disp_width, orderChanged = false, orderStatusDisp = "";

		if(this.saved || this.signed) {
			start_dt_tm_disp_width = "15.00%";
			order_name_disp_width = "30.000%";
			order_detail_disp_width = "40.000%";
		} else {
			start_dt_tm_disp_width = "15.00%";
			order_name_disp_width = "30.000%";
			order_detail_disp_width = "34.000%";
		}
		
		if(model.get("ORDSTATUSFLAG") == 5) {
			orderChanged = true;
		}
		$(el).append(this.orderDateTimeTemplate({
			"DISPLAY" : "&nbsp;" + model.get("MEDORDDTTMDISP"),
			"WIDTH" : start_dt_tm_disp_width
		}));
		if(model.get("TASKCLASSFLAG") == 3) {
			orderStatusDisp = " (" + model.get("O_STATUS_DISP") + ")";
		} else {
			orderStatusDisp = "";
		}
		$(el).append(this.template({
			"ORDER_FLAG_ICON" : this.getIconDisplay(model.get("MEDORDFLAG")),
			"DOC_HX_ICON":"..\\img\\3796_16.gif",
			"CONTINUED_ICON": "..\\img\\6355_24.png",
			"MODIFIED_ICON": "..\\img\\6314_24.png",
			"ORDER_NAME_DISPLAY" : model.get("MEDNAME"),
			"ORDER_DETAILS_DISPLAY" : model.get("MEDDET"),
			"ORDER_INGRED_CNT" : model.get("ORDER_INGRED_CNT"),
			"ORDER_INGREDS" : model.get("ORDER_INGREDS"),
			"CONTINUED_TITLE": "Continued",
			"MODIFIED_TITLE": "Modified",
			"ORDER_STATUS" : orderStatusDisp,
			"ORDER_CHANGED" : orderChanged,			
			"ORDER_NAME_WIDTH" : order_name_disp_width,
			"ORDER_DETAILS_WIDTH" : order_detail_disp_width,
			"CELL_WIDTH": (order_name_disp_width+order_detail_disp_width),
			"SHOW_RELATED_HX_IND" : model.get("SHOW_RELATED_HX_IND"),
			"RELATED_FROM_HX_ORDER_NAME" : model.get("RELATED_FROM_HX_ORDER_NAME"),
			"RELATED_FROM_HX_CONTINUE_IND" : model.get("RELATED_FROM_HX_CONTINUE_IND"),
			"RELATED_FROM_HX_ORDER_DETAILS" : model.get("RELATED_FROM_HX_SIMPLE_DISP")
		}));

		return el;
	},
	selectAction : function(ev) {
		var targetNode, model = this.model, keep_flag = "";
		if(ev.currentTarget) {
			targetNode = ev.currentTarget;
			targetNode.checked = true;
			if($(targetNode).hasClass("keep")) {
				keep_flag = "K";
			} else if($(targetNode).hasClass("modify")) {
				keep_flag = "M";
			} else if($(targetNode).hasClass("suspend")) {
				keep_flag = "P";
			} else if($(targetNode).hasClass("stop")) {
				keep_flag = "S";
			} else if($(targetNode).hasClass("restart")) {
				keep_flag = "R";
			}

			model.setAction(keep_flag, targetNode.checked);
		}
	},
	unselectAction : function(ev) {
		var targetNode, model = this.model;
		if(ev.currentTarget) {
			targetNode = ev.currentTarget;
			targetNode.checked = false;
			model.setAction("", targetNode.checked);
		}
	},
	activeRow : function(ev) {
		var targetNode, model = this.model;
		if(ev.currentTarget) {
			targetNode = ev.currentTarget;
			$(targetNode).addClass("active-row");
		}
	},
	unactiveRow : function(ev) {
		var targetNode, model = this.model;
		if(ev.currentTarget) {
			targetNode = ev.currentTarget;
			$(targetNode).removeClass("active-row");
		}
	},
	/**
	 * Render View HTML
	 * @returns {PageFooterView} this view
	 */
	render : function() {
		var el = this.el;
		//remove all tr
		this.$("td").detach();

		this.view = this.createOrderView();
		if(this.saved) {
			this.view = this.createOrderSaveView();
		} else if(this.signed) {
			this.view = this.createOrderSignView();
		} else {
			this.view = this.createOrderActionView();
		}
		return this;
	},
	setViewCSS : function(addClass, removeClass) {
		$(this.el).addClass(addClass);
		$(this.el).removeClass(removeClass);
	},
	hideView : function() {
		var model = this.model;
		var el = this.el;
		$(this.el).addClass("hidden");
	},
	showView : function() {
		$(this.el).removeClass("hidden");
	},
	triggerSelectAction : function(action, select) {
		// not a hidden row
		if(!$(this.el).hasClass("hidden")){
			action = action.toLowerCase();
			var actionNode = $("." + action, this.el);
			if($(actionNode).attr("checked") != select) {
				if(select == true) {
					$(actionNode).trigger("click");
				} else {
					$(actionNode).trigger("dblclick");
				}
			}
		}
	},
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function() {
		this.model.unbind("destroy", this.removeView, this);
		this.view = null;
		$(this.el).empty().remove();
	}
});
/**
 * Preferences View
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,doT,PreferenceModel
 */
var PageFooterView = Backbone.View.extend({
	tagName: "div",	
	
	className: "page-footer",
	
	signTemplate : doT.template($("#SignTemplate").html()),
	
	saveTemplate : doT.template($("#SaveTemplate").html()),
	
	savesignTemplate : doT.template($("#SaveSignTemplate").html()),
	
	allowOrdersSign: false,
	/**
	 * Event handlers
	 */
	events:{
		"click input.button-save" : "saveOrderables",
		"click input.button-sign" : "signOrderables"
	},
	/**
	 * Initialize View.  Creates subviews.  Renders on PreferenceModel "load" event followed by OrderableModel "load" event.
	 */
	initialize : function() {
		var self = this;
		
		_.bindAll(this);
				
		this.preferenceModel = this.options.preferenceModel;
		this.orderableModel  = this.options.orderableModel;
		this.patientDemographicModel = this.options.patientDemographicModel;
		
		this.collection.bind("change",function(){
			self.render();			
		});
		
		this.collection.bind("destroy",this.removeView,this);
		
	},
	orderableSelected: function(){
		
	},
	/**
	 * creates sign view
	 */
	createSignView : function(){	
	  	var el = this.el;	
	  	$(el).html(this.signTemplate(this.preferenceModel.toJSON()));
      	return el;
	},
	/**
	 * creates save view
	 */
	createSaveView : function(){
		var el = this.el;		
		$(el).html(this.saveTemplate(this.preferenceModel.toJSON()));
		return el;
	},
	/**
	 * creates save/sign view
	 */
	createSaveSignView : function(){	
		var el = this.el;	
	  	$(el).html(this.savesignTemplate(this.preferenceModel.toJSON()));
      	return el;
	},
	/**
	 * Render View HTML
	 * @returns {PageFooterView} this view
	 */
	render : function() {
		var el = this.el,event_id,group_id,origin_encntr_id;		
		//remove all div
		this.$("div").detach();	
		
		advsr_event_id		= this.collection.advsr_event_id;
		group_id 			= this.collection.advsr_group_id;
		origin_encntr_id 	= this.collection.origin_encntr_id;
		svd_loc             = this.collection.svd_location_cd;
		cur_loc             = this.model.get("LOC_CD");
		temp_loc            = this.model.get("TEMP_LOC_CD");
		
		if (parseFloat(origin_encntr_id) !=  parseFloat(Criterion.encntr_id) ){
			if (this.collection.advsr_event_id > 0){
				this.view = this.createSignView();
			}
			else{
				this.view = this.createSaveView();
			}
		} else {
			if (this.collection.getSaveSignViewInd() == 1){
				this.view = this.createSaveSignView();
			}
			else{
				this.view = this.createSaveView();
			}
		}
		
		if (this.collection.loc_selected_idx == 0){
			$(".button-sign",el).attr("disabled","disabled");
			$(".button-save",el).attr("disabled","disabled");				
		}
		else{
			if ($(".button-sign",el).attr("disabled") == "diabled"){
				$(".button-sign",el).removeAttr("disabled");
			}
			if ($(".button-save",el).attr("disabled") == "diabled"){
				$(".button-save",el).removeAttr("disabled");
			}
		}
		return this;
	},
	
	saveOrderables: function(){
		this.collection.initiateSave();
	},
	
	signOrderables : function(){
		this.collection.initiateSign(null);
	},
	
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function(){
		this.collection.unbind("destroy",this.removeView,this);
		this.signView = null;
		this.saveView = null;
		$(this.el).empty().remove();
	}
});/**
 * PageHeaderView View
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,doT,PreferenceModel,ComponentView,orderableCollection
 */
var PageHeaderView = Backbone.View.extend({
	tagName: "div",	
	
	className: "page-header",
	
	template : doT.template($("#PageHeaderTemplate").html()),
	/**
	 * Event handlers
	 */
	events:{
		"click a.toggle-components-display" : "toggleComponentsDisplay",
		"click a.toggle-med-orders-display" : "toggleMedOrdersDisplay"
	},
	
	/**
	 * Initialize View.  Creates subviews.  Renders on PatientCollection's "change:timeInterval" event.
	 */
	initialize : function() {
		_.bindAll(this);
		
	
		this.componentViews = this.options.componentViews;
		
		this.preferenceModel = this.options.preferenceModel;
		
		this.preferenceModel.bind("change",this.render);
		
		this.preferenceModel.bind("destroy",this.removeView,this);
		
	},
	orderableSelected: function(){
		
	},
	/**
	 * creates the view
	 */
	createView : function(){	
	  var el = this.el;	
	  $(el).html(this.template(this.preferenceModel.toJSON()));
      return el;
	},
	
	/**
	 * Render View HTML
	 * @returns {PageHeaderView} this view
	 */
	render : function() {
		var el = this.el;		
		//remove all div
		this.$("div").detach();	
		
		this.view = this.createView();	

		return this;
	},
	toggleComponentsDisplay : function(ev){
		var targetNode,componentViews = this.componentViews,hideComponent = true;
		if(ev.currentTarget && !_.isEmpty(componentViews)){
			targetNode = ev.currentTarget;
			//Components already hidden
			if($(targetNode).hasClass("hidden-components")){
				hideComponent = false;
				$(targetNode).html("Collapse All");
				$(targetNode).attr("title","Click to collapse all components...");
			}
			else{
				hideComponent = true;
				$(targetNode).html("Expand All");
				$(targetNode).attr("title","Click to expand all components...");
			}
			$(targetNode).toggleClass("hidden-components")
			_.each(componentViews,function(componentview){
				if(componentview.isHidden() != hideComponent){
					componentview.toggleComponentDisplay();
				}
			});
		}
	},
	toggleMedOrdersDisplay : function(ev){
		var targetNode,orderableCollection = this.collection;
		if(ev.currentTarget && !_.isEmpty(orderableCollection)){
			targetNode = ev.currentTarget;
			// Meds order already shown
			if($(targetNode).hasClass("show-med-orders")){
				$(targetNode).html("Show Meds Only");
				$(targetNode).attr("title","Click to show medication orders only...");
				orderableCollection.showAllOrders();
			}
			else{
				$(targetNode).html("Show All");
				$(targetNode).attr("title","Click to show all orders...");
				orderableCollection.showMedicationOrders();
			}
			$(targetNode).toggleClass("show-med-orders")
		}
	},
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function(){
		this.preferenceModel.unbind("destroy",this.removeView,this);
		this.signView = null;
		this.saveView = null;
		$(this.el).empty().remove();
	}
});/**
 * Patient Demographic View
 * @author RB018070
 * @requires Backbone,Underscore,jQuery,doT,model
 */
var PatientDemographicView = Backbone.View.extend({
	tagName: "div",	
	
	className: "",
	
	template : doT.template($("#PatientDemographicTemplate").html()),
	
	
	/**
	 * Initialize View.  Creates subviews.  Renders on PatientCollection's "change:timeInterval" event.
	 */
	initialize : function() {
		_.bindAll(this);
		
		this.preferenceModel = this.options.preferenceModel;
		
		this.model.bind("change",this.render);
		
		this.model.bind("destroy",this.removeView,this);
		
	},
	orderableSelected: function(){
		
	},
	/**
	 * creates the view
	 */
	createView : function(){	
	  var el = this.el;	
	  $(el).html(this.template(this.model.toJSON()));
      return el;
	},
	
	/**
	 * Render View HTML
	 * @returns {PatientDemographicView} this view
	 */
	render : function() {
		var el = this.el;		
		//remove all div
		this.$("div").detach();	
		
			this.view = this.createView();
			$("#modified-orders-message").html(
				["* Order Details were modified after this MPage was saved.  New order details will display in the Order Window after the \"",
						this.preferenceModel.get("SIGNBUTTONDISPLAY")
						,"\" button has been clicked."].join(""))	
		//Preference set to hide demographic banner bar
		if(this.preferenceModel.get("DEMOGBANNERIND") === 0){
			$(this.el).hide();		
		}
		
		return this;
	},
	
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function(){
		
		this.model.unbind("destroy",this.removeView,this);
		this.signView = null;
		this.saveView = null;
		$(this.el).empty().remove();
	}
});/**
 * Entry point for MPage.  Bootstrapper for objects.
 */
function init() {
	Criterion.unloadParams();
	
	//Declare Models/Collections
	var preferenceModel = new PreferenceModel()
		,patientDemographicModel = new PatientDemographicModel()
		,locationsModel = new LocationsModel()
		,orderableCollection = new OrderableCollection()
		,allOrderables
		,homeMedsOrderableCollection
		,unscheduledOrderableCollection 
		,scheduledOrderablCollection
		,prnOrderableCollection
		,inactiveOrderableCollection
		,savedOrderableCollection
		,signedOrderableCollection;
	
	//Declare Views
	var  pageHeaderView,
	patientDemographicView,
	locationsView,
	pageFooterView,
	componentViews = [],
	homeMedsComponentView,
	scheduledOrderablesComponentView,
	unscheduledOrderablesComponentView,
	prnOrderablesComponentView,
	inactiveOrderablesComponentView,
	savedOrderablesComponentView,
	signedOrderablesComponentView;
	
	//Define Views	
	pageHeaderView = new PageHeaderView({
		"preferenceModel"	:preferenceModel,
		"componentViews"	:componentViews,
		"collection"		:orderableCollection
	});
	patientDemographicView = new PatientDemographicView({
		"model" 			:patientDemographicModel,
		"preferenceModel"	:preferenceModel
	});
	locationsView = new LocationsView({
		"model" 			:locationsModel
	});
	pageFooterView = new PageFooterView({
		"preferenceModel"	:preferenceModel,
		"model" 			:patientDemographicModel,
		"collection"		:orderableCollection
	});
		 
	//attach the page header view to the DOM
	$(pageHeaderView.el).appendTo($('.ps-hd'));
		
	//attach the patient demographic view to the DOM
	$(patientDemographicView.el).appendTo($('.dmg-pt-banner'));
	
	$(locationsView.el).appendTo($('.divLocations'));
	
	//attach the page footer view to the DOM
	$(pageFooterView.el).appendTo($('.ps-footer'));
		
	// On orderable collection load, build page view
	orderableCollection.bind("change", function() {
		var advsr_event_id 		= orderableCollection.advsr_event_id
			,origin_encntr_id 	= orderableCollection.origin_encntr_id
			,origin_facility_cd	= orderableCollection.origin_facility_cd
			,cur_facility_cd    = orderableCollection.cur_facility_cd
			,origin_location_cd = orderableCollection.origin_location_cd
			,cur_location_cd    = orderableCollection.cur_location_cd
			,my_facility_cd 	= patientDemographicModel.get("FAC_CD")
			,my_location_cd 	= patientDemographicModel.get("LOC_CD");
			
		
		allOrderables					= orderableCollection.allOrderables
		homeMedsOrderableCollection     = new OrderableSubCollection(orderableCollection.homeMedOrderables);
		scheduledOrderablCollection		= new OrderableSubCollection(orderableCollection.scheduledOrderables);
		unscheduledOrderableCollection 	= new OrderableSubCollection(orderableCollection.unscheduledOrderables);
		prnOrderableCollection 			= new OrderableSubCollection(orderableCollection.prnOrderables);
		inactiveOrderableCollection		= new OrderableSubCollection(orderableCollection.inactiveOrderables);
		
		// Any orderable found
		if(allOrderables.length > 0 ){			
			if(homeMedsOrderableCollection.models.length > 0){
				homeMedsComponentView = new ComponentView({
					"collection": homeMedsOrderableCollection,
					"model":{
						"ID":"SCH",
						"TITLE":"Home Medications"
					},
					"preferenceModel": preferenceModel
				});	
				// hide home meds by default
				$(homeMedsComponentView.el).hide();		
				$(homeMedsComponentView.el).appendTo($('.ps-body'));	
				componentViews.push(homeMedsComponentView);			
			}
			
			if(scheduledOrderablCollection.models.length > 0){
				scheduledOrderablesComponentView = new ComponentView({
					"collection": scheduledOrderablCollection,
					"model":{
						"ID":"SCH",
						"TITLE":"Scheduled Orders"
					},
					"preferenceModel": preferenceModel
				});			
				$(scheduledOrderablesComponentView.el).appendTo($('.ps-body'));	
				componentViews.push(scheduledOrderablesComponentView);			
			}
			
			if(unscheduledOrderableCollection.models.length > 0){
				unscheduledOrderablesComponentView = new ComponentView({
					"collection": unscheduledOrderableCollection,
					"model":{
						"ID":"UNS",
						"TITLE":"Unscheduled Orders"
					},
					"preferenceModel": preferenceModel
				});			
				$(unscheduledOrderablesComponentView.el).appendTo($('.ps-body'));
				componentViews.push(unscheduledOrderablesComponentView);			
			}
			
			if(prnOrderableCollection.models.length > 0){
				prnOrderablesComponentView = new ComponentView({
					"collection": prnOrderableCollection,
					"model":{
						"ID":"PRN",
						"TITLE":"PRN Orders"
					},
					"preferenceModel": preferenceModel
				});			
				$(prnOrderablesComponentView.el).appendTo($('.ps-body'));	
				componentViews.push(prnOrderablesComponentView);	
			}
			
			if(inactiveOrderableCollection.models.length > 0){
				inactiveOrderablesComponentView = new ComponentView({
					"collection": inactiveOrderableCollection,
					"model":{
						"ID":"INACTIVE",
						"TITLE":"Inactive Orders"
					},
					"preferenceModel": preferenceModel
				});			
				$(inactiveOrderablesComponentView.el).appendTo($('.ps-body'));	
				componentViews.push(inactiveOrderablesComponentView);
			}
			// trigger for initial selections
			locationsModel.trigger("location-change");
		}
		// no orderables found => display message
		else{			
			$('<span class="gen-cent-msg">No orders found.</span>').appendTo($('.ps-body'));
			$(".toggle-med-orders-display").css('visibility','hidden');
			$(".toggle-components-display").css('visibility','hidden');
			locationsView.removeView();
			pageFooterView.removeView();
		}
	});
	
	// On orderable collection Save, Hide all components and display saved orderables component
	orderableCollection.bind("save", function() { 		
		// Remove all component views
		pageFooterView.removeView();
		_.each(componentViews,function(componentView){
			componentView.removeView();
		});
		componentView = [];
		savedOrderableCollection = new OrderableSubCollection(orderableCollection.getActionedOrderables());
		//destroy any existing views in the collection
		savedOrderableCollection.destroyViews();
		// Add saved orderables component view
		savedOrderablesComponentView = new ComponentView({
			"collection": savedOrderableCollection,
			"model":{
				"ID":"SVD",
				"TITLE":"Saved Orders"
			},
			"preferenceModel": preferenceModel,
			"saved":true
		});	
		$(savedOrderablesComponentView.el).appendTo($('.ps-body'));
		componentViews.push(savedOrderablesComponentView);
	});
	
	// On orderable collection Sign, Hide all components and display signed orderables component
	orderableCollection.bind("sign", function() { 		
		// Remove all component views
		pageFooterView.removeView();
		_.each(componentViews,function(componentView){
			componentView.removeView();
		});
		componentView = [];
		signedOrderableCollection = new OrderableSubCollection(orderableCollection.getActionedOrderables());
		//destroy any existing views in the collection
		signedOrderableCollection.destroyViews();
		// Add signed orderables component view
		signedOrderablesComponentView = new ComponentView({
				"collection": signedOrderableCollection,
				"model":{
					"ID":"SGN",
					"TITLE":"Signed Orders"
				},
				"preferenceModel": preferenceModel,
				"signed":true
			});	
			$(signedOrderablesComponentView.el).appendTo($('.ps-body'));
			componentViews.push(signedOrderablesComponentView);
	});
	
	orderableCollection.setDemographicModel(patientDemographicModel);
	
	orderableCollection.setLocationsModel(locationsModel);
		
	orderableCollection.setPreferenceModel(preferenceModel);
	
	// On preference change, retrieve orderables from CCL 
	preferenceModel.bind("change", function() {
		// query CCL for demographic banner
		patientDemographicModel.retrieve();
	});
	
	patientDemographicModel.bind("change", function() {
		//query CCL for Locations
		locationsModel.retrieve();
	});
	
	locationsModel.bind("change", function() {
		//query CCL for Orders
		orderableCollection.retrieve();
	});
	
	// Set Same Encounter Flag when Location Box Change occurs
	locationsModel.bind("location-change",function(){
		var idx = document.getElementById("selLocList").selectedIndex;
		var val = document.getElementById("selLocList")[idx].value;
		locationsModel.set({"SAME_ENC_LOCATION":parseInt(val,10)},{
			"silent": true
		})
		orderableCollection.setLocationIdx(idx);
		orderableCollection.setSaveSignViewInd(val);

		// disable selections until a valid location is picked
		if (idx == 0){
			orderableCollection.toggleHomeMedOrders(homeMedsComponentView,false);
			$('input:radio').attr("disabled","disabled");
			$(".button-sign",this.el).attr("disabled","disabled");
			$(".button-save",this.el).attr("disabled","disabled");	
			$("#selLocList").addClass("required-select");
		}
		else{
			orderableCollection.updateHomeMedOrdersDisplay(val,homeMedsComponentView);
			$("#selLocList").removeClass("required-select");
			$("input:radio.unavailable").attr("disabled","disabled");
			$("input:radio.unavailable").attr("title","Order Action not available.");
  			$("input:radio.avail").removeAttr("disabled");
  			$("input:radio.avail").attr("title","");
  			// on a new encounter => disable suspend 
			if (val == 0){
				$("input:radio.suspend").attr("disabled","disabled").each(function(){
					this.checked = false;
					$(this).trigger("click");
					this.title = "Suspend not an available action.";
				});
				$("td.suspend").attr("title","Suspend action not available due to patient destination.")
			}
			else{
				$("td.suspend").attr("title","Click to Suspend All")
			}
			pageFooterView.render();
		}
	});
		
	//query CCL for preferences
	preferenceModel.retrieve();
	
	//Garbage collection on unload
	$(window).unload(function(){
		preferenceModel.destroy();	
		patientDemographicModel.destroy();		
		orderableCollection.destroy();
		locationsModel.destroy();
	});
}

$(document).ready(function() {
	init();
});
