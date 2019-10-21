/* global MPageTooltip */
/* eslint mp-camelcase:[1, "CardiologyDevice_o2Component", "CardiologyDevice_o2ComponentStyle", "CERN_BrowserDevInd"] */
/* eslint "new-cap":[2, {"capIsNewExceptions": ["CreateTimer", "Start", "Stop", "Abort", "LogScriptCallError", "HandleErrorResponse", "FinalizeComponent", "LogScriptCallInfo", "LogError", "LogJSError", "CCLLINK", "Print", "ExecuteReport", "CanViewNextPage", "ViewNextPage", "CanViewPrevPage", "ViewPrevPage"]}]*/
/* eslint
brace-style:0,
complexity:0,
indent:[1, 4, {
    "SwitchCase": 1,
    "VariableDeclarator": 1
}],
no-mixed-spaces-and-tabs:1,
no-spaced-func:1,
space-after-keywords:1,
space-before-function-paren:0,
space-before-blocks:1,
space-in-parens:1,
space-return-throw-case:1,
vars-on-top:2,
quotes:[1,"double"],
array-bracket-spacing:0,
object-curly-spacing:0
*/

/**
 * Callback that accepts a script reply.
 *
 * @callback scriptReplyCallback
 * @param {object} reply The reply from the script.
 */

/**
 * @typedef DevicePID
 * @type {object}
 * @property {string} NAME_FULL_FORMATTED The full formatted name for the patient
 * @property {string} SERIAL_TXT The serial number for the device
 * @property {string} BIRTH_DT_TM_TXT The birth date for the patient in the format YYYYMMDD
 * @property {string} SEX_CDF The gender of the patient
 */

/**
 * Create the component style object which will be used to style various aspects of our component
 * @class
 * @returns {undefined} Nothing
 */
function CardiologyDevice_o2ComponentStyle() {
    this.initByNamespace("cdc2");
}

CardiologyDevice_o2ComponentStyle.prototype = new ComponentStyle();
CardiologyDevice_o2ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @class
 * @classdesc Cardiac Device Workflow detail Component
 * @constructor
 * @param {Criterion} criterion - The Criterion object which contains information needed to render the component.
 */
function CardiologyDevice_o2Component(criterion) {
    this.initComponentVars();

    this.alertMessage = null;

    this.i18n = i18n.discernabu.cardiology_device_integration_detail_o2;

    // Sets the criterion object (contains component-rendering info)
    this.setCriterion(criterion);
    // Sets the component's style to the namespace provided
    this.setStyles(new CardiologyDevice_o2ComponentStyle());
    // Include result count when creating count text
    this.setIncludeLineNumber(true);

    this.setComponentLoadTimerName("USR:MPG.Cardiology.Device.Detail.o2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.Cardiology.Device.Detail.o2 - render component");
}

CardiologyDevice_o2Component.prototype = new MPageComponent();
CardiologyDevice_o2Component.prototype.constructor = MPageComponent;

/**
 * Sets the <code>PMkrData</code>, <code>Episodes</code>, <code>Sessions</code>, and <code>histPMkrData</code> class members.
 * @returns {Undefined} Nothing
 */
CardiologyDevice_o2Component.prototype.createSessionEpisodeHierarchy = function () {
    var deviceIdx,
        histPMkrData;

    for (deviceIdx = 0; deviceIdx < this.JSONData.PULSE_GENS.length; deviceIdx++) {
        if (deviceIdx === 0) {
            this.PMkrData = this.JSONData.PULSE_GENS[0];
            this.Episodes = this.JSONData.PULSE_GENS[0].EPISODES;
            this.Sessions = this.JSONData.PULSE_GENS[0].SESSIONS;

            if (this.Sessions.length === 0 && this.Episodes.length === 0) {
                this.PMkrData.SESSION_EPISODE_HIERARCHY = [];
            } else if (this.Sessions.length === 0) {
                this.PMkrData.TOP_EPISODE_LIST = this.createTopEpisodeList(this.Sessions[0], this.Sessions, this.Episodes);
                this.PMkrData.SESSION_EPISODE_HIERARCHY = [];
            } else {
                this.PMkrData.TOP_EPISODE_LIST = this.createTopEpisodeList(this.Sessions[0], this.Sessions, this.Episodes);
                this.PMkrData.SESSION_EPISODE_HIERARCHY = this.constructSessionEpisodeHierarchy(this.Sessions, this.Episodes);
            }
        } else {
            histPMkrData = this.JSONData.PULSE_GENS[deviceIdx];
            histPMkrData.SESSION_EPISODE_HIERARCHY = this.constructSessionEpisodeHierarchy(this.JSONData.PULSE_GENS[deviceIdx].SESSIONS, this.JSONData.PULSE_GENS[deviceIdx].EPISODES);
            this.histPMkrData.push(histPMkrData);
        }
    }
};

/**
 * Described additional variables to reset when the component refreshes.
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.prototype.refreshComponent = function () {
    this.initComponentVars();

    // Include result count when creating count text
    this.setIncludeLineNumber(true);
    MPageComponent.prototype.refreshComponent.call(this);
};

/**
 * Initializes all CardiologyDevice_o2Component member variables
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.prototype.initComponentVars = function () {
    this.currentPage = 1;
    this.totalPages = 1;
    this.selectedPDF = null;
    this.scopeObj = null;
    this.alreadyPostProcessed = false;
    this.requestEndorsementSequence = 0;
    this.modalArr = [];
    this.JSONData = {};
    this.PMkrData = {};
    this.histPMkrData = [];
    this.Episodes = [];
    this.Sessions = [];
    this.ModeEqvs = {
        A: "Atrial",
        V: "Ventrial",
        D: "Dual",
        O: "None",
        T: "Triggered",
        I: "Inhibited",
        R: "Rate Modulated",
        C: "Communicating",
        M: "Multiprogrammable",
        P: "Paced",
        S: "Shocks"
    };
    this.documentViewer = null;
    this.elementToDocUID = {};
    this.sessionToDocUID = [];
    this.modeTooltip = null;
    this.activeDocID = null;
    this.staticImagePath = "";
    this.alreadyAssociatedMessage = "";
    this.DataLoaded = false;
    this.addrBookSearchControl = null;
    this.suggestedMatchPulseGenIDs = [];
    this.devicesToAssociate = [];
    this.devicesToDisassociate = [];
};

/**
 * Converts the CCL-Returned Date (Format: /Date(2013-06-26T13:10:00.000+00:00)/) to a JavaScript
 * Date() object, which can then be parsed using the native JavaScript parser
 *
 * <ul>
 * <li><code>"default":        "ddd mmm dd yyyy HH:MM:ss"</code></li>
 * <li><code>shortDate:        "m/d/yy"</code></li>
 * <li><code>shortDate2:       "mm/dd/yyyy"</code></li>
 * <li><code>shortDate3:       "mm/dd/yy"</code></li>
 * <li><code>shortDate4:       "mm/yyyy"</code></li>
 * <li><code>shortDate5:       "yyyy"</code></li>
 * <li><code>mediumDate:       "mmm d, yyyy"</code></li>
 * <li><code>longDate:         "mmmm d, yyyy"</code></li>
 * <li><code>fullDate:         "dddd, mmmm d, yyyy"</code></li>
 * <li><code>shortTime:        "h:MM TT"</code></li>
 * <li><code>mediumTime:       "h:MM:ss TT"</code></li>
 * <li><code>longTime:         "h:MM:ss TT Z"</code></li>
 * <li><code>militaryTime:     "HH:MM"</code></li>
 * <li><code>isoDate:          "yyyy-mm-dd"</code></li>
 * <li><code>isoTime:          "HH:MM:ss"</code></li>
 * <li><code>isoDateTime:      "yyyy-mm-dd'T'HH:MM:ss"</code></li>
 * <li><code>isoUtcDateTime:   "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"</code></li>
 * <li><code>longDateTime:     "mm/dd/yyyy h:MM:ss TT Z"</code></li>
 * <li><code>longDateTime2:    "mm/dd/yy HH:MM"</code></li>
 * <li><code>longDateTime3:    "mm/dd/yyyy HH:MM"</code></li>
 * <li><code>shortDateTime:    "mm/dd h:MM TT"</code></li>
 * <li><code>mediumDateNoYear: "mmm d"</code></li>
 * </ul>
 *
 * @param   {STRING} DTTM The CCL-Returned Date in format: /Date(2013-06-26T13:10:00.000+00:00)/
 * @param   {STRING} dateFormat The requested format the date should be output in
 * @returns {OBJECT} A JavaScript Date() Object
 * @returns {STRING} A string representation of the date in the format requested by the dateFormat parameter (see options in
 * descriptions about)
 * @example
 * var newJSDate   = this.CCLDateToJSDate("/Date(2013-06-26T13:10:00.000+00:00)/");
 * var parsedMonth = newJSDate.getMonths(); // See http://www.w3schools.com/jsref/jsref_obj_date.asp
 */
CardiologyDevice_o2Component.prototype.cclDateToJSDate = function (DTTM, dateFormat) {
    var dateResult = new Date();
    try {
        dateResult.setISO8601(DTTM);
        return typeof dateFormat === "undefined" ? dateResult : dateResult.format(dateFormat);
    } catch (err) {
        throw err;
    }
};

/**
 * Extends the input JSON object with additional date information, including a human-readable date
 * and time, the UTC/Epoch value of the input date, and the converted JavaScript Date object itself.
 *
 * @param  {STRING} CCLDateTime    CCL-returned date (format: /Date(2013-06-26T13:10:00.000+00:00)/)
 * @param  {OBJECT} objectToExpand The JSON object we're attempting to enhance and expand with the
 *                                 additional date information
 * @param  {STRING} prefix         The prefix all the new properties should get (ex. prefix "ORDER"
 *                                 appends ORDER_JS_DTTM, ORDER_UTC, ORDER_DT, and ORDER_TM)
 * @returns {OBJECT}                Returns the object passed into the function, now modified.
 */
CardiologyDevice_o2Component.prototype.expandCCLDateData = function (CCLDateTime, objectToExpand, prefix) {
    // OBJECT containing the CCL date converted into a JavaScript Date() object
    var DETECTION_JS_DTTM = this.cclDateToJSDate(CCLDateTime);
    // Pass the JavaScript Date Object into the JSON object (for future accessibility)
    objectToExpand[prefix + "_JS_DTTM"] = DETECTION_JS_DTTM;
    // Parse the JS Date into UTC (Epoch/MKTime) and store it within the object
    objectToExpand[prefix + "_UTC"] = Date.parse(DETECTION_JS_DTTM);
    // Parse the JS Date's DATE portion (no time) and store it within the object (format: mm/dd/yyyy)
    objectToExpand[prefix + "_DT"] = this.cclDateToJSDate(CCLDateTime, "shortDate2");
    // Parse the JS Date's TIME portion (no date) and store it within the object (format: HH:MM:SS)
    objectToExpand[prefix + "_TM"] = this.cclDateToJSDate(CCLDateTime, "mediumTime");
    return objectToExpand;
};

/**
 * Appends a leading zero to Numbers whose value is less than 10. When provided a second parameter
 * (of ANY flavor; it's looking for "Not Undefined") it pads to the hundreds instead.
 *
 * @param  {NUMBER}  intValue The numeric value we wish to pad
 * @param  {ANY}     roundVal Indicates to the function we wish to pad to the 100's instead of the 10's
 * @returns {STRING}           The now-padded number (if applicable)
 */
CardiologyDevice_o2Component.prototype.leadZero = function (intValue, roundVal) {
    if (typeof roundVal === "undefined") {
        return intValue < 10 ? "0" + intValue : intValue.toString();
    }
    if (intValue < 10) {
        return "00" + intValue;
    }
    return intValue.toString();
};

/**
 * This function is used to construct Episode List that is displayed under "Since Last Visit" header
 * The Episodes under these sections are those that have a date/time greater than the most recent session/Interrogation
 * All the Episodes are grouped in the top episode list section if there are no Sessions/Interrogations
 * @param {SESSION} mostRecentSession The most recent session for a device.
 * @param {SESSION[]} sessions All sessions for a device.
 * @param {EPISODE[]} episodes All episodes for a device.
 * @returns {EPISODE[]} An array of episodes that are after <code>mostRecentSession</code>.
 */
CardiologyDevice_o2Component.prototype.createTopEpisodeList = function (mostRecentSession, sessions, episodes) {
    var currentEpisode,
        episodeIdx,
        topEpisodeList = [];

    //To handle a scenario where there is no Sessions and there are episodes
    if (sessions.length === 0) {
        for (episodeIdx = 0; episodeIdx < episodes.length; episodeIdx++) {
            currentEpisode = episodes[episodeIdx];
            this.expandCCLDateData(currentEpisode.DETECTION_DT_TM, currentEpisode, "DETECTION");
            topEpisodeList.push(currentEpisode);
        }
    } else {
        this.expandCCLDateData(mostRecentSession.SESSION_DT_TM, mostRecentSession, "SESSION");
        for (episodeIdx = 0; episodeIdx < episodes.length; episodeIdx++) {
            currentEpisode = episodes[episodeIdx];
            this.expandCCLDateData(currentEpisode.DETECTION_DT_TM, currentEpisode, "DETECTION");
            if (currentEpisode.DETECTION_UTC > mostRecentSession.SESSION_UTC) {
                topEpisodeList.push(currentEpisode);
            }
        }
    }

    return topEpisodeList;
};

/**
 * This function identifies the list of Episodes that belong under the "Historical Interrogations" section
 * @param {SESSION} mostRecentSession The most recent session for a device.
 * @param {EPISODE[]} episodes All episodes for a device.
 * @returns {EPISODE[]} An array of episodes that are before <code>mostRecentSession</code>.
 */
CardiologyDevice_o2Component.prototype.createHistoricalEpisodesList = function (mostRecentSession, episodes) {
    var currentEpisode,
        episodeIdx,
        historicalEpisodeList = [];

    this.expandCCLDateData(mostRecentSession.SESSION_DT_TM, mostRecentSession, "SESSION");

    for (episodeIdx = 0; episodeIdx < episodes.length; episodeIdx++) {
        currentEpisode = episodes[episodeIdx];
        this.expandCCLDateData(currentEpisode.DETECTION_DT_TM, currentEpisode, "DETECTION");
        if (currentEpisode.DETECTION_UTC < mostRecentSession.SESSION_UTC) {
            historicalEpisodeList.push(currentEpisode);
        }
    }

    return historicalEpisodeList;
};

/**
 * This function relates an episode to a Session, such that a bunch a episode/episodes are grouped to a Session
 * @param {SESSION[]} sessions All sessions for a device.
 * @param {EPISODE[]} episodes All episodes for a device.
 * @returns {Session[]} An array of sessions with episodes grouped under each session.
 */
CardiologyDevice_o2Component.prototype.constructSessionEpisodeHierarchy = function (sessions, episodes) {
    var episodeCounter,
        sessionCounter,
        actSessionIdx = 0,
        historicalEpisodes = this.createHistoricalEpisodesList(sessions[0], episodes),
        currentEpisode,
        currentSession;

    //Create an empty episode list and also get the UTC time of sessions
    for (sessionCounter = 0; sessionCounter < sessions.length; sessionCounter++) {
        currentSession = sessions[sessionCounter];
        this.expandCCLDateData(currentSession.SESSION_DT_TM, currentSession, "SESSION");
        currentSession.EPISODE_LIST = [];
        currentSession.SESSION_NAME = currentSession.SESSION_DT;
    }

    //Loops through the historical interrogation and groups it with sessions based on the date/time
    for (episodeCounter = 0; episodeCounter < historicalEpisodes.length; episodeCounter++) {
        currentEpisode = historicalEpisodes[episodeCounter];
        this.expandCCLDateData(currentEpisode.DETECTION_DT_TM, currentEpisode, "DETECTION");

        if (currentEpisode.DETECTION_UTC < sessions[actSessionIdx].SESSION_UTC &&
            actSessionIdx + 1 < sessions.length) {
            if (currentEpisode.DETECTION_UTC > sessions[actSessionIdx + 1].SESSION_UTC) {
                sessions[actSessionIdx].EPISODE_LIST.push(currentEpisode);
            } else {
                actSessionIdx = actSessionIdx + 1;
                sessions[actSessionIdx].EPISODE_LIST.push(currentEpisode);
            }
        } else {
            sessions[actSessionIdx].EPISODE_LIST.push(currentEpisode);
        }
    }

    return sessions;
};

/**
 * Generates the HTML code for the floating pop-up div containing additional device or implantation
 * details.
 *
 * @param {OBJECT} nameCollection JSON Object containing all the rows to be output in the hover table.
 *        Syntax: { label1:value1, label2:value2, ... }
 * @param {STRING} valueCollection The ID of the DIV tag that will contain the pop-up table (corresponds to
 *        CSS declarations)
 * @returns {STRING} The generated DIV's and TABLE's HTML code.
 * @example
 * opHTML += this.constructHoverTable({Implanting_Physician:"Dr. Jonathan Doe", Facility:"John's Hopkins", Phone:"800-867-5309"},
 * "ImplantingDoctorHover");
 */
CardiologyDevice_o2Component.prototype.constructHoverTable = function (nameCollection, valueCollection) {
    var i,
        opHTML = "";

    for (i = 0; i < nameCollection.length; i++) {
        opHTML += "<tr><td><span class = 'cdc2-tooltip-labeltext'>" + nameCollection[i] + "</span>: <span class = 'cdc2-tooltip-valuetext'>" + valueCollection[i] + "</span></td></tr>";
    }
    return "<table class='ImplantingDoctorHover'>" + opHTML + "</table>";
};

/**
 * Builds the "top row" of information about the pacemaker
 * @returns {STRING} The now-generated HTML output for the "top row"
 */
