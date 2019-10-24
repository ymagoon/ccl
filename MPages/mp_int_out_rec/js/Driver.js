/**
 * Criterion object created in the driver script.
 * @namespace
 * @external CRITERION
 * @property {Boolean} CRITERION.DEBUG_IND           The debug indicator.
 * @property {Number}  CRITERION.ENCNTR_ID           The Encounter ED.
 * @property {String}  CRITERION.HELP_FILE_LOCAL_IND The indicator that determines if a help file can be stored locally.
 * @property {Number}  CRITERION.LOCALE_ID           The ID of the locale.
 * @property {Number}  CRITERION.PERSON_ID           The ID of the patient.
 * @property {Number}  CRITERION.POSITION_CD         The unique code value representing the user's position.
 * @property {Number}  CRITERION.PPR_CD              The PPR code.
 * @property {Number}  CRITERION.PRSNL_ID            The ID of the user.
 * @property {String}  CRITERION.STATIC_CONTENT      The location to the static content directory.
 */
/*
    var CRITERION = {
        DEBUG_IND: i2,
        ENCNTR_ID: f8,
        EXECUTABLE: vc,
        HELP_FILE_LOCAL_IND: f8,
        LOCALE_ID: f8,
        PERSON_ID: f8,
        POSITION_CD: f8,
        PPR_CD: f8,
        PRSNL_ID: f8,
        STATIC_CONTENT: vc
    }
 */

/**
 * Polyfill to check if a value is an array.
 * @global
 * @param  arg The value to check to see if it is an array.  False otherwise.
 * @return {Boolean} True if the value is an array.
 */
if(!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };
}

/**
 * The App namespace.
 * @namespace App
 */
