
if (typeof(illumicare) == "undefined") illumicare = {};
if (typeof(illumicare.init) == "undefined") illumicare.init = {};
if (typeof(illumicare.language) == "undefined") illumicare.language = {};
if (typeof(illumicare.integration) == "undefined") illumicare.integration = {};

illumicare.dataHasLoaded = false;
illumicare.config = {
    endpoint: "https://web-svc.prod-illumicare.xyz:6443/html/D7C06E74-3B8F-4A86-AF39-C6BA405F6CEC",
    endpointRoot: "https://web-svc.prod-illumicare.xyz:6443",
    accessKey: "F92489D9-F842-4382-9A9C-E49C985E978F",
    secretKey: "E08E2117-1396-4EC1-A818-D608ADEE7ED0",
    user_domain: "domain",
    health_system_id: 8,
    showDebugInfo: false,
    loadingText: "Loading Illumicare Smart Ribbon",
    timeoutLength: 6001,
    timers: [],
    getPanelNumberFromName: function (column) {
        var panel = 0;
        switch (column) {
            case "Left":
                panel = 1;
                break;
            case "Middle":
                panel = 2;
                break;
            case "Right":
                panel = 3;
                break;
            default:
                panel = 4;
                break;
        }
        return panel;
    },
    getIframeId: function(column) {
      return typeof column == "undefined" ? "requestIframe" : "request" + column;
    },
    getIframeHTML: function (mrn, userid, column, userInfo, userAgent, documentMode) {
        var c = illumicare.config;

        var config = btoa(c.getPanelNumberFromName(column) + "|" + c.accessKey + "|" + c.secretKey + "|" + c.health_system_id + "|" + c.endpoint + "|" + c.endpointRoot + "|" + mrn + "|" + userid + "|" + JSON.stringify(userInfo) + "|" + userAgent + "|" + documentMode);
        var iframeSrc = c.endpointRoot + "/html/compatibility/index.html?config=" + config;

        illumicare.debug.writeLog("illumicare.ribbon.js - iframeSrc: " + iframeSrc);

        var result = '<iframe style="overflow:hidden;height:184px;width:100%;margin:0;padding:0;overflow-x: hidden;overflow-y: hidden;" scrolling="no" id="' + c.getIframeId(column) + '" src="' + iframeSrc + '"></iframe></div>'
        return result;
    }
};

/****************************************************************
 Debug and logging
 ****************************************************************/
//debug logging
illumicare.debug = {};
illumicare.debug.log = new Array();
illumicare.debug.logWindow;
illumicare.debug.writeLog = function(data){
    //convert data
    if (typeof(data) == "object"){
        var logData = $.toJSON(data);
    } else {
        var logData = data;
    }

    //add to array
    var now = new Date();
    illumicare.debug.log.push({
        "log_date" : now
        ,"log_milli" : now.getMilliseconds()
        ,"log_data" : logData
    });
};
illumicare.debug.showLog = function(){
    illumicare.debug.logWindow = window.open("", "illumicarePopupWindow", "top=100,left=100,width=900,height=600,fullscreen=no,scrollbars=yes,location=no,menubar=no,resizeable=yes,status=no,titlebar=no,toolbar=no");
    illumicare.debug.logWindow.document.write('<html><head><meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\"></head><body>');

    //log page HTML
    var sBody = $('html').html();
    illumicare.debug.logWindow.document.write("<b>Page HTML:</b><br>")
    illumicare.debug.logWindow.document.write("<textarea id='debug' cols=100 rows=20></textarea><br>");
    illumicare.debug.logWindow.document.getElementById('debug').value = sBody;

    //write log
    illumicare.debug.logWindow.document.write("<b>Logs:</b><br>")
    illumicare.debug.logWindow.document.write("<table border=yes style='width:100%;table-layout:fixed;'>");
    for (var i = 0; i < illumicare.debug.log.length; i++){
        illumicare.debug.logWindow.document.write("<tr><td style='width:30%;'>" + illumicare.debug.log[i].log_date + "</td><td style='width:10%;'>" + illumicare.debug.log[i].log_milli + "</td><td style='width:60%;word-wrap:break-word;'>" + illumicare.debug.log[i].log_data + "</td></tr>");
    }
    illumicare.debug.logWindow.document.write("</table>")

    illumicare.debug.logWindow.document.write("</body></html>");
};

