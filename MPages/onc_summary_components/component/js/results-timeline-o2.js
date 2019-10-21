/*globals  CERN_EventListener, PREGNANCY_BASE_UTIL_O1, MP_Util, CompSidePanel, ResultViewer, CapabilityTimer */

/**
 * @class
 */
function WorkflowResultTimelineStyle() {
	this.initByNamespace("rt-wf");
}

WorkflowResultTimelineStyle.prototype = new ComponentStyle();
WorkflowResultTimelineStyle.prototype.constructor = ComponentStyle;

/**
 * Workflow Result Timeline component
 * @class
 * @param {object} criterion Criterion object
 */
function WorkflowResultTimelineComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new WorkflowResultTimelineStyle());
	this.setIncludeLineNumber(false);
	//flag for resource required
	this.setResourceRequired(true);
	this.setComponentLoadTimerName("USR:MPG.RESULTTIMELINE.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.RESULTTIMELINE.O2 - render component");
	this.m_pregInfoResource = null;
	this.m_pregInfo = null;

	this.m_numOfWeeksInFirstTrimester = 0;
	this.m_numOfWeeksInSecondTrimester = 0;
	this.m_numOfWeeksInThirdTrimester = 0;
	this.m_weekDateArray = null;
	this.m_resultDateArray = null;

	this.m_sidePanel = null;
	this.m_showPanel = false;
	this.m_sidePanelContainer = null;
	this.m_outpatientVisitType = 0.0;
	this.m_inpatientVisitType = 0.0;
	this.m_observationTriageVisitType = 0.0;
	this.m_emergencyVisitType = 0.0;
	this.m_isValidVisitTypesMapped = true;
	this.m_labsMicrobiology = null;
	this.m_ultrasounds = null;
	this.m_noteTypes = null;
	this.m_procedures = false;
	this.m_medication = false;

	// Default value for all the date display if actual dates are not available.
	this.EMPTY_STRING = "--";
	this.INPATINET_VISIT_DAY_TYPE = {
		NONE: 0,
		ARRIVAL_DAY: 1,
		STAY: 2,
		DISCHARGE_DAY: 3,
		ARRIVED_DISCHARED: 4
	};

	this.m_currentEga = "";
	this.m_deliveryDate = "";
	this.m_deliveryDateDisply = "";

	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.retrieveComponentData, this);

}

WorkflowResultTimelineComponent.prototype = new MPageComponent();
WorkflowResultTimelineComponent.prototype.constructor = MPageComponent;

/*********** Get/Set methods **************************************************************/

/**
 * Get method to return pregnancy info object.
 * @returns {object} An object contains pregnancy related informations.
 */
WorkflowResultTimelineComponent.prototype.getPregencyInfo = function() {

	this.m_pregInfoResource = MP_Resources.getSharedResource("pregnancyInfo");

	if (this.m_pregInfoResource && this.m_pregInfoResource.isResourceAvailable()) {
		this.m_pregInfo = this.m_pregInfoResource.getResourceData();
	}

	return this.m_pregInfo;
};

/**
 *  This function sets the Outpatient Visit Type
 * @param {Array} outpatientVisitType Array of outpatient visit types
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setOutpatientVisitType = function(outpatientVisitType) {

	if (!( outpatientVisitType instanceof Array)) {
		throw new Error("Invalid outpatient VisitType");
	}

	if (!outpatientVisitType.length || outpatientVisitType.length > 1) {
		this.m_isValidVisitTypesMapped &= false;
	}
	else {
		// Get the first index value as it is suppose to be single value.
		this.m_outpatientVisitType = outpatientVisitType[0];
	}
};
/**
 *  This function returns the Outpatient Visits Type
 * @returns {Array} Array of outpatient visit types
 */
WorkflowResultTimelineComponent.prototype.getOutpatientVisitType = function() {
	return this.m_outpatientVisitType;
};

/**
 *  This function sets the Inpatient Visit Type
 * @param {Array} inpatientVisitType Array of inpatient visit types
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setInpatientVisitType = function(inpatientVisitType) {

	if (!( inpatientVisitType instanceof Array)) {
		throw new Error("Invalid inpatient VisitType");
	}

	if (!inpatientVisitType.length || inpatientVisitType.length > 1) {
		this.m_isValidVisitTypesMapped &= false;
	}
	else {
		// Get the first index value as it is suppose to be single value.
		this.m_inpatientVisitType = inpatientVisitType[0];
	}
};
/**
 *  This function returns the Inpatient Visits Type
 * @returns {Array} Array of inpatient visit types
 */
WorkflowResultTimelineComponent.prototype.getInpatientVisitType = function() {
	return this.m_inpatientVisitType;
};

/**
 *  This function sets the Observation/triage Visit Type
 * @param {Array} observationTriageVisitType Array of Observation/triage Visit Type
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setObservationTriageVisitType = function(observationTriageVisitType) {

	if (!( observationTriageVisitType instanceof Array)) {
		throw new Error("Invalid observationTriage VisitType");
	}

	if (!observationTriageVisitType.length || observationTriageVisitType.length > 1) {
		this.m_isValidVisitTypesMapped &= false;
	}
	else {
		// Get the first index value as it is suppose to be single value.
		this.m_observationTriageVisitType = observationTriageVisitType[0];
	}
};
/**
 *  This function returns the Observation/triage Visit Type
 * @returns {Array} Array of Observation/triage Visit Type
 */
WorkflowResultTimelineComponent.prototype.getObservationTriageVisitType = function() {
	return this.m_observationTriageVisitType;
};

/**
 *  This function sets the Emergency Visits Type
 * @param {Array} emergencyVisitType Array of emergency visit type
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setEmergencyVisitType = function(emergencyVisitType) {

	if (!( emergencyVisitType instanceof Array)) {
		throw new Error("Invalid emergency VisitType");
	}

	if (!emergencyVisitType.length || emergencyVisitType.length > 1) {
		this.m_isValidVisitTypesMapped &= false;
	}
	else {
		// Get the first index value as it is suppose to be single value.
		this.m_emergencyVisitType = emergencyVisitType[0];
	}
};
/**
 *  This function returns the Emergency Visit Type
 * @returns {Array} Array of Array of emergency visit type
 */
WorkflowResultTimelineComponent.prototype.getEmergencyVisitType = function() {
	return this.m_emergencyVisitType;
};

/**
 *  This function sets the labs and microbiology events
 * @param {Array} labsMicrobiology Array of labs and microbiology events
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setLabsMicrobiology = function(labsMicrobiology) {

	if (!( labsMicrobiology instanceof Array)) {
		throw new Error("Invalid labs/microbiology event sets");
	}
	this.m_labsMicrobiology = labsMicrobiology;
};

/**
 * This function returns events mapped for Labs and Microbiology
 * @returns {Array} Array of labs and microbiology events
 */
WorkflowResultTimelineComponent.prototype.getLabsMicrobiology = function() {
	return this.m_labsMicrobiology || [];
};

/**
 *  This function sets the ultrasound events
 * @param {Array} ultrasounds Array of ultrasound events
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setUltrasounds = function(ultrasounds) {

	if (!( ultrasounds instanceof Array)) {
		throw new Error("Invalid ultrasounds event sets");
	}

	this.m_ultrasounds = ultrasounds;
};

/**
 * This function returns events mapped for Ultrasounds.
 * @returns {Array} Array of ultrasound events
 */
WorkflowResultTimelineComponent.prototype.getUltrasounds = function() {
	return this.m_ultrasounds || [];
};

/**
 *  This function sets the note types for visits.
 * @param {Array} noteTypes Array of note types
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.setVisitNoteTypes = function(noteTypes) {

	if (!( noteTypes instanceof Array)) {
		throw new Error("Invalid note type event sets");
	}

	this.m_noteTypes = noteTypes;
};

/**
 * This function returns events mapped for Visit note types.
 * @returns {Array} Array of note types.
 */
WorkflowResultTimelineComponent.prototype.getVisitNoteTypes = function() {
	return this.m_noteTypes || [];
};

WorkflowResultTimelineComponent.prototype.setProceduresBool = function(procedures) {
	this.m_procedures = procedures;
};

WorkflowResultTimelineComponent.prototype.getProceduresBool = function() {
	return this.m_procedures;
};

WorkflowResultTimelineComponent.prototype.setMedicationBool = function(medication) {
	this.m_medication = medication;
};

WorkflowResultTimelineComponent.prototype.getMedicationBool = function() {
	return this.m_medication;
};

/**
 * Creates the filter mappings that will be used when loading this component bedrock settings.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.loadFilterMappings = function() {

	// Reset the flag for validating bedrock configuration for Visit Types.
	this.m_isValidVisitTypesMapped = true;

	// Add the filter mapping object for Outpatient Visits Type
	this.addFilterMappingObject("WF_PREG_RT_OUTPATIENT_VISIT", {
		setFunction: this.setOutpatientVisitType,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});
	// Add the filter mapping object for Inpatient Visits Type
	this.addFilterMappingObject("WF_PREG_RT_INPATIENT_VISIT", {
		setFunction: this.setInpatientVisitType,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});
	// Add the filter mapping object for Observation/Triage Visits Type
	this.addFilterMappingObject("WF_PREG_RT_OBSERVATION_VISIT", {
		setFunction: this.setObservationTriageVisitType,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});
	// Add the filter mapping object for Emergency Visits Type
	this.addFilterMappingObject("WF_PREG_RT_ED_VISIT", {
		setFunction: this.setEmergencyVisitType,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});
	// Add the filter mapping object for Labs and Microbiology
	this.addFilterMappingObject("WF_PREG_RT_LABS_MICROBIOLOGY", {
		setFunction: this.setLabsMicrobiology,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});
	// Add the filter mapping object for Ultrasounds
	this.addFilterMappingObject("WF_PREG_RT_ULTRASOUNDS", {
		setFunction: this.setUltrasounds,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});
	// Add the filter mapping object for note types for Visits.
	this.addFilterMappingObject("WF_PREG_RT_CLINICAL_DOC", {
		setFunction: this.setVisitNoteTypes,
		type: "Array",
		field: "PARENT_ENTITY_ID"
	});

	// Add the filter mapping object for procedures.
	this.addFilterMappingObject("WF_PREG_RT_TREATMENTS_PROCE", {
		setFunction: this.setProceduresBool,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	// Add the filter mapping object for procedures.
	this.addFilterMappingObject("WF_PREG_RT_TREATMENTS_MEDI", {
		setFunction: this.setMedicationBool,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
};

/*********** Overridden methods ***********************************************************/
/**
 * Method to retrieve the shared resource.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.RetrieveRequiredResources = function() {

	try {

		// Check to see if the pregnancyInfo object is available to use
		if (this.getPregencyInfo()) {
			this.retrieveComponentData();
		}
		else {
			// This component already listens for the pregnancyInfoAvailable event,
			// so it will load when the SharedResource is available
			/*eslint-disable new-cap*/
			PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
			/*eslint-enable new-cap*/
		}

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "RetrieveRequiredResources");
	}
};

