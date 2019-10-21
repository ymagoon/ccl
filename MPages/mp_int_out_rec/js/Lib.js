if(typeof Lib === "undefined") {
    var Lib = {};
}

/**
 * A collection of functions to log messages to Blackbird.
 * @memberof Lib
 * @public
 * @type {Object}
 */
Lib.log = {
    /**
     * Log error messages.
     * @memberof Lib.log
     * @public
     * @function
     * @param {String} program      The name of the program that failed.
     * @param {String} functionName The name of the function that failed.
     * @param {String} errorDetails The details of the failure.
     */
    error: function(program, functionName, errorDetails) {
        log.error("<p class='centerText'><b>DATE:</b> " + new Date() + "<br /><b>PROGRAM:</b> " + program + "<br /><b>FUNCTION:</b> " + functionName + " <br /><b>DETAILS:</b> " + errorDetails + "</p>");
    },
    /**
     * Log informational messages.
     * @memberof Lib.log
     * @public
     * @function
     * @param {String} program      The name of the program in context.
     * @param {String} functionName The name of the function in context.
     * @param {String} infoDetails  The details of the information.
     */
    info: function(program, functionName, infoDetails) {
        log.info("<p class='centerText'><b>DATE:</b> " + new Date() + "<br /><b>PROGRAM:</b> " + program + "<br /><b>FUNCTION:</b> " + functionName + "<br /><b>DETAILS:</b> " + infoDetails + "</p>");
    },
    /**
     * Log script requests.
     * @memberof Lib.log
     * @public
     * @function
     * @param {String} program        The name of the script for the corresponding reply.
     * @param {String} requestDetails The request.
     */
    request: function(program, requestDetails) {
        log.info("<p class='centerText'><b>DATE:</b> " + new Date() + "<br /><b>PROGRAM:</b> " + program + "<br /><b>REQUEST:</b> " + requestDetails.toString() + "</p>");
    },
    /**
     * Log script replies.
     * @memberof Lib.log
     * @public
     * @function
     * @param {String} program The name of the script for the corresponding request.
     * @param {String} reply   The reply.
     */
    reply: function(program, reply) {
        log.debug("<p class='centerText'><b>DATE:</b> " + new Date() + "<br /><b>PROGRAM:</b> " + program + "<br /><b>REPLY:</b> " + reply.toString() + "</p>");
    },
    /**
     * Log timers.
     * @memberof Lib.log
     * @public
     * @function
     * @param {String} timerName The name of the timer.
     * @param {String} totalTime The time recorded by the timer.
     */
    timer: function(timerName, totalTime) {
        log.profile("<p class='centerText'><b>DATE:</b> " + new Date() + " <br /><b>TIMER NAME:</b> " + timerName + "<br /><b>TOTAL TIME:</b> " + totalTime + "</p>");
    }
};

/**
 * A centralized location to store regular expressions.
 * @memberof Lib
 * @public
 * @readOnly
 * @type {Object}
 */