illumicare.debug.alert = function(text){
    //show debug link
    illumicare.init.debug = true;

    alert("!!! BAYCARE Error !!!\n\n" + text);
};
/****************************************************************
 Internationalization
 ****************************************************************/
illumicare.language.get = function(sString){
    //default to string passed in
    var sTranslation = sString;

    //adjust if found
    if (illumicare.language.phrases != undefined && illumicare.language.phrases[sString.toUpperCase()] != undefined){
        sTranslation = illumicare.language.phrases[sString.toUpperCase()];
    }

    return(sTranslation);
};


/****************************************************************
 Integration - Let's create a mechanism to deal with differences when running the components with/without PowerChart
 ****************************************************************/
illumicare.integration.setIsRunningPowerChart = function(flag) {
    illumicare.integration.runningPowerChartFlag = flag;
};

illumicare.integration.getIsRunningPowerChart = function(flag) {
    return illumicare.integration.runningPowerChartFlag;
};

illumicare.integration.getTarget = function(componentObject) {
    if (illumicare.integration.getIsRunningPowerChart() == 0) {
        //return $(componentObject.getTarget());
        return componentObject.getTarget();
    }
    else {
        return componentObject.getTarget();
    }
};

(function (jQuery) {
    jQuery.fn.illumicarePopupLeft = function (componentObject, runningPowerChart) {
        console.log("in illumicarePopupLeft");
        jQuery.fn.illumicarePopup(componentObject, runningPowerChart, "Left");
    };
    jQuery.fn.illumicarePopupMiddle = function (componentObject, runningPowerChart) {
        console.log("in illumicarePopupMiddle");
        jQuery.fn.illumicarePopup(componentObject, runningPowerChart, "Middle");
    };
    jQuery.fn.illumicarePopupRight = function (componentObject, runningPowerChart) {
        console.log("in illumicarePopupRight");
        jQuery.fn.illumicarePopup(componentObject, runningPowerChart, "Right");
    };
    jQuery.fn.illumicarePopupSingle = function (componentObject, runningPowerChart) {
        console.log("in illumicarePopupSingle");
        jQuery.fn.illumicarePopup(componentObject, runningPowerChart, "Single");
    };

    jQuery.fn.illumicarePopup = function (componentObject, runningPowerChart, column) {
        var domTarget;
        try {
            illumicare.debug.writeLog("jQuery.fn.illumicarePopup()");
            illumicare.debug.writeLog(illumicare.config.loadingText);
            //Set running mode (integration)
            illumicare.debug.writeLog(illumicare.language.get("Setting PowerChart Flag"));
            //Used to switch code executing depending whether the cstom component are run within PowerChart
            illumicare.integration.setIsRunningPowerChart(runningPowerChart);
            //get DOM target
            illumicare.debug.writeLog(illumicare.language.get("getting DOM Target"));
            //Let's use integration for any code that may differ when executed within PowerChart/IE Standalone
            domTarget = componentObject.getTarget();
        }
        catch (err) {
            illumicare.debug.writeLog(illumicare.language.get("Error Initializing Custom Component") + "<br><br>" + err.description);
            if (domTarget){
                domTarget.innerHTML = '<span title="'+err.description+'">' + illumicare.language.get("Error Initializing Custom Component") + '...</span>';
            } else {
                illumicare.debug.alert(illumicare.language.get("Error Initializing Custom Component")+"\n\n" + err.description);
            }
            return;
        }
        try {
            illumicare.debug.writeLog(illumicare.language.get("Rendering Popup Component"));
            domTarget.innerHTML = '<span>' + illumicare.language.get("Rendering Popup Component") + JSON.stringify(illumicare.config) + '...</span>';
            $(domTarget).illumicarePopupWidget(column);
        }
        catch(err) {
            illumicare.debug.writeLog(illumicare.language.get("Popup Rendering Component Failed") + "<br><br>" + err.description);
            illumicare.debug.alert(illumicare.language.get("Popup Rendering Component Failed") + "\n\n" + err.description);
        }
    };
})(jQuery);

