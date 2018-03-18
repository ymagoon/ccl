
/* Topic: README FIRST

	Please copy <env.js> to your mpages folder and customize to your environment
	For best results include your customized env.js file before including this
	one.
*/
/* Topic: License
	The MIT License

	Copyright (c) 2010 University of New Mexico Hospitals

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
/*  */
if (typeof univnm === "undefined") {
	window.univnm ={};
}
univnm.jslib={};
if (typeof $env == "undefined") $env={};

/* Class: JSON
	A JSON implmentation for browsers that do not have a native JSON object

	Note:
		You should normally not use this directly, use univnm.jslib.jsonEncode
		and univnm.jslib.jsonDecode instead

	See:
	* http://www.JSON.org/json2.js



	2010-11-17
	Public Domain.
	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	See http://www.JSON.org/js.html
	*/
	if(!this.JSON){this.JSON={mode:"software"};}
	(function(){"use strict";function f(n){return n<10?'0'+n:n;}
	if(typeof Date.prototype.toJSON!=='function'){String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
	var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
	function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
	if(typeof rep==='function'){value=rep.call(holder,key,value);}
	switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
	gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
	v=partial.length===0?'[]':gap?'[\n'+gap+
	partial.join(',\n'+gap)+'\n'+
	mind+']':'['+partial.join(',')+']';gap=mind;return v;}
	if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
	v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
	mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
	if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
	rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
	return str('',{'':value});};}
	if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
	return reviver.call(holder,key,value);}
	text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
	('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
	if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
	throw new SyntaxError('JSON.parse');};}}());

/* Class:  jaaulde
	Javascript cookie mangement

	See:
	* http://code.google.com/p/cookies/

	Copyright (c) 2005 - 2010, James Auldridge
	All rights reserved.

	Licensed under the BSD, MIT, and GPL (your choice!) Licenses:
	http://code.google.com/p/cookies/wiki/License

	*/
	var jaaulde=window.jaaulde||{};jaaulde.utils=jaaulde.utils||{};jaaulde.utils.cookies=(function(){var resolveOptions,assembleOptionsString,parseCookies,constructor,defaultOptions={expiresAt:null,path:'/',domain:null,secure:false};resolveOptions=function(options){var returnValue,expireDate;if(typeof options!=='object'||options===null){returnValue=defaultOptions;}else
	{returnValue={expiresAt:defaultOptions.expiresAt,path:defaultOptions.path,domain:defaultOptions.domain,secure:defaultOptions.secure};if(typeof options.expiresAt==='object'&&options.expiresAt instanceof Date){returnValue.expiresAt=options.expiresAt;}else if(typeof options.hoursToLive==='number'&&options.hoursToLive!==0){expireDate=new Date();expireDate.setTime(expireDate.getTime()+(options.hoursToLive*60*60*1000));returnValue.expiresAt=expireDate;}if(typeof options.path==='string'&&options.path!==''){returnValue.path=options.path;}if(typeof options.domain==='string'&&options.domain!==''){returnValue.domain=options.domain;}if(options.secure===true){returnValue.secure=options.secure;}}return returnValue;};assembleOptionsString=function(options){options=resolveOptions(options);return((typeof options.expiresAt==='object'&&options.expiresAt instanceof Date?'; expires='+options.expiresAt.toGMTString():'')+'; path='+options.path+(typeof options.domain==='string'?'; domain='+options.domain:'')+(options.secure===true?'; secure':''));};parseCookies=function(){var cookies={},i,pair,name,value,separated=document.cookie.split(';'),unparsedValue;for(i=0;i<separated.length;i=i+1){pair=separated[i].split('=');name=pair[0].replace(/^\s*/,'').replace(/\s*$/,'');try
	{value=decodeURIComponent(pair[1]);}catch(e1){value=pair[1];}if(typeof JSON==='object'&&JSON!==null&&typeof JSON.parse==='function'){try
	{unparsedValue=value;value=JSON.parse(value);}catch(e2){value=unparsedValue;}}cookies[name]=value;}return cookies;};constructor=function(){};constructor.prototype.get=function(cookieName){var returnValue,item,cookies=parseCookies();if(typeof cookieName==='string'){returnValue=(typeof cookies[cookieName]!=='undefined')?cookies[cookieName]:null;}else if(typeof cookieName==='object'&&cookieName!==null){returnValue={};for(item in cookieName){if(typeof cookies[cookieName[item]]!=='undefined'){returnValue[cookieName[item]]=cookies[cookieName[item]];}else
	{returnValue[cookieName[item]]=null;}}}else
	{returnValue=cookies;}return returnValue;};constructor.prototype.filter=function(cookieNameRegExp){var cookieName,returnValue={},cookies=parseCookies();if(typeof cookieNameRegExp==='string'){cookieNameRegExp=new RegExp(cookieNameRegExp);}for(cookieName in cookies){if(cookieName.match(cookieNameRegExp)){returnValue[cookieName]=cookies[cookieName];}}return returnValue;};constructor.prototype.set=function(cookieName,value,options){if(typeof options!=='object'||options===null){options={};}if(typeof value==='undefined'||value===null){value='';options.hoursToLive=-8760;}else if(typeof value!=='string'){if(typeof JSON==='object'&&JSON!==null&&typeof JSON.stringify==='function'){value=JSON.stringify(value);}else
	{throw new Error('cookies.set() received non-string value and could not serialize.');}}var optionsString=assembleOptionsString(options);document.cookie=cookieName+'='+encodeURIComponent(value)+optionsString;};constructor.prototype.del=function(cookieName,options){var allCookies={},name;if(typeof options!=='object'||options===null){options={};}if(typeof cookieName==='boolean'&&cookieName===true){allCookies=this.get();}else if(typeof cookieName==='string'){allCookies[cookieName]=true;}for(name in allCookies){if(typeof name==='string'&&name!==''){this.set(name,null,options);}}};constructor.prototype.test=function(){var returnValue=false,testName='cT',testValue='data';this.set(testName,testValue);if(this.get(testName)===testValue){this.del(testName);returnValue=true;}return returnValue;};constructor.prototype.setOptions=function(options){if(typeof options!=='object'){options=null;}defaultOptions=resolveOptions(options);};return new constructor();})();(function(){if(window.jQuery){(function($){$.cookies=jaaulde.utils.cookies;var extensions={cookify:function(options){return this.each(function(){var i,nameAttrs=['name','id'],name,$this=$(this),value;for(i in nameAttrs){if(!isNaN(i)){name=$this.attr(nameAttrs[i]);if(typeof name==='string'&&name!==''){if($this.is(':checkbox, :radio')){if($this.attr('checked')){value=$this.val();}}else if($this.is(':input')){value=$this.val();}else
	{value=$this.html();}if(typeof value!=='string'||value===''){value=null;}$.cookies.set(name,value,options);break;}}}});},cookieFill:function(){return this.each(function(){var n,getN,nameAttrs=['name','id'],name,$this=$(this),value;getN=function(){n=nameAttrs.pop();return!!n;};while(getN()){name=$this.attr(n);if(typeof name==='string'&&name!==''){value=$.cookies.get(name);if(value!==null){if($this.is(':checkbox, :radio')){if($this.val()===value){$this.attr('checked','checked');}else
	{$this.removeAttr('checked');}}else if($this.is(':input')){$this.val(value);}else
	{$this.html(value);}}break;}}});},cookieBind:function(options){return this.each(function(){var $this=$(this);$this.cookieFill().change(function(){$this.cookify(options);});});}};$.each(extensions,function(i){$.fn[i]=this;});})(window.jQuery);}})();



/* Class: univnm.jslib
	A library of useful MPage related functions required by other UNM code
	libraries
*/
/* Function: univnm.jslib.debug_window
	Creates a new browser window and displays an interactive view of the
	supplied object

	Parameters:
		data	-	String or object to display
		title	-	title of the window


	Detail:
		if a window exists with _title_ it is reused, otherwise a new window is
		created. _data_ will be displayed at the top of the window with a hard
		rule <hr> underneath. The window gets a reference to the object to the
		displayed state of the object is its current state, and may not
		represent the state at the time of the call to debug_window
	*/
	univnm.jslib.debug_window = function debug_window(data,title){
		if (!data) alert("'data' parameter is required.\n\nStack:\n" + get_stack());
		if (!title) title="debug";

		title = title.replace(/\W+/g,"_").left(30);
		var win;
		var class_vars = arguments.callee;
		if (!arguments.callee.windows) arguments.callee.windows = {};
		var windows = arguments.callee.windows;

		if (windows[title] && !windows[title].closed){
			win = windows[title];
			win.focus();
		} else {
			win = windows[title] = window.open("",title,"width=800,height=600,scrollbars=1,resizable=1");
			win.document.write([
				'<html><body>',
					'<style>',
					'td{',
						'background-color:#CCCCFF;',
						'font-family:sans-serif;',
						'font-size:8pt;',
						'overflow:auto;',
					'}',
					'td.key{ ',
						'background-color:#6666FF;',
						'font-weight:bold;',
						'width:10%;',
						'padding-left:10px;',
						'padding-right:10px;',
						'cursor:pointer;',

					'}',
					'.object{',
						'background-color:#6666FF;',
						'border: 1px solid black;',
						'margin:5px;',
						'padding:2px;',
						'cursor:pointer;',
					'}',
					'</style>',
					'<script>',
						'function typeOf(element){',
							'var type= "other"',
							'try{',
								'type= typeof element;',
								'if (type=="object"&&element instanceof Array){',
									'type=="array"	',
								'}',
							'} catch(e){}',
							'return type;',
						'}',
						'var objects = new Array();',
						'function dump_object(o,parent_element){',
							'if (typeOf(o) == "object" || typeOf(o) == "array"){',
								'objects.push(o);',
								'var index = objects.length -1;',
								'var tbl = document.createElement("table");',
								'tbl.style.width="100%";',
								'parent_element.appendChild(tbl);',
								'parent_element.appendChild(document.createElement("hr"));',
								'var	keys = new Array();',
								'for (var x in o) {',
									'keys.push(x);',
								'}',
								'if (typeOf(o) == "array"){',
									'keys.sort(function (a,b){',
										'try {',
											'return a-b',
										'} catch (e){return 0}',
									'});',
								'} else {',
									'keys.sort();',
								'}',
								'for (x= 0;x < keys.length; ++x){',
									'var row =tbl.insertRow(tbl.rows.length);',
									'var cell = row.insertCell(row.cells.length);',
									'cell.innerHTML = keys[x];',
									'cell.className = "key";',

									'cell.onclick=function(){',
										'if (this.nextSibling.style.display=="none"){',
											'this.nextSibling.style.display="block"',
										'} else {',
											'this.nextSibling.style.display="none";',
										'}',
									'}',
									'var cell = row.insertCell(row.cells.length);',


									'try{',
										'var curObj =o[keys[x]];',
									'} catch(e){',
										'continue	',
									'}',
									'var type = typeOf(curObj);',
									'if (type == "object"){',
										'cell.appendChild(document.createElement("div"));',

										'cell.firstChild.innerHTML=(o instanceof Array?"ARRAY":"OBJECT") + "(click to expand)";',
										'cell.firstChild.className="object";',
										'cell.firstChild.style.display = "block";',
										'cell.firstChild.setAttribute("index",index);',
										'cell.firstChild.setAttribute("key",keys[x]);',
										'cell.firstChild.onclick=function(){',
											'this.style.display="none";',
											'dump_object(objects[this.getAttribute("index")][this.getAttribute("key")], this.parentNode);',
										'}',

									'} else {',
										'cell.appendChild(document.createElement("pre"));',
										'cell.firstChild.innerHTML = o[keys[x]];',
									'}',
								'}',

							'} else if (type=="function"){',
								'cell.appendChild(document.createElement("pre"));',
								'cell.firstChild.innerHTML = o[keys[x]].toSource().replace(/;/g,"\\;\\n\\t").replace(/\\{/g,"\\{\\n\\t\\t");',
							'}else {',
								'var text = document.createElement("pre");',
								'text.innerHTML = o.toString();',
								'parent_element.appendChild(text);',
								'parent_element.appendChild(document.createElement("hr"));',
							'}',
						'}',
					'<'+'/script>',
					'<div id="content" style="width:100%;"></div>',
				'</body></html>'
			].join("\n"));
		}

		var timer = window.setInterval(function(){
			if (win.dump_object){
				win.dump_object(data,win.document.getElementById("content"));
				win.document.title = title;
				window.clearInterval(timer);
			}
		},500);

	};
/* Function: univnm.jslib.fixCclJson
	returns _obj_ with every property converted to lowerCase, and
	unneeded top-level properties removed

	Parameters:
		obj			-  object to examine

	Detail:
		The CCL function CNVTRECTOJSON converts records into JSON with an
		unnecessary top-level property and with  uppercase properties which can
		affect readability and cause compatibility issues with libraries. This
		function returns a new object without the top level property and
		recursively renames all-upper-case properties to lowercase.

	Note:
		if _obj_ does not contain a single top-level uppercase property, then
		it will not be removed. It should be safe to call this function against
		objects that were not produced from CNVTRECTOJSON

	Example:
		An object like this:

		(code)
		{
			DATA:{
				DATA:[{
					MRN:"8621200",
					ACC:"00000XR20108000027",
					TYPE:"Chest 1 View",
					DATE_ORDERED:"2010-04-15 00:00:01",
					DATE_COMPLETED:"2010-04-15 00:00:01",
					STATUS:"Exam Completed"
				}],
				TOTALROWS:1
			}
		}
		(end)

		Will be converted to this:

		(code)
		{
			data:[{
				mrn:"8621200",
				acc:"00000XR20108000027",
				type:"Chest 1 View",
				date_ordered:"2010-04-15 00:00:01",
				date_completed:"2010-04-15 00:00:01",
				status:"Exam Completed"
			}],
			totalrows:1
		}
		(end)
	*/
	univnm.jslib.fixCclJson =function fixCclJson(obj){
		var copyProps = function(src){
			var dest ={};
			var i;
			var me = arguments.callee;

			if (src && typeof src == "object"){
				for (var p in src){
					me(src[p]);
					if (p == p.toUpperCase() && p != parseInt(p,10)){
						var newProp = p.toLowerCase();
						src[newProp] = src[p];
						delete src[p];
					}

				}
			}
			return src;

		};

		var props = univnm.ObjectLib.getProperties(obj);
		if (
			props.length ==1 &&
			props[0] == props[0].toUpperCase()
		){
			return copyProps(obj[props[0]]);
		} else {
			return copyProps(obj);
		}
	};
/* Function: univnm.jslib.getQuerystring
	returns values from the URL query string

	Parameters:
		key			-	Query variable to check
		_default	-	*Optional, default ""*
						value to return if the _key_ does not exist in the URL

	*/
	univnm.jslib.getQuerystring = function getQuerystring(key, default_){
		if (default_===null) default_="";
		key = key.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
		var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
		var qs = regex.exec(window.location.href.replace(/%26/g,"&"));
		if (qs === null) {
			return default_;
		} else {
			return qs[1];
		}
	};
/* Function: univnm.jslib.ccl_callback
	Uses XMLCclRequest to perform a a callback against a CCL script. This
	function is used internally by <ccl_proxy.js>, <ccl_direct_proxy.js> and
	<PCRemotingProvider.js>

	Parameters:
		options		-	A JS object containing the options to this callback.
						See below

	Options:
		Only _ccl_ is required. all other options have defaults defined in
		ccl_callback.defaults, see *Defaults* below


		ccl				-	*String*
							Name of the CCL script to execute.
		parameters		-	*Array, devault ["MINE"]*
							Parameters in the order required by the CCL script.
		async			-	*Boolean, default false*
							Should this call be asynchronous? If true,
							then _onsuccess_ will be called, otherwise
							the response will be returned immediately
		serviceUrl		-	*String, default undefined*
							Overrides value in <$env.serviceUrl> for this callback
		cclMask			-	*String, default undefined*
							Overrides value in <$env.cclMask> for this callback

		result_xml		-	*Boolean, default false*
							Should we return the result as XML?

		eval_result		-	*Boolean, default false*
							Should we evaluate the responseText as JSON?

		execute_result	-	*Boolean, default false*
							Should we execute the responseText as
							JavaScript?
		fail_on_string	-	*Boolean, default true*
							Only for when _eval_result_ == true. Fires
							failure event if eval result is a string.
							This is intended for catching error messages
							sent back from the server. Make sure to
							override this if a raw string is valid response
							for your callback
		onexception		-	*Function, default alert("exception: " + exception);*
							This is a function to be executed in case of client-side
							exception. The function will be passed the
							following parameters:
								* exception 	- 	The exception object
								* cclrequest	-	The XMLCclRequest
													Object
								* options		-	A reference to the
													options object for
													this callback


		onsuccess		-	*Function, default alert("success! " +value);*
							Called on successful callback when async == true
							and execute_result == false. The function will be
							passed the following parameters:
								* value		 	- 	the result of the callback. will be cclrequest.responseText
													or a JS object if eval_response==true
								* cclrequest	-	The XMLCclRequest
													Object
								* options		-	A reference to the
													options object for
													this callback



		onfailure		-	*Function, default alert(cclrequest.responseText);*
							This is a function to be executed in case of server-side
							exception. The function will be passed the following
							parameters:
								* cclrequest	-	The XMLCclRequest
													Object
								* options		-	A reference to the
													options object for
													this callback

		onbegin			-	*Function, default function(){}*
							Called before before data sent. Good for
							setting feedback, like displaying a loading
							screen.
							The function will be passed the following
							parameters:
								* cclrequest	-	The XMLCclRequest
													Object
								* options		-	A reference to the
													options object for
													this callback
		onend			-	*Function, default function(){}*
							Called after success, failure, or exception.
							Good for re-setting feedback, like hiding a
							loading screen
							The function will be passed the following
							parameters:
								* cclrequest	-	The XMLCclRequest
													Object
								* options		-	A reference to the
													options object for
													this callback

	Note:
		The _options_ object passed to the _on*_ event handlers will have an
		additional property, callback_id, which is a unique number set
		internally by ccl_callback for tracking callbacks. See *ccl_callback.history* below

	Properties:
		The ccl_callback function itself has global properties:

		ccl_callback.defaults	-	The default options object, see *Defaults* below.
									The default value for any _options_ property can be
									set by changinf the value of the property in
									ccl_callback.defaults. This is useful for globally
									overriding exception behavior
		ccl_callback.history	-	A <univnm.DataSet> that contains a row for each
									callback made. See *History Row Properties* below
									for details

	Defaults:
	(code)
	ccl_callback.defaults={
		ccl:"",
		parameters:["MINE"],
		url_parameters:"",
		url_prefix:"",
		async:false,
		result_xml:false,
		eval_result:false,
		fail_on_string:true,
		execute_result:false,
		historySize:100,
		// --------- callbacks ----------
		onexception:function (exception,cclrequest,options){
			alert("exception: " + exception);
		},
		onsuccess:function (value,cclrequest,options){
			alert("success! " +value);
		},
		onfailure:function (cclrequest,options){
			alert(xmlhttp.responseText);
		},
		onbegin:function(xmlhttp,options){

		},
		onend:function(xmlhttp,options){

		}

	}
	(end)

	History Row Properties:
		id				-	the callback_id of the callback
		ccl				-	The CCL called
		params			-	The parameters passed to the CCL
		responseText	-	If the callback completed, the responseText
		xhr				-	If the callback completed, XMLCCLRequest or XMLHTTPRequest object used
		options			-	The options object passed to ccl_callback
		started			-	JS Date when the callback started
		ended			-	JS Date when the callback ended
		elapsed			-	Elapsed milliseconds for the request

	EXAMPLES:
	(code)
		//set default error handler
		ccl_callback.defaults.onexception = function(exception,cclrequest,options){
			var title = "Callback Error in id: " + options.callback_id;

			univnm.jslib.debug_window(Error Detail:,title)
			univnm.jslib.debug_window(e,title)
			univnm.jslib.debug_window(Request Detail:,title)
			univnm.jslib.debug_window(req,title)
			univnm.jslib.debug_window(Options Detail:,title)
			univnm.jslib.debug_window(Options,title)
		}

		//Cause all scripts on this page to use an mpage service proxy
		univnm.jslib.ccl_callback.defaults.serviceUrl="/callback_proxy.cfm?domain=P126&ccl={ccl}&parameters={params}"



		//synchronous callback, returning JS object:
			var ids=univnm.jslib.ccl_callback({
				ccl:"shared_echo_ids",
				parameters:["MINE", "$USR_Personid$","$PAT_Personid$","$VIS_Encntrid$"],
				eval_result:true
			});
			univnm.jslib.debug_window(ids);

		//asynchronous callback, no JSON handling:
			univnm.jslib.ccl_callback({
				ccl:"shared_echo_ids",
				parameters:["MINE", "$USR_Personid$","$PAT_Personid$","$VIS_Encntrid$"],
				async:true,
				onsuccess:function (value){
					univnm.jslib.debug_window(value);
				}
			});

	(end)
	*/
	univnm.jslib.ccl_callback =function ccl_callback(option_override){
		var me = arguments.callee;
		var my = me;
		//apply default options
			var options = univnm.ObjectLib.setDefaultProperties(option_override,my.defaults);

		var collapseParams =function(){
			return options.parameters.map(function(arg){
				//fix for bizare handling of % in mpage service "get"s
				if (
					$env.mpageType == "external" &&
					typeof arg === "string" &&
					$env.serviceMethod != "POST"
				) {
					arg = arg.replace(/%/g,"%25");
				}
				if (typeof(arg) == 'string'){
					if (!/'/.test(arg)){
						return "'" + arg + "'";
					}else if (!/\^/.test(arg)){
						return '^' + arg +'^';
					} else if (!/"/.test(arg) && $env.mpageType != "external"){
						return '"' + arg +'"';
					}else{
						throw new Error("Unable to find a quote for " + arg);
					}
				} else {
					return arg;
				}
			}).join();
		};



		if (!("seqNum" in my)) my.seqNum=0;
		my.seqNum++;
		options.callback_id = my.seqNum +0;//force copy by value, just for safety

		if (!("history" in my)) my.history =[];
		if (my.history.length > my.defaults.historySize) my.history.shift();

		var myHistoryRow ={
			id:options.callback_id,
			ccl:univnm.jslib.applyCclMask(options.ccl,options.cclMask),
			params:collapseParams(),
			started:new Date(),
			ended:new Date(),
			elapsed:0,
			responseText:"",
			xhr:{},
			options:options
		};
		if (!("history" in my)) my.history =new univnm.DataSet({
			columns:univnm.ObjectLib.getKeys(myHistoryRow),
			data:[]
		});
		if (my.history.length > 100) my.history.shift();
		my.history.push(myHistoryRow);
		// Modify onbegin
			univnm.ObjectLib.before(options,"onbegin",function(xmlhttp,options){
				options.endFunction=$profiler.begin(
					"ccl_callback ({id}): {ccl} {params}".format({
						id:myHistoryRow.id,
						ccl:options.ccl,
						params:collapseParams()
					})
				);
			});
		// Modify onend
			univnm.ObjectLib.before(options,"onend",function(xmlhttp,options){
				options.endFunction();
				delete xmlhttp.onreadystatechange;

				if (typeof XMLCCLREQUESTOBJECTPOINTER =="object"){
					for (var id in XMLCCLREQUESTOBJECTPOINTER){
						if (XMLCCLREQUESTOBJECTPOINTER[id] === xmlhttp){
							delete XMLCCLREQUESTOBJECTPOINTER[id];
						}
					}
				}
				myHistoryRow.ended =new Date();
				myHistoryRow.elapsed =myHistoryRow.ended.getTime() - myHistoryRow.started.getTime();
				myHistoryRow.responseText=xmlhttp.responseText.trim().toFixedWidth(30," ","...");

			});

		if (!("cclMask" in $env)){
			$env.cclMask="{ccl}";
		}
		var
			http,
			url = univnm.jslib.applyCclMask(options.ccl,options.cclMask)
		;
		var xmlhttp;
		var method = ($env.serviceMethod || "GET").toUpperCase();
		if ($env.mpageType=="external"){
			url = ($env.serviceUrl||""),
			url = url.replace(
				/\{ccl\}/g,
				univnm.jslib.applyCclMask(options.ccl,options.cclMask)
			).replace(
				/\{params\}/g,
				collapseParams()
			);
			url = url.replace(/\+/g,"%2B");

			try {
				xmlhttp= new XMLHttpRequest();
			} catch (e) {
				try {
					xmlhttp= new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e){
						try {
							xmlhttp= window.createRequest();
						} catch (e) {
							alert("XMLHttpRequest is not supported by this browser.");
							return null;
						}
					}
				}
			}

		} else {
			xmlhttp = new XMLCclRequest();
		}
		if (options.async){
			xmlhttp.onreadystatechange=function (){
				if (xmlhttp.readyState==4) {
					options.onend(xmlhttp,options);
					var status=null;
					try{
						status = xmlhttp.status;
					} catch(e){
						options.onexception(e,xmlhttp,options);
					}

					if (status=="200" || status=="0"){
						if (options.eval_result){
							try {
								var text = xmlhttp.responseText.trim();
								var value = univnm.jslib.jsonDecode(xmlhttp.responseText.replace(/\\f/g, '').replace(/\\u000C/g, '')
									.replace(/_CARET_/g, "^").replace(/_DOLLA_/g, "$"));
								if (options.fail_on_string && typeof value == "string"  && value.length){
									options.onfailure(xmlhttp,options);
								} else{
									options.onsuccess(value, xmlhttp, options);
								}
							} catch(e){
								options.onexception(e,xmlhttp,options);
							}
						} else{
							if (options.execute_result){
								try {
									eval(xmlhttp.responseText.replace(/\\f/g, '').replace(/\\u000C/g, '')
									.replace(/_CARET_/g, "^").replace(/_DOLLA_/g, "$"));
								} catch(e){
									options.onexception(e,xmlhttp,options);
								}
							} else if (options.result_xml){
								options.onsuccess(xmlhttp.responseXML, xmlhttp, options);
							} else {
								try {
									options.onsuccess(xmlhttp.responseText, xmlhttp, options);

								} catch(e){
									options.onexception(e,xmlhttp,options);
								}
							}
						}
					}
					else{
						options.onfailure(xmlhttp,options);
					}
				}
				else{}
			};
		}
		myHistoryRow.xhr=xmlhttp;
		try {
			options.onbegin(xmlhttp,options);
			if (method == "POST" && $env.mpageType=="external"){
				var params = "parameters=" + encodeURIComponent(collapseParams());
				xmlhttp.open("POST", url, options.async);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlhttp.send(params);
			}else{
				xmlhttp.open("GET", url, options.async);
				xmlhttp.send(collapseParams());
			}

			if (!options.async){
				options.onend(xmlhttp,options);
				if (xmlhttp.readyState==4) {
					var status = xmlhttp.status;
					if (status=="200" || status=="0"){
						if (options.eval_result){
							var value = univnm.jslib.jsonDecode(xmlhttp.responseText.replace(/\\f/g, '').replace(/\\u000C/g, '')
									.replace(/_CARET_/g, "^").replace(/_DOLLA_/g, "$"));
							if (options.fail_on_string && typeof value == "string" && value.length){
								return options.onfailure(xmlhttp,options);
							} else{
								return value;
							}

						} else if (options.result_xml){
							return xmlhttp.responseXML;
						} else{
							return xmlhttp.responseText;
						}
					}
					else{
						return options.onfailure(xmlhttp,options);
					}
				}
				else{
					return options.onfailure(xmlhttp,options);
				}
			}
		} catch(e){

			options.onexception(e,xmlhttp,options);
		}
		return null;
	};
	univnm.jslib.ccl_callback.defaults={
		ccl:"",
		historySize:100,
		parameters:["MINE"],
		url_parameters:"",
		url_prefix:"",
		async:false,
		result_xml:false,
		eval_result:false,
		fail_on_string:true,
		execute_result:false,
		// --------- callbacks ----------
		onexception:function (exception,cclrequest,options){
			alert("exception: " + exception +":" +(exception.stack||""));
		},
		onsuccess:function (value,cclrequest,options){
			alert("success! " +value);
		},
		onfailure:function (cclrequest,options){
			alert("failure in " +options.ccl +": " + options.parameters +"\n"+ cclrequest.responseText);
		},
		onbegin:function(xmlhttp,options){

		},
		onend:function(xmlhttp,options){

		}
	};
