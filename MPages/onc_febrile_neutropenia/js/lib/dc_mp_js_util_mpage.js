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
    this.responseBody = this.responseXML = this.async = true;
    this.requestBinding = null;
    this.requestText = null;
    
    /************** Events ***************/
    
    //Raised when there is an error.
    this.onerror = /************** Methods **************/    //Cancels the current CCL request.
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
        this.async = async !== null ? (async ? true : false) : true;
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
        
        var el = document.getElementById("__ID_CCLLINKHref_12980__");
        el.href = "javascript:XMLCCLREQUEST_Send(\"" + uniqueId + "\"" + ")";
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

function APPLINK__(mode, appname, param) {
}

function APPLINK(mode, appname, param) {
    var paramLength = param.length;
    if (paramLength > 2000) {
        document.getElementById("__ID_CCLPostParams_26619__").value = '"' + param + '"';
        param = param.substring(0, 2000);
    }
    var el = document.getElementById("__ID_CCLLINKHref_12980__");
    el.href = "javascript:APPLINK__(" + mode + ",\"" + appname + "\",\"" + param + "\"," + paramLength + ")";
    el.click();
}

function evaluate(x) {
    return eval(x);
}

function getXMLHttpRequest() {
    return new XMLCclRequest();
}
