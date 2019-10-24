/*globals MP_Timezone, SortMPageComponents, MD_reachViewerDialog, AutoSuggestControl, ThemeSelector, hs, log,
MessageModal, ErrorModal, WarningModal, InfoModal, BusyModal */

/*
 The scope of an MPage object and Components are during rendering of the page.  However,
 once the page has been rendered these items are lost.  Because there is a need to refresh
 components, the components on a 'page' must be globally stored to allow for refreshing of data.
 */
var CERN_EventListener = null; //eslint-disable-line no-redeclare, mp-camelcase
var CERN_MPageComponents = null;
//A global object which keeps a mapping of Report Means to the components which should be instantiated.
//Supporting functionality is located in the MP_Util namespace
var CERN_ObjectDefinitionMapping = {};
var CERN_BrowserDevInd = false; //eslint-disable-line no-redeclare
var CK_DATA = {};

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

/* If the browser does not define the addAll function for the Array */
if (!Array.prototype.addAll) {
    Array.prototype.addAll = function(v) { //eslint-disable-line no-extend-native
        if (v && v.length > 0) {
            for (var x = 0, xl = v.length; x < xl; x++) {
                this.push(v[ x ]);
            }
        }
    };
}

/**
 *  Since IE10 is the minimum browser version, we no longer need an implementation of Array.prototype.indexOf.
 *  This check is being left in place to allow SWx to quickly identify if the client does not have the
 *  proper version of IE installed on the Citrix Box.
 **/
if (!Array.prototype.indexOf) {
    throw new Error("Browser version does not contain an implementation of Array.prototype.indexOf");
}

/**
 *  Since IE10 is the minimum browser version, we no longer need an implementation of Function.prototype.bind.
 *  This check is being left in place to allow SWx to quickly identify if the client does not have the
 *  proper version of IE installed on the Citrix Box.
 **/
if (!Function.prototype.bind) {
    throw new Error("Browser version does not contain an implementation of Function.prototype.bind");
}

/**
 *  Since IE10 is the minimum browser version, we no longer need an implementation of document.getElementsByClassName.
 *  This check is being left in place to allow SWx to quickly identify if the client does not have the
 *  proper version of IE installed on the Citrix Box.
 **/
if (!document.getElementsByClassName) {
    throw new Error("Browser version does not contain an implementation of document.getElementsByClassName");
}

/**
 * this function overrides the browsers error handling functionality so we can display a user friendly
 * rather than the browsers technical dialog.
 * @param {string} message - The message associated to the error that has occurred
 * @param {string} file - The file where the error has occurred
 * @param {number} lineNumber - The line number the error was thrown from
 * @param {number} columnNumber - The column number in the file where the error originated
 * @param {Error} error - The error that was intercepted by the window.onerror.
 * 		This parameter is defined in IE11+ and as such, must be ignored if
 * 		it is not defined.
 * @returns {boolean}
 */
window.onerror = function(message, file, lineNumber, columnNumber, error) {
    var errorModal = null;
    var refreshButton = null;
    var closeButton = null;
    var source = i18n.UNKNOWN;
    //Accessing callee/caller is seen as potentially dangerous, so wrap it
    //in a try/catch block
    try {
        if (error && error.stack) {
            source = error.stack;
        } else {
            source = arguments.callee.caller.toString(); //eslint-disable-line no-caller
        }
    } catch (err) {
        //Intentionally empty catch
    }
    //Immediately enable blackbird logging to report the page level error
    log.setLoggingActive(true);
    log.error(
        i18n.UNEXPECTED_ERROR_CAUGHT + "<br />" +
        i18n.discernabu.JS_ERROR + ": " + message + "<br />" +
        i18n.FILE + ": " + file + "<br />" +
        i18n.LINE_NUMBER + ": " + lineNumber + "<br />" +
        i18n.SOURCE + ": " + source + "<br />"
    );

    //Throw the error when we are developing in a browser, otherwise show the modal to the user
    if (CERN_BrowserDevInd) {
        throw (new Error(i18n.UNEXPECTED_ERROR_CAUGHT + "<br />" + i18n.discernabu.JS_ERROR + ": " + message + "<br />" + i18n.FILE + ": " + file + "<br />" + i18n.LINE_NUMBER + ": " + lineNumber));
    }
    else {
        //Create a modal dialog and ask the user if they would like to refresh or continue
        errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
        if (!errorModal) {
            errorModal = MP_Util.generateModalDialogBody("errorModal", "error", i18n.PAGE_ERROR, i18n.PAGE_ERROR_ACTION);
            errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
            //Create and add the refresh button
            refreshButton = new ModalButton("refreshButton");
            refreshButton.setText(i18n.REFRESH).setCloseOnClick(true);
            refreshButton.setOnClickFunction(function() {
                //Refresh the page
                CERN_Platform.refreshMPage();
            });


            errorModal.addFooterButton(refreshButton);
            //Create and add the close button
            closeButton = new ModalButton("closeButton");
            closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
            errorModal.addFooterButton(closeButton);
        }
        MP_ModalDialog.updateModalDialogObject(errorModal);
        MP_ModalDialog.showModalDialog("errorModal");

        //Returning true supresses the error in FireFox and IE but allows it to propegate in Chrome
        return true;
    }
};

/**
 * Core utility methods
 * @namespace
 */
