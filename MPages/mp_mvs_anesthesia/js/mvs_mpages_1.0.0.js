/* 
 * mPages JavaScript Library v1.0.0
 *
 * Copyright (c) 2011 MediView SOlutions
*/
var mp_not_tab = 0;

(function() {

   var 
   // Will speed up references to window, and allows munging its name.
   window = this, 
   // Will speed up references to undefined, and allows munging its name.
   undefined, 
   // Map over mPages in case of overwrite
   _mPages = window.mPages, 
   // Map over the $MP in case of overwrite
   _$MP = window.$MP,   
   mPages = window.mPages = window.$MP = function(options) {
      return new mPages.fn.init(options);
   };

   mPages.fn = mPages.prototype = {
      init: function(options) {
         var opts = {};
         for(opt in mPages.options) {
            opts[opt] = mPages.options[opt];
         }
         this.options = opts;
         extend(this.options, options);
         if (this.options.level != "chart") {
            this.options.params = "^MINE^, value($USR_Personid$)";
         }
         return this;
      }
   };

   // Give the init function the mPages prototype for later instantiation
   mPages.fn.init.prototype = mPages.fn;

   // Information loaded with AJAX should be stored here for later use using
			// $MP.cache(yourDataObj)
   mPages.data = {};

   function extend() {
      // copy reference to target object
      var target = arguments[0] ||
      {}, i = 1, length = arguments.length, deep = true, options;
      // Handle a deep copy situation
      if (target.constructor == Boolean) {
         deep = target;
         target = arguments[1] ||
         {};
         // skip the boolean and the target
         i = 2;
      }
      // Handle case when target is a string or something (possible in deep
						// copy)
      if (typeof target != "object" && typeof target != "function") {
         target = {};
      }
      // extend mPages itself if only one argument is passed
      if (length == i) {
         target = this;
         --i;
      }
      for (; i < length; i++) {
         // Only deal with non-null/undefined values
         if ((options = arguments[i]) != null) {
            // Extend the base object
            for (var name in options) {
               var src = target[name], copy = options[name];
               // Prevent never-ending loop
               if (target === copy) {
                  continue;
               }
               // Recurse if we're merging object values
               if (deep && copy && typeof copy == "object" && !copy.nodeType && !copy.getDate) {
                  target[name] = extend(deep, src || (copy.length != null ? [] : {}), copy);
               }
               // Don't bring in undefined values
               else if (copy !== undefined) {
                  target[name] = copy;
               }
            }
         }
      }
      // Return the modified object
      return target;
   }
   
   mPages.plugin = mPages.fn.plugin = function(extObj) {
      extend(mPages, extObj);
      extend(mPages.fn, extObj);
   }
   
   mPages.plugin({
      // The version of the mPages Controller object being used
      version: "0.5.2",
      
      // The base path for web resource files
      webRoot: "http://dvmstsw01/applications/CernerMPages/",
      
      // User options
      options: {
         
         // The PowerChart level to pass parameters for
         level: "chart",

         // Parameters to be passed to Backend CCL
         params: "^MINE^, value($USR_Personid$), value($PAT_Personid$), value($VIS_Encntrid$)",
         
         default_params:"^MINE^, value($USR_Personid$), value($PAT_Personid$), value($VIS_Encntrid$)",
         
         organizer_params: "^MINE^, value($USR_Personid$),value(^$DEV_Location$^)"

      },
      
      // Merges data objects into $MP.data
      cache: function(data) {
         extend(mPages.data, data);
      },  
      
      load: function(target, data, callback, options) {
         if(typeof(data) == "function") {
            options = callback;
            callback = data;
            data = null;
         }
         if(typeof(callback) != "function") {
            options = callback;
            callback = null;
         }
         var loader = new XMLCclRequest();
         loader.open("GET", target);
         var targetElement = this.options.targetElement;
         loader.onreadystatechange = function() {
            if (this.readyState == 4) {
               if (!this.responseText) {
                  this.responseText = "";
               }
               res = this.responseText.split("\n");
               var cleaned = "";
               for(var x=0,row;row = res[x];x++) {
                  cleaned += row.replace(/^\s*(.*?)\s*$/, "$1");
               }
               if(typeof(targetElement) == "string") {
                  targetElement = document.getElementById(targetElement);
               }
               if (targetElement != null){
               targetElement.innerHTML = cleaned;
               callback(targetElement);
               }
            }
         };
         
         data = data ? ", " + data : "";
         if (mp_not_tab){
         	loader.send(this.options.organizer_params + data);
         }else{
         loader.send(this.options.params + data);
         }
         return this;
      },
      get: function(target, data, callback, options) {
         if(typeof(data) == "function") {
            options = callback;
            callback = data;
            data = null;
         }
         if(typeof(callback) != "function") {
            options = callback;
            callback = null;
         }
         var getter = new XMLCclRequest();
         getter.open("GET", target);
         getter.onreadystatechange = function() {
            if (this.readyState == 4) {
               if (!this.responseText) {
                  this.responseText = "";
               }
               res = this.responseText.split("\n");
               var cleaned = "";
               for(var x=0,row;row = res[x];x++) {
                  cleaned += row.replace(/^\s*(.*?)\s*$/, "$1");
               }
               if (callback) {
                  callback(cleaned);
               }
            }
         };
         
         data = data ? ", " + data : "";
         if (mp_not_tab){
         	getter.send(this.options.organizer_params + data);
         }else{
         getter.send(this.options.params + data);
         }
         return this;
      },    
      
      getJSON: function(target, data, callback, options,overwrite_params) {
         if(typeof(data) == "function") {
            options = callback;
            callback = data;
            data = null;
         }
         var options = options || {};
         var getter = new XMLCclRequest();
         getter.open("GET", target);
         getter.onreadystatechange = function() {
            if (this.readyState == 4) {
               if (!this.responseText) {
               	return;
                  //this.responseText = "{\"ERROR\":{\"MESSAGE\":\"No JSON Returned\"}}";
               }
               //if (options.seeJSON) {
               //$(document.body).html(this.responseText);
               //return;
               //}
               //alert(this.responseText);
               this.responseText = this.responseText.replace(/,\s*\}/g, "}").replace(/,\s*\]/g, "]").split("\n");
               var cleaned = "";
               for(var x=0,row;row = this.responseText[x];x++) {
               	//alert(x);
                  cleaned += row.replace(/^\s*(.*?)\s*$/, "$1");
               }
               cleaned = cleaned.replace(/&#160;/g, " ");
               if (options.seeJSON == 2) {
               $(document.body).html(cleaned);
               return;
               }               
               if (options.seeJSON == 3) {
               	alert(cleaned);
               }
               // alert(cleaned);
               if (options.seeJSON) {
                  $(document.body).html($MP.prettyJSON(cleaned));
               }
               else {
                    callback(eval("(" + cleaned + ")"));
               }
            }
         };
         data = data ? ", " + data : "";
         if (overwrite_params){
            getter.send(overwrite_params + data);
         }else{
         		if (mp_not_tab){
         			getter.send(this.options.organizer_params + data);
         		}else{
            getter.send(this.options.params + data);
         		}
         }
         return this;
      },
		prettyJSON: function(cleaned) {
         // Strip out the bad commas
         cleaned = cleaned.replace(/\n/g, "").replace(/,\s*\}/g, "}").replace(/,\s*\]/g, "]");
         
         // Escape commas and quotes inside quotes
         cleaned = cleaned.replace(/\\\"/g, "&#34;").split("\"");
         for(var x=0,line;line = cleaned[x];x++) {
            if ((x % 2)) {
               cleaned[x] = line.replace(/\,/g, "&#44;").replace(/\[/g, "&#91;").replace(/\]/g, "&#93;");
            }
         }
         cleaned = cleaned.join('"');
         
         // Insert line breaks
         cleaned = cleaned.replace(/,/g, ",\n");
         cleaned = cleaned.replace(/([\[\{])/g, "$1\n").replace(/([\]\}])/g, "\n$1");
         cleaned = cleaned.replace(/\n\n/g, "\n");
         
         // Do the tabbing and the coloring
         var out = "";
         for(var x=0,line;line = cleaned.split("\n")[x];x++) {
            if (line.indexOf("]") >= 0 || line.indexOf("}") >= 0) {
               out += "</blockquote>";
            }
            line = line.replace(/:(.*)?(".*[^\\]")(.*[^,])?(,?)/, ": <div style=\"margin-left:27px;\"><b>$1</b><b style=\"color:blue\">$2</b><b>$3</b>$4</div>");
            line = line.replace(/:(.*)?('.*[^\\]')(.*[^,])?(,?)/, ": <div style=\"margin-left:27px;\"><b>$1</b><b style=\"color:blue\">$2</b><b>$3</b>$4</div>");
            line = line.replace(/^(.*?):/, "<div style=\"clear:left;float:left;margin:0\"><b style=\"color:red\">$1</b> : </div>");
            line = line.replace(/^(".*[^\:\}\]]")(,)?/, "<b style=\"color:green\">$1</b>$2");
            line = line.replace(/^('.*[^\:\}\]]')(,)?/, "<b style=\"color:green\">$1</b>$2");
            out += line;
            if (line.indexOf("<div style") < 0 || line.charAt(line.length - 1) == ",") {
               out += "<br />";
            }
            if (line.indexOf("{") >= 0 || line.indexOf("[") >= 0) {
               out += "<blockquote style='margin:0 0 0 27px'>";
            }
         }
         return "<div style=\"font-family:courier;background:#fff\">" + out + "</div>";
      },
      
      link: function(url, options) {
         var options = options || {};
         if (!document.getElementById("__ID_CCLLINKHref_15194__")) {
            var el = document.createElement("a");
            el.id = "__ID_CCLLINKHref_15194__";
            document.body.appendChild(el);
         }        
         var internal = options.i ? 1 : 100;
         document.getElementById("__ID_CCLLINKHref_15194__").href = 'javascript:APPLINK__(' + internal + ', "' + url + '", "");';
         document.getElementById("__ID_CCLLINKHref_15194__").click();
         if(options.chain) {
            return this;
         }
      },
      
      aLink: function(filePath, options) {
         var options = options || {};
         if (!document.getElementById("__ID_CCLLINKHref_15194__")) {
            var el = document.createElement("a");
            el.id = "__ID_CCLLINKHref_15194__";
            document.body.appendChild(el);
         }        
         document.getElementById("__ID_CCLLINKHref_15194__").href = 'javascript:CCLLINK__("CCL_RREADFILE", "^MINE^, "' + filePath + '", ' + ext + ');';
         document.getElementById("__ID_CCLLINKHref_15194__").click();
         if(options.chain) {
            return this;
         }
      },
      
      cLink: function(ccl, data, options) {
         var options = options || {};
         if (!document.getElementById("__ID_CCLLINKHref_15194__")) {
            var el = document.createElement("a");
            el.id = "__ID_CCLLINKHref_15194__";
            document.body.appendChild(el);
         }
         data = data ? ", " + data : "";
         var ext = options.e ? "0" : "1";
         document.getElementById("__ID_CCLLINKHref_15194__").href = 'javascript:CCLLINK__("' + ccl + '", "' + this.options.params + data + '", ' + ext + ');';
         document.getElementById("__ID_CCLLINKHref_15194__").click();
         if(options.chain) {
            return this;
         }
      }
      
   });
   
})();