CardiologyDevice_o2Component.prototype.constructHeaderData = function () {
    var opHTML,
        PMData,
        Battery,
        ERI,
        batteryVoltage;

    PMData = this.PMkrData;
    Battery = PMData.BATTERY_MEASUREMENTS[0];
    batteryVoltage = "";
    ERI = "";
    if (Battery) {
        ERI = Battery.RRT_TRIGGER === "" ? "" : "(" + Battery.RRT_TRIGGER + ")";
        batteryVoltage = Battery.VOLTAGE_VALUE + "v";
    } else {
        batteryVoltage = this.i18n.NO_BATTERY_INFO;
    }
    opHTML = "";
    opHTML +=
        "<div id='cdc2-header-data-row'>" +
            "<div id='cdc2-hdr-row-device-details'>" +
                "<table id='SensingPacingHover'>" +
                    "<tr>" +
                        "<td>" +
                            "<div id='cdc2-hdr-row-device-name' class='cdc2-hdr-row-datum'>" + PMData.MANUFACTURER_DISP + " " + PMData.MODEL_IDENT +
                            "</div>" +
                        "</td>" +
                        "<td>" +
                            "<div id='cdc2-header-row-battery-info'><span class='cdc2-hdr-row-battery-info'>" + this.i18n.BATTERY + ":</span> " + batteryVoltage + " " + ERI +
                            "</div>" +
                        "</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td>" +
                            "<div class='cdc2-hdr-row-datum'>" + this.i18n.PACEMAKER_SN + ": " + PMData.SERIAL_TXT +
                            "</div>" +
                        "</td>";

    if (PMData.BRADY_SETTINGS[0] && PMData.BRADY_SETTINGS[0].MODE_DISP) {
        opHTML +=
                        "<td>" +
                            "<div id='cdc2-hdr-row-device-mode'><span class='cdc2-hdr-row-battery-info'>" + this.i18n.DEVICE_MODE + ": </span>" + PMData.BRADY_SETTINGS[0].MODE_DISP +
                            "</div>" +
                        "</td>" +
                    "</tr>";
    } else {
        opHTML +=
                    "</tr>";
    }
    //Logic to check with the date returned is not all Zeroes (basically null in Database)
    if (PMData.IMPLANT_DT_TM === "/Date(0000-00-00T00:00:00.000+00:00)/") {
        opHTML +=
                    "<tr>" +
                        "<td>" +
                        "<div class='cdc2-hdr-row-device-implant-date cdc2-hdr-row-datum'>" +
                            "</div>" +
                        "</td>" +
                    "</tr>";
        //Just having the <div> for the implant date/time even though there is no information to be displayed if in future if solution designers/ strategists come with exception message
    } else {
        opHTML +=
                    "<tr>" +
                        "<td>" +
                        "<div class='cdc2-hdr-row-device-implant-date cdc2-hdr-row-datum'>" + this.i18n.IMPLANTED + ": " + this.cclDateToJSDate(PMData.IMPLANT_DT_TM, "longDate") +
                            "</div>" +
                        "</td>" +
                    "</tr>";
    }
    opHTML +=
                "</table>" +
            "</div>" +
        "</div>";
    return opHTML;
};

/**
 * Generates the HTML code for a single episode.
 *
 * @param {STRING} serialID      A numeric serialization suffixing the episode's div node. ex. 001,
 *                               002, 003... Children contain the parent's serial as a prefix:
 *                               001001, 001002...
 * @param {STRING} episodeLabel  The label of the Episode to be clicked to load the PDF. Though it
 *                               can be any string, our data enforces that of the episode date (ex.
 *                               "July 13, 2012")
 * @param {STRING} docUID        The CAMM UID for the PDF attached to the episode in question.
 * @param {NUMBER} docLen        The length of the PDF document.
 * @param {STRING} classOverride The CSS class to associate with the episode's div.
 * @returns {STRING}             The generated DIV's HTML code.
 */
CardiologyDevice_o2Component.prototype.constructSingleEpisode = function (serialID, episodeLabel, docUID, docLen, classOverride) {
    var pdfImage = "";

    // hook up the method to display a pdf on a click later; store off the docuid for now
    if (typeof docUID !== "undefined" && docUID !== "") {
        this.elementToDocUID[serialID] = {
            DocUID: docUID,
            DocLen: docLen
        };
        pdfImage = " <img src='" + this.staticImagePath + "/EKG_icon.png'></img>";
    }

    // a jquery object is used to sanitize the input parameters
    // e.g. passing in "</div>" for episodeLabel would break the component's DOM structure
    return $("<div></div>")
        .addClass(classOverride)
        .attr("id", serialID)
        .append(episodeLabel)
        .append(pdfImage)[0].outerHTML;
};

/**
 * Generates the HTML for the "Historical Interrogations" panel.
 * @param {STRING} HistoricalLabel The text label to set at the very top of the panel.
 * @returns {STRING} The HTML for the "Historical Interrogations" panel.
 */
CardiologyDevice_o2Component.prototype.constructHistoricalEpisodesList = function (HistoricalLabel) {
    var opHTML = "";

    opHTML +=
        "<div class='cdc2-sticky-labels'>" +
            "<div class='cdc2-sticky-historical-label'>" + HistoricalLabel + "</div>" +
        "</div>" +
        "<div class='cdc2-lower-historical-interrogation-contents'>" +
            this.constructInterrogationList(0, this.PMkrData.SESSION_EPISODE_HIERARCHY) +
        "</div>";

    return opHTML;
};

/**
 * Generates the HTML for a group of interrogations and episodes.
 * @param {NUMBER} deviceIdx The zero-based index of the device to construct the interrogations and episodes for
 * i.e. zero is the "active device", anything greater than zero will be a "historical device".
 * @param {OBJECT} sessEpStructure A grouping of episodes and interrogations such that an interrogation contains
 * zero or many episodes.
 * @returns {STRING} The HTML for a group of interrogations and episodes.
 */
CardiologyDevice_o2Component.prototype.constructInterrogationList = function(deviceIdx, sessEpStructure) {
    var opHTML = "",
        epIdx,
        sessIdx,
        serialIDLabel,
        activeSession,
        actSessEpisodes,
        currEpisode;

    // iterate through the sessions
    for (sessIdx = 0; sessIdx < sessEpStructure.length; sessIdx++) {
        //  STRING of created SerialID for each Session (and the prefix for child episodes)
        serialIDLabel = this.leadZero(deviceIdx * 100 + sessIdx, 100);
        //  OBJECT acting a proxy pointer to the Session currently being iterated past
        activeSession = sessEpStructure[sessIdx];
        //  ARRAY acting a proxy pointer to the Current Session's Episode collection
        actSessEpisodes = activeSession.EPISODE_LIST;

        if (typeof activeSession.SESSION_DOCS !== "undefined") {
            this.sessionToDocUID.push({
                nodeName: "cdc2-historical-interrogations-" + serialIDLabel,
                docUID: activeSession.SESSION_DOCS[0].DOC_UID,
                docLen: activeSession.SESSION_DOCS[0].DOC_LEN
            });
        }

        //  begin unique session div
        opHTML +=
            "<div id='cdc2-historical-interrogations-" + serialIDLabel + "' class='cdc2-historical-interrogations'>" +
            "   <div class='cdc2-expColCarrot " + //  BEGIN TOGGLE ARROW BUTTON
            (sessIdx === 0 ? "expanded" : "collapsed") + "'>" + //  Note the Expanded/Collapsed state: only in the FIRST interrogation (of sessIdx) is it expanded
            "   </div>" + // END TOGGLE ARROW BUTTON
            "<span>" + activeSession.SESSION_NAME + "</span>"; //  The Session's Output Name is the same as its DETECTION_DT

        // if there are child episodes
        if (actSessEpisodes.length > 0) {
            // begin episode div
            opHTML +=
                "<div id='cdc2-historical-interrogations-" + serialIDLabel +
            "Children' class='InterrogationChildrenPanel" + //      (Note that this is a containment panel only: no text, no events attached)
                (sessIdx === 0 ? "" : " cdc2-hidden-data") + "'>"; // also note that default behavior of all but the first grouping is to start off hidden

            // iterate through each episode in the sesion
            for (epIdx = 0; epIdx < actSessEpisodes.length; epIdx++) {
                //    OBJECT acting a proxy pointer to the Episode currently being iterated past
                currEpisode = actSessEpisodes[epIdx];

                // if we've hit the 5 results mark...
                if (epIdx === 5) {
                    // ...add a "Show More" button...
                    opHTML +=
                        this.constructMoreButton(
                            "HIIMoreButton" + serialIDLabel,
                            this.i18n.SHOW_ALL + " (" + actSessEpisodes.length + ")");

                    // ...and begin show more div and create the opening tag for the "show more" panel
                    opHTML += "<div id='HII" + serialIDLabel + "MoreRecords' class='cdc2-hidden-data'>";
                }

                // return a clickable entry for each child Episode in the current session
                //  note that we're stringing TWO Serials together here: 004001, 004002, etc.)
                opHTML +=
                    this.constructSingleEpisode(
                        "cdc2-historical-ep-" + serialIDLabel + this.leadZero(deviceIdx * 100 + epIdx, 100),
                        "<b>" + currEpisode.TYPE_DISP + "</b> " + currEpisode.DETECTION_DT,
                        currEpisode.DOC_UID,
                        currEpisode.DOC_LEN,
                        "cdc2-historical-interrogations");
            }
            //  end children div *or* show more div (depending on whether or not the episode count > 5)
            opHTML += "</div>";
        }

        // if there were more than 5 children (we had a "More" Panel opened up top)...
        if (epIdx > 5) {
            // ...end "more" div - add another div closure to the stack
            opHTML += "</div>";
        }
        // end unique session div
        opHTML += "</div>";
    }

    return opHTML;
};

/**
 * Constructs the HTML for "historical devices" for the panel on the left side of the component.
 * @param {DEVICE[]} historicalDeviceData A list of historical devices.
 * @returns {STRING} The HTML for "historical devices" for the panel on the left side of the component.
 */
CardiologyDevice_o2Component.prototype.constructHistoricalDevicesList = function(historicalDeviceData) {
    var listHTML = "",
        deviceIdx;

    if (historicalDeviceData.length > 0) {
        listHTML += "<div class='cdc2-sticky-historical-label'>" + this.i18n.HISTORICAL_DEVICES + "</div>";
        for (deviceIdx = 0; deviceIdx < historicalDeviceData.length; deviceIdx++) {
            listHTML += this.constructHistoricalDevice(deviceIdx, historicalDeviceData[deviceIdx]);
        }
    }

    return listHTML;
};

/**
 * Constructs the HTML for the "device info" panel for a
 * single "historical device" for the panel on the left side of the component.
 * @param {NUMBER} deviceIdx The zero-based index of the historical device.
 * @param {DEVICE} historicalDeviceData A single historical device.
 * @returns {STRING} The HTML for the "device info" panel for a
 * single "historical device" for the panel on the left side of the component.
 */
CardiologyDevice_o2Component.prototype.constructHistoricalDevice = function(deviceIdx, historicalDeviceData) {
    var listHTML = "",
        modeHTML = "";

    // the device mode in the brady settings may not always be here
    if (historicalDeviceData.BRADY_SETTINGS[0] && historicalDeviceData.BRADY_SETTINGS[0].MODE_DISP) {
        modeHTML =
            "   <div>" +
                this.i18n.DEVICE_MODE + ": " + historicalDeviceData.BRADY_SETTINGS[0].MODE_DISP +
            "   </div>";
    }

    listHTML +=
        "<div class='cdc2-historical-device-header'>" +
        "   <div class='cdc2-historical-device-model'>" +
            historicalDeviceData.MANUFACTURER_DISP + " " + historicalDeviceData.MODEL_IDENT + " (" + this.i18n.INACTIVE + ")" +
        "   </div>" +
        "   <div>" +
            this.i18n.PACEMAKER_SN + ": " + historicalDeviceData.SERIAL_TXT +
        "   </div>" +
            modeHTML +
        "   <div class='cdc2-historical-device-implant'>" +
            this.i18n.IMPLANTED + ": " + this.cclDateToJSDate(historicalDeviceData.IMPLANT_DT_TM, "longDate") +
        "   </div>" +
        "</div>" +
        "<div class='cdc2-lower-historical-interrogation-contents'>" +
            this.constructInterrogationList(deviceIdx + 1, historicalDeviceData.SESSION_EPISODE_HIERARCHY) +
        "</div>";

    return listHTML;
};

/**
 * Used when the "SHOW ALL REMAINING..." button is clicked, this function slides the child episodes
 * whose count exceeds 5 (the maximum default displayed for any parent) into view, while
 * simultaneously hiding the "Show All" button. Additionally, forces the collapse of all other open
 * "Show All" panels AND all other expanded trees.
 *
 * @param    {OBJECT}  eventData         The button object (passed in as <code>this</code> during the
 *                                       call) that is being clicked upon to trigger this function
 * @returns  {BOOLEAN}                   Returns true/false based upon the successful execution of
 *                                       the function. This value does not reflect any input or
 *                                       output data.
 * @example
 * <div id="SLVMoreButton" onClick="showRemaining(this, 'SLV');">Show All Remaining <b>7</b> Episodes</div>
 * <div id="SLVMoreRecords" class="cdc2-hidden-data">... HIDDEN RECORDS ...</div>
 */
CardiologyDevice_o2Component.prototype.showRemaining = function (eventData) {
    var $triggerObj,
        $targetDivObj;

    if (typeof eventData.data.triggerObj === "undefined") { // ERROR HANDLING: IF WE'RE MISSING OUR OBJECT OR ID PREFIX...
        return false;
    }
    // $OBJECT created off the base triggerObj OBJECT to utilize jQuery animations
    $triggerObj = $(eventData.data.triggerObj);
    // $OBJECT representing the button clicked to "SHOW ALL"
    $targetDivObj = $("#" + eventData.data.triggerObj[0].id.replace("MoreButton", "") + "MoreRecords");
    // Slide the Show All button up into non-existence
    $triggerObj.slideUp(500);
    // Slide the Episodes (whose count was over 5) into visibility, showing them all
    $targetDivObj.slideDown(500);
    // Replace the hitherto-hidden records' container's class from Hidden to Revealed
    $targetDivObj.removeClass("cdc2-hidden-data").addClass("cdc2-revealed-data");
    return true;
};

/**
 * Expands and collapses the toggle-state of the Arrow (or +/- button, depending on CSS) next to a
 * given record.
 *
 * @param {OBJECT} eventData  The expand/collapse arrow button object (passed in as <code>this</code>
 *                            during the call) that is being clicked upon to trigger this function.
 * @returns {BOOL}            False if there was a problem
 * @returns {UNDEFINED}       Nothing
 * @example
 * <div class="expanded" onclick="toggleExpand(this)"></div>
 */
CardiologyDevice_o2Component.prototype.toggleExpand = function (eventData) {
    var newButtonClass,
        $targetObject,
        triggerObj,
        $triggerObj;

    if (typeof eventData === "undefined") {
        return false;
    } // ERROR HANDLING: ABORT IF WE'RE MISSING OUR OBJECT
    if (typeof eventData.data.triggerObj === "undefined" || typeof eventData.data.relatedDIV === "undefined") {
        return false;
    } // ERROR HANDLING: ABORT IF WE'RE MISSING OUR OBJECT
    // Retrieve the Carrot object from the provided eventData object
    $triggerObj = eventData.data.triggerObj;
    // Derive the vanilla HTML object from the jQuery one.
    triggerObj = $triggerObj[0];
    // $OBJECT representing the child (containment DIV)
    $targetObject = eventData.data.relatedDIV;

    if (triggerObj.className.toLowerCase() === "cdc2-expcolcarrot expanded") { // IF the expand/contract arrow is currently expanded (We
        // need to CONTRACT)...
        //  ... update the proxy string we'll use to change the arrow to collapsed...
        newButtonClass = "cdc2-expColCarrot collapsed";
        //  ... slide the child content up into themselves, then add on the "Hidden" class
        $targetObject.slideUp(500, function () {
            $targetObject.addClass("cdc2-hidden-data");
        });
    } else { // OTHERWISE (We need to EXPAND)...
        //  ... update the proxy string we'll use to change the arrow to expanded...
        newButtonClass = "cdc2-expColCarrot expanded";
        //  ... slide the hidden content into view, then remove the "Hidden" class
        $targetObject.slideDown(500, function () {
            $targetObject.removeClass("cdc2-hidden-data");
        });
    } // END IF
    // Toggle the Expand/Contract arrow by replacing its current class with our proxy
    $triggerObj.removeClass(triggerObj.className).addClass(newButtonClass);
};

/**
 * Generates the HTML code for a single "Show More Results" button instance to the "Since Last Visit"
 * panel
 *
 * @param {STRING}   ButtonID         The ID of the "Show More" button being generated. Generally,
 *                                    where applicable, we're suffixing it with its parent's
 *                                    serialization id (ex. "MoreButton001")
 * @param {STRING}   ButtonLabel      The label of the Button to be clicked to load the hidden data
 *                                    (child instances exceeding 5 in count)
 * @returns {STRING}                  The generated DIV's HTML code. When there are more than 5 data
 *                                    for a given parent, a "More" button is inserted which expands
 *                                    the group
 * @example
 * constructedHTML += constructMoreButton("MoreButton001", "Show Remaining <b>5</b> Episodes", "SLV");
 */
CardiologyDevice_o2Component.prototype.constructMoreButton = function (ButtonID, ButtonLabel) {
    // a jquery object is used to sanitize the input parameters
    // e.g. passing in "</div>" for ButtonLabel would break the component's DOM structure
    return $("<div></div>")
        .addClass("cdc2-more-button")
        .attr("id", ButtonID)
        .append(ButtonLabel)[0].outerHTML;
};

/**
 * Generates the HTML code for the "Since Last Visit" panel
 *
 * @param {STRING} TopLabel The label for "Since Last Visit panel" contained within the sticky DIV (the absolutely-positioned,
 * non-moving one) when clicked, will scroll the panel to the top of the view (see {@link scrollMenuTo})
 * @returns {STRING} The generated panel's HTML code
 * @example
 * constructedHTML += constructTopEpisodesList("Events since last visit (12)");
 */