/**
 * Overriding MPageComponent's retrieve method to get component information for rendering.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.retrieveComponentData = function() {

	try {
		var criterion = this.getCriterion();
		var component = this;

		if (!(this.validatePregancyInfo() && this.validateVisitTypeBedrockSettings())) {
			return;
		}

		var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());

		var request = new ComponentScriptRequest();
		var viewableEncounters = criterion.getPersonnelInfo().getViewableEncounters();
		viewableEncounters = viewableEncounters ? "value(" + viewableEncounters + ")" : "0.0";
		//Variable which indicates for Workflow Component.
		var wFIndicator = 1;

		request.setName("Result Time line data Request");
		request.setProgramName("MP_GET_RESULTS_TIMELINE");
		request.setComponent(this);

		/*eslint-disable new-cap*/
		request.setParameterArray(["^MINE^",
		// Person Id
		criterion.person_id + ".0",
		// Viewable Encounters
		viewableEncounters,
		// Provider Id
		criterion.provider_id + ".0",
		// Position cd
		criterion.position_cd + ".0",
		// PPR cd
		criterion.ppr_cd + ".0",
		// Pregnancy look back.
		this.getPregencyInfo().getLookBack(),
		// Labs/Micro event sets.
		MP_Util.CreateParamArray(this.getLabsMicrobiology(), 1),
		// Ultrasound event sets.
		MP_Util.CreateParamArray(this.getUltrasounds(), 1),
		// Array of visit types.
		MP_Util.CreateParamArray(this.getVisitTypeArray(), 1),
		// Note types for mapped visits.
		MP_Util.CreateParamArray(this.getVisitNoteTypes(), 1),
		// Flag for retrieving procedures.
		this.getProceduresBool() ? 1 : 0,
		// Flag for retrieving medications.
		this.getMedicationBool() ? 1 : 0,
		// flag to differentiat eworkflow component.
		wFIndicator]);
		/*eslint-enable new-cap*/

		request.setLoadTimer(loadTimer);
		request.setRenderTimer(renderTimer);
		request.setAsyncIndicator(true);
		request.performRequest();
		request.setResponseHandler(function(scriptReply) {

			if (scriptReply.getStatus() === "F") {
				/*eslint-disable new-cap*/
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
				/*eslint-enable new-cap*/
			}
			else {
				component.renderComponent(scriptReply.getResponse());
			}
		});

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "retrieveComponentData");
	}

};

/**
 * Overriding MPageComponent's retrieve method to get component information for rendering.
 * @returns {Array} Array of all the four visit types if mapped.
 */
WorkflowResultTimelineComponent.prototype.getVisitTypeArray = function() {

	// Get the value of all the four visit types.
	var inpatinetVisitType = this.getInpatientVisitType();
	var outpatinetVisitType = this.getOutpatientVisitType();
	var observationVisitType = this.getObservationTriageVisitType();
	var emergencyVisitType = this.getEmergencyVisitType();
	var visitTypes = [];

	if (inpatinetVisitType) {
		visitTypes.push(inpatinetVisitType);
	}
	if (outpatinetVisitType) {
		visitTypes.push(outpatinetVisitType);
	}

	if (observationVisitType) {
		visitTypes.push(observationVisitType);
	}

	if (emergencyVisitType) {
		visitTypes.push(emergencyVisitType);
	}

	return visitTypes;

};

/**
 * Overriding MPageComponent's renderComponent method to render Workflow Result Timeline Component .
 * @param {object} recordData JSON object contains all the information for rendering the component.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.renderComponent = function(recordData) {

	try {
		var compHtml = "";
		var compId = this.getComponentId();
		var compNS = this.getStyles().getNameSpace();

		this.processResultsForRender(recordData);

		//Html for top date banner.
		var bannerHtml = this.getDateBannerHtml();
		// Html for visit types legends.
		var visitTypeLegendHtml = this.getVisitTypeLegendHtml();

		// Html for result table contains left side label section and right side result data.
		var resultTableHtml = "<div id='" + compId + "resultsBody' class='rt-wf-component-container'><div id='" + compId + "resultTableBody' class='" + compNS + "-result-table-body'>" + this.getResultLabelHtml() + this.getResultDataHtml() + "</div></div>";

		compHtml = bannerHtml + visitTypeLegendHtml + resultTableHtml;

		/*eslint-disable new-cap*/
		MP_Util.Doc.FinalizeComponent(compHtml, this, "");

		this.dayListener();
	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "renderComponent");
	}

};

WorkflowResultTimelineComponent.prototype.updateCurrentDeliveryDayIndicator = function() {

	var currentDay = new Date();
	var compId = this.getComponentId();

	var $currDayColumn = $("#" + compId + currentDay.format("_mm_dd_yyyy"));
	var scrollContainerWidth = $("#" + compId + "scrollContainer").outerWidth();
	var bufferWidth = 2;

	if (this.m_deliveryDate) {

		var $deliveryBox = $("#" + compId + "deliveryBox");
		// Align the box to delivery day column.

		var deliveryDate = new Date();
		deliveryDate.setISO8601(this.m_deliveryDate);
		var $delvDayColumn = $("#" + compId + deliveryDate.format("_mm_dd_yyyy"));

		if ($delvDayColumn.length) {
			// set 2px border-right to indicate the orange line.
			$delvDayColumn.addClass("rt-wf-delivery-day-column");

			var delvColumnLeftPosition = $delvDayColumn.position().left;
			var deliveryBoxWidth = $deliveryBox.outerWidth();
			var delvDayMarginLeft = Math.max(delvColumnLeftPosition - deliveryBoxWidth / 2, 0);
			var maxDelvLeftMargin = scrollContainerWidth - (deliveryBoxWidth + bufferWidth);
			delvDayMarginLeft = Math.min(maxDelvLeftMargin, delvDayMarginLeft);

			$deliveryBox.css("margin-left", delvDayMarginLeft + "px");
		}
		else {

			$deliveryBox.html("&nbsp;");
			$deliveryBox.addClass("rt-wf-empty-box");

		}

		// Align the left side label section.
		$("#" + compId + "resultLabelSection").css("margin-top", "22px");
	}

	var $todayBox = $("#" + compId + "todayBox");

	if ($currDayColumn.length) {
		var currEga = $currDayColumn.attr("EGA");

		// set 2px border-right to indicate the orange line.
		$currDayColumn.addClass("rt-wf-today-column");
		//set current EGA in today's box.
		$("#" + compId + "todayEGA").html(currEga);

		var currColumnLeftPosition = $currDayColumn.position().left;
		var todayBoxWidth = $todayBox.outerWidth();
		var currDayMarginLeft = Math.max(currColumnLeftPosition - todayBoxWidth / 2, 0);
		var maxTodayLeftMargin = scrollContainerWidth - (todayBoxWidth + bufferWidth);
		currDayMarginLeft = Math.min(maxTodayLeftMargin, currDayMarginLeft);

		$todayBox.css("margin-left", currDayMarginLeft + "px");
		// Set the scroll to current day to focus on today.
		var $resultDataSection = $("#" + compId + "resultDataSection");
		var halfWidth = $resultDataSection.width() / 2;

		// If the position of today's column is after the centre of time line, just make to centre.
		// If not no need to set the scroll position.
		if (halfWidth < currDayMarginLeft) {
			currDayMarginLeft = currDayMarginLeft - halfWidth;
		}
		else {
			currDayMarginLeft = 0;
		}

		$resultDataSection.scrollLeft(currDayMarginLeft);

	}
	else {
		$todayBox.html("&nbsp;");
		$todayBox.addClass("rt-wf-empty-box");
	}
};

/**
 * Overriding MPageComponent's resizing method.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.resizeComponent = function() {

	MPageComponent.prototype.resizeComponent.call(this, null);

	if (this.m_sidePanel) {
		this.m_sidePanel.resizePanel();
	}
	
	this.updateCurrentDeliveryDayIndicator();
};

/*********** Component specific methods ***************************************************/

/**
 * validate the gender and pregnancy information of a patient.
 * @returns {Boolean} Return true if the patient is female , active pregnancy is there and EDD is documented properly.
 */
WorkflowResultTimelineComponent.prototype.validatePregancyInfo = function() {

	var isValidInfo = false;

	try {

		var resultTimelinei18n = i18n.discernabu.result_timeline_o2;

		// Check to make sure the patient is a female with an active pregnancy.
		// If the patient is Male patient,  just show a disclaimer.
		if (this.getCriterion().getPatientInfo().getSex().meaning !== "FEMALE") {
			var messageHtml = "<h3 class='info-hd'><span class='res-normal'>" + resultTimelinei18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + resultTimelinei18n.NOT_FEMALE + "</span>";
			/*eslint-disable new-cap*/
			MP_Util.Doc.FinalizeComponent(messageHtml, this, "");
			/*eslint-enable new-cap*/

			return isValidInfo;
		}

		var pregInfoObj = this.getPregencyInfo();

		if (pregInfoObj) {
			isValidInfo = this.validatePregnancyId(pregInfoObj) && this.validateEdd(pregInfoObj);
		}

		return isValidInfo;
	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "validatePregancyInfo");
		return false;
	}
};