/* Function: univnm.jslib.jsonDecode
	Decodes a JSON string into an object

	Parameters:
		str		-	string to decode
		reviver	-	*Optional, default null*
					reviver function. See
					https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/JSON/parse

	This function will try to use a native JSON object if available
	(IE8+, standards mode). Regardless, dates in the form of "/Date(time_in_ms)/"
	will be auto-converted into native date values. These date values are created
	automatically by <univnm.jslib.jsonEncode>. The resulting object is then
	run through <univnm.jslib.fixCclJson> and returned


	Example:
	(code)
		var obj = univnm.jslib.jsonDecode('{"name":"Joe Schmoe", "dob":"/Date(172130400000)/"}')
	(end)
	*/
	univnm.jslib.jsonDecode = function jsonDecode(str, reviver){
		if (typeof str != "string" || str.trim().length <2) return null;
		if (!reviver) reviver = function(k,v){return v;};
		var obj={};
		try{
			obj = JSON.parse(str,function(k, v) {
				var isJsonDate = typeof v == "string" && v.match(/\/Date\((\d+)\)\//);
				if (isJsonDate){
					return new window.Date(parseInt(isJsonDate[1],10));
				}
				return reviver(k,v);
			});
		}catch(e){
			console.log(e.stack);
			console.log("while decoding " + str);
			throw e;

		}

		return univnm.jslib.fixCclJson(obj);
	};
/* Function: univnm.jslib.jsonEncode
	Encodes an object into a JSON string

	Parameters:
		obj			-	object to encode
		replacer	-	*Optional, default null*
						Replacer function. See
						https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/JSON/stringify
		indent		-	*Optional, default null*
						Controls "pretty printing". See
						https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/JSON/stringify

	This function will try to use a native JSON object if available
	(IE8+, standards mode). Regardless, dates will be encoded into the resulting
	JSON string in the form of "/Date(time_in_ms)/". These date values are parsed
	automatically by <univnm.jslib.jsonDecode>.


	Example:
	(code)
		var json = univnm.jslib.jsonEncode({
			name:"Joe Schmoe",
			dob:Date.parseDate("02/16/1973","m/d/Y")
		})
	(end)
	*/
	univnm.jslib.jsonEncode = function jsonDecode(str,replacer,indent){
		//var used = [];
		if (!replacer) replacer= function(k,v){return v;};
		return JSON.stringify(str,function(k, v) {
			// if (used.indexOf(v) > -1 && typeof v == "object") {
			// 	return "max recursion";
			// }
			// used.push(v);
			if (v && v instanceof Date){
				return "/Date({0})/".format(v.getTime());
			}
			return replacer(k,v);
		},indent);
	};
/* Function: univnm.jslib.load_mpage_ids
	loads mpage variables into the global scope

	Loads the following variables in the univnm scope:
		user_id			-	The id of the logged in user
		patient_id		-	The id of the current patient
		encounter_id	-	The id of the current encounter
		cur_node		-	Script node server name
		cur_user		-	Script User Name
		cur_server		-	SCP server number (e.g. 79)
		full_name		-	Lastname, Firstname of current user

	The source of these variables is searched in the following order:
		local	-	If load_mpage_ids has already been called on this page,
					those values are returned
		url		-	if "patient_id" "user_id" or "encounter_id" are defined in
					the URL, they will be used
		CCL		-	if <$env.mpageType> is "org" or "chart" then a CCL callback
					to univnm_echo_ids is made to extract the available ids for
					that type
		cookie	-	if none of the above options are available, but the values
					exist in a cookie set by a call to load_mpage_ids in a
					parent page, those values will be used
		dummy	-	if no other source is available, values of 100 will be used
					for each variable

	EXAMPLE:
	(code)
		window.onload=function(){
			load_mpage_ids();
		}
	(end)

	Note:
		This function depends on a CCL program called "univnm_echo_ids". A copy
		of this file is included in the "shared/univnm" directory

	*/
	univnm.jslib.load_mpage_ids = function load_mpage_ids(){
		var varnames=["user_id","patient_id","encounter_id","cur_node","cur_user","cur_server","full_name"];
		var remotenames=["cur_node","cur_user","cur_server","full_name"];
		var persist = function(){
			varnames.filter(function(nme){
				return "patient_id,encounter_id".listContains(name);
			}).forEach(function(name){
				jaaulde.utils.cookies.set(name,univnm[name]);
			});
			univnm.person_id = univnm.patient_id;
			jaaulde.utils.cookies.set("person_id",univnm.person_id);
			$env._ids_loaded = true;
		};
		if ($env._ids_loaded) {
			//alert("loaded")
			return;
		}
		//check CCL
			var o ={
				ccl:"univnm_echo_ids",
				async:false,
				eval_result:true,
				onfailure:function(){},
				onexception:function(){}
			};
			var ids;
			switch($env.mpageType){
				case "org":
					o.parameters=["MINE",parseInt(univnm.jslib.getQuerystring("user_id",0),10) || "$USR_Personid$",0,0];
					break;
				case "chart":
					o.parameters=["MINE",parseInt(univnm.jslib.getQuerystring("user_id",0),10) || "$USR_Personid$","$PAT_Personid$","$VIS_Encntrid$"];
					break;
				case "external":
					o.parameters=["MINE",parseInt(univnm.jslib.getQuerystring("user_id",0),10),0,0];
					break;
			}
			try{
			//univnm.jslib.debug_window(o)
				ids=univnm.jslib.ccl_callback(o);
				//univnm.jslib.debug_window(ids)
				univnm.ObjectLib
					.getKeys(ids)
					.filter(function(k){ //remove zeroes
						return ids[k] !== 0;
					})
					.forEach(function(k){
						var v = ids[k];
						if (v == parseInt(v,10)){
							univnm[k] = parseInt(v,10);
						} else {
							univnm[k] = v;
						}
					});
			}catch(e){
				//ignore this if it is not working
			}


		//check URL & cookie
			var foundValuesInUrl=false;
			varnames.forEach(function(name){
				//URL always wins

				if (univnm.jslib.getQuerystring(name,false)){
					univnm[name]=parseInt(univnm.jslib.getQuerystring(name),10);
				} else if (!(name in univnm)){
					if (jaaulde.utils.cookies.get(name)){
						univnm[name]=parseInt(jaaulde.utils.cookies.get(name),10);
					} else univnm[name]=100;
				}
			});
			if ("patient_id" in univnm) univnm.person_id = univnm.patient_id;
			if ("person_id" in univnm) univnm.patient_id = univnm.person_id;

		return persist();
	};
/* Function: univnm.jslib.loadScript
	loads a JS file and executes a callback when done

	Parameters:
		url				-	URL or Array of Urls of JS source file(s) to include
		callback		-	*Optional, default function(){}*
							function to call after script is loaded.
		allowDuplicate	-	*Optional, default false*
							if false, the URL will not be loaded if it has been
							loaded previously. This makes sense for libraries.
							If true, then a unique value is added to the url to
							prevent caching. This makes sense for a JSONP call

	Example:
	(code)
		function buildEntryStore(){
			window.entryStore = new univnm.QueryStore({
				sql:[
					'select *',
					'from cust_entries',
					'where person_id ={user_id}',
				''].join("\n"),
				extraParams:univnm
			})

		}
		if (!univnm.ext.QueryStore){
			univnm.jslib.loadScript(
				"../shared/univnm/ext/QueryStore.js",
				buildEntryStore
			)
		} else buildEntryStore();
	(end)

	See Also:
		*	JSONP: http://stackoverflow.com/questions/2067472/please-explain-jsonp
	*/
	univnm.jslib.loadScript =function loadScript(url,callback,allowDuplicate){
		if (url instanceof Array){
			var load = function (){
				if (!url.length) return callback();
				return loadScript(url.shift(),load,allowDuplicate);
			};
			return load();
		}
		var my = arguments.callee;
		if (!callback) callback = function(){};
		if (!("srcCache" in my)) my.srcCache = {};
		if (!allowDuplicate && (url in my.srcCache)) return callback();


		var head= document.getElementsByTagName('head')[0];

		var script= document.createElement('script');
		script.type= 'text/javascript';
		if (allowDuplicate){
			var cacheBuster = new Date().getTime();
			script.src= url + (/\?/.test(url)?"&":"?") +"cacheBuster="+cacheBuster;
		} else {
			script.src= url;
			my.srcCache[url] = true;
		}

		var p1= $profiler.begin("loadScript: " + url);
		script.onload = function() {
			if ( ! script.onloadDone ) {
				script.onloadDone = true;
				p1();
				callback();
			}
		};
		script.onreadystatechange = function() {
			if (
				( "loaded" === script.readyState || "complete" === script.readyState) &&
				! script.onloadDone
			) {
				script.onloadDone = true;
				callback();
			}
		};
		head.insertBefore( script, head.firstChild );
	};
/* Function: univnm.jslib.loadCss
	loads one or more CSS files

	Parameters:
		url				-	URL of CSS source file to include, or array of urls
							If array, all urls will be loaded before calling _callback_
		callback		-	*Optional, default function(){}*
							function to call after script is loaded.
	*/
	univnm.jslib.loadCss =function loadCss(url){
		if (!url) return;
		if (url instanceof Array){
			return url.forEach(function(url){
				loadCss(url);
			});
		}

		var my = arguments.callee;
		if (!("srcCache" in my)) my.srcCache = {};
		if ( (url in my.srcCache)) return;

		var head= document.getElementsByTagName('head')[0];

		var link= document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = url;
		link.media = 'all';
		my.srcCache[url] = true;
		var p1= $profiler.begin("loadCss " + url);
		head.appendChild( link);

	};
/* Function: univnm.jslib.MD5
	(Message-Digest Algorithm) http://www.webtoolkit.info/

	Parameters:
	string	-	string to hash

	Returns MD5 hash of _string_
	*/
	univnm.jslib.MD5 = function MD5(string) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		}

		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		}

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

		return temp.toLowerCase();
	};
/* Function: univnm.jslib.namespace
	returns a reference to the supplied namespace, creating it if necessary

	Parameters:
		name		-	String in the form of "base.sub.sub"


	Example:
	(code)
		univnm.jslib.namespace("pcch.libs.Custom").value1 = "woot!";

		// pcch.libs.Custom is guranteed to exist  now
		// because of the namespace() call
		pcch.libs.Custom.value2 ="righteous!";

	(end)
	*/
	univnm.jslib.namespace=function(name){
		var parts =name.split(".");
		var result = window;
		while (parts.length){
			var part = parts.shift();
			result = result[part] = result[part] || {};
		}
		return result;
	};

/* Function: univnm.jslib.applyCclMask
	applies the $env.cclMask template to a string

	Parameters:
		ccl 		-	name of CCL to wrap in the masking template
		mask		-	*optional, default $env.cclMask*
						mask to apply, overriding global cclMask


	Example:
	(code)
		$env.cclMask = "1_{ccl}_b"

		alert(univnm.jslib.applyCclMask("univnm_echo_ids"))
		// alerts "1_univnm_echo_ids_b"
	(end)
	*/
	univnm.jslib.applyCclMask = function applyCclMask(ccl,mask){
		var cclMask = mask||$env.cclMask||"{ccl}";

		return cclMask.replace(/\{ccl\}/g,ccl);
	};
/* Class: univnm.ObjectLib
	Additional object related functions


	*/
	univnm.ObjectLib = {};
	/* Function: $O
		wraps an object with the univnm.ObjectLib functions.

		Parameters:
		obj	-	object to wrap

		returns _obj_ with all functions in univnm.ObjectLib attached, with _object_ as the target


		Example:

		(code)
			var thing={
				name:"thing",
				purpose"do Stuff!"
			}

			//via univnm.ObjectLib
			univnm.ObjectLib.setDefaultProperties(thing,{
				newProp:"I'm a new property"
			})

			//via $O
			$O(thing).setDefaultProperties({
				newProp2:"another new prop"
			})

		(end)

		*/
		if (typeof $O == "undefined"){
			function $O(obj){
				function buildFunction(prop){
					return function(){
						var args = Array.parse(arguments);
						args.unshift(this);
						return univnm.ObjectLib[prop].apply(this,args);
					};
				}
				for (var prop in univnm.ObjectLib){
					obj[prop] = buildFunction(prop);
				}

				return obj;
			}
		}
	/* Function: before
		Prepends supplied function to the event chain of an object.

		Parameters:
			obj				- object to apply to
			functionName 	- name of the function on an object to modify
			functionObj		- function object to append



		Detail:
			Existing functions are preserved and executed after the supplied function.
			This is a shortcut for creating chain functions and is the equivalent of
			(code)
			obj[functionName] = obj[functionName].before(functionObj)
			(end)
			See <Function.createChainFunction> for how chain functions work.

		Examples:
		(code)
			var obj={
				stuff:function (text){
					console.log("in orig")
					return text + " " + this.myVal;
				},
				myVal:"firstObj"
			}

			var obj2={
				myVal:"secondObj"
			}


			univnm.ObjectLib.before(obj,"stuff",function(text){
				var chain = arguments.callee.chain;
				console.log("in before")
				chain.args[0] = "before " + text
				if (text == "dude!"){
					// exit now with this return value, nothing after will be executed
					chain.exit("sweet!")
				}

			})

			univnm.ObjectLib.after(obj,"stuff",function(text){
				var chain = arguments.callee.chain;
				console.log("in after")
				return chain.lastReturn + " after "
			})

			console.log(obj.stuff("woot!") +"<hr>");
			console.log(obj.stuff("dude!") +"<hr>");

			obj2.stuff = obj.stuff;
			console.log(obj2.stuff("woot!") +"<hr>");

		(end)
		*/
		univnm.ObjectLib.before=function( obj, functionName, functionObj){
			var $this = obj;
			//does the function exist?
			if (functionName in $this) {
				//is the function a chain header?
				if (!("chainArray" in $this[functionName])){
					var originalFunction =$this[functionName];
					$this[functionName]=Function.createChainFunction([$this[functionName]]);
					$O(originalFunction).applyTo($this[functionName]);
				}
			} else {
				$this[functionName]=Function.createChainFunction();
			}
			if("chainArray" in functionObj){
				$this[functionName].chainArray=
					functionObj.chainArray.concat($this[functionName].chainArray);
			} else {
				$this[functionName].chainArray.unshift(functionObj);
			}
		};
	/* Function: after
		Appends supplied function to the event chain of an object.

		Parameters:
			obj				- object to apply to
			functionName 	- name of the function on an object to modify
			functionObj		- function object to append



			Detail:
			Existing functions are preserved and executed after the supplied function.
			This is a shortcut for creating chain functions and is the equivalent of
			(code)
			obj[functionName] = obj[functionName].before(functionObj)
			(end)
			See <Function.createChainFunction> for how chain functions work.

		Examples:
		*	see <before>

		(end)
		*/
		univnm.ObjectLib.after=function( obj, functionName, functionObj){
			if (!functionObj) functionObj=function(){};
			var $this = obj;

			//does the function exist?
			if (functionName in $this) {
				//is the function a chain header?
				if (!("chainArray" in $this[functionName])){
					var originalFunction =$this[functionName];
					$this[functionName]=Function.createChainFunction([$this[functionName]]);
					originalFunction.applyTo($this[functionName]);
				}
			} else {
				$this[functionName]=Function.createChainFunction();
			}
			if("chainArray" in functionObj){
				$this[functionName].chainArray=
					$this[functionName].chainArray.concat(functionObj.chainArray);
			} else {
				$this[functionName].chainArray.push(functionObj);
			}
		};

	/* Function: appendFunction
		alias for <after>
		*/
		univnm.ObjectLib.appendFunction=univnm.ObjectLib.after;
	/* Function: applyTo
		Copies all properties (including Function properties and "hidden") of an object to another

		Parameters:
			obj					-	object to copy from
			target				-	object to copy to
			shouldOverwrite 	- 	*Optional, default false* Should existing properties in
									_target_ be replaced by the properties in _source_?

		Returns:
			_target_

		Detail:
			This can be used for copying the properties of an object to a local
			scope by applying to 'this', or simulating inheritance (even multiple
			inheritance) on instantiated objects by copying the properties of
			another object

		Examples:
			(code)
				// Make Myna's functions such as abort() and dump() available
				// without the Myna prefix
				univnm.ObjectLib.applyTo(Myna,this);

			(end)
		*/
		univnm.ObjectLib.applyTo=function(obj,target,shouldOverwrite){

			if (shouldOverwrite === undefined) shouldOverwrite=false;
			for (var x in obj) {
				if (shouldOverwrite || target[x] === undefined){
					try {//sometimes this fails, for instance if "key" is readonly
						target[x] = obj[x];
					} catch(e){}
				}
			}
			return target;
		};

	/* Function: getKeys
		returns a list of non-function properties in an object by order of appearance

		Parameters:
			obj 	-	 object to examine

		Returns:
			An alphabetized array of properties in an object

		*/
		univnm.ObjectLib.getKeys = function(obj){
			var result=[];
			var isXml = typeof obj ==="xml";

			try {
			for (var x in obj){
			if (isXml && x != parseFloat(x)) continue;
				if (typeof x === "string"){
					try{ //ie doesn't like you looking at certain things (like in window)
						if (obj[x] instanceof Function || typeof obj[x] == "function") continue;
					} catch (e) {continue;}
					result.push(x);
				}
			}
			} catch (e) {return [];}
			return result;
		};
	/* Function: getProperties
		returns an alphabetized list of all properties in an object

		Parameters:
			obj 	-	 object to examine

		Returns:
			An alphabetized array of properties in an object

		*/
		univnm.ObjectLib.getProperties = function(obj){
			var result=[];
			try {
			for (var x in obj){
				if (typeof x === "string"){
					result.push(x);
				}
			}
			} catch (e) {return [];}
			return result.sort(function(left,right) {
				try { //ie also freaks out over the sort for some reason
					left=left.toLowerCase();
					right=right.toLowerCase();
					if (left > right) return 1;
					if (left < right) return -1;
					return 0;
				} catch(e){return 0;}
			});
		};
	/* Function: checkRequired
		Ensures that certain properties defined.

		Parameters:
			obj			-	object to examine
			required 	- 	Array of property name strings to look for

		Returns:
			void

		Detail:
			This function is intended for Javascript Objects being used as data containers.
			Particularly JS objects passed as function parameters.

			This function simply checks to see if every string in the _required_ array has
			a corresponding property in an object. The first time a property is not found, an
			exception is raised.

		*/
		univnm.ObjectLib.checkRequired=function (obj,required){
			required.forEach(function(key){
				if (obj[key] === undefined) {
					var msg = "Required property '" + key +"' undefined";
						msg+= " in " + univnm.ObjectLib.toJson(obj);
					throw new Error (msg);
				}
			});
		};

	/* Function: toJson
		Converts the supplied object to JSON (http://www.json.org)

		Shortcut to <univnm.jslib.jsonEncode>

		Parameters:
			obj	-	 object to convert

		Returns:
			JSON string that represents _obj_
		*/
		univnm.ObjectLib.toJson=function(obj) {
			return univnm.jslib.jsonEncode(obj);
		};
	/* Function: toStruct
		returns a copy of an object with all the function properties removed

		Parameters:
			object 	-	object to inspect

		*/
		univnm.ObjectLib.toStruct=function( obj){
			var $this = obj;
			var result ={};
			for (var prop in $this){
				if (typeof $this[prop] != "function") {
					result[prop] = $this[prop];
				}
			}
			return result;
		};

	/* Function: setByPath
		sets a property or nested object property of this object

		Parameters:
			obj				- 	object to apply to
			path				-	dot separated path to the property to set
			value				-	value to set


		Returns:
			_obj_

		Detail:
			Often times it is convenient to store key value pairs as a dot separated
			path and a value, especially in HTML forms which do not support structured
			parameters like so:

			> <input name="Users.336642.firstName" value = "Mark">

			Calling this function against an object will walk the nested object tree,
			creating objects as necessary, until the final property is set to the value


		Example:
			(code)
				var result = univnm.ObjectLib.setByPath({},"Users.336642.firstName","Mark")
				univnm.ObjectLib.setByPath(result,"Users.536642.firstName","Bob")
				// result Equals
				// {
				// 	Users:{
				// 		"336642":{
				// 			firstName:"Mark"
				// 		},
				// 		"536642":{
				// 			firstName:"Bob"
				// 		},
				// 	}
				// }

				// the * means append otherwise the array index is used even if out of order
				var result = {}
				univnm.ObjectLib.setByPath(result,"Users[*].firstName","Mark")
				univnm.ObjectLib.setByPath(result,"Users[0].firstName","Bob")
				// result Equals
				// {
				// 	Users:[
				//		{
				// 			firstName:"Bob"
				// 		},
				// 		{
				// 			firstName:"Mark"
				// 		}
				//	]
				// }

			(end)

		Note:
			This function is applied automatically against $req.data for params that
			contain periods

		*/
		univnm.ObjectLib.setByPath=function (obj,path,value){
			if (!path.listLen(".")){
				obj[path] = value;
			} else {
				var parts = path.split(".");
				var lastProp = parts.pop();

				var target=parts.reduce(function(obj,prop){
					//console.log(prop)
					if (/\[[\d|*]+\]/.test(prop)){
						var match = prop.match(/(.*?)\[(.*?)\]/);
						var arrayProp = match[1], index=match[2];
						if (!(arrayProp in obj)) obj[arrayProp] = [];
						obj = obj[arrayProp];
						if (index == "*") {
							prop = obj.length;
						} else {
							prop = parseInt(index,10);
						}
					}
					return obj[prop] || (obj[prop] ={});
				},obj);

				if (/\[[\d|*]+\]/.test(lastProp)){
					var match = lastProp.match(/(.*?)\[(.*?)\]/);
					var arrayProp = match[1], index=match[2];
					if (!(arrayProp in target)) target[arrayProp] = [];
					target = target[arrayProp];
					if (index == "*") {
						lastProp = target.length;
					} else {
						lastProp = parseInt(index,10);
					}
				}
				target[lastProp] =value;
			}
			return obj;
		};
	/* Function: setDefaultProperties
		sets default properties on an object

		Parameters:
			obj				- 	object to apply to
			defaults		- 	Object that represents the default properties
			looseMatch	-	If true, consider "null" values and 0 length strings to be
								the same as undefined. By default, only strictly undefined
								properties are overwritten by their _defaults_.


		Returns:
			_obj_

		Detail:
			Every property in _defaults_ is checked against this. If the
			property is undefined in this, it is copied from _defaults_.

		Example:
			(code)
			$res.data.setDefaultProperties({
				name:"bob",
				isDeceased:false
			});

			(end)

		*/
		univnm.ObjectLib.setDefaultProperties=function (obj,defaults,looseMatch){
			for (var key in defaults) {
				if (obj[key] === undefined ||
					looseMatch && (
						obj[key] === null
						|| obj[key] === ""
					)
				) {
					try {//sometimes this fails, for instance if "key" is readonly
						obj[key] = defaults[key];
					} catch(e){}
				}
			}
			return obj
		}



	/* Function: forEach
		loops over each non-function property of an object an executes the
		supplied function against it.

		Parameters:
			obj			-	Object to loop over
			func 		-	Function to execute. See below for the parameters it will
							be passed

		Callback Parameters:
			element		-	the value of property
			name		-	the name of the property
			index		-	ordinal of this element
			object		-	a reference to an object



		Detail:
			This function is modeled after the JS function <Array.forEach>.

		Example:
			(code)
			var emp ={
				id:12,
				name:"Bob"
				occupation:"being awsome",
				isDeceased:false
			}

			univnm.ObjectLib.forEach(emp,function(element,name,object){
				alert(name + ": " + element +"<br>");
			})
			(end)

		*/
		univnm.ObjectLib.forEach=function (obj,func){
			univnm.ObjectLib.getKeys(obj).forEach(function (key,i){
				func(obj[key],key,i,obj);
			})
		}
	/* Function: map
		returns new Object with the results of calling a provided function on every
		non-function element in _obj_.

		Parameters:
			obj		-	Object to loop over
			func 		-	Function to execute. See below for the parameters it will
							be passed

		Callback Parameters:
			element		-	the value of property
			name			-	the name of the property
			index		-	ordinal of this element
			object		-	a reference to this object



		Detail:
			This function is modeled after the JS function <Array.map>.

		Example:
			(code)
			//make sure null values come across as empty strings
			var emp = {
				id:12,
				name:"Bob",
				age:null,
				occupation:"being awesome",
				isDeceased:false
			}

			var fixedEmp = univnm.ObjectLib.map(emp,function(element,name,object){
				if (element === null) {
					return ""
				} else {
					return element
				}
			})

			(end)

		*/
		univnm.ObjectLib.map=function (obj,func){
			var newObj =$O({})
			univnm.ObjectLib.getKeys(obj).forEach(function (key,i){
				newObj[key] =func(obj[key],key,i,obj);
			})
			return newObj
		}
	/* Function: filter
		returns new Object with only the key/values from _obj_ object that pass a test function

		Parameters:
			obj		-	Object to loop over
			func 		-	Function to execute. return true to include this key/value
							See below for the parameters it will be passed

		Callback Parameters:
			element		-	the value of property
			name			-	the name of the property
			index		-	ordinal of this element
			object		-	a reference to this object



		Detail:
			This function is modeled after the JS function <Array.filter>.

		Example:
			(code)
			// remove null values
			var emp = {
				id:12,
				name:"Bob",
				age:null,
				occupation:"being awesome",
				isDeceased:false
			}

			var fixedEmp = univnm.ObjectLib.filter(emp,function(element,name,object){
				return element !== null
			})

			(end)

		*/
		univnm.ObjectLib.filter=function (obj,func){
			var newObj =$O({})
			univnm.ObjectLib.getKeys(obj)
			.filter(function(key,i){
				return func(obj[key],key,i,obj)
			})
			.forEach(function (key){
				newObj[key] =obj[key];
			})
			return newObj
		}
	/* Function: toArray
		returns an Array of objects with a "key" property and a "value" property
		mapping to the  keys and values of this object

		Parameters:
			obj					-	Object to loop over
			includeFunctions	- *Optional, default false*
										By default only properties that are not functions are
										mapped. Set this to true to include functions
			localOnly			-	*Optional, default false*
										By default both local and prototype properties are
										mapped, set this to true limit to only local
										properties


		Note:
			if <univnm.DataSet> is available, then a univnm.DataSet is returned, which allows
			recreating the object via result.toMap("key","value")

		Example:
			(code)
			var obj = {first_name:"Bob",last_name:"Dobb"}
			var array = univnm.ObjectLib.toArray(obj)
			//returns [{key:"first_name",value:"Bob"},{key:"lasst_name",value:"Dobb"}]


			(end)

		*/
		univnm.ObjectLib.toArray=function (obj,includeFunctions,localOnly){
			var result =[]
			result.columns = []

			for (var p in obj){
				if (!localOnly || obj.hasOwnProperty(p)){
					var value,d;
					if ("getOwnPropertyDescriptor" in Object){
						try{
							d =Object.getOwnPropertyDescriptor(obj,p)
							value=("get" in d)?d.get:d.value;
						} catch(e){
							value = obj[p]
						}
					}else{
						value = obj[p]
					}
					if (includeFunctions || typeof value != "function"){
						result.columns.push(p)
						result.push({
							key:p,
							value:value
						})
					}
				}
			}
			return (typeof Myna != "undefined" && typeof univnm.DataSet != "undefined")
				? new univnm.DataSet(result)
				: result
		}
	/* Function: typeOf
		an enhanced replacement of the the Javscript builtin typeof function.

		Parameters:
			object 	-	object to inspect

		Returns:
			a string representing the type of the object

		Detail:
			The builtin JavaScript typeof function does not identify some stamndard objects,
			specifically Arrays, Dates, and Nulls. When running in ObjectLib, it is also important to
			know when the object is a Java object. This function returns the standard typeof
			strings as well as the following:

			* null
			* array
			* class
			* date

		*/
		univnm.ObjectLib.typeOf=function(object) {
			var s = typeof object;
			if (s === 'object') {
				if (object) {
					if (object instanceof String){
						return 'string';
					} else if (typeof object["length"] === 'number' &&
							/* !(object.propertyIsEnumerable('length')) && */
							typeof object.splice === 'function') {
						return 'array';
					} else if (object instanceof Date){
						return 'date';
					} else if (typeof object["getClass"] =="function" && String(object) != "[object Object]") {
						return 'class';
					}
				} else {
					return 'null';
				}
			}

			return s;
		}