var MP_Core = function() { //eslint-disable-line no-redeclare
    return {
        /**
         * This function returns the normalcy class associated with the result
         * @param result - is the MP_Core.Measurement object.
         */
        GetNormalcyClass: function(result) {
            var normalcy = "res-normal";
            var normalcyMeaning = result.getNormalcy();
            if (normalcyMeaning) {
                switch (normalcyMeaning.meaning) {
                    case "LOW":
                        normalcy = "res-low";
                        break;
                    case "HIGH":
                        normalcy = "res-high";
                        break;
                    case "ABNORMAL":
                        normalcy = "res-abnormal";
                        break;
                    case "CRITICAL":
                    case "EXTREMEHIGH":
                    case "PANICHIGH":
                    case "EXTREMELOW":
                    case "PANICLOW":
                    case "VABNORMAL":
                    case "POSITIVE":
                        normalcy = "res-severe";
                        break;
                }
            }
            return normalcy;
        },
        /**
         * This function associates appropriate styles to the results.
         * @param result - is the MP_Core.Measurement object.
         * @param excludeUOM - This value indicates whether to add the Unit of measurement or not.
         */
        GetNormalcyResultDisplay: function(result, excludeUOM) {
            var ar = [ "<span class='", MP_Core.GetNormalcyClass(result), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>", MP_Core.GetEventViewerLink(result, MP_Util.Measurement.GetString(result, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(result), "</span>" ]; //eslint-disable-line new-cap
            return ar.join("");
        },
        /**
         * This function links the result viewer to the respective results.
         * @param result - is the MP_Core.Measurement object.
         * @param sResultDisplay - This contains the  value that needs to be displayed.
         */
        GetEventViewerLink: function(result, sResultDisplay) {
            var params = [ result.getPersonId(), result.getEncntrId(), result.getEventId(), "\"EVENT\"" ];
            var ar = [ "<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", sResultDisplay, "</a>" ];
            return ar.join("");
        },
        /**
         * The criterion object stores information about the request in context such as the patient/person, encounter/visit,
         * provider/personnel, relationship etc.
         * @constructor
         * @param {object} criterionObj The parses criterion object derived from the global m_criterionJSON
         * @param {string} staticContentBaseUrl The url to the static content location.  Does not contain actual subfolder paths.
         */
        Criterion: function(criterionObj, staticContentBaseUrl) {
            var m_patInfo = null;
            var m_prsnlInfo = null;
            var m_encntrOverride = [];

            this.person_id = criterionObj.PERSON_ID;
            this.encntr_id = (criterionObj.ENCNTRS.length > 0) ? criterionObj.ENCNTRS[ 0 ].ENCNTR_ID : 0;
            this.provider_id = criterionObj.PRSNL_ID;
            this.username = criterionObj.USERNAME || "";
            this.executable = criterionObj.EXECUTABLE;
            this.static_content = staticContentBaseUrl;
            this.position_cd = criterionObj.POSITION_CD;
            this.ppr_cd = criterionObj.PPR_CD;
            this.debug_ind = criterionObj.DEBUG_IND;
            CERN_BrowserDevInd = ((parseInt(this.debug_ind, 10) & 0x01) === 1) ? true : false;
            this.help_file_local_ind = criterionObj.HELP_FILE_LOCAL_IND;
            this.category_mean = criterionObj.CATEGORY_MEAN;
            this.locale_id = ((parseInt(this.debug_ind, 10) & 0x02) === 2) ? "en_us" : criterionObj.LOCALE_ID;
            this.logical_domain_id = (typeof criterionObj.LOGICAL_DOMAIN_ID !== "undefined") ? criterionObj.LOGICAL_DOMAIN_ID : null;
            this.is_utc = criterionObj.IS_UTC;
            try {
                if (CERN_Platform.inMillenniumContext()) {
                    this.client_tz = criterionObj.CLIENT_TZ;
                }
                else {
                    this.client_tz = MP_Timezone.getTzIndex();
                }
            } catch (err) {
                logger.logWarn("Unable to set client time zone");
                this.client_tz = 0; //utc
            }

            this.facility_cd = criterionObj.ENCNTR_LOCATION.FACILITY_CD;

            var encounterOverrideArray = criterionObj.ENCNTR_OVERRIDE;

            if (encounterOverrideArray) {
                for (var x = encounterOverrideArray.length; x--;) {
                    m_encntrOverride.push(encounterOverrideArray[ x ].ENCNTR_ID);
                }
            }
            else {
                m_encntrOverride.push(this.encntr_id);
            }

            this.setPatientInfo = function(value) {
                m_patInfo = value;
            };


            this.getPatientInfo = function() {
                return m_patInfo;
            };

            this.getPersonnelInfo = function() {
                if (!m_prsnlInfo) {
                    m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
                }
                return m_prsnlInfo;
            };

            /**
             * @returns List of encounters that are considered 'ACTIVE'.
             * In the rare case that encounter override is needed, this will return the encounter neccessary to pass
             * to a service for retrieval of data.
             */
            this.getEncounterOverride = function() {
                return m_encntrOverride;
            };



        },
        PatientInformation: function() {
            var m_dob = null;
            var m_sex = null;
            var m_name = "";

            this.setSex = function(value) {
                m_sex = value;
            };
            this.getSex = function() {
                return m_sex;
            };
            this.setDOB = function(value) {
                m_dob = value;
            };
            this.getDOB = function() {
                return m_dob;
            };
            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
        },

        PeriopCases: function() {
            var m_case_id = null;
            var m_days = null;
            var m_hours = null;
            var m_mins = null;
            var m_cntdwn_desc_flag = null;

            this.setCaseID = function(value) {
                m_case_id = value;
            };
            this.getCaseID = function() {
                return m_case_id;
            };
            this.setDays = function(value) {
                m_days = value;
            };
            this.getDays = function() {
                return m_days;
            };
            this.setHours = function(value) {
                m_hours = value;
            };
            this.getHours = function() {
                return m_hours;
            };
            this.setMins = function(value) {
                m_mins = value;
            };
            this.getMins = function() {
                return m_mins;
            };
            this.setCntdwnDscFlg = function(value) {
                m_cntdwn_desc_flag = value;
            };
            this.getCntdwnDscFlg = function() {
                return m_cntdwn_desc_flag;
            };
        },

        ScriptRequest: function(component, loadTimerName) {
            var m_comp = component || null;
            var m_load = loadTimerName || "";
            var m_name = "";
            var m_programName = "";
            var m_params = null;
            var m_blobIn = null;
            var m_async = true;
            var m_responseHandler = null;
            var m_timer = null;
            var m_source = null;
            var m_execCallback = false;
            //Specify whether the consumer is expecting raw data
            var m_requiresRawData = false;

            this.setExecCallback = function(value) {
                m_execCallback = value;
            };

            this.getExecCallback = function() {
                return m_execCallback;
            };

            this.logCompletion = function(reply) {
                logger.logMessage("<b>Request Ended</b><br /><ul>" +
                    "<li>program: " + m_programName + "</li>" +
                    "<li>end_time: " + new Date() + "</li>" +
                    "<li>status: " + reply.status + "</li></ul>");
            };

            this.logStart = function() {
                logger.logMessage("<b>Request Started</b><br /><ul>" +
                    "<li>program: " + m_programName + "</li>" +
                    "<li>start_time: " + new Date() + "</li></ul>");
            };

            this.start = function() {
                MP_Core.XMLCCLRequestCallBack(this.m_comp, this); //eslint-disable-line new-cap
            };

            this.getResponseHandler = function() {
                return m_responseHandler;
            };

            this.setResponseHandler = function(responseHandler) {
                m_responseHandler = responseHandler;
            };

            this.getTimer = function() {
                return m_timer;
            };

            this.setTimer = function(timer) {
                m_timer = timer;
            };

            this.getComponent = function() {
                return m_comp;
            };
            this.getLoadTimer = function() {
                return m_load;
            };
            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
            this.setProgramName = function(value) {
                m_programName = value;
            };
            this.getProgramName = function() {
                return m_programName;
            };
            this.setParameters = function(value) {
                m_params = value;
            };
            this.getParameters = function() {
                return m_params;
            };
            this.setRequestBlobIn = function(value) {
                m_blobIn = value;
            };
            this.getRequestBlobIn = function() {
                return m_blobIn;
            };
            this.setAsync = function(value) {
                m_async = value;
            };
            this.isAsync = function() {
                return m_async;
            };
            this.getSource = function() {
                return m_source;
            };
            this.setSource = function(source) {
                m_source = source;
            };
            this.getRequiresRawData = function() {
                return m_requiresRawData;
            };
            this.setRequiresRawData = function(requiresRaw) {
                m_requiresRawData = requiresRaw;
            };
        },
        ScriptReply: function(component) {
            //used to syne a request to a reply
            var m_name = "";
            //by default every script reply is 'f'ailed unless otherwise noted
            var m_status = "F";
            var m_err = "";
            var m_resp = null;
            var m_comp = component;

            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
            this.setStatus = function(value) {
                m_status = value;
            };
            this.getStatus = function() {
                return m_status;
            };
            this.setError = function(value) {
                m_err = value;
            };
            this.getError = function() {
                return m_err;
            };
            this.setResponse = function(value) {
                m_resp = value;
            };
            this.getResponse = function() {
                return m_resp;
            };
            this.getComponent = function() {
                return m_comp;
            };
        },
        PersonnelInformation: function(prsnlId, patientId) {
            var m_prsnlId = prsnlId;
            //if m_viewableEncntrs remains null, error in retrieval of viewable encntr
            var m_viewableEncntrs = null;
            //load valid encounter list from patcon wrapper
            var patConObj = null;
            try {
                patConObj = CERN_Platform.getDiscernObject("PVCONTXTMPAGE"); //eslint-disable-line new-cap
                logger.logDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "PersonnelInformation");
                if (patConObj) {
                    m_viewableEncntrs = patConObj.GetValidEncounters(patientId); //eslint-disable-line new-cap
                    logger.logDebug("Viewable Encounters: " + m_viewableEncntrs);
                }
            }
            catch (e) {
            }
            finally {
                //release used memory
                patConObj = null;
            }

            this.getPersonnelId = function() {
                return m_prsnlId;
            };
            /**
             * Returns the associated encounter that the provide has the ability to see
             */
            this.getViewableEncounters = function() {
                return m_viewableEncntrs;
            };
        },
        /**
         * Create and return shared resource (viewableEncntrs) for the "Viewable Encounters" for the provided patient person_id.
         * If run within the context of win32 applications, the function will leverage PVCONTXTMPAGE and GetValidEncounters:
         *   https://wiki.ucern.com/display/public/MPDEVWIKI/GetValidEncounters
         * If run outside of win32 applications (MPages web service), this function will leverage request 3200310 (msvc_svr_get_clinctx).
         *
         * Consumers of this function should check the shared resource object that is returned to determine if data exists:
         *   viewableEncntrsObj.isResourceAvailable() && viewableEncntrsObj.getResourceData()
         *
         * If those do not both evaluate to true, the consumer should then add a listener for "viewableEncntrInfoAvailable", which will be invoked when the shared resource data is available.
         *
         * @param patientId The person_id of the patient to retrieve viewable encounters
         * @returns {object} An object that contains the status of retrieving the viewable encounters, and a string of the comma separated viewable encounters (if available)
         */
        GetViewableEncntrs: function(patientId) {
            /**
             * Returns the associated encounter(s) that the currently authenticated provider has the ability to see, from PVCONTXTMPAGE.
             * This logic will be consumed from win32 MPages where PVCONTXTMPAGE is available.
             * @returns {string} List of viewable encounters, comma separated
             */
            function getViewableFromPvContxtMpage() {
                var patConObj = null;
                var m_viewableEncntrs = "";
                try {
                    patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE"); //eslint-disable-line new-cap
                    logger.logDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "getViewableFromPvContxtMpage");
                    if (patConObj) {
                        m_viewableEncntrs = patConObj.GetValidEncounters(patientId); //eslint-disable-line new-cap
                        logger.logDebug("Viewable Encounters obtained from PVCONTXTMPAGE: " + m_viewableEncntrs);
                    }
                }
                catch (e) {
                }
                finally {
                    //release used memory
                    patConObj = null;
                }
                return m_viewableEncntrs;
            }


            /**
             * Make async call to retrieve viewable encounters from clinical context service, using the script mp_exec_std_request.
             * The clinical context service (msvc_svr_get_clinctx, 3200310) will return the authorized (viewable) encounters for the patient in context:
             *   Application Number: 3202004
             *   Task Number: 3202004
             *   Request Number: 3200310
             * This logic will be consumed when PVCONTXTMPAGE is not available.
             * @returns {null}
             */
            function retrieveEncntrsFromClinicalContext() {
                var request = new MP_Core.ScriptRequest();
                var programName = "mp_exec_std_request";
                var jsonString = "{\"REQUESTIN\":{\"PATIENT_ID\":" + patientId + ".0,\"LOAD\":{\"AUTH_ENCOUNTER\":1}}}";
                var params = [ "^MINE^", "~" + jsonString + "~", 3202004, 3202004, 3200310 ];
                request.setProgramName(programName);
                request.setParameters(params);
                request.setAsync(true);
                request.setExecCallback(true);
                MP_Core.XMLCCLRequestCallBack(null, request, handleContextFromService); //eslint-disable-line new-cap
            }

            /**
             * Callback to Handle the reply object from retrieveEncntrsFromClinicalContext()
             * @param {object} MP_Core.ScriptReply object
             * @returns {null}
             */
            function handleContextFromService(replyObj) {
                var m_viewableEncntrs = "";

                // Get the viewableEncntrs SharedResource
                var veResource = MP_Resources.getSharedResource("viewableEncntrs");

                if (replyObj.getStatus() === "S") {
                    try {
                        var recordData = replyObj.getResponse();
                        m_viewableEncntrs = $.map(recordData.AUTH_ENCOUNTER.AUTH_ENCOUNTERS, function(o) {
                            return o.ENCOUNTER_ID + ".0";
                        }).join(",");
                        logger.logDebug("Viewable Encounters obtained from ClinicalContext service: " + m_viewableEncntrs);
                    }
                    catch (err) {
                        logger.logJSError(err, this, "mp_core.js", "GetViewableEncntrs");
                    }
                }
                else {
                    logger.logError("Unable to successfully retrieve Viewable Encounters from ClinicalContext service");
                }

                veResource.setIsAvailable(true);
                veResource.setIsBeingRetrieved(false);
                veResource.setResourceData(m_viewableEncntrs);

                //Fire event for all listeners
                CERN_EventListener.fireEvent(null, self, "viewableEncntrInfoAvailable", veResource);
            }

            var self = this;
            var m_viewableEncntrs = "";

            // create the viewable encounters resource shared resource
            var veResource = MP_Resources.getSharedResource("viewableEncntrs");
            if (!veResource) {
                veResource = new SharedResource("viewableEncntrs");
                MP_Resources.addSharedResource("viewableEncntrs", veResource);
            }

            if (veResource.isResourceAvailable() && veResource.getResourceData()) {
                return veResource;
            }
            else {
                //Attempt to retrieve the viewable encounters from PVCONTXTMPAGE
                m_viewableEncntrs = getViewableFromPvContxtMpage();

                //If we obtained the viewable encounters from PVCONTXTMPAGE, set here, and return SR object
                if (m_viewableEncntrs) {
                    veResource.setResourceData(m_viewableEncntrs);
                    veResource.setIsAvailable(true);
                    return veResource;

                }
                else {
                    //Check to see if the shared resource is currently retrieving data
                    if (!veResource.isBeingRetrieved()) {
                        //Kick off the resource retrieval from ClinicalContext service
                        veResource.setIsBeingRetrieved(true);
                        retrieveEncntrsFromClinicalContext();
                    }
                    //Return the shared resource, which at this point should have isResourceAvailable() == false && getResourceData() == null
                    return veResource;
                }
            }
        },
        /**
         * @deprecated
         * Creates and runs a request for a component based on the specified component, program, and parameter array.
         * This function assumes the script call is being made for a component. This function populates a ScriptRequest
         * object and passes it off to the XmlStandardRequest method, passing null for the callback.
         * @param {MPageComponent} component  component object for which the script is being called.
         * @param {String} program  the CCL program to be run.
         * @param {Array} paramAr  the parameter array to be passed to the CCL program.
         * @param {Boolean} async  whether the script call should be asynchronous or not. (Recommended that it
         * be asynchronous).
         */
        XMLCclRequestWrapper: function(component, program, paramAr, async) {
            var loadTimer = null;
            var renderTimer = null;
            var request = null;
            if (MPageComponent.prototype.isPrototypeOf(component)) {
                //create a component script request
                request = new ComponentScriptRequest();
                request.setComponent(component);
                //Create the loadTimer and renderTimer
                loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
                renderTimer = new RTMSTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                request.setLoadTimer(loadTimer);
                request.setRenderTimer(renderTimer);
            }
            else {
                //Create a standard script request object
                request = new ScriptRequest();
            }
            request.setProgramName(program);
            request.setParameterArray(paramAr || []);
            request.setAsyncIndicator(typeof async === "boolean" ? async : true);
            request.performRequest();
        },
        /**
         * @deprecated
         * As a means in which to provide the consumer to handle the response of the script request, this method
         * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
         * about the response that can be utilized for evaluation.
         * @param component  The component in which is executing the request
         * @param oldRequestObj  A deprecated MP_Core.ScriptRequest Object containing the information about the script being executed
         * @param funcCallBack  The function to execute once the execution of the request has been completed
         */
        XMLCCLRequestCallBack: function(component, oldRequestObj, funcCallback) {
            MP_Core.XmlStandardRequest(component, oldRequestObj, funcCallback); //eslint-disable-line new-cap
        },
        /**
         * @deprecated
         * This wraps the XML requests being made. This function is called by XMLCclRequestWrapper and XMLCCLRequestCallBack.
         * Note that both component and callback are optional. However, if you want something to occur upon the script
         * completing, one or the other must be provided.
         * @param {MPageComponent} component . This parameter is an MPageComponent object. Specific methods will be called on this
         * component to render it, but only if it is provided.
         * @param {ScriptRequest} oldRequestObj   A deprecated MP_Core.ScriptRequest Object containing the information about the script being executed
         * @param {Function} funcCallBack  the function to be called upon a request returning.
         */
        XmlStandardRequest: function(component, oldRequestObj, funcCallback) {
            var loadTimer = null;
            var renderTimer = null;
            var request = null;
            if (MPageComponent.prototype.isPrototypeOf(component)) {
                //create a component script request
                request = new ComponentScriptRequest();
                request.setComponent(component);
                //Create the loadTimer and renderTimer
                loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
                renderTimer = new RTMSTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                request.setLoadTimer(loadTimer);
                request.setRenderTimer(renderTimer);
            }
            else {
                //Create a standard script request object
                request = new ScriptRequest();
                //Create the load timer
                loadTimer = new RTMSTimer(oldRequestObj.getLoadTimer());
                request.setLoadTimer(loadTimer);
            }
            //Copy over the remaining fields of the oldRequestObj
            request.setName(oldRequestObj.getName());
            request.setProgramName(oldRequestObj.getProgramName());
            request.setResponseHandler(funcCallback);
            request.setDataBlob(oldRequestObj.getRequestBlobIn() || "");
            request.setParameterArray(oldRequestObj.getParameters() || []);
            request.setAsyncIndicator(oldRequestObj.isAsync());
            request.setRawDataIndicator(oldRequestObj.getRequiresRawData());
            request.performRequest();
        },
        XMLCCLRequestThread: function(name, component, request) {
            var m_name = name;
            var m_comp = component;

            var m_request = request;
            m_request.setName(name);

            this.getName = function() {
                return m_name;
            };
            this.getComponent = function() {
                return m_comp;
            };
            this.getRequest = function() {
                return m_request;
            };
        },
        XMLCCLRequestThreadManager: function(callbackFunction, component, handleFinalize) {
            var m_threads = null;
            var m_replyAr = null;

            var m_isData = false;
            var m_isError = false;
            var x = 0;

            this.addThread = function(thread) {
                if (!m_threads) {
                    m_threads = [];
                }
                m_threads.push(thread);
            };

            this.begin = function() {
                if (m_threads && m_threads.length > 0) {
                    for (x = m_threads.length; x--;) {
                        //start each xmlcclrequest
                        var thread = m_threads[ x ];
                        MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread); //eslint-disable-line new-cap
                    }
                }
                else {
                    if (handleFinalize) {
                        var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                        component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText); //eslint-disable-line new-cap
                        //After the component has rendered call the postProcessing function to perform any additional actions
                        component.postProcessing();
                    }
                    else {
                        callbackFunction(null, component);
                    }
                }
            };

            this.completeThread = function(reply) {
                if (!m_replyAr) {
                    m_replyAr = [];
                }
                if (reply.getStatus() === "S") {
                    m_isData = true;
                }
                else if (reply.getStatus() === "F") {
                    m_isError = true;
                }

                m_replyAr.push(reply);
                if (m_replyAr.length === m_threads.length) {
                    var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                    var errMsg = null;
                    try {
                        if (handleFinalize) {
                            if (m_isError) {
                                //handle error response
                                errMsg = [];
                                for (x = m_replyAr.length; x--;) {
                                    var rep = m_replyAr[ x ];
                                    if (rep.getStatus() === "F") {
                                        errMsg.push(rep.getError());
                                    }
                                }
                                component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), ""); //eslint-disable-line new-cap
                            }
                            else if (!m_isData) {
                                //handle no data
                                countText = (component.isLineNumberIncluded() ? "(0)" : "");
                                component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText); //eslint-disable-line new-cap
                            }
                            else {
                                callbackFunction(m_replyAr, component);
                            }
                        }
                        else {
                            callbackFunction(m_replyAr, component);
                        }
                    }
                    catch (err) {
                        logger.logJSError(err, component, "mp_core.js", "XMLCCLRequestThreadManager");
                        var i18nCore = i18n.discernabu;
                        errMsg = [ "<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>" ];
                        component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), ""); //eslint-disable-line new-cap
                    }
                    finally {
                        if (component && typeof component.postProcessing !== "undefined") {
                            //After the component has rendered call the postProcessing function to perform any additional actions
                            component.postProcessing();
                        }
                    }
                }
            };
        },
        MapObject: function(name, value) {
            this.name = name;
            this.value = value;
        },


        ReferenceRangeResult: function() {
            //results
            var m_valNLow = -1,
                m_valNHigh = -1,
                m_valCLow = -1,
                m_valCHigh = -1;
            //units of measure
            var m_uomNLow = null,
                m_uomNHigh = null,
                m_uomCLow = null,
                m_uomCHigh = null;
            this.init = function(refRange, codeArray) {
                var nf = MP_Util.GetNumericFormatter(); //eslint-disable-line new-cap
                m_valCLow = nf.format(refRange.CRITICAL_LOW.NUMBER);
                if (refRange.CRITICAL_LOW.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
                m_valCHigh = nf.format(refRange.CRITICAL_HIGH.NUMBER);
                if (refRange.CRITICAL_HIGH.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
                m_valNLow = nf.format(refRange.NORMAL_LOW.NUMBER);
                if (refRange.NORMAL_LOW.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
                m_valNHigh = nf.format(refRange.NORMAL_HIGH.NUMBER);
                if (refRange.NORMAL_HIGH.UNIT_CD != "") { //eslint-disable-line eqeqeq
                    m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray); //eslint-disable-line new-cap
                }
            };
            this.getNormalLow = function() {
                return m_valNLow;
            };
            this.getNormalHigh = function() {
                return m_valNHigh;
            };
            this.getNormalLowUOM = function() {
                return m_uomNLow;
            };
            this.getNormalHighUOM = function() {
                return m_uomNHigh;
            };
            this.getCriticalLow = function() {
                return m_valCLow;
            };
            this.getCriticalHigh = function() {
                return m_valCHigh;
            };
            this.getCriticalLowUOM = function() {
                return m_uomCLow;
            };
            this.getCriticalHighUOM = function() {
                return m_uomCHigh;
            };
            this.toNormalInlineString = function() {
                var low = (m_uomNLow) ? m_uomNLow.display : "";
                var high = (m_uomNHigh) ? m_uomNHigh.display : "";
                if (m_valNLow != 0 || m_valNHigh != 0) { //eslint-disable-line eqeqeq
                    return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high);
                }
                else {
                    return "";
                }
            };
            this.toCriticalInlineString = function() {
                var low = (m_uomCLow) ? m_uomCLow.display : "";
                var high = (m_uomCHigh) ? m_uomCHigh.display : "";
                if (m_valCLow != 0 || m_valCHigh != 0) { //eslint-disable-line eqeqeq
                    return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high);
                }
                else {
                    return "";
                }
            };
        },

        QuantityValue: function() {
            var m_val, m_precision;
            var m_uom = null;
            var m_refRange = null;
            var m_rawValue = 0;
            var m_hasModifier = false;
            this.init = function(result, codeArray) {
                var quantityValue = result.QUANTITY_VALUE;
                var referenceRange = result.REFERENCE_RANGE;
                for (var l = 0, ll = quantityValue.length; l < ll; l++) {
                    var numRes = quantityValue[ l ].NUMBER;
                    m_precision = quantityValue[ l ].PRECISION;
                    if (!isNaN(numRes)) {
                        m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision); //eslint-disable-line new-cap
                        m_rawValue = numRes;
                    }
                    if (quantityValue[ l ].MODIFIER_CD != "") { //eslint-disable-line eqeqeq
                        var modCode = MP_Util.GetValueFromArray(quantityValue[ l ].MODIFIER_CD, codeArray); //eslint-disable-line new-cap
                        if (modCode) {
                            m_val = modCode.display + m_val;
                            m_hasModifier = true;
                        }
                    }
                    if (quantityValue[ l ].UNIT_CD != "") { //eslint-disable-line eqeqeq
                        m_uom = MP_Util.GetValueFromArray(quantityValue[ l ].UNIT_CD, codeArray); //eslint-disable-line new-cap
                    }
                    for (var m = 0, ml = referenceRange.length; m < ml; m++) {
                        m_refRange = new MP_Core.ReferenceRangeResult();
                        m_refRange.init(referenceRange[ m ], codeArray);
                    }
                }
            };

            this.getValue = function() {
                return m_val;
            };
            this.getRawValue = function() {
                return m_rawValue;
            };
            this.getUOM = function() {
                return m_uom;
            };
            this.getRefRange = function() {
                return m_refRange;
            };
            this.getPrecision = function() {
                return m_precision;
            };
            this.toString = function() {
                if (m_uom) {
                    return (m_val + " " + m_uom.display);
                }
                return m_val;
            };
            this.hasModifier = function() {
                return m_hasModifier;
            };
        },
        //measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
        Measurement: function() {
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
            var m_comment_ind = 0;

            this.init = function(eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime) {
                m_eventId = eventId;
                m_personId = personId;
                m_encntrId = encntrId;
                m_eventCode = eventCode;
                m_dateTime = dateTime;
                m_result = resultObj;
                m_updateDateTime = updateDateTime;
            };

            this.initFromRec = function(measObj, codeArray) {
                var effectiveDateTime = new Date();
                var updateDateTime = new Date();
                m_eventId = measObj.EVENT_ID;
                m_personId = measObj.PATIENT_ID;
                m_encntrId = measObj.ENCOUNTER_ID;
                m_eventCode = MP_Util.GetValueFromArray(measObj.EVENT_CD, codeArray); //eslint-disable-line new-cap
                effectiveDateTime.setISO8601(measObj.EFFECTIVE_DATE);
                m_dateTime = effectiveDateTime;
                m_result = MP_Util.Measurement.GetObject(measObj, codeArray); //eslint-disable-line new-cap
                updateDateTime.setISO8601(measObj.UPDATE_DATE);
                m_updateDateTime = updateDateTime;
                m_normalcy = MP_Util.GetValueFromArray(measObj.NORMALCY_CD, codeArray); //eslint-disable-line new-cap
                m_status = MP_Util.GetValueFromArray(measObj.STATUS_CD, codeArray); //eslint-disable-line new-cap
                m_comment = measObj.COMMENT;
                m_comment_ind = measObj.HAS_COMMENTS_IND;
            };

            this.getEventId = function() {
                return m_eventId;
            };
            this.getPersonId = function() {
                return m_personId;
            };
            this.getEncntrId = function() {
                return m_encntrId;
            };
            this.getEventCode = function() {
                return m_eventCode;
            };
            this.getDateTime = function() {
                return m_dateTime;
            };
            this.getUpdateDateTime = function() {
                return m_updateDateTime;
            };
            this.getResult = function() {
                return m_result;
            };
            this.setNormalcy = function(value) {
                m_normalcy = value;
            };
            this.getNormalcy = function() {
                return m_normalcy;
            };
            this.setStatus = function(value) {
                m_status = value;
            };
            this.getStatus = function() {
                return m_status;
            };
            this.isModified = function() {
                if (m_status) {
                    var mean = m_status.meaning;
                    if (mean === "MODIFIED" || mean === "ALTERED") {
                        return true;
                    }
                }
                return false;
            };
            this.getComment = function() {
                return m_comment;
            };
            this.getCommentsIndicator = function() {
                return m_comment_ind;
            };
        },
        MenuItem: function() {
            var m_name = "";
            var m_desc = "";
            var m_id = 0.0;
            var m_meaning;
            var m_valSequence = 0;
            //This is used as the primary grouping value for IView bands
            var m_valTypeFlag = 0;
            //This is used to determine which is the band, section, or item

            this.setDescription = function(value) {
                m_desc = value;
            };
            this.getDescription = function() {
                return m_desc;
            };
            this.setName = function(value) {
                m_name = value;
            };
            this.getName = function() {
                return m_name;
            };
            this.setId = function(value) {
                m_id = value;
            };
            this.getId = function() {
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
        CriterionFilters: function(criterion) {
            var m_criterion = criterion;
            var m_evalAr = [];

            this.addFilter = function(type, value) {
                m_evalAr.push(new MP_Core.MapObject(type, value));
            };
            this.checkFilters = function() {
                var patInfo = m_criterion.getPatientInfo();
                for (var x = m_evalAr.length; x--;) {
                    var filter = m_evalAr[ x ];
                    var dob = null;
                    switch (filter.name) {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            var sex = patInfo.getSex();
                            if (sex) {
                                if (filter.value == sex.meaning) { //eslint-disable-line eqeqeq
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
                            logger.logError("Unhandled criterion filter");
                            return false;
                    }
                }
                return true;
            };
        },
        CreateSimpleError: function(component, sMessage) {
            var errMsg = [];
            var i18nCore = i18n.discernabu;
            var countText = (component.isLineNumberIncluded() ? "(0)" : "");
            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", sMessage, "</li></ul>");
            component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), countText); //eslint-disable-line new-cap
            //After the component has rendered call the postProcessing function to perform any additional actions
            component.postProcessing();
        },
        /**
         * Generates the HTMl for informational messages that will be displayed to the user.  The msgType parameter will be used to determine
         * the correct styling for the message applied. If the message type cannot be mapped to a supported message or the field is left blank, the
         * default styling will be applied.  If custom styling should be applied for the message the customClass parameter can be used to override
         * any of the default properties of the standard messaging styles.
         * @param {string} msgType This must be a string that represents the type of message being created.  The currently supported message types are error,
         * warning, information and busy.  If your message type does not match one of those listed, the default styling will be applied.  This parameter can also be
         * left blank to utilize the default styling.
         * @param {string} msgText This will be the first line of the message and will potentially be styled based on the message type being used.
         * @param {string} msdDetails This will be the text immediately following the msgText line.  This text will not be stylized.
         * @param {string} customClass This is the optional custom class that can be added to the message container which will allow for custom styling of the message
         * information.
         * @returns {string} The HTML markup of the information message to display to the user.
         */
        generateUserMessageHTML: function(msgType, msgText, msgDetails, customClass) {
            var msgHTML = "";

            //check the messageType to make sure it is a string
            if (typeof msgType !== "string") {
                logger.logError("generateUserMessageHTML only accepts msgType parameters of string");
                return "";
            }

            //Determine which HTML string to use based on the type
            switch (msgType.toLowerCase()) {
                case "error":
                    //generate the error HTML
                    msgHTML = "<div class='error-container " + (customClass || "") + "'><span class='error-text message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                case "warning":
                    //generate the warning HTML
                    msgHTML = "<div class='warning-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                case "information":
                    //generate the information HTML
                    msgHTML = "<div class='information-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                case "busy":
                    //generate the busy HTML
                    msgHTML = "<div class='busy-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
                default:
                    msgHTML = "<div class='default-container " + (customClass || "") + "'><span class='message-info-text'>" + (msgText || "") + "</span>" + (msgDetails || "") + "</div>";
                    break;
            }
            return msgHTML;
        }
    };
}();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;

