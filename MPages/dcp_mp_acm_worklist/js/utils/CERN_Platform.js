/*globals pvFrameworkLink, Infobutton, MPAGES_EVENT*/

/**
 * @namespace
 * The CERN_Platform namespace is utilized to house information about the Millennium Platform.  It also contains functions
 * which will allow the consumer to indirectly interact with specific Millennium Win32 APIs.  Essentially the CERN_Platform will
 * act as a middle man between the Millennium platform and the consumer.  This will allow the for passivity when MPages are being
 * run within and outside of a Millennium context.  More specific information can be found in each of the available functions below.
 */
var CERN_Platform = {
	m_inMillenniumContext: null,
	m_inPatientChartContext: null,
	m_inTouchMode: false,
	m_scriptServletLoc: "",
	m_webappRoot : null,
	m_criterion: null
};

/**
 * This function is used to retrieve the criterion object that is used to identify basic information about the execution of
 * an MPageView.
 * @return {object} The parsed criterion object
 */
CERN_Platform.getCriterion = function(){
	if(!this.m_criterion){
		try{
			this.m_criterion = JSON.parse(m_criterionJSON);
		}
		catch(err){
			logger.logError("Unable to successfully parse the criterion JSON: " + m_criterionJSON);
			throw new Error("Unable to successfully parse the criterion JSON");
		}
	}
	return this.m_criterion;
};

/**
 * Returns an object via DiscernObjectFactory with the specified name. If not within the context of Millennium,
 * getDiscernObjectWebEquivalent function returns the web equivalent of a Discern object if it exists else null will
 * be returned.
 * @param {string} objectName - The name of the object to be obtained via DiscernObjectFactory or web equivalent of a Discern object.
 * @returns {object} The discern object or its web equivalent if available
 */
CERN_Platform.getDiscernObject = function (objectName) {
	try {
		return this.inMillenniumContext() ? window.external.DiscernObjectFactory(objectName) : this.getDiscernObjectWebEquivalent(objectName);
	} catch (exe) {
		logger.logError("In CERN_Platform.getDiscernObject: An error occurred when trying to retrieve: " + objectName + " from window.external.DiscernObjectFactory");
		return null;
	}
};

/**
 * This function will return the web equivalent of a Discern object if it exists.  Web equivalents mimic the APIs that are available
 * within Discern Object.
 * @param {string} discernObjectName The name of the discern object being retrieved
 * @return {object} The web equivalent of the discern object or null if it does not exist
 */
CERN_Platform.getDiscernObjectWebEquivalent = function(discernObjectName){
	switch(discernObjectName){
		case "DOCUTILSHELPER":
			return null; //docUtilsHelper;
		case "AUTOTEXTHELPER":
			return null; //autotextHelper;
		case "PVFRAMEWORKLINK":
			return pvFrameworkLink;
		case "INFOBUTTONLINK":
			return new Infobutton();
		case "CHECKPOINT":
			return new webCheckpoint.checkpoint();
		case "PVCONTXTMPAGE":
			return WebPVContxtMpage;	
		default:
			return null;
	}
};

/**
 * The inMillenniumContext function can be used to determine if the the current MPage is being run from within the context of a
 * Millennium application or not.  From there the consumer can utilize Win32 pieces of functionality or gracefully degrade based on the
 * availability of alternative solutions.
 * @return {boolean} true if the mpage is being run within Millennium, false otherwise.
 */
CERN_Platform.inMillenniumContext = function () {
	if (this.m_inMillenniumContext === null) {
		this.m_inMillenniumContext = (window.external && (typeof window.external.DiscernObjectFactory !== "undefined")) ? true : false;
	}
	return this.m_inMillenniumContext;
};

/**
 * This function is used to determine if the MPagesView is being shown within the context of a patient's chart.
 * It determines this by checking the global criterion object for a person_id.  If that is populated, the MPages
 * is for sure being shown within some patient context.  Otherwise, if it is not populated we can assume the MPage
 * is being shown in a different context.
 * @return {boolean} True if the MPage is being shown within a patient context, false otherwise
 */
CERN_Platform.inPatientChartContext = function(){
	if (this.m_inPatientChartContext === null) {
		//Get the criterion object and check the personid
		var criterion = this.getCriterion().CRITERION;
		this.m_inPatientChartContext = criterion.PERSON_ID ? true : false;
	}
	return this.m_inPatientChartContext;
};

/**
 * Returns a flag indicating if touch mode is enabled
 * @returns {boolean} A flag indicating if touch mode is enabled
 */
CERN_Platform.isTouchModeEnabled = function () {
	return this.m_inTouchMode;
};

/**
 * Sets the servlet location.
 * @param {String} servletLocation A string used to indicate the location of servlet.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setScriptServletLocation = function(servletLocation) {
    this.m_scriptServletLoc = servletLocation;
};

/**
 *Gets the servlet location.
 *@returns {String} A string used to indicate the location of the script servlet.
 */
CERN_Platform.getScriptServletLocation = function() {
    return this.m_scriptServletLoc;
};

 /*
 * Sets a flag to indicate if touch mode is enabled
 * @param {boolean} touchModeFlag A flag to indicate if touch mode is enabled
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setTouchModeEnabled = function (touchModeFlag) {
	this.m_inTouchMode = touchModeFlag;
	// Add a class to body if touch mode is enabled
	// No need to remove the class if touch mode is disabled because the page refreshes and MPage is painted again
	if(touchModeFlag){
		$("body").addClass("touch-mode");
	}
};

/**
 * Single function to redirect the page, for use in CCLLINK replacement
 * @param {Object} newUrl The new page location
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setLocation = function(newUrl){
	window.location.assign(newUrl);
};

/**
 * This function is used to refresh the MPage View programatically.  Determines the parameters to utilze based on the 
 * context of the MPage.
 */