/**
 * Validate the pregnancy id of a patient.A error message will be displayed in the component body if it s not 1.
 * @param {Array} pregInfoObj Array of pregnancy information.
 * @returns {Boolean} Return true if the patient has active pregnancy, or else return false.
 */
WorkflowResultTimelineComponent.prototype.validatePregnancyId = function(pregInfoObj) {

	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;
	var message = "";

	var pregId = pregInfoObj.getPregnancyId();

	if (pregId === 0) {
		//Female patient with no active pregnancy, show disclaimer.
		message = resultTimelinei18n.NO_ACTIVE_PREG;
	}
	else if (pregId === -1) {
		//Error occurred while retrieving pregnancy information
		message = resultTimelinei18n.PREG_DATA_ERROR;
	}

	if (message) {

		var messageHtml = "<h3 class='info-hd'><span class='res-normal'>" + message + "</span></h3><span class='res-none'>" + message + "</span>";
		/*eslint-disable new-cap*/
		MP_Util.Doc.FinalizeComponent(messageHtml, this, "");
		/*eslint-enable new-cap*/
		return false;
	}
	return true;
};

/**
 * Validate the bedrock settings for visit types.This function will return true if m_isValidVisitTypesMapped is true or else return
 * false and an error message will be displayed in the component body.
 * @returns {Boolean} Return true bedrock settings are proper, or else return false.
 */
WorkflowResultTimelineComponent.prototype.validateVisitTypeBedrockSettings = function() {
	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;

	// If the bedrock settings for visit types is not valid (any of the visit type array has more than one value), display warning message in component body.
	if (!this.m_isValidVisitTypesMapped) {
		var messageHtml = "<h3 class='info-hd'><span class='res-normal'>" + resultTimelinei18n.INCORRECT_BEDROCK_CONFIG + "</span></h3><span class='res-none'>" + resultTimelinei18n.INCORRECT_BEDROCK_CONFIG + "</span>";
		/*eslint-disable new-cap*/
		MP_Util.Doc.FinalizeComponent(messageHtml, this, "");
		return false;
		/*eslint-enable new-cap*/
	}

	return true;
};

/**
 * Validate the EDD documented for the patient.
 * If it is not documented, component body will be displayed with error message and function returns false.
 * @param {Array} pregInfoObj Array of pregnancy information.
 * @returns {Boolean} Return true if EDD documented, or else return false.
 */
WorkflowResultTimelineComponent.prototype.validateEdd = function(pregInfoObj) {

	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;

	if (pregInfoObj.getEddId() === 0) {
		// EDD is not added for the patient.
		var messageHtml = "<h3 class='info-hd'><span class='res-normal'>" + resultTimelinei18n.NO_EDD + "</span></h3><span class='res-none'>" + resultTimelinei18n.NO_EDD + "</span>";
		/*eslint-disable new-cap*/
		MP_Util.Doc.FinalizeComponent(messageHtml, this, "");
		/*eslint-enable new-cap*/
		return false;
	}

	return true;
};

/**
 * Method to return html for date banner section contains Onset date and EDD or Delivery date.
 * @return {string} Html for Onset date and EDD/Delivery date.
 */
WorkflowResultTimelineComponent.prototype.getDateBannerHtml = function() {

	try {

		var pregInfoObj = this.getPregencyInfo();
		var pregOnsetDate = pregInfoObj.getOnsetDate();
		var compNS = this.getStyles().getNameSpace();
		var deliveryDate = pregInfoObj.getDeliveryDate();
		var eddOrDeliveryDateHtml = "";

		// Format onset date.
		var pregOnsetDateDisplay = pregOnsetDate ? pregOnsetDate.format("mediumDate") : this.EMPTY_STRING;

		// Format due date
		if (deliveryDate === 0) {

			eddOrDeliveryDateHtml = this.getEddHtml(pregInfoObj.getEstDeliveryDate());
		}
		// Format delivery date, if actual delivery happened.
		else {
			eddOrDeliveryDateHtml = this.getDeliveryDateHtml(deliveryDate);
		}

		var onsetDateHtml = "<span class='" + compNS + "-onset-date-label'>" + i18n.discernabu.result_timeline_o2.ONSET_DATE + "</span><span class='" + compNS + "-date-value'>" + pregOnsetDateDisplay + "</span>";

		return "<div class='" + compNS + "-date-banner'>" + onsetDateHtml + eddOrDeliveryDateHtml + "</div>";
	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getDateBannerHtml");
		return "";
	}

};

/**
 * Method to return html for EDD.
 * @param {string} estDeliveryDateString Estimated delivery date documented.
 * @return {string} Html for EDD.
 */
WorkflowResultTimelineComponent.prototype.getEddHtml = function(estDeliveryDateString) {

	var eddString = this.EMPTY_STRING;

	if (estDeliveryDateString) {
		var estimatedDeliveryDate = new Date();
		estimatedDeliveryDate.setISO8601(estDeliveryDateString);
		eddString = estimatedDeliveryDate.format("mediumDate");
	}
	return "<span class='rt-wf-edd-date-label'>" + i18n.discernabu.result_timeline_o2.EDD + "</span><span class='rt-wf-date-value'>" + eddString + "</span>";

};

/**
 * Method to return html for delivery date.
 * @param {string} deliveryDate Actual delivery date documented.
 * @return {string} Html for delivery date.
 */
WorkflowResultTimelineComponent.prototype.getDeliveryDateHtml = function(deliveryDate) {

	var actualDeliveryDate = new Date();
	actualDeliveryDate.setISO8601(deliveryDate);
	this.m_deliveryDate = deliveryDate;
	// set the date for later use while rendering delivery box.
	this.m_deliveryDateDisply = actualDeliveryDate.format("shortDate2");

	return "<span class='rt-wf-edd-date-label'>" + i18n.discernabu.result_timeline_o2.DELIVERY_DATE + "</span><span class='rt-wf-date-value'>" + actualDeliveryDate.format("mediumDate") + "</span>";
};

/**
 * Method to return html for displaying legends for Visit Types.
 * @return {string} Html for Visit Type legends.
 */
WorkflowResultTimelineComponent.prototype.getVisitTypeLegendHtml = function() {

	try {
		var resultTimelinei18n = i18n.discernabu.result_timeline_o2;
		var compNS = this.getStyles().getNameSpace();
		var visitTypeHtml = "";

		// An array to store visit type name and respective class for the image.
		var visitTypeArray = [{
			VISIST_TYPE: resultTimelinei18n.OUTPATIENT,
			IMAGE_CLASS: compNS + "-outpatient-visit-image"
		}, {
			VISIST_TYPE: resultTimelinei18n.INPATIENT,
			IMAGE_CLASS: compNS + "-inpatient-visit-image"
		}, {
			VISIST_TYPE: resultTimelinei18n.OBSERVATION_TRIAGE,
			IMAGE_CLASS: compNS + "-observation-visit-image"
		}, {
			VISIST_TYPE: resultTimelinei18n.ED,
			IMAGE_CLASS: compNS + "-ed-visit-image"
		}];

		var visitTypeCount = visitTypeArray.length;

		// Get each visit type from the array and add create html.
		for (var index = 0; index < visitTypeCount; index++) {
			var visit = visitTypeArray[index];

			visitTypeHtml += "<span class='" + visit.IMAGE_CLASS + "'>" + "<span class='" + compNS + "-visit-type'>" + visit.VISIST_TYPE + "</span>" + "</span>";
		}

		return "<div class='" + compNS + "-visit-types-legend'>" + "<span class='" + compNS + "-visit-types-label'>" + resultTimelinei18n.VISIT_TYPES + "</span>" + visitTypeHtml + "</div>";

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getVisitTypeLegendHtml");
		return "";
	}
};

/**
 * Method to return html labels in the left side of result time line table.
 * @return {string} Html for left side label in the table.
 */
WorkflowResultTimelineComponent.prototype.getResultLabelHtml = function() {

	try {

		var compId = this.getComponentId();
		var compNS = this.getStyles().getNameSpace();
		var resultTimelinei18n = i18n.discernabu.result_timeline_o2;

		var labelHtml = "<div id='" + compId + "resultLabelSection' class='" + compNS + "-result-label-section'>" +
		// Empty row
		"<dl class='rt-wf-label-empty'><dd>&nbsp;</dd></dl>" +
		// Empty row
		"<dl class='rt-wf-empty-row'><dd>&nbsp;</dd></dl>" +
		// Gestational age label
		"<dl class='" + compNS + "-gestational-age'><dd>" + resultTimelinei18n.GESTATIONAL_AGE + "</dd></dl>" +
		// Week label
		"<dl class='" + compNS + "-gestational-age-week'><dd>" + resultTimelinei18n.WEEK_IN_PARENTHESES + "</dd></dl>" +
		// day ticks row
		"<dl class='" + compNS + "-label-day-ticks'><dd>&nbsp;</dd></dl>" +
		// Visits label
		"<dl class='" + compNS + "-result-label-visits'><dd>" + resultTimelinei18n.VISITS + "</dd></dl>" +
		// labs and Microbiology  label
		"<dl class='" + compNS + "-result-label'><dd>" + resultTimelinei18n.LABS_AND_MICRO + "</dd></dl>" +
		// Ultrasound label
		"<dl class='" + compNS + "-result-label'><dd>" + resultTimelinei18n.ULTRASOUNDS + "</dd></dl>" +
		// Monitoring episode label
		"<dl class='" + compNS + "-result-label'><dd>" + resultTimelinei18n.MONITORING_EPISODES + "</dd></dl>" +
		// Treatments label
		"<dl class='" + compNS + "-result-label'><dd>" + resultTimelinei18n.TREATMENTS + "</dd></dl>" + "</div>";

		return labelHtml;

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getResultLabelHtml");
		return "";
	}

};

