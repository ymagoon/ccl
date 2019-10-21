/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);
/*
    http://www.JSON.org/json2.js
    2010-03-20

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

    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
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
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
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

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
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

            return str('', { '': value });
        };
    }
}());

/*
    json_parse.js
    2015-05-02
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    This file creates a json_parse function.
        json_parse(text, reviver)
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
            myData = json_parse(text, function (key, value) {
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
    This is a reference implementation. You are free to copy, modify, or
    redistribute.
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint for */

/*property 
    at, b, call, charAt, f, fromCharCode, hasOwnProperty, message, n, name, 
    prototype, push, r, t, text
*/

var json_parse = (function () {
    "use strict";

    // This is a function that can parse a JSON text, producing a JavaScript
    // data structure. It is a simple, recursive descent parser. It does not use
    // eval or regular expressions, so it can be used as a model for implementing
    // a JSON parser in other languages.

    // We are defining the function inside of another function to avoid creating
    // global variables.

    var at,     // The index of the current character
        ch,     // The current character
        escapee = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
        },
        text,

        error = function (m) {

            // Call error when something is wrong.

            throw {
                name: 'SyntaxError',
                message: m,
                at: at,
                text: text
            };
        },

        next = function (c) {

            // If a c parameter is provided, verify that it matches the current character.

            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }

            // Get the next character. When there are no more characters,
            // return the empty string.

            ch = text.charAt(at);
            at += 1;
            return ch;
        },

        number = function () {

            // Parse a number value.

            var number,
                string = '';

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
            number = +string;
            if (!isFinite(number)) {
                error("Bad number");
            } else {
                return number;
            }
        },

        string = function () {

            // Parse a string value.

            var hex,
                i,
                string = '',
                uffff;

            // When parsing for string values, we must look for " and \ characters.

            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    }
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
                        } else if (typeof escapee[ch] === 'string') {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        },

        white = function () {

            // Skip whitespace.

            while (ch && ch <= ' ') {
                next();
            }
        },

        word = function () {

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
        },

        value,  // Place holder for the value function.

        array = function () {

            // Parse an array value.

            var array = [];

            if (ch === '[') {
                next('[');
                white();
                if (ch === ']') {
                    next(']');
                    return array;   // empty array
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
        },

        object = function () {

            // Parse an object value.

            var key,
                object = {};

            if (ch === '{') {
                next('{');
                white();
                if (ch === '}') {
                    next('}');
                    return object;   // empty object
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
        };

    value = function () {

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
                return ch >= '0' && ch <= '9'
                    ? number()
                    : word();
        }
    };

    // Return the json_parse function. It will have access to all of the above
    // functions and variables.

    return function (source, reviver) {
        var result;

        text = source;
        at = 0;
        ch = ' ';
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

        return typeof reviver === 'function'
            ? (function walk(holder, key) {
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
            }({ '': result }, ''))
            : result;
    };
}());

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
(function () {
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

    function isLoggingActive() {
        return (state.active || loggingActive) ? true : false;
    }

    function generateMarkup() { //build markup
        var spans = [];
        for (type in messageTypes) {
            spans.push(['<span class="', type, '" type="', type, '"></span>'].join(''));
        }

        var newNode = document.createElement('DIV');
        newNode.id = IDs.blackbird;
        newNode.style.display = 'none';
        newNode.innerHTML = [
			'<div class="header">',
				'<div class="left">',
					'<div id="', IDs.filters, '" class="filters" title="click to filter by message type">', spans.join(''), '</div>',
				'</div>',
				'<div class="right">',
					'<div id="', IDs.controls, '" class="controls">',
                        //custom button on blackbird window
						'<span class="debug" title="export xml" op="exportXml"></span>',
						'<span id="', IDs.size, '" title="contract" op="resize"></span>',
						'<span class="clear" title="clear" op="clear"></span>',
						'<span class="close" title="close" op="close"></span>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="main">',
				'<div class="left"></div><div class="mainBody">',
					'<ol>', cache.join(''), '</ol>',
				'</div><div class="right"></div>',
			'</div>'/*,
			'<div class="footer">',
				'<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
				'<div class="right"></div>',
			'</div>'*/
        ].join('');
        return newNode;
    }

    function backgroundImage() { //(IE6 only) change <BODY> tag's background to resolve {position:fixed} support
        var bodyTag = document.getElementsByTagName('BODY')[0];

        if (bodyTag.currentStyle && IE6_POSITION_FIXED) {
            if (bodyTag.currentStyle.backgroundImage == 'none') {
                bodyTag.style.backgroundImage = 'url(about:blank)';
            }
            if (bodyTag.currentStyle.backgroundAttachment == 'scroll') {
                bodyTag.style.backgroundAttachment = 'fixed';
            }
        }
    }

    function addMessage(type, content) { //adds a message to the output list
        content = (content.constructor == Array) ? content.join('') : content;
        if (outputList) {
            var newMsg = document.createElement('LI');
            newMsg.className = type;
            newMsg.innerHTML = ['<span class="icon"></span>', content].join('');
            outputList.appendChild(newMsg);
            scrollToBottom();
        } else {
            cache.push(['<li class="', type, '"><span class="icon"></span>', content, '</li>'].join(''));
        }
    }

    function clear() { //clear list output
        outputList.innerHTML = '';
    }

    function clickControl(evt) {
        if (!evt) evt = window.event;
        var el = (evt.target) ? evt.target : evt.srcElement;

        if (el.tagName == 'SPAN') {
            switch (el.getAttributeNode('op').nodeValue) {
                case 'resize': resize(); break;
                case 'clear': clear(); break;
                case 'close': hide(); break;
                    // custom button handler that triggers the save as function of clinical summary
                case 'exportXml': CLINICAL_SUMMARY_O1.SaveAsFile(); break;
            }
        }
    }

    function clickFilter(evt) { //show/hide a specific message type
        if (!evt) evt = window.event;
        var span = (evt.target) ? evt.target : evt.srcElement;

        if (span && span.tagName == 'SPAN') {

            var type = span.getAttributeNode('type').nodeValue;

            if (evt.altKey) {
                var filters = document.getElementById(IDs.filters).getElementsByTagName('SPAN');

                var active = 0;
                for (entry in messageTypes) {
                    if (messageTypes[entry]) active++;
                }
                var oneActiveFilter = (active == 1 && messageTypes[type]);

                for (var i = 0; filters[i]; i++) {
                    var spanType = filters[i].getAttributeNode('type').nodeValue;

                    filters[i].className = (oneActiveFilter || (spanType == type)) ? spanType : spanType + 'Disabled';
                    messageTypes[spanType] = oneActiveFilter || (spanType == type);
                }
            }
            else {
                messageTypes[type] = !messageTypes[type];
                span.className = (messageTypes[type]) ? type : type + 'Disabled';
            }

            //build outputList's class from messageTypes object
            var disabledTypes = [];
            for (type in messageTypes) {
                if (!messageTypes[type]) disabledTypes.push(type);
            }
            disabledTypes.push('');
            outputList.className = disabledTypes.join('Hidden ');

            scrollToBottom();
        }
    }

    function clickVis(evt) {
        if (!evt) evt = window.event;
        var el = (evt.target) ? evt.target : evt.srcElement;

        state.load = el.checked;
        setState();
    }


    function scrollToBottom() { //scroll list output to the bottom
        outputList.scrollTop = outputList.scrollHeight;
    }

    function isVisible() { //determine the visibility
        return (bbird.style.display == 'block');
    }

    function hide() {
        bbird.style.display = 'none';
    }

    function show() {
        var body = document.getElementsByTagName('BODY')[0];
        body.removeChild(bbird);
        body.appendChild(bbird);
        bbird.style.display = 'block';
    }

    //sets the position
    function reposition(position) {
        if (position === undefined || position == null) {
            position = (state && state.pos === null) ? 1 : (state.pos + 1) % 4; //set to initial position ('topRight') or move to next position
        }

        switch (position) {
            case 0: classes[0] = 'bbTopLeft'; break;
            case 1: classes[0] = 'bbTopRight'; break;
            case 2: classes[0] = 'bbBottomLeft'; break;
            case 3: classes[0] = 'bbBottomRight'; break;
        }
        state.pos = position;
        setState();
    }

    function resize(size) {
        if (size === undefined || size === null) {
            size = (state && state.size == null) ? 1 : (state.size + 1) % 2;
        }

        classes[1] = (size === 0) ? 'bbSmall' : 'bbLarge'

        var span = document.getElementById(IDs.size);
        span.title = (size === 1) ? 'small' : 'large';
        span.className = span.title;

        state.size = size;
        setState();
        scrollToBottom();
    }

    function setLogging() {
        state.active = true;
        state.load = true;
        state.size = 1;
        setState();
    }

    function stopLogging() {
        state.active = false;
        state.load = false;
        state.size = 1;
        setState();
    }

    function setState() {
        var props = [];
        for (entry in state) {
            var value = (state[entry] && state[entry].constructor === String) ? '"' + state[entry] + '"' : state[entry];
            props.push('"' + entry + '"' + ':' + value);
        }
        props = props.join(',');

        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);
        document.cookie = ['blackbird={', props, '};'].join('');

        var newClass = [];
        for (word in classes) {
            newClass.push(classes[word]);
        }
        bbird.className = newClass.join(' ');
    }

    function getState() {
        var defState = { pos: null, size: null, load: null, active: null };
        var re = new RegExp(/blackbird=({[^;]+})(;|\b|$)/);
        var match = re.exec(document.cookie);

        try {
            return (match && match[1]) ? json_parse(match[1]) : defState;
        } catch (error) {
            return defState;
        }
    }

    //event handler for 'keyup' event for window
    function readKey(evt) {
        if (!evt) evt = window.event;
        var code = 113; //F2 key

        if (evt && evt.keyCode == code) {

            var visible = isVisible();

            if (visible && evt.shiftKey && evt.altKey) clear();
            else if (visible && evt.shiftKey) reposition();
            else if (!evt.shiftKey && !evt.altKey) {
                if (isLoggingActive()) {
                    (visible) ? hide() : show();
                }
            }
        }
    }

    //event management ( thanks John Resig )
    function addEvent(obj, type, fn) {
        var obj = (obj.constructor === String) ? document.getElementById(obj) : obj;
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () { obj['e' + type + fn](window.event) };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else obj.addEventListener(type, fn, false);
    }
    function removeEvent(obj, type, fn) {
        var obj = (obj.constructor === String) ? document.getElementById(obj) : obj;
        if (obj.detachEvent) {
            if (obj[type + fn] != undefined) {
                obj.detachEvent('on' + type, obj[type + fn]);
            }
            obj[type + fn] = null;
        } else {
            obj.removeEventListener(type, fn, false);
        }
    }

    window[NAMESPACE] = {
        toggle:
			function () { if (isLoggingActive()) { (isVisible()) ? hide() : show(); } },
        resize:
			function () { resize(); },
        clear:
			function () { clear(); },
        move:
			function () { reposition(); },
        debug:
			function (msg) { if (isLoggingActive()) { addMessage('debug', msg); } },
        warn:
			function (msg) { if (isLoggingActive()) { addMessage('warn', msg); } },
        info:
			function (msg) { if (isLoggingActive()) { addMessage('info', msg); } },
        error:
			function (msg) { if (isLoggingActive()) { addMessage('error', msg); } },
        activateLogging:
			function () {
			    //Set the state.active to true
			    setLogging();
			},
        disableLogging:
			function () {
			    stopLogging();
			},
        profile:
			function (label) {
			    var currentTime = new Date(); //record the current time when profile() is executed

			    if (label == undefined || label == '') {
			        addMessage('error', '<b>ERROR:</b> Please specify a label for your profile statement');
			    }
			    else if (profiler[label]) {
			        addMessage('profile', [label, ': ', currentTime - profiler[label], 'ms'].join(''));
			        delete profiler[label];
			    }
			    else {
			        profiler[label] = currentTime;
			        addMessage('profile', label);
			    }
			    return currentTime;
			},
        isBlackBirdActive:
			function () {
			    return isLoggingActive();
			}
    }

    addEvent(window, 'load',
		/* initialize Blackbird when the page loads */
		function () {
		    var body = document.getElementsByTagName('BODY')[0];
		    bbird = body.appendChild(generateMarkup());
		    outputList = bbird.getElementsByTagName('OL')[0];

		    backgroundImage();

		    //add events
		    //addEvent( IDs.checkbox, 'click', clickVis );
		    addEvent(IDs.filters, 'click', clickFilter);
		    addEvent(IDs.controls, 'click', clickControl);
		    addEvent(document, 'keyup', readKey);

		    resize(state.size);
		    reposition(state.pos);
		    if (state.load) {
		        show();
		        //document.getElementById( IDs.checkbox ).checked = true; 
		    }

		    scrollToBottom();

		    window[NAMESPACE].init = function () {
		        show();
		        window[NAMESPACE].error(['<b>', NAMESPACE, '</b> can only be initialized once']);
		    }

		    addEvent(window, 'unload', function () {
		        //removeEvent( IDs.checkbox, 'click', clickVis );
		        removeEvent(IDs.filters, 'click', clickFilter);
		        removeEvent(IDs.controls, 'click', clickControl);
		        removeEvent(document, 'keyup', readKey);
		    });

		    if (state.active) {
		        //Prevent logging from occuring next reload
		        loggingActive = true;
		        state.active = false;
		        state.load = false;
		        state.size = 1;
		        setState();
		    }
		});
})();
//http://software.dzhuvinov.com/jsworld-numeric-formatting.html

mp_formatter = {};

mp_formatter.Locale = function(properties){
    this._className = "mp_formatter.Locale";
    this._parseList = function(names, expectedItems){
        var array = [];
        if (names === null) {
            throw "Names not defined";
        }
        else if (typeof names == "object") {
            array = names;
        }
        else if (typeof names == "string") {
            array = names.split(";", expectedItems);
            for (var i = 0; i < array.length; i++) {
                if (array[i][0] == "\"" && array[i][array[i].length - 1] == "\""){ 
                    array[i] = array[i].slice(1, -1);
                }
                else{ 
                    throw "Missing double quotes";
                }
            }
        }
        else {
            throw "Names must be an array or a string";
        }
        if (array.length != expectedItems){
            throw "Expected " + expectedItems + " items, got " + array.length;
        }
        return array;
    };
    this._validateFormatString = function(formatString){
        if (typeof formatString == "string" && formatString.length > 0){ 
            return formatString;
        }
        else {
            throw "Empty or no string";
        }
    };
    if (properties === null || typeof properties != "object"){
        throw "Error: Invalid/missing locale properties";
    }
    if (typeof properties.decimal_point != "string"){ 
        throw "Error: Invalid/missing decimal_point property";
    }
    this.decimal_point = properties.decimal_point;
    if (typeof properties.thousands_sep != "string"){ 
        throw "Error: Invalid/missing thousands_sep property";
    }
    this.thousands_sep = properties.thousands_sep;
    if (typeof properties.grouping != "string"){ 
        throw "Error: Invalid/missing grouping property";
    }
    this.grouping = properties.grouping;
    
    if (properties === null || typeof properties != "object"){ 
        throw "Error: Invalid/missing time locale properties";
    }
    try {
        this.time24hr = this._validateFormatString(properties.time24hr);
    } 
    catch (error) {
        throw "Error: Invalid time24hr property: " + error;
    }
    try {
        this.time24hrnosec = this._validateFormatString(properties.time24hrnosec);
    } 
    catch (error) {
        throw "Error: Invalid time24hrnosec property: " + error;
    }
    try {
        this.shortdate2yr = this._validateFormatString(properties.shortdate2yr);
    } 
    catch (error) {
        throw "Error: Invalid shortdate2yr property: " + error;
    }
    try {
        this.fulldate4yr = this._validateFormatString(properties.fulldate4yr);
    } 
    catch (error) {
        throw "Error: Invalid fulldate4yr property: " + error;
    }
    try {
        this.fulldate2yr = this._validateFormatString(properties.fulldate2yr);
    } 
    catch (error) {
        throw "Error: Invalid fulldate2yr property: " + error;
    }
    try {
        this.fullmonth4yrnodate = this._validateFormatString(properties.fullmonth4yrnodate);
    } 
    catch (error) {
        throw "Error: Invalid fullmonth4yrnodate property: " + error;
    }
    try {
        this.full4yr = this._validateFormatString(properties.full4yr);
    } 
    catch (error) {
        throw "Error: Invalid full4yr property: " + error;
    }
    try {
        this.fulldatetime2yr = this._validateFormatString(properties.fulldatetime2yr);
    } 
    catch (error) {
        throw "Error: Invalid fulldatetime2yr property: " + error;
    }
    try {
        this.fulldatetime4yr = this._validateFormatString(properties.fulldatetime4yr);
    } 
    catch (error) {
        throw "Error: Invalid fulldatetime4yr property: " + error;
    }
    try {
        this.fulldatetimenoyr = this._validateFormatString(properties.fulldatetimenoyr);
    } 
    catch (error) {
        throw "Error: Invalid fulldatetimenoyr property: " + error;
    }
};

mp_formatter._getPrecision = function(optionsString){
    if (typeof optionsString != "string"){
        return -1;
    }
    var m = optionsString.match(/\.(\d)/);
    if (m){
        return parseInt(m[1], 10);
    }
    else{ 
        return -1;
    }
};

mp_formatter._isNumber = function(arg){
    if (typeof arg == "number"){
        return true;
    }
    if (typeof arg != "string"){ 
        return false;
    }
    var s = arg + "";
    return (/^-?(\d+|\d*\.\d+)$/).test(s);
};

mp_formatter._isDate = function(arg){
    if (arg.getDate){
        return true;
    }
    return false;
};

mp_formatter._trim = function(str){
    var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0; i < str.length; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    for (i = str.length - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};

mp_formatter._splitNumber = function(amount){
    if (typeof amount == "number"){
        amount = amount + "";
    }
    var obj = {};
    if (amount.charAt(0) == "-"){ 
        amount = amount.substring(1);
    }
    var amountParts = amount.split(".");
    if (!amountParts[1]){ 
        amountParts[1] = "";
    }
    obj.integer = amountParts[0];
    obj.fraction = amountParts[1];
    return obj;
};

mp_formatter._formatIntegerPart = function(intPart, grouping, thousandsSep){
    if (thousandsSep === "" || grouping == "-1"){
        return intPart;
    }
    var groupSizes = grouping.split(";");
    var out = "";
    var pos = intPart.length;
    var size;
    while (pos > 0) {
        if (groupSizes.length > 0){ 
            size = parseInt(groupSizes.shift(), 10);
        }
        if (isNaN(size)){ 
            throw "Error: Invalid grouping";
        }
        if (size == -1) {
            out = intPart.substring(0, pos) + out;
            break;
        }
        pos -= size;
        if (pos < 1) {
            out = intPart.substring(0, pos + size) + out;
            break;
        }
        out = thousandsSep + intPart.substring(pos, pos + size) + out;
    }
    return out;
};

mp_formatter._formatFractionPart = function(fracPart, precision){
    for (var i = 0; fracPart.length < precision; i++){ 
        fracPart = fracPart + "0";
    }
    return fracPart;
};

mp_formatter._hasOption = function(option, optionsString){
    if (typeof option != "string" || typeof optionsString != "string"){ 
        return false;
    }
    if (optionsString.indexOf(option) != -1){ 
        return true;
    }
    else{ 
        return false;
    }
};

mp_formatter._validateFormatString = function(formatString){
    if (typeof formatString == "string" && formatString.length > 0){
        return true;
    }
    else{ 
        return false;
    }
};

mp_formatter.NumericFormatter = function(locale){
    if (typeof locale != "object" || locale._className != "mp_formatter.Locale"){
        throw "Constructor error: You must provide a valid mp_formatter.Locale instance";
    }
    this.lc = locale;
    /*
     argument to modify the output format:
     "^" suppress grouping
     ".n" specify decimal precision n
     �"+" force positive sign for positive amounts
     �"~" suppress positive/negative sign
     */
    this.format = function(number, options){
        if (typeof number == "string"){
            number = mp_formatter._trim(number);
        }
        if (!mp_formatter._isNumber(number)){ 
            throw "Error: The input is not a number";
        }
        var floatAmount = parseFloat(number, 10);
        var reqPrecision = mp_formatter._getPrecision(options);
        if (reqPrecision != -1){ 
            floatAmount = Math.round(floatAmount * Math.pow(10, reqPrecision)) / Math.pow(10, reqPrecision);
        }
        var parsedAmount = mp_formatter._splitNumber(String(floatAmount));
        var formattedIntegerPart;
        
        if (floatAmount === 0){
            formattedIntegerPart = "0";
        }
        else{ 
            formattedIntegerPart = mp_formatter._hasOption("^", options) ? parsedAmount.integer : mp_formatter._formatIntegerPart(parsedAmount.integer, this.lc.grouping, this.lc.thousands_sep);
        }
        var formattedFractionPart = reqPrecision != -1 ? mp_formatter._formatFractionPart(parsedAmount.fraction, reqPrecision) : parsedAmount.fraction;
        var formattedAmount = formattedFractionPart.length ? formattedIntegerPart + this.lc.decimal_point + formattedFractionPart : formattedIntegerPart;
        
        if (mp_formatter._hasOption("~", options) || floatAmount === 0) {
            return formattedAmount;
        }
        else {
            if (mp_formatter._hasOption("+", options) || floatAmount < 0) {
                if (floatAmount > 0) {
                    return "+" + formattedAmount;
                }
                else if (floatAmount < 0) { 
                    return "-" + formattedAmount;
                }
                else { 
                    return formattedAmount;
                }
            }
            else {
                return formattedAmount;
            }
        }
    };
};
/*
 * The singleton DateTimeFormatter has a dependency on the date.format.js (http://blog.stevenlevithan.com/archives/date-time-format)
 */
mp_formatter.DateTimeFormatter = function(locale){
    if (typeof locale != "object" || locale._className != "mp_formatter.Locale") {
        throw "Constructor error: You must provide a valid mp_formatter.Locale instance";
    }
    this.lc = locale;
    
    this.formatISO8601 = function(dateStr, option){
        if (!mp_formatter._validateFormatString(dateStr)){ 
            throw "Error: The input is either empty or no string";
        }
        
        var date = new Date();
        date.setISO8601(dateStr);
        return this.format(date, option);
    };
    
    this.format = function(dateTime, option){
        if (!mp_formatter._isDate(dateTime)) {
            throw "Error: The input is not a date object";
        }
        
        switch (option) {
            case mp_formatter.DateTimeFormatter.TIME_24HOUR:
                return dateTime.format(this.lc.time24hr);
            case mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS:
                return dateTime.format(this.lc.time24hrnosec);
            case mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR:
                return dateTime.format(this.lc.shortdate2yr);
            case mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR:
                return dateTime.format(this.lc.fulldate4yr);
            case mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR:
                return dateTime.format(this.lc.fulldate2yr);
            case mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE:
                return dateTime.format(this.lc.fullmonth4yrnodate);
            case mp_formatter.DateTimeFormatter.FULL_4YEAR:
                return dateTime.format(this.lc.full4yr);
            case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR:
                return dateTime.format(this.lc.fulldatetime2yr);
            case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR:
                return dateTime.format(this.lc.fulldatetime4yr);
            case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR:
                return dateTime.format(this.lc.fulldatetimenoyr);
            default:
                alert("Unhandled date time formatting option");
        }
    };
};

//Constants for DateFormat
mp_formatter.DateTimeFormatter.TIME_24HOUR = 1;
mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS = 2;
mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR = 3;
mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR = 4;
mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR = 5;
mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE = 6;
mp_formatter.DateTimeFormatter.FULL_4YEAR = 7;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR = 8;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR = 9;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR = 10;

/* Hover Mouse Over */
/* Hover Mouse Over */
function hmo(evt, n, comp){
    evt = evt || window.event;
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 20;
    n._ps = n.previousSibling;
    n.hmo = true;
    
    function hover(){
        if (n.hmo === true) { //make sure the cursor has not moused out prior to displaying
        	
			if (comp) {
				if (comp.isEditMode()) {
					 clearTimeout(n.timer);
					return;
				}
			}
			
			s.display = "block";	
		    if(left + n.offsetWidth > vp[1] + so[1]) {
				left = left - 40 - n.offsetWidth;
				if(left < 0) {
					left = 0;
				}
			}

			if(top + n.offsetHeight > vp[0] + so[0]) {
				if(top - 40 - n.offsetHeight < so[0]) {
					if(left > 0) {
						top = 10 + so[0];
					}
				} else {
					top = top - 40 - n.offsetHeight;
				}
			}
			document.body.appendChild(n);	
            s.left = left + "px";
            s.top = top + "px";
            n.show = true;
        }
    }
    n.timer = setTimeout(hover, 500);
}
/* Hover Mouse Move */
function hmm(evt, n, comp){
	
    if (!n.show) {
        return;
    }
    
    if (comp) {
		if (comp.isEditMode()) {
			clearTimeout(n.timer);
			return;
		}
	}
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 20;
    
    if (left + n.offsetWidth > vp[1] + so[1]) {
        left = left - 40 - n.offsetWidth;
        if (left < 0) {
            left = 0;
        }
    }
    
    if (top + n.offsetHeight > vp[0] + so[0]) {
        if (top - 40 - n.offsetHeight < so[0]) {
            if (left > 0) {
                top = 10 + so[0];
            }
        }
        else {
            top = top - 40 - n.offsetHeight;
        }
    }
    evt = evt || window.event;
    s.top = top + "px";
    s.left = left + "px";
}

/* Hover Mouse Out*/
function hmt(evt, n, comp){
	if (comp) {
		if (comp.isEditMode()) {
			clearTimeout(n.timer);
			return;
		}
	}
    n.hmo = false;
    if (!n._ps) 
        n._ps = n.previousSibling;
    clearTimeout(n.timer);
    evt = evt || window.event;
    n.style.display = "";
    Util.ia(n, n._ps);
    n.show = false;
}

/* Hover Setup */
function hs(e, n, comp){
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;
	var editMode;
	if (n && n.tagName == "DIV") {
        e.onmouseenter = function(evt){
		if (comp) {
			 if (comp.isEditMode()) {
				return;
			}
		}	
			e.onmouseover = null;
			e.onmouseout = null;
			hmo(evt, n, comp);
        };
        e.onmouseover = function(evt){
		if (comp) {
			 if (comp.isEditMode()|| Util.Style.ccss(this, "row-selected")) {
				return;
			}
		}
			e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmo(evt, n, comp);
        };
        e.onmousemove = function(evt){
		if (comp) {
			 if (comp.isEditMode()|| Util.Style.ccss(this, "row-selected")) {
				return;
			}
		}
			e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmm(evt, n, comp);
        };
        e.onmouseout = function(evt){
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            hmt(evt, n, comp);
        };
        e.onmouseleave = function(evt){
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            e.onmouseover = null;
            e.onmouseout = null;
            hmt(evt, n, comp);
        };
        e.onmouseup = function(evt){
            if (comp) {
                if (!comp.isEditMode()) {
                    return;
                }
                
                e.style.backgroundColor = priorBgColor;
                e.style.borderColor = priorBorderColor;
                hmt(evt, n, comp);
            }
        };
        Util.Style.acss(n, "hover");
    }
}

////// Healthe library 
 /*extern window, document*/
 /**
  * @fileOverview
 
     <h1>Utility Methods</h1>
     <p>
     These are universal utility methods, designed for speed, size and agnostic browser support. There are several namespaces:
     </p>
     <dl>
         <dt>Util</dt>
         <dd>General Utility methods</dd>
         <dd>Included in util.core.js</dd>
         <dt>Util.EventCache</dt>
         <dd>Object for ensuring proper garbage collection.</dd>
         <dd>Included in util.core.js</dd>
         <dt>Util.Convert</dt>
         <dd>Conversion Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.convert.js is not included.</dd>
         <dt>Util.Cookie</dt>
         <dd>Cookie Management Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.cookie.js is not included.</dd>
         <dt>Util.Detect</dt>
         <dd>Detection Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.detect.js is not included.</dd>
         <dt>Util.i18n</dt>
         <dd>Internationalization (i18n) Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.i18n.js is not included.</dd>
         <dt>Util.Load</dt>
         <dd>DOM-Loaded event Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.load.js is not included.</dd>
         <dt>Util.Pos</dt>
         <dd>Positioning Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.pos.js is not included.</dd>
         <dt>Util.Style</dt>
         <dd>CSS Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.style.js is not included.</dd>
         <dt>Util.Timeout</dt>
         <dd>Session Management methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.timeout.js is not included.</dd>
     </dl>
     <h2>Notes</h2>
     <p>All modules are aggregated together by Maven into a single file, util.js.</p>
     <p>Validated with JSLint.</p>
  */
 
 /**
  * Returns an element based on the id provided, <code>null</code> if no element exists.
  * @param {String} i The id.
  * @return {Node} An element with the id specified, <code>null</code> if no such element exists.
  * @static
  * @global
  * @fullname Get Element By ID
  */
 function _g(i) {
     return document.getElementById(i);
 }
 
 /**
  * Returns all elements from within the specified context matching the tag name provided, <code>null</code> if no
  * elements exist.
  * @param {String} t The tag name.
  * @param {Node} [e] The element to search within. Defaults to the document body.
  * @return {array} An array of elements with the tag name specified, <code>null</code> if no elements exist.
  * @static
  * @global
  * @fullname Get Elements By Tag Name
  */
 function _gbt(t, e) {
     e = e || document;
     return e.getElementsByTagName(t);
 }
 
 /**
  * Utility methods
  * @namespace Util
  * @static
  * @global
  */
 var Util = function () {
 
     var _e = [], _d = document, _w = window;
 
     return {
         /**
          * The Event Cache makes it possible to ensure all events attached to the DOM or browser instances are
          * properly "flushed away" after the page is unloaded. This prevents memory leaks in some implementations.
          *
          * @property
          * @memberof Util
          * @name EventCache
          */
         EventCache : function () {
             var l = [];
             return {
 
                 /**
                  * Add an event to the Event Cache.
                  * @param {Node} o The element or object to which the event is attached.
                  * @param {String} e The event name, e.g. "click" or "mouseover".
                  * @param {Function} f The function attached.
                  *
                  * @static
                  * @function
                  * @memberof Util.EventCache
                  * @name add
                  */
                 add : function (o, e, f) {
                     l.push(arguments);
                 },
 
                 /**
                  * Remove an event from the Event Cache.
                  * @param {Node} o The element or object to which the event is attached.
                  * @param {String} e The event name, e.g. "click" or "mouseover".
                  * @param {Function} f The function to detach.
                  *
                  * @static
                  * @function
                  * @memberof Util.EventCache
                  * @name remove
                  */
                 remove : function (o, e, f) {
                     var n;
                     for (var i = l.length - 1; i >= 0; i = i - 1) {
                         if (o == l[i][0] && e == l[i][1] && f == l[i][2]) {
                             n = l[i];
                             if (n[0].removeEventListener) {
                                 n[0].removeEventListener(n[1], n[2], n[3]);
                             }
                             else if (n[0].detachEvent) {
                                 if (n[1].substring(0, 2) != "on") {
                                     n[1] = "on" + n[1];
                                 }
                                 n[0].detachEvent(n[1], n[0][e + f]);
                             }
                         }
                     }
                 },
 
                 /**
                  * Remove all events from the Cache.
                  *
                  * @static
                  * @function
                  * @memberof Util.EventCache
                  * @name flush
                  */
                 flush : function () {
                     var e;
                     for (var i = l.length - 1; i >= 0; i = i - 1) {
                         var o = l[i];
                         if (o[0].removeEventListener) {
                             o[0].removeEventListener(o[1], o[2], o[3]);
                         }
                         e = o[1];
                         if (o[1].substring(0, 2) != "on") {
                             o[1] = "on" + o[1];
                         }
                         if (o[0].detachEvent) {
                             o[0].detachEvent(o[1], o[2]);
                             if (o[0][e + o[2]]) {
                                 o[0].detachEvent(o[1], o[0][e + o[2]]);
                             }
                         }
                     }
                 }
             };
         }(),
 
         /**
          * Creates an element within the document, without a parent, as if by <code>document.createElement</code>. This method
          * has better performance, as it caches instances of created objects and clones them, rather than manipulate the
          * document directly.
          * @param {String} t The tag name of the element to create.
          * @return {Node} A new element.
          *
          * @static
          * @function
          * @memberof Util
          * @name ce
          * @fullname Create Element
          */
         ce : function (t) {
             var a = _e[t];
             if (!a) {
                 a = _e[t] = _d.createElement(t);
             }
             if (!a) {
                 return null;
             }
             else {
                 return a.cloneNode(false);
             }
         },
 
         /**
          * Creates an element within the document, without a parent, as if by <code>document.createElement</code>. Any
          * given properites will then be set onto the newly created element. This method has better performance, as it
          * caches instances of created objects and clones them, rather than manipulate the document directly.
          * @param {String} t The tag name of the element to create.
          * @param {Object} [p] The properties to set onto the created element, (e.g. <code>{ "href" : "index.html", "name" : "theName"}</code>).
          * @return {Node} A new element.
          * 
          * @static
          * @function
          * @memberof Util
          * @name cep
          * @fullname Create Element with Properties
          */
         cep : function (t, p) {
             var e = this.ce(t);
             return this.mo(e, p);
         },
 
         /**
          * Merges two option objects.
          * @param {Object} o1 The option object to be modified.
          * @param {Object} o2 The option object containing properties to be copied.
          * @param {Boolean} d True if properties on o1 should be immutable, false otherwise.
          * @return {Object} An object containing properties.
          *
          * @static
          * @function
          * @memberof Util
          * @name mo
          * @fullname Merge Objects
          */
         mo : function (o1, o2, d) {
             o1 = o1 || {};
             o2 = o2 || {};
             var p;
             for (p in o2) {
                 if (p) {
                     o1[p] = (o1[p] === undefined) ? o2[p] : !d ? o2[p] : o1[p];
                 }
             }
             return o1;
         },
 
         /**
          * Deletes an element from the DOM.
          * @param {Node} e The element to delete.
          *
          * @static
          * @function
          * @memberof Util
          * @name de
          * @fullname Delete Element
          */
         de : function (e) {
             if (e) {
                 this.gp(e).removeChild(e);
             }
         },
 
         /**
          * Universal event-bubbling cancel method.
          * @param {event} e The event object, (not required in IE).
          *
          * @static
          * @function
          * @memberof Util
          * @name cancelBubble
          * @fullname Cancel Event Bubble
          */
         cancelBubble : function (e) {
             e = _w.event || e;
             if (!e) {
                 return;
             }
 
             if (e.stopPropagation) {
                 e.stopPropagation();
             }
             else {
                 e.cancelBubble = true;
             }
         },
 
         /**
          * Universal event default behavior prevention method.
          * @param {event} e The event object, (not required in IE).
          *
          * @static
          * @function
          * @memberof Util
          * @name preventDefault
          * @fullname Prevent Default Behavior
          */
         preventDefault : function (e) {
             e = _w.event || e;
 
             if (!e) {
                 return;
             }
 
             if (e.preventDefault) {
                 e.preventDefault();
             }
             else {
                 e.returnValue = false;
             }
         },
 
         /**
          * Returns the an element's offset values, traversing the tree for an accurate value.
          * @param {Node} e The element to evaluate.
          * @return {array} The offset left and offset top, in pixels, in the form of [left, top].
          *
          * @static
          * @function
          * @memberof Util
          * @name goff
          * @fullname Get Element Offset Values
          */
         goff : function (e) {
             var l = 0, t = 0;
             if (e.offsetParent) {
                 while (e.offsetParent) {
                     l += e.offsetLeft;
                     t += e.offsetTop;
                     e = e.offsetParent;
                 }
             }
             else if (e.x || e.y) {
                 l += e.x || 0;
                 t += e.y || 0;
             }
             return [l, t];
         },
 
         /**
          * Returns an accurate parent node; Some browsers will return a Text Node.
          * @param {Node} e The element to evaluate.
          * @return {Node} The actual parent node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gp
          * @fullname Get Parent
          */
         gp : function (e) {
             if (!e.parentNode) {
                 return e;
             }
             e = e.parentNode;
             while (e.nodeType === 3 && e.parentNode) {
                 e = e.parentNode;
             }
             return e;
         },
		 
 
         /**
          * Some browsers will return a Text Node, so this method returns an accurate child node.
          * @param {Node} e The element to evaluate.
          * @param {int} [i] The child node index, default is 0.
          * @return {Node} The actual child node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gc
          * @fullname Get Child Node
          */
         gc : function (e, i) {
             i = i || 0;
             var j = -1;
 
             if (!e.childNodes[i]) {
                 return null;
             }
 
             e = e.childNodes[0];
             while (e && j < i) {
                 if (e.nodeType === 1) {
                     j++;
                     if (j === i) {
                         break;
                     }
                 }
                 e = this.gns(e);
             }
             return e;
         },
 
         /**
          * For a given node, returns a list of children of NODETYPE 1, (Element).
          * @param {Node} e The node to evaluate.
          * @return {array} A collection of child nodes.
          *
          * @static
          * @function
          * @memberof Util
          * @name gcs
          * @fullname Get All Child Nodes
          */
         gcs : function (e) {
 
             var r = [], es = e.childNodes;
             for (var i = 0; i < es.length; i++) {
                 var x = es[i];
                 if (x.nodeType === 1) {
                     r.push(x);
                 }
             }
             return r;
         },
 
         /**
          * Returns an accurate next sibling node; Some browsers will return a Text Node.
          * @param {Node} e The element to evaluate.
          * @return {Node} The actual next sibling node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gns
          * @fullname Get Next True Sibling
          */
         gns : function (e) {
			if (!e) {
				return null;
			}
             var a = e.nextSibling;
             while (a && a.nodeType !== 1) {
                 a = a.nextSibling;
             }
             return a;
         },
 
         /**
          * Returns an accurate previous sibling node; Some browsers will return a Text Node.
          * @param {Node} e The element to evaluate.
          * @return {Node} The actual previous sibling node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gps
          * @fullname Get Previous True Sibling
          */
         gps : function (e) {
             var a = e.previousSibling;
             while (a && a.nodeType !== 1) {
                 a = a.previousSibling;
             }
             return a;
         },
 
         /**
          * Appends a child to the specified node.
          * @param {Node} e The element to append.
          * @param {Node} p The new parent node.
          * @return {Node} The appended element.
          *
          * @static
          * @function
          * @memberof Util
          * @name ac
          * @fullname Append Child
          */
         ac : function (e, p) {
             p.appendChild(e);
             return e;
         },
 
         /**
          * Insert a node after a specified node.
          * @param {Node} nn The new node to insert.
          * @param {Node} rn The reference node for insertion.
          *
          * @static
          * @function
          * @memberof Util
          * @name ia
          * @fullname Insert After
          */
         ia : function (nn, rn) {
             var p = Util.gp(rn), n = Util.gns(rn);
             if (n) {
                 p.insertBefore(nn, n);
             }
             else {
                 Util.ac(nn, p);
             }
         },
 
         /**
          * Adds a Javscript event to the given element with full browser compatiblity and plugs for any memory leaks.
          * @param {Node} o The object receiving the event.
          * @param {String} e The event name to attach.
          * @param {Function} f The function to run when the event is invoked.
          *
          * @static
          * @function
          * @memberof Util
          * @name addEvent
          * @fullname Add Javascript Event
          */
         addEvent : function (o, e, f) {
 
             function ae(obj, evt, fnc) {
                 if (!obj.myEvents) {
                     obj.myEvents = {};
                 }
 
                 if (!obj.myEvents[evt]) {
                     obj.myEvents[evt] = [];
                 }
 
                 var evts = obj.myEvents[evt];
                 evts[evts.length] = fnc;
             }
 
             function fe(obj, evt) {
 
                 if (!obj || !obj.myEvents || !obj.myEvents[evt]) {
                     return;
                 }
 
                 var evts = obj.myEvents[evt];
 
                 for (var i = 0, len = evts.length; i < len; i++) {
                     evts[i]();
                 }
             }
 
             if (o.addEventListener) {
                 o.addEventListener(e, f, false);
                 Util.EventCache.add(o, e, f);
             }
             else if (o.attachEvent) {
                 o["e" + e + f] = f;
                 o[e + f] = function () {
                     o["e" + e + f](window.event);
                 };
                 o.attachEvent("on" + e, o[e + f]);
                 Util.EventCache.add(o, e, f);
             }
             else {
                 ae(o, e, f);
                 o['on' + e] = function () {
                     fe(o, e);
                 };
             }
         },
 
         /**
          * Remove a Javscript event from the given element with full browser compatiblity and plugs for any memory leaks.
          * @param {Node} o The object honoring the event.
          * @param {String} e The event name.
          * @param {Function} f The function to remove.
          *
          * @static
          * @function
          * @memberof Util
          * @name removeEvent
          * @fullname Remove Javascript Event
          */
         removeEvent : function (o, e, f) {
             Util.EventCache.remove(o, e, f);
         },
 
         /**
         * Uses the native browser window object to create a new window.
         * <p>
         * <strong>NOTE:</strong> This method will utilize DOM methodology only <em>truly</em> supported by desktop
         * browsers. While some mobile browsers may allow this call, most will not. Use with caution, in specific use
         * cases.
         * </p>
         *
         * @param {String} u The url of the popup to open.
         * @param {String} n The name of the popup window.
         * @param {Object} [o The object params. If an object is not provided, the browser defaults will be used.
         * @param {String} [o.lb]  Include location bar, (default is true).
         * @param {String} [o.mb] Include menu bar, (default is true).
         * @param {String} [o.rz] Allow resize, (default is true).
         * @param {String} [o.scb] Include scrollbars, (default is true).
         * @param {String} [o.stb] Include status bar, (default is true).
         * @param {String} [o.tb] Include toolbar, (default is true).
         * @param {int} [o.w] The value for the width of the popup window.
         * @param {int} [o.h] The value for the height of the popup window.
         * @param {int} [o.tp] The value for top. (NOT SUPPORTED YET)
         * @param {int} [o.lft] The value for the left position of the popup. (NOT SUPPORTED YET)
         * @param {int} [o.sx] The screen x value. (NOT SUPPORTED YET)
         * @param {int} [o.sy] The screen y value. (NOT SUPPORTED YET)
         * @param {String} [o.dp] The value for the dependent popup property (yes or no). (NOT SUPPORTED YET)
         * @param {String} [o.dr] The value for the directories property (yes or no). (NOT SUPPORTED YET)
         * @param {String} [o.fs] The value for the fullscreen property (yes or no). (NOT SUPPORTED YET)
         * @return <code>True</code> if the window popup was successful, <code>false</code> otherwise or if the client
         * does not support popup windows.
         *
         * @static
         * @function
         * @memberof Util
         * @name popup
         * @fullname Popup New Window
         */
         popup : function (u, n, o) {
             if (!window.open) {
                 return false;
             }
 
             var d = {
                 w : screen.width,
                 h : screen.height,
                 rz : true,
                 mb : true,
                 scb : true,
                 stb : true,
                 tb : true,
                 lb : true,
                 tp : null,
                 lft : null,
                 sx : null,
                 sy : null,
                 dp : "no",
                 dr : "no",
                 fs : "no"
             };
 
             function f(n, v)
             {
                 if (!v) {
                     return "";
                 }
                 return n + '=' + v + ',';
             }
 
             function fs() {
                 o = o || {};
                 var p, n = {};
                 for (p in d) {
                     if (p) {
                         n[p] = o[p] !== undefined ? o[p] : d[p];
                     }
                 }
                 return n;
             }
 
             o = fs();
             var p = f("dependent", o.dp) + f("directories", o.dr) + f("fullscreen", o.fs) + f("location", o.lb ? 1 : 0) + f("menubar", o.mb) + f("resizable", o.rz ? 1 : 0) + f("scrollbars", o.scb ? 1 : 0) + f("status", o.stb ? 1 : 0) + f("toolbar", o.tb ? 1 : 0) + f("top", o.tp) + f("left", o.lft) + f("width", o.w) + f("height", o.h) + f("screenX", o.sx) + f("screenY", o.sy);
             p = p.substring(0, p.length - 1);
             var nw = window.open(u, n, p);
             window.blur();
 
             if (nw.focus) {
                 nw.focus();
             }
 
             return true;
         },
         Convert : {},
         Cookie : {},
         Detect : {},
         i18n : {},
         Load : {},
         Pos : {},
         Style : {},
         Timeout : {}
     };
 }();
 
 /**
  * Insert a node after a specified node.
  * @param {Node} nn The new node to insert.
  * @param {Node} rn The reference node for insertion.
  *
  * @deprecated
  * @static
  * @global
  */
 function insertAfter(nn, rn) {
     Util.ia(nn, rn);
 }

 Util.addEvent(window, 'unload', Util.EventCache.flush);

 /*extern _gbt, Util*/

 /**
 * @fileOverview
 *
 * <h1>CSS Utility module and namespace</h1>
 * <p>This module assists with managing CSS selectors and classnames.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

 /**
 * Style Utility methods.
 * @namespace Util.Style
 * @global
 * @static
 */
 Util.Style = function() {

     return {
         /**
         * Indicates if an element has been applied with a single given CSS Classname.
         * @param {Node} e The element to evaluate.
         * @param {String} c The single CSS Classname to check.
         * @return {Boolean} True if the classname contains the given class, false otherwise.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name ccss
         * @fullname Contains CSS Class
         */
         ccss: function(e, c) {
             if (typeof (e.className) === 'undefined' || !e.className) {
                 return false;
             }
             var a = e.className.split(' ');
             for (var i = 0, b = a.length; i < b; i++) {
                 if (a[i] === c) {
                     return true;
                 }
             }
             return false;
         },

         /**
         * Adds a given CSS Classname to the given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to apply.
         * @return {Node} The element with the CSS Classname applied.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name acss
         * @fullname Add CSS Class
         */
         acss: function(e, c) {
             if (this.ccss(e, c)) {
                 return e;
             }
             e.className = (e.className ? e.className + ' ' : '') + c;
             return e;
         },

         /**
         * Removes a given CSS Classname from the given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to remove.
         * @return {Node} The element, with the CSS Classname removed.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name rcss
         * @fullname Remove CSS Class
         */
         rcss: function(e, c) {
             if (!this.ccss(e, c)) {
                 return e;
             }
             var a = e.className.split(' '), d = "";
             for (var i = 0, b = a.length; i < b; i++) {
                 var f = a[i];
                 if (f !== c) {
                     d += d.length > 0 ? (" " + f) : f;
                 }
             }
             e.className = d;
             return e;
         },

         /**
         * Toggles a given CSS Classname on a given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to toggle.
         * @return {Boolean} True if the element now contains the classname, false if it was removed.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name tcss
         * @fullname Toggle CSS Class
         */
         tcss: function(e, c) {
             if (this.ccss(e, c)) {
                 this.rcss(e, c);
                 return false;
             }
             else {
                 this.acss(e, c);
                 return true;
             }
         },

         /**
         * Clears any opacity setting back to whatever is defined in CSS.
         * @param {Node} e The element whose opacity setting should be reset.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name co
         * @fullname Clear Opacity
         */
         co: function(e) {
             e.style.MozOpacity = "";
             e.style.opacity = "";
             e.style.filter = "";
         },

         /**
         * Returns an array of elements with the designated classname.
         * @param {String} c The CSS classname.
         * @param {Node} [e] The parent element to search within, defaults to document.
         * @param {String} [t] The tagname to scope the results, defaults to all tags.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name g
         * @fullname Get Elements by Classname
         */
         g: function(c, e, t) {
             e = e || document;
             t = t || '*';
             var ns = [], es = _gbt(t, e), l = es.length;
             for (var i = 0, j = 0; i < l; i++) {
                 if (this.ccss(es[i], c)) {
                     ns[j] = es[i];
                     j++;
                 }
             }
             return ns;
         }
     };
 } ();
 
 Util.Pos = function () {

    return {
        /**
         * Returns the actual scrolled offset within the window.
         * @return {array} A Javascript array containing the distance scrolled within the window as [top distance, left distance].
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name gso
         * @fullname Get Scrolled Offset
         */
        gso : function () {
            var d = document, b = d.body, w = window, e = d.documentElement, et = e.scrollTop, bt = b.scrollTop, el = e.scrollLeft, bl = b.scrollLeft;
            if (typeof w.pageYOffset === "number") {
                return [w.pageYOffset, w.pageXOffset];
            }
            if (typeof et === "number") {
                if (bt > et || bl > el) {
                    return [bt, bl];
                }
                return [et, el];
            }
            return [bt, bl];
        },

        /**
         * Returns an array of offset parameters for a given element.
         * @param {Node} e The element to evaluate. If null, undefined or invalid, zeroed offsets are returned.
         * @return {array} A Javascript array of the given element's offsets, relative to any scrolled distance within the window,
         * indexed as [top, left, height, width].  The array will be zeroed out if the element provided is invalid.
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name goo
         * @fullname Get Object Offsets
         */
        goo : function (e) {
            if (e) {
                return [e.offsetTop, e.offsetLeft, e.offsetHeight, e.offsetWidth];
            }
            return [0, 0, 0, 0];
        },

        /**
         * Returns the true position of a given object by parsing the offset tree.
         * @param {Node} e The DOM element.
         * @return {array} A Javascript array containing the "true" top and left of the given element indexed as [top, left].  The
         * array will be zeroed out if the element provided is invalid.
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name gop
         * @fullname Get Object Position
         */
        gop : function (e) {
            var l = 0, t = 0;
            if (e.offsetParent)
            {
                l = e.offsetLeft;
                t = e.offsetTop;
                e = e.offsetParent;
                while (e)
                {
                    l += e.offsetLeft;
                    t += e.offsetTop;
                    e = e.offsetParent;
                }
            }
            return [t, l];
        },

        /**
         * Returns an array of size characteristics for the viewport.
         * @return {array} The size of the viewport as a Javascript array, indexed as [height, width].
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name gvs
         * @fullname Get Viewport Size
         */
        gvs : function () {
            var n = window, d = document, b = d.body, e = d.documentElement;
             // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
            if (typeof n.innerWidth !== 'undefined') {
                return [n.innerHeight, n.innerWidth];
            }
            // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
            else if (typeof e !== 'undefined' && typeof e.clientWidth !== 'undefined' && e.clientWidth !== 0) {
                return [e.clientHeight, e.clientWidth];
            }
            // older versions of IE
            else {
                return [b.clientHeight, b.clientWidth];
            }
        }
    };
}();

//////end healthe library

// The following functions were copied from Util.Core, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/

function getPosition(e) {
    e = e || window.event;
    var cursor = { x: 0, y: 0 };
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    }
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX +
                               (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY +
                               (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}

// The following functions were copied from Util.Style, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/

function gvs() {
    var n = window, d = document, b = d.body, e = d.documentElement;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof n.innerWidth !== 'undefined') {
        return [n.innerHeight, n.innerWidth];
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof e !== 'undefined' && typeof e.clientWidth !== 'undefined' && e.clientWidth !== 0) {
        return [e.clientHeight, e.clientWidth];
    }
    // older versions of IE
    else {
        return [b.clientHeight, b.clientWidth];
    }
}

function gso() {
    var d = document, b = d.body, w = window, e = d.documentElement, et = e.scrollTop, bt = b.scrollTop, el = e.scrollLeft, bl = b.scrollLeft;
    if (typeof w.pageYOffset === "number") {
        return [w.pageYOffset, w.pageXOffset];
    }
    if (typeof et === "number") {
        if (bt > et || bl > el) {
            return [bt, bl];
        }
        return [et, el];
    }
    return [bt, bl];
}
/**
 * The ModalDialog object contains information about the aspects of how the modal dialog will be created and what actions will take
 * place.  Depending on how the variables are set, the modal can flex based on the consumers needs.  Customizable options include the following;
 * size, modal title, onClose function, modal body content, variable footer buttons with dither options and onclick events.
 * @constructor
 */
function ModalDialog(modalId) {
	//The id given to the ModalDialog object.  Will be used to set/retrieve the modal dialog
	this.m_modalId = modalId;
	//A flag used to determine if the modal is active or not
	this.m_isModalActive = false;
	//A flag to determine if the modal should be fixed to the icon used to activate the modal
	this.m_isFixedToIcon = false;
	//A flag to determine if the modal dialog should grey out the background when being displayed or not.
	this.m_hasGrayBackground = true;
	//A flag to determine if the close icon should be shown or not
	this.m_showCloseIcon = true;

	//The margins object contains the margins that will be applied to the modal window.
	this.m_margins = {
		top: 5,
		right: 5,
		bottom: 5,
		left: 5
	};

	//The icon object contains information about the icon that the user will use to launch the modal dialog
	this.m_icon = {
		elementId: modalId + "icon",
		cssClass: "",
		text: "",
		hoverText: "",
		isActive: true
	};

	//The header object of the modal.  Contains all of the necessary information to render the header of the dialog
	this.m_header = {
		elementId: modalId + "header",
		title: "",
		closeFunction: null
	};

	//The body object of the modal.  Contains all of the necessary information to render the body of the dialog
	this.m_body = {
		elementId: modalId + "body",
		dataFunction: null,
		isBodySizeFixed: true
	};

	//The footer object of the modal.  Contains all of the necessary information to render the footer of the dialog
	this.m_footer = {
		isAlwaysShown: false,
		elementId: modalId + "footer",
		buttons: []
	};
}

/** Adders **/

/**
 * Adds a ModalButton object to the list of buttons that will be used in the footer of to modal dialog.
 * Only ModalButtons will be used, no other object type will be accepted.
 * @param {ModalButton} modalButton The button to add to the footer.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.addFooterButton = function(modalButton) {
	if(!( modalButton instanceof ModalButton)) {
		MP_Util.LogError("ModalDialog.addFooterButton: Cannot add footer button which isnt a ModalButton object.\nModalButtons can be created using the ModalDialog.createModalButton function.");
		return this;
	}

	if(!modalButton.getId()) {
		MP_Util.LogError("ModalDialog.addFooterButton: All ModalButton objects must have an id assigned");
		return this;
	}

	this.m_footer.buttons.push(modalButton);
	return this;
};

/** Checkers **/

/**
 * Checks to see if the modal dialog object has a gray background or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.hasGrayBackground = function() {
	return this.m_hasGrayBackground;
};

/**
 * Checks to see if the modal dialog object is active or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.isActive = function() {
	return this.m_isModalActive;
};

/**
 * Checks to see if the modal dialog body should have a fixed size or not
 * @return {boolean} True if the modal dialog body is a fixed size, false otherwise
 */
ModalDialog.prototype.isBodySizeFixed = function() {
	return this.m_body.isBodySizeFixed;
};

/**
 * Checks to see if the modal dialog footer should always be shown or not
 * @return {boolean} True if the modal dialog footer should always be shown
 */
ModalDialog.prototype.isFooterAlwaysShown = function() {
	return this.m_footer.isAlwaysShown;
};

/**
 * Checks to see if the modal dialog object is active or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.isFixedToIcon = function() {
	return this.m_isFixedToIcon;
};

/**
 * Checks to see if the modal dialog icon is active or not
 * @return {boolean} True if the modal dialog icon is active, false otherwise
 */
ModalDialog.prototype.isIconActive = function() {
	return this.m_icon.isActive;
};

/**
 * Checks to see if the close icon should be shown in the modal dialog
 * @return {boolean} True if the close icon should be shown, false otherwise
 */
ModalDialog.prototype.showCloseIcon = function() {
	return this.m_showCloseIcon;
};

/** Getters **/

/**
 * Retrieves the function that will be used when attempting to populate the content of the modal dialog body.
 * @return {function} The function used when loading the modal dialog body
 */
ModalDialog.prototype.getBodyDataFunction = function() {
	return this.m_body.dataFunction;
};

/**
 * Retrieves the id associated to the modal dialog body element
 * @return {string} The id associated to the modal dialog body element
 */
ModalDialog.prototype.getBodyElementId = function() {
	return this.m_body.elementId;
};

/**
 * Retrieves the percentage set for the bottom margin of the modal dialog
 * @return {number} The percentage assigned to the bottom margin for the modal dialog
 */
ModalDialog.prototype.getBottomMarginPercentage = function() {
	return this.m_margins.bottom;
};

/**
 * Retrieves the button identified by the id passed into the function
 * @param {string} buttonId The if of the ModalButton object to retrieve
 * @return {ModalButton} The modal button with the id of buttonId, else null
 */
ModalDialog.prototype.getFooterButton = function(buttonId) {
	var x = 0;
	var buttons = this.getFooterButtons();
	var buttonCnt = buttons.length;
	//Get the ModalButton
	for( x = buttonCnt; x--; ) {
		button = buttons[x];
		if(button.getId() === buttonId) {
			return buttons[x];
		}
	}
	return null;
};

/**
 * Retrieves the array of buttons which will be used in the footer of the modal dialog.
 * @return {ModalButton[]} An array of ModalButton objects which will be used in the footer of the modal dialog
 */
ModalDialog.prototype.getFooterButtons = function() {
	return this.m_footer.buttons;
};

/**
 * Retrieves the id associated to the modal dialog footer element
 * @return {string} The id associated to the modal dialog footer element
 */
ModalDialog.prototype.getFooterElementId = function() {
	return this.m_footer.elementId;
};

/**
 * Retrieves a boolean which determines if the modal dialog should display a gray background or not
 * @return {boolean} The flag which determines if this modal dialog should display a gray background
 */
ModalDialog.prototype.getHasGrayBackground = function() {
	return this.m_hasGrayBackground;
};

/**
 * Retrieves the function that will be used when the user attempts to close the modal dialog.
 * @return {function} The function used when closing the modal dialog
 */
ModalDialog.prototype.getHeaderCloseFunction = function() {
	return this.m_header.closeFunction;
};

/**
 * Retrieves the id associated to the modal dialog header element
 * @return {string} The id associated to the modal dialog header element
 */
ModalDialog.prototype.getHeaderElementId = function() {
	return this.m_header.elementId;
};

/**
 * Retrieves the title which will be used in the header of the modal dialog
 * @return {string} The title given to the modal dialog header element
 */
ModalDialog.prototype.getHeaderTitle = function() {
	return this.m_header.title;
};

/**
 * Retrieves the css class which will be applied to the html span used to open the modal dialog
 * @return {string} The css which will be applied to the html span used ot open the modal dialog
 */
ModalDialog.prototype.getIconClass = function() {
	return this.m_icon.cssClass;
};

/**
 * Retrieves the id associated to the modal dialog icon element
 * @return {string} The id associated to the modal dialog icon element
 */
ModalDialog.prototype.getIconElementId = function() {
	return this.m_icon.elementId;
};

/**
 * Retrieves the text which will be displayed the user hovers over the modal dialog icon
 * @return {string} The text displayed when hovering over the modal dialog icon
 */
ModalDialog.prototype.getIconHoverText = function() {
	return this.m_icon.hoverText;
};

/**
 * Retrieves the text which will be displayed next to the icon used to open the modal dialog
 * @return {string} The text displayed next to the icon
 */
ModalDialog.prototype.getIconText = function() {
	return this.m_icon.text;
};

/**
 * Retrieves the id given to this modal dialog object
 * @return {string} The id given to this modal dialog object
 */
ModalDialog.prototype.getId = function() {
	return this.m_modalId;
};

/**
 * Retrieves a boolean which determines if this modal dialog object is active or not
 * @return {boolean} The flag which determines if this modal dialog object is active or not
 */
ModalDialog.prototype.getIsActive = function() {
	return this.m_isModalActive;
};

/**
 * Retrieves a boolean which determines if this body of the modal dialog object has a fixed height or not
 * @return {boolean} The flag which determines if the body of the modal dialog object is fixed or not
 */
ModalDialog.prototype.getIsBodySizeFixed = function() {
	return this.m_body.isBodySizeFixed;
};

/**
 * Retrieves a boolean which determines if this modal dialog object is fixed to the icon used to launch it.
 * @return {boolean} The flag which determines if this modal dialog object is active or not
 */
ModalDialog.prototype.getIsFixedToIcon = function() {
	return this.m_isFixedToIcon;
};

/**
 * Retrieves a boolean which determines if this modal dialog footer is always shown or not.
 * @return {boolean} The flag which determines if this modal dialog footer is always shown or not.
 */
ModalDialog.prototype.getIsFooterAlwaysShown = function() {
	return this.m_footer.isAlwaysShown;
};

/**
 * Retrieves a boolean which determines if this modal dialog icon is active or not.  If the icon is not active it should
 * not be clickable by the user and the cursor should not change when hovered over.
 * @return {boolean} The flag which determines if modal dialog icon is active or not.
 */
ModalDialog.prototype.getIsIconActive = function() {
	return this.m_icon.isActive;
};

/**
 * Retrieves the percentage set for the left margin of the modal dialog
 * @return {number} The percentage assigned to the left margin for the modal dialog
 */
ModalDialog.prototype.getLeftMarginPercentage = function() {
	return this.m_margins.left;
};

/**
 * Retrieves the percentage set for the right margin of the modal dialog
 * @return {number} The percentage assigned to the right margin for the modal dialog
 */
ModalDialog.prototype.getRightMarginPercentage = function() {
	return this.m_margins.right;
};

/**
 * Retrieves a boolean which determines if the close icon should be shown in the modal dialog.
 * @return {boolean} The flag which determines if the close icon should be shown or not.
 */
ModalDialog.prototype.getShowCloseIcon = function() {
	return this.m_showCloseIcon;
};

/**
 * Retrieves the percentage set for the top margin of the modal dialog
 * @return {number} The percentage assigned to the top margin for the modal dialog
 */
ModalDialog.prototype.getTopMarginPercentage = function() {
	return this.m_margins.top;
};

/** Setters **/
/**
 * Sets the function to be called when the modal dialog is shown.  This function will be passed ModalDialog object so that
 * it can interact with the modal dialog easily while the dialog is open.
 * @param {function} dataFunc The function used to populate the body of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyDataFunction = function(dataFunc) {

	//Check the proposed function
	if(!( typeof dataFunc === "function") && dataFunc !== null) {
		MP_Util.LogError("ModalDialog.setBodyDataFunction: dataFunc param must be a function or null");
		return this;
	}

	this.m_body.dataFunction = dataFunc;
	return this;
};

/**
 * Sets the html element id of the modal dialog body.  This id will be used to insert html into the body of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getBodyElementId()).attr("id", elementId);
		}
		this.m_body.elementId = elementId;
	}
	return this;
};

/**
 * Sets the html of the body element.
 * @param {string} html The HTML to insert into the body element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyHTML = function(html) {
	if(html && typeof html == "string") {
		//Update the existing html iff the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getBodyElementId()).html(html);
		}
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the bottom margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the bottom margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBottomMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.bottom = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the close on click property of a specific button in the modal dialog.
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} closeOnClick A boolean used to determine if the button should close the dialog or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonCloseOnClick = function(buttonId, closeOnClick) {
	var button = null;
	var buttonElement = null;
	var onClickFunc = null;
	var modal = this;

	//check the closeOnClick type
	if(!( typeof closeOnClick === "boolean")) {
		MP_Util.LogError("ModalDialog.setFooterButtonCloseOnClick: closeOnClick param must be of type boolean");
		return this;
	}

	//Get the ModalButton
	button = this.getFooterButton(buttonId);
	if(button) {
		//Update the closeOnClick flag
		button.setCloseOnClick(closeOnClick);
		//If the modal dialog is active, update the existing class
		if(this.isActive()) {
			//Update the class of the object
			buttonElement = $("#" + buttonId);
			buttonElement.click(function() {
				onClickFunc = button.getOnClickFunction();
				if(onClickFunc && typeof onClickFunc == "function") {
					onClickFunc();
				}
				if(closeOnClick) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			});

		}
	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonCloseOnClick: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the dithered property of a specific button in the modal dialog
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} dithered A boolean used to determine if the button should be dithered or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonDither = function(buttonId, dithered) {
	var button = null;
	var buttonElement = null;

	//check the dithered type
	if(!( typeof dithered === "boolean")) {
		MP_Util.LogError("ModalDialog.setFooterButtonDither: Dithered param must be of type boolean");
		return this;
	}

	//Get the ModalButton
	button = this.getFooterButton(buttonId);
	if(button) {
		//Update the dithered flag
		button.setIsDithered(dithered);
		//If the modal dialog is active, update the existing class
		if(this.isActive()) {
			//Update the class of the object
			buttonElement = $("#" + buttonId);
			if(dithered) {
				$(buttonElement).attr("disabled", true);
			}
			else {
				$(buttonElement).attr("disabled", false);
			}
		}
	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonDither: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the onclick function of the footer button with the given buttonId
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} dithered A boolean used to determine if the button should be dithered or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonOnClickFunction = function(buttonId, clickFunc) {
	var button = null;
	var modal = this;

	//Check the proposed function and make sure it is a function
	if(!( typeof clickFunc == "function") && clickFunc !== null) {
		MP_Util.LogError("ModalDialog.setFooterButtonOnClickFunction: clickFunc param must be a function or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if(button) {
		//Set the onclick function of the button
		button.setOnClickFunction(clickFunc);
		//If the modal dialog is active, update the existing onClick function
		$("#" + buttonId).unbind("click").click(function() {
			if(clickFunc) {
				clickFunc();
			}
			if(button.closeOnClick()) {
				MP_ModalDialog.closeModalDialog(modal.getId());
			}
		});

	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonOnClickFunction: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the text displayed in the footer button with the given buttonId
 * @param {string} buttonId The id of the button to be dithered
 * @param {string} buttonText the text to display in the button
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonText = function(buttonId, buttonText) {
	var button = null;

	//Check the proposed text and make sure it is a string
	if(!( typeof buttonText === "string")) {
		MP_Util.LogError("ModalDialog.setFooterButtonText: buttonText param must be a string");
		return this;
	}

	//Check make sure the string is not empty
	if(!buttonText) {
		MP_Util.LogError("ModalDialog.setFooterButtonText: buttonText param must not be empty or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if(button) {
		//Set the onclick function of the button
		button.setText(buttonText);
		//If the modal dialog is active, update the existing onClick function
		$("#" + buttonId).html(buttonText);
	}
	else {
		MP_Util.LogError("ModalDialog.setFooterButtonText: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog footer.  This id will be used to interact with the footer of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getFooterElementId()).attr("id", elementId);
		}
		this.m_footer.elementId = elementId;
	}
	return this;
};

/**
 * Sets the indicator which determines if the icon to launch the modal dialog is active or not.  When this is
 * set, the icon and its interactions are updated if it is shown on the MPage.
 * @param {boolean} activeInd An indicator which determines if the modal dialog icon is active or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsIconActive = function(activeInd) {
	var modal = this;

	if( typeof activeInd == "boolean") {
		this.m_icon.isActive = activeInd;
		//Update the icon click event based on the indicator
		//Get the icon container and remove all events if there are any
		var iconElement = $("#" + this.getIconElementId());
		if(iconElement) {
			$(iconElement).unbind("click");
			$(iconElement).removeClass("vwp-util-icon");
			if(activeInd) {
				//Add the click event
				$(iconElement).click(function() {
					MP_ModalDialog.showModalDialog(modal.getId());
				});


				$(iconElement).addClass("vwp-util-icon");
			}
		}
	}
	return this;
};

/**
 * Sets the flag which determines if the modal dialog will have a gray backgound when rendered.  This property
 * will not update dynamically.
 * @param {boolean} hasGrayBackground The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHasGrayBackground = function(hasGrayBackground) {
	if( typeof hasGrayBackground == "boolean") {
		this.m_hasGrayBackground = hasGrayBackground;
	}
	return this;
};

/**
 * Sets the function to be called upon the user choosing to close the dialog via the exit button instead of one of the available buttons.
 * @param {function} closeFunc The function to call when the user closes the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderCloseFunction = function(closeFunc) {
	var modal = this;
	//Check the proposed function and make sure it is a function
	if(!( typeof closeFunc === "function") && closeFunc !== null) {
		MP_Util.LogError("ModalDialog.setHeaderCloseFunction: closeFunc param must be a function or null");
		return this;
	}

	//Update close function since it is valid
	this.m_header.closeFunction = closeFunc;

	//Update the header close function if the modal is active
	if(this.isActive()) {
		//Get the close element
		$('.dyn-modal-hdr-close').click(function() {
			if(closeFunc) {
				closeFunc();
			}
			//call the close mechanism of the modal dialog to cleanup everything
			MP_ModalDialog.closeModalDialog(modal.getId());
		});

	}
	return this;
};

/**
 * Sets the html element id of the modal dialog header.  This id will be used to interact with the header of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getHeaderElementId()).attr("id", elementId);
		}
		this.m_header.elementId = elementId;
	}
	return this;
};

/**
 * Sets the title to be displayed in the modal dialog header.
 * @param {string} headerTitle The string to be used in the modal dialog header as the title
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderTitle = function(headerTitle) {
	if(headerTitle && typeof headerTitle == "string") {
		this.m_header.title = headerTitle;
		//Update the existing header title if the modal dialog is active
		if(this.isActive()) {
			$('#' + this.getHeaderElementId() + " .dyn-modal-hdr-title").html(headerTitle);
		}
	}
	return this;
};

/**
 * Sets the css class to be used to display the modal dialog launch icon.  This class should contain a background and proper sizing
 * as to diaply the entire icon.
 * @param {string} iconClass The css class to be applied to the html element the user will use to launch the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconClass = function(iconClass) {
	if(iconClass && typeof iconClass == "string") {
		//Update the existing icon class
		$('#' + this.getIconElementId()).removeClass(this.m_icon.cssClass).addClass(iconClass);
		this.m_icon.cssClass = iconClass;
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog icon.  This id will be used to interact with the icon of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconElementId = function(elementId) {
	if(elementId && typeof elementId == "string") {
		//Update the existing element id if the modal dialog is active
		if(this.isActive()) {
			$("#" + this.getIconElementId()).attr("id", elementId);
		}
		this.m_icon.elementId = elementId;
	}
	return this;
};

/**
 * Sets the test which will be displayed to the user when hovering over the modal dialog icon.
 * @param {string} iconHoverText The text to display in the icon hover
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconHoverText = function(iconHoverText) {
	if(iconHoverText !== null && typeof iconHoverText == "string") {
		this.m_icon.hoverText = iconHoverText;
		//Update the icon hover text
		if($('#' + this.getIconElementId()).length > 0) {
			$('#' + this.getIconElementId()).attr("title", iconHoverText);
		}
	}
	return this;
};

/**
 * Sets the text to be displayed next to the modal dialog icon.
 * @param {string} iconText The text to display next to the modal dialog icon.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconText = function(iconText) {
	if(iconText !== null && typeof iconText == "string") {
		this.m_icon.text = iconText;
		//Update the icon text
		if($('#' + this.getIconElementId()).length > 0) {
			$('#' + this.getIconElementId()).html(iconText);
		}
	}
	return this;
};

/**
 * Sets the id which will be used to identify a particular ModalDialog object.
 * @param {string} id The id that will be assigned to this ModalDialog object
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setId = function(id) {
	if(id && typeof id == "string") {
		this.m_modalId = id;
	}
	return this;
};

/**
 * Sets the flag which identifies the modal dialog as being active or not
 * @param {boolean} activeInd A boolean that can be used to determine if the modal is active or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsActive = function(activeInd) {
	if( typeof activeInd == "boolean") {
		this.m_isModalActive = activeInd;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog body is a fixed height or not.
 * @param {boolean} bodyFixed A boolean that can be used to determine if the modal dialog has a fixed size body or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsBodySizeFixed = function(bodyFixed) {
	if( typeof bodyFixed == "boolean") {
		this.m_body.isBodySizeFixed = bodyFixed;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog is fixed to the icon or not.  If this flag is set
 * the modal dialog will be displayed as an extension of the icon used to launch the dialog, much like a popup window.
 * In this case the Top and Right margins are ignored and the location of the icon will determine those margins.  If this
 * flag is set to false the modal dialog window will be displayed according to all of the margin settings.
 * @param {boolean} fixedToIcon A boolean that can be used to determine if the modal is fixed to the launch icon or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsFixedToIcon = function(fixedToIcon) {
	if( typeof fixedToIcon == "boolean") {
		this.m_isFixedToIcon = fixedToIcon;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog footer is always shown or not
 * @param {boolean} footerAlwaysShown A boolean used to determine if the modal dialog footer is always shown or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsFooterAlwaysShown = function(footerAlwaysShown) {
	if( typeof footerAlwaysShown == "boolean") {
		this.m_footer.isAlwaysShown = footerAlwaysShown;
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the left margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the left margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setLeftMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.left = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the right margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the right margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setRightMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.right = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog close icon is shown or not
 * @param {boolean} showCloseIcon A boolean used to determine if the modal dialog close icon is shown or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setShowCloseIcon = function(showCloseIcon) {
	if( typeof showCloseIcon == "boolean") {
		this.m_showCloseIcon = showCloseIcon;
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the top margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the top margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setTopMarginPercentage = function(margin) {
	if( typeof margin == "number") {
		this.m_margins.top = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if(this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * The ModalButton class is used specifically for adding buttons to the footer of a modal dialog.
 * @constructor
 */
function ModalButton(buttonId) {
	//The id given to the button.  This id will be used to identify individual buttons
	this.m_buttonId = buttonId;
	//The text that will be displayed in the button itself
	this.m_buttonText = "";
	//A flag to determine if the button shall be disabled or not
	this.m_dithered = false;
	//The function to call when the button is clicked
	this.m_onClickFunction = null;
	//A flag to determine if this button should be closed when clicked.
	this.m_closeOnClick = true;
	//A flag to determine if this button should be focused when the modal dialog is shown
	this.m_focusInd = false;
}

/** Checkers **/
/**
 * Check to see if the button click should close the modal dialog on click
 * @return {boolean} A boolean which determines if the button click should cause the modal dialog to close
 */
ModalButton.prototype.closeOnClick = function() {
	return this.m_closeOnClick;
};

/**
 * Check to see if the Modal Button is currently dithered
 * @return {boolean} A boolean flag that indicates if the modal button is dithered or not
 */
ModalButton.prototype.isDithered = function() {
	return this.m_dithered;
};

/** Getters **/
/**
 * Retrieves the id assigned the this ModalButton object
 * @return {string} The id assigned to this ModalButton object
 */
ModalButton.prototype.getId = function() {
	return this.m_buttonId;
};

/**
 * Retrieve the close on click flag of the ModalButton object
 * @return {boolean} The close on click flag of the ModalButton object
 */
ModalButton.prototype.getCloseOnClick = function() {
	return this.m_closeOnClick;
};

/**
 * Retrieve the focus indicator flag of the ModalButton object
 * @return {boolean} The focus indicator flag of the ModalButton object
 */
ModalButton.prototype.getFocusInd = function() {
	return this.m_focusInd;
};

/**
 * Retrieves the text used for the ModalButton display
 * @return {string} The text which will be used in the button display
 */
ModalButton.prototype.getText = function() {
	return this.m_buttonText;
};

/**
 * Retrieves the onClick function associated to this Modal Button
 * @return {function} The function executed when the button is clicked
 */
ModalButton.prototype.getOnClickFunction = function() {
	return this.m_onClickFunction;
};

/** Setters **/

/**
 * Sets the id of the ModalButton object.  The id must be a string otherwise it is ignored.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setId = function(buttonId) {
	if(buttonId && typeof buttonId == "string") {
		this.m_buttonId = buttonId;
	}
	return this;
};

/**
 * Sets the close on click flag of the dialog button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setCloseOnClick = function(closeFlag) {
	if( typeof closeFlag == "boolean") {
		this.m_closeOnClick = closeFlag;
	}
	return this;
};

/**
 * Sets the focus indicator flag of the dialog button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setFocusInd = function(focusInd) {
	if( typeof focusInd == "boolean") {
		this.m_focusInd = focusInd;
	}
	return this;
};

/**
 * Sets the text which will be shown in the button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setText = function(buttonText) {
	if(buttonText && typeof buttonText == "string") {
		this.m_buttonText = buttonText;
	}
	return this;
};

/**
 * Sets the dithered status of the dialog button
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setIsDithered = function(dithered) {
	if( typeof dithered == "boolean") {
		this.m_dithered = dithered;
	}
	return this;
};

/**
 * Sets the onClick function for the ModalButton
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setOnClickFunction = function(clickFunc) {
	this.m_onClickFunction = clickFunc;
	return this;
};

/**
 * A collection of functions which can be used to maintain, create, destroy and update modal dialogs.
 * The MP_ModalDialog function keeps a copy of all of the ModalDialog objects that have been created
 * for the current view.  If a ModalDialog object is updated outside of these functions, the updated
 * version of the object should replace the stale version that is stored here by using the
 * updateModalDialogObject functionality.
 * @namespace
 */
var MP_ModalDialog = function() {
	var modalDialogObjects = {};
	var whiteSpacePixels = 26;

	//A inner function used to the resize event that can be added and also removed from the window
	var resizeFunction = function() {
		MP_ModalDialog.resizeAllModalDialogs();
	};

	return {
		/**
		 * This function will be used to add ModalDialog objects to the collection of ModalDialog objects for the current
		 * View.  This list of ModalDialog objects will be the one source of this type of object and will be used when
		 * showing modal dialogs.
		 * @param {ModalDialog} modalObject An instance of the ModalDialog object
		 */
		addModalDialogObject: function(modalObject) {
			var modalId = "";
			//Check that he object is not null and that the object type is ModalDialog
			if(!( modalObject instanceof ModalDialog)) {
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject only accepts objects of type ModalDialog");
				return false;
			}

			//Check for a valid id.
			modalId = modalObject.getId();
			if(!modalId) {
				//Modal id is not populated
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject: no/invalid ModalDialog id given");
				return false;
			}
			else if(modalDialogObjects[modalId]) {
				//Modal id is already in use
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject: modal dialog id" + modalId + " is already in use");
				return false;
			}

			//Add the ModalDialog Object to the list of ModalDialog objects
			modalDialogObjects[modalId] = modalObject;
		},

		/**
		 * Add the modal dialog icon to the viewpoint framework.  This icon will be responsible for
		 * launching the correct modal dialog based on the ModalDialog object that it is associated to.
		 * @param {string} modalDialogId The id of the ModalDialog object to reference when creating the modal dialog icon
		 * @return null
		 */
		addModalDialogOptionToViewpoint: function(modalDialogId) {
			var modalObj = null;
			var iconElement = null;
			var vwpUtilElement = null;

			//Check to see if the ModalDialog exists
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				return;
			}

			//Check to see if the modal utility has already been added to the viewpoint
			if($("#" + modalDialogId).length > 0) {
				MP_Util.LogError("MP_ModalDialog.addModalDialogObject: Modal dialog " + modalDialogId + " already added");
				return;
			}
			
			//If the MP_Viewpoint function is defined call it
			if(typeof MP_Viewpoint.addModalDialogUtility != 'undefined'){
				MP_Viewpoint.addModalDialogUtility(modalObj);
			}
		},

		/**
		 * Closes all of the associated modal dialog windows and removes the resize event listener
		 * @return null
		 */
		closeModalDialog: function(modalDialogId) {
			var modalObj = null;

			//Check to see if the ModalDialog exists
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				return;
			}

			//destroy the modal dialog
			$("#vwpModalDialog" + modalObj.getId()).remove();
			//destroy the modal background
			$("#vwpModalBackground" + modalObj.getId()).remove();
			//remove modal dialog resize event from the window
			$(window).unbind("resize", resizeFunction);
			//Mark the modal dialog as inactive
			modalObj.setIsActive(false);
			$("body").css("overflow","auto");
		},

		/**
		 * Deletes the modal dialog object with the id modalDialogId.
		 * @param {string} modalDialogId The id of the modal dialog object to be deleted
		 * @return {boolean} True if a ModalDialog object was deleted, false otherwise
		 */
		deleteModalDialogObject: function(modalDialogId) {
			if(modalDialogObjects[modalDialogId]) {
				modalDialogObjects[modalDialogId] = null;
				return true;
			}
			return false;
		},

		/**
		 * Retrieves the ModalDialog object with the id of modalDialogId
		 * @param {string} modalDialogId The id of the modal dialog object to retrieve
		 */
		retrieveModalDialogObject: function(modalDialogId) {
			if(modalDialogObjects[modalDialogId]) {
				return modalDialogObjects[modalDialogId];
			}
			return null;
		},

		/**
		 * Resizes all of the active modal dialogs when the window itself is being resized.
		 * @param {string} modalDialogId The id of the modal dialog object to resize
		 */
		resizeAllModalDialogs: function() {
			var tempObj = null;
			var attr = "";
			//Get all of the modal dialog objects from the modalDialogObjects collection
			for(attr in modalDialogObjects) {
				if(modalDialogObjects.hasOwnProperty(attr)) {
					tempObj = modalDialogObjects[attr];
					if(( tempObj instanceof ModalDialog) && tempObj.isActive()) {
						MP_ModalDialog.resizeModalDialog(tempObj.getId());
					}
				}
			}
		},

		/**
		 * Resizes the modal dialog when the window itself is being resized.
		 * @param {string} modalDialogId The id of the modal dialog object to resize
		 */
		resizeModalDialog: function(modalDialogId) {
			var docHeight = 0;
			var docWidth = 0;
			var topMarginSize = 0;
			var leftMarginSize = 0;
			var bottomMarginSize = 0;
			var rightMarginSize = 0;
			var modalWidth = "";
			var modalHeight = "";
			var modalObj = null;

			//Get the ModalDialog object
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				MP_Util.LogError("MP_ModalDialog.resizeModalDialog: No modal dialog with the id " + modalDialogId + "exists");
				return;
			}

			if(!modalObj.isActive()) {
				MP_Util.LogError("MP_ModalDialog.resizeModalDialog: this modal dialog is not active it cannot be resized");
				return;
			}

			//Determine the new margins and update accordingly
			docHeight = $(window).height();
			docWidth = $(document.body).width();
			topMarginSize = Math.floor(docHeight * (modalObj.getTopMarginPercentage() / 100));
			leftMarginSize = Math.floor(docWidth * (modalObj.getLeftMarginPercentage() / 100));
			bottomMarginSize = Math.floor(docHeight * (modalObj.getBottomMarginPercentage() / 100));
			rightMarginSize = Math.floor(docWidth * (modalObj.getRightMarginPercentage() / 100));
			modalWidth = (docWidth - leftMarginSize - rightMarginSize);
			modalHeight = (docHeight - topMarginSize - bottomMarginSize);
			$("#vwpModalDialog" + modalObj.getId()).css({
				"top": topMarginSize,
				"left": leftMarginSize,
				"width": modalWidth + "px"
			});

			//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
			if(modalObj.isBodySizeFixed()) {
				$("#vwpModalDialog" + modalObj.getId()).css("height", modalHeight + "px");
				$("#" + modalObj.getBodyElementId()).height(modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - whiteSpacePixels);
			}
			else {
				$("#vwpModalDialog" + modalObj.getId()).css("max-height", modalHeight + "px");
				$("#" + modalObj.getBodyElementId()).css("max-height", (modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - whiteSpacePixels) + "px");
			}

			//Make sure the modal background is resized as well
			$("#vwpModalBackground" + modalObj.getId()).css({
				"height": "100%",
				"width": "100%"
			});
		},

		/**
		 * Render and show the modal dialog based on the settings applied in the ModalDialog object referenced by the
		 * modalDialogId parameter.
		 * @param {string} modalDialogId The id of the ModalDialog object to render
		 * @return null
		 */
		showModalDialog: function(modalDialogId) {
			var bodyDiv = null;
			var bodyLoadFunc = null;
			var bottomMarginSize = 0;
			var button = null;
			var dialogDiv = null;
			var docHeight = 0;
			var docWidth = 0;
			var focusButtonId = "";
			var footerDiv = null;
			var footerButtons = [];
			var footerButtonsCnt = 0;
			var footerButtonContainer = null;
			var headerDiv = null;
			var leftMarginSize = 0;
			var modalDiv = null;
			var modalObj = null;
			var modalHeight = "";
			var modalWidth = "";
			var rightMarginSize = 0;
			var topMarginSize = 0;
			var x = 0;

			/**
			 * This function is used to create onClick functions for each button.  Using this function
			 * will prevent closures from applying the same action onClick function to all buttons.
			 */
			function createButtonClickFunc(buttonObj, modalDialogId) {
				var clickFunc = buttonObj.getOnClickFunction();
				var closeModal = buttonObj.closeOnClick();
				if(!clickFunc) {
					clickFunc = function() {
					};

				}
				return function() {
					clickFunc();
					if(closeModal) {
						MP_ModalDialog.closeModalDialog(modalDialogId);
					}
				};

			}

			//Get the ModalDialog object
			modalObj = modalDialogObjects[modalDialogId];
			if(!modalObj) {
				MP_Util.LogError("MP_ModalDialog.showModalDialog: No modal dialog with the id " + modalDialogId + "exists");
				return;
			}

			//Check to see if the modal dialog is already displayed.  If so, return
			if(modalObj.isActive()) {
				return;
			}

			//Create the modal window based on the ModalDialog object
			//Create the header div element
			headerDiv = $('<div></div>').attr({
				id: modalObj.getHeaderElementId()
			}).addClass("dyn-modal-hdr-container").append($('<span></span>').addClass("dyn-modal-hdr-title").html(modalObj.getHeaderTitle()));
			if(modalObj.showCloseIcon()) {
				headerDiv.append($('<span></span>').addClass("dyn-modal-hdr-close").click(function() {
					var closeFunc = null;
					//call the close function of the modalObj
					closeFunc = modalObj.getHeaderCloseFunction();
					if(closeFunc) {
						closeFunc();
					}
					//call the close mechanism of the modal dialog to cleanup everything
					MP_ModalDialog.closeModalDialog(modalDialogId);
				}));

			}

			//Create the body div element
			bodyDiv = $('<div></div>').attr({
				id: modalObj.getBodyElementId()
			}).addClass("dyn-modal-body-container");

			//Create the footer element if there are any buttons available
			footerButtons = modalObj.getFooterButtons();
			footerButtonsCnt = footerButtons.length;
			if(footerButtonsCnt) {
				footerDiv = $('<div></div>').attr({
					id: modalObj.getFooterElementId()
				}).addClass("dyn-modal-footer-container");
				footerButtonContainer = $('<div></div>').attr({
					id: modalObj.getFooterElementId() + "btnCont"
				}).addClass("dyn-modal-button-container");
				for( x = 0; x < footerButtonsCnt; x++) {
					button = footerButtons[x];
					buttonFunc = button.getOnClickFunction();
					footerButtonContainer.append($('<button></button>').attr({
						id: button.getId(),
						disabled: button.isDithered()
					}).addClass("dyn-modal-button").html(button.getText()).click(createButtonClickFunc(button, modalObj.getId())));

					//Check to see if we should focus on this button when loading the modal dialog
					if(!focusButtonId) {
						focusButtonId = (button.getFocusInd()) ? button.getId() : "";
					}
				}
				footerDiv.append(footerButtonContainer);
			}
			else if(modalObj.isFooterAlwaysShown()) {
				footerDiv = $('<div></div>').attr({
					id: modalObj.getFooterElementId()
				}).addClass("dyn-modal-footer-container");
				footerDiv.append(footerButtonContainer);
			}

			//determine the dialog size
			docHeight = $(window).height();
			docWidth = $(document.body).width();
			topMarginSize = Math.floor(docHeight * (modalObj.getTopMarginPercentage() / 100));
			leftMarginSize = Math.floor(docWidth * (modalObj.getLeftMarginPercentage() / 100));
			bottomMarginSize = Math.floor(docHeight * (modalObj.getBottomMarginPercentage() / 100));
			rightMarginSize = Math.floor(docWidth * (modalObj.getRightMarginPercentage() / 100));
			modalWidth = (docWidth - leftMarginSize - rightMarginSize);
			modalHeight = (docHeight - topMarginSize - bottomMarginSize);
			dialogDiv = $('<div></div>').attr({
				id: "vwpModalDialog" + modalObj.getId()
			}).addClass("dyn-modal-dialog").css({
				"top": topMarginSize,
				"left": leftMarginSize,
				"width": modalWidth + "px"
			}).append(headerDiv).append(bodyDiv).append(footerDiv);

			//Create the modal background if set in the ModalDialog object.
			modalDiv = $('<div></div>').attr({
				id: "vwpModalBackground" + modalObj.getId()
			}).addClass((modalObj.hasGrayBackground()) ? "dyn-modal-div" : "dyn-modal-div-clear").height($(document).height());

			//Add the flash function to the modal if using a clear background
			if(!modalObj.hasGrayBackground()) {
				modalDiv.click(function() {
					var modal = $("#vwpModalDialog" + modalObj.getId());
					$(modal).fadeOut(100);
					$(modal).fadeIn(100);
				});

			}

			//Add all of these elements to the document body
			$(document.body).append(modalDiv).append(dialogDiv);
			//Set the focus of a button if indicated
			if(focusButtonId) {
				$("#" + focusButtonId).focus();
			}
			//disable page scrolling when modal is enabled
			$("body").css("overflow", "hidden");

			//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
			if(modalObj.isBodySizeFixed()) {
				$(dialogDiv).css("height", modalHeight + "px");
				$(bodyDiv).height(modalHeight - $(headerDiv).height() - $(footerDiv).height() - whiteSpacePixels);
			}
			else {
				$(dialogDiv).css("max-height", modalHeight + "px");
				$(bodyDiv).css("max-height", (modalHeight - $(headerDiv).height() - $(footerDiv).height() - whiteSpacePixels) + "px");
			}

			//This next line makes the modal draggable.  If this is commented out updates will need to be made
			//to resize functions and also updates to the ModalDialog object to save the location of the modal
			//$(dialogDiv).draggable({containment: "parent"});

			//Mark the displayed modal as active and save its id
			modalObj.setIsActive(true);

			//Call the onBodyLoadFunction of the modal dialog
			bodyLoadFunc = modalObj.getBodyDataFunction();
			if(bodyLoadFunc) {
				bodyLoadFunc(modalObj);
			}

			//Attempt to resize the window as it is being resized
			$(window).resize(resizeFunction);
		},

		/**
		 * Updates the existing ModalDialog with a new instance of the object.  If the modal objet does not exist it is added to the collection
		 * @param {ModalDialog} modalObject The updated instance of the ModalDialog object.
		 * @return null
		 */
		updateModalDialogObject: function(modalObject) {
			var modalDialogId = "";

			//Check to see if we were passed a ModalDialog object
			if(!modalObject || !( modalObject instanceof ModalDialog)) {
				MP_Util.LogError("MP_ModalDialog.updateModalDialogObject only accepts objects of type ModalDialog");
				return;
			}

			//Blindly update the ModalDialog object.  If it didnt previously exist, it will now.
			modalDialogId = modalObject.getId();
			modalDialogObjects[modalDialogId] = modalObject;
			return;
		}

	};
}();

/**
 * Project: mp_component_defs
 * Version 1.0.0
 * Released 7/6/2010
 * @author Greg Howdeshell
 */

Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

Function.method('inherits', function(Parent) {
	var d = {}, p = (this.prototype = new Parent());
	this.method('uber', function uber(name) {
		if(!( name in d)) {
			d[name] = 0;
		}
		var f, r, t = d[name], v = Parent.prototype;
		if(t) {
			while(t) {
				v = v.constructor.prototype;
				t -= 1;
			}
			f = v[name];
		}
		else {
			f = p[name];
			if(f == this[name]) {
				f = v[name];
			}
		}
		d[name] += 1;
		r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d[name] -= 1;
		return r;
	});
	return this;
});
/**
 * Creates getters and setters for the class based on attributeName.
 *
 * Example:
 *
 * MyClass.createAttribute("Color", "blue");
 *
 * The call above will create this.getColor() and this.setColor(value).
 * A member variable mColor will also be created, with the default value of
 * "blue".
 *
 */
Function.prototype.createAttribute = function(attributeName, defaultValue) {
	this.prototype["m_" + attributeName] = defaultValue;

	this.prototype["get" + attributeName] = function() {
		return this["m_" + attributeName];
	};
	this.prototype["set" + attributeName] = function(value) {
		this["m_" + attributeName] = value;
	};
};
/**
 * MPageComponent constructor
 * @constructor
 */
function MPageComponent() {
	this.m_componentId = 0.0;
	this.m_reportId = 0;
	this.m_reportMean = "";
	this.m_label = "";
	this.m_subLabel = "";
	this.m_column = 0;
	this.m_sequence = 0;
	this.m_link = "";
	this.m_totalResults = false;
	this.m_xOFy = false;
	this.m_isExpanded = false;
	this.m_isAlwaysExpanded = false;
	this.m_scrollNumber = 0;
	this.m_isScrollEnabled = false;
	this.m_styles = null;
	this.m_groups = null;
	this.m_pageGroupSeq = 0;
	this.m_lookbackDays = 0;
	this.m_newLink = false;
	this.criterion = null;
	this.m_isPlusAdd = false;
	//m_scope: 1=person,2=encounter
	this.m_scope = 0;
	this.m_rootComponentNode = null;
	this.m_sectionContentNode = null;
	this.m_compLoadTimerName = "";
	this.m_compRenderTimerName = "";
	this.m_includeLineNumber = false;
	//m_lookbackUnitTypeFlag: 1 = hours,2=Days,3=Weeks,4= Months,5= Years
	this.m_lookbackUnitTypeFlag = 0;
	this.m_lookbackUnits = 0;
	this.m_brlookbackUnitTypeFlag = 0;
	this.m_brlookbackUnits = 0;
	//m_dateFormat: 1 = date only,2= date/time and 3 = elapsed time
	this.m_dateFormat = 2;
	this.m_isCustomizeView = false;
	this.m_menuItems = null;
	this.m_lookBackMenuItems = null;
	this.m_iViewMenuItems = null;
	this.m_displayFilters = null;
	this.m_AutoSuggestScript = "";
	this.m_AutoSuggestAddTimerName = "";
	this.m_editMode = false;
	this.m_compDisp = true;
	this.m_footerText = "";
	this.m_hasLookBackDropDown = false;
	this.m_ScopeHTML = "";
	this.m_compLoad = false;
	this.m_hasCompFilters = false;
	//m_grouper_arr: an array of objects structure like {"label":"group label", "eventSets": []}
	this.m_grouper_arr = [];
	this.m_grouperFilterLabel = "";
	this.m_grouperFilterCriteria = null;
	this.m_grouperFilterEventSets = null;
	this.m_grouperFilterCatLabel = "";
	this.m_grouperFilterCatalogCodes = null;
	this.m_selectedTimeFrame = null;
	this.m_selectedDataGroup = null;
	this.m_menuOptions = [];
	this.m_menuOptionNames = [];
	this.m_hasActionsMenu = false;
	this.m_resourceRequired = false;
	this.m_iViewItemsArr = [];
	this.m_toggleStatus = 1;
	//0 - component off, 1 - component on, 2 - component retuired

	MPageComponent.method("getHasActionsMenu", function() {
		return this.m_hasActionsMenu;
	});
	MPageComponent.method("setHasActionsMenu", function(value) {
		this.m_hasActionsMenu = value;
	});
	MPageComponent.method("getCompColor", function() {
		var style = this.getStyles();
		if(style) {
			return style.getColor();
		}
		else {
			return;
		}
	});
	MPageComponent.method("setCompColor", function(color) {
		var style = this.getStyles();
		if(style) {
			if(color && color.length > 0) {
				style.setColor(color);
			}
		}
	});
	MPageComponent.method("getMenuOptions", function() {
		return this.m_menuOptions;
	});
	MPageComponent.method("setMenuOptions", function(value) {
		if(value) {
			this.m_menuOptions = value;
		}
		else {
			this.m_menuOptions = [];
		}
	});
	MPageComponent.method("getMenuOptionNames", function() {
		return this.m_menuOptionNames;
	});
	MPageComponent.method("setMenuOptionNames", function(value) {
		if(value) {
			this.m_menuOptionNames = value;
		}
		else {
			this.m_menuOptionNames = [];
		}
	});
	MPageComponent.method("addMenuDither", function(itemName) {
		var menuItem = _g(this.m_menuOptions[itemName].id);
		if(menuItem) {
			Util.Style.acss(menuItem, "opts-menu-item-dthr");
			this.m_menuOptions[itemName].isMenuDithered = true;
		}
	});
	MPageComponent.method("removeMenuDither", function(itemName) {
		var menuItem = _g(this.m_menuOptions[itemName].id);
		if(menuItem) {
			Util.Style.rcss(menuItem, "opts-menu-item-dthr");
			this.m_menuOptions[itemName].isMenuDithered = false;
		}
	});
	MPageComponent.method("isMenuDithered", function(itemName) {
		return this.m_menuOptions[itemName].isMenuDithered;
	});
	MPageComponent.method("setMenuOptionText", function(itemName, text) {
		if(text) {
			this.m_menuOptions[itemName].text = text;
			var menuItem = _g(this.m_menuOptions[itemName].id);
			if(menuItem) {
				menuItem.innerHTML = text;
			}
		}
	});
	MPageComponent.method("addMenuOption", function(itemName, id, text, ditherOnLoad, evtType, fn) {
		var actionSec = _g("optsMenuActions" + this.m_componentId);
		if(actionSec) {
			if(!actionSec.hasChildNodes()) {
				var isMenuDithered = (ditherOnLoad) ? ditherOnLoad : false;
				this.m_menuOptions[itemName] = {
					itemName: itemName,
					id: id,
					text: text,
					ditherOnLoad: ditherOnLoad,
					isMenuDithered: isMenuDithered,
					evtType: evtType,
					fn: fn
				};
				this.m_menuOptionNames.push(itemName);
			}
		}
	});
	MPageComponent.method("createMenu", function() {
		var arr = this.m_menuOptionNames;
		var l = arr.length;
		var actionSec = _g("optsMenuActions" + this.m_componentId);
		if(actionSec) {
			if(actionSec.hasChildNodes()) {
				actionSec.innerHTML = "";
			}

			var d = Util.ce('div');
			for(var i = 0; i < l; i++) {
				var optClass = 'opts-menu-item';
				var curOpt = this.m_menuOptions[arr[i]];
				if(curOpt.ditherOnLoad) {
					optClass += ' opts-menu-item-dthr';
				}

				var t = Util.cep("div", {
					id: curOpt.id,
					className: optClass
				});
				t.innerHTML = curOpt.text;
				if(curOpt.evtType && typeof curOpt.fn === 'function') {

					Util.addEvent(t, curOpt.evtType, curOpt.fn);
				}
				d.appendChild(t);
			}

			if(l > 0) {
				var personalizeSec = _g("optsMenupersonalize" + this.m_componentId);
				if(personalizeSec) {
					Util.Style.acss(personalizeSec, "opts-personalize-sec-divider");
				}
			}
			actionSec.appendChild(d);
		}
	});
	MPageComponent.method("isDisplayable", function() {
		if(this.m_displayFilters !== null && this.m_displayFilters.length > 0) {
			for(var x = this.m_displayFilters.length; x--; ) {
				var displayFilter = this.m_displayFilters[x];
				if(displayFilter.checkFilters() === false) {
					CERN_EventListener.removeAllListeners(this, this);
					return false;
				}
			}
		}
		return this.m_compDisp;
	});

	MPageComponent.method("getDisplayFilters", function() {
		return this.m_displayFilters;
	});
	MPageComponent.method("setDisplayFilters", function(value) {
		this.m_displayFilters = value;
	});
	MPageComponent.method("addDisplayFilter", function(value) {
		if(this.m_displayFilters === null) {
			this.m_displayFilters = [];
		}
		this.m_displayFilters.push(value);
	});

	MPageComponent.method("getLookbackMenuItems", function() {
		return this.m_lookBackMenuItems;
	});
	MPageComponent.method("setLookbackMenuItems", function(value) {
		this.m_lookBackMenuItems = value;
	});
	MPageComponent.method("addLookbackMenuItem", function(value) {
		if(this.m_lookBackMenuItems === null) {
			this.m_lookBackMenuItems = [];
		}
		this.m_lookBackMenuItems.push(value);
	});

	MPageComponent.method("getIViewMenuItems", function() {
		return this.m_iViewMenuItems;
	});
	MPageComponent.method("setIViewMenuItems", function(value) {
		this.m_iViewMenuItems = value;
	});
	MPageComponent.method("addIViewMenuItem", function(value) {
		if(this.m_iViewMenuItems === null) {
			this.m_iViewMenuItems = [];
		}
		this.m_iViewMenuItems.push(value);
	});

	MPageComponent.method("getMenuItems", function() {
		return this.m_menuItems;
	});
	MPageComponent.method("setMenuItems", function(value) {
		this.m_menuItems = value;
	});
	MPageComponent.method("addMenuItem", function(value) {
		if(this.m_menuItems === null) {
			this.m_menuItems = [];
		}
		this.m_menuItems.push(value);
	});

	MPageComponent.method("getCustomizeView", function() {
		return this.m_isCustomizeView;
	});
	MPageComponent.method("setCustomizeView", function(value) {
		this.m_isCustomizeView = value;
	});

	MPageComponent.method("InsertData", function() {
		alert("ERROR: InsertData has not been implemented within the component");
	});
	MPageComponent.method("HandleSuccess", function() {
		alert("ERROR: HandleSuccess has not been implemented within the component");
	});
	MPageComponent.method("RetrieveRequiredResource", function() {
		alert("ERROR: RetrieveRequiredResource has not been implemented within the component");
	});
	MPageComponent.method("openTab", function() {
		alert("ERROR: openTab has not been implemented within the component");
	});
	MPageComponent.method("isIViewAdd", function() {
	});

	MPageComponent.method("getComponentLoadTimerName", function() {
		return (this.m_compLoadTimerName);
	});
	MPageComponent.method("setComponentLoadTimerName", function(value) {
		this.m_compLoadTimerName = value;
	});
	MPageComponent.method("getComponentRenderTimerName", function() {
		return (this.m_compRenderTimerName);
	});
	MPageComponent.method("setComponentRenderTimerName", function(value) {
		this.m_compRenderTimerName = value;
	});
	MPageComponent.method("getRootComponentNode", function() {
		if(this.m_rootComponentNode === null) {
			var style = this.getStyles();
			this.m_rootComponentNode = _g(style.getId());
		}
		return (this.m_rootComponentNode);
	});
	MPageComponent.method("setRootComponentNode", function(value) {
		this.m_rootComponentNode = value;
	});
	MPageComponent.method("getSectionContentNode", function() {
		if(this.m_sectionContentNode === null) {
			var style = this.getStyles();
			this.m_sectionContentNode = _g(style.getContentId());
		}
		return (this.m_sectionContentNode);
	});
	MPageComponent.method("setSectionContentNode", function(value) {
		this.m_sectionContentNode = value;
	});
	MPageComponent.method("getMPageName", function() {
		return (this.m_MPageName);
	});
	MPageComponent.method("setMPageName", function(value) {
		this.m_MPageName = value;
	});

	MPageComponent.method("getScope", function() {
		return (this.m_scope);
	});
	MPageComponent.method("setScope", function(value) {
		this.m_scope = value;
	});
	MPageComponent.method("isPlusAddEnabled", function() {
		return (this.m_isPlusAdd);
	});
	MPageComponent.method("setPlusAddEnabled", function(value) {
		this.m_isPlusAdd = value;
	});
	/**
	 * For each compoent a criterion is defined for usage.  This criterion contains information such
	 * as the person, encounter, personnel, etc.
	 * @return {Criterion} Returns a Criterion object containing information such as the patient, encounter, personnel.
	 */
	MPageComponent.method("getCriterion", function() {
		return (this.criterion);
	});
	/**
	 * Sets the criterion
	 * @param {Criterion} value The Criterion object in which to initialize the component with.
	 */
	MPageComponent.method("setCriterion", function(value) {
		this.criterion = value;
	});
	/**
	 *
	 */
	MPageComponent.method("isNewLink", function() {
		return (this.m_newLink);
	});
	MPageComponent.method("setNewLink", function(value) {
		this.m_newLink = value;
	});
	MPageComponent.method("getPageGroupSequence", function() {
		return (this.m_pageGroupSeq);
	});
	MPageComponent.method("setPageGroupSequence", function(value) {
		this.m_pageGroupSeq = value;
	});
	MPageComponent.method("getLookbackDays", function() {
		return (this.m_lookbackDays);
	});
	MPageComponent.method("setLookbackDays", function(value) {
		this.m_lookbackDays = value;
	});

	MPageComponent.method("getComponentId", function() {
		return (this.m_componentId);
	});
	MPageComponent.method("setComponentId", function(value) {
		this.m_componentId = value;
		var styles = this.getStyles();
		if(styles !== null) {
			styles.setComponentId(value);
		}
	});
	MPageComponent.method("getReportId", function() {
		return (this.m_reportId);
	});
	MPageComponent.method("setReportId", function(value) {
		this.m_reportId = value;
	});
	MPageComponent.method("getReportMean", function() {
		return (this.m_reportMean);
	});
	MPageComponent.method("setReportMean", function(value) {
		this.m_reportMean = value;
	});
	MPageComponent.method("getLabel", function() {
		return (this.m_label);
	});
	MPageComponent.method("setLabel", function(value) {
		this.m_label = value;
	});
	MPageComponent.method("updateLabel", function(value) {
		this.m_label = value;
		var rootComponentNode = this.getRootComponentNode();
		var secHead = Util.gc(rootComponentNode, 0);
		var secTitle = Util.gc(Util.Style.g('sec-title', secHead, 'span')[0], 0);
		var anchor = _gbt("a", secTitle);
		if(anchor[0]) {//If secTitle is a link update the link
			anchor[0].innerHTML = value;
		}
		else {//otherwise update just the title
			secTitle.innerHTML = value;
		}
	});
	MPageComponent.method("getSubLabel", function() {
		return (this.m_subLabel);
	});
	MPageComponent.method("setSubLabel", function(value) {
		this.m_subLabel = value;
	});
	MPageComponent.method("updateSubLabel", function(value) {
		//Update the Label sub header
		this.m_subLabel = value;
		var rootComponentNode = this.getRootComponentNode();
		var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
		totalCount[0].innerHTML = this.m_subLabel;
	});
	MPageComponent.method("getColumn", function() {
		return (this.m_column);
	});
	MPageComponent.method("setColumn", function(value) {
		this.m_column = value;
	});
	MPageComponent.method("getSequence", function() {
		return (this.m_sequence);
	});
	MPageComponent.method("setSequence", function(value) {
		this.m_sequence = value;
	});
	MPageComponent.method("getLink", function() {
		return (this.m_link);
	});
	MPageComponent.method("setLink", function(value) {
		this.m_link = value;
	});
	/**
	 * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
	 */
	MPageComponent.method("isResultsDisplayEnabled", function() {
		return (this.m_totalResults);
	});
	/**
	 * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
	 */
	MPageComponent.method("setResultsDisplayEnabled", function(value) {
		this.m_totalResults = value;
	});
	/**
	 * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
	 */
	MPageComponent.method("isXofYEnabled", function() {
		return (this.m_xOFy);
	});
	/**
	 * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
	 */
	MPageComponent.method("setXofYEnabled", function(value) {
		this.m_xOFy = value;
	});
	MPageComponent.method("isExpanded", function() {
		return (this.m_isExpanded);
	});
	MPageComponent.method("setExpanded", function(value) {
		this.m_isExpanded = value;
	});
	MPageComponent.method("setExpandCollapseState", function(value) {
		this.m_isExpanded = value;
		var i18nCore = i18n.discernabu;
		var parentNode = this.getRootComponentNode();
		var expColNode = Util.Style.g("sec-hd-tgl", parentNode, "span");
		if(value) {
			Util.Style.rcss(parentNode, "closed");
			expColNode[0].innerHTML = "-";
			expColNode[0].title = i18nCore.HIDE_SECTION;
		}
		else {
			Util.Style.acss(parentNode, "closed");
			expColNode[0].innerHTML = "+";
			expColNode[0].title = i18nCore.SHOW_SECTION;
		}
	});
	MPageComponent.method("isAlwaysExpanded", function() {
		return (this.m_isAlwaysExpanded);
	});
	MPageComponent.method("setAlwaysExpanded", function(value) {
		this.m_isAlwaysExpanded = value;
	});
	MPageComponent.method("getScrollNumber", function() {
		return (this.m_scrollNumber);
	});
	MPageComponent.method("setScrollNumber", function(value) {
		this.m_scrollNumber = value;
	});
	MPageComponent.method("isScrollingEnabled", function() {
		return (this.m_isScrollEnabled);
	});
	MPageComponent.method("setScrollingEnabled", function(value) {
		this.m_isScrollEnabled = value;
	});
	MPageComponent.method("getStyles", function() {
		return (this.m_styles);
	});
	MPageComponent.method("setStyles", function(value) {
		this.m_styles = value;
	});
	MPageComponent.method("getFilters", function() {
		return (this.m_filters);
	});
	MPageComponent.method("getGroups", function() {
		if(this.m_groups === null) {
			this.m_groups = [];
		}
		return (this.m_groups);
	});
	MPageComponent.method("setGroups", function(value) {
		this.m_groups = value;
	});
	MPageComponent.method("addGroup", function(value) {
		if(this.m_groups === null) {
			this.m_groups = [];
		}
		this.m_groups.push(value);
	});

	MPageComponent.method("getLookbackUnitTypeFlag", function() {
		return (this.m_lookbackUnitTypeFlag);
	});
	MPageComponent.method("setLookbackUnitTypeFlag", function(value) {
		this.m_lookbackUnitTypeFlag = value;
	});
	MPageComponent.method("getLookbackUnits", function() {
		return (this.m_lookbackUnits);
	});
	MPageComponent.method("setLookbackUnits", function(value) {
		this.m_lookbackUnits = value;
	});
	MPageComponent.method("getBrLookbackUnitTypeFlag", function() {
		return (this.m_brlookbackUnitTypeFlag);
	});
	MPageComponent.method("setBrLookbackUnitTypeFlag", function(value) {
		this.m_brlookbackUnitTypeFlag = value;
	});
	MPageComponent.method("getBrLookbackUnits", function() {
		return (this.m_brlookbackUnits);
	});
	MPageComponent.method("setBrLookbackUnits", function(value) {
		this.m_brlookbackUnits = value;
	});
	/**
	 * Return true if the component has been defined as including the line number within the
	 * title text of the component.
	 */
	MPageComponent.method("isLineNumberIncluded", function() {
		return this.m_includeLineNumber;
	});
	/**
	 * Allows each component to define, based on requirements, whether or not to display the number of
	 * line items within the title text of the component.
	 * @param {Boolean} value If true, the line number associated to the component will display within the
	 * title text of the component.  Else, the line number will not display within the title text of the
	 * component.
	 */
	MPageComponent.method("setIncludeLineNumber", function(value) {
		this.m_includeLineNumber = value;
	});
	MPageComponent.method("getDateFormat", function() {
		//1 = date only,2= date/time and 3 = elapsed time
		return (this.m_dateFormat);
	});
	MPageComponent.method("setDateFormat", function(value) {
		this.m_dateFormat = value;
	});
	MPageComponent.method("setAutoSuggestAddScript", function(value) {
		this.m_AutoSuggestScript = value;
	});
	MPageComponent.method("getAutoSuggestAddScript", function() {
		return (this.m_AutoSuggestScript);
	});
	MPageComponent.method("setAutoSuggestAddTimerName", function(value) {
		this.m_AutoSuggestAddTimerName = value;
	});
	MPageComponent.method("getAutoSuggestAddTimerName", function() {
		return (this.m_AutoSuggestAddTimerName);
	});
	MPageComponent.method("setEditMode", function(value) {
		this.m_editMode = value;
	});
	MPageComponent.method("isEditMode", function() {
		return (this.m_editMode);
	});
	MPageComponent.method("setDisplayEnabled", function(value) {
		this.m_compDisp = value;
	});
	MPageComponent.method("getDisplayEnabled", function() {
		return (this.m_compDisp);
	});
	MPageComponent.method("setFooterText", function(value) {
		this.m_footerText = value;
	});
	MPageComponent.method("getFooterText", function() {
		return (this.m_footerText);
	});
	MPageComponent.method("hasLookBackDropDown", function() {
		return (this.m_hasLookBackDropDown);
	});
	MPageComponent.method("setLookBackDropDown", function(value) {
		this.m_hasLookBackDropDown = value;
	});
	MPageComponent.method("setScopeHTML", function(value) {
		this.m_ScopeHTML = value;
	});
	MPageComponent.method("getScopeHTML", function() {
		return (this.m_ScopeHTML);
	});
	MPageComponent.method("isLoaded", function() {
		return (this.m_compLoad);
	});
	MPageComponent.method("setLoaded", function(value) {
		this.m_compLoad = value;
	});
	MPageComponent.method("hasCompFilters", function() {
		return (this.m_hasCompFilters);
	});
	MPageComponent.method("setCompFilters", function(value) {
		this.m_hasCompFilters = value;
	});
	MPageComponent.method("getGrouperFilterLabel", function() {
		return this.m_grouperFilterLabel;
	});
	MPageComponent.method("setGrouperFilterLabel", function(value) {
		this.m_grouperFilterLabel = value;
	});
	MPageComponent.method("getGrouperFilterEventSets", function() {
		return (this.getGrouperFilterCriteria());
	});
	MPageComponent.method("setGrouperFilterEventSets", function(value) {
		this.setGrouperFilterCriteria(value);
	});
	MPageComponent.method("addGrouperFilterEventSets", function(value) {
		this.addGrouperFilterCriteria(value);
	});
	MPageComponent.method("getGrouperFilterCriteria", function() {
		return this.m_grouperFilterCriteria;
	});
	MPageComponent.method("setGrouperFilterCriteria", function(value) {
		this.m_grouperFilterCriteria = value;
	});
	MPageComponent.method("addGrouperFilterCriteria", function(value) {
		if(this.m_grouperFilterCriteria === null) {
			this.m_grouperFilterCriteria = [];
		}
		this.m_grouperFilterCriteria.push(value);
	});
	MPageComponent.method("getGrouperFilterCatLabel", function() {
		return this.m_grouperFilterCatLabel;
	});
	MPageComponent.method("setGrouperFilterCatLabel", function(value) {
		this.m_grouperFilterCatLabel = value;
	});
	MPageComponent.method("getGrouperFilterCatalogCodes", function() {
		return this.m_grouperFilterCatalogCodes;
	});
	MPageComponent.method("setGrouperFilterCatalogCodes", function(value) {
		this.m_grouperFilterCatalogCodes = value;
	});
	MPageComponent.method("addGrouperFilterCatalogCodes", function(value) {
		if(this.m_grouperFilterCatalogCodes === null) {
			this.m_grouperFilterCatalogCodes = [];
		}
		this.m_grouperFilterCatalogCodes.push(value);
	});
	MPageComponent.method("setGrp1Label", function(value) {
		this.setGrouperLabel(0, value);
	});
	MPageComponent.method("getGrp1Label", function() {
		return this.getGrouperLabel(0);
	});
	MPageComponent.method("setGrp1EventSets", function(value) {
		this.setGrouperCriteria(0, value);
	});
	MPageComponent.method("getGrp1EventSets", function() {
		return this.getGrouperCriteria(0);
	});
	MPageComponent.method("setGrp1Criteria", function(value) {
		this.setGrouperCriteria(0, value);
	});
	MPageComponent.method("getGrp1Criteria", function() {
		return this.getGrouperCriteria(0);
	});
	MPageComponent.method("setGrp2Label", function(value) {
		this.setGrouperLabel(1, value);
	});
	MPageComponent.method("getGrp2Label", function() {
		return this.getGrouperLabel(1);
	});
	MPageComponent.method("setGrp2EventSets", function(value) {
		this.setGrouperCriteria(1, value);
	});
	MPageComponent.method("getGrp2EventSets", function() {
		return this.getGrouperCriteria(1);
	});
	MPageComponent.method("setGrp2Criteria", function(value) {
		this.setGrouperCriteria(1, value);
	});
	MPageComponent.method("getGrp2Criteria", function() {
		return this.getGrouperCriteria(1);
	});
	MPageComponent.method("setGrp3Label", function(value) {
		this.setGrouperLabel(2, value);
	});
	MPageComponent.method("getGrp3Label", function() {
		return this.getGrouperLabel(2);
	});
	MPageComponent.method("setGrp3EventSets", function(value) {
		this.setGrouperCriteria(2, value);
	});
	MPageComponent.method("getGrp3EventSets", function() {
		return this.getGrouperCriteria(2);
	});
	MPageComponent.method("setGrp3Criteria", function(value) {
		this.setGrouperCriteria(2, value);
	});
	MPageComponent.method("getGrp3Criteria", function() {
		return this.getGrouperCriteria(2);
	});
	MPageComponent.method("setGrp4Label", function(value) {
		this.setGrouperLabel(3, value);
	});
	MPageComponent.method("getGrp4Label", function() {
		return this.getGrouperLabel(3);
	});
	MPageComponent.method("setGrp4EventSets", function(value) {
		this.setGrouperCriteria(3, value);
	});
	MPageComponent.method("getGrp4EventSets", function() {
		return this.getGrouperCriteria(3);
	});
	MPageComponent.method("setGrp4Criteria", function(value) {
		this.setGrouperCriteria(3, value);
	});
	MPageComponent.method("getGrp4Criteria", function() {
		return this.getGrouperCriteria(3);
	});
	MPageComponent.method("setGrp5Label", function(value) {
		this.setGrouperLabel(4, value);
	});
	MPageComponent.method("getGrp5Label", function() {
		return this.getGrouperLabel(4);
	});
	MPageComponent.method("setGrpEventSets", function(value) {
		this.setGrouperCriteria(4, value);
	});
	MPageComponent.method("getGrp5EventSets", function() {
		return this.getGrouperCriteria(4);
	});
	MPageComponent.method("setGrp5Criteria", function(value) {
		this.setGrouperCriteria(4, value);
	});
	MPageComponent.method("getGrp5Criteria", function() {
		return this.getGrouperCriteria(4);
	});
	MPageComponent.method("setGrp6Label", function(value) {
		this.setGrouperLabel(5, value);
	});
	MPageComponent.method("getGrp6Label", function() {
		return this.getGrouperLabel(5);
	});
	MPageComponent.method("setGrp6EventSets", function(value) {
		this.setGrouperCriteria(5, value);
	});
	MPageComponent.method("getGrp6EventSets", function() {
		return this.getGrouperCriteria(5);
	});
	MPageComponent.method("setGrp6Criteria", function(value) {
		this.setGrouperCriteria(5, value);
	});
	MPageComponent.method("getGrp6Criteria", function() {
		return this.getGrouperCriteria(5);
	});
	MPageComponent.method("setGrp7Label", function(value) {
		this.setGrouperLabel(6, value);
	});
	MPageComponent.method("getGrp7Label", function() {
		return this.getGrouperLabel(6);
	});
	MPageComponent.method("setGrp7EventSets", function(value) {
		this.setGrouperCriteria(6, value);
	});
	MPageComponent.method("getGrp7EventSets", function() {
		return this.getGrouperCriteria(6);
	});
	MPageComponent.method("setGrp7Criteria", function(value) {
		this.setGrouperCriteria(6, value);
	});
	MPageComponent.method("getGrp7Criteria", function() {
		return this.getGrouperCriteria(6);
	});
	MPageComponent.method("setGrp8Label", function(value) {
		this.setGrouperLabel(7, value);
	});
	MPageComponent.method("getGrp8Label", function() {
		return this.getGrouperLabel(7);
	});
	MPageComponent.method("setGrp8EventSets", function(value) {
		this.setGrouperCriteria(7, value);
	});
	MPageComponent.method("getGrp8EventSets", function() {
		return this.getGrouperCriteria(7);
	});
	MPageComponent.method("setGrp8Criteria", function(value) {
		this.setGrouperCriteria(7, value);
	});
	MPageComponent.method("getGrp8Criteria", function() {
		return this.getGrouperCriteria(7);
	});
	MPageComponent.method("setGrp9Label", function(value) {
		this.setGrouperLabel(8, value);
	});
	MPageComponent.method("getGrp9Label", function() {
		return this.getGrouperLabel(8);
	});
	MPageComponent.method("setGrp9EventSets", function(value) {
		this.setGrouperCriteria(8, value);
	});
	MPageComponent.method("getGrp9EventSets", function() {
		return this.getGrouperCriteria(8);
	});
	MPageComponent.method("setGrp9Criteria", function(value) {
		this.setGrouperCriteria(8, value);
	});
	MPageComponent.method("getGrp9Criteria", function() {
		return this.getGrouperCriteria(8);
	});
	MPageComponent.method("setGrp10Label", function(value) {
		this.setGrouperLabel(9, value);
	});
	MPageComponent.method("getGrp10Label", function() {
		return this.getGrouperLabel(9);
	});
	MPageComponent.method("setGrp10EventSets", function(value) {
		this.setGrouperCriteria(9, value);
	});
	MPageComponent.method("getGrp10EventSets", function() {
		return this.getGrouperCriteria(9);
	});
	MPageComponent.method("setGrp10Criteria", function(value) {
		this.setGrouperCriteria(9, value);
	});
	MPageComponent.method("getGrp10Criteria", function() {
		return this.getGrouperCriteria(9);
	});
	MPageComponent.method("setGrp1CatLabel", function(value) {
		this.setGrouperCatLabel(0, value);
	});
	MPageComponent.method("getGrp1CatLabel", function() {
		return this.getGrouperCatLabel(0);
	});
	MPageComponent.method("setGrp1CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(0, value);
	});
	MPageComponent.method("getGrp1CatalogCodes", function() {
		return this.getGrouperCatalogCodes(0);
	});
	MPageComponent.method("setGrp2CatLabel", function(value) {
		this.setGrouperCatLabel(1, value);
	});
	MPageComponent.method("getGrp2CatLabel", function() {
		return this.getGrouperCatLabel(1);
	});
	MPageComponent.method("setGrp2CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(1, value);
	});
	MPageComponent.method("getGrp2CatalogCodes", function() {
		return this.getGrouperCatalogCodes(1);
	});
	MPageComponent.method("setGrp3CatLabel", function(value) {
		this.setGrouperCatLabel(2, value);
	});
	MPageComponent.method("getGrp3CatLabel", function() {
		return this.getGrouperCatLabel(2);
	});
	MPageComponent.method("setGrp3CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(2, value);
	});
	MPageComponent.method("getGrp3CatalogCodes", function() {
		return this.getGrouperCatalogCodes(2);
	});
	MPageComponent.method("setGrp4CatLabel", function(value) {
		this.setGrouperCatLabel(3, value);
	});
	MPageComponent.method("getGrp4CatLabel", function() {
		return this.getGrouperCatLabel(3);
	});
	MPageComponent.method("setGrp4CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(3, value);
	});
	MPageComponent.method("getGrp4CatalogCodes", function() {
		return this.getGrouperCatalogCodes(3);
	});
	MPageComponent.method("setGrp5CatLabel", function(value) {
		this.setGrouperCatLabel(4, value);
	});
	MPageComponent.method("getGrp5CatLabel", function() {
		return this.getGrouperCatLabel(4);
	});
	MPageComponent.method("setGrp5CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(4, value);
	});
	MPageComponent.method("getGrp5CatalogCodes", function() {
		return this.getGrouperCatalogCodes(4);
	});
	MPageComponent.method("setGrp6CatLabel", function(value) {
		this.setGrouperCatLabel(5, value);
	});
	MPageComponent.method("getGrp6CatLabel", function() {
		return this.getGrouperCatLabel(5);
	});
	MPageComponent.method("setGrp6CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(5, value);
	});
	MPageComponent.method("getGrp6CatalogCodes", function() {
		return this.getGrouperCatalogCodes(5);
	});
	MPageComponent.method("setGrp7CatLabel", function(value) {
		this.setGrouperCatLabel(6, value);
	});
	MPageComponent.method("getGrp7CatLabel", function() {
		return this.getGrouperCatLabel(6);
	});
	MPageComponent.method("setGrp7CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(6, value);
	});
	MPageComponent.method("getGrp7CatalogCodes", function() {
		return this.getGrouperCatalogCodes(6);
	});
	MPageComponent.method("setGrp8CatLabel", function(value) {
		this.setGrouperCatLabel(7, value);
	});
	MPageComponent.method("getGrp8CatLabel", function() {
		return this.getGrouperCatLabel(7);
	});
	MPageComponent.method("setGrp8CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(7, value);
	});
	MPageComponent.method("getGrp8CatalogCodes", function() {
		return this.getGrouperCatalogCodes(7);
	});
	MPageComponent.method("setGrp9CatLabel", function(value) {
		this.setGrouperCatLabel(8, value);
	});
	MPageComponent.method("getGrp9CatLabel", function() {
		return this.getGrouperCatLabel(8);
	});
	MPageComponent.method("setGrp9CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(8, value);
	});
	MPageComponent.method("getGrp9CatalogCodes", function() {
		return this.getGrouperCatalogCodes(8);
	});
	MPageComponent.method("setGrp10CatLabel", function(value) {
		this.setGrouperCatLabel(9, value);
	});
	MPageComponent.method("getGrp10CatLabel", function() {
		return this.getGrouperCatLabel(9);
	});
	MPageComponent.method("setGrp10CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(9, value);
	});
	MPageComponent.method("getGrp10CatalogCodes", function() {
		return this.getGrouperCatalogCodes(9);
	});

	MPageComponent.method("setGrouperLabel", function(index, label) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].label = label;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].label = label;
			}
		}
	});
	MPageComponent.method("getGrouperLabel", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].label : "";
		}
	});
	MPageComponent.method("setGrouperEventSets", function(index, EventSetItem) {
		this.setGrouperCriteria(index, EventSetItem);
	});
	MPageComponent.method("getGrouperEventSets", function(index) {
		return this.getGrouperCriteria(index);
	});
	MPageComponent.method("setGrouperCriteria", function(index, Criteria) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].criteria = Criteria;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].criteria = Criteria;
			}
		}
	});
	MPageComponent.method("getGrouperCriteria", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].criteria : "";
		}
	});

	MPageComponent.method("setGrouperCatLabel", function(index, label) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].catLabel = label;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].catLabel = label;
			}
		}
	});
	MPageComponent.method("getGrouperCatLabel", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].catLabel : "";
		}
	});

	MPageComponent.method("setGrouperCatalogCodes", function(index, CatalogCodeItem) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].catalogCodes = CatalogCodeItem;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].catalogCodes = CatalogCodeItem;
			}
		}
	});
	MPageComponent.method("getGrouperCatalogCodes", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].catalogCodes : "";
		}
	});

	MPageComponent.method("setIViewItemsArrElement", function(index, sBandName, sSectionName, sItemName) {
		if(index !== null && !isNaN(index)) {
			this.m_iViewItemsArr[index] = {
				bandName: sBandName,
				sectionName: sSectionName,
				itemName: sItemName
			};
		}
	});
	MPageComponent.method("getIViewItemsArrElement", function(index, nameSelect) {
		if(index !== null && !isNaN(index)) {
			switch(nameSelect) {
				case "BAND":
					return (this.m_iViewItemsArr[index]) ? this.m_iViewItemsArr[index].bandName : "";
				case "SECTION":
					return (this.m_iViewItemsArr[index]) ? this.m_iViewItemsArr[index].sectionName : "";
				case "ITEM":
					return (this.m_iViewItemsArr[index]) ? this.m_iViewItemsArr[index].itemName : "";
				default:
					return "";
			}
		}
	});
	MPageComponent.method("sortGrouperArrayByLabel", function() {
		this.m_grouper_arr.sort(function(a, b) {
			if(a["label"] && b["label"]) {
				a = a["label"].toUpperCase();
				b = b["label"].toUpperCase();
				if(a < b) {
					return -1;
				}
				else {
					if(a === b) {
						return 0;
					}
					else {
						return 1;
					}
				}
			}
			else if(a["catLabel"] && b["catLabel"]) {
				a = a["catLabel"].toUpperCase();
				b = b["catLabel"].toUpperCase();
				if(a < b) {
					return -1;
				}
				else {
					if(a === b) {
						return 0;
					}
					else {
						return 1;
					}
				}
			}
			else if(a["label"] || a["catLabel"]) {
				return 1;
			}
			else {
				return -1;
			}
		});
	});
	MPageComponent.method("getSelectedTimeFrame", function() {
		return (this.m_selectedTimeFrame);
	});
	MPageComponent.method("setSelectedTimeFrame", function(value) {
		this.m_selectedTimeFrame = value;
	});
	MPageComponent.method("getSelectedDataGroup", function() {
		return (this.m_selectedDataGroup);
	});
	MPageComponent.method("setSelectedDataGroup", function(value) {
		this.m_selectedDataGroup = value;
	});
	MPageComponent.method("isResourceRequired", function() {
		return (this.m_resourceRequired);
	});
	MPageComponent.method("setResourceRequired", function(value) {
		this.m_resourceRequired = value;
	});
	MPageComponent.method("renderAccordion", function(component) {
		var i18nCore = i18n.discernabu;
		var mnuDisplay = i18nCore.FACILITY_DEFINED_VIEW;
		var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
		var compID = component.getComponentId();
		var style = component.getStyles();
		var ns = style.getNameSpace();
		var styleId = style.getId();
		var loc = component.getCriterion().static_content;
		var mnuId = styleId + "TypeMenu";
		var z = 0;

		component.sortGrouperArrayByLabel();

		//User Prefs:  If user prefs available then set display type and filter applied msg appropriately
		if(component.getGrouperFilterCriteria()) {
			mnuDisplay = component.getGrouperFilterLabel();
			var filterAppliedSpan = _g("cf" + compID + "msg");
			if(filterAppliedSpan) {
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if(component.getGrouperFilterLabel() !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compID, "msg' class='filter-applied-msg' title='", component.getGrouperFilterLabel(), "'>", i18nCore.FILTER_APPLIED, "</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compID);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
		}
		if(component.getGrouperFilterCatalogCodes()) {
			mnuDisplay = component.getGrouperFilterCatLabel();
			var filterAppliedSpan = _g("cf" + compID + "msg");
			if(filterAppliedSpan) {
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if(component.getGrouperFilterCatLabel() !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compID, "msg' class='filter-applied-msg' title='", component.getGrouperFilterCatLabel(), "'>", i18nCore.FILTER_APPLIED, "</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compID);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
		}
		//Find the content div
		var contentDiv = _g("Accordion" + compID + "ContentDiv");

		//Create the new content div innerHTML with the select list
		var contentDivArr = [];
		var groupLen = component.m_grouper_arr.length;
		contentDivArr.push("<div id='cf", mnuId, "' class='acc-mnu'>");
		contentDivArr.push("<span id='cflabel", compID, "' onclick='MP_Util.LaunchMenu(\"", mnuId, "\", \"", styleId, "\");'>", i18nCore.FILTER_LABEL, mnuDisplay, "<a id='compFilterDrop", compID, "'><img src='", loc, "\\images\\3943_16.gif'></a></span>");
		contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='acc-mnu-contentbox'>");
		contentDivArr.push("<div><span id='cf", styleId, "' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compID, ",\"", dispVar, "\",\"\",1);'>", i18nCore.FACILITY_DEFINED_VIEW, "</span></div>");
		for( z = 0, c = 0; c < groupLen && z < 10; z++) {
			if(component.getGrouperLabel(z)) {
				c++;
				var esIndex = z;
				contentDivArr.push("<div><span id='cf", styleId, z, "' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compID, ",\"", component.getGrouperLabel(z), "\",", esIndex, ",1);'>", component.getGrouperLabel(z), "</span></div>");
			}
			if(component.getGrouperCatLabel(z)) {
				c++;
				var esIndex = z;
				contentDivArr.push("<div><span id='cf", styleId, z, "' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compID, ",\"", component.getGrouperCatLabel(z), "\",", esIndex, ",1);'>", component.getGrouperCatLabel(z), "</span></div>");
			}
		}
		contentDivArr.push("</div></div></div>");
		contentDiv.innerHTML = contentDivArr.join('');
	});
	MPageComponent.method("setToggleStatus", function(toggleStatus) {
		if( typeof toggleStatus === "string") {
			this.m_toggleStatus = parseInt(togleStatus, 10);
		}
		else if( typeof toggleStatus === "number") {
			this.m_toggleStatus = toggleStatus;
		}
	});
	MPageComponent.method("getToggleStatus", function() {
		return this.m_toggleStatus;
	});
	/**
	 * This function will be used to handle any processing that needs to take place prior to the component being rendered
	 */
	MPageComponent.method("postProcessing", function() {
		//Resize the component appropriately if it is shown within a workflow
		this.resizeComponent();
		
		//Any additional functionality that needs to happen after the component is rendered can happen here.
	});
	/**
	 * This function will be used to resize the component based on the type.
	 */
	MPageComponent.method("resizeComponent", function() {
		var calcHeight = "";
		var compHeight = 0;
		var compDOMObj = null;
		var compType = null;
		var container = null;
		var contentBodyHeight = 0;
		var contentBodyObj = null;
		var miscHeight = 20;
		var viewHeight = 0;
		
		compType = this.getStyles().getComponentType();
		switch(compType){
			//case CERN_COMPONENT_TYPE_SUMMARY:
				//return;
			case CERN_COMPONENT_TYPE_WORKFLOW:
				container = $("#vwpBody");
				if(!container.length){
					return;
				}
				viewHeight = $(container).height();
				
				//Make sure component is rendered
				compDOMObj = $("#" + this.getStyles().getId());
				if(!compDOMObj.length){
					return;
				}
				
				//Get the overall height of the content-body section if available at this time
				contentBodyObj = $(compDOMObj).find(".content-body");
				if(contentBodyObj.length){
					//Get the overall component height
					compHeight = compDOMObj.height();
					//Get the height of the content-body
					contentBodyHeight = $(contentBodyObj).height();
					//Calculate the estimated max height of the components content-body element
					calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight)) + "px";
					//apply the max-height settings
					$(contentBodyObj).css("max-height", calcHeight).css("overflow-y", "auto");
				}
				return;
			default:
				return;
		}
	});
}

function MPageComponentInteractive() {
	this.m_DocPrivObj = null;
	this.m_DocPrivMask = 0;

	MPageComponentInteractive.method("setPrivObj", function(value) {
		this.m_DocPrivObj = value;
	});
	MPageComponentInteractive.method("getDocPrivObj", function() {
		return (m_DocPrivObj);
	});
	MPageComponentInteractive.method("setIsCompViewable", function(value) {
		this.m_isCompViewable = value;
	});
	MPageComponentInteractive.method("setIsCompAddable", function(value) {
		this.m_isCompAddable = value;
	});
	MPageComponentInteractive.method("setIsCompModifiable", function(value) {
		this.m_isCompModifiable = value;
	});
	MPageComponentInteractive.method("setIsCompUnchartable", function(value) {
		this.m_isCompUnchartable = value;
	});
	MPageComponentInteractive.method("setIsCompSignable", function(value) {
		this.m_isCompSignable = value;
	});
	MPageComponentInteractive.method("getCompPrivMask", function() {
		var VIEW_MASK = parseInt("1", 2);
		var ADD_MASK = parseInt("10", 2);
		var MODIFY_MASK = parseInt("100", 2);
		var UNCHART_MASK = parseInt("1000", 2);
		var SIGN_MASK = parseInt("10000", 2);
		var privMask = 0;
		privMask = ((this.m_isCompViewable) ? VIEW_MASK : 0) | //Add View Privs if true
		((this.m_isCompAddable) ? ADD_MASK : 0) | //Add Add Privs if true
		((this.m_isCompModifiable) ? MODIFY_MASK : 0) | //Add Mod Privs if true
		((this.m_isCompUnchartable) ? UNCHART_MASK : 0) | //Add Uchart Privs if true
		((this.m_isCompSignable) ? SIGN_MASK : 0);
		//Add Sign Privs if true

		return (privMask);
	});

	MPageComponentInteractive.method("getPrivFromArray", function(eventCd, array) {
		var i = array.length;
		while(i--) {
			if(eventCd == array[i].EVENT_CD) {
				return (true);
			}
		}
		return (false);
	});

	MPageComponentInteractive.method("isResultEventCodeSignable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.VIEW_RESULTS.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});

	MPageComponentInteractive.method("isResultEventCodeAddable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.ADD_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});
	MPageComponentInteractive.method("isResultEventCodeModifiable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.MODIFY_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});
	MPageComponentInteractive.method("isResultEventCodeUnchartable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.UNCHART_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});
	MPageComponentInteractive.method("isResultEventCodeSignable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.SIGN_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});

	MPageComponentInteractive.method("getEventCdPrivs", function(component, eventArr) {
		var criterion = this.getCriterion();
		var paramEventCd = MP_Util.CreateParamArray(eventArr, 1);
		var paramPrivMask = this.getCompPrivMask();
		var sendAr = ["^MINE^", criterion.provider_id + ".0", paramEventCd, "0.0", paramPrivMask, criterion.ppr_cd + ".0"];
		var request = new MP_Core.ScriptRequest(this, "ENG:MPG.MPCINTERACTIVE - Get Doc prefs");
		request.setParameters(sendAr);
		request.setName("getCompPrivs");
		request.setProgramName("MP_GET_PRIVS_BY_CODE_JSON");
		request.setAsync(false);
		MP_Core.XMLCCLRequestCallBack(component, request, this.processEventCdReply);

	});

	MPageComponentInteractive.method("processEventCdReply", function(reply) {
		m_DocPrivObj = reply;
	});
}

MPageComponentInteractive.inherits(MPageComponent);

/*
 * The MPage grouper provides a means in which to group MPageGroups together into an
 * array for results such as Blood Pressure where each group is a sequence of events.
 */
function MPageGrouper() {
	this.m_groups = null;
	MPageGrouper.method("setGroups", function(value) {
		this.m_groups = value;
	});
	MPageGrouper.method("getGroups", function() {
		return this.m_groups;
	});
	MPageGrouper.method("addGroup", function(value) {
		if(this.m_groups === null) {
			this.m_groups = [];
		}
		this.m_groups.push(value);
	});
}

MPageGrouper.inherits(MPageGroup);

function MPageGroup() {
	this.m_groupName = "";
	this.m_groupSeq = 0;
	this.m_groupId = 0;
	MPageGroup.method("setGroupId", function(value) {
		this.m_groupId = value;
	});
	MPageGroup.method("getGroupId", function() {
		return this.m_groupId;
	});
	MPageGroup.method("setGroupName", function(value) {
		this.m_groupName = value;
	});
	MPageGroup.method("getGroupName", function() {
		return this.m_groupName;
	});
	MPageGroup.method("setSequence", function(value) {
		this.m_groupSeq = value;
	});
	MPageGroup.method("getSequence", function() {
		return this.m_groupSeq;
	});
}

function MPageEventSetGroup() {
	this.m_eventSets = null;
	this.m_isSequenced = false;
	MPageEventSetGroup.method("isSequenced", function() {
		return this.m_isSequenced;
	});
	MPageEventSetGroup.method("setSequenced", function(value) {
		this.m_isSequenced = value;
	});
	MPageEventSetGroup.method("getEventSets", function() {
		return this.m_eventSets;
	});
	MPageEventSetGroup.method("setEventSets", function(value) {
		this.m_eventSets = value;
	});
	MPageEventSetGroup.method("addEventSet", function(value) {
		if(this.m_eventSets === null) {
			this.m_eventSets = [];
		}
		this.m_eventSets.push(value);
	});
}

MPageEventSetGroup.inherits(MPageGroup);

function MPageCatalogCodeGroup() {
	this.m_catalogCodes = null;
	this.m_isSequenced = false;
	MPageCatalogCodeGroup.method("isSequenced", function() {
		return this.m_isSequenced;
	});
	MPageCatalogCodeGroup.method("setSequenced", function(value) {
		this.m_isSequenced = value;
	});
	MPageCatalogCodeGroup.method("getCatalogCodes", function() {
		return this.m_catalogCodes;
	});
	MPageCatalogCodeGroup.method("setCatalogCodes", function(value) {
		this.m_catalogCodes = value;
	});
	MPageCatalogCodeGroup.method("addCatalogCode", function(value) {
		if(this.m_catalogCodes === null) {
			this.m_catalogCodes = [];
		}
		this.m_catalogCodes.push(value);
	});
}

MPageCatalogCodeGroup.inherits(MPageGroup);

function MPageEventCodeGroup() {
	this.m_eventCodes = null;
	this.m_isSequenced = false;
	MPageEventCodeGroup.method("isSequenced", function() {
		return this.m_isSequenced;
	});
	MPageEventCodeGroup.method("setSequenced", function(value) {
		this.m_isSequenced = value;
	});
	MPageEventCodeGroup.method("getEventCodes", function() {
		return this.m_eventCodes;
	});
	MPageEventCodeGroup.method("setEventCodes", function(value) {
		this.m_eventCodes = value;
	});
	MPageEventCodeGroup.method("addEventCode", function(value) {
		if(this.m_eventCodes === null) {
			this.m_eventCodes = [];
		}
		this.m_eventCodes.push(value);
	});
}

MPageEventCodeGroup.inherits(MPageGroup);

function MPageCodeValueGroup() {
	this.m_codes = null;
	MPageCodeValueGroup.method("getCodes", function() {
		return this.m_codes;
	});
	MPageCodeValueGroup.method("setCodes", function(value) {
		this.m_codes = value;
	});
	MPageCodeValueGroup.method("addCode", function(value) {
		if(this.m_codes === null) {
			this.m_codes = [];
		}
		this.m_codes.push(value);
	});
}

MPageCodeValueGroup.inherits(MPageGroup);

//The MPageSequenceGroup is a grouper of items such as filter means, event codes, event sets, etc.
function MPageSequenceGroup() {
	this.m_items = null;
	this.m_mapItems = null;
	this.m_isMultiType = false;
	MPageSequenceGroup.method("getItems", function() {
		return this.m_items;
	});
	MPageSequenceGroup.method("setItems", function(value) {
		this.m_items = value;
	});
	MPageSequenceGroup.method("addItem", function(value) {
		if(this.m_items === null) {
			this.m_items = [];
		}
		this.m_items.push(value);
	});
	MPageSequenceGroup.method("setMultiValue", function(value) {
		this.m_isMultiType = value;
	});
	MPageSequenceGroup.method("isMultiValue", function() {
		return (this.m_isMultiType);
	});
	MPageSequenceGroup.method("getMapItems", function() {
		return this.m_mapItems;
	});
	MPageSequenceGroup.method("setMapItems", function(value) {
		this.m_mapItems = value;
	});
}

MPageSequenceGroup.inherits(MPageGroup);

function MPageGroupValue() {
	this.m_id = 0.0;
	this.m_name = "";

	MPageGroupValue.method("getId", function() {
		return this.m_id;
	});
	MPageGroupValue.method("setId", function(value) {
		this.m_id = value;
	});
	MPageGroupValue.method("getName", function() {
		return this.m_name;
	});
	MPageGroupValue.method("setName", function(value) {
		this.m_name = value;
	});
}

var CERN_COMPONENT_TYPE_SUMMARY = 1;
var CERN_COMPONENT_TYPE_WORKFLOW = 2;

function ComponentStyle() {
	this.m_nameSpace = "";
	this.m_id = "";
	this.m_className = "section";
	this.m_contentId = "";
	this.m_contentClass = "sec-content";
	this.m_headerClass = "sec-hd";
	this.m_headToggle = "sec-hd-tgl";
	this.m_secTitle = "sec-title";
	this.m_aLink = "";
	this.m_secTotal = "sec-total";
	this.m_info = "";
	this.m_subSecHeaderClass = "sub-sec-hd";
	this.m_subSecTitleClass = "sub-sec-title";
	this.m_subSecContentClass = "sub-sec-content";
	this.m_contentBodyClass = "content-body";
	this.m_searchBoxDiv = "search-box-div";
	this.m_subTitleDisp = "sub-title-disp";
	// If a component may be on a page multiple times, a unique identifier such as the component id will need to be set on the style
	// The unique identifier is only utilized on styles that are placeholders to be replaced at a later point.
	this.m_componentId = 0;
	this.m_color = "";
	//This is the component type which determines how it will be rendered in the View
	this.m_componentType = null;

	/**
	 * Initializes the component style with the provided namespace to utilize throughout the component.
	 * @param {Object} value
	 */
	ComponentStyle.method("initByNamespace", function(value) {
		this.m_nameSpace = value;
		this.m_id = value;
		this.m_className += (" " + value + "-sec");
		this.m_contentId = value + "Content";
		this.m_aLink = value + "Link";
		this.m_info = value + "-info";
	});

	ComponentStyle.method("getNameSpace", function() {
		return this.m_nameSpace;
	});
	ComponentStyle.method("getId", function() {
		return this.m_id + this.m_componentId;
	});
	ComponentStyle.method("getClassName", function() {
		return this.m_className;
	});
	ComponentStyle.method("getColor", function() {
		return this.m_color;
	});
	ComponentStyle.method("getContentId", function() {
		return this.m_contentId + this.m_componentId;
	});
	ComponentStyle.method("getContentBodyClass", function() {
		return this.m_contentBodyClass;
	});
	ComponentStyle.method("getContentClass", function() {
		return this.m_contentClass;
	});
	ComponentStyle.method("getHeaderClass", function() {
		return this.m_headerClass;
	});
	ComponentStyle.method("getHeaderToggle", function() {
		return this.m_headToggle;
	});
	ComponentStyle.method("getTitle", function() {
		return this.m_secTitle;
	});
	ComponentStyle.method("getLink", function() {
		return this.m_aLink;
	});
	ComponentStyle.method("getTotal", function() {
		return this.m_secTotal;
	});
	ComponentStyle.method("getInfo", function() {
		return this.m_info;
	});
	ComponentStyle.method("getSearchBoxDiv", function() {
		return this.m_searchBoxDiv;
	});
	ComponentStyle.method("getSubSecContentClass", function() {
		return this.m_subSecContentClass;
	});
	ComponentStyle.method("getSubSecContentClass", function() {
		return this.m_subSecContentClass;
	});
	ComponentStyle.method("getSubSecHeaderClass", function() {
		return this.m_subSecHeaderClass;
	});
	ComponentStyle.method("getSubSecTitleClass", function() {
		return this.m_subSecTitleClass;
	});
	ComponentStyle.method("getSubTitleDisp", function() {
		return this.m_subTitleDisp;
	});
	ComponentStyle.method("getComponentType", function() {
		return this.m_componentType;
	});
	ComponentStyle.method("setComponentId", function(value) {
		this.m_componentId = value;
	});
	ComponentStyle.method("setNameSpace", function(value) {
		this.m_nameSpace = value;
	});
	ComponentStyle.method("setId", function(value) {
		this.m_id = value;
	});
	ComponentStyle.method("setClassName", function(value) {
		this.m_className = value;
	});
	ComponentStyle.method("setColor", function(value) {
		this.m_color = value;
		this.setClassName(this.getClassName() + " " + value);
	});
	ComponentStyle.method("setContextId", function(value) {
		this.m_contentId = value;
	});
	ComponentStyle.method("setContentBodyClass", function(value) {
		this.m_contentBodyClass = value;
	});
	ComponentStyle.method("setContentClass", function(value) {
		this.m_contentClass = value;
	});
	ComponentStyle.method("setContextClass", function(value) {
		this.m_contentClass = value;
	});
	ComponentStyle.method("setHeaderClass", function(value) {
		this.m_headerClass = value;
	});
	ComponentStyle.method("setHeaderToggle", function(value) {
		this.m_headToggle = value;
	});
	ComponentStyle.method("setSearchBoxDiv", function(value) {
		this.m_searchBoxDiv = value;
	});
	ComponentStyle.method("setSubSecContentClass", function(value) {
		this.m_subSecContentClass = value;
	});
	ComponentStyle.method("setSubSecHeaderClass", function(value) {
		this.m_subSecHeaderClass = value;
	});
	ComponentStyle.method("setSubSecTitleClass", function(value) {
		this.m_subSecTitleClass = value;
	});
	ComponentStyle.method("setSubTitleDisp", function(value) {
		this.m_subTitleDisp = value;
	});
	ComponentStyle.method("setTitle", function(value) {
		this.m_secTitle = value;
	});
	ComponentStyle.method("setLink", function(value) {
		this.m_aLink = value;
	});
	ComponentStyle.method("setTotal", function(value) {
		this.m_secTotal = value;
	});
	ComponentStyle.method("setInfo", function(value) {
		this.m_info = value;
	});
	ComponentStyle.method("setComponentType", function(value) {
		this.m_componentType = value;
	});
}

/**
 * The MPageView object
 * @constructor
 * @author Greg Howdeshell
 * @author Steven Lewis
 */
function MPageView() {

	/*Variables*/
	this.banner = true;
	this.components = null;
	this.componentIds = null;
	this.criterion = null;
	this.helpFileName = "";
	this.helpFileURL = "https://wiki.ucern.com/display/r1mpagesHP/MPages+Help+Pages";
	this.isCustomizeView = false;
	this.m_categoryMean = "";
	this.m_capTimerName = "";
	this.m_csEnabled = false;
	this.m_dpEnabled = false;
	this.m_filterMappingsObj = {};
	this.m_helpFilePath = "";
	this.m_helpFileURL = "";
	this.m_isCustomizeEnabled = true;
	this.m_pageSettings = null;
	this.m_printableReportName = null;
	this.m_subTimerName = "";
	this.m_titleAnchors = null;
	this.name = null;
	this.pageId = 0.0;
	this.viewpointIndicator = false;
	this.allExpanded = false;

	/** Adders **/

	/**
	 * Adds the id of a component to the list of component ids contained in this MPageView object.
	 * @param (Number) compId The primary key of a component contained in this MPageView object.
	 */
	this.addComponentId = function(compId) {
		if(this.componentIds === null) {
			this.componentIds = [];
		}
		this.componentIds.push(compId);
	};
	/**
	 * Adds a component to the existing MPage
	 * @param {MPageComponent} componentObj The MPageComponent object to add to the MpageView
	 */
	this.addComponent = function(componentObj) {
		if(this.components === null) {
			this.components = [];
		}
		this.components.push(componentObj);
	};
	/**
	 * Add a filter mapping object to the collection of mappings.  Filter mappings are referenced by name, so if a filter already exists with the same name it will
	 * be overwritten.
	 * @param {String} filterName The name of the filter object to add.
	 * @param {Object} filterObject The object containing all of the filter properties used when loading settings.
	 */
	this.addFilterMappingObject = function(filterName, filterObject) {
		this.m_filterMappingsObj[filterName] = filterObject;
	};
	/**
	 * Adds the HTML code for an anchor tag to be shown at the top of an MPages View.  The parameter passed in should be syntactically correct HTML as it will be
	 * placed directly into the DOM.
	 * @param {String} anchorHTML The HTML markup for the anchor to be added to the MPages View.
	 */
	this.addTitleAnchor = function(anchorHTML) {
		if(this.m_titleAnchors === null) {
			this.m_titleAnchors = [];
		}
		this.m_titleAnchors.push(anchorHTML);
	};
	/** Getters **/

	/**
	 * Gets the name of the capitalization timer for this instance of the MPageView object.
	 * @return {String} The name of the capitalization timer.
	 */
	this.getCapTimerName = function() {
		return this.m_capTimerName;
	};
	/**
	 * Gets the category mean assigned to this instance of the MPageView object.
	 * @return {String} The category mean of this MPageView object.
	 */
	this.getCategoryMean = function() {
		return this.m_categoryMean;
	};
	/**
	 * Gets the array of component ids that are set to load with this instance of the MPageView object.
	 * @return {Array[Number]} An array of components ids
	 */
	this.getComponentIds = function() {
		return (this.componentIds);
	};
	/**
	 * Gets the array of MPageComponent objects associated to this instance of the MPageView object.
	 * @return {Array[MPageComponent]} An array of MPageComponent objects.
	 */
	this.getComponents = function() {
		return this.components;
	};
	/**
	 * Returns the criterion object stored in the MPageView object.  The criterion object contains information such as the person_id, encntr_id, personnel_id, etc.
	 * @return {Criterion} A Criterion object containing information such as the person_id, encntr_id, personnel_id, etc.
	 */
	this.getCriterion = function() {
		return (this.criterion);
	};
	/**
	 * Gets the the flag which determines if the user is allowed to customize a MPages View or not.
	 * @return {Boolean} A boolean flag which determines if the user is allowed to customize a MPages View or not.
	 */
	this.getCustomizeEnabled = function() {
		return this.m_isCustomizeEnabled;
	};
	/**
	 * Gets the the flag which determines whether or not to add the customization option to the MPages View.
	 * @return {Boolean} A boolean flag which determines whether or not to add the customization option to the MPages View.
	 */
	this.getCustomizeView = function() {
		return this.isCustomizeView;
	};
	/**
	 * Gets the array of filter mapping objects used to apply MPages View level settings.
	 * @return {Array[Object]} An array of filter mapping objects.
	 */
	this.getFilterMappingsObj = function() {
		return this.m_filterMappingsObj;
	};
	/**
	 * Return the help file name that is to be loaded when the help file icon is clicked.
	 * @return {String} An string containing the file path location of a help file.
	 */
	this.getHelpFileName = function() {
		return this.helpFileName;
	};
	/**
	 * Return the help file URL that is to be loaded when the help file icon is clicked.
	 * @return {String} The URL of the help file
	 */
	this.getHelpFileURL = function() {
		return this.helpFileURL;
	};
	/**
	 * Gets the name associated to the MPages View
	 * @return {String} The name of the MPages View
	 */
	this.getName = function() {
		return this.name;
	};
	/**
	 * Gets the primary key associated to the MPageView object.
	 * @return {Number} The key of the MPageView object
	 */
	this.getPageId = function() {
		return this.pageId;
	};
	/**
	 * Gets the page level settings object loaded from the preferences model.
	 * @return {Object} The preferences object used to set the MPageView object settings.
	 */
	this.getPageSettings = function() {
		return this.m_pageSettings;
	};
	/**
	 * Returns the printable report name if it has been set.
	 * @return {String} The name given to the printable report.
	 */
	this.getPrintableReportName = function() {
		return this.m_printableReportName;
	};
	/**
	 * Gets the subtimer name to be associated with the capitalization timer.
	 * @return {String} The name of the subtimer
	 */
	this.getSubTimerName = function() {
		return this.m_subTimerName;
	};
	/**
	 * Gets the array of HTML anchor elements that will be added to the MPages View.
	 * @return {Array[String]} An array of HTML string which makeup the MPages options
	 */
	this.getTitleAnchors = function() {
		return this.m_titleAnchors;
	};
	/** Boolean Checks **/

	/**
	 * A check for the banner flag which determines if the demographic banner should be displayed in the MPages View.
	 * @return {Boolean} True if the patient demographic banner should be displayed within the MPages View.  False otherwise.
	 */
	this.isBannerEnabled = function() {
		return this.banner;
	};
	/**
	 * A check for the viewpoint indicator flag which determines if the MPageView is being shown in a Viewpoint or not.
	 * @return {Boolean} True if the MPageView is being shown in a viewpoint.  False otherwise.
	 */
	this.getViewpointIndicator = function() {
		return this.viewpointIndicator;
	};
	/**
	 * A check for the m_csEnabled flag which determines if the chart search functionality should be available for the user.
	 * @return {Boolean} True if chart search is to be displayed within the MPage.  False otherwise.
	 */
	this.isChartSearchEnabled = function() {
		return this.m_csEnabled;
	};
	/**
	 * A check for the m_dpEnabled flag which determines if the discharge process functionality should be available for the user.
	 * @return {Boolean} True if discharge process icon is to be displayed within the MPage.  False otherwise.
	 */
	this.isDischargeProcessEnabled = function() {
		return this.m_dpEnabled;
	};
	/**
	 * A check for the allExpanded flag which determines if all the components are currently expanded or not.
	 * @return {Boolean} True if all components are expanded.  False otherwise.
	 */
	this.isAllExpanded = function() {
		return this.allExpanded;
	};
	/** Setters **/

	/**
	 * Sets whether or not to display the patient demographic banner.
	 * @param {Boolean} value The boolean value in which to note to display or not display the patient demographic banner.
	 */
	this.setBannerEnabled = function(bannerEnabled) {
		this.banner = bannerEnabled;
	};
	/**
	 * Sets the name of the capitalization timer for this instance of the MPageView object.  The capTimerName parameter must be a string, otherwise it is
	 * ignored.
	 * @param {String} The name of the capitalization timer.
	 * @return {Boolean} True if the capitalization timer name was set, false otherwise.
	 */
	this.setCapTimerName = function(capTimerName) {
		if(capTimerName && typeof capTimerName == "string") {
			this.m_capTimerName = capTimerName;
			return true;
		}
		return false;
	};
	/**
	 * Sets the category mean of the MPageView object.  The categoryMean parameter must be a string, otherwise it is ignored.
	 * @param {String} categoryMean The category mean of the MPageView object
	 */
	this.setCategoryMean = function(categoryMean) {
		if(categoryMean && typeof categoryMean == "string") {
			this.m_categoryMean = categoryMean;
			return true;
		}
		return false;
	};
	/**
	 * Sets whether or not to display chart search functionality
	 * @param {Boolean} showChartSearch The boolean value in which to note to display or not display chart search.
	 */
	this.setChartSearchEnabled = function(showChartSearch) {
		this.m_csEnabled = showChartSearch;
	};
	/**
	 * Sets whether or not to discharge process functionality
	 * @param {Boolean} discharge process The boolean value in which to note to display or not display discharge process.
	 */
	this.setDischargeProcessEnabled = function(showDischargeProcess) {
		this.m_dpEnabled = showDischargeProcess;
	};
	/**
	 * Sets the array of components ids which are the primary keys to the MPageComponent objects that are part of this MPageView object.
	 * @param {Array[Number]} compIdArr The array of component ids.
	 */
	this.setComponentIds = function(compIdArr) {
		this.componentIds = compIdArr;
	};
	/**
	 * Sets the list of MPageComponent objects which are contained within this MPageView object.
	 * @param {Array[MPageComponent]} componentArr The array of MPageComponent objects which are contained within this MPageView object.
	 */
	this.setComponents = function(componentArr) {
		this.components = componentArr;
	};
	/**
	 * Sets the Criterion object for this instance of the MPageView object.
	 * @param {Criterion} criterionObj The Criterion object in which to initialize the MPageView object with.
	 */
	this.setCriterion = function(criterionObj) {
		this.criterion = criterionObj;
	};
	/**
	 * Sets the flag which determines if the customization option will be enabled or disabled within the MPages View.
	 * @param {Boolean} customizedEnabled A flag which determines if customization of the MPages View is enabled or disabled.
	 */
	this.setCustomizeEnabled = function(customizedEnabled) {
		this.m_isCustomizeEnabled = customizedEnabled;
	};
	/**
	 * Sets the flag which determines if the customization option will be shown to the user or not on the MPages View.
	 * @param {Boolean} customizeView A flag which determines if the customization option will be shown to the user or not.
	 */
	this.setCustomizeView = function(customizeView) {
		this.isCustomizeView = customizeView;
	};
	/**
	 * Sets the filter mappings object which will be used when loading settings from the preferences model.  The filterObj parameter must not be null.  If it is
	 * null it will be ignored.
	 * @param {Object} filterObj An object which contains the filter mappings of the MPageView object
	 * @return {Boolean} True if the m_filterMappingsObj was set to filterObj, false otherwise
	 */
	this.setFilterMappingsObj = function(filterObj) {
		if(filterObj) {
			this.m_filterMappingsObj = filterObj;
			return true;
		}
		return false;
	};
	/**
	 * Sets the help file name that is to be loaded when the help file icon is clicked.
	 * @param {String} fileName The name of the help file to be loaded when the help icon is clicked.
	 */
	this.setHelpFileName = function(fileName) {
		this.helpFileName = fileName;
	};
	/**
	 * Sets the help file URL that is to be loaded when the help file icon is clicked.
	 * @param {String} fileURL The name of the help file to be loaded when the help icon is clicked.
	 */
	this.setHelpFileURL = function(fileURL) {
		this.helpFileURL = fileURL;
	};
	/**
	 * Sets the name given to the MPages View.  The mpageName parameter must not be blank or null.  If it is the existing name will not be modified.
	 * @param {String} mpageName the name to be given to the MPages View
	 * @return {Boolean} True if the MPages View name was set, otherwise false.
	 */
	this.setName = function(mpageName) {
		if(mpageName && typeof mpageName == "string") {
			this.name = mpageName;
			return true;
		}
		return false;
	};
	/**
	 * Sets the primary key associated to the MPageView object.
	 * @param {Number} mpageId The primary key to be associated to the MPageView object.
	 */
	this.setPageId = function(mpageId) {
		this.pageId = mpageId;
	};
	/**
	 * Sets the page settings object used when initializing MPageView object elements.
	 * @param {Object} settingsObj The settings object from the preferences model.
	 */
	this.setPageSettings = function(settingsObj) {
		if(settingsObj) {
			this.m_pageSettings = settingsObj;
			return true;
		}
		return false;
	};
	/**
	 * Sets the printable report script/name of the MPages View iff the reportName is a string.
	 * @param {String} value The reportName value will hold the script name (from bedrock) that will be used/executed to print a report.
	 */
	this.setPrintableReportName = function(reportName) {
		if(reportName && typeof reportName == "string") {
			this.m_printableReportName = reportName;
			return this.m_printableReportName;
		}
		return null;
	};
	/**
	 * Sets the name of the capitalization subtimer.
	 * @param {String} timerName The name to give to the capitalization subtimer
	 */
	this.setSubTimerName = function(timerName) {
		if(timerName && typeof timerName == "string") {
			this.m_subTimerName = timerName;
			return true;
		}
		return false;
	};
	/**
	 * Sets the array of anchors/additional options to be shown on MPages View.  The strings passed in the anchorArr should be syntactically correct HTML as it
	 * will be placed directly into the DOM.
	 * @param {Array[String]} anchorArr An array of HTML strings which will be loaded into the MPages View.
	 */
	this.setTitleAnchors = function(anchorArr) {
		this.m_titleAnchors = anchorArr;
	};
	/**
	 * Sets the flag which determines if all components are expanded or collapsed.
	 * @param {Boolean} allExpandedInd A flag which determines if all the components are expanded or collapsed. True means
	 * all are expanded, false means all are collapsed.
	 */
	this.setIsAllExpanded = function(allExpandedInd) {
		this.allExpanded = allExpandedInd;
	};
	/**
	 * Sets the flag which determines if the MPageView is being shown in a viewpoint or not.
	 * @param {Boolean} viewpointInd A flag which determines if the MPageView is being shown in a viewpoint or not.
	 */
	this.setViewpointIndicator = function(viewpointInd) {
		this.viewpointIndicator = viewpointInd;
	};
}

/** Initialization and rendering functions for the MPageView objects **/

/**
 * Initializes the MPageView with the basic information needed to render the MPages View.  This includes registering unload and resize events with the custom
 * component framework, loading the default filtermappings for the MPageView, creating timers based on the timer names in m_capTimerName and m_subTimerName and
 * finally creating and storing the criterion object in the MPageView object.  This function can be extended and/or overwritten in a MPageView prototyped object.
 * @this {MPageView}
 * @return {boolean} True if the MPagesView was initialized successfully, false otherwise
 */
MPageView.prototype.initializeMPageView = function() {
	try {
		//Register events for the Custom Components Standard
		MPage.registerUnloadEvent();
		MPage.registerResizeEvent();

		//Load the filter mappings
		this.loadFilterMappings();

		//Load the timer information
		this.setCapTimerName("CAP:MPG Launch MPage");
		this.setSubTimerName(this.getCategoryMean());

		//Create the MPage timers based on names set in the MPageView object
		this.createMPageTimerObject();

		//Create and set the criterion object for the MPageView
		this.setCriterion(createPageCriterion(this.getCategoryMean()));

		//Set the viewpoint indicator to true if this is a viewpoint, otherwise false
		this.setViewpointIndicator(( typeof m_viewpointJSON == "undefined") ? false : true);

		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "initializeMPageView");
		throw err;
	}
};
/**
 * Loads and stores the settings from the preferences model into the MPageView object.  This includes setting the page id, loading the application and user
 * preferences model and applying the filter mappings loaded in the MPageView.loadFilterMappings() function.  It is not recommended to override or extend this
 * function.
 * @this {MPageView}
 * @return {boolean} True if the page settings were loaded successfully, false otherwise
 */
MPageView.prototype.loadPageSettings = function() {
	var bValue = "";
	var filter = null;
	var filterMappingsObj = null;
	var pageFilters = null;
	var pageSettings = null;
	var sValue = "";
	var x = 0;

	try {
		//Retrieve and store the page level settings from the preference model
		pageSettings = this.getPageSettingsObject();
		if(!pageSettings) {
			throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
		}
		this.setPageSettings(pageSettings);

		//Set the page id from the bedrock contents
		this.setPageId(pageSettings.BR_DATAMART_CATEGORY_ID);

		//Create the preference manager for user preferences
		MP_Core.AppUserPreferenceManager.Initialize(this.getCriterion(), this.getCategoryMean());
		if(pageSettings.USER_PREFS.PREF_STRING.length > 0) {
			MP_Core.AppUserPreferenceManager.SetPreferences(pageSettings.USER_PREFS.PREF_STRING);
		}

		//Set the page level settings
		filterMappingsObj = this.getFilterMappingsObj();
		pageFilters = pageSettings.PARAMS;
		for( x = pageFilters.length; x--; ) {
			filter = filterMappingsObj[pageFilters[x].FILTER_MEAN];
			if(filter) {
				sValue = "";
				bValue = "";
				switch (filter.type.toUpperCase()) {
					case "BOOLEAN":
						if(pageFilters[x].VALUES[0] && typeof pageFilters[x].VALUES[0][filter.field] != 'undefined') {
							sValue = pageFilters[x].VALUES[0][filter.field];
							bValue = (sValue === "0") ? false : true;
							filter.setFunction.call(this, bValue);
						}
						break;
					case "STRING":
						if(pageFilters[x].VALUES[0] && typeof pageFilters[x].VALUES[0][filter.field] != 'undefined') {
							sValue = pageFilters[x].VALUES[0][filter.field];
							filter.setFunction.call(this, sValue);
						}
						break;
				}
			}
		}
		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "loadPageSettings");
		throw err;
	}
};
/**
 * Perform the initialization of all of the components which will appear on this MPages View.  Initialization includes loading all preferences from the
 * preference model into the components, applying user level settings to the components and finally storing the newly created MPageComponent objects in
 * the components[] array of the MPageView object.  It is not recommend to overwrite this function, but it can be extended to further setup the
 * components of an MPages View.  For example, setting forced lookback ranges for certain components on an Mpages View.
 * @this {MPageView}
 * @return {boolean} True if the component settings were initialized properly, false otherwise
 */
MPageView.prototype.initializeComponents = function() {
	var component;
	var componentsArr = [];
	var componentCnt = 0;
	var criterion = null;
	var dateCheck = null;
	var dateFilter = null;
	var groupArr = null;
	var group = null;
	var loadingPolicy = null;
	var pageSettings = null;
	var sexFilter = null;
	var x = 0;
	var y = 0;
	var z = 0;

	try {
		//Create a Loading policy for use in the Bedrock functions
		loadingPolicy = new MP_Bedrock.LoadingPolicy();
		loadingPolicy.setLoadPageDetails(true);
		loadingPolicy.setLoadComponentBasics(true);
		loadingPolicy.setLoadComponentDetails(true);
		loadingPolicy.setCategoryMean(this.getCategoryMean());
		loadingPolicy.setCriterion(this.getCriterion());

		//Load the component ids
		pageSettings = this.getPageSettings();
		if(!pageSettings) {
			throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
		}
		componentsArr = pageSettings.COMPONENT;
		componentCnt = componentsArr.length;
		for( x = 0; x < componentCnt; x++) {
			this.addComponentId(componentsArr[x].BR_DATAMART_REPORT_ID);
		}

		//Call the bedrock functions to load the components.
		//Want to eventually move this into the component architecture to simplify.
		this.setComponents(MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, this.getComponentIds()));

		//Initialize special component logic.  Will be moved into MPageComponent eventually
		criterion = this.getCriterion();
		// setup filter to only display a component when the patient is female
		sexFilter = new MP_Core.CriterionFilters(criterion);
		sexFilter.addFilter(MP_Core.CriterionFilters.SEX_MEANING, "FEMALE");

		// setup filter to only display a component when the patient is less than or
		// equal to 22 years of age
		dateFilter = new MP_Core.CriterionFilters(criterion);
		dateCheck = new Date();
		dateCheck.setFullYear(dateCheck.getFullYear() - 22);
		dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, dateCheck);
		componentsArr = this.getComponents();
		if(componentsArr && componentsArr.length > 0) {
			for( y = componentsArr.length; y--; ) {
				groupArr = null;
				group = null;
				z = 0;
				component = componentsArr[y];
				if( component instanceof GrowthChartComponent) {
					component.addDisplayFilter(dateFilter);
				}
				else if( component instanceof VitalSignComponent) {
					groupArr = component.getGroups();
					if(groupArr && groupArr.length > 0) {
						for( z = groupArr.length; z--; ) {
							group = groupArr[z];
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
				else if( component instanceof LaboratoryComponent) {
					groupArr = component.getGroups();
					if(groupArr && groupArr.length > 0) {
						for( z = groupArr.length; z--; ) {
							group = groupArr[z];
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
				else if( component instanceof ABDComponent) {
					var dateFilter1 = new MP_Core.CriterionFilters(criterion);
					var ageDays = component.getAgeDays();
					var myDate = new Date();
					myDate.setDate(myDate.getDate() - ageDays);
					dateFilter1.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, myDate);
					component.addDisplayFilter(dateFilter1);
				}
				else if( component instanceof PatientAssessmentComponent) {
					groupArr = component.getGroups();
					if(groupArr && groupArr.length > 0) {
						for( z = groupArr.length; z--; ) {
							group = groupArr[z];
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
				else if( component instanceof NeonateBilirubinComponent) {
					// setup filter to only display a component when the newborn is less than or
					// equal to 156 hours of age
					var dateFilter2 = new MP_Core.CriterionFilters(criterion);
					var ageCheck = new Date();
					ageCheck.setHours(-156);
					dateFilter2.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, ageCheck);
					component.addDisplayFilter(dateFilter2);
				}
				else if( component instanceof NewOrderEntryComponent) {
					if (this.getViewpointIndicator()) {
						component.setModalScratchPadEnabled(1);
					}
				}
				else if( component instanceof OrderSelectionComponent) {
					if (this.getViewpointIndicator()) {
						component.setModalScratchPadEnabled(1);
					}
				}									
			}
		}

		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "initializeComponents");
		throw err;
	}
};
/**
 * Used to render the MPages View once it has been initialized and setup.  Calls the MP_Util.Doc.InitLayout function to render the HTML of the page layout.
 * Once the page layout has been rendered, the Chart Search functionality and demo banner are added to the MPage View.  Finally the component script calls
 * are executed within the MP_Util.Doc.RenderLayout() function call.  It is not recommended to override this function.  If special logic needs to be executed
 * when loading the Chart Search functionality or loading the Demographics Banner, those specific functions can be overridden instead.
 * @this {MPageView}
 * @return {boolean} True if the page was rendered successfully, false otherwise
 */
MPageView.prototype.renderMPage = function() {
	var viewpointCatMeaning = null;
	var componentList = null;

	try {
		//Check to see if any component are defined for this MPageView.  Return if there are not any
		componentList = this.getComponents();
		if(componentList.length === 0) {
			throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
		}
		//viewpointCatMeaning is used only when loading a MPage View within a Viewpoint
		viewpointCatMeaning = (this.getViewpointIndicator()) ? this.getCategoryMean() : null;
		MP_Util.Doc.InitLayout(this, this.getHelpFileName(), this.getHelpFileURL(), viewpointCatMeaning);
		
		/*
		//Initialize Chart search if available
		this.loadChartSearch();
		
		//Initialize Discharge Process if available
		this.loadDischargeProcess();

		//Load the demo banner if available
		this.loadDemoBanner();

		//Load the component selection menu if available.
		this.loadComponentSelection();

		//Load Printable Report Menu Option
		this.loadPrintableReportMenuItem();

		//Load the Drag and Drop Toggle Menu Option
		this.loadDragAndDropMenuItem();

		//Load the Expand/Collapse Menu Option
		this.loadExpandCollapseAllMenuItem();

		//Load the Help Menu Option
		this.loadHelpMenuItem();
		*/	
		//Load the components
		window.setTimeout("MP_Util.Doc.RenderLayout()", 0);

		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "renderMPage");
		throw err;
	}
};
/**
 * Any post processing that needs to be completed by the MPageView object will be completed in this function.  No functionality has been implemented at this
 * time for the base function, but this can be overridden in objects which prototype the MPagesView object.
 */
MPageView.prototype.postProcessing = function() {
};
/** Support functions used for the MPageView objects **/

/**
 * Loads the default MPage View level filter mappings.  These mappings can be overwritten by using the MPageView.setFilterMappingObject() function with the same
 * name as any of the existing filter mappings.  Filter mappings can also be overridden by defining a loadFilterMappings function in a MPageView prototyped
 * object.
 * @this {MPageView}
 * @return null
 */
MPageView.prototype.loadFilterMappings = function() {
	//A filter mapping that indicates whether the Demographics Banner will be displayed.
	this.addFilterMappingObject("BANNER", {
		setFunction: this.setBannerEnabled,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//A filter mapping that indicates whether the Chart Search will be displayed.
	this.addFilterMappingObject("CHART_SEARCH", {
		setFunction: this.setChartSearchEnabled,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//A filter mapping that indicates whether the Discharge Process will be displayed.
	this.addFilterMappingObject("DISCHARGE_PROCESS", {
		setFunction: this.setDischargeProcessEnabled,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//A filter mapping used to set the Label/name of an MPages View.  This name is used for the actual MPage name and the name used on the viewpoint tab.
	this.addFilterMappingObject("VIEWPOINT_LABEL", {
		setFunction: this.setName,
		type: "String",
		field: "FREETEXT_DESC"
	});
	//A filter mapping used to set the printable report name.
	//The filter mean for this setting is named PREG_PRINT but it is not isolated to just the Pregnancy Summary.  It also applies to the View Builder
	//MPages as well and is a setting to call a printable Discern report.
	this.addFilterMappingObject("PREG_PRINT", {
		setFunction: this.setPrintableReportName,
		type: "String",
		field: "FREETEXT_DESC"
	});
};
/**
 * Makes the call to add the Chart Search controls to the MPage if it should be available to the user.  Can be overwritten by a MPagesView prototyped object if
 * special functionality is need for the Chart Search controls.
 * @this {MPageView}
 * @return {Boolean} True if the Chart Search was added to the page, false otherwise.
 */
MPageView.prototype.loadChartSearch = function() {
	//Ignore chart search when being loaded in viewpoints since the chart search functionality is handled at the viewpoint level.
	if(this.getViewpointIndicator()) {
		return false;
	}

	if(this.isChartSearchEnabled()) {
		MP_Util.Doc.AddChartSearch(this.getCriterion(), false);
		return true;
	}
	return false;
};
/**
 * Makes the call to add the Discharge Process Icon to the MPage if it should be available to the user.  Can be overwritten by a MPagesView prototyped object if
 * special functionality is need for the Discharge Process Icon.
 * @this {MPageView}
 * @return {Boolean} True if the Discharge Process was added to the page, false otherwise.
 */
MPageView.prototype.loadDischargeProcess = function() {
	//Ignore Discharge Process when being loaded in viewpoints since the Discharge Process functionality is handled at the viewpoint level.
	if(this.getViewpointIndicator()) {
		return false;
	}
	
	if(this.isDischargeProcessEnabled()){
		this.AddDischargeProcess(this.getCriterion());
		return true;
	}

};
/**
* Adds Discharge Process to the page.
* @param {Object} criterion The criterion object
 */
MPageView.prototype.AddDischargeProcess = function (criterion) {
	var dpSpan = Util.cep("span", {title : i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS});			
	dpSpan.innerHTML = "<a id=depart-process-icon></a>";	
		
	var pgCtrl = _g("pageCtrl"+criterion.category_mean);
	
	pgCtrl.parentNode.insertBefore(dpSpan, pgCtrl);
	dpSpan.onclick = function(){			
		OpenDischargeProcess(criterion.encntr_id,criterion.person_id,criterion.provider_id);	
	};
};
/**
 * Makes the call to add the Demographics Banner to the MPage if it should be shown on the MPages View.  Can be overwritten by a MPagesView prototyped object if
 * special functionality is need for the Demographics Banner.
 * @this {MPageView}
 * @return {Boolean} True if the Demographics Banner was added to the page, false otherwise.
 */
MPageView.prototype.loadDemoBanner = function() {
	var patDemoBanner = null;

	if(this.isBannerEnabled()) {
		patDemoBanner = _g("banner" + this.getCategoryMean());
		if(patDemoBanner) {
			CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemoBanner, this.getCriterion());
			return true;
		}
	}
	return false;
};
/**
 * Base implementation for loading the component selection menu.  This option is not supported in all MPages, thus this function
 * should be implemented in the individual MPagesView Objects.
 * @this {MPageView}
 * @return {Boolean} True if the component selection menu option was added to the page, false otherwise.
 */
MPageView.prototype.loadComponentSelection = function() {
	return false;
};
/**
 * If the m_printableReport element is populated for the MPageView then add the Print Report menu option to the page menu.
 * @this (MPageView)
 * @return {Boolean} True if the Printable Report menu option was added to page, false otherwise.
 */
MPageView.prototype.loadPrintableReportMenuItem = function() {
	var categoryMean = "";
	var criterion = null;
	var menuEle = null;
	var menuId = "";
	var pageMenuEle = null;
	var printReportMenuItem = null;
	var printReportName = "";

	//Check to see if the printable report name is set for the MPage
	printReportName = this.getPrintableReportName();
	if(printReportName) {
		//Retrieve the page menu if available
		categoryMean = this.getCategoryMean();
		menuId = 'pageMenu' + categoryMean;
		pageMenuEle = _g('optsMenupersonalize' + menuId);
		if(pageMenuEle) {
			criterion = this.getCriterion();
			//Create the Printable Report Menu Item
			printReportMenuItem = Util.cep("div", {
				className: "opts-menu-item",
				id: "optsPrintReport" + menuId
			});

			printReportMenuItem.innerHTML = i18n.PRINT_REPORT;

			Util.addEvent(printReportMenuItem, "click", function() {
				MP_Util.PrintReport(printReportName, criterion.person_id + ".0", criterion.encntr_id + ".0");
			});
			//Add the Print Report menu to the page menu selection
			//Check to see if the component toggle menu exists and if so add the Print Report option after that
			menuEle = _g('optsCompSelection' + menuId);
			if(menuEle) {
				Util.ia(printReportMenuItem, menuEle);
				return true;
			}
			//Check to see if the layout menu exists and if so add the Print Report option after that
			menuEle = _g('optsDefLayout' + menuId);
			if(menuEle) {
				Util.ia(printReportMenuItem, menuEle);
				return true;
			}

			//Add the Print Report option at the end of the menu
			Util.ac(printReportMenuItem, pageMenuEle);
			return true;
		}
	}
	return false;
};
/**
 * Adds help menu item to the page level menu.
 * @this (MPageView)
 * @return {Boolean} True if the help menu option was added to page, false otherwise.
 */
MPageView.prototype.loadHelpMenuItem = function() {
	var categoryMean = "";
	var criterion = null;
	var helpMenuItem = null;
	var helpMenuItemId = "optsHelp";
	var i18nCore = i18n.discernabu;
	var menuId = "";
	var pageMenuEle = null;
	var that = this;

	function clickHelp() {
		MP_Util.Doc.LaunchHelpWindow(that.getHelpFileURL());
	}

	//Retrieve the page menu if available
	categoryMean = this.getCategoryMean();
	menuId = 'pageMenu' + categoryMean;
	pageMenuEle = $('#optsMenupersonalize' + menuId);
	if(pageMenuEle.length) {
		criterion = this.getCriterion();

		//Create the Help Menu Item
		helpMenuItem = $("<div></div>").attr("id", helpMenuItemId + menuId).addClass("opts-menu-item").html(i18nCore.HELP).click(clickHelp);

		//Add the Help menu item at the end of the menu
		$(pageMenuEle).append(helpMenuItem);
		return true;
	}
	return false;
};
/**
 * Adds expand/collapse menu item to the page level menu.
 * @this (MPageView)
 * @return {Boolean} True if the Expand/Collapse menu option was added to page, false otherwise.
 */
MPageView.prototype.loadExpandCollapseAllMenuItem = function() {
	var categoryMean = "";
	var criterion = null;
	var expandCollapseMenuItem = null;
	var expandCollapseMenuItemId = "optsExpandCollapseAll";
	var i18nCore = i18n.discernabu;
	var menuId = "";
	var menuEle = null;
	var pageMenuEle = null;
	var that = this;

	function toggleExpandCollapse() {
		var toggleContainer = null;
		try {
			toggleContainer = (that.getViewpointIndicator() ? $("#" + categoryMean) : $(document.body));
			if(!toggleContainer.length) {
				MP_Util.LogWarn("The container that houses the components to be toggled was not found");
				return false;
			}
			if(that.isAllExpanded()) {
				//All components are currently expanded
				$(toggleContainer).find(".section").addClass("closed");
				$(expandCollapseMenuItem).html(i18nCore.EXPAND_ALL);
			}
			else {
				//All components are currently collapsed
				$(toggleContainer).find(".section").removeClass("closed");
				$(expandCollapseMenuItem).html(i18nCore.COLLAPSE_ALL);
			}
			//Invert boolean for whether components are expanded or collapsed
			that.setIsAllExpanded(!that.isAllExpanded());
		}
		catch (err) {
			MP_Util.LogJSError(err, null, "mp_component_defs.js", "toggleExpandCollapse");
		}
	}

	//Retrieve the page menu if available
	categoryMean = this.getCategoryMean();
	menuId = 'pageMenu' + categoryMean;
	pageMenuEle = $('#optsMenupersonalize' + menuId);
	try {
		//If the page level menu exists
		if(pageMenuEle.length) {
			criterion = this.getCriterion();
			//Create the Drag and Drop Menu Item
			expandCollapseMenuItem = $("<div></div>").attr("id", expandCollapseMenuItemId + menuId).addClass("opts-menu-item").click(toggleExpandCollapse);

			//Check that the menu item was successfully created
			if(!expandCollapseMenuItem || !expandCollapseMenuItem.length) {
				MP_Util.LogWarn("The expand/collapse menu item was not created successfully");
				return false;
			}

			//Set the menu item text based on the current standing (expanded or collapsed)
			$(expandCollapseMenuItem).html(that.isAllExpanded() ? i18nCore.COLLAPSE_ALL : i18nCore.EXPAND_ALL);

			//Add the Expand/Collapse after Drag and Drop if available
			menuEle = $(pageMenuEle).find('#optsDNDToggle' + menuId);
			if(menuEle && menuEle.length) {
				$(expandCollapseMenuItem).insertAfter(menuEle);
				return true;
			}
			//Add the Expand/Collapse after View Layout if available
			menuEle = $(pageMenuEle).find('#optsDefLayout' + menuId);
			if(menuEle && menuEle.length) {
				$(expandCollapseMenuItem).insertAfter(menuEle);
				return true;
			}

			//Add the expand collapse menu at the beginning of the page menu by default
			$(pageMenuEle).prepend(expandCollapseMenuItem);
			return true;
		}
		//If the page level menu does not exist
		else {
			MP_Util.LogWarn("The page level menu was not found. Cannot add the expand/collapse menu.");
			return false;
		}
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "loadExpandCollapseAllMenuItem");
		return false;
	}
};
/**
 * Adds the drag and drop menu item to the page level menu.
 * @this (MPageView)
 * @return {Boolean} True if the Drag and Drop toggle menu option was added to page, false otherwise.
 */
MPageView.prototype.loadDragAndDropMenuItem = function() {
	var activeView = null;
	var categoryMean = "";
	var criterion = null;
	var menuEle = null;
	var menuId = "";
	var pageMenuEle = null;
	var parentEleId = "";
	var dragNDropMenuItem = null;
	var dragNDropEnabled = false;
	var vpParent = "";
	var that = this;
	activeView = $("#" + that.getCategoryMean());
	if(activeView.length) {
		parentEleId = "#" + that.getCategoryMean();
		dragNDropEnabled = $(activeView).hasClass("dnd-enabled");
	}
	else {
		activeView = $(document.body);
		dragNDropEnabled = $(activeView).hasClass("dnd-enabled");
	}

	function activateDragAndDrop() {
		dragNDropEnabled = $(activeView).hasClass("dnd-enabled");

		//Check the dragging active css class
		if(dragNDropEnabled) {
			//Remove the Drag and Drop css class
			$(activeView).removeClass("dnd-enabled");

			//Update the Drag and Drop menu item display
			if(dragNDropMenuItem) {
				$(dragNDropMenuItem).html(i18n.DRAG_AND_DROP_ENABLE);
			}

			//Disables Drag and Drop
			$(parentEleId + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("disable");
			//Update the cursor to switch from the move icon to auto
			$(parentEleId + " .col-outer1:last .sec-hd").css("cursor", "auto");
		}
		else {
			//add the Drag and Drop css class
			$(activeView).addClass("dnd-enabled");

			//Update the Drag and Drop menu item display
			if(dragNDropMenuItem) {
				$(dragNDropMenuItem).html(i18n.DRAG_AND_DROP_DISABLE);
			}

			// re-enables sortable
			$(parentEleId + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("enable");
			// update the cursor back to the move icon
			$(parentEleId + " .col-outer1:last .sec-hd").css("cursor", "move");
		}
	}

	//Determine the parent div identifier
	vpParent = (this.getViewpointIndicator()) ? "#" + this.getCategoryMean() : "";

	//Retrieve the page menu if available
	categoryMean = this.getCategoryMean();
	menuId = 'pageMenu' + categoryMean;
	pageMenuEle = $('#optsMenupersonalize' + menuId);

	try {
		if(pageMenuEle.length) {
			criterion = this.getCriterion();
			//Create the Drag and Drop Menu Item
			dragNDropMenuItem = $("<div></div>").attr("id", "optsDNDToggle" + menuId).addClass("opts-menu-item").click(activateDragAndDrop);

			//Check that the Drag And Drop Menu Item was successfully created
			if(!dragNDropMenuItem || !dragNDropMenuItem.length) {
				MP_Util.LogWarn("The drag and drop menu item was unsuccessfully created.");
				return false;
			}
			//Set the menu item text based on the current standing (if enabled or not)
			$(dragNDropMenuItem).html( dragNDropEnabled ? i18n.DRAG_AND_DROP_DISABLE : i18n.DRAG_AND_DROP_ENABLE);
			//Find the Layout menu item in the page level menu
			menuEle = $(pageMenuEle).find('#optsDefLayout' + menuId);
			//If the Layout menu exists, insert the drag and drop menu item after it
			if(menuEle && menuEle.length) {
				$(dragNDropMenuItem).insertAfter(menuEle);
				return true;
			}

			//Add the Drag and Drop menu item at the end of the menu by default
			$(pageMenuEle).append(dragNDropMenuItem);
			return true;
		}
		else {
			MP_Util.LogWarn("The page level menu was not found. Cannot add the expand/collapse menu.");
			return false;
		}
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "loadDragAndDropMenuItem");
		return false;
	}
};
/**
 * Creates the MPage View level timer objects based on the m_capTimerName and m_subTimerName strings set in the individual MPageView prototyped objects, ie
 * DischargeSummaryMPage.
 * @this {MPagesView}
 * @return null
 */
MPageView.prototype.createMPageTimerObject = function() {
	var capTimerName = "";
	var mPageTimer = null;
	var subTimerName = "";
	capTimerName = this.getCapTimerName();
	subTimerName = this.getSubTimerName();

	if(capTimerName) {
		mPageTimer = MP_Util.CreateTimer(capTimerName);
		if(mPageTimer) {
			mPageTimer.SubTimerName = (subTimerName) ? subTimerName : "";
			mPageTimer.Stop();
		}
	}
};
/**
 * This function is used to retrieve the settings for a specific MPage View.  If the settings are already available in the m_bedrockMPage object then those will
 * be returned.  If the settings are not available then they will be retrieved using the mp_view_data_load script.
 * @this {MPageView}
 * @return {Object} An object which contains the settings for this MPageView object.
 */
MPageView.prototype.getPageSettingsObject = function() {
	var x = 0;
	var categoryMean = this.getCategoryMean();
	var criterion = this.getCriterion();
	var pageSettings = null;

	if(m_bedrockMpage) {
		//Bedrock settings already available.
		MP_Util.LogDebug("Bedrock JSON: " + JSON.stringify(m_bedrockMpage));
		for( x = m_bedrockMpage.MPAGE.length; x--; ) {
			if(categoryMean === m_bedrockMpage.MPAGE[x].CATEGORY_MEAN.toUpperCase()) {
				return m_bedrockMpage.MPAGE[x];
			}
		}
	}

	//Page settings not available.  Retrieve them from the Database.
	var cclParams = ["^MINE^", criterion.provider_id + ".0", criterion.position_cd + ".0", "^" + categoryMean + "^"];
	var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
	info.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			try {
				MP_Util.LogScriptCallInfo(null, this, "mp_component_defs.js", "getPageSettings");
				m_bedrockMpage = json_parse(info.responseText).BR_MPAGE;
				pageSettings = m_bedrockMpage.MPAGE[0];
			}
			catch (err) {
				MP_Util.LogJSError(err, null, "mp_component_defs.js", "getPageSettings");
				pageSettings = null;
			}
		}
		if(this.readyState == 4) {
			MP_Util.ReleaseRequestReference(this);
		}
	};
	//Call the ccl program and send the parameter string
	if(CERN_BrowserDevInd) {
		var url = "MP_VIEW_DATA_LOAD?parameters=" + cclParams.join(",");
		info.open("GET", url, false);
		info.send(null);
	}
	else {
		info.open('GET', "MP_VIEW_DATA_LOAD", false);
		info.send(cclParams.join(","));
	}

	return pageSettings;
};
/**
 * Loads the page menu for a specific MPageView object.
 * @this {MPageView}
 */
MPageView.prototype.loadPageMenu = function(){
	MP_Util.Doc.CreatePageMenu(this.getCategoryMean(), this.getCategoryMean());
};
/**
 * Sorts the MPage Components by group sequence, then by column, and lastly by row.
 * @param {MPageComponent} c1 Component one to compare against
 * @param {MPageComponent} c2 Component two to compare against
 * @return {Short} Returns the sequence in which the components should display.
 *
 * @author Greg Howdeshell
 */
function SortMPageComponentRows(c1, c2) {
	if(c1.getSequence() < c2.getSequence()) {
		return -1;
	}
	if(c1.getSequence() > c2.getSequence()) {
		return 1;
	}
	return 0;
}

function SortMPageComponentCols(c1, c2) {
	if(c1.getColumn() < c2.getColumn()) {
		return -1;
	}
	if(c1.getColumn() > c2.getColumn()) {
		return 1;
	}
	return SortMPageComponentRows(c1, c2);
}

function SortMPageComponents(c1, c2) {
	if(c1.getPageGroupSequence() < c2.getPageGroupSequence()) {
		return -1;
	}
	if(c1.getPageGroupSequence() > c2.getPageGroupSequence()) {
		return 1;
	}
	return SortMPageComponentCols(c1, c2);
}

/*
The scope of an MPage object and Components are during rendering of the page.  However,
once the page has been rendered these items are lost.  Because there is a need to refresh 
components, the components on a 'page' must be globally stored to allow for refreshing of data.
*/
var CERN_EventListener = null;
var CERN_MPageComponents = null;
var CERN_TabManagers = null;
var CERN_MPages = null;
var CERN_BrowserDevInd = false;
var CK_DATA={};

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

Array.prototype.addAll = function (v) {
    if (v && v.length > 0) {
		for (var x = 0, xl = v.length; x < xl; x++) {
			this.push(v[x]);
		}
	}
};

/**
 * Core utility methods
 * @namespace
 */
var MP_Core = function(){
    return {
    	/**
    	 * The criterion object stores information about the request in context such as the patient/person, encounter/visit, provider/personnel, relationship etc.
    	 */
        Criterion: function(jsCrit, static_content){
            var m_patInfo = null;
            var m_prsnlInfo = null;
            var m_periop_cases = null;
            var m_encntrOverride = [];
            
            this.person_id = jsCrit.PERSON_ID;
            this.encntr_id = (jsCrit.ENCNTRS.length > 0) ? jsCrit.ENCNTRS[0].ENCNTR_ID : 0;
            this.provider_id = jsCrit.PRSNL_ID;
            this.executable = jsCrit.EXECUTABLE;
            this.static_content = static_content;
            this.position_cd = jsCrit.POSITION_CD;
            this.ppr_cd = jsCrit.PPR_CD;
            this.debug_ind = jsCrit.DEBUG_IND;
            CERN_BrowserDevInd = (parseInt(this.debug_ind) & 0x01 === 1)? true : false;
            this.help_file_local_ind = jsCrit.HELP_FILE_LOCAL_IND;
            this.category_mean = jsCrit.CATEGORY_MEAN;
            this.locale_id = (this.debug_ind) ? "en_us" : jsCrit.LOCALE_ID;
			//@deprecated as of 3.3.1 and should be removed as of greater than or equal to 3.4
            this.device_location = "";
            this.PRSNL = jsCrit.PRSNL ;
            this.current_domain = jsCrit.CURRENT_DOMAIN;
            this.encntrs = jsCrit.ENCNTRS;
			this.url = jsCrit.CAMM_URL;
			this.serviceDirectoryURL = jsCrit.SERVICE_DIR_URL;
			this.displaySaveAs = jsCrit.DISPLAY_SAVE_AS;
			
			var encntrOR = jsCrit.ENCNTR_OVERRIDE;
			
			if (encntrOR){
				for (var x = encntrOR.length; x--;){
					m_encntrOverride.push(encntrOR[x].ENCNTR_ID);
				}
			}
			else{
				m_encntrOverride.push(this.encntr_id);
			}
            
            this.setPatientInfo = function(value){
                m_patInfo = value;
            };
            this.getPatientInfo = function(){
                return m_patInfo;
            };
            this.setPeriopCases = function(value){
                m_periop_cases = value;
            };
            this.getPeriopCases = function(){
                return m_periop_cases;
            };   
            this.getPersonnelInfo = function(){
                if (!m_prsnlInfo){
                    m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
                }
                return m_prsnlInfo;
            };
            /**
             * @return List of encounters that are considered 'ACTIVE'.
             * In the rare case that encounter override is needed, this will return the encounter neccessary to pass
             * to a service for retrieval of data.
             */
            this.getEncounterOverride = function(){
            	return m_encntrOverride;
			};
        },
        PatientInformation: function(){
            var m_dob = null;
            var m_sex = null;
            var m_name = null;
            var m_mrn = null;
			            
            this.setSex = function(value){
                m_sex = value;
            };
            this.getSex = function(){
                return m_sex;
            };
            this.setDOB = function(value){
                m_dob = value;
            };
            this.getDOB = function(){
                return m_dob;
            };
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setMRN = function(value){
                m_mrn = value;
            };
            this.getMRN = function(){
                return m_mrn;
            };
        },
        
        PeriopCases: function(){
        	var m_case_id = null;
            var m_prior_ind = null;
            var m_days = null;
            var m_hours = null;
            var m_mins = null;
            var m_cntdwn_desc_flag = null;
            
            this.setCaseID = function(value){
                m_case_id = value;
            };
            this.getCaseID = function(){
                return m_case_id;
            };
            this.setDays = function(value){
                m_days = value;
            };
            this.getDays = function(){
                return m_days;
            };
            this.setHours = function(value){
                m_hours = value;
            };
            this.getHours = function(){
                return m_hours;
            };
            this.setMins = function(value){
                m_mins = value;
            };
            this.getMins = function(){
                return m_mins;
            };
            this.setCntdwnDscFlg = function(value){
                m_cntdwn_desc_flag = value;
            };
            this.getCntdwnDscFlg = function(){
                return m_cntdwn_desc_flag;
            };
        },
        
        ScriptRequest: function(component, loadTimerName){
            var m_comp = component;
            var m_load = loadTimerName;
            var m_name = "";
            var m_programName = "";
            var m_params = null;
            var m_async = true;
            
            this.getComponent = function(){
                return m_comp;
            };
            this.getLoadTimer = function(){
                return m_load;
            };
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setProgramName = function(value){
                m_programName = value;
            };
            this.getProgramName = function(){
                return m_programName;
            };
            this.setParameters = function(value){
                m_params = value;
            };
            this.getParameters = function(){
                return m_params;
            };
            this.setAsync = function(value){
                m_async = value;
            };
            this.isAsync = function(){
                return m_async;
            };
        },
        ScriptReply: function(component){
			//used to syne a request to a reply
			var m_name = "";
			//by default every script reply is 'f'ailed unless otherwise noted
			var m_status = "F";
            var m_err = "";
            var m_resp = null;
            var m_comp = component;
            
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setStatus = function(value){
                m_status = value;
            };
            this.getStatus = function(){
                return m_status;
            };
            this.setError = function(value){
                m_err = value;
            };
            this.getError = function(){
                return m_err;
            };
            this.setResponse = function(value){
                m_resp = value;
            };
            this.getResponse = function(){
                return m_resp;
            };
            this.getComponent = function(){
                return m_comp;
            };
        },
        PersonnelInformation: function(prsnlId, patientId){
            var m_prsnlId = prsnlId;
			//if m_viewableEncntrs remains null, error in retrieval of viewable encntr
			var m_viewableEncntrs = null;
            //load valid encounter list from patcon wrapper
            var patConObj = null;
            try {
                patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE");
				MP_Util.LogDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "PersonnelInformation");
                if (patConObj){
                    m_viewableEncntrs = patConObj.GetValidEncounters(patientId);
					MP_Util.LogDebug("Viewable Encounters: " + m_viewableEncntrs);
                }
            } 
            catch (e) {
            }
            finally {
                //release used memory
                patConObj = null;
            }
            
            this.getPersonnelId = function(){
                return m_prsnlId;
            };
            /**
             * Returns the associated encounter that the provide has the ability to see
             */
            this.getViewableEncounters = function(){
                return m_viewableEncntrs;
            };
        },
        XMLCclRequestWrapper: function(component, program, paramAr, async){
            var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
            var i18nCore = i18n.discernabu;
            var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
            
            info.onreadystatechange = function(){
            	var countText = "";
            	var errMsg = null;
                if (this.readyState == 4 && this.status == 200) {
                    try {
                    	MP_Util.LogScriptCallInfo(component, this, "mp_core.js", "XMLCclRequestWrapper");
                    	var jsonEval = json_parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z") {
                            countText = (component.isLineNumberIncluded() ? "(0)" : "");
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "S") {
                            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                            try {
                                var rootComponentNode = component.getRootComponentNode();
                                var secTitle = Util.Style.g("sec-total", rootComponentNode, "span");
                                secTitle[0].innerHTML = i18nCore.RENDERING_DATA + "...";
                                component.HandleSuccess(recordData);
                            } 
                            catch (err) {
                            	MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestWrapper");
                                if (timerRenderComponent) {
                                    timerRenderComponent.Abort();
                                    timerRenderComponent = null;
                                }
                                throw (err);
                            }
                            finally {
                                if (timerRenderComponent){
                                    timerRenderComponent.Stop();
                                }
                            }
                        }
                        else {
                        	MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestWrapper");
                            errMsg = [];
                            var ss = null;
                            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length === undefined) {
                                ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>");
                            countText = (component.isLineNumberIncluded() ? "(0)" : "");
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                        }
                    } 
                    catch (err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestWrapper");
                        errMsg = [];
                        errMsg.push("<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>");
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                        
                        if (timerLoadComponent) {
                            timerLoadComponent.Abort();
                            timerLoadComponent = null;
                        }
                    }
                    finally {
                        if (timerLoadComponent){ 
                            timerLoadComponent.Stop();
                        }
                    }
                }
                else if (this.readyState == 4 && this.status != 200) {
					MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestWrapper");
                    errMsg = [];
                    errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
                    MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, "");
                    if (timerLoadComponent){
                        timerLoadComponent.Abort();
                    }
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            };
            
            if(CERN_BrowserDevInd){
				var url = program + "?parameters=" + paramAr.join(",");
				info.open("GET", url, async);
				info.send(null); 
            }	
            else{
	            info.open('GET', program, async);
	            info.send(paramAr.join(","));
            }
        },
        /**
         * As a means in which to provide the consumer to handle the response of the script request, this method
         * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
         * about the response that can be utilized for evaluation.
         * @param component [REQUIRED] The component in which is executing the request
         * @param request [REQUIRED] The Request Object containing the information about the script being executed
         * @param funcCallBack [REQUIRED] The function to execute once the execution of the request has been completed
         */
        XMLCCLRequestCallBack: function(component, request, funcCallback){
            var timerLoad = MP_Util.CreateTimer(request.getLoadTimer());
            var i18nCore = i18n.discernabu;
            var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
            var reply = new MP_Core.ScriptReply(component);
            reply.setName(request.getName());
            
            info.onreadystatechange = function(){
                var errMsg = null;
                if (this.readyState == 4 && this.status == 200) {
                    try {
		    	MP_Util.LogScriptCallInfo(component, this, "mp_core.js", "XMLCclRequestCallBack");
			var jsonEval = json_parse(info.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        var status = recordData.STATUS_DATA.STATUS;
                        reply.setStatus(status);
                        if (status == "Z") {
							//Pass response anyways
							reply.setResponse(recordData);
                            funcCallback(reply);
                        }
                        else if (status == "S") {
                            reply.setResponse(recordData);
                            funcCallback(reply);
                        }
                        else {
							MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestCallBack");
                            errMsg = [];
                            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length == undefined) {
                                var ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>");
                            reply.setError(errMsg.join(""));
                            funcCallback(reply);
                        }
                    } 
                    catch (err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestCallBack");
                        errMsg = [];
                        errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
                        reply.setError(errMsg.join(""));
                        if (timerLoad) {
                            timerLoad.Abort();
                            timerLoad = null;
                        }
                    }
                    finally {
                        if (timerLoad) {
                            timerLoad.Stop();
                        }
                    }
                }
                else if (info.readyState == 4 && info.status != 200) {
					MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestCallBack");
                    errMsg = [];
                    errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
                    reply.setError(errMsg.join(""));
                    if (timerLoad){
                        timerLoad.Abort();
                    }
                    funcCallback(reply);
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            };
            
            if(CERN_BrowserDevInd){
				var url = request.getProgramName() + "?parameters=" + request.getParameters().join(",");
				info.open("GET", url, request.isAsync());
				info.send(null); 
            }
            else{
            	info.open('GET', request.getProgramName(), request.isAsync());
            	info.send(request.getParameters().join(","));
            }
            
        },
        XMLCCLRequestThread: function(name, component, request){
            var m_name = name;
            var m_comp = component;
            
            var m_request = request;
            m_request.setName(name);
            
            this.getName = function(){
                return m_name;
            };
            this.getComponent = function(){
                return m_comp;
            };
            this.getRequest = function(){
                return m_request;
            };
        },
        XMLCCLRequestThreadManager: function(callbackFunction, component, handleFinalize){
            var m_threads = null;
            var m_replyAr = null;
            
            var m_isData = false;
            var m_isError = false;
            
            this.addThread = function(thread){
                if (!m_threads){ 
                    m_threads = [];
                }
                m_threads.push(thread);
            };
            
            this.begin = function(){
                if (m_threads && m_threads.length > 0) {
                    for (x = m_threads.length; x--;) {
                        //start each xmlcclrequest
                        var thread = m_threads[x];
                        MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread);
                    }
                }
                else {
                    if (handleFinalize) {
                        var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                    }
                    else {
                        callbackFunction(null, component);
                    }
                }
            };
            
            this.completeThread = function(reply){
                if (!m_replyAr){ 
                    m_replyAr = [];
                }
                if (reply.getStatus() === "S"){ 
                    m_isData = true;
                }
                else if (reply.getStatus() === "F") {
                    m_isError = true;
                }
                
                m_replyAr.push(reply);
                if (m_replyAr.length === m_threads.length) {
                    var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                    var errMsg = null;
                    try{
                    	if (handleFinalize) {
                            if (m_isError) {
                                //handle error response
                                errMsg = [];
                                for (var x = m_replyAr.length; x--;) {
                                    var rep = m_replyAr[x];
                                    if (rep.getStatus() === "F") {
                                        errMsg.push(rep.getError());
                                    }
                                }
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), component, "");
                            }
                            else if (!m_isData) {
                                //handle no data
                                countText = (component.isLineNumberIncluded() ? "(0)" : "");
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                            }
                            else {
                                callbackFunction(m_replyAr, component);
                            }
                        }
                        else {
                            callbackFunction(m_replyAr, component);
                        }
                    }
                    catch(err){
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCCLRequestThreadManager");
                    	var i18nCore = i18n.discernabu;
                        errMsg = ["<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>"];
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                    }
                }
            };
        },
        MapObject: function(name, value){
            this.name = name;
            this.value = value;
        },
        /**
         * An object to store the attributes of a single tab.
         * @param {Object} key The id associated to the tab.
         * @param {Object} name The name to be displayed on the tab.
         * @param {Object} components The components to be associated to the tab.
         */
        TabItem: function(key, name, components, prefIdentifier){
            this.key = key;
            this.name = name;
            this.components = components;
            this.prefIdentifier = prefIdentifier;
        },
        TabManager: function(tabItem){
            var m_isLoaded = false;
            var m_tabItem = tabItem;
            //By default a tab and all it's components are not fully expanded
            var m_isExpandAll = false;
            var m_isSelected = false;
            this.toggleExpandAll = function(){
                m_isExpandAll = (!m_isExpandAll);
            };
            this.loadTab = function(){
                if (!m_isLoaded) {
                    m_isLoaded = true;
                    var components = m_tabItem.components;
                    if (components) {
                        for (var xl = 0; xl < components.length; xl++) {
                            var component = components[xl];
                            if (component.isDisplayable() && component.isExpanded()){ 
                                component.InsertData();
                            }
                        }
		    			for (var xl = 0; xl < components.length; xl++) {
                            var component = components[xl];
                            if (component.isDisplayable() && !component.isExpanded()){ 
                                component.InsertData();
                            }
                        }
                    }
                }
            };
            this.getTabItem = function(){
                return m_tabItem;
            };
            this.getSelectedTab = function(){
                return m_isSelected;
            };
            this.setSelectedTab = function(value){
                m_isSelected = value;
            };
        },
        ReferenceRangeResult: function(){
            //results
            var m_valNLow = -1, m_valNHigh = -1, m_valCLow = -1, m_valCHigh = -1;
            //units of measure
            var m_uomNLow = null, m_uomNHigh = null, m_uomCLow = null, m_uomCHigh = null;
            this.init = function(refRange, codeArray){
                var nf = MP_Util.GetNumericFormatter();
                m_valCLow = nf.format(refRange.CRITICAL_LOW.NUMBER);
                if (refRange.CRITICAL_LOW.UNIT_CD != "") {
                    m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray);
                }
                m_valCHigh = nf.format(refRange.CRITICAL_HIGH.NUMBER);
                if (refRange.CRITICAL_HIGH.UNIT_CD != "") {
                    m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray);
                }
                m_valNLow = nf.format(refRange.NORMAL_LOW.NUMBER);
                if (refRange.NORMAL_LOW.UNIT_CD != "") {
                    m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray);
                }
                m_valNHigh = nf.format(refRange.NORMAL_HIGH.NUMBER);
                if (refRange.NORMAL_HIGH.UNIT_CD != "") {
                    m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray);
                }
            };
            this.getNormalLow = function(){
                return m_valNLow;
            };
            this.getNormalHigh = function(){
                return m_valNHigh;
            };
            this.getNormalLowUOM = function(){
                return m_uomNLow;
            };
            this.getNormalHighUOM = function(){
                return m_uomNHigh;
            };
            this.getCriticalLow = function(){
                return m_valCLow;
            };
            this.getCriticalHigh = function(){
                return m_valCHigh;
            };
            this.getCriticalLowUOM = function(){
                return m_uomCLow;
            };
            this.getCriticalHighUOM = function(){
                return m_uomCHigh;
            };
            this.toNormalInlineString = function(){
                var low = (m_uomNLow) ? m_uomNLow.display : "";
                var high = (m_uomNHigh) ? m_uomNHigh.display : "";
                if (m_valNLow != 0 || m_valNHigh != 0) {
                    return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high);
                }
                else { 
                    return "";
                }
            };
            this.toCriticalInlineString = function(){
                var low = (m_uomCLow) ? m_uomCLow.display : "";
                var high = (m_uomCHigh) ? m_uomCHigh.display : "";
                if (m_valCLow != 0 || m_valCHigh != 0) {
                    return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high);
                }
                else { 
                    return "";
                }
            };
        },
        
        QuantityValue: function(){
            var m_val, m_precision;
            var m_uom = null;
            var m_refRange = null;
            var m_rawValue = 0;
            var m_hasModifier = false;
            this.init = function(result, codeArray){
                var quantityValue = result.QUANTITY_VALUE;
                var referenceRange = result.REFERENCE_RANGE;
                for (var l=0,ll=quantityValue.length;l<ll;l++) {
                    var numRes = quantityValue[l].NUMBER;
                    m_precision = quantityValue[l].PRECISION;
                    if (!isNaN(numRes)) {
                        m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision);
                        m_rawValue = numRes;
                    }
                    if (quantityValue[l].MODIFIER_CD != "") {
                        var modCode = MP_Util.GetValueFromArray(quantityValue[l].MODIFIER_CD, codeArray);
                        if (modCode){
                            m_val = modCode.display + m_val;
                            m_hasModifier = true;
                        }
                    }
                    if (quantityValue[l].UNIT_CD != "") {
                        m_uom = MP_Util.GetValueFromArray(quantityValue[l].UNIT_CD, codeArray);
                    }
                    for (var m=0,ml=referenceRange.length;m<ml;m++) {
                        m_refRange = new MP_Core.ReferenceRangeResult();
                        m_refRange.init(referenceRange[m], codeArray);
                    }
                }
            };
						
            this.getValue = function(){
                return m_val;
            };
            this.getRawValue = function(){
            	return m_rawValue;
            };
            this.getUOM = function(){
                return m_uom;
            };
            this.getRefRange = function(){
                return m_refRange;
            };
            this.getPrecision = function(){
                return m_precision;
            };
            this.toString = function(){
                if (m_uom) {
                    return (m_val + " " + m_uom.display);
                }
                return m_val;
            };
            this.hasModifier = function(){
            	return m_hasModifier;
            };
        },
        //measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
        Measurement: function(){
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
            
            this.init = function(eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime){
                m_eventId = eventId;
                m_personId = personId;
                m_encntrId = encntrId;
                m_eventCode = eventCode;
                m_dateTime = dateTime;
                m_result = resultObj;
                m_updateDateTime = updateDateTime;
            };
			
            this.initFromRec = function(measObj, codeArray){
                var effectiveDateTime = new Date();
                var updateDateTime = new Date();
                m_eventId = measObj.EVENT_ID;
                m_personId = measObj.PATIENT_ID;
                m_encntrId = measObj.ENCOUNTER_ID;
                m_eventCode = MP_Util.GetValueFromArray(measObj.EVENT_CD, codeArray);			                    
                effectiveDateTime.setISO8601(measObj.EFFECTIVE_DATE);   
                m_dateTime = effectiveDateTime;
                m_result = MP_Util.Measurement.GetObject(measObj, codeArray);
                updateDateTime.setISO8601(measObj.UPDATE_DATE);
                m_updateDateTime = updateDateTime;		
                m_normalcy = MP_Util.GetValueFromArray(measObj.NORMALCY_CD, codeArray);
                m_status = MP_Util.GetValueFromArray(measObj.STATUS_CD, codeArray);
                m_comment = measObj.COMMENT;
            };
			
            this.getEventId = function(){
                return m_eventId;
            };
            this.getPersonId = function(){
                return m_personId;
            };
            this.getEncntrId = function(){
                return m_encntrId;
            };
            this.getEventCode = function(){
                return m_eventCode;
            };
            this.getDateTime = function(){
                return m_dateTime;
            };
            this.getUpdateDateTime = function(){
                return m_updateDateTime;
            };
            this.getResult = function(){
                return m_result;
            };
            this.setNormalcy = function(value){
                m_normalcy = value;
            };
            this.getNormalcy = function(){
                return m_normalcy;
            };
            this.setStatus = function(value){
                m_status = value;
            };
            this.getStatus = function(){
                return m_status;
            };
            this.isModified = function(){
                if (m_status) {
                    var mean = m_status.meaning;
                    if (mean === "MODIFIED" || mean ==="ALTERED") {
                    	return true;
                    }
                }
                return false;
            };
            this.getComment = function(){
                return m_comment;
			};
        },
        MenuItem: function(){
            var m_name = "";
            var m_desc = "";
            var m_id = 0.0;
            var m_meaning;
            var m_valSequence = 0; //This is used as the primary grouping value for IView bands
            var m_valTypeFlag = 0; //This is used to determine which is the band, section, or item
            
            this.setDescription = function(value){
                m_desc = value;
            };
            this.getDescription = function(){
                return m_desc;
            };
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setId = function(value){
                m_id = value;
            };
            this.getId = function(){
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
        CriterionFilters: function(criterion){
            var m_criterion = criterion;
            var m_evalAr = [];
            
            this.addFilter = function(type, value){
                m_evalAr.push(new MP_Core.MapObject(type, value));
            };
            this.checkFilters = function(){
                var pass = false;
                var patInfo = m_criterion.getPatientInfo();
                for (var x = m_evalAr.length; x--;) {
                    var filter = m_evalAr[x];
                    var dob = null;
                    switch (filter.name) {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            var sex = patInfo.getSex();
                            if (sex) {
                                if (filter.value == sex.meaning){ 
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
                            alert("Unhandled criterion filter");
                            return false;
                    }
                }
                return true;
            };
        },
        CreateSimpleError: function(component, sMessage){
            var errMsg = [];
            var i18nCore = i18n.discernabu;
            var countText = (component.isLineNumberIncluded() ? "(0)" : "");
            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", sMessage ,"</li></ul>");
            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
        }
    };
}();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;

MP_Core.AppUserPreferenceManager = function(){
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
        Initialize: function(criterion, preferenceIdentifier){
            m_criterion = criterion;
            m_prefIdent = preferenceIdentifier;
            m_jsonObject = null;
        },
		SetPreferences:function(prefString){
		    	var jsonEval = json_parse(prefString);
			m_jsonObject = jsonEval;
		},
        LoadPreferences: function(){
            if (!m_criterion) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return null;
            }
            if (m_jsonObject) {
                return;
            }
            else {
                var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
                info.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {
						MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "LoadPreferences");
		    	var jsonEval = json_parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "S") {
                            m_jsonObject = json_parse(recordData.PREF_STRING);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "Z") {
                            return;
                        }
                        else {
							MP_Util.LogScriptCallError(null, this, "mp_core.js", "LoadPreferences");
                            var errAr = [];
                            var statusData = recordData.STATUS_DATA;
                            errAr.push("STATUS: " + statusData.STATUS);
                            for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                var ss = statusData.SUBEVENTSTATUS[x];
                                errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                            }
                            window.status = "Error retrieving user preferences " + errAr.join(",");
                            return;
                        }
                    }
                    if (this.readyState == 4) {
                        MP_Util.ReleaseRequestReference(this);
                    }
                    
                };
                
                
                var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^"];
                if(CERN_BrowserDevInd){
                	var url = "MP_GET_USER_PREFS?parameters=" + ar.join(",");
					info.open("GET", url, false);
					info.send(null); 
                }
                else{
                	info.open('GET', "MP_GET_USER_PREFS", false);
                	info.send(ar.join(","));
                }
          
                return;
            }
        },
        /**
         * GetPreferences will return the users preferences for the application currently logged into.
         */
        GetPreferences: function(){
            if (!m_criterion) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return null;
            }
            if (!m_jsonObject){ 
                this.LoadPreferences();
            }
            
            return m_jsonObject;
        },
		SavePreferences: function(){
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
			var cclParams = [];
            
            //alert("groups.length: " + groups.length)
            for (var x = 0, xl = groups.length; x < xl; x++) {
				//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
				grpId = x + 1;
                //get liquid layout
                var liqLay = Util.Style.g("col-outer1", groups[x], "div");
                if (liqLay.length > 0) {
                    //get each child column
					var cols = Util.gcs(liqLay[0]);
                    for (var y = 0, yl = cols.length; y < yl; y++) {
                        colId = y + 1;
                        var rows = Util.gcs(cols[y]);
                        for (var z = 0, zl = rows.length; z < zl; z++) {
							var component = {};
                            rowId = z + 1;
                            compId = jQuery(rows[z]).attr('id');
                            var compObj = MP_Util.GetCompObjByStyleId(compId);
							component.id = compObj.getComponentId();
							component.group_seq = grpId;
							component.col_seq = colId;
							component.row_seq = rowId;							
							component.grouperFilterLabel = compObj.getGrouperFilterLabel();
							component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
							component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
							component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();							
							component.selectedTimeFrame = compObj.getSelectedTimeFrame();
							component.selectedDataGroup = compObj.getSelectedDataGroup();
                            if (jQuery(rows[z]).hasClass('closed')) {
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
            WritePreferences(jsonObject);
            if(typeof m_viewpointJSON=="undefined"){
				cclParams.push("^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+m_criterion.category_mean+"^",m_criterion.debug_ind);
				CCLLINK("MP_DRIVER",cclParams.join(","),1);
			}
			else{
                		var viewpointJSON = json_parse(m_viewpointJSON).VIEWPOINTINFO_REC;
				m_jsonObject=jsonObject;
				cclParams.push("^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+viewpointJSON.VIEWPOINT_NAME_KEY+"^",m_criterion.debug_ind,"^^",0,"^"+viewpointJSON.ACTIVE_VIEW_CAT_MEAN+"^");
				CCLLINK("MP_VIEWPOINT_DRIVER",cclParams.join(","),1);
			}
        },
        ClearCompPreferences: function(componentId){
		    var compObj = MP_Util.GetCompObjById(componentId);
		    var style = compObj.getStyles();
			var ns = style.getNameSpace();
			var prefObj = m_jsonObject;
			var filterArr = null;
		
			if (prefObj != null) {
			    	var strEval = json_parse(JSON.stringify(prefObj));
				var strObj = strEval.user_prefs.page_prefs.components;
				for (var x = strObj.length; x--;) {
					if (strEval&&strObj[x].id === componentId) {
						strObj[x].lookbackunits = compObj.getBrLookbackUnits();
						strObj[x].lookbacktypeflag = compObj.getBrLookbackUnitTypeFlag();
						strObj[x].grouperFilterLabel = "";
						strObj[x].grouperFilterCatLabel = "";
						strObj[x].grouperFilterCriteria = filterArr;
						strObj[x].grouperFilterCatalogCodes = filterArr;
						
						strObj[x].selectedTimeFrame = "";
						strObj[x].selectedDataGroup = "";
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
				m_jsonObject = strEval;
				WritePreferences(m_jsonObject);
				MP_Util.Doc.CreateLookBackMenu(compObj, 2, "");
				
				if (ns === "lab" || ns === "dg" || ns === "ohx" || ns === "ohx2") {
					compObj.getSectionContentNode().innerHTML = "";
				}
				if(compObj.isResourceRequired()){
					compObj.RetrieveRequiredResources();
				}
				else{
				    compObj.InsertData();						
				}
			}
		},
        SaveCompPreferences: function (componentId, theme, expCol, changePos) {
            var compObj = MP_Util.GetCompObjById(componentId);
            var prefObj = m_jsonObject;
			var noMatch = true;
            if (prefObj != null && !changePos) {
                var strEval = json_parse(JSON.stringify(prefObj));
                var strObj = strEval.user_prefs.page_prefs.components;

                for (var x = strObj.length; x--;) {
                    if (strEval && strObj[x].id === componentId) {
						noMatch = false;
                        if (theme) {
							strObj[x].compThemeColor = theme;
                        }
						if (expCol) {						
							if (expCol == "1") {
								strObj[x].expanded = true;
							}
							else {
								strObj[x].expanded = false;
							}
						}
							
							if (compObj.getGrouperFilterLabel()) {
								strObj[x].grouperFilterLabel = compObj.getGrouperFilterLabel();
							}
							if (compObj.getGrouperFilterCatLabel()) {
								strObj[x].grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
							}
							if (compObj.getGrouperFilterCriteria()) {
								strObj[x].grouperFilterCriteria = compObj.getGrouperFilterCriteria();
							}
							if (compObj.getGrouperFilterCatalogCodes() || compObj.getGrouperFilterCatalogCodes() === null) {
								strObj[x].grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
							} else {
								strObj[x].grouperFilterCatalogCodes = [];
							}
							
							if (compObj.getSelectedTimeFrame()) {
								strObj[x].selectedTimeFrame = compObj.getSelectedTimeFrame();
							}
							if (compObj.getSelectedDataGroup()) {
								strObj[x].selectedDataGroup = compObj.getSelectedDataGroup();
							}	
						//Save the components toggle status and the column and sequence information
						strObj[x].toggleStatus = compObj.getToggleStatus();
						strObj[x].col_seq = compObj.getColumn();
						strObj[x].row_seq = compObj.getSequence();
                    }
                }

				if (noMatch) { //single comp change but comp doesn't have user prefs
					var tempObj = {};
					tempObj.id = componentId;
					tempObj.group_seq = compObj.getPageGroupSequence();
					tempObj.col_seq = compObj.getColumn();
					tempObj.row_seq = compObj.getSequence();
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
					tempObj.toggleStatus = compObj.getToggleStatus();	

					tempObj.expanded = compObj.isExpanded();
					strObj.push(tempObj);
				}
                m_jsonObject = strEval;
                WritePreferences(m_jsonObject);
			}
			else {
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
				var cclParams = [];
	            
	            //alert("groups.length: " + groups.length)
	            for (var x = 0, xl = groups.length; x < xl; x++) {
					//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
					grpId = x + 1;
	                //get liquid layout
	                var liqLay = Util.Style.g("col-outer1", groups[x], "div");
	                if (liqLay.length > 0) {
	                    //get each child column
						var cols = Util.gcs(liqLay[0]);
	                    for (var y = 0, yl = cols.length; y < yl; y++) {
	                        colId = y + 1;
	                        var rows = Util.gcs(cols[y]);
	                        for (var z = 0, zl = rows.length; z < zl; z++) {
								var component = {};
	                            rowId = z + 1;
	                            compId = jQuery(rows[z]).attr('id');
								compObj = MP_Util.GetCompObjByStyleId(compId);
								component.id = compObj.getComponentId();

								if(compObj.getColumn() !== 99) {
									component.group_seq = 1;
									component.col_seq = colId;
									component.row_seq = rowId;
								}
								else {
									component.group_seq = 0;
									component.col_seq = 99;
									component.row_seq = rowId;
								}
								if(compObj.getCompColor()) {
									component.compThemeColor = compObj.getCompColor();
								}
								//Save the components toggle status
								component.toggleStatus = compObj.getToggleStatus();
								compObj.setColumn(component.col_seq);
								compObj.setSequence(component.row_seq);
								component.grouperFilterLabel = compObj.getGrouperFilterLabel();
								component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
								component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
								
								component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
								
								component.selectedTimeFrame = compObj.getSelectedTimeFrame();
								component.selectedDataGroup = compObj.getSelectedDataGroup();
	                            if (jQuery(rows[z]).hasClass('closed')) {
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
	            WritePreferences(jsonObject);
	            m_jsonObject = jsonObject;
			}
		},
		SaveQOCCompPreferences:function(componentId, theme, expCol, changePos, selectedViewId){
			var QOCTabDiv = _g(selectedViewId);
		    var groups = Util.Style.g("col-group", QOCTabDiv, "div");
		    var grpId = 0;
		    var colId = 0;
		    var rowId = 0;
		    var compId = 0;

			//there must be a last saved view in user prefs if they've got this far
			var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
			var userPrefs;
			var pagePrefs;
			var views;
			var lastSavedView;
			if (jsonObj){
				userPrefs = jsonObj.user_prefs;
				pagePrefs = userPrefs.page_prefs;
			    views = pagePrefs.views;
		        lastSavedView = pagePrefs.last_saved_view;
		        var viewIndex = -1;
		        var viewsLength = views.length;
		        for (var j = viewsLength; j--;) {
					var currentViewName = views[j].label;
					if (currentViewName === lastSavedView){
						viewIndex = j;
						break;
					}
				}
			}
		    
			if (lastSavedView && viewIndex >= 0){
				views[viewIndex].components = [];
		        for (var x = 0, xl = groups.length; x < xl; x++) {
					//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
					grpId = x + 1;
		            //get liquid layout
		            var liqLay = Util.Style.g("col-outer1", groups[x], "div");
		            if (liqLay.length > 0) {
		                //get each child column
						var cols = Util.gcs(liqLay[0]);
		                for (var y = 0, yl = cols.length; y < yl; y++) {
		                    colId = y + 1;
		                    var rows = Util.gcs(cols[y]);
		                    for (var z = 0, zl = rows.length; z < zl; z++) {
								var component = {};
		                        rowId = z + 1;
		                        compId = jQuery(rows[z]).attr('id');
								compObj = MP_Util.GetCompObjByStyleId(compId);
								component.id = compObj.getComponentId();
								component.reportId = compObj.getReportId();
								component.label = compObj.getLabel();
								if(compObj.getColumn() !== 99) {
									component.group_seq = 1;
									component.col_seq = colId;
									component.row_seq = rowId;
								}
								else {
									component.group_seq = 0;
									component.col_seq = 99;
									component.row_seq = rowId;
								}
								if(compObj.getCompColor()) {
									component.compThemeColor = compObj.getCompColor();
								}
								component.grouperFilterLabel = compObj.getGrouperFilterLabel();
								component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
								component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
								component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
								component.selectedTimeFrame = compObj.getSelectedTimeFrame();
								component.selectedDataGroup = compObj.getSelectedDataGroup();
		                        if (jQuery(rows[z]).hasClass('closed')) {
		                            component.expanded = false;
		                        }
		                        else { 
		                            component.expanded = true;
		                        }
		                        views[viewIndex].components.push(component);
		                    }
		                }
		            }
		        }
			}
		    WritePreferences(jsonObj);
		    m_jsonObject = jsonObj;
		},
		SaveViewpointPreferences:function(vpNameKey, vwpObj){
			WriteViewpointPreferences(vwpObj.VIEWS,vpNameKey);
		},
		SaveQOCPreferences:function(jsonObj){
			m_prefIdent = "MP_COMMON_ORDERS_V4";
			m_criterion.category_mean = "MP_COMMON_ORDERS_V4";
			WritePreferences(jsonObj);
		},
        GetQOCPreferences: function(){
            if (!m_criterion) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return null;
            }
            if (!m_jsonObject){ 
            	m_prefIdent = "MP_COMMON_ORDERS_V4";
            	m_criterion.category_mean = "MP_COMMON_ORDERS_V4";
                this.LoadPreferences();
            }
            
            return m_jsonObject;
        },
		ClearPreferences: function(){
			WritePreferences(null);
			var cclParams = [];
			if(typeof m_viewpointJSON == "undefined"){
				cclParams = ["^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + m_criterion.category_mean + "^", m_criterion.debug_ind];
				CCLLINK("MP_DRIVER", cclParams.join(","), 1 );
			}
			else {
			    	var viewpointJSON = json_parse(m_viewpointJSON).VIEWPOINTINFO_REC;
				cclParams = ["^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + viewpointJSON.VIEWPOINT_NAME_KEY + "^", m_criterion.debug_ind, "^^", 0, "^" + viewpointJSON.ACTIVE_VIEW_CAT_MEAN + "^"];
				CCLLINK("MP_VIEWPOINT_DRIVER", cclParams.join(","), 1 );
			}
		},
        /**
         * Returns the json object associated to the primary div id of the component.  It is assumed LoadPreferences has been called prior to execution
         * @param {Object} id
         */
        GetComponentById: function(id){
            if (m_jsonObject) {
                var components = m_jsonObject.user_prefs.page_prefs.components;
                for (var x = components.length; x--;) {
                    var component = components[x];
                    if (component.id == id){ 
                        return component;
                    }
                }
            }
            return null;
        }
	};
    function WriteViewpointPreferences(jsonObject, viewpointNameKey, successMessage){
		var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
		info.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200) {
				MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WriteViewpointPreferences");
				var jsonEval = json_parse(this.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "Z") {
					m_jsonObject = null;
				}
				else if (recordData.STATUS_DATA.STATUS == "S") {
					m_jsonObject = jsonObject;
					if (successMessage && successMessage.length > 0){
						alert(successMessage);
					}
				}
				else {
					MP_Util.LogScriptCallError(null, this, "mp_core.js", "WriteViewpointPreferences");
					var errAr = [];
					var statusData = recordData.STATUS_DATA;
					errAr.push("STATUS: " + statusData.STATUS);
					for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
						var ss = statusData.SUBEVENTSTATUS[x];
						errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
					}
					window.status = "Error saving viewpoint user preferences: " + errAr.join(",");
				}
			}
			if (this.readyState == 4) {
				MP_Util.ReleaseRequestReference(this);
			}
		};
		
		var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
		var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + viewpointNameKey + "^", "~" + sJson + "~"];
		if(CERN_BrowserDevInd){
			var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
			info.open('GET', url, false);
			info.send(null);
		}
		else{
			info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
			info.send(ar.join(","));
		}
	}
    function WritePreferences(jsonObject, successMessage){
        var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
        info.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
				MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WritePreferences");
	    	var jsonEval = json_parse(this.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "Z") {
                    m_jsonObject = null;
                }
                else if (recordData.STATUS_DATA.STATUS == "S") {
                    m_jsonObject = jsonObject;
                    if (successMessage && successMessage.length > 0){
                        alert(successMessage);
                    }
                }
                else {
					MP_Util.LogScriptCallError(null, this, "mp_core.js", "WritePreferences");
                    var errAr = [];
                    var statusData = recordData.STATUS_DATA;
					errAr.push("STATUS: " + statusData.STATUS);
                    for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                        var ss = statusData.SUBEVENTSTATUS[x];
                        errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                    }
					window.status = "Error saving user preferences: " + errAr.join(",");
                }
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
		};
        
        var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
        var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "~" + sJson + "~"];
        if(CERN_BrowserDevInd){
        	var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
			info.open('GET', url, false);
			info.send(null);
        }
        else{
        	info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
        	info.send(ar.join(","));
        }
    }
}();

/**
 * @namespace
 */
var MP_Util = function() {
	var m_df = null;
	var m_nf = null;
	var m_codeSets = [];
	return {
		/**
		 * Helper utility to retrieve the <code>Criterion</code> Object generated from the provide JSON
		 * @param js_criterion [REQUIRED] The JSON associated to the criterion data that is to be loaded
		 * @param static_content [REQUIRED] The <code>String</code> location in which the static content resides
		 */
		GetCriterion : function(js_criterion, static_content){
			MP_Util.LogDebug("Criterion: " + JSON.stringify(js_criterion));
			var jsCrit = js_criterion.CRITERION;
			var criterion = new MP_Core.Criterion(jsCrit, static_content);
			var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES);
			var jsPatInfo = jsCrit.PATIENT_INFO;
			var patInfo = new MP_Core.PatientInformation();
            
            patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));

			patInfo.setDOB(jsPatInfo.DOB);
			patInfo.setName(jsPatInfo.NAME);
			patInfo.setMRN(jsPatInfo.MRN);
			patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));

			criterion.setPatientInfo(patInfo);
			
			return criterion;
		},
		
		/**
		 * Calculates the lookback date based on the current date and time
		 * @param lookbackDays [REQUIRED] The number of days to look back in time
		 * @return <code>Date</code> Object representing the lookback date and time
		 */
		CalcLookbackDate : function(lookbackDays){
			var retDate = new Date();
			var hrs = retDate.getHours();
			hrs -= (lookbackDays*24);
			retDate.setHours(hrs);
			return retDate;
		},
		/**
		 * Calculates the within time from the provide date and time.
		 * @param dateTime [REQUIRED] The <code>Date</code> Object in which to calculate the within time
		 * @return <code>String</code> representing the time that has passed from the provided date and time
		 */
		CalcWithinTime : function(dateTime) {
			return (GetDateDiffString(dateTime, null, null, true));
		},
		/**
		 * Calculates the age of a patient from a given point in time.  If the point in time is not provided, the current date/time is utilized
		 * @param birthDt [REQUIRED] The <code>Date</code> Object in which to calculate the age of the patient
		 * @param fromDate [OPTIONAL] The <code>Date</code> Object in which to calculate the age of the patient from.  This is useful in cases
		 * where the patient is deceased and the date utilized is the deceased date.
		 * @return <code>String</code> representing the age of the patient
		 */
		CalcAge : function(birthDt, fromDate) {
			//If from Date is null (not passed in) then set to current Date
			fromDate = (fromDate) ? fromDate : new Date();
			return(GetDateDiffString(birthDt, fromDate, 1, false));
		},
		/**
		 * Display the date and time based on the configuration of the component
		 * @param component [REQUIRED] The component in which holds the configuration for the date formatting
		 * @param date [REQUIRED] The date in which to properly format
		 * @return <code>String</code> representing the date and time of the date provided
		 */
        DisplayDateByOption: function(component, date){
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
		DisplaySelectedTab: function(showDiv, anchorId){
			var i = 0;
			if(window.name == "a-tab0") {//first tab is default
				window.name = "";
			}
			else {
				window.name = showDiv+','+anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
				}
				else {
					divs[i].style.display = 'none';
				}
			}
			
			var anchors = Util.Style.g("anchor-tab-item", body);
			for( i = anchors.length; i--; ) {
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
			
			for (var yl = CERN_TabManagers.length; yl--;) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--;) {
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
		DisplaySelectedTabQOC: function(showDiv, anchorId, noViewSaved){
			var i = 0;
			var firstTimeLoadingMPage = false;
			if(noViewSaved) {
				var dropDownList = _g("viewListSelectorID");
				if(dropDownList.options[dropDownList.options.length - 1].value == "Blank_Space") {
					dropDownList.remove(dropDownList.options.length-1);
					firstTimeLoadingMPage = true;//sort of a quick fix, but desperate times call for desperate measures
					//on intitial load with no last saved view in user prefs, the noViewsSaved variable will always
					//be true until the user refreshes the page. The only time no view has been saved is the time we 
					//delete the Blank_Space from the view selector.
				}
				
				var noSavedViewsStatement = _g("noSavedViews");
				if(!Util.Style.ccss(noSavedViewsStatement, "hidden")) {
					Util.Style.acss(noSavedViewsStatement, "hidden");
				}
			}
			
			if(window.name == "a-tab0")				//first tab is default
			{
				window.name = "";
			}
			else {
				window.name = showDiv+','+anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
					if(Util.Style.ccss(divs[i], "div-tab-item-not-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-not-selected");
						Util.Style.acss(divs[i], "div-tab-item-selected");
					}
				}
				else {
					divs[i].style.display = 'none';
					if(Util.Style.ccss(divs[i], "div-tab-item-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-selected");
						Util.Style.acss(divs[i], "div-tab-item-not-selected");
					}
				}
			}
			
			var anchors = Util.Style.g("anchor-tab-item", body);
			for( i = anchors.length; i--; ) {
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
			
			for (var yl = CERN_TabManagers.length; yl--;) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);
					
					//grab user preferences, and then save back preferences with updated last saved view
					var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
					var userPrefs,pagePrefs,views,lastSavedView;
					if(jsonObj) {
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
					if (viewsLength === 0){
					    views.push(newView);
					}
					else{
						var alreadyAddedView = false;
						for (var j = viewsLength; j--;) {
							var currentViewName = views[j].label;
							if (currentViewName === newView.label){
								alreadyAddedView = true;
								break;
							}
						}
						if (!alreadyAddedView){
							views.push(newView);
						}
					}

					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObj);
					var criterion;
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--;) {
							var component = components[xl];
							criterion = component.getCriterion();
							MP_Util.Doc.AddCustomizeLink(criterion);
							break;
						}
					}
					MP_Util.Doc.InitQOCDragAndDrop(tabItem.key);
					var categoryMeaning = "MP_COMMON_ORDERS_V4";
					if (noViewSaved && firstTimeLoadingMPage){
						MP_Util.Doc.CreateQOCPageMenu(tabItem.key, categoryMeaning, criterion);
					}
					else{
						//since page menu has already been created, update column View Layout selection
						var vpParent = "#" + tabItem.key + " ";
						var initialColCnt;
						var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
						switch (curColGroupClass) {
							case "five-col":
								initialColCnt = 5;
								break;
							case "four-col":
								initialColCnt = 4;
								break;
							case "three-col":
								initialColCnt = 3;
								break;
							case "two-col":
								initialColCnt = 2;
								break;
							case "one-col":
								initialColCnt = 1;
								break;
						}
						var menuId = "pageMenu" + categoryMeaning;
		    			$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
		    			$("#optMenuConfig" + menuId + " div.view-layout" + initialColCnt).addClass("view-layout-selected");
					}
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		OpenTab: function(compId){
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					comp.openTab();
				}
			}
		},
		OpenIView: function(compId){
			var comp = MP_Util.GetCompObjByStyleId(compId);
			comp.openIView();
		},
		LaunchMenuSelection: function(compId, menuItemId){
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
		LaunchIViewMenuSelection: function(compId, bandName, sectionName, itemName){
			var rootId = parseInt(compId,10);
			var component = MP_Util.GetCompObjById(rootId);
			var criterion = component.getCriterion();
			var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
			launchIViewApp.LaunchIView(bandName, sectionName, itemName, criterion.person_id, criterion.encntr_id);
		},
		LaunchMenu: function(menuId, componentId){
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
		LaunchLookBackSelection:function(compId, lookBackUnits, lookBackType){
			var i18nCore=i18n.discernabu;
		    var rootId = parseInt(compId, 10);
		    var component = MP_Util.GetCompObjById(rootId);
		    var style = component.getStyles();
			var ns = style.getNameSpace();
			var scope = component.getScope();
			var displayText = "";
			var lbtVal = parseInt(lookBackType,10);
			
			if (component.getLookbackUnits() !== lookBackUnits || component.getLookbackUnitTypeFlag() !== lbtVal) {
				component.setLookbackUnits(lookBackUnits);
				component.setLookbackUnitTypeFlag(lbtVal);
				
				if(scope>0){
					if(lookBackUnits > 0 && lbtVal > 0) {
						var newText ="";
						switch(lbtVal){
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
						switch(scope){
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
				if(component.isResourceRequired()){
					component.RetrieveRequiredResources();
				}
				else{
				    component.InsertData();						
				}
			}
		},
		LaunchCompFilterSelection:function(compId, filterLabel, eventSetIndex, applyFilterInd){
			var component = MP_Util.GetCompObjById(compId);
			var i18nCore = i18n.discernabu;
			var mnuDisplay = filterLabel;
			var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var styleId = style.getId();
			var loc = component.getCriterion().static_content;
			var mnuId = styleId+"TypeMenu";
			var z = 0;
			
			if (ns === "ohx" || ns === "ohx2") {
				var catCodeList = component.getGrouperCatalogCodes(eventSetIndex);
			} else {
				var eventSetList = component.getGrouperCriteria(eventSetIndex);
			}
			
			
			//Set component prefs variables with filter settings
			if (ns === "ohx" || ns === "ohx2") {
				component.setGrouperFilterCatLabel(filterLabel);
			} else {
				component.setGrouperFilterLabel(filterLabel);
			}
			if(filterLabel !== dispVar) {
				
				if (ns === "ohx" || ns === "ohx2") {
					component.setGrouperFilterCatalogCodes(catCodeList);
				} else {
					component.setGrouperFilterCriteria(eventSetList);
				}
				
			}
			else {
				component.setGrouperFilterCriteria(null);
				component.setGrouperFilterCatalogCodes(null);
			}
			
			//Find Filter Applied msg span and replace it only if the Facility defined view is not selected
			var filterAppliedSpan = _g("cf"+compId+"msg");
			if (filterAppliedSpan){
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if(filterLabel !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf",compId,"msg' class='filter-applied-msg' title='",filterLabel,"'>",i18nCore.FILTER_APPLIED,"</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join(''); 
				var lbDropDownDiv = _g("lbMnuDisplay"+compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
			else {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf",compId,"msg' class='filter-applied-msg' title=''></span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join(''); 
				var lbDropDownDiv = _g("lbMnuDisplay"+compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
			
			//Find the content div
			var contentDiv = _g("Accordion"+compId+"ContentDiv");
			contentDiv.innerHTML = "";
			
			//Create the new content div innerHTML with the select list
			var contentDivArr = [];
			contentDivArr.push("<div id='cf",mnuId,"' class='acc-mnu'>");
			contentDivArr.push("<span id='cflabel",compId,"' onclick='MP_Util.LaunchMenu(\"",mnuId,"\", \"",styleId,"\");'>",i18nCore.FILTER_LABEL,mnuDisplay,"<a id='compFilterDrop",compId,"'><img src='", loc,"/images/3943_16.gif'></a></span>");
			contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='acc-mnu-contentbox'>");
			contentDivArr.push("<div><span id='cf",styleId,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,",\"",dispVar,"\",\"\",1);'>",i18nCore.FACILITY_DEFINED_VIEW,"</span></div>");
			var groupLen = component.m_grouper_arr.length;
			for(z = 0; z < groupLen; z++) {
				if(component.getGrouperLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf",styleId,z,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,",\"",component.getGrouperLabel(z),"\",",esIndex,",1);'>",component.getGrouperLabel(z),"</span></div>");
				}
				if(component.getGrouperCatLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf",styleId,z,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,",\"",component.getGrouperCatLabel(z),"\",",esIndex,",1);'>",component.getGrouperCatLabel(z),"</span></div>");
				}
			}
			contentDivArr.push("</div></div></div>");
			contentDiv.innerHTML = contentDivArr.join('');
			
			if(applyFilterInd === 1){
				if(filterLabel === i18nCore.FACILITY_DEFINED_VIEW){
					if(component.isResourceRequired()){
						component.RetrieveRequiredResources();
					}
					else{
					    component.InsertData();						
					}
				} else {
					
					if (ns === "ohx" || ns === "ohx2") {
						component.FilterRefresh(filterLabel, catCodeList);
					} else {
						component.FilterRefresh(filterLabel, eventSetList);
					}
					
				}
			}
		},
		LaunchViewMenu: function(menuId){
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
				var js_viewpoint = json_parse(m_viewpointJSON);
				if (parseInt(js_viewpoint.VIEWPOINTINFO_REC.CS_ENABLED, 10)) {		
					var sec = _g("viewDrop"); 
					var ofs = Util.goff(sec);				
					menu.style.left = (ofs[0] - 5) + "px";
					menu.style.top = (ofs[1] + 24) + "px";
				}
			}
		},
		closeViewMenuInit : function(inMenu) {
			var menuId = inMenu.id;
			var e = window.event;
			
			var menuLeave = function(e){
				if (!e){ 
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
				Util.addEvent(inMenu, "mouseleave", function(){
					Util.Style.acss(inMenu, "menu-hide");
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		closeMenuInit: function(inMenu, compId){
			var menuId;
			var docMenuId = compId + "Menu";
			var lbMenuId = compId+"Mnu";
			var cfMenuId=compId+"TypeMenu";
			
			var menuLeave = function(e){
				if (!e){ 
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
				Util.addEvent(inMenu, "mouseleave", function(){
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
		CreateTitleText: function(component, nbr, optionalText){
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
		GetContentClass: function(component, nbr){
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
		CreateTimer: function(timerName, subTimerName, metaData1, metaData2, metaData3){
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
		GetCodeSet: function(codeSet, async){
			var codes = new Array();
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
			info.onreadystatechange = function(){
				if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetCodeSet");
					var jsonEval = json_parse(this.responseText);
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
			if(CERN_BrowserDevInd){
				var url = "MP_GET_CODESET?parameters=" + sendVal;
				info.open('GET', url, async);
				info.send(null);
			}
			else{
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
		GetCodeByMeaning: function(mapCodes, meaning){
			for (var x = mapCodes.length;x--;) {
				var code = mapCodes[x].value;
				if (code.meaning == meaning) 
					return code;
			}
			return null;
		},
		GetCodeValueByMeaning: function(meaning, codeSet){
		    var codeValue = 0;
		    var list = m_codeSets[codeSet];
		    if (!list){
		        list = m_codeSets[codeSet] = MP_Util.GetCodeSet(codeSet, false);
		    }
		    if (list && list.length > 0){
		        for (var x = list.length;x--;){
		            var code = list[x].value;
		            if (code.meaning === meaning){
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
		GetItemFromMapArray: function(mapItems, item){
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
		AddItemToMapArray: function(mapItems, key, value){
			var ar = MP_Util.GetItemFromMapArray(mapItems, key);
			if (!ar) {
				ar = []
				mapItems.push(new MP_Core.MapObject(key, ar));
			}
			ar.push(value);
		},
		LookBackTime: function(component){
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
		CreateClinNoteLink: function(patient_id, encntr_id, event_id, display, docViewerType, pevent_id){
			var docType = (docViewerType && docViewerType > "") ? docViewerType : 'STANDARD';
			var doclink = ""
			if (event_id > 0) {
				var ar = [];
				ar.push(patient_id, encntr_id, event_id,"\""+docType+"\"", pevent_id);
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
		LaunchClinNoteViewer: function(patient_id, encntr_id, event_id, docViewerType, pevent_id){
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
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendDocEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendDocEvent(event_id);
						}
						viewerObj.LaunchDocViewer();
						break;
					case 'EVENT':
						viewerObj.CreateEventViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendEvent(event_id);
						}
						viewerObj.LaunchEventViewer();
						break;
					case 'MICRO':
						viewerObj.CreateMicroViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendMicroEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendMicroEvent(event_id);
						}
						viewerObj.LaunchMicroViewer();
						break;
					case 'GRP':
						viewerObj.CreateGroupViewer();
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendGroupEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendGroupEvent(event_id);
						}
						viewerObj.LaunchGroupViewer();
						break;
					case 'PROC':
						viewerObj.CreateProcViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendProcEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendProcEvent(event_id);
						}
						viewerObj.LaunchProcViewer();
						break;
					case 'HLA':
						viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, m_dEventId);
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
				alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS+"  "+i18n.discernabu.CONTACT_ADMINISTRATOR);
			}
			
		},
		IsArray: function(input){
			return (typeof(input)=='object'&&(input instanceof Array));
		},
		IsString: function(input){
			return (typeof(input)=='string');
		},
		HandleNoDataResponse: function(nameSpace){
			var i18nCore = i18n.discernabu;
			return ("<h3 class='info-hd'><span class='res-normal'>" + i18nCore.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18nCore.NO_RESULTS_FOUND + "</span>");
		},
		HandleErrorResponse: function(nameSpace, errorMessage){
			var ar = [];
			var i18nCore = i18n.discernabu;
			var ns = (nameSpace && nameSpace.length > 0) ? nameSpace + "-" : "";
			ar.push("<h3 class='info-hd'><span class='res-normal'>", i18nCore.ERROR_RETREIVING_DATA, "</span></h3>");
			ar.push("<dl class='", ns, "info'><dd><span>", i18nCore.ERROR_RETREIVING_DATA, "</span></dd></dl>");
			//add error in hover if exists
			if (errorMessage != null && errorMessage.length > 0) {
				ar.push("<h4 class='det-hd'><span>DETAILS</span></h4><div class='hvr'><dl class='", ns, "det'><dd><span>", errorMessage, "</span></dd></dl></div>");
			}
			return ar.join("");
		},
		GetValueFromArray: function(name, array){
			if (array != null) {
				for (var x = 0, xi = array.length; x < xi; x++) {
					if (array[x].name == name) {
						return (array[x].value);
					}
				}
			}
			return (null);
		},
		GetPrsnlObjByIdAndDate: function(name, date, personnelArray){
			var prsnlObj;
			var latestPrsnlObj;
			try{
				if (personnelArray && personnelArray.length) {
					for (var x = 0, xi = personnelArray.length; x < xi; x++) {
						if (personnelArray[x].name == name) {
							prsnlObj = personnelArray[x].value;
							//If no personnel object found return the first/latest prsnl name
							if(!latestPrsnlObj){
								latestPrsnlObj = prsnlObj;
							}
							if(typeof date == "string"){
								//Convert to the correct date format for comparison
								if(/^\/Date\(/.exec(date)){
									date = /[0-9]+-[0-9]+-[0-9]+/.exec(date) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(date) + "Z";
								}
								if((date > prsnlObj.beg_dt_tm_string && date < prsnlObj.end_dt_tm_string) || date == prsnlObj.beg_dt_tm_string || date == prsnlObj.end_dt_tm_string) {
									return(prsnlObj);
								}
							}
							else{
								throw(new Error("Invalid date object passed into GetPrsnlObjByIdAndDate.  The date object must be a string."));
							}
						}
					}
					return (latestPrsnlObj);
				}
				return (null);
			}
			catch(err){
				MP_Util.LogJSError(err, null, "mp_core.js", "GetPrsnlObjByIdAndDate");
				return(null);
			}
		},
		GetCompObjById: function(id){
			var comps = CERN_MPageComponents;
			var cLen = comps.length;
			for (var i=cLen; i--;) {
				var comp = comps[i];
				if (comp.m_componentId === id) {
					return comp;
				}
			}
			return (null);
		},
		GetCompObjByStyleId:function(id){
			var cLen=CERN_MPageComponents.length;
			for(var i=cLen;i--;){
				var comp=CERN_MPageComponents[i];
				var styles=comp.getStyles();
				if(styles.getId()===id){
					return comp;
				}
			}
			return (null);
		},
		LoadCodeListJSON: function(parentElement){
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
		LoadPersonelListJSON: function(parentElement){
			var personnelArray = [];
			var codeElement;
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var prsnlObj = {};
					codeElement = parentElement[x];
					prsnlObj.id = codeElement.ID;
					//If available retrieve the beg and end date and time for a prsnl name
					if(codeElement.BEG_EFFECTIVE_DT_TM){
						prsnlObj.beg_dt_tm = codeElement.BEG_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.beg_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "Z";
					}
					if(codeElement.END_EFFECTIVE_DT_TM){
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
        WriteToFile: function(sText){
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
		CalculateAge: function(bdate){
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
        pad: function(str, len, pad, dir){
			if (typeof(len) == "undefined") {
				var len = 0;
			}
			if (typeof(pad) == "undefined") {
				var pad = ' ';
			}
			if (typeof(dir) == "undefined") {
				var dir = STR_PAD_RIGHT;
			}
			
			if (len + 1 >= str.length) {
			
				switch (dir) {
				
					case STR_PAD_LEFT:
						str = Array(len + 1 - str.length).join(pad) + str;
						break;
						
					case STR_PAD_BOTH:
						var right = Math.ceil((padlen = len - str.length) / 2);
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
		GraphResults: function(eventCd, compID, groupID){
			var component=MP_Util.GetCompObjById(compID);
			var lookBackUnits = (component.getLookbackUnits() != null && component.getLookbackUnits() > 0) ? component.getLookbackUnits() : "365";
			var lookBackType = (component.getLookbackUnitTypeFlag() != null && component.getLookbackUnitTypeFlag() > 0) ? component.getLookbackUnitTypeFlag() : "2";
			var i18nCore = i18n.discernabu;
			var subTitleText = "";
			var scope = component.getScope();
			var lookBackText = "";
			var criterion = component.getCriterion();
			component.setLookbackUnits(lookBackUnits);
			component.setLookbackUnitTypeFlag(lookBackType);

			if(scope > 0) {
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
			var sParams = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "\\discrete-graphing^," + groupID + ".0," +criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^";
			var graphCall = "javascript:CCLLINK('mp_retrieve_graph_results', '" + sParams + "',1)";
			MP_Util.LogCclNewSessionWindowInfo(null, graphCall, "mp_core.js", "GraphResults");
			javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);
			Util.preventDefault();
		},
		ReleaseRequestReference: function(reqObj){
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
		AlertConfirm: function (msg, title, btnTrueText, btnFalseText, falseBtnFocus, cb) {
				var btnTrue = "<button id='acTrueButton' data-val='1'>" + ((btnTrueText) ? btnTrueText : i18n.discernabu.CONFIRM_OK) + "</button>";
				var btnFalse = "";
				if (btnFalseText) {
					btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
				}
				if (!title) {
					title = "&nbsp;";
				}

				var closeBox = function () {
					var btnVal = parseInt(this.getAttribute('data-val'), 10);
					$(".modal-div").remove();
					$(".modal-dialog").remove();
					$("html").css("overflow", "auto"); //reset overflow
					if(btnVal && typeof cb==="function") {
						cb();
					}
				}

				var modalDiv = Util.cep("div", {"className": "modal-div"});
				var dialog = Util.cep("div", {"className": "modal-dialog"});

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

				$("html").css("overflow", "hidden"); //disable page scrolling when modal is enabled
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
		ActionableAlertConfirm: function (msg, title, btnFalseText, falseBtnFocus, cb) {
			var btnFalse = "";
			if (btnFalseText) {
				btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
			}
			if (!title) {
				title = "&nbsp;";
			}

			var closeBox = function () {
				var btnVal = parseInt(this.getAttribute('data-val'), 10);
				$(".modal-div").remove();
				$(".modal-dialog-actionable").remove();
				$("html").css("overflow", "auto"); //reset overflow
				if(cb && typeof cb==="function") {
					cb();
				}
			}
			
			var modalDiv = Util.cep("div", {"className": "modal-div"});
			var dialog = Util.cep("div", {"className": "modal-dialog-actionable"});

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

			$("html").css("overflow", "hidden"); //disable page scrolling when modal is enabled
			$(modalDiv).height($(document).height());
		},
		CreateAutoSuggestBoxHtml: function(component, elementId){
			var searchBoxHTML = [];
			var txtBoxId = "";
			var compNs = component.getStyles().getNameSpace();
			var compId = component.getComponentId();
			if (elementId) {
				txtBoxId = compNs + elementId + compId;
			}else {
				txtBoxId = compNs + "ContentCtrl" + compId;
			}
			
			searchBoxHTML.push("<div class='search-box-div'><form name='contentForm' onSubmit='return false'><input type='text' id='", txtBoxId ,"'"," class='search-box'></form></div>");
			return searchBoxHTML.join("");
		},
		AddAutoSuggestControl: function( component, queryHandler, selectionHandler, selectDisplayHandler, itemId){
			new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler,itemId);
		},
		RetrieveAutoSuggestSearchBox: function(component){
			var componentNamespace = component.getStyles().getNameSpace();
			var componentId = component.getComponentId();
			return _g(componentNamespace + "ContentCtrl" + componentId);
		},
		CreateParamArray:function(ar,type){
			var returnVal = (type === 1) ? "0.0" : "0";
			if (ar && ar.length > 0){
				if (ar.length > 1){
					if (type === 1){
						returnVal = "value(" + ar.join(".0,") + ".0)"
					}
					else{
						returnVal = "value(" + ar.join(",") + ")"
					}			
				}
				else{
					returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
				}
			}
			return returnVal;
		},
		/**
		 * Will get the date formatter associate to the locale loaded by the driver
		 * @return The date formatter to utilize for the loaded locale
		 */
		GetDateFormatter: function(){
			if (!m_df){
				m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			}
			return m_df;
		},
		/**
		 * Will get the numeric formatter associate to the locale loaded by the driver
		 * @return The numeric formatter to utilize for the loaded locale
		 */
		GetNumericFormatter: function(){
			if (!m_nf) {
				m_nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
			}
			return m_nf;
		},
		/**
		 * Replaces the current MPages view with the output of the reportName script
		 */
		PrintReport: function (reportName, person_id, encounter_id){
			var paramString = "^MINE^,^" + reportName + "^," + person_id + "," + encounter_id;
			CCLLINK("pwx_rpt_driver_to_mpage",paramString,1);	
		},	
		CalculatePrecision : function(valRes){		
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
		CreateDateParameter : function(date){
	        var day = date.getDate();
	        var month = ""
	        var rest = date.format("yyyy HH:MM:ss");
	        switch (date.getMonth()){
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
		LogDebug : function( debugString ) {
			if(debugString){
				log.debug(debugString);
			}
		},
		LogWarn : function( warnString ) {
			if(warnString){
				log.warn(warnString);
			}
		},
		LogInfo : function( infoString ) {
			if(infoString){
				log.info(infoString);
			}
		},
		LogError : function( errorString ) {
			if(errorString){
				log.error(errorString);
			}
		},
        //Custom function that returns true if blackbird is visible, false otherwise
		IsBlackBirdVisible: function() {
            return log.isBlackBirdVisible();
        },
		LogScriptCallInfo : function( component, request, file, funcName ) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText].join(""));
		},
		LogScriptCallError : function( component, request, file, funcName ) { 
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status].join(""));
		},
		LogJSError : function( err, component, file, funcName ) {
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description].join(""));
		},
		LogDiscernInfo : function( component, objectName, file, funcName ) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName].join(""));
		},
		LogMpagesEventInfo : function( component, eventName, params, file, funcName ){
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params].join(""));
		},
		LogCclNewSessionWindowInfo : function( component, params, file, funcName ){
			log.debug(["CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params].join(""));
		},
		LogTimerInfo: function(timerName, subTimerName, timerType, file, funcName){
			log.debug(["Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName].join(""));
		},
		AddCookieProperty:function(compId, propName, propValue) {
			var cookie = CK_DATA[compId];
			if(!cookie){
				cookie = {};
			}
			cookie[propName] = propValue;
			CK_DATA[compId] = cookie;
		},
		GetCookieProperty:function(compId, propName) {
			var cookie = CK_DATA[compId];
			if(cookie && cookie[propName]){
				return cookie[propName];
			}
			else{
				return null;
			}
		},
		WriteCookie:function() {
			var cookieJarJSON = JSON.stringify(CK_DATA);
			document.cookie = 'CookieJar=' + cookieJarJSON + ';';
		},
		RetrieveCookie:function() {
			var cookies = document.cookie;
			var match = cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
			if(match && match[1]) {
			    CK_DATA = json_parse(match[1]);
			}
		}
	};
	/**
	 * Calculates difference between two dates given and returns string with appropriate units
	 * If no endDate is given it is assumed the endDate is the current date/time
	 * 
	 * @param beginDate [REQUIRED] Begin <code>Date</code> for Calculation
	 * @param endDate [OPTIONAL] End <code>Date</code> for Calculation
	 * @param mathFlag [OPTIONAL] <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 = Floor, 0 = Ceil		
	 * @param abbreviateFlag [REQUIRED] <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used such as in the case of a within string					
	 */
	function GetDateDiffString(beginDate, endDate, mathFlag, abbreviateFlag){
			var i18nCore = i18n.discernabu;
			var timeDiff = 0;
			var returnVal = "";
			//Set endDate to current time if it's not passed in
			endDate = (!endDate) ? new Date() : endDate;
			mathFlag = (!mathFlag) ? 0 : mathFlag;
			var one_minute = 1000*60;
			var one_hour = one_minute*60;
			var one_day = one_hour*24;
			var one_week = one_day*7;
			
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
				mathFunc = function(val){
					return Math.ceil(val);
				}
				comparisonFunc = function(lowerVal, upperVal){
					return( lowerVal <= upperVal);
				}
			}
			else{
				mathFunc = function(val){
					return Math.floor(val);
				}
				comparisonFunc = function(lowerVal, upperVal){
					return( lowerVal < upperVal);
				}
			}
			
			var calcMonths = function () {
				var removeCurYr = 0;
				var removeCurMon = 0;
				var yearDiff = 0;
				var monthDiff = 0;
				var dayDiff = endDate.getDate();
				if(endDate.getMonth() > beginDate.getMonth()) {
					monthDiff = endDate.getMonth() - beginDate.getMonth();
					if(endDate.getDate() < beginDate.getDate()) {
						removeCurMon = 1;
					}
				}
				else if (endDate.getMonth() < beginDate.getMonth()) {
					monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
					removeCurYr = 1;
					if(endDate.getDate() < beginDate.getDate()) {
						removeCurMon = 1;
					}
				}
				else if(endDate.getDate() < beginDate.getDate()) {
					removeCurYr = 1;
					monthDiff = 11;
				}
				
				
				if(endDate.getDate() >= beginDate.getDate()) {
					dayDiff = endDate.getDate() - beginDate.getDate();
				}
			
				yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
				//days are divided by 32 to ensure the number will always be less than zero
				monthDiff += (yearDiff*12) + (dayDiff/32) - removeCurMon;
				
				return monthDiff;
			};
			
			valMinutes = mathFunc(timeDiff / one_minute);
			valHours = mathFunc(timeDiff / one_hour);
			valDays = mathFunc(timeDiff / one_day);
			valWeeks = mathFunc(timeDiff / one_week);
			valMonths = calcMonths();
			valMonths = mathFunc(valMonths);
			valYears = mathFunc(valMonths/12);

		 
			if (comparisonFunc(valHours,2))		//Less than 2 hours, display number of minutes. Use abbreviation of "mins". 
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_MINS.replace("{0}", valMinutes)): (i18nCore.X_MINUTES.replace("{0}", valMinutes));
			else if (comparisonFunc(valDays,2)) 	//Less than 2 days, display number of hours. Use abbreviation of "hrs". 
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_HOURS.replace("{0}", valHours)) : (i18nCore.X_HOURS.replace("{0}", valHours));
			else if (comparisonFunc(valWeeks,2))	//Less than 2 weeks, display number of days. Use "days".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_DAYS.replace("{0}", valDays)) : (i18nCore.X_DAYS.replace("{0}", valDays)) ;
			else if (comparisonFunc(valMonths,2))	//Less than 2 months, display number of weeks. Use abbreviation of "wks".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18nCore.X_WEEKS.replace("{0}", valWeeks));
			else if (comparisonFunc(valYears,2))	//Less than 2 years, display number of months. Use abbreviation of "mos".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18nCore.X_MONTHS.replace("{0}", valMonths)) ;
			else 					//Over 2 years, display number of years.  Use abbreviation of "yrs".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_YEARS.replace("{0}", valYears)) : (i18nCore.X_YEARS.replace("{0}", valYears));

			return (returnVal);
	}
}();

/**
 * @namespace
 */
MP_Util.Doc = function() {
	var isExpandedAll = false;
	var openAccordion = '';
	
	return {
		/**
		 * Initialized the page based on a configuration of multiple MPage objects
		 * @param {Array} arMapObjects Array of the MPages to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {int} displayType How multiple MPages will be displayed.  Default is tab layout.
		 * @param {String} criterionGroup If InitSelectorLayout is called this is a parent group for multiple MPage Views.
		 */
		InitMPageTabLayout : function(arMapObjects, title, displayType, criterionGroup) {
			var arItems = [];
			var sc = "", helpFile = "", helpURL = "", debugInd = false;
			var bDisplayBanner = false;
			var criterion = null;
			var custInd = true;
			var anchorArray = null;
			
			for (var x=0,xl=arMapObjects.length;x<xl;x++){
				var key = arMapObjects[x].name;
				var page = arMapObjects[x].value;
				criterion = page.getCriterion();
				arItems.push(new MP_Core.TabItem(key, page.getName(), page.getComponents(), criterion.category_mean))
				sc = criterion.static_content;
				debugInd = criterion.debug_ind;
				helpFile = page.getHelpFileName();
				helpURL = page.getHelpFileURL();
				custInd = page.getCustomizeEnabled();
				anchorArray = page.getTitleAnchors();
				if (page.isBannerEnabled())
					bDisplayBanner = page.isBannerEnabled();
			}
			if (displayType === 1) { //Select Box
				MP_Util.Doc.InitSelectorLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterionGroup, custInd, anchorArray);
			}
			else {
				MP_Util.Doc.InitTabLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterion, custInd, anchorArray);
			}
			
		},		
		/**
		 * Initialized the page based on a configuration of multiple TabItem objects
		 * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {String} sc The static content file location.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
		 */
		InitTabLayout : function(arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray){
			var body = document.body;
			var i18nCore = i18n.discernabu;
			//create page title
			MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray, helpFile, helpURL, criterion);
			
			//check if banner should be created
			if (includeBanner){
				body.innerHTML += "<div id='banner' class='demo-banner'></div>";
			}
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";

			//create unordered list for page level tabs
			//  a) need the id of the tabs to identify, b) the name of the tab, c) the components to add
			AddPageTabs(arTabItems, body);

			//create component placeholders for each tab
			CERN_TabManagers = [];
			for (var x = 0, xl = arTabItems.length; x<xl;x++){
				var tabItem = arTabItems[x];
				var tabManager = new MP_Core.TabManager(tabItem);
				if (x == 0){
					//the first tab will be selected upon initial loading of page.
					tabManager.setSelectedTab(true);
				}
				CERN_TabManagers.push(tabManager);
				CreateLiquidLayout(tabItem.components, _g(arTabItems[x].key), true);
				SetupCompFilters(tabItem.components);
				MP_Util.Doc.CreateCompMenus(tabItem.components, true);
			}
			MP_Util.Doc.AddCustomizeLink(criterion);
			SetupExpandCollapse();
		},
		/**
		 * Initialized the page based on a configuration of multiple MPage objects viewable through a select box
		 * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {String} sc The static content file location.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
		 */
		InitSelectorLayout : function(arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray){
			var body = document.body;
			var i18nCore = i18n.discernabu;

			//first, check to see if they have a last saved view saved to User Prefs
			var jsonObject = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
			var userPrefs,pagePrefs,views,lastSavedView;
			if(jsonObject) {
				userPrefs = jsonObject.user_prefs;
				pagePrefs = userPrefs.page_prefs;
			    views = pagePrefs.views;

		        var view = jsonObject.user_prefs.page_prefs.last_saved_view;
				
				if(view) {
					lastSavedView = view;
				}
				else {
					//if for some reason the view hasn't been defined for this page, set the last saved view to a blank string
					lastSavedView = "";
				}
				if (!views){//if "views" does not exist, then the user still has the old user prefs, which gurantees a last saved view
					pagePrefs = userPrefs.page_prefs = {};
					views = pagePrefs.views = [];
					//since we know there is a last saved view, add it back to the JSON
					jsonObject.user_prefs.page_prefs.last_saved_view = lastSavedView;
					//add a new view object for the last saved view for use with Drag and Drop
					var newView = {};
					newView.label = lastSavedView;
					newView.components = [];
					views.push(newView);
					////overwrite old user prefs
					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObject);
				}
			}
			else {
				lastSavedView = "";
			}
			
			//create page title
			MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray, helpFile, helpURL, criterion,null);
			
			//check if banner should be created
			if (includeBanner){
				body.innerHTML += "<div id='banner' class='demo-banner'></div>";
			}
			//add disclaimer
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";

			//create QOC selector
			LoadPageSelector(arTabItems, body, lastSavedView, criterion);

			var lastSavedTabKey = null;
			//create component placeholders for each tab
			CERN_TabManagers = [];
			for (var x = 0, xl = arTabItems.length; x<xl;x++){
				var tabItem = arTabItems[x];
				var tabManager = new MP_Core.TabManager(tabItem);
				if (x == 0){
					//the first tab will be selected upon initial loading of page.
					tabManager.setSelectedTab(true);
				}
				if (lastSavedView === tabItem.name){
					lastSavedTabKey = tabItem.key;
				}	
				CERN_TabManagers.push(tabManager);
				if(views){
					var alreadyAddedView = false;
					var viewsLength = views.length;
					for (var j = viewsLength; j--;) {
						var currentViewName = views[j].label;
						if (currentViewName === tabItem.name){
							alreadyAddedView = true;
							if (views[j].components.length > 0){
								var updatedQOCComponents = UpdateQOCComponentsWithUserPrefs(tabItem.components, views[j].components, criterion);
								CreateLiquidLayout(updatedQOCComponents, _g(tabItem.key), false);
							}
							else{
								CreateLiquidLayout(tabItem.components, _g(tabItem.key), false);
							}
							break;
						}
					}
					if (!alreadyAddedView){
						CreateLiquidLayout(tabItem.components, _g(tabItem.key), false);
					}
				}
				else{
					CreateLiquidLayout(tabItem.components, _g(tabItem.key), false);
				}
				
				MP_Util.Doc.CreateQOCCompMenus(tabItem.components, false, tabItem.key);
			}
			SetupExpandCollapse();
			if (lastSavedTabKey){
				MP_Util.Doc.InitQOCDragAndDrop(lastSavedTabKey);
				MP_Util.Doc.CreateQOCPageMenu(lastSavedTabKey, criterion.category_mean, criterion);
			}
		},		
		/**
		 * Initialize the mpage workflow view layout
		 * @param {object} navSubSecMPage object which holds the configuration for the components on the page.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {String} categoryMeaning The String name of the help file URL to associate to the page.
		 */
		InitWorkflowLayout:function(navSubSecMPage,helpFile,helpURL,categoryMeaning){
			var i18nCore=i18n.discernabu;
			var criterion=navSubSecMPage.getCriterion();
			if(categoryMeaning){
				var body=_g(categoryMeaning);
			}
			else{
				var body=document.body;
			}
			
			var mpComps = navSubSecMPage.getComponents();
            
			var sHTML = [];
			sHTML.push("<div>");
			sHTML.push("<div class='col-group one-col'>");
	    	sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
			var colClassName = "col1";
	    	sHTML.push("<div class='",colClassName,"'>");

	    	for(var x = 0; x < mpComps.length; x++){
	    		sHTML.push(CreateCompDiv(mpComps[x]));
	    	}
	    	sHTML.push("</div>");
	    	sHTML.push("</div></div></div></div>");
	    	body.innerHTML += sHTML.join("");
			
            SetupExpandCollapse();
            SetupCompFilters(mpComps);
			MP_Util.Doc.CreateCompMenus(mpComps, false);
			//MP_Util.Doc.InitDragAndDrop(categoryMeaning); //Disable component drag and drop in workflow
			MP_Util.Doc.CreatePageMenu(categoryMeaning, criterion.category_mean);
		},
		/**
		 * Initialize the mpage layout
		 * @param {mPage}  mPage object which holds the configuration for the components on the page.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 */
		InitLayout:function(mPage,helpFile,helpURL,categoryMeaning){
			var i18nCore=i18n.discernabu;
			var criterion=mPage.getCriterion();
			var body=document.body;
			var mpComps = mPage.getComponents();
            CreateLiquidLayout(mpComps, body);
		},
		EqualizeColumns: function () {
			$('h2').bind('click mousedown', function(){
					var tallest = 0;
					$(".col-outer1:last").each(function() {
						if ($(this).height() > tallest) {
							tallest = $(this).height();}   
				$(".col-outer1:last .ui-sortable").height(tallest);		
			});
		});},
		InitDragAndDrop: function (categoryMeaning) {
		    var self = this;
		    var vpParent = "";
		    if (categoryMeaning && typeof m_viewpointJSON == "string") {
		        vpParent = "#" + categoryMeaning + " ";
							
		    }
		    $(vpParent + ".col-outer1:last .col1," + vpParent + ".col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable({
		        connectWith: vpParent + ".col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3 ",
		        items: " .section",
		        zIndex: 1005,
		        appendTo: "body",
		        handle: "h2",
		        over: function (event, ui) {
		            if ($(this).attr("class") !== ui.sender.attr("class")) {
		                $(this).css("z-index", "1");
		            }
		        },
		        start: function (event, ui) {
			    $(this).css("z-index", "2");
		        ui.item.css("z-index", "2");
		        },
				
		        stop: function (event, ui) {
		            ui.item.css("z-index", "1");
		            $(this).css("z-index", "1");
		            if (ui.sender) {
		                ui.sender.css("z-index", "1");
		            }	
		            CERN_EventListener.fireEvent(null, self, EventListener.EVENT_COMP_CUSTOMIZE, null);
		        },
		        update: function () {
		            setTimeout(function () {
		                MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, true);
		            }, 0);
		        }
		    });
		    $(vpParent + ".col-outer1:last .sec-hd").css("cursor", "move");
		},
		InitQOCDragAndDrop:function(categoryMeaning){
			var vpParent = "#" + categoryMeaning + " ";

			$(vpParent + ".col-outer1:last .col1," + vpParent + ".col-outer1:last .col2," + vpParent + ".col-outer1:last .col3," + vpParent + ".col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").sortable({
				connectWith : vpParent + ".col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5 ",
				items : " .section",
				zIndex : 1005,
				appendTo : "body",
				handle : "h2",
				over : function(event, ui) {
					if($(this).attr("class") !== ui.sender.attr("class")) {
						$(this).css("z-index", "auto");
					}
				},
				start : function(event, ui) {
					$(this).css("z-index", "2");
					ui.item.css("z-index", "2");
				},
				stop : function(event, ui) {
					ui.item.css("z-index", "auto");
					$(this).css("z-index", "auto");
					if(ui.sender) {
						ui.sender.css("z-index", "auto");
					}
				},
				update : function() {
					setTimeout(function() {
						MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, categoryMeaning);
					}, 0);
				}
			});
			$(vpParent + ".col-outer1:last .sec-hd").css("cursor", "move");
			$(vpParent + ".col-outer1:last .col1," + vpParent + ".col-outer1:last .col2," + vpParent + ".col-outer1:last .col3," + vpParent + ".col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").css("padding-bottom", "100px");
		},
		CreatePageMenu: function (categoryMeaning, critCatMean) {
			var pageMenuId = "pageMenu" + critCatMean;
			var setupPageMenu = function(menuId, initialColCnt) {
				if(_g(menuId)) {
					var optMenu = _g("moreOptMenu" + menuId);
					if(!optMenu) {
						optMenu = Util.cep("div", {
							className : "opts-menu-content menu-hide",
							id : "moreOptMenu" + menuId
						});

						var i18nCore = i18n.discernabu;
						optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + menuId + '"><div class="opts-menu-item opts-sub-menu" id="optsDefLayout' + menuId + '">' + i18nCore.VIEW_LAYOUT + '</div><div class="opts-menu-item" id="optsDefClearPrefs' + menuId + '">' + i18nCore.CLEAR_PREFERENCES + '</div></div>';
						Util.ac(optMenu, document.body);
					}
					InitPageOptMenu(optMenu, menuId, false);
					var layoutOut = function(e) {
						if(!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if(relTarg) {
							if(!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if(_g("optMenuConfig" + menuId)) {
									Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
								}
							}
						}
						else {
							if(_g("optMenuConfig" + menuId)) {
								Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
							}
							return;
						}
					};
					var secId = menuId.replace("mainCompMenu", "");

					Util.addEvent(_g(pageMenuId), "click", function() {
						if(Util.Style.ccss(this, "page-menu-open")) {
							Util.Style.rcss(this, "page-menu-open")
						}
						else {
							Util.Style.acss(this, "page-menu-open")
						}

						OpenCompOptMenu(optMenu, menuId);
					});

					Util.addEvent(_g("optsDefLayout" + menuId), "mouseover", function() {
						launchSelectLayout(menuId, this, initialColCnt);
					});
					Util.addEvent(_g("optsDefLayout" + menuId), "mouseout", layoutOut);

					Util.addEvent(_g("optsDefClearPrefs" + menuId), "click", function() {
						var confirmMsg = i18nCore.CLEAR_ALL_PREFS + "<br />" + i18nCore.CLEAR_ALL_PREFS_CANCEL;
						MP_Util.AlertConfirm(confirmMsg, i18nCore.CLEAR_PREFERENCES, i18nCore.CONFIRM_CLEAR, i18nCore.CONFIRM_CANCEL, true, MP_Core.AppUserPreferenceManager.ClearPreferences);
					});
				}
			};
			var vpParent = ( typeof m_viewpointJSON == "string") ? "#" + categoryMeaning + " " : "";
			var initialColCnt;
			var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
			switch (curColGroupClass) {
				case "three-col":
					initialColCnt = 3;
					break;
				case "two-col":
					initialColCnt = 2;
					break;
				case "one-col":
					initialColCnt = 1;
					break;
			}
			setupPageMenu(pageMenuId, initialColCnt);
		},
		CreateQOCPageMenu: function (categoryMeaning, critCatMean, criterion) {
			var i18nCore = i18n.discernabu;
			var pageMenuId = "pageMenu" + critCatMean;
			var setupPageMenu = function(menuId, initialColCnt) {
				if(_g(menuId)) {
					var optMenu = _g("moreOptMenu" + menuId);
					if(!optMenu) {
						optMenu = Util.cep("div", {
							className : "opts-menu-content menu-hide",
							id : "moreOptMenu" + menuId
						});

						optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + menuId + '"><div class="opts-menu-item opts-sub-menu" id="optsDefLayout' + menuId + '">' + i18nCore.VIEW_LAYOUT + '</div><div class="opts-menu-item" id="optsAddPrsnlFavComp' + menuId + '">' + i18nCore.ADD_FAVORITE + '...</div><div class="opts-menu-item" id="optsDefClearPrefs' + menuId + '">' + i18nCore.CLEAR_PREFERENCES + '</div></div>';
						Util.ac(optMenu, document.body);
					}
					InitPageOptMenu(optMenu, menuId, false);
					var layoutOut = function(e) {
						if(!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if(relTarg) {
							if(!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if(_g("optMenuConfig" + menuId)) {
									Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
								}
							}
						}
						else {
							if(_g("optMenuConfig" + menuId)) {
								Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
							}
							return;
						}
					};
					var secId = menuId.replace("mainCompMenu", "");

					Util.addEvent(_g(pageMenuId), "click", function() {
						if(Util.Style.ccss(this, "page-menu-open")) {
							Util.Style.rcss(this, "page-menu-open")
						}
						else {
							Util.Style.acss(this, "page-menu-open")
						}

						OpenCompOptMenu(optMenu, menuId);
					});

					Util.addEvent(_g("optsDefLayout" + menuId), "mouseover", function() {
						launchQOCSelectLayout(menuId, this, initialColCnt);

					});
					Util.addEvent(_g("optsDefLayout" + menuId), "mouseout", layoutOut);
					
					Util.addEvent(_g("optsAddPrsnlFavComp" + menuId), "click", function() {
						var recordData = MP_Util.Doc.GetFavFolders("0", criterion.person_id, criterion.encntr_id, criterion.provider_id, criterion.position_cd, criterion.ppr_cd, "1");
						var confirmMsg = i18nCore.SELECT_PERSONAL_FAV_COMP + "<br />";
						MP_Util.ActionableAlertConfirm(confirmMsg, i18nCore.ADD_PERSONAL_FAV_COMP, i18nCore.CONFIRM_CANCEL, true, null);
						MP_Util.Doc.RenderFavFolder(recordData, criterion);
					});
					
					Util.addEvent(_g("optsDefClearPrefs" + menuId), "click", function() {
						var confirmMsg = i18nCore.CLEAR_ALL_PREFS + "<br />" + i18nCore.CLEAR_ALL_PREFS_CANCEL;
						MP_Util.AlertConfirm(confirmMsg, i18nCore.CLEAR_PREFERENCES, i18nCore.CONFIRM_CLEAR, i18nCore.CONFIRM_CANCEL, true, MP_Core.AppUserPreferenceManager.ClearPreferences);
					});
				}
			};
			var vpParent = "#" + categoryMeaning + " ";
			var initialColCnt;
			var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
			switch (curColGroupClass) {
				case "five-col":
					initialColCnt = 5;
					break;
				case "four-col":
					initialColCnt = 4;
					break;
				case "three-col":
					initialColCnt = 3;
					break;
				case "two-col":
					initialColCnt = 2;
					break;
				case "one-col":
					initialColCnt = 1;
					break;
			}
			setupPageMenu(pageMenuId, initialColCnt);
		},
		GetFavFolders:function(folderId, critPersonId, critEncntrId, critProviderId, critPositionCd, critPprCd, venueType){
			var record = null;
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
		    info.onreadystatechange = function(){
		        if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetNOEFavFolders");
			    var jsonEval = json_parse(this.responseText);
		            var recordData = jsonEval.RECORD_DATA;
		            if (recordData.STATUS_DATA.STATUS == "Z") {
		            	record = recordData;
		            }
		            else if (recordData.STATUS_DATA.STATUS == "S") {
		            	record = recordData;
		            }
		            else {
						MP_Util.LogScriptCallError(null, this, "mp_core.js", "GetNOEFavFolders");
		                var errAr = [];
		                var statusData = recordData.STATUS_DATA;
						errAr.push("STATUS: " + statusData.STATUS);
		                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
		                    var ss = statusData.SUBEVENTSTATUS[x];
		                    errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
		                }
						window.status = "Error getting user favorite folder structure: " + errAr.join(",");
		            }
		        }
		        if (this.readyState == 4) {
		            MP_Util.ReleaseRequestReference(this);
		        }
			};
		    
		    var sendAr = ["^MINE^", critPersonId + ".0", critEncntrId + ".0", critProviderId + ".0", folderId + ".0", "^FAVORITES^", critPositionCd + ".0", critPprCd + ".0", "11", venueType];
		    if(CERN_BrowserDevInd){
		    	var url = "mp_get_powerorder_favs_json?parameters=" + sendAr.join(",");
				info.open('GET', url, false);
				info.send(null);
		    }
		    else{
		    	info.open('GET', "mp_get_powerorder_favs_json", false);
		    	info.send(sendAr.join(","));
		    }
			return record;
		},
		RenderFavFolder:function(recordData, criterion){
			if (recordData.STATUS_DATA.STATUS != "F"){
				var noeFavArr = recordData.USER_FAV;
				var venueTypeList = recordData.VENUE_TYPE_LIST;
			}
			var noei18n = i18n.discernabu.noe_o1;
			var pageId = "pageMenuAddFavorite1234";

			var mnuDisplay = "";	//currently selected menu option display
			var mnuVenueType = 0;	//currently selected menu option venue type
			var mnuNextDisplay = "";//next menu option display
			var mnuNextVenueType = 0;//next menu option venue type
			var x;
			var xl;
			var newVenue;
			var favSec = ["<div>"];
			if (venueTypeList){
				for (x = 0, xl = venueTypeList.length; x < xl; x++){
					newVenue = venueTypeList[x];
					if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2){
						//set next menu options
						mnuNextDisplay = newVenue.DISPLAY;
						mnuNextVenueType = 2;
					}
					else{
						//set currently selected menu option
						mnuDisplay = newVenue.DISPLAY;
						mnuVenueType = 1;
					}
				}
				var arr = [];
				arr.push("<div id='pgMnuFavFolderVenueBtns'><div><input class='page-menu-add-fav-venue' venue-val='1' type='radio' checked='checked' onclick='MP_Util.Doc.SwitchFavFolderVenue(this, \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")' /><span>",mnuDisplay,"</span></div><div><input class='page-menu-add-fav-venue' venue-val='2' type='radio' onclick='MP_Util.Doc.SwitchFavFolderVenue(this, \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")' /><span>",mnuNextDisplay,"</span></div></div>");
				favSec = favSec.concat(arr);
			}

			var noeItem;
			var noeRow;
			var noeType;
			var noeItemArr;
			var venueType = mnuVenueType;
			
			if(noeFavArr){
		    	var favLength = noeFavArr.length;
		    	if (favLength === 0){
		    		favSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
		    	}
		    	else{
		    		var favCnt = 0;
		    		var favChildFavFolder = [];
		    		var favSecondaryFavFolder = [];
		        	for (i = 0; i < favLength; i++) {                 
		        		var noeFavsObj = noeFavArr[i];
		        		//account for multiple favorite folders per venue
		        		if (i === 0){
		            		favSec.push("<div id='pgMnuFavFolderPath",pageId,"' class='noe-fav-path hdr'><dl id='pgMnuFolderPath",pageId,"' class='noe-folder-info'><dt>0</dt><dd class='noe-fav-folder'><span id='pgMnuFolderPathRoot", pageId, "'>", noeFavsObj.SHORT_DESCRIPTION,"</span></dd></dl></div>",
		            			"<div id='pgMnuFavFolderContents",pageId,"' class='page-menu-add-favorite-contents'>");

		    				//Create the rest of the folders/orders/caresets/PowerPlans
		            		noeItemArr = noeFavsObj.CHILD_LIST;
		            		for (j = 0, k = noeItemArr.length; j < k; j++) {
		            			noeItem = noeItemArr[j];
		            			noeRow = [];
		    		            noeType = noeItem.LIST_TYPE;
					            if (noeType === 1){//Favorite Folder
	    							favCnt++;
	    	        				noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", noeItem.SYNONYM, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd,"\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
	    	        				favChildFavFolder = favChildFavFolder.concat(noeRow);    
					            }
		    	        	}
		        		}
		        		else{
		        			favCnt++;
		    				if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
		    					folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
		    					favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", folderName, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd,"\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
		    				}
		    				else{
		    					favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", noeFavsObj.SHORT_DESCRIPTION, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd,"\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
		    				}
		        		}
		        	}
		            if (!favCnt) {
		                favSec.push("<span class='res-none'>", (noeFavArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
		            }
		            else{
		        		//add items in sorted order
		        		favSec = favSec.concat(favChildFavFolder, favSecondaryFavFolder);
		            }
		            favSec.push("</div>"); //ends <div id='pgMnuFavFolderContents",pageId,"'>
		    	}
		    }
			else if (!noeFavArr) {
				var i18nCore = i18n.discernabu;
		        var errMsg = [];
		        errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
		        favSec = favSec.concat(errMsg);
			}
			favSec.push("</div>");
			var favSecHTML = favSec.join("");
			var actionableContDiv = _g("acActionableContent");
			if (actionableContDiv){
				actionableContDiv.innerHTML = favSecHTML;
			}
			
			var folderPathId = 'pgMnuFolderPath' + pageId;
			var folderPath = _g(folderPathId);
			if(folderPath){
				Util.addEvent(folderPath, "click", 
					function(e){
		    			var folder = e.target || e.srcElement;
		    			var folderId = Util.gps(Util.gp(folder));
		    			if (folderId.innerHTML != "-1"){
		    				var curVenueType = 1;//default to 1 just in case of an error with getting the buttons
		    				var inputButtons = Util.Style.g("page-menu-add-fav-venue", _g("pgMnuFavFolderVenueBtns"), "input");
		    				if (inputButtons){
			    				for (var x = inputButtons.length; x--;) {
			    					var curButton = inputButtons[x];
			    					if (curButton.checked){
			    						curVenueType = curButton.getAttribute('venue-val');
			    						break;
			    					}
			    				}
		    				}
		    				MP_Util.Doc.DisplaySelectedFavFolder(folderId.innerHTML, pageId, criterion.person_id, criterion.encntr_id, criterion.provider_id, criterion.position_cd, criterion.ppr_cd, curVenueType, criterion.executable, criterion.static_content, criterion.debug_ind, criterion.help_file_local_ind, criterion.category_mean, criterion.locale_id, criterion.device_location);
		    			}
					}
				);
			}
		},
		SwitchFavFolderVenue:function(button, pageId, personId, encntrId, providerId, positionCd, pprCd, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			//toggle which buttons are checked
			var inputButtons = Util.Style.g("page-menu-add-fav-venue", Util.gp(Util.gp(button)), "input");
			if (inputButtons) {
				for (var x = inputButtons.length; x--;) {
					var curButton = inputButtons[x];
					if (curButton.checked){
						curButton.checked = "";
					}
					else{
						curButton.checked = "checked";
					}
				}
			}
			
			//delete al items in the folder path and folder id path as we are starting at the beginning when switching venues
			var i;
			var l;
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		    var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
		    var curItemData = _gbt("DD", curList);
		    var locatedIdIndex = 0;
		    for (i = curItem.length; i--;){
				if (i !== 0){
					Util.de(curItem[i]);
				}
			}
			for (i = curItemData.length; i--;){
				if (i !== 0){
					Util.de(curItemData[i]);
				}
			}
			
			var venueType = button.getAttribute('venue-val');
			
			var recordData = MP_Util.Doc.GetFavFolders("0", personId, encntrId, providerId, positionCd, pprCd, venueType);
			MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation);
		},
		DisplayNextFavFolder:function(folder, folderId, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			var noei18n = i18n.discernabu.noe_o1;
			var curFolderData = _gbt("DD", Util.gp(folder));
		    var curName = curFolderData[0];
		    var curNameDisp = curName.innerHTML;
		    
		    //grab all folder names and ids in DOM of component
		    var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		    var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
		    var curItemData = _gbt("DD", curList);
		    var lastId = curItem[curItem.length-1];
		    var lastFolder = curItemData[curItemData.length-1];
		    
		    var pathLength = curItemData.length;
		    var separator = "...";
		    

			if (pathLength !== 1){
		    	separator = ">";
		    }

		    if (pathLength > 4){
		        for (var j = pathLength - 1; j--;) {
		        	if (j > 1){
		        		if (curItem[j].innerHTML == "-1"){
		        			Util.Style.acss(curItemData[j],"hidden");
		            		Util.Style.rcss(curItemData[j],"noe-fav-separator");
		        		}
		        		else{
		            		Util.Style.acss(curItemData[j],"hidden");
		            		Util.Style.rcss(curItemData[j],"noe-fav-folder");
		        		}
		        	}
		        }
		    }

		    
		    //create four new nodes for the folder id, folder name, separator id, and separator
		    var newFolderId = Util.cep("DT", {"className": "hidden", "innerHTML": folderId});
		    var newFolder = Util.cep("DD", {"className": "noe-fav-folder", "innerHTML": "<span>" + curNameDisp + "</span>"});
		    var newSeparatorId = Util.cep("DT", {"className": "hidden", "innerHTML": "-1"});
		    var newSeparator = Util.cep("DD", {"className": "noe-fav-separator", "innerHTML": "<span>" + separator + "</span>"});
		    //add four new nodes to DOM
		    Util.ia(newSeparatorId,lastFolder);
		    Util.ia(newSeparator,newSeparatorId);
		    Util.ia(newFolderId,newSeparator);
		    Util.ia(newFolder,newFolderId);          
		    
			var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
			if (prevFolderContent){
				prevFolderContent.innerHTML = "";
				prevFolderContent.style.overflowY = "auto";
				Util.Style.acss(prevFolderContent,"noe-preloader-icon");
			}

			var recordData = MP_Util.Doc.GetFavFolders(folderId, personId, encntrId, providerId, positionCd, pprCd, venueType);
			MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation);
		},
		LoadFavFolder:function(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			var noei18n = i18n.discernabu.noe_o1;
			var noeFavArr = null;
			if (recordData.STATUS_DATA.STATUS != "F"){
				noeFavArr = recordData.USER_FAV;
			}
			
			var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
			if (prevFolderContent && noeFavArr){
				Util.Style.rcss(prevFolderContent,"noe-preloader-icon");		
		 		var favSec = ["<div>"];
		 		var favCnt = 0;
				var favChildFavFolder = [];
				var favSecondaryFavFolder = [];
		 	    //grab all folder names and ids in DOM of component
		 	    var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		 	    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		 	    var curList = folderPath[0];
		 		var curItem = _gbt("DT", curList);
				for (var i = 0, l = noeFavArr.length; i < l; i++) {
					var noeFavsObj = noeFavArr[i];
					if (i === 0){
						var noeItemArr = noeFavsObj.CHILD_LIST;
			     		
			     		for (var j = 0, k = noeItemArr.length; j < k; j++) {
			     			var noeItem = noeItemArr[j];
			     			var noeRow = [];
				            var noeType = noeItem.LIST_TYPE;
				            if (noeType === 1){//Favorite Folder
				            	favCnt++;
				            	noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", noeItem.SYNONYM, "\", \"", personId, "\", \"", encntrId,"\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd,"\", \"", executable,"\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
				            	favChildFavFolder = favChildFavFolder.concat(noeRow);
				            }
			     		}
					}
		    		else{
		    			favCnt++;
						if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
							folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
							favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", folderName, "\", \"", personId, "\", \"", encntrId,"\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd,"\", \"", executable,"\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
						else{
							favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", noeFavsObj.SHORT_DESCRIPTION, "\", \"", personId, "\", \"", encntrId,"\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd,"\", \"", executable,"\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
		    		}
				}
				
				//add items in sorted order
				favSec = favSec.concat(favChildFavFolder, favSecondaryFavFolder);

				if (!favCnt){
					favSec.push("<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>");
				}
				favSec.push("</div>");
				folderHTML = favSec.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
			else if (prevFolderContent && !noeFavArr) {
				Util.Style.rcss(prevFolderContent,"noe-preloader-icon");
				var i18nCore = i18n.discernabu;
		        var errMsg = [];
		        errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
		        folderHTML = errMsg.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
		},
		DisplaySelectedFavFolder:function(folderId, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			var noei18n = i18n.discernabu.noe_o1;
			var i,l;
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		    var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
		    var curItemData = _gbt("DD", curList);

		    //find index of folder id
		    var locatedIdIndex = null;
			for (i = 0, l = curItem.length; i < l; i++){
				if (curItem[i].innerHTML == folderId){
					locatedIdIndex = i;
				}
			}

			//delete all folder names and ids that are after selected folder
			if (locatedIdIndex !== null){
				for (i = curItem.length; i--;){
					var deleteId = curItem[i];
					if (locatedIdIndex < i){
					    Util.de(deleteId);
					}
				}
				for (i = curItemData.length; i--;){
					var deleteFolder = curItemData[i];
					if (locatedIdIndex < i){
					    Util.de(deleteFolder);
					}
				}
				if (locatedIdIndex > 3){

					Util.Style.acss(curItemData[locatedIdIndex-1],"noe-fav-separator");
					Util.Style.rcss(curItemData[locatedIdIndex-1],"hidden");
		    		Util.Style.acss(curItemData[locatedIdIndex-2],"noe-fav-folder");
					Util.Style.rcss(curItemData[locatedIdIndex-2],"hidden");
				}
				
				var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
				if (prevFolderContent){
					prevFolderContent.innerHTML = "";
					prevFolderContent.style.overflowY = "auto";
					Util.Style.acss(prevFolderContent,"noe-preloader-icon");
				}

				var recordData = MP_Util.Doc.GetFavFolders(folderId, personId, encntrId, providerId, positionCd, pprCd, venueType);
				MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation);
			}
		},
		AddFavoriteComponent:function(button, folderId, folderName, personId, encntrId, providerId, positionCd, pprCd, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			$(".modal-div").remove();
			$(".modal-dialog-actionable").remove();
			$("html").css("overflow", "auto"); //reset overflow
		    var activeDiv = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0];
		    if (activeDiv){
				//create criterion object to be used in component
				var criterion = {};
				criterion.person_id = personId;
				criterion.encntr_id = encntrId;
				criterion.provider_id = providerId;
				criterion.executable = executable;
				criterion.static_content = staticContent;
				criterion.position_cd = positionCd;
				criterion.ppr_cd = pprCd;
				criterion.debug_ind = debugInd;
				criterion.help_file_local_ind = helpFileLocalInd;
				criterion.category_mean = categoryMean;
				criterion.locale_id = localeId;
				criterion.device_location = deviceLocation;

				//create new order selection component
		    	var appendingComponentId = "-" + activeDiv.id;
		    	var componentId = folderId.concat(appendingComponentId);
				var component = new OrderSelectionComponent();
				component.setCriterion(criterion);
				component.setStyles(new OrderSelectionComponentStyle());
		        component.setComponentId(componentId);
		        component.setReportId(folderId);
		        component.setFavFolderId(folderId);
		        component.setCustomizeView(false);
		        component.setExpanded(1);
		        component.setColumn(1);
		        component.setSequence(0);
		        component.setPageGroupSequence(1);
		        component.setLabel(folderName);

		        var style = component.getStyles();
		        style.setComponentId(componentId);
		        
		        var newCompNode = createDynCompDiv(component);
		        //render component
		        component.InsertData();
		        //grab first column of components
		        var columnOneNode = Util.Style.g("col1", activeDiv, "DIV")[0];
		        //grab first component in column one
		        var columnOneFirstComp = Util.Style.g("section", columnOneNode, "DIV")[0];
		        //insert new order selection component in the first row on column one
		        columnOneNode.insertBefore(newCompNode, columnOneFirstComp);
		        //update CERN_MPageComponents so we can find component Id when saving preferences
		        CERN_MPageComponents.push(component);
				
		        //save user preferences immediately after adding component
		        MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, activeDiv.id);
		       
		        //add expand/collapse functionality
		        var componentToggle = Util.Style.g(style.getHeaderToggle(), newCompNode, "span")[0];
		        Util.addEvent(componentToggle, "click", MP_Util.Doc.ExpandCollapse);
		        
		        //add component menu functionality
		        var fullId = "mainCompMenu" + style.getNameSpace() + componentId;
		        var optMenu = Util.cep("div", {
		            className: "opts-menu-content menu-hide",
		            id: "moreOptMenu" + componentId
		        });
		        var i18nCore = i18n.discernabu;
		        var optMenuArr = ['<div class="opts-actions-sec" id="optsMenuActions', componentId, '"></div>',
		                          '<div class="opts-personalize-sec" id="optsMenupersonalize', componentId, '"><div class="opts-menu-item" id="optsDefTheme',
		                          componentId, '">', i18nCore.COLOR_THEME, '</div><div class="opts-menu-item" id="optsDefState', componentId,
		                          '">', i18nCore.DEFAULT_EXPANDED, '<span class="opts-menu-def-exp">&nbsp;</span></div></div>'];
				optMenu.innerHTML = optMenuArr.join("");
		        Util.ac(optMenu, document.body);
				InitCompOptMenu(optMenu, componentId, false);
				
				var themeOut = function (e) {
					if (!e) {
						e = window.event;
					}
					var relTarg = e.relatedTarget || e.toElement;
					if (relTarg) {
						if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
							if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
						}
					}
					else {
						if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
						return;
					}
				};
				
		        var secId = fullId.replace("mainCompMenu", "");
		        Util.addEvent(_g("mainCompMenu" + secId), "click", function () {
		            OpenCompOptMenu(optMenu, secId);
		        });        
				Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
					launchQOCThemeMenu(componentId, fullId, secId, this, activeDiv.id);
				});
				Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
				
				Util.addEvent(_g("optsDefState" + componentId), "click", function() {
					launchQOCSetState(componentId, this, activeDiv.id);
				});
		    }
		    
		    function createDynCompDiv(component){
		        var i18nCore = i18n.discernabu;
		        var i18nConfigMPage = i18n.discernabu.covc_o1;
		        var ar = [];
		        var style = component.getStyles();
		        var ns = style.getNameSpace();
		        var compId = component.getComponentId();
		        var secClass = style.getClassName();
		        var tabLink = component.getLink();
		        var loc = component.getCriterion().static_content;
		        var sAnchor = component.getLabel();
		        
		        var compNode = Util.cep("div", {
		            className: style.getClassName(),
		            id: style.getId()
		        });

		        ar.push("<h2 class='", style.getHeaderClass(), "' style='cursor: move;'><span class='", style.getHeaderToggle(), "' title='", i18nCore.HIDE_SECTION, 
		        		"'>-</span><span class='opts-menu menu-hide' id='mainCompMenu", ns, compId, "'>&nbsp;</span><span class='", style.getTitle(), "'><span>", 
		        		sAnchor, "</span><span class='sec-total'></span></span></h2><div id='", style.getContentId(), "' class='", style.getContentClass(), "'></div>");
		        var footerText = component.getFooterText();
		        if (footerText && footerText !== "") {
		            ar.push("<div class=sec-footer>", footerText, "</div>");
		        }
		        var arHtml = ar.join("");
		        compNode.innerHTML = arHtml;
		        return compNode;
		    }  
		},
		/**
		 * Create Component Menus
		 * @param {mpComps} mpage components for current view
		 * @param {bool} disablePrsnl boolean to disable personalize section
		 * @param 
		 */
		CreateCompMenus:function(mpComps, disablePrsnl) {
            var setupCompMenu = function (componentId, fullId, isExp) {
                    if (_g(fullId)) {
                        var optMenu = _g("moreOptMenu" + componentId);
                        if (!optMenu) {
                            optMenu = Util.cep("div", {
                                className: "opts-menu-content menu-hide",
                                id: "moreOptMenu" + componentId
                            });
                            var i18nCore = i18n.discernabu;
                            var defExpClass = "";
                            if (isExp) {
                                defExpClass = "opts-menu-def-exp";
                            }

							optMenu.innerHTML = '<div class="opts-actions-sec" id="optsMenuActions' + componentId + '"></div>';
							if(!disablePrsnl) {
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div></div>';
							}
							Util.ac(optMenu, document.body);
                        }
                        InitCompOptMenu(optMenu, componentId, false);
						
					var themeOut = function (e) {
							if (!e) {
								e = window.event;
							}
							var relTarg = e.relatedTarget || e.toElement;
							if (relTarg) {
								if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
									if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								}
							}
							else {
								if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								return;
							}
						};
                        var secId = fullId.replace("mainCompMenu", "");
                        Util.addEvent(_g("mainCompMenu" + secId), "click", function () {
                            OpenCompOptMenu(optMenu, secId);
                        });

						if(!disablePrsnl) {
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
								launchThemeMenu(componentId, fullId, secId, this);
							});
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
							Util.addEvent(_g("optsDefState" + componentId), "click", function() {
								launchSetState(componentId, this);
							});
						}
                    }
                };
			var mns = mpComps;
			var mLen = mns.length
			for(var i = 0; i < mLen; i++) {
				var curComp = mns[i];
                var ns = curComp.m_styles.m_nameSpace;
                var compId = curComp.m_styles.m_componentId;
                var fullId = "mainCompMenu" + ns + compId;
                var isExp = curComp.isExpanded();
                setupCompMenu(compId, fullId, isExp);
			}
		},
		/**
		 * Create Quick Orders and Charges Component Menus
		 * @param {mpComps} mpage components for current view
		 * @param {bool} disablePrsnl boolean to disable personalize section
		 * @param {string} selectedViewId Id of view selected in QOC
		 * @param 
		 */
		CreateQOCCompMenus:function(mpComps, disablePrsnl, selectedViewId) {
            var setupCompMenu = function (componentId, fullId, isExp) {
                    if (_g(fullId)) {
                        var optMenu = _g("moreOptMenu" + componentId);
                        if (!optMenu) {
                            optMenu = Util.cep("div", {
                                className: "opts-menu-content menu-hide",
                                id: "moreOptMenu" + componentId
                            });
                            var i18nCore = i18n.discernabu;
                            var defExpClass = "";
                            if (isExp) {
                                defExpClass = "opts-menu-def-exp";
                            }

							optMenu.innerHTML = '<div class="opts-actions-sec" id="optsMenuActions' + componentId + '"></div>';
							if(!disablePrsnl) {
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div></div>';
							}
							Util.ac(optMenu, document.body);
                        }
                        InitCompOptMenu(optMenu, componentId, false);
						
					var themeOut = function (e) {
							if (!e) {
								e = window.event;
							}
							var relTarg = e.relatedTarget || e.toElement;
							if (relTarg) {
								if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
									if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								}
							}
							else {
								if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								return;
							}
						};
                        var secId = fullId.replace("mainCompMenu", "");
                        Util.addEvent(_g("mainCompMenu" + secId), "click", function () {
                            OpenCompOptMenu(optMenu, secId);
                        });

						if(!disablePrsnl) {
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
								launchQOCThemeMenu(componentId, fullId, secId, this, selectedViewId);
							});
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
							Util.addEvent(_g("optsDefState" + componentId), "click", function() {
								launchQOCSetState(componentId, this, selectedViewId);
							});
						}
                    }
                };
			var mns = mpComps;
			var mLen = mns.length
			for(var i = 0; i < mLen; i++) {
				var curComp = mns[i];
                var ns = curComp.m_styles.m_nameSpace;
                var compId = curComp.m_styles.m_componentId;
                var fullId = "mainCompMenu" + ns + compId;
                var isExp = curComp.isExpanded();
                setupCompMenu(compId, fullId, isExp);
			}
		},
		/**
		 * Hide all Component Menus
		 */
		HideAllCompMenus:function(){
			var mnus = Util.Style.g("opts-menu-content", null, "div");
			var mnLen = mnus.length;
			for(var m = mnLen; m--; ) {
				if(!Util.Style.ccss(mnus[m], "menu-hide")) {
					Util.Style.acss(mnus[m], "menu-hide");
				}
			}
		},
		/**
		 * Hide all Page Menus
		 */
		ResetPageMenus: function() {
			var pageMenuIcons = Util.Style.g('page-menu');
			var pl = pageMenuIcons.length;
			for (var i=pl; i--;) {
				var pageMenu = pageMenuIcons[i];
				if (Util.Style.ccss(pageMenu, "page-menu-open")) {
					Util.Style.rcss(pageMenu, "page-menu-open")
				}
			}
		},		
		/**
		 * Customize the mpage layout
		 * @param {String} title The title of the page to display
		 * @param {Object} components The list components to be associated.
		 */
		CustomizeLayout : function(title, components, criterion){
			var body = document.body;
			var i18nCore = i18n.discernabu;
			MP_Util.Doc.AddPageTitle(title, body, 0, false, null, null, null, criterion);
			MP_Util.Doc.AddClearPreferences(body,criterion)
			MP_Util.Doc.AddSavePreferences(body,criterion)
			
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>"+i18nCore.USER_CUST_DISCLAIMER+"</span></div>";
			
			var compAr = [];
			for (var x=components.length;x--;){
				var component = components[x];
				if (component.getColumn() != 99)
					compAr.push(component);
			}
			
			CreateCustomizeLiquidLayout(compAr, body)
			SetupExpandCollapse();
			SetupCompFilters(compAr);
		},
		GetComments : function(par, personnelArray) {
			var com = "", recDate = "";
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			for (var j=0, m=par.COMMENTS.length; j<m; j++) {	
				if(personnelArray.length != null){
					if(par.COMMENTS[j].RECORDED_BY)
						perCodeObj=MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY, personnelArray);	
				
					if(par.COMMENTS[j].RECORDED_DT_TM != ""){
						recDate = df.formatISO8601(par.COMMENTS[j].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)			
					}
					if (j>0) {
						com += "<br />";
					}
					com += recDate + " -  " + perCodeObj.fullName + "<br />" + par.COMMENTS[j].COMMENT_TEXT;
				}
			}
			return com;
		},
		FinalizeComponent : function(contentHTML, component, countText) {
			var styles = component.getStyles();
		
			//replace count text
			var rootComponentNode = component.getRootComponentNode();
			//There are certain circumstances where a components DOM element will have been removed.  
			//ie. selecting a view from the viewpoint drop down and then selecting another.
			if(rootComponentNode){
				var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
				totalCount[0].innerHTML = countText;
			
				//replace content with HTML
				var node = component.getSectionContentNode();
				node.innerHTML = contentHTML;
			
				//init hovers
				MP_Util.Doc.InitHovers(styles.getInfo(),node, component);
				
				//init subsection toggles
				MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");
				
				//init scrolling
				MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6")
			}
		},
		/**
		 * Formats the content to the appropriate height and enables scrolling
		 * @param {node} content : The content to be formatted
		 * @param {int} num : The approximate number of items to display face up
		 * @param {float} ht : The total line height of an item
		 */
		InitScrolling : function(content, num, ht){
			for (var k=0; k<content.length; k++) {
				MP_Util.Doc.InitSectionScrolling(content[k], num, ht);
			}
		},
		/**
		 * Formats the section to the appropriate height and enables scrolling
		 * @param {node} sec : The section to be formatted
		 * @param {int} num : The approximate number of items to display face up
		 * @param {float} ht : The total line height of an item
		 */
		InitSectionScrolling : function(sec, num, ht) {
			var th = num * ht
			var totalHeight = th+"em";
			
			sec.style.maxHeight = totalHeight;
			sec.style.overflowY = 'auto';
			sec.style.overflowX = 'hidden';
		},
		InitHovers : function(trg, par, component) {
		    gen = Util.Style.g(trg, par, "DL")
		
		    for (var i = 0, l = gen.length; i < l; i++) {
		        var m = gen[i];
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
		InitSubToggles : function(par, tog) {
                    var i18nCore = i18n.discernabu;
		    var toggleArray = Util.Style.g(tog, par, "span");
		    for (var k=0; k<toggleArray.length; k++) {
		        Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
		        var checkClosed = Util.gp(Util.gp(toggleArray[k]));
		        if (Util.Style.ccss(checkClosed, "closed")) {
		            toggleArray[k].innerHTML = "+";
		            toggleArray[k].title = i18nCore.SHOW_SECTION;
		        }
		    }
		},
		ExpandCollapseAll: function(ID){
			var i18nCore = i18n.discernabu;
			var tabSection = _g(ID.replace("expAll",""));
			var expNode=_g(ID);
			var allSections=Util.Style.g("section",tabSection);
			if (isExpandedAll) {
				for (var i = 0,asLen=allSections.length; i < asLen; i++) {
					var secHandle = Util.gc(Util.gc(allSections[i]));
					if(secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
						Util.Style.acss(allSections[i], "closed");
						secHandle.innerHTML = "+";
						secHandle.title = i18nCore.SHOW_SECTION;
					}
					else {
						var allSubSections = Util.Style.g("sub-sec",allSections[i],"div");
						for(var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
							var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
							Util.Style.acss(allSubSections[j], "closed");
							subSecTgl.innerHTML = "+";
							subSecTgl.title = i18nCore.SHOW_SECTION;
						}
					}
				}
				expNode.innerHTML = i18nCore.EXPAND_ALL;
				isExpandedAll = false;
			}
			else {
				for (var i = 0,asLen=allSections.length; i < asLen; i++) {
					var secHandle = Util.gc(Util.gc(allSections[i]));
					if(secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
						Util.Style.rcss(allSections[i], "closed");
						secHandle.innerHTML = "-";
						secHandle.title = i18nCore.HIDE_SECTION;
					}
					else {
						var allSubSections = Util.Style.g("sub-sec",allSections[i],"div");
						for(var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
							var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
							Util.Style.rcss(allSubSections[j], "closed");
							subSecTgl.innerHTML = "-";
							subSecTgl.title = i18nCore.HIDE_SECTION;
						}
					}
				}
				expNode.innerHTML = i18nCore.COLLAPSE_ALL;
				isExpandedAll = true;
			}
		},
		/**
		 * Adds chart search to the page.
		 * @param {Object} criterion The criterion object
		 * @param {Boolean} inViewPoint Indicator denoting if chart search is to be added in Viewpoint Framework.
		 */
		AddChartSearch: function (criterion, inViewPoint) {
			var csCallback = function (url) {
				try {
					if (url) {
						var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
						fwObj.SetPopupStringProp("REPORT_NAME", "<url>" + url);
						fwObj.SetPopupDoubleProp("WIDTH", 1200);
						fwObj.SetPopupDoubleProp("HEIGHT", 700);
						fwObj.SetPopupBoolProp("SHOW_BUTTONS", 0);
						fwObj.LaunchPopup();
					}
					else {
						MP_Util.LogError("Error retriving URL from search");
					}
				}
				catch (err) {
					alert(i18n.discernabu.CODE_LEVEL);
					MP_Util.LogError("Error creating PVFRAMEWORKLINK window <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description); 
				}
			}
			//Check to see if the viewpoint already has a chart search available
			var csEle = _g("chrtSearchBox");
			if(!csEle){
				//Add to viewpoint framework or single page
				var csDiv = Util.cep("div", {
					id : "chrtSearchBox"
				});
				csDiv.innerHTML = "<div id='chart-search-input-box'></div>";
				
				if (inViewPoint) {
					var vpTl = _g("vwpTabList");
					Util.ac(csDiv, vpTl);
				}
				else {
					var pgCtrl = _g("pageCtrl"+criterion.category_mean);
					pgCtrl.parentNode.insertBefore(csDiv, pgCtrl);
				}
				
				var csParams = {
					patientId: criterion.person_id,
					userId: criterion.provider_id,
					callback: csCallback
				};
				try {
					ChartSearchInput.embed('chart-search-input-box', csParams);
				}
				catch (err) {
					MP_Util.LogError("Error calling Chart Search embed <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description); 
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
		AddPageTitle:function(title,bodyTag,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,categoryMeaning){
			var i18nCore=i18n.discernabu;
			var ar=[];
			var imgSource=criterion.static_content+"/images/3865_16.gif";
			if(categoryMeaning){
				title = "";
				bodyTag = _g(categoryMeaning);
				bodyTag.innerHTML = "";
			}
			else{
				if(bodyTag){
					bodyTag=document.body;
				}
			}
			ar.push("<div class='pg-hd'>");
			ar.push("<h1><span class='pg-title'>",title,"</span></h1><span id='pageCtrl",criterion.category_mean,"' class='page-ctrl'>");

			
            //'as of' date is always to the far left of items
			if (categoryMeaning) {
			    var df = MP_Util.GetDateFormatter();
			    ar.push("<span class='other-anchors'>",i18nCore.AS_OF_TIME.replace("{0}",df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)),"</span>");
			}
			if(anchorArray){
				for(var x=0,xl=anchorArray.length;x<xl;x++){
				    ar.push("<span class='other-anchors'>" + anchorArray[x] + "</span>");
				}
			}
			ar.push("<a id='expAll",criterion.category_mean,"' class='expAll' onclick='MP_Util.Doc.ExpandCollapseAll(\"expAll",criterion.category_mean,"\")'>",i18nCore.EXPAND_ALL,"</a>");

			if(criterion.help_file_local_ind===1&&helpFile&&helpFile.length>0){
				ar.push("<a id='helpMenu",criterion.category_mean,"' onclick='MP_Util.Doc.LaunchHelpWindow(\""+helpFile+"\")' >",i18nCore.HELP,"</a><img src='",imgSource,"'/></span>");
			}
			else{
				if(helpURL&&helpURL.length>0){
					ar.push("<a id='helpMenu",criterion.category_mean,"' onclick='MP_Util.Doc.LaunchHelpWindow(\""+helpURL+"\")' >",i18nCore.HELP,"</a><img src='",imgSource,"'/></span>");
				}
			}
			if (custInd || categoryMeaning) { //customizable single view or in a view point 
			var pageMenuId = "pageMenu" + criterion.category_mean;
                ar.push("<span id='", pageMenuId, "' class='page-menu'>&nbsp;</span>");
            }
			ar.push("</span></div>");
			bodyTag.innerHTML+=ar.join("");
			return;
		},
		/**
		 * Launches the help file in a new modal window
		 * @param {String} HelpURL The String name of the help file  to associate to the page.
		 */
		LaunchHelpWindow: function (helpURL) {
			 var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
			 MP_Util.LogCclNewSessionWindowInfo(null, helpURL, "mp_core.js", "LaunchHelpWindow");
			 CCLNEWSESSIONWINDOW (helpURL, "_self", wParams, 0, 1);
			 Util.preventDefault();
		},
		AddClearPreferences : function(body,criterion){
			var i18nCore = i18n.discernabu;
			var pageCtrl = _g("pageCtrl"+criterion.category_mean);
			var clearPrefNode = Util.cep("A", {"id": "clearPrefs", "onclick":"javascript:MP_Core.AppUserPreferenceManager.ClearPreferences();"});
			clearPrefNode.innerHTML = i18nCore.CLEAR_PREFERENCES;
			Util.ac(clearPrefNode, pageCtrl)
		},
		AddSavePreferences : function(body,criterion){
			var i18nCore = i18n.discernabu;
			var pageCtrl = _g("pageCtrl"+criterion.category_mean);
			var savePrefNode = Util.cep("A", {"id": "savePrefs", "onclick":"javascript:MP_Core.AppUserPreferenceManager.SavePreferences();"});
			savePrefNode.innerHTML = i18nCore.SAVE_PREFERENCES;
			Util.ac(savePrefNode, pageCtrl)			
		},
		AddCustomizeLink:function(criterion){
			var i18nCore=i18n.discernabu;
			var custNode=_g("custView"+criterion.category_mean);
			if(custNode){
				custNode.innerHTML=i18nCore.CUSTOMIZE;
				var compReportIds=GetPageReportIds();
				if(typeof m_viewpointJSON == "undefined"){
					var cclParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+criterion.executable+"^","^^","^"+criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+criterion.category_mean+"^",criterion.debug_ind,"value("+compReportIds.join(".0,")+")","1"];
					custNode.onclick=function(){
						CCLLINK("MP_DRIVER",cclParams.join(","),1);
						Util.preventDefault();
					};
				}
				else{
				    	var js_viewpoint = json_parse(m_viewpointJSON).VIEWPOINTINFO_REC;
					var cclParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+criterion.executable+"^","^"+criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+js_viewpoint.VIEWPOINT_NAME_KEY+"^",criterion.debug_ind,"value("+compReportIds.join(".0,")+")","1", "^" + criterion.category_mean+ "^"];
					custNode.onclick=function(){
						CCLLINK("MP_VIEWPOINT_DRIVER",cclParams.join(","),1);
						Util.preventDefault();
					};
				}
			}
		},
		/**
		 * Allows the consumer of the architecture to render the components that exist either on the tab layout
		 * or the single driving MPage.  For tab based pages, the first tab is loaded by default.
		 */
		RenderLayout : function(){
			// Return to tab being viewed upon refresh
			if (CERN_TabManagers != null){
				var tabManager = null;
				if (window.name.length > 0){
					var paramList = window.name.split(",");
					MP_Util.DisplaySelectedTab(paramList[0], paramList[1]);				
				}
				else{
					tabManager = CERN_TabManagers[0];
					tabManager.setSelectedTab(true);
					tabManager.loadTab();
				}
			}
			else if (CERN_MPageComponents != null){
				for (var x = 0; x < CERN_MPageComponents.length; x++){
					var comp = CERN_MPageComponents[x];
					if (comp.isDisplayable() && comp.isExpanded() && !comp.isLoaded()) {
						comp.setLoaded(true);
						if(comp.isResourceRequired()){
							comp.RetrieveRequiredResources();
						}
						else{
						    comp.InsertData();						
						}
					}
				}
				for (var x = 0; x < CERN_MPageComponents.length; x++){
					var comp = CERN_MPageComponents[x];
					if (comp.isDisplayable() && !comp.isExpanded() && !comp.isLoaded()) {
						comp.setLoaded(true);
					    if(comp.isResourceRequired()){
							comp.RetrieveRequiredResources();
						}
						else{
						    comp.InsertData();						
						}
					}
				}
			}
		},
		ExpandCollapse : function(){
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
		HideHovers : function(){
			var hovers = Util.Style.g("hover", document.body, "DIV");
			for (var i = hovers.length; i--;) {
				if (Util.gp(hovers[i]).nodeName == "BODY") {
					hovers[i].style.display = 'none';
					Util.de(hovers[i]);
				}
			}
		},
		ReplaceSubTitleText: function (component, text) {
			var compNode = component.getRootComponentNode();
			var subTitle = Util.Style.g("sub-title-disp", compNode, "div");
			if (subTitle) {
				subTitle[0].innerHTML = text;
			}
		},
		ReInitSubTitleText: function(component){
			if(component.getScope() > 0) {
				var st = Util.Style.g("sub-title-disp", component.getRootComponentNode(), "div");
				st[0].innerHTML = CreateSubTitleText(component);
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

		RunAccordion : function(index) {
			var titleAr = [];
			var nID = "Accordion" + index + "Content";
			var TimeToSlide = 100.0;
			var titleDiv = _g("Accordion"+index+"Title");
			var containerDiv = _g("AccordionContainer"+index);
			var component = MP_Util.GetCompObjById(index);
			var location = component.getCriterion().static_content;
			
			//Adjust the pull tab image
			if (Util.Style.ccss(titleDiv, "Expanded")) {
				Util.Style.rcss(titleDiv,"Expanded");
				Util.Style.rcss(containerDiv, "Expanded");
			}
			else {
				Util.Style.acss(titleDiv,"Expanded");
				Util.Style.acss(containerDiv, "Expanded");
			}
			
			if(openAccordion == nID) {
				nID = '';
			}

			setTimeout("MP_Util.Doc.Animate(" + new Date().getTime() + "," + TimeToSlide + ",'" + openAccordion + "','" + nID + "'," + index + ")", 33);
			openAccordion = nID;
		},		
		Animate : function(lastTick, timeLeft, closingId, openingId, compID) {
			var TimeToSlide = timeLeft;
			var curTick = new Date().getTime();
			var elapsedTicks = curTick - lastTick;
			var ContentHeight = 275.0;
		 
			var opening = (openingId == '') ? null : _g(openingId);
			var closing = (closingId == '') ? null : _g(closingId);
					 
			if(timeLeft <= elapsedTicks) {
				if(opening) {
					opening.style.display = 'block';
					opening.style.height = ContentHeight + 'px';
				}
		   
				if(closing) {
					closing.style.display = 'none';
					closing.style.height = '0px';
					var filterListAr = Util.Style.g("acc-filter-list-item"+compID);
					var filtersSelected = MP_Util.Doc.GetSelected(filterListAr);
					//Loop through and get all the values, which are the event sets, and then refresh the component
				}
				return;
			}
		 
			timeLeft -= elapsedTicks;
			var newClosedHeight = Math.round((timeLeft/TimeToSlide) * ContentHeight);

			if(opening) {
				if(opening.style.display != 'block') {
					opening.style.display = 'block';
					opening.style.height = (ContentHeight - newClosedHeight) + 'px';
				}
			}
			if(closing) {
				closing.style.height = newClosedHeight + 'px';
			}

			setTimeout("MP_Util.Doc.Animate(" + curTick + "," + timeLeft + ",'" + closingId + "','" + openingId + "'," + compID + ")", 33);
		},
		GetSelected:function(opt) {
		  var selected = [];
		  var index = 0;
		  var optLen = opt.length;
		  for (var intLoop=0; intLoop < optLen; intLoop++) {
			 if (opt[intLoop].selected) {
				index = selected.length;
				selected[index] = {};
				selected[index].value = opt[intLoop].value;
				selected[index].index = intLoop;
			 }
		  }
		  return selected;
	    },
		CreateLookBackMenu:function(component, loadInd, text) {
			var i18nCore=i18n.discernabu;
			var ar = [];
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var compId = style.getId();
			var mnuCompId = component.getComponentId();
			var loc = component.getCriterion().static_content;
			var mnuItems = [];
			var mnuId = compId+"Mnu";
			var scope = component.getScope();
			var lookBackText = "";
			var lookBackUnits = "";
			var lookBackType = 0;
			var filterMsg = "";
			var filterMsgElementTitle = "";
			var hasFilters = false;
			
			if(component.m_grouper_arr.length === 0) {
				component.setCompFilters(false);
			}
			else {
				component.setCompFilters(true);
			}
			
			if(loadInd === 2) {
				var lbMenu = _g("lb"+mnuId);
				if (component.hasCompFilters()) {
					if(!text) {
						MP_Util.LaunchCompFilterSelection(mnuCompId, i18nCore.FACILITY_DEFINED_VIEW, "", 2);
					}
					else {
						var filterMsgElement = _g("cf"+mnuCompId+"msg");
						filterMsgElementTitle = filterMsgElement.title;
						filterMsg = filterMsgElement.innerHTML;
					}
				}
				
				if (lbMenu){
					 //Clear contents of the menu
					lbMenu.innerHTML = "";
				}
			}
			
			if (!text) {
				var mnuDisplay = CreateSubTitleText(component);
			}
			else {
				var mnuDisplay = text;
			}
			
			var menuItems = component.getLookbackMenuItems();
			if (menuItems) {
				for (var x=0;x<menuItems.length;x++) {
					mnuItems[x] = new Array();
					lookBackUnits = parseInt(menuItems[x].getDescription(),10);
					var tempTypeId = menuItems[x].getId();
					switch(tempTypeId) {
						case 1:
							lookBackType = 1;
						break;
						case 2:
							lookBackType = 2;
						break;
						case 3:
							lookBackType = 3;
						break;
						case 4:
							lookBackType = 4;
						break;
						case 5:
							lookBackType = 5;
						break;
						default:
							lookBackType = tempTypeId;
						break;
					}
					if(scope>0){
						if(lookBackUnits > 0 && lookBackType > 0) {
							var replaceText ="";
							switch(lookBackType){
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
							switch(scope){
								case 1:
									lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
								break;
								case 2:
									lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
								break;
							}
						}
						else {
							switch(scope) {
								case 1:
									lookBackText = i18nCore.All_VISITS;
									break;
								case 2:
									lookBackText = i18nCore.SELECTED_VISIT;
									break;
							}
						}
					}
					mnuItems[x][0] = lookBackText;
					mnuItems[x][1] = lookBackUnits;
					mnuItems[x][2] = lookBackType;
				}
			
				ar.push("<div id='lb",mnuId,"'><div id='stt", compId,"' class='sub-title-disp lb-drop-down'>");
				ar.push("<span id='lbMnuDisplay",mnuCompId,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',compId,"\");'>",mnuDisplay,"<a id='",ns,"Drop'><img src='",loc,"/images/3943_16.gif'></a></span><span id='cf",mnuCompId,"msg' class='filter-applied-msg' title='",filterMsgElementTitle,"'>",filterMsg,"</span></div>");
				ar.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='mnu-labelbox'>",mnuDisplay,"</div><div class='mnu-contentbox'>");
				for (var x=0,xl=mnuItems.length;x<xl;x++){
					var item = mnuItems[x];
					ar.push("<div><span class='lb-mnu' id='lb",compId,x,"' onclick='MP_Util.LaunchLookBackSelection(\"",mnuCompId,'\",',item[1],',\"',item[2],"\");'>", item[0], "</span></div>");
				}
				ar.push("</div></div></div>")
			}
			else {
				ar.push("<div id='lb",mnuId,"'><div id='stt", compId,"' class='sub-title-disp lb-drop-down'>");
				ar.push("<span id='lbMnuDisplay",mnuCompId,"'>",mnuDisplay,"</span><span id='cf",mnuCompId,"msg' class='filter-applied-msg' title='",filterMsgElementTitle,"'>",filterMsg,"</span></div></div>")
			}
			for(var y = 0; y < 10; y++){
				if(component.getGrouperLabel(y) || component.getGrouperCatLabel(y)){
					hasFilters = true;
					break;
				}
			}
			if (hasFilters === true && loadInd === 1) {
				ar.push("<div id='AccordionContainer", mnuCompId, "' class='accordion-container'>");
				ar.push("<div id='Accordion", mnuCompId, "Content' class='accordion-content'><div id='Accordion", mnuCompId, "ContentDiv' class='acc-content-div'></div><div class='lb-pg-hd lb-page-ctrl'><a class='setDefault' href='#' onclick='MP_Core.AppUserPreferenceManager.SaveCompPreferences(",mnuCompId,"); return false;'>",i18nCore.SET_AS_DEFAULT,"</a><a class='resetAll' href='#' onclick='MP_Core.AppUserPreferenceManager.ClearCompPreferences(",mnuCompId,"); return false;'>",i18nCore.RESET_ALL,"</a></div></div>");
				ar.push("<div id='Accordion", mnuCompId, "Title' class='accordion-title' onclick='MP_Util.Doc.RunAccordion(", mnuCompId, ");' onselectstart='return false;'></div></div>");
			}
			
			switch(loadInd) {
				case 2:
					lbMenu.innerHTML = ar.join('');					
				break;
				
				default:
					var arHtml = ar.join("");
					return arHtml;
			}
		}
	};
	
    function launchSelectLayout(menuId, that, initialColCnt) {
        var i18nCore = i18n.discernabu;
        var optMenu = _g("optMenuConfig" + menuId);
        if (!optMenu) {
            optMenu = Util.cep("div", {
                className: "opts-menu-layout-content menu-hide",
                id: "optMenuConfig" + menuId
            });
            var optMenuJsHTML = [];
			var layoutClasses = ['view-layout1', 'view-layout2', 'view-layout3'];
			var i18nCore = i18n.discernabu;
			layoutClasses[initialColCnt - 1] += " view-layout-selected";
			 optMenuJsHTML.push("<div class='" + layoutClasses[0] + "' data-cols='1'>" + i18nCore.COLUMN_ONE + "</div><div class='" + layoutClasses[1] + "' data-cols='2'>" + i18nCore.COLUMN_TWO + "</div><div class='" + layoutClasses[2] + "' data-cols='3'>" + i18nCore.COLUMN_THREE + "</div>"); 
		   optMenu.innerHTML = optMenuJsHTML.join("");
            Util.ac(optMenu, document.body);
			
            Util.addEvent(_g("optMenuConfig" + menuId), "click", function (e) {				
                var target = e.target || e.srcElement;
				var cols = target.getAttribute("data-cols");
				$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
				Util.Style.acss(target, "view-layout-selected");
				
				var catMean;
				if (typeof m_viewpointJSON == "string") {
					MP_Util.RetrieveCookie();
					var vpCookieVal = MP_Util.GetCookieProperty("viewpoint", "viewCatMean")
					catMean = (vpCookieVal) ? vpCookieVal : $(".vwp-cached:first").attr("id");
				}
				changeLayout(parseInt(cols, 10), catMean);
            });		
            InitPageOptMenu(optMenu, menuId, true);
        }
        OpenCompOptMenu(optMenu, menuId, that);
    }
    function launchQOCSelectLayout(menuId, that, initialColCnt){
    	var i18nCore = i18n.discernabu;
        var optMenu = _g("optMenuConfig" + menuId);
        if (!optMenu) {
            optMenu = Util.cep("div", {
                className: "opts-menu-layout-content menu-hide",
                id: "optMenuConfig" + menuId
            });
            var optMenuJsHTML = [];
    		var layoutClasses = ['view-layout1', 'view-layout2', 'view-layout3', 'view-layout4', 'view-layout5'];
    		var i18nCore = i18n.discernabu;
    		layoutClasses[initialColCnt - 1] += " view-layout-selected";
    		optMenuJsHTML.push("<div class='" + layoutClasses[0] + "' data-cols='1'>" + i18nCore.COLUMN_ONE + "</div><div class='" + layoutClasses[1] + "' data-cols='2'>" + i18nCore.COLUMN_TWO + "</div><div class='" + layoutClasses[2] + "' data-cols='3'>" + i18nCore.COLUMN_THREE + "</div><div class='" + layoutClasses[3] + "' data-cols='4'>" + i18nCore.COLUMN_FOUR + "</div><div class='" + layoutClasses[4] + "' data-cols='5'>" + i18nCore.COLUMN_FIVE + "</div>");
    		optMenu.innerHTML = optMenuJsHTML.join("");
            Util.ac(optMenu, document.body);
    		
            Util.addEvent(_g("optMenuConfig" + menuId), "click", function (e) {				
                var target = e.target || e.srcElement;
    			var cols = target.getAttribute("data-cols");
    			$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
    			Util.Style.acss(target, "view-layout-selected");
    			var activeViewDiv = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0];
    			if (activeViewDiv){
    				var catMean = activeViewDiv.id;
    				changeQOCLayout(parseInt(cols, 10), catMean);
    			}
            });		
            InitPageOptMenu(optMenu, menuId, true);
        }
        OpenCompOptMenu(optMenu, menuId, that);
    }
	
	function changeLayout(newColCnt, catMean) {
		var viewpointState = (catMean) ? "#" + catMean + " " : "";
		var colClasses = ["one-col", "two-col", "three-col"]
		var curColCnt;
		var curColGroupClass = $(viewpointState + '.col-group:last').attr('class').replace("col-group ", "");

		switch (curColGroupClass) {
			case "three-col":
				curColCnt = 3;
				break;
			case "two-col":
				curColCnt = 2;
				break;
			case "one-col":
				curColCnt = 1;
				break;
		}

		if(newColCnt < curColCnt) {//removing columns
			if(newColCnt === 1) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section');
				$(viewpointState + '.col-group:last .col1').append(comps);
				$(viewpointState + '.col-group:last .col2').remove();
				$(viewpointState + '.col-group:last .col3').remove();
			}
			else if(newColCnt === 2) {
				var comps = $(viewpointState + '.col-group:last .col3 .section');
				$(viewpointState + '.col-group:last .col2').append(comps);
				$(viewpointState + '.col-group:last .col3').remove();
			}
			//save new layout
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, true);
			}, 0);

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
		}
		else if(newColCnt > curColCnt) {//adding columns
			if((newColCnt - curColCnt) === 1) {
				var colHTML = (curColCnt == 1) ? '<div class="col2"></div>' : '<div class="col3"></div>';
				$(viewpointState + '.col-outer1:last').append(colHTML);
			}
			else if((newColCnt - curColCnt) === 2) {
				$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div>');
			}

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
			MP_Util.Doc.InitDragAndDrop(catMean);
		}
	}
	function changeQOCLayout(newColCnt, catMean) {
		var viewpointState = (catMean) ? "#" + catMean + " " : "";
		var colClasses = ["one-col", "two-col", "three-col", "four-col", "five-col"]
		var curColCnt;
		var curColGroupClass = $(viewpointState + '.col-group:last').attr('class').replace("col-group ", "");

		switch (curColGroupClass) {
			case "five-col":
				curColCnt = 5;
				break;
			case "four-col":
				curColCnt = 4;
				break;
			case "three-col":
				curColCnt = 3;
				break;
			case "two-col":
				curColCnt = 2;
				break;
			case "one-col":
				curColCnt = 1;
				break;
		}

		if(newColCnt < curColCnt) {//removing columns
			if(newColCnt === 1) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section');
				$(viewpointState + '.col-group:last .col1').append(comps);
				$(viewpointState + '.col-group:last .col2').remove();
				$(viewpointState + '.col-group:last .col3').remove();
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if(newColCnt === 2) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section').not(viewpointState + '.col2 .section');
				$(viewpointState + '.col-group:last .col2').append(comps);
				$(viewpointState + '.col-group:last .col3').remove();
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if(newColCnt === 3) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section').not(viewpointState + '.col2 .section').not(viewpointState + '.col3 .section');
				$(viewpointState + '.col-group:last .col3').append(comps);
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if(newColCnt === 4) {
				var comps = $(viewpointState + '.col-group:last .col5 .section');
				$(viewpointState + '.col-group:last .col4').append(comps);
				$(viewpointState + '.col-group:last .col5').remove();
			}
			//save new layout
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, catMean);
			}, 0);

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
		}
		else if(newColCnt > curColCnt) {//adding columns
			if((newColCnt - curColCnt) === 1) {
				if (newColCnt === 2){
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div>');
				}
				else if (newColCnt === 3){
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div>');
				}
				else if (newColCnt === 4){
					$(viewpointState + '.col-outer1:last').append('<div class="col4"></div>');
				}
				else if(newColCnt === 5){
					$(viewpointState + '.col-outer1:last').append('<div class="col5"></div>');
				}
			}
			else if((newColCnt - curColCnt) === 2) {
				if (newColCnt === 3){
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div>');
				}
				else if (newColCnt === 4){
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div><div class="col4"></div>');
				}
				else if(newColCnt === 5){
					$(viewpointState + '.col-outer1:last').append('<div class="col4"></div><div class="col5"></div>');
				}
			}
			else if((newColCnt - curColCnt) === 3) {
				if (newColCnt === 4){
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div><div class="col4"></div>');
				}
				else if(newColCnt === 5){
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div><div class="col4"></div><div class="col5"></div>');
				}
			}
			else if((newColCnt - curColCnt) === 4) {
				$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div><div class="col4"></div><div class="col5"></div>');
			}

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
			MP_Util.Doc.InitQOCDragAndDrop(catMean);
		}
	}

	function launchThemeMenu(componentId, fullId, secId, that) {
	        	var i18nCore = i18n.discernabu;
	        	var optMenu = _g("optMenuConfig" + componentId);        	
	        	if (!optMenu) {   		
	        		optMenu = Util.cep("div", { "className": "opts-menu-config-content menu-hide", "id": "optMenuConfig" + componentId });
	        		var optMenuJsHTML = [];        		
	        		optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>",     		
					"<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>",									
					"<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");
	           		        		
	        		optMenu.innerHTML = optMenuJsHTML.join("");
	
		    		Util.ac(optMenu, document.body);  //actual contents of the menu are appended to body and positioned in launchOptMenu
					
	            Util.addEvent(_g("optMenuConfig" + componentId), "click", 
	    				function(e){
	                		var target = e.target || e.srcElement;
	                		var color = target.getAttribute('data-color');
	                		changeThemeColor(componentId, color, secId);
	    				}
	            );
	            
					InitCompOptMenu(optMenu, componentId, true);
	        	}			
	
			OpenCompOptMenu(optMenu, fullId, that);
	}
	function launchQOCThemeMenu(componentId, fullId, secId, that, selectedViewId) {
    	var i18nCore = i18n.discernabu;
    	var optMenu = _g("optMenuConfig" + componentId);        	
    	if (!optMenu) {   		
    		optMenu = Util.cep("div", { "className": "opts-menu-config-content menu-hide", "id": "optMenuConfig" + componentId });
    		var optMenuJsHTML = [];        		
    		optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>",     		
			"<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>",									
			"<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");
       		        		
    		optMenu.innerHTML = optMenuJsHTML.join("");

    		Util.ac(optMenu, document.body);  //actual contents of the menu are appended to body and positioned in launchOptMenu
			
        Util.addEvent(_g("optMenuConfig" + componentId), "click", 
				function(e){
            		var target = e.target || e.srcElement;
            		var color = target.getAttribute('data-color');
            		changeQOCThemeColor(componentId, color, secId, selectedViewId);
				}
        );
        
			InitCompOptMenu(optMenu, componentId, true);
    	}			

    	OpenCompOptMenu(optMenu, fullId, that);
	}
	
	function changeThemeColor(componentId,color, styleId){
		var section = _g(styleId);
		if (section){
		var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
			//a color is found in the class name so replace it with ""
			if (colorString.indexOf(color)>= 0) {
				var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
				section.className = section.className.replace(colorRegExp, "");
			}
			
			//add the new color so it changes for the user
			Util.Style.acss(section, color);
			var component = MP_Util.GetCompObjById(componentId);
			component.setCompColor(color);
			//add the color to the component properties
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, color, null, false);
			}, 0);
		}
	}
	function changeQOCThemeColor(componentId,color, styleId, selectedViewId){
		var section = _g(styleId);
		if (section){
		var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
			//a color is found in the class name so replace it with ""
			if (colorString.indexOf(color)>= 0) {
				var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
				section.className = section.className.replace(colorRegExp, "");
			}
			
			//add the new color so it changes for the user
			Util.Style.acss(section, color);
			var component = MP_Util.GetCompObjById(componentId);
			component.setCompColor(color);
			//add the color to the component properties
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
	}
	
	function launchSetState(componentId, defStateEl) {
		var component = MP_Util.GetCompObjById(componentId);
		var curExpColState = component.isExpanded();
		component.setExpandCollapseState(!curExpColState);
		var checkSpan = _gbt("span", defStateEl)[0];

		if(!curExpColState) {
			if(checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "1", false);
			}, 0);
		}
		else {
			if(checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "0", false);
			}, 0);
		}
	}
	function launchQOCSetState(componentId, defStateEl, selectedViewId) {
		var component = MP_Util.GetCompObjById(componentId);
		var curExpColState = component.isExpanded();
		component.setExpandCollapseState(!curExpColState);
		var checkSpan = _gbt("span", defStateEl)[0];

		if(!curExpColState) {
			if(checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
		else {
			if(checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
	}

	function InitPageOptMenu(inMenu, componentId, isSubMenu) {
		var closeMenu = function(e) {
			if(!e) {
				e = window.event;
			}

			var resetPageMenu = function() {
				var pageMenu = _g(componentId);
				if(Util.Style.ccss(pageMenu, "page-menu-open")) {
					Util.Style.rcss(pageMenu, "page-menu-open")
				}
			}
			var relTarg = e.relatedTarget || e.toElement;
			var mainMenu = _g("moreOptMenu" + componentId);

			if(isSubMenu) {
				var target = e.target || e.srcElement;
			}
			if(relTarg) {
				if(!Util.Style.ccss(relTarg, "opts-menu-layout-content")) {
					if(mainMenu) {
						Util.Style.acss(mainMenu, "menu-hide");
						resetPageMenu();
					}
					if(isSubMenu) {
						if(Util.Style.ccss(target, "opts-menu-layout-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
							if(_g("moreOptMenu" + componentId)) {
								Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
							}
						}
					}
					if(_g("optMenuConfig" + componentId)) {
						Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
					}
				}
			}
			else {
				if(mainMenu) {
					Util.Style.acss(mainMenu, "menu-hide");
					resetPageMenu();
				}
			}
			Util.cancelBubble(e);
		};
		$(inMenu).mouseleave(closeMenu);
	}

    function InitCompOptMenu(inMenu, componentId, isSubMenu) {
        var closeMenu = function (e) {
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
                        if (mainMenu) {
                            Util.Style.acss(mainMenu, "menu-hide");
                        }
						if (isSubMenu) {
							Util.Style.acss(inMenu, "menu-hide");
							if (Util.Style.ccss(target, "opts-menu-config-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
								if (_g("moreOptMenu" + componentId)) {
									Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
								}				
							}
						}
                         if (_g("optMenuConfig" + componentId)) {
                             Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                         }

                    }
			}
			else {
					if (mainMenu){
						Util.Style.acss(mainMenu, "menu-hide");
					}
                }
                Util.cancelBubble(e);
            };
        $(inMenu).mouseleave(closeMenu);
    }

	/** 
	 * Open the options menu within the new order entry component
	 * @param {node} menu : The menu node
	 * @param {string} sectionId : The html id of the section containing the menu
	 */
	function OpenCompOptMenu(menu, sectionId, that) {

		if(Util.Style.ccss(menu, "menu-hide")) {
			Util.preventDefault();
			Util.Style.rcss(menu, "menu-hide");

			if(that) {
				var ofs = Util.goff(that);
				var moreMenu = Util.gns(that);
				var thisWidth = that.offsetWidth;
				var divOfs = menu.offsetWidth;

				var vpOfs = ofs[0] - divOfs;
				if(vpOfs > 0) {
					menu.style.left = (vpOfs - 2) + 'px';
					//  Util.Style.acss(mpDiv, 'hml-mpd-lt');
				}
				else {
					menu.style.left = (ofs[0] + thisWidth + 6) + 'px';
					//  Util.Style.acss(mpDiv, 'hml-mpd-rt');

				}
				menu.style.top = (ofs[1] - 5) + 'px';
			}
			else {
				var menuId="#mainCompMenu"+sectionId;
			
				menu.style.left=($(menuId).offset().left - 125)+"px";
				menu.style.top=($(menuId).offset().top+18)+"px";
			}
		}
		else {
			Util.Style.acss(menu, "menu-hide");
		}
	}
	
    function GetPreferenceIdentifier(){
        var prefIdentifier = "";
        if (CERN_TabManagers != null) {
            for (var x = CERN_TabManagers.length; x--;) {
                var tabManager = CERN_TabManagers[x];
                if (tabManager.getSelectedTab()) {
                    var tabItem = tabManager.getTabItem();
                    return tabItem.prefIdentifier;
                }
            }
        }
        else if (CERN_MPageComponents != null) {
            for (var x = CERN_MPageComponents.length; x--;) {
                var criterion = CERN_MPageComponents[x].getCriterion();
                return criterion.category_mean;
            }
        }
        return prefIdentifier;
    }
    function GetPageReportIds(){
        var ar = [];
        if (CERN_TabManagers != null) {
            for (var x = CERN_TabManagers.length; x--;) {
                var tabManager = CERN_TabManagers[x];
                if (tabManager.getSelectedTab()) {
                    var tabItem = tabManager.getTabItem();
                    var components = tabItem.components;
                    if (components != null && components.length > 0) {
                        for (var y = components.length; y--;) {
                            ar.push(components[y].getReportId())
                        }
                    }
                    break;
                }
            }
        }
        else if (CERN_MPageComponents != null) {
            for (var x = CERN_MPageComponents.length; x--;) {
                ar.push(CERN_MPageComponents[x].getReportId());
            }
        }
        return ar;
    }
	
    function GetComponentArray(components){
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
                if (CERN_MPageComponents == null) 
                    CERN_MPageComponents = [];
                CERN_MPageComponents.push(component);

                if (component.isDisplayable()) { //based on filter logic, only display if criteria is met
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
    }
    function CreateCustomizeLiquidLayout(components, parentNode){
        var sHTML = [];
        var grpAr = GetComponentArray(components);
        sHTML.push("<div class=pref-columns>");
        for (var x = 0, xl = grpAr.length; x < xl; x++) {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
			//always allow for a 3 column custimization
			sHTML.push("<div class='col-group three-col'>");
            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
            
            for (var y = 0; y < colLen; y++) {
                var comps = colAr[y];
                var colClassName = "col" + (y + 1) + " cust-col";
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++) {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            for (var y = colLen + 1; y <= 3; y++) {
                var colClassName = "col" + (y) + " cust-col";
                sHTML.push("<div class='", colClassName, "'></div>")
            }
            sHTML.push("</div></div></div></div>");
        }
        sHTML.push("</div>");
        parentNode.innerHTML += sHTML.join("");
    }
    
    function CreateLiquidLayout(components, parentNode, disableMenu) {
    	var grpAr = GetComponentArray(components);
    	var sHTML = [];
    	for(var x = 0, xl = grpAr.length; x < xl; x++){
    		colAr = grpAr[x];
    		sHTML.push("<div>");
    		var colLen = colAr.length;
    		switch(colLen){
    			case 1:
    				sHTML.push("<div class='col-group one-col'>");
    				break;
    			case 2:
    				sHTML.push("<div class='col-group two-col'>");
    				break;
    			case 3:
    				sHTML.push("<div class='col-group three-col'>");
    				break;
    			case 4:
    				sHTML.push("<div class='col-group four-col'>");
    				break;
    			default:
    				sHTML.push("<div class='col-group five-col'>");
    		}
    		sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
    		for(var y = 0; y < colLen; y++){
    			var colClassName = "col" + (y+1);
    			var comps = colAr[y];
    			sHTML.push("<div class='",colClassName,"'>");
    			for(var z = 0, zl = comps.length; z < zl; z++){
    				sHTML.push(CreateCompDiv(comps[z], disableMenu));
    			}
    			sHTML.push("</div>");
    		}
    		sHTML.push("</div></div></div></div>");
    	}
    	parentNode.innerHTML += sHTML.join("");
    }
    function UpdateQOCComponentsWithUserPrefs(bedrockComponentArr, userPrefComponentArr, criterion){
    	for(var x = 0, xl = userPrefComponentArr.length; x < xl; x++){
    		var userPrefComp = userPrefComponentArr[x];
    		var isUserPrefPrsnlFavComp = true;
        	for(var y = 0, yl = bedrockComponentArr.length; y < yl; y++){
        		var bedrockComp = bedrockComponentArr[y];
        		var mnuCompId = bedrockComp.getComponentId();
    			if (mnuCompId === userPrefComp.id){
    				isUserPrefPrsnlFavComp = false;
    				bedrockComp.setColumn(userPrefComp.col_seq);
    				bedrockComp.setSequence(userPrefComp.row_seq);
    				bedrockComp.setPageGroupSequence(1);
                    if (userPrefComp.compThemeColor) {
                    	bedrockComp.setCompColor(userPrefComp.compThemeColor);
                    }
                    bedrockComp.setExpanded(userPrefComp.expanded);
    			}
    		}
        	//if user preferences component does not exist in "bedrock" list, then it is a personal fav
        	//component and a whole new component needs to be created
        	if (isUserPrefPrsnlFavComp){
        		var component = new OrderSelectionComponent();
        		component.setCriterion(criterion);
        		component.setStyles(new OrderSelectionComponentStyle());
                component.setCustomizeView(false);
                component.setComponentId(userPrefComp.id);
                component.setReportId(userPrefComp.reportId);
                component.setFavFolderId(userPrefComp.reportId);
                component.setLabel(userPrefComp.label);
                component.setExpanded(userPrefComp.expanded);
                component.setColumn(userPrefComp.col_seq);
                component.setSequence(userPrefComp.row_seq);
                component.setPageGroupSequence(userPrefComp.group_seq);
                component.setDisplayEnabled(true);
                var style = component.getStyles();
                style.setComponentId(userPrefComp.id);
                if (userPrefComp.compThemeColor) {
    				component.setCompColor(userPrefComp.compThemeColor);
    				style.setColor(userPrefComp.compThemeColor);
                }
                if(userPrefComp.lookbackunits) {
                	component.setLookbackUnits(userPrefComp.lookbackunits);
                }
                if(userPrefComp.lookbacktypeflag) {
                	component.setLookbackUnitTypeFlag(userPrefComp.lookbacktypeflag);
                }
                if(userPrefComp.grouperFilterLabel) {
                	component.setGrouperFilterLabel(userPrefComp.grouperFilterLabel);
                }
                else {
                	component.setGrouperFilterLabel("");
                }
                if(userPrefComp.grouperFilterCatLabel) {
                	component.setGrouperFilterCatLabel(userPrefComp.grouperFilterCatLabel);
                }
                else {
                	component.setGrouperFilterCatLabel("");
                }
                if(userPrefComp.grouperFilterCriteria) {
                	component.setGrouperFilterCriteria(userPrefComp.grouperFilterCriteria);
                }
                else {
                	component.setGrouperFilterCriteria(null);
                }
                
                if(userPrefComp.grouperFilterCatalogCodes) {
                	component.setGrouperFilterCatalogCodes(userPrefComp.grouperFilterCatalogCodes);
                }
                else {
                	component.setGrouperFilterCatalogCodes(null);
                }
                
                if(userPrefComp.selectedTimeFrame) {
                	component.setSelectedTimeFrame(userPrefComp.selectedTimeFrame);
                }
                else {
                	component.setSelectedTimeFrame(null);
                }
                if(userPrefComp.selectedDataGroup) {
                	component.setSelectedDataGroup(userPrefComp.selectedDataGroup);
                }
                else {
                	component.setSelectedDataGroup(null);
                }

                //add component to updated "bedrock" list
                bedrockComponentArr.push(component);
        	}
    	}
        return bedrockComponentArr;
    }
	function SetupExpandCollapse() {
		var i18nCore = i18n.discernabu;
		//set up expand collapse for all components
		var toggleArray = Util.Style.g("sec-hd-tgl");
		for (var k = 0; k < toggleArray.length; k++) {
			Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
			var checkClosed = Util.gp(Util.gp(toggleArray[k]));
			if (Util.Style.ccss(checkClosed, "closed")) {
				toggleArray[k].innerHTML = "+";
				toggleArray[k].title = i18nCore.SHOW_SECTION;
			}
		}
	}
	function SetupCompFilters(compArray) {
		var compArrayLen = compArray.length;
		var hasFilters = false;
		for (var x = 0; x < compArrayLen; x++) {
			hasFilters = false;
			for(var y = 0; y < 10; y++){
				if(compArray[x].getGrouperLabel(y) || compArray[x].getGrouperCatLabel(y)){
					hasFilters = true;
					break;
				}
			}
			compArray[x].setCompFilters(hasFilters);
			if (compArray[x].hasCompFilters() && compArray[x].isDisplayable()) {
				compArray[x].renderAccordion(compArray[x]);
			}
		}
	}
function CreateCompDiv(component, disableMenu) {
		var i18nCore = i18n.discernabu;
		var ar = [];
		var style = component.getStyles();
		var ns = style.getNameSpace();
		var compId = style.getId();
		var mnuCompId = component.getComponentId();
		var secClass = style.getClassName();
		var tabLink = component.getLink();
		var loc = component.getCriterion().static_content;
		var tglCode = (!component.isAlwaysExpanded())?["<span class='",style.getHeaderToggle(),"' title='",i18nCore.HIDE_SECTION,"'>-</span>"].join(""):"";
		var menuHTML = "";
		var sDisplayName = "";
		var sSectionName = "";
		var sBandName = "";
		var sItemName = "";
		
		if (!component.isExpanded() && !component.isAlwaysExpanded())
			secClass += " closed";
		
		if(disableMenu) {
			if (component.getHasActionsMenu()) {
					menuHTML = ["<span class='opts-menu menu-hide' id='mainCompMenu", compId, "'>&nbsp;</span>"].join("");
			}
		}
		else {
			menuHTML = ["<span class='opts-menu menu-hide' id='mainCompMenu", compId, "'>&nbsp;</span>"].join("");
		}

		var sAnchor = (tabLink != "" && component.getCustomizeView() == false) ? CreateComponentAnchor(component) : component.getLabel();
		ar.push("<div id='", style.getId(), "' class='", secClass, "'>", "<h2 class='", style.getHeaderClass(), "'>", tglCode, menuHTML,
				 "<span class='", style.getTitle(), "'><span>", sAnchor, "</span>");


		if (component.getCustomizeView() == false){
			ar.push("<span class='",style.getTotal(),"'></span></span>");
			if (component.isPlusAddEnabled()) {
				if(component.isIViewAdd() === false) {
					ar.push("<a id='", ns, "Add' class='add-plus' onclick='MP_Util.OpenIView(\"", compId, "\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>", i18nCore.ADD, "</span></a>");
				} else {
					ar.push("<a id='", ns, "Add' class='add-plus' onclick='MP_Util.OpenTab(\"", compId, "\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>", i18nCore.ADD, "</span></a>");
				}
				var menuItems = component.getMenuItems();
				var iViewItems = component.getIViewMenuItems();
				if (menuItems != null || menuItems > 0) {
					var menuId = compId+"Menu";
					ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "/images/3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"",menuId,"\", \"",compId,"\");'></a>");
					ar.push("<div class='form-menu menu-hide' id='",menuId,"'><span>");
					for (var x=0,xl=menuItems.length;x<xl;x++){
						var item = menuItems[x];
						ar.push("<div>")
						ar.push("<a id='lnkID",x,"' href='#' onclick='javascript:MP_Util.LaunchMenuSelection(\"",compId,'\",',item.getId(),");'>", item.getDescription(), "</a>")
						ar.push("</div>")
					}				
					if (iViewItems) {
						ar.push("<hr class='opts-iview-sec-divider'></>");
						for(var x=0, xl=iViewItems.length; x<xl; x++) {
							var item=iViewItems[x];
							//Check for value_type_flag of 1 to set band name
							var itemValTypeFlag = item.getValTypeFlag();
							if(itemValTypeFlag === 1) {
								sDisplayName = item.getDescription();
								sBandName = sDisplayName.toLowerCase();
							    sDisplayName = sDisplayName.replace(/'/g,"");
								sSectionName = "";
								sItemName = "";
								//loop through again for match on value_seq
								for(var y=0, yl=iViewItems.length; y<yl; y++){
									var secItem = iViewItems[y];
									if(secItem.getValSequence() === item.getValSequence()) {
										//Check for value_type_flag of 2 to set section name
										if(secItem.getValTypeFlag() === 2) {
											sSectionName = secItem.getDescription();
											//Check for value_type_flag of 3 to set item name
										} else if (secItem.getValTypeFlag() === 3) {
											sItemName = secItem.getDescription();
										}
									}
								}
								ar.push("<div><a id='lnkID",x,"' href='#' onclick='MP_Util.LaunchIViewMenuSelection(\"",mnuCompId,'\",\"',sBandName,'\",\"',sSectionName,'\",\"',sItemName,"\");  return false;'>",sDisplayName,"</a></div>");
							}
						}
					}
					ar.push("</span></div>");
				} else if (iViewItems) {
					var menuId = compId+"Menu";
					ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "/images/3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"",menuId,"\", \"",compId,"\");'></a>");
					ar.push("<div class='form-menu menu-hide' id='",menuId,"'><span>");
					for(var x=0, xl=iViewItems.length; x<xl; x++) {
						var item=iViewItems[x];
						//Check for value_type_flag of 1 to set band name
						var itemValTypeFlag = item.getValTypeFlag();
						if(itemValTypeFlag === 1) {
							sDisplayName=item.getDescription();
							sBandName=sDisplayName.toLowerCase();
							sDisplayName=sDisplayName.replace(/'/g,"");
							sSectionName = "";
							sItemName = "";
							//loop through again for match on value_seq
							for(var y=0, yl=iViewItems.length; y<yl; y++){
								var secItem = iViewItems[y];
								if(secItem.getValSequence() === item.getValSequence()) {
									//Check for value_type_flag of 2 to set section name
									if(secItem.getValTypeFlag() === 2) {
										sSectionName = secItem.getDescription();
										//Check for value_type_flag of 3 to set item name
									} else if (secItem.getValTypeFlag() === 3) {
										sItemName = secItem.getDescription();
									}
								}
							}
							ar.push("<div><a id='lnkID",x,"' href='#' onclick='MP_Util.LaunchIViewMenuSelection(\"",mnuCompId,'\",\"',sBandName,'\",\"',sSectionName,'\",\"',sItemName,"\");  return false;'>",sDisplayName,"</a></div>");
						}
					}
					ar.push("</span></div>");
				}
			}
		}
		else {
			ar.push("</span>");
		}
		ar.push("</h2>")
		if (component.getCustomizeView() == false){
			var scope = component.getScope();
			if (scope === 3){  //specifically to display a custom subheader
				ar.push(component.getScopeHTML());
			}
			else if(scope > 0) {
				var lbMenuItems = component.getLookbackMenuItems();
				if (lbMenuItems) {
					component.setLookBackDropDown(true);
				}
				else {
					component.setLookBackDropDown(false);
				}
				
			    if (component.m_grouper_arr.length === 0) {
					component.setCompFilters(false);
				}
				else {
					component.setCompFilters(true);
				}
					
				ar.push(MP_Util.Doc.CreateLookBackMenu(component, 1, ""));
			}
		}
		ar.push("<div id='",style.getContentId(),"' class='",style.getContentClass(),"'></div>");
		var footerText = component.getFooterText();
		if (footerText && footerText !== ""){
			ar.push("<div class=sec-footer>", footerText,"</div>");
		}
		ar.push("</div>");
		var arHtml = ar.join("");
		return arHtml;
	}
	
	function CreateSubTitleText(component) {
		var i18nCore = i18n.discernabu;
		var subTitleText = "";
		var scope = component.getScope();
		var lookbackDays = component.getLookbackDays();
		var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
		var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();
		
		if(scope > 0) {
			if(lookbackFlag > 0 && lookbackUnits > 0) {
				var replaceText ="";
				switch(lookbackFlag) {
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
				
				switch(scope) {
					case 1:
						subTitleText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
						break;
					case 2:
						subTitleText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
						break;
				}
			  
			}
			else {
				switch(scope) {
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
	
	function CreateComponentAnchor(component){
		var i18nCore = i18n.discernabu;
		var style = component.getStyles();
		var criterion = component.getCriterion();
		var sParms = 'javascript:APPLINK(0,"' + criterion.executable + '","/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + component.getLink() + '^"); return false;';
		var sAnchor = "<a id="+style.getLink()+" title='"+i18nCore.GO_TO_TAB.replace("{0}", component.getLink())+"' href='#' onclick='"+sParms+"'>"+component.getLabel()+"</a>";
		return sAnchor;
	}
	function LoadPageSelector (items, bodyTag,lastSavedView, criterion) {
		var i18nCore = i18n.discernabu;
		var activeInd;
		var ar = [];
	    var divAr = [];
	    var pageKey = "-1";
		var pageCtrl = _g('pageCtrl'+criterion.category_mean);
		if(lastSavedView) {
        	var lastSavedViewFound = false;
        	var i=items.length;
        	while(i--){
        		if(items[i].name == lastSavedView){
					window.name = items[i].key+",'a-tab'"+i;
					pageKey = items[i].key;
					lastSavedViewFound = true;
					break;
				}
			}
			
			if(lastSavedViewFound) {
			    ar.push("<span class='qoc-view-selector'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,false)>");
				for(var x = 0, xl = items.length; x < xl; x++) {
					var item = items[x];
					if(item.key == pageKey){
						activeInd = 1;
					}
					else{
						activeInd = 0;
					}
					ar.push("<option value='",item.key,"'",(activeInd==1)?" selected='selected'":"",">",item.name,"</option>");
		            divAr.push("<div id='",item.key,"' class='div-tab-item",(activeInd==1)?" div-tab-item-selected":" div-tab-item-not-selected","'></div>");
				}
			    ar.push("</select></span>");
		
				pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
				bodyTag.innerHTML += divAr.join("");
			}
			else {
				ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>",i18nCore.VIEW_NOT_SELECTED,"</span>");
			    ar.push("<span class='qoc-view-selector'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
				for(var x = 0, xl = items.length; x < xl; x++) {
					var item = items[x];
					ar.push("<option value='",item.key,"'>",item.name,"</option>");
		            divAr.push("<div id='",item.key,"' class='div-tab-item div-tab-item-not-selected'></div>");
				}
			    ar.push("<option value='Blank_Space' selected='selected'></option>");
	            divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
			    ar.push("</select></span>");
		
				pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
				bodyTag.innerHTML += divAr.join("");
				window.name = "QOC_PAGE_TAB_" + items.length +",'a-tab'"+items.length;
			}
        }
		else {
			ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>",i18nCore.VIEW_NOT_SELECTED,"</span>");
		    ar.push("<span class='qoc-view-selector'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
			for(var x = 0, xl = items.length; x < xl; x++) {
				var item = items[x];
				ar.push("<option value='",item.key,"'>",item.name,"</option>");
	            divAr.push("<div id='",item.key,"' class='div-tab-item div-tab-item-not-selected'></div>");
			}
		    ar.push("<option value='Blank_Space' selected='selected'></option>");
            divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
		    ar.push("</select></span>");
	
			pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
			bodyTag.innerHTML += divAr.join("");
			window.name = "QOC_PAGE_TAB_" + items.length +",'a-tab'"+items.length;
        }
	}	
	function AddPageTabs(items, bodyTag){
		var ar = [];
		var divAr = [];
		if (bodyTag == null)
			bodyTag = document.body;
		//first create unordered list for page level tabs
		ar.push("<ul class=tabmenu>")
		for(var x = 0, xl = items.length; x < xl; x++) {
			var item = items[x];
			var activeInd = (x == 0) ? 1 : 0;
			ar.push(CreateTabLi(item, activeInd, x))
			divAr.push("<div id='",item.key,"' class='div-tab-item'></div>");
		}
		ar.push("</ul>")
		bodyTag.innerHTML += (ar.join("") + divAr.join(""));
	}
	function CreateTabLi(item, activeInd, sequence){
		var ar=[];
		var tabName ="";
		tabName =item.name;
		ar.push("<li>")
		var seqClass = "a-tab" + sequence;
		if(activeInd)
			ar.push("<a id='", seqClass, "' class='anchor-tab-item active' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"",item.key, "\",\"", seqClass,"\");return false;'>", tabName, "</a>");
		else
			ar.push("<a id='", seqClass, "' class='anchor-tab-item inactive' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"",item.key, "\",\"", seqClass,"\");return false;'>", tabName, "</a>");
		ar.push("</li>")
		return (ar.join(""));
	}
}();

/**
 * @namespace
 */
MP_Util.Measurement = function(){
    var m_nf = null;
    return {
        GetString: function(result, codeArray, dateMask, excludeUOM) {
    		var obj = (result instanceof MP_Core.Measurement) ? result.getResult() : MP_Util.Measurement.GetObject(result, codeArray);
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
        GetObject: function(result, codeArray){
            switch (result.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    return GetQuantityValue(result, codeArray);
                case "STRING_VALUE":
                    return (GetStringValue(result));
				case "DATE_VALUE":
					//we are currently not returning any date_value results. a common method shall be implemented if/when necessary
                    return (GetDateValue(result));
				case "CODIFIED_VALUES":
                case "CODE_VALUE":
                    return (GetCodedResult(result));
                case "ENCAPSULATED_VALUE":
                    return (GetEncapsulatedValue(result));
            }
        },
        /**
         * @param {Object} num Numeric to format
         * @param {Object} dec Number of decimal places to retain.
         * @deprecated Use mp_formatter.NumericFormatter.
         */
        SetPrecision: function(num, dec){
            var nf = MP_Util.GetNumericFormatter();
            //'^' to not comma seperate values, and '.' for defining the precision
            return nf.format(num, "^." + dec);
        },
        GetModifiedIcon: function(result){
            return (result.isModified()) ? "<span class='res-modified'>&nbsp;</span>" : "";
        },
        GetNormalcyClass: function(oMeasurement){
            var normalcy = "res-normal";
            var nc = oMeasurement.getNormalcy()
            if (nc != null) {
                var normalcyMeaning = nc.meaning;
                if (normalcyMeaning != null) {
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
        	var ar = ["<span class='", MP_Util.Measurement.GetNormalcyClass(oMeasurement), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
        	          GetEventViewerLink(oMeasurement, MP_Util.Measurement.GetString(oMeasurement, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(oMeasurement), "</span>"];
        	return ar.join("");
        }
    };
    function GetEventViewerLink(oMeasurement, sResultDisplay){
		var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\"" ];
		var ar = ["<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", sResultDisplay, "</a>"];
		return ar.join("");
    }
    function GetEncapsulatedValue(result){
        var ar = [];
        var encap = result.ENCAPSULATED_VALUE;
        if (encap && encap.length > 0){
            for (var n = 0, nl = encap.length; n < nl; n++) {
                var txt = encap[n].TEXT_PLAIN;
                if (txt != null && txt.length > 0) 
                    ar.push(txt);
            }
        }
        return ar.join("");
    }
    function GetQuantityValue(result, codeArray){
        var qv = new MP_Core.QuantityValue();
        qv.init(result, codeArray);
        return qv;
    }
    function GetDateValue(result){
        for (var x = 0, xl = result.DATE_VALUE.length; x < xl; x++) {
            var date = result.DATE_VALUE[x];
            if (date.DATE != "") {
                var dateTime = new Date();
                dateTime.setISO8601(date.DATE);
                return dateTime;
            }
        }
        return null;
    }
    function GetCodedResult(result){
        var cdValue = result.CODE_VALUE;
        var ar = [];
        for (var n = 0, nl = cdValue.length; n < nl; n++) {
            var values = cdValue[n].VALUES;
            for (var p = 0, pl = values.length; p < pl; p++) {
                ar.push(values[p].SOURCE_STRING)
            }
            var sOther = cdValue[n].OTHER_RESPONSE;
            if (sOther != "") 
                ar.push(sOther)
        }
        return ar.join(", ");
    }
    function GetStringValue(result){
        var strValue = result.STRING_VALUE;
        var ar = [];
        for (var n = 0, nl = strValue.length; n < nl; n++) {
            ar.push(strValue[n].VALUE);
        }
        return ar.join(", ");
    }
}();
/**
 * Returns an array of elements with the designated classname.
 * @param {Object} cl The CSS classname.
 * @param {Object} e The parent element to search within, defaults to document.
 * @return {Array} Returns an array of elements with the designated classname.
 * @deprecated
 */
document.getElementsByClassName = function(cl, e) {
    var retnode = [];
    var clssnm = new RegExp('\\b'+cl+'\\b');
    var elem = this.getElementsByTagName('*', e);
    for (var u = 0; u < elem.length; u++) {
        var classes = elem[u].className;
		if(clssnm.test(classes)){
			retnode.push(elem[u]);
		}
    }
    return retnode;
};

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
 * Binds a function to the given object's scope
 *
 * @param {Object} object The object to bind the function to.
 * @return {Function}	Returns the function bound to the object's scope.
 */
Function.prototype.bind = function(object) {
	var method = this;
	return function() {
		return method.apply(object, arguments);
	};
};

/**
 * Create a new instance of Event.
 *
 * @classDescription	This class creates a new Event.
 * @return {Object}	Returns a new Event object.
 * @constructor
 */
function EventListener() {
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
	if(obj && evt) {

		var curel = this.events[obj][evt];
		if(curel) {
			var len = curel.length;
			for(var i = len - 1; i >= 0; i--) {
				if(curel[i].action == action && curel[i].binding == binding) {
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
	if(this.events[obj]) {
		if(this.events[obj][evt]) {
			if(this.getActionIdx(obj, evt, action, binding) == -1) {
				var curevt = this.events[obj][evt];
				curevt[curevt.length] = {
					action : action,
					binding : binding
				};
			}
		}
		else {
			this.events[obj][evt] = [];
			this.events[obj][evt][0] = {
				action : action,
				binding : binding
			};
		}
	}
	else {
		this.events[obj] = [];
		this.events[obj][evt] = [];
		this.events[obj][evt][0] = {
			action : action,
			binding : binding
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
	if(this.events[obj]) {
		if(this.events[obj][evt]) {
			var idx = this.getActionIdx(obj,evt,action,binding);
			if(idx >= 0) {
				this.events[obj][evt].splice(idx,1);
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
EventListener.prototype.removeAllListeners = function(obj, binding){
	if(this.events[obj]){
		for(var el = this.events[obj].length; el--;){
			if (this.events[obj][el]) {
				for (var ev = this.events[obj][el].length; ev--;) {
					if (this.events[obj][el][ev].binding == binding) {
						this.events[obj][el].splice(ev, 1);
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
 * @param e [(event)] A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
EventListener.prototype.fireEvent = function(e, obj, evt, args) {
	if(!e) {
		e = window.event;
	}

	if(obj && this.events) {
		var evtel = this.events[obj];
		if(evtel) {
			var curel = evtel[evt];
			if(curel) {
				for(var act = curel.length; act--; ) {
					var action = curel[act].action;
					if(curel[act].binding) {
						action = action.bind(curel[act].binding);
					}
					action(e,args);
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
EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE = 8;
EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT = 9;
function BedrockMPage(categoryMean){
    this.mean = categoryMean;

    //public methods
    BedrockMPage.method('getCategoryMean', function(){
        return this.mean;
    });
}

BedrockMPage.inherits(MPageView);

function BedrockMPageGroupValue(){
    m_sequence = 0;
    m_description = "";
    m_meaning = "";
    m_valSequence = 0;
    m_valTypeFlag = 0;
    m_qualifierFlag = 0;

    MPageGroupValue.method("getSequence", function(){
        return this.m_sequence;
    });
    MPageGroupValue.method("setSequence", function(value){
        this.m_sequence = value;
    });
    MPageGroupValue.method("getDescription", function(){
        return this.m_description;
    });
    MPageGroupValue.method("setDescription", function(value){
        this.m_description = value;
    });
    MPageGroupValue.method("getMeaning",function(){
    	return this.m_meaning;
	});
	MPageGroupValue.method("setMeaning",function(value){
		this.m_meaning=value;
	});
	MPageGroupValue.method("getValueSequence", function(){
        return this.m_valSequence;
    });
    MPageGroupValue.method("setValueSequence", function(value){
        this.m_valSequence = value;
    });
    MPageGroupValue.method("getValueTypeFlag", function(){
        return this.m_valTypeFlag;
    });
    MPageGroupValue.method("setValueTypeFlag", function(value){
        this.m_valTypeFlag = value;
    });
    MPageGroupValue.method("getQualifierFlag", function(){
        return this.m_qualifierFlag;
    });
    MPageGroupValue.method("setQualifierFlag", function(value){
        this.m_qualifierFlag = value;
    }); 
}

BedrockMPageGroupValue.inherits(MPageGroupValue);

/**
 * Bedrock schema methods for loading a MPage utilizing the bedrock configuration
 * @namespace MP_Bedrock
 * @static
 * @global
 */
var MP_Bedrock = function(){
    return {
        LoadingPolicy: function(){
            var m_loadPageDetails = false;
            var m_loadComponentBasic = false;
            var m_loadComponentDetail = false;
            var m_loadCustomizeView = false;
            var m_categoryMean = "";
            var m_criterion = null;

            this.setLoadPageDetails = function(value){
                m_loadPageDetails = value;
            };
            this.getLoadPageDetails = function(){
                return m_loadPageDetails;
            };
            this.setLoadComponentBasics = function(value){
                m_loadComponentBasic = value;
            };
            this.getLoadComponentBasics = function(){
                return m_loadComponentBasic;
            };
            this.setLoadComponentDetails = function(value){
                m_loadComponentDetail = value;
            };
            this.getLoadComponentDetails = function(){
                return m_loadComponentDetail;
            };
            this.setCategoryMean = function(value){
                m_categoryMean = value;
            };
            this.getCategoryMean = function(){
                return m_categoryMean;
            };
            this.setCriterion = function(value){
                m_criterion = value;
            };
            this.getCriterion = function(){
                return m_criterion;
            };
            this.setCustomizeView = function(value){
                m_loadCustomizeView = value;
            };
            this.getCustomizeView = function(){
                return m_loadCustomizeView;
            };
        },
        GetPageFromRec: function(recordData, loadingPolicy){
            var categoryMean = loadingPolicy.getCategoryMean();
            for (var x = recordData.MPAGE.length; x--;) {
                if (categoryMean.toUpperCase() === recordData.MPAGE[x].CATEGORY_MEAN.toUpperCase()) {
                    return (recordData.MPAGE[x]);
                }
            }
        }
    };
}();

MP_Bedrock.MPage = function(){
    return {
        LoadBedrockMPage: function(loadingPolicy){

            var categoryMean = loadingPolicy.getCategoryMean();
            var returnPage = new BedrockMPage(categoryMean);
            var criterion = loadingPolicy.getCriterion();
            criterion.category_mean = categoryMean;

            returnPage.setCriterion(criterion);
            returnPage.setCustomizeView(loadingPolicy.getCustomizeView());

            if (m_bedrockMpage.MPAGE.length > 0) {
            	if (log.isBlackBirdActive()) {
					MP_Util.LogDebug("Bedrock JSON: " + JSON.stringify(m_bedrockMpage));
				}
                var page = MP_Bedrock.GetPageFromRec(m_bedrockMpage, loadingPolicy);
                if (!page) {
                    //page not a part of the initial load, will need to retrieve

                    var cclParams = ["^MINE^", criterion.provider_id + ".0", criterion.position_cd + ".0", "^" + categoryMean + "^"];
                    var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
                    info.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            try {
                                m_bedrockMpage = json_parse(info.responseText).BR_MPAGE;
                                MP_Util.LogScriptCallInfo(null, this, "bedrock.js", "LoadBedrockMPage");
                            }
                            catch (error) {
                                MP_Util.LogJSError(err, null, "bedrock.js", "LoadBedrockMPage");
                            }
                            page = m_bedrockMpage.MPAGE[0];
                        }
                        if (this.readyState == 4) {
                            MP_Util.ReleaseRequestReference(this);
                        }
                    };
                    //  Call the ccl progam and send the parameter string
                    if(CERN_BrowserDevInd){
						var url = "MP_VIEW_DATA_LOAD?parameters=" + cclParams.join(",");
						info.open("GET", url, false);
						info.send(null);
					}
					else{
						info.open('GET', "MP_VIEW_DATA_LOAD", false);
                    	info.send(cclParams.join(","));
					}


                }
                var prefManager = MP_Core.AppUserPreferenceManager;
                prefManager.Initialize(criterion, categoryMean);
                if (page.USER_PREFS.PREF_STRING.length > 0) {
                    prefManager.SetPreferences(page.USER_PREFS.PREF_STRING);
                }
                returnPage.setPageId(page.BR_DATAMART_CATEGORY_ID);

                //load page level parameters
                var jsMPage = page.PARAMS;

                var y = 0;
                for (y = 0, yl = jsMPage.length; y < yl; y++) {
                    //Get the page pref settings function and execute it
					var curMPage = jsMPage[y];
					var valMPage = curMPage.VALUES;
                    var pageSetPrefFunc = GetPageFilterFuncs(categoryMean);
                    pageSetPrefFunc(returnPage, curMPage.FILTER_MEAN, curMPage);

                    if(curMPage.FILTER_MEAN === "VIEWPOINT_LABEL") {
	                    for(var z = valMPage.length; z--;) {
	                    	var curVal = valMPage[z];
	                    	if(curVal.FREETEXT_DESC) {
	                    		returnPage.setName(curVal.FREETEXT_DESC);
	                    	}
	                    }
	                }
                }

                //load basic information about components, leave detailed to the component when loaded
                var components = page.COMPONENT;
                for (y = 0, yl = components.length; y < yl; y++) {
                    var jsonComponent = components[y];
                    returnPage.addComponentId(jsonComponent.BR_DATAMART_REPORT_ID);
                }
            }

            var loadComponentIndicator = (loadingPolicy.getLoadComponentBasics()) ? 1 : 0;
            if (loadComponentIndicator > 0) {
                var components = MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, returnPage.getComponentIds());
                returnPage.setComponents(components);
            }
            return returnPage;
        }
    };
    function BRPagePrefSetFuncCreation(filterMappings){

        //Function to return so that the mapped function can be executed.
        var ExecuteBRPrefFunction = function(mPage, filterMean, brFilterValues){
            var bValue;
            var execResult;
            var filter;
            var filterField;
            var filterType;
            var i;
            var location;
            var ret;
            var setFuncName;
            var sValue;

            if (!filterMean || !brFilterValues) {
                return;
            }

            //Look through the mappings and see if one exists with the necessary information
            for (i = filterMappings.length; i--;) {
                filter = filterMappings[i];
                if (filter.m_filterMean.toUpperCase() === filterMean.toUpperCase()) {
                    setFuncName = filter.m_functionName;
                    filterType = filter.m_dataType;
                    filterField = filter.m_field;
                    break;
                }
            }
            if (!setFuncName) {
                return;
            }
            else {
                switch (filterType.toUpperCase()) {
                    case "BOOLEAN":
                        sValue = brFilterValues.VALUES[0][filterField];
                        bValue = (sValue === "0") ? false : true;
                        mPage[setFuncName](bValue);
                        break;
                    case "STRING":
                        sValue = brFilterValues.VALUES[0][filterField];
                        mPage[setFuncName](sValue);
                        break;
                }
            }
        };

        return ExecuteBRPrefFunction;
    }
    function PageFilterMapping(filterMean, functionName, dataType, field){
        this.m_filterMean = filterMean;
        this.m_functionName = functionName;
        this.m_dataType = dataType;
        this.m_field = field;
    }
    function GetPageFilterFuncs(categoryMean){
        var pageFilterMaps = [];
        if (categoryMean) {
            switch (categoryMean.toUpperCase()) {
                case 'MP_AMB_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_DABU_STD':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_DC_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_ED_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_ICU_DASHBOARD':
					pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_ICU_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_INPT_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_NC_ASSESS_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_NC_REC_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_NC_SIT_BACK_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_ORTHO_SUMMARY_V4':
					pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_PREG_SUMMARY_V4':
					pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("PREG_PRINT", "setPrintableReportName", "String", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_REHAB_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));//make sure it is included
					break;
                case 'MP_RT_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_INTRAOP_COMM_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_POSTOP_COMM_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_PREOP_COMM_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_SIBR_SUMMARY_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
                case 'MP_SURGERY_SUMMARY':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					pageFilterMaps.push(new PageFilterMapping("CHART_SEARCH", "setChartSearchEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_COMMON_ORDERS_V4':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				case 'MP_DM_SUMMARY':
                    pageFilterMaps.push(new PageFilterMapping("BANNER", "setBannerEnabled", "Boolean", "FREETEXT_DESC"));
					break;
				//due to the setup of the Quick Orders and Charges MPage, it actually uses the default statement below
				//instead of the MP_COMMON_ORDER_V4 case statement above
				default:
					pageFilterMaps.push(new PageFilterMapping("BANNER","setBannerEnabled","Boolean","FREETEXT_DESC"));
            }
            return BRPagePrefSetFuncCreation(pageFilterMaps);
        }
    }
}();

MP_Bedrock.MPage.Component = function(){
    return {

        LoadBedrockComponents: function(loadingPolicy, compIdAr){
            if (compIdAr && compIdAr !== null && compIdAr.length > 0) {
				var ComponentType = null;
                var returnAr = [];
                var reportData = MP_Bedrock.GetPageFromRec(m_bedrockMpage, loadingPolicy);
                var prefManager = MP_Core.AppUserPreferenceManager;
                var criterion = loadingPolicy.getCriterion();
                var isCustomizeView = loadingPolicy.getCustomizeView();

                for (var x = reportData.COMPONENT.length; x--;) {
                    var jsonComponent = reportData.COMPONENT[x];

                    if(!isCustomizeView){
						ComponentType = getComponentByFilterMean(jsonComponent.FILTER_MEAN);
                    }

                    if ((ComponentType) || isCustomizeView) //need to make sure components returned are part of the mapping requested.
                    {
                        var jsComponentFunc = null;
                        var component = null;
                        if (isCustomizeView) {
                            component = new MPageComponent();
                            component.setCriterion(criterion);
                            component.setStyles(new ComponentStyle());
                        }
                        else {
                            component = new ComponentType(criterion);
                        }

                        component.setCustomizeView(loadingPolicy.getCustomizeView());
                        component.setComponentId(jsonComponent.BR_DATAMART_FILTER_ID);
                        component.setReportId(jsonComponent.BR_DATAMART_REPORT_ID);
                        component.setReportMean(jsonComponent.REPORT_MEAN);

                        var userPrefComp = prefManager.GetComponentById(component.getComponentId());
                        if (userPrefComp && userPrefComp !== null) {
                            component.setExpanded(userPrefComp.expanded);
                            component.setColumn(userPrefComp.col_seq);
                            component.setSequence(userPrefComp.row_seq);
                            component.setPageGroupSequence(userPrefComp.group_seq);
                            if (userPrefComp.compThemeColor) {
								component.setCompColor(userPrefComp.compThemeColor);
                            }
                            if(userPrefComp.lookbackunits) {
                            	component.setLookbackUnits(userPrefComp.lookbackunits);
                            }
                            else {
                            	component.setLookbackUnits(jsonComponent.LOOKBACKUNITS);
                            }
                            if(userPrefComp.lookbacktypeflag) {
                            	component.setLookbackUnitTypeFlag(userPrefComp.lookbacktypeflag);
                            }
                            else {
                            	component.setLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
                            }
                            if(userPrefComp.grouperFilterLabel) {
                            	component.setGrouperFilterLabel(userPrefComp.grouperFilterLabel);
                            }
                            else {
                            	component.setGrouperFilterLabel("");
                            }
                            if(userPrefComp.grouperFilterCatLabel) {
				component.setGrouperFilterCatLabel(userPrefComp.grouperFilterCatLabel);
			    }
			    else {
				component.setGrouperFilterCatLabel("");
                            }
                            if(userPrefComp.grouperFilterCriteria) {
                            	component.setGrouperFilterCriteria(userPrefComp.grouperFilterCriteria);
                            }
                            else {
                            	component.setGrouperFilterCriteria(null);
                            }
                            if (userPrefComp.grouperFilterCatalogCodes) {
								component.setGrouperFilterCatalogCodes(userPrefComp.grouperFilterCatalogCodes);
							}
							else {
								component.setGrouperFilterCatalogCodes(null);
							}
                            if(userPrefComp.selectedTimeFrame) {
                            	component.setSelectedTimeFrame(userPrefComp.selectedTimeFrame);
                            }
                            else {
                            	component.setSelectedTimeFrame(null);
                            }
                            if(userPrefComp.selectedDataGroup) {
                            	component.setSelectedDataGroup(userPrefComp.selectedDataGroup);
                            }
                            else {
                            	component.setSelectedDataGroup(null);
                            }
                            //Set the component toggle status.  If defined as 'Required' in bedrock, override the users prefs.
                            //0 - off, 1 - on, 2 - required
                            if(userPrefComp.toggleStatus !== "undefined" && userPrefComp.toggleStatus !== null){
                            	if(jsonComponent.TOGGLE_STATUS !== 2){
                            		component.setToggleStatus(userPrefComp.toggleStatus);
                            	}
                            	else{
                            		component.setToggleStatus(jsonComponent.TOGGLE_STATUS);
                            	}
                            }
                            else{
                            	component.setToggleStatus(jsonComponent.TOGGLE_STATUS);
                            }
                        }
                        else {
                            component.setExpanded(jsonComponent.EXPANDED);
                            component.setColumn(jsonComponent.COL_SEQ);
                            component.setSequence(jsonComponent.ROW_SEQ);
                            component.setPageGroupSequence(jsonComponent.GROUP_SEQ);
                            component.setCompColor(jsonComponent.THEME);
                            component.setToggleStatus(jsonComponent.TOGGLE_STATUS);
                        }

                        component.setLabel(jsonComponent.LABEL);
                        component.setMenuOptionNames(null);
						component.setMenuOptions(null);
                        component.setLink(jsonComponent.LINK);
                        component.setResultsDisplayEnabled(jsonComponent.TOTAL_RESULTS);
                        component.setXofYEnabled(jsonComponent.X_OF_Y);
                        component.setScrollNumber(jsonComponent.SCROLL_NUM);
                        component.setScrollingEnabled(jsonComponent.SCROLL_ENABLED);
                        if (component.getLookbackDays() === 0) { //check if lookback is overridden by component
                            component.setLookbackDays(jsonComponent.LOOKBACK_DAYS);
                        }
                        component.setPlusAddEnabled((jsonComponent.ISPLUSADD == 1 ? true : false));
                        if (component.getLookbackUnits() === 0) { //check if the lookbackUnits has not been overridden
                            component.setLookbackUnits(jsonComponent.LOOKBACKUNITS);
                        }
                        if (component.getLookbackUnitTypeFlag() === 0) { //check if the lookbackUnitTypeFlag has been overridden
                            component.setLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
                        }
                        if (component.getBrLookbackUnits() === 0) {
                        	component.setBrLookbackUnits(jsonComponent.LOOKBACKUNITS);
						}
						if (component.getBrLookbackUnitTypeFlag() === 0) {
							component.setBrLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
						}
                        component.setDateFormat(jsonComponent.DATE_DISPLAY_FLAG);
                        if (component.getScope() === 0) {//check if the scope has not been overridden by the component requirements
                            component.setScope(jsonComponent.SCOPE);
                        }

                        var compSetPrefFunc = GetComponentFilterFuncs(component.getStyles().getNameSpace(), jsonComponent.REPORT_MEAN);
                        for (var y = 0, yl = jsonComponent.FILTER.length; y < yl; y++) {
                            var filter = jsonComponent.FILTER[y];

                            //make sure and skip known 'group' types
                            switch (filter.FILTER_CATEGORY_MEAN) {
                                case "EVENT":
                                    var aValue = GetFilterValues(filter);
                                    if (compSetPrefFunc) {
                                        //Will retrieve the correct function and perform the function call if available
                                        if (compSetPrefFunc(component, filter.FILTER_MEAN, aValue)) {
                                            break;
                                        }
                                    }
                                    var eGroup = new MPageEventCodeGroup();
                                    for (var z = 0, zl = aValue.length; z < zl; z++) {
                                        eGroup.addEventCode(aValue[z].getId());
                                    }
                                    eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
                                    eGroup.setGroupName(filter.FILTER_MEAN);
                                    eGroup.setSequence(filter.FILTER_SEQ);
                                    component.addGroup(eGroup);
                                    break;
                                case "EVENT_SET":
                                case "PRIM_EVENT_SET":
                                    var aValue = GetFilterValues(filter);
                                    if (compSetPrefFunc) {
                                        //Will retrieve the correct function and perform the function call if available
                                        if (compSetPrefFunc(component, filter.FILTER_MEAN, aValue)) {
                                            break;
                                        }
                                    }
                                    var eGroup = new MPageEventSetGroup();
                                    for (var z = 0, zl = aValue.length; z < zl; z++) {
                                        eGroup.addEventSet(aValue[z].getId());
                                    }
                                    eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
                                    eGroup.setGroupName(filter.FILTER_MEAN);
                                    eGroup.setSequence(filter.FILTER_SEQ);
                                    component.addGroup(eGroup);
                                    break;
                                case "CATALOG_TYPE_CDS":
									var aValue = GetFilterValues(filter);
									if (compSetPrefFunc) {
										//Will retrieve the correct function and perform the function call if available
										if (compSetPrefFunc(component, filter.FILTER_MEAN, aValue)) {
											break;
										}
									}
									var eGroup = new MPageCatalogCodeGroup();
									for (var z = 0, zl = aValue.length; z < zl; z++) {
										eGroup.addCatalogCode(aValue[z].getId());
									}
									eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
									eGroup.setGroupName(filter.FILTER_MEAN);
									eGroup.setSequence(filter.FILTER_SEQ);
									component.addGroup(eGroup);
									break;
                                case "COLOR_THEME_CDS":
								if (!userPrefComp || (!userPrefComp.compThemeColor)) {
									var aValue = GetFilterValues(filter);
									var color = aValue[0].m_meaning.replace("_", "").toLowerCase();
									component.setCompColor(color);
								}
                                break;

                                case "LOOK_BACK":
                                    var aValue = GetFilterValues(filter);
                                    for (var z = 0, zl = aValue.length; z < zl; z++) {
                                        var value = aValue[z];
                                        var item = new MP_Core.MenuItem();
                                        item.setName(value.getName());
                                        item.setDescription(value.getDescription());
                                        item.setMeaning(value.getMeaning());
                                        var tempMeaning = item.getMeaning();
                                        switch(tempMeaning) {
											case"HOURS":item.setId(1);
											break;
											case"DAYS":item.setId(2);
											break;
											case"WEEKS":item.setId(3);
											break;
											case"MONTHS":item.setId(4);
											break;
											case"YEARS":item.setId(5);
											break;
										}
                                        component.addLookbackMenuItem(item);
                                    }
                                    //Add the default value to the menu
                                    var defaultItem = new MP_Core.MenuItem();
									defaultItem.setName("CODE_VALUE");
									defaultItem.setDescription(component.getBrLookbackUnits());
									defaultItem.setId(component.getBrLookbackUnitTypeFlag());
									component.addLookbackMenuItem(defaultItem);
                                    break;
                                case "PF_MULTI_SELECT":
                                    var aValue = GetFilterValues(filter);
                                    for (var z = 0, zl = aValue.length; z < zl; z++) {
                                        var value = aValue[z];
                                        var item = new MP_Core.MenuItem();
                                        item.setName(value.getName());
                                        item.setDescription(value.getDescription());
                                        item.setId(value.getId());
                                        component.addMenuItem(item);
                                    }
                                    break;
                                case "CAT_TYPE_ASSIGN":
                                    var aValue = GetFilterValues(filter);
                                    if (compSetPrefFunc) {
                                        //Will retrieve the correct function and perform the function call if available
                                        if (compSetPrefFunc(component, filter.FILTER_MEAN, aValue)) {
                                            break;
                                        }
                                    }
                                    var eGrouper = new MPageGrouper();
                                    var eGroup = null;
                                    var curSeq = -1;
                                    for (var z = 0, zl = aValue.length; z < zl; z++) {
                                        var val = aValue[z];
                                        if (val.getSequence() != curSeq) {
                                            curSeq = val.getSequence();
                                            eGroup = new MPageCodeValueGroup();
                                            eGroup.setSequence(curSeq);
                                            eGrouper.addGroup(eGroup);
                                        }
                                        eGroup.addCode(val.getId());
                                    }
                                    component.addGroup(eGrouper);
                                    break;
                                case "CE_GROUP":
                                    //Understood that these grouped results have a title and then a list of event codes associated
                                    //to them.  The identifier for each group is that the group sequence is the same for the results.
                                    //Only one field will have a free text description, the other results will be event codes

                                    //because bedrock is nice enough to store the grouping of event codes seperate from a flat list of
                                    //the codes, overwrite the existing group with the new MPageGrouper
                                    var groups = component.getGroups();
                                    if (groups != null) {
                                        for (var z = 0, zl = groups.length; z < zl; z++) {
                                            var group = groups[z];
                                            if (group.getSequence() == filter.FILTER_SEQ) {
                                                var aValue = GetFilterValues(filter);
                                                if (compSetPrefFunc) {
                                                    //Will retrieve the correct function and perform the function call if available
                                                    if (compSetPrefFunc(component, filter.FILTER_MEAN, aValue)) {
                                                        break;
                                                    }
                                                }
                                                var eGrouper = new MPageGrouper();
                                                eGrouper.setGroupId(group.getGroupId()); //for alignment with sequencing of groups
                                                eGrouper.setGroupName(group.getGroupName());
                                                var eGroup = null;
                                                var curSeq = -1;
                                                for (var i = 0, il = aValue.length; i < il; i++) {
                                                    var val = aValue[i];
                                                    if (val.getSequence() != curSeq) {
                                                        curSeq = val.getSequence();
                                                        eGroup = new MPageEventCodeGroup();
                                                        eGroup.setSequence(curSeq);
                                                        eGrouper.addGroup(eGroup);
                                                    }
                                                    var id = val.getId();
                                                    var desc = val.getDescription();
                                                    var name = val.getName();
                                                    if (id > 0){
                                                        eGroup.addEventCode(id);
                                                    }
                                                    if (desc != ""){
                                                        eGroup.setGroupName(desc);
                                                    }
                                                }
                                                groups[z] = eGrouper;
                                            }
                                        }
                                    }
                                    break;
                                case "IVIEW_SELECT":
                                    var aValue = GetFilterValues(filter);
                                    for (var z = 0, zl = aValue.length; z < zl; z++) {
                                        var value = aValue[z];
                                        var item = new MP_Core.MenuItem();
                                        item.setName(value.getName());
                                        item.setDescription(value.getDescription());
                                        item.setId(value.getId());
                                        item.setValSequence(value.getValueSequence());
                                        item.setValTypeFlag(value.getValueTypeFlag());
                                        component.addIViewMenuItem(item);
                                    }
                                    break;
                                default:
                                    var aValue = GetFilterValues(filter);
                                    if (compSetPrefFunc) {
                                        //Will retrieve the correct function and perform the function call if available
                                        if (compSetPrefFunc(component, filter.FILTER_MEAN, aValue)) {
                                            break;
                                        }
                                    }
                            }
                        }
                        /*Now that event have been acquired loop again to get the event sequences
                        in case the event sequences have a lower index in the array than the events*/
                        for (var y = 0, yl = jsonComponent.FILTER.length; y < yl; y++) {
                                    var filter = jsonComponent.FILTER[y];

                                    //make sure and skip known 'group' types
                                    switch (filter.FILTER_CATEGORY_MEAN) {

                                        case "EVENT_SEQ":
                                            // 1) Find the group with the same sequence
                                            var groups = component.getGroups();
                                            if (groups) {
                                                for (var z = 0, zl = groups.length; z < zl; z++) {
                                                    var group = groups[z];
                                                    if (group.getSequence() == filter.FILTER_SEQ) {
                                                        //if a group with the same sequence has been discovered, remove existing event codes
                                                        // and add with sequenced event codes
                                                        group.setEventCodes(null);
                                                        group.setSequenced(true);
                                                        var aValue = GetFilterValues(filter);
                                                        for (var a = 0, bl = aValue.length; a < bl; a++) {
                                                            group.addEventCode(aValue[a].getId())
                                                        }
                                                    }
                                                }
                                            }
                                            break;
                                        case "EVENT_SET_SEQ":
                                            // 1) Find the group with the same sequence
                                            var groups = component.getGroups();
                                            if (groups) {
                                                for (var z = 0, zl = groups.length; z < zl; z++) {
                                                    var group = groups[z];
                                                    if (group.getSequence() == filter.FILTER_SEQ) {
                                                        //if a group with the same sequence has been discovered, remove existing event codes
                                                        // and add with sequenced event codes
                                                        group.setEventSets(null);
                                                        group.setSequenced(true);

                                                        //there is an exception case in regards to vital signs that an event set sequence
                                                        //could be created that contains results other than event sets.  So the following exception
                                                        //logic will be added to evaluate and create a new type of group to denote the change.

                                                        //first, place all values into a single array.  In addition, check if the types are the same,
                                                        // if all types are the same, setEventSets with the array of items found
                                                        // else, create a MPageSequenceGroup which hold multi type values and setItems with new array
                                                        //   and setMultiValue(true);
                                                        var aValue = GetFilterValues(filter);
                                                        var tempAr = [];
                                                        var tempMap = [];
                                                        var filterType = "CODE_VALUE"; //by default, all event codes or event set codes are type code value
                                                        var isMultiValue = false;
                                                        for (var zz = 0, zzl = aValue.length; zz < zzl; zz++) {
                                                            var val = aValue[zz];
                                                            tempAr.push(val.getId())
                                                            if (filterType != val.getName())
                                                                {isMultiValue = true;}
                                                            MP_Util.AddItemToMapArray(tempMap, val.getName(), val.getId())
                                                        }
                                                        if (isMultiValue) {
                                                            var eGroup = new MPageSequenceGroup();
                                                            eGroup.setMultiValue(isMultiValue);
                                                            eGroup.setItems(tempAr);
                                                            eGroup.setMapItems(tempMap);
                                                            eGroup.setSequence(true);
                                                            eGroup.setGroupId(group.getGroupId())
                                                            eGroup.setGroupName(group.getGroupName())
                                                            groups[z] = eGroup;
                                                        }
                                                        else {
                                                            group.setEventSets(tempAr);
                                                        }
                                                    }
                                                }
                                            }
                                            break;


                                        default:
                                            var aValue = GetFilterValues(filter);
                                            if (jsComponentFunc != null) {
                                                var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                                                if (filterFunc) {
                                                    var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                                                    var ret = eval(strFunc);
                                                }
                                            }
                                    }
                                }

                        returnAr.push(component);
                    }

                }
                return returnAr;
            }
        }
    }
    function GetFilterValues(jsonFilter){
        var aReturn = [];
        for (var x = 0, xl = jsonFilter.VALUES.length; x < xl; x++) {
            var jsonValue = jsonFilter.VALUES[x];
            var value = new BedrockMPageGroupValue();
            value.setId(jsonValue.PARENT_ENTITY_ID);
            value.setName(jsonValue.PARENT_ENTITY_NAME);
            value.setMeaning(jsonValue.CDF_MEANING);
            value.setDescription(jsonValue.FREETEXT_DESC);
            value.setSequence(jsonValue.GROUP_SEQ);
            value.setValueSequence(jsonValue.VALUE_SEQ);
            value.setValueTypeFlag(jsonValue.VALUE_TYPE_FLAG);
            value.setQualifierFlag(jsonValue.QUALIFIER_FLAG);

            aReturn.push(value);
        }
        return aReturn;
    }
    function getComponentByFilterMean(filterMean){
    	var fMEAN = filterMean.toUpperCase();
    	switch(fMEAN){
    	case "CS_LAYOUT_PARAMS":
    		return  ClinicalSummaryComponent;
    	case "DMS_ALLERGIES":
    	case "ALLERGY":
    		return AllergyComponent;
    	case "ANCIL_DOC":
    		return DocumentComponent;
    	case "APNEA":
    		return ABDComponent;
    	case "APPOINTMENTS":
    		return AppointmentsComponent;
    	case "CLIN_DOC":
    		return DocumentComponent;
        case "CONSOL_PROBLEMS":
        case "NARRATIVE_PROBLEM":
		case "WF_CONSOL_PROBLEMS": 
		    return CvComponent;
    	case "CURR_STATUS":
    		return CurStatusComponentO1;
    	case "CUSTOM_COMP_1":
    	case "CUSTOM_COMP_2":
		case "CUSTOM_COMP_3":
		case "CUSTOM_COMP_4":
		case "CUSTOM_COMP_5":
		case "CUSTOM_COMP_6":
		case "CUSTOM_COMP_7":
		case "CUSTOM_COMP_8":
		case "CUSTOM_COMP_9":
		case "CUSTOM_COMP_10":
		case "CUSTOM_COMP_11":
		case "CUSTOM_COMP_12":
		case "CUSTOM_COMP_13":
		case "CUSTOM_COMP_14":
		case "CUSTOM_COMP_15":
		case "CUSTOM_COMP_16":
		case "CUSTOM_COMP_17":
		case "CUSTOM_COMP_18":
		case "CUSTOM_COMP_19":
		case "CUSTOM_COMP_20":
    		return CustomComponent;
    	case "DC_ACTIVITIES":
    		return ActivitiesComponent;
    	case "DC_CARE_MGMT":
    		return DischargePlanningComponent;
    	case "DMS_DIAGNOSIS":
    	case "DC_DIAGNOSIS":
    	case "DIAGNOSIS":
    	case "DX":
    		return DiagnosesComponent;
    	case "DC_ORDER":
    		return DischargeOrdersComponent;
    	case "DC_READINESS":
    		return DischargeIndicatorComponent;
    	case "DC_RESULTS":
    		return ResultsComponent;
    	case "DC_SOCIAL":
    		return SocialComponent;
    	case "ED_TIMELINE":
    		return TimelineComponent;
    	case "FAMILY_HX":
    		return FamilyHistoryComponent;
    	case "FIM":
    		return FunIndepMeasuresComponentO1;
    	case "FLAG_EVENTS":
    		return FlaggedEventsComponent;
    	case "FLD_BAL":
    		return IntakeOutputComponent;
    	case "FOLLOWUP":
    		return FollowUpComponent;
    	case "GOALS":
    		return GoalsComponentO1;
    	case "GRAPH":
    		return RespTimelineComponent;
    	case "GRAPHS":
    		return VSTimelineComponent;
    	case "GROWTH_CHART":
    		return GrowthChartComponent;
    	case "HEALTH_MAINT":
    		return HmiComponent;
    	case "HOME_MEDS":
    		return HomeMedicationsComponent;
    	case "ICU_FLOWSHEET":
    		return ICUFlowsheetComponent;
    	case "IMMUNIZATIONS":
    		return ImmunizationComponent;
    	case "INCOMPLETE_ORDERS":
    	case "ORDERS":
    		return OrdersComponent;
    	case "ORD_SEL_ADD_FAV_FOLDER":
    		return OrderSelectionComponent;
    	case "INTER_TEAM":
    		return InterTeamComponentO1;
    	case "DMS_LAB":
    		return LabPagerComponent;
    	case "LAB":
    		return LaboratoryComponent;
    	case "LINES":
    		return LinesTubesDrainsComponent;
    	case "MEDS":
    		return MedicationsComponent;
    	case "MED_REC":
    		return MedicationReconciliationComponent;
    	case "MICRO":
    		return MicrobiologyComponent;
    	case "NC_DC_PLAN":
    		return DischargePlanComponent;
    	case "NC_OVERDUE_TASKS":
    	case "OVERDUE_TASKS":
    		return TaskActivityComponent;
    	case "NC_PLAN":
    		return PlanofCareComponent;
    	case "NC_PSYCHOSOC":
    		return PsychosocialFactorsComponent;
    	case "NC_PT_ASSESS":
    		return PatientAssessmentComponent;
    	case "NC_PT_BACKGROUND":
    		return PatientBackgroundComponent;
		case "NEO_OVERVIEW": 
			return NeonateOverviewComponent;
		case "NEO_TASK_TIMELINE": 
			return NeonateTaskTimelineComponent;
		case "NEO_WEIGHT": 
			return NeonateMeasurementComponent;
		case "NEO_HYPERBILI": 
			return NeonateBilirubinComponent;
		case "NEO_TRANSFUSION": 
			return NeonateTransfusionComponent;	    		
    	case "NEW_DOC":
    		return NewDocumentEntryComponent;
    	case "NEW_ORDERS":
    		return NewOrderEntryComponent;
    	case "NOTES":
    		return NotesRemindersComponent;
    	case "ORDER_HX":
			return OrderHistoryComponent;
    	case "PAST_MED_HX":
    	case "PAST_MHX":
    		return PastMedicalHistoryComponent;
    	case "PATH":
    		return PathologyComponent;
    	case "PAT_ED":
    	case "PT_ED":
    		return PatientFamilyEduSumComponent;
    	case "PRECAUTIONS":
    		return PrecautionsComponentO1;
    	case "PREG_ASSESS":
    		return PresAssessInitialExamComponent;
    	case "PREG_ASSESS_2":
    		return PregAssessment2Component;
		case "PREG_ASSESS_3":
    		return PregAssessment3Component;
    	case "PREG_BIRTH_PLAN":
    		return BirthPlanComponent;
    	case "PREG_ED":
    		return EducationAndCounselingComponent;
    	case "PREG_EDD_MAINT":
    		return EDDMaintenanceComponent;
    	case "PREG_FETAL_MON":
    		return FetalMonitoringComponent;
    	case "PREG_GENETIC_SCR":
    		return GeneticScreeningComponent;
    	case "PREG_HX":
    		return PregnancyHistoryComponent;
    	case "PREG_OVERVIEW":
    		return PregnancyOverviewComponent;
    	case "PREG_RESULTS":
    		return ResultTimelineComponent;
    	case "DMS_PROBLEMS":
    	case "PROBLEM":
    		return ProblemsComponent;
    	case "PROC_HX":
    		return ProcedureComponent;
    	case "PT_INFO":
    		return PatientInfoComponent;
    	case "QM":
    		return QualityMeasuresComponent;
    	case "RAD":
    		return DiagnosticsComponent;
    	case "RESP":
    		return RespiratoryComponent;
    	case "RESP_ASSESS":
    		return RespAssessmentsComponent;
    	case "RESP_TX":
    		return RespTreatmentsComponent;
    	case "RESTRAINTS":
    		return RestraintsComponent;
    	case "SIG_EVENTS":
    		return SignificantEventO1Component;
    	case "SOCIAL_HX":
    		return SocialHistoryComponent;
    	case "SURG_PROC_HX":
    		return Procedure2Component;
    	case "TREATMENTS":
    		return TreatmentsComponentO1;
    	case"TRIAGE_DOCUMENT":
    		return TriageDocComponent;
    	case "VENT_MON":
    		return VentMonitoringComponent;
    	case "VISITS":
    		return VisitsComponent;
    	case "VS":
    		return VitalSignComponent;	
    	case "WEIGHT":
    		return WeightsComponent;
    	case "WF_MEDS":
    		return MedicationsComponentO2;			
    	case "PROC_INFO":
            return ProceduralInfoComponent;
        case "PERIOP_TRACK":
            return PeriopTrackComponent;
        case "INTRAOP_SUMMARY":
            return IntraopSummaryComponent;
        case "PREOP_CHECKLIST":
           return PreopChcklstComponent;
        case "POSTOP_SUMMARY":
            return PostopSummaryComponent;
        case "HIV_PROFILE":
            return HIVProfileComponent;
        case "EP_DA":
        	return DiscernAnalyticsComponent;
    	case "DMS_REFERENCE":
    		return ClinicalDecSuppComponent;
    	case "DMS_SCREENINGS":
    		return ScreeningsComponent;
    	case "DMS_DIET":
    		return DietsComponent;
    	case "DMS_ANTIDIABETIC":
    		return MedsSpecificComponent;
    	case "DMS_MEDS_GLUC_LVL":
    		return MedsGlucoseComponent;
    	case "DMS_INS_24_HRS":
    		return InsulinReqComponent;
    	case "DMS_GRAPH":
    		return DiabetesGraphComponent;
		case "CLIN_TRIALS":
            return ClinicalTrialsComponent;
		case "CHEMO_REVIEW":
            return ChemotherapyReviewComponent;
		case "WF_ASSESSMENT_PLAN":
            return DocumentationIPComponent;
		case "WF_CHIEF_COMPLAINT":
    	   return ChiefComplaintComponent;
		case "WF_CLIN_DOC":
            return DocumentComponent2;
        case "WF_FLD_BAL":
        	return IntakeOutputOpt2Component;
		case "WF_HX_PRESENT_ILL":
            return DocumentationHPIComponent;
        case "WF_INCOMPLETE_ORDERS":
        	return OrdersOpt2Component;
    	case "WF_NEW_ORDERS":
    		return NewOrderEntryO2Component;
       	case "WF_ORDER_HX":
       		return OrderHistoryOpt2Component;
		case "WF_PHYSICAL_EXAM":
            return DocumentationPEComponent;
		case "WF_REVIEW_SYMPT":
            return DocumentationROSComponent;
    	default:
    		alert("Unknown filter mean: [" + fMEAN + "]");
    	}
    }
    function BRCompPrefSetFuncCreation(filterMappings){
        //Function to return so that the mapped function can be executed.
        var ExecuteBRPrefFunction = function(component, filterMean, brFilterValues){
            var execResult;
            var functionArgs = [];
            var filter;
            var filterField;
            var filterType;
            var functionCall;
            var i;
            var setFuncName;

            if (!filterMean || !brFilterValues) {
                return false;
            }
            //Look through the mappings and see if one exists with the necessary information
            for (i = filterMappings.length; i--;) {
                filter = filterMappings[i];
                if (filter.m_filterMean.toUpperCase() === filterMean.toUpperCase()) {
                    setFuncName = filter.m_functionName;
                    filterType = filter.m_dataType;
                    filterField = filter.m_field;
                    break;
                }
            }

            if (!setFuncName) {
                return false;
            }
            else {
                //Use the components filter setting function to set the pref
                for (var x = brFilterValues.length; x--;) {
                    var val = brFilterValues[x];
                    switch (filterField.toUpperCase()) {
                        case "FREETEXT_DESC":
                            functionArgs.push(val.getDescription());
                            break;
                        case "PARENT_ENTITY_ID":
                            functionArgs.push(val.getId());
                            break;
                        case "NOMEN":    
                        	functionArgs.push('{"nomen_id":' + val.getId() + ', "seq":' + val.getValueSequence() + ', "qual_flag":' + val.getQualifierFlag() +  "}"); 
                        	break;
                        case "VALUE_SEQ":    
                        	functionArgs.push('{"id":' + val.getId() + ', "seq":' + val.getValueSequence() + "}"); 			      
                       		break;                            
                        default:
                            break;
                    }
                }
                switch (filterType.toUpperCase()) {
                    case "ARRAY":
                        functionCall = "component." + setFuncName + "([" + functionArgs.join(",") + "])";
                        break;
                    case "STRING":
                        functionCall = "component." + setFuncName + "('" + functionArgs.join(",") + "')";
                        break;
                    case "NUMBER":
                        functionCall = "component." + setFuncName + "(" + functionArgs.join(",") + ")";
                        break;
                    case "BOOLEAN":
                        var bVal = (functionArgs[0] == "1") ? true : false;
                        functionCall = "component." + setFuncName + "(" + bVal + ")";
                        break;
					case "NOMEN":
					case "VALUE_SEQ":
                    	functionCall = "component." + setFuncName + "([" + functionArgs.join(",") + "])";
                    	break;                        
                    default:
                        break;
                }
                eval(functionCall);
                return true;
            }
        };
        return ExecuteBRPrefFunction;
    }
    function FilterMapping(filterMean, functionName, dataType, field){
        this.m_filterMean = filterMean;
        this.m_functionName = functionName;
        this.m_dataType = dataType;
        this.m_field = field;
    }
    function GetComponentFilterFuncs(nameSpace, reportMean){
        var compFilterMaps = [];
		var custCompNum;
        if (nameSpace) {
            switch (nameSpace) {
                case 'cs':
                    compFilterMaps.push(new FilterMapping("CS_TEMPLATE", "setTemplateIds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_DOC_TYPE", "setDocType", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_PUBLISH_BUTTON_LABEL", "setPublishButtonLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("CS_DISPLAY_SAVE_BUTTON", "setDisplaySaveButton", "Boolean", "FREETEXT_DESC"));
                    break;
                case 'abd':
                    compFilterMaps.push(new FilterMapping("MP_ABD_PT_DAYS", "setAgeDays", "Number", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_APNEA", "setApneaEventCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_APNEA_NOMEN", "setApneaNomenIds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_BRADY", "setBradyEventCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_BRADY_NOMEN", "setBradyNomenIds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_DESAT", "setDesatEventCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_DESAT_NOMEN", "setDesatNomenIds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_O2_SAT", "setO2SatCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_HR", "setHRCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_SKIN_COLOR", "setSkinColorCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_ACTIVITY", "setActivityCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_POSITION", "setPositionCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_STIMULATION", "setStimulationCds", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MP_ABD_DURATION", "setDurationCds", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'act':
                	compFilterMaps.push(new FilterMapping("ACT_CHART_LAUNCH_IND", "setIViewAdd", "Boolean", "FREETEXT_DESC"));
                	break;
				case 'bp':
					compFilterMaps.push(new FilterMapping("PREG_BIRTH_PLAN_PF", "setBirthPlanPF", "Number", "PARENT_ENTITY_ID"));
					break;
                case 'cm':
                    compFilterMaps.push(new FilterMapping("DC_DC_PLAN_CE", "setDischScreenPlan", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_DC_DISP_CE", "setDischDisposition", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_TRANSP_ARR_CE", "setDocTransArrangement", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_PROF_SKILL_ANT_CE", "setProfSkillServices", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_DME_ANT_CE", "setDurableMedEquipment", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_DME_COORD_CE", "setDurableMedEquipmentCoordinated", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_PLAN_DC_DT_TM_CE", "setPlannedDischDate", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_ADM_MIM_CE", "setAdmissionMIMSigned", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DC_DSCH_MIM_CE", "setDischMIMGiven", "Array", "PARENT_ENTITY_ID"));
                    break;
		case 'chief':
                    compFilterMaps.push(new FilterMapping("WF_CHIEF_COMP_CE","setClinicalEventSets","Array","PARENT_ENTITY_ID"));
                    break;
                case 'cv':
                    compFilterMaps.push(new FilterMapping("DEFAULT_SEARCH_VOCAB", "setDefaultSearchVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VISIT_VOCAB", "setVisitVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ACTIVE_VOCAB", "setActiveVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ACTIVE_LABEL", "setActiveLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("VISIT_LABEL", "setVisitLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HISTORICAL_LABEL", "setHistoricalLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_TYPE_DX", "setVisitAddType", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_CLASS", "setActiveAddClass", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_TYPE_CONFIRM", "setActiveAddType", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_CLASS_DX", "setVisitAddClass", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CP_QUICK_ADD_CONF_STATUS", "setVisitAddConf", "Number", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("MODAL_DIALOG_IND", "setModifyInd", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("THIS_VISIT_PRIORITY_IND","setEnableModifyPrioritization","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NARR_DEFAULT_SEARCH_VOCAB","setDefaultSearchVocab","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_VISIT_VOCAB","setVisitVocab","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_ACTIVE_VOCAB","setActiveVocab","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_ACTIVE_LABEL","setActiveLabel","String","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NARR_VISIT_LABEL","setVisitLabel","String","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NARR_HISTORICAL_LABEL","setHistoricalLabel","String","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NARR_CP_QK_ADD_TYPE_DX","setVisitAddType","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_CP_QUICK_ADD_CLASS","setActiveAddClass","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_CP_QK_ADD_TYPE_CFRM","setActiveAddType","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_CP_QK_ADD_CLASS_DX","setVisitAddClass","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_CP_QK_ADD_CONF_STAT","setVisitAddConf","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NARR_MODAL_DIALOG_IND","setModifyInd","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NARR_THIS_VISIT_PRIORITY_IND","setEnableModifyPrioritization","Boolean","FREETEXT_DESC"));
					//For Workflow Components
                    compFilterMaps.push(new FilterMapping("WF_DEFAULT_SEARCH_VOCAB", "setDefaultSearchVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_VISIT_VOCAB", "setVisitVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_ACTIVE_VOCAB", "setActiveVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_ACTIVE_LABEL", "setActiveLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_VISIT_LABEL", "setVisitLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_HISTORICAL_LABEL", "setHistoricalLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_CP_QUICK_ADD_TYPE_DX", "setVisitAddType", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_CP_QUICK_ADD_CLASS", "setActiveAddClass", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_CP_QUICK_ADD_TYPE_CONFIRM", "setActiveAddType", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_CP_QUICK_ADD_CLASS_DX", "setVisitAddClass", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_CP_QUICK_ADD_CONF_STATUS", "setVisitAddConf", "Number", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_MODAL_DIALOG_IND", "setModifyInd", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_THIS_VISIT_PRIORITY_IND","setEnableModifyPrioritization","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_DEFAULT_SEARCH_VOCAB","setDefaultSearchVocab","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_VISIT_VOCAB","setVisitVocab","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_ACTIVE_VOCAB","setActiveVocab","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_ACTIVE_LABEL","setActiveLabel","String","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_VISIT_LABEL","setVisitLabel","String","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_HISTORICAL_LABEL","setHistoricalLabel","String","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_CP_QK_ADD_TYPE_DX","setVisitAddType","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_CP_QUICK_ADD_CLASS","setActiveAddClass","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_CP_QK_ADD_TYPE_CFRM","setActiveAddType","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_CP_QK_ADD_CLASS_DX","setVisitAddClass","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_CP_QK_ADD_CONF_STAT","setVisitAddConf","Number","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_MODAL_DIALOG_IND","setModifyInd","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("WF_NARR_THIS_VISIT_PRIORITY_IND","setEnableModifyPrioritization","Boolean","FREETEXT_DESC"));					
                    break;
                case 'curstat':
                    compFilterMaps.push(new FilterMapping("CS_ASSESSMENTS", "setAssessmentEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_VITAL_MEASURE", "setVitalMeasureEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_BOWEL_BLADDER", "setBowelBladderEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_SKIN_ASSESS_TOL", "setSkinAssessTolEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_ORTHOTICS_SCHED", "setOrthonticsShedEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_ADL", "setADLEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_IADL", "setIADLEventSets", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CS_COG_COMMUNICATE", "setCogCommunicateEventSets", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'cust':
					custCompNum = reportMean.match(/[0-9]+$/);
					if (custCompNum) {
						compFilterMaps.push(new FilterMapping("CUSTOM_COMP_PRG_" + custCompNum[0], "setComponentNamespace", "String", "FREETEXT_DESC"));
						compFilterMaps.push(new FilterMapping("CUSTOM_COMP_OBJ_" + custCompNum[0], "setComponentOptionsObjectName", "String", "FREETEXT_DESC"));
					}
					break;
                case "da":
					compFilterMaps.push(new FilterMapping("EP_DA_TEXT","setCustTxt","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("EP_DA_PF","setFormId","String","PARENT_ENTITY_ID"));
					break;
				case 'dishord':
                    compFilterMaps.push(new FilterMapping("DC_ORDER_SELECT", "setCatalogCodes", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'doc':
                	compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP1_LABEL","setGrp1Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP1_ES","setGrp1Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP2_LABEL","setGrp2Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP2_ES","setGrp2Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP3_LABEL","setGrp3Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP3_ES","setGrp3Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP4_LABEL","setGrp4Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP4_ES","setGrp4Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP5_LABEL","setGrp5Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP5_ES","setGrp5Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP6_LABEL","setGrp6Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP6_ES","setGrp6Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP7_LABEL","setGrp7Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP7_ES","setGrp7Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP8_LABEL","setGrp8Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP8_ES","setGrp8Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP9_LABEL","setGrp9Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP9_ES","setGrp9Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP10_LABEL","setGrp10Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DOC_SPECIALTY_GRP10_ES","setGrp10Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("DOC_POWERNOTE_FAVOR_IND","setPowerNoteFavInd","Boolean","FREETEXT_DESC"));
					break;
                case 'doc2':
                	compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP1_LABEL","setGrp1Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP1_ES","setGrp1Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP2_LABEL","setGrp2Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP2_ES","setGrp2Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP3_LABEL","setGrp3Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP3_ES","setGrp3Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP4_LABEL","setGrp4Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP4_ES","setGrp4Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP5_LABEL","setGrp5Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP5_ES","setGrp5Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP6_LABEL","setGrp6Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP6_ES","setGrp6Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP7_LABEL","setGrp7Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP7_ES","setGrp7Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP8_LABEL","setGrp8Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP8_ES","setGrp8Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP9_LABEL","setGrp9Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP9_ES","setGrp9Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP10_LABEL","setGrp10Label","String","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_DOC_SPECIALTY_GRP10_ES","setGrp10Criteria","Array","PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_DOC_POWERNOTE_FAVOR_IND","setPowerNoteFavInd","Boolean","FREETEXT_DESC"));
                case 'dx':
                    compFilterMaps.push(new FilterMapping("DIAGNOSIS_TYPE", "setDiagnosisType", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_VOCAB", "setDiagnosisVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_TYPE", "setDiagnosisAddTypeCd", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_CLASS_DX", "setDiagnosisClassification", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("DX_QUICK_ADD_VOCAB_IND", "setDiagnosisVocabInd", "Number", "FREETEXT_DESC"));
                    break;
                case 'edu':
                    compFilterMaps.push(new FilterMapping("PREG_ED_PF", "setEdCounselingPF", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'fim':
                    compFilterMaps.push(new FilterMapping("TARGET_DC_DT", "setAnticipatedDischargeDateDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ANTI_DISPOSITION", "setAnticipatedDispositionDateDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PRIMARY_IMPAIR_CDS", "setPrimaryImpairmentCodeDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_EAT", "setEatingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_EAT_GOAL", "setEatingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_GROOM", "setGroomingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_GROOM_GOAL", "setGroomingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BATH", "setBathingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BATH_GOAL", "setBathingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_UP_EXT_DRESS", "setUpperExtremityDressingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_UP_EXT_DRESS_GOAL", "setUpperExtremityDressingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOW_EXT_DRESS", "setLowerExtremityDressingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOW_EXT_DRESS_GOAL", "setLowerExtremityDressingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET", "setToiletingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET_GOAL", "setToiletingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_LEV_ASSIST", "setBladderLevelofAssistanceDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_LEV_ASSIST_GOAL", "setBladderLevelofAssistanceGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_ACC", "setBladderAccidentsDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BLAD_ACC_4", "setBladderAccidentsPast4DaysDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BOWEL_LEV_ASSIST", "setBowelLevelofAssistanceDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BWL_LVL_ASSIST_GOAL", "setBowelLevelofAssistanceGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BOWEL_ACC", "setBowelAccidentsDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BOWEL_ACC_4", "setBowelAccidentsPast4DaysDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BED_CHAIR_WHEEL", "setBedChairWheelChairDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_BED_CHAIR_WHEEL_GOAL", "setBedChairWheelChairGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET_TRANS", "setToiletTransferDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_TOILET_TRANS_GOAL", "setToiletTransferGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_TUB_TRANS", "setTubTransferDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_SHOWER_TRANS", "setShowerTransferDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_TUB_SHOWER_GOAL", "setTubShowerTransfergoaldocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WALK", "setLocomotionWalkDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WALK_GOAL", "setLocomotionWalkGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WHEEL", "setLocomotionWheelChairDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_WHEEL_GOAL", "setLocomotionWheelChairGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_STAIR", "setLocomotionStairDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_MOTOR_LOCO_STAIR_GOAL", "setLocomotionStairGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_COMP", "setComprehensionDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_COMP_GOAL", "setComprehensionGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_EXPRESS", "setExpressionDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_EXPRESS_GOAL", "setExpressionGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_SOC_INTER", "setSocialInteractionDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_SOC_INTER_GOAL", "setSocialInteractionGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_PROB_SOLVE", "setProblemSolvingDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_PROB_SOLVE_GOAL", "setProblemSolvingGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_MEMORY", "setMemoryDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("FIM_COG_MEMORY_GOAL", "setMemoryGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'goals':
                    compFilterMaps.push(new FilterMapping("NURSE_GOAL_DOC", "setNursingGoals", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("OT_STG_DOC", "setOTShortTermGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("OT_LTG_DOC", "setOTLongTermGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PT_STG_DOC", "setPTShortTermGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PT_LTG_DOC", "setPTLongTermGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("SLP_STG_DOC", "setSLPShortTermGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("SLP_LTG_DOC", "setSLPLongTermGoalDocumented", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'hivprofile':
                    compFilterMaps.push(new FilterMapping("HIV_DISCLAIMER", "setDisclaimerText", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HIV_PROFILE_REPORT", "setFinalReportEventCode", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PR_MUTATION", "setPrEventCode", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PR_MUTATION_NOMEN", "setPrNoMutationsFilter", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("RT_MUTATION", "setRtEventCode", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("RT_MUTATION_NOMEN", "setRtNoMutationsFilter", "String", "FREETEXT_DESC"));
                    break;
				case 'hml':
                    compFilterMaps.push(new FilterMapping("MEDS_MODS", "setMedModInd", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("DISCH_MED_REC_MOD","setMedRec","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM1_LABEL", "setGrp1Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM1", "setGrp1Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM2_LABEL", "setGrp2Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM2", "setGrp2Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM3_LABEL", "setGrp3Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM3", "setGrp3Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM4_LABEL", "setGrp4Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM4", "setGrp4Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM5_LABEL", "setGrp5Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM5", "setGrp5Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM6_LABEL", "setGrp6Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM6", "setGrp6Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM7_LABEL", "setGrp7Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM7", "setGrp7Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM8_LABEL", "setGrp8Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM8", "setGrp8Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM9_LABEL", "setGrp9Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM9", "setGrp9Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM10_LABEL", "setGrp10Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HOME_MEDS_MULTUM10", "setGrp10Criteria", "Array", "PARENT_ENTITY_ID"));

                    break;
                case 'icufs':
                    compFilterMaps.push(new FilterMapping("VITALS_GRAPH_LABEL", "setBPGraphTitle", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("VITALS_HEMO_LABEL", "setVitalLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_LABEL", "setLabLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("RESP_LABEL", "setRespLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEURO_LABEL", "setNeuroLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("ENDO_LABEL", "setEndoLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MULTUM_CLASS_VITALS_HEMO", "setHemoMultumClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MULTUM_SEQ_VITALS_HEMO", "setHemoMultumSeqClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NON_TITRATE_MED_IND_HEMO", "setHemoNonTitrateInd", "Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MULTUM_CLASS_RESP", "setRespMultumClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MULTUM_SEQ_RESP", "setRespMultumSeqClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NON_TITRATE_MED_IND_RESP", "setRespNonTitrateInd", "Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MULTUM_CLASS_NEURO", "setNeuroMultumClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MULTUM_SEQ_NEURO", "setNeuroMultumSeqClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NON_TITRATE_MED_IND_NEURO", "setNeuroNonTitrateInd", "Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MULTUM_CLASS_ENDO", "setEndoMultumClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MULTUM_SEQ_ENDO", "setEndoMultumSeqClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NON_TITRATE_MED_IND_ENDO", "setEndoNonTitrateInd", "Boolean","FREETEXT_DESC"));
                    break;
                case 'intm':
                    compFilterMaps.push(new FilterMapping("TEAM_CONF_ORDER", "setTeamConfOrder", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAST_TEAM_DISC", "setLastTeamDiscussionDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("BARRIERS_DC_DOC", "setBarriersToDischargeDocumented", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PRIM_OT_NAME_DOC", "setPrimaryOccupationalTherapists", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PRIM_PT_NAME_DOC", "setPrimaryPhysicalTherapists", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PRIM_ST_NAME_DOC", "setPrimarySpeechTherapists", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'io':
                    compFilterMaps.push(new FilterMapping("OUTPUT_COUNT", "setCounts", "Array", "PARENT_ENTITY_ID"));                    
                    break;
                case 'io2':
                    compFilterMaps.push(new FilterMapping("WF_OUTPUT_COUNT", "setCounts", "Array", "PARENT_ENTITY_ID"));
                    break;    
                case 'lab':
                    compFilterMaps.push(new FilterMapping("LAB_PRIMARY_LABEL", "setPrimaryLabel", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_RESULTS_IND", "setShowTodayValue", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP1_LABEL", "setGrp1Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP1_ES", "setGrp1Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP2_LABEL", "setGrp2Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP2_ES", "setGrp2Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP3_LABEL", "setGrp3Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP3_ES", "setGrp3Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP4_LABEL", "setGrp4Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP4_ES", "setGrp4Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP5_LABEL", "setGrp5Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP5_ES", "setGrp5Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP6_LABEL", "setGrp6Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP6_ES", "setGrp6Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP7_LABEL", "setGrp7Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP7_ES", "setGrp7Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP8_LABEL", "setGrp8Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP8_ES", "setGrp8Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP9_LABEL", "setGrp9Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP9_ES", "setGrp9Criteria", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP10_LABEL", "setGrp10Label", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("LAB_SPECIALTY_GRP10_ES", "setGrp10Criteria", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'ld':
                    compFilterMaps.push(new FilterMapping("LINES_ES", "setLineCodes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("TUBES_DRAINS_ES", "setTubeCodes", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'med':
		    compFilterMaps.push(new FilterMapping("MEDS_SCHED", "setScheduled", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MEDS_PRN","setPRN","Boolean","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_DISC","setDiscontinued","Boolean","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_ADM","setAdministered","Boolean","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_SUS","setSuspended","Boolean","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_CONT","setContinuous","Boolean","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_ADM_LB_HRS","setAdministeredLookBkHrs","Number","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_DISC_LB_HRS","setDiscontinuedLookBkHr","Number","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_SCHED_NEXT_DOSE","setScheduleNextDose","Number","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_PRN_LAST_DOSE","setPRNLastDose","Number","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_SCHED_NEXT_12","setSchedNextTwelve","Number","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_PRN_LAST_48","setPRNLastFortyEight","Number","FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("MEDS_SCHED_OVERDUE","setSchedOverdue","Number","FREETEXT_DESC"));
                    break;
                case 'nde':
                    compFilterMaps.push(new FilterMapping("NEW_DOC_IND", "setDisplayEnabled", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEW_DOC_TITLE", "setDocTitle", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_1", "setLabelOne", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_2", "setLabelTwo", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_3", "setLabelThree", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEW_DOC_SECT_LABEL_4", "setLabelFour", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("NEW_DOC_CE", "setDocEventCode", "Number", "PARENT_ENTITY_ID"));
                    break;
                case 'noe':
					compFilterMaps.push(new FilterMapping("ORD_SRCH_IND", "setOrderSearchInd", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("NEW_ORD_ENTRY", "setVenueType", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("ORDER_POWERPLAN_IND", "setPowerPlanEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("PERSONAL_FAV_OE", "setUserFavEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("PERSONAL_FAV_LABEL", "setUserFavLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("PUBLIC_FAV_OE", "setPublicFavEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("PUBLIC_FAV_LABEL", "setPublicFavLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("SHARED_FAV_OE", "setSharedFavEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("SHARED_FAV_LABEL", "setSharedFavLabel", "String", "FREETEXT_DESC"));
					break;
                case 'noe2':
					compFilterMaps.push(new FilterMapping("WF_ORD_SRCH_IND", "setOrderSearchInd", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_NEW_ORD_ENTRY", "setVenueType", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_ORDER_POWERPLAN_IND", "setPowerPlanEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_PERSONAL_FAV_OE", "setUserFavEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_PERSONAL_FAV_LABEL", "setUserFavLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_PUBLIC_FAV_OE", "setPublicFavEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_PUBLIC_FAV_LABEL", "setPublicFavLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_SHARED_FAV_OE", "setSharedFavEnabled", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_SHARED_FAV_LABEL", "setSharedFavLabel", "String", "FREETEXT_DESC"));
					break;
                case 'nr':
                    compFilterMaps.push(new FilterMapping("STICKY_NOTE_TYPES", "setStickyNoteTypeCodes", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'ohx':
					compFilterMaps.push(new FilterMapping("ORDER_HX_STATUS_IND", "setOHStatusOpt", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("ORDER_HX_CAT_TYPE", "setOHCatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP1_LABEL", "setGrp1CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP1_ORD", "setGrp1CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP2_LABEL", "setGrp2CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP2_ORD", "setGrp2CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP3_LABEL", "setGrp3CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP3_ORD", "setGrp3CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP4_LABEL", "setGrp4CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP4_ORD", "setGrp4CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP5_LABEL", "setGrp5CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP5_ORD", "setGrp5CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP6_LABEL", "setGrp6CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP6_ORD", "setGrp6CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP7_LABEL", "setGrp7CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP7_ORD", "setGrp7CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP8_LABEL", "setGrp8CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP8_ORD", "setGrp8CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP9_LABEL", "setGrp9CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP9_ORD", "setGrp9CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP10_LABEL", "setGrp10CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("CUSTOM_CATALOG_GRP10_ORD", "setGrp10CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					break;    
                case 'ohx2':
					compFilterMaps.push(new FilterMapping("WF_ORDER_HX_STATUS_IND", "setOHStatusOpt", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_ORDER_HX_CAT_TYPE", "setOHCatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP1_LABEL", "setGrp1CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP1_ORD", "setGrp1CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP2_LABEL", "setGrp2CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP2_ORD", "setGrp2CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP3_LABEL", "setGrp3CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP3_ORD", "setGrp3CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP4_LABEL", "setGrp4CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP4_ORD", "setGrp4CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP5_LABEL", "setGrp5CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP5_ORD", "setGrp5CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP6_LABEL", "setGrp6CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP6_ORD", "setGrp6CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP7_LABEL", "setGrp7CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP7_ORD", "setGrp7CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP8_LABEL", "setGrp8CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP8_ORD", "setGrp8CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP9_LABEL", "setGrp9CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP9_ORD", "setGrp9CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP10_LABEL", "setGrp10CatLabel", "String", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_CUSTOM_CATALOG_GRP10_ORD", "setGrp10CatalogCodes", "Array", "PARENT_ENTITY_ID"));
					break;
                case 'ord':
                    compFilterMaps.push(new FilterMapping("INCOMPLETE_ORDERS_CAT_TYPE", "setCatalogCodes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("INCOMPLETE_ORDERS_STATUS", "setOrderStatuses", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'ord2':
                    compFilterMaps.push(new FilterMapping("WF_INCOMPLETE_ORDERS_CAT_TYPE", "setCatalogCodes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("WF_INCOMPLETE_ORDERS_STATUS", "setOrderStatuses", "Array", "PARENT_ENTITY_ID"));
                    break;                    
                case 'ordsel':
                    compFilterMaps.push(new FilterMapping("ROOT_FAVORITE", "setFavFolderId", "Number", "PARENT_ENTITY_ID"));
                    break;
                case 'pbg':
                    compFilterMaps.push(new FilterMapping("NC_PAIN_SCR", "setPainScores", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_ASSIST_DEV", "setDevices", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_DIET_ORD", "setDietOrders", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_PT_ACT_ORD", "setPatientActivityOrders", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_RESUS_ORD", "setResucitationOrders", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_SEIZURE_ORD", "setSeizureOrders", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_ISOLATION_ORD", "setIsolationOrders", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_ADV_DIR", "setAdvancedDirectives", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_PARA", "setParas", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_GRAVIDA", "setGravidas", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_FALL_PRECAUTIONS", "setFallPrecautions", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'pc':
                    compFilterMaps.push(new FilterMapping("NC_PLAN_STATUS", "setPlanStatusCodes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NC_PLAN_CLASS", "setPlanClassificationCodes", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'pl':
                    compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_VOCAB", "setProblemsVocab", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_TYPE", "setProblemsAddTypeCd", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_CLASS", "setProblemsClassification", "Number", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PROB_QUICK_ADD_VOCAB_IND", "setProblemsVocabInd", "Number", "FREETEXT_DESC"));
                    break;
                case 'pa':
                    compFilterMaps.push(new FilterMapping("PREG_ASSESS_IND", "setDisplayEnabled", "Boolean", "FREETEXT_DESC"));
		    compFilterMaps.push(new FilterMapping("PREG_ANTEPARTUM_NOTE", "setAntepartumNote", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_ENC_TYPE", "setEncType", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_EST_GEST_GAP", "setEstGesAge", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_FUNDAL_HT", "setFundalHt", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_PRE_SGN_SYM", "setPreSgnAndSym", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_CERV_DILAT", "setCerDilat", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_CERV_EFF_LEN", "setCerEffLen", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_CERV_STAT", "setCerStat", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("CUMULATIVE_WT", "setCumulativeWt", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_WEIGHT", "setWeight", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_EDEMA", "setEdema", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_PROTEIN", "setProtein", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_GLUCOSE", "setGlucose", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_NEXT_APPT", "setNextAppointment", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_PAIN", "setPain", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_PRESENT", "setPresentation", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_FETAL_MOV", "setFetalMovement", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_FETAL_HR", "setFetalHrRt", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_FETAL_LIE", "setFetalLie", "Array", "PARENT_ENTITY_ID"));
		    compFilterMaps.push(new FilterMapping("PREG_ASSESS_BP_GROUP", "setBPResGroup", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'pa2':
                    compFilterMaps.push(new FilterMapping("PREG_ANTEPARTUM_NOTE_2", "setAntepartumNote2", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_ASSESS_2_IND", "setDisplayEnabled", "Boolean", "FREETEXT_DESC"));
                    break;
				case 'pa3':
                    compFilterMaps.push(new FilterMapping("PREG_ANTEPARTUM_NOTE_3", "setAntepartumNote3", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_ASSESS_3_IND", "setDisplayEnabled", "Boolean", "FREETEXT_DESC"));
                    break;
                case 'pch':
                	compFilterMaps.push(new FilterMapping("PREOP_LAST_FOOD_INTAKE", "setLastFdIntake", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_LAST_FLD_INTAKE", "setLastFlIntake", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_ANES_CONSENT", "setAnesCnst", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_BLD_CONSENT", "setBldCnst", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_SURG_CONSENT", "setSurgCnst", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_ORDERS_CMPLT", "setOrdrsCmplt", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_ECG_ORDERS", "setEcgOrdrs", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_HCG_ORDERS", "setHcgOrdrs", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_HX_PHYSICAL_REC", "setHnP", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_SURG_PREP_VER", "setSurgPrepVer", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_ALLERGY_BAND", "setIdVerf", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_BLD_BAND", "setBldBand", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_ID_BAND", "setPrIdBand", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_SITE_VER_PT", "setPrSiteVer", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_SITE_VER_RN", "setPrSiteVerRN", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_SITE_VER_MD", "setPrSiteVerMD", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_IMPLANT_AVAILABLE", "setPrImplntAvail", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_BLD_AVAILABLE", "setPrBldAvail", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_EQUIP_AVAILABLE", "setPrEquipAvail", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_MD_WHO_VER_SITE", "setWhoVerfSite", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("PREOP_RN_WHO_VER_SITE", "setRNWhoVerfSite", "Array", "PARENT_ENTITY_ID"));
                case 'po':
                    compFilterMaps.push(new FilterMapping("PREG_GRAVIDA", "setGravida", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PARA", "setPara", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PARA_ABORT", "setParaAbort", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PARA_PREM", "setParaPremature", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PARA_FT", "setParaFullTerm", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_LIVE_CHILD_HX", "setLiving", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_MULTI_BIRTH_HX", "setMulitBirths", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_ECTOPIC_HX", "setEctopic", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_SPON_ABORT_HX", "setSpontAbort", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_IND_ABORT_HX", "setInducedAbort", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PRE_WT", "setPrePregWeight", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_HT", "setHeight", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_LAST_DOC_HT_WT", "setBMI", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_ABORH_TYPE", "setABORhType", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_BLD_TYPE", "setBloodType", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_RH_TYPE", "setRhType", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_CURR_WT", "setCurrentWeight", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_EPI_DEGREE", "setEpiDegree", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_EPI_MIDLINE", "setEpiMidline", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_EPI_MEDIO", "setEpiMedio", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_EPI_PERF", "setEpiPerformed", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_EPI_OTHER", "setEpiOther", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PERI_INTACT", "setPerineumIntact", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_CX_LAC", "setCervicalLac", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PERINEIAL_LAC", "setPerinealLac", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_PERIURETHRAL_LAC", "setPeriurethralLac", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_SUPER_LAC", "setSuperficialLac", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_VAG_LAC", "setVaginalLac", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_LABIAL_LAC", "setLabialLac", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_ANESTH_TYPE", "setAnesthType", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_ANESTH_OB_TYPE", "setAnesthOB", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_DT_TM_BIRTH", "setBirthDtTm", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_GENDER", "setGender", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_BIRTH_WT", "setBirthWeight", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_NEO_OUTCOME", "setNeoOutcome", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_NEO_COMP", "setNeoComps", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_APGAR_1_MIN", "setApgar1", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_APGAR_5_MIN", "setApgar5", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_APGAR_10_MIN", "setApgar10", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_FEED_TYPE_NB", "setFeeding", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_DELIVERY_TYPE", "setDeliveryType", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'pso':
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_EXPLANT", "setImplantExplant", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_DESC", "setImplantDesc", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_SERIAL_NBR", "setImplantSerNbr", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_LOT_NBR", "setImplantLotNbr", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_MANU", "setImplantManu", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_CAT_NBR", "setImplantCatNbr", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_SIZE", "setImplantSize", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_EXP_DT", "setImplantExpDt", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_SITE", "setImplantSite", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_IMPLANT_QTY", "setImplantQty", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_DRESS_COND", "setDressCond", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_DRESS_DRAINAGE", "setDressDrain", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_DRESS_DESC", "setDressDesc", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_DRESS_CARE", "setDressCare", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_DRESS_LOC", "setDressLoc", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_PAIN_LOC", "setPainLoc", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_PAIN_RATING", "setPainRating", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_PAIN_SCALE", "setPainScale", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_PAIN_QUAL", "setPainQual", "Array", "PARENT_ENTITY_ID"));
                	compFilterMaps.push(new FilterMapping("POSTOP_PAIN_INTERVENTIONS", "setPainInterv", "Array", "PARENT_ENTITY_ID"));
                	break;
                case 'pt':
                    compFilterMaps.push(new FilterMapping("CHIEF_COMP_CE", "setChiefComplaint", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("RESUS_ORDER", "setResusOrders", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ADV_DIRECTIVE", "setAdvancedDirectives", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("MODE_ARRIVAL_CE", "setModeofArrival", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NOTE_ES", "setDocumentTypes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("TARGET_DC_DT", "setEstimatedDischargeDate", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ENC_TYPE", "setVisitTypeCodes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("REASON_IND", "setRFVDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("PRIMARY_DR_IND", "setPrimaryPhysDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("ED_CONTACT_IND", "setEmergencyContactsDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("ADMIT_DR_IND", "setAdmittingPhysDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("RM_IND", "setRoomBedDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("ATTEND_DR_IND", "setAttendingPhysDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("REFER_DR_IND","setReferringPhysDisplay","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("ADM_DT_IND", "setAdmitDateDisplay", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("MED_SVC_IND", "setMedicalServiceDisplay", "Boolean", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("DIET_ORD","setDietOrders","Array","PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ACTIVITY_ORD","setPatientActivityOrders","Array","PARENT_ENTITY_ID"));
                    break;
                case 'qm':
                    compFilterMaps.push(new FilterMapping("PLAN_STATUS", "setPlanStatusCodes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PLAN_CLASS", "setPlanClassificationCodes", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'reh_prec':
                    compFilterMaps.push(new FilterMapping("PRECAUTION_ORDERS", "setOrders", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'resp-tmln':
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_1", "setTimelineCds1", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_2", "setTimelineCds2", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_3", "setTimelineCds3", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_4", "setTimelineCds4", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_5", "setTimelineCds5", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_6", "setTimelineCds6", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_7", "setTimelineCds7", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_8", "setTimelineCds8", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_9", "setTimelineCds9", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_10", "setTimelineCds10", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_11", "setTimelineCds11", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_12", "setTimelineCds12", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_13", "setTimelineCds13", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_14", "setTimelineCds14", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_SEQ_15", "setTimelineCds15", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPH_DEFAULTS", "setDefaultSelected", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'rt':
                    compFilterMaps.push(new FilterMapping("PREG_TIMELINE_LAB", "setResultLabs", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PREG_TIMELINE_US", "setResultUltrasounds", "Array", "PARENT_ENTITY_ID"));
                    break;
				case 'se':
					compFilterMaps.push(new FilterMapping("FLAG_DATE_FORMAT_IND","setIsDateWithinInd","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("FLAG_COM_FACEUP_IND","setFaceupCommentsDisplayEnabled","Boolean","FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("EVENT_CODES_IST_IND","setISTEventCodesMappedInd","Boolean","FREETEXT_DESC"));
                    break;
                case 'seo2':
                    compFilterMaps.push(new FilterMapping("SIG_EVENTS_SELECT_COND", "setEventFilters", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'soc':
                	compFilterMaps.push(new FilterMapping("SOC_CHART_LAUNCH_IND", "setIViewAdd", "Boolean", "FREETEXT_DESC"));
                	break;
                case 'ta':
		    compFilterMaps.push(new FilterMapping("OVERDUE_TASK_TYPES","setOverdueTaskTypeCodes","Array","PARENT_ENTITY_ID"));
             	    break;
                case 'tl':
                    compFilterMaps.push(new FilterMapping("ED_TIMELINE_IND", "setDisplayEnabled", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("ED_LAB_RAD_CAT_TYPE", "setLabRadCatalogTypes", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("ED_TIMELINE_ORDERS", "setDocCatalogCds", "Array", "PARENT_ENTITY_ID"));
                    break;
                case 'tmln':
                    compFilterMaps.push(new FilterMapping("GRAPHS_IND", "setDisplayEnabled", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("GRAPHS_SUB_CONTROLLER", "setMasterGraphTitle", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("GRAPHS_SUB_VS", "setVitalSignTitle", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_DEFAULTS", "setDefaultSelected", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_1", "setTimelineCds1", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_2", "setTimelineCds2", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_3", "setTimelineCds3", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_4", "setTimelineCds4", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_5", "setTimelineCds5", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_6", "setTimelineCds6", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_7", "setTimelineCds7", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_8", "setTimelineCds8", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_9", "setTimelineCds9", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("VS_GRAPH_SEQ_10", "setTimelineCds10", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPHS_SUB_BP", "setBloodPressureTitle", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("BP_GRAPH_SYS_INVASIVE", "setTimelineCds11", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("BP_GRAPH_DIAS_INVASIVE", "setTimelineCds12", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("BP_GRAPH_SYS_NONINVASIVE", "setTimelineCds13", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("BP_GRAPH_DIAS_NONINVASIVE", "setTimelineCds14", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("BP_GRAPH_MAP_INVASIVE", "setTimelineCds15", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("BP_GRAPH_MAP_CUFF", "setTimelineCds16", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("GRAPHS_SUB_VS_TABLE", "setTableGraphTitle", "String", "FREETEXT_DESC"));
                    break;
                case 'treat':
                    compFilterMaps.push(new FilterMapping("OT_TREAT_DOC", "setOTTreatments", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("PT_TREAT_DOC", "setPTTreatments", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("SLP_TREAT_DOC", "setSLPTreatments", "Array", "PARENT_ENTITY_ID"));
                    break;
                case  'vs':
                    compFilterMaps.push(new FilterMapping("VS_RESULTS_IND", "setShowTodayValue", "Boolean", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("VS_CHART_LAUNCH_IND", "setIViewAdd", "Boolean", "FREETEXT_DESC"));
                case  'wm':
                    compFilterMaps.push(new FilterMapping("WT_RESULTS_IND", "setShowTodayValue", "Boolean", "FREETEXT_DESC"));
                    break;
                case  'genscr':
                    compFilterMaps.push(new FilterMapping("PREG_GENETIC_SCR_PF", "setSelectedPowerform", "NUMBER", "PARENT_ENTITY_ID"));
                    break;
                case 'diab-graph':
					compFilterMaps.push(new FilterMapping("DMS_GRAPH_LOC","setGraphLocation","NUMBER","FREETEXT_DESC"));
					break;
                case 'cds':
                	// Clinical Decision Support Reference Links
					compFilterMaps.push(new FilterMapping("REFERENCE_NAME", "setReferenceName", "STRING", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("REFERENCE_LINK", "setReferenceLinks", "STRING", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("REFERENCE_DISPLAY", "setReferenceDisplay", "NUMBER", "FREETEXT_DESC"));
					// Clinical Decision Support MPage and Advisor Links
					compFilterMaps.push(new FilterMapping("MPAGE_NAME", "setMPageName", "STRING", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("MPAGE_LINK", "setMPageLinks", "STRING", "FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("MPAGE_DISPLAY", "setMPageDisplay", "NUMBER", "FREETEXT_DESC"));
					// Clinical Decision Support PowerForm Links
					compFilterMaps.push(new FilterMapping("FORMS_NAME", "setFormsName", "STRING", "FREETEXT_DESC"));
                    break;
				case 'vis':
		    		compFilterMaps.push(new FilterMapping("FUTURE_VISIT_MAX","setFutureMax","Number","FREETEXT_DESC"));
		    		compFilterMaps.push(new FilterMapping("PREVIOUS_VISIT_MAX","setPreviousMax","Number","FREETEXT_DESC"));
		    		break;
                case 'ct':
                    compFilterMaps.push(new FilterMapping("CLIN_TRIAL_THERAPEUTIC", "setTherapeuticInd", "String", "FREETEXT_DESC"));
                    break;
                case 'ctr':
                    compFilterMaps.push(new FilterMapping("CHEMO_RVW_PLAN_CLASS", "setPowerPlanClasses", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("CURRENT_SCROLL_IND", "setCurrentScrollInd", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("CURRENT_SCROLL_ROWS", "setCurrentScrollNum", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HIST_LOOK_BACK", "setHistoricalLookback", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HIST_EXP_COLLAPSE_IND", "setHistoricalOpen", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HIST_SCROLL_IND", "setHistoricalScrollInd", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("HIST_SCROLL_ROWS", "setHistoricalScrollNum", "String", "FREETEXT_DESC"));
                    compFilterMaps.push(new FilterMapping("RESPONSE_TREATMENT_IND", "setResponseInd", "String", "FREETEXT_DESC"));
                    break;
               case 'neotasks':
                    compFilterMaps.push(new FilterMapping("NEO_ID_BAND_NOMEN", "setIdBandNomens", "Nomen", "NOMEN"));
                    compFilterMaps.push(new FilterMapping("NEO_HEARING_SCR_NOMEN", "setHearingScrNomens", "Nomen", "NOMEN"));
                    compFilterMaps.push(new FilterMapping("NEO_CIRCUMCISION_NOMEN", "setCircumcisionNomens", "Nomen", "NOMEN"));
                    compFilterMaps.push(new FilterMapping("NEO_METABOLIC_SCR_NOMEN", "setMetabolicScrNomens", "Nomen", "NOMEN"));
                    compFilterMaps.push(new FilterMapping("NEO_OTHER_NB_TASKS_NOMEN", "setOtherNomens", "Nomen", "NOMEN"));
                    compFilterMaps.push(new FilterMapping("NEO_OTHER_NB_TASKS", "setOtherEvents", "Value_Seq", "VALUE_SEQ"));
                    break;
               case 'neooverview':
                    compFilterMaps.push(new FilterMapping("NEO_APGAR_1_MIN_COMP_SEQ", "setApgar1Seqs", "Value_Seq", "VALUE_SEQ"));
                    compFilterMaps.push(new FilterMapping("NEO_APGAR_5_MIN_COMP_SEQ", "setApgar5Seqs", "Value_Seq", "VALUE_SEQ"));
                    compFilterMaps.push(new FilterMapping("NEO_APGAR_10_MIN_COMP_SEQ", "setApgar10Seqs", "Value_Seq", "VALUE_SEQ"));
                    compFilterMaps.push(new FilterMapping("NEO_DELIVERY_INFO_SEQ", "setDeliveryInfoSeqs", "Value_Seq", "VALUE_SEQ"));
                    compFilterMaps.push(new FilterMapping("NEO_NEWBORN_INFO_SEQ", "setNewbornInfoSeqs", "Value_Seq", "VALUE_SEQ"));
                    compFilterMaps.push(new FilterMapping("NEO_MATERNAL_INFO_SEQ", "setMaternalInfoSeqs", "Value_Seq", "VALUE_SEQ"));
                    break;   
               case 'neoblood':
                    compFilterMaps.push(new FilterMapping("NEO_PHOTO_START_DT_TM_NOMEN", "setPhotoStartNomens", "Array", "PARENT_ENTITY_ID"));
                    compFilterMaps.push(new FilterMapping("NEO_PHOTO_STP_DT_TM_NOMEN", "setPhotoStopNomens", "Array", "PARENT_ENTITY_ID"));
                    break;
				case 'med-o2':
					compFilterMaps.push(new FilterMapping("WF_MEDS_SCHED", "setScheduled", "Boolean", "FREETEXT_DESC"));
				    compFilterMaps.push(new FilterMapping("WF_MEDS_PRN","setPRN","Boolean","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_DISC","setDiscontinued","Boolean","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_ADM","setAdministered","Boolean","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_SUS","setSuspended","Boolean","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_CONT","setContinuous","Boolean","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_ADM_LB_HRS","setAdministeredLookBkHrs","Number","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_DISC_LB_HRS","setDiscontinuedLookBkHr","Number","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_SCHED_NEXT_DOSE","setScheduleNextDose","Number","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_PRN_LAST_DOSE","setPRNLastDose","Number","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_SCHED_NEXT_12","setSchedNextTwelve","Number","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_PRN_LAST_48","setPRNLastFortyEight","Number","FREETEXT_DESC"));
					compFilterMaps.push(new FilterMapping("WF_MEDS_SCHED_OVERDUE","setSchedOverdue","Number","FREETEXT_DESC"));
				    break;
            }
            return BRCompPrefSetFuncCreation(compFilterMaps);
        }
    }
    //Page level filter mappings

}();

