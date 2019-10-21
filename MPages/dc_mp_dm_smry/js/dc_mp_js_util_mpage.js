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
;*000 		   Ramkumar Bommireddipalli     ######       Initial Release              *
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