/**
 * Method to return result table html . This function will create html for all the three trimesters and return it.
 * @return {string} Html for result table in all the 3 trimesters.
 */
WorkflowResultTimelineComponent.prototype.getResultDataHtml = function() {

	try {
		var compId = this.getComponentId();
		var compNS = this.getStyles().getNameSpace();
		var resultTimelinei18n = i18n.discernabu.result_timeline_o2;

		// Calculate the start and end week of each trimester based on number of weeks.
		var firstTrimesterStartWeek = 0;
		var firstTrimesterEndWeek = this.m_numOfWeeksInFirstTrimester;
		var secondTrimesterStartWeek = firstTrimesterEndWeek;
		var secondTrimesterEndWeek = this.m_numOfWeeksInFirstTrimester + this.m_numOfWeeksInSecondTrimester;
		var thirdTrimesterStartWeek = secondTrimesterEndWeek;
		var thirdTrimesterEndtWeek = this.m_numOfWeeksInFirstTrimester + this.m_numOfWeeksInSecondTrimester + this.m_numOfWeeksInThirdTrimester;
		var deliveryBoxHtml = this.m_deliveryDateDisply ? "<dl><div id='" + compId + "deliveryBox' class='rt-wf-delivery-box'><span class='rt-wf-box-label'>" + resultTimelinei18n.DELIVERY_DATE.replace(":", " - ") + "</span><span id='" + compId + "deliveryDate' class='rt-wf-box-value'>" + this.m_deliveryDateDisply + "</span></div></dl>" : "";

		// All the three trimesters will be in a scroll container.
		var resultDataHtml = "<div id='" + compId + "resultDataSection' class='" + compNS + "-result-data-section'>" + "<div id='" + compId + "scrollContainer' class='" + compNS + "-scroll-container'>" +
		// Delivery date box row
		deliveryBoxHtml +
		// Today's box row
		"<dl><div id='" + compId + "todayBox' class='rt-wf-today-box'><span class='rt-wf-box-label'>" + resultTimelinei18n.TODAY + " " + "</span><span id='" + compId + "todayEGA' class='rt-wf-box-value'>" + this.EMPTY_STRING + "</span></div></dl>" +
		// Get html for first trimester section.
		this.getTrimesterSectionHtml(resultTimelinei18n.TRIMESTER1, firstTrimesterStartWeek, firstTrimesterEndWeek, "rt-wf-trimester-odd") +
		// Get html for second trimester section.
		this.getTrimesterSectionHtml(resultTimelinei18n.TRIMESTER2, secondTrimesterStartWeek, secondTrimesterEndWeek, "rt-wf-trimester-even") +
		// Get html for third trimester section.
		this.getTrimesterSectionHtml(resultTimelinei18n.TRIMESTER3, thirdTrimesterStartWeek, thirdTrimesterEndtWeek, "rt-wf-trimester-odd") + "</div></div>";

		return resultDataHtml;
	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getResultDataHtml");
		return "";
	}
};

/**
 * Method to return result table html for single trimester.Here html for
 * Row 1 :- Trimester number display
 * Row 2 :- Generational age display
 * Row 3 :- Start date of each week
 * Row 4 :- 7 day ticks for each week
 * The result table section contains columns for each day.
 * @param {string} trimesterLabel Trimester number display
 * @param {number} startWeek Number of trimester start week.
 * @param {number} endWeek Number of trimester end week.
 * @param {string} bgColorClass CSS class name for the background color of trimester div.
 * @return {string} Html for result table in all the 3 trimesters.
 */
WorkflowResultTimelineComponent.prototype.getTrimesterSectionHtml = function(trimesterLabel, startWeek, endWeek, bgColorClass) {

	try {
		var compId = this.getComponentId();
		var compNS = this.getStyles().getNameSpace();

		var trimesterHtml = "<div id='" + compId + trimesterLabel + "' class='" + compNS + "-trimester-section'>" + "<dl><dd class='" + compNS + "-trimester-label " + bgColorClass + "'>" + trimesterLabel + "</dd></dl>" + "<dl class='" + compNS + "-gestational-age-row'>" + this.getGestationalAgeWeekRowHtml(startWeek, endWeek, true) + "</dl>" + "<dl class='" + compNS + "-week-row'>" + this.getGestationalAgeWeekRowHtml(startWeek, endWeek, false) + "</dl>" + "<dl class='" + compNS + "-day-ticks'>" + this.getDayTicksRowHtml(startWeek, endWeek) + "</dl>" + "<dl>" + this.getResultsValueRowHtml(startWeek, endWeek) + "</dl>" + "</div>";

		return trimesterHtml;

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getTrimesterSectionHtml");
		return "";
	}
};

/**
 * Method to return html for generational age or start date of each week.
 * @param {number} startWeek Number of trimester start week.
 * @param {number} endWeek Number of trimester end week.
 * @param {boolean} isAgeRow flag to differentiate whether the row is for displaying generational age or start date of each week.
 * @return {string} Html for generational age or start date of each week row of a trimester.
 */
WorkflowResultTimelineComponent.prototype.getGestationalAgeWeekRowHtml = function(startWeek, endWeek, isAgeRow) {

	try {
		var compNS = this.getStyles().getNameSpace();
		var ageHtml = "";
		var displayText = "";

		// Create html for generational age row or start date of each week based on the flag isAgeRow.
		// If isAgeRow is true add the letter "w" at the end of age, or else get the start day of each week from m_weekDateArray .
		for (var index = startWeek; index < endWeek; index++) {
			displayText = isAgeRow ? index + "w" : new Date(this.m_weekDateArray[index]).format("shortDate3");
			ageHtml += "<dd class='" + compNS + "-week-label'>" + displayText + "</dd>";

		}
		return ageHtml;

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getGestationalAgeWeekRowHtml");
		return "";
	}
};

/**
 * Method to return html for day ticks.
 * @param {number} startWeek Number of trimester start week.
 * @param {number} endWeek Number of trimester end week.
 * @return {string} Html for day ticks.
 */
WorkflowResultTimelineComponent.prototype.getDayTicksRowHtml = function(startWeek, endWeek) {

	try {
		var compNS = this.getStyles().getNameSpace();
		var tickHtml = "";

		for (var index = startWeek; index < endWeek; index++) {

			tickHtml += "<dd class='" + compNS + "-day-tick-column'>";

			var dayHtml = "";

			// No need to add day tick for 7th day as week column end border will be there.
			for (var dayIndex = 0; dayIndex < 6; dayIndex++) {
				dayHtml += "<span class='" + compNS + "-day-tick-cell'>&nbsp;</span>";
			}

			tickHtml += dayHtml + "</dd>";

		}

		return tickHtml;

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getGestationalAgeWeekRowHtml");
		return "";
	}
};

/**
 * Method to return html for result value table which contains vertical columns for each day.
 * @param {number} startWeek Number of trimester start week.
 * @param {number} endWeek Number of trimester end week.
 * @return {string} Html for result value table.
 */
WorkflowResultTimelineComponent.prototype.getResultsValueRowHtml = function(startWeek, endWeek) {

	try {
		var compNS = this.getStyles().getNameSpace();
		var compId = this.getComponentId();
		var resultHtml = "";

		// If m_weekDateArray is null or it doesn't' have date value till endWeek no need to proceed.
		if (!this.m_weekDateArray || endWeek > this.m_weekDateArray.length) {
			return resultHtml;
		}

		var dayShadeClass = compNS + "-day-value-shade";
		var resultClass = " " + compNS + "-has-result";

		// Take the start day of each week from the array, increment the date by 1 to get the next day.Add <dl> for 7 days which has the
		// property  "date_display" has value of respective date.<dd> will be
		for (var index = startWeek; index < endWeek; index++) {

			var weekDayDate = new Date(this.m_weekDateArray[index]);
			var weekHtml = "<dd class='" + compNS + "-week-column'>";

			for (var dayIndex = 0; dayIndex < 7; dayIndex++) {
				var weekDayDateDisplay = weekDayDate.format("shortDate2");
				var resultObject = this.m_resultDateArray[weekDayDateDisplay];
				var dayHtml = "";
				var dayClass = compNS + "-day-value";
				var isFutureDay = false;

				// Initialize the css class for each result row and based on the availability of result add the result shade class.
				var columnClass = " " + compNS + "-day-column";
				var labResultClass = dayShadeClass;
				var ultraSoundResultClass = dayShadeClass;
				var monitoringEpisodeResultClass = dayShadeClass;
				var treatmentResultClass = dayShadeClass;
				var currentEga = index + "w " + dayIndex + "d";

				var currentDay = new Date();

				// If the day is future day just add a grey background and no need to proceed with processing results.
				if (currentDay < weekDayDate) {
					columnClass += " rt-wf-future-day";
					isFutureDay = true;
				}
				else if (resultObject) {
					// Add the result column hover class since results exists.
					columnClass += " rt-wf-result-exist rt-wf-day-column-hover";
					labResultClass += resultObject.HAS_LAB_RESULTS ? resultClass : "";
					ultraSoundResultClass += resultObject.HAS_ULTRASOUND_RESULTS ? resultClass : "";
					monitoringEpisodeResultClass += resultObject.HAS_MONITORING_EPISODES ? resultClass : "";
					treatmentResultClass += resultObject.HAS_TREATMENT_PROCEDURES ? resultClass : "";

					resultObject.EGA_DISPLAY = currentEga;
				}

				// Create a column for each day in the week.
				dayHtml += "<dl date_display =" + weekDayDate.format("mm/dd/yyyy") + " EGA = '" + currentEga + "' class='" + columnClass + "' id ='" + compId + weekDayDate.format("_mm_dd_yyyy") + "' >" +
				// Day cell for Visit row.
				this.getVisitDayCellHtml(resultObject, isFutureDay) +
				// Day cell for Lab and Microbiology row.
				"<dd class='" + dayClass + "'><span class='" + labResultClass + "'>&nbsp;</span></dd>" +
				// Day cell for Ultrasound row.
				"<dd class='" + dayClass + "'><span class='" + ultraSoundResultClass + "'>&nbsp;</span></dd>" +
				// Day cell for Monitoring Episodes row.
				"<dd class='" + dayClass + "'><span class='" + monitoringEpisodeResultClass + "'>&nbsp;</span></dd>" +
				// Day cell for Treatments row.
				"<dd class='" + dayClass + "'><span class='" + treatmentResultClass + "'>&nbsp;</span></dd>" + "</dl>";

				weekHtml += dayHtml;
				weekDayDate.setDate(weekDayDate.getDate() + 1);
			}

			resultHtml += weekHtml + "</dd>";
		}

		return resultHtml;

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "getResultsValueRowHtml");
		return "";
	}
};

