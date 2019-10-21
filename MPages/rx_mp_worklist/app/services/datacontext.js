define(['mpages/logger', 'jquery', 'mpages/request_timer'], function (logger, $) {
    /**
    *   exposes executeScript
    */
    var context = {
        executeScript: executeRequest,
        clearCache: clearCache
    };

    /**
    *   Maintain a local javascript cache that caches commonly used
    *   script results. This cache is only persisted for the current
    *   executing instance of the mpage. Refreshing the mpage, clears
    * cache.
    */
    var cache = {};

    /***
    *   This function clears the cache entries for a particular CCL script.
    *   @metho
    */
    function clearCache(programName) {
    if (programName && cache[programName] != 'undefined') {
    delete cache[programName];
    }
    }

    /***
    *   Executes the script request based on the context of execution. The datacontext allows
    *   two modes of execution : Powerchart and Browser. The Browser mode is intended to be used
    *   during development of the mpage. This mode of execution depends on the CERN_BrowserDevInd variable
    *   which is set by the driver script - rx_mp_worklist_driver. When, this is set to true and when
    *   the MPages Webservice is setup on http://localhost:8080, the MPages Webservice is used to execute
    *   the scripts and retrieve data. As this is geared more towards development environment, no caching is done.

    *   When CERN_BrowserDevInd is set to 'false', the context of execution is from within powerchart. In such
    *   a case, XmlCclRequest is done to execute the scripts. If the 'ScriptRequest' is set to cache the results of
    *   execution, the data-context caches the results. This information DOES NOT persist across powerchart sessions. Its
    *   only intention is to cache the results for use while the user is performing actions in the MPage. Reloading the Mpage
    *   will reload the cache.

    *   @method {executeRequest}
    *   @param {Object} scriptRequest
    */
    function executeRequest(scriptRequest) {
        var blob = scriptRequest.getRequestBlobIn();
        var timerName = scriptRequest.getLoadTimer();
        var programName = scriptRequest.getProgramName();
        var isTimerPresent = timerName !== "";
        var deferred = $.Deferred();
        var RequestTimer = require('mpages/request_timer');


        if (!CERN_BrowserDevInd) {
            var request = new XMLCclRequest();

            var timer = null;

            if (typeof cache[programName] != "undefined") {
                deferred.resolve(cache[programName]);
                return deferred;
            }

            try {
                if (isTimerPresent) {
                    timer = new RequestTimer().setTimerName(timerName);
                    timer.start();
                    logger.log("<b>Request Started</b><br /><ul><li>program: " + programName + "</li><li>start_time: " + new Date() + "</li></ul>", scriptRequest, "datacontext.js", false);
                }

                request.open("GET", programName, scriptRequest.isAsync());
                if (blob) {
                    //setBlobIn is defined as part of XMLCclRequest
                    if (typeof blob !== 'string')
                        blob = JSON.stringify(blob);

                    logger.log("<b>Blob for program : " + programName + "</b><br/>" + blob, scriptRequest, "datacontext.js", false);
                    request.setBlobIn(blob);
                }
                logger.log("<b>Parameters for program : " + programName + "</b><br/>" + scriptRequest.getParameters(), scriptRequest, "datacontext.js", false);
                request.send(scriptRequest.getParameters().join(","));

                if (scriptRequest.isAsync()) {
                    request.onreadystatechange = function () {
                        //Look at http://msdn.microsoft.com/en-us/library/ms767625(v=vs.85).aspx  and
                        //http://msdn.microsoft.com/en-us/library/ms753800(v=vs.85).aspx for status codes and ready state
                        if (request.readyState == 4 && request.status == 200) {
                            var recordData = JSON.parse(request.responseText);

                            if (scriptRequest.isCachingEnabled()) {
                                cache[programName] = recordData;
                            }
                            logger.log("<b>Request Ended for:</b>" + programName + "<br /><ul>" +
                            "<li>Response text: " + request.responseText + "</li></ul>", scriptRequest, "datacontext.js", false);
                            deferred.resolve(recordData);
                            timer.stop();
                            scriptRequest = null;
                        } else if (request.readyState == 4) {
                            logger.log("<b>Request Aborted for:</b>" + programName + "<br /><ul>" +
                            "<li>Response text: " + request.responseText + "</li></ul>", scriptRequest, "datacontext.js", false);
                            deferred.reject({ error: request.responseText, data: scriptRequest });
                            timer.abort();
                            scriptRequest = null;
                        }

                    };
                } else {
                    if (request.status == 200) {
                        var recordData = JSON.parse(request.responseText);

                        if (scriptRequest.isCachingEnabled()) {
                            cache[programName] = recordData;
                        }
                        logger.log("<b>Request Ended for:</b>" + programName + "<br /><ul>" +
                            "<li>Response text: " + request.responseText + "</li></ul>", scriptRequest, "datacontext.js", false);
                        deferred.resolve(recordData);
                        timer.stop();
                        scriptRequest = null;
                    } else {
                        logger.log("<b>Request aborted for:</b>" + programName + "<br /><ul>" +
                            "<li>Response text: " + request.responseText + "</li></ul>", scriptRequest, "datacontext.js", false);
                        deferred.reject({ error: request.responseText, data: scriptRequest });
                        timer.abort();
                        scriptRequest = null;
                    }

                }
            }
            catch (err) {
                if (timer) {
                    timer.abort();
                    logger.log("<b>Request Aborted for :</b>" + programName + "<br /><ul>" +
                            "<li>Error: " + err + "</li></ul>", scriptRequest, "datacontext.js", false);
                }
                deferred.reject({ error: err, data: scriptRequest });
                scriptRequest = null;
            }

        } else {

            var url = "http://localhost:8080/discern/mpages/reports/" + programName + "?parameters=" + scriptRequest.getParameters().join(",");
            if (blob) {
                url += "&blobIn=" + JSON.stringify(blob);
                logger.log("<b>Blob for program : " + programName + "</b><br/>" + JSON.stringify(blob), scriptRequest, "datacontext.js", false);
            }
            logger.log("<b>Parameters for program : " + programName + "</b><br/>" + scriptRequest.getParameters(), scriptRequest, "datacontext.js", false);
            $.support.cors = true;

            var jqXHR = $.ajax({
                type: "GET",
                url: url,
                async: scriptRequest.isAsync(),
                xhrFields: {
                    withCredentials: true
                }
            });

            jqXHR.done(function (data) {
                try {
                    var recordData = JSON.parse(data);
                    if (scriptRequest.isCachingEnabled()) {
                        cache[programName] = recordData;
                    }
                    deferred.resolve(recordData);
                    scriptRequest = null;
                } catch (error) {
                    logger.log("<b>Error Parsing response of XHR: </b><br/><b>Response : </b>" + data, programName, "dataContext.js", false);
                    deferred.reject({ error: error, data: data });
                    scriptRequest = null;
                }
            })
            .fail(function (data) {
                if (typeof data == 'object')
                    logger.log("<b>Error in XHR </b>" + JSON.parse(data), programName, "dataContext.js", false);
                else
                    logger.log("<b>Error in XHR </b>" + data, programName, "dataContext.js", false);
                deferred.reject(data);
                scriptRequest = null;
            });
        }

        return deferred;
    }

    return context;
});