CERN_Platform.refreshMPage = function(){
	var criterion = CERN_Platform.getCriterion().CRITERION;
	var cclParams = null;
	
	//Determine if we are viewing the current MPage in a patient context
	if(CERN_Platform.inPatientChartContext()){
		cclParams = ["^MINE^", criterion.PERSON_ID + ".0", criterion.ENCNTRS[0].ENCNTR_ID + ".0", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", criterion.PPR_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", criterion.DEBUG_IND];
	}
	else{
		cclParams = ["^MINE^", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", criterion.DEBUG_IND];
	}
	CCLLINK(CERN_driver_script, cclParams.join(","), 1);
};

/**
 * This function will create a global CCLLINK function that will launch a CCL program through the MPages webserver and displaying the contents.
 * This also prevents situations where IE pre-loads global functions before JS execution.
 * @param {String} reportName - CCL program name
 * @param {String} prompts - prompt parameters for the reportName
 * @param {String} linkDestination - a function used in the original CCLLINK to determine if the URL is launched into a separate DiscernReportViewer.
 * 										This is ignored in this implementation.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.CCLLINK = function(reportName, prompts, linkDestination){
	//For web enabled MPages, only enable CCLLINK functionality if the reportName is "MP_UNIFIED_DRIVER" or "MP_UNIFIED_ORG_DRIVER".  
	//All other implementations should fail silently.
	if(/^MP_UNIFIED_.*DRIVER/.test(reportName.toUpperCase())){
		CERN_Platform.setLocation(window.location.href);
	} else {
		logger.logWarning("CCLLINK is not supported outside of Millennium for program: " + reportName + ".");
	}
};

/**
 * A replacement for the MPAGES_EVENT function that will do nothing, but prevent a failure.
 * @param {String} eventType - the type of event to be used.  This will be ignored in this function
 * @param {String} eventParams - the parameters of the event to be used.  This will be ignored in this function.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.MPAGES_EVENT = function(eventType, eventParams){
	return;
};

/**
 * This function will create a global APPLINK function that will do nothing, but prevent a failure.
 * @param {Integer} mode - A numeric value representing the mode to start the application link
 * 		0 - Used for starting a solution by executable name
 * 		1 - Used for starting a solution by the application object, such as DiscernAnalytics.Application
 * 		100 - Used to launch a file, link, or executable through a shell execute.
 * @param {String} appname - The application executable name
 * @param {String} params - The person_id, encntr_id and Powerchart tab name.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.APPLINK = function(mode, appname, params){
	return;
};

/*This function retrieves a cookie that contains info about the context root for the webpage
 * Then creates and returns the mpRoot as a string
 */
CERN_Platform.makeRoot = function(){
	return document.cookie.replace(/(?:(?:^|.*;\s*)mpRoot\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};

/**
 * This function will attempt to read the context root of the webapp from a cookie named "mpRoot", and then return the full URL 
 *   of the webapp with context root.
 *   Note that the "mpRoot" cookie is the context root string is created by the login.jsp page.
 * @param none
 * @returns {String} A string representing the full URL of the webapp.  For example: "https://subDomainName.domainName.com/webappName/canonical.domain.name"
 */
CERN_Platform.getWebappRoot = function() {
	var setWebAppRoot = function (newRoot) {	
		if (newRoot) {
			CERN_Platform.m_webappRoot = location.protocol + "//" + location.host + newRoot;
		}
	};

	if (typeof this.m_webappRoot !== 'string') {
		setWebAppRoot(CERN_Platform.makeRoot());
	}
	return this.m_webappRoot;
};


/**
 * This code will update the CCLLINK function if necessary, ensuring that it's action is similar both inside and outside of a Win32
 * context.  It is defined at a global level since CCLLINK is defined at the global level.  Default CCLLINK functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/CCLLINK
 */
if(typeof CCLLINK === "undefined"){
	CCLLINK = CERN_Platform.CCLLINK;
}

/**
 * This code will update the MPAGES_EVENT function if necessary, ensuring that it's action is will not cause a failure message.
 * It is defined at a global level since MPAGES_EVENT is defined at the global level.  Default MPAGES_EVENT functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/MPAGES_EVENT
 */
if(typeof MPAGES_EVENT === "undefined"){
	MPAGES_EVENT = CERN_Platform.MPAGES_EVENT;
}

/**
 * This code will update the APPLINK function if necessary, ensuring that it's action is similar both inside and outside of a Win32
 * context.  It is defined at a global level since APPLINK is defined at the global level.  Default APPLINK functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/APPLINK
 */
if(typeof APPLINK === "undefined"){
	APPLINK = CERN_Platform.APPLINK;
}
/**
 * The pvFrameworkLink is the web equivalent of the PVFRAMEWORKLINK API used in the context of Millennium.
 */
var pvFrameworkLink = {
	m_pendingDataIndicator : 0
};

/**
 * Sets the pending data indicator for the pvFrameworkLink implementation of PVFRAMEWORKLINK.
 * @param {Integer} pendingDataIndicator - The pending data indicator.
 * 0 = false (no pending data)
 * 1 = true (pending data)
 */
pvFrameworkLink.SetPendingData = function(pendingDataIndicator) {
	if(typeof pendingDataIndicator !== "number" || pendingDataIndicator < 0 || pendingDataIndicator > 1) {
		throw new Error("Error: pvFrameworkLink.SetPendingData expects an integer value of 0 or 1.");
	}
	this.m_pendingDataIndicator = pendingDataIndicator;
};

/**
 * Web implementation of PVFRAMEWORKLINK LaunchPopup. Does nothing in browser.
 * @constructor
 */
pvFrameworkLink.LaunchPopup = function() {
	logger.logWarning("PVFRAMEWORKLINK: LaunchPopup is not supported outside of Millennium.");
};

/**
 * Web implementation of PVFRAMEWORKLINK SetPopupBoolProp. Does nothing in browser.
 * @param {String} propertyName - The boolean property name.
 * @param {Integer} propertyIndicator - The boolean property value (0 = false, 1 = true)
 */
pvFrameworkLink.SetPopupBoolProp = function(propertyName, propertyIndicator) {
	logger.logWarning("PVFRAMEWORKLINK: SetPopupBoolProp is not supported outside of Millennium.");
};

/**
 * Web implementation of PVFRAMEWORKLINK SetPopupStringProp. Does nothing in browser.
 * @param {String} propertyName - The string property name.
 * @param {String} propertyStringValue - The string value for the specified propertyName.
 */
pvFrameworkLink.SetPopupStringProp = function(propertyName, propertyStringValue) {
	logger.logWarning("PVFRAMEWORKLINK: SetPopupStringProp is not supported outside of Millennium.");
};

/**
 * Web implementation of PVFRAMEWORKLINK SetPopupDoubleProp. Does nothing in browser.
 * @param {String} propertyName - The double property name.
 * @param {Number} propertyDoubleValue - The double value for the specified propertyName.
 */
pvFrameworkLink.SetPopupDoubleProp = function(propertyName, propertyDoubleValue) {
	logger.logWarning("PVFRAMEWORKLINK: SetPopupDoubleProp is not supported outside of Millennium.");
};

/**
 * Web implementation of PVFRAMEWORKLINK SetPopupLongProp. Does nothing in browser.
 * @param {String} propertyName - The long property name.
 * @param {Number} propertyLongValue - The long value for the specified propertyName.
 */
pvFrameworkLink.SetPopupLongProp = function(propertyName, propertyLongValue) {
	logger.logWarning("PVFRAMEWORKLINK: SetPopupLongProp is not supported outside of Millennium.");
};

/**
 * Web implementation of PVFRAMEWORKLINK SetStoreInfo. Does nothing in browser.
 * @param {String} propertyName - The key string value.
 * @param {Object} propertyValue - The value for the specified key.
 */
pvFrameworkLink.SetStoreInfo = function(propertyName, propertyValue) {
	logger.logWarning("PVFRAMEWORKLIN: SetStoreInfo is not supported outside of Millennium.");
};
/**
 * @class
 * This webCheckpoint object is the main entry point of the CHECKPOINT API for web enabled MPages.
 * It maintains session info such as process ID and thread ID needed by the RTMS subsystem.
 * It bundles individual CHECKPOINTS generated in JavaScript and sends them to the /checkpoint restlet
 *   available in web enabled MPages.
 * This is a self executing function, and is done this way to avoid any race conditions when initializing
 *   the webCheckpoint.checkpoints object.
 */

var webCheckpoint = function(){

	var checkpoints = {};
	var api;

	/**
	 * Function to initialize the checkpoints object and values within.
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name calculateOffset
	 * @return {undefined} Nothing
	 */
	function chkInit(){
		//Variables for calculating random min/max ProcessID and ThreadID values
		var maxPID = 99999999;
		var minPID = 1;
		var maxTID = 999;
		var minTID = 1;
		checkpoints.PID = "" + Math.floor(Math.random() * (maxPID - minPID + 1)) + minPID;
		checkpoints.PTM = "" + (new Date()).valueOf();
		checkpoints.TID = "" + Math.floor(Math.random() * (maxTID - minTID + 1)) + minTID;
		checkpoints.NODE = location.protocol + "//" + location.host;
		checkpoints.APP = "MPages Web";
		checkpoints.CHKS = [];

		//Self executing function to submit queued timers in batches every 30 seconds
		(function runSubmit() {
			try{
				webCheckpoint.submit();
			} catch (exe) {
				//do nothing
			}
			setTimeout(runSubmit, 30000);
		})();

		// Add onbeforeunload listener to submit all queued checkpoints.
		// This function gets called upon navigation away from the webpage (redirect/refresh/close) and
		// guarantees the submission of all checkpoints that currently exist within the checkpoint batch array.
		window.onbeforeunload = function() {
			webCheckpoint.submit();
		};
	}

	/**
	 * Calculates the time offset between Process start time and the time the
	 * checkpoint is created
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name calculateOffset
	 * @param {number} processStartTime The raw javascript time for when the process started
	 * @return {string} Representation of the calculated offset in nanoseconds
	 */
	function calculateOffset(processStartTime){
		//Multiply by 1000000 to convert milliseconds to nanoseonds
		return ((new Date()).valueOf() - processStartTime) * 1000000 + "";
	}

	/**
	 * Clears checkpoints from the the checkpoint queue
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name clearQueuedCheckpoints
	 * @return {undefined} Nothing
	 */
	function clearQueuedCheckpoints() {
		checkpoints.CHKS.length = 0;
	}


	/**
	 * Sets the node name for the checkpoint
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkSetNodeName
	 * @param {string} nodeName The node name passed to RTMS. For example, "http://webserver/webapp_context_root"
	 * @return {undefined} Nothing
	 */
	function chkSetNodeName(nodeName){
		checkpoints.NODE = nodeName;
	}

	/**
	 * Sets the Application name for the checkpoint
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkSetAppName
	 * @param {string} applicationName The application name passed to RTMS. For example, "MPages Web".
	 * @return {undefined} Nothing
	 */
	function chkSetAppName(applicationName){
		checkpoints.APP = applicationName;
	}

	/**
	 * Return the Process Start Time (PTM) value from the checkpoints object
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkGetProcessStartTime
	 * @return {string} The Process Start Time (PTM) value from the checkpoints object
	 */
	function chkGetProcessStartTime() {
		return checkpoints.PTM;
	}

	/**
	 * Return the JSON string representation of the webCheckpoint.checkpoints object
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkToJSON
	 * @return {undefined} Nothing
	 */
	function chkToJSON() {
			return JSON.stringify(checkpoints);
	}

	/**
	 * Add a published checkpoint instance to the queue for submittal to the ./mpages/checkpoint restlet.
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkAddCheckpoint
	 * @param {Object} [checkpoint] An instance of webCheckpoint.checkpoint()
	 * @param {String} [checkpoint.ProjectName] The project name for the timer
	 * @param {String} [checkpoint.ClassName] The class name for the timer
	 * @param {String} [checkpoint.EventName] The event name for the timer
	 * @param {String} [checkpoint.SubEventName] The sub event name for the timer
	 * @param {String} [checkpoint.Offset] The offset from the process start time for the timer
	 * @param {Object} [checkpoint.MetaData] Arbitrary metadata for that timer that can be any number of name-value pairs
	 * @return {undefined} Nothing
	 */
	function chkAddCheckpoint(checkpoint){
		var tChk = {};
		tChk.PN = checkpoint.ProjectName || "";
		tChk.CN = checkpoint.ClassName || "";
		tChk.EN = checkpoint.EventName || "";
		tChk.SN = checkpoint.SubEventName || "";
		tChk.OT = checkpoint.Offset || calculateOffset(this.getProcessStartTime());
		tChk.META = checkpoint.m_metaData || {};
		checkpoints.CHKS.push(tChk);
	}

	/**
	 * Return the collection of checkpoint objects
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkGetCheckpoints
	 * @return {object} The checkpoints in webCheckpoint.checkpoints
	 */
	function chkGetCheckpoints() {
		return checkpoints;
	}

	/**
	 * Object that is similar to a single instace of window.external.DiscernObjectFactory("CHECKPOINT")
	 *
	 * @function
	 * @memberof webCheckpoint
	 * @name chkCheckpoint
	 * @return {object} A CHECKPOINT object that is equivalent to that of the win32 "CHECKPOINT" object
	 */
	function chkCheckpoint() {
		var chkObj = {};
		chkObj.ClassName = "";
		chkObj.ProjectName = "";
		chkObj.EventName = "";
		chkObj.SubEventName = "";
		chkObj.m_metaData = {};
		chkObj.MetaData = function(key, value) {
			if(this.m_metaData && key && value) {
				try {
					this.m_metaData[key] = value;
				} catch (e) {
					logger.logError("Error adding MetaData [" + key + "] = " + value + "; on Checkpoint");
				}
			}
		};
		chkObj.Publish = function(){
			webCheckpoint.addCheckpoint(this);
		};
		return chkObj;
	}


	/**
	 * Submit array of queued checkpoints to the J2EE timer restlet
	 *
	 * @static
	 * @function
	 * @memberof webCheckpoint
	 * @name chkSubmit
	 * @return {undefined} Nothing
	 */
	function chkSubmit(){
		if(checkpoints.CHKS && checkpoints.CHKS.length === 0){
			return false;
		}
		try{
			var endpoint = CERN_Platform.getWebappRoot() + "/mpages/checkpoint";
			var postObj = {};
			postObj.checkpoint = webCheckpoint.toJSON();
			//After the JSON string to POST has been created, clear out any checkpoints that have been queued:
			clearQueuedCheckpoints();

			$.ajax(
				{
					type: "POST",
					contentType: "application/json",
					url: endpoint,
					data: postObj,
					success: function( ){
						logger.logDebug("SUCCESS!");
					},
					error: function(jqXHR, textStatus, errorThrown) {
						logger.logError("Error occurred from submit checkpoints  <br />Status: " + textStatus + "<br />HTTP error: " + errorThrown);
					}
				}
			);
		} catch(e){
			logger.logError("Error encountered trying to submit checkpoints: <br />Message: " + e.description + "<br />Name: " + e.name + "<br />Number: " + e.number);
		}
	}

	//Only initialize the webCheckpoint.checkpoints object if executing outside of win32 applications.
	if(!CERN_Platform.inMillenniumContext()){
		chkInit();
	}

	// Construct and return the public API.
	api = {
		"setNodeName": chkSetNodeName,
		"getProcessStartTime": chkGetProcessStartTime,
		"setAppName": chkSetAppName,
		"addCheckpoint": chkAddCheckpoint,
		"getCheckpoints": chkGetCheckpoints,
		"submit": chkSubmit,
		"checkpoint": chkCheckpoint,
		"toJSON": chkToJSON,
		"init": chkInit
	};

	return api;
}();
/**
 * @class
 * This class wraps the checkpoint system. It allows developers to make use of the RTMS V4 API.
 * @returns {CheckpointTimer}
 * @constructor
 */
function CheckpointTimer() {
	this.m_checkpointObject = null;
	try {
		this.m_checkpointObject = CERN_Platform.getDiscernObject("CHECKPOINT");
	} catch (exe) {
		logger.logError("Unable to create checkpoint object via window.external.DiscernObjectFactory('CHECKPOINT')");
		return this;
	}
	return this;
}

/**
 * Sets the ClassName parameter on the checkpoint object, if it exists. The class name identifies which class
 * this checkpoint originates from.
 * @param {string} className - The ClassName parameter for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setClassName = function (className) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.ClassName = className;
	}
	return this;
};

/**
 * Sets the ProjectName parameter on the checkpoint object. The project name identifies the project that this
 * checkpoint originates from.
 * @param {string} projectName - The ProjectName parameter for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setProjectName = function (projectName) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.ProjectName = projectName;
	}
	return this;
};

/**
 * Sets the EventName on the checkpoint object. The event name identifies which event the checkpoint originates
 * from.
 * @param {string} eventName - The EventName for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setEventName = function (eventName) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.EventName = eventName;
	}
	return this;
};

/**
 * Sets the SubEventName on the checkpoint object. The sub event name identifies which sub-event the checkpoint
 * originates from.
 * @param {string} subEventName - The SubEventName for the checkpoint object.
 * @returns {CheckpointTimer}
 */
CheckpointTimer.prototype.setSubEventName = function (subEventName) {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.SubEventName = subEventName;
	}
	return this;
};

/**
 * Calls Publish on the checkpoint object. This will publish the checkpoint out to the timer system.
 */
CheckpointTimer.prototype.publish = function () {
	if (this.m_checkpointObject) {
		this.m_checkpointObject.Publish();
	}
};

/**
 * This will add a metadata value to the checkpoint object with the specified key and value.
 * @param {string} key - The key value for the metadata.
 * @param {string} value - The value for the metadata.
 */
CheckpointTimer.prototype.addMetaData = function(key, value) {
	if(this.m_checkpointObject && key && value) {
		try {
			//Check where the code is being run (Millennium vs Web) so we can call the appropriate 
			//metadata function.  
			if(CERN_Platform.inMillenniumContext()){
				//Call the win32 implementation of MetaData (Millennium)
				this.m_checkpointObject.MetaData(key) = value; 
			}else{
				//Call the web enabled implementation of metaData (Web Enabled)
				this.m_checkpointObject.MetaData(key,value);
			}
		} catch (e) {
			logger.logError("Error adding MetaData [" + key + "] = " + value + "; on CheckpointTimer");
			return this;
		}
	}
	return this;
};
/**
 * @class
 * This class handles the classic use of timers in our system. This version of the timer makes use of the
 * Checkpoint system rather than the traditional Start and Stop methods.
 * @param {string} timerName - The name of the timer. This maps to the original TimerName of the old timer system.
 * @param {string} subTimerName - The name of the sub timer. This maps to the original SubTimerName of the old timer system.
 * @returns {RTMSTimer}
 * @constructor
 */
function RTMSTimer(timerName, subTimerName) {
	this.m_checkpointTimer = new CheckpointTimer();
	this.m_checkpointTimer.setEventName(timerName);
	this.m_checkpointTimer.addMetaData("rtms.legacy.subtimerName", subTimerName);
	return this;
}

/**
 * Adaptor method that simply passes through to the checkpoint object and adds metadata.
 * @param {String} key - the metadata key.
 * @param {String} value - the metadata value.
 */
RTMSTimer.prototype.addMetaData = function(key, value) {
	this.m_checkpointTimer.addMetaData(key, value);
	return this;
};

/**
 * Starts the timer by setting the SubEventName on the checkpoint and calling publish.
 */
RTMSTimer.prototype.start = function() {
	this.checkpoint("Start");
};

/**
 * @deprecated
 * This method has been deprecated. Use RTMSTimer.prototype.start instead.
 * @constructor
 */
RTMSTimer.prototype.Start = function() {
	this.start();
};

/**
 * Stops the timer by setting the SubEventName on the checkpoint and calling publish.
 */
RTMSTimer.prototype.stop = function() {
	this.checkpoint("Stop");
};

/**
 * @deprecated
 * This method has been deprecated. Use RTMSTimer.prototype.stop instead.
 * @constructor
 */
RTMSTimer.prototype.Stop = function() {
	this.stop();
};

/**
 * Fails the timer by setting the SubEventName on the checkpoint and calling publish.
 */
RTMSTimer.prototype.fail = function() {
	this.checkpoint("Fail");
};

/**
 * @deprecated
 * This method has been deprecated. Use RTMSTimer.prototype.fail instead.
 * @constructor
 */
RTMSTimer.prototype.Abort = function() {
	this.fail();
};

/**
 * Publishes a checkpoint for the timer.
 * @param {string} subEventName - The sub event name of the checkpoint.
 */
RTMSTimer.prototype.checkpoint = function(subEventName) {
	this.m_checkpointTimer.setSubEventName(subEventName);
	this.m_checkpointTimer.publish();
};/**
 * @class
 * @param {string} timerName - The name of the timer. This maps to the original TimerName of the old timer system.
 * @param {string} subTimerName - The name of the sub timer. This maps to the original SubTimerName of the old timer system.
 * @returns {CapabilityTimer} - Returns self.
 * @constructor
 */
function CapabilityTimer(timerName, subTimerName) {
	this.m_checkpointTimer = new CheckpointTimer();
	this.m_checkpointTimer.setEventName(timerName);
	this.m_checkpointTimer.addMetaData("rtms.legacy.subtimerName", subTimerName);
	return this;
}

/**
 * Adaptor method that simply passes through to the checkpoint object and adds metadata.
 * @param {String} key - the metadata key.
 * @param {String} value - the metadata value.
 */
CapabilityTimer.prototype.addMetaData = function(key, value) {
	this.m_checkpointTimer.addMetaData(key, value);
	return this;
};

/**
 * This method will perform a capability capture. This is meant to capture a piece of functionality
 * in order to determine how often something is used. Notice that is makes use of the checkpoint system
 * and simply calls Start followed by Stop immediately.
 */
CapabilityTimer.prototype.capture = function () {
	this.m_checkpointTimer.setSubEventName("Start-Stop");
	this.m_checkpointTimer.publish();
};/**
 * @class
 * This class helps measure the time spent on a sequence of tasks.
 * It’s designed to track a list of tasks and automatically stops the timer when all the tasks are completed.
 * When the tasks are not completed before the failure time out, it will automatically abort the timer.
 * @param {string} timerName - The name of the timer.
 * @param {string} subTimerName - The name of the sub timer.
 * @returns {AggregateTimer}
 * @constructor
 */
function AggregateTimer(timerName, subTimerName) {
	this.m_rtmsTimer = new RTMSTimer(timerName, subTimerName);
	this.m_timerStatus = AggregateTimer.Status.NOT_STARTED;
	this.m_isRegistrationOpen = true;
	this.m_taskList = [];
	//set the time out to be 120 seconds
	this.m_failureTimeoutSeconds = 120;

	return this;
};

/**
 * Enumeration type that represents the AggregateTimer's status
 * Not started: The timer is not started yet.
 * Started: The timer is started.
 * Terminated: The timer is stopped or aborted.
 */
AggregateTimer.Status = {
	NOT_STARTED: 0,
	STARTED: 1,
	TERMINATED: 2
};

/**
 * Adaptor method that simply passes through to the RTMSTimer object and adds metadata.
 * @param {String} key - the metadata key.
 * @param {String} value - the metadata value.
 * @returns {undefined} undefined
 */
AggregateTimer.prototype.addMetaData = function(key, value) {
	this.m_rtmsTimer.addMetaData(key, value);
	return this;
};

/**
 * It marks the timer as already being started and begins waiting for the failure time out.
 * If the tasks fail to complete before the time out, it will call abortTimer to abort the timer.
 * It is used in the scenario when a timer is started before access to the AggregateTimer API is made available.
 * Otherwise the startTimer function should be used.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.markTimerStarted = function() {
	if(this.m_timerStatus === AggregateTimer.Status.NOT_STARTED){
		this.m_timerStatus = AggregateTimer.Status.STARTED;
		//at this point the timer is already started.
		// It will check if the timer has been stopped (when all tasks are completed) after the specified time.
		// Otherwise it will log an error message and include the tasks that are not completed yet.
		var self = this;
		setTimeout(function(){
			if(self.m_timerStatus === AggregateTimer.Status.STARTED){
				self.abortTimer();
			}
		}, this.m_failureTimeoutSeconds * 1000);
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to mark the timer as being started.");
	}
	return this;
};


/**
 * It registers a tasks in the aggregate timer object by putting it in the task list.
 * @param {string} taskId The ID/name of the task
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.registerTask = function(taskId) {
	if(this.m_isRegistrationOpen){
		this.m_taskList.push(taskId);
	}else{
		logger.logWarning("AggregateTimer can't register task "+ taskId + " becaues registration is locked.");
	}
	return this;
};

/**
 * It locks the registration so no other tasks can be registered.
 * Only after closing the registration, AggregateTimer can be stopped when the last task completes.
 * In the rare scenarios when all components finish loading before registration is locked, this function will stop the timer.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.lockRegistration = function() {
	this.m_isRegistrationOpen = false;
	//if all tasks are completed, it should stop the timer
	if(this.m_taskList.length === 0){
		this.stopTimer();
	}
	return this;
};

/**
 * It crosses off a task off the task list. When the task list becomes empty, it will automatically stop the timer.
 * @param {string} taskId The ID/name of the task
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.completeTask = function(taskId) {
	if(this.isTerminated()){
		logger.logWarning("AggregateTimer is attempting to complete the task " + taskId + " when the timer is already terminated. ");
		return;
	}

	var taskArray = this.m_taskList;
	//remove the completed task from the task list
	var taskIndex = $.inArray(taskId, taskArray);
	if(taskIndex > -1){
		taskArray.splice(taskIndex,1);
	}

	//if all tasks are completed after registration is closed, it should stop the timer
	if(!this.m_isRegistrationOpen && taskArray.length === 0){
		this.stopTimer();
	}

	return this;
};

/**
 * It starts the timer by calling the RTMSTimer's start function.
 * It also calls markTimerStarted to change the internal status to "started".
 * If a timer with the same name and subtimer name is already started outside of the API,
 * function markTimerStarted should be called instead.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.startTimer = function() {
	if(this.m_timerStatus === AggregateTimer.Status.NOT_STARTED){
		this.m_rtmsTimer.start();
		this.m_timerStatus = AggregateTimer.Status.STARTED;
		this.markTimerStarted();
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to start the timer. ");
	}
	return this;
};

/**
 * It stops the timer and changes the internal status to "terminated" so it cannot be stopped/aborted again.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.stopTimer = function() {
	if(this.m_timerStatus === AggregateTimer.Status.STARTED){
		this.m_rtmsTimer.stop();
		this.m_timerStatus = AggregateTimer.Status.TERMINATED;
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to stop the timer. ");
	}
	return this;
};

/**
 * It aborts the timer and changes the internal status to "terminated" so it cannot be stopped/aborted again.
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.abortTimer = function() {
	if(this.m_timerStatus === AggregateTimer.Status.STARTED){
		this.m_rtmsTimer.fail();
		this.m_timerStatus = AggregateTimer.Status.TERMINATED;
		var taskListString = this.m_taskList.join(",");
		logger.logWarning("AggregateTimer has timed out with incompleted task(s): " + taskListString);
	}else{
		logger.logWarning("AggregateTimer is not in a valid status to abort the timer. ");
	}
	return this;
};

/**
 * It specifies the tasks’ failure time out.
 * If not set, the default value is 120 seconds because most MPages are expected to finish loading within the time frame.
 * @param {number} timeInSeconds The failure timer out in seconds
 * @returns {AggregateTimer}
 */
AggregateTimer.prototype.setFailureTimeoutSeconds = function (timeInSeconds){
	if(typeof timeInSeconds !== "number"){
		throw new Error("Function setFailureTimeoutSeconds is expecting a number.");
	}
	this.m_failureTimeoutSeconds = timeInSeconds;
	return this;
};

/**
 * It returns whether the timer has been stopped or aborted.
 * @returns {boolean} The flag that indicates whether the timer is terminated
 */
AggregateTimer.prototype.isTerminated = function() {
	return (this.m_timerStatus === AggregateTimer.Status.TERMINATED);
};
/*globals RTMSTimer, DataRequestQueue*/

/**
 * @class
 * The DataRequest object is the base implementation of any type of data request and should be used to model specific data requests.  
 * It defines the functions and values that will be present for any type of data request regardless of the type.
 */
var DataRequest = function(){
	//A flag to indicate of the data request should be executed asynchronously
	this.m_asyncInd = true;
	//The timer timer which will be started at the beginning of the data request and stopped after the response handler function has returned
	this.m_loadTimer = null;
	//The name that is assigned to a particular data request, although not required it can be used by the consumer to distinguish between multiple data request objects
	this.m_requestName = "";
	//This indicates if the data request should skip the data request queue and be processed immediately.  This should only be used in the case of a high priority data request need
	this.m_skipQueueInd = false;
	//The response handler will be a function that gets executed once the data request has retrieved its data.  This callback is required for any data request object
	this.m_responseHandler = null;
	
	//Internal variables
	//The valid entry flag is used to verify that a data request has used the proper entry point for executing data request
	this.m_validEntry = false;
	//This indicator keeps track of the use of a DataRequestQueue thread.  If set to true a check will be made to ensure the thread is relinquished prior to executing the response handler
	this.m_relinquishNecessary = true;
};

/* Getters */
/**
 * Retrieves the asynchronous indicator which determines if the data request should be executed asynchronously.  The asynchronous indicator is defaulted to true.
 * @return {boolean} A flag which determines if the data request should be executed asynchronously or synchronously 
 */
DataRequest.prototype.getAsyncIndicator = function(){
	return this.m_asyncInd;
};

/**
 * Retrieves the timer that is used to time the data request call and the execution of the response handler function.
 * @return {RTMSTimer} The RTMSTimer object
 */
DataRequest.prototype.getLoadTimer = function(){
	return this.m_loadTimer;
};

/**
 * Retrieves the name associated to the data request object.  This is an optional field which can be used to identify a particular data request object.
 * @return {string} The name associated to this data request 
 */
DataRequest.prototype.getName = function(){
	return this.m_requestName;
};

/**
 * Retrieves the response handler for the data request.  The response handler is the function that will be executed once the data has been retrieved.
 * @return {function} The function which will be executed once the data has been returned from the data request 
 */
DataRequest.prototype.getResponseHandler = function(){
	return this.m_responseHandler;
};

/**
 * Retrieves the indicator used to determine if data request should skip the request queue.  This value defaults to false and should only be used when
 * the data being retrieved is crucial for performance concerns.  If the indicator is set to true, the data request will be executed immediately when 
 * DataRequest.performRequest is called.
 * @return {boolean} The indicator which determines if the data request is placed in the queue or is executed immediately
 */
DataRequest.prototype.getSkipQueueIndicator = function(){
	return this.m_skipQueueInd;
};



/* Setters */
/**
 * Sets the asynchronous indicator for the data request which determines if the data request should be executed asynchronously.  The asynchronous indicator 
 * is defaulted to true.  If this indicator is set to false, the data request will be executed synchronously effectively blocking all other processing.  
 * Please ensure you understand the performance impact your data request will have on the entire MPage if setting this flag to false.
 * @param {boolean} asyncInd A flag which determines if the data request should be executed asynchronously or synchronously
 * @return {DataRequest} A reference to the data request object for chaining purposes
 */
DataRequest.prototype.setAsyncIndicator = function(asyncInd){
	if(typeof asyncInd !== "boolean"){
		throw new Error("DataRequest.setAsyncIndicator: asyncInd parameter must be of type boolean");
	}
	//If the async indicator is set to false, we will need to skip the queue so this request doesn't get deferred to the queue
	if(asyncInd === false){
		this.setSkipQueueIndicator(true);
	}
	
	this.m_asyncInd = asyncInd;
	return this;
};

/**
 * Sets the load timer which will be used when executing the data request.  This timer is started just prior to executing the data request and is stopped just 
 * after calling the data handler function.  This effectively encapsulates the execution of the data request as well as the handling of the data returned 
 * from the request.
 * @param {RTMSTimer} loadTimer The name that will be associated to the timer object created for timing data request performance
 * @return {DataRequest} A reference to the data request object for chaining purposes
 */
DataRequest.prototype.setLoadTimer = function(loadTimer){
	if(!RTMSTimer.prototype.isPrototypeOf(loadTimer)){
		throw new Error("DataRequest.setLoadTimer: loadTimer parameter must be a RTMSTimer object");
	}
	this.m_loadTimer = loadTimer;
	return this;
};

/**
 * Sets the name associated to the data request.  This field is optional an can be used to identify one data request from another.
 * @param {string} requestName The name to associate to this data request 
 * @return {DataRequest} A reference to the data request object for chaining purposes
 */
DataRequest.prototype.setName = function(requestName){
	if(typeof requestName !== "string"){
		throw new Error("DataRequest.setRequestName: requestName parameter must be of type string and non blank");
	}
	this.m_requestName = requestName;
	return this;	
};

/**
 * Sets the response handler for the data request.  The response handler is the function that will be executed once the data has been retrieved.
 * This function will be called from the context of the data request object.  An implementation of a DataReply object will be passed to the response
 * handler function.
 * @param {function} responseHandler The function which will be executed once the data has been returned from the data request
 * @return {DataRequest} A reference to the data request object for chaining purposes
 */
DataRequest.prototype.setResponseHandler = function(responseHandler){
	if(typeof responseHandler !== "function"){
		throw new Error("DataRequest.setResponseHandler: responseHandler parameter must be a function");
	}
	this.m_responseHandler = responseHandler;
	return this;	
};

/**
 * Sets the indicator used to determine if data request should skip the request queue.  This value defaults to false and should only be used when
 * the data being retrieved is crucial for performance concerns.  If the indicator is set to true, the data request will be executed immediately when 
 * DataRequest.performRequest is called.
 * @param {boolean} skipQueueInd The indicator which determines if the data request is placed in the queue or is executed immediately
 * @return {DataRequest} A reference to the data request object for chaining purposes
 */
DataRequest.prototype.setSkipQueueIndicator = function(skipQueueInd){
	if(typeof skipQueueInd !== "boolean"){
		throw new Error("DataRequest.setSkipQueue: skipQueueInd parameter must be of type boolean");
	}
	//If we are skipping the queue we need to let the base object know we don't need to relinquish the thread
	this.m_relinquishNecessary = !skipQueueInd;
	this.m_skipQueueInd = skipQueueInd;
	return this;
};



/**
 * This function begins the process for executing a particular data request.  It is the entry point for starting all data request executions.
 * Based on the skip queue indicator, the request will either be executed immediately or placed in the DataRequestQueue.
 * @return null
 */
DataRequest.prototype.performRequest = function(){
	//Validate that the data request is utilizing the proper entry point
	this.m_validEntry = true;
	//See if we should be added to the queue or execute immediately
	if(this.m_skipQueueInd){
		//Skip the queue and execute this script immediately.
		this.execute();
	}
	else{
		//Add this script request to the data request queue and wait our turn
		DataRequestQueue.addRequest(this);
	}	
};

/**
 * This function will need to be implemented by any object which inherits from DataRequest.  Each implementation must ensure that the 
 * entry point of the data request is valid using the check commented below.  This means that the consumer of the DataRequest API has 
 * utilized the DataRequest.performRequest entry point rather than calling DataRequest.execute directly.  This check is necessary to 
 * ensure all data requests are subject to being placed within the DataRequestQueue.
 * @return null
 */
DataRequest.prototype.execute = function(){
	if(!this.m_validEntry){
		throw new Error("DataRequest.execute: The execute function should not be called directly.  PLease utilize the performRequest function for starting data requests");
	}
	throw new Error("DataRequest.execute has not been implemented");
};


/**
 * Performs the call to the data handler function after verifying that the data request has properly relinquished its thread.  This function 
 * has been made available such that implementations of the DataRequest can perform any necessary actions prior to calling that data handler function.
 * @param {DataReply} dataReply The DataReply object which contains the data returned in addition to an optional request name and status information.
 * @return null 
 */
DataRequest.prototype.handleDataResponse = function(dataReply){
	if(this.m_relinquishNecessary){
		throw new Error("DataRequest.handleDataResponse: This data request is attempting to handle a script response prior to relinquishing its thread.  PLease utilize the DataRequest.relinquishThread prior to executing the data handler");
		
	}
	if(typeof this.m_responseHandler === "function"){
		this.m_responseHandler(dataReply);
	}
};

/**
 * This function is used to relinquish the thread occupied during the execution of the data request.  Once that execution has completed this function 
 * should be called in order to allow queued data requests to begin execution. All DataRequest implementations should make a call to this function
 * after the data request has been completed.  This can be called prior to executing the data handler function.
 * should implement the exact functionality defined
 * @return null
 */
DataRequest.prototype.relinquishThread = function(){
	if(!this.m_skipQueueInd){
		DataRequestQueue.relinquishThread();
		this.m_relinquishNecessary = false;
	}
};
/**
 * @class
 * The DataReply object is the base implementation of any type of data reply object.  It defines the functions and
 * values that will be present for any type of data reply regardless of type.
 */
var DataReply = function(){
	this.m_replyName = "";
	this.m_responseData = null;
	this.m_status = null;
};

/**
 * Retrieves the name associated to the data reply.  This field is copied from the DataRequest that 
 * instantiated this data reply object.  This is an optional field. It can be used to associate a 
 * particular data reply to the original data request object.
 * @return {string} The name given to the data reply object
 */
DataReply.prototype.getName = function(){
	return this.m_replyName;
};

/**
 * Retrieves the data returned from the associated data request object.  This value is set by the associated 
 * data request object.  The data type will be dependent upon the specific implementation.
 * @return {object|string} The data returned from the data request execution.  This will most likely be a string
 * or a primitive object.  However, it will be dependent on the specific implementation.  
 */
DataReply.prototype.getResponse = function(){
	return this.m_responseData;
};

/**
 * Retrieves the status of the data request.  This value will be set by the data request object if it is able
 * to provide an interpretation of the status.  In cases where raw data is requested the data request object will
 * not be able to accurately interpret the status of the response other than implying data was retrieved.
 * @return {string} The status for the data request execution
 */
DataReply.prototype.getStatus = function(){
	return this.m_status;
};

/**
 * Sets the name that will be associated to the data reply.  This field is typically set from the DataRequest that 
 * instantiated this data reply object.  This is an optional field.  It can be used to associate a particular data 
 * reply to the original data request object.
 * @param {string} replyName The name to apply to the data reply object
 * @return {DataReply} A reference to the data reply object for chaining purposes
 */
DataReply.prototype.setName = function(replyName){
	if(typeof replyName !== "string"){
		throw new Error("DataReply.setName: replyName parameter must be of type string");
	}
	this.m_replyName = replyName;
	return this;
};

/**
 * Sets the data returned from the associated data request.  The data type will be dependent upon the specific 
 * implementation.  Thus, no specific type checks will be performed in this object.  Any data type validation
 * will need to be performed within the specific implementation of a DataReply object.
 * @param {object|string} responseData The data returned from the data request.  This will most likely be a 
 * string or a primitive object.  However, it will be dependent on the specific implementation. 
 * @return {DataReply} A reference to the data reply object for chaining purposes
 */
DataReply.prototype.setResponse = function(responseData){
	this.m_responseData = responseData;
	return this;
};

/**
 * Sets the status of the data request.  This value will be set by the data request object if it is able
 * to provide an interpretation of the status.  Each implementation of the DataReply object will need to
 * implement its own type checking based on the type of status being used.
 * @param {} status The status for the data request execution
 * @return {DataReply} A reference to the data reply object for chaining purposes
 */
DataReply.prototype.setStatus = function(status){
	this.m_status = status;
	return this;
};/*globals logger, DataRequest, XMLCCLREQUESTOBJECTPOINTER, ScriptReply, XMLCclRequest, CERN_Platform*/
/**
 * @class
 * The ScriptRequest is an implementation of a DataRequest object intended to execute CCL script requests.  
 * It will correctly handle script requests made from within and outside of a Millennium context.  The 
 * ScriptRequest object does not attempt to interpret the data being returned from the CCL script with the 
 * exception of the status. The data is passed back to the consumer via a ScriptReply object.
 */
var ScriptRequest = function(){
	//Accessible variables
	this.m_dataBlob = null;
	this.m_programName = "";
	this.m_parameterArray = null;
	this.m_rawDataInd = false;
};

/*
 * Inherit the properties and functions of the DataRequest object
 */
ScriptRequest.prototype = new DataRequest();
ScriptRequest.prototype.constructor = DataRequest;

/* Getters */
/**
 * Retrieves the data blob that will be sent to the CCL script upon execution.
 * @return {string} The data blob that will be sent to the CCL script upon execution. 
 */
ScriptRequest.prototype.getDataBlob = function(){
	return this.m_dataBlob;
};

/**
 * Retrieves the name of the CCL program that will be executed in the script request.  This is a required field.
 * @return {string} The name of the CCL program to execute 
 */
ScriptRequest.prototype.getProgramName = function(){
	return this.m_programName;
};

/**
 * Retrieves the parameter array which will be sent to the CCL program when executed within the script request.
 * @return {array} The array of parameters that will be sent to the CCL program 
 */
ScriptRequest.prototype.getParameterArray = function(){
	if(!this.m_parameterArray){
		this.m_parameterArray = [];
	}
	return this.m_parameterArray;
};

/**
 * Retrieves the raw data indicator which determines if raw data should be returned from the CCL program.  If 
 * set to true the script request object will not attempt to perform any parsing of the data.  If set to false
 * the script request will assume the data being returned is JSON data and will parse it.
 * @return {boolean} A boolean which identifies if raw data should be returned from the CCL program 
 */
ScriptRequest.prototype.getRawDataIndicator = function(){
	return this.m_rawDataInd;
};

/**
 * Sets the data blob that will be sent to the CCL script upon execution.  This data blob will be sent along with 
 * any parameters defined for the script request.
 * @param {string} dataBlob The data blob that will be sent to the CCL script upon execution.
 * @return {ScriptRequest} A reference to the script request object for chaining purposes
 */
ScriptRequest.prototype.setDataBlob = function(dataBlob){
	if(typeof dataBlob !== "string"){
		throw new Error("ScriptRequest.setDataBlob: dataBlob parameter must be of type string and non blank");
	}
	this.m_dataBlob = dataBlob;
	return this;
};

/**
 * Sets the name of the CCL program that will be executed in the script request.  This is a required field.  If
 * omitted an error will be thrown.
 * @param {string} programName The name of the CCL program to execute
 * @return {ScriptRequest} A reference to the script request object for chaining purposes
 */
ScriptRequest.prototype.setProgramName = function(programName){
	if(typeof programName !== "string" || !programName.length){
		throw new Error("ScriptRequest.setProgramName: programName parameter must be of type string and non blank");
	}
	this.m_programName = programName;
	return this;
};

/**
 * Sets the parameter array which will be sent to the CCL program when executed within the script request.
 * @param {array} parameterArray The array of parameters that will be sent to the CCL program
 * @return {ScriptRequest} A reference to the script request object for chaining purposes 
 */
ScriptRequest.prototype.setParameterArray = function(parameterArray){
	if(!(parameterArray instanceof Array)){
		throw new Error("ScriptRequest.setParameterArray: parameterArray parameter must be an array");
	}
	this.m_parameterArray = parameterArray;
	return this;
};

/**
 * Sets the raw data indicator which determines if raw data should be returned from the CCL program.  If 
 * set to true the script request object will not attempt to perform any parsing of the data.  If set to false
 * the script request will assume the data being returned is JSON data and will parse it.
 * @param {boolean} rawDataInd A boolean which identifies if raw data should be returned from the CCL program
 * @return {ScriptRequest} A reference to the script request object for chaining purposes 
 */
ScriptRequest.prototype.setRawDataIndicator = function(rawDataInd){
	if(typeof rawDataInd !== "boolean"){
		throw new Error("ScriptRequest.setRawDataIndicator: rawDataInd parameter must be of type boolean");
	}
	this.m_rawDataInd = rawDataInd;	
	return this;
};


/**
 * This function will log important execution information.  It will be called on behalf of the DataRequest API 
 * consumer prior executing the CCL program.
 * @return null
 */
ScriptRequest.prototype.logExecutionStartInfo = function(){
	logger.logMessage("Request Name: " + this.getName() + "\n" +
					"Program Name: " + this.getProgramName() + "\n" + 
					"Parameter Array: " + this.getParameterArray() + "\n" +
					"Data Blob: " + this.getDataBlob() + "\n");
};

/**
 * This function will log important script completion information.  It will be called on behalf of the 
 * DataRequest API consumer after the CCL program has finished execution
 * @param {object} replyObj The reply object returned from the script call
 * @return null
 */
ScriptRequest.prototype.logCompletionInfo = function(replyObj){
	logger.logMessage("Request Name: " + this.getName() + "\n" +
					"Program Name: " + this.getProgramName() + "\n" + 
					"Parameter Array: " + this.getParameterArray() + "\n" +
					"Data Blob: " + this.getDataBlob() + "\n" + 
					"readyState: " + replyObj.readyState + "\n" +
					"status: " + replyObj.status + "\n" +
					"Response: " + replyObj.responseText + "\n");
};

/**
 * This function will log important script error information.  It will be called on behalf of the 
 * DataRequest API consumer after the CCL program has finished execution
 * @param {object} replyObj The reply object returned from the script call
 * @return null
 */
ScriptRequest.prototype.logScriptExecutionError = function(replyObj){
	logger.logError("Request Name: " + this.getName() + "\n" +
					"Program Name: " + this.getProgramName() + "\n" + 
					"Parameter Array: " + this.getParameterArray() + "\n" +
					"Data Blob: " + this.getDataBlob() + "\n" +
					"readyState: " + replyObj.readyState + "\n" +
					"status: " + replyObj.status + "\n" +
					"Response: " + replyObj.responseText + "\n");
};

/**
 * This function is used to generate an error message based on the replyObject
 * returned from the script call.
 * @param {object} replyObj The reply object returned from the script call
 * @return {string}
 */
ScriptRequest.prototype.createErrorMessage = function(replyObj){
	var errorMessage = "Discern Error:\nStatus: " + replyObj.status + "\nReply: " + replyObj.responseText + "\n";
	return errorMessage;
};

/**
 * This function releases any request references that may be held at a framework level.
 * @param {XMLHttpRequest|XMLCclRequest} The request object used to perform the script call
 * @return null
 */
ScriptRequest.prototype.releaseRequestReference = function(requestObj){
	//If this call was being made within a Millennium context
	//there is a object which keeps references to the script requests.  Not freeing those object
	//causes memory leaks.
	if(CERN_Platform.inMillenniumContext() && XMLCCLREQUESTOBJECTPOINTER){
		for (var id in XMLCCLREQUESTOBJECTPOINTER) {
			if (XMLCCLREQUESTOBJECTPOINTER.hasOwnProperty(id) && XMLCCLREQUESTOBJECTPOINTER[id] === requestObj) {
				delete XMLCCLREQUESTOBJECTPOINTER[id];
			}
		}	
	}
};

/**
 * This function is used to validate the required field needed for executing a CCL script.  If any of the required
 * fields are not present or set correctly an error will be thrown.  The ScriptRequest required fields
 * are the program name and the response handler.
 * @return null  
 */
ScriptRequest.prototype.validateScriptRequestFields = function(){
	if(!this.m_programName){
		throw new Error("ScriptRequest.startRequest: All ScriptRequest objects must contain a program name");
	}
	if(!this.m_responseHandler){
		throw new Error("ScriptRequest.startRequest: A response handler is required for ScriptRequest execution");
	}	
};

/**
 * This function is responsible for executing the script request. It will be called from within
 * the DataRequest APIs and should not be called by the DataRequest API consumer.  Direct calls to this 
 * function will result in an error being thrown.
 * @return null  
 */
ScriptRequest.prototype.execute = function(){
	if(!this.m_validEntry){
		throw new Error("ScriptRequest.execute: The execute function should not be called directly.  Please utilize the performRequest function for starting data requests");
	}
	
	//Grab the necessary fields for our ScriptRequest
	var dataBlob = this.getDataBlob();
	var loadTimer = this.getLoadTimer();
	var parameterArray = this.getParameterArray();
	var programName = this.getProgramName();
	
	//Validate the elements necessary for this request
	this.validateScriptRequestFields();
	
	//Start the load timer
	if(loadTimer){
		loadTimer.start();
	}
	
	//Determine if we need to create an XMLHttpRequest or an XMLCclRequest
	var request = null;
	if(CERN_Platform.inMillenniumContext()){
		request = new XMLCclRequest();
		request.onreadystatechange = this.generateStateChangeHandler();
		request.open("GET", programName, this.m_asyncInd);
		if(dataBlob){
			request.setBlobIn(dataBlob);
		}
		request.send(parameterArray.join(","));
	}
	else{
		request = new XMLHttpRequest();
		request.onreadystatechange = this.generateStateChangeHandler();
		var url = CERN_Platform.getScriptServletLocation();
		url += programName + "?parameters=" + encodeURIComponent(parameterArray.join(","));
		if(dataBlob){
			//TODO: Examine use of POST for blob processing
			url += "&blobIn=" + encodeURIComponent(dataBlob);
		}
		request.open("GET", url, this.m_asyncInd);
		if(dataBlob){
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		request.send(null);
	}	
};

/**
 * This function generates the state change handler function utilized during the script request.  It will
 * take the response from the CCL script and populate a ScriptReply object.  Once populated, the ScriptReply
 * object will be passed back to the ScriptRequest via the response handler.
 * @return {function} The function to use on the state change events of a script request 
 */
ScriptRequest.prototype.generateStateChangeHandler = function(){
	var self = this;
	return function(){
		var loadTimer = self.getLoadTimer();
		var timersFailed = false;
		
		//Ignore all states except for 4
		if(this.readyState !== 4){
			return;	
		}
		else if(this.status !== 200){
			//Handle an execution error
			self.logScriptExecutionError(this);
			//Fail the timer since there was an error
			timersFailed = true;
			if(loadTimer) {
				loadTimer.fail();
			}
			
			//Relinquish the thread being held for this request and the request reference
			self.relinquishThread();
			self.releaseRequestReference(this);
			
			return;
		}
		//Relinquish the thread being held for this request
		self.relinquishThread();
		
		//Release the request reference.  If this call was being made within a Millennium context
		//there is a object which keeps references to the script requests.  Not freeing those object
		//causes memory leaks.
		self.releaseRequestReference(this);
		
		//Log some timing information 
		self.logCompletionInfo(this);
		
		//Process the response for this request
		try {
			var scriptReply = new ScriptReply();
			scriptReply.setName(self.getName());
			//See if the consumer is expecting raw data or not
			if(self.m_rawDataInd){
				scriptReply.setResponse(this.responseText);
				scriptReply.setStatus("");
			}
			else{
				var responseObj = JSON.parse(this.responseText).RECORD_DATA;
				var status = responseObj.STATUS_DATA.STATUS;
				scriptReply.setResponse(responseObj);
				scriptReply.setStatus(status);
				//Check for F status
				if("S|s|Z|z".indexOf(status) < 0){
					self.logScriptExecutionError(this);
					scriptReply.setError(self.createErrorMessage(this));
				}
			}
			//Execute the response handler function
			self.handleDataResponse(scriptReply);
		} 
		catch(err) {
			timersFailed = true;
			if(loadTimer) {
				loadTimer.fail();
			}
		} 
		finally {
			if(loadTimer && !timersFailed) {
				loadTimer.stop();
			}
		}
	};
};
/*globals DataReply*/
/**
 * @class
 * This ScriptReply object is an implementation of the base DataReply object used specifically for script requests.
 * It contains all of the properties and functions of the DataReply object in addition to an error message which can 
 * be passed to the ScriptRequest consumer. 
 */
var ScriptReply = function(){
	//Accessible variables
	this.m_error = "";
};

/*
 * Inherit the properties and functions of the DataReply object
 */
ScriptReply.prototype = new DataReply();
ScriptReply.prototype.constructor = DataReply;

/**
 * Retrieves the error message created during the execution of a script request.  This message is only populated
 * if there was an error executing the script or the script executed and there was an internal error.
 * @return {string} An error message populated by the script request object.  
 */
ScriptReply.prototype.getError = function(){
	return this.m_error;
};


/**
 * Sets the error message created during the execution of a script request.  If an error occurs when attempting
 * to execute the script or the script executes successfully but returns an error status.  In either case the
 * error message is generated on behalf of the consumer in order to provide as detailed of information as possible.
 * @param {string} An error message populated by the script request object.  
 * @return {ScriptReply} A reference to the script reply object for chaining purposes
 */
ScriptReply.prototype.setError = function(errorMessage){
	if(typeof errorMessage !== "string"){
		throw new Error("ScriptReply.setError: errorMessage parameter must be of type string");
	}
	this.m_error = errorMessage;
	return this;
};

/**
 * Sets the status of the script request.  This value will be set by the script request object if it is able
 * to provide an interpretation of the status.  In cases where raw data is requested the script request object will
 * not be able to accurately interpret the status of the response other than implying data was retrieved.
 * @param {string} status The status for the data request execution
 * @return {ScriptReply} A reference to the data reply object for chaining purposes
 */
ScriptReply.prototype.setStatus = function(status){
	if(typeof status !== "string"){
		throw new Error("ScriptReply.setStatus: status parameter must be of type string");
	}
	this.m_status = status;
	return this;
};/*globals ScriptReply*/

/**
 * @class
 * This ComponentScriptReply object is an extension of the ScriptReply object and is used specifically in
 * conjunction with ComponentScriptRequest objects.  It contains all of the properties and functions of the 
 * ScriptReply object in addition to a reference to the component utilized in the ComponentScriptRequest object.
 */
var ComponentScriptReply = function(){
	this.m_componentObj = null;
};

/*
 * Inherit the properties and functions of the ScriptReply object
 */
ComponentScriptReply.prototype = new ScriptReply();
ComponentScriptReply.prototype.constructor = ScriptReply;

ComponentScriptReply.prototype.getComponent = function(){
	return this.m_componentObj;
};

/**
 * Sets the MPageComponent object utilized in the ComponentScriptRequest object so the consumer will have access
 * to the component within the response handler function.
 * @param {MPageComponent} componentObj
 * @return {ComponentScriptReply} A reference to the component script reply object for chaining purposes
 */
ComponentScriptReply.prototype.setComponent = function(componentObj){
	if(!MPageComponent.prototype.isPrototypeOf(componentObj)){
		throw new Error("ComponentScriptReply.setComponent: componentObj parameter must be an instance of a MPageComponent");
	}
	this.m_componentObj = componentObj;
	return this;
};

/*globals ScriptRequest, ComponentScriptReply, logger, RTMSTimer*/

/**
 * @class
 * The ComponentScriptRequest is a specific implementation of a ScriptRequest object utilized for 
 * handling script calls for MPageComponent objects.  Its purpose is to provide general script handling functionality 
 * on behalf of an MPageComponent object.  It will automatically handle script responses with either a 'Z' or 'F' 
 * status and utilize the associated MPageComponent object to generate the correct visuals.  If an S status is 
 * returned the ComponentScriptRequest object will pass the script data back to the MPageComponent via the 
 * MPageComponent.renderComponent function or the ComponentScriptRequest.responseHandler function if provided.
 */
var ComponentScriptRequest = function(){
	//A reference to the component object which is associated with this ComponentScriptRequest
	this.m_componentObj = null;
	//The timer that will be used to time the render function of the component
	this.m_renderTimer = null;
};

/*
 * Inherit the properties and functions of the ScriptRequest object
 */
ComponentScriptRequest.prototype = new ScriptRequest();
ComponentScriptRequest.prototype.constructor = ScriptRequest;

/**
 * Retrieves the MPageComponent object associated with this component script request.
 * @return {MPageComponent} The MPageComponent object associated with this component script request
 */
ComponentScriptRequest.prototype.getComponent = function(){
	return this.m_componentObj;
};

/**
 * Retrieves the timer that is used to time the render function of the component.
 * @return {RTMSTimer} The RTMSTimer object
 */
ComponentScriptRequest.prototype.getRenderTimer = function(){
	return this.m_renderTimer;
};

/**
 * Sets the MPageComponent object that will be used when handling the script's data response.  If the status of 
 * the response is 'Z' or 'F' the component script request will render the correct visuals on behalf of the component.
 * If a 'S' status is returned the MPageComponent.renderComponent or the ComponentScriptRequest.responseHandler function
 * will be called passing in a ComponentScriptReply containing the script's response.  If raw data is requested from 
 * the consumer no interpretation of the data will take place.
 * @param {MPageComponent} componentObj
 * @return {ComponentScriptRequest} A reference to the component script request object for chaining purposes
 */
ComponentScriptRequest.prototype.setComponent = function(componentObj){
	if(!MPageComponent.prototype.isPrototypeOf(componentObj)){
		throw new Error("ComponentScriptRequest.setComponent: The componentObj parameter must be a MPageComponent object");
	}
	
	this.m_componentObj = componentObj;
	return this;
};

/**
 * Sets the render timer which will be used when executing the renderComponent function.  This timer is started just prior
 * to executing the render function and is stopped just it returns.  
 * @param {RTMSTimer} renderTimer The name that will be associated to the timer object created for timing the renderComponent function
 * @return {ComponentScriptRequest} A reference to the data request object for chaining purposes
 */
ComponentScriptRequest.prototype.setRenderTimer = function(renderTimer){
	if(!RTMSTimer.prototype.isPrototypeOf(renderTimer)){
		throw new Error("ComponentScriptRequest.setRenderTimer: renderTimer parameter must be a RTMSTimer object");
	}
	this.m_renderTimer = renderTimer;
	return this;
};

/**
 * This function is used to validate the required field needed for executing a CCL script.  If any of the required
 * fields are not present or set correctly an error will be thrown.  The ComponentScriptRequest required fields
 * are the program name and the component object.
 * @return null  
 */
ComponentScriptRequest.prototype.validateScriptRequestFields = function(){
	if(!this.m_programName){
		throw new Error("ComponentScriptRequest.startRequest: All ScriptRequest objects must contain a program name");
	}
	//Validate that a component object is present before executing the request
	if(!this.m_componentObj){
		throw new Error("ComponentScriptRequest.startRequest: All ComponentScriptRequest objects must contain an associated MPageComponent object");
	}
};

/**
 * This function will log important execution information.  It will be called on behalf of the DataRequest API 
 * consumer prior executing the CCL program.
 * @return null
 */
ComponentScriptRequest.prototype.logExecutionStartInfo = function(){
	logger.logMessage("Component Name: " + this.getComponent().getLabel() + "\n" +
					"Request Name: " + this.getName() + "\n" +
					"Program Name: " + this.getProgramName() + "\n" + 
					"Parameter Array: " + this.getParameterArray() + "\n" +
					"Data Blob: " + this.getDataBlob() + "\n");
};

/**
 * This function will log important script completion information.  It will be called on behalf of the 
 * DataRequest API consumer after the CCL program has finished execution
 * @param {object} replyObj The reply object returned from the script call
 * @return null
 */
ComponentScriptRequest.prototype.logCompletionInfo = function(replyObj){
	logger.logMessage("Component Name: " + this.getComponent().getLabel() + "\n" +
					"Request Name: " + this.getName() + "\n" +
					"Program Name: " + this.getProgramName() + "\n" + 
					"Parameter Array: " + this.getParameterArray() + "\n" +
					"Data Blob: " + this.getDataBlob() + "\n" + 
					"readyState: " + replyObj.readyState + "\n" +
					"status: " + replyObj.status + "\n" +
					"Response: " + replyObj.responseText + "\n");
};

/**
 * This function will log important script error information.  It will be called on behalf of the 
 * DataRequest API consumer after the CCL program has finished execution
 * @param {object} replyObj The reply object returned from the script call
 * @return null
 */
ComponentScriptRequest.prototype.logScriptExecutionError = function(replyObj){
	logger.logError("Component Name: " + this.getComponent().getLabel() + "\n" +
					"Request Name: " + this.getName() + "\n" +
					"Program Name: " + this.getProgramName() + "\n" + 
					"Parameter Array: " + this.getParameterArray() + "\n" +
					"Data Blob: " + this.getDataBlob() + "\n" +
					"readyState: " + replyObj.readyState + "\n" +
					"status: " + replyObj.status + "\n" +
					"Response: " + replyObj.responseText + "\n");
};

/**
 * This function generates the state change handler function utilized during the script request.  It will
 * take the response from the CCL script and determine the status of a scripts execution.  Upon a 'Z' status the
 * function will populate the 'No data found' messaging and render the same for the component.  Upon a 'F' status 
 * the function will populate the 'Error occurred' messaging and render the same for the component.  If the script 
 * call was a success and data is available for the component, a new ComponentScriptReply object will be populated.
 * Once the reply has been created the function will call either the response handler function if it has been 
 * populated or it will call the MPageComponent.finalizeComponent function.  Before returning, the function will 
 * call the post MPageComponent.postProcessing function to allow the component to handle and processing that 
 * needs to take place post render.
 * @return {function} The function to use on the state change events of a script request 
 */
ComponentScriptRequest.prototype.generateStateChangeHandler = function(){
	var self = this;
	
	return function(){
		var component = self.getComponent();
		var componentScriptReply = null;
		var loadTimer = self.getLoadTimer();
		var renderTimer = self.getRenderTimer();
		var requiresRawData = false;
		var responseHandler = null;
		var responseObj = null;
		var status = "";
		var timersFailed = false;
		
		//Ignore all states except for 4
		if(this.readyState !== 4){
			return;	
		}
		else if(this.status !== 200){
			//Handle an execution error
			self.logScriptExecutionError(this);
			component.finalizeComponent(component.generateScriptFailureHTML(), (component.isLineNumberIncluded() ? "(0)" : ""));
			//Fail the timer since there was an error
			timersFailed = true;
			if(loadTimer) {
				loadTimer.fail();
			}
			
			//Relinquish the thread being held for this request and the request reference
			self.relinquishThread();
			self.releaseRequestReference(this);
			
			return;
		}
		//Relinquish the thread being held for this request
		self.relinquishThread();
		
		//Release the request reference.  If this call was being made within a Millennium context
		//there is a object which keeps references to the script requests.  Not freeing those object
		//causes memory leaks.
		self.releaseRequestReference(this);
		
		//Log some timing information 
		self.logCompletionInfo(this);
		
		//Process the response for this request
		try {
			requiresRawData = self.getRawDataIndicator();
			if(!requiresRawData){
				//If we are looking for raw data then we cannot expect JSON as a response
				responseObj = JSON.parse(this.responseText).RECORD_DATA;
				status = responseObj.STATUS_DATA.STATUS;
			}
			
			//If a callback is defined we can skip the handling of the different status'
			responseHandler = self.getResponseHandler();
			
			if(typeof responseHandler === "function"){
				//If a responseHandler is defined that trumps the logic to handle the response for the componet.  Ideally the component
				//developer would utilize a standard ScriptRequest.
				componentScriptReply = new ComponentScriptReply();
				componentScriptReply.setComponent(component);
				componentScriptReply.setName(self.getName());
				componentScriptReply.setResponse(requiresRawData ? this.responseText : responseObj);
				componentScriptReply.setStatus(status);
				//Start the rendering timer
				if(renderTimer){
					renderTimer.start();
				}
				//The component has defined a callback to utilize instead of utilizing the functionality provided in this DataRequest implementation
				self.handleDataResponse(componentScriptReply);
			}
			else if(requiresRawData){
				//If the component requires raw data we cannot assume the data is JSON thus we can't check for the status
				componentScriptReply = new ComponentScriptReply();
				componentScriptReply.setComponent(component);
				componentScriptReply.setName(self.getName());
				componentScriptReply.setResponse(this.responseText);
				//Start the rendering timer
				if(renderTimer){
					renderTimer.start();
				}
				//The component has defined a callback to utilize instead of utilizing the functionality provided in this DataRequest implementation
				component.renderComponent(componentScriptReply);
			}
			else{
				if(status.toUpperCase() === "Z"){
					component.finalizeComponent(component.generateNoDataFoundHTML(), (component.isLineNumberIncluded() ? "(0)" : ""));
				}
				else if(status.toUpperCase() === "S"){
					//Update the subtitle to rendering
					component.updateSubLabel(i18n.discernabu.RENDERING_DATA + "...");
					//Start the rendering timer
					if(renderTimer){
						renderTimer.start();
					}
					//Call the generic component loading renderComponent function so the component can render its content.
					component.renderComponent(responseObj);
				}
				else{
					//All status's other than "S" and "Z" will be treated as a Failure status
					self.logScriptExecutionError(this);
					//Generate the error message from the request
					logger.logError(self.createErrorMessage(this));
					//Hander the error response on behalf of the component
					component.finalizeComponent(component.generateScriptFailureHTML(), (component.isLineNumberIncluded() ? "(0)" : ""));
				}
			}
		} 
		catch(err) {
			timersFailed = true;
			if(renderTimer) {
				renderTimer.fail();
			}
			if(loadTimer) {
				loadTimer.fail();
			}
			component.finalizeComponent(component.generateScriptFailureHTML(), (component.isLineNumberIncluded() ? "(0)" : ""));
		} 
		finally {
			if(renderTimer && !timersFailed) {
				renderTimer.stop();
			}
			if(loadTimer && !timersFailed) {
				loadTimer.stop();
			}
			//After the component has rendered call the postProcessing function to perform any additional actions
			component.postProcessing();
		}
	};
};/*globals DataRequest */

/**
 * @namespace
 * The DataRequestQueue is responsible for queuing up DataRequest instances.  It allows the consuming framework to 
 * limit the number of concurrent threads being processed.
 */
var DataRequestQueue = {
	m_threadPoolCount : 6,
	m_threadQueue : [],
	m_activeThreadsCnt: 0
};

/**
 * This function is utilized to alter the number of available threads within the consuming framework.  It is recommended that
 * this number be set prior to any thread executions.  However, there are no restrictions to altering this number at any time.
 * Once all threads are being consumed DataRequests are added to a queue in a first come first served basis.
 * @param {number} threadPoolCount The number of threads that the queue will allow at any one time.
 * @return null
 */
DataRequestQueue.setThreadPoolCount = function(threadPoolCount){
	if(typeof threadPoolCount !== "number" || threadPoolCount % 1 !== 0 || threadPoolCount <= 0){
		throw new Error("DataRequestQueue.setThreadPoolCount: threadPoolCount parameter should be of type number");
	}
	this.m_threadPoolCount = threadPoolCount;
};

/**
 * Adds a DataRequest object to the current queue of requests.  If there are no existing requests to be processed the newly
 * added request will be executed immediately.  If there are existing data requests they will be processed in a first come
 * first served bases. 
 * @param {DataRequest} requestObj The data request object to be processed once a thread is available
 * @return null
 */
DataRequestQueue.addRequest = function(requestObj){
	if(!(requestObj instanceof DataRequest)){
		throw new Error("DataRequestQueue.addRequest: Invalid request.  Request must be of data type DataRequest");
	}
	
	this.m_threadQueue.push(requestObj);
	//Check to see if we can execute the newly added request or not
	this.executeRequest();
};

/**
 * Attempts to execute the first data request that is on the front of the queue.  This function is called when a new 
 * DataRequest object is added to the queue as well as when one of the existing threads is relinquished by a previous
 * request.
 * @return null 
 */
DataRequestQueue.executeRequest = function(){
	var requestObj = null;
	//Compare active threads against threadPoolCount
	if(this.m_activeThreadsCnt < this.m_threadPoolCount){
		//A thread is available so execute the first DataRequest object if it exists
		requestObj = this.m_threadQueue.shift();
		if(requestObj){
			this.m_activeThreadsCnt++;
			requestObj.execute();
		}
	}
};

/**
 * This function is responsible for relinquishing a single thread and returning it back to the thread pool.  This 
 * should be called by all DataRequest implementations once the data request has completed.
 * @return null
 */
DataRequestQueue.relinquishThread = function(){
	if(this.m_activeThreadsCnt <= 0){
		//If we have an active thread count of 0 prior to relinquishing our thread we need to throw an error.
		throw new Error("DataRequestQueue.relinquishThread: thread pool invalid.  Too many threads relinquished.");
	}
	this.m_activeThreadsCnt--;
	//Start the next DataRequest on the queue if there is one
	this.executeRequest();
};

/*
 Blackbird - Open Source JavaScript Logging Utility
 Author: G Scott Olson
 Web: http://blackbirdjs.googlecode.com/
 http://www.gscottolson.com/blackbirdjs/
 Version: 1.0

 The MIT License - Copyright (c) 2008 Blackbird Project
 */
(function() {
    var NAMESPACE = 'log';
    var IE6_POSITION_FIXED = true; // enable IE6 {position:fixed}

    var bbird;
    var outputList;
    var cache = [];
    var loggingActive;
    var state = getState();
    var classes = {};
    var profiler = {};
    var IDs = {
        blackbird: 'blackbird',
        checkbox: 'bbVis',
        filters: 'bbFilters',
        controls: 'bbControls',
        size: 'bbSize'
    }
    var messageTypes = { //order of these properties imply render order of filter controls
        debug: true,
        info: true,
        warn: true,
        error: true,
        profile: true
    };

    function isLoggingActive() {
        return (state.active || loggingActive) ? true : false;
    }

    function generateMarkup() { //build markup
        var spans = [];
        for (type in messageTypes) {
            spans.push([ '<span class="', type, '" type="', type, '"></span>' ].join(''));
        }

        var newNode = document.createElement('DIV');
        newNode.id = IDs.blackbird;
        newNode.style.display = 'none';
        newNode.innerHTML = [
            '<div class="header">',
            '<div class="left">',
            '<div id="', IDs.filters, '" class="filters" title="click to filter by message type">', spans.join(''), '</div>',
            '</div>',
            '<div class="right">',
            '<div id="', IDs.controls, '" class="controls">',
            '<span id="', IDs.size, '" title="contract" op="resize"></span>',
            '<span class="clear" title="clear" op="clear"></span>',
            '<span class="close" title="close" op="close"></span>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="main">',
            '<div class="left"></div><div class="mainBody">',
            '<ol>', cache.join(''), '</ol>',
            '</div><div class="right"></div>',
            '</div>'/*,
             '<div class="footer">',
             '<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
             '<div class="right"></div>',
             '</div>'*/
        ].join('');
        return newNode;
    }

    function backgroundImage() { //(IE6 only) change <BODY> tag's background to resolve {position:fixed} support
        var bodyTag = document.getElementsByTagName('BODY')[ 0 ];

        if (bodyTag.currentStyle && IE6_POSITION_FIXED) {
            if (bodyTag.currentStyle.backgroundImage == 'none') {
                bodyTag.style.backgroundImage = 'url(about:blank)';
            }
            if (bodyTag.currentStyle.backgroundAttachment == 'scroll') {
                bodyTag.style.backgroundAttachment = 'fixed';
            }
        }
    }

    function addMessage(type, content) { //adds a message to the output list
        content = ( content.constructor == Array ) ? content.join('') : content;
        if (outputList) {
            var newMsg = document.createElement('LI');
            newMsg.className = type;
            newMsg.innerHTML = [ '<span class="icon"></span>', content ].join('');
            outputList.appendChild(newMsg);
            scrollToBottom();
        } else {
            cache.push([ '<li class="', type, '"><span class="icon"></span>', content, '</li>' ].join(''));
        }
    }

    function clear() { //clear list output
        outputList.innerHTML = '';
    }

    function clickControl(evt) {
        if (!evt) evt = window.event;
        var el = ( evt.target ) ? evt.target : evt.srcElement;

        if (el.tagName == 'SPAN') {
            switch (el.getAttributeNode('op').nodeValue) {
                case 'resize':
                    resize();
                    break;
                case 'clear':
                    clear();
                    break;
                case 'close':
                    hide();
                    break;
            }
        }
    }

    function clickFilter(evt) { //show/hide a specific message type
        if (!evt) evt = window.event;
        var span = ( evt.target ) ? evt.target : evt.srcElement;

        if (span && span.tagName == 'SPAN') {

            var type = span.getAttributeNode('type').nodeValue;

            if (evt.altKey) {
                var filters = document.getElementById(IDs.filters).getElementsByTagName('SPAN');

                var active = 0;
                for (entry in messageTypes) {
                    if (messageTypes[ entry ]) active++;
                }
                var oneActiveFilter = ( active == 1 && messageTypes[ type ] );

                for (var i = 0; filters[ i ]; i++) {
                    var spanType = filters[ i ].getAttributeNode('type').nodeValue;

                    filters[ i ].className = ( oneActiveFilter || ( spanType == type ) ) ? spanType : spanType + 'Disabled';
                    messageTypes[ spanType ] = oneActiveFilter || ( spanType == type );
                }
            }
            else {
                messageTypes[ type ] = !messageTypes[ type ];
                span.className = ( messageTypes[ type ] ) ? type : type + 'Disabled';
            }

            //build outputList's class from messageTypes object
            var disabledTypes = [];
            for (type in messageTypes) {
                if (!messageTypes[ type ]) disabledTypes.push(type);
            }
            disabledTypes.push('');
            outputList.className = disabledTypes.join('Hidden ');

            scrollToBottom();
        }
    }

    function clickVis(evt) {
        if (!evt) evt = window.event;
        var el = ( evt.target ) ? evt.target : evt.srcElement;

        state.load = el.checked;
        setState();
    }


    function scrollToBottom() { //scroll list output to the bottom
        outputList.scrollTop = outputList.scrollHeight;
    }

    function isVisible() { //determine the visibility
        return ( bbird.style.display == 'block' );
    }

    function hide() {
        bbird.style.display = 'none';
    }

    function show() {
        var body = document.getElementsByTagName('BODY')[ 0 ];
        body.removeChild(bbird);
        body.appendChild(bbird);
        bbird.style.display = 'block';
    }

    //sets the position
    function reposition(position) {
        if (position === undefined || position == null) {
            position = ( state && state.pos === null ) ? 1 : ( state.pos + 1 ) % 4; //set to initial position ('topRight') or move to next position
        }

        switch (position) {
            case 0:
                classes[ 0 ] = 'bbTopLeft';
                break;
            case 1:
                classes[ 0 ] = 'bbTopRight';
                break;
            case 2:
                classes[ 0 ] = 'bbBottomLeft';
                break;
            case 3:
                classes[ 0 ] = 'bbBottomRight';
                break;
        }
        state.pos = position;
        setState();
    }

    function resize(size) {
        if (size === undefined || size === null) {
            size = ( state && state.size == null ) ? 1 : ( state.size + 1 ) % 2;
        }

        classes[ 1 ] = ( size === 0 ) ? 'bbSmall' : 'bbLarge'

        var span = document.getElementById(IDs.size);
        span.title = ( size === 1 ) ? 'small' : 'large';
        span.className = span.title;

        state.size = size;
        setState();
        scrollToBottom();
    }

    function setLogging() {
        state.active = true;
        state.load = true;
        state.size = 1;
        setState();
    }

    function stopLogging() {
        state.active = false;
        state.load = false;
        state.size = 1;
        setState();
    }

    function setState() {
        var props = [];
        for (entry in state) {
            var value = ( state[ entry ] && state[ entry ].constructor === String ) ? '"' + state[ entry ] + '"' : state[ entry ];
            props.push('"' + entry + '"' + ':' + value);
        }
        props = props.join(',');

        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);
        document.cookie = [ 'blackbird={', props, '};' ].join('');

        var newClass = [];
        for (word in classes) {
            newClass.push(classes[ word ]);
        }
        //Check to see if the blackbird has been rendered before setting the className
        if (bbird) {
            bbird.className = newClass.join(' ');
        }
    }

    function getState() {
        var defState = { pos: null, size: null, load: null, active: null };
        var re = new RegExp(/blackbird=({[^;]+})(;|\b|$)/);
        var match = re.exec(document.cookie);

        try {
            return ( match && match[ 1 ] ) ? JSON.parse(match[ 1 ]) : defState;
        } catch (error) {
            return defState;
        }
    }

    //event handler for 'keyup' event for window
    function readKey(evt) {
        if (!evt) evt = window.event;
        var code = 113; //F2 key

        if (evt && evt.keyCode == code) {

            var visible = isVisible();

            if (visible && evt.shiftKey && evt.altKey) clear();
            else if (visible && evt.shiftKey) reposition();
            else if (!evt.shiftKey && !evt.altKey) {
                if (isLoggingActive()) {
                    ( visible ) ? hide() : show();
                }
            }
        }
    }

    //event management ( thanks John Resig )
    function addEvent(obj, type, fn) {
        var obj = ( obj.constructor === String ) ? document.getElementById(obj) : obj;
        if (obj.attachEvent) {
            obj[ 'e' + type + fn ] = fn;
            obj[ type + fn ] = function() {
                obj[ 'e' + type + fn ](window.event)
            };
            obj.attachEvent('on' + type, obj[ type + fn ]);
        } else obj.addEventListener(type, fn, false);
    }

    function removeEvent(obj, type, fn) {
        var obj = ( obj.constructor === String ) ? document.getElementById(obj) : obj;
        if (obj.detachEvent) {
            if (obj[ type + fn ] != undefined) {
                obj.detachEvent('on' + type, obj[ type + fn ]);
            }
            obj[ type + fn ] = null;
        } else {
            obj.removeEventListener(type, fn, false);
        }
    }

    window[ NAMESPACE ] = {
        toggle: function() {
            if (isLoggingActive()) {
                ( isVisible() ) ? hide() : show();
            }
        },
        resize: function() {
            resize();
        },
        clear: function() {
            clear();
        },
        move: function() {
            reposition();
        },
        debug: function(msg) {
            if (isLoggingActive()) {
                addMessage('debug', msg);
            }
        },
        warn: function(msg) {
            if (isLoggingActive()) {
                addMessage('warn', msg);
            }
        },
        info: function(msg) {
            if (isLoggingActive()) {
                addMessage('info', msg);
            }
        },
        error: function(msg) {
            if (isLoggingActive()) {
                addMessage('error', msg);
            }
        },
        activateLogging: function() {
            //Set the state.active to true
            setLogging();
        },
        /**
         * This will activate or deactivate logging without altering the state
         * of blackbird.
         * @param {boolean} isLoggingActive - A boolean indicating if logging
         * is to be activated.
         * @returns {undefined} Returns undefined.
         */
        setLoggingActive: function(isLoggingActive) {
            loggingActive = isLoggingActive;
        },
        disableLogging: function() {
            stopLogging();
        },
        profile: function(label) {
            var currentTime = new Date(); //record the current time when profile() is executed

            if (label == undefined || label == '') {
                addMessage('error', '<b>ERROR:</b> Please specify a label for your profile statement');
            }
            else if (profiler[ label ]) {
                addMessage('profile', [ label, ': ', currentTime - profiler[ label ], 'ms' ].join(''));
                delete profiler[ label ];
            }
            else {
                profiler[ label ] = currentTime;
                addMessage('profile', label);
            }
            return currentTime;
        },
        isBlackBirdActive: function() {
            return isLoggingActive();
        }
    }

    addEvent(window, 'load',
        /* initialize Blackbird when the page loads */
        function() {
            var body = document.getElementsByTagName('BODY')[ 0 ];
            bbird = body.appendChild(generateMarkup());
            outputList = bbird.getElementsByTagName('OL')[ 0 ];

            backgroundImage();

            //add events
            //addEvent( IDs.checkbox, 'click', clickVis );
            addEvent(IDs.filters, 'click', clickFilter);
            addEvent(IDs.controls, 'click', clickControl);
            addEvent(document, 'keyup', readKey);

            resize(state.size);
            reposition(state.pos);
            if (state.load) {
                show();
                //document.getElementById( IDs.checkbox ).checked = true;
            }

            scrollToBottom();

            window[ NAMESPACE ].init = function() {
                show();
                window[ NAMESPACE ].error([ '<b>', NAMESPACE, '</b> can only be initialized once' ]);
            }

            addEvent(window, 'unload', function() {
                //removeEvent( IDs.checkbox, 'click', clickVis );
                removeEvent(IDs.filters, 'click', clickFilter);
                removeEvent(IDs.controls, 'click', clickControl);
                removeEvent(document, 'keyup', readKey);
            });

            if (state.active) {
                //Prevent logging from occuring next reload
                loggingActive = true;
                state.active = false;
                state.load = false;
                state.size = 1;
                setState();
            }
        });
})();
/**
 * @class
 * This is the base Logger interface. It exposes the methods necessary for logging
 * but leaves specific implementation up to concrete implementations of a Logger.
 * @constructor
 */
function Logger() {
    this.m_activated = false;
    this.m_lineBreak = "";
}

/**
 * Returns a true/false value determining whether the Logger is currently active or not.
 * @returns {boolean} True if the logger is active, otherwise false.
 */
Logger.prototype.isActivated = function() {
    return this.m_activated;
};

/**
 * Sets whether the Logger is currently active or not.
 * @param {boolean} activated - Whether the Logger is currently activated or not.
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.setIsActivated = function(activated) {
    this.m_activated = activated;
};

/**
 * Sets the string to utilize for line breaks in the logging messages
 * @param {String} lineBreak - String to utilize for line breaks
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.setLineBreak = function(lineBreak) {
    this.m_lineBreak = lineBreak;
};

/**
 * Returns the string to utilize for line breaks in the logging messages
 * @returns {String} String to utilize for line breaks
 */
Logger.prototype.getLineBreak = function() {
    return this.m_lineBreak;
};

/**
 * This method will activate the logger. It sets the enabled state of the logger to true then stores the state in the
 * cookie.
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.activate = function() {
    if (this.isActivated()) {
        return;
    }
    //Make the call to update the logger prototype with actual logging function definitions
    if (this.isLoggingAvailable()) {
        this.addLoggingDefinitionsToPrototype();
    }
    this.setIsActivated(true);
};

/**
 * This method will add the necessary logging method implementations on the fly. This method will be implemented
 * by the sub-classes of the Logger.
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.addLoggingDefinitionsToPrototype = function() {
};

/**
 * Determines if logging is available. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @returns {boolean} Returns false.
 */
Logger.prototype.isLoggingAvailable = function() {
    return false;
};

/* eslint-disable no-unused-vars */
/**
 * Logs a message. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} message - The message to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logMessage = function(message) {
    return false;
};

/**
 * Logs a debug message. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} debug - The debug message to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logDebug = function(debug) {
    return false;
};

/**
 * Logs a warning. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} warning - The warning to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logWarning = function(warning) {
    return false;
};

/**
 * Logs an error. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} error - The error to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logError = function(error) {
    return false;
};

/**
 * Logs script call information.
 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
 * @param {ScriptRequest} request - The script request that was made.
 * @param {string} file - The JS file from which the script call was made.
 * @param {string} funcName - The name of the function.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logScriptCallInfo = function(component, request, file, funcName) {
    return false;
};

/**
 * Logs a script call error.
 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
 * @param {ScriptRequest} request - The script request that was made.
 * @param {string} file - The JS file from which the script call was made.
 * @param {string} funcName - The name of the function.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logScriptCallError = function(component, request, file, funcName) {
    return false;
};

/**
 * Logs a JavaScript error.
 * @param {Error} err - The error that occurred.
 * @param {MPageComponent} component - The component in which the error originated.
 * @param {string} file - The JS file from which the JavaScript error originated.
 * @param {string} funcName - The function from which the JavaScript error originated.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logJSError = function(err, component, file, funcName) {
    return false;
};

/**
 * Logs Discern Information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} objectName - The name of the object for which information is being logged.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logDiscernInfo = function(component, objectName, file, funcName) {
    return false;
};

/**
 * Logs MPages event information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} eventName - The name of the event that occurred.
 * @param {string} params - The parameters associated to the MPages event.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logMPagesEventInfo = function(component, eventName, params, file, funcName) {
    return false;
};

/**
 * Logs CCLNEWSESSIONWINDOW information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logCCLNewSessionWindowInfo = function(component, params, file, funcName) {
    return false;
};

/**
 * Logs timer information.
 * @param {string} timerName - The name of the timer.
 * @param {string} subTimerName - The sub timer name.
 * @param {string} timerType - The type of timer.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logTimerInfo = function(timerName, subTimerName, timerType, file, funcName) {
    return false;
};
/* eslint-enable no-unused-vars */

/**
 * Creates a single log message based on array of strings seperated by line breaks
 * @param  {Array<String>} messages Array of strings to display in logger
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.logMessages = function(messages) {
    if (!(messages instanceof Array)) {
        throw new Error("Logger.prototype.logMessages only accepts array arguments");
    }
    var fullMessageString = this.joinMessagesWithBreaks(messages);
    this.logMessage(fullMessageString);
};

/**
 * Logs an error containing all the passed messages seperated by line breaks
 * @param  {Array<String>}  messages Array of strings to display in logger
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.logErrors = function(messages) {
    if (!(messages instanceof Array)) {
        throw new Error("Logger.prototype.logErrors only accepts array arguments");
    }
    var fullMessageString = this.joinMessagesWithBreaks(messages);
    this.logError(fullMessageString);
};

/**
 * Creates a single log message based on array of strings seperated by line breaks
 * @param  {Array<String>} messages Array of strings to display in logger
 * @returns {String} String containing messages seperated by line breaks
 */
Logger.prototype.joinMessagesWithBreaks = function(messages) {
    if (!(messages instanceof Array)) {
        throw new Error("Logger.prototype.joinMessagesWithBreaks only accepts array arguments");
    }
    var lineBreak = this.getLineBreak();
    return messages.join(lineBreak);
};
/* global Logger, log */

/**
 * @class
 * This class is a sub-class of Logger and implements the interface methods. This implementation will
 * log all messages via Blackbird. This class serves as a wrapper (adaptor) which allows a cleaner interface
 * with Blackbird.
 * @constructor
 */
function BlackBirdLogger() {
    this.setLineBreak("<br />");
}
BlackBirdLogger.prototype = new Logger();
BlackBirdLogger.prototype.constructor = Logger;

BlackBirdLogger.prototype.addLoggingDefinitionsToPrototype = function() {
    /**
     * Logs a message out to the Blackbird logger.
     * @param {string} message - The message to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logMessage = function(message) {
        log.info(message);
    };

    /**
     * Logs a debug message out to the Blackbird logger.
     * @param {string} debug - The debug message to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logDebug = function(debug) {
        log.debug(debug);
    };

    /**
     * Logs a warning out to the Blackbird logger.
     * @param {string} warning - The warning to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logWarning = function(warning) {
        log.warn(warning);
    };

    /**
     * Logs an error out to the Blackbird logger.
     * @param {string} error - The error to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logError = function(error) {
        log.error(error);
    };

    /**
     * Logs script call information.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logScriptCallInfo = function(component, request, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText ].join(""));
    };

    /**
     * Logs a script call error.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logScriptCallError = function(component, request, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status ].join(""));
    };

    /**
     * Logs a JavaScript error.
     * @param {Error} err - The error that occurred.
     * @param {MPageComponent} component - The component in which the error originated.
     * @param {string} file - The JS file from which the JavaScript error originated.
     * @param {string} funcName - The function from which the JavaScript error originated.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logJSError = function(err, component, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description ].join(""));
    };

    /**
     * Logs Discern Information
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} objectName - The name of the object for which information is being logged.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logDiscernInfo = function(component, objectName, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName ].join(""));
    };

    /**
     * Logs MPages event information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} eventName - The name of the event that occurred.
     * @param {string} params - The parameters associated to the MPages event.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logMPagesEventInfo = function(component, eventName, params, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params ].join(""));
    };

    /**
     * Logs CCLNEWSESSIONWINDOW information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logCCLNewSessionWindowInfo = function(component, params, file, funcName) {
        this.logDebug([ "CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params ].join(""));
    };

    /**
     * Logs timer information.
     * @param {string} timerName - The name of the timer.
     * @param {string} subTimerName - The sub timer name.
     * @param {string} timerType - The type of timer.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logTimerInfo = function(timerName, subTimerName, timerType, file, funcName) {
        this.logDebug([ "Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName ].join(""));
    };
};

/**
 * Overrides the base activate method. This will call the base activate method then make the call to the
 * Blackbird logger object to activate it as well.
 * @returns {undefined} Returns undefined.
 */
BlackBirdLogger.prototype.activate = function() {
    Logger.prototype.activate.call(this);
    //Make the call to the actual Blackbird object to activate it
    log.activateLogging();
};

/**
 * Determines if Blackbird logging is available.
 * @returns {boolean} True if the blackbird global log object is available.
 */
BlackBirdLogger.prototype.isLoggingAvailable = function() {
    return (typeof log === "object");
};
/* global Logger */

/* eslint-disable no-console */
/**
 * @class
 * This class is a sub-class of Logger and implements the interface methods. This implementation will log
 * all messages to the native console via console.log(...).
 * @constructor
 */
function ConsoleLogger() {
    if (typeof console.debug === "undefined") {
        console.debug = console.log;
    }
    this.setLineBreak("\n");
}
ConsoleLogger.prototype = new Logger();
ConsoleLogger.prototype.constructor = Logger;

ConsoleLogger.prototype.addLoggingDefinitionsToPrototype = function() {
    /**
     * Logs a message out to the native console.
     * @param {string} message - The message to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logMessage = function(message) {
        console.log(message);
    };
    /**
     * Logs a debug message out to the native console. Note that Internet Explorer does not have console.debug, so a
     * check is performed to see if console.debug is defined. If not, console.debug is set to console.log.
     * @param {string} debug - The debug message to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logDebug = function(debug) {
        console.debug(debug);
    };
    /**
     * Logs a warning out to the native console.
     * @param {string} warning - The warning to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logWarning = function(warning) {
        console.warn(warning);
    };
    /**
     * Logs an error out to the native console.
     * @param {string} error - The error to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logError = function(error) {
        console.error(error);
    };
    /**
     * Logs script call information.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logScriptCallInfo = function(component, request, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nScript: ", request.url, "\nRequest: ", request.requestText, "\nReply: ", request.responseText ].join(""));
    };
    /**
     * Logs a script call error.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logScriptCallError = function(component, request, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nScript: ", request.url, "\nRequest: ", request.requestText, "\nReply: ", request.responseText, "\nStatus: ", request.status ].join(""));
    };
    /**
     * Logs a JavaScript error.
     * @param {Error} err - The error that occurred.
     * @param {MPageComponent} component - The component in which the error originated.
     * @param {string} file - The JS file from which the JavaScript error originated.
     * @param {string} funcName - The function from which the JavaScript error originated.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logJSError = function(err, component, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nJS Error", "\nMessage: ", err.message, "\nName: ", err.name, "\nNumber: ", (err.number & 0xFFFF), "\nDescription: ", err.description ].join(""));
    };
    /**
     * Logs Discern Information
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} objectName - The name of the object for which information is being logged.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logDiscernInfo = function(component, objectName, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nDiscern Object: ", objectName ].join(""));
    };
    /**
     * Logs MPages event information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} eventName - The name of the event that occurred.
     * @param {string} params - The parameters associated to the MPages event.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logMPagesEventInfo = function(component, eventName, params, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nMPAGES_EVENT: ", eventName, "\nParams: ", params ].join(""));
    };
    /**
     * Logs CCLNEWSESSIONWINDOW information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logCCLNewSessionWindowInfo = function(component, params, file, funcName) {
        this.logDebug([ "CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nParams: ", params ].join(""));
    };
    /**
     * Logs timer information.
     * @param {string} timerName - The name of the timer.
     * @param {string} subTimerName - The sub timer name.
     * @param {string} timerType - The type of timer.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logTimerInfo = function(timerName, subTimerName, timerType, file, funcName) {
        this.logDebug([ "Timer Name: ", timerName, "\nSubtime Name:  ", subTimerName, "\nTimer Type: ", timerType, "\nFile: ", file, "\nFunction: ", funcName ].join(""));
    };
};

/**
 * Determines if logging is available. This performs the check to see if the native console object exists.
 * @returns {boolean} True if the global console object is available.
 */
ConsoleLogger.prototype.isLoggingAvailable = function() {
    return (typeof console === "object");
};
/* eslint-enable no-console */
/**
 * Determine which type of logger to provide at a global level. If in the context of Millennium, use
 * BlackbirdLogger, otherwise use the ConsoleLogger.
 * @type {BlackBirdLogger | ConsoleLogger}
 */
window[ "logger" ] = (CERN_Platform.inMillenniumContext()) ? new BlackBirdLogger() : new ConsoleLogger();
(function() {
    var cookie = document.cookie;
    if (!cookie) {
        return;
    }
    var loggerSettingsRegex = new RegExp(/logger=({[^;]+})(;|\b|$)/);
    var loggerSettings = loggerSettingsRegex.exec(cookie);
    if (!loggerSettings || !loggerSettings.length) {
        return;
    }
    loggerSettings = JSON.parse(loggerSettings[ 1 ]);
    var wasEnabled = loggerSettings.enabled;
    if (wasEnabled === "true") {
        window.logger.activate();
    }
    //Force the logger cookie to be disabled.
    document.cookie = 'logger={"enabled":"false"}';
})();


/**
 * Listen for the CTRL+\ keypress and toggle the active state of the current Logger.
 * @param {Event} evt - The JavaScript keypress event that was triggered.
 * @returns {undefined} Returns undefined.
 */
document.onkeypress = function(evt) {
    if (!evt) {
        evt = window.event;
    }
    if (evt.ctrlKey == 1 && evt.keyCode == 28) {
        window.logger.activate();
        document.cookie = 'logger={"enabled":"true"}';
    }
};