/**
 * Method to return html for visit cell.
 * @param {Array}  resultObject Array of informations of selected day.
 * @param {Boolean}  isFutureDay falg to indicate whether the day id future day or not.
 * @return {string} Html for visit cell.
 */
WorkflowResultTimelineComponent.prototype.getVisitDayCellHtml = function(resultObject, isFutureDay) {

	var outpatientVisitClass = "rt-wf-outpatient-visit";
	var inpatientVisitClass = "rt-wf-visit_type";
	var observationVisitClass = "rt-wf-visit_type";
	var emergencyVisitClass = "rt-wf-visit_type";
	var dayClass = "rt-wf-day-value";

	if (!isFutureDay && resultObject) {
		outpatientVisitClass += resultObject.HAS_OUTPATIENT_VISIT ? " rt-wf-outpatient-visit-image" : "";
		observationVisitClass += resultObject.HAS_OBSERVATION_VISIT ? " rt-wf-observation-visit-image" : "";
		emergencyVisitClass += resultObject.HAS_EMERGENCY_VISIT ? " rt-wf-ed-visit-image" : "";

		var visitDayType = resultObject.INPATINET_VISIT_DAY_TYPE;

		switch(visitDayType) {
			case this.INPATINET_VISIT_DAY_TYPE.ARRIVAL_DAY:
				inpatientVisitClass += " rt-wf-inpatient-arrival-day";
				break;
			case this.INPATINET_VISIT_DAY_TYPE.STAY:
				inpatientVisitClass += " rt-wf-inpatient-stay-day";
				break;
			case this.INPATINET_VISIT_DAY_TYPE.DISCHARGE_DAY:
				inpatientVisitClass += " rt-wf-inpatient-discharge-day";
				break;
			case this.INPATINET_VISIT_DAY_TYPE.ARRIVED_DISCHARED:
				inpatientVisitClass += " rt-wf-inpatient-visit-image";
				break;
		}
	}

	return "<dd class='" + dayClass + "'>" +
	// Add image for outpatient visit.
	"<span class='" + outpatientVisitClass + "'>&nbsp;</span>" +
	// Add image for observation visit.
	"<span class='" + observationVisitClass + "'>&nbsp;</span>" +
	// Add image for emergency visit.
	"<span class='" + emergencyVisitClass + "'>&nbsp;</span>" +
	// Add image for inpatient visit.
	"<span class='" + inpatientVisitClass + "'>&nbsp;</span>" + "</dd>";
};

/**
 * The method listens to the click events on the day columns and calls a method to create the side panel.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.dayListener = function() {
	var component = this;
	var compId = this.getComponentId();
	component.m_sidePanel = null;

	$(".rt-wf-result-exist").click(function() {
		var criterion = component.getCriterion();
		/*eslint-disable new-cap*/
		(new CapabilityTimer("CAP:MPG.RESULTTIMELINE.O2 - DAY SELECTION", criterion.category_mean)).capture();
		var capTimer = MP_Util.CreateTimer("CAP:MPG.RESULTTIMELINE.O2 - DAY SELECTION");

		if (capTimer) {
			capTimer.SubtimerName = criterion.category_mean;
			capTimer.Stop();
		}
		/*eslint-enable new-cap*/
		var tableId = compId + "resultTableBody";
		var compNS = component.getStyles().getNameSpace();
		var tableClass = compNS + "-result-table-body";

		var dateOfCol = $(this).attr("date_display");
		if (dateOfCol !== undefined) {
			var weekDayDate = new Date(dateOfCol);
			var weekDayDateDisplay = weekDayDate.format("shortDate2");
			var resultObject = component.m_resultDateArray[weekDayDateDisplay];
			if (resultObject) {
				$(".rt-wf-result-exist").removeClass("rt-wf-column-selected").addClass("rt-wf-day-column-hover");
				$(this).removeClass("rt-wf-day-column-hover").addClass("rt-wf-column-selected");
				$("#" + tableId).removeClass(tableClass).addClass("rt-wf-result-table-body-min");
				component.createSidePanel(resultObject, weekDayDate);
			}
		}
		if (component.m_deliveryDateDisply) {
			// Adjust the top of side panel with component top
			$("#" + compId + "sidePanelContainer").css("padding-top", "60px");
		}

		// scroll to selected column if the side panel opened for the first click .

		var leftPos = $(this).position().left;
		var $resultDataSection = $("#" + compId + "resultDataSection");
		var containerWidth = $resultDataSection.width();
		// Reset the scroll position if the selected column is not visible(which means position of column is greater than the width of container.).
		if (leftPos > containerWidth) {
			var currScrollPos = $resultDataSection.scrollLeft();
			// Display the selected column in the centre.
			// leftPos of selected column will be the position relative to the current scroll position.
			// So the new scroll position would be current scroll position plus difference from centrer of time line and selected column.
			var scrollLeftPos = currScrollPos + (leftPos - containerWidth / 2);
			$resultDataSection.scrollLeft(scrollLeftPos);
		}
	});

};

/**
 * The method creates the side panel for the results to display.
 * @param {object} resultObject - the result record for the selected day.
 * @param {object} weekDayDate- the date to be displayed for the day.
 * @returns {void}
 */
WorkflowResultTimelineComponent.prototype.createSidePanel = function(resultObject, weekDayDate) {
	var self = this;
	var compId = this.getComponentId();
	var sidePanelContId = compId + "sidePanelContainer";
	var sidePanelContainer = $("#" + sidePanelContId);
	this.m_sidePanelMinHeight = "175px";

	var tableId = compId + "resultTableBody";
	this.m_tableContainer = $("#" + tableId);

	// get current height of table
	var tableHeight = $("#" + tableId).css("height");

	if (!this.m_sidePanel) {

		if (!sidePanelContainer.length) {
			sidePanelContainer = $("<div id='" + sidePanelContId + "' class='rt-wf-side-panel'>&nbsp;</div>");
			$("#" + compId + "resultsBody").append(sidePanelContainer);
			sidePanelContainer.css("display", "inline-block");
		}

		this.m_sidePanel = new CompSidePanel(compId, sidePanelContId);
		this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
		
		// Overriding Sidepanel API's function to add some margin at the bottom.
		// A margin of 10px has been added to scroll container.
		self.m_sidePanel.showHideExpandBar = function() {

			if (this.m_usingUpdatedPanel && this.m_sidePanelObj[0].offsetHeight) {
				var sidePanelBody = document.getElementById("sidePanelBodyContents" + this.m_uniqueId);
				var visibleSidePanelHeight = this.m_sidePanelObj[0].offsetHeight;
				var titleHeight = this.m_sidePanelHeader[0].offsetHeight;
				var visibleBodyHeight = 0;
				if (titleHeight < visibleSidePanelHeight) {
					visibleBodyHeight = visibleSidePanelHeight - titleHeight;
				}
				else {
					this.m_expCollapseBarObj.removeClass("hidden");
				}

				if (visibleBodyHeight) {

					if (sidePanelBody.scrollHeight + 10 >= visibleBodyHeight) {
						this.m_expCollapseBarObj.removeClass("hidden");
					}
					else {
						this.m_expCollapseBarObj.addClass("hidden");
					}
				}
			}
		};

		// height of today's indicator
		var bufferHeight = 24;

		if (this.m_deliveryDateDisply) {
			// height of today's and delivery indicator 
			bufferHeight = 46;
		}

		tableHeight = parseInt(tableHeight, 10) - bufferHeight;
		this.m_sidePanel.setHeight(tableHeight + "px");

		this.m_sidePanel.setOffsetHeight(40);
		this.m_sidePanel.renderPreBuiltSidePanel();
		this.m_sidePanel.showCornerCloseButton();

		// Set the function that will be called when the close button on the side panel is clicked
		this.m_sidePanel.setCornerCloseFunction(function() {
			$(".rt-wf-result-exist").removeClass("rt-wf-column-selected").addClass("rt-wf-day-column-hover");
			var compNS = self.getStyles().getNameSpace();
			var tableClass = compNS + "-result-table-body";
			self.m_tableContainer.removeClass("rt-wf-result-table-body-min").addClass(tableClass);
			self.m_sidePanel = null;
		});
	}

	var sidePanelHTML = "<div id='sidePanelScrollContainer" + compId + "'>" + this.createVisitTypSection(resultObject) + this.createLabSection(resultObject) + this.createUltraSoundSection(resultObject) + this.createMonitoringEpisodeSection(resultObject) + this.createProceduresAndTreatmentSection(resultObject) + "</div>";

	this.m_sidePanel.setActionsAsHTML("<div class='rt-wf-side-panel-action-bar-date'>" + weekDayDate.format("mediumDate") + "</div>" + "<div class ='rt-wf-side-panel-ega'>" + resultObject.EGA_DISPLAY + "</div>");

	this.m_sidePanel.setContents(sidePanelHTML, "wf_alContent" + compId);

	// Hide the side panel title so that it will not over lapped with below section.
	$("#sidePanelHeaderText" + compId).addClass("hidden");

	$(".rt-wf-exp-col-btn").click(function() {
		var $expandCollapseIcon = $(this);
		var $detailsSection = $("#" + $expandCollapseIcon.attr("section_id"));

		if ($expandCollapseIcon.hasClass("rt-wf-hide-expand-btn")) {
			$expandCollapseIcon.removeClass("rt-wf-hide-expand-btn").addClass("rt-wf-show-expand-btn");
			$detailsSection.hide();
		}
		else {
			$expandCollapseIcon.removeClass("rt-wf-show-expand-btn").addClass("rt-wf-hide-expand-btn");
			$detailsSection.show();
		}
	});

	$(".rt-wf-res-viewer").click(function() {
		var eventId = $(this).attr("event_id");
		ResultViewer.launchAdHocViewer(parseInt(eventId, 10));
	});
};