CardiologyDevice_o2Component.prototype.constructTopEpisodesList = function (TopLabel) {
    var opHTML = "",
        episodeIdx,
        activeEpisode,
        activeEpisodes = this.PMkrData.TOP_EPISODE_LIST,
        episodeHTML,
        $topLabel = $("<div></div>")
            .addClass("cdc2-sticky-top-label")
            .append(TopLabel);

    // Constuct Sticky Top Label (always the same except for the label)
    opHTML += "<div class='cdc2-sticky-labels'>" + $topLabel[0].outerHTML + "</div>";
    // Constuct the episode list for the top panel
    opHTML += "<div class='cdc2-top-episodes-contents'>";
    // Open the panel that will hold ALL of the top contents
    // iterate through the episodes
    for (episodeIdx = 0; episodeIdx < activeEpisodes.length; episodeIdx++) {
        activeEpisode = activeEpisodes[episodeIdx];

        // Serialize the innermost iterative for an ID for the episode controls
        episodeHTML = this.constructSingleEpisode(
            "cdc2-slv-ep-" + this.leadZero(episodeIdx, 100),
            "<b>" + activeEpisode.TYPE_DISP + "</b> " + activeEpisode.DETECTION_DT,
            activeEpisode.DOC_UID,
            activeEpisode.DOC_LEN,
            "cdc2-since-last-visit-episode");

        // if it's still within the first five iterations, add the episode to the stack.
        if (episodeIdx < 5) {
            opHTML += episodeHTML;
        } else {
            // if we're at exactly 5...
            if (episodeIdx === 5) {
                // ...add a "More" button to the stack...
                opHTML += this.constructMoreButton("SLVMoreButton", this.i18n.SHOW_ALL + " (" + activeEpisodes.length + ")");
                // and to add the hidden panel (to contain records 6+)
                opHTML += "<div id='SLVMoreRecords' class='cdc2-hidden-data'>";
            }
            // add the episode to the stack.
            opHTML += episodeHTML;
            // if it's the LAST episode, close off the hidden panel
            if (episodeIdx >= activeEpisodes.length - 1) {
                opHTML += "</div>";
            }
        }
    }

    // Close off the ALL-Top-Contents panel
    opHTML += "</div>";

    return opHTML;
};

/**
 * Generates the HTML code for the Interrogation/Episode Scrolling Treeview Side Panel
 *
 * @returns {STRING} The generated panel's HTML code
 * @example
 * constructedHTML += constructSidePanel();
 */
CardiologyDevice_o2Component.prototype.constructSidePanel = function () {
    var opHTML;

    // Create a blank string that will ultimately contain all of the side panel's constructed HTML
    opHTML = "";
    opHTML += "<div class='cdc2-scrollable-interrogations'>";
    // Construct the "Since Last Visit" panel's HTML
    opHTML += this.constructTopEpisodesList(this.i18n.EPISODES_SINCE_LAST_VISIT + " (" + this.PMkrData.TOP_EPISODE_LIST.length + ")");
    // Construct the "Historical Interrogations" panel's HTML
    opHTML += this.constructHistoricalEpisodesList(this.i18n.HISTORICAL_INTERROGATIONS + " (" + this.PMkrData.SESSION_EPISODE_HIERARCHY.length + ")");
    opHTML += this.constructHistoricalDevicesList(this.histPMkrData);
    opHTML += "</div>";

    return opHTML;
};

/**
 * Generates the HTML code for the PDF Viewer Section of the Cardiology Component.
 *
 * Note:- Based on whether component running on powerchart or not, this function will generate
 * different HTML Code. HTML Code for powerchart will contain the custom made navigation toolbar
 * for PDF viewer. When in a browser, the controls for browser's built-in PDF viewer will be
 * used to navigate through the PDF.
 *
 * @param {STRING} PDFTitle The string to display as the title in the PDF viewer panel.
 * @returns {STRING} The generated PDF Viewer Panel
 */
CardiologyDevice_o2Component.prototype.constructPDFViewerPanel = function (PDFTitle) {
    var opHTML = "",
        $pdfTitle = $("<div></div>")
            .append(PDFTitle);

    if (CERN_Platform.inMillenniumContext()) {
		//In powerchart
        opHTML += "	<div id='cdc2-viewing-aperture'>" +
		"				<div id='cdc2-pdf-control-bar'>" +
		"					<table>" +
		"						<tr>" +
        "							<td id='cdc2-pdf-control-label'>" + $pdfTitle[0].outerHTML + "</td>" +
		"							<td id='cdc2-pdf-control-pgs'>" +
		"								<input id='cdc2-pdf-control-pref-page' class='cdc2-pdf-control-pref-page-disabled' type='button' alt='" + this.i18n.PREVIOUS_PAGE + "' title='" + this.i18n.PREVIOUS_PAGE + "'/>" +
		"								<input id='cdc2-pdf-control-next-page' class='cdc2-pdf-control-next-page-disabled' type='button' alt='" + this.i18n.NEXT_PAGE + "' title='" + this.i18n.NEXT_PAGE + "'/>" + "                    " + this.i18n.PAGE +
		"								<input type='text' id='cdc2-page-x-of-y-label' value='1' style='width:20px;' /> " + this.i18n.OF +
		"									 <b><span id='cdc2-indicator-total-pages'>" + 1 + "</span></b>" +
		"							</td>" +
		"							<td id='cdc2-pdf-control-btns'>" +
		"								<div class='cdc2-pdf-control-button-spacer'>" +
		"									<input id='cdc2-button-print-pdf' type='button' title='" + this.i18n.PRINT_THIS_PDF + "' alt='" + this.i18n.PRINT_THIS_PDF + "'/>" +
		"								</div>" +
		"								<div class='cdc2-pdf-control-button-spacer'>" +
		"									<input id='cdc2-button-new-window-pdf' type='button' title='" + this.i18n.OPEN_IN_NEW_WINDOW + "' alt='" + this.i18n.OPEN_IN_NEW_WINDOW + "'>" +
		"								</div>" +
		"								<div class='cdc2-pdf-control-button-spacer'>" +
		"									<input id='cdc2-forward-pdf-for-endorsement' type='button' title='" + this.i18n.SEND_FOR_ENDORSEMENT + "' alt='" + this.i18n.SEND_FOR_ENDORSEMENT + "'/>" +
		"							</td>" +
		"						</tr>" +
		"					</table>" +
		"				</div>" + this.generateScrollingPDFViewer() +
		"			</div>";
    } else {
		//Outside Powerchart
        opHTML += "	<div id='cdc2-viewing-aperture'>" +
        "    			<div id='cdc2-pdf-control-bar'>" +
        "        			<table>" +
        "            			<tr>" +
        "                			<td id='cdc2-pdf-control-label'>" + $pdfTitle[0].outerHTML + "</td>" +
        "                			<td id='cdc2-pdf-control-btns'>" +
        "                    			<div class='cdc2-pdf-control-button-spacer'>" +
        "                        			<input id='cdc2-forward-pdf-for-endorsement' type='button' title='" + this.i18n.SEND_FOR_ENDORSEMENT + "' alt='" + this.i18n.SEND_FOR_ENDORSEMENT + "'/>" +
        "                			</td>" +
        "            			</tr>" +
        "        			</table>" +
        "    			</div>" + this.generateScrollingPDFViewer() +
		"			</div>";
    }
    return opHTML;
};

/**
 * Generates the HTML code for the document viewer inside the PDF Viewer Panel of the Cardiology Component.
 *
 * Note:- Based on whether component running on powerchart or not, this function will generate
 * different HTML Code. HTML Code for powerchart contains the activeX object created to display
 * document viewer. Where as for browser, HTML Code will contain iframe and PDF document will
 * display using browser default PDF viewer.
 *
 * @returns {STRING} The generated HTML for document viewer
 */
CardiologyDevice_o2Component.prototype.generateScrollingPDFViewer = function () {
    var opHTML;

    opHTML = "";

    if (CERN_Platform.inMillenniumContext()) {
		//in powerchart
        opHTML += "	<div id='cdc2-overflow-container'>" +
		" 				<div id='cdc2-scrollPadder'>" +
		" 					<div id='cdc2-floating-page-arrow'>Page 1</div>" +
		"					<div id='cdc2-pdf-renderer-0' class='cdc2-pdf-renderer'>" +
		"						<div class='ToBeReplacedWithPDF'><OBJECT ID='cdc2-document-viewer-activeX-0' class='cdc2-document-viewer-activeX-hidden' CLASSID='clsid:BC7990A8-52CB-40B2-9E6C-CF0757D4D820' CODEBASE=''></OBJECT></div>" +
		"					</div>" +
		"				</div>" +
		"			</div>";
    } else {
        opHTML += "	<div id='cdc2-overflow-container'>" +
        "				<div id='cdc2-scrollPadder'>" +
        "					<div id='cdc2-floating-page-arrow'>Page 1</div>" +
        "					<div id='cdc2-pdf-renderer-0' class='cdc2-pdf-renderer'>" +
        "						<div id='cdc2-document-viewer-activeX-0' class='cdc2-document-viewer-activeX-hidden'>" +
        "     					</div>" +
        "					</div>" +
        " 				</div>" +
        "			</div>";
    }
    return opHTML;
};

CardiologyDevice_o2Component.prototype.retrieveComponentData = function () {
    var component = arguments[0] ? arguments[0] : this;
    var criterion = component.getCriterion();
    //Allow passing component as parameter if "this" isn't the component in caller's context.
    //Ajax call to CCL to get pacemaker data and gain customized control even if no results found
    var request = new ComponentScriptRequest();
    var loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), criterion.category_mean);
    //Use timer name, as this is the main load of the component.
    request.setProgramName("PEX_GET_ICD_INFO");
    //Gets attributes describing settings, measurements, statistics, episodes, sessions, and lead information
    //for a person's pulse generator
    //Parameters:
    //person-id, date range (e.g., look back 18 months, up to present (0))
    //One vs. zero according to following list:
    //1 to retrieve device settings information.
    //0 to not retrieve device leads information.
    //1 to retrieve information about episodes.
    //1 to retrieve information about sessions.
    //0 to not retrieve statistical information.
    //1 to retrieve device measurements.
    request.setParameterArray(["^MINE^", component.getCriterion().person_id + ".00", "^18,m^", "^^", "1", "0", "1", "1", "0", "1"]);
    request.setAsyncIndicator(true);
    request.setComponent(this);
    request.setLoadTimer(loadTimer);
    request.setResponseHandler(function(scriptReply) {
        component.handleLoad(scriptReply);
    });
    request.performRequest();
    //Handles request and returns custom control
};

/**
 * Displays the specified tooltip at the specified coordinates.
 * @param {object} eventData Information about the tooltip to display.
 * @param {number} eventData.pageX The x coordinate to display the tooltip.
 * @param {number} eventData.pageY The y coordinate to display the tooltip.
 * @param {tooltip} eventData.data.tooltip The tooltip member to perform the operation on.
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.prototype.showHoverData = function (eventData) {
    eventData.data.tooltip
        .setX(eventData.pageX)
        .setY(eventData.pageY)
        .show();
};

/**
 * When the 0th index of the dropdown menu is clicked, construct the manage devices dialog and
 * hook up the proper events.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.enableManageDevicesMenuItem = function() {
    var manageDevices = this.getMenu().m_menuItemArr[0],
        thisComponent = this;

    manageDevices.setIsDisabled(false);

    manageDevices.setClickFunction(function() {
        var manageDevicesDialogId = thisComponent.getManageDevicesDialogId(),
            applyButton,
            cancelButton,
            manageDevicesDialog = MP_ModalDialog.modalDialogObjects[manageDevicesDialogId],
            $pdfViewer = $("#" + thisComponent.m_rootComponentNode.id + " .cdc2-pdf-renderer"),
            manageDevicesHtml = thisComponent.constructDeviceManagement();

        // hide the pdf viewer. the control won't abide by z-index, so this is to prevent
        //  the dialog from popping up behind the pdf viewer.
        $pdfViewer.hide();

        // only construct the modal dialog if needed
        if (manageDevicesDialog === undefined) {
            applyButton = new ModalButton("cdc2-apply-changes");
            cancelButton = new ModalButton("cdc2-cancel-changes");
            manageDevicesDialog = new ModalDialog(manageDevicesDialogId);

            applyButton
                .setText(i18n.discernabu.cardiology_device_integration_detail_o2.SUBMIT)
                .setIsDithered(false)
                .setCloseOnClick(true)
                .setFocusInd(true)
                .setOnClickFunction(function() {
                    var personId = thisComponent.getCriterion().person_id,
                        deviceIdx,
                        associateDeviceCount = thisComponent.devicesToAssociate.length,
                        disassociateDeviceCount = thisComponent.devicesToDisassociate.length;

                    if (associateDeviceCount !== 0 || disassociateDeviceCount !== 0) {
                        // associate all the devices to associated
                        for (deviceIdx = 0; deviceIdx < associateDeviceCount; deviceIdx++) {
                            thisComponent.updateDeviceAssociation(thisComponent.devicesToAssociate[deviceIdx], personId, undefined, false);
                        }

                        // disassociate all the devices that need to be disassociated
                        for (deviceIdx = 0; deviceIdx < disassociateDeviceCount; deviceIdx++) {
                            thisComponent.updateDeviceAssociation(thisComponent.devicesToDisassociate[deviceIdx], 0, undefined, false);
                        }

                        // clear out the devices to associate/disassociate
                        thisComponent.devicesToAssociate = [];
                        thisComponent.devicesToDisassociate = [];

                        thisComponent.refreshComponent();
                    }

                    // be sure to show the pdf viewer again
                    $pdfViewer.show();
                });

            cancelButton
                .setText(i18n.discernabu.cardiology_device_integration_detail_o2.CANCEL)
                .setIsDithered(false)
                .setCloseOnClick(true)
                .setOnClickFunction(function () {
                    // clear out the devices to associate/disassociate
                    thisComponent.devicesToAssociate = [];
                    thisComponent.devicesToDisassociate = [];

                    // be sure to show the pdf viewer again
                    $pdfViewer.show();
                });

            manageDevicesDialog
                .setLeftMarginPercentage(20)
                .setRightMarginPercentage(20)
                .setTopMarginPercentage(20)
                .setBottomMarginPercentage(20)
                .setHeaderTitle(i18n.discernabu.cardiology_device_integration_detail_o2.MANAGE_DEVICES)
                .setIsBodySizeFixed(false)
                .setIsFooterAlwaysShown(true)
                .addFooterButton(applyButton)
                .addFooterButton(cancelButton)
                .setShowCloseIcon(true)
                .setHeaderCloseFunction(function () {
                    // clear out the devices to associate/disassociate
                    thisComponent.devicesToAssociate = [];
                    thisComponent.devicesToDisassociate = [];

                    // be sure to show the pdf viewer again
                    $pdfViewer.show();
                });

            MP_ModalDialog.addModalDialogObject(manageDevicesDialog);
        }

        MP_ModalDialog.showModalDialog(manageDevicesDialogId);
        manageDevicesDialog.setBodyHTML(manageDevicesHtml);
        thisComponent.setDeviceManagementEvents($("#" + manageDevicesDialog.getBodyElementId()));
    });
};

/**
 * Construct the HTML for the manage devices dialog.
 * @returns {STRING} The HTML for the manage devices dialog.
 */
CardiologyDevice_o2Component.prototype.constructDeviceManagement = function() {
    var manageDevicesHtml = "";

    manageDevicesHtml += this.constructDeviceManagementDisassociation(this.getDevicePIDs());
    manageDevicesHtml += this.constructDeviceManagementAssociation();

    return manageDevicesHtml;
};

/**
 * Construct the HTML for the disassociate device section of the device management dialog.
 * @param {DevicePID[]} devices An array of devices currently associated to the patient, both current and historical.
 * @returns {STRING} The HTML for the disassociate device section of the device management dialog.
 */
CardiologyDevice_o2Component.prototype.constructDeviceManagementDisassociation = function(devices) {
    var diassociationHtml = "",
        deviceCount = devices.length,
        deviceIdx;

    diassociationHtml +=
        "<div class='cdc2-manage-dev-disassociation'>" +
        "   <div class='cdc2-search-device-label'>" +
                i18n.discernabu.cardiology_device_integration_detail_o2.PATIENT_DEVICES +
        "   </div>" +
        "   <div class='cdc2-manage-dev-disassociation-devices'>";

    for (deviceIdx = 0; deviceIdx < deviceCount; deviceIdx++) {
        diassociationHtml += this.constructDevicePanel(devices[deviceIdx], i18n.discernabu.cardiology_device_integration_detail_o2.DISASSOCIATE, undefined, true);
    }

    diassociationHtml +=
        "   </div>" +
        "</div>";

    return diassociationHtml;
};

/**
 * Return the HTML for the associate device section of the device management dialog.
 * @returns {STRING} The HTML for the associate device section of the device management dialog.
 */
CardiologyDevice_o2Component.prototype.constructDeviceManagementAssociation = function() {
    var associationHtml = "";

    associationHtml +=
        "<div class='cdc2-manage-dev-association'>" +
            this.constructDeviceSearch("cdc2-search-device-content-manage-dev") +
            this.constructDeviceManagementAssistedAssociation() +
        "</div>" +
        "<div class='cdc2-clear-columns'></div>";

    return associationHtml;
};

/**
 * Return the HTML for the assisted search container. The HTML for the search results will be appended to the container asynchronously.
 * @returns {STRING} The container that will be filled with the search results after the search results are retrieved.
 */