Lib.regex = {
    /**
     * A group of HTML related regexes.
     * @memberof Lib.regex
     * @public
     * @readOnly
     * @type {Object}
     */
    html: {
        head: /<[\s]*head.*?>(.*)<[\s]*\/[\s]*head.*?>/gi,
        body: /<[\s]*body.*?>(.*)<[\s]*\/[\s]*body.*?>/gi,
        script: /<[\s]*script.*?>.*?<[^>]*script.*?>/gi,
        onload: /(.*)(onload[\s]*=[\s]*(['"])(.*?)\3)(.*)/gi,
        scriptTagSrc: /(<[^>]*\bsrc[\s]*=[\s]*(['"])(.*?)\2.*)/gi,
        scriptTagText: /(<.*?>([^<]*).*)/gi
    },
    /**
     * A group of related back end regexes.
     * @memberof Lib.regex
     * @public
     * @readOnly
     * @type {Object}
     */
    backEnd: {
        completeLocationWithHtmlFile: /^([^<>:"\/\\|?*.]+):([^<>:"\/\\|?*.]+).(html|htm)$/gi,
        locations: /^([^<>:"\/\\|?*.]+):/,
        file: /([^<>:"\/\\|?*.]+).(html|htm)$/gi
    },
    /**
     * A group of front end regexes.
     * @memberof Lib.regex
     * @public
     * @readOnly
     * @type {Object}
     */
    frontEnd: {
        filePath: /^(([A-Z|a-z]:\\\\)|(\\\\\\\\))([^<>:"\/\\|?*]+)((\\\\[^<>:"\/\\|?*]+)*)$/gi,
        singleBackSlash: /(\\)/g,
        url: /^(http)(.*)[^/]$/gi
    }
};

/**
 * Determines if a string is a valid static content path.
 * @memberof Lib
 * @public
 * @function
 * @param {String} str A static content path.
 * @return {Boolean} True if the string is a valid static content path, false otherwise.
 */
Lib.isValidStaticContentPath = function(str) {
    function checkPathQuality() {
        var isFilePath = str.search(Lib.regex.frontEnd.filePath) === 0;
        var isUrl = str.search(Lib.regex.frontEnd.url) === 0;
        if(isFilePath === false && isUrl === false) {
            Lib.log.info("Lib.js", "isValidStaticContentPath", "The following is not a high quality path: " + str);
        }
    }
    if(typeof str !== "string") {
        Lib.log.error("Lib.js", "isValidStaticContentPath", "Path is not a string.");
        return false;
    }
    var isPath = str.length > 0;
    if(isPath === true) {
        checkPathQuality();
    }
    Lib.log.info("Lib.js", "isValidStaticContentPath", "The following is " + (isPath === false ? "not " : "") + "a valid path: " + str);
    return isPath;
};

/**
 * Determines if a string is a valid backend location (which contains a file name).
 * @memberof Lib
 * @public
 * @function
 * @param {String} str A backend location and file name.
 * @return {Boolean} True if the string contains a valid backend location and file name, false otherwise.
 */
Lib.isValidBackEndLocation = function(str) {
    if(typeof str !== "string") {
        Lib.log.error("Lib.js", "isValidBackEndLocation", "Location is not a string.");
        return false;
    }
    var isLocation = str.search(Lib.regex.backEnd.completeLocationWithHtmlFile) === 0;
    Lib.log.info("Lib.js", "isValidBackEndLocation", "The following is " + (isLocation === false ? "not " : "") + "a valid back end location: " + str);
    return isLocation;
};

/**
 * Call a given script and then the callback when it returns if given.
 * @memberof Lib
 * @public
 * @function
 * @param {String}   program      The name of the script object to request.
 * @param {Object}   params       Object to be converted into JSON parameter.
 * @param {Boolean}  async        If true, the script will be asynchronous.
 * @param {Function} callback     The function to call when the script returns.
 * @param {Function} callbackFail An optional function to call when the script fails.
 */
Lib.makeCall = function(program, params, async, callback, callbackFail) {
    params = params || "";
    async = async || false;
    var request = new XMLCclRequest();
    request.onreadystatechange = function() {
        if(request.readyState !== 4) {  // Not completed.
            return;
        }
        if(request.status === 200) {    // Success.
            Lib.log.reply(program, request.responseText);
            callback(request.responseText);
        } else {    // Failure.
            Lib.log.error(program, "makeCall", "");
            if(typeof callbackFail === "function") {
                callbackFail();
            }
        }
    };
    Lib.log.request(program, params);
    request.open("GET", program, async);
    request.send(params);
};

/**
 * Loads an iframe with an MPage.
 * @memberof Lib
 * @public
 * @function
 * @param  {String} reportName  The driver script.
 * @param  {String} reportParam The report param string for the driver script.
 * @param  {String} iframeId    The iframe to load the MPage into.
 */
Lib.loadIframe = function(reportName, reportParam, iframeId) {
    /**
     * Loads the scripts into the MPage.
     * @memberof Lib.loadIframe#
     * @param  {String[]} arr            The HTML detailing the scripts.
     * @param  {Element}  iframeDocument The iframe element in which to load the scripts.
     */
    function loadScripts(arr, iframeDocument) {
        if(Array.isArray(arr) === false || arr.length < 1) {
            return;
        }
        var scriptTag = arr.shift(),
            elem = iframeDocument.createElement("script"),
            src = scriptTag.replace(Lib.regex.html.scriptTagSrc, "$3").replace(scriptTag, "");
        elem.type = "text/javascript";

        // if inline script, don't set elem.src to "", crashes on ie9
        if (src !== ""){
            elem.src = src;
        }

        elem.text = scriptTag.replace(Lib.regex.html.scriptTagText, "$2");
        elem.onreadystatechange = function() {
            if(this.readyState === "complete") {
                loadScripts(arr, iframeDocument);
            } else if(this.readyState === "loaded") {
                setTimeout(function() { // Allow scripts to load as needed.
                    loadScripts(arr, iframeDocument);
                }, 0);
            }
        };
        iframeDocument.body.appendChild(elem);
    }

    Lib.makeCall(reportName, reportParam, true, function(reply) {
        if(typeof reply !== "string") {
            Lib.log.error("Lib.js", "loadIframe", "Reply was not a string.");
            return;
        }

        var myframe         = null;
        var myframeContents = null;
        var myframeDocument = null;

        myframe = document.getElementById(iframeId);
        if(!myframe) {
            Lib.log.error("Lib.js", "loadIframe", "iframe was not found.");
            return;
        }
        myframeContents = myframe.contentWindow || myframe.contentDocument;
        if(!myframeContents) {
            Lib.log.error("Lib.js", "loadIframe", "Could not open iframe.");
            return;
        }
        myframeDocument = myframeContents.document;
        if(!myframeDocument) {
            Lib.log.error("Lib.js", "loadIframe", "Could not open iframe document.");
            return;
        }

        myframeDocument.open();

        // Begin iframe MPages overrides.
        myframeContents.XMLCclRequest = window.XMLCclRequest;
        myframeContents.APPLINK = window.APPLINK;
        myframeContents.XMLCCLREQUESTOBJECTPOINTER = window.XMLCCLREQUESTOBJECTPOINTER;
        myframeContents.MPAGES_EVENT = window.MPAGES_EVENT;
        myframeContents.CCLLINKPOPUP = window.CCLLINKPOPUP;
        myframeContents.JSON = window.JSON;
        myframeContents.MP_Util = window.MP_Util;
        myframeContents.mp_formatter = window.mp_formatter;
        myframeContents.MPAGES_SVC_EVENT = window.MPAGES_SVC_EVENT;
        myframeContents.CCLLINK = function(scriptName, prompts) {
            Lib.loadIframe(scriptName, prompts, iframeId);
        };
        myframeContents.history.back = function() { // XDocs-specific override.
            if(reportName === "mp_pv_di_driver") {
                myframe.setAttribute("src", "about:blank");
                Lib.loadIframe("mp_pv_driver", App.getParamString("mp_pv_driver"), "xdocsIframe");
            }
        };
        myframeContents.CCLNEWSESSIONWINDOW = function(url, target, features, replaceFlag, modalFlag) {
            if(target === "_self") {
                target = "_blank";
            }
            window.CCLNEWSESSIONWINDOW(url, target, features, replaceFlag, modalFlag);
        };
        // End overrides.

        if(reportName === "mp_int_out_rec_orv_driver" || reportName === "mp_unified_driver") {
            myframeDocument.write(reply);
            myframeDocument.close();
            return;
        }
        try {
            var headHtml = reply.match(Lib.regex.html.head),
                bodyHtml = reply.match(Lib.regex.html.body),
                scriptHtml = (headHtml[0] || "").match(Lib.regex.html.script),
                onloadJs = (bodyHtml[0] || "").replace(Lib.regex.html.onload, "$4");
            if(headHtml.length < 1 || bodyHtml.length < 1 || scriptHtml.length < 1) { // Nothing to override, dump content.
                myframeDocument.write(reply);
                myframeDocument.close();
                return;
            } else {
                for(var t = 0, scriptLen=scriptHtml.length; t < scriptLen; t++) { // Remove script tags from head.
                    reply = reply.replace(scriptHtml[t], "");
                }

                reply = reply.replace(Lib.regex.html.onload, "$1$5"); // Remove onload from body.

                // Write reply HTML minus scripts and onload to document.
                myframeDocument.write(reply);
                myframeDocument.close();

                // Dummy load tags - we just want to insert this as a text node later.
                if(onloadJs.length) {
                    scriptHtml.push("<load>" + onloadJs + "</load>");
                }
                loadScripts(scriptHtml, myframeDocument);
            }
        } catch(e) {
            Lib.log.error("Lib.js", "loadIframe", e.message);
            if(typeof myframeDocument === "object" && myframeDocument !== null) {
                myframeDocument.close();
            }
        }
    }, function(reply) {
        Lib.log.error(reportName, "loadIframe", reply);
    }, "loadIframe");
};

/**
 * A centralized location to store preferences.
 * @memberof Lib
 * @public
 * @readOnly
 * @type {Object}
 */
Lib.prefs = {};

/**
 * Uses the standard prefs retrieval to retrieve preferences from bedrock and prefmaint.
 * @memberof Lib
 * @public
 * @param {String} scriptName The name of the script that gets the prefs for the Category.
 * @param {String} paramString The parameters string that has to be passed to the script.
 */
Lib.retrievePrefs = function(scriptName, paramString) {
    if(typeof scriptName !== "string" || scriptName.length <= 0) {
        return;
    }
	if(paramString == null){
	    paramString = "";
	}

    var prefs = {},
        prefTypes = {
            bool: "VALUE_BOOLEAN",
            string: "VALUE_STRING"
        },
        replyPrefsArr,
        replyPrefsJson;

    function setTempPrefs(dbPrefs) {
        replyPrefsJson = dbPrefs;
    }

    Lib.makeCall(scriptName, paramString, false, setTempPrefs, function(){setTempPrefs(""); });
    try {
        replyPrefsArr = JSON.parse(replyPrefsJson).PREFS_REPLY.PREFS;
        for(var i = 0, iLen = replyPrefsArr.length; i < iLen; i++) {
            var curPref = replyPrefsArr[i];
            prefs[curPref.PREF_KEY] = [];
            for(var j = 0, jLen = curPref.PREF_VALUES.length; j < jLen; j++) {
                var curVal = curPref.PREF_VALUES[j][curPref.PREF_TYPE];
                switch(curPref.PREF_TYPE) {
                    case prefTypes.bool:
                        curVal = Boolean(curVal);
                        break;
                    case prefTypes.string:
                        curVal = String(curVal);
                        break;
                }
                prefs[curPref.PREF_KEY].push(curVal);
            }
        }
    } catch(e) {
        Lib.log.error("Lib.js", "retrievePrefs", e.message);
        prefs = null;
    }

    Lib.prefs = prefs;
};

/**
 * Gets the preference located at the key.
 * @param {String} key The preference name to get preferences for.
 * @return {Value[]|null} If preferences are found, a list of the value(s)(Boolean, String, Number, etc.); otherwise null.
 */
Lib.getPrefs = function(key) {
    if(typeof Lib.prefs !== "object" || Lib.prefs === null) {
        return null;
    }
    return Lib.prefs[key] || null;
};

/**
 * Gets a single preference located at the key.
 * @param {String} key The preference name to get the value of.
 * @return {Value|null} If there is a single (not more than one) value found for the preference, that value will be returned; otherwise null.
 */
Lib.getSinglePref = function(key) {
    var prefArr = Lib.getPrefs(key);
    return (Array.isArray(prefArr) && prefArr.length === 1) ? prefArr[0] : null;
};