/**
 * Method to return html of details of all the visit types.
 * @param {Array}  resultObject Array of informations of selected day.
 * @return {string} Html for visit details.
 */
WorkflowResultTimelineComponent.prototype.createVisitTypSection = function(resultObject) {

	if (!resultObject.HAS_VISITS) {
		return "";
	}

	var compId = this.getComponentId();

	// Get all outpatient visit details.
	var outpatinetVisitDetailsHtml = resultObject.HAS_OUTPATIENT_VISIT ? this.getVisitSectionHtml(resultObject.OUTPATIENT_VISIT_DATA) : "";

	// Get all inpatient visit details.
	var inpatinetVisitDetailsHtml = resultObject.HAS_INPATIENT_VISIT ? this.getVisitSectionHtml(resultObject.INPATIENT_VISIT_DATA) : "";

	// Get all observation visit details.
	var observationVisitDetailsHtml = resultObject.HAS_OBSERVATION_VISIT ? this.getVisitSectionHtml(resultObject.OBSERVATION_VISIT_DATA) : "";

	// Get all emergency visit details.
	var emergencyVisitDetailsHtml = resultObject.HAS_EMERGENCY_VISIT ? this.getVisitSectionHtml(resultObject.EMERGENCY_VISIT_DATA) : "";

	var visitCount = resultObject.OUTPATIENT_VISIT_DATA.length + resultObject.INPATIENT_VISIT_DATA.length + resultObject.OBSERVATION_VISIT_DATA.length + resultObject.EMERGENCY_VISIT_DATA.length;

	var expandCollapseHtml = "<div class='rt-wf-exp-col-btn rt-wf-hide-expand-btn' section_id='" + compId + "visitDetailsSection'>&nbsp;</div>";
	var sectionTitleHtml = "<div class='rt-wf-sp-section-header'>" + i18n.discernabu.result_timeline_o2.VISITS + " (" + visitCount + ")</div>";

	return "<div class='rt-wf-sp-section-container'>" + expandCollapseHtml + sectionTitleHtml + "<div id='" + compId + "visitDetailsSection'>" + outpatinetVisitDetailsHtml + inpatinetVisitDetailsHtml + observationVisitDetailsHtml + emergencyVisitDetailsHtml + "</div></div>";

};

/**
 * Method to return html of details of  single visit.
 * @param {Array}  visitTypeList Array of details of single visit.
 * @return {string} Html for visit details.
 */
WorkflowResultTimelineComponent.prototype.getVisitSectionHtml = function(visitTypeList) {

	// Get all emergency visit details.
	var visitCount = visitTypeList.length;
	var visitSectionHtml = "";
	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;

	for (var visitIndex = 0; visitIndex < visitCount; visitIndex++) {
		var visitObj = visitTypeList[visitIndex];

		var noteCount = visitObj.NOTES.length;
		var noteHtml = "";
		var noteObj = null;

		// Get the html for all the notes documented for the visit.
		// To avoid the comma for the last note, create html for all the notes except the last and
		// add the html for the last note after the for loop.
		for (var noteIndex = 0; noteIndex < noteCount - 1; noteIndex++) {
			noteObj = visitObj.NOTES[noteIndex];

			noteHtml += "<a href=# event_id ='" + noteObj.EVENT_ID + "' class=' rt-wf-res-viewer rt-wf-visit-note-title'>" + (noteObj.TITLE || noteObj.EVENT_CD_DISP) + "</a> , ";
		}

		if(noteCount)
		{
			// Get the object for last note.
			noteObj = visitObj.NOTES[noteCount - 1];

			noteHtml += "<a href=# event_id ='" + noteObj.EVENT_ID + "' class=' rt-wf-res-viewer rt-wf-visit-note-title'>" + (noteObj.TITLE || noteObj.EVENT_CD_DISP) + "</a>";
		}

		// Visit Type Name
		visitSectionHtml += "<div class='rt-wf-visit-type-name'> " + visitObj.ENCOUNTER_TYPE + " " + resultTimelinei18n.VISIT + "</div><div class='rt-wf-visit-details'>" +
		// Location details
		"<div><span class='rt-wf-visit-details-label'>" + resultTimelinei18n.LOCATION + "</span><span>" + visitObj.LOCATION + "</span></div>" +
		// Reason for Visit Details
		"<div><span class='rt-wf-visit-details-label'>" + resultTimelinei18n.REASON_FOR_VISIT + "</span><span>" + (visitObj.REASON_FOR_VISIT || this.EMPTY_STRING) + "</span></div>" +
		// Documented Note.
		"<div><span class='rt-wf-visit-details-label'>" + resultTimelinei18n.NOTES + " " + "</span>" + (noteHtml || this.EMPTY_STRING) + "</div></div>";
	}

	return visitSectionHtml;
};

/**
 * Method to return html of details of all the labs and microbiology details.
 * @param {Array}  resultObject Array of informations of selected day.
 * @return {string} Html of all the labs and microbiology details.
 */
WorkflowResultTimelineComponent.prototype.createLabSection = function(resultObject) {

	if (!resultObject.HAS_LAB_RESULTS) {
		return "";
	}

	var labsHTML = "";
	var labLength = resultObject.LAB_DATA.length;
	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;
	var compId = this.getComponentId();

	this.sortResults(resultObject.LAB_DATA);

	labsHTML += "<div class='rt-wf-sp-section-container'><div section_id ='" + compId + "labsResSection' class='rt-wf-exp-col-btn rt-wf-hide-expand-btn'>&nbsp;</div><div class='rt-wf-sp-section-header'>" + resultTimelinei18n.LABS_AND_MICRO + " (" + labLength + ")</div>";
	labsHTML += "<div class='rt-wf-labs-results-header' id='" + compId + "labsResSection'><dl><dt class = 'rt-wf-labs-first-column-header'>" + resultTimelinei18n.NAME + "</dt><dt class = 'rt-wf-labs-second-column-header'>" + resultTimelinei18n.RESULT + "</dt><dt class='rt-wf-labs-third-column-header'>" + resultTimelinei18n.TIME + "</dt>";
	labsHTML += "<div class='rt-wf-table-header-border'></div>";
	for (var i = 0; i < labLength; i++) {
		var labObj = resultObject.LAB_DATA[i];
		var date = new Date(labObj.DATE);
		if (labObj.RESULT === "Free Text Note" || labObj.RESULT === "") {
			labsHTML += "<dd class = 'rt-wf-labs-first-column-result'>" + labObj.NAME + "</dd><dd  class='rt-wf-labs-second-column-result rt-wf-comments-pic  rt-wf-res-viewer' event_id = '" + labObj.EVENT_ID + "'></dd><dd class = 'rt-wf-labs-third-column-result'>" + date.format("HH:MM") + "</dd>";
		}

		else {
			var resIndClass = "res-normal";
			switch (labObj.NORMALCY_DESC) {
				case "CRITICAL":
				case "EXTREMEHIGH":
				case "PANICHIGH":
				case "EXTREMELOW":
				case "PANICLOW":
				case "VABNORMAL":
				case "POSITIVE":
					resIndClass = "res-severe";
					break;
				case "HIGH":
					resIndClass = "res-high";
					break;
				case "LOW":
					resIndClass = "res-low";
					break;
				case "ABNORMAL":
					resIndClass = "res-abnormal";
					break;
				default:
					resIndClass = "res-normal";
					break;
			}

			resIndClass += " rt-wf-res-viewer";

			labsHTML += "<dd class = 'rt-wf-labs-first-column-result'>" + labObj.NAME + "</dd><dd class='rt-wf-labs-second-column-result " + resIndClass + "' event_id = '" + labObj.EVENT_ID + "'><span class='res-ind'></span><span class='" + resIndClass + "'>" + labObj.RESULT + "</span></dd><dd class = 'rt-wf-labs-third-column-result'>" + date.format("HH:MM") + "</dd>";
		}
	}

	labsHTML += "</dl></div>";
	labsHTML += "</div>";
	return labsHTML;
};

/**
 * Method to return html of details of all the ultrasound details.
 * @param {Array}  resultObject Array of informations of selected day.
 * @return {string} Html of all the ultrasound details.
 */
WorkflowResultTimelineComponent.prototype.createUltraSoundSection = function(resultObject) {
	var ultraSoundHTML = "";
	var ultraSoundLength = resultObject.ULTRA_SOUND_DATA.length;
	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;
	var compId = this.getComponentId();

	if (!resultObject.HAS_ULTRASOUND_RESULTS) {
		return ultraSoundHTML;
	}

	ultraSoundHTML += "<div class='rt-wf-sp-section-container'><div section_id='" + compId + "ultraSoundResSection' class='rt-wf-exp-col-btn rt-wf-exp-col-btn rt-wf-hide-expand-btn'></div><div class='rt-wf-ultrasound-header'>" + resultTimelinei18n.ULTRASOUNDS + " (" + ultraSoundLength + ")</div>";
	ultraSoundHTML += "<div id = '" + compId + "ultraSoundResSection'>";
	for (var i = 0; i < ultraSoundLength; i++) {
		var ultraSoundObj = resultObject.ULTRA_SOUND_DATA[i];

		ultraSoundHTML += "<div class='rt-wf-ultrasound-type-header'>" + resultTimelinei18n.TYPE + "<span class ='rt-wf-type-result'>" + ultraSoundObj.NAME + " </span></div>";
		ultraSoundHTML += "<div class='rt-wf-ultrasound-note-header'>" + resultTimelinei18n.NOTE + "<a href=# class ='rt-wf-note-result rt-wf-res-viewer' event_id = '" + ultraSoundObj.ID + "'>" + ultraSoundObj.NAME + "</a></div>";

	}
	ultraSoundHTML += "</div></div>";

	return ultraSoundHTML;
};