CardiologyDevice_o2Component.prototype.constructDeviceManagementAssistedAssociation = function() {
    var thisComponent = this,
        containerClass = "cdc2-manage-dev-assisted";

    this.getSuggestedDevicesToAssociate(this.getCriterion().person_id, function(scriptReply) {
        var $deviceManagement = $("div#" + thisComponent.getManageDevicesDialogId() + "body"),
            $assistedContainer = $deviceManagement.find("div." + containerClass),
            assistedContainerHtml = "",
            scriptStatus = scriptReply.getStatus();

        $assistedContainer.empty();
        if (scriptStatus === "S") {
            assistedContainerHtml +=
                "<div class='cdc2-search-device-label'>" +
                    i18n.discernabu.cardiology_device_integration_detail_o2.POSSIBLE_MATCHES +
                "</div>" +
                "<div class='cdc2-suggested-matches'>" +
                    thisComponent.populateSuggestedMatches(scriptReply, true) +
                "</div>";
            $assistedContainer.append(assistedContainerHtml);
            $assistedContainer.find(".cdc2-manage-dev-undo").hide();
            thisComponent.setDeviceManagementAssistedAssociationEvents($assistedContainer, $deviceManagement.find(".cdc2-manage-dev-disassociation"));
        } else if (scriptStatus === "Z") {
            assistedContainerHtml +=
                "<div class='cdc2-search-device-label'>" +
                    i18n.discernabu.cardiology_device_integration_detail_o2.NO_DEVICE +
                    "<br/>" +
                    i18n.discernabu.cardiology_device_integration_detail_o2.NO_DEVICE_1 +
                "</div>";
            $assistedContainer.append(assistedContainerHtml);
        } else {
            logger.logScriptCallError(this, scriptReply, "cardiology-device-detail-o2.js", "constructDeviceManagementAssistedAssociation");
        }
    });

    return "<div class='" + containerClass + "'></div>";
};

/**
 * Sets the events for all elements in the device management dialog.
 * @param {jQuery} $deviceManagement A jQuery object of the entire dialog.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.setDeviceManagementEvents = function ($deviceManagement) {
    this.setDeviceManagementDisassociationEvents($deviceManagement.find(".cdc2-manage-dev-disassociation"));
    this.setDeviceManagementAssociationEvents($deviceManagement.find(".cdc2-search-device-content-manage-dev"), $deviceManagement.find(".cdc2-manage-dev-assisted"));
};

/**
 * Sets the events for all elements in the device disassociation section of the device management dialog.
 * @param {jQuery} $disassociation A jQuery object of the device disassociation section of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.setDeviceManagementDisassociationEvents = function ($disassociation) {
    var thisComponent = this,
        $disassociateButtons = $disassociation.find(".cdc2-associate-device-button"),
        disassociateButtonCount = $disassociateButtons.length,
        disassociateButtonIdx,
        pulseGenIdKey = "pulseGenId";

    // attach the device ids to the buttons' data elements
    for (disassociateButtonIdx = 0; disassociateButtonIdx < disassociateButtonCount; disassociateButtonIdx++) {
        if (disassociateButtonIdx === 0) {
            $disassociateButtons.eq(disassociateButtonIdx).data(pulseGenIdKey, this.PMkrData.PULSE_GEN_ID);
        } else {
            $disassociateButtons.eq(disassociateButtonIdx).data(pulseGenIdKey, this.histPMkrData[disassociateButtonIdx - 1].PULSE_GEN_ID);
        }
    }

    $disassociateButtons.click(function () {
        $disassociateButtons = $(this);

        if ($disassociateButtons.val() === i18n.discernabu.cardiology_device_integration_detail_o2.DISASSOCIATE) {
            thisComponent.addDeviceToDisassociate($disassociateButtons.data(pulseGenIdKey));
            $disassociateButtons.attr("value", i18n.discernabu.cardiology_device_integration_detail_o2.UNDO);
        }
        else {
            thisComponent.removeDeviceToDisassociate($disassociateButtons.data(pulseGenIdKey));
            $disassociateButtons.attr("value", i18n.discernabu.cardiology_device_integration_detail_o2.DISASSOCIATE);
        }
    });
};

/**
 * Sets the events for all elements in the device association section of the device management dialog.
 * @param {jQuery} $manualAssociation A jQuery object of the manual association part of the device management dialog.
 * @param {jQuery} $assistedAssociation A jQuery object of the assisted association part of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.setDeviceManagementAssociationEvents = function ($manualAssociation, $assistedAssociation) {
    var $manualSearchButton = $manualAssociation.find(".cdc2-find-device-btn");

    this.setDeviceManagementManualAssociationEvents($manualAssociation);

    // when a manual search is issued, make the "assisted search" disappear
    $manualSearchButton.click(function() {
        $assistedAssociation.hide();
    });
};

/**
 * Sets the events for the manual association part of the device management dialog.
 * @param {jQuery} $manualAssociation A jQuery object of the manual association part of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.setDeviceManagementManualAssociationEvents = function ($manualAssociation) {
    var thisComponent = this;

    this.postProcessingSearchDevice(this, $manualAssociation, function(deviceId, reply) {
        var $associationButton = $manualAssociation.find(".cdc2-associate-device-button"),
            $disassociation = $("div#" + thisComponent.getManageDevicesDialogId() + "body .cdc2-manage-dev-disassociation"),
            $undoButton,
            $devicePanel,
            deviceInfo,
            devicePID;

        // did this get associated via an "associate anyway"? there won't be an association button if that's the case
        if ($associationButton.length === 0) {
            // since a device card doesn't exist, one will have to be constructed before moving it to the other side of the dialog
            deviceInfo = reply.getResponse().PULSE_GENS[0];
            devicePID = {
                NAME_FULL_FORMATTED: deviceInfo.NAME_FULL_FORMATTED,
                SEX_CDF: deviceInfo.SEX_CDF,
                BIRTH_DT_TM_TXT: deviceInfo.BIRTH_DT_TM_TXT,
                SERIAL_TXT: deviceInfo.SERIAL_TXT
            };

            $devicePanel = $(thisComponent.constructDevicePanel(devicePID, i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE, undefined, true));
            $associationButton = $devicePanel.find(".cdc2-associate-device-button");
            $manualAssociation.find(".cdc2-search-results").empty();
        }

        $associationButton.data("pulseGenId", deviceId);
        if ($associationButton.val() === i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE) {
            thisComponent.onClickDeviceManagementAssociationButton($associationButton, $disassociation);
            $undoButton = $associationButton;
            $undoButton.click(function() {
                thisComponent.onClickDeviceManagementUndoButton($associationButton, $manualAssociation.find(".cdc2-search-results"));
            });
        }
    });
};

/**
 * Sets the events for the assisted association part of the device management dialog.
 * @param {jQuery} $assistedAssociation A jQuery object of the assisted association part of the device management dialog.
 * @param {jQuery} $disassociation A jQuery object of the disassociation part of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.setDeviceManagementAssistedAssociationEvents = function ($assistedAssociation, $disassociation) {
    var thisComponent = this,
        $associateButtons = $assistedAssociation.find(".cdc2-associate-device-button"),
        associateButtonsCount = $associateButtons.length,
        associateButtonIdx,
        $associateButton;

    // store the pulse gen id to associate to the button's data element
    for (associateButtonIdx = 0; associateButtonIdx < associateButtonsCount; associateButtonIdx++) {
        $associateButton = $associateButtons.eq(associateButtonIdx);
        $associateButton.data("pulseGenId", this.suggestedMatchPulseGenIDs[associateButtonIdx]);
        $associateButton.click({
            scope: $associateButton,
            thisComponent: thisComponent,
            $assistedAssociation: $assistedAssociation,
            $disassociation: $disassociation
        }, thisComponent.setAssociateButtonClickHandler
        );
    }
};

/**
 * Sets the events for the associate button click within assisted association
 * @param {Object} eventData Contains reference to the assisted association dialog objects
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.setAssociateButtonClickHandler = function (eventData) {
    var $associateButton = eventData.data.scope,
        $assistedAssociation = eventData.data.$assistedAssociation,
        $disassociation = eventData.data.$disassociation,
        thisComponent = eventData.data.thisComponent;
    if ($associateButton.val() === i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE) {
        thisComponent.onClickDeviceManagementAssociationButton($associateButton, $disassociation);
    } else {
        thisComponent.onClickDeviceManagementUndoButton($associateButton, $assistedAssociation);
    }
};

/**
 * Handler for the onclick event for an "Associate" button in the device management dialog.
 * @param {jQuery} $addDeviceButton The "Associate" button.
 * @param {jQuery} $disassociation The entire disassociation panel.
 * @returns {VOID} Nothing.
 */
CardiologyDevice_o2Component.prototype.onClickDeviceManagementAssociationButton = function ($addDeviceButton, $disassociation) {
    var $devicePanel,
        selectedClass = "cdc2-manage-dev-association-selected";

    // don't bother doing anything if this device is already associated
    if ($addDeviceButton.hasClass(selectedClass) === false) {
        $devicePanel = $addDeviceButton.parents(".cdc2-search-output");

        $addDeviceButton
            .addClass(selectedClass)
            .attr("value", i18n.discernabu.cardiology_device_integration_detail_o2.UNDO);
        this.addDeviceToAssociate($addDeviceButton.data("pulseGenId"));
        $devicePanel.detach();
        $disassociation.append($devicePanel);
    }
};

/**
 * Handler for the onclick event for an "Undo" button in the device management dialog.
 * @param {jQuery} $undoButton The "Undo" button.
 * @param {jQuery} $undoTarget Where the device panel will get moved to when the undo button is clicked.
 * @returns {VOID} Nothing.
 */
CardiologyDevice_o2Component.prototype.onClickDeviceManagementUndoButton = function ($undoButton, $undoTarget) {
    var $devicePanel = $undoButton.parents(".cdc2-search-output"),
        suggestedPulseGenId = $undoButton.data("pulseGenId"),
        selectedClass = "cdc2-manage-dev-association-selected";

    $undoButton
        .removeClass(selectedClass)
        .attr("value", i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE);
    this.removeDeviceToAssociate(suggestedPulseGenId);
    $devicePanel.detach();
    $undoTarget.append($devicePanel);
};

/**
 * Add a device id to the <code>devicesToAssociate</code> array if the device isn't already in the array.
 * @param {NUMBER} deviceId The device id to add to the <code>devicesToAssociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.addDeviceToAssociate = function (deviceId) {
    this.addUniqueToArray(deviceId, this.devicesToAssociate);
};

/**
 * Remove a device id from the <code>devicesToAssociate</code> array.
 * @param {NUMBER} deviceId The device id to remove from the <code>devicesToAssociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.removeDeviceToAssociate = function (deviceId) {
    this.removeFromArray(deviceId, this.devicesToAssociate);
};

/**
 * Add a device id to the <code>devicesToDisassociate</code> array if the device isn't already in the array.
 * @param {NUMBER} deviceId The device id to add to the <code>devicesToDisassociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.addDeviceToDisassociate = function (deviceId) {
    this.addUniqueToArray(deviceId, this.devicesToDisassociate);
};

/**
 * Remove a device id from the <code>devicesToDisassociate</code> array.
 * @param {NUMBER} deviceId The device id to remove from the <code>devicesToDisassociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.removeDeviceToDisassociate = function (deviceId) {
    this.removeFromArray(deviceId, this.devicesToDisassociate);
};

/**
 * Add a value to the specified array if the value doesn't already exist.
 * @param {*} val The value to uniquely add to the array.
 * @param {*[]} arr The array to uniquely add the value to.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.addUniqueToArray = function (val, arr) {
    if ($.inArray(val, arr) === -1) {
        arr.push(val);
    }
};

/**
 * Remove a value to the specified array.
 * @param {*} val The value to remove from the array.
 * @param {*[]} arr The array to remove the value from.
 * @returns {UNDEFINED} Nothing.
 */
CardiologyDevice_o2Component.prototype.removeFromArray = function (val, arr) {
    var valIdx = $.inArray(val, arr);

    if (valIdx !== -1) {
        arr.splice(valIdx, 1);
    }
};

/**
 * Returns the id for the manage devices dialog for this component.
 * @returns {STRING} The id for the manage devices dialog for this component.
 */
CardiologyDevice_o2Component.prototype.getManageDevicesDialogId = function () {
    return this.getStyles().getNameSpace() + "manageDevices" + this.getComponentId();
};

/**
 * Disables the Manage Devices Menu in the component
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.disableManageDevicesMenuItem = function () {
    var manageDevices = this.getMenu().m_menuItemArr[0];

    manageDevices.setIsDisabled(true);
    manageDevices.setClickFunction(function () {}); //Setting IsActive to false does nothing. Just make it so when they click nothing happens.
};

/**
 * Appends all the events onto the relevant objects (required to have a truly prototypical object)
 *
 * @returns {BOOL|UNDEFINED} If <code>alreadyPostProcessed</code> is true, or <code>PMkrData</code> is empty, then false will be returned.
 * Nothing will be returned otherwise.
 */
CardiologyDevice_o2Component.prototype.postProcessing = function () {
    var $self,
        $prevPagePDFButton,
        $nextPagePDFButton,
        $printAllPDFButton,
        $openInNewWinButton,
        $currentPgNumField,
        compId,
        compNs,
        thisComponent,
        $menuItem,
        $requestForEndorsement,
        $firstEpisode,
        $firstSession,
        firstEpisodeDisplayDocArg,
        firstSessionDisplayDocArg,
        setEpisodeButtonClickEventsRetval,
        setSessionButtonClickEventsRetval,
        $modeDetail;

    if (this.alreadyPostProcessed === true) {
        return false;
    }
    this.alreadyPostProcessed = true;


    $self = $("#" + this.m_rootComponentNode.id);
    //If there is no device associated and no pacemaker data for the given patient, do nothing
    if ($.isEmptyObject(this.PMkrData) === true) {
        return false;
    }

    compId = this.getComponentId();
    compNs = this.getStyles().getNameSpace();

    thisComponent = this;

    if (thisComponent.DataLoaded) { // Menu item id matching
        this.enableManageDevicesMenuItem();
    }

    // hook up the expand/collapse functionality for sessions and episodes
    this.setShowHideClickEvents();

    // construct the document viewers
    this.documentViewer = $("#cdc2-document-viewer-activeX-0")[0];
    // a custom toolbar will be used in this component; hide the "standard" toolbar
    this.documentViewer.ShowToolBar = 0;
    this.documentViewer.ShowOutputWindow = 1;
    this.documentViewer.ImportReportType = 4;

    if (this.documentViewer.attachEvent) {
        // set up events to adjust for zoom level when a document is loaded or if the window is resized or zoomed
        this.documentViewer.attachEvent("ExecuteComplete", this.fitDocumentToContainer);
    } else {
        this.documentViewer.addEventListener("ExecuteComplete", this.fitDocumentToContainer, false);
    }
	//Send for endorsement
    $requestForEndorsement = $self.find("#cdc2-forward-pdf-for-endorsement");

    if (CERN_Platform.inMillenniumContext()) {
        // construct the PDF viewer button onclicks
        $prevPagePDFButton = $self.find("#cdc2-pdf-control-pref-page");
        $nextPagePDFButton = $self.find("#cdc2-pdf-control-next-page");
        $printAllPDFButton = $self.find("#cdc2-button-print-pdf");
        $openInNewWinButton = $self.find("#cdc2-button-new-window-pdf");
        $currentPgNumField = $self.find("#cdc2-page-x-of-y-label");
        $prevPagePDFButton.click({
            scope: this,
            documentViewer: this.documentViewer,
            prevButtonObj: $prevPagePDFButton[0],
            nextButtonObj: $nextPagePDFButton[0],
            currPgNumField: $currentPgNumField[0]
        }, this.prevPageDocument);
        $nextPagePDFButton.click({
            scope: this,
            documentViewer: this.documentViewer,
            prevButtonObj: $prevPagePDFButton[0],
            nextButtonObj: $nextPagePDFButton[0],
            currPgNumField: $currentPgNumField[0]
        }, this.nextPageDocument);
        $printAllPDFButton.click({
            scope: this,
            documentViewer: this.documentViewer,
            triggerButtonObj: $printAllPDFButton[0]
        }, this.printActivePDFDoc);
        $openInNewWinButton.click({
            scope: this,
            documentViewer: this.documentViewer,
            triggerButtonObj: $openInNewWinButton[0]
        }, this.openPDFInNewWindow);
        $currentPgNumField.keyup({
            scope: this,
            documentViewer: this.documentViewer,
            prevButtonObj: $prevPagePDFButton[0],
            nextButtonObj: $nextPagePDFButton[0],
            currPgNumField: $currentPgNumField[0]
        }, this.jumpToPage);
    }
    $requestForEndorsement.click({
        scope: this,
        compID: compId,
        compNS: compNs,
        pdfTitle: $self.find("#cdc2-pdf-control-label")
    }, this.requestForEndorsementDialog);

    // hook up the doc UIDs with the episode buttons
    setEpisodeButtonClickEventsRetval = this.setEpisodeButtonClickEvents($prevPagePDFButton, $nextPagePDFButton, $currentPgNumField);
    $firstEpisode = setEpisodeButtonClickEventsRetval.$firstEpisode;
    firstEpisodeDisplayDocArg = setEpisodeButtonClickEventsRetval.firstEpisodeDisplayDocArg;

    setSessionButtonClickEventsRetval = this.setSessionButtonClickEvents($prevPagePDFButton, $nextPagePDFButton, $currentPgNumField);
    $firstSession = setSessionButtonClickEventsRetval.$firstSession;
    firstSessionDisplayDocArg = setSessionButtonClickEventsRetval.firstSessionDisplayDocArg;

    //Using the setTimeout() function to avoid the race condition between the PDF load and the rest of the component to load
    //In this case, entire component would load and the then the PDF would load into the ActiveX control after a 400ms (0.4s) delay
    //Checking if an episode or a session has a PDF associated with it, in order to call the displayDocument function with the appropriate parameters.
    if ($firstEpisode) {
        setTimeout(function () {
            thisComponent.displayDocument({
                data: firstEpisodeDisplayDocArg
            });
        }, 400);
    } else if ($firstSession) {
        setTimeout(function () {
            thisComponent.displayDocument({
                data: firstSessionDisplayDocArg
            });
        }, 400);
    } else {
        this.hideTitleToolbar();
        $menuItem = $self.find(".cdc2-since-last-visit-episode-selected");
        $menuItem.removeClass("cdc2-since-last-visit-episode-selected").addClass("cdc2-since-last-visit-episode");
    }

    // construct our tooltips
    this.constructImplantInfoTooltips(this.PMkrData, this.histPMkrData);

    //Creating the hover for the Mode data present.
    if (this.PMkrData.BRADY_SETTINGS[0] && this.PMkrData.BRADY_SETTINGS[0].MODE_DISP) {
        $modeDetail = $self.find("#cdc2-hdr-row-device-mode");
        this.modeTooltip = new MPageTooltip();
        this.modeTooltip.setContent(this.constructHoverTable([this.i18n.SENSING, this.i18n.PACING], [this.ModeEqvs[this.PMkrData.BRADY_SETTINGS[0].MODE_DISP.charAt(0).toUpperCase()], this.ModeEqvs[this.PMkrData.BRADY_SETTINGS[0].MODE_DISP.charAt(1).toUpperCase()], "SensingPacingHover"]));
        this.modeTooltip.setAnchor($modeDetail);
        $modeDetail.mouseover({
            scope: this,
            tooltip: this.modeTooltip
        }, this.showHoverData);
    }
};