/* Class: univnm.DataSet
	A normalized data structure for working with tabular data
	*/
	/* Constructor: univnm.DataSet
		Creates a new univnm.DataSet Object

		Parameters:
			options		-	Either an array to be converted to a univnm.DataSet, or and
								object containing detailed options. If an array, the array
								must contain at least one record, and the record should
								have all the non-function properties expected in the
								univnm.DataSet so that <univnm.DataSet.columns> can be inferred. If this
								is an object it should conform to the Options Object
								defined below.

		Options Object:
			data		-	*Optional default []*
							This is an array of initial data. May be empty.
			columns		-	*Optional default []*
							Either a comma separated list, an array of column names, or
							an object whose non-function properties represent the column
							names. These define the known properties of the objects in a
							univnm.DataSet array. If _columns_ is not provided, but _data_
							contains at least one row, _columns_ will be calculated as all
							the non-function properties of the first row.
		Detail:
			univnm.DataSet is a wrapper for an array of objects. This is treated much like the result set
			of a query, but does not need to come from a query. univnm.DataSet's provide a
			normalized way to represent any tabular data
		*/
		univnm.DataSet =function (options){
			if (!options) return univnm.ObjectLib.applyTo(this,[],true)

			var ds
			if (this == window) throw new SyntaxError("DataSet is an object contructor. Please use the  'new' operator");

			if (options instanceof Array){
				//shallowly copies the data on to this object
				univnm.ObjectLib.applyTo(this,options,true)
				ds = options

				if (options.length) ds.columns = univnm.ObjectLib.getKeys(ds[0]);

			} else if (options instanceof Object){
				/* initial data */
					if (options.data instanceof Array){
						ds = options.data
					} else {
						ds=[]
					}
					univnm.ObjectLib.applyTo(this,ds,true)
				/* columns */
					if (typeof options.columns =="string"){
						ds.columns = options.columns.split(/,/)
					} else if (options.columns instanceof Array){
						ds.columns = univnm.ObjectLib.applyTo(options.columns,[]);

					} else if (options.columns instanceof Object){
						ds.columns = univnm.ObjectLib.getKeys(options.columns);
					}

				/* loader */
					if (options.loader instanceof Function){
						ds.loader = options.loader;
					}
			}
			return ds;
		}
		univnm.DataSet.prototype.columns = [];
		univnm.DataSet.prototype.load = function(options){
			if (this.loader){
				options = options||{}
				options.maxRows = options.maxRows;
				options.startRow = options.startRow||1;
				this.length=0;
				var ds = this;
				this.loader(options).forEach(function(e){
					ds.push(e);
				})
			}

			return this;
		};
	/* Property: array
		This is the underlying array for this DataSet
	*/
	/* Function: collapse
		returns a new dataSet where columns are collapsed into arrays, based on
		one or more partition column

		Parameters:
			partitionColumns	-	Array of column names, in order of significance,
			makeUnique			-	*Optional, default false*
									If true, make collapsed arrays unique

		Example:
		(code)
			store:{
				type:"query",
				autoLoad:true,
				sql:"select * from cust_values where  rownum < 100",
				post:function (data) {
					return data.collapse(["application","key"],true)
				}
			},

		(end)
		*/
		univnm.DataSet.prototype.collapse = function(partitionColumns, makeUnique){
			var result =new univnm.DataSet({
				columns:this.columns,data:[]
			})
			if (!this.length) return result;

			var index = {};

			this.forEach(function(row){
				var key = partitionColumns.map(function(col){
					return String(row[col]);
				}).join();

				if (index[key]){
					univnm.ObjectLib.getKeys(row)
					.filter(function(col){
						return !partitionColumns.contains(col)
					})
					.forEach(function(col){
						if (!(index[key][col] instanceof Array)){
							index[key][col] = [index[key][col]]
						}
						if (makeUnique){
							index[key][col].appendUnique(row[col])	;
						} else {
							index[key][col].push(row[col])	;
						}
					})
				} else {
					result.push(
						index[key] = univnm.ObjectLib.applyTo(row,{})
					);
				}

			})
			return result;
		}
	/* Function: containsByCol
		returns true if any row in the DataSet has a _column_ value that matches
		_compare_

		Parameters:
			column			-	name of the column to search.
			compare		-	RegExp, string regular expresion, or function to compare.
								if _compare_ is a function, it will be called with the
								"Compare Function Arguments" below. The supplied compare
								function should return true if the current row should be
								output

		Compare Function Arguments:
			columnValue	-	Value of _column_ in the current row,
			data			-	An object that represents all the columns in this row
			index			-	The index of the current row
			dataset		-	A reference to this dataset

		*/
		univnm.DataSet.prototype.containsByCol = function(column, compare){
			if (!column) throw new SyntaxError("column is required")
			if (!compare
				|| (
					!(compare instanceof RegExp )
					&& !(typeof compare =="string")
					&& !(compare instanceof Function)
				)
			) throw new SyntaxError("compare is required, and must be either a RegExp object,a string regular expression, or a function")
			if (typeof compare  =="string") compare = new RegExp(compare);
			if (compare instanceof RegExp){
				var regex = compare;
				compare = function(columnValue){
					return regex.test(columnValue)
				}
			}
			for (var x=0; x < this.length; ++x){
				if (compare(this[x][column],this[x],x,this)){
					return true;
				}
			}
			return false;
		};
	/* Function: findFirstByCol
		returns the first row in the DataSet whose _column_ value matches _compare_, or
		null if no matches

		Parameters:
			column			-	name of the column to search.
			compare		-	RegExp, string regular expresion, or function to compare.
								if _compare_ is a function, it will be called with the
								"Compare Function Arguments" below. The supplied compare
								function should return true if the current row should be
								output

		Compare Function Arguments:
			columnValue	-	Value of _column_ in the current row,
			data			-	An object that represents all the columns in this row
			index			-	The index of the current row
			dataset		-	A reference to this dataset

		*/
		univnm.DataSet.prototype.findFirstByCol = function DataSet_findFirst(column, compare){
			if (!column) throw new SyntaxError("column is required")
			if (!compare
				|| (
					!(compare instanceof RegExp )
					&& !(typeof compare  =="string" || String(compare) == compare)
					&& !(compare instanceof Function)

				)
			) throw new SyntaxError("compare is required, and must be either a RegExp object,a string regular expression, or a function")
			if (typeof compare=="string" || String(compare) == compare) compare = new RegExp("^"+String(compare).escapeRegex()+"$");
			if (compare instanceof RegExp){
				var regex = compare;
				compare = function(columnValue){
					return regex.test(columnValue)
				}
			}
			for (var x=0; x < this.length; ++x){
				if (compare(this[x][column],this[x],x,this)){
					return this[x];
				}
			}
			return null;
		};
	/* Function: findAllByCol
		returns a new DataSet of all the rows in this DataSet whose _column_ value
		matches _compare_

		Parameters:
			column			-	name of the column to search.
			compare		-	RegExp, string regular expression, or function to compare.
								if _compare_ is a function, it will be called with the
								"Compare Function Arguments" below. The supplied compare
								function should return true if the current row should be
								output

		Compare Function Arguments:
			columnValue	-	Value of _column_ in the current row,
			data			-	An object that represents all the columns in this row
			index			-	The index of the current row
			dataset		-	A reference to this DataSet

		*/
		univnm.DataSet.prototype.findAllByCol = function DataSet_findAll(column, compare){
			var $this = this;
			if (!column) throw new SyntaxError("column is required")
			if (!compare
				|| (
					!(compare instanceof RegExp )
					&& !(typeof compare  =="string")
					&& !(compare instanceof Function)
				)
			) throw new SyntaxError("compare is required, and must be either a RegExp object,a string regular expression, or a function")
			if (typeof compare  =="string") compare = new RegExp("^"+compare.escapeRegex()+"$");
			if (compare instanceof RegExp){
				var regex = compare;
				compare = function(columnValue){
					return regex.test(columnValue)
				}
			}
			return new univnm.DataSet({
				columns:$this.columns,
				data:$this.filter(function(row,index,dataset){
					return compare(row[column],index,row,dataset)
				})
			})

		};
	/* Function: valueArray
		returns an array of the values of a column.

		Parameters:
			columnName		-	String Column name to return
		*/
		univnm.DataSet.prototype.valueArray=function(columnName){
			var name=columnName;
			return Array.prototype.map.call(this,function(element){ return element[name]})
		}
	/* Function: map
		Creates a new DataSet with the results of calling a provided function on every element in this array.

		See:
			<Array.map>
		*/
		univnm.DataSet.prototype.map = function(func) {
			return new univnm.DataSet({
				data:Array.prototype.map.call(this,func),
				columns:this.columns
			})
		}
	/* Function: filter
		Performs Array.filter, but returns a new DataSet with the same columns as
		this one

		See:
			<Array.filter>
		*/
		univnm.DataSet.prototype.filter = function() {
		  var args = Array.prototype.slice.call(arguments,0);
		  return new univnm.DataSet({
				data:Array.prototype.filter.apply(this,args),
				columns:this.columns
		  })
		}
	/* Function: concat
		Performs Array.concat, but returns a new DataSet with the same columns as
		this one

		See:
			<Array.concat>
		*/
		univnm.DataSet.prototype.concat = function(otherArray) {
			var data= []
			this.forEach(function(row){
				data.push(row)
			})
			otherArray.forEach(function(row){
				data.push(row)
			})
			return new univnm.DataSet({
				data:data,
				columns:this.columns
			})
		}
	/* Function: slice
		Performs Array.slice, but returns a new DataSet with the same columns as
		this one

		See:
			<Array.slice>
		*/
		univnm.DataSet.prototype.slice = function() {
			var args = Array.prototype.slice.call(arguments,0);
			return new univnm.DataSet({
				data:Array.prototype.slice.apply(this,args),
				columns:this.columns
			})
		}
	/* Function: merge
		merges another DataSet into this one, by a common column value

		Parameters:
			ds			-	Other dataset to merge into this one
			column		-	String name of column that the two DataSets have in common

		Example:
		(code)
			var a = new univnm.DataSet([{
				id:1,
				name:"bob"
			}])

			var a = new univnm.DataSet([{
				id:1,
				age:15
			}])

			a.merge(b,"id")
		(end)

		*/
		univnm.DataSet.prototype.merge = function(ds,column) {
			var $this = this
			if (!ds || !("columns" in ds)) throw new Error("First Param must be an instance of DataSet")
			var myColumns = this.columns.join()
			ds.columns.forEach(function(colname){
				if (!myColumns.listContains(colname)) {
					$this.columns.push(colname)
				}
			})
			if (!this.columnIndex) this.columnIndex={};
			if (!this.columnIndex[column]){
				this.columnIndex[column] ={};
				this.forEach(function(row){
					$this.columnIndex[column][row[column]] = row;
				})
			};

			ds.forEach(function(relatedRow){
				// var relatedRow= ds.findFirstByCol(column,row[column])
				var row= $this.columnIndex[column][relatedRow[column]]
				if (row){
					ds.columns.filter(function(colname){
						return colname != column}
					).forEach(function(col){
						row[col] = relatedRow[col]
					})
				}
			})
		}
	/* Function: minByCol
		returns the "smallest" value of a column.

		Parameters:
			column		-	column to compare
			compare	-	*Optiional, default: function(a,b){return a < b}*
							A compare function like sort() uses to determine the minimum
							value

		*/
		univnm.DataSet.prototype.minByCol = function(column,compare) {
			if (!compare) compare = function(a,b){return a < b}
			return this.reduce(function(result,e){
				if (result === null ||compare(e[column],result)) {
					return e[column];
				} else return result;
			},null);
		}
	/* Function: maxByCol
		returns the "largest" value of a column.

		Parameters:
			column		-	column to compare
			compare	-	*Optiional, default: function(a,b){return a > b}*
							A compare function like sort() uses to determaxe the maximum
							value

		*/
		univnm.DataSet.prototype.maxByCol = function(column,compare) {
			if (!compare) compare = function(a,b){return a > b}
			return this.reduce(function(result,e){
				if (result === null ||compare(e[column],result)) {
					return e[column];
				} else return result;
			},null);
		}
	/* Function: sumByCol
		returns a sum of the values of a column.

		Parameters:
			column		-	column to sum
			accessor	-	*Optional, default: function(element){return element}*
							A function that takes an element of the column and returns a
							value to be summed. This is useful to force integer math or
							to sum a property of the objects in the column rather than
							the objects themselves.

		*/
		univnm.DataSet.prototype.sumByCol = function(column,accessor) {
			if (!accessor) accessor = function(element){return element}
			return this.reduce(function(result,e){
				return result + accessor(e[column]);
			},0);
		}
	/* Function: sortByCol
		sorts the DataSet by the supplied column and compare function.

		Parameters:
			column		-	column to sort
			compare	-	*Optiional, default: String.compareAlpha*
							A compare function that takes 2 elements and returns either
							1, 0, or -1

			Example:
			(code)
				var files = new Myna.File("/").listFiles()
				files.sortByCol("fileName",String.compareNatural)
			(end)

		*/
		univnm.DataSet.prototype.sortByCol = function(column,compare) {
			if (!compare) compare=String.compareAlpha;
			this.sort(function(a,b){
				return compare(a[column],b[column])
			})
		}
	/* Function: avgByCol
		returns an average of the column.

		Parameters:
			column		-	column to average
			accessor	-	*Optional, default: function(element){return element}*
							A function that takes an element of the column and returns a
							value to be averaged. This is useful to force integer math
							or to average a property of the objects in the column rather
							than the objects themselves.

		Note:
			null values are ignored. If you want to count nulls as 0, use this
			_accessor_

			(code)
				function(element){
					return element===null?0:element;
				}
			(end)
		*/
		univnm.DataSet.prototype.avgByCol = function(column,accessor) {
			if (!accessor) accessor = function(element){return element}
			return this.filter(function(e){
				return accessor(e[column]) !== null;
			}).reduce(function(result,e,index,array){
				if (index < array.length -1){
					return result + accessor(e[column]);
				} else {
					result += accessor(e[column]);
					return result / array.length + " : " + array.length;
				}
			},0);
		}
	/* Function: toHtmlTable
		returns an HTML table of this dataset
		*/
		univnm.DataSet.prototype.toHtmlTable = function() {
			var columns =this.columns
			var ds = this
			var result =""
				+ '<table border="1" class="dataset-table" cellpading="2">'
				+ '<tr class="dataset-column-headrow">'
				+ columns.map(function(col){

						return '<th align="left" style="background-color:silver;padding:4px;">' + col + '</th>';
				}).join("") + '</tr>'
				+ ds.map(function(row,index){
						return '<tr class="dataset-column-datarow " >'
						+ columns.map(function(col){
							try{
								return '<td align="left" style="'+(index%2?"background-color:silver;":"background-color:lightblue;")+'">' + row[col] + '</td>';
							} catch (e){
								return '<td align="left" style="'+(index%2?"background-color:silver;":"background-color:lightblue;")+'">[UNKNOWN]</td>';
							}
						}).join("")
						+ '</tr>'
				}).join("")
				+"</table>";
			return result
		}
	/* Function: pivot
		returns a new DataSet pivoted around a key, category, and value

		Parameters:
			keyField		-	Column name that contains the unique value for
								every row in the result. Duplicate values for
								calculated columns will overwrite, missing
								values will be set to null

			categoryField 	-	Column name that contains the new columns that
								should be created. These names will be cleaned
								such that invalid characters are replaced with
								"_" and the result is lower cased. If this would
								result in a blank column (such as numeric
								values) then "category_<value>" is used for the
								column name. If that still doesn't work, then
								"category__unknown" is used for the column name

			valueField		-	Column name that contains the values for each key
			cleanFieldName	-	*Optional*
								function to clean pivot values before converting
								them to field names. The default is to strip
								spaces and non alpha numeric characters

		Detail:
			The purpose of this function is to convert a data set that looks like
			this

			(code)
				user  | category       | value
				----------------------------------
				bob	  | Age            | 35
				sally | Age            | 25
				bob   | Favorite Color | blue
				sally | Favorite Color | yellow
				bob   | Start Date     | 01/01/2001
				sally | Start Date     | 05/16/1997
			(end)

			into something like this

			(code)
				user   | age | favorite_color | start _date
				--------------------------------------------
				bob    | 35  | blue           | 01/01/2001
				sally  | 25  | yellow         | 05/16/1997
			(end)

			The above transform would be accomplished with

			(code)
				ds.pivot("user","category","value")
			(end)

		*/
		univnm.DataSet.prototype.pivot = function(keyField,categoryField,valueField, cleanFieldName){
			var $this = this;
			var data = []
			var keyIndex={}

			var columns=$this.columns.filter(function(colName){
				return ![categoryField,valueField].contains(colName)
			});
			var calculated;
			cleanFieldName = cleanFieldName || function (fieldName){
				var result = String(fieldName).replace(/^[\W\d_]+/,"").replace(/\W+/g,"_").replace(/[\W_]$/,"")
				if (!result) {
					result= cleanFieldName("category_"+fieldName);
					if (result == "category_") return "category__unknown"
				}
				return result.toLowerCase()
			}

			this.forEach(function(row){
				var key =row[keyField]

				if (!(key in keyIndex)) {
					var newRow = {}
					newRow[keyField] = key

					keyIndex[key] = data[data.push(newRow)-1]
				}
				var category = cleanFieldName(row[categoryField]);
				if (!columns.contains(category)){
					columns.push(category)
				}

				keyIndex[key][category] = row[valueField]
				$this.columns.filter(function(colName){
					return ![keyField,categoryField,valueField].contains(colName)
				}).forEach(function(colName){
					keyIndex[key][colName] = row[colName]
				})
			})
			data = data.map(function(row){
				columns.forEach(function(col){
					if (!(col in row)) row[col] = null
				})
				return row
			})
			var ds = new univnm.DataSet({
				columns:columns,
				data:data
			})
			return ds

		}

	/* Function: toStruct
		converts a DataSet into an hierarchical object

		Parameters:
			keyCols				-	Array of column names, in order of significance,
			remainingProperty	-	*Optional, default null*
									if keyCols does not uniquely identify every
									row in the DataSet, and _remainingProperty_
									is defined, then the remain rows will be
									added to this property as an array.
			full				-	*Optional, default false*
									If true, each level in the hierarchy contains
									all the values of the first row of that branch,
									and sub trees branch of the col name

		The purpose of this function is to convert flat result sets into a
		structured hierarchy. This is best illustrated by examples

		Examples:
		(code)
		// Original Set
			//	employee_id	| title					| position_code | department_name			 | department_code
			//	----------- | --------------------- | ------------- | -------------------------- | ---------------
			//	100000001	| Cp Tech-Mental Health	| 01021C		| MILAGRO					 | 01106550
			//	100000003	| Universal Interviewer	| 054700		| MED SPECIALTIES CLINIC B	 | 01017120
			//	100000075	| Clerk Outpt			| 054700		| MED SPECIALTIES CLINIC B	 | 01017120
			//	100001035	| Clerk Outpt			| 054700		| MED SPECIALTIES CLINIC B	 | 01017120

		var simple = original_set.toStruct(["position_code","department_code"])
			[ Object ]
			  +-[01021C] [ Object ]
			  | \-[01106550] [ Array ]
			  |   \-[0] [ Object ]
			  |     +-[department_code] 01106550
			  |     +-[department_name] MILAGRO
			  |     +-[employee_id] 100000001
			  |     +-[position_code] 01021C
			  |     \-[title] Cp Tech-Mental Health
			  \-[054700] [ Object ]
				\-[01017120] [ Array ]
				  +-[0] [ Object ]
				  | +-[department_code] 01017120
				  | +-[department_name] MED SPECIALTIES CLINIC B
				  | +-[employee_id] 100000003
				  | +-[position_code] 054700
				  | \-[title] Universal Interviewer
				  +-[1] [ Object ]
				  | +-[department_code] 01017120
				  | +-[department_name] MED SPECIALTIES CLINIC B
				  | +-[employee_id] 100000075
				  | +-[position_code] 054700
				  | \-[title] Clerk Outpt
				  \-[2] [ Object ]
					+-[department_code] 01017120
					+-[department_name] MED SPECIALTIES CLINIC B
					+-[employee_id] 100001035
					+-[position_code] 054700
					\-[title] Clerk Outpt
		var simple_with_rows = original_set.toStruct(["position_code","department_code"],"rows")
			[ Object ]
			  +-[01021C] [ Object ]
			  | \-[01106550] [ Object ]
			  |   \-[rows] [ Array ]
			  |     \-[0] [ Object ]
			  |       +-[department_code] 01106550
			  |       +-[department_name] MILAGRO
			  |       +-[employee_id] 100000001
			  |       +-[position_code] 01021C
			  |       \-[title] Cp Tech-Mental Health
			  \-[054700] [ Object ]
				\-[01017120] [ Object ]
				  \-[rows] [ Array ]
					+-[0] [ Object ]
					| +-[department_code] 01017120
					| +-[department_name] MED SPECIALTIES CLINIC B
					| +-[employee_id] 100000003
					| +-[position_code] 054700
					| \-[title] Universal Interviewer
					+-[1] [ Object ]
					| +-[department_code] 01017120
					| +-[department_name] MED SPECIALTIES CLINIC B
					| +-[employee_id] 100000075
					| +-[position_code] 054700
					| \-[title] Clerk Outpt
					\-[2] [ Object ]
					  +-[department_code] 01017120
					  +-[department_name] MED SPECIALTIES CLINIC B
					  +-[employee_id] 100001035
					  +-[position_code] 054700
					  \-[title] Clerk Outpt
		var full_with_rows = original_set.toStruct(["position_code","department_code"],"rows")
			[ Object ]
			  +-[department_code] 01106550
			  +-[department_name] MILAGRO
			  +-[employee_id] 100000001
			  +-[position_code] [ Object ]
			  | +-[01021C] [ Object ]
			  | | +-[department_code] [ Object ]
			  | | | \-[01106550] [ Object ]
			  | | |   +-[department_code] 01106550
			  | | |   +-[department_name] MILAGRO
			  | | |   +-[employee_id] 100000001
			  | | |   +-[position_code] 01021C
			  | | |   +-[rows] [ Array ]
			  | | |   | \-[0] [ Object ]
			  | | |   |   +-[department_code] 01106550
			  | | |   |   +-[department_name] MILAGRO
			  | | |   |   +-[employee_id] 100000001
			  | | |   |   +-[position_code] 01021C
			  | | |   |   \-[title] Cp Tech-Mental Health
			  | | |   \-[title] Cp Tech-Mental Health
			  | | +-[department_name] MILAGRO
			  | | +-[employee_id] 100000001
			  | | +-[position_code] 01021C
			  | | \-[title] Cp Tech-Mental Health
			  | \-[054700] [ Object ]
			  |   +-[department_code] [ Object ]
			  |   | \-[01017120] [ Object ]
			  |   |   +-[department_code] 01017120
			  |   |   +-[department_name] MED SPECIALTIES CLINIC B
			  |   |   +-[employee_id] 100000003
			  |   |   +-[position_code] 054700
			  |   |   +-[rows] [ Array ]
			  |   |   | +-[0] [ Object ]
			  |   |   | | +-[department_code] 01017120
			  |   |   | | +-[department_name] MED SPECIALTIES CLINIC B
			  |   |   | | +-[employee_id] 100000003
			  |   |   | | +-[position_code] 054700
			  |   |   | | \-[title] Universal Interviewer
			  |   |   | +-[1] [ Object ]
			  |   |   | | +-[department_code] 01017120
			  |   |   | | +-[department_name] MED SPECIALTIES CLINIC B
			  |   |   | | +-[employee_id] 100000075
			  |   |   | | +-[position_code] 054700
			  |   |   | | \-[title] Clerk Outpt
			  |   |   | \-[2] [ Object ]
			  |   |   |   +-[department_code] 01017120
			  |   |   |   +-[department_name] MED SPECIALTIES CLINIC B
			  |   |   |   +-[employee_id] 100001035
			  |   |   |   +-[position_code] 054700
			  |   |   |   \-[title] Clerk Outpt
			  |   |   \-[title] Universal Interviewer
			  |   +-[department_name] MED SPECIALTIES CLINIC B
			  |   +-[employee_id] 100000003
			  |   +-[position_code] 054700
			  |   \-[title] Universal Interviewer
			  \-[title] Cp Tech-Mental Health


		(end)
		*/
		univnm.DataSet.prototype.toStruct = function(keyCols, remainingProperty, full){
			if (!this.length) return {}
			var result =full?univnm.ObjectLib.applyTo(this[0],{}):{};
			var base =full?result[keyCols[0]] = {}:result;
			var $this = this;
			this.forEach(function(row,index){
				var path=""
				var curArray= keyCols.reduce(function(parent,colName,index){
					path+="."+colName
					//univnm.jslib.debug_window(path +" starting col  " + colName )
					var colVal = row[colName];
					//if (colVal == parseInt(colVal)) colVal = colName +"_"+colVal
					var curRow;
					if (!(colVal in parent)){
						//univnm.jslib.debug_window(path +" adding " + colName +" : " +colVal + " : " +index)
						var curRow = parent[colVal] =full?univnm.ObjectLib.applyTo(row,{}):{};

						//parent.push(parent[colVal])
						if (index < keyCols.length-1) {
							 if (full) curRow[keyCols[index +1]] ={}
						} else if (remainingProperty){

							curRow[remainingProperty] =new univnm.DataSet({
								columns:$this.columns
							})
						} else if (!full){
							curRow = parent[colVal]  =new univnm.DataSet({
								columns:$this.columns
							})
						}
					} else {
						curRow =parent[colVal]
					}

					if (index < keyCols.length-1) {
						//univnm.jslib.debug_window(path +" decending to " + keyCols[index +1],  parent[colVal][keyCols[index +1]])

						return full?curRow[keyCols[index +1]]:curRow;
					} else if (remainingProperty){
						return curRow[remainingProperty];
					} else if (!full){
						return curRow;
					} else {
						return parent
					}


				},base)
				if (remainingProperty ||!full){
					curArray.push(univnm.ObjectLib.applyTo(row,{}))
				}

			})
			return result;
		}

