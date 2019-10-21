
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