var App = App || {

    /**
     * enum to hold the CommonWell enrollment status
     * @memberof App
     * @public
     * @type {Object}
     */
    enrollmentStatus : {
        ERROR: -1,
        NOT_ENROLLED: 0,
        ENROLLED: 1
    },
    /**
     * Returns an iframe HTML string with the provided ID and source.
     * @memberof App
     * @public
     * @function
     * @param  {String} id  The ID of the iframe.
     * @param  {String} url The source URL of the iframe.
     * @return {String}     The iframe HTML string.
     */
    getIframeWithUrl: function(id, url) {
        return "<iframe id='" + id + "' src='" + url + "'></iframe>";
    },
    /**
    * Checks to see if the Reconcile link is enabled.
    * @memberof App
    * @public
    * @function
    * @return {Boolean} True if the Reconcile link is enabled, false otherwise.
    */
    isReconcileLinkEnabled: function() {
        var isEnabled = ( Lib.getSinglePref("LINKS_ENABLED_RECONCILE") === true );
        Lib.log.info("Driver.js", "isReconcileLinkEnabled", "Reconcile is " + (isEnabled === true ? "enabled" : "disabled") + ".");
        return isEnabled;
    },
    /**
    * Returns the unique identifier set as preference in Bedrock, for Reconcile link
    * @memberof App
    * @public
    * @function
    * @return {String} Unique identifier set as pref in Bedrock
    */
    getReconcileLinkIdentifier: function() {
        var reconcileLinkIdentifier = Lib.getSinglePref("LINKS_RECONCILE_IDENTIFIER");
        if(reconcileLinkIdentifier === null){
	    reconcileLinkIdentifier = "";
        }
        return reconcileLinkIdentifier;
    },
    /**
     * Gets the report param string for a given script.
     * @memberof App
     * @public
     * @function
     * @param  {String} scriptName The name of the script.
     * @return {String}            The report param.
     */
    getParamString: function(scriptName, viewName) {
        /**
         * Doubles the slashes in a string.  Typically used for file paths.
         * @private
         * @param {String} path The static content path to double the slashes.
         * @return {String|null} The same path with all slashes doubled.  null if error.
         */
        function getDoubleBackSlashes(path) {
            if(typeof path !== "string") {
                return null;
            }
            return path.replace(Lib.regex.frontEnd.singleBackSlash, "\\\\");
        }
        /**
         * Determines if the summary path preference is a valid back end path and file name.
         * @private
         * @return {Boolean} True if the path is a standard back end path and file name, false otherwise.
         */
        function isSummaryBackEnd() {
            var summaryPath = Lib.getSinglePref("TABS_STATIC_PATH_SUMMARY");
            var isBackEnd = Lib.isValidBackEndLocation(summaryPath) === true;
            Lib.log.info("Driver.js", "isSummaryBackEnd", "Summary is " + (isBackEnd === false ? "not " : "") + "back end.");
            return isBackEnd;
        }

        if(viewName ===  undefined){
            viewName = "";
        }
        var paramString = '',
            staticContentPath = '',
            reconcileFlag = '1', //1 is to show reconcile button and hide the link. This is the default behavior
            viewIdentifier = '';

        if(typeof scriptName !== 'string') {
            return paramString;
        }

        switch(scriptName.toLowerCase()) {
            case 'mp_component_driver': // Standard MPages component request.  Append the necessary JSON to this string to identify the desired component.
                staticContentPath = Lib.getSinglePref("CW_LOCATION");
                if(staticContentPath === null) {
                    return null;
                }
                staticContentPath = getDoubleBackSlashes(staticContentPath);
                paramString = '"MINE",' +
                    CRITERION.PERSON_ID + '.00,' +
                    CRITERION.ENCNTR_ID + '.00,' +
                    CRITERION.PRSNL_ID  + '.00,' +
                    CRITERION.POSITION_CD + '.00,' +
                    CRITERION.PPR_CD + '.00,' +
                    '"' + CRITERION.EXECUTABLE + '",' +
                    '"' + staticContentPath + '",' +
                    '"",' +
                    '0,';
                break;
            case 'mp_pv_driver':
                staticContentPath = Lib.getSinglePref("TABS_STATIC_PATH_OUT_DOC");
                if(staticContentPath === null) {
                    return null;
                }
                //If the Reconcile link pref is set, then we need to hide the Reconcile button
                reconcileFlag = App.isReconcileLinkEnabled() === true ? '0' : '1';
                paramString = '"MINE",' +
                    CRITERION.PERSON_ID + '.00,' +
                    CRITERION.ENCNTR_ID + '.00,' +
                    CRITERION.PRSNL_ID  + '.00,' +
                    CRITERION.POSITION_CD + '.00,' +
                    CRITERION.PPR_CD + '.00,' +
                    '"' + CRITERION.EXECUTABLE + '",' +
                    '"",' +
                    '"' + staticContentPath + '",' +
                    '0,' +
                    '1,' +
                    reconcileFlag;
                break;
            case 'mp_int_out_rec_orv_driver':
                staticContentPath = Lib.getSinglePref("TABS_STATIC_PATH_SUMMARY") || "";
                paramString = '"MINE",' +
                    CRITERION.PERSON_ID + '.00,' +
                    CRITERION.ENCNTR_ID + '.00,' +
                    CRITERION.PRSNL_ID  + '.00,';
                    if(isSummaryBackEnd() === true) {
                      paramString += '"",';
                      paramString += '"' + staticContentPath.match(Lib.regex.backEnd.locations)[0] + '",';
                      paramString += '"' + staticContentPath.match(Lib.regex.backEnd.file)[0]      + '"';
                    } else {
                      paramString += '"' + staticContentPath + '",';
                      paramString += '"", ""';
                    }
                break;
            case 'mp_unified_driver':
                switch(viewName){
                    case 'reconcile':
                        viewIdentifier = App.getReconcileLinkIdentifier();
                        paramString = '^MINE^,' +
                            CRITERION.PERSON_ID + '.00,' +
                            CRITERION.ENCNTR_ID + '.00,' +
                            CRITERION.PRSNL_ID  + '.00,' +
                            CRITERION.POSITION_CD + '.00,' +
                            CRITERION.PPR_CD + '.00,' +
                            '"' + CRITERION.EXECUTABLE + '",' +
                            '"",' +
                            '"' + viewIdentifier + '"';
                        break;
                }
                break;
        }
        return paramString;
    },
    /**
     * The main function called onload in the driver script.
     * @memberof App
     * @public
     * @function
     */
    driver: function () {
        try {
            var dataRecTabs;

            // Link IDs
            var commonWellLinkId = "commonwellLink";
            var reconcileLinkId = "reconcileLink";

            // Link Objects                
            var commonwellLinkObj;
            var reconcileLinkObj; 

            // Outside Records Cap Timer
            var tabsCapTimer = MP_Util.CreateTimer("CAP:OREC-LAUNCHTABS");
            tabsCapTimer.Stop();
            
            //USR Timer for CommonWell status display in Outside Records
            var commonWellOutsideRecordsStatusDisplayTimer = new RTMSTimer("USR:COMMONWELL-OUTSIDERECORDSSTATUSDISPLAY");

            /**
             * Updates the link text in the tabs control with CommonWell information.
             * @memberof driver
             * @private
             * @function
             */
            function updateCommonWellLinkText() {
                var action = {
                    getEnrollment: 1,    // Check Enrollment
                    getConnections: 2    // Enrolled, Get Connections
                };

                /**
                 * Determines if the patient is enrolled.
                 * @memberof updateCommonWellLinkText
                 * @private
                 * @function
                 * @param {Number} enrolledFlag 1 indicating enrolled, 2 indicating not enrolled.
                 * @return {Boolean} Returns true if enrolled, returns false if not enrolled.
                 */
                function isEnrolled(enrolledFlag) {
                    var isEnrolled = enrolledFlag === App.enrollmentStatus.ENROLLED;
                    Lib.log.info("Driver.js", "isEnrolled", "CW Enrollment Status: " + isEnrolled.toString());
                    return isEnrolled;
                }

                /**
                 * Determines if the patient is not enrolled.
                 * @memberof updateCommonWellLinkText
                 * @private
                 * @function
                 * @param {Number} enrolledFlag enrolledFlag 1 indicating enrolled, 2 indicating not enrolled.
                 * @return {Boolean} Returns true if not enrolled, returns false if enrolled.
                 */
                function isNotEnrolled(enrolledFlag) {
                    var isNotEnrolled = enrolledFlag === App.enrollmentStatus.NOT_ENROLLED;
                    Lib.log.info("Driver.js", "isNotEnrolled", "CW Not Enrollment Status: " + isNotEnrolled.toString());
                    return isNotEnrolled;
                }

                /**
                 * @typedef {Object} replyMessage
                 * @property {String} message The message in the reply or ""
                 */
                /**
                 * Returns an empty message or the message present in the reply.
                 * @memberof updateCommonWellLinkText
                 * @private
                 * @function
                 * @param {String} reply The reply from the commonwell enrollment script call.
                 * @returns {replyMessage} The object containing the message.
                 */
                function getMessageFromReply(reply) {
                    var replyMessage = {
                        message: ""
                    };
                    try {
                        replyMessage = JSON.parse(reply.COMMONWELLREPLY.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTVALUE);
                    } catch(ex) {
                        Lib.log.error(ex.message);
                    }
                    return replyMessage;
                }

                /**
                 * Updates CommonWell Connections for enrolled patients.
                 * @memberof updateCommonWellLinkText
                 * @private
                 * @function
                 */
                function updateCommonWellConnections() {
                    var getNewCommonWellConnectionsTimer = new RTMSTimer("ENG:OREC-COMMONWELLGETNEWCONNECTIONS");
                    getNewCommonWellConnectionsTimer.start();
                    var connectionParams = "^MINE^ ," + CRITERION.PERSON_ID + ".00" + "," + CRITERION.ENCNTR_ID + ".00" + "," + action.getConnections;
                    Lib.makeCall("mp_pv_get_cw_status",connectionParams,true,function(reply) {
                        var displayText = "";
                        reply = JSON.parse(reply);
                        var numConnections = reply.COMMONWELLREPLY.NEW_CONNECTIONS;
                        if(numConnections > 0) {
                            Lib.log.info("Driver.js", "updateCommonWellConnections", "CW Connections Query: " + numConnections + " new sources.");
                            displayText = i18n.commonwell.COMMONWELL_NEW_SOURCES + "(" + numConnections + ")";
                        }
                        else if(numConnections === 0) {
                            Lib.log.info("Driver.js", "updateCommonWellConnections", "CW Connections Query: " + numConnections + " new sources.");
                            displayText = i18n.commonwell.COMMONWELL_ENROLLED;
                        }
                        else if(getMessageFromReply(reply).message === "timeout") {
                            Lib.log.error("Driver.js", "updateCommonWellConnections", "CW Connections Timeout Error: " + reply.COMMONWELLREPLY.JSON);
                            displayText = i18n.commonwell.COMMONWELL_TIMED_OUT;
                        }
                        else {
                            Lib.log.error("Driver.js", "updateCommonWellConnections", "CW Connections Query Error: " + reply.COMMONWELLREPLY.JSON);
                            displayText = i18n.commonwell.COMMONWELL_NOT_ENABLED;
                        }
                        dataRecTabs.updateLinkText(commonWellLinkId, displayText);
                        if(getNewCommonWellConnectionsTimer) {
                            getNewCommonWellConnectionsTimer.addMetaData("CCLTimers",JSON.stringify(reply.COMMONWELLREPLY.COMMONWELL_ENG_TIMERS.GET_NEW_CONNECTIONS));
                            getNewCommonWellConnectionsTimer.addMetaData("UserID",CRITERION.PRSNL_ID);
                            getNewCommonWellConnectionsTimer.addMetaData("PatientID",CRITERION.PERSON_ID);
                            getNewCommonWellConnectionsTimer.stop();
                        }
                        if(commonWellOutsideRecordsStatusDisplayTimer) {
                            commonWellOutsideRecordsStatusDisplayTimer.addMetaData("UserID",CRITERION.PRSNL_ID);
                            commonWellOutsideRecordsStatusDisplayTimer.addMetaData("PatientID",CRITERION.PERSON_ID);
                            commonWellOutsideRecordsStatusDisplayTimer.stop();
                        }
                        
                    },function() {
                        dataRecTabs.updateLinkText(commonWellLinkId, i18n.commonwell.COMMONWELL_NOT_ENABLED);
                        if(getNewCommonWellConnectionsTimer) {
                            getNewCommonWellConnectionsTimer.fail();
                        }
                        if(commonWellOutsideRecordsStatusDisplayTimer) {
                            commonWellOutsideRecordsStatusDisplayTimer.fail();
                        }
                    });
                }

                /**
                 * Updates CommonWell Enrollment Status for patients.
                 * @memberof updateCommonWellLinkText
                 * @private
                 * @function
                 */
                function updateCommonWellEnrollment() {
                    var checkCommonWellEnrollmentTimer = new RTMSTimer("ENG:OREC-COMMONWELLCHECKENROLLMENT");
                    checkCommonWellEnrollmentTimer.start();
                    // Get Enrollment Status
                    var enrollmentParams = "^MINE^ ," + CRITERION.PERSON_ID + ".00" + "," + CRITERION.ENCNTR_ID + ".00" + "," + action.getEnrollment;
                    Lib.makeCall("mp_pv_get_cw_status",enrollmentParams,true,function(reply) {
                        reply = JSON.parse(reply);
                        if(isNotEnrolled(reply.COMMONWELLREPLY.ENROLLED_FLAG)) {
                            Lib.log.info("Driver.js", "updateCommonWellEnrollment", "CW Enrollment Query: Patient Not Enrolled");
                            dataRecTabs.updateLinkText(commonWellLinkId, i18n.commonwell.COMMONWELL_NOT_ENROLLED);
                        } else if(isEnrolled(reply.COMMONWELLREPLY.ENROLLED_FLAG)) {
                            // Patient is enrolled, check for connections.
                            updateCommonWellConnections();
                        } else if(getMessageFromReply(reply).message === "timeout") {
                            Lib.log.error("Driver.js", "updateCommonWellEnrollment", "CW Connections Timeout Error: " + reply.COMMONWELLREPLY.JSON);
                            dataRecTabs.updateLinkText(commonWellLinkId, i18n.commonwell.COMMONWELL_TIMED_OUT);
                        } else {
                            Lib.log.error("Driver.js", "updateCommonWellEnrollment", "CW Connections Query Error: " + reply.COMMONWELLREPLY.JSON);
                            dataRecTabs.updateLinkText(commonWellLinkId, i18n.commonwell.COMMONWELL_NOT_ENABLED);
                        }
                        if(!isEnrolled(reply.COMMONWELLREPLY.ENROLLED_FLAG)) {
                            if(commonWellOutsideRecordsStatusDisplayTimer) {
                                commonWellOutsideRecordsStatusDisplayTimer.addMetaData("UserID",CRITERION.PRSNL_ID);
                                commonWellOutsideRecordsStatusDisplayTimer.addMetaData("PatientID",CRITERION.PERSON_ID);
                                commonWellOutsideRecordsStatusDisplayTimer.stop();
                            }
                        }
                        if(checkCommonWellEnrollmentTimer) {
                            checkCommonWellEnrollmentTimer.addMetaData("CCLTimers",JSON.stringify(reply.COMMONWELLREPLY.COMMONWELL_ENG_TIMERS.IS_ENROLLED));
                            checkCommonWellEnrollmentTimer.addMetaData("UserID",CRITERION.PRSNL_ID);
                            checkCommonWellEnrollmentTimer.addMetaData("PatientID",CRITERION.PERSON_ID);
                            checkCommonWellEnrollmentTimer.stop();
                        }
                    },function() {
                        dataRecTabs.updateLinkText(commonWellLinkId, i18n.commonwell.COMMONWELL_NOT_ENABLED);
                        if(checkCommonWellEnrollmentTimer) {
                            checkCommonWellEnrollmentTimer.fail();
                        }
                        if(commonWellOutsideRecordsStatusDisplayTimer) {
                            commonWellOutsideRecordsStatusDisplayTimer.fail();
                        }
                    });
                }

                // Check if the patient is enrolled and based on that fetch or not fetch connections.
                updateCommonWellEnrollment();
            }

            /**
             * Gets the entire report param for the CommonWell Enrollment MPage.
             * @private
             * @param {String} reportName The script that needs to be called.
             * @return {String|null} The report param for the CommonWell Enrollment MPage.  null if error.
             */
            function getCommonWellReportParam(reportName) {
                var reportParam = "";
                reportParam = App.getParamString(reportName);
                if(reportParam === null) {
                    return null;
                }
                reportParam += '^{ "CS":' +
                                '{"R_ID":0.0, ' +
                                    '"F_ID" : 0.0, ' +
                                    '"R_MN" : "MP_VB_STD_COMMWELL", ' +
                                    '"F_MN" : "WF_COMMON_WELL", ' +
                                    '"LBL" : "CommonWell", ' +
                                    '"LNK" : "", ' +
                                    '"G_SQ" : 1, ' +
                                    '"R_SQ" : 2, ' +
                                    '"C_SQ" : 1, ' +
                                    '"EXP" : 1, ' +
                                    '"SCR_NM" : 0, ' +
                                    '"SCR_EN" : 0, ' +
                                    '"PLS_AD" : 0, ' +
                                    '"LB_UNT" : 0, ' +
                                    '"LB_TYP" : 0, ' +
                                    '"SCP" : 0, ' +
                                    '"DT_DSP" : 0, ' +
                                    '"THM" : "", ' +
                                    '"TS" : 1, ' +
                                    '"FILT" : []}}^';
                return reportParam;
            }
            /**
             * Checks to see if CommonWell is enabled.
             * @private
             * @return {Boolean} True if enabled, false otherwise.
             */
            function isCommonWellEnabled() {
                var isEnabled = Lib.getSinglePref("CW_ENABLE_NOTIF") === "1";
                Lib.log.info("Driver.js", "isCommonWellEnabled", "CommonWell is " + (isEnabled === true ? "enabled" : "disabled") + ".");
                return isEnabled;
            }
            /**
             * Checks to see if the Modal is configured to be be shown.
             * @private
             * @return {Boolean} True if the Modal should show, false otherwise.
             */
            function isModalConfigured() {
                var isConfigured = Lib.isValidStaticContentPath(Lib.getSinglePref("CW_LOCATION")) === true;
                Lib.log.info("Driver.js", "isModalConfigured", "The modal is " + (isConfigured === false ? "not " : "") + "configured.");
                return isConfigured;
            }
            /**
             * Checks to see if the Outside Documents MPage should be shown.
             * @private
             * @return {Boolean} True if the Outside Documents tab should show, false otherwise.
             */
            function isOutsideDocumentsEnabled() {
                var isEnabled = Lib.isValidStaticContentPath(Lib.getSinglePref("TABS_STATIC_PATH_OUT_DOC")) === true;
                Lib.log.info("Driver.js", "isOutsideDocumentsEnabled", "Outside Documents is " + (isEnabled === true ? "enabled" : "disabled") + ".");
                return isEnabled;
            }
            /**
             * Checks to see if the Summary Tab is enabled.
             * @private
             * @return {Boolean} True if the Summary Tab is enabled, false otherwise.
             */
            function isSummaryEnabled() {
                var isEnabled = Lib.getSinglePref("TABS_ENABLED_SUMMARY") === true;
                Lib.log.info("Driver.js", "isSummaryEnabled", "Summary is " + (isEnabled === true ? "enabled" : "disabled") + ".");
                return isEnabled;
            }

            var paramString = "^MINE^, " + CRITERION.POSITION_CD + ".00";
            Lib.retrievePrefs("mp_int_out_rec_prefs", paramString);
             /**
             * Opens the Framework Dialog as a pop up.
             * @private pvFrameworkLinkProps - An Object storing properties to be set on PVFRAMEWORKLINK object.
             * @return 
             */           
            function loadFrameworkPopUp(pvFrameworkLinkProps) {  
                var pvFrameworkLinkObj = window.external.DiscernObjectFactory('PVFRAMEWORKLINK');                      
                pvFrameworkLinkObj.SetPopupStringProp('REPORT_NAME', pvFrameworkLinkProps.reportName);
                pvFrameworkLinkObj.SetPopupStringProp('REPORT_PARAM', pvFrameworkLinkProps.reportParam);
                pvFrameworkLinkObj.SetPopupDoubleProp('WIDTH', pvFrameworkLinkProps.width);
                pvFrameworkLinkObj.SetPopupDoubleProp('HEIGHT', pvFrameworkLinkProps.height);
                pvFrameworkLinkObj.SetPopupBoolProp('MODELESS', pvFrameworkLinkProps.modeless);
                pvFrameworkLinkObj.SetPopupBoolProp('SHOW_BUTTONS', pvFrameworkLinkProps.showButtons);
                pvFrameworkLinkObj.SetPopupBoolProp('SHOW_DEMOG_BAR', pvFrameworkLinkProps.showDemoBar);
                pvFrameworkLinkObj.SetPopupBoolProp('CAN_AUTO_CLOSE', pvFrameworkLinkProps.canAutoClose);
                pvFrameworkLinkObj.SetPopupStringProp('DLG_TITLE', pvFrameworkLinkProps.dialogTitle);
                pvFrameworkLinkObj.SetPopupStringProp('VIEW_CAPTION', pvFrameworkLinkProps.viewCaption);
                pvFrameworkLinkObj.LaunchPopup();
             }
          
            var linkObjs = [] ;          
    
            if(App.isReconcileLinkEnabled() === true) {
                var reconcileLinkName = Lib.getSinglePref("LINKS_RECONCILE_NAME") || i18n.reconcile.RECONCILE_LINK;
                var reportName = 'mp_unified_driver';
                var pvFrameworkLinkProps = {
                    canAutoClose: 0,
                    reportName: reportName,
                    reportParam: App.getParamString(reportName, "reconcile"),
                    width: 1200,
                    height: 700,
                    modeless: 1,
                    showButtons: 0,
                    showDemoBar: 1,
                    dialogTitle: i18n.reconcile.RECONCILIATION_DLG_TITLE,
                    viewCaption: i18n.reconcile.RECONCILIATION_DLG_TITLE
                }

                reconcileLinkObj = {
                    id: reconcileLinkId,
                    displayText: reconcileLinkName,
                    onClickFn: function() {
                        loadFrameworkPopUp(pvFrameworkLinkProps);
                        // Launch Reconcile Pop Up Timer.
                        var reconCapsTimer = MP_Util.CreateTimer("CAP:OREC-LAUNCHRECONCILEPOPUP");
                        reconCapsTimer.Stop();
                        Lib.log.info("Driver.js", "driver", "Clicked the Reconcile link.");
                    }
                }
                linkObjs.push(reconcileLinkObj);
            }
            if(isCommonWellEnabled() === true) {
                if(isModalConfigured() === true) {
                    var id = "outRecModal",
                        iframeId = id + "Iframe",
                        reportName = "mp_component_driver",
                        reportParam = getCommonWellReportParam(reportName),
                        modal = new Lib.Modal(id, '<iframe id="' + iframeId + '" class="seamlessIframe"></iframe>');
                        commonwellLinkObj = {
                        id: commonWellLinkId,
                        displayText: i18n.commonwell.COMMONWELL_MODAL_LINK,
                        onClickFn: function() {
                            if($('#' + iframeId).contents().find('body').html() === '') {
                                Lib.loadIframe(reportName, reportParam, iframeId);
                            }
                            modal.show();
                        }
                    };
                } else {
                    commonwellLinkObj = {
                        id: commonWellLinkId,
                        displayText: i18n.commonwell.COMMONWELL_MODAL_LINK,
                        onClickFn: undefined
                    };
                }
                linkObjs.push(commonwellLinkObj);
            }
          
            dataRecTabs = new TabsControl("outRec", document.body, linkObjs);

            if(isOutsideDocumentsEnabled() === true) {
                dataRecTabs.appendTab("xdocs", i18n.tabs.OUTSIDE_DOCUMENTS, "<iframe id='xdocsIframe'></iframe>");
                Lib.loadIframe("mp_pv_driver", App.getParamString("mp_pv_driver"), "xdocsIframe");
            }

            if(isSummaryEnabled() === true) {
                dataRecTabs.appendTab("browserSoft", i18n.tabs.SUMMARY, "<iframe id='browsersoftIframe'></iframe>");
                Lib.loadIframe("mp_int_out_rec_orv_driver", App.getParamString("mp_int_out_rec_orv_driver"), "browsersoftIframe");
                // Browsersoft Cap Timer
                var bsCapTimer = MP_Util.CreateTimer("CAP:OREC-LAUNCHBROWSERSOFT");
                bsCapTimer.Stop();
            }
  
            // Select the default tab.
            if(dataRecTabs.getTabs().length > 0) {
                if(Lib.getSinglePref("DEFAULT_TAB_CD")!==null) {
                    if(Lib.getSinglePref("DEFAULT_TAB_CD") === "OUTSIDEDOCS" && isOutsideDocumentsEnabled() === true) {
                        dataRecTabs.selectTab("xdocsButton");
                    } else if(Lib.getSinglePref("DEFAULT_TAB_CD") === "SUMM" && isSummaryEnabled() === true) {
                        dataRecTabs.selectTab("browserSoftButton");
                    } else {
                      dataRecTabs.selectTabByIndex(dataRecTabs.getTabs().length-1);
									}
                } else {
                    if(isSummaryEnabled() === true){
                        dataRecTabs.selectTab("browserSoftButton");
                    } else if(isOutsideDocumentsEnabled() === true) {
                        dataRecTabs.selectTab("xdocsButton");
                    }
                }
            } else {
                Lib.log.info("Driver.js", "driver", "All tabs are hidden.");
            }

            if(isCommonWellEnabled() === true) {
                commonWellOutsideRecordsStatusDisplayTimer.start();
                updateCommonWellLinkText();
            }
        } catch(e) {
            Lib.log.error("Driver.js", "driver", e.message);
        }
    }
};