/* Class: univnm.Profiler
	Stores execution times between begin() and end() functions

	Detail:
		The univnm.Profiler class is for tracking execution time. More than one
		univnm.Profiler can be active at a time, but generally it is most convenient
		to use the global $profiler instance.

	Note:
		univnm.ccl_callback automatically logs callback times to $profiler

	Example:
		(code)
			<!--  LOAD THE GENERAL JS LIBS -->
			<script src="../shared/js/mpages_core.js"></script>
			<script src="../shared/js/mpages_jslib.js"></script><script>$profiler.mark("jslib loaded");</script>

			<script src="../jquery/jquery-1.4.2.min.js"></script><script>$profiler.mark("jQuery loaded");</script>
			<script src="../ext/ext-3.2.1/adapter/jquery/ext-jquery-adapter.js"></script><script>$profiler.mark("jQuery adapter loaded");</script>
			<script src="../ext/ext-3.2.1/ext-all.js"></script><script>$profiler.mark("Ext loaded");</script>
			<script src="../shared/js/jquery.mpages.js"></script><script>$profiler.mark("jquery.mpages loaded");</script>
			<script src="../shared/js/PCRemotingProvider.js"></script><script>$profiler.mark("PCRemotingProvider loaded");</script>


			<script>
				window.onload = function(){
					$profiler.mark("onload started")
					var cb = function(){
						univnm.jslib.ccl_callback({
								ccl:"mark_test",
								parameters:["MINE","1","2","3"],
								async:true
						})
					}


					cb.repeat(10)

					setTimeout(function(){
						univnm.jslib.debug_window($profiler.getAveragesHtml())
						univnm.jslib.debug_window($profiler.getSummaryHtml())
					},1000)
					$profiler.mark("onload finished")
				}

			</script>
		(end)

		Displays HTML somewhat like this...

		(code)
		Label                                              | Num Entires     | Average Ms
		-------------------------------------------------- | --------------- | ---------------
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 10              | 126.5


		Label                                              | Elapsed Millis  | Elapsed Total
		-------------------------------------------------- | --------------- | ---------------
		jslib loaded                                       |                 | 87
		jQuery loaded                                      |                 | 154
		jQuery adapter loaded                              |                 | 180
		Ext loaded                                         |                 | 788
		jquery.mpages loaded                               |                 | 792
		PCRemotingProvider loaded                          |                 | 796
		onload started                                     |                 | 893
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 139             | 894
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 134             | 903
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 132             | 909
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 130             | 914
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 127             | 920
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 125             | 925
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 123             | 931
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 121             | 936
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 118             | 942
		ccl_callback: mark_test ^MINE^,MINE,1,2,3          | 116             | 948
		onload finished                                    |                 | 953

		(end)

	*/

	/* Constructor: univnm.Profiler
		Constructor function for univnm.Profiler class

		Parameters:
			start		-	*Optional, default new Date().getTime()*
							Milliseconds since epoch to use as starting point.

		Returns:
			Reference to univnm.Profiler instance
		*/
		univnm.Profiler=function (start){
			this.times = [];
			this.labels = {};
			this.start = start || new Date().getTime();
		}

	univnm.Profiler.prototype.start=0;

	/* Function: begin
		Sets begin point for a given label.

		Parameters:
			label		-	string label for this event
			time		- 	*Optional, default new Date().getTime()*
							Time to record for this entry

		Returns:
			A function that can be used to set the end time. This functions can
			be called with no parameters to set the end time to "now" or you can
			pass a millisecond timestamp to set a specific end time. This can be
			useful for asynchronous operations to make sure that correct entry
			is updated

		Detail:
			If an entry with this label was already pending, it is closed
			and a new entry is started.

		Example:
		(code)
			$profiler.begin("Doin' Stuff")
			doStuff();
			$profiler.end("Doin' Stuff")

			var endFunction =$profiler.begin("Doin' Stuff Asynchronously")
			var doStuffWithCallback(args,callback) {
				callAsyncFunction()
			}
			var doStuffWithCallback(args,function(result){
				// use encosed end function to set end time on the correct begin()
				endFunction()
				... handle result ...
			})

		(end)

		See:
		* <end>
		*/
		univnm.Profiler.prototype.begin = function(label,time){
			var key=label.replace(/[\W]*/,""),
				entry={
					label:label,
					begin:time || new Date().getTime()
				}
			this.times.push(entry);
			if (this.labels[key] && !this.labels[key].end){
				this.end(key,entry.begin);
			}
			this.labels[key] = entry;
			return function(time){
				entry.end=time||new Date().getTime()
				var dur = entry.end - entry.begin;
				if (dur > 100 && label.substr(0, 12) != "ccl_callback") {
					//console.log(label + " took a while: " + dur.toString() + "ms");
				}
			}
		}


	/* Function: end
		Sets end point for a given label.

		Parameters:
			label		-	string label for this event
			time		- 	*Optional, default new Date().getTime()*
							Time to record for this entry

		Detail:
			If no entry is pending for this label, one is created with the same time,
			and the entries *isMark* property is set to true;
		*/
		univnm.Profiler.prototype.end = function(label,time){
			var now=time||new Date().getTime(),
				key=label.replace(/[\W]*/,"");
			if (!this.labels[key]){
				this.begin(label,now);
				this.labels[key].isMark=true;
			}
			this.labels[key].end=now;
		}
	/* Function: mark
		Sets a bookmark entry.

		Parameters:
			label		-	string label for this event
			time		- 	*Optional, default new Date().getTime()*
							Time to record for this entry

		Detail:
			This is the same behavior as <end> when there is no <begin>.
			An entry is created with both begin and end set to _time_ and
			the entry's *isMark* property is set.
		*/
		univnm.Profiler.prototype.mark=function(label,time){

			label =String(label);
			this.end(label)
			///var now=time||new Date().getTime(),
			//	key=label.replace(/[\W]*/,"");
			//this.end(label)
			// this.begin(label,now);
			//this.labels[key].isMark=true;
			//this.labels[key].end=now; */
		}
	/* Function: getAveragesArray
		returns an array of tasks with average execution time in milliseconds

		Note:
		This will only return entries with a "begin" and "end".

		See:
		* <getAveragesHtml>
		*/
		univnm.Profiler.prototype.getAveragesArray = function(){
			var tasks ={}

			this.times.filter(function(t){
				return !t.isMark && parseInt(t.end - t.begin) == t.end - t.begin;
			}).forEach(function(t){
				if (!(t.label in tasks)){
					tasks[t.label] = []
				}
				tasks[t.label].push(t.end - t.begin)
			})

			return univnm.ObjectLib.getKeys(tasks).sort().map(function(label){
				return {
					label:label,
					averageMs:parseInt(tasks[label].avg()),
					numEntries:tasks[label].length
				}
			})
		}
	/* Function: getAveragesHtml
		returns <getTaskAverages> in an HTML table.
		*/
		univnm.Profiler.prototype.getAveragesHtml = function(){
			var msg=[
				'<style>',
					'.profiler_table {',
						'border:1px solid black;',
					'}',
					'.profiler_table th{',
						'font-weight:bold;',
					'}',
					'.profiler_table td{',
						'border:1px solid black;',
					'}',
					'.profiler_table .alt_row td{',
						'background-color:silver',
					'}',
				'</style>',
				'<table class=profiler_table>',
				'<tr>',
				'<th>Label</th><th>Num Entries</th><th>Average Ms</th>',
				'</tr>'
			];
			this.getAveragesArray().forEach(function(t,index){
				var alt_row = (index%2==0) ? "alt_row":"";
				msg.push("<tr class='" +alt_row + "'>");
				msg.push("<td>" + String(t.label) +"</td>");
				msg.push("<td>" + String(t.numEntries) +"</td>");
				msg.push("<td>" + String(t.averageMs) +"</td>");
				msg.push("</tr>");
			});

			msg.push("</table>") ;

			return msg.join("\n");
		}
	/* Function: getAveragesText
		returns a text table of average times.

		*/
		univnm.Profiler.prototype.getAveragesText = function(){
			var delim = " | ";
			var msg=[
				"Label".toFixedWidth(50) + delim + "Num Entires".toFixedWidth(15)+ delim + "Average Ms".toFixedWidth(15),
				"-".repeat(50) + delim + "-".repeat(15)+ delim + "-".repeat(15)
			]
			this.getAveragesArray().forEach(function(t,index){
				msg.push(String(t.label).toFixedWidth(50," ","...","middle")
					+ delim + String(t.numEntries).toFixedWidth(15)
					+ delim + String(t.averageMs).toFixedWidth(15)
				);
			});

			return msg.join("\n");
		}
	/* Function: getSummaryArray
		returns an array of all the entries.

		Detail:
			Each entry is an object with *begin* and *end* proerties,
			and optionally *isMark* or *isAverage* properties.
		*/
		univnm.Profiler.prototype.getSummaryArray = function(){
			var $this = this;
			return this.times.filter(function(entry){
				return entry.end
			}).map(function(entry,i){

				entry.total=entry.begin - $this.start;

				if (entry.isMark) {
					entry.type = "Checkpoint"
					entry.elapsed="";
				} else {
					entry.type = "Task"
					entry.elapsed=entry.end - entry.begin;
				}
				entry.totalText = Date.formatInterval(entry.total)
				return entry

			})

		}
	/* Function: getSummaryHtml
		returns an HTML summary of all the entries.

		*/
		univnm.Profiler.prototype.getSummaryHtml = function(){
			var msg=[
				'<style>',
					'.profiler_table {',
						'border:1px solid black;	',
					'}',
					'.profiler_table th{',
						'font-weight:bold;',
					'}',
					'.profiler_table td{',
						'border:1px solid black;',
					'}',
					'.profiler_table .alt_row td{',
						'background-color:silver;',
					'}',
				'</style>',
				'<table class=\'profiler_table\'>',
				'<tr> ',
					'<th>Label</th>',
					'<th>Task Ms</th>',
					'<th>Elapsed</th>',
				'</tr>'
			]
			var $this=this;
			this.times.filter(function(entry){
				return entry.end
			}).forEach(function(entry,i){
				var elapsed=entry.end - entry.begin;
				var total=entry.begin - $this.start;
				var label=entry.label;

				if (entry.isMark) {
					elapsed="&nbsp;";
					label = "MARK: " + label
				} else {
					label = "TASK: " + label
				}


				var alt_row = (i%2==0) ? "alt_row":"";
				msg.push("<tr class='" +alt_row + "'>");
				msg.push("<td>" + String(label) +"</td>");
				msg.push("<td>" + String(elapsed) +"</td>");
				msg.push("<td>" + String(Date.formatInterval(total)) +"</td>");
				msg.push("</tr>");
			})


			msg.push("</table>");

			return msg.join("\n");
		}

	/* Function: profile
		attaches profiling hooks to an object

		Parameters:
			obj		-	object to profile
			name	-	String. Name of this object to use in profile logs
			logArgs	-	*Optional, default false*
						If true, log arguments to function in the profiler

		Detail:
			This attaches "begin" and "end" profiling to every function in _obj_,
			and getters
		*/
		// Myna.Profiler.prototype.profile = function(obj,name,logArgs){
		// 	var $this = this;
		// 	var p;


		// 	function applyProfiler(target,prop,propName){
		// 		if (typeof target[prop] == "function"){
		// 			if (ObjectLib.getProperties(target[prop].prototype).length) return false;

		// 			//Myna.println(prop)
		// 				var chain = arguments.callee.chain;
		// 				var msg = name +"::" + propName +"(";
		// 				if (logArgs) {
		// 					try{
		// 					msg+=JSON.stringify(chain.args,null,"   ");
		// 					} catch(e){}
		// 				}
		// 				msg+=")";
		// 				chain._profileEnd = $this.begin(msg);
		// 				return chain.lastReturn;
		// 			});
		// 			ObjectLib.after(target,prop,function(){
		// 				var chain = arguments.callee.chain;
		// 				chain._profileEnd();
		// 				return chain.lastReturn;
		// 			});
		// 			return true;
		// 		}
		// 		return false;
		// 	}

		// 	for (p in obj){
		// 		applyProfiler(obj,p,p);
		// 	}

		// };

	/* Function: getSummaryText
		returns a text summary of all the entries.

		*/
		univnm.Profiler.prototype.getSummaryText = function(){
			var delim = " | ";
			var msg="";
				msg += "Label".toFixedWidth(50) + delim + "Elapsed Millis".toFixedWidth(15) + delim + "Elapsed Total".toFixedWidth(15) + "\n";
				msg += "-".repeat(50) + delim + "-".repeat(15) + delim + "-".repeat(15) + "\n";

			var total=0,entry,elapsed,label;
			for (var x=0; x < this.times.length; ++x){
				entry = this.times[x];
				if (!entry.end) continue;
				elapsed=entry.end - entry.begin;
				total=entry.begin - this.start;
				label=entry.label

				if (entry.isMark) {
					elapsed="";
				}

				if (entry.isAverage){
					elapsed=entry.average +" / " + entry.sum;
					total="";
					label +=" (Avg/Sum  of " + entry.numEntries +" entries)"
				}

				msg += String(label).toFixedWidth(50," ","...","middle") + delim
				msg += String(elapsed).toFixedWidth(15) + delim
				msg += String(total).toFixedWidth(15) + "\n";

			}

			return msg;
		}
	var $profiler=new univnm.Profiler()