/**
 * Construct the tooltip for the "Implant Info" and attach the tooltip to the "Implanted" element for both
 * the active device and all historical devices.
 * @param {DEVICE} activeDevice The current active device.
 * @param {DEVICE[]} historicalDevices An array of all historical devices.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.constructImplantInfoTooltips = function(activeDevice, historicalDevices) {
    var $self = $("#" + this.m_rootComponentNode.id),
        $implantDate = $self.find(".cdc2-hdr-row-device-implant-date"),
        $histImplantDate = $self.find(".cdc2-historical-device-implant"),
        histDeviceIdx,
        histDevice,
        deviceTooltip = new MPageTooltip();

    // first, create the tooltip for the currently active device
    deviceTooltip.setContent(
        this.constructHoverTable(
            [this.i18n.IMPLANTING_PHYSICIAN, this.i18n.FACILITY, this.i18n.CONTACT_DATA],
            [activeDevice.IMPLANTER_NAME, activeDevice.IMPLANTING_FACILITY_NAME, activeDevice.IMPLANTER_CONTACT_INFO])
        );

    deviceTooltip.setAnchor($implantDate);
    $implantDate.mouseover({
        tooltip: deviceTooltip
    }, this.showHoverData);

    // next, create the tooltips for all the historical devices
    for (histDeviceIdx = 0; histDeviceIdx < historicalDevices.length; histDeviceIdx++) {
        histDevice = historicalDevices[histDeviceIdx];
        deviceTooltip = new MPageTooltip();

        deviceTooltip.setContent(
            this.constructHoverTable(
                [this.i18n.IMPLANTING_PHYSICIAN, this.i18n.FACILITY, this.i18n.CONTACT_DATA],
                [histDevice.IMPLANTER_NAME, histDevice.IMPLANTING_FACILITY_NAME, histDevice.IMPLANTER_CONTACT_INFO])
            );

        deviceTooltip.setAnchor($histImplantDate.eq(histDeviceIdx));
        $histImplantDate.eq(histDeviceIdx).mouseover({
            tooltip: deviceTooltip
        }, this.showHoverData);
    }
};

/**
 * Hooks up all elements inside of <code>elementToDocUID</code> to call <code>displayDocument</code> with the proper parameters when clicked on.
 * Also returns the first episode jquery object and its parameters to send to <code>displayDocument</code>.
 * @param {OBJECT} $prevPagePDFButton The jquery object for the button for "previous pdf page".
 * @param {OBJECT} $nextPagePDFButton The jquery object for the button for "next pdf page".
 * @param {OBJECT} $currentPgNumField The jquery object for the button for "current pdf page number".
 * @returns {OBJECT} If there was a first episode, the first episode jquery object and its parameters to send to <code>displayDocument</code>.
 */
CardiologyDevice_o2Component.prototype.setEpisodeButtonClickEvents = function($prevPagePDFButton, $nextPagePDFButton, $currentPgNumField) {
    var thisComponent = this,
        $self = $("#" + this.m_rootComponentNode.id),
        $firstEpisode,
        firstEpisodeDisplayDocArg;

    // hook up the doc UIDs with the episode buttons
    $.each(this.elementToDocUID, function(index) {
        var $episodeObject = $self.find("#" + index),
            clickEventArg;

        if (CERN_Platform.inMillenniumContext()) {
            clickEventArg = {
                scope: thisComponent,
                parentClass: thisComponent,
                buttonObject: $self.find("#" + index),
                docUID: thisComponent.elementToDocUID[index].DocUID,
                docLen: thisComponent.elementToDocUID[index].DocLen,
                documentViewer: thisComponent.documentViewer,
                prevButtonObj: $prevPagePDFButton[0],
                nextButtonObj: $nextPagePDFButton[0],
                currPgNumField: $currentPgNumField[0],
                subTimerName: thisComponent.criterion.category_mean
            };
        } else {
            clickEventArg = {
                scope: thisComponent,
                parentClass: thisComponent,
                buttonObject: $self.find("#" + index),
                docUID: thisComponent.elementToDocUID[index].DocUID,
                docLen: thisComponent.elementToDocUID[index].DocLen,
                documentViewer: thisComponent.documentViewer,
                subTimerName: thisComponent.criterion.category_mean
            };
        }
        $episodeObject.click(clickEventArg, thisComponent.displayDocument);
        //Assigning the firstEpisode variable to the first episode encountered
        if (!$firstEpisode) {
            $firstEpisode = $episodeObject;
            firstEpisodeDisplayDocArg = clickEventArg;
        }
    });

    return {$firstEpisode: $firstEpisode, firstEpisodeDisplayDocArg: firstEpisodeDisplayDocArg};
};

/**
 * Hooks up all elements inside of <code>sessionToDocUID</code> to call <code>displayDocument</code> with the proper parameters when clicked on.
 * Also returns the first session jquery object and its parameters to send to <code>displayDocument</code>.
 * @param {OBJECT} $prevPagePDFButton The jquery object for the button for "previous pdf page".
 * @param {OBJECT} $nextPagePDFButton The jquery object for the button for "next pdf page".
 * @param {OBJECT} $currentPgNumField The jquery object for the button for "current pdf page number".
 * @returns {OBJECT} If there was a first session, the first session jquery object and its parameters to send to <code>displayDocument</code>.
 */
CardiologyDevice_o2Component.prototype.setSessionButtonClickEvents = function($prevPagePDFButton, $nextPagePDFButton, $currentPgNumField) {
    var sessionToDocUIDIdx,
        $self = $("#" + this.m_rootComponentNode.id),
        $firstSession,
        firstSessionDisplayDocArg,
        clickEventArg,
        uniqueSessionDoc,
        $sessionContainer;

    for (sessionToDocUIDIdx = 0; sessionToDocUIDIdx < this.sessionToDocUID.length; sessionToDocUIDIdx++) {
        uniqueSessionDoc = this.sessionToDocUID[sessionToDocUIDIdx];
        $sessionContainer = $self.find("#" + uniqueSessionDoc.nodeName);
        if (CERN_Platform.inMillenniumContext()) {
            clickEventArg = {
                scope: this,
                parentClass: this,
                buttonObject: $sessionContainer,
                docUID: uniqueSessionDoc.docUID,
                docLen: uniqueSessionDoc.docLen,
                documentViewer: this.documentViewer,
                prevButtonObj: $prevPagePDFButton[0],
                nextButtonObj: $nextPagePDFButton[0],
                currPgNumField: $currentPgNumField[0],
                subTimerName: this.criterion.category_mean
            };
        } else {
            clickEventArg = {
                scope: this,
                parentClass: this,
                buttonObject: $sessionContainer,
                docUID: uniqueSessionDoc.docUID,
                docLen: uniqueSessionDoc.docLen,
                documentViewer: this.documentViewer,
                subTimerName: this.criterion.category_mean
            };
        }
        $sessionContainer.find("span").click(clickEventArg, this.displayDocument);
        if (!$firstSession) {
            $firstSession = $sessionContainer.find("span");
            firstSessionDisplayDocArg = clickEventArg;
        }
    }

    return {$firstSession: $firstSession, firstSessionDisplayDocArg: firstSessionDisplayDocArg};
};

