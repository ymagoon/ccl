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
/* jQuery UI - v1.9.1 - 2012-10-25
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.slider.js, jquery.ui.sortable.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */
(function(e,t){function i(t,n){var r,i,o,u=t.nodeName.toLowerCase();
return"area"===u?(r=t.parentNode,i=r.name,!t.href||!i||r.nodeName.toLowerCase()!=="map"?!1:(o=e("img[usemap=#"+i+"]")[0],!!o&&s(o))):(/input|select|textarea|button|object/.test(u)?!t.disabled:"a"===u?t.href||n:n)&&s(t);
}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().andSelf().filter(function(){return e.css(this,"visibility")==="hidden";
}).length;
}var n=0,r=/^ui-id-\d+$/;
e.ui=e.ui||{};
if(e.ui.version){return;
}e.extend(e.ui,{version:"1.9.1",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({_focus:e.fn.focus,focus:function(t,n){return typeof t=="number"?this.each(function(){var r=this;
setTimeout(function(){e(r).focus(),n&&n.call(r);
},t);
}):this._focus.apply(this,arguments);
},scrollParent:function(){var t;
return e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?t=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"));
}).eq(0):t=this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"));
}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t;
},zIndex:function(n){if(n!==t){return this.css("zIndex",n);
}if(this.length){var r=e(this[0]),i,s;
while(r.length&&r[0]!==document){i=r.css("position");
if(i==="absolute"||i==="relative"||i==="fixed"){s=parseInt(r.css("zIndex"),10);
if(!isNaN(s)&&s!==0){return s;
}}r=r.parent();
}}return 0;
},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n);
});
},removeUniqueId:function(){return this.each(function(){r.test(this.id)&&e(this).removeAttr("id");
});
}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(n,r){function u(t,n,r,s){return e.each(i,function(){n-=parseFloat(e.css(t,"padding"+this))||0,r&&(n-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(n-=parseFloat(e.css(t,"margin"+this))||0);
}),n;
}var i=r==="Width"?["Left","Right"]:["Top","Bottom"],s=r.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};
e.fn["inner"+r]=function(n){return n===t?o["inner"+r].call(this):this.each(function(){e(this).css(s,u(this,n)+"px");
});
},e.fn["outer"+r]=function(t,n){return typeof t!="number"?o["outer"+r].call(this,t):this.each(function(){e(this).css(s,u(this,t,!0,n)+"px");
});
};
}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return !!e.data(n,t);
};
}):function(t,n,r){return !!e.data(t,r[3]);
},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")));
},tabbable:function(t){var n=e.attr(t,"tabindex"),r=isNaN(n);
return(r||n>=0)&&i(t,!r);
}}),e(function(){var t=document.body,n=t.appendChild(n=document.createElement("div"));
n.offsetHeight,e.extend(n.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),e.support.minHeight=n.offsetHeight===100,e.support.selectstart="onselectstart" in n,t.removeChild(n).style.display="none";
}),function(){var t=/msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];
e.ui.ie=t.length?!0:!1,e.ui.ie6=parseFloat(t[1],10)===6;
}(),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault();
});
},enableSelection:function(){return this.unbind(".ui-disableSelection");
}}),e.extend(e.ui,{plugin:{add:function(t,n,r){var i,s=e.ui[t].prototype;
for(i in r){s.plugins[i]=s.plugins[i]||[],s.plugins[i].push([n,r[i]]);
}},call:function(e,t,n){var r,i=e.plugins[t];
if(!i||!e.element[0].parentNode||e.element[0].parentNode.nodeType===11){return;
}for(r=0;
r<i.length;
r++){e.options[i[r][0]]&&i[r][1].apply(e.element,n);
}}},contains:e.contains,hasScroll:function(t,n){if(e(t).css("overflow")==="hidden"){return !1;
}var r=n&&n==="left"?"scrollLeft":"scrollTop",i=!1;
return t[r]>0?!0:(t[r]=1,i=t[r]>0,t[r]=0,i);
},isOverAxis:function(e,t,n){return e>t&&e<t+n;
},isOver:function(t,n,r,i,s,o){return e.ui.isOverAxis(t,r,s)&&e.ui.isOverAxis(n,i,o);
}});
})(jQuery);
(function(e,t){var n=0,r=Array.prototype.slice,i=e.cleanData;
e.cleanData=function(t){for(var n=0,r;
(r=t[n])!=null;
n++){try{e(r).triggerHandler("remove");
}catch(s){}}i(t);
},e.widget=function(t,n,r){var i,s,o,u,a=t.split(".")[0];
t=t.split(".")[1],i=a+"-"+t,r||(r=n,n=e.Widget),e.expr[":"][i.toLowerCase()]=function(t){return !!e.data(t,i);
},e[a]=e[a]||{},s=e[a][t],o=e[a][t]=function(e,t){if(!this._createWidget){return new o(e,t);
}arguments.length&&this._createWidget(e,t);
},e.extend(o,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),u=new n,u.options=e.widget.extend({},u.options),e.each(r,function(t,i){e.isFunction(i)&&(r[t]=function(){var e=function(){return n.prototype[t].apply(this,arguments);
},r=function(e){return n.prototype[t].apply(this,e);
};
return function(){var t=this._super,n=this._superApply,s;
return this._super=e,this._superApply=r,s=i.apply(this,arguments),this._super=t,this._superApply=n,s;
};
}());
}),o.prototype=e.widget.extend(u,{widgetEventPrefix:u.widgetEventPrefix||t},r,{constructor:o,namespace:a,widgetName:t,widgetBaseClass:i,widgetFullName:i}),s?(e.each(s._childConstructors,function(t,n){var r=n.prototype;
e.widget(r.namespace+"."+r.widgetName,o,n._proto);
}),delete s._childConstructors):n._childConstructors.push(o),e.widget.bridge(t,o);
},e.widget.extend=function(n){var i=r.call(arguments,1),s=0,o=i.length,u,a;
for(;
s<o;
s++){for(u in i[s]){a=i[s][u],i[s].hasOwnProperty(u)&&a!==t&&(e.isPlainObject(a)?n[u]=e.isPlainObject(n[u])?e.widget.extend({},n[u],a):e.widget.extend({},a):n[u]=a);
}}return n;
},e.widget.bridge=function(n,i){var s=i.prototype.widgetFullName;
e.fn[n]=function(o){var u=typeof o=="string",a=r.call(arguments,1),f=this;
return o=!u&&a.length?e.widget.extend.apply(null,[o].concat(a)):o,u?this.each(function(){var r,i=e.data(this,s);
if(!i){return e.error("cannot call methods on "+n+" prior to initialization; attempted to call method '"+o+"'");
}if(!e.isFunction(i[o])||o.charAt(0)==="_"){return e.error("no such method '"+o+"' for "+n+" widget instance");
}r=i[o].apply(i,a);
if(r!==i&&r!==t){return f=r&&r.jquery?f.pushStack(r.get()):r,!1;
}}):this.each(function(){var t=e.data(this,s);
t?t.option(o||{})._init():new i(o,this);
}),f;
};
},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=n++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),r!==this&&(e.data(r,this.widgetName,this),e.data(r,this.widgetFullName,this),this._on(this.element,{remove:function(e){e.target===r&&this.destroy();
}}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init();
},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus");
},_destroy:e.noop,widget:function(){return this.element;
},option:function(n,r){var i=n,s,o,u;
if(arguments.length===0){return e.widget.extend({},this.options);
}if(typeof n=="string"){i={},s=n.split("."),n=s.shift();
if(s.length){o=i[n]=e.widget.extend({},this.options[n]);
for(u=0;
u<s.length-1;
u++){o[s[u]]=o[s[u]]||{},o=o[s[u]];
}n=s.pop();
if(r===t){return o[n]===t?null:o[n];
}o[n]=r;
}else{if(r===t){return this.options[n]===t?null:this.options[n];
}i[n]=r;
}}return this._setOptions(i),this;
},_setOptions:function(e){var t;
for(t in e){this._setOption(t,e[t]);
}return this;
},_setOption:function(e,t){return this.options[e]=t,e==="disabled"&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this;
},enable:function(){return this._setOption("disabled",!1);
},disable:function(){return this._setOption("disabled",!0);
},_on:function(t,n){var r,i=this;
n?(t=r=e(t),this.bindings=this.bindings.add(t)):(n=t,t=this.element,r=this.widget()),e.each(n,function(n,s){function o(){if(i.options.disabled===!0||e(this).hasClass("ui-state-disabled")){return;
}return(typeof s=="string"?i[s]:s).apply(i,arguments);
}typeof s!="string"&&(o.guid=s.guid=s.guid||o.guid||e.guid++);
var u=n.match(/^(\w+)\s*(.*)$/),a=u[1]+i.eventNamespace,f=u[2];
f?r.delegate(f,a,o):t.bind(a,o);
});
},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t);
},_delay:function(e,t){function n(){return(typeof e=="string"?r[e]:e).apply(r,arguments);
}var r=this;
return setTimeout(n,t||0);
},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover");
},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover");
}});
},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus");
},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus");
}});
},_trigger:function(t,n,r){var i,s,o=this.options[t];
r=r||{},n=e.Event(n),n.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],s=n.originalEvent;
if(s){for(i in s){i in n||(n[i]=s[i]);
}}return this.element.trigger(n,r),!(e.isFunction(o)&&o.apply(this.element[0],[n].concat(r))===!1||n.isDefaultPrevented());
}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,n){e.Widget.prototype["_"+t]=function(r,i,s){typeof i=="string"&&(i={effect:i});
var o,u=i?i===!0||typeof i=="number"?n:i.effect||n:t;
i=i||{},typeof i=="number"&&(i={duration:i}),o=!e.isEmptyObject(i),i.complete=s,i.delay&&r.delay(i.delay),o&&e.effects&&(e.effects.effect[u]||e.uiBackCompat!==!1&&e.effects[u])?r[t](i):u!==t&&r[u]?r[u](i.duration,i.easing,s):r.queue(function(n){e(this)[t](),s&&s.call(r[0]),n();
});
};
}),e.uiBackCompat!==!1&&(e.Widget.prototype._getCreateOptions=function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName];
});
})(jQuery);
(function(e,t){var n=!1;
e(document).mouseup(function(e){n=!1;
}),e.widget("ui.mouse",{version:"1.9.1",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;
this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e);
}).bind("click."+this.widgetName,function(n){if(!0===e.data(n.target,t.widgetName+".preventClickEvent")){return e.removeData(n.target,t.widgetName+".preventClickEvent"),n.stopImmediatePropagation(),!1;
}}),this.started=!1;
},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
},_mouseDown:function(t){if(n){return;
}this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;
var r=this,i=t.which===1,s=typeof this.options.cancel=="string"&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;
if(!i||s||!this._mouseCapture(t)){return !0;
}this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){r.mouseDelayMet=!0;
},this.options.delay));
if(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)){this._mouseStarted=this._mouseStart(t)!==!1;
if(!this._mouseStarted){return t.preventDefault(),!0;
}}return !0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return r._mouseMove(e);
},this._mouseUpDelegate=function(e){return r._mouseUp(e);
},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),n=!0,!0;
},_mouseMove:function(t){return !e.ui.ie||document.documentMode>=9||!!t.button?this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted):this._mouseUp(t);
},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1;
},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance;
},_mouseDelayMet:function(e){return this.mouseDelayMet;
},_mouseStart:function(e){},_mouseDrag:function(e){},_mouseStop:function(e){},_mouseCapture:function(e){return !0;
}});
})(jQuery);
(function(e,t){function h(e,t,n){return[parseInt(e[0],10)*(l.test(e[0])?t/100:1),parseInt(e[1],10)*(l.test(e[1])?n/100:1)];
}function p(t,n){return parseInt(e.css(t,n),10)||0;
}e.ui=e.ui||{};
var n,r=Math.max,i=Math.abs,s=Math.round,o=/left|center|right/,u=/top|center|bottom/,a=/[\+\-]\d+%?/,f=/^\w+/,l=/%$/,c=e.fn.position;
e.position={scrollbarWidth:function(){if(n!==t){return n;
}var r,i,s=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];
return e("body").append(s),r=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,r===i&&(i=s[0].clientWidth),s.remove(),n=r-i;
},getScrollInfo:function(t){var n=t.isWindow?"":t.element.css("overflow-x"),r=t.isWindow?"":t.element.css("overflow-y"),i=n==="scroll"||n==="auto"&&t.width<t.element[0].scrollWidth,s=r==="scroll"||r==="auto"&&t.height<t.element[0].scrollHeight;
return{width:i?e.position.scrollbarWidth():0,height:s?e.position.scrollbarWidth():0};
},getWithinInfo:function(t){var n=e(t||window),r=e.isWindow(n[0]);
return{element:n,isWindow:r,offset:n.offset()||{left:0,top:0},scrollLeft:n.scrollLeft(),scrollTop:n.scrollTop(),width:r?n.width():n.outerWidth(),height:r?n.height():n.outerHeight()};
}},e.fn.position=function(t){if(!t||!t.of){return c.apply(this,arguments);
}t=e.extend({},t);
var n,l,d,v,m,g=e(t.of),y=e.position.getWithinInfo(t.within),b=e.position.getScrollInfo(y),w=g[0],E=(t.collision||"flip").split(" "),S={};
return w.nodeType===9?(l=g.width(),d=g.height(),v={top:0,left:0}):e.isWindow(w)?(l=g.width(),d=g.height(),v={top:g.scrollTop(),left:g.scrollLeft()}):w.preventDefault?(t.at="left top",l=d=0,v={top:w.pageY,left:w.pageX}):(l=g.outerWidth(),d=g.outerHeight(),v=g.offset()),m=e.extend({},v),e.each(["my","at"],function(){var e=(t[this]||"").split(" "),n,r;
e.length===1&&(e=o.test(e[0])?e.concat(["center"]):u.test(e[0])?["center"].concat(e):["center","center"]),e[0]=o.test(e[0])?e[0]:"center",e[1]=u.test(e[1])?e[1]:"center",n=a.exec(e[0]),r=a.exec(e[1]),S[this]=[n?n[0]:0,r?r[0]:0],t[this]=[f.exec(e[0])[0],f.exec(e[1])[0]];
}),E.length===1&&(E[1]=E[0]),t.at[0]==="right"?m.left+=l:t.at[0]==="center"&&(m.left+=l/2),t.at[1]==="bottom"?m.top+=d:t.at[1]==="center"&&(m.top+=d/2),n=h(S.at,l,d),m.left+=n[0],m.top+=n[1],this.each(function(){var o,u,a=e(this),f=a.outerWidth(),c=a.outerHeight(),w=p(this,"marginLeft"),x=p(this,"marginTop"),T=f+w+p(this,"marginRight")+b.width,N=c+x+p(this,"marginBottom")+b.height,C=e.extend({},m),k=h(S.my,a.outerWidth(),a.outerHeight());
t.my[0]==="right"?C.left-=f:t.my[0]==="center"&&(C.left-=f/2),t.my[1]==="bottom"?C.top-=c:t.my[1]==="center"&&(C.top-=c/2),C.left+=k[0],C.top+=k[1],e.support.offsetFractions||(C.left=s(C.left),C.top=s(C.top)),o={marginLeft:w,marginTop:x},e.each(["left","top"],function(r,i){e.ui.position[E[r]]&&e.ui.position[E[r]][i](C,{targetWidth:l,targetHeight:d,elemWidth:f,elemHeight:c,collisionPosition:o,collisionWidth:T,collisionHeight:N,offset:[n[0]+k[0],n[1]+k[1]],my:t.my,at:t.at,within:y,elem:a});
}),e.fn.bgiframe&&a.bgiframe(),t.using&&(u=function(e){var n=v.left-C.left,s=n+l-f,o=v.top-C.top,u=o+d-c,h={target:{element:g,left:v.left,top:v.top,width:l,height:d},element:{element:a,left:C.left,top:C.top,width:f,height:c},horizontal:s<0?"left":n>0?"right":"center",vertical:u<0?"top":o>0?"bottom":"middle"};
l<f&&i(n+s)<l&&(h.horizontal="center"),d<c&&i(o+u)<d&&(h.vertical="middle"),r(i(n),i(s))>r(i(o),i(u))?h.important="horizontal":h.important="vertical",t.using.call(this,e,h);
}),a.offset(e.extend(C,{using:u}));
});
},e.ui.position={fit:{left:function(e,t){var n=t.within,i=n.isWindow?n.scrollLeft:n.offset.left,s=n.width,o=e.left-t.collisionPosition.marginLeft,u=i-o,a=o+t.collisionWidth-s-i,f;
t.collisionWidth>s?u>0&&a<=0?(f=e.left+u+t.collisionWidth-s-i,e.left+=u-f):a>0&&u<=0?e.left=i:u>a?e.left=i+s-t.collisionWidth:e.left=i:u>0?e.left+=u:a>0?e.left-=a:e.left=r(e.left-o,e.left);
},top:function(e,t){var n=t.within,i=n.isWindow?n.scrollTop:n.offset.top,s=t.within.height,o=e.top-t.collisionPosition.marginTop,u=i-o,a=o+t.collisionHeight-s-i,f;
t.collisionHeight>s?u>0&&a<=0?(f=e.top+u+t.collisionHeight-s-i,e.top+=u-f):a>0&&u<=0?e.top=i:u>a?e.top=i+s-t.collisionHeight:e.top=i:u>0?e.top+=u:a>0?e.top-=a:e.top=r(e.top-o,e.top);
}},flip:{left:function(e,t){var n=t.within,r=n.offset.left+n.scrollLeft,s=n.width,o=n.isWindow?n.scrollLeft:n.offset.left,u=e.left-t.collisionPosition.marginLeft,a=u-o,f=u+t.collisionWidth-s-o,l=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,c=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,h=-2*t.offset[0],p,d;
if(a<0){p=e.left+l+c+h+t.collisionWidth-s-r;
if(p<0||p<i(a)){e.left+=l+c+h;
}}else{if(f>0){d=e.left-t.collisionPosition.marginLeft+l+c+h-o;
if(d>0||i(d)<f){e.left+=l+c+h;
}}}},top:function(e,t){var n=t.within,r=n.offset.top+n.scrollTop,s=n.height,o=n.isWindow?n.scrollTop:n.offset.top,u=e.top-t.collisionPosition.marginTop,a=u-o,f=u+t.collisionHeight-s-o,l=t.my[1]==="top",c=l?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,h=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,p=-2*t.offset[1],d,v;
a<0?(v=e.top+c+h+p+t.collisionHeight-s-r,e.top+c+h+p>a&&(v<0||v<i(a))&&(e.top+=c+h+p)):f>0&&(d=e.top-t.collisionPosition.marginTop+c+h+p-o,e.top+c+h+p>f&&(d>0||i(d)<f)&&(e.top+=c+h+p));
}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments);
},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments);
}}},function(){var t,n,r,i,s,o=document.getElementsByTagName("body")[0],u=document.createElement("div");
t=document.createElement(o?"div":"body"),r={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&e.extend(r,{position:"absolute",left:"-1000px",top:"-1000px"});
for(s in r){t.style[s]=r[s];
}t.appendChild(u),n=o||document.documentElement,n.insertBefore(t,n.firstChild),u.style.cssText="position: absolute; left: 10.7432222px;",i=e(u).offset().left,e.support.offsetFractions=i>10&&i<11,t.innerHTML="",n.removeChild(t);
}(),e.uiBackCompat!==!1&&function(e){var n=e.fn.position;
e.fn.position=function(r){if(!r||!r.offset){return n.call(this,r);
}var i=r.offset.split(" "),s=r.at.split(" ");
return i.length===1&&(i[1]=i[0]),/^\d/.test(i[0])&&(i[0]="+"+i[0]),/^\d/.test(i[1])&&(i[1]="+"+i[1]),s.length===1&&(/left|center|right/.test(s[0])?s[1]="center":(s[1]=s[0],s[0]="center")),n.call(this,e.extend(r,{at:s[0]+i[0]+" "+s[1]+i[1],offset:t}));
};
}(jQuery);
})(jQuery);
(function(e,t){var n=0,r={},i={};
r.height=r.paddingTop=r.paddingBottom=r.borderTopWidth=r.borderBottomWidth="hide",i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="show",e.widget("ui.accordion",{version:"1.9.1",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var t=this.accordionId="ui-accordion-"+(this.element.attr("id")||++n),r=this.options;
this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset"),this.headers=this.element.find(r.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this._hoverable(this.headers),this._focusable(this.headers),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide(),!r.collapsible&&(r.active===!1||r.active==null)&&(r.active=0),r.active<0&&(r.active+=this.headers.length),this.active=this._findActive(r.active).addClass("ui-accordion-header-active ui-state-active").toggleClass("ui-corner-all ui-corner-top"),this.active.next().addClass("ui-accordion-content-active").show(),this._createIcons(),this.refresh(),this.element.attr("role","tablist"),this.headers.attr("role","tab").each(function(n){var r=e(this),i=r.attr("id"),s=r.next(),o=s.attr("id");
i||(i=t+"-header-"+n,r.attr("id",i)),o||(o=t+"-panel-"+n,s.attr("id",o)),r.attr("aria-controls",o),s.attr("aria-labelledby",i);
}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._on(this.headers,{keydown:"_keydown"}),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._setupEvents(r.event);
},_getCreateEventData:function(){return{header:this.active,content:this.active.length?this.active.next():e()};
},_createIcons:function(){var t=this.options.icons;
t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"));
},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove();
},_destroy:function(){var e;
this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id");
}),this._destroyIcons(),e=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id");
}),this.options.heightStyle!=="content"&&e.css("height","");
},_setOption:function(e,t){if(e==="active"){this._activate(t);
return;
}e==="event"&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),e==="collapsible"&&!t&&this.options.active===!1&&this._activate(0),e==="icons"&&(this._destroyIcons(),t&&this._createIcons()),e==="disabled"&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t);
},_keydown:function(t){if(t.altKey||t.ctrlKey){return;
}var n=e.ui.keyCode,r=this.headers.length,i=this.headers.index(t.target),s=!1;
switch(t.keyCode){case n.RIGHT:case n.DOWN:s=this.headers[(i+1)%r];
break;
case n.LEFT:case n.UP:s=this.headers[(i-1+r)%r];
break;
case n.SPACE:case n.ENTER:this._eventHandler(t);
break;
case n.HOME:s=this.headers[0];
break;
case n.END:s=this.headers[r-1];
}s&&(e(t.target).attr("tabIndex",-1),e(s).attr("tabIndex",0),s.focus(),t.preventDefault());
},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus();
},refresh:function(){var t,n,r=this.options.heightStyle,i=this.element.parent();
r==="fill"?(e.support.minHeight||(n=i.css("overflow"),i.css("overflow","hidden")),t=i.height(),this.element.siblings(":visible").each(function(){var n=e(this),r=n.css("position");
if(r==="absolute"||r==="fixed"){return;
}t-=n.outerHeight(!0);
}),n&&i.css("overflow",n),this.headers.each(function(){t-=e(this).outerHeight(!0);
}),this.headers.next().each(function(){e(this).height(Math.max(0,t-e(this).innerHeight()+e(this).height()));
}).css("overflow","auto")):r==="auto"&&(t=0,this.headers.next().each(function(){t=Math.max(t,e(this).height("").height());
}).height(t));
},_activate:function(t){var n=this._findActive(t)[0];
if(n===this.active[0]){return;
}n=n||this.active[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop});
},_findActive:function(t){return typeof t=="number"?this.headers.eq(t):e();
},_setupEvents:function(t){var n={};
if(!t){return;
}e.each(t.split(" "),function(e,t){n[t]="_eventHandler";
}),this._on(this.headers,n);
},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i[0]===r[0],o=s&&n.collapsible,u=o?e():i.next(),a=r.next(),f={oldHeader:r,oldPanel:a,newHeader:o?e():i,newPanel:u};
t.preventDefault();
if(s&&!n.collapsible||this._trigger("beforeActivate",t,f)===!1){return;
}n.active=o?!1:this.headers.index(i),this.active=s?e():i,this._toggle(f),r.removeClass("ui-accordion-header-active ui-state-active"),n.icons&&r.children(".ui-accordion-header-icon").removeClass(n.icons.activeHeader).addClass(n.icons.header),s||(i.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),n.icons&&i.children(".ui-accordion-header-icon").removeClass(n.icons.header).addClass(n.icons.activeHeader),i.next().addClass("ui-accordion-content-active"));
},_toggle:function(t){var n=t.newPanel,r=this.prevShow.length?this.prevShow:t.oldPanel;
this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=n,this.prevHide=r,this.options.animate?this._animate(n,r,t):(r.hide(),n.show(),this._toggleComplete(t)),r.attr({"aria-expanded":"false","aria-hidden":"true"}),r.prev().attr("aria-selected","false"),n.length&&r.length?r.prev().attr("tabIndex",-1):n.length&&this.headers.filter(function(){return e(this).attr("tabIndex")===0;
}).attr("tabIndex",-1),n.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0});
},_animate:function(e,t,n){var s,o,u,a=this,f=0,l=e.length&&(!t.length||e.index()<t.index()),c=this.options.animate||{},h=l&&c.down||c,p=function(){a._toggleComplete(n);
};
typeof h=="number"&&(u=h),typeof h=="string"&&(o=h),o=o||h.easing||c.easing,u=u||h.duration||c.duration;
if(!t.length){return e.animate(i,u,o,p);
}if(!e.length){return t.animate(r,u,o,p);
}s=e.show().outerHeight(),t.animate(r,{duration:u,easing:o,step:function(e,t){t.now=Math.round(e);
}}),e.hide().animate(i,{duration:u,easing:o,complete:p,step:function(e,n){n.now=Math.round(e),n.prop!=="height"?f+=n.now:a.options.heightStyle!=="content"&&(n.now=Math.round(s-t.outerHeight()-f),f=0);
}});
},_toggleComplete:function(e){var t=e.oldPanel;
t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e);
}}),e.uiBackCompat!==!1&&(function(e,t){e.extend(t.options,{navigation:!1,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase();
}});
var n=t._create;
t._create=function(){if(this.options.navigation){var t=this,r=this.element.find(this.options.header),i=r.next(),s=r.add(i).find("a").filter(this.options.navigationFilter)[0];
s&&r.add(i).each(function(n){if(e.contains(this,s)){return t.options.active=Math.floor(n/2),!1;
}});
}n.call(this);
};
}(jQuery,jQuery.ui.accordion.prototype),function(e,t){e.extend(t.options,{heightStyle:null,autoHeight:!0,clearStyle:!1,fillSpace:!1});
var n=t._create,r=t._setOption;
e.extend(t,{_create:function(){this.options.heightStyle=this.options.heightStyle||this._mergeHeightStyle(),n.call(this);
},_setOption:function(e){if(e==="autoHeight"||e==="clearStyle"||e==="fillSpace"){this.options.heightStyle=this._mergeHeightStyle();
}r.apply(this,arguments);
},_mergeHeightStyle:function(){var e=this.options;
if(e.fillSpace){return"fill";
}if(e.clearStyle){return"content";
}if(e.autoHeight){return"auto";
}}});
}(jQuery,jQuery.ui.accordion.prototype),function(e,t){e.extend(t.options.icons,{activeHeader:null,headerSelected:"ui-icon-triangle-1-s"});
var n=t._createIcons;
t._createIcons=function(){this.options.icons&&(this.options.icons.activeHeader=this.options.icons.activeHeader||this.options.icons.headerSelected),n.call(this);
};
}(jQuery,jQuery.ui.accordion.prototype),function(e,t){t.activate=t._activate;
var n=t._findActive;
t._findActive=function(e){return e===-1&&(e=!1),e&&typeof e!="number"&&(e=this.headers.index(this.headers.filter(e)),e===-1&&(e=!1)),n.call(this,e);
};
}(jQuery,jQuery.ui.accordion.prototype),jQuery.ui.accordion.prototype.resize=jQuery.ui.accordion.prototype.refresh,function(e,t){e.extend(t.options,{change:null,changestart:null});
var n=t._trigger;
t._trigger=function(e,t,r){var i=n.apply(this,arguments);
return i?(e==="beforeActivate"?i=n.call(this,"changestart",t,{oldHeader:r.oldHeader,oldContent:r.oldPanel,newHeader:r.newHeader,newContent:r.newPanel}):e==="activate"&&(i=n.call(this,"change",t,{oldHeader:r.oldHeader,oldContent:r.oldPanel,newHeader:r.newHeader,newContent:r.newPanel})),i):!1;
};
}(jQuery,jQuery.ui.accordion.prototype),function(e,t){e.extend(t.options,{animate:null,animated:"slide"});
var n=t._create;
t._create=function(){var e=this.options;
e.animate===null&&(e.animated?e.animated==="slide"?e.animate=300:e.animated==="bounceslide"?e.animate={duration:200,down:{easing:"easeOutBounce",duration:1000}}:e.animate=e.animated:e.animate=!1),n.call(this);
};
}(jQuery,jQuery.ui.accordion.prototype));
})(jQuery);
(function(e,t){var n=0;
e.widget("ui.autocomplete",{version:"1.9.1",defaultElement:"<input>",options:{appendTo:"body",autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var t,n,r;
this.isMultiLine=this._isMultiLine(),this.valueMethod=this.element[this.element.is("input,textarea")?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(i){if(this.element.prop("readOnly")){t=!0,r=!0,n=!0;
return;
}t=!1,r=!1,n=!1;
var s=e.ui.keyCode;
switch(i.keyCode){case s.PAGE_UP:t=!0,this._move("previousPage",i);
break;
case s.PAGE_DOWN:t=!0,this._move("nextPage",i);
break;
case s.UP:t=!0,this._keyEvent("previous",i);
break;
case s.DOWN:t=!0,this._keyEvent("next",i);
break;
case s.ENTER:case s.NUMPAD_ENTER:this.menu.active&&(t=!0,i.preventDefault(),this.menu.select(i));
break;
case s.TAB:this.menu.active&&this.menu.select(i);
break;
case s.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(i),i.preventDefault());
break;
default:n=!0,this._searchTimeout(i);
}},keypress:function(r){if(t){t=!1,r.preventDefault();
return;
}if(n){return;
}var i=e.ui.keyCode;
switch(r.keyCode){case i.PAGE_UP:this._move("previousPage",r);
break;
case i.PAGE_DOWN:this._move("nextPage",r);
break;
case i.UP:this._keyEvent("previous",r);
break;
case i.DOWN:this._keyEvent("next",r);
}},input:function(e){if(r){r=!1,e.preventDefault();
return;
}this._searchTimeout(e);
},focus:function(){this.selectedItem=null,this.previous=this._value();
},blur:function(e){if(this.cancelBlur){delete this.cancelBlur;
return;
}clearTimeout(this.searching),this.close(e),this._change(e);
}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete").appendTo(this.document.find(this.options.appendTo||"body")[0]).menu({input:e(),role:null}).zIndex(this.element.zIndex()+1).hide().data("menu"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur;
});
var n=this.menu.element[0];
e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;
this.document.one("mousedown",function(r){r.target!==t.element[0]&&r.target!==n&&!e.contains(n,r.target)&&t.close();
});
});
},menufocus:function(t,n){if(this.isNewMenu){this.isNewMenu=!1;
if(t.originalEvent&&/^mouse/.test(t.originalEvent.type)){this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent);
});
return;
}}var r=n.item.data("ui-autocomplete-item")||n.item.data("item.autocomplete");
!1!==this._trigger("focus",t,{item:r})?t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(r.value):this.liveRegion.text(r.value);
},menuselect:function(e,t){var n=t.item.data("ui-autocomplete-item")||t.item.data("item.autocomplete"),r=this.previous;
this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=r,this._delay(function(){this.previous=r,this.selectedItem=n;
})),!1!==this._trigger("select",e,{item:n})&&this._value(n.value),this.term=this._value(),this.close(e),this.selectedItem=n;
}}),this.liveRegion=e("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertAfter(this.element),e.fn.bgiframe&&this.menu.element.bgiframe(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete");
}});
},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove();
},_setOption:function(e,t){this._super(e,t),e==="source"&&this._initSource(),e==="appendTo"&&this.menu.element.appendTo(this.document.find(t||"body")[0]),e==="disabled"&&t&&this.xhr&&this.xhr.abort();
},_isMultiLine:function(){return this.element.is("textarea")?!0:this.element.is("input")?!1:this.element.prop("isContentEditable");
},_initSource:function(){var t,n,r=this;
e.isArray(this.options.source)?(t=this.options.source,this.source=function(n,r){r(e.ui.autocomplete.filter(t,n.term));
}):typeof this.options.source=="string"?(n=this.options.source,this.source=function(t,i){r.xhr&&r.xhr.abort(),r.xhr=e.ajax({url:n,data:t,dataType:"json",success:function(e){i(e);
},error:function(){i([]);
}});
}):this.source=this.options.source;
},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,e));
},this.options.delay);
},search:function(e,t){e=e!=null?e:this._value(),this.term=this._value();
if(e.length<this.options.minLength){return this.close(t);
}if(this._trigger("search",t)===!1){return;
}return this._search(e);
},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response());
},_response:function(){var e=this,t=++n;
return function(r){t===n&&e.__response(r),e.pending--,e.pending||e.element.removeClass("ui-autocomplete-loading");
};
},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close();
},close:function(e){this.cancelSearch=!0,this._close(e);
},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e));
},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem});
},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return typeof t=="string"?{label:t,value:t}:e.extend({label:t.label||t.value,value:t.value||t.label},t);
});
},_suggest:function(t){var n=this.menu.element.empty().zIndex(this.element.zIndex()+1);
this._renderMenu(n,t),this.menu.refresh(),n.show(),this._resizeMenu(),n.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next();
},_resizeMenu:function(){var e=this.menu.element;
e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()));
},_renderMenu:function(t,n){var r=this;
e.each(n,function(e,n){r._renderItemData(t,n);
});
},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t);
},_renderItem:function(t,n){return e("<li>").append(e("<a>").text(n.label)).appendTo(t);
},_move:function(e,t){if(!this.menu.element.is(":visible")){this.search(null,t);
return;
}if(this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)){this._value(this.term),this.menu.blur();
return;
}this.menu[e](t);
},widget:function(){return this.menu.element;
},_value:function(){return this.valueMethod.apply(this.element,arguments);
},_keyEvent:function(e,t){if(!this.isMultiLine||this.menu.element.is(":visible")){this._move(e,t),t.preventDefault();
}}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");
},filter:function(t,n){var r=new RegExp(e.ui.autocomplete.escapeRegex(n),"i");
return e.grep(t,function(e){return r.test(e.label||e.value||e);
});
}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate.";
}}},__response:function(e){var t;
this._superApply(arguments);
if(this.options.disabled||this.cancelSearch){return;
}e&&e.length?t=this.options.messages.results(e.length):t=this.options.messages.noResults,this.liveRegion.text(t);
}});
})(jQuery);
(function(e,t){var n,r,i,s,o="ui-button ui-widget ui-state-default ui-corner-all",u="ui-state-hover ui-state-active ",a="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",f=function(){var t=e(this).find(":ui-button");
setTimeout(function(){t.button("refresh");
},1);
},l=function(t){var n=t.name,r=t.form,i=e([]);
return n&&(r?i=e(r).find("[name='"+n+"']"):i=e("[name='"+n+"']",t.ownerDocument).filter(function(){return !this.form;
})),i;
};
e.widget("ui.button",{version:"1.9.1",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,f),typeof this.options.disabled!="boolean"?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");
var t=this,u=this.options,a=this.type==="checkbox"||this.type==="radio",c="ui-state-hover"+(a?"":" ui-state-active"),h="ui-state-focus";
u.label===null&&(u.label=this.type==="input"?this.buttonElement.val():this.buttonElement.html()),this.buttonElement.addClass(o).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){if(u.disabled){return;
}e(this).addClass("ui-state-hover"),this===n&&e(this).addClass("ui-state-active");
}).bind("mouseleave"+this.eventNamespace,function(){if(u.disabled){return;
}e(this).removeClass(c);
}).bind("click"+this.eventNamespace,function(e){u.disabled&&(e.preventDefault(),e.stopImmediatePropagation());
}),this.element.bind("focus"+this.eventNamespace,function(){t.buttonElement.addClass(h);
}).bind("blur"+this.eventNamespace,function(){t.buttonElement.removeClass(h);
}),a&&(this.element.bind("change"+this.eventNamespace,function(){if(s){return;
}t.refresh();
}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(e){if(u.disabled){return;
}s=!1,r=e.pageX,i=e.pageY;
}).bind("mouseup"+this.eventNamespace,function(e){if(u.disabled){return;
}if(r!==e.pageX||i!==e.pageY){s=!0;
}})),this.type==="checkbox"?this.buttonElement.bind("click"+this.eventNamespace,function(){if(u.disabled||s){return !1;
}e(this).toggleClass("ui-state-active"),t.buttonElement.attr("aria-pressed",t.element[0].checked);
}):this.type==="radio"?this.buttonElement.bind("click"+this.eventNamespace,function(){if(u.disabled||s){return !1;
}e(this).addClass("ui-state-active"),t.buttonElement.attr("aria-pressed","true");
var n=t.element[0];
l(n).not(n).map(function(){return e(this).button("widget")[0];
}).removeClass("ui-state-active").attr("aria-pressed","false");
}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){if(u.disabled){return !1;
}e(this).addClass("ui-state-active"),n=this,t.document.one("mouseup",function(){n=null;
});
}).bind("mouseup"+this.eventNamespace,function(){if(u.disabled){return !1;
}e(this).removeClass("ui-state-active");
}).bind("keydown"+this.eventNamespace,function(t){if(u.disabled){return !1;
}(t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active");
}).bind("keyup"+this.eventNamespace,function(){e(this).removeClass("ui-state-active");
}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click();
})),this._setOption("disabled",u.disabled),this._resetButton();
},_determineButtonType:function(){var e,t,n;
this.element.is("[type=checkbox]")?this.type="checkbox":this.element.is("[type=radio]")?this.type="radio":this.element.is("input")?this.type="input":this.type="button",this.type==="checkbox"||this.type==="radio"?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),n=this.element.is(":checked"),n&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",n)):this.buttonElement=this.element;
},widget:function(){return this.buttonElement;
},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(o+" "+u+" "+a).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title");
},_setOption:function(e,t){this._super(e,t);
if(e==="disabled"){t?this.element.prop("disabled",!0):this.element.prop("disabled",!1);
return;
}this._resetButton();
},refresh:function(){var t=this.element.is(":disabled")||this.element.hasClass("ui-button-disabled");
t!==this.options.disabled&&this._setOption("disabled",t),this.type==="radio"?l(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false");
}):this.type==="checkbox"&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"));
},_resetButton:function(){if(this.type==="input"){this.options.label&&this.element.val(this.options.label);
return;
}var t=this.buttonElement.removeClass(a),n=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),r=this.options.icons,i=r.primary&&r.secondary,s=[];
r.primary||r.secondary?(this.options.text&&s.push("ui-button-text-icon"+(i?"s":r.primary?"-primary":"-secondary")),r.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+r.primary+"'></span>"),r.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+r.secondary+"'></span>"),this.options.text||(s.push(i?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(n)))):s.push("ui-button-text-only"),t.addClass(s.join(" "));
}}),e.widget("ui.buttonset",{version:"1.9.1",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset");
},_init:function(){this.refresh();
},_setOption:function(e,t){e==="disabled"&&this.buttons.button("option",e,t),this._super(e,t);
},refresh:function(){var t=this.element.css("direction")==="rtl";
this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return e(this).button("widget")[0];
}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end();
},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0];
}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
}});
})(jQuery);
(function($,undefined){function Datepicker(){this.debug=!1,this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},$.extend(this._defaults,this.regional[""]),this.dpDiv=bindHover($('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
}function bindHover(e){var t="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
return e.delegate(t,"mouseout",function(){$(this).removeClass("ui-state-hover"),this.className.indexOf("ui-datepicker-prev")!=-1&&$(this).removeClass("ui-datepicker-prev-hover"),this.className.indexOf("ui-datepicker-next")!=-1&&$(this).removeClass("ui-datepicker-next-hover");
}).delegate(t,"mouseover",function(){$.datepicker._isDisabledDatepicker(instActive.inline?e.parent()[0]:instActive.input[0])||($(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),$(this).addClass("ui-state-hover"),this.className.indexOf("ui-datepicker-prev")!=-1&&$(this).addClass("ui-datepicker-prev-hover"),this.className.indexOf("ui-datepicker-next")!=-1&&$(this).addClass("ui-datepicker-next-hover"));
});
}function extendRemove(e,t){$.extend(e,t);
for(var n in t){if(t[n]==null||t[n]==undefined){e[n]=t[n];
}}return e;
}$.extend($.ui,{datepicker:{version:"1.9.1"}});
var PROP_NAME="datepicker",dpuuid=(new Date).getTime(),instActive;
$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){this.debug&&console.log.apply("",arguments);
},_widgetDatepicker:function(){return this.dpDiv;
},setDefaults:function(e){return extendRemove(this._defaults,e||{}),this;
},_attachDatepicker:function(target,settings){var inlineSettings=null;
for(var attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);
if(attrValue){inlineSettings=inlineSettings||{};
try{inlineSettings[attrName]=eval(attrValue);
}catch(err){inlineSettings[attrName]=attrValue;
}}}var nodeName=target.nodeName.toLowerCase(),inline=nodeName=="div"||nodeName=="span";
target.id||(this.uuid+=1,target.id="dp"+this.uuid);
var inst=this._newInst($(target),inline);
inst.settings=$.extend({},settings||{},inlineSettings||{}),nodeName=="input"?this._connectDatepicker(target,inst):inline&&this._inlineDatepicker(target,inst);
},_newInst:function(e,t){var n=e[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");
return{id:n,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:t,dpDiv:t?bindHover($('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')):this.dpDiv};
},_connectDatepicker:function(e,t){var n=$(e);
t.append=$([]),t.trigger=$([]);
if(n.hasClass(this.markerClassName)){return;
}this._attachments(n,t),n.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(e,n,r){t.settings[n]=r;
}).bind("getData.datepicker",function(e,n){return this._get(t,n);
}),this._autoSize(t),$.data(e,PROP_NAME,t),t.settings.disabled&&this._disableDatepicker(e);
},_attachments:function(e,t){var n=this._get(t,"appendText"),r=this._get(t,"isRTL");
t.append&&t.append.remove(),n&&(t.append=$('<span class="'+this._appendClass+'">'+n+"</span>"),e[r?"before":"after"](t.append)),e.unbind("focus",this._showDatepicker),t.trigger&&t.trigger.remove();
var i=this._get(t,"showOn");
(i=="focus"||i=="both")&&e.focus(this._showDatepicker);
if(i=="button"||i=="both"){var s=this._get(t,"buttonText"),o=this._get(t,"buttonImage");
t.trigger=$(this._get(t,"buttonImageOnly")?$("<img/>").addClass(this._triggerClass).attr({src:o,alt:s,title:s}):$('<button type="button"></button>').addClass(this._triggerClass).html(o==""?s:$("<img/>").attr({src:o,alt:s,title:s}))),e[r?"before":"after"](t.trigger),t.trigger.click(function(){return $.datepicker._datepickerShowing&&$.datepicker._lastInput==e[0]?$.datepicker._hideDatepicker():$.datepicker._datepickerShowing&&$.datepicker._lastInput!=e[0]?($.datepicker._hideDatepicker(),$.datepicker._showDatepicker(e[0])):$.datepicker._showDatepicker(e[0]),!1;
});
}},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t=new Date(2009,11,20),n=this._get(e,"dateFormat");
if(n.match(/[DM]/)){var r=function(e){var t=0,n=0;
for(var r=0;
r<e.length;
r++){e[r].length>t&&(t=e[r].length,n=r);
}return n;
};
t.setMonth(r(this._get(e,n.match(/MM/)?"monthNames":"monthNamesShort"))),t.setDate(r(this._get(e,n.match(/DD/)?"dayNames":"dayNamesShort"))+20-t.getDay());
}e.input.attr("size",this._formatDate(e,t).length);
}},_inlineDatepicker:function(e,t){var n=$(e);
if(n.hasClass(this.markerClassName)){return;
}n.addClass(this.markerClassName).append(t.dpDiv).bind("setData.datepicker",function(e,n,r){t.settings[n]=r;
}).bind("getData.datepicker",function(e,n){return this._get(t,n);
}),$.data(e,PROP_NAME,t),this._setDate(t,this._getDefaultDate(t),!0),this._updateDatepicker(t),this._updateAlternate(t),t.settings.disabled&&this._disableDatepicker(e),t.dpDiv.css("display","block");
},_dialogDatepicker:function(e,t,n,r,i){var s=this._dialogInst;
if(!s){this.uuid+=1;
var o="dp"+this.uuid;
this._dialogInput=$('<input type="text" id="'+o+'" style="position: absolute; top: -100px; width: 0px;"/>'),this._dialogInput.keydown(this._doKeyDown),$("body").append(this._dialogInput),s=this._dialogInst=this._newInst(this._dialogInput,!1),s.settings={},$.data(this._dialogInput[0],PROP_NAME,s);
}extendRemove(s.settings,r||{}),t=t&&t.constructor==Date?this._formatDate(s,t):t,this._dialogInput.val(t),this._pos=i?i.length?i:[i.pageX,i.pageY]:null;
if(!this._pos){var u=document.documentElement.clientWidth,a=document.documentElement.clientHeight,f=document.documentElement.scrollLeft||document.body.scrollLeft,l=document.documentElement.scrollTop||document.body.scrollTop;
this._pos=[u/2-100+f,a/2-150+l];
}return this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),s.settings.onSelect=n,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),$.blockUI&&$.blockUI(this.dpDiv),$.data(this._dialogInput[0],PROP_NAME,s),this;
},_destroyDatepicker:function(e){var t=$(e),n=$.data(e,PROP_NAME);
if(!t.hasClass(this.markerClassName)){return;
}var r=e.nodeName.toLowerCase();
$.removeData(e,PROP_NAME),r=="input"?(n.append.remove(),n.trigger.remove(),t.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):(r=="div"||r=="span")&&t.removeClass(this.markerClassName).empty();
},_enableDatepicker:function(e){var t=$(e),n=$.data(e,PROP_NAME);
if(!t.hasClass(this.markerClassName)){return;
}var r=e.nodeName.toLowerCase();
if(r=="input"){e.disabled=!1,n.trigger.filter("button").each(function(){this.disabled=!1;
}).end().filter("img").css({opacity:"1.0",cursor:""});
}else{if(r=="div"||r=="span"){var i=t.children("."+this._inlineClass);
i.children().removeClass("ui-state-disabled"),i.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1);
}}this._disabledInputs=$.map(this._disabledInputs,function(t){return t==e?null:t;
});
},_disableDatepicker:function(e){var t=$(e),n=$.data(e,PROP_NAME);
if(!t.hasClass(this.markerClassName)){return;
}var r=e.nodeName.toLowerCase();
if(r=="input"){e.disabled=!0,n.trigger.filter("button").each(function(){this.disabled=!0;
}).end().filter("img").css({opacity:"0.5",cursor:"default"});
}else{if(r=="div"||r=="span"){var i=t.children("."+this._inlineClass);
i.children().addClass("ui-state-disabled"),i.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0);
}}this._disabledInputs=$.map(this._disabledInputs,function(t){return t==e?null:t;
}),this._disabledInputs[this._disabledInputs.length]=e;
},_isDisabledDatepicker:function(e){if(!e){return !1;
}for(var t=0;
t<this._disabledInputs.length;
t++){if(this._disabledInputs[t]==e){return !0;
}}return !1;
},_getInst:function(e){try{return $.data(e,PROP_NAME);
}catch(t){throw"Missing instance data for this datepicker";
}},_optionDatepicker:function(e,t,n){var r=this._getInst(e);
if(arguments.length==2&&typeof t=="string"){return t=="defaults"?$.extend({},$.datepicker._defaults):r?t=="all"?$.extend({},r.settings):this._get(r,t):null;
}var i=t||{};
typeof t=="string"&&(i={},i[t]=n);
if(r){this._curInst==r&&this._hideDatepicker();
var s=this._getDateDatepicker(e,!0),o=this._getMinMaxDate(r,"min"),u=this._getMinMaxDate(r,"max");
extendRemove(r.settings,i),o!==null&&i.dateFormat!==undefined&&i.minDate===undefined&&(r.settings.minDate=this._formatDate(r,o)),u!==null&&i.dateFormat!==undefined&&i.maxDate===undefined&&(r.settings.maxDate=this._formatDate(r,u)),this._attachments($(e),r),this._autoSize(r),this._setDate(r,s),this._updateAlternate(r),this._updateDatepicker(r);
}},_changeDatepicker:function(e,t,n){this._optionDatepicker(e,t,n);
},_refreshDatepicker:function(e){var t=this._getInst(e);
t&&this._updateDatepicker(t);
},_setDateDatepicker:function(e,t){var n=this._getInst(e);
n&&(this._setDate(n,t),this._updateDatepicker(n),this._updateAlternate(n));
},_getDateDatepicker:function(e,t){var n=this._getInst(e);
return n&&!n.inline&&this._setDateFromField(n,t),n?this._getDate(n):null;
},_doKeyDown:function(e){var t=$.datepicker._getInst(e.target),n=!0,r=t.dpDiv.is(".ui-datepicker-rtl");
t._keyEvent=!0;
if($.datepicker._datepickerShowing){switch(e.keyCode){case 9:$.datepicker._hideDatepicker(),n=!1;
break;
case 13:var i=$("td."+$.datepicker._dayOverClass+":not(."+$.datepicker._currentClass+")",t.dpDiv);
i[0]&&$.datepicker._selectDay(e.target,t.selectedMonth,t.selectedYear,i[0]);
var s=$.datepicker._get(t,"onSelect");
if(s){var o=$.datepicker._formatDate(t);
s.apply(t.input?t.input[0]:null,[o,t]);
}else{$.datepicker._hideDatepicker();
}return !1;
case 27:$.datepicker._hideDatepicker();
break;
case 33:$.datepicker._adjustDate(e.target,e.ctrlKey?-$.datepicker._get(t,"stepBigMonths"):-$.datepicker._get(t,"stepMonths"),"M");
break;
case 34:$.datepicker._adjustDate(e.target,e.ctrlKey?+$.datepicker._get(t,"stepBigMonths"):+$.datepicker._get(t,"stepMonths"),"M");
break;
case 35:(e.ctrlKey||e.metaKey)&&$.datepicker._clearDate(e.target),n=e.ctrlKey||e.metaKey;
break;
case 36:(e.ctrlKey||e.metaKey)&&$.datepicker._gotoToday(e.target),n=e.ctrlKey||e.metaKey;
break;
case 37:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,r?1:-1,"D"),n=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&$.datepicker._adjustDate(e.target,e.ctrlKey?-$.datepicker._get(t,"stepBigMonths"):-$.datepicker._get(t,"stepMonths"),"M");
break;
case 38:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,-7,"D"),n=e.ctrlKey||e.metaKey;
break;
case 39:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,r?-1:1,"D"),n=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&$.datepicker._adjustDate(e.target,e.ctrlKey?+$.datepicker._get(t,"stepBigMonths"):+$.datepicker._get(t,"stepMonths"),"M");
break;
case 40:(e.ctrlKey||e.metaKey)&&$.datepicker._adjustDate(e.target,7,"D"),n=e.ctrlKey||e.metaKey;
break;
default:n=!1;
}}else{e.keyCode==36&&e.ctrlKey?$.datepicker._showDatepicker(this):n=!1;
}n&&(e.preventDefault(),e.stopPropagation());
},_doKeyPress:function(e){var t=$.datepicker._getInst(e.target);
if($.datepicker._get(t,"constrainInput")){var n=$.datepicker._possibleChars($.datepicker._get(t,"dateFormat")),r=String.fromCharCode(e.charCode==undefined?e.keyCode:e.charCode);
return e.ctrlKey||e.metaKey||r<" "||!n||n.indexOf(r)>-1;
}},_doKeyUp:function(e){var t=$.datepicker._getInst(e.target);
if(t.input.val()!=t.lastVal){try{var n=$.datepicker.parseDate($.datepicker._get(t,"dateFormat"),t.input?t.input.val():null,$.datepicker._getFormatConfig(t));
n&&($.datepicker._setDateFromField(t),$.datepicker._updateAlternate(t),$.datepicker._updateDatepicker(t));
}catch(r){$.datepicker.log(r);
}}return !0;
},_showDatepicker:function(e){e=e.target||e,e.nodeName.toLowerCase()!="input"&&(e=$("input",e.parentNode)[0]);
if($.datepicker._isDisabledDatepicker(e)||$.datepicker._lastInput==e){return;
}var t=$.datepicker._getInst(e);
$.datepicker._curInst&&$.datepicker._curInst!=t&&($.datepicker._curInst.dpDiv.stop(!0,!0),t&&$.datepicker._datepickerShowing&&$.datepicker._hideDatepicker($.datepicker._curInst.input[0]));
var n=$.datepicker._get(t,"beforeShow"),r=n?n.apply(e,[e,t]):{};
if(r===!1){return;
}extendRemove(t.settings,r),t.lastVal=null,$.datepicker._lastInput=e,$.datepicker._setDateFromField(t),$.datepicker._inDialog&&(e.value=""),$.datepicker._pos||($.datepicker._pos=$.datepicker._findPos(e),$.datepicker._pos[1]+=e.offsetHeight);
var i=!1;
$(e).parents().each(function(){return i|=$(this).css("position")=="fixed",!i;
});
var s={left:$.datepicker._pos[0],top:$.datepicker._pos[1]};
$.datepicker._pos=null,t.dpDiv.empty(),t.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),$.datepicker._updateDatepicker(t),s=$.datepicker._checkOffset(t,s,i),t.dpDiv.css({position:$.datepicker._inDialog&&$.blockUI?"static":i?"fixed":"absolute",display:"none",left:s.left+"px",top:s.top+"px"});
if(!t.inline){var o=$.datepicker._get(t,"showAnim"),u=$.datepicker._get(t,"duration"),a=function(){var e=t.dpDiv.find("iframe.ui-datepicker-cover");
if(!!e.length){var n=$.datepicker._getBorders(t.dpDiv);
e.css({left:-n[0],top:-n[1],width:t.dpDiv.outerWidth(),height:t.dpDiv.outerHeight()});
}};
t.dpDiv.zIndex($(e).zIndex()+1),$.datepicker._datepickerShowing=!0,$.effects&&($.effects.effect[o]||$.effects[o])?t.dpDiv.show(o,$.datepicker._get(t,"showOptions"),u,a):t.dpDiv[o||"show"](o?u:null,a),(!o||!u)&&a(),t.input.is(":visible")&&!t.input.is(":disabled")&&t.input.focus(),$.datepicker._curInst=t;
}},_updateDatepicker:function(e){this.maxRows=4;
var t=$.datepicker._getBorders(e.dpDiv);
instActive=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e);
var n=e.dpDiv.find("iframe.ui-datepicker-cover");
!n.length||n.css({left:-t[0],top:-t[1],width:e.dpDiv.outerWidth(),height:e.dpDiv.outerHeight()}),e.dpDiv.find("."+this._dayOverClass+" a").mouseover();
var r=this._getNumberOfMonths(e),i=r[1],s=17;
e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),i>1&&e.dpDiv.addClass("ui-datepicker-multi-"+i).css("width",s*i+"em"),e.dpDiv[(r[0]!=1||r[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e==$.datepicker._curInst&&$.datepicker._datepickerShowing&&e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&e.input[0]!=document.activeElement&&e.input.focus();
if(e.yearshtml){var o=e.yearshtml;
setTimeout(function(){o===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),o=e.yearshtml=null;
},0);
}},_getBorders:function(e){var t=function(e){return{thin:1,medium:2,thick:3}[e]||e;
};
return[parseFloat(t(e.css("border-left-width"))),parseFloat(t(e.css("border-top-width")))];
},_checkOffset:function(e,t,n){var r=e.dpDiv.outerWidth(),i=e.dpDiv.outerHeight(),s=e.input?e.input.outerWidth():0,o=e.input?e.input.outerHeight():0,u=document.documentElement.clientWidth+(n?0:$(document).scrollLeft()),a=document.documentElement.clientHeight+(n?0:$(document).scrollTop());
return t.left-=this._get(e,"isRTL")?r-s:0,t.left-=n&&t.left==e.input.offset().left?$(document).scrollLeft():0,t.top-=n&&t.top==e.input.offset().top+o?$(document).scrollTop():0,t.left-=Math.min(t.left,t.left+r>u&&u>r?Math.abs(t.left+r-u):0),t.top-=Math.min(t.top,t.top+i>a&&a>i?Math.abs(i+o):0),t;
},_findPos:function(e){var t=this._getInst(e),n=this._get(t,"isRTL");
while(e&&(e.type=="hidden"||e.nodeType!=1||$.expr.filters.hidden(e))){e=e[n?"previousSibling":"nextSibling"];
}var r=$(e).offset();
return[r.left,r.top];
},_hideDatepicker:function(e){var t=this._curInst;
if(!t||e&&t!=$.data(e,PROP_NAME)){return;
}if(this._datepickerShowing){var n=this._get(t,"showAnim"),r=this._get(t,"duration"),i=function(){$.datepicker._tidyDialog(t);
};
$.effects&&($.effects.effect[n]||$.effects[n])?t.dpDiv.hide(n,$.datepicker._get(t,"showOptions"),r,i):t.dpDiv[n=="slideDown"?"slideUp":n=="fadeIn"?"fadeOut":"hide"](n?r:null,i),n||i(),this._datepickerShowing=!1;
var s=this._get(t,"onClose");
s&&s.apply(t.input?t.input[0]:null,[t.input?t.input.val():"",t]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),$.blockUI&&($.unblockUI(),$("body").append(this.dpDiv))),this._inDialog=!1;
}},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
},_checkExternalClick:function(e){if(!$.datepicker._curInst){return;
}var t=$(e.target),n=$.datepicker._getInst(t[0]);
(t[0].id!=$.datepicker._mainDivId&&t.parents("#"+$.datepicker._mainDivId).length==0&&!t.hasClass($.datepicker.markerClassName)&&!t.closest("."+$.datepicker._triggerClass).length&&$.datepicker._datepickerShowing&&(!$.datepicker._inDialog||!$.blockUI)||t.hasClass($.datepicker.markerClassName)&&$.datepicker._curInst!=n)&&$.datepicker._hideDatepicker();
},_adjustDate:function(e,t,n){var r=$(e),i=this._getInst(r[0]);
if(this._isDisabledDatepicker(r[0])){return;
}this._adjustInstDate(i,t+(n=="M"?this._get(i,"showCurrentAtPos"):0),n),this._updateDatepicker(i);
},_gotoToday:function(e){var t=$(e),n=this._getInst(t[0]);
if(this._get(n,"gotoCurrent")&&n.currentDay){n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear;
}else{var r=new Date;
n.selectedDay=r.getDate(),n.drawMonth=n.selectedMonth=r.getMonth(),n.drawYear=n.selectedYear=r.getFullYear();
}this._notifyChange(n),this._adjustDate(t);
},_selectMonthYear:function(e,t,n){var r=$(e),i=this._getInst(r[0]);
i["selected"+(n=="M"?"Month":"Year")]=i["draw"+(n=="M"?"Month":"Year")]=parseInt(t.options[t.selectedIndex].value,10),this._notifyChange(i),this._adjustDate(r);
},_selectDay:function(e,t,n,r){var i=$(e);
if($(r).hasClass(this._unselectableClass)||this._isDisabledDatepicker(i[0])){return;
}var s=this._getInst(i[0]);
s.selectedDay=s.currentDay=$("a",r).html(),s.selectedMonth=s.currentMonth=t,s.selectedYear=s.currentYear=n,this._selectDate(e,this._formatDate(s,s.currentDay,s.currentMonth,s.currentYear));
},_clearDate:function(e){var t=$(e),n=this._getInst(t[0]);
this._selectDate(t,"");
},_selectDate:function(e,t){var n=$(e),r=this._getInst(n[0]);
t=t!=null?t:this._formatDate(r),r.input&&r.input.val(t),this._updateAlternate(r);
var i=this._get(r,"onSelect");
i?i.apply(r.input?r.input[0]:null,[t,r]):r.input&&r.input.trigger("change"),r.inline?this._updateDatepicker(r):(this._hideDatepicker(),this._lastInput=r.input[0],typeof r.input[0]!="object"&&r.input.focus(),this._lastInput=null);
},_updateAlternate:function(e){var t=this._get(e,"altField");
if(t){var n=this._get(e,"altFormat")||this._get(e,"dateFormat"),r=this._getDate(e),i=this.formatDate(n,r,this._getFormatConfig(e));
$(t).each(function(){$(this).val(i);
});
}},noWeekends:function(e){var t=e.getDay();
return[t>0&&t<6,""];
},iso8601Week:function(e){var t=new Date(e.getTime());
t.setDate(t.getDate()+4-(t.getDay()||7));
var n=t.getTime();
return t.setMonth(0),t.setDate(1),Math.floor(Math.round((n-t)/86400000)/7)+1;
},parseDate:function(e,t,n){if(e==null||t==null){throw"Invalid arguments";
}t=typeof t=="object"?t.toString():t+"";
if(t==""){return null;
}var r=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff;
r=typeof r!="string"?r:(new Date).getFullYear()%100+parseInt(r,10);
var i=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,s=(n?n.dayNames:null)||this._defaults.dayNames,o=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,u=(n?n.monthNames:null)||this._defaults.monthNames,a=-1,f=-1,l=-1,c=-1,h=!1,p=function(t){var n=y+1<e.length&&e.charAt(y+1)==t;
return n&&y++,n;
},d=function(e){var n=p(e),r=e=="@"?14:e=="!"?20:e=="y"&&n?4:e=="o"?3:2,i=new RegExp("^\\d{1,"+r+"}"),s=t.substring(g).match(i);
if(!s){throw"Missing number at position "+g;
}return g+=s[0].length,parseInt(s[0],10);
},v=function(e,n,r){var i=$.map(p(e)?r:n,function(e,t){return[[t,e]];
}).sort(function(e,t){return -(e[1].length-t[1].length);
}),s=-1;
$.each(i,function(e,n){var r=n[1];
if(t.substr(g,r.length).toLowerCase()==r.toLowerCase()){return s=n[0],g+=r.length,!1;
}});
if(s!=-1){return s+1;
}throw"Unknown name at position "+g;
},m=function(){if(t.charAt(g)!=e.charAt(y)){throw"Unexpected literal at position "+g;
}g++;
},g=0;
for(var y=0;
y<e.length;
y++){if(h){e.charAt(y)=="'"&&!p("'")?h=!1:m();
}else{switch(e.charAt(y)){case"d":l=d("d");
break;
case"D":v("D",i,s);
break;
case"o":c=d("o");
break;
case"m":f=d("m");
break;
case"M":f=v("M",o,u);
break;
case"y":a=d("y");
break;
case"@":var b=new Date(d("@"));
a=b.getFullYear(),f=b.getMonth()+1,l=b.getDate();
break;
case"!":var b=new Date((d("!")-this._ticksTo1970)/10000);
a=b.getFullYear(),f=b.getMonth()+1,l=b.getDate();
break;
case"'":p("'")?m():h=!0;
break;
default:m();
}}}if(g<t.length){var w=t.substr(g);
if(!/^\s+/.test(w)){throw"Extra/unparsed characters found in date: "+w;
}}a==-1?a=(new Date).getFullYear():a<100&&(a+=(new Date).getFullYear()-(new Date).getFullYear()%100+(a<=r?0:-100));
if(c>-1){f=1,l=c;
do{var E=this._getDaysInMonth(a,f-1);
if(l<=E){break;
}f++,l-=E;
}while(!0);
}var b=this._daylightSavingAdjust(new Date(a,f-1,l));
if(b.getFullYear()!=a||b.getMonth()+1!=f||b.getDate()!=l){throw"Invalid date";
}return b;
},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*10000000,formatDate:function(e,t,n){if(!t){return"";
}var r=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,i=(n?n.dayNames:null)||this._defaults.dayNames,s=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,o=(n?n.monthNames:null)||this._defaults.monthNames,u=function(t){var n=h+1<e.length&&e.charAt(h+1)==t;
return n&&h++,n;
},a=function(e,t,n){var r=""+t;
if(u(e)){while(r.length<n){r="0"+r;
}}return r;
},f=function(e,t,n,r){return u(e)?r[t]:n[t];
},l="",c=!1;
if(t){for(var h=0;
h<e.length;
h++){if(c){e.charAt(h)=="'"&&!u("'")?c=!1:l+=e.charAt(h);
}else{switch(e.charAt(h)){case"d":l+=a("d",t.getDate(),2);
break;
case"D":l+=f("D",t.getDay(),r,i);
break;
case"o":l+=a("o",Math.round(((new Date(t.getFullYear(),t.getMonth(),t.getDate())).getTime()-(new Date(t.getFullYear(),0,0)).getTime())/86400000),3);
break;
case"m":l+=a("m",t.getMonth()+1,2);
break;
case"M":l+=f("M",t.getMonth(),s,o);
break;
case"y":l+=u("y")?t.getFullYear():(t.getYear()%100<10?"0":"")+t.getYear()%100;
break;
case"@":l+=t.getTime();
break;
case"!":l+=t.getTime()*10000+this._ticksTo1970;
break;
case"'":u("'")?l+="'":c=!0;
break;
default:l+=e.charAt(h);
}}}}return l;
},_possibleChars:function(e){var t="",n=!1,r=function(t){var n=i+1<e.length&&e.charAt(i+1)==t;
return n&&i++,n;
};
for(var i=0;
i<e.length;
i++){if(n){e.charAt(i)=="'"&&!r("'")?n=!1:t+=e.charAt(i);
}else{switch(e.charAt(i)){case"d":case"m":case"y":case"@":t+="0123456789";
break;
case"D":case"M":return null;
case"'":r("'")?t+="'":n=!0;
break;
default:t+=e.charAt(i);
}}}return t;
},_get:function(e,t){return e.settings[t]!==undefined?e.settings[t]:this._defaults[t];
},_setDateFromField:function(e,t){if(e.input.val()==e.lastVal){return;
}var n=this._get(e,"dateFormat"),r=e.lastVal=e.input?e.input.val():null,i,s;
i=s=this._getDefaultDate(e);
var o=this._getFormatConfig(e);
try{i=this.parseDate(n,r,o)||s;
}catch(u){this.log(u),r=t?"":r;
}e.selectedDay=i.getDate(),e.drawMonth=e.selectedMonth=i.getMonth(),e.drawYear=e.selectedYear=i.getFullYear(),e.currentDay=r?i.getDate():0,e.currentMonth=r?i.getMonth():0,e.currentYear=r?i.getFullYear():0,this._adjustInstDate(e);
},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date));
},_determineDate:function(e,t,n){var r=function(e){var t=new Date;
return t.setDate(t.getDate()+e),t;
},i=function(t){try{return $.datepicker.parseDate($.datepicker._get(e,"dateFormat"),t,$.datepicker._getFormatConfig(e));
}catch(n){}var r=(t.toLowerCase().match(/^c/)?$.datepicker._getDate(e):null)||new Date,i=r.getFullYear(),s=r.getMonth(),o=r.getDate(),u=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,a=u.exec(t);
while(a){switch(a[2]||"d"){case"d":case"D":o+=parseInt(a[1],10);
break;
case"w":case"W":o+=parseInt(a[1],10)*7;
break;
case"m":case"M":s+=parseInt(a[1],10),o=Math.min(o,$.datepicker._getDaysInMonth(i,s));
break;
case"y":case"Y":i+=parseInt(a[1],10),o=Math.min(o,$.datepicker._getDaysInMonth(i,s));
}a=u.exec(t);
}return new Date(i,s,o);
},s=t==null||t===""?n:typeof t=="string"?i(t):typeof t=="number"?isNaN(t)?n:r(t):new Date(t.getTime());
return s=s&&s.toString()=="Invalid Date"?n:s,s&&(s.setHours(0),s.setMinutes(0),s.setSeconds(0),s.setMilliseconds(0)),this._daylightSavingAdjust(s);
},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null;
},_setDate:function(e,t,n){var r=!t,i=e.selectedMonth,s=e.selectedYear,o=this._restrictMinMax(e,this._determineDate(e,t,new Date));
e.selectedDay=e.currentDay=o.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=o.getMonth(),e.drawYear=e.selectedYear=e.currentYear=o.getFullYear(),(i!=e.selectedMonth||s!=e.selectedYear)&&!n&&this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(r?"":this._formatDate(e));
},_getDate:function(e){var t=!e.currentYear||e.input&&e.input.val()==""?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));
return t;
},_attachHandlers:function(e){var t=this._get(e,"stepMonths"),n="#"+e.id.replace(/\\\\/g,"\\");
e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){window["DP_jQuery_"+dpuuid].datepicker._adjustDate(n,-t,"M");
},next:function(){window["DP_jQuery_"+dpuuid].datepicker._adjustDate(n,+t,"M");
},hide:function(){window["DP_jQuery_"+dpuuid].datepicker._hideDatepicker();
},today:function(){window["DP_jQuery_"+dpuuid].datepicker._gotoToday(n);
},selectDay:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectDay(n,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1;
},selectMonth:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectMonthYear(n,this,"M"),!1;
},selectYear:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectMonthYear(n,this,"Y"),!1;
}};
$(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")]);
});
},_generateHTML:function(e){var t=new Date;
t=this._daylightSavingAdjust(new Date(t.getFullYear(),t.getMonth(),t.getDate()));
var n=this._get(e,"isRTL"),r=this._get(e,"showButtonPanel"),i=this._get(e,"hideIfNoPrevNext"),s=this._get(e,"navigationAsDateFormat"),o=this._getNumberOfMonths(e),u=this._get(e,"showCurrentAtPos"),a=this._get(e,"stepMonths"),f=o[0]!=1||o[1]!=1,l=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),c=this._getMinMaxDate(e,"min"),h=this._getMinMaxDate(e,"max"),p=e.drawMonth-u,d=e.drawYear;
p<0&&(p+=12,d--);
if(h){var v=this._daylightSavingAdjust(new Date(h.getFullYear(),h.getMonth()-o[0]*o[1]+1,h.getDate()));
v=c&&v<c?c:v;
while(this._daylightSavingAdjust(new Date(d,p,1))>v){p--,p<0&&(p=11,d--);
}}e.drawMonth=p,e.drawYear=d;
var m=this._get(e,"prevText");
m=s?this.formatDate(m,this._daylightSavingAdjust(new Date(d,p-a,1)),this._getFormatConfig(e)):m;
var g=this._canAdjustMonth(e,-1,d,p)?'<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="'+m+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"e":"w")+'">'+m+"</span></a>":i?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+m+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"e":"w")+'">'+m+"</span></a>",y=this._get(e,"nextText");
y=s?this.formatDate(y,this._daylightSavingAdjust(new Date(d,p+a,1)),this._getFormatConfig(e)):y;
var b=this._canAdjustMonth(e,1,d,p)?'<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="'+y+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"w":"e")+'">'+y+"</span></a>":i?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+y+'"><span class="ui-icon ui-icon-circle-triangle-'+(n?"w":"e")+'">'+y+"</span></a>",w=this._get(e,"currentText"),E=this._get(e,"gotoCurrent")&&e.currentDay?l:t;
w=s?this.formatDate(w,E,this._getFormatConfig(e)):w;
var S=e.inline?"":'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">'+this._get(e,"closeText")+"</button>",x=r?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(n?S:"")+(this._isInRange(e,E)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">'+w+"</button>":"")+(n?"":S)+"</div>":"",T=parseInt(this._get(e,"firstDay"),10);
T=isNaN(T)?0:T;
var N=this._get(e,"showWeek"),C=this._get(e,"dayNames"),k=this._get(e,"dayNamesShort"),L=this._get(e,"dayNamesMin"),A=this._get(e,"monthNames"),O=this._get(e,"monthNamesShort"),M=this._get(e,"beforeShowDay"),_=this._get(e,"showOtherMonths"),D=this._get(e,"selectOtherMonths"),P=this._get(e,"calculateWeek")||this.iso8601Week,H=this._getDefaultDate(e),B="";
for(var j=0;
j<o[0];
j++){var F="";
this.maxRows=4;
for(var I=0;
I<o[1];
I++){var q=this._daylightSavingAdjust(new Date(d,p,e.selectedDay)),R=" ui-corner-all",U="";
if(f){U+='<div class="ui-datepicker-group';
if(o[1]>1){switch(I){case 0:U+=" ui-datepicker-group-first",R=" ui-corner-"+(n?"right":"left");
break;
case o[1]-1:U+=" ui-datepicker-group-last",R=" ui-corner-"+(n?"left":"right");
break;
default:U+=" ui-datepicker-group-middle",R="";
}}U+='">';
}U+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+R+'">'+(/all|left/.test(R)&&j==0?n?b:g:"")+(/all|right/.test(R)&&j==0?n?g:b:"")+this._generateMonthYearHeader(e,p,d,c,h,j>0||I>0,A,O)+'</div><table class="ui-datepicker-calendar"><thead><tr>';
var z=N?'<th class="ui-datepicker-week-col">'+this._get(e,"weekHeader")+"</th>":"";
for(var W=0;
W<7;
W++){var X=(W+T)%7;
z+="<th"+((W+T+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+C[X]+'">'+L[X]+"</span></th>";
}U+=z+"</tr></thead><tbody>";
var V=this._getDaysInMonth(d,p);
d==e.selectedYear&&p==e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,V));
var J=(this._getFirstDayOfMonth(d,p)-T+7)%7,K=Math.ceil((J+V)/7),Q=f?this.maxRows>K?this.maxRows:K:K;
this.maxRows=Q;
var G=this._daylightSavingAdjust(new Date(d,p,1-J));
for(var Y=0;
Y<Q;
Y++){U+="<tr>";
var Z=N?'<td class="ui-datepicker-week-col">'+this._get(e,"calculateWeek")(G)+"</td>":"";
for(var W=0;
W<7;
W++){var et=M?M.apply(e.input?e.input[0]:null,[G]):[!0,""],tt=G.getMonth()!=p,nt=tt&&!D||!et[0]||c&&G<c||h&&G>h;
Z+='<td class="'+((W+T+6)%7>=5?" ui-datepicker-week-end":"")+(tt?" ui-datepicker-other-month":"")+(G.getTime()==q.getTime()&&p==e.selectedMonth&&e._keyEvent||H.getTime()==G.getTime()&&H.getTime()==q.getTime()?" "+this._dayOverClass:"")+(nt?" "+this._unselectableClass+" ui-state-disabled":"")+(tt&&!_?"":" "+et[1]+(G.getTime()==l.getTime()?" "+this._currentClass:"")+(G.getTime()==t.getTime()?" ui-datepicker-today":""))+'"'+((!tt||_)&&et[2]?' title="'+et[2]+'"':"")+(nt?"":' data-handler="selectDay" data-event="click" data-month="'+G.getMonth()+'" data-year="'+G.getFullYear()+'"')+">"+(tt&&!_?"&#xa0;":nt?'<span class="ui-state-default">'+G.getDate()+"</span>":'<a class="ui-state-default'+(G.getTime()==t.getTime()?" ui-state-highlight":"")+(G.getTime()==l.getTime()?" ui-state-active":"")+(tt?" ui-priority-secondary":"")+'" href="#">'+G.getDate()+"</a>")+"</td>",G.setDate(G.getDate()+1),G=this._daylightSavingAdjust(G);
}U+=Z+"</tr>";
}p++,p>11&&(p=0,d++),U+="</tbody></table>"+(f?"</div>"+(o[0]>0&&I==o[1]-1?'<div class="ui-datepicker-row-break"></div>':""):""),F+=U;
}B+=F;
}return B+=x+($.ui.ie6&&!e.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':""),e._keyEvent=!1,B;
},_generateMonthYearHeader:function(e,t,n,r,i,s,o,u){var a=this._get(e,"changeMonth"),f=this._get(e,"changeYear"),l=this._get(e,"showMonthAfterYear"),c='<div class="ui-datepicker-title">',h="";
if(s||!a){h+='<span class="ui-datepicker-month">'+o[t]+"</span>";
}else{var p=r&&r.getFullYear()==n,d=i&&i.getFullYear()==n;
h+='<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
for(var v=0;
v<12;
v++){(!p||v>=r.getMonth())&&(!d||v<=i.getMonth())&&(h+='<option value="'+v+'"'+(v==t?' selected="selected"':"")+">"+u[v]+"</option>");
}h+="</select>";
}l||(c+=h+(s||!a||!f?"&#xa0;":""));
if(!e.yearshtml){e.yearshtml="";
if(s||!f){c+='<span class="ui-datepicker-year">'+n+"</span>";
}else{var m=this._get(e,"yearRange").split(":"),g=(new Date).getFullYear(),y=function(e){var t=e.match(/c[+-].*/)?n+parseInt(e.substring(1),10):e.match(/[+-].*/)?g+parseInt(e,10):parseInt(e,10);
return isNaN(t)?g:t;
},b=y(m[0]),w=Math.max(b,y(m[1]||""));
b=r?Math.max(b,r.getFullYear()):b,w=i?Math.min(w,i.getFullYear()):w,e.yearshtml+='<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
for(;
b<=w;
b++){e.yearshtml+='<option value="'+b+'"'+(b==n?' selected="selected"':"")+">"+b+"</option>";
}e.yearshtml+="</select>",c+=e.yearshtml,e.yearshtml=null;
}}return c+=this._get(e,"yearSuffix"),l&&(c+=(s||!a||!f?"&#xa0;":"")+h),c+="</div>",c;
},_adjustInstDate:function(e,t,n){var r=e.drawYear+(n=="Y"?t:0),i=e.drawMonth+(n=="M"?t:0),s=Math.min(e.selectedDay,this._getDaysInMonth(r,i))+(n=="D"?t:0),o=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(r,i,s)));
e.selectedDay=o.getDate(),e.drawMonth=e.selectedMonth=o.getMonth(),e.drawYear=e.selectedYear=o.getFullYear(),(n=="M"||n=="Y")&&this._notifyChange(e);
},_restrictMinMax:function(e,t){var n=this._getMinMaxDate(e,"min"),r=this._getMinMaxDate(e,"max"),i=n&&t<n?n:t;
return i=r&&i>r?r:i,i;
},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");
t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e]);
},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");
return t==null?[1,1]:typeof t=="number"?[1,t]:t;
},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null);
},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate();
},_getFirstDayOfMonth:function(e,t){return(new Date(e,t,1)).getDay();
},_canAdjustMonth:function(e,t,n,r){var i=this._getNumberOfMonths(e),s=this._daylightSavingAdjust(new Date(n,r+(t<0?t:i[0]*i[1]),1));
return t<0&&s.setDate(this._getDaysInMonth(s.getFullYear(),s.getMonth())),this._isInRange(e,s);
},_isInRange:function(e,t){var n=this._getMinMaxDate(e,"min"),r=this._getMinMaxDate(e,"max");
return(!n||t.getTime()>=n.getTime())&&(!r||t.getTime()<=r.getTime());
},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");
return t=typeof t!="string"?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")};
},_formatDate:function(e,t,n,r){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);
var i=t?typeof t=="object"?t:this._daylightSavingAdjust(new Date(r,n,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));
return this.formatDate(this._get(e,"dateFormat"),i,this._getFormatConfig(e));
}}),$.fn.datepicker=function(e){if(!this.length){return this;
}$.datepicker.initialized||($(document).mousedown($.datepicker._checkExternalClick).find(document.body).append($.datepicker.dpDiv),$.datepicker.initialized=!0);
var t=Array.prototype.slice.call(arguments,1);
return typeof e!="string"||e!="isDisabled"&&e!="getDate"&&e!="widget"?e=="option"&&arguments.length==2&&typeof arguments[1]=="string"?$.datepicker["_"+e+"Datepicker"].apply($.datepicker,[this[0]].concat(t)):this.each(function(){typeof e=="string"?$.datepicker["_"+e+"Datepicker"].apply($.datepicker,[this].concat(t)):$.datepicker._attachDatepicker(this,e);
}):$.datepicker["_"+e+"Datepicker"].apply($.datepicker,[this[0]].concat(t));
},$.datepicker=new Datepicker,$.datepicker.initialized=!1,$.datepicker.uuid=(new Date).getTime(),$.datepicker.version="1.9.1",window["DP_jQuery_"+dpuuid]=$;
})(jQuery);
(function(e,t){var n="ui-dialog ui-widget ui-widget-content ui-corner-all ",r={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};
e.widget("ui.dialog",{version:"1.9.1",options:{autoOpen:!0,buttons:{},closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:!1,maxWidth:!1,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var n=e(this).css(t).offset().top;
n<0&&e(this).css("top",t.top-n);
}},resizable:!0,show:null,stack:!0,title:"",width:300,zIndex:1000},_create:function(){this.originalTitle=this.element.attr("title"),typeof this.originalTitle!="string"&&(this.originalTitle=""),this.oldPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.options.title=this.options.title||this.originalTitle;
var t=this,r=this.options,i=r.title||"&#160;",s,o,u,a,f;
s=(this.uiDialog=e("<div>")).addClass(n+r.dialogClass).css({display:"none",outline:0,zIndex:r.zIndex}).attr("tabIndex",-1).keydown(function(n){r.closeOnEscape&&!n.isDefaultPrevented()&&n.keyCode&&n.keyCode===e.ui.keyCode.ESCAPE&&(t.close(n),n.preventDefault());
}).mousedown(function(e){t.moveToTop(!1,e);
}).appendTo("body"),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(s),o=(this.uiDialogTitlebar=e("<div>")).addClass("ui-dialog-titlebar  ui-widget-header  ui-corner-all  ui-helper-clearfix").bind("mousedown",function(){s.focus();
}).prependTo(s),u=e("<a href='#'></a>").addClass("ui-dialog-titlebar-close  ui-corner-all").attr("role","button").click(function(e){e.preventDefault(),t.close(e);
}).appendTo(o),(this.uiDialogTitlebarCloseText=e("<span>")).addClass("ui-icon ui-icon-closethick").text(r.closeText).appendTo(u),a=e("<span>").uniqueId().addClass("ui-dialog-title").html(i).prependTo(o),f=(this.uiDialogButtonPane=e("<div>")).addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),(this.uiButtonSet=e("<div>")).addClass("ui-dialog-buttonset").appendTo(f),s.attr({role:"dialog","aria-labelledby":a.attr("id")}),o.find("*").add(o).disableSelection(),this._hoverable(u),this._focusable(u),r.draggable&&e.fn.draggable&&this._makeDraggable(),r.resizable&&e.fn.resizable&&this._makeResizable(),this._createButtons(r.buttons),this._isOpen=!1,e.fn.bgiframe&&s.bgiframe(),this._on(s,{keydown:function(t){if(!r.modal||t.keyCode!==e.ui.keyCode.TAB){return;
}var n=e(":tabbable",s),i=n.filter(":first"),o=n.filter(":last");
if(t.target===o[0]&&!t.shiftKey){return i.focus(1),!1;
}if(t.target===i[0]&&t.shiftKey){return o.focus(1),!1;
}}});
},_init:function(){this.options.autoOpen&&this.open();
},_destroy:function(){var e,t=this.oldPosition;
this.overlay&&this.overlay.destroy(),this.uiDialog.hide(),this.element.removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element);
},widget:function(){return this.uiDialog;
},close:function(t){var n=this,r,i;
if(!this._isOpen){return;
}if(!1===this._trigger("beforeClose",t)){return;
}return this._isOpen=!1,this.overlay&&this.overlay.destroy(),this.options.hide?this._hide(this.uiDialog,this.options.hide,function(){n._trigger("close",t);
}):(this.uiDialog.hide(),this._trigger("close",t)),e.ui.dialog.overlay.resize(),this.options.modal&&(r=0,e(".ui-dialog").each(function(){this!==n.uiDialog[0]&&(i=e(this).css("z-index"),isNaN(i)||(r=Math.max(r,i)));
}),e.ui.dialog.maxZ=r),this;
},isOpen:function(){return this._isOpen;
},moveToTop:function(t,n){var r=this.options,i;
return r.modal&&!t||!r.stack&&!r.modal?this._trigger("focus",n):(r.zIndex>e.ui.dialog.maxZ&&(e.ui.dialog.maxZ=r.zIndex),this.overlay&&(e.ui.dialog.maxZ+=1,e.ui.dialog.overlay.maxZ=e.ui.dialog.maxZ,this.overlay.$el.css("z-index",e.ui.dialog.overlay.maxZ)),i={scrollTop:this.element.scrollTop(),scrollLeft:this.element.scrollLeft()},e.ui.dialog.maxZ+=1,this.uiDialog.css("z-index",e.ui.dialog.maxZ),this.element.attr(i),this._trigger("focus",n),this);
},open:function(){if(this._isOpen){return;
}var t,n=this.options,r=this.uiDialog;
return this._size(),this._position(n.position),r.show(n.show),this.overlay=n.modal?new e.ui.dialog.overlay(this):null,this.moveToTop(!0),t=this.element.find(":tabbable"),t.length||(t=this.uiDialogButtonPane.find(":tabbable"),t.length||(t=r)),t.eq(0).focus(),this._isOpen=!0,this._trigger("open"),this;
},_createButtons:function(t){var n=this,r=!1;
this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),typeof t=="object"&&t!==null&&e.each(t,function(){return !(r=!0);
}),r?(e.each(t,function(t,r){r=e.isFunction(r)?{click:r,text:t}:r;
var i=e("<button type='button'></button>").attr(r,!0).unbind("click").click(function(){r.click.apply(n.element[0],arguments);
}).appendTo(n.uiButtonSet);
e.fn.button&&i.button();
}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog)):this.uiDialog.removeClass("ui-dialog-buttons");
},_makeDraggable:function(){function r(e){return{position:e.position,offset:e.offset};
}var t=this,n=this.options;
this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(n,i){e(this).addClass("ui-dialog-dragging"),t._trigger("dragStart",n,r(i));
},drag:function(e,n){t._trigger("drag",e,r(n));
},stop:function(i,s){n.position=[s.position.left-t.document.scrollLeft(),s.position.top-t.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),t._trigger("dragStop",i,r(s)),e.ui.dialog.overlay.resize();
}});
},_makeResizable:function(n){function u(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size};
}n=n===t?this.options.resizable:n;
var r=this,i=this.options,s=this.uiDialog.css("position"),o=typeof n=="string"?n:"n,e,s,w,se,sw,ne,nw";
this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:i.maxWidth,maxHeight:i.maxHeight,minWidth:i.minWidth,minHeight:this._minHeight(),handles:o,start:function(t,n){e(this).addClass("ui-dialog-resizing"),r._trigger("resizeStart",t,u(n));
},resize:function(e,t){r._trigger("resize",e,u(t));
},stop:function(t,n){e(this).removeClass("ui-dialog-resizing"),i.height=e(this).height(),i.width=e(this).width(),r._trigger("resizeStop",t,u(n)),e.ui.dialog.overlay.resize();
}}).css("position",s).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se");
},_minHeight:function(){var e=this.options;
return e.height==="auto"?e.minHeight:Math.min(e.minHeight,e.height);
},_position:function(t){var n=[],r=[0,0],i;
if(t){if(typeof t=="string"||typeof t=="object"&&"0" in t){n=t.split?t.split(" "):[t[0],t[1]],n.length===1&&(n[1]=n[0]),e.each(["left","top"],function(e,t){+n[e]===n[e]&&(r[e]=n[e],n[e]=t);
}),t={my:n[0]+(r[0]<0?r[0]:"+"+r[0])+" "+n[1]+(r[1]<0?r[1]:"+"+r[1]),at:n.join(" ")};
}t=e.extend({},e.ui.dialog.prototype.options.position,t);
}else{t=e.ui.dialog.prototype.options.position;
}i=this.uiDialog.is(":visible"),i||this.uiDialog.show(),this.uiDialog.position(t),i||this.uiDialog.hide();
},_setOptions:function(t){var n=this,s={},o=!1;
e.each(t,function(e,t){n._setOption(e,t),e in r&&(o=!0),e in i&&(s[e]=t);
}),o&&this._size(),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",s);
},_setOption:function(t,r){var i,s,o=this.uiDialog;
switch(t){case"buttons":this._createButtons(r);
break;
case"closeText":this.uiDialogTitlebarCloseText.text(""+r);
break;
case"dialogClass":o.removeClass(this.options.dialogClass).addClass(n+r);
break;
case"disabled":r?o.addClass("ui-dialog-disabled"):o.removeClass("ui-dialog-disabled");
break;
case"draggable":i=o.is(":data(draggable)"),i&&!r&&o.draggable("destroy"),!i&&r&&this._makeDraggable();
break;
case"position":this._position(r);
break;
case"resizable":s=o.is(":data(resizable)"),s&&!r&&o.resizable("destroy"),s&&typeof r=="string"&&o.resizable("option","handles",r),!s&&r!==!1&&this._makeResizable(r);
break;
case"title":e(".ui-dialog-title",this.uiDialogTitlebar).html(""+(r||"&#160;"));
}this._super(t,r);
},_size:function(){var t,n,r,i=this.options,s=this.uiDialog.is(":visible");
this.element.show().css({width:"auto",minHeight:0,height:0}),i.minWidth>i.width&&(i.width=i.minWidth),t=this.uiDialog.css({height:"auto",width:i.width}).outerHeight(),n=Math.max(0,i.minHeight-t),i.height==="auto"?e.support.minHeight?this.element.css({minHeight:n,height:"auto"}):(this.uiDialog.show(),r=this.element.css("height","auto").height(),s||this.uiDialog.hide(),this.element.height(Math.max(r,n))):this.element.height(Math.max(i.height-t,0)),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight());
}}),e.extend(e.ui.dialog,{uuid:0,maxZ:0,getTitleId:function(e){var t=e.attr("id");
return t||(this.uuid+=1,t=this.uuid),"ui-dialog-title-"+t;
},overlay:function(t){this.$el=e.ui.dialog.overlay.create(t);
}}),e.extend(e.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:e.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(e){return e+".dialog-overlay";
}).join(" "),create:function(t){this.instances.length===0&&(setTimeout(function(){e.ui.dialog.overlay.instances.length&&e(document).bind(e.ui.dialog.overlay.events,function(t){if(e(t.target).zIndex()<e.ui.dialog.overlay.maxZ){return !1;
}});
},1),e(window).bind("resize.dialog-overlay",e.ui.dialog.overlay.resize));
var n=this.oldInstances.pop()||e("<div>").addClass("ui-widget-overlay");
return e(document).bind("keydown.dialog-overlay",function(r){var i=e.ui.dialog.overlay.instances;
i.length!==0&&i[i.length-1]===n&&t.options.closeOnEscape&&!r.isDefaultPrevented()&&r.keyCode&&r.keyCode===e.ui.keyCode.ESCAPE&&(t.close(r),r.preventDefault());
}),n.appendTo(document.body).css({width:this.width(),height:this.height()}),e.fn.bgiframe&&n.bgiframe(),this.instances.push(n),n;
},destroy:function(t){var n=e.inArray(t,this.instances),r=0;
n!==-1&&this.oldInstances.push(this.instances.splice(n,1)[0]),this.instances.length===0&&e([document,window]).unbind(".dialog-overlay"),t.height(0).width(0).remove(),e.each(this.instances,function(){r=Math.max(r,this.css("z-index"));
}),this.maxZ=r;
},height:function(){var t,n;
return e.ui.ie?(t=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),n=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight),t<n?e(window).height()+"px":t+"px"):e(document).height()+"px";
},width:function(){var t,n;
return e.ui.ie?(t=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),n=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth),t<n?e(window).width()+"px":t+"px"):e(document).width()+"px";
},resize:function(){var t=e([]);
e.each(e.ui.dialog.overlay.instances,function(){t=t.add(this);
}),t.css({width:0,height:0}).css({width:e.ui.dialog.overlay.width(),height:e.ui.dialog.overlay.height()});
}}),e.extend(e.ui.dialog.overlay.prototype,{destroy:function(){e.ui.dialog.overlay.destroy(this.$el);
}});
})(jQuery);
(function(e,t){e.widget("ui.draggable",e.ui.mouse,{version:"1.9.1",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit();
},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy();
},_mouseCapture:function(t){var n=this.options;
return this.helper||n.disabled||e(t.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(t),this.handle?(e(n.iframeFix===!0?"iframe":n.iframeFix).each(function(){e('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(e(this).offset()).appendTo("body");
}),!0):!1);
},_mouseStart:function(t){var n=this.options;
return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,n.cursorAt&&this._adjustOffsetFromHelper(n.cursorAt),n.containment&&this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!n.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0);
},_mouseDrag:function(t,n){this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute");
if(!n){var r=this._uiHash();
if(this._trigger("drag",t,r)===!1){return this._mouseUp({}),!1;
}this.position=r.position;
}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px";
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px";
}return e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1;
},_mouseStop:function(t){var n=!1;
e.ui.ddmanager&&!this.options.dropBehaviour&&(n=e.ui.ddmanager.drop(this,t)),this.dropped&&(n=this.dropped,this.dropped=!1);
var r=this.element[0],i=!1;
while(r&&(r=r.parentNode)){r==document&&(i=!0);
}if(!i&&this.options.helper==="original"){return !1;
}if(this.options.revert=="invalid"&&!n||this.options.revert=="valid"&&n||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,n)){var s=this;
e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){s._trigger("stop",t)!==!1&&s._clear();
});
}else{this._trigger("stop",t)!==!1&&this._clear();
}return !1;
},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this);
}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t);
},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this;
},_getHandle:function(t){var n=!this.options.handle||!e(this.options.handle,this.element).length?!0:!1;
return e(this.options.handle,this.element).find("*").andSelf().each(function(){this==t.target&&(n=!0);
}),n;
},_createHelper:function(t){var n=this.options,r=e.isFunction(n.helper)?e(n.helper.apply(this.element[0],[t])):n.helper=="clone"?this.element.clone().removeAttr("id"):this.element;
return r.parents("body").length||r.appendTo(n.appendTo=="parent"?this.element[0].parentNode:n.appendTo),r[0]!=this.element[0]&&!/(fixed|absolute)/.test(r.css("position"))&&r.css("position","absolute"),r;
},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left" in t&&(this.offset.click.left=t.left+this.margins.left),"right" in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top" in t&&(this.offset.click.top=t.top+this.margins.top),"bottom" in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top);
},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var t=this.offsetParent.offset();
this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop());
if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&e.ui.ie){t={top:0,left:0};
}return{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var e=this.element.position();
return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()};
}return{top:0,left:0};
},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0};
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};
},_setContainment:function(){var t=this.options;
t.containment=="parent"&&(t.containment=this.helper[0].parentNode);
if(t.containment=="document"||t.containment=="window"){this.containment=[t.containment=="document"?0:e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t.containment=="document"?0:e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(t.containment=="document"?0:e(window).scrollLeft())+e(t.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(t.containment=="document"?0:e(window).scrollTop())+(e(t.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
}if(!/^(document|window|parent)$/.test(t.containment)&&t.containment.constructor!=Array){var n=e(t.containment),r=n[0];
if(!r){return;
}var i=n.offset(),s=e(r).css("overflow")!="hidden";
this.containment=[(parseInt(e(r).css("borderLeftWidth"),10)||0)+(parseInt(e(r).css("paddingLeft"),10)||0),(parseInt(e(r).css("borderTopWidth"),10)||0)+(parseInt(e(r).css("paddingTop"),10)||0),(s?Math.max(r.scrollWidth,r.offsetWidth):r.offsetWidth)-(parseInt(e(r).css("borderLeftWidth"),10)||0)-(parseInt(e(r).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(s?Math.max(r.scrollHeight,r.offsetHeight):r.offsetHeight)-(parseInt(e(r).css("borderTopWidth"),10)||0)-(parseInt(e(r).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=n;
}else{t.containment.constructor==Array&&(this.containment=t.containment);
}},_convertPositionTo:function(t,n){n||(n=this.position);
var r=t=="absolute"?1:-1,i=this.options,s=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(s[0].tagName);
return{top:n.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():o?0:s.scrollTop())*r,left:n.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():o?0:s.scrollLeft())*r};
},_generatePosition:function(t){var n=this.options,r=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,i=/(html|body)/i.test(r[0].tagName),s=t.pageX,o=t.pageY;
if(this.originalPosition){var u;
if(this.containment){if(this.relative_container){var a=this.relative_container.offset();
u=[this.containment[0]+a.left,this.containment[1]+a.top,this.containment[2]+a.left,this.containment[3]+a.top];
}else{u=this.containment;
}t.pageX-this.offset.click.left<u[0]&&(s=u[0]+this.offset.click.left),t.pageY-this.offset.click.top<u[1]&&(o=u[1]+this.offset.click.top),t.pageX-this.offset.click.left>u[2]&&(s=u[2]+this.offset.click.left),t.pageY-this.offset.click.top>u[3]&&(o=u[3]+this.offset.click.top);
}if(n.grid){var f=n.grid[1]?this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1]:this.originalPageY;
o=u?f-this.offset.click.top<u[1]||f-this.offset.click.top>u[3]?f-this.offset.click.top<u[1]?f+n.grid[1]:f-n.grid[1]:f:f;
var l=n.grid[0]?this.originalPageX+Math.round((s-this.originalPageX)/n.grid[0])*n.grid[0]:this.originalPageX;
s=u?l-this.offset.click.left<u[0]||l-this.offset.click.left>u[2]?l-this.offset.click.left<u[0]?l+n.grid[0]:l-n.grid[0]:l:l;
}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():i?0:r.scrollTop()),left:s-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:r.scrollLeft())};
},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1;
},_trigger:function(t,n,r){return r=r||this._uiHash(),e.ui.plugin.call(this,t,[n,r]),t=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,n,r);
},plugins:{},_uiHash:function(e){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs};
}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,n){var r=e(this).data("draggable"),i=r.options,s=e.extend({},n,{item:r.element});
r.sortables=[],e(i.connectToSortable).each(function(){var n=e.data(this,"sortable");
n&&!n.options.disabled&&(r.sortables.push({instance:n,shouldRevert:n.options.revert}),n.refreshPositions(),n._trigger("activate",t,s));
});
},stop:function(t,n){var r=e(this).data("draggable"),i=e.extend({},n,{item:r.element});
e.each(r.sortables,function(){this.instance.isOver?(this.instance.isOver=0,r.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,r.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,i));
});
},drag:function(t,n){var r=e(this).data("draggable"),i=this,s=function(t){var n=this.offset.click.top,r=this.offset.click.left,i=this.positionAbs.top,s=this.positionAbs.left,o=t.height,u=t.width,a=t.top,f=t.left;
return e.ui.isOver(i+n,s+r,a,f,o,u);
};
e.each(r.sortables,function(s){var o=!1,u=this;
this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(o=!0,e.each(r.sortables,function(){return this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this!=u&&this.instance._intersectsWith(this.instance.containerCache)&&e.ui.contains(u.instance.element[0],this.instance.element[0])&&(o=!1),o;
})),o?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(i).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return n.helper[0];
},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=r.offset.click.top,this.instance.offset.click.left=r.offset.click.left,this.instance.offset.parent.left-=r.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=r.offset.parent.top-this.instance.offset.parent.top,r._trigger("toSortable",t),r.dropped=this.instance.element,r.currentItem=r.element,this.instance.fromOutside=r),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),r._trigger("fromSortable",t),r.dropped=!1);
});
}}),e.ui.plugin.add("draggable","cursor",{start:function(t,n){var r=e("body"),i=e(this).data("draggable").options;
r.css("cursor")&&(i._cursor=r.css("cursor")),r.css("cursor",i.cursor);
},stop:function(t,n){var r=e(this).data("draggable").options;
r._cursor&&e("body").css("cursor",r._cursor);
}}),e.ui.plugin.add("draggable","opacity",{start:function(t,n){var r=e(n.helper),i=e(this).data("draggable").options;
r.css("opacity")&&(i._opacity=r.css("opacity")),r.css("opacity",i.opacity);
},stop:function(t,n){var r=e(this).data("draggable").options;
r._opacity&&e(n.helper).css("opacity",r._opacity);
}}),e.ui.plugin.add("draggable","scroll",{start:function(t,n){var r=e(this).data("draggable");
r.scrollParent[0]!=document&&r.scrollParent[0].tagName!="HTML"&&(r.overflowOffset=r.scrollParent.offset());
},drag:function(t,n){var r=e(this).data("draggable"),i=r.options,s=!1;
if(r.scrollParent[0]!=document&&r.scrollParent[0].tagName!="HTML"){if(!i.axis||i.axis!="x"){r.overflowOffset.top+r.scrollParent[0].offsetHeight-t.pageY<i.scrollSensitivity?r.scrollParent[0].scrollTop=s=r.scrollParent[0].scrollTop+i.scrollSpeed:t.pageY-r.overflowOffset.top<i.scrollSensitivity&&(r.scrollParent[0].scrollTop=s=r.scrollParent[0].scrollTop-i.scrollSpeed);
}if(!i.axis||i.axis!="y"){r.overflowOffset.left+r.scrollParent[0].offsetWidth-t.pageX<i.scrollSensitivity?r.scrollParent[0].scrollLeft=s=r.scrollParent[0].scrollLeft+i.scrollSpeed:t.pageX-r.overflowOffset.left<i.scrollSensitivity&&(r.scrollParent[0].scrollLeft=s=r.scrollParent[0].scrollLeft-i.scrollSpeed);
}}else{if(!i.axis||i.axis!="x"){t.pageY-e(document).scrollTop()<i.scrollSensitivity?s=e(document).scrollTop(e(document).scrollTop()-i.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<i.scrollSensitivity&&(s=e(document).scrollTop(e(document).scrollTop()+i.scrollSpeed));
}if(!i.axis||i.axis!="y"){t.pageX-e(document).scrollLeft()<i.scrollSensitivity?s=e(document).scrollLeft(e(document).scrollLeft()-i.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<i.scrollSensitivity&&(s=e(document).scrollLeft(e(document).scrollLeft()+i.scrollSpeed));
}}s!==!1&&e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(r,t);
}}),e.ui.plugin.add("draggable","snap",{start:function(t,n){var r=e(this).data("draggable"),i=r.options;
r.snapElements=[],e(i.snap.constructor!=String?i.snap.items||":data(draggable)":i.snap).each(function(){var t=e(this),n=t.offset();
this!=r.element[0]&&r.snapElements.push({item:this,width:t.outerWidth(),height:t.outerHeight(),top:n.top,left:n.left});
});
},drag:function(t,n){var r=e(this).data("draggable"),i=r.options,s=i.snapTolerance,o=n.offset.left,u=o+r.helperProportions.width,a=n.offset.top,f=a+r.helperProportions.height;
for(var l=r.snapElements.length-1;
l>=0;
l--){var c=r.snapElements[l].left,h=c+r.snapElements[l].width,p=r.snapElements[l].top,d=p+r.snapElements[l].height;
if(!(c-s<o&&o<h+s&&p-s<a&&a<d+s||c-s<o&&o<h+s&&p-s<f&&f<d+s||c-s<u&&u<h+s&&p-s<a&&a<d+s||c-s<u&&u<h+s&&p-s<f&&f<d+s)){r.snapElements[l].snapping&&r.options.snap.release&&r.options.snap.release.call(r.element,t,e.extend(r._uiHash(),{snapItem:r.snapElements[l].item})),r.snapElements[l].snapping=!1;
continue;
}if(i.snapMode!="inner"){var v=Math.abs(p-f)<=s,m=Math.abs(d-a)<=s,g=Math.abs(c-u)<=s,y=Math.abs(h-o)<=s;
v&&(n.position.top=r._convertPositionTo("relative",{top:p-r.helperProportions.height,left:0}).top-r.margins.top),m&&(n.position.top=r._convertPositionTo("relative",{top:d,left:0}).top-r.margins.top),g&&(n.position.left=r._convertPositionTo("relative",{top:0,left:c-r.helperProportions.width}).left-r.margins.left),y&&(n.position.left=r._convertPositionTo("relative",{top:0,left:h}).left-r.margins.left);
}var b=v||m||g||y;
if(i.snapMode!="outer"){var v=Math.abs(p-a)<=s,m=Math.abs(d-f)<=s,g=Math.abs(c-o)<=s,y=Math.abs(h-u)<=s;
v&&(n.position.top=r._convertPositionTo("relative",{top:p,left:0}).top-r.margins.top),m&&(n.position.top=r._convertPositionTo("relative",{top:d-r.helperProportions.height,left:0}).top-r.margins.top),g&&(n.position.left=r._convertPositionTo("relative",{top:0,left:c}).left-r.margins.left),y&&(n.position.left=r._convertPositionTo("relative",{top:0,left:h-r.helperProportions.width}).left-r.margins.left);
}!r.snapElements[l].snapping&&(v||m||g||y||b)&&r.options.snap.snap&&r.options.snap.snap.call(r.element,t,e.extend(r._uiHash(),{snapItem:r.snapElements[l].item})),r.snapElements[l].snapping=v||m||g||y||b;
}}}),e.ui.plugin.add("draggable","stack",{start:function(t,n){var r=e(this).data("draggable").options,i=e.makeArray(e(r.stack)).sort(function(t,n){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(n).css("zIndex"),10)||0);
});
if(!i.length){return;
}var s=parseInt(i[0].style.zIndex)||0;
e(i).each(function(e){this.style.zIndex=s+e;
}),this[0].style.zIndex=s+i.length;
}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,n){var r=e(n.helper),i=e(this).data("draggable").options;
r.css("zIndex")&&(i._zIndex=r.css("zIndex")),r.css("zIndex",i.zIndex);
},stop:function(t,n){var r=e(this).data("draggable").options;
r._zIndex&&e(n.helper).css("zIndex",r._zIndex);
}});
})(jQuery);
(function(e,t){e.widget("ui.droppable",{version:"1.9.1",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect"},_create:function(){var t=this.options,n=t.accept;
this.isover=0,this.isout=1,this.accept=e.isFunction(n)?n:function(e){return e.is(n);
},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},e.ui.ddmanager.droppables[t.scope]=e.ui.ddmanager.droppables[t.scope]||[],e.ui.ddmanager.droppables[t.scope].push(this),t.addClasses&&this.element.addClass("ui-droppable");
},_destroy:function(){var t=e.ui.ddmanager.droppables[this.options.scope];
for(var n=0;
n<t.length;
n++){t[n]==this&&t.splice(n,1);
}this.element.removeClass("ui-droppable ui-droppable-disabled");
},_setOption:function(t,n){t=="accept"&&(this.accept=e.isFunction(n)?n:function(e){return e.is(n);
}),e.Widget.prototype._setOption.apply(this,arguments);
},_activate:function(t){var n=e.ui.ddmanager.current;
this.options.activeClass&&this.element.addClass(this.options.activeClass),n&&this._trigger("activate",t,this.ui(n));
},_deactivate:function(t){var n=e.ui.ddmanager.current;
this.options.activeClass&&this.element.removeClass(this.options.activeClass),n&&this._trigger("deactivate",t,this.ui(n));
},_over:function(t){var n=e.ui.ddmanager.current;
if(!n||(n.currentItem||n.element)[0]==this.element[0]){return;
}this.accept.call(this.element[0],n.currentItem||n.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(n)));
},_out:function(t){var n=e.ui.ddmanager.current;
if(!n||(n.currentItem||n.element)[0]==this.element[0]){return;
}this.accept.call(this.element[0],n.currentItem||n.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(n)));
},_drop:function(t,n){var r=n||e.ui.ddmanager.current;
if(!r||(r.currentItem||r.element)[0]==this.element[0]){return !1;
}var i=!1;
return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var t=e.data(this,"droppable");
if(t.options.greedy&&!t.options.disabled&&t.options.scope==r.options.scope&&t.accept.call(t.element[0],r.currentItem||r.element)&&e.ui.intersect(r,e.extend(t,{offset:t.element.offset()}),t.options.tolerance)){return i=!0,!1;
}}),i?!1:this.accept.call(this.element[0],r.currentItem||r.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(r)),this.element):!1;
},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs};
}}),e.ui.intersect=function(t,n,r){if(!n.offset){return !1;
}var i=(t.positionAbs||t.position.absolute).left,s=i+t.helperProportions.width,o=(t.positionAbs||t.position.absolute).top,u=o+t.helperProportions.height,a=n.offset.left,f=a+n.proportions.width,l=n.offset.top,c=l+n.proportions.height;
switch(r){case"fit":return a<=i&&s<=f&&l<=o&&u<=c;
case"intersect":return a<i+t.helperProportions.width/2&&s-t.helperProportions.width/2<f&&l<o+t.helperProportions.height/2&&u-t.helperProportions.height/2<c;
case"pointer":var h=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,p=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,d=e.ui.isOver(p,h,l,a,n.proportions.height,n.proportions.width);
return d;
case"touch":return(o>=l&&o<=c||u>=l&&u<=c||o<l&&u>c)&&(i>=a&&i<=f||s>=a&&s<=f||i<a&&s>f);
default:return !1;
}},e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,n){var r=e.ui.ddmanager.droppables[t.options.scope]||[],i=n?n.type:null,s=(t.currentItem||t.element).find(":data(droppable)").andSelf();
e:for(var o=0;
o<r.length;
o++){if(r[o].options.disabled||t&&!r[o].accept.call(r[o].element[0],t.currentItem||t.element)){continue;
}for(var u=0;
u<s.length;
u++){if(s[u]==r[o].element[0]){r[o].proportions.height=0;
continue e;
}}r[o].visible=r[o].element.css("display")!="none";
if(!r[o].visible){continue;
}i=="mousedown"&&r[o]._activate.call(r[o],n),r[o].offset=r[o].element.offset(),r[o].proportions={width:r[o].element[0].offsetWidth,height:r[o].element[0].offsetHeight};
}},drop:function(t,n){var r=!1;
return e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options){return;
}!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance)&&(r=this._drop.call(this,n)||r),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=1,this.isover=0,this._deactivate.call(this,n));
}),r;
},dragStart:function(t,n){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,n);
});
},drag:function(t,n){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,n),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible){return;
}var r=e.ui.intersect(t,this,this.options.tolerance),i=!r&&this.isover==1?"isout":r&&this.isover==0?"isover":null;
if(!i){return;
}var s;
if(this.options.greedy){var o=this.options.scope,u=this.element.parents(":data(droppable)").filter(function(){return e.data(this,"droppable").options.scope===o;
});
u.length&&(s=e.data(u[0],"droppable"),s.greedyChild=i=="isover"?1:0);
}s&&i=="isover"&&(s.isover=0,s.isout=1,s._out.call(s,n)),this[i]=1,this[i=="isout"?"isover":"isout"]=0,this[i=="isover"?"_over":"_out"].call(this,n),s&&i=="isout"&&(s.isout=0,s.isover=1,s._over.call(s,n));
});
},dragStop:function(t,n){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,n);
}};
})(jQuery);
jQuery.effects||function(e,t){var n=e.uiBackCompat!==!1,r="ui-effects-";
e.effects={effect:{}},function(t,n){function p(e,t,n){var r=a[t.type]||{};
return e==null?n||!t.def?null:t.def:(e=r.floor?~~e:parseFloat(e),isNaN(e)?t.def:r.mod?(e+r.mod)%r.mod:0>e?0:r.max<e?r.max:e);
}function d(e){var n=o(),r=n._rgba=[];
return e=e.toLowerCase(),h(s,function(t,i){var s,o=i.re.exec(e),a=o&&i.parse(o),f=i.space||"rgba";
if(a){return s=n[f](a),n[u[f].cache]=s[u[f].cache],r=n._rgba=s._rgba,!1;
}}),r.length?(r.join()==="0,0,0,0"&&t.extend(r,c.transparent),n):c[e];
}function v(e,t,n){return n=(n+1)%1,n*6<1?e+(t-e)*n*6:n*2<1?t:n*3<2?e+(t-e)*(2/3-n)*6:e;
}var r="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),i=/^([\-+])=\s*(\d+\.?\d*)/,s=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1],e[2],e[3],e[4]];
}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1]*2.55,e[2]*2.55,e[3]*2.55,e[4]];
}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)];
}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)];
}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(e){return[e[1],e[2]/100,e[3]/100,e[4]];
}}],o=t.Color=function(e,n,r,i){return new t.Color.fn.parse(e,n,r,i);
},u={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},a={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},f=o.support={},l=t("<p>")[0],c,h=t.each;
l.style.cssText="background-color:rgba(1,1,1,.5)",f.rgba=l.style.backgroundColor.indexOf("rgba")>-1,h(u,function(e,t){t.cache="_"+e,t.props.alpha={idx:3,type:"percent",def:1};
}),o.fn=t.extend(o.prototype,{parse:function(r,i,s,a){if(r===n){return this._rgba=[null,null,null,null],this;
}if(r.jquery||r.nodeType){r=t(r).css(i),i=n;
}var f=this,l=t.type(r),v=this._rgba=[];
i!==n&&(r=[r,i,s,a],l="array");
if(l==="string"){return this.parse(d(r)||c._default);
}if(l==="array"){return h(u.rgba.props,function(e,t){v[t.idx]=p(r[t.idx],t);
}),this;
}if(l==="object"){return r instanceof o?h(u,function(e,t){r[t.cache]&&(f[t.cache]=r[t.cache].slice());
}):h(u,function(t,n){var i=n.cache;
h(n.props,function(e,t){if(!f[i]&&n.to){if(e==="alpha"||r[e]==null){return;
}f[i]=n.to(f._rgba);
}f[i][t.idx]=p(r[e],t,!0);
}),f[i]&&e.inArray(null,f[i].slice(0,3))<0&&(f[i][3]=1,n.from&&(f._rgba=n.from(f[i])));
}),this;
}},is:function(e){var t=o(e),n=!0,r=this;
return h(u,function(e,i){var s,o=t[i.cache];
return o&&(s=r[i.cache]||i.to&&i.to(r._rgba)||[],h(i.props,function(e,t){if(o[t.idx]!=null){return n=o[t.idx]===s[t.idx],n;
}})),n;
}),n;
},_space:function(){var e=[],t=this;
return h(u,function(n,r){t[r.cache]&&e.push(n);
}),e.pop();
},transition:function(e,t){var n=o(e),r=n._space(),i=u[r],s=this.alpha()===0?o("transparent"):this,f=s[i.cache]||i.to(s._rgba),l=f.slice();
return n=n[i.cache],h(i.props,function(e,r){var i=r.idx,s=f[i],o=n[i],u=a[r.type]||{};
if(o===null){return;
}s===null?l[i]=o:(u.mod&&(o-s>u.mod/2?s+=u.mod:s-o>u.mod/2&&(s-=u.mod)),l[i]=p((o-s)*t+s,r));
}),this[r](l);
},blend:function(e){if(this._rgba[3]===1){return this;
}var n=this._rgba.slice(),r=n.pop(),i=o(e)._rgba;
return o(t.map(n,function(e,t){return(1-r)*i[t]+r*e;
}));
},toRgbaString:function(){var e="rgba(",n=t.map(this._rgba,function(e,t){return e==null?t>2?1:0:e;
});
return n[3]===1&&(n.pop(),e="rgb("),e+n.join()+")";
},toHslaString:function(){var e="hsla(",n=t.map(this.hsla(),function(e,t){return e==null&&(e=t>2?1:0),t&&t<3&&(e=Math.round(e*100)+"%"),e;
});
return n[3]===1&&(n.pop(),e="hsl("),e+n.join()+")";
},toHexString:function(e){var n=this._rgba.slice(),r=n.pop();
return e&&n.push(~~(r*255)),"#"+t.map(n,function(e){return e=(e||0).toString(16),e.length===1?"0"+e:e;
}).join("");
},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString();
}}),o.fn.parse.prototype=o.fn,u.hsla.to=function(e){if(e[0]==null||e[1]==null||e[2]==null){return[null,null,null,e[3]];
}var t=e[0]/255,n=e[1]/255,r=e[2]/255,i=e[3],s=Math.max(t,n,r),o=Math.min(t,n,r),u=s-o,a=s+o,f=a*0.5,l,c;
return o===s?l=0:t===s?l=60*(n-r)/u+360:n===s?l=60*(r-t)/u+120:l=60*(t-n)/u+240,f===0||f===1?c=f:f<=0.5?c=u/a:c=u/(2-a),[Math.round(l)%360,c,f,i==null?1:i];
},u.hsla.from=function(e){if(e[0]==null||e[1]==null||e[2]==null){return[null,null,null,e[3]];
}var t=e[0]/360,n=e[1],r=e[2],i=e[3],s=r<=0.5?r*(1+n):r+n-r*n,o=2*r-s;
return[Math.round(v(o,s,t+1/3)*255),Math.round(v(o,s,t)*255),Math.round(v(o,s,t-1/3)*255),i];
},h(u,function(e,r){var s=r.props,u=r.cache,a=r.to,f=r.from;
o.fn[e]=function(e){a&&!this[u]&&(this[u]=a(this._rgba));
if(e===n){return this[u].slice();
}var r,i=t.type(e),l=i==="array"||i==="object"?e:arguments,c=this[u].slice();
return h(s,function(e,t){var n=l[i==="object"?e:t.idx];
n==null&&(n=c[t.idx]),c[t.idx]=p(n,t);
}),f?(r=o(f(c)),r[u]=c,r):o(c);
},h(s,function(n,r){if(o.fn[n]){return;
}o.fn[n]=function(s){var o=t.type(s),u=n==="alpha"?this._hsla?"hsla":"rgba":e,a=this[u](),f=a[r.idx],l;
return o==="undefined"?f:(o==="function"&&(s=s.call(this,f),o=t.type(s)),s==null&&r.empty?this:(o==="string"&&(l=i.exec(s),l&&(s=f+parseFloat(l[2])*(l[1]==="+"?1:-1))),a[r.idx]=s,this[u](a)));
};
});
}),h(r,function(e,n){t.cssHooks[n]={set:function(e,r){var i,s,u="";
if(t.type(r)!=="string"||(i=d(r))){r=o(i||r);
if(!f.rgba&&r._rgba[3]!==1){s=n==="backgroundColor"?e.parentNode:e;
while((u===""||u==="transparent")&&s&&s.style){try{u=t.css(s,"backgroundColor"),s=s.parentNode;
}catch(a){}}r=r.blend(u&&u!=="transparent"?u:"_default");
}r=r.toRgbaString();
}try{e.style[n]=r;
}catch(l){}}},t.fx.step[n]=function(e){e.colorInit||(e.start=o(e.elem,n),e.end=o(e.end),e.colorInit=!0),t.cssHooks[n].set(e.elem,e.start.transition(e.end,e.pos));
};
}),t.cssHooks.borderColor={expand:function(e){var t={};
return h(["Top","Right","Bottom","Left"],function(n,r){t["border"+r+"Color"]=e;
}),t;
}},c=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"};
}(jQuery),function(){function i(){var t=this.ownerDocument.defaultView?this.ownerDocument.defaultView.getComputedStyle(this,null):this.currentStyle,n={},r,i;
if(t&&t.length&&t[0]&&t[t[0]]){i=t.length;
while(i--){r=t[i],typeof t[r]=="string"&&(n[e.camelCase(r)]=t[r]);
}}else{for(r in t){typeof t[r]=="string"&&(n[r]=t[r]);
}}return n;
}function s(t,n){var i={},s,o;
for(s in n){o=n[s],t[s]!==o&&!r[s]&&(e.fx.step[s]||!isNaN(parseFloat(o)))&&(i[s]=o);
}return i;
}var n=["add","remove","toggle"],r={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};
e.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,n){e.fx.step[n]=function(e){if(e.end!=="none"&&!e.setAttr||e.pos===1&&!e.setAttr){jQuery.style(e.elem,n,e.end),e.setAttr=!0;
}};
}),e.effects.animateClass=function(t,r,o,u){var a=e.speed(r,o,u);
return this.queue(function(){var r=e(this),o=r.attr("class")||"",u,f=a.children?r.find("*").andSelf():r;
f=f.map(function(){var t=e(this);
return{el:t,start:i.call(this)};
}),u=function(){e.each(n,function(e,n){t[n]&&r[n+"Class"](t[n]);
});
},u(),f=f.map(function(){return this.end=i.call(this.el[0]),this.diff=s(this.start,this.end),this;
}),r.attr("class",o),f=f.map(function(){var t=this,n=e.Deferred(),r=jQuery.extend({},a,{queue:!1,complete:function(){n.resolve(t);
}});
return this.el.animate(this.diff,r),n.promise();
}),e.when.apply(e,f.get()).done(function(){u(),e.each(arguments,function(){var t=this.el;
e.each(this.diff,function(e){t.css(e,"");
});
}),a.complete.call(r[0]);
});
});
},e.fn.extend({_addClass:e.fn.addClass,addClass:function(t,n,r,i){return n?e.effects.animateClass.call(this,{add:t},n,r,i):this._addClass(t);
},_removeClass:e.fn.removeClass,removeClass:function(t,n,r,i){return n?e.effects.animateClass.call(this,{remove:t},n,r,i):this._removeClass(t);
},_toggleClass:e.fn.toggleClass,toggleClass:function(n,r,i,s,o){return typeof r=="boolean"||r===t?i?e.effects.animateClass.call(this,r?{add:n}:{remove:n},i,s,o):this._toggleClass(n,r):e.effects.animateClass.call(this,{toggle:n},r,i,s);
},switchClass:function(t,n,r,i,s){return e.effects.animateClass.call(this,{add:n,remove:t},r,i,s);
}});
}(),function(){function i(t,n,r,i){e.isPlainObject(t)&&(n=t,t=t.effect),t={effect:t},n==null&&(n={}),e.isFunction(n)&&(i=n,r=null,n={});
if(typeof n=="number"||e.fx.speeds[n]){i=r,r=n,n={};
}return e.isFunction(r)&&(i=r,r=null),n&&e.extend(t,n),r=r||n.duration,t.duration=e.fx.off?0:typeof r=="number"?r:r in e.fx.speeds?e.fx.speeds[r]:e.fx.speeds._default,t.complete=i||n.complete,t;
}function s(t){return !t||typeof t=="number"||e.fx.speeds[t]?!0:typeof t=="string"&&!e.effects.effect[t]?n&&e.effects[t]?!1:!0:!1;
}e.extend(e.effects,{version:"1.9.1",save:function(e,t){for(var n=0;
n<t.length;
n++){t[n]!==null&&e.data(r+t[n],e[0].style[t[n]]);
}},restore:function(e,n){var i,s;
for(s=0;
s<n.length;
s++){n[s]!==null&&(i=e.data(r+n[s]),i===t&&(i=""),e.css(n[s],i));
}},setMode:function(e,t){return t==="toggle"&&(t=e.is(":hidden")?"show":"hide"),t;
},getBaseline:function(e,t){var n,r;
switch(e[0]){case"top":n=0;
break;
case"middle":n=0.5;
break;
case"bottom":n=1;
break;
default:n=e[0]/t.height;
}switch(e[1]){case"left":r=0;
break;
case"center":r=0.5;
break;
case"right":r=1;
break;
default:r=e[1]/t.width;
}return{x:r,y:n};
},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper")){return t.parent();
}var n={width:t.outerWidth(!0),height:t.outerHeight(!0),"float":t.css("float")},r=e("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),i={width:t.width(),height:t.height()},s=document.activeElement;
try{s.id;
}catch(o){s=document.body;
}return t.wrap(r),(t[0]===s||e.contains(t[0],s))&&e(s).focus(),r=t.parent(),t.css("position")==="static"?(r.css({position:"relative"}),t.css({position:"relative"})):(e.extend(n,{position:t.css("position"),zIndex:t.css("z-index")}),e.each(["top","left","bottom","right"],function(e,r){n[r]=t.css(r),isNaN(parseInt(n[r],10))&&(n[r]="auto");
}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(i),r.css(n).show();
},removeWrapper:function(t){var n=document.activeElement;
return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===n||e.contains(t[0],n))&&e(n).focus()),t;
},setTransition:function(t,n,r,i){return i=i||{},e.each(n,function(e,n){var s=t.cssUnit(n);
s[0]>0&&(i[n]=s[0]*r+s[1]);
}),i;
}}),e.fn.extend({effect:function(){function a(n){function u(){e.isFunction(i)&&i.call(r[0]),e.isFunction(n)&&n();
}var r=e(this),i=t.complete,s=t.mode;
(r.is(":hidden")?s==="hide":s==="show")?u():o.call(r[0],t,u);
}var t=i.apply(this,arguments),r=t.mode,s=t.queue,o=e.effects.effect[t.effect],u=!o&&n&&e.effects[t.effect];
return e.fx.off||!o&&!u?r?this[r](t.duration,t.complete):this.each(function(){t.complete&&t.complete.call(this);
}):o?s===!1?this.each(a):this.queue(s||"fx",a):u.call(this,{options:t,duration:t.duration,callback:t.complete,mode:t.mode});
},_show:e.fn.show,show:function(e){if(s(e)){return this._show.apply(this,arguments);
}var t=i.apply(this,arguments);
return t.mode="show",this.effect.call(this,t);
},_hide:e.fn.hide,hide:function(e){if(s(e)){return this._hide.apply(this,arguments);
}var t=i.apply(this,arguments);
return t.mode="hide",this.effect.call(this,t);
},__toggle:e.fn.toggle,toggle:function(t){if(s(t)||typeof t=="boolean"||e.isFunction(t)){return this.__toggle.apply(this,arguments);
}var n=i.apply(this,arguments);
return n.mode="toggle",this.effect.call(this,n);
},cssUnit:function(t){var n=this.css(t),r=[];
return e.each(["em","px","%","pt"],function(e,t){n.indexOf(t)>0&&(r=[parseFloat(n),t]);
}),r;
}});
}(),function(){var t={};
e.each(["Quad","Cubic","Quart","Quint","Expo"],function(e,n){t[n]=function(t){return Math.pow(t,e+2);
};
}),e.extend(t,{Sine:function(e){return 1-Math.cos(e*Math.PI/2);
},Circ:function(e){return 1-Math.sqrt(1-e*e);
},Elastic:function(e){return e===0||e===1?e:-Math.pow(2,8*(e-1))*Math.sin(((e-1)*80-7.5)*Math.PI/15);
},Back:function(e){return e*e*(3*e-2);
},Bounce:function(e){var t,n=4;
while(e<((t=Math.pow(2,--n))-1)/11){}return 1/Math.pow(4,3-n)-7.5625*Math.pow((t*3-2)/22-e,2);
}}),e.each(t,function(t,n){e.easing["easeIn"+t]=n,e.easing["easeOut"+t]=function(e){return 1-n(1-e);
},e.easing["easeInOut"+t]=function(e){return e<0.5?n(e*2)/2:1-n(e*-2+2)/2;
};
});
}();
}(jQuery);
(function(e,t){var n=/up|down|vertical/,r=/up|left|vertical|horizontal/;
e.effects.effect.blind=function(t,i){var s=e(this),o=["position","top","bottom","left","right","height","width"],u=e.effects.setMode(s,t.mode||"hide"),a=t.direction||"up",f=n.test(a),l=f?"height":"width",c=f?"top":"left",h=r.test(a),p={},d=u==="show",v,m,g;
s.parent().is(".ui-effects-wrapper")?e.effects.save(s.parent(),o):e.effects.save(s,o),s.show(),v=e.effects.createWrapper(s).css({overflow:"hidden"}),m=v[l](),g=parseFloat(v.css(c))||0,p[l]=d?m:0,h||(s.css(f?"bottom":"right",0).css(f?"top":"left","auto").css({position:"absolute"}),p[c]=d?g:m+g),d&&(v.css(l,0),h||v.css(c,g+m)),v.animate(p,{duration:t.duration,easing:t.easing,queue:!1,complete:function(){u==="hide"&&s.hide(),e.effects.restore(s,o),e.effects.removeWrapper(s),i();
}});
};
})(jQuery);
(function(e,t){e.effects.effect.bounce=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"effect"),o=s==="hide",u=s==="show",a=t.direction||"up",f=t.distance,l=t.times||5,c=l*2+(u||o?1:0),h=t.duration/c,p=t.easing,d=a==="up"||a==="down"?"top":"left",v=a==="up"||a==="left",m,g,y,b=r.queue(),w=b.length;
(u||o)&&i.push("opacity"),e.effects.save(r,i),r.show(),e.effects.createWrapper(r),f||(f=r[d==="top"?"outerHeight":"outerWidth"]()/3),u&&(y={opacity:1},y[d]=0,r.css("opacity",0).css(d,v?-f*2:f*2).animate(y,h,p)),o&&(f/=Math.pow(2,l-1)),y={},y[d]=0;
for(m=0;
m<l;
m++){g={},g[d]=(v?"-=":"+=")+f,r.animate(g,h,p).animate(y,h,p),f=o?f*2:f/2;
}o&&(g={opacity:0},g[d]=(v?"-=":"+=")+f,r.animate(g,h,p)),r.queue(function(){o&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n();
}),w>1&&b.splice.apply(b,[1,0].concat(b.splice(w,c+1))),r.dequeue();
};
})(jQuery);
(function(e,t){e.effects.effect.clip=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"hide"),o=s==="show",u=t.direction||"vertical",a=u==="vertical",f=a?"height":"width",l=a?"top":"left",c={},h,p,d;
e.effects.save(r,i),r.show(),h=e.effects.createWrapper(r).css({overflow:"hidden"}),p=r[0].tagName==="IMG"?h:r,d=p[f](),o&&(p.css(f,0),p.css(l,d/2)),c[f]=o?d:0,c[l]=o?0:d/2,p.animate(c,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){o||r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n();
}});
};
})(jQuery);
(function(e,t){e.effects.effect.drop=function(t,n){var r=e(this),i=["position","top","bottom","left","right","opacity","height","width"],s=e.effects.setMode(r,t.mode||"hide"),o=s==="show",u=t.direction||"left",a=u==="up"||u==="down"?"top":"left",f=u==="up"||u==="left"?"pos":"neg",l={opacity:o?1:0},c;
e.effects.save(r,i),r.show(),e.effects.createWrapper(r),c=t.distance||r[a==="top"?"outerHeight":"outerWidth"](!0)/2,o&&r.css("opacity",0).css(a,f==="pos"?-c:c),l[a]=(o?f==="pos"?"+=":"-=":f==="pos"?"-=":"+=")+c,r.animate(l,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){s==="hide"&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n();
}});
};
})(jQuery);
(function(e,t){e.effects.effect.explode=function(t,n){function y(){c.push(this),c.length===r*i&&b();
}function b(){s.css({visibility:"visible"}),e(c).remove(),u||s.hide(),n();
}var r=t.pieces?Math.round(Math.sqrt(t.pieces)):3,i=r,s=e(this),o=e.effects.setMode(s,t.mode||"hide"),u=o==="show",a=s.show().css("visibility","hidden").offset(),f=Math.ceil(s.outerWidth()/i),l=Math.ceil(s.outerHeight()/r),c=[],h,p,d,v,m,g;
for(h=0;
h<r;
h++){v=a.top+h*l,g=h-(r-1)/2;
for(p=0;
p<i;
p++){d=a.left+p*f,m=p-(i-1)/2,s.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-p*f,top:-h*l}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:f,height:l,left:d+(u?m*f:0),top:v+(u?g*l:0),opacity:u?0:1}).animate({left:d+(u?0:m*f),top:v+(u?0:g*l),opacity:u?1:0},t.duration||500,t.easing,y);
}}};
})(jQuery);
(function(e,t){e.effects.effect.fade=function(t,n){var r=e(this),i=e.effects.setMode(r,t.mode||"toggle");
r.animate({opacity:i},{queue:!1,duration:t.duration,easing:t.easing,complete:n});
};
})(jQuery);
(function(e,t){e.effects.effect.fold=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"hide"),o=s==="show",u=s==="hide",a=t.size||15,f=/([0-9]+)%/.exec(a),l=!!t.horizFirst,c=o!==l,h=c?["width","height"]:["height","width"],p=t.duration/2,d,v,m={},g={};
e.effects.save(r,i),r.show(),d=e.effects.createWrapper(r).css({overflow:"hidden"}),v=c?[d.width(),d.height()]:[d.height(),d.width()],f&&(a=parseInt(f[1],10)/100*v[u?0:1]),o&&d.css(l?{height:0,width:a}:{height:a,width:0}),m[h[0]]=o?v[0]:a,g[h[1]]=o?v[1]:0,d.animate(m,p,t.easing).animate(g,p,t.easing,function(){u&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n();
});
};
})(jQuery);
(function(e,t){e.effects.effect.highlight=function(t,n){var r=e(this),i=["backgroundImage","backgroundColor","opacity"],s=e.effects.setMode(r,t.mode||"show"),o={backgroundColor:r.css("backgroundColor")};
s==="hide"&&(o.opacity=0),e.effects.save(r,i),r.show().css({backgroundImage:"none",backgroundColor:t.color||"#ffff99"}).animate(o,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){s==="hide"&&r.hide(),e.effects.restore(r,i),n();
}});
};
})(jQuery);
(function(e,t){e.effects.effect.pulsate=function(t,n){var r=e(this),i=e.effects.setMode(r,t.mode||"show"),s=i==="show",o=i==="hide",u=s||i==="hide",a=(t.times||5)*2+(u?1:0),f=t.duration/a,l=0,c=r.queue(),h=c.length,p;
if(s||!r.is(":visible")){r.css("opacity",0).show(),l=1;
}for(p=1;
p<a;
p++){r.animate({opacity:l},f,t.easing),l=1-l;
}r.animate({opacity:l},f,t.easing),r.queue(function(){o&&r.hide(),n();
}),h>1&&c.splice.apply(c,[1,0].concat(c.splice(h,a+1))),r.dequeue();
};
})(jQuery);
(function(e,t){e.effects.effect.puff=function(t,n){var r=e(this),i=e.effects.setMode(r,t.mode||"hide"),s=i==="hide",o=parseInt(t.percent,10)||150,u=o/100,a={height:r.height(),width:r.width()};
e.extend(t,{effect:"scale",queue:!1,fade:!0,mode:i,complete:n,percent:s?o:100,from:s?a:{height:a.height*u,width:a.width*u}}),r.effect(t);
},e.effects.effect.scale=function(t,n){var r=e(this),i=e.extend(!0,{},t),s=e.effects.setMode(r,t.mode||"effect"),o=parseInt(t.percent,10)||(parseInt(t.percent,10)===0?0:s==="hide"?0:100),u=t.direction||"both",a=t.origin,f={height:r.height(),width:r.width(),outerHeight:r.outerHeight(),outerWidth:r.outerWidth()},l={y:u!=="horizontal"?o/100:1,x:u!=="vertical"?o/100:1};
i.effect="size",i.queue=!1,i.complete=n,s!=="effect"&&(i.origin=a||["middle","center"],i.restore=!0),i.from=t.from||(s==="show"?{height:0,width:0}:f),i.to={height:f.height*l.y,width:f.width*l.x,outerHeight:f.outerHeight*l.y,outerWidth:f.outerWidth*l.x},i.fade&&(s==="show"&&(i.from.opacity=0,i.to.opacity=1),s==="hide"&&(i.from.opacity=1,i.to.opacity=0)),r.effect(i);
},e.effects.effect.size=function(t,n){var r,i,s,o=e(this),u=["position","top","bottom","left","right","width","height","overflow","opacity"],a=["position","top","bottom","left","right","overflow","opacity"],f=["width","height","overflow"],l=["fontSize"],c=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],h=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=e.effects.setMode(o,t.mode||"effect"),d=t.restore||p!=="effect",v=t.scale||"both",m=t.origin||["middle","center"],g=o.css("position"),y=d?u:a,b={height:0,width:0};
p==="show"&&o.show(),r={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},t.mode==="toggle"&&p==="show"?(o.from=t.to||b,o.to=t.from||r):(o.from=t.from||(p==="show"?b:r),o.to=t.to||(p==="hide"?b:r)),s={from:{y:o.from.height/r.height,x:o.from.width/r.width},to:{y:o.to.height/r.height,x:o.to.width/r.width}};
if(v==="box"||v==="both"){s.from.y!==s.to.y&&(y=y.concat(c),o.from=e.effects.setTransition(o,c,s.from.y,o.from),o.to=e.effects.setTransition(o,c,s.to.y,o.to)),s.from.x!==s.to.x&&(y=y.concat(h),o.from=e.effects.setTransition(o,h,s.from.x,o.from),o.to=e.effects.setTransition(o,h,s.to.x,o.to));
}(v==="content"||v==="both")&&s.from.y!==s.to.y&&(y=y.concat(l).concat(f),o.from=e.effects.setTransition(o,l,s.from.y,o.from),o.to=e.effects.setTransition(o,l,s.to.y,o.to)),e.effects.save(o,y),o.show(),e.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),m&&(i=e.effects.getBaseline(m,r),o.from.top=(r.outerHeight-o.outerHeight())*i.y,o.from.left=(r.outerWidth-o.outerWidth())*i.x,o.to.top=(r.outerHeight-o.to.outerHeight)*i.y,o.to.left=(r.outerWidth-o.to.outerWidth)*i.x),o.css(o.from);
if(v==="content"||v==="both"){c=c.concat(["marginTop","marginBottom"]).concat(l),h=h.concat(["marginLeft","marginRight"]),f=u.concat(c).concat(h),o.find("*[width]").each(function(){var n=e(this),r={height:n.height(),width:n.width()};
d&&e.effects.save(n,f),n.from={height:r.height*s.from.y,width:r.width*s.from.x},n.to={height:r.height*s.to.y,width:r.width*s.to.x},s.from.y!==s.to.y&&(n.from=e.effects.setTransition(n,c,s.from.y,n.from),n.to=e.effects.setTransition(n,c,s.to.y,n.to)),s.from.x!==s.to.x&&(n.from=e.effects.setTransition(n,h,s.from.x,n.from),n.to=e.effects.setTransition(n,h,s.to.x,n.to)),n.css(n.from),n.animate(n.to,t.duration,t.easing,function(){d&&e.effects.restore(n,f);
});
});
}o.animate(o.to,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){o.to.opacity===0&&o.css("opacity",o.from.opacity),p==="hide"&&o.hide(),e.effects.restore(o,y),d||(g==="static"?o.css({position:"relative",top:o.to.top,left:o.to.left}):e.each(["top","left"],function(e,t){o.css(t,function(t,n){var r=parseInt(n,10),i=e?o.to.left:o.to.top;
return n==="auto"?i+"px":r+i+"px";
});
})),e.effects.removeWrapper(o),n();
}});
};
})(jQuery);
(function(e,t){e.effects.effect.shake=function(t,n){var r=e(this),i=["position","top","bottom","left","right","height","width"],s=e.effects.setMode(r,t.mode||"effect"),o=t.direction||"left",u=t.distance||20,a=t.times||3,f=a*2+1,l=Math.round(t.duration/f),c=o==="up"||o==="down"?"top":"left",h=o==="up"||o==="left",p={},d={},v={},m,g=r.queue(),y=g.length;
e.effects.save(r,i),r.show(),e.effects.createWrapper(r),p[c]=(h?"-=":"+=")+u,d[c]=(h?"+=":"-=")+u*2,v[c]=(h?"-=":"+=")+u*2,r.animate(p,l,t.easing);
for(m=1;
m<a;
m++){r.animate(d,l,t.easing).animate(v,l,t.easing);
}r.animate(d,l,t.easing).animate(p,l/2,t.easing).queue(function(){s==="hide"&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n();
}),y>1&&g.splice.apply(g,[1,0].concat(g.splice(y,f+1))),r.dequeue();
};
})(jQuery);
(function(e,t){e.effects.effect.slide=function(t,n){var r=e(this),i=["position","top","bottom","left","right","width","height"],s=e.effects.setMode(r,t.mode||"show"),o=s==="show",u=t.direction||"left",a=u==="up"||u==="down"?"top":"left",f=u==="up"||u==="left",l,c={};
e.effects.save(r,i),r.show(),l=t.distance||r[a==="top"?"outerHeight":"outerWidth"](!0),e.effects.createWrapper(r).css({overflow:"hidden"}),o&&r.css(a,f?isNaN(l)?"-"+l:-l:l),c[a]=(o?f?"+=":"-=":f?"-=":"+=")+l,r.animate(c,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){s==="hide"&&r.hide(),e.effects.restore(r,i),e.effects.removeWrapper(r),n();
}});
};
})(jQuery);
(function(e,t){e.effects.effect.transfer=function(t,n){var r=e(this),i=e(t.to),s=i.css("position")==="fixed",o=e("body"),u=s?o.scrollTop():0,a=s?o.scrollLeft():0,f=i.offset(),l={top:f.top-u,left:f.left-a,height:i.innerHeight(),width:i.innerWidth()},c=r.offset(),h=e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(t.className).css({top:c.top-u,left:c.left-a,height:r.innerHeight(),width:r.innerWidth(),position:s?"fixed":"absolute"}).animate(l,t.duration,t.easing,function(){h.remove(),n();
});
};
})(jQuery);
(function(e,t){var n=!1;
e.widget("ui.menu",{version:"1.9.1",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,e.proxy(function(e){this.options.disabled&&e.preventDefault();
},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(e){e.preventDefault();
},"click .ui-state-disabled > a":function(e){e.preventDefault();
},"click .ui-menu-item:has(a)":function(t){var r=e(t.target).closest(".ui-menu-item");
!n&&r.not(".ui-state-disabled").length&&(n=!0,this.select(t),r.has(".ui-menu").length?this.expand(t):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&this.active.parents(".ui-menu").length===1&&clearTimeout(this.timer)));
},"mouseenter .ui-menu-item":function(t){var n=e(t.currentTarget);
n.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(t,n);
},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(e,t){var n=this.active||this.element.children(".ui-menu-item").eq(0);
t||this.focus(e,n);
},blur:function(t){this._delay(function(){e.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t);
});
},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){e(t.target).closest(".ui-menu").length||this.collapseAll(t),n=!1;
}});
},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").andSelf().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);
t.data("ui-menu-submenu-carat")&&t.remove();
}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content");
},_keydown:function(t){function a(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");
}var n,r,i,s,o,u=!0;
switch(t.keyCode){case e.ui.keyCode.PAGE_UP:this.previousPage(t);
break;
case e.ui.keyCode.PAGE_DOWN:this.nextPage(t);
break;
case e.ui.keyCode.HOME:this._move("first","first",t);
break;
case e.ui.keyCode.END:this._move("last","last",t);
break;
case e.ui.keyCode.UP:this.previous(t);
break;
case e.ui.keyCode.DOWN:this.next(t);
break;
case e.ui.keyCode.LEFT:this.collapse(t);
break;
case e.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);
break;
case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._activate(t);
break;
case e.ui.keyCode.ESCAPE:this.collapse(t);
break;
default:u=!1,r=this.previousFilter||"",i=String.fromCharCode(t.keyCode),s=!1,clearTimeout(this.filterTimer),i===r?s=!0:i=r+i,o=new RegExp("^"+a(i),"i"),n=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text());
}),n=s&&n.index(this.active.next())!==-1?this.active.nextAll(".ui-menu-item"):n,n.length||(i=String.fromCharCode(t.keyCode),o=new RegExp("^"+a(i),"i"),n=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text());
})),n.length?(this.focus(t,n),n.length>1?(this.previousFilter=i,this.filterTimer=this._delay(function(){delete this.previousFilter;
},1000)):delete this.previousFilter):delete this.previousFilter;
}u&&t.preventDefault();
},_activate:function(e){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(e):this.select(e));
},refresh:function(){var t,n=this.options.icons.submenu,r=this.element.find(this.options.menus+":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"});
t=r.add(this.element),t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),t.children(":not(.ui-menu-item)").each(function(){var t=e(this);
/[^\-—–\s]/.test(t.text())||t.addClass("ui-widget-content ui-menu-divider");
}),t.children(".ui-state-disabled").attr("aria-disabled","true"),r.each(function(){var t=e(this),r=t.prev("a"),i=e("<span>").addClass("ui-menu-icon ui-icon "+n).data("ui-menu-submenu-carat",!0);
r.attr("aria-haspopup","true").prepend(i),t.attr("aria-labelledby",r.attr("id"));
}),this.active&&!e.contains(this.element[0],this.active[0])&&this.blur();
},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role];
},focus:function(e,t){var n,r;
this.blur(e,e&&e.type==="focus"),this._scrollIntoView(t),this.active=t.first(),r=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",r.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),e&&e.type==="keydown"?this._close():this.timer=this._delay(function(){this._close();
},this.delay),n=t.children(".ui-menu"),n.length&&/^mouse/.test(e.type)&&this._startOpening(n),this.activeMenu=t.parent(),this._trigger("focus",e,{item:t});
},_scrollIntoView:function(t){var n,r,i,s,o,u;
this._hasScroll()&&(n=parseFloat(e.css(this.activeMenu[0],"borderTopWidth"))||0,r=parseFloat(e.css(this.activeMenu[0],"paddingTop"))||0,i=t.offset().top-this.activeMenu.offset().top-n-r,s=this.activeMenu.scrollTop(),o=this.activeMenu.height(),u=t.height(),i<0?this.activeMenu.scrollTop(s+i):i+u>o&&this.activeMenu.scrollTop(s+i-o+u));
},blur:function(e,t){t||clearTimeout(this.timer);
if(!this.active){return;
}this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",e,{item:this.active});
},_startOpening:function(e){clearTimeout(this.timer);
if(e.attr("aria-hidden")!=="true"){return;
}this.timer=this._delay(function(){this._close(),this._open(e);
},this.delay);
},_open:function(t){var n=e.extend({of:this.active},this.options.position);
clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(n);
},collapseAll:function(t,n){clearTimeout(this.timer),this.timer=this._delay(function(){var r=n?this.element:e(t&&t.target).closest(this.element.find(".ui-menu"));
r.length||(r=this.element),this._close(r),this.blur(t),this.activeMenu=r;
},this.delay);
},_close:function(e){e||(e=this.active?this.active.parent():this.element),e.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active");
},collapse:function(e){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);
t&&t.length&&(this._close(),this.focus(e,t));
},expand:function(e){var t=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();
t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(e,t);
}));
},next:function(e){this._move("next","first",e);
},previous:function(e){this._move("prev","last",e);
},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length;
},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length;
},_move:function(e,t,n){var r;
this.active&&(e==="first"||e==="last"?r=this.active[e==="first"?"prevAll":"nextAll"](".ui-menu-item").eq(-1):r=this.active[e+"All"](".ui-menu-item").eq(0));
if(!r||!r.length||!this.active){r=this.activeMenu.children(".ui-menu-item")[t]();
}this.focus(n,r);
},nextPage:function(t){var n,r,i;
if(!this.active){this.next(t);
return;
}if(this.isLastItem()){return;
}this._hasScroll()?(r=this.active.offset().top,i=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return n=e(this),n.offset().top-r-i<0;
}),this.focus(t,n)):this.focus(t,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]());
},previousPage:function(t){var n,r,i;
if(!this.active){this.next(t);
return;
}if(this.isFirstItem()){return;
}this._hasScroll()?(r=this.active.offset().top,i=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return n=e(this),n.offset().top-r+i>0;
}),this.focus(t,n)):this.focus(t,this.activeMenu.children(".ui-menu-item").first());
},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight");
},select:function(t){this.active=this.active||e(t.target).closest(".ui-menu-item");
var n={item:this.active};
this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,n);
}});
})(jQuery);
(function(e,t){e.widget("ui.progressbar",{version:"1.9.1",options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()}),this.valueDiv=e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this.oldValue=this._value(),this._refreshValue();
},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove();
},value:function(e){return e===t?this._value():(this._setOption("value",e),this);
},_setOption:function(e,t){e==="value"&&(this.options.value=t,this._refreshValue(),this._value()===this.options.max&&this._trigger("complete")),this._super(e,t);
},_value:function(){var e=this.options.value;
return typeof e!="number"&&(e=0),Math.min(this.options.max,Math.max(this.min,e));
},_percentage:function(){return 100*this._value()/this.options.max;
},_refreshValue:function(){var e=this.value(),t=this._percentage();
this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),this.valueDiv.toggle(e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(t.toFixed(0)+"%"),this.element.attr("aria-valuenow",e);
}});
})(jQuery);
(function(e,t){e.widget("ui.resizable",e.ui.mouse,{version:"1.9.1",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1000},_create:function(){var t=this,n=this.options;
this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!n.aspectRatio,aspectRatio:n.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:n.helper||n.ghost||n.animate?n.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=n.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se");
if(this.handles.constructor==String){this.handles=="all"&&(this.handles="n,e,s,w,se,sw,ne,nw");
var r=this.handles.split(",");
this.handles={};
for(var i=0;
i<r.length;
i++){var s=e.trim(r[i]),o="ui-resizable-"+s,u=e('<div class="ui-resizable-handle '+o+'"></div>');
u.css({zIndex:n.zIndex}),"se"==s&&u.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(u);
}}this._renderAxis=function(t){t=t||this.element;
for(var n in this.handles){this.handles[n].constructor==String&&(this.handles[n]=e(this.handles[n],this.element).show());
if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var r=e(this.handles[n],this.element),i=0;
i=/sw|ne|nw|se|n|s/.test(n)?r.outerHeight():r.outerWidth();
var s=["padding",/ne|nw|n/.test(n)?"Top":/se|sw|s/.test(n)?"Bottom":/^e$/.test(n)?"Right":"Left"].join("");
t.css(s,i),this._proportionallyResize();
}if(!e(this.handles[n]).length){continue;
}}},this._renderAxis(this.element),this._handles=e(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){if(!t.resizing){if(this.className){var e=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
}t.axis=e&&e[1]?e[1]:"se";
}}),n.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){if(n.disabled){return;
}e(this).removeClass("ui-resizable-autohide"),t._handles.show();
}).mouseleave(function(){if(n.disabled){return;
}t.resizing||(e(this).addClass("ui-resizable-autohide"),t._handles.hide());
})),this._mouseInit();
},_destroy:function(){this._mouseDestroy();
var t=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
};
if(this.elementIsWrapper){t(this.element);
var n=this.element;
this.originalElement.css({position:n.css("position"),width:n.outerWidth(),height:n.outerHeight(),top:n.css("top"),left:n.css("left")}).insertAfter(n),n.remove();
}return this.originalElement.css("resize",this.originalResizeStyle),t(this.originalElement),this;
},_mouseCapture:function(t){var n=!1;
for(var r in this.handles){e(this.handles[r])[0]==t.target&&(n=!0);
}return !this.options.disabled&&n;
},_mouseStart:function(t){var r=this.options,i=this.element.position(),s=this.element;
this.resizing=!0,this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()},(s.is(".ui-draggable")||/absolute/.test(s.css("position")))&&s.css({position:"absolute",top:i.top,left:i.left}),this._renderProxy();
var o=n(this.helper.css("left")),u=n(this.helper.css("top"));
r.containment&&(o+=e(r.containment).scrollLeft()||0,u+=e(r.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:o,top:u},this.size=this._helper?{width:s.outerWidth(),height:s.outerHeight()}:{width:s.width(),height:s.height()},this.originalSize=this._helper?{width:s.outerWidth(),height:s.outerHeight()}:{width:s.width(),height:s.height()},this.originalPosition={left:o,top:u},this.sizeDiff={width:s.outerWidth()-s.width(),height:s.outerHeight()-s.height()},this.originalMousePosition={left:t.pageX,top:t.pageY},this.aspectRatio=typeof r.aspectRatio=="number"?r.aspectRatio:this.originalSize.width/this.originalSize.height||1;
var a=e(".ui-resizable-"+this.axis).css("cursor");
return e("body").css("cursor",a=="auto"?this.axis+"-resize":a),s.addClass("ui-resizable-resizing"),this._propagate("start",t),!0;
},_mouseDrag:function(e){var t=this.helper,n=this.options,r={},i=this,s=this.originalMousePosition,o=this.axis,u=e.pageX-s.left||0,a=e.pageY-s.top||0,f=this._change[o];
if(!f){return !1;
}var l=f.apply(this,[e,u,a]);
this._updateVirtualBoundaries(e.shiftKey);
if(this._aspectRatio||e.shiftKey){l=this._updateRatio(l,e);
}return l=this._respectSize(l,e),this._propagate("resize",e),t.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"}),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),this._updateCache(l),this._trigger("resize",e,this.ui()),!1;
},_mouseStop:function(t){this.resizing=!1;
var n=this.options,r=this;
if(this._helper){var i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),o=s&&e.ui.hasScroll(i[0],"left")?0:r.sizeDiff.height,u=s?0:r.sizeDiff.width,a={width:r.helper.width()-u,height:r.helper.height()-o},f=parseInt(r.element.css("left"),10)+(r.position.left-r.originalPosition.left)||null,l=parseInt(r.element.css("top"),10)+(r.position.top-r.originalPosition.top)||null;
n.animate||this.element.css(e.extend(a,{top:l,left:f})),r.helper.height(r.size.height),r.helper.width(r.size.width),this._helper&&!n.animate&&this._proportionallyResize();
}return e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1;
},_updateVirtualBoundaries:function(e){var t=this.options,n,i,s,o,u;
u={minWidth:r(t.minWidth)?t.minWidth:0,maxWidth:r(t.maxWidth)?t.maxWidth:Infinity,minHeight:r(t.minHeight)?t.minHeight:0,maxHeight:r(t.maxHeight)?t.maxHeight:Infinity};
if(this._aspectRatio||e){n=u.minHeight*this.aspectRatio,s=u.minWidth/this.aspectRatio,i=u.maxHeight*this.aspectRatio,o=u.maxWidth/this.aspectRatio,n>u.minWidth&&(u.minWidth=n),s>u.minHeight&&(u.minHeight=s),i<u.maxWidth&&(u.maxWidth=i),o<u.maxHeight&&(u.maxHeight=o);
}this._vBoundaries=u;
},_updateCache:function(e){var t=this.options;
this.offset=this.helper.offset(),r(e.left)&&(this.position.left=e.left),r(e.top)&&(this.position.top=e.top),r(e.height)&&(this.size.height=e.height),r(e.width)&&(this.size.width=e.width);
},_updateRatio:function(e,t){var n=this.options,i=this.position,s=this.size,o=this.axis;
return r(e.height)?e.width=e.height*this.aspectRatio:r(e.width)&&(e.height=e.width/this.aspectRatio),o=="sw"&&(e.left=i.left+(s.width-e.width),e.top=null),o=="nw"&&(e.top=i.top+(s.height-e.height),e.left=i.left+(s.width-e.width)),e;
},_respectSize:function(e,t){var n=this.helper,i=this._vBoundaries,s=this._aspectRatio||t.shiftKey,o=this.axis,u=r(e.width)&&i.maxWidth&&i.maxWidth<e.width,a=r(e.height)&&i.maxHeight&&i.maxHeight<e.height,f=r(e.width)&&i.minWidth&&i.minWidth>e.width,l=r(e.height)&&i.minHeight&&i.minHeight>e.height;
f&&(e.width=i.minWidth),l&&(e.height=i.minHeight),u&&(e.width=i.maxWidth),a&&(e.height=i.maxHeight);
var c=this.originalPosition.left+this.originalSize.width,h=this.position.top+this.size.height,p=/sw|nw|w/.test(o),d=/nw|ne|n/.test(o);
f&&p&&(e.left=c-i.minWidth),u&&p&&(e.left=c-i.maxWidth),l&&d&&(e.top=h-i.minHeight),a&&d&&(e.top=h-i.maxHeight);
var v=!e.width&&!e.height;
return v&&!e.left&&e.top?e.top=null:v&&!e.top&&e.left&&(e.left=null),e;
},_proportionallyResize:function(){var t=this.options;
if(!this._proportionallyResizeElements.length){return;
}var n=this.helper||this.element;
for(var r=0;
r<this._proportionallyResizeElements.length;
r++){var i=this._proportionallyResizeElements[r];
if(!this.borderDif){var s=[i.css("borderTopWidth"),i.css("borderRightWidth"),i.css("borderBottomWidth"),i.css("borderLeftWidth")],o=[i.css("paddingTop"),i.css("paddingRight"),i.css("paddingBottom"),i.css("paddingLeft")];
this.borderDif=e.map(s,function(e,t){var n=parseInt(e,10)||0,r=parseInt(o[t],10)||0;
return n+r;
});
}i.css({height:n.height()-this.borderDif[0]-this.borderDif[2]||0,width:n.width()-this.borderDif[1]-this.borderDif[3]||0});
}},_renderProxy:function(){var t=this.element,n=this.options;
this.elementOffset=t.offset();
if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');
var r=e.ui.ie6?1:0,i=e.ui.ie6?2:-1;
this.helper.addClass(this._helper).css({width:this.element.outerWidth()+i,height:this.element.outerHeight()+i,position:"absolute",left:this.elementOffset.left-r+"px",top:this.elementOffset.top-r+"px",zIndex:++n.zIndex}),this.helper.appendTo("body").disableSelection();
}else{this.helper=this.element;
}},_change:{e:function(e,t,n){return{width:this.originalSize.width+t};
},w:function(e,t,n){var r=this.options,i=this.originalSize,s=this.originalPosition;
return{left:s.left+t,width:i.width-t};
},n:function(e,t,n){var r=this.options,i=this.originalSize,s=this.originalPosition;
return{top:s.top+n,height:i.height-n};
},s:function(e,t,n){return{height:this.originalSize.height+n};
},se:function(t,n,r){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,n,r]));
},sw:function(t,n,r){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,n,r]));
},ne:function(t,n,r){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,n,r]));
},nw:function(t,n,r){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,n,r]));
}},_propagate:function(t,n){e.ui.plugin.call(this,t,[n,this.ui()]),t!="resize"&&this._trigger(t,n,this.ui());
},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition};
}}),e.ui.plugin.add("resizable","alsoResize",{start:function(t,n){var r=e(this).data("resizable"),i=r.options,s=function(t){e(t).each(function(){var t=e(this);
t.data("resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)});
});
};
typeof i.alsoResize=="object"&&!i.alsoResize.parentNode?i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):e.each(i.alsoResize,function(e){s(e);
}):s(i.alsoResize);
},resize:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.originalSize,o=r.originalPosition,u={height:r.size.height-s.height||0,width:r.size.width-s.width||0,top:r.position.top-o.top||0,left:r.position.left-o.left||0},a=function(t,r){e(t).each(function(){var t=e(this),i=e(this).data("resizable-alsoresize"),s={},o=r&&r.length?r:t.parents(n.originalElement[0]).length?["width","height"]:["width","height","top","left"];
e.each(o,function(e,t){var n=(i[t]||0)+(u[t]||0);
n&&n>=0&&(s[t]=n||null);
}),t.css(s);
});
};
typeof i.alsoResize=="object"&&!i.alsoResize.nodeType?e.each(i.alsoResize,function(e,t){a(e,t);
}):a(i.alsoResize);
},stop:function(t,n){e(this).removeData("resizable-alsoresize");
}}),e.ui.plugin.add("resizable","animate",{stop:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r._proportionallyResizeElements,o=s.length&&/textarea/i.test(s[0].nodeName),u=o&&e.ui.hasScroll(s[0],"left")?0:r.sizeDiff.height,a=o?0:r.sizeDiff.width,f={width:r.size.width-a,height:r.size.height-u},l=parseInt(r.element.css("left"),10)+(r.position.left-r.originalPosition.left)||null,c=parseInt(r.element.css("top"),10)+(r.position.top-r.originalPosition.top)||null;
r.element.animate(e.extend(f,c&&l?{top:c,left:l}:{}),{duration:i.animateDuration,easing:i.animateEasing,step:function(){var n={width:parseInt(r.element.css("width"),10),height:parseInt(r.element.css("height"),10),top:parseInt(r.element.css("top"),10),left:parseInt(r.element.css("left"),10)};
s&&s.length&&e(s[0]).css({width:n.width,height:n.height}),r._updateCache(n),r._propagate("resize",t);
}});
}}),e.ui.plugin.add("resizable","containment",{start:function(t,r){var i=e(this).data("resizable"),s=i.options,o=i.element,u=s.containment,a=u instanceof e?u.get(0):/parent/.test(u)?o.parent().get(0):u;
if(!a){return;
}i.containerElement=e(a);
if(/document/.test(u)||u==document){i.containerOffset={left:0,top:0},i.containerPosition={left:0,top:0},i.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight};
}else{var f=e(a),l=[];
e(["Top","Right","Left","Bottom"]).each(function(e,t){l[e]=n(f.css("padding"+t));
}),i.containerOffset=f.offset(),i.containerPosition=f.position(),i.containerSize={height:f.innerHeight()-l[3],width:f.innerWidth()-l[1]};
var c=i.containerOffset,h=i.containerSize.height,p=i.containerSize.width,d=e.ui.hasScroll(a,"left")?a.scrollWidth:p,v=e.ui.hasScroll(a)?a.scrollHeight:h;
i.parentData={element:a,left:c.left,top:c.top,width:d,height:v};
}},resize:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.containerSize,o=r.containerOffset,u=r.size,a=r.position,f=r._aspectRatio||t.shiftKey,l={top:0,left:0},c=r.containerElement;
c[0]!=document&&/static/.test(c.css("position"))&&(l=o),a.left<(r._helper?o.left:0)&&(r.size.width=r.size.width+(r._helper?r.position.left-o.left:r.position.left-l.left),f&&(r.size.height=r.size.width/r.aspectRatio),r.position.left=i.helper?o.left:0),a.top<(r._helper?o.top:0)&&(r.size.height=r.size.height+(r._helper?r.position.top-o.top:r.position.top),f&&(r.size.width=r.size.height*r.aspectRatio),r.position.top=r._helper?o.top:0),r.offset.left=r.parentData.left+r.position.left,r.offset.top=r.parentData.top+r.position.top;
var h=Math.abs((r._helper?r.offset.left-l.left:r.offset.left-l.left)+r.sizeDiff.width),p=Math.abs((r._helper?r.offset.top-l.top:r.offset.top-o.top)+r.sizeDiff.height),d=r.containerElement.get(0)==r.element.parent().get(0),v=/relative|absolute/.test(r.containerElement.css("position"));
d&&v&&(h-=r.parentData.left),h+r.size.width>=r.parentData.width&&(r.size.width=r.parentData.width-h,f&&(r.size.height=r.size.width/r.aspectRatio)),p+r.size.height>=r.parentData.height&&(r.size.height=r.parentData.height-p,f&&(r.size.width=r.size.height*r.aspectRatio));
},stop:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.position,o=r.containerOffset,u=r.containerPosition,a=r.containerElement,f=e(r.helper),l=f.offset(),c=f.outerWidth()-r.sizeDiff.width,h=f.outerHeight()-r.sizeDiff.height;
r._helper&&!i.animate&&/relative/.test(a.css("position"))&&e(this).css({left:l.left-u.left-o.left,width:c,height:h}),r._helper&&!i.animate&&/static/.test(a.css("position"))&&e(this).css({left:l.left-u.left-o.left,width:c,height:h});
}}),e.ui.plugin.add("resizable","ghost",{start:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.size;
r.ghost=r.originalElement.clone(),r.ghost.css({opacity:0.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof i.ghost=="string"?i.ghost:""),r.ghost.appendTo(r.helper);
},resize:function(t,n){var r=e(this).data("resizable"),i=r.options;
r.ghost&&r.ghost.css({position:"relative",height:r.size.height,width:r.size.width});
},stop:function(t,n){var r=e(this).data("resizable"),i=r.options;
r.ghost&&r.helper&&r.helper.get(0).removeChild(r.ghost.get(0));
}}),e.ui.plugin.add("resizable","grid",{resize:function(t,n){var r=e(this).data("resizable"),i=r.options,s=r.size,o=r.originalSize,u=r.originalPosition,a=r.axis,f=i._aspectRatio||t.shiftKey;
i.grid=typeof i.grid=="number"?[i.grid,i.grid]:i.grid;
var l=Math.round((s.width-o.width)/(i.grid[0]||1))*(i.grid[0]||1),c=Math.round((s.height-o.height)/(i.grid[1]||1))*(i.grid[1]||1);
/^(se|s|e)$/.test(a)?(r.size.width=o.width+l,r.size.height=o.height+c):/^(ne)$/.test(a)?(r.size.width=o.width+l,r.size.height=o.height+c,r.position.top=u.top-c):/^(sw)$/.test(a)?(r.size.width=o.width+l,r.size.height=o.height+c,r.position.left=u.left-l):(r.size.width=o.width+l,r.size.height=o.height+c,r.position.top=u.top-c,r.position.left=u.left-l);
}});
var n=function(e){return parseInt(e,10)||0;
},r=function(e){return !isNaN(parseInt(e,10));
};
})(jQuery);
(function(e,t){e.widget("ui.selectable",e.ui.mouse,{version:"1.9.1",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch"},_create:function(){var t=this;
this.element.addClass("ui-selectable"),this.dragged=!1;
var n;
this.refresh=function(){n=e(t.options.filter,t.element[0]),n.addClass("ui-selectee"),n.each(function(){var t=e(this),n=t.offset();
e.data(this,"selectable-item",{element:this,$element:t,left:n.left,top:n.top,right:n.left+t.outerWidth(),bottom:n.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")});
});
},this.refresh(),this.selectees=n.addClass("ui-selectee"),this._mouseInit(),this.helper=e("<div class='ui-selectable-helper'></div>");
},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy();
},_mouseStart:function(t){var n=this;
this.opos=[t.pageX,t.pageY];
if(this.options.disabled){return;
}var r=this.options;
this.selectees=e(r.filter,this.element[0]),this._trigger("start",t),e(r.appendTo).append(this.helper),this.helper.css({left:t.clientX,top:t.clientY,width:0,height:0}),r.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var r=e.data(this,"selectable-item");
r.startselected=!0,!t.metaKey&&!t.ctrlKey&&(r.$element.removeClass("ui-selected"),r.selected=!1,r.$element.addClass("ui-unselecting"),r.unselecting=!0,n._trigger("unselecting",t,{unselecting:r.element}));
}),e(t.target).parents().andSelf().each(function(){var r=e.data(this,"selectable-item");
if(r){var i=!t.metaKey&&!t.ctrlKey||!r.$element.hasClass("ui-selected");
return r.$element.removeClass(i?"ui-unselecting":"ui-selected").addClass(i?"ui-selecting":"ui-unselecting"),r.unselecting=!i,r.selecting=i,r.selected=i,i?n._trigger("selecting",t,{selecting:r.element}):n._trigger("unselecting",t,{unselecting:r.element}),!1;
}});
},_mouseDrag:function(t){var n=this;
this.dragged=!0;
if(this.options.disabled){return;
}var r=this.options,i=this.opos[0],s=this.opos[1],o=t.pageX,u=t.pageY;
if(i>o){var a=o;
o=i,i=a;
}if(s>u){var a=u;
u=s,s=a;
}return this.helper.css({left:i,top:s,width:o-i,height:u-s}),this.selectees.each(function(){var a=e.data(this,"selectable-item");
if(!a||a.element==n.element[0]){return;
}var f=!1;
r.tolerance=="touch"?f=!(a.left>o||a.right<i||a.top>u||a.bottom<s):r.tolerance=="fit"&&(f=a.left>i&&a.right<o&&a.top>s&&a.bottom<u),f?(a.selected&&(a.$element.removeClass("ui-selected"),a.selected=!1),a.unselecting&&(a.$element.removeClass("ui-unselecting"),a.unselecting=!1),a.selecting||(a.$element.addClass("ui-selecting"),a.selecting=!0,n._trigger("selecting",t,{selecting:a.element}))):(a.selecting&&((t.metaKey||t.ctrlKey)&&a.startselected?(a.$element.removeClass("ui-selecting"),a.selecting=!1,a.$element.addClass("ui-selected"),a.selected=!0):(a.$element.removeClass("ui-selecting"),a.selecting=!1,a.startselected&&(a.$element.addClass("ui-unselecting"),a.unselecting=!0),n._trigger("unselecting",t,{unselecting:a.element}))),a.selected&&!t.metaKey&&!t.ctrlKey&&!a.startselected&&(a.$element.removeClass("ui-selected"),a.selected=!1,a.$element.addClass("ui-unselecting"),a.unselecting=!0,n._trigger("unselecting",t,{unselecting:a.element})));
}),!1;
},_mouseStop:function(t){var n=this;
this.dragged=!1;
var r=this.options;
return e(".ui-unselecting",this.element[0]).each(function(){var r=e.data(this,"selectable-item");
r.$element.removeClass("ui-unselecting"),r.unselecting=!1,r.startselected=!1,n._trigger("unselected",t,{unselected:r.element});
}),e(".ui-selecting",this.element[0]).each(function(){var r=e.data(this,"selectable-item");
r.$element.removeClass("ui-selecting").addClass("ui-selected"),r.selecting=!1,r.selected=!0,r.startselected=!0,n._trigger("selected",t,{selected:r.element});
}),this._trigger("stop",t),this.helper.remove(),!1;
}});
})(jQuery);
(function(e,t){var n=5;
e.widget("ui.slider",e.ui.mouse,{version:"1.9.1",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var t,r,i=this.options,s=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),o="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",u=[];
this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"+(i.disabled?" ui-slider-disabled ui-disabled":"")),this.range=e([]),i.range&&(i.range===!0&&(i.values||(i.values=[this._valueMin(),this._valueMin()]),i.values.length&&i.values.length!==2&&(i.values=[i.values[0],i.values[0]])),this.range=e("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(i.range==="min"||i.range==="max"?" ui-slider-range-"+i.range:""))),r=i.values&&i.values.length||1;
for(t=s.length;
t<r;
t++){u.push(o);
}this.handles=s.add(e(u.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(e){e.preventDefault();
}).mouseenter(function(){i.disabled||e(this).addClass("ui-state-hover");
}).mouseleave(function(){e(this).removeClass("ui-state-hover");
}).focus(function(){i.disabled?e(this).blur():(e(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),e(this).addClass("ui-state-focus"));
}).blur(function(){e(this).removeClass("ui-state-focus");
}),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t);
}),this._on(this.handles,{keydown:function(t){var r,i,s,o,u=e(t.target).data("ui-slider-handle-index");
switch(t.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:t.preventDefault();
if(!this._keySliding){this._keySliding=!0,e(t.target).addClass("ui-state-active"),r=this._start(t,u);
if(r===!1){return;
}}}o=this.options.step,this.options.values&&this.options.values.length?i=s=this.values(u):i=s=this.value();
switch(t.keyCode){case e.ui.keyCode.HOME:s=this._valueMin();
break;
case e.ui.keyCode.END:s=this._valueMax();
break;
case e.ui.keyCode.PAGE_UP:s=this._trimAlignValue(i+(this._valueMax()-this._valueMin())/n);
break;
case e.ui.keyCode.PAGE_DOWN:s=this._trimAlignValue(i-(this._valueMax()-this._valueMin())/n);
break;
case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(i===this._valueMax()){return;
}s=this._trimAlignValue(i+o);
break;
case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i===this._valueMin()){return;
}s=this._trimAlignValue(i-o);
}this._slide(t,u,s);
},keyup:function(t){var n=e(t.target).data("ui-slider-handle-index");
this._keySliding&&(this._keySliding=!1,this._stop(t,n),this._change(t,n),e(t.target).removeClass("ui-state-active"));
}}),this._refreshValue(),this._animateOff=!1;
},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy();
},_mouseCapture:function(t){var n,r,i,s,o,u,a,f,l=this,c=this.options;
return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),n={x:t.pageX,y:t.pageY},r=this._normValueFromMouse(n),i=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var n=Math.abs(r-l.values(t));
i>n&&(i=n,s=e(this),o=t);
}),c.range===!0&&this.values(1)===c.min&&(o+=1,s=e(this.handles[o])),u=this._start(t,o),u===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,s.addClass("ui-state-active").focus(),a=s.offset(),f=!e(t.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=f?{left:0,top:0}:{left:t.pageX-a.left-s.width()/2,top:t.pageY-a.top-s.height()/2-(parseInt(s.css("borderTopWidth"),10)||0)-(parseInt(s.css("borderBottomWidth"),10)||0)+(parseInt(s.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,o,r),this._animateOff=!0,!0));
},_mouseStart:function(){return !0;
},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},n=this._normValueFromMouse(t);
return this._slide(e,this._handleIndex,n),!1;
},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1;
},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal";
},_normValueFromMouse:function(e){var t,n,r,i,s;
return this.orientation==="horizontal"?(t=this.elementSize.width,n=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,n=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),r=n/t,r>1&&(r=1),r<0&&(r=0),this.orientation==="vertical"&&(r=1-r),i=this._valueMax()-this._valueMin(),s=this._valueMin()+r*i,this._trimAlignValue(s);
},_start:function(e,t){var n={handle:this.handles[t],value:this.value()};
return this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("start",e,n);
},_slide:function(e,t,n){var r,i,s;
this.options.values&&this.options.values.length?(r=this.values(t?0:1),this.options.values.length===2&&this.options.range===!0&&(t===0&&n>r||t===1&&n<r)&&(n=r),n!==this.values(t)&&(i=this.values(),i[t]=n,s=this._trigger("slide",e,{handle:this.handles[t],value:n,values:i}),r=this.values(t?0:1),s!==!1&&this.values(t,n,!0))):n!==this.value()&&(s=this._trigger("slide",e,{handle:this.handles[t],value:n}),s!==!1&&this.value(n));
},_stop:function(e,t){var n={handle:this.handles[t],value:this.value()};
this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("stop",e,n);
},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var n={handle:this.handles[t],value:this.value()};
this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("change",e,n);
}},value:function(e){if(arguments.length){this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0);
return;
}return this._value();
},values:function(t,n){var r,i,s;
if(arguments.length>1){this.options.values[t]=this._trimAlignValue(n),this._refreshValue(),this._change(null,t);
return;
}if(!arguments.length){return this._values();
}if(!e.isArray(arguments[0])){return this.options.values&&this.options.values.length?this._values(t):this.value();
}r=this.options.values,i=arguments[0];
for(s=0;
s<r.length;
s+=1){r[s]=this._trimAlignValue(i[s]),this._change(null,s);
}this._refreshValue();
},_setOption:function(t,n){var r,i=0;
e.isArray(this.options.values)&&(i=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments);
switch(t){case"disabled":n?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.prop("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.prop("disabled",!1),this.element.removeClass("ui-disabled"));
break;
case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();
break;
case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;
break;
case"values":this._animateOff=!0,this._refreshValue();
for(r=0;
r<i;
r+=1){this._change(null,r);
}this._animateOff=!1;
break;
case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;
}},_value:function(){var e=this.options.value;
return e=this._trimAlignValue(e),e;
},_values:function(e){var t,n,r;
if(arguments.length){return t=this.options.values[e],t=this._trimAlignValue(t),t;
}n=this.options.values.slice();
for(r=0;
r<n.length;
r+=1){n[r]=this._trimAlignValue(n[r]);
}return n;
},_trimAlignValue:function(e){if(e<=this._valueMin()){return this._valueMin();
}if(e>=this._valueMax()){return this._valueMax();
}var t=this.options.step>0?this.options.step:1,n=(e-this._valueMin())%t,r=e-n;
return Math.abs(n)*2>=t&&(r+=n>0?t:-t),parseFloat(r.toFixed(5));
},_valueMin:function(){return this.options.min;
},_valueMax:function(){return this.options.max;
},_refreshValue:function(){var t,n,r,i,s,o=this.options.range,u=this.options,a=this,f=this._animateOff?!1:u.animate,l={};
this.options.values&&this.options.values.length?this.handles.each(function(r){n=(a.values(r)-a._valueMin())/(a._valueMax()-a._valueMin())*100,l[a.orientation==="horizontal"?"left":"bottom"]=n+"%",e(this).stop(1,1)[f?"animate":"css"](l,u.animate),a.options.range===!0&&(a.orientation==="horizontal"?(r===0&&a.range.stop(1,1)[f?"animate":"css"]({left:n+"%"},u.animate),r===1&&a.range[f?"animate":"css"]({width:n-t+"%"},{queue:!1,duration:u.animate})):(r===0&&a.range.stop(1,1)[f?"animate":"css"]({bottom:n+"%"},u.animate),r===1&&a.range[f?"animate":"css"]({height:n-t+"%"},{queue:!1,duration:u.animate}))),t=n;
}):(r=this.value(),i=this._valueMin(),s=this._valueMax(),n=s!==i?(r-i)/(s-i)*100:0,l[this.orientation==="horizontal"?"left":"bottom"]=n+"%",this.handle.stop(1,1)[f?"animate":"css"](l,u.animate),o==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[f?"animate":"css"]({width:n+"%"},u.animate),o==="max"&&this.orientation==="horizontal"&&this.range[f?"animate":"css"]({width:100-n+"%"},{queue:!1,duration:u.animate}),o==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[f?"animate":"css"]({height:n+"%"},u.animate),o==="max"&&this.orientation==="vertical"&&this.range[f?"animate":"css"]({height:100-n+"%"},{queue:!1,duration:u.animate}));
}});
})(jQuery);
(function(e,t){e.widget("ui.sortable",e.ui.mouse,{version:"1.9.1",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var e=this.options;
this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?e.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0;
},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();
for(var e=this.items.length-1;
e>=0;
e--){this.items[e].item.removeData(this.widgetName+"-item");
}return this;
},_setOption:function(t,n){t==="disabled"?(this.options[t]=n,this.widget().toggleClass("ui-sortable-disabled",!!n)):e.Widget.prototype._setOption.apply(this,arguments);
},_mouseCapture:function(t,n){var r=this;
if(this.reverting){return !1;
}if(this.options.disabled||this.options.type=="static"){return !1;
}this._refreshItems(t);
var i=null,s=e(t.target).parents().each(function(){if(e.data(this,r.widgetName+"-item")==r){return i=e(this),!1;
}});
e.data(t.target,r.widgetName+"-item")==r&&(i=e(t.target));
if(!i){return !1;
}if(this.options.handle&&!n){var o=!1;
e(this.options.handle,i).find("*").andSelf().each(function(){this==t.target&&(o=!0);
});
if(!o){return !1;
}}return this.currentItem=i,this._removeCurrentsFromItems(),!0;
},_mouseStart:function(t,n,r){var i=this.options;
this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!=this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),i.containment&&this._setContainment(),i.cursor&&(e("body").css("cursor")&&(this._storedCursor=e("body").css("cursor")),e("body").css("cursor",i.cursor)),i.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",i.opacity)),i.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",i.zIndex)),this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions();
if(!r){for(var s=this.containers.length-1;
s>=0;
s--){this.containers[s]._trigger("activate",t,this._uiHash(this));
}}return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0;
},_mouseDrag:function(t){this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs);
if(this.options.scroll){var n=this.options,r=!1;
this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<n.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+n.scrollSpeed:t.pageY-this.overflowOffset.top<n.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-n.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<n.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+n.scrollSpeed:t.pageX-this.overflowOffset.left<n.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-n.scrollSpeed)):(t.pageY-e(document).scrollTop()<n.scrollSensitivity?r=e(document).scrollTop(e(document).scrollTop()-n.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<n.scrollSensitivity&&(r=e(document).scrollTop(e(document).scrollTop()+n.scrollSpeed)),t.pageX-e(document).scrollLeft()<n.scrollSensitivity?r=e(document).scrollLeft(e(document).scrollLeft()-n.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<n.scrollSensitivity&&(r=e(document).scrollLeft(e(document).scrollLeft()+n.scrollSpeed))),r!==!1&&e.ui.ddmanager&&!n.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t);
}this.positionAbs=this._convertPositionTo("absolute");
if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px";
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px";
}for(var i=this.items.length-1;
i>=0;
i--){var s=this.items[i],o=s.item[0],u=this._intersectsWithPointer(s);
if(!u){continue;
}if(s.instance!==this.currentContainer){continue;
}if(o!=this.currentItem[0]&&this.placeholder[u==1?"next":"prev"]()[0]!=o&&!e.contains(this.placeholder[0],o)&&(this.options.type=="semi-dynamic"?!e.contains(this.element[0],o):!0)){this.direction=u==1?"down":"up";
if(this.options.tolerance!="pointer"&&!this._intersectsWithSides(s)){break;
}this._rearrange(t,s),this._trigger("change",t,this._uiHash());
break;
}}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1;
},_mouseStop:function(t,n){if(!t){return;
}e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t);
if(this.options.revert){var r=this,i=this.placeholder.offset();
this.reverting=!0,e(this.helper).animate({left:i.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:i.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){r._clear(t);
});
}else{this._clear(t,n);
}return !1;
},cancel:function(){if(this.dragging){this._mouseUp({target:null}),this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();
for(var t=this.containers.length-1;
t>=0;
t--){this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0);
}}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this;
},serialize:function(t){var n=this._getItemsAsjQuery(t&&t.connected),r=[];
return t=t||{},e(n).each(function(){var n=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[-=_](.+)/);
n&&r.push((t.key||n[1]+"[]")+"="+(t.key&&t.expression?n[1]:n[2]));
}),!r.length&&t.key&&r.push(t.key+"="),r.join("&");
},toArray:function(t){var n=this._getItemsAsjQuery(t&&t.connected),r=[];
return t=t||{},n.each(function(){r.push(e(t.item||this).attr(t.attribute||"id")||"");
}),r;
},_intersectsWith:function(e){var t=this.positionAbs.left,n=t+this.helperProportions.width,r=this.positionAbs.top,i=r+this.helperProportions.height,s=e.left,o=s+e.width,u=e.top,a=u+e.height,f=this.offset.click.top,l=this.offset.click.left,c=r+f>u&&r+f<a&&t+l>s&&t+l<o;
return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?c:s<t+this.helperProportions.width/2&&n-this.helperProportions.width/2<o&&u<r+this.helperProportions.height/2&&i-this.helperProportions.height/2<a;
},_intersectsWithPointer:function(t){var n=this.options.axis==="x"||e.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),r=this.options.axis==="y"||e.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),i=n&&r,s=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();
return i?this.floating?o&&o=="right"||s=="down"?2:1:s&&(s=="down"?2:1):!1;
},_intersectsWithSides:function(t){var n=e.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),r=e.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),i=this._getDragVerticalDirection(),s=this._getDragHorizontalDirection();
return this.floating&&s?s=="right"&&r||s=="left"&&!r:i&&(i=="down"&&n||i=="up"&&!n);
},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;
return e!=0&&(e>0?"down":"up");
},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;
return e!=0&&(e>0?"right":"left");
},refresh:function(e){return this._refreshItems(e),this.refreshPositions(),this;
},_connectWith:function(){var e=this.options;
return e.connectWith.constructor==String?[e.connectWith]:e.connectWith;
},_getItemsAsjQuery:function(t){var n=[],r=[],i=this._connectWith();
if(i&&t){for(var s=i.length-1;
s>=0;
s--){var o=e(i[s]);
for(var u=o.length-1;
u>=0;
u--){var a=e.data(o[u],this.widgetName);
a&&a!=this&&!a.options.disabled&&r.push([e.isFunction(a.options.items)?a.options.items.call(a.element):e(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);
}}}r.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);
for(var s=r.length-1;
s>=0;
s--){r[s][0].each(function(){n.push(this);
});
}return e(n);
},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");
this.items=e.grep(this.items,function(e){for(var n=0;
n<t.length;
n++){if(t[n]==e.item[0]){return !1;
}}return !0;
});
},_refreshItems:function(t){this.items=[],this.containers=[this];
var n=this.items,r=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],i=this._connectWith();
if(i&&this.ready){for(var s=i.length-1;
s>=0;
s--){var o=e(i[s]);
for(var u=o.length-1;
u>=0;
u--){var a=e.data(o[u],this.widgetName);
a&&a!=this&&!a.options.disabled&&(r.push([e.isFunction(a.options.items)?a.options.items.call(a.element[0],t,{item:this.currentItem}):e(a.options.items,a.element),a]),this.containers.push(a));
}}}for(var s=r.length-1;
s>=0;
s--){var f=r[s][1],l=r[s][0];
for(var u=0,c=l.length;
u<c;
u++){var h=e(l[u]);
h.data(this.widgetName+"-item",f),n.push({item:h,instance:f,width:0,height:0,left:0,top:0});
}}},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());
for(var n=this.items.length-1;
n>=0;
n--){var r=this.items[n];
if(r.instance!=this.currentContainer&&this.currentContainer&&r.item[0]!=this.currentItem[0]){continue;
}var i=this.options.toleranceElement?e(this.options.toleranceElement,r.item):r.item;
t||(r.width=i.outerWidth(),r.height=i.outerHeight());
var s=i.offset();
r.left=s.left,r.top=s.top;
}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this);
}else{for(var n=this.containers.length-1;
n>=0;
n--){var s=this.containers[n].element.offset();
this.containers[n].containerCache.left=s.left,this.containers[n].containerCache.top=s.top,this.containers[n].containerCache.width=this.containers[n].element.outerWidth(),this.containers[n].containerCache.height=this.containers[n].element.outerHeight();
}}return this;
},_createPlaceholder:function(t){t=t||this;
var n=t.options;
if(!n.placeholder||n.placeholder.constructor==String){var r=n.placeholder;
n.placeholder={element:function(){var n=e(document.createElement(t.currentItem[0].nodeName)).addClass(r||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
return r||(n.style.visibility="hidden"),n;
},update:function(e,i){if(r&&!n.forcePlaceholderSize){return;
}i.height()||i.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),i.width()||i.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10));
}};
}t.placeholder=e(n.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),n.placeholder.update(t,t.placeholder);
},_contactContainers:function(t){var n=null,r=null;
for(var i=this.containers.length-1;
i>=0;
i--){if(e.contains(this.currentItem[0],this.containers[i].element[0])){continue;
}if(this._intersectsWith(this.containers[i].containerCache)){if(n&&e.contains(this.containers[i].element[0],n.element[0])){continue;
}n=this.containers[i],r=i;
}else{this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",t,this._uiHash(this)),this.containers[i].containerCache.over=0);
}}if(!n){return;
}if(this.containers.length===1){this.containers[r]._trigger("over",t,this._uiHash(this)),this.containers[r].containerCache.over=1;
}else{var s=10000,o=null,u=this.containers[r].floating?"left":"top",a=this.containers[r].floating?"width":"height",f=this.positionAbs[u]+this.offset.click[u];
for(var l=this.items.length-1;
l>=0;
l--){if(!e.contains(this.containers[r].element[0],this.items[l].item[0])){continue;
}if(this.items[l].item[0]==this.currentItem[0]){continue;
}var c=this.items[l].item.offset()[u],h=!1;
Math.abs(c-f)>Math.abs(c+this.items[l][a]-f)&&(h=!0,c+=this.items[l][a]),Math.abs(c-f)<s&&(s=Math.abs(c-f),o=this.items[l],this.direction=h?"up":"down");
}if(!o&&!this.options.dropOnEmpty){return;
}this.currentContainer=this.containers[r],o?this._rearrange(t,o,null,!0):this._rearrange(t,null,this.containers[r].element,!0),this._trigger("change",t,this._uiHash()),this.containers[r]._trigger("change",t,this._uiHash(this)),this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[r]._trigger("over",t,this._uiHash(this)),this.containers[r].containerCache.over=1;
}},_createHelper:function(t){var n=this.options,r=e.isFunction(n.helper)?e(n.helper.apply(this.element[0],[t,this.currentItem])):n.helper=="clone"?this.currentItem.clone():this.currentItem;
return r.parents("body").length||e(n.appendTo!="parent"?n.appendTo:this.currentItem[0].parentNode)[0].appendChild(r[0]),r[0]==this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(r[0].style.width==""||n.forceHelperSize)&&r.width(this.currentItem.width()),(r[0].style.height==""||n.forceHelperSize)&&r.height(this.currentItem.height()),r;
},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left" in t&&(this.offset.click.left=t.left+this.margins.left),"right" in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top" in t&&(this.offset.click.top=t.top+this.margins.top),"bottom" in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top);
},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var t=this.offsetParent.offset();
this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop());
if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&e.ui.ie){t={top:0,left:0};
}return{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var e=this.currentItem.position();
return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()};
}return{top:0,left:0};
},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0};
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};
},_setContainment:function(){var t=this.options;
t.containment=="parent"&&(t.containment=this.helper[0].parentNode);
if(t.containment=="document"||t.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e(t.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(e(t.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
}if(!/^(document|window|parent)$/.test(t.containment)){var n=e(t.containment)[0],r=e(t.containment).offset(),i=e(n).css("overflow")!="hidden";
this.containment=[r.left+(parseInt(e(n).css("borderLeftWidth"),10)||0)+(parseInt(e(n).css("paddingLeft"),10)||0)-this.margins.left,r.top+(parseInt(e(n).css("borderTopWidth"),10)||0)+(parseInt(e(n).css("paddingTop"),10)||0)-this.margins.top,r.left+(i?Math.max(n.scrollWidth,n.offsetWidth):n.offsetWidth)-(parseInt(e(n).css("borderLeftWidth"),10)||0)-(parseInt(e(n).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,r.top+(i?Math.max(n.scrollHeight,n.offsetHeight):n.offsetHeight)-(parseInt(e(n).css("borderTopWidth"),10)||0)-(parseInt(e(n).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top];
}},_convertPositionTo:function(t,n){n||(n=this.position);
var r=t=="absolute"?1:-1,i=this.options,s=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(s[0].tagName);
return{top:n.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():o?0:s.scrollTop())*r,left:n.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():o?0:s.scrollLeft())*r};
},_generatePosition:function(t){var n=this.options,r=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,i=/(html|body)/i.test(r[0].tagName);
this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());
var s=t.pageX,o=t.pageY;
if(this.originalPosition){this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(s=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(s=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top));
if(n.grid){var u=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1];
o=this.containment?u-this.offset.click.top<this.containment[1]||u-this.offset.click.top>this.containment[3]?u-this.offset.click.top<this.containment[1]?u+n.grid[1]:u-n.grid[1]:u:u;
var a=this.originalPageX+Math.round((s-this.originalPageX)/n.grid[0])*n.grid[0];
s=this.containment?a-this.offset.click.left<this.containment[0]||a-this.offset.click.left>this.containment[2]?a-this.offset.click.left<this.containment[0]?a+n.grid[0]:a-n.grid[0]:a:a;
}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():i?0:r.scrollTop()),left:s-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:r.scrollLeft())};
},_rearrange:function(e,t,n,r){n?n[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;
var i=this.counter;
this._delay(function(){i==this.counter&&this.refreshPositions(!r);
});
},_clear:function(t,n){this.reverting=!1;
var r=[];
!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null;
if(this.helper[0]==this.currentItem[0]){for(var i in this._storedCSS){if(this._storedCSS[i]=="auto"||this._storedCSS[i]=="static"){this._storedCSS[i]="";
}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
}else{this.currentItem.show();
}this.fromOutside&&!n&&r.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside));
}),(this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!n&&r.push(function(e){this._trigger("update",e,this._uiHash());
}),this!==this.currentContainer&&(n||(r.push(function(e){this._trigger("remove",e,this._uiHash());
}),r.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this));
};
}.call(this,this.currentContainer)),r.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this));
};
}.call(this,this.currentContainer))));
for(var i=this.containers.length-1;
i>=0;
i--){n||r.push(function(e){return function(t){e._trigger("deactivate",t,this._uiHash(this));
};
}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(r.push(function(e){return function(t){e._trigger("out",t,this._uiHash(this));
};
}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);
}this._storedCursor&&e("body").css("cursor",this._storedCursor),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex),this.dragging=!1;
if(this.cancelHelperRemoval){if(!n){this._trigger("beforeStop",t,this._uiHash());
for(var i=0;
i<r.length;
i++){r[i].call(this,t);
}this._trigger("stop",t,this._uiHash());
}return this.fromOutside=!1,!1;
}n||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!=this.currentItem[0]&&this.helper.remove(),this.helper=null;
if(!n){for(var i=0;
i<r.length;
i++){r[i].call(this,t);
}this._trigger("stop",t,this._uiHash());
}return this.fromOutside=!1,!0;
},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel();
},_uiHash:function(t){var n=t||this;
return{helper:n.helper,placeholder:n.placeholder||e([]),position:n.position,originalPosition:n.originalPosition,offset:n.positionAbs,item:n.currentItem,sender:t?t.element:null};
}});
})(jQuery);
(function(e){function t(e){return function(){var t=this.element.val();
e.apply(this,arguments),this._refresh(),t!==this.element.val()&&this._trigger("change");
};
}e.widget("ui.spinner",{version:"1.9.1",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete");
}});
},_getCreateOptions:function(){var t={},n=this.element;
return e.each(["min","max","step"],function(e,r){var i=n.attr(r);
i!==undefined&&i.length&&(t[r]=i);
}),t;
},_events:{keydown:function(e){this._start(e)&&this._keydown(e)&&e.preventDefault();
},keyup:"_stop",focus:function(){this.previous=this.element.val();
},blur:function(e){if(this.cancelBlur){delete this.cancelBlur;
return;
}this._refresh(),this.previous!==this.element.val()&&this._trigger("change",e);
},mousewheel:function(e,t){if(!t){return;
}if(!this.spinning&&!this._start(e)){return !1;
}this._spin((t>0?1:-1)*this.options.step,e),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(e);
},100),e.preventDefault();
},"mousedown .ui-spinner-button":function(t){function r(){var e=this.element[0]===this.document[0].activeElement;
e||(this.element.focus(),this.previous=n,this._delay(function(){this.previous=n;
}));
}var n;
n=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),t.preventDefault(),r.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,r.call(this);
});
if(this._start(t)===!1){return;
}this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t);
},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(t){if(!e(t.currentTarget).hasClass("ui-state-active")){return;
}if(this._start(t)===!1){return !1;
}this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t);
},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var e=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
this.element.attr("role","spinbutton"),this.buttons=e.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(e.height()*0.5)&&e.height()>0&&e.height(e.height()),this.options.disabled&&this.disable();
},_keydown:function(t){var n=this.options,r=e.ui.keyCode;
switch(t.keyCode){case r.UP:return this._repeat(null,1,t),!0;
case r.DOWN:return this._repeat(null,-1,t),!0;
case r.PAGE_UP:return this._repeat(null,n.page,t),!0;
case r.PAGE_DOWN:return this._repeat(null,-n.page,t),!0;
}return !1;
},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span></a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon "+this.options.icons.down+"'>&#9660;</span></a>";
},_start:function(e){return !this.spinning&&this._trigger("start",e)===!1?!1:(this.counter||(this.counter=1),this.spinning=!0,!0);
},_repeat:function(e,t,n){e=e||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,t,n);
},e),this._spin(t*this.options.step,n);
},_spin:function(e,t){var n=this.value()||0;
this.counter||(this.counter=1),n=this._adjustValue(n+e*this._increment(this.counter));
if(!this.spinning||this._trigger("spin",t,{value:n})!==!1){this._value(n),this.counter++;
}},_increment:function(t){var n=this.options.incremental;
return n?e.isFunction(n)?n(t):Math.floor(t*t*t/50000-t*t/500+17*t/200+1):1;
},_precision:function(){var e=this._precisionOf(this.options.step);
return this.options.min!==null&&(e=Math.max(e,this._precisionOf(this.options.min))),e;
},_precisionOf:function(e){var t=e.toString(),n=t.indexOf(".");
return n===-1?0:t.length-n-1;
},_adjustValue:function(e){var t,n,r=this.options;
return t=r.min!==null?r.min:0,n=e-t,n=Math.round(n/r.step)*r.step,e=t+n,e=parseFloat(e.toFixed(this._precision())),r.max!==null&&e>r.max?r.max:r.min!==null&&e<r.min?r.min:e;
},_stop:function(e){if(!this.spinning){return;
}clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",e);
},_setOption:function(e,t){if(e==="culture"||e==="numberFormat"){var n=this._parse(this.element.val());
this.options[e]=t,this.element.val(this._format(n));
return;
}(e==="max"||e==="min"||e==="step")&&typeof t=="string"&&(t=this._parse(t)),this._super(e,t),e==="disabled"&&(t?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")));
},_setOptions:t(function(e){this._super(e),this._value(this.element.val());
}),_parse:function(e){return typeof e=="string"&&e!==""&&(e=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(e,10,this.options.culture):+e),e===""||isNaN(e)?null:e;
},_format:function(e){return e===""?"":window.Globalize&&this.options.numberFormat?Globalize.format(e,this.options.numberFormat,this.options.culture):e;
},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())});
},_value:function(e,t){var n;
e!==""&&(n=this._parse(e),n!==null&&(t||(n=this._adjustValue(n)),e=this._format(n))),this.element.val(e),this._refresh();
},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element);
},stepUp:t(function(e){this._stepUp(e);
}),_stepUp:function(e){this._spin((e||1)*this.options.step);
},stepDown:t(function(e){this._stepDown(e);
}),_stepDown:function(e){this._spin((e||1)*-this.options.step);
},pageUp:t(function(e){this._stepUp((e||1)*this.options.page);
}),pageDown:t(function(e){this._stepDown((e||1)*this.options.page);
}),value:function(e){if(!arguments.length){return this._parse(this.element.val());
}t(this._value).call(this,e);
},widget:function(){return this.uiSpinner;
}});
})(jQuery);
(function(e,t){function i(){return ++n;
}function s(e){return e.hash.length>1&&e.href.replace(r,"")===location.href.replace(r,"");
}var n=0,r=/#.*$/;
e.widget("ui.tabs",{version:"1.9.1",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var t=this,n=this.options,r=n.active,i=location.hash.substring(1);
this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",n.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault();
}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur();
}),this._processTabs();
if(r===null){i&&this.tabs.each(function(t,n){if(e(n).attr("aria-controls")===i){return r=t,!1;
}}),r===null&&(r=this.tabs.index(this.tabs.filter(".ui-tabs-active")));
if(r===null||r===-1){r=this.tabs.length?0:!1;
}}r!==!1&&(r=this.tabs.index(this.tabs.eq(r)),r===-1&&(r=n.collapsible?!1:0)),n.active=r,!n.collapsible&&n.active===!1&&this.anchors.length&&(n.active=0),e.isArray(n.disabled)&&(n.disabled=e.unique(n.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e);
}))).sort()),this.options.active!==!1&&this.anchors.length?this.active=this._findActive(this.options.active):this.active=e(),this._refresh(),this.active.length&&this.load(n.active);
},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()};
},_tabKeydown:function(t){var n=e(this.document[0].activeElement).closest("li"),r=this.tabs.index(n),i=!0;
if(this._handlePageNav(t)){return;
}switch(t.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:r++;
break;
case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:i=!1,r--;
break;
case e.ui.keyCode.END:r=this.anchors.length-1;
break;
case e.ui.keyCode.HOME:r=0;
break;
case e.ui.keyCode.SPACE:t.preventDefault(),clearTimeout(this.activating),this._activate(r);
return;
case e.ui.keyCode.ENTER:t.preventDefault(),clearTimeout(this.activating),this._activate(r===this.options.active?!1:r);
return;
default:return;
}t.preventDefault(),clearTimeout(this.activating),r=this._focusNextTab(r,i),t.ctrlKey||(n.attr("aria-selected","false"),this.tabs.eq(r).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",r);
},this.delay));
},_panelKeydown:function(t){if(this._handlePageNav(t)){return;
}t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus());
},_handlePageNav:function(t){if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_UP){return this._activate(this._focusNextTab(this.options.active-1,!1)),!0;
}if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_DOWN){return this._activate(this._focusNextTab(this.options.active+1,!0)),!0;
}},_findNextTab:function(t,n){function i(){return t>r&&(t=0),t<0&&(t=r),t;
}var r=this.tabs.length-1;
while(e.inArray(i(),this.options.disabled)!==-1){t=n?t+1:t-1;
}return t;
},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e;
},_setOption:function(e,t){if(e==="active"){this._activate(t);
return;
}if(e==="disabled"){this._setupDisabled(t);
return;
}this._super(e,t),e==="collapsible"&&(this.element.toggleClass("ui-tabs-collapsible",t),!t&&this.options.active===!1&&this._activate(0)),e==="event"&&this._setupEvents(t),e==="heightStyle"&&this._setupHeightStyle(t);
},_tabId:function(e){return e.attr("aria-controls")||"ui-tabs-"+i();
},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):"";
},refresh:function(){var t=this.options,n=this.tablist.children(":has(a[href])");
t.disabled=e.map(n.filter(".ui-state-disabled"),function(e){return n.index(e);
}),this._processTabs(),t.active===!1||!this.anchors.length?(t.active=!1,this.active=e()):this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active),this._refresh();
},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0);
},_processTabs:function(){var t=this;
this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0];
}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(n,r){var i,o,u,a=e(r).uniqueId().attr("id"),f=e(r).closest("li"),l=f.attr("aria-controls");
s(r)?(i=r.hash,o=t.element.find(t._sanitizeSelector(i))):(u=t._tabId(f),i="#"+u,o=t.element.find(i),o.length||(o=t._createPanel(u),o.insertAfter(t.panels[n-1]||t.tablist)),o.attr("aria-live","polite")),o.length&&(t.panels=t.panels.add(o)),l&&f.data("ui-tabs-aria-controls",l),f.attr({"aria-controls":i.substring(1),"aria-labelledby":a}),o.attr("aria-labelledby",a);
}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel");
},_getList:function(){return this.element.find("ol,ul").eq(0);
},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0);
},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);
for(var n=0,r;
r=this.tabs[n];
n++){t===!0||e.inArray(n,t)!==-1?e(r).addClass("ui-state-disabled").attr("aria-disabled","true"):e(r).removeClass("ui-state-disabled").removeAttr("aria-disabled");
}this.options.disabled=t;
},_setupEvents:function(t){var n={click:function(e){e.preventDefault();
}};
t&&e.each(t.split(" "),function(e,t){n[t]="_eventHandler";
}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,n),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs);
},_setupHeightStyle:function(t){var n,r,i=this.element.parent();
t==="fill"?(e.support.minHeight||(r=i.css("overflow"),i.css("overflow","hidden")),n=i.height(),this.element.siblings(":visible").each(function(){var t=e(this),r=t.css("position");
if(r==="absolute"||r==="fixed"){return;
}n-=t.outerHeight(!0);
}),r&&i.css("overflow",r),this.element.children().not(this.panels).each(function(){n-=e(this).outerHeight(!0);
}),this.panels.each(function(){e(this).height(Math.max(0,n-e(this).innerHeight()+e(this).height()));
}).css("overflow","auto")):t==="auto"&&(n=0,this.panels.each(function(){n=Math.max(n,e(this).height("").height());
}).height(n));
},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i.closest("li"),o=s[0]===r[0],u=o&&n.collapsible,a=u?e():this._getPanelForTab(s),f=r.length?this._getPanelForTab(r):e(),l={oldTab:r,oldPanel:f,newTab:u?e():s,newPanel:a};
t.preventDefault();
if(s.hasClass("ui-state-disabled")||s.hasClass("ui-tabs-loading")||this.running||o&&!n.collapsible||this._trigger("beforeActivate",t,l)===!1){return;
}n.active=u?!1:this.tabs.index(s),this.active=o?e():s,this.xhr&&this.xhr.abort(),!f.length&&!a.length&&e.error("jQuery UI Tabs: Mismatching fragment identifier."),a.length&&this.load(this.tabs.index(s),t),this._toggle(t,l);
},_toggle:function(t,n){function o(){r.running=!1,r._trigger("activate",t,n);
}function u(){n.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),i.length&&r.options.show?r._show(i,r.options.show,o):(i.show(),o());
}var r=this,i=n.newPanel,s=n.oldPanel;
this.running=!0,s.length&&this.options.hide?this._hide(s,this.options.hide,function(){n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),u();
}):(n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),s.hide(),u()),s.attr({"aria-expanded":"false","aria-hidden":"true"}),n.oldTab.attr("aria-selected","false"),i.length&&s.length?n.oldTab.attr("tabIndex",-1):i.length&&this.tabs.filter(function(){return e(this).attr("tabIndex")===0;
}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}),n.newTab.attr({"aria-selected":"true",tabIndex:0});
},_activate:function(t){var n,r=this._findActive(t);
if(r[0]===this.active[0]){return;
}r.length||(r=this.active),n=r.find(".ui-tabs-anchor")[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop});
},_findActive:function(t){return t===!1?e():this.tabs.eq(t);
},_getIndex:function(e){return typeof e=="string"&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e;
},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeData("href.tabs").removeData("load.tabs").removeUniqueId(),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role");
}),this.tabs.each(function(){var t=e(this),n=t.data("ui-tabs-aria-controls");
n?t.attr("aria-controls",n):t.removeAttr("aria-controls");
}),this.options.heightStyle!=="content"&&this.panels.css("height","");
},enable:function(n){var r=this.options.disabled;
if(r===!1){return;
}n===t?r=!1:(n=this._getIndex(n),e.isArray(r)?r=e.map(r,function(e){return e!==n?e:null;
}):r=e.map(this.tabs,function(e,t){return t!==n?t:null;
})),this._setupDisabled(r);
},disable:function(n){var r=this.options.disabled;
if(r===!0){return;
}if(n===t){r=!0;
}else{n=this._getIndex(n);
if(e.inArray(n,r)!==-1){return;
}e.isArray(r)?r=e.merge([n],r).sort():r=[n];
}this._setupDisabled(r);
},load:function(t,n){t=this._getIndex(t);
var r=this,i=this.tabs.eq(t),o=i.find(".ui-tabs-anchor"),u=this._getPanelForTab(i),a={tab:i,panel:u};
if(s(o[0])){return;
}this.xhr=e.ajax(this._ajaxSettings(o,n,a)),this.xhr&&this.xhr.statusText!=="canceled"&&(i.addClass("ui-tabs-loading"),u.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){u.html(e),r._trigger("load",n,a);
},1);
}).complete(function(e,t){setTimeout(function(){t==="abort"&&r.panels.stop(!1,!0),i.removeClass("ui-tabs-loading"),u.removeAttr("aria-busy"),e===r.xhr&&delete r.xhr;
},1);
}));
},_ajaxSettings:function(t,n,r){var i=this;
return{url:t.attr("href"),beforeSend:function(t,s){return i._trigger("beforeLoad",n,e.extend({jqXHR:t,ajaxSettings:s},r));
}};
},_getPanelForTab:function(t){var n=e(t).attr("aria-controls");
return this.element.find(this._sanitizeSelector("#"+n));
}}),e.uiBackCompat!==!1&&(e.ui.tabs.prototype._ui=function(e,t){return{tab:e,panel:t,index:this.anchors.index(e)};
},e.widget("ui.tabs",e.ui.tabs,{url:function(e,t){this.anchors.eq(e).attr("href",t);
}}),e.widget("ui.tabs",e.ui.tabs,{options:{ajaxOptions:null,cache:!1},_create:function(){this._super();
var t=this;
this._on({tabsbeforeload:function(n,r){if(e.data(r.tab[0],"cache.tabs")){n.preventDefault();
return;
}r.jqXHR.success(function(){t.options.cache&&e.data(r.tab[0],"cache.tabs",!0);
});
}});
},_ajaxSettings:function(t,n,r){var i=this.options.ajaxOptions;
return e.extend({},i,{error:function(e,t){try{i.error(e,t,r.tab.closest("li").index(),r.tab[0]);
}catch(n){}}},this._superApply(arguments));
},_setOption:function(e,t){e==="cache"&&t===!1&&this.anchors.removeData("cache.tabs"),this._super(e,t);
},_destroy:function(){this.anchors.removeData("cache.tabs"),this._super();
},url:function(e){this.anchors.eq(e).removeData("cache.tabs"),this._superApply(arguments);
}}),e.widget("ui.tabs",e.ui.tabs,{abort:function(){this.xhr&&this.xhr.abort();
}}),e.widget("ui.tabs",e.ui.tabs,{options:{spinner:"<em>Loading&#8230;</em>"},_create:function(){this._super(),this._on({tabsbeforeload:function(e,t){if(e.target!==this.element[0]||!this.options.spinner){return;
}var n=t.tab.find("span"),r=n.html();
n.html(this.options.spinner),t.jqXHR.complete(function(){n.html(r);
});
}});
}}),e.widget("ui.tabs",e.ui.tabs,{options:{enable:null,disable:null},enable:function(t){var n=this.options,r;
if(t&&n.disabled===!0||e.isArray(n.disabled)&&e.inArray(t,n.disabled)!==-1){r=!0;
}this._superApply(arguments),r&&this._trigger("enable",null,this._ui(this.anchors[t],this.panels[t]));
},disable:function(t){var n=this.options,r;
if(t&&n.disabled===!1||e.isArray(n.disabled)&&e.inArray(t,n.disabled)===-1){r=!0;
}this._superApply(arguments),r&&this._trigger("disable",null,this._ui(this.anchors[t],this.panels[t]));
}}),e.widget("ui.tabs",e.ui.tabs,{options:{add:null,remove:null,tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},add:function(n,r,i){i===t&&(i=this.anchors.length);
var s,o,u=this.options,a=e(u.tabTemplate.replace(/#\{href\}/g,n).replace(/#\{label\}/g,r)),f=n.indexOf("#")?this._tabId(a):n.replace("#","");
return a.addClass("ui-state-default ui-corner-top").data("ui-tabs-destroy",!0),a.attr("aria-controls",f),s=i>=this.tabs.length,o=this.element.find("#"+f),o.length||(o=this._createPanel(f),s?i>0?o.insertAfter(this.panels.eq(-1)):o.appendTo(this.element):o.insertBefore(this.panels[i])),o.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").hide(),s?a.appendTo(this.tablist):a.insertBefore(this.tabs[i]),u.disabled=e.map(u.disabled,function(e){return e>=i?++e:e;
}),this.refresh(),this.tabs.length===1&&u.active===!1&&this.option("active",0),this._trigger("add",null,this._ui(this.anchors[i],this.panels[i])),this;
},remove:function(t){t=this._getIndex(t);
var n=this.options,r=this.tabs.eq(t).remove(),i=this._getPanelForTab(r).remove();
return r.hasClass("ui-tabs-active")&&this.anchors.length>2&&this._activate(t+(t+1<this.anchors.length?1:-1)),n.disabled=e.map(e.grep(n.disabled,function(e){return e!==t;
}),function(e){return e>=t?--e:e;
}),this.refresh(),this._trigger("remove",null,this._ui(r.find("a")[0],i[0])),this;
}}),e.widget("ui.tabs",e.ui.tabs,{length:function(){return this.anchors.length;
}}),e.widget("ui.tabs",e.ui.tabs,{options:{idPrefix:"ui-tabs-"},_tabId:function(t){var n=t.is("li")?t.find("a[href]"):t;
return n=n[0],e(n).closest("li").attr("aria-controls")||n.title&&n.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF\-]/g,"")||this.options.idPrefix+i();
}}),e.widget("ui.tabs",e.ui.tabs,{options:{panelTemplate:"<div></div>"},_createPanel:function(t){return e(this.options.panelTemplate).attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0);
}}),e.widget("ui.tabs",e.ui.tabs,{_create:function(){var e=this.options;
e.active===null&&e.selected!==t&&(e.active=e.selected===-1?!1:e.selected),this._super(),e.selected=e.active,e.selected===!1&&(e.selected=-1);
},_setOption:function(e,t){if(e!=="selected"){return this._super(e,t);
}var n=this.options;
this._super("active",t===-1?!1:t),n.selected=n.active,n.selected===!1&&(n.selected=-1);
},_eventHandler:function(){this._superApply(arguments),this.options.selected=this.options.active,this.options.selected===!1&&(this.options.selected=-1);
}}),e.widget("ui.tabs",e.ui.tabs,{options:{show:null,select:null},_create:function(){this._super(),this.options.active!==!1&&this._trigger("show",null,this._ui(this.active.find(".ui-tabs-anchor")[0],this._getPanelForTab(this.active)[0]));
},_trigger:function(e,t,n){var r=this._superApply(arguments);
return r?(e==="beforeActivate"&&n.newTab.length?r=this._super("select",t,{tab:n.newTab.find(".ui-tabs-anchor")[0],panel:n.newPanel[0],index:n.newTab.closest("li").index()}):e==="activate"&&n.newTab.length&&(r=this._super("show",t,{tab:n.newTab.find(".ui-tabs-anchor")[0],panel:n.newPanel[0],index:n.newTab.closest("li").index()})),r):!1;
}}),e.widget("ui.tabs",e.ui.tabs,{select:function(e){e=this._getIndex(e);
if(e===-1){if(!this.options.collapsible||this.options.selected===-1){return;
}e=this.options.selected;
}this.anchors.eq(e).trigger(this.options.event+this.eventNamespace);
}}),function(){var t=0;
e.widget("ui.tabs",e.ui.tabs,{options:{cookie:null},_create:function(){var e=this.options,t;
e.active==null&&e.cookie&&(t=parseInt(this._cookie(),10),t===-1&&(t=!1),e.active=t),this._super();
},_cookie:function(n){var r=[this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+ ++t)];
return arguments.length&&(r.push(n===!1?-1:n),r.push(this.options.cookie)),e.cookie.apply(null,r);
},_refresh:function(){this._super(),this.options.cookie&&this._cookie(this.options.active,this.options.cookie);
},_eventHandler:function(){this._superApply(arguments),this.options.cookie&&this._cookie(this.options.active,this.options.cookie);
},_destroy:function(){this._super(),this.options.cookie&&this._cookie(null,this.options.cookie);
}});
}(),e.widget("ui.tabs",e.ui.tabs,{_trigger:function(t,n,r){var i=e.extend({},r);
return t==="load"&&(i.panel=i.panel[0],i.tab=i.tab.find(".ui-tabs-anchor")[0]),this._super(t,n,i);
}}),e.widget("ui.tabs",e.ui.tabs,{options:{fx:null},_getFx:function(){var t,n,r=this.options.fx;
return r&&(e.isArray(r)?(t=r[0],n=r[1]):t=n=r),r?{show:n,hide:t}:null;
},_toggle:function(e,t){function o(){n.running=!1,n._trigger("activate",e,t);
}function u(){t.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),r.length&&s.show?r.animate(s.show,s.show.duration,function(){o();
}):(r.show(),o());
}var n=this,r=t.newPanel,i=t.oldPanel,s=this._getFx();
if(!s){return this._super(e,t);
}n.running=!0,i.length&&s.hide?i.animate(s.hide,s.hide.duration,function(){t.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),u();
}):(t.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),i.hide(),u());
}}));
})(jQuery);
(function(e){function n(t,n){var r=(t.attr("aria-describedby")||"").split(/\s+/);
r.push(n),t.data("ui-tooltip-id",n).attr("aria-describedby",e.trim(r.join(" ")));
}function r(t){var n=t.data("ui-tooltip-id"),r=(t.attr("aria-describedby")||"").split(/\s+/),i=e.inArray(n,r);
i!==-1&&r.splice(i,1),t.removeData("ui-tooltip-id"),r=e.trim(r.join(" ")),r?t.attr("aria-describedby",r):t.removeAttr("aria-describedby");
}var t=0;
e.widget("ui.tooltip",{version:"1.9.1",options:{content:function(){return e(this).attr("title");
},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flipfit"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable();
},_setOption:function(t,n){var r=this;
if(t==="disabled"){this[n?"_disable":"_enable"](),this.options[t]=n;
return;
}this._super(t,n),t==="content"&&e.each(this.tooltips,function(e,t){r._updateContent(t);
});
},_disable:function(){var t=this;
e.each(this.tooltips,function(n,r){var i=e.Event("blur");
i.target=i.currentTarget=r[0],t.close(i,!0);
}),this.element.find(this.options.items).andSelf().each(function(){var t=e(this);
t.is("[title]")&&t.data("ui-tooltip-title",t.attr("title")).attr("title","");
});
},_enable:function(){this.element.find(this.options.items).andSelf().each(function(){var t=e(this);
t.data("ui-tooltip-title")&&t.attr("title",t.data("ui-tooltip-title"));
});
},open:function(t){var n=this,r=e(t?t.target:this.element).closest(this.options.items);
if(!r.length){return;
}if(this.options.track&&r.data("ui-tooltip-id")){this._find(r).position(e.extend({of:r},this.options.position)),this._off(this.document,"mousemove");
return;
}r.attr("title")&&r.data("ui-tooltip-title",r.attr("title")),r.data("tooltip-open",!0),t&&t.type==="mouseover"&&r.parents().each(function(){var t;
e(this).data("tooltip-open")&&(t=e.Event("blur"),t.target=t.currentTarget=this,n.close(t,!0)),this.title&&(e(this).uniqueId(),n.parents[this.id]={element:this,title:this.title},this.title="");
}),this._updateContent(r,t);
},_updateContent:function(e,t){var n,r=this.options.content,i=this;
if(typeof r=="string"){return this._open(t,e,r);
}n=r.call(e[0],function(n){if(!e.data("tooltip-open")){return;
}i._delay(function(){this._open(t,e,n);
});
}),n&&this._open(t,e,n);
},_open:function(t,r,i){function f(e){a.of=e;
if(s.is(":hidden")){return;
}s.position(a);
}var s,o,u,a=e.extend({},this.options.position);
if(!i){return;
}s=this._find(r);
if(s.length){s.find(".ui-tooltip-content").html(i);
return;
}r.is("[title]")&&(t&&t.type==="mouseover"?r.attr("title",""):r.removeAttr("title")),s=this._tooltip(r),n(r,s.attr("id")),s.find(".ui-tooltip-content").html(i),this.options.track&&t&&/^mouse/.test(t.originalEvent.type)?(this._on(this.document,{mousemove:f}),f(t)):s.position(e.extend({of:r},this.options.position)),s.hide(),this._show(s,this.options.show),this.options.show&&this.options.show.delay&&(u=setInterval(function(){s.is(":visible")&&(f(a.of),clearInterval(u));
},e.fx.interval)),this._trigger("open",t,{tooltip:s}),o={keyup:function(t){if(t.keyCode===e.ui.keyCode.ESCAPE){var n=e.Event(t);
n.currentTarget=r[0],this.close(n,!0);
}},remove:function(){this._removeTooltip(s);
}};
if(!t||t.type==="mouseover"){o.mouseleave="close";
}if(!t||t.type==="focusin"){o.focusout="close";
}this._on(r,o);
},close:function(t){var n=this,i=e(t?t.currentTarget:this.element),s=this._find(i);
if(this.closing){return;
}i.data("ui-tooltip-title")&&i.attr("title",i.data("ui-tooltip-title")),r(i),s.stop(!0),this._hide(s,this.options.hide,function(){n._removeTooltip(e(this));
}),i.removeData("tooltip-open"),this._off(i,"mouseleave focusout keyup"),i[0]!==this.element[0]&&this._off(i,"remove"),this._off(this.document,"mousemove"),t&&t.type==="mouseleave"&&e.each(this.parents,function(e,t){t.element.title=t.title,delete n.parents[e];
}),this.closing=!0,this._trigger("close",t,{tooltip:s}),this.closing=!1;
},_tooltip:function(n){var r="ui-tooltip-"+t++,i=e("<div>").attr({id:r,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));
return e("<div>").addClass("ui-tooltip-content").appendTo(i),i.appendTo(this.document[0].body),e.fn.bgiframe&&i.bgiframe(),this.tooltips[r]=n,i;
},_find:function(t){var n=t.data("ui-tooltip-id");
return n?e("#"+n):e();
},_removeTooltip:function(e){e.remove(),delete this.tooltips[e.attr("id")];
},_destroy:function(){var t=this;
e.each(this.tooltips,function(n,r){var i=e.Event("blur");
i.target=i.currentTarget=r[0],t.close(i,!0),e("#"+n).remove(),r.data("ui-tooltip-title")&&(r.attr("title",r.data("ui-tooltip-title")),r.removeData("ui-tooltip-title"));
});
}});
})(jQuery);
(function($){$.extend({tablesorterPager:new function(){function updatePageDisplay(c){var s=$(c.cssPageDisplay,c.container).val((c.page+1)+c.seperator+c.totalPages);
}function setPageSize(table,size){var c=table.config;
c.size=size;
c.totalPages=Math.ceil(c.totalRows/c.size);
c.pagerPositionSet=false;
moveToPage(table);
fixPosition(table);
}function fixPosition(table){var c=table.config;
if(!c.pagerPositionSet&&c.positionFixed){var c=table.config,o=$(table);
if(o.offset){c.container.css({top:o.offset().top+o.height()+"px",position:"absolute"});
}c.pagerPositionSet=true;
}}function moveToFirstPage(table){var c=table.config;
c.page=0;
moveToPage(table);
}function moveToLastPage(table){var c=table.config;
c.page=(c.totalPages-1);
moveToPage(table);
}function moveToNextPage(table){var c=table.config;
c.page++;
if(c.page>=(c.totalPages-1)){c.page=(c.totalPages-1);
}moveToPage(table);
}function moveToPrevPage(table){var c=table.config;
c.page--;
if(c.page<=0){c.page=0;
}moveToPage(table);
}function moveToPage(table){var c=table.config;
if(c.page<0||c.page>(c.totalPages-1)){c.page=0;
}renderTable(table,c.rowsCopy);
}function renderTable(table,rows){var c=table.config;
var l=rows.length;
var s=(c.page*c.size);
var e=(s+c.size);
if(e>rows.length){e=rows.length;
}var tableBody=$(table.tBodies[0]);
$.tablesorter.clearTableBody(table);
for(var i=s;
i<e;
i++){var o=rows[i];
var l=o.length;
for(var j=0;
j<l;
j++){tableBody[0].appendChild(o[j]);
}}fixPosition(table,tableBody);
$(table).trigger("applyWidgets");
if(c.page>=c.totalPages){moveToLastPage(table);
}updatePageDisplay(c);
}this.appender=function(table,rows){var c=table.config;
c.rowsCopy=rows;
c.totalRows=rows.length;
c.totalPages=Math.ceil(c.totalRows/c.size);
renderTable(table,rows);
};
this.defaults={size:10,offset:0,page:0,totalRows:0,totalPages:0,container:null,cssNext:".next",cssPrev:".prev",cssFirst:".first",cssLast:".last",cssPageDisplay:".pagedisplay",cssPageSize:".pagesize",seperator:"/",positionFixed:true,appender:this.appender};
this.construct=function(settings){return this.each(function(){config=$.extend(this.config,$.tablesorterPager.defaults,settings);
var table=this,pager=config.container;
$(this).trigger("appendCache");
config.size=parseInt($(".pagesize",pager).val());
$(config.cssFirst,pager).click(function(){moveToFirstPage(table);
return false;
});
$(config.cssNext,pager).click(function(){moveToNextPage(table);
return false;
});
$(config.cssPrev,pager).click(function(){moveToPrevPage(table);
return false;
});
$(config.cssLast,pager).click(function(){moveToLastPage(table);
return false;
});
$(config.cssPageSize,pager).change(function(){setPageSize(table,parseInt($(this).val()));
return false;
});
});
};
}});
$.fn.extend({tablesorterPager:$.tablesorterPager.construct});
})(jQuery);
/*
* TableSorter 2.7 - Client-side table sorting with ease!
* @requires jQuery v1.2.6+
*
* Copyright (c) 2007 Christian Bach
* Examples and docs at: http://tablesorter.com
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @type jQuery
* @name tablesorter
* @cat Plugins/Tablesorter
* @author Christian Bach/christian.bach@polyester.se
* @contributor Rob Garrison/https://github.com/Mottie/tablesorter
*/
!(function($){$.extend({tablesorter:new function(){var ts=this;
ts.version="2.7";
ts.parsers=[];
ts.widgets=[];
ts.defaults={theme:"default",widthFixed:false,showProcessing:false,headerTemplate:"{content}",onRenderTemplate:null,onRenderHeader:null,cancelSelection:true,dateFormat:"mmddyyyy",sortMultiSortKey:"shiftKey",sortResetKey:"ctrlKey",usNumberFormat:true,delayInit:false,serverSideSorting:false,headers:{},ignoreCase:true,sortForce:null,sortList:[],sortAppend:null,sortInitialOrder:"asc",sortLocaleCompare:false,sortReset:false,sortRestart:false,emptyTo:"bottom",stringTo:"max",textExtraction:"simple",textSorter:null,widgets:[],widgetOptions:{zebra:["even","odd"]},initWidgets:true,initialized:null,tableClass:"tablesorter",cssAsc:"tablesorter-headerAsc",cssChildRow:"tablesorter-childRow",cssDesc:"tablesorter-headerDesc",cssHeader:"tablesorter-header",cssHeaderRow:"tablesorter-headerRow",cssIcon:"tablesorter-icon",cssInfoBlock:"tablesorter-infoOnly",cssProcessing:"tablesorter-processing",selectorHeaders:"> thead th, > thead td",selectorSort:"th, td",selectorRemove:".remove-me",debug:false,headerList:[],empties:{},strings:{},parsers:[]};
function log(s){if(typeof console!=="undefined"&&typeof console.log!=="undefined"){console.log(s);
}else{alert(s);
}}function benchmark(s,d){log(s+" ("+(new Date().getTime()-d.getTime())+"ms)");
}ts.benchmark=benchmark;
function getElementText(table,node,cellIndex){if(!node){return"";
}var c=table.config,t=c.textExtraction,text="";
if(t==="simple"){if(c.supportsTextContent){text=node.textContent;
}else{text=$(node).text();
}}else{if(typeof(t)==="function"){text=t(node,table,cellIndex);
}else{if(typeof(t)==="object"&&t.hasOwnProperty(cellIndex)){text=t[cellIndex](node,table,cellIndex);
}else{text=c.supportsTextContent?node.textContent:$(node).text();
}}}return $.trim(text);
}function detectParserForColumn(table,rows,rowIndex,cellIndex){var i,l=ts.parsers.length,node=false,nodeValue="",keepLooking=true;
while(nodeValue===""&&keepLooking){rowIndex++;
if(rows[rowIndex]){node=rows[rowIndex].cells[cellIndex];
nodeValue=getElementText(table,node,cellIndex);
if(table.config.debug){log("Checking if value was empty on row "+rowIndex+", column: "+cellIndex+": "+nodeValue);
}}else{keepLooking=false;
}}for(i=1;
i<l;
i++){if(ts.parsers[i].is(nodeValue,table,node)){return ts.parsers[i];
}}return ts.parsers[0];
}function buildParserCache(table){var c=table.config,tb=$(table.tBodies).filter(":not(."+c.cssInfoBlock+")"),rows,list,l,i,h,ch,p,parsersDebug="";
if(tb.length===0){return c.debug?log("*Empty table!* Not building a parser cache"):"";
}rows=tb[0].rows;
if(rows[0]){list=[];
l=rows[0].cells.length;
for(i=0;
i<l;
i++){h=c.$headers.filter(":not([colspan])");
h=h.add(c.$headers.filter('[colspan="1"]')).filter('[data-column="'+i+'"]:last');
ch=c.headers[i];
p=ts.getParserById(ts.getData(h,ch,"sorter"));
c.empties[i]=ts.getData(h,ch,"empty")||c.emptyTo||(c.emptyToBottom?"bottom":"top");
c.strings[i]=ts.getData(h,ch,"string")||c.stringTo||"max";
if(!p){p=detectParserForColumn(table,rows,-1,i);
}if(c.debug){parsersDebug+="column:"+i+"; parser:"+p.id+"; string:"+c.strings[i]+"; empty: "+c.empties[i]+"\n";
}list.push(p);
}}if(c.debug){log(parsersDebug);
}return list;
}function buildCache(table){var b=table.tBodies,tc=table.config,totalRows,totalCells,parsers=tc.parsers,t,v,i,j,k,c,cols,cacheTime,colMax=[];
tc.cache={};
if(!parsers){return tc.debug?log("*Empty table!* Not building a cache"):"";
}if(tc.debug){cacheTime=new Date();
}if(tc.showProcessing){ts.isProcessing(table,true);
}for(k=0;
k<b.length;
k++){tc.cache[k]={row:[],normalized:[]};
if(!$(b[k]).hasClass(tc.cssInfoBlock)){totalRows=(b[k]&&b[k].rows.length)||0;
totalCells=(b[k].rows[0]&&b[k].rows[0].cells.length)||0;
for(i=0;
i<totalRows;
++i){c=$(b[k].rows[i]);
cols=[];
if(c.hasClass(tc.cssChildRow)){tc.cache[k].row[tc.cache[k].row.length-1]=tc.cache[k].row[tc.cache[k].row.length-1].add(c);
continue;
}tc.cache[k].row.push(c);
for(j=0;
j<totalCells;
++j){t=getElementText(table,c[0].cells[j],j);
v=parsers[j].format(t,table,c[0].cells[j],j);
cols.push(v);
if((parsers[j].type||"").toLowerCase()==="numeric"){colMax[j]=Math.max(Math.abs(v),colMax[j]||0);
}}cols.push(tc.cache[k].normalized.length);
tc.cache[k].normalized.push(cols);
}tc.cache[k].colMax=colMax;
}}if(tc.showProcessing){ts.isProcessing(table);
}if(tc.debug){benchmark("Building cache for "+totalRows+" rows",cacheTime);
}}function appendToTable(table,init){var c=table.config,b=table.tBodies,rows=[],c2=c.cache,r,n,totalRows,checkCell,$bk,$tb,i,j,k,l,pos,appendTime;
if(!c2[0]){return;
}if(c.debug){appendTime=new Date();
}for(k=0;
k<b.length;
k++){$bk=$(b[k]);
if(!$bk.hasClass(c.cssInfoBlock)){$tb=ts.processTbody(table,$bk,true);
r=c2[k].row;
n=c2[k].normalized;
totalRows=n.length;
checkCell=totalRows?(n[0].length-1):0;
for(i=0;
i<totalRows;
i++){pos=n[i][checkCell];
rows.push(r[pos]);
if(!c.appender||!c.removeRows){l=r[pos].length;
for(j=0;
j<l;
j++){$tb.append(r[pos][j]);
}}}ts.processTbody(table,$tb,false);
}}if(c.appender){c.appender(table,rows);
}if(c.debug){benchmark("Rebuilt table",appendTime);
}if(!init){ts.applyWidget(table);
}$(table).trigger("sortEnd",table);
}function computeThIndexes(t){var matrix=[],lookup={},trs=$(t).find("thead:eq(0), tfoot").children("tr"),i,j,k,l,c,cells,rowIndex,cellId,rowSpan,colSpan,firstAvailCol,matrixrow;
for(i=0;
i<trs.length;
i++){cells=trs[i].cells;
for(j=0;
j<cells.length;
j++){c=cells[j];
rowIndex=c.parentNode.rowIndex;
cellId=rowIndex+"-"+c.cellIndex;
rowSpan=c.rowSpan||1;
colSpan=c.colSpan||1;
if(typeof(matrix[rowIndex])==="undefined"){matrix[rowIndex]=[];
}for(k=0;
k<matrix[rowIndex].length+1;
k++){if(typeof(matrix[rowIndex][k])==="undefined"){firstAvailCol=k;
break;
}}lookup[cellId]=firstAvailCol;
$(c).attr({"data-column":firstAvailCol});
for(k=rowIndex;
k<rowIndex+rowSpan;
k++){if(typeof(matrix[k])==="undefined"){matrix[k]=[];
}matrixrow=matrix[k];
for(l=firstAvailCol;
l<firstAvailCol+colSpan;
l++){matrixrow[l]="x";
}}}}return lookup;
}function formatSortingOrder(v){return(/^d/i.test(v)||v===1);
}function buildHeaders(table){var header_index=computeThIndexes(table),ch,$t,h,i,t,lock,time,$tableHeaders,c=table.config;
c.headerList=[],c.headerContent=[];
if(c.debug){time=new Date();
}i=c.cssIcon?'<i class="'+c.cssIcon+'"></i>':"";
$tableHeaders=$(table).find(c.selectorHeaders).each(function(index){$t=$(this);
ch=c.headers[index];
c.headerContent[index]=this.innerHTML;
t=c.headerTemplate.replace(/\{content\}/g,this.innerHTML).replace(/\{icon\}/g,i);
if(c.onRenderTemplate){h=c.onRenderTemplate.apply($t,[index,t]);
if(h&&typeof h==="string"){t=h;
}}this.innerHTML='<div class="tablesorter-header-inner">'+t+"</div>";
if(c.onRenderHeader){c.onRenderHeader.apply($t,[index]);
}this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];
this.order=formatSortingOrder(ts.getData($t,ch,"sortInitialOrder")||c.sortInitialOrder)?[1,0,2]:[0,1,2];
this.count=-1;
if(ts.getData($t,ch,"sorter")==="false"){this.sortDisabled=true;
$t.addClass("sorter-false");
}else{$t.removeClass("sorter-false");
}this.lockedOrder=false;
lock=ts.getData($t,ch,"lockedOrder")||false;
if(typeof(lock)!=="undefined"&&lock!==false){this.order=this.lockedOrder=formatSortingOrder(lock)?[1,1,1]:[0,0,0];
}$t.addClass((this.sortDisabled?"sorter-false ":" ")+c.cssHeader);
c.headerList[index]=this;
$t.parent().addClass(c.cssHeaderRow);
});
if(table.config.debug){benchmark("Built headers:",time);
log($tableHeaders);
}return $tableHeaders;
}function setHeadersCss(table){var f,i,j,l,c=table.config,list=c.sortList,css=[c.cssAsc,c.cssDesc],$t=$(table).find("tfoot tr").children().removeClass(css.join(" "));
c.$headers.removeClass(css.join(" "));
l=list.length;
for(i=0;
i<l;
i++){if(list[i][1]!==2){f=c.$headers.not(".sorter-false").filter('[data-column="'+list[i][0]+'"]'+(l===1?":last":""));
if(f.length){for(j=0;
j<f.length;
j++){if(!f[j].sortDisabled){f.eq(j).addClass(css[list[i][1]]);
if($t.length){$t.filter('[data-column="'+list[i][0]+'"]').eq(j).addClass(css[list[i][1]]);
}}}}}}}function fixColumnWidth(table){if(table.config.widthFixed&&$(table).find("colgroup").length===0){var colgroup=$("<colgroup>"),overallWidth=$(table).width();
$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($("<col>").css("width",parseInt(($(this).width()/overallWidth)*1000,10)/10+"%"));
});
$(table).prepend(colgroup);
}}function updateHeaderSortCount(table,list){var s,t,o,c=table.config,sl=list||c.sortList;
c.sortList=[];
$.each(sl,function(i,v){s=[parseInt(v[0],10),parseInt(v[1],10)];
o=c.headerList[s[0]];
if(o){c.sortList.push(s);
t=$.inArray(s[1],o.order);
o.count=t>=0?t:s[1]%(c.sortReset?3:2);
}});
}function getCachedSortType(parsers,i){return(parsers&&parsers[i])?parsers[i].type||"":"";
}function multisort(table){var dynamicExp,sortWrapper,col,mx=0,dir=0,tc=table.config,sortList=tc.sortList,l=sortList.length,bl=table.tBodies.length,sortTime,i,j,k,c,colMax,cache,lc,s,e,order,orgOrderCol;
if(tc.serverSideSorting||!tc.cache[0]){return;
}if(tc.debug){sortTime=new Date();
}for(k=0;
k<bl;
k++){colMax=tc.cache[k].colMax;
cache=tc.cache[k].normalized;
lc=cache.length;
orgOrderCol=(cache&&cache[0])?cache[0].length-1:0;
cache.sort(function(a,b){for(i=0;
i<l;
i++){c=sortList[i][0];
order=sortList[i][1];
s=/n/i.test(getCachedSortType(tc.parsers,c))?"Numeric":"Text";
s+=order===0?"":"Desc";
if(/Numeric/.test(s)&&tc.strings[c]){if(typeof(tc.string[tc.strings[c]])==="boolean"){dir=(order===0?1:-1)*(tc.string[tc.strings[c]]?-1:1);
}else{dir=(tc.strings[c])?tc.string[tc.strings[c]]||0:0;
}}var sort=$.tablesorter["sort"+s](table,a[c],b[c],c,colMax[c],dir);
if(sort){return sort;
}}return a[orgOrderCol]-b[orgOrderCol];
});
}if(tc.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time",sortTime);
}}function resortComplete($table,callback){$table.trigger("updateComplete");
if(typeof callback==="function"){callback($table[0]);
}}function checkResort($table,flag,callback){if(flag!==false){$table.trigger("sorton",[$table[0].config.sortList,function(){resortComplete($table,callback);
}]);
}else{resortComplete($table,callback);
}}ts.construct=function(settings){return this.each(function(){if(!this.tHead||this.tBodies.length===0||this.hasInitialized===true){return(this.config.debug)?log("stopping initialization! No thead, tbody or tablesorter has already been initialized"):"";
}var $cell,$this=$(this),c,i,j,k="",a,s,o,downTime,m=$.metadata;
this.hasInitialized=false;
this.config={};
c=$.extend(true,this.config,ts.defaults,settings);
$.data(this,"tablesorter",c);
if(c.debug){$.data(this,"startoveralltimer",new Date());
}c.supportsTextContent=$("<span>x</span>")[0].textContent==="x";
c.supportsDataObject=parseFloat($.fn.jquery)>=1.4;
c.string={max:1,min:-1,"max+":1,"max-":-1,zero:0,none:0,"null":0,top:true,bottom:false};
if(!/tablesorter\-/.test($this.attr("class"))){k=(c.theme!==""?" tablesorter-"+c.theme:"");
}$this.addClass(c.tableClass+k);
c.$headers=buildHeaders(this);
c.parsers=buildParserCache(this);
if(!c.delayInit){buildCache(this);
}c.$headers.find("*").andSelf().filter(c.selectorSort).unbind("mousedown.tablesorter mouseup.tablesorter").bind("mousedown.tablesorter mouseup.tablesorter",function(e,external){var $cell=this.tagName.match("TH|TD")?$(this):$(this).parents("th, td").filter(":last"),cell=$cell[0];
if((e.which||e.button)!==1){return false;
}if(e.type==="mousedown"){downTime=new Date().getTime();
return e.target.tagName==="INPUT"?"":!c.cancelSelection;
}if(external!==true&&(new Date().getTime()-downTime>250)){return false;
}if(c.delayInit&&!c.cache){buildCache($this[0]);
}if(!cell.sortDisabled){$this.trigger("sortStart",$this[0]);
k=!e[c.sortMultiSortKey];
cell.count=e[c.sortResetKey]?2:(cell.count+1)%(c.sortReset?3:2);
if(c.sortRestart){i=cell;
c.$headers.each(function(){if(this!==i&&(k||!$(this).is("."+c.cssDesc+",."+c.cssAsc))){this.count=-1;
}});
}i=cell.column;
if(k){c.sortList=[];
if(c.sortForce!==null){a=c.sortForce;
for(j=0;
j<a.length;
j++){if(a[j][0]!==i){c.sortList.push(a[j]);
}}}o=cell.order[cell.count];
if(o<2){c.sortList.push([i,o]);
if(cell.colSpan>1){for(j=1;
j<cell.colSpan;
j++){c.sortList.push([i+j,o]);
}}}}else{if(c.sortAppend&&c.sortList.length>1){if(ts.isValueInArray(c.sortAppend[0][0],c.sortList)){c.sortList.pop();
}}if(ts.isValueInArray(i,c.sortList)){for(j=0;
j<c.sortList.length;
j++){s=c.sortList[j];
o=c.headerList[s[0]];
if(s[0]===i){s[1]=o.order[o.count];
if(s[1]===2){c.sortList.splice(j,1);
o.count=-1;
}}}}else{o=cell.order[cell.count];
if(o<2){c.sortList.push([i,o]);
if(cell.colSpan>1){for(j=1;
j<cell.colSpan;
j++){c.sortList.push([i+j,o]);
}}}}}if(c.sortAppend!==null){a=c.sortAppend;
for(j=0;
j<a.length;
j++){if(a[j][0]!==i){c.sortList.push(a[j]);
}}}$this.trigger("sortBegin",$this[0]);
setTimeout(function(){setHeadersCss($this[0]);
multisort($this[0]);
appendToTable($this[0]);
},1);
}});
if(c.cancelSelection){c.$headers.each(function(){this.onselectstart=function(){return false;
};
});
}$this.unbind("sortReset update updateCell addRows sorton appendCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave").bind("sortReset",function(){c.sortList=[];
setHeadersCss(this);
multisort(this);
appendToTable(this);
}).bind("update",function(e,resort,callback){$(c.selectorRemove,this).remove();
c.parsers=buildParserCache(this);
buildCache(this);
checkResort($this,resort,callback);
}).bind("updateCell",function(e,cell,resort,callback){var l,row,icell,t=this,$tb=$(this).find("tbody"),tbdy=$tb.index($(cell).parents("tbody").filter(":last")),$row=$(cell).parents("tr").filter(":last");
cell=$(cell)[0];
if($tb.length&&tbdy>=0){row=$tb.eq(tbdy).find("tr").index($row);
icell=cell.cellIndex;
l=t.config.cache[tbdy].normalized[row].length-1;
t.config.cache[tbdy].row[t.config.cache[tbdy].normalized[row][l]]=$row;
t.config.cache[tbdy].normalized[row][icell]=c.parsers[icell].format(getElementText(t,cell,icell),t,cell,icell);
checkResort($this,resort,callback);
}}).bind("addRows",function(e,$row,resort,callback){var i,rows=$row.filter("tr").length,dat=[],l=$row[0].cells.length,t=this,tbdy=$(this).find("tbody").index($row.closest("tbody"));
if(!c.parsers){c.parsers=buildParserCache(t);
}for(i=0;
i<rows;
i++){for(j=0;
j<l;
j++){dat[j]=c.parsers[j].format(getElementText(t,$row[i].cells[j],j),t,$row[i].cells[j],j);
}dat.push(c.cache[tbdy].row.length);
c.cache[tbdy].row.push([$row[i]]);
c.cache[tbdy].normalized.push(dat);
dat=[];
}checkResort($this,resort,callback);
}).bind("sorton",function(e,list,callback,init){$(this).trigger("sortStart",this);
updateHeaderSortCount(this,list);
setHeadersCss(this);
multisort(this);
appendToTable(this,init);
if(typeof callback==="function"){callback(this);
}}).bind("appendCache",function(e,callback,init){appendToTable(this,init);
if(typeof callback==="function"){callback(this);
}}).bind("applyWidgetId",function(e,id){ts.getWidgetById(id).format(this,c,c.widgetOptions);
}).bind("applyWidgets",function(e,init){ts.applyWidget(this,init);
}).bind("refreshWidgets",function(e,all,dontapply){ts.refreshWidgets(this,all,dontapply);
}).bind("destroy",function(e,c,cb){ts.destroy(this,c,cb);
});
if(c.supportsDataObject&&typeof $this.data().sortlist!=="undefined"){c.sortList=$this.data().sortlist;
}else{if(m&&($this.metadata()&&$this.metadata().sortlist)){c.sortList=$this.metadata().sortlist;
}}ts.applyWidget(this,true);
if(c.sortList.length>0){$this.trigger("sorton",[c.sortList,{},!c.initWidgets]);
}else{if(c.initWidgets){ts.applyWidget(this);
}}fixColumnWidth(this);
if(c.showProcessing){$this.unbind("sortBegin sortEnd").bind("sortBegin sortEnd",function(e){ts.isProcessing($this[0],e.type==="sortBegin");
});
}this.hasInitialized=true;
if(c.debug){ts.benchmark("Overall initialization time",$.data(this,"startoveralltimer"));
}$this.trigger("tablesorter-initialized",this);
if(typeof c.initialized==="function"){c.initialized(this);
}});
};
ts.isProcessing=function(table,toggle,$ths){var c=table.config,$h=$ths||$(table).find("."+c.cssHeader);
if(toggle){if(c.sortList.length>0){$h=$h.filter(function(){return this.sortDisabled?false:ts.isValueInArray(parseFloat($(this).attr("data-column")),c.sortList);
});
}$h.addClass(c.cssProcessing);
}else{$h.removeClass(c.cssProcessing);
}};
ts.processTbody=function(table,$tb,getIt){var t,holdr;
if(getIt){$tb.before('<span class="tablesorter-savemyplace"/>');
holdr=($.fn.detach)?$tb.detach():$tb.remove();
return holdr;
}holdr=$(table).find("span.tablesorter-savemyplace");
$tb.insertAfter(holdr);
holdr.remove();
};
ts.clearTableBody=function(table){$(table.tBodies).filter(":not(."+table.config.cssInfoBlock+")").empty();
};
ts.destroy=function(table,removeClasses,callback){var $t=$(table),c=table.config,$h=$t.find("thead:first");
table.hasInitialized=false;
$h.find("tr:not(."+c.cssHeaderRow+")").remove();
$h.find(".tablesorter-resizer").remove();
ts.refreshWidgets(table,true,true);
$t.removeData("tablesorter").unbind("sortReset update updateCell addRows sorton appendCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave").find("."+c.cssHeader).unbind("click mousedown mousemove mouseup").removeClass(c.cssHeader+" "+c.cssAsc+" "+c.cssDesc).find(".tablesorter-header-inner").each(function(){if(c.cssIcon!==""){$(this).find("."+c.cssIcon).remove();
}$(this).replaceWith($(this).contents());
});
if(removeClasses!==false){$t.removeClass(c.tableClass);
}if(typeof callback==="function"){callback(table);
}};
ts.regex=[/(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,/^0x[0-9a-f]+$/i];
ts.sortText=function(table,a,b,col){if(a===b){return 0;
}var c=table.config,e=c.string[(c.empties[col]||c.emptyTo)],r=ts.regex,xN,xD,yN,yD,xF,yF,i,mx;
if(a===""&&e!==0){return(typeof(e)==="boolean")?(e?-1:1):-e||-1;
}if(b===""&&e!==0){return(typeof(e)==="boolean")?(e?1:-1):e||1;
}if(typeof c.textSorter==="function"){return c.textSorter(a,b,table,col);
}xN=a.replace(r[0],"\\0$1\\0").replace(/\\0$/,"").replace(/^\\0/,"").split("\\0");
yN=b.replace(r[0],"\\0$1\\0").replace(/\\0$/,"").replace(/^\\0/,"").split("\\0");
xD=parseInt(a.match(r[2]),16)||(xN.length!==1&&a.match(r[1])&&Date.parse(a));
yD=parseInt(b.match(r[2]),16)||(xD&&b.match(r[1])&&Date.parse(b))||null;
if(yD){if(xD<yD){return -1;
}if(xD>yD){return 1;
}}mx=Math.max(xN.length,yN.length);
for(i=0;
i<mx;
i++){xF=isNaN(xN[i])?xN[i]||0:parseFloat(xN[i])||0;
yF=isNaN(yN[i])?yN[i]||0:parseFloat(yN[i])||0;
if(isNaN(xF)!==isNaN(yF)){return(isNaN(xF))?1:-1;
}if(typeof xF!==typeof yF){xF+="";
yF+="";
}if(xF<yF){return -1;
}if(xF>yF){return 1;
}}return 0;
};
ts.sortTextDesc=function(table,a,b,col){if(a===b){return 0;
}var c=table.config,e=c.string[(c.empties[col]||c.emptyTo)];
if(a===""&&e!==0){return(typeof(e)==="boolean")?(e?-1:1):e||1;
}if(b===""&&e!==0){return(typeof(e)==="boolean")?(e?1:-1):-e||-1;
}if(typeof c.textSorter==="function"){return c.textSorter(b,a,table,col);
}return ts.sortText(table,b,a);
};
ts.getTextValue=function(a,mx,d){if(mx){var i,l=a.length,n=mx+d;
for(i=0;
i<l;
i++){n+=a.charCodeAt(i);
}return d*n;
}return 0;
};
ts.sortNumeric=function(table,a,b,col,mx,d){if(a===b){return 0;
}var c=table.config,e=c.string[(c.empties[col]||c.emptyTo)];
if(a===""&&e!==0){return(typeof(e)==="boolean")?(e?-1:1):-e||-1;
}if(b===""&&e!==0){return(typeof(e)==="boolean")?(e?1:-1):e||1;
}if(isNaN(a)){a=ts.getTextValue(a,mx,d);
}if(isNaN(b)){b=ts.getTextValue(b,mx,d);
}return a-b;
};
ts.sortNumericDesc=function(table,a,b,col,mx,d){if(a===b){return 0;
}var c=table.config,e=c.string[(c.empties[col]||c.emptyTo)];
if(a===""&&e!==0){return(typeof(e)==="boolean")?(e?-1:1):e||1;
}if(b===""&&e!==0){return(typeof(e)==="boolean")?(e?1:-1):-e||-1;
}if(isNaN(a)){a=ts.getTextValue(a,mx,d);
}if(isNaN(b)){b=ts.getTextValue(b,mx,d);
}return b-a;
};
ts.characterEquivalents={a:"\u00e1\u00e0\u00e2\u00e3\u00e4\u0105\u00e5",A:"\u00c1\u00c0\u00c2\u00c3\u00c4\u0104\u00c5",c:"\u00e7\u0107\u010d",C:"\u00c7\u0106\u010c",e:"\u00e9\u00e8\u00ea\u00eb\u011b\u0119",E:"\u00c9\u00c8\u00ca\u00cb\u011a\u0118",i:"\u00ed\u00ec\u0130\u00ee\u00ef\u0131",I:"\u00cd\u00cc\u0130\u00ce\u00cf",o:"\u00f3\u00f2\u00f4\u00f5\u00f6",O:"\u00d3\u00d2\u00d4\u00d5\u00d6",ss:"\u00df",SS:"\u1e9e",u:"\u00fa\u00f9\u00fb\u00fc\u016f",U:"\u00da\u00d9\u00db\u00dc\u016e"};
ts.replaceAccents=function(s){var a,acc="[",eq=ts.characterEquivalents;
if(!ts.characterRegex){ts.characterRegexArray={};
for(a in eq){if(typeof a==="string"){acc+=eq[a];
ts.characterRegexArray[a]=new RegExp("["+eq[a]+"]","g");
}}ts.characterRegex=new RegExp(acc+"]");
}if(ts.characterRegex.test(s)){for(a in eq){if(typeof a==="string"){s=s.replace(ts.characterRegexArray[a],a);
}}}return s;
};
ts.isValueInArray=function(v,a){var i,l=a.length;
for(i=0;
i<l;
i++){if(a[i][0]===v){return true;
}}return false;
};
ts.addParser=function(parser){var i,l=ts.parsers.length,a=true;
for(i=0;
i<l;
i++){if(ts.parsers[i].id.toLowerCase()===parser.id.toLowerCase()){a=false;
}}if(a){ts.parsers.push(parser);
}};
ts.getParserById=function(name){var i,l=ts.parsers.length;
for(i=0;
i<l;
i++){if(ts.parsers[i].id.toLowerCase()===(name.toString()).toLowerCase()){return ts.parsers[i];
}}return false;
};
ts.addWidget=function(widget){ts.widgets.push(widget);
};
ts.getWidgetById=function(name){var i,w,l=ts.widgets.length;
for(i=0;
i<l;
i++){w=ts.widgets[i];
if(w&&w.hasOwnProperty("id")&&w.id.toLowerCase()===name.toLowerCase()){return w;
}}};
ts.applyWidget=function(table,init){var c=table.config,wo=c.widgetOptions,ws=c.widgets.sort().reverse(),time,i,w,l=ws.length;
i=$.inArray("zebra",c.widgets);
if(i>=0){c.widgets.splice(i,1);
c.widgets.push("zebra");
}if(c.debug){time=new Date();
}for(i=0;
i<l;
i++){w=ts.getWidgetById(ws[i]);
if(w){if(init===true&&w.hasOwnProperty("init")){w.init(table,w,c,wo);
}else{if(!init&&w.hasOwnProperty("format")){w.format(table,c,wo);
}}}}if(c.debug){benchmark("Completed "+(init===true?"initializing":"applying")+" widgets",time);
}};
ts.refreshWidgets=function(table,doAll,dontapply){var i,c=table.config,cw=c.widgets,w=ts.widgets,l=w.length;
for(i=0;
i<l;
i++){if(w[i]&&w[i].id&&(doAll||$.inArray(w[i].id,cw)<0)){if(c.debug){log("Refeshing widgets: Removing "+w[i].id);
}if(w[i].hasOwnProperty("remove")){w[i].remove(table,c,c.widgetOptions);
}}}if(dontapply!==true){ts.applyWidget(table,doAll);
}};
ts.getData=function(h,ch,key){var val="",$h=$(h),m,cl;
if(!$h.length){return"";
}m=$.metadata?$h.metadata():false;
cl=" "+($h.attr("class")||"");
if(typeof $h.data(key)!=="undefined"||typeof $h.data(key.toLowerCase())!=="undefined"){val+=$h.data(key)||$h.data(key.toLowerCase());
}else{if(m&&typeof m[key]!=="undefined"){val+=m[key];
}else{if(ch&&typeof ch[key]!=="undefined"){val+=ch[key];
}else{if(cl!==" "&&cl.match(" "+key+"-")){val=cl.match(new RegExp(" "+key+"-(\\w+)"))[1]||"";
}}}}return $.trim(val);
};
ts.formatFloat=function(s,table){if(typeof(s)!=="string"||s===""){return s;
}var i,t=table&&table.config?table.config.usNumberFormat!==false:typeof table!=="undefined"?table:true;
if(t){s=s.replace(/,/g,"");
}else{s=s.replace(/[\s|\.]/g,"").replace(/,/g,".");
}if(/^\s*\([.\d]+\)/.test(s)){s=s.replace(/^\s*\(/,"-").replace(/\)/,"");
}i=parseFloat(s);
return isNaN(i)?$.trim(s):i;
};
ts.isDigit=function(s){return isNaN(s)?(/^[\-+(]?\d+[)]?$/).test(s.toString().replace(/[,.'"\s]/g,"")):true;
};
}()});
var ts=$.tablesorter;
$.fn.extend({tablesorter:ts.construct});
ts.addParser({id:"text",is:function(s,table,node){return true;
},format:function(s,table,cell,cellIndex){var c=table.config;
s=$.trim(c.ignoreCase?s.toLocaleLowerCase():s);
return c.sortLocaleCompare?ts.replaceAccents(s):s;
},type:"text"});
ts.addParser({id:"currency",is:function(s){return(/^\(?\d+[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]|[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]\d+\)?$/).test(s);
},format:function(s,table){return ts.formatFloat(s.replace(/[^\w,. \-()]/g,""),table);
},type:"numeric"});
ts.addParser({id:"ipAddress",is:function(s){return(/^\d{1,3}[\.]\d{1,3}[\.]\d{1,3}[\.]\d{1,3}$/).test(s);
},format:function(s,table){var i,a=s.split("."),r="",l=a.length;
for(i=0;
i<l;
i++){r+=("00"+a[i]).slice(-3);
}return ts.formatFloat(r,table);
},type:"numeric"});
ts.addParser({id:"url",is:function(s){return(/^(https?|ftp|file):\/\//).test(s);
},format:function(s){return $.trim(s.replace(/(https?|ftp|file):\/\//,""));
},type:"text"});
ts.addParser({id:"isoDate",is:function(s){return(/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/).test(s);
},format:function(s,table){return ts.formatFloat((s!=="")?(new Date(s.replace(/-/g,"/")).getTime()||""):"",table);
},type:"numeric"});
ts.addParser({id:"percent",is:function(s){return(/(\d\s?%|%\s?\d)/).test(s);
},format:function(s,table){return ts.formatFloat(s.replace(/%/g,""),table);
},type:"numeric"});
ts.addParser({id:"usLongDate",is:function(s){return(/^[A-Z]{3,10}\.?\s+\d{1,2},?\s+(\d{4})(\s+\d{1,2}:\d{2}(:\d{2})?(\s+[AP]M)?)?$/i).test(s);
},format:function(s,table){return ts.formatFloat((new Date(s.replace(/(\S)([AP]M)$/i,"$1 $2")).getTime()||""),table);
},type:"numeric"});
ts.addParser({id:"shortDate",is:function(s){return(/^(\d{1,2}|\d{4})[\/\-\,\.\s+]\d{1,2}[\/\-\.\,\s+](\d{1,2}|\d{4})$/).test(s);
},format:function(s,table,cell,cellIndex){var c=table.config,ci=c.headerList[cellIndex],format=ci.shortDateFormat;
if(typeof format==="undefined"){format=ci.shortDateFormat=ts.getData(ci,c.headers[cellIndex],"dateFormat")||c.dateFormat;
}s=s.replace(/\s+/g," ").replace(/[\-|\.|\,]/g,"/");
if(format==="mmddyyyy"){s=s.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/,"$3/$1/$2");
}else{if(format==="ddmmyyyy"){s=s.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/,"$3/$2/$1");
}else{if(format==="yyyymmdd"){s=s.replace(/(\d{4})[\/\s](\d{1,2})[\/\s](\d{1,2})/,"$1/$2/$3");
}}}return ts.formatFloat((new Date(s).getTime()||""),table);
},type:"numeric"});
ts.addParser({id:"time",is:function(s){return(/^(([0-2]?\d:[0-5]\d)|([0-1]?\d:[0-5]\d\s?([AP]M)))$/i).test(s);
},format:function(s,table){return ts.formatFloat((new Date("2000/01/01 "+s.replace(/(\S)([AP]M)$/i,"$1 $2")).getTime()||""),table);
},type:"numeric"});
ts.addParser({id:"digit",is:function(s){return ts.isDigit(s);
},format:function(s,table){return ts.formatFloat(s.replace(/[^\w,. \-()]/g,""),table);
},type:"numeric"});
ts.addParser({id:"metadata",is:function(s){return false;
},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?"sortValue":c.parserMetadataName;
return $(cell).metadata()[p];
},type:"numeric"});
ts.addWidget({id:"zebra",format:function(table,c,wo){var $tb,$tv,$tr,row,even,time,k,l,child=new RegExp(c.cssChildRow,"i"),b=$(table).children("tbody:not(."+c.cssInfoBlock+")");
if(c.debug){time=new Date();
}for(k=0;
k<b.length;
k++){$tb=$(b[k]);
l=$tb.children("tr").length;
if(l>1){row=0;
$tv=$tb.children("tr:visible");
$tv.each(function(){$tr=$(this);
if(!child.test(this.className)){row++;
}even=(row%2===0);
$tr.removeClass(wo.zebra[even?1:0]).addClass(wo.zebra[even?0:1]);
});
}}if(c.debug){ts.benchmark("Applying Zebra widget",time);
}},remove:function(table,c,wo){var k,$tb,b=$(table).children("tbody:not(."+c.cssInfoBlock+")"),rmv=(c.widgetOptions.zebra||["even","odd"]).join(" ");
for(k=0;
k<b.length;
k++){$tb=$.tablesorter.processTbody(table,$(b[k]),true);
$tb.children().removeClass(rmv);
$.tablesorter.processTbody(table,$tb,false);
}}});
})(jQuery);
/* tableSorter 2.4+ widgets - updated 12/26/2012
 *
 * Column Styles
 * Column Filters
 * Column Resizing
 * Sticky Header
 * UI Theme (generalized)
 * Save Sort
 * ["zebra", "uitheme", "stickyHeaders", "filter", "columns"]
 */
(function($){$.tablesorter=$.tablesorter||{};
$.tablesorter.themes={bootstrap:{table:"table table-bordered table-striped",header:"bootstrap-header",footerRow:"",footerCells:"",icons:"",sortNone:"bootstrap-icon-unsorted",sortAsc:"icon-chevron-up",sortDesc:"icon-chevron-down",active:"",hover:"",filterRow:"",even:"",odd:""},jui:{table:"ui-widget ui-widget-content ui-corner-all",header:"ui-widget-header ui-corner-all ui-state-default",footerRow:"",footerCells:"",icons:"ui-icon",sortNone:"ui-icon-carat-2-n-s",sortAsc:"ui-icon-carat-1-n",sortDesc:"ui-icon-carat-1-s",active:"ui-state-active",hover:"ui-state-hover",filterRow:"",even:"ui-widget-content",odd:"ui-state-default"}};
$.tablesorter.storage=function(table,key,val){var d,k,ls=false,v={},id=table.id||$(".tablesorter").index($(table)),url=window.location.pathname;
try{ls=!!(localStorage.getItem);
}catch(e){}if($.parseJSON){if(ls){v=$.parseJSON(localStorage[key])||{};
}else{k=document.cookie.split(/[;\s|=]/);
d=$.inArray(key,k)+1;
v=(d!==0)?$.parseJSON(k[d])||{}:{};
}}if(val&&JSON&&JSON.hasOwnProperty("stringify")){if(!v[url]){v[url]={};
}v[url][id]=val;
if(ls){localStorage[key]=JSON.stringify(v);
}else{d=new Date();
d.setTime(d.getTime()+(31536000000));
document.cookie=key+"="+(JSON.stringify(v)).replace(/\"/g,'"')+"; expires="+d.toGMTString()+"; path=/";
}}else{return(v&&v.hasOwnProperty(url)&&v[url].hasOwnProperty(id))?v[url][id]:{};
}};
$.tablesorter.addWidget({id:"uitheme",format:function(table){var time,klass,$el,$tar,t=$.tablesorter.themes,$t=$(table),c=table.config,wo=c.widgetOptions,theme=c.theme!=="default"?c.theme:wo.uitheme||"jui",o=t[t[theme]?theme:t[wo.uitheme]?wo.uitheme:"jui"],$h=$(c.headerList),sh="tr."+(wo.stickyHeaders||"tablesorter-stickyHeader"),rmv=o.sortNone+" "+o.sortDesc+" "+o.sortAsc;
if(c.debug){time=new Date();
}if(!$t.hasClass("tablesorter-"+theme)||c.theme===theme||!table.hasInitialized){if(o.even!==""){wo.zebra[0]+=" "+o.even;
}if(o.odd!==""){wo.zebra[1]+=" "+o.odd;
}t=$t.removeClass(c.theme===""?"":"tablesorter-"+c.theme).addClass("tablesorter-"+theme+" "+o.table).find("tfoot");
if(t.length){t.find("tr").addClass(o.footerRow).children("th, td").addClass(o.footerCells);
}$h.addClass(o.header).filter(":not(.sorter-false)").hover(function(){$(this).addClass(o.hover);
},function(){$(this).removeClass(o.hover);
});
if(!$h.find(".tablesorter-wrapper").length){$h.wrapInner('<div class="tablesorter-wrapper" style="position:relative;height:100%;width:100%"></div>');
}if(c.cssIcon){$h.find("."+c.cssIcon).addClass(o.icons);
}if($t.hasClass("hasFilters")){$h.find(".tablesorter-filter-row").addClass(o.filterRow);
}}$.each($h,function(i){$el=$(this);
$tar=(c.cssIcon)?$el.find("."+c.cssIcon):$el;
if(this.sortDisabled){$el.removeClass(rmv);
$tar.removeClass(rmv+" tablesorter-icon "+o.icons);
}else{t=($t.hasClass("hasStickyHeaders"))?$t.find(sh).find("th").eq(i).add($el):$el;
klass=($el.hasClass(c.cssAsc))?o.sortAsc:($el.hasClass(c.cssDesc))?o.sortDesc:$el.hasClass(c.cssHeader)?o.sortNone:"";
$el[klass===o.sortNone?"removeClass":"addClass"](o.active);
$tar.removeClass(rmv).addClass(klass);
}});
if(c.debug){$.tablesorter.benchmark("Applying "+theme+" theme",time);
}},remove:function(table,c,wo){var $t=$(table),theme=typeof wo.uitheme==="object"?"jui":wo.uitheme||"jui",o=typeof wo.uitheme==="object"?wo.uitheme:$.tablesorter.themes[$.tablesorter.themes.hasOwnProperty(theme)?theme:"jui"],$h=$t.children("thead").children(),rmv=o.sortNone+" "+o.sortDesc+" "+o.sortAsc;
$t.removeClass("tablesorter-"+theme+" "+o.table).find(c.cssHeader).removeClass(o.header);
$h.unbind("mouseenter mouseleave").removeClass(o.hover+" "+rmv+" "+o.active).find(".tablesorter-filter-row").removeClass(o.filterRow);
$h.find(".tablesorter-icon").removeClass(o.icons);
}});
$.tablesorter.addWidget({id:"columns",format:function(table){var $tb,$tr,$td,$t,time,last,rmv,i,k,l,$tbl=$(table),c=table.config,wo=c.widgetOptions,b=$tbl.children("tbody:not(."+c.cssInfoBlock+")"),list=c.sortList,len=list.length,css=["primary","secondary","tertiary"];
css=(c.widgetColumns&&c.widgetColumns.hasOwnProperty("css"))?c.widgetColumns.css||css:(wo&&wo.hasOwnProperty("columns"))?wo.columns||css:css;
last=css.length-1;
rmv=css.join(" ");
if(c.debug){time=new Date();
}for(k=0;
k<b.length;
k++){$tb=$.tablesorter.processTbody(table,$(b[k]),true);
$tr=$tb.children("tr");
l=$tr.length;
$tr.each(function(){$t=$(this);
if(this.style.display!=="none"){$td=$t.children().removeClass(rmv);
if(list&&list[0]){$td.eq(list[0][0]).addClass(css[0]);
if(len>1){for(i=1;
i<len;
i++){$td.eq(list[i][0]).addClass(css[i]||css[last]);
}}}}});
$.tablesorter.processTbody(table,$tb,false);
}$tr=wo.columns_thead!==false?"thead tr":"";
if(wo.columns_tfoot!==false){$tr+=($tr===""?"":",")+"tfoot tr";
}if($tr.length){$t=$tbl.find($tr).children().removeClass(rmv);
if(list&&list[0]){$t.filter('[data-column="'+list[0][0]+'"]').addClass(css[0]);
if(len>1){for(i=1;
i<len;
i++){$t.filter('[data-column="'+list[i][0]+'"]').addClass(css[i]||css[last]);
}}}}if(c.debug){$.tablesorter.benchmark("Applying Columns widget",time);
}},remove:function(table,c,wo){var k,$tb,b=$(table).children("tbody:not(."+c.cssInfoBlock+")"),rmv=(c.widgetOptions.columns||["primary","secondary","tertiary"]).join(" ");
for(k=0;
k<b.length;
k++){$tb=$.tablesorter.processTbody(table,$(b[k]),true);
$tb.children("tr").each(function(){$(this).children().removeClass(rmv);
});
$.tablesorter.processTbody(table,$tb,false);
}}});
$.tablesorter.addWidget({id:"filter",format:function(table){if(table.config.parsers&&!$(table).hasClass("hasFilters")){var i,j,k,l,val,ff,x,xi,st,sel,str,ft,ft2,$th,rg,s,t,dis,col,last="",ts=$.tablesorter,c=table.config,$ths=$(c.headerList),wo=c.widgetOptions,css=wo.filter_cssFilter||"tablesorter-filter",$t=$(table).addClass("hasFilters"),b=$t.children("tbody:not(."+c.cssInfoBlock+")"),cols=c.parsers.length,reg=[/^\/((?:\\\/|[^\/])+)\/([mig]{0,3})?$/,new RegExp(c.cssChildRow),/undefined|number/,/(^[\"|\'|=])|([\"|\'|=]$)/,/[\"\'=]/g,/[^\w,. \-()]/g,/[<>=]/g],parsed=$ths.map(function(i){return(ts.getData)?ts.getData($ths.filter('[data-column="'+i+'"]:last'),c.headers[i],"filter")==="parsed":$(this).hasClass("filter-parsed");
}).get(),time,timer,checkFilters=function(filter){var arry=$.isArray(filter),$inpts=$t.find("thead").eq(0).children("tr").find("select."+css+", input."+css),v=(arry)?filter:$inpts.map(function(){return $(this).val()||"";
}).get(),cv=(v||[]).join("");
if(arry){$inpts.each(function(i,el){$(el).val(filter[i]||"");
});
}if(wo.filter_hideFilters===true){$t.find(".tablesorter-filter-row").trigger(cv===""?"mouseleave":"mouseenter");
}if(last===cv&&filter!==false){return;
}$t.trigger("filterStart",[v]);
if(c.showProcessing){setTimeout(function(){findRows(filter,v,cv);
return false;
},30);
}else{findRows(filter,v,cv);
return false;
}},findRows=function(filter,v,cv){var $tb,$tr,$td,cr,r,l,ff,time,arry;
if(c.debug){time=new Date();
}for(k=0;
k<b.length;
k++){$tb=$.tablesorter.processTbody(table,$(b[k]),true);
$tr=$tb.children("tr");
l=$tr.length;
if(cv===""||wo.filter_serversideFiltering){$tr.show().removeClass("filtered");
}else{for(j=0;
j<l;
j++){if(reg[1].test($tr[j].className)){continue;
}r=true;
cr=$tr.eq(j).nextUntil("tr:not(."+c.cssChildRow+")");
t=(cr.length&&(wo&&wo.hasOwnProperty("filter_childRows")&&typeof wo.filter_childRows!=="undefined"?wo.filter_childRows:true))?cr.text():"";
t=wo.filter_ignoreCase?t.toLocaleLowerCase():t;
$td=$tr.eq(j).children("td");
for(i=0;
i<cols;
i++){if(v[i]){if(wo.filter_useParsedData||parsed[i]){x=c.cache[k].normalized[j][i];
}else{x=$.trim($td.eq(i).text());
}xi=!reg[2].test(typeof x)&&wo.filter_ignoreCase?x.toLocaleLowerCase():x;
ff=r;
val=wo.filter_ignoreCase?v[i].toLocaleLowerCase():v[i];
if(wo.filter_functions&&wo.filter_functions[i]){if(wo.filter_functions[i]===true){ff=($ths.filter('[data-column="'+i+'"]:last').hasClass("filter-match"))?xi.search(val)>=0:v[i]===x;
}else{if(typeof wo.filter_functions[i]==="function"){ff=wo.filter_functions[i](x,c.cache[k].normalized[j][i],v[i],i);
}else{if(typeof wo.filter_functions[i][v[i]]==="function"){ff=wo.filter_functions[i][v[i]](x,c.cache[k].normalized[j][i],v[i],i);
}}}}else{if(reg[0].test(val)){rg=reg[0].exec(val);
try{ff=new RegExp(rg[1],rg[2]).test(xi);
}catch(err){ff=false;
}}else{if(reg[3].test(val)&&xi===val.replace(reg[4],"")){ff=true;
}else{if(/^\!/.test(val)){val=val.replace("!","");
s=xi.search($.trim(val));
ff=val===""?true:!(wo.filter_startsWith?s===0:s>=0);
}else{if(/^[<>]=?/.test(val)){rg=isNaN(xi)?$.tablesorter.formatFloat(xi.replace(reg[5],""),table):$.tablesorter.formatFloat(xi,table);
s=$.tablesorter.formatFloat(val.replace(reg[5],"").replace(reg[6],""),table);
if(/>/.test(val)){ff=/>=/.test(val)?rg>=s:rg>s;
}if(/</.test(val)){ff=/<=/.test(val)?rg<=s:rg<s;
}}else{if(/[\?|\*]/.test(val)){ff=new RegExp(val.replace(/\?/g,"\\S{1}").replace(/\*/g,"\\S*")).test(xi);
}else{x=(xi+t).indexOf(val);
ff=((!wo.filter_startsWith&&x>=0)||(wo.filter_startsWith&&x===0));
}}}}}}r=(ff)?(r?true:false):false;
}}$tr[j].style.display=(r?"":"none");
$tr.eq(j)[r?"removeClass":"addClass"]("filtered");
if(cr.length){cr[r?"show":"hide"]();
}}}$.tablesorter.processTbody(table,$tb,false);
}last=cv;
if(c.debug){ts.benchmark("Completed filter widget search",time);
}$t.trigger("applyWidgets");
$t.trigger("filterEnd");
},buildSelect=function(i,updating){var o,arry=[];
i=parseInt(i,10);
o='<option value="">'+($ths.filter('[data-column="'+i+'"]:last').attr("data-placeholder")||"")+"</option>";
for(k=0;
k<b.length;
k++){l=c.cache[k].row.length;
for(j=0;
j<l;
j++){if(wo.filter_useParsedData){arry.push(""+c.cache[k].normalized[j][i]);
}else{t=c.cache[k].row[j][0].cells[i];
if(t){arry.push($.trim(c.supportsTextContent?t.textContent:$(t).text()));
}}}}arry=$.grep(arry,function(v,k){return $.inArray(v,arry)===k;
});
arry=(ts.sortText)?arry.sort(function(a,b){return ts.sortText(table,a,b,i);
}):arry.sort(true);
for(k=0;
k<arry.length;
k++){o+='<option value="'+arry[k]+'">'+arry[k]+"</option>";
}$t.find("thead").find("select."+css+'[data-column="'+i+'"]')[updating?"html":"append"](o);
},buildDefault=function(updating){for(i=0;
i<cols;
i++){t=$ths.filter('[data-column="'+i+'"]:last');
if(t.hasClass("filter-select")&&!t.hasClass("filter-false")&&!(wo.filter_functions&&wo.filter_functions[i]===true)){if(!wo.filter_functions){wo.filter_functions={};
}wo.filter_functions[i]=true;
buildSelect(i,updating);
}}};
if(c.debug){time=new Date();
}wo.filter_ignoreCase=wo.filter_ignoreCase!==false;
wo.filter_useParsedData=wo.filter_useParsedData===true;
if(wo.filter_columnFilters!==false&&$ths.filter(".filter-false").length!==$ths.length){t='<tr class="tablesorter-filter-row">';
for(i=0;
i<cols;
i++){dis=false;
$th=$ths.filter('[data-column="'+i+'"]:last');
sel=(wo.filter_functions&&wo.filter_functions[i]&&typeof wo.filter_functions[i]!=="function")||$th.hasClass("filter-select");
t+="<td>";
if(sel){t+='<select data-column="'+i+'" class="'+css;
}else{t+='<input type="search" placeholder="'+($th.attr("data-placeholder")||"")+'" data-column="'+i+'" class="'+css;
}if(ts.getData){dis=ts.getData($th[0],c.headers[i],"filter")==="false";
t+=dis?' disabled" disabled':'"';
}else{dis=(c.headers[i]&&c.headers[i].hasOwnProperty("filter")&&c.headers[i].filter===false)||$th.hasClass("filter-false");
t+=(dis)?' disabled" disabled':'"';
}t+=(sel?"></select>":">")+"</td>";
}$t.find("thead").eq(0).append(t+="</tr>");
}$t.bind("addRows updateCell update appendCache search".split(" ").join(".tsfilter "),function(e,filter){if(e.type!=="search"){buildDefault(true);
}checkFilters(e.type==="search"?filter:"");
return false;
}).find("input."+css).bind("keyup search",function(e,filter){if((e.which<32&&e.which!==8)||(e.which>=37&&e.which<=40)){return;
}if(typeof filter!=="undefined"){checkFilters(filter);
return false;
}clearTimeout(timer);
timer=setTimeout(function(){checkFilters();
},wo.filter_searchDelay||300);
});
if(wo.filter_reset&&$(wo.filter_reset).length){$(wo.filter_reset).bind("click",function(){$t.find("."+css).val("");
checkFilters();
return false;
});
}if(wo.filter_functions){for(col in wo.filter_functions){if(wo.filter_functions.hasOwnProperty(col)&&typeof col==="string"){t=$ths.filter('[data-column="'+col+'"]:last');
ff="";
if(wo.filter_functions[col]===true&&!t.hasClass("filter-false")){buildSelect(col);
}else{if(typeof col==="string"&&!t.hasClass("filter-false")){for(str in wo.filter_functions[col]){if(typeof str==="string"){ff+=ff===""?'<option value="">'+(t.attr("data-placeholder")||"")+"</option>":"";
ff+='<option value="'+str+'">'+str+"</option>";
}}$t.find("thead").find("select."+css+'[data-column="'+col+'"]').append(ff);
}}}}}buildDefault();
$t.find("select."+css).bind("change search",function(){checkFilters();
});
if(wo.filter_hideFilters===true){$t.find(".tablesorter-filter-row").addClass("hideme").bind("mouseenter mouseleave",function(e){var all,evt=e;
ft=$(this);
clearTimeout(st);
st=setTimeout(function(){if(/enter|over/.test(evt.type)){ft.removeClass("hideme");
}else{if($(document.activeElement).closest("tr")[0]!==ft[0]){all=$t.find("."+(wo.filter_cssFilter||"tablesorter-filter")).map(function(){return $(this).val()||"";
}).get().join("");
if(all===""){ft.addClass("hideme");
}}}},200);
}).find("input, select").bind("focus blur",function(e){ft2=$(this).closest("tr");
clearTimeout(st);
st=setTimeout(function(){if($t.find("."+(wo.filter_cssFilter||"tablesorter-filter")).map(function(){return $(this).val()||"";
}).get().join("")===""){ft2[e.type==="focus"?"removeClass":"addClass"]("hideme");
}},200);
});
}if(c.showProcessing){$t.bind("filterStart filterEnd",function(e,v){var fc=(v)?$t.find("."+c.cssHeader).filter("[data-column]").filter(function(){return v[$(this).data("column")]!=="";
}):"";
ts.isProcessing($t[0],e.type==="filterStart",v?fc:"");
});
}if(c.debug){ts.benchmark("Applying Filter widget",time);
}$t.trigger("filterInit");
}},remove:function(table,c,wo){var k,$tb,$t=$(table),b=$t.children("tbody:not(."+c.cssInfoBlock+")");
$t.removeClass("hasFilters").unbind("addRows updateCell update appendCache search".split(" ").join(".tsfilter")).find(".tablesorter-filter-row").remove();
for(k=0;
k<b.length;
k++){$tb=$.tablesorter.processTbody(table,$(b[k]),true);
$tb.children().removeClass("filtered").show();
$.tablesorter.processTbody(table,$tb,false);
}if(wo.filterreset){$(wo.filter_reset).unbind("click");
}}});
$.tablesorter.addWidget({id:"stickyHeaders",format:function(table){if($(table).hasClass("hasStickyHeaders")){return;
}var $table=$(table).addClass("hasStickyHeaders"),c=table.config,wo=c.widgetOptions,win=$(window),header=$(table).children("thead:first"),hdrCells=header.children("tr:not(.sticky-false)").children(),css=wo.stickyHeaders||"tablesorter-stickyHeader",innr=".tablesorter-header-inner",firstRow=hdrCells.eq(0).parent(),tfoot=$table.find("tfoot"),t2=$table.clone(),stkyHdr=t2.children("thead:first").addClass(css).css({width:header.outerWidth(true),position:"fixed",margin:0,top:0,visibility:"hidden",zIndex:1}),stkyCells=stkyHdr.children("tr:not(.sticky-false)").children(),laststate="",spacing=0,resizeHdr=function(){var bwsr=navigator.userAgent;
spacing=0;
if($table.css("border-collapse")!=="collapse"&&!/(webkit|msie)/i.test(bwsr)){spacing=parseInt(hdrCells.eq(0).css("border-left-width"),10)*2;
}stkyHdr.css({left:header.offset().left-win.scrollLeft()-spacing,width:header.outerWidth()});
stkyCells.each(function(i){var $h=hdrCells.eq(i);
$(this).css({width:$h.width()-spacing,height:$h.height()});
}).find(innr).each(function(i){var hi=hdrCells.eq(i).find(innr),w=hi.width();
$(this).width(w);
});
};
t2.find("thead:gt(0),tr.sticky-false,tbody,tfoot,caption").remove();
t2.css({height:0,width:0,padding:0,margin:0,border:0});
stkyHdr.find("tr.sticky-false").remove();
stkyCells.find(".tablesorter-resizer").remove();
$table.bind("sortEnd.tsSticky",function(){hdrCells.each(function(i){var t=stkyCells.eq(i);
t.attr("class",$(this).attr("class"));
if(c.cssIcon){t.find("."+c.cssIcon).attr("class",$(this).find("."+c.cssIcon).attr("class"));
}});
}).bind("pagerComplete.tsSticky",function(){resizeHdr();
});
hdrCells.find("*").andSelf().filter(c.selectorSort).each(function(i){var t=$(this);
stkyCells.eq(i).bind("mouseup",function(e){t.trigger(e,true);
}).bind("mousedown",function(){this.onselectstart=function(){return false;
};
return false;
});
});
$table.after(t2);
win.bind("scroll.tsSticky",function(){var offset=firstRow.offset(),sTop=win.scrollTop(),tableHt=$table.height()-(stkyHdr.height()+(tfoot.height()||0)),vis=(sTop>offset.top)&&(sTop<offset.top+tableHt)?"visible":"hidden";
stkyHdr.css({left:header.offset().left-win.scrollLeft()-spacing,visibility:vis});
if(vis!==laststate){resizeHdr();
laststate=vis;
}}).bind("resize.tsSticky",function(){resizeHdr();
});
},remove:function(table,c,wo){var $t=$(table),css=wo.stickyHeaders||"tablesorter-stickyHeader";
$t.removeClass("hasStickyHeaders").unbind("sortEnd.tsSticky pagerComplete.tsSticky").find("."+css).remove();
$(window).unbind("scroll.tsSticky resize.tsSticky");
}});
$.tablesorter.addWidget({id:"resizable",format:function(table){if($(table).hasClass("hasResizable")){return;
}$(table).addClass("hasResizable");
var t,j,s,$c,$cols,$tbl=$(table),c=table.config,wo=c.widgetOptions,position=0,$target=null,$next=null,stopResize=function(){position=0;
$target=$next=null;
$(window).trigger("resize");
};
s=($.tablesorter.storage&&wo.resizable!==false)?$.tablesorter.storage(table,"tablesorter-resizable"):{};
if(s){for(j in s){if(!isNaN(j)&&j<c.headerList.length){$(c.headerList[j]).width(s[j]);
}}}$tbl.children("thead:first").find("tr").each(function(){$c=$(this).children();
if(!$(this).find(".tablesorter-wrapper").length){$c.wrapInner('<div class="tablesorter-wrapper" style="position:relative;height:100%;width:100%"></div>');
}$c=$c.slice(0,-1);
$cols=$cols?$cols.add($c):$c;
});
$cols.each(function(){t=$(this);
j=parseInt(t.css("padding-right"),10)+8;
t.find(".tablesorter-wrapper").append('<div class="tablesorter-resizer" style="cursor:w-resize;position:absolute;height:100%;width:16px;right:-'+j+'px;top:0;z-index:1;"></div>');
}).bind("mousemove.tsresize",function(e){if(position===0||!$target){return;
}var w=e.pageX-position;
$target.width($target.width()+w);
$next.width($next.width()-w);
position=e.pageX;
}).bind("mouseup.tsresize",function(){if($.tablesorter.storage&&$target){s[$target.index()]=$target.width();
s[$next.index()]=$next.width();
if(wo.resizable!==false){$.tablesorter.storage(table,"tablesorter-resizable",s);
}}stopResize();
}).find(".tablesorter-resizer").bind("mousedown",function(e){$target=$(e.target).parents("th:last");
$next=$target.next();
position=e.pageX;
});
$tbl.find("thead:first").bind("mouseup.tsresize mouseleave.tsresize",function(e){stopResize();
}).bind("contextmenu.tsresize",function(){$.tablesorter.resizableReset(table);
var rtn=$.isEmptyObject?$.isEmptyObject(s):s==={};
s={};
return rtn;
});
},remove:function(table,c,wo){$(table).removeClass("hasResizable").find("thead").unbind("mouseup.tsresize mouseleave.tsresize contextmenu.tsresize").find("tr").children().unbind("mousemove.tsresize mouseup.tsresize").find(".tablesorter-wrapper").each(function(){$(this).find(".tablesorter-resizer").remove();
$(this).replaceWith($(this).contents());
});
$.tablesorter.resizableReset(table);
}});
$.tablesorter.resizableReset=function(table){$(table.config.headerList).width("auto");
$.tablesorter.storage(table,"tablesorter-resizable",{});
};
$.tablesorter.addWidget({id:"saveSort",init:function(table,thisWidget){thisWidget.format(table,true);
},format:function(table,init){var sl,time,c=table.config,wo=c.widgetOptions,ss=wo.saveSort!==false,sortList={sortList:c.sortList};
if(c.debug){time=new Date();
}if($(table).hasClass("hasSaveSort")){if(ss&&table.hasInitialized&&$.tablesorter.storage){$.tablesorter.storage(table,"tablesorter-savesort",sortList);
if(c.debug){$.tablesorter.benchmark("saveSort widget: Saving last sort: "+c.sortList,time);
}}}else{$(table).addClass("hasSaveSort");
sortList="";
if($.tablesorter.storage){sl=$.tablesorter.storage(table,"tablesorter-savesort");
sortList=(sl&&sl.hasOwnProperty("sortList")&&$.isArray(sl.sortList))?sl.sortList:"";
if(c.debug){$.tablesorter.benchmark('saveSort: Last sort loaded: "'+sortList+'"',time);
}}if(init&&sortList&&sortList.length>0){c.sortList=sortList;
}else{if(table.hasInitialized&&sortList&&sortList.length>0){$(table).trigger("sorton",[sortList]);
}}}},remove:function(table,c,wo){$.tablesorter.storage(table,"tablesorter-savesort","");
}});
})(jQuery);
/**
 * @author AN015953
 */

/**
 * Family sorter is given a table body, and it will sort the patient rows of the
 * table, keeping the families (mother/baby together)
 */
var TableSorter = function() {
	function stripeRows(parentTable){
		var validRowCntr = 0;
		var rowCntr = 0;
		var curRows = parentTable.rows;
		var curRow;
		var rowCnt = curRows.length;
		var classtoRemove;
		var classtoAdd;
		var parentClass  = "PARENT-ROW";			
		for( rowCntr = 0; rowCntr < rowCnt; rowCntr++) {
			curRow = curRows[rowCntr];
			// calculate striping for every parent row
			if($(curRow).hasClass(parentClass)) {
				validRowCntr = validRowCntr + 1
				if(validRowCntr % 2 == 0) {
					classtoAdd= "odd";
					classtoRemove = "even";
				} else {
					classtoAdd = "even";
					classtoRemove = "odd";
				}								
			}			
			// update css for current row
			Util.Style.rcss(curRow, classtoRemove);
			Util.Style.acss(curRow, classtoAdd);
		}

	}
	return {

		/**
		 * Parent element used for sorting columns
		 */
		sortedTable : "",

		/**
		 * Sorts table of patients
		 * @param {Node} table of patients to sort.  The only tr tags must correspond to the patients
		 * @param {String} css of span that contains sort criteria.
		 * @param {Int} ascend_descend_ind. 0 = ascending sort, 1 = descending sort
		 */
		sortBy : function(table, css, ascend_descend_ind, parentClass) {

			var rowsToFind = $("tr", table);
			var groups = [];
			if(parentClass == null) {
				parentClass = "PARENT-ROW";
			}
			for(var i = 0, l = rowsToFind.length; i < l; i++) {
				if($(rowsToFind[i]).hasClass(parentClass)) {
					currentGroup = {
						sort_value : "",
						rows : []
					};
					groups.push(currentGroup);
					currentGroup.sort_value = this.getSortFromCSS(rowsToFind[i], css);
					if (!isNaN(parseFloat(currentGroup.sort_value)) && isFinite(currentGroup.sort_value)) { //if sort value is numeric convert to number
						currentGroup.sort_value = parseFloat(currentGroup.sort_value);
					}
				}
				currentGroup.rows.push({
					row : rowsToFind[i]
				});
			}
			rowsToFind.detach();
			groups = groups.sort(function(a, b) {
				//ascending
				if(ascend_descend_ind === 0) {
					return a.sort_value <= b.sort_value ? -1 : 1;
				}
				//descending
				else {
					return a.sort_value >= b.sort_value ? -1 : 1;
				}
			});
			for(var i = 0, l = groups.length; i < l; i++) {
				for(var j = 0, k = groups[i].rows.length; j < k; j++) {
					$(groups[i].rows[j].row).appendTo(table);
				}
			}
		},

		/**
		 * Get value used for sort from supplied classname
		 * @param {Node} Element container of sort element
		 * @param {String} css class of sort element
		 * @return {String} Value used for sort
		 */
		getSortFromCSS : function(element, css) {
			//c,e,t
			var sortTags = Util.Style.g(css, element, null);
			return sortTags.length > 0 ? sortTags[0].innerHTML : "";
		},

		/**
		 * Change Sort Icon
		 * @param {Node} element containing sort icon
		 * @param {String} direction to point sort icon, "up" or "down"
		 */
		changeSortIcon : function(element, direction) {
			if(direction.toLowerCase() === "down") {
				$(element).addClass("headerSortDown");
				$(element).removeClass("headerSortUp");
			}
			else {
				$(element).addClass("headerSortUp");
				$(element).removeClass("headerSortDown");
			}

		},

		/**
		 * Add Sort Event.  This includes adding the sort icon and handler
		 * @param {Node} element that will contain sort icon
		 * @param {String} sortType classname of element used to calculate sorts
		 */
		addSortEvent : function(element, sortType) {
			$(element).addClass("header");
			var that = this;
			$(element).bind('click', function() {
				that.sortColumn(element, sortType);
			});

		},

		/**
		 * Sort the specified column
		 * @param {Node} element used to determine sort.
		 * @param {String} sortType to be used for sort
		 */
		sortColumn : function(element, sortType) {
			table = this.sortedTable;
			this.resetSortIcons(element);
			var direction;
			if($(element).hasClass("headerSortUp")) {
				this.sortBy(table, sortType,1);
				this.changeSortIcon(element,"down");
			}
			else if($(element).hasClass("headerSortDown") || $(element).hasClass("header")) {
				this.sortBy(table, sortType,0);
				this.changeSortIcon(element,"up");
			}
			else {
				throw new Error("Element should have sort icon");
			}
			stripeRows($(table).get(0));
		},
		/**
		 * Reset columns with unsorted icon
		 * @param {Node} element that should not be reset
		 */
		resetSortIcons : function(element) {
			$('.headerSortDown').each(function(){
				if(this != element){
					$(this).removeClass('headerSortDown');
					$(this).addClass('header');
				}
			}
			)
			$('.headerSortUp').each(function(){
				if(this != element){
					$(this).removeClass('headerSortUp');
					$(this).addClass('header');
				}
			}
			)
		},
		/**
		 * Stripe the table rows
		 * @param {tableElement} element Table to Stripe rows of
		 */
		stripeRows: function(tableElement) {
			if(!tableElement){
				tableElement = this.sortedTable;
			}		
			stripeRows($(tableElement).get(0));
		}
	};
}();function _g(i){return document.getElementById(i);
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
var i18nUtility=(function(){var localeLanguage="EN",localeCountry="US",localeJS,JSPath="../i18n/";
function appendJSScript(){if(localeJS>" "){var headID="";
var cssNode="";
var newScript="";
var jsFilePath="";
var lastScriptTag=null;
headID=document.getElementsByTagName("head")[0];
lastScriptTag=$("script",$(headID)).last();
if(lastScriptTag.get()){jsFilePath=JSPath+localeJS;
newScript=document.createElement("script");
newScript.type="text/javascript";
newScript.src=jsFilePath;
$(newScript).insertAfter(lastScriptTag);
}}}function getLocaleJS(){var JSName="";
switch(localeLanguage){case"EN":switch(localeCountry){case"US":JSName="i18n.en_US.js";
break;
case"CA":case"CD":JSName="i18n.en_CA.js";
break;
case"AU":JSName="i18n.en_AU.js";
break;
case"GB":JSName="i18n.en_GB.js";
break;
case"UK":JSName="i18n.en_UK.js";
break;
case"IE":JSName="i18n.en_IE.js";
break;
default:JSName="i18n.en_US.js";
break;
}break;
case"DE":switch(localeCountry){case"AT":JSName="i18n.de_AT.js";
break;
default:JSName="i18n.de.js";
break;
}break;
case"FR":JSName="i18n.fr.js";
break;
case"FI":JSName="i18n.fi.js";
break;
case"SP":case"ES":switch(localeCountry){case"CL":JSName="i18n.es_CL.js";
break;
default:JSName="i18n.es.js";
break;
}break;
default:JSName="i18n.en_US.js";
break;
}return(JSName);
}function initialize(){var urlParams=window.location.search.replace(/%20/g," ").split("?").join("").split(","),lastParam=urlParams[urlParams.length-1],locale=lastParam.toUpperCase().split(".")[0];
if(parseInt(locale.length,10)>=2){localeLanguage=locale.substring(0,2);
}if(parseInt(locale.length,10)==5){localeCountry=locale.substring(3,5);
}localeJS=getLocaleJS();
appendJSScript();
}initialize();
return{setJSPath:function(jsFilePath){JSPath=jsFilePath;
},setLocale:function(locLang,locCountry){localeLanguage=locLang.toUpperCase();
localeCountry=locCountry.toUpperCase();
localeJS=getLocaleJS();
appendJSScript();
},getLocaleLanguage:function(){return(localeLanguage);
},getLocaleCountry:function(){return(localeCountry);
},getJSPath:function(){return(JSPath);
},getLocaleJS:function(){return(localeJS);
}};
}());
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
Function.prototype.method=function(name,func){this.prototype[name]=func;
return this;
};
Function.method("inherits",function(parent){var d={},p=(this.prototype=new parent());
this.method("uber",function uber(name){if(!(name in d)){d[name]=0;
}var f,r,t=d[name],v=parent.prototype;
if(t){while(t){v=v.constructor.prototype;
t-=1;
}f=v[name];
}else{f=p[name];
if(f===this[name]){f=v[name];
}}d[name]+=1;
r=f.apply(this,Array.prototype.slice.apply(arguments,[1]));
d[name]-=1;
return r;
});
return this;
});
function mpo(e){var posx=0,posy=0;
if(!e){e=window.event;
}if(e.pageX||e.pageY){posx=e.pageX;
posy=e.pageY;
}else{if(e.clientX||e.clientY){posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
}}return[posy,posx];
}var MpageLayout=function(){this.layoutRowNodes="";
this.layoutRowWidth="";
this.layoutColumnNodes="";
this.layoutColumnWidth="";
this.layoutDOM="";
this.layoutHeaderAlertDOM="";
this.layoutHeaderDOM="";
this.layoutFooterDOM="";
this.layoutBannerDOM="";
this.layoutButtonDOM="";
this.activeRowSequence="";
this.activeColumnDOM="";
this.activeColumnSequence="";
this.activeMpageComponent="";
this.placeHolderDOM="";
this.placeHolderParentDOM="";
this.customizeModeInd="";
};
MpageLayout.prototype.createColumnLayout=function(prefs){var columns=parseInt(prefs.columns),layoutTable,layoutTitle=prefs.layoutTitle,toggleComponentsTitle=prefs.toggleComponentsTitle,toggleComponentsHover=prefs.toggleComponentsHover,customizeLayoutTitle=prefs.customizeLayoutTitle,customizeLayoutHover=prefs.customizeLayoutHover,savecustomizeTitle=prefs.savecustomizeTitle,savecustomizeHover=prefs.savecustomizeHover,clearcustomizeTitle=prefs.clearcustomizeTitle,clearcustomizeHover=prefs.clearcustomizeHover,helpTitle=prefs.helpTitle,helpHover=prefs.helpHover,helpLink=prefs.helpLink;
this.layoutHeaderAlertDOM=Util.cep("div",{className:"alert"});
this.layoutFooterDOM=Util.cep("div",{className:"mpage-layout-footer"});
if(columns>0){this.layoutColumnWidth=(99.6/columns);
this.layoutColumnNodes=[];
this.layoutDOM=Util.cep("div",{className:"mpage-layout-container"});
layoutTable=Util.cep("table",{className:"mpage-layout-table",cellSpacing:5,colSpan:columns});
layoutTable.insertRow(-1);
var that=this,cur_el;
for(var i=0;
i<columns;
i++){cur_el=this.createColumnNode(layoutTable);
this.layoutColumnNodes.unshift(cur_el);
}Util.ac(layoutTable,this.layoutDOM);
this.placeHolderDOM="";
this.layoutBannerDOM=Util.ce("div");
this.layoutButtonDOM=Util.ce("div");
this.layoutHeaderDOM=Util.cep("div",{className:"ps-hd"});
this.layoutHeaderSpanExpand=Util.cep("a",{});
this.layoutHeaderSpanHelp=Util.cep("a",{});
this.layoutHeaderSpanCustomize=Util.cep("a",{});
this.layoutHeaderSpanSaveCustomize=Util.cep("a",{});
this.layoutHeaderSpanClearCustomize=Util.cep("a",{});
var that=this,layoutHeaderH1=Util.ce("h1"),layoutHeaderH1Span=Util.cep("span",{className:"pg-title"}),layoutHeaderSpan=Util.cep("span",{className:"page-ctrl"}),toggleComponentsMethod=function(){that.toggleComponentsDisplay(that,toggleComponentsTitle,toggleComponentsHover);
};
if(layoutTitle&&layoutTitle>""){layoutHeaderH1Span=Util.ac(layoutHeaderH1Span,layoutHeaderH1);
layoutHeaderH1=Util.ac(layoutHeaderH1,this.layoutHeaderDOM);
layoutHeaderH1Span.innerHTML=layoutTitle;
}if(toggleComponentsTitle&&toggleComponentsTitle>""){this.layoutHeaderSpanExpand=Util.ac(this.layoutHeaderSpanExpand,layoutHeaderSpan);
this.layoutHeaderSpanExpand.innerHTML=toggleComponentsTitle[0];
if(toggleComponentsHover&&toggleComponentsHover>""){this.layoutHeaderSpanExpand.title=toggleComponentsHover[0];
}Util.addEvent(that.layoutHeaderSpanExpand,"click",toggleComponentsMethod);
}if(customizeLayoutTitle&&customizeLayoutTitle>""){this.layoutHeaderSpanCustomize=Util.ac(this.layoutHeaderSpanCustomize,layoutHeaderSpan);
this.layoutHeaderSpanCustomize.innerHTML=customizeLayoutTitle;
if(customizeLayoutHover&&customizeLayoutHover>""){this.layoutHeaderSpanCustomize.title=customizeLayoutHover;
}Util.addEvent(that.layoutHeaderSpanCustomize,"click",function(){that.toggleCustomizeDisplay(that,1);
});
if(savecustomizeTitle&&savecustomizeTitle>""){this.layoutHeaderSpanSaveCustomize=Util.ac(this.layoutHeaderSpanSaveCustomize,layoutHeaderSpan);
this.layoutHeaderSpanSaveCustomize.innerHTML=savecustomizeTitle;
if(savecustomizeHover&&savecustomizeHover>""){this.layoutHeaderSpanSaveCustomize.title=savecustomizeHover;
}Util.addEvent(that.layoutHeaderSpanSaveCustomize,"click",function(){that.toggleCustomizeDisplay(that,0);
});
this.layoutHeaderSpanSaveCustomize.style.display="none";
}if(clearcustomizeTitle&&clearcustomizeTitle>""){this.layoutHeaderSpanClearCustomize=Util.ac(this.layoutHeaderSpanClearCustomize,layoutHeaderSpan);
this.layoutHeaderSpanClearCustomize.innerHTML=clearcustomizeTitle;
if(clearcustomizeHover&&clearcustomizeHover>""){this.layoutHeaderSpanClearCustomize.title=clearcustomizeHover;
}Util.addEvent(that.layoutHeaderSpanClearCustomize,"click",function(){that.toggleCustomizeDisplay(that,0);
});
this.layoutHeaderSpanClearCustomize.style.display="none";
}}if(helpTitle&&helpTitle>""){this.layoutHeaderSpanHelp=Util.ac(this.layoutHeaderSpanHelp,layoutHeaderSpan);
this.layoutHeaderSpanHelp.innerHTML=helpTitle;
if(helpHover&&helpHover>""){this.layoutHeaderSpanHelp.title=helpHover;
}if(helpLink&&helpLink>""){this.layoutHeaderSpanHelp.href=helpLink;
}}layoutHeaderSpan=Util.ac(layoutHeaderSpan,this.layoutHeaderDOM);
}};
MpageLayout.prototype.insertBanner=function(component){try{component.contentDOM=Util.ac(Util.cep("div",{className:"dmg-pt-banner"}),this.layoutBannerDOM);
}catch(e){alert(e.message+"insertBanner");
}};
MpageLayout.prototype.attachComponent=function(component,contentDOMParent,divClass){try{component.contentDOM=Util.ac(Util.cep("div",{className:divClass}),contentDOMParent);
}catch(e){alert(e.message+"attachComponent");
}};
MpageLayout.prototype.insertButton=function(component){try{component.contentDOM=Util.ac(Util.cep("div",{className:"dmg-pt-button"}),this.layoutButtonDOM);
}catch(e){alert(e.message+"insertButton");
}};
MpageLayout.prototype.insertComponent=function(component){try{var that=this,curColumn=this.layoutColumnNodes[component.columnSequence],componentTitleCornerDOM=component.getComponentTitleCornerDOM(),componentDOM=component.getComponentDOM(),componentRowSequence=component.getRowSequence(),componentcolumnSpan=component.getColumnSpan(),columnChildNodes=Util.gcs(curColumn),nextColumnNode,dragStartPosition=[0,0],componentStartPosition=[0,0],mouseOffsetPosition=[0,0],mouseMoveMethod=function(e){that.moveComponent(e,mouseOffsetPosition,that,component);
};
componentDOM.value=componentRowSequence;
curColumn.colSpan=componentcolumnSpan;
curColumn.style.width=(this.layoutColumnWidth*componentcolumnSpan)+"%";
while(componentcolumnSpan>1){nextColumnNode=Util.gns(curColumn);
Util.de(nextColumnNode);
componentcolumnSpan-=1;
}if(columnChildNodes.length===0){Util.ac(componentDOM,curColumn);
}else{for(var i=0,len=columnChildNodes.length;
i<len;
i++){if(componentRowSequence<columnChildNodes[i].value){curColumn.insertBefore(componentDOM,columnChildNodes[i]);
break;
}break;
}if(i==len){Util.ac(componentDOM,curColumn);
}}if(this.layoutHeaderSpanClearCustomize.innerHTML>""){Util.addEvent(componentTitleCornerDOM,"mousedown",function(e){if(!e){e=window.event;
}dragStartPosition=mpo(e);
componentStartPosition=Util.Pos.gop(componentDOM);
mouseOffsetPosition=[dragStartPosition[0]-componentStartPosition[0],dragStartPosition[1]-componentStartPosition[1]];
Util.addEvent(document,"mousemove",mouseMoveMethod);
Util.cancelBubble(e);
});
Util.addEvent(componentTitleCornerDOM,"mouseup",function(e){if(!e){e=window.event;
}Util.removeEvent(document,"mousemove",mouseMoveMethod);
that.finalizeComponent(that,componentDOM);
Util.cancelBubble(e);
});
}}catch(e){alert(e.message+"insertComponent");
}};
MpageLayout.prototype.getBannerDOM=function(){return this.layoutBannerDOM;
};
MpageLayout.prototype.getButtonDOM=function(){return this.layoutButtonDOM;
};
MpageLayout.prototype.getHeaderDOM=function(){return this.layoutHeaderDOM;
};
MpageLayout.prototype.getHeaderAlertDOM=function(){return this.layoutHeaderAlertDOM;
};
MpageLayout.prototype.getLayoutDOM=function(){return this.layoutDOM;
};
MpageLayout.prototype.getLayoutFooterDOM=function(){return this.layoutFooterDOM;
};
MpageLayout.prototype.toggleCustomizeDisplay=function(that,opt){var custDisp,otherDisp;
if(opt===1){custDisp="";
otherDisp="none";
}else{custDisp="none";
otherDisp="";
}if(this.layoutHeaderSpanExpand!==null&&typeof this.layoutHeaderSpanExpand==="object"){this.layoutHeaderSpanExpand.style.display=otherDisp;
}if(this.layoutHeaderSpanCustomize!==null&&typeof this.layoutHeaderSpanCustomize==="object"){this.layoutHeaderSpanCustomize.style.display=otherDisp;
this.layoutHeaderSpanSaveCustomize.style.display=custDisp;
this.layoutHeaderSpanClearCustomize.style.display=custDisp;
}if(this.layoutHeaderSpanHelp!==null&&typeof this.layoutHeaderSpanHelp==="object"){this.layoutHeaderSpanHelp.style.display=otherDisp;
}};
MpageLayout.prototype.moveComponent=function(e,mouseOffsetPos,that,component){if(!e){e=window.event;
}var componentDOM=component.getComponentDOM(),componentDOMleft=mpo(e),componentDOMtop=componentDOMleft[0],childNodesDOM,curcomponentDOM=null,curComponentDOMLeft,curComponentDOMTop;
componentDOMleft=componentDOMleft[1];
that.activeMpageComponent=component;
if((!that.placeHolderDOM||that.placeHolderDOM===null)){that.placeHolderDOM=Util.cep("div",{className:"mpage-layout-placeholder"});
}if((!that.placeHolderParentDOM||that.placeHolderParentDOM===null)){that.placeHolderDOM.style.height=componentDOM.offsetHeight+"px";
that.placeHolderDOM.style.width=componentDOM.offsetWidth+"px";
componentDOM.style.width=componentDOM.offsetWidth+"px";
componentDOM.style.height=componentDOM.offsetHeight+"px";
componentDOM=(Util.gp(componentDOM)).removeChild(componentDOM);
Util.ac(componentDOM,document.body);
componentDOM.style.position="absolute";
}componentDOM.style.left=(componentDOMleft-mouseOffsetPos[1])+"px";
componentDOM.style.top=(componentDOMtop-mouseOffsetPos[0])+"px";
for(var n=0,l=this.layoutColumnNodes.length;
n<l;
n++){if(Util.Pos.gop(this.layoutColumnNodes[n])[1]<=componentDOMleft){that.activeColumnDOM=this.layoutColumnNodes[n];
that.activeColumnSequence=(n+1);
}}childNodesDOM=Util.gcs(that.activeColumnDOM);
for(var i=0,len=childNodesDOM.length;
i<len;
i++){curcomponentDOM=childNodesDOM[i];
curComponentDOMLeft=Util.Pos.gop(curcomponentDOM);
curComponentDOMTop=curComponentDOMLeft[0];
curComponentDOMLeft=curComponentDOMLeft[1];
if(that.placeHolderDOM!==curcomponentDOM){if(curComponentDOMTop>componentDOMtop){that.activeRowSequence=(i+1);
that.placeHolderParentDOM=that.activeColumnDOM;
that.placeHolderParentDOM.insertBefore(that.placeHolderDOM,curcomponentDOM);
break;
}}if(i===len-1){that.activeRowSequence=(i+2);
that.placeHolderParentDOM=that.activeColumnDOM;
Util.ia(that.placeHolderDOM,curcomponentDOM);
break;
}}if(childNodesDOM.length===0){that.activeRowSequence=1;
that.placeHolderParentDOM=that.activeColumnDOM;
Util.ac(that.placeHolderDOM,that.placeHolderParentDOM);
}};
MpageLayout.prototype.finalizeComponent=function(that,componentDOM){if(that.placeHolderParentDOM!==null&&typeof that.placeHolderParentDOM==="object"){componentDOM=(Util.gp(componentDOM)).removeChild(componentDOM);
componentDOM.style.position="relative";
componentDOM.style.top=(0)+"px";
componentDOM.style.left=(0)+"px";
componentDOM.style.height="auto";
componentDOM.style.width="100.00%";
Util.ia(componentDOM,that.placeHolderDOM);
that.placeHolderDOM=that.placeHolderParentDOM.removeChild(that.placeHolderDOM);
that.placeHolderParentDOM=null;
that.activeMpageComponent.rowSequence=that.activeRowSequence;
that.activeMpageComponent.columnSequence=that.activeColumnSequence;
}};
MpageLayout.prototype.toggleComponentsDisplay=function(that,toggleComponentsDisplay,toggleComponentsHover){var ccomps=Util.Style.g("section",document.body,"div"),i,l=ccomps.length,expandInd=(that.layoutHeaderSpanExpand.innerHTML===toggleComponentsDisplay[0]?0:1);
for(i=0;
i<l;
i++){cels=Util.Style.g("sec-hd-tgl",ccomps[i],"span");
if(cels.length===1){if(expandInd===1){if(Util.Style.ccss(ccomps[i],"closed")){Util.Style.rcss(ccomps[i],"closed");
cels[0].innerHTML="-";
cels[0].title=toggleComponentsDisplay[0];
}}else{if(!Util.Style.ccss(ccomps[i],"closed")){Util.Style.acss(ccomps[i],"closed");
cels[0].innerHTML="+";
cels[0].title=toggleComponentsDisplay[1];
}}}}if(expandInd===1){that.layoutHeaderSpanExpand.innerHTML=toggleComponentsDisplay[0];
that.layoutHeaderSpanExpand.title=toggleComponentsHover[0];
}else{that.layoutHeaderSpanExpand.innerHTML=toggleComponentsDisplay[1];
that.layoutHeaderSpanExpand.title=toggleComponentsHover[1];
}};
MpageLayout.prototype.createColumnNode=function(layoutTable){var curColumnNode=layoutTable.rows[0].insertCell(0);
curColumnNode.style.width=this.layoutColumnWidth+"%";
return curColumnNode;
};
MpageLayout.prototype.createRowNode=function(){};
MpageLayout.prototype.getColumnNode=function(columnSequence){return this.layoutColumnNodes[columnSequence];
};
MpageLayout.prototype.getRowNode=function(rowSequence){return this.layoutRowNodes[rowSequence];
};
MpageLayout.prototype.insertHeaderLink=function(linkHTML,sequence){var linkSpan=Util.cep("span",{});
if(sequence===1){var headerTag=_gbt("H1",this.layoutHeaderDOM);
Util.ia(linkSpan,headerTag[0]);
}else{linkSpan=Util.ac(linkSpan,this.layoutHeaderDOM);
}linkSpan.innerHTML=linkHTML;
};
var MpageComponent=function(){this.groups={};
this.id="";
this.toggleTitle="";
this.toggleHover="";
this.locked="";
this.rowSequence="";
this.columnSpan="1";
this.columnSequence="";
this.componentDOM="";
this.contentDOM="";
this.componentToggleDOM="";
this.componentHyperLinkDOM="";
this.componentTitleWrapperDOM="";
this.componentTitleCornerDOM="";
this.componentTitleMiscDOM="";
this.componentHeaderDOM="";
this.display="";
this.componentType="";
this.criterion="";
this.defaultLoad=true;
this.loadingDisplay="";
this.onDOMLoad=[];
};
MpageComponent.prototype.createComponent=function(prefs){var that=this;
header=prefs.header,link=prefs.link,row=prefs.row,columnSpan=prefs.columnSpan,column=prefs.column,toggleTitle=prefs.toggleTitle,toggleHover=prefs.toggleHover,loadingDisplay=prefs.loadingDisplay;
this.componentDOM=Util.cep("div",{className:"section"});
this.contentDOM=Util.cep("div",{className:"sec-content"});
this.componentToggleDOM=Util.cep("span",{className:"sec-hd-tgl"});
this.componentHeaderDOM=Util.cep("h2",{className:"sec-hd"});
this.componentTitleCornerDOM=Util.cep("span",{className:"corner-left"});
this.componentTitleMiscDOM=Util.cep("span",{className:"corner-misc"});
this.componentTitleWrapperDOM=Util.ce("span");
this.componentHyperLinkDOM=Util.cep("a",{});
if(this.componentType===undefined||this.componentType===""||this.componentType.toLowerCase()!="simple"){this.componentToggleDOM=Util.ac(this.componentToggleDOM,this.componentHeaderDOM);
this.componentHyperLinkDOM=Util.ac(this.componentHyperLinkDOM,this.componentTitleWrapperDOM);
this.componentTitleMiscDOM=Util.ac(this.componentTitleMiscDOM,this.componentTitleCornerDOM);
this.componentTitleWrapperDOM=Util.ac(this.componentTitleWrapperDOM,this.componentTitleCornerDOM);
this.componentTitleWrapperDOM.className="sec-title";
this.componentTitleCornerDOM=Util.ac(this.componentTitleCornerDOM,this.componentHeaderDOM);
this.componentHeaderDOM=Util.ac(this.componentHeaderDOM,this.componentDOM);
}if(this.componentType>" "&&this.componentType.toLowerCase()==="simple"){this.contentDOM.style.borderWidth="0px";
}this.contentDOM=Util.ac(this.contentDOM,this.componentDOM);
this.rowSequence=0;
this.columnSequence=0;
if(link&&link>""){this.componentHyperLinkDOM.href=link;
}if(header&&header>""){this.componentHyperLinkDOM.innerHTML=header;
}if(row&&row>""){this.rowSequence=parseInt(row,10)-1;
}if(columnSpan&&columnSpan>""){this.columnSpan=parseInt(columnSpan,10);
}if(column&&column>""){this.columnSequence=parseInt(column,10)-1;
}if(toggleTitle){this.toggleTitle=toggleTitle;
this.componentToggleDOM.innerHTML=toggleTitle[1];
}if(toggleHover){this.toggleHover=toggleHover;
this.componentToggleDOM.title=toggleHover[1];
}if(loadingDisplay){this.loadingDisplay=loadingDisplay;
}Util.addEvent(this.componentToggleDOM,"click",function(){that.toggleDisplay(that,0);
});
};
MpageComponent.prototype.initialize=function(crit){this.criterion=crit;
if(this.defaultLoad===true){this.componentTitleMiscDOM.innerHTML=this.loadingDisplay;
this.load(crit);
}if(this.defaultHidden===true){this.getComponentHeaderDOM().style.display="none";
this.getComponentDOM().style.display="none";
}};
MpageComponent.prototype.load=function(criterion){};
MpageComponent.prototype.loadJsonData=function(jsonData){};
MpageComponent.prototype.dataListener=function(cData){};
MpageComponent.prototype.setlockDisplay=function(prefLock){this.locked=prefLock;
};
MpageComponent.prototype.setCriterion=function(crit){this.criterion=crit;
};
MpageComponent.prototype.toggleDisplay=function(that,mode){var gpp=that.componentDOM,selIndex=0;
if(!that.locked){switch(mode){case 0:if(Util.Style.ccss(gpp,"closed")){Util.Style.rcss(gpp,"closed");
selIndex=1;
}else{Util.Style.acss(gpp,"closed");
selIndex=0;
}break;
case -1:Util.Style.acss(gpp,"closed");
selIndex=0;
break;
case 1:Util.Style.rcss(gpp,"closed");
selIndex=1;
break;
}}if(that.toggleTitle){that.componentToggleDOM.innerHTML=that.toggleTitle[selIndex];
}if(that.toggleHover){that.componentToggleDOM.title=that.toggleHover[selIndex];
}};
MpageComponent.prototype.finishedLoading=function(){if(this.componentType===undefined||this.componentType===""||this.componentType.toLowerCase()!="simple"){this.componentTitleMiscDOM.innerHTML="";
}};
MpageComponent.prototype.appendContentHTML=function(HTMLString){this.contentDOM.innerHTML+=HTMLString;
};
MpageComponent.prototype.appendContentNode=function(HTMLNode){return(Util.ac(HTMLNode,this.contentDOM));
};
MpageComponent.prototype.clearContentHTML=function(){this.contentDOM.innerHTML="";
};
MpageComponent.prototype.getCriterion=function(){return(this.criterion);
};
MpageComponent.prototype.getComponentHeaderDOM=function(){return this.componentHeaderDOM;
};
MpageComponent.prototype.getComponentTitleCornerDOM=function(){return this.componentTitleCornerDOM;
};
MpageComponent.prototype.getComponentDOM=function(){return this.componentDOM;
};
MpageComponent.prototype.getContentDOM=function(){return this.contentDOM;
};
MpageComponent.prototype.getColumnSequence=function(){return this.columnSequence;
};
MpageComponent.prototype.getRowSequence=function(){return this.rowSequence;
};
MpageComponent.prototype.setContentDOM=function(newContentDOM){this.contentDOM=newContentDOM;
};
MpageComponent.prototype.listener=function(cData){if(cData){if(cData.triggerLoad&&cData.triggerLoad===true){this.defaultLoad=true;
this.initialize(cData.loadCriterion);
}if(cData.dataType&&cData.data){switch(cData.dataType.toUpperCase()){case"HTML":this.contentDOM.innerHTML+=cData.data;
break;
default:if(this.dataListener){this.dataListener(cData);
}break;
}}}};
MpageComponent.prototype.addObserver=function(event,observer){var self=this,group=self.groups[event];
if(group==undefined||!group){group=[];
}group.push(observer);
};
MpageComponent.prototype.notifyObservers=function(event,data){var self=this,group=self.groups[event];
if(group){for(var i=0,ilen=group.length;
i<ilen;
i++){group[i](data);
}}};
MpageComponent.prototype.getColumnSpan=function(){return this.columnSpan;
};
function getXMLCclRequest(){var xmlHttp=null;
if(location.protocol.substr(0,4)=="http"&&location.href.indexOf("discern")>0){try{xmlHttp=new XMLHttpRequest();
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
}function MPAGES_SVC_EVENT__(uri,params){}function MPAGES_SVC_EVENT(uri,params){var paramLength=params.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+params+'"';
params=params.substring(0,2000);
}var el=document.getElementById("__ID_CCLPostParams_32504__");
el.href='javascript:MPAGES_SVC_EVENT__("'+uri+'","'+params+'",'+paramLength+")";
el.click();
}function CCLLINKPOPUP__(program,param,sName,sFeatures,bReplace){}function CCLLINKPOPUP(program,param,sName,sFeatures,bReplace){var paramLength=param.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+param+'"';
param=param.substring(0,2000);
}var el=document.getElementById("__ID_CCLPostParams_32504__");
el.href='javascript:CCLLINKPOPUP__("'+program+'","'+param+'","'+sName+'","'+sFeatures+'",'+bReplace+","+paramLength+")";
el.click();
}function CCLNEWPOPUPWINDOW(sUrl,sName,sFeatures,bReplace){popupWindowHandle=window.open(sUrl,sName,sFeatures,bReplace);
popupWindowHandle.focus();
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
}var TabLayout=function(){return{activeTabHeader:"",activeTabContent:"",attachClickEvent:function(tabHdrDOM,tabContentDOM,tabsContentLoad){var that=this;
$(tabHdrDOM).bind("click",function(){$(that.activeTabHeader).removeClass("tab-layout-active");
if(!$(that.activeTabContent).hasClass("tab-layout-tabhide")){$(that.activeTabContent).addClass("tab-layout-tabhide");
}if(!$(tabHdrDOM).hasClass("tab-layout-active")){$(tabHdrDOM).addClass("tab-layout-active");
}$(tabContentDOM).removeClass("tab-layout-tabhide");
if(tabsContentLoad){tabsContentLoad(tabContentDOM);
}that.activeTabHeader=tabHdrDOM;
that.activeTabContent=tabContentDOM;
});
},generateLayout:function(prefs){var curNode,tabContentLoad,tabsHeader=prefs.tabsHeader,tabsId=prefs.tabsId,tabsContentId=prefs.tabsContentId,tabsContentDOM=prefs.tabsContentDOM,tabsContainerCSS=prefs.tabsContainerCSS,tabsContentLoad=prefs.tabsContentLoad,defaultTab=prefs.defaultTab?prefs.defaultTab:0,tabsWrapperDOM=Util.cep("div",{className:"tab-layout-wrapper"}),tabHdrsWrapperDOM=Util.cep("ul",{className:"tab-layout-nav"}),tabHdrDOM,tabHdrLinkDOM,tabContentDOM,idx=0,len,that=this;
var defaultTabHeader=null;
defaultTab=parseInt(defaultTab,10);
if(tabsContainerCSS){tabsWrapperDOM.className=tabsContainerCSS;
}if(prefs.parentDOM){Util.ac(tabsWrapperDOM,prefs.parentDOM);
}Util.ac(tabHdrsWrapperDOM,tabsWrapperDOM);
if(tabsHeader&&tabsHeader.length>0){for(idx=0,len=tabsHeader.length;
idx<len;
idx+=1){tabHdrDOM=Util.cep("li",{className:"tab-layout-tabhide"});
tabHdrLinkDOM=Util.cep("a",{href:"javascript:void(0);","tab-layout-Index":idx});
tabContentDOM=Util.cep("div",{className:"tab-layout-tab tab-layout-tabhide"});
if((tabsContentDOM&&tabsContentDOM[idx])||(tabsContentLoad&&tabsContentLoad[idx])){if(tabsContentDOM&&tabsContentDOM[idx]){Util.ac(tabsContentDOM[idx],tabContentDOM);
}if(tabsContentLoad&&tabsContentLoad[idx]){tabContentLoad=tabsContentLoad[idx];
}tabContentDOM=Util.ac(tabContentDOM,tabsWrapperDOM);
}tabHdrLinkDOM.innerHTML=tabsHeader[idx];
if(tabsId&&tabsId[idx]){tabHdrLinkDOM.id=tabsId[idx];
}if(tabsContentId&&tabsContentId[idx]){tabContentDOM.id=tabsContentId[idx];
}tabHdrLinkDOM=Util.ac(tabHdrLinkDOM,tabHdrDOM);
tabHdrDOM=Util.ac(tabHdrDOM,tabHdrsWrapperDOM);
this.attachClickEvent(tabHdrDOM,tabContentDOM,tabContentLoad);
if(idx===defaultTab){defaultTabHeader=tabHdrDOM;
}}if(defaultTabHeader!=null){$(defaultTabHeader).trigger("click");
}}return(tabsWrapperDOM);
},selectTab:function(tabsWrapperDOM,tabSequence){tabSequence=parseInt(tabSequence,10);
$("li:nth-child("+(tabSequence+1)+")",$(tabsWrapperDOM)).trigger("click");
}};
};
var TableLayout=function(){function TableLayout_replaceTags(tagTxt,jsonList){var objRegExp=/=%(\w+)/g,tagSplit=tagTxt.match(objRegExp),i=0,l=0;
if(tagSplit&&tagSplit.length>0){for(i=0,l=tagSplit.length;
i<l;
i++){tagTxt=tagTxt.split(tagSplit[i]).join(jsonList[tagSplit[i].split("=%").join("")]);
}}return(tagTxt);
}function TableLayout_attachResizeEvents(dragDOM,leftColDOM,rightColDOM,leftHeaderColDOM,rightheaderColDOM){var startMousePosition,startLeftColWidth,startRightColWidth,mouseMovefnc=function(e){var e,curMousePosition=TableLayout_mpo(e),widthdiff1=startMousePosition[1]-curMousePosition[1],widthdiff2=curMousePosition[1]-startMousePosition[1];
if(!e){e=window.event;
}if(widthdiff2<=0){if((startLeftColWidth-widthdiff1)<0){leftHeaderColDOM.style.width="0px";
leftColDOM.style.width="0px";
}else{leftHeaderColDOM.style.width=(startLeftColWidth-widthdiff1)+"px";
leftColDOM.style.width=(startLeftColWidth-widthdiff1)+"px";
}rightheaderColDOM.style.width=(startRightColWidth+widthdiff1)+"px";
rightColDOM.style.width=(startRightColWidth+widthdiff1)+"px";
}else{leftHeaderColDOM.style.width=(startLeftColWidth+widthdiff2)+"px";
leftColDOM.style.width=(startLeftColWidth+widthdiff2)+"px";
if(startRightColWidth-widthdiff2<0){rightheaderColDOM.style.width="0px";
rightColDOM.style.width="0px";
}else{rightheaderColDOM.style.width=(startRightColWidth-widthdiff2)+"px";
rightColDOM.style.width=(startRightColWidth-widthdiff2)+"px";
}}Util.preventDefault(e);
},mouseUpfnc=function(e){var e;
if(!e){e=window.event;
}Util.removeEvent(document,"mousemove",mouseMovefnc);
Util.removeEvent(document,"mouseup",mouseUpfnc);
Util.preventDefault(e);
},mouseDownfnc=function(e){var e;
if(!e){e=window.event;
}startMousePosition=TableLayout_mpo(e);
startLeftColWidth=leftColDOM.offsetWidth;
startRightColWidth=rightColDOM.offsetWidth;
Util.addEvent(document,"mousemove",mouseMovefnc);
Util.addEvent(document,"mouseup",mouseUpfnc);
Util.preventDefault(e);
};
Util.addEvent(dragDOM,"mousedown",mouseDownfnc);
}function TableLayout_mpo(e){var posx=0;
var posy=0;
if(!e){var e=window.event;
}if(e.pageX||e.pageY){posx=e.pageX;
posy=e.pageY;
}else{if(e.clientX||e.clientY){posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
}}return[posy,posx];
}function TableLayout_RealTypeOf(v){try{if(typeof(v)==="object"){if(v===null){return"null";
}if(v.constructor===([]).constructor){return"array";
}if(v.constructor===(new Date()).constructor){return"date";
}if(v.constructor===(new RegExp()).constructor){return"regex";
}return"object";
}return typeof(v);
}catch(e){error_handler(e.message,"TableLayout_RealTypeOf()");
}}function sortTable(tblEl,col,type){var rev=false;
var imghtml;
if(tblEl.reverseSort==null){tblEl.reverseSort=new Array();
tblEl.lastColumn=2;
}if(tblEl.reverseSort[col]==null){tblEl.reverseSort[col]=rev;
}if(col==tblEl.lastColumn){tblEl.reverseSort[col]=!tblEl.reverseSort[col];
}tblEl.lastColumn=col;
var tmpEl;
var i,j;
var minVal,minIdx;
var testVal;
var cmp;
for(i=0;
i<tblEl.rows.length-1;
i++){minIdx=i;
if(tblEl.rows[i].cells[col].childNodes&&tblEl.rows[i].cells[col].childNodes[0]&&tblEl.rows[i].cells[col].childNodes[0].innerHTML){minVal=tblEl.rows[i].cells[col].childNodes[0].innerHTML;
}else{minVal=tblEl.rows[i].cells[col].innerHTML;
}for(j=i+1;
j<tblEl.rows.length;
j++){if(tblEl.rows[j].cells[col].childNodes&&tblEl.rows[j].cells[col].childNodes[0]&&tblEl.rows[j].cells[col].childNodes[0].innerHTML){testVal=tblEl.rows[j].cells[col].childNodes[0].innerHTML;
}else{testVal=tblEl.rows[j].cells[col].innerHTML;
}if(testVal>" "){cmp=compareValues(minVal,testVal,type);
if(tblEl.reverseSort[col]){cmp=-cmp;
}if(cmp>0){minIdx=j;
minVal=testVal;
}}}if(minIdx>i){tmpEl=tblEl.removeChild(tblEl.rows[minIdx]);
tblEl.insertBefore(tmpEl,tblEl.rows[i]);
}}return false;
}function compareValues(v1,v2,type){if(type=="date"){var date1=v1.split("/");
var date2=v2.split("/");
var tempdate1=new Date();
var tempdate2=new Date();
var dttmdiff=new Date();
tempdate1.setFullYear(date1[2],date1[0]-1,date1[1]);
tempdate2.setFullYear(date2[2],date2[0]-1,date2[1]);
dttmdiff.setTime(tempdate1.getTime()-tempdate2.getTime());
timediff=dttmdiff.getTime();
days=Math.floor(timediff/(1000*60*60*24));
if(days>0){return 1;
}else{if(days==0){return 0;
}}}else{if(type=="numeric"){if(parseInt(v1)==parseInt(v2)){return 0;
}if(parseInt(v1)>parseInt(v2)){return 1;
}}else{if(v1==v2){return 0;
}if(v1>v2){return 1;
}}}return -1;
}function TableLayout_attachSortEvent(tableHeadCellDOM,tableBodyDOM,colIndex,sortType){Util.addEvent(tableHeadCellDOM,"click",function(){sortTable(tableBodyDOM,colIndex,sortType);
});
}function addTableRowEvent(tableRowEvent,tableRowFnc,curRowDOM){if(tableRowEvent=="contextmenu"){curRowDOM.oncontextmenu=function(e1){return(tableRowFnc(e1,curRowDOM));
};
}else{Util.addEvent(curRowDOM,tableRowEvent,function(e){return(tableRowFnc(e,curRowDOM));
});
}}function nonEmptyString(testString){var returnValue=false;
if(!_.isUndefined(testString)){if(!_.isEmpty(testString)){if(_.isString(testString)){returnValue=true;
}}}return(returnValue);
}function nonEmptyArray(testArray){var returnValue=false;
if(!_.isUndefined(testArray)){if(!_.isEmpty(testArray)){if(_.isArray(testArray)){returnValue=true;
}}}return(returnValue);
}function nonZeroNumber(testNumber){var returnValue=false;
if(!_.isUndefined(testNumber)){if(parseInt(testNumber,10)>0){returnValue=true;
}}return(returnValue);
}return{generateLayout:function(prefs){var wrapperDOM,headerDOM,tempcellDOM,tableOuterWrapperDOM;
var tableHeaderWrapperDOM,tableHeaderDOM,tableWrapperDOM,tableDOM,headerlinkDOM,toggleDOM,tHeadDOM;
var tableBodyDOM=null,tableHeadCellDOM,prevtableHeadCellDOM,headerRowDOM=null,curRowDOM,resizeDOM;
var tableheaderCSS;
var tableRowId=prefs.JSONRowId;
var JSONRowEvent=prefs.JSONRowEvent;
var JSONRowFnc=prefs.JSONRowFnc;
var headerDisplay=prefs.headerDisplay;
var headerLink=prefs.headerLink;
var tableCSS=prefs.tableCSS;
var headerCSS=prefs.headerCSS;
var headerToggle=prefs.headerToggle;
var tableHeaders=prefs.tableHeaders;
var numberColumns=prefs.numberColumns;
var tableHeadersFixed=prefs.tableHeadersFixed;
var tableHeaderRowCSS=prefs.tableHeaderRowCSS;
var tableBodyRowCSS=prefs.tableBodyRowCSS;
var tableHeaders=prefs.tableHeaders;
var JSONList=prefs.JSONList;
var JSONRefs=prefs.JSONRefs;
var JSONRefCSS=prefs.JSONRefCSS;
var tableBodyCellCSS=prefs.tableBodyCellCSS;
var tableBodyRowHover=prefs.tableBodyRowHover;
var tableHeaderCellCSS=prefs.tableHeaderCellCSS;
var tableSort=prefs.tableSort;
var tempstr;
var extraRow=prefs.ExtraRow;
var rowTemplate=prefs.RowTemplate;
wrapperDOM=Util.cep("div",{className:"table-layout-wrapper"});
tableOuterWrapperDOM=Util.ce("div");
tableHeaderWrapperDOM=Util.ce("div");
tableWrapperDOM=Util.cep("div",{className:"table-layout-wrapper-table"});
tableHeaderDOM=Util.cep("table",{className:"table-layout-table-head"});
tableDOM=Util.cep("table",{className:"table-layout-table"});
if(Util.Detect.ie6()==true){tableDOM.style.width="auto";
}if(nonEmptyString(headerDisplay)){headerDOM=Util.cep("div",{className:"table-layout-header"});
if(nonEmptyString(headerLink)){headerlinkDOM=Util.cep("a",{href:headerLink});
headerlinkDOM.innerHTML=headerDisplay;
Util.ac(headerlinkDOM,headerDOM);
}else{headerDOM.innerHTML="<span>"+headerDisplay+"</span>";
}if(nonEmptyString(tableCSS)){$(tableHeaderDOM).addClass(tableCSS);
$(tableDOM).addClass(tableCSS);
}if(nonEmptyString(headerCSS)){$(headerDOM).addClass(headerCSS);
}if(nonEmptyArray(headerToggle)){toggleDOM=Util.cep("span",{className:"table-layout-header-toggle"});
toggleDOM.innerHTML=headerToggle[0];
toggleDOM=Util.ac(toggleDOM,headerDOM);
toggleDOM.onclick=function(e){if(tableOuterWrapperDOM.style.display!="none"){tableOuterWrapperDOM.style.display="none";
toggleDOM.innerHTML=headerToggle[1];
}else{tableOuterWrapperDOM.style.display="";
toggleDOM.innerHTML=headerToggle[0];
}};
}headerDOM=Util.ac(headerDOM,wrapperDOM);
}tableHeaderDOM=Util.ac(tableHeaderDOM,tableHeaderWrapperDOM);
tableDOM=Util.ac(tableDOM,tableWrapperDOM);
tableHeaderWrapperDOM=Util.ac(tableHeaderWrapperDOM,tableOuterWrapperDOM);
tableWrapperDOM=Util.ac(tableWrapperDOM,tableOuterWrapperDOM);
tableOuterWrapperDOM=Util.ac(tableOuterWrapperDOM,wrapperDOM);
if(nonEmptyArray(tableHeaders)||nonZeroNumber(numberColumns)){if(nonEmptyArray(tableHeaders)){if(tableHeadersFixed&&(tableHeadersFixed=="true"||tableHeadersFixed=="1")){tHeadDOM=tableHeaderDOM.createTHead();
tableheaderCSS="table-layout-table-head-th";
}else{tHeadDOM=tableDOM.createTHead();
tableheaderCSS="table-layout-table-th";
}tHeadDOM.insertRow(-1);
headerRowDOM=tHeadDOM.rows[0];
headerRowDOM.colSpan=tableHeaders.length;
if(nonEmptyString(tableHeaderRowCSS)){$(headerRowDOM).addClass(tableHeaderRowCSS);
}}if(_gbt("tbody",tableDOM).length==1){tableBodyDOM=_gbt("tbody",tableDOM)[0];
}else{tableBodyDOM=Util.ce("tbody");
tableBodyDOM=Util.ac(tableBodyDOM,tableDOM);
}if(nonZeroNumber(numberColumns)){tableBodyDOM.colSpan=parseInt(numberColumns,10);
}else{tableBodyDOM.colSpan=tableHeaders.length;
}if(nonEmptyArray(JSONList)&&nonEmptyArray(JSONRefs)){tableBodyDOM.className="scrollContent";
_.each(JSONList,function(JSONItem,JSONItemIndex){curRowDOM=tableBodyDOM.insertRow(-1);
tempstr="";
if(numberColumns){curRowDOM.colSpan=parseInt(numberColumns,10);
}else{curRowDOM.colSpan=tableHeaders.length;
}if(extraRow){var newRow=tableBodyDOM.insertRow(-1);
var newCell=newRow.insertCell(-1);
newRow.className=newRow.className+" "+prefs.ChildRowClass;
newCell.colSpan=curRowDOM.colSpan;
newCell.innerHTML=rowTemplate;
}if(nonEmptyString(tableRowId)){if((JSONItem)[tableRowId]){curRowDOM.id=(JSONItem)[tableRowId];
}}else{if(nonEmptyArray(tableRowId)){tempstr="";
_.each(tableRowId,function(idAttribute){if((JSONItem)[idAttribute]){tempstr+="_";
tempstr+=(JSONItem)[idAttribute];
}});
curRowDOM.id=tempstr;
if(extraRow){newRow.id=tempstr+"-1";
}}}if(nonEmptyString(JSONRowEvent)&&JSONRowFnc){if(nonEmptyArray(JSONRowFnc)){_.each(JSONRowFnc,function(curRowFnc,RowFncIndex){addTableRowEvent(tableRowEvent[RowFncIndex],curRowFnc,curRowDOM);
});
}else{addTableRowEvent(tableRowEvent,JSONRowFnc,curRowDOM);
}}if(nonEmptyString(tableBodyRowCSS)){curRowDOM.className=tableBodyRowCSS;
}else{if(nonEmptyArray(tableBodyRowCSS)){if(tableBodyRowCSS.length==1){$(curRowDOM).addClass(tableBodyRowCSS[0]);
}else{var rowCSSIndex=JSONItemIndex%tableBodyRowCSS.length;
$(curRowDOM).addClass(tableBodyRowCSS[rowCSSIndex]);
if(extraRow){$(newRow).addClass(tableBodyRowCSS[rowCSSIndex]);
$(curRowDOM).addClass(prefs.ParentRowClass);
}}}}_.each(JSONRefs,function(RefItem,RefItemIndex){curRowDOM.insertCell(-1);
var curCellElement=curRowDOM.cells[RefItemIndex];
if((JSONItem)[RefItem]){tempcellDOM=Util.ce("span");
tempcellDOM.innerHTML=((JSONItem)[RefItem]);
if(JSONRefCSS&&nonEmptyString(JSONRefCSS[RefItemIndex])){tempcellDOM.className=JSONRefCSS[RefItemIndex];
}Util.ac(tempcellDOM,curCellElement);
}curCellElement.className="table-layout-table-td";
if(nonEmptyString(tableBodyCellCSS)){$(curCellElement).addClass(tableBodyCellCSS);
}else{if(nonEmptyArray(tableBodyCellCSS)){var cellCSSIndex=RefItemIndex%tableBodyCellCSS.length;
$(curCellElement).addClass(tableBodyCellCSS[cellCSSIndex]);
}}if(nonEmptyArray(tableBodyRowHover)){var rowHoverIndex=RefItemIndex%tableBodyRowHover.length;
if(tableBodyRowHover[rowHoverIndex]>""){UtilPopup.attachHover({elementDOM:curCellElement,event:"mousemove",content:TableLayout_replaceTags(tableBodyRowHover[rowHoverIndex],JSONItem)});
}}});
});
}if(nonEmptyArray(tableHeaders)){_.each(tableHeaders,function(headerItem,headerItemIndex){tableHeadCellDOM=Util.ce("th");
tableHeadCellDOM.className=tableheaderCSS;
tableHeadCellDOM.innerHTML=headerItem;
if(nonEmptyArray(tableSort)&&tableSort.length>headerItemIndex){tableHeadCellDOM.title="Click to sort";
tableHeadCellDOM.style.cursor="pointer";
TableLayout_attachSortEvent(tableHeadCellDOM,tableBodyDOM,headerItemIndex,tableSort[headerItemIndex]);
}if(nonEmptyString(tableHeaderCellCSS)){$(tableHeadCellDOM).addClass(tableHeaderCellCSS);
}else{if(nonEmptyArray(tableHeaderCellCSS)){var headerCSSIndex=headerItemIndex%tableHeaderCellCSS.length;
$(tableHeadCellDOM).addClass(tableHeaderCellCSS[headerCSSIndex]);
}}Util.ac(tableHeadCellDOM,headerRowDOM);
prevtableHeadCellDOM=tableHeadCellDOM;
});
}}return({layoutDOM:wrapperDOM,contentDOM:tableOuterWrapperDOM,tableDOM:tableBodyDOM,headerRowDOM:headerRowDOM,wrapperDOM:tableWrapperDOM});
},appendRowsFaster:function(prefs){var fnc_cntr=0,fnc_cnt=0;
var hcntr=-1,ccntr=-1,rcntr=-1;
var extraRow=prefs.ExtraRow;
var rowTemplate=prefs.RowTemplate;
var tableHeaders=prefs.tableHeaders;
var tableBodyDOM=prefs.tableBodyDOM;
var tableRowId=prefs.JSONRowId;
var tableRowEvent=prefs.JSONRowEvent;
var tableRowFnc=prefs.JSONRowFnc;
var rowsLength=tableBodyDOM.rows.length;
var rowId;
var curRow;
var curRowCell;
var curRowCSS;
var curRowCellCSS;
var curRowCellSpan;
var newRow;
var newCell;
if(prefs.numberColumns){tableBodyDOM.colSpan=parseInt(prefs.numberColumns);
}if(prefs.JSONList&&prefs.JSONList.length&&prefs.JSONList.length>0&&prefs.JSONRefs&&prefs.JSONRefs.length&&prefs.JSONRefs.length>0){tableBodyDOM.className="scrollContent";
var rowsFragment=document.createDocumentFragment();
_.each(prefs.JSONList,function(rowData,rowIndex){if(tableRowId){rowId="";
if(TableLayout_RealTypeOf(tableRowId)=="array"){_.each(tableRowId,function(idElement,idIndex){if((rowData)[idElement]){rowId+="_";
rowId+=(rowData)[idElement];
}});
}else{if((rowData)[tableRowId]){rowId=(rowData)[tableRowId];
}}}if(_g(rowId)===undefined||_g(rowId)===null||!tableRowId){curRow=$(rowsFragment).append($("<tr></tr>")).attr("id",rowId);
rowsLength+=1;
if(prefs.numberColumns){curRow.attr("colSpan",parseInt(prefs.numberColumns));
}if(extraRow){rowsLength+=1;
newRow=$(rowsFragment).append($("<tr></tr>")).attr("id",rowId+"-1").attr("className",newRow.attr("className")+" "+prefs.ChildRowClass);
newCell=$(newRow).append($("<td></td>")).attr("colSpan",tableHeaders.length).html(rowTemplate);
}if(prefs.tableBodyRowCSS&&prefs.tableBodyRowCSS>""){if(TableLayout_RealTypeOf(prefs.tableBodyRowCSS)=="string"){curRowCSS=prefs.tableBodyRowCSS;
}else{if(TableLayout_RealTypeOf(prefs.tableBodyRowCSS)=="array"){if(prefs.tableBodyRowCSS.length==1){curRowCSS=curRow.attr("className")+" "+prefs.tableBodyRowCSS[0];
}else{var rowlen=(rowsLength)/2;
if(extraRow){rcntr=(rowlen-1)%prefs.tableBodyRowCSS.length;
newRow.attr("className",newRow.attr("className")+" "+prefs.tableBodyRowCSS[rcntr]);
curRowCSS=curRow.attr("className")+" "+prefs.ParentRowClass;
}else{rcntr=(rowsLength-1)%prefs.tableBodyRowCSS.length;
}curRowCSS=curRow.attr("className")+" "+prefs.tableBodyRowCSS[rcntr];
}}}curRow.attr("className",curRowCSS);
}_.each(prefs.JSONRefs,function(cellData,cellIndex){curRowCell=$(curRow).append($("<td></td>"));
if((rowData)[cellData]){curRowCellSpan=$("<span></span>").html(rowData[cellData]);
if(prefs.JSONRefCSS&&prefs.JSONRefCSS[cellIndex]&&prefs.JSONRefCSS[cellIndex]>" "){curRowCellSpan.att("className",prefs.JSONRefCSS[cellIndex]);
}curRowCell.append(curRowCellSpan);
}curRowCellCSS="table-layout-table-td";
if(prefs.tableBodyCellCSS&&prefs.tableBodyCellCSS>""){if(TableLayout_RealTypeOf(prefs.tableBodyCellCSS)=="string"){curRowCellCSS=curRowCell.attr("className")+" "+prefs.tableBodyCellCSS;
}else{if(TableLayout_RealTypeOf(prefs.tableBodyCellCSS)=="array"){if(prefs.tableBodyCellCSS.length==1){curRowCellCSS=curRowCell.attr("className")+" "+prefs.tableBodyCellCSS[0];
}else{ccntr+=1;
if(ccntr==prefs.tableBodyCellCSS.length){ccntr=0;
}curRowCellCSS=curRowCell.attr("className")+" "+prefs.tableBodyCellCSS[ccntr];
}}}curRowCell.attr("className",curRowCellCSS);
}if(prefs.tableBodyRowHover&&prefs.tableBodyRowHover>""){hcntr+=1;
if(hcntr==prefs.tableBodyRowHover.length){hcntr=0;
}if(prefs.tableBodyRowHover[hcntr]>""){UtilPopup.attachHover({elementDOM:curRowCell.get(0),event:"mousemove",content:TableLayout_replaceTags(prefs.tableBodyRowHover[hcntr],rowData)});
}}});
}});
}tableBodyDOM.appendChild(rowsFragment);
return({tableDOM:tableBodyDOM});
},appendRows:function(prefs){var extraRow=prefs.ExtraRow;
var rowTemplate=prefs.RowTemplate;
var tableHeaders=prefs.tableHeaders;
var fnc_cntr=0,fnc_cnt=0,tableBodyDOM=prefs.tableBodyDOM,tempcellDOM,curRowDOM,tableRowId=prefs.JSONRowId,tableRowEvent=prefs.JSONRowEvent,tableRowFnc=prefs.JSONRowFnc,tempstr,cnt1,cntr1,cnt2,cntr2,cntr3,cnt3,hcntr=-1,ccntr=-1,rcntr=-1;
if(prefs.numberColumns){tableBodyDOM.colSpan=parseInt(prefs.numberColumns);
}if(prefs.JSONList&&prefs.JSONList.length&&prefs.JSONList.length>0&&prefs.JSONRefs&&prefs.JSONRefs.length&&prefs.JSONRefs.length>0){tableBodyDOM.className="scrollContent";
for(var cntr1=0,cnt1=prefs.JSONList.length;
cntr1<cnt1;
cntr1++){if(tableRowId){tempstr="";
if(TableLayout_RealTypeOf(tableRowId)=="array"){for(var cntr3=0,cnt3=tableRowId.length;
cntr3<cnt3;
cntr3++){if((prefs.JSONList[cntr1])[tableRowId[cntr3]]){tempstr+="_";
tempstr+=(prefs.JSONList[cntr1])[tableRowId[cntr3]];
}}}else{if((prefs.JSONList[cntr1])[tableRowId]){tempstr=(prefs.JSONList[cntr1])[tableRowId];
}}}if(_g(tempstr)===undefined||_g(tempstr)===null||!tableRowId){tableBodyDOM.insertRow(-1);
curRowDOM=tableBodyDOM.rows[tableBodyDOM.rows.length-1];
curRowDOM.id=tempstr;
if(extraRow){var newRow=tableBodyDOM.insertRow(-1);
newRow=tableBodyDOM.rows[tableBodyDOM.rows.length-1];
var newCell=newRow.insertCell(-1);
newRow.id=tempstr+"-1";
newRow.className=newRow.className+" "+prefs.ChildRowClass;
newCell.colSpan=tableHeaders.length;
newCell.innerHTML=rowTemplate;
}if(tableRowFnc&&tableRowEvent&&tableRowEvent>""){if(TableLayout_RealTypeOf(tableRowFnc)=="array"){fnc_cnt=tableRowFnc.length;
for(fnc_cntr=0;
fnc_cntr<fnc_cnt;
fnc_cntr++){addTableRowEvent(tableRowEvent[fnc_cntr],tableRowFnc[fnc_cntr],curRowDOM);
}}else{addTableRowEvent(tableRowEvent,tableRowFnc,curRowDOM);
}}if(prefs.tableBodyRowCSS&&prefs.tableBodyRowCSS>""){if(TableLayout_RealTypeOf(prefs.tableBodyRowCSS)=="string"){curRowDOM.className=prefs.tableBodyRowCSS;
}else{if(TableLayout_RealTypeOf(prefs.tableBodyRowCSS)=="array"){if(prefs.tableBodyRowCSS.length==1){curRowDOM.className=curRowDOM.className+" "+prefs.tableBodyRowCSS[0];
}else{var rowlen=tableBodyDOM.rows.length/2;
if(extraRow){rcntr=(rowlen-1)%prefs.tableBodyRowCSS.length;
newRow.className=newRow.className+" "+prefs.tableBodyRowCSS[rcntr];
curRowDOM.className=curRowDOM.className+" "+prefs.ParentRowClass;
}else{rcntr=(tableBodyDOM.rows.length-1)%prefs.tableBodyRowCSS.length;
}curRowDOM.className=curRowDOM.className+" "+prefs.tableBodyRowCSS[rcntr];
}}}}if(prefs.numberColumns){curRowDOM.colSpan=parseInt(prefs.numberColumns);
}for(var cntr2=0,cnt2=prefs.JSONRefs.length;
cntr2<cnt2;
cntr2++){curRowDOM.insertCell(-1);
if((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]){tempcellDOM=Util.ce("span");
tempcellDOM.innerHTML=((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]);
if(prefs.JSONRefCSS&&prefs.JSONRefCSS[cntr2]&&prefs.JSONRefCSS[cntr2]>" "){tempcellDOM.className=prefs.JSONRefCSS[cntr2];
}Util.ac(tempcellDOM,curRowDOM.cells[cntr2]);
}curRowDOM.cells[cntr2].className="table-layout-table-td";
if(prefs.tableBodyCellCSS&&prefs.tableBodyCellCSS>""){if(TableLayout_RealTypeOf(prefs.tableBodyCellCSS)=="string"){curRowDOM.cells[cntr2].className=curRowDOM.cells[cntr2].className+" "+prefs.tableBodyCellCSS;
}else{if(TableLayout_RealTypeOf(prefs.tableBodyCellCSS)=="array"){if(prefs.tableBodyCellCSS.length==1){curRowDOM.cells[cntr2].className=curRowDOM.cells[cntr2].className+" "+prefs.tableBodyCellCSS[0];
}else{ccntr+=1;
if(ccntr==prefs.tableBodyCellCSS.length){ccntr=0;
}curRowDOM.cells[cntr2].className=curRowDOM.cells[cntr2].className+" "+prefs.tableBodyCellCSS[ccntr];
}}}}if(prefs.tableBodyRowHover&&prefs.tableBodyRowHover>""){hcntr+=1;
if(hcntr==prefs.tableBodyRowHover.length){hcntr=0;
}if(prefs.tableBodyRowHover[hcntr]>""){UtilPopup.attachHover({elementDOM:curRowDOM.cells[cntr2],event:"mousemove",content:TableLayout_replaceTags(prefs.tableBodyRowHover[hcntr],prefs.JSONList[cntr1])});
}}}}}}return({tableDOM:tableBodyDOM});
},setMaxRowScroll:function(tableObj,maxRows){var rowsInTable=tableObj.tableDOM.rows.length;
try{var border=getComputedStyle(tableObj.tableDOM.rows[0].cells[0],"").getPropertyValue("border-top-width");
border=border.replace("px","")*1;
}catch(e){var border=tableObj.tableDOM.rows[0].cells[0].currentStyle.borderWidth;
border=(border.replace("px","")*1)/2;
}var height=0;
if(rowsInTable>=maxRows){for(var i=0;
i<maxRows;
i++){height+=tableObj.tableDOM.rows[i].clientHeight+(border?border:0);
}tableObj.wrapperDOM.style.height=height+"px";
}},insertColumnData:function(prefs){var tableDOM=prefs.tableDOM;
var tableJSONMap=(prefs.tableJSONMap)?prefs.tableJSONMap:{};
var indexOffset=(prefs.indexOffset)?prefs.indexOffset:0;
var columnCellCSS=prefs.columnCellCSS;
var columnIndex=(prefs.columnIndex)?prefs.columnIndex:0;
var tableRowId=prefs.JSONRowId;
var idInd=(tableRowId)?true:false;
var JSONList=prefs.JSONList;
var JSONRefAppendInd=prefs.JSONRefAppendInd;
var HideExistingCellDataInd=prefs.HideExistingCellDataInd;
var JSONRef=prefs.JSONRef;
var JSONRefCSS=prefs.JSONRefCSS;
var JSONRefHvr=prefs.JSONRefHvr;
var JSONRefHvrSticky=prefs.JSONRefHvrSticky;
var JSONRefHvrStickyTimeOut=prefs.JSONRefHvrStickyTimeOut;
var tempstr,tempcellDOM,curRowDOM,curCellDOM,cntr1,cnt1,cntr3,cnt3,cntr4,cnt4;
if(tableDOM&&TableLayout_RealTypeOf(tableDOM)==="object"){_.each(JSONList,function(JSONItem,JSONItemIndex){if(idInd){tempstr="";
if(TableLayout_RealTypeOf(tableRowId)=="array"){for(var cntr3=0,cnt3=tableRowId.length;
cntr3<cnt3;
cntr3++){if((JSONItem)[tableRowId[cntr3]]){tempstr+="_";
tempstr+=(JSONItem)[tableRowId[cntr3]];
}}}else{if((JSONItem)[tableRowId]){tempstr=(JSONItem)[tableRowId];
}}if(tempstr>""){curRowDOM=_g(tempstr);
tableJSONMap[tempstr]=cntr1+indexOffset;
if(TableLayout_RealTypeOf(curRowDOM)==="object"){if(curRowDOM.cells[columnIndex]){curCellDOM=curRowDOM.cells[columnIndex];
if(!JSONRefAppendInd||JSONRefAppendInd==0){curCellDOM.innerHTML="";
}if(HideExistingCellDataInd&&HideExistingCellDataInd==1){curCellDOM.innerHTML="<span style='display:none'>"+curCellDOM.innerHTML+"</span>";
}if(TableLayout_RealTypeOf(JSONRef)==="array"){for(cntr4=0,cnt4=JSONRef.length;
cntr4<cnt4;
cntr4++){if(String((JSONItem)[JSONRef[cntr4]])>" "){tempcellDOM=Util.ce("span");
if(JSONRefAppendInd&&JSONRefAppendInd==1){tempcellDOM.innerHTML+=(JSONItem)[JSONRef[cntr4]];
}else{tempcellDOM.innerHTML=(JSONItem)[JSONRef[cntr4]];
}if(JSONRefCSS&&JSONRefCSS[cntr4]&&JSONRefCSS[cntr4]>" "){tempcellDOM.className=JSONRefCSS[cntr4];
}else{if(columnCellCSS){tempcellDOM.className=columnCellCSS;
}}tempcellDOM=Util.ac(tempcellDOM,curCellDOM);
if(JSONRefHvr&&JSONRefHvr[cntr4]){UtilPopup.attachHover({elementDOM:tempcellDOM,event:"mousemove",sticky:JSONRefHvrSticky,stickyTimeOut:JSONRefHvrStickyTimeOut,displayTimeOut:"450",content:(JSONItem)[JSONRefHvr[cntr4]]});
}}}if(columnCellCSS){curCellDOM.className+=" "+columnCellCSS;
}}else{if(JSONRefAppendInd&&JSONRefAppendInd==1){curCellDOM.innerHTML+=(JSONItem)[JSONRef];
}else{curCellDOM.innerHTML=(JSONItem)[JSONRef];
}if(columnCellCSS){curCellDOM.className=columnCellCSS;
}}}}}}});
}return tableJSONMap;
},setFixedHeader:function(prefs){try{var fixedHeaderclassName=prefs.fixedHeaderclassName,scrollContainerNode=prefs.scrollContainerNode,fixedHeaderNode=prefs.fixedHeaderNode?prefs.fixedHeaderNode:Util.Style.g(fixedHeaderclassName,scrollContainerNode)[0],scrollFunction=function(e){var targ;
if(!e){var e=window.event;
}if(e.target){targ=e.target;
}else{if(e.srcElement){targ=e.srcElement;
}}if(targ.nodeType==3){targ=targ.parentNode;
}fixedHeaderNode.style.top=(targ.scrollTop-1)+"px";
};
fixedHeaderNode.style.position="relative";
fixedHeaderNode.style.display="block";
Util.addEvent(scrollContainerNode,"scroll",scrollFunction);
Util.addEvent(scrollContainerNode,"resize",scrollFunction);
}catch(err){alert("Error: TableLayout.setFixedHeader()");
}},destroy:function(){}};
}();
var TableSortable=function(prefs){var tableDOM=prefs.tableDOM,rowCSSName,row2CSSName,jsonObj=prefs.tableJSONMap,tableRowId=prefs.JSONRowId,jsonList=prefs.JSONList,toggleCmp=-1,jsonHandler=new UtilJsonXml();
function getVal(stype){switch(stype){case"numeric":return"-99999999999";
default:return"";
}}function sortTable(JSONRef,col,type){var rev=false,tempstr="",tempstr2="",tempind=0,tempind2=0,loopLength,cmpJSON=(JSONRef&&JSONRef>""&&jsonList)?true:false,imghtml,tmpEl,i,j,minVal,minIdx,testVal,cmp,cntr1,cnt1;
loopLength=cmpJSON==true?jsonList.length:tableDOM.rows.length;
for(i=0;
i<loopLength;
i++){minIdx=i;
if(!cmpJSON){if(tableDOM.rows[i].cells[col].childNodes&&tableDOM.rows[i].cells[col].childNodes[0]&&tableDOM.rows[i].cells[col].childNodes[0].innerHTML){minVal=tableDOM.rows[i].cells[col].childNodes[0].innerHTML;
}else{minVal=tableDOM.rows[i].cells[col].innerHTML;
}}else{if(jsonList[i]){minVal=(jsonList[i])[JSONRef];
}else{minVal=getVal(type);
jsonList[i]={};
jsonList[i][JSONRef]=minVal;
jsonList[i].TABLE_ROW_ID=tableDOM.rows[i].id;
}}for(j=i+1;
j<loopLength;
j++){if(!cmpJSON){if(tableDOM.rows[j].cells[col].childNodes&&tableDOM.rows[j].cells[col].childNodes[0]&&tableDOM.rows[j].cells[col].childNodes[0].innerHTML){testVal=tableDOM.rows[j].cells[col].childNodes[0].innerHTML;
}else{testVal=tableDOM.rows[j].cells[col].innerHTML;
}}else{if(jsonList[j]){testVal=(jsonList[j])[JSONRef];
}else{testVal=getVal(type);
(jsonList[j])={};
(jsonList[j])[JSONRef]=testVal;
jsonList[j]["TABLE_ROW_ID"]=tableDOM.rows[j].id;
}}cmp=compareValues(minVal,testVal,type);
cmp*=toggleCmp;
if(cmp>0){minIdx=j;
minVal=testVal;
}}if(minIdx>i){if(tableRowId){cntr1=0;
tempind=0;
tempind2=0;
cnt1=tableRowId.length;
if(jsonList[i].TABLE_ROW_ID){tempstr=jsonList[i].TABLE_ROW_ID;
tempind=1;
}else{tempstr="";
}if(jsonList[minIdx].TABLE_ROW_ID){tempstr2=jsonList[minIdx].TABLE_ROW_ID;
tempind2=1;
}else{tempstr2="";
}for(cntr1=0;
cntr1<cnt1;
cntr1++){if(tempind==0){tempstr+="_";
tempstr+=(jsonList[i])[tableRowId[cntr1]];
}if(tempind2==0){tempstr2+="_";
tempstr2+=(jsonList[minIdx])[tableRowId[cntr1]];
}}tmpEl=tableDOM.removeChild(_g(tempstr2));
tableDOM.insertBefore(tmpEl,_g(tempstr));
}else{tmpEl=tableDOM.removeChild(tableDOM.rows[minIdx]);
tableDOM.insertBefore(tmpEl,tableDOM.rows[i]);
}if(cmpJSON){tmpEl=jsonList.splice(minIdx,1);
jsonList.splice(i,0,tmpEl[0]);
}}}toggleCmp*=-1;
}function compareValues(v1,v2,type){if(type=="date"){var date1=v1.split("/");
var date2=v2.split("/");
var tempdate1=new Date();
var tempdate2=new Date();
var dttmdiff=new Date();
tempdate1.setFullYear(date1[2],date1[0]-1,date1[1]);
tempdate2.setFullYear(date2[2],date2[0]-1,date2[1]);
dttmdiff.setTime(tempdate1.getTime()-tempdate2.getTime());
timediff=dttmdiff.getTime();
days=Math.floor(timediff/(1000*60*60*24));
if(days>0){return 1;
}else{if(days==0){return 0;
}}}else{if(type=="numeric"){if(parseInt(v1)==parseInt(v2)){return 0;
}if(parseInt(v1)>parseInt(v2)){return 1;
}}else{if(v1==v2){return 0;
}if(v1>v2){return 1;
}}}return -1;
}return{sort:function(JSONRef,colIndex,sortType){sortTable(JSONRef,colIndex,sortType);
},sortMulti:function(us,u,vs,v,ws,w,xs,x,ys,y,zs,z){try{var loopLength=tableDOM.rows.length,i,j,jsonObj1,jsonObj2,tmpEl;
for(i=0;
i<loopLength;
i++){jsonObj1=jsonList[parseInt(jsonObj[tableDOM.rows[i].id])];
for(j=i+1;
j<loopLength;
j++){jsonObj2=jsonList[parseInt(jsonObj[tableDOM.rows[j].id])];
switch(Sortmulti(jsonObj1,jsonObj2)*toggleCmp){case -1:tmpEl=tableDOM.removeChild(tableDOM.rows[j]);
tableDOM.insertBefore(tmpEl,tableDOM.rows[i]);
break;
case 1:tmpEl=tableDOM.removeChild(tableDOM.rows[i]);
tableDOM.insertBefore(tmpEl,tableDOM.rows[j]);
break;
}}}toggleCmp*=-1;
}catch(e){alert("i -> "+i+"  j ->"+j+" jsonList.length - >"+jsonList.length+" jsonObj1['MICRO_FLAG'] ->"+jsonObj1[u]+" jsonObj2['MICRO_FLAG'] ->"+jsonObj2[u]);
}function Sortsingle(a,b){var swap=0;
if(isNaN(a-b)){if((isNaN(a))&&(isNaN(b))){swap=(b<a)-(a<b);
}else{swap=(isNaN(a)?1:-1);
}}else{swap=(a-b);
}return swap*us;
}function Sortmulti(a,b){var swap=0;
if(isNaN(a[u]-b[u])){if((isNaN(a[u]))&&(isNaN(b[u]))){swap=(b[u]<a[u])-(a[u]<b[u]);
}else{swap=(isNaN(a[u])?1:-1);
}}else{swap=(a[u]-b[u]);
}}}};
};
function SortIt(jsonList,us,u,vs,v,ws,w,xs,x,ys,y,zs,z){if(u==undefined){jsonList.sort(Sortsingle);
}else{jsonList.sort(Sortmulti);
}function Sortsingle(a,b){var swap=0;
if(isNaN(a-b)){if((isNaN(a))&&(isNaN(b))){swap=(b<a)-(a<b);
}else{swap=(isNaN(a)?1:-1);
}}else{swap=(a-b);
}return swap*us;
}function Sortmulti(a,b){var swap=0;
if(isNaN(a[u]-b[u])){if((isNaN(a[u]))&&(isNaN(b[u]))){swap=(b[u]<a[u])-(a[u]<b[u]);
}else{swap=(isNaN(a[u])?1:-1);
}}else{swap=(a[u]-b[u]);
}if((v==undefined)||(swap!=0)){return swap*us;
}else{if(isNaN(a[v]-b[v])){if((isNaN(a[v]))&&(isNaN(b[v]))){swap=(b[v]<a[v])-(a[v]<b[v]);
}else{swap=(isNaN(a[v])?1:-1);
}}else{swap=(a[v]-b[v]);
}if((w==undefined)||(swap!=0)){return swap*vs;
}else{if(isNaN(a[w]-b[w])){if((isNaN(a[w]))&&(isNaN(b[w]))){swap=(b[w]<a[w])-(a[w]<b[w]);
}else{swap=(isNaN(a[w])?1:-1);
}}else{swap=(a[w]-b[w]);
}if((x==undefined)||(swap!=0)){return swap*ws;
}else{if(isNaN(a[x]-b[x])){if((isNaN(a[x]))&&(isNaN(b[x]))){swap=(b[x]<a[x])-(a[x]<b[x]);
}else{swap=(isNaN(a[x])?1:-1);
}}else{swap=(a[x]-b[x]);
}if((y==undefined)||(swap!=0)){return swap*xs;
}else{if(isNaN(a[y]-b[y])){if((isNaN(a[y]))&&(isNaN(b[y]))){swap=(b[y]<a[y])-(a[y]<b[y]);
}else{swap=(isNaN(a[y])?1:-1);
}}else{swap=(a[y]-b[y]);
}if((z=undefined)||(swap!=0)){return swap*ys;
}else{if(isNaN(a[z]-b[z])){if((isNaN(a[z]))&&(isNaN(b[z]))){swap=(b[z]<a[z])-(a[z]<b[z]);
}else{swap=(isNaN(a[z])?1:-1);
}}else{swap=(a[z]-b[z]);
}return swap*zs;
}}}}}}}(function(){function q(a,c,d){if(a===c){return a!==0||1/a==1/c;
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
this.append_json=function(jObj){try{if(this.debug_mode_ind===1){cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** JSON Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_json_string=format_json(jObj,""),debug_string=debug_msg_hdr+debug_json_string;
try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return jObj;
}catch(e){error_handler(e.message,"append_json()");
}};
this.formatted_json=function(jObj){return format_json(jObj,"");
};
this.append_xml=function(xObj){try{if(this.debug_mode_ind===1){cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** XML Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_xml_string=format_xml(xObj),debug_string=debug_msg_hdr+debug_xml_string;
try{if(this.loggerExists()==true){log.ajax(debug_string);
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
if(spec.request.type==="XMLHTTPREQUEST"){if(spec.request.blobIn){requestAsync.open("POST",spec.request.target,asyncInd);
spec.request.parameters="parameters="+spec.request.parameters+"&blobIn="+spec.request.blobIn;
}else{requestAsync.open("GET",spec.request.target,asyncInd);
}if(!spec.request.parameters||spec.request.parameters===null||spec.request.parameters===""){requestAsync.setRequestHeader("Access-Control-Allow-Origin","*");
requestAsync.send(null);
}else{requestAsync.setRequestHeader("Content-type","application/x-www-form-urlencoded");
requestAsync.setRequestHeader("Content-length",spec.request.parameters.length);
requestAsync.setRequestHeader("Connection","close");
requestAsync.send(spec.request.parameters);
}}else{if(location.protocol.substr(0,4)==="http"&&location.href.indexOf("discern")>0){var pathAr=location.pathname.split("/");
var context_rt="";
if(pathAr.length){context_rt=pathAr[1];
}var url=location.protocol+"//"+location.host+"/"+context_rt+"/mpages/reports/"+spec.request.target+"?parameters="+spec.request.parameters;
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
requestAsync.setRequestHeader("Content-type","application/x-www-form-urlencoded");
}catch(e){alert(" requestAsync.setBlobIn not available");
}}else{requestAsync.open("GET",url,asyncInd);
}requestAsync.send(null);
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
var UtilPopup=(function(){var hoverPopupDOM=Util.cep("div",{className:"popup_hover"}),dragObj={},popupDOM=null,modalPopup=null,popupHeaderTextDOM=null,popupHeaderWrapDOM=null,popupHeaderDragDOM=null,popupContentDOM=null,popupHeaderExitDOM=null,popupConfirmButtonsWrapDOM=null,hideHoverFnc,displayTimeOut,hideTimeOut,currentDragNode=null,currentDragCloneNode=null,dragTimeOut;
var dragHolderNode=null;
function UtilPopup_mpo(e){var posx=0;
var posy=0;
if(!e){var e=window.event;
}if(e.pageX||e.pageY){posx=e.pageX;
posy=e.pageY;
}else{if(e.clientX||e.clientY){var bodyScrollLeft=0;
var bodyScrollTop=0;
if(document.body.scrollLeft){bodyScrollLeft=document.body.scrollLeft;
}if(document.body.scrolltop){bodyScrollTop=document.body.scrollTop;
}posx=e.clientX+bodyScrollLeft+document.documentElement.scrollLeft;
posy=e.clientY+bodyScrollTop+document.documentElement.scrollTop;
}}return[posy,posx];
}function UtilPopup_abs_mpo(e){var posx=0;
var posy=0;
if(!e){var e=window.event;
}if(e.pageX||e.pageY){posx=e.pageX;
posy=e.pageY;
}else{if(e.clientX||e.clientY){posx=e.clientX;
posy=e.clientY;
}}return[posy,posx];
}function getWindowScrollTop(){return(document.body.scrollTop+document.documentElement.scrollTop);
}function getWindowScrollLeft(){return(document.body.scrollLeft+document.documentElement.scrollLeft);
}function modalWindow(contents){var that="",iBlockr="",iframeBlock="",windowGeometry="",shim="",iebody="",dsocleft=0,dsoctop=0,blockrHeight=0,mcontents=contents;
iebody=(document.compatMode&&document.compatMode!="BackCompat")?document.documentElement:document.body;
dsocleft=document.all?iebody.scrollLeft:pageXOffset;
dsoctop=document.all?iebody.scrollTop:pageYOffset;
that=this;
mcontents.style.visibility="hidden";
this.width=mcontents.offsetWidth;
this.height=mcontents.offsetHeight;
iBlockr=Util.cep("div",{id:"div-iBlockr",className:"popup-modal-background"});
iframeBlock=Util.cep("iframe",{className:"popup-modal-background"});
windowGeometry=getWindowGeometry();
blockrHeight=parseInt(windowGeometry.bodyHeight);
iBlockr.style.height=blockrHeight+"px";
iframeBlock.style.height=iBlockr.style.height;
iframeBlock.style.background="";
iframeBlock.style.zIndex=1;
iBlockr.style.zIndex=2;
Util.ac(iBlockr,document.body);
Util.ac(iframeBlock,document.body);
setOpacity(iframeBlock,0.3);
setOpacity(iBlockr,0.3);
this.display=function(){window.currentModalWindow=that;
iBlockr.style.display="";
iBlockr.style.visibility="visible";
iframeBlock.style.display="";
iframeBlock.style.visibility="visible";
mcontents.style.display="";
mcontents.style.visibility="visible";
mcontents.style.zIndex=3000;
};
this.hide=function(){iBlockr.style.display="none";
iBlockr.style.visibility="hidden";
iframeBlock.style.display="none";
iframeBlock.style.visibility="hidden";
mcontents.style.display="none";
mcontents.style.visibility="hidden";
window.currentModalWindow=null;
};
}function setOpacity(elRef,value){elRef.style.opacity=value;
elRef.style.filter="alpha(opacity="+Math.round(value*100)+")";
}function getWindowGeometry(){var doc="",browserWidth="",browserHeight="",bodyWidth="",bodyHeight="",scrollX="",scrollY="";
try{doc=(!document.compatMode||document.compatMode=="CSS1Compat")?document.documentElement:document.body;
if(window.innerWidth){browserWidth=window.innerWidth;
browserHeight=window.innerHeight;
}else{browserWidth=doc.clientWidth;
browserHeight=doc.clientHeight;
}bodyWidth=Math.max(doc.scrollWidth,browserWidth);
bodyHeight=Math.max(doc.scrollHeight,browserHeight);
scrollX=(bodyWidth>browserWidth);
scrollY=(bodyHeight>browserHeight);
}catch(error){showErrorMessage(error.message,"getWindowGeometry");
}return{windowWidth:browserWidth,windowHeight:browserHeight,bodyWidth:bodyWidth,bodyHeight:bodyHeight,scrollX:scrollX,scrollY:scrollY};
}function dragStart(e,domObj){var el,x,y,e,startMousePosition=UtilPopup_mpo(e);
if(!e){e=window.event;
}dragObj.elNode=domObj;
x=UtilPopup_mpo(e);
y=x[0];
x=x[1];
dragObj.cursorStartX=x;
dragObj.cursorStartY=y;
dragObj.elStartLeft=dragObj.elNode.offsetLeft;
dragObj.elStartTop=dragObj.elNode.offsetTop;
document.onmousemove=dragGo;
document.onmouseup=dragStop;
Util.cancelBubble(e);
return false;
}function dragGo(e){var mpos,x,y,e;
if(!e){e=window.event;
}mpos=UtilPopup_mpo(e);
y=mpos[0];
x=mpos[1];
dragObj.elNode.style.left=(dragObj.elStartLeft+x-dragObj.cursorStartX)+"px";
dragObj.elNode.style.top=(dragObj.elStartTop+y-dragObj.cursorStartY)+"px";
checkDropContainers(mpos);
Util.cancelBubble(e);
}function dragStop(e){try{if(!e){e=window.event;
}var deleteNode;
if(dragTimeOut&&dragTimeOut!=null){clearTimeout(dragTimeOut);
}if(currentDragNode!=null&&dragHolderNode==null){Util.de(currentDragNode);
currentDragNode=null;
}else{if(dragHolderNode!=null&&currentDragNode!=null){currentDragNode.style.position="relative";
currentDragNode.style.top="0px";
currentDragNode.style.left="0px";
currentDragNode.style.width="100%";
currentDragNode.style.height="auto";
Util.removeEvent(currentDragNode,"mousedown",draggableHandlerFunction);
deleteNode=Util.ce("div");
deleteNode.innerHTML="x";
deleteNode.style.top="0px";
deleteNode.style.right="2px";
deleteNode.style.position="absolute";
deleteNode.style.fontWeight="bold";
deleteNode.style.display="block";
deleteNode.title="Click to remove item.";
deleteNode.style.cursor="hand";
Util.addEvent(deleteNode,"click",function(e2){Util.de(Util.gp(deleteNode));
});
currentDragNode.style.cursor="default";
deleteNode=Util.ac(deleteNode,currentDragNode);
Util.ia(currentDragNode,dragHolderNode);
Util.de(dragHolderNode);
dragHolderNode=null;
}}currentDragNode=null;
document.onmousemove=function(e){};
document.onmouseup=function(e){};
Util.cancelBubble(e);
}catch(err){alert(err.message+"--> UtilPopup.dragStop");
}}function displayModalPopup(popPrefs,popupType){var popupConfirmYesDOM,popupConfirmNoDOM,pageHeightWidth=Util.Pos.gvs();
if(popupDOM!=null){Util.de(popupDOM);
}popupDOM=Util.cep("div",{className:"popup-modal"});
popupContentDOM=Util.cep("div",{className:"popup-modal-content"});
popupHeaderWrapDOM=Util.cep("span",{className:"popup-modal-header-wrapper"});
popupHeaderTextDOM=Util.cep("span",{className:"popup-modal-header-text",title:"Click and Hold to move popup"});
popupHeaderExitDOM=Util.cep("span",{className:"popup-modal-header-exit",title:"Click to close popup"});
popupConfirmButtonsWrapDOM=Util.cep("span",{className:"popup-modal-buttons-wrapper"});
popupConfirmYesDOM=Util.cep("input",{type:"button",value:"Yes",className:"popup-modal-button"});
popupConfirmNoDOM=Util.cep("input",{type:"button",value:"No",className:"popup-modal-button"});
modalPopup=new modalWindow(popupDOM);
if(popupType=="MODAL_POPUP"){popupHeaderTextDOM=Util.ac(popupHeaderTextDOM,popupHeaderWrapDOM);
popupHeaderExitDOM=Util.ac(popupHeaderExitDOM,popupHeaderWrapDOM);
popupHeaderWrapDOM=Util.ac(popupHeaderWrapDOM,popupDOM);
popupContentDOM=Util.ac(popupContentDOM,popupDOM);
popupHeaderExitDOM.onclick=function(){modalPopup.hide();
};
if(popPrefs.exitFnc){popupHeaderExitDOM.onclick=function(){modalPopup.hide();
popPrefs.exitFnc;
};
}Util.addEvent(popupHeaderTextDOM,"mousedown",function(e){dragStart(e,popupDOM);
});
}else{if(popupType=="MODAL_CONFIRM"){popupHeaderTextDOM=Util.ac(popupHeaderTextDOM,popupHeaderWrapDOM);
popupHeaderTextDOM.style.width="100.00%";
popupHeaderWrapDOM=Util.ac(popupHeaderWrapDOM,popupDOM);
popupConfirmNoDOM=Util.ac(popupConfirmNoDOM,popupConfirmButtonsWrapDOM);
popupConfirmYesDOM=Util.ac(popupConfirmYesDOM,popupConfirmButtonsWrapDOM);
if(popPrefs.yes_no&&popPrefs.yes_no.length>0){if(popPrefs.yes_no[0]){popupConfirmYesDOM.value=popPrefs.yes_no[0];
}if(popPrefs.yes_no[1]){popupConfirmNoDOM.value=popPrefs.yes_no[1];
}else{popupConfirmNoDOM.style.display="none";
}}popupConfirmYesDOM.onclick=function(){modalPopup.hide();
popPrefs.onconfirm(true,popupContentDOM);
};
popupConfirmNoDOM.onclick=function(){modalPopup.hide();
popPrefs.onconfirm(false,popupContentDOM);
};
popupContentDOM=Util.ac(popupContentDOM,popupDOM);
popupConfirmButtonsWrapDOM=Util.ac(popupConfirmButtonsWrapDOM,popupDOM);
}else{popupContentDOM=Util.ac(popupContentDOM,popupDOM);
}}Util.ac(popupDOM,document.body);
if(popupType=="MODAL_POPUP"){popupHeaderTextDOM.innerHTML=(popPrefs.header)?popPrefs.header:"&nbsp;";
popupHeaderExitDOM.innerHTML=(popPrefs.exit)?popPrefs.exit:"x";
}if(popupType=="MODAL_CONFIRM"){popupHeaderTextDOM.innerHTML=(popPrefs.header)?popPrefs.header:"&nbsp;";
}if(popPrefs.defaultpos){if(popPrefs.defaultpos[0]){popupDOM.style.top=popPrefs.defaultpos[0];
}if(popPrefs.defaultpos[1]){popupDOM.style.left=popPrefs.defaultpos[1];
}}if(popPrefs.defaultpos){if(popPrefs.defaultpos[0]){popupDOM.style.top=popPrefs.defaultpos[0];
}if(popPrefs.defaultpos[1]){popupDOM.style.left=popPrefs.defaultpos[1];
}}else{var e=window.event;
var cursor={x:0,y:0};
if(e.pageX||e.pageY){popupDOM.style.top=e.pageY;
}else{var de=document.documentElement;
var b=document.body;
popupDOM.style.top=e.clientY+(de.scrollTop||b.scrollTop)-(de.clientTop||0);
}popupDOM.style.left="20%";
}if(popPrefs.width){popupDOM.style.width=popPrefs.width;
}var popchildNodes=Util.gcs(popupContentDOM),popchildNodeslen=popchildNodes.length,idx=0;
if(popupContentDOM.innerHTML>""){for(idx=0;
idx<popchildNodeslen;
idx++){Util.de(popchildNodes[idx]);
}popupContentDOM.innerHTML=" ";
}if(popPrefs.content){popupContentDOM.innerHTML=popPrefs.content;
}if(popPrefs.contentDOM){Util.ac(popPrefs.contentDOM,popupContentDOM);
}if(popPrefs.position&&popPrefs.position.toUpperCase()=="CENTER"){popupDOM.style.top=((Math.floor(parseInt(pageHeightWidth[0],10)/2)-Math.floor(parseInt(popupDOM.offsetHeight,10)/2)))+"px";
popupDOM.style.left=((Math.floor(parseInt(pageHeightWidth[1],10)/2)-Math.floor(parseInt(popupDOM.offsetWidth,10)/2)))+"px";
}if(popPrefs.position&&popPrefs.position.toUpperCase()=="HORIZONTAL-CENTER"){popupDOM.style.left=((Math.floor(parseInt(pageHeightWidth[1],10)/2)-Math.floor(parseInt(popupDOM.offsetWidth,10)/2)))+"px";
}modalPopup.display();
}function draggableHandler(e){try{var pos,childNodes,index,childNodesLength,childCloneNode,targ,dragNode;
if(e.target){targ=e.target;
}else{if(e.srcElement){targ=e.srcElement;
}}if(targ.nodeType==3){targ=targ.parentNode;
}while(targ.className.indexOf("draggable-element")==-1&&targ!=null){targ=Util.gp(targ);
}if(targ!=null){dragNode=targ;
if(dragNode.className.indexOf("draggable-clone")==-1){dragHolderNode=Util.ce("div");
dragHolderNode.style.width="100.00%";
dragHolderNode.style.height="auto";
dragHolderNode.style.border="1px dashed #000000";
dragHolderNode.className=dragNode.className;
Util.ia(dragHolderNode,dragNode);
}else{currentDragCloneNode=Util.ce(dragNode.tagName);
currentDragCloneNode.style.width="100.00%";
currentDragCloneNode.style.height="auto";
currentDragCloneNode.className=dragNode.className;
childNodes=Util.gcs(dragNode);
index=0;
childNodesLength=childNodes.length;
while(index<childNodesLength){childCloneNode=childNodes[index].cloneNode(true);
if(!!document.all&&childCloneNode.tagName.toUpperCase()!="TABLE"){childCloneNode.innerHTML=childNodes[index].innerHTML;
}Util.ac(childCloneNode,currentDragCloneNode);
index+=1;
}Util.addEvent(currentDragCloneNode,"mousedown",draggableHandlerFunction);
Util.ia(currentDragCloneNode,dragNode);
}dragNode.style.width=dragNode.offsetWidth+"px";
dragNode.style.height=dragNode.offsetHeight+"px";
dragNode.style.zIndex=99999;
dragNode.style.position="absolute";
dragNode.style.display="block";
dragNode.className=dragNode.className;
pos=UtilPopup_mpo(e);
if(dragNode.className.indexOf("draggable-inside-parent")==-1){dragNode=Util.ac(dragNode,document.body);
}dragNode.style.top=(pos[0]-(dragNode.offsetHeight/2))+"px";
dragNode.style.left=(pos[1]-(dragNode.offsetWidth/2))+"px";
currentDragNode=dragNode;
dragStart(e,dragNode);
}}catch(err){alert(err.message+"--> UtilPopup.draggableHandler");
}}function draggableHandlerFunction(e){if(!e){var e=window.event;
}var eventCopy={};
for(var i in e){eventCopy[i]=e[i];
}dragTimeOut=setTimeout(function(){draggableHandler(eventCopy);
},500);
}function checkDropContainers(mousepos){var droppableContainers=Util.Style.g("droppable-container"),droppableLength=droppableContainers.length,index,dims;
index=0;
while(index<droppableLength){dims=Util.Pos.gop(droppableContainers[index]);
dims[2]=dims[0]+droppableContainers[index].offsetHeight;
dims[3]=dims[1]+droppableContainers[index].offsetWidth;
if(mousepos[0]>=dims[0]&&mousepos[0]<=dims[2]&&mousepos[1]>=dims[1]&&mousepos[1]<=dims[3]){break;
}else{index+=1;
}}if(index<droppableLength){dropContainer=droppableContainers[index];
if(!e){var e=window.event;
}if(currentDragNode!=null){if(dragHolderNode!=null){Util.de(dragHolderNode);
}dragHolderNode=Util.ce("div");
dragHolderNode.style.width=dropContainer.offsetWidth+"px";
dragHolderNode.style.height=currentDragNode.offsetHeight+"px";
dragHolderNode.style.top="0px";
dragHolderNode.style.left="0px";
dragHolderNode.style.border="1px dashed #000000";
Util.ac(dragHolderNode,dropContainer);
}}}function getInternetExplorerVersion(){var rv=-1;
if(navigator.appName=="Microsoft Internet Explorer"){var ua=navigator.userAgent;
var re=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
if(re.exec(ua)!=null){rv=parseFloat(RegExp.$1);
}}return rv;
}return{getDragTimeOut:function(){return(dragTimeOut);
},attachHover:function(hvrPrefs){try{var objDOM=hvrPrefs.elementDOM,hoverAlign=hvrPrefs.align,objDOMPos=Util.Pos.gop(objDOM),objDOMScrollOffsets=hvrPrefs.scrolloffsets,offsets=hvrPrefs.offsets,position=hvrPrefs.position,dimensions=hvrPrefs.dimensions,showHoverFnc,hvrOutFnc=hvrPrefs.hvrOutFnc,hvrTxt=hvrPrefs.content,hvrTxtDOM=hvrPrefs.contentDOM,hvrRef=hvrPrefs.contentRef,stickyTimeOut=hvrPrefs.stickyTimeOut,displayHvr=hvrPrefs.displayHvr,highlightElement=hvrPrefs.highlightElement,highlightElementCSS=hvrPrefs.highlightElementCSS,stickyOut;
if(objDOMScrollOffsets&&objDOMScrollOffsets.length===2){objDOMPos[0]=objDOMPos[0]-objDOMScrollOffsets[0];
objDOMPos[1]=objDOMPos[1]-objDOMScrollOffsets[1];
}hideHoverFnc=function(e){clearTimeout(displayTimeOut);
clearTimeout(hideTimeOut);
hoverPopupDOM.style.visibility="hidden";
hoverPopupDOM.style.display="none";
if(hvrRef){hvrRef.innerHTML=hoverPopupDOM.innerHTML;
}if(hvrOutFnc){hvrOutFnc();
}if(highlightElement&&highlightElementCSS&&highlightElementCSS>" "){Util.Style.rcss(objDOM,highlightElementCSS);
}Util.cancelBubble(e);
if(hvrPrefs.onHideFnc){hvrPrefs.onHideFnc(hoverPopupDOM);
}};
if(hvrTxt>""||hvrRef||hvrTxtDOM){showHoverFnc=function(e,mousePosition){if(!e){e=window.event;
}var curMouseAbsolutePosition,curWindowDim=Util.Pos.gvs(),curMaxHeight,curMaxWidth,x,y;
if(!mousePosition||mousePosition==[]||mousePosition.length==0){curMouseAbsolutePosition=UtilPopup_abs_mpo(e);
}else{curMouseAbsolutePosition=mousePosition;
}if(highlightElement&&highlightElementCSS&&highlightElementCSS>" "){Util.Style.acss(objDOM,highlightElementCSS);
}if(hoverPopupDOM.parentNode==null){hoverPopupDOM=Util.ac(hoverPopupDOM,document.body);
}hoverPopupDOM.style.display="block";
if(hoverPopupDOM.innerHTML>""){Util.de(Util.gcs(hoverPopupDOM)[0]);
}if(getInternetExplorerVersion()<7){curWindowDim[0]=curWindowDim[0]-50;
curWindowDim[1]=curWindowDim[1]-50;
}x=curMouseAbsolutePosition[1];
y=curMouseAbsolutePosition[0];
hoverPopupDOM.style.width="auto";
hoverPopupDOM.style.height="auto";
if(hvrRef){hoverPopupDOM.innerHTML=hvrRef.innerHTML;
}else{if(hvrTxt){hoverPopupDOM.innerHTML=hvrTxt;
}else{hoverPopupDOM.innerHTML="";
hvrTxtDOM=Util.ac(hvrTxtDOM,hoverPopupDOM);
}}if(dimensions){hoverPopupDOM.style.width=dimensions[1]?(dimensions[1]+"px"):"auto";
hoverPopupDOM.style.height=dimensions[0]?(dimensions[0]+"px"):"auto";
}if(hoverPopupDOM.offsetHeight>curWindowDim[0]){curMaxHeight=(y-hoverPopupDOM.offsetHeight>y)?y-hoverPopupDOM.offsetHeight:y;
hoverPopupDOM.style.height=(curMaxHeight-10)+"px";
}if(hoverPopupDOM.offsetWidth>curWindowDim[1]){curMaxWidth=(x-hoverPopupDOM.offsetWidth>x)?x-hoverPopupDOM.offsetWidth:x;
hoverPopupDOM.style.width=(curMaxWidth-10)+"px";
}if(!offsets){offsets=[0,0];
}if(position&&position.length==2){x+=position[1];
y+=position[0];
}else{if(y+hoverPopupDOM.offsetHeight>curWindowDim[0]){y=(y-hoverPopupDOM.offsetHeight-5-offsets[0]);
}else{y+=5+offsets[0];
}if(x+hoverPopupDOM.offsetWidth>curWindowDim[1]){x=(x-hoverPopupDOM.offsetWidth-5-offsets[1]);
}else{x+=5+offsets[1];
}}if(hoverAlign){switch(hoverAlign){case"up-horizontal":x=(objDOMPos[1]);
if(hoverPopupDOM.offsetHeight>objDOMPos[0]){y=0;
hoverPopupDOM.style.height=(objDOMPos[0]-5);
}else{y=(objDOMPos[0]-hoverPopupDOM.offsetHeight);
}break;
case"down-horizontal":x=(objDOMPos[1]);
if(hoverPopupDOM.offsetHeight>objDOMPos[0]){y=0;
}else{y=(objDOMPos[0]-hoverPopupDOM.offsetHeight);
}break;
}}hoverPopupDOM.style.top=(y+getWindowScrollTop())+"px";
hoverPopupDOM.style.left=(x+getWindowScrollLeft())+"px";
if(hvrPrefs.position&&hvrPrefs.position.toUpperCase()=="HORIZONTAL-CENTER"){x=curMouseAbsolutePosition[1];
if(x<=Math.floor(parseInt(hoverPopupDOM.offsetWidth,10)/2)){x=0;
}else{x=x-Math.floor(parseInt(hoverPopupDOM.offsetWidth,10)/2);
}hoverPopupDOM.style.left=x+"px";
}if(hvrPrefs.onDisplayFnc){hvrPrefs.onDisplayFnc(hoverPopupDOM);
}hoverPopupDOM.style.visibility="visible";
};
if(displayHvr===undefined){if(hvrPrefs.displayTimeOut>" "){hvrPrefs.displayTimeOut=parseInt(hvrPrefs.displayTimeOut,10);
}else{hvrPrefs.displayTimeOut=0;
}if(hvrPrefs.displayTimeOut==0){Util.addEvent(objDOM,hvrPrefs.event,function(showHoverEvent){showHoverFnc(showHoverEvent,[]);
});
}else{Util.addEvent(objDOM,hvrPrefs.event,function(showHoverEvent){if(!showHoverEvent){showHoverEvent=window.event;
}var mousePosition=UtilPopup_mpo(showHoverEvent);
clearTimeout(displayTimeOut);
displayTimeOut=setTimeout(function(){showHoverFnc(showHoverEvent,mousePosition);
},hvrPrefs.displayTimeOut);
});
}}else{showHoverFnc(displayHvr,[]);
}if(hvrPrefs.sticky&&(hvrPrefs.sticky==1||hvrPrefs.sticky==true)){if(!displayHvr){stickyOut="mouseleave";
stickyTimeOut=(stickyTimeOut&&parseInt(stickyTimeOut)>0)?stickyTimeOut:200;
Util.addEvent(objDOM,"mouseleave",function(mouseLeaveEvent){hideTimeOut=setTimeout(hideHoverFnc,stickyTimeOut);
Util.cancelBubble(mouseLeaveEvent);
Util.preventDefault(mouseLeaveEvent);
});
}Util.addEvent(hoverPopupDOM,"mouseenter",function(mouseEnterEvent){clearTimeout(hideTimeOut);
Util.addEvent(hoverPopupDOM,"mouseleave",hideHoverFnc);
Util.cancelBubble(mouseEnterEvent);
Util.preventDefault(mouseEnterEvent);
});
}else{Util.addEvent(objDOM,"mouseout",hideHoverFnc);
}}}catch(err){alert(err.message+"--> UtilPopup.attachHover");
}},attachModalPopup:function(popPrefs){var that=this;
Util.addEvent(popPrefs.elementDOM,popPrefs.event,function(){displayModalPopup(popPrefs,"MODAL_POPUP");
});
},hideHover:function(e){clearTimeout(displayTimeOut);
clearTimeout(hideTimeOut);
hoverPopupDOM.style.visibility="hidden";
hoverPopupDOM.style.display="none";
if(e!=null&&e!=undefined){Util.cancelBubble(e);
}},launchModalPopup:function(popPrefs){displayModalPopup(popPrefs,"MODAL_POPUP");
},launchModalDialog:function(popPrefs){displayModalPopup(popPrefs,"MODAL_DIALOG");
},launchModalConfirmPopup:function(popPrefs){displayModalPopup(popPrefs,"MODAL_CONFIRM");
},closeModalDialog:function(){modalPopup.hide();
popupDOM=null;
},closeModalPopup:function(){modalPopup.hide();
},initializeDragDrop:function(parentNode){if(!parentNode){parentNode=document.body;
}var draggableElements=Util.Style.g("draggable-element",parentNode),draggableLength=draggableElements.length,index;
index=0;
document.onmousemove=function(e){};
document.onmouseup=function(e){};
while(index<draggableLength){Util.addEvent(draggableElements[index],"mousedown",draggableHandlerFunction);
index+=1;
}}};
}());
/**
 * @fileoverview
 * <strong>wklst-core-driver.js</strong>
 * <p>
 * This file contains the MpageDriver object implementing the core functionality of the worklist mpage framework.
 * MpageDriver provides methods to render/manage the layout and other components of a worklist mpage.
 * </p>
 * <p>
 * This file contains a utility object, MpageDriver, to handle the display of worklist.
 * </p>
 * Copyright 2011. Cerner Corporation
 * @author Innovations Development
 */

/**
 * This singleton encapsulates all utility methods for rendering/manage the different components of worklist mpage framework.
 * @namespace MpageDriver
 * @static
 * @global
 */
var MpageDriver = function() {
    var MPAGETABLECOLUMNS = [];
    var autoInitiateMpage = true;
    var dataNames = {};
    var rowIdentifiers =  ["PERSON_ID", "ENCNTR_ID"];
    var extraRow = false;
    var parentRowClass = "PARENT-ROW";
    var childRowClass = "CHILD-ROW";
    var attributeIdentifiers = [];
    var expandCollLinksCreated = false;
    var customTabsCreateMethod = null;
    var listDOM = Util.cep("select", {
        "size" : "1",
        "selectedIndex" : "0"
    }), PatientListSelectRowNode, selectedPatientListID = 0.0, currentPtLists = "", storedPtLists = "", curselectedRow = null, selectedPatientGrpDtTm;
    var selectedPatientListDtTm, totalPtCnt, LoadedPtCnt, totalPtGroupCnt, LoadedPtGroupCnt, selectedTabSeq = 0, ptListIndex = 0, curLoadColumns = 0;
    var loadingDisplay, loadingGroupDisplay, moveListWrapper, curActiveSubTab, curActiveSubTabContentDOM, curActiveSubTabDOM;
    var curActiveSubTabSeq, divtag, prefList, criterion = {}, curTabPtsCnt, footerDiv = Util.cep("div", {
        "className" : "pageFooter"
    });
    var curTabPtsTotal, ptGroupSize = 5, ptListData = {}, layoutPrefs = null, filter_script_name = "", filter_all_script_name = "", display_disclaimer = true;
    var primary_tabs = [], observers = {};
    var tabViewers = {};
    var pageContainer = null;
    var worklistSorting = {};
    var curActiveTableColumns = [];
    var curSortedHeaderClass = "";
    var saveSessionSortingInd = false;
    var listLoadingIconInd = false;
	var AjaxIconHTML = '<span valign="top"><span class="ajax-loader"></span></span>';
    
    /**
     * Notify Observers on a component
     * @param {String} event Name of event attached to observers
     *       {Object} data Data passed as parameter to observer functions
     */
    function notifyObservers(event, data) {
        var group = observers[event];
        if(group) {
            for(var i = 0, ilen = group.length; i < ilen; i++) {
                group[i](data);
            }
        }
    };
    

    /* Unload parameters from url
     * */
    function unloadParams() {
        try {
            var cur_params = window.location.search.replace(/%20/g, " ").split("?").join("").split(",");
            var cclParams = "^MINE^";
        	// Get Application and Personnel details
    		AjaxHandler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : "inn_mp_get_app_prsnl",
					parameters : cclParams,
					synchronous: true
				},
				response : {
					type : "JSON",
					target : function(scriptResponse){
						var recordData = scriptResponse.response.RECORD_DATA;
						// set criterion values if empty/not specified
						if(criterion.application_id == 0){		
				        	criterion.application_id = recordData.APPLICATION_NBR;
				        }
				        if(criterion.personnel_id == 0){		
				        	criterion.personnel_id = recordData.PERSONNEL_ID;
				        }
				        if(criterion.position_cd == 0){					        	
				        	criterion.position_cd = recordData.PERSONNEL_POSITION_CD;
				        }
        				// set criterion values based on parameters
						setCriterion(cur_params);
					}
				}
			});
        } catch (e) {
            errmsg(e.message, "unloadParams()");
        }
    }

    // Initialize criterion attributes
	function initializeCriterion() {
        criterion.br_topic_mean = "";
        criterion.params = "";
        criterion.position_cd = 0;
        criterion.application_id = 0;
        criterion.personnel_id = 0;
        criterion.debug_mode_ind = 0;        
        criterion.list_source_name = ""
        criterion.list_source_script = "";
        criterion.list_source_pts_script = "";
    }
    
    function setCriterion(cur_params) {
    	
    	// set position or application number
    	if(cur_params[1]){
        	criterion.position_cd = parseFloat(cur_params[1]);
        	criterion.application_id = parseFloat(cur_params[1]);
		}
		// set the personnel id
    	if(cur_params[2]){
        	criterion.personnel_id = parseFloat(cur_params[2]);
       	}
       	
       	// set the debug mode
    	if(cur_params[3]){
       		criterion.debug_mode_ind = parseInt(cur_params[3]);
       	}
        
        if(criterion.debug_mode_ind > 0) {
            AjaxHandler.setDebugMode(criterion.debug_mode_ind);
        }
        AjaxHandler.trim_float_zeros(false);
    }

    function mpo(e) {
        var posx = 0;
        var posy = 0;
        if(!e)
            var e = window.event;
        if(e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if(e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return [posy, posx];
    }

    function getPreference(prefsList, prefIdField, prefId) {
        for(var j = 0, plen = prefsList.length; j < plen; j++) {
            if(((prefsList[j])[prefIdField]) == prefId) {
                return prefsList[j];
            }
        }
        return null;
    }
    
    function triggerFinishedLoadNotifications(loadedTabMeaning){
		// Trigger any notifications
        // for multiple tabs => trigger event tab finished loading
        if(prefList.TABS.length > 1){
            notifyObservers("tab-finished-loading-"+loadedTabMeaning, {
                "currentTab":loadedTabMeaning,
                "currentTableNode" : (_g("TABLE_" + loadedTabMeaning)),
                "currentListData" : ptListData[loadedTabMeaning]
            });
        }                
        // for a table without tabs
        else{
            notifyObservers("list-finished-loading", {
                "currentTableNode" : (_g("TABLE_" + loadedTabMeaning)),
                "currentListData" : ptListData[loadedTabMeaning]
            });
        }
    }

    function subtabLoadMethod(tabmean, parentTab, tabSeq) {
        return (function(tabContainer) {
            var ptCnt, cur_ptcnt, curPtList = {}, i = 0;
            var tabViewMethod = tabViewers[tabmean];
            var filteringScript = "";
			var sourcePtsScript = "";
			var cclParam = "";
			var selectionsJSON = "";
            curActiveSubTab = tabmean;
            curActiveSubTabContentDOM = tabContainer;
            curActiveSubTabDOM = parentTab;
            curActiveSubTabSeq = tabSeq;
            resizePage();
            AjaxHandler.append_text(" ptListData[curActiveSubTab] JSON <br/>")
            AjaxHandler.append_json(ptListData[curActiveSubTab]);
            selectedTabSeq = tabSeq;
            // a tab viewer method was defined
            if(tabViewMethod && _.isFunction(tabViewMethod)){
                tabViewMethod(tabContainer,ptListData[curActiveSubTab], parentTab, tabSeq);
            }
            else{
                if(ptListData[curActiveSubTab]) {
                	// If tab loading for first time -> retrieve patients
                	if(!ptListData[curActiveSubTab].LOADED){ 
            		 	//if loading icon is specified -> Hide table and append the loading icon to display
                        if(listLoadingIconInd){
							$("#TAB_CONTENT_"+curActiveSubTab).append("<div class='centered-icon list-loading-icon'><img src='../img/preloader_32.gif' /></div>");
                        }               		
                		selectedPatientListDtTm = new Date();
						filteringScript = getTabFilteringScript(curActiveSubTabSeq);
						sourcePtsScript = getTabSourcePatientsScript(curActiveSubTabSeq);
						selectionsJSON =  WorklistSelection.getSelectionsJSON();
						cclParam = ["^MINE^,@",(selectionsJSON.length),":",selectionsJSON, "@,^", criterion.application_id, "^,^", criterion.personnel_id, "^,^", filteringScript, "^,^", criterion.br_topic_mean, "^,^", sourcePtsScript, "^"].join("");
						MpageDriver.setselectedPatientListDtTm(selectedPatientListDtTm);
						AjaxHandler.ajax_request({
							request : {
								type : "XMLCCLREQUEST",
								target : "inn_mp_get_wklst_patients",
								parameters : cclParam
							},
							loadingDialog : {
								targetDOM : _g("WorklistLoading"),
								content : '<span valign="top" class="WLLoadText"><b>' + i18n.LOADING_GROUPS + "</b></span>" + AjaxIconHTML
							},
							response : {
								type : "JSON",
								target : MpageDriver.loadPtList,
								parameters : [selectedPatientListDtTm]
							}
						});
                	}
                }
            }

        });
    }

    function getTableData(tablePrefs) {
        var idx = 0, len = tablePrefs.length, i = 0, il = 0, tableColumns = [], tableHeaders = [], tableHeadersCSS = [];
        for( idx = 0; idx < len; idx++) {
            tableColumns[idx] = getMpageTableColumn(tablePrefs[idx].MEANING);
            if(tableColumns[idx] === null) {
                tableHeaders[idx] = "< undefined >";
                tableHeadersCSS[idx] = "";
            } else {
                tableHeadersCSS[idx] = tableColumns[idx].cssClass;
                if(tablePrefs[idx].TITLE > " ") {
                    tableHeaders[idx] = "<span> " + tablePrefs[idx].TITLE + "</span> ";
                } else {
                    tableHeaders[idx] = tableColumns[idx].title;
                }
            }
        }
        return ( {
            "tableColumns" : tableColumns,
            "tableHeaders" : tableHeaders,
            "tableHeadersCSS" : tableHeadersCSS
        });
    }

    function getMpageTableColumn(columnmean) {
        var idx = 0, len = MPAGETABLECOLUMNS.length, curMpageTableColumn;
        for( idx = 0; idx < len; idx++) {
            curMpageTableColumn = MPAGETABLECOLUMNS[idx].column;
            if(curMpageTableColumn.meaning === columnmean) {
                return curMpageTableColumn;
            }
        }
        return null;
    }

    function sortbylistseq(input1, input2) {
        return ((input1.LISTSEQ < input2.LISTSEQ) ? -1 : ((input1.LISTSEQ > input2.LISTSEQ) ? 1 : 0));
    }

    function getPtsReq(jsonData, beginIndex, endIndex) {
        var index = beginIndex, paramStr = [];
        var curPtReq;
        beginIndex = parseInt(beginIndex, 10);
        endIndex = parseInt(endIndex, 10);
        while(index < endIndex) {
            curPtReq = jsonData.QUAL[index];
            if(index > beginIndex) {
                paramStr[paramStr.length] = ",";
            }
            paramStr[paramStr.length] = "{";
            paramStr[paramStr.length] = '"PERSON_ID" : '+parseFloat(curPtReq.PERSON_ID).toFixed(2)+' ,';
            paramStr[paramStr.length] = '"ENCNTR_ID" : '+parseFloat(curPtReq.ENCNTR_ID).toFixed(2)+' ,';
            paramStr[paramStr.length] = '"NAME_FULL_FORMATTED" : "'+curPtReq.NAME_FULL_FORMATTED.encodeStringDelimiters()+'" ,';
            paramStr[paramStr.length] = '"BIRTH_DT_TM" : "'+curPtReq.BIRTH_DT_TM+'" ,';
            paramStr[paramStr.length] = '"BIRTH_DT_TM_DISP" : "'+curPtReq.BIRTH_DT_TM_DISP+'" ,';
            paramStr[paramStr.length] = '"ENCNTR_CNT" : '+parseInt(curPtReq.ENCNTR_CNT)+' ,';
            paramStr[paramStr.length] = '"ENCNTRS" : [';
            _.each(curPtReq.ENCNTRS,function(ptEnc,index){  
                if(index > 0){
                    paramStr[paramStr.length] = ",";
                }                   
                paramStr[paramStr.length] = "{";
                paramStr[paramStr.length] = '"ENCNTR_ID" : '+parseFloat(ptEnc.ENCNTR_ID).toFixed(2)+' ,';
                paramStr[paramStr.length] = '"ENCNTR_TYPE_CD" : '+parseFloat(ptEnc.ENCNTR_TYPE_CD).toFixed(2)+' ,';
                paramStr[paramStr.length] = '"ENCNTR_CLASS_CD" : '+parseFloat(ptEnc.ENCNTR_CLASS_CD).toFixed(2)+' ,';
                paramStr[paramStr.length] = '"ACTIVE_IND" : '+parseInt(ptEnc.ACTIVE_IND)+' ,';
                paramStr[paramStr.length] = '"ARRIVE_DT_TM" : "'+ptEnc.ARRIVE_DT_TM+'" ,';
                paramStr[paramStr.length] = '"REG_DT_TM" : "'+ptEnc.REG_DT_TM+'" ,';
                paramStr[paramStr.length] = '"BEG_EFFECTIVE_DT_TM" : "'+ptEnc.BEG_EFFECTIVE_DT_TM+'" ,';
                paramStr[paramStr.length] = '"DISCH_DT_TM" : "'+ptEnc.DISCH_DT_TM+'"';
                paramStr[paramStr.length] = "}";
            });         
            paramStr[paramStr.length] = "],";
            paramStr[paramStr.length] = '"ATTRIBUTE_CNT" : '+parseInt(curPtReq.ATTRIBUTE_CNT)+' ,';
            paramStr[paramStr.length] = '"ATTRIBUTES" : [';
            _.each(curPtReq.ATTRIBUTES,function(ptAttr,index){  
                if(index > 0){
                    paramStr[paramStr.length] = ",";
                }           
                paramStr[paramStr.length] = "{";
                paramStr[paramStr.length] = '"MEANING" : "'+ptAttr.MEANING.encodeStringDelimiters()+'" ,';
                paramStr[paramStr.length] = '"DISPLAY_VALUE" : "'+ptAttr.DISPLAY_VALUE.encodeStringDelimiters()+'" ,';
                paramStr[paramStr.length] = '"DT_TM_VALUE" : "'+ptAttr.DT_TM_VALUE+'" ,';
                paramStr[paramStr.length] = '"NUMERIC_VALUE" : '+parseFloat(ptAttr.NUMERIC_VALUE).toFixed(4);
                paramStr[paramStr.length] = "}";
            });         
            paramStr[paramStr.length] = "]";
            paramStr[paramStr.length] = "}";
            
            AjaxHandler.stringify_json(jsonData.QUAL[index]);
            index++;
        }
        paramStr = "{\"patients\":{\"cnt\":" + (endIndex - beginIndex) + ",\"qual\":[" + (paramStr.join("")) + "]}}";
        return (paramStr);
    }

    // Function to display move patient menu
    function showMoveMenu(e, rowDOM) {
        if(!e)
            e = window.event;
        if(e) {
            displayMoveMenu(e, rowDOM, rowDOM, "contextmenu", null)
        }
        Util.Style.acss(rowDOM, "rowFocus");
        return false;
    }

    function focusRow(e, rowDOM) {
        Util.Style.acss(rowDOM, "rowFocus");
    }

    function unFocusRow(e, rowDOM) {
        if(curselectedRow !== rowDOM) {
            Util.Style.rcss(rowDOM, "rowFocus");
        }
    }

    function selectRow(e, rowDOM) {
        if(curselectedRow !== null) {
            Util.Style.rcss(curselectedRow, "rowFocus");
        }
        curselectedRow = rowDOM;
        moveListWrapper.disabled = false;
        Util.Style.acss(rowDOM, "rowFocus");
    }

    function formatDateJSON(unformattedJSON) {
        var formattedJSON;
        formattedJSON = unformattedJSON.split('"/Date(').join('"\\/Date(');
        formattedJSON = formattedJSON.split(')/"').join(')\\/"');
        return (formattedJSON)
    }
    
    function nonEmptyString(testString) {
        var returnValue = false;
        if(!_.isUndefined(testString)) {
            if(!_.isEmpty(testString)) {
                if(_.isString(testString)) {
                    returnValue = true;
                }
            }
        }
        return (returnValue)
    }

    function nonEmptyArray(testArray) {
        var returnValue = false;
        if(!_.isUndefined(testArray)) {
            if(!_.isEmpty(testArray)) {
                if(_.isArray(testArray)) {
                    returnValue = true;
                }
            }
        }
        return (returnValue)
    }
        
    function unSelectRow(e, rowDOM) {
        var cur_mpos = mpo(e), movelist_pos = Util.Pos.gop(moveListWrapper);
        if(cur_mpos[0] > (movelist_pos[0] + moveListWrapper.offsetHeight) || cur_mpos[1] > (movelist_pos[1] + moveListWrapper.offsetWidth) || cur_mpos[0] < movelist_pos[0] || cur_mpos[1] < movelist_pos[1]) {
            Util.Style.rcss(curselectedRow, "rowFocus");
            curselectedRow = null;
            moveListWrapper.disabled = true;
        }
    }

    function showLoadingDialog() {
        loadingDisplay.innerHTML = i18n.LOADING_DIALOG + "<span class='ajax-loader'></span>"
        moveListWrapper.style.display = "none";
    }

    function hideLoadingDialog() {
        loadingDisplay.innerHTML = " ";
        loadingDisplay.style.display = "none";
        moveListWrapper.style.display = "";
    }

    function showGroupLoadingDialog() {
        loadingGroupDisplay.innerHTML = i18n.LOADING_GROUPS + "<span class='ajax-loader'></span>";
        moveListWrapper.style.display = "none";
    }

    function hideGroupLoadingDialog() {
        loadingGroupDisplay.innerHTML = " ";
        loadingGroupDisplay.style.display = "none";
    }

    function sortTextExtraction(node, curColumn) {
        var columnSortSelection = curColumn.getCurrentSortSelection, return_str = "";
        if(columnSortSelection && columnSortSelection != undefined) {
            return_str = curColumn.getCurrentSortSelection(node);
        } else {
            return_str = node.innerHTML;
        }
        if(return_str == undefined || return_str == null) {
            return_str = "";
        }
        return return_str;
    }

    // Function check if a column is defined as sortable
    function isColumnSortable(columnSequence, column) {
        var columnSort = {};
        if(column.isSortable == undefined || (column.isSortable && !column.isSortable())) {
            columnSort["sorter"] = false;
        }
        return (columnSort);
    }

    // Function get sortable columns
    function getSortableColumns(tableColumns) {
        var sortPreferences = {}, cntr = 0, len, columnSortable;
        for( cntr = 0, len = tableColumns.length; cntr < len; cntr++) {
            columnSortable = isColumnSortable(cntr, tableColumns[cntr]);
            if(columnSortable != {}) {
                sortPreferences[parseInt(cntr, 10)] = columnSortable;
            }
        }
        return (sortPreferences);
    }

    // Function check if a column is defined as default sortable
    function isColumnDefaultSortable(columnSequence, column) {
        var columnDefaultSort = [], defaultSortOrder = null;
        if(column.isDefaultSortable && column.isSortable && column.isSortable() && column.getDefaultSortOrder) {
            defaultSortOrder = column.getDefaultSortOrder();
        }
        if(defaultSortOrder != null) {
            columnDefaultSort.push(columnSequence);
            columnDefaultSort.push(defaultSortOrder);

        }
        return (columnDefaultSort);
    }

    function getDefaultSortedColumns(tableColumns) {
        var sortPreferences = [], cntr = 0, len, columnDefaultSort;
        for( cntr = 0, len = tableColumns.length; cntr < len; cntr++) {
            columnDefaultSort = isColumnDefaultSortable(cntr, tableColumns[cntr]);
            if(columnDefaultSort.length == 2) {
                sortPreferences.push(columnDefaultSort);
            }
        }
        return (sortPreferences);
    }

    function findPatientAttribute(patientData, attributeMeaning) {
        try {
            var cntr = 0, len = patientData.ATTRIBUTES.length;
            for( cntr = 0; cntr < len; cntr++) {
                if(patientData.ATTRIBUTES[cntr].MEANING == attributeMeaning) {
                    return (patientData.ATTRIBUTES[cntr]);
                }
            }
        } catch(e) {
            alert(e.message + "findPatientAttribute");
        }
        return null;
    }

    function tabExists(tabMeaning) {
        var cntr = 0, len;
        for( cntr = 0, len = primary_tabs.length; cntr < len; cntr++) {
            if(primary_tabs[cntr] == tabMeaning) {
                return true;
            }
        }
        return false;
    }
    
    function getTabByColumn(columnMeaning){
    	var tabMeaning = "";
    	// Find the tab if layout is defined and multiple tabs are present 
    	if(layoutPrefs && layoutPrefs.LAYOUT && layoutPrefs.TABS && layoutPrefs.TABS.length > 1){
	    	_.each(layoutPrefs.LAYOUT.TABS,function(currentTab){
	    		_.each(currentTab.COLUMNS,function(currentColumn){
	    			// matching column defined in layout
	    			if(currentColumn.MEANING == currentTab){
	    				tabMeaning = currentTab.MEANING;
	    			}
	    		});
	    	});
    	}
    	else{
    		tabMeaning = curActiveSubTab;
    	}
    	return(tabMeaning)
    }

    function organizeTabPatients(patientGroupData,selectedTab) {
        try {
            var cntr = 0, len, currentPrimaryTab, curPtGroupData = {};
            curPtGroupData.PT_CNT = 0;
            curPtGroupData.QUAL = [];
            for( cntr = 0, len = patientGroupData.QUAL.length; cntr < len; cntr++) {
                patientTabAttribute = findPatientAttribute(patientGroupData.QUAL[cntr], "PRIMARY_TAB");
                //If a patient tab attribute was specified
                if(patientTabAttribute != null) {
                    patientPrimaryTab = patientTabAttribute.DISPLAY_VALUE;
                }
                // If a default tab was specified => move all patients to default tab
                if(tabExists("DEFAULT_TAB")) {
                    patientPrimaryTab = "DEFAULT_TAB";
                }
                // Add patients to tab list if patients were selected from the specified tab
                if(patientPrimaryTab > " " && ptListData[patientPrimaryTab] && patientPrimaryTab == selectedTab) {
                    ptListData[patientPrimaryTab].PT_CNT += 1;
                    ptListData[patientPrimaryTab].QUAL.push(patientGroupData.QUAL[cntr]);
                    if(patientPrimaryTab == curActiveSubTab) {
                        curPtGroupData.PT_CNT += 1;
                        curPtGroupData.QUAL.push(patientGroupData.QUAL[cntr]);
                    }
                }
            }
        } catch(e) {
            alert(e.message + "organizeTabPatients");
        }
        return (curPtGroupData);
    }

    function resetPatientListData() {
        try {
            ptListData = {};
            ptListData.PT_CNT = 0;
            ptListData.PT_LOADED_CNT = 0;
            ptListData.QUAL = [];
            var cntr = 0, len, currentPrimaryTab;
            for( cntr = 0, len = primary_tabs.length; cntr < len; cntr++) {
                currentPrimaryTab = primary_tabs[cntr];
                ptListData[currentPrimaryTab] = {};
                ptListData[currentPrimaryTab].LOADED = false;
                ptListData[currentPrimaryTab].PT_CNT = 0;
                ptListData[currentPrimaryTab].PT_LOADED_CNT = 0;
                ptListData[currentPrimaryTab].QUAL = [];
            }
        } catch(e) {
            alert(e.message + "resetPatientListData");
        }
    }

    function updateTabHeaders() {
        try {
            var cntr = 0, len, currentPrimaryTab, tabHeaderNode, tabHTML;
            for( cntr = 0, len = primary_tabs.length; cntr < len; cntr++) {
                currentPrimaryTab = primary_tabs[cntr];
                tabHeaderNode = _g("TAB_HEADER_" + currentPrimaryTab);
                if(tabHeaderNode && tabHeaderNode !== null && currentPrimaryTab != "DEFAULT_TAB") {
					tabHTML = i18n[currentPrimaryTab];
					// if tab loaded -> show total patient count
					if(ptListData[currentPrimaryTab].LOADED){
						tabHTML += "<span class=\"sec-total\">(" + parseInt(ptListData[currentPrimaryTab].PT_CNT, 10) + ")</span>";
					}
					// else add a blank placeholder element
					else{
						tabHTML += "<span class=\"sec-total\"></span>";
					}
					tabHeaderNode.innerHTML = tabHTML;
                }
            }
        } catch(e) {
            alert(e.message + "updateTabHeaders");
        }
    }
    
    function setExtraRow(rowVal){
        extraRow = rowVal;
    }
    
    function setParentRowClass(parentClass){
        parentRowClass = parentClass;
    }
    
    function setChildRowClass(childClass){
        childRowClass = childClass;
    }
    
    function getExtraRow(){
        return extraRow;
    }
    
    function getRowIdentifiers(){
        return rowIdentifiers;
    }
    
    function setRowIdentifiers(attributes){
        if(attributes && attributes != null && attributes != "" && attributes.length > 0){
            attributeIdentifiers = attributes;
            rowIdentifiers =  attributes;
        }
        else{
            alert(" Invalid attributes, select a valid list of row identifiers.")
        }
    }
    
    function assignRowIdentifiers(pts_list) {
        _.each(pts_list, function(pt) {
            _.each(attributeIdentifiers, function(attributeMeaning) {
                var curAttribute = getAttributeByMeaning(pt, attributeMeaning);
                if(curAttribute) {
                    pt[attributeMeaning] = curAttribute.NUMERIC_VALUE;
                }
            });
        });
        return(pts_list)
    }
    
    
    function buildRowId(patientData) {
        var extraRowId = "";
        _.each(rowIdentifiers, function(idAttribute) {
            if((patientData)[idAttribute]) {
                extraRowId += "_";
                extraRowId += (patientData)[idAttribute];
            }
        });
        return (extraRowId)
    }

    function getPatientExtraRow(patientData) {
        if(nonEmptyArray(rowIdentifiers)) {
            var extraRowId = buildRowId(patientData);
            extraRowId = extraRowId + "-1";
            return _g(extraRowId);

        } else {
            return null;
        }
    }

    function getPatientRow(patientData) {
        if(nonEmptyArray(rowIdentifiers)) {
            var patientRowId = buildRowId(patientData);
            return _g(patientRowId);

        } else {
            return null;
        }
    }
            
    function togglePatientDisplay(patientData, displayInd) {
        var displayValue = "none";
        var patientRowNode = getPatientRow();
        var patientExtraRowNode = getPatientExtraRow();
        if(displayInd) {
            displayValue = "";
        }
        // update display for patient row node
        if(patientRowNode) {
            patientRowNode.style.display = displayValue;
        }
        // if extra row present update display
        if(patientExtraRowNode) {
            patientExtraRowNode.style.display = displayValue;
        }
    }

    
    function getAttributeByMeaning(pt,attrMean){
        var validAttribute = _.find(pt.ATTRIBUTES,function(curAttribute){
            if(curAttribute.MEANING === attrMean){
                return true;
            }
        });
        return (validAttribute);
    }

    function getCurActiveViewPtData(){
        return (ptListData[curActiveSubTab]);
    }
    
    function getCurActiveViewTable(){
        return(_g("TBODY_"+curActiveSubTab));
    }

    /***** Error handling functions ***/
    function errmsg(msg, det) {
        alert(msg + "--" + det);
    }

    function getSortClasses(sortSettings){
        var sortClasses = [];
        _.each(sortSettings,function(sortColumnSetting){
            var columnIndex = sortColumnSetting[0];
            var sortOrder = sortColumnSetting[1];
            var sortColumnObject = curActiveTableColumns[columnIndex];
            var sortColumnClass = sortColumnObject.getSortCSS();
            var sortColumnData = [columnIndex,sortColumnClass];
            sortClasses.push(sortColumnData);
        });
        return (sortClasses);
    }
    
    // Decide sort class to add based on sort order
    function sortClassToAdd(SortOrder){  
    	var classtoAdd = ""
        if(SortOrder == 0){
            classtoAdd = "headerSortUp";
        } else {             
            classtoAdd = "headerSortDown";
        }
		return (classtoAdd);
	}
    
	function tableSorterUpdate(tableId){
		// update the table sorter data, false to indicate no resorting
         $('#' + tableId).trigger("update",[false]);
	}
	
	function getTabFilteringScript(tabSeq){
		var filteringScript = "";
		var tabPref = prefList.TABS[tabSeq];
		if(tabPref && tabPref.FILTER_SCRIPT){
			filteringScript = tabPref.FILTER_SCRIPT;
		}
		else{
			filteringScript = MpageDriver.getFilterAllScript();
		}
		return(filteringScript)
	}
	
	function getTabSourcePatientsScript(tabSeq){
		var sourceScript = "";
		var tabPref = prefList.TABS[tabSeq];
		if(tabPref && tabPref.SOURCE_SCRIPT){
			sourceScript = tabPref.SOURCE_SCRIPT;
		}
		else{
			sourceScript = MpageDriver.getListSourcePatientsScript();
		}
		return(sourceScript)
	}
	
    return {
        runInitiateMpage : true,
        
        setInitiateMpage : function(val){
            this.runInitiateMpage = val;
        },
        getInitiateMpage : function(){
            return this.runInitiateMpage;
        },
        //TODO fix so that current value is always returned
        debug_mode_ind : function() {
            return criterion.debug_mode_ind;
        },
        loadMpage : function(jsonData) {// Called on page load
            try {
                prefList = jsonData.response.LAYOUT;
                var curPref, dmMpageLayout = new MpageLayout(), newMpageComponent, newMpageComponentType, cclParam, disclaimer = Util.cep("span", {
                    "className" : "disclaimer"
                }), worklistSelectionNode = Util.cep("div", {
                    "id" : "divOpenWrklist",
                    "className" : "pt-sel-lists"
                }), NurseUnitPopup = Util.cep("div", {
                    "id" : "nurseUnitsDiv"
                });
                dmMpageLayout.createColumnLayout({
                    "layoutTitle" : prefList.TITLE,
                    "columns" : 1
                });
                PatientListSelectRowNode = Util.cep("div", {
                    "className" : "pt-sel"
                });
                loadingDisplay = Util.cep("span", {
                    "className" : "load-dialog",
                    "id" : "WorklistLoading"
                });
                divtag = Util.cep("div", {
                    "className" : "tabsWrapper"
                });
                loadingGroupDisplay = Util.cep("span", {
                    "className" : "load-dialog"
                });
                moveListWrapper = Util.cep("span", {
                    "className" : "move-patient",
                    "disabled" : "true"
                });
                var moveListIcon = Util.cep("img", {
                    "src" : "../img/5950.gif"
                }), moveListLabel = Util.cep("a", {
                    "href" : "javascript:void(0)"
                });

                moveListLabel.innerHTML = i18n.LABEL_MOVE_PATIENT;
                Util.ac(moveListIcon, moveListWrapper);
                moveListLabel = Util.ac(moveListLabel, moveListWrapper);
                moveListLabel.onclick = function(e2) {
                    displayMoveMenu(e2, curselectedRow, moveListLabel, "click", [0, 0]);
                };
                moveListLabel.ondeactivate = function(e3) {
                    if(curselectedRow !== null) {
                        Util.Style.rcss(curselectedRow, "rowFocus");
                        curselectedRow = null;
                        moveListWrapper.disabled = true;
                    }
                };
                pageContainer.innerHTML = "";
                if(display_disclaimer) {
                    disclaimer.innerHTML = i18n.DISCLAIMER;
                }
                
                
                
                
                
                // Add the Layout DOM to Body
                Util.ac(NurseUnitPopup, pageContainer);
                Util.ac(disclaimer, pageContainer);
                Util.ac(dmMpageLayout.getHeaderDOM(), pageContainer);
                Util.ac(dmMpageLayout.getBannerDOM(), pageContainer);
                Util.ac(worklistSelectionNode, PatientListSelectRowNode);
                Util.ac(loadingGroupDisplay, PatientListSelectRowNode);
                Util.ac(loadingDisplay, PatientListSelectRowNode);
                Util.ac(PatientListSelectRowNode, pageContainer);
                Util.ac(divtag, pageContainer);
                footerDiv = Util.ac(footerDiv, pageContainer);

                // Define Worklist Selections
                WorklistSelection.buildSelections();
                selectedTabSeq = WorklistStorage.get("StoredTabSeq");

            } catch (e) {
                alert(e.message + "loadMpage");
            }
        },
        buildTabViews: function(){
        	try {
                var tabHeaders = [], defaultTab = "0", tabIds = [];
                var tabContentIds = [], tabContentLoaders = [];          
                var tabContainers = Util.gcs(divtag);
                var tabParentContainer = divtag;
                var tabLayout;
                
                // Clear existing views
                _.each(tabContainers,function(tabContainer){
                	Util.de(tabContainer)
                });
                
                // Reset any loading columns                
                curLoadColumns = 0;
                
                //Set the default view
                if(selectedTabSeq && parseInt(selectedTabSeq, 10) >= 0) {
                    defaultTab = selectedTabSeq;
                }
                
                // Build the views and assign content loaders for each view
                _.each(prefList.TABS,function(tab,index){
                    var tabMeaning = tab.MEANING;
                    primary_tabs.push(tabMeaning);
                    tabHeaders[index] = i18n[tabMeaning];
                    tabIds[index] = "TAB_HEADER_" + tabMeaning;
                    tabContentIds[index] = "TAB_CONTENT_" + tabMeaning;
                    tabContentLoaders[index] = subtabLoadMethod(tabMeaning, tab, index);
                });
                
                // Reset Patient List Data
                resetPatientListData();
                
                // Tab layout with assigned Content Load Methods                
                tabLayout = new TabLayout().generateLayout({
                    "defaultTab" : defaultTab,
                    "parentDOM" : tabParentContainer,
                    "tabsHeader" : tabHeaders,
                    "tabsId" : tabIds,
                    "tabsContentId" : tabContentIds,
                    "tabsContainerCSS" : "tabOuterContainer",
                    "tabsContentDOM" : [],
                    "tabsContentLoad" : tabContentLoaders
                });
                
                //Update Tab Headers Initially
                updateTabHeaders();                 
                    
                    
                //Custom tabs defined or only a single default tab defined without any display => hide current tabs
                if(customTabsCreateMethod != null 
                	&& _.isFunction(customTabsCreateMethod) 
                	|| (tabHeaders.length == 1 && tabHeaders[0] == "")){
                    $(".tab-layout-nav",tabLayout).hide();     
                    
                    PatientListSelectRowNode.style.width = "";
                    // build custom tabs
                    if(customTabsCreateMethod != null && _.isFunction(customTabsCreateMethod) ){
                        customTabsCreateMethod();
                    } 
                }
            } catch (e) {
                errmsg(e.message, "buildTabViews");
            }       	
        },
        // Load patient list on tab change
        loadPtList : function(jsonResponse) {
            try {
                var patientsData = jsonResponse.response.PATIENTS;            
                var cclgroupsParams = [], groupsJSON = [];
                var cur_group = "", cur_ptcnt = 0, k = 0;
                
                // Check to ensure loading latest patient list                
                if(selectedPatientListDtTm != jsonResponse.parameters[0]) {
                    return false;
                }
                
                // Indicate Tab has loaded
                ptListData[curActiveSubTab].LOADED = true;
                
                //Define the date/time for latest
                selectedPatientGrpDtTm = new Date();
                
                // no patients on the current list 
                if(patientsData.CNT < 1) {
                	// Hide the loading for patient groups
                    hideGroupLoadingDialog();
                    // Define the
                    PatientListSelectRowNode.style.width = "100%";
                    // reset select loading if no patients at all
                    WorklistSelection.resetSelectLoadingInProgress();
                    //Update Tab Headers
                    updateTabHeaders();                    
                    //if loading icon is specified -> Hide loading icon and display table
                    if(listLoadingIconInd){
                    	$(".list-loading-icon",$("#TAB_CONTENT_"+curActiveSubTab)).remove(); 
                    }
	                            
                    //Display no patients found message in on the current tab
                    $("#TAB_CONTENT_"+curActiveSubTab).html("<span class='tabOuterContainer gen-cent-msg'>" + i18n.PTS_NOT_FOUND + "</span>");
                   // Trigger Finished Load Notifications                    
                   triggerFinishedLoadNotifications(curActiveSubTab);
                    
                    return false;
                }        
                                
                //Grouping patients in batches                
                while(k < patientsData.CNT) {
                    cur_ptcnt += 1;
                    if(cur_group == "") {
                        cur_group = AjaxHandler.stringify_json(patientsData.QUAL[k]);
                    } else {
                        cur_group += "," + AjaxHandler.stringify_json(patientsData.QUAL[k]);
                    }
                    if(cur_ptcnt % ptGroupSize === 0 || k == (patientsData.CNT - 1)) {
                        // Formatting for date/time conversion
                        cur_group = cur_group.split('"/Date(').join('"\\/Date(');
                        cur_group = cur_group.split(')/"').join(')\\/"');

                        cclgroupsParams.push("{\"PATIENTS\":{\"PT_LIST_ID\":" + patientsData.PT_LIST_ID + ",\"CNT\":" + cur_ptcnt + ",\"QUAL\":[" + cur_group + "]}}");
                        groupsJSON.push("{\"PATIENTS\":{\"PT_LIST_ID\":" + patientsData.PT_LIST_ID + ",\"CNT\":" + cur_ptcnt + ",\"QUAL\":[" + cur_group + "]}}");
                        cur_group = "";
                        cur_ptcnt = 0;
                    }
                    k += 1;
                }
                totalPtCnt = patientsData.CNT;
                LoadedPtCnt = 0;
                totalPtGroupCnt = cclgroupsParams.length;
                LoadedPtGroupCnt = 0;

                //Ajax calls for groups of patients
                // If a filter script was defined, go through that script first
                if(filter_script_name > " ") {
                    for( i = 0, len = cclgroupsParams.length; i < len; i++) {
                        AjaxHandler.append_text("Group # " + i + " -->" + cclgroupsParams[i] + " <br/>");
                        AjaxHandler.ajax_request({
                            request : {
                                type : "XMLCCLREQUEST",
                                target : filter_script_name,
                                parameters : '^MINE^ , @'+((cclgroupsParams[i]).length)+":"+cclgroupsParams[i] + '@,^' + criterion.br_topic_mean + '^'
                            },
                            response : {
                                type : "JSON",
                                target : MpageDriver.loadPtGroup,
                                parameters : [selectedPatientGrpDtTm,curActiveSubTabContentDOM,curActiveSubTabSeq,curActiveSubTab]
                            }
                        });
                    }
                }
                // else load each patient group individually
                else {
                    for( i = 0, len = groupsJSON.length; i < len; i++) {
                        MpageDriver.loadPtGroup({
                            "response" : AjaxHandler.parse_json(groupsJSON[i]),
                            "parameters" : [selectedPatientGrpDtTm,curActiveSubTabContentDOM,curActiveSubTabSeq,curActiveSubTab]
                        });
                    }
                }
            } catch (e) {
                errmsg(e.message, "loadPtList");
            }
        },
        loadPtGroup : function(groupJSON) {

            try {
                var groupData = groupJSON.response.PATIENTS;
                var selectGroupDtTm = groupJSON.parameters[0];
                var selectedTabContainer = groupJSON.parameters[1];
                var selectedTabSeq= groupJSON.parameters[2];
                var selectedTabMeaning = groupJSON.parameters[3];

                if((selectedPatientGrpDtTm != groupJSON.parameters[0])) {
                    return false;
                }
                // Assign Patient List Data
                ptListData.PT_CNT += parseInt(groupData.CNT, 10);
                ptListData.QUAL = (ptListData.QUAL).concat(groupData.QUAL);
                LoadedPtCnt += parseInt(groupData.CNT, 10);
                LoadedPtGroupCnt += 1;

                loadingGroupDisplay.innerHTML = i18n.LOADING_GROUPS + LoadedPtCnt + " " + i18n.OF + " " + totalPtCnt + " <span class='ajax-loader'></span>";
                //setting the loading display for patients

                //Organize patients into tab data
                curPtGroupData = organizeTabPatients(groupData,selectedTabMeaning);

                //Update Tab Headers
                updateTabHeaders();

                if(LoadedPtGroupCnt == totalPtGroupCnt) {//Loaded all patientgroups
                    hideGroupLoadingDialog();
                    // reset select Loading if current tab has no patients
                    if(ptListData[selectedTabMeaning].PT_CNT == 0){                        
                        WorklistSelection.resetSelectLoadingInProgress();
                    }
                    
                }
                if(curPtGroupData.PT_CNT > 0) {
                    //trigger loadPtSubTab
                    MpageDriver.loadPtSubTab(selectedTabContainer, curPtGroupData, selectedTabSeq,selectedTabMeaning);
                }
            } catch(e) {
                errmsg(e.message, "loadPtGroup");
            }
        },
        loadPtSubTab : function(tabContainer, jsonData, tabSeq,tabMeaning) {//Called on Sub-tab change
            try {
                if(ptListData) {
                    var parentTable, curJSONRefs = [], curBodyCellCss = [], tableLayoutWrapperNode, curBodyRowHover = [];
                    var tableData = getTableData(prefList.TABS[tabSeq].COLUMNS), tableColumns = tableData.tableColumns;
                    var tableHeaders = tableData.tableHeaders, tableHeadersCSS = tableData.tableHeadersCSS, tableHeaderRow;
                    var TableDOM, idx = 0, len = tableColumns.length;
                    var classtoRemove, classtoAdd;
                    rowTemplate = prefList.TABS[tabSeq].ROW_TEMPLATE;
                    curActiveTableColumns = tableColumns;
                    if(prefList.TABS[tabSeq].EXTRAROW == true){
                        extraRow = true;
                    }
                        
                    for( idx = 0; idx < len; idx++) {
                        curJSONRefs[idx] = "";
                        if(idx == 0) {
                            curJSONRefs[idx] = "NAME_FULL_FORMATTED";
                        }
                        curBodyCellCss[idx] = "brdr";
                        curBodyRowHover[idx] = "";
                    }
                    
                    if(ptListData && parseInt(ptListData.PT_LOADED_CNT, 10) < parseInt(ptListData.PT_CNT, 10)) {// valid load end number
                        //Create criterion
                        criterion.params = getPtsReq(jsonData, 0, jsonData.QUAL.length);
                        AjaxHandler.append_text(" criterion.params -- >" + criterion.params)
                        
                        // Build out row identifiers
                        if(attributeIdentifiers.length > 0){
                            jsonData.QUAL = assignRowIdentifiers(jsonData.QUAL);
                        }
                        
                        // create table on empty sub-tab, loading the tab for the first time
                        if($("#TBODY_" + tabMeaning,$(tabContainer)).length == 0) {                    
                            // set select loading since tab is being built for the first time
                            WorklistSelection.setSelectLoadingInProgress();
                            AjaxHandler.append_text("Entered the Table building");
                            selectedTabSeq = tabSeq;
                            curTabPtsTotal = jsonData.PT_CNT;
                            curTabPtsCnt = 0;
                            
                            TableDOM = TableLayout.generateLayout({
                                "headerCSS" : "title",
                                "tableCSS" : "pwl-table",
                                "tableHeaderRowCSS" : "tableFixedHeader",
                                "tableHeaderCellCSS" : tableHeadersCSS,
                                "tableHeaders" : tableHeaders,
                                "tableBodyRowCSS" : ["even", ""],
                                "tableBodyCellCSS" : curBodyCellCss,
                                "tableBodyRowHover" : curBodyRowHover,
                                "JSONList" : jsonData.QUAL,
                                "JSONRefs" : curJSONRefs,
                                "JSONRowEvent" : ["mouseenter", "mouseleave", "activate", "deactivate"],
                                "JSONRowFnc" : [focusRow, unFocusRow, selectRow, unSelectRow],
                                "JSONRowId" : rowIdentifiers,
                                "ExtraRow":extraRow,
                                "RowTemplate": rowTemplate,
                                "ParentRowClass": parentRowClass,
                                "ChildRowClass": childRowClass
                            });
                            TableDOM.tableDOM.id = "TBODY_" + tabMeaning;
                           
                            
                            tableHeaderRow = TableDOM.headerRowDOM;
                            tableHeaderRow.id = "THEAD" + tabMeaning;
                            parentTable = Util.gp(Util.gp(tableHeaderRow));
                            parentTable.id = "TABLE_" + tabMeaning;
                            parentTable.className = "tablesorter";
                            tableLayoutWrapperNode = Util.Style.g('table-layout-wrapper-table', TableDOM.layoutDOM)[0];
                            tabContainer.style.overflowX = "hidden";
                            tabContainer.style.overflowY = "hidden";
                            tableLayoutWrapperNode.style.overflowX = "hidden";
                            tableLayoutWrapperNode.style.overflowY = "scroll";
                            TableDOM.layoutDOM.style.overflowX = "hidden";
                            TableDOM.layoutDOM.style.overflowY = "hidden";
                            
                             //if loading icon is specified -> Hide table
                            if(listLoadingIconInd){
                            	TableDOM.tableDOM.style.display = "none";
                            	parentTable.style.display = "none";
                            }
                            
                            // Append table layout to the tab container
                            Util.ac(TableDOM.layoutDOM, tabContainer);                  
                            TableDOM.layoutDOM.style.height = tabContainer.offsetHeight + "px";
                            tableLayoutWrapperNode.style.height = tabContainer.offsetHeight + "px";
                            //Define sorter for table
                            $("#" + parentTable.id).tablesorter({
                                headers : getSortableColumns(tableColumns), // define columns which are sortable
                                sortList : getDefaultSortedColumns(tableColumns), // define default sorted columns
                                textExtraction : function(node) {
                                    return (sortTextExtraction(node, tableColumns[node.cellIndex]));
                                },
                                emptyTo : 'bottom'
                            });

                            // Function to re-format the zebra striping on column rows after sort
                            $("#" + parentTable.id).bind("sortEnd", function() {
                                var rowCntr = 0, curRows = parentTable.rows, rowCnt = curRows.length;
                                for( rowCntr = 0; rowCntr < rowCnt; rowCntr++) {
                                    if(rowCntr % 2 == 0) {
                                        classtoAdd= "odd";
                                        classtoRemove = "even";
                                    } else {
                                        classtoAdd = "even";
                                        classtoRemove = "odd";
                                    }                                
                                    // update css for current row
                                    Util.Style.rcss(curRows[rowCntr], classtoRemove);
                                    Util.Style.acss(curRows[rowCntr], classtoAdd);
                                }
                            });
                            
                            // Listen to sort on event to save the worklistSorting to worklist storage in session only
                            $("#" + parentTable.id).bind("sorton", function(event,sortSettings) {                            	
                            	// Indicator to save sorting within a session is set to true
                            	if(saveSessionSortingInd){
	                                // Any sorting done
	                                if(sortSettings.length > 0){
	                                    worklistSorting[tabMeaning] = {};
	                                    worklistSorting[tabMeaning].SORT_SETTINGS = sortSettings;                                    
	                                    worklistSorting[tabMeaning].SORT_CLASSES = getSortClasses(sortSettings);                  
	                                    worklistSorting[tabMeaning].SORT_HEADER_CLASS = curSortedHeaderClass;
	                                    WorklistStorage.set("StoredWorklistSorting",JSON.stringify(worklistSorting));
	                                }
                               }
                            });
                            //set fixed table header
                            TableLayout.setFixedHeader({
                                "fixedHeaderclassName" : "tableFixedHeader",
                                "scrollContainerNode" : tableLayoutWrapperNode
                            });
                        }
                        // append to an existing table
                        else {

                            AjaxHandler.append_text("Entered the Append Table");
                            AjaxHandler.append_text("Header Row-->" + _g("THEAD" + tabMeaning));
                            AjaxHandler.append_text("Body Row-->" + _g("TBODY_" + tabMeaning));
                            if(_g("THEAD" + tabMeaning) && _g("THEAD" + tabMeaning) !== null) {
                                tableHeaderRow = _g("THEAD" + tabMeaning);
                            }
                            if(_g("TBODY_" + tabMeaning) && _g("TBODY_" + tabMeaning) !== null) {
                                TableDOM = TableLayout.appendRows({
                                    "tableBodyDOM" : _g("TBODY_" + tabMeaning),
                                    "tableBodyRowCSS" : ["even", ""],
                                    "tableBodyCellCSS" : curBodyCellCss,
                                    "tableBodyRowHover" : curBodyRowHover,
                                    "tableHeaders" : tableHeaders, 
                                    "JSONList" : jsonData.QUAL,
                                    "JSONRefs" : curJSONRefs,
                                    "JSONRowEvent" : ["mouseenter", "mouseleave", "activate", "deactivate"],
                                    "JSONRowFnc" : [focusRow, unFocusRow, selectRow, unSelectRow],
                                    "JSONRowId" : rowIdentifiers,
                                    "ExtraRow":extraRow,
                                    "RowTemplate": rowTemplate,
                                    "ParentRowClass": parentRowClass,
                                    "ChildRowClass": childRowClass
                                });
                            }
                        }

                        //Load the columns on table
                        showLoadingDialog();
                        for( idx = 0; idx < len; idx++) {
                            if(tableColumns[idx] !== null) {
                                tableColumns[idx].load(TableDOM.tableDOM, idx, tableHeaderRow.cells[idx], criterion);
                            }
                        }
                        ptListData.PT_LOADED_CNT += jsonData.QUAL.length;
                        if(tabMeaning > " ") {
                            ptListData[tabMeaning].PT_LOADED_CNT += jsonData.QUAL.length;
                        }
                        curLoadColumns += (len);
                    }
                }
            } catch (e) {
                errmsg(e.message, "loadPtSubTab");
            }
        },
        /**
         * Define the filtering script call before patients groups are displayed on the worklist.
         * <p>NOTE: The filtering script defined here is called with each patient group</p>
         * @param {String} filterScript        Name of filtering script to execute
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setFilterScript
         */
        setFilterScript : function(filterScript) {
            filter_script_name = filterScript
        },
        /**
         * Define the filtering script call before patients are displayed on the worklist.
         * <p>NOTE: The filtering script defined here is called with all patients</p>
         * @param {String} filterScript        Name of filtering script to execute
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setFilterAllScript
         */
        setFilterAllScript : function(filterScript) {
            filter_all_script_name = filterScript
        },
        /**
         * Get the filtering script call before patients groups are displayed on the worklist.
         * @return {String} filterScript    Name of filtering script to execute
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getFilterScript
         */
        getFilterScript : function() {
            return (filter_script_name);
        },
        /**
         * Get the filtering script call before patients are displayed on the worklist.
         * @return {String} filterScript    Name of filtering script to execute
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getFilterAllScript
         */
        getFilterAllScript : function() {
            return (filter_all_script_name);
        },
        /**
         * Define the group size of patients to load asynchronously.
         * @param {Number} groupSize     The group size of patients to load at once
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setLoadPatientGroupSize
         */
        setLoadPatientGroupSize : function(groupSize) {
            ptGroupSize = groupSize
        },
        sendCommonData : function(data){
            var dataName = data.parameters[0];
            for(var i = MPAGETABLECOLUMNS.length; i--;){
                if(MPAGETABLECOLUMNS[i].column.dataName === dataName){
                    MPAGETABLECOLUMNS[i].column.loadJsonData(data);
                }
            }
        },
        
        
        finishedLoading : function(columnMeaning) {
        	try{
	            var storedSortingJSON = String(WorklistStorage.get("StoredWorklistSorting"));
	            var loadedTabMeaning = "";
	            curLoadColumns -= 1;
	            // Current tab has been loaded
	            if(curLoadColumns == 0) {
	                    hideLoadingDialog();  
	                    // get the tab meaning by column
	                    loadedTabMeaning = getTabByColumn(columnMeaning);                                  
	                    // Update table for any sorting
	                    $.when(         	
	            			$.when(tableSorterUpdate("TABLE_" + loadedTabMeaning)).done(
	                            function(){
	                            	
	                            	 //if loading icon is specified -> Hide loading icon and display table
		                            if(listLoadingIconInd){
		                            	_g("TABLE_" + loadedTabMeaning).style.display = "";
		                            	_g("TBODY_" + loadedTabMeaning).style.display = "";
		                            	$(".list-loading-icon",$("#TAB_CONTENT_"+loadedTabMeaning)).remove(); 
		                            }
		                            
	                                // Trigger finished load notifications
	                                triggerFinishedLoadNotifications(loadedTabMeaning)
	                                
	                                // if sort settings were stored -> apply the sort settings
	                                if(storedSortingJSON && storedSortingJSON > " " && storedSortingJSON != "undefined"){
	                                    try{
	                                        worklistSorting = JSON.parse(storedSortingJSON);
	                                        if(worklistSorting && worklistSorting[loadedTabMeaning] 
	                                        		&& worklistSorting[loadedTabMeaning].SORT_SETTINGS && worklistSorting[loadedTabMeaning].SORT_SETTINGS.length > 0){
	                                        	var curActiveViewSort = worklistSorting[loadedTabMeaning];
	                                            // set the sort css on each column table object
	                                            _.each(curActiveViewSort.SORT_CLASSES,function(sortClassData){
	                                                var columnIndex = sortClassData[0];
	                                                var sortClass = sortClassData[1];
	                                                var sortColumnObject = curActiveTableColumns[columnIndex];
	                                                if(sortColumnObject && sortColumnObject.setSortCSS){
	                                                    sortColumnObject.setSortCSS(sortClass);
	                                                }
	                                            });
	                                            
	                                            // if a header class was present -> apply the sort class based on sort order
	                                            if(curActiveViewSort.SORT_HEADER_CLASS && curActiveViewSort.SORT_HEADER_CLASS > " "){
	                                            	var sortOrder = worklistSorting[loadedTabMeaning].SORT_SETTINGS[0][1];
	                                            	var classToAdd = sortClassToAdd(sortOrder);
	                                            	$("."+curActiveViewSort.SORT_HEADER_CLASS).first().addClass(classToAdd);
	                                          		curSortedHeaderClass = curActiveViewSort.SORT_HEADER_CLASS;
	                                            }
	                                                                           
	                                            //Update the table data for sorting
	                                            tableSorterUpdate("TABLE_" + loadedTabMeaning)                                         
	                                            
	                                        }
	                                    }
	                                    catch(e){}
	                                }                                                        
	                                
	                                // reset loading in progress for current tab view
	                                WorklistSelection.resetSelectLoadingInProgress();
	                            
	                                notifyObservers("changes-after-last-table-sort",{});
	                        
	                            }
	                        ))
	                        .done(
	                            function(){    
	                                jQuery(window).load(function(){
	                                    $('.ptb-prev-hover').removeClass('ptb-prev-hover');
	                                    $('.ptb-blue-hover').removeClass('ptb-blue-hover');
	                                    $('.ptb-next-hover').removeClass('ptb-next-hover');
	                                });
	                            });
	            }
            }
            catch(e){
            	
                alert(e.message + " MpageDriver.finishedLoading");
            }
        },
        /**
         * Register an mpage table column object for rendering on mpage.
         * @param {Object} MpageTableColumn     Mpage table column object for rendering.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name register
         */
        register : function(MpageTableColumn) {
            MPAGETABLECOLUMNS.push(MpageTableColumn);
        },
        selectedPatientListID : function() {
            return (selectedPatientListID);
        },
        selectedTabSeq : function() {
            return (selectedTabSeq);
        },
        currentPatientLists : function() {
            return (currentPtLists)
        },
        unloadParams : function() {
            unloadParams();
        },
        
        /**
         * Define the list of attributes row identifers to use from the patients json
         * @param {Array} attributeMeanings The list of attribute meanings to define row identifiers for each row
         *
         * 
         * @description
         * <p>NOTE: The attributeMeanings should be valid attributes defined on each patient in the patients structure. The numeric_value on the attributes will used as the identifer.</p>
         * 
         * <p>Example: </p>
         * With the following attribute specified on a patient or an item 
         * <code>
         * <pre>
         *   {
         *   "MEANING": "FN_TRACK_ID",
         *   "DISPLAY_VALUE": "Tracking id",
         *   "DT_TM_VALUE": "/Date(0000-00-00T00:00:00.000+00:00)/",
         *   "NUMERIC_VALUE": 2233326.000000
         *   }
         * </pre>
         * </code>
         * The following value will be specified as the parameter to use the NUMERIC_VALUE above as the identifier
         * <code>
         * <pre>
         *    ["FN_TRACK_ID"]
         * </pre>
         * </code>
         *
         * 
         * @static
         * @function
         * @memberof MpageDriver
         * @name setRowIdentifiers
         */
        setRowIdentifiers : setRowIdentifiers,
        
        setExtraRow : setExtraRow,
        
        setParentRowClass : setParentRowClass,
        
        setChildRowClass : setChildRowClass,
        
        getExtraRow : getExtraRow,
        
        getRowIdentifiers: getRowIdentifiers,
        
        initializeCriterion: initializeCriterion,
        
        setCriterion : setCriterion,
        
        findPatientAttribute : findPatientAttribute,
        
        nonEmptyArray : nonEmptyArray,
        
        nonEmptyString : nonEmptyString,
        
        /**
         * Define the source of lists to retrieve patients on the mpage.
         * @param {String} listSource         The source of lists to retrieve types and patients 
         * @param {String} sourceScript     The source script to retrieve source types 
         * @param {String} sourcePatientsScript        The source script to retrieve patients from the source
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setListSource
         */
        setListSource : function(listSource,sourceScript,sourcePatientsScript) {
            criterion.list_source_name = listSource
            criterion.list_source_script = sourceScript;
            criterion.list_source_pts_script = sourcePatientsScript;
        },
        /**
         * Get the source of lists to retrieve patients on the mpage.
         * @return {String} listSource     The source of lists to retrieve patients from
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getListSource
         */
        getListSourceName : function() {
            return (criterion.list_source_name)
        },
        /**
         * Get the source of lists to retrieve patients on the mpage.
         * @return {String} sourceScript     The source script to retrieve source types 
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getListSourceScript
         */
        getListSourceScript : function() {
            return (criterion.list_source_script)
        },
        /**
         * Get the source of lists to retrieve patients on the mpage.
         * @return {String} sourcePatientsScript     The source script to retrieve patients from
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getListSourceScript
         */
        getListSourcePatientsScript : function() {
            return (criterion.list_source_pts_script)
        },
        /**
         * Define the bedrock topic meaning used to load the layout of mpage.
         * @param {String} topicMeaning     The topic meaning of bedrock wizard
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setBedrockTopicMeaning
         */
        setBedrockTopicMeaning : function(topicMean) {
            criterion.br_topic_mean = topicMean;
        },
        /**
         * Return the bedrock topic meaning used to load the layout of mpage.
         * @return {String} topicMeaning    The topic meaning of bedrock wizard.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getBedrockTopicMeaning
         */
        getBedrockTopicMeaning : function() {
            return (criterion.br_topic_mean);
        },
        /**
         * Return the criterion object.
         * @return {Object} criterion The criterion object containing position, application_id, debug mode e.t.c.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getCriterion
         */
        getCriterion : function() {
            return (criterion);
        },
      	/**
         * Update the criterion object.
         * @param {Object} criterion The criterion object containing position, application_id, debug mode e.t.c.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name updateCriterion
         */
      	updateCriterion : function(newCriterion) {
            criterion = newCriterion;
        },
       
        /**
         * Define the Layout of the worklist mpage, it is required to be in the format below.
         * If the MEANING attribute for a tab is set to DEFAULT_TAB, no tabs will be shown on display. If the MEANING attribute for a tab is set to PRIMARY_TAB, tabs will be displayed with the title.
         *
         *
         * @param {Object} layoutData    JSON Object specifying the layout
         *
         *
         * @description
         * <p>Example layoutData: </p>
         * <code>
         * <pre>
         *    {
         *         "LAYOUT": {
         *            "TITLE":"Example Worklist MPage",
         *            "TABS": [
         *                         {
         *                            "MEANING":"DEFAULT_TAB",
         *                            "TITLE" :"",
         *                            "COLUMNS":[
         *                                             {
         *                                                "MEANING":"PATIENT_INFORMATION",
         *                                                "TITLE":""
         *                                             }
         *                                             ,{
         *                                                 "MEANING":"VISIT_REASON",
         *                                                "TITLE":""
         *                                            }
         *                                        ]
         *                        },
         *                        {
         *                            "MEANING":"DEFAULT_TAB",
         *                            "TITLE" :"",
         *                            "COLUMNS":[
         *                                            {
         *                                                "MEANING":"PATIENT_INFORMATION",
         *                                                "TITLE":""
         *                                            }
         *                                             ,{
         *                                                "MEANING":"VISIT_REASON",
         *                                                "TITLE":""
         *                                            }
         *                                        ]
         *                        }
         *                    ]
         *            }
         *    }
         * </pre>
         * </code>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setLayout
         */
        setLayout : function(layoutData) {
            layoutPrefs = layoutData;
        },
        /**
         * Get the Layout data specified for the worklist mpage.
         *
         * @return {Object} layoutData    JSON Object specifying the layout
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getLayout
         */
        getLayout : function() {
            return (layoutPrefs);
        },
        /**
         * Define if disclaimer is shown or hidden on worklist.
         * @param {Boolean} displayDisclaimer    Set to true to show, false to hide the disclaimer
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name displayDisclaimer
         */
        displayDisclaimer : function(dispDisclaimer) {
            display_disclaimer = dispDisclaimer;
        },
        /**
         * Define if loading icon is shown during worklist load.
         * @param {Boolean} dispLoading    Set to true to show, false to hide the loading icon
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name displayListLoadingIcon
         */
       	displayListLoadingIcon: function(dispLoading){
       		listLoadingIconInd =  dispLoading;
      	 },
        /**
         * Show load icon on currently active tab content
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name showListLoadingIcon
         */
       	showListLoadingIcon: function(){
       		_g("TABLE_" + curActiveSubTab).style.display = "none";
		    _g("TBODY_" + curActiveSubTab).style.display = "none";		                            	
       		$("#TAB_CONTENT_"+curActiveSubTab).append("<div class='centered-icon list-loading-icon'><img src='../img/preloader_32.gif' /></div>");
         },
        /**
         * Hide load icon on currently active tab content
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name hideListLoadingIcon
         */
       	hideListLoadingIcon: function(){	
       		_g("TABLE_" + curActiveSubTab).style.display = "";
		    _g("TBODY_" + curActiveSubTab).style.display = "";
		    $(".list-loading-icon",$("#TAB_CONTENT_"+curActiveSubTab)).remove();                    
      	 },
        /**
         * Get the DOM Node reference to the page footer on layout.
         * @return {Node} footerDiv        Reference to the page footer node.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getPageFooterNode
         */
        getPageFooterNode : function() {
            return footerDiv;
        },
        /**
         * Add an event Observer to Mpage Driver
         * @param {String} event Name of event attached to observers
         * @param {Function} observer    Reference to observing function
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name addObserver
         */
        addObserver : function(event, observer) {
            var group = observers[event];
            if(group == undefined || !group) {
                observers[event] = [];
                group = observers[event];
            }
            group.push(observer);

        }, /**
         * Notifies Observers of event to Mpage Driver
         * @param {String} event Name of event attached to observers
         * @param {Object} data    Data to be passed on to observers
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name notifyObservers
         */
        notifyObservers : function(event, data) {
            notifyObservers(event, data);
        },
        /**
         * Get the DOM Node reference to the patient list select row on layout.
         * @return {Node} PatientListSelectRowNode    Reference to the patient list select row node.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getPatientListSelectRowNode
         */
        getPatientListSelectRowNode : function() {
            return (PatientListSelectRowNode)
        },
        setselectedPatientListDtTm : function(selDttm) {
            selectedPatientListDtTm = selDttm;
        },
        getselectedPatientListDtTm : function() {
            return (selectedPatientListDtTm)
        },
        /**
         * Trigger a sort on the specified table column in the given order
         * @param {Node} parentTable    Reference to the parent Table containing the column.
         * @param {Number} columnIndex    Index of column from left-to-right on the table.
         * @param {Number} sortOrder    Sort order for sorting  0 for Ascending and 1 for Descending.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name sortTableColumn
         */
        sortTableColumn : function(parentTable, columnIndex, sortOrder, subHeaderDataLocation,stringLen) {
            if(parentTable){
	            var headerTable = Util.gp(parentTable), tableId = headerTable.id;
	            var sortSettings =  [[columnIndex, sortOrder]];
	            setTimeout(function() {
	                if(subHeaderDataLocation){
	                    var curTable = _g("TBODY_DEFAULT_TAB");
	                    
	                    var sortFunc = function(){
	                        $('#' + tableId).trigger("sorton", [sortSettings]);
	                    }
	                    var subHeadingFunc = function(){
	                        MpageDriver.generateSubHeadings(curTable,subHeaderDataLocation,stringLen);
	                    }
	                    
	                    MpageDriver.prioritizeFunctions([sortFunc,subHeadingFunc])
	                }
	                else{
	                    $('#' + tableId).trigger("sorton", [sortSettings])
	                }
	            },1);
            }
        },
        
        generateSubHeadings : function(curTable,dataLocation,stringLen){
            if(curTable){
                if(stringLen){
                    stringLen = stringLen();
                }
                MpageDriver.createSubHeaders(curTable,dataLocation,{stringLen : stringLen});
            }
        },
        
        prioritizeFunctions : function(fList){
            if(fList.length){
               var f = fList[0]();
                for(var i = 1, il = fList.length; i < il; i++){
                    f = $.when(f).done(fList[i]());
                }
            }
        },
        
        createSubHeaders : function(table, returnCol, labelCriteria){
            try{
                var prevLabels = Util.Style.g("organized-table-column",table,"TR");
                for(i = prevLabels.length; i--;){
                    Util.de(prevLabels[i]);
                }
                var rows = _gbt("tr",table);
                var firstRow;
                var lastRow;
                var curVal;
                if(rows.length){
                    var headerColSpan = rows[0].cells.length;
                    var headerColPosition = (headerColSpan - 1) / 2;
                    var i, il;
                    var makeOrganizedHeader;
                    if(rows.length > 1){
                            firstRow = returnCol(rows[0])
                            lastRow = returnCol(rows[rows.length - 1]);
                    }
                    
                    makeOrganizedDescHeader = function(i){
                        if(curHeader){
                            row = table.insertRow(i);
                            row.className = "organized-table-column";
                            for(var j = 0, jl = headerColPosition; j < jl; j++){
                                cell = row.insertCell(j);
                                cell.innerHTML = "";
                            }
                            cell = row.insertCell(headerColPosition);
                            cell.innerHTML = curHeader;
                            // cell.colspan = headerColSpan;
                            for(var j = headerColPosition + 1, jl = headerColSpan; j < jl; j++){
                                cell = row.insertCell(j);
                                cell.innerHTML = "";
                            }
                        }
                    }
                        
                    makeOrganizedAscHeader = function(i){
                        if(prevHeader){
                            row = table.insertRow(i + 1);
                            row.className = "organized-table-column";
                            for(var j = 0, jl = headerColPosition; j < jl; j++){
                                cell = row.insertCell(j);
                                cell.innerHTML = "";
                            }
                            cell = row.insertCell(headerColPosition);
                            cell.innerHTML = "<span class='organized-table-cell'>" + prevHeader + "</span>";
                            for(var j = headerColPosition + 1, jl = headerColSpan; j < jl; j++){
                                cell = row.insertCell(j);
                                cell.innerHTML = "";
                            }
                        }
                    }
                    
                    var curHeader;
                    var curRow;
                    var row;
                    var cell;
                    var curValue;
                    var descending = true;
                    
                    if(firstRow < lastRow){
                        descending = false;
                        makeOrganizedHeader = makeOrganizedAscHeader;
                    }
                    else{
                        makeOrganizedHeader = makeOrganizedDescHeader;
                    }
                    
                    var matchingString = "";
                    
                    if(labelCriteria.stringLen){
                        var stringLen = labelCriteria.stringLen;
                        var maxStringLen = stringLen;
                        var newValue;
                        checkCell = function(value){
                            if(value && value.length >= stringLen){
                                newValue = value.substring(0,stringLen).replace(/^\s+|\s+$/g,"");
                                if(newValue !== matchingString){
                                    if(stringLen < maxStringLen){
                                       stringLen = Math.min(maxStringLen,value.length);
                                    }
                                    matchingString = newValue; 
                                    curHeader = matchingString;
                                    return 1;
                                }
                                else{
                                    return 0;
                                }
                            }
                            else{
                                if(value){
                                    stringLen = value.length;
                                    matchingString = value.replace(/^\s+|\s+$/g,"");
                                    curHeader = matchingString;
                                    return 1;
                                }
                                else{
                                    if(matchingString){
                                        curHeader = matchingString;
                                        return 1;
                                    }
                                    else{
                                        return 0;
                                    }
                                    matchingString = "";
                                }
                            }
                        }  
                    }
                    else{
                        var curVal;
                        var dummyMatchingStr = "";
                        checkCell = function(value){
                            if(value && (curValue = value.replace(/^\s+|\s+$/g,""))){
                                if(curValue === matchingString){
                                    return 0;
                                }
                                else{
                                    matchingString = curValue;
                                    curHeader = curValue;
                                    return 1;
                                }
                            }
                            else{
                                if(!descending && matchingString){
                                    curHeader = matchingString;
                                    matchingString = "";
                                    return 1;
                                }
                                else{
                                    return 0;
                                }
                            }
                        }
                    }
                    
                    if(!descending){
                        prevHeader = returnCol(rows[rows.length - 1]);
                        if(labelCriteria.stringLen){
                            prevHeader = prevHeader.substring(0,Math.min(prevHeader.length,labelCriteria.stringLen));
                        }
                        checkCell(prevHeader);
                    }
                        
                     if(rows.length > 1){
                         if(descending){
                             for(var i = 0, il = rows.length; i < il; i++){
                                 curRow = rows[i];
                                 curVal = checkCell(returnCol(curRow));
                                 if(curVal != 0){
                                     if(curVal == 1){
                                         makeOrganizedHeader(i);
                                         i++;
                                         il++;
                                     }
                                     else{
                                         break;
                                     }
                                 }
                             }
                         }
                         else{
                             for(var i = rows.length - 1; i--;){
                                 curRow = rows[i];
                                 curVal = checkCell(returnCol(curRow));
                                 if(curVal != 0){
                                     if(curVal == 1){
                                         makeOrganizedHeader(i);
                                         prevHeader = curHeader;
                                     }
                                     else{
                                         break;
                                     }
                                 }
                             }
                    
                            prevHeader = returnCol(rows[0]);
                            if(labelCriteria.stringLen){
                                prevHeader = prevHeader.substring(0,Math.min(prevHeader.length,labelCriteria.stringLen));
                            }
                            makeOrganizedAscHeader(-1);
                        }
                     }
                }
            }
            catch(e){
                alert(e.message + "\createSubHeaders");
            }
        },
        /**
         * Updates the Sorting on table, this is used when new Data is appended to table or
         * when default sort order on a table column is modified.
         * @param {Node} parentTable    Reference to the parent Table containing the columns and the sort update.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name updateTableSorting
         */
        updateTableSorting : function(parentTable) {
           if(parentTable){
            	var headerTable = Util.gp(parentTable), tableId = headerTable.id;
            	tableSorterUpdate(tableId);
           }
        },
        /**
         * Setup a table column header for sorting. This method is applicable to scenarios where an html column header (th) contains multiple sub-columns within and each column requires a different sort.
         * The table attribute is a DOM reference to the tbody section of the table, columnIndex refers to the left-to-right index of column on table, headerCellNode is a DOM reference to the th cell containing the columns to sort
         * , headerCSS refers to the CSS class of sub column header, sortCSS refers to the CSS class of the elements containing the data for sorting, columnObject refers to JSON object of Table column
         *
         * NOTE: The columnObject should contain a public method "setSortCSS" for this method to work correctly.
         *
         * @param {Object} sortPrefs Object describing the preferences for defining a sortable sub-column header
         *
         * @description
         * <p>Example sortPrefs: </p>
         * <code>
         * <pre>
         *  {
         *      "table":parentTable,
         *      "columnIndex":columnIndex,
         *      "headerCellNode":headerCellDOM,
         *      "headerCSS":"LOC",
         *      "sortCSS":"ptinfo_sort_loc",
         *      "columnObject":PatientInformationColumn_1
         *  }
         * </pre>
         * </code>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setSortableHeader
         */
        setSortableHeader : function(sortPrefs) {
            var parentTable = sortPrefs.table, columnIndex = sortPrefs.columnIndex;
            var headerCellDOM = sortPrefs.headerCellNode, headerCSS = sortPrefs.headerCSS;
            var sortCSS = sortPrefs.sortCSS, columnObject = sortPrefs.columnObject;
            var sortHeaderNode = Util.Style.g(headerCSS, headerCellDOM);
            var subHeaderDataLocation;
            var stringLen;
            if(sortPrefs.subHeaderDataLocation){
                subHeaderDataLocation = sortPrefs.subHeaderDataLocation;
            }
            if(sortPrefs.stringLen){
                stringLen = sortPrefs.stringLen;
            }
            var classtoAdd,classtoRemove;
            if(sortHeaderNode.length > 0) {
                sortHeaderNode = sortHeaderNode[0];
                // if not a sortable header -> attach the event to make it sortable
                if(!Util.Style.ccss(sortHeaderNode, "is-sortable-header")) {
                	// add a class to indicate sortable header
                    Util.Style.acss(sortHeaderNode, "is-sortable-header");
                    //class to define the header style
                    Util.Style.acss(sortHeaderNode, "header")
                     
                    sortHeaderNode.onclick = function() {
                    
                        var SortOrder = 0; // ascending -> default
                        // Decide sort order
                        if(Util.Style.ccss(this, "headerSortUp")) { // was sorted in ascending before
                            SortOrder = 1; // descending
                        } else if(Util.Style.ccss(this, "headerSortDown")) { // was sorted in descending before
                            SortOrder = 0; // ascending 
                        }
                        classtoAdd = sortClassToAdd(SortOrder);
                        // reset css classes on all headers
                        $(".headerSortDown").removeClass("headerSortDown");
                        $(".headerSortUp").removeClass("headerSortUp");
                        
                        // update css for current header
                        Util.Style.acss(this, classtoAdd);
                        curSortedHeaderClass = headerCSS;
                        
                        columnObject.setSortCSS(sortCSS);
                        MpageDriver.updateTableSorting(parentTable);
                        MpageDriver.sortTableColumn(parentTable, columnIndex, SortOrder, subHeaderDataLocation,stringLen);
                    }
                }
            }
        },
        
        initiateMpage : function() {
            if(MpageDriver.getInitiateMpage()){
            	// Unload Parameters from URL
				MpageDriver.unloadParams();
				
                if(pageContainer == null){
                    pageContainer = document.body;
                }           
                //  notify that document has finished loading
                MpageDriver.notifyObservers("document-finished-loading", {});
                // Mpage layout not defined
                if(MpageDriver.getLayout() == null) {
                    var cclParam = "^MINE^,^" + MpageDriver.getBedrockTopicMeaning() + "^";
                    AjaxHandler.ajax_request({
                        request : {
                            type : "XMLCCLREQUEST",
                            target : "inn_mp_get_pt_list_layout",
                            parameters : cclParam
                        },
                        response : {
                            type : "JSON",
                            target : MpageDriver.loadMpage
                        }
                    });
                } else {
                    AjaxHandler.append_json(MpageDriver.getLayout())
                    MpageDriver.loadMpage({
                        "response" : MpageDriver.getLayout()
                    });
                }
            }
        },  
        addExpandCollapseLinks : function(){            
            if(!expandCollLinksCreated){            
                expandCollLinksCreated = true;      
                var expandCollapse = Util.cep("span", {
                    className : "expand-collapse-all",
                    //innerHTML : "<a id='fullExpandClick' href='#'>Expand All</a> | <a id='fullCollapseClick' href='#'>Collapse All</a>"
                    innerHTML : "<a id='fullExpandClick' href='#'>"+ i18n.EXPAND_ALL + "</a> | <a id='fullCollapseClick' href='#'>" + i18n.COLLAPSE_ALL + "</a>"
                });
    
                var extraWrapper = Util.cep("span", {
                    className : "extra-wrapper"
                });
    
                var selectRowParent = Util.Style.g("pt-sel")[0];
                var pt_sel_lists = Util.Style.g("pt-sel-lists", selectRowParent)[0];
                selectRowParent.insertBefore(extraWrapper, pt_sel_lists);   
                Util.ac(expandCollapse, extraWrapper);          
                expandAll();
                collapseAll();
                        
                function expandAll() {
    
                    Util.addEvent(_g("fullExpandClick"), "click", function(e) {
                        Util.preventDefault(e);
                        var rowArray = Util.Style.g(childRowClass, document, "tr");
                        var iconArray = Util.Style.g("expand-collapse-icon", document, "span");
                        toggleHiddenCSS(rowArray, "show");
                        toggleCollapseIcons(iconArray, "[-]");
    
                    });
                }
    
                function toggleHiddenCSS(rows, exp_col_ind) {
                    for(var i = 0, l = rows.length; i < l; i++) {
                        exp_col_ind.toLowerCase() == "hide" ? Util.Style.acss(rows[i], "hidden") : Util.Style.rcss(rows[i], "hidden");
                    }
                }
    
                function toggleCollapseIcons(iconArray, collapseString) {
                    for(var j = 0, k = iconArray.length; j < k; j++) {
                        iconArray[j].innerHTML = collapseString
                    }
                }
    
                //Collapse all expanded child rows
                function collapseAll() {
                    Util.addEvent(_g("fullCollapseClick"), "click", function(e) {
                        Util.preventDefault(e);
                        var rowArray = Util.Style.g(childRowClass, document, "tr");
                        var iconArray = Util.Style.g("expand-collapse-icon", document, "span");
                        toggleHiddenCSS(rowArray, "hide");
                        toggleCollapseIcons(iconArray, "[+]");
                    });
                }
            }
        },
                
        stripeRows : function() {
            
            var table =  _g("TBODY_" + curActiveSubTab);
            var oddRow = false;
            //var patientRows = _gbt("tr", _g("TBODY_DEFAULT_TAB"));
            var patientRows = _gbt("tr", table);
            for(var i = 0, l = patientRows.length; i < l; i++) {
                //if(!isMyPatientRow(patientRows[i])) {

                if(Util.Style.ccss(patientRows[i], parentRowClass)) {
                    oddRow = !oddRow;
                }
                if(oddRow) {
                    Util.Style.acss(patientRows[i], "odd");
                    Util.Style.rcss(patientRows[i], "even");
                } else {
                    Util.Style.acss(patientRows[i], "even");
                    Util.Style.rcss(patientRows[i], "odd");
                }
                //}
            }
        },
                
        /**
         * format patient rows for coloring and family relationships
         * @param {Object} jsonData The patient rows to format
         */

        formatRows : function(jsonData, fieldClass) {
            var table =  _g("TBODY_" + curActiveSubTab);

            if(fieldClass == null) {
                fieldClass = "locs-field";
            }
            var patientRows = _gbt("tr", table);
            var extraRow = MpageDriver.getExtraRow();
            var familyArray = [], patientTypeState = "BEGINNING";
            for(var i = 0, l = patientRows.length; i < l; i++) {
                //BEGINNING STATE
                var patient = this.getPatientFromJsonData(jsonData, patientRows[i])
                var parentCheck = false;
                var childCheck = false;
                if(extraRow) {
                    parentCheck = Util.Style.ccss(patientRows[i], parentRowClass);
                    childCheck = Util.Style.ccss(patientRows[i], childRowClass);

                } else {
                    parentCheck = this.hasPatientAttribute(patient, parentRowClass);
                    childCheck = this.hasPatientAttribute(patient, childRowClass);
                }

                if(patientTypeState == "BEGINNING") {
                    if(parentCheck) {
                        patientTypeState = parentRowClass;
                        familyArray.push(patientRows[i]);
                        if(!extraRow) {
                            Util.Style.acss(patientRows[i], parentRowClass);
                        }
                    } else {
                        throw new Error("Parent Row was not first.  Something went very wrong.");
                    }

                }
                //PARENT-ROW STATE
                else if(patientTypeState == parentRowClass || patientTypeState == childRowClass) {
                    if(childCheck) {
                        //add child to family array
                        familyArray.push(patientRows[i]);
                        if(!extraRow) {
                            Util.Style.acss(patientRows[i], childRowClass);
                        }
                    } else {
                        //new family array
                        this.addExpandCollapse(familyArray, fieldClass);
                        familyArray = [];
                        familyArray.push(patientRows[i]);
                        if(!extraRow) {
                            Util.Style.acss(patientRows[i], parentRowClass);
                        }
                        patientTypeState = parentRowClass;
                    }
                } else {
                    throw new Error("Found other Patient Type STATE this not possible");
                }
            }
            //adds expand/collapse if a family ends the patient list
            this.addExpandCollapse(familyArray, fieldClass);
        },
        /**
         * determine if Patient is of the specified patient Type(for example:PARENT-ROW/CHILD-ROW)
         * @param {Object} patient object
         * @param {String} attribute The Patient attribute of the Patient Row (PARENT-ROW
         * or CHILD-ROW)
         * @return {Boolean} True if patient attribute meaning contains given
         * patientType, false otherwise
         */
        hasPatientAttribute : function(patient, attribute) {
            //var patient = getPatientFromJsonData(jsonData, person_id, encntr_id);
            for(var i = 0, l = patient.ATTRIBUTES.length; i < l; i++) {
                if(patient.ATTRIBUTES[i].MEANING.toUpperCase() === attribute.toUpperCase()) {
                    return true;
                }
            }
            return false;
        },
        /**
         * get Patient from jsonData based on row identifiers
         * @param {Object} jsonData Object containing patient rows
         * @param {Object} The patient row
         * @return {Object} specific patient determined by row identifiers
         */
        getPatientFromJsonData : function(jsonData, patientRow) {

            //var rowidentifiers = MpageDriver.getRowIdentifiers();
            var ids = this.getRowIdentifiersFromParentRow(patientRow);
            var found = false;
            if(ids.length - 1 == rowIdentifiers.length) {
                for(var i = 0, l = jsonData.QUAL.length; i < l; i++) {
                    var cnt = 1;

                    for(var x = 0, y = rowIdentifiers.length; x < y; x++) {
                        if(jsonData.QUAL[i][rowIdentifiers[x]] == ids[cnt] || ((jsonData.QUAL[i][rowIdentifiers[x]] + "-1") == ids[cnt] )) {
                            found = true;
                        } else {
                            found = false;
                            break;
                        }
                        cnt = cnt + 1;
                    }

                    if(found) {
                        return jsonData.QUAL[i];
                    }

                }
            }
        },
        
        getPatientExtraRow : getPatientExtraRow,
        
        getPatientRow : getPatientRow,
        
        /**
         * Get The Reference to current active view table
         *
         * @return {Object} object containing patient data for the current active view
         * 
         * @static
         * @function
         * @memberof MpageDriver
         * @name getCurActiveViewPtData
         */
        getCurActiveViewPtData: getCurActiveViewPtData,
        
        /**
         * Get The Reference to current active view table
         *
         * @return {Node} parent "tbody" that contains the current active view
         * 
         * @static
         * @function
         * @memberof MpageDriver
         * @name getCurActiveViewTable
         */
        getCurActiveViewTable: getCurActiveViewTable,
        
        /**
         * Toggle the patient display
         *  
         * @param {Object} patientData The object containing data for each patient 
         * @param {Boolean} displayInd Indicate whether patient should display or hide
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name togglePatientDisplay
         */
        togglePatientDisplay: togglePatientDisplay, 
    
        /**
         * add JavaScript events allowing for row expansion and collapse
         * @param {Array} familyArray The array containing the rows for each family relationship
         * @param {String} fieldClass The class where the expandCollapse icon should be added.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name addExpandCollapse
         */
        addExpandCollapse : function(familyArray, fieldClass) {

            if(familyArray.length > 1) {
                //add symbol to first row
                var parentLocationField = Util.Style.g(fieldClass, familyArray[0], "span")[0];
                var expandCollapseIcon = Util.cep("span", {
                    innerHTML : "[-]",
                    className : "expand-collapse-icon"
                });
                //take innerHTML and wrap in span
                var location = Util.cep("span", {
                    innerHTML : parentLocationField.innerHTML,
                    className : "patient-location"
                });
                //clear innerHTML
                $(parentLocationField).empty();
                //attach icon
                Util.ac(expandCollapseIcon, parentLocationField);
                //attach location
                Util.ac(location, parentLocationField);

                //alternates between [+] and [-] upon click event
                Util.addEvent(expandCollapseIcon, 'click', function(e) {
                    var target = e.target ? e.target : e.srcElement;
                    target.innerHTML = target.innerHTML === "[+]" ? "[-]" : "[+]";
                    for(var i = 1, l = familyArray.length; i < l; i++) {
                        Util.Style.tcss(familyArray[i], "hidden");
                    }
                });
            }
        },
        /**
         * get Parent Row Element that contains node
         * @param {Node} node
         * @return {Node} parent "td" that contains supplied node
         */
        getParentRow : function(node) {
            while(node && node.nodeName != "TR") {
                node = Util.gp(node);
            }
            return node;
        },
        /**
         * get row identifiers from row.id
         * @param {Node} node
         * @return {Array} row identifiers of Parent Row
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getRowIdentifiersFromParentRow
         */
        getRowIdentifiersFromParentRow : function(node) {
            var patientRow = this.getParentRow(node);
            var ids = (patientRow.id).split("_");

            return ids;
        },  
        /**
         * Get the current active primary tab
         * @return {String} curActivePrimaryTab Meaning of the currently active primary tab
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getCurrentPrimaryTabMeaning
         */ 
        getCurrentPrimaryTabMeaning: function(){
            return(curActiveSubTab);
        },      
        sortTable: function(sortBy,sortOrder){
            
            var table =  _g("TBODY_" + curActiveSubTab);
            TableSorter.sortBy(table, sortBy, sortOrder,parentRowClass);
            
        },
        /**
         * Setup a custom primary tab view with a view Method to be triggered when a tab is selected for view
         *
         * @param {String} tabMeaning Meaning of the tab as defined in setLayout
         * @param {Function} viewMethod Method to trigger when the tab is opened
         *
         * @description
         * <p>NOTE: The viewMethod is   triggered with the following parameters </p>
         * <code>
         * <pre>
         *      viewElement     - DOM element container for the tab view, any elements to display will need to be appended to this element
         *      patientsData        - Patients data for the patients to display on the tab
         *      tabElement      - DOM element referencing the actual tab
         *      tabSeq          - Sequence of the tab
         * </pre>
         * </code>
         * <p>An example view Method: </p>
         * <code>
         * <pre>
         *  MpageDriver.setPrimaryTabCustomView("METRICS",function(viewElement,patientsData,tabElement,tabSeq){
         *      // if test view was not added to the view element
         *      if($(".test-view",$(viewElement)).length == 0){
         *          $(viewElement).append("<span class='test-view'>This tab has some content </span>")
         *      }
         *  })
         * </pre>
         * </code>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setPrimaryTabCustomView
         */
        setPrimaryTabCustomView: function(tabMeaning,viewMethod){
            tabViewers[tabMeaning] = viewMethod;            
        },
        /**
         * Allow the user to create custom tabs
         *
         * @param {Function} customTabsMethod Method to build the Custom Tabs
         *
         * @description
         * <p>NOTE: The customTabsMethod is triggered once after the patients/rows have finished retrieving </p>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name defineCustomTabs
         */
        defineCustomTabs: function(customTabsMethod){
            customTabsCreateMethod = customTabsMethod;
        },
        /**
         * Seet the container element for the page
         *
         * @param {Element} containerEl The DOM element to set as the container for page
         *
         * @description
         * <p>NOTE: The default container element is document.body </p>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name setPageContainer
         */
        setPageContainer: function(containerEl){
            pageContainer = containerEl;
        },
        displayTab: function(){
        
        },
        /**
         * Finds the index of a patient in the curActiveViewPtData based off of specified qualifiers.
         * 
         * @param {Array} qualifiers an array containing anything you want to qualify on (person ID, encounter ID, etc).
         * @return {Integer} index of patient; -1 if no match was found.
         * 
         * @description
         * <p>An example of setting up a qualifier with person and encounter IDs</p>
         * <code>
         * <pre>
         * var qualifier = [{
         *     "NAME" : "PERSON_ID",
         *     "VALUE" : 1234567890
         * }, {
         *     "NAME" : "ENCNTR_ID",
         *     "VALUE" : 0987654321
         * }];
         * var ptIndex = MpageDriver.findPatient(qualifier);
         * alert(ptIndex);
         * </pre>
         * </code>
         * 
         * <p>If you wish to search by attributes, set the name to ATTRIBUTES and give the filter meaning, type, and value in an object for the value.</p>
         * 
         * <code>
         * <pre>
         * var qualifier = [{
         *     "NAME" : "ATTRIBUTES",
         *     "VALUE" : [{
         *      "MEANING" : "FN_TRACK_ID",
         *      "FILTER_TYPE" : "NUMERIC_VALUE",
         *      "FILTER_VALUE" : 0246810             
         *     }]
         * }];    
         * </pre>
         * </code>
         * 
         * @static
         * @function
         * @memberof MpageDriver
         * @name findPatient
         */
        findPatient : function(qualifiers) {
            var index = -1;
            var failInd = 0;
            var ptData = MpageDriver.getCurActiveViewPtData();
            if(qualifiers.length > 0) {
                for (var x = 0; x < ptData.QUAL.length; x++) {
                    failInd = 0;
                    for(var y = 0; y < qualifiers.length; y++) {                        
                        if(qualifiers[y].NAME != "ATTRIBUTES") {
                            if(ptData.QUAL[x][qualifiers[y].NAME] != qualifiers[y].VALUE) {
                                failInd = 1;
                                break;
                            }
                        } else {
                            var attributeIndex;
                            for(var z = 0; z < qualifiers[y].VALUE.length; z++) {
                                attributeIndex = MpageDriver.findAttribute(ptData.QUAL[x].ATTRIBUTES, qualifiers[y].VALUE);
                                if(attributeIndex == -1) {
                                    failInd = 1;
                                    break;
                                }
                            }    
                        }
                    }
                    if(failInd == 0) {
                        index = x;
                        break;
                    }
                }    
            }
            return index;
        },
        /**
         * Removes the patient from curActiveViewPtData and deletes rows from the table
         * 
         * @param {Array} qualifiers an array containing anything you want to qualify on (person ID, encounter ID, etc).
         * @return {Integer} status of removal; -1 removal failed.
         * 
         * @description
         * <p>An example of setting up a qualifier with person and encounter IDs</p>
         * <code>
         * <pre>
         * var qualifier = [{
         *     "NAME" : "PERSON_ID",
         *     "VALUE" : 1234567890
         * }, {
         *     "NAME" : "ENCNTR_ID",
         *     "VALUE" : 0987654321
         * }];
         * var ptIndex = MpageDriver.findPatient(qualifier);
         * alert(ptIndex);
         * </pre>
         * </code>
         * 
         * <p>If you wish to remove by attributes, set the name to ATTRIBUTES and give the filter meaning, type, and value in an object for the value.</p>
         * 
         * <code>
         * <pre>
         * var qualifier = [{
         *     "NAME" : "ATTRIBUTES",
         *     "VALUE" : [{
         *      "MEANING" : "FN_TRACK_ID",
         *      "FILTER_TYPE" : "NUMERIC_VALUE",
         *      "FILTER_VALUE" : 0246810             
         *     }]
         * }];    
         * </pre>
         * </code>
         * 
         * @static
         * @function
         * @memberof MpageDriver
         * @name removePatient
         */
        removePatient : function(qualifiers) {
            var index = -1;
            var statusInd =  -1;
            var removedPatient;
            var ptData = ptListData[curActiveSubTab];
			try{
				index = MpageDriver.findPatient(qualifiers);
				// found patient -> remove patient from list and remove the associate row from tab
				if(index >= 0){
					removedPatient = ptListData[curActiveSubTab].QUAL.splice(index,1);
					_.each(qualifiers,function(qualifier){
						removedPatient[qualifier.NAME] = qualifier.VALUE;
					});					
					$("#"+buildRowId(removedPatient),$(curActiveSubTabContentDOM)).remove(); 
					statusInd = 1;           	
				}
			}
			catch(e){
                alert(e.message + " \MpageDriver.removePatient");
			}
            return(statusInd)
        },
        /**
         * Adds patients to current active tab
         * 
         * @param {Object} patients an array containing list of new patients to add to display
         *          
         * @static
         * @function
         * @memberof MpageDriver
         * @name addPatients
         */
        addPatients : function(newPatients) {
			try{
                //Define the date/time for latest
                selectedPatientGrpDtTm = new Date();
                // Load Patient Group
				MpageDriver.loadPtGroup({
                            "response" : newPatients,
                            "parameters" : [selectedPatientGrpDtTm,curActiveSubTabContentDOM,curActiveSubTabSeq,curActiveSubTab]
                        });
			}
			catch(e){
                alert(e.message + " \MpageDriver.addPatients");
			}
        },
        /**
         * Returns the first index of a patient's attributes that match the qualifiers' values.
         *
         * @param {Array} attributes an array containing a patient's attributes.
         * @param {Array} qualifiers an array containing attribute values.
         * @return {Integer} index of attribute; -1 if no match was found.
         * 
         * @description
         * <p>An example of setting up a qualifier that will find attributes with meaning of ZONE and a DISPLAY_VALUE of MY_PATIENT.</p>
         * <code>
         * <pre>
         * var qualifier = [{
         *     "MEANING" : "ZONE",
         *    "FILTER_TYPE" : "DISPLAY_VALUE",
         *    "FILTER_VALUE" : "MY_PATIENT"
         * }];    
         * </pre>
         * </code>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name findAttribute
         */
        findAttribute : function(attributes, qualifiers) {
            var index = -1
            var filterMeaning = qualifiers[0].MEANING;
            var filterType = qualifiers[0].FILTER_TYPE;
            var filterValue = qualifiers[0].FILTER_VALUE;
            for(var x = 0; x < attributes.length; x++) {
                if(attributes[x].MEANING == filterMeaning && attributes[x][filterType] == filterValue) {
                    index = x;
                    break;
                }
            }
            return index;
        },
        
        /**
         * Fetch the attributes for the patient at the specified index.
         *
         * @param {Integer} index the position of the patient whose records you want to retrieve.
         * @return {Array} array containing the patients' attributes.
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name getAttributes
         */
        getAttributes : function(index) {
            var ptData = MpageDriver.getCurActiveViewPtData();
            return ptData.QUAL[index].ATTRIBUTES;    
        },
        
        /**
         * Attempts to find the specified attribute for a patient. If a match is found, the attribute is deleted. Either way, a new attribute is added.
         *
         * @param {Array} ptQualifier an array containing patient identification values.
         * @param {Array} attrQualifier an array containing attribute values.
         * @param {Object} newAttribute object containing the new attribute/its values
         * 
         * @description
         * <p>An example of execution.</p>
         * <code>
         * <pre>
         * var ptQualifier = [{
         *   "NAME" : "ATTRIBUTES",
         *     "VALUE" : [{
         *       "MEANING" : "FN_TRACK_ID",
         *       "FILTER_TYPE" : "NUMERIC_VALUE",
         *       "FILTER_VALUE" : 1234567890
         *   }]
         * }];
         * var attrQualifier = [{
         *      "MEANING" : "SOMETHING",
         *     "FILTER_TYPE" : "DISPLAY_VALUE",
         *     "FILTER_VALUE" : "ABC123"
         * }];
         * var newAttribute = {
         *     "DISPLAY_VALUE" : "123ABC",
         *    "DT_TM_VALUE" : "/Date(0000-00-00T00:00:00.000+00:00)/",
         *    "MEANING" : "SOMETHING",
         *    "NUMERIC_VALUE" : 0
         * };
         * MpageDriver.addAttribute(ptQualifier, attrQualifier, newAttribute);
         * </pre>
         * </code>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name addAttribute
         */
        addAttribute : function(ptQualifier, attrQualifier, newAttribute) {
            var patientIndex, attributeIndex;
            var ptData = MpageDriver.getCurActiveViewPtData();
            patientIndex = MpageDriver.findPatient(ptQualifier)
            if(patientIndex != -1) {
                attributeIndex = MpageDriver.findAttribute(ptData.QUAL[patientIndex].ATTRIBUTES, attrQualifier);
                if(attributeIndex != -1) {
                    ptData.QUAL[patientIndex].ATTRIBUTES.splice(attributeIndex, 1);
                    ptData.QUAL[patientIndex].ATTRIBUTE_CNT--; 
                }    
                ptData.QUAL[patientIndex].ATTRIBUTES.push(newAttribute);
                ptData.QUAL[patientIndex].ATTRIBUTE_CNT++; 
            } else {
                //MPageDriver.addAttribute - could not find patient
                return(0);
            }
        },
        
        /**
         * Attempts to find the specified attribute for a patient. If a match is found, the attribute is deleted.
         *
         * @param {Array} ptQualifier an array containing patient identification values.
         * @param {Array} attrQualifier an array containing attribute values.
         * 
         * @description
         * <p>An example of execution.</p>
         * <code>
         * <pre>
         * var ptQualifier = [{
         *   "NAME" : "ATTRIBUTES",
         *     "VALUE" : [{
         *       "MEANING" : "FN_TRACK_ID",
         *       "FILTER_TYPE" : "NUMERIC_VALUE",
         *       "FILTER_VALUE" : 1234567890
         *   }]
         * }];
         * var attrQualifier = [{
         *      "MEANING" : "ZONE",
         *     "FILTER_TYPE" : "DISPLAY_VALUE",
         *     "FILTER_VALUE" : "MY_PATIENT"
         * }];
         * MpageDriver.deleteAttribute(ptQualifier, attrQualifier);
         * </pre>
         * </code>
         *
         * @static
         * @function
         * @memberof MpageDriver
         * @name deleteAttribute
         */
        deleteAttribute : function(ptQualifier, attrQualifier) {
            var patientIndex, attributeIndex;
            var ptData = MpageDriver.getCurActiveViewPtData();
            patientIndex = MpageDriver.findPatient(ptQualifier);
            if(patientIndex != -1) {
                attributeIndex = MpageDriver.findAttribute(ptData.QUAL[patientIndex].ATTRIBUTES, attrQualifier);
                if(attributeIndex != -1) {
                    ptData.QUAL[patientIndex].ATTRIBUTES.splice(attributeIndex, 1);
                    ptData.QUAL[patientIndex].ATTRIBUTE_CNT--; 
                } else {
                    //MPageDriver.deleteAttribute - could not find attribute
                    return(0);
                }
            } else {
                //MPageDriver.deleteAttribute - could not find patient
                return(0);
            }
        },
        /**
         * Set the indicator to save sorting done within a session.(default setting is false)
         *
         * @param {Boolean} Indicator to save sorting done within a session.
         * 
         * @static
         * @function
         * @memberof MpageDriver
         * @name saveSessionSorting
         */
        saveSessionSorting: function(saveInd){
        	saveSessionSortingInd = saveInd
        }        
    };

}();
// initialize criterion values
MpageDriver.initializeCriterion();

//Set i18n Path
if(typeof CERN_static_content === 'undefined'){
    i18nUtility.setJSPath("../i18n/");
    i18nUtility.setLocale(i18nUtility.getLocaleLanguage(), i18nUtility.getLocaleCountry());
}

var resizePage = function(e) {
    try {
        var vs = Util.Pos.gvs(), tabsWrapperHeight, selHdr = Util.Style.g("pt-sel"), pgHdr = Util.Style.g("ps-hd"), tabsOutContainerHeight, tabContainers = Util.Style.g("tabContainer"), pageFooter = Util.Style.g("pageFooter"), pageFooterHeight, tabsOutHeaderHeight, taboutContainers = Util.Style.g("tabOuterContainer"), tabWrappers = Util.Style.g("tabsWrapper"), tabContents, tabHeaders, cntr = 0, len = 0, cntr2 = 0, len2 = 0, tableLayoutWrapperNode, tabContentsChildNode, currentTableNode;
        tabsWrapperHeight = vs[0] - selHdr[0].offsetHeight - pgHdr[0].offsetHeight - 10;
        if(pageFooter[0]) {
            pageFooterHeight = pageFooter[0].offsetHeight;
            tabsWrapperHeight = tabsWrapperHeight - pageFooterHeight;
        }
        len = tabWrappers.length;
        for( cntr = 0; cntr < len; cntr++) {
            tabWrappers[cntr].style.height = (tabsWrapperHeight) + "px";
        }
        len = taboutContainers.length;
        for( cntr = 0; cntr < len; cntr++) {
            tabContents = Util.Style.g("tab-layout-tab", taboutContainers[cntr], "div");
            tabHeaders = Util.Style.g("tab-layout-nav", taboutContainers[cntr], "ul");
            taboutContainers[cntr].style.height = (tabsWrapperHeight - tabHeaders[0].offsetHeight) + "px";
            taboutContainers[cntr].style.width = (vs[1] - 10) + "px";
            len2 = tabContents.length;
            for( cntr2 = 0; cntr2 < len2; cntr2++) {
                if(tabsWrapperHeight - tabHeaders[0].offsetHeight - tabHeaders[0].offsetHeight - 10 > 0) {
                    tabContents[cntr2].style.height = (tabsWrapperHeight - tabHeaders[0].offsetHeight - tabHeaders[0].offsetHeight) + "px";
                    tabContents[cntr2].style.width = (vs[1] - 10) + "px";
                    tabContentsChildNode = Util.gcs(tabContents[cntr2])[0];
                    if(tabContentsChildNode) {
                        tabContentsChildNode.style.height = (tabsWrapperHeight - tabHeaders[0].offsetHeight - tabHeaders[0].offsetHeight) + "px";
                        tabContentsChildNode.style.width = (vs[1] - 10) + "px";
                    }
                    tableLayoutWrapperNode = Util.Style.g('table-layout-wrapper-table',tabContents[cntr2])[0];
                    if(tableLayoutWrapperNode) {
                        tableLayoutWrapperNode.style.height = (tabsWrapperHeight - tabHeaders[0].offsetHeight - tabHeaders[0].offsetHeight) + "px";
                        tableLayoutWrapperNode.style.width = (vs[1] - 10) + "px";
                    }

                }
            }
        }
    } catch (err) {
        //alert(err.message+"resize")
    }

};

Util.Load.add(MpageDriver.initiateMpage); 

Util.addEvent(window, "resize", resizePage);

Util.addEvent(window, "unload", function() {
    WorklistStorage.set("StoredTabSeq", MpageDriver.selectedTabSeq());
    window.location.reload(true);
});

/**
 * Encode the delimiters in given string into HTML character codes.<br/>
 *  
 * @return {String} encodedString String with encoded delimiter html characters.
 * 
 * @static
 * @function
 * @memberof String
 * @name encodeStringDelimiters
 */
String.prototype.encodeStringDelimiters= function(){
    if(this && this != undefined && this > " "){
        return this.split('"').join("&#34;").split('^').join("&#94;").split("'").join("&#39");
   }
   else{
       return "";
   }   
};
/**
 * @fileoverview
 * <strong>wklst-core-list-select.js</strong>
 * <p>
 * This file contains the WorklistSelection object implementing the core functionality of the patient list selection in worklist mpage framework.
 * WorklistSelection provides methods to render/manage the patient list selection component of a worklist mpage.
 * </p>
 * Copyright 2011. Cerner Corporation
 * @author Innovations Development
 */

/**
 * This singleton encapsulates all utility methods for rendering/managing the patient list selection component of worklist mpage framework.
 * @namespace WorklistSelection
 * @static
 * @global
 */
var WorklistSelection = ( function() {
	//General Global Variable.
	var gblWorklistJSON = ""; // available as global
	var gblDefaultCounter = 0; // available as global
	var gblPTList = 0;
	var gblFacility = 0;
	var gblPTLists = "";
	var gblStoredOtherSources = "";
	var selectedPatientListDtTm;
	var selectedUnits = [];
	var selectedPatientList = "";
	var selectedFacility = "";
	var selectedOtherSources = "";
	var selectLoadingInProgress = false;
	//Set Dialog Function defaults
	var launchDialogFunction = function(){return(0);}
	var submitDialogFunction = function(){return(0);}
	//PrefMaint
	var userId = "0";
	var BrTopicMean = "";
	var persistedSelection = false;
	var applicationId = "0";
	var AjaxIconHTML = '<span valign="top"><span class="ajax-loader"></span></span>';
	var selectionsJSON = "";

	//function for default load capability on facilities and nurse units
	function getMPGlobalVariableTracker(){
		var intBWDEFPOP = 0;
		var intPTCNT = 0;
		var intFUCNT = 0;
		var gblTimeoutID;
	    var facilityDropDown = _g("ddlFacility");
		var ptListDDL = _g("ddlPTList");
		
		try
		{
			if(gblWorklistJSON != ''){
				//clear timeout.
				clearTimeout(gblTimeoutID);
				
				intBWDEFPOP = gblWorklistJSON.LISTREPLY.BWDEFPOP;
				// no previous selections on facility or patient list => brand new page
				if(selectedFacility === "" && selectedPatientList === ""){
					//default load patient list 
					if(intBWDEFPOP == 1 ){
						intPTCNT = gblWorklistJSON.LISTREPLY.PTCNT;
						if(intPTCNT > 0){
							if(Util.Style.g("WLButtonDefaultText")[0]){
								Util.Style.g("WLButtonDefaultText")[0].disabled = true;
							}
							if(Util.Style.g("fnListDefault")[0]){
								Util.Style.g("fnListDefault")[0].selected = "selected";
							}						
							if(ptListDDL) {
								_gbt("option",ptListDDL)[1].selected = "selected";
								WorklistSelection.verifySelections(2);
							}
	
						}
					}
					//default load a nurse unit 
					else if(intBWDEFPOP == 2){
						intFUCNT = gblWorklistJSON.LISTREPLY.FUCNT;
						
						if(intFUCNT > 0 && facilityDropDown){
							facilityDropDown.disabled = false;
							if(Util.Style.g("WLButtonDefaultText")[0]){
								Util.Style.g("WLButtonDefaultText")[0].disabled = true;
							}
							if(Util.Style.g("ptListDefault")[0]){
								Util.Style.g("ptListDefault")[0].selected="selected";
							}
							//Check for default nurse units
							WorklistSelection.verifySelections(3);
						}
					}
				}
					
			}
			else{
				//do this again within 2 seconds.
				gblTimeoutID = setTimeout("getMPGlobalVariableTracker()", 2000);
			}
		}catch(error){
			showErrorMessage(error.message, "getMPGlobalVariableTracker", "", "");
		}
	}
	
	function resetSelectLoadingInProgress(){
		selectLoadingInProgress = false; 
		
		//  notify that selections have completed loading
		MpageDriver.notifyObservers("select-loaded", {});
	}
	
	function setSelectLoadingInProgress(){		
		selectLoadingInProgress = true; 
		
		//  notify that selections have completed loading
		MpageDriver.notifyObservers("select-inprogress", {});
	}

	function handleNoListsFound() {
		document.getElementById("spanExtraButton").className = "gen-cent-msg "
		document.getElementById("spanExtraButton").innerHTML = i18n["PATIENT_LISTS_NOT_FOUND"];
		MpageDriver.getPageFooterNode().style.display = "none";
	}
	
	function displayRequiredSelectMessage(){
		var loadDialogText = "";		
		if(gblWorklistJSON.LISTREPLY.FUCNT > 0 && gblWorklistJSON.LISTREPLY.PTCNT > 0){
			loadDialogText = i18n.INSMESSAGE_PL_FN;				
		}
		else if(gblWorklistJSON.LISTREPLY.FUCNT > 0 && gblWorklistJSON.LISTREPLY.PTCNT == 0){
			loadDialogText = i18n.INSMESSAGE_FN
		}
		else if(gblWorklistJSON.LISTREPLY.FUCNT == 0 && gblWorklistJSON.LISTREPLY.PTCNT > 0){
			loadDialogText = i18n.INSMESSAGE_PL
		}
		if(!selectLoadingInProgress){
			_g("WorklistLoading").innerHTML = "<b>" + loadDialogText + "</b>";
		}
	}
	
	function buildOtherSourceSelections(otherSourcesList){
		var strListHTML = "", strSourceHTML = "",otherSourcesDataString = "",storedSources = null, sourcesChanged = false;
	
		//Get stored "window.name" value.
		gblStoredOtherSources = decodeURIComponent(unescape(WorklistStorage.get("StoredOtherSourcesList").split("%25").join("%")));
		otherSourcesDataString = AjaxHandler.stringify_json(otherSourcesList);
		if(gblStoredOtherSources){
			storedSources = AjaxHandler.parse_json(gblStoredOtherSources);		
		}
		
		//Loop through the record structure.					
		strListHTML += "<NOBR>";
		strListHTML += '<span class="WLTable other-source-selections" >';
		// check if source types changed
		if(storedSources && otherSourcesList.length != storedSources.length ){
			sourcesChanged = true;
		}
		_.each(otherSourcesList,function(sourceType,typeIndex){
			var sourcesList = sourceType.SOURCES;
			var sourceTypeName = i18n[sourceType.SOURCE_TYPE_MEANING];
			if(!sourceTypeName){
				sourceTypeName = sourceType.SOURCE_TYPE_DISPLAY
			}
			strListHTML += '<span class="WLText">' + sourceTypeName + '&nbsp;';
			strListHTML += '<select id="'+sourceTypeName+'" name="'+sourceTypeName+'" class="WLDropDownText" onchange="javascript:WorklistSelection.verifyOtherListSelection('+typeIndex+',this.value);">';
			strListHTML += '<option value="-1">';
			strListHTML += i18n["SELECT_OTHER_SOURCE"]+" "+sourceTypeName;
			strListHTML += '</option>';
			strSourceHTML = "";
			// check if total sources changed
			if(storedSources && storedSources[typeIndex] && sourcesList.length != storedSources[typeIndex].SOURCES.length ){
				sourcesChanged = true;
			}
			_.each(sourcesList,function(source,sourceIndex){
				var source_id = source.SOURCE_ID;
				var source_disp = source.SOURCE_DISPLAY;
				strSourceHTML += '<option value="';
				strSourceHTML += sourceIndex;
				strSourceHTML += '"';

				//Verify if the stored value is not undefined.
				if(storedSources && parseInt(storedSources[typeIndex].SOURCES[sourceIndex].SELECTED_IND,10) === 1) {
					strSourceHTML += ' selected="selected"';
				}
				
				strSourceHTML += '>';
				strSourceHTML += source_disp;
				strSourceHTML += '</option>';
			});
			
			strListHTML += strSourceHTML;
			strListHTML += '</select>';
			strListHTML += '</span>';
		});
		
		// If sources changed since last save, reset selection
		if(gblStoredOtherSources == 'undefined' || sourcesChanged) {
			gblStoredOtherSources = otherSourcesDataString;
		}
			
		// Set Source types to storage
		WorklistStorage.set("StoredOtherSourcesList", gblStoredOtherSources);

		strListHTML += '</span>';
		strListHTML += "</NOBR>";
		
		return (strListHTML)
	}
	
	function verifyOtherListSelection(typeIndex,sourceIndex) {
			try {
				if(parseInt(sourceIndex,10) >= 0 ){
					var storedSources = AjaxHandler.parse_json(unescape(WorklistStorage.get("StoredOtherSourcesList").split("%25").join("%")))
						,storedTypeIndex = WorklistStorage.get("StoredOtherSourceTypeIndex")
						,storedSourceIndex = WorklistStorage.get("StoredOtherSourceIndex")
						,otherSourcesDataString = "";
						
					// Reset previous selections
					if(storedTypeIndex && storedTypeIndex >= 0 && storedSourceIndex && storedSourceIndex >= 0){
						storedSources[typeIndex].SELECTED_IND = 0
						storedSources[storedTypeIndex].SOURCES[storedSourceIndex].SELECTED_IND = 0;
					}
					// Set new selections
					storedSources[typeIndex].SELECTED_IND = 1;
					storedSources[typeIndex].SOURCES[sourceIndex].SELECTED_IND = 1;
			
					//Get stored "window.name" value.
					otherSourcesDataString = AjaxHandler.stringify_json(storedSources);
					gblStoredOtherSources = otherSourcesDataString;
					
					// Update save data
					WorklistStorage.set("StoredOtherSourcesList", gblStoredOtherSources);
					WorklistStorage.set("StoredOtherSourceTypeIndex", typeIndex);
					WorklistStorage.set("StoredOtherSourceIndex", sourceIndex);
				
					WorklistSelection.verifySelections(1);
				}
			} catch (error) {
				showErrorMessage(error.message, "verifyOtherListSelection", "", "");
			}
		}
	function persistSelections(persistInd){
		persistedSelection = persistInd;	
	}
	
	/**
	 * Loads the worklist. Returns True if everything went well else it returns False.
	 * @private
	 * @return {Boolean}
	 */
	function loadWorklist() {
		var blnStatus = true;
		var strHTML = "";
		var strListHTML = "";
		//Patient List
		var intPTCNT = 0;
		var strStoredPTList = "";
		var strPTLists = "";
		var intLISTSEQ = 0;
		var strPatientList = "";
		//Facilities and Units
		var intFUCNT = 0;
		var strStoredFacility = "";
		var intDEFAULTIND = 0;
		var intORGID = 0;
		var strFacility = "";
		//Other Sources
		var int_OTHER_SOURCE_TYPE_CNT = 0;
		
		var gblStoredOtherSources = "";
		var criterion = MpageDriver.getCriterion();
		var list_source_name = criterion.list_source_name;
		var storedTypeIndex ;
		var storedSourceIndex ;
		var list_source_display;
		try {
			//Get total number of patient lists.
			intPTCNT = gblWorklistJSON.LISTREPLY.PTCNT;
			//Get total number of facilities.
			intFUCNT = gblWorklistJSON.LISTREPLY.FUCNT;
			//Get total number of other sources.
			int_OTHER_SOURCE_TYPE_CNT = gblWorklistJSON.LISTREPLY.OTHER_SOURCE_TYPE_CNT;
			// list is from other source types
			if(list_source_name && list_source_name > " ") {
				if(int_OTHER_SOURCE_TYPE_CNT > 0) {
					strListHTML+= WorklistSelection.buildOtherSourceSelections(gblWorklistJSON.LISTREPLY.OTHER_SOURCE_TYPES);
				}
			}
			// for other list sources
			else {
				//Verify if there are any patient lists.
				if(intPTCNT > 0) {
					//Sort the patient list in the same order as in PowerChart.
					gblWorklistJSON.LISTREPLY.PTLIST.sort(function(a, b) {
						return sortBySequence("LISTSEQ", a, b)
					});
					//Get stored "window.name" value.
					strStoredPTList = WorklistStorage.get("StoredPTList",persistedSelection);
					gblPTLists = WorklistStorage.get("StoredPTLists",persistedSelection);
					strPTLists = "";
					//Loop through the record structure.
					for(var intCounter = 0; intCounter < intPTCNT; intCounter++) {
						// Set the Patient Lists
						strPTLists += "-" + gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTNM
					}
					// If patient lists changed since last save, reset selection
					if(gblPTLists != strPTLists) {
						strStoredPTList = 'undefined';
						gblPTLists = strPTLists;
					}
					
					//default select value for patient list drop down
					strPatientList += '<option class="ptListDefault" value="default">'+i18n["DEFAULT_PTLIST"]+'</option>';

					//Loop through the record structure.
					for(var intCounter = 0; intCounter < intPTCNT; intCounter++) {
						//Reset variable.
						intLISTSEQ = 0;

						//LISTSEQ
						intLISTSEQ = gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTSEQ;
						strPatientList += '<option value="';
						strPatientList += intLISTSEQ;
						strPatientList += '"';

						//Verify if the stored value is not undefined.
						if(strStoredPTList != 'undefined') {
							if(strStoredPTList == intLISTSEQ) {
								strPatientList += ' selected="selected"';
							}
						}
						strPatientList += '>';
						strPatientList += gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTNM;
						strPatientList += '</option>';
					}
					// Set patients lists to storage
					WorklistStorage.set("StoredPTLists", gblPTLists,persistedSelection);
					//Build Patient List.
					strListHTML += "<NOBR>";
					strListHTML += '<span class="WLTable">';
					strListHTML += '<span class="WLText">' + i18n["PATIENT_LIST"] + '&nbsp;';
					strListHTML += '<select id="ddlPTList" name="ddlPTList" class="WLDropDownText" onchange="javascript:WorklistSelection.verifyPatientList();">';
					strListHTML += strPatientList;
					strListHTML += '</select>';
					strListHTML += '</span>';
					strListHTML += '</span>';
					strListHTML += "</NOBR>";
				}

				//Verify if there are any facilities.
				if(intFUCNT > 0) {
					//Get stored "window.name" value.
					strStoredFacility = WorklistStorage.get("StoredFacility");
					
					//default select value for facility drop down
					strFacility += '<option class="fnListDefault" value="default">'+i18n["DEFAULT_FACILITY"]+'</option>';

					//Loop through the record structure.
					for(var intCounter = 0; intCounter < intFUCNT; intCounter++) {
						//Reset variables.
						intDEFAULTIND = 0;
						intORGID = 0;

						//DEFAULTIND and ORGID.
						intDEFAULTIND = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].DEFAULTIND;
						intORGID = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGID;

						//Verify if the stored value is not undefined.
						if(strStoredFacility != 'undefined') {
							if(strStoredFacility == intORGID) {
								strFacility += '<option selected="selected" value="';
								gblDefaultCounter = intCounter;
							} else {
								strFacility += '<option value="';
							}
						} else {
							//Verify default indicator facility.
							if(intDEFAULTIND == 1) {
								strFacility += '<option selected="selected" value="';
								gblDefaultCounter = intCounter;
							} else {
								strFacility += '<option value="';
							}
						}
						strFacility += intORGID;
						strFacility += '">';
						strFacility += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGNAME;
						strFacility += '</option>';
					}

					//Build Facility and Unit.
					strListHTML += "<NOBR>";
					//Verify if there are any patient lists specified before facilities
					strListHTML += '<span class="WLTable">';
					strListHTML += '<span class="WLText">' + i18n["FACILITIES_LABEL"] + '</span>';
					strListHTML += '<select id="ddlFacility" name="ddlFacility" class="WLDropDownText" title="' + i18n["SELECT_FACILITIY"] + '" onchange="javascript:WorklistSelection.verifyFacility();">';
					strListHTML += strFacility;
					strListHTML += '</select>';
					strListHTML += '<span class="WLText">';
					strListHTML += '<span id="spanUnitLink">';
					strListHTML += '<a href="#" onclick="javascript:WorklistSelection.LaunchUnitWindow();" class="WLLinkText" title="' + i18n["CLICK_OPEN_NURSE_UNITS"] + '">' + i18n["NURSE_UNITS"] + '</a>';
					strListHTML += '</span>';
					strListHTML += '</span>';
					strListHTML += '</span>';
					//only show submit button if patient list is present
					if(intPTCNT > 0){
						strListHTML += '<input type="button" id="btnSubmit" name="btnSubmit" value="' + i18n.SUBMIT_BUTTON + '" onclick="javascript:WorklistSelection.verifySelections(1);" class="WLButtonDefaultText" style="width:50px">';
						strListHTML += '<input type="button" id="btnReset" name="btnReset" value="Reset" onclick="javascript:WorklistSelection.resetSelections();" class="WLButtonDefaultText" style="width:50px">';
						strListHTML += "</NOBR>";
					}
				}
			}
			//Build main HTML table.
			strHTML += '<table cellpadding="0" cellspacing="0" border="0">';
			strHTML += '<tr>';
			strHTML += '<td valign="top">';
			// Append list html
			strHTML += strListHTML;
			strHTML += '<span id="spanExtraButton"></span>';
			strHTML += '</td>';
			strHTML += '</tr>';
			strHTML += '<tr>';
			strHTML += '<td valign="top">';
			strHTML += '<span id="spanUnitLoadText"></span>';
			strHTML += '</td>';
			strHTML += '</tr>';
			strHTML += '</table>';

			//Assign HTML.
			if(document.getElementById("divOpenWrklist")){
				document.getElementById("divOpenWrklist").innerHTML = strHTML;
			}

			// list source is from other source
			if(list_source_name && list_source_name > " ") {
				// If Other sources found => load first other source
				if(int_OTHER_SOURCE_TYPE_CNT > 0) {
					storedTypeIndex = WorklistStorage.get("StoredOtherSourceTypeIndex");
					storedSourceIndex = WorklistStorage.get("StoredOtherSourceIndex");
					if(storedTypeIndex && storedSourceIndex && storedTypeIndex >= 0 && storedSourceIndex >= 0 ){
						WorklistSelection.verifyOtherListSelection(storedTypeIndex,storedSourceIndex);
					}
				}
			} else {
				// If no facilities -> default load first patient list
				if(intFUCNT == 0 && intPTCNT > 0) {
					document.getElementById("ddlPTList").onchange();
				}
				//If no facilities and no patient list
				if(intFUCNT == 0 && intPTCNT == 0) {
					handleNoListsFound();
				}
				else{
					// no selections made on patient list
					if(selectedFacility === "" && selectedPatientList === ""){
						// display required selections Message
						displayRequiredSelectMessage();
					}
				}
			}
			//Notify the list selections built observer
			MpageDriver.notifyObservers("list-selections-built")
			//default load if available
			getMPGlobalVariableTracker();
			
		} catch (error) {
			//Hide load text.
			hideWorklistLoadText("divOpenWrklist");
			showErrorMessage(error.message, "loadWorklist", "", "");
			blnStatus = false;
		}
	}

	/**
	 * Loads the unit window.
	 * @private
	 */
	function loadUnitWindow() {
		var strHTML = "";
		var intTotalUnit = 0;
		var intDEFAULTIND = 0;
		var intCheckboxCounter = 1;
		var strUnit = "";

		try {
			//Reset DIV.
			document.getElementById("nurseUnitsDiv").innerHTML = "";
			strHTML += '<table cellspacing="0" cellpadding="0" class="WLTable" border="0">';
			strHTML += '<tr>';
			strHTML += '<td valign="top" class="WLText" colspan="3">' + i18n["SELECT_ONE_OR_MORE_NURSE_UNITS"] + '</td>';
			strHTML += '</tr>';

			//Total number of units.
			intTotalUnit = gblWorklistJSON.LISTREPLY.FUQUAL[gblDefaultCounter].LOCNT;

			//Loop through the record structure.
			for(var intCounter = 0; intCounter < intTotalUnit; intCounter++) {
				//Reset variable.
				intDEFAULTIND = 0;

				//Verify if counter is greater than 3.
				if(intCheckboxCounter > 3) {
					//Reset variable.
					intCheckboxCounter = 1;
				}

				//Verify if counter is equal to 0.
				if(intCheckboxCounter == 1) {
					strUnit += '<tr>';
				}
				strUnit += '<td valign="top" class="WLText">';
				//Default Indicator Unit
				intDEFAULTIND = gblWorklistJSON.LISTREPLY.FUQUAL[gblDefaultCounter].LOCQUAL[intCounter].DEFAULTIND;
				//Verify if there is a default unit.
				if(intDEFAULTIND == 1) {
					strUnit += '<input type="checkbox" class="nurse-units" id="chkHead'
					        + intCounter
					        + '" name="checkHead' + intCounter + '" checked value="';
				} else {
					strUnit += '<input type="checkbox" class="nurse-units" id="chkHead'
					        + intCounter
					        + '" name="checkHead' + intCounter + '" value="';
				}
				strUnit += gblWorklistJSON.LISTREPLY.FUQUAL[gblDefaultCounter].LOCQUAL[intCounter].NULOCATIONCD;
				strUnit += '" />';
				strUnit += gblWorklistJSON.LISTREPLY.FUQUAL[gblDefaultCounter].LOCQUAL[intCounter].LOCATIONDISP;
				strUnit += '</td>';

				//Verify if counter is equal to 3.
				if(intCheckboxCounter == 3) {
					strUnit += '</tr>';
				}

				//Add 1 to counter.
				intCheckboxCounter = parseInt(intCheckboxCounter) + parseInt(1);
			}
			if(intTotalUnit > 0) {
				if(intCheckboxCounter != 4) {
					strUnit += '</tr>';
				}
			}
			strHTML += strUnit;
			strHTML += '</table>';

			document.getElementById("nurseUnitsDiv").innerHTML = strHTML;

			//Hide load text.
			hideWorklistLoadText("spanUnitLoadText");

			$("#dialog:ui-dialog").dialog("destroy");

			$("#nurseUnitsDiv").dialog({
				height : 600,
				width : 600,
				modal : true,
				buttons : {
					"Submit" : function() {
						submitDialogFunction();
						WorklistSelection.verifySelections(0);
					},
					Cancel : function() {
						$(this).dialog("close");
					}
				},
				open: launchDialogFunction
			});
		} catch (error) {
			showErrorMessage(error.message, "loadUnitWindow", "", "");
		}
	}

	/**
	 * Sorts by the element LISTSEQ in numerical order. Returns less than 0 or greater than 0.
	 * @private
	 * @param {Integer} seq Value from the element LISTSEQ.
	 * @param {Integer} a Sort variable called a.
	 * @param {Integer} b Sort variable called b.
	 * @return {Integer}
	 */
	function sortBySequence(seq, a, b) {
		var valA = parseInt(a[seq],10),valB = parseInt(b[seq],10) ;
		return ((valA < valB) ? -1 : ((valA > valB) ? 1 : 0));
	}

	/**
	 * Displays loading text.
	 * @private
	 * @param {String} strElementID Contains the element id.
	 */
	function displayWorklistLoadText(strElementID) {
		var strHTML = "";

		try {
			//Verify which element id it is.
			switch (strElementID) {
				case "spanUnitLoadText":
					strHTML += '<span valign="top" class="WLLoadText"><b>' + i18n["LOADING_NURSE_UNITS"] + '</b></span>';
					break;
			}
			strHTML += AjaxIconHTML;
			//Display element.
			document.getElementById(strElementID).style.visibility = "";
			//Assign HTML.
			document.getElementById(strElementID).innerHTML = strHTML;
		} catch (error) {
			showErrorMessage(error.message, "displayWorklistLoadText", "", strElementID);
		}
	}

	/**
	 * Hides loading text.
	 * @private
	 * @param {String} strElementID Contains the element id.
	 */
	function hideWorklistLoadText(strElementID) {
		try {
			if(document.getElementById(strElementID)){
				//Reset element.
				document.getElementById(strElementID).innerHTML = "";
				//Hide load text.
				document.getElementById(strElementID).style.visibility = "hidden";
			}
		} catch (error) {
			showErrorMessage(error.message, "hideWorklistLoadText", "", strElementID);
		}
	}

	/**
	 * Displays Error Message.
	 * @private
	 * @param {String} errorMessage Error Message.
	 * @param {String} functionName Name of the function where the error occurred.
	 * @param {String} strStatus The requestAsync status.
	 * @param {String} strParameters Input parameters that are used to call the CCL script or function.
	 */
	function showErrorMessage(errorMessage, functionName, strStatus, strParameters) {
		var completeErrorMessage = "";
		//Set Error Message.
		completeErrorMessage += "Error Message: ";
		completeErrorMessage += errorMessage;
		completeErrorMessage += "\nFunction: ";
		completeErrorMessage += functionName;
		completeErrorMessage += "\nStatus: ";
		completeErrorMessage += strStatus;
		completeErrorMessage += "\nParameters: ";
		completeErrorMessage += strParameters;
		alert(completeErrorMessage);
	}

	/**
	 * This function is called when the web page is "on unload". It will store a value in "window.name" that is used
	 * to determine if a debug mode is going to be activated or not.
	 * @private
	 */
	function refreshWorklistPage() {
		try {
			WorklistStorage.set("StoredDebugMode", gblDebugMode);
			window.location.reload(true);
		} catch (error) {
			showErrorMessage(error.message, "refreshWorklistPage", "", "");
		}
	}

	return ( {
		/**
		 * Retrieve the selected Nurse Units
		 * @return {Array} selectedUnits	JSON Array specifying the selected Nurse Units
		 *
		 * @description
		 * <p>Example selectedUnits: </p>
		 * <code>
		 * <pre>
		 *  [
		 *     {
		 *        "DISPLAY":"8 West",
		 *        "CODE_VALUE":4035558.000000
		 *     }
		 *  ]
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name getSelectedUnits
		 */
		getSelectedUnits : function() {
			return (selectedUnits);
		},
		/**
		 * Retrieve the selected Facility
		 * @return {Object} selectedFacility	JSON Object specifying the selected Facility
		 *
		 * @description
		 * <p>Example selectedFacility: </p>
		 * <code>
		 * <pre>
		 *  {
		 *     "DISPLAY":"AMI Organization",
		 *     "CODE_VALUE":619843.000000
		 *  }
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name getSelectedFacility
		 */
		getSelectedFacility : function() {
			return (selectedFacility);
		},
		/**
		 * Retrieve the selected PatientList
		 * @return {Object} selectedPatientList	JSON Object specifying the selected Patient List
		 *
		 * @description
		 * <p>Example selectedPatientList: </p>
		 * <code>
		 * <pre>
		 *  {
		 *     "DISPLAY":"Test List",
		 *     "ID":600125.000000
		 *  }
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name getSelectedPatientList
		 */
		getSelectedPatientList : function() {
			return (selectedPatientList);
		},
		/**
		 * Set the selected Nurse Units
		 * @param {Array} selectedUnits	JSON Array specifying the selected Nurse Units
		 *
		 * @description
		 * <p>Example selectedUnits: </p>
		 * <code>
		 * <pre>
		 *  [
		 *     {
		 *        "DISPLAY":"8 West",
		 *        "CODE_VALUE":4035558.000000
		 *     }
		 *  ]
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name setSelectedUnits
		 */
		setSelectedUnits : function(selUnits) {
			selectedUnits = selUnits;
		},
		/**
		 * Set the selected Facility
		 * @param {Object} selectedFacility	JSON Object specifying the selected Facility
		 *
		 * @description
		 * <p>Example selectedFacility: </p>
		 * <code>
		 * <pre>
		 *  {
		 *     "DISPLAY":"AMI Organization",
		 *     "CODE_VALUE":619843.000000
		 *  }
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name setSelectedFacility
		 */
		setSelectedFacility : function(selFacility) {
			selectedFacility = selFacility;
		},
		/**
		 * Set the selected PatientList
		 * @param {Object} selectedPatientList	JSON Object specifying the selected Patient List
		 *
		 * @description
		 * <p>Example selectedPatientList: </p>
		 * <code>
		 * <pre>
		 *  {
		 *     "DISPLAY":"Test List",
		 *     "ID":600125.000000
		 *  }
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name setSelectedPatientList
		 */
		setSelectedPatientList : function(selPatientList) {
			selectedPatientList = selPatientList;
		},
		/**
		 * Method for verifying of other source selections and updating the "StoredOtherSourcesList" WorlistStorage variable with selections
		 * <p> NOTE: This method doesn't need to be invoked if buildOtherSourceSelections is not overriden.</p>
		 * <p> OVERRIDE NOTE: Please refer to the default method when creating the override method. WorklistSelection.verifySelections(1) 
		 * must be invoked in this method to trigger selections loading patients.</p>
		 * 
		 * @param {Object} otherSourcesList	JSON List specifying the list of other source types
		 * @return {String} sourceSelectionHTML HTML containing source selection 
		 * 
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name buildOtherSourceSelections
		 */
		/*
		 * 
		 */
		setLaunchDialogFunction: function( openDiagFunc ){
			launchDialogFunction = openDiagFunc
		},
		/*
		 * 
		 */
		setSubmitDialogFunction: function( closeDiagFunc){
			submitDialogFunction = closeDiagFunc
		},
		
		buildOtherSourceSelections: buildOtherSourceSelections,
		/**
		 * Launches the unit window.
		 */
		LaunchUnitWindow : function() {
			var intPTCNT = 0;
			var intSelectedID = document.getElementById("ddlFacility").value;
			try {
				//catch if default select facility option chosen
				if(intSelectedID === "default"){
					alert(i18n["VALID_FACILITY_ERROR"]);
					return false;
				}
				//Get total number of patient lists.
				intPTCNT = gblWorklistJSON.LISTREPLY.PTCNT;

				//Verify if there are any patient lists.
				if(intPTCNT > 0) {
					//Disable patient list dropdown list.
					document.getElementById("ddlPTList").disabled = true;
					//Disable submit button.
					document.getElementById("btnSubmit").disabled = true;
				}
				//Display load text.
				displayWorklistLoadText("spanUnitLoadText");
				//Load unit window.
				setTimeout(loadUnitWindow, 0);
			} catch (error) {
				showErrorMessage(error.message, "LaunchUnitWindow", "", "");
			}
		},
		/**
		 * Gets the worklist.
		 */
		buildSelections : function() {
			var requestAsync = "";
			var strURLParameters = "";
			var criterion = MpageDriver.getCriterion();
			var strCCLParam = "";
			var strCCLProg = "inn_mp_get_wrklist";
			var strErrorMessage = i18n["ERROR_LOADING_WORKLIST"];
			var blnWorklist = false;
			var sourceScript = MpageDriver.getListSourceScript();
			BrTopicMean = criterion.br_topic_mean;
			applicationId = criterion.application_id;
			if(isNaN(applicationId)) {
				applicationId = 0;
				criterion.application_id = 0;
			}
			userId = criterion.personnel_id;

			try {				
				//Get stored "window.name" values.
				gblDebugMode = WorklistStorage.get("StoredDebugMode");

				//Build the CCL input parameter.
				strCCLParam = ["^MINE^,^", BrTopicMean, "^,^", applicationId, "^,^", userId, "^,^", sourceScript, "^"].join("");

				// Call script
				AjaxHandler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : "inn_mp_get_wrklist",
						parameters : strCCLParam
					},
					loadingDialog : {
						targetDOM : document.getElementById("WorklistLoading"),
						content : '<span valign="top" class="WLLoadText"><b>' + i18n["LOADING_WORKLIST"] + '</b></span>' + AjaxIconHTML
					},
					response : {
						type : "JSON",
						target : function(responseJSON) {
							try {
								// Set worklist json data
								gblWorklistJSON = responseJSON.response;
								//Load Worklist.
								blnWorklist = loadWorklist();
							} catch(error) {
								//Set Error Message.
								showErrorMessage(error.message, "buildSelections", requestAsync.status, strCCLParam);
							}
						}
					}
				});
			} catch (error) {
				//Hide load text.
				hideWorklistLoadText("divOpenWrklist");
				showErrorMessage(error.message, "buildSelections", "", strCCLParam);
			}
		},
		/**
		 * Resets the selections.
		 */
		resetSelections : function() {
			try {
				//Reset global variables.
				gblPTList = "undefined";
				gblFacility = "undefined";
				selectedUnits = [];
				selectedPatientList = "";
				selectedOtherSources = "";
				selectedFacility = "";
				WorklistStorage.set("StoredPTList", gblPTList,persistedSelection);
				WorklistStorage.set("StoredFacility", gblFacility);

				//Refresh the page.
				refreshWorklistPage();
			} catch (error) {
				showErrorMessage(error.message, "resetSelections", "", "");
			}
		},
		/**
		 * Applies the selections that have been made in the user interface. Also builds a JSON string
		 * that contains the selected values. This JSON string can be used to call a "search result script",
		 * which is unique for each Mpage project.
		 */
		applySelections : function() {
			// Apply selections only if loading is not in progress
			try {
				if(!selectLoadingInProgress){
					var intSelectedID = 0;
					var int_OTHER_SOURCE_TYPE_CNT = 0;
					var strSelectedOtherSources = "";
					var intPTCNT = 0;
					var intLISTSEQ = 0;
					var strPatientList = "";
					var intFUCNT = 0;
					var intORGID = 0;
					var strFacilityUnitList = "";
					var intTotalUnit = 0;
					var currentUnit = "";
					var intCheckedCounter = 0;
					var strLOCNT = "";
					var strUnit = "";
					var criterion = MpageDriver.getCriterion();
					var curSelection = "";
						intPTCNT = gblWorklistJSON.LISTREPLY.PTCNT;
						intFUCNT = gblWorklistJSON.LISTREPLY.FUCNT;
						int_OTHER_SOURCE_TYPE_CNT = gblWorklistJSON.LISTREPLY.OTHER_SOURCE_TYPE_CNT;
						if(selectedPatientList != "") {
							for(var intCounter = 0; intCounter < intPTCNT; intCounter++) {
								intSelectedID = gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTID;
								if(intSelectedID == selectedPatientList.ID) {
									selectedFacility = "";
									selectedUnits = [];
									strPatientList += '"PTCNT":1';
									strPatientList += ",";
									strPatientList += '"PTLIST":[{';
									strPatientList += '"LISTID":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTID).toFixed(2);
									strPatientList += ",";
									strPatientList += '"LISTNM":"';
									strPatientList += gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTNM;
									strPatientList += '",';
									strPatientList += '"LISTTYPECD":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTTYPECD).toFixed(2);
									strPatientList += ",";
									strPatientList += '"DEFAULTLOCCD":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].DEFAULTLOCCD).toFixed(2);
									strPatientList += ",";
									strPatientList += '"LISTSEQ":';
									strPatientList += gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTSEQ;
									strPatientList += ",";
									strPatientList += '"OWNERID":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].OWNERID).toFixed(2);
									strPatientList += ",";
									strPatientList += '"PRSNLID":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].PRSNLID).toFixed(2);
									strPatientList += ",";
									strPatientList += '"APPCNTXID":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].APPCNTXID).toFixed(2);
									strPatientList += ",";
									strPatientList += '"APPID":';
									strPatientList += parseFloat(gblWorklistJSON.LISTREPLY.PTLIST[intCounter].APPID).toFixed(2);
									strPatientList += "}]";
									strPatientList += ",";
									strPatientList += '"FUCNT":0';
									break;
								}
							}
						}
						// for other source types => build json
						else if(selectedOtherSources != "") {
							strSelectedOtherSources = ['"OTHER_SOURCE_TYPE_CNT" : '+parseInt(selectedOtherSources.length,10)
												,', "OTHER_SOURCE_TYPES" : '+"["];		
							_.each(selectedOtherSources,function(otherSourceType,index){
								if(index > 0){
									strSelectedOtherSources[strSelectedOtherSources.length] = ",";
								}								
								strSelectedOtherSources[strSelectedOtherSources.length] = '{';
								strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_TYPE_MEANING" : "'+otherSourceType.SOURCE_TYPE_MEANING.encodeStringDelimiters() +'" ,';
								strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_TYPE_DISPLAY" : "'+otherSourceType.SOURCE_TYPE_DISPLAY.encodeStringDelimiters() +'" ,';
								strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_TYPE_CD" : '+parseFloat(otherSourceType.SOURCE_TYPE_CD).toFixed(2) +',';
								strSelectedOtherSources[strSelectedOtherSources.length] = '"SELECTED_IND" : '+parseInt(otherSourceType.SELECTED_IND)+' ,';
								strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_CNT" : '+parseInt(otherSourceType.SOURCE_CNT)+' ,';
								strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCES" : [';
								_.each(otherSourceType.SOURCES,function(otherSource,index){	
									if(index > 0){
										strSelectedOtherSources[strSelectedOtherSources.length] = ",";
									}																
									strSelectedOtherSources[strSelectedOtherSources.length] = "{";
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_ID" : '+parseFloat(otherSource.SOURCE_ID).toFixed(2) +' ,';
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_CD" : '+parseFloat(otherSource.SOURCE_CD).toFixed(2) +' ,';
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_DISPLAY" : "'+otherSource.SOURCE_DISPLAY.encodeStringDelimiters() +'" ,';
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_DESCRIPTION" : "'+otherSource.SOURCE_DESCRIPTION.encodeStringDelimiters() +'" ,';
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_MEANING" : "'+otherSource.SOURCE_MEANING.encodeStringDelimiters() +'" ,';
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SOURCE_DT_TM" : "'+otherSource.SOURCE_DT_TM +'" ,';
									strSelectedOtherSources[strSelectedOtherSources.length] = '"SELECTED_IND" : '+parseInt(otherSourceType.SELECTED_IND);
									strSelectedOtherSources[strSelectedOtherSources.length] = "}";
								});								
								strSelectedOtherSources[strSelectedOtherSources.length] = "]";
								strSelectedOtherSources[strSelectedOtherSources.length] = "}";
							});
							strSelectedOtherSources[strSelectedOtherSources.length] = "]";
							strSelectedOtherSources = strSelectedOtherSources.join("");
						} 
						else if(selectedFacility != "") {
							for(var intCounter = 0; intCounter < intFUCNT; intCounter++) {
								intORGID = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGID;
								if(intORGID == selectedFacility.CODE_VALUE) {
									strFacilityUnitList += '"PTCNT":0';
									strFacilityUnitList += ",";
									strFacilityUnitList += '"FUCNT":1';
									strFacilityUnitList += ",";
									strFacilityUnitList += '"FUQUAL":[{';
									strFacilityUnitList += '"ORGID":';
									strFacilityUnitList += parseFloat(intORGID).toFixed(2);
									strFacilityUnitList += ",";
									strFacilityUnitList += '"ORGNAME":"';
									strFacilityUnitList += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGNAME;
									strFacilityUnitList += '",';
									strFacilityUnitList += '"ORGNAMEKEY":"';
									strFacilityUnitList += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGNAMEKEY;
									strFacilityUnitList += '",';
									strFacilityUnitList += '"ENDDT":"';
									strFacilityUnitList += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ENDDT;
									strFacilityUnitList += '",';
									strFacilityUnitList += '"DEFAULTIND":';
									strFacilityUnitList += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].DEFAULTIND;
									intTotalUnit = selectedUnits.length;
									if(intTotalUnit > 0) {
										strFacilityUnitList += ",";
										for(var intCounter2 = 0; intCounter2 < intTotalUnit; intCounter2++) {
											currentUnit = selectedUnits[intCounter2];
											if(intCheckedCounter > 0) {
												strUnit += ",";
											}
											strUnit += "{";
											strUnit += '"LOCATIONDISP":"';
											strUnit += currentUnit.DISPLAY;
											strUnit += '",';
											strUnit += '"NULOCATIONCD":';
											strUnit += parseFloat(currentUnit.CODE_VALUE).toFixed(2);
											strUnit += ",";
											strUnit += '"DEFAULTIND":';
											strUnit += currentUnit.DEFAULT_IND;
											strUnit += "}";
											intCheckedCounter = parseInt(intCheckedCounter) + parseInt(1);
										}
										strLOCNT += '"LOCNT":';
										strLOCNT += intCheckedCounter;
										strLOCNT += ",";
										strFacilityUnitList += strLOCNT;
										strFacilityUnitList += '"LOCQUAL": [';
										strFacilityUnitList += strUnit;
										strFacilityUnitList += "]";
									}
									strFacilityUnitList += "}]";
									break;
								}
							}
						}					
						
						if(strSelectedOtherSources > " ") {
							curSelection = strSelectedOtherSources;
						} 
						else if(strPatientList > " ") {
							curSelection = strPatientList;
						}
						else if(strFacilityUnitList > " ") {
							curSelection = strFacilityUnitList;
						}
						// if any selection was made => get the patients from those selections
						if(curSelection > " "){
							selectionsJSON = "{";
							selectionsJSON += '"LISTREPLY": {';
							selectionsJSON += curSelection;
							selectionsJSON += ',"ORGSEC":';
							selectionsJSON += gblWorklistJSON.LISTREPLY.ORGSEC;
							selectionsJSON += ',"PRSNLID":';
							selectionsJSON += parseFloat(userId).toFixed(2);
							selectionsJSON += ',"BWTOPICMEAN":"';
							selectionsJSON += gblWorklistJSON.LISTREPLY.BWTOPICMEAN;
							selectionsJSON += '"';
							selectionsJSON += "}";
							selectionsJSON += "}";
							MpageDriver.notifyObservers("list-selected", {
								selectedUnits : WorklistSelection.getSelectedUnits(),
								selectedFacility : WorklistSelection.getSelectedFacility(),
								selectedPatientList : WorklistSelection.getSelectedPatientList()
							});
							// Set the selection loading to inprogress
							setSelectLoadingInProgress();
							
							//Build Tab views for worklist
							MpageDriver.buildTabViews();						
						}
					}
			} catch(error) {
				showErrorMessage(error.message, "applySelections", "","");
			}
		},
		/**
		 * Returns the selections json that have been made in the user interface.
		 * @return {String} selectionsJSON The JSON structure for current selections 
		 */
		getSelectionsJSON : function(){
			return(selectionsJSON)
		},
		/**
		 * Verfies the selections that have been made in the user interface.
		 * @param {Integer} intSubmit Contains 1 if the call comes from the Submit button on the web page. Contains 0 if the call comes
		 * from the Submit button on the modal window.
		 */
		verifySelections : function(intSubmit) {
			var intSelectedID = 0;
			var int_OTHER_SOURCE_TYPE_CNT = 0;
			var intPTCNT = 0;
			var intLISTSEQ = 0;
			var intFUCNT = 0;
			var intORGID = 0;
			var intTotalUnit = 0;
			var strCheckBoxName = "";
			var strCheckBoxValue = "";
			var intCheckedCounter = 0;
			var strLOCNT = "";
			var criterion = MpageDriver.getCriterion();
			var storedSourceTypes;
			var storedTypeIndex = WorklistStorage.get("StoredOtherSourceTypeIndex")
			var storedSourceIndex = WorklistStorage.get("StoredOtherSourceIndex")
			try {
				intPTCNT = gblWorklistJSON.LISTREPLY.PTCNT;
				intFUCNT = gblWorklistJSON.LISTREPLY.FUCNT;
				int_OTHER_SOURCE_TYPE_CNT = gblWorklistJSON.LISTREPLY.OTHER_SOURCE_TYPE_CNT;
				selectedOtherSources = [];
				selectedPatientList = "";
				selectedFacility = "";
				selectedUnits = [];
				if(int_OTHER_SOURCE_TYPE_CNT > 0 ) {
				// not a disabled selection
					if(!$(".other-source-selections").hasClass("disabled-selection")) {
						if(intSubmit == 1) {
							storedSourceTypes = AjaxHandler.parse_json(unescape(WorklistStorage.get("StoredOtherSourcesList").split("%25").join("%")));
							// build selected sources
							_.each(storedSourceTypes,function(sourceType,typeIndex){
								var sourcesList = _.clone(sourceType.SOURCES);
								// check if source type was selected
								if(parseInt(sourceType.SELECTED_IND,10) === 1){
									sourceType.SOURCES = [];
									sourceType.SOURCE_CNT = 0;
									selectedOtherSources.push(sourceType);	
									_.each(sourcesList,function(source,sourceIndex){
										if(parseInt(source.SELECTED_IND,10) === 1){
											sourceType.SOURCES.push(source)
											sourceType.SOURCE_CNT += 1;
										}
										
									});
								}
							});
						}
					}
				}
				if(intPTCNT > 0 && document.getElementById("ddlPTList")) {
					if(document.getElementById("ddlPTList").disabled == false) {
						if(intSubmit == 1) {
							intSelectedID = document.getElementById("ddlPTList").value;
							//if intSelectedID is "default" return false because it is default option
							if(intSelectedID === "default"){
								return false;
							}
							for(var intCounter = 0; intCounter < intPTCNT; intCounter++) {
								intLISTSEQ = 0;
								intLISTSEQ = gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTSEQ;
								if(intSelectedID == intLISTSEQ) {
									selectedPatientList = {
										DISPLAY : gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTNM,
										ID : gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTID,
										LIST_SEQ : gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTSEQ
									};
									break;
								}
							}
						}
						//default load patient list
						else if(intSubmit === 2){
							//first non-default list
							var patientDDL = Util.Style.g("ddlPTList")[0];
							intSelectedID = _gbt("option",patientDDL)[1].value;
							for(var intCounter = 0; intCounter < intPTCNT; intCounter++){
								intLISTSEQ = 0;
								intLISTSEQ = gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTSEQ;
								if(intSelectedID == intLISTSEQ) {
									selectedPatientList = {
										DISPLAY : gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTNM,
										ID : gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTID,
										LIST_SEQ : gblWorklistJSON.LISTREPLY.PTLIST[intCounter].LISTSEQ
									};
									break;
								}
							}
						}
					}
				}
				if(intFUCNT > 0 && document.getElementById("ddlFacility")) {
					if(document.getElementById("ddlFacility").disabled == false) {
						if(intSubmit == 0) {
							var nurseUnitLink = Util.Style.g("WLLinkText")[0];
							var nurseUnits = "";
							intSelectedID = document.getElementById("ddlFacility").value;
							selectedFacility = {
								DISPLAY : document.getElementById("ddlFacility").options[document.getElementById("ddlFacility").selectedIndex].text,
								CODE_VALUE : document.getElementById("ddlFacility").value
							};
							for(var intCounter = 0; intCounter < intFUCNT; intCounter++) {
								intORGID = 0;
								intORGID = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGID;
								if(intSelectedID == intORGID) {
									intTotalUnit = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCNT;
									if(intTotalUnit > 0) {
										for(var intCounter2 = 0; intCounter2 < intTotalUnit; intCounter2++) {
											strCheckBoxName = "";
											strCheckBoxName = "chkHead" + intCounter2;
											if(document.getElementById(strCheckBoxName).checked == 1) {
												strCheckBoxValue = document.getElementById(strCheckBoxName).value;
												intCheckedCounter = parseInt(intCheckedCounter) + parseInt(1);
												selectedUnits.push({
													DISPLAY : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].LOCATIONDISP,
													DEFAULT_IND : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].DEFAULTIND,
													CODE_VALUE : strCheckBoxValue
												});
												if(nurseUnits === ""){
													nurseUnits += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].LOCATIONDISP;
												}
												else{
													nurseUnits += "; " + gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].LOCATIONDISP;
												}
											}
										}
										if(intCheckedCounter == 0) {
											alert("Please select one or more nurse units.");
											return false;
										}
									}
									nurseUnitLink.innerHTML = nurseUnits;
									break;
								}
							}
						}

						//account for default WTS location
						else
						if(intSubmit == 3) {
							var nurseUnitLink = Util.Style.g("WLLinkText")[0];
							var nurseUnits = "";
							for(var intCounter = 0; intCounter < intFUCNT; intCounter++) {
								intDEFAULTIND = 0;
								intORGID = 0;
								intDEFAULTIND = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].DEFAULTIND;
								//load facility for selected WTS
								if(intDEFAULTIND > 0) {
									selectedFacility = {
										DISPLAY : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGNAME,
										CODE_VALUE : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGID
									};
									intORGID = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGID;
									intTotalUnit = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCNT;
									if(intTotalUnit > 0) {
										for(var intCounter2 = 0; intCounter2 < intTotalUnit; intCounter2++) {
											if(gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].DEFAULTIND > 0) {
												selectedUnits.push({
													DISPLAY : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].LOCATIONDISP,
													DEFAULT_IND : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].DEFAULTIND,
													CODE_VALUE : gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].NULOCATIONCD
												});
												nurseUnits += gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].LOCQUAL[intCounter2].LOCATIONDISP;
											}
										}
									}
									if(nurseUnits){
										nurseUnitLink.innerHTML = nurseUnits;
									}
									else{
										//If no nurse units to select then halt the selection. They need to select a nurse unit
										displayRequiredSelectMessage();
										return(0);
									}
									break;
								}
							}
						}

					}
					if(document.getElementById("ddlFacility").disabled == false) {
						if(intSubmit == 0) {
							$("#nurseUnitsDiv").dialog("close");
						}
					}
				}
				WorklistSelection.applySelections();
			} catch(error) {
				showErrorMessage(error.message, "verifySelections", "", intSubmit);
			}
		},
		/**
		 * Method for verifying other source selections 
		 * @param {Object} otherSourcesList	JSON List specifying the list of other source types
		 * @return {String} sourceSelectionHTML HTML containing source selection 
		 * 
		 * @description
		 * <p>Example otherSourcesList: </p>
		 * <code>
		 * <pre>
		 *	[
			   {
				  "SOURCE_TYPE_MEANING":"FIRSTNET_TRACK_GROUP",
				  "SOURCE_TYPE_DISPLAY":"Firstnet Track Group",
				  "SOURCE_TYPE_CD":0.000000,
				  "SOURCE_CNT":4,
				  "SOURCES":[
					 {
						"SOURCE_ID":0.000000,
						"SOURCE_CD":4582306.000000,
						"SOURCE_DISPLAY":"OB Tracking Group",
						"SOURCE_DESCRIPTION":"OB Tracking Group",
						"SOURCE_MEANING":"OTHER",
						"SOURCE_DT_TM":"\/Date(0000-00-00T00:00:00.000+00:00)\/"
					 },
					 {
						"SOURCE_ID":0.000000,
						"SOURCE_CD":4748440.000000,
						"SOURCE_DISPLAY":"PNOTETG",
						"SOURCE_DESCRIPTION":"PNOTETG",
						"SOURCE_MEANING":"ER",
						"SOURCE_DT_TM":"\/Date(0000-00-00T00:00:00.000+00:00)\/"
					 },
					 {
						"SOURCE_ID":0.000000,
						"SOURCE_CD":4756096.000000,
						"SOURCE_DISPLAY":"MER ED TG",
						"SOURCE_DESCRIPTION":"MER ED TG",
						"SOURCE_MEANING":"ER",
						"SOURCE_DT_TM":"\/Date(0000-00-00T00:00:00.000+00:00)\/"
					 },
					 {
						"SOURCE_ID":0.000000,
						"SOURCE_CD":12294870.000000,
						"SOURCE_DISPLAY":"Inpatient Tracking Group",
						"SOURCE_DESCRIPTION":"Inpatient Tracking Group",
						"SOURCE_MEANING":"OTHER",
						"SOURCE_DT_TM":"\/Date(0000-00-00T00:00:00.000+00:00)\/"
					 }
				  ]
			   }
			]
		 * </pre>
		 * </code>
		 *
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name verifyOtherListSelection
		 */
		verifyOtherListSelection : verifyOtherListSelection,
		/**
		 * Method for verifying other source selections 
		 * @param {Boolean} persistInd	Indicator for persisting worklist source selections across sessions
		 * 
		 * @static
		 * @function
		 * @memberof WorklistSelection
		 * @name persistSelections
		 */
		persistSelections: persistSelections,
		/**
		 * Verfies patient list.
		 */
		verifyPatientList : function() {
			var intFUCNT = 0;
			var submitButton = Util.Style.g("WLButtonDefaultText")[0];
			try {
				gblPTList = document.getElementById("ddlPTList").value;
				WorklistStorage.set("StoredPTList", gblPTList,persistedSelection);

				//Get total number of facilities.
				intFUCNT = gblWorklistJSON.LISTREPLY.FUCNT;
				
				//if submit is dithered, undither
				if(submitButton){
					if(submitButton.disabled === true){
						submitButton.disabled = false;
					}
				}

				//Verify if there are any facilities.
				if(intFUCNT > 0) {
					//return facility drop down to default selection
					Util.Style.g("fnListDefault")[0].selected = "selected";
					document.getElementById("ddlFacility").disabled = true;
					document.getElementById("spanUnitLink").innerHTML = "Unit";
					document.getElementById("spanUnitLink").className = "WLDisableText";
				}
				// load the default list
				else{
					WorklistSelection.verifySelections(1);
				}
			} catch(error) {
				showErrorMessage(error.message, "verifyPatientList", "", "");
			}
		},
		/**
		 * Verfies facility.
		 */
		verifyFacility : function() {
			var intPTCNT = 0;
			var intFUCNT = 0;
			var intORGID = 0;

			try {
				gblFacility = document.getElementById("ddlFacility").value;
				WorklistStorage.set("StoredFacility", gblFacility);

				//Get total number of patient lists.
				intPTCNT = gblWorklistJSON.LISTREPLY.PTCNT;
				//Get total number of facilities.
				intFUCNT = gblWorklistJSON.LISTREPLY.FUCNT;

				//Verify if there are any facilities.
				if(intFUCNT > 0) {
					//Verify if there are any patient lists.
					if(intPTCNT > 0) {
						//return patient list drop down to default selection
						Util.Style.g("ptListDefault")[0].selected="selected";
						//Disable patient list dropdown list.
						document.getElementById("ddlPTList").disabled = true;
						//Disable submit button.
						document.getElementById("btnSubmit").disabled = true;
					}

					//Loop through the record structure.
					for(var intCounter = 0; intCounter < intFUCNT; intCounter++) {
						//Reset variable.
						intORGID = 0;

						//ORGID
						intORGID = gblWorklistJSON.LISTREPLY.FUQUAL[intCounter].ORGID;

						//Verify ORGID.
						if(gblFacility == intORGID) {
							gblDefaultCounter = intCounter;
							break;
						}
					}
				}
			} catch (error) {
				showErrorMessage(error.message, "verifyPatientList", "", "");
			}
		},
		"resetSelectLoadingInProgress": resetSelectLoadingInProgress,
		"setSelectLoadingInProgress": setSelectLoadingInProgress,
		getWorklistJSON: function(){
		 	return(gblWorklistJSON);	
		}
		
	}
	)
}());
/**
 * @fileoverview
 * <strong>wklst-core-storage.js</strong>
 * <p>
 * This file contains a utility object, WorklistStorage, to handle storage and retrieval of session specific or persistent data.
 * </p>
 * Copyright 2011. Cerner Corporation
 * @author Innovations Development
 */

/**
 * This singleton encapsulates all utility methods for storing and retrieving session specific and persistent data items.
 * @namespace WorklistStorage
 * @static
 * @global
 */
var WorklistStorage = {
	cache : null,
	/**
		 * Method for retrieving both session specific and persistent stored items by key
		 * @param {String} key	identifier for the stored item
		 * @param {Boolean} dataIsPersisted (optional) indicator set to true if the stored item is persisted
		 * 
		 * @return {String} data String containing the value realted to the key
		 * 
		 * @description
		 * The key is used in combination with the bedrock topic meaning specified with MpageDriver.setBedrockTopicMeaning()
		 * <p>Example: A key called "_FAVORITES" with bedrock topic meaning "MP_AMB_WKLST" will be identified as "MP_AMB_WKLST_FAVORITES"</p>
		 *
		 * @static
		 * @function
		 * @memberof WorklistStorage
		 * @name get
		 */
	get : function(key, dataIsPersisted) {
		if(dataIsPersisted){
			var criterion = MpageDriver.getCriterion();
			var topicMean = MpageDriver.getBedrockTopicMeaning();
			var userId = criterion.personnel_id;
			var applicationId = criterion.application_id;
			var returnStr = "";
			var strCCLParam = "MINE, " + userId + ", ^" + topicMean + key  + "^, "+applicationId;
			AjaxHandler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : "MP_GET_USER_PREFS",
						parameters : strCCLParam,
						synchronous: true
					},
					response : {
						type : "JSON",
						target : function(responseJSON) {
							try{
								var jsonObj = responseJSON.response;
								if (jsonObj.RECORD_DATA.STATUS_DATA.STATUS == "S") {
									returnStr = jsonObj.RECORD_DATA.PREF_STRING;
								}
							}
							catch(e){
								AjaxHandler.append_text("<b>WorklistStorage.get(" + key + ") </b></br>");
								AjaxHandler.append_text("Error Retrieving Worklist storage peristed item " + key);
							}
						}
					}
				});
				
		
			return(returnStr);

		}
		else{
			if(window.name.length > 0) {
				this.cache = eval("(" + window.name + ")");
			} else {
				this.cache = {};
			}
			return this.decodeString(this.cache[key]);
		}
	},
	decodeString : function(value) {
		return (this.unescapeJSON(value)).replace(/&#39;/g, "'");
	},
	encodeString : function(value) {
		return encodeURIComponent(value).replace(/'/g, "&#39;");
	},
	/**
		 * Method for setting both session specific and persistent stored items by key
		 * @param {String} key	identifier for the stored item
		 * @param {String} value data for the stored item
		 * @param {Boolean} persistData (optional) indicator set to true if the stored item is persisted
		 *  
		 * @description
		 * The key is used in combination with the bedrock topic meaning specified with MpageDriver.setBedrockTopicMeaning()
		 * <p>Example: A key called "_FAVORITES" with bedrock topic meaning "MP_AMB_WKLST" will be stored as "MP_AMB_WKLST_FAVORITES"</p>
		 *
		 * @static
		 * @function
		 * @memberof WorklistStorage
		 * @name set
	*/
	set : function(key, value, persistData) {
		if(persistData){
			//Ajax Request to store
			var criterion = MpageDriver.getCriterion();
			var topicMean = MpageDriver.getBedrockTopicMeaning();
			var userId = criterion.personnel_id;
			var applicationId = criterion.application_id;
			var strCCLParam = "MINE," + applicationId + ", " + userId + ", ^" +  topicMean + key + "^,@" +(value.length)+":"+value +"@";
			AjaxHandler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : "INN_MP_MAINTAIN_USER_PREFS",
						parameters : strCCLParam
					},
					response : {
						type : "JSON",
						target : function(responseJSON) {
							try {
								// Set worklist json data
								if(responseJSON.response.RECORD_DATA.STATUS_DATA.STATUS == "S"){
									AjaxHandler.append_text("<b>WorklistStorage.set(" + key + ", " + value + ") </b></br>");
									AjaxHandler.append_text("Successfully set Worklist storage peristed item " + key + " with value " + value);
								}
								else{
									AjaxHandler.append_text("<b>WorklistStorage.set(" + key + ", " + value + ") </b></br>");
									AjaxHandler.append_text("Error setting Worklist storage peristed item " + key + " and value" + value);
								}
								
							} catch(error) {
								//Log Error message
								AjaxHandler.append_text("<b>WorklistStorage.set(" + key + ", " + value + ") </b></br>");
								AjaxHandler.append_text("Error setting Worklist storage peristed item " + key + " and value" + value);
							}
						}
					}
				});
		}
		else{
		this.get();
		
			if( typeof key != "undefined" && typeof value != "undefined") {
				this.cache[key] = value;
			}
			var jsonString = "{";
			var itemCount = 0;
			for(var item in this.cache) {
				if(itemCount > 0) {
					jsonString += ", ";
				}
				jsonString += "'" + this.encodeString(item) + "':'" + this.encodeString(this.cache[item]) + "'";
				itemCount++;
			}
			jsonString += "}";
			window.name = jsonString;
			}
		
	},
	unescapeJSON: function (jsonString){
		// check if the first character is an escaped "{"
		// if so -> recursively call with the unescaped string
		if(jsonString && jsonString.indexOf("%25") == 0){
			return (this.unescapeJSON(unescape(jsonString)));
		}
		// else return the current json string which is unescaped completely
		else {
			return (unescape(jsonString));
		}
	},
	del : function(key) {
		this.get();
		delete this.cache[key];
		this.serialize(this.cache);
	},
	clear : function() {
		window.name = "";
	}
};/**
 * @fileoverview
 * <strong>wklst-core-table-column.js</strong>
 * <p>
 * This file contains the MpageTableColumn object implementing the core functionality of a table column in the worklist mpage framework.
 * MpageTableColumn provides methods to render/manage the layout of a column in worklist mpage.
 * </p>
 * <p>
 * This file contains a constructor object, MpageTableColumn, to handle the display of a column in worklist.
 * </p>
 * Copyright 2011. Cerner Corporation
 * @author Innovations Development
 */

/**
 * This Constructor Encapsulates all utility methods for rendering table columns
 * @constructor MpageTableColumn
 * @static
 * @global
 */
var MpageTableColumn = function(){}

/**
 * Meaning property should be a unique identifier for the column and should match the Meaning attribute from layout. 
 * @static
 * @property
 * @memberof MpageTableColumn
 * @name meaning
 */
MpageTableColumn.prototype.meaning = "";

/**
 * Title property defines the display title for the column header. 
 * @static
 * @property
 * @memberof MpageTableColumn
 * @name title
 */
MpageTableColumn.prototype.title = "";

/**
 * cssClass property defines the parent css class for the column, this class will specify the column width, font, e.t.c. 
 * @static
 * @property
 * @memberof MpageTableColumn
 * @name cssClass
 */
MpageTableColumn.prototype.cssClass = "";

/**
 * isDefaultSortable defines the column as default sortable if the return value is true
 * @static
 * @property
 * @memberof MpageTableColumn
 * @name isDefaultSortable
 */
MpageTableColumn.prototype.isDefaultSortable = "";

/**
 * Initiates the load of data within a column, this method is called from MpageDriver. 
 * <p>
 * 	The criterion object is in the following format:
 * <code>
 * <pre>
 * 	{
 * 		position_cd: "",
 * 		application_id:"",
 * 		personnel_id: "",
 * 		debug_mode_ind:"",
 * 		br_topic_mean:"",
 * 		params:""
 * 	}
 * </pre>
 * </code>
 * </p>
 * <p>
 * 	The criterion.params value is serialized JSON containing the list of patients currently being loaded on the column. This JSON is in the following format.
 * 	<code>
 * 	<pre>
 * {
 * 		"PATIENTS":{
 * 		"PT_LIST_ID":666147.000000,
 * 		"CNT":1,
 * 		"QUAL":[
 * 			{
 * 				"PERSON_ID":2788170.000000,
 * 				"ENCNTR_ID":2846519.000000,
 * 				"NAME_FULL_FORMATTED":"Payne, Robert",
 * 				"BIRTH_DT_TM":"\/Date(1954-12-30T06:00:00.000+00:00)\/",
 * 				"BIRTH_DT_TM_DISP":"12/30/54 00:00:00",
 * 				"ENCNTR_CNT":1,
 *  			"ENCNTRS":[
 * 						{
 * 							"ENCNTR_ID":2846519.000000,
 * 							"ENCNTR_TYPE_CD":309308.000000,
 * 							"ENCNTR_CLASS_CD":0.000000,
 * 							"ACTIVE_IND":1,
 * 							"ARRIVE_DT_TM":"\/Date(2010-09-27T15:00:00.000+00:00)\/",
 * 							"REG_DT_TM":"\/Date(2010-09-27T15:05:00.000+00:00)\/",
 * 							"BEG_EFFECTIVE_DT_TM":"\/Date(2010-09-28T14:48:50.000+00:00)\/",
 * 							"DISCH_DT_TM":"\/Date(0000-00-00T00:00:00.000+00:00)\/"
 * 						}
 * 					],
 * 				"ATTRIBUTE_CNT":0,
 * 				"ATTRIBUTES":[
 * 						{
 * 							"MEANING":"",
 * 							"DISPLAY_VALUE":"",
 * 							"DT_TM_VALUE":"\/Date(0000-00-00T00:00:00.000+00:00)\/",
 * 							"NUMERIC_VALUE":0.000000
 * 						}
 * 					]
 * 				}
 * 			]
 * }
 * 	</pre>
 * </code> 
 * </p>
 * 
 * @param {Node} parentTable	DOM Node reference to the table containing the column being loaded
 * @param {Number} columnIndex	Sequence of the column being loaded on the table
 * @param {Node} headerCellDOM	DOM Node reference to the table column header * 
 * @param {Object} criterion	JSON object containing criterion for loading the column
 * @static
 * @function
 * @memberof MpageTableColumn
 * @name load
 */
MpageTableColumn.prototype.load = function(parentTable, columnIndex, headerCellDOM, criterion){};

/**
 * Loads the JSON data returned from the script into the table column.
 * <p>
 * <code>
 * <pre>
 * The JSON data returned from ccl script can be loaded directly to the table using the following method:
 * 
 * 			TableLayout.insertColumnData(
 * 					{
 * 						"tableDOM": parentTable,
 * 						"columnIndex": columnIndex,
 * 						"JSONList": jsonData.PTS,
 * 						"HideExistingCellDataInd":1,
 * 						"JSONRef": ["PATIENTINFO_DISPLAY"], 
 * 						"JSONRefCSS":[""],
 * 						"JSONRowId": ["PERSON_ID", "ENCNTR_ID"],
 * 						"JSONRefAppendInd":1
 * 					});
 * 
 * 			tableDOM  refers to the parent table dom element
 * 			columnIndex refers to the sequence of the column on the table
 * 			JSONList refers to the JSON list response from the CCL script
 * 			JSONRef refers to the elements within the JSONLIst to be displayed on the column
 * 			JSONRefCss refers to the css to be applied for elements specified in JSONRef
 * 			JSONRowId refers to the unique identifier on the table for each patient, this should always be set to ["PERSON_ID","ENCNTR_ID"]
 * 			JSONRefAppendInd refers to the setting of appending JSONRef elements displayed
 * </pre>
 * </code>
 * </p>
 * @param {Object} jsonResponse		JSON object response from CCL script to load data on column.
 * @static
 * @function
 * @memberof MpageTableColumn
 * @name loadJsonData
 */
MpageTableColumn.prototype.loadJsonData = function(jsonResponse) {};

/**
 * Defines the column as sortable if the return value is true
 * @return {Boolean} isSortable		True/False to indicate sortable column
 * @static
 * @function
 * @memberof MpageTableColumn
 * @name isSortable
 */
MpageTableColumn.prototype.isSortable = function(){};



/**
 * Defines the extraction method for the sort data on column. This function extracts the html string containing sort data appended to the table column cell
 * <p>
 * 	An example implementation of this function:
 * 	<code>
 * 	<pre>
 * 	getCurrentSortSelection = function(node){
 *			// node here refers to the table cell on each column, within each cell, the sort data
 *			// can be extracted by classname
 * 			var sortSelection =  Util.Style.g("ptinfo_sort_name",node)[0];
 * 			if(sortSelection){
 * 				return (sortSelection.innerHTML)
 * 			}
 * 			else{    
 * 				return("");
 * 			}
 * 	}

 * 	</pre>
 * 	</code>
 * </p>
 * @param {Node} cellNode DOM Node reference to the table column cell
 * @return {String} sortSelection	Value to be used for sorting
 * @static
 * @function
 * @memberof MpageTableColumn
 * @name getCurrentSortSelection
 */
MpageTableColumn.prototype.getCurrentSortSelection = function(cellNode){};

/**
 * Set the sort CSS class for identifying elements with sort data
 * @param {String} sortCSS	CSS class of the element containing sort data
 * @static
 * @function
 * @memberof MpageTableColumn
 * @name setSortCSS
 */
MpageTableColumn.prototype.setSortCSS = function(){};