var popupWindowHandle;
function getPopupWindowHandle() {
  return popupWindowHandle;
}

XMLCclRequest = function(options) {
   /** ********** Attributes ************ */
   
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
   
   /** ************ Events ************** */
   
   // Raised when there is an error.
   this.onerror = 
   
   /** ************ Methods ************* */ 
   
   // Cancels the current CCL request.
   this.abort = 
   
   // Returns the complete list of response headers.
   this.getAllResponseHeaders = 
   
   // Returns the specified response header.
   this.getResponseHeader = function() {
      return null;
   };
   
   // Assigns method, destination URL, and other optional attributes of a
			// pending request.
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
   
   // Sends a CCL request to the server and receives a response.
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
      
      var el;
      if (!document.getElementById("__ID_CCLLINKHref_22523__"))
      {
        el = document.createElement("a");
        el.id = "__ID_CCLLINKHref_22523__";
        document.body.appendChild(el);
      }else{
        el = document.getElementById("__ID_CCLLINKHref_22523__");
      }
      el.href = "javascript:XMLCCLREQUEST_Send(\"" + uniqueId + "\"" + ")";
      el.click();
   };
   
   // Adds custom HTTP headers to the request.
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
}

XMLCCLREQUESTOBJECTPOINTER = [];
function evaluate(x)
{
	if (x.indexOf("%CCL") > -1) {
		var err_msg = x.substr(x.indexOf("statusText")+14);
		err_msg = err_msg.replace(/</g, "&lt;");
		err_msg = err_msg.replace(/>/g, "&gt;");
		err_msg = err_msg.replace(/\"/g, "&quot;");
		err_msg = err_msg.replace(/{/g, "");
		err_msg = err_msg.replace(/}/g, "");
		x = "{\"CCL-ERROR\":{\"MESSAGE\":\"" + err_msg.substr(0,err_msg.length-16) + "\"}}";
		//$(document.body).html($MP.prettyJSON(x));
		var output = "";
		if (document.getElementById("popup_error_message") == null)
		{
			$(document.body).prepend("<div id='popup_error_message'></div>");
		}else {
			output = $("#popup_error_message").html();
		}
		//return $MP.prettyJSON(x);
		output += $MP.prettyJSON(x);
		
		output += "<br /><input id='err_msg_close_button' type='button' value='Close'></input>";
		$("#popup_error_message").html(output);
		$("#err_msg_close_button").click(function(){
			$("#backgroundPopup").fadeOut("slow");
			$("#popup_error_message").css("display","none");
			$("#popup_error_message").html("");
		});
		//fadeBackground();
		$("#popup_error_message").css("display","block");
		$("#popup_error_message").css("left", "50px");
		$("#popup_error_message").css("top", (document.documentElement.scrollTop + 50) + "px");
		return null;
	}
 try{
 	return eval(x);
	}catch(e){
		
			return null;
	}
}
function CCLLINK__(program, param, nViewerType ){}

function CCLLINK( program, param, nViewerType ){
     var paramLength = param.length;
     if (paramLength > 2000){
         document.getElementById("__ID_CCLPostParams_10102__").value = '"' + param + '"';
         param = param.substring(0, 2000);
     }
     var el;
     if (!document.getElementById("__ID_CCLLINKHref_22523__")){
        el = document.createElement("a");
        el.id = "__ID_CCLLINKHref_22523__";
        document.body.appendChild(el);
     }else{
        el = document.getElementById("__ID_CCLLINKHref_22523__");
     }
     el.href = "javascript:CCLLINK__(\"" + program + "\",\"" + param + "\"," + nViewerType + "," + paramLength +")";
     el.click(); 
  }

function APPLINK__(mode, appname, param ){}

function APPLINK( mode, appname, param ){
     var paramLength = param.length;
     if (paramLength > 2000){
         document.getElementById("__ID_CCLPostParams_15820__").value = '"' + param + '"';
         param = param.substring(0, 2000);
     }
     var el;
     if (!document.getElementById("__ID_CCLLINKHref_19719__")){
        el = document.createElement("a");
        el.id = "__ID_CCLLINKHref_19719__";
        document.body.appendChild(el);
     }else{
        el = document.getElementById("__ID_CCLLINKHref_19719__");
     }
     el.href = "javascript:APPLINK__(" + mode + ",\"" + appname + "\",\"" + param + "\"," + paramLength +")";
     el.click(); 
  }

function CCLEVENT__( eventId, eventData ){}

function CCLEVENT( eventId, eventData ){
document.getElementById("__ID_CCLPostParams_15820__").value = eventData;
var el = document.getElementById("__ID_CCLLINKHref_19719__");
el.href = "javascript:CCLEVENT__(\"" + eventId + "\")";
el.click(); 
}

function CCLLINKPOPUP__(program, param, sName, sFeatures, bReplace){}

function CCLLINKPOPUP( program, param, sName, sFeatures, bReplace ){
     var paramLength = param.length;
     if (paramLength > 2000){
         document.getElementById("__ID_CCLPostParams_15820__").value = '"' + param + '"';
         param = param.substring(0, 2000);
     }
     var el;
     if (!document.getElementById("__ID_CCLLINKHref_19719__")){
        el = document.createElement("a");
        el.id = "__ID_CCLLINKHref_19719__";
        document.body.appendChild(el);
     }else{
        el = document.getElementById("__ID_CCLLINKHref_19719__");
     }
     el.href = "javascript:CCLLINKPOPUP__(\"" + program + "\",\"" + param + "\",\"" + sName + "\",\"" + sFeatures + "\"," + bReplace + "," + paramLength +")";
     el.click(); 
  }

function CCLNEWPOPUPWINDOW(sUrl,sName,sFeatures,bReplace){
popupWindowHandle = window.open(sUrl,sName,sFeatures,bReplace);
popupWindowHandle.focus();
}

function MPAGES_EVENT__(eventType, eventParams ){}

function MPAGES_EVENT( eventType, eventParams ){
	var paramLength = eventParams.length;
	if (paramLength > 2000){
 	if (!document.getElementById("__ID_CCLPostParams_26966__"))
 	{
 		el = document.createElemnt("div");
 		el.id= "__ID_CCLPostParams_26966__";
 		document.body.appendChild(el);
 	}
	 document.getElementById("__ID_CCLPostParams_26966__").value = '"' + eventParams + '"';
	 eventParams = eventParams.substring(0, 2000);
	}
	var el;
 if (!document.getElementById("__ID_CCLLINKHref_28956__")){
  el = document.createElement("a");
  el.id = "__ID_CCLLINKHref_28956__";
  document.body.appendChild(el);
	}else{
	  el = document.getElementById("__ID_CCLLINKHref_28956__");
	}
	el.href = "javascript:MPAGES_EVENT__(\"" + eventType + "\",\"" + eventParams + "\"," + paramLength +")";
	el.click(); 
}
function MPAGES_EVENTOLD( eventType, eventParams ){
 var paramLength = eventParams.length;
 if (paramLength > 2000){
 	if (!document.getElementById("__ID_CCLPostParams_15820__"))
 	{
 		el = document.createElemnt("div");
 		el.id= "__ID_CCLPostParams_15820__";
 		document.body.appendChild(el);
 	}
     document.getElementById("__ID_CCLPostParams_15820__").value = '"' + eventParams + '"';
     eventParams = eventParams.substring(0, 2000);
 }
 var el;
 if (!document.getElementById("__ID_CCLLINKHref_19719__")){
    el = document.createElement("a");
    el.id = "__ID_CCLLINKHref_19719__";
    document.body.appendChild(el);
 }else{
    el = document.getElementById("__ID_CCLLINKHref_19719__");
 }
 el.href = "javascript:MPAGES_EVENT__(\"" + eventType + "\",\"" + eventParams + "\",1)";
 el.click(); 
}
function MPAGES_SVC_EVENT__(uri, params ){}

function MPAGES_SVC_EVENT( uri, params ){
     var paramLength = params.length;
     if (paramLength > 2000){
         document.getElementById("__ID_CCLPostParams_15820__").value = '"' + params + '"';
         params = params.substring(0, 2000);
     }
     var el;
     if (!document.getElementById("__ID_CCLLINKHref_19719__")){
        el = document.createElement("a");
        el.id = "__ID_CCLLINKHref_19719__";
        document.body.appendChild(el);
     }else{
        el = document.getElementById("__ID_CCLLINKHref_19719__");
     }
     el.href = "javascript:MPAGES_SVC_EVENT__(\"" + uri + "\",\"" + params + "\"," + paramLength +")";
     el.click(); 
  }

function CCLNEWSESSIONWINDOW__(sUrl,sName,sFeatures,bReplace,bModal){}

function CCLNEWSESSIONWINDOW(sUrl,sName,sFeatures,bReplace,bModal){
     var el;
     if (!document.getElementById("__ID_CCLLINKHref_19719__")){
        el = document.createElement("a");
        el.id = "__ID_CCLLINKHref_19719__";
        document.body.appendChild(el);
     }else{
        el = document.getElementById("__ID_CCLLINKHref_19719__");
     }
     el.href = "javascript:CCLNEWSESSIONWINDOW__(\"" + sUrl + "\",\"" + sName + "\",\"" + sFeatures + "\"," + bReplace + "," + bModal +")";
     el.click(); 
     popupWindowHandle = window.open(sUrl,sName,sFeatures,bReplace);
     if (popupWindowHandle) popupWindowHandle.focus();
}
function getXmlHttpObject()
{
			if (window.XMLHttpRequest)
    {
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject)
    {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return null;
}
function verify()
{
    if (xmlDoc.readyState != 4)
    {
        return(false);
    }
}
function loadXMLString(txt)
{
    try{
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.onreadystatechange = verify;
        xmlDoc.loadXML(txt);
        return(xmlDoc);
    }catch(e){
        try{
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(txt,"text/xml");
            return(xmlDoc);
        }catch(e){
            alert("error: " + e.message);
        }
    }
    return(null);
}