MP_Core.AppUserPreferenceManager = function() {
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
        Initialize: function(criterion, preferenceIdentifier) {
            m_criterion = criterion;
            m_prefIdent = preferenceIdentifier;
            m_jsonObject = null;
        },
        SetPreferences: function(prefString) {
            var jsonEval = JSON.parse(prefString);
            m_jsonObject = jsonEval;
        },
        LoadPreferences: function() {
            if (!m_criterion) {
                logger.logError("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return;
            }
            //If preferences have already been loaded just return
            if (m_jsonObject) {
                return;
            }

            var prefRequest = new ScriptRequest();
            prefRequest.setProgramName("MP_GET_USER_PREFS");
            prefRequest.setParameterArray([ "^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^" ]);
            prefRequest.setAsyncIndicator(false);
            prefRequest.setResponseHandler(function(scriptReply) {
                var status = scriptReply.getStatus();
                var prefsResponse = scriptReply.getResponse();
                if (status === "Z") {
                    return;
                }
                else if (status === "S") {
                    m_jsonObject = JSON.parse(prefsResponse.PREF_STRING);
                }
                else {
                    logger.logError(scriptReply.getError());
                }
            });
            prefRequest.performRequest();
        },
        /**
         * GetPreferences will return the users preferences for the application currently logged into.
         */
        GetPreferences: function() {
            if (!m_criterion) {
                return null;
            }
            if (!m_jsonObject) {
                this.LoadPreferences();  //eslint-disable-line new-cap
            }

            return m_jsonObject;
        },
        SavePreferences: function(reload) {
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

            //alert("groups.length: " + groups.length)
            for (var x = 0, xl = groups.length; x < xl; x++) {
                //TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
                grpId = x + 1;
                //get liquid layout
                var liqLay = Util.Style.g("col-outer1", groups[ x ], "div");
                if (liqLay.length > 0) {
                    //get each child column
                    var cols = Util.gcs(liqLay[ 0 ]);
                    for (var y = 0, yl = cols.length; y < yl; y++) {
                        colId = y + 1;
                        var rows = Util.gcs(cols[ y ]);
                        for (var z = 0, zl = rows.length; z < zl; z++) {
                            var component = {};
                            rowId = z + 1;
                            compId = jQuery(rows[ z ]).attr("id");
                            var compObj = MP_Util.GetCompObjByStyleId(compId);  //eslint-disable-line new-cap
                            component.id = compObj.getComponentId();
                            component.group_seq = grpId;
                            component.col_seq = colId;
                            component.row_seq = rowId;
                            component.preferencesObj = compObj.getPreferencesObj();
                            //Since we are updating the toggle status for all components we will need to make sure all required
                            //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                            //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                            //and not allow the user to toggle that component even though they should be able to.
                            component.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
                            component.grouperFilterLabel = compObj.getGrouperFilterLabel();
                            component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                            component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
                            component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
                            component.selectedTimeFrame = compObj.getSelectedTimeFrame();
                            component.selectedDataGroup = compObj.getSelectedDataGroup();
                            if (jQuery(rows[ z ]).hasClass("closed")) {
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
            WritePreferences(jsonObject);  //eslint-disable-line new-cap

            if (reload !== undefined && reload === false) {
                return;
            }

            CERN_Platform.refreshMPage();
        },
        ClearCompPreferences: function(componentId) {
            var compObj = MP_Util.GetCompObjById(componentId);  //eslint-disable-line new-cap
            var prefObj = m_jsonObject;
            var filterArr = null;

            if (prefObj != null) { //eslint-disable-line eqeqeq
                var strEval = JSON.parse(JSON.stringify(prefObj));
                var strObj = strEval.user_prefs.page_prefs.components;
                for (var x = strObj.length; x--;) {
                    if (strEval && strObj[ x ].id === componentId) {
                        strObj[ x ].grouperFilterLabel = "";
                        strObj[ x ].grouperFilterCatLabel = "";
                        strObj[ x ].grouperFilterCriteria = filterArr;
                        strObj[ x ].grouperFilterCatalogCodes = filterArr;

                        strObj[ x ].selectedTimeFrame = "";
                        strObj[ x ].selectedDataGroup = "";
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
                compObj.setPreferencesObj(null);
                m_jsonObject = strEval;
                WritePreferences(m_jsonObject);  //eslint-disable-line new-cap

                //Use the component's render strategy to update the view after clearing settings
                var renderStrategy = compObj.getRenderStrategy();
                if (renderStrategy) {
                    var uniqueComponentId = renderStrategy.getComponentId();
                    var componentLookbackMenu = $("#lookbackContainer" + uniqueComponentId);
                    if (componentLookbackMenu.length) {
                        componentLookbackMenu.replaceWith(renderStrategy.createComponentLookback());
                    }

                    var componentFilterMenu = $("#filterDropDownMenu" + uniqueComponentId);
                    if (componentFilterMenu.length) {
                        componentFilterMenu.replaceWith(renderStrategy.createComponentFilter());
                    }
                }

                $(compObj.getSectionContentNode()).empty();
                compObj.startComponentDataRetrieval();
            }
        },
        UpdatePrefsIdentifier: function(prefIdentifier) {
            if (prefIdentifier && typeof prefIdentifier === "string") {
                m_prefIdent = prefIdentifier;
            }
        },
        //Updates the component preferences from the components array passed into the function
        UpdateAllCompPreferences: function(componentArr, changePos, saveAsync) {
            var compId = 0;
            var compPrefs = null;
            var compPrefsCnt = 0;
            var compPrefsMap = {};
            var component = null;
            var componentDiv = null;
            var columnDiv = null;

            var namespace = "";
            var newPrefsInd = false;
            var prefObj = null;
            var prefIndx = 0;
            var tempObj = {};
            var x = 0;

            //If saveAsync is anything other then true set it to false
            if (!saveAsync) {
                saveAsync = false;
            }

            //Check the componentArr and make sure is is populated
            if (!componentArr || !componentArr.length) {
                return;
            }

            //Create the prefs object if it doesnt already exist
            prefObj = m_jsonObject || {
                user_prefs: {
                    page_prefs: {
                        components: []
                    }
                }
            };

            //Check to make sure the structure exists so we can populate it
            prefObj.user_prefs = prefObj.user_prefs || {
                page_prefs: {
                    components: []
                }
            };

            prefObj.user_prefs.page_prefs = prefObj.user_prefs.page_prefs || {
                components: []
            };

            prefObj.user_prefs.page_prefs.components = prefObj.user_prefs.page_prefs.components || [];
            compPrefs = prefObj.user_prefs.page_prefs.components;

            //Create a component map so we do not have to loop through the array for each component
            compPrefsCnt = compPrefs.length;
            for (x = compPrefsCnt; x--;) {
                compPrefsMap[ compPrefs[ x ].id ] = x;
            }

            //Loop through all of the components and update their preferences in the preferences object.
            compPrefsCnt = componentArr.length;
            for (x = compPrefsCnt; x--;) {
                component = componentArr[ x ];
                //Check to see if there is an existing preferences object
                if (typeof compPrefsMap[ component.getComponentId() ] !== "undefined") {
                    //Update exiting component preferences
                    prefIndx = compPrefsMap[ component.getComponentId() ];
                    tempObj = compPrefs[ prefIndx ];
                    newPrefsInd = false;
                }
                else {
                    tempObj = {};
                    newPrefsInd = true;
                }
                //Save the components basic settings
                tempObj.id = component.getComponentId();
                tempObj.group_seq = component.getPageGroupSequence();
                tempObj.col_seq = component.getColumn();
                tempObj.row_seq = component.getSequence();
                tempObj.preferencesObj = component.getPreferencesObj();
                //Since we are updating the toggle status for all components we will need to make sure all required
                //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                //and not allow the user to toggle that component even though they should be able to.
                tempObj.toggleStatus = (component.getToggleStatus() === 2) ? 1 : component.getToggleStatus();
                tempObj.expanded = component.isExpanded();
                //Update the infoButton information
                tempObj.IsInfoButtonEnabled = component.isInfoButtonEnabled();

                if (component.getGrouperFilterLabel()) {
                    tempObj.grouperFilterLabel = component.getGrouperFilterLabel();
                }
                if (component.getGrouperFilterCriteria()) {
                    tempObj.grouperFilterCriteria = component.getGrouperFilterCriteria();
                }
                if (component.getGrouperFilterCatLabel()) {
                    tempObj.grouperFilterCatLabel = component.getGrouperFilterCatLabel();
                }
                if (component.getGrouperFilterCatalogCodes()) {
                    tempObj.grouperFilterCatalogCodes = component.getGrouperFilterCatalogCodes();
                }

                if (component.getSelectedTimeFrame()) {
                    tempObj.selectedTimeFrame = component.getSelectedTimeFrame();
                }
                if (component.getSelectedDataGroup()) {
                    tempObj.selectedDataGroup = component.getSelectedDataGroup();
                }

                //Push the new preferences object into the array
                if (newPrefsInd) {
                    compPrefs.push(tempObj);
                    //Update the mapping with the new element info
                    compPrefsMap[ tempObj.id ] = compPrefs.length - 1;
                }
            }

            //If the changePos flag has been set we will need to update the positions of all components without blowing away existing
            // preferences.
            if (changePos) {
                for (x = compPrefsCnt; x--;) {
                    component = componentArr[ x ];
                    namespace = component.getStyles().getNameSpace();
                    compId = component.getComponentId();
                    //Get component div, if the component is added to contextual view get their ghosted version.
                    if (component.isAddedToContextualView()) {
                        componentDiv = $("#" + namespace + compId + "PlaceholderView");
                    } else {
                        componentDiv = $("#" + namespace + compId);
                    }
                    if (componentDiv.length) {
                        //Get the preferences object
                        prefIndx = compPrefsMap[ component.getComponentId() ];
                        tempObj = compPrefs[ prefIndx ];
                        //Get the parent of that component container and find out which index it is located at and use that as the sequence.
                        columnDiv = componentDiv.parent();
                        tempObj.col_seq = columnDiv.index() + 1;
                        tempObj.row_seq = componentDiv.index();
                        //Save the new column and sequence back into the component
                        component.setColumn(tempObj.col_seq);
                        component.setSequence(tempObj.row_seq);
                    }
                }
            }

            //Save the preferences back to the preferences object.
            m_jsonObject = prefObj;
            WritePreferences(m_jsonObject, saveAsync);  //eslint-disable-line new-cap
        },
        UpdateSingleCompPreferences: function(componentObject, saveAsync) {
            MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences([ componentObject ], false, saveAsync);  //eslint-disable-line new-cap
        },
        SaveCompPreferences: function(componentId, theme, expCol, changePos, infoButton) {
            var compObj = MP_Util.GetCompObjById(componentId);  //eslint-disable-line new-cap
            var prefObj = m_jsonObject;
            var noMatch = true;
            var x;
            var xl;

            if (prefObj != null && !changePos) { //eslint-disable-line eqeqeq
                var strEval = JSON.parse(JSON.stringify(prefObj));
                var strObj = strEval.user_prefs.page_prefs.components;

                for (x = strObj.length; x--;) {
                    if (strEval && strObj[ x ].id === componentId) {
                        noMatch = false;
                        if (theme) {
                            strObj[ x ].compThemeColor = theme;
                        }
                        if (expCol) {
                            if (expCol == "1") { //eslint-disable-line eqeqeq
                                strObj[ x ].expanded = true;
                            }
                            else {
                                strObj[ x ].expanded = false;
                            }
                        }

                        if (infoButton) {
                            if (infoButton == "1") {//eslint-disable-line eqeqeq
                                strObj[ x ].IsInfoButtonEnabled = 1;
                            }
                            else {
                                strObj[ x ].IsInfoButtonEnabled = 0;
                            }
                        }

                        if (compObj.getGrouperFilterLabel()) {
                            strObj[ x ].grouperFilterLabel = compObj.getGrouperFilterLabel();
                        }
                        if (compObj.getGrouperFilterCatLabel()) {
                            strObj[ x ].grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                        }
                        if (compObj.getGrouperFilterCriteria()) {
                            strObj[ x ].grouperFilterCriteria = compObj.getGrouperFilterCriteria();
                        }
                        if (compObj.getGrouperFilterCatalogCodes() || compObj.getGrouperFilterCatalogCodes() === null) {
                            strObj[ x ].grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
                        }
                        else {
                            strObj[ x ].grouperFilterCatalogCodes = [];
                        }

                        if (compObj.getSelectedTimeFrame()) {
                            strObj[ x ].selectedTimeFrame = compObj.getSelectedTimeFrame();
                        }
                        if (compObj.getSelectedDataGroup()) {
                            strObj[ x ].selectedDataGroup = compObj.getSelectedDataGroup();
                        }
                        //Save the components toggle status and the column and sequence information
                        //Since we are updating the toggle status for all components we will need to make sure all required
                        //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                        //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                        //and not allow the user to toggle that component even though they should be able to.
                        strObj[ x ].toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
                        strObj[ x ].col_seq = compObj.getColumn();
                        strObj[ x ].row_seq = compObj.getSequence();
                        strObj[ x ].preferencesObj = compObj.getPreferencesObj();
                    }
                }

                if (noMatch) {//single comp change but comp doesn't have user prefs
                    var tempObj = {};
                    tempObj.id = componentId;
                    tempObj.group_seq = compObj.getPageGroupSequence();
                    tempObj.col_seq = compObj.getColumn();
                    tempObj.row_seq = compObj.getSequence();
                    tempObj.preferencesObj = compObj.getPreferencesObj();
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
                    //Since we are updating the toggle status for all components we will need to make sure all required
                    //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                    //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                    //and not allow the user to toggle that component even though they should be able to.
                    tempObj.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();

                    tempObj.expanded = compObj.isExpanded();
                    strObj.push(tempObj);
                }
                m_jsonObject = strEval;
                WritePreferences(m_jsonObject);  //eslint-disable-line new-cap
            }
            else {
                var body = document.body;
                var groups = Util.Style.g("col-group", body, "div");
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

                for (x = 0, xl = groups.length; x < xl; x++) {
                    //get liquid layout
                    var liqLay = Util.Style.g("col-outer1", groups[ x ], "div");
                    if (liqLay.length > 0) {
                        //get each child column
                        var cols = Util.gcs(liqLay[ 0 ]);
                        for (var y = 0, yl = cols.length; y < yl; y++) {
                            colId = y + 1;
                            var rows = Util.gcs(cols[ y ]);
                            for (var z = 0, zl = rows.length; z < zl; z++) {
                                var component = {};
                                rowId = z + 1;
                                compId = jQuery(rows[ z ]).attr("id");
                                compObj = MP_Util.GetCompObjByStyleId(compId); //eslint-disable-line new-cap
                                //Ensure that the component object was successfully retrieved
                                if (!compObj) {
                                    continue;
                                }
                                component.id = compObj.getComponentId();

                                if (compObj.getColumn() !== 99) {
                                    component.group_seq = 1;
                                    component.col_seq = colId;
                                    component.row_seq = rowId;
                                }
                                else {
                                    component.group_seq = 0;
                                    component.col_seq = 99;
                                    component.row_seq = rowId;
                                }
                                if (compObj.getCompColor()) {
                                    component.compThemeColor = compObj.getCompColor();
                                }
                                //Save the components toggle status
                                //Since we are updating the toggle status for all components we will need to make sure all required
                                //components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
                                //Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
                                //and not allow the user to toggle that component even though they should be able to.
                                component.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
                                compObj.setColumn(component.col_seq);
                                compObj.setSequence(component.row_seq);
                                //added preferences to component
                                component.preferencesObj = compObj.getPreferencesObj();
                                component.grouperFilterLabel = compObj.getGrouperFilterLabel();
                                component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                                component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();

                                component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();

                                component.selectedTimeFrame = compObj.getSelectedTimeFrame();
                                component.selectedDataGroup = compObj.getSelectedDataGroup();
                                if (jQuery(rows[ z ]).hasClass("closed")) {
                                    component.expanded = false;
                                }
                                else {
                                    component.expanded = true;
                                }
                                if (compObj.hasInfoButton()) {
                                    if (infoButton) {
                                        component.IsInfoButtonEnabled = 1;
                                    }
                                    else {
                                        component.IsInfoButtonEnabled = 0;
                                    }
                                }
                                components.push(component);
                            }
                        }
                    }
                }
                // get the selected components' settings from above and compare with prefObj by parsing it.
                // matched components get updated and other components ignored.
                // copy the updated new prefs to m_jsonObject
                // save prefs JSON using WritePreferences(m_jsonObject)

                if (prefObj) {	//check for preference object; if found go for update; else don'nt update
                    strObj = prefObj.user_prefs.page_prefs.components;
                    for (x = strObj.length; x--;) {
                        for (y = components.length; y--;) {
                            if (strObj[ x ].id === components[ y ].id) {
                                strObj[ x ] = components[ y ]; //update only matched component's preferences
                                break;
                            }
                        }
                    }
                    m_jsonObject = prefObj;
                    WritePreferences(m_jsonObject); //eslint-disable-line new-cap
                }
                else {
                    WritePreferences(jsonObject); //eslint-disable-line new-cap
                    m_jsonObject = jsonObject; //update the m_jsonObject(global).
                }
            }
        },
        ClearPreferences: function() {
            WritePreferences(null); //eslint-disable-line new-cap
            //Refresh the active view when we'll do soft refresh.
            MP_Viewpoint.refreshActiveView();
        },

        /**
         * Returns the json object associated to the primary div id of the component.
         * It is assumed LoadPreferences has been called prior to execution.
         *
         * @param {Object} id - The ID that we're trying to match with a component.
         *
         * @returns {MPageComponent|null} The matching component, if found. Otherwise, null.
         *
         * @public
         */
        GetComponentById: function(id) {
            var match = null;
            // If anything goes wrong within the try block, we'll just return null.
            try {
                m_jsonObject.user_prefs.page_prefs.components.some(function(component) {
                    if (component.id == id) { //eslint-disable-line eqeqeq
                        match = component;
                        return true;
                    }
                });
            }
            catch (err) {
                // Stop error propagation
            }
            finally {
                return match;
            }
        }
    };

    function WritePreferences(jsonObject, saveAsync) {
        var prefs = (jsonObject != null) ? JSON.stringify(jsonObject) : ""; //eslint-disable-line eqeqeq

        //Create the script request and perform it
        var prefRequest = new ScriptRequest();
        prefRequest.setProgramName("MP_MAINTAIN_USER_PREFS");
        prefRequest.setParameterArray([ "^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "~" + prefs + "~" ]);
        prefRequest.setAsyncIndicator(saveAsync || false);
        prefRequest.setResponseHandler(function(scriptReply) {
            var status = scriptReply.getStatus();

            if (status === "Z") {
                m_jsonObject = null;
            }
            else if (status === "S") {
                m_jsonObject = jsonObject;
            }
            else {
                logger.logError(scriptReply.getError());
            }
        });
        prefRequest.performRequest();
    }
}();

/**
 * @namespace
 */
var MP_Util = function() { //eslint-disable-line no-redeclare
    var m_df = null;
    var m_nf = null;
    var m_codeSets = [];
    return {
        addComponentsToGlobalStorage: function(components) {
            //If you try to add nothing, just return
            if (!components || !components.length) {
                return;
            }
            //If for some reason the global component storage is null, new it up
            if (CERN_MPageComponents === null) {
                CERN_MPageComponents = [];
            }
            //Store this view's components in the global component list
            for (var x = 0, xl = components.length; x < xl; x++) {
                if (components[ x ]) {
                    CERN_MPageComponents.push(components[ x ]);
                }
            }
        },
        GetComponentArray: function(components) {
            var grpAr = [];
            var colAr = [];
            var rowAr = [];
            var curCol = -1;
            var curGrp = -1;

            //first layout the group/columns/rows of components
            if (components != null) { //eslint-disable-line eqeqeq
                components.sort(SortMPageComponents);

                for (var x = 0, xl = components.length; x < xl; x++) {
                    var component = components[ x ];

                    if (component.isDisplayable()) {//based on filter logic, only display if criteria is met
                        var compGrp = component.getPageGroupSequence();
                        var compCol = component.getColumn();

                        if (compGrp != curGrp) { //eslint-disable-line eqeqeq
                            curCol = -1;
                            colAr = [];
                            grpAr.push(colAr);
                            curGrp = compGrp;
                        }

                        if (compCol != curCol) { //eslint-disable-line eqeqeq
                            rowAr = [];
                            colAr.push(rowAr);
                            curCol = compCol;
                        }
                        rowAr.push(component);
                    }
                }
            }
            return grpAr;
        },
        /**
         * Helper utility to retrieve the <code>Criterion</code> Object generated from the provide JSON
         * @param js_criterion  The JSON associated to the criterion data that is to be loaded
         * @param static_content  The <code>String</code> location in which the static content resides
         */
        GetCriterion: function(js_criterion, static_content) {
            logger.logDebug("Criterion: " + JSON.stringify(js_criterion));
            var jsCrit = js_criterion.CRITERION;
            var criterion = new MP_Core.Criterion(jsCrit, static_content);
            var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES); //eslint-disable-line new-cap
            var jsPatInfo = jsCrit.PERSON_INFO;
            var patInfo = new MP_Core.PatientInformation();
            patInfo.setName(jsPatInfo.PERSON_NAME);
            patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray)); //eslint-disable-line new-cap
            if (jsPatInfo.DOB != "") { //eslint-disable-line eqeqeq
                var dt = new Date();
                dt.setISO8601(jsPatInfo.DOB);
                patInfo.setDOB(dt);
            }
            criterion.setPatientInfo(patInfo);
            return criterion;
        },
        /**
         * Calculates the within time from the provide date and time.
         * @param dateTime  The <code>Date</code> Object in which to calculate the within time
         * @returns <code>String</code> representing the time that has passed from the provided date and time
         */
        CalcWithinTime: function(dateTime) {
            return (GetDateDiffString(dateTime, null, null, true)); //eslint-disable-line new-cap
        },
        /**
         * Calculates the age of a patient from a given point in time.  If the point in time is not provided, the current date/time is
         * utilized
         * @param birthDt  The <code>Date</code> Object in which to calculate the age of the patient
         * @param fromDate  The <code>Date</code> Object in which to calculate the age of the patient from.  This is useful in
         * cases
         * where the patient is deceased and the date utilized is the deceased date.
         * @returns <code>String</code> representing the age of the patient
         */
        CalcAge: function(birthDt, fromDate) {
            //If from Date is null (not passed in) then set to current Date
            fromDate = (fromDate) ? fromDate : new Date();
            return (GetDateDiffString(birthDt, fromDate, 1, false)); //eslint-disable-line new-cap
        },
        /**
         * Display the date and time based on the configuration of the component
         * @param component  The component in which holds the configuration for the date formatting
         * @param date  The date in which to properly format
         * @returns <code>String</code> representing the date and time of the date provided
         */
        DisplayDateByOption: function(component, date) {
            var df = MP_Util.GetDateFormatter(); //eslint-disable-line new-cap
            switch (component.getDateFormat()) {
                case 1:
                    return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR));
                case 2:
                    return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
                case 3:
                    return (MP_Util.CalcWithinTime(date)); //eslint-disable-line new-cap
                case 4:
                    //Display No Date.  Additional logic will need to be applied to hide column.
                    return ("&nbsp");
                default:
                    return df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
            }
        },
        LaunchMenu: function(menuId, componentId) {
            var menu = _g(menuId);
            MP_Util.closeMenuInit(menu, componentId);
            if (menu != null) {  //eslint-disable-line eqeqeq
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
        LaunchCompFilterSelection: function(compId, eventSetIndex, applyFilterInd) {
            var component = MP_Util.GetCompObjById(compId); //eslint-disable-line new-cap
            var i18nCore = i18n.discernabu;
            var style = component.getStyles();
            var ns = style.getNameSpace();
            var mnuDisplay;
            var newFilterAppliedSpan;
            var filterAppliedArr;
            var lbDropDownDiv;

            if (eventSetIndex === -1) {
                mnuDisplay = i18nCore.FACILITY_DEFINED_VIEW;
            }
            else {
                if (ns === "ohx" || ns === "ohx2") {
                    mnuDisplay = component.getGrouperCatLabel(eventSetIndex).toString();
                }
                else {
                    mnuDisplay = component.getGrouperLabel(eventSetIndex).toString();
                }
            }
            var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
            var styleId = style.getId();
            var loc = component.getCriterion().static_content;
            var mnuId = styleId + "TypeMenu";
            var z = 0;

            if (ns === "ohx" || ns === "ohx2") {
                var catCodeList = component.getGrouperCatalogCodes(eventSetIndex);
            }
            else {
                var eventSetList = component.getGrouperCriteria(eventSetIndex);
            }

            //Set component prefs variables with filter settings
            if (ns === "ohx" || ns === "ohx2") {
                component.setGrouperFilterCatLabel(mnuDisplay);
            }
            else {
                component.setGrouperFilterLabel(mnuDisplay);
            }
            if (mnuDisplay !== dispVar) {

                if (ns === "ohx" || ns === "ohx2") {
                    component.setGrouperFilterCatalogCodes(catCodeList);
                }
                else {
                    component.setGrouperFilterCriteria(eventSetList);
                }

            }
            else {
                component.setGrouperFilterCriteria(null);
                component.setGrouperFilterCatalogCodes(null);
            }

            //Find Filter Applied msg span and replace it only if the Facility defined view is not selected
            var filterAppliedSpan = _g("cf" + compId + "msg");
            if (filterAppliedSpan) {
                // Remove the old span element
                Util.de(filterAppliedSpan);
            }
            if (mnuDisplay !== dispVar) {
                newFilterAppliedSpan = Util.ce("span");
                filterAppliedArr = [ "<span id='cf", compId, "msg' class='filter-applied-msg' title='", mnuDisplay, "'>", i18nCore.FILTER_APPLIED, "</span>" ];
                newFilterAppliedSpan.innerHTML = filterAppliedArr.join("");
                lbDropDownDiv = _g("lbMnuDisplay" + compId);
                Util.ia(newFilterAppliedSpan, lbDropDownDiv);
            }
            else {
                newFilterAppliedSpan = Util.ce("span");
                filterAppliedArr = [ "<span id='cf", compId, "msg' class='filter-applied-msg' title=''></span>" ];
                newFilterAppliedSpan.innerHTML = filterAppliedArr.join("");
                lbDropDownDiv = _g("lbMnuDisplay" + compId);
                Util.ia(newFilterAppliedSpan, lbDropDownDiv);
            }

            //Find the content div
            var contentDiv = _g("Accordion" + compId + "ContentDiv");
            contentDiv.innerHTML = "";

            //Create the new content div innerHTML with the select list
            var contentDivArr = [];
            contentDivArr.push("<div id='cf", mnuId, "' class='acc-mnu'>");
            contentDivArr.push("<span id='cflabel", compId, "' onclick='MP_Util.LaunchMenu(\"", mnuId, "\", \"", styleId, "\");'>", i18nCore.FILTER_LABEL, mnuDisplay, "<a id='compFilterDrop", compId, "'><img src='", loc, "/images/3943_16.gif'></a></span>");
            contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='acc-mnu-contentbox'>");
            contentDivArr.push("<div><span id='cf", styleId, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",-1,1);'>", i18nCore.FACILITY_DEFINED_VIEW, "</span></div>");

            var groupLen = component.m_grouper_arr.length;
            for (z = 0; z < groupLen; z++) {
                if (component.getGrouperLabel(z)) {
                    contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", z, ",1);'>", component.getGrouperLabel(z).toString(), "</span></div>");
                }
                if (component.getGrouperCatLabel(z)) {
                    contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", z, ",1);'>", component.getGrouperCatLabel(z).toString(), "</span></div>");
                }
            }
            contentDivArr.push("</div></div></div>");
            contentDiv.innerHTML = contentDivArr.join("");

            if (applyFilterInd === 1) {
                if (mnuDisplay === i18nCore.FACILITY_DEFINED_VIEW) {
                    component.startComponentDataRetrieval();
                }
                else {

                    if (ns === "ohx" || ns === "ohx2") {
                        component.FilterRefresh(mnuDisplay, catCodeList); //eslint-disable-line new-cap
                    }
                    else {
                        component.FilterRefresh(mnuDisplay, eventSetList); //eslint-disable-line new-cap
                    }

                }
            }
        },
        closeMenuInit: function(inMenu, compId) {
            var menuId;
            var docMenuId = compId + "Menu";
            var lbMenuId = compId + "Mnu";
            var cfMenuId = compId + "TypeMenu";

            var menuLeave = function(e) {
                if (!e) {
                    e = window.event;
                }
                if (e.relatedTarget.id == inMenu.id) {  //eslint-disable-line eqeqeq
                    Util.Style.acss(inMenu, "menu-hide");
                }
                e.stopPropagation();
                Util.cancelBubble(e);
            };
            if (inMenu.id == docMenuId || inMenu.id == lbMenuId || inMenu.id == cfMenuId) { //eslint-disable-line eqeqeq
                menuId = compId;
            }
            if (!e)
                var e = window.event;
            if (window.attachEvent) {
                Util.addEvent(inMenu, "mouseleave", function() {
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
        CreateTitleText: function(component, nbr, optionalText) {
            var ar = [];
            if (component.isLineNumberIncluded()) {
                ar.push("(", nbr, ")");
            }
            if (optionalText && optionalText !== "") {
                ar.push(" ", optionalText);
            }
            return ar.join("");
        },
        /**
         * A helper utility to determine if a content body should be considered scrollable
         * @param component  The component in which is being evaluated
         * @param nbr  The number of items in which to consider scrolling enabled
         */
        GetContentClass: function(component, nbr) {
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
        CreateTimer: function(timerName, subTimerName, metaData1, metaData2, metaData3) {
            var rtmsTimer = new RTMSTimer(timerName, subTimerName).addMetaData("rtms.legacy.metadata.1", metaData1 || null).addMetaData("rtms.legacy.metadata.2", metaData2 || null).addMetaData("rtms.legacy.metadata.3", metaData3 || null);
            rtmsTimer.start();
            return rtmsTimer;
        },
        /**
         * Retrieves the code values for a given code set
         * @param {number} codeSet The code set in which to retrieve
         * @param {boolean} async A boolean value indicating if the script call should be asynchronous.
         * @returns A list of code from the code set
         */
        GetCodeSet: function(codeSet, async) {
            var codes = [];
            var codeSetRequest = new ScriptRequest();
            codeSetRequest.setProgramName("MP_GET_CODESET");
            codeSetRequest.setParameterArray([ "^MINE^", codeSet + ".0" ]);
            codeSetRequest.setAsyncIndicator(async);
            codeSetRequest.setResponseHandler(function(dataReply) {
                var codeSetObj = dataReply.getResponse();
                if (dataReply.getStatus() === "S") {
                    codes = MP_Util.LoadCodeListJSON(codeSetObj.CODES); //eslint-disable-line new-cap
                }
            });
            codeSetRequest.performRequest();
            return codes;
        },
        /**
         * Retrieves the code values for a given code set asynchronously and returns the
         * source codes. If the codes are in the Shared Resource then the query to MP_GET_CODESET
         * is not made
         *
         * @param {number} codeSet The code set in which to retrieve
         * @param {Function} Callback function called when the code set values are retrieved
         */

        GetCodeSetAsync: function(codeSet, callbackFn) {
            try {
                var codes = [];
                var resourceName = "CODESET_" + codeSet + ".0";
                //Check for the codes in Shared Resource
                var codeSetToken = MP_Resources.getSharedResource(resourceName);
                if (codeSetToken && codeSetToken.isResourceAvailable()) {
                    callbackFn(codeSetToken.getResourceData());
                }
                else {
                    var codeSetRequest = new ScriptRequest();
                    codeSetRequest.setProgramName("MP_GET_CODESET");
                    codeSetRequest.setParameterArray([ "^MINE^", codeSet + ".0" ]);
                    codeSetRequest.setAsyncIndicator(true);
                    codeSetRequest.setResponseHandler(function(dataReply) {
                        var codeSetObj = dataReply.getResponse();
                        if (codeSetObj && dataReply.getStatus() === "S") {
                            codes = codeSetObj.CODES;
                            codeSetToken = new SharedResource(resourceName);
                            if (codeSetToken) {
                                codeSetToken.setResourceData(codes);
                                codeSetToken.setIsAvailable(true);
                                MP_Resources.addSharedResource(resourceName, codeSetToken);
                            }
                            callbackFn(codes);
                        }
                        else if (dataReply.getStatus() === "Z") {
                            logger.logError("No source codes retrieved, Code Set: " + codeSet);
                        }
                        else {
                            logger.logError("There was an error retrieving source codes, Code Set: " + codeSet);
                        }
                    });
                    codeSetRequest.performRequest();
                }
            }
            catch (err) {
                logger.logJSError(err, null, "mp_core.js", "GetCodeSetAsync");
            }
        },

        /**
         * Will return a code object from the mapped list by the cdf_meaning
         * @param mapCodes  The map of code values to search
         * @param meaning  The cdf_meaning of the code value to search
         * @returns The code object associated to the cdf_meaning provides.  Else null
         */
        GetCodeByMeaning: function(mapCodes, meaning) {
            for (var x = mapCodes.length; x--;) {
                var code = mapCodes[ x ].value;
                if (code.meaning == meaning)  //eslint-disable-line eqeqeq
                    return code;
            }
            return null;
        },
        GetCodeValueByMeaning: function(meaning, codeSet) {
            var list = m_codeSets[ codeSet ];
            if (!list) {
                list = m_codeSets[ codeSet ] = MP_Util.GetCodeSet(codeSet, false);  //eslint-disable-line new-cap
            }
            if (list && list.length > 0) {
                for (var x = list.length; x--;) {
                    var code = list[ x ].value;
                    if (code.meaning === meaning) {
                        return code;
                    }
                }
            }
            return null;
        },
        /**
         * Will search for a value within the provided mapped array and return the value associated to the name/value pair
         * @param mapItems  The mapped array of items to search through
         * @param item  The item in which to search
         * @returns The value from the name/value pair
         */
        GetItemFromMapArray: function(mapItems, item) {
            for (var x = 0; x < mapItems.length; x++) {
                if (mapItems[ x ].name == item)  //eslint-disable-line eqeqeq
                    return mapItems[ x ].value;
            }
        },
        /**
         * Add an item to the array of items associated to the map key
         * @param mapItems  The map array to search within
         * @param key  The primary key that will be searching for within the map array
         * @param value  The object that is to be added to the map array
         */
        AddItemToMapArray: function(mapItems, key, value) {
            var ar = MP_Util.GetItemFromMapArray(mapItems, key); //eslint-disable-line new-cap
            if (!ar) {
                ar = [];
                mapItems.push(new MP_Core.MapObject(key, ar));
            }
            ar.push(value);
        },

        CreateClinNoteLink: function(patient_id, encntr_id, event_id, display, docViewerType, pevent_id) {
            var docType = (docViewerType && docViewerType > "") ? docViewerType : "STANDARD";
            var doclink = "";
            if (event_id > 0) {
                var ar = [];
                ar.push(patient_id, encntr_id, event_id, "\"" + docType + "\"", pevent_id);
                doclink = "<a onclick='javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + "); return false;' href='#'>" + display + "</a>";
            }
            else {
                doclink = display;
            }
            return (doclink);
        },

        /**
         * Sorting by Collation Sequence: The sortBySequence function will return a flag either -1,0, or 1 according to the SEQUENCE field
         *
         * @param {item a, item b} a,b are two items whose SEQUENCE field will be compared to each other
         * @returns {integer} 0 if SEQUENCE is equal, 1 if item a's SEQUENCE is greater than item B's SEQUENCE, -1 if
         * less
         */
        SortBySequence: function(a, b) {
            try {
                var aSeq = a.SEQUENCE;
                var bSeq = b.SEQUENCE;

                // If the sequence is not defined then the value is either 0 or nothing, it would take the alternate route
                if (a.SEQUENCE) {
                    if (aSeq > bSeq) {
                        return 1;
                    }
                    else {
                        if (aSeq < bSeq) {
                            return -1;
                        }
                        return 0;
                    }
                }
            }
            catch (err) {
                MP_Util.LogJSError(err, this, "mp_core.js", "sortBySequence"); //eslint-disable-line new-cap
            }
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
        LaunchClinNoteViewer: function(patient_id, encntr_id, event_id, docViewerType, pevent_id) {
            /*eslint-disable new-cap*/
            var x = 0;
            var m_dPersonId = parseFloat(patient_id);
            var m_dPeventId = parseFloat(pevent_id);
            var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE"); //eslint-disable-line new-cap
            logger.logDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
            try {
                switch (docViewerType) {
                    case "AP":
                        viewerObj.CreateAPViewer();
                        viewerObj.AppendAPEvent(event_id, m_dPeventId);
                        viewerObj.LaunchAPViewer();
                        break;
                    case "DOC":
                        viewerObj.CreateDocViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendDocEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendDocEvent(event_id);
                        }
                        viewerObj.LaunchDocViewer();
                        break;
                    case "EVENT":
                        viewerObj.CreateEventViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendEvent(event_id);
                        }
                        viewerObj.LaunchEventViewer();
                        break;
                    case "MICRO":
                        viewerObj.CreateMicroViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendMicroEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendMicroEvent(event_id);
                        }
                        viewerObj.LaunchMicroViewer();
                        break;
                    case "GRP":
                        viewerObj.CreateGroupViewer();
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendGroupEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendGroupEvent(event_id);
                        }
                        viewerObj.LaunchGroupViewer();
                        break;
                    case "PROC":
                        viewerObj.CreateProcViewer(m_dPersonId);
                        if (MP_Util.IsArray(event_id)) {
                            for (x = event_id.length; x--;) {
                                viewerObj.AppendProcEvent(event_id[ x ]);
                            }
                        }
                        else {
                            viewerObj.AppendProcEvent(event_id);
                        }
                        viewerObj.LaunchProcViewer();
                        break;
                    case "HLA":
                        viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, event_id);
                        break;
                    case "NR":
                        viewerObj.LaunchRemindersViewer(event_id);
                        break;
                    case "STANDARD":
                        alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS); //eslint-disable-line no-alert
                        break;
                }
            }
            catch (err) {
                logger.logJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
                alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.CONTACT_ADMINISTRATOR); //eslint-disable-line no-alert
            }
            /*eslint-enable new-cap*/
        },
        IsArray: function(input) {
            return ( typeof (input) === "object" && ( input instanceof Array));
        },
        IsString: function(input) {
            return ( typeof (input) === "string");
        },
        HandleNoDataResponse: function(nameSpace) {  //eslint-disable-line no-unused-vars
            var i18nCore = i18n.discernabu;
            return ("<h3 class='info-hd'><span class='res-normal'>" + i18nCore.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18nCore.NO_RESULTS_FOUND + "</span>");
        },
        HandleErrorResponse: function(nameSpace, errorMessage) {
            var ar = [];
            var i18nCore = i18n.discernabu;
            //Create the HTML that will be returned to the component
            var ns = (nameSpace && nameSpace.length > 0) ? nameSpace + "-" : "";
            ar.push("<h3 class='info-hd'><span class='res-normal'>", i18nCore.ERROR_RETREIVING_DATA, "</span></h3>");
            ar.push("<dl class='", ns, "info error-message error-text'><dd><span>", i18nCore.ERROR_RETREIVING_DATA, "</span></dd></dl>");
            //log the error out to the JSLogger
            if (errorMessage && errorMessage.length) {
                logger.logError(i18n.COMPONENTS + ": " + nameSpace + "<br />" + errorMessage);
            }
            return ar.join("");
        },
        GetValueFromArray: function(name, array) {
            if (array != null) {  //eslint-disable-line eqeqeq
                for (var x = 0, xi = array.length; x < xi; x++) {
                    if (array[ x ].name == name) {  //eslint-disable-line eqeqeq
                        return (array[ x ].value);
                    }
                }
            }
            return (null);
        },

        GetCompObjById: function(id) {
            var comps = CERN_MPageComponents;
            var cLen = comps.length;
            for (var i = cLen; i--;) {
                var comp = comps[ i ];
                if (comp.m_componentId === id) {
                    return comp;
                }
            }
            return (null);
        },
        GetCompObjByStyleId: function(id) {
            var cLen = CERN_MPageComponents.length;
            for (var i = cLen; i--;) {
                var comp = CERN_MPageComponents[ i ];
                var styles = comp.getStyles();
                if (styles.getId() === id) {
                    return comp;
                }
            }
            return (null);
        },
        LoadCodeListJSON: function(parentElement) {
            var codeArray = [];
            var codeElement = null;
            if (parentElement != null) {  //eslint-disable-line eqeqeq
                for (var x = 0; x < parentElement.length; x++) {
                    var codeObject = {};
                    codeElement = parentElement[ x ];
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
        LoadPersonelListJSON: function(parentElement) {
            var personnelArray = [];
            var codeElement;
            if (parentElement != null) {  //eslint-disable-line eqeqeq
                for (var x = 0; x < parentElement.length; x++) {
                    var prsnlObj = {};
                    codeElement = parentElement[ x ];
                    prsnlObj.id = codeElement.ID;
                    //If available retrieve the beg and end date and time for a prsnl name
                    if (codeElement.BEG_EFFECTIVE_DT_TM) {
                        prsnlObj.beg_dt_tm = codeElement.BEG_EFFECTIVE_DT_TM;
                        //create the string object for comparisons purposes
                        prsnlObj.beg_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "Z";
                    }
                    if (codeElement.END_EFFECTIVE_DT_TM) {
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
                    personnelArray[ x ] = mapObj;
                }
            }
            return (personnelArray);
        },
        LoadPhoneListJSON: function(parentElement) {
            var phoneArray = [];
            var codeElement = null;
            var phoneLen = 0;
            if (parentElement) {
                for (var x = parentElement.length; x--;) {
                    var phoneObj = {};
                    codeElement = parentElement[ x ];
                    phoneObj.personId = codeElement.PERSON_ID;
                    //fill in each phone for this person id
                    phoneLen = codeElement.PHONES.length;
                    phoneObj.phones = [];
                    for (var y = 0; y < phoneLen; y++) {
                        var phoneListing = {};
                        phoneListing.phoneNum = codeElement.PHONES[ y ].PHONE_NUM;
                        phoneListing.phoneType = codeElement.PHONES[ y ].PHONE_TYPE;
                        phoneObj.phones.push(phoneListing);
                    }
                    var mapObj = new MP_Core.MapObject(phoneObj.personId, phoneObj);
                    phoneArray[ x ] = mapObj;
                }
            }
            return (phoneArray);
        },
        WriteToFile: function(sText) {
            try {
                var ForAppending = 8;
                var TriStateFalse = 0;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var newFile = fso.OpenTextFile("c:\\temp\\test.txt", ForAppending, true, TriStateFalse); //eslint-disable-line new-cap
                newFile.write(sText);
                newFile.close();
            }
            catch (err) {
                var strErr = "Error:";
                strErr += "\nNumber:" + err.number;
                strErr += "\nDescription:" + err.description;
                document.write(strErr);
            }
        },

        /**
         *  Javascript string pad
         *  @see http://www.webtoolkit.info/
         **/
        pad: function(str, len, pad, dir) {
            if (typeof (len) === "undefined") {
                len = 0;
            }
            if (typeof (pad) === "undefined") {
                pad = " ";
            }
            if (typeof (dir) === "undefined") {
                dir = STR_PAD_RIGHT;
            }

            if (len + 1 >= str.length) {

                switch (dir) {

                    case STR_PAD_LEFT:
                        str = Array(len + 1 - str.length).join(pad) + str;
                        break;

                    case STR_PAD_BOTH:
                        var padlen = 0;
                        var right = Math.ceil(( padlen = len - str.length) / 2);
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
         * @param {number} eventCd The event code to retrieve results for
         * @param {number} compId The numberical id of the component to lookup
         * @param {number} groupId The groupId to pass into the graphing utility
         */
        GraphResults: function(eventCd, compID, groupID) {
            var component = MP_Util.GetCompObjById(compID); //eslint-disable-line new-cap
            var encntrOption = "";
            var i18nCore = i18n.discernabu;
            var lookBackText = "";
            var lookBackType = (component.getLookbackUnitTypeFlag()) ? component.getLookbackUnitTypeFlag() : "2";
            var lookBackUnits = (component.getLookbackUnits()) ? component.getLookbackUnits() : "365";
            var parameters = "";
            var replaceText = "";
            var scope = component.getScope();
            var criterion = component.getCriterion();

            if (scope > 0) {
                switch (lookBackType) {
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

                switch (scope) {
                    case 1:
                        lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
                        encntrOption = "0.0";
                        break;
                    case 2:
                        lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
                        encntrOption = criterion.encntr_id + ".0";
                        break;
                }
            }
            else {
                logger.logError("No scope defined for component " + component.getLabel());
                return;
            }


            //Mobile Reach - To Launch Graph viewer
            if (!CERN_Platform.inMillenniumContext()) {
                parameters = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "/discrete-graphing^," + groupID + ".0," + criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^,^^,^^,^^,1";
                MD_reachViewerDialog.LaunchReachGraphViewer(parameters); //eslint-disable-line new-cap
            }
            else {
                var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
                parameters = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "\\discrete-graphing^," + groupID + ".0," + criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^";
                var graphCall = "CCLLINK('mp_retrieve_graph_results', '" + parameters + "',1)";
                logger.logCCLNewSessionWindowInfo(null, graphCall, "mp_core.js", "GraphResults");
                CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1); //eslint-disable-line new-cap
            }

            Util.preventDefault();
        },
        ReleaseRequestReference: function(reqObj) {
            if (CERN_Platform.inMillenniumContext() && XMLCCLREQUESTOBJECTPOINTER) {
                for (var id in XMLCCLREQUESTOBJECTPOINTER) {
                    if (XMLCCLREQUESTOBJECTPOINTER[ id ] === reqObj) {
                        delete (XMLCCLREQUESTOBJECTPOINTER[ id ]);
                    }
                }
            }
        },
        /**
         * Message box similar to alert or confirm with customizable options.
         * @param msg {string} String message or html to display in message box
         * @param title {string}  Title of the message box
         * @param btnTrueText {string}  Text value of the true option button, will default to 'OK' if omitted.
         * @param btnFalseText {string}  Text value of the false option button.  No false button will be created if omitted.
         * @param falseBtnFocus {boolean}  Sets the default focus to the false button.
         * @param cb {object}  Callback function to fire on true button click.
         */
        AlertConfirm: function(msg, title, btnTrueText, btnFalseText, falseBtnFocus, cb) {
            var btnTrue = "<button id='acTrueButton' data-val='1'>" + ((btnTrueText) ? btnTrueText : i18n.discernabu.CONFIRM_OK) + "</button>";
            var btnFalse = "";
            if (btnFalseText) {
                btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
            }
            if (!title) {
                title = "&nbsp;";
            }

            var closeBox = function() {
                var btnVal = parseInt(this.getAttribute("data-val"), 10);
                $(".modal-div").remove();
                $(".modal-dialog").remove();
                $("html").css("overflow", "auto");
                //reset overflow
                if (btnVal && typeof cb === "function") {
                    cb();
                }
            };
            var modalDiv = Util.cep("div", {
                "className": "modal-div"
            });
            var dialog = Util.cep("div", {
                "className": "modal-dialog"
            });

            dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div>" + "<div class='modal-dialog-content'>" + msg + "</div>" + "<div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnTrue + btnFalse + "</div></div>";

            var docBody = document.body;
            Util.ac(modalDiv, docBody);
            Util.ac(dialog, docBody);

            Util.addEvent(_g("acTrueButton"), "click", closeBox);
            if (btnFalseText) {
                Util.addEvent(_g("acFalseButton"), "click", closeBox);
            }

            if (falseBtnFocus && btnFalseText) {
                _g("acFalseButton").focus();
            }
            else {
                _g("acTrueButton").focus();
            }

            $("html").css("overflow", "hidden");
            //disable page scrolling when modal is enabled
            $(modalDiv).height($(document).height());
        },

        CreateAutoSuggestBoxHtml: function(component, elementId) {
            var searchBoxHTML = [];
            var txtBoxId = "";
            var compNs = component.getStyles().getNameSpace();
            var compId = component.getComponentId();
            if (elementId) {
                txtBoxId = compNs + elementId + compId;
            }
            else {
                txtBoxId = compNs + "ContentCtrl" + compId;
            }

            searchBoxHTML.push("<div class='search-box-div'><form name='contentForm' onSubmit='return false'><input type='text' id='", txtBoxId, "'", " class='search-box'></form></div>");
            return searchBoxHTML.join("");
        },
        AddAutoSuggestControl: function(component, queryHandler, selectionHandler, selectDisplayHandler, itemId) {
            new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler, itemId); //eslint-disable-line no-new
        },
        RetrieveAutoSuggestSearchBox: function(component) {
            var componentNamespace = component.getStyles().getNameSpace();
            var componentId = component.getComponentId();
            return _g(componentNamespace + "ContentCtrl" + componentId);
        },
        CreateParamArray: function(ar, type) {
            var returnVal = (type === 1) ? "0.0" : "0";
            if (ar && ar.length > 0) {
                if (ar.length > 1) {
                    if (type === 1) {
                        returnVal = "value(" + ar.join(".0,") + ".0)";
                    }
                    else {
                        returnVal = "value(" + ar.join(",") + ")";
                    }
                }
                else {
                    returnVal = (type === 1) ? ar[ 0 ] + ".0" : ar[ 0 ];
                }
            }
            return returnVal;
        },
        /**
         * This method is used to overlay the content of a component with a transparent DIV and also show the loading icon (spinner) in the center of that container.
         * @param {String} resultContainerId The id of the element which should be covered by the spinner.
         * @param {number} skipOffsetFlag Pass a 1 to not use the offset and instead set the margin-top
         * @param {String} spinnerId Spinner div Id that is used to reference the spinner
         * @returns null
         */
        LoadSpinner: function(resultContainerID, skipOffsetFlag, spinnerId) {
            if (resultContainerID && typeof resultContainerID === "string") {
                var resultContainer = $("#" + resultContainerID);
                var contentHeight = resultContainer.height();
                var styleProp = "";

                if (skipOffsetFlag) {
                    styleProp = "height: " + contentHeight + "px; margin-top: -" + contentHeight + "px;";
                }
                else {
                    var offset = resultContainer.offsetParent();
                    var loadingIconTop = offset.height() - contentHeight;
                    styleProp = "height: " + contentHeight + "px; top: " + loadingIconTop + "px;";
                }

                if (spinnerId) {
                    resultContainer.append("<div id='" + spinnerId + "' class='loading-screen' style='" + styleProp + "'><div class='loading-spinner'>&nbsp;</div></div>");
                }
                else {
                    resultContainer.append("<div class='loading-screen' style='" + styleProp + "'><div class='loading-spinner'>&nbsp;</div></div>");
                }
            }
        },
        /**
         * Will get the date formatter associate to the locale loaded by the driver
         * @returns The date formatter to utilize for the loaded locale
         */
        GetDateFormatter: function() {
            if (!m_df) {
                m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
            }
            return m_df;
        },
        /**
         * Will get the numeric formatter associate to the locale loaded by the driver
         * @returns The numeric formatter to utilize for the loaded locale
         */
        GetNumericFormatter: function() {
            if (!m_nf) {
                m_nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
            }
            return m_nf;
        },
        /**
         * To display a ModalDialog with the output of the reportName script.
         * The driver script will be called to get the details of the report and if the response is success,
         * the response text will be displayed in the body of the dialog.
         * If there is any failure in the response, an error dialog will be displayed with error message and
         * on closing the dialog report modal dialog will be displayed with text "No data found" in the body.
         * On click of print button will open a print dialog to perform the printing.
         * @param reportName {String} name of the report to be executed.
         * @param person_id {String} personId Person id of the patient in string format with '.0' on the end.
         * @param encounter_id {int} encounterId Encounter id of the patient in string format with '.0' on the end.
         * @returns null
         */
        PrintReport: function(reportName, personId, encounterId) {
            var convertRTFtoHTML = 1;
            var reportContents = "";

            /**
             * This function will create and iFrame and populate it with the results of
             * the report.  Once that is done it executes the print functionality
             */
            function printReportOutput() {
                try {
                    var iframeObj = document.createElement("iframe");
                    iframeObj.setAttribute("display", "none");
                    document.body.appendChild(iframeObj);

                    var printWindow = iframeObj.contentWindow;
                    var docObject = printWindow ? printWindow.document : null;
                    if (docObject) {
                        docObject.write(reportContents);
                        docObject.close();
                        printWindow.focus();
                        printWindow.print();
                    }
                }
                catch (err) {
                    logger.logJSError(err, null, "mpage-core.js", "PrintReport");
                }
                finally {
                    $(iframeObj).remove();
                }
            }

            //Retrieve the print report modalDialog object
            var printDialog = MP_ModalDialog.retrieveModalDialogObject("printDialog");
            if (!printDialog) {
                printDialog = new ModalDialog("printDialog");
                printDialog.setHeaderTitle("&nbsp;");
                MP_ModalDialog.addModalDialogObject(printDialog);

                //Create the cancel button
                var cancelButton = new ModalButton("cancelButton");
                cancelButton.setText(i18n.discernabu.CONFIRM_CANCEL);
                cancelButton.setCloseOnClick(true);
                printDialog.addFooterButton(cancelButton);

                //Create the print button
                var printButton = new ModalButton("printButton");
                printButton.setText(i18n.PRINT);
                printButton.setCloseOnClick(false);
                printButton.setOnClickFunction(printReportOutput);
                printDialog.addFooterButton(printButton);
            }

            //Show the modal dialog before we make the synchronous request
            MP_ModalDialog.showModalDialog("printDialog");

            //Create a script request to get the results from the print report
            var reportRequest = new ScriptRequest();
            reportRequest.setName("Print Report Script Request");
            reportRequest.setProgramName("pwx_rpt_driver_to_mpage");
            reportRequest.setParameterArray([ "^MINE^", "^" + reportName + "^", personId, encounterId, convertRTFtoHTML ]);
            reportRequest.setRawDataIndicator(true);
            reportRequest.setResponseHandler(function(replyObj) {
                //Reset the cursor to default
                $("body").css("cursor", "default");
                //Get the reply from the script
                reportContents = replyObj.getResponse();
                //Update the contents of the modal dialog with the reply from the script request or the No Data Found i18n
                printDialog.setBodyHTML(reportContents || i18n.NO_DATA_FOUND);
            });
            reportRequest.performRequest();

            // Show the cursor as busy, this indicates the system is processing the request.
            // It will be reset to default when success/failed response is returned.
            $("body").css("cursor", "wait");
        },
        CalculatePrecision: function(valRes) {
            var precision = 0;
            var str = (MP_Util.IsString(valRes)) ? valRes : valRes.toString();  //eslint-disable-line new-cap
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
        CreateDateParameter: function(date) {
            var day = date.getDate();
            var month = "";
            var rest = date.format("yyyy HH:MM:ss");
            switch (date.getMonth()) {
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
                    alert("unknown month"); //eslint-disable-line no-alert
            }
            return (day + "-" + month + "-" + rest);
        },
        /**
         * @deprecated Use logger.logDebug(debug) instead.
         * This method will log a debug message.
         * @param {string} debugString - The debug string to be logged.
         */
        LogDebug: function(debugString) {
            logger.logDebug(debugString);
        },
        /**
         * @deprecated Use logger.logWarning(warning) instead.
         * This method will log a warning.
         * @param {string} warnString - The warning string to be logged.
         */
        LogWarn: function(warnString) {
            logger.logWarning(warnString);
        },
        /**
         * @deprecated Use logger.logMessage(message) instead.
         * This method will log a message.
         * @param {string} infoString - The message string to be logged.
         */
        LogInfo: function(infoString) {
            logger.logMessage(infoString);
        },
        /**
         * @deprecated Use logger.logError(error) instead.
         * This method will log an error.
         * @param {string} errorString - The error string to be logged.
         */
        LogError: function(errorString) {
            logger.logError(errorString);
        },
        /**
         * @deprecated Use logger.logScriptCallInfo(...) instead.
         * @param {MPageComponent} component - The component for which the info is being logged.
         * @param {ScriptRequest} request - The script request that was made.
         * @param {string} file - The JS file from which the script call was made.
         * @param {string} funcName - The function from which the script call was made.
         */
        LogScriptCallInfo: function(component, request, file, funcName) {
            logger.logScriptCallInfo(component, request, file, funcName);
        },
        /**
         * @deprecated Use logger.logScriptCallError(...) instead.
         * @param {MPageComponent} component - The component for which the error is being logged.
         * @param {ScriptRequest} request - The script request that was made.
         * @param {string} file - The JS file from which the script call was made.
         * @param {string} funcName - The function from which the call was made.
         */
        LogScriptCallError: function(component, request, file, funcName) {
            logger.logScriptCallError(component, request, file, funcName);
        },
        /**
         * @deprecated Use logger.logJSError(...) instead.
         * @param {Error} err - The error that occurred.
         * @param {MPageComponent} component - The component in which the error originated.
         * @param {string} file - The JS file from which the JavaScript error originated.
         * @param {string} funcName - The function from which the JavaScript error originated.
         */
        LogJSError: function(err, component, file, funcName) {
            logger.logJSError(err, component, file, funcName);
        },
        /**
         * @deprecated Use logger.logDiscernInfo(...) instead.
         * @param {MPageComponent} component - The component from which the information is being logged.
         * @param {string} objectName - The name of the object for which information is being logged.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogDiscernInfo: function(component, objectName, file, funcName) {
            logger.logDiscernInfo(component, objectName, file, funcName);
        },
        /**
         * @deprecated Use logger.logMPagesEventInfo(...) instead.
         * @param {MPageComponent} component - The component from which the information is being logged.
         * @param {string} eventName - The name of the event that occurred.
         * @param {string} params - The parameters associated to the MPages event.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogMpagesEventInfo: function(component, eventName, params, file, funcName) {
            logger.logMPagesEventInfo(component, eventName, params, file, funcName);
        },
        /**
         * @deprecated Use logger.logCCLNewSessionWindowInfo(...) instead.
         * @param {MPageComponent} component - The component from which the information is being logged.
         * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogCclNewSessionWindowInfo: function(component, params, file, funcName) {
            logger.logCCLNewSessionWindowInfo(component, params, file, funcName);
        },
        /**
         * @deprecated Use logger.logTimerInfo(...) instead.
         * @param {string} timerName - The name of the timer.
         * @param {string} subTimerName - The sub timer name.
         * @param {string} timerType - The type of timer.
         * @param {string} file - The JS file from which the information is being logged.
         * @param {string} funcName - The function from which the information is being logged.
         */
        LogTimerInfo: function(timerName, subTimerName, timerType, file, funcName) {
            logger.logTimerInfo(timerName, subTimerName, timerType, file, funcName);
        },
        AddCookieProperty: function(compId, propName, propValue) {
            var cookie = CK_DATA[ compId ];
            if (!cookie) {
                cookie = {};
            }
            cookie[ propName ] = propValue;
            CK_DATA[ compId ] = cookie;
        },
        GetCookieProperty: function(compId, propName) {
            var cookie = CK_DATA[ compId ];
            if (cookie && cookie[ propName ]) {
                return cookie[ propName ];
            }
            else {
                return null;
            }
        },
        WriteCookie: function() {
            var cookieJarJSON = JSON.stringify(CK_DATA);
            document.cookie = "CookieJar=" + cookieJarJSON + ";";
        },
        RetrieveCookie: function() {
            var cookies = document.cookie;
            var match = cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
            if (match && match[ 1 ]) {
                CK_DATA = JSON.parse(match[ 1 ]);
            }
        },
        /**
         * This function is used to generate the HTML content for a modal dialog that is intended to display an informational message to the user.
         * If the modal dialog with the id of modalId does not already exist it will be created, but will not be added to the modal dialog collection
         * in MP_ModalDialog.
         * @param {string} modalId The id of an existing modal dialog or the id that will be given to the modal dialog that will be created.
         * @param {string} messageType The type of message that will be created.  Different styling will be applied to different message types.  A default
         * value of "" is a valid value for this parameter.
         * @param {string} line1 This first line of the informational message.  This line could potentially be stylized based on the messageType.
         * @param {string} line2 This is the second line of the information message.  It will not be styled based on the messageType
         * @returns {ModalDialog}  The updated or newly create object that inherits from ModalDialog.
         */
        generateModalDialogBody: function(modalId, messageType, line1, line2) {
            var modal = null;

            //Check to see if this modal dialog already exists.  If not go ahead and create it.
            modal = MP_ModalDialog.retrieveModalDialogObject(modalId);

            //Create a modal dialog here
            if (!modal) {
                switch (messageType.toLowerCase()) {
                    case "error":
                        modal = new ErrorModal(modalId);
                        break;
                    case "warning":
                        modal = new WarningModal(modalId);
                        break;
                    case "information":
                        modal = new InfoModal(modalId);
                        break;
                    case "busy":
                        modal = new BusyModal(modalId);
                        break;
                    default:
                        modal = new MessageModal(modalId);
                        break;
                }
            }

            //Apply the proper margins for User informational messages
            //Generate the proper HTML string based on the type passed into the function
            //Apply the new message to the modal
            //
            modal.setMessage(line1, line2);

            return modal;
        },
        /**
         * Creates a mapping between a string identifier and an object definition.  The object definition is only mapped
         * when the objectDefinition parameter is an actual object and an existing object does not exist for that
         * identifier.
         * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
         * insensitive.
         * @param {function} objectDefinition : A reference to the definition of the object being mapped
         * @returns {boolean} True if the object mapping was added successfully, false otherwise.
         */
        setObjectDefinitionMapping: function(mappingId, objectDefinition) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return false;
            }
            mappingId = mappingId.toUpperCase();

            //Check to see if there is an existing mapping for that ID
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] !== "undefined") {
                logger.logMessage("Object mapping already exists for " + mappingId + "\nPlease select a different id or use the MP_Util.updateObjectDefinitionMApping function");
                return false;
            }
            //Make sure we are mapping an object definition which would be a function
            if (typeof objectDefinition === "function") {
                CERN_ObjectDefinitionMapping[ mappingId ] = objectDefinition;
                return true;
            }
            return false;
        },
        /**
         * Retrieves the object mapped to a specific mappingId if it is defined in the CERN_ObjectDefinitionMapping object
         * @param {string} mappingId : The id mapped to a specific object in the CERN_ObjectDefintionMapping object.   This id is case
         * insensitive.
         * @returns {function} The object definition mapped to the mappingId passed into the function.
         */
        getObjectDefinitionMapping: function(mappingId) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return null;
            }
            mappingId = mappingId.toUpperCase();
            //Attempt to retrieve the object definition
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] === "undefined") {
                return null;
            }
            return CERN_ObjectDefinitionMapping[ mappingId ];
        },
        /**
         * Updates the object definition mapped to the identifier passed into the function.  If no object is mapped to the
         * identifier then no updates are made to the CERN_ObjectDefinitionMapping object.
         * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
         * insensitive.
         * @param {function} objectDefinition : A reference to the definition of the object being mapped
         * @returns {boolean} True if the object mapping was updated successfully, false otherwise.
         */
        updateObjectDefinitionMapping: function(mappingId, objectDefinition) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return null;
            }
            mappingId = mappingId.toUpperCase();
            //Make sure an object definition already exists for this mappingId
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] === "undefined") {
                logger.logMessage("Object mapping does not exists for " + mappingId);
                return false;
            }
            //Make sure we are mapping an object definition which would be a function
            if (typeof objectDefinition === "function") {
                CERN_ObjectDefinitionMapping[ mappingId ] = objectDefinition;
                return true;
            }
            return false;
        },
        /**
         * Removes the object definition mapped to the identifier passed into the function.
         * @param {string} mappingId : An id associated to the specific object definition that will be removed.  This id is case
         * insensitive.
         * @returns {boolean} True if the object mapping was removed successfully, false otherwise.
         */
        removeObjectDefinitionMapping: function(mappingId) {
            //Make sure the mappingID is a string
            if (typeof mappingId !== "string") {
                return null;
            }
            mappingId = mappingId.toUpperCase();
            //Make sure the object definition exists before we attempt to delete it
            if (typeof CERN_ObjectDefinitionMapping[ mappingId ] === "undefined") {
                logger.logMessage("Object mapping does not exists for " + mappingId);
                return false;
            }
            return delete CERN_ObjectDefinitionMapping[ mappingId ];
        },
        /*
         * This function stringifies the passed in object, surrounds fields which end in _dt_tm with "\/Date()\/"
         * and adds .0 to all fields which end in _id or _cd. Also, if any fields are passed in .0 will be added for those fields as well
         *
         * @param {object} object which needs to be stringified
         *
         * @param {number} skip fields ending in _id/_cd flag - If set to 1, .0 will not be added to the fields ending in _id and _cd
         *
         * @param {number} skip date flag - If set to 1, value of fields ending in _dt_tm will not be surrounded with "\/Date()\/"
         *
         * @param {string} field names for which .0 should be added(apart from fields which end in _id/_cd). Any number of fields can be passed in
         *
         * @param {boolean} pass true if the dates are in UTC format
         *
         * @return {string} JSON string which can be passed to back-end
         *
         * Usage - call enhancedStringify(obj, 1, 1, "application_ctx")
         *
         *    Above function call will stringify the passed in object - obj, add .0 for all fields ending in _id or cd
         *    and surround dt_tm fields with Date() and also add .0 for application_ctx field
         */
        enhancedStringify: function(obj, skipIDAndCDFields, skipDates, isUTC, additionalFields) {

            var replacedJSONStr, findString, regExpObject;

            var dateAndIdReplacer = function(key, value) {

                if (typeof key === "string") {

                    var upperCaseKey = key.toUpperCase();
                    var replacedDateValue;

                    // Do not surround date fields with Date() if skipDates flag is set to 1
                    if (skipDates !== 1 && typeof value === "string" && value !== "" && upperCaseKey.indexOf("_DT_TM") > -1) {
                        if (isUTC) {
                            replacedDateValue = "XXX_REPLACE_DT_START_XXX" + value.replace("Z", "+00:00XXX_REPLACE_DT_END_XXX");
                        } else {
                            replacedDateValue = "XXX_REPLACE_DT_START_XXX" + value + "XXX_REPLACE_DT_END_XXX";
                        }
                        return replacedDateValue;
                    }
                    if ((skipIDAndCDFields !== 1) && (typeof value === "number") && (upperCaseKey.indexOf("_ID") > -1 || upperCaseKey.indexOf("_CD") > -1)) {
                        return value + 0.99;
                    }
                }

                return value;
            };

            replacedJSONStr = JSON.stringify(obj, dateAndIdReplacer).replace(/\.99/g, ".0").replace(/XXX_REPLACE_DT_START_XXX/g, "\\/Date(").replace(/XXX_REPLACE_DT_END_XXX/g, ")\\/");

            // If there are any other fields passed in, iterate over them and add .0 to those values
            if (additionalFields && additionalFields.length) {
                for (var i = additionalFields.length; i--;) {
                    // Create a regular expression which captures the field along with it's value
                    findString = "(\"" + additionalFields[ i ] + "\"" + ":" + "\\d" + "+)";
                    regExpObject = new RegExp(findString, "gi");

                    replacedJSONStr = replacedJSONStr.replace(regExpObject, "$&.0");
                }
            }

            return replacedJSONStr;
        }
    };
    /**
     * Calculates difference between two dates given and returns string with appropriate units
     * If no endDate is given it is assumed the endDate is the current date/time
     *
     * @param beginDate  Begin <code>Date</code> for Calculation
     * @param endDate  End <code>Date</code> for Calculation
     * @param mathFlag  <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 =
     * Floor, 0 = Ceil
     * @param abbreviateFlag  <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used
     * such as in the case of a within string
     */
    function GetDateDiffString(beginDate, endDate, mathFlag, abbreviateFlag) {
        var i18nCore = i18n.discernabu;
        var timeDiff = 0;
        var returnVal = "";
        //Set endDate to current time if it's not passed in
        endDate = (!endDate) ? new Date() : endDate;
        mathFlag = (!mathFlag) ? 0 : mathFlag;
        var one_minute = 1000 * 60;
        var one_hour = one_minute * 60;
        var one_day = one_hour * 24;
        var one_week = one_day * 7;

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
        if (mathFlag == 0) {  //eslint-disable-line eqeqeq
            mathFunc = function(val) {
                return Math.ceil(val);
            };
            comparisonFunc = function(lowerVal, upperVal) {
                return (lowerVal <= upperVal);
            };
        }
        else {
            mathFunc = function(val) {
                return Math.floor(val);
            };
            comparisonFunc = function(lowerVal, upperVal) {
                return (lowerVal < upperVal);
            };
        }

        var calcMonths = function() {
            var removeCurYr = 0;
            var removeCurMon = 0;
            var yearDiff = 0;
            var monthDiff = 0;
            var dayDiff = endDate.getDate();
            if (endDate.getMonth() > beginDate.getMonth()) {
                monthDiff = endDate.getMonth() - beginDate.getMonth();
                if (endDate.getDate() < beginDate.getDate()) {
                    removeCurMon = 1;
                }
            }
            else if (endDate.getMonth() < beginDate.getMonth()) {
                monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
                removeCurYr = 1;
                if (endDate.getDate() < beginDate.getDate()) {
                    removeCurMon = 1;
                }
            }
            else if (endDate.getDate() < beginDate.getDate()) {
                removeCurYr = 1;
                monthDiff = 11;
            }

            if (endDate.getDate() >= beginDate.getDate()) {
                dayDiff = endDate.getDate() - beginDate.getDate();
            }

            yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
            //days are divided by 32 to ensure the number will always be less than zero
            monthDiff += (yearDiff * 12) + (dayDiff / 32) - removeCurMon;

            return monthDiff;
        };

        valMinutes = mathFunc(timeDiff / one_minute);
        valHours = mathFunc(timeDiff / one_hour);
        valDays = mathFunc(timeDiff / one_day);
        valWeeks = mathFunc(timeDiff / one_week);
        valMonths = calcMonths();
        valMonths = mathFunc(valMonths);
        valYears = mathFunc(valMonths / 12);

        if (comparisonFunc(valHours, 2))//Less than 2 hours, display number of minutes. Use abbreviation of "mins".
            returnVal = abbreviateFlag ? (i18nCore.WITHIN_MINS.replace("{0}", valMinutes)) : (i18nCore.X_MINUTES.replace("{0}", valMinutes));
        else if (comparisonFunc(valDays, 2))//Less than 2 days, display number of hours. Use abbreviation of "hrs".
            returnVal = abbreviateFlag ? (i18nCore.WITHIN_HOURS.replace("{0}", valHours)) : (i18nCore.X_HOURS.replace("{0}", valHours));
        else if (comparisonFunc(valWeeks, 2))//Less than 2 weeks, display number of days. Use "days".
            returnVal = abbreviateFlag ? (i18nCore.WITHIN_DAYS.replace("{0}", valDays)) : (i18nCore.X_DAYS.replace("{0}", valDays));
        else if (comparisonFunc(valMonths, 2))//Less than 2 months, display number of weeks. Use abbreviation of "wks".
            returnVal = abbreviateFlag ? (i18nCore.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18nCore.X_WEEKS.replace("{0}", valWeeks));
        else if (comparisonFunc(valYears, 2))//Less than 2 years, display number of months. Use abbreviation of "mos".
            returnVal = abbreviateFlag ? (i18nCore.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18nCore.X_MONTHS.replace("{0}", valMonths));
        else//Over 2 years, display number of years.  Use abbreviation of "yrs".
            returnVal = abbreviateFlag ? (i18nCore.WITHIN_YEARS.replace("{0}", valYears)) : (i18nCore.X_YEARS.replace("{0}", valYears));

        return (returnVal);
    }

}();