//This control can be invoked directly to render the Popup.
(function (jQuery) {
    jQuery.fn.illumicarePopupWidget = function (column) {
        try {
            illumicare.debug.writeLog("jQuery.fn.illumicarePopupWidget()");
            return this.each(function () {
                var obj = $(this);
                render(obj, column);
            });
        } catch (err){
            illumicare.debug.writeLog(illumicare.language.get("Error creating Popup Widget") + "<br><br>" + err.description);
            illumicare.debug.alert(illumicare.language.get("Error creating Popup Widget") + ".\n\n" + err.description);
        }
    };
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {if (e) {
        illumicare.debug.writeLog('Parent received message!: ' + JSON.stringify(e.data));
        if (e.data) {
            switch  (e.data.status) {
                case 200:
                    illumicare.dataHasLoaded = true;
                    break;
            }
        }
    }
    },false);

    function render(obj, column) {
        illumicare.debug.writeLog("render() Popup Widget (HTML)");
        try {

            var mrn = "", userid = "", userInfo = {};
            //pull in params from ccl script
            var info = new XMLCclRequest();
            var self = this;
            var cclProgram = "1_illumicare_get_mrn_userNAME";
            var paramStringArr = [];
            paramStringArr.push("MINE");
            //These values are from the parameters sent to this method
            illumicare.debug.writeLog("illumicare.ribbon.js - render.  checking ccl results...");

            //These values are got from the parameters sent to this method
            paramStringArr.push("value($VIS_EncntrID$)");
            paramStringArr.push("value($USR_PersonID$)");

            info.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var cclResponse = eval("(" + this.responseText + ")");
                    illumicare.debug.writeLog(cclProgram + ":" + JSON.stringify(cclResponse));
                    mrn = cclResponse.OUTPUT_REPLY_OUT.MRN;
                    userid = cclResponse.OUTPUT_REPLY_OUT.USERNAME;
                    userInfo = {
                        userid: userid,
                        lastName: cclResponse.OUTPUT_REPLY_OUT.NAME_LAST,
                        firstName: cclResponse.OUTPUT_REPLY_OUT.NAME_FIRST,
                        middleName: cclResponse.OUTPUT_REPLY_OUT.NAME_MIDDLE,
                        prefix: cclResponse.OUTPUT_REPLY_OUT.NAME_PREFIX,
                        suffix: cclResponse.OUTPUT_REPLY_OUT.NAME_SUFFIX,
                        degree: cclResponse.OUTPUT_REPLY_OUT.NAME_DEGREE,
                        npi: cclResponse.OUTPUT_REPLY_OUT.NPI,
                        email: cclResponse.OUTPUT_REPLY_OUT.PRSNL_EMAIL,
                    };
                    illumicare.debug.writeLog("userInfo:" + JSON.stringify(userInfo));
                }else{
                    illumicare.debug.writeLog(cclProgram + " Status: " + this.status);
                }
            };
            info.open("GET", cclProgram, false);
            info.send(paramStringArr.join(","));

            illumicare.debug.writeLog("userInfo:" + JSON.stringify(userInfo));

            var componentHTML = '<head><META http-equiv="X-UA-Compatible" content="IE=edge"><META content="XMLCCLREQUEST" NAME="discern"/><meta charset="UTF-8"></head>';
            componentHTML += '<div style="overflow: hidden;width: 100%;height: 100%;margin: 0;padding:0;">';
            componentHTML += illumicare.config.getIframeHTML(mrn, userid, column, userInfo, window.navigator.userAgent, window.document.documentMode);

            if (illumicare.config.showDebugInfo) {
                var debugInfo = '<div><a href="javascript:illumicare.debug.showLog();">Show debug information</a></div>';
                componentHTML += debugInfo;
            }

            window.setTimeout(
                function (column) {
                    if (!illumicare.dataHasLoaded) {
                        illumicare.debug.writeLog("here we go:" + column);
                        try {
                            var domTarget = document.getElementById(illumicare.config.getIframeId(column));
                            if (domTarget && domTarget.parentNode && domTarget.parentNode.parentNode) {
                                var formId = domTarget.parentNode.parentNode.id;
                                formId = formId.replace("Content", "");
                                if (formId) {
                                    illumicare.debug.writeLog("timer formId:" + formId);
                                    var formEl = document.getElementById(formId);
                                    if (formEl) {
                                        illumicare.debug.writeLog("timer display before:" + formEl.style.display);
                                        formEl.style.display = "none";
                                        illumicare.debug.writeLog("timer display after:" + formEl.style.display);
                                    }
                                }
                            }
                        } catch (e) {
                            illumicare.debug.writeLog("timer error:" + JSON.stringify(e));
                        }
                    } else {illumicare.debug.writeLog("timer code not evaluated, data loaded successfully:" + column);}
                }, illumicare.config.timeoutLength, column);
            obj.html(componentHTML);
        }catch(err){
            alert(err);
        }
    };
})(jQuery);