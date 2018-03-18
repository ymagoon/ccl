/* Topic: MPage Core 
	Core functions for URL based MPages...
	
	This file will declare a global "inMpage" boolean variable that will be true 
	if running inside of powerchart. This is indicated by passing "mpage=true" 
	in the URl. If running on an MPage then the followinf Powerchart functions 
	are defined:
		
		* XMLCclRequest
		* APPLINK
		* MPAGES_EVENT
		* CCLLINK
		* CCLLINKPOPUP
		* CCLNEWPOPUPWINDOW
		
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



/* Property: inMpage 
	are we in an MPage?

	true if:
	* previously set to true	
	* mpage=true appears in the URL 
	* "DiscernObjectFactory" in window.external
*/
if (inMpage === undefined){
	var inMpage = "DiscernObjectFactory" in window.external;
	if (/[\?|&]mpage=true/i.test(location.search.replace(/%26/g,"&"))){
		inMpage = true;
	}
}

if (inMpage){
	window._handleLargeData = function(value){
		if (!document.getElementById("__ID_CCLPostParams_7253__")){
			var el=document.createElement('<input id="__ID_CCLPostParams_7253__" />')
			//el.style.display="none";
			document.body.appendChild(el);
		}
		document.getElementById("__ID_CCLPostParams_7253__").value = value;
		return value.substring(0,2000)
	}
	
	window.APPLINK__ = function(){}
	window.APPLINK = function ( mode, appname, param ){
		param = _handleLargeData(param);
		location.href="javascript:APPLINK__(" + mode + ",\"" + appname + "\",\"" + param + "\"," + param.length +")"
	}
	
	window.CCLLINK__ = function(){}
	window.CCLLINK = function ( program, param, nViewerType ){
		param = _handleLargeData(param);
		location.href = "javascript:CCLLINK__(\""+program +"\",\""+param+"\","+nViewerType+","+param.length+")";
	}
	
	window.MPAGES_EVENT__ = function(){}
	window.MPAGES_EVENT = function ( eventType, eventParams ){
		eventParams = _handleLargeData(eventParams);
		location.href = "javascript:MPAGES_EVENT__(\"" + eventType + "\",\"" + eventParams + "\"," + eventParams.length +")";
	}
	
	window.CCLEVENT__=function(){}
	window.CCLEVENT = function( eventId, eventData ){
		_handleLargeData(eventData);
		location.href ="javascript:CCLEVENT__(\"" + eventId + "\")";
	}


	window.CCLLINKPOPUP__ = function(){}
	window.CCLLINKPOPUP = function ( program, param, sName, sFeatures, bReplace ){
		param = _handleLargeData(param);
		location.href = "javascript:CCLLINKPOPUP__(\"" + program + "\",\"" + param + "\",\"" + sName + "\",\"" + sFeatures + "\"," + bReplace + "," + param.length +")"; 
	}
	
	window.popupWindowHandle=null;
	window.getPopupWindowHandle = function() {
		return popupWindowHandle;
	}
	
	window.CCLNEWPOPUPWINDOW = function (sUrl,sName,sFeatures,bReplace){
		popupWindowHandle = window.open(sUrl,sName,sFeatures,bReplace);
		popupWindowHandle.focus();
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
		window.XMLCclRequest = function(options) {
			/* *********** Attributes *************/
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
				
			/* ************* Events ***************/
				//Raised when there is an error.
				this.onerror = 
				
			/* ************* Methods **************/ 
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
					top.XMLCCLREQUESTOBJECTPOINTER[uniqueId] = this;
					 
					location.href= "javascript:XMLCCLREQUEST_Send(\"" + uniqueId + "\")";
					//var el = document.getElementById("__ID_CCLLINKHref_7443__");
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
		}
		if (!top.XMLCCLREQUESTOBJECTPOINTER){
			top.XMLCCLREQUESTOBJECTPOINTER = [];
		}
		window.evaluate = function evaluate(x)
		{
			try{
				return eval(x.replace(/XMLCCLREQUESTOBJECTPOINTER/g,"top.XMLCCLREQUESTOBJECTPOINTER"))
			} catch(e){
				return 
			}
		}
	
	
} else {
	window.APPLINK = function (mode, appname, param ){
		alert([
			"called APPLINK:",
			"\tmode: " + mode,
			"\tappname: " + appname,
			"\tparam: " + param
		].join("\n"))
	}
	window.CCLLINK= function (program, param, nViewerType ){
		alert([
			"called CCLLINK:",
			"\tprogram: " + program,
			"\tparam: " + param,
			"\tnViewerType: " + nViewerType
		].join("\n"))
	}
	window.MPAGES_EVENT = function ( eventType, eventParams ){
		alert([
			"called MPAGES_EVENT:",
			"\teventType: " + eventType,
			"\teventParams: " + eventParams
		].join("\n"))
	}
	/* window.XMLCclRequest = function(options) {
		alert([
			"called XMLCclRequest"
		].join("\n"))
		return {}
	} */
	window.CCLLINKPOPUP = function ( program, param, sName, sFeatures, bReplace ){
		alert([
			"called CCLLINKPOPUP:",
			"\tprogram: " + program,
			"\tparam: " + param,
			"\tsName: " + sName,
			"\tsFeatures: " + sFeatures,
			"\tbReplace: " + bReplace
		].join("\n"))
	}
}