/**
 * Hooks up expand/collapse behavior to episodes and sessions.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.setShowHideClickEvents = function() {
    var thisComponent = this,
        $self = $("#" + this.m_rootComponentNode.id),
        $showMoreButton,
        $expandCollapseCarrots,
        elemIdx,
        elemCount,
        elem;

    // hook up the "show more" button
    $showMoreButton = $self.find(".cdc2-more-button");
    elemCount = $showMoreButton.length;
    for (elemIdx = 0; elemIdx < elemCount; elemIdx++) {
        elem = $showMoreButton.eq(elemIdx);
        elem.click({
            triggerObj: elem
        }, thisComponent.showRemaining);
    }

    // hook up the expand/collapse button
    $expandCollapseCarrots = $self.find(".cdc2-expColCarrot");
    elemCount = $expandCollapseCarrots.length;
    for (elemIdx = 0; elemIdx < elemCount; elemIdx++) {
        elem = $expandCollapseCarrots.eq(elemIdx);
        elem.click({
            triggerObj: elem,
            relatedDIV: $self.find("#" + elem[0].parentNode.id + "Children")
        }, thisComponent.toggleExpand);
    }
};

/**
 * This Function handles the request for endorsement button click and pops out a  Modal Dialog containing the input fields that user
 * needs to fill out before sending it out
 * The receiver id is typed in the first text box which returns a list of user id's based on user's input
 * The subject text box and the text area are plain text input fields that are typed in by the user.
 * Receiver Id and subject text box are mandatory
 * @param {OBJECT} eventData contains the cardiology component reference, component Id, and component NameSpace
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.requestForEndorsementDialog = function (eventData) {
    var compNs,
        compId,
        requestEndorsementBodyText,
        requestEndorsementDialogId,
        sendButton,
        cancelButton,
        requestEndorsementDialog,
        currentDocUID,
        currentDocDesc,
        warningMessage,
        disModal,
        warningMessageHTML,
        selectedReceiver,
        RTFMessage,
        scriptParam,
        scriptRequest,
        $subjectField,
        $messageField,
        $receiverDiv,
        $receiverSearchBox,
        $pdfTitle;

    var thisComponent = eventData.data.scope;
    requestEndorsementBodyText = "";
    thisComponent.requestEndorsementSequence = 1;
    compNs = eventData.data.compNS;
    compId = eventData.data.compID;
    requestEndorsementDialogId = compNs + "requestForEndorsement" + compId + "n" + thisComponent.requestEndorsementSequence;
    $pdfTitle = eventData.data.pdfTitle;
    currentDocDesc = $pdfTitle[0].innerText;
    currentDocUID = eventData.data.scope.activeDocID;

    // hide the pdf viewer. the activex control won't abide by z-index, so this is to prevent
    //  the disassociate dialog from popping up behind the pdf viewer.
    $(".cdc2-pdf-renderer").css("visibility", "hidden");

    sendButton = new ModalButton("cdc2-confirm-send");
    cancelButton = new ModalButton("cdc2-confirm-cancel");
    requestEndorsementDialog = new ModalDialog(requestEndorsementDialogId);
    //Adding a Modal Dialog box to the global array so that it gets deleted when the component is refreshed
    thisComponent.modalArr.push(requestEndorsementDialogId);

    requestEndorsementBodyText +=
    "<div class = 'cdc2-request-endorsement-dialog'>" +
    "<div class = 'cdc2-request-endorsement-to-field'>" +
    "<div class='cdc2-request-endorsement-cont'>" +
    "<div title='" + i18n.discernabu.cardiology_device_integration_detail_o2.TO + "' class = 'cdc2-request-endorsement-to-label'><span>*</span>" + i18n.discernabu.cardiology_device_integration_detail_o2.TO +
    "</div>" +
    "</div>" +
    "<div class='cdc2-request-endorsement-input'>" +
    "<form onsubmit='return false'>" +
    "<div id = 'cdc2-request-endorsement-receiver-id" + compId + "'></div>" +
    "</form>" +
    "</div>" +
    "</div><br />" +
    "<div class = 'cdc2-request-endorsement-subject-field'>" +
    "<div class='cdc2-request-endorsement-cont'>" +
    "<div title='" + i18n.discernabu.cardiology_device_integration_detail_o2.SUBJECT + "' class = 'cdc2-request-endorsement-subject-label'><span>*</span>" + i18n.discernabu.cardiology_device_integration_detail_o2.SUBJECT +
    "</div>" +
    "</div>" +
    "<div class='cdc2-request-endorsement-input'> <input id = 'cdc2-request-endorsement-subject' class = 'cdc2-request-endorsement-text-box' type = 'text'>" +
    "</div>" +
    "</div><br />" +
    "<div class='cdc2-request-endorsement-msg-field'>" +
    "<div class='cdc2-request-endorsement-cont'>" +
    "<div title='" + i18n.discernabu.cardiology_device_integration_detail_o2.MESSAGE + "' class = 'cdc2-request-endorsement-text'>" + i18n.discernabu.cardiology_device_integration_detail_o2.MESSAGE +
    "</div>" +
    "</div>" +
    "<div class='cdc2-request-endorsement-input'>" +
    "<textarea id = 'cdc2-request-endorsement-text' class = 'cdc2-request-endorsement-text-area'></textarea>" +
    "</div>" +
    "</div>" +
        "</div>" +
    "</div>";

    cancelButton.setText(i18n.discernabu.cardiology_device_integration_detail_o2.CANCEL).setIsDithered(false).setCloseOnClick(true).setOnClickFunction(function () {
        // force the address book search to close itself
        // this needs to be done because the mpages dialog will throw unhandled exceptions if
        // the search dropdown is open when the dialog is closed
        thisComponent.addrBookSearchControl.close();

        // be sure to show the pdf viewer again
        $(".cdc2-pdf-renderer").css("visibility", "visible");
    });

    sendButton.setText(i18n.discernabu.cardiology_device_integration_detail_o2.SEND).setIsDithered(false).setCloseOnClick(false).setFocusInd(true).setOnClickFunction(function () {

        selectedReceiver = thisComponent.addrBookSearchControl.getList().getSelectedItem();

        $subjectField = $(".cdc2-request-endorsement-dialog").find("#cdc2-request-endorsement-subject");
        $messageField = $(".cdc2-request-endorsement-dialog").find("#cdc2-request-endorsement-text");
        // if selectedReceiver is not null and the value in subjectField is not an empty string, continue into the if loop
        if (selectedReceiver !== null && $subjectField.val() !== "") {
            //Checking if the message Field has any content in it
            if ($messageField !== null) {
                RTFMessage = "{\\rtf1\\ansi\\deff0\\ " + $messageField.val() + " }";
            } else {
                RTFMessage = "{\\rtf1\\ansi\\deff0\\ " + currentDocDesc + " }";
            }

            //The parameter that is built for calling the MP_SEND_DOC_TO_INBOX script
            scriptParam = ["^MINE^", thisComponent.getCriterion().encntr_id + ".0", thisComponent.getCriterion().person_id + ".0", thisComponent.getCriterion().provider_id + ".0", selectedReceiver.PERSON_ID + ".0", "^" + currentDocUID + "^", "^" + currentDocDesc + "^", "^" + $subjectField.val() + "^", "^" + RTFMessage + "^"];

            scriptRequest = new ScriptRequest();
            scriptRequest.setProgramName("MP_SEND_DOC_TO_INBOX");
            scriptRequest.setParameterArray(scriptParam);
            scriptRequest.setAsyncIndicator(true);
            scriptRequest.setResponseHandler(function(reply) {
                thisComponent.handleSendForEndorsementReply(reply);
            });
            scriptRequest.performRequest();

            MP_ModalDialog.closeModalDialog(requestEndorsementDialogId);
            $(".cdc2-pdf-renderer").css("visibility", "visible");
        } else if (selectedReceiver === null || $subjectField.val() === "") {
            warningMessage = "";
            if (selectedReceiver === null && $subjectField.val() === "") {
                warningMessage += i18n.discernabu.cardiology_device_integration_detail_o2.TO + " " + i18n.discernabu.cardiology_device_integration_detail_o2.AND + " " + i18n.discernabu.cardiology_device_integration_detail_o2.SUBJECT + " " + i18n.discernabu.cardiology_device_integration_detail_o2.ENDORSEMENT_MANDATORY_FIELDS;
            } else if (selectedReceiver === null) {
                warningMessage += i18n.discernabu.cardiology_device_integration_detail_o2.TO + " " + i18n.discernabu.cardiology_device_integration_detail_o2.ENDORSEMENT_MANDATORY_FIELD;
            } else {
                warningMessage += i18n.discernabu.cardiology_device_integration_detail_o2.SUBJECT + " " + i18n.discernabu.cardiology_device_integration_detail_o2.ENDORSEMENT_MANDATORY_FIELD;
            }
            warningMessageHTML =
                "<div id = 'cdc2-modal-dialog-warning-message-container' class='cdc2-request-endorsement-warning-bg'>" +
                "<div id = 'cdc2-modal-dialog-warning-info-icon' class='cdc2-request-endorsement-warning-info-icon'>" +
                "<img src = '" + thisComponent.getCriterion().static_content + "/images/4017_24.png' alt='information'/>" +
                "</div>" +
                "<div id = 'cdc2-modal-dialog-warning-message' class='cdc2-request-endorsement-warning-text'>" + warningMessage +
                "</div>" +
                "</div>";
            $(".cdc2-request-endorsement-warning-bg").remove();
            $(".cdc2-request-endorsement-dialog").append(warningMessageHTML);
        }
    });
    requestEndorsementDialog.setLeftMarginPercentage(33).setRightMarginPercentage(35).setTopMarginPercentage(20).setBottomMarginPercentage(20).setHeaderTitle(i18n.discernabu.cardiology_device_integration_detail_o2.ENDORSEMENT_TITLE).setIsBodySizeFixed(false).setIsFooterAlwaysShown(true).addFooterButton(sendButton).setShowCloseIcon(true).addFooterButton(cancelButton).setHeaderCloseFunction(function () {
        // be sure to show the pdf viewer again
        $(".cdc2-pdf-renderer").css("visibility", "visible");
    });
    MP_ModalDialog.addModalDialogObject(requestEndorsementDialog);
    MP_ModalDialog.showModalDialog(requestEndorsementDialogId);
    disModal = MP_ModalDialog.retrieveModalDialogObject(requestEndorsementDialogId);
    disModal.setBodyHTML(requestEndorsementBodyText);

    // set up the address book search
    $receiverDiv = $(".cdc2-request-endorsement-dialog").find("#cdc2-request-endorsement-receiver-id" + compId);
    thisComponent.addrBookSearchControl = new CardiologyDevice_o2Component.AddressBookSearch($receiverDiv[0], thisComponent.getCriterion().person_id, thisComponent.getCriterion().encntr_id);

    // set the focus on the "to" search box to save the user a mouse click
    $receiverSearchBox = $(".cdc2-request-endorsement-to-field").find(".search-box");
    $receiverSearchBox.focus();
};

/**
 * Handles the handle Endorsement message
 * @param {object} reply The object automatically passed by the XMLCCLRequestCallBack
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleSendForEndorsementReply = function (reply) {
    if (reply.m_responseData.STATUS_DATA.STATUS === "F") {
        logger.logScriptCallError(null, reply.m_error, "cardiology detail send for endorsement", "handleSendForEndorsementReply");
        logger.logError(this.getProgramName() + " failed: " + reply.m_error);
    }
};

/**
 * Hiding the title tool bar containing PDF Title and page controls
 *
 * Based on whether running in powerchart or browser page controls will be disabled.
 * When running on browser, you do not have documentviewer controls so it will no be disabled,
 * only pageControls will get hidden.
 * When running inside the powerChart you will have both documentControls and pagecontrols
 * that should be hidden.
 *
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.hideTitleToolbar = function () {
    document.getElementById("cdc2-pdf-control-label").innerHTML = "<div>" + this.i18n.NO_EPISODE_PDF + "</div>";
    $("#cdc2-pdf-control-btns").hide();

    if (CERN_Platform.inMillenniumContext()) {
        $("#cdc2-pdf-control-pgs").hide();
    }
};

/**
 * Functionality that should be performed before renderComponent.
 *
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.preProcessing = function () {
    this.addMenuItems();
};

/**
 * Add items to the component-level dropdown menu.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.addMenuItems = function () {
    var compMenu,
        compId,
        manageDevices;

    compMenu = this.getMenu();
    compId = this.getComponentId();

    if (this.isDisplayable() === true) {
        manageDevices = new MenuSelection("manageDevices" + compId);
        manageDevices.setLabel(i18n.discernabu.cardiology_device_integration_detail_o2.MANAGE_DEVICES + "...");
        manageDevices.setIsDisabled(true);

        compMenu.addMenuItem(manageDevices);
    }
};

/**
 * Appends all the events for device search functionality
 * (Included as a separate function in case normal post processing doesn't fire in "no results" case)
 *
 * @param	{OBJECT}	component		- Reference to the component; would be "this" instead this is called from a callback thread.
 * @param   {OBJECT}    [$self]         - Reference to this.scopeObj (if not valid in context, pass nothing and it will find)
 * @param   {FUNCTION}  [associateFunc] - Function to call when the "associate" button is clicked. If not set, <code>handleSearchDevice</code> will be called.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.postProcessingSearchDevice = function (component, $self, associateFunc) {
    var $serialText,
        $searchDeviceButton,
        $searchResults,
        $searchPulseGenId,
        $associateDevice,
        $confirmAssociation,
        currentPersonId = component.getCriterion().person_id,
        thisComponent = this,
        searchDeviceReply;

    if (!$self) {
        $self = $("#" + this.m_rootComponentNode.id);
    }

    $serialText = $self.find(component.writeUniqueID("SerialText", component, "#"));
    $searchDeviceButton = $self.find(component.writeUniqueID("SearchDeviceButton", component, "#"));
    $searchResults = $self.find(component.writeUniqueID("SearchResults", component, "#"));
    $searchPulseGenId = $(component.writeUniqueID("DevicePGId", component, "#"));
    $associateDevice = component.writeUniqueID("AssociateDevice", component, "#");
    $confirmAssociation = component.writeUniqueID("ConfirmAssociation", component, "#");

    //Just to ensure these aren't loaded more than once; needed because callbacks for multiple actions could reload this.
    if ($serialText.data("Loaded") && $serialText.data("Loaded") === 1) { //Just picking any one of these controls to flag that it"s
        // loaded.
        return;
    }
    $serialText.data("Loaded", 1);

    // if no text is in the serial number search box, display grayed out placeholder text when the search box loses focus
    $serialText.on("blur", function () {
        if (this.value === "") {
            this.value = i18n.discernabu.cardiology_device_integration_detail_o2.PACEMAKER_SN;
            $serialText.css("color", "#9f9f9f");
        }
    });

    // if there is placeholder text in the serial number search box, remove it when the search box receives focus
    $serialText.on("focus", function () {
        if (this.value === i18n.discernabu.cardiology_device_integration_detail_o2.PACEMAKER_SN) {
            this.value = "";
            $serialText.css("color", "#000");
        }
    });

    $searchDeviceButton.on("click", function () {
        var deviceText = $serialText.val();
        if (deviceText !== i18n.discernabu.cardiology_device_integration_detail_o2.PACEMAKER_SN && deviceText !== "") {
            $searchResults.html("<div></div>");
            component.performManualDeviceSearch(
                deviceText,
                function(reply) {
                    searchDeviceReply = reply;
                    component.handleSearchDevice(reply);
                });
        } else {
            $searchResults.html("<div class='cdc2-device-search-errorMsg'> <span>" + i18n.discernabu.cardiology_device_integration_detail_o2.NO_MATCHES + "</span></div>");
        }
    });

    // add association button click
    $searchResults.on("click", $associateDevice, function () {
        if (associateFunc) {
            associateFunc($searchPulseGenId.val());
        } else {
            component.updateDeviceAssociation(
                $searchPulseGenId.val(),
                currentPersonId,
                function(reply) {
                    component.handleAssociate(reply);
                });
        }
    });

    // Association Anyway link on click
    $searchResults.on("click", $confirmAssociation, function () {
        var confirmAssociationDialog;
        var modal;
        var modalDialogId = component.writeUniqueID("ConfirmAssociationDialog", component, "");

        //buttons for confirm association and cancel association
        var assocButton = new ModalButton("cdc2-confirm-association");
        var cancelButton = new ModalButton("cdc2-confirm-cancel");

        cancelButton
            .setText(i18n.discernabu.cardiology_device_integration_detail_o2.CANCEL)
            .setIsDithered(false)
            .setCloseOnClick(true);

        assocButton
            .setText(i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE)
            .setIsDithered(false)
            .setCloseOnClick(true)
            .setFocusInd(true)
            .setOnClickFunction(function () {
                var tempDeviceId;

                if (associateFunc) {
                    associateFunc($searchPulseGenId.val(), searchDeviceReply);
                } else {
                    tempDeviceId = $searchPulseGenId.val();
                    if (tempDeviceId !== "") {
                        thisComponent.updateDeviceAssociation(tempDeviceId, currentPersonId, function (reply) {
                            component.handleAssociate(reply);
                        });
                    }
                }
            });

        //Modal dialog for Association Confirm box
        confirmAssociationDialog = new ModalDialog(modalDialogId);

        confirmAssociationDialog
            .setLeftMarginPercentage(33)
            .setRightMarginPercentage(33)
            .setTopMarginPercentage(20)
            .setBottomMarginPercentage(20)
            .setHeaderTitle(i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE_PACEMAKER)
            .setIsBodySizeFixed(false)
            .setIsFooterAlwaysShown(true)
            .addFooterButton(assocButton)
            .addFooterButton(cancelButton);

        MP_ModalDialog.addModalDialogObject(confirmAssociationDialog);
        MP_ModalDialog.showModalDialog(modalDialogId);

        modal = MP_ModalDialog.retrieveModalDialogObject(modalDialogId);
        modal.setBodyHTML(component.alreadyAssociatedMessage);
    });
};

/**
 * Appends all the events for suggested matches functionality; kept separate from "device search" functionality in case these may
 * ever appear separately
 * (Included as a separate function in case normal post processing doesn't fire in "no results" case)
 *
 * @param	{OBJECT}	component		- Reference to the component; would be "this" instead this is called from a callback thread.
 * @param   {OBJECT}    [$self]         - Reference to this.scopeObj (if not valid in context, pass nothing and it will find)
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.postProcessingSuggestedMatches = function (component, $self) {
    var $suggMatchResults,
        thisComponent = this;

    if (!$self) {
        $self = $("#" + this.m_rootComponentNode.id);
    }

    $suggMatchResults = $self.find(".cdc2-sugg-match-results");

    //Just to ensure these aren't loaded more than once; needed because callbacks for multiple actions could reload this.
    if ($suggMatchResults.data("Loaded") && $suggMatchResults.data("Loaded") === 1) { //Just picking any one of these controls to flag
        // that it"s loaded.
        return;
    }
    $suggMatchResults.data("Loaded", 1);

    //Here's the main business of this function:  Make sure that if they click Add, it will assign the device.
    //Assumes the existing structure of how the HTML is written where inside $suggMatchResults there's a list of multiple
    //elements of class cdc2-search-output, and inside that we'll find the index button in such a way that it's index will be
    // 0,1,2...etc.
    //for each button of the list.
    $suggMatchResults.delegate(".cdc2-search-output", "click", function (event) {
        //Prevent clicks that are merely "near" the associate button from triggering associate.
        if ($(event.target).hasClass("cdc2-associate-device-button")) {
            // when updating the device association, the index of "this" relative to its siblings corresponds to
            //  the suggestedMatchPulseGenIDs index, which will give the pulse gen id to be associated
            thisComponent.updateDeviceAssociation(
                component.suggestedMatchPulseGenIDs[$(this).index()],
                thisComponent.getCriterion().person_id,
                function (reply) {
                    thisComponent.handleAssociate(reply);
                });
        }
    });
};

/**
 * Calls <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_UPDATE_DEVICE_ASSOCIATION">PEX_UPDATE_DEVICE_ASSOCIATION</a></code>
 * with the specified arguments.
 * @param {NUMBER} pulseGenId The pulse gen id to associate to a person.
 * @param {NUMBER} personId The person to associate the pulse gen to. Set to 0 to disassociate the pulse gen from a person.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @param {BOOLEAN} [async] Whether or not the call should be asynchronous.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.updateDeviceAssociation = function(pulseGenId, personId, responseHandler, async) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_UPDATE_DEVICE_ASSOCIATION")
        .setParameterArray(["^MINE^", pulseGenId + ".00", personId + ".00"])
        .setAsyncIndicator(async !== undefined ? async : true)
        .setResponseHandler(function(reply) {
            if (responseHandler !== undefined) {
                responseHandler(reply);
            }
        })
        .performRequest();
};

/**
 * Activates a device by calling <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_UPDT_DEVICE_REMOVAL_DT_TM">PEX_UPDT_DEVICE_REMOVAL_DT_TM</a></code>
 * with the specified arguments.
 * @param {NUMBER} pulseGenId The pulse gen id to activate.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.activateDevice = function(pulseGenId, responseHandler) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_UPDT_DEVICE_REMOVAL_DT_TM")
        .setParameterArray(["^MINE^", pulseGenId + ".00", "1", ""])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            if (responseHandler !== undefined) {
                responseHandler(reply);
            }
        })
        .performRequest();
};

/**
 * Inactivates a device by calling <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_UPDT_DEVICE_REMOVAL_DT_TM">PEX_UPDT_DEVICE_REMOVAL_DT_TM</a></code>
 * with the specified arguments.
 * @param {NUMBER} pulseGenId The pulse gen id to activate.
 * @param {DATE} removalDtTm The date/time the pulse generator was inactivated.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.inactivateDevice = function(pulseGenId, removalDtTm, responseHandler) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_UPDT_DEVICE_REMOVAL_DT_TM")
        .setParameterArray(["^MINE^", pulseGenId + ".00", "0", removalDtTm.toUTCString()])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            if (responseHandler !== undefined) {
                responseHandler(reply);
            }
        })
        .performRequest();
};

/**
 * Function to handle the logic and sequence of what should happen when various callback functions are called from an
 * XMLCCLRequestCallBack
 *
 * @param   {OBJECT}    reply 			The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge"
 * to everything
 * @param	{STRING}	sZMessage		Custom string to be passed in case of "Z" (no records returned by CCL)
 * @param	{NUMBER}	ZSearchDevice	1 - include device search; 3 (1+2) - include device search and force post processing for it
 * @param	{FUNCTION}	fSuccess		Callback function (with reply as parameter) to say what to do in "S" (success) case.
 * @param	{FUNCTION}	fZ				Callback function (with reply as parameter) to say what to do in "Z" case, if needed for custom
 * functioning
 * @param	{FUNCTION}	fFinally		Callback function (with reply as parameter) to say what to do in all cases at the end
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleCallbackLogic = function (reply, sZMessage, ZSearchDevice, fSuccess, fZ, fFinally) {
    var component = this;
    //Get reference to the component ("this") from inside the callback.
    var errMsg = [];
    var opHTML = "";
    var compId = component.getComponentId();
    var cdc2MessageType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
    var template = MPageControls.getDefaultTemplates().messageBar;
    var cdc2DisclaimerElement;
    var disclaimerText = "";
    if (reply.getStatus() === "S") {
        if (fSuccess) {
            fSuccess(reply);
            //Process callback function for success.
        } else {
            //No callback function?  Assume reload component
            // make sure to close the "associate device to receive data" alert message,
            // otherwise it will stay there if we're associating for the first time and
            // reloading the component with pacemaker data
            if (this.alertMessage !== null) {
                this.alertMessage.close();
            }
            component.retrieveComponentData(component);
        }
    } else if (reply.getStatus() === "Z") {
        if (fZ) {
            fZ(reply);
            //Process callback function for Z response; included in case we ever need it.
        } else {
            // clear out members in the component that have been saved off when a device was associated
            //  otherwise, they will be used again if another device is associated and the mPage is not refreshed
            this.initComponentVars();
            this.disableManageDevicesMenuItem();
            if (sZMessage) {
                //Write out Standard MPage Alert message formatted as usual for Z response
                component.createPaceMakerDetailCompDisclaimer(compId);
                disclaimerText += "<span>" + sZMessage + "</span>";
                cdc2DisclaimerElement = $("#opPacemakerDetailDisclaimer" + compId);

                // construct and render the "associate device to receive data" alert message if in here for the first time
                //  re-use the constructed one otherwise
                if (this.alertMessage === null) {
                    this.alertMessage = new MPageControls.AlertMessage(cdc2DisclaimerElement, template, cdc2MessageType);
                    this.alertMessage.render(disclaimerText);
                } else {
                    // AlertMessage has a close(), but not a show()
                    //  do that manually here
                    this.alertMessage.getElement().show();
                }
            }

            if (ZSearchDevice & 4) { //Bitwise operator: detects the suggested matches option
                //Write place for suggested matches to reside.
                opHTML += component.constructSuggestedMatchesPlaceholder();
            }

            if (ZSearchDevice & 1) { //Bitwise operator: detects the search device option
                //Allow user to search the appropriate device for the patient.
                opHTML += component.constructDeviceSearch("cdc2-search-device-content-faceup");
            }
            component.finalizeComponent(opHTML, component.isLineNumberIncluded() ? "(0)" : "");

            if (ZSearchDevice & 2) { //Bitwise operator: detects option to force postprocessing for search device
                //For cases where this doesn't fire otherwise
                component.postProcessingSearchDevice(component);
            }

            if (ZSearchDevice & 8) { //Bitwise operator: detects option to force postprocessing for suggested matches
                //For cases where this doesn't fire otherwise
                component.postProcessingSuggestedMatches(component);
            }
        }

    } else {
        //Assume "F" case or some problem.
        MP_Util.LogScriptCallError(component, reply, "master-components.js", "handleLoad");
        //Get the error message from the reply
        errMsg = component.getErrorMessage(reply);
        //[[test this with error]]
        component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component.isLineNumberIncluded() ? "(0)" : "");
    }
    if (fFinally) { //In case anything must happen in all cases at the end
        fFinally(reply);
    }
};

/**
 * Creates an empty container element that will be used to hold the html for an AlertMessage control
 * @param {number} compId : The unique id for this instance of the PaceMaker Detail component
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.prototype.createPaceMakerDetailCompDisclaimer = function (compId) {
    var cdc2DisclaimerDiv = _g("opPacemakerDetailDisclaimer" + compId);
    var contentNodeHd;
    var contentNode;
    if (cdc2DisclaimerDiv) {
        //element exists, do nothing
        return;
    }
    cdc2DisclaimerDiv = Util.cep("div", {
        "className": "message-container",
        "id": "opPacemakerDetailDisclaimer" + compId
    });
    contentNode = this.getRootComponentNode();
    if (contentNode) {
        contentNodeHd = _gbt("H2", contentNode)[0];
        Util.ia(cdc2DisclaimerDiv, contentNodeHd);
    }
};

/**
 * Helper function to create an error message from a reply
 * This allows callback functions from XMLCCLRequestCallback to have errors handled in a way consistent with how XMLCclRequestWrapper
 * handles them
 * Included in this component because it uses callback functions a lot to allow custom display even in a "Z" case
 *
 * @param   {OBJECT}    reply	The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {STRING}			Formatted error message
 */
CardiologyDevice_o2Component.prototype.getErrorMessage = function (reply) {
    var errorMessage = [],
        recordData = reply.getResponse(),
        statusData = recordData.STATUS_DATA,
        i18nCore = i18n.discernabu,
        ss = null,
        subStatusIdx,
        subStatusLen;

    errorMessage.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", reply.status, "</li><li>", i18nCore.REQUEST, ": ", reply.requestText, "</li>");
    if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
        for (subStatusIdx = 0, subStatusLen = statusData.SUBEVENTSTATUS.length; subStatusIdx < subStatusLen; subStatusIdx++) {
            ss = statusData.SUBEVENTSTATUS[subStatusIdx];
            errorMessage.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
        }
    } else if (statusData.SUBEVENTSTATUS.length === undefined) {
        ss = statusData.SUBEVENTSTATUS;
        errorMessage.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
    }
    errorMessage.push("</ul>");
    return errorMessage;
};