/* Class: univnm.jslib.async
	Asynchronous function utilities


	Detail:
		The purpose of the Async library is to execute a group of asynchronous
		functions, with a single callback when they are complete. <marshal>
		executes the functions all at the same time, and <sequence> executes
		them in the order defined. Both of these functions return an async handle object
		that keeps track of the progress. To execute a function when all the
		async functions are complete, call "then(somefunction)" on the returned
		handle object.

		See:
		* <marshal>
		* <sequence>

		Note:
			both <marshal> and <sequence> recognize the returned async handle object,
			so these handle objects can be used to nest multiple sets of callbacks like
			so

		(code)
			var firstSet = univnm.jslib.async.sequence(f1,f2,..fn);
			var secondSet = univnm.jslib.async.sequence(f1,f2,..fn);
			//at this point both sets are executing their sequences in parallel
			univnm.jslib.async.marshal(
				firstSet,
				secondSet
			).then(function(){
				alert("both sets done!")
			})

		(end)
	*/
	univnm.jslib.async = {
	/* Function: marshal
			Executes multiple async functions and then a single handler when done

			Parameters:
				functions	-	one or more async functions that accept a
								function as their first	parameter, or an array
								of such functions. You can also use the returned
								handle from <marshal> or <sequence>
				scope		-	*Optional, default {}*
								the "this" object used for the callback
								functions and the _then_ handler


			returns:
				handle object with a "then" function. Call this with a function
				to execute when all async functions are complete

			Example:
			(code)
				univnm.jslib.async.marshal(
					function(done){
						var result = this; //all callbacks share "this"
						window.setTimeout(function(){
							console.log(1)
							result.val1 = "one!"
							done()
						},100)
					},
					function(done){
						var result = this;
						window.setTimeout(function(){
							console.log(2)
							result.val2 = "two!"
							done()
						},200)
					},
					function(done){
						var result = this;
						window.setTimeout(function(){
							console.log(3)
							result.val3 = "three!"
							done()
						},50)
					}
				).then(function(){
					//this runs when all callbacks are done
					console.log("all done!", this)//
				})

			This outputs:
				3
				1
				2
				all done!, Object
					val1:"one!",
					val2:"two!",
					val3:"three!"

			(end)

			You can also delay the final handler until a later time by saving
			the handle object and calling then() when you are ready

			(code)
			<script>

				var allCallbacks = univnm.jslib.async.marshal(
					function(done){
						ajax1(done);
					},
					function(done){
						ajax2(done);
					},
					function(done){
						ajax3(done);
					},
				)
				window.onload = function(){
					//this will execute immediately if all the callbacks are done,
					otherwise it will wait until they are all done before executing
					allCallbacks.then(function(){
						alert("Yippie! all done!")
					})
				}
			</script>
			(end)

			You can also build your callback set ahead of time and just pass an
			array of functions to univnm.jslib.async


			(code)
			<script>

				var allCallbacks = []

				if (condition1){
					allCallbacks.push(function(done){
						ajax1(done);
					})
				}

				if (condition2){
					allCallbacks.push(function(done){
						ajax2(done);
					})
				}

				if (condition3){
					allCallbacks.push(function(done){
						ajax3(done);
					})
				}


				//if the array is empty, the "then" function is immediately executed
				univnm.jslib.async.marshal(allCallbacks).then(function(){
					alert("all done!")
				})

			</script>
			(end)


		*/
		marshal:function(){
			var args= Array.parse(arguments)
			var scope = typeof args.last() =="object" && args.length > 1 && !("then" in args.last())?args.pop():{};
			if (args.first({}) instanceof Array) args = args.first()
			args = args.map(function(arg){
				var f=arg
				if (typeof f != "function") {
					f=function(done){
						arg.then(done)
					}
				}
				return function(done){
					f.call(scope,done);
				}
			})
			var handle ={
				count:args.length,
				then:function(thenFunction){
					if (thenFunction) {
						this.listeners.push(thenFunction);
					}


					if (!handle.count) {
						this.listeners.forEach(function(f){
							f.call(scope);
						})
						this.listeners =[];
					}
					return this
				},
				listeners:[]
			}
			var done =function(){
				if(!--handle.count){
					handle.then()
				}
			}
			args.forEach(function(f){
				try{
					f(done);
				} catch (e){
					if (typeof console != "undefined") console.log(e.stack)
					done()
				}
			})
			return handle;
		},
	/* Function: sequence
			Executes multiple async functions, one after the other, and then a
			single handler when done

			Parameters:
				functions	-	one or more async functions that accept a
								function as their first	parameter, or an array
								of such functions. You can also use the returned
								handle from <marshal> or <sequence>
				scope		-	*Optional, default {}*
								the "this" object used for the callback
								functions and the _then_ handler

			returns:
				handle object with a "then" function. Call this with a function
				to execute when all async functions are complete

			Example:
			(code)
				univnm.jslib.async.sequence(
					function(done){
						var result = this; //all callbacks share "this"
						window.setTimeout(function(){
							result.val1 = "one!"
							console.log(1)
							done()
						},100)
					},
					function(done){
						var result = this;
						window.setTimeout(function(){
							result.val2 = "two!"
							console.log(2)
							done()
						},200)
					},
					function(done){
						var result = this;
						window.setTimeout(function(){
							result.val3 = "three!"
							console.log(3)
							done()
						},50)
					}
				).then(function(){
					//this runs when all callbacks are done
					console.log("all done!", this)
				})

			This outputs:
				1
				2
				3
				all done!, Object
					val1:"one!",
					val2:"two!",
					val3:"three!"

			(end)

			You can also delay the final handler until a later time by saving
			the handle object and calling then() when you are ready

			(code)
			<script>

				var allCallbacks = univnm.jslib.async.sequence(
					function(done){
						ajax1(done);
					},
					function(done){
						ajax2(done);
					},
					function(done){
						ajax3(done);
					},
				)
				window.onload = function(){
					//this will execute immediately if all the callbacks are done,
					otherwise it will wait until they are all done before executing
					allCallbacks.then(function(){
						alert("Yippie! all done!")
					})
				}
			</script>
			(end)

		*/
		sequence:function(){
			var args= Array.parse(arguments);
			var scope = typeof args.last() =="object"  && args.length > 1 && !("then" in args.last())?args.pop():{};
			if (args.first({}) instanceof Array) args = args.first()
			args = args.map(function(arg){
				var f=arg
				if (typeof f != "function") {
					f=function(done){
						arg.then(done)
					}
				}
				return function(done){
					f.call(scope,done);
				}
			})
			var handle ={
				then:function(thenFunction){
					if (thenFunction) {
						this.listeners.push(thenFunction);
					}


					if (!args.length) {
						this.listeners.forEach(function(f){
							f.call(scope);
						})
						this.listeners =[];
					}
					return this
				},
				listeners:[]
			}
			var done =function(){
				args.shift();
				if(args.length){
					runFunction(args.first());
				} else {
					handle.then();

				}
			}
			var runFunction = function(f){
				try{
					f.call(scope,done);
				} catch (e){
					if (typeof console != "undefined") console.log(e)
					done()
				}
			}
			//first function or dummy return if no functions
			runFunction(args.first(function(done){done()}));

			return handle;
		}
	}
/* Class: Number
	Extensions to the JavaScript Number object

	*/

	/* Function: times
		Executes the supplied function parseInt(this) times.

		Parameters:
			func	-	a function to execute. This function will be called with the
						current 0-based index

		Example:
		(code)
			//extra dot forces "5" to be a number
			5..times(function(i){
				console.log(i + "<br>")
			});
		(end)
		*/
		Number.prototype.times = function(func){
			for (var x=0; x < parseInt(this); ++x){
				func(x);
			}
		}
/* Class: Array
	Additional functions on the JS Array object
	*/
	/* Function: every
		Tests whether all elements in the array pass the test implemented by the provided function.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
		*/
		if (!Array.prototype.every)
		{

			Array.prototype.every = function(fun /*, thisp*/)
			{
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				var thisp = arguments[1];
				for (var i = 0; i < len; i++)
				{
					if (i in this &&
							!fun.call(thisp, this[i], i, this))
						return false;
				}

				return true;
			};
		}
	/* Function: filter
		Creates a new array with all elements that pass the test implemented by the provided function.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
		*/
		if (!Array.prototype.filter)
		{

			Array.prototype.filter = function(fun /*, thisp*/){
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				var res = new Array();
				var thisp = arguments[1];
				for (var i = 0; i < len; i++)
				{
					if (i in this)
					{
						var val = this[i]; // in case fun mutates this
						if (fun.call(thisp, val, i, this))
							res.push(val);
					}
				}

				return res;
			};
		}
	/* Function: forEach
		Executes a provided function once per array element.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
		*/
		if (!Array.prototype.forEach){
			Array.prototype.forEach = function(fun /*, thisp*/){
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				var thisp = arguments[1];
				for (var i = 0; i < len; i++)
				{
					if (i in this)
					fun.call(thisp, this[i], i, this);
				}
			};
		}
	/* Function: marshalEach
		Executes a provided function once per array element, asynchronously and
		returns a <univm.jslib.async.marshal> result

		Parameters:
			fun 		-	function to execute with each item in this array.
							See *Function Parameters* below for the arguments
							passed to _fun_ when called

		Function Parameters:
			done	-	function to be called when you are done processing. This
						must be called somewhere in your handler function
			value	-	value of current element
			index	-	array index of the current element
			array	-	reference to the array being looped over

		Each iteration will be called in it's own setTimeout, os it is important
		to call then() on the result in order to continue processing

		Example:
		(code)
			//break up a long running task to prevent script timeout errors
			univnm.db.query("select..",function(result){
				result.marshalEach(function(done,row){
					//do something intense with the row, like modifying the DOM
					done()
				}).then(function(){
					alert("all done with query")
				})
			})
		(end)
		See:
			* <forEach>
			* <univm.jslib.async.marshal>
		*/
		Array.prototype.marshalEach = function(fun){
			return univnm.jslib.async.marshal(
				this.map(function(item,index,sourceArray){
					return function(done){
						fun(done,item,index,sourceArray);
					}
				})
			)
		};
	/* Function: sequenceEach
		Executes a provided function once per array element, asynchronously,
		but in guaranteed in-order, and returns a <univm.jslib.async.sequence>
		result

		Parameters:
			fun 		-	function to execute with each item in this array.
							See *Function Parameters* below for the arguments
							passed to _fun_ when called

		Function Parameters:
			done	-	function to be called when you are done processing. This
						must be called somewhere in your handler function
			value	-	value of current element
			index	-	array index of the current element
			array	-	reference to the array being looped over

		Each iteration will be called in it's own setTimeout, os it is important
		to call then() on the result in order to continue processing

		Example:
		(code)
			//break up a long running task to prevent script timeout errors
			univnm.db.query("select..",function(result){
				result.sequenceEach(function(done,row){
					//do something intense with the row, like modifying the DOM
					done()
				}).then(function(){
					alert("all done with query")
				})
			})
		(end)
		See:
			* <forEach>
			* <univm.jslib.async.marshal>
		*/
		Array.prototype.sequenceEach = function(fun){
			return univnm.jslib.async.sequence(
				this.map(function(item,index,sourceArray){
					return function(done){
						fun(done,item,index,sourceArray);
					}
				})
			)
		};
	/* Function: indexOf
		Returns the first index at which a given element can be found in the array, or -1 if it is not present.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
		*/
		if (!Array.prototype.indexOf){
			Array.prototype.indexOf = function(elt /*, from*/)
				{
				var len = this.length;

				var from = Number(arguments[1]) || 0;
				from = (from < 0)
					 ? Math.ceil(from)
					 : Math.floor(from);
				if (from < 0)
					from += len;

				for (; from < len; from++)
				{
					if (from in this &&
						this[from] === elt)
					return from;
				}
				return -1;
			};
		}
	/* Function: lastIndexOf
		Returns the last index at which a given element can be found in the array, or -1 if it is not present.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf
		*/
		if (!Array.prototype.lastIndexOf){
			Array.prototype.lastIndexOf = function(elt /*, from*/){
				var len = this.length;

				var from = Number(arguments[1]);
				if (isNaN(from))
				{
					from = len - 1;
				}
				else
				{
					from = (from < 0)
						 ? Math.ceil(from)
						 : Math.floor(from);
					if (from < 0)
					from += len;
					else if (from >= len)
					from = len - 1;
				}

				for (; from > -1; from--)
				{
					if (from in this &&
						this[from] === elt)
					return from;
				}
				return -1;
			};
		}
	/* Function: map
		Creates a new array with the results of calling a provided function on every element in this array.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
		*/
		if (!Array.prototype.map){
			Array.prototype.map = function(fun /*, thisp*/)
				{
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				var res = new Array(len);
				var thisp = arguments[1];
				for (var i = 0; i < len; i++)
				{
					if (i in this)
					res[i] = fun.call(thisp, this[i], i, this);
				}

				return res;
			};
		}
	/* Function: dim
		returns an array of size _count_ containing null objects

		Parameters:
			count		-	number of integers in returned array


		Example:
		(code)
			var strings = Array.dim(5).map(function(element,index){
				return "String " + index++;
			})
		(end)
		*/
		if (!Array.dim){

			Array.dim = function(count){
				var result=[]
				for (var x = 0; x < count; ++x){
					 result.push(null);
				}
				return result
			};
		}



	/* Function: reduce
		Apply a function simultaneously against two values of the array (from left-to-right) as to reduce it to a single value.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/reduce
		*/
		if (!Array.prototype.reduce){
			Array.prototype.reduce = function(fun /*, initial*/){
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				// no value to return if no initial value and an empty array
				if (len == 0 && arguments.length == 1)
					throw new TypeError();

				var i = 0;
				if (arguments.length >= 2)
				{
					var rv = arguments[1];
				}
				else
				{
					do
					{
					if (i in this)
					{
						rv = this[i++];
						break;
					}

					// if array contains no values, no initial value to return
					if (++i >= len)
						throw new TypeError();
					}
					while (true);
				}

				for (; i < len; i++)
				{
					if (i in this)
					rv = fun.call(null, rv, this[i], i, this);
				}

				return rv;
			};
		}
	/* Function: reduceRight
		Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/reduceRight
		*/
		if (!Array.prototype.reduceRight){
			Array.prototype.reduceRight = function(fun /*, initial*/){
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				// no value to return if no initial value, empty array
				if (len == 0 && arguments.length == 1)
					throw new TypeError();

				var i = len - 1;
				if (arguments.length >= 2)
				{
					var rv = arguments[1];
				}
				else
				{
					do
					{
					if (i in this)
					{
						rv = this[i--];
						break;
					}

					// if array contains no values, no initial value to return
					if (--i < 0)
						throw new TypeError();
					}
					while (true);
				}

				for (; i >= 0; i--)
				{
					if (i in this)
					rv = fun.call(null, rv, this[i], i, this);
				}

				return rv;
			};
		}
	/* Function: some
		Tests whether some element in the array passes the test implemented by the provided function.

		See:
			https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/some
		*/
		if (!Array.prototype.some){

			Array.prototype.some = function(fun /*, thisp*/)
				{
				var len = this.length;
				if (typeof fun != "function")
					throw new TypeError();

				var thisp = arguments[1];
				for (var i = 0; i < len; i++)
				{
					if (i in this &&
						fun.call(thisp, this[i], i, this))
					return true;
				}

				return false;
			};
		}

	/* Function: min
		returns the "smallest" member of the array.

		Parameters:
			compare	-	*Optional, default: function(a,b){return a < b}*
							A compare function like sort() uses to determine the minimum
							value

		*/
		Array.prototype.min = function(compare) {
			if (!compare) compare = function(a,b){return a < b}
			return this.reduce(function(result,e){
				if (result === null ||compare(e,result)) {
					return e;
				} else return result;
			},null);
		}

	/* Function: max
		returns the "largest" member of the array.

		Parameters:
			compare	-	*Optional, default: function(a,b){return a > b}*
							A compare function like sort() uses to determaxe the maximum
							value

		*/
		Array.prototype.max = function(compare) {
			if (!compare) compare = function(a,b){return a > b}
			return this.reduce(function(result,e){
				if (result === null ||compare(e,result)) {
					return e;
				} else return result;
			},null);
		}

	/* Function: sum
		returns a sum of the array.

		Parameters:
			accessor	-	*Optional, default: function(element){return element}*
							A function that takes an element of the array and returns a
							value to be summed. This is useful to force integer math or
							to sum a property of the objects in the array rather than
							the objects themselves.

		*/
		Array.prototype.sum = function(accessor) {
			if (!accessor) accessor = function(element){return element}
			return this.reduce(function(result,e){
				return result + accessor(e);
			},0);
		}

	/* Function: avg
		returns an average of the array.

		Parameters:
			accessor	-	*Optional, default: function(element){return element}*
							A function that takes an element of the array and returns a
							value to be averaged. This is useful to force integer math
							or to average a property of the objects in the array rather
							than the objects themselves.
		Note:
			null values are ignored. If you want to count nulls as 0, use this
			_accessor_

			(code)
				function(element){
					return element===null?0:element;
				}
			(end)
		*/
		Array.prototype.avg = function(accessor) {
			if (!accessor) accessor = function(element){return element}
			return this.filter(function(e){
				return accessor(e) !== null;
			}).reduce(function(result,e,index,array){
				if (index < array.length -1){
					return result + accessor(e);
				} else {
					result += accessor(e);
					return result / array.length;
				}
			},0);
		}
	/* Function: last
		returns the last value in this array

		Parameters:
			defaultValue	-	*Optional, default throws error*
								If defined, this value will be returned if the
								Array is empty. Otherwise an error is thrown
		*/
		Array.prototype.last = function(){
			if (this.length) return this[this.length-1]
			if (arguments.length) return arguments[0]
			throw new Error("Attempt to call last() on empty Array without specifying a defaultValue")
		}
	/* Function: first
		returns the first value in this array

		Parameters:
			defaultValue	-	*Optional, default throws error*
								If defined, this value will be returned if the
								Array is empty. Otherwise an error is thrown
		*/
		Array.prototype.first = function(){
			if (this.length) return this[0]
			if (arguments.length) return arguments[0]
			throw new Error("Attempt to call first() on empty Array without specifying a defaultValue")
		}

	/* Function: parse
		Static function that returns an array from an array like object, or null if
		conversion is not possible

		Parameters:
			obj						-	object to convert
			accessFunction		-	*Optional, default function(obj,index){return obj[index]}*
										function that takes _obj_ and an index and returns
										the item at that index
			lengthFunction		-	*Optional, default function(obj){return obj.length}*
										function that takes _obj_ and returns the length of
										the collection

		Detail:
			Takes an array-like object and returns an array containing its items.

		Example:
		(code)
		//convert function arguments into an array of arguments
		function echoArgs(){
			console.log(Array.parse(arguments))
		}

		// client side example:
		// getElementsByTagName() returns an array-like collection, but it doesn't
		// have any of the Array extras like "filter"
		univnm.jslib.debug_window(
			Array.parse(document.getElementsByTagName("div"))
			.filter(function(div){
				return /panel/.test(div.className);
			})
		)
		(end)

		Note:
			Built-in handling exisits for E4X nodes, such that these are valid syntax:

			(code)
				var array = Array.parse(xml.entry.title)
				var array = Array.parse(xml..*)
			(end)
		*/
		Array.parse = function ParseArray(obj,accessFunction,lengthFunction){
			var result =[];
			if (typeof XML != "undefined" && obj instanceof XML){
				accessFunction =  function(obj,index){return obj[index]}
				lengthFunction =function(obj){return obj.length()}
			}
			if (!accessFunction) accessFunction = function(obj,index){return obj[index]}
			if (!lengthFunction) lengthFunction = function(obj){return obj.length}



			for (var x=0; x < lengthFunction(obj); ++x){
				result.push(accessFunction(obj,x));
			}
			return result;
		}

	/* Function: compact
		removes undefined values from an array

		Detail:
			Modifies an array in place by removing values and renumbering the indexes

		Example:
		(code)
			//create an array with 50 null values
			var a=Array.dim(50);
			// now delete half of them
			Array.dim(25).forEach(function(d,i){
				delete a[i];
			})
			console.log(a.length);//prints 50
			//now compact
			a.compact();
			console.log(a.length);//prints 25
		(end)
		*/
		Array.prototype.compact = function compactArray(){
			var a =this;
			for (var i = a.length-1;i >=0;--i){
				if (a[i] === undefined) a.splice(i,1);
			}
		}

	/* Function: contains
		searches an array and returns true if one or more are found

		Parameters:
			search	-	a simple value or a function to identify a matching entry. If
							this is function, it will be called with a the current array
							item and should return *true* if this is a matching item

		Note:
			unlike <indexOf> This function does a loose comparison. This means that
			if, for instance you search for *false*, you will match entries with values
			of null, undefined, "",0,etc

		Examples:
		(code)
			//does the array contain "woot" ?
			return someArray.contains("woot");

			//does the array contain an entry that contains "woot" ?
			return someArray.contains(function(entry){
				return /woot/.test(entry)
			});

			//does the array contain "woot" and "dude"?
			return ["woot","dude"].every(someArray.contains)

			//does the array contain an entry that contains "woot" OR "dude"?
			return ["woot","dude"].some(function(term){
				return someArray.contains(function(entry){
					return new RegExp(term).test(entry);
				})
			})

		(end)
		*/
		Array.prototype.contains = function contains(search){
			for (var x=0; x<this.length;++x){
				if (typeof search === "function"){
					if (search(this[x],x,this)) return true;
				} else {
					if (this[x] == search) return true
				}
			}
			return false;
		}
	/* Function: appendUnique
		adds a new element to this array, if that element is not already in this array.

		Parameters:
			val			-	value to append
			looseCheck	-	*Optional, default false*
								Normally this function uses the "same in type and value"
								operator (===). Setting this argument to true will causes
								this function to use the looser, and slower "same in value"
								operator (==)
			accessor	-	*Optional, default false*
							function to run against each item to retrieve the compared value
		Returns:
			_val_

		*/
		Array.prototype.appendUnique=function(val,looseCheck,accessor){
			var exists;

			if (looseCheck){
				if (!accessor) accessor = function(e){return e}
				exists = this.some(function(e){return accessor(e) == accessor(val)})

			} else if (accessor){
				if (!accessor) accessor = function(e){return e}
				exists = this.some(function(e){return accessor(e) === accessor(val)})
			} else {
				exists = (this.indexOf(val) != -1)
			}
			if (!exists) this.push(val)
			return val
		};
	/* Function: getUnique
		returns a copy of this array that only contains unique items

		Parameters:
			looseCheck	-	*Optional, default false*
								Normally this function uses the "same in type and value"
								operator (===). Setting this argument to true will causes
								this function to use the looser, and slower "same in value"
								operator (==)
			accessor	-	*Optional, default false*
							function to run against each item to retrieve the compared value

		Examples:
		(code)
			//exact matching 1 != "1"
			someArray.getUnique();

			//loose matching 1 == "1"
			someArray.getUnique(true);

			//exact object matching 1 != "1"
			someArray.getUnique(false,function(e){return e.name});

			//loose object matching 1 == "1"
			someArray.getUnique(true,function(e){return e.name});
		(end)
		*/
		Array.prototype.getUnique=function(looseCheck,accessor){
			if (!accessor) accessor = function(e){return e}
			return this.filter(function(curVal,i,a){
				return !a.slice(i+1).some(function(futureVal){
					if (looseCheck){
						return accessor(curVal) == accessor(futureVal)
					} else {
						return accessor(curVal) === accessor(futureVal)
					}
				})
			})
		};

	/* Function: toDataSet
		returns a new DataSet object based on this array

		Parameters:
			columns		-	*Optional, default first row properties*
							Array of strings. If defined this overrides DataSet's
							column detection

		Note:
		if DataSet is not included, this array is returned


		*/
		Array.prototype.toDataSet=function(columns){
			if (typeof univnm.DataSet != "undefined"){
				return new univnm.DataSet({
					columns:columns||univnm.ObjectLib.getKeys(this[0]),
					data:this
				})
			} else return thi
		};