/**
 * Method to return html of details of monitoring episode details.
 * @param {Array}  resultObject Array of informations of selected day.
 * @return {string} Html of details of monitoring episode details.
 */
WorkflowResultTimelineComponent.prototype.createMonitoringEpisodeSection = function(resultObject) {

	var monitoringHTML = "";
	var monitoringLength = resultObject.MONITORING_EPISODES.length;
	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;
	var compId = this.getComponentId();

	if (!resultObject.HAS_MONITORING_EPISODES) {
		return monitoringHTML;
	}

	monitoringHTML += "<div class='rt-wf-sp-section-container'><div section_id='" + compId + "monitoringResSection' class='rt-wf-exp-col-btn rt-wf-hide-expand-btn'></div><div class='rt-wf-monitoring-header'>" + resultTimelinei18n.MONITORING_EPISODES + " (" + monitoringLength + ")</div>";
	monitoringHTML += "<div id ='" + compId + "monitoringResSection'>";
	for (var i = 0; i < monitoringLength; i++) {
		var monitoringObj = resultObject.MONITORING_EPISODES[i];
		var episodeStartTime = new Date(monitoringObj.EPISODESTARTDATE);
		var episodeEndTime = new Date(monitoringObj.EPISODEENDDATE);
		var episodeStartDate = monitoringObj.EPISODESTARTDATE;
		var episodeEndDate = monitoringObj.EPISODEENDDATE;

		var episodeStartDateDisplay = episodeStartDate ? episodeStartDate.format("mediumDate") : this.EMPTY_STRING;
		var episodeEndDateDisplay = episodeEndDate ? episodeEndDate.format("mediumDate") : this.EMPTY_STRING;

		if (monitoringObj.REASONFORMONITORING === "(NoReasonSpecified)") {
			monitoringObj.REASONFORMONITORING = this.EMPTY_STRING;
		}
		else {
			monitoringObj.REASONFORMONITORING = monitoringObj.REASONFORMONITORING;
		}
		monitoringHTML += "<div class='rt-wf-monitoring-reasons-header' >" + resultTimelinei18n.REASON_FOR_MONITORING + "<span class ='rt-wf-reasons-result'>" + monitoringObj.REASONFORMONITORING + " </span></div>";
		monitoringHTML += "<div class = 'rt-wf-main-start-end-div'><div class='rt-wf-monitoring-Start-header'>" + resultTimelinei18n.START + "<span class ='rt-wf-start-date-res'>" + episodeStartDateDisplay + " " + "</span><span class = 'rt-wf-start-time'>" + episodeStartTime.format("HH:MM") + "</span></div><div class ='rt-wf-monitoring-End-header'>" + resultTimelinei18n.END + "<span class ='rt-wf-start-date-res'>" + episodeEndDateDisplay + "</span><span class = 'rt-wf-end-time'>" + episodeEndTime.format("HH:MM") + "</span></div></div>";
	}

	monitoringHTML += "</div></div>";

	return monitoringHTML;

};

/**
 * Method to return html of details of treatments and procedures.
 * @param {Array}  resultObject Array of informations of selected day.
 * @return {string} Html of all the labs and microbiology details.
 */
WorkflowResultTimelineComponent.prototype.createProceduresAndTreatmentSection = function(resultObject) {

	if (!resultObject.HAS_TREATMENT_PROCEDURES) {
		return "";
	}

	var treatmentsHTML = "";
	var treatmentLength = resultObject.PROCEDURES_AND_TREATMENT_DATA.length;
	var resultTimelinei18n = i18n.discernabu.result_timeline_o2;
	var compId = this.getComponentId();
	treatmentsHTML += "<div class='rt-wf-sp-section-container'><div section_id ='" + compId + "treatmentsResSection' class='rt-wf-exp-col-btn rt-wf-hide-expand-btn'>&nbsp;</div><div class='rt-wf-sp-section-header'>" + resultTimelinei18n.TREATMENTS + " (" + treatmentLength + ")</div>";
	treatmentsHTML += "<div id='" + compId + "treatmentsResSection'><dl><dt class='rt-wf-treatments-results-name-header'>" + resultTimelinei18n.NAME + "</dt><dt class='rt-wf-treatments-results-time-header'>" + resultTimelinei18n.TIME + "</dt>";
	treatmentsHTML += "<div class='rt-wf-table-header-border'></div>";
	for (var i = 0; i < treatmentLength; i++) {
		var treatmentsObj = resultObject.PROCEDURES_AND_TREATMENT_DATA[i];
		var date = new Date(treatmentsObj.DATE);

		treatmentsHTML += "<dd class='rt-wf-treatments-results-name-res'>" + treatmentsObj.NAME + "</dd><dd class='rt-wf-treatments-results-time-res'>" + date.format("HH:MM") + "</dd>";

	}
	treatmentsHTML += "</dl></div>";
	treatmentsHTML += "</div>";
	return treatmentsHTML;
};

/**
 * The method sorts the results.
 *
 * @param  {array} results - holds the results to sort.
 * @returns {void}
 *
 */
WorkflowResultTimelineComponent.prototype.sortResults = function(results) {
	var temp;
	var resultsLength = results.length;
	for (var firstIndex = 0; firstIndex < resultsLength; firstIndex++) {
		var date1 = new Date(results[firstIndex].DATE);
		var dateFormatted1 = 0 + date1.format("HH:MM");
		for (var secondIndex = 0; secondIndex < resultsLength; secondIndex++) {
			var date2 = new Date(results[secondIndex].DATE);
			var dateFormatted2 = 0 + date2.format("HH:MM");
			if (dateFormatted1 > dateFormatted2) {
				temp = results[firstIndex];
				results[firstIndex] = results[secondIndex];
				results[secondIndex] = temp;
			}
		}
	}
};

/**
 * Function to process the reply structure for rendering the component.
 * @param {object} recordData JSON object contains all the information processing before rendering the component.
 * @return {void}
 */
WorkflowResultTimelineComponent.prototype.processResultsForRender = function(recordData) {

	try {

		this.setGestationalAgePreference(recordData.GESTATION_AGE_PREF);

		var totalWeeks = this.m_numOfWeeksInFirstTrimester + this.m_numOfWeeksInSecondTrimester + this.m_numOfWeeksInThirdTrimester;
		var incrementDate = new Date();
		// Set the start date of time line which would be a date before the look back days from current days.
		incrementDate.setDate(incrementDate.getDate() - this.getPregencyInfo().getRtLookBack());

		// Array to hold the starting date of each weeks.
		this.m_weekDateArray = [];

		// Add the start day of each week in an array as <key=weekNumber,value=start date> pair.
		for (var weekIndex = 0; weekIndex <= totalWeeks; weekIndex++) {
			var incrementDateDisplay = incrementDate.format("mm/dd/yyyy");

			this.m_weekDateArray[weekIndex] = incrementDateDisplay;
			// Increment the date by 7 to get the start date of next week.
			incrementDate.setDate(incrementDate.getDate() + 7);
		}

		// Array to hold results for each day as <key=date, value=result> pair
		this.m_resultDateArray = [];

		// Fetching Fetal Monitoring Episodes
		this.processMonitoringEpisodeDetails(recordData.FETALMONITORINGEPISODES);

		// Process the record data for rendering.

		this.processVisitTypeDetails(recordData.VISIT_TYPES_LIST);

		var resultCount = recordData.RESULT_LIST.length;

		for (var resultIndex = 0; resultIndex < resultCount; resultIndex++) {

			var result = recordData.RESULT_LIST[resultIndex];
			if (!result || !result.ROW_NAME || !result.EVENT_DT_TM) {
				continue;
			}

			var eventDate = new Date();
			eventDate.setISO8601(result.EVENT_DT_TM);
			var eventDateDisplay = eventDate.format("shortDate2");

			// Check whether the array has existing result value for the same day.If existing append to it or else initialize the array.
			var resultObject = this.m_resultDateArray[eventDateDisplay];
			if (!resultObject) {
				resultObject = this.initializeResultObject();
			}

			// If lab results are available, append to respective array.
			if (result.ROW_NAME === "Labs") {
				resultObject.HAS_LAB_RESULTS = true;
				resultObject.LAB_DATA.push({
					DATE: eventDate,
					NAME: result.EVENT_NAME,
					RESULT: result.RESULT_VAL,
					UNIT: result.RESULT_UNITS,
					LOW: result.NORMAL_LOW,
					HIGH: result.NORMAL_HIGH,
					NORMALCY: result.NORMALCY_FLG,
					NORMALCY_DESC: result.NORMALCY_DESCRIPTION,
					EVENT_ID: result.EVENT_ID
				});
			}

			// If ultrasound results are available, append to respective array.
			if (result.ROW_NAME === "Ultrasounds") {
				resultObject.HAS_ULTRASOUND_RESULTS = true;
				resultObject.ULTRA_SOUND_DATA.push({
					DATE: eventDate,
					NAME: result.EVENT_NAME,
					ID: result.EVENT_ID
				});
			}

			// If Treatment results are available, append to respective array.
			if (result.ROW_NAME === "Treatements") {
				resultObject.HAS_TREATMENT_PROCEDURES = true;
				resultObject.PROCEDURES_AND_TREATMENT_DATA.push({
					DATE: eventDate,
					NAME: result.EVENT_NAME
				});
			}

			this.m_resultDateArray[eventDateDisplay] = resultObject;

		}

	}
	catch(error) {
		logger.logJSError(error, this, "resulttimeline-o2.js", "processResultsForRender");
	}
};

/**
 * This methods set the numbers of weeks for each trimesters based on the value set for "gestational age" preference.
 * If the value is 40 the number of trimesters would be 13,14 and 16.
 * If the value is other than 40 or 41,set it to the default value 40.
 * @param {string} prefValue Value from Preference manager.
 * @return {void}
 */