/**
 * Callback function to respond to when a user clicks the button to associate the device (goes with the "device search" changes).
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleAssociate = function (reply) {
    //Get reference to the component ("this") from inside the callback.
    var component = this;
    //Message just to handle unexpected "Z" case
    var msg = i18n.discernabu.cardiology_device_integration_detail_o2.UNABLE_TO_ADD_DEVICE;
    //Reloads with new data
    component.handleCallbackLogic(reply, msg, 1);
};

/**
 * Callback function to respond to when a user clicks the button to disassociate the device (goes with the "unassociate" changes).
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleDisassociate = function (reply) {
    //Get reference to the component ("this") from inside the callback.
    var component = this;
    //Message just to handle unexpected "Z" case
    var msg = i18n.discernabu.cardiology_device_integration_detail_o2.UNABLE_TO_REMOVE_DEVICE;
    //Reloads with new data. Note that even if they disassociate, there may be data from an old device!
    component.handleCallbackLogic(reply, msg, 1);
};

/**
 * Callback function to load the component and give control to display custom message if no device is found for the patient.
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleLoad = function (reply) {
    //Get reference to the component ("this") from inside the callback.
    var component = reply.getComponent();
    //Message just to handle unexpected "Z" case
    var msgSrc = i18n.discernabu.cardiology_device_integration_detail_o2;
    var msg = msgSrc.NO_DEVICE + " " + msgSrc.NO_DEVICE_1;

    component.handleCallbackLogic(reply, msg, 15, component.renderOnCallback, null, function (replyCallbackLogic) { //Callback function handles the
        // "finally" case.
        if (replyCallbackLogic.getStatus() === "Z") {
            //LOAD SUGGESTED MATCHES
            //Currently this only happens in the Z case.  So we could have put it into handleCallbackLogic via another ZSearchDevice enum value,
            //but we're putting it here for lower coupling.  It's also possible that in the future, this IF condition could get expanded.
            //Pass in component only, not timer name, because this is not the main component load.
            component.getSuggestedDevicesToAssociate(component.getCriterion().person_id);
        }
    });
    //Reloads with new data
};

/**
 * Calls <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_GET_DEVICES_TO_ASSOCIATE">PEX_GET_DEVICES_TO_ASSOCIATE</a></code>
 * with the specified personId.
 * @param {NUMBER} personId The person id to call <code>PEX_GET_DEVICES_TO_ASSOCIATE</code> with.
 * @param {scriptReplyCallback} [responseHandler] The callback to handle the script reply. If not set, the response handler will default to <code>handleLoadingSuggestedMatches</code>.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.getSuggestedDevicesToAssociate = function(personId, responseHandler) {
    var thisComponent = this;
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_GET_DEVICES_TO_ASSOCIATE")
        //Most "2" gets suggested matches. Pass in person ID so it gets them for this patient.
        .setParameterArray(["^MINE^", "2", "1", "^^", personId])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            if (responseHandler === undefined) {
                thisComponent.handleLoadingSuggestedMatches(reply);
            } else {
                responseHandler(reply);
            }
        })
        .performRequest();
};

/**
 * Calls <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_GET_DEVICES_TO_ASSOCIATE">PEX_GET_DEVICES_TO_ASSOCIATE</a></code>
 * searching for the specified pulse gen serial.
 * @param {STRING} pulseGenSerial The pulse gen serial to search for.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.performManualDeviceSearch = function(pulseGenSerial, responseHandler) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_GET_DEVICES_TO_ASSOCIATE")
        .setParameterArray(["^MINE^", "1", "1", "^" + encodeURIComponent(pulseGenSerial) + "^"])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            if (responseHandler !== undefined) {
                responseHandler(reply);
            }
        })
        .performRequest();
};

/**
 * Function to make it easy to write unique IDs in HMTL or when finding them using JQuery and binding events
 *
 * @param {STRING} name The main name for the ID - use camel case for IDs (though the prefix could be seen as the small-letter part)
 *											, unlike for CSS classes, as per the wiki.
 * @param {OBJECT} component A reference to this component
 * @param {BOOLEAN} useAsSelector Pass in something truthy to use as a selector (e.g., start with #)
 * @returns {STRING} ID, or selector for ID, using the prefix for this component and the suffix for this INSTANCE of the component
 */
CardiologyDevice_o2Component.prototype.writeUniqueID = function (name, component, useAsSelector) {
    var compNs = component.getStyles().getNameSpace();
    var compId = component.getComponentId();
    var start = "";
    if (useAsSelector) {
        start = "#";
    }
    return start + compNs + name + compId;
};

/**
 * Callback function to reload the component with suggested matches, once it has been found that the user's chart has no device.
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleLoadingSuggestedMatches = function (reply) {
    var suggmatchVal,
        i18nCore = i18n.discernabu.cardiology_device_integration_detail_o2,
    //Get reference to the component ("this") from inside the callback.
        component = this;

    //Process cases
    component.handleCallbackLogic(reply, "", 0, function (replyCallbackLogic) { //Success
        suggmatchVal = component.populateSuggestedMatches(replyCallbackLogic);
    }, function () { //No matches found at all.
        //This is the core message "No results found. Associate manually to receive device data."
        suggmatchVal = "<div class = 'cdc2-no-results-errorMsg'><b>" + i18nCore.NO_DEVICE + "</b><br />" + i18nCore.NO_DEVICE_1 + "</div>";
    }, function () { //Finally
        $(".cdc2-sugg-match-results").html(suggmatchVal);
    });
};

/**
 * Process normal loading of the component after callback
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.renderOnCallback = function (reply) {
    var recordData = reply.getResponse();
    var component = reply.getComponent();
    var renderTimer = null;
    var i18nCore = i18n.discernabu;
    var secTitle;

    try {
        renderTimer = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
        secTitle = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
        secTitle[0].innerHTML = i18nCore.RENDERING_DATA + "...";
        //Call the generic component loading renderComponent function so the component can render its content.
        component.renderComponent(recordData);
        if (component.Episodes.length > 0 || component.Sessions.length > 0) { //if there are any episodes not associated with sessions, still then postProcessing needs to be called
            component.alreadyPostProcessed = false;
            component.postProcessing(); //Calling postprocessing One more time in order to enable the Disassociate Cardiac Device Menu item and load the PDF with the right data (handle no PDF condition as well)
        }
    } catch (err) {
        logger.logJSError(err, component, "master-components.js", "handleLoad");
        if (renderTimer) {
            renderTimer.Abort();
            renderTimer = null;
        }
        throw err;
    } finally {
        if (renderTimer) {
            renderTimer.Stop();
        }
    }
};

/**
 * Write HTML for searching for new device for patient
 *
 * @param {STRING} containerClass The class to apply to the topmost div element in the returned html.
 * @returns {STRING} The HTML code for device search
 */
CardiologyDevice_o2Component.prototype.constructDeviceSearch = function (containerClass) {
    var opHTML,
        i18nCardiology = i18n.discernabu.cardiology_device_integration_detail_o2;

    opHTML =
        "<div class='" + containerClass + "'>" +
        "   <div id='cdc2-search-device-section'>" +
        "       <label class = 'cdc2-search-device-label'>" +
                i18nCardiology.MANUAL_ASSOCIATION +
        "       :</label>" +
        "       <div class='cdc2-search-device-inputs'>" +
        "           <input type='text' name='cdc2-serial-text' id='" + this.writeUniqueID("SerialText", this, "") + "' class='cdc2-device-serial-text' value='" + i18n.discernabu.cardiology_device_integration_detail_o2.PACEMAKER_SN + "'>" +
        "           <input type='button' name='cdc2-search-device-button' id='" + this.writeUniqueID("SearchDeviceButton", this, "") + "' class='cdc2-find-device-btn' value='" + i18nCardiology.FIND + "' />" +
        "           <input type='hidden' name='cdc2-search-device-pg-id' id='" + this.writeUniqueID("DevicePGId", this, "") + "' value='' />" +
        "           <input type='hidden' name='cdc2-search-device-pers-id' id='" + this.writeUniqueID("PersonId", this, "") + "' value='' />" +
        "           <input type='hidden' name='cdc2-search-device-alias' id='" + this.writeUniqueID("DeviceAlias", this, "") + "' value='' />" +
        "           <input type='hidden' name='cdc2-search-device-alias-type' id='" + this.writeUniqueID("DeviceAliasType", this, "") + "' value='' />" +
        "           <input type='hidden' name='cdc2-confirm-message' id='" + this.writeUniqueID("confirmMessage", this, "") + "' value='' />" +
        "       </div>" +
        "   </div>" +
        "   <div id='" + this.writeUniqueID("SearchResults", this, "") + "' class='cdc2-search-results'></div>" +
        "</div>" +
        "<br />";

    return opHTML;
};

/**
 * Write HTML for searching for the div or element that will contain the suggested matches
 *
 * @returns {STRING} The HTML code for device search
 * @example
 * opHTML += this.constructSuggestedMatchesPlaceholder();
 */
CardiologyDevice_o2Component.prototype.constructSuggestedMatchesPlaceholder = function () {
    var opHTML =
        "<div class='cdc2-sugg-match-content'>" +
        "   <div class='cdc2-sugg-match-section'>" +
        "       <div class='cdc2-matching-device-title'>" +
                i18n.discernabu.cardiology_device_integration_detail_o2.POSSIBLE_MATCHES +
        "       </div>" +
        "   </div>" +
        "   <div class='cdc2-sugg-match-results'></div>" +
        "</div>" +
        "<br />";

    return opHTML;
};

/**
 * Write HTML for populating suggested matches
 *
 * @param {object} reply The reply from the call to pex_get_devices_to_associate
 * @returns {String}	Results for suggested matches
 * @example
 * suggMatchResult += this.populateSuggestedMatches(reply);
 */
CardiologyDevice_o2Component.prototype.populateSuggestedMatches = function (reply) {
    var jsonData = reply.getResponse().PULSE_GENS,
        suggmatchVal = "",
        suggmatchIdx = 0,
        i18nCardiology = i18n.discernabu.cardiology_device_integration_detail_o2;

    for (suggmatchIdx = 0; suggmatchIdx < jsonData.length; suggmatchIdx++) {
        suggmatchVal += this.constructDevicePanel(jsonData[suggmatchIdx], i18nCardiology.ASSOCIATE, undefined);

        //Keeps track of the PulseGen ID so when we click an Add button,
        //we know which one to assign.
        this.suggestedMatchPulseGenIDs[suggmatchIdx] = parseInt(jsonData[suggmatchIdx].PULSE_GEN_ID, 10);
    }
    return suggmatchVal;
};

/**
 * Formats database DOB (YYYYMMDD) format to DOB (MM/DD/YYYY) format
 * @param {dbDOB} dbDOB The DOB in "(YYYYMMDD)" format
 * @returns {string} The DOB in "(MM/DD/YYYY)" format
 */
CardiologyDevice_o2Component.prototype.formatDOB = function (dbDOB) {
    var printPatientDOB = dbDOB.substring(4, 6) + "/" + dbDOB.substring(6, 8) + "/" + dbDOB.substring(0, 4);
    return printPatientDOB;
};

/**
 * Callback function to display device search results.
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.handleSearchDevice = function (reply) {
    var compNs = this.getStyles().getNameSpace(),
        compId = this.getComponentId(),
        jsonData,
        searchResultVal = "",
        pulseGenId = "",
        replyStatus = reply.getStatus(),
        existingPersonId = "",
        existingPersonAlias = "",
        existingPersonAliasType = "",
        existingPatientFullName = "",
        existingFullAlias = "";

    if (replyStatus === "S") {
        //Get key values from the JSON data
        jsonData = reply.getResponse().PULSE_GENS;
        pulseGenId = parseInt(jsonData[0].PULSE_GEN_ID, 10);
        //Find the ID by which we can actually associate the device.
        existingPersonId = parseInt(jsonData[0].PERSON_ID, 10);
        existingPersonAlias = jsonData[0].MRN_NUMBER;
        existingPersonAliasType = jsonData[0].MRN_TYPE;
        existingPatientFullName = jsonData[0].EXISTING_NAME;
        if (existingPersonAlias !== "" && existingPersonAliasType !== "") {
            existingFullAlias = " (" + existingPersonAliasType + ": " + existingPersonAlias + "). ";
        }

        if (existingPersonId === "" || existingPersonId === "0" || existingPersonId === 0) {
            //No existing assignee found for device
            searchResultVal = this.constructDevicePanel(jsonData[0], i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE, compNs + "AssociateDevice" + compId);
        } else {
            //Found existing assignee; warn user that assigning the device will remove from other patient
            this.alreadyAssociatedMessage =
                "<div class='cdc2-search-info-icon'>" +
                "   <img src='" + this.getCriterion().static_content + "/images/4017_24.png' alt='information'/>" +
                "</div>";
            if (existingPersonAlias === "") {
                this.alreadyAssociatedMessage +=
                    "<div class='cdc2-associate-info-text'>" + i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATION_WARNING_NO_MRN.replace("{0}", existingPatientFullName);
            } else {
                this.alreadyAssociatedMessage +=
                    "<div class='cdc2-associate-info-text'>" + i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATION_WARNING.replace("{0}", existingPatientFullName).replace("{1}", existingPersonAliasType).replace("{2}", existingPersonAlias);
            }
            searchResultVal =
                this.alreadyAssociatedMessage +
                "<br/>" +
                "<a id='" + compNs + "ConfirmAssociation" + compId + "'>" + i18n.discernabu.cardiology_device_integration_detail_o2.ASSOCIATE_ANYWAY + "</a>" +
                "</div>";
        }
    } else if (replyStatus === "Z") {
        searchResultVal =
            "<div class='cdc2-no-results-errorMsg'>" +
            "   <b>" + i18n.discernabu.cardiology_device_integration_detail_o2.NO_RESULTS_FOUND.replace("{0}", $("#" + compNs + "SerialText" + compId).val()) + "</b>" +
            "   <br />" +
                i18n.discernabu.cardiology_device_integration_detail_o2.NO_RESULTS_FOUND_1 +
            "</div>";
    } else {
        logger.logScriptCallError(this, reply, "cardiology-device-detail-o2.js", "handleSearchDevice");
        return;
    }

    $("#" + compNs + "SearchResults" + compId).html(searchResultVal);
    //[[Ideally, may want to restrict search to component, but we will trust cdc2 prefix for that]]
    $("#" + compNs + "DevicePGId" + compId).val(pulseGenId);
    //Put pulse gen ID into hidden field. If there were no results, this is set to an empty string.
    //Write these additional fields so that we can warn the user if there's an existing patient assigned to the device.
    // [[[Alternatively, could write properties instead of hidden fields.]]]
    $("#" + compNs + "PersonId" + compId).val(existingPersonId);
    $("#" + compNs + "PersonFullName" + compId).val(existingPatientFullName);
    $("#" + compNs + "DeviceAlias" + compId).val(existingPersonAlias);
    $("#" + compNs + "DeviceAliasType" + compId).val(existingPersonAliasType);
    $("#" + compNs + "confirmMessage" + compId).val(existingPatientFullName + existingFullAlias);
};

/**
 * Constructs an array of device PIDs from the <code>PMkrData</code> and <code>histPMkrData</code> members.
 * @returns {DevicePID[]} An array of device PIDs.
 */
CardiologyDevice_o2Component.prototype.getDevicePIDs = function () {
    var deviceIdx,
        histDeviceCount = this.histPMkrData.length,
        devicePIDs = [];

    if ($.isEmptyObject(this.PMkrData) === false) {
        devicePIDs.push({
            NAME_FULL_FORMATTED: this.PMkrData.PID[0].NAME_FULL_FORMATTED,
            SEX_CDF: this.PMkrData.PID[0].SEX_TXT,
            BIRTH_DT_TM_TXT: this.PMkrData.PID[0].BIRTH_DT_TM_TXT,
            SERIAL_TXT: this.PMkrData.SERIAL_TXT
        });
    }

    for (deviceIdx = 0; deviceIdx < histDeviceCount; deviceIdx++) {
        devicePIDs.push({
            NAME_FULL_FORMATTED: this.histPMkrData[deviceIdx].PID[0].NAME_FULL_FORMATTED,
            SEX_CDF: this.histPMkrData[deviceIdx].PID[0].SEX_TXT,
            BIRTH_DT_TM_TXT: this.histPMkrData[deviceIdx].PID[0].BIRTH_DT_TM_TXT,
            SERIAL_TXT: this.histPMkrData[deviceIdx].SERIAL_TXT
        });
    }

    return devicePIDs;
};

/**
 * Constructs the html for a device panel for associating/disassociating a device. This panel includes the device's patient name, DOB, gender, and device serial number.
 * @param {DevicePID} deviceData Object containing information about the device.
 * @param {STRING} buttonLabel The label to give to the button.
 * @param {STRING} [customInputId] A unique id to give to the button.
 * @returns {STRING} html for the device panel.
 */
CardiologyDevice_o2Component.prototype.constructDevicePanel = function (deviceData, buttonLabel, customInputId) {
    var i18nCardiology = i18n.discernabu.cardiology_device_integration_detail_o2,
        deviceHtml = "",
        customInputIdHtml = customInputId ? "id='" + customInputId + "'" : "";

    deviceHtml +=
        "<div class='cdc2-search-output'>" +
        "   <div class='cdc2-search-data'>" +
        "       <span class='cdc2-search-patient-name'>" + deviceData.NAME_FULL_FORMATTED + "</span>" +
        "       <span class='cdc2-serial-number'>" + deviceData.SERIAL_TXT + "</span>" +
        "       <br />" +
        "       <span class='cdc2-search-patient-dob'>" + i18nCardiology.DOB + " " + this.formatDOB(deviceData.BIRTH_DT_TM_TXT) + "</span>" +
        "       <span class='cdc2-search-patient-details'>" + i18nCardiology.SEX + " " + deviceData.SEX_CDF + "</span>" +
        "   </div>" +
        "   <div class='cdc2-add-device-btn'>" +
        "       <input type='button' " + customInputIdHtml + " name='cdc2-add-device-button' class='cdc2-associate-device-button' value='" + buttonLabel + "'/>" +
        "   </div>" +
        "   <div class='cdc2-clear-columns'></div>" +
        "</div>";

    return deviceHtml;
};

