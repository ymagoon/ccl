try{ /*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
// i18next, v1.6.3
// Copyright (c)2013 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
(function() {

    // add indexOf to non ECMA-262 standard compliant browsers
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }

    // add lastIndexOf to non ECMA-262 standard compliant browsers
    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = len;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) {
                    n = 0;
                } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
            for (; k >= 0; k--) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    var root = this
      , $ = root.jQuery || root.Zepto
      , i18n = {}
      , resStore = {}
      , currentLng
      , replacementCounter = 0
      , languages = [];


    // Export the i18next object for **CommonJS**.
    // If we're not in CommonJS, add `i18n` to the
    // global object or to jquery.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = i18n;
    } else {
        if ($) {
            $.i18n = $.i18n || i18n;
        }

        root.i18n = root.i18n || i18n;
    }
    // defaults
    var o = {
        lng: undefined,
        load: 'all',
        preload: [],
        lowerCaseLng: false,
        returnObjectTrees: false,
        fallbackLng: 'dev',
        fallbackNS: [],
        detectLngQS: 'setLng',
        ns: 'translation',
        fallbackOnNull: true,
        fallbackToDefaultNS: false,
        nsseparator: ':',
        keyseparator: '.',
        selectorAttr: 'data-i18n',
        debug: false,

        resGetPath: 'locales/__lng__/__ns__.json',
        resPostPath: 'locales/add/__lng__/__ns__',

        getAsync: true,
        postAsync: true,

        resStore: undefined,
        useLocalStorage: false,
        localStorageExpirationTime: 7*24*60*60*1000,

        dynamicLoad: false,
        sendMissing: false,
        sendMissingTo: 'fallback', // current | all
        sendType: 'POST',

        interpolationPrefix: '__',
        interpolationSuffix: '__',
        reusePrefix: '$t(',
        reuseSuffix: ')',
        pluralSuffix: '_plural',
        pluralNotFound: ['plural_not_found', Math.random()].join(''),
        contextNotFound: ['context_not_found', Math.random()].join(''),
        escapeInterpolation: false,

        setJqueryExt: true,
        defaultValueFromContent: true,
        useDataAttrOptions: false,
        cookieExpirationTime: undefined,
        useCookie: true,
        cookieName: 'i18next',

        postProcess: undefined,
        parseMissingKey: undefined
    };
    function _extend(target, source) {
        if (!source || typeof source === 'function') {
            return target;
        }

        for (var attr in source) { target[attr] = source[attr]; }
        return target;
    }

    function _each(object, callback, args) {
        var name, i = 0,
            length = object.length,
            isObj = length === undefined || typeof object === "function";

        if (args) {
            if (isObj) {
                for (name in object) {
                    if (callback.apply(object[name], args) === false) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if (callback.apply(object[i++], args) === false) {
                        break;
                    }
                }
            }

        // A special, fast, case for the most common use of each
        } else {
            if (isObj) {
                for (name in object) {
                    if (callback.call(object[name], name, object[name]) === false) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if (callback.call(object[i], i, object[i++]) === false) {
                        break;
                    }
                }
            }
        }

        return object;
    }

    var _entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function _escape(data) {
        if (typeof data === 'string') {
            return data.replace(/[&<>"'\/]/g, function (s) {
                return _entityMap[s];
            });
        }else{
            return data;
        }
    }

    function _ajax(options) {

        // v0.5.0 of https://github.com/goloroden/http.js
        var getXhr = function (callback) {
            // Use the native XHR object if the browser supports it.
            if (window.XMLHttpRequest) {
                return callback(null, new XMLHttpRequest());
            } else if (window.ActiveXObject) {
                // In Internet Explorer check for ActiveX versions of the XHR object.
                try {
                    return callback(null, new ActiveXObject("Msxml2.XMLHTTP"));
                } catch (e) {
                    return callback(null, new ActiveXObject("Microsoft.XMLHTTP"));
                }
            }

            // If no XHR support was found, throw an error.
            return callback(new Error());
        };

        var encodeUsingUrlEncoding = function (data) {
            if(typeof data === 'string') {
                return data;
            }

            var result = [];
            for(var dataItem in data) {
                if(data.hasOwnProperty(dataItem)) {
                    result.push(encodeURIComponent(dataItem) + '=' + encodeURIComponent(data[dataItem]));
                }
            }

            return result.join('&');
        };

        var utf8 = function (text) {
            text = text.replace(/\r\n/g, '\n');
            var result = '';

            for(var i = 0; i < text.length; i++) {
                var c = text.charCodeAt(i);

                if(c < 128) {
                        result += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                        result += String.fromCharCode((c >> 6) | 192);
                        result += String.fromCharCode((c & 63) | 128);
                } else {
                        result += String.fromCharCode((c >> 12) | 224);
                        result += String.fromCharCode(((c >> 6) & 63) | 128);
                        result += String.fromCharCode((c & 63) | 128);
                }
            }

            return result;
        };

        var base64 = function (text) {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            text = utf8(text);
            var result = '',
                    chr1, chr2, chr3,
                    enc1, enc2, enc3, enc4,
                    i = 0;

            do {
                chr1 = text.charCodeAt(i++);
                chr2 = text.charCodeAt(i++);
                chr3 = text.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if(isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if(isNaN(chr3)) {
                    enc4 = 64;
                }

                result +=
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = '';
                enc1 = enc2 = enc3 = enc4 = '';
            } while(i < text.length);

            return result;
        };

        var mergeHeaders = function () {
            // Use the first header object as base.
            var result = arguments[0];

            // Iterate through the remaining header objects and add them.
            for(var i = 1; i < arguments.length; i++) {
                var currentHeaders = arguments[i];
                for(var header in currentHeaders) {
                    if(currentHeaders.hasOwnProperty(header)) {
                        result[header] = currentHeaders[header];
                    }
                }
            }

            // Return the merged headers.
            return result;
        };

        var ajax = function (method, url, options, callback) {
            // Adjust parameters.
            if(typeof options === 'function') {
                callback = options;
                options = {};
            }

            // Set default parameter values.
            options.cache = options.cache || false;
            options.data = options.data || {};
            options.headers = options.headers || {};
            options.jsonp = options.jsonp || false;
            options.async = options.async === undefined ? true : options.async;

            // Merge the various header objects.
            var headers = mergeHeaders({
                'accept': '*/*',
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }, ajax.headers, options.headers);

            // Encode the data according to the content-type.
            var payload;
            if (headers['content-type'] === 'application/json') {
                payload = JSON.stringify(options.data);
            } else {
                payload = encodeUsingUrlEncoding(options.data);
            }

            // Specially prepare GET requests: Setup the query string, handle caching and make a JSONP call
            // if neccessary.
            if(method === 'GET') {
                // Setup the query string.
                var queryString = [];
                if(payload) {
                    queryString.push(payload);
                    payload = null;
                }

                // Handle caching.
                if(!options.cache) {
                    queryString.push('_=' + (new Date()).getTime());
                }

                // If neccessary prepare the query string for a JSONP call.
                if(options.jsonp) {
                    queryString.push('callback=' + options.jsonp);
                    queryString.push('jsonp=' + options.jsonp);
                }

                // Merge the query string and attach it to the url.
                queryString = queryString.join('&');
                if (queryString.length > 1) {
                    if (url.indexOf('?') > -1) {
                        url += '&' + queryString;
                    } else {
                        url += '?' + queryString;
                    }
                }

                // Make a JSONP call if neccessary.
                if(options.jsonp) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    head.appendChild(script);
                    return;
                }
            }

            // Since we got here, it is no JSONP request, so make a normal XHR request.
            getXhr(function (err, xhr) {
                if(err) return callback(err);

                // Open the request.
                xhr.open(method, url, options.async);

                // Set the request headers.
                for(var header in headers) {
                    if(headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }

                // Handle the request events.
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === 4) {
                        var data = xhr.responseText || '';

                        // If no callback is given, return.
                        if(!callback) {
                            return;
                        }

                        // Return an object that provides access to the data as text and JSON.
                        callback(xhr.status, {
                            text: function () {
                                return data;
                            },

                            json: function () {
                                return JSON.parse(data);
                            }
                        });
                    }
                };

                // Actually send the XHR request.
                xhr.send(payload);
            });
        };

        // Define the external interface.
        var http = {
            authBasic: function (username, password) {
                ajax.headers['Authorization'] = 'Basic ' + base64(username + ':' + password);
            },

            connect: function (url, options, callback) {
                return ajax('CONNECT', url, options, callback);
            },

            del: function (url, options, callback) {
                return ajax('DELETE', url, options, callback);
            },

            get: function (url, options, callback) {
                return ajax('GET', url, options, callback);
            },

            head: function (url, options, callback) {
                return ajax('HEAD', url, options, callback);
            },

            headers: function (headers) {
                ajax.headers = headers || {};
            },

            isAllowed: function (url, verb, callback) {
                this.options(url, function (status, data) {
                    callback(data.text().indexOf(verb) !== -1);
                });
            },

            options: function (url, options, callback) {
                return ajax('OPTIONS', url, options, callback);
            },

            patch: function (url, options, callback) {
                return ajax('PATCH', url, options, callback);
            },

            post: function (url, options, callback) {
                return ajax('POST', url, options, callback);
            },

            put: function (url, options, callback) {
                return ajax('PUT', url, options, callback);
            },

            trace: function (url, options, callback) {
                return ajax('TRACE', url, options, callback);
            }
        };


        var methode = options.type ? options.type.toLowerCase() : 'get';

        http[methode](options.url, options, function (status, data) {
            if (status === 200) {
                options.success(data.json(), status, null);
            } else {
                options.error(data.text(), status, null);
            }
        });
    }

    var _cookie = {
        create: function(name,value,minutes) {
            var expires;
            if (minutes) {
                var date = new Date();
                didiscxern.setTime(date.getTime()+(minutes*60*1000));
                expires = "; expires="+date.toGMTString();
            }
            else expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        },

        read: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },

        remove: function(name) {
            this.create(name,"",-1);
        }
    };

    var cookie_noop = {
        create: function(name,value,minutes) {},
        read: function(name) { return null; },
        remove: function(name) {}
    };



    // move dependent functions to a container so that
    // they can be overriden easier in no jquery environment (node.js)
    var f = {
        extend: $ ? $.extend : _extend,
        each: $ ? $.each : _each,
        ajax: $ ? $.ajax : _ajax,
        cookie: typeof document !== 'undefined' ? _cookie : cookie_noop,
        detectLanguage: detectLanguage,
        escape: _escape,
        log: function(str) {
            if (o.debug && typeof console !== "undefined") console.log(str);
        },
        toLanguages: function(lng) {
            var languages = [];
            if (typeof lng === 'string' && lng.indexOf('-') > -1) {
                var parts = lng.split('-');

                lng = o.lowerCaseLng ?
                    parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                    parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();

                if (o.load !== 'unspecific') languages.push(lng);
                if (o.load !== 'current') languages.push(parts[0]);
            } else {
                languages.push(lng);
            }

            if (languages.indexOf(o.fallbackLng) === -1 && o.fallbackLng) languages.push(o.fallbackLng);

            return languages;
        },
        regexEscape: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
    };
    function init(options, cb) {

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = options || {};

        // override defaults with passed in options
        f.extend(o, options);

        // create namespace object if namespace is passed in as string
        if (typeof o.ns == 'string') {
            o.ns = { namespaces: [o.ns], defaultNs: o.ns};
        }

        // fallback namespaces
        if (typeof o.fallbackNS == 'string') {
            o.fallbackNS = [o.fallbackNS];
        }

        // escape prefix/suffix
        o.interpolationPrefixEscaped = f.regexEscape(o.interpolationPrefix);
        o.interpolationSuffixEscaped = f.regexEscape(o.interpolationSuffix);

        if (!o.lng) o.lng = f.detectLanguage();
        if (o.lng) {
            // set cookie with lng set (as detectLanguage will set cookie on need)
            if (o.useCookie) f.cookie.create(o.cookieName, o.lng, o.cookieExpirationTime);
        } else {
            o.lng =  o.fallbackLng;
            if (o.useCookie) f.cookie.remove(o.cookieName);
        }

        languages = f.toLanguages(o.lng);
        currentLng = languages[0];
        f.log('currentLng set to: ' + currentLng);

        pluralExtensions.setCurrentLng(currentLng);

        // add JQuery extensions
        if ($ && o.setJqueryExt) addJqueryFunct();

        // jQuery deferred
        var deferred;
        if ($ && $.Deferred) {
            deferred = $.Deferred();
        }

        // return immidiatly if res are passed in
        if (o.resStore) {
            resStore = o.resStore;
            if (cb) cb(translate);
            if (deferred) deferred.resolve();
            if (deferred) return deferred.promise();
            return;
        }

        // languages to load
        var lngsToLoad = f.toLanguages(o.lng);
        if (typeof o.preload === 'string') o.preload = [o.preload];
        for (var i = 0, l = o.preload.length; i < l; i++) {
            var pres = f.toLanguages(o.preload[i]);
            for (var y = 0, len = pres.length; y < len; y++) {
                if (lngsToLoad.indexOf(pres[y]) < 0) {
                    lngsToLoad.push(pres[y]);
                }
            }
        }

        // else load them
        i18n.sync.load(lngsToLoad, o, function(err, store) {
            resStore = store;

            if (cb) cb(translate);
            if (deferred) deferred.resolve();
        });

        if (deferred) return deferred.promise();
    }
    function preload(lngs, cb) {
        if (typeof lngs === 'string') lngs = [lngs];
        for (var i = 0, l = lngs.length; i < l; i++) {
            if (o.preload.indexOf(lngs[i]) < 0) {
                o.preload.push(lngs[i]);
            }
        }
        return init(cb);
    }

    function addResourceBundle(lng, ns, resources) {
        if (typeof ns !== 'string') {
            resources = ns;
            ns = o.ns.defaultNs;
        } else if (o.ns.namespaces.indexOf(ns) < 0) {
            o.ns.namespaces.push(ns);
        }

        resStore[lng] = resStore[lng] || {};
        resStore[lng][ns] = resStore[lng][ns] || {};
        f.extend(resStore[lng][ns], resources);
    }

    function setDefaultNamespace(ns) {
        o.ns.defaultNs = ns;
    }

    function loadNamespace(namespace, cb) {
        loadNamespaces([namespace], cb);
    }

    function loadNamespaces(namespaces, cb) {
        var opts = {
            dynamicLoad: o.dynamicLoad,
            resGetPath: o.resGetPath,
            getAsync: o.getAsync,
            customLoad: o.customLoad,
            ns: { namespaces: namespaces, defaultNs: ''} /* new namespaces to load */
        };

        // languages to load
        var lngsToLoad = f.toLanguages(o.lng);
        if (typeof o.preload === 'string') o.preload = [o.preload];
        for (var i = 0, l = o.preload.length; i < l; i++) {
            var pres = f.toLanguages(o.preload[i]);
            for (var y = 0, len = pres.length; y < len; y++) {
                if (lngsToLoad.indexOf(pres[y]) < 0) {
                    lngsToLoad.push(pres[y]);
                }
            }
        }

        // check if we have to load
        var lngNeedLoad = [];
        for (var a = 0, lenA = lngsToLoad.length; a < lenA; a++) {
            var needLoad = false;
            var resSet = resStore[lngsToLoad[a]];
            if (resSet) {
                for (var b = 0, lenB = namespaces.length; b < lenB; b++) {
                    if (!resSet[namespaces[b]]) needLoad = true;
                }
            } else {
                needLoad = true;
            }

            if (needLoad) lngNeedLoad.push(lngsToLoad[a]);
        }

        if (lngNeedLoad.length) {
            i18n.sync._fetch(lngNeedLoad, opts, function(err, store) {
                var todo = namespaces.length * lngNeedLoad.length;

                // load each file individual
                f.each(namespaces, function(nsIndex, nsValue) {

                    // append namespace to namespace array
                    if (o.ns.namespaces.indexOf(nsValue) < 0) {
                        o.ns.namespaces.push(nsValue);
                    }

                    f.each(lngNeedLoad, function(lngIndex, lngValue) {
                        resStore[lngValue] = resStore[lngValue] || {};
                        resStore[lngValue][nsValue] = store[lngValue][nsValue];

                        todo--; // wait for all done befor callback
                        if (todo === 0 && cb) {
                            if (o.useLocalStorage) i18n.sync._storeLocal(resStore);
                            cb();
                        }
                    });
                });
            });
        } else {
            if (cb) cb();
        }
    }

    function setLng(lng, cb) {
        return init({lng: lng}, cb);
    }

    function lng() {
        return currentLng;
    }
    function addJqueryFunct() {
        // $.t shortcut
        $.t = $.t || translate;

        function parse(ele, key, options) {
            if (key.length === 0) return;

            var attr = 'text';

            if (key.indexOf('[') === 0) {
                var parts = key.split(']');
                key = parts[1];
                attr = parts[0].substr(1, parts[0].length-1);
            }

            if (key.indexOf(';') === key.length-1) {
                key = key.substr(0, key.length-2);
            }

            var optionsToUse;
            if (attr === 'html') {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.html($.t(key, optionsToUse));
            }
            else if (attr === 'text') {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.text() }, options) : options;
                ele.text($.t(key, optionsToUse));
            } else {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.attr(attr) }, options) : options;
                ele.attr(attr, $.t(key, optionsToUse));
            }
        }

        function localize(ele, options) {
            var key = ele.attr(o.selectorAttr);
            if (!key) return;

            var target = ele
              , targetSelector = ele.data("i18n-target");
            if (targetSelector) {
                target = ele.find(targetSelector) || ele;
            }

            if (!options && o.useDataAttrOptions === true) {
                options = ele.data("i18n-options");
            }
            options = options || {};

            if (key.indexOf(';') >= 0) {
                var keys = key.split(';');

                $.each(keys, function(m, k) {
                    if (k !== '') parse(target, k, options);
                });

            } else {
                parse(target, key, options);
            }

            if (o.useDataAttrOptions === true) ele.data("i18n-options", options);
        }

        // fn
        $.fn.i18n = function (options) {
            return this.each(function() {
                // localize element itself
                localize($(this), options);

                // localize childs
                var elements =  $(this).find('[' + o.selectorAttr + ']');
                elements.each(function() {
                    localize($(this), options);
                });
            });
        };
    }
    function applyReplacement(str, replacementHash, nestedKey, options) {
        if (!str) return str;

        options = options || replacementHash; // first call uses replacement hash combined with options
        if (str.indexOf(options.interpolationPrefix || o.interpolationPrefix) < 0) return str;

        var prefix = options.interpolationPrefix ? f.regexEscape(options.interpolationPrefix) : o.interpolationPrefixEscaped
          , suffix = options.interpolationSuffix ? f.regexEscape(options.interpolationSuffix) : o.interpolationSuffixEscaped
          , unEscapingSuffix = 'HTML'+suffix;

        f.each(replacementHash, function(key, value) {
            var nextKey = nestedKey ? nestedKey + o.keyseparator + key : key;
            if (typeof value === 'object' && value !== null) {
                str = applyReplacement(str, value, nextKey, options);
            } else {
                if (options.escapeInterpolation || o.escapeInterpolation) {
                    str = str.replace(new RegExp([prefix, nextKey, unEscapingSuffix].join(''), 'g'), value);
                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), f.escape(value));
                } else {
                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), value);
                }
                // str = options.escapeInterpolation;
            }
        });
        return str;
    }

    // append it to functions
    f.applyReplacement = applyReplacement;

    function applyReuse(translated, options) {
        var comma = ',';
        var options_open = '{';
        var options_close = '}';

        var opts = f.extend({}, options);
        delete opts.postProcess;

        while (translated.indexOf(o.reusePrefix) != -1) {
            replacementCounter++;
            if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
            var index_of_opening = translated.lastIndexOf(o.reusePrefix);
            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
            var token = translated.substring(index_of_opening, index_of_end_of_closing);
            var token_without_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');


            if (token_without_symbols.indexOf(comma) != -1) {
                var index_of_token_end_of_closing = token_without_symbols.indexOf(comma);
                if (token_without_symbols.indexOf(options_open, index_of_token_end_of_closing) != -1 && token_without_symbols.indexOf(options_close, index_of_token_end_of_closing) != -1) {
                    var index_of_opts_opening = token_without_symbols.indexOf(options_open, index_of_token_end_of_closing);
                    var index_of_opts_end_of_closing = token_without_symbols.indexOf(options_close, index_of_opts_opening) + options_close.length;
                    try {
                        opts = f.extend(opts, JSON.parse(token_without_symbols.substring(index_of_opts_opening, index_of_opts_end_of_closing)));
                        token_without_symbols = token_without_symbols.substring(0, index_of_token_end_of_closing);
                    } catch (e) {
                    }
                }
            }

            var translated_token = _translate(token_without_symbols, opts);
            translated = translated.replace(token, translated_token);
        }
        return translated;
    }

    function hasContext(options) {
        return (options.context && typeof options.context == 'string');
    }

    function needsPlural(options) {
        return (options.count !== undefined && typeof options.count != 'string' && options.count !== 1);
    }

    function exists(key, options) {
        options = options || {};

        var notFound = options.defaultValue || key
            , found = _find(key, options);

        return found !== undefined || found === notFound;
    }

    function translate(key, options) {
        replacementCounter = 0;
        return _translate.apply(null, arguments);
    }

    function _injectSprintfProcessor() {

        var values = [];

        // mh: build array from second argument onwards
        for (var i = 1; i < arguments.length; i++) {
            values.push(arguments[i]);
        }

        return {
            postProcess: 'sprintf',
            sprintf:     values
        };
    }

    function _translate(key, options) {

        if (typeof options == 'string') {
            // mh: gettext like sprintf syntax found, automatically create sprintf processor
            options = _injectSprintfProcessor.apply(null, arguments);
        } else {
            options = options || {};
        }

        var notFound = options.defaultValue || key
            , found = _find(key, options)
            , lngs = options.lng ? f.toLanguages(options.lng) : languages
            , ns = options.ns || o.ns.defaultNs
            , parts;

        // split ns and key
        if (key.indexOf(o.nsseparator) > -1) {
            parts = key.split(o.nsseparator);
            ns = parts[0];
            key = parts[1];
        }

        if (found === undefined && o.sendMissing) {
            if (options.lng) {
                sync.postMissing(lngs[0], ns, key, notFound, lngs);
            } else {
                sync.postMissing(o.lng, ns, key, notFound, lngs);
            }
        }

        var postProcessor = options.postProcess || o.postProcess;
        if (found !== undefined && postProcessor) {
            if (postProcessors[postProcessor]) {
                found = postProcessors[postProcessor](found, key, options);
            }
        }

        // process notFound if function exists
        var splitNotFound = notFound;
        if (notFound.indexOf(o.nsseparator) > -1) {
            parts = notFound.split(o.nsseparator);
            splitNotFound = parts[1];
        }
        if (splitNotFound === key && o.parseMissingKey) {
            notFound = o.parseMissingKey(notFound);
        }

        if (found === undefined) {
            notFound = applyReplacement(notFound, options);
            notFound = applyReuse(notFound, options);

            if (postProcessor && postProcessors[postProcessor]) {
                var val = options.defaultValue || key;
                found = postProcessors[postProcessor](val, key, options);
            }
        }

        return (found !== undefined) ? found : notFound;
    }

    function _find(key, options){
        options = options || {};

        var optionWithoutCount, translated
            , notFound = options.defaultValue || key
            , lngs = languages;

        if (!resStore) { return notFound; } // no resStore to translate from

        if (options.lng) {
            lngs = f.toLanguages(options.lng);

            if (!resStore[lngs[0]]) {
                var oldAsync = o.getAsync;
                o.getAsync = false;

                i18n.sync.load(lngs, o, function(err, store) {
                    f.extend(resStore, store);
                    o.getAsync = oldAsync;
                });
            }
        }

        var ns = options.ns || o.ns.defaultNs;
        if (key.indexOf(o.nsseparator) > -1) {
            var parts = key.split(o.nsseparator);
            ns = parts[0];
            key = parts[1];
        }

        if (hasContext(options)) {
            optionWithoutCount = f.extend({}, options);
            delete optionWithoutCount.context;
            optionWithoutCount.defaultValue = o.contextNotFound;

            var contextKey = ns + o.nsseparator + key + '_' + options.context;

            translated = translate(contextKey, optionWithoutCount);
            if (translated != o.contextNotFound) {
                return applyReplacement(translated, { context: options.context }); // apply replacement for context only
            } // else continue translation with original/nonContext key
        }

        if (needsPlural(options)) {
            optionWithoutCount = f.extend({}, options);
            delete optionWithoutCount.count;
            optionWithoutCount.defaultValue = o.pluralNotFound;

            var pluralKey = ns + o.nsseparator + key + o.pluralSuffix;
            var pluralExtension = pluralExtensions.get(lngs[0], options.count);
            if (pluralExtension >= 0) {
                pluralKey = pluralKey + '_' + pluralExtension;
            } else if (pluralExtension === 1) {
                pluralKey = ns + o.nsseparator + key; // singular
            }

            translated = translate(pluralKey, optionWithoutCount);
            if (translated != o.pluralNotFound) {
                return applyReplacement(translated, {
                    count: options.count,
                    interpolationPrefix: options.interpolationPrefix,
                    interpolationSuffix: options.interpolationSuffix
                }); // apply replacement for count only
            } // else continue translation with original/singular key
        }

        var found;
        var keys = key.split(o.keyseparator);
        for (var i = 0, len = lngs.length; i < len; i++ ) {
            if (found !== undefined) break;

            var l = lngs[i];

            var x = 0;
            var value = resStore[l] && resStore[l][ns];
            while (keys[x]) {
                value = value && value[keys[x]];
                x++;
            }
            if (value !== undefined) {
                if (typeof value === 'string') {
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                } else if (Object.prototype.toString.apply(value) === '[object Array]' && !o.returnObjectTrees && !options.returnObjectTrees) {
                    value = value.join('\n');
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                } else if (value === null && o.fallbackOnNull === true) {
                    value = undefined;
                } else if (value !== null) {
                    if (!o.returnObjectTrees && !options.returnObjectTrees) {
                        value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' +
                            'returned a object instead of string.';
                        f.log(value);
                    } else {
                        var copy = {}; // apply child translation on a copy
                        for (var m in value) {
                            // apply translation on childs
                            copy[m] = _translate(ns + o.nsseparator + key + o.keyseparator + m, options);
                        }
                        value = copy;
                    }
                }
                found = value;
            }
        }

        if (found === undefined && !options.isFallbackLookup && (o.fallbackToDefaultNS === true || (o.fallbackNS && o.fallbackNS.length > 0))) {
            // set flag for fallback lookup - avoid recursion
            options.isFallbackLookup = true;

            if (o.fallbackNS.length) {

                for (var y = 0, lenY = o.fallbackNS.length; y < lenY; y++) {
                    found = _find(o.fallbackNS[y] + o.nsseparator + key, options);

                    if (found) {
                        /* compare value without namespace */
                        var foundValue = found.indexOf(o.nsseparator) > -1 ? found.split(o.nsseparator)[1] : found
                          , notFoundValue = notFound.indexOf(o.nsseparator) > -1 ? notFound.split(o.nsseparator)[1] : notFound;

                        if (foundValue !== notFoundValue) break;
                    }
                }
            } else {
                found = _find(key, options); // fallback to default NS
            }
        }

        return found;
    }
    function detectLanguage() {
        var detectedLng;

        // get from qs
        var qsParm = [];
        if (typeof window !== 'undefined') {
            (function() {
                var query = window.location.search.substring(1);
                var parms = query.split('&');
                for (var i=0; i<parms.length; i++) {
                    var pos = parms[i].indexOf('=');
                    if (pos > 0) {
                        var key = parms[i].substring(0,pos);
                        var val = parms[i].substring(pos+1);
                        qsParm[key] = val;
                    }
                }
            })();
            if (qsParm[o.detectLngQS]) {
                detectedLng = qsParm[o.detectLngQS];
            }
        }

        // get from cookie
        if (!detectedLng && typeof document !== 'undefined' && o.useCookie ) {
            var c = f.cookie.read(o.cookieName);
            if (c) detectedLng = c;
        }

        // get from navigator
        if (!detectedLng && typeof navigator !== 'undefined') {
            detectedLng =  (navigator.language) ? navigator.language : navigator.userLanguage;
        }

        return detectedLng;
    }
    var sync = {

        load: function(lngs, options, cb) {
            if (options.useLocalStorage) {
                sync._loadLocal(lngs, options, function(err, store) {
                    var missingLngs = [];
                    for (var i = 0, len = lngs.length; i < len; i++) {
                        if (!store[lngs[i]]) missingLngs.push(lngs[i]);
                    }

                    if (missingLngs.length > 0) {
                        sync._fetch(missingLngs, options, function(err, fetched) {
                            f.extend(store, fetched);
                            sync._storeLocal(fetched);

                            cb(null, store);
                        });
                    } else {
                        cb(null, store);
                    }
                });
            } else {
                sync._fetch(lngs, options, function(err, store){
                    cb(null, store);
                });
            }
        },

        _loadLocal: function(lngs, options, cb) {
            var store = {}
              , nowMS = new Date().getTime();

            if(window.localStorage) {

                var todo = lngs.length;

                f.each(lngs, function(key, lng) {
                    var local = window.localStorage.getItem('res_' + lng);

                    if (local) {
                        local = JSON.parse(local);

                        if (local.i18nStamp && local.i18nStamp + options.localStorageExpirationTime > nowMS) {
                            store[lng] = local;
                        }
                    }

                    todo--; // wait for all done befor callback
                    if (todo === 0) cb(null, store);
                });
            }
        },

        _storeLocal: function(store) {
            if(window.localStorage) {
                for (var m in store) {
                    store[m].i18nStamp = new Date().getTime();
                    window.localStorage.setItem('res_' + m, JSON.stringify(store[m]));
                }
            }
            return;
        },

        _fetch: function(lngs, options, cb) {
            var ns = options.ns
              , store = {};

            if (!options.dynamicLoad) {
                var todo = ns.namespaces.length * lngs.length
                  , errors;

                // load each file individual
                f.each(ns.namespaces, function(nsIndex, nsValue) {
                    f.each(lngs, function(lngIndex, lngValue) {

                        // Call this once our translation has returned.
                        var loadComplete = function(err, data) {
                            if (err) {
                                errors = errors || [];
                                errors.push(err);
                            }
                            store[lngValue] = store[lngValue] || {};
                            store[lngValue][nsValue] = data;

                            todo--; // wait for all done befor callback
                            if (todo === 0) cb(errors, store);
                        };

                        if(typeof options.customLoad == 'function'){
                            // Use the specified custom callback.
                            options.customLoad(lngValue, nsValue, options, loadComplete);
                        } else {
                            //~ // Use our inbuilt sync.
                            sync._fetchOne(lngValue, nsValue, options, loadComplete);
                        }
                    });
                });
            } else {
                // Call this once our translation has returned.
                var loadComplete = function(err, data) {
                    cb(null, data);
                };

                if(typeof options.customLoad == 'function'){
                    // Use the specified custom callback.
                    options.customLoad(lngs, ns.namespaces, options, loadComplete);
                } else {
                    var url = applyReplacement(options.resGetPath, { lng: lngs.join('+'), ns: ns.namespaces.join('+') });
                    // load all needed stuff once
                    f.ajax({
                        url: url,
                        success: function(data, status, xhr) {
                            f.log('loaded: ' + url);
                            loadComplete(null, data);
                        },
                        error : function(xhr, status, error) {
                            f.log('failed loading: ' + url);
                            loadComplete('failed loading resource.json error: ' + error);
                        },
                        dataType: "json",
                        async : options.getAsync
                    });
                }
            }
        },

        _fetchOne: function(lng, ns, options, done) {
            var url = applyReplacement(options.resGetPath, { lng: lng, ns: ns });
            f.ajax({
                url: url,
                success: function(data, status, xhr) {
                    f.log('loaded: ' + url);
                    done(null, data);
                },
                error : function(xhr, status, error) {
                    f.log('failed loading: ' + url);
                    done(error, {});
                },
                dataType: "json",
                async : options.getAsync
            });
        },

        postMissing: function(lng, ns, key, defaultValue, lngs) {
            var payload = {};
            payload[key] = defaultValue;

            var urls = [];

            if (o.sendMissingTo === 'fallback' && o.fallbackLng !== false) {
                urls.push({lng: o.fallbackLng, url: applyReplacement(o.resPostPath, { lng: o.fallbackLng, ns: ns })});
            } else if (o.sendMissingTo === 'current' || (o.sendMissingTo === 'fallback' && o.fallbackLng === false) ) {
                urls.push({lng: lng, url: applyReplacement(o.resPostPath, { lng: lng, ns: ns })});
            } else if (o.sendMissingTo === 'all') {
                for (var i = 0, l = lngs.length; i < l; i++) {
                    urls.push({lng: lngs[i], url: applyReplacement(o.resPostPath, { lng: lngs[i], ns: ns })});
                }
            }

            for (var y = 0, len = urls.length; y < len; y++) {
                var item = urls[y];
                f.ajax({
                    url: item.url,
                    type: o.sendType,
                    data: payload,
                    success: function(data, status, xhr) {
                        f.log('posted missing key \'' + key + '\' to: ' + item.url);

                        // add key to resStore
                        var keys = key.split('.');
                        var x = 0;
                        var value = resStore[item.lng][ns];
                        while (keys[x]) {
                            if (x === keys.length - 1) {
                                value = value[keys[x]] = defaultValue;
                            } else {
                                value = value[keys[x]] = value[keys[x]] || {};
                            }
                            x++;
                        }
                    },
                    error : function(xhr, status, error) {
                        f.log('failed posting missing key \'' + key + '\' to: ' + item.url);
                    },
                    dataType: "json",
                    async : o.postAsync
                });
            }
        }
    };
    // definition http://translate.sourceforge.net/wiki/l10n/pluralforms
    var pluralExtensions = {

        rules: {
            "ach": {
                "name": "Acholi",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "af": {
                "name": "Afrikaans",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ak": {
                "name": "Akan",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "am": {
                "name": "Amharic",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "an": {
                "name": "Aragonese",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ar": {
                "name": "Arabic",
                "numbers": [
                    0,
                    1,
                    2,
                    3,
                    11,
                    100
                ],
                "plurals": function(n) { return Number(n===0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5); }
            },
            "arn": {
                "name": "Mapudungun",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "ast": {
                "name": "Asturian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ay": {
                "name": "Aymar\u00e1",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "az": {
                "name": "Azerbaijani",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "be": {
                "name": "Belarusian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "bg": {
                "name": "Bulgarian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "bn": {
                "name": "Bengali",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "bo": {
                "name": "Tibetan",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "br": {
                "name": "Breton",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "bs": {
                "name": "Bosnian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "ca": {
                "name": "Catalan",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "cgg": {
                "name": "Chiga",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "cs": {
                "name": "Czech",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }
            },
            "csb": {
                "name": "Kashubian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "cy": {
                "name": "Welsh",
                "numbers": [
                    1,
                    2,
                    3,
                    8
                ],
                "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3); }
            },
            "da": {
                "name": "Danish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "de": {
                "name": "German",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "dz": {
                "name": "Dzongkha",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "el": {
                "name": "Greek",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "en": {
                "name": "English",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "eo": {
                "name": "Esperanto",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "es": {
                "name": "Spanish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "es_ar": {
                "name": "Argentinean Spanish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "et": {
                "name": "Estonian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "eu": {
                "name": "Basque",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "fa": {
                "name": "Persian",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "fi": {
                "name": "Finnish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "fil": {
                "name": "Filipino",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "fo": {
                "name": "Faroese",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "fr": {
                "name": "French",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "fur": {
                "name": "Friulian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "fy": {
                "name": "Frisian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ga": {
                "name": "Irish",
                "numbers": [
                    1,
                    2,
                    3,
                    7,
                    11
                ],
                "plurals": function(n) { return Number(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4) ;}
            },
            "gd": {
                "name": "Scottish Gaelic",
                "numbers": [
                    1,
                    2,
                    3,
                    20
                ],
                "plurals": function(n) { return Number((n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3); }
            },
            "gl": {
                "name": "Galician",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "gu": {
                "name": "Gujarati",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "gun": {
                "name": "Gun",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "ha": {
                "name": "Hausa",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "he": {
                "name": "Hebrew",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "hi": {
                "name": "Hindi",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "hr": {
                "name": "Croatian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "hu": {
                "name": "Hungarian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "hy": {
                "name": "Armenian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ia": {
                "name": "Interlingua",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "id": {
                "name": "Indonesian",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "is": {
                "name": "Icelandic",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n%10!=1 || n%100==11); }
            },
            "it": {
                "name": "Italian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ja": {
                "name": "Japanese",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "jbo": {
                "name": "Lojban",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "jv": {
                "name": "Javanese",
                "numbers": [
                    0,
                    1
                ],
                "plurals": function(n) { return Number(n !== 0); }
            },
            "ka": {
                "name": "Georgian",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "kk": {
                "name": "Kazakh",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "km": {
                "name": "Khmer",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "kn": {
                "name": "Kannada",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ko": {
                "name": "Korean",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "ku": {
                "name": "Kurdish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "kw": {
                "name": "Cornish",
                "numbers": [
                    1,
                    2,
                    3,
                    4
                ],
                "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3); }
            },
            "ky": {
                "name": "Kyrgyz",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "lb": {
                "name": "Letzeburgesch",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ln": {
                "name": "Lingala",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "lo": {
                "name": "Lao",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "lt": {
                "name": "Lithuanian",
                "numbers": [
                    1,
                    2,
                    10
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "lv": {
                "name": "Latvian",
                "numbers": [
                    0,
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n !== 0 ? 1 : 2); }
            },
            "mai": {
                "name": "Maithili",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "mfe": {
                "name": "Mauritian Creole",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "mg": {
                "name": "Malagasy",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "mi": {
                "name": "Maori",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "mk": {
                "name": "Macedonian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n==1 || n%10==1 ? 0 : 1); }
            },
            "ml": {
                "name": "Malayalam",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "mn": {
                "name": "Mongolian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "mnk": {
                "name": "Mandinka",
                "numbers": [
                    0,
                    1,
                    2
                ],
                "plurals": function(n) { return Number(0 ? 0 : n==1 ? 1 : 2); }
            },
            "mr": {
                "name": "Marathi",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ms": {
                "name": "Malay",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "mt": {
                "name": "Maltese",
                "numbers": [
                    1,
                    2,
                    11,
                    20
                ],
                "plurals": function(n) { return Number(n==1 ? 0 : n===0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3); }
            },
            "nah": {
                "name": "Nahuatl",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "nap": {
                "name": "Neapolitan",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "nb": {
                "name": "Norwegian Bokmal",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ne": {
                "name": "Nepali",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "nl": {
                "name": "Dutch",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "nn": {
                "name": "Norwegian Nynorsk",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "no": {
                "name": "Norwegian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "nso": {
                "name": "Northern Sotho",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "oc": {
                "name": "Occitan",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "or": {
                "name": "Oriya",
                "numbers": [
                    2,
                    1
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "pa": {
                "name": "Punjabi",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "pap": {
                "name": "Papiamento",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "pl": {
                "name": "Polish",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "pms": {
                "name": "Piemontese",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ps": {
                "name": "Pashto",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "pt": {
                "name": "Portuguese",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "pt_br": {
                "name": "Brazilian Portuguese",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "rm": {
                "name": "Romansh",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ro": {
                "name": "Romanian",
                "numbers": [
                    1,
                    2,
                    20
                ],
                "plurals": function(n) { return Number(n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2); }
            },
            "ru": {
                "name": "Russian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "sah": {
                "name": "Yakut",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "sco": {
                "name": "Scots",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "se": {
                "name": "Northern Sami",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "si": {
                "name": "Sinhala",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "sk": {
                "name": "Slovak",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }
            },
            "sl": {
                "name": "Slovenian",
                "numbers": [
                    5,
                    1,
                    2,
                    3
                ],
                "plurals": function(n) { return Number(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0); }
            },
            "so": {
                "name": "Somali",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "son": {
                "name": "Songhay",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "sq": {
                "name": "Albanian",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "sr": {
                "name": "Serbian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "su": {
                "name": "Sundanese",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "sv": {
                "name": "Swedish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "sw": {
                "name": "Swahili",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "ta": {
                "name": "Tamil",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "te": {
                "name": "Telugu",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "tg": {
                "name": "Tajik",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "th": {
                "name": "Thai",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "ti": {
                "name": "Tigrinya",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "tk": {
                "name": "Turkmen",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "tr": {
                "name": "Turkish",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "tt": {
                "name": "Tatar",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "ug": {
                "name": "Uyghur",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "uk": {
                "name": "Ukrainian",
                "numbers": [
                    1,
                    2,
                    5
                ],
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },
            "ur": {
                "name": "Urdu",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "uz": {
                "name": "Uzbek",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "vi": {
                "name": "Vietnamese",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "wa": {
                "name": "Walloon",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n > 1); }
            },
            "wo": {
                "name": "Wolof",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            },
            "yo": {
                "name": "Yoruba",
                "numbers": [
                    1,
                    2
                ],
                "plurals": function(n) { return Number(n != 1); }
            },
            "zh": {
                "name": "Chinese",
                "numbers": [
                    1
                ],
                "plurals": function(n) { return 0; }
            }
        },

        // for demonstration only sl and ar is added but you can add your own pluralExtensions
        addRule: function(lng, obj) {
            pluralExtensions.rules[lng] = obj;
        },

        setCurrentLng: function(lng) {
            if (!pluralExtensions.currentRule || pluralExtensions.currentRule.lng !== lng) {
                var parts = lng.split('-');

                pluralExtensions.currentRule = {
                    lng: lng,
                    rule: pluralExtensions.rules[parts[0]]
                };
            }
        },

        get: function(lng, count) {
            var parts = lng.split('-');

            function getResult(l, c) {
                var ext;
                if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
                    ext = pluralExtensions.currentRule.rule;
                } else {
                    ext = pluralExtensions.rules[l];
                }
                if (ext) {
                    var i = ext.plurals(c);
                    var number = ext.numbers[i];
                    if (ext.numbers.length === 2 && ext.numbers[0] === 1) {
                        if (number === 2) {
                            number = -1; // regular plural
                        } else if (number === 1) {
                            number = 1; // singular
                        }
                    }//console.log(count + '-' + number);
                    return number;
                } else {
                    return c === 1 ? '1' : '-1';
                }
            }

            return getResult(parts[0], count);
        }

    };
    var postProcessors = {};
    var addPostProcessor = function(name, fc) {
        postProcessors[name] = fc;
    };
    // sprintf support
    var sprintf = (function() {
        function get_type(variable) {
            return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
        }
        function str_repeat(input, multiplier) {
            for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
            return output.join('');
        }

        var str_format = function() {
            if (!str_format.cache.hasOwnProperty(arguments[0])) {
                str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
            }
            return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
        };

        str_format.format = function(parse_tree, argv) {
            var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
            for (i = 0; i < tree_length; i++) {
                node_type = get_type(parse_tree[i]);
                if (node_type === 'string') {
                    output.push(parse_tree[i]);
                }
                else if (node_type === 'array') {
                    match = parse_tree[i]; // convenience purposes only
                    if (match[2]) { // keyword argument
                        arg = argv[cursor];
                        for (k = 0; k < match[2].length; k++) {
                            if (!arg.hasOwnProperty(match[2][k])) {
                                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                            }
                            arg = arg[match[2][k]];
                        }
                    }
                    else if (match[1]) { // positional argument (explicit)
                        arg = argv[match[1]];
                    }
                    else { // positional argument (implicit)
                        arg = argv[cursor++];
                    }

                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                        throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
                    }
                    switch (match[8]) {
                        case 'b': arg = arg.toString(2); break;
                        case 'c': arg = String.fromCharCode(arg); break;
                        case 'd': arg = parseInt(arg, 10); break;
                        case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                        case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                        case 'o': arg = arg.toString(8); break;
                        case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                        case 'u': arg = Math.abs(arg); break;
                        case 'x': arg = arg.toString(16); break;
                        case 'X': arg = arg.toString(16).toUpperCase(); break;
                    }
                    arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                    pad_length = match[6] - String(arg).length;
                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                    output.push(match[5] ? arg + pad : pad + arg);
                }
            }
            return output.join('');
        };

        str_format.cache = {};

        str_format.parse = function(fmt) {
            var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
            while (_fmt) {
                if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                    parse_tree.push(match[0]);
                }
                else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                    parse_tree.push('%');
                }
                else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                    if (match[2]) {
                        arg_names |= 1;
                        var field_list = [], replacement_field = match[2], field_match = [];
                        if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                            field_list.push(field_match[1]);
                            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1]);
                                }
                                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1]);
                                }
                                else {
                                    throw('[sprintf] huh?');
                                }
                            }
                        }
                        else {
                            throw('[sprintf] huh?');
                        }
                        match[2] = field_list;
                    }
                    else {
                        arg_names |= 2;
                    }
                    if (arg_names === 3) {
                        throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
                    }
                    parse_tree.push(match);
                }
                else {
                    throw('[sprintf] huh?');
                }
                _fmt = _fmt.substring(match[0].length);
            }
            return parse_tree;
        };

        return str_format;
    })();

    var vsprintf = function(fmt, argv) {
        argv.unshift(fmt);
        return sprintf.apply(null, argv);
    };

    addPostProcessor("sprintf", function(val, key, opts) {
        if (!opts.sprintf) return val;

        if (Object.prototype.toString.apply(opts.sprintf) === '[object Array]') {
            return vsprintf(val, opts.sprintf);
        } else if (typeof opts.sprintf === 'object') {
            return sprintf(val, opts.sprintf);
        }

        return val;
    });
    // public api interface
    i18n.init = init;
    i18n.setLng = setLng;
    i18n.preload = preload;
    i18n.addResourceBundle = addResourceBundle;
    i18n.loadNamespace = loadNamespace;
    i18n.loadNamespaces = loadNamespaces;
    i18n.setDefaultNamespace = setDefaultNamespace;
    i18n.t = translate;
    i18n.translate = translate;
    i18n.exists = exists;
    i18n.detectLanguage = f.detectLanguage;
    i18n.pluralExtensions = pluralExtensions;
    i18n.sync = sync;
    i18n.functions = f;
    i18n.lng = lng;
    i18n.addPostProcessor = addPostProcessor;
    i18n.options = o;

})();
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
// lib/handlebars/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0])
break;
case 3: this.$ = new yy.ProgramNode($$[$0])
break;
case 4: this.$ = new yy.ProgramNode([])
break;
case 5: this.$ = [$$[$0]]
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0])
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0])
break;
case 9: this.$ = $$[$0]
break;
case 10: this.$ = $$[$0]
break;
case 11: this.$ = new yy.ContentNode($$[$0])
break;
case 12: this.$ = new yy.CommentNode($$[$0])
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1])
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1])
break;
case 15: this.$ = $$[$0-1]
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1])
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true)
break;
case 18: this.$ = new yy.PartialNode($$[$0-1])
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1])
break;
case 20:
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null]
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]]
break;
case 24: this.$ = [[$$[$0]], null]
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 26: this.$ = [$$[$0]]
break;
case 27: this.$ = $$[$0]
break;
case 28: this.$ = new yy.StringNode($$[$0])
break;
case 29: this.$ = new yy.IntegerNode($$[$0])
break;
case 30: this.$ = new yy.BooleanNode($$[$0])
break;
case 31: this.$ = new yy.HashNode($$[$0])
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]
break;
case 33: this.$ = [$$[$0]]
break;
case 34: this.$ = [$$[$0-2], $$[$0]]
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]
break;
case 38: this.$ = new yy.IdNode($$[$0])
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2];
break;
case 40: this.$ = [$$[$0]]
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: this.begin("mu"); if (yy_.yytext) return 14;
break;
case 1: return 14;
break;
case 2: return 24;
break;
case 3: return 16;
break;
case 4: return 20;
break;
case 5: return 19;
break;
case 6: return 19;
break;
case 7: return 23;
break;
case 8: return 23;
break;
case 9: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.begin("INITIAL"); return 15;
break;
case 10: return 22;
break;
case 11: return 34;
break;
case 12: return 33;
break;
case 13: return 33;
break;
case 14: return 36;
break;
case 15: /*ignore whitespace*/
break;
case 16: this.begin("INITIAL"); return 18;
break;
case 17: this.begin("INITIAL"); return 18;
break;
case 18: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28;
break;
case 19: return 30;
break;
case 20: return 30;
break;
case 21: return 29;
break;
case 22: return 33;
break;
case 23: return 'INVALID';
break;
case 24: return 5;
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s/.])/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"inclusive":false},"INITIAL":{"rules":[0,1,24],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.2";

Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, fn, inverse) {
  inverse = inverse || function() {};

  var ret = "";
  var type = Object.prototype.toString.call(context);

  if(type === "[object Function]") {
    context = context();
  }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
}, function(context, fn) {
  return fn(context);
});

Handlebars.registerHelper('each', function(context, fn, inverse) {
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, fn, inverse) {
  if(!context || context == []) {
    return inverse(this);
  } else {
    return fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, fn, inverse) {
  return Handlebars.helpers['if'].call(this, context, inverse, fn);
});

Handlebars.registerHelper('with', function(context, fn) {
  return fn(context);
});

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { continue; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/visitor.js

Handlebars.Visitor = function() {};

Handlebars.Visitor.prototype = {
  accept: function(object) {
    return this[object.type](object);
  }
};;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  this.message = message;
};

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;"
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    invokeInverse: 14,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 1,
    lookup: 1,
    invokeMustache: 2,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 2,
    invokePartial: 1,
    push: 1,
    invokeInverse: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options || {};
      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      this.ID(block.mustache.id);
      var programGuid = this.compileProgram(block.program);

      this.opcode('invokeInverse', programGuid);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'context');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original);

      if(mustache.escaped) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('push', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('push', bool.bool);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('push', '{}');
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if(JavaScriptCompiler.RESERVED_WORDS[name] || name.indexOf('-') !== -1 || !isNaN(name)) {
        return parent + "['" + name + "']";
      } else if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else {
        return parent + "." + name;
      }
    },

    appendToBuffer: function(string) {
      return "buffer = buffer + " + string + ";";
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },
    // END PUBLIC API

    compile: function(environment, options) {
      this.environment = environment;
      this.options = options || {};

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = {list: []};

      this.compileChildren(environment, options);

      Handlebars.log(Handlebars.logger.DEBUG, environment.disassemble() + "\n\n");

      var opcodes = environment.opcodes, opcode, name, declareName, declareVal;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunction();
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];
      out.push("var buffer = " + this.initializeBuffer() + ", currentContext = context");

      var copies = "helpers = helpers || Handlebars.helpers;";
      if(this.environment.usePartial) { copies = copies + " partials = partials || Handlebars.partials;"; }
      out.push(copies);

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunction: function() {
      var container = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(i, helpers, partials, data) {
          var programWrapper = this.programs[i];
          if(data) {
            return Handlebars.VM.program(this.children[i], helpers, partials, data);
          } else if(programWrapper) {
            return programWrapper;
          } else {
            programWrapper = this.programs[i] = Handlebars.VM.program(this.children[i], helpers, partials);
            return programWrapper;
          }
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[0] = this.source[0] + ", " + locals.join(", ");
      }

      this.source[0] = this.source[0] + ";";

      this.source.push("return buffer;");

      var params = ["Handlebars", "context", "helpers", "partials"];

      if(this.options.data) { params.push("data"); }

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if(params.length === 4 && !this.environment.usePartial) { params.pop(); }

      params.push(this.source.join("\n"));

      var fn = Function.apply(this, params);
      fn.displayName = "Handlebars.js";

      Handlebars.log(Handlebars.logger.DEBUG, fn.toString() + "\n\n");

      container.render = fn;

      container.children = this.environment.children;

      return function(context, options, $depth) {
        try {
          options = options || {};
          var args = [Handlebars, context, options.helpers, options.partials, options.data];
          var depth = Array.prototype.slice.call(arguments, 2);
          args = args.concat(depth);
          return container.render.apply(container, args);
        } catch(e) {
          throw e;
        }
      };
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("this.escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;

        if(depth === 0) {
          this.source.push("currentContext = context;");
        } else {
          this.source.push("currentContext = depth" + depth + ";");
        }
      }
    },

    lookupWithHelpers: function(name) {
      if(name) {
        var topStack = this.nextStack();

        var toPush =  "if('" + name + "' in helpers) { " + topStack +
                      " = " + this.nameLookup('helpers', name, 'helper') +
                      "; } else { " + topStack + " = " +
                      this.nameLookup('currentContext', name, 'context') +
                      "; }";

        this.source.push(toPush);
      } else {
        this.pushStack("currentContext");
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = " + this.nameLookup(topStack, name, 'context') + ";");
    },

    pushStringParam: function(string) {
      this.pushStack("currentContext");
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, function(nextStack, helperMissingString, id) {
        this.source.push("else if(" + id + "=== undefined) { " + nextStack + " = helpers.helperMissing.call(" + helperMissingString + "); }");
        this.source.push("else { " + nextStack + " = " + id + "; }");
      });
    },

    invokeProgram: function(guid, paramSize) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, function(nextStack, helperMissingString, id) {
        this.source.push("else { " + nextStack + " = helpers.blockHelperMissing.call(" + helperMissingString + "); }");
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, fn) {
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam;

      var hash = this.popStack();

      this.register('tmp1', program);
      this.source.push('tmp1.hash = ' + hash + ';');

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push('tmp1');

      // TODO: This is legacy behavior. Deprecate and remove.
      if(inverse) {
        params.push(inverse);
      }

      this.populateCall(params, id, helperId || id, fn);
    },

    populateCall: function(params, id, helperId, fn) {
      var paramString = ["context"].concat(params).join(", ");
      var helperMissingString = ["context"].concat(helperId).concat(params).join(", ");

      nextStack = this.nextStack();

      this.source.push("if(typeof " + id + " === 'function') { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      fn.call(this, nextStack, helperMissingString, id);
    },

    invokeInverse: function(guid) {
      var program = this.programExpression(guid);

      var blockMissingParams = ["context", this.topStack(), "this.noop", program];
      this.pushStack("helpers.blockHelperMissing.call(" + blockMissingParams.join(", ") + ")");
    },

    invokePartial: function(context) {
      this.pushStack("this.invokePartial(" + this.nameLookup('partials', context, 'partial') + ", '" + context + "', " + this.popStack() + ", helpers, partials);");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;
      var compiled = [];

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        compiled[i] = compiler.compile(child, options);
      }

      environment.rawChildren = children;
      environment.children = compiled;
    },

    programExpression: function(guid) {
      if(guid == null) { return "this.noop"; }

      var programParams = [guid, "helpers", "partials"];

      var depths = this.environment.rawChildren[guid].depths.list;

      if(this.options.data) { programParams.push("data"); }

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("context"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(!this.environment.usePartial) {
        if(programParams[3]) {
          programParams[2] = "null";
        } else {
          programParams.pop();
        }
      }

      if(depths.length === 0) {
        return "this.program(" + programParams.join(", ") + ")";
      } else {
        programParams[0] = "this.children[" + guid + "]";
        return "this.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = ("break case catch continue default delete do else finally " +
                       "for function if in instanceof new return switch this throw " +
                       "try typeof var void while with null true false").split(" ");

  compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.VM = {
  programWithDepth: function(fn, helpers, partials, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 4);

    return function(context, options) {
      options = options || {};

      options = {
        helpers: options.helpers || helpers,
        partials: options.partials || partials,
        data: options.data || data
      };

      return fn.apply(this, [context, options].concat(args));
    };
  },
  program: function(fn, helpers, partials, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, {
        helpers: options.helpers || helpers,
        partials: options.partials || partials,
        data: options.data || data
      });
    };
  },
  noop: function() { return ""; },
  compile: function(string, options) {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    return new Handlebars.JavaScriptCompiler().compile(environment, options);
  },
  invokePartial: function(partial, name, context, helpers, partials) {
    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, {helpers: helpers, partials: partials});
    } else {
      partials[name] = Handlebars.VM.compile(partial);
      return partials[name](context, {helpers: helpers, partials: partials});
    }
  }
};

Handlebars.compile = Handlebars.VM.compile;;

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
;
/*! jQuery UI - v1.8.21 - 2012-06-05
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
// Underscore.js 1.2.0
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function q(a,c,d){if(a===c)return a!==0||1/a==1/c;if(a==null)return a===c;var e=typeof a;if(e!=typeof c)return false;if(!a!=!c)return false;if(b.isNaN(a))return b.isNaN(c);var f=b.isString(a),g=b.isString(c);if(f||g)return f&&g&&String(a)==String(c);f=b.isNumber(a);g=b.isNumber(c);if(f||g)return f&&g&&+a==+c;f=b.isBoolean(a);g=b.isBoolean(c);if(f||g)return f&&g&&+a==+c;f=b.isDate(a);g=b.isDate(c);if(f||g)return f&&g&&a.getTime()==c.getTime();f=b.isRegExp(a);g=b.isRegExp(c);if(f||g)return f&&
g&&a.source==c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase;if(e!="object")return false;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(b.isFunction(a.isEqual))return a.isEqual(c);for(e=d.length;e--;)if(d[e]==a)return true;d.push(a);e=0;f=true;if(a.length===+a.length||c.length===+c.length){if(e=a.length,f=e==c.length)for(;e--;)if(!(f=e in a==e in c&&q(a[e],c[e],d)))break}else{for(var h in a)if(l.call(a,h)&&(e++,!(f=l.call(c,h)&&q(a[h],c[h],d))))break;if(f){for(h in c)if(l.call(c,
h)&&!e--)break;f=!e}}d.pop();return f}var r=this,F=r._,n={},k=Array.prototype,o=Object.prototype,i=k.slice,G=k.unshift,u=o.toString,l=o.hasOwnProperty,v=k.forEach,w=k.map,x=k.reduce,y=k.reduceRight,z=k.filter,A=k.every,B=k.some,p=k.indexOf,C=k.lastIndexOf,o=Array.isArray,H=Object.keys,s=Function.prototype.bind,b=function(a){return new m(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):r._=b;b.VERSION="1.2.0";var j=b.each=b.forEach=function(a,c,b){if(a!=null)if(v&&a.forEach===
v)a.forEach(c,b);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(b,a[e],e,a)===n)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===n)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.map===w)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=d!==void 0;a==null&&(a=[]);if(x&&a.reduce===x)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,i){f?d=c.call(e,
d,a,b,i):(d=a,f=true)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(y&&a.reduceRight===y)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;D(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,true});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;
if(z&&a.filter===z)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(A&&a.every===A)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return n});return e};var D=b.some=b.any=function(a,c,d){var c=c||b.identity,e=false;if(a==null)return e;if(B&&a.some===B)return a.some(c,
d);j(a,function(a,b,h){if(e|=c.call(d,a,b,h))return n});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;if(p&&a.indexOf===p)return a.indexOf(c)!=-1;D(a,function(a){if(b=a===c)return true});return b};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;
var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var c=[],b;j(a,function(a,f){f==0?c[0]=a:(b=Math.floor(Math.random()*(f+1)),c[f]=c[b],c[b]=a)});return c};b.sortBy=function(a,
c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};j(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):
b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,a.length-b):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));
a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};
b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(p&&a.indexOf===p)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(C&&a.lastIndexOf===C)return a.lastIndexOf(b);
for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===s&&s)return s.apply(a,i.call(arguments,1));var d=i.call(arguments,2);return function(){return a.apply(b,d.concat(i.call(arguments)))}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});
return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};var E=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=
function(a,b){return E(a,b,false)};b.debounce=function(a,b){return E(a,b,true)};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=i.call(arguments);return function(){for(var b=i.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return function(){if(--a<1)return b.apply(this,
arguments)}};b.keys=H||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=
b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return q(a,b,[])};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=o||function(a){return u.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};
b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||u.call(a)=="[object Boolean]"};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===false))};b.isNull=
function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){r._=F;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.mixin=function(a){j(b.functions(a),function(c){I(c,b[c]=a[c])})};var J=0;b.uniqueId=function(a){var b=
J++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape,function(a,b){return"',_.escape("+b.replace(/\\'/g,"'")+"),'"}).replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,
b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",d=new Function("obj",d);return c?d(c):d};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var t=function(a,c){return c?b(a).chain():a},I=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);G.call(a,this._wrapped);return t(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),
function(a){var b=k[a];m.prototype[a]=function(){b.apply(this._wrapped,arguments);return t(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return t(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}})();

/*
    http://www.JSON.org/json2.js
    2011-02-23

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

/*jslint evil: true, strict: false, regexp: false */

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
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
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
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
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
            return quote(value);

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

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
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

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
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
    }


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

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/*jslint indent: 2*/
if (!Object.create) {
  (function () {
    function F() {}

    Object.create = function (object) {
      F.prototype = object;
      return new F();
    };
  }());
}


function isEmpty(o) {
    var i, v;
    if (typeOf(o) === 'object') {
        for (i in o) {
            v = o[i];
            if (v !== undefined && typeOf(v) !== 'function') {
                return false;
            }
        }
    }
    return true;
}

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}


function copyArray(array){
	var copy = [];
	for(var i = 0,l = array.length;i<l;i++){

		if(typeOf(array[i]) === "array"){
			copy.push(copyArray(array[i]));
		}
		if(typeOf(array[i]) === "object"){
			copy.push(Object.create(array[i]));
		}
		else{
			copy.push(array[i]);
		}
	}
	return copy;
}

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

// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download.
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
//
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var DateFormatter = function() {

	var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
	var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

	function LZ(x) {
		return (x < 0 || x > 9 ? "" : "0") + x;
	}

	// ------------------------------------------------------------------
	// isDate ( date_string, format_string )
	// Returns true if date string matches format of format string and
	// is a valid date. Else returns false.
	// It is recommended that you trim whitespace around the value before
	// passing it to this function, as whitespace is NOT ignored!
	// ------------------------------------------------------------------
	function isDate(val, format) {
		var date = getDateFromFormat(val, format);
		if(date == 0) {
			return false;
		}
		return true;
	}

	// -------------------------------------------------------------------
	// compareDates(date1,date1format,date2,date2format)
	//   Compare two date strings to see which is greater.
	//   Returns:
	//   1 if date1 is greater than date2
	//   0 if date2 is greater than date1 of if they are the same
	//  -1 if either of the dates is in an invalid format
	// -------------------------------------------------------------------
	function compareDates(date1, dateformat1, date2, dateformat2) {
		var d1 = getDateFromFormat(date1, dateformat1);
		var d2 = getDateFromFormat(date2, dateformat2);
		if(d1 == 0 || d2 == 0) {
			return -1;
		}
		else if(d1 > d2) {
			return 1;
		}
		return 0;
	}

	// ------------------------------------------------------------------
	// formatDate (date_object, format)
	// Returns a date in the output format specified.
	// The format string uses the same abbreviations as in getDateFromFormat()
	// ------------------------------------------------------------------
	function formatDate(date, format) {
		format = format + "";
		var result = "";
		var i_format = 0;
		var c = "";
		var token = "";
		var y = date.getYear() + "";
		var M = date.getMonth() + 1;
		var d = date.getDate();
		var E = date.getDay();
		var H = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
		// Convert real date parts into formatted versions
		var value = new Object();
		if(y.length < 4) {
			y = "" + ( y - 0 + 1900);
		}
		value["y"] = "" + y;
		value["yyyy"] = y;
		value["yy"] = y.substring(2, 4);
		value["M"] = M;
		value["MM"] = LZ(M);
		value["MMM"] = MONTH_NAMES[ M - 1];
		value["NNN"] = MONTH_NAMES[M + 11];
		value["d"] = d;
		value["dd"] = LZ(d);
		value["E"] = DAY_NAMES[E + 7];
		value["EE"] = DAY_NAMES[E];
		value["H"] = H;
		value["HH"] = LZ(H);
		if(H == 0) {
			value["h"] = 12;
		}
		else if(H > 12) {
			value["h"] = H - 12;
		}
		else {
			value["h"] = H;
		}
		value["hh"] = LZ(value["h"]);
		if(H > 11) {
			value["K"] = H - 12;
		}
		else {
			value["K"] = H;
		}
		value["k"] = H + 1;
		value["KK"] = LZ(value["K"]);
		value["kk"] = LZ(value["k"]);
		if(H > 11) {
			value["a"] = "PM";
		}
		else {
			value["a"] = "AM";
		}
		value["m"] = m;
		value["mm"] = LZ(m);
		value["s"] = s;
		value["ss"] = LZ(s);
		while(i_format < format.length) {
			c = format.charAt(i_format);
			token = "";
			while((format.charAt(i_format) == c) && (i_format < format.length)) {
				token += format.charAt(i_format++);
			}
			if(value[token] != null) {
				result = result + value[token];
			}
			else {
				result = result + token;
			}
		}
		return result;
	}

	// ------------------------------------------------------------------
	// Utility functions for parsing in getDateFromFormat()
	// ------------------------------------------------------------------
	function _isInteger(val) {
		var digits = "1234567890";
		for(var i = 0; i < val.length; i++) {
			if(digits.indexOf(val.charAt(i)) == -1) {
				return false;
			}
		}
		return true;
	}

	function _getInt(str, i, minlength, maxlength) {
		for(var x = maxlength; x >= minlength; x--) {
			var token = str.substring(i, i + x);
			if(token.length < minlength) {
				return null;
			}
			if(_isInteger(token)) {
				return token;
			}
		}
		return null;
	}

	// ------------------------------------------------------------------
	// getDateFromFormat( date_string , format_string )
	//
	// This function takes a date string and a format string. It matches
	// If the date string matches the format string, it returns the
	// getTime() of the date. If it does not match, it returns 0.
	// ------------------------------------------------------------------
	function getDateFromFormat(val, format) {
		val = val + "";
		format = format + "";
		var i_val = 0;
		var i_format = 0;
		var c = "";
		var token = "";
		var token2 = "";
		var x, y;
		var now = new Date();
		var year = now.getYear();
		var month = now.getMonth() + 1;
		var date = 1;
		var hh = now.getHours();
		var mm = now.getMinutes();
		var ss = now.getSeconds();
		var ampm = "";

		while(i_format < format.length) {
			// Get next token from format string
			c = format.charAt(i_format);
			token = "";
			while((format.charAt(i_format) == c) && (i_format < format.length)) {
				token += format.charAt(i_format++);
			}
			// Extract contents of value based on format token
			if(token == "yyyy" || token == "yy" || token == "y") {
				if(token == "yyyy") {
					x = 4;
					y = 4;
				}
				if(token == "yy") {
					x = 2;
					y = 2;
				}
				if(token == "y") {
					x = 2;
					y = 4;
				}
				year = _getInt(val, i_val, x, y);
				if(year == null) {
					return 0;
				}
				i_val += year.length;
				if(year.length == 2) {
					if(year > 70) {
						year = 1900 + ( year - 0);
					}
					else {
						year = 2000 + ( year - 0);
					}
				}
			}
			else if(token == "MMM" || token == "NNN") {
				month = 0;
				for(var i = 0; i < MONTH_NAMES.length; i++) {
					var month_name = MONTH_NAMES[i];
					if(val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
						if(token == "MMM" || (token == "NNN" && i > 11)) {
							month = i + 1;
							if(month > 12) {
								month -= 12;
							}
							i_val += month_name.length;
							break;
						}
					}
				}
				if((month < 1) || (month > 12)) {
					return 0;
				}
			}
			else if(token == "EE" || token == "E") {
				for(var i = 0; i < DAY_NAMES.length; i++) {
					var day_name = DAY_NAMES[i];
					if(val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
						i_val += day_name.length;
						break;
					}
				}
			}
			else if(token == "MM" || token == "M") {
				month = _getInt(val, i_val, token.length, 2);
				if(month == null || (month < 1) || (month > 12)) {
					return 0;
				}
				i_val += month.length;
			}
			else if(token == "dd" || token == "d") {
				date = _getInt(val, i_val, token.length, 2);
				if(date == null || (date < 1) || (date > 31)) {
					return 0;
				}
				i_val += date.length;
			}
			else if(token == "hh" || token == "h") {
				hh = _getInt(val, i_val, token.length, 2);
				if(hh == null || (hh < 1) || (hh > 12)) {
					return 0;
				}
				i_val += hh.length;
			}
			else if(token == "HH" || token == "H") {
				hh = _getInt(val, i_val, token.length, 2);
				if(hh == null || (hh < 0) || (hh > 23)) {
					return 0;
				}
				i_val += hh.length;
			}
			else if(token == "KK" || token == "K") {
				hh = _getInt(val, i_val, token.length, 2);
				if(hh == null || (hh < 0) || (hh > 11)) {
					return 0;
				}
				i_val += hh.length;
			}
			else if(token == "kk" || token == "k") {
				hh = _getInt(val, i_val, token.length, 2);
				if(hh == null || (hh < 1) || (hh > 24)) {
					return 0;
				}
				i_val += hh.length;
				hh--;
			}
			else if(token == "mm" || token == "m") {
				mm = _getInt(val, i_val, token.length, 2);
				if(mm == null || (mm < 0) || (mm > 59)) {
					return 0;
				}
				i_val += mm.length;
			}
			else if(token == "ss" || token == "s") {
				ss = _getInt(val, i_val, token.length, 2);
				if(ss == null || (ss < 0) || (ss > 59)) {
					return 0;
				}
				i_val += ss.length;
			}
			else if(token == "a") {
				if(val.substring(i_val, i_val + 2).toLowerCase() == "am") {
					ampm = "AM";
				}
				else if(val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
					ampm = "PM";
				}
				else {
					return 0;
				}
				i_val += 2;
			}
			else {
				if(val.substring(i_val, i_val + token.length) != token) {
					return 0;
				}
				else {
					i_val += token.length;
				}
			}
		}
		// If there are any trailing characters left in the value, it doesn't match
		if(i_val != val.length) {
			return 0;
		}
		// Is date valid for month?
		if(month == 2) {
			// Check for leap year
			if(((year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0)) {// leap year
				if(date > 29) {
					return 0;
				}
			}
			else {
				if(date > 28) {
					return 0;
				}
			}
		}
		if((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
			if(date > 30) {
				return 0;
			}
		}
		// Correct hours value
		if(hh < 12 && ampm == "PM") {
			hh = hh - 0 + 12;
		}
		else if(hh > 11 && ampm == "AM") {
			hh -= 12;
		}
		var newdate = new Date(year, month - 1, date, hh, mm, ss);
		return newdate.getTime();
	}

	// ------------------------------------------------------------------
	// parseDate( date_string [, prefer_euro_format] )
	//
	// This function takes a date string and tries to match it to a
	// number of possible date formats to get the value. It will try to
	// match against the following international formats, in this order:
	// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
	// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
	// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
	// A second argument may be passed to instruct the method to search
	// for formats like d/M/y (european format) before M/d/y (American).
	// Returns a Date object or null if no patterns match.
	// ------------------------------------------------------------------
	function parseDate(val) {
		var preferEuro = (arguments.length == 2) ? arguments[1] : false;
		generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
		monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
		dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
		var checkList = new Array('generalFormats', preferEuro ? 'dateFirst' : 'monthFirst', preferEuro ? 'monthFirst' : 'dateFirst');
		var d = null;
		for(var i = 0; i < checkList.length; i++) {
			var l = window[checkList[i]];
			for(var j = 0; j < l.length; j++) {
				d = getDateFromFormat(val, l[j]);
				if(d != 0) {
					return new Date(d);
				}
			}
		}
		return null;
	}

	function formatEventDt(date) {
		var month = date.getMonth()+1, day = date.getDate(), year = date.getFullYear(), hours = date.getHours().toString(), minutes = date.getMinutes().toString(), seconds = date.getSeconds().toString();
		if(month.length == 1){
			month = "0" + month;
		}
		if(hours.length == 1) {
			hours = "0" + hours;
		}
		if(minutes.length == 1) {
			minutes = "0" + minutes;
		}
		if(seconds.length == 1) {
			seconds = "0" + seconds;
		}
		return month + "-" + day + "-" + year + " " + hours + ":" + minutes;
	}

	function formatEventMonth(mon){
		var month;
			switch(mon){
				case "JAN":
				month = "01";
				break;
				case "FEB":
				month = "02";
				break;
				case "MAR":
				month = "03";
				break;
				case "APR":
				month = "04";
				break;
				case "MAY":
				month = "05";
				break;
				case "JUN":
				month = "06";
				break;
				case "JUL":
				month = "07";
				break;
				case "AUG":
				month = "08";
				break;
				case "SEP":
				month = "09";
				break;
				case "OCT":
				month = "10";
				break;
				case "NOV":
				month = "11";
				break;
				case "DEC":
				month = "12";
			}
			return month;
	}

	return{
		isDate:isDate,
		compareDates:compareDates,
		formatDate:formatDate,
		getDateFromFormat:getDateFromFormat,
		parseDate:parseDate,
		formatEventDt:formatEventDt,
		formatEventMonth:formatEventMonth
	};
}();

/**
 * @namespace
 */
var MP_Util = function() {
	var m_df = null;
	var m_nf = null;
	var m_codeSets = [];
	return {
		addComponentsToGlobalStorage: function(components) {
			//If you try to add nothing, just return
			if(!components || !components.length) {
				return;
			}
			//If for some reason the global component storage is null, new it up
			if(CERN_MPageComponents === null) {
				CERN_MPageComponents = [];
			}
			//Store this view's components in the global component list
			for(var x = 0, xl = components.length; x < xl; x++) {
				if(components[x]) {
					CERN_MPageComponents.push(components[x]);
				}
			}
		},
		GetComponentArray: function(components) {
			var grpAr = [];
			var colAr = [];
			var rowAr = [];
			var curCol = -1;
			var curGrp = -1;

			var sHTML = [];

			//first layout the group/columns/rows of components
			if (components != null) {
				components.sort(SortMPageComponents);

				for (var x = 0, xl = components.length; x < xl; x++) {
					var component = components[x];

					if (component.isDisplayable()) {//based on filter logic, only display if criteria is met
						var compGrp = component.getPageGroupSequence();
						var compCol = component.getColumn();

						if (compGrp != curGrp) {
							curCol = -1;
							colAr = [];
							grpAr.push(colAr);
							curGrp = compGrp;
						}

						if (compCol != curCol) {
							rowAr = [];
							colAr.push(rowAr);
							curCol = compCol;
						}
						rowAr.push(component);
					}
				}
			}
			return grpAr;
		},
		/**
		 * Helper utility to retrieve the <code>Criterion</code> Object generated from the provide JSON
		 * @param js_criterion [REQUIRED] The JSON associated to the criterion data that is to be loaded
		 * @param static_content [REQUIRED] The <code>String</code> location in which the static content resides
		 */
		GetCriterion: function(js_criterion, static_content) {
			MP_Util.LogDebug("Criterion: " + JSON.stringify(js_criterion));
			var jsCrit = js_criterion.CRITERION;
			var criterion = new MP_Core.Criterion(jsCrit, static_content);
			var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES);
			var jsPatInfo = jsCrit.PATIENT_INFO;
			var patInfo = new MP_Core.PatientInformation();
			var jsPeriopCases = jsCrit.PERIOP_CASE;
			var oPeriopCases = new MP_Core.PeriopCases();
			patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));
			if (jsPatInfo.DOB != "") {
				var dt = new Date();
				dt.setISO8601(jsPatInfo.DOB);
				patInfo.setDOB(dt);
			}
			criterion.setPatientInfo(patInfo);
			oPeriopCases.setCaseID(jsPeriopCases.CASE_ID);
			oPeriopCases.setDays(jsPeriopCases.DAYS);
			oPeriopCases.setHours(jsPeriopCases.HOURS);
			oPeriopCases.setMins(jsPeriopCases.MINS);
			oPeriopCases.setCntdwnDscFlg(jsPeriopCases.CNTDWN_DESC_FLAG);
			criterion.setPeriopCases(oPeriopCases);
			return criterion;
		},

		/**
		 * Calculates the lookback date based on the current date and time
		 * @param lookbackDays [REQUIRED] The number of days to look back in time
		 * @return <code>Date</code> Object representing the lookback date and time
		 */
		CalcLookbackDate: function(lookbackDays) {
			var retDate = new Date();
			var hrs = retDate.getHours();
			hrs -= (lookbackDays * 24);
			retDate.setHours(hrs);
			return retDate;
		},
		/**
		 * Calculates the within time from the provide date and time.
		 * @param dateTime [REQUIRED] The <code>Date</code> Object in which to calculate the within time
		 * @return <code>String</code> representing the time that has passed from the provided date and time
		 */
		CalcWithinTime: function(dateTime) {
			return (GetDateDiffString(dateTime, null, null, true));
		},
		/**
		 * Calculates the age of a patient from a given point in time.  If the point in time is not provided, the current date/time is
		 * utilized
		 * @param birthDt [REQUIRED] The <code>Date</code> Object in which to calculate the age of the patient
		 * @param fromDate [OPTIONAL] The <code>Date</code> Object in which to calculate the age of the patient from.  This is useful in
		 * cases
		 * where the patient is deceased and the date utilized is the deceased date.
		 * @return <code>String</code> representing the age of the patient
		 */
		CalcAge: function(birthDt, fromDate) {
			//If from Date is null (not passed in) then set to current Date
			fromDate = (fromDate) ? fromDate : new Date();
			return (GetDateDiffString(birthDt, fromDate, 1, false));
		},
		/**
		 * Display the date and time based on the configuration of the component
		 * @param component [REQUIRED] The component in which holds the configuration for the date formatting
		 * @param date [REQUIRED] The date in which to properly format
		 * @return <code>String</code> representing the date and time of the date provided
		 */
		DisplayDateByOption: function(component, date) {
			var df = MP_Util.GetDateFormatter();
			var dtFormatted = "";
			switch (component.getDateFormat()) {
				case 1:
					return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR));
				case 2:
					return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
				case 3:
					return (MP_Util.CalcWithinTime(date));
				case 4:
					//Display No Date.  Additional logic will need to be applied to hide column.
					return ("&nbsp");
				default:
					return df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			}
		},
		DisplaySelectedTab: function(showDiv, anchorId) {
			var i = 0;
			if (window.name == "a-tab0") {//first tab is default
				window.name = "";
			}
			else {
				window.name = showDiv + ',' + anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for ( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
				}
				else {
					divs[i].style.display = 'none';
				}
			}

			var anchors = Util.Style.g("anchor-tab-item", body);
			for ( i = anchors.length; i--; ) {
				if (anchors[i].id == anchorId) {
					anchors[i].className = "anchor-tab-item active";
				}
				else {
					anchors[i].className = "anchor-tab-item inactive";
				}
			}

			//remove initial Customize anchor href
			var custNode = _g("custView");
			if (custNode != null) {
				custNode.href = "";
				custNode.innerHTML = "";
			}

			for (var yl = CERN_TabManagers.length; yl--; ) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--; ) {
							var component = components[xl];
							MP_Util.Doc.AddCustomizeLink(component.getCriterion());
							break;
						}
					}
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		DisplaySelectedTabQOC: function(showDiv, anchorId, noViewSaved) {
			var i = 0;
			var firstTimeLoadingMPage = false;
			if (noViewSaved) {
				var dropDownList = _g("viewListSelectorID");
				if (dropDownList.options[dropDownList.options.length - 1].value == "Blank_Space") {
					dropDownList.remove(dropDownList.options.length - 1);
					firstTimeLoadingMPage = true;
					//sort of a quick fix, but desperate times call for desperate measures
					//on intitial load with no last saved view in user prefs, the noViewsSaved variable will always
					//be true until the user refreshes the page. The only time no view has been saved is the time we
					//delete the Blank_Space from the view selector.
				}

				var noSavedViewsStatement = _g("noSavedViews");
				if (!Util.Style.ccss(noSavedViewsStatement, "hidden")) {
					Util.Style.acss(noSavedViewsStatement, "hidden");
				}
			}

			if (window.name == "a-tab0")//first tab is default
			{
				window.name = "";
			}
			else {
				window.name = showDiv + ',' + anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for ( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
					if (Util.Style.ccss(divs[i], "div-tab-item-not-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-not-selected");
						Util.Style.acss(divs[i], "div-tab-item-selected");
					}
				}
				else {
					divs[i].style.display = 'none';
					if (Util.Style.ccss(divs[i], "div-tab-item-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-selected");
						Util.Style.acss(divs[i], "div-tab-item-not-selected");
					}
				}
			}

			var anchors = Util.Style.g("anchor-tab-item", body);
			for ( i = anchors.length; i--; ) {
				if (anchors[i].id == anchorId) {
					anchors[i].className = "anchor-tab-item active";
				}
				else {
					anchors[i].className = "anchor-tab-item inactive";
				}
			}

			//remove initial Customize anchor href
			var custNode = _g("custView");
			if (custNode) {
				custNode.href = "";
				custNode.innerHTML = "";
			}

			//Search tabManager for the selected view, if found, render the view
			for (var yl = CERN_TabManagers.length; yl--; ) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {

					//grab user preferences, and then save back preferences with updated last saved view
					var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
					var userPrefs = null;
					var pagePrefs = null;
					var views = null;
					var lastSavedView = null;
					var thisView = null;
					if (jsonObj) {
						userPrefs = jsonObj.user_prefs;
						pagePrefs = userPrefs.page_prefs;
						views = pagePrefs.views;
						pagePrefs.last_saved_view = tabItem.name;
					}
					else {
						jsonObj = {};
						userPrefs = jsonObj.user_prefs = {};
						pagePrefs = userPrefs.page_prefs = {};
						views = pagePrefs.views = [];
						lastSavedView = pagePrefs.last_saved_view = tabItem.name;
					}
					var viewsLength = views.length;
					var newView = {};
					newView.label = tabItem.name;
					newView.components = [];
					if (viewsLength === 0) {
						thisView = newView;
						views.push(newView);
					}
					else {
						var alreadyAddedView = false;
						for (var j = viewsLength; j--; ) {
							var currentViewName = views[j].label;
							if (currentViewName === newView.label) {
								alreadyAddedView = true;
								thisView = views[j];
								break;
							}
						}
						if (!alreadyAddedView) {
							thisView = newView;
							views.push(newView);
						}
					}

					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObj, true);
					var criterion;
					var categoryMeaning = "MP_COMMON_ORDERS_V4";
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--; ) {
							var component = components[xl];
							criterion = component.getCriterion();
							MP_Util.Doc.AddCustomizeLink(criterion);
							break;
						}
					}
					//update the components with user prefs if they exist before rendering
					var updatedQOCComponents = MP_Util.Doc.UpdateQOCComponentsWithUserPrefs(tabItem.components, thisView.components, criterion);
					if(!tabManager.isTabLoaded()){
						var dummyMpage = new CommonOrdersMPage();
						dummyMpage.renderComponents(tabItem.components, $("#" + tabItem.key));
						//Setup the categoryMean and the criterion info for future use
						dummyMpage.setCategoryMean(tabItem.key);
						dummyMpage.setCriterion(criterion);
						//Create the page menu for the specific CommonOrdersMPage
						dummyMpage.loadPageMenu();

						MP_Util.Doc.CreateQOCCompMenus(tabItem.components, false, tabItem.key);
						MP_Util.Doc.SetupExpandCollapse(categoryMeaning);
					}
					tabManager.loadTab();
					tabManager.setSelectedTab(true);

					MP_Util.Doc.InitQOCDragAndDrop(tabItem.key);
					var tabItemKey = tabItem.key;
					//Update the menu shown when the page menu is clicked
					$("#pageMenu" + categoryMeaning).unbind("click").click(function(){
						MP_MenuManager.showMenu("pageMenu" + tabItemKey);
					});
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		OpenTab: function(compId) {
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					comp.openTab();
				}
			}
		},
		OpenIView: function(compId) {
			var comp = MP_Util.GetCompObjByStyleId(compId);
			comp.openIView();
		},
		LaunchMenuSelection: function(compId, menuItemId) {
			//get the exact component from global array
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var crit = comp.getCriterion();
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					//found
					comp.openDropDown(menuItemId);
					break;
				}
			}

		},
		LaunchIViewMenuSelection: function(compId, bandName, sectionName, itemName) {
			var rootId = parseInt(compId, 10);
			var component = MP_Util.GetCompObjById(rootId);
			var criterion = component.getCriterion();
			var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
			launchIViewApp.LaunchIView(bandName, sectionName, itemName, criterion.person_id, criterion.encntr_id);
		},
		LaunchMenu: function(menuId, componentId) {
			var menu = _g(menuId);
			MP_Util.closeMenuInit(menu, componentId);
			if (menu != null) {
				if (Util.Style.ccss(menu, "menu-hide")) {
					_g(componentId).style.zIndex = 2;
					Util.Style.rcss(menu, "menu-hide");
				}
				else {
					_g(componentId).style.zIndex = 1;
					Util.Style.acss(menu, "menu-hide");
				}
			}
		},
		LaunchLookBackSelection: function(compId, lookBackUnits, lookBackType) {
			var i18nCore = i18n.discernabu;
			var rootId = parseInt(compId, 10);
			var component = MP_Util.GetCompObjById(rootId);
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var scope = component.getScope();
			var displayText = "";
			var lbtVal = parseInt(lookBackType, 10);

			if (component.getLookbackUnits() !== lookBackUnits || component.getLookbackUnitTypeFlag() !== lbtVal) {
				component.setLookbackUnits(lookBackUnits);
				component.setLookbackUnitTypeFlag(lbtVal);

				if (scope > 0) {
					if (lookBackUnits > 0 && lbtVal > 0) {
						var newText = "";
						switch(lbtVal) {
							case 1:
								newText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
								break;
							case 2:
								newText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
								break;
							case 3:
								newText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
								break;
							case 4:
								newText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
								break;
							case 5:
								newText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
								break;
							default:
								newText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
								break;
						}
						switch(scope) {
							case 1:
								displayText = i18nCore.ALL_N_VISITS.replace("{0}", newText);
								break;
							case 2:
								displayText = i18nCore.SELECTED_N_VISIT.replace("{0}", newText);
								break;
						}
					}
					else {
						switch(scope) {
							case 1:
								displayText = i18nCore.All_VISITS;
								break;
							case 2:
								displayText = i18nCore.SELECTED_VISIT;
								break;
						}
					}
				}

				MP_Util.Doc.CreateLookBackMenu(component, 2, displayText);

				if (ns === "lab" || ns === "dg" || ns === "ohx" || ns === "ohx2") {
					component.getSectionContentNode().innerHTML = "";
				}
				if (component.isResourceRequired()) {
					component.RetrieveRequiredResources();
				}
				else {
					component.InsertData();
				}
			}
		},
				LaunchCompFilterSelection: function(compId, eventSetIndex, applyFilterInd) {
			var component = MP_Util.GetCompObjById(compId);
			var i18nCore = i18n.discernabu;
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var mnuDisplay;
			if (eventSetIndex === -1)
			{
			 mnuDisplay = i18nCore.FACILITY_DEFINED_VIEW;
			}
			else
			{
				if (ns === "ohx" || ns === "ohx2") {
					 mnuDisplay = component.getGrouperCatLabel(eventSetIndex).toString();
				}
				else {
					mnuDisplay = component.getGrouperLabel(eventSetIndex).toString();
				}
			}
			var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
			var styleId = style.getId();
			var loc = component.getCriterion().static_content;
			var mnuId = styleId + "TypeMenu";
			var z = 0;

			if (ns === "ohx" || ns === "ohx2") {
				var catCodeList = component.getGrouperCatalogCodes(eventSetIndex);
			}
			else {
				var eventSetList = component.getGrouperCriteria(eventSetIndex);
			}

			//Set component prefs variables with filter settings
			if (ns === "ohx" || ns === "ohx2") {
				component.setGrouperFilterCatLabel(mnuDisplay);
			}
			else {
				component.setGrouperFilterLabel(mnuDisplay);
			}
			if (mnuDisplay !== dispVar) {

				if (ns === "ohx" || ns === "ohx2") {
					component.setGrouperFilterCatalogCodes(catCodeList);
				}
				else {
					component.setGrouperFilterCriteria(eventSetList);
				}

			}
			else {
				component.setGrouperFilterCriteria(null);
				component.setGrouperFilterCatalogCodes(null);
			}

			//Find Filter Applied msg span and replace it only if the Facility defined view is not selected
			var filterAppliedSpan = _g("cf" + compId + "msg");
			if (filterAppliedSpan) {
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if (mnuDisplay !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compId, "msg' class='filter-applied-msg' title='", mnuDisplay, "'>", i18nCore.FILTER_APPLIED, "</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
			else {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compId, "msg' class='filter-applied-msg' title=''></span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}

			//Find the content div
			var contentDiv = _g("Accordion" + compId + "ContentDiv");
			contentDiv.innerHTML = "";

			//Create the new content div innerHTML with the select list
			var contentDivArr = [];
			contentDivArr.push("<div id='cf", mnuId, "' class='acc-mnu'>");
			contentDivArr.push("<span id='cflabel", compId, "' onclick='MP_Util.LaunchMenu(\"", mnuId, "\", \"", styleId, "\");'>", i18nCore.FILTER_LABEL, mnuDisplay, "<a id='compFilterDrop", compId, "'><img src='", loc, "/images/3943_16.gif'></a></span>");
			contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='acc-mnu-contentbox'>");
			contentDivArr.push("<div><span id='cf", styleId, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",-1,1);'>", i18nCore.FACILITY_DEFINED_VIEW, "</span></div>");

			var groupLen = component.m_grouper_arr.length;
			for ( z = 0; z < groupLen; z++) {
				if (component.getGrouperLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", esIndex, ",1);'>", component.getGrouperLabel(z).toString(), "</span></div>");
				}
				if (component.getGrouperCatLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", esIndex, ",1);'>", component.getGrouperCatLabel(z).toString(), "</span></div>");
				}
			}
			contentDivArr.push("</div></div></div>");
			contentDiv.innerHTML = contentDivArr.join('');

			if (applyFilterInd === 1) {
				if (mnuDisplay === i18nCore.FACILITY_DEFINED_VIEW) {
					if (component.isResourceRequired()) {
						component.RetrieveRequiredResources();
					}
					else {
						component.InsertData();
					}
				}
				else {

					if (ns === "ohx" || ns === "ohx2") {
						component.FilterRefresh(mnuDisplay, catCodeList);
					}
					else {
						component.FilterRefresh(mnuDisplay, eventSetList);
					}

				}
			}
		},
		LaunchViewMenu: function(menuId) {
			var menu = _g(menuId);
			MP_Util.closeViewMenuInit(menu);
			if (menu) {
				if (Util.Style.ccss(menu, "menu-hide")) {
					_g(menu.id).style.zIndex = 2;
					Util.Style.rcss(menu, "menu-hide");
				}
				else {
					_g(menu.id).style.zIndex = 1;
					Util.Style.acss(menu, "menu-hide");
				}

				//change position of viewpoint menu if chart search enabled
				var js_viewpoint = JSON.parse(m_viewpointJSON);
				if (parseInt(js_viewpoint.VIEWPOINTINFO_REC.CS_ENABLED, 10)) {
					var sec = _g("viewDrop");
					var ofs = Util.goff(sec);
					menu.style.left = (ofs[0] - 5) + "px";
					menu.style.top = (ofs[1] + 24) + "px";
				}
			}
		},
		closeViewMenuInit: function(inMenu) {
			var menuId = inMenu.id;
			var e = window.event;

			var menuLeave = function(e) {
				if (!e) {
					var e = window.event;
				}
				var relTarg = e.relatedTarget || e.toElement;
				if (e.relatedTarget.id == inMenu.id) {
					Util.Style.acss(inMenu, "menu-hide");
				}
				e.stopPropagation();
				Util.cancelBubble(e);
			};

			if (window.attachEvent) {
				Util.addEvent(inMenu, "mouseleave", function() {
					Util.Style.acss(inMenu, "menu-hide");
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		closeMenuInit: function(inMenu, compId) {
			var menuId;
			var docMenuId = compId + "Menu";
			var lbMenuId = compId + "Mnu";
			var cfMenuId = compId + "TypeMenu";

			var menuLeave = function(e) {
				if (!e) {
					var e = window.event;
				}
				var relTarg = e.relatedTarget || e.toElement;
				if (e.relatedTarget.id == inMenu.id) {
					Util.Style.acss(inMenu, "menu-hide");
				}
				e.stopPropagation();
				Util.cancelBubble(e);
			}
			if (inMenu.id == docMenuId || inMenu.id == lbMenuId || inMenu.id == cfMenuId) {//m2 'docMenu'
				menuId = compId;
			}
			if (!e)
				var e = window.event;
			if (window.attachEvent) {
				Util.addEvent(inMenu, "mouseleave", function() {
					Util.Style.acss(inMenu, "menu-hide");
					_g(menuId).style.zIndex = 1;
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		/**
		 * Provides the ability to construct the text that is to be placed after the label of the Component.
		 * Each component defines whether or not the number of items within the component should be displayed
		 * in the title of the component.  This is a requirements decision and will have to be answered upon creation
		 * of the component.  In addition, the lookback units and scope have been moved to the
		 * subtitle text line and are no longer necessary in the title text.
		 *
		 * The requirement is for each component to define whether or not the contract exists to display a number of items
		 * within the component header.  The reason for this contract is when 'no results found' is displayed, the count of zero
		 * must be displayed to indicate to the user if there are items within the component.  As for components who do not display
		 * a count, the user will still have to manually open the component to determine whether or not data exists.
		 *
		 * TODO: The future thought is that in the case of 'no results found' or 'error retrieving data', an additional indicator
		 * will be added to the component in some manner to indicate the status.  This is important with components such as Laboratory
		 * and Vitals for examples where the count of items is not displayed within the title text.
		 *
		 * @param component The {@see MPageComponent} in which to add the title text within.
		 * @param nbr The count of the list items displayed within the component
		 * @param optionalText Optional text to allow each consumer to place text within the header of the component.
		 */
		CreateTitleText: function(component, nbr, optionalText) {
			var ar = [];
			if (component.isLineNumberIncluded()) {
				ar.push("(", nbr, ")");
			}
			if (optionalText && optionalText !== "") {
				ar.push(" ", optionalText)
			}
			return ar.join("");
		},
		/**
		 * A helper utility to determine if a content body should be considered scrollable
		 * @param component [REQUIRED] The component in which is being evaluated
		 * @param nbr [REQUIRED] The number of items in which to consider scrolling enabled
		 */
		GetContentClass: function(component, nbr) {
			if (component.isScrollingEnabled()) {
				var scrollNbr = component.getScrollNumber();
				if (nbr > scrollNbr && scrollNbr > 0) {
					return "content-body scrollable";
				}
			}
			return "content-body";
		},
		/**
		 * CreateTimer will create a SLA timer and start the timer prior to returning.
		 * @param {String} timerName The timer name to start
		 * @param {String} subTimerName The subtimer name to start
		 * @param {String} metaData1
		 * @param {String} metaData2
		 * @param {String} metaData3
		 */
		CreateTimer: function(timerName, subTimerName, metaData1, metaData2, metaData3) {
			try {
				var slaTimer = window.external.DiscernObjectFactory("SLATIMER");
				MP_Util.LogTimerInfo(timerName, subTimerName, "SLATIMER", "mp_core.js", "CreateTimer");
			}
			catch (err) {
				return null;
			}

			if (slaTimer) {
				slaTimer.TimerName = timerName;
				if (subTimerName)
					slaTimer.SubtimerName = subTimerName;
				if (metaData1)
					slaTimer.Metadata1 = String(metaData1);
				if (metaData2)
					slaTimer.Metadata2 = String(metaData2);
				if (metaData3)
					slaTimer.Metadata3 = String(metaData3);

				slaTimer.Start();
				return slaTimer;
			}
			else {
				return null;
			}
		},
		/**
		 * Retrieves the code values for a given code set
		 * @param codeSet [REQUIRED] The code set in which to retrieve
		 * @param async [REQUIRED] A <code>Boolean</code> value indicating to call async.  <code>TRUE</code> = yes, <code>FALSE</code> = no
		 * @return A list of code from the code set
		 */
		GetCodeSet: function(codeSet, async) {
			var codes = new Array();
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
			info.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetCodeSet");
					var jsonEval = JSON.parse(this.responseText);
					if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S") {
						codes = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
					}
					return codes;
				}
				if (this.readyState == 4) {
					MP_Util.ReleaseRequestReference(this);
				}

			}
			//  Call the ccl progam and send the parameter string
			var sendVal = "^MINE^, " + codeSet + ".0";
			if (CERN_BrowserDevInd) {
				var url = "MP_GET_CODESET?parameters=" + sendVal;
				info.open('GET', url, async);
				info.send(null);
			}
			else {
				info.open('GET', "MP_GET_CODESET", async);
				info.send(sendVal);
			}

			return codes;
		},
		/**
		 * Will return a code object from the mapped list by the cdf_meaning
		 * @param mapCodes [REQUIRED] The map of code values to search
		 * @param meaning [REQUIRED] The cdf_meaning of the code value to search
		 * @return The code object associated to the cdf_meaning provides.  Else null
		 */
		GetCodeByMeaning: function(mapCodes, meaning) {
			for (var x = mapCodes.length; x--; ) {
				var code = mapCodes[x].value;
				if (code.meaning == meaning)
					return code;
			}
			return null;
		},
		GetCodeValueByMeaning: function(meaning, codeSet) {
			var codeValue = 0;
			var list = m_codeSets[codeSet];
			if (!list) {
				list = m_codeSets[codeSet] = MP_Util.GetCodeSet(codeSet, false);
			}
			if (list && list.length > 0) {
				for (var x = list.length; x--; ) {
					var code = list[x].value;
					if (code.meaning === meaning) {
						return code;
					}
				}
			}
			return null;
		},
		/**
		 * Will search for a value within the provided mapped array and return the value associated to the name/value pair
		 * @param mapItems [REQUIRED] The mapped array of items to search through
		 * @param item [REQUIRED] The item in which to search
		 * @return The value from the name/value pair
		 */
		GetItemFromMapArray: function(mapItems, item) {
			for (var x = 0; x < mapItems.length; x++) {
				if (mapItems[x].name == item)
					return mapItems[x].value;
			}
		},
		/**
		 * Add an item to the array of items associated to the map key
		 * @param mapItems [REQUIRED] The map array to search within
		 * @param key [REQUIRED] The primary key that will be searching for within the map array
		 * @param value [REQUIRED] The object that is to be added to the map array
		 */
		AddItemToMapArray: function(mapItems, key, value) {
			var ar = MP_Util.GetItemFromMapArray(mapItems, key);
			if (!ar) {
				ar = []
				mapItems.push(new MP_Core.MapObject(key, ar));
			}
			ar.push(value);
		},
		LookBackTime: function(component) {
			var i18nCore = i18n.discernabu;
			var remainder = 0;
			var lookbackDays = component.getLookbackDays();
			if (lookbackDays == 0) {
				return (i18nCore.SELECTED_VISIT);
			}
			else if (lookbackDays == 1) {
				return (i18nCore.LAST_N_HOURS.replace("{0}", lookbackDays * 24));
			}
			else {
				return (i18nCore.LAST_N_DAYS.replace("{0}", lookbackDays));
			}
		},
		CreateClinNoteLink: function(patient_id, encntr_id, event_id, display, docViewerType, pevent_id) {
			var docType = (docViewerType && docViewerType > "") ? docViewerType : 'STANDARD';
			var doclink = ""
			if (event_id > 0) {
				var ar = [];
				ar.push(patient_id, encntr_id, event_id, "\"" + docType + "\"", pevent_id);
				doclink = "<a onclick='javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + "); return false;' href='#'>" + display + "</a>"
			}
			else {
				doclink = display
			}
			return (doclink);
		},
		/**
		 * Retrieves a document for viewing via the MPages RTF viewer
		 * @param {Object} eventId The parent or child event id for retrieval
		 * @param {Object} docViewerType
		 * 0: Parent Event Id retrieval of child event blobs
		 * 1: Event Id blob retrieval
		 * 2: Long text retrieval
		 * 3: Micro Detail retrieval
		 * 4: Anatomic Pathology retrieval
		 */
		LaunchClinNoteViewer: function(patient_id, encntr_id, event_id, docViewerType, pevent_id) {
			var x = 0;
			var m_dPersonId = parseFloat(patient_id);
			var m_dEncntrId = parseFloat(encntr_id);
			var m_dPeventId = parseFloat(pevent_id);
			var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
			MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
			try {
				switch (docViewerType) {
					case 'AP':
						viewerObj.CreateAPViewer();
						viewerObj.AppendAPEvent(event_id, m_dPeventId);
						viewerObj.LaunchAPViewer();
						break;
					case 'DOC':
						viewerObj.CreateDocViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendDocEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendDocEvent(event_id);
						}
						viewerObj.LaunchDocViewer();
						break;
					case 'EVENT':
						viewerObj.CreateEventViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendEvent(event_id);
						}
						viewerObj.LaunchEventViewer();
						break;
					case 'MICRO':
						viewerObj.CreateMicroViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendMicroEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendMicroEvent(event_id);
						}
						viewerObj.LaunchMicroViewer();
						break;
					case 'GRP':
						viewerObj.CreateGroupViewer();
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendGroupEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendGroupEvent(event_id);
						}
						viewerObj.LaunchGroupViewer();
						break;
					case 'PROC':
						viewerObj.CreateProcViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendProcEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendProcEvent(event_id);
						}
						viewerObj.LaunchProcViewer();
						break;
					case 'HLA':
						viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, event_id);
						break;
					case 'NR':
						viewerObj.LaunchRemindersViewer(event_id);
						break;
					case 'STANDARD':
						alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS);
						break;
				}
			}
			catch (err) {
				MP_Util.LogJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
				alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.discernabu.CONTACT_ADMINISTRATOR);
			}

		},
		IsArray: function(input) {
			return ( typeof (input) == 'object' && ( input instanceof Array));
		},
		IsString: function(input) {
			return ( typeof (input) == 'string');
		},
		HandleNoDataResponse: function(nameSpace) {
			var i18nCore = i18n.discernabu;
			return ("<h3 class='info-hd'><span class='res-normal'>" + i18nCore.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18nCore.NO_RESULTS_FOUND + "</span>");
		},
		HandleErrorResponse: function(nameSpace, errorMessage) {
			var ar = [];
			var i18nCore = i18n.discernabu;
			//Create the HTML that will be returned to the component
			var ns = (nameSpace && nameSpace.length > 0) ? nameSpace + "-" : "";
			ar.push("<h3 class='info-hd'><span class='res-normal'>", i18nCore.ERROR_RETREIVING_DATA, "</span></h3>");
			ar.push("<dl class='", ns, "info error-message error-text'><dd><span>", i18nCore.ERROR_RETREIVING_DATA, "</span></dd></dl>");
			//log the error out to the JSLogger
			if (errorMessage && errorMessage.length) {
				MP_Util.LogError(i18n.COMPONENTS + ": " + nameSpace + "<br />" + errorMessage);
			}
			return ar.join("");
		},
		GetValueFromArray: function(name, array) {
			if (array != null) {
				for (var x = 0, xi = array.length; x < xi; x++) {
					if (array[x].name == name) {
						return (array[x].value);
					}
				}
			}
			return (null);
		},
		GetPrsnlObjByIdAndDate: function(name, date, personnelArray) {
			var prsnlObj;
			var latestPrsnlObj;
			try {
				if (personnelArray && personnelArray.length) {
					for (var x = 0, xi = personnelArray.length; x < xi; x++) {
						if (personnelArray[x].name == name) {
							prsnlObj = personnelArray[x].value;
							//If no personnel object found return the first/latest prsnl name
							if (!latestPrsnlObj) {
								latestPrsnlObj = prsnlObj;
							}
							if ( typeof date == "string") {
								//Convert to the correct date format for comparison
								if (/^\/Date\(/.exec(date)) {
									date = /[0-9]+-[0-9]+-[0-9]+/.exec(date) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(date) + "Z";
								}
								if ((date > prsnlObj.beg_dt_tm_string && date < prsnlObj.end_dt_tm_string) || date == prsnlObj.beg_dt_tm_string || date == prsnlObj.end_dt_tm_string) {
									return (prsnlObj);
								}
							}
							else {
								throw (new Error("Invalid date object passed into GetPrsnlObjByIdAndDate.  The date object must be a string."));
							}
						}
					}
					return (latestPrsnlObj);
				}
				return (null);
			}
			catch(err) {
				MP_Util.LogJSError(err, null, "mp_core.js", "GetPrsnlObjByIdAndDate");
				return (null);
			}
		},
		GetCompObjById: function(id) {
			var comps = CERN_MPageComponents;
			var cLen = comps.length;
			for (var i = cLen; i--; ) {
				var comp = comps[i];
				if (comp.m_componentId === id) {
					return comp;
				}
			}
			return (null);
		},
		GetCompObjByStyleId: function(id) {
			var cLen = CERN_MPageComponents.length;
			for (var i = cLen; i--; ) {
				var comp = CERN_MPageComponents[i];
				var styles = comp.getStyles();
				if (styles.getId() === id) {
					return comp;
				}
			}
			return (null);
		},
		LoadCodeListJSON: function(parentElement) {
			var codeArray = new Array();
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var codeObject = new Object();
					codeElement = parentElement[x];
					codeObject.codeValue = codeElement.CODE;
					codeObject.display = codeElement.DISPLAY;
					codeObject.description = codeElement.DESCRIPTION;
					codeObject.codeSet = codeElement.CODE_SET;
					codeObject.sequence = codeElement.SEQUENCE;
					codeObject.meaning = codeElement.MEANING;
					var mapObj = new MP_Core.MapObject(codeObject.codeValue, codeObject);
					codeArray.push(mapObj);
				}
			}
			return (codeArray);
		},
		LoadPersonelListJSON: function(parentElement) {
			var personnelArray = [];
			var codeElement;
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var prsnlObj = {};
					codeElement = parentElement[x];
					prsnlObj.id = codeElement.ID;
					//If available retrieve the beg and end date and time for a prsnl name
					if (codeElement.BEG_EFFECTIVE_DT_TM) {
						prsnlObj.beg_dt_tm = codeElement.BEG_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.beg_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "Z";
					}
					if (codeElement.END_EFFECTIVE_DT_TM) {
						prsnlObj.end_dt_tm = codeElement.END_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.end_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM) + "Z";
					}
					prsnlObj.fullName = codeElement.PROVIDER_NAME.NAME_FULL;
					prsnlObj.firstName = codeElement.PROVIDER_NAME.NAME_FIRST;
					prsnlObj.middleName = codeElement.PROVIDER_NAME.NAME_MIDDLE;
					prsnlObj.lastName = codeElement.PROVIDER_NAME.NAME_LAST;
					prsnlObj.userName = codeElement.PROVIDER_NAME.USERNAME;
					prsnlObj.initials = codeElement.PROVIDER_NAME.INITIALS;
					prsnlObj.title = codeElement.PROVIDER_NAME.TITLE;
					var mapObj = new MP_Core.MapObject(prsnlObj.id, prsnlObj);
					personnelArray[x] = mapObj;
				}
			}
			return (personnelArray);
		},
		WriteToFile: function(sText) {
			try {
				var ForAppending = 8;
				var TriStateFalse = 0;
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				var newFile = fso.OpenTextFile("c:\\temp\\test.txt", ForAppending, true, TriStateFalse);
				newFile.write(sText);
				newFile.close();
			}
			catch (err) {
				var strErr = 'Error:';
				strErr += '\nNumber:' + err.number;
				strErr += '\nDescription:' + err.description;
				document.write(strErr);
			}
		},
		CalculateAge: function(bdate) {
			var age;
			//typecasting string to date obj
			var bdate = new Date(bdate);
			var byear = bdate.getFullYear();
			var bmonth = bdate.getMonth();
			var bday = bdate.getDate();
			var bhours = bdate.getHours();
			today = new Date();
			year = today.getFullYear();
			month = today.getMonth();
			day = today.getDate();
			hours = today.getHours();

			if (year == byear && (day == bday)) {
				age = hours - bhours;
				age += " Hours";
				return age;
			}
			else if (year == byear && (month == bmonth)) {
				age = day - bday;
				age += " Days";
				return age;
			}
			if (year == byear) {
				age = month - bmonth;
				age += " Months";
				return age;
			}
			else {
				if (month < bmonth) {
					age = year - byear - 1;
				}
				else if (month > bmonth) {
					age = year - byear;
				}
				else if (month == bmonth) {
					if (day < bday) {
						age = year - byear - 1;
					}
					else if (day > bday) {
						age = year - byear;
					}
					else if (day == bday) {
						age = year - byear;
					}
				}
			}
			age += " Years"
			return age;
		},
		/**
		 *  Javascript string pad
		 *  @see http://www.webtoolkit.info/
		 **/
		pad: function(str, len, pad, dir) {
			if ( typeof (len) == "undefined") {
				var len = 0;
			}
			if ( typeof (pad) == "undefined") {
				var pad = ' ';
			}
			if ( typeof (dir) == "undefined") {
				var dir = STR_PAD_RIGHT;
			}

			if (len + 1 >= str.length) {

				switch (dir) {

					case STR_PAD_LEFT:
						str = Array(len + 1 - str.length).join(pad) + str;
						break;

					case STR_PAD_BOTH:
						var right = Math.ceil(( padlen = len - str.length) / 2);
						var left = padlen - right;
						str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
						break;

					default:
						str = str + Array(len + 1 - str.length).join(pad);
						break;

				} // switch
			}
			return str;
		},

		/**
		 * Launches graph in a modal window viewable in the Powerchart framework
		 * @param patientId The person ID for the patient selected
		 * @param encntrId The encounter ID of the visit selected
		 * @param eventCode Used to plot simple results for a given patient/encounter I.e. weight,height,BMI,BUN,WBC.
		 * @param staticContent location of the static content directory that contains the core JS / CSS files needed for the graph
		 * @param groupId If item is a grouped item pass the BR_DATAMART_FILTER_ID to pull all associated results I.e. BP,Temp,or HR.
		 * @param providerId Personnel ID of the user logged into the application
		 * @param positionCd Position <code>Code</code> of the user
		 * @param pprCD Person Personnel Relationship code value
		 * @param lookBackUnits
		 * @param lookBackType 1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years
		 */
		GraphResults: function(eventCd, compID, groupID) {
			var component = MP_Util.GetCompObjById(compID);
			var lookBackUnits = (component.getLookbackUnits() != null && component.getLookbackUnits() > 0) ? component.getLookbackUnits() : "365";
			var lookBackType = (component.getLookbackUnitTypeFlag() != null && component.getLookbackUnitTypeFlag() > 0) ? component.getLookbackUnitTypeFlag() : "2";
			var i18nCore = i18n.discernabu;
			var subTitleText = "";
			var scope = component.getScope();
			var lookBackText = "";
			var criterion = component.getCriterion();
			component.setLookbackUnits(lookBackUnits);
			component.setLookbackUnitTypeFlag(lookBackType);

			if (scope > 0) {
				switch(lookBackType) {
					case 1:
						var replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
						break;

					case 2:
						var replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
						break;

					case 3:
						var replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
						break;

					case 4:
						var replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
						break;

					case 5:
						var replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
						break;

					default:
						var replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
						break;
				}

				switch(scope) {
					case 1:
						lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
						var encntrOption = "0.0";
						break;
					case 2:
						lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
						var encntrOption = criterion.encntr_id;
						break;
				}
			}

			var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
			var sParams = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "\\discrete-graphing^," + groupID + ".0," + criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^";
			var graphCall = "javascript:CCLLINK('mp_retrieve_graph_results', '" + sParams + "',1)";
			MP_Util.LogCclNewSessionWindowInfo(null, graphCall, "mp_core.js", "GraphResults");
			javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);
			Util.preventDefault();
		},
		ReleaseRequestReference: function(reqObj) {
			if (!CERN_BrowserDevInd && XMLCCLREQUESTOBJECTPOINTER) {
				for (var id in XMLCCLREQUESTOBJECTPOINTER) {
					if (XMLCCLREQUESTOBJECTPOINTER[id] == reqObj) {
						delete (XMLCCLREQUESTOBJECTPOINTER[id])
					}
				}
			}
		},
		/**
		 * Message box similar to alert or confirm with customizable options.
		 * @param msg {string} String message or html to display in message box
		 * @param title {string} [OPTIONAL] Title of the message box
		 * @param btnTrueText {string} [OPTIONAL] Text value of the true option button, will default to 'OK' if omitted.
		 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
		 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
		 * @param cb {object} [OPTIONAL] Callback function to fire on true button click.
		 */
		AlertConfirm: function(msg, title, btnTrueText, btnFalseText, falseBtnFocus, cb) {
			var btnTrue = "<button id='acTrueButton' data-val='1'>" + ((btnTrueText) ? btnTrueText : i18n.discernabu.CONFIRM_OK) + "</button>";
			var btnFalse = "";
			if (btnFalseText) {
				btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
			}
			if (!title) {
				title = "&nbsp;";
			}

			var closeBox = function() {
				var btnVal = parseInt(this.getAttribute('data-val'), 10);
				$(".modal-div").remove();
				$(".modal-dialog").remove();
				$("html").css("overflow", "auto");
				//reset overflow
				if (btnVal && typeof cb === "function") {
					cb();
				}
			}
			var modalDiv = Util.cep("div", {
				"className": "modal-div"
			});
			var dialog = Util.cep("div", {
				"className": "modal-dialog"
			});

			dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div>" + "<div class='modal-dialog-content'>" + msg + "</div>" + "<div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnTrue + btnFalse + "</div></div>";

			var docBody = document.body;
			Util.ac(modalDiv, docBody);
			Util.ac(dialog, docBody);

			Util.addEvent(_g('acTrueButton'), "click", closeBox);
			if (btnFalseText) {
				Util.addEvent(_g('acFalseButton'), "click", closeBox);
			}

			if (falseBtnFocus && btnFalseText) {
				_g('acFalseButton').focus();
			}
			else {
				_g('acTrueButton').focus();
			}

			$("html").css("overflow", "hidden");
			//disable page scrolling when modal is enabled
			$(modalDiv).height($(document).height());
		},
		/**
		 * Message box similar to alert or confirm with customizable options.
		 * @param msg {string} String message or html to display in message box
		 * @param title {string} [OPTIONAL] Title of the message box
		 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
		 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
		 * @param cb {object} [OPTIONAL] Callback function to fire on closing message box.
		 */
		ActionableAlertConfirm: function(msg, title, btnFalseText, falseBtnFocus, cb) {
			var btnFalse = "";
			if (btnFalseText) {
				btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
			}
			if (!title) {
				title = "&nbsp;";
			}

			var closeBox = function() {
				var btnVal = parseInt(this.getAttribute('data-val'), 10);
				$(".modal-div").remove();
				$(".modal-dialog-actionable").remove();
				$("html").css("overflow", "auto");
				//reset overflow
				if (cb && typeof cb === "function") {
					cb();
				}
			}
			var modalDiv = Util.cep("div", {
				"className": "modal-div"
			});
			var dialog = Util.cep("div", {
				"className": "modal-dialog-actionable"
			});

			dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div><div class='modal-dialog-content'>" + msg + "</div><div id='acActionableContent' class='modal-dialog-actionable-content'></div><div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnFalse + "</div></div>";

			var docBody = document.body;
			Util.ac(modalDiv, docBody);
			Util.ac(dialog, docBody);

			if (btnFalseText) {
				Util.addEvent(_g('acFalseButton'), "click", closeBox);
			}

			if (falseBtnFocus && btnFalseText) {
				_g('acFalseButton').focus();
			}

			$("html").css("overflow", "hidden");
			//disable page scrolling when modal is enabled
			$(modalDiv).height($(document).height());
		},
		CreateAutoSuggestBoxHtml: function(component, elementId) {
			var searchBoxHTML = [];
			var txtBoxId = "";
			var compNs = component.getStyles().getNameSpace();
			var compId = component.getComponentId();
			if (elementId) {
				txtBoxId = compNs + elementId + compId;
			}
			else {
				txtBoxId = compNs + "ContentCtrl" + compId;
			}

			searchBoxHTML.push("<div class='search-box-div'><form name='contentForm' onSubmit='return false'><input type='text' id='", txtBoxId, "'", " class='search-box'></form></div>");
			return searchBoxHTML.join("");
		},
		AddAutoSuggestControl: function(component, queryHandler, selectionHandler, selectDisplayHandler, itemId) {
			new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler, itemId);
		},
		RetrieveAutoSuggestSearchBox: function(component) {
			var componentNamespace = component.getStyles().getNameSpace();
			var componentId = component.getComponentId();
			return _g(componentNamespace + "ContentCtrl" + componentId);
		},
		CreateParamArray: function(ar, type) {
			var returnVal = (type === 1) ? "0.0" : "0";
			if (ar && ar.length > 0) {
				if (ar.length > 1) {
					if (type === 1) {
						returnVal = "value(" + ar.join(".0,") + ".0)"
					}
					else {
						returnVal = "value(" + ar.join(",") + ")"
					}
				}
				else {
					returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
				}
			}
			return returnVal;
		},
		/**
		 * This method is used to overlay the content of a component with a transparent DIV and also show the loading icon (spinner) in the center of that container.
		 * @param {String} resultContainerId The id of the element which should be covered by the spinner.
		 * @return null
		 */
		 LoadSpinner:function(resultContainerID){
				if(resultContainerID && typeof resultContainerID === "string"){
					var resultContainer = $('#'+resultContainerID);
					var contentHeight = resultContainer.height();
					var offset = resultContainer.offsetParent();
					var loadingIconTop = offset.height() - contentHeight;
					resultContainer.append("<div class='loading-screen' style='height: "+contentHeight+"px; top: "+loadingIconTop+"px; '><div class='loading-spinner'>&nbsp;</div></div>");
				}
		 },
		/**
		 * Will get the date formatter associate to the locale loaded by the driver
		 * @return The date formatter to utilize for the loaded locale
		 */
		GetDateFormatter: function() {
			if (!m_df) {
				m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			}
			return m_df;
		},
		/**
		 * Will get the numeric formatter associate to the locale loaded by the driver
		 * @return The numeric formatter to utilize for the loaded locale
		 */
		GetNumericFormatter: function() {
			if (!m_nf) {
				m_nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
			}
			return m_nf;
		},
		/**
		 * Replaces the current MPages view with the output of the reportName script
		 */
		PrintReport: function(reportName, person_id, encounter_id) {
			var paramString = "^MINE^,^" + reportName + "^," + person_id + "," + encounter_id;
			CCLLINK("pwx_rpt_driver_to_mpage", paramString, 1);
		},
		CalculatePrecision: function(valRes) {
			var precision = 0;
			var str = (MP_Util.IsString(valRes)) ? valRes : valRes.toString();
			var decLoc = str.search(/\.(\d)/);
			if (decLoc !== -1) {
				var strSize = str.length;
				precision = strSize - decLoc - 1;
			}
			return precision;
		},
		/**
		 * Will create a date/time in the format neccessary for passing as a prompt parameter
		 */
		CreateDateParameter: function(date) {
			var day = date.getDate();
			var month = ""
			var rest = date.format("yyyy HH:MM:ss");
			switch (date.getMonth()) {
				case (0):
					month = "JAN";
					break;
				case (1):
					month = "FEB";
					break;
				case (2):
					month = "MAR";
					break;
				case (3):
					month = "APR";
					break;
				case (4):
					month = "MAY";
					break;
				case (5):
					month = "JUN";
					break;
				case (6):
					month = "JUL";
					break;
				case (7):
					month = "AUG";
					break;
				case (8):
					month = "SEP";
					break;
				case (9):
					month = "OCT";
					break;
				case (10):
					month = "NOV";
					break;
				case (11):
					month = "DEC";
					break;
				default:
					alert("unknown month");
			}
			return (day + "-" + month + "-" + rest);
		},
		LogDebug: function(debugString) {
			if(!log.isBlackBirdActive()){ return; }
			if (debugString) {
				log.debug(debugString);
			}
		},
		LogWarn: function(warnString) {
			if(!log.isBlackBirdActive()){ return; }
			if (warnString) {
				log.warn(warnString);
			}
		},
		LogInfo: function(infoString) {
			if(!log.isBlackBirdActive()){ return; }
			if (infoString) {
				log.info(infoString);
			}
		},
		LogError: function(errorString) {
			if(!log.isBlackBirdActive()){ return; }
			if (errorString) {
				log.error(errorString);
			}
		},
		LogScriptCallInfo: function(component, request, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText].join(""));
		},
		LogScriptCallError: function(component, request, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status].join(""));
		},
		LogJSError: function(err, component, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description].join(""));
		},
		LogDiscernInfo: function(component, objectName, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName].join(""));
		},
		LogMpagesEventInfo: function(component, eventName, params, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params].join(""));
		},
		LogCclNewSessionWindowInfo: function(component, params, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.debug(["CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params].join(""));
		},
		LogTimerInfo: function(timerName, subTimerName, timerType, file, funcName) {
			if(!log.isBlackBirdActive()){ return; }
			log.debug(["Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName].join(""));
		},
		AddCookieProperty: function(compId, propName, propValue) {
			var cookie = CK_DATA[compId];
			if (!cookie) {
				cookie = {};
			}
			cookie[propName] = propValue;
			CK_DATA[compId] = cookie;
		},
		GetCookieProperty: function(compId, propName) {
			var cookie = CK_DATA[compId];
			if (cookie && cookie[propName]) {
				return cookie[propName];
			}
			else {
				return null;
			}
		},
		WriteCookie: function() {
			var cookieJarJSON = JSON.stringify(CK_DATA);
			document.cookie = 'CookieJar=' + cookieJarJSON + ';';
		},
		RetrieveCookie: function() {
			var cookies = document.cookie;
			var match = cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
			if (match && match[1]) {
				CK_DATA = JSON.parse(match[1]);
			}
		},
		generateModalDialogBody: function(IDName,Type,Line1,Line2){
			var currModal = MP_ModalDialog.retrieveModalDialogObject(IDName);
			var modal;
			if(!currModal){
				modal = new ModalDialog(IDName);
			}
			else{
				modal = currModal;
			}
			var modalHTML;
			var typeToString = Type.toString().toLowerCase();
			modal.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20).setIsBodySizeFixed(false).setIsBodySizeFixed(false).setIsFooterAlwaysShown(true);
			//Determine which HTML string to use based on the type
			switch(typeToString){
				case "error":
					modalHTML = "<div class='modal-error-container'><span class='error-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				case "warning":
					modalHTML = "<div class='modal-warning-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				/*
				 * KE020126: Commented out the information and default sections.  We don't have a current use for these
				 * but can easily be uncommented in the future.

				case "information":
					modalHTML = "<div class='modal-information-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				*/
				case "busy":
					modalHTML = "<div class='modal-busy-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				/*
				default:
					modalHTML = "<div class='modal-default-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				*/
			}

			if(modal.isActive()){
				modal.setBodyHTML(modalHTML);
			}
			else{
				modal.setBodyDataFunction(function(modalObj){
				 modalObj.setBodyHTML(modalHTML);
				});
			}
			return modal;
		},
		/**
		 * Creates a mapping between a string identifier and an object definition.  The object definition is only mapped
		 * when the objectDefinition parameter is an actual object and an existing object does not exist for that
		 * identifier.
		 * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
		 * insensitive.
		 * @param {function} objectDefinition : A reference to the definition of the object being mapped
		 * @return {boolean} True if the object mapping was added successfully, false otherwise.
		 */
		setObjectDefinitionMapping : function(mappingId, objectDefinition) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return false;
			}
			mappingId = mappingId.toUpperCase();

			//Check to see if there is an existing mapping for that ID
			if( typeof CERN_ObjectDefinitionMapping[mappingId] !== "undefined") {
				MP_Util.LogInfo("Object mapping already exists for " + mappingId + "\nPlease select a different id or use the MP_Util.updateObjectDefinitionMApping function");
				return false;
			}
			//Make sure we are mapping an object definition which would be a function
			if( typeof objectDefinition === "function" ) {
				CERN_ObjectDefinitionMapping[mappingId] = objectDefinition;
				return true;
			}
			return false;
		},
		/**
		 * Retrieves the object mapped to a specific mappingId if it is defined in the CERN_ObjectDefinitionMapping object
		 * @param {string} mappingId : The id mapped to a specific object in the CERN_ObjectDefintionMapping object.   This id is case
		 * insensitive.
		 * @return {function} The object definition mapped to the mappingId passed into the function.
		 */
		getObjectDefinitionMapping : function(mappingId) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return null;
			}
			mappingId = mappingId.toUpperCase();
			//Attempt to retrieve the object definition
			if( typeof CERN_ObjectDefinitionMapping[mappingId] === "undefined") {
				return null;
			}
			return CERN_ObjectDefinitionMapping[mappingId];
		},
		/**
		 * Updates the object definition mapped to the identifier passed into the function.  If no object is mapped to the
		 * identifier then no updates are made to the CERN_ObjectDefinitionMapping object.
		 * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
		 * insensitive.
		 * @param {function} objectDefinition : A reference to the definition of the object being mapped
		 * @return {boolean} True if the object mapping was updated successfully, false otherwise.
		 */
		updateObjectDefinitionMapping : function(mappingId, objectDefinition) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return null;
			}
			mappingId = mappingId.toUpperCase();
			//Make sure an object definition already exists for this mappingId
			if( typeof CERN_ObjectDefinitionMapping[mappingId] === "undefined") {
				MP_Util.LogInfo("Object mapping does not exists for " + mappingId);
				return false;
			}
			//Make sure we are mapping an object definition which would be a function
			if( typeof objectDefinition === "function" ) {
				CERN_ObjectDefinitionMapping[mappingId] = objectDefinition;
				return true;
			}
			return false;
		},
		/**
		 * Removes the object definition mapped to the identifier passed into the function.
		 * @param {string} mappingId : An id associated to the specific object definition that will be removed.  This id is case
		 * insensitive.
		 * @return {boolean} True if the object mapping was removed successfully, false otherwise.
		 */
		removeObjectDefinitionMapping : function(mappingId) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return null;
			}
			mappingId = mappingId.toUpperCase();
			//Make sure the object definition exists before we attempt to delete it
			if( typeof CERN_ObjectDefinitionMapping[mappingId] === "undefined") {
				MP_Util.LogInfo("Object mapping does not exists for " + mappingId);
				return false;
			}
			return delete CERN_ObjectDefinitionMapping[mappingId];
		}
	};
	/**
	 * Calculates difference between two dates given and returns string with appropriate units
	 * If no endDate is given it is assumed the endDate is the current date/time
	 *
	 * @param beginDate [REQUIRED] Begin <code>Date</code> for Calculation
	 * @param endDate [OPTIONAL] End <code>Date</code> for Calculation
	 * @param mathFlag [OPTIONAL] <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 =
	 * Floor, 0 = Ceil
	 * @param abbreviateFlag [REQUIRED] <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used
	 * such as in the case of a within string
	 */
	function GetDateDiffString(beginDate, endDate, mathFlag, abbreviateFlag) {
		var i18nCore = i18n.discernabu;
		var timeDiff = 0;
		var returnVal = "";
		//Set endDate to current time if it's not passed in
		endDate = (!endDate) ? new Date() : endDate;
		mathFlag = (!mathFlag) ? 0 : mathFlag;
		var one_minute = 1000 * 60;
		var one_hour = one_minute * 60;
		var one_day = one_hour * 24;
		var one_week = one_day * 7;

		var valMinutes = 0;
		var valHours = 0;
		var valDays = 0;
		var valWeeks = 0;
		var valMonths = 0;
		var valYears = 0;
		//time diff in milliseconds
		timeDiff = (endDate.getTime() - beginDate.getTime());

		//Choose if ceiling or floor should be applied
		var mathFunc = null;
		var comparisonFunc = null;
		if (mathFlag == 0) {
			mathFunc = function(val) {
				return Math.ceil(val);
			}
			comparisonFunc = function(lowerVal, upperVal) {
				return (lowerVal <= upperVal);
			}
		}
		else {
			mathFunc = function(val) {
				return Math.floor(val);
			}
			comparisonFunc = function(lowerVal, upperVal) {
				return (lowerVal < upperVal);
			}
		}

		var calcMonths = function() {
			var removeCurYr = 0;
			var removeCurMon = 0;
			var yearDiff = 0;
			var monthDiff = 0;
			var dayDiff = endDate.getDate();
			if (endDate.getMonth() > beginDate.getMonth()) {
				monthDiff = endDate.getMonth() - beginDate.getMonth();
				if (endDate.getDate() < beginDate.getDate()) {
					removeCurMon = 1;
				}
			}
			else if (endDate.getMonth() < beginDate.getMonth()) {
				monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
				removeCurYr = 1;
				if (endDate.getDate() < beginDate.getDate()) {
					removeCurMon = 1;
				}
			}
			else if (endDate.getDate() < beginDate.getDate()) {
				removeCurYr = 1;
				monthDiff = 11;
			}

			if (endDate.getDate() >= beginDate.getDate()) {
				dayDiff = endDate.getDate() - beginDate.getDate();
			}

			yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
			//days are divided by 32 to ensure the number will always be less than zero
			monthDiff += (yearDiff * 12) + (dayDiff / 32) - removeCurMon;

			return monthDiff;
		};

		valMinutes = mathFunc(timeDiff / one_minute);
		valHours = mathFunc(timeDiff / one_hour);
		valDays = mathFunc(timeDiff / one_day);
		valWeeks = mathFunc(timeDiff / one_week);
		valMonths = calcMonths();
		valMonths = mathFunc(valMonths);
		valYears = mathFunc(valMonths / 12);

		if (comparisonFunc(valHours, 2))//Less than 2 hours, display number of minutes. Use abbreviation of "mins".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_MINS.replace("{0}", valMinutes)) : (i18nCore.X_MINUTES.replace("{0}", valMinutes));
		else if (comparisonFunc(valDays, 2))//Less than 2 days, display number of hours. Use abbreviation of "hrs".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_HOURS.replace("{0}", valHours)) : (i18nCore.X_HOURS.replace("{0}", valHours));
		else if (comparisonFunc(valWeeks, 2))//Less than 2 weeks, display number of days. Use "days".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_DAYS.replace("{0}", valDays)) : (i18nCore.X_DAYS.replace("{0}", valDays));
		else if (comparisonFunc(valMonths, 2))//Less than 2 months, display number of weeks. Use abbreviation of "wks".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18nCore.X_WEEKS.replace("{0}", valWeeks));
		else if (comparisonFunc(valYears, 2))//Less than 2 years, display number of months. Use abbreviation of "mos".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18nCore.X_MONTHS.replace("{0}", valMonths));
		else//Over 2 years, display number of years.  Use abbreviation of "yrs".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_YEARS.replace("{0}", valYears)) : (i18nCore.X_YEARS.replace("{0}", valYears));

		return (returnVal);
	}

}();



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
	  *  (3) install the Script Source Code in Client’s environment.          *
	  *  B. Use of the Script Source Code is for Client’s internal purposes   *
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
	  *     Source Code prior to moving such code into Client’s production    *
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
	  *     performance of Client’s System.                                   *
	  *  C. Client waives, releases, relinquishes, and discharges Cerner from *
      *     any and all claims, liabilities, suits, damages, actions, or      *
	  *     manner of actions, whether in contract, tort, or otherwise which  *
	  *     Client may have against Cerner, whether the same be in            *
	  *     administrative proceedings, in arbitration, at law, in equity, or *
      *     mixed, arising from or relating to Client’s use of Script Source  *
	  *     Code.                                                             *
	  * 5. Retention of Ownership                                             *
	  *    Cerner retains ownership of all software and source code in this   *
	  *    service package. Client agrees that Cerner owns the derivative     *
	  *    works to the modified source code. Furthermore, Client agrees to   *
	  *    deliver the derivative works to Cerner.                            *
  ~BE~************************************************************************/
/******************************************************************************

        Source file name:       dc_mp_js_util_mpage.js

        Product:                Discern Content
        Product Team:           Discern Content

        File purpose:           Contains routines to access CCLINK, CCLNEWSESSIONWINDOW,


        Special Notes:          <add any special notes here>

;~DB~**********************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
;**************************************************************************************
;*                                                                            		  *
;*Mod Date     Engineer             		Feature      Comment                      *
;*--- -------- -------------------- 		------------ -----------------------------*
;*000 		    						    ######       Initial Release              *
;~DE~**********************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/
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

XMLCclRequest = function(options){
    /************ Attributes *************/

    this.onreadystatechange = function(){
        return null;
    };
    this.options = options ||
    {};
    this.readyState = 0;
    this.responseText = "";
    this.status = 0;
    this.statusText = "";
    this.sendFlag = false;
    this.errorFlag = false;
    this.responseBody = this.responseXML = this.async = true;
    this.requestBinding = null;
    this.requestText = null;

    /************** Events ***************/

    //Raised when there is an error.
    this.onerror = /************** Methods **************/ //Cancels the current CCL request.
 this.abort = //Returns the complete list of response headers.
 this.getAllResponseHeaders = //Returns the specified response header.
 this.getResponseHeader = function(){
        return null;
    };

    //Assigns method, destination URL, and other optional attributes of a pending request.
    this.open = function(method, url, async){
        if (method.toLowerCase() != "get" && method.toLowerCase() != "post") {
            this.errorFlag = true;
            this.status = 405;
            this.statusText = "Method not Allowed";
            return false;
        }
        this.method = method.toUpperCase();
        this.url = url;
        this.async = async != null ? (async ? true : false) : true;
        this.requestHeaders = null;
        this.responseText = "";
        this.responseBody = this.responseXML = null;
        this.readyState = 1;
        this.sendFlag = false;
        this.requestText = "";
        this.onreadystatechange();
    };

    //Sends a CCL request to the server and receives a response.
    this.send = function(param){
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

        var el = document.body.appendChild(document.createElement("a"));
        el.className += "xmlcclrequest";
        el.href = "javascript:XMLCCLREQUEST_Send(\"" + uniqueId + "\"" + ")";
        el.click();
    };

    //Adds custom HTTP headers to the request.
    this.setRequestHeader = function(name, value){
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
        if (!value) {
            return false;
        }
        if (!this.requestHeaders) {
            this.requestHeaders = [];
        }
        this.requestHeaders[name] = value;
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
    //	alert("inside MPAGES_EVENT__ with " + eventType +  "   " + eventParams);
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
    //	alert(str);
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

/** dependencies:
 * 		 mpageutil.js
 */

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

		log.info(msg + " " + fnc);
		//alert(msg + " - " + fnc);
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
				if (prefs.dev_debug_ind) {
					that.dev_debug_ind = prefs.dev_debug_ind
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
	this.dev_debug_ind = 0;
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
            return (that.append_json(jQuery.parseJSON(json_text)));
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
								error_handler(debug_string, "ajax_responce()");
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

							if(requestAsync.readyState ==  4 && requestAsync.readyState && requestAsync.status ){
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

								error_handler(ready_state_msg,status_msg);
							}
						}
						catch(e3){}
					}
	            };

				// send request
				if (spec.request.type === "XMLHTTPREQUEST") {
					requestAsync.open("GET", spec.request.target, spec.request.async);
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

					if(Criterion.dev_debug_ind !== undefined && Criterion.dev_debug_ind === 1)
					{
						var url = location.protocol + "//" + location.host + "/CCLTestMockups/" + spec.request.target + ".JSON"; //?parameters=" + spec.request.parameters;
						requestAsync.open("GET", url, spec.request.async);
						requestAsync.send(null);
					}//cpmscript_discern
					else if (location.protocol.substr(0, 4) === "http") {

						var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + spec.request.target + "?parameters=" + spec.request.parameters;
						requestAsync.open("GET", url, spec.request.async);
						requestAsync.send(null);
					}
					else {
						requestAsync.open("POST", spec.request.target, spec.request.async);
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

var WindowStorage = {
    cache: null,

    get: function(key){
        if (window.name.length > 0) {
            this.cache = eval("(" + window.name + ")");
        }
        else {
            this.cache = {};
        }
        return unescape(this.cache[key]);
    },

    encodeString: function(value){
        return encodeURIComponent(value).replace(/'/g, "'")
										.replace(/[~!'()]/g, escape)
										.replace(/\*/g, "%2A")
										.replace(/\./g,"%2E")
										.replace(/\_/g,"%5F")
										.replace(/\-/g,"%2D");
	},

    set: function(key, value){
        this.get();
        if (typeof key != "undefined" && typeof value != "undefined") {
            this.cache[key] = value;
        }
        var jsonString = "{";
        var itemCount = 0;
        for (var item in this.cache) {
            if (itemCount > 0) {
                jsonString += ", ";
            }
            if(item === key){
                jsonString += "'" + this.encodeString(item) + "':'" + this.encodeString(this.cache[item]) + "'";
            }
            else{
                jsonString += "'" + item + "':'" + this.cache[item] + "'";
            }
            itemCount++;
        }
        jsonString += "}";
        window.name = jsonString;
    },
    del: function(key){
        this.get();
        delete this.cache[key];
        //this.serialize(this.cache);
    },
    clear: function(){
        window.name = "";
    }
};
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

/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){function c(b,c){var e=b.nodeName.toLowerCase();if("area"===e){var f=b.parentNode,g=f.name,h;return!b.href||!g||f.nodeName.toLowerCase()!=="map"?!1:(h=a("img[usemap=#"+g+"]")[0],!!h&&d(h))}return(/input|select|textarea|button|object/.test(e)?!b.disabled:"a"==e?b.href||c:c)&&d(b)}function d(b){return!a(b).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}a.ui=a.ui||{};if(a.ui.version)return;a.extend(a.ui,{version:"1.8.21",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(b,c){return typeof b=="number"?this.each(function(){var d=this;setTimeout(function(){a(d).focus(),c&&c.call(d)},b)}):this._focus.apply(this,arguments)},scrollParent:function(){var b;return a.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?b=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(a.curCSS(this,"position",1))&&/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0):b=this.parents().filter(function(){return/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0),/fixed/.test(this.css("position"))||!b.length?a(document):b},zIndex:function(c){if(c!==b)return this.css("zIndex",c);if(this.length){var d=a(this[0]),e,f;while(d.length&&d[0]!==document){e=d.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){f=parseInt(d.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}d=d.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),a.each(["Width","Height"],function(c,d){function h(b,c,d,f){return a.each(e,function(){c-=parseFloat(a.curCSS(b,"padding"+this,!0))||0,d&&(c-=parseFloat(a.curCSS(b,"border"+this+"Width",!0))||0),f&&(c-=parseFloat(a.curCSS(b,"margin"+this,!0))||0)}),c}var e=d==="Width"?["Left","Right"]:["Top","Bottom"],f=d.toLowerCase(),g={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};a.fn["inner"+d]=function(c){return c===b?g["inner"+d].call(this):this.each(function(){a(this).css(f,h(this,c)+"px")})},a.fn["outer"+d]=function(b,c){return typeof b!="number"?g["outer"+d].call(this,b):this.each(function(){a(this).css(f,h(this,b,!0,c)+"px")})}}),a.extend(a.expr[":"],{data:function(b,c,d){return!!a.data(b,d[3])},focusable:function(b){return c(b,!isNaN(a.attr(b,"tabindex")))},tabbable:function(b){var d=a.attr(b,"tabindex"),e=isNaN(d);return(e||d>=0)&&c(b,!e)}}),a(function(){var b=document.body,c=b.appendChild(c=document.createElement("div"));c.offsetHeight,a.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),a.support.minHeight=c.offsetHeight===100,a.support.selectstart="onselectstart"in c,b.removeChild(c).style.display="none"}),a.extend(a.ui,{plugin:{add:function(b,c,d){var e=a.ui[b].prototype;for(var f in d)e.plugins[f]=e.plugins[f]||[],e.plugins[f].push([c,d[f]])},call:function(a,b,c){var d=a.plugins[b];if(!d||!a.element[0].parentNode)return;for(var e=0;e<d.length;e++)a.options[d[e][0]]&&d[e][1].apply(a.element,c)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(b,c){if(a(b).css("overflow")==="hidden")return!1;var d=c&&c==="left"?"scrollLeft":"scrollTop",e=!1;return b[d]>0?!0:(b[d]=1,e=b[d]>0,b[d]=0,e)},isOverAxis:function(a,b,c){return a>b&&a<b+c},isOver:function(b,c,d,e,f,g){return a.ui.isOverAxis(b,d,f)&&a.ui.isOverAxis(c,e,g)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.widget.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){return c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}}),d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;return e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e,f&&e.charAt(0)==="_"?h:(f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b)return h=f,!1}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))}),h)}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}return this._setOptions(e),this},_setOptions:function(b){var c=this;return a.each(b,function(a,b){c._setOption(a,b)}),this},_setOption:function(a,b){return this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);return this.element.trigger(c,d),!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.tabs.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){function e(){return++c}function f(){return++d}var c=0,d=0;a.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:!1,cookie:null,collapsible:!1,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(!0)},_setOption:function(a,b){if(a=="selected"){if(this.options.collapsible&&b==this.options.selected)return;this.select(b)}else this.options[a]=b,this._tabify()},_tabId:function(a){return a.title&&a.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+e()},_sanitizeSelector:function(a){return a.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+f());return a.cookie.apply(null,[b].concat(a.makeArray(arguments)))},_ui:function(a,b){return{tab:a,panel:b,index:this.anchors.index(a)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=a(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(c){function m(b,c){b.css("display",""),!a.support.opacity&&c.opacity&&b[0].style.removeAttribute("filter")}var d=this,e=this.options,f=/^#.+/;this.list=this.element.find("ol,ul").eq(0),this.lis=a(" > li:has(a[href])",this.list),this.anchors=this.lis.map(function(){return a("a",this)[0]}),this.panels=a([]),this.anchors.each(function(b,c){var g=a(c).attr("href"),h=g.split("#")[0],i;h&&(h===location.toString().split("#")[0]||(i=a("base")[0])&&h===i.href)&&(g=c.hash,c.href=g);if(f.test(g))d.panels=d.panels.add(d.element.find(d._sanitizeSelector(g)));else if(g&&g!=="#"){a.data(c,"href.tabs",g),a.data(c,"load.tabs",g.replace(/#.*$/,""));var j=d._tabId(c);c.href="#"+j;var k=d.element.find("#"+j);k.length||(k=a(e.panelTemplate).attr("id",j).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(d.panels[b-1]||d.list),k.data("destroy.tabs",!0)),d.panels=d.panels.add(k)}else e.disabled.push(b)}),c?(this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"),this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.lis.addClass("ui-state-default ui-corner-top"),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"),e.selected===b?(location.hash&&this.anchors.each(function(a,b){if(b.hash==location.hash)return e.selected=a,!1}),typeof e.selected!="number"&&e.cookie&&(e.selected=parseInt(d._cookie(),10)),typeof e.selected!="number"&&this.lis.filter(".ui-tabs-selected").length&&(e.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"))),e.selected=e.selected||(this.lis.length?0:-1)):e.selected===null&&(e.selected=-1),e.selected=e.selected>=0&&this.anchors[e.selected]||e.selected<0?e.selected:0,e.disabled=a.unique(e.disabled.concat(a.map(this.lis.filter(".ui-state-disabled"),function(a,b){return d.lis.index(a)}))).sort(),a.inArray(e.selected,e.disabled)!=-1&&e.disabled.splice(a.inArray(e.selected,e.disabled),1),this.panels.addClass("ui-tabs-hide"),this.lis.removeClass("ui-tabs-selected ui-state-active"),e.selected>=0&&this.anchors.length&&(d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash)).removeClass("ui-tabs-hide"),this.lis.eq(e.selected).addClass("ui-tabs-selected ui-state-active"),d.element.queue("tabs",function(){d._trigger("show",null,d._ui(d.anchors[e.selected],d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash))[0]))}),this.load(e.selected)),a(window).bind("unload",function(){d.lis.add(d.anchors).unbind(".tabs"),d.lis=d.anchors=d.panels=null})):e.selected=this.lis.index(this.lis.filter(".ui-tabs-selected")),this.element[e.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible"),e.cookie&&this._cookie(e.selected,e.cookie);for(var g=0,h;h=this.lis[g];g++)a(h)[a.inArray(g,e.disabled)!=-1&&!a(h).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");e.cache===!1&&this.anchors.removeData("cache.tabs"),this.lis.add(this.anchors).unbind(".tabs");if(e.event!=="mouseover"){var i=function(a,b){b.is(":not(.ui-state-disabled)")&&b.addClass("ui-state-"+a)},j=function(a,b){b.removeClass("ui-state-"+a)};this.lis.bind("mouseover.tabs",function(){i("hover",a(this))}),this.lis.bind("mouseout.tabs",function(){j("hover",a(this))}),this.anchors.bind("focus.tabs",function(){i("focus",a(this).closest("li"))}),this.anchors.bind("blur.tabs",function(){j("focus",a(this).closest("li"))})}var k,l;e.fx&&(a.isArray(e.fx)?(k=e.fx[0],l=e.fx[1]):k=l=e.fx);var n=l?function(b,c){a(b).closest("li").addClass("ui-tabs-selected ui-state-active"),c.hide().removeClass("ui-tabs-hide").animate(l,l.duration||"normal",function(){m(c,l),d._trigger("show",null,d._ui(b,c[0]))})}:function(b,c){a(b).closest("li").addClass("ui-tabs-selected ui-state-active"),c.removeClass("ui-tabs-hide"),d._trigger("show",null,d._ui(b,c[0]))},o=k?function(a,b){b.animate(k,k.duration||"normal",function(){d.lis.removeClass("ui-tabs-selected ui-state-active"),b.addClass("ui-tabs-hide"),m(b,k),d.element.dequeue("tabs")})}:function(a,b,c){d.lis.removeClass("ui-tabs-selected ui-state-active"),b.addClass("ui-tabs-hide"),d.element.dequeue("tabs")};this.anchors.bind(e.event+".tabs",function(){var b=this,c=a(b).closest("li"),f=d.panels.filter(":not(.ui-tabs-hide)"),g=d.element.find(d._sanitizeSelector(b.hash));if(c.hasClass("ui-tabs-selected")&&!e.collapsible||c.hasClass("ui-state-disabled")||c.hasClass("ui-state-processing")||d.panels.filter(":animated").length||d._trigger("select",null,d._ui(this,g[0]))===!1)return this.blur(),!1;e.selected=d.anchors.index(this),d.abort();if(e.collapsible){if(c.hasClass("ui-tabs-selected"))return e.selected=-1,e.cookie&&d._cookie(e.selected,e.cookie),d.element.queue("tabs",function(){o(b,f)}).dequeue("tabs"),this.blur(),!1;if(!f.length)return e.cookie&&d._cookie(e.selected,e.cookie),d.element.queue("tabs",function(){n(b,g)}),d.load(d.anchors.index(this)),this.blur(),!1}e.cookie&&d._cookie(e.selected,e.cookie);if(g.length)f.length&&d.element.queue("tabs",function(){o(b,f)}),d.element.queue("tabs",function(){n(b,g)}),d.load(d.anchors.index(this));else throw"jQuery UI Tabs: Mismatching fragment identifier.";a.browser.msie&&this.blur()}),this.anchors.bind("click.tabs",function(){return!1})},_getIndex:function(a){return typeof a=="string"&&(a=this.anchors.index(this.anchors.filter("[href$='"+a+"']"))),a},destroy:function(){var b=this.options;return this.abort(),this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"),this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.anchors.each(function(){var b=a.data(this,"href.tabs");b&&(this.href=b);var c=a(this).unbind(".tabs");a.each(["href","load","cache"],function(a,b){c.removeData(b+".tabs")})}),this.lis.unbind(".tabs").add(this.panels).each(function(){a.data(this,"destroy.tabs")?a(this).remove():a(this).removeClass(["ui-state-default","ui-corner-top","ui-tabs-selected","ui-state-active","ui-state-hover","ui-state-focus","ui-state-disabled","ui-tabs-panel","ui-widget-content","ui-corner-bottom","ui-tabs-hide"].join(" "))}),b.cookie&&this._cookie(null,b.cookie),this},add:function(c,d,e){e===b&&(e=this.anchors.length);var f=this,g=this.options,h=a(g.tabTemplate.replace(/#\{href\}/g,c).replace(/#\{label\}/g,d)),i=c.indexOf("#")?this._tabId(a("a",h)[0]):c.replace("#","");h.addClass("ui-state-default ui-corner-top").data("destroy.tabs",!0);var j=f.element.find("#"+i);return j.length||(j=a(g.panelTemplate).attr("id",i).data("destroy.tabs",!0)),j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"),e>=this.lis.length?(h.appendTo(this.list),j.appendTo(this.list[0].parentNode)):(h.insertBefore(this.lis[e]),j.insertBefore(this.panels[e])),g.disabled=a.map(g.disabled,function(a,b){return a>=e?++a:a}),this._tabify(),this.anchors.length==1&&(g.selected=0,h.addClass("ui-tabs-selected ui-state-active"),j.removeClass("ui-tabs-hide"),this.element.queue("tabs",function(){f._trigger("show",null,f._ui(f.anchors[0],f.panels[0]))}),this.load(0)),this._trigger("add",null,this._ui(this.anchors[e],this.panels[e])),this},remove:function(b){b=this._getIndex(b);var c=this.options,d=this.lis.eq(b).remove(),e=this.panels.eq(b).remove();return d.hasClass("ui-tabs-selected")&&this.anchors.length>1&&this.select(b+(b+1<this.anchors.length?1:-1)),c.disabled=a.map(a.grep(c.disabled,function(a,c){return a!=b}),function(a,c){return a>=b?--a:a}),this._tabify(),this._trigger("remove",null,this._ui(d.find("a")[0],e[0])),this},enable:function(b){b=this._getIndex(b);var c=this.options;if(a.inArray(b,c.disabled)==-1)return;return this.lis.eq(b).removeClass("ui-state-disabled"),c.disabled=a.grep(c.disabled,function(a,c){return a!=b}),this._trigger("enable",null,this._ui(this.anchors[b],this.panels[b])),this},disable:function(a){a=this._getIndex(a);var b=this,c=this.options;return a!=c.selected&&(this.lis.eq(a).addClass("ui-state-disabled"),c.disabled.push(a),c.disabled.sort(),this._trigger("disable",null,this._ui(this.anchors[a],this.panels[a]))),this},select:function(a){a=this._getIndex(a);if(a==-1)if(this.options.collapsible&&this.options.selected!=-1)a=this.options.selected;else return this;return this.anchors.eq(a).trigger(this.options.event+".tabs"),this},load:function(b){b=this._getIndex(b);var c=this,d=this.options,e=this.anchors.eq(b)[0],f=a.data(e,"load.tabs");this.abort();if(!f||this.element.queue("tabs").length!==0&&a.data(e,"cache.tabs")){this.element.dequeue("tabs");return}this.lis.eq(b).addClass("ui-state-processing");if(d.spinner){var g=a("span",e);g.data("label.tabs",g.html()).html(d.spinner)}return this.xhr=a.ajax(a.extend({},d.ajaxOptions,{url:f,success:function(f,g){c.element.find(c._sanitizeSelector(e.hash)).html(f),c._cleanup(),d.cache&&a.data(e,"cache.tabs",!0),c._trigger("load",null,c._ui(c.anchors[b],c.panels[b]));try{d.ajaxOptions.success(f,g)}catch(h){}},error:function(a,f,g){c._cleanup(),c._trigger("load",null,c._ui(c.anchors[b],c.panels[b]));try{d.ajaxOptions.error(a,f,b,e)}catch(g){}}})),c.element.dequeue("tabs"),this},abort:function(){return this.element.queue([]),this.panels.stop(!1,!0),this.element.queue("tabs",this.element.queue("tabs").splice(-2,2)),this.xhr&&(this.xhr.abort(),delete this.xhr),this._cleanup(),this},url:function(a,b){return this.anchors.eq(a).removeData("cache.tabs").data("load.tabs",b),this},length:function(){return this.anchors.length}}),a.extend(a.ui.tabs,{version:"1.8.21"}),a.extend(a.ui.tabs.prototype,{rotation:null,rotate:function(a,b){var c=this,d=this.options,e=c._rotate||(c._rotate=function(b){clearTimeout(c.rotation),c.rotation=setTimeout(function(){var a=d.selected;c.select(++a<c.anchors.length?a:0)},a),b&&b.stopPropagation()}),f=c._unrotate||(c._unrotate=b?function(a){e()}:function(a){a.clientX&&c.rotate(null)});return a?(this.element.bind("tabsshow",e),this.anchors.bind(d.event+".tabs",f),e()):(clearTimeout(c.rotation),this.element.unbind("tabsshow",e),this.anchors.unbind(d.event+".tabs",f),delete this._rotate,delete this._unrotate),this}})})(jQuery);;
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
			},
		isBlackBirdActive:
			function() {
				return true;
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

 function bh_sa_init_i18n(){
	//i18n
	var CCL_LANG = m_criterionJSON.CRITERION.LOCALE_ID;// "en-US";
	var i18nOptions =
		{
			lng: CCL_LANG, //Translation language
			fallbackLng: "en", //Default language if resource is not found
			resGetPath: m_criterionJSON.CRITERION.STATIC_CONTENT + '/locales/__lng__/__ns__.json',
			useCookie: false,
			ns: 'translation.safety' //resource file name with ../locale/<lng>/<ns>.json
		};

	$.i18n.init( i18nOptions,
	function(t)
		{
		$('[data-i18n]').i18n();
		});
		var additionalResources = { 'STATIC_CONTENT': m_criterionJSON.CRITERION.STATIC_CONTENT };
		$.i18n.addResourceBundle(CCL_LANG, i18nOptions.ns, additionalResources);


		}
		bh_sa_init_i18n();
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	Date.prototype.toDate = function (strDate)
	{
		if (strDate == "")
			return;
		var dateSeparator = "/",
		timeSeparator = ":",
		datetimeSeparator = " ";
		if (strDate.indexOf("-") != -1) {
			dateSeparator = "-";
		}
		var list = strDate.split(datetimeSeparator);
		var date = list[0].split(dateSeparator);
		var time = list[1].split(timeSeparator);
		var year = date[2];
		var month = date[1];
		month = parseInt(month, 10) - 1;
		var day = date[0];
		var hour = time[0];
		var minute = time[1];
		var second = time.length >= 3 ? time[2] : "0";
		var milli = time.length >= 4 ? time[3] : "0";
		return new Date(year, month, day, hour, minute, second, milli);
	}

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

	var thread = function(){
		return {
			init : function (patientReq, check, onComplete){
				this.fnCheck = check;
				this.request = patientReq;
				this.fnComplete = onComplete;
			},
			checkStatus : function (){
				if (this.fnCheck(this.request) == 1) this.fnComplete();
				else{
					return;
				}
			}
		};
	};

		var waitUntil = {
			threadPool : {},
			getInstance : function(instanceID){
				var thd = this.threadPool[instanceID];
				if(thd === undefined){
					thd = new thread();
					this.threadPool[instanceID] = thd;
					}

				return thd;
			},
			dispose : function(instanceID){
				delete this.threadPool[instanceID];
			}
		};




/**
 * Criterion contains Application-level variables passed in from PrefMaint.exe.
 */
var Criterion = {
	project_name: "",
	position_cd : 0,
	personnel_id : 0,
	image_size : 3,
	dev_debug_ind :0,
	debug_mode_ind : 0,
	debug_level_ind: 0,
	unloadParams : function() {
		try {
			    this.project_name = m_criterionJSON.CRITERION.PROJECT_NAME;
				this.position_cd = m_criterionJSON.CRITERION.POSITION_CD;
				this.personnel_id = m_criterionJSON.CRITERION.PRSNL_ID;
				this.image_size = m_criterionJSON.CRITERION.IMAGE_SIZE;
				this.dev_debug_ind = m_criterionJSON.CRITERION.DEV_DEBUG_IND ;
				this.debug_mode_ind = m_criterionJSON.CRITERION.DEBUG_IND ;
				this.debug_level_ind= m_criterionJSON.CRITERION.DEBUG_LEVEL_IND;
			}
			catch (e)
			{
			errmsg(e.message, "unloadParams()");
		      }
	}
};

/**
 * Retrieves Patient Images via mmf image service.  Singleton is instantiated
 * immediately
 * and handles web service authorization automatically.
 * @author Aaron Nordyke - AN015953

 * File "translation.safety.json"
					Namespaces used:
						"PatientImageRetreivalhandlebar"

 */
var PatientImageRetriever = (function() {
	var json_img_handler = {};

	function initializeHandler() {
		if(_.isEmpty(json_img_handler)) {
			json_img_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"dev_debug_ind" : Criterion.dev_debug_ind,
				"disable_firebug" : true
			});
		}
	}

	function setPatientImageThumbnailValue(patientModel, imageSize) {
		var params = "MINE," + patientModel.get("person_id") + "," + imageSize + ",1";

		initializeHandler();

		json_img_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "dc_mp_get_person_thumbnail",
				parameters : params
			},
			response : {
				type : "JSON",
				target : receiveThumbnailReply,
				parameters : [patientModel]
			}
		});
	}

	function setJsonHandler(handler) {
		json_img_handler = handler;
	}


	function receiveThumbnailReply(json_response) {
		var PREPLY = json_response.response.PREPLY,
				patientModel= json_response.parameters[0];
		if(isSuccessful(PREPLY)) {

			patientModel.set({
				"image_data" : "data:image/jpeg;base64,"+PREPLY.IMAGEDATA
			});
		}
		if(PREPLY.IMAGEDATA !== undefined && PREPLY.IMAGEDATA === "")
		{
			var localurl = "";
			var imageSize = Criterion.image_size ? Criterion.image_size : 3;
			switch(imageSize){
				case 1:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_16");
					break;
				case 2:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_32");
					break;
				case 3:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_64");
					break;
				case 4:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_128");
					break;
				case 5:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_200");
					break;
			}
			patientModel.set({
				"image_data" : localurl
			});
		}
	}

	/**
	 * checks if json reply is successful, using status_block.inc
	 */
	function isSuccessful(json) {
		return json.STATUS_DATA.STATUS.toUpperCase() === "S" ? true : false;
	}


	return {
		/**
		 * Set Patient Image Thumbnail 64-bit value from CCL
		 */
		setPatientImageThumbnailValue : setPatientImageThumbnailValue,

		/**
		 * Manually set Json_Handler to be used for CCL calls
		 */
		setJsonHandler : setJsonHandler
	};

})();

/**
 * Handles calls to scripts for posting new clinical events and uncharting old
 * ones
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,ActivityModel,JSON2
 */
var PostToChartModel = Backbone.Model.extend({

	/**
	 * Indicator object for whether all activity types have been charted.
	 */
	activitiesCharted : {
		draftActivities : false,
		inErrorActivities : false
	},

	/**
	 * Initializes Model on instantiation.
	 *
	 * @params {Object} UtilJsonXml creates one if none is provided
	 */
	initialize : function() {
		_.bindAll(this);

		if(!this.get("json_handler")) {
			var json_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"dev_debug_ind" : Criterion.dev_debug_ind,
				"disable_firebug" : true
			});

			this.set({
				json_handler : json_handler
			});
		}
		this.json_handler = this.get("json_handler");
	},

	/**
	 * Charts all activities
	 *
	 * @param {Array} activities ActivityModel collection
	 */
	chartAllActivities : function(activities , postActBatchsize){
		//fill loader message box
		_g('json-loader-message').innerHTML = $.i18n.t("SafetyAttendanceCommon.CHARTING");

	// check for inErrorActivities and set the flag to true, as receiveReply() checks for the flag to refresh.
		var activitiesInError = this.getInErrorActivities(activities);
		var inErrorRequest = this.getMPREQfromInErrorActivityArray(activitiesInError , postActBatchsize);
		if(inErrorRequest === undefined){
			this.activitiesCharted.inErrorActivities = true;
		}
		var draftActivities = this.getDraftActivities(activities);
		var draftRequest = this.getMPREQfromDraftActivityArray(draftActivities,postActBatchsize );
		var that = this;
		var threaddraftAct = waitUntil.getInstance("draftactivities");
		threaddraftAct.init(draftRequest, this.check, this.onComplete);
		if(!(draftRequest === undefined)){
				_.each(draftRequest,function(mpreq){
					mpreq.status = 0;
					that.postDraftActivities(mpreq,
					{BATCHNUMBER : mpreq.BATCHNUMBER,
					LISTCNT : mpreq.LISTCNT});
			 });
		}else{
			this.activitiesCharted.draftActivities = true;
		}
		if(!(inErrorRequest === undefined)){
		var threadInError = waitUntil.getInstance("inerroractivities");
		threadInError.init(inErrorRequest, this.check, this.onComplete);

		_.each(inErrorRequest,function(mpreq){
					mpreq.status = 0;
					that.postInErrorActivities(mpreq,
					{BATCHNUMBER : mpreq.BATCHNUMBER,
					LISTCNT : mpreq.LISTCNT});
			 });
		}
    },



	/**
	 * Returns array of draft activities from Array provided
	 *
	 * @param {Array} activities
	 * @returns {Array} Draft ActivityModel collection
	 */
	getDraftActivities : function(activities) {
		return _.select(activities, function(activity) {
			return activity.get("STATUS").toUpperCase() === "DRAFT";
		});

	},

	/**
	 * Returns array of In Error activities from Array provided
	 *
	 * @param {Array} activities
	 * @returns {Array} In Error ActivityModel collection
	 */
	getInErrorActivities : function(activities) {
		var activitiesErr = _.select(activities, function(activity) {

			return activity.get("STATUS").toUpperCase() === "INERROR";
		});
        return activitiesErr;
	},

	/**
	 * Post Draft Activities, via dc_mp_post_bhv_hlth script
	 *
	 * @param {String} mpreq	Stringified JSON of Array of DRAFT activities
	 */
	postDraftActivities : function(mpreq,  batchNumber) {
		var path = "DC_MP_POST_BHV_HLTH", params = "^MINE^," + "^{'MPREQ':" + JSON.stringify(mpreq) + "}^";
		var startTimer = new Date((new Date()).toString());
		var that = this;
		var signTimer = MP_Util.CreateTimer("USR:MPG.BH_SA_SIGN_ACTIVITIES",Criterion.project_name);
		if(signTimer){
				  signTimer.Start();
			  }
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : function(json_response) {
													that.receiveDraftActivitiesReply(json_response, batchNumber, startTimer);
													mpreq.status = 1;
													var threadID = waitUntil.getInstance("draftactivities");
													threadID.checkStatus();
												},
				parameters : ["t", 1]
			}
		});
		if(signTimer){
				  signTimer.Stop();
			  }
	},

	/**
	 * Post In Error Activities, via dc_mp_ie_bhv_hlth script
	 *
	 * @param {String} mpreq	Stringified JSON of Array of INERROR activities
	 */
	postInErrorActivities : function(mpreq, batchNumber) {
		var path = "DC_MP_IE_BHV_HLTH", params = "^MINE^," + "^{'MPREQ':" +AjaxHandler.stringify_json(mpreq) + "}^";
		var startTimer = new Date((new Date()).toString());
		var targetDOM = _g('json-loader-message');
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : function(json_response) {
													that.receiveInErrorActivitiesReply(json_response, batchNumber, startTimer);
													mpreq.status = 1;
													var threadID = waitUntil.getInstance("inerroractivities");
													threadID.checkStatus();
												},
				parameters : ["t", 1]
			}
		});
	},

	/**
	 * Creates Stringified JSON from Array of Draft Activities
	 *
	 * @param {Array} activities Draft ActivityModel collection
	 * @returns {String} Stringified JSON
	 */
	getMPREQfromDraftActivityArray : function(activities , postActBatchsize) {
		try{
		var requestChunk = 0, MPREQ ;
		var batchCount = -1;
		if(activities.length > 0){
			MPREQ = [{LIST : []}];
		}
		for(var indexActivities = 0, requestCnt = 1, activitiesTotalCount = activities.length; indexActivities < activitiesTotalCount; indexActivities++){
			_.each(activities[indexActivities].get("LIST"), function(event){

				if(requestCnt > requestChunk)
				{
					requestChunk = requestChunk + postActBatchsize;
					batchCount = batchCount + 1;
					MPREQ[batchCount] = {LIST : [] ,  LISTCNT : 0, BATCHNUMBER : batchCount};
				}
				MPREQ[batchCount].LIST[MPREQ[batchCount].LIST.length] = {
						INPUTPERSONID : activities[indexActivities].patient.get("person_id").toFixed(1),
						INPUTPROVIDERID: Criterion.personnel_id.toFixed(1),
						INPUTENCOUNTERID : activities[indexActivities].patient.get("encntr_id").toFixed(1),
						INPUTEVENTCD: event.EVENT_CD.toFixed(1),
						ENDDTTM: activities[indexActivities].get("EVENT_DT").toString(),
						INPUTNOMENCLATUREID: event.NOMID,
						INPUTFREETEXT: event.FREETEXT,
						INPUTPPR: event.INPUTPRT.toFixed(1)
					};
				MPREQ[batchCount].LISTCNT++;
				requestCnt++;
		});
		}
	 return MPREQ;
		}
		catch (e)
          {
              alert(e.message + " in getMPREQfromDraftActivityArray()");
          }
	},

	/**
	 * Creates Stringified JSON from Array of In Error Activities
	 *
	 * @param {Array} activities InError ActivityModel collection
	 * @returns {String} Stringified JSON
	 */

	getMPREQfromInErrorActivityArray : function(activities , postActBatchsize)
	{
		try {
			var requestChunk = 0, MPREQ;
			var batchCount = -1;
			if(activities.length > 0){
				MPREQ = [{LIST : []}];
			}
			for(var indexInErrActivities = 0, requestCntInErr = 1, activitiesTotalCount = activities.length; indexInErrActivities < activitiesTotalCount; indexInErrActivities++){
				_.each(activities[indexInErrActivities].get("LIST"), function(event){

					if(requestCntInErr > requestChunk)
					{
						requestChunk = requestChunk + postActBatchsize;
						batchCount = batchCount + 1;
						MPREQ[batchCount] = {LIST : [] ,  LISTCNT : 0, BATCHNUMBER : batchCount};
					}

					MPREQ[batchCount].LIST[MPREQ[batchCount].LIST.length] ={
						INPUTPERSONID : activities[indexInErrActivities].patient.get("person_id").toFixed(1),
						INPUTPROVIDERID: Criterion.personnel_id.toFixed(1),
						INPUTENCOUNTERID : activities[indexInErrActivities].patient.get("encntr_id").toFixed(1),
						INPUTEVENTCD: event.EVENT_CD.toFixed(1),
						INPUTEVENTID : event.EVENTID.toFixed(1),
						INPUTPPR: event.INPUTPRT.toFixed(1)
					};
					MPREQ[batchCount].LISTCNT++;

					requestCntInErr++;
				});
			}
			return MPREQ;
		}
		catch (e)
          {
              alert(e.message + " in getMPREQfromInErrorActivityArray()");
          }
	},

	/**
	 * Callback function for all scripts called.  Once notification has been
	 * received, function fires
	 * a "posted" event, so that MPage knows to retrieve new patient data.
	 *
	 * @param {object} json_response  json_respons.response.OBJECT is the reply from
	 * the script
	 */
	receiveInErrorActivitiesReply : function(json_response, batchNumber, startTimer) {
		var endTimer = new Date((new Date()).toString());
		mConsole.log("PostToChartModel.receiveInErrorActivitiesReply- batchNumber:" +  batchNumber.BATCHNUMBER+ " Having: " + batchNumber.LISTCNT+  " start on:" + startTimer.toString() + " "+ "End Time: " + endTimer.toString() +"Time taken in seconds"+((startTimer.getTime() - endTimer.getTime())/1000), mConsole.debug_level_info);
		if(json_response.response.IEREPLY) {
			this.activitiesCharted.inErrorActivities = true;
			var status_data = json_response.response.IEREPLY.STATUS_DATA;
		}
	},

	receiveDraftActivitiesReply : function(json_response, batchNumber, startTimer) {
		var endTimer = new Date((new Date()).toString());
		mConsole.log("PostToChartModel.receiveDraftActivitiesReply - batchNumber:" +  batchNumber.BATCHNUMBER+ " Having: " + batchNumber.LISTCNT+  " start on:" + startTimer.toString() + " "+ "End Time: " + endTimer.toString() +"Time taken in seconds"+((startTimer.getTime() - endTimer.getTime())/1000), mConsole.debug_level_info);
		if(json_response.response.POSTREPLY) {

			this.activitiesCharted.draftActivities = true;
			var status_data = json_response.response.POSTREPLY.STATUS_DATA;
		}
	},

	check : function (request){
		try{
		var status = 1;
		for(var index = 0, count = request.length; index < count; index++){
			status = status & request[index].status;
		}
		return status;
		}
		catch (e)
          {
              errmsg(e.message, "check()");
          }
	},

	onComplete : function(){
		if(this.areAllActivitiesCharted()) {
			this.resetActivitiesChartedIndicators();
			waitUntil.dispose("draftactivities");
			waitUntil.dispose("inerroractivites");
			this.trigger("posted");
		}
	},

	/**
	 * Determines if all Activities have been charted
	 *
	 * @returns {Boolean} true if all Activities charted, false otherwise
	 */
	areAllActivitiesCharted : function() {
		return _.all(this.activitiesCharted, function(value, key) {
			return value;
		});

	},

	/**
	 * Resets the ActivitiesCharted indicator object
	 */
	resetActivitiesChartedIndicators : function() {
		this.activitiesCharted.draftActivities = false;
		this.activitiesCharted.inErrorActivities = false;
	}

});

/**
 * BhInfoModel handles dc_mp_behavioral_hlth script and all data returned from it
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml,JSON2

 * File "translation.safety.json"
					Namespaces used:
						"SafetyAttendanceCommon"

 */
var BhInfoModel = Backbone.Model.extend({

	/**
	 * Default values
	 */
	defaults : {
		"BHINFO" : {},
		"ACTIVITIES" : {},
		"APP_PREF" : {}
	},

	patientReq:{},

	selectedRange:0,
	loadmoreBatchCount:0,

	/**
	 * Default Constructor
	 * @constructor
	 */
	initialize : function() {
		_.bindAll(this);
	},

	/**
	 * Retrieve data from CCL via bh_mp_sa_get_patients script
	 * @param {Object} patientList Patient List info used to query patients
	     This script loads the requested patients*/
	retrieve : function(patientList,Hours) {

	if(Hours === undefined){ Hours = 4;
	}
		var MPREQ = {
			PRSNLID : patientList.PRSNLID,
			PTLISTID : patientList.LISTID,
			PTLISTTYPE : patientList.LISTTYPECD,
			PTLISTLOCCD : patientList.DEFAULTLOCCD,
			fuQual : getNurseUnitList(patientList.NULIST),
			TIMERANGE :  Hours
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^" + ",^" + Criterion.project_name + "^";
		var targetDOM = _g('json-loader-message');
		var loadPatientList = MP_Util.CreateTimer("USR:MPG.BH_SA_LOAD_PATIENT_LIST", Criterion.project_name);
		if(loadPatientList){
			loadPatientList.Start();
		}
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_get_patients",
				parameters : params
			},
			loadingDialog : {
				content :  "",//$.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
				targetDOM : targetDOM
			},
			response : {
				type : "JSON",
				target : this.receiveCCLresponse,
				parameters : [this]
			}
		});
	if(loadPatientList){
		loadPatientList.Stop();
	}
	},

	/**
	 * Receives data returned from bh_mp_sa_get_patients script
	 * @param {Object} json_response json_response.response.BHREPLY is json returned
	  //If BHINFO is empty set the object else set each property that got retrieved  */

	receiveCCLresponse : function(json_response) {
		try{
		if(_.isEmpty(this.get("BHINFO"))){
			this.set({
						"BHINFO" : json_response.response.PTREPLY
					},

					{
						silent : true
					});
		}

		var PATIENTS = json_response.response.PTREPLY.PATIENTS;

		if(PATIENTS.length > 0){
		    mConsole.log("patientcollection.getBhPatientsActivities"+JSON.stringify(PATIENTS)+""+this.selectedRange,mConsole.debug_level_info);
			this.getBhPatientsActivities(PATIENTS, this.selectedRange)//fills the activities for the patients that got loaded
		}
		else
		{
			 this.trigger("change");

		}
		}
		catch (e)
          {
              alert(e.message + " in receiveCCLresponse()");
          }



	},

	/**
	 * Gets Array of activities, based on location.  If location is not listed, default list
	 * is returned, if available
	 * @param {Number} location_cd location's Millennium LOCATION_CD
	 * @returns {Array} List of locations
	 */
	getActivitiesForLocation : function(location_cd) {
		try {
			var locations = (this.get("APP_PREF")).LOCNOMEN,
					locationResults = [],
					defaultLocationResults = [];

			//always return array
			if(_.isEmpty(this.get("BHINFO"))) {
				return [];
			}

			for(var i=0,l=locations.length;i<l;i++){
				if(location_cd == locations[i].LOCCD) {
					locationResults = locations[i].RESULTS;
				}
				else if(locations[i].NAME === "DEFAULT") {
					defaultLocationResults = locations[i].RESULTS;
				}
			}

			return locationResults.length ? locationResults : defaultLocationResults;
		}
		catch (e)
		{
		alert(e.message + "in getActivitiesForLocation()");
		}
	},

	/*  Gets the precautions from the json*/
	getprecautions : function()
	{
		try
			{

				var selectvalue = document.getElementById('pclist');
				if(selectvalue !== undefined && selectvalue !== null){
					var pre = this.get("APP_PREF").PRECAUTIONS;
					$('#pclist').empty();
					var optionvalue;
					optionvalue = document.createElement('option');
					optionvalue.text=$.i18n.t("DashboardHeaderHandlebar.NONE");
					selectvalue.add(optionvalue);
					for(var i=0; i < pre.length;i++)
					{
						optionvalue = document.createElement('option');
						optionvalue.text = pre[i].LABEL;
						selectvalue.add(optionvalue);
					}
				}
			}
			catch (e)
			{
			alert(e.message + "in getprecautions()");
			}
	},



	/*Calls the application prefrences script required for S & A
	BatchSize for posting patients activities, retrieving patients activities, default nomens and so on..*/

	retrieveAppPrefForSA : function(){
			 this.json_handler
						.ajax_request({
							request : {
								async : false,
								type : "XMLCCLREQUEST",
								target : "bh_mp_sa_app_pref",
								parameters : "^MINE^" + ",^" + Criterion.project_name + "^"
							},
							response : {
								type : "JSON",
								target : this.receiveAppPrefForSA,
								parameters : [ "t", 1, this ]
							}
						});
			 },


		receiveAppPrefForSA : function(json_response){
			try{
			//If APP_PREF is empty initialize the batchsize to zero else set each property that got retrieved
			var appPref = undefined;
			var bhreply = undefined;
			if(_.isEmpty(this.get("APP_PREF"))){

				this.set({
					"APP_PREF" : {RETRIEVE_ACT_BATCHSIZE: 0, POST_ACT_BATCHSIZE:0,
									RETRIEVE_DEFAULT_TIME : 0}
				},
				{
					silent : true
				});
			}
			bhreply = json_response.response.BHREPLY;
			appPref = this.get("APP_PREF");
			appPref.LOCNOMEN = bhreply.LOCNOMEN;
			appPref.LOCTIME = bhreply.LOCTIME;
			appPref.SHOWIMAGE_IND = bhreply.SHOWIMAGE_IND;
			if(bhreply.RETRIEVE_ACT_BATCHSIZE !== "")
			{appPref.RETRIEVE_ACT_BATCHSIZE = parseInt(bhreply.RETRIEVE_ACT_BATCHSIZE);}
		    else
			{appPref.RETRIEVE_ACT_BATCHSIZE = 25;}
		    appPref.POST_ACT_BATCHSIZE = parseInt(bhreply.POST_ACT_BATCHSIZE);
			appPref.RETRIEVE_DEFAULT_TIME = parseInt(bhreply.RETRIEVE_DEFAULT_TIME);
			appPref.PCTABNM = bhreply.PCTABNM;
			appPref.SELECT_ALL = bhreply.SELECT_ALL;
			appPref.MULTI_SELECTION = bhreply.MULTI_SELECTION;
            appPref.PRECAUTIONS = bhreply.PRECAUTIONS;
			appPref.OFFUNITEVENT = bhreply.OFFUNITEVENT;
			appPref.DEFAULTOBSERVLVL = bhreply.DEFAULTOBSERVLVL;
			}
			catch(e)
			{
				log.info(e.message + " " + "in receiveAppPrefForSA()");
			}
		},

	//For constructing mpreq needed to pass to activities
	getPatientRequest :  function (patients , timeRange){
		try{


		var retriveActBatchSize = (this.get("APP_PREF")).RETRIEVE_ACT_BATCHSIZE;

		var chunk = 0;
		var batchCount = -1;
		var MPREQ = [{
				"BATCHNUMBER" : batchCount,
				"PT_CNT" : 0,
				"PAGE_CNT" : 1,
				"TIMERANGE" : timeRange,
				"PATIENTS": []
			}];
			var j=1;
			//If retriveActBatchSize is null or undefined then maxnumber is passed else the batchsize which is parameterised in setup page is passed
			retriveActBatchSize = (retriveActBatchSize === undefined || retriveActBatchSize === null) ? Number.MAX_VALUE : retriveActBatchSize;
			_.each(patients, function(patient){
				if(j > chunk)
				{
					chunk = chunk + retriveActBatchSize;
					batchCount = batchCount + 1;

					MPREQ[batchCount] = {
						"BATCHNUMBER" : batchCount,
						"PT_CNT" : 0,
						"PAGE_CNT" : 1,
						"TIMERANGE" : timeRange,
						"PATIENTS": []
					};
				}

				MPREQ[batchCount].PATIENTS.push({
					"PAGENUM" :  0,
					"PT_ID" : patient.PT_ID,
					"ENCNTR_ID" : patient.ENCNTR_ID,
					"ENCNTR_TYPECD" : patient.ENCNTR_TYPECD
				});
				MPREQ[batchCount].PT_CNT++;
				j = j+1;
			});
		return MPREQ;
		}catch(err){log.info(err.message + "in getPatientRequest");}
	},

	getBhPatientsActivities : function(patient, timeRange){
	 //Chunk this requests
	 this.patientReq = this.getPatientRequest(patient , this.selectedRange); // patient contains entire bhreply,hence passing pat.PATIENTS in order to access patients[]

    _g('json-activity-loader-message').innerHTML = $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>";

	   var mpreq  = this.patientReq[0];
	      if(mpreq !==undefined){
	        mpreq.status = 0;
	        this.loadmoreBatchCount = 0;
	        this.getBhInfo(mpreq);
		  }

	},
	getBhPatientsActivitiesbyBatch : function(batchCount, timeRange){
	  _g('json-activity-loader-message').innerHTML = $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>";

	  var that = this;
	   if(batchCount < this.patientReq.length )
	   {

		   this.loadmoreBatchCount = batchCount;
		   var mpreq  = this.patientReq[batchCount];
		      if(mpreq !==undefined){
	          mpreq.status = 0;
		     that.getBhInfo(mpreq);
			  }
	   }
	},

	onComplete : function(){
		_g('json-activity-loader-message').innerHTML = "";
		waitUntil.dispose("loadactivities");
	},

	check:function(request){
		var status = 1;
		// for(var index = 0, count = request.length; index < count; index++){
			// status = status & request[index].status;
		// }
		return status;
	},
	getBhInfo : function(MPREQ){

	mConsole.log("BHINFO.getBhInfo"+MPREQ,mConsole.debug_level_info);
	//If value is '0' then increment the addFlag else set the addFlag to '1'and the value retrieved is passed as parameter to the response

		var mpreqString = JSON.stringify(MPREQ);

		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^" + ",^" + Criterion.project_name + "^";
		var targetDOM = _g('json-loader-message');
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_get_patient_details",
				parameters : params
			},
			loadingDialog : {
				content : "",// $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
				targetDOM : targetDOM
			},
			response : {
				type : "JSON",
				target : function(json_response) {
								that.receiveBhInfo(json_response)
							},
				parameters : [this]
			}
		});
	},

	receiveBhInfo : function(json_response){
	mConsole.log("newpatientmodel.receiveBhInfo"+json_response,mConsole.debug_level_info);
		if(json_response.response.BHREPLY.STATUS_DATA.STATUS==="S"){
			var bhinfo = json_response.response.BHREPLY;
			var that = this;
			this.get("BHINFO").LIST = json_response.response.BHREPLY.LIST;
			//this.get("BHINFO").OFFUNITEVENT = json_response.response.BHREPLY.OFFUNITEVENT;
            this.trigger("change");


		   var mpreq  = this.patientReq[this.loadmoreBatchCount];
		   if(mpreq !==undefined){
	       mpreq.status = 0;
		   this.getBhPatientsBatchActivities(mpreq);
		   }



	}
	},


	getBhPatientsBatchActivities :function(patientReq){

	   var MPREQ = {
			"BATCHNUMBER" : patientReq.BATCHNUMBER,
			"pt_cnt" : patientReq.PT_CNT,
			"page_cnt" : patientReq.PAGE_CNT,
			"TIMERANGE" : patientReq.TIMERANGE,
			"patients" : patientReq.PATIENTS
		}
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^" + ",^" + Criterion.project_name + "^";
		var startTimer = new Date((new Date()).toString());
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_activities",
				parameters : params
			},
			response : {
				type : "JSON",
				target : function(json_response){
					that.receiveActivitiesResponse(json_response, patientReq.BATCHNUMBER, patientReq.PT_CNT, startTimer);

							},
				parameters : [this]
			}
		});
		return true;
	},


		receiveActivitiesResponse : function(json_response , BATCHNUMBER , patientCount, startTimer){
			try{
		var endTimer = new Date((new Date()).toString());
		mConsole.log("BhInfoModel.receiveActivitiesResponse - batchNumber:" +  BATCHNUMBER+ " Having: " + patientCount + " start on:" + startTimer.toString() + " "+ "End Time: " + endTimer.toString() +"Time taken in seconds"+((startTimer.getTime() - endTimer.getTime())/1000), mConsole.debug_level_info);
		var response =  undefined;
		if(_.isEmpty(this.get("ACTIVITIES"))){
			this.set({
					"ACTIVITIES" : json_response.response.BHREPLY

				}, {
					silent : true
				});
				response = json_response.response.BHREPLY;
		}
		else{
			var activities = this.get("ACTIVITIES");
			 response = json_response.response.BHREPLY;

			//increment the patients that were got
			activities.LISTCNT += response.LISTCNT;
			//Add the activities to the existing array
			_.each(response.LIST, function(activity){
				activities.LIST.push(activity);
			});

			this.set({
					"ACTIVITIES" : activities

				}, {
					silent : true
				});

		}

		this.trigger("changeBatchActivities", this.get("ACTIVITIES"));

		_g('json-loader-message').innerHTML = "";
	    _g('json-activity-loader-message').innerHTML = "";


		mConsole.log("receiveActivitiesResponse",mConsole.debug_level_info);
			}
			catch(e){alert(e.message + "receiveActivitiesResponse");}
	}
});


/*
 * The PatientModel represents a Patient, including clinical info and event activities
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,ActivityCollection

 * File "translation.safety.json"
					Namespaces used:
						"SafetyAttendanceCommon"
 */
var PatientModel = Backbone.Model.extend({

	/**
	 * Default Values
	 */
	defaults:{
		"location_activities":[],
		"person_id":0.0,
		"encntr_id":0.0,
		"encntr_type_cd":0.0,
		"name":"",
		"fin":0.0,
		"mrn":0.0,
		"age":0,
		"birth_dt":0,
		"birth_dt_js":0,
		"gender":"",
		"org_id":0.0,
		"facility":"",
		"facility_cd":0.0,
		"nurse_unit":"",
		"nurse_unit_cd":0.0,
		"room":"",
		"bed":"",
		"length_of_stay":"",
		"admit_dt":"",
		"admit_dt_js":"",
		"observation_level":"",
		"general_comment":"",
		"fall_risk":"",
		"suicide_risk" : "",
		"suicide_risk_seq": 0.0,
		"suicide_risk_disp": "",
		"image_data":"",
		"showimage_ind":0,
		"offunitevent" :{
			"cecd" : 0.0,
			"nomList":[]
		},
		"precautions" :{
		},
		"gender_dislpay": "",
		"age_display" :"",
		"seq":0
	},


	/**
	 * PatientModel Constructor
	 *
	 * @constructor
	 */
	initialize:function(){
		_.bindAll(this);

		this.activities = new ActivityCollection;
		this.bind("change:bhinfo",this.getPatientImage);
		this.userPrefModel = new UserPrefModel;
	},



	/**
	 * Sets patient information from Patient's portion of data retrieved
	 * from BhInfoModel
	 *
	 * @param {Object} bhinfo Patient Object from BhInfoModel
	 */
	setBhInfo:function(ptinfo){
		try{
		this.set({
			person_id:ptinfo.PT_ID,
			encntr_id:ptinfo.ENCNTR_ID,
			encntr_type_cd:ptinfo.ENCNTR_TYPECD,
			name:ptinfo.NAME,
			fin:ptinfo.FIN,
			mrn:ptinfo.MRN,
			age:ptinfo.AGE,
			birth_dt:ptinfo.BIRTH_DT,
			birth_dt_js:ptinfo.BIRTHDTJS,
			gender:ptinfo.GENDER,
			org_id:ptinfo.ORG_ID,
			facility:ptinfo.FACILITY,
			facility_cd:ptinfo.FACILITYCD,
			nurse_unit:ptinfo.NURSE_UNIT,
			nurse_unit_cd:ptinfo.NURSE_UNITCD,
			room:ptinfo.ROOM,
			bed:ptinfo.BED,
			length_of_stay:ptinfo.LOS,
			admit_dt:ptinfo.ADMIT_DT,
			admit_dt_js:ptinfo.ADMITDTJS,
			gender_display:this.getGenderToDisplay(ptinfo.GENDER),
			age_display:this.getAgeToDisplay(ptinfo.BIRTHDTJS)
		});
		this.trigger("change:bhinfo");
		}catch(err){err.message + "in set bhinfo"}

	},
	setOtherInfo:function(bhinfo1){

	try{
	   for(var i = 0 ; i < bhinfo1.length ; i++){

		  if(this.get('person_id') == bhinfo1[i].PID){
		  var bhinfo = bhinfo1[i];

		   this.set({
							"observation_level" : bhinfo.OBSERVLVL
						}, {
							silent : true
						});
		   this.set({
							"general_comment" : bhinfo.OBSERVLVLEVENT
						}, {
							silent : true
						});

		  this.set({
					"precautions" : bhinfo1[i].PRECAUTIONS

				}, {
					silent : true
				});
		 this.userPrefModel.set({
			offunitstatus: {
				isoffunit : (bhinfo.OFFUNITSTATUS.OFFUNITIND===1)?true:false,
				offunitstartdt : (new Date).toDate(bhinfo.OFFUNITSTATUS.OFFUNITSTARTDT),
				cecd : bhinfo.OFFUNITSTATUS.CECD,
				nomid : bhinfo.OFFUNITSTATUS.NOMID,
				nomdisp : fixedDecodeURIComponent(bhinfo.OFFUNITSTATUS.NOMDISP)
			}
		}, {
			silent: true
		});
		  }
	  }
	  }catch(err){err.message + "in set otherinfo"}

	},


	/**
	 * Creates ActivityModels from array of patient clinical events
	 *
	 * @param {Array} EVENTS Clinical events
	 */
	createActivityModelsFromEvents : function(EVENTS){
		var that = this;
		var timestamp = [];
		_.each(EVENTS, function(event){
			timestamp.push(event.EVENT_DT);
		});
		//get unique event time
		timestamp = _.uniq(timestamp);
		//create model for each event time
		_.each(timestamp, function(ts){
			var ce = _.filter(EVENTS, function(event){
				return event.EVENT_DT === ts;
			})
			var activityData ={
				"CNT" : 0,
				"EVENT_DT" : ce[0].EVENT_DT,
				"EVENTDTDISP" : ce[0].EVENTDTDISP,
				"LIST": []
			};
			//create list in the model
			_.each(ce, function(v){
				activityData.CNT++;
				activityData.LIST.push({
					"TYPE" : v.TYPE,
					"EVENTID" : v.EVENTID,
					"NAME" : v.NAME,
					"CLINEVENTID" : v.CLINEVENTID,
					"EVENT_CD" : v.EVENT_CD,
					"EVENT_DISP" : v.EVENT_DISP,
					"EVENT_RESULT" : v.EVENT_RESULT,
					"FREETEXT": v.FREETEXT,
					"NOMID": v.NOMEN,
					"INPUTPRT": 0.0,
                    "OFFUNITIND":v.OFFINDICATOR
				});
			});
			if(!that.isEventInActivityCollection(activityData)){
				var activityModel = new ActivityModel(activityData);
				activityModel.patient = that;

				that.activities.add(activityModel);
			}
		});
	},

	/**
	 * Determines if ActivityModel already exists for a specific event
	 *
	 * @param {Object} EVENT Clinical event
	 * @returns {Boolean} true if ActivityModel already exists, false otherwise
	 */
	isEventInActivityCollection : function(EVENT){
		var models = this.activities.models;
		for(var i = 0,l = models.length;i < l; i++){
			if(models[i].get("EVENT_DT") === EVENT.EVENT_DT){
				return true;
			}
		}
		return false;
	},

	/**
		* Function to translate the Gender of the patient and returns that character
		* @param {object} gender
		* @returns {String} Returns the First character of a patient as string
	*/
	getGenderToDisplay: function(gender){

	     if(gender !== undefined)
			return gender.length > 0 ? $.i18n.t("Common." + gender, {defaultValue : gender.toUpperCase().substring(0,1)}) : "";


	},


	/**
		* Function to calculate Age and translate the Years, Months and Days.
		* @param {object} DOB
		* @returns {Age} Returns the age of a patient with years,months & days with translation
	*/
		getAgeToDisplay: function(dob){
			if(dob === undefined)
				return ""

			var age_disp =
			{
				"Count" : 0,
				"Unit" : $.i18n.t("SafetyAttendanceCommon.DAYS")
			}
			var currentDate=new Date();
			var birthDtJs = new Date(dob);
			var ageInYears=currentDate.getFullYear() - birthDtJs.getFullYear();
			var ageInMonths=currentDate.getMonth()-birthDtJs.getMonth();
			var ageInDays=currentDate.getDate()- birthDtJs.getDate();

			if (ageInDays < 0)
			{
				var temp = this.daysPrevInMonth(currentDate.getMonth(),currentDate.getFullYear());
				ageInDays = ageInDays + temp;
				ageInMonths--;
				if (ageInMonths < 0)
				{
					ageInMonths += 12;
					ageInYears--;
				}
			}
			if (ageInMonths < 0)
			{
				ageInMonths += 12;
				ageInYears--;
			}

			if(dob.length == 0) return age_disp;
			if(ageInYears >  0)
			{
				age_disp.Count= ageInYears;
				age_disp.Unit =$.i18n.t("SafetyAttendanceCommon.YEARS");
			}
			else if((ageInMonths) > 0)
			{
				age_disp.Count= ageInMonths ;
				age_disp.Unit = $.i18n.t("SafetyAttendanceCommon.MONTHS");
			}
			else
			{
				age_disp.Count = ageInDays;
				age_disp.Unit = $.i18n.t("SafetyAttendanceCommon.DAYS");
			}
			return age_disp;
		},

		daysPrevInMonth : function (iMonth, iYear)
		{
			//subtracting one day from current month 1 day to know number of days in previous month
			return (new Date(new Date(iYear, iMonth, 1, 0, 0, 0, 0)-86400000)).getDate();
		},
	/**
	 * Get Patient Image, using size specified in prefmaint,exe, or medium if no size is specified
	 */
	getPatientImage : function(){
		//set default of medium if no size is supplied in prefmaint.exe
		var imageSize = Criterion.image_size ? Criterion.image_size : 3;
		if(this.get("showimage_ind") == 1){
			PatientImageRetriever.setPatientImageThumbnailValue(this,imageSize);
		}
	},

	/**
	 * Destroys model, any associated view, and any ActivityModels it contains
	 */
	destroyPatient : function(){
		for(var i = this.activities.length - 1; i >= 0;i--){
			this.activities.models[i].destroyActivity();
		}
		//remove any circular reference
		if(this.view){
			this.view = null;
		}
		this.destroy();
		//unbind all events for model
		this.unbind();
	}
});

/**
 * Patient Lists Model handles call to dc_mp_get_base_list script and all data
 * returned from it
 *
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,UtilJsonXml

 * File "translation.safety.json"
					Namespaces used:"PatientListsModel",
									"SafetyAttendanceCommon".
 */
var PatientListsModel = Backbone.Model
		.extend({

			defaults:{
				"selectedList" : {},
				"addedPatients" : [],
				"fallLabel" : "",
				"suicideLabel" : "",
				"tabNavInd" : 0
			},

			PTLISTS : {},

			/**
			 * Contructor
			 *
			 * @constructor
			 * @params {Object} UtilJsonXml creates one if none is supplied
			 */
			initialize : function() {
				_.bindAll(this);

				if (!this.get("json_handler")) {
					var json_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"dev_debug_ind" : Criterion.dev_debug_ind,
						"disable_firebug" : true
					});

					this.set({
						json_handler : json_handler
					});
				}
				this.json_handler = this.get("json_handler");
			},

			/**
			 * Calls script and retrieves data
			 */
			retrieve : function() {
				this.trigger("loading");
				var targetDOM = _g('patient-lists-loader-message');
				this.json_handler
						.ajax_request({
							request : {
								type : "XMLCCLREQUEST",
								target : "dc_mp_bhv_hlth_get_ptlist",
								parameters : "^MINE^" + ",^" + Criterion.project_name + "^"
							},
							loadingDialog : {
								content : $.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
								targetDOM : _g('patient-lists-loader-message')
							},
							response : {
								type : "JSON",
								target : this.receiveCCLresponse,
								parameters : [ "t", 1, this ]
							}
						});
			},

			/**
			 * Callback for receiving CCL from script
			 */
			receiveCCLresponse : function(json_response) {
				this.PTLISTS = json_response.response.LISTREPLY, that = this;
				var messagePL = $.i18n.t("PatientListsModel.SELECT_PATIENT_LIST_TO_QUALIFY");
				var messageFU = $.i18n.t("PatientListsModel.SELECT_FACILITY_AND_NURSE_UNITS_TO_QUALIFY");
				var messageBoth = $.i18n.t("PatientListsModel.SELECT_PATIENT_LIST_OR_FACILITY");
				if (this.PTLISTS.STATUS_DATA.STATUS === "S") {
					//patient list
					if (this.PTLISTS.BWPTPOP === "1") {
						this.sortList();
						this.trigger("change:ptlists");

						if (WindowStorage.get("StoredIndex") != 'undefined') {
							this.setSelectedList(WindowStorage
									.get("StoredIndex"));
							this.clearWindowStorage();
							this.trigger("select:ptlist");
						}
						else if(WindowStorage.get("StoredFnu") != 'undefined'){
							var fac = jQuery.parseJSON(WindowStorage.get("StoredFnu"));
							 _.each(fac, function(facility){
							 	var nulist=[];
							 	_.each(facility.LOCQUAL, function(nu){
							 		nulist.push(nu.NULOCATIONCD);
							 	})
							 	that.setSelectedNu(facility, nulist,true);
							 	$("#falist").val(facility.ORGID);
								var selection = [];
								_.each(facility.LOCQUAL, function(loc){
									selection.push(loc.LOCATIONDISP);
								});
								that.changeNurseUnitText(selection);
							 })
							this.clearWindowStorage();
							this.trigger("select:fulist");
						}
						else {
							if(this.PTLISTS.BWDEFPOP==="1"){
								 this.setInitialSelectedList();
								this.trigger("change:selected");
							}
							else{
								$('#ptpopMessage').text(messagePL);
							}
						}
						$('#fu-label').remove();
						$('#falist').remove();
						$('#nuLink').remove();
					}
					//facility nurse unit
					else if (this.PTLISTS.BWPTPOP === "2") {
						if (this.PTLISTS.BWWTS === "0") {
							this.PTLISTS.PTLIST = _.filter(this.PTLISTS.PTLIST,
									function(v) {
										return v.LISTID !== 0;
									});
						}
						this.sortList();
						this.trigger("change:ptlists");
						if (WindowStorage.get("StoredIndex") != 'undefined') {
							this.setSelectedList(WindowStorage
									.get("StoredIndex"));
							this.clearWindowStorage();
							this.trigger("select:ptlist");
						}
						else if(WindowStorage.get("StoredFnu") != 'undefined'){
							var fac = jQuery.parseJSON(WindowStorage.get("StoredFnu"));
							 _.each(fac, function(facility){
							 	var nulist=[];
							 	_.each(facility.LOCQUAL, function(nu){
							 		nulist.push(nu.NULOCATIONCD);
							 	})
							 	that.setSelectedNu(facility, nulist,true);
							 	$("#falist").val(facility.ORGID);
								var selection = [];
								_.each(facility.LOCQUAL, function(loc){
									selection.push(loc.LOCATIONDISP);
								});
								that.changeNurseUnitText(selection);
							 })
							this.clearWindowStorage();
							this.trigger("select:fulist");
						}
						else {
							if(this.PTLISTS.BWDEFPOP==="2"){
								 this.setInitialSelectedFu(_.filter(this.PTLISTS.PTLIST, function(list){
									 return list.LISTID===0;
								 }), true, 2);
							}
							else{
								$('#ptpopMessage').text(messageFU);
							}
						}
						$('#pt-label').remove();
						$('#ptlist').remove();
						$("#ptpopSubmit").remove();
					}
					//both
					else {
						this.sortList();
						this.trigger("change:ptlists");

						if (WindowStorage.get("StoredIndex") != 'undefined') {
								this.setSelectedList(WindowStorage
										.get("StoredIndex"));
								this.clearWindowStorage();
								this.trigger("select:ptlist");
						}
						else if(WindowStorage.get("StoredFnu") != 'undefined'){
							var fac = jQuery.parseJSON(WindowStorage.get("StoredFnu"));
							 _.each(fac, function(facility){
							 	var nulist=[];
							 	_.each(facility.LOCQUAL, function(nu){
							 		nulist.push(nu.NULOCATIONCD);
							 	})
							 	that.setSelectedNu(facility, nulist,true);
							 	$("#falist").val(facility.ORGID);
								var selection = [];
								_.each(facility.LOCQUAL, function(loc){
									selection.push(loc.LOCATIONDISP);
								});
								that.changeNurseUnitText(selection);
							 })
							this.clearWindowStorage();
							this.trigger("select:fulist");
						}
						else {
							if(this.PTLISTS.BWDEFPOP==="1"){
								this.setInitialSelectedList();
								this.trigger("change:selected");
								// this.trigger("select:ptlist");
								this.setInitialSelectedFu(_.filter(this.PTLISTS.PTLIST, function(list){
									 return list.LISTID===0;
								 }), false, 3);
							}
							else if(this.PTLISTS.BWDEFPOP==="2"){
								 this.setInitialSelectedFu(_.filter(this.PTLISTS.PTLIST, function(list){
									 return list.LISTID===0;
								 }), true, 3);
								 // this.trigger("select:fulist");
							}
							else{
								$('#ptpopMessage').text(messageBoth);
							}
						}
					}
					this.setPageTitle();
					this.setRiskLabel();
					this.setTabNavInd();
				} else {
					throw Error("patientListsModel.retrieve() failure");
				}
			},

			/**
			 * Sorts patient list by CCL List Sequence
			 */
			sortList : function() {
				this.PTLISTS.PTLIST = _.sortBy(this.PTLISTS.PTLIST, function(
						list) {
					return list.LISTSEQ;
				});

			},

			/**
			 * Sets the initial sorted list silently on load
			 */
			setInitialSelectedList : function() {
				var selectedList = _.min(this.PTLISTS.PTLIST, function(list) {
					return list.LISTSEQ;
				});
				if( selectedList  !== undefined)
				    selectedList["NULIST"] = [];

				this.set({
					selectedList : selectedList
				});
			},

			/**
			 * Set the initial Nurse Unit
			 */
			setInitialSelectedFu:function(list, flag, defPop){
				var self = this;
				var messageFU = $.i18n.t("PatientListsModel.SELECT_FACILITY_AND_NURSE_UNITS_TO_QUALIFY");
				var messageBoth = $.i18n.t("PatientListsModel.SELECT_PATIENT_LIST_OR_FACILITY");
				if(list.length>0){
					_.each(this.PTLISTS.FUQUAL, function(org){
						_.each(org.LOCQUAL, function(nu){
							if(nu.NULOCATIONCD===list[0].DEFAULTLOCCD){
								$("#falist").val(org.ORGID);
								$("#nuLink").text(nu.LOCATIONDISP);
								$("#nuLink").attr("title", nu.LOCATIONDISP);
								self.setSelectedNu(org,[nu.NULOCATIONCD], flag);
							}
						});
					});
				}
				else{
					if(defPop===2){
						$('#ptpopMessage').text(messageFU);
					}
					else if(defPop===3){
						$('#ptpopMessage').text(messageBoth);
					}
				}
			},

			/**
			 * Returns number of patient lists
			 *
			 * @returns {Number} number of patient lists
			 */
			length : function() {
				return this.PTLISTS.PTLIST ? this.PTLISTS.PTLIST.length : 0;
			},

			/**
			 * Gets patient lists
			 *
			 * @returns {Array} Patient Lists
			 */
			getLists : function() {
				return (this.PTLISTS && this.PTLISTS.PTLIST) ? this.PTLISTS.PTLIST
						: [];
			},

			/**
			 * Gets facilities lists
			 *
			 * @returns {Array} Patient Lists
			 */
			getFacilities : function() {
				return (this.PTLISTS && this.PTLISTS.FUQUAL) ? this.PTLISTS.FUQUAL
						: [];
			},

			/**
			 * Gets single patient list from LISTID
			 *
			 * @params {Number} listId
			 * @returns {Object} Single patient list info
			 */
			getSingleList : function(listId) {
				return _.detect(this.PTLISTS.PTLIST, function(ptlist) {
					return ptlist.LISTID === listId;
				});

			},

			/**
			 * Gets single facility list from ORGID
			 *
			 * @params {Number} listId
			 * @returns {Object} Single facility list info
			 */
			getSelectedFacility : function(listid) {
				return _.find(this.PTLISTS.FUQUAL, function(facility) {
					return facility.ORGID == listid;
				});
			},

			/**
			 * Sets selected patient list based on listId
			 *
			 * @params {Number} listId
			 */
			setSelectedList : function(listId) {
				var selected = _.detect(this.PTLISTS.PTLIST, function(list) {
					return list.LISTID == listId;
				});
				//if( selectedList  !== undefined)
				    selected["NULIST"] = [];
				this.set({
					selectedList : selected
				});
				this.set({
					addedPatients : []
				}, {silent:true});
				this.trigger("change:selected");
			},

			setSelectedNu : function(facility, nucd, flag) {
				if (nucd.length > 0) {
					var selected = [];
					_.each(facility.LOCQUAL, function(nu) {
						if (_.indexOf(nucd, nu.NULOCATIONCD) != -1) {
							delete nu["OPEN"];
							delete nu["CLOSE"];
							selected.push(nu);
						}
					});
					var fac = _.clone(facility);
					fac.LOCQUAL = selected;
					var json = {
						"PRSNLID" : Criterion.personnel_id,
						"LISTID" : -1,
						"LISTTYPECD" : 0,
						"DEFAULTLOCCD" : 0,
						"NULIST" : [ fac ]
					};
					if(flag){
						this.set({
							selectedList : json
						});
					}
				}
			},

				//change text of nurse unit link
			changeNurseUnitText:function(selection){
				if(selection.length>0){
					var text="";
					$.each(selection, function(i, e){
						text = text + e + "; ";
					});
					text=text.slice(0, text.length-2);
					$("#nuLink").attr("title", text);
					if(text.length>50){
						text=text.slice(0, 50);
						text+="...";
					}
					$("#nuLink").text(text);
				}
			},

			/*
			 * Sets page title
			 */
			setPageTitle : function() {
				if (this.PTLISTS.PAGE_TITLE === "")
					$(".mpage-title").get(0).innerHTML = $.i18n.t("SafetyAttendanceCommon.SAFETY_AND_ATTENDANCE_MPAGE");
				else
					$(".mpage-title").get(0).innerHTML = this.PTLISTS.PAGE_TITLE;
			},

			/*
			 * Sets tab navigation indicator
			 */
			setTabNavInd : function() {
					this.set({
						tabNavInd : this.PTLISTS.TABNAV_IND
					},{silent:true});
			},

			/*
			 * Sets fall and suicide risk label
			 */
			setRiskLabel : function(){
				var fRiskLabel = this.PTLISTS.FALL_LABEL;
				var sRiskLabel = this.PTLISTS.SUICIDE_LABEL;
				if(fRiskLabel===""){
					this.set({
						fallLabel : "Fall"
					},{silent:true});
				}
				else{
					this.set({
						fallLabel : fRiskLabel
					},{silent:true});
				}

				if(sRiskLabel===""){
					this.set({
						suicideLabel : "Suicide"
					},{silent:true});
				}
				else{
					this.set({
						suicideLabel : sRiskLabel
					},{silent:true});
				}
			},

			clearWindowStorage : function(){
				WindowStorage.del("StoredFnu");
				WindowStorage.del("StoredIndex");
			},

			/**
			 * Destroy model
			 */
			destroyPatientListsModel : function() {
				// remove any circular reference
				if (this.view) {
					this.view = null;
				}
				this.destroy();
			}

		});

/**
 * Generates series of times, based on interval param and date supplied
 * @author Aaron Nordyke - AN015953
 * @param {Number} interval Size of interval in minutes
 * @param {Date} date Date from which to generate intervals going backward
 */
var timeIntervalGenerator = function(interval,date, range) {

	var _date = date || new Date(),
			_interval = interval,
			_range = range;

	date.setSeconds(0,0);
    _date.setSeconds(0,0);

	if(arguments.length !== 3) {
		throw new Error("timeIntervalGenerator(): must have three parameter");
	}
	if(typeof arguments[0] !== "number" || typeof arguments[1] !== "object") {
		throw new TypeError("timeIntervalGenerator(): Incorrect parameter types : " + arguments[0] + " " + arguments[1]);
	}

	/**
	 * Gets array of time intervals
	 *
	 * @returns {Array} intervals Array of objects in the form of {endDate,startDate,endMilitary,startMilitary,military}
	 */
	function getIntervals() {
		var intervals = [],
				twelveHoursInPast = getTwelveHoursAgo(date),
				intervalSet,
				startDate,
				endDate,
				startMilitary,
				endMilitary,
				endDate = getStartingDate(),
				endMilitary = getMilitaryTimeString(endDate);

        //As HeaderTime is changed as per the iView,endDate.valueOf()>=twelveHoursInPast.valueOf()

		while(endDate.valueOf() >= twelveHoursInPast.valueOf()) {
			startDate = subtractInterval(endDate);
			startDate.setMinutes ( startDate.getMinutes() + 1 );
			startMilitary = getMilitaryTimeString(startDate);
			var startdt=df.format(startDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR),
			enddt=df.format(endDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR),
			headerDate = startdt===enddt ? startdt: startdt + "-" + enddt,
			array = (startDate).toString().split(" "),
			timezone = array[4];
			intervals[intervals.length] = {
				endDate:endDate,
				startDate:startDate,
				endMilitary:endMilitary,
				startMilitary:startMilitary,
				date: headerDate,
				//Each Time slots should be as per iView
				military : startMilitary+ "-" + endMilitary + " " + timezone
			};
			endDate = new Date(startDate);
			endDate.setMinutes ( endDate.getMinutes() - 1 );
			endMilitary = getMilitaryTimeString(endDate);
		}
		return intervals;
	}

	/**
	 * Get specific interval array based on index
	 * @param {Integer} position array index
	 * @returns {Object} interval at position supplied
	 */
	function getInterval(position) {
		return getIntervals()[position];
	}

	/**
	 * Gets next interval based on date supplied
	 * @param {Date} date of last interval
	 * @returns {Date} date of next interval
	 */
	function subtractInterval(date) {
		var d = new Date(date.valueOf());
		d = new Date(d.setMinutes(d.getMinutes() - interval).valueOf());
		return d;
	}

	/**
	 * Get Military Time String from date supplied
	 * @param {Date} date from which to create string
	 * @returns {String} Military Time String
	 */
	function getMilitaryTimeString(date) {
		var hour = date.getHours().toString();
		var minutes = date.getMinutes().toString();
		hour = hour.length == 2 ? hour : "0" + hour;
		minutes = minutes.length == 2 ? minutes : "0" + minutes;
		return hour + ":" +  minutes;
	}

	/**
	 * Gets starting date for generating all intervals moving backwards
	 * @returns {Date} Starting Date
	 */
	function getStartingDate() {
		var intervalInMilliseconds = 1000*60*interval;
		var latestDate = new Date(date.valueOf());
		latestDate.setMinutes(59);
		latestDate.setSeconds(0,0);
		while(latestDate.getTime() - date.getTime() >= intervalInMilliseconds) {
			latestDate = subtractInterval(latestDate);
		}
		return latestDate;
	}

	/**
	 * Returns 12 hours before supplied date
	 * @param {Date} date
	 * @returns {Date} twelve hours before parameter
	 */
	function getTwelveHoursAgo(date) {
		var twelveHrsInMs = 1000*60*60*_range;
		date = new Date(date.valueOf() - twelveHrsInMs);
		date.setSeconds(0,0);
		return date;
	}

	/**
	 * Gets interval from array based on supplied date
	 * @param {Date} date
	 * @returns {Object} Interval object, if date is found in 12 hour range, -1 if not found
	 */
	function getIntervalForDate(date){
		if(date < getTwelveHoursAgo(_date)){
			return -1;
		}
		var intervals = getIntervals();
		for(var i = 0,l = intervals.length;i<l;i++){
			if(date < intervals[i].endDate && date >= intervals[i].startDate){
				return i;
			}
		}
		return -1;
	}


	return {
		getIntervals:getIntervals,
		getInterval:getInterval,
		subtractInterval:subtractInterval,
		getMilitaryTimeString:getMilitaryTimeString,
		getStartingDate:getStartingDate,
		getTwelveHoursAgo:getTwelveHoursAgo,
		getIntervalForDate:getIntervalForDate
	};
};

/**
 * Represents a Patient Clinical Activity
 *
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,DateFormatter
 */
var ActivityModel = Backbone.Model.extend({

	/**
	 * Patient owner of ActivityModel
	 */
	patient : {},

	/**
	 * Default values
	 */
	defaults : {
		"CNT" : 0,
		"EVENT_DT" : "",
		"EVENTDTDISP" : "",
		"STATUS" : "NONE",
		"STARTDT": "",
		"ENDDT": "",
		"LIST": [{
			"TYPE" : "",
			"EVENTID" : 0.0,
			"NAME" : "",
			"CLINEVENTID" : 0.0,
			"EVENT_CD" : 0.0,
			"EVENT_DISP" : "",
			"EVENT_RESULT" : "",
			"FREETEXT": "",
			"NOMID": [{
				"NOMID" : ""
			}],
			"INPUTPRT": 0.0,
			"OFFUNITIND":"0"
		}]
	},

	/**
	 * Default Constructor
	 *
	 * @constructor
	 */
	initialize : function() {
		_.bindAll(this);
		this.setInitialActivityStatus();
	},

	/**
	 * Sets Initial Activity Status, based on whether it has been saved to
	 * patient record
	 */
	setInitialActivityStatus : function() {
		if( !this.get("CNT")) {
			this.set({
				"STATUS" : "NONE"
			});
			return;
		}
		this.set({
			"STATUS":this.get("LIST")[0].EVENTID > 0 ? "SAVED" : "DRAFT"
		});
	},

	/**
	 * Get Date object from format 08-02-2011 09:41
	 *
	 * @returns {Date}
	 */
	getEventDt : function() {
		var date = jQuery.trim(this.get("EVENT_DT"));
		if(this.get("STATUS")==="DRAFT"){
			var dateInString = DateFormatter.getDateFromFormat(date, "dd-NNN-yyyy HH:mm:ss");
			var date1 = new Date(dateInString);
			return new Date(df.format(date1, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_MMM_4YEAR));
		}
		else{
			return new Date(DateFormatter.getDateFromFormat(date, "M-d-y H:m"));
		}
	},

	/**
	 * In Error an Activity. If it's a saved activity, set to INERROR. If it's a
	 * draft, set it to none.
	 */
	inError : function() {
		this.set({
			"STATUS":this.get("STATUS").toUpperCase() === "DRAFT" ? "NONE" : "INERROR"
		});
	},

	/**
	 * Destroys model and any associated view
	 */
	destroyActivity : function() {
		// remove any circular reference
		if(this.view) {
			this.view = null;
		}
		// removes model from collection
		this.destroy();
		// unbind all events for model
		this.unbind();
	}

});

var UserPrefModel = Backbone.Model.extend({
	defaults : {
		"offunitstatus" : {
			"isoffunit" : false,
			"offunitstartdt" : "",
			"cecd" : 0.0,
			"nomid" : 0.0,
			"nomdisp" : ""
		}
	},
	model : null,

	/**
	 * Default Constructor
	 * @constructor
	 */
	initialize : function() {
		_.bindAll(this);
		if(!this.get("json_handler")) {
			var json_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"dev_debug_ind" : Criterion.dev_debug_ind,
				"disable_firebug" : true
			});

			this.set({
				json_handler : json_handler
			});
		}
		this.json_handler = this.get("json_handler");
	},

	savePref : function(id,encntr_id, ind, dt, cecd, nomid, nomdisp, modalObj) {

		var MPREQ ;

		this.model = modalObj;

		MPREQ = {LIST:[]};

			MPREQ.LIST[0]={
			INPUTPERSONID : id +".0",
			INPUTPROVIDERID : Criterion.personnel_id +".0",
			INPUTENCOUNTERID : encntr_id+".00" ,
			INPUTEVENTCD : cecd +".0",
			ENDDTTM : dt,
			INPUTNOMENCLATUREID: [{"NOMID":nomid + ".0"}],
			INPUTFREETEXT:nomdisp,
			INPUTPPR: 0.0,
			OFFUNIT: ind
		};


		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^" + ",^" + Criterion.project_name + "^";

		var path = "dc_mp_bhv_hlth_setup_save_pref";

		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : this.receiveSaveresponse,
				parameters : [this]
			}
		});
	},

	receiveSaveresponse : function(json_response) {
		var reply = json_response.response.MPREP;

		if(reply.STATUS_DATA.STATUS === "S"){
			this.addOffunitEvent(reply);

			this.set({
				offunitstatus: {
					isoffunit : true,
					offunitstartdt : (new Date).toDate(reply.OFFUNIT_STARTDT),
					cecd : reply.CECD,
					nomid : reply.NOMID,
					nomdisp : fixedDecodeURIComponent(reply.NOMDISP)
				}
			});


		}
	},


	addOffunitEvent : function(reply)
	{
	  				var activityData = {
					"CNT" : 1,
					"EVENT_DT" : this.model.getActivityTime(),
					"EVENTDTDISP" : this.model.getActivityTime1(),
					"STATUS" : "SAVED",
					"LIST": [{
						"EVENTID" : reply.EVENT_ID,
						"NAME" : fixedDecodeURIComponent(reply.NOMDISP),
						"CLINEVENTID" : 0.0,
						"EVENT_CD" : reply.CECD,
						"EVENT_DISP" : fixedDecodeURIComponent(reply.NOMDISP),
						"EVENT_RESULT" : fixedDecodeURIComponent(reply.NOMDISP),
						"FREETEXT": "",
						"NOMID": [{
							"NOMID" : reply.NOMID.toString()
						}],
						"INPUTPRT": 0.0,
						"OFFUNITIND":"1"
					}]
				};


			this.model.setActivityModel(activityData);

	},

	removePref : function(id,encntr_id,ind, dt, cecd, nomid, nomdisp, modalObj){
		var MPREQ ;
		this.model = modalObj;

		MPREQ = {LIST:[]};

			MPREQ.LIST[0]={
			INPUTPERSONID : id +".0",
			INPUTPROVIDERID : Criterion.personnel_id +".0",
			INPUTENCOUNTERID : encntr_id+".00" ,
			INPUTEVENTCD : cecd +".0",
			ENDDTTM : dt,
			INPUTNOMENCLATUREID: [{"NOMID":nomid + ".0"}],
			INPUTFREETEXT:nomdisp,
			INPUTPPR: 0.0,
			OFFUNIT: ind
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^" + ",^" + Criterion.project_name + "^";
		var path = "dc_mp_bhv_hlth_setup_save_pref";
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : this.receiveRemoveresponse,
				parameters : [this]
			}
		});
	},


	receiveRemoveresponse : function(json_response) {
		var reply = json_response.response.MPREP;
		if(reply.STATUS_DATA.STATUS === "S"){

			this.model.addOffunitEvent(reply.EVENT_ID);

			this.set({
				offunitstatus: {
					isoffunit : false,
					offunitstartdt : "",
					cecd : 0.0,
					nomid : 0.0,
					nomdisp : ""

				}
			});

		}

	}
});

var MultiSelectModel = Backbone.Model.extend({
	defaults:{
		"selectedPatient" : []
	},

	initialize : function() {
		_.bindAll(this);
	},

	clean : function(){
		this.set({
			selectedPatient : []
		});
	}
});

 /*
  * File "translation.safety.json"
					Namespaces used:
						"NewPatientHandlebar",
						"SafetyAttendanceCommon",
						"NewPatientModel".
 */

var NewPatientModel = Backbone.Model.extend({

/*
  Declaring constants for getBhInfo()
   0 - To Skip Duplicate check ;when called from DashboardView
   1 - To check the duplicate patients exiting in patientlist;When Adhoc patient is added  from submitPatients() function of newPatientDialogView
   2 - To skip the duplicate patient check ; from setTimeRange() of Patientcollection
 */
	mode : {
		SKIP_DUPLICATE_PATIENT_ALERT : 0,
		DUPLICATE_PATIENT_CHECK : 1,
		SKIP_DUPLICATE_PATIENT_CHECK : 2
	},

	defaults : {
		"pt_cnt" : 0,
		"page_cnt" : 0,
		"patients" : [{
			"pageNum" : 0,
			"ptQualInd" : 0,
			"pt_id" : 0.0,
			"encntr_id" : 0.0,
			"encntr_typeCd" : 0.0,
			"name" : "",
			"fin" : "",
			"mrn" : "",
			"age" : "",
			"birth_dt" : "",
			"birthDtJs" : "",
			"gender" : "",
			"org_id" : 0.0,
			"facility" : "",
			"facilityCd" : 0.0,
			"nurse_unit" : "",
			"nurse_unitCd" : 0.0,
			"room" : "",
			"bed" : "",
			"los" : 0.0,
			"admit_dt" : "",
			"admitDtJs" : ""
		}]
	},

	flag : 0,

	initialize : function() {
		_.bindAll(this);

		if (!this.get("json_handler")) {
			var json_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"dev_debug_ind" : Criterion.dev_debug_ind,
				"disable_firebug" : true
			});

			this.set({
				json_handler : json_handler
			});
		}
		this.json_handler = this.get("json_handler");
	},

	/**
	 * Calls script and retrieves data
	 */
	retrieve : function(patientList) {
		this.trigger("started-loading");
		var MPREQ = {
			PRSNLID : patientList.PRSNLID,
			PTLISTID : patientList.LISTID,
			PTLISTTYPE : patientList.LISTTYPECD,
			PTLISTLOCCD : patientList.DEFAULTLOCCD,
			fuQual : getNurseUnitList(patientList.NULIST)
		};
		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^"+ ",^" + Criterion.project_name + "^";
		var targetDOM = _g('json-loader-message-ptlist');
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_get_patients",
				parameters : params
			},
			loadingDialog : {
				content : "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
				targetDOM : targetDOM
			},
			response : {
				type : "JSON",
				target : this.receiveCCLresponse,
				parameters : [this]
			}
		});
	},

	/**
	 * Callback for receiving CCL from script
	 */
	receiveCCLresponse : function(json_response){
		this.trigger("finished-loading");
		if(json_response.response.PTREPLY.STATUS_DATA.STATUS==="S"){
			var ptreply = json_response.response.PTREPLY;
			this.set({
				page_cnt : ptreply.PAGE_CNT,
				pt_cnt : ptreply.PT_CNT,
				patients : ptreply.PATIENTS
			});
		}
		else{

			alert($.i18n.translate("NewPatientModel.ERROR_WHEN_RETRIEVING_PATIENT_LIST_DATA"));
		}
	},

	getPatientRequest :  function (patients){
		var patientData ={
				"PT_CNT" : 0,
				"PATIENTS": []
			};
			//Assigning values to patients[] from patients object
			//create list in the model
			_.each(patients, function(v){
				patientData.PT_CNT++;
				patientData.PATIENTS.push({
					"PT_ID" : v.PT_ID,
					"ENCNTR_ID" : v.ENCNTR_ID,
					"ENCNTR_TYPECD" : v.ENCNTR_TYPECD,
					"NURSE_UNITCD" :v.NURSE_UNITCD,
					 "NAME" : v.NAME,
					 "BIRTH_DT" : v.BIRTH_DT,
					 "ADMIT_DT" : v.ADMIT_DT
				});
			});
	return patientData;
	},

	getBhInfo : function(value){

	mConsole.log("newpatientmodel.getBhInfo"+value,mConsole.debug_level_info);

	//If value is '0' then increment the addFlag else set the addFlag to '1'and the value retrieved is passed as parameter to the response
		if( value == this.mode.SKIP_DUPLICATE_PATIENT_ALERT ){
			this.patients.addFlag++;
		}
		else{
			this.patients.addFlag = 1;
		}
		var MPREQ = this.getPatientRequest(this.get("patients"));

		var mpreqString = JSON.stringify(MPREQ);
		var params = "^MINE^,^{'MPREQ':" + mpreqString + "}^" + ",^" + Criterion.project_name + "^";
		var targetDOM = _g('json-loader-message');
		var that = this;
		this.json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "bh_mp_sa_get_patient_details",
				parameters : params
			},
			loadingDialog : {
				content : "",//$.i18n.t("SafetyAttendanceCommon.LOADING") + "<img src='" + $.i18n.t("PatientListsModel.LOADING_IMG") + "'/>",
				targetDOM : targetDOM
			},
			response : {
				type : "JSON",
				target : function(json_response) {
								that.receiveBhInfo(json_response, value)
							},
				parameters : [this]
			}
		});
	},

	receiveBhInfo : function(json_response, mode){

	mConsole.log("newpatientmodel.receiveBhInfo"+json_response,mConsole.debug_level_info);
		if(json_response.response.BHREPLY.STATUS_DATA.STATUS==="S"){
			var bhinfo = json_response.response.BHREPLY;
			var that = this;
			//If mode is '2' then skip the entire 'if' part to get the activities on change of time range
				if(mode != that.mode.SKIP_DUPLICATE_PATIENT_CHECK){
					_.each(this.get("patients"), function(ptPatient){
						mConsole.log("newpatientmodel.receiveBhInfo in else",mConsole.debug_level_info);
						var foundPatient = that.patients.detect(function(patientModel) {
							return patientModel.get("encntr_id") === ptPatient.ENCNTR_ID;
						});
						if(foundPatient){
							mConsole.log("newpatientmodel.receiveBhInfo in foundPatient",mConsole.debug_level_info);
							//To check whether the selected patient already exists
							if(mode == that.mode.DUPLICATE_PATIENT_CHECK){//If it is calling from dashboard attach add patient no alert
								alert($.i18n.t("NewPatientHandlebar.PATIENT_IS_ALREADY_IN_THE_PATIENT_LIST") +foundPatient.get("name"));//leftout
							}
							var foundBhinfo = _.detect(bhinfo.LIST, function(bhPatient){
								return bhPatient.EID === foundPatient.get("encntr_id");
							});
							bhinfo.LIST = _.without(bhinfo.LIST, foundBhinfo);
							bhinfo.LISTCNT = bhinfo.LISTCNT-1;
						}
						else{
							mConsole.log("newpatientmodel.receiveBhInfo in foundPatient else",mConsole.debug_level_info);
							var patient = new PatientModel();
							patient.set({
									showimage_ind : that.patients.BhInfoModel.get("APP_PREF").SHOWIMAGE_IND
								});
								patient.setBhInfo(ptPatient);
								patient.set({
									isAdded : true
								}, {silent: true});
								that.patients.add(patient, {
									silent : true
								});
						}
				});
			}
			var timeRange = this.patients.selectedRange;
			var patientsForActivity ={
				"BATCHNUMBER" : 0,
				"PT_CNT" : bhinfo.LIST.length,
				"PAGE_CNT" : 1,
				"TIMERANGE" : timeRange,
				"PATIENTS": []
			};
			//Checks for the list length
			if(bhinfo.LIST.length > 0){

				_.each(bhinfo.LIST, function(bhPatient){
						patientsForActivity.PATIENTS.push({
						"PAGENUM" :  1,
						"PT_ID" : bhPatient.PID,
						"ENCNTR_ID" : bhPatient.EID,
						"ENCNTR_TYPECD" : bhPatient.EIDTYPE
					});
				})

				/*If mode is not '2'then call the  getBhPatientsBatchActivities() of BhInfomodel to get activities;
				to avoid "finished-loading" trigger which adds already added patient on change of time range
				Else call getBhPatientsBatchActivities() of patientcollection to get the activities */

				if(mode == that.mode.SKIP_DUPLICATE_PATIENT_CHECK) {
				mConsole.log("newpatientmodel.skip if ",mConsole.debug_level_info);
					this.patients.BhInfoModel.getBhPatientsBatchActivities(patientsForActivity);
					return;
				}
				else
				{

				    mConsole.log("newpatientmodel.skip if else",mConsole.debug_level_info);
					this.patients.BhInfoModel.getBhPatientsBatchActivities(patientsForActivity);
				}
			}
			_.each(bhinfo.LIST, function(bhPatient){
				var patient = that.patients.detect(function(patientModel) {
					return patientModel.get("encntr_id") === bhPatient.EID;
				});


   			if(patient){
				patient.setOtherInfo(bhinfo.LIST);
				patient.set({
					location_activities : that.patients.BhInfoModel.getActivitiesForLocation(patient.get("nurse_unit_cd"))
				});
				patient.set({
					offunitevent : that.patients.BhInfoModel.get("APP_PREF").OFFUNITEVENT
				});
				that.patients.trigger("add");

			var patientView = new PatientView({
					model : patient,
					collection : that.patients
				});

				var ptListModel = that.patients.patientListsModel;
				ptListModel.get("addedPatients").push(patient);
				$(".patient-dashboard tbody").append(patient.view.el);
				//if patient is marked off unit, Refresh the view
				patient.userPrefModel.trigger("change:offunitstatus");
     			 }
			});
	// If mode is '1' add adhoc patient to window Storage
			if(mode == this.mode.DUPLICATE_PATIENT_CHECK){
				try{
					var addedPatient = WindowStorage.get("AddedPatients");
					if(addedPatient!=="undefined"){
						addedPatient = jQuery.parseJSON(addedPatient);
						var ptListModel = that.patients.patientListsModel;
						var foundPtlist = _.detect(addedPatient, function(ptlist){
							return _.isEqual(ptlist.selectedList, ptListModel.get("selectedList"));
						});
						if(foundPtlist){
							addedPatient = _.without(addedPatient, foundPtlist);
							addedPatient.push(ptListModel);
							WindowStorage.set("AddedPatients", JSON.stringify(addedPatient));
						}
						else{
							addedPatient.push(ptListModel);
							WindowStorage.set("AddedPatients", JSON.stringify(addedPatient));
						}
					}
					else{
						WindowStorage.set("AddedPatients", JSON.stringify([that.patients.patientListsModel]));
					}
				}
				catch(err){
					alert(err.message);
				}
			}
		}
		else{
			alert($.i18n.translate("NewPatientModel.ERROR_WHEN_RETRIEVING_BH_DATA"));
		}
	}
});

/**
 * Collection of PatientModel
 * @author Aaron Nordyke - AN015953
 * @requires
 * Backbone,Underscore,jQuery,BhInfoModel,PtInfoModel,PatientModel,UtilJsonXml,TimeIntervalGenerator
 * Dependency:	File "translation.safety.json"
					Namespaces used:
						"DashboardDeaderHandlebar",
						"TimeIntervalSelectHandlebar" ,
						"PatientCollection".

 */
var PatientCollection = Backbone.Collection.extend({

	/**
	 * Collection model
	 */
	model : PatientModel,

	/**
	 * Array of time intervals
	 */
	timeIntervals : [],

	/**
	 * Currently selected time interval
	 */
	selectedInterval : 15,

	resetIntervalValue : "",
	/**
	 *  Currently selected time range
	 */
	selectedRange : 4,

	addFlag : 0,

	totalPatientsCount : 0,

	displayPatientsCount : 0,

	patinetsBatchNum: 0,


	/**
	 * Initialized Collection.  Uses UtilJsonXml supplied or creates new one
	 * @example var patientCollection = new
	 * PatientCollection([[],{json_handler:json_handler});
	 */
	initialize : function() {
		//bind all callbacks that use certain member functions.
		_.bindAll(this);

		if(this.BhInfoModel) {
			this.BhInfoModel.destroy();
		}
		// if(this.PtInfoModel) {
			// this.PtInfoModel.destroy();
		// }
		if(this.MultiSelectModel) {
			this.MultiSelectModel.destroy();
		}

		this.BhInfoModel = new BhInfoModel;
		//this.PtInfoModel = new PtInfoModel;
		this.MultiSelectModel = new MultiSelectModel;
		this.BhInfoModel.bind("change", this.fillPatientsBhInfo);
		//this.PtInfoModel.bind("change", this.fillPatientsPtInfo);
		this.BhInfoModel.bind("changeBatchActivities",this.getBatchActivities);
		this.bind("change:json_handler", function() {
			this.BhInfoModel.json_handler = this.json_handler;
			//this.PtInfoModel.json_handler = this.json_handler;
			this.unbind("change:json_handler");
		});
	},
	/**
	 * Gets data via BhInfoModel and PtInfoModel
	 * @param {Object} patientList
	 */
	retrieve : function(patientList) {
		this.resetIntervalValue=true;

		this.addFlag = 0;
		this.displayPatientsCount = 0;
		this.patinetsBatchNum = 0;
		this.totalPatientsCount = 0;

		this.trigger("started-loading");

		this.destroyCollection();

		this.BhInfoModel.clear({
			silent : true
		});
		// this.PtInfoModel.clear({
			// silent : true
		// });
		this.MultiSelectModel.set({
			selectedPatient : []
		},{
			silent : true
		});
		this.BhInfoModel.retrieveAppPrefForSA();
		this.retrivePatients(patientList);//Get the patients details and respective activities
	},

	/**
	 * Gets each patient details from patient list and each patient respective activities
	 * @param {Object} patientList*/

	retrivePatients: function(patientList){
        this.BhInfoModel.selectedRange	= this.selectedRange;
		this.BhInfoModel.retrieve(patientList);
	},


	getBatchActivities : function(response){
		try{
	mConsole.log("patientcollection.getBatchActivities"+JSON.stringify(response),mConsole.debug_level_info);
		var activities = response, patient;
		if (activities === undefined){
			activities = {LIST : []};
		}

		for(var index = 0, activitiesLength = activities.LIST.length; index < activitiesLength; index++) {
			patient = this.detect(function(patientModel) {
				return patientModel.get("encntr_id") === activities.LIST[index].EID;
			});
			if(!_.isEmpty(patient)){
				 patient.createActivityModelsFromEvents(activities.LIST[index].EVENTS);
				// alert(patient.get("name"));
				patient.trigger("changePatientActivities");
			 }

		}
		}
        catch(err){
			alert(err.message + "getBatchActivities");
			}
	},
	getNewBatchDetails : function() {
		this.resetIcon(".patient-sort");
		this.resetIcon(".location-sort");
		//this.BhInfoModel.trigger("change");
		this.BhInfoModel.getBhPatientsActivitiesbyBatch(++this.patinetsBatchNum);
	},


	/**
	 * Callback after BhInfoModel is finished.  Creates PatientModel(s) or fills
	 * current ones.
	 * If PtInfoModel is also finished, this triggers an "add" event.
	 */
	fillPatientsBhInfo : function() {
		try{
		var bhinfo = this.BhInfoModel.get("BHINFO"), patient;
		mConsole.log("fillPatientsBhInfo",mConsole.debug_level_info);
		var LIST = bhinfo.PATIENTS;
		var offUnitEvent = this.BhInfoModel.get("APP_PREF").OFFUNITEVENT;
		var defaultTime = this.BhInfoModel.get("APP_PREF").RETRIEVE_DEFAULT_TIME;
		var retriveActBatchSize = this.BhInfoModel.get("APP_PREF").RETRIEVE_ACT_BATCHSIZE;


		var tempDisplayPatientscount = this.displayPatientsCount;
		this.displayPatientsCount = retriveActBatchSize + this.displayPatientsCount;
		this.totalPatientsCount = bhinfo.PATIENTS.length

		if(this.totalPatientsCount <= this.displayPatientsCount )
		{
			this.displayPatientsCount = this.totalPatientsCount

		}

		for(var i = tempDisplayPatientscount, l = this.displayPatientsCount; i < l; i++) {
			patient = this.detect(function(patientModel) {
				return patientModel.get("encntr_id") === bhinfo.PATIENTS[i].ENCNTR_ID;
			});
			//if patient doesn't exist, then create it
			if(_.isEmpty(patient)) {
				patient = this.addNewPatientFromBhInfo(LIST[i]);

				 patient.set({
					 offunitevent : this.BhInfoModel.get("APP_PREF").OFFUNITEVENT
				 });
			}
			//patient exists,so add to it
			else {
				patient.set({
					showimage_ind : this.BhInfoModel.get("APP_PREF").SHOWIMAGE_IND
				});
				patient.setBhInfo(LIST[i]);
				patient.set({
					location_activities : this.BhInfoModel.getActivitiesForLocation(patient.get("nurse_unit_cd"))
				});

				 patient.set({
				  offunitevent : this.BhInfoModel.get("APP_PREF").OFFUNITEVENT
				 });
				this.trigger("add");
			}
			patient.userPrefModel.trigger("change:offunitstatus");
			patient.set({
					 seq : i
				});

		}


			if(retriveActBatchSize >= this.displayPatientsCount){

				this.trigger("finished-loading");
				mConsole.log("trigger finished-loading",mConsole.debug_level_info);

				this.trigger("change:timeIntervalOptions");
				if (this.resetIntervalValue == true){
							if(defaultTime){
									var initialInterval = this.getDefaultTimeIntervalToDisplay();
							}
							else{
									var initialInterval = this.getIntervalForLocation();
							}
								if(initialInterval){
										this.createTimeIntervals(initialInterval.LOCTM);
									}
					}
					else{
						this.createTimeIntervals(this.selectedInterval);
					}


				//this.trigger("change:timeIntervalOptions");
				//this.createTimeIntervals(this.selectedInterval);
			}
		    else
			{

				this.trigger("finished-loading-newbatch");
                mConsole.log("trigger finished-loading-newbatch",mConsole.debug_level_info);
			}
		}

        catch(err){
			log.info(err.message + " in fillPatientsBhInfo");
			}



	},
	/**
	 * Create new patient from BhInfo data and add it to collection
	 * @param {Object} bhPatient patient data from bhInfoModel
	 * @return {Object} patient
	 */
	addNewPatientFromBhInfo : function(bhPatient) {
	 try{
		var bhinfo = this.BhInfoModel.get("APP_PREF"), patient;
		patient = new PatientModel;
		patient.set({
			showimage_ind : bhinfo.SHOWIMAGE_IND
		});
		patient.setBhInfo(bhPatient);
		patient.setOtherInfo(this.BhInfoModel.get("BHINFO").LIST);
		patient.set({
			location_activities : this.BhInfoModel.getActivitiesForLocation(patient.get("nurse_unit_cd"))
		});

		this.add(patient, {
			silent : true
		});
		return patient;
	 }
        catch(err){
			log.info(err.message + " in addNewPatientFromBhInfo");
			}

	},
	/**
	 * Create new patient from PtInfo data and add it to collection
	 * @param {Object} ptPatient patient data from ptInfoModel
	 * @return {patient}
	 */
	addNewPatientFromPtInfo : function(ptPatient) {
		var patient = new PatientModel;
		patient.setPtInfo(ptPatient);
		//salert("addNewPatientFromPtInfo");
		this.add(patient, {
			silent : true
		});
		return patient;
	},
	/**
	 * Gets optional time intervals, in minutes, from BhInfoModel
	 * @return {Array} Time Intervals, sorted ascending by size of interval
	 */
	getTimeIntervalOptions : function() {
		try{

		var uniqueTimes =[], bhinfo = this.BhInfoModel.get("APP_PREF");
		var defaultTimeInterval = bhinfo.RETRIEVE_DEFAULT_TIME;

		//always return an array
		if(_.isEmpty(bhinfo)) {
			return [];
		}

		var LOCTIME = bhinfo.LOCTIME;
		//remove any duplicate time interval lengths
		if(!_.isEmpty(LOCTIME)){
			if(defaultTimeInterval){
			uniqueTimes.push({
				LOCCD : 0.0,
				LOCDISP : "DEFAULT",
				LOCDESC : "DEFAULT",
				LOCTM: defaultTimeInterval});
			}
			for(var i = 0, l = LOCTIME.length; i < l; i++) {
				var contains = _.any(uniqueTimes, function(uniqueTime) {
					return uniqueTime.LOCTM === LOCTIME[i].LOCTM;
				});
				if(!contains) {
					uniqueTimes[uniqueTimes.length] = LOCTIME[i];
					//uniqueTimes.push(LOCTIME[i]);
				}
			}
			return uniqueTimes.sort(function(a, b) {
				return a.LOCTM - b.LOCTM;
			});
		}
		else{
			return this.getDefaultTimeIntervalOptions();
		}
		}
        catch(err){
			log.info(err.message);
			}
	},
	/**
	 * Gets optional time ranges, in hours
	 * @return {Array} Time Ranges
	 */
	getTimeRangeOptions : function(){
		var ranges = _.range(4, 13);
		var hours = [];
		_.each(ranges, function(range){
			hours.push({HOUR:range+ " " + $.i18n.t("TimeIntervalSelectHandlebar.HOURS")});
		});
		return hours;
	},
	/**
	 * Get Default Time Interval Options, which are hard-coded to [15,30,60,120]
	 * @return {Array} Default Time Interval Option objects
	 */
	getDefaultTimeIntervalOptions : function() {
		try{
		var LOCTIME = [];
		var DEFAULTLOCTIME = this.BhInfoModel.get("APP_PREF").RETRIEVE_DEFAULT_TIME;
		if(DEFAULTLOCTIME){
			var defaultLocTm =  [DEFAULTLOCTIME,15,30,60,120];
			for(var i = 0, l = defaultLocTm.length; i < l; i++) {

				var contains = _.any(LOCTIME, function(locationTime) {
						return locationTime.LOCTM === defaultLocTm[i];
					});
					if(!contains) {

				LOCTIME[LOCTIME.length] = {
					LOCCD : 0.0,
					LOCDISP : "DEFAULT",
					LOCDESC : "DEFAULT",
					LOCTM : defaultLocTm[i]
				};
					}
			}
			return LOCTIME.sort(function(a,b){
				return a.LOCTM - b.LOCTM;
			});
		}
		else{
			var defaultLocTm =  [15,30,60,120];
				for(var i = 0, l = defaultLocTm.length; i < l; i++) {
					LOCTIME[LOCTIME.length] = {
						LOCCD : 0.0,
						LOCDISP : "DEFAULT",
						LOCDESC : "DEFAULT",
						LOCTM : defaultLocTm[i]
					};
				}
				return LOCTIME;
		}
		}
        catch(err){
			log.info(err.message);
			}
	},

	//To retrieve default time interval when S & A is loaded
	getDefaultTimeIntervalToDisplay : function() {
		var defaultLocTm = this.BhInfoModel.get("APP_PREF").RETRIEVE_DEFAULT_TIME;
		var LOCTIME = [];
		if(defaultLocTm){
			LOCTIME = {
					LOCCD : 0.0,
					LOCDISP : "DEFAULT",
					LOCDESC : "DEFAULT",
					LOCTM : defaultLocTm
				}
			return LOCTIME;
		}
	},

	/**
	 * Get location time interval, based on location of first patient in the list.
	 * @return {Object} - Location Interval Object, based on location of first
	 * patient in list.
	 * If no location is found, the smallest interval in the list is returned.
	 */
	getIntervalForLocation : function() {
		var firstPatient = this.first(), bhinfo = this.BhInfoModel.get("APP_PREF");

		if(!_.isEmpty(firstPatient)) {
			var nurse_unit_cd = firstPatient.get("nurse_unit_cd");
			//find interval for location, if it exists
			var loctime = _.detect(bhinfo.LOCTIME, function(loctime) {
				return nurse_unit_cd == loctime.LOCCD;
			});
			var defaultTime = bhinfo.RETRIEVE_DEFAULT_TIME;
			return !_.isEmpty(loctime) ? loctime : _.first(this.getTimeIntervalOptions());
		} else {
			return null;
		}
	},
	/**
	 * Creates time intervals from supplied interval and triggers a
	 * "change:timeInterval" event.
	 * @param {Integer} interval
	 */
	createTimeIntervals : function(interval) {
		this.timeIntervalGenerator = timeIntervalGenerator(interval, new Date(), this.selectedRange);
		this.timeIntervals = this.timeIntervalGenerator.getIntervals();
		this.selectedInterval = interval;
		this.trigger("change:timeIntervals");
	},
	/**
	 * Change the time range
	 * "change:timeRange" event.
	 * @param {Integer} interval
	 */
	setTimeRange : function(hour){
		//To retrieve patients activities on change of time range for patients in the patientlist
		mConsole.log("patientcollection.setTimeRange"+hour,mConsole.debug_level_info);
		this.selectedRange = hour;
		var patientList = this.patientListsModel.get("selectedList");
		this.retrieve(patientList);

		//To retrieve patients activities on change of time range for adhocly added  patients
		var addedPatients = WindowStorage.get("AddedPatients");
		if(addedPatients!=="undefined"){
			try{

				addedPatients = jQuery.parseJSON(addedPatients);

				var that = this;

				var foundPtlist = _.detect(addedPatients, function(ptlist){

					return _.isEqual(ptlist.selectedList, patientList);
				});

				if(foundPtlist){
					var jsonObj = {
						"pt_cnt" : foundPtlist.addedPatients.length,
						"page_cnt" : 0,
						"patients" : []
					};
					_.each(foundPtlist.addedPatients, function(patient){
						var ptObj = {
							"PT_ID": patient.person_id,
							"ENCNTR_ID": patient.encntr_id,
							"ENCNTR_TYPECD": patient.encntr_type_cd,
							"NAME": patient.name,
							"BIRTH_DT": patient.birth_dt,
							"ADMIT_DT": patient.admit_dt
						};
						jsonObj.patients.push(ptObj);
					});
					//To retrieve patient details and activities using newpatientmodel
					var newPtModel = new NewPatientModel(jsonObj);
					newPtModel.patients = this;
					//'SKIP_DUPLICATE_PATIENT_CHECK' is passed to getBhInfo() of newpatientmodel
					newPtModel.getBhInfo(newPtModel.mode.SKIP_DUPLICATE_PATIENT_CHECK);
				}
			}
			catch(err){
			log.info(err.message + "in setTimeRange");
			}
		}
	},

	resetInterval: function(){
		this.resetIntervalValue = true;
	},

	/**
	 * Sorts Collection by Location.  Triggers a "sort" event.
	 */
	sortPatientsByLocation : function() {
		var sortByLocation = MP_Util.CreateTimer("USR:MPG.BH_SA_SORT",Criterion.project_name+ " Sort by Patients location");
		if(sortByLocation){
			sortByLocation.Start();
		}
		if(this.updateIcon(".location-sort")===0){
		this.models = this.sortBy(function(patient) {
			return patient.get("nurse_unit")+patient.get("room")+patient.get("bed");
		});
		}
		else{
			this.models = this.sortBy(function(patient) {
				return -patient.get("nurse_unit")+patient.get("room")+patient.get("bed");
			}).reverse();
		}
		this.trigger("sort");
		if(sortByLocation){
			sortByLocation.Stop();
		}
		this.resetIcon(".patient-sort");
		//this.resetIcon(".suicide-sort");
		//this.resetIcon(".fall-sort");
	},
	/**
	 * Sorts Collection by Patient Name.  Triggers a "sort" event.
	 */
	sortPatientsByName : function() {
		var sortByPatientName = MP_Util.CreateTimer("USR:MPG.BH_SA_SORT", Criterion.project_name + " Sort by Patients name");
		if(sortByPatientName){
			sortByPatientName.Start();
		}
		if(this.updateIcon(".patient-sort")===0){
		this.models = this.sortBy(function(patient) {
			return patient.get("name");
		});
		}
		else{
			this.models = this.sortBy(function(patient) {
				return -patient.get("name");
			}).reverse();
		}
		this.trigger("sort");
		if(sortByPatientName){
			sortByPatientName.Stop();
		}
		//this.resetIcon(".suicide-sort");
		//this.resetIcon(".fall-sort");
		this.resetIcon(".location-sort");
	},
	/**
	 * Sorts Collection by Fall Risk. Triggers a "sort" event.
	 */
	sortPatientsByRisk : function(selectedRisk) {
		var sortByFallRisk = MP_Util.CreateTimer("USR:MPG.BH_SA_SORT",Criterion.project_name + " Sort by" +selectedRisk);
		if(sortByFallRisk){
			sortByFallRisk.Start();
		}
		//if(this.updateIcon(".fall-sort")===0){
		this.models = this.sortBy(function(patient) {

	    var precautions = patient.get("precautions")
		var riskInfo = 1;

		if(precautions !== undefined){
			if(precautions.length){
				for(var i = 0; i < precautions.length ; i++){
					if( precautions[i].VALUE !== "" && precautions[i].LABEL  === selectedRisk){
						   riskInfo = 0
					}
				}
				return riskInfo;
			}
		}

			return riskInfo;

		});

		// }
		// else{
			// this.models = this.sortBy(function(patient) {
				// return patient.get("fall_risk").length ? 0 : 1;
			// }).reverse();
		// }
		this.trigger("sort");
		if(sortByFallRisk){
			sortByFallRisk.Stop();
		}
		this.resetIcon(".patient-sort");
		//this.resetIcon(".suicide-sort");
		this.resetIcon(".location-sort");
	},
	/**
	 * Sorts Collection by Suicide Risk. Triggers a "sort" event.
	 */
	sortPatientsByPatientSeq : function() {


			this.models = this.sortBy(function(patient) {
				return patient.get("seq");

			});


		this.trigger("sort");
		this.resetIcon(".patient-sort");
		this.resetIcon(".location-sort");
	},
	/**
	 * Update the sort icon
	 */
	updateIcon : function(classname) {
		var url = $(classname).attr("src");
		if(url.match(/bg.gif$/)) {
			$(classname).attr("src", url.replace(/bg.gif$/, $.i18n.t("PatientCollection.SORTING_ASC_WITHOUT_PATH")));
			return 0;
		} else if(url.match(/asc.gif$/)) {
			$(classname).attr("src", url.replace(/asc.gif$/, $.i18n.t("PatientCollection.SORTING_DESC_WITHOUT_PATH")));
			return 1;
		} else {
			$(classname).attr("src", url.replace(/desc.gif$/, $.i18n.t("PatientCollection.SORTING_ASC_WITHOUT_PATH")));
			return 0;
		}
	},
	/**
	 * Reset the sort icon
	 */
	resetIcon : function(classsname) {
		var url = $(classsname).attr("src");
		if(url.match(/asc.gif$/)){
			$(classsname).attr("src", url.replace(/asc.gif$/, $.i18n.t("DashboardHeaderHandlebar.BG_IMG_WITHOUT_PATH")));
		}
		else if(url.match(/desc.gif$/)){
			$(classsname).attr("src", url.replace(/desc.gif$/, $.i18n.t("DashboardHeaderHandlebar.BG_IMG_WITHOUT_PATH")));
		}
	},
	/**
	 * Gets all unsaved activities from Collection
	 * @returns {Array} unsaved ActivityModel(s)
	 */
	getUnsavedActivities : function() {
		var unsavedActivities = [];
		var patients = this.models;
		for(var i = 0, l = patients.length; i < l; i++) {
			unsavedActivities = unsavedActivities.concat(patients[i].activities.getUnsavedActivities());
		}

		return unsavedActivities;
	},
	/**
	 * Gets all InError activities from Collection
	 * @returns {Array} InError ActivityModel(s)
	 */
	getInErrorActivities : function() {
		var inErrorActivities = [];
		var patients = this.models;
		for(var i = 0, l = patients.length; i < l; i++) {
			inErrorActivities = inErrorActivities.concat(patients[i].activities.getInErrorActivities());
		}

		return inErrorActivities;
	},
	/**
	 * Destroys collection
	 */
	destroyCollection : function() {
		this.destroyPatients();
		this.reset();
	},
	/**
	 * Destroys each patient in collection
	 */
	destroyPatients : function() {
		var patient;
		for(var i = this.length - 1; i >= 0; i--) {
			patient = this.models[i];
			patient.destroyPatient();
		}
	}
});

/**
 * Collection of ActivityModel
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,ActivityModel
 */
var ActivityCollection = Backbone.Collection.extend({

	/**
	 * ActivityCollection Model
	 */
	model:ActivityModel,

	/**
	 * Initializes Collection
	 */
	initialize: function() {
		_.bindAll(this);
	},

	/**
	 * Finds newest ActivityModel within time interval
	 * @param {Date} start Beginning of interval
	 * @param {Date} end End of interval
	 * @returns {ActivityModel} newest within time interval
	 */
	newestInRange: function(start,end,beginningIndex) {
		if(this.models.length===0) {
			return null;
		}
		var latestDate = this.models[0].getEventDt();
		var earliestDate = this.models[this.length-1].getEventDt();
		latestDate.setSeconds(0,0);
		earliestDate.setSeconds(0,0);
		var activities = [];

		if(end < earliestDate || start > latestDate){
			return null;
		}
		var theseModels = this.models;
		var modelLength = theseModels.length;
		var idx = 0;
		for(idx = beginningIndex; idx < modelLength; idx++){
			var date = theseModels[idx].getEventDt();
			date.setSeconds(0,0);
			if(( date >= start ) && (date <= end)){
				activities.push(theseModels[idx]);
			}
			if(theseModels[idx].get("LIST")[0].TYPE == "" && date <= start){
				break;
			}
		}

		//get newest date from those within range
		return [_.max(activities, function(activity) {
			var date = activity.getEventDt();
			date.setSeconds(0);
			return date.valueOf();
		}), idx ];
	},

	/**
	 * Gets all Activities that have not been saved to Millennium
	 * @returns {Array} ActivityModel array
	 */
	getUnsavedActivities:function(){
		return this.select(function(activity){
			return activity.get("STATUS").toUpperCase() == "DRAFT";
		});
	},

	/**
	 * Gets all Activities that will be uncharted in Millennium
	 * @returns {Array} ActivityModel array
	 */
	getInErrorActivities:function(){
		return this.select(function(activity){
			return activity.get("STATUS").toUpperCase() == "INERROR";
		});
	}

});

/**
 * Patient Lists View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used:
						"PatientListsHandlebar".

 */
var PatientListsView = Backbone.View.extend({

	/**
	 * Handlebars template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_PatientListsSelect.handlebar.html"),

	/**
	 * Event handlers
	 */
	events: {
		"click #ptpopSubmit":"setSelectedList",
		"click #nuLink":"setSelectedFacility",
		"change #ptlist":"ptlistChange",
		"change #falist":"fulistChange",
		"click #ptpopReset":"resetPatientList"
	},

	/**
	 * Initializes view.  Renders on PatientListsModel's "change:ptlists" event
	 */
	initialize: function() {
		_.bindAll(this);
		this.model.bind("change:ptlists", this.render);
		this.model.bind("change:selected", this.displaySelected);
		this.model.bind("select:fulist", this.fulistChange);
		this.model.bind("select:ptlist", this.ptlistChange);
		this.model.bind("destroy",this.remove);
		this.render();

	},

	/**
	 * Render View HTML
	 * @returns {PatientListsView} this view
	 */
	render: function() {
		var that = this,
				view = {
					PTLIST : this.model.getLists(),
					FUQUAL: this.model.getFacilities()
				};
		$(this.el).html(this.template(view));
		$(this.el).i18n();
		return this;
	},

	/**
	 * callback function for setting patient list.
	 */
	setSelectedList: function() {
		this.select = $(".patient-lists-select",this.el)[0];
		var opt = this.select.options[this.select.selectedIndex].value;
		if(!opt||opt===""){
			alert($.i18n.translate("PatientListsHandlebar.PLEASE_SELECT_A_VALID_PATIENT_LIST"));
		}
		else{
			this.option = parseInt(opt);
			this.model.setSelectedList(this.option);
			this.select = $(".time-range-select")[0];
			this.select.selectedIndex = 0;

		}
	},

	/**
	 * callback function for setting facility list
	 */
	setSelectedFacility:function(){
		var nu  = this.model.getSelectedFacility($("#falist option:selected").attr("value"));
		if(nu===undefined){
			alert($.i18n.t("PatientListsHandlebar.PLEASE_SELECT_A_VALID_FACILITY"));

		}
		else{
			var nurseUnitDialog = NurseUnitDialogViewSingleton.createNurseUnitDialogView(nu, this);
			nurseUnitDialog.open(false);
		}
	},

	/**
	 * Keeps selected list choice up to date with the model
	 */
	displaySelected : function(){
		if(this.model.get("selectedList") !== undefined)
		{
		var selectedListId = this.model.get("selectedList").LISTID,
				select = $(".patient-lists-select",this.el)[0];

		for(var i = 0,l = select.options.length;i<l;i++){
			if(select.options[i].value == selectedListId){
				select.selectedIndex = i;
			}
		}
		}

		$("#ptpopMessage").remove();
	},

	//reset text of nurse unit link
	resetNurseUnitText:function(){
		$("#nuLink").text($.i18n.t("PatientListsHandlebar.NURSE_UNITS"));
		$("#nuLink").attr("title", $.i18n.t("PatientListsHandlebar.CLICK_TO_OPEN_NURSE_UNITS"));
	},

	//patient list select change
	ptlistChange:function(){
		this.$("#falist").attr("disabled", true);
		this.$("#nuLink").attr("disabled", true);
		this.$("#ptpopSubmit").attr("disabled", false);
		this.$("#falist").attr("selectedIndex", -1);
		this.resetNurseUnitText();
	},

	//fu list select change
	fulistChange:function(){
		this.$("#ptlist").attr("disabled", true);
		this.$("#ptlist").attr("selectedIndex", -1);
	},

	//reset patient list view
	resetPatientList:function(){
		location.reload();
	},

	//Disables all interaction within the view
	disable : function(){
		$(this.el).attr("disabled", true);

	},

	//Enables all interaction within the view
	enable : function(){
		$(this.el).attr("disabled", false);
	}

});

/**
 * Time Interval Select View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used:
						"TimeIntervalSelectHandlebar".

 */
var TimeIntervalSelectView = Backbone.View.extend({

	/**
	 * Handlebars template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_TimeIntervalSelect.handlebar.html"),

	/**
	 * Event Handlers
	 */
	events:{
		"change .time-interval-select":"setTimeInterval"
	},

	/**
	 * Initialize View.  Renders View on TimeIntervalSelectModel's "change" event.
	 */
	initialize:function() {
		_.bindAll(this);

		this.model.bind("change:timeIntervalOptions", this.render);
		this.model.bind("change:timeIntervals",this.displaySelected);
		//disable view whenever ccl is being queried
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);

		this.render();
		//initially disable
		this.disable();
	},

	/**
	 * Render View HTML
	 * @returns {TimeIntervalSelectView} this view
	 */
	render:function(){
		var view = {INTERVALS : this.model.getTimeIntervalOptions()};
		$(this.el).html(this.template(view));
		$(this.el).i18n();
		for(var i=0; i< this.model.getTimeIntervalOptions().length; i++){
			var option = $(".time-interval-select option")[i];
			if(option.value>60){
				option.text=(option.value/60).toString()+ $.i18n.t("TimeIntervalSelectHandlebar.HOURS");
			}
			else if(option.value==60){
				option.text=(option.value/60).toString()+ $.i18n.t("TimeIntervalSelectHandlebar.HOUR");
			}
			else{
				option.text=option.value.toString()+ $.i18n.t("TimeIntervalSelectHandlebar.MIN");
			}
		}
		return this;
	},

	/**
	 * Callback function for setting time interval.
	 */
	setTimeInterval:function(){
		if(_.isEmpty(this.model)){
			return false;
		}
		var timeIntervalChange = MP_Util.CreateTimer("ENG:MPG.BH_SA_TIME_INTERVAL_CHANGE",Criterion.project_name);
		if(timeIntervalChange){
				timeIntervalChange.Start();
		}
		this.select = this.$(".time-interval-select",this.el)[0];
		this.option = parseInt(this.select.options[this.select.selectedIndex].value);
		this.model.createTimeIntervals(this.option);
		if(timeIntervalChange){
			timeIntervalChange.Stop();
		}
	},

	/**
	 * Keeps selected list choice up to date with the model
	 */
	displaySelected : function(){
		var selectedInterval = this.model.selectedInterval;
		var select = this.$(".time-interval-select",this.el)[0];
		for(var i = 0,l = select.options.length;i<l;i++){
			if(select.options[i].value == selectedInterval){
				select.selectedIndex = i;
			}
		}
	},

	//Disables all interaction within the view
	disable : function(){
		this.$('select').attr("disabled",true);
		this.$('button').attr("disabled",true);
	},

	//Enables all interaction within the view
	enable : function(){
		this.$('select').attr("disabled",false);
		this.$('button').attr("disabled",false);
	},

	/**
	 * Remove View from DOM
	 */
	remove: function() {
		$(this.el).empty().remove();
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);
	}


});

/**
 * View for Table Header of Dashboard
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache

 * File "translation.safety.json"
					Namespaces used:
						"DashboardHeaderHandlebar"

 */
var DashboardHeaderView = Backbone.View.extend({

	tagName:"thead",

	/**
	 * CSS class name
	 */
	className:"patient-dashboard-header",

	/**
	 * Handlebar template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_DashboardHeader.handlebar.html"),
	/**
	 * Event handlers
	 */
	events:{
		"click .location-sort":"sortByLocation",
		"click .patient-sort":"sortByPatient",
		//"click .suicide-sort":"sortBySuicide",
		//"click .fall-sort":"sortByFall",
		"click .select-header" :"selectAll",
	     "change #pclist": "comboTRy",
		"mouseover .select-header" : "enterSelectAll",
		"mouseout .select-header" : "leaveSelectAll"
	},

	/**
	 * Initializes View.  Renders on "change:timeIntervals".
	 */
	initialize:function(){
		_.bindAll(this,"render");
		this.model.bind("change:timeIntervals",this.render);
		this.render();
	},

	/**
	 * Renders View HTML
	 * @returns {DashboardHeaderView} this view
	 */
	render:function(){
		var url = $(".patient-sort").attr("src");
		var timeIntervals = this.model.timeIntervals;
		var context = {
			intervals:this.model.timeIntervals
		};
		$(this.el).html(this.template(context));
		$(this.el).i18n();
		$(".patient-sort").attr("src", url);

       this.model.BhInfoModel.getprecautions();

		return this;
	},
	/**
	 * Callback function for sorting patients by location
	 */
	sortByLocation:function(){
		this.model.sortPatientsByLocation();
		var e= document.getElementById("pclist");
		e.selectedIndex = 0;
	},
	/**
	 * Callback function for sorting patients by name
	 */
	sortByPatient:function(){
		this.model.sortPatientsByName();
		var e= document.getElementById("pclist");
		e.selectedIndex = 0;
	},

	/**
	 * Callback function for sorting patients by suicide risk
	 */
	sortBySuicide:function(){
		this.model.sortPatientsBySuicideRisk();
	},

	/**
	   comboTRy
	*/
	comboTRy:function(){
		var e= document.getElementById("pclist");

		if(e.selectedIndex != 0)
		   this.model.sortPatientsByRisk(e.options[e.selectedIndex].innerText);
        else
		{
			this.model.sortPatientsByPatientSeq();
		}
	},



	/**
	 * Callback function for sorting patients by fall risk
	 */
	// sortByFall:function(){
		// this.model.sortPatientsByFallRisk();
	// },

	selectAll : function(){
		var selectAll = MP_Util.CreateTimer("USR:MPG.BH_SA_MULTI_SELECT_PATIENTS", Criterion.project_name + " SelectAll Patients");
		if(selectAll){
			selectAll.Start();
		}
		var multiSelectModel = this.model.MultiSelectModel;
		if(multiSelectModel.get("selectedPatient").length){
			multiSelectModel.clean();
		}
		else{
			var patientList = [];
			_.each(this.model.models, function(patient){
				if(!patient.userPrefModel.get("offunitstatus").isoffunit){
					patientList.push(patient);
				}
			});
			multiSelectModel.set({selectedPatient: patientList});
		}
		if(selectAll){
			selectAll.Stop();
		}
	},

	enterSelectAll : function(){
		$(".multi-select-wraper").addClass("hover");
		$(".multi-select-wraper.off-unit").removeClass("hover");
		$(".multi-select-wraper.selected").removeClass("hover");
	},

	leaveSelectAll : function(){
		$(".multi-select-wraper").removeClass("hover");
	}
});

/**
 * Dashboard View is the main view for a patient list
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used:
						"NewPatientHandlebar".
 */
var DashboardView = Backbone.View.extend({

	tagName : "table",

	/**
	 * CSS class name
	 */
	className : "patient-dashboard",

	tbody : $("<tbody></tbody"),

	template : TemplateLoader.compileFromFile(template_static_path + "templates/_NewPatient.handlebar.html"),

	patientViews : [],

	events:{
		"click .new-patient" : "addNewPatient",
		"click #rpid" : "remainingPatients"

	},
	/**
	 * Initializes View.  Renders on Collection "add" and "sort" events.
	 */
	initialize : function() {
		_.bindAll(this);
		this.collection = this.options.collection;
		this.collection.bind("finished-loading",this.render);
		this.collection.bind("finished-loading-newbatch",this.attachnewbatchPatientViews);
		this.collection.bind("sort", this._render);

		this.thead = new DashboardHeaderView({
			model : this.collection
		});

	},

	/**
	 * Render View HTML
	 * @returns {DashboardView} this view
	 */
	render : function() {
		var $el = $(this.el);
		$el.find("tbody").detach();
		$el.find("tfoot").detach();
		//detach elements for re-insertion
		$el.find("thead").detach();
		$el.append(this.thead.el);
		this._render();
		this.collection.BhInfoModel.getprecautions();
		

		this.attachAddedPatientViews();

		if(this.collection.BhInfoModel.get("APP_PREF").SELECT_ALL === 0)
		{
			 $('.select-header').hide();
			 $('.new-patient').attr('colspan',3);
		}

             var $el;
		  $('html, body').height($(window).height());
		  $('html, body').width($(window).width());

		  $el = $('#main-header');
		  var cal5height =  $('#main-header').height();
		  var prevheight = $el.parent().height();
		  $el = $('#patient-dashboard-wrap');

		 $el.height(prevheight-cal5height);

		return this;
	},

	_render : function(){
		var $el = $(this.el);
        var patients = this.collection.models;
		//detach any patient views
		for(var i = 0,l = patients.length;i<l;i++){
			if(patients[i].view){
				$(patients[i].view.el).detach();
			}
		}
		$el.find("tfoot").detach();
		$el.append(this.tbody);
		this.attachPatientViews();
		$el.cellspacing = 0;
		$el.append(this.template({}));

		$el.find(".new-patient").i18n();//splitting i18n()
		$el.find(".remaining-patient").i18n();


		if(this.collection.totalPatientsCount >  patients.length)
		{
			$('#rpid').show();
		}
		else{$('#rpid').attr("disabled",true);;}

		_g('json-loader-message').innerHTML = "";
	    _g('json-activity-loader-message').innerHTML = "";

		return this;
	},

	/**
	 * Attach Patient Views to Dashboard View
	 */
	attachPatientViews : function() {
		var tbody = this.tbody,
				thatCollection = this.collection,
				i = 1,
				patients = this.collection.models;

		for(var i = 0,l = patients.length;i<l;i++){
			if(!patients[i].view) {
				var patientView = new PatientView({
					model : patients[i],
					collection : thatCollection
				});
			}
			tbody.append(patients[i].view.el);
		}
	},
	/**
	 * Attach Patient Views to Dashboard View
	 */
	attachnewbatchPatientViews : function() {
		this.collection.BhInfoModel.getprecautions();
		var tbody = this.tbody,
				thatCollection = this.collection,
				i = 1,
				patients = this.collection.models;

		for(var i = 0,l = patients.length;i<l;i++){
			if(!patients[i].view) {
				var patientView = new PatientView({
					model : patients[i],
					collection : thatCollection
				});
			}
			tbody.append(patients[i].view.el);
		}
		if(this.collection.totalPatientsCount >  patients.length)
		{
		  $('#rpid').show();
		}
		else{$('#rpid').attr("disabled",true);}
	},

	attachAddedPatientViews : function(){
		var addedPatients = WindowStorage.get("AddedPatients");

		if(addedPatients!=="undefined"){
			try{
				addedPatients = jQuery.parseJSON(addedPatients);
				var that = this;

				var foundPtlist = _.detect(addedPatients, function(ptlist){
					// console.log("ptlist.selectedList");
					// console.log(ptlist.selectedList);
					// console.log('ptListModel.get("selectedList")');
					// console.log(ptListModel.get("selectedList"));
					return _.isEqual(ptlist.selectedList, that.collection.patientListsModel.get("selectedList"));
				});

				if(foundPtlist !== undefined && foundPtlist.addedPatients.length > 0){
					var jsonObj = {
						"pt_cnt" : foundPtlist.addedPatients.length,
						"page_cnt" : 0,
						"patients" : []
					};

					_.each(foundPtlist.addedPatients, function(patient){
						var ptObj = {
							"PAGENUM": 1,
							"PTQUALIND": 0,
							"PT_ID": patient.person_id,
							"ENCNTR_ID": patient.encntr_id,
							"ENCNTR_TYPECD": patient.encntr_type_cd,
							"NAME": patient.name,
							"FIN": patient.fin,
							"MRN": patient.mrn,
							"AGE": patient.age,
							"BIRTH_DT": patient.birth_dt,
							"BIRTHDTJS": patient.birth_dt_js,
							"GENDER": patient.gender,
							"ORG_ID": patient.org_id,
							"FACILITY": patient.facility,
							"FACILITYCD": patient.facility_cd,
							"NURSE_UNIT": patient.nurse_unit,
							"NURSE_UNITCD": patient.nurse_unit_cd,
							"ROOM": patient.room,
							"BED": patient.bed,
							"LOS": patient.length_of_stay,
							"ADMIT_DT": patient.admit_dt,
							"ADMITDTJS": patient.admit_dt_js
						};
						jsonObj.patients.push(ptObj);
					});
					// console.log(jsonObj);
					var newPtModel = new NewPatientModel(jsonObj);
					newPtModel.patients = this.collection;

					newPtModel.getBhInfo(newPtModel.mode.SKIP_DUPLICATE_PATIENT_ALERT);

				}
			}
			catch(err){
				alert(err.message + "in attachAddedPatientViews");
			}
		}

	},

	addNewPatient : function(){
		var newPatientDialog = NewPatientDialogViewSingleton.createNewPatientDialogView(this.collection);
		newPatientDialog.open();
	},

	//load remaining patients
	remainingPatients: function()
	{
		this.collection.getNewBatchDetails();
	}
});

/**
 * Patient View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache,ActivityModel,ActivityView

 * File "translation.safety.json"
					Namespaces used:
						"LocationAndImageHandlebar",
						"PatientInfoHandlebar",
						"Charting".
 */
var PatientView = Backbone.View.extend({

	/**
	 * HTML Tag
	 */
	tagName : "tr",

	/**
	 * CSS class name
	 */
	className : "patient-row",

	/**
	 * Array of time intervals
	 */
	timeIntervals : [],

	/**
	 * Array of ActivityView(s)
	 */
	activityViews : [],

	/**
	 * Handlebar template for rendering html
	 */
	locationAndImgTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_LocationAndImage.handlebar.html"),
	/**
	 * multi select view
	 */
	selectView : null,
	/**
	 * image column view
	 */
	imageView : null,

	/**
	 * Handlebar template for rendering html
	 */
	selectTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_MultiSelect.handlebar.html"),

	/**
	 * Handlebar template for rendering html
	 */
	basicInfoTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_PatientInfo.handlebar.html"),

	/**
	 * Basic Info Column View
	 */
	basicInfoView : null,

	/**
	 * Handlebar template for rendering html
	 */
	riskTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_PatientRisk.handlebar.html"),

	/**
	 * Risk column view
	 */
	riskView : null,

	/**
	 * Event handlers
	 */
	events:{
		"click .activity-view-new" : "newActivityView",
		"change .offUCheck" : "unCheckOffU",
		"click .patient-select" : "selectActivity",
		"click .addedRemove" : "removeAddedPatient"
	},

	/**
	 * Initialize View.  Creates subviews.  Renders on PatientCollection's "change:timeInterval" event.
	 */
	initialize : function() {
		_.bindAll(this);

		this.collection.bind("change:timeIntervals", this.render);
		this.model.bind("change:image_data",this.renderImageView);
		this.model.userPrefModel.bind("change:offunitstatus", this.reRender);
		this.model.bind("changePatientActivities",this.render);
		this.collection.MultiSelectModel.bind("change", this.reRenderSelect);

		this.registerHandlebarPartials();

		var bhinfo = this.collection.BhInfoModel.get("APP_PREF");
		if(bhinfo.SELECT_ALL === 1)
		{
		     this.selectView = this.createSelectView();
		}
		else
		{
			 $('.select-header').hide();
             $('.new-patient').attr('colspan',3);
		}
		this.imageView = this.createImageView();
		this.basicInfoView = this.createBasicInfoView();
		this.riskView = this.createRiskView();

		//one-to-one model-view relationship
		this.model.view = this;

		this.model.bind("destroy",this.removeView,this);

		this.render();
	},

	/**
	 * Render View HTML
	 * @returns {PatientRiskView} this view
	 */
	render : function() {
		var $el = $(this.el);

		//remove all cells from row
		this.$("td").detach();
		//attach each patient info table cell to main view
		var bhinfo = this.collection.BhInfoModel.get("APP_PREF");
		if(bhinfo.SELECT_ALL === 1){
		   $el.append(this.selectView);
	    }else
		{
			 $('.select-header').hide();
             $('.new-patient').attr('colspan',3);
		}
		$el.append(this.imageView);
		$el.append(this.basicInfoView);
		$el.append(this.riskView);

		//add activities to time interval slots
		if(!_.isEmpty(this.collection.timeIntervals)) {
			this.createActivityViews();
			this.attachActivityViews();
		}
		if(this.model.userPrefModel.get("offunitstatus").isoffunit){
			$el.find("[class^=activity-view]").attr("disabled", true);
			$el.find("[class^=patient-select]").attr("disabled", true);
			this.reRenderSelect();

		}
		else{
			$el.find("[class^=activity-view]").attr("disabled", false);
			$el.find("[class^=patient-select]").attr("disabled", false);
			this.reRenderSelect();
			this.disableOffunitCells();

		}
		return this;
	},

	reRender : function(){
		var $el = $(this.el);
		this.imageView = this.createImageView();
		this.$(".patient-image").replaceWith(this.imageView);
		if(this.model.userPrefModel.get("offunitstatus").isoffunit){
			$el.find("[class^=activity-view]").attr("disabled", true);
			$el.find("[class^=patient-select]").attr("disabled", true);
			this.reRenderSelect();

		}
		else{
			$el.find("[class^=activity-view]").attr("disabled", false);
			$el.find("[class^=patient-select]").attr("disabled", false);
			this.reRenderSelect();
			this.disableOffunitCells();

		}
	},

	disableOffunitCells : function(){
		var pateintOffUnitInterval = false;
		 var $el = null;
		 try{
			//disable offunit events cells and in between empty cells
			if( this.model.activities != undefined && this.model.activities.length > 0){
				var bhinfo = this.collection.BhInfoModel.get("APP_PREF");
				var fixedColumnCount = 4;
				if(bhinfo.SELECT_ALL === 0){
					fixedColumnCount = 3;
				}
			for(var i = 0; i < this.activityViews.length;  i++) {


				if(this.activityViews[i] != null && this.activityViews[i].model.attributes.LIST[0].OFFUNITIND !== "" && this.activityViews[i].model.attributes.LIST[0].OFFUNITIND != "0") {
					 pateintOffUnitInterval = true;
				}
				else if(this.activityViews[i] != null && this.activityViews[i].model.attributes.LIST[0].OFFUNITIND === "0") {
					 pateintOffUnitInterval = false;
				}

				if( pateintOffUnitInterval ){

                    if( this.activityViews[i] != null){
					  $el = $(this.activityViews[i].el);
					}else
					{
					 $el = $(this.el.cells[i+fixedColumnCount]);
					}

					if($el !== null){
					    $el.find("[class^=activity-view]").attr("disabled", true);
					    $el.attr("disabled", true);
					}
			    }

				if(this.activityViews[i] != null && this.activityViews[i].model.attributes.LIST[0].OFFUNITIND === "1") {
					 pateintOffUnitInterval = false;
				}
		    }
		 }

		 }
		 catch(e)
		 {
			log.info(e.message + "in disableoffunitcells");
		 }

	},

	reRenderSelect : function(){
		var bhinfo = this.collection.BhInfoModel.get("APP_PREF");
		if(bhinfo.SELECT_ALL === 1){
		var $el = $(this.el);
		this.selectView = this.createSelectView();
		this.$(".multi-select").replaceWith(this.selectView);
		}else
		{
			 $('.select-header').hide();
             $('.new-patient').attr('colspan',3);
		}
	},

	/**
	 * Register Handlebar Partials for view
	 */
	registerHandlebarPartials : function(){
		var that = this;
		Handlebars.registerPartial('fallRisk',that.fallRiskTemplate());
		Handlebars.registerPartial('suicideRisk',that.suicideRiskTemplate());
		Handlebars.registerPartial('suicideImg',that.suicideImgTemplate());
		Handlebars.registerPartial('noRisk',that.noRiskTemplate());
	},

	/**
	 * creates multi select view
	 */
	 createSelectView : function(){
		var el = $("<td class='multi-select'></td>"),
				that = this,
				model = this.model,
				userPrefModel = this.model.userPrefModel,
				view;
		var isSelected = _.some(this.collection.MultiSelectModel.get("selectedPatient"), function(patient){
			if(!patient.userPrefModel.get("offunitstatus").isoffunit)
				return patient.get("person_id") === that.model.get("person_id");
			});

		view = {
			selected : isSelected,
			isAdded : model.get("isAdded")===undefined?false:true,
			isoffunit : userPrefModel.get("offunitstatus").isoffunit
		};

		$(el).html(this.selectTemplate(view));
		$(el).i18n();
		return el;
	 },

	/**
	 *constructs patient image view
	 */
	constructImageView : function(){
		var that = this,
				model = this.model,
				el = $("<td class='patient-image'></td>"),
				userPrefModel = this.model.userPrefModel,
				offunitstartdt = (userPrefModel.get("offunitstatus").offunitstartdt === undefined || userPrefModel.get("offunitstatus").offunitstartdt == "") ? "" : df.format(userPrefModel.get("offunitstatus").offunitstartdt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_MMM_4YEAR),
				view;
				if(offunitstartdt.length > 4)
				   offunitstartdt = offunitstartdt.substring(0, offunitstartdt.length-3);

				view = {
					src : that.getImageViewSrc(),
					nurse_unit : model.get("nurse_unit"),
					room: model.get("room"),
					bed: model.get("bed"),
					isoffunit : userPrefModel.get("offunitstatus").isoffunit,
					offunitdisp : userPrefModel.get("offunitstatus").nomdisp,

					offunitstartdt : offunitstartdt,
					isAdded : model.get("isAdded")===undefined?false:true
				};
		if(model.get("room")!="")
			view.room = "/ "+view.room;
		if(model.get("bed")!="")
			view.bed = "/ "+view.bed;
		$(el).html(this.locationAndImgTemplate(view));
		$(el).i18n();

		return el;
	},

	/**
	 * creates patient image view
	 */
	createImageView : function(){
		return this.constructImageView();
	},

	/**
	 * Render image view and replace old view with new view
	 */
	renderImageView : function(){
		var el = this.constructImageView();
		$(this.imageView).replaceWith(el);
		this.imageView = el;
		return el;
	},

	/**
	 * Get image source using 64-bit jpeg data string
	 * @return {String} image src
	 */
	getImageViewSrc : function(){
		//return patient image if available, if not, return default image
		return this.model.get("image_data");
	},

	/**
	 * creates basic patient info view
	 * @return {Node} basic info view element
	 */
	createBasicInfoView : function(){
		var bhinfo = this.collection.BhInfoModel.get("APP_PREF");
		var el = $("<td class='patient-basic-info'></td>");
		var model = this.model;
		var birth_dt_js = model.get("birth_dt_js");
		birth_dt_js = birth_dt_js.length > 1 ?
								birth_dt_js.substring(0, 6) + birth_dt_js.substring(8, 10)
								: birth_dt_js;

		var obsLevelInfo = model.get("observation_level");
			if(obsLevelInfo == "")
				obsLevelInfo =	bhinfo.DEFAULTOBSERVLVL;
			if(obsLevelInfo == "")
				obsLevelInfo =	"--";

	var partials = {
			tabName:bhinfo.PCTABNM.length ? " /FIRSTTAB=^" + bhinfo.PCTABNM + "^" : "",
			gender:model.get("gender_display"),
			age:model.get("age_display"),
			birth_dt_js:birth_dt_js,
			observation_level:obsLevelInfo,
			general_comment:model.get("general_comment").length?model.get("general_comment"):"--"
		};

		var context = model.toJSON();
		jQuery.extend(context,partials);
		$(el).html(this.basicInfoTemplate(context));
		$(el).i18n();
		return el;
	},

	/**
	 * creates risk view
	 */
	createRiskView : function(){
		var el = $("<td class='patient-risk'></td>");
		$(el).html(this.riskTemplate(this.model.toJSON()));
		return el;
	},

	/**
	 * Generate Fall Risk Partial for template
	 */
	fallRiskTemplate:function(){
		try{
		var precautions = this.model.get("precautions")
		var riskInfo = "";
		if(precautions !== undefined){
			if(precautions.length > 0){
				for(var i = 0; i < precautions.length ; i++){
					if(precautions[i].VALUE != ""){
						if(precautions[i].ICON != "")	{
							if( precautions[i].ICON == "Alert")
							{
							   riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.ALERT-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Assault Precaution")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.ASSAULT-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Danger")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.DANGER-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Elopement Risk")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.ELOPEMENT-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Fall Risk")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.FALL-RISK-ICON") + "'>";
							}
							else if( precautions[i].ICON == "High Risk")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.HIGH-RISK-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Medium Risk")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.MEDIUM-RISK-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Restraints")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.RESTRAINTS-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Seizure Risk")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.SEIZURE-ICON") + "'>";
							}
							else if( precautions[i].ICON == "Suicide Risk")
							{
								riskInfo = riskInfo +  "<div><img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.SUICIDE-ICON") + "'>";
							}
						}
						else
						{
							riskInfo = riskInfo +  "<div>";
						}


						riskInfo = riskInfo + "<span class='field'>" ;

						if(precautions[i].FLAG !== 200){
						riskInfo = riskInfo +  precautions[i].LABEL ;
						riskInfo = riskInfo + ": ";
						}
						riskInfo = riskInfo + precautions[i].VALUE + "</span></div>";
					}

				}

			}

		  }

		  if(riskInfo =="")
			  return "<p class='field'>--</p>";
           else
              return riskInfo;
		}catch(e){alert(e.message + "in fallrisktempalte");}
	},

	/**
	 * Generate Suicide Risk Partial for template
	 */
	suicideRiskTemplate:function(){

			return "";

	},

	/**
	 * Generate Suicide Image partial for template
	 */
	suicideImgTemplate:function(){
		var suicide_risk = this.model.get("suicide_risk_disp");
		if(suicide_risk === "2"){
			return "<img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.HIGH-RISK-ICON") + "'>";//leftout
		}
		else if(suicide_risk === "1"){
			return "<img class='medium-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.MEDIUM-RISK-ICON") + "'>";
		}
		else{
			return "";
		}
	},

	/**
	 * Generate No Risk partial for template
	 */
	noRiskTemplate:function(){

			return "";

	},

	/**
	 * Creates ActivityView(s). Should only be called on initialization and if time intervals change.
	 */
	createActivityViews : function() {
		var returnAr = [];
		var activity = {},
				start,
				end;
		var index = 0;
		this.activityViews = [];
		this.timeIntervals = this.collection.timeIntervals;
		var timeIntervals = this.timeIntervals;
		for(var i = 0, l = timeIntervals.length; i < l; i++) {
			start = timeIntervals[i].startDate;
			end = timeIntervals[i].endDate;

			returnAr = this.model.activities.newestInRange(start, end, index);
			if(returnAr){
				activity = returnAr[0];
				index = returnAr[1];
			}
			else{
				activity = null;
			}
			//most recent time and no activity
			if(i === 0 && _.isEmpty(activity)) {
				this.activityViews.push(null);
			}
			else {
				//no activity
				if(_.isEmpty(activity)) {
					this.activityViews.push(null);
				}
				//view already exists for model
				else if(activity.view){
					this.activityViews[this.activityViews.length] = activity.view;
				}
				//create new view for model
				else {
					var activityView = new ActivityView({
						model : activity,
						modifiable : false,
						patient : this.model
					});
					this.activityViews.push(activityView);
				}
			}
		}

		//link previous activity to each activity
		for(i = 0, l = this.activityViews.length; i < l; i++) {
			if(this.activityViews[i] !== null && i + 1 < l) {
				this.activityViews[i].previousActivityView = this.activityViews[i + 1];
			}
		}
	},

	activityViewExistsForModel : function(activityModel){
		return _.any(this.activityViews,function(activityView){
			return activityView.model.cid == activityModel.cid;
		});
	},

	/**
	 * Attach all ActivityView(s) to PatientView.
	 */
	attachActivityViews : function() {
		//grab each activity node and attach it patient node
		for(var i = 0, l = this.activityViews.length; i < l; i++) {
			if(this.activityViews[i] == null) {
				var html = "<td class='activity-view-new'><div class='activity-view-wrap-new' id=\""+i+"\"> " + $.i18n.t("Charting.CLICK_TO_ADD") + "</div></td>"

				$(html).appendTo(this.el);
			}
			else {
				$(this.activityViews[i].el).appendTo(this.el);
			}
		}
	},

	/**
	 * create and attach acitivtyview and model
	 */
	newActivityView : function(event){
		try{
		var index;
		//if clicked area is td, get the id if its child div
		if(event.target.nodeName=="TD")
			index = parseInt(event.target.firstChild.id);
		//else if clicked area is the div, get its id directly
		else
			index = parseInt(event.target.id);
		//initialize the model and view
		var model = this.model, activityModel = new ActivityModel, activityView;
		//set up model properties
		activityModel.patient = model;
		var timeIntervals = this.collection.timeIntervals;
		activityModel.set({
			"STARTDT" : timeIntervals[index].startDate,
			"ENDDT" : timeIntervals[index].endDate
		});
		//add activityModel to activities list

		model.activities.add(activityModel);

		//set up view properties
		activityView = new ActivityView({
			modifiable : true,
			model : activityModel,
			patient : model
		});

		this.activityViews[index]=activityView;
		// // if select all is hidden
		// //replace the null activityView with the new activityView
		//if(this.collection.BhInfoModel.get("APP_PREF").SELECT_ALL === 0)
        if(this.el.cells[0].className === "patient-image")
		{
		//replace the DOM element of the table cell with new acitivtyView's DOM
		this.el.replaceChild(activityView.el, this.el.cells[index+3]);
		}
	    else{
		//replace the DOM element of the table cell with new acitivtyView's DOM
		this.el.replaceChild(activityView.el, this.el.cells[index+4]);
		}
		//set the previousActivityView if it is not null
		if(this.activityViews[index+1]!=null&&index+1<this.activityViews.length)
				this.activityViews[index].previousActivityView = this.activityViews[index + 1];
		//launch the dialog
		this.activityViews[index].launchDialog();
		}
		catch(e){alert(e.message + "newActivityView");}
	},

	unCheckOffU : function(event){
		var dateTimeDialog = DateTimeDialogViewSingleton.createDateTimeDialogView(this.model);
		dateTimeDialog.open(event.target);
	},

	selectActivity : function(event){
		var selectPatients =  MP_Util.CreateTimer("USR:MPG.BH_SA_MULTI_SELECT_PATIENTS",Criterion.project_name + " Select Patients");
		if(selectPatients){
			selectPatients.Start();
		}
		var $target = $(event.target);
		var that = this;
		if($target.hasClass("selected")){
			var list = _.filter(this.collection.MultiSelectModel.get("selectedPatient"), function(patient){
				return patient.get("person_id") !== that.model.get("person_id");
			});
			this.collection.MultiSelectModel.set({selectedPatient: list});
		}
		else{
			var list = this.collection.MultiSelectModel.get("selectedPatient");
			list.push(this.model);
			this.collection.MultiSelectModel.trigger("change");
		}
		if(selectPatients){
			selectPatients.Stop();
		}
	},

	removeAddedPatient : function(){
		var r = confirm($.i18n.t("LocationAndImageHandlebar.DO_YOU_WANT_TO_REMOVE") + this.model.get("name") + $.i18n.t("LocationAndImageHandlebar.FROM_THE_LIST"));//leftout
		if (r === true) {
			var that = this;
			// console.log(this.collection);
			// console.log(this.collection.patientListsModel.get("addedPatients"));
			this.collection.patientListsModel.set({
				addedPatients : _.without(that.collection.patientListsModel.get("addedPatients"), that.model)
				}
			);
			//console.log(this.collection.patientListsModel.get("addedPatients"));
			this.removeView();
			this.collection.remove(this.model, {
				silent : true
			});
			//console.log(this.collection);
			this.updateWindowStorage();
			return true;
		} else {
			return false;
		}
	},

	updateWindowStorage : function(){
		try{
			var that = this;
			var addedPatient = WindowStorage.get("AddedPatients");
			if(addedPatient!=="undefined"){
				addedPatient = jQuery.parseJSON(addedPatient);
				var ptListModel = this.collection.patientListsModel;
				// console.log("addedPatient");
				// console.log(addedPatient);
				var foundPtlist = _.detect(addedPatient, function(ptlist){
					// console.log("ptlist.selectedList");
					// console.log(ptlist.selectedList);
					// console.log('ptListModel');
					// console.log(ptListModel);
					return _.isEqual(ptlist.selectedList, ptListModel.get("selectedList"));
				});
				// console.log("foundPtlist");
				// console.log(foundPtlist);
				if(foundPtlist){
					addedPatient = _.without(addedPatient, foundPtlist);
					// console.log("_.without");
					// console.log(addedPatient);
					addedPatient.push(ptListModel);
					// console.log("push");
					// console.log(addedPatient);
					WindowStorage.set("AddedPatients", JSON.stringify(addedPatient));
				}
			}
			// console.log("finally");
			// console.log(jQuery.parseJSON(WindowStorage.get("AddedPatients")));
			// console.log("_________________________________________________");
			// console.log(WindowStorage.get("AddedPatients"));
		}
		catch(err){
			alert(err.message);
		}
	},
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function(){
		this.collection.unbind("change:timeIntervals", this.render);
		this.model.unbind("change:image_data",this.renderImageView);
		this.model.userPrefModel.unbind("change:offunitstatus", this.reRender);
		this.collection.MultiSelectModel.unbind("change", this.reRenderSelect);
		this.model.unbind("destroy",this.removeView,this);
		this.selectView = null;
		this.imageView = null;
		this.basicInfoView = null;
		this.riskView = null;
		this.activityViews = [];
		$(this.el).empty().remove();
	}

});

/**
 * Activity View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone, Underscore, jQuery, ActivityModel,PatientModel,Mustache
 */
var ActivityView = Backbone.View.extend({

	tagName:"td",

	/**
	 * CSS class name
	 */
	className : "activity-view active-activity-view",

	/**
	 * Handlebar template for rendering html
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_Activity.handlebar.html"),
	/**
	 * Event handlers
	 */
	events:{
		"click" : "launchDialog"
	},

	previousActivityView:null,

	/**
	 * Initializes View
	 */
	initialize:function(){
		_.bindAll(this);

		this.model.bind("change",this.render);
		//one-to-one relationship
		this.model.view = this;

		//determines whether or not model activity can be modified
		this.modifiable = this.options.modifiable ? this.options.modifiable : false;

		//PatientModel is a required param
		if(this.options.patient){
			this.patient = this.options.patient;
		}
		else{
			throw Error("Patient Model missing from ActivityView");
		}

		//destroy view if model is destroyed
		this.model.bind("destroy",this.removeView);

		this.render();
	},

	/**
	 * Renders View HTML
	 * @returns {ActivityView} this view
	 */
	render:function(){
		var that = this,
				$el = $(this.el),
				view = {
					activity:function(){
						var event_result = that.model.get("CNT");
						if(event_result){
							var result="";
							_.each(that.model.get("LIST"), function(event){
								result+=event.EVENT_RESULT+"; ";
							})
							result=result.slice(0, result.length-2);
							return result;
						}
						else if(!!that.modifiable){
							return $.i18n.t("Charting.CLICK_TO_ADD");
						}
						else{
							return "--";
						}
					}
				};

		$el.html(this.template(view));

		$el.removeClass();
		$el.addClass(this.className);
		var event_result = that.model.get("CNT");
		if(event_result)
		  $el.addClass(that.model.get("STATUS").toLowerCase() + "-status");


		var modifiability = !!this.modifiable ? "modifiable" : "not-modifiable";
		$el.addClass(modifiability);

		return this;
	},

	/**
	 * Launches ActivityDialogView for changing activity
	 */
	launchDialog:function(){
		try{

		var activityDialog = {};
		var selectedPatient = this.patient.collection.MultiSelectModel.get("selectedPatient");
		if(selectedPatient.length){
			activityDialog = ActivityDialogViewSingleton.createActivityDialogView(this.model,this.patient,this, true);
		}
		else{
			activityDialog = ActivityDialogViewSingleton.createActivityDialogView(this.model,this.patient,this, false);
		}
		activityDialog.open();

		}catch(e){alert(e.message + "in launchDialog");}
	},

	/**
	 * Remove view from DOM.
	 */
	removeView : function(){
		$(this.el).empty().remove();
		this.model.unbind("change",this.render);
		this.model.unbind("destroy",this.removeView);
		this.previousActivityView = null;
	}
});

/**
 * Activity Dialog View for add/changing patient activity
 *
 * @author Aaron Nordyke - AN015953
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,
 *           PatientModel,ActivityView,Mustache

 * File "translation.safety.json"
					Namespaces used:
						"ModifiableActivityDialogHandlebar",
						"SafetyAttendanceCommon",
*/
var ActivityDialogView = Backbone.View
		.extend({

			/**
			 * Handlebar template for rendering html
			 */
			modifiableTemplate : TemplateLoader
					.compileFromFile(template_static_path + "templates/_ModifiableActivityDialog.handlebar.html"),

			/**
			 * Handlebar template for rendering html
			 */
			nonModifiableTemplate : TemplateLoader
					.compileFromFile(template_static_path + "templates/_NonModifiableActivityDialog.handlebar.html"),

			/**
			 * ActivityView associated with ActivityDialogView
			 */
			activityView : {},

			/**
			 * is Multi Select Mode Indicator
			 */
			isMultiSelect : false,

			vals : [],

			/**
			 * is Tab Navigation enabled Indicator
			 */
			isTabNav : false,



			/**
			 * css class name
			 */
			className : "activity-dialog-view",

			/**
			 * Event delegators
			 */
			events : {
				'keyup .activity-freetext-input' : 'freetextActivityKeyPress',
				"click .last-activity-choice" : "changeToLastActivity",
				"click .unchart-activity" : "unchartActivity",
				"keyup .event_min" : "eventMinuteValidation",
				"click .selection" : "responseSelected",
				"keyup .selection" : "responseSelectedkeyup",
				"keydown .selection" : "responseSelectedkeyup",
				"click .unchart-event" : "unchartEvent",
				"change .offUCheck" : "toggleSubmit"
			},

			DOC_HEIGHT : document.body.offsetHeight,


			/**
			 * Initializes View. generates PatientModel and ActivityView if none
			 * supplied
			 *
			 * @example var activityViewDialog = new
			 *          ActivityView({model:PatientModel},{activityView:ActivityView});
			 */
			initialize : function() {
				_.bindAll(this);

				if (this.options.patient) {
					this.patient = this.options.patient;
				}
				if (this.options.activityView) {
					this.activityView = this.options.activityView;
				}
				this.render();
			},

			/**
			 * Renders html for view
			 *
			 * @returns {ActivityDialogView} this view
			 */
			render : function() {
				try{
				var that = this, $el = $(this.el);
				this.resetIsMultiSelect();
				!!this.activityView.modifiable ? this.renderModifiable() : this
						.renderNonModifiable();

				// create Activity Dialog UI
				$el.dialog({
					modal : true,
					autoOpen : false,
					minWidth : 800,
					title : "",
					buttons : [
        			{
			            text: $.i18n.t("SafetyAttendanceCommon.OK"),
			            className: 'submitButton',
			            disabled: true,
			            click: function() {
			            	that.submitActivity();
			            }
			        },
					{
            			text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
           				className: 'cancelButton',
           				click: function() {
           					$(this).dialog("close");
            			}
       				 }
					],
					open : function(event, ui) {
						var offset = $(that.activityView.el).offset();
						var title = "";
						//Clearing the previously drafted events for multi select issue
						that.initSelection();
						$(this).dialog("option", "position",
								[ offset.left, offset.top ]);
						if(that.isMultiSelect){
							_.each(that.patient.collection.MultiSelectModel.get("selectedPatient"), function(patient){
								title += patient.get("name")+"; ";
							});
							title = title.slice(0, title.length-2);
						}
						else{
							var gender = that.patient.get("gender_display");

							var age = that.patient.get("age_display");
							title = that.patient.get("name")+" =="+age.Count+" "+age.Unit+"==, "+gender;
						}
						$(this).dialog( "option", "title", title);
					}
				});
				//this.initSelection();
				return this;
      }catch(e){
        //alert(e.message + " in ActivityDialog render ");
      }
			},

			renderModifiable : function() {
				var that = this, $el = $(this.el);

				var location_activities =  this.patient.get("location_activities");
				_.each(location_activities, function(act, i){
					act.INDEX = i;
				});

				var dialogView = {
					location_activities : location_activities,
					modifyMessage : function() {
						var status = that.model.get("STATUS").toUpperCase();
						return status == "SAVED" || status == "DRAFT" ? $.i18n.t("ModifiableActivityDialogHandlebar.CHANGE_TO")
								: $.i18n.t("ModifiableActivityDialogHandlebar.ADD");
					},

					unchart : function() {
						return that.model.get("CNT") ?  $.i18n.t("ModifiableActivityDialogHandlebar.UNCHART_ALL")
								: "";
					},

					lastActivity : function() {
						return (that.activityView.previousActivityView != null && that.activityView.previousActivityView.model
								.get("CNT")) ? $.i18n.t("ModifiableActivityDialogHandlebar.USE_PREVIOUS_ACTIVITY")
								: "";
					},

					activityDate : that.model.get("EVENTDTDISP"),

					offUnit : that.patient.get("offunitevent").CECD !== 0 && that.model.get("STATUS")==="NONE",

					isNotMultiSelect : !that.isMultiSelect,

					nomlist : that.patient.get("offunitevent").NOMLIST
				};

				$el.html(this.modifiableTemplate(dialogView));
				$el.i18n();


				this.$('.activity-freetext-button').attr("disabled", true);
				this.$('.tabs').tabs();

				//get maxLength of selection
				var maxLength= Math.max.apply(null, this.$('.selection').map(function ()
				{
					return this.options.length;
				}).get());
				//adjust the size of the selection
				this.$('.selection').attr("size", function(){
					if(maxLength>10){
						if(maxLength<that.DOC_HEIGHT/27.2){
							return maxLength;
						}
						else{
							return that.DOC_HEIGHT/27.2;
						}
					}
				});
				this.setDateTimePicker();
			},

			renderNonModifiable : function() {
				var that = this, $el = $(this.el), array = (new Date())
						.toString().split(" "), timezone = array[4];
				var dialogView = {
					location_activities :that.model.get("CNT") ? that.patient.get("location_activities") :[],
					unchart : function() {
						return that.model.get("CNT") ?  $.i18n.t("ModifiableActivityDialogHandlebar.UNCHART_ALL")
								: "";
					},

					activityDate : that.model.get("EVENTDTDISP") + " "
							+ timezone
				};
				$(this.el).html(this.nonModifiableTemplate(dialogView));

				this.$('.tabs').tabs();
             },

             /**
             * Initialize the clinical event selection for status SAVED and DRAFT
             */
             initSelection : function(){
             	var that = this;
				that.vals = [];
             	if(this.model.get("STATUS")==="SAVED"){
             		_.each(this.model.get("LIST"), function(event){
             			if(event.NOMID.length){
	             			var divSelector = "#"+event.EVENT_CD;
	             			var $el = $(that.el);
	             			//nomen event
	             			if(event.NOMID.length>1||event.NOMID[0].NOMID!==0){
	             				var selector = divSelector+" .selection";
	             				var id=[];
	             				_.each(event.NOMID, function(nomenid){
	             					id.push(nomenid.NOMID);
	             				})
	             				$el.find(selector).val(id);
	             			    if($el.find(selector).attr("disabled")){
	             					$el.find(selector).find("option:selected").css("background-color", "#99cbff");
		             			}
	             			}
	             			//free text event
	             			else{
	             				var selector = divSelector+" .activity-freetext-input";
	             				var selector1 = divSelector+" .selection";
	             				$el.find(selector).val(event.FREETEXT);
	             				$el.find(selector1).attr("disabled", true);
	             			}
	             			$el.find(divSelector).find('.unchart-event').attr("disabled", false);
             			}
             		})
             	}
             	else if(this.model.get("STATUS")==="DRAFT"){
              		_.each(this.model.get("LIST"), function(event){
             			var divSelector = "#"+event.EVENT_CD;
             			var $el = $(that.el);
             			//nomen event
             			if(event.NOMID.length>0){
             				var selector = divSelector+" .selection";
             				var id = [];
             				$.each(event.NOMID, function(i, e){

									var str = e.NOMID;
									str = str.replace(".0", "")
									that.vals.push(str);
									id[i] = parseInt(str);

             				})

             				var $elSelection = $el.find(selector).val(id);
							/*var selectionLength = $elSelection[0].selectedOptions.length;
							for(var k = 0; k < selectionLength ; k++){
							  $elSelection[0].selectedOptions[k].setAttribute('selected', '');
							}*/
             			    if($el.find(selector).attr("disabled")){
             					$el.find(selector).find("option:selected").css("background-color", "#99cbff");
	             			}
             			}
             			//free text event
             			else{
             				var selector = divSelector+" .activity-freetext-input";
             				var selector1 = divSelector+" .selection";
             				$el.find(selector).val(event.FREETEXT);
             				$el.find(selector1).attr("disabled", true);
             			}
             			$el.find(divSelector).find('.unchart-event').attr("disabled", false);
             		})

                this.vals = that.vals;
             	}
             },

			/**
			 * Fill in date and time picker for past time frame
			 */
			setDateTimePicker : function() {
				var event_dt = this.$(".event_dt").get(0), event_tm = this.$(
						".event_tm").get(0), event_min = this.$(".event_min")
						.get(0),

				cur_dt = new Date(), start_dt = this.model.get("STARTDT"), end_dt = this.model
						.get("ENDDT"),

				curr_date = df.format(cur_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), curr_hr = DateFormatter
							.formatDate(cur_dt, "HH"), curr_min = DateFormatter
							.formatDate(cur_dt, "mm"), isCurrentTimeSlot = (cur_dt > start_dt)
							&& (cur_dt < end_dt),

				start_date = df.format(start_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), start_hr = DateFormatter
						.formatDate(start_dt, "HH"), start_min = DateFormatter
						.formatDate(start_dt, "mm"),

				end_date = df.format(end_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
						.formatDate(end_dt, "HH"), end_min = DateFormatter
						.formatDate(end_dt, "mm"), isExist = this.model
						.get("CNT") ? true : false;

				if (isExist) {
					var dt = this.model.get("EVENTDTDISP");
					var list = dt.split(" ");
					var date = list[0].split("-");
					var time = list[1].split(":");
					var month = DateFormatter.formatEventMonth(date[1]);
					prev_dt = month + "-" + date[0] + "-" + date[2] + " "
							+ time[0] + ":" + time[1];
					var prev_date = date[0];
					var prev_hr = time[0];
					var prev_min = time[1];
				}

				// date drop down
				event_dt.options[0] = new Option(start_date, start_date);
				if (start_date != end_date) {
					event_dt.options[1] = new Option(end_date, end_date);
					if (isExist) {
						prev_date == start_date ? event_dt.selectedIndex = 0
								: event_dt.selectedIndex = 1;
					} else {
						event_dt.selectedIndex = 1;
					}
				} else {
					event_dt.disabled = true;
				}


				event_dt.options[0] = new Option(start_date, start_date);
				if ((start_date != end_date) && !isCurrentTimeSlot) {
					event_dt.options[1] = new Option(end_date, end_date);
					if (isExist) {
						prev_date == start_date ? event_dt.selectedIndex = 0
								:event_dt.selectedIndex =1;
					}
					else {
						event_dt.selectedIndex = 1;
					}
				}

				else if((start_date != end_date) && isCurrentTimeSlot){
					event_dt.options[0] = new Option(curr_date, curr_date);
					event_dt.options[1] = new Option(end_date,end_date);
					if (isExist) {
						prev_date == start_date ? event_dt.selectedIndex = 0
								:event_dt.selectedIndex = 1;
					}
					else {
						event_dt.selectedIndex = 0;
					}

				}
			// For isExist check to chart already charted activities
				else {
					event_dt.disabled = true;
				}

				// hour drop down
				if (start_hr != end_hr) {
					var ind = -1, ind2 = 0, ind3 = 0;
					if (start_hr > end_hr) {
						for ( var i = 0, hr = start_hr; hr < 24; i++, hr++) {
							if (isExist) {
								ind3 = hr.toString() == prev_hr ? i : ind3;
							} else if (hr.toString() == curr_hr) {
								ind = i;
							}
							event_tm.options[i] = new Option(hr, hr);
						}
						for (hr = 0; hr <= end_hr; hr++, i++) {
							hr = "0" + hr;
							if (isExist) {
								ind3 = hr.toString() == prev_hr ? i : ind3;
							} else if (hr.toString() == curr_hr) {
								ind = i;
							}
							event_tm.options[i] = new Option(hr, hr);
							ind2 = i;
						}
					} else {
						for ( var i = 0, hr = start_hr; hr <= end_hr; i++, hr++) {
							if (hr < 10 && i > 0) {
								hr = "0" + hr;
							}
							if (isExist) {
								ind3 = hr.toString() == prev_hr ? i : ind3;
							} else if (hr.toString() == curr_hr) {
								ind = i;
							}
							event_tm.options[i] = new Option(hr, hr);
							ind2 = i;
						}
					}
					if (isExist) {
						event_tm.selectedIndex = ind3;
					} else {
						ind != -1 ? event_tm.selectedIndex = ind
								: event_tm.selectedIndex = ind2;
					}
				} else {
					event_tm.options[0] = new Option(end_hr, end_hr);
					event_tm.disabled = true;
				}

				// minute text input
				if (isExist) {
					event_min.value = prev_min;
				} else {
					if(isCurrentTimeSlot)
					{
					    event_min.value = curr_min

						$(".event_min").text(curr_min);

					}
					else
					{
						 event_min.value = end_min;
						 $(".event_min").text(end_min);
					}
				}

				// time zone
				var array = (cur_dt).toString().split(" ");
				var timezone = array[4];
				$(".timezone").text(timezone);
			},

			/**
			 * Open the view
			 */
			open : function() {
				$(this.el).dialog("open");
			},

			/**
			 * Submit the activity selection
			 */
			submitActivity: function(){
				if($(this.el).find(".offUCheck").is(':checked')){
					if(this.eventDtValidation()){
						$(this.el).dialog("close");
						var $offOption = $(this.el).find('.off-selection').find("option:selected");
						var ind = 1;
						var dt = this.getActivityTime();
						var nomid = parseFloat($offOption.val());
						var nomdisp = $offOption.text();
						if(this.isMultiSelect){
							_.each(this.patient.collection.MultiSelectModel.get("selectedPatient"), function(patient){
								var id = patient.get("person_id");
								var encntr_id = patient.get("encntr_id");
								var cecd = patient.get("offunitevent").CECD;
								var nomid = nomid;
								var encntr_id = patient.get("encntr_id");
								patient.userPrefModel.savePref(id, encntr_id,ind, dt, cecd, nomid, nomdisp, this);
							});
							this.patient.collection.MultiSelectModel.clean();
						}
						else{
							var id = this.patient.get("person_id");
							var cecd = this.patient.get("offunitevent").CECD;
							var encntr_id = this.patient.get("encntr_id");
							var nomid = nomid;
							this.patient.userPrefModel.savePref(id, encntr_id,ind, dt, cecd, nomid, nomdisp, this);
						}
					}
				}
				else{
					var attr = {
						"CNT" : 0,
						"EVENT_DT" : "",
						"EVENTDTDISP" : "",
						"STATUS" : "DRAFT",
						"LIST": []
					};

					var $el = $(this.el), that = this, ftString = "";
					_.each($el.find(".activity-freetext-input"), function(input){
						ftString+=$(input).val();
					})

					if (this.eventDtValidation()&&this.verifySNCharacters(ftString)) {
						attr.EVENT_DT=this.getActivityTime();
						attr.EVENTDTDISP=this.getActivityTime1();
						_.each($el.find('.tabDiv'), function(div){
							_.each($(div).find(".selection:enabled"), function(select){
								var nomenid=[];
								var nomendisp=[];
								_.each($(select).find("option:selected"), function(option){
									nomenid.push({"NOMID":parseFloat($(option).val())+".0"});
									nomendisp.push(jQuery.trim($(option).text()));
								})
								var item = that.setNomenActivity(select, nomenid, nomendisp.join());
								if(item){
									attr.LIST.push(item);
									attr.CNT++;
								}
							});
							_.each($(div).find(".activity-freetext-input"), function(input){
								if($(input).val()!==""){
									var item = that.setFreetextActivity(input);
									if(item){
										attr.LIST.push(item);
										attr.CNT++;
									}
								}
							});
						})
						if(this.isMultiSelect){
							this.setMultiSelectActivityModel(attr);
							this.patient.collection.MultiSelectModel.clean();
						}
						else{
							this.setActivityModel(attr);
						}
					}
				$(this.el).dialog("close");
				}
			},

			/**
			*get activity time of the format of dd-NNN-yyyy HH:mm:ss, use for time interval
			*/
			getActivityTime : function()
			{

				var start_event_dt = new Date(this.model.get("STARTDT"));
				var start_date = df.format(start_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				var end_event_dt = new Date(this.model.get("ENDDT"));
				var end_date = df.format(end_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

				var event_date_dialog = start_event_dt;
				if (start_date == this.$(".event_dt").get(0).value)
				{
					event_date_dialog = start_event_dt;
				}
				else if (end_date == this.$(".event_dt").get(0).value)
				{
					event_date_dialog = end_event_dt;
				}

				event_date_dialog.setHours(this.$(".event_tm").get(0).value);
				event_date_dialog.setMinutes(this.$(".event_min").get(0).value);
				var event_date = DateFormatter.formatDate(event_date_dialog, "dd-NNN-yyyy HH:mm:ss").toUpperCase();
				return event_date;
			},

			/**
			*get activity time of the format of MM-dd-yyyy HH:mm, use for charting
			*/
			getActivityTime1 : function()
			{
				var start_event_dt = new Date(this.model.get("STARTDT"));
				var start_date = df.format(start_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				var end_event_dt = new Date(this.model.get("ENDDT"));
				var end_date = df.format(end_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

				var event_dt = start_event_dt;
				if (start_date == this.$(".event_dt").get(0).value)
				{
					event_dt = start_event_dt;
				}
				else if (end_date == this.$(".event_dt").get(0).value)
				{
					event_dt = end_event_dt;
				}

				event_dt.setHours(this.$(".event_tm").get(0).value);
				event_dt.setMinutes(this.$(".event_min").get(0).value);
				var event_date1 = (df.format(event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR));
				return event_date1;
			},

			/**
			*get activity time javascript date object
			*/
			getActivityTime2 : function()
			{
				var start_event_dt = new Date(this.model.get("STARTDT"));
				var start_date = df.format(start_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				var end_event_dt = new Date(this.model.get("ENDDT"));
				var end_date = df.format(end_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

				var event_dt = start_event_dt;
				if (start_date == this.$(".event_dt").get(0).value)
				{
					event_dt = start_event_dt;
				}
				else if (end_date == this.$(".event_dt").get(0).value)
				{
					event_dt = end_event_dt;
				}

				event_dt.setHours(this.$(".event_tm").get(0).value);
				event_dt.setMinutes(this.$(".event_min").get(0).value);
				var event_date2 = (event_dt);
				return event_date2;
			},

			/**
			 * Get nomen activity information
			 */
			setNomenActivity : function(event, event_nom_id, event_result) {
				var event_cd = parseInt($(event).closest('.tabDiv').attr('id'), 10);
				if (event_result.length) {
					return {
						"EVENTID" : 0.0,
						"NAME" : event_result,
						"CLINEVENTID" : 0.0,
						"EVENT_CD" : event_cd,
						"EVENT_DISP" : event_result,
						"EVENT_RESULT" : event_result,
						"FREETEXT": "",
						"NOMID": event_nom_id,
						"INPUTPRT": 0.0,
						"OFFUNITIND":"0"
					};
				}
				return false;
			},

			/**
			 * Get freetext activity information
			 */
			setFreetextActivity : function(ev) {
				var event_result = jQuery.trim($(ev).val());
				var event_cd = parseInt($(ev).closest('.tabDiv').attr('id'), 10);
				//NOMID structure is created,‘event_cd’ is negated and passed as the default value for the freetext to make it unique
				if (event_result.length) {
					return {
						"EVENTID" : 0.0,
						"NAME" : event_result,
						"CLINEVENTID" : 0.0,
						"EVENT_CD" : event_cd,
						"EVENT_DISP" : event_result,
						"EVENT_RESULT" : event_result,
						"FREETEXT": event_result,
						"NOMID": [
						{"NOMID" : -event_cd+"" }],
						"INPUTPRT": 0.0,
						"OFFUNITIND":"0"
					}
				}
				return false;
			},

			setActivityModel : function(attr) {
				// change activity attributes
				var newAttributes = {
					"CNT" : attr.CNT,
					"EVENT_DT" : attr.EVENT_DT,
					"EVENTDTDISP" : attr.EVENTDTDISP,
					"STATUS" : attr.STATUS,
					"LIST": attr.LIST
				};
				this.model.set(newAttributes);
			},

			setMultiSelectActivityModel : function(attr){
				var that = this;
				var timeIntervals = this.patient.collection.timeIntervals;
				var event_date = this.getActivityTime2();
				var timeSlots = _.select(timeIntervals, function(timeslot) {
					return (timeslot.startDate <= event_date && timeslot.endDate >= event_date);
				});
				_.each(timeSlots, function(timeSlot){
					_.each(that.patient.collection.MultiSelectModel.get("selectedPatient"), function(patient){
						// console.log(_.indexOf(timeIntervals, timeSlot));
						var view = that.newActivityView(_.indexOf(timeIntervals, timeSlot), patient);
						view.model.set(attr);
					});
				});
			},

			/**
			 * create and attach acitivtyview and model
			 */
			newActivityView : function(index, model){
				try{
				//initialize the model and view
				var activityModel = new ActivityModel, activityView;
				//set up model properties
				activityModel.patient = model;
				var timeIntervals = this.patient.collection.timeIntervals;
				activityModel.set({
					"STARTDT" : timeIntervals[index].startDate,
					"ENDDT" : timeIntervals[index].endDate
				});
				//add activityModel to activities list
				model.activities.add(activityModel);
				//set up view properties
				activityView = new ActivityView({
					modifiable : true,
					model : activityModel,
					patient : model
				});
				//replace the null activityView with the new activityView
				model.view.activityViews[index]=activityView;
				  if(model.view.el.cells[0].className === "patient-image")
	            	{
						//replace the DOM element of the table cell with new acitivtyView's DOM
						model.view.el.replaceChild(activityView.el, model.view.el.cells[index+3]);
					}
					else{//replace the DOM element of the table cell with new acitivtyView's DOM
						model.view.el.replaceChild(activityView.el, model.view.el.cells[index+4]);
					}
				//set the previousActivityView if it is not null
				if(model.view.activityViews[index+1]!=null&&index+1<model.view.activityViews.length)
						model.view.activityViews[index].previousActivityView = model.view.activityViews[index + 1];
				return model.view.activityViews[index];
				}
				catch (e)
                {
                errmsg(e.message, "newActivityView()");
                }
			},

			freetextActivityKeyPress : function(ev) {
				this.enableSubmit(ev);
				this.enableUnchartEvent(ev);
				this.toggleSelection(ev);
				if(ev.keyCode===13){
					this.nextTab();
				}
			},

			responseSelected : function(ev){
				ev.preventDefault();
				if(this.isMultiSelectResponce){
				var scroll_offset= ev.target.scrollTop;
					var newVals = $(ev.target).val();
					if(newVals === null)
						return;

					if (newVals.length === 1) {
						var index = this.vals.indexOf(newVals[0])
							if (index > -1) {
							this.vals.splice(index, 1);
						  } else {
							this.vals.push(newVals[0])
						  }
						 $(ev.target).addClass('stop-scrolling')
						 $(ev.target).val(this.vals);
				}
					ev.target.scrollTop = scroll_offset;
				}

				this.enableSubmit(ev);
        		this.nextTab();
			},
			responseSelectedkeyup : function(event){
				event.preventDefault ? event.preventDefault() : (event.returnValue = false);
				return;

			},


			nextTab : function(){
				if(this.isTabNav){
					var currentInd = parseInt(this.$('.tabs').find(".ui-tabs-selected a:first-child").attr("rel"), 10);
					if(currentInd === this.patient.get("location_activities").length-1){
						this.submitActivity();
					}
					else{
						this.$('.tabs').tabs('select', currentInd+1);
						this.$('.tabs').find(".ui-tabs-selected a:first-child").focus();
					}
				}
			},

			enableSubmit : function(ev){
				this.enableUnchartEvent(ev);
				$(":button:contains('"+$.i18n.t("SafetyAttendanceCommon.OK")+"')").attr("disabled",false);
			},

			toggleSubmit : function(ev){
				if($(ev.target).is(':checked')){
					$(":button:contains('"+$.i18n.t("SafetyAttendanceCommon.OK")+"')").attr("disabled",false);
					$(this.el).find(".tabs").attr("disabled",true);
					$(this.el).find(".off-selection").show();
				}
				else{
					$(":button:contains('"+$.i18n.t("SafetyAttendanceCommon.OK")+"')").attr("disabled", true);
					$(this.el).find(".tabs").attr("disabled", false);
					$(this.el).find(".off-selection").hide();
				}
			},

			enableUnchartEvent : function(ev){
				if(ev.target.className==="selection"){
					$(ev.target).closest('.tabDiv').find("h4").attr("disabled",false);
				}
				else if(ev.target.className==="activity-freetext-input"){
					$(ev.target).closest('.tabDiv').find("h4").attr("disabled",false);
				}
			},

			toggleSelection : function(ev){
				var $el = $(this.el), val = $(ev.target).val(),
					$selection = $(ev.target).closest('.tabDiv').find('.selection');
				if (val.length) {
					$selection.attr("disabled", true);
				} else {
					$selection.attr("disabled", false);
				}
			},

			/**
			 * Callback event to change activity to activity in previous
			 * interval. Destroys View.
			 */
			changeToLastActivity : function(event) {
				var $el = $(this.el);
				// no activity from previous interval
				if (this.activityView.previousActivityView == null) {
					$el.dialog("close");
					return this;
				}
				if (this.eventDtValidation()) {
					var previousActivityModel = this.activityView.previousActivityView.model;
					// change activity attributes
					var newAttributes = {
						"CNT" : previousActivityModel.get("CNT"),
						"EVENT_DT" : this.getActivityTime(),
						"EVENTDTDISP" : this.getActivityTime1(),
						"STATUS" : "DRAFT",
						"LIST": []
					};
					_.each(previousActivityModel.get("LIST"), function(event){
						var nomenidList = _.clone(event.NOMID);
						if(previousActivityModel.get("STATUS")==="SAVED"||previousActivityModel.get("STATUS")==="INERROR"){
							var nomenid=[];
							_.each(nomenidList, function(nomen){
								nomenid.push({"NOMID":parseFloat(nomen.NOMID)+".0"});
							})
							if(nomenid.length){
								if(nomenid[0]==="0.0"){
									nomenidList=[];
								}
								else{
									nomenidList = nomenid;
								}
							}
							else{
									nomenidList=[];
							}
						}
						else{
							nomenidList=event.NOMID;
						}

						newAttributes.LIST.push({
							"EVENTID" : 0.0,
							"NAME" : event.NAME,
							"CLINEVENTID" : 0.0,
							"EVENT_CD" : event.EVENT_CD,
							"EVENT_DISP" : event.EVENT_DISP,
							"EVENT_RESULT" : event.EVENT_RESULT,
							"FREETEXT": event.FREETEXT,

							"NOMID": nomenidList,
							"INPUTPRT": 0.0,
							"OFFUNITIND":"0"
						});

					})
					this.model.set(newAttributes);
					// destroy dialog
					$el.dialog("close");
				}
			},

			/**
			 * Callback event to unchart activity. Destroys View.
			 */
			unchartActivity : function(event) {
				var model = this.model;
				var status = model.get("STATUS").toUpperCase();

				if (status === "SAVED" || status === "INERROR") {
					model.inError();
				} else {
					_.each(model.get("LIST"), function(event){
						event.EVENT_RESULT="";
					})
					model.set({
						"CNT" : 0,
						"STATUS" : "NONE"
					});
				}

				// destroy dialog
				$(this.el).dialog("close");
			},

			/**
			* Callback event to unchart event
			*/
			unchartEvent : function(event){

				var $tabDiv = $(event.target).closest('.tabDiv');
				$tabDiv.find('.activity-freetext-input').val("");

				var $elSelection = $tabDiv.find('.selection');
				 var selectionLength = $elSelection[0].options.length;
				 for(var k = 0; k < selectionLength ; k++){

					 var index = this.vals.indexOf($elSelection[0].options[k].value)
					if (index > -1) {
					this.vals.splice(index, 1);
				  }

				 }




				$tabDiv.find('.selection').prop("selectedIndex",-1);
				$tabDiv.find('.selection').attr("disabled", false);
				$tabDiv.find('.unchart-event').attr("disabled", true);
				this.enableSubmit(event);
			},

			/**
			 * Keyup event
			 */
			eventMinuteValidation : function(event) {
				var min = $(".event_min").get(0).value;
				min = min.replace(/[^0-9]/g, '');
				if (min > 59) {
					min= 59;
				}
				$(".event_min").get(0).value =min;
			},


			/**
			 * Check validation of event date and time
			 */
			eventDtValidation : function() {
				var start_dt = new Date(this.model.get("STARTDT")), end_dt = new Date(this.model.get("ENDDT")), cur_dt = new Date(), inputDate = new Date(start_dt);
				var start_dt_disp = df.format(start_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				var end_dt_disp = df.format(end_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				var cur_dt_disp = df.format(cur_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				//Check whether the user selected date is start date or end date?
				if( df.format(end_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR) == this.$(".event_dt").get(0).value){
					inputDate = new Date(end_dt);
				}
				else{
					inputDate = new Date(start_dt);
				}
				//Set the user selected time to the input date variable
				inputDate.setHours(this.$(".event_tm").get(0).value);
				inputDate.setMinutes(this.$(".event_min").get(0).value);
				if (inputDate > cur_dt){


						if(cur_dt < end_dt)
						{

										var cur_dt = new Date();
										var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_FUTURE_TIME"));
										if (r == true) {
											var curr_date = df.format(cur_dt,
													mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), curr_hr = DateFormatter
													.formatDate(cur_dt, "HH"), curr_min = DateFormatter
													.formatDate(cur_dt, "mm");
											this.$(".event_dt").get(0).value = curr_date;
											this.$(".event_tm").get(0).value = curr_hr;
											this.$(".event_min").get(0).value = curr_min;
											return true;
										} else {
											return false;
										}
						}else{

							var end_dt = this.model.get("ENDDT");
							var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
									+ end_dt_disp
									+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
							if (r == true) {
										var end_date = df.format(end_dt,
										mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
										.formatDate(end_dt, "HH"), end_min = DateFormatter
										.formatDate(end_dt, "mm");
								this.$(".event_dt").get(0).value = end_date;
								this.$(".event_tm").get(0).value = end_hr;
								this.$(".event_min").get(0).value = end_min;
								return true;
							} else {
								return false;
							}

						}
 				}
 				else if (inputDate < start_dt)
				{
					var start_dt = this.model.get("STARTDT");
					var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ start_dt_disp
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
					if (r == true) {
						var start_date = df.format(start_dt,
								mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), start_hr = DateFormatter
								.formatDate(start_dt, "HH"), start_min = DateFormatter
								.formatDate(start_dt, "mm");
						this.$(".event_dt").get(0).value = start_date;
						this.$(".event_tm").get(0).value = start_hr;
						this.$(".event_min").get(0).value = start_min;
						return true;
					} else {
						return false;
					}
				}
				else if (inputDate > end_dt)
				{
					var end_dt = this.model.get("ENDDT");
					var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ end_dt_disp
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
					if (r == true) {
								var end_date = df.format(end_dt,
								mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
								.formatDate(end_dt, "HH"), end_min = DateFormatter
								.formatDate(end_dt, "mm");
						this.$(".event_dt").get(0).value = end_date;
						this.$(".event_tm").get(0).value = end_hr;
						this.$(".event_min").get(0).value = end_min;
						return true;
					} else {
						return false;
					}
				}
				return true;
			},

			/**
			 * Verifies if the string contains a special character. Returns true
			 * if the string is valid else it returns false.
			 *
			 * @param {String}
			 *            strInputString The string that is going to be
			 *            verified.
			 * @return {Boolean}
			 */
			verifySNCharacters : function(strInputString) {
				var blnStatus = true;
				var strChars = "@#$%^&*()+=[]\\\';,{}|\"<>~_\n";
				var strCharacter = "";
				var strErrorMessage = "";

				try {
					// Loop through the characters in the string.
					for ( var intCounter = 0; intCounter < strInputString.length; intCounter++) {
						// Reset variables.
						strCharacter = "";
						strErrorMessage = "";

						if (strChars.indexOf(strInputString.charAt(intCounter)) != -1) {
							strCharacter = strInputString.charAt(intCounter);
							// Build error message.
							strErrorMessage += strCharacter;
							alert($.i18n.t("ModifiableActivityDialogHandlebar.FREE_TEXT_INPUT_IN_CHARTING")
							+ strErrorMessage);
							return false;
						}
					}
				} catch (error) {
					alert(error.message, "verifySNCharacters", "",
							strInputString);
					blnStatus = false;
				}
				return blnStatus;
			},

			resetIsMultiSelect : function(){
				if(this.model.get("STATUS")!=="NONE"){
					this.isMultiSelect = false;
				}
			},

			/**
			 * Remove dialog from DOM
			 */
			removeDialog : function() {
				$(this.el).empty().remove();
				this.patient = null;
				this.activityView = null;
				this.model = null;
			}

		});

var ActivityDialogViewSingleton = (function(){

	var activityDialogView = new ActivityDialogView({model:new ActivityModel});

	return{


		createActivityDialogView : function(activityModel,patientModel,activityView, isMultiSelect){
			try{
			if(_.isEmpty(activityDialogView)){
				activityDialogView = new ActivityDialogView({model:activityModel,patient:patientModel,activityView:activityView,isMultiSelect:isMultiSelect});

			}
			else{
				activityDialogView.model = activityModel;
				activityDialogView.patient = patientModel;
				activityDialogView.activityView = activityView;
				activityDialogView.isMultiSelect = isMultiSelect;
				activityDialogView.isTabNav = patientModel.collection.patientListsModel.get("tabNavInd")===1?true:false;
				activityDialogView.isMultiSelectResponce = patientModel.collection.BhInfoModel.get("APP_PREF").MULTI_SELECTION===1?true:false;
				activityDialogView.render();

			}
			return activityDialogView;
			}catch(e){alert(e.message + "in ActivityDialogViewSingleton ");}
		  }

	}
})();

/**
 * Post To Chart View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 */
var PostToChartView = Backbone.View.extend({

	/**
	 * DOM element that contains view
	 */
	el:$("#chart-activities"),

	/**
	 * Event Handlers
	 */
	events:{
		"click	.save-to-chart" : "saveToChart"
	},

	/**
	 * Initializes View.
	 */
	initialize:function(){
		_.bindAll(this,"saveToChart","disable","enable");
		this.patientCollection = this.options.patientCollection;
		this.patientCollection.bind("started-loading",this.disable);
		this.patientCollection.bind("finished-loading",this.enable);
	},

	/**
	 * Save changed or new activities to Millennium
	 */
	saveToChart:function(){
		this.disable();
		var unsavedActivities = this.patientCollection.getUnsavedActivities();
		var inErrorActivities = this.patientCollection.getInErrorActivities();
		var activities = unsavedActivities.concat(inErrorActivities);
		var postActBatchsize = this.patientCollection.BhInfoModel.get("APP_PREF").POST_ACT_BATCHSIZE;
		// condition to check the activities , if there is no activities no need to save and enable the sign to chart button.
		if(activities.length > 0) {
			this.model.chartAllActivities(activities , postActBatchsize);
		}else{
			this.enable();
		}
	},

	//Disables all interaction within the view
	disable : function(){
		this.$('select').attr("disabled",true);
		this.$('button').attr("disabled",true);
	},

	//Enables all interaction within the view
	enable : function(){
		this.$('select').attr("disabled",false);
		this.$('button').attr("disabled",false);
	}
});

var NurseUnitDialogViewSingleton = (function(){

	return{
		createNurseUnitDialogView : function(nurseUnitModel, listView){
				var nurseUnitDialogView = new NurseUnitDialogView({model:nurseUnitModel, listView: listView});
			return nurseUnitDialogView;
		}
	}
})();



/**
 * Nurse Unit Dialog to select nurse unit for facility
 *
 * @author Chao Shi - CS024183
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,Mustache

 * File "translation.safety.json"
					Namespaces used:
						"NurseUnitDialogHandlebar",
						"SafetyAttendanceCommon".

 */
var NurseUnitDialogView = Backbone.View.extend({

	/**
	 * Handlebar template for rendering html
	 */
	nuTemplate : TemplateLoader
			.compileFromFile(template_static_path + "templates/_NurseUnitDialog.handlebar.html"),

	/**
	 * css class name
	 */
	className : "nurseunit-dialog-view",

	/**
	 * Event delegators
	 */
	events : {

	},

	isNewPatient : false,

	/**
	 * Initializes View
	 */
	initialize : function() {
		this.render();
	},

	/**
	 * Renders html for view
	 *
	 * @returns {NurseUnitDialogView} this view
	 */
	render : function() {
		var that = this, $el = $(this.el);

		this.setLineIndex();

		var dialogView = {
			LOCQUAL : this.model.LOCQUAL
		};

		$(this.el).html(this.nuTemplate(dialogView));

		$(this.el).i18n();

		// create Nurse Unit Dialog UI
		$el.dialog({
			modal : true,
			autoOpen : false,
			minWidth : 600,
			buttons : [

				{
				text: $.i18n.t("SafetyAttendanceCommon.SUBMIT"),
				className: 'submitButton',
			        click: function() {
					that.submitDialog();
				}
				},
				{
				text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
				className: 'CancelButton',
			        click : function() {
					$(this).dialog("close");
				}
				}

			],
			open : function(event, ui) {
				$(this).dialog("option", "position", []);
			}
		});
		return this;
	},

	/**
	 * Open the view
	 */
	open : function(isNewPatient, newPatientDialogView) {
		this.isNewPatient = isNewPatient;
		if(newPatientDialogView){
			this.newPatientDialogView = newPatientDialogView;
		}
		$(this.el).dialog("open");
	},

	/**
	 * Set Line Index for table rows
	 */
	setLineIndex : function() {
		var length = this.model.LOCQUAL.length;
		$.each(this.model.LOCQUAL, function(i, e) {
			if (i % 3 === 0) {
				e["OPEN"] = true;
				e["CLOSE"] = false;
			} else if (i % 3 === 2 || i === length - 1) {
				e["OPEN"] = false;
				e["CLOSE"] = true;
			} else {
				e["OPEN"] = false;
				e["CLOSE"] = false;
			}
		});
	},

	/**
	 * Submit button click event
	 */
	submitDialog:function(){
		var selection = [];
		var code_value = [];
		$.each($("input:checked", this.el), function(i, e){
			code_value.push(parseInt($(e).attr("value"), 10));
			selection.push($(e).siblings("label").text());
		});
		if(this.isNewPatient){
			$(this.el).dialog("close");
			if(selection.length && code_value.length){
				this.newPatientDialogView.setSelectedNu(this.model, code_value);
				this.newPatientDialogView.changeNurseUnitText(selection);
			}
		}
		else{
			this.options.listView.model.changeNurseUnitText(selection);
			$(this.el).dialog("close");
			this.options.listView.model.setSelectedNu(this.model, code_value, true);
		}
	 //selectObj.selectHide();
	},

	/**
	 * Remove dialog from DOM
	 */
	removeDialog : function() {
		$(this.el).empty().remove();
		this.model = null;
	}

});

/**
 * Date time Dialog to select end date time of off unit period
 *
 * @author Chao Shi - CS024183
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,Mustache
 * File "translation.safety.json"
					Namespaces used:
						"DateTimeDialogHandlebar",
						"SafetyAttendanceCommon",
						"ModifiableActivityDialogHandlebar".

 */
var DateTimeDialogView = Backbone.View.extend({

	/**
	 * Handlebar template for rendering html
	 */
	dtTemplate : TemplateLoader
			.compileFromFile(template_static_path + "templates/_DateTimeDialog.handlebar.html"),

	/**
	 * is Multi Select Mode Indicator
	 */
	isMultiSelect : false,

	/**
	 * css class name
	 */
	className : "datetime-dialog-view",

	/**
	 * event
	 */
	 events : {
	 	"keyup .off_tm" : "checkHour",
	 	"keyup .off_min" : "checkMin"
	 },

	/**
	 * Initializes View
	 */
	initialize : function() {
		this.render();
	},

	/**
	 * Renders html for view
	 *
	 * @returns {NurseUnitDialogView} this view
	 */
	render : function() {
		var that = this, $el = $(this.el);
		var array = (new Date()).toString().split(" ");
		var timezone = array[4];
		var dialogView = {
			timezone: timezone
		};

		$(this.el).html(this.dtTemplate(dialogView));

		// create Nurse Unit Dialog UI
		$el.dialog({
			modal : true,
			autoOpen : false,
			minWidth : 400,
			title : $.i18n.t("DateTimeDialogHandlebar.SELECT_END_DATE_TIME_FOR_OFF_UNIT_PERIOD"),//leftout
			buttons : [
			{
				text: $.i18n.t("SafetyAttendanceCommon.SUBMIT"),
				    click: function() {


						var dates = that.getDates(that.startdt, that.enddt);

						var input_dt = null;

							_.each(dates, function(date){

								var dateString = df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
								if(dateString  === that.$(".off_dt").val())
								{
									input_dt = date;
								}

							});

						//var input_dt = new Date(that.$(".off_dt").val());
						input_dt.setHours(that.$(".off_tm").val());
						input_dt.setMinutes(that.$(".off_min").val());

					if(that.dtValidation(input_dt)){
						$(this).dialog("close");

						that.submitDialog(input_dt);

					}
				}
			},
			{
				text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
				    click: function()
				{
					$(that.checkbox).attr('checked','checked');
					$(this).dialog("close");
				}
			}
			],
			open : function(event, ui) {
				$(this).dialog("option", "position", []);
				var gender=that.model.get("gender_display");
				var age= that.model.get("age_display");
				var title = that.model.get("name")+" "+age.Count+" "+age.Unit+", "+gender;
				$(this).dialog( "option", "title", title);
			}
		});
		return this;
	},

	/**
	 * Open the view
	 */
	open : function(checkbox) {
		this.checkbox = checkbox;
		$(this.el).dialog("open");
		this.setDateTimePicker();
	},

	/**
	 * Submit button click event
	 */
	submitDialog:function(input_dt){
		try{
		var that = this;
		var input_dt = DateFormatter.formatDate(input_dt,"dd-NNN-yyyy HH:mm:ss").toUpperCase();
		var cecd = that.model.userPrefModel.get("offunitstatus").cecd;
		var nomid = that.model.userPrefModel.get("offunitstatus").nomid;
		var disp = that.model.userPrefModel.get("offunitstatus").nomdisp;
		var ind = 2;
		this.model.userPrefModel.removePref(this.model.get("person_id"),that.model.get("encntr_id"),ind,input_dt,cecd,nomid,disp, this);
		}
		catch (e)
          {
              alert(e.message + "submitDialog()");
          }
	},
	addOffunitEvent:function(event_id){
		try{
			var that = this;

			var dates = that.getDates(that.startdt, that.enddt);

			var input_dt = null;

			_.each(dates, function(date){

			var dateString = df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				if(dateString  === that.$(".off_dt").val())
					{
						input_dt = date;
					}
			});

						//var input_dt = new Date(that.$(".off_dt").val());
			input_dt.setHours(that.$(".off_tm").val());
			input_dt.setMinutes(that.$(".off_min").val());

		   // var input_dt = this.enddt;
			//var interval = this.model.collection.selectedInterval;
			//var hours = Math.ceil(Math.abs(this.startdt - input_dt)/(60 * 60 * 1000));
			var _timeIntervals = this.model.collection.timeIntervals;
			//var intervalGenerator = timeIntervalGenerator(interval, _timeIntervals?input_dt:new Date(), hours);
			//var timeIntervals = intervalGenerator.getIntervals();
			// console.log(timeIntervals);
			// console.log(_timeIntervals);
			var timeSlots = _.select(_timeIntervals, function(timeslot) {
				return (timeslot.startDate <= input_dt && timeslot.startDate >= that.startdt)||(timeslot.endDate <= input_dt && timeslot.endDate >= that.startdt|| timeslot.startDate<=input_dt && input_dt<=timeslot.endDate||timeslot.startDate<=that.startdt && that.startdt<= timeslot.endDate);
			});
			//console.log(timeSlots);

			if(timeSlots.length > 0) {
				timeSlot =  timeSlots[0];
				var disp = that.model.userPrefModel.get("offunitstatus").nomdisp;
				var event_date = "";
				if(timeSlot.startDate<=input_dt && input_dt<=timeSlot.endDate){
					event_date = input_dt;
				}
				else if(timeSlot.startDate<=that.startdt && that.startdt<= timeSlot.endDate){
					event_date = that.startdt;
				}
				else{
					event_date = timeSlot.endDate;
				}
				var activityData = {
					"CNT" : 1,
					"EVENT_DT" : that.getEventDt(event_date),
					"EVENTDTDISP" : that.getEventDtDisp(event_date),
					"STATUS" : "SAVED",
					"LIST": [{
						"EVENTID" : event_id,
						"NAME" : disp,
						"CLINEVENTID" : 0.0,
						"EVENT_CD" : that.model.userPrefModel.get("offunitstatus").cecd,
						"EVENT_DISP" : disp,
						"EVENT_RESULT" : disp,
						"FREETEXT": "",
						"NOMID": [{
							"NOMID" : that.model.userPrefModel.get("offunitstatus").nomid.toString()
						}],
						"INPUTPRT": 0.0,
						"OFFUNITIND":"2"
					}]
				};

			//Loop through for user specified time interval
					var index = -1;
				for (var i = 0; i < _timeIntervals.length; i++) {
					if( ( _timeIntervals[i].startDate.getTime() == timeSlot.startDate.getTime() )&& ( _timeIntervals[i].endDate.getTime() == timeSlot.endDate.getTime() ) ){
						index = i;
						break;
					}
				}

				if(index<_timeIntervals.length && index >= 0){
					var view = that.newActivityView(index);
					view.model.set(activityData);
				}
				else{
					var activityModel = new ActivityModel(activityData);
					activityModel.patient = that.model;
					that.model.activities.add(activityModel);
				}

			}


		}
		catch (e)
          {
              alert(e.message + "submitDialog()");
          }
	},

	/**
	 * create and attach acitivtyview and model
	 */
	newActivityView : function(index){
		//initialize the model and view
		var model = this.model, activityModel = new ActivityModel, activityView;
		//set up model properties
		activityModel.patient = model;
		var timeIntervals = this.model.collection.timeIntervals;
		activityModel.set({
			"STARTDT" : timeIntervals[index].startDate,
			"ENDDT" : timeIntervals[index].endDate
		});
		//add activityModel to activities list
		model.activities.add(activityModel);
		//set up view properties
		activityView = new ActivityView({
			modifiable : true,
			model : activityModel,
			patient : model
		});
		//replace the null activityView with the new activityView
		this.model.view.activityViews[index]=activityView;
		//replace the DOM element of the table cell with new acitivtyView's DOM
		if( this.model.view.el.cells[0].className === "patient-image")
	    {

		  this.model.view.el.replaceChild(activityView.el, this.model.view.el.cells[index+3]);
		}
		else{
			this.model.view.el.replaceChild(activityView.el, this.model.view.el.cells[index+4]);
		}
		//set the previousActivityView if it is not null
		if(this.model.view.activityViews[index+1]!=null&&index+1<this.model.view.activityViews.length)
				this.model.view.activityViews[index].previousActivityView = this.model.view.activityViews[index + 1];
		return this.model.view.activityViews[index];
	},

	/**
	 *set date time picker
	 */
	setDateTimePicker : function(){
		var startdt = new Date(this.model.userPrefModel.get("offunitstatus").offunitstartdt);
		var timeintervals = this.model.view.timeIntervals;
		var enddt = (timeintervals) ? timeintervals[0].endDate:new Date();
		this.startdt = new Date(startdt);
		this.enddt = enddt;
		var cur_dt = new Date();

		var dateString = df.format(cur_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

		if(startdt.getFullYear()===enddt.getFullYear() && startdt.getMonth()===enddt.getMonth() && startdt.getDate() === enddt.getDate()){
			var dateString = df.format(startdt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

			this.$(".off_dt").append("<option value='"+dateString+"'>"+dateString+"</option>");
			this.$(".off_dt").attr("disabled", true);
		}
		else{
			var dates = this.getDates(startdt, enddt);
			var dropdownHtml = "";
			_.each(dates, function(date){

				var dateString = df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

				dropdownHtml += "<option value='"+dateString+"'>"+dateString+"</option>";
			});
			this.$(".off_dt").append(dropdownHtml);
			this.$(".off_dt option:last").attr("selected","selected");
		}
		var curr_hr = DateFormatter.formatDate(cur_dt, "HH");
		this.$(".off_tm").val(curr_hr);
		var curr_min = DateFormatter.formatDate(cur_dt, "mm");
		this.$(".off_min").val(curr_min);
	},

	/**
	 *get start date time in javascript date object format
	 */

	getStartDt : function(dtString){
	    var dateSeparator = "/";
		if (dtString.indexOf("-") != -1) { dateSeparator = "-"; }
		var list = dtString.split(" ");
		var date = list[0].split("-");
		var time = list[1].split(":");
		var year = date[2];
		var month = DateFormatter.formatEventMonth(date[1]);
		month = parseInt(month, 10)-1;
		var day = date[0];
		var hour = time[0];
		var minute = time[1];
		var second = time[2];
		var milli = time[3];
		return new Date(dtString);

	},

	getDates : function(startDate, stopDate) {
		var dateArray = [];
		var currentDate = startDate;
		var endDate = stopDate;
		if(endDate.getHours()<currentDate.getHours()){
			endDate = endDate.addDays(1);
		}
		while (currentDate <= endDate) {
			dateArray.push( new Date (currentDate));
			currentDate = currentDate.addDays(1);
		}
		return dateArray;
	},

	checkHour : function(event){
		var hour = this.$(".off_tm").val();
		hour = hour.replace(/[^0-9]/g, '');
		if (hour > 23) {
			hour= 23;
		}
		this.$(".off_tm").val(hour);
	},

	checkMin : function(event){
		var min = this.$(".off_min").val();
		min = min.replace(/[^0-9]/g, '');
		if (min > 59) {
			min= 59;
		}
		this.$(".off_min").val(min);
	},

	dtValidation : function(input_dt){

		var cur_dt = new Date();


		        if (input_dt > cur_dt)
 				{
 					var cur_dt = new Date();
 					var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_FUTURE_TIME"));
 					if (r == true) {
 						var curr_date = df.format(cur_dt,
 								mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), curr_hr = DateFormatter
 								.formatDate(cur_dt, "HH"), curr_min = DateFormatter
 								.formatDate(cur_dt, "mm");
								this.$(".off_dt").val(curr_date);
								this.$(".off_tm").val(curr_hr);
								this.$(".off_min").val(curr_min);
 						return true;
 					} else {
 						return false;
 					}
 				}

		if (input_dt < this.startdt) {
			var start_dt = new Date(this.startdt);
			var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ start_dt
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
			if (r === true) {

				var start_date = df.format(start_dt,
						mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), start_hr = DateFormatter
						.formatDate(start_dt, "HH"), start_min = DateFormatter
						.formatDate(start_dt, "mm");
				this.$(".off_dt").val(start_date);
				this.$(".off_tm").val(start_hr);
				this.$(".off_min").val(start_min);
				return true;
			} else {
				return false;
			}
		} else if (input_dt > this.enddt) {
			var end_dt = this.enddt;
			var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ end_dt
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
			if (r === true) {

				var end_date = df.format(end_dt,
						mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
						.formatDate(end_dt, "HH"), end_min = DateFormatter
						.formatDate(end_dt, "mm");
				this.$(".off_dt").val(end_date);
				this.$(".off_tm").val(end_hr);
				this.$(".off_min").val(end_min);
				return true;
			} else {
				return false;
			}
		}
		return true;
	},

	/**
	*get activity time of the format of dd-NNN-yyyy HH:mm:ss, use for time interval
	*/
	getEventDt : function(dt){
		var event_date = df.format(dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_MMM_4YEAR);

		return event_date;
	},

	/**
	*get activity time of the format of MM-dd-yyyy HH:mm, use for charting
	*/
	getEventDtDisp : function(dt){
		var event_date_disp = (df.format(dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR))

		return event_date_disp;
	},

	/**
	 * Remove dialog from DOM
	 */
	removeDialog : function() {
		$(this.el).empty().remove();
		this.model = null;
	}

});
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days);
	return dat;
}

var DateTimeDialogViewSingleton = (function(){
	return{
		createDateTimeDialogView : function(patient){
				var dateTimeDialogView = new DateTimeDialogView({model:patient});
			return dateTimeDialogView;
		}
	}
})();

/**
 * New Patient dialog view to add new patient to patient collection
 *
 * @author Chao Shi - CS024183
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,Mustache
 * File "translation.safety.json"
					Namespaces used:
						"PatientListsHandlebar",
						"SafetyAttendanceCommon",
						"NewPatientHandlebar",
						"DashboardHeaderHandlebar",
						"PatientInfoHandlebar".
 */
var NewPatientDialogView = Backbone.View.extend({

	/**
	 * Handlebar template for rendering html
	 */
	npTemplate : TemplateLoader
			.compileFromFile(template_static_path + "templates/_NewPatientDialog.handlebar.html"),

	/**
	 * css class name
	 */
	className : "newptient-dialog-view",

	patients : {},

	patientlists : {},

	/**
	 * event
	 */
	events : {
		"change .patient-lists-select" : "ptlistChange",
		"change .fu-lists-select" : "fulistChange",
		"click #nuLink":"setSelectedFacility"
	},

	/**
	 * Initializes View
	 */
	initialize : function() {
		_.bindAll(this);
	},

	/**
	 * Renders html for view
	 *
	 * @returns {NurseUnitDialogView} this view
	 */
	render : function() {
		var that = this;
		this.model.bind("change", this.fillPatientList);
		this.model.bind("started-loading", function(){$(that.el).attr("disabled", "disabled");});
		this.model.bind("finished-loading", function(){$(that.el).removeAttr("disabled");});
		var $el = $(this.el);
		var dialogView = {
			PTLIST : this.patientlists.getLists(),
			FUQUAL: this.patientlists.getFacilities()
		};

		$(this.el).html(this.npTemplate(dialogView));
		$(this.el).i18n();


		// create Nurse Unit Dialog UI
		$el.dialog({
			modal : true,
			autoOpen : false,
			minWidth : 900,
			minHeight : 400,
			title : $.i18n.t("NewPatientHandlebar.ADD_NEW_PATIENT"),
			buttons : [
			{
				text: $.i18n.t("SafetyAttendanceCommon.SUBMIT"),
				  click: function() {

					that.close();

					that.submitPatients();

			}
			},
			{
				text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),

			        click: function() {
					that.close();
			}
			}
			],
			open : function(event, ui) {
				$(this).dialog("option", "position", []);
			}
		});
		return this;
	},

	/**
	 * Open the view
	 */
	open : function() {
		$(this.el).dialog("open");
	},

	/**
	 * Close the view
	 */
	close : function(){
		$(this.el).dialog("close");
	},

	submitPatients : function(){
		try{

		var selectedOptions = this.$(".selection option:selected");
		if(selectedOptions.length == 0)
			return;

		var addAdhocPatientTimer = MP_Util.CreateTimer("USR:MPG.BH_SA_ADD_ADHOC_PATIENTS",Criterion.project_name);
		if(addAdhocPatientTimer){addAdhocPatientTimer.Start();}
		var addedPatientList = new NewPatientModel;
		addedPatientList.patients = this.patients;
		var pt_cnt = selectedOptions.length;
		var patients = [];
		var that = this;

		_.each(selectedOptions, function(option){
			var patient = _.find(that.model.get("patients"), function(patient){
				return patient.PT_ID===parseInt(option.value, 10);
			});
			patients.push(patient);
		});

		addedPatientList.set({
			pt_cnt: pt_cnt,
			patients : patients
		});
		if(addAdhocPatientTimer){addAdhocPatientTimer.Stop();}
    
		addedPatientList.getBhInfo(addedPatientList.mode.DUPLICATE_PATIENT_CHECK);
		}
		catch(err){err.message + "in submitPatients"}

	},

	//patient list select change
	ptlistChange:function(event){
		this.resetFu();
		this.resetPtSelect();
		$target = $(event.target);
		if($target.find("option:selected").val()!=="0"){
			var listId = parseInt($target.find("option:selected").val(), 10);
			var selected = _.find(this.patientlists.PTLISTS.PTLIST, function(ptlist) {
				return ptlist.LISTID === listId;
			});
			selected.NULIST=[];
			try{
				this.close();
				this.model.retrieve(selected);
				this.open();
			}
			catch(err){

			}
		}
	},

	//facility nurse unit select change
	fulistChange : function(event){
		this.resetPtlist();
		this.resetNurseUnitText();
		this.resetPtSelect();
		$target = $(event.target);
	},

	setSelectedFacility : function(event){
		this.resetPtlist();
		this.resetPtSelect();
		var nu  = this.patientlists.getSelectedFacility($(".fu-lists-select option:selected").attr("value"));
		if(nu===undefined){

			alert($.i18n.t("PatientListsHandlebar.PLEASE_SELECT_A_VALID_FACILITY"));

		}
		else{
			var nurseUnitDialog = NurseUnitDialogViewSingleton.createNurseUnitDialogView(nu, this);
			nurseUnitDialog.open(true, this);
		}
	},

	resetFu : function(){
		this.$(".fu-lists-select").find('option:first').attr('selected','selected');
		this.$("#nuLink").text($.i18n.t("PatientListsHandlebar.NURSE_UNITS"));
		this.$("#nuLink").attr("title", $.i18n.t("PatientListsHandlebar.CLICK_TO_OPEN_NURSE_UNITS"));
	},

	resetPtlist : function(){
		this.$(".patient-lists-select").find('option:first').attr('selected','selected');
	},

	resetPtSelect : function(){
		this.$(".selection").html("");
	},

	resetNurseUnitText : function(){
		this.$("#nuLink").text($.i18n.t("PatientListsHandlebar.NURSE_UNITS"));
		this.$("#nuLink").attr("title", $.i18n.t("PatientListsHandlebar.CLICK_TO_OPEN_NURSE_UNITS"));
	},

	fillPatientList : function(){
		var ptlist = this.model.get("patients");
		var space = "&#160;";
		var optionsHtml = "";
		var maxNameLength = 0,
			maxAgeLength = 0,
			maxGenderLength = 0,
			maxDOBLength = 0,
			maxMRNLength = 0,
			maxFINLength = 0,
			maxLocationLength = 0;
		_.each(ptlist, function(pt){
			if(pt.NAME.length>maxNameLength){
				maxNameLength = pt.NAME.length;
			}
			if(pt.AGE.length>maxAgeLength){
				maxAgeLength = pt.AGE.length;
			}
			if(pt.GENDER.length > maxGenderLength){
				maxGenderLength = pt.GENDER.length;
			}
			if(pt.BIRTHDTJS.length > maxDOBLength){
				maxDOBLength = pt.BIRTHDTJS.length;
			}
			if(pt.FIN.length > maxFINLength){
				maxFINLength = pt.FIN.length;
			}
			if(pt.MRN.length > maxMRNLength){
				maxMRNLength = pt.MRN.length;
			}
			var nurse_unit = pt.NURSE_UNIT;
			var room = pt.ROOM;
			var bed = pt.BED;
			if(room!==""){
				room = "/" + room;
			}
			if(bed!==""){
				bed = "/" + bed;
			}
			var location = nurse_unit+room+bed;
			if(location.length>maxLocationLength){
				maxLocationLength = location.length;
			}
		});

		_.each(ptlist, function(pt){
			optionsHtml += "<option value='" + pt.PT_ID + "'>";
			optionsHtml += pt.NAME + space.repeat(maxNameLength-pt.NAME.length + 5);
			optionsHtml += pt.GENDER + space.repeat(maxGenderLength-pt.GENDER.length+5);
			optionsHtml += $.i18n.t("PatientInfoHandlebar.DOB") + pt.BIRTHDTJS + space.repeat(maxDOBLength-pt.BIRTHDTJS.length+5);
			optionsHtml += $.i18n.t("PatientInfoHandlebar.FIN") + pt.FIN + space.repeat(maxFINLength-pt.FIN.length+5);
			optionsHtml += $.i18n.t("PatientInfoHandlebar.MRN") + pt.MRN + space.repeat(maxMRNLength-pt.MRN.length+5);
			var nurse_unit = pt.NURSE_UNIT;
			var room = pt.ROOM;
			var bed = pt.BED;
			if(room!==""){
				room = "/" + room;
			}
			if(bed!==""){
				bed = "/" + bed;
			}
			var location = nurse_unit+room+bed;
			optionsHtml += $.i18n.t("DashboardHeaderHandlebar.LOCATION") + location + space.repeat(maxLocationLength-location.length+5);
			optionsHtml += "</option>";
		});
		this.$(".selection").append(optionsHtml);
	},

	setSelectedNu : function(facility, nucd, flag) {
		try{
		if (nucd.length > 0) {
			var selected = [];
			_.each(facility.LOCQUAL, function(nu) {
				if (_.indexOf(nucd, nu.NULOCATIONCD) != -1) {
					delete nu["OPEN"];
					delete nu["CLOSE"];
					selected.push(nu);
				}
			});
			var fac = _.clone(facility);
			fac.LOCQUAL = selected;
			var select = {
				"PRSNLID" : Criterion.personnel_id,
				"LISTID" : -1,
				"LISTTYPECD" : 0,
				"DEFAULTLOCCD" : 0,
				"NULIST" : [ fac ]
			};
			this.close();
			this.model.retrieve(select);
			this.open();
		}
		}
		catch (e)
          {
              errmsg(e.message, "setSelectedNu()");
          }
	},

	//change text of nurse unit link
	changeNurseUnitText:function(selection){
		try{
		if(selection.length>0){
			var text="";
			$.each(selection, function(i, e){
				text = text + e + "; ";
			});
			text=text.slice(0, text.length-2);
			this.$("#nuLink").attr("title", text);
			if(text.length>20){
				text=text.slice(0, 20);
				text+="...";
			}
			this.$("#nuLink").text(text);
		}
		}
		catch (e)
          {
              errmsg(e.message, "changeNurseUnitText()");
          }
	},

	/**
	 * Remove dialog from DOM
	 */
	removeDialog : function() {
		$(this.el).empty().remove();
		this.patients = null;
		this.patientlists = null;
	}

});
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

var NewPatientDialogViewSingleton = (function(){

	var newPatientDialogView = new NewPatientDialogView({model:new NewPatientModel});

	return{
		createNewPatientDialogView : function(patientCollection){
			if(_.isEmpty(newPatientDialogView)){
				newPatientDialogView = new NewPatientDialogView({model:new NewPatientModel,patients:patientCollection,patientlists:patientCollection.patientListsModel});
			}
			else{
				newPatientDialogView.model = new NewPatientModel;
				newPatientDialogView.patients = patientCollection;
				newPatientDialogView.patientlists = patientCollection.patientListsModel;
				newPatientDialogView.render();
			}
			return newPatientDialogView;
		}
	}
})();

/**
 * Time Range Select View
 * @author Chao Shi - CS024183
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used:
						"TimeRange"
 */
var TimeRangeSelectView = Backbone.View.extend({

	/**
	 * Handlebars template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_TimeRangeSelect.handlebar.html"),

	/**
	 * Event Handlers
	 */
	events:{
		"change .time-range-select":"setTimeRange"
	},

	/**
	 * Initialize View.  Renders View on TimeRangeSelectModel's "change" event.
	 */
	initialize:function() {
		_.bindAll(this);
		//disable view whenever ccl is being queried
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);

		this.render();
		//initially disable
		this.disable();
	},

	/**
	 * Render View HTML
	 * @returns {TimeRangeSelectView} this view
	 */
	render:function(){
		var view = {RANGES : this.model.getTimeRangeOptions()};
		$(this.el).html(this.template(view));
		$(this.el).i18n();
		return this;
	},

	/**
	 * Callback function for setting time range.
	 */
	setTimeRange:function(){
		if(_.isEmpty(this.model)){
			return false;
		}
		var timeRangeChange = MP_Util.CreateTimer("ENG:MPG.BH_SA_TIME_RANGE_CHANGE",Criterion.project_name);
		if(timeRangeChange){
			timeRangeChange.Start();
		}
		this.select = this.$(".time-range-select",this.el)[0];
		this.option = parseInt(this.select.options[this.select.selectedIndex].value, 10);
		this.model.resetIntervalValue = false;
		this.model.setTimeRange(this.option);
		this.model.createTimeIntervals(this.model.selectedInterval);
		if(timeRangeChange){
			timeRangeChange.Stop();
		}
	},

	//Disables all interaction within the view
	disable : function(){
		this.$('select').attr("disabled",true);
		this.$('button').attr("disabled",true);
	},

	//Enables all interaction within the view
	enable : function(){
		this.$('select').attr("disabled",false);
		this.$('button').attr("disabled",false);
	},

	/**
	 * Remove View from DOM
	 */
	remove: function() {
		$(this.el).empty().remove();
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);
	}
});

/**
 * Entry point for MPage.
 */
function init() {

	Criterion.unloadParams();

	var mpageLoad = MP_Util.CreateTimer("CAP:MPG.BH_SA_MPAGE_LOAD",Criterion.project_name);
	if(mpageLoad){
		mpageLoad.Start();
	}


	mConsole.init();
	//parent UtilJsonXML, which will be passed along to all Models that require it
	var json_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"dev_debug_ind" : Criterion.dev_debug_ind,
		"disable_firebug" : true
	});
	if(Criterion.debug_mode_ind != 0){
		$(document).bind("keypress",
			 function(evt)
			 {
				if(!evt){
					evt = window.evt;
				}
				if(evt.ctrlKey==1 && evt.keyCode == 28)
				{
					if(log && log.activateLogging){
						log.activateLogging();
					}
				}
			 }
		);
	}
	$("#save-to-chart").i18n();
	$('#save-to-chart').css("visibility","visible");

	PatientImageRetriever.setJsonHandler(json_handler);


	//patient lists
	var patientListsModel = new PatientListsModel({
		json_handler : json_handler
	});

	var patientListsView = new PatientListsView({
		model : patientListsModel
	});

	//attach the patient lists view to the DOM
	$(patientListsView.el).appendTo($("#patient-lists"));

    if(mpageLoad){
		mpageLoad.Stop();
	}

	//query CCL for patient lists
	patientListsModel.retrieve();


	//patient collection, which will hold all Patient Models
	var patientCollection = new PatientCollection();
	patientCollection.patientListsModel = patientListsModel;
	patientCollection.json_handler = json_handler;
	patientCollection.trigger("change:json_handler");

	//disable patient lists view when querying ccl
	patientCollection.bind("started-loading",function(){
		patientListsView.disable();
	});
	patientCollection.bind("finished-loading",function(){
		patientListsView.enable();
	});

	//if the selected list changes, query the CCL for that list
	patientListsModel.bind("change:selectedList", function() {
		patientCollection.retrieve(patientListsModel.get("selectedList"));

		patientCollection.resetInterval();

		$("#ptpopMessage").remove();
	});

	//time intervals
	var timeIntervalSelectView = new TimeIntervalSelectView({
		model : patientCollection
	});

	//attach the Time Interval Select View to the DOM
	$(timeIntervalSelectView.el).appendTo($("#time-intervals"));

	//time intervals
	var timeRangeSelectView = new TimeRangeSelectView({
		model : patientCollection
	});

	//attach the Time Interval Select View to the DOM
	$(timeRangeSelectView.el).appendTo($("#time-ranges"));

	//Create Patient Dashboard View and attach it to the DOM
	dashboardView = new DashboardView({
		collection : patientCollection
	});
	$(dashboardView.el).appendTo($("#patient-dashboard-wrap"));

	//Post to Chart Model handles all Activity event posts to Millennium
	var postToChartModel = new PostToChartModel({
		json_handler : json_handler,
		collection : patientCollection
	});

	//When post to chart triggers a "posted", the mpage is reloaded with the current patient list
	postToChartModel.bind("posted", function() {
		if(patientListsModel.get("selectedList").LISTID===-1){
			WindowStorage.set("StoredFnu",JSON.stringify(patientListsModel.get("selectedList").NULIST));
		}
		else{
			WindowStorage.set("StoredIndex",patientListsModel.get("selectedList").LISTID);
		}
		window.location.reload();
	});

	//creates Post To Chart view, already attached to DOM
	var postToChartView = new PostToChartView({
		model : postToChartModel,
		patientCollection : patientCollection
	});

	//disable view on mpage launch
	postToChartView.disable();

	//Garbage collection on unload
	$(window).unload(function(){
		patientCollection.destroyCollection();
		patientListsModel.destroyPatientListsModel();
		postToChartModel.destroy();
	});

}

/*
getNurseUnitList() function
Accepts a JSON object
returns NURSEUNIT only with ORGID, NULOCCD.
*/

var getNurseUnitList = function(NULIST) {
	try{
	var NURSEUNITS = [];
		 if(NULIST.length > 0)
		 {
			 for (var i=0; i < NULIST.length; i++)
			 {
				var NULocation = {
					ORGID: NULIST[i].ORGID,
					LOCQUAL : []
				};

				if((NULIST[i].LOCQUAL) && NULIST[i].LOCQUAL.length > 0){
					for(var j= 0;x=NULIST[i].LOCQUAL.length,j<x;j++){
						NULocation.LOCQUAL.push({"NULOCATIONCD" :  NULIST[i].LOCQUAL[j].NULOCATIONCD});
					}
				}
				NURSEUNITS.push(NULocation);
			}
		}
	return NURSEUNITS;
	}
	catch (e)
          {
              errmsg(e.message, "getNurseUnitList()");
          }
};
/*
fixedEncodeURIComponent function
Accepts a string
returns an encoded string
*/

var fixedEncodeURIComponent = function (str) {
	try{
		return encodeURIComponent(str).replace(/[!'()*\-_.~]/g, function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	}
	catch( err ){
		alert(JSON.stringify( err ));
	}
};

/*
fixedDecodeURIComponent function
Accepts a string
returns a decoded string
*/

var fixedDecodeURIComponent = function (str) {
	try{
		return decodeURIComponent(str.replace(/%21|%27|%28|%29|%2A|%2D|%5F|%2E|%7E/g, function(encoding) {
			return String.fromCharCode(encoding.replace(/[%]/g, "0x"));
		}));
	}
	catch( err ){
		alert(JSON.stringify( err ));
	}
};

$(document).ready(function() {
	init();

 });

window.onresize = function(event) {

    var $el;
		  $('html, body').height($(window).height());
		  $('html, body').width($(window).width());

		  $el = $('#main-header');
		  var cal5height =  $('#main-header').height();
		  var prevheight = $el.parent().height();
		  $el = $('#patient-dashboard-wrap');

		 $el.height(prevheight-cal5height);

};
}
catch(e)
{
	log.info(e.message + " " + "in globale Scope");
}
