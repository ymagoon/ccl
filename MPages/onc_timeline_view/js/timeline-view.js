/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("MSXML2.XMLHTTP.6.0")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);


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


// jquery.jsonp 2.4.0 (c)2012 Julian Aubourg | MIT License
// https://github.com/jaubourg/jquery-jsonp
(function(e){function t(){}function n(e){C=[e]}function r(e,t,n){return e&&e.apply&&e.apply(t.context||t,n)}function i(e){return/\?/.test(e)?"&":"?"}function O(c){function Y(e){z++||(W(),j&&(T[I]={s:[e]}),D&&(e=D.apply(c,[e])),r(O,c,[e,b,c]),r(_,c,[c,b]))}function Z(e){z++||(W(),j&&e!=w&&(T[I]=e),r(M,c,[c,e]),r(_,c,[c,e]))}c=e.extend({},k,c);var O=c.success,M=c.error,_=c.complete,D=c.dataFilter,P=c.callbackParameter,H=c.callback,B=c.cache,j=c.pageCache,F=c.charset,I=c.url,q=c.data,R=c.timeout,U,z=0,W=t,X,V,J,K,Q,G;return S&&S(function(e){e.done(O).fail(M),O=e.resolve,M=e.reject}).promise(c),c.abort=function(){!(z++)&&W()},r(c.beforeSend,c,[c])===!1||z?c:(I=I||u,q=q?typeof q=="string"?q:e.param(q,c.traditional):u,I+=q?i(I)+q:u,P&&(I+=i(I)+encodeURIComponent(P)+"=?"),!B&&!j&&(I+=i(I)+"_"+(new Date).getTime()+"="),I=I.replace(/=\?(&|$)/,"="+H+"$1"),j&&(U=T[I])?U.s?Y(U.s[0]):Z(U):(E[H]=n,K=e(y)[0],K.id=l+N++,F&&(K[o]=F),L&&L.version()<11.6?(Q=e(y)[0]).text="document.getElementById('"+K.id+"')."+p+"()":K[s]=s,A&&(K.htmlFor=K.id,K.event=h),K[d]=K[p]=K[v]=function(e){if(!K[m]||!/i/.test(K[m])){try{K[h]&&K[h]()}catch(t){}e=C,C=0,e?Y(e[0]):Z(a)}},K.src=I,W=function(e){G&&clearTimeout(G),K[v]=K[d]=K[p]=null,x[g](K),Q&&x[g](Q)},x[f](K,J=x.firstChild),Q&&x[f](Q,J),G=R>0&&setTimeout(function(){Z(w)},R)),c)}var s="async",o="charset",u="",a="error",f="insertBefore",l="_jqjsp",c="on",h=c+"click",p=c+a,d=c+"load",v=c+"readystatechange",m="readyState",g="removeChild",y="<script>",b="success",w="timeout",E=window,S=e.Deferred,x=e("head")[0]||document.documentElement,T={},N=0,C,k={callback:l,url:location.href},L=E.opera,A=!!e("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;O.setup=function(t){e.extend(k,t)},e.jsonp=O})(jQuery)
/*
    json2.js
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

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


// +--------------------------------------------------------------------+ \\
// � Rapha�l 2.1.0 - JavaScript Vector Library                          � \\
// +--------------------------------------------------------------------� \\
// � Copyright � 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    � \\
// � Copyright � 2008-2012 Sencha Labs (http://sencha.com)              � \\
// +--------------------------------------------------------------------� \\
// � Licensed under the MIT (http://raphaeljs.com/license.html) license.� \\
// +--------------------------------------------------------------------+ \\

(function(a){var b="0.3.4",c="hasOwnProperty",d=/[\.\/]/,e="*",f=function(){},g=function(a,b){return a-b},h,i,j={n:{}},k=function(a,b){var c=j,d=i,e=Array.prototype.slice.call(arguments,2),f=k.listeners(a),l=0,m=!1,n,o=[],p={},q=[],r=h,s=[];h=a,i=0;for(var t=0,u=f.length;t<u;t++)"zIndex"in f[t]&&(o.push(f[t].zIndex),f[t].zIndex<0&&(p[f[t].zIndex]=f[t]));o.sort(g);while(o[l]<0){n=p[o[l++]],q.push(n.apply(b,e));if(i){i=d;return q}}for(t=0;t<u;t++){n=f[t];if("zIndex"in n)if(n.zIndex==o[l]){q.push(n.apply(b,e));if(i)break;do{l++,n=p[o[l]],n&&q.push(n.apply(b,e));if(i)break}while(n)}else p[n.zIndex]=n;else{q.push(n.apply(b,e));if(i)break}}i=d,h=r;return q.length?q:null};k.listeners=function(a){var b=a.split(d),c=j,f,g,h,i,k,l,m,n,o=[c],p=[];for(i=0,k=b.length;i<k;i++){n=[];for(l=0,m=o.length;l<m;l++){c=o[l].n,g=[c[b[i]],c[e]],h=2;while(h--)f=g[h],f&&(n.push(f),p=p.concat(f.f||[]))}o=n}return p},k.on=function(a,b){var c=a.split(d),e=j;for(var g=0,h=c.length;g<h;g++)e=e.n,!e[c[g]]&&(e[c[g]]={n:{}}),e=e[c[g]];e.f=e.f||[];for(g=0,h=e.f.length;g<h;g++)if(e.f[g]==b)return f;e.f.push(b);return function(a){+a==+a&&(b.zIndex=+a)}},k.stop=function(){i=1},k.nt=function(a){if(a)return(new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)")).test(h);return h},k.off=k.unbind=function(a,b){var f=a.split(d),g,h,i,k,l,m,n,o=[j];for(k=0,l=f.length;k<l;k++)for(m=0;m<o.length;m+=i.length-2){i=[m,1],g=o[m].n;if(f[k]!=e)g[f[k]]&&i.push(g[f[k]]);else for(h in g)g[c](h)&&i.push(g[h]);o.splice.apply(o,i)}for(k=0,l=o.length;k<l;k++){g=o[k];while(g.n){if(b){if(g.f){for(m=0,n=g.f.length;m<n;m++)if(g.f[m]==b){g.f.splice(m,1);break}!g.f.length&&delete g.f}for(h in g.n)if(g.n[c](h)&&g.n[h].f){var p=g.n[h].f;for(m=0,n=p.length;m<n;m++)if(p[m]==b){p.splice(m,1);break}!p.length&&delete g.n[h].f}}else{delete g.f;for(h in g.n)g.n[c](h)&&g.n[h].f&&delete g.n[h].f}g=g.n}}},k.once=function(a,b){var c=function(){var d=b.apply(this,arguments);k.unbind(a,c);return d};return k.on(a,c)},k.version=b,k.toString=function(){return"You are running Eve "+b},typeof module!="undefined"&&module.exports?module.exports=k:typeof define!="undefined"?define("eve",[],function(){return k}):a.eve=k})(this),function(){function cF(a){for(var b=0;b<cy.length;b++)cy[b].el.paper==a&&cy.splice(b--,1)}function cE(b,d,e,f,h,i){e=Q(e);var j,k,l,m=[],o,p,q,t=b.ms,u={},v={},w={};if(f)for(y=0,z=cy.length;y<z;y++){var x=cy[y];if(x.el.id==d.id&&x.anim==b){x.percent!=e?(cy.splice(y,1),l=1):k=x,d.attr(x.totalOrigin);break}}else f=+v;for(var y=0,z=b.percents.length;y<z;y++){if(b.percents[y]==e||b.percents[y]>f*b.top){e=b.percents[y],p=b.percents[y-1]||0,t=t/b.top*(e-p),o=b.percents[y+1],j=b.anim[e];break}f&&d.attr(b.anim[b.percents[y]])}if(!!j){if(!k){for(var A in j)if(j[g](A))if(U[g](A)||d.paper.customAttributes[g](A)){u[A]=d.attr(A),u[A]==null&&(u[A]=T[A]),v[A]=j[A];switch(U[A]){case C:w[A]=(v[A]-u[A])/t;break;case"colour":u[A]=a.getRGB(u[A]);var B=a.getRGB(v[A]);w[A]={r:(B.r-u[A].r)/t,g:(B.g-u[A].g)/t,b:(B.b-u[A].b)/t};break;case"path":var D=bR(u[A],v[A]),E=D[1];u[A]=D[0],w[A]=[];for(y=0,z=u[A].length;y<z;y++){w[A][y]=[0];for(var F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(E[y][F]-u[A][y][F])/t}break;case"transform":var H=d._,I=ca(H[A],v[A]);if(I){u[A]=I.from,v[A]=I.to,w[A]=[],w[A].real=!0;for(y=0,z=u[A].length;y<z;y++){w[A][y]=[u[A][y][0]];for(F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(v[A][y][F]-u[A][y][F])/t}}else{var J=d.matrix||new cb,K={_:{transform:H.transform},getBBox:function(){return d.getBBox(1)}};u[A]=[J.a,J.b,J.c,J.d,J.e,J.f],b$(K,v[A]),v[A]=K._.transform,w[A]=[(K.matrix.a-J.a)/t,(K.matrix.b-J.b)/t,(K.matrix.c-J.c)/t,(K.matrix.d-J.d)/t,(K.matrix.e-J.e)/t,(K.matrix.f-J.f)/t]}break;case"csv":var L=r(j[A])[s](c),M=r(u[A])[s](c);if(A=="clip-rect"){u[A]=M,w[A]=[],y=M.length;while(y--)w[A][y]=(L[y]-u[A][y])/t}v[A]=L;break;default:L=[][n](j[A]),M=[][n](u[A]),w[A]=[],y=d.paper.customAttributes[A].length;while(y--)w[A][y]=((L[y]||0)-(M[y]||0))/t}}var O=j.easing,P=a.easing_formulas[O];if(!P){P=r(O).match(N);if(P&&P.length==5){var R=P;P=function(a){return cC(a,+R[1],+R[2],+R[3],+R[4],t)}}else P=bf}q=j.start||b.start||+(new Date),x={anim:b,percent:e,timestamp:q,start:q+(b.del||0),status:0,initstatus:f||0,stop:!1,ms:t,easing:P,from:u,diff:w,to:v,el:d,callback:j.callback,prev:p,next:o,repeat:i||b.times,origin:d.attr(),totalOrigin:h},cy.push(x);if(f&&!k&&!l){x.stop=!0,x.start=new Date-t*f;if(cy.length==1)return cA()}l&&(x.start=new Date-x.ms*f),cy.length==1&&cz(cA)}else k.initstatus=f,k.start=new Date-k.ms*f;eve("raphael.anim.start."+d.id,d,b)}}function cD(a,b){var c=[],d={};this.ms=b,this.times=1;if(a){for(var e in a)a[g](e)&&(d[Q(e)]=a[e],c.push(Q(e)));c.sort(bd)}this.anim=d,this.top=c[c.length-1],this.percents=c}function cC(a,b,c,d,e,f){function o(a,b){var c,d,e,f,j,k;for(e=a,k=0;k<8;k++){f=m(e)-a;if(z(f)<b)return e;j=(3*i*e+2*h)*e+g;if(z(j)<1e-6)break;e=e-f/j}c=0,d=1,e=a;if(e<c)return c;if(e>d)return d;while(c<d){f=m(e);if(z(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}function n(a,b){var c=o(a,b);return((l*c+k)*c+j)*c}function m(a){return((i*a+h)*a+g)*a}var g=3*b,h=3*(d-b)-g,i=1-g-h,j=3*c,k=3*(e-c)-j,l=1-j-k;return n(a,1/(200*f))}function cq(){return this.x+q+this.y+q+this.width+" � "+this.height}function cp(){return this.x+q+this.y}function cb(a,b,c,d,e,f){a!=null?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function bH(b,c,d){b=a._path2curve(b),c=a._path2curve(c);var e,f,g,h,i,j,k,l,m,n,o=d?0:[];for(var p=0,q=b.length;p<q;p++){var r=b[p];if(r[0]=="M")e=i=r[1],f=j=r[2];else{r[0]=="C"?(m=[e,f].concat(r.slice(1)),e=m[6],f=m[7]):(m=[e,f,e,f,i,j,i,j],e=i,f=j);for(var s=0,t=c.length;s<t;s++){var u=c[s];if(u[0]=="M")g=k=u[1],h=l=u[2];else{u[0]=="C"?(n=[g,h].concat(u.slice(1)),g=n[6],h=n[7]):(n=[g,h,g,h,k,l,k,l],g=k,h=l);var v=bG(m,n,d);if(d)o+=v;else{for(var w=0,x=v.length;w<x;w++)v[w].segment1=p,v[w].segment2=s,v[w].bez1=m,v[w].bez2=n;o=o.concat(v)}}}}}return o}function bG(b,c,d){var e=a.bezierBBox(b),f=a.bezierBBox(c);if(!a.isBBoxIntersect(e,f))return d?0:[];var g=bB.apply(0,b),h=bB.apply(0,c),i=~~(g/5),j=~~(h/5),k=[],l=[],m={},n=d?0:[];for(var o=0;o<i+1;o++){var p=a.findDotsAtSegment.apply(a,b.concat(o/i));k.push({x:p.x,y:p.y,t:o/i})}for(o=0;o<j+1;o++)p=a.findDotsAtSegment.apply(a,c.concat(o/j)),l.push({x:p.x,y:p.y,t:o/j});for(o=0;o<i;o++)for(var q=0;q<j;q++){var r=k[o],s=k[o+1],t=l[q],u=l[q+1],v=z(s.x-r.x)<.001?"y":"x",w=z(u.x-t.x)<.001?"y":"x",x=bD(r.x,r.y,s.x,s.y,t.x,t.y,u.x,u.y);if(x){if(m[x.x.toFixed(4)]==x.y.toFixed(4))continue;m[x.x.toFixed(4)]=x.y.toFixed(4);var y=r.t+z((x[v]-r[v])/(s[v]-r[v]))*(s.t-r.t),A=t.t+z((x[w]-t[w])/(u[w]-t[w]))*(u.t-t.t);y>=0&&y<=1&&A>=0&&A<=1&&(d?n++:n.push({x:x.x,y:x.y,t1:y,t2:A}))}}return n}function bF(a,b){return bG(a,b,1)}function bE(a,b){return bG(a,b)}function bD(a,b,c,d,e,f,g,h){if(!(x(a,c)<y(e,g)||y(a,c)>x(e,g)||x(b,d)<y(f,h)||y(b,d)>x(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(!k)return;var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(n<+y(a,c).toFixed(2)||n>+x(a,c).toFixed(2)||n<+y(e,g).toFixed(2)||n>+x(e,g).toFixed(2)||o<+y(b,d).toFixed(2)||o>+x(b,d).toFixed(2)||o<+y(f,h).toFixed(2)||o>+x(f,h).toFixed(2))return;return{x:l,y:m}}}function bC(a,b,c,d,e,f,g,h,i){if(!(i<0||bB(a,b,c,d,e,f,g,h)<i)){var j=1,k=j/2,l=j-k,m,n=.01;m=bB(a,b,c,d,e,f,g,h,l);while(z(m-i)>n)k/=2,l+=(m<i?1:-1)*k,m=bB(a,b,c,d,e,f,g,h,l);return l}}function bB(a,b,c,d,e,f,g,h,i){i==null&&(i=1),i=i>1?1:i<0?0:i;var j=i/2,k=12,l=[-0.1252,.1252,-0.3678,.3678,-0.5873,.5873,-0.7699,.7699,-0.9041,.9041,-0.9816,.9816],m=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],n=0;for(var o=0;o<k;o++){var p=j*l[o]+j,q=bA(p,a,c,e,g),r=bA(p,b,d,f,h),s=q*q+r*r;n+=m[o]*w.sqrt(s)}return j*n}function bA(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function by(a,b){var c=[];for(var d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function bx(){return this.hex}function bv(a,b,c){function d(){var e=Array.prototype.slice.call(arguments,0),f=e.join("?"),h=d.cache=d.cache||{},i=d.count=d.count||[];if(h[g](f)){bu(i,f);return c?c(h[f]):h[f]}i.length>=1e3&&delete h[i.shift()],i.push(f),h[f]=a[m](b,e);return c?c(h[f]):h[f]}return d}function bu(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function bm(a){if(Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[g](c)&&(b[c]=bm(a[c]));return b}function a(c){if(a.is(c,"function"))return b?c():eve.on("raphael.DOMload",c);if(a.is(c,E))return a._engine.create[m](a,c.splice(0,3+a.is(c[0],C))).add(c);var d=Array.prototype.slice.call(arguments,0);if(a.is(d[d.length-1],"function")){var e=d.pop();return b?e.call(a._engine.create[m](a,d)):eve.on("raphael.DOMload",function(){e.call(a._engine.create[m](a,d))})}return a._engine.create[m](a,arguments)}a.version="2.1.0",a.eve=eve;var b,c=/[, ]+/,d={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},e=/\{(\d+)\}/g,f="prototype",g="hasOwnProperty",h={doc:document,win:window},i={was:Object.prototype[g].call(h.win,"Raphael"),is:h.win.Raphael},j=function(){this.ca=this.customAttributes={}},k,l="appendChild",m="apply",n="concat",o="createTouch"in h.doc,p="",q=" ",r=String,s="split",t="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[s](q),u={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},v=r.prototype.toLowerCase,w=Math,x=w.max,y=w.min,z=w.abs,A=w.pow,B=w.PI,C="number",D="string",E="array",F="toString",G="fill",H=Object.prototype.toString,I={},J="push",K=a._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,L=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,M={NaN:1,Infinity:1,"-Infinity":1},N=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,O=w.round,P="setAttribute",Q=parseFloat,R=parseInt,S=r.prototype.toUpperCase,T=a._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},U=a._availableAnimAttrs={blur:C,"clip-rect":"csv",cx:C,cy:C,fill:"colour","fill-opacity":C,"font-size":C,height:C,opacity:C,path:"path",r:C,rx:C,ry:C,stroke:"colour","stroke-opacity":C,"stroke-width":C,transform:"transform",width:C,x:C,y:C},V=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,W=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,X={hs:1,rg:1},Y=/,?([achlmqrstvxz]),?/gi,Z=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,$=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,_=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,ba=a._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,bb={},bc=function(a,b){return a.key-b.key},bd=function(a,b){return Q(a)-Q(b)},be=function(){},bf=function(a){return a},bg=a._rectPath=function(a,b,c,d,e){if(e)return[["M",a+e,b],["l",c-e*2,0],["a",e,e,0,0,1,e,e],["l",0,d-e*2],["a",e,e,0,0,1,-e,e],["l",e*2-c,0],["a",e,e,0,0,1,-e,-e],["l",0,e*2-d],["a",e,e,0,0,1,e,-e],["z"]];return[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},bh=function(a,b,c,d){d==null&&(d=c);return[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},bi=a._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return bg(b.x,b.y,b.width,b.height)}},bj=a.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;a=bR(a);for(e=0,g=a.length;e<g;e++){i=a[e];for(f=1,h=i.length;f<h;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d}return a};a._g=h,a.type=h.win.SVGAngle||h.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";if(a.type=="VML"){var bk=h.doc.createElement("div"),bl;bk.innerHTML='<v:shape adj="1"/>',bl=bk.firstChild,bl.style.behavior="url(#default#VML)";if(!bl||typeof bl.adj!="object")return a.type=p;bk=null}a.svg=!(a.vml=a.type=="VML"),a._Paper=j,a.fn=k=j.prototype=a.prototype,a._id=0,a._oid=0,a.is=function(a,b){b=v.call(b);if(b=="finite")return!M[g](+a);if(b=="array")return a instanceof Array;return b=="null"&&a===null||b==typeof a&&a!==null||b=="object"&&a===Object(a)||b=="array"&&Array.isArray&&Array.isArray(a)||H.call(a).slice(8,-1).toLowerCase()==b},a.angle=function(b,c,d,e,f,g){if(f==null){var h=b-d,i=c-e;if(!h&&!i)return 0;return(180+w.atan2(-i,-h)*180/B+360)%360}return a.angle(b,c,f,g)-a.angle(d,e,f,g)},a.rad=function(a){return a%360*B/180},a.deg=function(a){return a*180/B%360},a.snapTo=function(b,c,d){d=a.is(d,"finite")?d:10;if(a.is(b,E)){var e=b.length;while(e--)if(z(b[e]-c)<=d)return b[e]}else{b=+b;var f=c%b;if(f<d)return c-f;if(f>b-d)return c-f+b}return c};var bn=a.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=w.random()*16|0,c=a=="x"?b:b&3|8;return c.toString(16)});a.setWindow=function(b){eve("raphael.setWindow",a,h.win,b),h.win=b,h.doc=h.win.document,a._engine.initWin&&a._engine.initWin(h.win)};var bo=function(b){if(a.vml){var c=/^\s+|\s+$/g,d;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),d=e.body}catch(f){d=createPopup().document.body}var g=d.createTextRange();bo=bv(function(a){try{d.style.color=r(a).replace(c,p);var b=g.queryCommandValue("ForeColor");b=(b&255)<<16|b&65280|(b&16711680)>>>16;return"#"+("000000"+b.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=h.doc.createElement("i");i.title="Rapha�l Colour Picker",i.style.display="none",h.doc.body.appendChild(i),bo=bv(function(a){i.style.color=a;return h.doc.defaultView.getComputedStyle(i,p).getPropertyValue("color")})}return bo(b)},bp=function(){return"hsb("+[this.h,this.s,this.b]+")"},bq=function(){return"hsl("+[this.h,this.s,this.l]+")"},br=function(){return this.hex},bs=function(b,c,d){c==null&&a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b&&(d=b.b,c=b.g,b=b.r);if(c==null&&a.is(b,D)){var e=a.getRGB(b);b=e.r,c=e.g,d=e.b}if(b>1||c>1||d>1)b/=255,c/=255,d/=255;return[b,c,d]},bt=function(b,c,d,e){b*=255,c*=255,d*=255;var f={r:b,g:c,b:d,hex:a.rgb(b,c,d),toString:br};a.is(e,"finite")&&(f.opacity=e);return f};a.color=function(b){var c;a.is(b,"object")&&"h"in b&&"s"in b&&"b"in b?(c=a.hsb2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):a.is(b,"object")&&"h"in b&&"s"in b&&"l"in b?(c=a.hsl2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):(a.is(b,"string")&&(b=a.getRGB(b)),a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b?(c=a.rgb2hsl(b),b.h=c.h,b.s=c.s,b.l=c.l,c=a.rgb2hsb(b),b.v=c.b):(b={hex:"none"},b.r=b.g=b.b=b.h=b.s=b.v=b.l=-1)),b.toString=br;return b},a.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;a=a%360/60,i=c*b,h=i*(1-z(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h);if(a>1||b>1||c>1)a/=360,b/=100,c/=100;a*=360;var e,f,g,h,i;a=a%360/60,i=2*b*(c<.5?c:1-c),h=i*(1-z(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.rgb2hsb=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;f=x(a,b,c),g=f-y(a,b,c),d=g==0?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=g==0?0:g/f;return{h:d,s:e,b:f,toString:bp}},a.rgb2hsl=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;g=x(a,b,c),h=y(a,b,c),i=g-h,d=i==0?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=i==0?0:f<.5?i/(2*f):i/(2-2*f);return{h:d,s:e,l:f,toString:bq}},a._path2string=function(){return this.join(",").replace(Y,"$1")};var bw=a._preload=function(a,b){var c=h.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,h.doc.body.removeChild(this)},c.onerror=function(){h.doc.body.removeChild(this)},h.doc.body.appendChild(c),c.src=a};a.getRGB=bv(function(b){if(!b||!!((b=r(b)).indexOf("-")+1))return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx};if(b=="none")return{r:-1,g:-1,b:-1,hex:"none",toString:bx};!X[g](b.toLowerCase().substring(0,2))&&b.charAt()!="#"&&(b=bo(b));var c,d,e,f,h,i,j,k=b.match(L);if(k){k[2]&&(f=R(k[2].substring(5),16),e=R(k[2].substring(3,5),16),d=R(k[2].substring(1,3),16)),k[3]&&(f=R((i=k[3].charAt(3))+i,16),e=R((i=k[3].charAt(2))+i,16),d=R((i=k[3].charAt(1))+i,16)),k[4]&&(j=k[4][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),k[1].toLowerCase().slice(0,4)=="rgba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100));if(k[5]){j=k[5][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="�")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsb2rgb(d,e,f,h)}if(k[6]){j=k[6][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="�")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsla"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsl2rgb(d,e,f,h)}k={r:d,g:e,b:f,toString:bx},k.hex="#"+(16777216|f|e<<8|d<<16).toString(16).slice(1),a.is(h,"finite")&&(k.opacity=h);return k}return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx}},a),a.hsb=bv(function(b,c,d){return a.hsb2rgb(b,c,d).hex}),a.hsl=bv(function(b,c,d){return a.hsl2rgb(b,c,d).hex}),a.rgb=bv(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),a.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b}));return c.hex},a.getColor.reset=function(){delete this.start},a.parsePathString=function(b){if(!b)return null;var c=bz(b);if(c.arr)return bJ(c.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];a.is(b,E)&&a.is(b[0],E)&&(e=bJ(b)),e.length||r(b).replace(Z,function(a,b,c){var f=[],g=b.toLowerCase();c.replace(_,function(a,b){b&&f.push(+b)}),g=="m"&&f.length>2&&(e.push([b][n](f.splice(0,2))),g="l",b=b=="m"?"l":"L");if(g=="r")e.push([b][n](f));else while(f.length>=d[g]){e.push([b][n](f.splice(0,d[g])));if(!d[g])break}}),e.toString=a._path2string,c.arr=bJ(e);return e},a.parseTransformString=bv(function(b){if(!b)return null;var c={r:3,s:4,t:2,m:6},d=[];a.is(b,E)&&a.is(b[0],E)&&(d=bJ(b)),d.length||r(b).replace($,function(a,b,c){var e=[],f=v.call(b);c.replace(_,function(a,b){b&&e.push(+b)}),d.push([b][n](e))}),d.toString=a._path2string;return d});var bz=function(a){var b=bz.ps=bz.ps||{};b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[g](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])});return b[a]};a.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=A(j,3),l=A(j,2),m=i*i,n=m*i,o=k*a+l*3*i*c+j*3*i*i*e+n*g,p=k*b+l*3*i*d+j*3*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,x=j*e+i*g,y=j*f+i*h,z=90-w.atan2(q-s,r-t)*180/B;(q>s||r<t)&&(z+=180);return{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:x,y:y},alpha:z}},a.bezierBBox=function(b,c,d,e,f,g,h,i){a.is(b,"array")||(b=[b,c,d,e,f,g,h,i]);var j=bQ.apply(null,b);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},a.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},a.isBBoxIntersect=function(b,c){var d=a.isPointInsideBBox;return d(c,b.x,b.y)||d(c,b.x2,b.y)||d(c,b.x,b.y2)||d(c,b.x2,b.y2)||d(b,c.x,c.y)||d(b,c.x2,c.y)||d(b,c.x,c.y2)||d(b,c.x2,c.y2)||(b.x<c.x2&&b.x>c.x||c.x<b.x2&&c.x>b.x)&&(b.y<c.y2&&b.y>c.y||c.y<b.y2&&c.y>b.y)},a.pathIntersection=function(a,b){return bH(a,b)},a.pathIntersectionNumber=function(a,b){return bH(a,b,1)},a.isPointInsidePath=function(b,c,d){var e=a.pathBBox(b);return a.isPointInsideBBox(e,c,d)&&bH(b,[["M",c,d],["H",e.x2+10]],1)%2==1},a._removedFactory=function(a){return function(){eve("raphael.log",null,"Rapha�l: you are calling to method �"+a+"� of removed object",a)}};var bI=a.pathBBox=function(a){var b=bz(a);if(b.bbox)return b.bbox;if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=bR(a);var c=0,d=0,e=[],f=[],g;for(var h=0,i=a.length;h<i;h++){g=a[h];if(g[0]=="M")c=g[1],d=g[2],e.push(c),f.push(d);else{var j=bQ(c,d,g[1],g[2],g[3],g[4],g[5],g[6]);e=e[n](j.min.x,j.max.x),f=f[n](j.min.y,j.max.y),c=g[5],d=g[6]}}var k=y[m](0,e),l=y[m](0,f),o=x[m](0,e),p=x[m](0,f),q={x:k,y:l,x2:o,y2:p,width:o-k,height:p-l};b.bbox=bm(q);return q},bJ=function(b){var c=bm(b);c.toString=a._path2string;return c},bK=a._pathToRelative=function(b){var c=bz(b);if(c.rel)return bJ(c.rel);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=b[0][1],f=b[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=b.length;j<k;j++){var l=d[j]=[],m=b[j];if(m[0]!=v.call(m[0])){l[0]=v.call(m[0]);switch(l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;n<o;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}}else{l=d[j]=[],m[0]=="m"&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;p<q;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}d.toString=a._path2string,c.rel=bJ(d);return d},bL=a._pathToAbsolute=function(b){var c=bz(b);if(c.abs)return bJ(c.abs);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);if(!b||!b.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=+b[0][1],f=+b[0][2],g=e,h=f,i++,d[0]=["M",e,f]);var j=b.length==3&&b[0][0]=="M"&&b[1][0].toUpperCase()=="R"&&b[2][0].toUpperCase()=="Z";for(var k,l,m=i,o=b.length;m<o;m++){d.push(k=[]),l=b[m];if(l[0]!=S.call(l[0])){k[0]=S.call(l[0]);switch(k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":var p=[e,f][n](l.slice(1));for(var q=2,r=p.length;q<r;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[n](by(p,j));break;case"M":g=+l[1]+e,h=+l[2]+f;default:for(q=1,r=l.length;q<r;q++)k[q]=+l[q]+(q%2?e:f)}}else if(l[0]=="R")p=[e,f][n](l.slice(1)),d.pop(),d=d[n](by(p,j)),k=["R"][n](l.slice(-2));else for(var s=0,t=l.length;s<t;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=h;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],h=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}d.toString=a._path2string,c.abs=bJ(d);return d},bM=function(a,b,c,d){return[a,b,c,d,c,d]},bN=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},bO=function(a,b,c,d,e,f,g,h,i,j){var k=B*120/180,l=B/180*(+e||0),m=[],o,p=bv(function(a,b,c){var d=a*w.cos(c)-b*w.sin(c),e=a*w.sin(c)+b*w.cos(c);return{x:d,y:e}});if(!j){o=p(a,b,-l),a=o.x,b=o.y,o=p(h,i,-l),h=o.x,i=o.y;var q=w.cos(B/180*e),r=w.sin(B/180*e),t=(a-h)/2,u=(b-i)/2,v=t*t/(c*c)+u*u/(d*d);v>1&&(v=w.sqrt(v),c=v*c,d=v*d);var x=c*c,y=d*d,A=(f==g?-1:1)*w.sqrt(z((x*y-x*u*u-y*t*t)/(x*u*u+y*t*t))),C=A*c*u/d+(a+h)/2,D=A*-d*t/c+(b+i)/2,E=w.asin(((b-D)/d).toFixed(9)),F=w.asin(((i-D)/d).toFixed(9));E=a<C?B-E:E,F=h<C?B-F:F,E<0&&(E=B*2+E),F<0&&(F=B*2+F),g&&E>F&&(E=E-B*2),!g&&F>E&&(F=F-B*2)}else E=j[0],F=j[1],C=j[2],D=j[3];var G=F-E;if(z(G)>k){var H=F,I=h,J=i;F=E+k*(g&&F>E?1:-1),h=C+c*w.cos(F),i=D+d*w.sin(F),m=bO(h,i,c,d,e,0,g,I,J,[F,H,C,D])}G=F-E;var K=w.cos(E),L=w.sin(E),M=w.cos(F),N=w.sin(F),O=w.tan(G/4),P=4/3*c*O,Q=4/3*d*O,R=[a,b],S=[a+P*L,b-Q*K],T=[h+P*N,i-Q*M],U=[h,i];S[0]=2*R[0]-S[0],S[1]=2*R[1]-S[1];if(j)return[S,T,U][n](m);m=[S,T,U][n](m).join()[s](",");var V=[];for(var W=0,X=m.length;W<X;W++)V[W]=W%2?p(m[W-1],m[W],l).y:p(m[W],m[W+1],l).x;return V},bP=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:A(j,3)*a+A(j,2)*3*i*c+j*3*i*i*e+A(i,3)*g,y:A(j,3)*b+A(j,2)*3*i*d+j*3*i*i*f+A(i,3)*h}},bQ=bv(function(a,b,c,d,e,f,g,h){var i=e-2*c+a-(g-2*e+c),j=2*(c-a)-2*(e-c),k=a-c,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,o=[b,h],p=[a,g],q;z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y)),i=f-2*d+b-(h-2*f+d),j=2*(d-b)-2*(f-d),k=b-d,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y));return{min:{x:y[m](0,p),y:y[m](0,o)},max:{x:x[m](0,p),y:x[m](0,o)}}}),bR=a._path2curve=bv(function(a,b){var c=!b&&bz(a);if(!b&&c.curve)return bJ(c.curve);var d=bL(a),e=b&&bL(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=function(a,b){var c,d;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null);switch(a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][n](bO[m](0,[b.x,b.y][n](a.slice(1))));break;case"S":c=b.x+(b.x-(b.bx||b.x)),d=b.y+(b.y-(b.by||b.y)),a=["C",c,d][n](a.slice(1));break;case"T":b.qx=b.x+(b.x-(b.qx||b.x)),b.qy=b.y+(b.y-(b.qy||b.y)),a=["C"][n](bN(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][n](bN(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][n](bM(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][n](bM(b.x,b.y,a[1],b.y));break;case"V":a=["C"][n](bM(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][n](bM(b.x,b.y,b.X,b.Y))}return a},i=function(a,b){if(a[b].length>7){a[b].shift();var c=a[b];while(c.length)a.splice(b++,0,["C"][n](c.splice(0,6)));a.splice(b,1),l=x(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&a[g][0]=="M"&&b[g][0]!="M"&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=x(d.length,e&&e.length||0))};for(var k=0,l=x(d.length,e&&e.length||0);k<l;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var o=d[k],p=e&&e[k],q=o.length,r=e&&p.length;f.x=o[q-2],f.y=o[q-1],f.bx=Q(o[q-4])||f.x,f.by=Q(o[q-3])||f.y,g.bx=e&&(Q(p[r-4])||g.x),g.by=e&&(Q(p[r-3])||g.y),g.x=e&&p[r-2],g.y=e&&p[r-1]}e||(c.curve=bJ(d));return e?[d,e]:d},null,bJ),bS=a._parseDots=bv(function(b){var c=[];for(var d=0,e=b.length;d<e;d++){var f={},g=b[d].match(/^([^:]*):?([\d\.]*)/);f.color=a.getRGB(g[1]);if(f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),c.push(f)}for(d=1,e=c.length-1;d<e;d++)if(!c[d].offset){var h=Q(c[d-1].offset||0),i=0;for(var j=d+1;j<e;j++)if(c[j].offset){i=c[j].offset;break}i||(i=100,j=e),i=Q(i);var k=(i-h)/(j-d+1);for(;d<j;d++)h+=k,c[d].offset=h+"%"}return c}),bT=a._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)},bU=a._tofront=function(a,b){b.top!==a&&(bT(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},bV=a._toback=function(a,b){b.bottom!==a&&(bT(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},bW=a._insertafter=function(a,b,c){bT(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},bX=a._insertbefore=function(a,b,c){bT(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},bY=a.toMatrix=function(a,b){var c=bI(a),d={_:{transform:p},getBBox:function(){return c}};b$(d,b);return d.matrix},bZ=a.transformPath=function(a,b){return bj(a,bY(a,b))},b$=a._extractTransform=function(b,c){if(c==null)return b._.transform;c=r(c).replace(/\.{3}|\u2026/g,b._.transform||p);var d=a.parseTransformString(c),e=0,f=0,g=0,h=1,i=1,j=b._,k=new cb;j.transform=d||[];if(d)for(var l=0,m=d.length;l<m;l++){var n=d[l],o=n.length,q=r(n[0]).toLowerCase(),s=n[0]!=q,t=s?k.invert():0,u,v,w,x,y;q=="t"&&o==3?s?(u=t.x(0,0),v=t.y(0,0),w=t.x(n[1],n[2]),x=t.y(n[1],n[2]),k.translate(w-u,x-v)):k.translate(n[1],n[2]):q=="r"?o==2?(y=y||b.getBBox(1),k.rotate(n[1],y.x+y.width/2,y.y+y.height/2),e+=n[1]):o==4&&(s?(w=t.x(n[2],n[3]),x=t.y(n[2],n[3]),k.rotate(n[1],w,x)):k.rotate(n[1],n[2],n[3]),e+=n[1]):q=="s"?o==2||o==3?(y=y||b.getBBox(1),k.scale(n[1],n[o-1],y.x+y.width/2,y.y+y.height/2),h*=n[1],i*=n[o-1]):o==5&&(s?(w=t.x(n[3],n[4]),x=t.y(n[3],n[4]),k.scale(n[1],n[2],w,x)):k.scale(n[1],n[2],n[3],n[4]),h*=n[1],i*=n[2]):q=="m"&&o==7&&k.add(n[1],n[2],n[3],n[4],n[5],n[6]),j.dirtyT=1,b.matrix=k}b.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,h==1&&i==1&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1},b_=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return a.length==4?[b,0,a[2],a[3]]:[b,0];case"s":return a.length==5?[b,1,1,a[3],a[4]]:a.length==3?[b,1,1]:[b,1]}},ca=a._equaliseTransform=function(b,c){c=r(c).replace(/\.{3}|\u2026/g,b),b=a.parseTransformString(b)||[],c=a.parseTransformString(c)||[];var d=x(b.length,c.length),e=[],f=[],g=0,h,i,j,k;for(;g<d;g++){j=b[g]||b_(c[g]),k=c[g]||b_(j);if(j[0]!=k[0]||j[0].toLowerCase()=="r"&&(j[2]!=k[2]||j[3]!=k[3])||j[0].toLowerCase()=="s"&&(j[3]!=k[3]||j[4]!=k[4]))return;e[g]=[],f[g]=[];for(h=0,i=x(j.length,k.length);h<i;h++)h in j&&(e[g][h]=j[h]),h in k&&(f[g][h]=k[h])}return{from:e,to:f}};a._getContainer=function(b,c,d,e){var f;f=e==null&&!a.is(b,"object")?h.doc.getElementById(b):b;if(f!=null){if(f.tagName)return c==null?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:c,height:d};return{container:1,x:b,y:c,width:d,height:e}}},a.pathToRelative=bK,a._engine={},a.path2curve=bR,a.matrix=function(a,b,c,d,e,f){return new cb(a,b,c,d,e,f)},function(b){function d(a){var b=w.sqrt(c(a));a[0]&&(a[0]/=b),a[1]&&(a[1]/=b)}function c(a){return a[0]*a[0]+a[1]*a[1]}b.add=function(a,b,c,d,e,f){var g=[[],[],[]],h=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],i=[[a,c,e],[b,d,f],[0,0,1]],j,k,l,m;a&&a instanceof cb&&(i=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]);for(j=0;j<3;j++)for(k=0;k<3;k++){m=0;for(l=0;l<3;l++)m+=h[j][l]*i[l][k];g[j][k]=m}this.a=g[0][0],this.b=g[1][0],this.c=g[0][1],this.d=g[1][1],this.e=g[0][2],this.f=g[1][2]},b.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new cb(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},b.clone=function(){return new cb(this.a,this.b,this.c,this.d,this.e,this.f)},b.translate=function(a,b){this.add(1,0,0,1,a,b)},b.scale=function(a,b,c,d){b==null&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},b.rotate=function(b,c,d){b=a.rad(b),c=c||0,d=d||0;var e=+w.cos(b).toFixed(9),f=+w.sin(b).toFixed(9);this.add(e,f,-f,e,c,d),this.add(1,0,0,1,-c,-d)},b.x=function(a,b){return a*this.a+b*this.c+this.e},b.y=function(a,b){return a*this.b+b*this.d+this.f},b.get=function(a){return+this[r.fromCharCode(97+a)].toFixed(4)},b.toString=function(){return a.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},b.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},b.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},b.split=function(){var b={};b.dx=this.e,b.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];b.scalex=w.sqrt(c(e[0])),d(e[0]),b.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*b.shear,e[1][1]-e[0][1]*b.shear],b.scaley=w.sqrt(c(e[1])),d(e[1]),b.shear/=b.scaley;var f=-e[0][1],g=e[1][1];g<0?(b.rotate=a.deg(w.acos(g)),f<0&&(b.rotate=360-b.rotate)):b.rotate=a.deg(w.asin(f)),b.isSimple=!+b.shear.toFixed(9)&&(b.scalex.toFixed(9)==b.scaley.toFixed(9)||!b.rotate),b.isSuperSimple=!+b.shear.toFixed(9)&&b.scalex.toFixed(9)==b.scaley.toFixed(9)&&!b.rotate,b.noRotation=!+b.shear.toFixed(9)&&!b.rotate;return b},b.toTransformString=function(a){var b=a||this[s]();if(b.isSimple){b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4);return(b.dx||b.dy?"t"+[b.dx,b.dy]:p)+(b.scalex!=1||b.scaley!=1?"s"+[b.scalex,b.scaley,0,0]:p)+(b.rotate?"r"+[b.rotate,0,0]:p)}return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(cb.prototype);var cc=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);navigator.vendor=="Apple Computer, Inc."&&(cc&&cc[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&cc&&cc[1]<8?k.safari=function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:k.safari=be;var cd=function(){this.returnValue=!1},ce=function(){return this.originalEvent.preventDefault()},cf=function(){this.cancelBubble=!0},cg=function(){return this.originalEvent.stopPropagation()},ch=function(){if(h.doc.addEventListener)return function(a,b,c,d){var e=o&&u[b]?u[b]:b,f=function(e){var f=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,i=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,j=e.clientX+i,k=e.clientY+f;if(o&&u[g](b))for(var l=0,m=e.targetTouches&&e.targetTouches.length;l<m;l++)if(e.targetTouches[l].target==a){var n=e;e=e.targetTouches[l],e.originalEvent=n,e.preventDefault=ce,e.stopPropagation=cg;break}return c.call(d,e,j,k)};a.addEventListener(e,f,!1);return function(){a.removeEventListener(e,f,!1);return!0}};if(h.doc.attachEvent)return function(a,b,c,d){var e=function(a){a=a||h.win.event;var b=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;a.preventDefault=a.preventDefault||cd,a.stopPropagation=a.stopPropagation||cf;return c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){a.detachEvent("on"+b,e);return!0};return f}}(),ci=[],cj=function(a){var b=a.clientX,c=a.clientY,d=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f,g=ci.length;while(g--){f=ci[g];if(o){var i=a.touches.length,j;while(i--){j=a.touches[i];if(j.identifier==f.el._drag.id){b=j.clientX,c=j.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}}else a.preventDefault();var k=f.el.node,l,m=k.nextSibling,n=k.parentNode,p=k.style.display;h.win.opera&&n.removeChild(k),k.style.display="none",l=f.el.paper.getElementByPoint(b,c),k.style.display=p,h.win.opera&&(m?n.insertBefore(k,m):n.appendChild(k)),l&&eve("raphael.drag.over."+f.el.id,f.el,l),b+=e,c+=d,eve("raphael.drag.move."+f.el.id,f.move_scope||f.el,b-f.el._drag.x,c-f.el._drag.y,b,c,a)}},ck=function(b){a.unmousemove(cj).unmouseup(ck);var c=ci.length,d;while(c--)d=ci[c],d.el._drag={},eve("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,b);ci=[]},cl=a.el={};for(var cm=t.length;cm--;)(function(b){a[b]=cl[b]=function(c,d){a.is(c,"function")&&(this.events=this.events||[],this.events.push({name:b,f:c,unbind:ch(this.shape||this.node||h.doc,b,c,d||this)}));return this},a["un"+b]=cl["un"+b]=function(a){var c=this.events||[],d=c.length;while(d--)if(c[d].name==b&&c[d].f==a){c[d].unbind(),c.splice(d,1),!c.length&&delete this.events;return this}return this}})(t[cm]);cl.data=function(b,c){var d=bb[this.id]=bb[this.id]||{};if(arguments.length==1){if(a.is(b,"object")){for(var e in b)b[g](e)&&this.data(e,b[e]);return this}eve("raphael.data.get."+this.id,this,d[b],b);return d[b]}d[b]=c,eve("raphael.data.set."+this.id,this,c,b);return this},cl.removeData=function(a){a==null?bb[this.id]={}:bb[this.id]&&delete bb[this.id][a];return this},cl.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},cl.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var cn=[];cl.drag=function(b,c,d,e,f,g){function i(i){(i.originalEvent||i).preventDefault();var j=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,k=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft;this._drag.x=i.clientX+k,this._drag.y=i.clientY+j,this._drag.id=i.identifier,!ci.length&&a.mousemove(cj).mouseup(ck),ci.push({el:this,move_scope:e,start_scope:f,end_scope:g}),c&&eve.on("raphael.drag.start."+this.id,c),b&&eve.on("raphael.drag.move."+this.id,b),d&&eve.on("raphael.drag.end."+this.id,d),eve("raphael.drag.start."+this.id,f||e||this,i.clientX+k,i.clientY+j,i)}this._drag={},cn.push({el:this,start:i}),this.mousedown(i);return this},cl.onDragOver=function(a){a?eve.on("raphael.drag.over."+this.id,a):eve.unbind("raphael.drag.over."+this.id)},cl.undrag=function(){var b=cn.length;while(b--)cn[b].el==this&&(this.unmousedown(cn[b].start),cn.splice(b,1),eve.unbind("raphael.drag.*."+this.id));!cn.length&&a.unmousemove(cj).unmouseup(ck)},k.circle=function(b,c,d){var e=a._engine.circle(this,b||0,c||0,d||0);this.__set__&&this.__set__.push(e);return e},k.rect=function(b,c,d,e,f){var g=a._engine.rect(this,b||0,c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.ellipse=function(b,c,d,e){var f=a._engine.ellipse(this,b||0,c||0,d||0,e||0);this.__set__&&this.__set__.push(f);return f},k.path=function(b){b&&!a.is(b,D)&&!a.is(b[0],E)&&(b+=p);var c=a._engine.path(a.format[m](a,arguments),this);this.__set__&&this.__set__.push(c);return c},k.image=function(b,c,d,e,f){var g=a._engine.image(this,b||"about:blank",c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.text=function(b,c,d){var e=a._engine.text(this,b||0,c||0,r(d));this.__set__&&this.__set__.push(e);return e},k.set=function(b){!a.is(b,"array")&&(b=Array.prototype.splice.call(arguments,0,arguments.length));var c=new cG(b);this.__set__&&this.__set__.push(c);return c},k.setStart=function(a){this.__set__=a||this.set()},k.setFinish=function(a){var b=this.__set__;delete this.__set__;return b},k.setSize=function(b,c){return a._engine.setSize.call(this,b,c)},k.setViewBox=function(b,c,d,e,f){return a._engine.setViewBox.call(this,b,c,d,e,f)},k.top=k.bottom=null,k.raphael=a;var co=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,i=b.top+(h.win.pageYOffset||e.scrollTop||d.scrollTop)-f,j=b.left+(h.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:i,x:j}};k.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=h.doc.elementFromPoint(a,b);if(h.win.opera&&e.tagName=="svg"){var f=co(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var i=d.getIntersectionList(g,null);i.length&&(e=i[i.length-1])}if(!e)return null;while(e.parentNode&&e!=d.parentNode&&!e.raphael)e=e.parentNode;e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null;return e},k.getById=function(a){var b=this.bottom;while(b){if(b.id==a)return b;b=b.next}return null},k.forEach=function(a,b){var c=this.bottom;while(c){if(a.call(b,c)===!1)return this;c=c.next}return this},k.getElementsByPoint=function(a,b){var c=this.set();this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)});return c},cl.isPointInside=function(b,c){var d=this.realPath=this.realPath||bi[this.type](this);return a.isPointInsidePath(d,b,c)},cl.getBBox=function(a){if(this.removed)return{};var b=this._;if(a){if(b.dirty||!b.bboxwt)this.realPath=bi[this.type](this),b.bboxwt=bI(this.realPath),b.bboxwt.toString=cq,b.dirty=0;return b.bboxwt}if(b.dirty||b.dirtyT||!b.bbox){if(b.dirty||!this.realPath)b.bboxwt=0,this.realPath=bi[this.type](this);b.bbox=bI(bj(this.realPath,this.matrix)),b.bbox.toString=cq,b.dirty=b.dirtyT=0}return b.bbox},cl.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(a);return a},cl.glow=function(a){if(this.type=="text")return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||bi[this.type](this);f=this.matrix?bj(f,this.matrix):f;for(var g=1;g<c+1;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cr={},cs=function(b,c,d,e,f,g,h,i,j){return j==null?bB(b,c,d,e,f,g,h,i):a.findDotsAtSegment(b,c,d,e,f,g,h,i,bC(b,c,d,e,f,g,h,i,j))},ct=function(b,c){return function(d,e,f){d=bR(d);var g,h,i,j,k="",l={},m,n=0;for(var o=0,p=d.length;o<p;o++){i=d[o];if(i[0]=="M")g=+i[1],h=+i[2];else{j=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6]);if(n+j>e){if(c&&!l.start){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),k+=["C"+m.start.x,m.start.y,m.m.x,m.m.y,m.x,m.y];if(f)return k;l.start=k,k=["M"+m.x,m.y+"C"+m.n.x,m.n.y,m.end.x,m.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!b&&!c){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n);return{x:m.x,y:m.y,alpha:m.alpha}}}n+=j,g=+i[5],h=+i[6]}k+=i.shift()+i}l.end=k,m=b?n:c?l:a.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),m.alpha&&(m={x:m.x,y:m.y,alpha:m.alpha});return m}},cu=ct(1),cv=ct(),cw=ct(0,1);a.getTotalLength=cu,a.getPointAtLength=cv,a.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return cw(a,b).end;var d=cw(a,c,1);return b?cw(d,b).end:d},cl.getTotalLength=function(){if(this.type=="path"){if(this.node.getTotalLength)return this.node.getTotalLength();return cu(this.attrs.path)}},cl.getPointAtLength=function(a){if(this.type=="path")return cv(this.attrs.path,a)},cl.getSubpath=function(b,c){if(this.type=="path")return a.getSubpath(this.attrs.path,b,c)};var cx=a.easing_formulas={linear:function(a){return a},"<":function(a){return A(a,1.7)},">":function(a){return A(a,.48)},"<>":function(a){var b=.48-a/1.04,c=w.sqrt(.1734+b*b),d=c-b,e=A(z(d),1/3)*(d<0?-1:1),f=-c-b,g=A(z(f),1/3)*(f<0?-1:1),h=e+g+.5;return(1-h)*3*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a=a-1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){if(a==!!a)return a;return A(2,-10*a)*w.sin((a-.075)*2*B/.3)+1},bounce:function(a){var b=7.5625,c=2.75,d;a<1/c?d=b*a*a:a<2/c?(a-=1.5/c,d=b*a*a+.75):a<2.5/c?(a-=2.25/c,d=b*a*a+.9375):(a-=2.625/c,d=b*a*a+.984375);return d}};cx.easeIn=cx["ease-in"]=cx["<"],cx.easeOut=cx["ease-out"]=cx[">"],cx.easeInOut=cx["ease-in-out"]=cx["<>"],cx["back-in"]=cx.backIn,cx["back-out"]=cx.backOut;var cy=[],cz=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,16)},cA=function(){var b=+(new Date),c=0;for(;c<cy.length;c++){var d=cy[c];if(d.el.removed||d.paused)continue;var e=b-d.start,f=d.ms,h=d.easing,i=d.from,j=d.diff,k=d.to,l=d.t,m=d.el,o={},p,r={},s;d.initstatus?(e=(d.initstatus*d.anim.top-d.prev)/(d.percent-d.prev)*f,d.status=d.initstatus,delete d.initstatus,d.stop&&cy.splice(c--,1)):d.status=(d.prev+(d.percent-d.prev)*(e/f))/d.anim.top;if(e<0)continue;if(e<f){var t=h(e/f);for(var u in i)if(i[g](u)){switch(U[u]){case C:p=+i[u]+t*f*j[u];break;case"colour":p="rgb("+[cB(O(i[u].r+t*f*j[u].r)),cB(O(i[u].g+t*f*j[u].g)),cB(O(i[u].b+t*f*j[u].b))].join(",")+")";break;case"path":p=[];for(var v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(var x=1,y=i[u][v].length;x<y;x++)p[v][x]=+i[u][v][x]+t*f*j[u][v][x];p[v]=p[v].join(q)}p=p.join(q);break;case"transform":if(j[u].real){p=[];for(v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(x=1,y=i[u][v].length;x<y;x++)p[v][x]=i[u][v][x]+t*f*j[u][v][x]}}else{var z=function(a){return+i[u][a]+t*f*j[u][a]};p=[["m",z(0),z(1),z(2),z(3),z(4),z(5)]]}break;case"csv":if(u=="clip-rect"){p=[],v=4;while(v--)p[v]=+i[u][v]+t*f*j[u][v]}break;default:var A=[][n](i[u]);p=[],v=m.paper.customAttributes[u].length;while(v--)p[v]=+A[v]+t*f*j[u][v]}o[u]=p}m.attr(o),function(a,b,c){setTimeout(function(){eve("raphael.anim.frame."+a,b,c)})}(m.id,m,d.anim)}else{(function(b,c,d){setTimeout(function(){eve("raphael.anim.frame."+c.id,c,d),eve("raphael.anim.finish."+c.id,c,d),a.is(b,"function")&&b.call(c)})})(d.callback,m,d.anim),m.attr(k),cy.splice(c--,1);if(d.repeat>1&&!d.next){for(s in k)k[g](s)&&(r[s]=d.totalOrigin[s]);d.el.attr(r),cE(d.anim,d.el,d.anim.percents[0],null,d.totalOrigin,d.repeat-1)}d.next&&!d.stop&&cE(d.anim,d.el,d.next,null,d.totalOrigin,d.repeat)}}a.svg&&m&&m.paper&&m.paper.safari(),cy.length&&cz(cA)},cB=function(a){return a>255?255:a<0?0:a};cl.animateWith=function(b,c,d,e,f,g){var h=this;if(h.removed){g&&g.call(h);return h}var i=d instanceof cD?d:a.animation(d,e,f,g),j,k;cE(i,h,i.percents[0],null,h.attr());for(var l=0,m=cy.length;l<m;l++)if(cy[l].anim==c&&cy[l].el==b){cy[m-1].start=cy[l].start;break}return h},cl.onAnimation=function(a){a?eve.on("raphael.anim.frame."+this.id,a):eve.unbind("raphael.anim.frame."+this.id);return this},cD.prototype.delay=function(a){var b=new cD(this.anim,this.ms);b.times=this.times,b.del=+a||0;return b},cD.prototype.repeat=function(a){var b=new cD(this.anim,this.ms);b.del=this.del,b.times=w.floor(x(a,0))||1;return b},a.animation=function(b,c,d,e){if(b instanceof cD)return b;if(a.is(d,"function")||!d)e=e||d||null,d=null;b=Object(b),c=+c||0;var f={},h,i;for(i in b)b[g](i)&&Q(i)!=i&&Q(i)+"%"!=i&&(h=!0,f[i]=b[i]);if(!h)return new cD(b,c);d&&(f.easing=d),e&&(f.callback=e);return new cD({100:f},c)},cl.animate=function(b,c,d,e){var f=this;if(f.removed){e&&e.call(f);return f}var g=b instanceof cD?b:a.animation(b,c,d,e);cE(g,f,g.percents[0],null,f.attr());return f},cl.setTime=function(a,b){a&&b!=null&&this.status(a,y(b,a.ms)/a.ms);return this},cl.status=function(a,b){var c=[],d=0,e,f;if(b!=null){cE(a,this,-1,y(b,1));return this}e=cy.length;for(;d<e;d++){f=cy[d];if(f.el.id==this.id&&(!a||f.anim==a)){if(a)return f.status;c.push({anim:f.anim,status:f.status})}}if(a)return 0;return c},cl.pause=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.pause."+this.id,this,cy[b].anim)!==!1&&(cy[b].paused=!0);return this},cl.resume=function(a){for(var b=0;b<cy.length;b++)if(cy[b].el.id==this.id&&(!a||cy[b].anim==a)){var c=cy[b];eve("raphael.anim.resume."+this.id,this,c.anim)!==!1&&(delete c.paused,this.status(c.anim,c.status))}return this},cl.stop=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.stop."+this.id,this,cy[b].anim)!==!1&&cy.splice(b--,1);return this},eve.on("raphael.remove",cF),eve.on("raphael.clear",cF),cl.toString=function(){return"Rapha�l�s object"};var cG=function(a){this.items=[],this.length=0,this.type="set";if(a)for(var b=0,c=a.length;b<c;b++)a[b]&&(a[b].constructor==cl.constructor||a[b].constructor==cG)&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},cH=cG.prototype;cH.push=function(){var a,b;for(var c=0,d=arguments.length;c<d;c++)a=arguments[c],a&&(a.constructor==cl.constructor||a.constructor==cG)&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},cH.pop=function(){this.length&&delete this[this.length--];return this.items.pop()},cH.forEach=function(a,b){for(var c=0,d=this.items.length;c<d;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var cI in cl)cl[g](cI)&&(cH[cI]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][m](c,b)})}}(cI));cH.attr=function(b,c){if(b&&a.is(b,E)&&a.is(b[0],"object"))for(var d=0,e=b.length;d<e;d++)this.items[d].attr(b[d]);else for(var f=0,g=this.items.length;f<g;f++)this.items[f].attr(b,c);return this},cH.clear=function(){while(this.length)this.pop()},cH.splice=function(a,b,c){a=a<0?x(this.length+a,0):a,b=x(0,y(this.length-a,b));var d=[],e=[],f=[],g;for(g=2;g<arguments.length;g++)f.push(arguments[g]);for(g=0;g<b;g++)e.push(this[a+g]);for(;g<this.length-a;g++)d.push(this[a+g]);var h=f.length;for(g=0;g<h+d.length;g++)this.items[a+g]=this[a+g]=g<h?f[g]:d[g-h];g=this.items.length=this.length-=b-h;while(this[g])delete this[g++];return new cG(e)},cH.exclude=function(a){for(var b=0,c=this.length;b<c;b++)if(this[b]==a){this.splice(b,1);return!0}},cH.animate=function(b,c,d,e){(a.is(d,"function")||!d)&&(e=d||null);var f=this.items.length,g=f,h,i=this,j;if(!f)return this;e&&(j=function(){!--f&&e.call(i)}),d=a.is(d,D)?d:j;var k=a.animation(b,c,d,j);h=this.items[--g].animate(k);while(g--)this.items[g]&&!this.items[g].removed&&this.items[g].animateWith(h,k,k);return this},cH.insertAfter=function(a){var b=this.items.length;while(b--)this.items[b].insertAfter(a);return this},cH.getBBox=function(){var a=[],b=[],c=[],d=[];for(var e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}a=y[m](0,a),b=y[m](0,b),c=x[m](0,c),d=x[m](0,d);return{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},cH.clone=function(a){a=new cG;for(var b=0,c=this.items.length;b<c;b++)a.push(this.items[b].clone());return a},cH.toString=function(){return"Rapha�l�s set"},a.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[g](d)&&(b.face[d]=a.face[d]);this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b];if(!a.svg){b.face["units-per-em"]=R(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[g](e)){var f=a.glyphs[e];b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"};if(f.k)for(var h in f.k)f[g](h)&&(b.glyphs[e].k[h]=f.k[h])}}return a},k.getFont=function(b,c,d,e){e=e||"normal",d=d||"normal",c=+c||{normal:400,bold:700,lighter:300,bolder:800}[c]||400;if(!!a.fonts){var f=a.fonts[b];if(!f){var h=new RegExp("(^|\\s)"+b.replace(/[^\w\d\s+!~.:_-]/g,p)+"(\\s|$)","i");for(var i in a.fonts)if(a.fonts[g](i)&&h.test(i)){f=a.fonts[i];break}}var j;if(f)for(var k=0,l=f.length;k<l;k++){j=f[k];if(j.face["font-weight"]==c&&(j.face["font-style"]==d||!j.face["font-style"])&&j.face["font-stretch"]==e)break}return j}},k.print=function(b,d,e,f,g,h,i){h=h||"middle",i=x(y(i||0,1),-1);var j=r(e)[s](p),k=0,l=0,m=p,n;a.is(f,e)&&(f=this.getFont(f));if(f){n=(g||16)/f.face["units-per-em"];var o=f.face.bbox[s](c),q=+o[0],t=o[3]-o[1],u=0,v=+o[1]+(h=="baseline"?t+ +f.face.descent:t/2);for(var w=0,z=j.length;w<z;w++){if(j[w]=="\n")k=0,B=0,l=0,u+=t;else{var A=l&&f.glyphs[j[w-1]]||{},B=f.glyphs[j[w]];k+=l?(A.w||f.w)+(A.k&&A.k[j[w]]||0)+f.w*i:0,l=1}B&&B.d&&(m+=a.transformPath(B.d,["t",k*n,u*n,"s",n,n,q,v,"t",(b-q)/n,(d-v)/n]))}}return this.path(m).attr({fill:"#000",stroke:"none"})},k.add=function(b){if(a.is(b,"array")){var c=this.set(),e=0,f=b.length,h;for(;e<f;e++)h=b[e]||{},d[g](h.type)&&c.push(this[h.type]().attr(h))}return c},a.format=function(b,c){var d=a.is(c,E)?[0][n](c):arguments;b&&a.is(b,D)&&d.length-1&&(b=b.replace(e,function(a,b){return d[++b]==null?p:d[b]}));return b||p},a.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),typeof e=="function"&&f&&(e=e()))}),e=(e==null||e==d?a:e)+"";return e};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),a.ninja=function(){i.was?h.win.Raphael=i.is:delete Raphael;return a},a.st=cH,function(b,c,d){function e(){/in/.test(b.readyState)?setTimeout(e,9):a.eve("raphael.DOMload")}b.readyState==null&&b.addEventListener&&(b.addEventListener(c,d=function(){b.removeEventListener(c,d,!1),b.readyState="complete"},!1),b.readyState="loading"),e()}(document,"DOMContentLoaded"),i.was?h.win.Raphael=a:Raphael=a,eve.on("raphael.DOMload",function(){b=!0})}(),window.Raphael.svg&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=a.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};a.toString=function(){return"Your browser supports SVG.\nYou are running Rapha�l "+this.version};var q=function(d,e){if(e){typeof d=="string"&&(d=q(d));for(var f in e)e[b](f)&&(f.substring(0,6)=="xlink:"?d.setAttributeNS(n,f.substring(6),c(e[f])):d.setAttribute(f,c(e[f])))}else d=a._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(b,e){var j="linear",k=b.id+e,m=.5,n=.5,o=b.node,p=b.paper,r=o.style,s=a._g.doc.getElementById(k);if(!s){e=c(e).replace(a._radial_gradient,function(a,b,c){j="radial";if(b&&c){m=d(b),n=d(c);var e=(n>.5)*2-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&n!=.5&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/);if(j=="linear"){var t=e.shift();t=-d(t);if(isNaN(t))return null;var u=[0,0,f.cos(a.rad(t)),f.sin(a.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=a._parseDots(e);if(!w)return null;k=k.replace(/[\(\)\s,\xb0#]/g,"_"),b.gradient&&k!=b.gradient.id&&(p.defs.removeChild(b.gradient),delete b.gradient);if(!b.gradient){s=q(j+"Gradient",{id:k}),b.gradient=s,q(s,j=="radial"?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:b.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;x<y;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1;return 1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if(d.type=="path"){var g=c(e).toLowerCase().split("-"),h=d.paper,i=f?"end":"start",j=d.node,k=d.attrs,m=k["stroke-width"],n=g.length,r="classic",s,t,u,v,w,x=3,y=3,z=5;while(n--)switch(g[n]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":r=g[n];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}r=="open"?(x+=2,y+=2,z+=2,u=1,v=f?4:1,w={fill:"none",stroke:k.stroke}):(v=u=x/2,w={fill:k.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={};if(r!="none"){var A="raphael-marker-"+r,B="raphael-marker-"+i+r+x+y;a._g.doc.getElementById(A)?p[A]++:(h.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[r],id:A})),p[A]=1);var C=a._g.doc.getElementById(B),D;C?(p[B]++,D=C.getElementsByTagName("use")[0]):(C=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:v,refY:y/2}),D=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),C.appendChild(D),h.defs.appendChild(C),p[B]=1),q(D,w);var F=u*(r!="diamond"&&r!="oval");f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-F*m):(s=F*m,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),w={},w["marker-"+i]="url(#"+B+")";if(t||s)w.d=Raphael.getSubpath(k.path,s,t);q(j,w),d._.arrows[i+"Path"]=A,d._.arrows[i+"Marker"]=B,d._.arrows[i+"dx"]=F,d._.arrows[i+"Type"]=r,d._.arrows[i+"String"]=e}else f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-s):(s=0,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),d._.arrows[i+"Path"]&&q(j,{d:Raphael.getSubpath(k.path,s,t)}),delete d._.arrows[i+"Path"],delete d._.arrows[i+"Marker"],delete d._.arrows[i+"dx"],delete d._.arrows[i+"Type"],delete d._.arrows[i+"String"];for(w in p)if(p[b](w)&&!p[w]){var G=a._g.doc.getElementById(w);G&&G.parentNode.removeChild(G)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,b,d){b=u[c(b).toLowerCase()];if(b){var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=b.length;while(h--)g[h]=b[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[b](o)){if(!a._availableAttrs[b](o))continue;var p=f[o];k[o]=p;switch(o){case"blur":d.blur(p);break;case"href":case"title":case"target":var u=i.parentNode;if(u.tagName.toLowerCase()!="a"){var w=q("a");u.insertBefore(w,i),w.appendChild(i),u=w}o=="target"?u.setAttributeNS(n,"show",p=="blank"?"new":p):u.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var x=c(p).split(j);if(x.length==4){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var z=q("clipPath"),A=q("rect");z.id=a.createUUID(),q(A,{x:x[0],y:x[1],width:x[2],height:x[3]}),z.appendChild(A),d.paper.defs.appendChild(z),q(i,{"clip-path":"url(#"+z.id+")"}),d.clip=A}if(!p){var B=i.getAttribute("clip-path");if(B){var C=a._g.doc.getElementById(B.replace(/(^url\(#|\)$)/g,l));C&&C.parentNode.removeChild(C),q(i,{"clip-path":l}),delete d.clip}}break;case"path":d.type=="path"&&(q(i,{d:p?k.path=a._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":i.setAttribute(o,p),d._.dirty=1;if(k.fx)o="x",p=k.x;else break;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if(o=="rx"&&d.type=="rect")break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":i.setAttribute(o,p),d._.dirty=1;if(k.fy)o="y",p=k.y;else break;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if(o=="ry"&&d.type=="rect")break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":d.type=="rect"?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":d.type=="image"&&i.setAttributeNS(n,"href",p);break;case"stroke-width":if(d._.sx!=1||d._.sy!=1)p/=g(h(d._.sx),h(d._.sy))||1;d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var D=c(p).match(a._ISURL);if(D){z=q("pattern");var F=q("image");z.id=a.createUUID(),q(z,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(F,{x:0,y:0,"xlink:href":D[1]}),z.appendChild(F),function(b){a._preload(D[1],function(){var a=this.offsetWidth,c=this.offsetHeight;q(b,{width:a,height:c}),q(F,{width:a,height:c}),d.paper.safari()})}(z),d.paper.defs.appendChild(z),q(i,{fill:"url(#"+z.id+")"}),d.pattern=z,d.pattern&&s(d);break}var G=a.getRGB(p);if(!G.error)delete f.gradient,delete k.gradient,!a.is(k.opacity,"undefined")&&a.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!a.is(k["fill-opacity"],"undefined")&&a.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});else if((d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(H){var I=H.getElementsByTagName("stop");q(I[I.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}G[b]("opacity")&&q(i,{"fill-opacity":G.opacity>1?G.opacity/100:G.opacity});case"stroke":G=a.getRGB(p),i.setAttribute(o,G.hex),o=="stroke"&&G[b]("opacity")&&q(i,{"stroke-opacity":G.opacity>1?G.opacity/100:G.opacity}),o=="stroke"&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":(d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p);break;case"opacity":k.gradient&&!k[b]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),H&&(I=H.getElementsByTagName("stop"),q(I[I.length-1],{"stop-opacity":p}));break};default:o=="font-size"&&(p=e(p,10)+"px");var J=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[J]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if(d.type=="text"&&!!(f[b]("text")||f[b]("font")||f[b]("font-size")||f[b]("x")||f[b]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(a._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;if(f[b]("text")){g.text=f.text;while(h.firstChild)h.removeChild(h.firstChild);var j=c(f.text).split("\n"),k=[],m;for(var n=0,o=j.length;n<o;n++)m=q("tspan"),n&&q(m,{dy:i*x,x:g.x}),m.appendChild(a._g.doc.createTextNode(j[n])),h.appendChild(m),k[n]=m}else{k=h.getElementsByTagName("tspan");for(n=0,o=k.length;n<o;n++)n?q(k[n],{dy:i*x,x:g.x}):q(k[0],{dy:0})}q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&a.is(r,"finite")&&q(k[0],{dy:r})}},z=function(b,c){var d=0,e=0;this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.matrix=a.matrix(),this.realPath=null,this.paper=c,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},A=a.el;z.prototype=A,A.constructor=z,a._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);d.type="path",w(d,{fill:"none",stroke:"#000",path:a});return d},A.rotate=function(a,b,e){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this.transform(this._.transform.concat([["r",a,b,e]]));return this},A.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]]));return this},A.translate=function(a,b){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this.transform(this._.transform.concat([["t",a,b]]));return this},A.transform=function(c){var d=this._;if(c==null)return d.transform;a._extractTransform(this,c),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix});if(d.sx!=1||d.sy!=1){var e=this.attrs[b]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this},A.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this},A.remove=function(){if(!this.removed&&!!this.node.parentNode){var b=this.paper;b.__set__&&b.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&b.defs.removeChild(this.gradient),a._tear(this,b),this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var c in this)this[c]=typeof this[c]=="function"?a._removedFactory(c):null;this.removed=!0}},A._getBBox=function(){if(this.node.style.display=="none"){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}a&&this.hide();return b},A.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;if(c=="transform")return this._.transform;var g=c.split(j),h={};for(var i=0,l=g.length;i<l;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return l-1?h:h[g[0]]}if(d==null&&a.is(c,"array")){h={};for(i=0,l=c.length;i<l;i++)h[c[i]]=this.attr(c[i]);return h}if(d!=null){var m={};m[c]=d}else c!=null&&a.is(c,"object")&&(m=c);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[b](n)&&m[b](n)&&a.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[b](p)&&(m[p]=o[p])}w(this,m);return this},A.toFront=function(){if(this.removed)return this;this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var b=this.paper;b.top!=this&&a._tofront(this,b);return this},A.toBack=function(){if(this.removed)return this;var b=this.node.parentNode;b.tagName.toLowerCase()=="a"?b.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):b.firstChild!=this.node&&b.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper);var c=this.paper;return this},A.insertAfter=function(b){if(this.removed)return this;var c=b.node||b[b.length-1].node;c.nextSibling?c.parentNode.insertBefore(this.node,c.nextSibling):c.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},A.insertBefore=function(b){if(this.removed)return this;var c=b.node||b[0].node;c.parentNode.insertBefore(this.node,c),a._insertbefore(this,b,this.paper);return this},A.blur=function(b){var c=this;if(+b!==0){var d=q("filter"),e=q("feGaussianBlur");c.attrs.blur=b,d.id=a.createUUID(),q(e,{stdDeviation:+b||1.5}),d.appendChild(e),c.paper.defs.appendChild(d),c._blur=d,q(c.node,{filter:"url(#"+d.id+")"})}else c._blur&&(c._blur.parentNode.removeChild(c._blur),delete c._blur,delete c.attrs.blur),c.node.removeAttribute("filter")},a._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs);return f},a._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs);return h},a._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs);return g},a._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image";return h},a._engine.text=function(b,c,d,e){var f=q("text");b.canvas&&b.canvas.appendChild(f);var g=new z(f,b);g.attrs={x:c,y:d,"text-anchor":"middle",text:e,font:a._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs);return g},a._engine.setSize=function(a,b){this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox);return this},a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b&&b.container,d=b.x,e=b.y,f=b.width,g=b.height;if(!c)throw new Error("SVG container not found.");var h=q("svg"),i="overflow:hidden;",j;d=d||0,e=e||0,f=f||512,g=g||342,q(h,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),c==1?(h.style.cssText=i+"position:absolute;left:"+d+"px;top:"+e+"px",a._g.doc.body.appendChild(h),j=1):(h.style.cssText=i+"position:relative",c.firstChild?c.insertBefore(h,c.firstChild):c.appendChild(h)),c=new a._Paper,c.width=f,c.height=g,c.canvas=h,c.clear(),c._left=c._top=0,j&&(c.renderfix=function(){}),c.renderfix();return c},a._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f=g(c/this.width,d/this.height),h=this.top,i=e?"meet":"xMinYMin",j,l;a==null?(this._vbSize&&(f=1),delete this._vbSize,j="0 0 "+this.width+m+this.height):(this._vbSize=f,j=a+m+b+m+c+m+d),q(this.canvas,{viewBox:j,preserveAspectRatio:i});while(f&&h)l="stroke-width"in h.attrs?h.attrs["stroke-width"]:1,h.attr({"stroke-width":l}),h._.dirty=1,h._.dirtyT=1,h=h.prev;this._viewBox=[a,b,c,d,!!e];return this},a.prototype.renderfix=function(){var a=this.canvas,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}var e=-c.e%1,f=-c.f%1;if(e||f)e&&(this._left=(this._left+e)%1,b.left=this._left+"px"),f&&(this._top=(this._top+f)%1,b.top=this._top+"px")},a.prototype.clear=function(){a.eve("raphael.clear",this);var b=this.canvas;while(b.firstChild)b.removeChild(b.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(a._g.doc.createTextNode("Created with Rapha�l "+a.version)),b.appendChild(this.desc),b.appendChild(this.defs=q("defs"))},a.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null};var B=a.st;for(var C in A)A[b](C)&&!B[b](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}(window.Raphael),window.Raphael.vml&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=a.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(b){var d=/[ahqstv]/ig,e=a._pathToAbsolute;c(b).match(d)&&(e=a._path2curve),d=/[clmz]/g;if(e==a._pathToAbsolute&&!c(b).match(d)){var g=c(b).replace(q,function(a,b,c){var d=[],e=b.toLowerCase()=="m",g=p[b];c.replace(s,function(a){e&&d.length==2&&(g+=d+p[b=="m"?"l":"L"],d=[]),d.push(f(a*u))});return g+d});return g}var h=e(b),i,j;g=[];for(var k=0,l=h.length;k<l;k++){i=h[k],j=h[k][0].toLowerCase(),j=="z"&&(j="x");for(var m=1,r=i.length;m<r;m++)j+=f(i[m]*u)+(m!=r-1?",":o);g.push(j)}return g.join(n)},y=function(b,c,d){var e=a.matrix();e.rotate(-b,.5,.5);return{dx:e.x(c,d),dy:e.y(c,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q,r=u/b,s=u/c;m.visibility="hidden";if(!!b&&!!c){l.coordsize=i(r)+n+i(s),m.rotation=f*(b*c<0?-1:1);if(f){var t=y(f,d,e);d=t.dx,e=t.dy}b<0&&(p+="x"),c<0&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-r+n+e*-s;if(k||g.fillsize){var v=l.getElementsByTagName(j);v=v&&v[0],l.removeChild(v),k&&(t=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),v.position=t.dx*o+n+t.dy*o),g.fillsize&&(v.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(v)}m.visibility="visible"}};a.toString=function(){return"Your browser doesn�t support SVG. Falling down to VML.\nYou are running Rapha�l "+this.version};var A=function(a,b,d){var e=c(b).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";while(g--)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q,r=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),s=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),t=e;for(var y in i)i[b](y)&&(m[y]=i[y]);r&&(m.path=a._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur);if(i.path&&e.type=="path"||r)l.path=x(~c(m.path).toLowerCase().indexOf("r")?a._pathToAbsolute(m.path):m.path),e.type=="image"&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0));"transform"in i&&e.transform(i.transform);if(s){var B=+m.cx,D=+m.cy,E=+m.rx||+m.r||0,G=+m.ry||+m.r||0;l.path=a.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((B-E)*u),f((D-G)*u),f((B+E)*u),f((D+G)*u),f(B*u))}if("clip-rect"in i){var H=c(i["clip-rect"]).split(k);if(H.length==4){H[2]=+H[2]+ +H[0],H[3]=+H[3]+ +H[1];var I=l.clipRect||a._g.doc.createElement("div"),J=I.style;J.clip=a.format("rect({1}px {2}px {3}px {0}px)",H),l.clipRect||(J.position="absolute",J.top=0,J.left=0,J.width=e.paper.width+"px",J.height=e.paper.height+"px",l.parentNode.insertBefore(I,l),I.appendChild(l),l.clipRect=I)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var K=e.textpath.style;i.font&&(K.font=i.font),i["font-family"]&&(K.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(K.fontSize=i["font-size"]),i["font-weight"]&&(K.fontWeight=i["font-weight"]),i["font-style"]&&(K.fontStyle=i["font-style"])}"arrow-start"in i&&A(t,i["arrow-start"]),"arrow-end"in i&&A(t,i["arrow-end"],1);if(i.opacity!=null||i["stroke-width"]!=null||i.fill!=null||i.src!=null||i.stroke!=null||i["stroke-width"]!=null||i["stroke-opacity"]!=null||i["fill-opacity"]!=null||i["stroke-dasharray"]!=null||i["stroke-miterlimit"]!=null||i["stroke-linejoin"]!=null||i["stroke-linecap"]!=null){var L=l.getElementsByTagName(j),M=!1;L=L&&L[0],!L&&(M=L=F(j)),e.type=="image"&&i.src&&(L.src=i.src),i.fill&&(L.on=!0);if(L.on==null||i.fill=="none"||i.fill===null)L.on=!1;if(L.on&&i.fill){var N=c(i.fill).match(a._ISURL);if(N){L.parentNode==l&&l.removeChild(L),L.rotate=!0,L.src=N[1],L.type="tile";var O=e.getBBox(1);L.position=O.x+n+O.y,e._.fillpos=[O.x,O.y],a._preload(N[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else L.color=a.getRGB(i.fill).hex,L.src=o,L.type="solid",a.getRGB(i.fill).error&&(t.type in{circle:1,ellipse:1}||c(i.fill).charAt()!="r")&&C(t,i.fill,L)&&(m.fill="none",m.gradient=i.fill,L.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var P=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+a.getRGB(i.fill).o+1||2)-1);P=h(g(P,0),1),L.opacity=P,L.src&&(L.color="none")}l.appendChild(L);var Q=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],T=!1;!Q&&(T=Q=F("stroke"));if(i.stroke&&i.stroke!="none"||i["stroke-width"]||i["stroke-opacity"]!=null||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])Q.on=!0;(i.stroke=="none"||i.stroke===null||Q.on==null||i.stroke==0||i["stroke-width"]==0)&&(Q.on=!1);var U=a.getRGB(i.stroke);Q.on&&i.stroke&&(Q.color=U.hex),P=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+U.o+1||2)-1);var V=(d(i["stroke-width"])||1)*.75;P=h(g(P,0),1),i["stroke-width"]==null&&(V=m["stroke-width"]),i["stroke-width"]&&(Q.weight=V),V&&V<1&&(P*=V)&&(Q.weight=1),Q.opacity=P,i["stroke-linejoin"]&&(Q.joinstyle=i["stroke-linejoin"]||"miter"),Q.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(Q.endcap=i["stroke-linecap"]=="butt"?"flat":i["stroke-linecap"]=="square"?"square":"round");if(i["stroke-dasharray"]){var W={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};Q.dashstyle=W[b](i["stroke-dasharray"])?W[i["stroke-dasharray"]]:o}T&&l.appendChild(Q)}if(t.type=="text"){t.paper.canvas.style.display=o;var X=t.paper.span,Y=100,Z=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=X.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),Z=d(m["font-size"]||Z&&Z[0])||10,p.fontSize=Z*Y+"px",t.textpath.string&&(X.innerHTML=c(t.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var $=X.getBoundingClientRect();t.W=m.w=($.right-$.left)/Y,t.H=m.h=($.bottom-$.top)/Y,t.X=m.x,t.Y=m.y+t.H/2,("x"in i||"y"in i)&&(t.path.v=a.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));var _=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var ba=0,bb=_.length;ba<bb;ba++)if(_[ba]in i){t._.dirty=1;break}switch(m["text-anchor"]){case"start":t.textpath.style["v-text-align"]="left",t.bbx=t.W/2;break;case"end":t.textpath.style["v-text-align"]="right",t.bbx=-t.W/2;break;default:t.textpath.style["v-text-align"]="center",t.bbx=0}t.textpath.style["v-text-kern"]=!0}},C=function(b,f,g){b.attrs=b.attrs||{};var h=b.attrs,i=Math.pow,j,k,l="linear",m=".5 .5";b.attrs.gradient=f,f=c(f).replace(a._radial_gradient,function(a,b,c){l="radial",b&&c&&(b=d(b),c=d(c),i(b-.5,2)+i(c-.5,2)>.25&&(c=e.sqrt(.25-i(b-.5,2))*((c>.5)*2-1)+.5),m=b+n+c);return o}),f=f.split(/\s*\-\s*/);if(l=="linear"){var p=f.shift();p=-d(p);if(isNaN(p))return null}var q=a._parseDots(f);if(!q)return null;b=b.shape||b.node;if(q.length){b.removeChild(g),g.on=!0,g.method="none",g.color=q[0].color,g.color2=q[q.length-1].color;var r=[];for(var s=0,t=q.length;s<t;s++)q[s].offset&&r.push(q[s].offset+n+q[s].color);g.colors=r.length?r.join():"0% "+g.color,l=="radial"?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=m,g.angle=0):(g.type="gradient",g.angle=(270-p)%360),b.appendChild(g)}return 1},D=function(b,c){this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=c,this.matrix=a.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},E=a.el;D.prototype=E,E.constructor=D,E.transform=function(b){if(b==null)return this._.transform;var d=this.paper._viewBoxShift,e=d?"s"+[d.scale,d.scale]+"-1-1t"+[d.dx,d.dy]:o,f;d&&(f=b=c(b).replace(/\.{3}|\u2026/g,this._.transform||o)),a._extractTransform(this,e+b);var g=this.matrix.clone(),h=this.skew,i=this.node,j,k=~c(this.attrs.fill).indexOf("-"),l=!c(this.attrs.fill).indexOf("url(");g.translate(-0.5,-0.5);if(l||k||this.type=="image"){h.matrix="1 0 0 1",h.offset="0 0",j=g.split();if(k&&j.noRotation||!j.isSimple){i.style.filter=g.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;i.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else i.style.filter=o,z(this,j.scalex,j.scaley,j.dx,j.dy,j.rotate)}else i.style.filter=o,h.matrix=c(g),h.offset=g.offset();f&&(this._.transform=f);return this},E.rotate=function(a,b,e){if(this.removed)return this;if(a!=null){a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,b,e]]));return this}},E.translate=function(a,b){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=b),this.transform(this._.transform.concat([["t",a,b]]));return this},E.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]])),this._.dirtyT=1;return this},E.hide=function(){!this.removed&&(this.node.style.display="none");return this},E.show=function(){!this.removed&&(this.node.style.display=o);return this},E._getBBox=function(){if(this.removed)return{};return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&!!this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),a.eve.unbind("raphael.*.*."+this.id),a._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;this.removed=!0}},E.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c==j&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;var g=c.split(k),h={};for(var i=0,m=g.length;i<m;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return m-1?h:h[g[0]]}if(this.attrs&&d==null&&a.is(c,"array")){h={};for(i=0,m=c.length;i<m;i++)h[c[i]]=this.attr(c[i]);return h}var n;d!=null&&(n={},n[c]=d),d==null&&a.is(c,"object")&&(n=c);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[b](o)&&n[b](o)&&a.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[b](q)&&(n[q]=p[q])}n.text&&this.type=="text"&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&a._tofront(this,this.paper);return this},E.toBack=function(){if(this.removed)return this;this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper));return this},E.insertAfter=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[b.length-1]),b.node.nextSibling?b.node.parentNode.insertBefore(this.node,b.node.nextSibling):b.node.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},E.insertBefore=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[0]),b.node.parentNode.insertBefore(this.node,b.node),a._insertbefore(this,b,this.paper);return this},E.blur=function(b){var c=this.node.runtimeStyle,d=c.filter;d=d.replace(r,o),+b!==0?(this.attrs.blur=b,c.filter=d+n+m+".Blur(pixelradius="+(+b||1.5)+")",c.margin=a.format("-{0}px 0 0 -{0}px",f(+b||1.5))):(c.filter=d,c.margin=0,delete this.attrs.blur)},a._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");f.on=!0,c.appendChild(f),d.skew=f,d.transform(o);return d},a._engine.rect=function(b,c,d,e,f,g){var h=a._rectPath(c,d,e,f,g),i=b.path(h),j=i.attrs;i.X=j.x=c,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect";return i},a._engine.ellipse=function(a,b,c,d,e){var f=a.path(),g=f.attrs;f.X=b-d,f.Y=c-e,f.W=d*2,f.H=e*2,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e});return f},a._engine.circle=function(a,b,c,d){var e=a.path(),f=e.attrs;e.X=b-d,e.Y=c-d,e.W=e.H=d*2,e.type="circle",B(e,{cx:b,cy:c,r:d});return e},a._engine.image=function(b,c,d,e,f,g){var h=a._rectPath(d,e,f,g),i=b.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];k.src=c,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=c,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0);return i},a._engine.text=function(b,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=a.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=c(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,b),l={fill:"#000",stroke:"none",font:a._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=c(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),b.canvas.appendChild(h);var m=F("skew");m.on=!0,h.appendChild(m),k.skew=m,k.transform(o);return k},a._engine.setSize=function(b,c){var d=this.canvas.style;this.width=b,this.height=c,b==+b&&(b+="px"),c==+c&&(c+="px"),d.width=b,d.height=c,d.clip="rect(0 "+b+" "+c+" 0)",this._viewBox&&a._engine.setViewBox.apply(this,this._viewBox);return this},a._engine.setViewBox=function(b,c,d,e,f){a.eve("raphael.setViewBox",this,this._viewBox,[b,c,d,e,f]);var h=this.width,i=this.height,j=1/g(d/h,e/i),k,l;f&&(k=i/e,l=h/d,d*k<h&&(b-=(h-d*k)/2/k),e*l<i&&(c-=(i-e*l)/2/l)),this._viewBox=[b,c,d,e,!!f],this._viewBoxShift={dx:-b,dy:-c,scale:j},this.forEach(function(a){a.transform("...")});return this};var F;a._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},a._engine.initWin(a._g.win),a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b.container,d=b.height,e,f=b.width,g=b.x,h=b.y;if(!c)throw new Error("VML container not found.");var i=new a._Paper,j=i.canvas=a._g.doc.createElement("div"),k=j.style;g=g||0,h=h||0,f=f||512,d=d||342,i.width=f,i.height=d,f==+f&&(f+="px"),d==+d&&(d+="px"),i.coordsize=u*1e3+n+u*1e3,i.coordorigin="0 0",i.span=a._g.doc.createElement("span"),i.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",j.appendChild(i.span),k.cssText=a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",f,d),c==1?(a._g.doc.body.appendChild(j),k.left=g+"px",k.top=h+"px",k.position="absolute"):c.firstChild?c.insertBefore(j,c.firstChild):c.appendChild(j),i.renderfix=function(){};return i},a.prototype.clear=function(){a.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=a._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},a.prototype.remove=function(){a.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;return!0};var G=a.st;for(var H in E)E[b](H)&&!G[b](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}(window.Raphael)


if (typeof (DOMParser) === 'undefined') {
    var xmldata = null;
    DOMParser = function() {
    };
    DOMParser.prototype.parseFromString = function(str, contentType) {
        var cntType = contentType;
        if (typeof (ActiveXObject) !== 'undefined') {
            xmldata = new ActiveXObject('MSXML2.DomDocument.6.0');
            xmldata.async = false;
            xmldata.loadXML(str);
            return xmldata;
        } else if (typeof (XMLHttpRequest) !== 'undefined') {
            xmldata = new XMLHttpRequest();
            if (!cntType) {
                cntType = 'application/xml';
            }
            xmldata.open('GET', 'data:' + cntType + ';charset=utf-8,' + encodeURIComponent(str), false);
            if (xmldata.overrideMimeType) {
                xmldata.overrideMimeType(cntType);
            }
            xmldata.send(null);
            return xmldata.responseXML;
        }
    };
}
if (!Function.prototype.bind) {
    Function.prototype.bind = function () {
        var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}
/***********************************************************************************************************************
 * Disable Text Selection script- ? Dynamic Drive DHTML code library (www.dynamicdrive.com) This notice MUST stay intact
 * for legal use Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
 **********************************************************************************************************************/

function disableSelection (target) {
    if (typeof target.onselectstart !== "undefined") { // IE route
        target.onselectstart = function () {
            return false;
        };
    } else if (typeof target.style.MozUserSelect !== "undefined") { // Firefox route
        target.style.MozUserSelect = "none";
    } else { // All other route (ie: Opera)
        target.onmousedown = function () {
            return false;
        };
    }
    target.style.cursor = "default";
}
/**
 * Creates an array of an integral range, which, among other uses, can be useful to create a quick iterator of a
 * definite size.
 *
 * @param {Number}
 *            upperBound The upper integer bound.
 * @param {Boolean}
 *            upperIncl [optional] <tt>true</tt> if the upper bound should be included in the range. If omitted or
 *            <tt>false</tt>, upper bound is excluded.
 * @param {Number}
 *            lowerBound [optional] The lower integer bound. If omitted, the lower bound will be 0 (zero).
 * @param {Boolean}
 *            lowerIncl [optional] <tt>true</tt> if the lower bound should be included in the range. If omitted, lower
 *            bound is included.
 * @returns {Array} An array appropriately sized to the specified range, with each entry being a successive member of
 *          the range. The array will be empty if upperBound is undefined, null or NaN; or if upperBound is &lt;= 0
 *          (zero) and lowerBound is undefined, null or NaN; or if upperBound &lt; lowerBound.
 */
Array.range = function(upperBound, upperIncl, lowerBound, lowerIncl) {
    var arr = [];
    var u = "bad";
    var type = typeof upperBound;
    switch (type) {
        case "number":
        case "string":
            u = (+upperBound);
            break;
    }
    var l = "bad";
    type = typeof lowerBound;
    switch (type) {
        case "number":
        case "string":
            l = (+lowerBound);
            break;
    }
    if (u === "bad" || isNaN(u)) {
        ;
    } else if ((u <= 0) && (l === "bad" || isNaN(l))) {
        ;
    } else {
        var low = (l === "bad" || isNaN(l)) ? 0 : l;
        var lower = (lowerIncl === undefined) || lowerIncl ? low : low + 1;
        var upper = (upperIncl === undefined) || !upperIncl ? u - 1 : u;
        var i = 0;
        if (upper < lower) {
            ;
        } else {
            for (i = lower; i <= upper; i++) {
                arr.push(i);
            }
        }
    }
    return arr;
};
/**
 * Iterates over this array.
 *
 * @param {Function}
 *            f A function that accepts two-args: 1) {Number} the index in in the iteration, 2) {Object} the array
 *            element. Returning <tt>false</tt> or altering the array's length <tt>break</tt>s the iteration.
 *            Returning anything else, <tt>continue</tt>s.
 * @returns {Array} This array.
 */
Array.prototype.each = function (f) {
    function iter (arr) {
        var lengthChanged = false;
        var length = arr.length;
        var i = 0;
        for (i = 0; i < length; i++) {
            var r = f(i, arr[i]);
            lengthChanged = arr.length !== length;
            if ((r === false) || lengthChanged) {
            break;
        }
    }
        return lengthChanged;
    }
    var lengthChanged = null;
    do {
        lengthChanged = iter(this);
    } while (lengthChanged);
    return this;
};
Array.prototype.replace = function (newElem, startIdx, endIdx) {
    var i = 0;
    if (newElem !== undefined) {
        if (startIdx !== undefined) {
            var start = (+startIdx);
            if (!isNaN(start) && start >= 0 && start <= this.length - 1) {
                var end = endIdx === undefined ? undefined : (+endIdx);
                if (isNaN(end) || end < 0 || end < start || end >= this.length) {
                    this[start] = newElem;
                } else if (start <= end && end <= this.length - 1) {
                    for (i = start; i <= end; i++) {
                        this[i] = newElem;
                    }
                }
            }
        }
    }
    return this;
};
Array.prototype.contains = function (e) {
    return $.inArray(e, this) !== -1;
};
Array.prototype.remove = function (e) {
    var idx = $.inArray(e, this);
    var removed = idx !== -1;
    removed && (this.splice(idx, 1));
    return this;
};
Array.prototype.removeAll = function (array) {
    var arr, elem, i, j;
    arr = array;
    for (i = 0, j = arr.length; i < j; i++) {
        elem = arr[i];
        this.remove(elem);
    }
    return this;
};
Array.prototype.insert = function (e, i) {
    var idx = i === undefined ? (this.length ? this.length - 1 : 0) : i;
    this.splice(idx, 0, e);
    return this;
};
Array.prototype.insertAll = function (els, i) {
    els.each(function (j, v) {
        this.insert(i, 0, v);
    });
    return this;
};
Array.prototype.and = function (array) {
    var anded, arr, elem, i, j;
    anded = [];
    arr = [].concat(this);
    for (i = 0, j = arr.length; i < j; i++) {
        elem = arr[i];
        array.contains(elem) && anded.push(elem);
    }
    return anded;
};
Array.prototype.not = function (array) {
    return [].concat(this).removeAll(this.and(array));
};
Array.prototype.equals = function (array) {
    return this.length === array.length === this.and(array).length;
};
Array.prototype.containsAny = function (array) {
    return this.and(array).length;
};
Array.prototype.containsAll = function (array) {
    return this.and(array).length === array.length;
};
/**
 * Returns this Date, at midnight.
 *
 * @returns {Number} Midnight as in <tt>Date.getTime()</tt>.
 */
Date.prototype.midnight = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0, 0);
};
/**
 * Add a function to all Strings that will remove leading and trailing white- spaces, newline characters, etc.
 *
 * @returns {String} This String, stripped of leading and trailing whitespace, newline characters, etc.
 */
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/gm, '');
};
String.prototype.padStartWithZeros = function (length) {
    var str = this + "";
    if (str.length < length) {
        Array.range(length - str.length).each(function (i, v) {
            str = "0" + str;
        });
    }
    return str;
};
String.prototype.padEndWithZeros = function (length) {
    var str = this + "";
    if (str.length < length) {
        Array.range(length - str.length).each(function (i, v) {
            str = str + "0";
        });
    }
    return str;
};
/**
 * Add a function to all Numbers that will remove trailing, insignificant zeros (e.g. 10.00 becomes 10, 10.005 remains
 * 10.0005, 10.0050 becomes 10.005).
 *
 * @returns {Number} This Number, stripped of trailing insignificant zeros.
 */
Number.prototype.removeTrailingZeros = function() {
    return +("" + this);
};
/**
 * Namespace registration function.
 *
 * @param {String}
 *            ns A '.'-separated namespace.
 */
var registerNS = function(ns) {
    var nsParts = ns.split(".");
    var root = window;
    var i = 0;
    for (i = 0; i < nsParts.length; i++) {
        if (root[nsParts[i]] === null || typeof(root[nsParts[i]]) !== "object") {
            root[nsParts[i]] = {};
        }
        root = root[nsParts[i]];
    }
};
registerNS("com.cerner.oncology.util");
/**
 * @namespace Contains common utility API.
 */
com.cerner.oncology.util = com.cerner.oncology.util;
/**
 * Retrieves the viewport width.
 *
 * @returns {Number} Viewport width, in pixels.
 * @see <a href="http://13thparallel.com/archive/viewport/">http://13thparallel.com/archive/viewport/</a>
 */
com.cerner.oncology.util.getViewportWidth = function() {
    var width = 0;
    if (document.documentElement && document.documentElement.clientWidth) {
        width = document.documentElement.clientWidth;
    } else if (document.body && document.body.clientWidth) {
        width = document.body.clientWidth;
    } else if (window.innerWidth) {
        width = window.innerWidth - 18;
    }
    return width;
};
/**
 * Retrieves the viewport height.
 *
 * @returns {Number} Viewport height, in pixels.
 * @see <a href="http://13thparallel.com/archive/viewport/">http://13thparallel.com/archive/viewport/</a>
 */
com.cerner.oncology.util.getViewportHeight = function() {
    var height = 0;
    if (document.documentElement && document.documentElement.clientHeight) {
        height = document.documentElement.clientHeight;
    } else if (document.body && document.body.clientHeight) {
        height = document.body.clientHeight;
    } else if (window.innerHeight) {
        height = window.innerHeight - 18;
    }
    return height;
};
/**
 * Retrieves the viewport horizontal coordinate.
 *
 * @returns {Number} Viewport horizontal scroll, in pixels.
 * @see <a href="http://13thparallel.com/archive/viewport/">http://13thparallel.com/archive/viewport/</a>
 */
com.cerner.oncology.util.getViewportScrollX = function() {
    var scrollX = 0;
    if (document.documentElement && document.documentElement.scrollLeft) {
        scrollX = document.documentElement.scrollLeft;
    } else if (document.body && document.body.scrollLeft) {
        scrollX = document.body.scrollLeft;
    } else if (window.pageXOffset) {
        scrollX = window.pageXOffset;
    } else if (window.scrollX) {
        scrollX = window.scrollX;
    }
    return scrollX;
};
/**
 * Retrieves the viewport vertical coordinate.
 *
 * @returns {Number} Viewport vertical scroll, in pixels.<br>
 *          <br>
 * @see <a href="http://13thparallel.com/archive/viewport/">http://13thparallel.com/archive/viewport/</a>
 */
com.cerner.oncology.util.getViewportScrollY = function() {
    var scrollY = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollY = document.documentElement.scrollTop;
    } else if (document.body && document.body.scrollTop) {
        scrollY = document.body.scrollTop;
    } else if (window.pageYOffset) {
        scrollY = window.pageYOffset;
    } else if (window.scrollY) {
        scrollY = window.scrollY;
    }
    return scrollY;
};
/**
 * Retrieves the absolute width of the viewport, with scrolling included.
 *
 * @returns {Number} The absolute viewport width, in pixels.
 */
com.cerner.oncology.util.getAbsoluteViewportWidth = function() {
    return (+com.cerner.oncology.util.getViewportWidth()) + com.cerner.oncology.util.getViewportScrollX();
};
/**
 * Retrieves the absolute height of the viewport, with scrolling included.
 *
 * @returns {Number} The absolute viewport height, in pixels.
 */
com.cerner.oncology.util.getAbsoluteViewportHeight = function() {
    return (+com.cerner.oncology.util.getViewportHeight()) + com.cerner.oncology.util.getViewportScrollY();
};
/**
 * Removes the unit of a measured CSS properties (e.g. "176px" becomes 176).
 *
 * @param {String}
 *            measurement The measured CSS property.
 * @returns {Number} The numerical value of the property.
 */
com.cerner.oncology.util.stripUnit = function(measurement) {
    return parseInt(measurement.replace(/[^\d\.]/g, ''), 10);
};
/**
 * Positions the popup so as to not appear off screen.
 *
 * @param {Object}
 *            popup The <a href="http://api.jquery.com/jQuery/">jQuery</a> popup whose position (top, left) will be set
 *            according to the event coordinates and the window dimensions.
 * @param {Object}
 *            e Event whose <tt>clientX</tt> and <tt>clientY</tt>, <tt>pageX</tt> and <tt>pageY</tt>, members
 *            will be used to determine popup positioning.
 */
com.cerner.oncology.util.positionPopup = function (popup, e) {
    $(popup).css("position", "absolute");
    var winWidth = com.cerner.oncology.util.getAbsoluteViewportWidth();
    var winHeight = com.cerner.oncology.util.getAbsoluteViewportHeight();
    var popupWidth = $(popup).width();
    var popupHeight = $(popup).height();
    var x = (+e.clientX) + com.cerner.oncology.util.getViewportScrollX();
    var y = (+e.clientY) + com.cerner.oncology.util.getViewportScrollY();

    if (!e.pageX) {
        e.pageX = x;
        e.pageY = y;
    }

    if ((x + popupWidth + 10) >= winWidth) {
        var pageXDiff = e.pageX - popupWidth - 10;
        $(popup).css({
            left: pageXDiff < 0 ? 0 : pageXDiff
    });
    } else {
        $(popup).css({
            left: (+e.pageX) + 10
        });
    }

    if ((y + popupHeight + 10) >= winHeight) {
        var pageYDiff = e.pageY - popupHeight - 10;
        $(popup).css({
            top: pageYDiff < 0 ? 0 : pageYDiff
        });
    } else {
        $(popup).css({
            top: (+e.pageY) + 10
        });
    }
};
com.cerner.oncology.util.createRow = function (numCells, isHeader, trClasses, cellClasses) {
    var tr = $(document.createElement("tr"));
    trClasses && trClasses.length && $(tr).addClass(trClasses.join(" "));
    var cellClazzes = cellClasses && cellClasses.length ? cellClasses.join(" ") : [];
    var cell = $(document.createElement(isHeader ? "th" : "td"));
    Array.range(numCells).each(function (i, v) {
        var c = $(cell).clone();
        cellClazzes.length && c.addClass(cellClazzes);
        $(tr).append(c);
    });
    return tr;
};
com.cerner.oncology.util.createTable = function (summary, id, classes) {
    var table = $(document.createElement("table")).attr("summary", summary);
    id && $(table).attr("id", id);
    classes && classes.length && $(table).addClass(classes.join(" "));
    var thead = $(document.createElement("thead"));
    $(table).append(thead);
    var tbody = $(document.createElement("tbody"));
    $(table).append(tbody);
    return table;
};
com.cerner.oncology.util.getHeight = function (elem) {
    var div, height;
    div = $(document.createElement("div")).hide();
    $("body").append(div);
    $(div).append($(elem).html());
    height = $(div).height();
    $(div).remove();
    return height;
};
com.cerner.oncology.util.setLocale = function (fileName, xhrDataType) {
    var dfd, getScript, reply;
    dfd = $.Deferred();

    getScript = function (src, cb) {
        var main, script;
        script = document.createElement('script');
        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    cb();
                }
            };
        } else {
            script.onload = function () {
                cb();
            };
        }
        script.src = src;
        main = document.getElementsByTagName('script')[0];
        main.parentNode.insertBefore(script, main);
    };

    /* get, set and include locale */
    reply = function (data) {
        var coreSrc, locale, path, projSrc;
        path = $('link:first').attr('href').split(/css\/timeline-view\.css$/)[0];
        locale = data.RECORD_DATA.LOCALE.toLowerCase();
		if(locale == 'en')
		{
			coreSrc = path + 'i18n/mp-core_i18n.js';
            projSrc = path + 'i18n/' + fileName;
		}
		else
		{
			coreSrc = path + 'i18n/'+locale+'/mp-core_i18n.js';
			projSrc = path + 'i18n/'+locale+'/' + fileName;
		}
		
		//moment definition are to pull the regional month/date/year formats
		//The lanaguage strings sent from om_mp_locale helps to pick the respective i18file path, 
		//but in the moment definitions, lanaguge strings has '-' instead of '_'
		//setting the locale to pick the moment language definitions 
		locale = {
			"en_us": "en",
			"es": "es",
			"de": "de",
			"fr": "fr",
			"en_gb": "en-gb",
			"pt_br": "pt-br",
			"en_au": "en-au"
		}[locale] || "en";

		moment.lang(locale);
        if (/\\/.test(path)) {
            coreSrc = coreSrc.replace(/\//g, '\\');
            projSrc = projSrc.replace(/\//g, '\\');
        }
        getScript(projSrc, function () {
            getScript(coreSrc, function () {
                dfd.resolve();
            });
        });
    };
    com.cerner.mpage.call('onc_mp_locale', reply)('^MINE^,' + xhrDataType);
    return dfd.promise();
};

/* If the browser does not define the indexOf function for the Array */
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item) {
		for(var i = 0, il = this.length; i < il; i++) {
			//If the item exists in the Array, return the index
			if(this[i]===item) {
				return i;
			}
		}
		//The item was not found, return -1
		return -1;
	};
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * Returns an array of elements with the designated classname.
 * @param {Object} cl The CSS classname.
 * @param {Object} e The parent element to search within, defaults to document.
 * @return {Array} Returns an array of elements with the designated classname.
 * @deprecated
 */
document.getElementsByClassName = function(cl, e) {
	var retnode = [];
	var clssnm = new RegExp('\\b' + cl + '\\b');
	var elem = this.getElementsByTagName('*', e);
	for (var u = 0; u < elem.length; u++) {
		var classes = elem[u].className;
		if (clssnm.test(classes)) {
			retnode.push(elem[u]);
		}
	}
	return retnode;
};

// moment.js
// version : 1.5.0
// author : Tim Wood
// license : MIT
// momentjs.com
(function(a,b){function u(a,b){this._d=a,this._isUTC=!!b}function v(a,b){var c=a+"";while(c.length<b)c="0"+c;return c}function w(b,c,d,e){var f=typeof c=="string",g=f?{}:c,h,i,j,k;return f&&e&&(g[c]=+e),h=(g.ms||g.milliseconds||0)+(g.s||g.seconds||0)*1e3+(g.m||g.minutes||0)*6e4+(g.h||g.hours||0)*36e5,i=(g.d||g.days||0)+(g.w||g.weeks||0)*7,j=(g.M||g.months||0)+(g.y||g.years||0)*12,h&&b.setTime(+b+h*d),i&&b.setDate(b.getDate()+i*d),j&&(k=b.getDate(),b.setDate(1),b.setMonth(b.getMonth()+j*d),b.setDate(Math.min((new a(b.getFullYear(),b.getMonth()+1,0)).getDate(),k))),b}function x(a){return Object.prototype.toString.call(a)==="[object Array]"}function y(b){return new a(b[0],b[1]||0,b[2]||1,b[3]||0,b[4]||0,b[5]||0,b[6]||0)}function z(b,d){function r(d){var j,s;switch(d){case"M":return e+1;case"Mo":return e+1+p(e+1);case"MM":return v(e+1,2);case"MMM":return c.monthsShort[e];case"MMMM":return c.months[e];case"D":return f;case"Do":return f+p(f);case"DD":return v(f,2);case"DDD":return j=new a(g,e,f),s=new a(g,0,1),~~((j-s)/864e5+1.5);case"DDDo":return j=r("DDD"),j+p(j);case"DDDD":return v(r("DDD"),3);case"d":return h;case"do":return h+p(h);case"ddd":return c.weekdaysShort[h];case"dddd":return c.weekdays[h];case"w":return j=new a(g,e,f-h+5),s=new a(j.getFullYear(),0,4),~~((j-s)/864e5/7+1.5);case"wo":return j=r("w"),j+p(j);case"ww":return v(r("w"),2);case"YY":return v(g%100,2);case"YYYY":return g;case"a":return i>11?q.pm:q.am;case"A":return i>11?q.PM:q.AM;case"H":return i;case"HH":return v(i,2);case"h":return i%12||12;case"hh":return v(i%12||12,2);case"m":return m;case"mm":return v(m,2);case"s":return n;case"ss":return v(n,2);case"zz":case"z":return(b._d.toString().match(l)||[""])[0].replace(k,"");case"Z":return(o<0?"-":"+")+v(~~(Math.abs(o)/60),2)+":"+v(~~(Math.abs(o)%60),2);case"ZZ":return(o<0?"-":"+")+v(~~(10*Math.abs(o)/6),4);case"L":case"LL":case"LLL":case"LLLL":case"LT":return z(b,c.longDateFormat[d]);default:return d.replace(/(^\[)|(\\)|\]$/g,"")}}var e=b.month(),f=b.date(),g=b.year(),h=b.day(),i=b.hours(),m=b.minutes(),n=b.seconds(),o=-b.zone(),p=c.ordinal,q=c.meridiem;return d.replace(j,r)}function A(b,d){function p(a,b){var d;switch(a){case"M":case"MM":e[1]=~~b-1;break;case"MMM":case"MMMM":for(d=0;d<12;d++)if(c.monthsParse[d].test(b)){e[1]=d;break}break;case"D":case"DD":case"DDD":case"DDDD":e[2]=~~b;break;case"YY":b=~~b,e[0]=b+(b>70?1900:2e3);break;case"YYYY":e[0]=~~Math.abs(b);break;case"a":case"A":o=b.toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":e[3]=~~b;break;case"m":case"mm":e[4]=~~b;break;case"s":case"ss":e[5]=~~b;break;case"Z":case"ZZ":h=!0,d=(b||"").match(r),d&&d[1]&&(f=~~d[1]),d&&d[2]&&(g=~~d[2]),d&&d[0]==="+"&&(f=-f,g=-g)}}var e=[0,0,1,0,0,0,0],f=0,g=0,h=!1,i=b.match(n),j=d.match(m),k=Math.min(i.length,j.length),l,o;for(l=0;l<k;l++)p(j[l],i[l]);return o&&e[3]<12&&(e[3]+=12),o===!1&&e[3]===12&&(e[3]=0),e[3]+=f,e[4]+=g,h?new a(a.UTC.apply({},e)):y(e)}function B(a,b){var c=Math.min(a.length,b.length),d=Math.abs(a.length-b.length),e=0,f;for(f=0;f<c;f++)~~a[f]!==~~b[f]&&e++;return e+d}function C(a,b){var c,d=a.match(n),e=[],f=99,g,h,i;for(g=0;g<b.length;g++)h=A(a,b[g]),i=B(d,z(new u(h),b[g]).match(n)),i<f&&(f=i,c=h);return c}function D(b){var c="YYYY-MM-DDT",d;if(o.exec(b)){for(d=0;d<3;d++)if(q[d][1].exec(b)){c+=q[d][0];break}return A(b,c+"Z")}return new a(b)}function E(a,b,d){var e=c.relativeTime[a];return typeof e=="function"?e(b||1,!!d,a):e.replace(/%d/i,b||1)}function F(a,b){var c=d(Math.abs(a)/1e3),e=d(c/60),f=d(e/60),g=d(f/24),h=d(g/365),i=c<45&&["s",c]||e===1&&["m"]||e<45&&["mm",e]||f===1&&["h"]||f<22&&["hh",f]||g===1&&["d"]||g<=25&&["dd",g]||g<=45&&["M"]||g<345&&["MM",d(g/30)]||h===1&&["y"]||["yy",h];return i[2]=b,E.apply({},i)}function G(a,b){c.fn[a]=function(a){var c=this._isUTC?"UTC":"";return a!=null?(this._d["set"+c+b](a),this):this._d["get"+c+b]()}}var c,d=Math.round,e={},f=typeof module!="undefined",g="months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),h,i=/^\/?Date\((\-?\d+)/i,j=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|zz?|ZZ?|LT|LL?L?L?)/g,k=/[^A-Z]/g,l=/\([A-Za-z ]+\)|:[0-9]{2} [A-Z]{3} /g,m=/(\\)?(MM?M?M?|dd?d?d|DD?D?D?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|ZZ?|T)/g,n=/(\\)?([0-9]+|([a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+|([\+\-]\d\d:?\d\d))/gi,o=/\d{4}.\d\d.\d\d(T(\d\d(.\d\d(.\d\d)?)?)?([\+\-]\d\d:?\d\d)?)?/,p="YYYY-MM-DDTHH:mm:ssZ",q=[["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],r=/([\+\-]|\d\d)/gi,s="1.5.0",t="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|");c=function(c,d){if(c===null||c==="")return null;var e,f;return c&&c._d instanceof a?e=new a(+c._d):d?x(d)?e=C(c,d):e=A(c,d):(f=i.exec(c),e=c===b?new a:f?new a(+f[1]):c instanceof a?c:x(c)?y(c):typeof c=="string"?D(c):new a(c)),new u(e)},c.utc=function(b,d){return x(b)?new u(new a(a.UTC.apply({},b)),!0):d&&b?c(b+" 0",d+" Z").utc():c(b).utc()},c.humanizeDuration=function(a,b,d){var e=+a,f=c.relativeTime,g;switch(b){case"seconds":e*=1e3;break;case"minutes":e*=6e4;break;case"hours":e*=36e5;break;case"days":e*=864e5;break;case"weeks":e*=6048e5;break;case"months":e*=2592e6;break;case"years":e*=31536e6;break;default:d=!!b}return g=F(e,!d),d?(e<=0?f.past:f.future).replace(/%s/i,g):g},c.version=s,c.defaultFormat=p,c.lang=function(a,b){var d,h,i,j=[];if(b){for(d=0;d<12;d++)j[d]=new RegExp("^"+b.months[d]+"|^"+b.monthsShort[d].replace(".",""),"i");b.monthsParse=b.monthsParse||j,e[a]=b}if(e[a])for(d=0;d<g.length;d++)h=g[d],c[h]=e[a][h]||c[h];else f&&(i=require("./lang/"+a),c.lang(a,i))},c.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:{AM:"AM",am:"am",PM:"PM",pm:"pm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"th":b===1?"st":b===2?"nd":b===3?"rd":"th"}}),c.isMoment=function(a){return a instanceof u},c.fn=u.prototype={clone:function(){return c(this)},valueOf:function(){return+this._d},"native":function(){return this._d},toString:function(){return this._d.toString()},toDate:function(){return this._d},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(a){return z(this,a?a:c.defaultFormat)},add:function(a,b){return this._d=w(this._d,a,1,b),this},subtract:function(a,b){return this._d=w(this._d,a,-1,b),this},diff:function(a,b,e){var f=c(a),g=(this.zone()-f.zone())*6e4,h=this._d-f._d-g,i=this.year()-f.year(),j=this.month()-f.month(),k=this.date()-f.date(),l;return b==="months"?l=i*12+j+k/30:b==="years"?l=i+j/12:l=b==="seconds"?h/1e3:b==="minutes"?h/6e4:b==="hours"?h/36e5:b==="days"?h/864e5:b==="weeks"?h/6048e5:h,e?l:d(l)},from:function(a,b){return c.humanizeDuration(this.diff(a),!b)},fromNow:function(a){return this.from(c(),a)},calendar:function(){var a=this.diff(c().sod(),"days",!0),b=c.calendar,d=b.sameElse,e=a<-6?d:a<-1?b.lastWeek:a<0?b.lastDay:a<1?b.sameDay:a<2?b.nextDay:a<7?b.nextWeek:d;return this.format(typeof e=="function"?e.apply(this):e)},isLeapYear:function(){var a=this.year();return a%4===0&&a%100!==0||a%400===0},isDST:function(){return this.zone()<c([this.year()]).zone()||this.zone()<c([this.year(),5]).zone()},day:function(a){var b=this._d.getDay();return a==null?b:this.add({d:a-b})},sod:function(){return this.clone().hours(0).minutes(0).seconds(0).milliseconds(0)},eod:function(){return this.sod().add({d:1,ms:-1})},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return this.clone().month(this.month()+1).date(0).date()}};for(h=0;h<t.length;h++)G(t[h].toLowerCase(),t[h]);G("year","FullYear"),f&&(module.exports=c),typeof window!="undefined"&&(window.moment=c),typeof define=="function"&&define.amd&&define("moment",[],function(){return c})})(Date);


// moment.js language configuration
// language : german (de)
// author : lluchs : https://github.com/lluchs
(function(){function e(e){e.lang("de",{months:"Januar_Februar_M\u00e4rz_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm U\\hr",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT",sameElse:"L",nextDay:"[Morgen um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gestern um] LT",lastWeek:"[letzten] dddd [um] LT"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:"einer Minute",mm:"%d Minuten",h:"einer Stunde",hh:"%d Stunden",d:"einem Tag",dd:"%d Tagen",M:"einem Monat",MM:"%d Monaten",y:"einem Jahr",yy:"%d Jahren"},ordinal:"%d.",week:{dow:1,doy:4}})}"function"==typeof define&&define.amd&&define(["moment"],e),"undefined"!=typeof window&&window.moment&&e(window.moment)})();
// moment.js language configuration
// language : great britain english (en-gb)
// author : Chris Gedrim : https://github.com/chrisgedrim
(function(){function e(e){e.lang("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(e){var t=e%10,a=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+a},week:{dow:1,doy:4}})}"function"==typeof define&&define.amd&&define(["moment"],e),"undefined"!=typeof window&&window.moment&&e(window.moment)})();
// moment.js language configuration
// language : spanish (es)
// author : Julio Napurí : https://github.com/julionc
(function(){function e(e){e.lang("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:"ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),weekdays:"domingo_lunes_martes_mi\u00e9rcoles_jueves_viernes_s\u00e1bado".split("_"),weekdaysShort:"dom._lun._mar._mi\u00e9._jue._vie._s\u00e1b.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_S\u00e1".split("_"),longDateFormat:{LT:"H:mm",L:"DD/MM/YYYY",LL:"D \\de MMMM \\de YYYY",LLL:"D \\de MMMM \\de YYYY LT",LLLL:"dddd, D \\de MMMM \\de YYYY LT"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[ma\u00f1ana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un d\u00eda",dd:"%d d\u00edas",M:"un mes",MM:"%d meses",y:"un a\u00f1o",yy:"%d a\u00f1os"},ordinal:"%d\u00ba",week:{dow:1,doy:4}})}"function"==typeof define&&define.amd&&define(["moment"],e),"undefined"!=typeof window&&window.moment&&e(window.moment)})();
// moment.js language configuration
// language : french (fr)
// author : John Fischer : https://github.com/jfroffice
(function(){function e(e){e.lang("fr",{months:"janvier_f\u00e9vrier_mars_avril_mai_juin_juillet_ao\u00fbt_septembre_octobre_novembre_d\u00e9cembre".split("_"),monthsShort:"janv._f\u00e9vr._mars_avr._mai_juin_juil._ao\u00fbt_sept._oct._nov._d\u00e9c.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui \u00e0] LT",nextDay:"[Demain \u00e0] LT",nextWeek:"dddd [\u00e0] LT",lastDay:"[Hier \u00e0] LT",lastWeek:"dddd [dernier \u00e0] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinal:function(e){return e+(1===e?"er":"\u00e8me")},week:{dow:1,doy:4}})}"function"==typeof define&&define.amd&&define(["moment"],e),"undefined"!=typeof window&&window.moment&&e(window.moment)})();
//! moment.js locale configuration
//! locale : brazilian portuguese (pt-br)
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
(function() {
    function e(e) {
        e.lang('pt-br', {
    months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
    monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
    weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
    weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
    weekdaysMin : "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D [de] MMMM [de] YYYY",
        LLL : "D [de] MMMM [de] YYYY LT",
        LLLL : "dddd, D [de] MMMM [de] YYYY LT"
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : "em %s",
        past : "%s atrás",
        s : "segundos",
        m : "um minuto",
        mm : "%d minutos",
        h : "uma hora",
        hh : "%d horas",
        d : "um dia",
        dd : "%d dias",
        M : "um mês",
        MM : "%d meses",
        y : "um ano",
        yy : "%d anos"
    },
    ordinal : '%dº'
})
    }
    "function" == typeof define && define.amd && define(["moment"], e), "undefined" != typeof window && window.moment && e(window.moment)
})();
// moment.js language configuration
// language : Australian english (en-us)
(function () {
	function e(e){
    e.lang('en-au', {
        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat : {
            LT : "h:mm A",
            L : "DD/MM/YYYY",
            LL : "D MMMM YYYY",
            LLL : "D MMMM YYYY LT",
            LLLL : "dddd, D MMMM YYYY LT"
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        ordinal : function (number) {
            var b = number % 10,
                output = (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    })
}
"function" == typeof define && define.amd && define(["moment"], e), "undefined" != typeof window && window.moment && e(window.moment)
})();

//fgnass.github.com/spin.js#v1.2.5
(function(a,b,c){function g(a,c){var d=b.createElement(a||"div"),e;for(e in c)d[e]=c[e];return d}function h(a){for(var b=1,c=arguments.length;b<c;b++)a.appendChild(arguments[b]);return a}function j(a,b,c,d){var g=["opacity",b,~~(a*100),c,d].join("-"),h=.01+c/d*100,j=Math.max(1-(1-a)/b*(100-h),a),k=f.substring(0,f.indexOf("Animation")).toLowerCase(),l=k&&"-"+k+"-"||"";return e[g]||(i.insertRule("@"+l+"keyframes "+g+"{"+"0%{opacity:"+j+"}"+h+"%{opacity:"+a+"}"+(h+.01)+"%{opacity:1}"+(h+b)%100+"%{opacity:"+a+"}"+"100%{opacity:"+j+"}"+"}",0),e[g]=1),g}function k(a,b){var e=a.style,f,g;if(e[b]!==c)return b;b=b.charAt(0).toUpperCase()+b.slice(1);for(g=0;g<d.length;g++){f=d[g]+b;if(e[f]!==c)return f}}function l(a,b){for(var c in b)a.style[k(a,c)||c]=b[c];return a}function m(a){for(var b=1;b<arguments.length;b++){var d=arguments[b];for(var e in d)a[e]===c&&(a[e]=d[e])}return a}function n(a){var b={x:a.offsetLeft,y:a.offsetTop};while(a=a.offsetParent)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}var d=["webkit","Moz","ms","O"],e={},f,i=function(){var a=g("style");return h(b.getElementsByTagName("head")[0],a),a.sheet||a.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto"},p=function q(a){if(!this.spin)return new q(a);this.opts=m(a||{},q.defaults,o)};p.defaults={},m(p.prototype,{spin:function(a){this.stop();var b=this,c=b.opts,d=b.el=l(g(0,{className:c.className}),{position:"relative",zIndex:c.zIndex}),e=c.radius+c.length+c.width,h,i;a&&(a.insertBefore(d,a.firstChild||null),i=n(a),h=n(d),l(d,{left:(c.left=="auto"?i.x-h.x+(a.offsetWidth>>1):c.left+e)+"px",top:(c.top=="auto"?i.y-h.y+(a.offsetHeight>>1):c.top+e)+"px"})),d.setAttribute("aria-role","progressbar"),b.lines(d,b.opts);if(!f){var j=0,k=c.fps,m=k/c.speed,o=(1-c.opacity)/(m*c.trail/100),p=m/c.lines;!function q(){j++;for(var a=c.lines;a;a--){var e=Math.max(1-(j+a*p)%m*o,c.opacity);b.opacity(d,c.lines-a,e,c)}b.timeout=b.el&&setTimeout(q,~~(1e3/k))}()}return b},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=c),this},lines:function(a,b){function e(a,d){return l(g(),{position:"absolute",width:b.length+b.width+"px",height:b.width+"px",background:a,boxShadow:d,transformOrigin:"left",transform:"rotate("+~~(360/b.lines*c+b.rotate)+"deg) translate("+b.radius+"px"+",0)",borderRadius:(b.width>>1)+"px"})}var c=0,d;for(;c<b.lines;c++)d=l(g(),{position:"absolute",top:1+~(b.width/2)+"px",transform:b.hwaccel?"translate3d(0,0,0)":"",opacity:b.opacity,animation:f&&j(b.opacity,b.trail,c,b.lines)+" "+1/b.speed+"s linear infinite"}),b.shadow&&h(d,l(e("#000","0 0 4px #000"),{top:"2px"})),h(a,h(d,e(b.color,"0 0 1px rgba(0,0,0,.1)")));return a},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),!function(){function a(a,b){return g("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',b)}var b=l(g("group"),{behavior:"url(#default#VML)"});!k(b,"transform")&&b.adj?(i.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(b,c){function f(){return l(a("group",{coordsize:e+" "+e,coordorigin:-d+" "+ -d}),{width:e,height:e})}function k(b,e,g){h(i,h(l(f(),{rotation:360/c.lines*b+"deg",left:~~e}),h(l(a("roundrect",{arcsize:1}),{width:d,height:c.width,left:c.radius,top:-c.width>>1,filter:g}),a("fill",{color:c.color,opacity:c.opacity}),a("stroke",{opacity:0}))))}var d=c.length+c.width,e=2*d,g=-(c.width+c.length)*2+"px",i=l(f(),{position:"absolute",top:g,left:g}),j;if(c.shadow)for(j=1;j<=c.lines;j++)k(j,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(j=1;j<=c.lines;j++)k(j);return h(b,i)},p.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}):f=k(b,"animation")}(),a.Spinner=p})(window,document);
var popupWindowHandle;

function getPopupWindowHandle() {
    return popupWindowHandle;
}

/*
 * XMLCclRequest JavaScript Library v1.0.0
 *
 * based on contributions from Joshua Faulkenberry
 * Lucile Packard Children's Hospital at Stanford
 *
 * Date: 2009-04-9
 * Revision: 1
 */
XMLCclRequest = function (options) { /************ Attributes *************/

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
    this.responseBody = this.responseXML = this.async = true;
    this.requestBinding = null;
    this.requestText = null;
    this.uniqueId = null;

    /************** Events ***************/

    //Raised when there is an error.
    this.onerror = /************** Methods **************/
    //Cancels the current CCL request.
    this.abort = //Returns the complete list of response headers.
 this.getAllResponseHeaders = //Returns the specified response header.
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
        this.async = async !== undefined ? !!async : true;
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
        this.uniqueId = this.url + "-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 99999);
        XMLCCLREQUESTOBJECTPOINTER[this.uniqueId] = this;

        var el = document.getElementById("ID_CCLLINKHref_12980__");
        el.href = "javascript:XMLCCLREQUEST_Send(\"" + this.uniqueId + "\"" + ")";
             //alert(el.href);
        el.click();
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
        if (!value) {
            return false;
        }
        if (!this.requestHeaders) {
            this.requestHeaders = [];
        }
        this.requestHeaders[name] = value;
    };
};

XMLCCLREQUESTOBJECTPOINTER = [];

function APPLINK__(mode, appname, param) {}

function APPLINK(mode, appname, param) {
    var paramLength = param.length;
    if (paramLength > 2000) {
        document.getElementById("ID_CCLPostParams_26619__").value = '"' + param + '"';
        param = param.substring(0, 2000);
    }
    var el = document.getElementById("ID_CCLLINKHref_12980__");
    el.href = 'javascript:APPLINK__(' + mode + ',"' + appname + '","' + param + '",' + paramLength + ')';
    el.click();
}

function MPAGES_EVENT__(eventType, eventParams) {}

function MPAGES_EVENT(eventType, eventParams) {
    var paramLength = eventParams.length;
    if (paramLength > 2000) {
        document.getElementById("ID_CCLPostParams_26619__").value = '"' + eventParams + '"';
        eventParams = eventParams.substring(0, 2000);
    }
    var el = document.getElementById("ID_CCLLINKHref_12980__");
    el.href = 'javascript:MPAGES_EVENT__("' + eventType + '","' + eventParams + '",' + paramLength + ')';
    el.click();
}

function CCLLINK__(program, param, nViewerType) {}

function CCLLINK(program, param, nViewerType) {
    var paramLength = param.length;
    if (paramLength > 2000) {
        document.getElementById("ID_CCLPostParams_26619__").value = '"' + param + '"';
        param = param.substring(0, 2000);
    }
    var el = document.getElementById("ID_CCLLINKHref_12980__");
    el.href = 'javascript:CCLLINK__("' + program + '","' + param + '",' + nViewerType + ',' + paramLength + ')';
    el.click();
}

function evaluate(x) {
    return eval(x);
}

function getXMLHttpRequest() {
    return new XMLCclRequest();
}

registerNS("com.cerner.mpage");

com.cerner.mpage.wasLoaded = false;

/**
 * Creates and returns a Millennium MPage middleware script call.
 *
 * @param {String}
 *            script The name of the script being responsible for fulfilling the Ajax request.
 * @param {Function}
 *            fn A function that will take the JSON object marshaled by the returned function.
 * @param {Function}
 *            stat [optional] A function that will take the JSON object representing the standard CCL status reply
 *            block. If omitted and if a status block is returned and has a non -success/-empty status, this method will
 *            not call <b>fn</b>, instead, will <tt>alert</tt> the status block.
 * @returns {Function} A function which takes a String argument, the Ajax SEND options. This function will create the
 *          MPage script call that, once invoked, will marshal the reply into a JSON object.
 */
com.cerner.mpage.call = function (script, fn, stat) {

    if (!com.cerner.mpage.wasLoaded) {
        cap = MP_Util.CreateTimer("CAP:2012.1.00123.4");
        if (cap) {
            cap.Stop();
        } else {
        }
        com.cerner.mpage.wasLoaded = true;
    }

    return function (opts) {
        var ajax = new XMLCclRequest();
        ajax.onreadystatechange = function () {
            var callFn, i, json, logger, msg, statusData;
            if (typeof console !== 'undefined') {
                logger = console.log;
            } else {
                logger = alert;
            }
            if (ajax.readyState === 4 && ajax.status === 200) {
                callFn = true;
                try {
                    json = $.parseJSON(ajax.responseText);
                    statusData = null;
                    for (i in json) {
                        if (json[i]["STATUS_DATA"]) {
                            statusData = json[i]["STATUS_DATA"];
                            break;
                        }
                    }
                    if (statusData && statusData.STATUS) {
                        if (stat) {
                            stat(statusData);
                        } else if (/[fp]/i.test(statusData.STATUS)) {
                            alert(JSON.stringify(statusData) + "\n\nscript inputs = " + opts);
                            callFn = false;
                            $("body").empty();
                        }
                    }
                    /*
                    msg = "script: " + script + "\n";
                    msg = msg + "inputs: " + opts + "\n";
                    msg = msg + "reply: " + ajax.responseText;
                    logger(msg);
                    */
                    callFn && fn(json);
                } catch (e) {
                    msg = "error parsing reply. message: " + e.message + "\n";
                    msg = msg + "script: " + script + "\n";
                    msg = msg + "inputs: " + opts + "\n";
                    msg = msg + "response text: " + ajax.responseText;
                    alert(msg);
                }
            } else {
                if (ajax.status >= 400 && ajax.status <= 599) {
                    msg = "server status error: " + ajax.status + "\n";
                    msg = msg + "script: " + script + "\n";
                    msg = msg + "inputs: " + opts + "\n";
                    msg = msg + "status text: " + ajax.statusText;
                    alert(msg);
                }
            }
        };
        ajax.open("GET", script);
        ajax.send(opts);
    };
};

/**
 * @class
 * This class wraps the checkpoint system. It allows developers to make use of the RTMS V4 API.
 * @returns {CheckpointTimer}
 * @constructor
 */
function CheckpointTimer() {
	this.m_checkpointObject = null;
	try {
		this.m_checkpointObject = CERN_Platform.getDiscernObject("CHECKPOINT");
	} catch (exe) {
		logger.logError("Unable to create checkpoint object via window.external.DiscernObjectFactory('CHECKPOINT')");
		return this;
	}
	return this;
}

/**
 * Sets the ClassName parameter on the checkpoint object, if it exists. The class name identifies which class
 * this checkpoint originates from.
 * @param {string} className - The ClassName parameter for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setClassName = function (className) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.ClassName = className;
	}
	return this;
};

/**
 * Sets the ProjectName parameter on the checkpoint object. The project name identifies the project that this
 * checkpoint originates from.
 * @param {string} projectName - The ProjectName parameter for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setProjectName = function (projectName) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.ProjectName = projectName;
	}
	return this;
};

/**
 * Sets the EventName on the checkpoint object. The event name identifies which event the checkpoint originates
 * from.
 * @param {string} eventName - The EventName for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setEventName = function (eventName) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.EventName = eventName;
	}
	return this;
};

/**
 * Sets the SubEventName on the checkpoint object. The sub event name identifies which sub-event the checkpoint
 * originates from.
 * @param {string} subEventName - The SubEventName for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setSubEventName = function (subEventName) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.SubEventName = subEventName;
	}
	return this;
};

/**
 * Calls Publish on the checkpoint object. This will publish the checkpoint out to the timer system.
 */
CheckpointTimer.prototype.publish = function () {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.Publish();
	}
};

/**
 * This will add a metadata value to the checkpoint object with the specified key and value.
 * @param {string} key - The key value for the metadata.
 * @param {string} value - The value for the metadata.
 */
CheckpointTimer.prototype.addMetaData = function(key, value) {
	if(this.m_checkpointObject && key && value) {
		try {
			//Check where the code is being run (Millennium vs Web) so we can call the appropriate 
			//metadata function.  
			if(CERN_Platform.inMillenniumContext()){
				//Call the win32 implementation of MetaData (Millennium)
				this.m_checkpointObject.MetaData(key) = value; 
			}else{
				//Call the web enabled implementation of metaData (Web Enabled)
				this.m_checkpointObject.MetaData(key,value);
			}
		} catch (e) {
			logger.logError("Error adding MetaData [" + key + "] = " + value + "; on CheckpointTimer");
			return this;
		}
	}
	return this;
};

/**
 * @class
 * This class handles the classic use of timers in our system. This version of the timer makes use of the
 * Checkpoint system rather than the traditional Start and Stop methods.
 * @param {string} timerName - The name of the timer. This maps to the original TimerName of the old timer system.
 * @param {string} subTimerName - The name of the sub timer. This maps to the original SubTimerName of the old timer system.
 * @returns {RTMSTimer}
 * @constructor
 */
function RTMSTimer(timerName, subTimerName) {
	this.m_checkpointTimer = new CheckpointTimer();
	this.m_checkpointTimer.setEventName(timerName);
	this.m_checkpointTimer.addMetaData("rtms.legacy.subtimerName", subTimerName);
	return this;
}

/**
 * Adaptor method that simply passes through to the checkpoint object and adds metadata.
 * @param {String} key - the metadata key.
 * @param {String} value - the metadata value.
 */
RTMSTimer.prototype.addMetaData = function(key, value) {
	this.m_checkpointTimer.addMetaData(key, value);
	return this;
};

/**
 * Starts the timer by setting the SubEventName on the checkpoint and calling publish.
 */
RTMSTimer.prototype.start = function() {
	this.checkpoint("Start");
};

/**
 * @deprecated
 * This method has been deprecated. Use RTMSTimer.prototype.start instead.
 * @constructor
 */
RTMSTimer.prototype.Start = function() {
	this.start();
};

/**
 * Stops the timer by setting the SubEventName on the checkpoint and calling publish.
 */
RTMSTimer.prototype.stop = function() {
	this.checkpoint("Stop");
};

/**
 * @deprecated
 * This method has been deprecated. Use RTMSTimer.prototype.stop instead.
 * @constructor
 */
RTMSTimer.prototype.Stop = function() {
	this.stop();
};

/**
 * Fails the timer by setting the SubEventName on the checkpoint and calling publish.
 */
RTMSTimer.prototype.fail = function() {
	this.checkpoint("Fail");
};

/**
 * @deprecated
 * This method has been deprecated. Use RTMSTimer.prototype.fail instead.
 * @constructor
 */
RTMSTimer.prototype.Abort = function() {
	this.fail();
};

/**
 * Publishes a checkpoint for the timer.
 * @param {string} subEventName - The sub event name of the checkpoint.
 */
RTMSTimer.prototype.checkpoint = function(subEventName) {
	this.m_checkpointTimer.setSubEventName(subEventName);
	this.m_checkpointTimer.publish();
};
/**
 * @class
 * @param {string} timerName - The name of the timer. This maps to the original TimerName of the old timer system.
 * @param {string} subTimerName - The name of the sub timer. This maps to the original SubTimerName of the old timer system.
 * @returns {CapabilityTimer} - Returns self.
 * @constructor
 */
function CapabilityTimer(timerName, subTimerName) {
	this.m_checkpointTimer = new CheckpointTimer();
	this.m_checkpointTimer.setEventName(timerName);
	this.m_checkpointTimer.addMetaData("rtms.legacy.subtimerName", subTimerName);
	return this;
}

/**
 * Adaptor method that simply passes through to the checkpoint object and adds metadata.
 * @param {String} key - the metadata key.
 * @param {String} value - the metadata value.
 */
CapabilityTimer.prototype.addMetaData = function(key, value) {
	this.m_checkpointTimer.addMetaData(key, value);
	return this;
};

/**
 * This method will perform a capability capture. This is meant to capture a piece of functionality
 * in order to determine how often something is used. Notice that is makes use of the checkpoint system
 * and simply calls Start followed by Stop immediately.
 */
CapabilityTimer.prototype.capture = function () {
	this.m_checkpointTimer.setSubEventName("Start-Stop");
	this.m_checkpointTimer.publish();
};
/**
 * @class
 * This class helps measure the time spent on a sequence of tasks.
 * It’s designed to track a list of tasks and automatically stops the timer when all the tasks are completed.
 * When the tasks are not completed before the failure time out, it will automatically abort the timer.
 * @param {string} timerName - The name of the timer.
 * @param {string} subTimerName - The name of the sub timer.
 * @returns {AggregateTimer}
 * @constructor
 */
function AggregateTimer(timerName, subTimerName) {
	this.m_rtmsTimer = new RTMSTimer(timerName, subTimerName);
	this.m_timerStatus = AggregateTimer.Status.NOT_STARTED;
	this.m_isRegistrationOpen = true;
	this.m_taskList = [];
	//set the time out to be 120 seconds
	this.m_failureTimeoutSeconds = 120;

	return this;
};

/**
 * Enumeration type that represents the AggregateTimer's status
 * Not started: The timer is not started yet.
 * Started: The timer is started.
 * Terminated: The timer is stopped or aborted.
 */
AggregateTimer.Status = {
	NOT_STARTED: 0,
	STARTED: 1,
	TERMINATED: 2
};

/**
 * Adaptor method that simply passes through to the RTMSTimer object and adds metadata.
 * @param {String} key - the metadata key.
 * @param {String} value - the metadata value.
 * @returns {undefined} undefined
 */
AggregateTimer.prototype.addMetaData = function(key, value) {
	this.m_rtmsTimer.addMetaData(key, value);
	return this;
};

/**
 * It marks the timer as already being started and begins waiting for the failure time out.
 * If the tasks fail to complete before the time out, it will call abortTimer to abort the timer.
 * It is used in the scenario when a timer is started before access to the AggregateTimer API is made available.
 * Otherwise the startTimer function should be used.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.markTimerStarted = function() {
	if(this.m_timerStatus === AggregateTimer.Status.NOT_STARTED){
		this.m_timerStatus = AggregateTimer.Status.STARTED;
		//at this point the timer is already started.
		// It will check if the timer has been stopped (when all tasks are completed) after the specified time.
		// Otherwise it will log an error message and include the tasks that are not completed yet.
		var self = this;
		setTimeout(function(){
			if(self.m_timerStatus === AggregateTimer.Status.STARTED){
				self.abortTimer();
			}
		}, this.m_failureTimeoutSeconds * 1000);
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to mark the timer as being started.");
	}
	return this;
};


/**
 * It registers a tasks in the aggregate timer object by putting it in the task list.
 * @param {string} taskId The ID/name of the task
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.registerTask = function(taskId) {
	if(this.m_isRegistrationOpen){
		this.m_taskList.push(taskId);
	}else{
		logger.logWarning("AggregateTimer can't register task "+ taskId + " becaues registration is locked.");
	}
	return this;
};

/**
 * It locks the registration so no other tasks can be registered.
 * Only after closing the registration, AggregateTimer can be stopped when the last task completes.
 * In the rare scenarios when all components finish loading before registration is locked, this function will stop the timer.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.lockRegistration = function() {
	this.m_isRegistrationOpen = false;
	//if all tasks are completed, it should stop the timer
	if(this.m_taskList.length === 0){
		this.stopTimer();
	}
	return this;
};

/**
 * It crosses off a task off the task list. When the task list becomes empty, it will automatically stop the timer.
 * @param {string} taskId The ID/name of the task
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.completeTask = function(taskId) {
	if(this.isTerminated()){
		logger.logWarning("AggregateTimer is attempting to complete the task " + taskId + " when the timer is already terminated. ");
		return;
	}

	var taskArray = this.m_taskList;
	//remove the completed task from the task list
	var taskIndex = $.inArray(taskId, taskArray);
	if(taskIndex > -1){
		taskArray.splice(taskIndex,1);
	}

	//if all tasks are completed after registration is closed, it should stop the timer
	if(!this.m_isRegistrationOpen && taskArray.length === 0){
		this.stopTimer();
	}

	return this;
};

/**
 * It starts the timer by calling the RTMSTimer's start function.
 * It also calls markTimerStarted to change the internal status to "started".
 * If a timer with the same name and subtimer name is already started outside of the API,
 * function markTimerStarted should be called instead.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.startTimer = function() {
	if(this.m_timerStatus === AggregateTimer.Status.NOT_STARTED){
		this.m_rtmsTimer.start();
		this.m_timerStatus = AggregateTimer.Status.STARTED;
		this.markTimerStarted();
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to start the timer. ");
	}
	return this;
};

/**
 * It stops the timer and changes the internal status to "terminated" so it cannot be stopped/aborted again.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.stopTimer = function() {
	if(this.m_timerStatus === AggregateTimer.Status.STARTED){
		this.m_rtmsTimer.stop();
		this.m_timerStatus = AggregateTimer.Status.TERMINATED;
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to stop the timer. ");
	}
	return this;
};

/**
 * It aborts the timer and changes the internal status to "terminated" so it cannot be stopped/aborted again.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.abortTimer = function() {
	if(this.m_timerStatus === AggregateTimer.Status.STARTED){
		this.m_rtmsTimer.fail();
		this.m_timerStatus = AggregateTimer.Status.TERMINATED;
		var taskListString = this.m_taskList.join(",");
		logger.logWarning("AggregateTimer has timed out with incompleted task(s): " + taskListString);
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to abort the timer. ");
	}
	return this;
};

/**
 * It specifies the tasks’ failure time out.
 * If not set, the default value is 120 seconds because most MPages are expected to finish loading within the time frame.
 * @param {number} timeInSeconds The failure timer out in seconds
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.setFailureTimeoutSeconds = function (timeInSeconds){
	if(typeof timeInSeconds !== "number"){
		throw new Error("Function setFailureTimeoutSeconds is expecting a number.");
	}
	this.m_failureTimeoutSeconds = timeInSeconds;
	return this;
};

/**
 * It returns whether the timer has been stopped or aborted.
 * @returns {boolean} The flag that indicates whether the timer is terminated
 */
AggregateTimer.prototype.isTerminated = function() {
	return (this.m_timerStatus === AggregateTimer.Status.TERMINATED);
};

/*globals pvFrameworkLink, Infobutton, MPAGES_EVENT*/

/**
 * @namespace
 * The CERN_Platform namespace is utilized to house information about the Millennium Platform.  It also contains functions
 * which will allow the consumer to indirectly interact with specific Millennium Win32 APIs.  Essentially the CERN_Platform will
 * act as a middle man between the Millennium platform and the consumer.  This will allow the for passivity when MPages are being
 * run within and outside of a Millennium context.  More specific information can be found in each of the available functions below.
 */
var CERN_Platform = {
	m_inMillenniumContext: null,
	m_inPatientChartContext: null,
	m_inTouchMode: false,
	m_scriptServletLoc: "",
	m_webappRoot : null,
	m_criterion: null
};

/**
 * This function is used to retrieve the criterion object that is used to identify basic information about the execution of
 * an MPageView.
 * @return {object} The parsed criterion object
 */
CERN_Platform.getCriterion = function(){
	if(!this.m_criterion){
		try{
			this.m_criterion = JSON.parse(m_criterionJSON);
		}
		catch(err){
			logger.logError("Unable to successfully parse the criterion JSON: " + m_criterionJSON);
			throw new Error("Unable to successfully parse the criterion JSON");
		}
	}
	return this.m_criterion;
};

/**
 * Returns an object via DiscernObjectFactory with the specified name. If not within the context of Millennium,
 * getDiscernObjectWebEquivalent function returns the web equivalent of a Discern object if it exists else null will
 * be returned.
 * @param {string} objectName - The name of the object to be obtained via DiscernObjectFactory or web equivalent of a Discern object.
 * @returns {object} The discern object or its web equivalent if available
 */
CERN_Platform.getDiscernObject = function (objectName) {
	try {
		return this.inMillenniumContext() ? window.external.DiscernObjectFactory(objectName) : this.getDiscernObjectWebEquivalent(objectName);
	} catch (exe) {
		logger.logError("In CERN_Platform.getDiscernObject: An error occurred when trying to retrieve: " + objectName + " from window.external.DiscernObjectFactory");
		return null;
	}
};

/**
 * This function will return the web equivalent of a Discern object if it exists.  Web equivalents mimic the APIs that are available
 * within Discern Object.
 * @param {string} discernObjectName The name of the discern object being retrieved
 * @return {object} The web equivalent of the discern object or null if it does not exist
 */
CERN_Platform.getDiscernObjectWebEquivalent = function(discernObjectName){
	switch(discernObjectName){
		case "DOCUTILSHELPER":
			return null; //docUtilsHelper;
		case "AUTOTEXTHELPER":
			return null; //autotextHelper;
		case "PVFRAMEWORKLINK":
			return pvFrameworkLink;
		case "INFOBUTTONLINK":
			return new Infobutton();
		case "CHECKPOINT":
			return new webCheckpoint.checkpoint();
		case "PVCONTXTMPAGE":
			return WebPVContxtMpage;	
		default:
			return null;
	}
};

/**
 * The inMillenniumContext function can be used to determine if the the current MPage is being run from within the context of a
 * Millennium application or not.  From there the consumer can utilize Win32 pieces of functionality or gracefully degrade based on the
 * availability of alternative solutions.
 * @return {boolean} true if the mpage is being run within Millennium, false otherwise.
 */
CERN_Platform.inMillenniumContext = function () {
	if (this.m_inMillenniumContext === null) {
		this.m_inMillenniumContext = (window.external && (typeof window.external.DiscernObjectFactory !== "undefined")) ? true : false;
	}
	return this.m_inMillenniumContext;
};

/**
 * This function is used to determine if the MPagesView is being shown within the context of a patient's chart.
 * It determines this by checking the global criterion object for a person_id.  If that is populated, the MPages
 * is for sure being shown within some patient context.  Otherwise, if it is not populated we can assume the MPage
 * is being shown in a different context.
 * @return {boolean} True if the MPage is being shown within a patient context, false otherwise
 */
CERN_Platform.inPatientChartContext = function(){
	if (this.m_inPatientChartContext === null) {
		//Get the criterion object and check the personid
		var criterion = this.getCriterion().CRITERION;
		this.m_inPatientChartContext = criterion.PERSON_ID ? true : false;
	}
	return this.m_inPatientChartContext;
};

/**
 * Returns a flag indicating if touch mode is enabled
 * @returns {boolean} A flag indicating if touch mode is enabled
 */
CERN_Platform.isTouchModeEnabled = function () {
	return this.m_inTouchMode;
};

/**
 * Sets the servlet location.
 * @param {String} servletLocation A string used to indicate the location of servlet.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setScriptServletLocation = function(servletLocation) {
    this.m_scriptServletLoc = servletLocation;
};

/**
 *Gets the servlet location.
 *@returns {String} A string used to indicate the location of the script servlet.
 */
CERN_Platform.getScriptServletLocation = function() {
    return this.m_scriptServletLoc;
};

 /*
 * Sets a flag to indicate if touch mode is enabled
 * @param {boolean} touchModeFlag A flag to indicate if touch mode is enabled
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setTouchModeEnabled = function (touchModeFlag) {
	this.m_inTouchMode = touchModeFlag;
	// Add a class to body if touch mode is enabled
	// No need to remove the class if touch mode is disabled because the page refreshes and MPage is painted again
	if(touchModeFlag){
		$("body").addClass("touch-mode");
	}
};

/**
 * Single function to redirect the page, for use in CCLLINK replacement
 * @param {Object} newUrl The new page location
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setLocation = function(newUrl){
	window.location.assign(newUrl);
};

/**
 * This function is used to refresh the MPage View programatically.  Determines the parameters to utilze based on the 
 * context of the MPage.
 */
CERN_Platform.refreshMPage = function(){
	var criterion = CERN_Platform.getCriterion().CRITERION;
	var cclParams = null;
	
	//Determine if we are viewing the current MPage in a patient context
	if(CERN_Platform.inPatientChartContext()){
		cclParams = ["^MINE^", criterion.PERSON_ID + ".0", criterion.ENCNTRS[0].ENCNTR_ID + ".0", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", criterion.PPR_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", criterion.DEBUG_IND];
	}
	else{
		cclParams = ["^MINE^", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", criterion.DEBUG_IND];
	}
	CCLLINK(CERN_driver_script, cclParams.join(","), 1);
};

/**
 * This function will create a global CCLLINK function that will launch a CCL program through the MPages webserver and displaying the contents.
 * This also prevents situations where IE pre-loads global functions before JS execution.
 * @param {String} reportName - CCL program name
 * @param {String} prompts - prompt parameters for the reportName
 * @param {String} linkDestination - a function used in the original CCLLINK to determine if the URL is launched into a separate DiscernReportViewer.
 * 										This is ignored in this implementation.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.CCLLINK = function(reportName, prompts, linkDestination){
	//For web enabled MPages, only enable CCLLINK functionality if the reportName is "MP_UNIFIED_DRIVER" or "MP_UNIFIED_ORG_DRIVER".  
	//All other implementations should fail silently.
	if(/^MP_UNIFIED_.*DRIVER/.test(reportName.toUpperCase())){
		CERN_Platform.setLocation(window.location.href);
	} else {
		logger.logWarning("CCLLINK is not supported outside of Millennium for program: " + reportName + ".");
	}
};

/**
 * A replacement for the MPAGES_EVENT function that will do nothing, but prevent a failure.
 * @param {String} eventType - the type of event to be used.  This will be ignored in this function
 * @param {String} eventParams - the parameters of the event to be used.  This will be ignored in this function.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.MPAGES_EVENT = function(eventType, eventParams){
	return;
};

/**
 * This function will create a global APPLINK function that will do nothing, but prevent a failure.
 * @param {Integer} mode - A numeric value representing the mode to start the application link
 * 		0 - Used for starting a solution by executable name
 * 		1 - Used for starting a solution by the application object, such as DiscernAnalytics.Application
 * 		100 - Used to launch a file, link, or executable through a shell execute.
 * @param {String} appname - The application executable name
 * @param {String} params - The person_id, encntr_id and Powerchart tab name.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.APPLINK = function(mode, appname, params){
	return;
};

/*This function retrieves a cookie that contains info about the context root for the webpage
 * Then creates and returns the mpRoot as a string
 */
CERN_Platform.makeRoot = function(){
	return document.cookie.replace(/(?:(?:^|.*;\s*)mpRoot\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};

/**
 * This function will attempt to read the context root of the webapp from a cookie named "mpRoot", and then return the full URL 
 *   of the webapp with context root.
 *   Note that the "mpRoot" cookie is the context root string is created by the login.jsp page.
 * @param none
 * @returns {String} A string representing the full URL of the webapp.  For example: "https://subDomainName.domainName.com/webappName/canonical.domain.name"
 */
CERN_Platform.getWebappRoot = function() {
	var setWebAppRoot = function (newRoot) {	
		if (newRoot) {
			CERN_Platform.m_webappRoot = location.protocol + "//" + location.host + newRoot;
		}
	};

	if (typeof this.m_webappRoot !== 'string') {
		setWebAppRoot(CERN_Platform.makeRoot());
	}
	return this.m_webappRoot;
};


/**
 * This code will update the CCLLINK function if necessary, ensuring that it's action is similar both inside and outside of a Win32
 * context.  It is defined at a global level since CCLLINK is defined at the global level.  Default CCLLINK functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/CCLLINK
 */
if(typeof CCLLINK === "undefined"){
	CCLLINK = CERN_Platform.CCLLINK;
}

/**
 * This code will update the MPAGES_EVENT function if necessary, ensuring that it's action is will not cause a failure message.
 * It is defined at a global level since MPAGES_EVENT is defined at the global level.  Default MPAGES_EVENT functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/MPAGES_EVENT
 */
if(typeof MPAGES_EVENT === "undefined"){
	MPAGES_EVENT = CERN_Platform.MPAGES_EVENT;
}

/**
 * This code will update the APPLINK function if necessary, ensuring that it's action is similar both inside and outside of a Win32
 * context.  It is defined at a global level since APPLINK is defined at the global level.  Default APPLINK functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/APPLINK
 */
if(typeof APPLINK === "undefined"){
	APPLINK = CERN_Platform.APPLINK;
}

/*globals MP_Timezone, SortMPageComponents, MD_reachViewerDialog, AutoSuggestControl, ThemeSelector, hs, log,
MessageModal, ErrorModal, WarningModal, InfoModal, BusyModal */

/*
 The scope of an MPage object and Components are during rendering of the page.  However,
 once the page has been rendered these items are lost.  Because there is a need to refresh
 components, the components on a 'page' must be globally stored to allow for refreshing of data.
 */
var CERN_EventListener = null; //eslint-disable-line no-redeclare, mp-camelcase
var CERN_MPageComponents = null;
//A global object which keeps a mapping of Report Means to the components which should be instantiated.
//Supporting functionality is located in the MP_Util namespace
var CERN_ObjectDefinitionMapping = {};
var CERN_BrowserDevInd = false; //eslint-disable-line no-redeclare
var CK_DATA = {};

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

/* If the browser does not define the addAll function for the Array */
if (!Array.prototype.addAll) {
    Array.prototype.addAll = function(v) { //eslint-disable-line no-extend-native
        if (v && v.length > 0) {
            for (var x = 0, xl = v.length; x < xl; x++) {
                this.push(v[ x ]);
            }
        }
    };
}

/**
 *  Since IE10 is the minimum browser version, we no longer need an implementation of Array.prototype.indexOf.
 *  This check is being left in place to allow SWx to quickly identify if the client does not have the
 *  proper version of IE installed on the Citrix Box.
 **/
if (!Array.prototype.indexOf) {
    throw new Error("Browser version does not contain an implementation of Array.prototype.indexOf");
}

/**
 *  Since IE10 is the minimum browser version, we no longer need an implementation of Function.prototype.bind.
 *  This check is being left in place to allow SWx to quickly identify if the client does not have the
 *  proper version of IE installed on the Citrix Box.
 **/
if (!Function.prototype.bind) {
    throw new Error("Browser version does not contain an implementation of Function.prototype.bind");
}

/**
 *  Since IE10 is the minimum browser version, we no longer need an implementation of document.getElementsByClassName.
 *  This check is being left in place to allow SWx to quickly identify if the client does not have the
 *  proper version of IE installed on the Citrix Box.
 **/
if (!document.getElementsByClassName) {
    throw new Error("Browser version does not contain an implementation of document.getElementsByClassName");
}

/*
 * this function overrides the browsers error handling functionality so we can display a user friendly
 * rather than the browsers technical dialog.
 * @param {string} message - The message associated to the error that has occurred
 * @param {string} file - The file where the error has occurred
 * @param {number} lineNumber - The line number the error was thrown from
 * @param {number} columnNumber - The column number in the file where the error originated
 * @param {Error} error - The error that was intercepted by the window.onerror.
 * 		This parameter is defined in IE11+ and as such, must be ignored if
 * 		it is not defined.
 * @return {boolean}
 */
window.onerror = function(message, file, lineNumber, columnNumber, error) {
    var errorModal = null;
    var refreshButton = null;
    var closeButton = null;
    var source = i18n.UNKNOWN;
    //Accessing callee/caller is seen as potentially dangerous, so wrap it
    //in a try/catch block
    try {
        if (error && error.stack) {
            source = error.stack;
        } else {
            source = arguments.callee.caller.toString(); //eslint-disable-line no-caller
        }
    } catch (err) {
        //Intentionally empty catch
    }
    //Immediately enable blackbird logging to report the page level error
    log.setLoggingActive(true);
    log.error(
        i18n.UNEXPECTED_ERROR_CAUGHT + "<br />" +
        i18n.discernabu.JS_ERROR + ": " + message + "<br />" +
        i18n.FILE + ": " + file + "<br />" +
        i18n.LINE_NUMBER + ": " + lineNumber + "<br />" +
        i18n.SOURCE + ": " + source + "<br />"
    );

    //Throw the error when we are developing in a browser, otherwise show the modal to the user
    if (CERN_BrowserDevInd) {
        throw (new Error(i18n.UNEXPECTED_ERROR_CAUGHT + "<br />" + i18n.discernabu.JS_ERROR + ": " + message + "<br />" + i18n.FILE + ": " + file + "<br />" + i18n.LINE_NUMBER + ": " + lineNumber));
    }
    else {
        //Create a modal dialog and ask the user if they would like to refresh or continue
        errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
        if (!errorModal) {
            errorModal = MP_Util.generateModalDialogBody("errorModal", "error", i18n.PAGE_ERROR, i18n.PAGE_ERROR_ACTION);
            errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
            //Create and add the refresh button
            refreshButton = new ModalButton("refreshButton");
            refreshButton.setText(i18n.REFRESH).setCloseOnClick(true);
            refreshButton.setOnClickFunction(function() {
                //Refresh the page
                CERN_Platform.refreshMPage();
            });


            errorModal.addFooterButton(refreshButton);
            //Create and add the close button
            closeButton = new ModalButton("closeButton");
            closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
            errorModal.addFooterButton(closeButton);
        }
        MP_ModalDialog.updateModalDialogObject(errorModal);
        MP_ModalDialog.showModalDialog("errorModal");

        //Returning true supresses the error in FireFox and IE but allows it to propegate in Chrome
        return true;
    }
};

/**
 * Core utility methods
 * @namespace
 */
var MP_Core = function() { //eslint-disable-line no-redeclare
    return {
        /**
         * This function returns the normalcy class associated with the result
         * @param result - is the MP_Core.Measurement object.
         */
        GetNormalcyClass: function(result) {
            var normalcy = "res-normal";
            var normalcyMeaning = result.getNormalcy();
            if (normalcyMeaning) {
                switch (normalcyMeaning.meaning) {
                    case "LOW":
                        normalcy = "res-low";
                        break;
                    case "HIGH":
                        normalcy = "res-high";
                        break;
                    case "ABNORMAL":
                        normalcy = "res-abnormal";
                        break;
                    case "CRITICAL":
                    case "EXTREMEHIGH":
                    case "PANICHIGH":
                    case "EXTREMELOW":
                    case "PANICLOW":
                    case "VABNORMAL":
                    case "POSITIVE":
                        normalcy = "res-severe";
                        break;
                }
            }
            return normalcy;
        },
        /**
         * This function associates appropriate styles to the results.
         * @param result - is the MP_Core.Measurement object.
         * @param excludeUOM - This value indicates whether to add the Unit of measurement or not.
         */
        GetNormalcyResultDisplay: function(result, excludeUOM) {
            var ar = [ "<span class='", MP_Core.GetNormalcyClass(result), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>", MP_Core.GetEventViewerLink(result, MP_Util.Measurement.GetString(result, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(result), "</span>" ]; //eslint-disable-line new-cap
            return ar.join("");
        },
        /**
         * This function links the result viewer to the respective results.
         * @param result - is the MP_Core.Measurement object.
         * @param sResultDisplay - This contains the  value that needs to be displayed.
         */
        GetEventViewerLink: function(result, sResultDisplay) {
            var params = [ result.getPersonId(), result.getEncntrId(), result.getEventId(), "\"EVENT\"" ];
            var ar = [ "<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", sResultDisplay, "</a>" ];
            return ar.join("");
        },
        /**
         * The criterion object stores information about the request in context such as the patient/person, encounter/visit,
         * provider/personnel, relationship etc.
         */
        Criterion: function(jsCrit, static_content) {
            var m_patInfo = null;
            var m_prsnlInfo = null;
            var m_encntrOverride = [];

            this.person_id = jsCrit.PERSON_ID;
            this.encntr_id = (jsCrit.ENCNTRS.length > 0) ? jsCrit.ENCNTRS[ 0 ].ENCNTR_ID : 0;
            this.provider_id = jsCrit.PRSNL_ID;
            this.executable = jsCrit.EXECUTABLE;
            this.static_content = static_content;
            this.position_cd = jsCrit.POSITION_CD;
            this.ppr_cd = jsCrit.PPR_CD;
            this.debug_ind = jsCrit.DEBUG_IND;
            CERN_BrowserDevInd = ((parseInt(this.debug_ind, 10) & 0x01) === 1) ? true : false;
            this.help_file_local_ind = jsCrit.HELP_FILE_LOCAL_IND;
            this.category_mean = jsCrit.CATEGORY_MEAN;
            this.locale_id = ((parseInt(this.debug_ind, 10) & 0x02) === 2) ? "en_us" : jsCrit.LOCALE_ID;
            this.logical_domain_id = (typeof jsCrit.LOGICAL_DOMAIN_ID !== "undefined") ? jsCrit.LOGICAL_DOMAIN_ID : null;
            try {
                if (CERN_Platform.inMillenniumContext()) {
                    this.client_tz = jsCrit.CLIENT_TZ;
                }
                else {
                    this.client_tz = MP_Timezone.getTzIndex();
                }
            } catch (err) {
                logger.logWarn("Unable to set client time zone");
                this.client_tz = 0; //utc
            }

            //@deprecated as of 3.3.1 and should be removed as of greater than or equal to 3.4
            this.device_location = "";
            this.facility_cd = jsCrit.ENCNTR_LOCATION.FACILITY_CD;

            var encntrOR = jsCrit.ENCNTR_OVERRIDE;

            if (encntrOR) {
                for (var x = encntrOR.length; x--;) {
                    m_encntrOverride.push(encntrOR[ x ].ENCNTR_ID);
                }
            }
            else {
                m_encntrOverride.push(this.encntr_id);
            }

            this.setPatientInfo = function(value) {
                m_patInfo = value;
            };


            this.getPatientInfo = function() {
                return m_patInfo;
            };

            this.getPersonnelInfo = function() {
                if (!m_prsnlInfo) {
                    m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
                }
                return m_prsnlInfo;
            };

            /**
             * @return List of encounters that are considered 'ACTIVE'.
             * In the rare case that encounter override is needed, this will return the encounter neccessary to pass
             * to a service for retrieval of data.
             */
            this.getEncounterOverride = function() {
                return m_encntrOverride;
            };

            this.is_utc = jsCrit.IS_UTC;

        },
        PatientInformation: function() {
            var m_dob = null;
            var m_sex = null;
            var m_name = "";

            this.setSex = function(value) {
                m_sex = value;
            };
            this.getSex = function() {
                return m_sex;
            };
            this.setDOB = function(value) {
                m_dob = value;
            };
            this.getDOB = function() {
                return m_dob;
            };
            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
        },

        PeriopCases: function() {
            var m_case_id = null;
            var m_days = null;
            var m_hours = null;
            var m_mins = null;
            var m_cntdwn_desc_flag = null;

            this.setCaseID = function(value) {
                m_case_id = value;
            };
            this.getCaseID = function() {
                return m_case_id;
            };
            this.setDays = function(value) {
                m_days = value;
            };
            this.getDays = function() {
                return m_days;
            };
            this.setHours = function(value) {
                m_hours = value;
            };
            this.getHours = function() {
                return m_hours;
            };
            this.setMins = function(value) {
                m_mins = value;
            };
            this.getMins = function() {
                return m_mins;
            };
            this.setCntdwnDscFlg = function(value) {
                m_cntdwn_desc_flag = value;
            };
            this.getCntdwnDscFlg = function() {
                return m_cntdwn_desc_flag;
            };
        },

        ScriptRequest: function(component, loadTimerName) {
            var m_comp = component || null;
            var m_load = loadTimerName || "";
            var m_name = "";
            var m_programName = "";
            var m_params = null;
            var m_blobIn = null;
            var m_async = true;
            var m_responseHandler = null;
            var m_timer = null;
            var m_source = null;
            var m_execCallback = false;
            //Specify whether the consumer is expecting raw data
            var m_requiresRawData = false;

            this.setExecCallback = function(value) {
                m_execCallback = value;
            };

            this.getExecCallback = function() {
                return m_execCallback;
            };

            this.logCompletion = function(reply) {
                logger.logMessage("<b>Request Ended</b><br /><ul>" +
                    "<li>program: " + m_programName + "</li>" +
                    "<li>end_time: " + new Date() + "</li>" +
                    "<li>status: " + reply.status + "</li></ul>");
            };

            this.logStart = function() {
                logger.logMessage("<b>Request Started</b><br /><ul>" +
                    "<li>program: " + m_programName + "</li>" +
                    "<li>start_time: " + new Date() + "</li></ul>");
            };

            this.start = function() {
                MP_Core.XMLCCLRequestCallBack(this.m_comp, this); //eslint-disable-line new-cap
            };

            this.notify = function() {
                //We only notify the manager if the request was started by the manager
                if (this.getSource() !== RequestManager.SOURCE) {
                    return;
                }
                MP_RequestManager.notify();
            };

            this.getResponseHandler = function() {
                return m_responseHandler;
            };

            this.setResponseHandler = function(responseHandler) {
                m_responseHandler = responseHandler;
            };

            this.getTimer = function() {
                return m_timer;
            };

            this.setTimer = function(timer) {
                m_timer = timer;
            };

            this.getComponent = function() {
                return m_comp;
            };
            this.getLoadTimer = function() {
                return m_load;
            };
            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
            this.setProgramName = function(value) {
                m_programName = value;
            };
            this.getProgramName = function() {
                return m_programName;
            };
            this.setParameters = function(value) {
                m_params = value;
            };
            this.getParameters = function() {
                return m_params;
            };
            this.setRequestBlobIn = function(value) {
                m_blobIn = value;
            };
            this.getRequestBlobIn = function() {
                return m_blobIn;
            };
            this.setAsync = function(value) {
                m_async = value;
            };
            this.isAsync = function() {
                return m_async;
            };
            this.getSource = function() {
                return m_source;
            };
            this.setSource = function(source) {
                m_source = source;
            };
            this.getRequiresRawData = function() {
                return m_requiresRawData;
            };
            this.setRequiresRawData = function(requiresRaw) {
                m_requiresRawData = requiresRaw;
            };
        },
        ScriptReply: function(component) {
            //used to syne a request to a reply
            var m_name = "";
            //by default every script reply is 'f'ailed unless otherwise noted
            var m_status = "F";
            var m_err = "";
            var m_resp = null;
            var m_comp = component;

            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
            this.setStatus = function(value) {
                m_status = value;
            };
            this.getStatus = function() {
                return m_status;
            };
            this.setError = function(value) {
                m_err = value;
            };
            this.getError = function() {
                return m_err;
            };
            this.setResponse = function(value) {
                m_resp = value;
            };
            this.getResponse = function() {
                return m_resp;
            };
            this.getComponent = function() {
                return m_comp;
            };
        },
        PersonnelInformation: function(prsnlId, patientId) {
            var m_prsnlId = prsnlId;
            //if m_viewableEncntrs remains null, error in retrieval of viewable encntr
            var m_viewableEncntrs = null;
            //load valid encounter list from patcon wrapper
            var patConObj = null;
            try {
                patConObj = CERN_Platform.getDiscernObject("PVCONTXTMPAGE"); //eslint-disable-line new-cap
                logger.logDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "PersonnelInformation");
                if (patConObj) {
                    m_viewableEncntrs = patConObj.GetValidEncounters(patientId); //eslint-disable-line new-cap
                    logger.logDebug("Viewable Encounters: " + m_viewableEncntrs);
                }
            }
            catch (e) {
            }
            finally {
                //release used memory
                patConObj = null;
            }

            this.getPersonnelId = function() {
                return m_prsnlId;
            };
            /**
             * Returns the associated encounter that the provide has the ability to see
             */
            this.getViewableEncounters = function() {
                return m_viewableEncntrs;
            };
        },
        /**
         * Create and return shared resource (viewableEncntrs) for the "Viewable Encounters" for the provided patient person_id.
         * If run within the context of win32 applications, the function will leverage PVCONTXTMPAGE and GetValidEncounters:
         *   https://wiki.ucern.com/display/public/MPDEVWIKI/GetValidEncounters
         * If run outside of win32 applications (MPages web service), this function will leverage request 3200310 (msvc_svr_get_clinctx).
         *
         * Consumers of this function should check the shared resource object that is returned to determine if data exists:
         *   viewableEncntrsObj.isResourceAvailable() && viewableEncntrsObj.getResourceData()
         *
         * If those do not both evaluate to true, the consumer should then add a listener for "viewableEncntrInfoAvailable", which will be invoked when the shared resource data is available.
         *
         * @param patientId The person_id of the patient to retrieve viewable encounters
         * @return {object} An object that contains the status of retrieving the viewable encounters, and a string of the comma separated viewable encounters (if available)
         */
        GetViewableEncntrs: function(patientId) {
            /**
             * Returns the associated encounter(s) that the currently authenticated provider has the ability to see, from PVCONTXTMPAGE.
             * This logic will be consumed from win32 MPages where PVCONTXTMPAGE is available.
             * @return {string} List of viewable encounters, comma separated
             */
            function getViewableFromPvContxtMpage() {
                var patConObj = null;
                var m_viewableEncntrs = "";
                try {
                    patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE"); //eslint-disable-line new-cap
                    logger.logDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "getViewableFromPvContxtMpage");
                    if (patConObj) {
                        m_viewableEncntrs = patConObj.GetValidEncounters(patientId); //eslint-disable-line new-cap
                        logger.logDebug("Viewable Encounters obtained from PVCONTXTMPAGE: " + m_viewableEncntrs);
                    }
                }
                catch (e) {
                }
                finally {
                    //release used memory
                    patConObj = null;
                }
                return m_viewableEncntrs;
            }


            /**
             * Make async call to retrieve viewable encounters from clinical context service, using the script mp_exec_std_request.
             * The clinical context service (msvc_svr_get_clinctx, 3200310) will return the authorized (viewable) encounters for the patient in context:
             *   Application Number: 3202004
             *   Task Number: 3202004
             *   Request Number: 3200310
             * This logic will be consumed when PVCONTXTMPAGE is not available.
             * @return {null}
             */
            function retrieveEncntrsFromClinicalContext() {
                var request = new MP_Core.ScriptRequest();
                var programName = "mp_exec_std_request";
                var jsonString = "{\"REQUESTIN\":{\"PATIENT_ID\":" + patientId + ".0,\"LOAD\":{\"AUTH_ENCOUNTER\":1}}}";
                var params = [ "^MINE^", "~" + jsonString + "~", 3202004, 3202004, 3200310 ];
                request.setProgramName(programName);
                request.setParameters(params);
                request.setAsync(true);
                request.setExecCallback(true);
                MP_Core.XMLCCLRequestCallBack(null, request, handleContextFromService); //eslint-disable-line new-cap
            }

            /**
             * Callback to Handle the reply object from retrieveEncntrsFromClinicalContext()
             * @param {object} MP_Core.ScriptReply object
             * @return {null}
             */
            function handleContextFromService(replyObj) {
                var m_viewableEncntrs = "";

                // Get the viewableEncntrs SharedResource
                var veResource = MP_Resources.getSharedResource("viewableEncntrs");

                if (replyObj.getStatus() === "S") {
                    try {
                        var recordData = replyObj.getResponse();
                        m_viewableEncntrs = $.map(recordData.AUTH_ENCOUNTER.AUTH_ENCOUNTERS, function(o) {
                            return o.ENCOUNTER_ID + ".0";
                        }).join(",");
                        logger.logDebug("Viewable Encounters obtained from ClinicalContext service: " + m_viewableEncntrs);
                    }
                    catch (err) {
                        logger.logJSError(err, this, "mp_core.js", "GetViewableEncntrs");
                    }
                }
                else {
                    logger.logError("Unable to successfully retrieve Viewable Encounters from ClinicalContext service");
                }

                veResource.setIsAvailable(true);
                veResource.setIsBeingRetrieved(false);
                veResource.setResourceData(m_viewableEncntrs);

                //Fire event for all listeners
                CERN_EventListener.fireEvent(null, self, "viewableEncntrInfoAvailable", veResource);
            }

            var self = this;
            var m_viewableEncntrs = "";

            // create the viewable encounters resource shared resource
            var veResource = MP_Resources.getSharedResource("viewableEncntrs");
            if (!veResource) {
                veResource = new SharedResource("viewableEncntrs");
                MP_Resources.addSharedResource("viewableEncntrs", veResource);
            }

            if (veResource.isResourceAvailable() && veResource.getResourceData()) {
                return veResource;
            }
            else {
                //Attempt to retrieve the viewable encounters from PVCONTXTMPAGE
                m_viewableEncntrs = getViewableFromPvContxtMpage();

                //If we obtained the viewable encounters from PVCONTXTMPAGE, set here, and return SR object
                if (m_viewableEncntrs) {
                    veResource.setResourceData(m_viewableEncntrs);
                    veResource.setIsAvailable(true);
                    return veResource;

                }
                else {
                    //Check to see if the shared resource is currently retrieving data
                    if (!veResource.isBeingRetrieved()) {
                        //Kick off the resource retrieval from ClinicalContext service
                        veResource.setIsBeingRetrieved(true);
                        retrieveEncntrsFromClinicalContext();
                    }
                    //Return the shared resource, which at this point should have isResourceAvailable() == false && getResourceData() == null
                    return veResource;
                }
            }
        },
        /**
         * @deprecated
         * Creates and runs a request for a component based on the specified component, program, and parameter array.
         * This function assumes the script call is being made for a component. This function populates a ScriptRequest
         * object and passes it off to the XmlStandardRequest method, passing null for the callback.
         * @param {MPageComponent} component  component object for which the script is being called.
         * @param {String} program  the CCL program to be run.
         * @param {Array} paramAr  the parameter array to be passed to the CCL program.
         * @param {Boolean} async  whether the script call should be asynchronous or not. (Recommended that it
         * be asynchronous).
         */
        XMLCclRequestWrapper: function(component, program, paramAr, async) {
            var loadTimer = null;
            var renderTimer = null;
            var request = null;
            if (MPageComponent.prototype.isPrototypeOf(component)) {
                //create a component script request
                request = new ComponentScriptRequest();
                request.setComponent(component);
                //Create the loadTimer and renderTimer
                loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
                renderTimer = new RTMSTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                request.setLoadTimer(loadTimer);
                request.setRenderTimer(renderTimer);
            }
            else {
                //Create a standard script request object
                request = new ScriptRequest();
            }
            request.setProgramName(program);
            request.setParameterArray(paramAr || []);
            request.setAsyncIndicator(typeof async === "boolean" ? async : true);
            request.performRequest();
        },
        /**
         * @deprecated
         * As a means in which to provide the consumer to handle the response of the script request, this method
         * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
         * about the response that can be utilized for evaluation.
         * @param component  The component in which is executing the request
         * @param oldRequestObj  A deprecated MP_Core.ScriptRequest Object containing the information about the script being executed
         * @param funcCallBack  The function to execute once the execution of the request has been completed
         */
        XMLCCLRequestCallBack: function(component, oldRequestObj, funcCallback) {
            MP_Core.XmlStandardRequest(component, oldRequestObj, funcCallback); //eslint-disable-line new-cap
        },
        /**
         * @deprecated
         * This wraps the XML requests being made. This function is called by XMLCclRequestWrapper and XMLCCLRequestCallBack.
         * Note that both component and callback are optional. However, if you want something to occur upon the script
         * completing, one or the other must be provided.
         * @param {MPageComponent} component . This parameter is an MPageComponent object. Specific methods will be called on this
         * component to render it, but only if it is provided.
         * @param {ScriptRequest} oldRequestObj   A deprecated MP_Core.ScriptRequest Object containing the information about the script being executed
         * @param {Function} funcCallBack  the function to be called upon a request returning.
         */
        XmlStandardRequest: function(component, oldRequestObj, funcCallback) {
            var loadTimer = null;
            var renderTimer = null;
            var request = null;
            if (MPageComponent.prototype.isPrototypeOf(component)) {
                //create a component script request
                request = new ComponentScriptRequest();
                request.setComponent(component);
                //Create the loadTimer and renderTimer
                loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
                renderTimer = new RTMSTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                request.setLoadTimer(loadTimer);
                request.setRenderTimer(renderTimer);
            }
            else {
                //Create a standard script request object
                request = new ScriptRequest();
                //Create the load timer
                loadTimer = new RTMSTimer(oldRequestObj.getLoadTimer());
                request.setLoadTimer(loadTimer);
            }
            //Copy over the remaining fields of the oldRequestObj
            request.setName(oldRequestObj.getName());
            request.setProgramName(oldRequestObj.getProgramName());
            request.setResponseHandler(funcCallback);
            request.setDataBlob(oldRequestObj.getRequestBlobIn() || "");
            request.setParameterArray(oldRequestObj.getParameters() || []);
            request.setAsyncIndicator(oldRequestObj.isAsync());
            request.setRawDataIndicator(oldRequestObj.getRequiresRawData());
            request.performRequest();
        },
        XMLCCLRequestThread: function(name, component, request) {
            var m_name = name;
            var m_comp = component;

            var m_request = request;
            m_request.setName(name);

            this.getName = function() {
                return m_name;
            };
            this.getComponent = function() {
                return m_comp;
            };
            this.getRequest = function() {
                return m_request;
            };
        },
        XMLCCLRequestThreadManager: function(callbackFunction, component, handleFinalize) {
            var m_threads = null;
            var m_replyAr = null;

            var m_isData = false;
            var m_isError = false;
            var x = 0;

            this.addThread = function(thread) {
                if (!m_threads) {
                    m_threads = [];
                }
                m_threads.push(thread);
            };

            this.begin = function() {
                if (m_threads && m_threads.length > 0) {
                    for (x = m_threads.length; x--;) {
                        //start each xmlcclrequest
                        var thread = m_threads[ x ];
                        MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread); //eslint-disable-line new-cap
                    }
                }
                else {
                    if (handleFinalize) {
                        var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                        component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText); //eslint-disable-line new-cap
                        //After the component has rendered call the postProcessing function to perform any additional actions
                        component.postProcessing();
                    }
                    else {
                        callbackFunction(null, component);
                    }
                }
            };

            this.completeThread = function(reply) {
                if (!m_replyAr) {
                    m_replyAr = [];
                }
                if (reply.getStatus() === "S") {
                    m_isData = true;
                }
                else if (reply.getStatus() === "F") {
                    m_isError = true;
                }

                m_replyAr.push(reply);
                if (m_replyAr.length === m_threads.length) {
                    var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                    var errMsg = null;
                    try {
                        if (handleFinalize) {
                            if (m_isError) {
                                //handle error response
                                errMsg = [];
                                for (x = m_replyAr.length; x--;) {
                                    var rep = m_replyAr[ x ];
                                    if (rep.getStatus() === "F") {
                                        errMsg.push(rep.getError());
                                    }
                                }
                                component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), ""); //eslint-disable-line new-cap
                            }
                            else if (!m_isData) {
                                //handle no data
                                countText = (component.isLineNumberIncluded() ? "(0)" : "");
                                component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText); //eslint-disable-line new-cap
                            }
                            else {
                                callbackFunction(m_replyAr, component);
                            }
                        }
                        else {
                            callbackFunction(m_replyAr, component);
                        }
                    }
                    catch (err) {
                        logger.logJSError(err, component, "mp_core.js", "XMLCCLRequestThreadManager");
                        var i18nCore = i18n.discernabu;
                        errMsg = [ "<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>" ];
                        component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), ""); //eslint-disable-line new-cap
                    }
                    finally {
                        if (component && typeof component.postProcessing !== "undefined") {
                            //After the component has rendered call the postProcessing function to perform any additional actions
                            component.postProcessing();
                        }
                    }
                }
            };
        },
        MapObject: function(name, value) {
            this.name = name;
            this.value = value;
        },


        ReferenceRangeResult: function() {
            //results
            var m_valNLow = -1,
                m_valNHigh = -1,
                m_valCLow = -1,
                m_valCHigh = -1;
            //units of measure
            var m_uomNLow = null,
                m_uomNHigh = null,
                m_uomCLow = null,
                m_uomCHigh = null;
            this.init = function(refRange, codeArray) {
                var nf = MP_Util.GetNumericFormatter(); //eslint-disable-line new-cap
                m_valCLow = nf.format(refRange.CRITICAL_LOW.NUMBER);
                if (refRange.CRITICAL_LOW.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
                m_valCHigh = nf.format(refRange.CRITICAL_HIGH.NUMBER);
                if (refRange.CRITICAL_HIGH.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
                m_valNLow = nf.format(refRange.NORMAL_LOW.NUMBER);
                if (refRange.NORMAL_LOW.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
                m_valNHigh = nf.format(refRange.NORMAL_HIGH.NUMBER);
                if (refRange.NORMAL_HIGH.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
            };
            this.getNormalLow = function() {
                return m_valNLow;
            };
            this.getNormalHigh = function() {
                return m_valNHigh;
            };
            this.getNormalLowUOM = function() {
                return m_uomNLow;
            };
            this.getNormalHighUOM = function() {
                return m_uomNHigh;
            };
            this.getCriticalLow = function() {
                return m_valCLow;
            };
            this.getCriticalHigh = function() {
                return m_valCHigh;
            };
            this.getCriticalLowUOM = function() {
                return m_uomCLow;
            };
            this.getCriticalHighUOM = function() {
                return m_uomCHigh;
            };
            this.toNormalInlineString = function() {
                var low = (m_uomNLow) ? m_uomNLow.display : "";
                var high = (m_uomNHigh) ? m_uomNHigh.display : "";
                if (m_valNLow != 0 || m_valNHigh != 0) { //eslint-disable-line eqeqeq
                    return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high);
                }
                else {
                    return "";
                }
            };
            this.toCriticalInlineString = function() {
                var low = (m_uomCLow) ? m_uomCLow.display : "";
                var high = (m_uomCHigh) ? m_uomCHigh.display : "";
                if (m_valCLow != 0 || m_valCHigh != 0) { //eslint-disable-line eqeqeq
                    return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high);
                }
                else {
                    return "";
                }
            };
        },

        QuantityValue: function() {
            var m_val, m_precision;
            var m_uom = null;
            var m_refRange = null;
            var m_rawValue = 0;
            var m_hasModifier = false;
            this.init = function(result, codeArray) {
                var quantityValue = result.QUANTITY_VALUE;
                var referenceRange = result.REFERENCE_RANGE;
                for (var l = 0, ll = quantityValue.length; l < ll; l++) {
                    var numRes = quantityValue[ l ].NUMBER;
                    m_precision = quantityValue[ l ].PRECISION;
                    if (!isNaN(numRes)) {
                        m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision); //eslint-disable-line new-cap
                        m_rawValue = numRes;
                    }
                    if (quantityValue[ l ].MODIFIER_CD != "") { //eslint-disable-line eqeqeq
                        var modCode = MP_Util.GetValueFromArray(quantityValue[ l ].MODIFIER_CD, codeArray); //eslint-disable-line new-cap
                        if (modCode) {
                            m_val = modCode.display + m_val;
                            m_hasModifier = true;
                        }
                    }
                    if (quantityValue[ l ].UNIT_CD != "") { //eslint-disable-line eqeqeq
                        m_uom = MP_Util.GetValueFromArray(quantityValue[ l ].UNIT_CD, codeArray); //eslint-disable-line new-cap
                    }
                    for (var m = 0, ml = referenceRange.length; m < ml; m++) {
                        m_refRange = new MP_Core.ReferenceRangeResult();
                        m_refRange.init(referenceRange[ m ], codeArray);
                    }
                }
            };

            this.getValue = function() {
                return m_val;
            };
            this.getRawValue = function() {
                return m_rawValue;
            };
            this.getUOM = function() {
                return m_uom;
            };
            this.getRefRange = function() {
                return m_refRange;
            };
            this.getPrecision = function() {
                return m_precision;
            };
            this.toString = function() {
                if (m_uom) {
                    return (m_val + " " + m_uom.display);
                }
                return m_val;
            };
            this.hasModifier = function() {
                return m_hasModifier;
            };
        },
        //measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
        Measurement: function() {
            var m_eventId = 0.0;
            var m_personId = 0.0;
            var m_encntrId = 0.0;
            var m_eventCode = null;
            var m_dateTime = null;
            var m_updateDateTime = null;
            var m_result = null;
            var m_normalcy = null;
            var m_status = null;
            var m_comment = "";
            var m_comment_ind = 0;

            this.init = function(eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime) {
                m_eventId = eventId;
                m_personId = personId;
                m_encntrId = encntrId;
                m_eventCode = eventCode;
                m_dateTime = dateTime;
                m_result = resultObj;
                m_updateDateTime = updateDateTime;
            };

            this.initFromRec = function(measObj, codeArray) {
                var effectiveDateTime = new Date();
                var updateDateTime = new Date();
                m_eventId = measObj.EVENT_ID;
                m_personId = measObj.PATIENT_ID;
                m_encntrId = measObj.ENCOUNTER_ID;
                m_eventCode = MP_Util.GetValueFromArray(measObj.EVENT_CD, codeArray); //eslint-disable-line new-cap
                effectiveDateTime.setISO8601(measObj.EFFECTIVE_DATE);
                m_dateTime = effectiveDateTime;
                m_result = MP_Util.Measurement.GetObject(measObj, codeArray); //eslint-disable-line new-cap
                updateDateTime.setISO8601(measObj.UPDATE_DATE);
                m_updateDateTime = updateDateTime;
                m_normalcy = MP_Util.GetValueFromArray(measObj.NORMALCY_CD, codeArray); //eslint-disable-line new-cap
                m_status = MP_Util.GetValueFromArray(measObj.STATUS_CD, codeArray); //eslint-disable-line new-cap
                m_comment = measObj.COMMENT;
                m_comment_ind = measObj.HAS_COMMENTS_IND;
            };

            this.getEventId = function() {
                return m_eventId;
            };
            this.getPersonId = function() {
                return m_personId;
            };
            this.getEncntrId = function() {
                return m_encntrId;
            };
            this.getEventCode = function() {
                return m_eventCode;
            };
            this.getDateTime = function() {
                return m_dateTime;
            };
            this.getUpdateDateTime = function() {
                return m_updateDateTime;
            };
            this.getResult = function() {
                return m_result;
            };
            this.setNormalcy = function(value) {
                m_normalcy = value;
            };
            this.getNormalcy = function() {
                return m_normalcy;
            };
            this.setStatus = function(value) {
                m_status = value;
            };
            this.getStatus = function() {
                return m_status;
            };
            this.isModified = function() {
                if (m_status) {
                    var mean = m_status.meaning;
                    if (mean === "MODIFIED" || mean === "ALTERED") {
                        return true;
                    }
                }
                return false;
            };
            this.getComment = function() {
                return m_comment;
            };
            this.getCommentsIndicator = function() {
                return m_comment_ind;
            };
        },
        MenuItem: function() {
            var m_name = "";
            var m_desc = "";
            var m_id = 0.0;
            var m_meaning;
            var m_valSequence = 0;
            //This is used as the primary grouping value for IView bands
            var m_valTypeFlag = 0;
            //This is used to determine which is the band, section, or item

            this.setDescription = function(value) {
                m_desc = value;
            };
            this.getDescription = function() {
                return m_desc;
            };
            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
            this.setId = function(value) {
                m_id = value;
            };
            this.getId = function() {
                return m_id;
            };
            this.setMeaning = function(value) {
                m_meaning = value;
            };
            this.getMeaning = function() {
                return m_meaning;
            };
            this.setValSequence = function(value) {
                m_valSequence = value;
            };
            this.getValSequence = function() {
                return m_valSequence;
            };
            this.setValTypeFlag = function(value) {
                m_valTypeFlag = value;
            };
            this.getValTypeFlag = function() {
                return m_valTypeFlag;
            };
        },
        CriterionFilters: function(criterion) {
            var m_criterion = criterion;
            var m_evalAr = [];

            this.addFilter = function(type, value) {
                m_evalAr.push(new MP_Core.MapObject(type, value));
            };
            this.checkFilters = function() {
                var patInfo = m_criterion.getPatientInfo();
                for (var x = m_evalAr.length; x--;) {
                    var filter = m_evalAr[ x ];
                    var dob = null;
                    switch (filter.name) {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            var sex = patInfo.getSex();
                            if (sex) {
                                if (filter.value == sex.meaning) { //eslint-disable-line eqeqeq
                                    continue;
                                }
                            }
                            return false;
                        case MP_Core.CriterionFilters.DOB_OLDER_THAN:
                            dob = patInfo.getDOB();
                            if (dob) {
                                if (dob <= filter.value) {
                                    continue;
                                }
                            }
                            return false;
                        case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:
                            dob = patInfo.getDOB();
                            if (dob) {
                                if (dob >= filter.value) {
                                    continue;
                                }
                            }
                            return false;
                        default:
                            logger.logError("Unhandled criterion filter");
                            return false;
                    }
                }
                return true;
            };
        },
        CreateSimpleError: function(component, sMessage) {
            var errMsg = [];
            var i18nCore = i18n.discernabu;
            var countText = (component.isLineNumberIncluded() ? "(0)" : "");
            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", sMessage, "</li></ul>");
            component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), countText); //eslint-disable-line new-cap
            //After the component has rendered call the postProcessing function to perform any additional actions
            component.postProcessing();
        },
        /**
         * Generates the HTMl for informational messages that will be displayed to the user.  The msgType parameter will be used to determine
         * the correct styling for the message applied. If the message type cannot be mapped to a supported message or the field is left blank, the
         * default styling will be applied.  If custom styling should be applied for the message the customClass parameter can be used to override
         * any of the default properties of the standard messaging styles.
         * @param {string} msgType This must be a string that represents the type of message being created.  The currently supported message types are error,
         * warning, information and busy.  If your message type does not match one of those listed, the default styling will be applied.  This parameter can also be
         * left blank to utilize the default styling.
         * @param {string} msgText This will be the first line of the message and will potentially be styled based on the message type being used.
         * @param {string} msdDetails This will be the text immediately following the msgText line.  This text will not be stylized.
         * @param {string} customClass This is the optional custom class that can be added to the message container which will allow for custom styling of the message
         * information.
         * @return {string} The HTML markup of the information message to display to the user.
         */
        generateUserMessageHTML: function(msgType, msgText, msgDetails, customClass) {
            var msgHTML = "";

            //check the messageType to make sure it is a string
            if (typeof msgType !== "string") {
                logger.logError("generateUserMessageHTML only accepts msgType parameters of string");
                return "";
            }

            //Determine which HTML string to use based on the type
            switch (msgType.toLowerCase()) {
                case "error":
                    //generate the error HTML
                    msgHTML = "<div class='error-container " + (customClass || "") + "'><span class='error-text message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                case "warning":
                    //generate the warning HTML
                    msgHTML = "<div class='warning-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                case "information":
                    //generate the information HTML
                    msgHTML = "<div class='information-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                case "busy":
                    //generate the busy HTML
                    msgHTML = "<div class='busy-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                default:
                    msgHTML = "<div class='default-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
            }
            return msgHTML;
        }
    };
}();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;

MP_Core.AppUserPreferenceManager = function() {
    var m_criterion = null;
    var m_prefIdent = "";
    var m_jsonObject = null;

    return {
        /**
         * Allows for the initialization of the manager to store what criterion and preference identifier to
         * utilize for retrieval of preferences
         * @param {Object} criterion
         * @param {Object} preferenceIdentifier
         */
        Initialize: function(criterion, preferenceIdentifier) {
            m_criterion = criterion;
            m_prefIdent = preferenceIdentifier;
            m_jsonObject = null;
        },
        SetPreferences: function(prefString) {
            var jsonEval = JSON.parse(prefString);
            m_jsonObject = jsonEval;
        },
        LoadPreferences: function() {
            if (!m_criterion) {
                logger.logError("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return;
            }
            //If preferences have already been loaded just return
            if (m_jsonObject) {
                return;
            }

            var prefRequest = new ScriptRequest();
            prefRequest.setProgramName("MP_GET_USER_PREFS");
            prefRequest.setParameterArray([ "^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^" ]);
            prefRequest.setAsyncIndicator(false);
            prefRequest.setResponseHandler(function(scriptReply) {
                var status = scriptReply.getStatus();
                var prefsResponse = scriptReply.getResponse();
                if (status === "Z") {
                    return;
                }
                else if (status === "S") {
                    m_jsonObject = JSON.parse(prefsResponse.PREF_STRING);
                }
                else {
                    logger.logError(scriptReply.getError());
                }
            });
            prefRequest.performRequest();
        },
        /**
         * GetPreferences will return the users preferences for the application currently logged into.
         */
        GetPreferences: function() {
            if (!m_criterion) {
                return null;
            }
            if (!m_jsonObject) {
                this.LoadPreferences();  //eslint-disable-line new-cap
            }

            return m_jsonObject;
        },
        SavePreferences: function(reload) {
            var body = document.body;
            var groups = Util.Style.g("col-group", body, "div");
            var grpId = 0;
            var colId = 0;
            var rowId = 0;
            var compId = 0;

            var jsonObject = {};
            jsonObject.user_prefs = {};
            var userPrefs = jsonObject.user_prefs;
            userPrefs.page_prefs = {};
            var pagePrefs = userPrefs.page_prefs;
            pagePrefs.components = [];
            var components = pagePrefs.components;

            //alert("groups.length: " + groups.length)
            for (var x = 0, xl = groups.length; x < xl; x++) {
                //TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
                grpId = x + 1;
                //get liquid layout
                var liqLay = Util.Style.g("col-outer1", groups[ x ], "div");
                if (liqLay.length > 0) {
                    //get each child column
                    var cols = Util.gcs(liqLay[ 0 ]);
                    for (var y = 0, yl = cols.length; y < yl; y++) {
                        colId = y + 1;
                        var rows = Util.gcs(cols[ y ]);
                        for (var z = 0, zl = rows.length; z < zl; z++) {
                            var component = {};
                            rowId = z + 1;
                            compId = jQuery(rows[ z ]).attr("id");
                            var compObj = MP_Util.GetCompObjByStyleId(compId);  //eslint-disable-line new-cap
                            component.id = compObj.getComponentId();
                            component.group_seq = grpId;
                            component.col_seq = colId;
                            component.row_seq = rowId;
                            component.preferencesObj = compObj.getPreferencesObj();
                            //Since we are updating the toggle status for all components we will need to make sure all required
                            //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                            //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                            //and not allow the user to toggle that component even though they should be able to.
                            component.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
                            component.grouperFilterLabel = compObj.getGrouperFilterLabel();
                            component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                            component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
                            component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
                            component.selectedTimeFrame = compObj.getSelectedTimeFrame();
                            component.selectedDataGroup = compObj.getSelectedDataGroup();
                            if (jQuery(rows[ z ]).hasClass("closed")) {
                                component.expanded = false;
                            }
                            else {
                                component.expanded = true;
                            }
                            components.push(component);
                        }
                    }
                }
            }
            WritePreferences(jsonObject);  //eslint-disable-line new-cap

            if (reload !== undefined && reload === false) {
                return;
            }

            CERN_Platform.refreshMPage();
        },
        ClearCompPreferences: function(componentId) {
            var compObj = MP_Util.GetCompObjById(componentId);  //eslint-disable-line new-cap
            var prefObj = m_jsonObject;
            var filterArr = null;

            if (prefObj != null) { //eslint-disable-line eqeqeq
                var strEval = JSON.parse(JSON.stringify(prefObj));
                var strObj = strEval.user_prefs.page_prefs.components;
                for (var x = strObj.length; x--;) {
                    if (strEval && strObj[ x ].id === componentId) {
                        strObj[ x ].grouperFilterLabel = "";
                        strObj[ x ].grouperFilterCatLabel = "";
                        strObj[ x ].grouperFilterCriteria = filterArr;
                        strObj[ x ].grouperFilterCatalogCodes = filterArr;

                        strObj[ x ].selectedTimeFrame = "";
                        strObj[ x ].selectedDataGroup = "";
                    }
                }
                compObj.setLookbackUnits(compObj.getBrLookbackUnits());
                compObj.setLookbackUnitTypeFlag(compObj.getBrLookbackUnitTypeFlag());
                compObj.setGrouperFilterLabel("");
                compObj.setGrouperFilterCatLabel("");
                compObj.setGrouperFilterCriteria(filterArr);
                compObj.setGrouperFilterCatalogCodes(filterArr);
                compObj.setSelectedTimeFrame("");
                compObj.setSelectedDataGroup("");
                compObj.setPreferencesObj(null);
                m_jsonObject = strEval;
                WritePreferences(m_jsonObject);  //eslint-disable-line new-cap

                //Use the component's render strategy to update the view after clearing settings
                var renderStrategy = compObj.getRenderStrategy();
                if (renderStrategy) {
                    var uniqueComponentId = renderStrategy.getComponentId();
                    var componentLookbackMenu = $("#lookbackContainer" + uniqueComponentId);
                    if (componentLookbackMenu.length) {
                        componentLookbackMenu.replaceWith(renderStrategy.createComponentLookback());
                    }

                    var componentFilterMenu = $("#filterDropDownMenu" + uniqueComponentId);
                    if (componentFilterMenu.length) {
                        componentFilterMenu.replaceWith(renderStrategy.createComponentFilter());
                    }
                }

                $(compObj.getSectionContentNode()).empty();
                compObj.startComponentDataRetrieval();
            }
        },
        UpdatePrefsIdentifier: function(prefIdentifier) {
            if (prefIdentifier && typeof prefIdentifier === "string") {
                m_prefIdent = prefIdentifier;
            }
        },
        //Updates the component preferences from the components array passed into the function
        UpdateAllCompPreferences: function(componentArr, changePos, saveAsync) {
            var compId = 0;
            var compPrefs = null;
            var compPrefsCnt = 0;
            var compPrefsMap = {};
            var component = null;
            var componentDiv = null;
            var columnDiv = null;

            var namespace = "";
            var newPrefsInd = false;
            var prefObj = null;
            var prefIndx = 0;
            var tempObj = {};
            var x = 0;

            //If saveAsync is anything other then true set it to false
            if (!saveAsync) {
                saveAsync = false;
            }

            //Check the componentArr and make sure is is populated
            if (!componentArr || !componentArr.length) {
                return;
            }

            //Create the prefs object if it doesnt already exist
            prefObj = m_jsonObject || {
                    user_prefs: {
                        page_prefs: {
                            components: []
                        }
                    }
                };

            //Check to make sure the structure exists so we can populate it
            prefObj.user_prefs = prefObj.user_prefs || {
                    page_prefs: {
                        components: []
                    }
                };

            prefObj.user_prefs.page_prefs = prefObj.user_prefs.page_prefs || {
                    components: []
                };

            prefObj.user_prefs.page_prefs.components = prefObj.user_prefs.page_prefs.components || [];
            compPrefs = prefObj.user_prefs.page_prefs.components;

            //Create a component map so we do not have to loop through the array for each component
            compPrefsCnt = compPrefs.length;
            for (x = compPrefsCnt; x--;) {
                compPrefsMap[ compPrefs[ x ].id ] = x;
            }

            //Loop through all of the components and update their preferences in the preferences object.
            compPrefsCnt = componentArr.length;
            for (x = compPrefsCnt; x--;) {
                component = componentArr[ x ];
                //Check to see if there is an existing preferences object
                if (typeof compPrefsMap[ component.getComponentId() ] !== "undefined") {
                    //Update exiting component preferences
                    prefIndx = compPrefsMap[ component.getComponentId() ];
                    tempObj = compPrefs[ prefIndx ];
                    newPrefsInd = false;
                }
                else {
                    tempObj = {};
                    newPrefsInd = true;
                }
                //Save the components basic settings
                tempObj.id = component.getComponentId();
                tempObj.group_seq = component.getPageGroupSequence();
                tempObj.col_seq = component.getColumn();
                tempObj.row_seq = component.getSequence();
                tempObj.preferencesObj = component.getPreferencesObj();
                //Since we are updating the toggle status for all components we will need to make sure all required
                //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                //and not allow the user to toggle that component even though they should be able to.
                tempObj.toggleStatus = (component.getToggleStatus() === 2) ? 1 : component.getToggleStatus();
                tempObj.expanded = component.isExpanded();
                //Update the infoButton information
                tempObj.IsInfoButtonEnabled = component.isInfoButtonEnabled();

                if (component.getGrouperFilterLabel()) {
                    tempObj.grouperFilterLabel = component.getGrouperFilterLabel();
                }
                if (component.getGrouperFilterCriteria()) {
                    tempObj.grouperFilterCriteria = component.getGrouperFilterCriteria();
                }
                if (component.getGrouperFilterCatLabel()) {
                    tempObj.grouperFilterCatLabel = component.getGrouperFilterCatLabel();
                }
                if (component.getGrouperFilterCatalogCodes()) {
                    tempObj.grouperFilterCatalogCodes = component.getGrouperFilterCatalogCodes();
                }

                if (component.getSelectedTimeFrame()) {
                    tempObj.selectedTimeFrame = component.getSelectedTimeFrame();
                }
                if (component.getSelectedDataGroup()) {
                    tempObj.selectedDataGroup = component.getSelectedDataGroup();
                }

                //Push the new preferences object into the array
                if (newPrefsInd) {
                    compPrefs.push(tempObj);
                    //Update the mapping with the new element info
                    compPrefsMap[ tempObj.id ] = compPrefs.length - 1;
                }
            }

            //If the changePos flag has been set we will need to update the positions of all components without blowing away existing
            // preferences.
            if (changePos) {
                for (x = compPrefsCnt; x--;) {
                    component = componentArr[ x ];
                    namespace = component.getStyles().getNameSpace();
                    compId = component.getComponentId();
                    //Get component div, if the component is added to contextual view get their ghosted version.
                    if (component.isAddedToContextualView()) {
                        componentDiv = $("#" + namespace + compId + "PlaceholderView");
                    } else {
                        componentDiv = $("#" + namespace + compId);
                    }
                    if (componentDiv.length) {
                        //Get the preferences object
                        prefIndx = compPrefsMap[ component.getComponentId() ];
                        tempObj = compPrefs[ prefIndx ];
                        //Get the parent of that component container and find out which index it is located at and use that as the sequence.
                        columnDiv = componentDiv.parent();
                        tempObj.col_seq = columnDiv.index() + 1;
                        tempObj.row_seq = componentDiv.index();
                        //Save the new column and sequence back into the component
                        component.setColumn(tempObj.col_seq);
                        component.setSequence(tempObj.row_seq);
                    }
                }
            }

            //Save the preferences back to the preferences object.
            m_jsonObject = prefObj;
            WritePreferences(m_jsonObject, saveAsync);  //eslint-disable-line new-cap
        },
        UpdateSingleCompPreferences: function(componentObject, saveAsync) {
            MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences([ componentObject ], false, saveAsync);  //eslint-disable-line new-cap
        },
        SaveCompPreferences: function(componentId, theme, expCol, changePos, infoButton) {
            var compObj = MP_Util.GetCompObjById(componentId);  //eslint-disable-line new-cap
            var prefObj = m_jsonObject;
            var noMatch = true;
            var x;
            var xl;

            if (prefObj != null && !changePos) { //eslint-disable-line eqeqeq
                var strEval = JSON.parse(JSON.stringify(prefObj));
                var strObj = strEval.user_prefs.page_prefs.components;

                for (x = strObj.length; x--;) {
                    if (strEval && strObj[ x ].id === componentId) {
                        noMatch = false;
                        if (theme) {
                            strObj[ x ].compThemeColor = theme;
                        }
                        if (expCol) {
                            if (expCol == "1") { //eslint-disable-line eqeqeq
                                strObj[ x ].expanded = true;
                            }
                            else {
                                strObj[ x ].expanded = false;
                            }
                        }

                        if (infoButton) {
                            if (infoButton == "1") {//eslint-disable-line eqeqeq
                                strObj[ x ].IsInfoButtonEnabled = 1;
                            }
                            else {
                                strObj[ x ].IsInfoButtonEnabled = 0;
                            }
                        }

                        if (compObj.getGrouperFilterLabel()) {
                            strObj[ x ].grouperFilterLabel = compObj.getGrouperFilterLabel();
                        }
                        if (compObj.getGrouperFilterCatLabel()) {
                            strObj[ x ].grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                        }
                        if (compObj.getGrouperFilterCriteria()) {
                            strObj[ x ].grouperFilterCriteria = compObj.getGrouperFilterCriteria();
                        }
                        if (compObj.getGrouperFilterCatalogCodes() || compObj.getGrouperFilterCatalogCodes() === null) {
                            strObj[ x ].grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
                        }
                        else {
                            strObj[ x ].grouperFilterCatalogCodes = [];
                        }

                        if (compObj.getSelectedTimeFrame()) {
                            strObj[ x ].selectedTimeFrame = compObj.getSelectedTimeFrame();
                        }
                        if (compObj.getSelectedDataGroup()) {
                            strObj[ x ].selectedDataGroup = compObj.getSelectedDataGroup();
                        }
                        //Save the components toggle status and the column and sequence information
                        //Since we are updating the toggle status for all components we will need to make sure all required
                        //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                        //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                        //and not allow the user to toggle that component even though they should be able to.
                        strObj[ x ].toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
                        strObj[ x ].col_seq = compObj.getColumn();
                        strObj[ x ].row_seq = compObj.getSequence();
                        strObj[ x ].preferencesObj = compObj.getPreferencesObj();
                    }
                }

                if (noMatch) {//single comp change but comp doesn't have user prefs
                    var tempObj = {};
                    tempObj.id = componentId;
                    tempObj.group_seq = compObj.getPageGroupSequence();
                    tempObj.col_seq = compObj.getColumn();
                    tempObj.row_seq = compObj.getSequence();
                    tempObj.preferencesObj = compObj.getPreferencesObj();
                    tempObj.compThemeColor = theme;

                    if (compObj.getGrouperFilterLabel()) {
                        tempObj.grouperFilterLabel = compObj.getGrouperFilterLabel();
                    }
                    if (compObj.getGrouperFilterCriteria()) {
                        tempObj.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
                    }
                    if (compObj.getGrouperFilterCatLabel()) {
                        tempObj.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                    }
                    if (compObj.getGrouperFilterCatalogCodes()) {
                        tempObj.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
                    }

                    if (compObj.getSelectedTimeFrame()) {
                        tempObj.selectedTimeFrame = compObj.getSelectedTimeFrame();
                    }
                    if (compObj.getSelectedDataGroup()) {
                        tempObj.selectedDataGroup = compObj.getSelectedDataGroup();
                    }
                    //Save the components toggle status
                    //Since we are updating the toggle status for all components we will need to make sure all required
                    //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                    //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                    //and not allow the user to toggle that component even though they should be able to.
                    tempObj.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();

                    tempObj.expanded = compObj.isExpanded();
                    strObj.push(tempObj);
                }
                m_jsonObject = strEval;
                WritePreferences(m_jsonObject);  //eslint-disable-line new-cap
            }
            else {
                var body = document.body;
                var groups = Util.Style.g("col-group", body, "div");
                var colId = 0;
                var rowId = 0;
                var compId = 0;

                var jsonObject = {};
                jsonObject.user_prefs = {};
                var userPrefs = jsonObject.user_prefs;
                userPrefs.page_prefs = {};
                var pagePrefs = userPrefs.page_prefs;
                pagePrefs.components = [];
                var components = pagePrefs.components;

                for (x = 0, xl = groups.length; x < xl; x++) {
                    //get liquid layout
                    var liqLay = Util.Style.g("col-outer1", groups[ x ], "div");
                    if (liqLay.length > 0) {
                        //get each child column
                        var cols = Util.gcs(liqLay[ 0 ]);
                        for (var y = 0, yl = cols.length; y < yl; y++) {
                            colId = y + 1;
                            var rows = Util.gcs(cols[ y ]);
                            for (var z = 0, zl = rows.length; z < zl; z++) {
                                var component = {};
                                rowId = z + 1;
                                compId = jQuery(rows[ z ]).attr("id");
                                compObj = MP_Util.GetCompObjByStyleId(compId); //eslint-disable-line new-cap
                                //Ensure that the component object was successfully retrieved
                                if (!compObj) {
                                    continue;
                                }
                                component.id = compObj.getComponentId();

                                if (compObj.getColumn() !== 99) {
                                    component.group_seq = 1;
                                    component.col_seq = colId;
                                    component.row_seq = rowId;
                                }
                                else {
                                    component.group_seq = 0;
                                    component.col_seq = 99;
                                    component.row_seq = rowId;
                                }
                                if (compObj.getCompColor()) {
                                    component.compThemeColor = compObj.getCompColor();
                                }
                                //Save the components toggle status
                                //Since we are updating the toggle status for all components we will need to make sure all required
                                //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                                //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                                //and not allow the user to toggle that component even though they should be able to.
                                component.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
                                compObj.setColumn(component.col_seq);
                                compObj.setSequence(component.row_seq);
                                //added preferences to component
                                component.preferencesObj = compObj.getPreferencesObj();
                                component.grouperFilterLabel = compObj.getGrouperFilterLabel();
                                component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                                component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();

                                component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();

                                component.selectedTimeFrame = compObj.getSelectedTimeFrame();
                                component.selectedDataGroup = compObj.getSelectedDataGroup();
                                if (jQuery(rows[ z ]).hasClass("closed")) {
                                    component.expanded = false;
                                }
                                else {
                                    component.expanded = true;
                                }
                                if (compObj.hasInfoButton()) {
                                    if (infoButton) {
                                        component.IsInfoButtonEnabled = 1;
                                    }
                                    else {
                                        component.IsInfoButtonEnabled = 0;
                                    }
                                }
                                components.push(component);
                            }
                        }
                    }
                }
                // get the selected components' settings from above and compare with prefObj by parsing it.
                // matched components get updated and other components ignored.
                // copy the updated new prefs to m_jsonObject
                // save prefs JSON using WritePreferences(m_jsonObject)

                if (prefObj) {	//check for preference object; if found go for update; else don'nt update
                    strObj = prefObj.user_prefs.page_prefs.components;
                    for (x = strObj.length; x--;) {
                        for (y = components.length; y--;) {
                            if (strObj[ x ].id === components[ y ].id) {
                                strObj[ x ] = components[ y ]; //update only matched component's preferences
                                break;
                            }
                        }
                    }
                    m_jsonObject = prefObj;
                    WritePreferences(m_jsonObject); //eslint-disable-line new-cap
                }
                else {
                    WritePreferences(jsonObject); //eslint-disable-line new-cap
                    m_jsonObject = jsonObject; //update the m_jsonObject(global).
                }
            }
        },
        ClearPreferences: function() {
            WritePreferences(null); //eslint-disable-line new-cap
            CERN_Platform.refreshMPage();
        },

        /**
         * Returns the json object associated to the primary div id of the component.
         * It is assumed LoadPreferences has been called prior to execution.
         *
         * @param {Object} id - The ID that we're trying to match with a component.
         *
         * @returns {MPageComponent|null} The matching component, if found. Otherwise, null.
         *
         * @public
         */
        GetComponentById: function(id) {
            var match = null;
            // If anything goes wrong within the try block, we'll just return null.
            try {
                m_jsonObject.user_prefs.page_prefs.components.some(function(component) {
                    if (component.id == id) { //eslint-disable-line eqeqeq
                        match = component;
                        return true;
                    }
                });
            }
            catch (err) {
                // Stop error propagation
            }
            finally {
                return match;
            }
        }
    };

    function WritePreferences(jsonObject, saveAsync) {
        var prefs = (jsonObject != null) ? JSON.stringify(jsonObject) : ""; //eslint-disable-line eqeqeq

        //Create the script request and perform it
        var prefRequest = new ScriptRequest();
        prefRequest.setProgramName("MP_MAINTAIN_USER_PREFS");
        prefRequest.setParameterArray([ "^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "~" + prefs + "~" ]);
        prefRequest.setAsyncIndicator(saveAsync || false);
        prefRequest.setResponseHandler(function(scriptReply) {
            var status = scriptReply.getStatus();

            if (status === "Z") {
                m_jsonObject = null;
            }
            else if (status === "S") {
                m_jsonObject = jsonObject;
            }
            else {
                logger.logError(scriptReply.getError());
            }
        });
        prefRequest.performRequest();
    }
}();

/**
 * @namespace
 */
var MP_Util = function() { //eslint-disable-line no-redeclare
    var m_df = null;
    var m_nf = null;
    var m_codeSets = [];
    return {
        addComponentsToGlobalStorage: function(components) {
            //If you try to add nothing, just return
            if (!components || !components.length) {
                return;
            }
            //If for some reason the global component storage is null, new it up
            if (CERN_MPageComponents === null) {
                CERN_MPageComponents = [];
            }
            //Store this view's components in the global component list
            for (var x = 0, xl = components.length; x < xl; x++) {
                if (components[ x ]) {
                    CERN_MPageComponents.push(components[ x ]);
                }
            }
        },
        GetComponentArray: function(components) {
            var grpAr = [];
            var colAr = [];
            var rowAr = [];
            var curCol = -1;
            var curGrp = -1;

            //first layout the group/columns/rows of components
            if (components != null) { //eslint-disable-line eqeqeq
                components.sort(SortMPageComponents);

                for (var x = 0, xl = components.length; x < xl; x++) {
                    var component = components[ x ];

                    if (component.isDisplayable()) {//based on filter logic, only display if criteria is met
                        var compGrp = component.getPageGroupSequence();
                        var compCol = component.getColumn();

                        if (compGrp != curGrp) { //eslint-disable-line eqeqeq
                            curCol = -1;
                            colAr = [];
                            grpAr.push(colAr);
                            curGrp = compGrp;
                        }

                        if (compCol != curCol) { //eslint-disable-line eqeqeq
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
         * @param js_criterion  The JSON associated to the criterion data that is to be loaded
         * @param static_content  The <code>String</code> location in which the static content resides
         */
        GetCriterion: function(js_criterion, static_content) {
            logger.logDebug("Criterion: " + JSON.stringify(js_criterion));
            var jsCrit = js_criterion.CRITERION;
            var criterion = new MP_Core.Criterion(jsCrit, static_content);
            var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES); //eslint-disable-line new-cap
            var jsPatInfo = jsCrit.PERSON_INFO;
            var patInfo = new MP_Core.PatientInformation();
            patInfo.setName(jsPatInfo.PERSON_NAME);
            patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray)); //eslint-disable-line new-cap
            if (jsPatInfo.DOB != "") { //eslint-disable-line eqeqeq
                var dt = new Date();
                dt.setISO8601(jsPatInfo.DOB);
                patInfo.setDOB(dt);
            }
            criterion.setPatientInfo(patInfo);
            return criterion;
        },
        /**
         * Calculates the within time from the provide date and time.
         * @param dateTime  The <code>Date</code> Object in which to calculate the within time
         * @return <code>String</code> representing the time that has passed from the provided date and time
         */
        CalcWithinTime: function(dateTime) {
            return (GetDateDiffString(dateTime, null, null, true)); //eslint-disable-line new-cap
        },
        /**
         * Calculates the age of a patient from a given point in time.  If the point in time is not provided, the current date/time is
         * utilized
         * @param birthDt  The <code>Date</code> Object in which to calculate the age of the patient
         * @param fromDate  The <code>Date</code> Object in which to calculate the age of the patient from.  This is useful in
         * cases
         * where the patient is deceased and the date utilized is the deceased date.
         * @return <code>String</code> representing the age of the patient
         */
        CalcAge: function(birthDt, fromDate) {
            //If from Date is null (not passed in) then set to current Date
            fromDate = (fromDate) ? fromDate : new Date();
            return (GetDateDiffString(birthDt, fromDate, 1, false)); //eslint-disable-line new-cap
        },
        /**
         * Display the date and time based on the configuration of the component
         * @param component  The component in which holds the configuration for the date formatting
         * @param date  The date in which to properly format
         * @return <code>String</code> representing the date and time of the date provided
         */
        DisplayDateByOption: function(component, date) {
            var df = MP_Util.GetDateFormatter(); //eslint-disable-line new-cap
            switch (component.getDateFormat()) {
                case 1:
                    return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR));
                case 2:
                    return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
                case 3:
                    return (MP_Util.CalcWithinTime(date)); //eslint-disable-line new-cap
                case 4:
                    //Display No Date.  Additional logic will need to be applied to hide column.
                    return ("&nbsp");
                default:
                    return df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
            }
        },
        LaunchMenu: function(menuId, componentId) {
            var menu = _g(menuId);
            MP_Util.closeMenuInit(menu, componentId);
            if (menu != null) {  //eslint-disable-line eqeqeq
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
        LaunchCompFilterSelection: function(compId, eventSetIndex, applyFilterInd) {
            var component = MP_Util.GetCompObjById(compId); //eslint-disable-line new-cap
            var i18nCore = i18n.discernabu;
            var style = component.getStyles();
            var ns = style.getNameSpace();
            var mnuDisplay;
            var newFilterAppliedSpan;
            var filterAppliedArr;
            var lbDropDownDiv;

            if (eventSetIndex === -1) {
                mnuDisplay = i18nCore.FACILITY_DEFINED_VIEW;
            }
            else {
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
                newFilterAppliedSpan = Util.ce("span");
                filterAppliedArr = [ "<span id='cf", compId, "msg' class='filter-applied-msg' title='", mnuDisplay, "'>", i18nCore.FILTER_APPLIED, "</span>" ];
                newFilterAppliedSpan.innerHTML = filterAppliedArr.join("");
                lbDropDownDiv = _g("lbMnuDisplay" + compId);
                Util.ia(newFilterAppliedSpan, lbDropDownDiv);
            }
            else {
                newFilterAppliedSpan = Util.ce("span");
                filterAppliedArr = [ "<span id='cf", compId, "msg' class='filter-applied-msg' title=''></span>" ];
                newFilterAppliedSpan.innerHTML = filterAppliedArr.join("");
                lbDropDownDiv = _g("lbMnuDisplay" + compId);
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
            for (z = 0; z < groupLen; z++) {
                if (component.getGrouperLabel(z)) {
                    contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", z, ",1);'>", component.getGrouperLabel(z).toString(), "</span></div>");
                }
                if (component.getGrouperCatLabel(z)) {
                    contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", z, ",1);'>", component.getGrouperCatLabel(z).toString(), "</span></div>");
                }
            }
            contentDivArr.push("</div></div></div>");
            contentDiv.innerHTML = contentDivArr.join("");

            if (applyFilterInd === 1) {
                if (mnuDisplay === i18nCore.FACILITY_DEFINED_VIEW) {
                    component.startComponentDataRetrieval();
                }
                else {

                    if (ns === "ohx" || ns === "ohx2") {
                        component.FilterRefresh(mnuDisplay, catCodeList); //eslint-disable-line new-cap
                    }
                    else {
                        component.FilterRefresh(mnuDisplay, eventSetList); //eslint-disable-line new-cap
                    }

                }
            }
        },
        closeMenuInit: function(inMenu, compId) {
            var menuId;
            var docMenuId = compId + "Menu";
            var lbMenuId = compId + "Mnu";
            var cfMenuId = compId + "TypeMenu";

            var menuLeave = function(e) {
                if (!e) {
                    e = window.event;
                }
                if (e.relatedTarget.id == inMenu.id) {  //eslint-disable-line eqeqeq
                    Util.Style.acss(inMenu, "menu-hide");
                }
                e.stopPropagation();
                Util.cancelBubble(e);
            };
            if (inMenu.id == docMenuId || inMenu.id == lbMenuId || inMenu.id == cfMenuId) { //eslint-disable-line eqeqeq
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
                ar.push(" ", optionalText);
            }
            return ar.join("");
        },
        /**
         * A helper utility to determine if a content body should be considered scrollable
         * @param component  The component in which is being evaluated
         * @param nbr  The number of items in which to consider scrolling enabled
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
            var rtmsTimer = new RTMSTimer(timerName, subTimerName).addMetaData("rtms.legacy.metadata.1", metaData1 || null).addMetaData("rtms.legacy.metadata.2", metaData2 || null).addMetaData("rtms.legacy.metadata.3", metaData3 || null);
            rtmsTimer.start();
            return rtmsTimer;
        },
        /**
         * Retrieves the code values for a given code set
         * @param {number} codeSet The code set in which to retrieve
         * @param {boolean} async A boolean value indicating if the script call should be asynchronous.
         * @return A list of code from the code set
         */
        GetCodeSet: function(codeSet, async) {
            var codes = [];
            var codeSetRequest = new ScriptRequest();
            codeSetRequest.setProgramName("MP_GET_CODESET");
            codeSetRequest.setParameterArray([ "^MINE^", codeSet + ".0" ]);
            codeSetRequest.setAsyncIndicator(async);
            codeSetRequest.setResponseHandler(function(dataReply) {
                var codeSetObj = dataReply.getResponse();
                if (dataReply.getStatus() === "S") {
                    codes = MP_Util.LoadCodeListJSON(codeSetObj.CODES); //eslint-disable-line new-cap
                }
            });
            codeSetRequest.performRequest();
            return codes;
        },
        /**
         * Retrieves the code values for a given code set asynchronously and returns the
         * source codes. If the codes are in the Shared Resource then the query to MP_GET_CODESET
         * is not made
         *
         * @param {number} codeSet The code set in which to retrieve
         * @param {Function} Callback function called when the code set values are retrieved
         */

        GetCodeSetAsync: function(codeSet, callbackFn) {
            try {
                var codes = [];
                var resourceName = "CODESET_" + codeSet + ".0";
                //Check for the codes in Shared Resource
                var codeSetToken = MP_Resources.getSharedResource(resourceName);
                if (codeSetToken && codeSetToken.isResourceAvailable()) {
                    callbackFn(codeSetToken.getResourceData());
                }
                else {
                    var codeSetRequest = new ScriptRequest();
                    codeSetRequest.setProgramName("MP_GET_CODESET");
                    codeSetRequest.setParameterArray([ "^MINE^", codeSet + ".0" ]);
                    codeSetRequest.setAsyncIndicator(true);
                    codeSetRequest.setResponseHandler(function(dataReply) {
                        var codeSetObj = dataReply.getResponse();
                        if (codeSetObj && dataReply.getStatus() === "S") {
                            codes = codeSetObj.CODES;
                            codeSetToken = new SharedResource(resourceName);
                            if (codeSetToken) {
                                codeSetToken.setResourceData(codes);
                                codeSetToken.setIsAvailable(true);
                                MP_Resources.addSharedResource(resourceName, codeSetToken);
                            }
                            callbackFn(codes);
                        }
                        else if (dataReply.getStatus() === "Z") {
                            logger.logError("No source codes retrieved, Code Set: " + codeSet);
                        }
                        else {
                            logger.logError("There was an error retrieving source codes, Code Set: " + codeSet);
                        }
                    });
                    codeSetRequest.performRequest();
                }
            }
            catch (err) {
                logger.logJSError(err, null, "mp_core.js", "GetCodeSetAsync");
            }
        },

        /**
         * Will return a code object from the mapped list by the cdf_meaning
         * @param mapCodes  The map of code values to search
         * @param meaning  The cdf_meaning of the code value to search
         * @return The code object associated to the cdf_meaning provides.  Else null
         */
        GetCodeByMeaning: function(mapCodes, meaning) {
            for (var x = mapCodes.length; x--;) {
                var code = mapCodes[ x ].value;
                if (code.meaning == meaning)  //eslint-disable-line eqeqeq
                    return code;
            }
            return null;
        },
        GetCodeValueByMeaning: function(meaning, codeSet) {
            var list = m_codeSets[ codeSet ];
            if (!list) {
                list = m_codeSets[ codeSet ] = MP_Util.GetCodeSet(codeSet, false);  //eslint-disable-line new-cap
            }
            if (list && list.length > 0) {
                for (var x = list.length; x--;) {
                    var code = list[ x ].value;
                    if (code.meaning === meaning) {
                        return code;
                    }
                }
            }
            return null;
        },
        /**
         * Will search for a value within the provided mapped array and return the value associated to the name/value pair
         * @param mapItems  The mapped array of items to search through
         * @param item  The item in which to search
         * @return The value from the name/value pair
         */
        GetItemFromMapArray: function(mapItems, item) {
            for (var x = 0; x < mapItems.length; x++) {
                if (mapItems[ x ].name == item)  //eslint-disable-line eqeqeq
                    return mapItems[ x ].value;
            }
        },
        /**
         * Add an item to the array of items associated to the map key
         * @param mapItems  The map array to search within
         * @param key  The primary key that will be searching for within the map array
         * @param value  The object that is to be added to the map array
         */
        AddItemToMapArray: function(mapItems, key, value) {
            var ar = MP_Util.GetItemFromMapArray(mapItems, key); //eslint-disable-line new-cap
            if (!ar) {
                ar = [];
                mapItems.push(new MP_Core.MapObject(key, ar));
            }
            ar.push(value);
        },

        CreateClinNoteLink: function(patient_id, encntr_id, event_id, display, docViewerType, pevent_id) {
            var docType = (docViewerType && docViewerType > "") ? docViewerType : "STANDARD";
            var doclink = "";
            if (event_id > 0) {
                var ar = [];
                ar.push(patient_id, encntr_id, event_id, "\"" + docType + "\"", pevent_id);
                doclink = "<a onclick='javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + "); return false;' href='#'>" + display + "</a>";
            }
            else {
                doclink = display;
            }
            return (doclink);
        },

        /**
         * Sorting by Collation Sequence: The sortBySequence function will return a flag either -1,0, or 1 according to the SEQUENCE field
         *
         * @param {item a, item b} a,b are two items whose SEQUENCE field will be compared to each other
         * @returns {integer} 0 if SEQUENCE is equal, 1 if item a's SEQUENCE is greater than item B's SEQUENCE, -1 if
         * less
         */
        SortBySequence: function(a, b) {
            try {
                var aSeq = a.SEQUENCE;
                var bSeq = b.SEQUENCE;

                // If the sequence is not defined then the value is either 0 or nothing, it would take the alternate route
                if (a.SEQUENCE) {
                    if (aSeq > bSeq) {
                        return 1;
                    }
                    else {
                        if (aSeq < bSeq) {
                            return -1;
                        }
                        return 0;
                    }
                }
            }
            catch (err) {
                MP_Util.LogJSError(err, this, "mp_core.js", "sortBySequence"); //eslint-disable-line new-cap
            }
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
            /*eslint-disable new-cap*/
            var x = 0;
            var m_dPersonId = parseFloat(patient_id);
            var m_dPeventId = parseFloat(pevent_id);
            var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE"); //eslint-disable-line new-cap
            logger.logDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
            try {
                switch (docViewerType) {
                    case "AP":
                        viewerObj.CreateAPViewer();
                        viewerObj.AppendAPEvent(event_id, m_dPeventId);
                        viewerObj.LaunchAPViewer();
                        break;
                    case "DOC":
                        viewerObj.CreateDocViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendDocEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendDocEvent(event_id);
                        }
                        viewerObj.LaunchDocViewer();
                        break;
                    case "EVENT":
                        viewerObj.CreateEventViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendEvent(event_id);
                        }
                        viewerObj.LaunchEventViewer();
                        break;
                    case "MICRO":
                        viewerObj.CreateMicroViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendMicroEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendMicroEvent(event_id);
                        }
                        viewerObj.LaunchMicroViewer();
                        break;
                    case "GRP":
                        viewerObj.CreateGroupViewer();
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendGroupEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendGroupEvent(event_id);
                        }
                        viewerObj.LaunchGroupViewer();
                        break;
                    case "PROC":
                        viewerObj.CreateProcViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendProcEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendProcEvent(event_id);
                        }
                        viewerObj.LaunchProcViewer();
                        break;
                    case "HLA":
                        viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, event_id);
                        break;
                    case "NR":
                        viewerObj.LaunchRemindersViewer(event_id);
                        break;
                    case "STANDARD":
                        alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS); //eslint-disable-line no-alert
                        break;
                }
            }
            catch (err) {
                logger.logJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
                alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.CONTACT_ADMINISTRATOR); //eslint-disable-line no-alert
            }
            /*eslint-enable new-cap*/
        },
        IsArray: function(input) {
            return ( typeof (input) === "object" && ( input instanceof Array));
        },
        IsString: function(input) {
            return ( typeof (input) === "string");
        },
        HandleNoDataResponse: function(nameSpace) {  //eslint-disable-line no-unused-vars
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
                logger.logError(i18n.COMPONENTS + ": " + nameSpace + "<br />" + errorMessage);
            }
            return ar.join("");
        },
        GetValueFromArray: function(name, array) {
            if (array != null) {  //eslint-disable-line eqeqeq
                for (var x = 0, xi = array.length; x < xi; x++) {
                    if (array[ x ].name == name) {  //eslint-disable-line eqeqeq
                        return (array[ x ].value);
                    }
                }
            }
            return (null);
        },

        GetCompObjById: function(id) {
            var comps = CERN_MPageComponents;
            var cLen = comps.length;
            for (var i = cLen; i--;) {
                var comp = comps[ i ];
                if (comp.m_componentId === id) {
                    return comp;
                }
            }
            return (null);
        },
        GetCompObjByStyleId: function(id) {
            var cLen = CERN_MPageComponents.length;
            for (var i = cLen; i--;) {
                var comp = CERN_MPageComponents[ i ];
                var styles = comp.getStyles();
                if (styles.getId() === id) {
                    return comp;
                }
            }
            return (null);
        },
        LoadCodeListJSON: function(parentElement) {
            var codeArray = [];
            var codeElement = null;
            if (parentElement != null) {  //eslint-disable-line eqeqeq
                for (var x = 0; x < parentElement.length; x++) {
                    var codeObject = {};
                    codeElement = parentElement[ x ];
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
            if (parentElement != null) {  //eslint-disable-line eqeqeq
                for (var x = 0; x < parentElement.length; x++) {
                    var prsnlObj = {};
                    codeElement = parentElement[ x ];
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
                    personnelArray[ x ] = mapObj;
                }
            }
            return (personnelArray);
        },
        LoadPhoneListJSON: function(parentElement) {
            var phoneArray = [];
            var codeElement = null;
            var phoneLen = 0;
            if (parentElement) {
                for (var x = parentElement.length; x--;) {
                    var phoneObj = {};
                    codeElement = parentElement[ x ];
                    phoneObj.personId = codeElement.PERSON_ID;
                    //fill in each phone for this person id
                    phoneLen = codeElement.PHONES.length;
                    phoneObj.phones = [];
                    for (var y = 0; y < phoneLen; y++) {
                        var phoneListing = {};
                        phoneListing.phoneNum = codeElement.PHONES[ y ].PHONE_NUM;
                        phoneListing.phoneType = codeElement.PHONES[ y ].PHONE_TYPE;
                        phoneObj.phones.push(phoneListing);
                    }
                    var mapObj = new MP_Core.MapObject(phoneObj.personId, phoneObj);
                    phoneArray[ x ] = mapObj;
                }
            }
            return (phoneArray);
        },
        WriteToFile: function(sText) {
            try {
                var ForAppending = 8;
                var TriStateFalse = 0;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var newFile = fso.OpenTextFile("c:\\temp\\test.txt", ForAppending, true, TriStateFalse); //eslint-disable-line new-cap
                newFile.write(sText);
                newFile.close();
            }
            catch (err) {
                var strErr = "Error:";
                strErr += "\nNumber:" + err.number;
                strErr += "\nDescription:" + err.description;
                document.write(strErr);
            }
        },

        /**
         *  Javascript string pad
         *  @see http://www.webtoolkit.info/
         **/
        pad: function(str, len, pad, dir) {
            if (typeof (len) === "undefined") {
                len = 0;
            }
            if (typeof (pad) === "undefined") {
                pad = " ";
            }
            if (typeof (dir) === "undefined") {
                dir = STR_PAD_RIGHT;
            }

            if (len + 1 >= str.length) {

                switch (dir) {

                    case STR_PAD_LEFT:
                        str = Array(len + 1 - str.length).join(pad) + str;
                        break;

                    case STR_PAD_BOTH:
                        var padlen = 0;
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
         * @param {number} eventCd The event code to retrieve results for
         * @param {number} compId The numberical id of the component to lookup
         * @param {number} groupId The groupId to pass into the graphing utility
         */
        GraphResults: function(eventCd, compID, groupID) {
            var component = MP_Util.GetCompObjById(compID); //eslint-disable-line new-cap
            var encntrOption = "";
            var i18nCore = i18n.discernabu;
            var lookBackText = "";
            var lookBackType = (component.getLookbackUnitTypeFlag()) ? component.getLookbackUnitTypeFlag() : "2";
            var lookBackUnits = (component.getLookbackUnits()) ? component.getLookbackUnits() : "365";
            var parameters = "";
            var replaceText = "";
            var scope = component.getScope();
            var criterion = component.getCriterion();

            if (scope > 0) {
                switch (lookBackType) {
                    case 1:
                        replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
                        break;

                    case 2:
                        replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
                        break;

                    case 3:
                        replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
                        break;

                    case 4:
                        replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
                        break;

                    case 5:
                        replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
                        break;

                    default:
                        replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
                        break;
                }

                switch (scope) {
                    case 1:
                        lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
                        encntrOption = "0.0";
                        break;
                    case 2:
                        lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
                        encntrOption = criterion.encntr_id + ".0";
                        break;
                }
            }
            else {
                logger.logError("No scope defined for component " + component.getLabel());
                return;
            }


            //Mobile Reach - To Launch Graph viewer
            if (!CERN_Platform.inMillenniumContext()) {
                parameters = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "/discrete-graphing^," + groupID + ".0," + criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^,^^,^^,^^,1";
                MD_reachViewerDialog.LaunchReachGraphViewer(parameters); //eslint-disable-line new-cap
            }
            else {
                var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
                parameters = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "\\discrete-graphing^," + groupID + ".0," + criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^";
                var graphCall = "CCLLINK('mp_retrieve_graph_results', '" + parameters + "',1)";
                logger.logCCLNewSessionWindowInfo(null, graphCall, "mp_core.js", "GraphResults");
                CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1); //eslint-disable-line new-cap
            }

            Util.preventDefault();
        },
        ReleaseRequestReference: function(reqObj) {
            if (CERN_Platform.inMillenniumContext() && XMLCCLREQUESTOBJECTPOINTER) {
                for (var id in XMLCCLREQUESTOBJECTPOINTER) {
                    if (XMLCCLREQUESTOBJECTPOINTER[ id ] === reqObj) {
                        delete (XMLCCLREQUESTOBJECTPOINTER[ id ]);
                    }
                }
            }
        },
        /**
         * Message box similar to alert or confirm with customizable options.
         * @param msg {string} String message or html to display in message box
         * @param title {string}  Title of the message box
         * @param btnTrueText {string}  Text value of the true option button, will default to 'OK' if omitted.
         * @param btnFalseText {string}  Text value of the false option button.  No false button will be created if omitted.
         * @param falseBtnFocus {boolean}  Sets the default focus to the false button.
         * @param cb {object}  Callback function to fire on true button click.
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
                var btnVal = parseInt(this.getAttribute("data-val"), 10);
                $(".modal-div").remove();
                $(".modal-dialog").remove();
                $("html").css("overflow", "auto");
                //reset overflow
                if (btnVal && typeof cb === "function") {
                    cb();
                }
            };
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

            Util.addEvent(_g("acTrueButton"), "click", closeBox);
            if (btnFalseText) {
                Util.addEvent(_g("acFalseButton"), "click", closeBox);
            }

            if (falseBtnFocus && btnFalseText) {
                _g("acFalseButton").focus();
            }
            else {
                _g("acTrueButton").focus();
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
            new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler, itemId); //eslint-disable-line no-new
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
                        returnVal = "value(" + ar.join(".0,") + ".0)";
                    }
                    else {
                        returnVal = "value(" + ar.join(",") + ")";
                    }
                }
                else {
                    returnVal = (type === 1) ? ar[ 0 ] + ".0" : ar[ 0 ];
                }
            }
            return returnVal;
        },
        /**
         * This method is used to overlay the content of a component with a transparent DIV and also show the loading icon (spinner) in the center of that container.
         * @param {String} resultContainerId The id of the element which should be covered by the spinner.
         * @param {number} skipOffsetFlag Pass a 1 to not use the offset and instead set the margin-top
         * @param {String} spinnerId Spinner div Id that is used to reference the spinner
         * @return null
         */
        LoadSpinner: function(resultContainerID, skipOffsetFlag, spinnerId) {
            if (resultContainerID && typeof resultContainerID === "string") {
                var resultContainer = $("#" + resultContainerID);
                var contentHeight = resultContainer.height();
                var styleProp = "";

                if (skipOffsetFlag) {
                    styleProp = "height: " + contentHeight + "px; margin-top: -" + contentHeight + "px;";
                }
                else {
                    var offset = resultContainer.offsetParent();
                    var loadingIconTop = offset.height() - contentHeight;
                    styleProp = "height: " + contentHeight + "px; top: " + loadingIconTop + "px;";
                }

                if (spinnerId) {
                    resultContainer.append("<div id='" + spinnerId + "' class='loading-screen' style='" + styleProp + "'><div class='loading-spinner'>&nbsp;</div></div>");
                }
                else {
                    resultContainer.append("<div class='loading-screen' style='" + styleProp + "'><div class='loading-spinner'>&nbsp;</div></div>");
                }
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
         * To display a ModalDialog with the output of the reportName script.
         * The driver script will be called to get the details of the report and if the response is success,
         * the response text will be displayed in the body of the dialog.
         * If there is any failure in the response, an error dialog will be displayed with error message and
         * on closing the dialog report modal dialog will be displayed with text "No data found" in the body.
         * On click of print button will open a print dialog to perform the printing.
         * @param reportName {String} name of the report to be executed.
         * @param person_id {String} personId Person id of the patient in string format with '.0' on the end.
         * @param encounter_id {int} encounterId Encounter id of the patient in string format with '.0' on the end.
         * @return null
         */
        PrintReport: function(reportName, personId, encounterId) {
            var convertRTFtoHTML = 1;
            var reportContents = "";

            /**
             * This function will create and iFrame and populate it with the results of
             * the report.  Once that is done it executes the print functionality
             */
            function printReportOutput() {
                try {
                    var iframeObj = document.createElement("iframe");
                    iframeObj.setAttribute("display", "none");
                    document.body.appendChild(iframeObj);

                    var printWindow = iframeObj.contentWindow;
                    var docObject = printWindow ? printWindow.document : null;
                    if (docObject) {
                        docObject.write(reportContents);
                        docObject.close();
                        printWindow.focus();
                        printWindow.print();
                    }
                }
                catch (err) {
                    logger.logJSError(err, null, "mpage-core.js", "PrintReport");
                }
                finally {
                    $(iframeObj).remove();
                }
            }

            //Retrieve the print report modalDialog object
            var printDialog = MP_ModalDialog.retrieveModalDialogObject("printDialog");
            if (!printDialog) {
                printDialog = new ModalDialog("printDialog");
                printDialog.setHeaderTitle("&nbsp;");
                MP_ModalDialog.addModalDialogObject(printDialog);

                //Create the cancel button
                var cancelButton = new ModalButton("cancelButton");
                cancelButton.setText(i18n.discernabu.CONFIRM_CANCEL);
                cancelButton.setCloseOnClick(true);
                printDialog.addFooterButton(cancelButton);

                //Create the print button
                var printButton = new ModalButton("printButton");
                printButton.setText(i18n.PRINT);
                printButton.setCloseOnClick(false);
                printButton.setOnClickFunction(printReportOutput);
                printDialog.addFooterButton(printButton);
            }

            //Show the modal dialog before we make the synchronous request
            MP_ModalDialog.showModalDialog("printDialog");

            //Create a script request to get the results from the print report
            var reportRequest = new ScriptRequest();
            reportRequest.setName("Print Report Script Request");
            reportRequest.setProgramName("pwx_rpt_driver_to_mpage");
            reportRequest.setParameterArray([ "^MINE^", "^" + reportName + "^", personId, encounterId, convertRTFtoHTML ]);
            reportRequest.setRawDataIndicator(true);
            reportRequest.setResponseHandler(function(replyObj) {
                //Reset the cursor to default
                $("body").css("cursor", "default");
                //Get the reply from the script
                reportContents = replyObj.getResponse();
                //Update the contents of the modal dialog with the reply from the script request or the No Data Found i18n
                printDialog.setBodyHTML(reportContents || i18n.NO_DATA_FOUND);
            });
            reportRequest.performRequest();

            // Show the cursor as busy, this indicates the system is processing the request.
            // It will be reset to default when success/failed response is returned.
            $("body").css("cursor", "wait");
        },
        CalculatePrecision: function(valRes) {
            var precision = 0;
            var str = (MP_Util.IsString(valRes)) ? valRes : valRes.toString();  //eslint-disable-line new-cap
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
            var month = "";
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
                    alert("unknown month"); //eslint-disable-line no-alert
            }
            return (day + "-" + month + "-" + rest);
        },
        /**
         * @deprecated Use logger.logDebug(debug) instead.
         * This method will log a debug message.
         * @param {string} debugString - The debug string to be logged.
         */
        LogDebug: function(debugString) {
            logger.logDebug(debugString);
        },
        /**
         * @deprecated Use logger.logWarning(warning) instead.
         * This method will log a warning.
         * @param {string} warnString - The warning string to be logged.
         */
        LogWarn: function(warnString) {
            logger.logWarning(warnString);
        },
        /**
         * @deprecated Use logger.logMessage(message) instead.
         * This method will log a message.
         * @param {string} infoString - The message string to be logged.
         */
        LogInfo: function(infoString) {
            logger.logMessage(infoString);
        },
        /**
         * @deprecated Use logger.logError(error) instead.
         * This method will log an error.
         * @param {string} errorString - The error string to be logged.
         */
        LogError: function(errorString) {
            logger.logError(errorString);
        },
        /**
         * @deprecated Use logger.logScriptCallInfo(...) instead.
         * @param {MPageComponent} component - The component for which the info is being logged.
         * @param {ScriptRequest} request - The script request that was made.
         * @param {string} file - The JS file from which the script call was made.
         * @param {string} funcName - The function from which the script call was made.
         */
        LogScriptCallInfo: function(component, request, file, funcName) {
            logger.logScriptCallInfo(component, request, file, funcName);
        },
        /**
         * @deprecated Use logger.logScriptCallError(...) instead.
         * @param {MPageComponent} component - The component for which the error is being logged.
         * @param {ScriptRequest} request - The script request that was made.
         * @param {string} file - The JS file from which the script call was made.
         * @param {string} funcName - The function from which the call was made.
         */
        LogScriptCallError: function(component, request, file, funcName) {
            logger.logScriptCallError(component, request, file, funcName);
        },
        /**
         * @deprecated Use logger.logJSError(...) instead.
         * @param {Error} err - The error that occurred.
         * @param {MPageComponent} component - The component in which the error originated.
         * @param {string} file - The JS file from which the JavaScript error originated.
         * @param {string} funcName - The function from which the JavaScript error originated.
         */
        LogJSError: function(err, component, file, funcName) {
            logger.logJSError(err, component, file, funcName);
        },
        /**
         * @deprecated Use logger.logDiscernInfo(...) instead.
         * @param {MPageComponent} component - The component from which the information is being logged.
         * @param {string} objectName - The name of the object for which information is being logged.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogDiscernInfo: function(component, objectName, file, funcName) {
            logger.logDiscernInfo(component, objectName, file, funcName);
        },
        /**
         * @deprecated Use logger.logMPagesEventInfo(...) instead.
         * @param {MPageComponent} component - The component from which the information is being logged.
         * @param {string} eventName - The name of the event that occurred.
         * @param {string} params - The parameters associated to the MPages event.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogMpagesEventInfo: function(component, eventName, params, file, funcName) {
            logger.logMPagesEventInfo(component, eventName, params, file, funcName);
        },
        /**
         * @deprecated Use logger.logCCLNewSessionWindowInfo(...) instead.
         * @param {MPageComponent} component - The component from which the information is being logged.
         * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogCclNewSessionWindowInfo: function(component, params, file, funcName) {
            logger.logCCLNewSessionWindowInfo(component, params, file, funcName);
        },
        /**
         * @deprecated Use logger.logTimerInfo(...) instead.
         * @param {string} timerName - The name of the timer.
         * @param {string} subTimerName - The sub timer name.
         * @param {string} timerType - The type of timer.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogTimerInfo: function(timerName, subTimerName, timerType, file, funcName) {
            logger.logTimerInfo(timerName, subTimerName, timerType, file, funcName);
        },
        AddCookieProperty: function(compId, propName, propValue) {
            var cookie = CK_DATA[ compId ];
            if (!cookie) {
                cookie = {};
            }
            cookie[ propName ] = propValue;
            CK_DATA[ compId ] = cookie;
        },
        GetCookieProperty: function(compId, propName) {
            var cookie = CK_DATA[ compId ];
            if (cookie && cookie[ propName ]) {
                return cookie[ propName ];
            }
            else {
                return null;
            }
        },
        WriteCookie: function() {
            var cookieJarJSON = JSON.stringify(CK_DATA);
            document.cookie = "CookieJar=" + cookieJarJSON + ";";
        },
        RetrieveCookie: function() {
            var cookies = document.cookie;
            var match = cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
            if (match && match[ 1 ]) {
                CK_DATA = JSON.parse(match[ 1 ]);
            }
        },
        /**
         * This function is used to generate the HTML content for a modal dialog that is intended to display an informational message to the user.
         * If the modal dialog with the id of modalId does not already exist it will be created, but will not be added to the modal dialog collection
         * in MP_ModalDialog.
         * @param {string} modalId The id of an existing modal dialog or the id that will be given to the modal dialog that will be created.
         * @param {string} messageType The type of message that will be created.  Different styling will be applied to different message types.  A default
         * value of "" is a valid value for this parameter.
         * @param {string} line1 This first line of the informational message.  This line could potentially be stylized based on the messageType.
         * @param {string} line2 This is the second line of the information message.  It will not be styled based on the messageType
         * @return {ModalDialog}  The updated or newly create object that inherits from ModalDialog.
         */
        generateModalDialogBody: function(modalId, messageType, line1, line2) {
            var modal = null;

            //Check to see if this modal dialog already exists.  If not go ahead and create it.
            modal = MP_ModalDialog.retrieveModalDialogObject(modalId);

            //Create a modal dialog here
            if (!modal) {
                switch (messageType.toLowerCase()) {
                    case "error":
                        modal = new ErrorModal(modalId);
                        break;
                    case "warning":
                        modal = new WarningModal(modalId);
                        break;
                    case "information":
                        modal = new InfoModal(modalId);
                        break;
                    case "busy":
                        modal = new BusyModal(modalId);
                        break;
                    default:
                        modal = new MessageModal(modalId);
                        break;
                }
            }

            //Apply the proper margins for User informational messages
            //Generate the proper HTML string based on the type passed into the function
            //Apply the new message to the modal
            //
            modal.setMessage(line1, line2);

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
        setObjectDefinitionMapping: function(mappingId, objectDefinition) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return false;
            }
            mappingId = mappingId.toUpperCase();

            //Check to see if there is an existing mapping for that ID
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] !== "undefined") {
                logger.logMessage("Object mapping already exists for " + mappingId + "\nPlease select a different id or use the MP_Util.updateObjectDefinitionMApping function");
                return false;
            }
            //Make sure we are mapping an object definition which would be a function
            if (typeof objectDefinition === "function") {
                CERN_ObjectDefinitionMapping[ mappingId ] = objectDefinition;
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
        getObjectDefinitionMapping: function(mappingId) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return null;
            }
            mappingId = mappingId.toUpperCase();
            //Attempt to retrieve the object definition
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] === "undefined") {
                return null;
            }
            return CERN_ObjectDefinitionMapping[ mappingId ];
        },
        /**
         * Updates the object definition mapped to the identifier passed into the function.  If no object is mapped to the
         * identifier then no updates are made to the CERN_ObjectDefinitionMapping object.
         * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
         * insensitive.
         * @param {function} objectDefinition : A reference to the definition of the object being mapped
         * @return {boolean} True if the object mapping was updated successfully, false otherwise.
         */
        updateObjectDefinitionMapping: function(mappingId, objectDefinition) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return null;
            }
            mappingId = mappingId.toUpperCase();
            //Make sure an object definition already exists for this mappingId
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] === "undefined") {
                logger.logMessage("Object mapping does not exists for " + mappingId);
                return false;
            }
            //Make sure we are mapping an object definition which would be a function
            if (typeof objectDefinition === "function") {
                CERN_ObjectDefinitionMapping[ mappingId ] = objectDefinition;
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
        removeObjectDefinitionMapping: function(mappingId) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return null;
            }
            mappingId = mappingId.toUpperCase();
            //Make sure the object definition exists before we attempt to delete it
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] === "undefined") {
                logger.logMessage("Object mapping does not exists for " + mappingId);
                return false;
            }
            return delete CERN_ObjectDefinitionMapping[ mappingId ];
        },
        /*
         * This function stringifies the passed in object, surrounds fields which end in _dt_tm with "\/Date()\/"
         * and adds .0 to all fields which end in _id or _cd. Also, if any fields are passed in .0 will be added for those fields as well
         *
         * @param {object} object which needs to be stringified
         *
         * @param {number} skip fields ending in _id/_cd flag - If set to 1, .0 will not be added to the fields ending in _id and _cd
         *
         * @param {number} skip date flag - If set to 1, value of fields ending in _dt_tm will not be surrounded with "\/Date()\/"
         *
         * @param {string} field names for which .0 should be added(apart from fields which end in _id/_cd). Any number of fields can be passed in
         *
         * @param {boolean} pass true if the dates are in UTC format
         *
         * @return {string} JSON string which can be passed to back-end
         *
         * Usage - call enhancedStringify(obj, 1, 1, "application_ctx")
         *
         *    Above function call will stringify the passed in object - obj, add .0 for all fields ending in _id or cd
         *    and surround dt_tm fields with Date() and also add .0 for application_ctx field
         */
        enhancedStringify: function(obj, skipIDAndCDFields, skipDates, isUTC, additionalFields) {

            var replacedJSONStr, findString, regExpObject;

            var dateAndIdReplacer = function(key, value) {

                if (typeof key === "string") {

                    var upperCaseKey = key.toUpperCase();
                    var replacedDateValue;

                    // Do not surround date fields with Date() if skipDates flag is set to 1
                    if (skipDates !== 1 && typeof value === "string" && value !== "" && upperCaseKey.indexOf("_DT_TM") > -1) {
                        if (isUTC) {
                            replacedDateValue = "XXX_REPLACE_DT_START_XXX" + value.replace("Z", "+00:00XXX_REPLACE_DT_END_XXX");
                        } else {
                            replacedDateValue = "XXX_REPLACE_DT_START_XXX" + value + "XXX_REPLACE_DT_END_XXX";
                        }
                        return replacedDateValue;
                    }
                    if ((skipIDAndCDFields !== 1) && (typeof value === "number") && (upperCaseKey.indexOf("_ID") > -1 || upperCaseKey.indexOf("_CD") > -1)) {
                        return value + 0.99;
                    }
                }

                return value;
            };

            replacedJSONStr = JSON.stringify(obj, dateAndIdReplacer).replace(/\.99/g, ".0").replace(/XXX_REPLACE_DT_START_XXX/g, "\\/Date(").replace(/XXX_REPLACE_DT_END_XXX/g, ")\\/");

            // If there are any other fields passed in, iterate over them and add .0 to those values
            if (additionalFields && additionalFields.length) {
                for (var i = additionalFields.length; i--;) {
                    // Create a regular expression which captures the field along with it's value
                    findString = "(\"" + additionalFields[ i ] + "\"" + ":" + "\\d" + "+)";
                    regExpObject = new RegExp(findString, "gi");

                    replacedJSONStr = replacedJSONStr.replace(regExpObject, "$&.0");
                }
            }

            return replacedJSONStr;
        }
    };
    /**
     * Calculates difference between two dates given and returns string with appropriate units
     * If no endDate is given it is assumed the endDate is the current date/time
     *
     * @param beginDate  Begin <code>Date</code> for Calculation
     * @param endDate  End <code>Date</code> for Calculation
     * @param mathFlag  <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 =
     * Floor, 0 = Ceil
     * @param abbreviateFlag  <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used
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
        if (mathFlag == 0) {  //eslint-disable-line eqeqeq
            mathFunc = function(val) {
                return Math.ceil(val);
            };
            comparisonFunc = function(lowerVal, upperVal) {
                return (lowerVal <= upperVal);
            };
        }
        else {
            mathFunc = function(val) {
                return Math.floor(val);
            };
            comparisonFunc = function(lowerVal, upperVal) {
                return (lowerVal < upperVal);
            };
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

/**
 * @namespace
 */
MP_Util.Doc = function() {
    var openAccordion = "";
    var compMenuTimeout = null;
    var compMenuDelay = 250;

    return {
        SetupExpandCollapse: function(categoryMeaning) {
            var i18nCore = i18n.discernabu;
            //set up expand collapse for all components
            var body = null;
            var toggleArray = null;
            if (categoryMeaning) {
                body = _g(categoryMeaning);
                toggleArray = Util.Style.g("sec-hd-tgl", body, "span");
            }
            else {
                toggleArray = Util.Style.g("sec-hd-tgl");
            }
            for (var k = 0; k < toggleArray.length; k++) {
                Util.addEvent(toggleArray[ k ], "click", MP_Util.Doc.ExpandCollapse);
                var checkClosed = Util.gp(Util.gp(toggleArray[ k ]));
                if (Util.Style.ccss(checkClosed, "closed")) {
                    toggleArray[ k ].innerHTML = "+";
                    toggleArray[ k ].title = i18nCore.SHOW_SECTION;
                }
            }
        },
        SetupCompFilters: function(compArray) {
            var comp = null;
            var compArrayLen = compArray.length;
            var hasFilters = false;
            for (var x = 0; x < compArrayLen; x++) {
                comp = compArray[ x ];
                hasFilters = false;
                for (var y = 0; y < 10; y++) {
                    if (comp.getGrouperLabel(y) || comp.getGrouperCatLabel(y)) {
                        hasFilters = true;
                        break;
                    }
                }
                comp.setCompFilters(hasFilters);
                if (comp.hasCompFilters() && comp.isDisplayable()) {
                    comp.renderAccordion(comp);
                }
            }
        },
        /**
         * Create Component Menus
         * @param {mpComps} mpage components for current view
         * @param {bool} disablePrsnl boolean to disable personalize section
         * @param
         */
        CreateCompMenus: function(mpComps, disablePrsnl) {
            var setupCustCompMenu = function(curComp, compId, fullId, ns) {
                curComp.createMainMenu();
                var compMenu = curComp.getMenu();
                if (compMenu) {
                    var themeSelectorId = "themeSelector" + compId;
                    var themeSelector = new ThemeSelector(themeSelectorId, compId, fullId, ns);
                    compMenu.addMenuItem(themeSelector);
                    var defaultExpandedSelection = new MenuSelection("defaultExpandedSelection" + compId);
                    defaultExpandedSelection.setLabel(i18n.discernabu.DEFAULT_EXPANDED);
                    defaultExpandedSelection.setIsSelected(curComp.isExpanded() === 1);
                    defaultExpandedSelection.setCloseOnClick(false);
                    defaultExpandedSelection.setClickFunction(function() {
                        var isFinalStateExpanded = !curComp.isExpanded();
                        curComp.setExpandCollapseState(isFinalStateExpanded);
                        curComp.setExpanded(isFinalStateExpanded ? 1 : 0);
                        MP_Core.AppUserPreferenceManager.UpdateSingleCompPreferences(curComp, true); //eslint-disable-line new-cap
                    });
                    compMenu.addMenuItem(defaultExpandedSelection);
                    MP_MenuManager.updateMenuObject(compMenu);
                    var secId = fullId.replace("mainCompMenu", "");
                    Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
                        MP_MenuManager.showMenu(this.id);
                    });
                }
            };

            var setupCompMenu = function(componentId, fullId, isExp, infoInd, infoState) {
                if (_g(fullId)) {
                    var optMenu = _g("moreOptMenu" + componentId);
                    if (!optMenu) {
                        optMenu = Util.cep("div", {
                            className: "opts-menu-content menu-hide",
                            id: "moreOptMenu" + componentId
                        });
                        var i18nCore = i18n.discernabu;
                        var defExpClass = "";
                        var infoBtnMsg = i18nCore.INFO_BUTTON;
                        var infoClass = "";

                        if (isExp) {
                            defExpClass = "opts-menu-def-exp";
                        }

                        if (infoState) {
                            infoClass = "opts-menu-info-en";
                        }

                        var optMenuHtml = "<div class=\"opts-actions-sec\" id=\"optsMenuActions" + componentId + "\"></div>";

                        if (!disablePrsnl) {
                            if (infoInd) {
                                optMenuHtml += "<div class=\"opts-personalize-sec\" id=\"optsMenupersonalize" + componentId + "\"><div class=\"opts-menu-item opts-def-theme\" id=\"optsDefTheme" + componentId + "\">" + i18nCore.COLOR_THEME + "</div><div class=\"opts-menu-item opts-def-state\" id=\"optsDefState" + componentId + "\">" + i18nCore.DEFAULT_EXPANDED + "<span class=\"" + defExpClass + "\">&nbsp;</span></div><div class=\"opts-menu-item opts-personalize-sec-divider\" id=\"optsInfoState" + componentId + "\">" + infoBtnMsg + "<span class=\"" + infoClass + "\">&nbsp;</span></div></div>";
                            }
                            else {
                                optMenuHtml += "<div class=\"opts-personalize-sec\" id=\"optsMenupersonalize" + componentId + "\"><div class=\"opts-menu-item opts-def-theme\" id=\"optsDefTheme" + componentId + "\">" + i18nCore.COLOR_THEME + "</div><div class=\"opts-menu-item opts-def-state\" id=\"optsDefState" + componentId + "\">" + i18nCore.DEFAULT_EXPANDED + "<span class=\"" + defExpClass + "\">&nbsp;</span></div></div>";
                            }
                        }

                        optMenu.innerHTML = optMenuHtml;

                        Util.ac(optMenu, document.body);
                    }
                    InitCompOptMenu(optMenu, componentId, false); //eslint-disable-line new-cap

                    var themeTimeout = null;
                    var themeOut = function(e) {
                        if (!e) {
                            e = window.event;
                        }
                        var relTarg = e.relatedTarget || e.toElement;
                        if (relTarg) {
                            themeTimeout = window.setTimeout(function() {
                                if (_g("optMenuConfig" + componentId)) {
                                    Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                                }
                            }, compMenuDelay);
                        }
                        else {
                            if (_g("optMenuConfig" + componentId)) {
                                Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                            }
                            return;
                        }
                    };
                    var secId = fullId.replace("mainCompMenu", "");
                    Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
                        OpenCompOptMenu(optMenu, secId); //eslint-disable-line new-cap
                    });

                    if (!disablePrsnl) {
                        var optDefThemeMenuItem = _g("optsDefTheme" + componentId);

                        // when entering the "Color Theme" menu  item...
                        // we launch the color theme menu + clear the "close menu" timer
                        Util.addEvent(optDefThemeMenuItem, "mouseenter", function() {
                            window.clearTimeout(themeTimeout);
                            var configMenu = _g("optMenuConfig" + componentId);
                            if (!configMenu) {
                                launchThemeMenu(componentId, fullId, secId, this);
                            }
                            else {
                                if (Util.Style.ccss(configMenu, "menu-hide")) {
                                    OpenCompOptMenu(configMenu, fullId, this); //eslint-disable-line new-cap
                                }
                            }
                        });
                        // When entering the component menu container...
                        // if we aren't moving into the "Color Theme" menu item, trigger the "close menu" timer
                        Util.addEvent(optMenu, "mouseenter", function(e) {
                            if (!e) {
                                e = window.event;
                            }
                            var target = e.target || e.srcElement;
                            if (!Util.Style.ccss(target, "opts-def-theme")) {
                                themeOut(e);
                            }
                        });
                        // When leaving the "Color Theme" menu item...
                        // if we aren't moving into the component menu container or moving into the color themes menu, trigger the "close menu" timer
                        Util.addEvent(optDefThemeMenuItem, "mouseleave", function(e) {
                            if (!e) {
                                e = window.event;
                            }
                            window.clearTimeout(themeTimeout);
                            var relTarg = e.relatedTarget || e.toElement;
                            if (relTarg && !Util.Style.ccss(relTarg, "opts-menu-content") && !Util.Style.ccss(relTarg, "opts-menu-config-content")) {
                                themeOut(e);
                            }
                        });
                        Util.addEvent(_g("optsDefState" + componentId), "click", function() {
                            launchSetState(componentId, this);
                        });

                        if (infoInd) {
                            Util.addEvent(_g("optsInfoState" + componentId), "click", function() {
                                launchInfoSetState(componentId, this);
                            });
                        }
                    }
                }
            };
            var mns = mpComps;
            var mLen = mns.length;
            for (var i = 0; i < mLen; i++) {
                var curComp = mns[ i ];
                var ns = curComp.m_styles.m_nameSpace;
                var compId = curComp.m_styles.m_componentId;
                var fullId = "mainCompMenu" + ns + compId;
                var isExp = curComp.isExpanded();
                var infoInd = curComp.hasInfoButton();
                var infoState = curComp.isInfoButtonEnabled();
                if (ns !== "cust") {
                    setupCompMenu(compId, fullId, isExp, infoInd, infoState);
                } else {
                    setupCustCompMenu(curComp, compId, fullId, ns);
                }
            }
        },
        /**
         * Hide all Component Menus
         */
        HideAllCompMenus: function() {
            var mnus = Util.Style.g("opts-menu-content", null, "div");
            var mnLen = mnus.length;
            for (var m = mnLen; m--;) {
                if (!Util.Style.ccss(mnus[ m ], "menu-hide")) {
                    Util.Style.acss(mnus[ m ], "menu-hide");
                }
            }
        },
        GetComments: function(par, personnelArray) {
            var com = "",
                recDate = "";
            var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
            for (var j = 0, m = par.COMMENTS.length; j < m; j++) {
                if (personnelArray.length != null) {  //eslint-disable-line eqeqeq
                    if (par.COMMENTS[ j ].RECORDED_DT_TM != "") {  //eslint-disable-line eqeqeq
                        recDate = df.formatISO8601(par.COMMENTS[ j ].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                    }
                    if (j > 0) {
                        com += "<br />";
                    }
                    if (par.COMMENTS[ j ].RECORDED_BY > 0) {
                        com += recDate + " - " + MP_Util.GetValueFromArray(par.COMMENTS[ j ].RECORDED_BY, personnelArray).fullName + "<br />" + par.COMMENTS[ j ].COMMENT_TEXT; //eslint-disable-line new-cap
                    }
                    else {
                        com += recDate + "<br />" + par.COMMENTS[ j ].COMMENT_TEXT;
                    }
                }
            }
            return com;
        },
        FinalizeComponent: function(contentHTML, component, countText) {
            var styles = component.getStyles();

            //replace count text
            var rootComponentNode = component.getRootComponentNode();
            //There are certain circumstances where a components DOM element will have been removed.
            //ie. selecting a view from the viewpoint drop down and then selecting another.
            if (rootComponentNode) {
                var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
                if (countText) {
                    //Make sure the count text is not hidden.
                    $(totalCount).removeClass("hidden");
                    totalCount[ 0 ].innerHTML = countText;
                }
                else {
                    //If there is no count text to show then hide the element so it doesn't take up space.
                    $(totalCount).addClass("hidden");
                }

                //replace content with HTML
                var node = component.getSectionContentNode();
                node.innerHTML = contentHTML;

                //init hovers
                MP_Util.Doc.InitHovers(styles.getInfo(), node, component); //eslint-disable-line new-cap

                //init subsection toggles
                MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl"); //eslint-disable-line new-cap

                //init scrolling
                //Wrap in timeout to momentarly break the JS processing up and allow the browswer to render.
                setTimeout(function() {
                    MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6"); //eslint-disable-line new-cap
                }, 0);

                //Check to see if the component has an error message displayed
                var errorElement = $(rootComponentNode).find(".error-message");
                if (errorElement.length) {
                    //Add an error icon to the component title
                    $(rootComponentNode).find(".sec-title>span:first-child").addClass("error-icon-component");
                    //Ensure the bottom border on the error message is red and the padding is consistent
                    $(errorElement).css("border", "1px solid #C00").css("padding", "2px 4px");
                    //Fire and event to inform any listener that the component has errored
                    CERN_EventListener.fireEvent(component, component, EventListener.EVENT_ERROR_UPDATE, {
                        "error": true
                    });
                }
                else {
                    //Remove the error icon in the component title
                    $(rootComponentNode).find(".sec-title>span:first-child").removeClass("error-icon-component");
                    //Fire and event to inform any listener that the component has not errored
                    CERN_EventListener.fireEvent(component, component, EventListener.EVENT_ERROR_UPDATE, {
                        "error": false
                    });
                }

                //Add the Gap Check Indicators to the component based on the bedrock settings
                if (component.getGapCheckRequiredInd()) {
                    var disclaimerContainer = null;
                    var disclaimerBannerObj = null;
                    disclaimerContainer = $(rootComponentNode).find(".disclaimer-text");
                    if (!disclaimerContainer.length) {
                        disclaimerBannerObj = component.createComponentDisclaimerContainer();
                        var disclaimerMessageHTML = disclaimerBannerObj.render();
                        //Add a class to Alert Banner to differentiate it from other banners added to the component
                        disclaimerContainer = $(disclaimerMessageHTML).addClass("disclaimer-text");
                        var contentNodeHeader = $(rootComponentNode).find("H2")[ 0 ];
                        $(contentNodeHeader).after(disclaimerContainer);
                        //attach event to the close button
                        disclaimerBannerObj.attachEvents();
                    }
                    component.updateComponentRequiredIndicator();
                }
            }

            //notify the aggregate timer that the component has finished loading
            component.notifyAggregateTimer();
        },
        /**
         * Formats the content to the appropriate height and enables scrolling
         * @param {node} content : The content to be formatted
         * @param {int} num : The approximate number of items to display face up
         * @param {float} ht : The total line height of an item
         */
        InitScrolling: function(content, num, ht) {
            for (var k = 0; k < content.length; k++) {
                MP_Util.Doc.InitSectionScrolling(content[ k ], num, ht); //eslint-disable-line new-cap
            }
        },
        /**
         * Formats the section to the appropriate height and enables scrolling
         * @param {node} sec : The section to be formatted
         * @param {int} num : The approximate number of items to display face up
         * @param {float} ht : The total line height of an item
         */
        InitSectionScrolling: function(sec, num, ht) {
            var th = num * ht;
            var totalHeight = th + "em";

            sec.style.maxHeight = totalHeight;
            sec.style.overflowY = "auto";
            sec.style.overflowX = "hidden";
        },
        InitHovers: function(trg, par, component) {
            var gen = Util.Style.g(trg, par, "DL");

            for (var i = 0, l = gen.length; i < l; i++) {
                var m = gen[ i ];
                if (m) {
                    var nm = Util.gns(Util.gns(m));
                    if (nm) {
                        if (Util.Style.ccss(nm, "hvr")) {
                            hs(m, nm, component);
                        }
                    }
                }
            }
        },
        InitSubToggles: function(par, tog) {
            var i18nCore = i18n.discernabu;
            var toggleArray = Util.Style.g(tog, par, "span");
            for (var k = 0; k < toggleArray.length; k++) {
                Util.addEvent(toggleArray[ k ], "click", MP_Util.Doc.ExpandCollapse);
                var checkClosed = Util.gp(Util.gp(toggleArray[ k ]));
                if (Util.Style.ccss(checkClosed, "closed")) {
                    toggleArray[ k ].innerHTML = "+";
                    toggleArray[ k ].title = i18nCore.SHOW_SECTION;
                }
            }
        },


        /**
         * Adds the title to the page.
         * @param {String} title The title of the page to display
         * @param {Object} bodyTag The body tag associated to the HTML document
         * @param {Boolean} debugInd Indicator denoting if the mpage should run in debug mode.
         * @param {Boolean} custInd Indicator denoting if the 'customize' option should be made available to the user for the given layout
         * @param {String} helpFile The string name of the help file to associate to the page.
         * @param {String} helpURL The String name of the help file URL to associate to the page.
         * @param {Object} criterion The object associated to the criterion data
         * @param {String} categoryMeaning The String name of the MPages View
         */
        AddPageTitle: function(title, bodyTag, debugInd, custInd, anchorArray, helpFile, helpURL, criterion, categoryMeaning) {
            var i18nCore = i18n.discernabu;
            var ar = [];
            if (categoryMeaning) {
                title = "";
                bodyTag = _g(categoryMeaning);
                bodyTag.innerHTML = "";
            }
            else {
                if (bodyTag) {
                    bodyTag = document.body;
                }
            }
            ar.push("<div class='pg-hd'>");
            ar.push("<h1><span class='pg-title'>", title, "</span></h1><span id='pageCtrl", criterion.category_mean, "' class='page-ctrl'>");

            //'as of' date is always to the far left of items
            if (categoryMeaning) {
                var df = MP_Util.GetDateFormatter(); //eslint-disable-line new-cap
                ar.push("<span class='other-anchors'>", i18nCore.AS_OF_TIME.replace("{0}", df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)), "</span>");
            }
            if (anchorArray) {
                for (var x = 0, xl = anchorArray.length; x < xl; x++) {
                    ar.push("<span class='other-anchors'>" + anchorArray[ x ] + "</span>");
                }
            }

            if (custInd || categoryMeaning) {//customizable single view or in a view point
                var pageMenuId = "pageMenu" + criterion.category_mean;
                ar.push("<span id='", pageMenuId, "' class='page-menu'>&nbsp;</span>");
            }
            ar.push("</span></div>");
            bodyTag.innerHTML += ar.join("");
            return;
        },
        /**
         * Launches the help file in a new modal window
         * @param {String} HelpURL The String name of the help file  to associate to the page.
         */
        LaunchHelpWindow: function(helpURL) {
            var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
            logger.logCCLNewSessionWindowInfo(null, helpURL, "mp_core.js", "LaunchHelpWindow");
            CCLNEWSESSIONWINDOW(helpURL, "_self", wParams, 0, 1); //eslint-disable-line new-cap
            Util.preventDefault();
        },
        /**
         * @deprecated - This function is no longer valid and should not be used
         */
        AddCustomizeLink: function(criterion) {
            var custNode = _g("custView" + criterion.category_mean);
            if (custNode) {
                //The code below has been removed since the customize option is no longer in use.  Work still needs to be done
                //To remove this function from all locations where AddCustomLink is called.
                logger.logWarn("AddCustomizeLink is a deprecated function and should not be utilized");
            }
        },
        ExpandCollapse: function() {
            var i18nCore = i18n.discernabu;
            var gpp = Util.gp(Util.gp(this));
            if (Util.Style.ccss(gpp, "closed")) {
                Util.Style.rcss(gpp, "closed");
                this.innerHTML = "-";
                this.title = i18nCore.HIDE_SECTION;
            }
            else {
                Util.Style.acss(gpp, "closed");
                this.innerHTML = "+";
                this.title = i18nCore.SHOW_SECTION;
            }
        },
        HideHovers: function() {
            var hovers = Util.Style.g("hover", document.body, "DIV");
            for (var i = hovers.length; i--;) {
                if (Util.gp(hovers[ i ]).nodeName == "BODY") {  //eslint-disable-line eqeqeq
                    hovers[ i ].style.display = "none";
                    Util.de(hovers[ i ]);
                }
            }
        },
        ReplaceSubTitleText: function(component, text) {
            var lookbackDisplay = $("#lookbackDisplay" + component.getStyles().getId());
            if (lookbackDisplay.length) {
                lookbackDisplay.html(text);
            }
        },
        ReInitSubTitleText: function(component) {
            if (component.getScope() > 0) {
                var lookbackDisplay = $("#lookbackDisplay" + component.getStyles().getId());
                if (lookbackDisplay.length) {
                    lookbackDisplay.html(CreateSubTitleText(component)); //eslint-disable-line new-cap
                }
            }
        },
        /*Copyright (c) 2006-2010 Paranoid Ferret Productions.  All rights reserved.

         Developed by: Paranoid Ferret Productions
         http://www.paranoidferret.com

         THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
         CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
         FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
         WITH THE SOFTWARE.*/

        RunAccordion: function(index) {
            var nID = "Accordion" + index + "Content";
            var TimeToSlide = 100.0;
            var titleDiv = _g("Accordion" + index + "Title");
            var containerDiv = _g("AccordionContainer" + index);

            //Adjust the pull tab image
            if (Util.Style.ccss(titleDiv, "Expanded")) {
                Util.Style.rcss(titleDiv, "Expanded");
                Util.Style.rcss(containerDiv, "Expanded");
            }
            else {
                Util.Style.acss(titleDiv, "Expanded");
                Util.Style.acss(containerDiv, "Expanded");
            }

            if (openAccordion == nID) { //eslint-disable-line eqeqeq
                nID = "";
            }

            setTimeout("MP_Util.Doc.Animate(" + new Date().getTime() + "," + TimeToSlide + ",'" + openAccordion + "','" + nID + "'," + index + ")", 33);
            openAccordion = nID;
        },
        Animate: function(lastTick, timeLeft, closingId, openingId, compID) {
            var TimeToSlide = timeLeft;
            var curTick = new Date().getTime();
            var elapsedTicks = curTick - lastTick;
            var ContentHeight = 275.0;

            var opening = (openingId == "") ? null : _g(openingId);  //eslint-disable-line eqeqeq
            var closing = (closingId == "") ? null : _g(closingId);  //eslint-disable-line eqeqeq

            if (timeLeft <= elapsedTicks) {
                if (opening) {
                    opening.style.display = "block";
                    opening.style.height = ContentHeight + "px";
                }

                if (closing) {
                    closing.style.display = "none";
                    closing.style.height = "0px";
                }
                return;
            }

            timeLeft -= elapsedTicks;
            var newClosedHeight = Math.round((timeLeft / TimeToSlide) * ContentHeight);

            if (opening) {
                if (opening.style.display != "block") {  //eslint-disable-line eqeqeq
                    opening.style.display = "block";
                    opening.style.height = (ContentHeight - newClosedHeight) + "px";
                }
            }
            if (closing) {
                closing.style.height = newClosedHeight + "px";
            }

            setTimeout("MP_Util.Doc.Animate(" + curTick + "," + timeLeft + ",'" + closingId + "','" + openingId + "'," + compID + ")", 33);
        },
        GetSelected: function(opt) {
            var selected = [];
            var index = 0;
            var optLen = opt.length;
            for (var intLoop = 0; intLoop < optLen; intLoop++) {
                if (opt[ intLoop ].selected) {
                    index = selected.length;
                    selected[ index ] = {};
                    selected[ index ].value = opt[ intLoop ].value;
                    selected[ index ].index = intLoop;
                }
            }
            return selected;
        },
        /* Reset Layout functionality*/
        ResetLayoutSettings: function(mPageObj) {
            var componentSettings = mPageObj.getViewSettings().BR_SET.CS; //BR_SET is shorthand for Bedrock Settings and CS is shorthand for Component Settings
            var components = mPageObj.getComponents();
            var tempComp = null;
            var tempCompSettings = {};
            var x = 0;
            //Create a map so we dont have to search the componentSettings more than once
            var componentMap = {};
            for (x = componentSettings.length; x--;) {
                componentMap[ componentSettings[ x ].R_MN ] = componentSettings[ x ]; //R_MN is shorthand for Report Mean
            }

            //Grab the settings from the componentMap and reset the sequence and row to what is originally defined in bedrock
            for (x = components.length; x--;) {
                tempComp = components[ x ];
                tempCompSettings = componentMap[ tempComp.getReportMean() ];
                components[ x ].setSequence(tempCompSettings.R_SQ); //R_SQ is shorthand for Row Sequence
                components[ x ].setColumn(tempCompSettings.C_SQ); //C_SQ is shorthand for Row Sequence
            }

            //Show the cursor as busy
            $("body").css("cursor", "wait");
            //This call is used to update all of the component's settings before refreshing the page.
            MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences(components); //eslint-disable-line new-cap

            //Refresh the Page or Viewpoint
            CERN_Platform.refreshMPage();
        }
    };


    function launchThemeMenu(componentId, fullId, secId, that) {
        var i18nCore = i18n.discernabu;
        var optMenu = _g("optMenuConfig" + componentId);
        if (!optMenu) {
            optMenu = Util.cep("div", {
                "className": "opts-menu-config-content menu-hide",
                "id": "optMenuConfig" + componentId
            });
            var optMenuJsHTML = [];
            optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>", "<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>", "<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>", "<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");

            optMenu.innerHTML = optMenuJsHTML.join("");

            Util.ac(optMenu, document.body);
            //actual contents of the menu are appended to body and positioned in launchOptMenu

            Util.addEvent(_g("optMenuConfig" + componentId), "click", function(e) {
                var target = e.target || e.srcElement;
                var color = target.getAttribute("data-color");
                changeThemeColor(componentId, color, secId);
            });

            InitCompOptMenu(optMenu, componentId, true); //eslint-disable-line new-cap
        }

        OpenCompOptMenu(optMenu, fullId, that); //eslint-disable-line new-cap
    }

    function changeThemeColor(componentId, color, styleId) {
        var section = _g(styleId);
        if (section) {
            var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
            //a color is found in the class name so replace it with ""
            if (colorString.indexOf(color) >= 0) {
                var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
                section.className = section.className.replace(colorRegExp, "");
            }

            //add the new color so it changes for the user
            Util.Style.acss(section, color);
            var component = MP_Util.GetCompObjById(componentId); //eslint-disable-line new-cap
            component.setCompColor(color);
            //add the color to the component properties
            setTimeout(function() {
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, color, null, false); //eslint-disable-line new-cap
            }, 0);
        }
    }

    function launchSetState(componentId, defStateEl) {
        var component = MP_Util.GetCompObjById(componentId); //eslint-disable-line new-cap
        var curExpColState = component.isExpanded();
        component.setExpandCollapseState(!curExpColState);
        var checkSpan = _gbt("span", defStateEl)[ 0 ];

        if (!curExpColState) {
            if (checkSpan) {
                Util.Style.acss(checkSpan, "opts-menu-def-exp");
            }
            setTimeout(function() {
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "1", false); //eslint-disable-line new-cap
            }, 0);
        }
        else {
            if (checkSpan) {
                Util.Style.rcss(checkSpan, "opts-menu-def-exp");
            }
            setTimeout(function() {
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "0", false); //eslint-disable-line new-cap
            }, 0);
        }
    }

    function launchInfoSetState(componentId, infoStateEl) {
        //false = Disabled, true = Enabled
        var component = MP_Util.GetCompObjById(componentId); //eslint-disable-line new-cap
        var curInfoState = component.isInfoButtonEnabled();
        var checkSpan = _gbt("span", infoStateEl)[ 0 ];
		// Get the component name from the report mean
		var componentName = "";
		if(component.m_reportMean && typeof component.m_reportMean !== "undefined"){
			componentName = component.m_reportMean.split('_').slice(3).join(' ');
		}
		var category_mean = component.getCriterion().category_mean;
		var capTimer = null;
        //component.setIsInfoButtonEnabled(!curInfoState);
        if (curInfoState) {
            component.setIsInfoButtonEnabled(0);
        }
        else {
			capTimer = new CapabilityTimer("CAP:MPG_ENABLE_INFOBUTTON", category_mean); //eslint-disable-line no-undef
			if(capTimer){
				capTimer.addMetaData("rtms.legacy.metadata.1", "InfoButton is enabled from the " + componentName + " Summary Component");
				capTimer.capture();
			}
            component.setIsInfoButtonEnabled(1);
        }

        if (!curInfoState) { //Currently disabled, turning to enabled
            if (checkSpan) {
                Util.Style.acss(checkSpan, "opts-menu-info-en");
                //Call the component function to show info button and allow click event
                component.showInfoButton(component, true);
                setTimeout(function() {
                    MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "1"); //eslint-disable-line new-cap
                }, 0);
            }
        }
        else {
            if (checkSpan) {
                Util.Style.rcss(checkSpan, "opts-menu-info-en");
                //Call the component function to remove info button
                component.showInfoButton(component, false);
                setTimeout(function() {
                    MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "0"); //eslint-disable-line new-cap
                }, 0);
            }
        }
    }

    function InitCompOptMenu(inMenu, componentId, isSubMenu) {
        var closeMenu = function(e) {
            if (!e) {
                e = window.event;
            }
            var relTarg = e.relatedTarget || e.toElement;
            var mainMenu = _g("moreOptMenu" + componentId);
            if (isSubMenu) {
                var target = e.target || e.srcElement;
            }
            if (relTarg) {
                if (!Util.Style.ccss(relTarg, "opts-menu-config-content")) {
                    compMenuTimeout = window.setTimeout(function() {
                        if (mainMenu) {
                            if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
                                Util.Style.acss(mainMenu, "menu-hide");
                            }
                        }
                        if (isSubMenu) {
                            Util.Style.acss(inMenu, "menu-hide");
                            if (Util.Style.ccss(target, "opts-menu-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
                                if (_g("moreOptMenu" + componentId)) {
                                    Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
                                }
                            }
                        }
                        if (_g("optMenuConfig" + componentId)) {
                            Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                        }
                    }, compMenuDelay);

                }
            }
            else {
                if (mainMenu) {
                    Util.Style.acss(mainMenu, "menu-hide");
                }
            }
            Util.cancelBubble(e);
        };
        $(inMenu).mouseleave(closeMenu);
        $(inMenu).mouseenter(function() {
            window.clearTimeout(compMenuTimeout);
        });
    }

    /**
     * Open the options menu within the new order entry component
     * @param {node} menu : The menu node
     * @param {string} sectionId : The html id of the section containing the menu
     */
    function OpenCompOptMenu(menu, sectionId, that) {
        var verticalOffset = 30;
        var ofs;
        if (Util.Style.ccss(menu, "menu-hide")) {
            Util.preventDefault();
            Util.Style.rcss(menu, "menu-hide");

            if (that) {
                ofs = Util.goff(that);
                var thisWidth = that.offsetWidth;
                var divOfs = menu.offsetWidth;

                var vpOfs = ofs[ 0 ] - divOfs;
                if (vpOfs > 0) {
                    menu.style.left = (vpOfs - 2) + "px";
                    //  Util.Style.acss(mpDiv, 'hml-mpd-lt');
                }
                else {
                    menu.style.left = (ofs[ 0 ] + thisWidth + 6) + "px";
                    //  Util.Style.acss(mpDiv, 'hml-mpd-rt');

                }
                menu.style.top = (ofs[ 1 ] - 5) + "px";
            }
            else {
                var menuId = "#mainCompMenu" + sectionId;
                var menuElement = $(menuId);
                if (menuElement.length) {
                    //Component menu logic
                    menu.style.left = ($(menuElement).offset().left - 125) + "px";
                    menu.style.top = ($(menuElement).offset().top + 18) + "px";
                }
                else {
                    //Page level menu logic
                    var sec = _g(sectionId);
                    ofs = Util.goff(sec);
                    menu.style.left = (ofs[ 0 ] + sec.offsetWidth - menu.offsetWidth) + "px";
                    menu.style.top = (ofs[ 1 ] + verticalOffset) + "px";
                }
            }
        }
        else {
            Util.Style.acss(menu, "menu-hide");
        }
    }

    function CreateSubTitleText(component) {
        var i18nCore = i18n.discernabu;
        var subTitleText = "";
        var scope = component.getScope();
        var lookbackDays = component.getLookbackDays();
        var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
        var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();

        if (scope > 0) {
            if (lookbackFlag > 0 && lookbackUnits > 0) {
                var replaceText = "";
                switch (lookbackFlag) {
                    case 1:
                        replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookbackUnits);
                        break;
                    case 2:
                        replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookbackUnits);
                        break;
                    case 3:
                        replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookbackUnits);
                        break;
                    case 4:
                        replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookbackUnits);
                        break;
                    case 5:
                        replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookbackUnits);
                        break;
                }

                switch (scope) {
                    case 1:
                        subTitleText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
                        break;
                    case 2:
                        subTitleText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
                        break;
                }

            }
            else {
                switch (scope) {
                    case 1:
                        subTitleText = i18nCore.All_VISITS;
                        break;
                    case 2:
                        subTitleText = i18nCore.SELECTED_VISIT;
                        break;
                }
            }
        }
        return subTitleText;
    }
}();

/**
 * @namespace
 */
MP_Util.Measurement = function() {

    return {
        GetString: function(result, codeArray, dateMask, excludeUOM) {
            var obj = ( result instanceof MP_Core.Measurement) ? result.getResult() : MP_Util.Measurement.GetObject(result, codeArray); //eslint-disable-line new-cap
            if (obj instanceof MP_Core.QuantityValue) {
                if (excludeUOM) {
                    return obj.getValue();
                }
                return obj.toString();
            }
            else if (obj instanceof Date) {
                return obj.format(dateMask);
            }
            return obj;
        },
        GetObject: function(result, codeArray) {
            switch (result.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    return GetQuantityValue(result, codeArray); //eslint-disable-line new-cap
                case "STRING_VALUE":
                    return (GetStringValue(result)); //eslint-disable-line new-cap
                case "DATE_VALUE":
                    //we are currently not returning any date_value results. a common method shall be implemented if/when necessary
                    return (GetDateValue(result)); //eslint-disable-line new-cap
                case "CODIFIED_VALUES":
                case "CODE_VALUE":
                    return (GetCodedResult(result)); //eslint-disable-line new-cap
                case "ENCAPSULATED_VALUE":
                    return (GetEncapsulatedValue(result)); //eslint-disable-line new-cap
            }
        },
        /**
         * @param {Object} num Numeric to format
         * @param {Object} dec Number of decimal places to retain.
         * @deprecated Use mp_formatter.NumericFormatter.
         */
        SetPrecision: function(num, dec) {
            var nf = MP_Util.GetNumericFormatter(); //eslint-disable-line new-cap
            //'^' to not comma seperate values, and '.' for defining the precision
            return nf.format(num, "^." + dec);
        },
        GetModifiedIcon: function(result) {
            return (result.isModified()) ? "<span class='res-modified'>&nbsp;</span>" : "";
        },
        GetNormalcyClass: function(oMeasurement) {
            var normalcy = "res-normal";
            var nc = oMeasurement.getNormalcy();
            if (nc != null) {  //eslint-disable-line eqeqeq
                var normalcyMeaning = nc.meaning;
                if (normalcyMeaning != null) {  //eslint-disable-line eqeqeq
                    if (normalcyMeaning === "LOW") {
                        normalcy = "res-low";
                    }
                    else if (normalcyMeaning === "HIGH") {
                        normalcy = "res-high";
                    }
                    else if (normalcyMeaning === "CRITICAL" || normalcyMeaning === "EXTREMEHIGH" || normalcyMeaning === "PANICHIGH" || normalcyMeaning === "EXTREMELOW" || normalcyMeaning === "PANICLOW" || normalcyMeaning === "VABNORMAL" || normalcyMeaning === "POSITIVE") {
                        normalcy = "res-severe";
                    }
                    else if (normalcyMeaning === "ABNORMAL") {
                        normalcy = "res-abnormal";
                    }
                }
            }
            return normalcy;
        },
        GetNormalcyResultDisplay: function(oMeasurement, excludeUOM) {
            var ar = [ "<span class='", MP_Util.Measurement.GetNormalcyClass(oMeasurement), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>", GetEventViewerLink(oMeasurement, MP_Util.Measurement.GetString(oMeasurement, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(oMeasurement), "</span>" ]; //eslint-disable-line new-cap
            return ar.join("");
        }
    };
    function GetEventViewerLink(oMeasurement, sResultDisplay) {
        var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\"" ];
        var ar = [ "<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", sResultDisplay, "</a>" ];
        return ar.join("");
    }

    function GetEncapsulatedValue(result) {
        var ar = [];
        var encap = result.ENCAPSULATED_VALUE;
        if (encap && encap.length > 0) {
            for (var n = 0, nl = encap.length; n < nl; n++) {
                var txt = encap[ n ].TEXT_PLAIN;
                if (txt != null && txt.length > 0)  //eslint-disable-line eqeqeq
                    ar.push(txt);
            }
        }
        return ar.join("");
    }

    function GetQuantityValue(result, codeArray) {
        var qv = new MP_Core.QuantityValue();
        qv.init(result, codeArray);
        return qv;
    }

    function GetDateValue(result) {
        for (var x = 0, xl = result.DATE_VALUE.length; x < xl; x++) {
            var date = result.DATE_VALUE[ x ];
            if (date.DATE != "") {  //eslint-disable-line eqeqeq
                var dateTime = new Date();
                dateTime.setISO8601(date.DATE);
                return dateTime;
            }
        }
        return null;
    }

    function GetCodedResult(result) {
        var cdValue = result.CODE_VALUE;
        var ar = [];
        for (var n = 0, nl = cdValue.length; n < nl; n++) {
            var values = cdValue[ n ].VALUES;
            for (var p = 0, pl = values.length; p < pl; p++) {
                ar.push(values[ p ].SOURCE_STRING);
            }
            var sOther = cdValue[ n ].OTHER_RESPONSE;
            if (sOther != "")  //eslint-disable-line eqeqeq
                ar.push(sOther);
        }
        return ar.join(", ");
    }

    function GetStringValue(result) {
        var strValue = result.STRING_VALUE;
        var ar = [];
        for (var n = 0, nl = strValue.length; n < nl; n++) {
            ar.push(strValue[ n ].VALUE);
        }
        return ar.join(", ");
    }

}();


/* Listener Event Class */
/*
 * Copyright (c) 2007 	Josh Davis ( http://joshdavis.wordpress.com )
 *
 * Licensed under the MIT License ( http://www.opensource.org/licenses/mit-license.php ) as follows:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/**
 * Create a new instance of Event.
 *
 * @classDescription    This class creates a new Event.
 * @return {Object}    Returns a new Event object.
 * @constructor
 */
function EventListener() { //eslint-disable-line no-redeclare
    this.events = [];
    this.builtinEvts = [];
}

/**
 * Gets the index of the given action for the element
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {Number} Returns an integer.
 */
EventListener.prototype.getActionIdx = function(obj, evt, action, binding) {
    if (obj && evt) {

        var curel = this.events[ obj ][ evt ];
        if (curel) {
            var len = curel.length;
            for (var i = len - 1; i >= 0; i--) {
                if (curel[ i ].action == action && curel[ i ].binding == binding) { //eslint-disable-line eqeqeq
                    return i;
                }
            }
        }
        else {
            return -1;
        }
    }
    return -1;
};

/**
 * Adds a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.addListener = function(obj, evt, action, binding) {
    if (this.events[ obj ]) {
        if (this.events[ obj ][ evt ]) {
            if (this.getActionIdx(obj, evt, action, binding) == -1) { //eslint-disable-line eqeqeq
                var curevt = this.events[ obj ][ evt ];
                curevt[ curevt.length ] = {
                    action: action,
                    binding: binding
                };
            }
        }
        else {
            this.events[ obj ][ evt ] = [];
            this.events[ obj ][ evt ][ 0 ] = {
                action: action,
                binding: binding
            };
        }
    }
    else {
        this.events[ obj ] = [];
        this.events[ obj ][ evt ] = [];
        this.events[ obj ][ evt ][ 0 ] = {
            action: action,
            binding: binding
        };
    }
};

/**
 * Removes a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.removeListener = function(obj, evt, action, binding) {
    if (this.events[ obj ]) {
        if (this.events[ obj ][ evt ]) {
            var idx = this.getActionIdx(obj, evt, action, binding);
            if (idx >= 0) {
                this.events[ obj ][ evt ].splice(idx, 1);
            }
        }
    }
};
/**
 * Removes all listeners for a given object with given binding
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.removeAllListeners = function(obj, binding) {
    if (this.events[ obj ]) {
        for (var el = this.events[ obj ].length; el--;) {
            if (this.events[ obj ][ el ]) {
                for (var ev = this.events[ obj ][ el ].length; ev--;) {
                    if (this.events[ obj ][ el ][ ev ].binding == binding) { //eslint-disable-line eqeqeq
                        this.events[ obj ][ el ].splice(ev, 1);
                    }
                }
            }
        }
    }
};

/**
 * Fires an event
 *
 * @memberOf Event
 * @param e A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
EventListener.prototype.fireEvent = function(e, obj, evt, args) {
    if (!e) {
        e = window.event;
    }

    if (obj && this.events) {
        var evtel = this.events[ obj ];
        if (evtel) {
            var curel = evtel[ evt ];
            if (curel) {
                for (var act = curel.length; act--;) {
                    var action = curel[ act ].action;
                    if (curel[ act ].binding) {
                        action = action.bind(curel[ act ].binding);
                    }
                    action(e, args);
                }
            }
        }
    }
};
CERN_EventListener = new EventListener();

//Constants for event Listener
EventListener.EVENT_CLINICAL_EVENT = 1;
EventListener.EVENT_ORDER_ACTION = 2;
EventListener.EVENT_ADD_DOC = 3;
EventListener.EVENT_PREGNANCY_EVENT = 4;
EventListener.EVENT_COMP_CUSTOMIZE = 5;
EventListener.EVENT_COUNT_UPDATE = 6;
EventListener.EVENT_CRITICAL_UPDATE = 7;
EventListener.EVENT_ERROR_UPDATE = 8;
EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE = 9;
EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT = 10;
EventListener.EVENT_SCRATCHPAD_REMOVED_ORDER_ACTION = 11;
EventListener.EVENT_SCRATCHPAD_RECEIVED_ORDER_ACTION = 12;
EventListener.EVENT_REMOVE_PERSONAL_FAV_FOLDER = 13;
EventListener.EVENT_QOC_VIEW_VENUE_CHANGED = 14;
EventListener.EVENT_SCROLL = 15;
EventListener.EVENT_NAVIGATOR_ERR = 16;
EventListener.EVENT_CONDITIONS_UPDATE = 17;
EventListener.HEALTH_PLANS_RETRIEVED = 18;
EventListener.EVENT_DIAGNOSIS_ADDED = 19;
//Satisfier Event for Gap Check
EventListener.EVENT_SATISFIER_UPDATE = 20;
//Event for the action in contextual view.
EventListener.EVENT_COMPONENT_MOVED_FROM_CONTEXTUAL_VIEW = 21;
//Event for components that are present in the view
EventListener.EVENT_COMPONENTS_IN_VIEW = 22;

// Generated by CoffeeScript 1.6.1
(function() {

  (function($) {
    $.fn.rightClick = function(method) {
      $(this).bind('contextmenu rightclick', function(e) {
        e.preventDefault();
        method.call($(this), e);
        return false;
      });
    };
  })(jQuery);

  $.extend(moment.fn, {
    eom: function(numMonth) {
      if (!numMonth || numMonth > 0) {
        return this.add('M', (numMonth || 0) + 1).date(0).eod();
      } else if (numMonth < 0) {
        return this.subtract('M', Math.abs(numMonth + 1)).date(0).eod();
      }
    },
    som: function(numMonth) {
      if (!numMonth || numMonth > 0) {
        return this.add('M', numMonth || 0).date(1).sod();
      } else if (numMonth < 0) {
        return this.subtract('M', Math.abs(numMonth)).date(1).sod();
      }
    },
    onSameDate: function(moment) {
      return this.year() === moment.year() && this.month() === moment.month() && this.date() === moment.date();
    },
    compareTo: function(moment) {
      var myV, thatV;
      myV = this.valueOf();
      thatV = moment.valueOf();
      if (myV < thatV) {
        return -1;
      } else if (myV > thatV) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  $.extend(Raphael.fn, {
    toArray: function() {
      var arr, bot, hold;
      bot = this.bottom;
      arr = (function() {
        var _results;
        _results = [];
        while (bot) {
          hold = bot;
          bot = bot.next;
          _results.push(hold);
        }
        return _results;
      })();
      return arr;
    }
  });

  $.extend(Raphael.el, {
    zebraStripe: function() {
      this.attr({
        fill: '#DEE7F7',
        opacity: .5,
        stroke: '#DEE7F7',
        'stroke-opacity': 0.5
      });
      return this;
    },
    whiteStroke: function() {
      this.attr({
        stroke: '#FFFFFF'
      });
      return this;
    },
    blackStroke: function() {
      this.attr({
        stroke: '#000000'
      });
      return this;
    },
    blackFill: function() {
      this.attr({
        fill: '#000000'
      });
      return this;
    },
    blackBrush: function() {
      return this.blackStroke().blackFill();
    },
    month: function() {
      this.blackStroke().attr({
        fill: '#F6F6F6'
      });
      return this;
    },
    mLine: function() {
      this.attr({
        stroke: '#D0D0D0'
      });
      return this;
    },
    today: function() {
      this.attr({
        stroke: '#FDD703',
        'stroke-dasharray': '-',
        'stroke-width': 2
      });
      return this;
    },
    text: function() {
      this.attr({
        cursor: 'default',
        fill: '#000000',
        'font-family': 'Tahoma',
        'font-size': 10
      });
      return this;
    },
    largeText: function() {
      this.text().attr({
        'font-size': 12
      });
      return this;
    },
    anchorStart: function() {
      this.text().attr({
        'text-anchor': 'start'
      });
      return this;
    },
    bold: function() {
      this.attr({
        'font-weight': 'bold'
      });
      return this;
    },
    title: function() {
      this.anchorStart().bold().attr({
        'font-size': 14
      });
      return this;
    },
    blueStroke: function() {
      this.attr({
        stroke: '#5289C7'
      });
      return this;
    },
    blueFill: function() {
      this.attr({
        fill: '#5289C7'
      });
      return this;
    },
    blueBrush: function() {
      return this.blueStroke().blueFill();
    },
    future: function() {
      this.attr({
        opacity: 0.5
      });
      return this;
    },
    grayStroke: function() {
      this.attr({
        stroke: '#A09F9F'
      });
      return this;
    },
    grayFill: function() {
      this.attr({
        fill: '#A09F9F'
      });
      return this;
    },
    grayBrush: function() {
      return this.grayStroke().grayFill();
    },
    response: function() {
      this.attr({
        fill: '#F57F20',
        stroke: '#F57F20'
      });
      return this;
    }
  });

  registerNS('com.cerner.oncology.timeline');

  com.cerner.oncology.timeline.Month = (function() {

    function Month(start) {
      this.start = start.clone().som();
      this.end = this.start.clone().eom();
      this.daysInMonth = this.start.daysInMonth();
      this.label = this.start.format('MMM YYYY').toUpperCase();
    }

    Month.prototype.toString = function() {
      return this.start.toString();
    };

    return Month;

  })();

  com.cerner.oncology.timeline.Calendar = (function() {

    function Calendar() {
      this.months = [];
      this.mWidths = [];
      this.padding = 4;
      this.height = 18;
      this.textY = this.height / 2 - 1;
      this.ns = com.cerner.oncology.timeline;
    }

    Calendar.prototype.draw = function() {
	   $('#ht4QbG-2').empty();	
	  
      var drawMonths, setCalendarMonths,
        _this = this;
      this.mWidths = [];
      this.months = [];
	  this.paper = Raphael($('#ht4QbG-2')[0], this.ns.width, this.height);
	  this.paper.clear();
      setCalendarMonths = function() {
        var baseWidth, diff, i, mom, _i, _ref;
		if( _this.ns.startDate == null)
		    return;
        mom = _this.ns.startDate.clone();
        baseWidth = _this.ns.width / _this.ns.monthRange;
        diff = _this.ns.width;
        for (i = _i = 1, _ref = _this.ns.monthRange; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          _this.mWidths.push((i === _this.ns.monthRange ? diff : baseWidth));
          _this.months.push(new _this.ns.Month(mom));
          diff -= baseWidth;
          mom.add('M', 1);
        }
      };
      drawMonths = function() {
        var paper;
        $('#ht4QbG-27').empty();
        paper = Raphael($('#ht4QbG-27')[0], _this.ns.width, _this.height);
        _.each([_this.paper, paper], function(paper) {
          var i, m, rect, width, _i, _len, _ref;
          _ref = _this.months;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            m = _ref[i];
            width = _this.mWidths[i];
            rect = paper.rect(i * width, 0, width, _this.height);
            rect.month();
            paper.text(i * width + width / 2, _this.textY, m.label).largeText();
          }
        });
      };
      setCalendarMonths();
      drawMonths();
    };

    Calendar.prototype.delineate = function(paper) {
      var height, sum, width, _i, _len, _ref;
      sum = 0;
      height = paper.height;
      _ref = this.mWidths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        width = _ref[_i];
        paper.path("M" + sum + " 0 L" + sum + " " + height).mLine().toBack();
        sum += width;
      }
      paper.path("M" + sum + " 0 L" + sum + " " + height).mLine().toBack();
      return paper;
    };

    Calendar.prototype.getX = function(date) {
      var dayPercent, format, i, m, mOffset, mom, step, width, x, _i, _len, _ref;
      if (!date) {
        return 0;
      }
      x = mOffset = 0;
      mom = moment(date);
      format = mom.format('MMM YYYY').toUpperCase();
      _ref = this.months;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        m = _ref[i];
        width = this.mWidths[i];
        if (i) {
          mOffset += this.mWidths[i - 1];
        }
        if (m.label === format) {
          dayPercent = mom.date() / m.daysInMonth;
          step = width * dayPercent;
          x = mOffset + step - this.padding;
          break;
        }
      }
      return x;
    };

    Calendar.prototype.now = function(paper) {
      var nowIn, nowX, padding, x,
        _this = this;
      nowX = function() {
        return _this.getX(com.cerner.oncology.timeline.date);
      };
      x = nowX();
      nowIn = function() {
        return x !== 0;
      };
      padding = this.padding / 2;
      if (nowIn()) {
        paper.path("M" + (x + padding) + " 0 L" + (x + padding) + " " + paper.height).today().toBack();
      }
      return paper;
    };

    return Calendar;

  })();

  com.cerner.oncology.timeline.ChemoDate = (function() {

    function ChemoDate(json) {
      this.ns = com.cerner.oncology.timeline;
      this.width = this.ns.calendar.padding;
      this.plans = [];
      this.responses = [];
      if (json.PLAN_ID != null) {
        this.plans.push(new this.ns.Plan(json));
        this.str = this.plans[0].getStart().format('YYYY-MM-DD');
      } else {
        this.responses.push(new this.ns.Response(json));
        this.str = moment(this.responses[0].CHART_DATE).format('YYYY-MM-DD');
      }
    }

    ChemoDate.prototype.toString = function() {
      return this.str;
    };

    ChemoDate.prototype.onSameDate = function(str) {
      return moment(this.str).onSameDate(moment(str));
    };

    ChemoDate.prototype.contains = function(id, isPlan) {
      var array, item, thatId, _i, _len;
      thatId = id.removeTrailingZeros();
      array = isPlan ? this.plans : this.responses;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (item.id === thatId) {
          return true;
        }
      }
      return false;
    };

    ChemoDate.prototype.addPlan = function(json) {
      var added, sort,
        _this = this;
      sort = function() {
        _this.plans.sort(function(a, b) {
          return moment(a.start).compareTo(moment(b.start));
        });
        _this.plans.reverse();
      };
      added = this.onSameDate(json.START_DATE) && !this.contains(json.PLAN_ID, true);
      if (added) {
        this.plans.push(new this.ns.Plan(json));
        sort();
      }
      return added;
    };

    ChemoDate.prototype.addResponse = function(json) {
      var added, sort,
        _this = this;
      sort = function() {
        _this.responses.sort(function(a, b) {
          return moment(a.date).compareTo(moment(b.date));
        });
        _this.responses.reverse();
      };
      added = this.onSameDate(json.CHART_DATE) && !this.contains(json.REGIMEN_DETAIL_ID, false);
      if (added) {
        this.responses.push(new this.ns.Response(json));
        sort();
      }
      return added;
    };

    ChemoDate.prototype.getPlans = function() {
      return this.plans[0];
    };

    ChemoDate.prototype.getResponses = function() {
      return this.responses[0];
    };

    return ChemoDate;

  })();

  com.cerner.oncology.timeline.Response = (function() {

    function Response(json) {
      this.id = json.REGIMEN_DETAIL_ID.removeTrailingZeros();
      this.name = json.RESPONSE_DISP;
      this.text = json.RESPONSE_TEXT;
      this.date = json.CHART_DATE;
	  this.timeZone = "";
	  if(json.TIMEZONE)
	  {
		  this.timeZone = json.TIMEZONE;
	  }
      this.by = json.CHART_PRSNL_NAME;
    }

    Response.prototype.getDateDisplay = function() {
      return moment(this.date).format('L LT');
    };

    Response.prototype.getChartedDisplay = function() {
      return ("" + i18n.oncology.timeline.view.CHARTED_ON + ": ") + this.getDateDisplay()  + " " + this.timeZone + (", " + i18n.oncology.timeline.view.BY + " ") + this.by + '.';
    };

    Response.prototype.getTextDisplay = function() {
      if (this.text.length < 256) {
        return this.text;
      } else {
        return this.text.substr(0, 251) + '...';
      }
    };

    Response.prototype.getPopupText = function() {
      return this.name + '. ' + this.getTextDisplay() + ' ' + this.getChartedDisplay();
    };

    return Response;

  })();

  com.cerner.oncology.timeline.Plan = (function() {

    function Plan(json) {
      this.id = json.PLAN_ID.removeTrailingZeros();
      this.name = json.NAME;
      this.start = json.START_DATE;
      this.startEst = json.START_EST_IND === 1;
      this.stop = json.END_DATE;
      this.stopEst = json.END_EST_IND === 1;
      this.status = json.STATUS_DISP;
      this.statusMean = json.STATUS_MEAN;
    }

    Plan.prototype.color = function(el) {
      if (_.indexOf(['DONE', 'CANCELED'], this.statusMean) !== -1) {
        if (el.type === 'rect') {
          el.grayBrush();
        } else {
          el.grayFill();
        }
      } else {
        if (el.type === 'rect') {
          el.blueBrush();
        } else {
          el.blueFill();
        }
      }
      if (/pending/i.test(this.status)) {
        el.future();
      }
    };

    Plan.prototype.getId = function() {
      return this.id;
    };

    Plan.prototype.getName = function() {
      return this.name;
    };

    Plan.prototype.getStart = function() {
      return moment(this.start);
    };

    Plan.prototype.getStartDisplay = function() {
      var format;
      format = this.getStart().format('L');
      if (this.startEst) {
        return "*Est. " + format;
      } else {
        return format;
      }
    };

    Plan.prototype.getStop = function() {
      if (this.stop) {
        return moment(this.stop);
      } else {
        return null;
      }
    };

    Plan.prototype.getStopDisplay = function() {
      var format, stop;
      stop = this.getStop();
      if (stop) {
        format = stop.format('L');
        if (this.stopEst) {
          return "*Est. " + format;
        } else {
          return format;
        }
      } else {
        return '';
      }
    };

    Plan.prototype.getStatus = function() {
      return this.status;
    };

    return Plan;

  })();

  com.cerner.oncology.timeline.Regimen = (function() {

    function Regimen(json, chemo) {
      this.ns = com.cerner.oncology.timeline;
      this.id = json.REGIMEN_ID.removeTrailingZeros();
      this.name = json.NAME;
      this.orderedAs = json.ORDERED_AS;
      this.status = json.STATUS_DISP;
      this.start = json.START_DATE;
      this.startEst = json.START_EST_IND === 1;
      this.stop = json.END_DATE;
      this.months = [];
      if (this.ns.displayPlans) {
        chemo.addData(json.PLANS, this.months);
      }
      if (this.ns.displayResponses) {
        chemo.addData(json.RESPONSES, this.months);
      }
    }

    Regimen.prototype.getId = function() {
      return this.id;
    };

    Regimen.prototype.getName = function() {
      return this.name;
    };

    Regimen.prototype.getOrderedAs = function() {
      return this.orderedAs;
    };

    Regimen.prototype.getStart = function() {
      return moment(this.start);
    };

    Regimen.prototype.getStartDisplay = function() {
      var format;
      format = this.getStart().format('L');
      if (this.startEst) {
        return "*Est. " + format;
      } else {
        return format;
      }
    };

    Regimen.prototype.getStop = function() {
      if (this.stop) {
        return moment(this.stop);
      } else {
        return null;
      }
    };

    Regimen.prototype.getStopDisplay = function() {
      var stop;
      stop = this.getStop();
      if (stop) {
        return stop.format('L');
      } else {
        return '';
      }
    };

    Regimen.prototype.getStatus = function() {
      return this.status;
    };

    Regimen.prototype.drawMe = function() {
      var myStart, myStop, viewStart, viewStop, _ref;
	   if(this.getStart()  != null)
      myStart = this.getStart().valueOf();
      myStop = ((_ref = this.getStop()) != null ? _ref.valueOf() : void 0) || moment('12/31/2100').valueOf();
     if(this.ns.calendar.months[0].start !=null)
	     viewStart = this.ns.calendar.months[0].start.valueOf();
	 if(_.last(this.ns.calendar.months).end !=null)
      viewStop = _.last(this.ns.calendar.months).end.valueOf();
      return (myStart <= viewStart && myStop > viewStart) || (viewStart <= myStart && myStart <= viewStop);
    };

    Regimen.prototype.color = function(el) {
      if (/DISCONTINUED/i.test(this.status)) {
        if (el.type === 'rect') {
          el.grayBrush();
        } else {
          el.grayFill();
        }
      } else {
        if (el.type === 'rect') {
          el.blueBrush();
        } else {
          el.blueFill();
        }
      }
    };

    return Regimen;

  })();

  com.cerner.oncology.timeline.Chemotherapy = (function() {

    function Chemotherapy(label) {
      var labelDiv;
      this.label = label;
      this.label || (this.label = 'Chemotherapy');
      this.ns = com.cerner.oncology.timeline;
      this.height = 100;
      this.labelPaperHeight = 25;
      this.objectHeight = this.ns.calendar.padding;
      this.objectPaperHeight = 7 * this.objectHeight;
      this.months = [];
      this.reggies = [];
      labelDiv = $(document.createElement('div')).height(this.labelPaperHeight - 3);
      $(labelDiv).css('position', 'relative');
      $('#ht4QbG-3').after(labelDiv);
	  $(labelDiv).empty();
	  this.labelPaper = Raphael($(labelDiv)[0], this.ns.paperWidth, this.labelPaperHeight);
      this.labelBox = null;
      this.loader = $(document.createElement('div')).addClass('spinner-ht4QbG');
      this.loader = $(this.loader).appendTo(labelDiv).css({
        height: $(labelDiv).height(),
        width: $(labelDiv).width()
      });
      this.spinner = new Spinner({
        lines: 13,
        length: 3,
        width: 2,
        radius: 5,
        rotate: 0,
        color: '#FFFFFF',
        speed: 1,
        trail: 60,
        shadow: false,
        hwaccel: false,
        className: 'spinner',
        zIndex: 2e9,
        top: $(labelDiv).height() / 2 - 10,
        left: $(labelDiv).width() / 2 - 10
      }).spin($(this.loader)[0]);
      this.noResultsMsg = null;
      this.noRegimens = false;
      this.noOrphans = false;
    }

    Chemotherapy.prototype.load = function() {
      $(this.loader).show();
    };

    Chemotherapy.prototype.unload = function() {
      $(this.loader).hide();
    };

    Chemotherapy.prototype.removeNoResultsMessage = function() {
      if (this.noResultsMsg != null) {
        this.noResultsMsg.remove();
        this.noResultsMsg = null;
      }
    };

    Chemotherapy.prototype.noResults = function(text) {
      if (!this.noResultsMsg) {
        this.noResultsMsg = this.labelPaper.text(this.labelBox.x2 + 5, this.labelBox.y2 - 8, text).anchorStart();
      }
    };

    Chemotherapy.prototype.getDisplayData = function(map, getPlans) {
      var arr, data, day, days, key, m, _i, _j, _len, _len1, _ref;
      data = [];
      _ref = this.ns.calendar.months;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        key = m.label;
        days = map[key] || [];
        for (_j = 0, _len1 = days.length; _j < _len1; _j++) {
          day = days[_j];
          arr = getPlans ? day.getPlans() : day.getResponses();
          if (arr) {
            data = data.concat(arr);
          }
        }
      }
      return data;
    };

    Chemotherapy.prototype.addData = function(arr, map) {
      var contains, day, days, isNew, isSameDay, json, key, mom, momStr, _i, _j, _len, _len1;
      if (arr != null ? arr.length : void 0) {
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          json = arr[_i];
          isNew = true;
          mom = moment(json.START_DATE || json.CHART_DATE);
          momStr = mom.format('YYYY-MM-DD');
          key = mom.format('MMM YYYY').toUpperCase();
          days = map[key] || [];
          for (_j = 0, _len1 = days.length; _j < _len1; _j++) {
            day = days[_j];
            isSameDay = day.toString() === momStr;
            if (isSameDay) {
              if (json.PLAN_ID) {
                contains = day.contains(json.PLAN_ID, true);
                if (!contains) {
                  day.addPlan(json);
                }
                isNew = false;
                break;
              } else {
                contains = day.contains(json.REGIMEN_DETAIL_ID, false);
                if (!contains) {
                  day.addResponse(json);
                }
                isNew = false;
                break;
              }
            }
          }
          if (isNew) {
            days.push(new this.ns.ChemoDate(json));
          }
          days.sort(function(a, b) {
            return moment(a.toString()).compareTo(moment(b.toString()));
          });
          map[key] = days;
        }
      }
    };

    Chemotherapy.prototype.drawPlans = function(divBefore, plans) {
      var bbox, createHovers, diamond, div, el, height, i, length, paper, paperEdge, plan, rect, rectBBox, text, textBBox, tuples, _i, _j, _len, _len1,
        _this = this;
      tuples = [];
      createHovers = function() {
        var diamond, hIn, hOut, i, idx, plan, text, textHoverEl, _i, _len;
        hIn = function(p) {
          return function(e) {
            $('#ht4QbG-14').text(p.getName());
            $('#ht4QbG-18').text(p.getStatus());
            $('#ht4QbG-15').text(p.getStartDisplay());
            $('#ht4QbG-16').text(p.getStopDisplay());
            $('#ht4QbG-13').show();
            com.cerner.oncology.util.positionPopup($('#ht4QbG-13'), e);
          };
        };
        for (i = _i = 0, _len = plans.length; _i < _len; i = ++_i) {
          plan = plans[i];
          idx = i * 2;
          diamond = tuples[idx];
          text = tuples[idx + 1];
          hOut = function() {
            $('#ht4QbG-13').hide();
          };
          diamond.hover(hIn(plan), hOut, _this, _this);
          if (text) {
            textHoverEl = _this.ns.getTextHoverArea(text, paper);
            textHoverEl.hover(hIn(plan), hOut, _this, _this);
          }
        }
      };
      if (plans.length) {
        height = plans.length > 1 ? this.objectPaperHeight : this.objectPaperHeight / 2;
        div = $(document.createElement('div')).addClass('chemo-ht4QbG').height(height);
        $(divBefore).after(div);
		$(div).empty();
        paper = Raphael($(div)[0], this.ns.width, height);
        this.ns.preparePaper(paper, false);
        for (i = _i = 0, _len = plans.length; _i < _len; i = ++_i) {
          plan = plans[i];
          diamond = paper.rect(this.ns.calendar.getX(plan.getStart()), 6 + (i % 2 ? 3 * this.objectHeight : 0), this.objectHeight, this.objectHeight);
          diamond.transform('r45');
          plan.color(diamond);
          bbox = diamond.getBBox();
          text = paper.text(bbox.x2 + 5, bbox.y + this.objectHeight / 2, plan.name).anchorStart();
          plan.color(text);
          tuples.push(diamond, text);
        }
        length = tuples.length;
        rect = paper.rect(0, 0, paper.width, paper.height);
        paperEdge = rect.getBBox().x2;
        rect.remove();
        for (i = _j = 0, _len1 = tuples.length; _j < _len1; i = ++_j) {
          el = tuples[i];
          if (i % 2) {
            textBBox = el.getBBox();
            if (i + 3 < length) {
              rectBBox = tuples[i + 3].getBBox();
              if (textBBox.x2 >= rectBBox.x) {
                text = this.ns.redrawText(el, rectBBox.x, paper);
                tuples[i] = text;
              }
            } else if (textBBox.x2 >= paperEdge) {
              text = this.ns.redrawText(el, paperEdge, paper);
              tuples[i] = text;
            }
          }
        }
        createHovers();
      }
      return div;
    };

    Chemotherapy.prototype.drawResponses = function(divBefore, responses) {
      var bbox, box, div, hIn, hOut, paper, paperEdge, prevDiv, rect, response, text, textHoverEl, _i, _len;
      hIn = function(r) {
        return function(e) {
          $('#ht4QbG-29').text(r.getPopupText());
          $('#ht4QbG-28').show();
          com.cerner.oncology.util.positionPopup($('#ht4QbG-28'), e);
        };
      };
      hOut = function() {
        $('#ht4QbG-28').hide();
      };
      if (responses.length) {
        prevDiv = null;
        paperEdge = null;
        for (_i = 0, _len = responses.length; _i < _len; _i++) {
          response = responses[_i];
          div = $(document.createElement('div')).addClass('chemo-ht4QbG').height(this.objectPaperHeight / 2);
          $(prevDiv || divBefore).after(div);
          prevDiv = div;
		  $(div).empty();
          paper = Raphael($(div)[0], this.ns.width, this.objectPaperHeight);
          this.ns.preparePaper(paper, false);
          if (!paperEdge) {
            box = paper.rect(0, 0, paper.width, paper.height);
            paperEdge = box.getBBox().x2;
            box.remove();
          }
          rect = paper.rect(this.ns.calendar.getX(response.date), 4, this.objectHeight, this.objectHeight).response();
          bbox = rect.getBBox();
          text = paper.text(bbox.x2 + 5, bbox.y + this.objectHeight / 2 - 1, response.name).anchorStart();
          text.bold();
          if (text.getBBox().x2 >= paperEdge) {
            text = this.ns.redrawText(text, paperEdge, paper);
          }
          rect.hover(hIn(response), hOut, this, this);
          if (text) {
            textHoverEl = this.ns.getTextHoverArea(text, paper);
            textHoverEl.hover(hIn(response), hOut, this, this);
          }
        }
      }
      return div;
    };

    Chemotherapy.prototype.drawRegimen = function(regimen) {
      var area, bar, bbox, div, divs, hIn, hOut, paper, planDiv, text, textHoverEl, width, x1, x2;
      div = $(document.createElement('div')).addClass('chemo-ht4QbG').height(this.objectPaperHeight);
      divs = $('.chemo-ht4QbG');
      if (divs.length) {
        $(divs).last().after(div);
      } else {
        $(this.labelPaper.canvas).parent().after(div);
      }
      paper = Raphael($(div)[0], this.ns.width, this.objectPaperHeight);
      this.ns.preparePaper(paper, false);
      area = paper.rect(0, 0, paper.width, paper.height);
      bbox = area.getBBox();
      area.remove();
      x1 = this.ns.calendar.getX(regimen.start) || bbox.x;
      x2 = this.ns.calendar.getX(regimen.stop) || bbox.x2;
      width = x2 - x1;
      width = width === 0 ? this.objectHeight : width;
      bar = paper.rect(x1, paper.height - this.objectHeight, width, this.objectHeight);
      text = paper.text(x1, paper.height - this.objectHeight - 8, regimen.name).anchorStart();
      text = this.ns.redrawText(text, bbox.x2, paper);
      regimen.color(bar);
      if (text) {
        regimen.color(text);
      }
      hIn = function(r) {
        return function(e) {
          $('#ht4QbG-20').text(r.getName());
          $('#ht4QbG-21').text(r.getOrderedAs());
          if (r.getOrderedAs()) {
            $('#ht4QbG-25').show();
          } else {
            $('#ht4QbG-25').hide();
          }
          $('#ht4QbG-22').text(r.getStatus());
          $('#ht4QbG-23').text(r.getStartDisplay());
          $('#ht4QbG-24').text(r.getStopDisplay());
          $('#ht4QbG-19').show();
          com.cerner.oncology.util.positionPopup($('#ht4QbG-19'), e);
        };
      };
      hOut = function() {
        $('#ht4QbG-19').hide();
      };
      bar.hover(hIn(regimen), hOut, this, this);
      if (text) {
        textHoverEl = this.ns.getTextHoverArea(text, paper);
        textHoverEl.hover(hIn(regimen), hOut, this, this);
      }
      planDiv = this.drawPlans(div, this.getDisplayData(regimen.months, true));
      this.drawResponses(planDiv || div, this.getDisplayData(regimen.months, false));
    };

    Chemotherapy.prototype.orphanPlans = function(arr) {
      var plans;
      this.addData(arr, this.months);
      plans = this.getDisplayData(this.months, true);
      this.noOrphans = plans.length === 0;
      if (plans.length) {
        this.drawPlans($(this.labelPaper.canvas).parent(), plans);
      }
    };

    Chemotherapy.prototype.regimens = function(arr) {
      var found, noneDrawn, regimen, _i, _j, _len, _len1, _ref;
      if (arr != null ? arr.length : void 0) {
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          regimen = arr[_i];
          found = _.find(this.reggies, (function(r) {
            return r.getId() === regimen.REGIMEN_ID.removeTrailingZeros();
          }), this);
          if (found) {
            if (this.ns.displayPlans) {
              this.addData(regimen.PLANS, found.months);
            }
            if (this.ns.displayResponses) {
              this.addData(regimen.RESPONSES, found.months);
            }
          } else {
            this.reggies.push(new this.ns.Regimen(regimen, this));
          }
        }
        this.reggies.sort(function(a, b) {
          var aStart, bStart;
		  if(a.getStart() !=null)
          aStart = a.getStart().valueOf();
	     if(b.getStart() !=null)
          bStart = b.getStart().valueOf();
          if (aStart < bStart) {
            return -1;
          } else if (aStart > bStart) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      noneDrawn = true;
      _ref = this.reggies;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        regimen = _ref[_j];
        if (regimen.drawMe()) {
          this.drawRegimen(regimen);
          noneDrawn = false;
        }
      }
      this.noRegimens = noneDrawn;
    };

    Chemotherapy.prototype.draw = function(start, end) {
      var label, opts, reply,
        _this = this;
      this.labelPaper.clear();
      this.removeNoResultsMessage();
      this.ns.preparePaper(this.labelPaper, false);
      label = this.labelPaper.text(5, 10, this.label).title();
      this.labelBox = label.getBBox();
      $('.chemo-ht4QbG').remove();
      reply = function(json) {
        if (json.DATA.ERRORCONDITIONS.NOBEDROCKSECTIONBUILD) {
          _this.noResults(i18n.oncology.timeline.view.NO_FILTERS_DEFINED);
        } else {
          if (_this.ns.displayPlans) {
            _this.orphanPlans(json.DATA.PLANS);
          } else {
            _this.noOrphans = true;
          }
          if (_this.ns.displayRegimens) {
            _this.regimens(json.DATA.REGIMENS);
          } else {
            _this.noRegimens = true;
          }
          if (_this.noOrphans && _this.noRegimens) {
            _this.noResults(i18n.NO_RESULTS_FOUND);
          }
        }
        _this.unload();
        $('#ht4QbG-30').height(com.cerner.oncology.util.getViewportHeight() - com.cerner.oncology.util.getHeight($('#ht4QbG-31')));
      };
      if (start) {
        opts = "^MINE^,value($PAT_Personid$),value($USR_PersonId$),value($PAT_PPRCode$),^" + start + "^,^" + end + "^,0";
        com.cerner.mpage.call('onc_tlv_get_regimens_plans', reply)(opts);
      } else {
        if (this.ns.displayPlans) {
          this.orphanPlans();
        } else {
          this.noOrphans = true;
        }
        if (this.ns.displayRegimens) {
          this.regimens();
        } else {
          this.noRegimens = true;
        }
        if (this.noOrphans && this.noRegimens) {
          this.noResults(i18n.NO_RESULTS_FOUND);
        }
        this.unload();
        $('#ht4QbG-30').height(com.cerner.oncology.util.getViewportHeight() - com.cerner.oncology.util.getHeight($('#ht4QbG-31')));
      }
    };

    return Chemotherapy;

  })();

  com.cerner.oncology.timeline.Result = (function() {

    function Result(label, eventSetName, displayUnit, shouldStripe) {
      var labelDiv, paperDiv;
      this.label = label;
      this.eventSetName = eventSetName;
      this.displayUnit = displayUnit;
      this.shouldStripe = shouldStripe;
      this.label || (this.label = 'Result');
      this.displayUnit || (this.displayUnit = false);
      this.ns = com.cerner.oncology.timeline;
      this.months = [];
      this.height = 100;
      this.labelBox = null;
      this.labelPaperHeight = 25;
      this.hiddenMsg = null;
      this.noResultsMsg = null;
      labelDiv = $(document.createElement('div')).height(this.labelPaperHeight);
      paperDiv = $(document.createElement('div')).css({
        height: this.height,
        position: 'relative'
      });
      $('#footer-ht4QbG').before(labelDiv);
      $('#footer-ht4QbG').before(paperDiv);
	  $(labelDiv).empty();
      this.labelPaper = Raphael($(labelDiv)[0], this.ns.paperWidth, this.labelPaperHeight);
	   $(paperDiv).empty();
      this.paper = Raphael($(paperDiv)[0], this.ns.paperWidth, this.height);
      this.loader = $(document.createElement('div')).addClass('spinner-ht4QbG');
      this.loader = $(this.loader).appendTo(paperDiv).css({
        height: $(paperDiv).height(),
        width: $(paperDiv).width()
      });
      this.spinner = new Spinner({
        lines: 13,
        length: 3,
        width: 2,
        radius: 5,
        rotate: 0,
        color: '#FFFFFF',
        speed: 1,
        trail: 60,
        shadow: false,
        hwaccel: false,
        className: 'spinner',
        zIndex: 2e9,
        top: $(paperDiv).height() / 2 - 10,
        left: $(paperDiv).width() / 2 - 10
      }).spin($(this.loader)[0]);
    }

    Result.prototype.load = function() {
      $(this.loader).show();
    };

    Result.prototype.unload = function() {
      $(this.loader).hide();
    };

    Result.prototype.removeNoResultsMessage = function() {
      if (this.noResultsMsg != null) {
        this.noResultsMsg.remove();
        this.noResultsMsg = null;
      }
    };

    Result.prototype.noResults = function(text) {
      this.removeHideMessage();
      if (!this.noResultsMsg) {
        this.noResultsMsg = this.labelPaper.text(this.labelBox.x2 + 5, this.labelBox.y2 - 8, text).anchorStart();
      }
    };

    Result.prototype.removeHideMessage = function() {
      if (this.hiddenMsg != null) {
        this.hiddenMsg.next.remove();
        this.hiddenMsg.remove();
        this.hiddenMsg = null;
      }
    };

    Result.prototype.unhidePoints = function() {
      var day, days, key, m, _i, _j, _len, _len1, _ref;
      _ref = this.ns.calendar.months;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        key = m.label;
        days = this.months[key] || [];
        for (_j = 0, _len1 = days.length; _j < _len1; _j++) {
          day = days[_j];
          day.unhide();
        }
      }
      this.removeHideMessage();
      this.draw();
    };

    Result.prototype.hiddenPoints = function() {
      var bbox, line, textRect;
      this.removeNoResultsMessage();
      if (!this.hiddenMsg) {
        this.hiddenMsg = this.labelPaper.text(this.labelBox.x2 + 5, this.labelBox.y2 - 8, i18n.oncology.timeline.view.SHOW_HIDDEN_RESULTS).anchorStart();
        bbox = this.hiddenMsg.getBBox();
        line = this.labelPaper.path("M" + (bbox.x + 2) + " " + bbox.y2 + " L" + (bbox.x2 - 2) + " " + bbox.y2);
        line.blueBrush();
        this.hiddenMsg.blueFill().attr({
          cursor: 'pointer'
        });
        textRect = this.ns.getTextHoverArea(this.hiddenMsg, this.labelPaper);
        textRect.attr({
          cursor: 'pointer'
        });
        textRect.click((function() {
          this.unhidePoints();
        }), this);
      }
    };

    Result.prototype.draw = function(start, end) {
      var collision, drawDays, findLimits, label, limits, reply,
        _this = this;
      this.removeHideMessage();
      this.removeNoResultsMessage();
      _.each([this.labelPaper, this.paper], (function(p) {
        p.clear();
        this.ns.preparePaper(p, this.shouldStripe);
      }), this);
      label = this.labelPaper.text(5, 10, this.label).title();
      this.labelBox = label.getBBox();
      if (!this.eventSetName) {
        this.noResults(i18n.oncology.timeline.view.NO_FILTERS_DEFINED);
        return;
      }
      limits = null;
      collision = function() {
        var collides, i, j, p, paperWidth, points, t, tb, texts, u, _i, _j, _k, _l, _len, _len1, _len2, _len3;
        collides = function(a, b) {
          var abox, ax, ax2, ay, ay2, bY, bbox, bx, bx2, by2, offset;
          abox = a.getBBox();
          bbox = b.getBBox();
          ax = abox.x;
          ax2 = abox.x2;
          offset = 2;
          ay = abox.y;
          if (a.type === 'text') {
            ay += offset;
          }
          ay2 = abox.y2;
          if (a.type === 'text') {
            ay2 -= offset;
          }
          bx = bbox.x;
          bx2 = bbox.x2;
          bY = bbox.y;
          if (b.type === 'text') {
            bY += offset;
          }
          by2 = bbox.y2;
          if (b.type === 'text') {
            by2 -= offset;
          }
          return (((ax < bx && bx < ax2)) && (((ay <= bY && bY <= ay2)) || ((ay <= by2 && by2 <= ay2)))) || (((ax < bx2 && bx2 < ax2)) && (((ay <= bY && bY <= ay2)) || ((ay <= by2 && by2 <= ay2))));
        };
        paperWidth = _this.ns.width;
        points = _.filter(_this.paper.toArray(), function(el) {
          return el.type === 'rect' && (el.getBBox().x !== 0 && el.getBBox().x2 !== paperWidth);
        });
        texts = _.filter(_this.paper.toArray(), function(el) {
          return el.type === 'text';
        });
        for (_i = 0, _len = texts.length; _i < _len; _i++) {
          t = texts[_i];
          tb = t.getBBox();
          if (tb.x < 0 || tb.x2 > paperWidth) {
            t.remove();
            continue;
          }
          for (_j = 0, _len1 = points.length; _j < _len1; _j++) {
            p = points[_j];
            if (collides(t, p)) {
              t.remove();
              break;
            }
          }
        }
        texts = _.filter(_this.paper.toArray(), function(el) {
          return el.type === 'text';
        });
        for (i = _k = 0, _len2 = texts.length; _k < _len2; i = ++_k) {
          t = texts[i];
          for (j = _l = 0, _len3 = texts.length; _l < _len3; j = ++_l) {
            u = texts[j];
            if (i !== j && u.type === 'text') {
              if (collides(t, u)) {
                t.remove();
                break;
              }
            }
          }
        }
      };
      drawDays = function() {
        var coords, day, days, isHidden, key, line, m, numDrawn, oldCoords, _i, _j, _len, _len1, _ref;
        oldCoords = null;
        numDrawn = 0;
        isHidden = false;
        _ref = _this.ns.calendar.months;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          key = m.label;
          days = _this.months[key] || [];
          for (_j = 0, _len1 = days.length; _j < _len1; _j++) {
            day = days[_j];
            if (!day.isHidden()) {
              coords = day.draw(limits);
              if (coords) {
                numDrawn += 1;
              }
              if (oldCoords && coords) {
                line = _this.paper.path("M" + oldCoords.x + " " + oldCoords.y + " L" + coords.x + " " + coords.y);
                line.blueBrush().toBack();
              }
              if (coords) {
                oldCoords = coords;
              }
            } else {
              isHidden = true;
            }
          }
        }
        if (isHidden) {
          _this.hiddenPoints();
        }
        if (numDrawn > 1) {
          collision();
        } else if (numDrawn === 0 && !isHidden) {
          _this.noResults(i18n.NO_RESULTS_FOUND);
        }
      };
      findLimits = function() {
        var day, days, high, key, low, m, values, y, _i, _j, _len, _len1, _ref;
        values = [];
        _ref = _this.ns.calendar.months;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          key = m.label;
          days = _this.months[key] || [];
          if (days.length !== 0) {
            for (_j = 0, _len1 = days.length; _j < _len1; _j++) {
              day = days[_j];
              if (!day.isHidden()) {
                y = day.getY();
                values.push(y);
              } else {
                _this.hiddenPoints();
              }
            }
          }
        }
        high = Math.max.apply(_this, values);
        low = Math.min.apply(_this, values);
        limits = high !== Number.POSITIVE_INFINITY ? [low, high] : [0, 0];
        drawDays();
      };
      reply = function(json) {
        var contains, day, days, isNew, isSameDay, key, mom, momStr, result, _i, _j, _len, _len1, _ref;
        if (json.EVENTS.RESULTS.length) {
          _ref = json.EVENTS.RESULTS;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            result = _ref[_i];
            isNew = true;
            mom = moment(result.EFFECTIVE_DATE);
            key = mom.format('MMM YYYY').toUpperCase();
            momStr = mom.format('YYYY-MM-DD');
            days = _this.months[key] || [];
            for (_j = 0, _len1 = days.length; _j < _len1; _j++) {
              day = days[_j];
              isSameDay = day.toString() === momStr;
              if (isSameDay) {
                contains = day.contains(result.EVENT_ID);
                if (!contains) {
                  day.addPoint(result);
                }
                isNew = false;
                break;
              }
            }
            if (isNew) {
              days.push(new _this.ns.ResultDate(_this, result));
            }
            days.sort(function(a, b) {
              return moment(a.toString()).compareTo(moment(b.toString()));
            });
            _this.months[key] = days;
          }
        }
        findLimits();
        _this.unload();
        _this.ns.next = true;
      };
      if (start) {
        com.cerner.mpage.call('onc_tlv_get_results', reply)("^MINE^,value($PAT_Personid$),^" + this.eventSetName + "^, ^" + start + "^,^" + end + "^,0");
      } else {
        findLimits();
        this.unload();
        this.ns.next = true;
      }
    };

    return Result;

  })();

  com.cerner.oncology.timeline.ResultDate = (function() {

    function ResultDate(result, json) {
      this.result = result;
      this.ns = com.cerner.oncology.timeline;
      this.width = this.ns.calendar.padding;
      this.points = [];
      this.points.push(new this.ns.Point(json, this.result.displayUnit));
      this.str = moment(json.EFFECTIVE_DATE).format('YYYY-MM-DD');
      this.hidden = false;
    }

    ResultDate.prototype.toString = function() {
      return this.str;
    };

    ResultDate.prototype.onSameDate = function(str) {
      return moment(this.points[0].date).onSameDate(moment(str));
    };

    ResultDate.prototype.contains = function(id) {
      var point, thatId, _i, _len, _ref;
      thatId = id.removeTrailingZeros();
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        if (point.id === thatId) {
          return true;
        }
      }
      return false;
    };

    ResultDate.prototype.addPoint = function(json) {
      var canAdd, sort,
        _this = this;
      sort = function() {
        _this.points.sort(function(a, b) {
          return moment(a.date).compareTo(moment(b.date));
        });
        _this.points.reverse();
      };
      canAdd = this.onSameDate(json.EFFECTIVE_DATE) && !this.contains(json.EVENT_ID);
      if (canAdd) {
        this.points.push(new this.ns.Point(json, this.result.displayUnit));
        sort();
      }
      return canAdd;
    };

    ResultDate.prototype.unhide = function() {
      this.hidden = false;
    };

    ResultDate.prototype.hide = function() {
      this.hidden = true;
      this.result.draw();
    };

    ResultDate.prototype.isHidden = function() {
      return this.hidden;
    };

    ResultDate.prototype.getY = function() {
      return this.points[0].plot().y;
    };

    ResultDate.prototype.draw = function(limits) {
      var diff, hold, pct, plot, point, textOffset, x, y,
        _this = this;
      if (!this.isHidden()) {
        textOffset = 7;
        plot = this.points[0].plot();
        diff = limits[1] - limits[0];
        x = plot.x;
        y = diff === 0 ? this.result.paper.height / 2 : (pct = (plot.y - limits[0]) / diff, pct *= this.result.paper.height, hold = this.result.paper.height - pct, hold + this.width >= this.result.paper.height ? this.result.paper.height - this.width : hold < this.width ? this.width : hold);
        this.result.paper.text(x + this.width / 2, (y < 12 ? y + textOffset + 4 : y - textOffset), plot.label).text();
        point = this.result.paper.rect(x, y, this.width, this.width);
        point.blueBrush();
        point.hover((function(e) {
          var createRow, p, tr, _i, _len, _ref;
          $('#ht4QbG-12').text(this.result.label);
          $(e.srcElement).css({
            cursor: 'pointer'
          });
          p = $(document.createElement('p'));
          createRow = com.cerner.oncology.util.createRow;
          _ref = this.points;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            point = _ref[_i];
            tr = createRow(2, false, null, ['popupPadding-ht4QbG']);
            $(tr).children().eq(0).append($(p).clone().text("" + point.number + " " + point.metric));
            $(tr).children().eq(1).append($(p).clone().text(moment(point.date).format('L LT') + " " + point.timeZone));
            $('#ht4QbG-5').append(tr);
          }
          $('#ht4QbG-4').show();
          com.cerner.oncology.util.positionPopup($('#ht4QbG-4'), e);
        }), (function(e) {
          $(e.srcElement).css({
            cursor: 'default'
          });
          $('#ht4QbG-5').empty();
          $('#ht4QbG-4').hide();
        }), this, this);
        $(point.node).rightClick(function(e) {
          $('#ht4QbG-4').hide();
          $('#ht4QbG-6').css({
            height: $(window).height(),
            width: $(window).width()
          });
          $('#ht4QbG-6').show();
          com.cerner.oncology.util.positionPopup($('#ht4QbG-7'), e);
          _this.ns.yesButtonListener(_this);
        });
        return {
          x: x + this.width / 2,
          y: y + this.width / 2
        };
      } else {
        this.result.hiddenPoints();
        return null;
      }
    };

    return ResultDate;

  })();

  com.cerner.oncology.timeline.Point = (function() {

    function Point(json, displayUnit) {
      this.displayUnit = displayUnit;
      this.ns = com.cerner.oncology.timeline;
      this.id = json.EVENT_ID.removeTrailingZeros();
      this.date = json.EFFECTIVE_DATE;
      this.number = json.NUMBER.removeTrailingZeros();
      this.metric = json.UNIT_DISP;
	  this.timeZone = "";
	   if(json.hasOwnProperty("TIMEZONE"))
	   {
		   this.timeZone = json.TIMEZONE;
	   }
    }

    Point.prototype.plot = function() {
      var label, x;
      x = this.ns.calendar.getX(this.date);
      label = this.number;
      if (this.displayUnit) {
        label = label + ' ' + this.metric;
      }
      return {
        x: x,
        y: this.number,
        label: label
      };
    };

    return Point;

  })();

  $.extend(com.cerner.oncology.timeline, {
    width: 0,
	height: 0,
	paperWidth:0,// paperwidth is important to set the CSS width for drawing of all possible combinations of screen size because only first time load only  we wil set the width.
    date: new Date(),
    calendar: null,
    results: [],
    next: false,
    startDate: null,
    endDate: null,
    monthRange: 6,
    timeline: [],
    displayRegimens: true,
    displayPlans: true,
    displayResponses: true,
    disable: function() {
      $('.input-ht4QbG').attr('disabled', 'disabled').css({
        cursor: 'default'
      });
      $('.anchor-ht4QbG').addClass('disabled-ht4QbG');
    },
    enable: function() {
      $('.input-ht4QbG').removeAttr('disabled').css({
        cursor: 'pointer'
      });
      $('.anchor-ht4QbG').removeClass('disabled-ht4QbG');
    },
    getTextHoverArea: function(textEl, paper) {
      var bbox, rect;
      if (Raphael.vml) {
        bbox = textEl.getBBox();
        rect = paper.rect().attr(bbox);
        rect.attr({
          fill: '#000000',
          'fill-opacity': 0,
          stroke: '#000000',
          'stroke-opacity': 0
        });
        rect.toFront();
        return rect;
      } else {
        return textEl;
      }
    },
    redrawText: function(el, xLim, paper) {
      var bbox, charWidth, f, numChars, o, s, str, strLength, text;
      text = null;
      bbox = el.getBBox();
      if (bbox.x2 >= xLim) {
        str = el.attr('text');
        strLength = str.length;
        charWidth = bbox.width / strLength;
        numChars = Math.floor((xLim - bbox.x) / charWidth);
        f = el.attr('fill');
        s = el.attr('stroke');
        o = el.attr('opacity');
        el.remove();
        if (numChars > 3) {
          str = str.substr(0, numChars - 3) + '...';
          text = paper.text(bbox.x, bbox.y + (bbox.y2 - bbox.y) / 2, str).anchorStart();
          text.attr({
            fill: f,
            opacity: o,
            stroke: s
          });
        }
      } else {
        text = el;
      }
      return text;
    },
    triage: function(start, end) {
      var evns, i, map, obj, reply, result, _i, _j, _len, _ref, _ref1,
        _this = this;
      if (!start) {
        _ref = this.results;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          result = _ref[i];
          result.draw();
          if (i === this.results.length - 1) {
            this.enable();
          }
        }
      } else {
        evns = [];
        map = {};
        this.results[0].draw(start, end);
        for (i = _j = 1, _ref1 = this.results.length; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
          map[this.results[i].eventSetName] = this.results[i];
          evns.push({
            NAME: this.results[i].eventSetName
          });
        }
        reply = function(json) {
          var en, eventSetNames, id;
		  // This check for "S" ,does not show up messsage "No data filters defined" or call draw method for no 
		  //event set select from bedrock. Need to relook here for message display.
		  if(json.RECORD_DATA.STATUS_DATA.STATUS == "S")
		  {
			  eventSetNames = json.RECORD_DATA.EVENTSETS;
			  eventSetNames.sort(function(a, b) {
				if (a.numEvents < b.numEvents) {
				  return -1;
				} else if (a.NUMEVENTS > b.NUMEVENTS) {
				  return 1;
				} else {
				  return 0;
				}
			  });
			  _this.next = false;
			  i = 0;
			  result = map[eventSetNames[i].NAME];
			  if (eventSetNames[i].NUMEVENTS) {
				result.draw(start, end);
			  } else {
				result.draw();
			  }
		  }
          en = function() {
            if (_this.next) {
              _this.next = false;
              i += 1;
              if (i < eventSetNames.length) {
                result = map[eventSetNames[i].NAME];
                if (eventSetNames[i].NUMEVENTS) {
                  result.draw(start, end);
                } else {
                  result.draw();
                }
              } else {
                clearInterval(id);
                _this.enable();
              }
            }
          };
          id = setInterval(en, 100);
        };
        obj = {
          EVENT_SET_NAMES: {
            ARRAY: evns
          }
        };
        com.cerner.mpage.call('onc_tlv_get_result_cnt', reply)(("^MINE^,value($PAT_Personid$),^" + (JSON.stringify(obj)) + "^,") + ("^" + start + "^,^" + end + "^,0"));
      }
    },
    draw: function() {
      var diff, end, result, start, _i, _len, _ref,
        _this = this;
      this.calendar.draw();
      diff = (function() {
        var arr, contains, hash, month, month2, _i, _j, _len, _len1, _ref, _ref1;
        arr = [];
        _ref = _this.calendar.months;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          month = _ref[_i];
          contains = false;
          hash = month.toString();
          _ref1 = _this.timeline;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            month2 = _ref1[_j];
            if (month2.toString() === hash) {
              contains = true;
              break;
            }
          }
          if (!contains) {
            arr.push(month);
          }
        }
        return arr;
      })();
      this.timeline = _.union(diff, this.timeline);
      if (diff.length !== 0) {
        start = diff[0].start.format('MMDDYYYY');
        end = _.last(diff).end.format('MMDDYYYY');
      }
      _ref = this.results;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        result.load();
      }
      this.triage(start, end);
    },
    yesButtonListener: function(day) {
      $('#ht4QbG-8').unbind();
      $('#ht4QbG-8').click(function() {
        day.hide();
        $('#ht4QbG-6').hide();
      });
    },
    noButtonListener: function() {
      return $('#ht4QbG-9').click(function() {
        $('#ht4QbG-6').hide();
      });
    },
    timeChangeListeners: function() {
      var changeView, moveTime, targetNum,
        _this = this;
      targetNum = 0;
      changeView = function() {
        var m;
        m = moment(_this.date);
        if (!_this.endDate) {
          _this.endDate = m.clone().eom(m.date() < 21 ? 0 : 1);
        }
        _this.startDate = _this.endDate.clone().som(-(_this.monthRange - 1));
      };
      moveTime = function(value) {
        switch (value) {
          case '<<':
            _this.startDate = _this.startDate.subtract('M', _this.monthRange);
            _this.endDate = _this.endDate.eom(-_this.monthRange);
            break;
          case '<':
            _this.startDate = _this.startDate.subtract('M', 1);
            _this.endDate = _this.endDate.eom(-1);
            break;
          case '>':
            _this.startDate = _this.startDate.add('M', 1);
            _this.endDate = _this.endDate.eom(1);
            break;
          case '>>':
            _this.startDate = _this.startDate.add('M', _this.monthRange);
            _this.endDate = _this.endDate.eom(_this.monthRange);
        }
      };
      $('.input-ht4QbG').click(function(e) {
        var num, shouldDisable, target, value;
        target = e.currentTarget;
        if ($(target).hasClass('disabled-ht4QbG')) {
          e.preventDefault();
          return false;
        }
        shouldDisable = false;
        if ($(target).hasClass('anchor-ht4QbG')) {
          num = +/^\d+/.exec($(target).text());
          if (targetNum !== num) {
            targetNum = num;
            shouldDisable = true;
            _this.monthRange = targetNum;
            $(target).removeClass('notSelected-ht4QbG').addClass('selected-ht4QbG');
            $(target).siblings('.anchor-ht4QbG').removeClass('selected-ht4QbG').addClass('unSelected-ht4QbG');
          }
        } else {
          shouldDisable = true;
        }
        if (shouldDisable) {
          _this.disable();
          if ($(target).is('input')) {
            value = $(target).val();
            moveTime(value);
          } else {
            changeView();
          }
          _this.draw();
        }
      });
      $('#ht4QbG-33').click();
    },
    getProblems: function(eventSetNames) {
      var obj, reply,
        _this = this;
      reply = function(json) {
        var i, problem, _i, _len, _ref;
        _ref = json.RECORD_DATA.RESULTS;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          problem = _ref[i];
          _this.results.push(new _this.Result(problem.EVENT_SET_NAME, problem.EVENT_SET_NAME, true, (eventSetNames.length + i) % 2 === 0));
        }
        _this.noButtonListener();
        _this.timeChangeListeners();
      };
      obj = "{\"EVENT_SET_REC\":{\"EVENT_SET_NAMES\": [" + eventSetNames + "]}}";
      com.cerner.mpage.call('onc_tlv_get_problem_results', reply)("^MINE^,value($PAT_Personid$),0,^" + obj + "^,0");
    },
    getBedrock: function() {
      var reply,
        _this = this;
      reply = function(json) {
        var ceRgx, chemoConfigured, chemoRgx, displayPlanRgx, displayRegRgx, displayRespRgx, displayUnit, displayUnitRgx, eventSetName, eventSetNames, filter, label, mpSecParamsRgx, primEventSetRgx, report, reports, resultCnt, resultRgx, yesNoRgx, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        chemoConfigured = false;
        chemoRgx = /PLANS$/i;
        displayRegRgx = /REGIMEN_IND$/i;
        displayPlanRgx = /PLAN_IND$/i;
        displayRespRgx = /RESPONSE_IND$/i;
        displayUnitRgx = /UNITS_IND\d+$/i;
        resultRgx = /RESULT\d+$/i;
        mpSecParamsRgx = /^MP_SECT_PARAMS$/i;
        ceRgx = /CE$/i;
        primEventSetRgx = /^PRIM_EVENT_SET$/i;
        yesNoRgx = /^YES_NO$/i;
        eventSetNames = [];
        resultCnt = 0;
        reports = json.BEDROCK.REPORTS;
        reports.sort(function(a, b) {
          if (a.REPORT_SEQ < b.REPORT_SEQ) {
            return -1;
          } else if (a.REPORT_SEQ > b.REPORT_SEQ) {
            return 1;
          } else {
            return 0;
          }
        });
        for (_i = 0, _len = reports.length; _i < _len; _i++) {
          report = reports[_i];
          if (chemoRgx.test(report.REPORT_MEAN)) {
            _ref = report.FILTERS;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              filter = _ref[_j];
              if (chemoRgx.test(filter.FILTER_MEAN)) {
                if (!chemoConfigured) {
                  chemoConfigured = true;
                  _this.results.push(new _this.Chemotherapy(filter.MPAGE_PARAM_VALUE));
                } else {
                  alert("Bedrock Error.\n\nMultiple configurations of the Chemotherapy section were" + " returned from Bedrock. Please check the Bedrock configuration" + (" for this MPage.\n\nReply from Bedrock: " + (JSON.stringify(json))));
                  return;
                }
              } else if (displayRegRgx.test(filter.FILTER_MEAN)) {
                _this.displayRegimens = filter.FREETEXT_DESC === '1';
              } else if (displayPlanRgx.test(filter.FILTER_MEAN)) {
                _this.displayPlans = filter.FREETEXT_DESC === '1';
              } else if (displayRespRgx.test(filter.FILTER_MEAN)) {
                _this.displayResponses = filter.FREETEXT_DESC === '1';
              }
            }
          } else if (resultRgx.test(report.REPORT_MEAN)) {
            label = null;
            eventSetName = null;
            displayUnit = null;
            _ref1 = report.FILTERS;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              filter = _ref1[_k];
              if (resultRgx.test(filter.FILTER_MEAN) && mpSecParamsRgx.test(filter.FILTER_CATEGORY_MEAN)) {
                label = filter.MPAGE_PARAM_VALUE;
              } else if (ceRgx.test(filter.FILTER_MEAN) && primEventSetRgx.test(filter.FILTER_CATEGORY_MEAN)) {
                eventSetName = filter.FREETEXT_DESC;
                if (eventSetName) {
                  eventSetNames.push("{\"NAME\": \"" + eventSetName + "\"}");
                }
              } else if (displayUnitRgx.test(filter.FILTER_MEAN) && yesNoRgx.test(filter.FILTER_CATEGORY_MEAN)) {
                displayUnit = filter.FREETEXT_DESC === '1';
              }
            }
            if (eventSetName) {
              resultCnt += 1;
              _this.results.push(new _this.Result(label, eventSetName, displayUnit, resultCnt % 2 !== 0));
            }
          }
        }
        _this.getProblems(eventSetNames);
      };
      com.cerner.mpage.call('onc_tlv_get_bedrock', reply)('^MINE^');
    },
    preparePaper: function(paper, shouldStripe) {
      this.calendar.delineate(paper);
      this.calendar.now(paper);
      if (shouldStripe) {
        paper.rect(0, 0, this.width, paper.height).zebraStripe().toBack();
      } else {
        paper.rect(0, 0, this.width, paper.height).whiteStroke().toBack();
      }
      return paper;
    },
    setDocWidth: function() {
      var cont, width;
	  this.height = $(window).height();
	  width = $(window).width();
      cont = $('#ht4QbG-1');
      parseFloat($(cont).css('margin-left'));
      width -= 8;
      $('#ht4QbG-30').width(width);
	  $(cont).css('margin-top',45);
	  $(cont).css('height',this.height-70);
      this.width = width - 24;
	  this.paperWidth = this.width*20; 
    },
    localize: function() {
      $('#ht4QbG-32').text("" + (i18n.discernabu.X_MONTHS.replace(/\{0\}/, 3)));
      $('#ht4QbG-33').text("" + (i18n.discernabu.X_MONTHS.replace(/\{0\}/, 6)));
      $('#ht4QbG-34').text("" + (i18n.discernabu.X_MONTHS.replace(/\{0\}/, 9)));
      $('#ht4QbG-35').text("" + (i18n.discernabu.X_MONTHS.replace(/\{0\}/, 12)));
      $('#ht4QbG-8').text(i18n.RCM_YES);
      $('#ht4QbG-9').text(i18n.RCM_NO);
      $('#ht4QbG-36').text(i18n.oncology.timeline.view.REMOVE_RESULTS);
      $('#ht4QbG-37').text(i18n.DATE);
      $('#ht4QbG-38').text("" + i18n.NAME + ":");
      $('#ht4QbG-39').text("" + i18n.STATUS + ":");
      $('#ht4QbG-40').text("" + i18n.START + ":");
      $('#ht4QbG-41').text("" + i18n.STOP + ":");
      $('#ht4QbG-42').text("" + i18n.NAME + ":");
      $('#ht4QbG-43').text("" + i18n.oncology.timeline.view.ORDERED_AS + ":");
      $('#ht4QbG-44').text("" + i18n.STATUS + ":");
      $('#ht4QbG-45').text("" + i18n.START + ":");
      $('#ht4QbG-46').text("" + i18n.STOP + ":");
    },
    init: function() {
      this.localize();
      this.setDocWidth();
      this.calendar = new this.Calendar();
      this.getBedrock();
    },
	resize: function() {
      
	  if(this.calendar != null)
	  {
		  var height = $(window).height();
	      var width = $(window).width();
		  
		 if( this.calendar.ns.width + 32 != width || this.calendar.ns.height != height)
		 {
		  
		  this.setDocWidth();
	      this.calendar.ns = com.cerner.oncology.timeline;
		  this.draw();
		 }
	  }
	 
      
    }
	
  });
 		
window.onresize = function(event) {
 	  
	   $el = $('#tlv');
	   $el.height($(window).height());
	   $el.width($(window).width());
	   
	   
     if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            //do something, window hasn't changed size in 100ms
			try{
			com.cerner.oncology.timeline.resize();
			}
			catch(err)
			{
				alert(err.description);
			}
        }, 1);
	  
};

  $(function() {
    $(document).bind('contextmenu rightclick', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      event.returnValue = false;
      return false;
    });
    com.cerner.oncology.util.setLocale('timeline-view_i18n.js', 0).done(function() {
      com.cerner.oncology.timeline.init();
    });
  });

}).call(this);