/**
 * Handler for resizing. Will fit the current document to container when called.
 *
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.resizeComponent = function () {
    if (CERN_Platform.inMillenniumContext()) {
        //In powerchart
        this.fitDocumentToContainer();
    } else {
        this.fitDocumentToContainerForWebEnablement();
    }
};

/**
 * This function will resize the iframe with parent div
 *
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.fitDocumentToContainerForWebEnablement = function () {
    var $thisComponent = $("#" + this.m_rootComponentNode.id),
        $pdfIFrame = $thisComponent.find("#cdc2-document-viewer-webenabled"),
        $pdfContainer = $thisComponent.find("#cdc2-pdf-renderer-0");

    $pdfIFrame.height($pdfContainer.height());
    $pdfIFrame.width($pdfContainer.width());
};

/**
 * Will set the zoom level of the displayed document such that there is no horizontal scrollbar
 *
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.fitDocumentToContainer = function () {
    var $documentViewer,
        documentWidth,
        zoomLevel,
        documentViewerWidth,
        scrollBarWidth = 25;

    $documentViewer = $("#cdc2-document-viewer-activeX-0")[0];

    // make sure the document viewer is loaded before attempting to reference its PageWidth property
    if ($documentViewer !== undefined) {
        documentWidth = $documentViewer.PageWidth;

        // documentWidth will be 0 if no document is loaded; don't bother fitting the document if one isn't loaded
        if (documentWidth !== 0) {
            // be sure to remove the width of the scrollbar from the document viewer's width. normally, this could be done by
            //  getting the innerWidth, but since the scrollbar is coming from inside the ActiveX control, we have to make a good guess of scrollBarWidth's initialized value
            zoomLevel = screen.deviceXDPI / screen.logicalXDPI;
            documentViewerWidth = $("#cdc2-document-viewer-activeX-0").width();
            $documentViewer.Zoom = (documentViewerWidth - scrollBarWidth) * zoomLevel / documentWidth * 100;
        }
    }
};

/**
 * Shifts to the selected page immediately
 *
 * @param {OBJECT} eventData Contains a reference to the documentViewer object.
 * @returns {BOOL} false if the requested page cannot be jumped to. true, otherwise.
 */
CardiologyDevice_o2Component.prototype.jumpToPage = function (eventData) {
    var $self,
        currentPage,
        desiredPage,
        totalPages,
        currPgNumField,
        i;

    $self = eventData.data.scope;
    currPgNumField = eventData.data.currPgNumField;
    desiredPage = currPgNumField.value;
    currentPage = $self.currentPage;

    if (isNaN(desiredPage) || desiredPage === "") {
        currPgNumField.value = currentPage;
        return false;
    }

    totalPages = $self.totalPages;
    desiredPage = parseInt(desiredPage, 10);

    if (desiredPage > totalPages) {
        desiredPage = totalPages;
        currPgNumField.value = desiredPage;
    }

    if (desiredPage > currentPage) { // Incrementing
        for (i = currentPage; i < desiredPage; i++) {
            $self.nextPageDocument(eventData);
        }
    } else { // Decrementing
        for (i = currentPage; i > desiredPage; i--) {
            $self.prevPageDocument(eventData);
        }
    }

    return true;
};

/**
 * Opens the currently viewed pdf in the component in a new window by calling <code>CCLLINK</code>.
 * @param {OBJECT} eventData Information from the click event.
 * @returns {BOOL} false
 */
CardiologyDevice_o2Component.prototype.openPDFInNewWindow = function (eventData) {
    var $self,
        docID;

    $self = eventData.data.scope;
    docID = $self.activeDocID;

    CCLLINK("pex_disp_pulse_gen_episode_doc", "^MINE^,^" + docID + "^", 1);
    return false;
};

/**
 * Print the document that is in the Document Viewer
 *
 * @param {OBJECT} eventData Contains a reference to the documentViewer object.
 * @returns {BOOL} false
 */
CardiologyDevice_o2Component.prototype.printActivePDFDoc = function (eventData) {
    // Send 1 to send it to a physical printer (instead of the backend; the 2nd param is ignored)
    eventData.data.documentViewer.Print(1, "");
    return false;
};

/**
 * Displays a document in the Document Viewer
 *
 * @param {OBJECT} eventData - Contains a reference to the following parameters
 * @param {OBJECT} eventData.data.scope - A reference to the component itself
 * @param {OBJECT} eventData.data.parentClass - the parent element of the element clicked
 * @param {OBJECT} eventData.data.buttonObject - the episode/session clicked
 * @param {string} eventData.data.docUID - the unique ID that identifies the PDF in CAMM
 * @param {number} eventData.data.docLen - the length of the document
 * @param {OBJECT} eventData.data.documentViewer - the activeX PDF control
 * @param {OBJECT} previousPageButton - the previous Button object
 * @param {OBJECT} nextPageButton - the next Button object
 * @param {number} CurrentPagenumber - the current Page number
 * @param {string} eventData.data.subTimerName - Name of the timer being used
 * @returns {UNDEFINED} Nothing
 */
CardiologyDevice_o2Component.prototype.displayDocument = function (eventData) {
    var $self,
        classScope,
        $buttonObj,
        buttonObj,
        pdfTitle,
        currentBtn,
        pdfPageCount,
        documentViewer,
        prevButtonObj,
        nextButtonObj,
        subTimerName,
        slaTimerEpisode,
        slaTimerSession;

    try {
        //If a episode has no PDF data, just return
        //If the JQuery button Object being passed is null, just return
        //If the PDF Document Viewer activeX Control is not defined, just return
        //If previousPage or nextPage Button is undefined, just return
        //If JQuery button Object does not cotain anything, that is of length 0
        if (CERN_Platform.inMillenniumContext()) {
            if (!eventData.data.buttonObject || eventData.data.docUID === "" || !eventData.data.documentViewer || !eventData.data.prevButtonObj || !eventData.data.nextButtonObj || eventData.data.buttonObject.length === 0) {
                return;
            }
        } else if (!eventData.data.buttonObject || eventData.data.docUID === "" || !eventData.data.documentViewer || eventData.data.buttonObject.length === 0) {
            return;
        }
        eventData = eventData.data;

        $self = eventData.scope; // Button Object Scope
        classScope = eventData.parentClass; // CardiologyDevice_o2Component scope
        $buttonObj = eventData.buttonObject; // jQuery button object
        buttonObj = $buttonObj[0]; // Vanilla HTML button object

        if ($buttonObj[0].id.indexOf("cdc2-historical-interrogations") > -1) {
            pdfTitle = $buttonObj.find("span").first().text(); //Selecting just the title of the session
        } else {
            pdfTitle = buttonObj.textContent; // content of the menu item selected (PDF's name)
        }
        currentBtn = classScope.selectedPDF; // The currently-selected button object (to de-select it)

        $("#cdc2-pdf-control-label").html("<div>" + pdfTitle + "</div>");
        //To de-select the currently selected PDF
        if (currentBtn != null) {
            currentBtn.className = currentBtn.className.replace("-selected", "");
        }

        classScope.selectedPDF = buttonObj;
        buttonObj.className = buttonObj.className + "-selected";

        documentViewer = eventData.documentViewer;
        subTimerName = eventData.subTimerName;
        documentViewer.className = "cdc2-document-viewer-activeX";
        if (CERN_Platform.inMillenniumContext()) {
            pdfPageCount = eventData.docLen;
            prevButtonObj = eventData.prevButtonObj;
            nextButtonObj = eventData.nextButtonObj;
            $self.updatePDFPageCount(pdfPageCount);
        }
        $self.activeDocID = eventData.docUID;
        slaTimerEpisode = MP_Util.CreateTimer("USR:MPG.Cardiology.Device.Detail.o2 - get episode doc");
        slaTimerSession = MP_Util.CreateTimer("USR:MPG.Cardiology.Device.Detail.o2 - get session doc");

        if (CERN_Platform.inMillenniumContext()) {
            documentViewer.ExecuteReport("pex_disp_pulse_gen_episode_doc", "^MINE^,^" + eventData.docUID + "^");
        } else {
            documentViewer.innerHTML = "<iframe id='cdc2-document-viewer-webenabled' src='pex_disp_pulse_gen_episode_doc?parameters=^MINE^,^" + eventData.docUID + "^' width='" + $("#cdc2-pdf-renderer-0").width() + "' height='" + $("#cdc2-pdf-renderer-0").height() + "'  scrolling='yes'></iframe></div>";
        }

        if (slaTimerEpisode) {
            slaTimerEpisode.subTimerName = subTimerName;
            slaTimerEpisode.Stop();
        }
        if (slaTimerSession) {
            slaTimerSession.subTimerName = subTimerName;
            slaTimerSession.Stop();
        }

        if (CERN_Platform.inMillenniumContext()) {
            nextButtonObj.className = pdfPageCount > 1 ? "cdc2-pdf-control-next-page" : "cdc2-pdf-control-next-page-disabled";
            prevButtonObj.className = "cdc2-pdf-control-pref-page-disabled";
        }
    } catch (err) {
        throw err;
    }
};

/**
 * Flip to the next page in the Document Viewer
 *
 * @param {OBJECT} eventData Contains a reference to the documentViewer object.
 * @returns {BOOL} true
 */
CardiologyDevice_o2Component.prototype.nextPageDocument = function (eventData) {
    var $self,
        documentViewer,
        prevButtonObj,
        nextButtonObj,
        currPgNumField;

    try {
        eventData = eventData.data;

        $self = eventData.scope;
        documentViewer = eventData.documentViewer;
        prevButtonObj = eventData.prevButtonObj;
        nextButtonObj = eventData.nextButtonObj;
        currPgNumField = eventData.currPgNumField;

        if (documentViewer.CanViewNextPage() === true) {
            $self.currentPage += 1;
            currPgNumField.value = $self.currentPage;
            prevButtonObj.className = "cdc2-pdf-control-pref-page";
            documentViewer.ViewNextPage();
        }

        nextButtonObj.className = documentViewer.CanViewNextPage() === true ? "cdc2-pdf-control-next-page" : "cdc2-pdf-control-next-page-disabled";
        return true;
    } catch (err) {
        throw err;
    }
};

/**
 * Flip to the previous page in the Document Viewer
 *
 * @param {OBJECT} eventData Contains a reference to the documentViewer object.
 * @returns {BOOL} true
 */
CardiologyDevice_o2Component.prototype.prevPageDocument = function (eventData) {
    var $self,
        documentViewer,
        prevButtonObj,
        nextButtonObj,
        currPgNumField;

    try {
        eventData = eventData.data;

        $self = eventData.scope;
        documentViewer = eventData.documentViewer;
        prevButtonObj = eventData.prevButtonObj;
        nextButtonObj = eventData.nextButtonObj;
        currPgNumField = eventData.currPgNumField;

        if (documentViewer.CanViewPrevPage() === true) {
            $self.currentPage -= 1;
            currPgNumField.value = $self.currentPage;
            nextButtonObj.className = "cdc2-pdf-control-next-page";
            documentViewer.ViewPrevPage();
        }

        prevButtonObj.className = documentViewer.CanViewPrevPage() === true ? "cdc2-pdf-control-pref-page" : "cdc2-pdf-control-pref-page-disabled";
        return true;
    } catch (err) {
        throw err;
    }
};

/**
 * Updates the element responsible for displaying the total number of pages in the PDF.
 * Reinitializes class members responsible for current PDF page and total PDF pages.
 * @param {NUMBER} pageCount The number of pages to display for the total number of pages.
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.prototype.updatePDFPageCount = function (pageCount) {
    this.currentPage = 1;
    this.totalPages = pageCount;
    $("#cdc2-indicator-total-pages")[0].innerHTML = this.totalPages;
};

/**
 * Construct the component's HTML from the script reply.
 * @param {object} recordData The reply from <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_GET_ICD_INFO">PEX_GET_ICD_INFO</a></code>.
 * @returns {string} The component's HTML.
 */
CardiologyDevice_o2Component.prototype.renderComponent = function (recordData) {
    var opHTML,
        count;

    try {
        this.scopeId = this.m_rootComponentNode.id;
        this.scopeObj = $("#" + this.scopeId);
        this.JSONData = recordData;
        this.DataLoaded = true;
        this.staticImagePath = this.getCriterion().static_content + "/images";
        this.createSessionEpisodeHierarchy();

        for (count = 0; count < this.modalArr.length; count++) {
            MP_ModalDialog.closeModalDialog(this.modalArr[count]);
        }

        // Create a blank string that will ultimately contain all of the side panel's constructed HTML
        opHTML = "";
        // Construct the Interrogation/Episode Scrolling Treeview Side Panel's HTML
        opHTML += this.constructHeaderData();
        if (this.Episodes.length > 0 || this.Sessions.length > 0) {
            // Construct the Interrogation/Episode Scrolling Treeview Side Panel's HTML
            opHTML += this.constructSidePanel();
            // Construct the PDF Viewer Component's panel
            opHTML += this.constructPDFViewerPanel(this.i18n.CLICK_PDF_TO_DISPLAY);
        } else {
            opHTML += this.i18n.NO_DEVICE;
            this.alreadyPostProcessed = true;
            this.enableDisassociationMenuItem();
        }

        MP_Util.Doc.FinalizeComponent(opHTML, this, "");
        return opHTML;
    } catch (err) {
        throw err;
    }
};

/**
 * @class
 * @classdesc Build the custom search for the address book search
 * @constructor
 * @param {HTMLElement} element - The element on which to create the search box on.
 * @param {number} personId - The current patient's person id.
 * @param {number} encounterId - The current patient's encounter id.
 */
CardiologyDevice_o2Component.AddressBookSearch = function (element, personId, encounterId) {
    this.suggestionLimit = 5;
    this.selectedPrsnlId = 0.0;
    this.personId = personId;
    this.encounterId = encounterId;

    //call the base class constructor
    MPageControls.CclSearch.call(this, element);

    this.setProgramName("mp_addr_book_name_search");
};

CardiologyDevice_o2Component.AddressBookSearch.prototype = new MPageControls.CclSearch();

/**
 * Set the suggestion count for the search
 * @param {Number} cnt - Suggestion count
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.AddressBookSearch.prototype.setSuggestionLimit = function (cnt) {
    this.suggestionLimit = parseInt(cnt, 10);
};

/**
 * Get the suggestion count for the search
 * @returns {Number} Suggestion count
 */
CardiologyDevice_o2Component.AddressBookSearch.prototype.getSuggestionLimit = function () {
    return this.suggestionLimit;
};

/**
 * Constructs parameters for the script call
 * @returns {string} parameters for the CCL script
 */
CardiologyDevice_o2Component.AddressBookSearch.prototype.buildParameters = function () {
    return "^" + this.getValue() + "^," + this.personId + ".0," + this.encounterId + ".0";
};

/**
 * Call the script to perform the address book name search
 * @param {Function} [callback] - Call back function
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.AddressBookSearch.prototype.callProgram = function (callback) {
    var self = this;
    var reqNumber;
    var url;
    var xhr = CERN_BrowserDevInd ? new XMLHttpRequest() : new XMLCclRequest();

    // only search if the characters entered are 3 or more
    if (this.getValue().length < 3) {
        return;
    }

    // increase the request count
    this.setRequestCount(this.getRequestCount() + 1);
    reqNumber = this.getRequestCount();

    // Handle response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            MP_Util.LogScriptCallInfo(null, this, "cardiology detail address book name search", "callProgram");
            self.handleSuccess(reqNumber, xhr.responseText, callback);
        }
    };

    // Send request
    if (CERN_BrowserDevInd) {
        url = this.getInBrowserDir() + this.getProgramName() + "?parameters=" + this.buildParameters();
        xhr.open("GET", url);
        xhr.send(null);
    } else {
        xhr.open("GET", this.getProgramName());
        xhr.send(this.buildParameters());
    }
};

/**
 * Handles the response from the address book name search script call
 * @param {Number} reqNumber - Request number
 * @param {String} responseText - CCl response
 * @param {Function} [callback] - Call back function
 * @returns {undefined} Nothing
 */
CardiologyDevice_o2Component.AddressBookSearch.prototype.handleSuccess = function (reqNumber, responseText, callback) {
    var jsonSearch;
    // ensure we are processing the latest request made
    if (reqNumber !== this.getRequestCount() || !responseText) {
        return;
    }

    jsonSearch = JSON.parse(responseText);

    // Handle failed CCL call
    if (jsonSearch.REPLY.STATUS_DATA.STATUS === "F") {
        logger.logScriptCallError(null, responseText, "cardiology detail address book name search", "handleSuccess");
        logger.logError(this.getProgramName() + " failed: " + responseText);
        return;
    }
    if (callback) {
        callback(this.makeContext(jsonSearch));
    } else {
        this.setSuggestions(this.makeContext(jsonSearch));
    }
};

/**
 * Adds any personnel in returnData to an array of objects that can be consumed by the parent class
 * @param {Object} returnData - Returned record data
 * @returns {Array} Collection of personnel names from returnData
 */
CardiologyDevice_o2Component.AddressBookSearch.prototype.makeContext = function (returnData) {
    var prsnlArr = [],
        prsnlIdx,
        prsnlLen = returnData.REPLY.PRSNL.length,
        prsnl;

    for (prsnlIdx = 0; prsnlIdx < prsnlLen; prsnlIdx++) {
        prsnl = returnData.REPLY.PRSNL[prsnlIdx];
        prsnl.content = prsnl.PRSNL_NAME_FULL_FORMATTED;
        prsnlArr.push(prsnl);
    }

    return prsnlArr;
};

MP_Util.setObjectDefinitionMapping("WF_CARDIO_DEVICE", CardiologyDevice_o2Component);
