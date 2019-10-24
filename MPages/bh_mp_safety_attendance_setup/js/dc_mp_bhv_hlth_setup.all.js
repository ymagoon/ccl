/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
/*!
 * jQuery UI 1.8.14
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a,b){var d=a.nodeName.toLowerCase();if("area"===d){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&l(a)}return(/input|select|textarea|button|object/.test(d)?!a.disabled:"a"==d?a.href||b:b)&&l(a)}function l(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.14",
keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();
b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,
"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",
function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,m,n){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(m)g-=parseFloat(c.curCSS(f,"border"+this+"Width",true))||0;if(n)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,
outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){return k(a,!isNaN(c.attr(a,"tabindex")))},tabbable:function(a){var b=c.attr(a,"tabindex"),d=isNaN(b);
return(d||b>=0)&&k(a,!d)}});c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=
0;e<b.length;e++)a.options[b[e][0]]&&b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.14
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
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
;/*
 * jQuery UI Position 1.8.14
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+(parseInt(c.curCSS(this,"marginRight",true))||0),w=m+q+(parseInt(c.curCSS(this,"marginBottom",true))||0),i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=
m/2;i.left=Math.round(i.left);i.top=Math.round(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=
d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.widget.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){return c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}}),d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;return e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e,f&&e.charAt(0)==="_"?h:(f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b)return h=f,!1}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))}),h)}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}return this._setOptions(e),this},_setOptions:function(b){var c=this;return a.each(b,function(a,b){c._setOption(a,b)}),this},_setOption:function(a,b){return this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);return this.element.trigger(c,d),!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.mouse.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c=!1;a(document).mouseup(function(a){c=!1}),a.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var b=this;this.element.bind("mousedown."+this.widgetName,function(a){return b._mouseDown(a)}).bind("click."+this.widgetName,function(c){if(!0===a.data(c.target,b.widgetName+".preventClickEvent"))return a.removeData(c.target,b.widgetName+".preventClickEvent"),c.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(b){if(c)return;this._mouseStarted&&this._mouseUp(b),this._mouseDownEvent=b;var d=this,e=b.which==1,f=typeof this.options.cancel=="string"&&b.target.nodeName?a(b.target).closest(this.options.cancel).length:!1;if(!e||f||!this._mouseCapture(b))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){d.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)){this._mouseStarted=this._mouseStart(b)!==!1;if(!this._mouseStarted)return b.preventDefault(),!0}return!0===a.data(b.target,this.widgetName+".preventClickEvent")&&a.removeData(b.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(a){return d._mouseMove(a)},this._mouseUpDelegate=function(a){return d._mouseUp(a)},a(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),b.preventDefault(),c=!0,!0},_mouseMove:function(b){return!a.browser.msie||document.documentMode>=9||!!b.button?this._mouseStarted?(this._mouseDrag(b),b.preventDefault()):(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,b)!==!1,this._mouseStarted?this._mouseDrag(b):this._mouseUp(b)),!this._mouseStarted):this._mouseUp(b)},_mouseUp:function(b){return a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,b.target==this._mouseDownEvent.target&&a.data(b.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(b)),!1},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(a){return this.mouseDelayMet},_mouseStart:function(a){},_mouseDrag:function(a){},_mouseStop:function(a){},_mouseCapture:function(a){return!0}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.draggable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},destroy:function(){if(!this.element.data("draggable"))return;return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this},_mouseCapture:function(b){var c=this.options;return this.helper||c.disabled||a(b.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(b),this.handle?(c.iframeFix&&a(c.iframeFix===!0?"iframe":c.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(a(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(b){var c=this.options;return this.helper=this._createHelper(b),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),a.ui.ddmanager&&(a.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt),c.containment&&this._setContainment(),this._trigger("start",b)===!1?(this._clear(),!1):(this._cacheHelperProportions(),a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this._mouseDrag(b,!0),a.ui.ddmanager&&a.ui.ddmanager.dragStart(this,b),!0)},_mouseDrag:function(b,c){this.position=this._generatePosition(b),this.positionAbs=this._convertPositionTo("absolute");if(!c){var d=this._uiHash();if(this._trigger("drag",b,d)===!1)return this._mouseUp({}),!1;this.position=d.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";return a.ui.ddmanager&&a.ui.ddmanager.drag(this,b),!1},_mouseStop:function(b){var c=!1;a.ui.ddmanager&&!this.options.dropBehaviour&&(c=a.ui.ddmanager.drop(this,b)),this.dropped&&(c=this.dropped,this.dropped=!1);var d=this.element[0],e=!1;while(d&&(d=d.parentNode))d==document&&(e=!0);if(!e&&this.options.helper==="original")return!1;if(this.options.revert=="invalid"&&!c||this.options.revert=="valid"&&c||this.options.revert===!0||a.isFunction(this.options.revert)&&this.options.revert.call(this.element,c)){var f=this;a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){f._trigger("stop",b)!==!1&&f._clear()})}else this._trigger("stop",b)!==!1&&this._clear();return!1},_mouseUp:function(b){return this.options.iframeFix===!0&&a("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),a.ui.ddmanager&&a.ui.ddmanager.dragStop(this,b),a.ui.mouse.prototype._mouseUp.call(this,b)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(b){var c=!this.options.handle||!a(this.options.handle,this.element).length?!0:!1;return a(this.options.handle,this.element).find("*").andSelf().each(function(){this==b.target&&(c=!0)}),c},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b])):c.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return d.parents("body").length||d.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo),d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute"),d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[b.containment=="document"?0:a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,b.containment=="document"?0:a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(b.containment=="document"?0:a(window).scrollLeft())+a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(b.containment=="document"?0:a(window).scrollTop())+(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)&&b.containment.constructor!=Array){var c=a(b.containment),d=c[0];if(!d)return;var e=c.offset(),f=a(d).css("overflow")!="hidden";this.containment=[(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0),(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0),(f?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(f?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=c}else b.containment.constructor==Array&&(this.containment=b.containment)},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName),f=b.pageX,g=b.pageY;if(this.originalPosition){var h;if(this.containment){if(this.relative_container){var i=this.relative_container.offset();h=[this.containment[0]+i.left,this.containment[1]+i.top,this.containment[2]+i.left,this.containment[3]+i.top]}else h=this.containment;b.pageX-this.offset.click.left<h[0]&&(f=h[0]+this.offset.click.left),b.pageY-this.offset.click.top<h[1]&&(g=h[1]+this.offset.click.top),b.pageX-this.offset.click.left>h[2]&&(f=h[2]+this.offset.click.left),b.pageY-this.offset.click.top>h[3]&&(g=h[3]+this.offset.click.top)}if(c.grid){var j=c.grid[1]?this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY;g=h?j-this.offset.click.top<h[1]||j-this.offset.click.top>h[3]?j-this.offset.click.top<h[1]?j+c.grid[1]:j-c.grid[1]:j:j;var k=c.grid[0]?this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX;f=h?k-this.offset.click.left<h[0]||k-this.offset.click.left>h[2]?k-this.offset.click.left<h[0]?k+c.grid[0]:k-c.grid[0]:k:k}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(b,c,d){return d=d||this._uiHash(),a.ui.plugin.call(this,b,[c,d]),b=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),a.Widget.prototype._trigger.call(this,b,c,d)},plugins:{},_uiHash:function(a){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),a.extend(a.ui.draggable,{version:"1.8.21"}),a.ui.plugin.add("draggable","connectToSortable",{start:function(b,c){var d=a(this).data("draggable"),e=d.options,f=a.extend({},c,{item:d.element});d.sortables=[],a(e.connectToSortable).each(function(){var c=a.data(this,"sortable");c&&!c.options.disabled&&(d.sortables.push({instance:c,shouldRevert:c.options.revert}),c.refreshPositions(),c._trigger("activate",b,f))})},stop:function(b,c){var d=a(this).data("draggable"),e=a.extend({},c,{item:d.element});a.each(d.sortables,function(){this.instance.isOver?(this.instance.isOver=0,d.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(b),this.instance.options.helper=this.instance.options._helper,d.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",b,e))})},drag:function(b,c){var d=a(this).data("draggable"),e=this,f=function(b){var c=this.offset.click.top,d=this.offset.click.left,e=this.positionAbs.top,f=this.positionAbs.left,g=b.height,h=b.width,i=b.top,j=b.left;return a.ui.isOver(e+c,f+d,i,j,g,h)};a.each(d.sortables,function(f){this.instance.positionAbs=d.positionAbs,this.instance.helperProportions=d.helperProportions,this.instance.offset.click=d.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return c.helper[0]},b.target=this.instance.currentItem[0],this.instance._mouseCapture(b,!0),this.instance._mouseStart(b,!0,!0),this.instance.offset.click.top=d.offset.click.top,this.instance.offset.click.left=d.offset.click.left,this.instance.offset.parent.left-=d.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=d.offset.parent.top-this.instance.offset.parent.top,d._trigger("toSortable",b),d.dropped=this.instance.element,d.currentItem=d.element,this.instance.fromOutside=d),this.instance.currentItem&&this.instance._mouseDrag(b)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",b,this.instance._uiHash(this.instance)),this.instance._mouseStop(b,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),d._trigger("fromSortable",b),d.dropped=!1)})}}),a.ui.plugin.add("draggable","cursor",{start:function(b,c){var d=a("body"),e=a(this).data("draggable").options;d.css("cursor")&&(e._cursor=d.css("cursor")),d.css("cursor",e.cursor)},stop:function(b,c){var d=a(this).data("draggable").options;d._cursor&&a("body").css("cursor",d._cursor)}}),a.ui.plugin.add("draggable","opacity",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("opacity")&&(e._opacity=d.css("opacity")),d.css("opacity",e.opacity)},stop:function(b,c){var d=a(this).data("draggable").options;d._opacity&&a(c.helper).css("opacity",d._opacity)}}),a.ui.plugin.add("draggable","scroll",{start:function(b,c){var d=a(this).data("draggable");d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"&&(d.overflowOffset=d.scrollParent.offset())},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=!1;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!e.axis||e.axis!="x")d.overflowOffset.top+d.scrollParent[0].offsetHeight-b.pageY<e.scrollSensitivity?d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop+e.scrollSpeed:b.pageY-d.overflowOffset.top<e.scrollSensitivity&&(d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop-e.scrollSpeed);if(!e.axis||e.axis!="y")d.overflowOffset.left+d.scrollParent[0].offsetWidth-b.pageX<e.scrollSensitivity?d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft+e.scrollSpeed:b.pageX-d.overflowOffset.left<e.scrollSensitivity&&(d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft-e.scrollSpeed)}else{if(!e.axis||e.axis!="x")b.pageY-a(document).scrollTop()<e.scrollSensitivity?f=a(document).scrollTop(a(document).scrollTop()-e.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<e.scrollSensitivity&&(f=a(document).scrollTop(a(document).scrollTop()+e.scrollSpeed));if(!e.axis||e.axis!="y")b.pageX-a(document).scrollLeft()<e.scrollSensitivity?f=a(document).scrollLeft(a(document).scrollLeft()-e.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<e.scrollSensitivity&&(f=a(document).scrollLeft(a(document).scrollLeft()+e.scrollSpeed))}f!==!1&&a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(d,b)}}),a.ui.plugin.add("draggable","snap",{start:function(b,c){var d=a(this).data("draggable"),e=d.options;d.snapElements=[],a(e.snap.constructor!=String?e.snap.items||":data(draggable)":e.snap).each(function(){var b=a(this),c=b.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:b.outerWidth(),height:b.outerHeight(),top:c.top,left:c.left})})},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=e.snapTolerance,g=c.offset.left,h=g+d.helperProportions.width,i=c.offset.top,j=i+d.helperProportions.height;for(var k=d.snapElements.length-1;k>=0;k--){var l=d.snapElements[k].left,m=l+d.snapElements[k].width,n=d.snapElements[k].top,o=n+d.snapElements[k].height;if(!(l-f<g&&g<m+f&&n-f<i&&i<o+f||l-f<g&&g<m+f&&n-f<j&&j<o+f||l-f<h&&h<m+f&&n-f<i&&i<o+f||l-f<h&&h<m+f&&n-f<j&&j<o+f)){d.snapElements[k].snapping&&d.options.snap.release&&d.options.snap.release.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=!1;continue}if(e.snapMode!="inner"){var p=Math.abs(n-j)<=f,q=Math.abs(o-i)<=f,r=Math.abs(l-h)<=f,s=Math.abs(m-g)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n-d.helperProportions.height,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l-d.helperProportions.width}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m}).left-d.margins.left)}var t=p||q||r||s;if(e.snapMode!="outer"){var p=Math.abs(n-i)<=f,q=Math.abs(o-j)<=f,r=Math.abs(l-g)<=f,s=Math.abs(m-h)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o-d.helperProportions.height,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m-d.helperProportions.width}).left-d.margins.left)}!d.snapElements[k].snapping&&(p||q||r||s||t)&&d.options.snap.snap&&d.options.snap.snap.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=p||q||r||s||t}}}),a.ui.plugin.add("draggable","stack",{start:function(b,c){var d=a(this).data("draggable").options,e=a.makeArray(a(d.stack)).sort(function(b,c){return(parseInt(a(b).css("zIndex"),10)||0)-(parseInt(a(c).css("zIndex"),10)||0)});if(!e.length)return;var f=parseInt(e[0].style.zIndex)||0;a(e).each(function(a){this.style.zIndex=f+a}),this[0].style.zIndex=f+e.length}}),a.ui.plugin.add("draggable","zIndex",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("zIndex")&&(e._zIndex=d.css("zIndex")),d.css("zIndex",e.zIndex)},stop:function(b,c){var d=a(this).data("draggable").options;d._zIndex&&a(c.helper).css("zIndex",d._zIndex)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.resizable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.resizable",a.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1e3},_create:function(){var b=this,c=this.options;this.element.addClass("ui-resizable"),a.extend(this,{_aspectRatio:!!c.aspectRatio,aspectRatio:c.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:c.helper||c.ghost||c.animate?c.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=c.handles||(a(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se");if(this.handles.constructor==String){this.handles=="all"&&(this.handles="n,e,s,w,se,sw,ne,nw");var d=this.handles.split(",");this.handles={};for(var e=0;e<d.length;e++){var f=a.trim(d[e]),g="ui-resizable-"+f,h=a('<div class="ui-resizable-handle '+g+'"></div>');h.css({zIndex:c.zIndex}),"se"==f&&h.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[f]=".ui-resizable-"+f,this.element.append(h)}}this._renderAxis=function(b){b=b||this.element;for(var c in this.handles){this.handles[c].constructor==String&&(this.handles[c]=a(this.handles[c],this.element).show());if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var d=a(this.handles[c],this.element),e=0;e=/sw|ne|nw|se|n|s/.test(c)?d.outerHeight():d.outerWidth();var f=["padding",/ne|nw|n/.test(c)?"Top":/se|sw|s/.test(c)?"Bottom":/^e$/.test(c)?"Right":"Left"].join("");b.css(f,e),this._proportionallyResize()}if(!a(this.handles[c]).length)continue}},this._renderAxis(this.element),this._handles=a(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){if(!b.resizing){if(this.className)var a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=a&&a[1]?a[1]:"se"}}),c.autoHide&&(this._handles.hide(),a(this.element).addClass("ui-resizable-autohide").hover(function(){if(c.disabled)return;a(this).removeClass("ui-resizable-autohide"),b._handles.show()},function(){if(c.disabled)return;b.resizing||(a(this).addClass("ui-resizable-autohide"),b._handles.hide())})),this._mouseInit()},destroy:function(){this._mouseDestroy();var b=function(b){a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){b(this.element);var c=this.element;c.after(this.originalElement.css({position:c.css("position"),width:c.outerWidth(),height:c.outerHeight(),top:c.css("top"),left:c.css("left")})).remove()}return this.originalElement.css("resize",this.originalResizeStyle),b(this.originalElement),this},_mouseCapture:function(b){var c=!1;for(var d in this.handles)a(this.handles[d])[0]==b.target&&(c=!0);return!this.options.disabled&&c},_mouseStart:function(b){var d=this.options,e=this.element.position(),f=this.element;this.resizing=!0,this.documentScroll={top:a(document).scrollTop(),left:a(document).scrollLeft()},(f.is(".ui-draggable")||/absolute/.test(f.css("position")))&&f.css({position:"absolute",top:e.top,left:e.left}),this._renderProxy();var g=c(this.helper.css("left")),h=c(this.helper.css("top"));d.containment&&(g+=a(d.containment).scrollLeft()||0,h+=a(d.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:g,top:h},this.size=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalSize=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalPosition={left:g,top:h},this.sizeDiff={width:f.outerWidth()-f.width(),height:f.outerHeight()-f.height()},this.originalMousePosition={left:b.pageX,top:b.pageY},this.aspectRatio=typeof d.aspectRatio=="number"?d.aspectRatio:this.originalSize.width/this.originalSize.height||1;var i=a(".ui-resizable-"+this.axis).css("cursor");return a("body").css("cursor",i=="auto"?this.axis+"-resize":i),f.addClass("ui-resizable-resizing"),this._propagate("start",b),!0},_mouseDrag:function(b){var c=this.helper,d=this.options,e={},f=this,g=this.originalMousePosition,h=this.axis,i=b.pageX-g.left||0,j=b.pageY-g.top||0,k=this._change[h];if(!k)return!1;var l=k.apply(this,[b,i,j]),m=a.browser.msie&&a.browser.version<7,n=this.sizeDiff;this._updateVirtualBoundaries(b.shiftKey);if(this._aspectRatio||b.shiftKey)l=this._updateRatio(l,b);return l=this._respectSize(l,b),this._propagate("resize",b),c.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"}),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),this._updateCache(l),this._trigger("resize",b,this.ui()),!1},_mouseStop:function(b){this.resizing=!1;var c=this.options,d=this;if(this._helper){var e=this._proportionallyResizeElements,f=e.length&&/textarea/i.test(e[0].nodeName),g=f&&a.ui.hasScroll(e[0],"left")?0:d.sizeDiff.height,h=f?0:d.sizeDiff.width,i={width:d.helper.width()-h,height:d.helper.height()-g},j=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,k=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;c.animate||this.element.css(a.extend(i,{top:k,left:j})),d.helper.height(d.size.height),d.helper.width(d.size.width),this._helper&&!c.animate&&this._proportionallyResize()}return a("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",b),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(a){var b=this.options,c,e,f,g,h;h={minWidth:d(b.minWidth)?b.minWidth:0,maxWidth:d(b.maxWidth)?b.maxWidth:Infinity,minHeight:d(b.minHeight)?b.minHeight:0,maxHeight:d(b.maxHeight)?b.maxHeight:Infinity};if(this._aspectRatio||a)c=h.minHeight*this.aspectRatio,f=h.minWidth/this.aspectRatio,e=h.maxHeight*this.aspectRatio,g=h.maxWidth/this.aspectRatio,c>h.minWidth&&(h.minWidth=c),f>h.minHeight&&(h.minHeight=f),e<h.maxWidth&&(h.maxWidth=e),g<h.maxHeight&&(h.maxHeight=g);this._vBoundaries=h},_updateCache:function(a){var b=this.options;this.offset=this.helper.offset(),d(a.left)&&(this.position.left=a.left),d(a.top)&&(this.position.top=a.top),d(a.height)&&(this.size.height=a.height),d(a.width)&&(this.size.width=a.width)},_updateRatio:function(a,b){var c=this.options,e=this.position,f=this.size,g=this.axis;return d(a.height)?a.width=a.height*this.aspectRatio:d(a.width)&&(a.height=a.width/this.aspectRatio),g=="sw"&&(a.left=e.left+(f.width-a.width),a.top=null),g=="nw"&&(a.top=e.top+(f.height-a.height),a.left=e.left+(f.width-a.width)),a},_respectSize:function(a,b){var c=this.helper,e=this._vBoundaries,f=this._aspectRatio||b.shiftKey,g=this.axis,h=d(a.width)&&e.maxWidth&&e.maxWidth<a.width,i=d(a.height)&&e.maxHeight&&e.maxHeight<a.height,j=d(a.width)&&e.minWidth&&e.minWidth>a.width,k=d(a.height)&&e.minHeight&&e.minHeight>a.height;j&&(a.width=e.minWidth),k&&(a.height=e.minHeight),h&&(a.width=e.maxWidth),i&&(a.height=e.maxHeight);var l=this.originalPosition.left+this.originalSize.width,m=this.position.top+this.size.height,n=/sw|nw|w/.test(g),o=/nw|ne|n/.test(g);j&&n&&(a.left=l-e.minWidth),h&&n&&(a.left=l-e.maxWidth),k&&o&&(a.top=m-e.minHeight),i&&o&&(a.top=m-e.maxHeight);var p=!a.width&&!a.height;return p&&!a.left&&a.top?a.top=null:p&&!a.top&&a.left&&(a.left=null),a},_proportionallyResize:function(){var b=this.options;if(!this._proportionallyResizeElements.length)return;var c=this.helper||this.element;for(var d=0;d<this._proportionallyResizeElements.length;d++){var e=this._proportionallyResizeElements[d];if(!this.borderDif){var f=[e.css("borderTopWidth"),e.css("borderRightWidth"),e.css("borderBottomWidth"),e.css("borderLeftWidth")],g=[e.css("paddingTop"),e.css("paddingRight"),e.css("paddingBottom"),e.css("paddingLeft")];this.borderDif=a.map(f,function(a,b){var c=parseInt(a,10)||0,d=parseInt(g[b],10)||0;return c+d})}if(!a.browser.msie||!a(c).is(":hidden")&&!a(c).parents(":hidden").length)e.css({height:c.height()-this.borderDif[0]-this.borderDif[2]||0,width:c.width()-this.borderDif[1]-this.borderDif[3]||0});else continue}},_renderProxy:function(){var b=this.element,c=this.options;this.elementOffset=b.offset();if(this._helper){this.helper=this.helper||a('<div style="overflow:hidden;"></div>');var d=a.browser.msie&&a.browser.version<7,e=d?1:0,f=d?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+f,height:this.element.outerHeight()+f,position:"absolute",left:this.elementOffset.left-e+"px",top:this.elementOffset.top-e+"px",zIndex:++c.zIndex}),this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(a,b,c){return{width:this.originalSize.width+b}},w:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{left:f.left+b,width:e.width-b}},n:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{top:f.top+c,height:e.height-c}},s:function(a,b,c){return{height:this.originalSize.height+c}},se:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},sw:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,c,d]))},ne:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},nw:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,c,d]))}},_propagate:function(b,c){a.ui.plugin.call(this,b,[c,this.ui()]),b!="resize"&&this._trigger(b,c,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),a.extend(a.ui.resizable,{version:"1.8.21"}),a.ui.plugin.add("resizable","alsoResize",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=function(b){a(b).each(function(){var b=a(this);b.data("resizable-alsoresize",{width:parseInt(b.width(),10),height:parseInt(b.height(),10),left:parseInt(b.css("left"),10),top:parseInt(b.css("top"),10)})})};typeof e.alsoResize=="object"&&!e.alsoResize.parentNode?e.alsoResize.length?(e.alsoResize=e.alsoResize[0],f(e.alsoResize)):a.each(e.alsoResize,function(a){f(a)}):f(e.alsoResize)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.originalSize,g=d.originalPosition,h={height:d.size.height-f.height||0,width:d.size.width-f.width||0,top:d.position.top-g.top||0,left:d.position.left-g.left||0},i=function(b,d){a(b).each(function(){var b=a(this),e=a(this).data("resizable-alsoresize"),f={},g=d&&d.length?d:b.parents(c.originalElement[0]).length?["width","height"]:["width","height","top","left"];a.each(g,function(a,b){var c=(e[b]||0)+(h[b]||0);c&&c>=0&&(f[b]=c||null)}),b.css(f)})};typeof e.alsoResize=="object"&&!e.alsoResize.nodeType?a.each(e.alsoResize,function(a,b){i(a,b)}):i(e.alsoResize)},stop:function(b,c){a(this).removeData("resizable-alsoresize")}}),a.ui.plugin.add("resizable","animate",{stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d._proportionallyResizeElements,g=f.length&&/textarea/i.test(f[0].nodeName),h=g&&a.ui.hasScroll(f[0],"left")?0:d.sizeDiff.height,i=g?0:d.sizeDiff.width,j={width:d.size.width-i,height:d.size.height-h},k=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,l=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;d.element.animate(a.extend(j,l&&k?{top:l,left:k}:{}),{duration:e.animateDuration,easing:e.animateEasing,step:function(){var c={width:parseInt(d.element.css("width"),10),height:parseInt(d.element.css("height"),10),top:parseInt(d.element.css("top"),10),left:parseInt(d.element.css("left"),10)};f&&f.length&&a(f[0]).css({width:c.width,height:c.height}),d._updateCache(c),d._propagate("resize",b)}})}}),a.ui.plugin.add("resizable","containment",{start:function(b,d){var e=a(this).data("resizable"),f=e.options,g=e.element,h=f.containment,i=h instanceof a?h.get(0):/parent/.test(h)?g.parent().get(0):h;if(!i)return;e.containerElement=a(i);if(/document/.test(h)||h==document)e.containerOffset={left:0,top:0},e.containerPosition={left:0,top:0},e.parentData={element:a(document),left:0,top:0,width:a(document).width(),height:a(document).height()||document.body.parentNode.scrollHeight};else{var j=a(i),k=[];a(["Top","Right","Left","Bottom"]).each(function(a,b){k[a]=c(j.css("padding"+b))}),e.containerOffset=j.offset(),e.containerPosition=j.position(),e.containerSize={height:j.innerHeight()-k[3],width:j.innerWidth()-k[1]};var l=e.containerOffset,m=e.containerSize.height,n=e.containerSize.width,o=a.ui.hasScroll(i,"left")?i.scrollWidth:n,p=a.ui.hasScroll(i)?i.scrollHeight:m;e.parentData={element:i,left:l.left,top:l.top,width:o,height:p}}},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.containerSize,g=d.containerOffset,h=d.size,i=d.position,j=d._aspectRatio||b.shiftKey,k={top:0,left:0},l=d.containerElement;l[0]!=document&&/static/.test(l.css("position"))&&(k=g),i.left<(d._helper?g.left:0)&&(d.size.width=d.size.width+(d._helper?d.position.left-g.left:d.position.left-k.left),j&&(d.size.height=d.size.width/d.aspectRatio),d.position.left=e.helper?g.left:0),i.top<(d._helper?g.top:0)&&(d.size.height=d.size.height+(d._helper?d.position.top-g.top:d.position.top),j&&(d.size.width=d.size.height*d.aspectRatio),d.position.top=d._helper?g.top:0),d.offset.left=d.parentData.left+d.position.left,d.offset.top=d.parentData.top+d.position.top;var m=Math.abs((d._helper?d.offset.left-k.left:d.offset.left-k.left)+d.sizeDiff.width),n=Math.abs((d._helper?d.offset.top-k.top:d.offset.top-g.top)+d.sizeDiff.height),o=d.containerElement.get(0)==d.element.parent().get(0),p=/relative|absolute/.test(d.containerElement.css("position"));o&&p&&(m-=d.parentData.left),m+d.size.width>=d.parentData.width&&(d.size.width=d.parentData.width-m,j&&(d.size.height=d.size.width/d.aspectRatio)),n+d.size.height>=d.parentData.height&&(d.size.height=d.parentData.height-n,j&&(d.size.width=d.size.height*d.aspectRatio))},stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.position,g=d.containerOffset,h=d.containerPosition,i=d.containerElement,j=a(d.helper),k=j.offset(),l=j.outerWidth()-d.sizeDiff.width,m=j.outerHeight()-d.sizeDiff.height;d._helper&&!e.animate&&/relative/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m}),d._helper&&!e.animate&&/static/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m})}}),a.ui.plugin.add("resizable","ghost",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size;d.ghost=d.originalElement.clone(),d.ghost.css({opacity:.25,display:"block",position:"relative",height:f.height,width:f.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof e.ghost=="string"?e.ghost:""),d.ghost.appendTo(d.helper)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.ghost.css({position:"relative",height:d.size.height,width:d.size.width})},stop:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.helper&&d.helper.get(0).removeChild(d.ghost.get(0))}}),a.ui.plugin.add("resizable","grid",{resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size,g=d.originalSize,h=d.originalPosition,i=d.axis,j=e._aspectRatio||b.shiftKey;e.grid=typeof e.grid=="number"?[e.grid,e.grid]:e.grid;var k=Math.round((f.width-g.width)/(e.grid[0]||1))*(e.grid[0]||1),l=Math.round((f.height-g.height)/(e.grid[1]||1))*(e.grid[1]||1);/^(se|s|e)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l):/^(ne)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l):/^(sw)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.left=h.left-k):(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l,d.position.left=h.left-k)}});var c=function(a){return parseInt(a,10)||0},d=function(a){return!isNaN(parseInt(a,10))}})(jQuery);;/*
 * jQuery UI Dialog 1.8.14
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function(c,l){var m={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},n={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true},o=c.attrFn||{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true,click:true};c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,
position:{my:"center",at:"center",collision:"fit",using:function(a){var b=c(this).css(a).offset().top;b<0&&c(this).css("top",a.top-b)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+
b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);i.preventDefault()}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i)});a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),
h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){h.addClass("ui-state-hover")},function(){h.removeClass("ui-state-hover")}).focus(function(){h.addClass("ui-state-focus")}).blur(function(){h.removeClass("ui-state-focus")}).click(function(i){a.close(i);return false}).appendTo(f);(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);c("<span></span>").addClass("ui-dialog-title").attr("id",
e).html(d).prependTo(f);if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose))b.beforeClose=b.beforeclose;f.find("*").add(f).disableSelection();b.draggable&&c.fn.draggable&&a._makeDraggable();b.resizable&&c.fn.resizable&&a._makeResizable();a._createButtons(b.buttons);a._isOpen=false;c.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;a.overlay&&a.overlay.destroy();a.uiDialog.hide();a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");
a.uiDialog.remove();a.originalTitle&&a.element.attr("title",a.originalTitle);return a},widget:function(){return this.uiDialog},close:function(a){var b=this,d,e;if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();b.uiDialog.unbind("keypress.ui-dialog");b._isOpen=false;if(b.options.hide)b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a)});else{b.uiDialog.hide();b._trigger("close",a)}c.ui.dialog.overlay.resize();if(b.options.modal){d=0;c(".ui-dialog").each(function(){if(this!==
b.uiDialog[0]){e=c(this).css("z-index");isNaN(e)||(d=Math.max(d,e))}});c.ui.dialog.maxZ=d}return b}},isOpen:function(){return this._isOpen},moveToTop:function(a,b){var d=this,e=d.options;if(e.modal&&!a||!e.stack&&!e.modal)return d._trigger("focus",b);if(e.zIndex>c.ui.dialog.maxZ)c.ui.dialog.maxZ=e.zIndex;if(d.overlay){c.ui.dialog.maxZ+=1;d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ)}a={scrollTop:d.element.attr("scrollTop"),scrollLeft:d.element.attr("scrollLeft")};c.ui.dialog.maxZ+=
1;d.uiDialog.css("z-index",c.ui.dialog.maxZ);d.element.attr(a);d._trigger("focus",b);return d},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;a.overlay=b.modal?new c.ui.dialog.overlay(a):null;a._size();a._position(b.position);d.show(b.show);a.moveToTop(true);b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");g=g.filter(":last");if(e.target===g[0]&&!e.shiftKey){f.focus(1);return false}else if(e.target===
f[0]&&e.shiftKey){g.focus(1);return false}}});c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();a._isOpen=true;a._trigger("open");return a}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);b.uiDialog.find(".ui-dialog-buttonpane").remove();typeof a==="object"&&a!==null&&c.each(a,
function(){return!(d=true)});if(d){c.each(a,function(f,h){h=c.isFunction(h)?{click:h,text:f}:h;var i=c('<button type="button"></button>').click(function(){h.click.apply(b.element[0],arguments)}).appendTo(g);c.each(h,function(j,k){if(j!=="click")j in o?i[j](k):i.attr(j,k)});c.fn.button&&i.button()});e.appendTo(b.uiDialog)}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset}}var b=this,d=b.options,e=c(document),g;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",
handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=d.height==="auto"?"auto":c(this).height();c(this).height(c(this).height()).addClass("ui-dialog-dragging");b._trigger("dragStart",f,a(h))},drag:function(f,h){b._trigger("drag",f,a(h))},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];c(this).removeClass("ui-dialog-dragging").height(g);b._trigger("dragStop",f,a(h));c.ui.dialog.overlay.resize()}})},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,
originalSize:f.originalSize,position:f.position,size:f.size}}a=a===l?this.options.resizable:a;var d=this,e=d.options,g=d.uiDialog.css("position");a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");d._trigger("resizeStart",f,b(h))},resize:function(f,h){d._trigger("resize",
f,b(h))},stop:function(f,h){c(this).removeClass("ui-dialog-resizing");e.height=c(this).height();e.width=c(this).width();d._trigger("resizeStop",f,b(h));c.ui.dialog.overlay.resize()}}).css("position",g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(a){var b=[],d=[0,0],e;if(a){if(typeof a==="string"||typeof a==="object"&&"0"in a){b=a.split?a.split(" "):
[a[0],a[1]];if(b.length===1)b[1]=b[0];c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];b[g]=f}});a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")}}a=c.extend({},c.ui.dialog.prototype.options.position,a)}else a=c.ui.dialog.prototype.options.position;(e=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(c.extend({of:window},a));e||this.uiDialog.hide()},_setOptions:function(a){var b=this,d={},e=false;c.each(a,function(g,f){b._setOption(g,f);
if(g in m)e=true;if(g in n)d[g]=f});e&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d)},_setOption:function(a,b){var d=this,e=d.uiDialog;switch(a){case "beforeclose":a="beforeClose";break;case "buttons":d._createButtons(b);break;case "closeText":d.uiDialogTitlebarCloseText.text(""+b);break;case "dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);break;case "disabled":b?e.addClass("ui-dialog-disabled"):
e.removeClass("ui-dialog-disabled");break;case "draggable":var g=e.is(":data(draggable)");g&&!b&&e.draggable("destroy");!g&&b&&d._makeDraggable();break;case "position":d._position(b);break;case "resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");g&&typeof b==="string"&&e.resizable("option","handles",b);!g&&b!==false&&d._makeResizable(b);break;case "title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));break}c.Widget.prototype._setOption.apply(d,arguments)},_size:function(){var a=
this.options,b,d,e=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0});if(a.minWidth>a.width)a.width=a.minWidth;b=this.uiDialog.css({height:"auto",width:a.width}).height();d=Math.max(0,a.minHeight-b);if(a.height==="auto")if(c.support.minHeight)this.element.css({minHeight:d,height:"auto"});else{this.uiDialog.show();a=this.element.css("height","auto").height();e||this.uiDialog.hide();this.element.height(Math.max(a,d))}else this.element.height(Math.max(a.height-
b,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}});c.extend(c.ui.dialog,{version:"1.8.14",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");if(!a){this.uuid+=1;a=this.uuid}return"ui-dialog-title-"+a},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a)}});c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),
create:function(a){if(this.instances.length===0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ)return false})},1);c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);d.preventDefault()}});c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize)}var b=(this.oldInstances.pop()||c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),
height:this.height()});c.fn.bgiframe&&b.bgiframe();this.instances.push(b);return b},destroy:function(a){var b=c.inArray(a,this.instances);b!=-1&&this.oldInstances.push(this.instances.splice(b,1)[0]);this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");a.remove();var d=0;c.each(this.instances,function(){d=Math.max(d,this.css("z-index"))});this.maxZ=d},height:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return a<b?c(window).height()+"px":a+"px"}else return c(document).height()+"px"},width:function(){var a,b;if(c.browser.msie){a=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return a<b?c(window).width()+"px":a+"px"}else return c(document).width()+"px"},resize:function(){var a=c([]);c.each(c.ui.dialog.overlay.instances,function(){a=
a.add(this)});a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()})}});c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);
;
// IMPORTANT NOTE: THIS FILE HAS BEEN MODIFIED TO INCLUDE CUSTOM JSON METHODS FOR EVAULATING CCL FLOAT NUMBERS
 
/*
    http://www.JSON.org/json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
        // check to see if a ccl float number
            if(JSON.isCCLFloatNumber(value) > " "){         
                return JSON.getCCLFloatNumber(value);   
            }
            else{
                return quote(value);
            }

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

//---------------------------------- CUSTOM JSON METHODS FOR EVAULATING CCL FLOAT NUMBERS -------------------
JSON.CCLFLOAT = "@CCL_FLOAT@"
JSON.isCCLFloatNumber = function(jsString){
    // If the string is a ccl float => return the valid ccl float number
    if(jsString.indexOf(JSON.CCLFLOAT) === 0){
        return true;
    }
    return false;
}
JSON.setCCLFloatNumber = function(jsNumber){
    var returnNumber = jsNumber;
    //If value is a true number
    if (typeof jsNumber == 'number' && !isNaN(jsNumber)){
        // if value is not a floating point number -> do a set fixed
        if( parseFloat(jsNumber) == parseInt(jsNumber,10) ){
            jsNumber = jsNumber.toFixed(2);
        }
        // convert to unique string format
        returnNumber = JSON.CCLFLOAT+jsNumber;
    }
    return (returnNumber);
}
JSON.getCCLFloatNumber = function(jsString){
    var returnNumber = "";
    // If the string is a ccl float => return the valid ccl float number
    returnNumber = jsString.split(JSON.CCLFLOAT).join("");
    
    return (returnNumber);
}
//--------------------------------------------------------------------------------------------------------
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
// Underscore.js 1.3.3
// (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return 0!==a||1/a==1/c;if(null==a||null==c)return a===c;a._chain&&(a=a._wrapped);c._chain&&(c=c._wrapped);if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return!1;switch(e){case "[object String]":return a==""+c;case "[object Number]":return a!=+a?c!=+c:0==a?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if("object"!=typeof a||"object"!=typeof c)return!1;for(var f=d.length;f--;)if(d[f]==a)return!0;d.push(a);var f=0,g=!0;if("[object Array]"==e){if(f=a.length,g=f==c.length)for(;f--&&(g=f in a==f in c&&r(a[f],c[f],d)););}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return!1;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,h)&&!f--)break;
g=!f}}d.pop();return g}var s=this,I=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,J=k.unshift,l=p.toString,K=p.hasOwnProperty,y=k.forEach,z=k.map,A=k.reduce,B=k.reduceRight,C=k.filter,D=k.every,E=k.some,q=k.indexOf,F=k.lastIndexOf,p=Array.isArray,L=Object.keys,t=Function.prototype.bind,b=function(a){return new m(a)};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._=b):s._=b;b.VERSION="1.3.3";var j=b.each=b.forEach=function(a,
c,d){if(a!=null)if(y&&a.forEach===y)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===o)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===o)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.map===z)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(A&&
a.reduce===A){e&&(c=b.bind(c,e));return f?a.reduce(c,d):a.reduce(c)}j(a,function(a,b,i){if(f)d=c.call(e,d,a,b,i);else{d=a;f=true}});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(B&&a.reduceRight===B){e&&(c=b.bind(c,e));return f?a.reduceRight(c,d):a.reduceRight(c)}var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,
c,b){var e;G(a,function(a,g,h){if(c.call(b,a,g,h)){e=a;return true}});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(C&&a.filter===C)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(D&&a.every===D)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,
a,g,h)))return o});return!!e};var G=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(E&&a.some===E)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;if(q&&a.indexOf===q)return a.indexOf(c)!=-1;return b=G(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=
function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&
(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){d=Math.floor(Math.random()*(f+1));b[f]=b[d];b[d]=a});return b};b.sortBy=function(a,c,d){var e=b.isFunction(c)?c:function(a){return a[c]};return b.pluck(b.map(a,function(a,b,c){return{value:a,criteria:e.call(d,a,b,c)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c===void 0?1:d===void 0?-1:c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};
j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:b.isArray(a)||b.isArguments(a)?i.call(a):a.toArray&&b.isFunction(a.toArray)?a.toArray():b.values(a)};b.size=function(a){return b.isArray(a)?a.length:b.keys(a).length};b.first=b.head=b.take=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,
0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,
e=[];a.length<3&&(c=true);b.reduce(d,function(d,g,h){if(c?b.last(d)!==g||!d.length:!b.include(d,g)){d.push(g);e.push(a[h])}return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1),true);return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=
i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d){d=b.sortedIndex(a,c);return a[d]===c?d:-1}if(q&&a.indexOf===q)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(F&&a.lastIndexOf===F)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){if(arguments.length<=
1){b=a||0;a=0}for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;){g[f++]=a;a=a+d}return g};var H=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));H.prototype=a.prototype;var b=new H,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=
i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(null,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i,j=b.debounce(function(){h=
g=false},c);return function(){d=this;e=arguments;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);j()},c));g?h=true:i=a.apply(d,e);j();g=true;return i}};b.debounce=function(a,b,d){var e;return function(){var f=this,g=arguments;d&&!e&&a.apply(f,g);clearTimeout(e);e=setTimeout(function(){e=null;d||a.apply(f,g)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));
return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=L||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&
c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.pick=function(a){var c={};j(b.flatten(i.call(arguments,1)),function(b){b in a&&(c[b]=a[b])});return c};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=
function(a){if(a==null)return true;if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};b.isArguments(arguments)||(b.isArguments=function(a){return!(!a||!b.has(a,"callee"))});b.isFunction=function(a){return l.call(a)=="[object Function]"};
b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isFinite=function(a){return b.isNumber(a)&&isFinite(a)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,
b){return K.call(a,b)};b.noConflict=function(){s._=I;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.result=function(a,c){if(a==null)return null;var d=a[c];return b.isFunction(d)?d.call(a):d};b.mixin=function(a){j(b.functions(a),function(c){M(c,b[c]=a[c])})};var N=0;b.uniqueId=
function(a){var b=N++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var u=/.^/,n={"\\":"\\","'":"'",r:"\r",n:"\n",t:"\t",u2028:"\u2028",u2029:"\u2029"},v;for(v in n)n[n[v]]=v;var O=/\\|'|\r|\n|\t|\u2028|\u2029/g,P=/\\(\\|'|r|n|t|u2028|u2029)/g,w=function(a){return a.replace(P,function(a,b){return n[b]})};b.template=function(a,c,d){d=b.defaults(d||{},b.templateSettings);a="__p+='"+a.replace(O,function(a){return"\\"+n[a]}).replace(d.escape||
u,function(a,b){return"'+\n_.escape("+w(b)+")+\n'"}).replace(d.interpolate||u,function(a,b){return"'+\n("+w(b)+")+\n'"}).replace(d.evaluate||u,function(a,b){return"';\n"+w(b)+"\n;__p+='"})+"';\n";d.variable||(a="with(obj||{}){\n"+a+"}\n");var a="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+a+"return __p;\n",e=new Function(d.variable||"obj","_",a);if(c)return e(c,b);c=function(a){return e.call(this,a,b)};c.source="function("+(d.variable||"obj")+"){\n"+a+"}";return c};
b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var x=function(a,c){return c?b(a).chain():a},M=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);J.call(a,this._wrapped);return x(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return x(d,
this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return x(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);

//Blackbird 
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

	function generateMarkup() { //build markup
		var spans = [];
		for ( var type in messageTypes ) {
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
			'</div>',
			'<div class="footer">',
				'<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
				'<div class="right"></div>',
			'</div>'
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
				for ( var entry in messageTypes ) {
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
			for ( var type in messageTypes ) {
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
		//added by Eonasdan/Jonathan Peterson to make dialog box draggable if jquery-ui is detected
		if (window.jQuery && jQuery.ui && jQuery.ui.version) {
		        jQuery("#blackbird").draggable({ cancel: "div.main" });
		}
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

	function setState() {
		var props = [];
		for ( var entry in state ) {
			var value = ( state[ entry ] && state[ entry ].constructor === String ) ? '"' + state[ entry ] + '"' : state[ entry ];
			props.push( entry + ':' + value );
		}
		props = props.join( ',' );

		var expiration = new Date();
		expiration.setDate( expiration.getDate() + 14 );
		document.cookie = [ 'blackbird={', props, '}; expires=', expiration.toUTCString() ,';' ].join( '' );

		var newClass = [];
		for ( var word in classes ) {
			newClass.push( classes[ word ] );
		}
		bbird.className = newClass.join( ' ' );
	}

	function getState() {
		var re = new RegExp( /blackbird=({[^;]+})(;|\b|$)/ );
		var match = re.exec( document.cookie );
		return ( match && match[ 1 ] ) ? eval( '(' + match[ 1 ] + ')' ) : { pos:null, size:null, load:null };
	}

	//event handler for 'keyufor (p' event for window
	function readKey( evt ) {
		if ( !evt ) evt = window.event;
		//var code = 113; //F2 key

		//if ( evt && evt.keyCode == code ) {

			//var visible = isVisible();

			//if ( visible && evt.shiftKey && evt.altKey ) clear();
			//else if	 (visible && evt.shiftKey ) reposition();
			//else if ( !evt.shiftKey && !evt.altKey ) {
			//  ( visible ) ? hide() : show();
			//}
                        if (evt.shiftKey && evt.ctrlKey) {
                            if (evt.keyCode === 38) {
                                show();
                            } else if (evt.keyCode === 40) {
                                hide();
                            }
                        }
		//}
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
			function() { ( isVisible() ) ? hide() : show(); },
		resize:
			function() { resize(); },
		clear:
			function() { clear(); },
		move:
			function() { reposition(); },
		debug:
			function( msg ) { addMessage( 'debug', msg ); },
		warn:
			function( msg ) { addMessage( 'warn', msg ); },
		info:
			function( msg ) { addMessage( 'info', msg ); },
		error:
			function( msg ) { addMessage( 'error', msg ); },
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
        if(document.body)
          init();
        else
	  addEvent( window, 'load', init );
		/* initialize Blackbird when the page loads */
		function init() {
			var body = document.getElementsByTagName( 'BODY' )[ 0 ];
			bbird = body.appendChild( generateMarkup() );
			outputList = bbird.getElementsByTagName( 'OL' )[ 0 ];

			backgroundImage();

			//add events
			addEvent( IDs.checkbox, 'click', clickVis );
			addEvent( IDs.filters, 'click', clickFilter );
			addEvent( IDs.controls, 'click', clickControl );
			addEvent( document, 'keyup', readKey);

			resize( state.size );
			reposition( state.pos );
			if ( state.load ) {
				show();
				document.getElementById( IDs.checkbox ).checked = true;
			}

			scrollToBottom();

			window[ NAMESPACE ].init = function() {
				show();
				window[ NAMESPACE ].error( [ '<b>', NAMESPACE, '</b> can only be initialized once' ] );
			}

			addEvent( window, 'unload', function() {
				removeEvent( IDs.checkbox, 'click', clickVis );
				removeEvent( IDs.filters, 'click', clickFilter );
				removeEvent( IDs.controls, 'click', clickControl );
				removeEvent( document, 'keyup', readKey );
			});
		}
})();
//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);
//     Backbone.js 0.5.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `Backbone` variable.
  var previousBackbone = root.Backbone;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.5.3';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;

  // For Backbone's purposes, jQuery or Zepto owns the `$` variable.
  var $ = root.jQuery || root.Zepto;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback, context) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = calls[ev] || (calls[ev] = []);
      list.push([callback, context]);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] && callback === list[i][0]) {
              list[i] = null;
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(eventName) {
      var list, calls, ev, callback, args;
      var both = 2;
      if (!(calls = this._callbacks)) return this;
      while (both--) {
        ev = both ? eventName : 'all';
        if (list = calls[ev]) {
          for (var i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1); i--; l--;
            } else {
              args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
              callback[0].apply(callback[1] || this, args);
            }
          }
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (defaults = this.defaults) {
      if (_.isFunction(defaults)) defaults = defaults.call(this);
      attributes = _.extend({}, defaults, attributes);
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._changed = false;
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute : 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has : function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // We're about to start triggering change events.
      var alreadyChanging = this._changing;
      this._changing = true;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          this._changed = true;
          if (!options.silent) this.trigger('change:' + attr, this, val, options);
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!alreadyChanging && !options.silent && this._changed) this.change(options);
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset : function(attr, options) {
      if (!(attr in this.attributes)) return this;
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (attr == this.idAttribute) delete this.id;
      this._changed = true;
      if (!options.silent) {
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var attr;
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      this._changed = true;
      if (!options.silent) {
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp, xhr);
      };
      options.error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      return (this.sync || Backbone.sync).call(this, method, this, options);
    },

    // Destroy this model on the server if it was already persisted. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      if (this.isNew()) return this.trigger('destroy', this, this.collection, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        model.trigger('destroy', model, model.collection, options);
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'delete', this, options);
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection) || this.urlRoot || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew : function() {
      return this.id == null;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error, options);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    _.bindAll(this, '_onModelEvent', '_removeReference');
    this._reset();
    if (models) this.reset(models, {silent: true});
    this.initialize.apply(this, arguments);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `reset` when finished.
    reset : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this.each(this._removeReference);
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    // Returns the model, or 'false' if validation on a new model fails.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        coll.add(nextModel, options);
        if (success) success(nextModel, resp, xhr);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model to be added to this collection
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        model = new this.model(attrs, {collection: this});
        if (model.validate && !model._performValidation(attrs, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    // Returns the model, or 'false' if validation on a new model fails.
    _add : function(model, options) {
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      var index = options.at != null ? options.at :
                  this.comparator ? this.sortedIndex(model, this.comparator) :
                  this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._onModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      this._removeReference(model);
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference : function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.unbind('all', this._onModelEvent);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent : function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this._remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:([\w\d]+)/g;
  var splatParam    = /\*([\w\d]+)/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate : function(fragment, triggerRoute) {
      Backbone.history.navigate(fragment, triggerRoute);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes : function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp : function(route) {
      route = route.replace(escapeRegExp, "\\$&")
                   .replace(namedParam, "([^\/]*)")
                   .replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment : function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
          if (fragment.indexOf(this.options.root) == 0) fragment = fragment.substr(this.options.root.length);
        } else {
          fragment = window.location.hash;
        }
      }
      return decodeURIComponent(fragment.replace(hashStrip, ''));
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;
      if (this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(hashStrip, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Add a route to be tested when the fragment changes. Routes added later may
    // override previous routes.
    route : function(route, callback) {
      this.handlers.unshift({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    navigate : function(fragment, triggerRoute) {
      var frag = (fragment || '').replace(hashStrip, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;
      if (this._hasPushState) {
        var loc = window.location;
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history.pushState({}, document.title, loc.protocol + '//' + loc.host + frag);
      } else {
        window.location.hash = this.fragment = frag;
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          this.iframe.document.open().close();
          this.iframe.location.hash = frag;
        }
      }
      if (triggerRoute) this.loadUrl(fragment);
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize.apply(this, arguments);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      if (_.isFunction(events)) events = events.call(this);
      $(this.el).unbind('.delegateEvents' + this.cid);
      for (var key in events) {
        var method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` proeprties.
    _ensureElement : function() {
      if (!this.el) {
        var attrs = this.attributes || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.el = this.make(this.tagName, attrs);
      } else if (_.isString(this.el)) {
        this.el = $(this.el).get(0);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json'
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = getUrl(model) || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request.
    return $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp, options);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

}).call(this);

// Backbone.js 0.5.3
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://documentcloud.github.com/backbone
(function(){var h=this,p=h.Backbone,e;e=typeof exports!=="undefined"?exports:h.Backbone={};e.VERSION="0.5.3";var f=h._;if(!f&&typeof require!=="undefined")f=require("underscore")._;var g=h.jQuery||h.Zepto;e.noConflict=function(){h.Backbone=p;return this};e.emulateHTTP=!1;e.emulateJSON=!1;e.Events={bind:function(a,b,c){var d=this._callbacks||(this._callbacks={});(d[a]||(d[a]=[])).push([b,c]);return this},unbind:function(a,b){var c;if(a){if(c=this._callbacks)if(b){c=c[a];if(!c)return this;for(var d=
0,e=c.length;d<e;d++)if(c[d]&&b===c[d][0]){c[d]=null;break}}else c[a]=[]}else this._callbacks={};return this},trigger:function(a){var b,c,d,e,f=2;if(!(c=this._callbacks))return this;for(;f--;)if(b=f?a:"all",b=c[b])for(var g=0,h=b.length;g<h;g++)(d=b[g])?(e=f?Array.prototype.slice.call(arguments,1):arguments,d[0].apply(d[1]||this,e)):(b.splice(g,1),g--,h--);return this}};e.Model=function(a,b){var c;a||(a={});if(c=this.defaults)f.isFunction(c)&&(c=c.call(this)),a=f.extend({},c,a);this.attributes={};
this._escapedAttributes={};this.cid=f.uniqueId("c");this.set(a,{silent:!0});this._changed=!1;this._previousAttributes=f.clone(this.attributes);if(b&&b.collection)this.collection=b.collection;this.initialize(a,b)};f.extend(e.Model.prototype,e.Events,{_previousAttributes:null,_changed:!1,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;b=this.attributes[a];
return this._escapedAttributes[a]=(b==null?"":""+b).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},has:function(a){return this.attributes[a]!=null},set:function(a,b){b||(b={});if(!a)return this;if(a.attributes)a=a.attributes;var c=this.attributes,d=this._escapedAttributes;if(!b.silent&&this.validate&&!this._performValidation(a,b))return!1;if(this.idAttribute in a)this.id=a[this.idAttribute];
var e=this._changing;this._changing=!0;for(var g in a){var h=a[g];if(!f.isEqual(c[g],h))c[g]=h,delete d[g],this._changed=!0,b.silent||this.trigger("change:"+g,this,h,b)}!e&&!b.silent&&this._changed&&this.change(b);this._changing=!1;return this},unset:function(a,b){if(!(a in this.attributes))return this;b||(b={});var c={};c[a]=void 0;if(!b.silent&&this.validate&&!this._performValidation(c,b))return!1;delete this.attributes[a];delete this._escapedAttributes[a];a==this.idAttribute&&delete this.id;this._changed=
!0;b.silent||(this.trigger("change:"+a,this,void 0,b),this.change(b));return this},clear:function(a){a||(a={});var b,c=this.attributes,d={};for(b in c)d[b]=void 0;if(!a.silent&&this.validate&&!this._performValidation(d,a))return!1;this.attributes={};this._escapedAttributes={};this._changed=!0;if(!a.silent){for(b in c)this.trigger("change:"+b,this,void 0,a);this.change(a)}return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,e,f){if(!b.set(b.parse(d,f),a))return!1;c&&
c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},save:function(a,b){b||(b={});if(a&&!this.set(a,b))return!1;var c=this,d=b.success;b.success=function(a,e,f){if(!c.set(c.parse(a,f),b))return!1;d&&d(c,a,f)};b.error=i(b.error,c,b);var f=this.isNew()?"create":"update";return(this.sync||e.sync).call(this,f,this,b)},destroy:function(a){a||(a={});if(this.isNew())return this.trigger("destroy",this,this.collection,a);var b=this,c=a.success;a.success=function(d){b.trigger("destroy",
b,b.collection,a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"delete",this,a)},url:function(){var a=k(this.collection)||this.urlRoot||l();if(this.isNew())return a;return a+(a.charAt(a.length-1)=="/"?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this)},isNew:function(){return this.id==null},change:function(a){this.trigger("change",this,a);this._previousAttributes=f.clone(this.attributes);this._changed=!1},hasChanged:function(a){if(a)return this._previousAttributes[a]!=
this.attributes[a];return this._changed},changedAttributes:function(a){a||(a=this.attributes);var b=this._previousAttributes,c=!1,d;for(d in a)f.isEqual(b[d],a[d])||(c=c||{},c[d]=a[d]);return c},previous:function(a){if(!a||!this._previousAttributes)return null;return this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},_performValidation:function(a,b){var c=this.validate(a);if(c)return b.error?b.error(this,c,b):this.trigger("error",this,c,b),!1;return!0}});
e.Collection=function(a,b){b||(b={});if(b.comparator)this.comparator=b.comparator;f.bindAll(this,"_onModelEvent","_removeReference");this._reset();a&&this.reset(a,{silent:!0});this.initialize.apply(this,arguments)};f.extend(e.Collection.prototype,e.Events,{model:e.Model,initialize:function(){},toJSON:function(){return this.map(function(a){return a.toJSON()})},add:function(a,b){if(f.isArray(a))for(var c=0,d=a.length;c<d;c++)this._add(a[c],b);else this._add(a,b);return this},remove:function(a,b){if(f.isArray(a))for(var c=
0,d=a.length;c<d;c++)this._remove(a[c],b);else this._remove(a,b);return this},get:function(a){if(a==null)return null;return this._byId[a.id!=null?a.id:a]},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},sort:function(a){a||(a={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");this.models=this.sortBy(this.comparator);a.silent||this.trigger("reset",this,a);return this},pluck:function(a){return f.map(this.models,function(b){return b.get(a)})},
reset:function(a,b){a||(a=[]);b||(b={});this.each(this._removeReference);this._reset();this.add(a,{silent:!0});b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,f,e){b[a.add?"add":"reset"](b.parse(d,e),a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},create:function(a,b){var c=this;b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var d=b.success;b.success=function(a,e,f){c.add(a,b);
d&&d(a,e,f)};a.save(null,b);return a},parse:function(a){return a},chain:function(){return f(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId={};this._byCid={}},_prepareModel:function(a,b){if(a instanceof e.Model){if(!a.collection)a.collection=this}else{var c=a;a=new this.model(c,{collection:this});a.validate&&!a._performValidation(c,b)&&(a=!1)}return a},_add:function(a,b){b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var c=this.getByCid(a);if(c)throw Error(["Can't add the same model to a set twice",
c.id]);this._byId[a.id]=a;this._byCid[a.cid]=a;this.models.splice(b.at!=null?b.at:this.comparator?this.sortedIndex(a,this.comparator):this.length,0,a);a.bind("all",this._onModelEvent);this.length++;b.silent||a.trigger("add",a,this,b);return a},_remove:function(a,b){b||(b={});a=this.getByCid(a)||this.get(a);if(!a)return null;delete this._byId[a.id];delete this._byCid[a.cid];this.models.splice(this.indexOf(a),1);this.length--;b.silent||a.trigger("remove",a,this,b);this._removeReference(a);return a},
_removeReference:function(a){this==a.collection&&delete a.collection;a.unbind("all",this._onModelEvent)},_onModelEvent:function(a,b,c,d){(a=="add"||a=="remove")&&c!=this||(a=="destroy"&&this._remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,arguments))}});f.each(["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max",
"min","sortBy","sortedIndex","toArray","size","first","rest","last","without","indexOf","lastIndexOf","isEmpty","groupBy"],function(a){e.Collection.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});e.Router=function(a){a||(a={});if(a.routes)this.routes=a.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var q=/:([\w\d]+)/g,r=/\*([\w\d]+)/g,s=/[-[\]{}()+?.,\\^$|#\s]/g;f.extend(e.Router.prototype,e.Events,{initialize:function(){},route:function(a,
b,c){e.history||(e.history=new e.History);f.isRegExp(a)||(a=this._routeToRegExp(a));e.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d))},this))},navigate:function(a,b){e.history.navigate(a,b)},_bindRoutes:function(){if(this.routes){var a=[],b;for(b in this.routes)a.unshift([b,this.routes[b]]);b=0;for(var c=a.length;b<c;b++)this.route(a[b][0],a[b][1],this[a[b][1]])}},_routeToRegExp:function(a){a=a.replace(s,"\\$&").replace(q,
"([^/]*)").replace(r,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});e.History=function(){this.handlers=[];f.bindAll(this,"checkUrl")};var j=/^#*/,t=/msie [\w.]+/,m=!1;f.extend(e.History.prototype,{interval:50,getFragment:function(a,b){if(a==null)if(this._hasPushState||b){a=window.location.pathname;var c=window.location.search;c&&(a+=c);a.indexOf(this.options.root)==0&&(a=a.substr(this.options.root.length))}else a=window.location.hash;return decodeURIComponent(a.replace(j,
""))},start:function(a){if(m)throw Error("Backbone.history has already been started");this.options=f.extend({},{root:"/"},this.options,a);this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);a=this.getFragment();var b=document.documentMode;if(b=t.exec(navigator.userAgent.toLowerCase())&&(!b||b<=7))this.iframe=g('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a);
this._hasPushState?g(window).bind("popstate",this.checkUrl):"onhashchange"in window&&!b?g(window).bind("hashchange",this.checkUrl):setInterval(this.checkUrl,this.interval);this.fragment=a;m=!0;a=window.location;b=a.pathname==this.options.root;if(this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;else if(this._wantsPushState&&this._hasPushState&&b&&a.hash)this.fragment=a.hash.replace(j,""),window.history.replaceState({},
document.title,a.protocol+"//"+a.host+this.options.root+this.fragment);if(!this.options.silent)return this.loadUrl()},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a==this.fragment&&this.iframe&&(a=this.getFragment(this.iframe.location.hash));if(a==this.fragment||a==decodeURIComponent(this.fragment))return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(window.location.hash)},loadUrl:function(a){var b=this.fragment=this.getFragment(a);
return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){var c=(a||"").replace(j,"");if(!(this.fragment==c||this.fragment==decodeURIComponent(c))){if(this._hasPushState){var d=window.location;c.indexOf(this.options.root)!=0&&(c=this.options.root+c);this.fragment=c;window.history.pushState({},document.title,d.protocol+"//"+d.host+c)}else if(window.location.hash=this.fragment=c,this.iframe&&c!=this.getFragment(this.iframe.location.hash))this.iframe.document.open().close(),
this.iframe.location.hash=c;b&&this.loadUrl(a)}}});e.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.delegateEvents();this.initialize.apply(this,arguments)};var u=/^(\S+)\s*(.*)$/,n=["model","collection","el","id","attributes","className","tagName"];f.extend(e.View.prototype,e.Events,{tagName:"div",$:function(a){return g(a,this.el)},initialize:function(){},render:function(){return this},remove:function(){g(this.el).remove();return this},make:function(a,
b,c){a=document.createElement(a);b&&g(a).attr(b);c&&g(a).html(c);return a},delegateEvents:function(a){if(a||(a=this.events))for(var b in f.isFunction(a)&&(a=a.call(this)),g(this.el).unbind(".delegateEvents"+this.cid),a){var c=this[a[b]];if(!c)throw Error('Event "'+a[b]+'" does not exist');var d=b.match(u),e=d[1];d=d[2];c=f.bind(c,this);e+=".delegateEvents"+this.cid;d===""?g(this.el).bind(e,c):g(this.el).delegate(d,e,c)}},_configure:function(a){this.options&&(a=f.extend({},this.options,a));for(var b=
0,c=n.length;b<c;b++){var d=n[b];a[d]&&(this[d]=a[d])}this.options=a},_ensureElement:function(){if(this.el){if(f.isString(this.el))this.el=g(this.el).get(0)}else{var a=this.attributes||{};if(this.id)a.id=this.id;if(this.className)a["class"]=this.className;this.el=this.make(this.tagName,a)}}});e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=function(a,b){var c=v(this,a,b);c.extend=this.extend;return c};var w={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};e.sync=function(a,
b,c){var d=w[a];c=f.extend({type:d,dataType:"json"},c);if(!c.url)c.url=k(b)||l();if(!c.data&&b&&(a=="create"||a=="update"))c.contentType="application/json",c.data=JSON.stringify(b.toJSON());if(e.emulateJSON)c.contentType="application/x-www-form-urlencoded",c.data=c.data?{model:c.data}:{};if(e.emulateHTTP&&(d==="PUT"||d==="DELETE")){if(e.emulateJSON)c.data._method=d;c.type="POST";c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d)}}if(c.type!=="GET"&&!e.emulateJSON)c.processData=
!1;return g.ajax(c)};var o=function(){},v=function(a,b,c){var d;d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments)};f.extend(d,a);o.prototype=a.prototype;d.prototype=new o;b&&f.extend(d.prototype,b);c&&f.extend(d,c);d.prototype.constructor=d;d.__super__=a.prototype;return d},k=function(a){if(!a||!a.url)return null;return f.isFunction(a.url)?a.url():a.url},l=function(){throw Error('A "url" property or function must be specified');},i=function(a,b,c){return function(d){a?
a(b,d,c):b.trigger("error",b,d,c)}}}).call(this);

/**
 * Load templates synchronously into html from external files
 */
var TemplateLoader = (function() {

	var templates = [],
			toLoad = 0,
			finishedCallback;
			
	/**
	 * stage multiple templates to all be loaded at once
	 * @param [String] path of template file
	 * @param [function] callback function on success
	 */
	function stage(path,parent,callback){
		toLoad++;

		templates[templates.length] = ({
			path:path,
			callback:callback,
			parent:parent
		});
	}
	
	/**
	 * Load template using $.ajax
	 * @param [String] path of template file
	 * @param [Node] parent element to attach template to
	 * @param [function] callback function on success
	 */
	function load(path, parent, callback) {
		var html;
		$.ajax({
			url : path,
			dataType : "text",
			async : false,
			success : function(template) {
				//insert returned template directly into head
				$(template).appendTo(parent);
				toLoad--;
				//execute the callback if passed
				if(callback) {
					callback(template);
				}
				//notify that all templates have loaded
				if(toLoad <= 0 && finishedCallback != null){
					toLoad = 0;
					finishedCallback();
				}
			},
			error : function(template){
				throw "Template path of " + path + " not found.";
				toLoad--;
			},
			isLocal:true
		});
	}

	/**
	 * Load all staged templates.  Templates will first need to be added via <code>TemplateLoader.stage(...)</code>
	 * @param {function} callback for when all templates have loaded.
	 */
	function loadAll(callback){
		finishedCallback = callback;
		for(var i = 0,l = templates.length;i < l;i++){
			load(templates[i].path,templates[i].parent,templates[i].callback);
		}
		templates = [];
	}
	
	/**
	 * Load handlebar template from external file and compile it.  Does attach
	 * template to the html
	 * @param {String} path of external file containing template
	 * @param {String} id of template
	 * @param {Node} parent element in which to insert template
	 * @return {Object} Compiled Handlebars Template
	 */
	function compile(path,id,parent){
		var template,
				complete = false;
		load(path,parent,function(){
			template = Handlebars.compile($("#"+id).html());
			complete = true;
		});

		return template;
	}
	
	/**
	 * Get handlebars template string from specified path and return
	 * compiled template.  Does NOT attach template to the html.
	 * @param {String} path of external file containing template
	 * @param {function} callback when finished
	 * @return {Object} Compiled Handlebars Template
	 */
	function compileFromFile(path,callback){
		var html
				,template
				,complete = false;
		$.ajax({
			url : path,
			dataType:"text",
			async:false,
			success : function(data) {				
				template = Handlebars.compile(data);
				complete = true;
				//execute the callback if passed
				if(callback) {
					callback(template);
				}
			},
			error : function(data){
				throw "Template path of " + path + " not found.";
				return Handlebars.compile("");
			},
			isLocal:true
		});

		return template;
	}
	
	return{
		stage : stage,
		load : load,
		loadAll : loadAll,
		compile : compile,
		compileFromFile : compileFromFile
	};
	
})(); 

/** extern healthe-widget-library-1.3.2-min , dc_mp_js_util_popup */

/**~BB~************************************************************************
 *                                                                       *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
 *                              Technology, Inc.                         *
 *       Revision      (c) 1984-2009 Cerner Corporation                  *
 *                                                                       *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
 *  This material contains the valuable properties and trade secrets of  *
 *  Cerner Corporation of Kansas City, Missouri, United States of        *
 *  America (Cerner), embodying substantial creative efforts and         *
 *  confidential information, ideas and expressions, no part of which    *
 *  may be reproduced or transmitted in any form or by any means, or     *
 *  retained in any storage or retrieval system without the express      *
 *  written permission of Cerner.                                        *
 *                                                                       *
 *  Cerner is a registered mark of Cerner Corporation.                   *
 *                                                                       *
 * 1. Scope of Restrictions                                              *
 *  A.  Us of this Script Source Code shall include the right to:        *
 *  (1) copy the Script Source Code for internal purposes;               *
 *  (2) modify the Script Source Code;                                   *
 *  (3) install the Script Source Code in Client's environment.          *
 *  B. Use of the Script Source Code is for Client's internal purposes   *
 *     only. Client shall not, and shall not cause or permit others, to  *
 *     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
 *     sublicense or otherwise transfer the Script Source Code, in       *
 *     whole or part.                                                    *
 * 2. Protection of Script Source Code                                   *
 *  A. Script Source Code is a product proprietary to Cerner based upon  *
 *     and containing trade secrets and other confidential information   *
 *     not known to the public. Client shall protect the Script Source   *
 *     Code with security measures adequate to prevent disclosures and   *
 *     uses of the Script Source Code.                                   *
 *  B. Client agrees that Client shall not share the Script Source Code  *
 *     with any person or business outside of Client.                    *
 * 3. Client Obligations                                                 *
 *  A. Client shall make a copy of the Script Source Code before         *
 *     modifying any of the scripts.                                     *
 *  B. Client assumes all responsibility for support and maintenance of  *
 *     modified Script Source Code.                                      *
 *  C. Client assumes all responsibility for any future modifications to *
 *     the modified Script Source Code.                                  *
 *  D. Client assumes all responsibility for testing the modified Script *
 *     Source Code prior to moving such code into Client's production    *
 *     environment.                                                      *
 *  E. Prior to making first productive use of the Script Source Code,   *
 *     Client shall perform whatever tests it deems necessary to verify  *
 *     and certify that the Script Source Code, as used by Client,       *
 *     complies with all FDA and other governmental, accrediting, and    *
 *     professional regulatory requirements which are applicable to use  *
 *     of the scripts in Client's environment.                           *
 *  F. In the event Client requests that Cerner make further             *
 *     modifications to the Script Source Code after such code has been  *
 *     modified by Client, Client shall notify Cerner of any             *
 *     modifications to the code and will provide Cerner with the        *
 *     modified Script Source Code. If Client fails to provide Cerner    *
 *     with notice and a copy of the modified Script Source Code, Cerner *
 *     shall have no liability or responsibility for costs, expenses,    *
 *     claims or damages for failure of the scripts to function properly *
 *     and/or without interruption.                                      *
 * 4. Limitations                                                        *
 *  A. Client acknowledges and agrees that once the Script Source Code is*
 *     modified, any warranties set forth in the Agreement between Cerner*
 *     and Client shall not apply.                                       *
 *  B. Cerner assumes no responsibility for any adverse impacts which the*
 *     modified Script Source Code may cause to the functionality or     *
 *     performance of Client's System.                                   *
 *  C. Client waives, releases, relinquishes, and discharges Cerner from *
 *     any and all claims, liabilities, suits, damages, actions, or      *
 *     manner of actions, whether in contract, tort, or otherwise which  *
 *     Client may have against Cerner, whether the same be in            *
 *     administrative proceedings, in arbitration, at law, in equity, or *
 *     mixed, arising from or relating to Client's use of Script Source  *
 *     Code.                                                             *
 * 5. Retention of Ownership                                             *
 *    Cerner retains ownership of all software and source code in this   *
 *    service package. Client agrees that Cerner owns the derivative     *
 *    works to the modified source code. Furthermore, Client agrees to   *
 *    deliver the derivative works to Cerner.                            *
 ~BE~************************************************************************/
/******************************************************************************
 
 Source file name:       dc_mp_js_layout_table.js
 
 Product:                Discern Content
 Product Team:           Discern Content
 
 File purpose:           Provides the TableLayout class with methods
 to build/load table DOM fragments.
 
 Special Notes:          <add any special notes here>
 
 ;~DB~**********************************************************************************
 ;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
 ;**************************************************************************************
 ;*                                                                            		  *
 ;*Mod Date     Engineer             		Feature      Comment                      *
 ;*--- -------- -------------------- 		------------ -----------------------------*
 ;*000 		   RB018070				    	######       Initial Release              *
 ;~DE~**********************************************************************************
 ;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/
/**
 * @author RB018070
 * Reference
 *
 Preference value list:
 
 headerDisplay  	 	(String) 	-	Display string for table header
 headerLink	  		(String) 	-	Link for headerDisplay
 headerToggle  		(Array) 	-	[HideIcon,ShowIcon] Display value for header toggle
 headerCSS			(String) 	-	CSS classname for header
 tableMaxRows	   	(Number)	-	Maximum number of rows to show before scrollbar is displayed **Requires tableRowHeight**
 tableRowHeight		(String)	-	Height of the table ( used to calculate scrolling)
 tableHeaderRowCSS	(String)	-   CSS classname for thead rows on table
 tableHeaderCellCSS	(String)	-   CSS classname for th cells on table
 tableBodyRowCSS		(String)	-   CSS classname for tbody rows on table
 tableBodyRowCSS		(String)	-   CSS classname for td cells on table
 tableBodyRowCSS		(Array)		-	Hover template text for each cell **Requires JSONList**
 tableHeaders		(Array)		-   Headers for each table column
 tableHeadersFixed	(String)	-	True/False value for fixed table columns **Requires tableHeaders**
 tableHeadersResize	(String)	-	True/False value for resizable table columns **Requires tableHeaders**
 numberColumns		(Numbers)	-	Number of columns to generate on table (*optional* if tableHeaders is specified)
 JSONList			(Array)		-	JSON array consisting of data
 JSONRefs			(Array)		-	JSON reference names in JSONList **Requires JSONList**
 JSONRefHvrSticky
 JSONRefHvrStickyTimeOut
 
 <div>    						wrapperDOM
 <span>
 headerDOM
 </span>
 <div>						tableOuterWrapperDOM
 <div>					tableHeaderWrapperDOM 		(optional)
 <table></table>	tableHeaderDOM	> tHeadDOM	(optional)
 </div>
 <div>					tableWrapperDOM
 <table></table>		tableDOM > tableBodyDOM
 </div>
 </div>
 </div>
 
 
 **/
var TableLayout = function(){
    // Private Methods
    function TableLayout_replaceTags(tagTxt, jsonList){
        var objRegExp = /=%(\w+)/g, tagSplit = tagTxt.match(objRegExp), i = 0, l = 0;
        if (tagSplit && tagSplit.length > 0) {
            for (i = 0, l = tagSplit.length; i < l; i++) {
                tagTxt = tagTxt.split(tagSplit[i]).join(jsonList[tagSplit[i].split("=%").join("")]);
            }
        }
        return (tagTxt)
    }
    function TableLayout_attachResizeEvents(dragDOM, leftColDOM, rightColDOM, leftHeaderColDOM, rightheaderColDOM){
        var startMousePosition, startLeftColWidth, startRightColWidth, mouseMovefnc = function(e){
            var e, curMousePosition = TableLayout_mpo(e), widthdiff1 = startMousePosition[1] - curMousePosition[1], widthdiff2 = curMousePosition[1] - startMousePosition[1];
            if (!e) {
                e = window.event;
            }
            if (widthdiff2 <= 0) { // dragging left (leftColDOM width decreases)
                if ((startLeftColWidth - widthdiff1) < 0) {
                    leftHeaderColDOM.style.width = "0px";
                    leftColDOM.style.width = "0px";
                }
                else {
                    leftHeaderColDOM.style.width = (startLeftColWidth - widthdiff1) + "px";
                    leftColDOM.style.width = (startLeftColWidth - widthdiff1) + "px";
                }
                rightheaderColDOM.style.width = (startRightColWidth + widthdiff1) + "px";
                rightColDOM.style.width = (startRightColWidth + widthdiff1) + "px";
            }
            else {// dragging right (rightColDOM width decreases)
                leftHeaderColDOM.style.width = (startLeftColWidth + widthdiff2) + "px";
                leftColDOM.style.width = (startLeftColWidth + widthdiff2) + "px";
                if (startRightColWidth - widthdiff2 < 0) {
                    rightheaderColDOM.style.width = "0px";
                    rightColDOM.style.width = "0px";
                }
                else {
                    rightheaderColDOM.style.width = (startRightColWidth - widthdiff2) + "px";
                    rightColDOM.style.width = (startRightColWidth - widthdiff2) + "px";
                }
            }
            Util.preventDefault(e);
        }, mouseUpfnc = function(e){
            var e;
            if (!e) {
                e = window.event;
            }
            Util.removeEvent(document, "mousemove", mouseMovefnc);
            Util.removeEvent(document, "mouseup", mouseUpfnc);
            Util.preventDefault(e);
        }, mouseDownfnc = function(e){
            var e;
            if (!e) {
                e = window.event;
            }
            startMousePosition = TableLayout_mpo(e);
            startLeftColWidth = leftColDOM.offsetWidth;
            startRightColWidth = rightColDOM.offsetWidth;
            Util.addEvent(document, "mousemove", mouseMovefnc);
            Util.addEvent(document, "mouseup", mouseUpfnc);
            Util.preventDefault(e);
        }
        
        Util.addEvent(dragDOM, "mousedown", mouseDownfnc);
    }
    function TableLayout_mpo(e){
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
    function TableLayout_RealTypeOf(v){
        try {
            if (typeof(v) === "object") {
                if (v === null) {
                    return "null";
                }
                if (v.constructor === ([]).constructor) {
                    return "array";
                }
                if (v.constructor === (new Date()).constructor) {
                    return "date";
                }
                if (v.constructor === (new RegExp()).constructor) {
                    return "regex";
                }
                return "object";
            }
            return typeof(v);
        } 
        catch (e) {
        
            error_handler(e.message, "TableLayout_RealTypeOf()");
        }
    }
    function sortTable(tblEl, col, type){
        //-----------------------------------------------------------------------------
        // sortTable(id, col, rev)
        //
        //  id  - ID of the TABLE, TBODY, THEAD or TFOOT element to be sorted.
        //  col - Index of the column to sort, 0 = first column, 1 = second column,
        //        etc.
        //  rev - If true, the column is sorted in reverse (descending) order
        //        initially.
        //
        // Note: the team name column (index 1) is used as a secondary sort column and
        // always sorted in ascending order.
        //-----------------------------------------------------------------------------
        
        // Get the table or table section to sort.
        var rev = false;
        var imghtml;
        // The first time this function is called for a given table, set up an
        // array of reverse sort flags.
        if (tblEl.reverseSort == null) {
            tblEl.reverseSort = new Array();
            // Also, assume the team name column is initially sorted.
            tblEl.lastColumn = 2;
        }
        
        // If this column has not been sorted before, set the initial sort direction.
        if (tblEl.reverseSort[col] == null) 
            tblEl.reverseSort[col] = rev;
        
        
        
        // If this column was the last one sorted, reverse its sort direction.
        if (col == tblEl.lastColumn) {
            tblEl.reverseSort[col] = !tblEl.reverseSort[col];
        }
        
        
        // Remember this column as the last one sorted.
        tblEl.lastColumn = col;
        
        var tmpEl;
        var i, j;
        var minVal, minIdx;
        var testVal;
        var cmp;
        for (i = 0; i < tblEl.rows.length - 1; i++) {
            // Assume the current row has the minimum value.
            minIdx = i;
            if (tblEl.rows[i].cells[col].childNodes && tblEl.rows[i].cells[col].childNodes[0] && tblEl.rows[i].cells[col].childNodes[0].innerHTML) 
                minVal = tblEl.rows[i].cells[col].childNodes[0].innerHTML;
            else 
                minVal = tblEl.rows[i].cells[col].innerHTML;
            // Search the rows that follow the current one for a smaller value.
            for (j = i + 1; j < tblEl.rows.length; j++) {
                if (tblEl.rows[j].cells[col].childNodes && tblEl.rows[j].cells[col].childNodes[0] && tblEl.rows[j].cells[col].childNodes[0].innerHTML) 
                    testVal = tblEl.rows[j].cells[col].childNodes[0].innerHTML;
                else 
                    testVal = tblEl.rows[j].cells[col].innerHTML;
                if (testVal > " ") {
                
                    cmp = compareValues(minVal, testVal, type);
                    
                    // Negate the comparison result if the reverse sort flag is set.
                    if (tblEl.reverseSort[col]) 
                        cmp = -cmp;
                    
                    
                    // If this row has a smaller value than the current minimum, remember its
                    // position and update the current minimum value.
                    if (cmp > 0) {
                        minIdx = j;
                        minVal = testVal;
                    }
                }
            }
            
            // By now, we have the row with the smallest value. Remove it from the
            // table and insert it before the current row.
            if (minIdx > i) {
            
                tmpEl = tblEl.removeChild(tblEl.rows[minIdx]);
                tblEl.insertBefore(tmpEl, tblEl.rows[i]);
            }
            
        }
        return false;
    }
    function compareValues(v1, v2, type){
        if (type == "date") {
            var date1 = v1.split("/");
            var date2 = v2.split("/");
            var tempdate1 = new Date();
            var tempdate2 = new Date();
            var dttmdiff = new Date();
            tempdate1.setFullYear(date1[2], date1[0] - 1, date1[1]);
            tempdate2.setFullYear(date2[2], date2[0] - 1, date2[1]);
            dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
            timediff = dttmdiff.getTime();
            days = Math.floor(timediff / (1000 * 60 * 60 * 24));
            if (days > 0) 
                return 1;
            else 
                if (days == 0) 
                    return 0;
        }
        else 
            if (type == "numeric") {
                if (parseInt(v1) == parseInt(v2)) 
                    return 0;
                if (parseInt(v1) > parseInt(v2)) 
                    return 1
            }
            else {
                if (v1 == v2) 
                    return 0;
                if (v1 > v2) 
                    return 1
            }
        return -1;
    }
    function TableLayout_attachSortEvent(tableHeadCellDOM, tableBodyDOM, colIndex, sortType){
        Util.addEvent(tableHeadCellDOM, "click", function(){
            sortTable(tableBodyDOM, colIndex, sortType);
        });
    }
	function addTableRowEvent(tableRowEvent,tableRowFnc,curRowDOM)
	{	
			if (tableRowEvent == "contextmenu") {
				curRowDOM.oncontextmenu = function(e1){
					return (tableRowFnc(e1, curRowDOM));
				};
			}
			else {
				Util.addEvent(curRowDOM, tableRowEvent, function(e){
					return (tableRowFnc(e, curRowDOM));
				})
			}			
	}
    // Return API
    return {
        generateLayout: function(prefs){
            var wrapperDOM, headerDOM,tempcellDOM, tableOuterWrapperDOM,fnc_cntr = 0, fnc_cnt = 0, tableHeaderWrapperDOM, tableHeaderDOM, tableWrapperDOM, tableDOM, headerlinkDOM, toggleDOM, tHeadDOM, tableBodyDOM, tableHeadCellDOM, prevtableHeadCellDOM, headerRowDOM, curRowDOM, resizeDOM, tableheaderCSS, tableRowId = prefs.JSONRowId, tableRowEvent = prefs.JSONRowEvent, tableRowFnc = prefs.JSONRowFnc, tempstr, cnt1, cntr1, cnt2, cntr2, cntr3, cnt3, hcntr = -1, ccntr = -1, ccntr2 = -1, rcntr = -1;
            
            wrapperDOM = Util.cep("div", {
                "className": "table-layout-wrapper"
            });
            tableOuterWrapperDOM = Util.ce("div");
            tableHeaderWrapperDOM = Util.ce("div");
            tableWrapperDOM = Util.cep("div", {
                "className": "table-layout-wrapper-table"
            });
            tableHeaderDOM = Util.cep("table", {
                "className": "table-layout-table-head"
            });
            tableDOM = Util.cep("table", {
                "className": "table-layout-table"
            });
            if (Util.Detect.ie6() == true) {
                tableDOM.style.width = "auto";
            }
            
            // build header
            if (prefs.headerDisplay && prefs.headerDisplay > "") {
                headerDOM = Util.cep("div", {
                    "className": "table-layout-header"
                });
                if (prefs.headerLink && prefs.headerLink > "") {
                    headerlinkDOM = Util.cep("a", {
                        "href": prefs.headerLink
                    })
                    headerlinkDOM.innerHTML = prefs.headerDisplay;
                    Util.ac(headerlinkDOM, headerDOM);
                }
                else {
                    headerDOM.innerHTML = "<span>" + prefs.headerDisplay + "</span>";
                }
                if (prefs.tableCSS && prefs.tableCSS > "") {
                    tableHeaderDOM.className = tableHeaderDOM.className + " " + prefs.tableCSS;
                    tableDOM.className = tableDOM.className + " " + prefs.tableCSS;
                }
                if (prefs.headerCSS && prefs.headerCSS > "") {
                    headerDOM.className = headerDOM.className + " " + prefs.headerCSS;
                }
                if (prefs.headerToggle && prefs.headerToggle > "") {
                    toggleDOM = Util.cep("span", {
                        "className": "table-layout-header-toggle"
                    });
                    toggleDOM.innerHTML = prefs.headerToggle[0];
                    toggleDOM = Util.ac(toggleDOM, headerDOM);
                    Util.addEvent(toggleDOM, "click", function(){
                        if (tableOuterWrapperDOM.style.display != "none") {
                            tableOuterWrapperDOM.style.display = "none";
                            toggleDOM.innerHTML = prefs.headerToggle[1];
                        }
                        else {
                            tableOuterWrapperDOM.style.display = "";
                            toggleDOM.innerHTML = prefs.headerToggle[0];
                        }
                    });
                };
                headerDOM = Util.ac(headerDOM, wrapperDOM);
            }
            
            tableHeaderDOM = Util.ac(tableHeaderDOM, tableHeaderWrapperDOM);
            tableDOM = Util.ac(tableDOM, tableWrapperDOM);
            tableHeaderWrapperDOM = Util.ac(tableHeaderWrapperDOM, tableOuterWrapperDOM);
            tableWrapperDOM = Util.ac(tableWrapperDOM, tableOuterWrapperDOM);
            tableOuterWrapperDOM = Util.ac(tableOuterWrapperDOM, wrapperDOM);
            //build Table 
            if ((prefs.tableHeaders && prefs.tableHeaders.length && prefs.tableHeaders.length > 0) ||
            (prefs.numberColumns && parseInt(prefs.numberColumns) > 0)) {
                if (prefs.tableHeaders && prefs.tableHeaders.length && prefs.tableHeaders.length > 0) {
                    // Create Table Header Row         
                    if (prefs.tableHeadersFixed &&
                    (prefs.tableHeadersFixed == "true" || prefs.tableHeadersFixed == "1")) {
                        tHeadDOM = tableHeaderDOM.createTHead();
                        tableheaderCSS = "table-layout-table-head-th";
                    }
                    else {
                        tHeadDOM = tableDOM.createTHead();
                        tableheaderCSS = "table-layout-table-th";
                    }
                    
                    tHeadDOM.insertRow(-1);
                    headerRowDOM = tHeadDOM.rows[0];
                    headerRowDOM.colSpan = prefs.tableHeaders.length;
                    // Attach any declared CSS class names for <tr> in <thead>
                    if (prefs.tableHeaderRowCSS && prefs.tableHeaderRowCSS > "") {
                        if (TableLayout_RealTypeOf(prefs.tableHeaderRowCSS) == "string") {
                            headerRowDOM.className = headerRowDOM.className + " " + prefs.tableHeaderRowCSS;
                        }
                    }
                }
                // Load JSON data to table body
                tableBodyDOM = Util.ce("tbody");
                tableBodyDOM = Util.ac(tableBodyDOM, tableDOM);
                if (prefs.numberColumns) 
                    tableBodyDOM.colSpan = parseInt(prefs.numberColumns);
                else 
                    tableBodyDOM.colSpan = prefs.tableHeaders.length;
                
                
                if (prefs.JSONList &&
                prefs.JSONList.length &&
                prefs.JSONList.length > 0 &&
                prefs.JSONRefs &&
                prefs.JSONRefs.length &&
                prefs.JSONRefs.length > 0) {
                    tableBodyDOM.className = "scrollContent";
                    for (var cntr1 = 0, cnt1 = prefs.JSONList.length; cntr1 < cnt1; cntr1++) {
                    
                        tableBodyDOM.insertRow(-1);
                        curRowDOM = tableBodyDOM.rows[cntr1];
                        if (tableRowId) {
                            tempstr = "";
                            
                            if (TableLayout_RealTypeOf(tableRowId) == "array") {
                                for (var cntr3 = 0, cnt3 = tableRowId.length; cntr3 < cnt3; cntr3++) {
                                    if ((prefs.JSONList[cntr1])[tableRowId[cntr3]]) {
                                        tempstr += "_";
                                        tempstr += (prefs.JSONList[cntr1])[tableRowId[cntr3]];
                                    }
                                }
                            }
                            else {
                                if ((prefs.JSONList[cntr1])[tableRowId]) {
                                    tempstr = (prefs.JSONList[cntr1])[tableRowId];
                                }
                            }
                            curRowDOM.id = tempstr;
                        }
						if(tableRowFnc && tableRowEvent && tableRowEvent > "" ){
							if(TableLayout_RealTypeOf(tableRowFnc) == "array"){
								fnc_cnt = tableRowFnc.length;
								for (fnc_cntr = 0; fnc_cntr < fnc_cnt; fnc_cntr++) {
									addTableRowEvent(tableRowEvent[fnc_cntr],tableRowFnc[fnc_cntr],curRowDOM);
								}									
							}
							else{
									addTableRowEvent(tableRowEvent,tableRowFnc,curRowDOM);		
							}					
						}
                        // Attach any declared CSS class names for <tr> in <tbody>
                        if (prefs.tableBodyRowCSS && prefs.tableBodyRowCSS > "") {
                            if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "string") {
                                curRowDOM.className = prefs.tableBodyRowCSS;
                            }
                            else 
                                if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "array") {
                                    if (prefs.tableBodyRowCSS.length == 1) {
                                        curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[0];
                                    }
                                    else {
                                        rcntr += 1;
                                        if (rcntr == prefs.tableBodyRowCSS.length) {
                                            rcntr = 0;
                                        }
                                        curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[rcntr];
                                    }
                                }
                        }
                        
                        if (prefs.tableMaxRows && prefs.tableRowHeight && prefs.tableMaxRows == cntr1) {
                            if (prefs.tableHeadersFixed &&
                            (prefs.tableHeadersFixed == "true" || prefs.tableHeadersFixed == "1")) {
                                tableHeaderWrapperDOM.style.paddingRight = "17px";
                            }
							
                           // tableWrapperDOM.style.height = (prefs.tableMaxRows * parseFloat(prefs.tableRowHeight)) + "em";
							
                        }
                        if (prefs.numberColumns) 
                            curRowDOM.colSpan = parseInt(prefs.numberColumns);
                        else 
                            curRowDOM.colSpan = prefs.tableHeaders.length;
                        for (var cntr2 = 0, cnt2 = prefs.JSONRefs.length; cntr2 < cnt2; cntr2++) {
                            curRowDOM.insertCell(-1);
                            if ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]) {
								tempcellDOM = Util.ce("span");
								tempcellDOM.innerHTML = ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]);
								if (prefs.JSONRefCSS && prefs.JSONRefCSS[cntr2] && prefs.JSONRefCSS[cntr2] > " ") {
									tempcellDOM.className = prefs.JSONRefCSS[cntr2];
								}
								Util.ac(tempcellDOM,curRowDOM.cells[cntr2])
							}
                            curRowDOM.cells[cntr2].className = "table-layout-table-td";
                            // Attach any declared CSS class names for <td> in <tbody>
                            if (prefs.tableBodyCellCSS && prefs.tableBodyCellCSS > "") {
                                if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "string") {
                                    curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS;
                                }
                                else 
                                    if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "array") {
                                        if (prefs.tableBodyCellCSS.length == 1) {
                                            curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[0];
                                        }
                                        else {
                                            ccntr += 1;
                                            if (ccntr == prefs.tableBodyCellCSS.length) {
                                                ccntr = 0;
                                            }
                                            curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[ccntr];
                                        }
                                    }
                            }
                            
                            // Attach any declare hovers for <tr> in <tbody>
                            if (prefs.tableBodyRowHover && prefs.tableBodyRowHover > "") {
                                hcntr += 1;
                                if (hcntr == prefs.tableBodyRowHover.length) {
                                    hcntr = 0;
                                }
                                if (prefs.tableBodyRowHover[hcntr] > "") {
                                    UtilPopup.attachHover({
                                        "elementDOM": curRowDOM.cells[cntr2],
                                        "event": "mousemove",
                                        "content": TableLayout_replaceTags(prefs.tableBodyRowHover[hcntr], prefs.JSONList[cntr1])
                                    });
                                }
                            }
                        }
                    }
                }
                // Build Table Header Cells
                if (prefs.tableHeaders && prefs.tableHeaders.length && prefs.tableHeaders.length > 0) {
                    for (cntr1 = 0, cnt1 = prefs.tableHeaders.length; cntr1 < cnt1; cntr1++) {
                        tableHeadCellDOM = Util.ce("th");
                        tableHeadCellDOM.innerHTML = prefs.tableHeaders[cntr1];
                        // Attach Resize handlers				
                        if (prefs.tableHeadersResize &&
                        (prefs.tableHeadersResize == "true" || prefs.tableHeadersResize == "1")) {
                            if (cntr1 > 0) {
                                if (prefs.tableHeadersFixed &&
                                (prefs.tableHeadersFixed == "true" || prefs.tableHeadersFixed == "1") &&
                                (tableBodyDOM && tableBodyDOM.rows && tableBodyDOM.rows[0])) {
                                    TableLayout_attachResizeEvents(resizeDOM, tableBodyDOM.rows[0].cells[cntr1 - 1], tableBodyDOM.rows[0].cells[cntr1], prevtableHeadCellDOM, tableHeadCellDOM);
                                }
                                else {
                                    TableLayout_attachResizeEvents(resizeDOM, prevtableHeadCellDOM, tableHeadCellDOM, prevtableHeadCellDOM, tableHeadCellDOM);
                                }
                            }
                            resizeDOM = Util.cep("span", {
                                "className": "table-layout-header-resize"
                            });
                            resizeDOM.innerHTML = "&nbsp;";
                            resizeDOM = Util.ac(resizeDOM, tableHeadCellDOM);
                        }
                        //Attach Sort handlers
                        if (prefs.tableSort && prefs.tableSort.length > 0 && prefs.tableSort[cntr1]) {
                            tableHeadCellDOM.title = "Click to sort";
                            tableHeadCellDOM.style.cursor = "pointer";
                            TableLayout_attachSortEvent(tableHeadCellDOM, tableBodyDOM, cntr1, prefs.tableSort[cntr1]);
                        }
                        tableHeadCellDOM.className = tableheaderCSS;
                        // Attach any declared CSS class names for <td> in <thead>
                        if (prefs.tableHeaderCellCSS && prefs.tableHeaderCellCSS > "") {
                            if (TableLayout_RealTypeOf(prefs.tableHeaderCellCSS) == "string") {
                                tableHeadCellDOM.className = tableHeadCellDOM.className + " " + prefs.tableHeaderCellCSS;
                            }
                            else 
                                if (TableLayout_RealTypeOf(prefs.tableHeaderCellCSS) == "array") {
                                    if (prefs.tableHeaderCellCSS.length == 1) {
                                        tableHeadCellDOM.className = tableHeadCellDOM.className + " " + prefs.tableHeaderCellCSS[0];
                                    }
                                    else {
                                        ccntr2 += 1;
                                        if (ccntr2 == prefs.tableHeaderCellCSS.length) {
                                            ccntr2 = 0;
                                        }
                                        tableHeadCellDOM.className = tableHeadCellDOM.className + " " + prefs.tableHeaderCellCSS[ccntr2];
                                    }
                                }
                        }
                        Util.ac(tableHeadCellDOM, headerRowDOM);
                        prevtableHeadCellDOM = tableHeadCellDOM;
                    }
                }
            }
            return ({
                "layoutDOM": wrapperDOM,
                "contentDOM": tableOuterWrapperDOM,
                "tableDOM": tableBodyDOM,
				"headerRowDOM": headerRowDOM,
				"wrapperDOM":tableWrapperDOM
            })
        },
		//Append Rows to existing table
		
		appendRows: function(prefs){
			var  fnc_cntr = 0, fnc_cnt = 0, tableBodyDOM = prefs.tableBodyDOM,tempcellDOM,  curRowDOM, tableRowId = prefs.JSONRowId, tableRowEvent = prefs.JSONRowEvent, tableRowFnc = prefs.JSONRowFnc, tempstr, cnt1, cntr1, cnt2, cntr2, cntr3, cnt3, hcntr = -1, ccntr = -1,rcntr = -1;
			
			
			// Load JSON data to table body
               	if (prefs.numberColumns) {
			   		tableBodyDOM.colSpan = parseInt(prefs.numberColumns);
			   	}
			   	
			   	
			   	if (prefs.JSONList &&
			   	prefs.JSONList.length &&
			   	prefs.JSONList.length > 0 &&
			   	prefs.JSONRefs &&
			   	prefs.JSONRefs.length &&
			   	prefs.JSONRefs.length > 0) {
			   		tableBodyDOM.className = "scrollContent";
			   		for (var cntr1 = 0, cnt1 = prefs.JSONList.length; cntr1 < cnt1; cntr1++) {
					
						if (tableRowId) {
							tempstr = "";
							if (TableLayout_RealTypeOf(tableRowId) == "array") {
								for (var cntr3 = 0, cnt3 = tableRowId.length; cntr3 < cnt3; cntr3++) {
									if ((prefs.JSONList[cntr1])[tableRowId[cntr3]]) {
										tempstr += "_";
										tempstr += (prefs.JSONList[cntr1])[tableRowId[cntr3]];
									}
								}
							}
							else {
								if ((prefs.JSONList[cntr1])[tableRowId]) {
									tempstr = (prefs.JSONList[cntr1])[tableRowId];
								}
							}
						}
						if (_g(tempstr) === undefined || _g(tempstr) === null || !tableRowId) {
							tableBodyDOM.insertRow(-1);
							curRowDOM = tableBodyDOM.rows[tableBodyDOM.rows.length - 1];
							curRowDOM.id = tempstr;
							
							if (tableRowFnc && tableRowEvent && tableRowEvent > "") {
								if (TableLayout_RealTypeOf(tableRowFnc) == "array") {
									fnc_cnt = tableRowFnc.length;
									for (fnc_cntr = 0; fnc_cntr < fnc_cnt; fnc_cntr++) {
										addTableRowEvent(tableRowEvent[fnc_cntr], tableRowFnc[fnc_cntr], curRowDOM);
									}
								}
								else {
									addTableRowEvent(tableRowEvent, tableRowFnc, curRowDOM);
								}
							}
							// Attach any declared CSS class names for <tr> in <tbody>
							if (prefs.tableBodyRowCSS && prefs.tableBodyRowCSS > "") {
								if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "string") {
									curRowDOM.className = prefs.tableBodyRowCSS;
								}
								else 
									if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "array") {
										if (prefs.tableBodyRowCSS.length == 1) {
											curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[0];
										}
										else {
											rcntr = (tableBodyDOM.rows.length-1)%prefs.tableBodyRowCSS.length;
											curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[rcntr];
										}
									}
							}
							
							if (prefs.numberColumns) {
								curRowDOM.colSpan = parseInt(prefs.numberColumns);
							}
							
							for (var cntr2 = 0, cnt2 = prefs.JSONRefs.length; cntr2 < cnt2; cntr2++) {
								curRowDOM.insertCell(-1);
								 if ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]) {
										tempcellDOM = Util.ce("span");
										tempcellDOM.innerHTML = ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]);
										if (prefs.JSONRefCSS && prefs.JSONRefCSS[cntr2] && prefs.JSONRefCSS[cntr2] > " ") {
											tempcellDOM.className = prefs.JSONRefCSS[cntr2];
										}
										Util.ac(tempcellDOM,curRowDOM.cells[cntr2])
								}
								curRowDOM.cells[cntr2].className = "table-layout-table-td";
								// Attach any declared CSS class names for <td> in <tbody>
								if (prefs.tableBodyCellCSS && prefs.tableBodyCellCSS > "") {
									if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "string") {
										curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS;
									}
									else 
										if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "array") {
											if (prefs.tableBodyCellCSS.length == 1) {
												curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[0];
											}
											else {
												ccntr += 1;
												if (ccntr == prefs.tableBodyCellCSS.length) {
													ccntr = 0;
												}
												curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[ccntr];
											}
										}
								}
								
								// Attach any declare hovers for <tr> in <tbody>
								if (prefs.tableBodyRowHover && prefs.tableBodyRowHover > "") {
									hcntr += 1;
									if (hcntr == prefs.tableBodyRowHover.length) {
										hcntr = 0;
									}
									if (prefs.tableBodyRowHover[hcntr] > "") {
										UtilPopup.attachHover({
											"elementDOM": curRowDOM.cells[cntr2],
											"event": "mousemove",
											"content": TableLayout_replaceTags(prefs.tableBodyRowHover[hcntr], prefs.JSONList[cntr1])
										});
									}
								}
							}
						}
					}
				}
					return({
					"tableDOM": tableBodyDOM
				}) 
		},	
		setMaxRowScroll: function(tableObj,maxRows){
							    var rowsInTable = tableObj.tableDOM.rows.length;
							    try {
							        var border = getComputedStyle(tableObj.tableDOM.rows[0].cells[0], '').getPropertyValue('border-top-width');
							        border = border.replace('px', '') * 1;
							    } catch (e) {
							        var border = tableObj.tableDOM.rows[0].cells[0].currentStyle.borderWidth;
							        border = (border.replace('px', '') * 1) / 2;
							    }
							    var height = 0;
							    if (rowsInTable >= maxRows) {
							        for (var i = 0; i < maxRows; i++) {
							            height += tableObj.tableDOM.rows[i].clientHeight + (border ? border : 0);
							        }
							        tableObj.wrapperDOM.style.height = height+"px";
							    }
							
							},
        insertColumnData: function(prefs){
            var tableDOM = prefs.tableDOM,tableJSONMap = (prefs.tableJSONMap) ? prefs.tableJSONMap : {},indexOffset = (prefs.indexOffset) ? prefs.indexOffset : 0,columnCellCSS = prefs.columnCellCSS,columnIndex = (prefs.columnIndex) ? prefs.columnIndex : 0, tableRowId = prefs.JSONRowId, idInd = (tableRowId) ? true : false, tempstr, tempcellDOM, curRowDOM, curCellDOM, cntr1, cnt1, cntr3, cnt3, cntr4, cnt4;
            if (tableDOM && TableLayout_RealTypeOf(tableDOM) === "object") { // valid table
                for (var cntr1 = 0, cnt1 = prefs.JSONList.length; cntr1 < cnt1; cntr1++) {
                    if (idInd) { // Id based insert
                        tempstr = "";
                        
                        if (TableLayout_RealTypeOf(tableRowId) == "array") {
                            for (var cntr3 = 0, cnt3 = tableRowId.length; cntr3 < cnt3; cntr3++) {
                                if ((prefs.JSONList[cntr1])[tableRowId[cntr3]]) {
                                    tempstr += "_";
                                    tempstr += (prefs.JSONList[cntr1])[tableRowId[cntr3]];
                                }
                            }
                        }
                        else {
                            if ((prefs.JSONList[cntr1])[tableRowId]) {
                                tempstr = (prefs.JSONList[cntr1])[tableRowId];
                            }
                        }
                        if (tempstr > "") {
                            curRowDOM = _g(tempstr);
							tableJSONMap[tempstr] = cntr1+indexOffset;
                            if (TableLayout_RealTypeOf(curRowDOM) === "object") { // valid table row
                                if (curRowDOM.cells[columnIndex]) { // valid table cell
                                    curCellDOM = curRowDOM.cells[columnIndex];
									if (!prefs.JSONRefAppendInd || prefs.JSONRefAppendInd == 0) { // Clear cell data if not appending
										curCellDOM.innerHTML = "";
									}
									if (prefs.HideExistingCellDataInd && prefs.HideExistingCellDataInd == 1) {
										curCellDOM.innerHTML = "<span style='display:none'>" + curCellDOM.innerHTML + "</span>";
									}
                                    if (TableLayout_RealTypeOf(prefs.JSONRef) === "array") {
                                        for (cntr4 = 0, cnt4 = prefs.JSONRef.length; cntr4 < cnt4; cntr4++) {
											if ((prefs.JSONList[cntr1])[prefs.JSONRef[cntr4]] > " ") {
												tempcellDOM = Util.ce("span");													
												if (prefs.JSONRefAppendInd && prefs.JSONRefAppendInd == 1) { // appending to current cell data
													tempcellDOM.innerHTML += (prefs.JSONList[cntr1])[prefs.JSONRef[cntr4]];
												}
												else{
													tempcellDOM.innerHTML = (prefs.JSONList[cntr1])[prefs.JSONRef[cntr4]];
												}												
												if (prefs.JSONRefCSS && prefs.JSONRefCSS[cntr4] && prefs.JSONRefCSS[cntr4] > " ") {
													tempcellDOM.className = prefs.JSONRefCSS[cntr4];
												}
												else 
													if (columnCellCSS) {
														tempcellDOM.className = columnCellCSS;
													}
												tempcellDOM = Util.ac(tempcellDOM, curCellDOM);
												
												if (prefs.JSONRefHvr && prefs.JSONRefHvr[cntr4]) {
													UtilPopup.attachHover({
														"elementDOM": tempcellDOM,
														"event": "mousemove",
														"sticky": prefs.JSONRefHvrSticky,
														"stickyTimeOut": prefs.JSONRefHvrStickyTimeOut,
														"displayTimeOut": "450",
														"content": (prefs.JSONList[cntr1])[prefs.JSONRefHvr[cntr4]]
													});
												}
											}
										}
										if (columnCellCSS) {
											curCellDOM.className += " "+columnCellCSS;
										}
                                    }
                                    else {
										if (prefs.JSONRefAppendInd && prefs.JSONRefAppendInd == 1) {
											curCellDOM.innerHTML += (prefs.JSONList[cntr1])[prefs.JSONRef];
										}
										else {
											curCellDOM.innerHTML = (prefs.JSONList[cntr1])[prefs.JSONRef];
										}
										if(columnCellCSS){
											curCellDOM.className = columnCellCSS;
										}
										
                                    }
                                    
                                }
                            }
                        }
                    }
                    else { // non-id insert => create new table rows
                    }
                }
            }
			return tableJSONMap;
        },
    	setFixedHeader: function(prefs){
			try {
				var fixedHeaderclassName = prefs.fixedHeaderclassName
				, scrollContainerNode = prefs.scrollContainerNode
				, fixedHeaderNode = prefs.fixedHeaderNode ? prefs.fixedHeaderNode : Util.Style.g(fixedHeaderclassName, scrollContainerNode)[0]
				, scrollFunction = function(e){
					var targ;
					if (!e) 
						var e = window.event;
					if (e.target) 
						targ = e.target;
					else 
						if (e.srcElement) 
							targ = e.srcElement;
					if (targ.nodeType == 3) // defeat Safari bug
						targ = targ.parentNode;
					fixedHeaderNode.style.top = (targ.scrollTop - 1) + "px";
					
				};
				//set minimum styles for fixedHeaderNode
				fixedHeaderNode.style.position = 'relative';
				fixedHeaderNode.style.display = 'block';
				//assign onscroll and onresize scrollFunction to the scrollContainer
				Util.addEvent(scrollContainerNode, 'scroll', scrollFunction);
				Util.addEvent(scrollContainerNode, 'resize', scrollFunction);
			} 			
			catch (err) {
				alert("Error: TableLayout.setFixedHeader()" )
			}
		}
	}
}();

var TableSortable = function(prefs){
    var tableDOM = prefs.tableDOM,rowCSSName,row2CSSName,jsonObj=prefs.tableJSONMap,tableRowId = prefs.JSONRowId,jsonList = prefs.JSONList, toggleCmp = -1, jsonHandler = new UtilJsonXml();
   function getVal(stype){
   	switch(stype){
		case "numeric": return "-99999999999";
		default: return ""
	}
   }
	function sortTable(JSONRef, col, type){
        //-----------------------------------------------------------------------------
        // sortTable(id, col, rev)
        //
        //  JSONRef  - reference to the JSON to sort (optional).
        //  col - Index of the column to sort, 0 = first column, 1 = second column,
        //        etc.
        //  rev - If true, the column is sorted in reverse (descending) order
        //        initially.
        //
        // Note: the team name column (index 1) is used as a secondary sort column and
        // always sorted in ascending order.
        //-----------------------------------------------------------------------------
        
        // Get the table or table section to sort.
		 var rev = false,tempstr = "",tempstr2 = "",tempind	= 0,tempind2= 0,loopLength, cmpJSON = (JSONRef && JSONRef > "" && jsonList) ? true : false, imghtml, tmpEl, i, j, minVal, minIdx, testVal, cmp,cntr1,cnt1;
        loopLength = cmpJSON == true ? jsonList.length : tableDOM.rows.length;
		for (i = 0; i < loopLength ; i++) {
            // Assume the current row has the minimum value.
            minIdx = i;
            if (!cmpJSON) {
                if (tableDOM.rows[i].cells[col].childNodes && tableDOM.rows[i].cells[col].childNodes[0] && tableDOM.rows[i].cells[col].childNodes[0].innerHTML) 
                    minVal = tableDOM.rows[i].cells[col].childNodes[0].innerHTML;
                else 
                    minVal = tableDOM.rows[i].cells[col].innerHTML;
            }
            else {
				if (jsonList[i]) 
					minVal = (jsonList[i])[JSONRef];
				else {
					minVal = getVal(type);
					 jsonList[i]= {};
					 jsonList[i][JSONRef] = minVal;
					 jsonList[i].TABLE_ROW_ID= tableDOM.rows[i].id
				}
            }
            // Search the rows that follow the current one for a smaller value.
            for (j = i + 1; j < loopLength; j++) {
                if (!cmpJSON) {
                    if (tableDOM.rows[j].cells[col].childNodes && tableDOM.rows[j].cells[col].childNodes[0] && tableDOM.rows[j].cells[col].childNodes[0].innerHTML) 
                        testVal = tableDOM.rows[j].cells[col].childNodes[0].innerHTML;
                    else 
                        testVal = tableDOM.rows[j].cells[col].innerHTML;
                }
                else {
					if (jsonList[j]) 
						testVal = (jsonList[j])[JSONRef];
					else {
						testVal = getVal(type);
						(jsonList[j]) = {};
						(jsonList[j])[JSONRef] = testVal;
						 jsonList[j]["TABLE_ROW_ID"]= tableDOM.rows[j].id
					}
                }
            //    if (testVal > " ") {
                    cmp = compareValues(minVal, testVal, type);
					
                    // Negate the comparison result if the reverse sort flag is set.
                    cmp *= toggleCmp;
                    // If this row has a smaller value than the current minimum, remember its
                    // position and update the current minimum value.
                    if (cmp > 0) {
                        minIdx = j;
                        minVal = testVal;
                    }
            //    }
				
            }
            // By now, we have the row with the smallest value. Remove it from the
            // table and insert it before the current row.
            if (minIdx > i) {
				if(tableRowId){					
					cntr1 = 0;
					tempind		= 0;
					tempind2	= 0;
					cnt1 = tableRowId.length;
					if (jsonList[i].TABLE_ROW_ID) {
						tempstr = jsonList[i].TABLE_ROW_ID;
						tempind = 1;
					}
					else{
						tempstr = "";
					}
					if (jsonList[minIdx].TABLE_ROW_ID) {
						tempstr2 = jsonList[minIdx].TABLE_ROW_ID;
						tempind2 = 1;
					}
					else{
						tempstr2 = "";
					}
					for(cntr1 = 0; cntr1 < cnt1; cntr1++){
						if (tempind == 0) {
							tempstr += "_";
							tempstr += (jsonList[i])[tableRowId[cntr1]];
						}
						if (tempind2 == 0) {
							tempstr2 += "_";
							tempstr2 += (jsonList[minIdx])[tableRowId[cntr1]];
						}
					}			
                	tmpEl = tableDOM.removeChild(_g(tempstr2));
                	tableDOM.insertBefore(tmpEl,_g(tempstr));
				}
				else{										
                	tmpEl = tableDOM.removeChild(tableDOM.rows[minIdx]);
                	tableDOM.insertBefore(tmpEl, tableDOM.rows[i]);
				}
            	
                if (cmpJSON) {
						tmpEl = jsonList.splice(minIdx, 1);
						jsonList.splice(i, 0, tmpEl[0]);
                }
			}
            
        }
		
        toggleCmp *= -1;
    }
    function compareValues(v1, v2, type){
        if (type == "date") {
            var date1 = v1.split("/");
            var date2 = v2.split("/");
            var tempdate1 = new Date();
            var tempdate2 = new Date();
            var dttmdiff = new Date();
            tempdate1.setFullYear(date1[2], date1[0] - 1, date1[1]);
            tempdate2.setFullYear(date2[2], date2[0] - 1, date2[1]);
            dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
            timediff = dttmdiff.getTime();
            days = Math.floor(timediff / (1000 * 60 * 60 * 24));
            if (days > 0) 
                return 1;
            else 
                if (days == 0) 
                    return 0;
        }
        else 
            if (type == "numeric") {
                if (parseInt(v1) == parseInt(v2)) 
                    return 0;
                if (parseInt(v1) > parseInt(v2)) 
                    return 1
            }
            else {
                if (v1 == v2) 
                    return 0;
                if (v1 > v2) 
                    return 1
            }
        return -1;
    }
    // return API
    return {
		sort: function(JSONRef, colIndex, sortType){
			sortTable(JSONRef, colIndex, sortType);
		},
		sortMulti: function(us, u, vs, v, ws, w, xs, x, ys, y, zs, z){
			// us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
			try {
				var loopLength = tableDOM.rows.length, i, j, jsonObj1, jsonObj2, tmpEl;
				for (i = 0; i < loopLength; i++) {
					jsonObj1 = jsonList[parseInt(jsonObj[tableDOM.rows[i].id])];
					for (j = i + 1; j < loopLength; j++) {
						jsonObj2 = jsonList[parseInt(jsonObj[tableDOM.rows[j].id])];
						switch (Sortmulti(jsonObj1, jsonObj2)*toggleCmp) {
							case -1:
								tmpEl = tableDOM.removeChild(tableDOM.rows[j]);
								tableDOM.insertBefore(tmpEl, tableDOM.rows[i]);
								break;
							case 1:
								tmpEl = tableDOM.removeChild(tableDOM.rows[i]);
								tableDOM.insertBefore(tmpEl, tableDOM.rows[j]);
								break;
						}
					}
				}
				toggleCmp *= -1
			} 
			catch (e) {
				alert("i -> "+i+"  j ->"+ j+" jsonList.length - >"+jsonList.length+" jsonObj1['MICRO_FLAG'] ->"+jsonObj1[u]+" jsonObj2['MICRO_FLAG'] ->"+jsonObj2[u])
			}
			
//			if (u == undefined) {
//				jsonList.sort(Sortsingle);
//			} // if this is a simple array, not multi-dimensional, ie, SortIt(jsonList,1): ascending.
//			else {
//				jsonList.sort(Sortmulti);
//				}
			
			function Sortsingle(a, b){
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
			
			function Sortmulti(a, b){
			//	try{
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
				/*
				if (!v || (v == undefined) || (swap != 0)) {
					alert("-")
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
					if ((w == undefined) || (swap != 0)) {
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
						if ((x == undefined) || (swap != 0)) {
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
							if ((y == undefined) || (swap != 0)) {
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
								if ((z = undefined) || (swap != 0)) {
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
				}*/
						
			}
		}
	}
}

function SortIt(jsonList, us, u, vs, v, ws, w, xs, x, ys, y, zs, z){
    // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
    
    if (u == undefined) {
        jsonList.sort(Sortsingle);
    } // if this is a simple array, not multi-dimensional, ie, SortIt(jsonList,1): ascending.
    else {
        jsonList.sort(Sortmulti);
    }
    
    function Sortsingle(a, b){
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
    
    function Sortmulti(a, b){
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
        if ((v == undefined) || (swap != 0)) {
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
            if ((w == undefined) || (swap != 0)) {
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
                if ((x == undefined) || (swap != 0)) {
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
                    if ((y == undefined) || (swap != 0)) {
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
                        if ((z = undefined) || (swap != 0)) {
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
}

/*~BB~*************************************************************************
      *                                                                       *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
      *                              Technology, Inc.                         *
      *       Revision      (c) 1984-2009 Cerner Corporation                  *
      *                                                                       *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
      *  This material contains the valuable properties and trade secrets of  *
      *  Cerner Corporation of Kansas City, Missouri, United States of        *
      *  America (Cerner), embodying substantial creative efforts and         *
      *  confidential information, ideas and expressions, no part of which    *
      *  may be reproduced or transmitted in any form or by any means, or     *
      *  retained in any storage or retrieval system without the express      *
      *  written permission of Cerner.                                        *
      *                                                                       *
      *  Cerner is a registered mark of Cerner Corporation.                   *
      *                                                                       *
	  * 1. Scope of Restrictions                                              *
	  *  A.  Us of this Script Source Code shall include the right to:        *
	  *  (1) copy the Script Source Code for internal purposes;               *
	  *  (2) modify the Script Source Code;                                   *
	  *  (3) install the Script Source Code in Client's environment.          *
	  *  B. Use of the Script Source Code is for Client's internal purposes   *
	  *     only. Client shall not, and shall not cause or permit others, to  *
	  *     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
	  *     sublicense or otherwise transfer the Script Source Code, in       *
	  *     whole or part.                                                    *
	  * 2. Protection of Script Source Code                                   *
	  *  A. Script Source Code is a product proprietary to Cerner based upon  *
	  *     and containing trade secrets and other confidential information   *
      *     not known to the public. Client shall protect the Script Source   *
	  *     Code with security measures adequate to prevent disclosures and   *
	  *     uses of the Script Source Code.                                   *
	  *  B. Client agrees that Client shall not share the Script Source Code  *
	  *     with any person or business outside of Client.                    *
	  * 3. Client Obligations                                                 *
	  *  A. Client shall make a copy of the Script Source Code before         *
	  *     modifying any of the scripts.                                     *
	  *  B. Client assumes all responsibility for support and maintenance of  *
	  *     modified Script Source Code.                                      *
	  *  C. Client assumes all responsibility for any future modifications to * 
      *     the modified Script Source Code.                                  *
	  *  D. Client assumes all responsibility for testing the modified Script * 
	  *     Source Code prior to moving such code into Client's production    *
	  *     environment.                                                      *
	  *  E. Prior to making first productive use of the Script Source Code,   *
	  *     Client shall perform whatever tests it deems necessary to verify  *
	  *     and certify that the Script Source Code, as used by Client,       *
	  *     complies with all FDA and other governmental, accrediting, and    *
	  *     professional regulatory requirements which are applicable to use  *
	  *     of the scripts in Client's environment.                           *
	  *  F. In the event Client requests that Cerner make further             *
	  *     modifications to the Script Source Code after such code has been  *
	  *     modified by Client, Client shall notify Cerner of any             *
	  *     modifications to the code and will provide Cerner with the        *
	  *     modified Script Source Code. If Client fails to provide Cerner    *
	  *     with notice and a copy of the modified Script Source Code, Cerner *
	  *     shall have no liability or responsibility for costs, expenses,    *
	  *     claims or damages for failure of the scripts to function properly *
	  *     and/or without interruption.                                      *
	  * 4. Limitations                                                        *
	  *  A. Client acknowledges and agrees that once the Script Source Code is*
	  *     modified, any warranties set forth in the Agreement between Cerner*
	  *     and Client shall not apply.                                       *
	  *  B. Cerner assumes no responsibility for any adverse impacts which the*
	  *     modified Script Source Code may cause to the functionality or     *
	  *     performance of Client's System.                                   *
	  *  C. Client waives, releases, relinquishes, and discharges Cerner from *
      *     any and all claims, liabilities, suits, damages, actions, or      *
	  *     manner of actions, whether in contract, tort, or otherwise which  *
	  *     Client may have against Cerner, whether the same be in            *
	  *     administrative proceedings, in arbitration, at law, in equity, or *
      *     mixed, arising from or relating to Client's use of Script Source  *
	  *     Code.                                                             *
	  * 5. Retention of Ownership                                             *
	  *    Cerner retains ownership of all software and source code in this   *
	  *    service package. Client agrees that Cerner owns the derivative     *
	  *    works to the modified source code. Furthermore, Client agrees to   *
	  *    deliver the derivative works to Cerner.                            *
  ~BE~************************************************************************/
/******************************************************************************
 
        Source file name:       dc_mp_js_util_json_xml.js
 
        Product:                Discern Content
        Product Team:           Discern Content
 
        File purpose:           Provides the UtilJsonXml class with methods
        						to parse and debug JSON/XML.
 
        Special Notes:          <add any special notes here>
 
;~DB~**********************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
;**************************************************************************************
;*                                                                            		  *
;*Mod Date     		Engineer             		Feature      Comment                      *
;*--- -------- 		-------------------- 		------------ -----------------------------*
;*000 		   		RB018070				    ######       Initial Release              *
;*001 12/20/2010	RB018070				    ######       Integration with externLogger  *
;~DE~**********************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/

/**
* Create a new instance of UtilJsonXml.
* @classDescription		This class creates a new UtilJsonXml with to parse/debug JSON and XML.
* @return {Object}	Returns a new UtilJsonXml object.
* @constructor	
*/

var ExternalDebugger = (function (){
	var debuggerObj = false
		, prevDebuggerObj
		,debuggerDefined = false
		,bufferOutput = " ";
	return ({
		initialize : function(dObj){
			prevDebuggerObj = debuggerObj;
			debuggerObj = dObj;
			ExternalDebugger.reset();
			if(prevDebuggerObj){
				debuggerObj.innerHTML = prevDebuggerObj.innerHTML
			}
		},
		define: function(){
			debuggerDefined = true;
			bufferOutput = " ";
		},
		reset: function(){
			try {
				if (debuggerObj) {
					debuggerObj.innerHTML = " ";
				}
			} 
			catch (err) {
				if (prevDebuggerObj) {
					prevDebuggerObj.innerHTML = " ";
				}
			}
		},
		isDefined : function(){
			return debuggerDefined;
		},
		isInitialized : function(){
			if(debuggerObj){
				return true;
			}
			return false;
		},
		loadBufferOutput: function(){
			debuggerObj.innerHTML += bufferOutput;
		},
		clearBufferOutput: function(){
			bufferOutput = " ";
		},
		sendBufferOutput: function(outData){
			bufferOutput += outData;
		},	
		sendOutput: function(outData){
			try {
				if (debuggerObj) {
					debuggerObj.innerHTML += outData;
				}
			} 
			catch (err) {
				if (prevDebuggerObj) {
					prevDebuggerObj.innerHTML += outData;
				}
			}
		}	
	});
}());

var  UtilJsonXmlDebugWindow;

var UtilJsonXml = function (prefs) {
	
	/* ***** Private Methods & Variables ***** */
	var cur_dt_tm = new Date(),
	_w = window,
	_d = document,
	that = this,
	xCclPanel,
	messages = {"json_parsing_failed":"JSON Parsing Failed"},
	truncate_zeros = true,
	whtSpEnds = new RegExp("^\\s*|\\s*$", "g"),
	whtSpMult = new RegExp("\\s\\s+", "g"),
	/** 
     * Display an alert message with the error details and method name
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	msg	Error message.
     * @param  {String}	fnc	Method name of error.
     * @private
     */
	error_handler = function(msg, fnc){
		log.error(msg + ' - ' + fnc);
		/*var textArea = $('<br /><textarea readonly>' + msg + ' - ' + fnc + '</textarea>');
		return $("<div class='dialog' id = 'addTextArea' title='" 
				+ 'Setup Page Error' + "'><p>"
				+ 'The system was not able to update the changes. Log a Service Request with the error details.\n Click on \'Details\' for more details or \'OK\' to exit.'
				+ "</p></div>")
		.dialog({
			modal: true,
			resizable: true,
			width : 500,
			buttons: [{		
				text: 'Details >>',
				id: 'errorDlg',
				click: function() {
							if($('textarea').length){
								$('textarea').remove();
								$('#errorDlg').text('Details >>');
							}
						else{
						   $("#addTextArea").append( textArea );
						   $('#errorDlg').text('Details <<');
						}
				}
			},
			  {
			  text : 'OK',
			  click : function() {
					$( this ).dialog( "close" );
					$('body').removeClass('.ui-widget-overlay');
				}
			}]
		});*/
	},	
	
	/** 
     * Returns the real type of a variable.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	v	Variable to check type of.
     * @return {String}		Type of the variable.
     * @private
     */
	RealTypeOf = function(v){
		try {
			if (typeof(v) === "object") {
				if (v === null) {
					return "null";
				}
				if (v.constructor === ([]).constructor) {
					return "array";
				}
				if (v.constructor === (new Date()).constructor) {
					return "date";
				}
				if (v.constructor === (new RegExp()).constructor) {
					return "regex";
				}
				return "object";
			}
			if(v!= "" && !isNaN(Number(v))){
				return "number"
			}
			else
				return typeof(v);
		} 
		catch (e) {
		
			error_handler(e.message, "RealTypeOf()");
		}
	},
	
	 /** 
     * Formats the given JSON Object for display
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object} jObj	JSON Object to be formatted.
     * @param  {String} sIndent Indent string to be appended before each line of formatted text.
     * @return {String}		Formatted JSON String.
     * @private
     */
	format_json = function (jObj, sIndent) {
		try {
			if (!sIndent) {
				sIndent = "";
			}
			var sIndentStyle = "&nbsp;&nbsp;"
			,iCount = 0
			,sDataType = RealTypeOf(jObj)
			,sHTML
			,j;
			// open object
			if (sDataType === "array") {
				if (jObj.length === 0) {
					return "[]";
				}
				sHTML = "[";
			}
			else {
				if (sDataType === "object" && sDataType !== null) {
					sHTML = "{";
				}
				else { // object is empty
					return "{}";
				}
			}
			
			// loop through items
			iCount = 0;
			for (j in jObj) {
				if (RealTypeOf(jObj[j]) !== "function") {
					if (iCount > 0) {
						sHTML += ",";
					}
					if (sDataType === "array") {
						sHTML += ("<br>" + sIndent + sIndentStyle);
					}
					else {
						sHTML += ("<br>" + sIndent + sIndentStyle + "\"" + j + "\"" + ": ");
					}
					
					// display relevant data type
					switch (RealTypeOf(jObj[j])) {
						case "array":
						case "object":
							sHTML += format_json(jObj[j], (sIndent + sIndentStyle));
							break;
						case "boolean":
						case "number":
							sHTML += jObj[j].toString();
							break;
						case "null":
							sHTML += "null";
							break;
						case "string":
							sHTML += ("\"" + jObj[j] + "\"");
							break;
						case "function":
							break;
						default:
							sHTML += ("TYPEOF: " + typeof(jObj[j]));
					}
					// loop
					iCount = iCount +1;
				}
			}
			
			// close object
			if (sDataType === "array") {
				sHTML += ("<br>" + sIndent + "]");
			}
			else {
				sHTML += ("<br>" + sIndent + "}");
			}
			// return
			return sHTML;
		} 
		catch (e) {
			error_handler(e.message, "format_json()");
		}
		
	},
	
	/** 
     * Formats the given XML Object for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	xObj	XML Object to be formatted.
     * @param  {String}	sIndent	Indent string to be appended before each line of formatted text.
     * @return {String}		Formatted XML String.
     * @private
     */
	format_xml = function(Obj,sIndent){
		try {
			var str = "",
				sIndentStyle = "&nbsp;&nbsp;",
				i = 0,
				j = 0;
			if (!sIndent) {
				sIndent = "";
			}
			for (i = 0; i < Obj.childNodes.length; i++) { // loop through child nodes on same level
				if (Obj.childNodes[i].tagName) { // valid tag
					str += sIndent + "&#60" + Obj.childNodes[i].tagName;
					if (Obj.childNodes[i].attributes) // valid attributes
						for (j = 0; j < Obj.childNodes[i].attributes.length; j++) // loop through tag attributes				
 							str += "&nbsp;&nbsp;" + Obj.childNodes[i].attributes[j].name + "&nbsp;=&nbsp;'" + Obj.childNodes[i].attributes[j].value + "'";
					str += "&#62;<br>";
				}				
				if (!Obj.childNodes[i].nodeValue && RealTypeOf(Obj.childNodes[i].childNodes) === "object") // Recurse Child Nodes
					str += sIndent + format_xml(Obj.childNodes[i], sIndent + sIndentStyle);
				else 
					if (Obj.childNodes[i].nodeValue) // valid Node value
						str += sIndent + Obj.childNodes[i].nodeValue + "<br>";
				
				if (Obj.childNodes[i].tagName) // valid tag			
					str += sIndent + "&#60/" + Obj.childNodes[i].tagName + "&#62;<br>";
			}
			return str;
		}
		catch(e){
			
            error_handler(e.message, "format_xml()");
		}
    },
		
	 /** 
     * Normalize the given string by removing trailing and leading whitespaces.
     * @memberOf UtilJsonXml
     * @method
     * @param {String}	s	String to be normalized.
     * @return {String}		Normalized string.
     * @private
     */ 
	normalizeString = function(s){
		// Collapse any multiple whites space.
		s = s.replace(whtSpMult, " ");
		// Remove leading or trailing white space.  
		s = s.replace(whtSpEnds, "");
		return (s);
	},
	
	/** 
     * Returns the appropriate ActiveXObject based on the Internet Explorer Version.
     * @memberOf UtilJsonXml
     * @method
     * @return {Object}		ActiveXObject used to load XML.
     * @private
     */
	createDocument = function(){
		try {
			if (typeof arguments.callee.activeXString !== "string") {
				var versions = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"],
				i,
				len = versions.length;
				//Loop through possible ActiveX versions.
				for (i = 0; i < len; i+=1) {
					try {
						this.xml_object = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return this.xml_object;
					} 
					catch (ex) {
						//If the version isn't available, the call to
						//create a new ActiveXObject throws an error,
						//in which case the catch statement catches the error
						//and the loop continues.
					}
				}
			}
			return new ActiveXObject(arguments.callee.activeXString);
		} 
		catch (e) {
			error_handler(e.message, "createDocument()");
		}
	},ReadFromFile = function(sFile){
            try {
				var ForReading = 1, TriStateFalse = 0, 
				fso = new ActiveXObject("Scripting.FileSystemObject"), 
				fileText = "",
				path_split = [],
				sfile_split = sFile.split("$");
				if(sfile_split.length == 1){
					 if(location.href){
						path_split = location.href.split("?")[0];
						path_split = path_split.split('%20').join(' ').split("file:///").join("").split("file:").join("").split('/');
						path_split = path_split.slice(0,path_split.length-2);	
						path_split = path_split.join("\\");
						sFile = sFile.split("/").join("\\");
					}
					sFile = (path_split+sFile);
				}
				else{
					sFile = sfile_split[1];
				}
				inFile = fso.OpenTextFile(sFile, ForReading, true);
				fileText = inFile.ReadAll();
				inFile.close();
				return fileText;
			} 
			catch (err) {
				error_handler(err.message, "ReadFromFile()");
				return "";
			}	
     },init = function(){
			if (prefs && RealTypeOf(prefs) == 'object') {
				if (prefs.debug_mode_ind) {
					that.debug_mode_ind = prefs.debug_mode_ind
				}
				
				if (that.debug_mode_ind == 1 && !ExternalDebugger.isInitialized() && (!prefs.disable_firebug)) {
				
					// Append firebug-lite if debug mode is turned on		
					ExternalDebugger.define();
					appendDebugJavaScriptTag("..\\js\\firebug-lite.js");
					console.log("Debugging mode turned on");
					// Firebug successfully loaded
					if (Firebug) {
						//extend firebug with xmlcclrequest panel
						Firebug.extend(function(FBL){
							with (FBL) {
							
								var panelName = "XmlCclRequest";
								
								// XmlCclRequest Module
								
								Firebug.XmlCclRequest = extend(Firebug.Module, {
									getPanel: function(){
										return Firebug.chrome ? Firebug.chrome.getPanel(panelName) : null;
									},
									
									clear: function(){
										ExternalDebugger.clearBufferOutput();
										ExternalDebugger.reset();
									}
								});
								
								Firebug.registerModule(Firebug.XmlCclRequest);
								
								function XmlCclRequestPanel(){
								}
								
								XmlCclRequestPanel.prototype = extend(Firebug.Panel, {
									name: panelName,
									title: "XmlCclRequest",
									options: {
										hasToolButtons: true
									},
									
									create: function(){
										Firebug.Panel.create.apply(this, arguments);
										this.clearButton = new Button({
											caption: "Clear",
											title: "Clear XmlCclRequest logs",
											owner: Firebug.XmlCclRequest,
											onClick: Firebug.XmlCclRequest.clear
										});
										ExternalDebugger.initialize(this.panelNode);
										ExternalDebugger.loadBufferOutput();
									},
									
									initialize: function(){
										Firebug.Panel.initialize.apply(this, arguments);
										this.clearButton.initialize();
									},
									
									shutdown: function(){
										this.clearButton.shutdown();
										
										Firebug.Panel.shutdown.apply(this, arguments);
									}
								});
								Firebug.registerPanel(XmlCclRequestPanel);
							}
						});
					}
				}
			}		
	}
	
	appendDebugJavaScriptTag= function(filePath){
		// Set path to JS file	
		headID = document.getElementsByTagName("head")[0];  	
		newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.id = "firebug_lite_debugger"
		newScript.src = filePath; 
		headID.appendChild(newScript);	
	}
		
	/* ***** Public Methods & Variables ***** */
	this.text_debug = " ";
	this.debug_mode_ind = 0;
	this.text_format = "html";
	this.target_url = "";
	this.json_object = {};
	this.xml_object = {};
	this.browserName = "msie";
	this.target_debug = "_utiljsonxml_";
	this.wParams = "fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no";
	this.trim_float_zeros = function(ind){
		truncate_zeros = ind;
	}	
	this.setDebugMode = function(dMode){
		that.debug_mode_ind = dMode;
		init();
	}	
	this.launch_debug = function(){
		try {
			if (!UtilJsonXmlDebugWindow) {
				UtilJsonXmlDebugWindow = _w.open(this.target_url, this.target_debug, this.wParams, 0);
				UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>" + this.text_debug + "</div>");
			}
			else {
				UtilJsonXmlDebugWindow.document.write("<div>" + this.text_debug + "</div>");
			}
			this.text_debug = " ";
		} 
		catch (e) { // fails if window is closed, try to reopen a new window
			try {
				UtilJsonXmlDebugWindow = _w.open(this.target_url, this.target_debug, this.wParams, 0);
				UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>" + this.text_debug + "</div>");
			} 
			catch (e2) {
				error_handler(e.message, "launch_debug()");
			}
		}
	};
	
	/** 
     * Parses the given JSON string and builds the JSON Object
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	text	JSON String to be parsed.
     * @return {Object}			JSON Object.
     */
	this.parse_json = (function(){
        var at, // The index of the current character
 		ch, // The current character
 		parseError = '',
 		escapee = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
        }, text, error = function(m){
            ///Save parse Error
			parseError = m;
        }
	, next = function(c){
        
            // If a c parameter is provided, verify that it matches the current character.            
            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }
            // Get the next character. When there are no more characters,
            // return the empty string.            
            ch = text.charAt(at);
            at += 1;
            return ch;
        }
	, number = function(){
            // Parse a number value.            
            var number, string = '';
            
            if (ch === '-') {
                string = '-';
                next('-');
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
            if (ch === '.') {
                string += '.';
                while (next() && ch >= '0' && ch <= '9') {
                    string += ch;
                }
            }
            if (ch === 'e' || ch === 'E') {
                string += ch;
                next();
                if (ch === '-' || ch === '+') {
                    string += ch;
                    next();
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
            }
			if (truncate_zeros == true) {
				number = +string;
			}
			else{
				number = string;
			}
            if (isNaN(number)) {
                error("Bad number");
            }
            else {
                return number;
            }
        }
		, string = function(){
            // Parse a string value.            
            var hex, i, string = '', uffff;
            // When parsing for string values, we must look for " and \ characters.            
            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    }
                    else 
                        if (ch === '\\') {
                            next();
                            if (ch === 'u') {
                                uffff = 0;
                                for (i = 0; i < 4; i += 1) {
                                    hex = parseInt(next(), 16);
                                    if (!isFinite(hex)) {
                                        break;
                                    }
                                    uffff = uffff * 16 + hex;
                                }
                                string += String.fromCharCode(uffff);
                            }
                            else 
                                if (typeof escapee[ch] === 'string') {
                                    string += escapee[ch];
                                }
                                else {
                                    break;
                                }
                        }
                        else {
                            string += ch;
                        }
                }
            }
            error("Bad string");
        }
		, white = function(){
            // Skip whitespace.            
            while (ch && ch <= ' ') {
                next();
            }
        }
		, word = function(){
            // true, false, or null.            
            switch (ch) {
                case 't':
                    next('t');
                    next('r');
                    next('u');
                    next('e');
                    return true;
                case 'f':
                    next('f');
                    next('a');
                    next('l');
                    next('s');
                    next('e');
                    return false;
                case 'n':
                    next('n');
                    next('u');
                    next('l');
                    next('l');
                    return null;
            }
            error("Unexpected '" + ch + "'");
        }
 		, array = function(){
            // Parse an array value.            
            var array = [];
            if (ch === '[') {
                next('[');
                white();
                if (ch === ']') {
                    next(']');
                    return array; // empty array
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === ']') {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad array");
        }
		, object = function(){
            // Parse an object value.            
            var key, object = {};
            if (ch === '{') {
                next('{');
                white();
                if (ch === '}') {
                    next('}');
                    return object; // empty object
                }
                while (ch) {
                    key = string();
                    white();
                    next(':');
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === '}') {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad object");
        }
		,value = function(){
            // Parse a JSON value. It could be an object, an array, a string, a number,
            // or a word.            
            white();
            switch (ch) {
                case '{':
                    return object();
                case '[':
                    return array();
                case '"':
                    return string();
                case '-':
                    return number();
                default:
                    return ch >= '0' && ch <= '9' ? number() : word();
            }
        };
        // Return the json_parse function. It will have access to all of the above
        // functions and variables.        
        return function(source, reviver){
            var result;
            
            text = source;
            at = 0;
            ch = ' ';
			parseError = 
            result = value();
            white();
            if (ch) {
                error("Syntax error");
            }
            // If there is a reviver function, we recursively walk the new structure,
            // passing each name/value pair to the reviver function for possible
            // transformation, starting with a temporary root object that holds the result
            // in an empty key. If there is not a reviver function, we simply return the
            // result.            
            return typeof reviver === 'function' ? (function walk(holder, key){
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            }
                            else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }({
                '': result
            }, '')) : (parseError === '' ? 
										{'PARSE_JSON_ERROR':parseError}
										: result
					);
        };
    }());
	
	/** 
     * Parses the given XML string and builds the XML Object
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	data	XML String to be parsed.
     * @return {Object}		XML Object.
     */
	this.parse_xml = function(data){
		try { 
			var parser;
			//alert(document.implementation.createDocument)
			if (window.DOMParser){// If IE7, Mozilla, Safari, and so on: Use native object
					parser= new DOMParser();
					this.xml_object = parser.parseFromString(data,"text/xml");;
			}
			else{
					this.xml_object = createDocument();
					this.xml_object.async = false;
					this.xml_object.loadXML(normalizeString(data));
			}
			
			return (this.xml_object);
		} 
		catch (e) {
			error_handler(e.message, "parse_xml()");
		}
	};
	
	/** 
     * Formats the text from the  given JSON object and appends the text to the debug text for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	jObj	JSON Object to be formatted for display.
     */
	this.append_json = function(jObj){
		try {
			cur_dt_tm = new Date();
			var debug_msg_hdr = "<br><b>*************** JSON Formatted ( " + cur_dt_tm.toUTCString() + " ) ***************</b><br>"
				,debug_json_string = format_json(jObj, "")
				,debug_string = debug_msg_hdr + debug_json_string;		
			if (this.debug_mode_ind === 1) {
				if (ExternalDebugger.isDefined()) {
					if (ExternalDebugger.isInitialized()) {
						ExternalDebugger.sendOutput(debug_string);
					}
					else {
						ExternalDebugger.sendBufferOutput(debug_string);
					}					
				}
				else{
					this.text_debug += debug_string;
					this.launch_debug();
				}
			}
			return jObj;				
		} 
		catch (e) {
			error_handler(e.message, "append_json()");
		}
	};
	
	this.formatted_json = function(jObj){
		 return format_json(jObj, "")
	};
	
	/** 
     * Formats the text from the  given XML object and appends the text to the debug text for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	xObj	XML Object to be formatted for display.
     */
	this.append_xml = function(xObj){
		try {
			cur_dt_tm = new Date();
			var debug_msg_hdr = "<br><b>*************** XML Formatted ( " + cur_dt_tm.toUTCString() + " ) ***************</b><br>"
				,debug_xml_string =  format_xml(xObj)
				,debug_string = debug_msg_hdr + debug_xml_string;
			if (this.debug_mode_ind === 1) {
				if (ExternalDebugger.isDefined()) {
					if (ExternalDebugger.isInitialized()) {
						ExternalDebugger.sendOutput(debug_string);
					}
					else {
						ExternalDebugger.sendBufferOutput(debug_string);
					}					
				}
				else{
					this.text_debug += debug_string;
					this.launch_debug();
				}
			}
			return xObj;	
		} 
		catch (e) {
			error_handler(e.message, "append_xml()");
		}
	};
	
	/** 
     * Appends the given text to the debug text for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	data	Text to be appended to the debug text for display.
     */
	this.append_text = function(data){
		try {			
			if (this.debug_mode_ind === 1) {
				if (ExternalDebugger.isDefined()) {
					if (ExternalDebugger.isInitialized()) {
						ExternalDebugger.sendOutput(data);
					}
					else {
						ExternalDebugger.sendBufferOutput(data);
					}					
				}
				else{
					this.text_debug += data;
					this.launch_debug();
				}
			}
		} 
		catch (e) {
			error_handler(e.message, "append_text()");
		}
	};
	
	/**
	 * 
	 * @param {Object} json_text
	 */
	this.load_json_obj = function(json_text,that){
        try {
			that === undefined ? this : that;        
            return (that.append_json(JSON.parse(json_text)));
        } 
        catch (e) {
            errmsg(e.message, "load_json_obj()")
        }
	};
	
	/**
	 * 
	 * @param {Object} xml_text
	 */
	this.load_xml_obj = function(xml_text,that){
        try {
			that === undefined ? this : that;
            return (that.append_xml(that.parse_xml(xml_text)));
        } 
        catch (e) {
            errmsg(e.message, "load_xml_obj()")
        }
	};
	
	/**
	 * 
	 * @param {String} text
	 */
	this.load_txt = function(text,that){
        try {
			that === undefined ? this : that;
            return (that.append_text(text));
        } 
        catch (e) {
            errmsg(e.message, "load_txt()")
        }
	};

	this.json_schema_validate = function(/*Any*/instance,/*Object*/schema) {
		// Summary:
		// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating), 
		// 		that schema will be used to validate and the schema parameter is not necessary (if both exist, 
		// 		both validations will occur). 
		// 		The validate method will return an object with two properties:
		// 			valid: A boolean indicating if the instance is valid by the schema
		// 			errors: An array of validation errors. If there are no errors, then an 
		// 					empty list will be returned. A validation error will have two properties: 
		// 						property: which indicates which property had the error
		// 						message: which indicates what the error was
		//
		return this._validate_json_schema(instance,schema,false);
	};
	
	this.json_schema_property = function(/*Any*/value,/*Object*/schema, /*String*/ property) {
		// Summary:
		// 		The json_schema_property method will check to see if an value can legally be in property with the given schema
		// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
		// 		not check for self-validation, it is assumed that the passed in value is already internally valid.  
		// 		The json_schema_property method will return the same object type as validate.
		//
		return this._validate_json_schema(value,schema, property || "property");
	};	
	
	this._validate_json_schema = function(/*Any*/instance,/*Object*/schema,/*Boolean*/ _changing) {
	
	var errors = [];
		// validate a value against a property definition
	function checkProp(value, schema, path,i){
		var l;
		path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}
		
		if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function')){
			if(typeof schema == 'function'){
				if(!(value instanceof schema)){
					addError("is not an instance of the class/constructor " + schema.name);
				}
			}else if(schema){
				addError("Invalid schema/property definition " + schema);
			}
			return null;
		}
		if(_changing && schema.readonly){
			addError("is a readonly field, it can not be changed");
		}
		if(schema['extends']){ // if it extends another schema, it must pass that schema as well
			checkProp(value,schema['extends'],path,i);
		}
		// validate a value against a type definition
		function checkType(type,value){
			if(type){
				if(typeof type == 'string' && type != 'any' && 
						(type == 'null' ? value !== null : typeof value != type) && 
						!(value instanceof Array && type == 'array') &&
						!(type == 'integer' && value%1===0)){
					return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
				}
				if(type instanceof Array){
					var unionErrors=[];
					for(var j = 0; j < type.length; j++){ // a union type 
						if(!(unionErrors=checkType(type[j],value)).length){
							break;
						}
					}
					if(unionErrors.length){
						return unionErrors;
					}
				}else if(typeof type == 'object'){
					var priorErrors = errors;
					errors = []; 
					checkProp(value,type,path);
					var theseErrors = errors;
					errors = priorErrors;
					return theseErrors; 
				} 
			}
			return [];
		}
		if(value === undefined){
			if(!schema.optional){  
				addError("is missing and it is not optional");
			}
		}else{
			errors = errors.concat(checkType(schema.type,value));
			if(schema.disallow && !checkType(schema.disallow,value).length){
				addError(" disallowed value was matched");
			}
			if(value !== null){
				if(value instanceof Array){
					if(schema.items){
						if(schema.items instanceof Array){
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items[i],path,i));
							}
						}else{
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items,path,i));
							}
						}							
					}
					if(schema.minItems && value.length < schema.minItems){
						addError("There must be a minimum of " + schema.minItems + " in the array");
					}
					if(schema.maxItems && value.length > schema.maxItems){
						addError("There must be a maximum of " + schema.maxItems + " in the array");
					}
				}else if(schema.properties){
					errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties));
				}
				if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum && 
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum && 
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema['enum']){
					var enumer = schema['enum'];
					l = enumer.length;
					var found;
					for(var j = 0; j < l; j++){
						if(enumer[j]===value){
							found=1;
							break;
						}
					}
					if(!found){
						addError("does not have a value in the enumeration " + enumer.join(", "));
					}
				}
				if(typeof schema.maxDecimal == 'number' && 
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}
	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp){
	
		if(typeof objTypeDef =='object'){
			if(typeof instance != 'object' || instance instanceof Array){
				errors.push({property:path,message:"an object is required"});
			}
			
			for(var i in objTypeDef){ 
				if(objTypeDef.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_')){
					var value = instance[i];
					var propDef = objTypeDef[i];
					checkProp(value,propDef,path,i);
				}
			}
		}
		for(i in instance){
			if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp===false){
				errors.push({property:path,message:(typeof value) + "The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
			}
			var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
			if(requires && !(requires in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
			}
			value = instance[i];
			if(objTypeDef && typeof objTypeDef == 'object' && !(i in objTypeDef)){
				checkProp(value,additionalProp,path,i); 
			}
			if(!_changing && value && value.$schema){
				errors = errors.concat(checkProp(value,value.$schema,path,i));
			}
		}
		return errors;
	}
	if(schema){
		checkProp(instance,schema,'',_changing || '');
	}
	if(!_changing && instance && instance.$schema){
		checkProp(instance,instance.$schema,'','');
	}
	return {valid:!errors.length,errors:errors};
	}

	/** 
     * Stringify the given JSON Object for display
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	jObj	JSON Object to be formatted.
     * @return {String}			Formatted JSON String.
     */
	this.stringify_json = function(jObj){
		try {
			var sIndent = ""
			,iCount = 0
			,sIndentStyle = ""
			,sDataType = RealTypeOf(jObj)
			,sHTML
			,j;
			// open object
			if (sDataType === "array") {
				if (jObj.length === 0) {
					return "[]";
				}
				sHTML = "[";
			}
			else {
				if (sDataType === "object" && sDataType !== null) {
					sHTML = "{";
				}
				else { // object is empty
					return "{}";
				}
			}
			
			// loop through items
			iCount = 0;
			for (j in jObj) {
				if (RealTypeOf(jObj[j]) !== "function") {
					if (iCount > 0) {
						sHTML += ",";
					}
					if (sDataType === "array") {
						sHTML += ("" + sIndent + sIndentStyle);
					}
					else {
						sHTML += ("" + sIndent + sIndentStyle + "\"" + j + "\"" + ":");
					}
					
					// display relevant data type
					switch (RealTypeOf(jObj[j])) {
						case "array":
						case "object":
							sHTML += this.stringify_json(jObj[j]);
							break;
						case "boolean":
						case "number":
							sHTML += jObj[j].toString();
							break;
						case "null":
							sHTML += "null";
							break;
						case "string":
							sHTML += ("\"" + jObj[j] + "\"");
							break;
						case "function":
							break;
						default:
							sHTML += ("TYPEOF: " + typeof(jObj[j]));
					}
					// loop
					iCount = iCount +1;
				}
			}
			
			// close object
			if (sDataType === "array") {
				sHTML += ("" + sIndent + "]");
			}
			else {
				sHTML += ("" + sIndent + "}");
			}
			// return
			return sHTML;
		} 
		catch (e) {
			error_handler(e.message, "stringify_json()");
		}
		
	};
	
	/** 
     * Performs a XmlCclRequest or XMLHttpRequest. Loads request details from spec and calls target method specified in the response details of spec.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	spec	JSON Object containing request and response data.
     * @see dc_mp_js_util_mpage needs to included to utlize XmlCclRequest().
     * @see spec is expected to be in following format:
     * 		{
     * 			request:{
     * 						type: "XMLCCLREQUEST" or "XMLHTTPREQUEST",
     * 						target: " CCL Program Name" or " Webservice Url ",
     * 						parameters: "CCL Program Parameters" or "Webservice Url Parameters"
     * 			},
     * 			response:{
     * 						type: "JSON" or  "XML",
     * 						target: " Name of target JavaScript function to call on response",
     * 						parameters: " Additional Parameters to target JavaScript function "
     * 			}
     * 		}	
     * @see response_spec passed to the spec.response.target will be in the following format:	
     * 		{
     * 			response : "JSON or XML object response from CCL Program or Webservice",
     * 			parameters: " Additional Parameters to target JavaScript function"
     * 		}		
     */
	this.ajax_request = function(spec){
        try {
            var requestAsync,
				load_json_obj_fnc = this.load_json_obj,
				load_xml_obj_fnc = this.load_xml_obj,
				append_text_fnc = this.load_txt, 
				json_response_obj,
				that = this,
				start_timer = new Date(),
				elapsed_time,
				ready_state_msg,
				status_msg,
				response_spec,
				parse_target,
				parse_target_type,
				debug_string,
				send_response_ind,
				parse_target_text,
				display_response_text;	
			// Initialize Loading Dialog
				if(spec.loadingDialog){
					if(spec.loadingDialog.targetDOM && spec.loadingDialog.content){
						spec.loadingDialog.targetDOM.innerHTML = spec.loadingDialog.content
					}
				}	
           if (spec.request.target.toUpperCase().indexOf('.JSON') == -1
		   		&& spec.request.target.toUpperCase().indexOf('.XML') == -1
				&& spec.request.target.toUpperCase().indexOf('.TXT')  == -1) { // not a file request
				if (spec.request.type === "XMLHTTPREQUEST") {
					if (window.XMLHttpRequest) {
						// If IE7, Mozilla, Safari, and so on: Use native object
						requestAsync = new XMLHttpRequest();
					}
					else 
						if (window.ActiveXObject) {
							// ...otherwise, use the ActiveX control for IE5.x and IE6
							requestAsync = new ActiveXObject('MSXML2.XMLHTTP.3.0');
						}
				}
				else {
					requestAsync = getXMLCclRequest();
				}
	            //requestAsync.requestBinding = "cpmbatch_discern";    //optional
	            requestAsync.onreadystatechange = function(){
					
					log.info("State: " + requestAsync.readyState);
					log.info("status: " + requestAsync.status);
					log.info("responseText: " + requestAsync.responseText);
					
	            	if (requestAsync.readyState === 4 && requestAsync.status === 200) {
						
						// Clear Loading Dialog
						if(spec.loadingDialog){
							if(spec.loadingDialog.targetDOM){
								spec.loadingDialog.targetDOM.innerHTML = "";
							}
						}
	                    if (requestAsync.responseText > " ") {
	                        try {								
								elapsed_time =  new Date() - start_timer;		
								debug_string = " <br><b>Type: </b>"+spec.request.type+"<br>";
								debug_string += " <b>Target: </b>"+spec.request.target+"<br>";
								debug_string += " <b>Parameters: </b>"+spec.request.parameters+"<br>";
								debug_string += " <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
								append_text_fnc(debug_string,that);  
								if (spec.response.type.toUpperCase() === "JSON") {
									json_response_obj = load_json_obj_fnc(requestAsync.responseText, that);
								
									// For JSON parse, if parsing failed => display a message
									if (!json_response_obj || (json_response_obj.PARSE_JSON_ERROR && json_response_obj.PARSE_JSON_ERROR > " ")) {			
										send_response_ind = false;
										if (spec.loadingDialog && spec.loadingDialog.targetDOM) {
											spec.loadingDialog.targetDOM.innerHTML = "ERROR: "+messages.json_parsing_failed;
											spec.loadingDialog.targetDOM.style.cursor = 'hand';
											spec.loadingDialog.targetDOM.title = "Click for more details.";
											//attach popup/alert to display invalid json
											if (UtilPopup && (RealTypeOf(UtilPopup) == 'object'|| RealTypeOf(UtilPopup) == 'function')) {	
												display_response_text = requestAsync.responseText.split(">").join('&gt;').split("<").join("&lt;");										
												UtilPopup.attachModalPopup({
													"elementDOM": spec.loadingDialog.targetDOM,
													"event": "click",
													"width": "500px",
													"defaultpos": ["30%", "20%"],
													"exit": "x",
													"header": "Invalid JSON from "+spec.request.target ,
													"content": "<div style='height:500px;width:499px;overflow:auto;'><b>Parameters</b>: "+spec.request.parameters+"<br/><br/><b>Response Text</b>: "+display_response_text+"</div>"
												});
												
											}
											else {
												spec.loadingDialog.targetDOM.onclick = function(event){
													alert(spec.request.target + '\n' + spec.request.parameters+'\n'+requestAsync.responseText)
												}
											}
										}
										else {
											alert(messages.json_parsing_failed + " \n\n" + spec.request.target + '\n' + spec.request.parameters)
										}
									}
									//valid JSON
									else {										
										send_response_ind = true;
										if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
											response_spec = {
												responseText: requestAsync.responseText,
												response: json_response_obj,
												parameters: spec.response.parameters,
												elapsed: elapsed_time
											};
										}
										else {
											response_spec = {
												responseText: requestAsync.responseText,
												response: json_response_obj,
												elapsed: elapsed_time
											};
										}
										
									}
								}
								else {
									send_response_ind = true;
									if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
										response_spec = {
											responseText: requestAsync.responseText,
											response: load_xml_obj_fnc(requestAsync.responseText, that),
											parameters: spec.response.parameters,
											elapsed: elapsed_time
										};
									}
									else {
										response_spec = {
											responseText: requestAsync.responseText,
											response: load_xml_obj_fnc(requestAsync.responseText, that),
											elapsed: elapsed_time
										};
									}
								}		
								//send response == true
								if (send_response_ind) {
									spec.response.target(response_spec);
								}
	                        } 
	                        catch (e) {
	                            error_handler(e.message, "ajax_request.requestAsync.responseText");
	                        }
	                    }
	                }
					else{ // Invalid readyState or status
						try{
								
							switch(requestAsync.readyState){
								case 0: ready_state_msg = "0 - Uninitalized"; break;
								case 1: ready_state_msg = "1 - Loading"; break;
								case 2: ready_state_msg = "2 - Loaded"; break;
								case 3: ready_state_msg = "3 - Interactive"; break;
								case 4: ready_state_msg = "4 - Completed"; break;
							}
							switch(requestAsync.status){
								case 200: status_msg = "200 - Success"; break;
								case 405: status_msg = "405 - Method Not Allowed"; break;
								case 409: status_msg = "409 - Invalid State"; break;
								case 492: status_msg = "492 - Non-Fatal Error"; break;
								case 493: status_msg = "493 - Memory Error"; break;
								case 500: status_msg = "500 - Internal Server Exception"; break;
							}
							ready_state_msg = "ajax_request failed on: \n\n Request Target: "+spec.request.target+"\n Request Parameters: "+spec.request.parameters+"\n\n with requestAsync.readyState -> "+ready_state_msg;
							status_msg = " requestAsync.status -> "+status_msg;
							
								elapsed_time =  new Date() - start_timer;		
								debug_string = " <br><b>Type: </b>"+spec.request.type+"<br>";
								debug_string += " <b>Target: </b>"+spec.request.target+"<br>";
								debug_string += " <b>Parameters: </b>"+spec.request.parameters+"<br>";
								debug_string += " <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
								debug_string += " <b>requestAsync.readyState </b>"+ready_state_msg;
								debug_string += " <b>requestAsync.status </b>"+status_msg;
								append_text_fnc(debug_string,that); 
								
							if(requestAsync.readyState ==  4 && requestAsync.readyState && requestAsync.status )
							{
								error_handler(ready_state_msg,status_msg);	
								
							}
						
							log.info( "info: " + ready_state_msg + status_msg);
                            							
						}
						catch(e3){
							
							log.error( "error: " + ready_state_msg + status_msg);
							
						}
					}
	            };
											
				// send request                      
				if (spec.request.type === "XMLHTTPREQUEST") {
					requestAsync.open("GET", spec.request.target);
					if (!spec.request.parameters || spec.request.parameters === null || spec.request.parameters === "") {
						requestAsync.setRequestHeader("Access-Control-Allow-Origin","*");
						requestAsync.send(null);
					}
					else{
	                	requestAsync.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	                	requestAsync.setRequestHeader("Content-length", spec.request.parameters.length);
	                	requestAsync.setRequestHeader("Connection", "close");
						requestAsync.send(spec.request.parameters);
					}
				}			
				else {
					//cpmscript_discern
					if (location.protocol.substr(0, 4) === "http") {
						
						var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + spec.request.target + "?parameters=" + spec.request.parameters;
							
						log.info(url);
						if(spec.request.blobIn !== undefined)
						{
							log.info("blobIn:");
						       log.info(spec.request.blobIn);
						}
						
						if(this.debug_mode_ind !== 1){
						var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + spec.request.target + "?parameters=" + spec.request.parameters;
						requestAsync.open("GET", url);
						if(spec.request.blobIn){
							try{
								requestAsync.setBlobIn(spec.request.blobIn);
							}
							catch(e){
								alert(" requestAsync.setBlobIn not available")
							}
						}
						requestAsync.send(null);
						}
						else
						{
							
							/*var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + spec.request.target + "?parameters=" + spec.request.parameters;
							requestAsync.open("GET", url);
							if(spec.request.blobIn){
								try{
									requestAsync.setBlobIn(spec.request.blobIn);
								}
								catch(e){
									alert(" requestAsync.setBlobIn not available")
								}
							}
							requestAsync.send(null);*/
							
							var url = location.protocol + "//" + location.host + "/CCLTestMockups/" + spec.request.target + ".JSON"; //?parameters=" + spec.request.parameters;
						requestAsync.open("GET", url, spec.request.async);
						requestAsync.send(null);
						
						}
					}
					else {
						requestAsync.open("GET", spec.request.target);
						if(spec.request.blobIn){
							try{
								requestAsync.setBlobIn(spec.request.blobIn);
							}
							catch(e){
								alert(" requestAsync.setBlobIn not available")
							}
						}
						requestAsync.send(spec.request.parameters);
					}
				}
			}
			else{
				parse_target = spec.request.target.split(".");
				parse_target_type = parse_target[parse_target.length-1].toUpperCase(); // get file type
				parse_target_text = ReadFromFile(spec.request.target);
				
				// Clear Loading Dialog
				if(spec.loadingDialog){
					if(spec.loadingDialog.targetDOM){
						spec.loadingDialog.targetDOM.innerHTML = "";
					}
				}
				
				elapsed_time =  new Date() - start_timer;	
				debug_string = " <br><b>Type: </b>"+spec.request.type+"<br>";
				debug_string += " <b>Target: </b>"+spec.request.target+"<br>";
				debug_string += " <b>Parameters: </b>"+spec.request.parameters+"<br>";
				debug_string += " <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
				append_text_fnc(debug_string,that) 
				switch(parse_target_type){
					case "JSON": 	if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
										response_spec = {response: load_json_obj_fnc(parse_target_text,that), parameters: spec.response.parameters, elapsed:elapsed_time};
									}
									else{	
										response_spec = {response: load_json_obj_fnc(parse_target_text,that), elapsed:elapsed_time};
									}
									break;
					case "XML": 	if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
										response_spec = {response: load_xml_obj_fnc(parse_target_text,that), parameters: spec.response.parameters, elapsed:elapsed_time};
									}
									else{	
										response_spec = {response: load_xml_obj_fnc(parse_target_text,that), elapsed:elapsed_time};
									}
									break;
					default: 		if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
										response_spec = {response: parse_target_text, parameters: spec.response.parameters, elapsed:elapsed_time};
									}
									else{	
										response_spec = {response: parse_target_text, elapsed:elapsed_time};
									}
									break;
				}	
				spec.response.target(response_spec); // call back function
			}	
        } 
        catch (e) {
            error_handler(e.message, "ajax_request()")
        }
		
	};
		
	init();
};
 
var AjaxHandler = new UtilJsonXml();

function getXMLCclRequest(){

    var xmlHttp = null;
    if (location.protocol.substr(0, 4) == "http") {
        try { // Firefox, Opera 8.0+, Safari  
            xmlHttp = new XMLHttpRequest();
        } 
        catch (e) { // Internet Explorer  
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } 
            catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
    }
    else {
        xmlHttp = new XMLCclRequest();
    }
    
    return xmlHttp;
}

var popupWindowHandle;
function getPopupWindowHandle(){
    return popupWindowHandle;
}

/*
* XMLCclRequest JavaScript Library v1.0.0
*
* based on contributions from Joshua Faulkenberry
* Lucile Packard Children's Hospital at Stanford
*/
XMLCclRequest = function(options) {
   /************ Attributes *************/

   this.onreadystatechange = function() {
      return null;
   };
   this.options = options || {};
   this.readyState = 0;
   this.responseText = "";
   this.status = 0;
   this.statusText = "";
   this.sendFlag = false;
   this.errorFlag = false;
   this.responseBody =
   this.responseXML =
   this.async = true;
   this.requestBinding = null;
   this.requestText = null;
   this.blobIn = null;

   /************** Events ***************/

   //Raised when there is an error.
   this.onerror =

   /************** Methods **************/

   //Cancels the current CCL request.
   this.abort =

   //Returns the complete list of response headers.
   this.getAllResponseHeaders =

   //Returns the specified response header.
   this.getResponseHeader = function() {
      return null;
   };

   //Assigns method, destination URL, and other optional attributes of a pending request.
   this.open = function(method, url, async) {
      if (method.toLowerCase() != "get" && method.toLowerCase() != "post") {
         this.errorFlag = true;
         this.status = 405;
         this.statusText = "Method not Allowed";
         return false;
      }
      this.method = method.toUpperCase();
      this.url = url;
      this.async = async!=null?(async?true:false):true;
      this.requestHeaders = null;
      this.responseText = "";
      this.responseBody = this.responseXML = null;
      this.readyState = 1;
      this.sendFlag = false;
      this.requestText = "";
      this.onreadystatechange();
   };

   //Sends a CCL request to the server and receives a response.
   this.send = function(param) {
      if (this.readyState != 1) {
         this.errorFlag = true;
         this.status = 409;
         this.statusText = "Invalid State";
         return false;
      }
      if (this.sendFlag) {
         this.errorFlag = true;
         this.status = 409;
         this.statusText = "Invalid State";
         return false;
      }
      this.sendFlag = true;
      this.requestLen = param.length;
      this.requestText = param;
      var uniqueId = this.url + "-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 99999);
      XMLCCLREQUESTOBJECTPOINTER[uniqueId] = this;

      window.location = "javascript:XMLCCLREQUEST_Send(\"" + uniqueId + "\"" + ")";

   };

   //Adds custom HTTP headers to the request.
   this.setRequestHeader = function(name, value) {
      if (this.readyState != 1) {
         this.errorFlag = true;
         this.status = 409;
         this.statusText = "Invalid State";
         return false;
      }
      if (this.sendFlag) {
         this.errorFlag = true;
         this.status = 409;
         this.statusText = "Invalid State";
         return false;
      }
      if (!value) { return false; }
      if (!this.requestHeaders) {
         this.requestHeaders = [];
      }
      this.requestHeaders[name] = value;
   };

// Sets blob input.
this.setBlobIn = function(blob) {
      this.blobIn = blob;
   };
}
XMLCCLREQUESTOBJECTPOINTER = [];
function evaluate(x){
    //alert(x)
    return eval(x)
}

function CCLLINK__(program, param, nViewerType ){}

function CCLLINK( program, param, nViewerType ){
     var paramLength = param.length;
     if (paramLength > 2000){
         param = param.substring(0, 2000);
     }
     var el = document.body.appendChild(document.createElement("a"));
     el.href = "javascript:CCLLINK__(\"" + program + "\",\"" + param + "\"," + nViewerType + "," + paramLength +")";
     el.click(); 
  }

function CCLNEWWINDOW( url ){
     var newWindow = window.open( url, '', 'fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no');
     newWindow.focus();
}

function CCLEVENT__( eventId, eventData ){}

function CCLEVENT( eventId, eventData ){
var el = document.body.appendChild(document.createElement("a"));
el.href = "javascript:CCLEVENT__(\"" + eventId + "\")";
el.click(); 
}

function CCLNEWSESSIONWINDOW__(sUrl,sName,sFeatures,bReplace,bModal){}

function CCLNEWSESSIONWINDOW(sUrl,sName,sFeatures,bReplace,bModal){
     var el =  document.body.appendChild(document.createElement("a"));
     el.href = "javascript:CCLNEWSESSIONWINDOW__(\"" + sUrl + "\",\"" + sName + "\",\"" + sFeatures + "\"," + bReplace + "," + bModal +")";
     el.click(); 
     if (bModal == 0) {          popupWindowHandle = window.open(sUrl,sName,sFeatures,bReplace);
          if (popupWindowHandle) popupWindowHandle.focus();
}
     }

function APPLINK(mode, appname, param){
    if (mode == 0) {
        window.open("file:///" + appname + " " + param);
    }
    else {
        window.location = "file:///" + appname + " " + param;
    }
}

function MPAGES_EVENT__(eventType, eventParams){
    //  alert("inside MPAGES_EVENT__ with " + eventType +  "   " + eventParams);
}

function MPAGES_EVENT(eventType, eventParams){
    var paramLength = eventParams.length;
    if(!document.getElementById("__ID_CCLPostParams_32504__")){
         linkObj = document.body.appendChild(document.createElement("a"));
         linkObj.id = "__ID_CCLPostParams_32504__";
     }
    if (paramLength > 2000) {
        document.getElementById("__ID_CCLPostParams_32504__").value = '"' + eventParams + '"';
        eventParams = eventParams.substring(0, 2000);
    }
    //  var el = document.getElementById("__ID_CCLLINKHref_11360__");
    //  el.href = "javascript:MPAGES_EVENT__(\"" + eventType + "\",\"" + eventParams + "\"," + paramLength +")";
    //  alert("el = " + el);
    //  el.click();
    window.location.href = "javascript:MPAGES_EVENT__('" + eventType + "','" + eventParams + "'," + paramLength + ")";
}

function ArgumentURL(){
    this.getArgument = _getArg;
    this.setArgument = _setArg;
    this.removeArgument = _removeArg;
    this.toString = _toString; //Allows the object to be printed
    //no need to write toString()
    this.arguments = new Array();
    
    // Initiation
    var separator = ",";
    var equalsign = "=";
    
    var str = window.location.search.replace(/%20/g, " ");
    //  alert(str);
    var index = str.indexOf("?");
    var sInfo;
    var infoArray = new Array();
    
    var tmp;
    
    if (index != -1) {
        sInfo = str.substring(index + 1, str.length);
        infoArray = sInfo.split(separator);
    }
    
    for (var i = 0; i < infoArray.length; i++) {
        tmp = infoArray[i].split(equalsign);
        if (tmp[0] != "") {
            var t = tmp[0];
            this.arguments[tmp[0]] = new Object();
            this.arguments[tmp[0]].value = tmp[1];
            this.arguments[tmp[0]].name = tmp[0];
        }
    }
    
    
    
    function _toString(){
        var s = "";
        var once = true;
        for (i in this.arguments) {
            if (once) {
                s += "?";
                once = false;
            }
            s += this.arguments[i].name;
            s += equalsign;
            s += this.arguments[i].value;
            s += separator;
        }
        return s.replace(/ /g, "%20");
    }
    
    function _getArg(name){
        if (typeof(this.arguments[name].name) != "string") 
            return null;
        else 
            return this.arguments[name].value;
    }
    
    function _setArg(name, value){
        this.arguments[name] = new Object()
        this.arguments[name].name = name;
        this.arguments[name].value = value;
    }
    
    function _removeArg(name){
        this.arguments[name] = null;
    }
    
    return this;
}
/** extern healthe-widget-library-1.3.2-min */

/**~BB~************************************************************************
 *                                                                       *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
 *                              Technology, Inc.                         *
 *       Revision      (c) 1984-2009 Cerner Corporation                  *
 *                                                                       *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
 *  This material contains the valuable properties and trade secrets of  *
 *  Cerner Corporation of Kansas City, Missouri, United States of        *
 *  America (Cerner), embodying substantial creative efforts and         *
 *  confidential information, ideas and expressions, no part of which    *
 *  may be reproduced or transmitted in any form or by any means, or     *
 *  retained in any storage or retrieval system without the express      *
 *  written permission of Cerner.                                        *
 *                                                                       *
 *  Cerner is a registered mark of Cerner Corporation.                   *
 *                                                                       *
 * 1. Scope of Restrictions                                              *
 *  A.  Us of this Script Source Code shall include the right to:        *
 *  (1) copy the Script Source Code for internal purposes;               *
 *  (2) modify the Script Source Code;                                   *
 *  (3) install the Script Source Code in Client's environment.          *
 *  B. Use of the Script Source Code is for Client's internal purposes   *
 *     only. Client shall not, and shall not cause or permit others, to  *
 *     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
 *     sublicense or otherwise transfer the Script Source Code, in       *
 *     whole or part.                                                    *
 * 2. Protection of Script Source Code                                   *
 *  A. Script Source Code is a product proprietary to Cerner based upon  *
 *     and containing trade secrets and other confidential information   *
 *     not known to the public. Client shall protect the Script Source   *
 *     Code with security measures adequate to prevent disclosures and   *
 *     uses of the Script Source Code.                                   *
 *  B. Client agrees that Client shall not share the Script Source Code  *
 *     with any person or business outside of Client.                    *
 * 3. Client Obligations                                                 *
 *  A. Client shall make a copy of the Script Source Code before         *
 *     modifying any of the scripts.                                     *
 *  B. Client assumes all responsibility for support and maintenance of  *
 *     modified Script Source Code.                                      *
 *  C. Client assumes all responsibility for any future modifications to *
 *     the modified Script Source Code.                                  *
 *  D. Client assumes all responsibility for testing the modified Script *
 *     Source Code prior to moving such code into Client's production    *
 *     environment.                                                      *
 *  E. Prior to making first productive use of the Script Source Code,   *
 *     Client shall perform whatever tests it deems necessary to verify  *
 *     and certify that the Script Source Code, as used by Client,       *
 *     complies with all FDA and other governmental, accrediting, and    *
 *     professional regulatory requirements which are applicable to use  *
 *     of the scripts in Client's environment.                           *
 *  F. In the event Client requests that Cerner make further             *
 *     modifications to the Script Source Code after such code has been  *
 *     modified by Client, Client shall notify Cerner of any             *
 *     modifications to the code and will provide Cerner with the        *
 *     modified Script Source Code. If Client fails to provide Cerner    *
 *     with notice and a copy of the modified Script Source Code, Cerner *
 *     shall have no liability or responsibility for costs, expenses,    *
 *     claims or damages for failure of the scripts to function properly *
 *     and/or without interruption.                                      *
 * 4. Limitations                                                        *
 *  A. Client acknowledges and agrees that once the Script Source Code is*
 *     modified, any warranties set forth in the Agreement between Cerner*
 *     and Client shall not apply.                                       *
 *  B. Cerner assumes no responsibility for any adverse impacts which the*
 *     modified Script Source Code may cause to the functionality or     *
 *     performance of Client's System.                                   *
 *  C. Client waives, releases, relinquishes, and discharges Cerner from *
 *     any and all claims, liabilities, suits, damages, actions, or      *
 *     manner of actions, whether in contract, tort, or otherwise which  *
 *     Client may have against Cerner, whether the same be in            *
 *     administrative proceedings, in arbitration, at law, in equity, or *
 *     mixed, arising from or relating to Client's use of Script Source  *
 *     Code.                                                             *
 * 5. Retention of Ownership                                             *
 *    Cerner retains ownership of all software and source code in this   *
 *    service package. Client agrees that Cerner owns the derivative     *
 *    works to the modified source code. Furthermore, Client agrees to   *
 *    deliver the derivative works to Cerner.                            *
 ~BE~************************************************************************/
/******************************************************************************

 Source file name:       dc_mp_js_util_popup.js

 Product:                Discern Content
 Product Team:           Discern Content

 File purpose:           Provides the UtilPopup class with methods
 to attach Popups and Hovers to DOM elements.

 Special Notes:          <add any special notes here>

 ;~DB~**********************************************************************************
 ;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
 ;**************************************************************************************
 ;*                                                                            		  *
 ;*Mod Date     Engineer             		Feature      Comment                      *
 ;*--- -------- -------------------- 		------------ -----------------------------*
 ;*000 		   RB018070				    	######       Initial Release              *
 ;~DE~**********************************************************************************
 ;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/
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
var UtilPopup = ( function() {
	var hoverPopupDOM = Util.cep("div", {
		"className": "popup_hover"
	})
	, dragObj = {}
	, popupDOM = null
	, modalPopup = null
	, popupHeaderTextDOM = null
	, popupHeaderWrapDOM = null
	, popupHeaderDragDOM = null
	, popupContentDOM = null
	, popupHeaderExitDOM = null
	, popupConfirmButtonsWrapDOM = null
	,hideHoverFnc
	,displayTimeOut
	,hideTimeOut
	,currentDragNode = null
	,currentDragCloneNode = null
	,dragTimeOut;
	var dragHolderNode = null;
	function UtilPopup_mpo(e) {
		var posx = 0;
		var posy = 0;
		if (!e)
			var e = window.event;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
		}
		return [posy, posx];
	}

	function modalWindow(contents) {
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
		this.display = function() {
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
		this.hide = function() {
			//Hide the content window.
			iBlockr.style.display = "none";
			mcontents.style.display = "none";
			iBlockr.style.visibility = "hidden";
			mcontents.style.visibility = "hidden";
			window.currentModalWindow = null;
		}
	}

	function setOpacity(elRef, value) {
		//Value should be between 0 and 1.
		//W3C browsers and IE7+
		elRef.style.opacity = value;
		//Older versions of IE
		elRef.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';

	}

	function getWindowGeometry() {
		var doc = "", browserWidth = "", browserHeight = "", bodyWidth = "", bodyHeight = "", scrollX = "", scrollY = "";

		try {
			doc = (!document.compatMode || document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
			if (window.innerWidth) {
				//Most Browsers
				browserWidth = window.innerWidth;
				browserHeight = window.innerHeight;
			} else {
				//IE
				browserWidth = doc.clientWidth;
				browserHeight = doc.clientHeight;
			}
			bodyWidth = Math.max(doc.scrollWidth, browserWidth);
			bodyHeight = Math.max(doc.scrollHeight, browserHeight);

			scrollX = (bodyWidth > browserWidth);
			scrollY = (bodyHeight > browserHeight);
		} catch (error) {
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

	function dragStart(e, domObj) {
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

	function dragGo(e) {
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

	function dragStop(e) {
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
			} else if (dragHolderNode != null && currentDragNode != null) {
				currentDragNode.style.position = "relative";
				currentDragNode.style.top = "0px";
				currentDragNode.style.left = "0px";
				currentDragNode.style.width = "100%";
				currentDragNode.style.height = "auto";
				Util.removeEvent(currentDragNode, "mousedown", draggableHandlerFunction);
				deleteNode = Util.ce("div");
				deleteNode.innerHTML = "x";
				deleteNode.style.top = "0px";
				deleteNode.style.right = "2px";
				deleteNode.style.position = "absolute";
				deleteNode.style.fontWeight = "bold";
				deleteNode.style.display = "block";
				deleteNode.title = "Click to remove item.";
				deleteNode.style.cursor = "hand";
				Util.addEvent(deleteNode, "click", function(e2) {
					Util.de(Util.gp(deleteNode));
				});
				currentDragNode.style.cursor = "default";
				deleteNode = Util.ac(deleteNode, currentDragNode);
				Util.ia(currentDragNode, dragHolderNode);
				Util.de(dragHolderNode);
				dragHolderNode = null;
			}

			currentDragNode = null;

			document.onmousemove = function(e) {
			};
			document.onmouseup = function(e) {
			};
			Util.cancelBubble(e);
		} catch(err) {
			alert(err.message+"--> UtilPopup.dragStop");
		}
	}

	function displayModalPopup(popPrefs,popupType) {
		var popupConfirmYesDOM,popupConfirmNoDOM,pageHeightWidth = Util.Pos.gvs();
		
		if (popupDOM != null) { // Popup type
			Util.de(popupDOM);	
		
		}
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
			
			popupConfirmButtonsWrapDOM = Util.cep("span", {
				"className": "popup-modal-buttons-wrapper"
			});
			
			popupConfirmYesDOM	= Util.cep("input",{"type":"button","value":"Yes","className": "popup-modal-button"});
			popupConfirmNoDOM	= Util.cep("input",{"type":"button","value":"No","className": "popup-modal-button"});

			modalPopup = new modalWindow(popupDOM);

			if(popupType == "MODAL_POPUP") {
				popupHeaderTextDOM = Util.ac(popupHeaderTextDOM, popupHeaderWrapDOM);
				popupHeaderExitDOM = Util.ac(popupHeaderExitDOM, popupHeaderWrapDOM);
				popupHeaderWrapDOM = Util.ac(popupHeaderWrapDOM, popupDOM);

				popupContentDOM = Util.ac(popupContentDOM, popupDOM);
				popupHeaderExitDOM.onclick = function() {
					modalPopup.hide();
				}
				if (popPrefs.exitFnc) {
					popupHeaderExitDOM.onclick = function() {
						modalPopup.hide();
						popPrefs.exitFnc;
					}
				}
				Util.addEvent(popupHeaderTextDOM, "mousedown", function(e) {
					dragStart(e, popupDOM)
				});
			}
			else if (popupType == "MODAL_CONFIRM") {
				popupHeaderTextDOM = Util.ac(popupHeaderTextDOM, popupHeaderWrapDOM);
				popupHeaderTextDOM.style.width = "100.00%";
				popupHeaderWrapDOM = Util.ac(popupHeaderWrapDOM, popupDOM);
				popupConfirmNoDOM = Util.ac(popupConfirmNoDOM,popupConfirmButtonsWrapDOM);
				popupConfirmYesDOM = Util.ac(popupConfirmYesDOM,popupConfirmButtonsWrapDOM);
				if(popPrefs.yes_no && popPrefs.yes_no.length > 0){
					if(popPrefs.yes_no[0]){
						popupConfirmYesDOM.value = popPrefs.yes_no[0];
					}
					if(popPrefs.yes_no[1]){
						popupConfirmNoDOM.value = popPrefs.yes_no[1];
					}
				}
				
				popupConfirmYesDOM.onclick = function(){
					modalPopup.hide();
					popPrefs.onconfirm(true);
				}	
				popupConfirmNoDOM.onclick = function(){
					modalPopup.hide();
					popPrefs.onconfirm(false);
				}	
				popupContentDOM = Util.ac(popupContentDOM, popupDOM);		
				popupConfirmButtonsWrapDOM = Util.ac(popupConfirmButtonsWrapDOM, popupDOM);
			}
			else{				
				popupContentDOM = Util.ac(popupContentDOM, popupDOM);
			}
			
			Util.ac(popupDOM, document.body);
		
		if (popupType == "MODAL_POPUP") { // Popup type
			popupHeaderTextDOM.innerHTML = (popPrefs.header) ? popPrefs.header : "&nbsp;";
			popupHeaderExitDOM.innerHTML = (popPrefs.exit) ? popPrefs.exit : "x";
		}
		
		if (popupType == "MODAL_CONFIRM") {
			popupHeaderTextDOM.innerHTML = (popPrefs.header) ? popPrefs.header : "&nbsp;";
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
		if(popupContentDOM.innerHTML > "") {
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
		
		if (popPrefs.position
				&& popPrefs.position.toUpperCase() == "CENTER") {
			popupDOM.style.top = ((Math.floor(parseInt(pageHeightWidth[0],10)/2) - Math.floor(parseInt(popupDOM.offsetHeight,10)/2)))+"px";
			popupDOM.style.left = ((Math.floor(parseInt(pageHeightWidth[1],10)/2) - Math.floor(parseInt(popupDOM.offsetWidth,10)/2)))+"px";
		}		
		modalPopup.display();
	}

	function draggableHandler(e) {
		try {
			var pos, childNodes, index, childNodesLength, childCloneNode, targ, dragNode;
			if (e.target)
				targ = e.target;
			else if (e.srcElement)
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
				} else {
					currentDragCloneNode = Util.ce(dragNode.tagName);
					currentDragCloneNode.style.width = "100.00%";
					currentDragCloneNode.style.height = "auto";
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

		} catch (err) {
			alert(err.message+"--> UtilPopup.draggableHandler");
		}
	}

	function draggableHandlerFunction(e) {
		if (!e) {
			var e = window.event;
		}
		var eventCopy = {};
		for (var i in e) {
			eventCopy[i] = e[i];
		}
		dragTimeOut = setTimeout( function() {
			draggableHandler(eventCopy);
		},500);
	}

	function checkDropContainers(mousepos) {
		var droppableContainers = Util.Style.g("droppable-container")
		,droppableLength = droppableContainers.length
		,index
		,dims;
		index = 0;
		while(index < droppableLength) {
			dims = Util.Pos.gop(droppableContainers[index]);
			dims[2] = dims[0]+droppableContainers[index].offsetHeight;
			dims[3] = dims[1]+droppableContainers[index].offsetWidth;
			if(mousepos[0]  >= dims[0] &&  mousepos[0]  <= dims[2]
			&& mousepos[1]  >= dims[1] &&  mousepos[1]  <= dims[3]) {
				break;
			} else {
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
				dragHolderNode.style.width = dropContainer.offsetWidth + "px";
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
		getDragTimeOut: function() {
			return(dragTimeOut);
		},
		attachHover: function(hvrPrefs) {
			try {
				var objDOM = hvrPrefs.elementDOM, hoverAlign = hvrPrefs.align, objDOMPos = Util.Pos.gop(objDOM), objDOMScrollOffsets = hvrPrefs.scrolloffsets, offsets = hvrPrefs.offsets, position = hvrPrefs.position, dimensions = hvrPrefs.dimensions, showHoverFnc, hvrOutFnc = hvrPrefs.hvrOutFnc, hvrTxt = hvrPrefs.content, hvrTxtDOM = hvrPrefs.contentDOM, hvrRef = hvrPrefs.contentRef, stickyTimeOut = hvrPrefs.stickyTimeOut, displayHvr = hvrPrefs.displayHvr, stickyOut;
				if (objDOMScrollOffsets && objDOMScrollOffsets.length === 2) {
					objDOMPos[0] = objDOMPos[0] - objDOMScrollOffsets[0];
					objDOMPos[1] = objDOMPos[1] - objDOMScrollOffsets[1];
				}

				hideHoverFnc = function(e) {
					// clear any display timeout
					clearTimeout(displayTimeOut);
					// clear any hide timeout
					clearTimeout(hideTimeOut);
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
					showHoverFnc = function(e,mousePosition) {

						if (!e) {
							e = window.event;
						}
						var curMousePosition, curWindowDim = Util.Pos.gvs(), curMaxHeight, curMaxWidth;
						if(!mousePosition || mousePosition == [] || mousePosition.length == 0) {
							curMousePosition = UtilPopup_mpo(e);
						} else {
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
						} else if (hvrTxt) {
							hoverPopupDOM.innerHTML = hvrTxt;
						} else {
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
						} else {
							if (y < hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // top-right edges of screen
							{
								y += 5 + offsets[0];
								x = (x - hoverPopupDOM.offsetWidth - 5 - offsets[1]);
							} else if (y > hoverPopupDOM.offsetHeight && x < hoverPopupDOM.offsetWidth) // bottom-left edges of screen
							{
								y = (y - hoverPopupDOM.offsetHeight - 5 - offsets[0]);
								x += 5 + offsets[1];
							} else if (y > hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // bottom-right edges of screen
							{
								y = (y - hoverPopupDOM.offsetHeight - 5 - offsets[0]);
								x = (x - hoverPopupDOM.offsetWidth - 5 - offsets[1]);
							} else { // top-left edges of screen
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
									} else {
										y = (objDOMPos[0] - hoverPopupDOM.offsetHeight);
									}
									break;
								case "down-horizontal":
									x = (objDOMPos[1]);
									if (hoverPopupDOM.offsetHeight > objDOMPos[0]) {
										y = 0;

									} else {
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
						} else {
							hvrPrefs.displayTimeOut = 0
						}
						// No display timeout => regular event
						if(hvrPrefs.displayTimeOut == 0) {
							Util.addEvent(objDOM, hvrPrefs.event, function(showHoverEvent) {
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
					} else {
						showHoverFnc(displayHvr,[]);
					}

					//Sticky Hover
					if (hvrPrefs.sticky && (hvrPrefs.sticky == 1 || hvrPrefs.sticky == true)) {
						if (!displayHvr) {
							stickyOut = "mouseleave";
							stickyTimeOut = (stickyTimeOut && parseInt(stickyTimeOut) > 0) ? stickyTimeOut : 200;
							Util.addEvent(objDOM, "mouseleave", function(mouseLeaveEvent) {
								hideTimeOut = setTimeout(hideHoverFnc, stickyTimeOut);
								Util.cancelBubble(mouseLeaveEvent);
								Util.preventDefault(mouseLeaveEvent);
							});
						}
						Util.addEvent(hoverPopupDOM, "mouseenter", function(mouseEnterEvent) {
							clearTimeout(hideTimeOut);
							Util.addEvent(hoverPopupDOM, "mouseleave", hideHoverFnc);
							Util.cancelBubble(mouseEnterEvent);
							Util.preventDefault(mouseEnterEvent);
						});
					}
					//Plain Old Hover
					else {
						Util.addEvent(objDOM, "mouseout", hideHoverFnc);
					}
				}

			} catch (err) {
				alert(err.message+"--> UtilPopup.attachHover");
			}
		},
		attachModalPopup: function(popPrefs) {
			var that = this;
			Util.addEvent(popPrefs.elementDOM, popPrefs.event, function() {
				displayModalPopup(popPrefs,"MODAL_POPUP");
			});
		},
		hideHover : function(e) {
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
		launchModalPopup : function(popPrefs) {
			displayModalPopup(popPrefs,"MODAL_POPUP");
		},
		launchModalDialog : function(popPrefs) {
			displayModalPopup(popPrefs,"MODAL_DIALOG");
		},
		launchModalConfirmPopup: function(popPrefs) {
			displayModalPopup(popPrefs,"MODAL_CONFIRM");
		},
		closeModalDialog : function() {
			modalPopup.hide();
			popupDOM = null;
		},
		closeModalPopup: function() {
			modalPopup.hide();
		},
		initializeDragDrop: function(parentNode) {
			if(!parentNode) {
				parentNode = document.body;
			}
			var draggableElements = Util.Style.g("draggable-element",parentNode)
			,draggableLength = draggableElements.length
			,index;
			index = 0;
			document.onmousemove = function(e) {
			};
			document.onmouseup = function(e) {
			};
			while(index < draggableLength) {
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
/* =========================================================
 * bootstrap-modal.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!function( $ ){

  "use strict"

  var Typeahead = function ( element, options ) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.onselect = this.options.onselect
    this.strings = true
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = JSON.parse(this.$menu.find('.active').attr('data-value'))
        , text

      if (!this.strings) text = val[this.options.property]
      else text = val

      this.$element.val(text)

      if (typeof this.onselect == "function")
          this.onselect(val, this.$element)

      return this.hide()
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q
        , value

      this.query = this.$element.val()

      if (typeof this.source == "function") {
        value = this.source(this, this.query)
        if (value) this.process(value)
      } else {
        this.process(this.source)
      }
    }

  , process: function (results) {
      var that = this
        , items
        , q

      if (results.length && typeof results[0] != "string")
          this.strings = false

      this.query = this.$element.val()

      if(this.query.charAt(0)==="*"){
        this.query = this.query.substring(1)
      }

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(results, function (item) {
        if (!that.strings)
          item = item[that.options.property]
        if (that.matcher(item)) return item
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      if(items.length>10){
        items.splice(10, 0, {
            "RESULT_CD": -1,
            "RESULT_DESC": "",
            "RESULT_DISP": "Show all "+items.length+" results...",
            "ALIAS": "",
            "CONTRIBUTOR_SOURCE_CD": 0,
            "CONTRIBUTOR_SOURCE_DISP": "",
            "EVENT_SET_NAME": "",
            "TYPE_FLAG": 0
        })
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item
        , sortby

      while (item = items.shift()) {
        if (this.strings) sortby = item
        else sortby = item[this.options.property]

        if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      return item.replace(new RegExp('(' + this.query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', JSON.stringify(item))
        if (!that.strings)
            item = item[that.options.property]
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      $.each(items, function(i, item){
        if($.parseJSON($(item).attr('data-value')).RESULT_CD!==-1)
          $(item).attr("title", $.parseJSON($(item).attr('data-value')).RESULT_CD)
      })
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      e.stopPropagation()
      e.preventDefault()

      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
		//case 17: // CTRL
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          this.hide()
          break

        default:
          this.lookup()
      }

  }

  , keypress: function (e) {
      e.stopPropagation()
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }
    }

  , blur: function (e) {
      var that = this
      e.stopPropagation()
      e.preventDefault()
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , onselect: null
  , property: 'value'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}( window.jQuery );
var CodeSearch = function(prefs){
	var results = []
	var modalTitle = ""
	var query = ""
	  prefs.element.typeahead({
	    source: function (typeahead) {
	    	var $element=typeahead.$element
	    	var wildCardInd = false
	    	var searchString = $element.val()
	    	var prim_ind = prefs.prim_ind===undefined ? 0 : prefs.prim_ind
	    	$element.attr("code_value", "")
	    	$element.removeAttr("title")
			$element.removeClass("red-border");
			
	    	var json_handler = new UtilJsonXml({
				"debug_mode_ind" : 0,
				"disable_firebug" : true
			})
			query = searchString
			if(searchString.charAt(0)==="*"){
				wildCardInd=true
				searchString = searchString.substring(1)
			}
			
			/*if($element[0].hasAttribute( 'display_name' )){
				if(searchString === $element[0].getAttribute( 'display_name'))
				   typeahead.process([]);
				return;
			}*/
			
	    	if(searchString.length>1){
				$element.addClass("red-border");
			    var path = "bh_mp_sa_get_event_search", params = "^MINE^, "+prefs.codeSet+", ^"+searchString+"^, "+prim_ind
				json_handler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : path,
						parameters : params
					},
					response : {
						type : "JSON",
						target : function receiveReply(json_response){
							var response = json_response.response.REPLY
							if(response.STATUS_DATA.STATUS==="S"){
								var list = []
								if(wildCardInd){
									list = response.STARTS_WITH_LIST.concat(response.CONTAINS_LIST)
									modalTitle = "Contains \"" + searchString + "\"..."
								}
								else{
									list = response.STARTS_WITH_LIST
									modalTitle = "Starts with \"" + searchString + "\"..."
								}
								results=list
								typeahead.process(list)																
							}
							else{
								typeahead.process([])	    		
							}
						},
						parameters : [this]
					}
				});
	    	}
	    	else{
				typeahead.process([])	    		
	    	}
	    },
	    onselect: function (obj, typeahead) {
			
	    	if(obj.RESULT_CD===-1){
	    		var $modal = $('#myModal')
	    		$modal.modal()
	    		$modal.find(".modal-header-text").text(modalTitle)
	    		var $select = $modal.find('.modal-body-select')
	    		$select.html("")
	    		$select.css("width", $modal.find('.modal-body').css("width"))
	    		$.each(results, function(index, result){
	    			$select.append("<option value='"+result.RESULT_CD+"' title='"+result.RESULT_CD+"''>"+result.RESULT_DISP+"</option>")
	    		})
	    		typeahead.val(query)
	    		$modal.find('.submit-btn').click(function() {
				  	var $selected = $modal.find('.modal-body-select option:selected')
				  	typeahead.val($selected.text())
	    			typeahead.attr("code_value", $selected.val())
	    			typeahead.attr("title", $selected.val())
	    			$modal.find('.submit-btn').unbind("click")
	    			$modal.find('.modal-body-select').unbind("dblclick")
	    			$modal.modal('hide')		  	
				});
	    		$modal.find('.modal-body-select').dblclick(function() {
					$modal.find('.submit-btn').trigger("click")	  	
				});
	    	}
	    	else{
	    		typeahead.attr("code_value", obj.RESULT_CD)
	    		typeahead.attr("title", obj.RESULT_CD)
				//typeahead.attr("display_name", obj.RESULT_DISP)
				typeahead.removeClass("red-border");
	    	}
	    },
	    "property": "RESULT_DISP",
	    "items": 11
	  })
}
var validateForm = function()
	{

		function validateNumber(ctrl, min, max){
			var ctrlValue = ctrl.val();
			var valid = true;
			if(!ctrlValue.match(/^0*?[1-9]\d*$/)){
				if(!ctrlValue.match(/^\s*$/)){

				alert("Please enter a valid number");
				valid = false;
			} }
			else{
				var number = parseInt(ctrlValue);
				if(!inRange(number, min, max)) {
					max == 720 ? 
						alert("Please enter a valid number ranging between "+ min + " min and 12 hours") : 
						alert("Please enter a valid number ranging between "+ min + " and " + max);
					valid = false;
				}
			}
			if (valid == false){
				ctrl.focus();
			} 
			return	valid;
		}
		function inRange(value, min, max){
			var retval = true;
			if(min === undefined){}
			else{
				if(value < min){
					retval = false;
				}
			}
			
			if(max === undefined){}
			else{
				if(value > max){
					retval = false;
					}
			}
			return retval;
			
		}

		var validate = true;
		
		validate = validateNumber($('#sendRequestBatchInput'),10,100);
		if (validate == false) return false;
		
		validate = validateNumber($('#loadRequestBatchInput'),1,25);
		if (validate == false) return false;
		
		validate = validateNumber($('#RetrieveDefaultTime'), 1,720);
		if (validate == false) return false;
		
		return validate;
	};
//Batchsize Validation(1-25)	
  
     var batchSize= function(evt)
	{		
	var batVal = document.getElementById("loadRequestBatchInput").value;
	
	var reg=new RegExp("[^0-9]");
	if(batVal=='')
	{
		return true;
	}
	if((reg.test(batVal)) || (batVal<1 || batVal >25))
	{
		alert("Please enter a valid number ranging between 1-25");
		document.getElementById("loadRequestBatchInput").value='';
		return false;
	}
	return true;
 };
 
 var batchSize2= function(evt)
	{		
	var batVal = document.getElementById("RetrieveDefaultTime").value;
	var reg=new RegExp("[^0-9]");
	if(batVal=='')
	{
		return true;
	}
	if((reg.test(batVal)) || (batVal<1 || batVal >720))
	{
		alert("Please enter a valid number ranging between 1-720");
		document.getElementById("RetrieveDefaultTime").value='';
		return false;
	}
	return true;
	};
	var batchSize3= function(evt)
	{		
	var batVal = document.getElementById("sendRequestBatchInput").value;
	var reg=new RegExp("[^0-9]");
	if(batVal=='')
	{
		return true;
	}
	if((reg.test(batVal)) || (batVal<1 || batVal >100))
	{
		alert("Please enter a valid number ranging between 1-100");
		document.getElementById("sendRequestBatchInput").value='';
		return false;
	}
	return true;
 };	 
 
	var mConsole = {
	debug_level_fatal : 0,
	debug_level_error : 1,
	debug_level_warning :2,
	debug_level_info : 4,
	debug_level_trace : 8,
	debug_level_debug : 16,
	debug_level_all : 32,
	debug_level_warning_bit : 0,
	
	isInfoBitOn : false,
	isDebugTraceBitOn : false,
	isDebugErrorBitOn : false,
	logInfo : false,
	
	logLevel : "",
	
	init : function(){
	    if(Criterion.debug_mode_ind <= 0){
	        return;
        }
	    var debug_level_param = 
	        Criterion.debug_level_ind === undefined ? 
	            this.debug_level_fatal | this.debug_level_error : Criterion.debug_level_ind;        
	    this.isInfoBitOn = (debug_level_param & this.debug_level_info) ==  this.debug_level_info;
	    this.isDebugTraceBitOn = ( debug_level_param & this.debug_level_trace) == this.debug_level_trace ;
	    this.isDebugErrorBitOn = ( debug_level_param & this.debug_level_error) == this.debug_level_error;	
    	this.logInfo = this.isInfoBitOn || this.isDebugTraceBitOn || this.isDebugErrorBitOn;
    	
	    //Info
	    if(this.isInfoBitOn){
		    this.logLevel = "Debug info:";
	    }
	    //Trace 
	    if(this.isDebugTraceBitOn ){
		    this.logLevel = "Debug trace:";
	    }
	    //debug_level_error or debug_level_Fatal 
	    if(this.isDebugErrorBitOn ){
		    this.logLevel = "Debug Error/Fatal:";
	    }		
	},

	log : function(value, debug_level_arg){
        if (this.logInfo == false) return;
        var isLogging = false;
        if((debug_level_arg & this.debug_level_info) && this.isInfoBitOn)
            isLogging = true;
        if((debug_level_arg & this.debug_level_trace) && this.isDebugTraceBitOn)
            isLogging = true;            
        if((debug_level_arg & this.debug_level_error) && this.isDebugErrorBitOn)
            isLogging = true;              
            
	    //write the log
    	if(isLogging == true)
		    log.info(this.logLevel + " " + value);
	    }
	};


var setup = (function(){
    var project_name = "BHSAFETY";
	var nomenList = [];
	var nomenDefaultList = [];
	var nomenResponse = [];
	var defaultNom = [];
	var nuResponse = [];
	var locTypeSelected = [];
	var ceLabel=[];
	var riskLabel = [];
	var sRiskQual = [];
	var sRiskResp = [];
	var obsLabel=[];
	var nomenResponseCnt = 0;
	var nomenResponseCollection = [];
	var json_handler = new UtilJsonXml({
		"debug_mode_ind" : 0,
		"disable_firebug" : true
	});

	/*
	 * event handler
	 */
	//Radio button event
	$(document).on('change', 'input:radio', function() {
		$(this).closest('table').find('input:text').attr('disabled', 'disabled');
		$(this).closest('tr').find('input:text').removeAttr('disabled');
	});

	$(document).on('change', '.ptpopRadio', function(){
		if($(this).attr("value")==="1"){
			$('#wtsDiv').slideDown("slow");
			$('#defaultPopDiv').slideDown("slow");
			$('#locTypeDiv').slideUp("slow");
			$('#defaultPopRadio1').prop("disabled", false);
			$('#defaultPopRadio2').prop("disabled", true);
			$('#defaultPopRadio2').prop("checked", false);
		}
		else if($(this).attr("value")==="2"){
			$('#wtsDiv').slideDown("slow");
			$('#defaultPopDiv').slideDown("slow");
			$('#locTypeDiv').slideDown("slow");
			$('#defaultPopRadio1').prop("disabled", true);
			$('#defaultPopRadio2').prop("disabled", false);
			$('#defaultPopRadio1').prop("checked", false);
		}
		else if($(this).attr("value")==="3"){
			$('#locTypeDiv').slideDown("slow");
			$('#wtsDiv').slideDown("slow");
			$('#defaultPopDiv').slideDown("slow");
			$('#defaultPopRadio1').prop("disabled", false);
			$('#defaultPopRadio2').prop("disabled", false);
		}
		if($("#wtsRadioN").attr("checked")==="checked"){
			$('#defaultPopRadio2').attr("disabled", true);
		}
	});
	
	

	//Wts location section event
	$(document).on('change', '#wtsDiv input:radio', function(event){
		if($(event.target).attr("id")==="wtsRadioN"){
			$('#defaultPopRadio2').attr("disabled", true);
		}
		else if($(event.target).attr("id")==="wtsRadioY"){
			if(!$('#ptpopRadioList').attr("checked")){
				$('#defaultPopRadio2').attr("disabled", false);
			}
		}
	});

	//Location Type Selection event
	$(document).on('change', '#locTypeCheck', function(){
		$('#locTypeDiv select[name=\'locTypeSelectedlList\']').html("");
		var html="";
		var list = [];
		if(!$(this).prop("checked")){
			list = _.filter(nuResponse, function(nu){
				return nu.ACTIVE_IND===1;
			});
		}
		else{
			list = nuResponse;
		}
		$.each(list,  function(i, e){
			var ind="";
			if(e.ACTIVE_IND===1){
				ind="active";
			}
			else{
				ind="inactive";
			}
			html+="<option value='"+e.CODE_VALUE+"' title='"+e.DISPLAY+"' class='"+ind+"'>"+e.DISPLAY+"</option>";
		});
		$('#locTypeDiv select[name=\'locTypeAvailList\']').html(html);
		setLocType();
	});

	$(document).on('click', '#locTypeAddButton', function(){
		$(this).closest('tr').find('select[name=\'locTypeAvailList\']').find("option:selected").each(function(i, v){
			var newOpt = "<option value='"+ $(v).val()+"'>"+$(v).html()+"</option>";
			$(v).closest('tr').find('select[name=\'locTypeSelectedlList\']').append(newOpt);
			$(v).remove();
		});
	});

	$(document).on('click', 'input[type="radio"]', function(){
       if($(this).attr('class') == 'statusRadioCodeset200') {
            var qualifierButton = $(this).closest('.statusRadioCodeset200').parents().eq(8);
		    qualifierButton.find('.qualifierResponseBtn1').css("visibility", "hidden");		
            var qualifierBtnDel = $(this).closest('.riskQualifier').parents().eq(8); 
		    qualifierButton.find('.riskQualifier').remove();			
       }

       else if($(this).attr('class') == 'statusRadioRiskSet') {
           var qualifierButton = $(this).closest('.statusRadioRiskSet').parents().eq(8);
		    qualifierButton.find('.qualifierResponseBtn1').css("visibility", "visible");		
       }
	   
	    else if($(this).attr('class') == 'statusRadioRiskcode') {
           var qualifierButton = $(this).closest('.statusRadioRiskcode').parents().eq(8);
		    qualifierButton.find('.qualifierResponseBtn1').css("visibility", "visible");		
       }
   });
	
	$(document).on('click', '#locTypeRemoveButton', function(){
		$(this).closest('tr').find('select[name=\'locTypeSelectedlList\']').find("option:selected").each(function(i, v){
			if($(v).attr("class")&&!$('#locTypeCheck').prop("checked")){
				$(v).remove();
			}
			else{
				var newOpt = "<option value='"+ $(v).val()+"'>"+$(v).html()+"</option>";
				$(v).closest('tr').find('select[name=\'locTypeAvailList\']').append(newOpt);
				$(v).remove();
			}
		});
	});
/** 
		precaution button
	*/
	$(document).on('click', '#fallRiskEventButton', function(){
		var ind=$('.multipleRiskList').length;
			var url = staticContentLocation+"/html/precaution_event.html";
			var html = $.get(url, function(data){
				$(data).appendTo('#Fallriskdiv');
			});
			var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
			var addImageUrl = staticContentLocation+"/img/3941_16.png";
			$('.statusRiskDelete').last().find('img').attr('src', deleteImageUrl);
			
			$('.qualifierResponseBtn1').last().find('img').attr('src', addImageUrl);
	     	$('.riskResponseBtn1').last().find('img').attr('src', addImageUrl);
			$('.multipleRiskList').last().find('input:radio').attr('name', 'riskStatus'+ind);
     		//}
			
		
		setTimeout(function(){ 
		var codeSearch93 = new CodeSearch({
			"element": $(".typeahead93")
			,"codeSet": 93
			,"prim_ind" : 1
		});
		var codeSearch72 = new CodeSearch({
			"element": $(".typeahead72")
			,"codeSet": 72		
		});

        var codeSearch200 = new CodeSearch({
			"element": $(".typeahead200")
			,"codeSet": 200
		});
		
		}, 10);
		
		$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
		$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');
		$('.label_DISPLAY_200').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 200)');
	});
	
	
	/** 
		Risk qualifier tabel appending.
	*/


	$(document).on('click', '.qualifierResponseBtn1', function(){
		var $button=$(this).closest('tr');
		var $abc=$(this).closest('button');
		var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
		
			var url = staticContentLocation+"/html/risk_qualifier-response.html";
			var html = $.get(url, function(data){
				$('<tr class="btntr"><td id="btnClass"><table><tr><td>'+data+'</table></td></tr></td><tr>').insertAfter($button);
			
			});
		    // $abc.prop('disabled', true);
		    $abc.css("visibility","hidden");
		   // $abc.hide();		
		$('.qualifierDelete').find('img').attr('src', deleteImageUrl);
	
	});

	/** 
	 * onclick of riskResponseBtn1 append this tabel
	*/
		
	//nurse unit drop down event
	$(document).on('change', 'select[name=\'interval\']', function(){
		$(this).siblings('select[name=\'unit\']').remove();
		$(this).parent().append("<select class='itemDrop' name='unit'></select>");
		requestUnit($(this).val(), $(this));
	});
   /** 
	 * onclick of sRiskNew append this tabel
	*/
	
	$(document).on('click', '#sRiskNew', function(){
		var $this=$(this).closest('tr');
		var del = "<button class='sRiskDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var input = "<input class='itemInputShort' type='text'></input>";
		var dropDown="<select class='RiskitemDrop' style='width:250px' name='icon'><option value='Icon' >Icon</option><option value='Alert' data-image=" +staticContentLocation +"/images/alert.jpg>Alert</option><option value='Assault Precaution' data-image=" +staticContentLocation +"/images/assault.jpg>Assault Precaution</option><option value='Danger' data-image=" +staticContentLocation +"/images/danger.jpg>Danger</option><option value='Elopement Risk' data-image=" +staticContentLocation +"/images/elopementrisk.png>Elopement Risk</option><option value='Fall Risk' data-image=" +staticContentLocation +"/images/fallrisk.jpg>Fall Risk</option><option value='High Risk' data-image=" +staticContentLocation +"/images/highrisk.png>High Risk</option><option value='Medium Risk' data-image=" +staticContentLocation +"/images/mediumrisk.png>Medium Risk</option><option value='Restraints' data-image=" +staticContentLocation +"/images/restraints.png>Restraints</option><option value='Seizure Risk' data-image=" +staticContentLocation +"/images/seizurerisk.jpg>Seizure Risk</option><option value='Suicide Risk' data-image=" + staticContentLocation +"/images/suiciderisk.jpg>Suicide Risk</option></select>";
		var button = "<img class='sRiskUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='sRiskDown' src='"+staticContentLocation +"/img/6364_down.png'/>";
	    
	
		$("<tr class ='riskPrecaution'><td style='position:inherit;''><table><tbody ><tr><td>"+button+"</td><td>"+input+"</td><td style='position:inherit;'>"+dropDown+"</td><td>"+del+"</td></tr></tbody></table></td></tr>").insertAfter($this);

	 
		$(".RiskitemDrop").msDropdown({roundedBorder:false});
	});

	$(document).on('click', '.sRiskDel', function(){
		$(this).closest('.riskPrecaution').remove();
	});
	
	
	$(document).on('click', '.qualifierDelete', function(e){
		var qualifierBtnDel = $(this).closest('.riskQualifier').parents().eq(8);
		qualifierBtnDel.find('.qualifierResponseBtn1').css("visibility", "visible"); 
		$(this).closest('.riskQualifier').remove();
		
	});

	$(document).on('click', '.sRiskUp', function(){
		var col = $(this).closest('table');
		var row = col.closest('tr');
		 row.insertBefore(row.prev());


	});

	$(document).on('click', '.sRiskDown', function(){
		var col = $(this).closest('table');
		var row = col.closest('tr');
		row.insertAfter(row.next());
	});

	$(document).on('click', '#updateButton',function(){
		if (validateForm() == false ) return false;
		requstUpdate();
	});

	//Default Time Interval Event
	$(document).on('click', '#defaultIntervalNew', function(){
		var html="<tr><td><select class='itemDrop' disabled='disabled'><option>ALL</option></select></td>"
			+"<td><input class='itemInputShort' type='text' onkeypress='if ( isNaN( String.fromCharCode(event.keyCode) )) return false;'></input></td>"
			+"<td><button class='defaultIntervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>";
			$('#defaultIntervalTable').append(html);
	});

	$(document).on('click', '.defaultIntervalDel', function(){
		$(this).closest('tr').remove();
	});
	
	$(document).on('click', '#intervalNew', function(){
		var html="<tr><td><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></td>"
		+"<td><input class='itemInputShort' type='text' onkeypress='if ( isNaN( String.fromCharCode(event.keyCode) )) return false;'></input></td>"
		+"<td><button class='intervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>"
		$('#intervalTable').append(html);
		$('#intervalTable').find('select[name=\'interval\']').last().trigger('change');
	});
			
	$(document).on('click', '.intervalDel', function(){
		$(this).closest('tr').remove();
	});
	

	
	//Patient Status/Acitivty
	$(document).on('click', '#newEventButton', function(){
		var ind=$('.statusListNomenNew').length;
		if( ind<5){
			var url = staticContentLocation+"/html/clinical_event_selection_template.html";
			var html = $.get(url, function(data){
				$(data).appendTo('#eventDiv');
			});
			var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
			$('.statusNomenDeleteNew').last().find('img').attr('src', deleteImageUrl);
			$('.statusListNomenNew').last().find('input:radio').attr('name', 'statusNomenNew'+ind);
		
		var codeSearch93 = new CodeSearch({
			"element": $(".typeahead93")
			,"codeSet": 93
			,"prim_ind" : 1
		});
		var codeSearch72 = new CodeSearch({
			"element": $(".typeahead72")
			,"codeSet": 72
		});
		$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
		$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');
     }	
     });
	
	$(document).on('click', '.statusNomenDeleteNew', function(){
		$(this).closest('div').remove();
	});

	$(document).on('click', '.statusRiskDelete', function(){
		$(this).closest('div').remove();
	});
	
	$(document).on('click', '.obsDeleteNew', function(){
		$(this).closest('div').remove();
	});
	
	//Location Available Nomen Responses Section Event
	$(document).on('click', '#newNomenButton', function(){
		var html ="<div class='nomenItemDiv'><div><button class='deleteButton'><img src='"+staticContentLocation +"/img/4984_16.png'/></button><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></div>";
		$.each(nomenList, function(i, e){
			html+=e.html;
		});
		html+="</div>";
		$('#nomenDiv').append(html);
		$('#nomenDiv').find('select[name=\'interval\']').last().trigger('change');
	});
		//observation level order detail qualifier orderable Event
	$(document).on('click', '#newobservOrderBt', function(){
		var ind=$('.obsListNew').length;
			var url = staticContentLocation+"/html/Observation_Level_Order.html";
			var html = $.get(url, function(data){
				$(data).appendTo('#obserDiv');
			});
			var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
			$('.obsDeleteNew').last().find('img').attr('src', deleteImageUrl);
			$('.obsListNew').last().find('input:radio').attr('name', 'obsNew'+ind);
		var codeSearch200 = new CodeSearch({
			"element": $(".typeahead200")
			,"codeSet": 200
		});
		
		 $('.label_DISPLAY_200').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 200)');
	});
	$(document).on('click', '.addButton', function(){
		addNomen(this);
	});
	
	$(document).on('click', '.removeButton', function(){
		removeNomen(this);
	});
	
	$(document).on('click', '.upButton', function(){
		upNomen(this);
	});
	
	$(document).on('click', '.downButton', function(){
		downNomen(this);
	});
	
	$(document).on('click', '.deleteButton', function(){
		$(this).closest('.nomenItemDiv').remove();
	});
	
	//Default Nomenclatures available for other locations/undefined locations Event
	$(document).on('click', '#defaultNomenNew', function(){
		var del = "<button class='defaultNomenDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var remove = "<button class='defaultNomenRemove'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var button = "<img class='defaultNomenUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='defaultNomenDown' src='"+staticContentLocation +"/img/6364_down.png'/>"
		var add = "<img src='"+	staticContentLocation+"/img/3941_16.png"+"' class='defaultNomenAdd'/>";
		var table = "<table class='defaultNomenWrapper'><tr>	<th></th><th>Display</th><th><button type='button' class='defaultNomenAdd'>"+add+remove+"</button></th></tr><tbody class='defaultNomenTable'>";
		$.each(nomenDefaultList, function(i, e){
			$('#defaultDiv').append(table+"<tr><td>"+button+"</td><td>"+e+"</td><td>"+del+"</td></tr></tbody></table>");
		})
		$('#defaultNomenNew').attr('disabled', true);
	});
	
	$(document).on('click', '.defaultNomenDel', function(){
		$(this).closest('tr').remove();
	});
	
	$(document).on('click', '.defaultNomenRemove', function(){
		$(this).closest('.defaultNomenWrapper').remove();
		if($(".defaultNomenTable").length===0){
			$('#defaultNomenNew').attr('disabled', false);
		}
	});
	
	$(document).on('click', '.defaultNomenAdd', function(){
		var del = "<button class='defaultNomenDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var button = "<img class='defaultNomenUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='defaultNomenDown' src='"+staticContentLocation +"/img/6364_down.png'/>";
		var index = $('.defaultNomenAdd').index( $(this));
		var dropdown = nomenDefaultList[index/2];
		$(this).closest('table').find('.defaultNomenTable').append("<tr><td>"+button+"</td><td>"+dropdown+"</td><td>"+del+"</td></tr>");
	});
	
	$(document).on('click', '.defaultNomenUp', function(){
		var row = $(this).closest('tr');
		row.insertBefore(row.prev());
	});
	
	$(document).on('click', '.defaultNomenDown', function(){
		var row = $(this).closest('tr');
		row.insertAfter(row.next());
	});
	
	//render html of the page
	function render () {
		
		var addImageUrl=staticContentLocation+"/img/3941_16.png";
		var rightImageUrl = staticContentLocation+"/img/6364_right.png";
		var leftImageUrl = staticContentLocation+"/img/6364_left.png";
		var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
		
        var riskUp= staticContentLocation+"/img/6364_up.png" ;
		var riskDown= staticContentLocation+"/img/6364_down.png" ;
		//setup add icon
		$('#sRiskNew').find('img').attr('src', addImageUrl);
		$('#defaultIntervalNew').find('img').attr('src', addImageUrl);
		$('#intervalNew').find('img').attr('src', addImageUrl);
		$('#newNomenButton').find('img').attr('src', addImageUrl);
		$('#newobservOrderBt').find('img').attr('src', addImageUrl);
		$('#defaultNomenNew').find('img').attr('src', addImageUrl);
		$('#newEventButton').find('img').attr('src', addImageUrl); 
		$('#fallRiskEventButton').find('img').attr('src', addImageUrl);
		//setup loctype icon
		$('#locTypeAddButton').attr('src', rightImageUrl);
		$('#locTypeRemoveButton').attr('src', leftImageUrl);
		//setup clinical event icon
		$('.statusNomenDelete').find('img').attr('src', deleteImageUrl);

		//setup label
		//General Clinical Event
		$('.label_EVENT_CD_DISPLAY').attr('title', 'value taken from:  V500_EVENT_CODE.EVENT_CD_DISP');
		$('.label_CONCEPT_CKI_72').attr('title', 'value taken from:  CODE_VALUE.CONCEPT_CKI (CODE_SET = 72)');
		$('.label_EVENT_SET_NAME').attr('title', 'value taken from:  V500_EVENT_SET_CODE.EVENT_SET_NAME');
		$('.label_CONCEPT_CKI_93').attr('title', 'value taken from:  CODE_VALUE.CONCEPT_CKI (CODE_SET = 93)');
		//General Code Value
		$('.label_DESCRIPTION').attr('title', 'value taken from:  CODE_VALUE.DESCRIPTION');
		$('.label_DISPLAY_KEY').attr('title', 'value taken from:  CODE_VALUE.DISLAY_KEY');
		$('.label_DISPLAY').attr('title', 'value taken from:  CODE_VALUE.DISLAY');
		$('.label_CDF_MEANING').attr('title', 'value taken from:  CODE_VALUE.CDF_MEANING');
		//General Orderable
		$('.label_order_Cki').attr('title', 'value taken from:  ORDER_CATALOG.CKI');
		$('.label_order_ccki').attr('title', 'value taken from:  ORDER_CATALOG.CONCEPT_CKI');
		$('.label_order_PRIMARY_MNEMONIC').attr('title', 'value taken from:  ORDER_CATALOG.PRIMARY_MNEMONIC');
		//Xtra
		// $('.label_xtra_meaning').attr('title', 'value taken from: ORDER_DETAIL:OE_FIELD_MEANING');
		// $('.label_xtra_id').attr('title', 'value taken from: ORDER_DETAIL:OE_FIELD_ID');
		//CODE_VALUE
		$('.label_DISPLAY_4').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 4)');
		$('.label_DISPLAY_319').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 319)');
		$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
		$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');	
		$('.label_DISPLAY_200').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 200)');			
		populateInstructions();

		//initialize code search components
		var codeSearch4 = new CodeSearch({
			"element": $(".typeahead4")
			,"codeSet": 4
		});
		var codeSearch319 = new CodeSearch({
			"element": $(".typeahead319")
			,"codeSet": 319
		});
		var codeSearch93 = new CodeSearch({
			"element": $(".typeahead93")
			,"codeSet": 93
			,"prim_ind" : 1
		});
		var codeSearch72 = new CodeSearch({
			"element": $(".typeahead72")
			,"codeSet": 72
		});
		var codeSearch200 = new CodeSearch({
			"element": $(".typeahead200")
			,"codeSet": 200
		});
	}
	
	//render instruction sections
	function populateInstructions(){
		$('#pageText').append("<p>This is the setup page for the Behavioral Health MPage.  For the sections requiring input database fields, hover over the label beside the input box to find more information.  When finished, select the UPDATE button at the bottom of the page.  This will update the BH_SA_SETUP_DATA table, and the changes will be reflected on the Behavioral Health MPage.  Refresh the page to make further changes if needed.<\p>");
		$('#titleText').append("Enter the name you want to be displayed for the title of the Behavioral Health MPage.  If no text is entered, Safety and Attendance MPage will display.");
       	$('#sendRequestBatchText').append("Set the number of clinical events that should be saved in batch format to help performance of the MPage. All clinical events will still be signed and stored. Recommendation is to set it at 25. ");
		$('#loadRequestBatchText').append("When a patient list is loaded, the load should be done in batches to help performance of the page. Select a number of people you wish to immediately load the first time a patient list is pulled in. After those initial people are documented on, the Load More button is available to retrieve the next set of people. The user does not need to Sign the documentation between batches. Information will be retained until the final documentation is done for the entire patient list and then can be signed.  Recommendation is to set it to 10.");
		$('#RetrieveDefaultTimeText').append("Assign a default value for the time interval to be displayed in the Safety and Attendance page whenever the Safety and Attendance page is being refreshed, reloaded or patient list is changed. Default time can be entered in numeric values only and no special characters");
		$('#ptpopText').append("Define the method(s) for the user to choose the patient population used to generate this MPage. The subset of patients in the defined population that meet the qualifying criteria for this MPage will display on the MPage. It is recommended that both Patient List functionality and Facility/Nurse Unit selections are used to provide the user with additional flexibility when selecting a patient population.");
		$('#wtsText').append("Indicate whether you would like to utilize WTS to default the Facility and Nurse Unit selections for the user.");
		$('#defaultPopText').append("Indicate the default patient poplation to display for this MPage.");
		$('#locTypeText').append("Select the locations types that mean nurse unit.");
		$('#linkText').append("The patient's name is a hyperlink which will open a specific tab in the patient chart.  Enter the display name of the tab within PowerChart that you want to be available as a hyperlink from the patient's name in the Patient column.");
		$('#imageText').append("This setting determines if the patients' images will attempt to be loaded from the CAMM system.");
		$('#mrnText').append("Select a code_value that indicates MRN.");
		$('#finText').append("Select a code_value that indicates FIN.");
	    $('#navText').append("This setting determines if the user wants to utilize the tab navigation functionality while charting responses, using patient status/activity events.");
		$('#fallText').append("Define the Risk/Precaution <br> <b>Label –</b>Define the name of the risk <br>Choose one of the three options, Event Code (Code set 72), Event Set (Code Set 93) or Orders Catalog (Code Set 200) where you would like to pull in a Risk or Precaution to display. Select the radial button for one of these three options and enter in the name of the item you wish to pull in the search box and select.<br><b>Risk Qualifier – </b>For Clinical Events from either the Event Code or Event Set, qualifiers can be set to define when the Precaution/Risk will display in the MPage. This does not apply to Orders. <br><b>Risk Response – </b>Add this field if the Risk/Precaution has associated icons to display if the corresponding response is charted for the clinical event or that order is in place on a patient.<br> Note 1: The Risk Response field must be the exact same name as what is entered in the Display Label. Cerner recommends that Label, Display, and Risk Response all are identically named.<br>  <p class='spacing'> 2: For clinical events that have a numeric score response, icons cannot be utilized. You must still enter in a Qualifier Response to ensure the Precaution Label still displays when the clinical event is flagged but no icon will display. </p><br> ");
		$('#fallQuaText').append("The default qualifier to determine if the patient is at risk for a fall is a Morse Fall Risk Score of 45 or greater. This row provides the ability to define the desired value or response.");
		$('#suicideText').append("Select a clinical event that indicates Suicide Risk.  If no event is selected the MPage will use Suicidal Ideation.  The responses and icons are defined in the next section.  Note: Only one of the below identifiers needs to be filled out for the event.");
		$('#suicideIconText').append("There is a row below for each possible response that corresponds with the clinical event defined in Suicide Risk Level Event.  The possible responses display below.  Select an icon for each given response as desired. Select from: Critical Risk Icon (red triangle with exclamation mark in the middle), Medium Risk Icon (yellow triangle with exclamation mark in the middle), and No Icon (no icon displays). Use the up and down arrows to sequence the risk responses.  Sequence the risk responses according to priority based on suicide risk.  For example, the highest suicide risk response should be displayed at the top.");
		$('#obsText').append("Select a clinical event that can be charted on a patient to be displayed as a comment. Once it is charted, it will display until the patient is discharged.<br> Note: This is intended to be an optional piece of information displayed on a patient only if necessary.<br> For example, pulling in comfort measures that have been successful with a patient in de-escalation.");
		$('#statusText').append("Select clinical event(s) for Patient Status/Activity.  Select one event for both coded alpha responses and free text alpha responses. Label will be displayed as the tab text in MPage Dialog. NOTE: This event cd will be used in the \"Available Nomenclature Responses by Location\" and \"Available Nomenclature Responses for Other/Undefined Locations\" section. After changing the value please update before configuring those sections.");
		$('#offText').append("Select a clinical event that indicates Off Unit. Note: Only one of the below identifiers needs to be filled out for the event.");
		$('#obsOrderText').append("<b>Observation Level Orderable:</b><br>Select an orderable that indicates Observation Level. <br>Note: Only one of the below identifiers needs to be filled out for the orderable.<br><b>Observation Level Order Detail Qualifier:</b><br>Select an order detail from the order detail table that corresponds to the observation level orderable defined above.  The order detail will display as the text for Level of Observation.  Note: Only one of the below identifiers needs to be filled out for the order detail");
		// $('#obsQuaText').append("Select an order detail from the order detail table that corresponds to the observation level orderable defined above.  The order detail will display as the text for Level of Observation.  Note: Only one of the below identifiers needs to be filled out for the order detail.");
		$('#defaultIntervalText').append("Define the default time interval options (in minutes) for all nurse units that will display in the drop down in the top right hand corner of the page.  The MPage will convert minutes to hours if the number entered is greater than 59 minutes.   The shortest time interval will default as the time interval for any nurse unit that is not specifically defined in the next section.");
		$('#intervalText').append("Assign a default time interval (in minutes) for each nurse unit. The MPage will convert minutes to hours if the number entered is greater than 59 minutes.");
		$('#nomenText').append("Each nurse unit can be assigned specific responses based on what activities are available in that unit. On the MPage, when the user selects Chart the Activity, the responses defined below will display.  Select from the list on the left and use the arrows between the list to add or remove responses to the list on the right. Use the up and down arrows to sequence the responses in the selected list.");
		$('#defaultNomenText').append("Select the set of responses that should display in the other or undefined locations.  Use the up and down arrows to sequence the responses.");
	    $('#selectText').append("Indicate whether you would like to utilize Select All option. Selecting No will remove this column.");
		$('#selectMulText').append("This setting determines if the user wants to utilize the Multi Select functionality while charting responses, using patient status/activity events.");
	    $('#obsDefaultLabel').append("This field is for your standard level of observation for your site. Enter in a label that defines this level of observation that will display on each patient. If you use orders for Level of Observation and one is placed on a patient, the order will override and display as the Level of Observation instead of the Standard label.");
	}
	
	//load returned data to the page
	function loadData(){
		var mrnId = "0", mrnSet="0", finId="0", fRiskId="0", fRiskSet="0", sRiskId="0", sRiskSet="0", obsId="0", obsSet="0", ptActivityNomenId=[],obsLevelId=[], offId = "0", offSet = "0",riskSet = [];
		var timeInterval = [], nomen = [], defaultNomen = [], defaultTime = [], locType=[];
		
		var list = AjaxHandler.parse_json(preLoadedLocationCodes);
		this.project_name = list.CUST_REC.PROJECT_NAME;
		var AliasCodeList = list.CUST_REC;
		$.each(AliasCodeList.DATA, function(i, v) {
	    if(v.SECTION_NAME === "PAGE_TITLE") {
	        $('#titleInput').val(v.SCRIPT_NAME);
	    }
        else if(v.SECTION_NAME === "BATCHSIZE_TOPROCESS_PATIENTS") {
		
	        $('#loadRequestBatchInput').val(v.SCRIPT_NAME);
			
	    }
        else if(v.SECTION_NAME === "BATCHSIZE_TOSAVE_EVENTS") {
	        $('#sendRequestBatchInput').val(v.SCRIPT_NAME);
	    }
		else if(v.SECTION_NAME === "DEFAULT_TIME") {
	        $('#RetrieveDefaultTime').val(v.SCRIPT_NAME);
	    }
		else if(v.SECTION_NAME === "PATIENT_POPULATION") {
	        if(v.DISP_SEQ===1){
	         	$('#ptpopRadioList').prop('checked', true); 
				$('#wtsDiv').slideDown("slow");
				$('#defaultPopDiv').slideDown("slow");
				$('#locTypeDiv').slideUp("slow");
				$('#defaultPopRadio1').prop("disabled", false);
				$('#defaultPopRadio2').prop("disabled", true);
				$('#defaultPopRadio2').prop("checked", false);
	        }
	        else if(v.DISP_SEQ===2){
	         	$('#ptpopRadioUnit').prop('checked', true); 
				$('#wtsDiv').slideDown("slow");
				$('#defaultPopDiv').slideDown("slow");
				$('#locTypeDiv').slideDown("slow");
				$('#defaultPopRadio1').prop("disabled", true);
				$('#defaultPopRadio2').prop("disabled", false);
				$('#defaultPopRadio1').prop("checked", false);
	        }
	        else if(v.DISP_SEQ===3){
	        	$('#ptpopRadioAll').prop('checked', true);
	        }
	    }
	    else if(v.SECTION_NAME==="LOCTION_TYPE_SELECTION"){
	    	locType.push(v.PARENT_ENTITY_ID);
	    }
	    else if(v.SECTION_NAME === "WTS_LOCATION") {
	        if(v.DISP_SEQ===0){
	        	$('#wtsRadioN').prop('checked', true);
	        	$('defaultPopRadio2').prop('disabled', true);
	        }
	        else if(v.DISP_SEQ===1){
	         	$('#wtsRadioY').prop('checked', true); 
	        	$('defaultPopRadio2').prop('disabled', false);
	        }
	    }
	    else if(v.SECTION_NAME==="DEFAULT_POPULATION"){
	        if(v.DISP_SEQ===1)
	        	$('#defaultPopRadio1').prop('checked', true);
	        else if(v.DISP_SEQ===2)
	         	$('#defaultPopRadio2').prop('checked', true); 
	        else if(v.DISP_SEQ===3)
	         	$('#defaultPopRadio3').prop('checked', true); 
	    }
	    else if(v.SECTION_NAME === "PATIENT_LINK") {
	        $('#linkInput').val(v.SCRIPT_NAME);
	    }
	    else if(v.SECTION_NAME === "PATIENT_IMAGE") {
	        if(v.DISP_SEQ===0)
	        	$('#imageRadioN').prop('checked', true);
	        else if(v.DISP_SEQ===1)
	         	$('#imageRadioY').prop('checked', true);     
	    }
	    else if(v.SECTION_NAME==="MRN"){
	    	if(v.DISP_NAME==="4"){
	    		$('#mrnRadioPerson').attr("checked", true);
	       		$('#mrnInputPerson').attr("code_value", v.PARENT_ENTITY_ID);
	       		$('#mrnInputPerson').attr("title", v.PARENT_ENTITY_ID);
				//$('#mrnInputPerson').attr("display_name",v.LONG_DESC);
	       		$('#mrnInputPerson').attr("disabled", false);
	       		$('#mrnInputEncntr').attr("disabled", true);
	    	}
	    	else if(v.DISP_NAME==="319"){
	    		$('#mrnRadioEncntr').attr("checked", true);
	       		$('#mrnInputEncntr').attr("code_value", v.PARENT_ENTITY_ID);
	       		$('#mrnInputEncntr').attr("title", v.PARENT_ENTITY_ID);
				//$('#mrnInputEncntr').attr("display_name",v.LONG_DESC);
	       		$('#mrnInputEncntr').attr("disabled", false);	       		
	       		$('#mrnInputPerson').attr("disabled", true);
	    	}
    		mrnId=v.PARENT_ENTITY_ID;
       		mrnSet=v.DISP_NAME;
	    }
	    else if(v.SECTION_NAME==="FIN"){
       		$('#finInput').attr("code_value", v.PARENT_ENTITY_ID);
       		$('#finInput').attr("title", v.PARENT_ENTITY_ID);
	        finId = v.PARENT_ENTITY_ID;
	    }
	    else if(v.SECTION_NAME === "TAB_NAVIGATION") {
	        if(v.DISP_SEQ === 0)
	        	$('#navRadioN').prop('checked', true);
	        else if(v.DISP_SEQ === 1)
	         	$('#navRadioY').prop('checked', true);     
	    }	   
		else if(v.SECTION_NAME==="PRECAUTION_EVENT"){
			riskSet.push([v.PARENT_ENTITY_ID, v.COND_FLAG]);
	    	riskLabel.push([v.PARENT_ENTITY_ID, v.SCRIPT_NAME, v.DISP_SEQ]);
			
	    }
	    else if(v.SECTION_NAME === "PRECAUTION_EVENT_QUALIFIER"){
			
	    	sRiskQual.push([v.SCRIPT_NAME,v.DISP_NAME,v.LONG_DESC,v.DISP_SEQ]);
			
	    }	
		else if(v.SECTION_NAME.match(/PRECAUTION_EVENT_RESPONSE/g)){	
	    	sRiskResp.push([v.SCRIPT_NAME,v.DISP_NAME,v.COND_FLAG,v.DISP_SEQ]);	
	    }
		else if(v.SECTION_NAME === "DEFAULT_OBSERVATION_LABEL") {
	        $('#obs_TextId').val(v.SCRIPT_NAME);
	    }
	    else if(v.SECTION_NAME==="OBSERVATION_LEVEL_EVENT" &&v.DATA_TYPE!="ORD"){
	    	obsId=v.PARENT_ENTITY_ID;
	    	if(v.COND_FLAG===93){
	    		$('#obsRadioSet').attr("checked", true);
	       		obsSet=93;
	       		$('#obsInputSet').attr("disabled", false);
	       		$('#obsInputCode').attr("disabled", true);	    		
	    	}
	    	else if(v.COND_FLAG===72){
	    		$('#obsRadioCode').attr("checked", true);
	       		obsSet=72;
	       		$('#obsInputCode').attr("disabled", false);
	       		$('#obsInputSet').attr("disabled", true);	
	    	}
	    }
	    else if(v.SECTION_NAME==="PATIENT_STATUS_ACTIVITY"&&v.DISP_NAME==="NOMENCD"){
	    	ptActivityNomenId.push([v.PARENT_ENTITY_ID, v.COND_FLAG]);
	    	ceLabel.push([v.PARENT_ENTITY_ID, v.SCRIPT_NAME, v.DISP_SEQ]);
	    }		
	    else if(v.SECTION_NAME==="OBSERVATION_LEVEL_ORDERABLE"&&v.DATA_TYPE==="ORD"){    		
			obsLevelId.push([v.PARENT_ENTITY_ID, v.COND_FLAG]);
	    	obsLabel.push([v.PARENT_ENTITY_ID, v.DISP_SEQ, v.DISP_NAME, v.SCRIPT_NAME ]);
	    }
		
	    else if(v.SECTION_NAME==="ORDER_DETAIL"){
	    	$('#obsQua').val(v.LONG_DESC.toString());
	    }
	    else if(v.SECTION_NAME==="ORDER_DETAIL_ID"){
	    	$('#obsQua2').val(v.LONG_DESC.toString());
	    }
	    else if(v.SECTION_NAME==="LOCTION_TIME_INTERVAL"){
			timeInterval.push(v.PARENT_ENTITY_ID);
	 	}
	    else if(v.SECTION_NAME==="DEFAULT_TIME_INTERVAL"){
	    	defaultTime.push(new Array(v.DISP_SEQ, v.SCRIPT_NAME));
	    }
	    else if(v.SECTION_NAME==="LOCATION_NOMEN_RESPONCE"){
	 		nomen.push(v.PARENT_ENTITY_ID);
	 	}
	    else if(v.SECTION_NAME==="OTHER_LOC_NOMEN_RESPONCE"){
	 		defaultNomen.push([v.DISP_NAME, v.SCRIPT_NAME]);
		}
	    else if(v.SECTION_NAME==="OFFUNIT_EVENT_RESPONCE"){
	    	offId=v.PARENT_ENTITY_ID
	    	if(v.COND_FLAG===93){
	    		$('#offRadioSet').attr("checked", true);
	       		offSet=93;
	       		$('#offInputSet').attr("disabled", false);
	       		$('#offInputCode').attr("disabled", true);	    		
	    	}
	    	else if(v.COND_FLAG===72){
	    		$('#offRadioCode').attr("checked", true);
	       		offSet=72;
	       		$('#offInputCode').attr("disabled", false);
	       		$('#offInputSet').attr("disabled", true);	
	    	}
	    }	  
		else if (v.SECTION_NAME === "SELECT_ALL") {
	        if(v.DISP_SEQ === 0)
	        	$('#selectRadioN').prop('checked', true);
	        else if(v.DISP_SEQ === 1)
	         	$('#selectRadioY').prop('checked', true);	           
	    }		
		else if (v.SECTION_NAME === "MULTI_SELECTION") {
		  if(v.DISP_SEQ === 0)
			$('#selectMulRadioN').prop('checked', true);
		  else if(v.DISP_SEQ === 1)
			$('#selectMulRadioY').prop('checked', true);
		}
		//end of testing code
	    return;
		});
		
		$('#obsQuaList :input:text').attr('disabled', 'disabled');
		if($('#obsQua2').val()===""&&$('#obsQua').val()!==""){
			$('#obsQua').removeAttr('disabled');
			$('#obsQuaRadioMeaning').prop('checked', true);
		}
		else{
			$('#obsQua2').removeAttr('disabled');
			$('#obsQuaRadioId').prop('checked', true);		
		}
			
	
		defaultTime.sort(function(a, b){
			return a[0]-b[0];
		});

		loadDefaultInterval(defaultTime);
		defaultNom=defaultNomen;
		locTypeSelected=locType;
		requestNu();
		requestData(mrnId, mrnSet, finId, obsId, obsSet, ptActivityNomenId,riskSet,obsLevelId,  timeInterval, _.uniq(nomen), offId, offSet);
	}
	
	/*
	 * Ajax Request
	 */
	// get data by passing out code_value returned from BH_SA_SETUP_DATA table
	function requestData(mrnId, mrnSet, finId,  obsId, obsSet, ptActivityNomenId,riskSet,obsLevelId,timeInterval, nomen, offId, offSet){
			var	REQ = {
					MRNID: JSON.setCCLFloatNumber(parseFloat(mrnId)),
					MRNSET: JSON.setCCLFloatNumber(parseInt(mrnSet)),
					FINID: JSON.setCCLFloatNumber(parseFloat(finId)),
					OBSID : JSON.setCCLFloatNumber(parseFloat(obsId)),
					OBSSET: JSON.setCCLFloatNumber(parseInt(obsSet)),
					PTACTIVITYNOMENID: [],
					OBSLEVELID: [],
					INTERVAL: [],
					NOMEN: [],
					RISKSET: [],
					OFFID : JSON.setCCLFloatNumber(parseFloat(offId)),
					OFFSET : JSON.setCCLFloatNumber(parseInt(offSet))
				};
			for(var i=0; i<timeInterval.length; i++){
				REQ.INTERVAL[i]={
					CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(timeInterval[i]))
				}
			}
			for(var i=0; i<nomen.length; i++){
				REQ.NOMEN[i]={
					CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(nomen[i]))
				}
			}
			
			for(var i=0; i<ptActivityNomenId.length; i++){
				REQ.PTACTIVITYNOMENID[i]={
						CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(ptActivityNomenId[i][0])),
						CODE_SET: JSON.setCCLFloatNumber(parseInt(ptActivityNomenId[i][1]))
					}
			}
			
	        for(var i=0; i<riskSet.length; i++){
				REQ.RISKSET[i]={
						CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(riskSet[i][0])),
						CODE_SET: JSON.setCCLFloatNumber(parseInt(riskSet[i][1]))
					}
			}
			
			
			for(var i=0; i<obsLevelId.length; i++){
				REQ.OBSLEVELID[i]={
						CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(obsLevelId[i][0])),
						CODE_SET: JSON.setCCLFloatNumber(parseInt(obsLevelId[i][1]))
					}
			}
	
			var mpreq = JSON.stringify(REQ);
					// alert("mpreq:"+mpreq);
			var path = "dc_mp_bhv_hlth_setup_get_data", params = "^MINE^," + "^{\"MPREQ\":" + mpreq + "}^" + ",^" + this.project_name + "^";
			json_handler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : path,
					parameters : params
				},
	
				response : {
					type : "JSON",
					target : receiveReply,
					parameters : ["t", 1]
				}
			});
			//alert("receiveReply:"+receiveReply);
	}
	
	//get nurse unit
	function requestNu(){
		var path = "dc_mp_bhv_hlth_setup_get_nu", params = "^MINE^" + ",^" + this.project_name + "^";
		json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : receiveReply,
				parameters : ["t", 1]
			}
		});
	}
	
	//get nomen options
	function requestNomen(param){
			var	REQ = {
					PARAM:JSON.setCCLFloatNumber(parseFloat(param))
				};
	
			var mpreq = JSON.stringify(REQ);
				
			var path = "dc_mp_bhv_hlth_setup_get_nomen", params = "^MINE^," + "^{\"MPREQ\":" + mpreq + "}^" + ",^" + this.project_name + "^";
			json_handler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : path,
					parameters : params
				},
				response : {
					type : "JSON",
					target : receiveReply,
					parameters : ["t", 1]
				}
			});
			//alert("receiveReply in get nomen:"+receiveReply);
	}
	
	//request to update the BH_SA_SETUP_DATA table
	function requstUpdate(){
		var mpreq = getUpdateReuqest();
		if(mpreq)
		{
		var path = "dc_mp_bhv_hlth_setup_post_data", params = "^MINE^" + ",^" + this.project_name + "^", blobIn="{\"CSV\":" + mpreq + "}";
		$('#updateButton').html("UPDATING......");
		json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params,
				blobIn : blobIn
			},
			response : {
				type : "JSON",
				target : receiveReply,
				parameters : ["t", 1]
			}
		});
	  }
	}
	
	//request nurse unit in facility
	function requestUnit(code_value, element){
		var NeedAssignmentList = locationCodesToAssign;
		
		var options = "";
		var dropdown = element.siblings('select[name=\'unit\']');
		_.find(NeedAssignmentList.LOCATION, function(location){
			if(location.CODE_VALUE==code_value){
				$.each(location.UNIT, function(i, e){
					if(i===0){
						options+="<optgroup label='"+e.LOCATIONCDFMEANING+"'>";
					}
					else if(e.LOCATIONCDFMEANING!=location.UNIT[i-1].LOCATIONCDFMEANING){
						options+="<optgroup label='"+e.LOCATIONCDFMEANING+"'>";
					}
					options+=("<option value='"+e.LOCATIONCD+"' title='"+e.LOCATIONDISP+"'>"+e.LOCATIONDISP+"</option>");
				});
			}
		})
		dropdown.append(options);
	}
	
	//get Update Request JSON object
	function getUpdateReuqest(){
		var projectCnt = 2;
		var xtraCnt = 5;
		var hypCnt = 7;
		var ceCnt = 9;
		var codeCnt = 9;
		var ordCnt = 9;
		var flagVar=1;
		var csv = {
			rowCnt : 0,
			row : []
		};
		//project name
		csv.row[csv.rowCnt] = {
			fieldCnt: projectCnt,
			field: [{"value": "PROJECT"}
			,{"value":this.project_name}]
		};
		csv.rowCnt++;
		
			//Observation Level Orderable
		
	$.each($('.observationDiv'), function(i, v){

		var codeValue= $(v).find(".obsOrderInput").attr("code_value");
		var labelName= $(v).find(".obsOrderInput").attr("value");
		
		
	     if(codeValue==='' && labelName!=='')
		 {
			  alert("OBSERVATION_LEVEL_ORDERABLE Code value missing for " +labelName+ " Event");
		 	 flagVar=0;  // Flag Variable to have control over Codeset Values.
		  }
         else{
			 	csv.row[csv.rowCnt] = {
					fieldCnt: ceCnt,
					field: [{"value": "ORDCD"}
					,{"value": "200"}
					,{"value":"OBSERVATION_LEVEL_ORDERABLE"}
					,{"value": $(v).find(".obsOrderInput").attr("code_value")+".0"} //$("#obsOrderInput").attr("code_value")
					,{"value": (i+1).toString()}
					,{"value": $(v).find(".obsListNew :input:radio:checked").attr("value")}
					,{"value": "1"}
					,{"value": "XX"}
					,{"value": $(v).find(".obsListNew :input:radio:checked").closest('tr').find("input:text").val()}]
				};
				csv.rowCnt++;
		    }		 
		});
		
		
		
		//Page Title
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"PAGE_TITLE"}
			,{"value": $('#titleInput').val()}
			,{"value": ""}]
		};
		csv.rowCnt++;

		//Patient Population
		var ptpopInd = "3";
		if($("#ptpopRadioList").attr("checked")==="checked")
			ptpopInd = "1";
		else if($("#ptpopRadioUnit").attr("checked")==="checked")
			ptpopInd = "2";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value": ptpopInd}
			,{"value":"PATIENT_POPULATION"}
			,{"value": "PTPOP"}
			,{"value": ptpopInd}]
		};
		csv.rowCnt++;
		
		var option = $('.ptpopRadio:checked').attr("value");
		
		//Patient List Option
		if(option==="1"){
			//WTS Location
			var wtsInd = "1";
			if($("#wtsRadioN").attr("checked")==="checked")
				wtsInd = "0";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": wtsInd}
				,{"value":"WTS_LOCATION"}
				,{"value": "WTS"}
				,{"value": wtsInd}]
			};
			csv.rowCnt++;
			//Default Population
			var defaultPopInd = "3";
			if($("#defaultPopRadio1").attr("checked")==="checked")
				defaultPopInd = "1";
			else if($("#defaultPopRadio2").attr("checked")==="checked")
				defaultPopInd = "2";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": defaultPopInd}
				,{"value":"DEFAULT_POPULATION"}
				,{"value": "DEFAULTPOP"}
				,{"value": defaultPopInd}]
			};
			csv.rowCnt++;
		}
		//Facility Nurse Unit Option
		else if(option==="2"||option==="3"){
			//WTS Location
			var wtsInd = "1";
			if($("#wtsRadioN").attr("checked")==="checked")
				wtsInd = "0";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": wtsInd}
				,{"value":"WTS_LOCATION"}
				,{"value": "WTS"}
				,{"value": wtsInd}]
			};
			csv.rowCnt++;
			//Default Population
			var defaultPopInd = "3";
			if($("#defaultPopRadio1").attr("checked")==="checked")
				defaultPopInd = "1";
			else if($("#defaultPopRadio2").attr("checked")==="checked")
				defaultPopInd = "2";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": defaultPopInd}
				,{"value":"DEFAULT_POPULATION"}
				,{"value": "DEFAULTPOP"}
				,{"value": defaultPopInd}]
			};
			csv.rowCnt++;
			//Location Type Selection
			$('#locTypeDiv').find('select[name=\'locTypeSelectedlList\'] option').each(function(m, n){
				csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "LOCTION_TYPE_SELECTION"}
				,{"value": "CODE_VALUE"}
				,{"value": "222"}
				,{"value": $(n).attr("value")+".0"}
				,{"value": (m+1).toString()}
				,{"value": ""}
				,{"value": $(n).text()}
				,{"value": $(n).attr("value")+".0"}
				]
			}
			csv.rowCnt++;
			});
		}

		//Patient Link
		csv.row[csv.rowCnt] = {
			fieldCnt: hypCnt,
			field: [{"value": "HYP"}
			,{"value":"7"}
			,{"value":"PATIENT_LINK"}
			,{"value": "PCTABNAME"}
			,{"value": "Patient Link"}
			,{"value": $('#linkInput').val()}
			,{"value": "YY"}]
		};
		csv.rowCnt++;
		//Patient Image
		var imageInd = "0";
		if($("#imageRadioY").attr("checked")==="checked")
			imageInd = "1";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value": imageInd}
			,{"value":"PATIENT_IMAGE"}
			,{"value": "SHOWIMAGE"}
			,{"value": imageInd}]
		};
		csv.rowCnt++;
		//MRN
		
		var codeValue= $("#mrnList :input:radio:checked").closest('tr').find("input:text").attr("code_value");
		var mrnLabel= $("#mrnList :input:radio:checked").closest('tr').find("input:text").attr("value");
		if(codeValue==='' && mrnLabel!=='' ){
			 alert("MRN Code value missing for "+mrnLabel+" event");
		 	 flagVar=0;  // Flag Variable to have control over Codeset Values.
		}
		
		else{
			 	//MRN
		csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "MRN"}
				,{"value": "CODE_VALUE"}
				,{"value": $("#mrnList :input:radio:checked").attr("value")}
				,{"value": $("#mrnList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
				,{"value": "1"}
				,{"value": ""}
				,{"value": "MRN"}
				,{"value": $("#mrnList :input:radio:checked").attr("value")}
				]
			}
			csv.rowCnt++;
		    }	
		//FIN
		var finCodeValue= $('#finInput').attr("code_value");
		var finLabel= $('#finInput').attr("value");
		
		if(finCodeValue==='' && finLabel!=='' ){
	     	alert("FIN Code_Set 319 is missing for "+finLabel+" Event");
			flagVar=0;  // Flag Variable to have control over Codeset Values.
		}
		else{
				csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "FIN"}
				,{"value": "CODE_VALUE"}
				,{"value": "319"}
				,{"value": $('#finInput').attr("code_value")+".0"}
				,{"value": "1"}
				,{"value": ""}
				,{"value": "FIN"}
				,{"value": $('#finInput').attr("code_value")+".0"}
				]
			}
			csv.rowCnt++;
		}
		//Tab navigation
		var navInd = "0";
		if($("#navRadioY").attr("checked")==="checked")
			navInd = "1";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value": navInd}
			,{"value":"TAB_NAVIGATION"}
			,{"value": "NAV"}
			,{"value": navInd}]
		};
		csv.rowCnt++;

        // Default observation Label
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"DEFAULT_OBSERVATION_LABEL"}
			,{"value": $('#obs_TextId').val()}
			,{"value": ""}]
		};
		csv.rowCnt++;
		
		//Observation Level Event
		var commentCodeValue= $("#obsList :input:radio:checked").closest('tr').find("input:text").attr("code_value");
		var commentLabel= $("#obsList :input:radio:checked").closest('tr').find("input:text").attr("value");
		var codeSetValue= $("#obsList :input:radio:checked").attr("value");
		if(commentCodeValue===''&& commentLabel!=='')
		 {
			alert("Observation Level Event code-set "+codeSetValue+ " is missing for "+commentLabel+" Event");
		    flagVar=0;  // Flag Variable to have control over Codeset Values.
		 }
		else{
			csv.row[csv.rowCnt] = {
			fieldCnt: ceCnt,
			field: [{"value": "CECD"+$("#obsList :input:radio:checked").attr("value")}
			,{"value": $("#obsList :input:radio:checked").attr("value")}
			,{"value": "OBSERVATION_LEVEL_EVENT"}
			,{"value": $("#obsList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
			,{"value": "1"}
			,{"value": "OBSERVATION_LEVEL_EVENT"}
			,{"value": "1"}
			,{"value": "XX"}
			,{"value": "OBSERVATION_LEVEL_EVENT"}]
		};
		  csv.rowCnt++;
	 }
		//Patient Status/Activity NOMENCLATURE
		$.each($('.eventListDiv'), function(i, v){
		
		var clnCodeValue= $(v).find(".statusListNomenNew :input:radio:checked").closest('tr').find("input:text").attr("code_value");
		var clnLabel= $(v).find(".statusListNomenNew :input:radio:checked").closest('tr').find("input:text").attr("value");
		var clnValue= $(v).find(".statusListNomenNew :input:radio:checked").attr("value");
			if(clnCodeValue==='' && clnLabel!=='')
			{
			alert("Patient Status/Activity code-set "+clnValue+ " is missing for "+clnLabel+" Event");
		    flagVar=0;  // Flag Variable to have control over Codeset Values.
			}
			
			else{
			csv.row[csv.rowCnt] = {
					fieldCnt: ceCnt,
					field: [{"value": "CECD"+$(v).find(".statusListNomenNew :input:radio:checked").attr("value")}
					,{"value": $(v).find(".statusListNomenNew :input:radio:checked").attr("value")}
					,{"value":"PATIENT_STATUS_ACTIVITY"}
					,{"value":$(v).find(".statusListNomenNew :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
					,{"value": (i+1).toString()}
					,{"value": "NOMENCD"}
					,{"value": "1"}
					,{"value": "XX"}
					,{"value": $(v).find('.statusLabelNew').val()}]
				};
				csv.rowCnt++;
			}
		});

	
		//Off Unit Event
		
		var offUnitCodeValue= $("#offList :input:radio:checked").closest('tr').find("input:text").attr("code_value");
		var offUnitLabel= $("#offList :input:radio:checked").closest('tr').find("input:text").attr("value");
		var offUnitValue= $("#offList :input:radio:checked").attr("value");
		if(offUnitCodeValue==='' && offUnitLabel!=='')
		{
			alert("Off Unit Event "+offUnitValue+ " is missing for "+offUnitLabel+" Event");
		    flagVar=0;  // Flag Variable to have control over Codeset Values.
		}
		else{
		csv.row[csv.rowCnt] = {
			fieldCnt: ceCnt,
			field: [{"value": "CECD"+$("#offList :input:radio:checked").attr("value")}
			,{"value": $("#offList :input:radio:checked").attr("value")}
			,{"value":"OFFUNIT_EVENT_RESPONCE"}
			,{"value":$("#offList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
			,{"value": "1"}
			,{"value": "OFFUNIT"}
			,{"value": "1"}
			,{"value": "XX"}
			,{"value": "Off Unit Event"}]
		};
		csv.rowCnt++;
	 }

	//Select All
		var selectAllPat = "0";
		if($("#selectRadioY").attr("checked")==="checked")
			selectAllPat = "1";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value": selectAllPat}
			,{"value":"SELECT_ALL"}
			,{"value": "SELECTALLPATIENT"}
			,{"value": selectAllPat}]
		};
		csv.rowCnt++;
		
	//Select Multiple
      var selectMulPat = "0";
      if($("#selectMulRadioY").attr("checked")==="checked")
        selectMulPat = "1";
      csv.row[csv.rowCnt] = {
        fieldCnt: xtraCnt,
        field: [{"value": "XTRA"}
        ,{"value": selectMulPat}
        ,{"value":"MULTI_SELECTION"}
        ,{"value": "SELECTMULPATIENT"}
        ,{"value": selectMulPat}]
      };
      csv.rowCnt++;
		
		//Default Time Interval
		$('#defaultIntervalTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field:[{"value": "XTRA"}
			,{"value": (i+1).toString()}
			,{"value": "DEFAULT_TIME_INTERVAL"}
			,{"value": $(v).find('input').attr("value")}
			,{"value": "Default Time Interval Documented "}
			]
		}
		csv.rowCnt++;
		});
		
		$('#intervalTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
			fieldCnt: codeCnt,
			field:[{"value": "CODE"}
			,{"value": "LOCTION_TIME_INTERVAL"}
			,{"value": "CODE_VALUE"}
			,{"value": "220"}
			,{"value": $(v).find('select[name=\'unit\']').attr("value")+".0"}
			,{"value": (i+1).toString()}
			,{"value": ""}
			,{"value": $(v).find('select[name=\'unit\']').attr("value")+".0"}
			,{"value": $(v).find('input').attr("value")}
			]
		}
		csv.rowCnt++;
		
		
			});
		
		
		
		//Location Available Nomen Responses Section
		$('#nomenDiv div').each(function(i, v){
			$(v).find('select[name=\'selectedNomen\'] option').each(function(m, n){
				csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "LOCATION_NOMEN_RESPONCE"}
				,{"value": "CODE_VALUE"}
				,{"value": "220"}
				,{"value": $(v).find('select[name=\'unit\']').attr("value").replace(/\s$/,"")+".0"}
				,{"value": (m+1).toString()}
				,{"value": $(n).attr("code_value")+".0"}
				,{"value": $(n).text()}
				,{"value": $(n).attr("value").replace(/\s$/,"")+".0"}
				]
			}
			csv.rowCnt++;
			});
		});
	
		//Default Nomenclatures available for other locations/undefined locations
		$('.defaultNomenTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": (i+1).toString()}
				,{"value": "OTHER_LOC_NOMEN_RESPONCE"}
				,{"value": $(v).find('select option:selected').attr("code_value")}
				,{"value": $(v).find('select').attr("value")}
				]
			}
			csv.rowCnt++;
		});
		
		// send batch size
	csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"BATCHSIZE_TOSAVE_EVENTS"}
			,{"value": $('#sendRequestBatchInput').val()}
			,{"value": ""}
			]
		};
		csv.rowCnt++;	
    // load batch size
	csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"BATCHSIZE_TOPROCESS_PATIENTS"}
			,{"value": $('#loadRequestBatchInput').val()}
			,{"value": ""}]
		};
		csv.rowCnt++;	
		
	//default time 
	csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"DEFAULT_TIME"}
			,{"value": $('#RetrieveDefaultTime').val()}
			,{"value": ""}]
		};
		csv.rowCnt++;	
		
		
		
		
		
		//Risk Event {precaution}
		$.each($('.riskList'), function(i, v){
			
		var riskCodeValue= $(v).find(".multipleRiskList .riskResponse :input:radio:checked").closest('tr').find("input:text").attr("code_value");
		var riskLabel=$(v).find(".multipleRiskList .riskResponse :input:radio:checked").closest('tr').find("input:text").attr("value");
		var riskCdSet= $(v).find(".multipleRiskList .riskResponse :input:radio:checked").attr("value");
		
		if(riskCodeValue==='' && riskLabel!=='')
		{
			alert("Precaution Level Event code-set "+riskCdSet+ " is missing for "+riskLabel+" Event");
		    flagVar=0;  // Flag Variable to have control over Codeset Values.
		}
		
		else{
			
			//alert("in risk");
		    csv.row[csv.rowCnt] = {
					fieldCnt: ceCnt,
					field: [{"value": "CECD"+$(v).find(".multipleRiskList .riskResponse :input:radio:checked").attr("value")}
					,{"value": $(v).find(".multipleRiskList .riskResponse :input:radio:checked").attr("value")}
					,{"value":"PRECAUTION_EVENT"}
					,{"value":$(v).find(".multipleRiskList .riskResponse :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
					,{"value": (i+1).toString()}
					,{"value": "RISK_EVENT"}
					,{"value": "1"}
					,{"value": "RISKL"}
					,{"value": $(v).find('.riskLabel').val()}]
				};
				
		    csv.rowCnt++;
		    csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt+1,
			field: [{"value": "XTRA"}
			,{"value": (i+1).toString()}
			,{"value": "PRECAUTION_EVENT_QUALIFIER"}
			,{"value": $(v).find("#fallSignDrop option:selected").attr("value")}
			,{"value": $(v).find("#fallTypeDrop option:selected").attr("value")}
			,{"value": $(v).find("#fallScoreInput").attr("value")}]
		    };
	        csv.rowCnt++;
			
	        $(v).find('.riskPrecaution').each(function(j, v){
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt+1,
				field: [{"value": "XTRA"}
				,{"value": (i+1).toString()}
				,{"value": "PRECAUTION_EVENT_RESPONSE" + (j+1).toString()}
				,{"value": $(v).find('input').attr("value")}
				,{"value": $(v).find('select').attr("value")}
				,{"value": (j+1).toString()}
				]
			};
			csv.rowCnt++;
		    });
		
		   }
		});	
		
		
		if(flagVar){
		return JSON.stringify(csv);
		}
		else{
			return;
		}
	}
	
	//render default time interval section
	function loadDefaultInterval(list){
		$.each(list, function(i, e){
			var html="<tr><td><select class='itemDrop' disabled='disabled'><option>ALL</option></select></td>"
			+"<td><input class='itemInputShort' type='text' value="+e[1]+"></input></td>"
			+"<td><button class='defaultIntervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>";
			$('#defaultIntervalTable').append(html);
		});
	}
	
	//render default nomen section
	function loadDefaultNomen(list, ce_id){
		list = _.filter(list, function(e){
			return e[1]===ce_id.toString();
		});
		
		var del = "<button class='defaultNomenDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var remove = "<button class='defaultNomenRemove'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var button = "<img class='defaultNomenUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='defaultNomenDown' src='"+staticContentLocation +"/img/6364_down.png'/>"
		var add = "<img src='"+	staticContentLocation+"/img/3941_16.png"+"' class='defaultNomenAdd'/>";
		var table = "<table class='defaultNomenWrapper'><tr>	<th></th><th>Display</th><th><button type='button' class='defaultNomenAdd'>"+add+remove+"</button></th></tr><tbody class='defaultNomenTable'></tbody></table>";
		$('#defaultDiv').append(table);
		$.each(list, function(i, e){
					var row ="<tr><td>"+button+"</td><td>"+_.last(nomenDefaultList)+"</td><td>"+del+"</td></tr>";
					$('.defaultNomenTable').last().append(row);
					$('.defaultNomenTable select[name=\'nomenDefault\']').last().val(e[0]);
		})
		$('#defaultNomenNew').attr('disabled', true);
	}
	
	//load location drop down list
	function loadLocationList(){
		//var AliasCodeList = AjaxHandler.parse_json(locationCodesToAssign);
		var NeedAssignmentList = locationCodesToAssign;
		var html="";
		for(var i=0; i<NeedAssignmentList.LOCATION_CNT; i++){
			try{
				if(NeedAssignmentList.LOCATION[i].UNIT.length!==0){
					var disp = NeedAssignmentList.LOCATION[i].PARENT_ENTITY_ID_DISP;
					var dispkey=NeedAssignmentList.LOCATION[i].DISP_KEY;
					var dispname=NeedAssignmentList.LOCATION[i].DISP_NAME;
					var code_value = NeedAssignmentList.LOCATION[i].CODE_VALUE;
					if(i===0){
						html+="<optgroup label='"+dispname+"'>";
					}
					else if(NeedAssignmentList.LOCATION[i].DISP_NAME!=NeedAssignmentList.LOCATION[i-1].DISP_NAME){
						html+="<optgroup label='"+dispname+"'>";
					}
					html+="<option value='"+code_value+"' title='"+disp+"'>"+disp+"</option>"
				}
			}
			catch( err ){
			}
		}
		return html;
	}
	

	 
	//ajax request reply handler
	function receiveReply(json_response) {
		//reply from requestData
		if(json_response.response.CVREPLY){
			var responseText = json_response.response.CVREPLY;
			locationCodesToAssign = json_response.response.CVREPLY;
			//nomen location
			nomenResponse=responseText.NOMEN;
			
			// alert("responseText:"+JSON.stringify(responseText));
			//MRN
			$("#mrnList :input:radio:checked").closest('tr').find("input:text").val(responseText.MRN_DISPLAY);
			//FIN
			$('#finInput').val(responseText.FIN_DISPLAY);
			

			//Observation Level Event
			$("#obsList :input:radio:checked").closest('tr').find("input:text").val(responseText.OBSEVT.EVENT_CD_DISPLAY);
			$("#obsList :input:radio:checked").closest('tr').find("input:text").attr("code_value", responseText.OBSEVT.CODE_VALUE);
       		$("#obsList :input:radio:checked").closest('tr').find("input:text").attr("title", responseText.OBSEVT.CODE_VALUE);

			//Off Unit Event
			$("#offList :input:radio:checked").closest('tr').find("input:text").val(responseText.OFFEVT.EVENT_CD_DISPLAY);
			$("#offList :input:radio:checked").closest('tr').find("input:text").attr("code_value", responseText.OFFEVT.CODE_VALUE);
       		$("#offList :input:radio:checked").closest('tr').find("input:text").attr("title", responseText.OFFEVT.CODE_VALUE);

			//Patient Status/Activity NOMENCLATURE
			var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
			var addImageUrl = staticContentLocation+"/img/3941_16.png";
			
			$.each(ceLabel, function(i, e){
				
				_.each(responseText.PTACTIVITYNOMEN, function(ce){					
						
						if(e[0]===ce.EVENT_CD){
							
							var ind=$('.statusListNomenNew').length;
							var url = staticContentLocation+"/html/clinical_event_selection_template.html";
							var html = $.get(url, function(data){
								$(data).appendTo('#eventDiv');
							});
							$('.statusNomenDeleteNew').last().find('img').attr('src', deleteImageUrl);
							$('.statusListNomenNew').last().find('input:radio').attr('name', 'statusNomenNew'+ind);
							
							$('.statusLabelNew').last().val(e[1]);
							
							if(ce.CODE_SET===93){
								$('.statusRadioNomenSetNew').last().attr("checked", true);
								$('.statusInputNomenSetNew').last().attr("code_value", ce.CODE_VALUE);
								$('.statusInputNomenSetNew').last().attr("title", ce.CODE_VALUE);
								$('.statusInputNomenSetNew').last().attr("disabled", false);
								$('.statusInputNomenCodeNew').last().attr("disabled", true);	    		
							}
							else if(ce.CODE_SET===72){
								$('.statusRadioNomenCodeNew').last().attr("checked", true);
								$('.statusInputNomenCodeNew').last().attr("code_value", ce.CODE_VALUE);
								$('.statusInputNomenCodeNew').last().attr("title", ce.CODE_VALUE);
								$('.statusInputNomenCodeNew').last().attr("disabled", false);
								$('.statusInputNomenSetNew').last().attr("disabled", true);	
							}
							$(".statusListNomenNew").last().find(":input:radio:checked").closest('tr').find("input:text").val(ce.EVENT_CD_DISPLAY);
							var param = ce.EVENT_CD;
							requestNomen(param);
						}
					})
		    	
			});
			
			var codeSearch93 = new CodeSearch({
				"element": $(".typeahead93")
				,"codeSet": 93
				,"prim_ind" : 1
			});
			var codeSearch72 = new CodeSearch({
				"element": $(".typeahead72")
				,"codeSet": 72
			});
			$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
			$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');
			
			

			//RIsk Response
			
				$.each(riskLabel, function(i, e){
				var ind=$('.multipleRiskList').length;
					var url = staticContentLocation+"/html/precaution_event.html";
					var html = $.get(url, function(data){
				                $(data).appendTo('#Fallriskdiv');
			                   });
							   
					//setTimeout(function(){
						
			        $('.statusRiskDelete').last().find('img').attr('src', deleteImageUrl);
					 
					
					$('.qualifierResponseBtn1').last().find('img').attr('src', addImageUrl);
					$('.riskResponseBtn1').last().find('img').attr('src', addImageUrl);
					$('.multipleRiskList').last().find('input:radio').attr('name', 'riskStatus'+ind);
					
				   _.each(responseText.RISKSET, function(ce){					
				
						if(e[0]===ce.EVENT_CD){
							$('.riskLabel').last().val(e[1]);
						   if(ce.CODE_SET===93){
								$('.statusRadioRiskSet').last().attr("checked", true);
								$('.statusInputRiskSet').last().attr("code_value", ce.CODE_VALUE);
								$('.statusInputRiskSet').last().attr("title", ce.CODE_VALUE);
								$('.statusInputRiskSet').last().attr("disabled", false);
								
								$('.statusInputRiskItem').last().attr("disabled", true);
								$('.statusInputRiskItem200').last().attr("disabled", true);								
							}
							else if(ce.CODE_SET===72){
								$('.statusRadioRiskcode').last().attr("checked", true);
								$('.statusInputRiskItem').last().attr("code_value", ce.CODE_VALUE);
								$('.statusInputRiskItem').last().attr("title", ce.CODE_VALUE);
								$('.statusInputRiskItem').last().attr("disabled", false);
								
								$('.statusInputRiskSet').last().attr("disabled", true);	
								$('.statusInputRiskItem200').last().attr("disabled", true);	
							}
							else if(ce.CODE_SET===200){
								$('.statusRadioCodeset200').last().attr("checked", true);
								$('.statusInputRiskItem200').last().attr("code_value", ce.CODE_VALUE);
								$('.statusInputRiskItem200').last().attr("title", ce.CODE_VALUE);
								$('.statusInputRiskItem200').last().attr("disabled", false);
								
								
								$('.statusInputRiskSet').last().attr("disabled", true);	
								$('.statusInputRiskItem').last().attr("disabled", true);
							}
							$(".multipleRiskList").last().find(":input:radio:checked").closest('tr').find("input:text").val(ce.EVENT_CD_DISPLAY);
							
							
						}
					});				
					
		//  populating qulaifier

					$.each(sRiskQual, function(i, q){ 
					  if(q[3]==e[2]) {	
					  var url = staticContentLocation+"/html/risk_qualifier-response.html";
					  var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
					  var html = $.get(url, function(data){
					  $('.qualifierResponseBtn1').last().css("visibility", "hidden");
					  $('.QualifierDivTr').last().append('<tr><td><table><tr><td>'+data+'</table></td></tr></td><tr>');
					  $('.qualifierDelete').last().find('img').attr('src', deleteImageUrl);
					  
						});
						//setTimeout(function(){
						$('.fallSignDrop').last().val(q[0]);
						$('.fallTypeDrop').last().val(q[1]);
						$('.fallScoreInput').last().val(q[2]);
                       //  }, 10);  						
					}
						
					});	
					
					_.each(responseText.RISKSET, function(ce){
						if(e[0]===ce.EVENT_CD){
						if(ce.CODE_SET===200){
						 $('.qualifierResponseBtn1').last().css("visibility", "hidden");		
						}
						}
					});

              					
			  
		// populating risk responce 
			 $.each(sRiskResp, function(i, qr){ 
			    if(qr[3]==e[2]){
				var dd= qr[0];
				var cc= qr[1];
				var del = "<button class='sRiskDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
				var input = "<input class='itemInputShort trailTd' type='text' value='"+dd+"'></input>";
				var dropDown="<select class='RiskitemDrop' style='width:250px;position:inherit;' name='icon'><option value='Icon' >Icon</option><option value='Alert' data-image=" +staticContentLocation +"/images/alert.jpg>Alert</option><option value='Assault Precaution' data-image=" +staticContentLocation +"/images/assault.jpg>Assault Precaution</option><option value='Danger' data-image=" +staticContentLocation +"/images/danger.jpg>Danger</option><option value='Elopement Risk' data-image=" +staticContentLocation +"/images/elopementrisk.png>Elopement Risk</option><option value='Fall Risk' data-image=" +staticContentLocation +"/images/fallrisk.jpg>Fall Risk</option><option value='High Risk' data-image=" +staticContentLocation +"/images/highrisk.png>High Risk</option><option value='Medium Risk' data-image=" +staticContentLocation +"/images/mediumrisk.png>Medium Risk</option><option value='Restraints' data-image=" +staticContentLocation +"/images/restraints.png>Restraints</option><option value='Seizure Risk' data-image=" +staticContentLocation +"/images/seizurerisk.jpg>Seizure Risk</option><option value='Suicide Risk' data-image=" + staticContentLocation +"/images/suiciderisk.jpg>Suicide Risk</option></select>";
		        var button = "<img class='sRiskUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='sRiskDown' src='"+staticContentLocation +"/img/6364_down.png'/>";
				$('.riskResponseBtn1').last().closest('table').append("<tr class = 'riskPrecaution'><td><table><tbody><tr><td>"+button+"</td><td>"+input+"</td><td style='position:inherit;'>"+dropDown+"</td><td>"+del+"</td></tr></tbody></table></td></tr>");			   
			  
				
				  $('.RiskitemDrop').last().val(cc);
				  $(".RiskitemDrop").last().msDropdown({roundedBorder:false});
			    // setTimeout(function(){
				// for(var j=0; i<sRiskResp.length; j++){ 
			      //$('.RiskitemDrop').last().val(sRiskResp[i][1]);
			      //$(".RiskitemDrop").last().msDropdown({roundedBorder:false});
				// }
			    //}, 10);    
			   }
		     });
			 

			 
//}, 10);
			 
      });
	  
	    var codeSearch93 = new CodeSearch({
			"element": $(".typeahead93")
			,"codeSet": 93
			,"prim_ind" : 1
		});
		var codeSearch72 = new CodeSearch({
			"element": $(".typeahead72")
			,"codeSet": 72
		});
		var codeSearch200 = new CodeSearch({
			"element": $(".typeahead200")
			,"codeSet": 200
		});
		
		$('.label_DISPLAY_200').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 200)');			
		$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
		$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');
		
		
			
			//Observation Level Orderable
			//$('#obsOrderInput').val(responseText.OBSORDDISPLAY);
			
			$.each( obsLabel, function(i, obs){
				var ind=$('.obsListNew').length;
				var url = staticContentLocation+"/html/Observation_Level_Order.html";
				var html = $.get(url, function(data){
					$(data).appendTo('#obserDiv');
				});
				var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
				$('.obsDeleteNew').last().find('img').attr('src', deleteImageUrl);
				$('.obsListNew').last().find('input:radio').attr('name', 'obsNew'+ind);			
				
				
				_.each(responseText.OBSLEVELORD, function( e ){
					
						 
						if(obs[0]===e.CODE_VALUE  ){

                            $(".obsOrderInput").last().attr("title", e.CODE_VALUE);	
				            $(".obsOrderInput").last().attr("code_value", e.CODE_VALUE);
				            $(".obsOrderInput").last().val(e.EVENT_CD_DISPLAY);						
							
							if(obs[2] === "ORDER_DETAIL" ) {
							$('.itemInputOEMeaning').last().val(obs[3]);
							$('.itemInputOEMeaning').last().attr("disabled", false);
							$('.itemInputOEID').last().attr("disabled", true);
							$('.obsQuaRadioMeaning').last().attr("checked", true);
						  						
							}else if(obs[2] === "ORDER_DETAIL_ID" ){
							  $('.itemInputOEID').last().val(obs[3]);
							  $('.itemInputOEID').last().attr("disabled", false);
							  $('.itemInputOEMeaning').last().attr("disabled", true);
							  $('.obsQuaRadioId').last().attr("checked", true);
							}
							
						}				
						
					})
				
				

				});
		var codeSearch200 = new CodeSearch({
			"element": $(".typeahead200")
			,"codeSet": 200
		});
		
		 $('.label_DISPLAY_200').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 200)');
			
			
	
			var interval = _.uniq(_.collect(responseText.INTERVAL, function(interval){
				return JSON.stringify(interval);
			}));
			interval=$.parseJSON("["+interval+"]");
	
			//time interval
			for(var i=0; i<interval.length; i++){
				var html="<tr><td><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></td>"
				+"<td><input class='itemInputShort' type='text' value="+interval[i].MIN+" onkeypress='if ( isNaN( String.fromCharCode(event.keyCode) )) return false;'></input></td>"
				+"<td><button class='intervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>"
				$('#intervalTable').append(html);
				$('#intervalTable select[name=\'interval\']').last().val(interval[i].FACILITY_CV);
				$('#intervalTable').find('select[name=\'interval\']').last().trigger('change');
				$('#intervalTable select[name=\'unit\']').last().val(interval[i].CODE_VALUE);
			}	
		}
		//reply from requestNomen
		else if(json_response.response.NOMENREPLY){
			var responseText = json_response.response.NOMENREPLY;
			var list = AjaxHandler.parse_json(preLoadedLocationCodes);
			var row=_.find(list.CUST_REC.DATA, function(row){
				return (row.PARENT_ENTITY_ID===responseText.CE_CODE_VALUE&&row.SECTION_NAME==="PATIENT_STATUS_ACTIVITY");
			})
			
			var labelName="";
			if(responseText.LIST.length){
				if(row !== undefined)
				   labelName=row.SCRIPT_NAME;
			}
			else{
				labelName="No nomenclature found";
			}
			var html="<p code_value='"+responseText.CE_CODE_VALUE+"'>"+labelName+"</p><table border='0' cellpadding='4' cellspacing='0'><tr><td>"
			+"<select class='itemDrop' name='nomen' size='10' MULTIPLE>";
			var html2= "<p code_value='"+responseText.CE_CODE_VALUE+"'>"+labelName+"</p><select class='itemDrop' name='nomenDefault'>";
			for(var i=0; i<responseText.LIST.length; i++){
				html+="<option value='"+responseText.LIST[i].NOMENID+"' code_value='"+responseText.CE_CODE_VALUE+"'>"+responseText.LIST[i].DISPLAY+"</option>";
				html2+="<option value='"+responseText.LIST[i].NOMENID+"' code_value='"+responseText.CE_CODE_VALUE+"'>"+responseText.LIST[i].DISPLAY+"</option>";
			}
			html+="</select></td><td align='center' valign='middle'><img class='addButton' src='"+staticContentLocation +"/img/6364_right.png'></img><br><br><img class='removeButton' src='"+staticContentLocation +"/img/6364_left.png'></img></td><td><select name='selectedNomen' size='10'></select>";
			html+="</td><td align='center' valign='middle'><img class='upButton' src='"+staticContentLocation +"/img/6364_up.png'/><br><br><img class='downButton' src='"+staticContentLocation +"/img/6364_down.png'/><br></td></tr></table>";
			html2+="</select>";
			nomenDefaultList.push(html2);
			nomenList.push({html:html, cv:responseText.CE_CODE_VALUE});
			setNomenLocation(responseText.CE_CODE_VALUE);
			loadDefaultNomen(defaultNom, responseText.CE_CODE_VALUE);
		}
		//reply from update
		// else if(json_response.response.CSV){
		// $('#updateButton').html("UPDATE");
			// alert("Setup page has been successfully updated");
		// }
		
	    else if(json_response.response.CSV){
			$('#updateButton').html("UPDATE");
			setDialouge();
	    }
		
		//reply from requestNu
		else if(json_response.response.NUREPLY){
			nuResponse = json_response.response.NUREPLY.LIST;
			$('#locTypeCheck').trigger('change');
			setLocType();
		}
	}
	
	function setDialouge()
	 {
		return $("<div class='dialog' id = 'addTextArea' title='" 
				+ 'Message From Webpage' + "'><p align='center'>" 
                + '<img align="left" src='+ staticContentLocation +'/img/4022_16.GIF> </img>'			
				+ 'Setup Page Updated Sucessfully'
				+ "</p></div>")
		.dialog({
			modal: true,
			resizable: true,
			width : 300,
			buttons: [
			  {
			  text : 'OK',
			  id: "ok_ButtonId",
			  click : function() {
					$( this ).dialog( "close" );					
				}
			}]
		}); 
	 }
	
	//set location type section
	function setLocType(){
		$.each(locTypeSelected, function(i, e){
			$('#locTypeDiv select[name=\'locTypeAvailList\']').find('option').each(function(index, v){
				if(e.toString()===$(v).val()){
					$('#locTypeDiv select[name=\'locTypeSelectedlList\']').append("<option value='"+$(v).val()+"' title='"+$(v).text()+"'>"+$(v).text()+"</option>");
					$(v).remove();
					return;
				}
			})
		});
	}
	//set nomen location section
	function setNomenLocation(ce_id){
		var dk = [];
	
		var length=nomenResponse.length;
	    var NeedAssignmentList = locationCodesToAssign;
		for(var i=0; i<length; i++) {
			
			var findFlag = 0;
		    if ($.inArray(nomenResponse[i].DISPLAY_KEY, dk)==-1) {
				_.find(NeedAssignmentList.LOCATION, function(location){
					if(location.CODE_VALUE==nomenResponse[i].FACILITY_CV){
						findFlag = 1;
						dk.push(nomenResponse[i].DISPLAY_KEY);
						}
					})
		        
		    }
			if(findFlag === 0)
			{
		    	nomenResponse.splice(i, 1);
		    	length--;
		    	i--;
		    }
		};

		nomenResponseCollection.push({
			CE_ID: ce_id,
			LOCATIONS: []
		});
		
		for(var i=0; i<nomenResponse.length; i++){
			var selected = getSelectedNomenLocation(nomenResponse[i].CODE_VALUE, ce_id);	
			nomenResponseCollection[nomenResponseCnt].LOCATIONS.push({
				FAC_ID : nomenResponse[i].FACILITY_CV,
				LOC_ID: nomenResponse[i].CODE_VALUE,
				NOMEN: []
			});
			for(var m=0; m<selected.length; m++){
				nomenResponseCollection[nomenResponseCnt].LOCATIONS[i].NOMEN.push(selected[m]);
			}
		}
		var newCollection = rearrangeCollection(nomenResponseCollection);

		$('#nomenDiv').html("");
		_.each(newCollection, function(loc){
			var html ="<div class='nomenItemDiv'><div><button class='deleteButton'><img src='"+staticContentLocation +"/img/4984_16.png'/></button><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></div></div>";
			$('#nomenDiv').append(html);
			$.each(nomenList, function(i, e){
				html=e.html;
				$('.nomenItemDiv').last().append(html);
				_.each(loc.CE, function(ce){
				
					if(splitApart(ce.CE_ID) == splitApart(e.cv.toString())){
						_.each(ce.NOMEN, function(nomen){
							$('#nomenDiv select[name=\'nomen\']').last().find('option').each(function(index, v) {
							
								if(splitApart($(v).val()) == splitApart(nomen.NOMEN_ID)){
								
										$(v).remove();
										var row = "<option code_value='"+$(v).attr("code_value")+"' value='"+$(v).val()+"'>"+$(v).html()+"</option>"
									$('#nomenDiv select[name=\'selectedNomen\']').last().append(row);
								}
								return;
							});
						});
					}
				});
			});
      		$('#nomenDiv select[name=\'interval\']').last().val(loc.FACILITY_ID);
			$('#nomenDiv').find('select[name=\'interval\']').last().trigger('change');
			$('#nomenDiv select[name=\'unit\']').last().val(loc.LOC_ID);
		})
		nomenResponseCnt++;
	}
	
	//rearrange the collection to have the hierarchy of location-clinical event
	function rearrangeCollection(collection){
		var location=[];
		var returnCollection = [];
		_.each(collection, function(coll){
			_.each(coll.LOCATIONS, function(loc){
				location.push({fac_id: loc.FAC_ID, loc_id: loc.LOC_ID});
			})
		})

		location =  _.uniq(_.collect(location, function(x){
			return JSON.stringify(x);
		}));
		location=$.parseJSON("["+location+"]");

		_.each(location, function(locat){
			returnCollection.push({
				FACILITY_ID: locat.fac_id,
				LOC_ID: locat.loc_id,
				CE: []
			})
			_.each(collection, function(coll){
				_.each(coll.LOCATIONS, function(loc){
					if(loc.LOC_ID===locat.loc_id&&loc.NOMEN.length){
						_.last(returnCollection).CE.push({
							CE_ID: _.last(loc.NOMEN).CE_ID,
							NOMEN:loc.NOMEN
						})
					}
				})
			})
		})
		return returnCollection;
	}
	
	function splitApart(value, separator)
    {
		
        if(separator === undefined) separator = ".";
		var strValue = typeof value == "number" ? value.toString() : value;
        var sepIndex = strValue.indexOf(separator);
				
        if(sepIndex > 0)
		{
	        return strValue.substring(0,sepIndex).trim();
		}
        else 
		{

            return strValue.trim();
		}
    }
	//get available nomen location
	function getSelectedNomenLocation(loc_id, ce_id){
		var list = AjaxHandler.parse_json(preLoadedLocationCodes);
		var AliasCodeList = list.CUST_REC;
		var list = [];
		$.each(AliasCodeList.DATA, function(i, v) {
            
	 		if(v.SECTION_NAME ==="LOCATION_NOMEN_RESPONCE"  && splitApart(v.PARENT_ENTITY_ID) == loc_id && splitApart(v.SCRIPT_NAME) == ce_id.toString()){
			
	 			list.push(
	 			{
	 				LOCATION_ID: loc_id,
	 				CE_ID: v.SCRIPT_NAME,
	 				DISP_SEQ: v.DISP_SEQ,
	 				NOMEN_ID: v.DISP_NAME,
	 				DISPLAY_KEY: v.LONG_DESC
	 			}
	 			);
	 		}
	    return;
		});
		return list;
	}
	
	//right arrow to add nomen location
	function addNomen(dom){
		$(dom).closest('tr').find('select[name=\'nomen\']').find("option:selected").each(function(i, v){
			var newOpt = "<option value='"+ $(v).val()+" ' code_value='"+$(v).attr("code_value")+"'>"+$(v).html()+"</option>";
			$(v).closest('tr').find('select[name=\'selectedNomen\']').append(newOpt);
			$(v).remove();
		});
	}
	
	//left arrow to remove nomen location
	function removeNomen(dom){
		$(dom).closest('tr').find('select[name=\'selectedNomen\']').find("option:selected").each(function(i, v){
			var newOpt = "<option value='"+ $(v).val()+"' ' code_value='"+$(v).attr("code_value")+"'>"+$(v).html()+"</option>";
			$(v).closest('tr').find('select[name=\'nomen\']').append(newOpt);
			$(v).remove();
		});	
	}
	
	//up arrow to move nomen location up
	function upNomen(dom){
		$(dom).closest('tr').find('select[name=\'selectedNomen\']').find("option:selected").each(function(i, v){
			var row = $(v);
			row.insertBefore(row.prev());
		});	
	}
	
	//down arrow to move nomen location down
	function downNomen(dom){
		$(dom).closest('tr').find('select[name=\'selectedNomen\']').find("option:selected").each(function(i, v){
			var row = $(v);
			row.insertAfter(row.next());
		});		
	}
	
	return({
		init : function(){
			render();
			loadData();
		}
	})
}());
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm, '');
  };
}

/**
 * Criterion contains Application-level variables passed in from PrefMaint.exe.
 */
var Criterion = {
	
	position_cd : 0,
	personnel_id : 0,
	image_size : 3,
	debug_mode_ind : 0,	
	debug_level_ind: 0,
	dev_debug_ind: 0,
	unloadParams : function() {
		try {
				this.position_cd = m_criterionJSON.CRITERION.POSITION_CD; 
				this.personnel_id = m_criterionJSON.CRITERION.PRSNL_ID; 
				this.image_size = m_criterionJSON.CRITERION.IMAGE_SIZE; 
				this.debug_mode_ind = m_criterionJSON.CRITERION.DEBUG_IND ;
				this.debug_level_ind= m_criterionJSON.CRITERION.DEBUG_LEVEL_IND;
				
				if( m_criterionJSON.CRITERION.DEV_DEBUG_IND !== undefined)
					this.dev_debug_ind = m_criterionJSON.CRITERION.DEV_DEBUG_IND;
					
			} catch (e) {
			errmsg(e.message, "unloadParams()");
		}
	}	
};

// MSDropDown - jquery.dd.js
// author: Marghoob Suleman - http://www.marghoobsuleman.com/
// Date: 10 Nov, 2012 
// Version: 3.5.2
// Revision: 27
// web: www.marghoobsuleman.com
/*
// msDropDown is free jQuery Plugin: you can redistribute it and/or modify
// it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
*/ 
var msBeautify = msBeautify || {};
(function ($) {
	msBeautify = {
	version: {msDropdown:'3.5.2'},
	author: "Marghoob Suleman",
	counter: 20,
	debug: function (v) {
		if (v !== false) {
			$(".ddOutOfVision").css({height: 'auto', position: 'relative'});
		} else {
			$(".ddOutOfVision").css({height: '0px', position: 'absolute'});
		}
	},
	oldDiv: '',
	create: function (id, settings, type) {
		type = type || "dropdown";
		var data;
		switch (type.toLowerCase()) {
		case "dropdown":
		case "select":
			data = $(id).msDropdown(settings).data("dd");
			break;
		}
		return data;
	}
};

$.msDropDown = {}; //Legacy
$.msDropdown = {}; //camelCaps
$.extend(true, $.msDropDown, msBeautify);
$.extend(true, $.msDropdown, msBeautify);
// make compatibiliy with old and new jquery
if ($.fn.prop === undefined) {$.fn.prop = $.fn.attr;}
if ($.fn.on === undefined) {$.fn.on = $.fn.bind;$.fn.off = $.fn.unbind;}
if (typeof $.expr.createPseudo === 'function') {
	//jQuery 1.8  or greater
	$.expr[':'].Contains = $.expr.createPseudo(function (arg) {return function (elem) { return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; });
} else {
	//lower version
	$.expr[':'].Contains = function (a, i, m) {return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; };
}
//dropdown class
function dd(element, settings) {
	var settings = $.extend(true,
		{byJson: {data: null, selectedIndex: 0, name: null, size: 0, multiple: false, width: 250},
		mainCSS: 'dd',
		height: 120, //not using currently
		visibleRows: 7,
		rowHeight: 0,
		showIcon: true,
		zIndex: 9999,
		useSprite: false,
		animStyle: 'slideDown',
		event:'click',
		openDirection: 'auto', //auto || alwaysUp || alwaysDown
		jsonTitle: true,
		style: '',
		disabledOpacity: 0.7,
		disabledOptionEvents: true,
		childWidth:0,
		enableCheckbox:false, //this needs to multiple or it will set element to multiple
		checkboxNameSuffix:'_mscheck',
		append:'',
		prepend:'',
		reverseMode:true, //it will update the msdropdown UI/value if you update the original dropdown - will be usefull if are using knockout.js or playing with original dropdown
		roundedCorner:true,
		enableAutoFilter:true,
		on: {create: null,open: null,close: null,add: null,remove: null,change: null,blur: null,click: null,dblclick: null,mousemove: null,mouseover: null,mouseout: null,focus: null,mousedown: null,mouseup: null}
		}, settings);								  
	var $this = this; //this class	 
	var holderId = {postElementHolder: '_msddHolder', postID: '_msdd', postTitleID: '_title',postTitleTextID: '_titleText', postChildID: '_child'};
	var css = {dd:settings.mainCSS, ddTitle: 'ddTitle', arrow: 'ddArrow arrowoff', ddChild: 'ddChild', ddTitleText: 'ddTitleText',disabled: 'disabled', enabled: 'enabled', ddOutOfVision: 'ddOutOfVision', borderTop: 'borderTop', noBorderTop: 'noBorderTop', selected: 'selected', divider: 'divider', optgroup: "optgroup", optgroupTitle: "optgroupTitle", description: "description", label: "ddlabel",hover: 'hover',disabledAll: 'disabledAll'};
	var css_i = {li: '_msddli_',borderRadiusTp: 'borderRadiusTp',ddChildMore: 'border shadow',fnone: "fnone"};
	var isList = false, isMultiple=false,isDisabled=false, cacheElement = {}, element, orginial = {}, isOpen=false;
	var DOWN_ARROW = 40, UP_ARROW = 38, LEFT_ARROW=37, RIGHT_ARROW=39, ESCAPE = 27, ENTER = 13, ALPHABETS_START = 47, SHIFT=16, CONTROL = 17, BACKSPACE=8, DELETE=46;
	var shiftHolded=false, controlHolded=false,lastTarget=null,forcedTrigger=false, oldSelected, isCreated = false;
	var doc = document, ua = window.navigator.userAgent, isIE = ua.match(/msie/i);
	settings.reverseMode = settings.reverseMode.toString();
	settings.roundedCorner = settings.roundedCorner.toString();
	var isArray = function(obj) {
		return (Object.prototype.toString.call(obj)=="[object Array]") ? true : false;
	};
	var msieversion = function()
   	{      
      var msie = ua.indexOf("MSIE");
      if ( msie > 0 ) {      // If Internet Explorer, return version number
         return parseInt (ua.substring (msie+5, ua.indexOf (".", msie)));
	  } else {                // If another browser, return 0
         return 0;
	  };
   	};
	var checkDataSetting = function() {
		settings.mainCSS = $("#"+element).data("maincss") || settings.mainCSS;
		settings.visibleRows = $("#"+element).data("visiblerows") || settings.visibleRows;
		if($("#"+element).data("showicon")==false) {settings.showIcon = $("#"+element).data("showicon");};
		settings.useSprite = $("#"+element).data("usesprite") || settings.useSprite;
		settings.animStyle = $("#"+element).data("animstyle") || settings.animStyle;
		settings.event = $("#"+element).data("event") || settings.event;
		settings.openDirection = $("#"+element).data("opendirection") || settings.openDirection;
		settings.jsonTitle = $("#"+element).data("jsontitle") || settings.jsonTitle;
		settings.disabledOpacity = $("#"+element).data("disabledopacity") || settings.disabledOpacity;
		settings.childWidth = $("#"+element).data("childwidth") || settings.childWidth;
		settings.enableCheckbox = $("#"+element).data("enablecheckbox") || settings.enableCheckbox;
		settings.checkboxNameSuffix = $("#"+element).data("checkboxnamesuffix") || settings.checkboxNameSuffix;
		settings.append = $("#"+element).data("append") || settings.append;
		settings.prepend = $("#"+element).data("prepend") || settings.prepend;
		settings.reverseMode = $("#"+element).data("reversemode") || settings.reverseMode;
		settings.roundedCorner = $("#"+element).data("roundedcorner") || settings.roundedCorner;
		settings.enableAutoFilter = $("#"+element).data("enableautofilter") || settings.enableAutoFilter;
		
		//make string
		settings.reverseMode = settings.reverseMode.toString();
		settings.roundedCorner = settings.roundedCorner.toString();
		settings.enableAutoFilter = settings.enableAutoFilter.toString();
	};	
	var getElement = function(ele) {
		if (cacheElement[ele] === undefined) {
			cacheElement[ele] = doc.getElementById(ele);
		}
		return cacheElement[ele];
	}; 	
	var getIndex = function(opt) {
		var childid = getPostID("postChildID"); 
		return $("#"+childid + " li."+css_i.li).index(opt);
	};
	var createByJson = function() {
		if (settings.byJson.data) {
				var validData = ["description","image","title"];
				try {
					if (!element.id) {
						element.id = "dropdown"+msBeautify.counter;
					};
					settings.byJson.data = eval(settings.byJson.data);
					//change element
					var id = "msdropdown"+(msBeautify.counter++);
					var obj = {};
					obj.id = id;
					obj.name = settings.byJson.name || element.id; //its name
					if (settings.byJson.size>0) {
						obj.size = settings.byJson.size;
					};
					obj.multiple = settings.byJson.multiple;
					var oSelect = createElement("select", obj);
					for(var i=0;i<settings.byJson.data.length;i++) {
						var current = settings.byJson.data[i];
						var opt = new Option(current.text, current.value);
						for(var p in current) { 
							if (p.toLowerCase() != 'text') { 
								var key = ($.inArray(p.toLowerCase(), validData)!=-1) ? "data-" : "";
								opt.setAttribute(key+p, current[p]);
							};
						};
						oSelect.options[i] = opt;
					};
					getElement(element.id).appendChild(oSelect);
					oSelect.selectedIndex = settings.byJson.selectedIndex;
					$(oSelect).css({width: settings.byJson.width+'px'});
					//now change element for access other things
					element = oSelect;
				} catch(e) {
					throw "There is an error in json data.";
				};
		};			
	};
	var init = function() {		
		 //set properties
		 createByJson();
		if (!element.id) {
			element.id = "msdrpdd"+(msBeautify.counter++);
		};						
		element = element.id;
		$this.element = element;
		checkDataSetting();		
		isDisabled = getElement(element).disabled;
		// var useCheckbox = settings.enableCheckbox;
		// if(useCheckbox.toString()==="true") {
			// getElement(element).multiple = true;
			// settings.enableCheckbox = true;
		// };
		// isList = (getElement(element).size>1 || getElement(element).multiple==true) ? true : false;
		//trace("isList "+isList);
		// if (isList) {isMultiple = getElement(element).multiple;};			
		mergeAllProp();		
		//create layout
		createLayout();		
		//set ui prop
		updateProp("uiData", getDataAndUI());
		updateProp("selectedOptions", $("#"+element +" option:selected"));
		var childid = getPostID("postChildID");
		oldSelected = $("#" + childid + " li." + css.selected);
		
		if(settings.reverseMode==="true") {
			$("#"+element).on("change", function() {
				setValue(this.selectedIndex);
			});
		};
		//add refresh method
		getElement(element).refresh = function(e) {
			 $("#"+element).msDropdown().data("dd").refresh();
		};

	 };	
	 /********************************************************************************************/	
	var getPostID = function (id) {
		return element+holderId[id];
	};
	var getInternalStyle = function(ele) {		 
		 var s = (ele.style === undefined) ? "" : ele.style.cssText;
		 return s;
	};
	var parseOption = function(opt) {
		var imagePath = '', title ='', description='', value=-1, text='', className='', imagecss = '', index;
		if (opt !== undefined) {
			var attrTitle = opt.title || "";
			//data-title
			if (attrTitle!="") {
				var reg = /^\{.*\}$/;
				var isJson = reg.test(attrTitle);
				if (isJson && settings.jsonTitle) {
					var obj =  eval("["+attrTitle+"]");	
				};				 
				title = (isJson && settings.jsonTitle) ? obj[0].title : title;
				description = (isJson && settings.jsonTitle) ? obj[0].description : description;
				imagePath = (isJson && settings.jsonTitle) ? obj[0].image : attrTitle;
				imagecss = (isJson && settings.jsonTitle) ? obj[0].imagecss : imagecss;
				index = opt.index;
			};

			text = opt.text || '';
			value = opt.value || '';
			className = opt.className || "";
			//ignore title attribute if playing with data tags
			title = $(opt).prop("data-title") || $(opt).data("title") || (title || "");
			description = $(opt).prop("data-description") || $(opt).data("description") || (description || "");
			imagePath = $(opt).prop("data-image") || $(opt).data("image") || (imagePath || "");
			imagecss = $(opt).prop("data-imagecss") || $(opt).data("imagecss") || (imagecss || "");
			index = $(opt).index();
		};
		var o = {image: imagePath, title: title, description: description, value: value, text: text, className: className, imagecss:imagecss, index:index};
		return o;
	};	 
	var createElement = function(nm, attr, html) {
		var tag = doc.createElement(nm);
		if (attr) {
		 for(var i in attr) {
			 switch(i) {
				 case "style":
					tag.style.cssText = attr[i];
				 break;
				 default:
					tag[i]  = attr[i];
				 break;
			 };	
		 };
		};
		if (html) {
		 tag.innerHTML = html;
		};
		return tag;
	};
	 /********************************************************************************************/
	  /*********************** <layout> *************************************/
	var hideOriginal = function() {
		var hidid = getPostID("postElementHolder");
		if ($("#"+hidid).length==0) {			 
			var obj = {style: 'height: 0px;overflow: hidden;position: absolute;',className: css.ddOutOfVision};	
			obj.id = hidid;
			var oDiv = createElement("div", obj);	
			$("#"+element).after(oDiv);
			$("#"+element).appendTo($("#"+hidid));
		} else {
			$("#"+hidid).css({height: 0,overflow: 'hidden',position: 'absolute'});
		};
		getElement(element).tabIndex = -1;
	};
	var createWrapper = function () {
		var brdRds = (settings.roundedCorner == "true") ? " borderRadius" : "";
		var obj = {
			className: css.dd + " ddcommon"+brdRds
		};
		var intcss = getInternalStyle(getElement(element));
		var w = $("#" + element).outerWidth();
		obj.style = "width: " + w + "px;";
		if (intcss.length > 0) {
			obj.style = obj.style + "" + intcss;
		};
		obj.id = getPostID("postID");
		obj.tabIndex = getElement(element).tabIndex;
		var oDiv = createElement("div", obj);
		return oDiv;
	};
	var createTitle = function () {
		var selectedOption;
		if(getElement(element).selectedIndex>=0) {
			selectedOption = getElement(element).options[getElement(element).selectedIndex];
		} else {
			selectedOption = {value:'', text:''};
		}
		var spriteClass = "", selectedClass = "";
		//check sprite
		var useSprite = $("#"+element).data("usesprite");
		if(useSprite) { settings.useSprite = useSprite; };
		if (settings.useSprite != false) {
			spriteClass = " " + settings.useSprite;
			selectedClass = " " + selectedOption.className;
		};
		var brdRdsTp = (settings.roundedCorner == "true") ? " "+css_i.borderRadiusTp : "" ;
		var oTitle = createElement("div", {className: css.ddTitle + spriteClass + brdRdsTp});
		//divider
		var oDivider = createElement("span", {className: css.divider});
		//arrow
		var oArrow = createElement("span", {className: css.arrow});
		//title Text
		var titleid = getPostID("postTitleID");
		var oTitleText = createElement("span", {className: css.ddTitleText + selectedClass, id: titleid});
	
		var parsed = parseOption(selectedOption);
		var arrowPath = parsed.image;
		var sText = parsed.text || "";		
		if (arrowPath != "" && settings.showIcon) {
			var oIcon = createElement("img");
			oIcon.src = arrowPath;
			if(parsed.imagecss!="") {
				oIcon.className = parsed.imagecss+" ";
			};
		};
		var oTitleText_in = createElement("span", {className: css.label}, sText);
		oTitle.appendChild(oDivider);
		oTitle.appendChild(oArrow);
		if (oIcon) {
			oTitleText.appendChild(oIcon);
		};
		oTitleText.appendChild(oTitleText_in);
		oTitle.appendChild(oTitleText);
		var oDescription = createElement("span", {className: css.description}, parsed.description);
		oTitleText.appendChild(oDescription);
		return oTitle;
	};
	var createFilterBox = function () {
		var tid = getPostID("postTitleTextID");
		var brdRds = (settings.roundedCorner == "true") ? "borderRadius" : "";
		var sText = createElement("input", {id: tid, type: 'text', value: '', autocomplete: 'off', className: 'text shadow '+brdRds, style: 'display: none'});
		return sText;
	};
	var createChild = function (opt) {
		var obj = {};
		var intcss = getInternalStyle(opt);
		if (intcss.length > 0) {obj.style = intcss; };
		var css2 = (opt.disabled) ? css.disabled : css.enabled;
		css2 = (opt.selected) ? (css2 + " " + css.selected) : css2;
		css2 = css2 + " " + css_i.li;
		obj.className = css2;
		if (settings.useSprite != false) {
			obj.className = css2 + " " + opt.className;
		};
		var li = createElement("li", obj);
		var parsed = parseOption(opt);
		if (parsed.title != "") {
			li.title = parsed.title;
		};
		var arrowPath = parsed.image;
		if (arrowPath != "" && settings.showIcon) {
			var oIcon = createElement("img");
			oIcon.src = arrowPath;
			if(parsed.imagecss!="") {
				oIcon.className = parsed.imagecss+" ";
			};
		};
		if (parsed.description != "") {
			var oDescription = createElement("span", {
				className: css.description
			}, parsed.description);
		};
		var sText = opt.text || "";
		var oTitleText = createElement("span", {
			className: css.label
		}, sText);
		//checkbox
		if(settings.enableCheckbox===true) {
			var chkbox = createElement("input", {
			type: 'checkbox', name:element+settings.checkboxNameSuffix+'[]', value:opt.value||"", className:"checkbox"}); //this can be used for future
			li.appendChild(chkbox);
			if(settings.enableCheckbox===true) {
				chkbox.checked = (opt.selected) ? true : false;
			};
		};
		if (oIcon) {
			li.appendChild(oIcon);
		};
		li.appendChild(oTitleText);
		if (oDescription) {
			li.appendChild(oDescription);
		} else {
			if (oIcon) {
				oIcon.className = oIcon.className+css_i.fnone;
			};
		};
		var oClear = createElement("div", {className: 'clear'});
		li.appendChild(oClear);
		return li;
	};
	var createChildren = function () {
		var childid = getPostID("postChildID");
		var obj = {className: css.ddChild + " ddchild_ " + css_i.ddChildMore, id: childid};
		if (isList == false) {
			obj.style = "z-index: " + settings.zIndex;
		} else {
			obj.style = "z-index:1";
		};
		var childWidth = $("#"+element).data("childwidth") || settings.childWidth;
		if(childWidth) {
			obj.style =  (obj.style || "") + ";width:"+childWidth;
		};		
		var oDiv = createElement("div", obj);
		var ul = createElement("ul");
		if (settings.useSprite != false) {
			ul.className = settings.useSprite;
		};
		var allOptions = getElement(element).children;
		for (var i = 0; i < allOptions.length; i++) {
			var current = allOptions[i];
			var li;
			if (current.nodeName.toLowerCase() == "optgroup") {
				//create ul
				li = createElement("li", {className: css.optgroup});
				var span = createElement("span", {className: css.optgroupTitle}, current.label);
				li.appendChild(span);
				var optChildren = current.children;
				var optul = createElement("ul");
				for (var j = 0; j < optChildren.length; j++) {
					var opt_li = createChild(optChildren[j]);
					optul.appendChild(opt_li);
				};
				li.appendChild(optul);
			} else {
				li = createChild(current);
			};
			ul.appendChild(li);
		};
		oDiv.appendChild(ul);		
		return oDiv;
	};
	var childHeight = function (val) {
		var childid = getPostID("postChildID");
		if (val) {
			if (val == -1) { //auto
				$("#"+childid).css({height: "auto", overflow: "auto"});
			} else {				
				$("#"+childid).css("height", val+"px");
			};
			return false;
		};
		//else return height
		var iHeight;
		var totalOptions = getElement(element).options.length;
		if (totalOptions > settings.visibleRows || settings.visibleRows) {
			var firstLI = $("#" + childid + " li:first");
			var margin = parseInt(firstLI.css("padding-bottom")) + parseInt(firstLI.css("padding-top"));
			if(settings.rowHeight===0) {
				$("#" + childid).css({visibility:'hidden',display:'block'}); //hack for first child
				settings.rowHeight = Math.ceil(firstLI.height());
				$("#" + childid).css({visibility:'visible'});
				if(!isList || settings.enableCheckbox===true) {
					$("#" + childid).css({display:'none'});
				};
			};
			iHeight = ((settings.rowHeight + margin) * Math.min(settings.visibleRows,totalOptions)) + 3;
		} else if (isList) {
			iHeight = $("#" + element).height(); //get height from original element
		};		
		return iHeight;
	};
	var applyChildEvents = function () {
		var childid = getPostID("postChildID");
		$("#" + childid).on("click", function (e) {
			if (isDisabled === true) return false;
			//prevent body click
			e.preventDefault();
			e.stopPropagation();
			if (isList) {
				bind_on_events();
			};
		});
		$("#" + childid + " li." + css.enabled).on("click", function (e) {
			if(e.target.nodeName.toLowerCase() !== "input") {
				close(this);
			};
		});
		$("#" + childid + " li." + css.enabled).on("mousedown", function (e) {
			if (isDisabled === true) return false;
			oldSelected = $("#" + childid + " li." + css.selected);
			lastTarget = this;
			e.preventDefault();
			e.stopPropagation();
			//select current input
			if(settings.enableCheckbox===true) {
				if(e.target.nodeName.toLowerCase() === "input") {
					controlHolded = true;
					
				};	
			};
			if (isList === true) {
				if (isMultiple) {					
					if (shiftHolded === true) {
						$(this).addClass(css.selected);
						var selected = $("#" + childid + " li." + css.selected);
						var lastIndex = getIndex(this);
						if (selected.length > 1) {
							var items = $("#" + childid + " li." + css_i.li);
							var ind1 = getIndex(selected[0]);
							var ind2 = getIndex(selected[1]);
							if (lastIndex > ind2) {
								ind1 = (lastIndex);
								ind2 = ind2 + 1;
							};
							for (var i = Math.min(ind1, ind2); i <= Math.max(ind1, ind2); i++) {
								var current = items[i];
								if ($(current).hasClass(css.enabled)) {
									$(current).addClass(css.selected);
								};
							};
						};
					} else if (controlHolded === true) {
						$(this).toggleClass(css.selected); //toggle
						if(settings.enableCheckbox===true) {
							var checkbox = this.childNodes[0];
							checkbox.checked = !checkbox.checked; //toggle
						};
					} else {
						$("#" + childid + " li." + css.selected).removeClass(css.selected);
						$("#" + childid + " input:checkbox").prop("checked", false);
						$(this).addClass(css.selected);
						if(settings.enableCheckbox===true) {
							this.childNodes[0].checked = true;
						};
					};					
				} else {
					$("#" + childid + " li." + css.selected).removeClass(css.selected);
					$(this).addClass(css.selected);
				};
				//fire event on mouseup
			} else {
				$("#" + childid + " li." + css.selected).removeClass(css.selected);
				$(this).addClass(css.selected);
			};		
		});
		$("#" + childid + " li." + css.enabled).on("mouseenter", function (e) {
			if (isDisabled === true) return false;
			e.preventDefault();
			e.stopPropagation();
			if (lastTarget != null) {
				if (isMultiple) {
					$(this).addClass(css.selected);
					if(settings.enableCheckbox===true) {
						this.childNodes[0].checked = true;
					};
				};
			};
		});
	
		$("#" + childid + " li." + css.enabled).on("mouseover", function (e) {
			if (isDisabled === true) return false;
			$(this).addClass(css.hover);
			
		});
		
		$("#" + childid + " li." + css.enabled).on("mouseout", function (e) {
			if (isDisabled === true) return false;
			$("#" + childid + " li." + css.hover).removeClass(css.hover);
		});
	
		$("#" + childid + " li." + css.enabled).on("mouseup", function (e) {
			if (isDisabled === true) return false;
			e.preventDefault();
			e.stopPropagation();
			if(settings.enableCheckbox===true) {
				controlHolded = false;
			};
			var selected = $("#" + childid + " li." + css.selected).length;			
			forcedTrigger = (oldSelected.length != selected || selected == 0) ? true : false;	
			fireAfterItemClicked();
			unbind_on_events(); //remove old one
			bind_on_events();
			lastTarget = null;
		});
	
		/* options events */
		if (settings.disabledOptionEvents == false) {
			$("#" + childid + " li." + css_i.li).on("click", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "click");
			});
			$("#" + childid + " li." + css_i.li).on("mouseenter", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseenter");
			});
			$("#" + childid + " li." + css_i.li).on("mouseover", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseover");
			});
			$("#" + childid + " li." + css_i.li).on("mouseout", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseout");
			});
			$("#" + childid + " li." + css_i.li).on("mousedown", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mousedown");
			});
			$("#" + childid + " li." + css_i.li).on("mouseup", function (e) {
				if (isDisabled === true) return false;
				fireOptionEventIfExist(this, "mouseup");
			});
		};
	};
	var removeChildEvents = function () {
		var childid = getPostID("postChildID");
		$("#" + childid).off("click");
		$("#" + childid + " li." + css.enabled).off("mouseenter");
		$("#" + childid + " li." + css.enabled).off("click");
		$("#" + childid + " li." + css.enabled).off("mouseover");
		$("#" + childid + " li." + css.enabled).off("mouseout");
		$("#" + childid + " li." + css.enabled).off("mousedown");
		$("#" + childid + " li." + css.enabled).off("mouseup");
	};
	var triggerBypassingHandler = function (id, evt_n, handler) {
		$("#" + id).off(evt_n, handler);
		$("#" + id).trigger(evt_n);
		$("#" + id).on(evt_n, handler);
	};
	var applyEvents = function () {
		var id = getPostID("postID");
		var tid = getPostID("postTitleTextID");
		var childid = getPostID("postChildID");		
		$("#" + id).on(settings.event, function (e) {			
			if (isDisabled === true) return false;
			fireEventIfExist(settings.event);
			//prevent body click
			e.preventDefault();
			e.stopPropagation();
			open(e);
		});
		$("#" + id).on("keydown", function (e) {
			var k = e.which;
			if (!isOpen && (k == ENTER || k == UP_ARROW || k == DOWN_ARROW ||
				k == LEFT_ARROW || k == RIGHT_ARROW ||
				(k >= ALPHABETS_START && !isList))) {
				open(e);
				if (k >= ALPHABETS_START) {
					showFilterBox();
				} else {
					e.preventDefault();
					e.stopImmediatePropagation();
				};
			};
		});
		$("#" + id).on("focus", wrapperFocusHandler);
		$("#" + id).on("blur", wrapperBlurHandler);
		$("#" + tid).on("blur", function (e) {
			//return focus to the wrapper without triggering the handler
			triggerBypassingHandler(id, "focus", wrapperFocusHandler);
		});
		applyChildEvents();		
		$("#" + id).on("dblclick", on_dblclick);
		$("#" + id).on("mousemove", on_mousemove);
		$("#" + id).on("mouseenter", on_mouseover);
		$("#" + id).on("mouseleave", on_mouseout);
		$("#" + id).on("mousedown", on_mousedown);
		$("#" + id).on("mouseup", on_mouseup);
	};
	var wrapperFocusHandler = function (e) {
		fireEventIfExist("focus");
	};
	var wrapperBlurHandler = function (e) {
		fireEventIfExist("blur");
	};
	//after create
	var fixedForList = function () {
		var id = getPostID("postID");
		var childid = getPostID("postChildID");		
		if (isList === true && settings.enableCheckbox===false) {
			$("#" + id + " ." + css.ddTitle).hide();
			$("#" + childid).css({display: 'block', position: 'relative'});	
			//open();
		} else {
			if(settings.enableCheckbox===false) {
				isMultiple = false; //set multiple off if this is not a list
			};
			$("#" + id + " ." + css.ddTitle).show();
			$("#" + childid).css({display: 'none', position: 'absolute'});
			//set value
			var first = $("#" + childid + " li." + css.selected)[0];
			$("#" + childid + " li." + css.selected).removeClass(css.selected);
			var index = getIndex($(first).addClass(css.selected));
			setValue(index);
		};
		childHeight(childHeight()); //get and set height 
	};
	var fixedForDisabled = function () {
		var id = getPostID("postID");
		var opc = (isDisabled == true) ? settings.disabledOpacity : 1;
		if (isDisabled === true) {
			$("#" + id).addClass(css.disabledAll);
		} else {
			$("#" + id).removeClass(css.disabledAll);
		};
	};
	var fixedSomeUI = function () {
		//auto filter
		var tid = getPostID("postTitleTextID");
		if(settings.enableAutoFilter=="true") {
			$("#" + tid).on("keyup", applyFilters);
		};
		//if is list
		fixedForList();
		fixedForDisabled();
	};
	var createLayout = function () {		
		var oDiv = createWrapper();
		var oTitle = createTitle();
		oDiv.appendChild(oTitle);
		//auto filter box
		var oFilterBox = createFilterBox();
		oDiv.appendChild(oFilterBox);
	
		var oChildren = createChildren();
		oDiv.appendChild(oChildren);
		$("#" + element).after(oDiv);
		hideOriginal(); //hideOriginal
		fixedSomeUI();
		applyEvents();
		
		var childid = getPostID("postChildID");
		//append
		if(settings.append!='') {
			$("#" + childid).append(settings.append);
		};
		//prepend
		if(settings.prepend!='') {
			$("#" + childid).prepend(settings.prepend);
		};		
		if (typeof settings.on.create == "function") {
			settings.on.create.apply($this, arguments);
		};
	};
	var selectUI_LI = function(indexes) {
		var childid = getPostID("postChildID");
		$("#" + childid + " li." + css_i.li).removeClass(css.selected);
		if(settings.enableCheckbox===true) {
			$("#" + childid + " li." + css_i.li + " input.checkbox").prop("checked", false);
		};
		if(isArray(indexes)===true) {
			for(var i=0;i<indexes.length;i++) {
				updateNow(indexes[i]);
			};
		} else {
			updateNow(indexes);
		};
		function updateNow(index) {
			$($("#" + childid + " li." + css_i.li)[index]).addClass(css.selected);
			if(settings.enableCheckbox===true) {
				$($("#" + childid + " li." + css_i.li)[index]).find("input.checkbox").prop("checked", "checked");
			};
			
		};
	};
	var selectMutipleOptions = function (bySelected, useIndexes) {
		var childid = getPostID("postChildID");
		var selected = bySelected || $("#" + childid + " li." + css.selected); //bySelected or by argument
		for (var i = 0; i < selected.length; i++) {
			var ind = (useIndexes===true) ? selected[i]  : getIndex(selected[i]);
			getElement(element).options[ind].selected = "selected";
		};
		setValue(selected);
	};
	var fireAfterItemClicked = function () {
		//console.log("fireAfterItemClicked")
		var childid = getPostID("postChildID");
		var selected = $("#" + childid + " li." + css.selected);		
		if (isMultiple && (shiftHolded || controlHolded) || forcedTrigger) {
			getElement(element).selectedIndex = -1; //reset old
		};
		var index;
		if (selected.length == 0) {
			index = -1;
		} else if (selected.length > 1) {
			//selected multiple
			selectMutipleOptions(selected);
		} else {
			//if one selected
			index = getIndex($("#" + childid + " li." + css.selected));
		};		
		if ((getElement(element).selectedIndex != index || forcedTrigger) && selected.length<=1) {			
			forcedTrigger = false;			
			var evt = has_handler("change");
			getElement(element).selectedIndex = index;	
			setValue(index);
			//local
			if (typeof settings.on.change == "function") {
				var d = getDataAndUI();
				settings.on.change(d.data, d.ui);
			};			
			$("#" + element).trigger("change");			
		};
	};
	var setValue = function (index, byvalue) {
		if (index !== undefined) {
			var selectedIndex, value, selectedText;
			if (index == -1) {
				selectedIndex = -1;
				value = "";
				selectedText = "";
				updateTitleUI(-1);
			} else {
				//by index or byvalue
				if (typeof index != "object") {
					var opt = getElement(element).options[index];
					getElement(element).selectedIndex = index;
					selectedIndex = index;
					value = parseOption(opt);
					selectedText = (index >= 0) ? getElement(element).options[index].text : "";
					updateTitleUI(undefined, value);
					value = value.value; //for bottom
				} else {
					//this is multiple or by option
					selectedIndex = (byvalue && byvalue.index) || getElement(element).selectedIndex;
					value = (byvalue && byvalue.value) || getElement(element).value;
					selectedText = (byvalue && byvalue.text) || getElement(element).options[getElement(element).selectedIndex].text || "";
					updateTitleUI(selectedIndex);
					//check if this is multiple checkbox					
				};
			};			
			updateProp("selectedIndex", selectedIndex);
			updateProp("value", value);
			updateProp("selectedText", selectedText);
			updateProp("children", getElement(element).children);
			updateProp("uiData", getDataAndUI());
			updateProp("selectedOptions", $("#" + element + " option:selected"));
		};
	};
	var has_handler = function (name) {
		//True if a handler has been added in the html.
		var evt = {byElement: false, byJQuery: false, hasEvent: false};
		var obj = $("#" + element);
		//console.log(name)
		try {
			//console.log(obj.prop("on" + name) + " "+name);
			if (obj.prop("on" + name) !== null) {
				evt.hasEvent = true;
				evt.byElement = true;
			};
		} catch(e) {
			//console.log(e.message);
		}
		// True if a handler has been added using jQuery.
		var evs;
		if (typeof $._data == "function") { //1.8
			evs = $._data(obj[0], "events");
		} else {
			evs = obj.data("events");
		};
		if (evs && evs[name]) {
			evt.hasEvent = true;
			evt.byJQuery = true;
		};
		return evt;
	};
	var bind_on_events = function () {
		unbind_on_events();
		$("body").on("click", close);
		//bind more events		 
		$(document).on("keydown", on_keydown);
		$(document).on("keyup", on_keyup);
		//focus will work on this	 		 
	};
	var unbind_on_events = function () {
		$("body").off("click", close);
		//bind more events
		$(document).off("keydown", on_keydown);
		$(document).off("keyup", on_keyup);
	};
	var applyFilters = function (e) {
		if(e.keyCode < ALPHABETS_START && e.keyCode!=BACKSPACE && e.keyCode!=DELETE) {
			return false;
		};
		var childid = getPostID("postChildID");
		var tid = getPostID("postTitleTextID");
		var sText = getElement(tid).value;
		if (sText.length == 0) {
			$("#" + childid + " li:hidden").show(); //show if hidden
			childHeight(childHeight());
		} else {
			$("#" + childid + " li").hide();
			var items = $("#" + childid + " li:Contains('" + sText + "')").show();
			if ($("#" + childid + " li:visible").length <= settings.visibleRows) {
				childHeight(-1); //set autoheight
			};
			if (items.length > 0 && !isList || !isMultiple) {
				$("#" + childid + " ." + css.selected).removeClass(css.selected);
				$(items[0]).addClass(css.selected);
			};	
		};		
		if (!isList) {
			adjustOpen();
		};
	};
	var showFilterBox = function () {
		if(settings.enableAutoFilter=="true") {
			var id = getPostID("postID");
			var tid = getPostID("postTitleTextID");
			if ($("#" + tid + ":hidden").length > 0 && controlHolded == false) {
				$("#" + tid + ":hidden").show().val("");
				//blur the wrapper without triggering the handler
				triggerBypassingHandler(id, "blur", wrapperBlurHandler);
				getElement(tid).focus();
			};
		};
	};
	var hideFilterBox = function () {
		var tid = getPostID("postTitleTextID");
		if ($("#" + tid + ":visible").length > 0) {
			$("#" + tid + ":visible").hide();
			getElement(tid).blur();
		};
	};
	var on_keydown = function (evt) {
		var tid = getPostID("postTitleTextID");
		var childid = getPostID("postChildID");
		switch (evt.keyCode) {
			case DOWN_ARROW:
			case RIGHT_ARROW:
				evt.preventDefault();
				evt.stopPropagation();
				//hideFilterBox();
				next();
				break;
			case UP_ARROW:
			case LEFT_ARROW:
				evt.preventDefault();
				evt.stopPropagation();
				//hideFilterBox();
				previous();
				break;
			case ESCAPE:
			case ENTER:
				evt.preventDefault();
				evt.stopPropagation();
				close();
				var selected = $("#" + childid + " li." + css.selected).length;	
				forcedTrigger = (oldSelected.length != selected || selected == 0) ? true : false;				
				fireAfterItemClicked();
				unbind_on_events(); //remove old one				
				lastTarget = null;			
				break;
			case SHIFT:
				shiftHolded = true;
				break;
			case CONTROL:
				controlHolded = true;
				break;
			default:
				if (evt.keyCode >= ALPHABETS_START && isList === false) {
					showFilterBox();
				};
				break;
		};
		if (isDisabled === true) return false;
		fireEventIfExist("keydown");
	};
	var on_keyup = function (evt) {
		switch (evt.keyCode) {
			case SHIFT:
				shiftHolded = false;
				break;
			case CONTROL:
				controlHolded = false;
				break;
		};
		if (isDisabled === true) return false;
		fireEventIfExist("keyup");
	};
	var on_dblclick = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("dblclick");
	};
	var on_mousemove = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("mousemove");
	};
	
	var on_mouseover = function (evt) {
		if (isDisabled === true) return false;
		evt.preventDefault();
		fireEventIfExist("mouseover");
	};
	var on_mouseout = function (evt) {
		if (isDisabled === true) return false;
		evt.preventDefault();
		fireEventIfExist("mouseout");
	};
	var on_mousedown = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("mousedown");
	};
	var on_mouseup = function (evt) {
		if (isDisabled === true) return false;
		fireEventIfExist("mouseup");
	};
	var option_has_handler = function (opt, name) {
		//True if a handler has been added in the html.
		var evt = {byElement: false, byJQuery: false, hasEvent: false};
		if ($(opt).prop("on" + name) != undefined) {
			evt.hasEvent = true;
			evt.byElement = true;
		};
		// True if a handler has been added using jQuery.
		var evs = $(opt).data("events");
		if (evs && evs[name]) {
			evt.hasEvent = true;
			evt.byJQuery = true;
		};
		return evt;
	};
	var fireOptionEventIfExist = function (li, evt_n) {
		if (settings.disabledOptionEvents == false) {
			var opt = getElement(element).options[getIndex(li)];
			//check if original has some
			if (option_has_handler(opt, evt_n).hasEvent === true) {
				if (option_has_handler(opt, evt_n).byElement === true) {
					opt["on" + evt_n]();
				};
				if (option_has_handler(opt, evt_n).byJQuery === true) {
					switch (evt_n) {
						case "keydown":
						case "keyup":
							//key down/up will check later
							break;
						default:
							$(opt).trigger(evt_n);
							break;
					};
				};
				return false;
			};
		};
	};
	var fireEventIfExist = function (evt_n) {
		//local
		if (typeof settings.on[evt_n] == "function") {
			settings.on[evt_n].apply(this, arguments);
		};
		//check if original has some
		if (has_handler(evt_n).hasEvent === true) {
			if (has_handler(evt_n).byElement === true) {
				getElement(element)["on" + evt_n]();
			} else if (has_handler(evt_n).byJQuery === true) {
				switch (evt_n) {
					case "keydown":
					case "keyup":
						//key down/up will check later
						break;
					default:
						$("#" + element).triggerHandler(evt_n);
						break;
				};
			};
			return false;
		};
	};
	/******************************* navigation **********************************************/
	var scrollToIfNeeded = function (opt) {
		var childid = getPostID("postChildID");
		//if scroll is needed
		opt = (opt !== undefined) ? opt : $("#" + childid + " li." + css.selected);
		if (opt.length > 0) {
			var pos = parseInt(($(opt).position().top));
			var ch = parseInt($("#" + childid).height());
			if (pos > ch) {
				var top = pos + $("#" + childid).scrollTop() - (ch/2);
				$("#" + childid).animate({scrollTop:top}, 500);
			};
		};
	};
	var next = function () {
		var childid = getPostID("postChildID");
		var items = $("#" + childid + " li:visible." + css_i.li);
		var selected = $("#" + childid + " li:visible." + css.selected);
		selected = (selected.length==0) ? items[0] : selected;
		var index = $("#" + childid + " li:visible." + css_i.li).index(selected);
		if ((index < items.length - 1)) {
			index = getNext(index);
			if (index < items.length) { //check again - hack for last disabled 
				if (!shiftHolded || !isList || !isMultiple) {
					$("#" + childid + " ." + css.selected).removeClass(css.selected);
				};
				$(items[index]).addClass(css.selected);
				updateTitleUI(index);
				if (isList == true) {
					fireAfterItemClicked();
				};
				scrollToIfNeeded($(items[index]));
			};
			if (!isList) {
				adjustOpen();
			};
		};	
		function getNext(ind) {
			ind = ind + 1;
			if (ind > items.length) {
				return ind;
			};
			if ($(items[ind]).hasClass(css.enabled) === true) {
				return ind;
			};
			return ind = getNext(ind);
		};
	};
	var previous = function () {
		var childid = getPostID("postChildID");
		var selected = $("#" + childid + " li:visible." + css.selected);
		var items = $("#" + childid + " li:visible." + css_i.li);
		var index = $("#" + childid + " li:visible." + css_i.li).index(selected[0]);
		if (index >= 0) {
			index = getPrev(index);
			if (index >= 0) { //check again - hack for disabled 
				if (!shiftHolded || !isList || !isMultiple) {
					$("#" + childid + " ." + css.selected).removeClass(css.selected);
				};
				$(items[index]).addClass(css.selected);
				updateTitleUI(index);
				if (isList == true) {
					fireAfterItemClicked();
				};
				if (parseInt(($(items[index]).position().top + $(items[index]).height())) <= 0) {
					var top = ($("#" + childid).scrollTop() - $("#" + childid).height()) - $(items[index]).height();
					$("#" + childid).animate({scrollTop: top}, 500);
				};
			};
			if (!isList) {
				adjustOpen();
			};
		};
	
		function getPrev(ind) {
			ind = ind - 1;
			if (ind < 0) {
				return ind;
			};
			if ($(items[ind]).hasClass(css.enabled) === true) {
				return ind;
			};
			return ind = getPrev(ind);
		};
	};
	var adjustOpen = function () {
		var id = getPostID("postID");
		var childid = getPostID("postChildID");
		var pos = $("#" + id).offset();
		var mH = $("#" + id).height();
		var wH = $(window).height();
		var st = $(window).scrollTop();
		var cH = $("#" + childid).height();
		var top = $("#" + id).height(); //this close so its title height
		var direction = settings.openDirection.toLowerCase();
		if (((wH + st) < Math.floor(cH + mH + pos.top) || direction == 'alwaysup') && direction != 'alwaysdown') {
			top = cH;
			$("#" + childid).css({top: "-" + top + "px", display: 'block', zIndex: settings.zIndex});			
			if(settings.roundedCorner == "true") {
				$("#" + id).removeClass("borderRadius borderRadiusTp").addClass("borderRadiusBtm");
			};
			var top = $("#" + childid).offset().top;
			if (top < -10) {
				$("#" + childid).css({top: (parseInt($("#" + childid).css("top")) - top + 20 + st) + "px", zIndex: settings.zIndex});
				if(settings.roundedCorner == "true") {
					$("#" + id).removeClass("borderRadiusBtm borderRadiusTp").addClass("borderRadius");
				};
			};
		} else {
			$("#" + childid).css({top: top + "px", zIndex: settings.zIndex});			
			if(settings.roundedCorner == "true") {
				$("#" + id).removeClass("borderRadius borderRadiusBtm").addClass("borderRadiusTp");
			};
		};
		//hack for ie zindex
		//i hate ie :D
		if(isIE) {
			if(msieversion()<=7) {
				$('div.ddcommon').css("zIndex", settings.zIndex-10);
				$("#" + id).css("zIndex", settings.zIndex+5);
			};
		};		
	};
	var open = function (e) {
		if (isDisabled === true) return false;
		var id = getPostID("postID");
		var childid = getPostID("postChildID");
		if (!isOpen) {
			isOpen = true;
			if (msBeautify.oldDiv != '') {
				$("#" + msBeautify.oldDiv).css({display: "none"}); //hide all 
			};
			msBeautify.oldDiv = childid;
			$("#" + childid + " li:hidden").show(); //show if hidden
			adjustOpen();
			var animStyle = settings.animStyle;
			if(animStyle=="" || animStyle=="none") {
				$("#" + childid).css({display:"block"});
				scrollToIfNeeded();
				if (typeof settings.on.open == "function") {
					var d = getDataAndUI();
					settings.on.open(d.data, d.ui);
				};
			} else {				
				$("#" + childid)[animStyle]("fast", function () {
					scrollToIfNeeded();
					if (typeof settings.on.open == "function") {
						var d = getDataAndUI();
						settings.on.open(d.data, d.ui);
					};
				});
			};
			bind_on_events();
		} else {
			if(settings.event!=='mouseover') {
				close();
			};
		};
	};
	var close = function (e) {
		isOpen = false;
		var id = getPostID("postID");
		var childid = getPostID("postChildID");
		if (isList === false || settings.enableCheckbox===true) {
			$("#" + childid).css({display: "none"});			
			if(settings.roundedCorner == "true") {
				$("#" + id).removeClass("borderRadiusTp borderRadiusBtm").addClass("borderRadius");
			};
		};
		unbind_on_events();
		if (typeof settings.on.close == "function") {
			var d = getDataAndUI();
			settings.on.close(d.data, d.ui);
		};
		//rest some old stuff
		hideFilterBox();
		childHeight(childHeight()); //its needed after filter applied
		$("#" + childid).css({zIndex:1});
		//update the title in case the user clicked outside
		updateTitleUI(getElement(element).selectedIndex);
	};
	/*********************** </layout> *************************************/	
	var mergeAllProp = function () {
		try {
			orginial = $.extend(true, {}, getElement(element));
			for (var i in orginial) {
				if (typeof orginial[i] != "function") {				
					$this[i] = orginial[i]; //properties
				};
			};
		} catch(e) {
			//silent
		};
		$this.selectedText = (getElement(element).selectedIndex >= 0) ? getElement(element).options[getElement(element).selectedIndex].text : "";		
		$this.version = msBeautify.version.msDropdown;
		$this.author = msBeautify.author;
	};
	var getDataAndUIByOption = function (opt) {
		if (opt != null && typeof opt != "undefined") {
			var childid = getPostID("postChildID");
			var data = parseOption(opt);
			var ui = $("#" + childid + " li." + css_i.li + ":eq(" + (opt.index) + ")");
			return {data: data, ui: ui, option: opt, index: opt.index};
		};
		return null;
	};
	var getDataAndUI = function () {
		var childid = getPostID("postChildID");
		var ele = getElement(element);
		var data, ui, option, index;
		if (ele.selectedIndex == -1) {
			data = null;
			ui = null;
			option = null;
			index = -1;
		} else {
			ui = $("#" + childid + " li." + css.selected);
			if (ui.length > 1) {
				var d = [], op = [], ind = [];
				for (var i = 0; i < ui.length; i++) {
					var pd = getIndex(ui[i]);
					d.push(pd);
					op.push(ele.options[pd]);
				};
				data = d;
				option = op;
				index = d;
			} else {
				option = ele.options[ele.selectedIndex];
				data = parseOption(option);
				index = ele.selectedIndex;
			};
		};
		return {data: data, ui: ui, index: index, option: option};
	};
	var updateTitleUI = function (index, byvalue) {
		var titleid = getPostID("postTitleID");
		var value = {};
		if (index == -1) {
			value.text = "&nbsp;";
			value.className = "";
			value.description = "";
			value.image = "";
		} else if (typeof index != "undefined") {
			var opt = getElement(element).options[index];
			value = parseOption(opt);
		} else {
			value = byvalue;
		};
		//update title and current
		$("#" + titleid).find("." + css.label).html(value.text);
		getElement(titleid).className = css.ddTitleText + " " + value.className;
		//update desction
		if (value.description != "") {
			$("#" + titleid).find("." + css.description).html(value.description).show();
		} else {
			$("#" + titleid).find("." + css.description).html("").hide();
		};
		//update icon
		var img = $("#" + titleid).find("img");
		if (img.length > 0) {
			$(img).remove();
		};
		if (value.image != "" && settings.showIcon) {
			img = createElement("img", {src: value.image});
			$("#" + titleid).prepend(img);
			if(value.imagecss!="") {
				img.className = value.imagecss+" ";
			};
			if (value.description == "") {
				img.className = img.className+css_i.fnone;
			};
		};
	};
	var updateProp = function (p, v) {
		$this[p] = v;
	};
	var updateUI = function (a, opt, i) { //action, index, opt
		var childid = getPostID("postChildID");
		var wasSelected = false;
		switch (a) {
			case "add":
				var li = createChild(opt || getElement(element).options[i]);				
				var index;
				if (arguments.length == 3) {
					index = i;
				} else {
					index = $("#" + childid + " li." + css_i.li).length - 1;
				};				
				if (index < 0 || !index) {
					$("#" + childid + " ul").append(li);
				} else {
					var at = $("#" + childid + " li." + css_i.li)[index];
					$(at).before(li);
				};
				removeChildEvents();
				applyChildEvents();
				if (settings.on.add != null) {
					settings.on.add.apply(this, arguments);
				};
				break;
			case "remove":
				wasSelected = $($("#" + childid + " li." + css_i.li)[i]).hasClass(css.selected);
				$("#" + childid + " li." + css_i.li + ":eq(" + i + ")").remove();
				var items = $("#" + childid + " li." + css.enabled);
				if (wasSelected == true) {
					if (items.length > 0) {
						$(items[0]).addClass(css.selected);
						var ind = $("#" + childid + " li." + css_i.li).index(items[0]);
						setValue(ind);
					};
				};
				if (items.length == 0) {
					setValue(-1);
				};
				if ($("#" + childid + " li." + css_i.li).length < settings.visibleRows && !isList) {
					childHeight(-1); //set autoheight
				};
				if (settings.on.remove != null) {
					settings.on.remove.apply(this, arguments);
				};
				break;
		};	
	};
	/************************** public methods/events **********************/
	this.act = function () {
		var action = arguments[0];
		Array.prototype.shift.call(arguments);
		switch (action) {
			case "add":
				$this.add.apply(this, arguments);
				break;
			case "remove":
				$this.remove.apply(this, arguments);
				break;
			default:
				try {
					getElement(element)[action].apply(getElement(element), arguments);
				} catch (e) {
					//there is some error.
				};
				break;
		};
	};
	
	this.add = function () {
		var text, value, title, image, description;
		var obj = arguments[0];		
		if (typeof obj == "string") {
			text = obj;
			value = text;
			opt = new Option(text, value);
		} else {
			text = obj.text || '';
			value = obj.value || text;
			title = obj.title || '';
			image = obj.image || '';
			description = obj.description || '';
			//image:imagePath, title:title, description:description, value:opt.value, text:opt.text, className:opt.className||""
			opt = new Option(text, value);
			$(opt).data("description", description);
			$(opt).data("image", image);
			$(opt).data("title", title);
		};
		arguments[0] = opt; //this option
		getElement(element).add.apply(getElement(element), arguments);
		updateProp("children", getElement(element)["children"]);
		updateProp("length", getElement(element).length);
		updateUI("add", opt, arguments[1]);
	};
	this.remove = function (i) {
		getElement(element).remove(i);
		updateProp("children", getElement(element)["children"]);
		updateProp("length", getElement(element).length);
		updateUI("remove", undefined, i);
	};
	this.set = function (prop, val) {
		if (typeof prop == "undefined" || typeof val == "undefined") return false;
		prop = prop.toString();
		try {
			updateProp(prop, val);
		} catch (e) {/*this is ready only */};
		switch (prop) {
			case "size":
				getElement(element)[prop] = val;
				if (val == 0) {
					getElement(element).multiple = false; //if size is zero multiple should be false
				};
				isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
				fixedForList();
				break;
			case "multiple":
				getElement(element)[prop] = val;
				isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
				isMultiple = getElement(element).multiple;
				fixedForList();
				updateProp(prop, val);
				break;
			case "disabled":
				getElement(element)[prop] = val;
				isDisabled = val;
				fixedForDisabled();
				break;
			case "selectedIndex":
			case "value":				
				if(prop=="selectedIndex" && isArray(val)===true) {
					$("#"+element +" option").prop("selected", false);
					selectMutipleOptions(val, true);
					selectUI_LI(val); //setValue is being called from selectMutipleOptions
				} else {
					getElement(element)[prop] = val;					
					selectUI_LI(getElement(element).selectedIndex);
					setValue(getElement(element).selectedIndex);
				};
				break;
			case "length":
				var childid = getPostID("postChildID");
				if (val < getElement(element).length) {
					getElement(element)[prop] = val;
					if (val == 0) {
						$("#" + childid + " li." + css_i.li).remove();
						setValue(-1);
					} else {
						$("#" + childid + " li." + css_i.li + ":gt(" + (val - 1) + ")").remove();
						if ($("#" + childid + " li." + css.selected).length == 0) {
							$("#" + childid + " li." + css.enabled + ":eq(0)").addClass(css.selected);
						};
					};
					updateProp(prop, val);
					updateProp("children", getElement(element)["children"]);
				};
				break;
			case "id":
				//please i need this. so preventing to change it. will work on this later
				break;
			default:
				//check if this is not a readonly properties
				try {
					getElement(element)[prop] = val;
					updateProp(prop, val);
				} catch (e) {
					//silent
				};
				break;
		};
	};
	this.get = function (prop) {
		return $this[prop] || getElement(element)[prop]; //return if local else from original
	};
	this.visible = function (val) {
		var id = getPostID("postID");		
		if (val === true) {
			$("#" + id).show();
		} else if (val === false) {
			$("#" + id).hide();
		} else {
			return ($("#" + id).css("display")=="none") ? false : true;
		};
	};
	this.debug = function (v) {
		msBeautify.debug(v);
	};
	this.close = function () {
		close();
	};
	this.open = function () {		
		open();
	};
	this.showRows = function (r) {
		if (typeof r == "undefined" || r == 0) {
			return false;
		};
		settings.visibleRows = r;
		childHeight(childHeight());
	};
	this.visibleRows = this.showRows;
	this.on = function (type, fn) {
		$("#" + element).on(type, fn);
	};
	this.off = function (type, fn) {
		$("#" + element).off(type, fn);
	};
	this.addMyEvent = this.on;
	this.getData = function () {
		return getDataAndUI()
	};
	this.namedItem = function () {
		var opt = getElement(element).namedItem.apply(getElement(element), arguments);
		return getDataAndUIByOption(opt);
	};
	this.item = function () {
		var opt = getElement(element).item.apply(getElement(element), arguments);
		return getDataAndUIByOption(opt);
	};	
	//v 3.2
	this.setIndexByValue = function(val) {
		this.set("value", val);
	};
	this.destroy = function () {
		var hidid = getPostID("postElementHolder");
		var id = getPostID("postID");
		$("#" + id + ", #" + id + " *").off();
		getElement(element).tabIndex = getElement(id).tabIndex;
		$("#" + id).remove();
		$("#" + element).parent().replaceWith($("#" + element));		
		$("#" + element).data("dd", null);
	};
	this.refresh = function() {
		setValue(getElement(element).selectedIndex);
	};
	//Create msDropDown	
	//********************************************************************
	
	//********************************************************************
	
	
	init();
};
//bind in jquery
$.fn.extend({
			msDropDown: function(settings)
			{
				return this.each(function()
				{
					if (!$(this).data('dd')){
						var mydropdown = new dd(this, settings);
						$(this).data('dd', mydropdown);
					};
				});
			}
});
$.fn.msDropdown = $.fn.msDropDown; //make a copy
})(jQuery);

		
			//document ready, load the page
$(document).ready(function() {
		$('#divUnit').load(staticContentLocation+"/html/main.html");
		$('#modalDiv').load(staticContentLocation+"/html/modal-template.html");		
		setTimeout(function(){ 
		setup.init();	
		}, 100);
	
});