WorkflowResultTimelineComponent.prototype.setGestationalAgePreference = function(prefValue) {

	if (prefValue === "41") {
		this.m_numOfWeeksInFirstTrimester = 15;
		this.m_numOfWeeksInSecondTrimester = 13;
		this.m_numOfWeeksInThirdTrimester = 15;
	}
	else {
		this.m_numOfWeeksInFirstTrimester = 13;
		this.m_numOfWeeksInSecondTrimester = 14;
		this.m_numOfWeeksInThirdTrimester = 16;
	}

};

/**
 * Function to process the visit type information for future rendering of visit details in the time line and side panel.
 * @param {object} VISIT_TYPES_LIST JSON object contains all the information about all the visits.
 * @return {void}
 */
WorkflowResultTimelineComponent.prototype.processVisitTypeDetails = function(VISIT_TYPES_LIST) {

	var visitCount = VISIT_TYPES_LIST.length;
	var oupatientVisitCd = this.getOutpatientVisitType();
	var inpatientVisitCd = this.getInpatientVisitType();
	var observationVisitCd = this.getObservationTriageVisitType();
	var emergencyVisitCd = this.getEmergencyVisitType();

	for (var visitIndex = 0; visitIndex < visitCount; visitIndex++) {

		var visitObj = VISIT_TYPES_LIST[visitIndex];

		if (!visitObj || !visitObj.ENCOUNTER_TYPE || !visitObj.VISIT_DT_TM) {
			continue;
		}

		var visitDate = new Date();
		visitDate.setISO8601(visitObj.VISIT_DT_TM);
		var visitDateDisplay = visitDate.format("shortDate2");

		// Check whether the array has existing result value for the same day.If existing append to it or else initialize the array.
		var resultObject = this.m_resultDateArray[visitDateDisplay];
		if (!resultObject) {
			resultObject = this.initializeResultObject();
		}

		if (visitObj.ENCOUNTER_TYPE_CD === oupatientVisitCd) {
			resultObject.HAS_OUTPATIENT_VISIT = true;
			resultObject.OUTPATIENT_VISIT_DATA.push(visitObj);
		}
		if (visitObj.ENCOUNTER_TYPE_CD === inpatientVisitCd) {
			this.processInpatientVisitDetails(resultObject, visitObj, visitDate);
			resultObject.HAS_INPATIENT_VISIT = true;
			resultObject.INPATIENT_VISIT_DATA.push(visitObj);
		}
		if (visitObj.ENCOUNTER_TYPE_CD === observationVisitCd) {
			resultObject.HAS_OBSERVATION_VISIT = true;
			resultObject.OBSERVATION_VISIT_DATA.push(visitObj);
		}
		if (visitObj.ENCOUNTER_TYPE_CD === emergencyVisitCd) {
			resultObject.HAS_EMERGENCY_VISIT = true;
			resultObject.EMERGENCY_VISIT_DATA.push(visitObj);
		}

		resultObject.HAS_VISITS = true;
		this.m_resultDateArray[visitDateDisplay] = resultObject;

	}

};

/**
 * Function to process the inpatient visit information for future rendering of details in the time line and side panel.
 * @param {Array}  resultObject Array of informations of selected day.
 * @param {object} visitObj Object having inpatient visit details.
 * @param {Date}  visitDate Object having inpatient visit details.
 * @return {void}
 */
WorkflowResultTimelineComponent.prototype.processInpatientVisitDetails = function(resultObject, visitObj, visitDate) {

	// Get the discharge date if documented.
	var dischargeDate = null;

	if (visitObj.DISCHARGE_DT_TM) {
		dischargeDate = new Date();
		dischargeDate.setISO8601(visitObj.DISCHARGE_DT_TM);
	}

	//Set visit day as arrival day. 
	resultObject.INPATINET_VISIT_DAY_TYPE = this.INPATINET_VISIT_DAY_TYPE.ARRIVAL_DAY;
	
	if (dischargeDate) {
		// If the arrival and discharge date are same.
		if (visitDate.toDateString() === dischargeDate.toDateString()) {
			resultObject.INPATINET_VISIT_DAY_TYPE = this.INPATINET_VISIT_DAY_TYPE.ARRIVED_DISCHARED;
		}
		else {
			// Get the result object array for discharge day,set the INPATINET_VISIT_DAY_TYPE and update to m_resultDateArray.
			var dichargeDateDisplay = dischargeDate.format("shortDate2");
			var dichargeDayResultObj = this.m_resultDateArray[dichargeDateDisplay];

			if (!dichargeDayResultObj) {
				dichargeDayResultObj = this.initializeResultObject();
			}

			dichargeDayResultObj.INPATINET_VISIT_DAY_TYPE = this.INPATINET_VISIT_DAY_TYPE.DISCHARGE_DAY;
			dichargeDayResultObj.HAS_VISITS = true;
			dichargeDayResultObj.HAS_INPATIENT_VISIT = true;
			dichargeDayResultObj.INPATIENT_VISIT_DATA.push(visitObj);
			this.m_resultDateArray[dichargeDateDisplay] = dichargeDayResultObj;
		}
	}
	else {
		// If no discharge date, till current day will be assumed as length of visit.
		dischargeDate = new Date();
	}

	
	// The days between arrival day and discharge day will be marked as length of visit.	
	// Starts iterate from the next day of visit till discharge date.
	var incrementDate = new Date(visitDate);
	incrementDate.setDate(incrementDate.getDate() + 1);

	while (incrementDate < dischargeDate) {
		// Take result object of each day and set the INPATINET_VISIT_DAY_TYPE.
		var incrementDateDisplay = incrementDate.format("shortDate2");
		var incDayResultObject = this.m_resultDateArray[incrementDateDisplay];
		// Check whether the array has existing result value for the same day.If existing append to it or else initialize the array.
		if (!incDayResultObject) {
			incDayResultObject = this.initializeResultObject();
		}

		incDayResultObject.INPATINET_VISIT_DAY_TYPE = this.INPATINET_VISIT_DAY_TYPE.STAY;
		incDayResultObject.HAS_VISITS = true;
		incDayResultObject.HAS_INPATIENT_VISIT = true;
		incDayResultObject.INPATIENT_VISIT_DATA.push(visitObj);
		this.m_resultDateArray[incrementDateDisplay] = incDayResultObject;
		incrementDate.setDate(incrementDate.getDate() + 1);
	}
};

/**
 * Function to process the monitoring episode details for future rendering in the time line and side panel.
 * @param {object} FETAL_MONITORING_EPISODESJSON JSON object contains all the information about all the visits.
 * @return {void}
 */
WorkflowResultTimelineComponent.prototype.processMonitoringEpisodeDetails = function(FETAL_MONITORING_EPISODESJSON) {

	if (!FETAL_MONITORING_EPISODESJSON) {
		return;
	}
	//Variable to hold the Fetal Monitoring Episodes.  fetal_Monitoring_episodesJSON
	var fetalMonitoringObj = JSON.parse(FETAL_MONITORING_EPISODESJSON);
	//Variable to hold the number of Episodes.
	var episodeLength = fetalMonitoringObj.RECORD_DATA.EPISODES.length;
	if (episodeLength > 0) {
		//Iterate through all Episodes.
		for (var episodeIndex = 0; episodeIndex < episodeLength; episodeIndex++) {
			var episodeResult = fetalMonitoringObj.RECORD_DATA.EPISODES[episodeIndex];
			var eventEpisodeStartDate = new Date();
			var eventEpisodeEndDate = new Date();

			eventEpisodeStartDate.setISO8601(episodeResult.INITIAL_DT_TM);
			eventEpisodeEndDate.setISO8601(episodeResult.COMPLETE_DT_TM);

			var reasonForMonitoring = episodeResult.REASON_FOR_MONITORING;

			var eventEpisodeDateDisplay = eventEpisodeStartDate.format("shortDate2");
			// Check whether the array has existing result value for the same day.If existing append to it or else initialize the array.
			var resultObject = this.m_resultDateArray[eventEpisodeDateDisplay];

			if (!resultObject) {
				resultObject = this.initializeResultObject();
			}

			resultObject.HAS_MONITORING_EPISODES = true;

			resultObject.MONITORING_EPISODES.push({
				EPISODESTARTDATE: eventEpisodeStartDate,
				EPISODEENDDATE: eventEpisodeEndDate,
				REASONFORMONITORING: reasonForMonitoring
			});
			this.m_resultDateArray[eventEpisodeDateDisplay] = resultObject;
		}
	}

};

/**
 * Function to initialize the result object which will be used to store all the informations of a day.
 * @return {void}
 */
WorkflowResultTimelineComponent.prototype.initializeResultObject = function() {

	return {
		HAS_VISITS: false,
		HAS_LAB_RESULTS: false,
		HAS_ULTRASOUND_RESULTS: false,
		HAS_MONITORING_EPISODES: false,
		HAS_TREATMENT_PROCEDURES: false,
		HAS_OUTPATIENT_VISIT: false,
		HAS_INPATIENT_VISIT: false,
		INPATINET_VISIT_DAY_TYPE: this.INPATINET_VISIT_DAY_TYPE.NONE,
		HAS_OBSERVATION_VISIT: false,
		HAS_EMERGENCY_VISIT: false,
		OUTPATIENT_VISIT_DATA: [],
		INPATIENT_VISIT_DATA: [],
		OBSERVATION_VISIT_DATA: [],
		EMERGENCY_VISIT_DATA: [],
		LAB_DATA: [],
		ULTRA_SOUND_DATA: [],
		MONITORING_EPISODES: [],
		PROCEDURES_AND_TREATMENT_DATA: []
	};
};

/**
 * Map the WorkflowResultTimelineComponent object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_PREG_RT" filter
 */
MP_Util.setObjectDefinitionMapping("WF_PREG_RT", WorkflowResultTimelineComponent);