/**
 * @namespace
 */
MP_Util.Doc = function() {
    var openAccordion = "";
    var compMenuTimeout = null;
    var compMenuDelay = 250;

    return {
        SetupExpandCollapse: function(categoryMeaning) {
            var i18nCore = i18n.discernabu;
            //set up expand collapse for all components
            var body = null;
            var toggleArray = null;
            if (categoryMeaning) {
                body = _g(categoryMeaning);
                toggleArray = Util.Style.g("sec-hd-tgl", body, "span");
            }
            else {
                toggleArray = Util.Style.g("sec-hd-tgl");
            }
            for (var k = 0; k < toggleArray.length; k++) {
                Util.addEvent(toggleArray[ k ], "click", MP_Util.Doc.ExpandCollapse);
                var checkClosed = Util.gp(Util.gp(toggleArray[ k ]));
                if (Util.Style.ccss(checkClosed, "closed")) {
                    toggleArray[ k ].innerHTML = "+";
                    toggleArray[ k ].title = i18nCore.SHOW_SECTION;
                }
            }
        },
        SetupCompFilters: function(compArray) {
            var comp = null;
            var compArrayLen = compArray.length;
            var hasFilters = false;
            for (var x = 0; x < compArrayLen; x++) {
                comp = compArray[ x ];
                hasFilters = false;
                for (var y = 0; y < 10; y++) {
                    if (comp.getGrouperLabel(y) || comp.getGrouperCatLabel(y)) {
                        hasFilters = true;
                        break;
                    }
                }
                comp.setCompFilters(hasFilters);
                if (comp.hasCompFilters() && comp.isDisplayable()) {
                    comp.renderAccordion(comp);
                }
            }
        },
        /**
         * Create Component Menus
         * @param {mpComps} mpage components for current view
         * @param {bool} disablePrsnl boolean to disable personalize section
         * @param
         */
        CreateCompMenus: function(mpComps, disablePrsnl) {
            var setupCustCompMenu = function(curComp, compId, fullId, ns) {
                curComp.createMainMenu();
                var compMenu = curComp.getMenu();
                if (compMenu) {
                    var themeSelectorId = "themeSelector" + compId;
                    var themeSelector = new ThemeSelector(themeSelectorId, compId, fullId, ns);
                    compMenu.addMenuItem(themeSelector);
                    var defaultExpandedSelection = new MenuSelection("defaultExpandedSelection" + compId);
                    defaultExpandedSelection.setLabel(i18n.discernabu.DEFAULT_EXPANDED);
                    defaultExpandedSelection.setIsSelected(curComp.isExpanded() === 1);
                    defaultExpandedSelection.setCloseOnClick(false);
                    defaultExpandedSelection.setClickFunction(function() {
                        var isFinalStateExpanded = !curComp.isExpanded();
                        curComp.setExpandCollapseState(isFinalStateExpanded);
                        curComp.setExpanded(isFinalStateExpanded ? 1 : 0);
                        MP_Core.AppUserPreferenceManager.UpdateSingleCompPreferences(curComp, true); //eslint-disable-line new-cap
                    });
                    compMenu.addMenuItem(defaultExpandedSelection);
                    MP_MenuManager.updateMenuObject(compMenu);
                    var secId = fullId.replace("mainCompMenu", "");
                    Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
                        MP_MenuManager.showMenu(this.id);
                    });
                }
            };

            var setupCompMenu = function(componentId, fullId, isExp, infoInd, infoState) {
                if (_g(fullId)) {
                    var optMenu = _g("moreOptMenu" + componentId);
                    if (!optMenu) {
                        optMenu = Util.cep("div", {
                            className: "opts-menu-content menu-hide",
                            id: "moreOptMenu" + componentId
                        });
                        var i18nCore = i18n.discernabu;
                        var defExpClass = "";
                        var infoBtnMsg = i18nCore.INFO_BUTTON;
                        var infoClass = "";

                        if (isExp) {
                            defExpClass = "opts-menu-def-exp";
                        }

                        if (infoState) {
                            infoClass = "opts-menu-info-en";
                        }

                        var optMenuHtml = "<div class=\"opts-actions-sec\" id=\"optsMenuActions" + componentId + "\"></div>";

                        if (!disablePrsnl) {
                            if (infoInd) {
                                optMenuHtml += "<div class=\"opts-personalize-sec\" id=\"optsMenupersonalize" + componentId + "\"><div class=\"opts-menu-item opts-def-theme\" id=\"optsDefTheme" + componentId + "\">" + i18nCore.COLOR_THEME + "</div><div class=\"opts-menu-item opts-def-state\" id=\"optsDefState" + componentId + "\">" + i18nCore.DEFAULT_EXPANDED + "<span class=\"" + defExpClass + "\">&nbsp;</span></div><div class=\"opts-menu-item opts-personalize-sec-divider\" id=\"optsInfoState" + componentId + "\">" + infoBtnMsg + "<span class=\"" + infoClass + "\">&nbsp;</span></div></div>";
                            }
                            else {
                                optMenuHtml += "<div class=\"opts-personalize-sec\" id=\"optsMenupersonalize" + componentId + "\"><div class=\"opts-menu-item opts-def-theme\" id=\"optsDefTheme" + componentId + "\">" + i18nCore.COLOR_THEME + "</div><div class=\"opts-menu-item opts-def-state\" id=\"optsDefState" + componentId + "\">" + i18nCore.DEFAULT_EXPANDED + "<span class=\"" + defExpClass + "\">&nbsp;</span></div></div>";
                            }
                        }

                        optMenu.innerHTML = optMenuHtml;

                        Util.ac(optMenu, document.body);
                    }
                    InitCompOptMenu(optMenu, componentId, false); //eslint-disable-line new-cap

                    var themeTimeout = null;
                    var themeOut = function(e) {
                        if (!e) {
                            e = window.event;
                        }
                        var relTarg = e.relatedTarget || e.toElement;
                        if (relTarg) {
                            themeTimeout = window.setTimeout(function() {
                                if (_g("optMenuConfig" + componentId)) {
                                    Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                                }
                            }, compMenuDelay);
                        }
                        else {
                            if (_g("optMenuConfig" + componentId)) {
                                Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                            }
                            return;
                        }
                    };
                    var secId = fullId.replace("mainCompMenu", "");
                    Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
                        OpenCompOptMenu(optMenu, secId); //eslint-disable-line new-cap
                    });

                    if (!disablePrsnl) {
                        var optDefThemeMenuItem = _g("optsDefTheme" + componentId);

                        // when entering the "Color Theme" menu  item...
                        // we launch the color theme menu + clear the "close menu" timer
                        Util.addEvent(optDefThemeMenuItem, "mouseenter", function() {
                            window.clearTimeout(themeTimeout);
                            var configMenu = _g("optMenuConfig" + componentId);
                            if (!configMenu) {
                                launchThemeMenu(componentId, fullId, secId, this);
                            }
                            else {
                                if (Util.Style.ccss(configMenu, "menu-hide")) {
                                    OpenCompOptMenu(configMenu, fullId, this); //eslint-disable-line new-cap
                                }
                            }
                        });
                        // When entering the component menu container...
                        // if we aren't moving into the "Color Theme" menu item, trigger the "close menu" timer
                        Util.addEvent(optMenu, "mouseenter", function(e) {
                            if (!e) {
                                e = window.event;
                            }
                            var target = e.target || e.srcElement;
                            if (!Util.Style.ccss(target, "opts-def-theme")) {
                                themeOut(e);
                            }
                        });
                        // When leaving the "Color Theme" menu item...
                        // if we aren't moving into the component menu container or moving into the color themes menu, trigger the "close menu" timer
                        Util.addEvent(optDefThemeMenuItem, "mouseleave", function(e) {
                            if (!e) {
                                e = window.event;
                            }
                            window.clearTimeout(themeTimeout);
                            var relTarg = e.relatedTarget || e.toElement;
                            if (relTarg && !Util.Style.ccss(relTarg, "opts-menu-content") && !Util.Style.ccss(relTarg, "opts-menu-config-content")) {
                                themeOut(e);
                            }
                        });
                        Util.addEvent(_g("optsDefState" + componentId), "click", function() {
                            launchSetState(componentId, this);
                        });

                        if (infoInd) {
                            Util.addEvent(_g("optsInfoState" + componentId), "click", function() {
                                launchInfoSetState(componentId, this);
                            });
                        }
                    }
                }
            };
            var mns = mpComps;
            var mLen = mns.length;
            for (var i = 0; i < mLen; i++) {
                var curComp = mns[ i ];
                var ns = curComp.m_styles.m_nameSpace;
                var compId = curComp.m_styles.m_componentId;
                var fullId = "mainCompMenu" + ns + compId;
                var isExp = curComp.isExpanded();
                var infoInd = curComp.hasInfoButton();
                var infoState = curComp.isInfoButtonEnabled();
                if (ns !== "cust") {
                    setupCompMenu(compId, fullId, isExp, infoInd, infoState);
                } else {
                    setupCustCompMenu(curComp, compId, fullId, ns);
                }
            }
        },
        /**
         * Hide all Component Menus
         */
        HideAllCompMenus: function() {
            var mnus = Util.Style.g("opts-menu-content", null, "div");
            var mnLen = mnus.length;
            for (var m = mnLen; m--;) {
                if (!Util.Style.ccss(mnus[ m ], "menu-hide")) {
                    Util.Style.acss(mnus[ m ], "menu-hide");
                }
            }
        },
        GetComments: function(par, personnelArray) {
            var com = "",
                recDate = "";
            var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
            for (var j = 0, m = par.COMMENTS.length; j < m; j++) {
                if (personnelArray.length != null) {  //eslint-disable-line eqeqeq
                    if (par.COMMENTS[ j ].RECORDED_DT_TM != "") {  //eslint-disable-line eqeqeq
                        recDate = df.formatISO8601(par.COMMENTS[ j ].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                    }
                    if (j > 0) {
                        com += "<br />";
                    }
                    if (par.COMMENTS[ j ].RECORDED_BY > 0) {
                        com += recDate + " - " + MP_Util.GetValueFromArray(par.COMMENTS[ j ].RECORDED_BY, personnelArray).fullName + "<br />" + par.COMMENTS[ j ].COMMENT_TEXT; //eslint-disable-line new-cap
                    }
                    else {
                        com += recDate + "<br />" + par.COMMENTS[ j ].COMMENT_TEXT;
                    }
                }
            }
            return com;
        },
        FinalizeComponent: function(contentHTML, component, countText) {
            var styles = component.getStyles();

            //replace count text
            var rootComponentNode = component.getRootComponentNode();
            //There are certain circumstances where a components DOM element will have been removed.
            //ie. selecting a view from the viewpoint drop down and then selecting another.
            if (rootComponentNode) {
                var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
                if (countText) {
                    //sets the result count of the specific component to get it in component load details timer
                    component.setResultCount(countText);
                    //Make sure the count text is not hidden.
                    $(totalCount).removeClass("hidden");
                    totalCount[ 0 ].innerHTML = countText;
                }
                else {
                    //If there is no count text to show then hide the element so it doesn't take up space.
                    $(totalCount).addClass("hidden");
                }

                //replace content with HTML
                var node = component.getSectionContentNode();
                node.innerHTML = contentHTML;

                //init hovers
                MP_Util.Doc.InitHovers(styles.getInfo(), node, component); //eslint-disable-line new-cap

                //init subsection toggles
                MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl"); //eslint-disable-line new-cap

                //init scrolling
                //Wrap in timeout to momentarly break the JS processing up and allow the browswer to render.
                setTimeout(function() {
                    MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6"); //eslint-disable-line new-cap
                }, 0);

                //Check to see if the component has an error message displayed
                var errorElement = $(rootComponentNode).find(".error-message");
                if (errorElement.length) {
                    //Add an error icon to the component title
                    $(rootComponentNode).find(".sec-title>span:first-child").addClass("error-icon-component");
                    //Ensure the bottom border on the error message is red and the padding is consistent
                    $(errorElement).css("border", "1px solid #C00").css("padding", "2px 4px");
                    //Fire and event to inform any listener that the component has errored
                    CERN_EventListener.fireEvent(component, component, EventListener.EVENT_ERROR_UPDATE, {
                        "error": true
                    });
                }
                else {
                    //Remove the error icon in the component title
                    $(rootComponentNode).find(".sec-title>span:first-child").removeClass("error-icon-component");
                    //Fire and event to inform any listener that the component has not errored
                    CERN_EventListener.fireEvent(component, component, EventListener.EVENT_ERROR_UPDATE, {
                        "error": false
                    });
                }

                //Add the Gap Check Indicators to the component based on the bedrock settings
                if (component.getGapCheckRequiredInd()) {
                    var disclaimerContainer = null;
                    var disclaimerBannerObj = null;
                    disclaimerContainer = $(rootComponentNode).find(".disclaimer-text");
                    if (!disclaimerContainer.length) {
                        disclaimerBannerObj = component.createComponentDisclaimerContainer();
                        var disclaimerMessageHTML = disclaimerBannerObj.render();
                        //Add a class to Alert Banner to differentiate it from other banners added to the component
                        disclaimerContainer = $(disclaimerMessageHTML).addClass("disclaimer-text");
                        var contentNodeHeader = $(rootComponentNode).find("H2")[ 0 ];
                        $(contentNodeHeader).after(disclaimerContainer);
                        //attach event to the close button
                        disclaimerBannerObj.attachEvents();
                    }
                    component.updateComponentRequiredIndicator();
                }
            }

            //notify the aggregate timer that the component has finished loading
            component.notifyAggregateTimer();
        },
        /**
         * Formats the content to the appropriate height and enables scrolling
         * @param {node} content : The content to be formatted
         * @param {int} num : The approximate number of items to display face up
         * @param {float} ht : The total line height of an item
         */
        InitScrolling: function(content, num, ht) {
            for (var k = 0; k < content.length; k++) {
                MP_Util.Doc.InitSectionScrolling(content[ k ], num, ht); //eslint-disable-line new-cap
            }
        },
        /**
         * Formats the section to the appropriate height and enables scrolling
         * @param {node} sec : The section to be formatted
         * @param {int} num : The approximate number of items to display face up
         * @param {float} ht : The total line height of an item
         */
        InitSectionScrolling: function(sec, num, ht) {
            var th = num * ht;
            var totalHeight = th + "em";

            sec.style.maxHeight = totalHeight;
            sec.style.overflowY = "auto";
            sec.style.overflowX = "hidden";
        },
        InitHovers: function(trg, par, component) {
            var gen = Util.Style.g(trg, par, "DL");

            for (var i = 0, l = gen.length; i < l; i++) {
                var m = gen[ i ];
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
        InitSubToggles: function(par, tog) {
            var i18nCore = i18n.discernabu;
            var toggleArray = Util.Style.g(tog, par, "span");
            for (var k = 0; k < toggleArray.length; k++) {
                Util.addEvent(toggleArray[ k ], "click", MP_Util.Doc.ExpandCollapse);
                var checkClosed = Util.gp(Util.gp(toggleArray[ k ]));
                if (Util.Style.ccss(checkClosed, "closed")) {
                    toggleArray[ k ].innerHTML = "+";
                    toggleArray[ k ].title = i18nCore.SHOW_SECTION;
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
        AddPageTitle: function(title, bodyTag, debugInd, custInd, anchorArray, helpFile, helpURL, criterion, categoryMeaning) {
            var i18nCore = i18n.discernabu;
            var ar = [];
            if (categoryMeaning) {
                title = "";
                bodyTag = _g(categoryMeaning);
                bodyTag.innerHTML = "";
            }
            else {
                if (bodyTag) {
                    bodyTag = document.body;
                }
            }
            ar.push("<div class='pg-hd'>");
            ar.push("<h1><span class='pg-title'>", title, "</span></h1><span id='pageCtrl", criterion.category_mean, "' class='page-ctrl'>");

            //'as of' date is always to the far left of items
            if (categoryMeaning) {
                var df = MP_Util.GetDateFormatter(); //eslint-disable-line new-cap
                ar.push("<span class='other-anchors'>", i18nCore.AS_OF_TIME.replace("{0}", df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)), "</span>");
            }
            if (anchorArray) {
                for (var x = 0, xl = anchorArray.length; x < xl; x++) {
                    ar.push("<span class='other-anchors'>" + anchorArray[ x ] + "</span>");
                }
            }

            if (custInd || categoryMeaning) {//customizable single view or in a view point
                var pageMenuId = "pageMenu" + criterion.category_mean;
                ar.push("<span id='", pageMenuId, "' class='page-menu'>&nbsp;</span>");
            }
            ar.push("</span></div>");
            bodyTag.innerHTML += ar.join("");
            return;
        },
        /**
         * Launches the help file in a new modal window
         * @param {String} HelpURL The String name of the help file  to associate to the page.
         */
        LaunchHelpWindow: function(helpURL) {
            var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
            logger.logCCLNewSessionWindowInfo(null, helpURL, "mp_core.js", "LaunchHelpWindow");
            CCLNEWSESSIONWINDOW(helpURL, "_self", wParams, 0, 1); //eslint-disable-line new-cap
            Util.preventDefault();
        },
        /**
         * @deprecated - This function is no longer valid and should not be used
         */
        AddCustomizeLink: function(criterion) {
            var custNode = _g("custView" + criterion.category_mean);
            if (custNode) {
                //The code below has been removed since the customize option is no longer in use.  Work still needs to be done
                //To remove this function from all locations where AddCustomLink is called.
                logger.logWarn("AddCustomizeLink is a deprecated function and should not be utilized");
            }
        },
        ExpandCollapse: function() {
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
        HideHovers: function() {
            var hovers = Util.Style.g("hover", document.body, "DIV");
            for (var i = hovers.length; i--;) {
                if (Util.gp(hovers[ i ]).nodeName == "BODY") {  //eslint-disable-line eqeqeq
                    hovers[ i ].style.display = "none";
                    Util.de(hovers[ i ]);
                }
            }
        },
        ReplaceSubTitleText: function(component, text) {
            var lookbackDisplay = $("#lookbackDisplay" + component.getStyles().getId());
            if (lookbackDisplay.length) {
                lookbackDisplay.html(text);
            }
        },
        ReInitSubTitleText: function(component) {
            if (component.getScope() > 0) {
                var lookbackDisplay = $("#lookbackDisplay" + component.getStyles().getId());
                if (lookbackDisplay.length) {
                    lookbackDisplay.html(CreateSubTitleText(component)); //eslint-disable-line new-cap
                }
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

        RunAccordion: function(index) {
            var nID = "Accordion" + index + "Content";
            var TimeToSlide = 100.0;
            var titleDiv = _g("Accordion" + index + "Title");
            var containerDiv = _g("AccordionContainer" + index);

            //Adjust the pull tab image
            if (Util.Style.ccss(titleDiv, "Expanded")) {
                Util.Style.rcss(titleDiv, "Expanded");
                Util.Style.rcss(containerDiv, "Expanded");
            }
            else {
                Util.Style.acss(titleDiv, "Expanded");
                Util.Style.acss(containerDiv, "Expanded");
            }

            if (openAccordion == nID) { //eslint-disable-line eqeqeq
                nID = "";
            }

            setTimeout("MP_Util.Doc.Animate(" + new Date().getTime() + "," + TimeToSlide + ",'" + openAccordion + "','" + nID + "'," + index + ")", 33);
            openAccordion = nID;
        },
        Animate: function(lastTick, timeLeft, closingId, openingId, compID) {
            var TimeToSlide = timeLeft;
            var curTick = new Date().getTime();
            var elapsedTicks = curTick - lastTick;
            var ContentHeight = 275.0;

            var opening = (openingId == "") ? null : _g(openingId);  //eslint-disable-line eqeqeq
            var closing = (closingId == "") ? null : _g(closingId);  //eslint-disable-line eqeqeq

            if (timeLeft <= elapsedTicks) {
                if (opening) {
                    opening.style.display = "block";
                    opening.style.height = ContentHeight + "px";
                }

                if (closing) {
                    closing.style.display = "none";
                    closing.style.height = "0px";
                }
                return;
            }

            timeLeft -= elapsedTicks;
            var newClosedHeight = Math.round((timeLeft / TimeToSlide) * ContentHeight);

            if (opening) {
                if (opening.style.display != "block") {  //eslint-disable-line eqeqeq
                    opening.style.display = "block";
                    opening.style.height = (ContentHeight - newClosedHeight) + "px";
                }
            }
            if (closing) {
                closing.style.height = newClosedHeight + "px";
            }

            setTimeout("MP_Util.Doc.Animate(" + curTick + "," + timeLeft + ",'" + closingId + "','" + openingId + "'," + compID + ")", 33);
        },
        GetSelected: function(opt) {
            var selected = [];
            var index = 0;
            var optLen = opt.length;
            for (var intLoop = 0; intLoop < optLen; intLoop++) {
                if (opt[ intLoop ].selected) {
                    index = selected.length;
                    selected[ index ] = {};
                    selected[ index ].value = opt[ intLoop ].value;
                    selected[ index ].index = intLoop;
                }
            }
            return selected;
        },
        /* Reset Layout functionality*/
        ResetLayoutSettings: function(mPageObj) {
            var componentSettings = mPageObj.getViewSettings().BR_SET.CS; //BR_SET is shorthand for Bedrock Settings and CS is shorthand for Component Settings
            var components = mPageObj.getComponents();
            var tempComp = null;
            var tempCompSettings = {};
            var x = 0;
            //Create a map so we dont have to search the componentSettings more than once
            var componentMap = {};
            for (x = componentSettings.length; x--;) {
                componentMap[ componentSettings[ x ].R_MN ] = componentSettings[ x ]; //R_MN is shorthand for Report Mean
            }

            //Grab the settings from the componentMap and reset the sequence and row to what is originally defined in bedrock
            for (x = components.length; x--;) {
                tempComp = components[ x ];
                tempCompSettings = componentMap[ tempComp.getReportMean() ];
                components[ x ].setSequence(tempCompSettings.R_SQ); //R_SQ is shorthand for Row Sequence
                components[ x ].setColumn(tempCompSettings.C_SQ); //C_SQ is shorthand for Row Sequence
            }

            //Show the cursor as busy
            $("body").css("cursor", "wait");
            //This call is used to update all of the component's settings before refreshing the page.
            MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences(components); //eslint-disable-line new-cap

            //Refresh the Page or Viewpoint
            CERN_Platform.refreshMPage();
        }
    };


    function launchThemeMenu(componentId, fullId, secId, that) {
        var i18nCore = i18n.discernabu;
        var optMenu = _g("optMenuConfig" + componentId);
        if (!optMenu) {
            optMenu = Util.cep("div", {
                "className": "opts-menu-config-content menu-hide",
                "id": "optMenuConfig" + componentId
            });
            var optMenuJsHTML = [];
            optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>", "<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>", "<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>", "<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");

            optMenu.innerHTML = optMenuJsHTML.join("");

            Util.ac(optMenu, document.body);
            //actual contents of the menu are appended to body and positioned in launchOptMenu

            Util.addEvent(_g("optMenuConfig" + componentId), "click", function(e) {
                var target = e.target || e.srcElement;
                var color = target.getAttribute("data-color");
                changeThemeColor(componentId, color, secId);
            });

            InitCompOptMenu(optMenu, componentId, true); //eslint-disable-line new-cap
        }

        OpenCompOptMenu(optMenu, fullId, that); //eslint-disable-line new-cap
    }

    function changeThemeColor(componentId, color, styleId) {
        var section = _g(styleId);
        if (section) {
            var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
            //a color is found in the class name so replace it with ""
            if (colorString.indexOf(color) >= 0) {
                var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
                section.className = section.className.replace(colorRegExp, "");
            }

            //add the new color so it changes for the user
            Util.Style.acss(section, color);
            var component = MP_Util.GetCompObjById(componentId); //eslint-disable-line new-cap
            component.setCompColor(color);
            //add the color to the component properties
            setTimeout(function() {
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, color, null, false); //eslint-disable-line new-cap
            }, 0);
        }
    }

    function launchSetState(componentId, defStateEl) {
        var component = MP_Util.GetCompObjById(componentId); //eslint-disable-line new-cap
        var curExpColState = component.isExpanded();
        component.setExpandCollapseState(!curExpColState);
        var checkSpan = _gbt("span", defStateEl)[ 0 ];

        if (!curExpColState) {
            if (checkSpan) {
                Util.Style.acss(checkSpan, "opts-menu-def-exp");
            }
            setTimeout(function() {
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "1", false); //eslint-disable-line new-cap
            }, 0);
        }
        else {
            if (checkSpan) {
                Util.Style.rcss(checkSpan, "opts-menu-def-exp");
            }
            setTimeout(function() {
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "0", false); //eslint-disable-line new-cap
            }, 0);
        }
    }

    function launchInfoSetState(componentId, infoStateEl) {
        //false = Disabled, true = Enabled
        var component = MP_Util.GetCompObjById(componentId); //eslint-disable-line new-cap
        var curInfoState = component.isInfoButtonEnabled();
        var checkSpan = _gbt("span", infoStateEl)[ 0 ];
    // Get the component name from the report mean
        var componentName = "";
        if(component.m_reportMean && typeof component.m_reportMean !== "undefined"){
            componentName = component.m_reportMean.split('_').slice(3).join(' ');
        }
        var category_mean = component.getCriterion().category_mean;
        var capTimer = null;
        //component.setIsInfoButtonEnabled(!curInfoState);
        if (curInfoState) {
            component.setIsInfoButtonEnabled(0);
        }
        else {
            capTimer = new CapabilityTimer("CAP:MPG_ENABLE_INFOBUTTON", category_mean); //eslint-disable-line no-undef
            if(capTimer){
                capTimer.addMetaData("rtms.legacy.metadata.1", "InfoButton is enabled from the " + componentName + " Summary Component");
                capTimer.capture();
            }
            component.setIsInfoButtonEnabled(1);
        }

        if (!curInfoState) { //Currently disabled, turning to enabled
            if (checkSpan) {
                Util.Style.acss(checkSpan, "opts-menu-info-en");
                //Call the component function to show info button and allow click event
                component.showInfoButton(component, true);
                setTimeout(function() {
                    MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "1"); //eslint-disable-line new-cap
                }, 0);
            }
        }
        else {
            if (checkSpan) {
                Util.Style.rcss(checkSpan, "opts-menu-info-en");
                //Call the component function to remove info button
                component.showInfoButton(component, false);
                setTimeout(function() {
                    MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "0"); //eslint-disable-line new-cap
                }, 0);
            }
        }
    }

    function InitCompOptMenu(inMenu, componentId, isSubMenu) {
        var closeMenu = function(e) {
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
                    compMenuTimeout = window.setTimeout(function() {
                        if (mainMenu) {
                            if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
                                Util.Style.acss(mainMenu, "menu-hide");
                            }
                        }
                        if (isSubMenu) {
                            Util.Style.acss(inMenu, "menu-hide");
                            if (Util.Style.ccss(target, "opts-menu-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
                                if (_g("moreOptMenu" + componentId)) {
                                    Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
                                }
                            }
                        }
                        if (_g("optMenuConfig" + componentId)) {
                            Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                        }
                    }, compMenuDelay);

                }
            }
            else {
                if (mainMenu) {
                    Util.Style.acss(mainMenu, "menu-hide");
                }
            }
            Util.cancelBubble(e);
        };
        $(inMenu).mouseleave(closeMenu);
        $(inMenu).mouseenter(function() {
            window.clearTimeout(compMenuTimeout);
        });
    }

    /**
     * Open the options menu within the new order entry component
     * @param {node} menu : The menu node
     * @param {string} sectionId : The html id of the section containing the menu
     */
    function OpenCompOptMenu(menu, sectionId, that) {
        var verticalOffset = 30;
        var ofs;
        if (Util.Style.ccss(menu, "menu-hide")) {
            Util.preventDefault();
            Util.Style.rcss(menu, "menu-hide");

            if (that) {
                ofs = Util.goff(that);
                var thisWidth = that.offsetWidth;
                var divOfs = menu.offsetWidth;

                var vpOfs = ofs[ 0 ] - divOfs;
                if (vpOfs > 0) {
                    menu.style.left = (vpOfs - 2) + "px";
                    //  Util.Style.acss(mpDiv, 'hml-mpd-lt');
                }
                else {
                    menu.style.left = (ofs[ 0 ] + thisWidth + 6) + "px";
                    //  Util.Style.acss(mpDiv, 'hml-mpd-rt');

                }
                menu.style.top = (ofs[ 1 ] - 5) + "px";
            }
            else {
                var menuId = "#mainCompMenu" + sectionId;
                var menuElement = $(menuId);
                if (menuElement.length) {
                    //Component menu logic
                    menu.style.left = ($(menuElement).offset().left - 125) + "px";
                    menu.style.top = ($(menuElement).offset().top + 18) + "px";
                }
                else {
                    //Page level menu logic
                    var sec = _g(sectionId);
                    ofs = Util.goff(sec);
                    menu.style.left = (ofs[ 0 ] + sec.offsetWidth - menu.offsetWidth) + "px";
                    menu.style.top = (ofs[ 1 ] + verticalOffset) + "px";
                }
            }
        }
        else {
            Util.Style.acss(menu, "menu-hide");
        }
    }

    function CreateSubTitleText(component) {
        var i18nCore = i18n.discernabu;
        var subTitleText = "";
        var scope = component.getScope();
        var lookbackDays = component.getLookbackDays();
        var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
        var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();

        if (scope > 0) {
            if (lookbackFlag > 0 && lookbackUnits > 0) {
                var replaceText = "";
                switch (lookbackFlag) {
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

                switch (scope) {
                    case 1:
                        subTitleText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
                        break;
                    case 2:
                        subTitleText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
                        break;
                }

            }
            else {
                switch (scope) {
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
}();

/**
 * @namespace
 */
MP_Util.Measurement = function() {

    return {
        GetString: function(result, codeArray, dateMask, excludeUOM) {
            var obj = ( result instanceof MP_Core.Measurement) ? result.getResult() : MP_Util.Measurement.GetObject(result, codeArray); //eslint-disable-line new-cap
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
        GetObject: function(result, codeArray) {
            switch (result.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    return GetQuantityValue(result, codeArray); //eslint-disable-line new-cap
                case "STRING_VALUE":
                    return (GetStringValue(result)); //eslint-disable-line new-cap
                case "DATE_VALUE":
                    //we are currently not returning any date_value results. a common method shall be implemented if/when necessary
                    return (GetDateValue(result)); //eslint-disable-line new-cap
                case "CODIFIED_VALUES":
                case "CODE_VALUE":
                    return (GetCodedResult(result)); //eslint-disable-line new-cap
                case "ENCAPSULATED_VALUE":
                    return (GetEncapsulatedValue(result)); //eslint-disable-line new-cap
            }
        },
        /**
         * @param {Object} num Numeric to format
         * @param {Object} dec Number of decimal places to retain.
         * @deprecated Use mp_formatter.NumericFormatter.
         */
        SetPrecision: function(num, dec) {
            var nf = MP_Util.GetNumericFormatter(); //eslint-disable-line new-cap
            //'^' to not comma seperate values, and '.' for defining the precision
            return nf.format(num, "^." + dec);
        },
        GetModifiedIcon: function(result) {
            return (result.isModified()) ? "<span class='res-modified'>&nbsp;</span>" : "";
        },
        GetNormalcyClass: function(oMeasurement) {
            var normalcy = "res-normal";
            var nc = oMeasurement.getNormalcy();
            if (nc != null) {  //eslint-disable-line eqeqeq
                var normalcyMeaning = nc.meaning;
                if (normalcyMeaning != null) {  //eslint-disable-line eqeqeq
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
            var ar = [ "<span class='", MP_Util.Measurement.GetNormalcyClass(oMeasurement), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>", GetEventViewerLink(oMeasurement, MP_Util.Measurement.GetString(oMeasurement, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(oMeasurement), "</span>" ]; //eslint-disable-line new-cap
            return ar.join("");
        }
    };
    function GetEventViewerLink(oMeasurement, sResultDisplay) {
        var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\"" ];
        var ar = [ "<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", sResultDisplay, "</a>" ];
        return ar.join("");
    }

    function GetEncapsulatedValue(result) {
        var ar = [];
        var encap = result.ENCAPSULATED_VALUE;
        if (encap && encap.length > 0) {
            for (var n = 0, nl = encap.length; n < nl; n++) {
                var txt = encap[ n ].TEXT_PLAIN;
                if (txt != null && txt.length > 0)  //eslint-disable-line eqeqeq
                    ar.push(txt);
            }
        }
        return ar.join("");
    }

    function GetQuantityValue(result, codeArray) {
        var qv = new MP_Core.QuantityValue();
        qv.init(result, codeArray);
        return qv;
    }

    function GetDateValue(result) {
        for (var x = 0, xl = result.DATE_VALUE.length; x < xl; x++) {
            var date = result.DATE_VALUE[ x ];
            if (date.DATE != "") {  //eslint-disable-line eqeqeq
                var dateTime = new Date();
                dateTime.setISO8601(date.DATE);
                return dateTime;
            }
        }
        return null;
    }

    function GetCodedResult(result) {
        var cdValue = result.CODE_VALUE;
        var ar = [];
        for (var n = 0, nl = cdValue.length; n < nl; n++) {
            var values = cdValue[ n ].VALUES;
            for (var p = 0, pl = values.length; p < pl; p++) {
                ar.push(values[ p ].SOURCE_STRING);
            }
            var sOther = cdValue[ n ].OTHER_RESPONSE;
            if (sOther != "")  //eslint-disable-line eqeqeq
                ar.push(sOther);
        }
        return ar.join(", ");
    }

    function GetStringValue(result) {
        var strValue = result.STRING_VALUE;
        var ar = [];
        for (var n = 0, nl = strValue.length; n < nl; n++) {
            ar.push(strValue[ n ].VALUE);
        }
        return ar.join(", ");
    }

}();


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
 * Create a new instance of Event.
 *
 * @classDescription    This class creates a new Event.
 * @returns {Object}    Returns a new Event object.
 * @constructor
 */
function EventListener() { //eslint-disable-line no-redeclare
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
 * @returns {Number} Returns an integer.
 */
EventListener.prototype.getActionIdx = function(obj, evt, action, binding) {
    if (obj && evt) {

        var curel = this.events[ obj ][ evt ];
        if (curel) {
            var len = curel.length;
            for (var i = len - 1; i >= 0; i--) {
                if (curel[ i ].action == action && curel[ i ].binding == binding) { //eslint-disable-line eqeqeq
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
 * @returns {null} Returns null.
 */
EventListener.prototype.addListener = function(obj, evt, action, binding) {
    if (this.events[ obj ]) {
        if (this.events[ obj ][ evt ]) {
            if (this.getActionIdx(obj, evt, action, binding) == -1) { //eslint-disable-line eqeqeq
                var curevt = this.events[ obj ][ evt ];
                curevt[ curevt.length ] = {
                    action: action,
                    binding: binding
                };
            }
        }
        else {
            this.events[ obj ][ evt ] = [];
            this.events[ obj ][ evt ][ 0 ] = {
                action: action,
                binding: binding
            };
        }
    }
    else {
        this.events[ obj ] = [];
        this.events[ obj ][ evt ] = [];
        this.events[ obj ][ evt ][ 0 ] = {
            action: action,
            binding: binding
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
 * @returns {null} Returns null.
 */
EventListener.prototype.removeListener = function(obj, evt, action, binding) {
    if (this.events[ obj ]) {
        if (this.events[ obj ][ evt ]) {
            var idx = this.getActionIdx(obj, evt, action, binding);
            if (idx >= 0) {
                this.events[ obj ][ evt ].splice(idx, 1);
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
 * @returns {null} Returns null.
 */
EventListener.prototype.removeAllListeners = function(obj, binding) {
    if (this.events[ obj ]) {
        for (var el = this.events[ obj ].length; el--;) {
            if (this.events[ obj ][ el ]) {
                for (var ev = this.events[ obj ][ el ].length; ev--;) {
                    if (this.events[ obj ][ el ][ ev ].binding == binding) { //eslint-disable-line eqeqeq
                        this.events[ obj ][ el ].splice(ev, 1);
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
 * @param e A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @returns {null} Returns null.
 */
EventListener.prototype.fireEvent = function(e, obj, evt, args) {
    if (!e) {
        e = window.event;
    }

    if (obj && this.events) {
        var evtel = this.events[ obj ];
        if (evtel) {
            var curel = evtel[ evt ];
            if (curel) {
                for (var act = curel.length; act--;) {
                    var action = curel[ act ].action;
                    if (curel[ act ].binding) {
                        action = action.bind(curel[ act ].binding);
                    }
                    action(e, args);
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
EventListener.EVENT_ERROR_UPDATE = 8;
EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE = 9;
EventListener.EVENT_SCRATCHPAD_REMOVED_ORDER = 10;
EventListener.EVENT_SCRATCHPAD_REMOVED_ORDER_ACTION = 11;
EventListener.EVENT_SCRATCHPAD_RECEIVED_ORDER_ACTION = 12;
EventListener.EVENT_REMOVE_PERSONAL_FAV_FOLDER = 13;
EventListener.EVENT_QOC_VIEW_VENUE_CHANGED = 14;
EventListener.EVENT_SCROLL = 15;
EventListener.EVENT_NAVIGATOR_ERR = 16;
EventListener.EVENT_CONDITIONS_UPDATE = 17;
EventListener.HEALTH_PLANS_RETRIEVED = 18;
EventListener.EVENT_DIAGNOSIS_ADDED = 19;
//Satisfier Event for Gap Check
EventListener.EVENT_SATISFIER_UPDATE = 20;
//Event for the action in contextual view.
EventListener.EVENT_COMPONENT_MOVED_FROM_CONTEXTUAL_VIEW = 21;
//Event for components that are present in the view
EventListener.EVENT_COMPONENTS_IN_VIEW = 22;
EventListener.EVENT_SCRATCHPAD_ORDERS_SIGNED = 23;
EventListener.EVENT_PRESCRIPTION_REMOVED = 24;