/* Class: String
	Additional functions on the JS String object


	*/

	/* Property: htmlEscapeChars
		array of characters to be translated by <escapeHtml> and <unEscapeHtml>
		*/
		String.htmlEscapeChars=[
			";",
			"&",
			"#",
			"<",
			">",
			"'",
			"\"",
			"(",
			")",
			"%",
			"+",
			"-"
		];


		String.regexEscapeChars=[
			",",
			"/",
			"*",
			"+",
			"?",
			"|",
			"{",
			"[",
			"(",
			")",
			"^",
			"$",
			".",
			"#",
			"\\"
		];
	/* Function: after
		returns all the characters after the first _count_ characters

		Parameters:
			count 	-	number of characters to skip

		Example:
		(code)

			var requestDir = $server.requestDir;
			//this is an example only. $server.requestUrl does this for you
			var requestUrl = requestDir.after($server.rootDir.length);
		(end)


		*/
		String.prototype.after=function(count){
			if (count<0 || count > this.length) return "";
			return this.slice(count);
		};
	/* Function: before
		returns all the characters before the last _count_ characters

		Parameters:
			count 	-	number of characters to remove from the end of the string

		Example:
		(code)
			var requestUrl = $server.requestUrl;
			var contextRelativeUrl = requestUrl.after($server.rootUrl.length);
			//this is an example only. $server.rootDir does this for you
			var rootDir = $server.requestDir.before(contextRelativeUrl.length);
		(end)


		*/
		String.prototype.before=function(count){
			if (count<0 || count > this.length) return "";
			return this.substr(0,this.length-count);
		};
	/* function: charToHtmlEntity
		returns the HTML/XML entity of the supplied character in &#code; format where code is the decimal ASCII code

		Parameters:
			c - 1 character string to convert

			*/
		String.charToHtmlEntity = function(c){
			return "&#" + c.charCodeAt(0) + ";";
		};
	/* Function: compareAlpha
		A static sort function that will compare two strings by lexigraphical order.

		Paramters:
			a	-	first string to compare
			b	-	second string to compare


		Returns:
			-1	-	if _a_ > _b_
			 0	-	if _a_ == _b_
			 1	-	if _a_ < _b_



		*/
		String.compareAlpha = function(a,b) {
			a = String(a);
			b = String(b);
			if(a > b){
				return 1;
			}
			if(a < b){
				return -1;
			}
			return 0;

		};
	/* Function: compareAlphaReverse
		A descending version of <compareAlpha>.

		Paramters:
			a	-	first string to compare
			b	-	second string to compare


		Returns:
			-1	-	if _a_ < _b_
			 0	-	if _a_ == _b_
			 1	-	if _a_ > _b_

		see <compareAlpha>
		*/
		String.compareAlphaReverse = function(a,b) {
			return String.compareAlpha(b,a);
		};
	/* Function: compareNatural
		A static sort function that will compare two strings in a natural way.

		Paramters:
			a	-	first string to compare
			b	-	second string to compare


		Returns:
			-1	-	if _a_ > _b_
			 0	-	if _a_ == _b_
			 1	-	if _a_ < _b_

		Detail:
			The standard sort function does ASCII comparisons of the entire string.
			Humans tend to sort based on parts of the string, applying numeric and
			alpha sorts as appropriate, and ignoring case. Take this list:

			(code)
				var stringArray="A8,a10,A11,a14c,a14b9,a14B10,A14B10,a14b10,a9".split(/,/);
			(end)

			Calling stringArray.sort() will result in

			(code)
				A11
				A14B10
				A8
				a10
				a14B10
				a14b10
				a14b9
				a14c
				a9
			(end)

			This is a valid ASCII sort, but doesn't look "right" to humans.
			Calling stringArray.sort(String.compareNatural) will result in

			(code)
				A8
				a9
				a10
				A11
				a14b9
				A14B10
				a14B10
				a14b10
				a14c
			(end)


		*/
		String.compareNatural = function(a,b) {
			var
				left,
				right,
				retVal,
				compare,
				x,
				rightPart,
				leftPart
			;
			left = String(a).toLowerCase().match(/(\D+|\d+)/g);
			right = String(b).toLowerCase().match(/(\D+|\d+)/g);
			if (left === undefined || left === null) {left=[];}
			if (right === undefined || right === null) {right=[];}
			retVal =0;

			//print("<hr> " + a +" to " + b + " <p>")

			compare = function(a,b){
				//check for pure numeric comparison
				if (parseInt(a,10) == a && parseInt(b,10) == b){
					a= parseInt(a,10);
					b= parseInt(b,10);
				}
				//print("comparing " + a + " to " + b +" <br>")
				if ( a < b) {
					return -1;
				}
				if ( a > b){
					return 1;
				}
				return 0;
			};

			for (x=0;x < left.length;++x){
				rightPart = right[x];
				if (rightPart === undefined) {
					retVal = 0;
					continue;
				}
				leftPart = left[x];
				if (leftPart === undefined) {
					retVal = 0;
					continue;
				}

				retVal=compare(leftPart,rightPart);
				if (retVal !== 0) {break;}
			}
			//print("returning " + retVal)
			return retVal;
		};
	/* Function: compareNaturalReverse
		A descending version of <compareNatural>.

		Paramters:
			a	-	first string to compare
			b	-	second string to compare


		Returns:
			-1	-	if _a_ < _b_
			 0	-	if _a_ == _b_
			 1	-	if _a_ > _b_

		see <compareNatural>
		*/
		String.compareNaturalReverse = function(a,b) {
			return String.compareNatural(b,a);
		};
	/* Function: compareNumeric
		A static sort function that will compare two strings by lexigraphical order.

		Paramters:
			a	-	first string to compare
			b	-	second string to compare


		Returns:
			-1	-	if _a_ > _b_
			 0	-	if _a_ == _b_
			 1	-	if _a_ < _b_



		*/
		String.compareNumeric = function(a,b) {
			a = parseFloat(a);
			b = parseFloat(b);
			if(a > b){
				return 1;
			}
			if(a < b){
				return -1;
			}
			return 0;

		};
	/* Function: compareNumericReverse
		A descending version of <compareNumeric>.

		Paramters:
			a	-	first string to compare
			b	-	second string to compare


		Returns:
			-1	-	if _a_ < _b_
			 0	-	if _a_ == _b_
			 1	-	if _a_ > _b_

		see <compareNumeric>
		*/
		String.compareNumericReverse = function(a,b) {
			return String.compareNumeric(b,a);
		};
	/* Function: escapeHtml
		replaces common symbols with their HTML entity equivalents

		Detail:
			the purpose of this function is to prevent a string from being
			interpreted as HTML/Javascript when output on a webpage. Becasue nearly
			all user supplied input wll eventually be displayed on a web page, this
			function is executed against all input be default.

		Returns:
			converted string

		Detail:
			escapes the following symbols:
			(code)
			;	becomes &#59;
			&	becomes &#38;
			#	becomes &#35;
			<	becomes &#60;
			>	becomes &#62;
			'	becomes &#39;
			"	becomes &#34;
			(	becomes &#40;
			)	becomes &#41;
			%	becomes &#37;
			+	becomes &#43;
			-	becomes &#45;
			(end code)
		See:
			<$req.data>,<$req.rawData>,<unEscapeHtml>
		*/
		String.prototype.escapeHtml=function(string){
			var
				new_string = "",
				c,
				x,
				escapeIndex
			;
			for (x=0; x < this.length; ++x){
				c= this.charAt(x);
				escapeIndex =String.htmlEscapeChars.indexOf(c);
				if (escapeIndex !== -1){
					new_string+=String.charToHtmlEntity(c);
				} else {
					new_string+=c;
				}
			}
			return new_string;
		};
	/* Function: escapeRegex
		returns string with symbols that might be interpreted as regex escaped

		Detail:
			the purpose of this function is to prevent a string from being
			interpreted as a regex string when using new RegExp

		Returns:
			converted string

		*/
		String.prototype.escapeRegex=function(string){
			return Array.parse(this,function(o,i){return o.charAt(i)}).map(function(c){
				if (String.regexEscapeChars.indexOf(c) !== -1){
					return "\\" + c;
				} else {
					return c;
				}
			}).join("");

			/* var new_string = ""
			this.length.times(function(x){
				var c= this.charAt(x);
				var escapeIndex =String.regexEscapeChars.indexOf(c);
				if (escapeIndex != -1){
					new_string+="\\" + c;
				} else {
					new_string+=c;
				}
			})
			return new_string; */
		};
	/* Function: format
		returns a string with parameters replaced

		Parameters:
			values...		-	Either multiple value parameters, a single parameter array
									or a JS object containing key/value pairs

		Detail:
			This provides a very simple templating system for strings. Bracketed terms
			(e.g.{1} or {paramName}) in this string are replaced with that matching index
			in _values_. For parameter list or a single parameter array, positional
			terms ({0},{1},...{n}) are replaced. For a single object parameter,
			matching property names are replaced ({age},{height},{DOB})

		Returns:
			converted string

		Example:
			(code)
				var saying = "This is the {0} of our {1}. words:{0},{1}".format("summer","discontent")
				var saying2 = "This is the {season} of our {feeling}. words:{season},{feeling}".format({
					season:"summer",
					feeling:"discontent"
				})
			(end)
		*/
		String.prototype.format=function(values){
			var args = Array.parse(arguments);
			var isArray=false
			if (args.length > 1) {
				isArray = true
			} else  if (args.length == 1 ){
				if(!args[0]) return new String(this);
				if ( typeof args[0] == "object" && "length" in args[0] && "concat" in args[0]){
					args = args[0];
					isArray=true;
				} else if (args[0] == parseFloat(args[0]) || typeof args[0] == "string" || "getTime" in args[0] ){
					isArray = true
				} else {//property object
					args=args[0]
				}
			} else return new String(this);

			if (isArray){
				if (!args.length) return new String(this);
				return this.replace(/{(\d+)}/g, function(match, number) {
					return typeof args[number] != 'undefined'? String(args[number]) : match;
				})
			} else {
				return this.replace(/{(\w+)}/g, function(match, key) {
					return key in args? String(args[key]) : match;
				})
			}
		}



	/* Function: htmlEntityToChar
		returns the chatacter representation of the supplied HTML/XML entity

		Parameters:
			e - HTML/XML entity in &#code; format where code is the decimal ASCII code
			*/
		String.htmlEntityToChar = function(e){
			var code =e.match(/^&#(\d+);$/);
			return String.fromCharCode(code[1]);
		};


	/* Function: left
		returns the left side of a string

		Parameters:
			count 	-	number of characters to return

		Returns:
			The left _count_ characters of _string_



		*/
		String.prototype.left=function(count){
			return this.substr(0,count);
		};
	/* Function: listAppend
		returns new list (string) with value appended (does not modify original string).

		Parameters:
			val			-	String value to append
			delimiter	-	*Optional, default ","*
							String delimiter to append to
							this string before _val_. If this string is empty, or
							currently ends with _delimiter_, _delimiter_ will not be
							appended.
							returned string
			qualifier	-	*Optional, default null*
							String to put before and after _val_

		Returns:
			A new list with _val_ appended.

		*/
		String.prototype.listAppend=function(val, delimiter,qualifier){
			if (!delimiter) {delimiter =",";}
			if (!qualifier) {qualifier ="";}
			val = String(val);
			var result =String(this);
			if (delimiter.length && result.length && result.right(delimiter.length) !== delimiter){
				result += delimiter;
			}
			if (qualifier.length && val.charAt(0) !== qualifier){
				result += qualifier + val + qualifier;
			} else {
				result += val;
			}
			return result;
		};

	/* Function: listAppendUnique
		returns new list (string) with value appended, if not already in list

		Parameters:
			val			-	String value to append
			delimiter	-	*Optional, default ","*
							String delimiter to append to
							this string before _val_. If this string is empty, or
							currently ends with _delimiter_, _delimiter_ will not be
							appended.
							returned string
			qualifier	-	*Optional, default null*
							String to put before and after _val_

		Returns:
			A new list with _val_ appended.

		*/
		String.prototype.listAppendUnique=function(val, delimiter,qualifier){
			if (this.listContains(val, delimiter,qualifier)){
				return  String(this);
			} else {
				return this.listAppend(val, delimiter,qualifier);
			}
		};



	/* Function: listAppendUniqueNoCase
		returns new list (string) with value appended, if not already in list, ignoring case

		Parameters:
			val			-	String value to append
			delimiter	-	*Optional, default ","*
							String delimiter to append to
							this string before _val_. If this string is empty, or
							currently ends with _delimiter_, _delimiter_ will not be
							appended.
							returned string
			qualifier	-	*Optional, default null*
							String to put before and after _val_



		*/
		String.prototype.listAppendUniqueNoCase=function(val, delimiter,qualifier){
			if (this.listContainsNoCase(val, delimiter,qualifier)){
				return  String(this);
			} else {
				return this.listAppendUnique(val, delimiter,qualifier);
			}
		};
	/* Function: listAfter
		returns this list minus the first element.

		Parameters:
			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String that is on both sides of values in the string

		*/
		String.prototype.listAfter=function(delimiter,qualifier){
			if (delimiter === undefined) {delimiter=",";}
			var a = this.listToArray(delimiter);
			if (a.length) {
				a.shift();
				return a.join(delimiter);
			} else {
				return "";
			}
		};
	/* Function: listBefore
		returns this list minus the last element.

		Parameters:
			delimiter	- 	*Optional default ','*
							String delimiter between values


		*/
		String.prototype.listBefore=function(delimiter){
			if (delimiter === undefined) {delimiter=",";}
			var a = this.listToArray(delimiter);
			if (a.length) {
				a.pop();
				return a.join(delimiter);
			} else {
				return "";
			}
		};
	/* Function: listContains
		returns true if list contains the value.

		Parameters:
			val			-	String Value to search for. If _val_ is a list with the same
							delimiter then all values in _val_ must also be in this string
			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String found before and after _val_
		Returns:
			true if _val_ exists in this string

		*/
		String.prototype.listContains=function(val, delimiter, qualifier){
			if (String(val).listLen(delimiter,qualifier) > 1){
				var $this = this;
				return String(val).listToArray(delimiter,qualifier).every(function(val){
					return $this.listFind(val,0,delimiter,qualifier) > -1;
				});
			} else {
				return this.listFind(val,0,delimiter,qualifier) > -1;
			}
		};
	/* Function: listContainsNoCase
		returns true if list contains the value, ignoring case.

		Parameters:
			val			-	String Value to search for. If _val_ is a list with the same
							delimiter then all values in _val_ must also be in this string
			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String that is on both sides of values in the string

		Returns:
			true if _val_ exists in _list_

		*/
		String.prototype.listContainsNoCase=function(val, delimiter,qualifier){
			if (String(val).listLen(delimiter,qualifier) > 1){
				var $this = this;
				return String(val).listToArray(delimiter,qualifier).every(function(val){
					return $this.listFindNoCase(val,0,delimiter,qualifier) > -1;
				});
			} else {
				return this.listFindNoCase(val,0,delimiter,qualifier) > -1;
			}
		};

	/* Function: listFind
		returns the index of a value in a list

		Parameters:
			val			- 	String value to search for

			startFrom	-	*Optional default 0*
							Index to start looking for a match

			delimiter	- 	*Optional default ','*
							String delimiter between values

			qualifier	-	*Optional, default null*
							String that is on both sides of values in the string

		Returns:
			index of first found match, or -1 if no match

		*/
		String.prototype.listFind=function(val,startFrom,delimiter,qualifier){
			var
				arr,
				x
			;

			val = String(val);
			if (startFrom === undefined ) {startFrom = 0;}
			if (!delimiter) {delimiter =",";}
			if (!qualifier) {qualifier ="";}

			if (qualifier && qualifier.length && val.charAt(0) != qualifier){
				qualifier =String(qualifier);
				val = qualifier+val+qualifier;
			}

			arr =this.listToArray(delimiter);
			for (x=startFrom; x < arr.length; ++x){
				if (val == arr[x]) {return x;}
				//else console.log(val +"!="+arr[x])
			}
			return -1;
		};
	/* Function: listFindNoCase
		returns the index of a value in a list, ignoring case

		Parameters:

			val			- 	String value to search for

			startFrom	-	*Optional default 0*
							Index to start looking for a match

			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String that is on both sides of values in the string

		Returns:
			index of first found match, or -1 if no match

		*/
		String.prototype.listFindNoCase=function(val,startFrom,delimiter,qualifier){
			return this.toLowerCase().listFind(String(val).toLowerCase(),startFrom,delimiter,qualifier);
		};

	/* Function: listFirst
		returns the first value of a list.

		Parameters:
			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String that is on both sides of values in the string

		Returns:
			the first value of _list_


		*/
		String.prototype.listFirst=function(delimiter,qualifier){
			if (delimiter === undefined) {delimiter=",";}
			if (qualifier === undefined) {qualifier="";}
			var a = this.listToArray(delimiter);

			if (a.length) {
				return a.shift().match(new RegExp(qualifier+"(.*)" + qualifier))[1];
			} else {
				return "";
			}
		};
	/* Function: listLast
		returns the last value of a list.

		Parameters:
			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String that is on both sides of values in the string
		Returns:
			the last value of _list_


		*/
		String.prototype.listLast=function(delimiter,qualifier){
			if (delimiter === undefined) {delimiter=",";}
			if (qualifier === undefined) {qualifier="";}
			var a = this.listToArray(delimiter);
			if (a.length) {
				return a.pop().match(new RegExp(qualifier+"(.*)" + qualifier))[1];
			} else {
				return "";
			}
		};
	/* Function: listLen
		returns the length of a list

		Parameters:
			delimiter	- 	*Optional default ','*
							String delimiter between values

		Returns:
			number of values in this string


		*/
		String.prototype.listLen=function(delimiter){
			if (!delimiter) {delimiter =",";}
			return this.listToArray(delimiter).length;
		};
	/* Function: listMakeUnique
		returns new list (string) with each item represented only once

		Parameters:
			delimiter	-	*Optional, default ","*
							String delimiter to append to
							this string before _val_. If this string is empty, or
							currently ends with _delimiter_, _delimiter_ will not be
							appended.
							returned string
		*/
		String.prototype.listMakeUnique=function( delimiter){
			var newList = "";
			if (!delimiter) {delimiter=",";}

			this.listToArray(delimiter).forEach(function(item){
				newList = newList.listAppendUnique(item,delimiter);
			});

			return newList;
		};
	/* Function: listMakeUniqueNoCase
		returns new list (string) with each item represented only once, regardless
		of case. If an item appears more than once in different upper/lower case,
		only the first occurance is kept.

		Parameters:
			delimiter	-	*Optional, default ","*
							String delimiter to append to
							this string before _val_. If this string is empty, or
							currently ends with _delimiter_, _delimiter_ will not be
							appended.
		*/
		String.prototype.listMakeUniqueNoCase=function(delimiter){
			var newList = "";
			if (!delimiter) {delimiter=",";}

			this.listToArray(delimiter).forEach(function(item){
				newList = newList.listAppendUniqueNoCase(item, delimiter);
			});
			return newList;
		};
	/* Function: listQualify
		returns new list (string) with each item surrounded by a qualifying symbol

		Parameters:
			symbol		-	*Optional, default ' (single quote)*
			delimiter	-	*Optional, default ","*
								The delimiter for this list
			qualifier	-	*Optional, default null*
								Current qualifier for this list
		*/
		String.prototype.listQualify=function(symbol,delimiter,qualifier){
			var newList = "";
			if (!delimiter) {delimiter=",";}
			if (!qualifier) {qualifier="";}

			this.listToArray(delimiter,qualifier).forEach(function(item){
				newList = newList.listAppend(symbol +item +symbol, delimiter);
			});
			return newList;
		};
	/* Function: listSame
		returns true if the provided list contains the smae elements as this list
		regardless of order. Both lists must use the same qualifier and delimiter

		Parameters:
			list		-	list to compare to this one
			delimiter	- 	*Optional default ','*
							String delimiter between values

		*/
		String.prototype.listSame=function(list,delimiter){
			list=String(list);
			if (!delimiter) {delimiter =",";}

			return this.listToArray(delimiter).sort().join(delimiter)
				=== list.split(delimiter).sort().join(delimiter);
		};

	/* Function: listSameNoCase
		returns true if the provided list contains the smae elements as this list
		regardless of order. Both lists must use the same qualifier and delimiter

		Parameters:
			list		-	list to compare to this one
			delimiter	- 	*Optional default ','*
							String delimiter between values

		*/
		String.prototype.listSameNoCase=function(list,delimiter){
			if (!delimiter) {delimiter =",";}

			return this.toLowerCase().split(delimiter).sort().join(delimiter)
				=== list.toLowerCase().split(delimiter).sort().join(delimiter);
		};
	/* Function: listSort
		returns a copy of this list sorted by the supplied sort function

		Parameters:
			sortFun		-	*Optional, default String.compareAlpha*
							A function that takes two strings and
							returns -1, 0, or 1. If null the default Array sort is
							used. This function will be passed to Array.sort(). The
							String.compare* functions are easy plugins for this

			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String remove from both sides of each item


			Detail:
				This function converts the string list into an array of string items,
				sorts the array with _sortFunc_, and returns the array converted
				back into a string list.

			See:
			*	<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:sort>
			*	<String.compareAlpha>
			*	<String.compareAlphaReverse>
			*	<String.compareNumeric>
			*	<String.compareNumericReverse>
			*	<String.compareNatural>
			*	<String.compareNaturalReverse>
		*/
		String.prototype.listSort=function(sortFunc,delimiter,qualifier){
			if (!delimiter) {delimiter =",";}
			if (!qualifier) {qualifier ="";}

			var array =this.listToArray(delimiter,qualifier);

			array.sort(sortFunc);

			if (qualifier.length){
				array = array.map(function(item){
					return qualifier+item+qualifier;
				});
			}
			return array.join(delimiter);
		};
	/* Function: listToArray
		returns an array of the items in this list

		Parameters:
			delimiter	- 	*Optional default ','*
							String delimiter between values
			qualifier	-	*Optional, default null*
							String remove from both sides of each item
		*/
		String.prototype.listToArray=function(delimiter,qualifier){
			var
				array,
				matches,
				s
			;
			if (!delimiter) {delimiter =",";}
			if (!qualifier) {qualifier ="";}
			if (typeof delimiter === "string"){
				delimiter = delimiter.escapeRegex();
			}

			array =this.split(new RegExp(delimiter)).filter(function(item){
				return item && item.length;
			});

			s = this;
			if (qualifier && qualifier.length){
				array = array.map(function(item){
					matches=item.match(new RegExp(qualifier +"(.*?)"+qualifier));
					if (matches && matches.length ===2){
						return matches[1];
					} else {
						throw new Error("This list "+ s.left(15) +"... does not contain the supplied qualifier: " + qualifier);
					}

				});
			}
			return array;
		};

	/* Function: toFixedWidth
		returns this string padded/truncated to the specified length

		Parameters:
			count 			-	number of characters to return. If this is 0 or negative an
								empty string will be returned
			pad				-	*Optional, default " "*
								Character to add to the right side of the string to pad to
								the fixed width
			placeHolder		-	*Optional, default undefined*
								If defined, this string will be used as the placeholder for
								text removed to make the string fit the the fixed length.
								The length of this string is subtracted from _count_ so that
								the resulting string will not exceed _count_
			truncateFrom	-	*Opitional, default "end"*
								This sets where the placholder will be placed in the string
								and from where characters will be removed. Valid values are
								"start", "middle" and "end"


		Returns:
			returns a string forced to _count_ length, truncating or padding as
			necessary

		Example:
		(code)
			var delim = " | ";
			var str = "Description".toFixedWidth(15) + delim + "Price".toFixedWidth(5) + "\n";
			data.forEach(function(row){
				str += row.desc.toFixedWidth(15," ","...") + delim
						+ "$" + String(row.price).toFixedWidth(4)
			})
		(end)

		*/
		String.prototype.toFixedWidth=function(count,pad,placeHolder,truncateFrom){
			var s = new String(this);
			if (!pad) pad = " ";
			if (!placeHolder) placeHolder = "";
			if (!truncateFrom) truncateFrom = "end";
			if (count < 0) count=0;
			if (count ==0) return "";
			if (s.length == count) return new String(this);

			if (s.length > count){
				switch (truncateFrom.toLowerCase()){
				case "start":
					return placeHolder +s.right(count).after(placeHolder.length);
				case "middle":
					var half = (count - placeHolder.length)/2
					var left = Math.floor(half);
					var right = Math.ceil(half);
					return s.left(left)+ placeHolder + s.right(right);
				case "end":
					return s.left(count).before(placeHolder.length) + placeHolder;

				}
			} else {
				return s + " ".repeat(count -s.length);
			}
		};


	/* Function: parseJson
		Converts a JSON (http://www.json.org) string into an object

		This is a shortcut to <univnm.jslib.jsonDecode>
		Returns:
			Number String Array or Object contained in the JSON text

		Throws:
			*SyntaxError* if not properly formatted

		*/
		String.prototype.parseJson=function(){
			return univnm.jslib.jsonDecode(this)
		};
	/* Function: right
		returns the right side of a string

		Parameters:
			count 	-	number of characters to return

		Returns:
			The right _count_ characters of _string_

		*/
		String.prototype.right=function(count){
			return this.substring(this.length-count);
		};
	/* Function: repeat
		returns a copy of this string repeated _count_ times

		Parameters:
			count 		-	number of times to copy the provided string
			delimiter	-	*Optional, default null* string to put between each copy
							of the string. This will not be placed at the ent of the
							returned string
			qualifier	-	*Optional, default null* string to put before and after
							each copy of the string

		*/
		String.prototype.repeat=function(count,delimiter,qualifier){
			var
				result,
				x
			;
			if (!delimiter) {delimiter ="";}
			if (!qualifier) {qualifier ="";}
			result ="";
			for (x=0; x< count; ++x){
				result += qualifier + String(this) + qualifier;
				if (delimiter.length && x < count-1){
					result += delimiter;
				}
			}
			return result;
		};
	/* Function: titleCap
		Capitalizes the first letter of every word in string

		Returns:
			_text_ with the first letter of every word captialized.



		*/
		String.prototype.titleCap=function(smart){
			if (smart) {
				var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

				return this.replace(/([^\W_]+[^\s\-]*) */g, function (match, p1, index, title) {
					if (index > 0 && index + p1.length !== title.length &&
						p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
						title.charAt(index - 1).search(/[^\s\-]/) < 0) {
						return match.toLowerCase();
					}

					if (p1.substr(1).search(/[A-Z]|\../) > -1) {
						return match;
					}

					return match.charAt(0).toUpperCase() + match.substr(1);
				});
			} else {
				return this.split(/ /).map(function(text){
					if (text.length){
						text=text.substr(0,1).toUpperCase() + text.substr(1).toLowerCase();
					}
					return text;
				}).join(" ");
			}
		};
	/* Function: trim
		returns a new string with beginning and trailing whitespace removed
		*/
		String.prototype.trim=function(){
			return  String(this).replace(/^\s+|\s+$/g,"");
		};
	/* Function: unEscapeHtml
		reverses the replacements in <escapeHtml>

		Parameters:
			chars		-	*Optional default <htmlEscapeChars>* string of characters to
							restore. Leave this undefined to use the same set of
							characters as <escapeHtml>
		Returns:
			converted string


		See:
			<$req.data>,<$req.rawData>,<escapeHtml>
		*/
		String.prototype.unEscapeHtml=function(chars){
			var
				e,
				regex,
				character
			;
			if (!chars){
				chars = String.htmlEscapeChars;
			} else {
				chars = chars.match(/(.)/g);
			}

			return chars.reduce(function(string,c,index,list){
				e = String.charToHtmlEntity(c);
				regex = new RegExp(e,"g");
				character = String.htmlEntityToChar(e);

				return string.replace(regex,character);
			},this);
		};

/* Class: Function
	Additional functions on the JS Function object

	*/
	/* Function: repeat
		executes this function repeatedly, returning results as array

		Parameters:
			count		-	number of times to execute this function

		Detail:
			When this this function is executed, it will be passed 2 parameters:
			_index_ and _count_. _index_ is the current iteration number, starting
			with 0. _count_ is the original _count_ passed to repeat.

		Examples:
		(code)
		//pre-defined function
		var f = function(index,count){
			console.log("loop #" + index + " of " +count+"<br>");
		}
		f.repeat(10);

		//anonymous function
		//The Object keyword is only necessary when not assigning the result
		Object(function(index,count){
			console.log("loop #" + index + " of " +count+"<br>");
		}).repeat(10);

		//building results
		var array = ((function(index,count){
			return(index +","+count)
		}).repeat(10))

		(end)

		See also: <Array.forEach>
		*/
		Function.prototype.repeat = function(count){
			var f = this;
			var result =[];
			for (var x=0; x < count; ++ x){
				result.push(f(x,count));
			}
			return result
		}
	/* Function: bind
		returns a version of this function bound to a specific scope object

		Parameters:
			scope			-	object to bind as "this"
			n1+				-	any arguments after _scope_ will be bound to the function
								as well. Any arguments passed to the returned function will
								appended to these when calling the returned function

		Detail:
			The purpose of this function is to bind a function to a specific scope. If
			this function is later assigned to another object, it will still apply to
			it's bound scope.

		Note:
			This function is API compatible with the EcmaScript 5 "bind" function


		Example:
		(code)
		var obj={
			name"bob"
		}
		var f = function(){
			console.log(this.name)
		}

		var bound =f.bind(obj);

		bound(); //prints bob
		f();//throws an error

		//example using bound arguments

		var logError = Myna.log.bind({},"ERROR");
		logError("something bad happend")

		(end)

		*/
		Function.prototype.bind = Function.prototype.bind ||function(o) {
			 // Save the this and arguments values
			 var self = this, boundArgs = arguments;
			 return function() {
				  // Build up an argument list
				  var args = [], i;
				  for(i = 1; i < boundArgs.length; i++)
						args.push(boundArgs[i]);
				  for(i = 0; i < arguments.length; i++)
						args.push(arguments[i]);
				  // Now invoke self as a method of o
				  return self.apply(o, args);
			 };
		};
	/* Function: cache
		returns a caching version of this function

		Detail:
			The purpose of this function is to create a lazy-loading versiom of this
			function. The first time this function is called, the original function is
			executed, and subsequent calls immediately return the cached value. If
			this function takes a single param that can be converted to a string, then
			that will be used a s a cache key, allowing multiple values to be cached

		Note:
			This will only work properly with functions that do not take parameters.

		Warning:
			*Do not use this for prototype functions*, unless you intend to cache the
			result across ALL instances of this class. To have caching per instance,
			you can set this in the constructor function, or you can create a lazy
			loading version like this:

			(code)
				var myClass = function(){
					//define in constructor
					this.getEmployee=(function(empId){
						...do stuff...
					}).cache()
				}

				//or use lazy-load method
				myClass.prototype.getManager=function(managerId){
					this.getManager =(function(managerId){
						...do stuff...
					}).cache()
					return this.getManager(managerId)
				}
			(end)


		Example:
		(code)
		//old way:

		var f= function getEmployee(empId){
			var my = arguments.callee
			if (!(empId in my)){
				my[empId] = dm.getManager("employees").getById(empId);
				 = value;
			}
			return my[empId];
		}

		//new way:
		var f = (function(empIds){
			return dm.getManager("employees").getById(empId);
		}).cache();
		(end)

		*/
		Function.prototype.cache =function cache(){
			var cache={}
			var func = this
			return function(key){
				key = String(key||"value")
				if (!(key in cache)){
					cache[key] = func.call(this, key);
				}
				return cache[key];
			}
		}
	/* Function: createCallback
		returns a callback function that will execute this function with the
		supplied arguments

		Detail:
			The purpose of this function is to simplify calling a function with a
			defined set of paramters.

		Note:
			This function was adapted from Ext 2.0.1 (http://extjs.com)

		Example:
		(code)
		//old way:
		var f= function(){
			myFunc("woot!",false);
		}

		//new way:
		var f = myFunc.createCallback("woot!",false);
		(end)

		*/
		Function.prototype.createCallback = function(/*args...*/){
			  // make args available, in function below
			  var args = arguments;
			  var method = this;
			  return function() {
					return method.apply(window || $server.globalScope, args);
			  };
		 }

	/* Function: after
		returns a chain function out of this function and another function, new
		function second

		Parameters:
			func		-	a function to chain after this function. This function may
							be a chain function

		See <createChainFunction> for a description of chain functions
		*/
		Function.prototype.after = function(func){
			return Function.createChainFunction([this,func]);
		}

	/* Function: before
		returns a chain function out of this function and another function, new
		function first

		Parameters:
			func		-	a function to chain before this function. This function may
							be a chain function

		See <createChainFunction> for a description of chain functions
		*/
		Function.prototype.before = function(func){
			return Function.createChainFunction([func,this]);
		}
	/* Function: createChainFunction
		returns a function that will execute a chain of functions when called.

		Parameters:
			initialChain		-	*Optional, default []*
									Array to use as the initial function chain

		Detail:
			This creates a function that will execute a chain of functions stored in
			the returned function's chainArray property. Before each function is
			called a chain property will be set on the function with metadata about
			the function chain. See "Chain Object Properties" below. The chain object
			can be used to manipulate the chain by altering the return value from
			previous functions in the chain, altering the arguments to the next
			function in the chain, or by exiting early via chain.exit(). The final
			result of the function chain will be returned by the chain function.

		Note:
			The same "chain" property is passed to each function in the chain and thus
			provides a mechanism for earlier functions in the chain to communicate
			with later functions in the chain

		Chain Object Properties:
			exitChain			-	If set to true, then no other functions in the chain
									will be executed and the return from this function
									will be the final one. See the _exit_ function for
									combining this setting with a return
			lastReturn		-	The return value from the function that executed before
									this one in the chain
			args				-	An array of the arguments to the next function in the
									chain. Altering this array will alter the arguments to
									the next function
			index				-	The 0-based position of this function in the chain
			array				-	The complete array of functions in this chain
			exit(retval)		-	a function that takes a return value and sets
									_exitChain_ to true and returns _retval_ as the final
									value

		Example:
		(code)
			var obj={
				stuff:function (text){
					console.log("in orig")
					return text + " " + this.myVal;
				},
				myVal:"firstObj"
			}

			var obj2={
				myVal:"secondObj"
			}


			obj.stuff=obj.stuff.before(function(text){
				var chain = arguments.callee.chain;
				console.log("in before")
				chain.args[0] = "before " + text
				if (text == "dude!"){
					// exit now with this return value, nothing after will be executed
					chain.exit("sweet!")
				}

			})

			obj.stuff=obj.stuff.after(function(text){
				var chain = arguments.callee.chain;
				console.log("in after")
				return chain.lastReturn + " after "
			})

			console.log(obj.stuff("woot!") +"<hr>");
			console.log(obj.stuff("dude!") +"<hr>");

			obj2.stuff = obj.stuff;
			console.log(obj2.stuff("woot!") +"<hr>");
		(end)

		See Also:
			* <Function.before>
			* <Function.after>
			* <univnm.ObjectLib.before>
			* <univnm.ObjectLib.after>
		*/
		Function.createChainFunction=function(initialChain){
			var f = function(){
				var functions = arguments.callee.chainArray;
				var $this = this;
				//var args = Array.parse(arguments);
				var finalState=functions.reduce(function(state,f,index,array){
					if (state.exitChain) return state;
					f.chain = state;
					f.chain.index = index;
					f.chain.array = array;
					f.chain.exit = function(retval){
						throw {retval:retval}
					}
					try{
						state.lastReturn=f.apply($this,state.args);
					} catch(e){
						if ("retval" in e){
							state.lastReturn = e.retval;
							state.exitChain=true
						}else{
							throw e;
						}
					}
					state.args = f.chain.args
					return state;
				},{
					exitChain:false,
					lastReturn:undefined,
					args:Array.parse(arguments)
				})

				return finalState.lastReturn;
			}
			f.chainArray=(initialChain||[]).reduce(function(chain,f){
				//expand nested chains
				if ("chainArray" in f){
					f.chainArray.forEach(function(f){
						//we'll assume no further nested chains
						chain.push(f);
					})

				} else {
					chain.push(f);
				}
				return chain;
			},[])

			return f;
		}
	/* Function: createDelegate
		returns a function that executes this function with supplied scope and
		arguments

		Parameters:
			obj			-	*Optional, default window or $server.globalScope*
							object to use as the "this" scope when the function is
							executed
			args		-	*Optional, default[]*
							Array of arguments to call this function with.
			appendArgs	-	*Optional, default false*
							- By default, if _args_ is defined, then when this
							delegate is called, any passed arguments will be
							ignored.
							- If _appendArgs_ is a boolean true (not just a
							boolean equivalent), then when this function is called,
							any passed arguments will used, and _args_ will be
							appended to the passed in arguments.
							- If _appendArgs_ is a number, then _args_ will be
							inserted into the passed arguments at the indicated
							position. For example, a value of 0 would cause _args_
							to be placed before the passed in arguments instead of
							after them.


		Detail:
			The purpose of this function is to simplify calling a function with a
			defined set of parameters, and a defined scope.

		Note:
			This function was adapted from Ext 2.0.1 (http://extjs.com)

		Example:
		(code)

			var a={
			myVal:20,
			myFunc:function(label,otherVal){
				console.log("<br>label:" + label + "<br>myVal:" + this.myVal
					+ "<br>otherVal:" + otherVal + "<br>");
			}
		}
		var b;

		// Problem:
		// Can't set default values, and a's function executes against b's properties
		b={
			myVal:10,
			myFunc:a.myFunc
		}
		b.myFunc("Doh!");

		// classic solution:
		b={
			myVal:10,
			myFunc:function(label){
				var args = [label,"calling from b"]

				a.myFunc.apply(a,args);
			}
		}
		b.myFunc("woot!");

		// with createDelegate:
		// appends "calling form b" to the arguments passed to myFunc
		b={
			myVal:10,
			myFunc:a.myFunc.createDelegate(a,["calling from b"],true)
		}
		b.myFunc("woot! woot!");

		(end)
		*/
		 Function.prototype.createDelegate = function(obj, args, appendArgs){
			  var method = this;
			  return function() {
					var callArgs = args || arguments;
					if(appendArgs === true){
						 callArgs = Array.prototype.slice.call(arguments, 0);
						 callArgs = callArgs.concat(args);
					}else if(typeof appendArgs == "number"){
						 callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
						 var applyArgs = [appendArgs, 0].concat(args); // create method call params
						 Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
					}
				var scope;
				if (obj){
					scope=obj;
				} else if (typeof window != "undefined"){
					scope=window;
				} else if (typeof $server != "undefined"){
					scope= $server.globalScope;
				}
					return method.apply(scope, callArgs);
			  };
		 }

	/* Function: createSequence
		creates and returns a combined function call sequence of this function
		followed by the passed function. The resulting function returns the results
		of the orginal function.

		Parameters:
			fcn		-	function to append to this one
			object 	-	*Optional, default window or $server.globalScope*
						The scope of the passed fcn

		Note:
			This function was adapted from Ext 2.0.1 (http://extjs.com)

		Example:
		(code)

		var first = function(){
			print("I am first<br>")
		}
		var second = function(){
			print("I am second<br>")
		}
		var seq  = first.createSequence(second)
		seq();

		(end)
		 */
		Function.prototype.createSequence = function(fcn, scope){
			  if(typeof fcn != "function"){
					return this;
			  }
			  var method = this;
			  return function() {
					var retval = method.apply(this || window, arguments);
				var callScope;
				if (scope){
					callScope=scope;
				} else if (typeof this != "undefined"){
					callScope=this;
				} else if (typeof window != "undefined"){
					callScope=window;
				} else if (typeof $server != "undefined"){
					callScope= $server.globalScope;
				}
					fcn.apply(callScope, arguments);
					return retval;
			  };
		 }

	/* Function: createInterceptor
		returns a function that executes a supplied interceptor function, then this
		function unless the interceptor returns false.

		Parameters:
			fcn		-	function to execute BEFORE this function
			scope	-	scope to execute _fcn_ within

		Detail:
			The passed _fcn_ is called before the this function. If it returns a
			real boolean false (not null or undefined) then this function will not
			be executed. This should only be used on functions that don't noramally
			return a value, such as event functions.

		Note:
			This function was adapted from Ext 2.0.1 (http://extjs.com)

		Example:
		(code)

		var doEmployeeStuff = function(){
			print("Doing useful stuff<br>")
		}
		var doManagerStuff = function(){
			print("Intercepted! Doing manager stuff instead!<br>")
			return false;
		}
		var doWork  = doEmployeeStuff.createInterceptor(doManagerStuff)
		doWork();

		(end)
		*/
		Function.prototype.createInterceptor=function(fcn, scope){
			  if(typeof fcn != "function"){
					return this;
			  }
			  var method = this;
			  return function() {
					fcn.target = this;
					fcn.method = method;
				var callScope;
				if (scope){
					callScope=scope;
				} else if (typeof this != "undefined"){
					callScope=this;
				} else if (typeof window != "undefined"){
					callScope=window;
				} else if (typeof $server != "undefined"){
					callScope= $server.globalScope;
				}
					if(fcn.apply(callScope, arguments) === false){
						 return undefined;
					} else {
						return method.apply(callScope, arguments);
					}
			  };
		}
/* Class: Date
	Enhanced Date handling

	Topic: Licence/Credits
	 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
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

		This date class adapted from http://code.google.com/p/flexible-js-formatting/.

		The date parsing and format syntax is a subset of
		PHP's date(http://www.php.net/date) function, and the formats that are
		supported will provide results equivalent to their PHP versions.

		Adpated from Myna Application Server: <http://www.mynajs.org>

	Topic: Overview/Usage




	Following is the list of all currently supported formats:
	(code)
	Sample date:
	'Wed Jan 10 2007 15:05:01 GMT-0600 (Central Standard Time)'

	Format  Output      Description
	------  ----------  --------------------------------------------------------------
	  d      10         Day of the month, 2 digits with leading zeros
	  D      Wed        A textual representation of a day, three letters
	  j      10         Day of the month without leading zeros
	  l      Wednesday  A full textual representation of the day of the week
	  S      th         English ordinal day of month suffix, 2 chars (use with j)
	  w      3          Numeric representation of the day of the week
	  z      9          The julian date, or day of the year (0-365)
	  W      01         ISO-8601 2-digit week number of year, weeks starting on Monday (00-52)
	  F      January    A full textual representation of the month
	  m      01         Numeric representation of a month, with leading zeros
	  M      Jan        Month name abbreviation, three letters
	  n      1          Numeric representation of a month, without leading zeros
	  t      31         Number of days in the given month
	  L      0          Whether it's a leap year (1 if it is a leap year, else 0)
	  Y      2007       A full numeric representation of a year, 4 digits
	  y      07         A two digit representation of a year
	  a      pm         Lowercase Ante meridiem and Post meridiem
	  A      PM         Uppercase Ante meridiem and Post meridiem
	  g      3          12-hour format of an hour without leading zeros
	  G      15         24-hour format of an hour without leading zeros
	  h      03         12-hour format of an hour with leading zeros
	  H      15         24-hour format of an hour with leading zeros
	  i      05         Minutes with leading zeros
	  s      01         Seconds, with leading zeros
	  u      001 to 999 Milliseconds, with leading zeros
	  O      -0600      Difference to Greenwich time (GMT) in hours
	  o      -06:00      Difference to Greenwich time (GMT) in hours:minutes
	  T      CST        Timezone setting of the machine running the code
	  Z      -21600     Timezone offset in seconds (negative if west of UTC, positive if east)
	(end)

		 Example usage (note that you must escape format specifiers with '\\' to render them as character literals):
	(code)
	var dt = new Date('1/10/2007 03:05:01 PM GMT-0600');
	console.log(dt.format('Y-m-d'));                         //2007-01-10
	console.log(dt.format('F j, Y, g:i a'));                 //January 10, 2007, 3:05 pm
	console.log(dt.format('l, \\t\\he dS of F Y h:i:s A'));  //Wednesday, the 10th of January 2007 03:05:01 PM
	 (end)

		 Here are some standard date/time patterns that you might find helpful.  They
		 are not part of the source of Date.js, but to use them you can simply copy this
		 block of code into any script that is included after Date.js and they will also become
		 globally available on the Date object.  Feel free to add or remove patterns as needed in your code.
		 (code)
	Date.patterns = {
		ISO8601Long:"Y-m-d H:i:s",
		ISO8601Short:"Y-m-d",
		ShortDate: "n/j/Y",
		LongDate: "l, F d, Y",
		FullDateTime: "l, F d, Y g:i:s A",
		MonthDay: "F d",
		ShortTime: "g:i A",
		LongTime: "g:i:s A",
		SortableDateTime: "Y-m-d\\TH:i:s",
		UniversalSortableDateTime: "Y-m-d H:i:sO",
		YearMonth: "F, Y"
	};
	(end)

		 Example usage:
		 (code)
	var dt = new Date();
	console.log(dt.format(Date.patterns.ShortDate));
	(end)
	*/

	Date.parseFunctions = {count:0};
	Date.parseRegexes = [];
	Date.formatFunctions = {count:0};

	Date.prototype.dateFormat = function(format, ignore_offset) {
		if (Date.formatFunctions[format] == null) {
			Date.createNewFormat(format);
		}
		var func = Date.formatFunctions[format];
		if (ignore_offset || ! this.offset) {
		  return this[func]();
		} else {
		  return (new Date(this.valueOf() - this.offset))[func]();
		}
	};
	/* Function: format
		 Formats a date given the supplied format string
		 format - {String}The format string

		Returns:
		 {String} The formatted date
		 @method
		*/
		Date.prototype.format =Date.prototype.dateFormat

		Date.createNewFormat = function(format) {
			var funcName = "format" + Date.formatFunctions.count++;
			Date.formatFunctions[format] = funcName;
			var code = "Date.prototype." + funcName + " = function(){return ";
			var special = false;
			var ch = '';
			for (var i = 0; i < format.length; ++i) {
				ch = format.charAt(i);
				if (!special && ch == "\\") {
					special = true;
				}
				else if (special) {
					special = false;
					code += "'" + Date.escape(ch) + "' + ";
				}
				else {
					code += Date.getFormatCode(ch);
				}
			}
			eval(code.substring(0, code.length - 3) + ";}");
		};

		Date.getFormatCode = function(character) {
			switch (character) {
			case "d":
				return "Date.leftPad(this.getDate(), 2, '0') + ";
			case "D":
				return "Date.dayNames[this.getDay()].substring(0, 3) + ";
			case "j":
				return "this.getDate() + ";
			case "l":
				return "Date.dayNames[this.getDay()] + ";
			case "S":
				return "this.getSuffix() + ";
			case "w":
				return "this.getDay() + ";
			case "z":
				return "this.getDayOfYear() + ";
			case "W":
				return "this.getWeekOfYear() + ";
			case "F":
				return "Date.monthNames[this.getMonth()] + ";
			case "m":
				return "Date.leftPad(this.getMonth() + 1, 2, '0') + ";
			case "M":
				return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
			case "n":
				return "(this.getMonth() + 1) + ";
			case "t":
				return "this.getDaysInMonth() + ";
			case "L":
				return "(this.isLeapYear() ? 1 : 0) + ";
			case "Y":
				return "this.getFullYear() + ";
			case "y":
				return "('' + this.getFullYear()).substring(2, 4) + ";
			case "a":
				return "(this.getHours() < 12 ? 'am' : 'pm') + ";
			case "A":
				return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
			case "g":
				return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
			case "G":
				return "this.getHours() + ";
			case "h":
				return "Date.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
			case "H":
				return "Date.leftPad(this.getHours(), 2, '0') + ";
			case "i":
				return "Date.leftPad(this.getMinutes(), 2, '0') + ";
			case "s":
				return "Date.leftPad(this.getSeconds(), 2, '0') + ";
			case "O":
				return "this.getGMTOffset() + ";
			case "T":
				return "this.getTimezone() + ";
			case "Z":
				return "(this.getTimezoneOffset() * -60) + ";
			default:
				return "'" + Date.escape(character) + "' + ";
			}
		};

	/* function: toJSON
	 Make toJSON consistent across all browsers
	*/
	Date.prototype.toJSON = function() {
		return "/Date(" + this.getTime() + ")/";
	}


	/* function: parseDate
		 Parses the passed string using the specified format. Note that this function expects dates in normal calendar
		 format, meaning that months are 1-based (1 = January) and not zero-based like in JavaScript dates.  Any part of
		 the date format that is not specified will default to the current date value for that part.  Time parts can also
		 be specified, but default to 0.  Keep in mind that the input date string must precisely match the specified format
		 string or the parse operation will fail.
		 Example Usage:
		(code)
		//dt = Fri May 25 2007 (current date)
		var dt = new Date();

		//dt = Thu May 25 2006 (today's month/day in 2006)
		dt = Date.parseDate("2006", "Y");

		//dt = Sun Jan 15 2006 (all date parts specified)
		dt = Date.parseDate("2006-1-15", "Y-m-d");

		//dt = Sun Jan 15 2006 15:20:01 GMT-0600 (CST)
		dt = Date.parseDate("2006-1-15 3:20:01 PM", "Y-m-d h:i:s A" );
		(end)
			 input - {String}The unparsed date as a string
			 format - {String}The format the date is in

		Returns:
		 {Date} The parsed date
			 @static
		*/
		Date.parseDate = function(input, format) {
			if (Date.parseFunctions[format] == null) {
				Date.createParser(format);
			}
			var func = Date.parseFunctions[format];
			return Date[func](input);
		};

		Date.createParser = function(format) {
			var funcName = "parse" + Date.parseFunctions.count++;
			var regexNum = Date.parseRegexes.length;
			var currentGroup = 1;
			Date.parseFunctions[format] = funcName;

			var code = "Date." + funcName + " = function(input){\n"
				+ "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = 0;\n"
				+ "var d = new Date();\n"
				+ "y = d.getFullYear();\n"
				+ "m = d.getMonth();\n"
				+ "d = d.getDate();\n"
				+ "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
				+ "if (results && results.length > 0) {" ;
			var regex = "";

			var special = false;
			var ch = '';
			for (var i = 0; i < format.length; ++i) {
				ch = format.charAt(i);
				if (!special && ch == "\\") {
					special = true;
				}
				else if (special) {
					special = false;
					regex += Date.escape(ch);
				}
				else {
					obj = Date.formatCodeToRegex(ch, currentGroup);
					currentGroup += obj.g;
					regex += obj.s;
					if (obj.g && obj.c) {
						code += obj.c;
					}
				}
			}

			code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
				+ "{return new Date(y, m, d, h, i, s).applyOffset(z);}\n"
				+ "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
				+ "{return new Date(y, m, d, h, i).applyOffset(z);}\n"
				+ "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
				+ "{return new Date(y, m, d, h).applyOffset(z);}\n"
				+ "else if (y > 0 && m >= 0 && d > 0)\n"
				+ "{return new Date(y, m, d).applyOffset(z);}\n"
				+ "else if (y > 0 && m >= 0)\n"
				+ "{return new Date(y, m).applyOffset(z);}\n"
				+ "else if (y > 0)\n"
				+ "{return new Date(y).applyOffset(z);}\n"
				+ "}return null;}";

			Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
			eval(code);
		};

		Date.formatCodeToRegex = function(character, currentGroup) {
			switch (character) {
			case "D":
				return {g:0,
				c:null,
				s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
			case "j":
			case "d":
				return {g:1,
					c:"d = parseInt(results[" + currentGroup + "], 10);\n",
					s:"(\\d{1,2})"};
			case "l":
				return {g:0,
					c:null,
					s:"(?:" + Date.dayNames.join("|") + ")"};
			case "S":
				return {g:0,
					c:null,
					s:"(?:st|nd|rd|th)"};
			case "w":
				return {g:0,
					c:null,
					s:"\\d"};
			case "z":
				return {g:0,
					c:null,
					s:"(?:\\d{1,3})"};
			case "W":
				return {g:0,
					c:null,
					s:"(?:\\d{2})"};
			case "F":
				return {g:1,
					c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
					s:"(" + Date.monthNames.join("|") + ")"};
			case "M":
				return {g:1,
					c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
					s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
			case "n":
			case "m":
				return {g:1,
					c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
					s:"(\\d{1,2})"};
			case "t":
				return {g:0,
					c:null,
					s:"\\d{1,2}"};
			case "L":
				return {g:0,
					c:null,
					s:"(?:1|0)"};
			case "Y":
				return {g:1,
					c:"y = parseInt(results[" + currentGroup + "], 10);\n",
					s:"(\\d{4})"};
			case "y":
				return {g:1,
					c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
						+ "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
					s:"(\\d{1,2})"};
			case "a":
				return {g:1,
					c:"if (results[" + currentGroup + "] == 'am') {\n"
						+ "if (h == 12) { h = 0; }\n"
						+ "} else { if (h < 12) { h += 12; }}",
					s:"(am|pm)"};
			case "A":
				return {g:1,
					c:"if (results[" + currentGroup + "] == 'AM') {\n"
						+ "if (h == 12) { h = 0; }\n"
						+ "} else { if (h < 12) { h += 12; }}",
					s:"(AM|PM)"};
			case "g":
			case "G":
			case "h":
			case "H":
				return {g:1,
					c:"h = parseInt(results[" + currentGroup + "], 10);\n",
					s:"(\\d{1,2})"};
			case "i":
				return {g:1,
					c:"i = parseInt(results[" + currentGroup + "], 10);\n",
					s:"(\\d{2})"};
			case "s":
				return {g:1,
					c:"s = parseInt(results[" + currentGroup + "], 10);\n",
					s:"(\\d{2})"};
			case "O":
			case "P":
				return {g:1,
					c:"z = Date.parseOffset(results[" + currentGroup + "], 10);\n",
					s:"(Z|[+-]\\d{2}:?\\d{2})"}; // "Z", "+05:00", "+0500" all acceptable.
			case "T":
				return {g:0,
					c:null,
					s:"[A-Z]{3}"};
			case "Z":
				return {g:1,
					c:"s = parseInt(results[" + currentGroup + "], 10);\n",
					s:"([+-]\\d{1,5})"};
			default:
				return {g:0,
					c:null,
					s:Date.escape(character)};
			}
		};


		Date.parseOffset = function(str) {
		  if (str == "Z") { return 0 ; } // UTC, no offset.
		  var seconds ;
		  seconds = parseInt(str[0] + str[1] + str[2]) * 3600 ; // e.g., "+05" or "-08"
		  if (str[3] == ":") {            // "+HH:MM" is preferred iso8601 format ("O")
			seconds += parseInt(str[4] + str[5]) * 60;
		  } else {                      // "+HHMM" is frequently used, though. ("P")
			seconds += parseInt(str[3] + str[4]) * 60;
		  }
		  return seconds ;
		};

		// convert the parsed date into UTC, but store the offset so we can optionally use it in dateFormat()
		Date.prototype.applyOffset = function(offset_seconds) {
		  this.offset = offset_seconds * 1000 ;
		  this.setTime(this.valueOf() + this.offset);
		  return this ;
		};
		/* function: getTimezone
			 Get the timezone abbreviation of the current date (equivalent to the format specifier 'T').

		Returns:
		 {String} The abbreviated timezone name (e.g. 'CST')
		 */
		Date.prototype.getTimezone = function() {
			return this.toString().replace(
				/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(
				/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3").replace(
				/^.*?[0-9]{4} \(([A-Z]{3})\)/, "$1");
		};

		/* Function: getGMTOffset
			 Get the offset from GMT of the current date (equivalent to the format specifier 'O').

		Returns:
		 {String} The 4-character offset string prefixed with + or - (e.g. '-0600')
		 */
		Date.prototype.getGMTOffset = function() {
			return (this.getTimezoneOffset() > 0 ? "-" : "+")
				+ Date.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0")
				+ Date.leftPad(this.getTimezoneOffset() % 60, 2, "0");
		};

		/* Function: getDayOfYear
			 Get the numeric day number of the year, adjusted for leap year.

		Returns:
		 {Number} 0 through 364 (365 in leap years)
		 */

		Date.prototype.getDayOfYear = function() {
			var num = 0;
			Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
			for (var i = 0; i < this.getMonth(); ++i) {
				num += Date.daysInMonth[i];
			}
			return num + this.getDate() - 1;
		};

		/* Function: getWeekOfYear
			 Get the string representation of the numeric week number of the year
			 (equivalent to the format specifier 'W').

		Returns:
		 {String} '00' through '52'
		 */
		Date.prototype.getWeekOfYear = function() {
			// Skip to Thursday of this week
			var now = this.getDayOfYear() + (4 - this.getDay());
			// Find the first Thursday of the year
			var jan1 = new Date(this.getFullYear(), 0, 1);
			var then = (7 - jan1.getDay() + 4);
			document.write(then);
			return Date.leftPad(((now - then) / 7) + 1, 2, "0");
		};

		/* Function:
			 Whether or not the current date is in a leap year.

		Returns: isLeapYear
		 {Boolean} True if the current date is in a leap year, else false
		 */
		Date.prototype.isLeapYear = function() {
			var year = this.getFullYear();
			return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
		};

		/* Function: getFirstDayOfMonth
			 Get the first day of the current month, adjusted for leap year.  The returned value
			 is the numeric day index within the week (0-6) which can be used in conjunction with
			 the {@link #monthNames} array to retrieve the textual day name.
			 Example:
			(code)
		var dt = new Date('1/10/2007');
		console.log(Date.dayNames[dt.getFirstDayOfMonth()]); //output: 'Monday'
		(end)

		Returns:
		 {Number} The day number (0-6)
		 */
		Date.prototype.getFirstDayOfMonth = function() {
			var day = (this.getDay() - (this.getDate() - 1)) % 7;
			return (day < 0) ? (day + 7) : day;
		};

		/* Function: getLastDayOfMonth
			 Get the last day of the current month, adjusted for leap year.  The returned value
			 is the numeric day index within the week (0-6) which can be used in conjunction with
			 the {@link #monthNames} array to retrieve the textual day name.
			 Example:
			(code)
		var dt = new Date('1/10/2007');
		console.log(Date.dayNames[dt.getLastDayOfMonth()]); //output: 'Wednesday'
		(end)

		Returns:
		 {Number} The day number (0-6)
		 */
		Date.prototype.getLastDayOfMonth = function() {
			var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
			return (day < 0) ? (day + 7) : day;
		};

		/* Function: getDaysInMonth
			 Get the number of days in the current month, adjusted for leap year.

		Returns:
		 {Number} The number of days in the month
		 */
		Date.prototype.getDaysInMonth = function() {
			Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
			return Date.daysInMonth[this.getMonth()];
		};

		/* Function: getSuffix
			 Get the English ordinal suffix of the current day (equivalent to the format specifier 'S').

		Returns:
		 {String} 'st, 'nd', 'rd' or 'th'
		 */
		Date.prototype.getSuffix = function() {
			switch (this.getDate()) {
				case 1:
				case 21:
				case 31:
					return "st";
				case 2:
				case 22:
					return "nd";
				case 3:
				case 23:
					return "rd";
				default:
					return "th";
			}
		};

		Date.escape = function(string) {
			return string.replace(/('|\\)/g, "\\$1");
		};

		Date.leftPad = function (val, size, ch) {
			var result = new String(val);
			if (ch == null) {
				ch = " ";
			}
			while (result.length < size) {
				result = ch + result;
			}
			return result;
		};

		Date.daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
		Date.monthNames =
		   ["January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"];
		Date.dayNames =
		   ["Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"];
		Date.y2kYear = 50;
		Date.monthNumbers = {
			Jan:0,
			Feb:1,
			Mar:2,
			Apr:3,
			May:4,
			Jun:5,
			Jul:6,
			Aug:7,
			Sep:8,
			Oct:9,
			Nov:10,
			Dec:11};
		Date.patterns = {
			ISO8601LongPattern: "Y\\-m\\-d\\TH\\:i\\:sO",
			ISO8601ShortPattern: "Y\\-m\\-d",
			ShortDatePattern: "n/j/Y",
			LongDatePattern: "l, F d, Y",
			FullDateTimePattern: "l, F d, Y g:i:s A",
			MonthDayPattern: "F d",
			ShortTimePattern: "g:i A",
			LongTimePattern: "g:i:s A",
			SortableDateTimePattern: "Y-m-d\\TH:i:s",
			UniversalSortableDateTimePattern: "Y-m-d H:i:sO",
			YearMonthPattern: "F, Y"};

		/* Function: clone
			 Creates and returns a new Date instance with the exact same date value as the called instance.
			 Dates are copied and passed by reference, so if a copied date variable is modified later, the original
			 variable will also be changed.  When the intention is to create a new variable that will not
			 modify the original instance, you should create a clone.

			 Example of correctly cloning a date:
			 (code)
		//wrong way:
		var orig = new Date('10/1/2006');
		var copy = orig;
		copy.setDate(5);
		console.log(orig);  //returns 'Thu Oct 05 2006'!

		//correct way:
		var orig = new Date('10/1/2006');
		var copy = orig.clone();
		copy.setDate(5);
		console.log(orig);  //returns 'Thu Oct 01 2006'
		(end)

		Returns:
		 {Date} The new Date instance
		 */
		Date.prototype.clone = function() {
			return new Date(this.getTime());
		};

		/* Function: clearTime
			 Clears any time information from this date
		 clone - {Boolean}true to create a clone of this date, clear the time and return it

		Returns:
		 {Date} this or the clone
		 */
		Date.prototype.clearTime = function(clone){
			if(clone){
				return this.clone().clearTime();
			}
			this.setHours(0);
			this.setMinutes(0);
			this.setSeconds(0);
			this.setMilliseconds(0);
			return this;
		};


		/*   Date interval constant @static @type String */
		Date.MILLI = "ms";
		/*   Date interval constant @static @type String */
		Date.SECOND = "s";
		/*   Date interval constant @static @type String */
		Date.MINUTE = "mi";
		/*   Date interval constant @static @type String */
		Date.HOUR = "h";
		/*   Date interval constant @static @type String */
		Date.DAY = "d";
		/*   Date interval constant @static @type String */
		Date.MONTH = "mo";
		/*   Date interval constant @static @type String */
		Date.YEAR = "y";

		/* Function: add
			 Provides a convenient method of performing basic date arithmetic.  This method
			 does not modify the Date instance being called - it creates and returns
			 a new Date instance containing the resulting date value.

			 Parameters:
			 interval			-	Either a Date Interval Type (see below) or a time in
									milliseconds to add to this date (see <Date.getInterval>).
									If this is a negative time, it will be subtracted
			 value				-	*Optional default 0*
									This is only necessary if _interval_ is a Date Interval
									Type (see below). In that case this the number of units to
									add. If this is a negative value it will be subtracted

			Date Interval Types:
				Date.MILLI 	-	"ms"
				Date.SECOND 	-	"s"
				Date.MINUTE 	-	"mi"
				Date.HOUR 	-	"h"
				Date.DAY 		-	"d"
				Date.MONTH	-	"mo"
				Date.YEAR		-	"y"

			Returns:
				The new Date instance

			Examples:
			(code)
			//Basic usage:
			var dt = new Date('10/29/2006').add(Date.DAY, 5);
			console.log(dt); //returns 'Fri Oct 06 2006 00:00:00'

			//can also use string codes:
			var dt = new Date('10/29/2006').add("d", 5);
			console.log(dt); //returns 'Fri Oct 06 2006 00:00:00'

			//Or use an interval for applying to multiple dates
			var interval = Date.getInterval("d",7) //one week
			//add a week to all the dates in the 'preDefinedDates' array
			var modifiedDates =preDefinedDates.map(function(date){
				return date.add(interval);
			})


			//Negative values will subtract correctly:
			var dt2 = new Date('10/1/2006').add(Date.DAY, -5);
			console.log(dt2); //returns 'Tue Sep 26 2006 00:00:00'

			//You can even chain several calls together in one line!
			var dt3 = new Date('10/1/2006').add(Date.DAY, 5).add(Date.HOUR, 8).add(Date.MINUTE, -30);
			console.log(dt3); //returns 'Fri Oct 06 2006 07:30:00'
			(end)
		 */
		Date.prototype.add = function(interval, value){
		  var d = this.clone();
		  if (!interval || value === 0) return d;
		  //if we have a numeric interval
		  if (parseInt(interval) == interval) {
			  d.setMilliseconds(this.getMilliseconds() + interval);
			  return d;
		  }
		  switch(interval.toLowerCase()){
			case Date.MILLI:
			  d.setMilliseconds(this.getMilliseconds() + value);
			  break;
			case Date.SECOND:
			  d.setSeconds(this.getSeconds() + value);
			  break;
			case Date.MINUTE:
			  d.setMinutes(this.getMinutes() + value);
			  break;
			case Date.HOUR:
			  d.setHours(this.getHours() + value);
			  break;
			case Date.DAY:
			  d.setDate(this.getDate() + value);
			  break;
			case Date.MONTH:
			  var day = this.getDate();
			  if(day > 28){
				  day = Math.min(day, this.getFirstDateOfMonth().add('mo', value).getLastDateOfMonth().getDate());
			  }
			  d.setDate(day);
			  d.setMonth(this.getMonth() + value);
			  break;
			case Date.YEAR:
			  d.setFullYear(this.getFullYear() + value);
			  break;
		  }
		  return d;
		};

		/*
		 * Copyright (C) 2009 Mark Porter <mark@porterpeople.com>
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
		*/

		/* Function: diff
			 returns returns the time between two date objects

			 Parameters:
				d1		-	First date if lest than _d2_ result will be positive
				d2		-	Second date
				scale	-	*Optional, default Date.MILLI*
							The result will be dived by this interval to produce
							a result in this scale

			 Example:
			 (code)
				//return the difference in the d1 and d2 to the nearest week
				alert("Age: " + Math.round(Date.diff(create_date,new Date(),Date.WEEK)) );

			 (end)
		 */
		Date.diff=function(d1,d2,scale){
			if (!scale) scale = Date.MILLI
			return (d2.getTime() -d1.getTime())/Date.getInterval(scale)
		};
		/* Function: getInterval
			 returns a time interval in milliseconds. This can be used with <Date.add>
			 instead of specifying the type and length

			Parameters:
				interval		-	Either a Date Interval Type (see below) or a time in
									milliseconds to add to this date (see <Date.getInterval>).
									If this is a negative time, it will be subtracted
				count			-	*Optional default 1*
									Number of _interval_ values to return

			Date Interval Types:
				Date.MILLI 	-	"ms"
				Date.SECOND 	-	"s"
				Date.MINUTE 	-	"mi"
				Date.HOUR 	-	"h"
				Date.DAY 		-	"d"
				Date.MONTH	-	"mo"
				Date.YEAR		-	"y"

			Note:
				* Date.MONTH is always 30 days
				* Date.YEAR is always 365 days



			Example:
			(code)
			var interval = Date.getInterval("d",7) //one week
			//add a week to all the dates in the 'preDefinedDates' array
			var modifiedDates = preDefinedDates.map(function(date){
				return date.add(interval);
			})

			(end)
		 */
		Date.getInterval = function(interval, count){
			if (!count) count=1;
			if (!interval) return 0;
			switch(interval.toLowerCase()){
			case Date.MILLI:
				return count
			case Date.SECOND:
				return count * 1000;
			case Date.MINUTE:
				return count * 1000 * 60;
			case Date.HOUR:
				return count * 1000 * 60 *60;
			case Date.DAY:
				return count * 1000 * 60 *60 *24;
			case Date.MONTH:
				return count * 1000 * 60 *60 *24*30;
			case Date.YEAR:
				return count * 1000 * 60 *60 *24*365;
			}
		  return 0;
		};
		/* Function: parseInterval
			 returns an object with a breakdown of the units in an interval

			Parameters:
				interval		-	an interval in milliseconds to format

			returned object properties:
			* milliSeconds
			* seconds
			* minutes
			* hours
			* days
			* weeks
			* years

		 */
		Date.parseInterval = function(interval){

			var second = 1000;
			var minute = second*60;
			var hour = minute*60;
			var day = hour*24;
			var week = day*7;
			var year = day*365;
			var result={}

			result.years = Math.floor(interval/year);
			interval = interval % year;

			result.weeks = Math.floor(interval/week);
			interval = interval % week;


			result.days = Math.floor(interval/day);
			interval = interval % day;

			result.hours = Math.floor(interval/hour);
			interval = interval % hour;

			result.minutes = Math.floor(interval/minute);
			interval = interval % minute;

			result.seconds = Math.floor(interval/second);
			interval = interval % second;

			result.milliseconds = interval;

			return result
		}
		/* Function: formatInterval
			 returns an interval in milliseconds as human readable string.

			Parameters:
				interval		-	an interval in milliseconds to format
				options			-	formating options, see *Options* below

			Options:
				precision 		-	*Optional, default Date.MILLI*
									Level of precision to use. This defines the smallest
									unit to be returned
				scale			-	*Optional, default null*
									Integer. If defined, this is the number of places
									from the left to return. This will ignore empty
									places if _removeEmpty_ is true
				removeEmpty		-	*Optional, default true*
									Boolean. if true, 0 valuse will be stripped from the
									result.
				sep				-	*Optional, default ', '*
									String. Separator to use between time parts
				style			-	*Optional, default 'long'*
									Output style. See *Styles* below

			Styles:
				long		-	Example: 1 year, 1 week, 4 days, 10 hours, 8 minutes, 3 seconds, 667 milliseconds
				short		-	Example: 1y, 1w, 4d, 10h, 8m, 31s, 125ms
				none		-	Example: 1, 1, 4, 10, 9, 1, 642

			Example:
			(code)
				var interval = new Date().getTime() - new Date().add(Date.DAY,-376).clearTime()

				console.log(Date.formatInterval(interval))
				//prints: 1 year, 1 week, 4 days, 10 hours, 11 minutes, 17 seconds, 332 milliseconds

				console.log(Date.formatInterval(interval,{
					precision: Date.SECOND,
					scale:2,
					removeEmpty:false,
					sep:":",
					style:"none"
				}))
				//prints (year:weeks): 1:1

			(end)
		 */
		Date.formatInterval = function(interval,options){
			if (!options) options={}
			univnm.ObjectLib.setDefaultProperties(options,{
				precision: Date.MILLI,
				scale:null,
				removeEmpty:true,
				sep:", ",
				style:"long"
			})


			interval = Math.floor(interval/Date.getInterval(options.precision))
						* Date.getInterval(options.precision);

			var result=[]

			var parts={}

			var parts = Date.parseInterval(interval)

			$O(parts)
			.filter(function(v,k,i){
				return v || !options.removeEmpty
			})
			.filter(function(v,k,i){
				return !options.scale || i < options.scale
			})
			.forEach(function(v,k,i){
				switch (options.style){
				case "none":
					result.push(v);
					break;
				case "short":
					result.push("{0}{1}".format(
						v,
						k=="milliseconds"?"ms":k.left(1)
					))
					break;
				case "long":
				default:
					result.push("{0} {1}".format(
						v,
						v==0 ||v > 1?k:k.before(1)
					))
					break;

				}
			})
			return result.join(options.sep)


		};

	/* Function: monthsBetween
		 [static] returns the number of whole calendar months between two dates

		Parameters:
			d1		-	first date
			d2		-	second date

		Note:
			if d1 > d2 the answer will be negative

	 */
	Date.monthsBetween = function(d1,d2){
		var coefficient=1
		if (d1 > d2) {
			[d1,d2] =[d2,d1];
			coefficient=-1
		}
		var count =0
		while (d1.getYear() < d2.getYear()){
			d1 = d1.add("y",1)
			count+=12
		}
		while (d1.getMonth() < d2.getMonth()){
			d1 = d1.add("mo",1)
			count++
		}
		return coefficient *count;
	}
/*  */


if (!("$env" in this)) this.$env ={}
$env.load =function(){
	var v;
	var env=[{
		name:"mpageType",
		defaultValue:"external"
	},{
		name:"cclMask",
		defaultValue:"{ccl}"
	}]

	env.forEach(function(def){
		var key = "env_" + def.name.toLowerCase();
		var v = univnm.jslib.getQuerystring(key,false);
		if (v) {
			$env[def.name] = v;
			jaaulde.utils.cookies.set(key,v);
			return;
		}
		// OR Cookie
		v = jaaulde.utils.cookies.get(key);
		if (v) {
			$env[def.name] = v;
			return;
		}
		// leave at default
		if (!(def.name in $env)) $env[def.name] = def.defaultValue;
	})
}
$env.load()





